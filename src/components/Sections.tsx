import { useState } from 'react'
import { ArrowUpRight, Flame, Quote, ShieldCheck, Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'
import { KilnDiagram } from './KilnDiagram'
import { ARTISAN, BOWLS, CRAFT_STEPS, FAQS, TESTIMONIALS, TIERS } from '../lib/data'
import { BowlArt } from './BowlArt'

/* ───────────────────────── 窑口 ───────────────────────── */
export function KilnSection({ onInspect }: { onInspect: () => void }) {
  return (
    <section id="kiln" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-8 bg-gold/50" />
              窑口 · 福建建阳 · 水吉
            </span>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.28] tracking-[0.03em] text-ivory">
              我们不谈「作品」，
              <br />
              只谈这一窑烧成了什么
            </h2>
            <p className="mt-7 max-w-[34rem] text-[14.5px] leading-[2.05] text-ivory/50">
              龙窑顺着坡势卧在山脚，窑长三十六米，一次投柴八百斤松木。
              火从窑头走到窑尾要六小时，同一窑里前后差半米，温度能差八十度。
            </p>
            <p className="mt-5 max-w-[34rem] text-[14.5px] leading-[2.05] text-ivory/50">
              右边这条窑，是可以点的。点开任意一个窑位，
              你会看到那一带烧出什么釉、还剩几只 ——
              每一只盏的性子，都是它的位置给的。
            </p>

            <button
              type="button"
              onClick={onInspect}
              className="group mt-9 inline-flex items-center gap-2 border-b border-gold/30 pb-1.5 text-[13px] tracking-[0.16em] text-gold transition-colors hover:border-gold"
            >
              看看这一窑留下了什么
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </button>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-ivory/[0.08] pt-5 text-[11px] tracking-[0.1em] text-ivory/35">
              <span className="flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-ember/70" strokeWidth={2} />
                松柴 · 非电窑
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-celadon/70" strokeWidth={2} />
                一器一档
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold/70" strokeWidth={2} />
                只售孤品
              </span>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <KilnDiagram />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 工序 ───────────────────────── */
export function CraftSection() {
  const [active, setActive] = useState(2)

  return (
    <section id="craft" className="relative scroll-mt-24 overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 fade-rule"
      />
      <div className="container-page">
        <Reveal>
          <div className="max-w-[42rem]">
            <span className="eyebrow">
              <span className="h-px w-8 bg-gold/50" />
              工序 · 六步，二十六小时
            </span>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.28] tracking-[0.03em] text-ivory">
              人能做的，只到装窑为止
            </h2>
            <p className="mt-5 text-[14.5px] leading-[2] text-ivory/45">
              后面的事，交给火。点下面任意一步，看这一步到底在做什么。
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* step list */}
          <Reveal>
            <ol className="relative">
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold/40 via-ivory/10 to-transparent"
              />
              {CRAFT_STEPS.map((step, i) => {
                const isOn = active === i
                return (
                  <li key={step.index} className="relative">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="group flex w-full items-start gap-4 py-4 text-left"
                      aria-expanded={isOn}
                    >
                      <span
                        className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[10.5px] tracking-[0.1em] transition-all duration-400 ${
                          isOn
                            ? 'border-gold/60 bg-gold/15 text-gold'
                            : 'border-ivory/12 bg-base text-ivory/35 group-hover:border-ivory/30 group-hover:text-ivory/70'
                        }`}
                      >
                        {step.index}
                      </span>
                      <span className="flex-1 pt-1">
                        <span
                          className={`block font-serif text-[19px] tracking-[0.14em] transition-colors duration-300 ${
                            isOn ? 'text-ivory' : 'text-ivory/55 group-hover:text-ivory/85'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`grid overflow-hidden transition-all duration-500 ease-spring ${
                            isOn ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <span className="min-h-0">
                            <span className="block text-[13px] leading-[1.9] text-ivory/50">
                              {step.body}
                            </span>
                            <span className="mt-2 block text-[11.5px] leading-relaxed text-gold/55">
                              {step.detail}
                            </span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </Reveal>

          {/* live firing dial */}
          <Reveal delay={100}>
            <div className="sticky top-28 rounded-2xl border border-ivory/[0.07] bg-surface/40 p-6 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] tracking-[0.24em] text-ivory/35">窑内温度</span>
                <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-ember/80">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                  燃烧中
                </span>
              </div>

              <p className="tnum mt-3 font-latin text-[46px] leading-none text-ivory">
                {[880, 1060, 1180, 1260, 1320][Math.min(active, 4)]}
                <span className="ml-1 text-[18px] text-ivory/35">℃</span>
              </p>

              <div className="relative mt-5 h-[3px] overflow-hidden rounded-full bg-ivory/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brass/60 via-gold to-ember transition-all duration-700 ease-spring"
                  style={{ width: `${18 + active * 16}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9.5px] tracking-[0.16em] text-ivory/25">
                <span>0h</span>
                <span>26h</span>
              </div>

              <div className="mt-6 space-y-3 border-t border-ivory/[0.07] pt-5">
                {[
                  ['松柴投入', `${320 + active * 96} 斤`],
                  ['守火人', '陈守拙 · 徒弟一名'],
                  ['当前阶段', CRAFT_STEPS[active].title],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-[11.5px] text-ivory/35">{k}</span>
                    <span className="tnum text-[11.5px] tracking-[0.06em] text-ivory/75">{v}</span>
                  </div>
                ))}
              </div>

              <p className="mt-6 border-t border-ivory/[0.07] pt-4 text-[10.5px] leading-[1.85] text-ivory/28">
                温度只是参考。真正决定成败的是火色的橙、还原的铁味，和窑里那一声闷响。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 匠人 ───────────────────────── */
export function ArtisanSection() {
  return (
    <section id="artisan" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-ivory/[0.08]">
                <img
                  src={ARTISAN.photo}
                  alt="窑主 陈守拙 在窑口查看火色"
                  className="aspect-[4/5] w-full object-cover opacity-90 grayscale-[0.35] transition-all duration-700 hover:scale-[1.03] hover:grayscale-0"
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-[15px] tracking-[0.26em] text-gold/90">
                    {ARTISAN.since}
                  </p>
                </div>
              </div>

              {/* seal card overlapping */}
              <div className="glass absolute -bottom-8 -right-3 w-[13rem] rounded-xl p-4 shadow-lift sm:-right-6">
                <p className="font-serif text-[17px] tracking-[0.18em] text-ivory">
                  {ARTISAN.name}
                </p>
                <p className="mt-1 text-[10px] tracking-[0.2em] text-ivory/35">{ARTISAN.title}</p>
                <div className="mt-3 h-px bg-ivory/10" />
                <p className="mt-3 font-serif text-[12.5px] leading-relaxed text-gold/70">
                  「{ARTISAN.quote}」
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90} className="order-1 lg:order-2">
            <span className="eyebrow">
              <span className="h-px w-8 bg-gold/50" />
              匠人
            </span>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.28] tracking-[0.03em] text-ivory">
              火不听话的时候，
              <br />
              才对
            </h2>
            <p className="mt-7 text-[14.5px] leading-[2.1] text-ivory/50">{ARTISAN.body}</p>

            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-ivory/[0.08] pt-7">
              <div>
                <p className="tnum font-latin text-[30px] leading-none text-ivory/90">27</p>
                <p className="mt-2 text-[10.5px] tracking-[0.14em] text-ivory/35">
                  年守窑 · 1998 至今
                </p>
              </div>
              <div>
                <p className="tnum font-latin text-[30px] leading-none text-ivory/90">38</p>
                <p className="mt-2 text-[10.5px] tracking-[0.14em] text-ivory/35">
                  窑 · 累计烧成窑次
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 反馈 ───────────────────────── */
export function VoicesSection() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold/50" />
              收到盏的人
            </span>
            <h2 className="mt-6 font-serif text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.3] tracking-[0.04em] text-ivory">
              他们说的，比我们说的可信
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-ivory/[0.07] bg-surface/30 p-6 transition-colors duration-500 hover:border-gold/20">
                <Quote className="h-5 w-5 text-gold/30" strokeWidth={1.5} />
                <blockquote className="mt-5 flex-1 text-[13.5px] leading-[2] text-ivory/60">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ivory/[0.07] pt-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/25 font-serif text-[12px] text-gold/80">
                    {t.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="block text-[12.5px] tracking-[0.1em] text-ivory/80">
                      {t.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] tracking-[0.14em] text-ivory/30">
                      {t.role} · {t.city}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 价格 / 服务 ───────────────────────── */
export function TiersSection({ onInspect }: { onInspect: () => void }) {
  return (
    <section id="tiers" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <div className="max-w-[40rem]">
            <span className="eyebrow">
              <span className="h-px w-8 bg-gold/50" />
              如何请一只盏
            </span>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.28] tracking-[0.03em] text-ivory">
              三种方式，没有第四种
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80}>
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-500 ${
                  tier.featured
                    ? 'border-gold/30 bg-gradient-to-b from-gold/[0.07] to-surface/40 shadow-glow'
                    : 'border-ivory/[0.07] bg-surface/30 hover:border-ivory/20'
                }`}
              >
                {tier.featured && (
                  <span className="absolute right-5 top-5 rounded-full border border-gold/35 bg-gold/10 px-2.5 py-1 text-[9.5px] tracking-[0.2em] text-gold">
                    最多人选
                  </span>
                )}

                <h3 className="font-serif text-[21px] tracking-[0.16em] text-ivory">{tier.name}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-ivory/40">{tier.line}</p>

                <p className="tnum mt-6 font-latin text-[28px] leading-none text-ivory/90">
                  {tier.from}
                </p>
                <p className="mt-2 text-[10px] tracking-[0.16em] text-ivory/25">含木盒与保价寄送</p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-ivory/[0.07] pt-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <ShieldCheck
                        className="mt-[3px] h-3 w-3 shrink-0 text-gold/60"
                        strokeWidth={2.2}
                      />
                      <span className="text-[12px] leading-relaxed text-ivory/55">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={onInspect}
                  className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[12.5px] tracking-[0.14em] transition-all duration-300 ${
                    tier.featured
                      ? 'bg-ivory text-void hover:bg-gold/90'
                      : 'border border-ivory/12 text-ivory/70 hover:border-gold/40 hover:text-ivory'
                  }`}
                >
                  {tier.cta}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 问答 ───────────────────────── */
export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-8 bg-gold/50" />
              问答
            </span>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.28] tracking-[0.03em] text-ivory">
              买之前，
              <br />
              你大概会问这些
            </h2>
            <p className="mt-6 max-w-[24rem] text-[13px] leading-[1.95] text-ivory/40">
              还有别的疑问？直接写信给窑口，通常 24 小时内回。
              <br />
              <a
                href="mailto:kiln@wuer.studio"
                className="mt-2 inline-block border-b border-gold/30 text-gold/85 transition-colors hover:border-gold"
              >
                kiln@wuer.studio
              </a>
            </p>

            <div className="mt-10 hidden lg:block">
              <BowlArt bowl={BOWLS[4]} className="aspect-square w-full max-w-[19rem]" shadow={false} />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="divide-y divide-ivory/[0.07] border-y border-ivory/[0.07]">
              {FAQS.map((faq, i) => {
                const isOn = open === i
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOn ? null : i)}
                      className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={isOn}
                    >
                      <span
                        className={`font-serif text-[15.5px] leading-relaxed tracking-[0.06em] transition-colors duration-300 ${
                          isOn ? 'text-gold' : 'text-ivory/80 group-hover:text-ivory'
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-400 ${
                          isOn ? 'rotate-45 border-gold/50 text-gold' : 'border-ivory/15 text-ivory/40'
                        }`}
                      >
                        <span className="absolute h-[9px] w-px bg-current" />
                        <span className="absolute h-px w-[9px] bg-current" />
                      </span>
                    </button>
                    <div
                      className={`grid overflow-hidden transition-all duration-500 ease-spring ${
                        isOn ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="min-h-0">
                        <p className="pb-5 pr-10 text-[13px] leading-[2] text-ivory/45">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
