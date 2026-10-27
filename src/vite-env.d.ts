/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** WooCommerce 站点地址，例：https://shop.your-domain.com */
  readonly VITE_WC_STORE_URL?: string
  /** 结算页路径，默认 /checkout/ */
  readonly VITE_WC_CHECKOUT_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
