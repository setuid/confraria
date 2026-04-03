import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { image_base64, garrafa_id } = await req.json()

    if (!image_base64 || !garrafa_id) {
      return new Response(
        JSON.stringify({ erro: "image_base64 e garrafa_id são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 1. Buscar contexto da garrafa
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data: garrafa, error: garrafaError } = await supabase
      .from("garrafas")
      .select("nome, tipo, produtor, safra, cego")
      .eq("id", garrafa_id)
      .single()

    if (garrafaError || !garrafa) {
      return new Response(
        JSON.stringify({ erro: "Garrafa não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const contexto = garrafa.cego
      ? `Vinho em modo cego (tipo: ${garrafa.tipo ?? "desconhecido"})`
      : [
          garrafa.nome,
          garrafa.produtor,
          garrafa.safra ? `(${garrafa.safra})` : null,
          `tipo: ${garrafa.tipo ?? "desconhecido"}`,
        ]
          .filter(Boolean)
          .join(" — ")

    // 2. Determinar media_type a partir do prefixo base64
    let media_type: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg"
    if (image_base64.startsWith("iVBOR")) media_type = "image/png"
    else if (image_base64.startsWith("UklGR")) media_type = "image/webp"

    // 3. Chamar Claude Vision
    const prompt = `Esta é uma ficha de degustação de vinho preenchida à mão para: ${contexto}.

A ficha tem checkboxes e círculos marcados à mão com caneta. Extrai todos os valores assinalados.

Secções e valores possíveis:

VISUAL
- cor: violeta | púrpura | rubi | cereja | granada | carmim | tijolo | palha | dourado | âmbar | rosé | salmão | cerise
- intensidade: pálido | médio | profundo
- limpidez: límpido | turvo

NARIZ
- intensidade: fechado | sutil | médio | pronunciado
- aromas (podem ser vários): morango, cereja, framboesa, romã, amora, mirtilo, ameixa, cassis, rosa, violeta, jasmim, lavanda, pimenta, canela, baunilha, cedro, café, chocolate, terra, mineral, couro, cogumelo, mel, defumado

BOCA
- doçura: seco | meio-seco | doce
- acidez: número de 1 a 5
- tanino: número de 1 a 5 (pode estar em branco para brancos)
- corpo: leve | médio | encorpado
- final: curto | médio | longo

CONCLUSÃO
- nota: número de 0 a 5 (pode ser escrito ou representado por estrelas)
- potencial: agora | 1-3 | 3-7 | 7-12 | 12-20 | 20+
- notas: texto livre escrito à mão (transcreve literalmente)

Responde APENAS com JSON válido, sem texto extra, markdown ou explicações:

{
  "nota": <número 0.0–5.0 ou null>,
  "ficha": {
    "visual": {
      "cor": "<valor ou null>",
      "intensidade": "<valor ou null>",
      "limpidez": "<valor ou null>"
    },
    "nariz": {
      "intensidade": "<valor ou null>",
      "aromas": ["<aroma>"]
    },
    "boca": {
      "doçura": "<valor ou null>",
      "acidez": <1–5 ou null>,
      "tanino": <1–5 ou null>,
      "corpo": "<valor ou null>",
      "final": "<valor ou null>"
    },
    "conclusao": {
      "potencial": "<valor ou null>",
      "notas": "<texto ou ''>"
    }
  }
}`

    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
        "anthropic-version": "2023-06-01",
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
                source: { type: "base64", media_type, data: image_base64 },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    })

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text()
      return new Response(
        JSON.stringify({ erro: `Erro ao chamar Claude: ${err}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const anthropicData = await anthropicResp.json()
    const rawText = anthropicData.content?.[0]?.text?.trim() ?? ""

    // Remove blocos de markdown se o Claude os incluir (```json ... ```)
    const jsonText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      console.error("JSON parse failed. Raw:", rawText)
      return new Response(
        JSON.stringify({ erro: "Resposta inválida do Claude", raw: rawText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("ler-ficha error:", err)
    return new Response(
      JSON.stringify({ erro: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
