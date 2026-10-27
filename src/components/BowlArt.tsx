import { useMemo, useRef, useState } from 'react'
import type { Bowl } from '../lib/data'

/* ── deterministic pseudo random so a bowl always looks the same ── */
function makeRandom(seed: number) {
  let s = seed % 4294967296
  if (s <= 0) s += 4294967295
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function hashString(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

type Speck = { x: number; y: number; r: number; o: number }
type Streak = { x1: number; y1: number; x2: number; y2: number; w: number; o: number }
type Smudge = { cx: number; cy: number; rx: number; ry: number; o: number }

const CX = 200
const CY = 176
const RX = 141
const RY = 43

function buildPatterns(bowl: Bowl) {
  const rand = makeRandom(hashString(bowl.id))
  const specs: Speck[] = []
  const streaks: Streak[] = []
  const smudges: Smudge[] = []

  const count =
    bowl.family === '油滴' ? 190 : bowl.family === '曜变' ? 74 : bowl.family === '灰被' ? 30 : 0

  for (let i = 0; i < count; i += 1) {
    const t = rand() * Math.PI * 2
    // bias toward the centre so the pattern thins out near the rim
    const r = Math.pow(rand(), 0.62) * 0.985
    const streak = bowl.family === '曜变' ? 0 : 0
    const x = CX + Math.cos(t) * RX * r + (rand() - 0.5) * 3
    const y = CY + Math.sin(t) * RY * r + rand() * 16 * (1 - r) + streak
    const depth = 1 - Math.abs(Math.sin(t)) * 0.35
    const size = (bowl.family === '油滴' ? 1.1 + rand() * 2.3 : 0.9 + rand() * 2.7) * depth
    specs.push({ x, y, r: size, o: 0.28 + rand() * 0.62 })
  }

  if (bowl.family === '兔毫') {
    const lines = 96
    for (let i = 0; i < lines; i += 1) {
      const a = (i / lines) * Math.PI * 2 + rand() * 0.03
      const r1 = 0.42 + rand() * 0.16
      const r2 = 0.995
      streaks.push({
        x1: CX + Math.cos(a) * RX * r1,
        y1: CY + Math.sin(a) * RY * r1,
        x2: CX + Math.cos(a) * RX * r2,
        y2: CY + Math.sin(a) * RY * r2,
        w: 0.45 + rand() * 1.1,
        o: 0.18 + rand() * 0.5,
      })
    }
  }

  if (bowl.family === '灰被' || bowl.family === '柿釉') {
    for (let i = 0; i < 14; i += 1) {
      const t = rand() * Math.PI * 2
      const r = Math.pow(rand(), 0.7) * 0.95
      smudges.push({
        cx: CX + Math.cos(t) * RX * r,
        cy: CY + Math.sin(t) * RY * r,
        rx: 10 + rand() * 26,
        ry: 5 + rand() * 12,
        o: bowl.family === '柿釉' ? 0.1 + rand() * 0.16 : 0.14 + rand() * 0.26,
      })
    }
  }

  return { specs, streaks, smudges }
}

type BowlArtProps = {
  bowl: Bowl
  /** pointer-reactive iridescence + tilt */
  interactive?: boolean
  className?: string
  /** adds the soft floor shadow */
  shadow?: boolean
  /** lets the visitor grab and turn the vessel */
  spinable?: boolean
  /** 0–1.5, brightens the iridescent halo (used by the candle-light view) */
  glow?: number
  /** reports the current turn so the parent can show it */
  onSpin?: (deg: number) => void
}

export function BowlArt({
  bowl,
  interactive = true,
  className = '',
  shadow = true,
  spinable = false,
  glow = 1,
  onSpin,
}: BowlArtProps) {
  const uid = bowl.id
  const { specs, streaks, smudges } = useMemo(() => buildPatterns(bowl), [bowl])
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [drag, setDrag] = useState<{ startX: number; base: number } | null>(null)
  const [rotation, setRotation] = useState(0)

  const g = bowl.glaze
  const isIridescent = bowl.family === '曜变'
  const [h1, h2, h3, h4] = g.halo

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
    })
  }

  const onDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!spinable) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag({ startX: event.clientX, base: rotation })
    setSpinning(true)
  }

  const onDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return
    const next = drag.base + (event.clientX - drag.startX) * 0.9
    setRotation(next)
    onSpin?.(next)
  }

  const onUp = () => {
    setDrag(null)
    setSpinning(false)
  }

  const tiltX = interactive ? -pointer.y * 5 : 0
  const tiltY = interactive ? pointer.x * 7 : 0
  const shineX = pointer.x * 26
  const shineY = pointer.y * 14
  /** rotate the glaze as if the vessel were turning on its foot */
  const turn = `translate(${CX} ${CY}) scale(1 ${RY / RX}) rotate(${rotation % 360}) scale(1 ${RX / RY}) translate(${-CX} ${-CY})`

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      onPointerMove={(e) => {
        handleMove(e)
        onDrag(e)
      }}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false)
        setPointer({ x: 0, y: 0 })
      }}
      style={{
        perspective: '900px',
        cursor: spinable ? (spinning ? 'grabbing' : 'grab') : undefined,
        touchAction: spinable ? 'pan-y' : undefined,
      }}
    >
      <div
        className="h-full w-full transition-transform duration-500 ease-spring"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className="h-full w-full overflow-visible"
          role="img"
          aria-label={`${bowl.name} · ${bowl.family}建盏`}
        >
          <defs>
            <radialGradient id={`${uid}-body`} cx="42%" cy="12%" r="88%">
              <stop offset="0%" stopColor={g.body} />
              <stop offset="52%" stopColor={g.base} />
              <stop offset="100%" stopColor="#050403" />
            </radialGradient>

            <linearGradient id={`${uid}-interior`} x1="26%" y1="0%" x2="62%" y2="100%">
              <stop offset="0%" stopColor={g.body} />
              <stop offset="46%" stopColor={g.base} />
              <stop offset="100%" stopColor="#030202" />
            </linearGradient>

            <radialGradient id={`${uid}-well`} cx="50%" cy="44%" r="62%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.92" />
              <stop offset="64%" stopColor={g.base} stopOpacity="0.55" />
              <stop offset="100%" stopColor={g.base} stopOpacity="0" />
            </radialGradient>

            <linearGradient id={`${uid}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={g.rim} stopOpacity="0.15" />
              <stop offset="34%" stopColor={g.rim} stopOpacity="0.92" />
              <stop offset="62%" stopColor={g.rim} stopOpacity="0.36" />
              <stop offset="100%" stopColor={g.rim} stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id={`${uid}-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="58%" stopColor={g.rim} stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isIridescent ? h1 : g.mark} stopOpacity="0.55" />
              <stop offset="55%" stopColor={isIridescent ? h2 : g.mark} stopOpacity="0.16" />
              <stop offset="100%" stopColor={g.base} stopOpacity="0" />
            </radialGradient>

            <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id={`${uid}-soft`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id={`${uid}-grain`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="n" />
              <feColorMatrix in="n" type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.16" />
              </feComponentTransfer>
            </filter>

            <clipPath id={`${uid}-bodyClip`}>
              <path d="M50 168 A150 48 0 0 0 350 168 C 348 228 320 270 266 293 C 249 301 226 305 200 305 C 174 305 151 301 134 293 C 80 270 52 228 50 168 Z" />
            </clipPath>

            <clipPath id={`${uid}-interiorClip`}>
              <ellipse cx={CX} cy={CY} rx={RX} ry={RY} />
            </clipPath>
          </defs>

          {/* floor shadow */}
          {shadow && (
            <ellipse
              cx="200"
              cy="336"
              rx={hover && interactive ? 128 : 118}
              ry="15"
              fill="#000000"
              opacity="0.75"
              filter={`url(#${uid}-blur)`}
              className="transition-all duration-700"
            />
          )}

          {/* outer body */}
          <path
            d="M50 168 A150 48 0 0 0 350 168 C 348 228 320 270 266 293 C 249 301 226 305 200 305 C 174 305 151 301 134 293 C 80 270 52 228 50 168 Z"
            fill={`url(#${uid}-body)`}
          />
          <g clipPath={`url(#${uid}-bodyClip)`}>
            {/* glaze fall / drips */}
            {Array.from({ length: 34 }).map((_, i) => {
              const x = 52 + (i / 33) * 296
              const h = 54 + ((i * 37) % 82)
              const narrow = Math.abs(x - 200) / 150
              return (
                <rect
                  key={`drip-${i}`}
                  x={x}
                  y={168}
                  width={1 + (i % 3) * 0.7}
                  height={h * (1 - narrow * 0.42)}
                  fill={g.mark}
                  opacity={0.11 + (i % 4) * 0.03}
                />
              )
            })}
            {/* soft reflection on the near wall */}
            <ellipse
              cx="196"
              cy="238"
              rx="86"
              ry="46"
              fill={`url(#${uid}-sheen)`}
              opacity="0.5"
              filter={`url(#${uid}-blur)`}
            />
            {/* contact darkening near the foot */}
            <ellipse cx="200" cy="300" rx="76" ry="22" fill="#000" opacity="0.55" filter={`url(#${uid}-blur)`} />
            {/* grain */}
            <rect x="42" y="160" width="316" height="160" filter={`url(#${uid}-grain)`} opacity="0.5" />
          </g>

          {/* body edge light */}
          <path
            d="M50 168 C 52 228 80 270 134 293 C 151 301 174 305 200 305"
            fill="none"
            stroke={g.rim}
            strokeOpacity="0.28"
            strokeWidth="1"
          />

          {/* foot ring */}
          <ellipse cx="200" cy="305" rx="35" ry="9" fill="#0A0806" />
          <ellipse cx="200" cy="303" rx="35" ry="9" fill="none" stroke={g.rim} strokeOpacity="0.22" strokeWidth="1" />

          {/* interior */}
          <ellipse cx={CX} cy={CY} rx={RX + 6} ry={RY + 3} fill="#050403" />
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill={`url(#${uid}-interior)`} />

          <g clipPath={`url(#${uid}-interiorClip)`}>
            {/* iridescent halo, breathing with the pointer */}
            {isIridescent && (
              <g
                className="transition-transform duration-700 ease-spring"
                style={{
                  transform: `translate(${shineX * 0.5}px, ${shineY * 0.5}px)`,
                  opacity: Math.min(1.4, glow),
                }}
              >
                <ellipse cx={CX} cy={CY + 2} rx={RX * 0.94} ry={RY * 0.92} fill={`url(#${uid}-glow)`} />
                <ellipse
                  cx={CX - 18}
                  cy={CY + 4}
                  rx={RX * 0.62}
                  ry={RY * 0.66}
                  fill={h2}
                  opacity={(hover ? 0.24 : 0.16) * glow}
                  filter={`url(#${uid}-blur)`}
                  style={{ mixBlendMode: 'screen' }}
                />
                <ellipse
                  cx={CX + 26}
                  cy={CY - 2}
                  rx={RX * 0.5}
                  ry={RY * 0.58}
                  fill={h3}
                  opacity={(hover ? 0.2 : 0.13) * glow}
                  filter={`url(#${uid}-blur)`}
                  style={{ mixBlendMode: 'screen' }}
                />
                <ellipse
                  cx={CX + 4}
                  cy={CY + 14}
                  rx={RX * 0.34}
                  ry={RY * 0.42}
                  fill={h4}
                  opacity={0.18 * glow}
                  filter={`url(#${uid}-blur)`}
                  style={{ mixBlendMode: 'screen' }}
                />
              </g>
            )}

            {/* the glaze itself turns with the vessel */}
            <g
              transform={turn}
              style={{
                transition: spinning ? 'none' : 'transform 700ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {/* smoke / colour pooling */}
              {smudges.map((s, i) => (
                <ellipse
                  key={`sm-${i}`}
                  cx={s.cx}
                  cy={s.cy}
                  rx={s.rx}
                  ry={s.ry}
                  fill={g.mark}
                  opacity={s.o}
                  filter={`url(#${uid}-blur)`}
                />
              ))}

              {streaks.map((s, i) => (
                <line
                  key={`st-${i}`}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                  stroke={g.mark}
                  strokeWidth={s.w}
                  strokeOpacity={s.o}
                  strokeLinecap="round"
                />
              ))}

              {specs.map((s, i) => (
                <circle key={`sp-${i}`} cx={s.x} cy={s.y} r={s.r} fill={g.mark} opacity={s.o} />
              ))}
            </g>

            {/* concave well shading */}
            <ellipse cx={CX} cy={CY + 10} rx={RX * 0.72} ry={RY * 0.7} fill={`url(#${uid}-well)`} />
            {/* specular glint on the far wall */}
            <ellipse
              cx={CX - 34 + shineX}
              cy={CY - 16 + shineY}
              rx="46"
              ry="11"
              fill="#FFFFFF"
              opacity={interactive && hover ? 0.16 : 0.1}
              filter={`url(#${uid}-soft)`}
              className="transition-all duration-500"
            />
          </g>

          {/* rim */}
          <ellipse
            cx={CX}
            cy={CY}
            rx={RX}
            ry={RY}
            fill="none"
            stroke={`url(#${uid}-rim)`}
            strokeWidth="2.4"
          />
          <ellipse
            cx={CX}
            cy={CY}
            rx={RX + 2.6}
            ry={RY + 1.4}
            fill="none"
            stroke={g.rim}
            strokeOpacity="0.16"
            strokeWidth="0.8"
          />
        </svg>
      </div>
    </div>
  )
}
