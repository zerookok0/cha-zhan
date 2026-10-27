import { useCallback, useEffect, useMemo, useState } from 'react'
import { Atmosphere } from './components/Atmosphere'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Collection } from './components/Collection'
import { BowlDetail } from './components/BowlDetail'
import { BagDrawer } from './components/BagDrawer'
import { Checkout } from './components/checkout/Checkout'
import { Footer } from './components/Footer'
import {
  ArtisanSection,
  CraftSection,
  FaqSection,
  KilnSection,
  TiersSection,
  VoicesSection,
} from './components/Sections'
import { BOWLS, type Bowl } from './lib/data'
import { loadBag, saveBag } from './lib/order'
import { goToWooCheckout, isWooReady } from './lib/woocommerce'

function App() {
  const [detail, setDetail] = useState<Bowl | null>(null)
  const [bagOpen, setBagOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [bagIds, setBagIds] = useState<string[]>(() => loadBag())

  useEffect(() => {
    saveBag(bagIds)
  }, [bagIds])

  const bagBowls = useMemo(
    () => BOWLS.filter((b) => bagIds.includes(b.id)),
    [bagIds],
  )

  const inBag = useCallback((id: string) => bagIds.includes(id), [bagIds])

  const toggleBag = useCallback((bowl: Bowl) => {
    setBagIds((prev) =>
      prev.includes(bowl.id) ? prev.filter((id) => id !== bowl.id) : [...prev, bowl.id],
    )
  }, [])

  const scrollToCollection = useCallback(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const inspectFirst = useCallback(() => {
    setDetail(BOWLS[0])
  }, [])

  const openCheckout = useCallback(() => {
    setDetail(null)
    setBagOpen(false)

    /* 已配置 WooCommerce：把盏直接加进 Woo 购物车并跳到它的结算页，
       支付插件、收货信息、运费规则都在 WordPress 那边生效。 */
    if (isWooReady() && goToWooCheckout(bagBowls)) return

    /**
     * 没配 VITE_WC_STORE_URL 时走站内的演示结账，
     * 方便在本地预览完整流程。
     */
    setCheckoutOpen(true)
  }, [bagBowls])

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false)
  }, [])

  const finishCheckout = useCallback(() => {
    setCheckoutOpen(false)
    setBagIds([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="relative min-h-screen">
      <Atmosphere />

      <a
        href="#collection"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-ivory focus:px-4 focus:py-2 focus:text-[12px] focus:text-void"
      >
        跳到孤品
      </a>

      <Nav cartCount={bagIds.length} onOpenCart={() => setBagOpen(true)} />

      <main>
        <Hero onInspect={scrollToCollection} />
        <KilnSection onInspect={scrollToCollection} />
        <Collection onInspect={setDetail} inBag={inBag} onToggleBag={toggleBag} />
        <CraftSection />
        <ArtisanSection />
        <VoicesSection />
        <TiersSection onInspect={inspectFirst} />
        <FaqSection />
      </main>

      <Footer />

      <BowlDetail
        bowl={detail}
        onClose={() => setDetail(null)}
        inBag={detail ? inBag(detail.id) : false}
        onToggleBag={toggleBag}
      />

      <BagDrawer
        open={bagOpen}
        bowls={bagBowls}
        onClose={() => setBagOpen(false)}
        onRemove={(id) => setBagIds((prev) => prev.filter((x) => x !== id))}
        onBrowse={scrollToCollection}
        onCheckout={openCheckout}
      />

      <Checkout
        open={checkoutOpen}
        bowls={bagBowls}
        onClose={closeCheckout}
        onDone={finishCheckout}
      />
    </div>
  )
}

export default App
