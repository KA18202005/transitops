import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { driverStatuses, licenseCategories } from "@/constants/driverData";

const driverSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(1, "Phone number is required").refine((value) => {
    const digits = value.replace(/[^0-9]/g, "");
    return digits.length === 10;
  }, "Phone number must contain 10 valid digits"),
  license_number: z.string().trim().min(5, "Licence number is required"),
  license_category: z.string().trim().min(1, "Licence category is required"),
  license_expiry: z.string().trim().min(1, "Licence expiry date is required"),
  safety_score: z.coerce.number().min(0, "Score must be at least 0").max(100, "Score cannot exceed 100"),
  status: z.string().trim().min(1, "Status is required"),
});

export default function DriverFormModal({ open, mode, driver, onClose, onSubmit, isSubmitting, existingLicenceNumbers }) {
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      license_number: "",
      license_category: "",
      license_expiry: "",
      safety_score: "",
      status: "Available",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (driver) {
      reset({
        full_name: driver.full_name,
        phone: driver.phone,
        license_number: driver.license_number,
        license_category: driver.license_category,
        license_expiry: driver.license_expiry,
        safety_score: driver.safety_score,
        status: driver.status,
      });
    } else {
      reset({
        full_name: "",
        phone: "",
        license_number: "",
        license_category: "",
        license_expiry: "",
        safety_score: "",
        status: "Available",
      });
    }

    setFormError("");
    clearErrors();
  }, [open, driver, reset, clearErrors]);

  const submitHandler = async (values) => {
    const normalizedLicense = values.license_number.trim();
    const duplicate = existingLicenceNumbers.includes(normalizedLicense) && (!driver || driver.license_number !== normalizedLicense);

    if (duplicate) {
      setError("license_number", { type: "manual", message: "Licence number must be unique" });
      setFormError("Licence number must be unique.");
      return;
    }

    setFormError("");
    await onSubmit(values);
  };

  const isExpired = (value) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const expiryValue = watch("license_expiry");

  return (
    <Modal open={open} title={mode === "edit" ? "Edit Driver" : "Add Driver"} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        {formError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</div> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="full_name">Full Name</label>
            <input id="full_name" {...register("full_name")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.full_name && <p className="mt-1 text-xs text-rose-600">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="phone">Phone Number</label>
            <input id="phone" {...register("phone")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="license_number">Licence Number</label>
            <input id="license_number" {...register("license_number")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.license_number && <p className="mt-1 text-xs text-rose-600">{errors.license_number.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="license_category">Licence Category</label>
            <select id="license_category" {...register("license_category")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
              <option value="">Select category</option>
              {licenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.license_category && <p className="mt-1 text-xs text-rose-600">{errors.license_category.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="license_expiry">Licence Expiry Date</label>
            <input id="license_expiry" type="date" {...register("license_expiry")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.license_expiry && <p className="mt-1 text-xs text-rose-600">{errors.license_expiry.message}</p>}
            {isExpired(expiryValue) && <p className="mt-1 text-xs text-amber-600">This licence has expired. Drivers can still be recorded, but they are not eligible for trip assignment.</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="safety_score">Safety Score</label>
            <input id="safety_score" type="number" min="0" max="100" {...register("safety_score")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {errors.safety_score && <p className="mt-1 text-xs text-rose-600">{errors.safety_score.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="status">Status</label>
            <select id="status" {...register("status")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white">
              {driverStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-xs text-rose-600">{errors.status.message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Driver"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
