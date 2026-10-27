import { useState } from 'react'
import { Flame, Thermometer } from 'lucide-react'

type KilnPosition = {
  id: number
  label: string
  /** position along the 0–1 curve of the long kiln */
  at: number
  temp: number
  /** what the flame does there */
  fire: string
  glaze: string
  left: number
  note: string
}

const POSITIONS: KilnPosition[] = [
  {
    id: 1,
    label: '一号',
    at: 0.06,
    temp: 1180,
    fire: '氧化焰 · 火头',
    glaze: '灰被',
    left: 1,
    note: '离火头最近，升温快、落灰少。这一带多为素净的灰被，颜色薄，看的是釉面的匀。',
  },
  {
    id: 2,
    label: '二号',
    at: 0.22,
    temp: 1260,
    fire: '弱还原',
    glaze: '柿釉',
    left: 1,
    note: '温度够、氧气还多，铁被氧化成橙红。柿釉几乎都出在这一段，窑门开合的瞬间定色。',
  },
  {
    id: 3,
    label: '三号',
    at: 0.38,
    temp: 1320,
    fire: '强还原 · 火心',
    glaze: '曜变',
    left: 1,
    note: '全窑最难拿的位置。还原气氛一分不多一分不少，铁才析出成膜，泛出虹彩。三窑难得一只。',
  },
  {
    id: 4,
    label: '四号',
    at: 0.52,
    temp: 1300,
    fire: '还原 · 转折',
    glaze: '油滴',
    left: 0,
    note: '火势在这里开始转弱，铁结晶有时间聚成滴。斑点最容易长得均匀，也最容易糊成一片。',
  },
  {
    id: 5,
    label: '五号',
    at: 0.66,
    temp: 1290,
    fire: '还原 · 缓流',
    glaze: '兔毫',
    left: 1,
    note: '釉在斜壁上流得慢，结晶被拉成极细的毫纹。风一大就断，断了就是废盏。',
  },
  {
    id: 6,
    label: '六号',
    at: 0.79,
    temp: 1240,
    fire: '弱还原 · 窑尾',
    glaze: '兔毫 / 灰被',
    left: 0,
    note: '温度掉得快，釉常常挂不住。这一带十只里九只要砸，剩下的多是稀薄的褐毫。',
  },
  {
    id: 7,
    label: '七号',
    at: 0.93,
    temp: 1180,
    fire: '氧化 · 烟囱口',
    glaze: '灰被',
    left: 1,
    note: '烟囱口，落灰最厚。灰被的层次最杂，也最安静。入门的那只空谷就出在这里。',
  },
]

export function KilnDiagram() {
  const [active, setActive] = useState(2)
  const current = POSITIONS[active]

  return (
    <div className="rounded-2xl border border-ivory/[0.08] bg-surface/30 p-5 sm:p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] tracking-[0.24em] text-ivory/35">龙窑 · 三十六米</span>
        <span className="flex items-center gap-1.5 text-[10px] tracking-[0.16em] text-ember/80">
          <Flame className="h-3 w-3" strokeWidth={2} />
          点火 → 烟囱
        </span>
      </div>

      {/* ── the long kiln ── */}
      <div className="relative mt-6 h-[150px] select-none">
        {/* body of the kiln, drawn as a tapering tunnel in section */}
        <svg
          viewBox="0 0 400 130"
          className="absolute inset-x-0 top-0 h-[130px] w-full"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="kiln-body" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A1D14" />
              <stop offset="34%" stopColor="#4A2A18" />
              <stop offset="38%" stopColor="#6E3A1C" />
              <stop offset="52%" stopColor="#542E19" />
              <stop offset="100%" stopColor="#221A14" />
            </linearGradient>
            <linearGradient id="kiln-heat" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#C4562A" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#C4562A" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#C4562A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* tunnel */}
          <path
            d="M4 62 C 60 34 140 30 200 30 C 262 30 342 38 396 58 L396 96 C 342 112 262 118 200 118 C 140 118 60 112 4 96 Z"
            fill="url(#kiln-body)"
          />
          {/* heat inside */}
          <path
            d="M4 62 C 60 34 140 30 200 30 C 262 30 342 38 396 58 L396 96 C 342 112 262 118 200 118 C 140 118 60 112 4 96 Z"
            fill="url(#kiln-heat)"
          />
          {/* flame lick */}
          <path
            d="M8 74 C 70 56 140 56 200 58 C 270 60 340 66 394 78"
            fill="none"
            stroke="#E6813F"
            strokeOpacity="0.5"
            strokeWidth="1.4"
            strokeDasharray="3 5"
          />
          {/* the active band */}
          <rect
            x={current.at * 380 + 6}
            y="24"
            width="16"
            height="100"
            fill="#C9A96A"
            opacity="0.09"
            className="transition-all duration-500 ease-spring"
          />
        </svg>

        {/* position markers */}
        {POSITIONS.map((p, i) => {
          const isOn = i === active
          const top = 66 - Math.cos((p.at - 0.5) * Math.PI) * 16
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.at * 100}%`, top: `${top}%` }}
              aria-label={`${p.label}窑位 · ${p.glaze}`}
              aria-pressed={isOn}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border text-[9.5px] tracking-[0.04em] transition-all duration-400 ${
                  isOn
                    ? 'scale-110 border-gold/70 bg-gold/20 text-gold shadow-[0_0_18px_rgba(201,169,106,0.35)]'
                    : 'border-ivory/20 bg-void/70 text-ivory/45 group-hover:border-gold/45 group-hover:text-ivory/85'
                }`}
              >
                {p.id}
              </span>
              {p.left > 0 && (
                <span
                  className={`absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full transition-colors ${
                    isOn ? 'bg-celadon' : 'bg-celadon/60'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── readout ── */}
      <div key={current.id} className="animate-pop">
        <div className="mt-1 flex items-start justify-between gap-4 border-t border-ivory/[0.08] pt-5">
          <div>
            <p className="flex items-center gap-2 font-serif text-[19px] tracking-[0.12em] text-ivory">
              {current.label}窑位
              <span className="rounded-sm border border-gold/30 px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-gold/85">
                {current.glaze}
              </span>
            </p>
            <p className="mt-1 text-[10.5px] tracking-[0.14em] text-ivory/30">{current.fire}</p>
          </div>

          <div className="text-right">
            <p className="flex items-center justify-end gap-1.5 text-[10px] tracking-[0.16em] text-ivory/30">
              <Thermometer className="h-3 w-3 text-ember/70" strokeWidth={2} />
              烧成温度
            </p>
            <p className="tnum mt-1 font-latin text-[26px] leading-none text-ivory">
              {current.temp}
              <span className="ml-0.5 text-[13px] text-ivory/35">℃</span>
            </p>
          </div>
        </div>

        <p className="mt-3 text-[12.5px] leading-[1.9] text-ivory/45">{current.note}</p>

        <div className="mt-4 flex items-center justify-between border-t border-ivory/[0.06] pt-3">
          <span className="text-[10px] tracking-[0.16em] text-ivory/25">这一窑此位余</span>
          <span
            className={`tnum text-[11.5px] tracking-[0.08em] ${
              current.left > 0 ? 'text-celadon' : 'text-ivory/30'
            }`}
          >
            {current.left > 0 ? `${current.left} 只 · 可请` : '已出完'}
          </span>
        </div>
      </div>
    </div>
  )
}
