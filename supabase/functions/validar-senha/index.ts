import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
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
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    )

    const token = await create(
      { alg: "HS256", typ: "JWT" },
      {
        confraria_id: confraria.id,
        slug: confraria.slug,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 dias
      },
      key
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
  } catch (err) {
    return new Response(
      JSON.stringify({ erro: "Erro interno." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
