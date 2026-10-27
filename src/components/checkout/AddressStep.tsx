import { MapPin, Truck, Store } from 'lucide-react'
import type { Delivery, OrderDraft } from '../../lib/order'
import { Field, inputClass } from './Field'

type AddressStepProps = {
  draft: OrderDraft
  errors: Record<string, string>
  onChange: <K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) => void
  onSubmit: () => void
  submitting: boolean
}

const DELIVERY_OPTIONS: Array<{ id: Delivery; label: string; sub: string; price: string }> = [
  { id: 'sf', label: '顺丰保价', sub: '双层木盒 · 三层气泡', price: '包邮' },
  { id: 'pickup', label: '窑口自取', sub: '建阳水吉 · 需预约', price: '免运费' },
]

export function AddressStep({ draft, errors, onChange, onSubmit, submitting }: AddressStepProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      noValidate
    >
      <div>
        <span className="flex items-center gap-1.5 text-[10px] tracking-[0.22em] text-gold/70">
          <MapPin className="h-3 w-3" strokeWidth={2} />
          收货信息
        </span>
        <p className="mt-2 text-[11.5px] leading-relaxed text-ivory/30">
          盏会用双层木盒装，木盒外面再套纸箱。填完这一页才能选支付方式。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="收货人" htmlFor="co-name" error={errors.name}>
          <input
            id="co-name"
            type="text"
            value={draft.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="怎么称呼"
            autoComplete="name"
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field label="手机号" htmlFor="co-phone" error={errors.phone} hint="用于通知发货">
          <input
            id="co-phone"
            type="tel"
            inputMode="numeric"
            value={draft.phone}
            onChange={(e) => onChange('phone', e.target.value.replace(/\D/g, '').slice(0, 11))}
            placeholder="11 位手机号"
            autoComplete="tel"
            className={inputClass(Boolean(errors.phone))}
          />
        </Field>
      </div>

      <Field label="省 / 市 / 区" htmlFor="co-region" error={errors.region}>
        <input
          id="co-region"
          type="text"
          value={draft.region}
          onChange={(e) => onChange('region', e.target.value)}
          placeholder="例如：福建省 南平市 建阳区"
          autoComplete="address-level2"
          className={inputClass(Boolean(errors.region))}
        />
      </Field>

      {/* delivery choice */}
      <div>
        <span className="text-[11px] tracking-[0.16em] text-ivory/45">寄送方式</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {DELIVERY_OPTIONS.map((opt) => {
            const isOn = draft.delivery === opt.id
            const Icon = opt.id === 'sf' ? Truck : Store
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange('delivery', opt.id)}
                className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-left transition-all duration-300 ${
                  isOn
                    ? 'border-gold/45 bg-gold/[0.07]'
                    : 'border-ivory/10 hover:border-ivory/25'
                }`}
                aria-pressed={isOn}
              >
                <Icon
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isOn ? 'text-gold' : 'text-ivory/35'}`}
                  strokeWidth={1.9}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={`text-[12.5px] tracking-[0.08em] ${
                        isOn ? 'text-ivory' : 'text-ivory/65'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className={`text-[9.5px] ${isOn ? 'text-gold/80' : 'text-ivory/25'}`}>
                      {opt.price}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[9.5px] tracking-[0.06em] text-ivory/30">
                    {opt.sub}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {draft.delivery === 'sf' && (
        <Field label="详细地址" htmlFor="co-address" error={errors.address}>
          <textarea
            id="co-address"
            rows={2}
            value={draft.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="街道、门牌号、楼层房间号"
            autoComplete="street-address"
            className={`${inputClass(Boolean(errors.address))} resize-none leading-relaxed`}
          />
        </Field>
      )}

      <Field label="给窑主的留言" htmlFor="co-note" optional>
        <textarea
          id="co-note"
          rows={2}
          value={draft.note}
          onChange={(e) => onChange('note', e.target.value)}
          placeholder="想刻字、想约时间视频看盏，都可以写在这里"
          className={`${inputClass()} resize-none leading-relaxed`}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="group mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-ivory py-3.5 text-[13px] font-medium tracking-[0.14em] text-void transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        下一步 · 选择支付方式
      </button>
    </form>
  )
}
