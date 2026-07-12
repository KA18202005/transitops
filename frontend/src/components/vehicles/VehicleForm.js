import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { vehicleStatuses, vehicleTypes, vehicleRegions } from "@/constants/vehicleData";

const vehicleSchema = z.object({
  registration_number: z.string().trim().min(1, "Registration number is required"),
  vehicle_name: z.string().trim().min(1, "Vehicle name is required"),
  vehicle_type: z.string().trim().min(1, "Vehicle type is required"),
  region: z.string().trim().min(1, "Region is required"),
  max_load_capacity: z.coerce.number().min(1, "Capacity must be greater than 0"),
  current_odometer: z.coerce.number().min(0, "Odometer cannot be negative"),
  acquisition_cost: z.coerce.number().min(0, "Cost cannot be negative"),
  purchase_date: z.string().trim().min(1, "Purchase date is required"),
  status: z.string().trim().min(1, "Status is required"),
});

export default function VehicleForm({ vehicle, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: "",
      vehicle_name: "",
      vehicle_type: "",
      region: "",
      max_load_capacity: "",
      current_odometer: "",
      acquisition_cost: "",
      purchase_date: "",
      status: "Available",
    },
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        ...vehicle,
        max_load_capacity: vehicle.max_load_capacity ?? "",
        current_odometer: vehicle.current_odometer ?? "",
        acquisition_cost: vehicle.acquisition_cost ?? "",
      });
    }
  }, [vehicle, reset]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Registration number</label>
          <input {...register("registration_number")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          {errors.registration_number && <p className="mt-1 text-xs text-red-600">{errors.registration_number.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Vehicle name</label>
          <input {...register("vehicle_name")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          {errors.vehicle_name && <p className="mt-1 text-xs text-red-600">{errors.vehicle_name.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Vehicle type</label>
          <select {...register("vehicle_type")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
            <option value="">Select type</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.vehicle_type && <p className="mt-1 text-xs text-red-600">{errors.vehicle_type.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Region</label>
          <select {...register("region")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
            <option value="">Select region</option>
            {vehicleRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && <p className="mt-1 text-xs text-red-600">{errors.region.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Max load capacity (kg)</label>
          <input type="number" {...register("max_load_capacity")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          {errors.max_load_capacity && <p className="mt-1 text-xs text-red-600">{errors.max_load_capacity.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Current odometer</label>
          <input type="number" {...register("current_odometer")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          {errors.current_odometer && <p className="mt-1 text-xs text-red-600">{errors.current_odometer.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Acquisition cost</label>
          <input type="number" {...register("acquisition_cost")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          {errors.acquisition_cost && <p className="mt-1 text-xs text-red-600">{errors.acquisition_cost.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Purchase date</label>
          <input type="date" {...register("purchase_date")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          {errors.purchase_date && <p className="mt-1 text-xs text-red-600">{errors.purchase_date.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
          <select {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
            {vehicleStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={onCancel} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          Save vehicle
        </button>
      </div>
    </form>
  );
}
