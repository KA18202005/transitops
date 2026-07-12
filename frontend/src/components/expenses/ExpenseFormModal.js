import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { expenseTypes } from "@/constants/expenseData";
import { getVehicleLabel } from "@/components/expenses/expenseUtils";

const fieldClass = "mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100";
const emptyValues = { type: "", vehicle_id: "", trip_id: "", amount: "", description: "", date: "" };

function createSchema(trips) {
  return z.object({
    type: z.string().refine((value) => expenseTypes.includes(value), "Select a valid expense type"),
    vehicle_id: z.string().trim().min(1, "Vehicle is required"),
    trip_id: z.string().optional(),
    amount: z.string().trim().min(1, "Amount is required").refine((value) => Number.isFinite(Number(value)), "Enter a valid numeric amount").refine((value) => Number(value) > 0, "Amount must be greater than 0").transform(Number),
    description: z.string().trim().min(3, "Description must be at least 3 characters"),
    date: z.string().min(1, "Date is required"),
  }).superRefine((values, context) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(`${values.date}T00:00:00`);
    if (Number.isNaN(enteredDate.getTime()) || enteredDate > today) context.addIssue({ code: z.ZodIssueCode.custom, path: ["date"], message: "Date cannot be in the future" });
    if (values.trip_id && !trips.some((trip) => String(trip.id) === values.trip_id && String(trip.vehicle_id) === values.vehicle_id)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["trip_id"], message: "Selected trip must belong to the vehicle" });
  });
}

export default function ExpenseFormModal({ open, mode, expense, onClose, onSubmit, isSubmitting, vehicles, trips }) {
  const schema = useMemo(() => createSchema(trips), [trips]);
  const { register, handleSubmit, reset, getValues, setValue, control, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });
  const selectedVehicleId = useWatch({ control, name: "vehicle_id" });
  const availableTrips = useMemo(() => trips.filter((trip) => String(trip.vehicle_id) === String(selectedVehicleId)), [trips, selectedVehicleId]);

  useEffect(() => {
    if (!open) return;
    reset(expense ? { type: expense.type, vehicle_id: String(expense.vehicle_id), trip_id: expense.trip_id ? String(expense.trip_id) : "", amount: String(expense.amount), description: expense.description, date: expense.date } : emptyValues);
  }, [open, expense, reset]);

  useEffect(() => {
    const tripId = getValues("trip_id");
    if (tripId && !availableTrips.some((trip) => String(trip.id) === tripId)) setValue("trip_id", "", { shouldValidate: true, shouldDirty: true });
  }, [availableTrips, getValues, setValue]);

  const close = () => { if (!isSubmitting) { reset(emptyValues); onClose(); } };
  const submit = async (values) => { if (!isSubmitting) await onSubmit({ ...values, description: values.description.trim() }); };

  return <Modal open={open} title={mode === "edit" ? "Edit expense" : "Add expense"} onClose={close} size="md"><form onSubmit={handleSubmit(submit)} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label><span className="text-sm font-semibold text-slate-700">Expense type</span><select {...register("type")} disabled={isSubmitting} className={fieldClass} aria-invalid={Boolean(errors.type)}><option value="">Select type</option>{expenseTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>{errors.type ? <p className="mt-1 text-xs font-medium text-rose-700">{errors.type.message}</p> : null}</label><label><span className="text-sm font-semibold text-slate-700">Vehicle</span><select {...register("vehicle_id")} disabled={isSubmitting} className={fieldClass} aria-invalid={Boolean(errors.vehicle_id)}><option value="">Select vehicle</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{getVehicleLabel(vehicle)}</option>)}</select>{errors.vehicle_id ? <p className="mt-1 text-xs font-medium text-rose-700">{errors.vehicle_id.message}</p> : null}</label><label><span className="text-sm font-semibold text-slate-700">Trip <span className="font-normal text-slate-400">(optional)</span></span><select {...register("trip_id")} disabled={!selectedVehicleId || isSubmitting} className={fieldClass} aria-invalid={Boolean(errors.trip_id)}><option value="">Not linked to a trip</option>{availableTrips.map((trip) => <option key={trip.id} value={trip.id}>{trip.trip_number}</option>)}</select>{errors.trip_id ? <p className="mt-1 text-xs font-medium text-rose-700">{errors.trip_id.message}</p> : null}</label><label><span className="text-sm font-semibold text-slate-700">Amount (INR)</span><input {...register("amount")} type="number" min="0.01" step="0.01" inputMode="decimal" disabled={isSubmitting} className={fieldClass} aria-invalid={Boolean(errors.amount)} placeholder="0.00" />{errors.amount ? <p className="mt-1 text-xs font-medium text-rose-700">{errors.amount.message}</p> : null}</label><label className="sm:col-span-2"><span className="text-sm font-semibold text-slate-700">Description</span><textarea {...register("description")} rows={3} disabled={isSubmitting} className={fieldClass} aria-invalid={Boolean(errors.description)} placeholder="What was this cost for?" />{errors.description ? <p className="mt-1 text-xs font-medium text-rose-700">{errors.description.message}</p> : null}</label><label><span className="text-sm font-semibold text-slate-700">Date</span><input {...register("date")} type="date" disabled={isSubmitting} className={fieldClass} aria-invalid={Boolean(errors.date)} />{errors.date ? <p className="mt-1 text-xs font-medium text-rose-700">{errors.date.message}</p> : null}</label></div><div className="flex justify-end gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={close} disabled={isSubmitting} className="border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">Cancel</button><button type="submit" disabled={isSubmitting} className="bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Saving…" : mode === "edit" ? "Save changes" : "Add expense"}</button></div></form></Modal>;
}
