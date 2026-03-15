import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { senha } = await req.json()

    const senhaCorreta = Deno.env.get("ADMIN_PASSWORD")
    if (!senhaCorreta || !senha || senha !== senhaCorreta) {
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
        admin: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 horas
      },
      key
    )

    return new Response(
      JSON.stringify({ token }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (_err) {
    return new Response(
      JSON.stringify({ erro: "Erro interno." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
