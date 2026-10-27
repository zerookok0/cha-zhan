import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { NAV_LINKS } from '../lib/data'

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-ivory/[0.07] pb-10 pt-16">
      <div className="container-page">
        {/* closing mark */}
        <div className="flex flex-col items-center border-b border-ivory/[0.07] pb-14 text-center">
          <span className="seal h-12 w-12 rounded-[3px]">
            <span className="font-serif text-[17px] leading-none">无</span>
          </span>
          <p className="mt-6 max-w-[30rem] font-serif text-[clamp(1.15rem,2.4vw,1.5rem)] leading-[1.85] tracking-[0.08em] text-ivory/75">
            「一窑之内，能留下的不过二十之一。
            <br />
            留下来的，就该是唯一的那一只。」
          </p>
          <span className="mt-4 text-[10px] tracking-[0.3em] text-ivory/28">陈守拙 · 窑主</span>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-serif text-[15px] tracking-[0.3em] text-ivory">无二窑</p>
            <p className="mt-1 text-[8.5px] uppercase tracking-[0.34em] text-ivory/30">
              Wu Er Kiln · Jian Ware
            </p>
            <p className="mt-5 max-w-[24rem] text-[12px] leading-[1.95] text-ivory/35">
              福建南平建阳区水吉镇 · 龙窑。每周三、六出窑，出窑即上新。
              不接批发、不做复刻、不预留。
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-ivory/45">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-gold/50" strokeWidth={2} />
                建阳 · 水吉
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-gold/50" strokeWidth={2} />
                0599 · 2880 0412
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-gold/50" strokeWidth={2} />
                kiln@wuer.studio
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.24em] text-ivory/28">站内</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-[12px] tracking-[0.1em] text-ivory/55 transition-colors hover:text-gold"
                  >
                    {link.label}
                    <ArrowUpRight
                      className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100"
                      strokeWidth={2}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.24em] text-ivory/28">看到窑火</p>
            <ul className="mt-4 space-y-2.5 text-[12px] tracking-[0.1em] text-ivory/55">
              <li>
                <a href="#collection" className="transition-colors hover:text-gold">
                  当前窑次
                </a>
              </li>
              <li>
                <a href="#tiers" className="transition-colors hover:text-gold">
                  如何请盏
                </a>
              </li>
              <li>
                <a href="#artisan" className="transition-colors hover:text-gold">
                  窑主的话
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-gold">
                  常见问题
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-ivory/[0.07] pt-6 text-[10px] tracking-[0.14em] text-ivory/25 sm:flex-row">
          <span>© 2025 无二窑 · 一器一样，不复制</span>
          <span className="flex items-center gap-4">
            <span>器物为手作，尺寸与釉面以实物为准</span>
            <span className="hidden h-3 w-px bg-ivory/15 sm:block" />
            <span className="font-latin text-[11px] tracking-[0.2em]">Made in Jianyang</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
