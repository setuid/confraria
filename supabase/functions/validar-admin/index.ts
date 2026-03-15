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
    const { senha } = await req.json()

    const senhaCorreta = Deno.env.get("ADMIN_PASSWORD")
    if (!senhaCorreta || !senha || senha !== senhaCorreta) {
      return new Response(
        JSON.stringify({ erro: "Senha errada." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const jwtSecret = Deno.env.get("JWT_SECRET")!
    const token = await criarJWT(
      {
        admin: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      },
      jwtSecret
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
