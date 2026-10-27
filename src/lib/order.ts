/* ────────────────────────────────────────────────────────────
   订单 / 结账数据层
   纯逻辑，不碰 UI。接真实支付网关时只需替换 payOrder()。
   ──────────────────────────────────────────────────────────── */

export type Delivery = 'sf' | 'pickup'
export type Payment = 'wechat' | 'alipay' | 'bank'

export type OrderDraft = {
  name: string
  phone: string
  region: string
  address: string
  note: string
  delivery: Delivery
  payment: Payment
  needInvoice: boolean
  invoiceTitle: string
  invoiceTax: string
}

export type Order = {
  no: string
  total: number
  count: number
  placedAt: string
  draft: OrderDraft
  /** 每只盏的出窑编号，随订单存档 */
  codes: string[]
}

export const EMPTY_DRAFT: OrderDraft = {
  name: '',
  phone: '',
  region: '',
  address: '',
  note: '',
  delivery: 'sf',
  payment: 'wechat',
  needInvoice: false,
  invoiceTitle: '',
  invoiceTax: '',
}

export const DELIVERY_LABEL: Record<Delivery, string> = {
  sf: '顺丰保价 · 双层木盒',
  pickup: '到窑口自取 · 建阳水吉',
}

export const PAYMENT_LABEL: Record<Payment, string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  bank: '银行转账（对公）',
}

/** 表单校验 —— 返回字段名到错误文案的映射 */
export function validateDraft(draft: OrderDraft): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!draft.name.trim()) errors.name = '请填写收货人姓名'
  else if (draft.name.trim().length > 24) errors.name = '姓名过长'

  if (!draft.phone.trim()) errors.phone = '请填写手机号'
  else if (!/^1[3-9]\d{9}$/.test(draft.phone.trim())) errors.phone = '手机号格式不对，应为 11 位'

  if (!draft.region.trim()) errors.region = '请填写省 / 市 / 区'

  if (draft.delivery === 'sf') {
    if (!draft.address.trim()) errors.address = '请填写详细地址'
    else if (draft.address.trim().length < 6) errors.address = '地址太短，请补全门牌号'
  }

  if (draft.needInvoice) {
    if (!draft.invoiceTitle.trim()) errors.invoiceTitle = '请填写发票抬头'
    if (draft.invoiceTax && !/^[0-9A-Z]{15,20}$/.test(draft.invoiceTax.trim())) {
      errors.invoiceTax = '税号应为 15–20 位数字或大写字母'
    }
  }

  return errors
}

/** WU-38-7F2K 这样的一串，跟盏的出窑编号一起留档 */
export function makeOrderNo(): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let tail = ''
  for (let i = 0; i < 4; i += 1) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `WU-38-${tail}`
}

/**
 * 提交订单。
 * 目前是本地模拟（1.6 秒后返回成功）。
 * 接真实支付时，把这里换成对网关的请求即可，调用方不用改。
 */
export function payOrder(
  draft: OrderDraft,
  total: number,
  codes: string[],
): Promise<Order> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        no: makeOrderNo(),
        total,
        count: codes.length,
        placedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        draft,
        codes,
      })
    }, 1600)
  })
}

/* ── 盏匣持久化，刷新页面不丢 ── */
const BAG_KEY = 'wuer.bag.v1'

export function loadBag(): string[] {
  try {
    const raw = window.localStorage.getItem(BAG_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

export function saveBag(ids: string[]): void {
  try {
    window.localStorage.setItem(BAG_KEY, JSON.stringify(ids))
  } catch {
    /* 隐私模式下静默失败 */
  }
}
