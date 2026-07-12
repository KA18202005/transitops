import { Fuel } from "lucide-react";
import Button from "@/components/ui/Button";

export default function FuelHeader({ onCreate }) {
  return (
    <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-100">
          Fleet consumption
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Fuel Management</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Track fuel usage, refuelling activity, vehicle consumption, and fuel costs.
        </p>
      </div>
      <Button onClick={onCreate} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-none hover:bg-slate-100">
        <Fuel size={18} />
        Add Fuel Log
      </Button>
    </div>
  );
}
