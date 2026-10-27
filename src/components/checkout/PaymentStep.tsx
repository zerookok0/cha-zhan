import { useState } from 'react'
import { ArrowLeft, Check, Copy, Landmark, Lock, MessageCircle, Receipt } from 'lucide-react'
import { PAYMENT_LABEL, type OrderDraft, type Payment } from '../../lib/order'
import { Field, inputClass } from './Field'

type PaymentStepProps = {
  draft: OrderDraft
  errors: Record<string, string>
  total: number
  submitting: boolean
  onChange: <K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) => void
  onSubmit: () => void
  onBack: () => void
}

const METHODS: Array<{
  id: Payment
  icon: typeof MessageCircle
  label: string
  sub: string
  accent: string
}> = [
  {
    id: 'wechat',
    icon: MessageCircle,
    label: '微信支付',
    sub: '扫码付款，即时到账',
    accent: '#4ADE80',
  },
  { id: 'alipay', icon: Lock, label: '支付宝', sub: '担保交易 · 支持花呗', accent: '#38BDF8' },
  {
    id: 'bank',
    icon: Landmark,
    label: '银行转账（对公）',
    sub: '适合企业采购 · 需 1 个工作日',
    accent: '#C9A96A',
  },
]

const BANK = {
  name: '建阳市无二陶瓷文化有限公司',
  bank: '中国工商银行 建阳支行',
  account: '1408 0102 0900 0231 887',
}

export function PaymentStep({
  draft,
  errors,
  total,
  submitting,
  onChange,
  onSubmit,
  onBack,
}: PaymentStepProps) {
  const [copied, setCopied] = useState(false)

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK.account.replace(/\s/g, ''))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* 剪贴板不可用时忽略 */
    }
  }

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
          <Lock className="h-3 w-3" strokeWidth={2} />
          支付方式
        </span>
        <p className="mt-2 text-[11.5px] leading-relaxed text-ivory/30">
          这一单共 {draft.delivery === 'sf' ? '寄送' : '自取'} {errors.__count ?? ''}
          只盏，付款后窑主会亲自打包。
        </p>
      </div>

      <div className="space-y-2">
        {METHODS.map((m) => {
          const isOn = draft.payment === m.id
          const Icon = m.icon
          return (
            <div key={m.id}>
              <button
                type="button"
                onClick={() => onChange('payment', m.id)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-all duration-300 ${
                  isOn ? 'border-gold/45 bg-gold/[0.06]' : 'border-ivory/10 hover:border-ivory/25'
                }`}
                aria-pressed={isOn}
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors"
                  style={{
                    borderColor: isOn ? `${m.accent}66` : 'rgba(242,235,224,0.1)',
                    background: isOn ? `${m.accent}14` : 'transparent',
                  }}
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    style={{ color: isOn ? m.accent : 'rgba(242,235,224,0.35)' }}
                    strokeWidth={2}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[13px] tracking-[0.08em] ${
                      isOn ? 'text-ivory' : 'text-ivory/70'
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="mt-0.5 block text-[9.5px] tracking-[0.06em] text-ivory/30">
                    {m.sub}
                  </span>
                </span>
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-all ${
                    isOn ? 'border-gold bg-gold' : 'border-ivory/20'
                  }`}
                >
                  {isOn && <Check className="h-2.5 w-2.5 text-void" strokeWidth={3.5} />}
                </span>
              </button>

              {/* bank details unfold inline */}
              {m.id === 'bank' && isOn && (
                <div className="animate-pop mt-2 rounded-lg border border-ivory/[0.08] bg-void/40 px-4 py-3.5">
                  <p className="text-[10px] tracking-[0.16em] text-ivory/30">收款信息</p>
                  <dl className="mt-2.5 space-y-1.5 text-[11.5px]">
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-ivory/30">户名</dt>
                      <dd className="text-right text-ivory/75">{BANK.name}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-ivory/30">开户行</dt>
                      <dd className="text-right text-ivory/75">{BANK.bank}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="shrink-0 text-ivory/30">账号</dt>
                      <dd className="flex items-center gap-1.5 text-right">
                        <span className="tnum tracking-[0.04em] text-ivory/85">{BANK.account}</span>
                        <button
                          type="button"
                          onClick={copyAccount}
                          className="rounded p-0.5 text-ivory/30 transition-colors hover:text-gold"
                          aria-label="复制账号"
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-celadon" strokeWidth={2.5} />
                          ) : (
                            <Copy className="h-3 w-3" strokeWidth={2} />
                          )}
                        </button>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2.5 border-t border-ivory/[0.06] pt-2 text-[9.5px] leading-relaxed text-ivory/25">
                    转账时请在附言填写手机号后四位，方便对账。到账后我们才开始打包。
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* invoice */}
      <div className="rounded-lg border border-ivory/10">
        <button
          type="button"
          onClick={() => onChange('needInvoice', !draft.needInvoice)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
          aria-pressed={draft.needInvoice}
        >
          <span className="flex items-center gap-2">
            <Receipt
              className={`h-3.5 w-3.5 ${draft.needInvoice ? 'text-gold' : 'text-ivory/35'}`}
              strokeWidth={1.9}
            />
            <span className="text-[12px] tracking-[0.08em] text-ivory/70">需要发票</span>
          </span>
          <span
            className={`relative h-4 w-7 shrink-0 rounded-full transition-colors duration-300 ${
              draft.needInvoice ? 'bg-gold/70' : 'bg-ivory/15'
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-ivory transition-all duration-300 ${
                draft.needInvoice ? 'left-3.5' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        {draft.needInvoice && (
          <div className="animate-pop space-y-3 border-t border-ivory/[0.07] px-4 py-3.5">
            <Field label="发票抬头" htmlFor="co-inv-title" error={errors.invoiceTitle}>
              <input
                id="co-inv-title"
                type="text"
                value={draft.invoiceTitle}
                onChange={(e) => onChange('invoiceTitle', e.target.value)}
                placeholder="个人姓名 或 公司全称"
                className={inputClass(Boolean(errors.invoiceTitle))}
              />
            </Field>
            <Field label="税号" htmlFor="co-inv-tax" error={errors.invoiceTax} optional>
              <input
                id="co-inv-tax"
                type="text"
                value={draft.invoiceTax}
                onChange={(e) => onChange('invoiceTax', e.target.value.toUpperCase())}
                placeholder="企业抬头才需要填写"
                className={inputClass(Boolean(errors.invoiceTax))}
              />
            </Field>
          </div>
        )}
      </div>

      {errors.__form && (
        <p className="rounded-lg border border-ember/40 bg-ember/[0.07] px-3.5 py-2.5 text-[11px] leading-relaxed text-ember">
          {errors.__form}
        </p>
      )}

      <div className="flex items-center gap-2 border-t border-ivory/[0.08] pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ivory/12 px-4 py-3 text-[12px] tracking-[0.1em] text-ivory/55 transition-colors hover:border-ivory/30 hover:text-ivory"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          返回
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-ivory py-3.5 text-[13px] font-medium tracking-[0.14em] text-void transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-void/30 border-t-void" />
              正在提交…
            </>
          ) : (
            <>支付 ¥{total.toLocaleString('zh-CN')} · {PAYMENT_LABEL[draft.payment]}</>
          )}
        </button>
      </div>

      <p className="text-center text-[9.5px] leading-relaxed tracking-[0.06em] text-ivory/22">
        点击即表示同意《孤品交易条款》· 盏为手作孤品，非质量问题不支持退换
      </p>
    </form>
  )
}
