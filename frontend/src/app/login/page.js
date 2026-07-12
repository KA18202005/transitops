import { ShieldCheck } from "lucide-react";
import LoginForm from "../../components/common/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_50px_-24px_rgba(15,23,42,0.35)] lg:min-h-[720px]">
        <section className="flex w-full flex-col justify-between bg-slate-950 px-6 py-8 text-white sm:px-8 lg:w-[46%] lg:px-10 lg:py-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-lg font-semibold">TransitOps</p>
                <p className="text-sm text-slate-400">Smart Transport Operations Platform</p>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Manage your fleet with clarity and control.
              </h1>
              <p className="max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                Coordinate drivers, trips, maintenance, fuel, and expenses from a single
                secure workspace designed for modern transport operations.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
            Secure access for authorized fleet managers and operations teams.
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-white px-6 py-8 sm:px-8 lg:w-[54%] lg:px-10">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Access portal
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">Welcome back</h2>
              <p className="text-sm leading-6 text-slate-600">
                Sign in to continue to TransitOps.
              </p>
            </div>

            <LoginForm />

            <p className="text-center text-sm text-slate-500">
              Secure access for authorized users only.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
