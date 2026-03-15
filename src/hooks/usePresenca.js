import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function usePresenca() {
  const [carregando, setCarregando] = useState(false)

  async function atualizar(encontroId, apelido, status) {
    setCarregando(true)
    const { error } = await supabase
      .from('presencas')
      .upsert(
        {
          encontro_id: encontroId,
          apelido,
          status,
          atualizado_em: new Date().toISOString(),
        },
        { onConflict: 'encontro_id,apelido' }
      )
    setCarregando(false)
    return !error
  }

  return { atualizar, carregando }
}
