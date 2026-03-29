const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const PROMPT = `Analise a foto do rótulo deste vinho.

1. Identifique o vinho com o máximo de detalhe possível: nome, produtor, safra, região.
2. Com base no vinho identificado, inclua pontuações conhecidas de críticos renomados se disponíveis.

Regras obrigatórias:
- NÃO invente pontuações. Se não tiver confiança, omita.
- Se não conseguir identificar o vinho claramente, retorne vinhoIdentificado: null.
- Retorne EXCLUSIVAMENTE JSON válido, sem texto adicional.

Formato de resposta:
{
  "vinhoIdentificado": {
    "nome": "nome do vinho",
    "produtor": "nome do produtor",
    "safra": "ano ou null",
    "regiao": "região/denominação ou null"
  },
  "notas": [
    {
      "fonte": "Robert Parker",
      "pontuacao": "94/100",
      "notas": "Descrição breve das notas de degustação (máx 200 caracteres)",
      "url": null
    }
  ]
}`

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { imagemBase64, mimeType } = await req.json()

    if (!imagemBase64) {
      return new Response(
        JSON.stringify({ erro: "imagemBase64 é obrigatório." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

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
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType ?? "image/jpeg",
                  data: imagemBase64,
                },
              },
              {
                type: "text",
                text: PROMPT,
              },
            ],
          },
        ],
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
      resultado = { vinhoIdentificado: null, notas: [] }
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
