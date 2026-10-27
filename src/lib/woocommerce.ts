/* ────────────────────────────────────────────────────────────
   WooCommerce 结账对接
   本站只做展示与「盏匣」，真正的落单、收货信息、支付都在 Woo 完成。
   ──────────────────────────────────────────────────────────── */

import type { Bowl } from './data'

/** 例：https://shop.your-domain.com（不要带结尾斜杠） */
const rawStore = (import.meta.env.VITE_WC_STORE_URL ?? '').trim()

export const WC_STORE_URL = rawStore.replace(/\/+$/, '')

/** 结算页路径，取决于你站点语言设置：/checkout/ 或 /zh/checkout/ */
export const WC_CHECKOUT_PATH = (import.meta.env.VITE_WC_CHECKOUT_PATH ?? '/checkout/').trim()

/**
 * 盏 → WooCommerce 商品 ID。
 * 填你在 WP 后台「产品」列表里看到的那串数字（?post=123 里的 123）。
 * 没填的会退回用盏的出窑编号当 SKU 去匹配（WooCommerce 的
 * add-to-cart 参数同时接受 product ID 与 SKU）。
 */
export const PRODUCT_IDS: Record<string, number> = {
  yelan: 41,
  hanshan: 42,
  qiuSheng: 43,
  qixia: 44,
  konggu: 45,
  chenbi: 46,
}

/** 单次加购用商品 ID，取不到就用 SKU（出窑编号） */
export function productRef(bowl: Bowl): string {
  const id = PRODUCT_IDS[bowl.id]
  return id ? String(id) : bowl.code
}

export function isWooReady(): boolean {
  return WC_STORE_URL.length > 0
}

/**
 * 生成「加购并跳到结算」的链接。
 * WooCommerce 的 add-to-cart 参数支持逗号分隔多个商品，
 * 每个商品各加 1 件，所以不必先跳购物车。
 */
export function buildCheckoutUrl(bowls: Bowl[]): string | null {
  if (!WC_STORE_URL || bowls.length === 0) return null

  const refs = bowls.map(productRef).filter(Boolean)
  if (refs.length === 0) return null

  const base = `${WC_STORE_URL}${WC_CHECKOUT_PATH.startsWith('/') ? '' : '/'}${WC_CHECKOUT_PATH}`
  const url = new URL(base)
  url.searchParams.set('add-to-cart', refs.join(','))

  // 一只盏时显式给个数量，避免主题默认值覆盖
  if (refs.length === 1) url.searchParams.set('quantity', '1')

  return url.toString()
}

/** 直接跳转；返回 false 表示还没配置站点地址 */
export function goToWooCheckout(bowls: Bowl[]): boolean {
  const url = buildCheckoutUrl(bowls)
  if (!url) return false
  window.location.assign(url)
  return true
}
