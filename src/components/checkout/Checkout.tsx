import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckoutHeader } from './CheckoutHeader'
import { OrderSummary } from './OrderSummary'
import { AddressStep } from './AddressStep'
import { PaymentStep } from './PaymentStep'
import { SuccessStep } from './SuccessStep'
import type { Bowl } from '../../lib/data'
import {
  EMPTY_DRAFT,
  payOrder,
  validateDraft,
  type Order,
  type OrderDraft,
} from '../../lib/order'

type CheckoutProps = {
  open: boolean
  bowls: Bowl[]
  onClose: () => void
  onDone: () => void
}

export function Checkout({ open, bowls, onClose, onDone }: CheckoutProps) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<OrderDraft>(EMPTY_DRAFT)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  const total = useMemo(() => bowls.reduce((sum, b) => sum + b.price, 0), [bowls])

  /* reset whenever it opens */
  useEffect(() => {
    if (!open) return
    setStep(1)
    setErrors({})
    setSubmitting(false)
    setOrder(null)
  }, [open])

  /* lock the page behind the panel */
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

  const change = useCallback(
    <K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => {
        if (!prev[key as string]) return prev
        const next = { ...prev }
        delete next[key as string]
        return next
      })
    },
    [],
  )

  /** step 1 → 2 */
  const goPayment = () => {
    const found = validateDraft(draft)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    setErrors({})
    setStep(2)
  }

  /** step 2 → 3 */
  const submit = async () => {
    const found = validateDraft(draft)
    if (Object.keys(found).length > 0) {
      setErrors({ ...found, __form: '还有几项没填好，返回上一步补齐后再来。' })
      return
    }
    setSubmitting(true)
    try {
      const placed = await payOrder(
        draft,
        total,
        bowls.map((b) => b.code),
      )
      setOrder(placed)
      setStep(3)
    } catch {
      setErrors({ __form: '提交没成功，请稍后再试，或直接写信给窑主。' })
    } finally {
      setSubmitting(false)
    }
  }

  const body = () => {
    if (!bowls.length) {
      return (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="font-serif text-[16px] tracking-[0.12em] text-ivory/50">盏匣是空的</p>
          <p className="mt-2 max-w-[18rem] text-[11.5px] leading-relaxed text-ivory/28">
            先把看中的盏放进来，再来结账。
          </p>
          <button
            type="button"
            onClick={onDone}
            className="mt-6 rounded-full border border-gold/40 px-5 py-2.5 text-[12px] tracking-[0.14em] text-gold transition-colors hover:bg-gold/10"
          >
            去看孤品
          </button>
        </div>
      )
    }

    if (step === 3 && order) {
      return <SuccessStep order={order} onDone={onDone} />
    }

    return (
      <>
        <OrderSummary bowls={bowls} />
        <div className="mt-5">
          {step === 1 ? (
            <AddressStep
              draft={draft}
              errors={errors}
              onChange={change}
              onSubmit={goPayment}
              submitting={false}
            />
          ) : (
            <PaymentStep
              draft={draft}
              errors={{ ...errors, __count: String(bowls.length) }}
              total={total}
              submitting={submitting}
              onChange={change}
              onSubmit={submit}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </>
    )
  }

  return (
    <div
      className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="结账"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="关闭结账"
        onClick={onClose}
        className={`absolute inset-0 bg-void/90 backdrop-blur-md transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-l border-ivory/10 bg-[#0B0908] transition-transform duration-500 ease-spring ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <CheckoutHeader
          step={step}
          onBack={() => setStep((s) => Math.max(1, s - 1))}
          onClose={onClose}
        />
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">{body()}</div>
      </div>
    </div>
  )
}
