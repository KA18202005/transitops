import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { maintenanceStatuses } from "@/constants/maintenanceData";

const maintenanceSchema = z
  .object({
    vehicle_id: z.string().trim().min(1, "Vehicle is required"),
    issue: z.string().trim().min(2, "Issue is required"),
    description: z.string().trim().min(5, "Description is required"),
    maintenance_cost: z.coerce.number().min(0, "Cost must be at least 0"),
    start_date: z.string().trim().min(1, "Start date is required"),
    end_date: z.string().trim().optional().or(z.literal("")),
    status: z.string().trim().min(1, "Status is required"),
  })
  .superRefine((values, ctx) => {
    if (values.end_date && values.start_date && values.end_date < values.start_date) {
      ctx.addIssue({ path: ["end_date"], code: z.ZodIssueCode.custom, message: "End date cannot be before the start date" });
    }
  });

export default function MaintenanceFormModal({ open, mode, record, onClose, onSubmit, isSubmitting, vehicles, existingRecords }) {
  const activeMaintenance = useMemo(() => existingRecords.filter((item) => item.status !== "Completed"), [existingRecords]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicle_id: "",
      issue: "",
      description: "",
      maintenance_cost: "",
      start_date: "",
      end_date: "",
      status: "Pending",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (record) {
      reset({
        vehicle_id: String(record.vehicle_id),
        issue: record.issue,
        description: record.description,
        maintenance_cost: record.maintenance_cost,
        start_date: record.start_date,
        end_date: record.end_date || "",
        status: record.status,
      });
    } else {
      reset({
        vehicle_id: "",
        issue: "",
        description: "",
        maintenance_cost: "",
        start_date: "",
        end_date: "",
        status: "Pending",
      });
    }
  }, [open, record, reset]);

  const submitHandler = async (values) => {
    const duplicate = activeMaintenance.some((item) => String(item.vehicle_id) === values.vehicle_id && (!record || item.id !== record.id));
    if (duplicate) {
      window.alert("A vehicle cannot have more than one active maintenance record.");
      return;
    }
    await onSubmit(values);
  };

  return (
    <Modal open={open} title={mode === "edit" ? "Edit Maintenance" : "Create Maintenance"} onClose={onClose} size="md">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="vehicle_id">Vehicle</label>
            <select id="vehicle_id" {...register("vehicle_id")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registration_number} · {vehicle.vehicle_name}
                </option>
              ))}
            </select>
            {errors.vehicle_id && <p className="mt-1 text-xs text-rose-600">{errors.vehicle_id.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="issue">Issue</label>
            <input id="issue" {...register("issue")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.issue && <p className="mt-1 text-xs text-rose-600">{errors.issue.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">Description</label>
            <textarea id="description" rows="3" {...register("description")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="maintenance_cost">Maintenance Cost (INR)</label>
              <input id="maintenance_cost" type="number" min="0" step="0.01" {...register("maintenance_cost")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              {errors.maintenance_cost && <p className="mt-1 text-xs text-rose-600">{errors.maintenance_cost.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="status">Status</label>
              <select id="status" {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
                {maintenanceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-xs text-rose-600">{errors.status.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="start_date">Start Date</label>
              <input id="start_date" type="date" {...register("start_date")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              {errors.start_date && <p className="mt-1 text-xs text-rose-600">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="end_date">End Date</label>
              <input id="end_date" type="date" {...register("end_date")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              {errors.end_date && <p className="mt-1 text-xs text-rose-600">{errors.end_date.message}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Maintenance"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
