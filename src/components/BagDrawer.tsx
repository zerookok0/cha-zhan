import { useEffect } from 'react'
import { ArrowRight, ShieldCheck, Truck, Trash2, X } from 'lucide-react'
import type { Bowl } from '../lib/data'
import { BowlVisual } from './BowlVisual'

type BagDrawerProps = {
  open: boolean
  bowls: Bowl[]
  onClose: () => void
  onRemove: (id: string) => void
  onBrowse: () => void
  onCheckout: () => void
}

export function BagDrawer({
  open,
  bowls,
  onClose,
  onRemove,
  onBrowse,
  onCheckout,
}: BagDrawerProps) {
  useEffect(() => {
    if (!open) return
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
  }, [open, onClose])

  const total = bowls.reduce((sum, b) => sum + b.price, 0)

  return (
    <div
      className={`fixed inset-0 z-[90] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="盏匣"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="关闭盏匣"
        onClick={onClose}
        className={`absolute inset-0 bg-void/85 backdrop-blur-md transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-ivory/10 bg-[#0E0C0A] transition-transform duration-500 ease-spring ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-ivory/[0.08] px-5 py-4">
          <div>
            <h2 className="font-serif text-[17px] tracking-[0.22em] text-ivory">盏匣</h2>
            <p className="mt-1 text-[10px] tracking-[0.18em] text-ivory/30">
              {bowls.length > 0 ? `${bowls.length} 只 · 皆为孤品` : '尚未放入茶盏'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-ivory/10 text-ivory/60 transition-colors hover:border-ivory/30 hover:text-ivory"
            aria-label="关闭盏匣"
          >
            <X className="h-4 w-4" strokeWidth={1.9} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {bowls.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-ivory/[0.08]">
                <span className="font-serif text-[22px] text-ivory/20">盏</span>
              </div>
              <p className="mt-6 font-serif text-[15px] tracking-[0.12em] text-ivory/50">
                匣子还是空的
              </p>
              <p className="mt-2 max-w-[16rem] text-[12px] leading-relaxed text-ivory/28">
                看中的盏先放进来，不占库存、不生成订单 —— 只是替你先收着。
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onBrowse()
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[12px] tracking-[0.14em] text-gold transition-colors hover:bg-gold/10"
              >
                去看孤品
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {bowls.map((bowl) => (
                <li
                  key={bowl.id}
                  className="flex gap-3 rounded-xl border border-ivory/[0.07] bg-surface/40 p-3"
                >
                  <div className="w-16 shrink-0 rounded-lg bg-void/60">
                    <BowlVisual
                      bowl={bowl}
                      className="aspect-square w-full"
                      interactive={false}
                      shadow={false}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-serif text-[15px] tracking-[0.12em] text-ivory">
                          {bowl.name}
                        </p>
                        <p className="mt-0.5 text-[9.5px] tracking-[0.16em] text-ivory/30">
                          {bowl.code} · {bowl.family}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(bowl.id)}
                        className="shrink-0 rounded-full p-1 text-ivory/25 transition-colors hover:text-ember"
                        aria-label={`从盏匣取出 ${bowl.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-[9px] tracking-[0.14em] text-ivory/25">唯一一只</span>
                      <span className="tnum text-[13px] text-ivory/85">
                        ¥{bowl.price.toLocaleString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {bowls.length > 0 && (
          <footer className="border-t border-ivory/[0.08] px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[11.5px] tracking-[0.14em] text-ivory/40">合计</span>
              <span className="tnum font-latin text-[24px] leading-none text-ivory">
                ¥{total.toLocaleString('zh-CN')}
              </span>
            </div>
            <p className="mt-1.5 text-right text-[9.5px] tracking-[0.14em] text-ivory/25">
              含木盒与保价寄送
            </p>

            <button
              type="button"
              onClick={() => {
                onClose()
                onCheckout()
              }}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ivory py-3.5 text-[13px] font-medium tracking-[0.14em] text-void transition-colors hover:bg-gold/90"
            >
              去结账 · 填收货信息
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.2}
              />
            </button>

            <p className="mt-2.5 text-center text-[9.5px] tracking-[0.1em] text-ivory/25">
              三步完成 · 也可先与窑主视频看盏再付
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] tracking-[0.08em] text-ivory/30">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-celadon/70" strokeWidth={2} />
                七日鉴赏期
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-3 w-3 text-celadon/70" strokeWidth={2} />
                顺丰保价
              </span>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
