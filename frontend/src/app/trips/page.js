"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import TripHeader from "@/components/trips/TripHeader";
import TripSummary from "@/components/trips/TripSummary";
import TripToolbar from "@/components/trips/TripToolbar";
import TripTable from "@/components/trips/TripTable";
import TripFormModal from "@/components/trips/TripFormModal";
import TripDetailsModal from "@/components/trips/TripDetailsModal";
import DispatchTripModal from "@/components/trips/DispatchTripModal";
import CompleteTripModal from "@/components/trips/CompleteTripModal";
import CancelTripModal from "@/components/trips/CancelTripModal";
import Pagination from "@/components/ui/Pagination";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/trips/EmptyState";
import ErrorState from "@/components/trips/ErrorState";
import { initialTrips } from "@/constants/tripData";
import { initialVehicles } from "@/constants/vehicleData";
import { initialDrivers } from "@/constants/driverData";

const PAGE_SIZE = 6;

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToDispatch, setTripToDispatch] = useState(null);
  const [tripToComplete, setTripToComplete] = useState(null);
  const [tripToCancel, setTripToCancel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setTrips(initialTrips);
        setVehicles(initialVehicles);
        setDrivers(initialDrivers);
        setError("");
      } catch {
        setError("Unable to load trip data");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredTrips = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return trips.filter((trip) => {
      const vehicle = vehicles.find((item) => item.id === trip.vehicle_id);
      const driver = drivers.find((item) => item.id === trip.driver_id);
      const searchText = [trip.trip_number, trip.source, trip.destination, vehicle?.registration_number, vehicle?.vehicle_name, driver?.full_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchText.includes(search);
      const matchesStatus = statusFilter === "All" || trip.status === statusFilter;
      const matchesVehicleType = vehicleTypeFilter === "All" || vehicle?.vehicle_type === vehicleTypeFilter;
      const matchesRegion = regionFilter === "All" || vehicle?.region === regionFilter;
      return matchesSearch && matchesStatus && matchesVehicleType && matchesRegion;
    });
  }, [trips, vehicles, drivers, searchTerm, statusFilter, vehicleTypeFilter, regionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedTrips = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredTrips.slice(start, start + PAGE_SIZE);
  }, [filteredTrips, safePage]);

  const stats = useMemo(() => ({
    total: trips.length,
    draft: trips.filter((trip) => trip.status === "Draft").length,
    dispatched: trips.filter((trip) => trip.status === "Dispatched").length,
    completed: trips.filter((trip) => trip.status === "Completed").length,
    cancelled: trips.filter((trip) => trip.status === "Cancelled").length,
    distance: trips.reduce((sum, trip) => sum + (trip.planned_distance || 0), 0),
  }), [trips]);

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "All" || vehicleTypeFilter !== "All" || regionFilter !== "All");

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setVehicleTypeFilter("All");
    setRegionFilter("All");
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

  const handleVehicleTypeChange = (value) => {
    setVehicleTypeFilter(value);
    setPage(1);
  };

  const handleRegionChange = (value) => {
    setRegionFilter(value);
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingTrip(null);
    setIsFormOpen(true);
  };

  const openEditModal = (trip) => {
    setEditingTrip(trip);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setEditingTrip(null);
    setIsFormOpen(false);
  };

  const openViewModal = (trip) => {
    setSelectedTrip(trip);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedTrip(null);
    setIsDetailsOpen(false);
  };

  const openDispatchModal = (trip) => {
    setTripToDispatch(trip);
    setIsDispatchOpen(true);
  };

  const closeDispatchModal = () => {
    setTripToDispatch(null);
    setIsDispatchOpen(false);
  };

  const openCompleteModal = (trip) => {
    setTripToComplete(trip);
    setIsCompleteOpen(true);
  };

  const closeCompleteModal = () => {
    setTripToComplete(null);
    setIsCompleteOpen(false);
  };

  const openCancelModal = (trip) => {
    setTripToCancel(trip);
    setIsCancelOpen(true);
  };

  const closeCancelModal = () => {
    setTripToCancel(null);
    setIsCancelOpen(false);
  };

  const handleCreateOrEdit = async (values) => {
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    if (editingTrip) {
      setTrips((current) => current.map((trip) => (trip.id === editingTrip.id ? { ...trip, ...values } : trip)));
      toast.success("Trip updated successfully");
    } else {
      const newTrip = {
        id: Date.now(),
        trip_number: `TRIP-${String(Date.now()).slice(-4)}`,
        created_at: new Date().toISOString(),
        ...values,
      };
      setTrips((current) => [newTrip, ...current]);
      toast.success("Trip created successfully");
    }

    setIsSubmitting(false);
    closeFormModal();
  };

  const handleDispatch = async () => {
    if (!tripToDispatch) return;
    const trip = tripToDispatch;
    const vehicle = vehicles.find((item) => item.id === trip.vehicle_id);
    const driver = drivers.find((item) => item.id === trip.driver_id);

    if (!vehicle || !driver) {
      toast.error("This trip cannot be dispatched because the vehicle or driver is missing");
      return;
    }

    if (trip.status !== "Draft") {
      toast.error("Only draft trips can be dispatched");
      return;
    }

    if (vehicle.status !== "Available") {
      toast.error("The selected vehicle is not available for dispatch");
      return;
    }

    if (driver.status !== "Available") {
      toast.error("The selected driver is not available for dispatch");
      return;
    }

    if (driver.license_expiry && new Date(driver.license_expiry) < new Date()) {
      toast.error("The selected driver licence is expired");
      return;
    }

    if (trip.cargo_weight > vehicle.max_load_capacity) {
      toast.error("Cargo exceeds the selected vehicle capacity");
      return;
    }

    setIsDispatching(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setTrips((current) => current.map((item) => (item.id === trip.id ? { ...item, status: "Dispatched", departure_time: new Date().toISOString() } : item)));
    setVehicles((current) => current.map((item) => (item.id === vehicle.id ? { ...item, status: "On Trip" } : item)));
    setDrivers((current) => current.map((item) => (item.id === driver.id ? { ...item, status: "On Trip" } : item)));
    setIsDispatching(false);
    closeDispatchModal();
    toast.success("Trip dispatched successfully");
  };

  const handleComplete = async (values) => {
    if (!tripToComplete) return;
    const trip = tripToComplete;
    const vehicle = vehicles.find((item) => item.id === trip.vehicle_id);
    const driver = drivers.find((item) => item.id === trip.driver_id);

    setIsCompleting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setTrips((current) => current.map((item) => (item.id === trip.id ? { ...item, status: "Completed", actual_distance: values.actual_distance, fuel_used: values.fuel_used, arrival_time: values.arrival_time, revenue: values.revenue, final_odometer: values.final_odometer } : item)));
    setVehicles((current) => current.map((item) => (item.id === vehicle.id ? { ...item, status: "Available" } : item)));
    setDrivers((current) => current.map((item) => (item.id === driver.id ? { ...item, status: "Available" } : item)));
    setIsCompleting(false);
    closeCompleteModal();
    toast.success("Trip completed successfully");
  };

  const handleCancel = async () => {
    if (!tripToCancel) return;
    const trip = tripToCancel;
    const vehicle = vehicles.find((item) => item.id === trip.vehicle_id);
    const driver = drivers.find((item) => item.id === trip.driver_id);

    setIsCancelling(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setTrips((current) => current.map((item) => (item.id === trip.id ? { ...item, status: "Cancelled" } : item)));
    if (trip.status === "Dispatched") {
      setVehicles((current) => current.map((item) => (item.id === vehicle.id ? { ...item, status: "Available" } : item)));
      setDrivers((current) => current.map((item) => (item.id === driver.id ? { ...item, status: "Available" } : item)));
    }
    setIsCancelling(false);
    closeCancelModal();
    toast.success("Trip cancelled successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TripHeader onCreate={openCreateModal} />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <TripHeader onCreate={openCreateModal} />
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <TripHeader onCreate={openCreateModal} />
      <TripSummary stats={stats} />
      <TripToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        vehicleTypeFilter={vehicleTypeFilter}
        onVehicleTypeChange={handleVehicleTypeChange}
        regionFilter={regionFilter}
        onRegionChange={handleRegionChange}
        onClearFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredTrips.length === 0 ? (
        <EmptyState title="No trips found" description="Adjust the selected filters or create a new trip." actionLabel="Clear Filters" onAction={resetFilters} />
      ) : (
        <>
          <div className="flex flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filteredTrips.length)}–{Math.min(safePage * PAGE_SIZE, filteredTrips.length)} of {filteredTrips.length} trips</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Client-side workflow</div>
          </div>
          <TripTable trips={pagedTrips} onView={openViewModal} onEdit={openEditModal} onDispatch={openDispatchModal} onComplete={openCompleteModal} onCancel={openCancelModal} />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <TripFormModal open={isFormOpen} mode={editingTrip ? "edit" : "create"} trip={editingTrip} onClose={closeFormModal} onSubmit={handleCreateOrEdit} isSubmitting={isSubmitting} vehicles={vehicles} drivers={drivers} />
      <TripDetailsModal open={isDetailsOpen} trip={selectedTrip} onClose={closeDetailsModal} />
      <DispatchTripModal open={isDispatchOpen} trip={tripToDispatch} onClose={closeDispatchModal} onConfirm={handleDispatch} isDispatching={isDispatching} />
      <CompleteTripModal open={isCompleteOpen} trip={tripToComplete} onClose={closeCompleteModal} onSubmit={handleComplete} isCompleting={isCompleting} />
      <CancelTripModal open={isCancelOpen} trip={tripToCancel} onClose={closeCancelModal} onConfirm={handleCancel} isCancelling={isCancelling} />
    </div>
  );
}
