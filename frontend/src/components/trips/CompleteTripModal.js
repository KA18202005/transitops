import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";

const completionSchema = z.object({
  final_odometer: z.coerce.number().min(0, "Final odometer is required"),
  actual_distance: z.coerce.number().gt(0, "Actual distance must be greater than 0"),
  fuel_used: z.coerce.number().gt(0, "Fuel used must be greater than 0"),
  arrival_time: z.string().trim().min(1, "Arrival time is required"),
  revenue: z.coerce.number().min(0, "Revenue cannot be negative"),
});

export default function CompleteTripModal({ open, trip, onClose, onSubmit, isCompleting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      final_odometer: "",
      actual_distance: "",
      fuel_used: "",
      arrival_time: "",
      revenue: trip?.revenue || 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        final_odometer: "",
        actual_distance: "",
        fuel_used: "",
        arrival_time: "",
        revenue: trip?.revenue || 0,
      });
    }
  }, [open, trip, reset]);

  return (
    <Modal open={open} title="Complete Trip" onClose={onClose} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="final_odometer">Final Odometer</label>
            <input id="final_odometer" type="number" {...register("final_odometer")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.final_odometer && <p className="mt-1 text-xs text-rose-600">{errors.final_odometer.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="actual_distance">Actual Distance (km)</label>
            <input id="actual_distance" type="number" {...register("actual_distance")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.actual_distance && <p className="mt-1 text-xs text-rose-600">{errors.actual_distance.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="fuel_used">Fuel Used (L)</label>
            <input id="fuel_used" type="number" {...register("fuel_used")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.fuel_used && <p className="mt-1 text-xs text-rose-600">{errors.fuel_used.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="arrival_time">Arrival Date and Time</label>
            <input id="arrival_time" type="datetime-local" {...register("arrival_time")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.arrival_time && <p className="mt-1 text-xs text-rose-600">{errors.arrival_time.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="revenue">Revenue (INR)</label>
            <input id="revenue" type="number" {...register("revenue")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.revenue && <p className="mt-1 text-xs text-rose-600">{errors.revenue.message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isCompleting} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isCompleting ? "Completing..." : "Complete Trip"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
