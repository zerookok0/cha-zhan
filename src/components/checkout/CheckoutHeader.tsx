import { ArrowLeft, X } from 'lucide-react'

const STEPS = [
  { id: 1, label: '收货' },
  { id: 2, label: '支付' },
  { id: 3, label: '完成' },
]

type CheckoutHeaderProps = {
  step: number
  onBack: () => void
  onClose: () => void
}

export function CheckoutHeader({ step, onBack, onClose }: CheckoutHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-ivory/[0.08] bg-[#0B0908]/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="grid h-7 w-7 place-items-center rounded-full border border-ivory/12 text-ivory/50 transition-colors hover:border-ivory/30 hover:text-ivory"
              aria-label="返回上一步"
            >
              <ArrowLeft className="h-3 w-3" strokeWidth={2} />
            </button>
          )}
          <div>
            <h2 className="font-serif text-[17px] tracking-[0.22em] text-ivory">结账</h2>
            <p className="mt-1 text-[9.5px] tracking-[0.18em] text-ivory/30">
              孤品不占库存 · 付款后为你留盏
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full border border-ivory/10 text-ivory/60 transition-colors hover:border-ivory/30 hover:text-ivory"
          aria-label="关闭结账"
        >
          <X className="h-4 w-4" strokeWidth={1.9} />
        </button>
      </div>

      {/* step rail */}
      <div className="flex items-center gap-2 px-5 pb-3.5 sm:px-7">
        {STEPS.map((s, i) => {
          const done = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[9px] transition-all duration-400 ${
                  done
                    ? 'border-gold/50 bg-gold/15 text-gold'
                    : active
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-ivory/12 text-ivory/25'
                }`}
              >
                {done ? '✓' : s.id}
              </span>
              <span
                className={`text-[10px] tracking-[0.16em] transition-colors duration-300 ${
                  active ? 'text-ivory/80' : done ? 'text-gold/60' : 'text-ivory/25'
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`h-px flex-1 transition-colors duration-400 ${
                    done ? 'bg-gold/40' : 'bg-ivory/10'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </header>
  )
}
