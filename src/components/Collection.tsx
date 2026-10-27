import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Lock } from 'lucide-react'
import { BOWLS, type Bowl, type GlazeFamily } from '../lib/data'
import { BowlArt } from './BowlArt'
import { Reveal } from './Reveal'

const FILTERS: Array<'全部' | GlazeFamily> = ['全部', '曜变', '油滴', '兔毫', '柿釉', '灰被']

const statusLabel: Record<Bowl['status'], string> = {
  available: '可请',
  reserved: '已预约',
  sold: '已入藏',
}

type CollectionProps = {
  onInspect: (bowl: Bowl) => void
  inBag: (id: string) => boolean
  onToggleBag: (bowl: Bowl) => void
}

export function Collection({ onInspect, inBag, onToggleBag }: CollectionProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('全部')
  const railRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  const list = useMemo(() => {
    return filter === '全部' ? BOWLS : BOWLS.filter((b) => b.family === filter)
  }, [filter])

  /* ── drag-to-scroll ──
     注意：不能在 pointerdown 时立刻 setPointerCapture，否则浏览器会把
     后续派生的 click 事件也重定向到容器上，卡片里的按钮就再也点不动了。
     这里改成「移动超过阈值之后」才接管指针。 */
  const drag = useRef<{ x: number; left: number; moved: boolean; active: boolean } | null>(null)
  /** 拖动结束后留下的标记，用来吃掉紧随其后的那次 click */
  const suppressClick = useRef(false)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current
    if (!el) return
    suppressClick.current = false
    if (e.pointerType === 'touch') return // let native touch scrolling do its thing
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false, active: false }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current
    const state = drag.current
    if (!el || !state) return

    const dx = e.clientX - state.x

    if (!state.active) {
      if (Math.abs(dx) < 6) return
      state.active = true
      setDragging(true)
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* 指针已失效时忽略 */
      }
    }

    state.moved = true
    el.scrollLeft = state.left - dx
  }

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current
    const state = drag.current
    if (state?.moved) suppressClick.current = true
    if (state?.active && e && el) {
      try {
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      } catch {
        /* 忽略 */
      }
    }
    drag.current = null
    setDragging(false)
  }

  /** keep track of the card nearest to the left edge, and overall progress */
  const syncProgress = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 8 ? Math.min(1, el.scrollLeft / max) : 1)

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'))
    let closest = 0
    let min = Infinity
    cards.forEach((card, i) => {
      const delta = Math.abs(card.offsetLeft - el.scrollLeft)
      if (delta < min) {
        min = delta
        closest = i
      }
    })
    setStartIndex(closest)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    el.scrollTo({ left: 0, behavior: 'smooth' })
    const id = window.setTimeout(syncProgress, 320)
    return () => window.clearTimeout(id)
  }, [filter, syncProgress])

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nudge(1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nudge(-1)
    }
  }

  return (
    <section id="collection" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col justify-between gap-8 border-b border-ivory/[0.08] pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="eyebrow">
                <span className="h-px w-8 bg-gold/50" />
                当前窑次 · 第三十八窑
              </span>
              <h2 className="mt-5 font-serif text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.24] tracking-[0.04em] text-ivory">
                拖一下，把这一窑看过去
              </h2>
              <p className="mt-4 max-w-[36rem] text-[14.5px] leading-[1.95] text-ivory/45">
                六只盏摆在一条案子上。按住往左右拖，或者用箭头键 ——
                每只都可以点开放大、换光、转到背面看落款。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => nudge(-1)}
                className="grid h-9 w-9 place-items-center rounded-full border border-ivory/12 text-ivory/55 transition-colors hover:border-gold/45 hover:text-gold"
                aria-label="上一只"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.9} />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                className="grid h-9 w-9 place-items-center rounded-full border border-ivory/12 text-ivory/55 transition-colors hover:border-gold/45 hover:text-gold"
                aria-label="下一只"
              >
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.9} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* filters */}
        <Reveal delay={60}>
          <div className="no-scrollbar mt-7 flex items-center gap-1.5 overflow-x-auto pb-1">
            {FILTERS.map((f) => {
              const count = f === '全部' ? BOWLS.length : BOWLS.filter((b) => b.family === f).length
              const isOn = filter === f
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`group relative shrink-0 rounded-full border px-4 py-2 text-[12px] tracking-[0.14em] transition-all duration-300 ${
                    isOn
                      ? 'border-gold/50 bg-gold/[0.1] text-gold'
                      : 'border-ivory/10 text-ivory/50 hover:border-ivory/25 hover:text-ivory/85'
                  }`}
                  aria-pressed={isOn}
                >
                  {f}
                  <span className={`ml-1.5 text-[10px] tnum ${isOn ? 'text-gold/60' : 'text-ivory/25'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>

      {/* ── the shelf ── */}
      <Reveal delay={80}>
        <div className="relative mt-8">
          {/* edge fades */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base to-transparent sm:w-24"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base to-transparent sm:w-24"
          />

          <div
            ref={railRef}
            onScroll={syncProgress}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="list"
            aria-label="孤品陈列，可左右拖动"
            className={`no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 sm:px-9 lg:px-14 ${
              dragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            style={{ touchAction: 'pan-x pan-y', scrollPaddingLeft: '1.5rem' }}
          >
            {list.map((bowl, i) => (
              <div
                key={bowl.id}
                data-card
                role="listitem"
                className="w-[80vw] max-w-[23rem] shrink-0 snap-start sm:w-[22rem] lg:w-[23.5rem]"
              >
                <ShelfCard
                  bowl={bowl}
                  index={i}
                  total={list.length}
                  onInspect={onInspect}
                  inBag={inBag(bowl.id)}
                  onToggleBag={onToggleBag}
                  suppressClick={() => suppressClick.current}
                />
              </div>
            ))}

            {/* end plate */}
            <div className="flex w-[14rem] shrink-0 snap-end flex-col justify-center pl-2 pr-6">
              <p className="font-serif text-[16px] leading-[1.9] tracking-[0.1em] text-ivory/45">
                这一窑
                <br />
                到这里为止。
              </p>
              <p className="mt-3 text-[11px] leading-relaxed tracking-[0.1em] text-ivory/25">
                下一窑预计 2025 年秋开窑
              </p>
            </div>
          </div>

          {/* progress rail */}
          <div className="container-page mt-6">
            <div className="flex items-center gap-4">
              <span className="tnum font-latin text-[13px] tracking-[0.2em] text-ivory/40">
                {String(Math.min(startIndex + 1, list.length)).padStart(2, '0')}
                <span className="mx-1 text-ivory/20">/</span>
                {String(list.length).padStart(2, '0')}
              </span>
              <div className="relative h-px flex-1 bg-ivory/10">
                <span
                  className="absolute inset-y-0 left-0 bg-gold/70 transition-[width] duration-200 ease-out"
                  style={{ width: `${Math.max(12, progress * 100)}%` }}
                />
              </div>
              <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-ivory/25">
                <ArrowLeft className="h-2.5 w-2.5" strokeWidth={2} />
                按住拖动
                <ArrowRight className="h-2.5 w-2.5" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

type ShelfCardProps = {
  bowl: Bowl
  index: number
  total: number
  onInspect: (bowl: Bowl) => void
  inBag: boolean
  onToggleBag: (bowl: Bowl) => void
  suppressClick: () => boolean
}

function ShelfCard({
  bowl,
  index,
  total,
  onInspect,
  inBag,
  onToggleBag,
  suppressClick,
}: ShelfCardProps) {
  const dimmed = bowl.status === 'sold'

  const open = () => {
    if (suppressClick()) return
    onInspect(bowl)
  }

  const add = () => {
    if (suppressClick() || dimmed) return
    onToggleBag(bowl)
  }

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ivory/[0.07] bg-surface/40 transition-all duration-500 hover:border-gold/25 hover:bg-surface/70 hover:shadow-lift ${
        dimmed ? 'opacity-65' : ''
      }`}
    >
      {/* big index behind the vessel */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-2 font-latin text-[76px] leading-none text-ivory/[0.045] transition-colors duration-500 group-hover:text-gold/[0.09]"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <button
        type="button"
        onClick={open}
        className="relative block w-full cursor-inherit px-3 pt-4 text-left"
        aria-label={`查看 ${bowl.name}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-10 h-[70%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_60%,rgba(196,86,42,0.26),transparent_66%)] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
        />
        <div className="relative">
          <BowlArt
            bowl={bowl}
            className="aspect-square w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />

          <span className="absolute left-3 top-3 rounded-sm border border-ivory/12 bg-void/55 px-2 py-0.5 text-[9px] tracking-[0.22em] text-ivory/55 backdrop-blur-sm">
            {bowl.code}
          </span>

          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[9.5px] tracking-[0.18em] backdrop-blur-sm ${
              bowl.status === 'available'
                ? 'border border-celadon/35 bg-celadon/10 text-celadon'
                : bowl.status === 'reserved'
                  ? 'border border-gold/30 bg-gold/10 text-gold'
                  : 'border border-ivory/12 bg-void/60 text-ivory/45'
            }`}
          >
            {statusLabel[bowl.status]}
          </span>

          {inBag && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-ivory px-2.5 py-1 text-[9.5px] tracking-[0.14em] text-void">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
              在盏匣
            </span>
          )}

          {dimmed && (
            <span className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1.5 text-[10px] tracking-[0.34em] text-ivory/30">
              <Lock className="h-3 w-3" strokeWidth={2} />
              已入藏
            </span>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-[21px] tracking-[0.16em] text-ivory">{bowl.name}</h3>
          <span className="shrink-0 text-[10px] tracking-[0.22em] text-gold/70">{bowl.family}</span>
        </div>

        <p className="mt-2.5 min-h-[3.4em] text-[12.5px] leading-[1.75] text-ivory/45">
          {bowl.line}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-ivory/[0.07] pt-3 text-[10px] tracking-[0.1em] text-ivory/30">
          <span>{bowl.diameter}</span>
          <span className="h-2.5 w-px bg-ivory/12" />
          <span>{bowl.weight}</span>
          <span className="h-2.5 w-px bg-ivory/12" />
          <span className="truncate">{bowl.kiln.split(' · ')[1]}</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="tnum font-latin text-[22px] leading-none text-ivory/90">
              ¥{bowl.price.toLocaleString('zh-CN')}
            </p>
            <p className="mt-1.5 text-[9.5px] tracking-[0.18em] text-ivory/25">
              {bowl.status === 'sold' ? '已入藏 · 不再出售' : '含保价寄送与木盒'}
            </p>
          </div>

          <button
            type="button"
            onClick={open}
            className="group/btn inline-flex items-center gap-1.5 rounded-full border border-ivory/12 px-3.5 py-2 text-[11.5px] tracking-[0.12em] text-ivory/65 transition-all duration-300 hover:border-gold/45 hover:text-gold"
          >
            {dimmed ? '看来历' : '转一转、看光照'}
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
              strokeWidth={2}
            />
          </button>
        </div>

        {/* 加购：直接放进盏匣，不必先打开详情 */}
        {!dimmed && (
          <button
            type="button"
            onClick={add}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-[11.5px] font-medium tracking-[0.14em] transition-all duration-300 ${
              inBag
                ? 'border border-gold/45 bg-gold/[0.08] text-gold hover:bg-gold/[0.14]'
                : 'bg-ivory text-void hover:bg-gold/90'
            }`}
          >
            {inBag ? (
              <>
                <Check className="h-3 w-3" strokeWidth={3} />
                在盏匣 · 点击取出
              </>
            ) : (
              '收入盏匣'
            )}
          </button>
        )}

        <span className="mt-3 text-[9px] tracking-[0.22em] text-ivory/15">
          第 {index + 1} / {total} 只
        </span>
      </div>
    </article>
  )
}
