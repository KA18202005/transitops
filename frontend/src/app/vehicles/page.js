"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusCircle, ShieldCheck, Truck, Wrench } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import LoadingState from "@/components/ui/LoadingState";
import VehicleForm from "@/components/vehicles/VehicleForm";
import VehicleList from "@/components/vehicles/VehicleList";
import { initialVehicles } from "@/constants/vehicleData";
import { createVehicle, deleteVehicle, listVehicles, updateVehicle } from "@/services/vehicle";
import { getApiErrorMessage } from "@/services/api";

const PAGE_SIZE = 6;

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadVehicles() {
      try {
        const data = await listVehicles();
        if (mounted) {
          setVehicles(data);
        }
      } catch (error) {
        if (mounted) {
          setVehicles(initialVehicles);
          toast.error(`Using demo vehicle data: ${getApiErrorMessage(error, "API unavailable")}`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadVehicles();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return vehicles.filter((vehicle) => {
      const searchableText = [
        vehicle.registration_number,
        vehicle.vehicle_name,
        vehicle.vehicle_type,
        vehicle.region,
        vehicle.status,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(term);
    });
  }, [searchTerm, vehicles]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE));

  const pagedVehicles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredVehicles.slice(start, start + PAGE_SIZE);
  }, [filteredVehicles, page]);

  const summaryCards = [
    {
      title: "Active fleet",
      value: vehicles.filter((vehicle) => vehicle.status === "Available" || vehicle.status === "On Trip").length,
      hint: "Operational today",
      icon: Truck,
      tone: "slate",
    },
    {
      title: "In service",
      value: vehicles.filter((vehicle) => vehicle.status === "In Shop").length,
      hint: "Under maintenance",
      icon: Wrench,
      tone: "amber",
    },
    {
      title: "Verified units",
      value: vehicles.filter((vehicle) => vehicle.status !== "Retired").length,
      hint: "Ready for dispatch",
      icon: ShieldCheck,
      tone: "emerald",
    },
  ];

  const resetPage = () => {
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (editingVehicle) {
        const savedVehicle = await updateVehicle(editingVehicle.id, values);
        setVehicles((current) => current.map((vehicle) => (vehicle.id === editingVehicle.id ? savedVehicle : vehicle)));
        toast.success("Vehicle updated successfully");
      } else {
        const savedVehicle = await createVehicle(values);
        setVehicles((current) => [savedVehicle, ...current]);
        toast.success("Vehicle added successfully");
      }

      closeModal();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save vehicle"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await deleteVehicle(vehicleId);
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== vehicleId));
      resetPage();
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete vehicle"));
    }
  };

  if (isLoading) {
    return <LoadingState label="Loading vehicles..." />;
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">
            Vehicle registry
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Manage the fleet with clarity and confidence.</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Search, filter, and maintain the operational readiness of every asset in one place.
          </p>
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
          <PlusCircle size={18} />
          Add vehicle
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const toneClasses = {
            slate: "border-slate-200 bg-white text-slate-700",
            amber: "border-amber-200 bg-amber-50 text-amber-700",
            emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
          };

          return (
            <div key={card.title} className={`rounded-[24px] border p-4 shadow-sm ${toneClasses[card.tone]}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{card.title}</div>
                <div className="rounded-2xl bg-white/80 p-2">
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-4 text-3xl font-semibold">{card.value}</div>
              <div className="mt-1 text-sm opacity-80">{card.hint}</div>
            </div>
          );
        })}
      </div>

      <VehicleList
        vehicles={pagedVehicles}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onSearchChange={(value) => {
          setSearchTerm(value);
          resetPage();
        }}
        searchTerm={searchTerm}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

      <Modal open={isModalOpen} title={editingVehicle ? "Edit vehicle" : "Create vehicle"} onClose={closeModal} size="lg">
        <VehicleForm vehicle={editingVehicle} onSubmit={handleSubmit} onCancel={closeModal} isSubmitting={isSubmitting} />
      </Modal>
    </div>
  );
}
