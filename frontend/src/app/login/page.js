import { Activity, MapPin, ShieldCheck, Truck } from "lucide-react";
import BrandHighlights from "../../components/common/BrandHighlights";
import LoginForm from "../../components/common/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.15),_transparent_38%),linear-gradient(135deg,_#f5f7fb_0%,_#eef2f7_100%)] px-3 py-3 sm:px-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)] lg:min-h-[780px]">
        <section className="relative flex w-full flex-col justify-between overflow-hidden bg-[#071425] px-6 py-8 text-white sm:px-8 lg:w-[45%] lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_34%),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:100%_100%,100%_100%,24px_24px,24px_24px]" />
          <div className="absolute left-[-6%] top-20 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-[-8%] h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/90 shadow-lg shadow-black/20">
                <ShieldCheck size={21} className="text-sky-300" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">TransitOps</p>
                <p className="text-sm text-slate-400">Smart Transport Operations Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                <Activity size={14} />
                <span>Command center</span>
              </div>
              <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                Run every vehicle, driver, and trip from one command center.
              </h1>
              <p className="max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                Coordinate dispatch, maintenance, fuel, expenses, and fleet visibility from
                a secure workspace tailored for modern transport operations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 shadow-inner shadow-black/10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-300">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">Operational route network</p>
                  <p className="text-sm text-slate-400">Live coordination across fleet movement</p>
                </div>
              </div>
              <div className="relative h-24 overflow-hidden rounded-xl border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.15),_transparent_40%)]">
                <div className="absolute left-6 top-10 h-0.5 w-24 -rotate-12 bg-slate-600" />
                <div className="absolute left-24 top-10 h-0.5 w-24 rotate-6 bg-sky-400/70" />
                <div className="absolute left-44 top-10 h-0.5 w-20 rotate-[-18deg] bg-slate-500" />
                <div className="absolute left-10 top-8 h-2.5 w-2.5 rounded-full bg-sky-300" />
                <div className="absolute left-24 top-8 h-2.5 w-2.5 rounded-full bg-slate-300" />
                <div className="absolute left-44 top-8 h-2.5 w-2.5 rounded-full bg-slate-300" />
                <div className="absolute left-58 top-8 h-2.5 w-2.5 rounded-full bg-sky-300" />
                <div className="absolute bottom-4 left-6 flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
                  <MapPin size={12} />
                  <span>Route visibility</span>
                </div>
              </div>
            </div>

            <BrandHighlights />
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>System operational</span>
            <span className="text-slate-500">•</span>
            <span>Secure workspace</span>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-slate-50/80 px-4 py-8 sm:px-6 lg:w-[55%] lg:px-8 xl:px-10">
          <div className="w-full max-w-[440px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="mb-7 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                Secure operations portal
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
              <p className="text-sm leading-6 text-slate-600">
                Sign in to continue to TransitOps.
              </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-slate-500">
              Protected access for authorized personnel only.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
