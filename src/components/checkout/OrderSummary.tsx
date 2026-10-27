import { Truck, ShieldCheck } from 'lucide-react'
import type { Bowl } from '../../lib/data'
import { BowlVisual } from '../BowlVisual'

type OrderSummaryProps = {
  bowls: Bowl[]
  compact?: boolean
}

export function OrderSummary({ bowls, compact = false }: OrderSummaryProps) {
  const total = bowls.reduce((sum, b) => sum + b.price, 0)

  if (compact) {
    return (
      <div className="rounded-xl border border-ivory/[0.08] bg-ivory/[0.02] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] tracking-[0.16em] text-ivory/35">
            {bowls.length} 只盏 · 均为孤品
          </span>
          <span className="tnum text-[15px] text-ivory">
            ¥{total.toLocaleString('zh-CN')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-ivory/[0.08] overflow-hidden">
      <div className="flex items-center justify-between border-b border-ivory/[0.07] bg-ivory/[0.02] px-4 py-2.5">
        <span className="text-[10px] tracking-[0.2em] text-ivory/40">这一单</span>
        <span className="text-[9px] tracking-[0.16em] text-ivory/25">
          {bowls.length} 只 · 皆为孤品
        </span>
      </div>

      <ul className="divide-y divide-ivory/[0.05]">
        {bowls.map((bowl) => (
          <li key={bowl.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-11 shrink-0 rounded-lg bg-void/60">
              <BowlVisual
                bowl={bowl}
                className="aspect-square w-full"
                interactive={false}
                shadow={false}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[14px] tracking-[0.12em] text-ivory/90">
                {bowl.name}
              </p>
              <p className="mt-0.5 text-[9px] tracking-[0.16em] text-ivory/28">
                {bowl.code} · {bowl.family}
              </p>
            </div>
            <span className="tnum shrink-0 text-[12.5px] text-ivory/70">
              ¥{bowl.price.toLocaleString('zh-CN')}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-ivory/[0.07] bg-ivory/[0.015] px-4 py-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[11.5px] tracking-[0.14em] text-ivory/40">合计</span>
          <span className="tnum font-latin text-[22px] leading-none text-ivory">
            ¥{total.toLocaleString('zh-CN')}
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[9.5px] tracking-[0.1em] text-ivory/25">
          <span className="flex items-center gap-1">
            <Truck className="h-2.5 w-2.5 text-celadon/60" strokeWidth={2} />
            顺丰保价 · 双层木盒
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5 text-celadon/60" strokeWidth={2} />
            七日鉴赏期
          </span>
        </div>
      </div>
    </div>
  )
}
