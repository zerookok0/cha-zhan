import { Check, Download, Package, ShieldCheck } from 'lucide-react'
import type { Order } from '../../lib/order'
import { DELIVERY_LABEL, PAYMENT_LABEL } from '../../lib/order'

type SuccessStepProps = {
  order: Order
  onDone: () => void
}

export function SuccessStep({ order, onDone }: SuccessStepProps) {
  const { draft } = order

  const rows: Array<[string, string]> = [
    ['收货人', `${draft.name} · ${draft.phone}`],
    ['寄送方式', DELIVERY_LABEL[draft.delivery]],
    ...(draft.delivery === 'sf' ? ([['地址', `${draft.region} ${draft.address}`]] as Array<[string, string]>) : []),
    ['支付方式', PAYMENT_LABEL[draft.payment]],
    ...(draft.note.trim() ? ([['留言', draft.note.trim()]] as Array<[string, string]>) : []),
    ...(draft.needInvoice
      ? ([['发票', draft.invoiceTitle + (draft.invoiceTax ? ` · ${draft.invoiceTax}` : '')]] as Array<
          [string, string]
        >)
      : []),
  ]

  return (
    <div className="animate-pop">
      {/* seal */}
      <div className="flex flex-col items-center text-center">
        <span className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 animate-breathe rounded-full border border-gold/30 bg-gold/[0.07]" />
          <Check className="relative h-7 w-7 text-gold" strokeWidth={1.8} />
        </span>
        <h3 className="mt-5 font-serif text-[22px] tracking-[0.16em] text-ivory">这一只，归你了</h3>
        <p className="mt-2.5 max-w-[22rem] text-[12px] leading-[1.95] text-ivory/40">
          窑主会在 24 小时内与你确认，然后亲手上蜡、包木盒。
          盏的出窑编号已经跟这一单绑在一起，永久对应，不会再有第二只。
        </p>
      </div>

      {/* order number */}
      <div className="mt-7 rounded-xl border border-gold/25 bg-gradient-to-b from-gold/[0.07] to-transparent px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] text-ivory/35">订单号</span>
          <span className="font-latin text-[17px] tracking-[0.16em] text-gold">
            {order.no}
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-gold/15 pt-2.5">
          <span className="text-[10px] tracking-[0.16em] text-ivory/30">{order.placedAt}</span>
          <span className="tnum text-[15px] text-ivory/85">
            ¥{order.total.toLocaleString('zh-CN')}
          </span>
        </div>
      </div>

      {/* firing codes */}
      <div className="mt-4 overflow-hidden rounded-xl border border-ivory/[0.08]">
        <div className="flex items-center justify-between border-b border-ivory/[0.07] bg-ivory/[0.02] px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-ivory/40">
            <Package className="h-2.5 w-2.5" strokeWidth={2} />
            已为你留档
          </span>
          <span className="text-[9px] tracking-[0.16em] text-ivory/25">
            {order.count} 只
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 px-4 py-3">
          {order.codes.map((code) => (
            <span
              key={code}
              className="tnum rounded-sm border border-gold/25 bg-gold/[0.05] px-2 py-1 text-[10px] tracking-[0.14em] text-gold/85"
            >
              {code}
            </span>
          ))}
        </div>
      </div>

      {/* details */}
      <dl className="mt-4 divide-y divide-ivory/[0.05] rounded-xl border border-ivory/[0.08]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-5 px-4 py-2.5">
            <dt className="shrink-0 text-[11px] text-ivory/32">{k}</dt>
            <dd className="text-right text-[11.5px] leading-relaxed text-ivory/75">{v}</dd>
          </div>
        ))}
      </dl>

      {/* what happens next */}
      <div className="mt-5 rounded-xl border border-ivory/[0.08] bg-ivory/[0.015] px-4 py-4">
        <p className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-gold/75">
          <ShieldCheck className="h-3 w-3" strokeWidth={2} />
          接下来会发生什么
        </p>
        <ol className="mt-3 space-y-2.5">
          {[
            '窑主加你微信，发这一只的六面窑照',
            '确认包装，木盒内衬 + 保价单，当日寄出',
            '收到后七日内可无理由退回，运费我们承担',
          ].map((line, i) => (
            <li key={line} className="flex gap-2.5">
              <span className="tnum mt-px shrink-0 text-[9.5px] text-gold/50">0{i + 1}</span>
              <span className="text-[11px] leading-relaxed text-ivory/45">{line}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ivory/12 py-3 text-[12px] tracking-[0.12em] text-ivory/60 transition-colors hover:border-ivory/30 hover:text-ivory"
        >
          <Download className="h-3 w-3" strokeWidth={2} />
          打印凭据
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded-full bg-ivory py-3 text-[12.5px] font-medium tracking-[0.12em] text-void transition-colors hover:bg-gold/90"
        >
          回到窑口
        </button>
      </div>

      <p className="mt-4 text-center text-[9.5px] leading-relaxed tracking-[0.06em] text-ivory/22">
        凭订单号可随时来信查询：kiln@wuer.studio
      </p>
    </div>
  )
}
