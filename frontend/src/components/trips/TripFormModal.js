import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { initialDrivers } from "@/constants/driverData";
import { initialVehicles } from "@/constants/vehicleData";
import { getDriverLicenceValidity } from "@/components/trips/tripUtils";

const tripSchema = z
  .object({
    source: z.string().trim().min(2, "Source is required"),
    destination: z.string().trim().min(2, "Destination is required"),
    vehicle_id: z.string().trim().min(1, "Vehicle is required"),
    driver_id: z.string().trim().min(1, "Driver is required"),
    cargo_weight: z.coerce.number().gt(0, "Cargo weight must be greater than 0"),
    planned_distance: z.coerce.number().gt(0, "Planned distance must be greater than 0"),
    departure_time: z.string().trim().min(1, "Planned departure is required"),
    revenue: z.coerce.number().min(0, "Revenue cannot be negative"),
    status: z.string().trim().min(1, "Status is required"),
  })
  .superRefine((values, ctx) => {
    if (values.source.trim().toLowerCase() === values.destination.trim().toLowerCase()) {
      ctx.addIssue({ path: ["destination"], code: z.ZodIssueCode.custom, message: "Destination must be different from source" });
    }
  });

export default function TripFormModal({ open, mode, trip, onClose, onSubmit, isSubmitting, vehicles, drivers }) {
  const eligibleVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.status === "Available"), [vehicles]);
  const eligibleDrivers = useMemo(() => drivers.filter((driver) => driver.status === "Available" && getDriverLicenceValidity(driver.license_expiry) === "Valid"), [drivers]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      source: "",
      destination: "",
      vehicle_id: "",
      driver_id: "",
      cargo_weight: "",
      planned_distance: "",
      departure_time: "",
      revenue: "",
      status: "Draft",
    },
  });

  const selectedVehicleId = watch("vehicle_id");
  const selectedVehicle = eligibleVehicles.find((vehicle) => String(vehicle.id) === selectedVehicleId) || null;

  useEffect(() => {
    if (!open) return;

    if (trip) {
      reset({
        source: trip.source,
        destination: trip.destination,
        vehicle_id: String(trip.vehicle_id),
        driver_id: String(trip.driver_id),
        cargo_weight: trip.cargo_weight,
        planned_distance: trip.planned_distance,
        departure_time: trip.departure_time || "",
        revenue: trip.revenue || 0,
        status: trip.status,
      });
    } else {
      reset({
        source: "",
        destination: "",
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        planned_distance: "",
        departure_time: "",
        revenue: "",
        status: "Draft",
      });
    }
  }, [open, trip, reset]);

  const handleVehicleChange = (event) => {
    const vehicleId = event.target.value;
    setValue("vehicle_id", vehicleId, { shouldValidate: true });
  };

  const handleDriverChange = (event) => {
    const driverId = event.target.value;
    setValue("driver_id", driverId, { shouldValidate: true });
  };

  return (
    <Modal open={open} title={mode === "edit" ? "Edit Trip" : "Create Trip"} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="source">Source</label>
            <input id="source" {...register("source")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.source && <p className="mt-1 text-xs text-rose-600">{errors.source.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="destination">Destination</label>
            <input id="destination" {...register("destination")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.destination && <p className="mt-1 text-xs text-rose-600">{errors.destination.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="vehicle_id">Vehicle</label>
            <select id="vehicle_id" {...register("vehicle_id")} onChange={handleVehicleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
              <option value="">Select vehicle</option>
              {eligibleVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registration_number} · {vehicle.vehicle_name} · {vehicle.vehicle_type}
                </option>
              ))}
            </select>
            {errors.vehicle_id && <p className="mt-1 text-xs text-rose-600">{errors.vehicle_id.message}</p>}
            {selectedVehicle ? <p className="mt-1 text-xs text-slate-500">Capacity: {selectedVehicle.max_load_capacity.toLocaleString()} kg</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="driver_id">Driver</label>
            <select id="driver_id" {...register("driver_id")} onChange={handleDriverChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
              <option value="">Select driver</option>
              {eligibleDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.full_name} · {driver.license_category}
                </option>
              ))}
            </select>
            {errors.driver_id && <p className="mt-1 text-xs text-rose-600">{errors.driver_id.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="cargo_weight">Cargo Weight (kg)</label>
            <input id="cargo_weight" type="number" {...register("cargo_weight")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.cargo_weight && <p className="mt-1 text-xs text-rose-600">{errors.cargo_weight.message}</p>}
            {selectedVehicle && <p className="mt-1 text-xs text-slate-500">Capacity limit: {selectedVehicle.max_load_capacity.toLocaleString()} kg</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="planned_distance">Planned Distance (km)</label>
            <input id="planned_distance" type="number" {...register("planned_distance")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.planned_distance && <p className="mt-1 text-xs text-rose-600">{errors.planned_distance.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="departure_time">Planned Departure</label>
            <input id="departure_time" type="datetime-local" {...register("departure_time")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.departure_time && <p className="mt-1 text-xs text-rose-600">{errors.departure_time.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="revenue">Revenue (INR)</label>
            <input id="revenue" type="number" {...register("revenue")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.revenue && <p className="mt-1 text-xs text-rose-600">{errors.revenue.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="status">Initial Status</label>
            <select id="status" {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
              <option value="Draft">Draft</option>
            </select>
            {errors.status && <p className="mt-1 text-xs text-rose-600">{errors.status.message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Trip"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
