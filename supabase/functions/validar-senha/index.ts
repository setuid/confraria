import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import bcrypt from "npm:bcryptjs"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function strToBase64Url(str: string): string {
  return toBase64Url(new TextEncoder().encode(str))
}

async function criarJWT(payload: object, secret: string): Promise<string> {
  const header = strToBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = strToBase64Url(JSON.stringify(payload))
  const data = `${header}.${body}`

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
  return `${data}.${toBase64Url(new Uint8Array(sig))}`
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { slug, senha } = await req.json()

    if (!slug || !senha) {
      return new Response(
        JSON.stringify({ erro: "Slug e senha são obrigatórios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data: confraria, error } = await supabase
      .from("confrarias")
      .select("id, nome, slug, senha_hash, ativa")
      .eq("slug", slug)
      .eq("ativa", true)
      .single()

    if (error || !confraria) {
      return new Response(
        JSON.stringify({ erro: "Confraria não encontrada." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const senhaCorreta = await bcrypt.compare(senha, confraria.senha_hash)

    if (!senhaCorreta) {
      return new Response(
        JSON.stringify({ erro: "Senha errada." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const jwtSecret = Deno.env.get("JWT_SECRET")!
    const token = await criarJWT(
      {
        confraria_id: confraria.id,
        slug: confraria.slug,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      },
      jwtSecret
    )

    return new Response(
      JSON.stringify({
        token,
        confraria: {
          id: confraria.id,
          nome: confraria.nome,
          slug: confraria.slug,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (_err) {
    return new Response(
      JSON.stringify({ erro: "Erro interno." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
