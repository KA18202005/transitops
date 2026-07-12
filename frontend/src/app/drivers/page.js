"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DriverHeader from "@/components/drivers/DriverHeader";
import DriverSummary from "@/components/drivers/DriverSummary";
import DriverToolbar from "@/components/drivers/DriverToolbar";
import DriverTable from "@/components/drivers/DriverTable";
import DriverFormModal from "@/components/drivers/DriverFormModal";
import DriverDetailsModal from "@/components/drivers/DriverDetailsModal";
import DeleteDriverModal from "@/components/drivers/DeleteDriverModal";
import Pagination from "@/components/ui/Pagination";
import LoadingState from "@/components/ui/LoadingState";
import { initialDrivers } from "@/constants/driverData";
import { createDriver, deleteDriver, listDrivers, updateDriver } from "@/services/driver";
import { getApiErrorMessage } from "@/services/api";

const PAGE_SIZE = 6;

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [validityFilter, setValidityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDrivers() {
      try {
        const data = await listDrivers();
        if (mounted) {
          setDrivers(data);
        }
      } catch (error) {
        if (mounted) {
          setDrivers(initialDrivers);
          toast.error(`Using demo driver data: ${getApiErrorMessage(error, "API unavailable")}`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadDrivers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredDrivers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch = !search || [driver.full_name, driver.phone, driver.license_number].some((value) => value.toLowerCase().includes(search));
      const matchesStatus = statusFilter === "All" || driver.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || driver.license_category === categoryFilter;
      const matchesValidity = validityFilter === "All" || getValidityLabel(driver) === validityFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesValidity;
    });
  }, [drivers, searchTerm, statusFilter, categoryFilter, validityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedDrivers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredDrivers.slice(start, start + PAGE_SIZE);
  }, [filteredDrivers, safePage]);

  const stats = useMemo(() => ({
    total: drivers.length,
    available: drivers.filter((driver) => driver.status === "Available").length,
    onTrip: drivers.filter((driver) => driver.status === "On Trip").length,
    offDuty: drivers.filter((driver) => driver.status === "Off Duty").length,
    suspended: drivers.filter((driver) => driver.status === "Suspended").length,
    expiring: drivers.filter((driver) => getValidityLabel(driver) === "Expiring soon").length,
  }), [drivers]);

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "All" || categoryFilter !== "All" || validityFilter !== "All");
  const existingLicenceNumbers = drivers.map((driver) => driver.license_number);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setValidityFilter("All");
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const handleValidityChange = (value) => {
    setValidityFilter(value);
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingDriver(null);
    setIsFormOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setEditingDriver(null);
    setIsFormOpen(false);
  };

  const openViewModal = (driver) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedDriver(null);
    setIsDetailsOpen(false);
  };

  const openDeleteModal = (driver) => {
    setDriverToDelete(driver);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDriverToDelete(null);
    setIsDeleteOpen(false);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      if (editingDriver) {
        const savedDriver = await updateDriver(editingDriver.id, { ...editingDriver, ...values });
        setDrivers((current) => current.map((driver) => (driver.id === editingDriver.id ? savedDriver : driver)));
        toast.success("Driver updated successfully");
      } else {
        const savedDriver = await createDriver(values);
        setDrivers((current) => [savedDriver, ...current]);
        toast.success("Driver added successfully");
      }

      closeFormModal();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save driver"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!driverToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDriver(driverToDelete.id);
      setDrivers((current) => current.filter((driver) => driver.id !== driverToDelete.id));
      closeDeleteModal();
      toast.success("Driver deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete driver"));
    } finally {
      setIsDeleting(false);
    }
  };

  function getValidityLabel(driver) {
    const expiryDate = new Date(driver.license_expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const soon = new Date(today);
    soon.setDate(today.getDate() + 30);

    if (expiryDate < today) return "Expired";
    if (expiryDate <= soon) return "Expiring soon";
    return "Valid";
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DriverHeader onAdd={openCreateModal} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <DriverHeader onAdd={openCreateModal} />
      <DriverSummary stats={stats} />
      <DriverToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        validityFilter={validityFilter}
        onValidityChange={handleValidityChange}
        onClearFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredDrivers.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No drivers found</h2>
          <p className="mt-2 text-sm text-slate-600">Adjust the selected filters or add a new driver.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={resetFilters} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              Clear Filters
            </button>
            <button type="button" onClick={openCreateModal} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Add Driver
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filteredDrivers.length)}–{Math.min(safePage * PAGE_SIZE, filteredDrivers.length)} of {filteredDrivers.length} drivers</div>
          </div>
          <DriverTable drivers={pagedDrivers} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <DriverFormModal
        open={isFormOpen}
        mode={editingDriver ? "edit" : "create"}
        driver={editingDriver}
        onClose={closeFormModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        existingLicenceNumbers={existingLicenceNumbers}
      />
      <DriverDetailsModal open={isDetailsOpen} driver={selectedDriver} onClose={closeDetailsModal} />
      <DeleteDriverModal open={isDeleteOpen} driver={driverToDelete} onClose={closeDeleteModal} onConfirm={handleDelete} isDeleting={isDeleting} />
    </div>
  );
}
