import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import bcrypt from "npm:bcryptjs"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { nome, slug, descricao, senha } = await req.json()

    if (!nome || !slug || !senha) {
      return new Response(
        JSON.stringify({ erro: "Nome, slug e senha são obrigatórios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data, error } = await supabase
      .from("confrarias")
      .insert({ nome, slug, descricao, senha_hash: senhaHash })
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ erro: error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ confraria: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ erro: "Erro interno." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
