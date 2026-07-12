"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import FuelHeader from "@/components/fuel/FuelHeader";
import FuelSummary from "@/components/fuel/FuelSummary";
import FuelToolbar from "@/components/fuel/FuelToolbar";
import FuelTable from "@/components/fuel/FuelTable";
import FuelFormModal from "@/components/fuel/FuelFormModal";
import FuelDetailsModal from "@/components/fuel/FuelDetailsModal";
import DeleteFuelModal from "@/components/fuel/DeleteFuelModal";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import { initialFuelLogs } from "@/constants/fuelData";
import { initialTrips } from "@/constants/tripData";
import { initialVehicles } from "@/constants/vehicleData";

const PAGE_SIZE = 6;

export default function FuelPage() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [tripFilter, setTripFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [logToDelete, setLogToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setLogs(initialFuelLogs);
        setVehicles(initialVehicles);
        setTrips(initialTrips);
        setError("");
      } catch {
        setError("Unable to load fuel data");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredLogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return logs.filter((log) => {
      const vehicle = vehicles.find((item) => item.id === log.vehicle_id);
      const trip = trips.find((item) => item.id === log.trip_id);
      const searchText = [vehicle?.registration_number, vehicle?.vehicle_name, trip?.trip_number, log.fuel_station]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchText.includes(query);
      const matchesVehicleType = vehicleTypeFilter === "All" || vehicle?.vehicle_type === vehicleTypeFilter;
      const matchesVehicle = vehicleFilter === "All" || String(log.vehicle_id) === String(vehicleFilter);
      const matchesTripAssociation = tripFilter === "All" || (tripFilter === "Linked" && Boolean(log.trip_id)) || (tripFilter === "Unlinked" && !log.trip_id);
      const matchesMonth = !monthFilter || log.date.startsWith(monthFilter);
      return matchesSearch && matchesVehicleType && matchesVehicle && matchesTripAssociation && matchesMonth;
    });
  }, [logs, vehicles, trips, searchTerm, vehicleTypeFilter, vehicleFilter, tripFilter, monthFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedLogs = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, safePage]);

  const stats = useMemo(() => {
    const totalLitres = logs.reduce((sum, log) => sum + Number(log.liters || 0), 0);
    const totalCost = logs.reduce((sum, log) => sum + Number(log.cost || 0), 0);
    const averagePrice = totalLitres > 0 ? totalCost / totalLitres : 0;
    const refuelledVehicles = new Set(logs.map((log) => log.vehicle_id)).size;
    return {
      totalLogs: logs.length,
      totalLitres: `${totalLitres.toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`,
      totalCost: `₹${totalCost.toLocaleString("en-IN")}`,
      averagePrice: `₹${averagePrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}/L`,
      refuelledVehicles,
    };
  }, [logs]);

  const hasActiveFilters = Boolean(searchTerm || vehicleTypeFilter !== "All" || vehicleFilter !== "All" || tripFilter !== "All" || monthFilter);

  const resetFilters = () => {
    setSearchTerm("");
    setVehicleTypeFilter("All");
    setVehicleFilter("All");
    setTripFilter("All");
    setMonthFilter("");
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingLog(null);
    setIsFormOpen(true);
  };

  const openEditModal = (log) => {
    setEditingLog(log);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setEditingLog(null);
    setIsFormOpen(false);
  };

  const openViewModal = (log) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedLog(null);
    setIsDetailsOpen(false);
  };

  const openDeleteModal = (log) => {
    setLogToDelete(log);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setLogToDelete(null);
    setIsDeleteOpen(false);
  };

  const handleCreateOrEdit = async (values) => {
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    if (editingLog) {
      setLogs((current) => current.map((log) => (log.id === editingLog.id ? { ...log, ...values, trip_id: values.trip_id || null } : log)));
      toast.success("Fuel log updated successfully");
    } else {
      const newLog = {
        id: Date.now(),
        ...values,
        trip_id: values.trip_id || null,
      };
      setLogs((current) => [newLog, ...current]);
      toast.success("Fuel log added successfully");
    }

    setIsSubmitting(false);
    closeFormModal();
  };

  const handleDelete = async () => {
    if (!logToDelete) return;
    setIsDeleting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setLogs((current) => current.filter((log) => log.id !== logToDelete.id));
    setIsDeleting(false);
    closeDeleteModal();
    toast.success("Fuel log deleted successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FuelHeader onCreate={openCreateModal} />
        <LoadingState label="Loading fuel records..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <FuelHeader onCreate={openCreateModal} />
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <FuelHeader onCreate={openCreateModal} />
      <FuelSummary stats={stats} />
      <FuelToolbar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        vehicleTypeFilter={vehicleTypeFilter}
        onVehicleTypeChange={(value) => {
          setVehicleTypeFilter(value);
          setPage(1);
        }}
        vehicleFilter={vehicleFilter}
        onVehicleChange={(value) => {
          setVehicleFilter(value);
          setPage(1);
        }}
        tripFilter={tripFilter}
        onTripFilterChange={(value) => {
          setTripFilter(value);
          setPage(1);
        }}
        monthFilter={monthFilter}
        onMonthFilterChange={(value) => {
          setMonthFilter(value);
          setPage(1);
        }}
        vehicles={vehicles}
        trips={trips}
        onClearFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredLogs.length === 0 ? (
        <EmptyState title="No fuel logs found" description="Adjust the current filters or add a new fuel entry." actionLabel="Clear Filters" onAction={resetFilters} />
      ) : (
        <>
          <div className="flex flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filteredLogs.length)}–{Math.min(safePage * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length} logs</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Client-side fuel workflow</div>
          </div>
          <FuelTable logs={pagedLogs} vehicles={vehicles} trips={trips} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <FuelFormModal open={isFormOpen} mode={editingLog ? "edit" : "create"} log={editingLog} onClose={closeFormModal} onSubmit={handleCreateOrEdit} isSubmitting={isSubmitting} vehicles={vehicles} trips={trips} selectedVehicleId={editingLog?.vehicle_id || null} />
      <FuelDetailsModal open={isDetailsOpen} log={selectedLog} vehicle={selectedLog ? vehicles.find((item) => item.id === selectedLog.vehicle_id) : null} trip={selectedLog ? trips.find((item) => item.id === selectedLog.trip_id) : null} onClose={closeDetailsModal} />
      <DeleteFuelModal open={isDeleteOpen} log={logToDelete} onClose={closeDeleteModal} onConfirm={handleDelete} isDeleting={isDeleting} />
    </div>
  );
}
