import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { expenseTypes } from "@/constants/expenseData";

const expenseSchema = z
  .object({
    type: z.string().trim().min(1, "Expense type is required"),
    vehicle_id: z.string().trim().min(1, "Vehicle is required"),
    trip_id: z.string().trim().optional().or(z.literal("")),
    amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
    description: z.string().trim().min(3, "Description must be at least 3 characters"),
    date: z.string().trim().min(1, "Date is required"),
  })
  .superRefine((values, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (values.date && new Date(values.date) > today) {
      ctx.addIssue({ path: ["date"], code: z.ZodIssueCode.custom, message: "Date cannot be in the future" });
    }
  });

export default function ExpenseFormModal({ open, mode, expense, onClose, onSubmit, isSubmitting, vehicles, trips, selectedVehicleId }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: "Fuel",
      vehicle_id: "",
      trip_id: "",
      amount: "",
      description: "",
      date: "",
    },
  });

  const selectedVehicle = watch("vehicle_id");
  const vehicleTrips = trips.filter((trip) => String(trip.vehicle_id) === String(selectedVehicle));

  useEffect(() => {
    if (!open) return;

    if (expense) {
      reset({
        type: expense.type,
        vehicle_id: String(expense.vehicle_id),
        trip_id: expense.trip_id ? String(expense.trip_id) : "",
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
      });
    } else {
      reset({
        type: "Fuel",
        vehicle_id: selectedVehicleId ? String(selectedVehicleId) : "",
        trip_id: "",
        amount: "",
        description: "",
        date: "",
      });
    }
  }, [open, expense, reset, selectedVehicleId]);

  useEffect(() => {
    if (!selectedVehicle) {
      setValue("trip_id", "", { shouldValidate: true });
      return;
    }
    if (expense?.trip_id && vehicleTrips.some((trip) => String(trip.id) === String(expense.trip_id))) {
      setValue("trip_id", String(expense.trip_id), { shouldValidate: true });
      return;
    }
    setValue("trip_id", "", { shouldValidate: true });
  }, [selectedVehicle, expense, vehicleTrips, setValue]);

  const submitHandler = async (values) => {
    await onSubmit(values);
  };

  return (
    <Modal open={open} title={mode === "edit" ? "Edit Expense" : "Add Expense"} onClose={onClose} size="md">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="type">Expense Type</label>
            <select id="type" {...register("type")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
              <option value="">Select type</option>
              {expenseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-xs text-rose-600">{errors.type.message}</p>}
          </div>

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
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="trip_id">Trip (optional)</label>
            <select id="trip_id" {...register("trip_id")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" disabled={!selectedVehicle}>
              <option value="">Select trip</option>
              {vehicleTrips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.trip_number}
                </option>
              ))}
            </select>
            {errors.trip_id && <p className="mt-1 text-xs text-rose-600">{errors.trip_id.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="amount">Amount (INR)</label>
            <input id="amount" type="number" min="0.01" step="0.01" {...register("amount")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.amount && <p className="mt-1 text-xs text-rose-600">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">Description</label>
            <textarea id="description" rows="3" {...register("description")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="date">Date</label>
            <input id="date" type="date" {...register("date")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
