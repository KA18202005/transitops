import { LoaderCircle } from "lucide-react";

export default function LoadingState({ label = "Loading drivers..." }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <LoaderCircle className="h-5 w-5 animate-spin text-slate-900" />
        {label}
      </div>
    </div>
  );
}
