import { useEffect, useState } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { NAV_LINKS } from '../lib/data'

type NavProps = {
  cartCount: number
  onOpenCart: () => void
}

/** Slim, letterpress-style top bar that condenses on scroll. */
export function Nav({ cartCount, onOpenCart }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sections.length || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.6] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const go = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-ivory/[0.07] bg-base/80 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="container-page flex h-[68px] items-center justify-between gap-6">
          {/* wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="group flex items-center gap-3"
            aria-label="无二窑 首页"
          >
            <span className="seal h-9 w-9 rounded-[3px] transition-colors duration-500 group-hover:border-gold/70">
              <span className="font-serif text-[13px] leading-none tracking-tight">无</span>
            </span>
            <span className="leading-none">
              <span className="block font-serif text-[15px] tracking-[0.3em] text-ivory">
                无二窑
              </span>
              <span className="mt-1 block text-[8.5px] uppercase tracking-[0.34em] text-ivory/35">
                Wu Er Kiln
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(link.href)
                  }}
                  className={`group relative px-4 py-2 text-[13px] tracking-[0.16em] transition-colors duration-300 ${
                    isActive ? 'text-gold' : 'text-ivory/55 hover:text-ivory'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gold/70 transition-transform duration-400 ease-spring ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 rounded-full border border-ivory/10 bg-ivory/[0.03] px-3.5 py-2 text-[12px] tracking-[0.14em] text-ivory/75 transition-colors duration-300 hover:border-gold/40 hover:text-ivory"
              aria-label={`查看盏匣，共 ${cartCount} 件`}
            >
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span className="hidden sm:inline">盏匣</span>
              <span
                className={`tnum grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[10px] transition-colors ${
                  cartCount > 0 ? 'bg-gold text-void' : 'bg-ivory/10 text-ivory/50'
                }`}
              >
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-ivory/10 text-ivory/70 transition-colors hover:border-gold/40 hover:text-ivory md:hidden"
              aria-label="打开菜单"
            >
              <Menu className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile sheet */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-void/80 backdrop-blur-md transition-opacity duration-400 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-[78%] max-w-[320px] border-l border-ivory/10 bg-surface/95 p-6 transition-transform duration-500 ease-spring ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-[13px] tracking-[0.3em] text-gold">无二窑</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full border border-ivory/10 text-ivory/60"
              aria-label="关闭菜单"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>

          <nav className="mt-10 flex flex-col" aria-label="移动导航">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  go(link.href)
                }}
                className="group flex items-baseline justify-between border-b border-ivory/[0.07] py-4"
              >
                <span className="font-serif text-[19px] tracking-[0.12em] text-ivory/85 group-hover:text-gold">
                  {link.label}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-ivory/25">
                  0{i + 1}
                </span>
              </a>
            ))}
          </nav>

          <p className="mt-10 text-[11.5px] leading-relaxed text-ivory/35">
            福建建阳 · 水吉
            <br />
            每周三、六出窑，出窑即上新。
          </p>
        </div>
      </div>
    </>
  )
}
