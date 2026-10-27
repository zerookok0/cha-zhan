import { useRef, useState } from 'react'
import type { Bowl } from '../lib/data'
import { BowlArt } from './BowlArt'

/**
 * 一只盏能「转」吗？
 *   · 没有实拍图 → 用代码绘制的盏，可以转
 *   · 有实拍图但只有一张 → 平的，没有背面，转不了
 *   · 有多张角度图 → 可以用拖动换角度，等价于「转」
 */
export function canSpinBowl(bowl: Bowl) {
  if (!bowl.photo) return true
  return (bowl.photos?.length ?? 0) > 1
}

function photoList(bowl: Bowl) {
  if (bowl.photos?.length) return bowl.photos
  return bowl.photo ? [bowl.photo] : []
}

type Variant = 'stage' | 'chip'

type BowlVisualProps = {
  bowl: Bowl
  className?: string
  interactive?: boolean
  shadow?: boolean
  spinable?: boolean
  glow?: number
  onSpin?: (deg: number) => void
  /** 换光时盖在照片上的一层色，让日光 / 烛火 / 顶灯对实拍图也生效 */
  overlay?: string
  /**
   * stage —— 图录式的暖白台面，用在主视觉与大卡片
   * chip  —— 小圆片，用在盏匣 / 结算里的缩略图，避免大白块
   */
  variant?: Variant
}

/**
 * 盏的视觉入口：有实拍图显示照片，没有则显示代码绘制的盏。
 *
 * 图片层做了三件事，缺一不可（否则收藏区的横向拖动会立刻失灵）：
 *   1. pointer-events: none —— 指针穿透到下面的容器
 *   2. draggable={false} —— 关掉浏览器原生的 HTML5 图片拖拽
 *   3. mix-blend-mode: multiply —— 白底在暖白台面上自动“消失”
 *
 * 照片没有背面，所以单张图模式下不给「旋转」的假承诺：
 * 改用指针视差 + 会跟着走的高光，让静态图也有生气；
 * 如果给了多张角度图，按住左右拖就切换视角。
 */
export function BowlVisual({
  bowl,
  className = '',
  interactive = true,
  shadow = true,
  spinable = false,
  glow = 1,
  onSpin,
  overlay,
  variant = 'stage',
}: BowlVisualProps) {
  const photos = photoList(bowl)
  const [failedSrc, setFailedSrc] = useState<string[]>([])
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)

  const wrapRef = useRef<HTMLDivElement | null>(null)
  /** 与收藏区同一套纪律：越过阈值才接管指针，且不在按下时就 capture */
  const dragRef = useRef<{ x: number; base: number; active: boolean } | null>(null)

  const usable = photos.filter((src) => !failedSrc.includes(src))

  if (!bowl.photo || usable.length === 0) {
    return (
      <BowlArt
        bowl={bowl}
        className={className}
        interactive={interactive}
        shadow={shadow}
        spinable={spinable}
        glow={glow}
        onSpin={onSpin}
      />
    )
  }

  const n = usable.length
  const step = ((index % n) + n) % n
  const src = usable[step]
  const isMulti = n > 1
  const turnable = spinable && isMulti

  const markFailed = (bad: string) => setFailedSrc((prev) => [...prev, bad])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!turnable) return
    dragRef.current = { x: e.clientX, base: step, active: false }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interactive) {
      const el = wrapRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        setPointer({
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
        })
      }
    }

    const d = dragRef.current
    if (!d || !turnable) return

    const dx = e.clientX - d.x
    if (!d.active) {
      if (Math.abs(dx) < 8) return
      d.active = true
      setDragging(true)
      try {
        wrapRef.current?.setPointerCapture(e.pointerId)
      } catch {
        /* 指针已失效时忽略 */
      }
    }

    // 每拖 72px 换一个角度；拖满一圈刚好走完所有视角
    const next = (((d.base + Math.round(dx / 72)) % n) + n) % n
    if (next !== step) {
      setIndex(next)
      onSpin?.(next * (360 / n))
    }
  }

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.active && e) {
      try {
        if (wrapRef.current?.hasPointerCapture(e.pointerId)) {
          wrapRef.current.releasePointerCapture(e.pointerId)
        }
      } catch {
        /* 忽略 */
      }
    }
    dragRef.current = null
    setDragging(false)
  }

  const isChip = variant === 'chip'
  const tiltX = interactive ? pointer.x * 9 : 0
  const tiltY = interactive ? pointer.y * 6 : 0

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${isChip ? 'rounded-full' : 'rounded-[18px]'} ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={(e) => {
        endDrag(e)
        setPointer({ x: 0, y: 0 })
      }}
      style={{
        perspective: '900px',
        cursor: turnable ? (dragging ? 'grabbing' : 'grab') : undefined,
        touchAction: turnable ? 'pan-y' : undefined,
      }}
    >
      {/* 台面：暖白纸感，让白底照片不像“缺了一块” */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${
          isChip
            ? 'bg-[radial-gradient(circle_at_50%_38%,#f5ecda_0%,#e3d6be_58%,#c9b899_100%)]'
            : 'photo-stage'
        }`}
      />

      <img
        src={src}
        alt={`${bowl.name} · ${bowl.family}建盏${isMulti ? ` · 第 ${step + 1} 个视角` : ''}`}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => markFailed(src)}
        className={`photo-layer relative z-10 h-full w-full object-contain mix-blend-multiply ${
          isChip ? 'p-[4%]' : 'p-[7%]'
        }`}
        style={{
          filter: `saturate(${0.94 + glow * 0.1}) brightness(${0.96 + glow * 0.05})`,
          transform: dragging
            ? `translate3d(${tiltX * 0.6}px, ${tiltY * 0.4}px, 0) scale(1.03)`
            : `translate3d(${tiltX}px, ${tiltY}px, 0) scale(1.02)`,
          transition: dragging
            ? 'transform 90ms linear'
            : 'transform 520ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* 会跟着指针挪的高光，让静态照片也有“活的”反光 */}
      {interactive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 mix-blend-screen transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${50 + pointer.x * 26}% ${
              42 + pointer.y * 22
            }%, rgba(255,246,226,${0.16 + glow * 0.06}), transparent 60%)`,
            opacity: isChip ? 0 : 1,
          }}
        />
      )}

      {/* 换光的叠色：日光 / 烛火 / 顶灯 */}
      {overlay && !isChip && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
          style={{ background: overlay }}
        />
      )}

      {/* 单张图时的诚实提示：不能转，但能换光 */}
      {turnable && !isChip && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-1">
            {usable.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-4 bg-void/60' : 'w-1 bg-void/25'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
