"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import MaintenanceHeader from "@/components/maintenance/MaintenanceHeader";
import MaintenanceSummary from "@/components/maintenance/MaintenanceSummary";
import MaintenanceToolbar from "@/components/maintenance/MaintenanceToolbar";
import MaintenanceTable from "@/components/maintenance/MaintenanceTable";
import MaintenanceFormModal from "@/components/maintenance/MaintenanceFormModal";
import MaintenanceDetailsModal from "@/components/maintenance/MaintenanceDetailsModal";
import StartMaintenanceModal from "@/components/maintenance/StartMaintenanceModal";
import CompleteMaintenanceModal from "@/components/maintenance/CompleteMaintenanceModal";
import DeleteMaintenanceModal from "@/components/maintenance/DeleteMaintenanceModal";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import { initialMaintenance } from "@/constants/maintenanceData";
import { initialVehicles } from "@/constants/vehicleData";

const PAGE_SIZE = 6;

export default function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToStart, setRecordToStart] = useState(null);
  const [recordToComplete, setRecordToComplete] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setRecords(initialMaintenance);
        setVehicles(initialVehicles);
        setError("");
      } catch {
        setError("Unable to load maintenance data");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return records.filter((record) => {
      const vehicle = vehicles.find((item) => item.id === record.vehicle_id);
      const searchText = [vehicle?.registration_number, vehicle?.vehicle_name, record.issue, record.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchText.includes(query);
      const matchesStatus = statusFilter === "All" || record.status === statusFilter;
      const matchesVehicleType = vehicleTypeFilter === "All" || vehicle?.vehicle_type === vehicleTypeFilter;
      return matchesSearch && matchesStatus && matchesVehicleType;
    });
  }, [records, vehicles, searchTerm, statusFilter, vehicleTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRecords = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [filteredRecords, safePage]);

  const stats = useMemo(
    () => ({
      total: records.length,
      pending: records.filter((record) => record.status === "Pending").length,
      inProgress: records.filter((record) => record.status === "In Progress").length,
      completed: records.filter((record) => record.status === "Completed").length,
      totalCost: `₹${records.reduce((sum, record) => sum + Number(record.maintenance_cost || 0), 0).toLocaleString("en-IN")}`,
    }),
    [records]
  );

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "All" || vehicleTypeFilter !== "All");

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setVehicleTypeFilter("All");
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setEditingRecord(null);
    setIsFormOpen(false);
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedRecord(null);
    setIsDetailsOpen(false);
  };

  const openStartModal = (record) => {
    setRecordToStart(record);
    setIsStartOpen(true);
  };

  const closeStartModal = () => {
    setRecordToStart(null);
    setIsStartOpen(false);
  };

  const openCompleteModal = (record) => {
    setRecordToComplete(record);
    setIsCompleteOpen(true);
  };

  const closeCompleteModal = () => {
    setRecordToComplete(null);
    setIsCompleteOpen(false);
  };

  const openDeleteModal = (record) => {
    setRecordToDelete(record);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setRecordToDelete(null);
    setIsDeleteOpen(false);
  };

  const handleCreateOrEdit = async (values) => {
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    if (editingRecord) {
      setRecords((current) => current.map((record) => (record.id === editingRecord.id ? { ...record, ...values } : record)));
      toast.success("Maintenance record updated successfully");
    } else {
      const newRecord = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        ...values,
      };
      setRecords((current) => [newRecord, ...current]);
      toast.success("Maintenance record created successfully");
    }

    setIsSubmitting(false);
    closeFormModal();
  };

  const handleStart = async () => {
    if (!recordToStart) return;

    const record = recordToStart;
    const vehicle = vehicles.find((item) => item.id === record.vehicle_id);

    if (!vehicle) {
      toast.error("Vehicle not found for this maintenance record");
      return;
    }

    if (record.status !== "Pending") {
      toast.error("Only pending records can be started");
      return;
    }

    if (vehicle.status !== "Available") {
      toast.error("Only available vehicles can begin maintenance");
      return;
    }

    if (vehicle.status === "Retired") {
      toast.error("Retired vehicles cannot enter maintenance");
      return;
    }

    setIsStarting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    setRecords((current) => current.map((item) => (item.id === record.id ? { ...item, status: "In Progress", start_date: item.start_date || new Date().toISOString().slice(0, 10) } : item)));
    setVehicles((current) => current.map((item) => (item.id === vehicle.id ? { ...item, status: "In Shop" } : item)));

    setIsStarting(false);
    closeStartModal();
    toast.success("Maintenance started successfully");
  };

  const handleComplete = async (values) => {
    if (!recordToComplete) return;

    const record = recordToComplete;
    const vehicle = vehicles.find((item) => item.id === record.vehicle_id);

    if (!vehicle) {
      toast.error("Vehicle not found for this maintenance record");
      return;
    }

    if (record.status !== "In Progress") {
      toast.error("Only in-progress records can be completed");
      return;
    }

    if (!values.end_date) {
      toast.error("End date is required");
      return;
    }

    if (values.end_date < record.start_date) {
      toast.error("End date cannot be before the start date");
      return;
    }

    setIsCompleting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    setRecords((current) => current.map((item) => (item.id === record.id ? { ...item, status: "Completed", end_date: values.end_date, maintenance_cost: values.maintenance_cost } : item)));
    setVehicles((current) => current.map((item) => (item.id === vehicle.id ? { ...item, status: item.status === "Retired" ? "Retired" : "Available" } : item)));

    setIsCompleting(false);
    closeCompleteModal();
    toast.success("Maintenance completed successfully");
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;

    if (recordToDelete.status !== "Pending") {
      toast.error("Only pending maintenance records can be deleted");
      return;
    }

    setIsDeleting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    setRecords((current) => current.filter((item) => item.id !== recordToDelete.id));
    setIsDeleting(false);
    closeDeleteModal();
    toast.success("Maintenance record deleted successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <MaintenanceHeader onCreate={openCreateModal} />
        <LoadingState label="Loading maintenance records..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <MaintenanceHeader onCreate={openCreateModal} />
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <MaintenanceHeader onCreate={openCreateModal} />
      <MaintenanceSummary stats={stats} />
      <MaintenanceToolbar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        vehicleTypeFilter={vehicleTypeFilter}
        onVehicleTypeChange={(value) => {
          setVehicleTypeFilter(value);
          setPage(1);
        }}
        onClearFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredRecords.length === 0 ? (
        <EmptyState title="No maintenance records found" description="Adjust the filters or create a new maintenance request." actionLabel="Clear Filters" onAction={resetFilters} />
      ) : (
        <>
          <div className="flex flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filteredRecords.length)}–{Math.min(safePage * PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} records</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Client-side maintenance workflow</div>
          </div>
          <MaintenanceTable records={pagedRecords} vehicles={vehicles} onView={openViewModal} onEdit={openEditModal} onStart={openStartModal} onComplete={openCompleteModal} onDelete={openDeleteModal} />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <MaintenanceFormModal open={isFormOpen} mode={editingRecord ? "edit" : "create"} record={editingRecord} onClose={closeFormModal} onSubmit={handleCreateOrEdit} isSubmitting={isSubmitting} vehicles={vehicles} existingRecords={records} />
      <MaintenanceDetailsModal open={isDetailsOpen} record={selectedRecord} vehicle={selectedRecord ? vehicles.find((item) => item.id === selectedRecord.vehicle_id) : null} onClose={closeDetailsModal} />
      <StartMaintenanceModal open={isStartOpen} record={recordToStart} onClose={closeStartModal} onConfirm={handleStart} isStarting={isStarting} />
      <CompleteMaintenanceModal open={isCompleteOpen} record={recordToComplete} onClose={closeCompleteModal} onSubmit={handleComplete} isCompleting={isCompleting} />
      <DeleteMaintenanceModal open={isDeleteOpen} record={recordToDelete} onClose={closeDeleteModal} onConfirm={handleDelete} isDeleting={isDeleting} />
    </div>
  );
}
