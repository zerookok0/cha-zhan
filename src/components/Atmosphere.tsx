/** Layered kiln light + ash grain that sits behind the whole page. */
export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-base"
    >
      {/* ember glow low on the page, like an open kiln door */}
      <div
        className="absolute -bottom-[26rem] left-1/2 h-[60rem] w-[70rem] -translate-x-1/2 animate-smolder rounded-full blur-[140px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(196,86,42,0.30), rgba(196,86,42,0) 66%)',
        }}
      />

      {/* warm key light upper left */}
      <div
        className="absolute -left-[20rem] -top-[24rem] h-[58rem] w-[58rem] animate-drift rounded-full opacity-50 blur-[150px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201,169,106,0.24), rgba(201,169,106,0) 68%)',
        }}
      />

      {/* faint celadon counter-light on the right, keeps it from going monochrome */}
      <div
        className="absolute -right-[24rem] top-[30rem] h-[54rem] w-[54rem] animate-drift rounded-full opacity-30 blur-[160px]"
        style={{
          animationDelay: '-11s',
          background:
            'radial-gradient(circle at 50% 50%, rgba(126,156,143,0.22), rgba(126,156,143,0) 68%)',
        }}
      />

      {/* ash grain */}
      <div className="noise absolute inset-0 opacity-[0.045] mix-blend-soft-light" />

      {/* vignette so type always sits on calm ground */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 130% 85% at 50% -5%, transparent 34%, rgba(8,7,6,0.62) 80%, #080706 100%)',
        }}
      />
    </div>
  )
}
