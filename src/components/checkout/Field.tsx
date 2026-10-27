import type { ReactNode } from 'react'

type FieldProps = {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
  className?: string
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
  className = '',
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-2 text-[11px] tracking-[0.16em] text-ivory/45"
      >
        <span>{label}</span>
        {optional && <span className="text-[9.5px] tracking-[0.14em] text-ivory/20">选填</span>}
        {hint && !optional && (
          <span className="text-[9.5px] tracking-[0.12em] text-ivory/20">{hint}</span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[10.5px] tracking-[0.06em] text-ember">
          <span className="h-1 w-1 rounded-full bg-ember" />
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass = (invalid?: boolean) =>
  `w-full rounded-lg border bg-void/50 px-3.5 py-3 text-[13.5px] tracking-[0.03em] text-ivory placeholder:text-ivory/20 transition-all duration-300 outline-none ${
    invalid
      ? 'border-ember/55 focus:border-ember focus:ring-2 focus:ring-ember/20'
      : 'border-ivory/10 hover:border-ivory/20 focus:border-gold/55 focus:ring-2 focus:ring-gold/15'
  }`
