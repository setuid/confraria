import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './GarrafasOrdenar.module.css'

const TIPO_CORES = {
  tinto: '#8B2035',
  branco: '#C8973A',
  'rosé': '#C07070',
  espumante: '#A0B8A0',
  sobremesa: '#C09040',
  outro: '#808080',
}

function ItemOrdenavel({ garrafa, sessaoApelido }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: garrafa.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }
  const isCegoParaMim = garrafa.cego && garrafa.apelido !== sessaoApelido
  const nome = isCegoParaMim ? 'Vinho Misterioso' : garrafa.nome

  return (
    <div ref={setNodeRef} style={style} className={`${styles.item} ${isDragging ? styles.itemArrastando : ''}`}>
      <button
        className={styles.handle}
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        tabIndex={0}
      >
        <svg viewBox="0 0 20 20" fill="none" className={styles.handleIcon} aria-hidden="true">
          <circle cx="7" cy="5" r="1.5" fill="currentColor" />
          <circle cx="13" cy="5" r="1.5" fill="currentColor" />
          <circle cx="7" cy="10" r="1.5" fill="currentColor" />
          <circle cx="13" cy="10" r="1.5" fill="currentColor" />
          <circle cx="7" cy="15" r="1.5" fill="currentColor" />
          <circle cx="13" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </button>
      <span className={styles.itemNome}>{nome}</span>
      {garrafa.tipo && !isCegoParaMim && (
        <span
          className={styles.itemTipo}
          style={{ color: TIPO_CORES[garrafa.tipo] ?? 'var(--tabac)' }}
        >
          {garrafa.tipo}
        </span>
      )}
      {isCegoParaMim && <span className={styles.itemCego}>cego</span>}
    </div>
  )
}

export default function GarrafasOrdenar({ garrafas, sessaoApelido, onSalvar, onCancelar }) {
  const [itens, setItens] = useState(garrafas.map((g) => g.id))
  const [salvando, setSalvando] = useState(false)

  const garrafaById = Object.fromEntries(garrafas.map((g) => [g.id, g]))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = itens.indexOf(active.id)
      const newIndex = itens.indexOf(over.id)
      setItens((prev) => arrayMove(prev, oldIndex, newIndex))
    }
  }

  async function handleSalvar() {
    setSalvando(true)
    await onSalvar(itens)
    setSalvando(false)
  }

  return (
    <div className={styles.painel}>
      <p className={styles.dica}>Arraste os vinhos para definir a ordem de prova</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={itens} strategy={verticalListSortingStrategy}>
          <div className={styles.lista}>
            {itens.map((id, idx) => {
              const g = garrafaById[id]
              if (!g) return null
              return (
                <div key={id} className={styles.row}>
                  <span className={styles.numero}>{idx + 1}</span>
                  <ItemOrdenavel garrafa={g} sessaoApelido={sessaoApelido} />
                </div>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div className={styles.acoes}>
        <button type="button" className="btn-ghost" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </button>
        <button type="button" className="btn-primary" onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'A guardar…' : 'Guardar ordem'}
        </button>
      </div>
    </div>
  )
}
