const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const PROMPT_SISTEMA = `Você é um especialista em vinhos com amplo conhecimento de pontuações de críticos internacionais.
Dado um vinho, retorne pontuações e notas de degustação conhecidas de críticos renomados e/ou do produtor.

IMPORTANTE:
- Inclua SOMENTE informações sobre as quais você tem confiança razoável.
- Se o vinho não for suficientemente conhecido, retorne um array vazio.
- NÃO invente ou estime pontuações — prefira omitir a arriscar dados incorretos.
- Retorne EXCLUSIVAMENTE JSON válido, sem texto adicional.

Fontes válidas: Robert Parker (Wine Advocate), James Suckling, Decanter, Wine Spectator,
Wine Enthusiast, Jancis Robinson, Vinous, Falstaff, e notas do próprio produtor.

Formato de resposta:
{
  "notas": [
    {
      "fonte": "Robert Parker",
      "pontuacao": "94/100",
      "notas": "Breve descrição das notas de degustação do crítico (máx 200 caracteres)",
      "url": null
    }
  ]
}`

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { nome, produtor, safra, regiao, tipo } = await req.json()

    if (!nome) {
      return new Response(
        JSON.stringify({ erro: "Nome do vinho é obrigatório." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const partes = [
      `Nome: ${nome}`,
      produtor ? `Produtor: ${produtor}` : null,
      safra    ? `Safra: ${safra}`        : null,
      regiao   ? `Região: ${regiao}`      : null,
      tipo     ? `Tipo: ${tipo}`          : null,
    ].filter(Boolean).join("\n")

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ erro: "ANTHROPIC_API_KEY não configurado." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: PROMPT_SISTEMA,
        messages: [{ role: "user", content: partes }],
      }),
    })

    if (!resp.ok) {
      const err = await resp.text()
      return new Response(
        JSON.stringify({ erro: "Erro na API Anthropic: " + err }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const data = await resp.json()
    const texto = data?.content?.[0]?.text ?? "{}"

    let resultado
    try {
      resultado = JSON.parse(texto)
    } catch {
      resultado = { notas: [] }
    }

    return new Response(
      JSON.stringify(resultado),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ erro: "Erro interno." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
