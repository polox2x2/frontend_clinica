import { Link } from 'react-router-dom'
import { CalendarCheck2, Check, HeartPulse, ShieldCheck } from 'lucide-react'

export function AuthFormLayout({ title, description, children, footerText, footerLink, footerLabel }) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#f7faf8] lg:grid lg:grid-cols-[minmax(420px,0.92fr)_1.08fr]">
      <section className="relative hidden overflow-hidden bg-[#087a55] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div aria-hidden="true" className="absolute -right-32 -top-24 size-96 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -right-16 -top-8 size-72 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -bottom-36 -left-28 size-96 rounded-full bg-[#18a873]/40 blur-3xl" />

        <Link className="relative flex w-fit items-center gap-3" to="/">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <HeartPulse className="size-6" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Soraka</span>
        </Link>

        <div className="relative max-w-xl py-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">Tu salud, más cerca</p>
          <h2 className="max-w-lg text-4xl font-semibold leading-[1.15] tracking-[-0.03em]">
            Tu bienestar comienza con una atención simple.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-emerald-50/80">
            Gestiona tus citas, resultados y atenciones médicas desde un solo lugar, de forma rápida y segura.
          </p>

          <div className="mt-10 grid max-w-lg gap-3 text-sm text-emerald-50 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm">
              <CalendarCheck2 className="size-5 text-emerald-200" />
              Citas en pocos pasos
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm">
              <ShieldCheck className="size-5 text-emerald-200" />
              Información protegida
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-emerald-100/80">
          <span className="flex size-7 items-center justify-center rounded-full bg-white/10"><Check className="size-4" /></span>
          Atención confiable para ti y tu familia
        </div>
      </section>

      <section className="relative flex min-h-svh items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div aria-hidden="true" className="absolute right-0 top-0 size-72 rounded-full bg-emerald-100/40 blur-3xl lg:hidden" />
        <div className="relative w-full max-w-[430px]">
          <Link className="mb-12 flex w-fit items-center gap-3 lg:hidden" to="/">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#087a55] text-white shadow-lg shadow-emerald-900/15">
              <HeartPulse className="size-5" aria-hidden="true" />
            </span>
            <span className="font-semibold tracking-tight">Soraka</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 text-[15px] leading-6 text-slate-500">{description}</p>
          </div>
          {children}
          <p className="mt-8 text-center text-sm text-slate-500">
            {footerText}{' '}
            <Link className="font-semibold text-[#087a55] underline-offset-4 transition-colors hover:text-emerald-700 hover:underline" to={footerLink}>{footerLabel}</Link>
          </p>
          <p className="mt-12 text-center text-xs text-slate-400">© 2026 Soraka · Privacidad y seguridad</p>
        </div>
      </section>
    </main>
  )
}
