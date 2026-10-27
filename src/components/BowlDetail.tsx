import { useEffect, useState } from 'react'
import {
  Check,
  ChevronRight,
  Flame,
  MapPin,
  RotateCcw,
  Ruler,
  Scale,
  ShieldCheck,
  X,
} from 'lucide-react'
import type { Bowl } from '../lib/data'
import { BowlArt } from './BowlArt'

type LightMode = 'daylight' | 'candle' | 'studio'

const LIGHT_MODES: Array<{ id: LightMode; label: string; hint: string; tint: string; glow: number }> = [
  {
    id: 'daylight',
    label: '日光',
    hint: '上午十点 · 窑前空地',
    tint: 'rgba(255,247,232,0.06)',
    glow: 0.75,
  },
  { id: 'candle', label: '烛火', hint: '一盏油灯 · 近距', tint: 'rgba(196,86,42,0.13)', glow: 1.45 },
  { id: 'studio', label: '灯下', hint: '室内顶灯 · 偏冷', tint: 'rgba(126,156,143,0.09)', glow: 0.95 },
]

type BowlDetailProps = {
  bowl: Bowl | null
  onClose: () => void
  inBag: boolean
  onToggleBag: (bowl: Bowl) => void
}

export function BowlDetail({ bowl, onClose, inBag, onToggleBag }: BowlDetailProps) {
  const [light, setLight] = useState<LightMode>('daylight')
  const [turn, setTurn] = useState(0)

  useEffect(() => {
    if (!bowl) return
    setLight('daylight')
    setTurn(0)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [bowl, onClose])

  const open = Boolean(bowl)
  const current = LIGHT_MODES.find((m) => m.id === light) ?? LIGHT_MODES[0]

  return (
    <div
      className={`fixed inset-0 z-[80] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={bowl ? `${bowl.name} 详情` : '详情'}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="关闭详情"
        onClick={onClose}
        className={`absolute inset-0 bg-void/85 backdrop-blur-md transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute inset-y-0 right-0 w-full max-w-[720px] overflow-y-auto border-l border-ivory/10 bg-[#0E0C0A]/97 shadow-lift transition-transform duration-500 ease-spring ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {bowl && (
          <div key={bowl.id} className="animate-slidein">
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ivory/[0.08] bg-[#0E0C0A]/92 px-5 py-3.5 backdrop-blur-xl sm:px-7">
              <div className="flex items-center gap-2 text-[10.5px] tracking-[0.2em] text-ivory/40">
                <span className="text-gold/70">{bowl.code}</span>
                <ChevronRight className="h-3 w-3" strokeWidth={2} />
                <span>{bowl.firing}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full border border-ivory/10 text-ivory/60 transition-colors hover:border-ivory/30 hover:text-ivory"
                aria-label="关闭"
              >
                <X className="h-4 w-4" strokeWidth={1.9} />
              </button>
            </div>

            <div className="px-5 pb-10 pt-6 sm:px-7">
              {/* vessel stage */}
              <div
                className="relative overflow-hidden rounded-2xl border border-ivory/[0.07] transition-colors duration-700"
                style={{ background: current.tint }}
              >
                <div className="crazing absolute inset-0 opacity-[0.12]" aria-hidden="true" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-10 top-8 h-[60%] rounded-[50%] blur-3xl transition-colors duration-700"
                  style={{ background: current.tint }}
                />
                <BowlArt
                  bowl={bowl}
                  className="relative aspect-square w-full"
                  spinable
                  glow={current.glow}
                  onSpin={setTurn}
                />

                {/* turn readout */}
                <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-ivory/10 bg-void/55 px-2.5 py-1 backdrop-blur-sm">
                  <RotateCcw className="h-2.5 w-2.5 text-gold/60" strokeWidth={2} />
                  <span className="tnum text-[9.5px] tracking-[0.16em] text-ivory/45">
                    {Math.round(((turn % 360) + 360) % 360)}°
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-ivory/[0.07] bg-void/45 px-4 py-2.5 backdrop-blur-sm">
                  <div className="no-scrollbar flex items-center gap-1">
                    {LIGHT_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setLight(mode.id)}
                        className={`rounded-full px-3 py-1 text-[10.5px] tracking-[0.14em] transition-colors duration-300 ${
                          light === mode.id
                            ? 'bg-ivory text-void'
                            : 'text-ivory/45 hover:text-ivory/80'
                        }`}
                        aria-pressed={light === mode.id}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <span className="shrink-0 text-[9.5px] tracking-[0.14em] text-ivory/30">
                    {current.hint}
                  </span>
                </div>
              </div>

              {/* name + price */}
              <div className="mt-7 flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-sm border border-gold/30 px-2 py-0.5 text-[9.5px] tracking-[0.24em] text-gold/90">
                      {bowl.family}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] text-ivory/30">
                      {bowl.status === 'available'
                        ? '可请 · 仅此一只'
                        : bowl.status === 'reserved'
                          ? '已被预约 · 可登记候补'
                          : '已入藏 · 仅供观看'}
                    </span>
                  </div>
                  <h2 className="mt-3 font-serif text-[34px] leading-none tracking-[0.14em] text-ivory">
                    {bowl.name}
                  </h2>
                  <p className="mt-3 max-w-[30rem] text-[13.5px] leading-[1.85] text-ivory/50">
                    {bowl.line}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tnum font-latin text-[27px] leading-none text-ivory">
                    ¥{bowl.price.toLocaleString('zh-CN')}
                  </p>
                  <p className="mt-1.5 text-[9.5px] tracking-[0.16em] text-ivory/28">含木盒与保价寄送</p>
                </div>
              </div>

              {/* specs */}
              <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ivory/[0.08] bg-ivory/[0.06] sm:grid-cols-4">
                {[
                  { icon: Ruler, label: '口径', value: bowl.diameter },
                  { icon: Ruler, label: '高', value: bowl.height },
                  { icon: Scale, label: '重', value: bowl.weight },
                  { icon: MapPin, label: '窑位', value: bowl.kiln.split(' · ')[1] },
                ].map((spec) => (
                  <div key={spec.label} className="bg-[#0E0C0A] px-3.5 py-3">
                    <dt className="flex items-center gap-1.5 text-[9.5px] tracking-[0.16em] text-ivory/28">
                      <spec.icon className="h-2.5 w-2.5" strokeWidth={2} />
                      {spec.label}
                    </dt>
                    <dd className="tnum mt-1.5 text-[12.5px] tracking-[0.04em] text-ivory/80">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* story */}
              <div className="mt-8">
                <h3 className="flex items-center gap-2 text-[11px] tracking-[0.22em] text-gold/80">
                  <Flame className="h-3 w-3" strokeWidth={2} />
                  这一只的来历
                </h3>
                <p className="mt-3 text-[13.5px] leading-[2.05] text-ivory/55">{bowl.note}</p>
              </div>

              {/* firing log */}
              <div className="mt-7 overflow-hidden rounded-xl border border-ivory/[0.08]">
                <div className="flex items-center justify-between border-b border-ivory/[0.07] bg-ivory/[0.02] px-4 py-2.5">
                  <span className="text-[10px] tracking-[0.2em] text-ivory/40">烧成记录</span>
                  <span className="text-[9px] tracking-[0.16em] text-ivory/25">存于窑口档案</span>
                </div>
                <div className="divide-y divide-ivory/[0.05]">
                  {[
                    ['窑位', bowl.kiln],
                    ['窑次', bowl.firing],
                    ['烧成温度', '1320℃ · 还原焰'],
                    ['守火时长', '26 小时 · 松柴'],
                    ['作者', `${bowl.artist} · 手作`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-[11.5px] text-ivory/35">{k}</span>
                      <span className="text-[11.5px] tracking-[0.04em] text-ivory/75">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* tags */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {bowl.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ivory/10 px-2.5 py-1 text-[10px] tracking-[0.12em] text-ivory/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* actions */}
              <div className="mt-8 border-t border-ivory/[0.08] pt-6">
                {bowl.status === 'sold' ? (
                  <div className="rounded-xl border border-ivory/[0.08] bg-ivory/[0.02] px-4 py-4">
                    <p className="flex items-center gap-2 text-[12px] tracking-[0.1em] text-ivory/45">
                      <ShieldCheck className="h-3.5 w-3.5 text-ivory/30" strokeWidth={2} />
                      此盏已入藏，不再出售
                    </p>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-ivory/28">
                      想看相近的一只？可以登记下一窑的意向，出窑后第一时间通知你。
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleBag(bowl)}
                    className={`group flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[13.5px] font-medium tracking-[0.14em] transition-all duration-300 ${
                      inBag
                        ? 'border border-gold/45 bg-gold/10 text-gold'
                        : 'bg-ivory text-void hover:bg-gold/90'
                    }`}
                  >
                    {inBag ? (
                      <>
                        <Check className="h-4 w-4" strokeWidth={2.4} />
                        已在盏匣 · 点击取出
                      </>
                    ) : (
                      <>
                        收入盏匣
                        <ChevronRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                          strokeWidth={2.2}
                        />
                      </>
                    )}
                  </button>
                )}

                <p className="mt-3 text-center text-[10.5px] leading-relaxed tracking-[0.06em] text-ivory/25">
                  下单前可与窑主视频看盏 · 七日鉴赏期 · 破损全额退
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
