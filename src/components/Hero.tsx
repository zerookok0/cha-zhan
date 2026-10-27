import { ArrowDown, ArrowUpRight, Flame, Minus, ShieldCheck, Sparkles } from 'lucide-react'
import { BowlVisual, canSpinBowl } from './BowlVisual'
import { Reveal } from './Reveal'
import { FEATURED, KILN_MARKS, STATS } from '../lib/data'

type HeroProps = {
  onInspect: () => void
}

export function Hero({ onInspect }: HeroProps) {
  const featuredSpin = canSpinBowl(FEATURED)
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-[6.5rem] sm:pt-[8rem] lg:pb-24 lg:pt-[9.5rem]"
    >
      {/* kiln haze right behind the vessel */}
      <div
        aria-hidden="true"
        className="kiln-haze pointer-events-none absolute -right-40 top-0 h-[46rem] w-[46rem] rounded-full opacity-40 blur-[120px] lg:left-[46%] lg:right-auto"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 xl:gap-16">
          {/* ── Copy ── */}
          <div className="relative order-2 lg:order-1">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-ember/25 bg-ember/[0.07] py-1.5 pl-2 pr-3.5 text-[11px] tracking-[0.16em] text-ember/90">
                  <Flame className="h-3 w-3" strokeWidth={2} />
                  第三十八窑 · 已开窑
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] text-ivory/40">
                  <Minus className="h-3 w-3 text-gold/50" strokeWidth={2} />
                  余 4 只
                </span>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="mt-7 font-serif text-[clamp(2.7rem,6.2vw,4.7rem)] leading-[1.12] tracking-[0.02em] text-ivory">
                一窑
                <span className="text-ash/40">，</span>
                <span className="relative inline-block px-1">
                  <span className="text-gold">一器</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 160 10"
                    className="absolute -bottom-1 left-0 h-2 w-full text-gold/45"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 7c34-5 78-6 156-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                世上没有两只一样的盏
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-8 max-w-[33rem] text-[15.5px] leading-[2] text-ivory/55 sm:text-[16px]">
                建阳水吉的红土，松柴烧足二十六小时，出窑即编号、称重、留档。
                我们只卖孤品 ——
                <span className="text-ivory/85">
                  你买下的这只是唯一的一只，没有同款，也不会再烧第二次。
                </span>
              </p>
            </Reveal>

            <Reveal delay={210}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onInspect}
                  className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-ivory px-6 py-3.5 text-[13.5px] font-medium tracking-[0.14em] text-void transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
                >
                  <Sparkles className="h-4 w-4" strokeWidth={1.9} />
                  看这一窑的孤品
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                </button>
                <a
                  href="#craft"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-ivory/12 px-6 py-3.5 text-[13.5px] tracking-[0.14em] text-ivory/70 transition-all duration-300 hover:border-gold/40 hover:text-ivory"
                >
                  一窑是怎么烧成的
                  <ArrowUpRight
                    className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    strokeWidth={1.8}
                  />
                </a>
              </div>
            </Reveal>

            <Reveal delay={290}>
              <dl className="mt-12 grid max-w-[32rem] grid-cols-2 gap-x-5 gap-y-6 border-t border-ivory/[0.08] pt-7 sm:grid-cols-4 sm:gap-x-3">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="tnum font-latin text-[26px] leading-none tracking-tight text-ivory/90">
                      {stat.value}
                    </dt>
                    <dd className="mt-2 text-[10.5px] leading-snug tracking-[0.1em] text-ivory/38">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* ── Vessel ── */}
          <div className="relative order-1 lg:order-2">
            <Reveal delay={120} className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
              {/* orbit / seal ring */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 lg:block xl:h-[36rem] xl:w-[36rem]"
              >
                <div className="absolute inset-0 rounded-full border border-ivory/[0.06]" />
                <div className="absolute inset-10 rounded-full border border-dashed border-ivory/[0.05]" />
                <div className="absolute inset-0 animate-[spin_58s_linear_infinite]">
                  <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-gold/80 shadow-[0_0_12px_3px_rgba(201,169,106,0.5)]" />
                </div>
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[9px] uppercase tracking-[0.52em] text-ivory/15">
                  Jian ware · since 1998
                </span>
              </div>

              <div className="relative">
                <BowlVisual bowl={FEATURED} className="aspect-square w-full" spinable={featuredSpin} />

                {/* interaction hint */}
                <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-ivory/10 bg-void/40 px-3.5 py-1.5 text-[10.5px] tracking-[0.22em] text-ivory/40 backdrop-blur-sm">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-gold/80" />
                    {featuredSpin ? '按住左右拖 · 把盏转一圈' : '点开放大 · 换个光照看看'}
                  </span>
                </div>
              </div>

              {/* specimen card */}
              <div className="absolute -bottom-6 left-0 hidden w-[13.5rem] sm:block lg:-left-6">
                <div className="glass animate-float rounded-lg p-3.5 shadow-lift [animation-duration:10s]">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[9px] tracking-[0.3em] text-ivory/35">
                      {FEATURED.code}
                    </span>
                    <span className="text-[9px] tracking-[0.2em] text-gold/80">
                      {FEATURED.family}
                    </span>
                  </div>
                  <p className="mt-1.5 font-serif text-[19px] tracking-[0.18em] text-ivory">
                    {FEATURED.name}
                  </p>
                  <p className="mt-1 text-[10px] tracking-[0.08em] text-ivory/35">
                    {FEATURED.firing}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-ivory/[0.08] pt-2.5">
                    <span className="tnum text-[13px] text-ivory/85">
                      ¥{FEATURED.price.toLocaleString('zh-CN')}
                    </span>
                    <span className="text-[9px] tracking-[0.2em] text-ivory/30">唯一</span>
                  </div>
                </div>
              </div>

              {/* trust chip */}
              <div className="pointer-events-none absolute -right-2 bottom-28 hidden lg:block xl:-right-6">
                <div className="glass animate-float rounded-lg px-3.5 py-2.5 shadow-lift [animation-delay:-4.5s]">
                  <p className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-ivory/35">
                    <ShieldCheck className="h-3 w-3 text-celadon" strokeWidth={2.2} />
                    一器一档
                  </p>
                  <p className="mt-1 text-[11.5px] tracking-[0.1em] text-ivory/70">
                    窑照 · 证书 · 编号
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={120}>
          <div className="mt-16 flex items-center justify-between border-t border-ivory/[0.07] pt-5">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.26em] text-ivory/30">
              <ArrowDown className="h-3 w-3 animate-bounce" strokeWidth={2} />
              向下
            </div>
            <div className="mask-fade-x hidden max-w-[36rem] flex-1 overflow-hidden sm:block">
              <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-[10px] tracking-[0.3em] text-ivory/25">
                {[...KILN_MARKS, ...KILN_MARKS].map((mark, i) => (
                  <span key={`${mark}-${i}`} className="flex items-center gap-8">
                    {mark}
                    <span className="h-1 w-1 rounded-full bg-gold/40" />
                  </span>
                ))}
              </div>
            </div>
            <span className="font-latin text-[12px] tracking-[0.3em] text-ivory/30">
              无二 · 唯一
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
