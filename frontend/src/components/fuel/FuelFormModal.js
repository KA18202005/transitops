import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";

const fuelSchema = z
  .object({
    vehicle_id: z.string().trim().min(1, "Vehicle is required"),
    trip_id: z.string().trim().optional().or(z.literal("")),
    liters: z.coerce.number().gt(0, "Litres must be greater than 0"),
    cost: z.coerce.number().min(0, "Cost cannot be negative"),
    fuel_station: z.string().trim().min(2, "Fuel station is required"),
    date: z.string().trim().min(1, "Date is required"),
  })
  .superRefine((values, ctx) => {
    const selectedDate = new Date(values.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (values.date && selectedDate > today) {
      ctx.addIssue({ path: ["date"], code: z.ZodIssueCode.custom, message: "Date cannot be in the future" });
    }
  });

export default function FuelFormModal({ open, mode, log, onClose, onSubmit, isSubmitting, vehicles, trips, selectedVehicleId }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      vehicle_id: "",
      trip_id: "",
      liters: "",
      cost: "",
      fuel_station: "",
      date: "",
    },
  });

  const selectedVehicle = watch("vehicle_id");
  const vehicleTrips = trips.filter((trip) => String(trip.vehicle_id) === String(selectedVehicle));

  useEffect(() => {
    if (!open) return;

    if (log) {
      reset({
        vehicle_id: String(log.vehicle_id),
        trip_id: log.trip_id ? String(log.trip_id) : "",
        liters: log.liters,
        cost: log.cost,
        fuel_station: log.fuel_station,
        date: log.date,
      });
    } else {
      reset({
        vehicle_id: selectedVehicleId ? String(selectedVehicleId) : "",
        trip_id: "",
        liters: "",
        cost: "",
        fuel_station: "",
        date: "",
      });
    }
  }, [open, log, reset, selectedVehicleId]);

  useEffect(() => {
    if (!selectedVehicle) {
      setValue("trip_id", "", { shouldValidate: true });
      return;
    }
    if (log?.trip_id && vehicleTrips.some((trip) => String(trip.id) === String(log.trip_id))) {
      setValue("trip_id", String(log.trip_id), { shouldValidate: true });
      return;
    }
    setValue("trip_id", "", { shouldValidate: true });
  }, [selectedVehicle, log, vehicleTrips, setValue]);

  const submitHandler = async (values) => {
    await onSubmit(values);
  };

  return (
    <Modal open={open} title={mode === "edit" ? "Edit Fuel Log" : "Add Fuel Log"} onClose={onClose} size="md">
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="liters">Litres</label>
              <input id="liters" type="number" min="0.01" step="0.01" {...register("liters")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              {errors.liters && <p className="mt-1 text-xs text-rose-600">{errors.liters.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="cost">Total Cost (INR)</label>
              <input id="cost" type="number" min="0" step="0.01" {...register("cost")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              {errors.cost && <p className="mt-1 text-xs text-rose-600">{errors.cost.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="fuel_station">Fuel Station</label>
            <input id="fuel_station" {...register("fuel_station")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.fuel_station && <p className="mt-1 text-xs text-rose-600">{errors.fuel_station.message}</p>}
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
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Fuel Log"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
