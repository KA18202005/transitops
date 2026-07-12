import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";

const buildCompletionSchema = (startDate) =>
  z
    .object({
      end_date: z.string().trim().min(1, "End date is required"),
      maintenance_cost: z.coerce.number().min(0, "Cost must be at least 0"),
    })
    .superRefine((values, ctx) => {
      if (startDate && values.end_date && values.end_date < startDate) {
        ctx.addIssue({ path: ["end_date"], code: z.ZodIssueCode.custom, message: "End date cannot be before the start date" });
      }
    });

export default function CompleteMaintenanceModal({ open, record, onClose, onSubmit, isCompleting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildCompletionSchema(record?.start_date || "")),
    defaultValues: {
      end_date: "",
      maintenance_cost: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      end_date: record?.end_date || "",
      maintenance_cost: record?.maintenance_cost || "",
    });
  }, [open, record, reset]);

  const submitHandler = async (values) => {
    await onSubmit(values);
  };

  if (!record) return null;

  return (
    <Modal open={open} title="Complete Maintenance" onClose={onClose} size="md">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Maintenance Request</div>
          <div className="mt-1 text-base font-semibold text-slate-900">{record.issue}</div>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="end_date">End Date</label>
            <input id="end_date" type="date" {...register("end_date")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.end_date && <p className="mt-1 text-xs text-rose-600">{errors.end_date.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="maintenance_cost">Maintenance Cost (INR)</label>
            <input id="maintenance_cost" type="number" min="0" step="0.01" {...register("maintenance_cost")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.maintenance_cost && <p className="mt-1 text-xs text-rose-600">{errors.maintenance_cost.message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isCompleting} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
            {isCompleting ? "Completing..." : "Complete Maintenance"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
