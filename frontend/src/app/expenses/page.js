"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";
import ExpenseToolbar from "@/components/expenses/ExpenseToolbar";
import ExpenseChart from "@/components/expenses/ExpenseChart";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseFormModal from "@/components/expenses/ExpenseFormModal";
import ExpenseDetailsModal from "@/components/expenses/ExpenseDetailsModal";
import DeleteExpenseModal from "@/components/expenses/DeleteExpenseModal";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { formatCurrency } from "@/components/expenses/expenseUtils";
import { expenseTypes, initialExpenses } from "@/constants/expenseData";
import { initialTrips } from "@/constants/tripData";
import { initialVehicles } from "@/constants/vehicleData";

const PAGE_SIZE = 6;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [tripFilter, setTripFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setExpenses(initialExpenses);
        setVehicles(initialVehicles);
        setTrips(initialTrips);
        setError("");
      } catch {
        setError("Unable to load expense data");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredExpenses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return expenses.filter((expense) => {
      const vehicle = vehicles.find((item) => item.id === expense.vehicle_id);
      const trip = trips.find((item) => item.id === expense.trip_id);
      const searchText = [expense.description, expense.type, vehicle?.registration_number, vehicle?.vehicle_name, trip?.trip_number]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchText.includes(query);
      const matchesType = typeFilter === "All" || expense.type === typeFilter;
      const matchesVehicle = vehicleFilter === "All" || String(expense.vehicle_id) === String(vehicleFilter);
      const matchesTrip =
        tripFilter === "All" ||
        (tripFilter === "Linked" && Boolean(trip)) ||
        (tripFilter === "Unlinked" && !trip);
      const expenseMonth = expense.date ? expense.date.slice(0, 7) : "";
      const matchesMonth = !monthFilter || expenseMonth === monthFilter;

      return matchesSearch && matchesType && matchesVehicle && matchesTrip && matchesMonth;
    });
  }, [expenses, vehicles, trips, searchTerm, typeFilter, vehicleFilter, tripFilter, monthFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedExpenses = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredExpenses.slice(start, start + PAGE_SIZE);
  }, [filteredExpenses, safePage]);

  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const currentMonthSpend = expenses
      .filter((item) => item.date && item.date.slice(0, 7) === new Date().toISOString().slice(0, 7))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const fuelExpenses = expenses.filter((item) => item.type === "Fuel").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const maintenanceExpenses = expenses.filter((item) => item.type === "Maintenance").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const otherExpenses = expenses.filter((item) => item.type !== "Fuel" && item.type !== "Maintenance").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const averageExpense = expenses.length ? totalExpenses / expenses.length : 0;

    return {
      totalExpenses: formatCurrency(totalExpenses),
      currentMonthSpend: formatCurrency(currentMonthSpend),
      fuelExpenses: formatCurrency(fuelExpenses),
      maintenanceExpenses: formatCurrency(maintenanceExpenses),
      otherExpenses: formatCurrency(otherExpenses),
      averageExpense: formatCurrency(averageExpense),
    };
  }, [expenses]);

  const chartData = useMemo(() => {
    return ["Fuel", "Maintenance", "Toll", "Parking", "Miscellaneous"]
      .map((type) => ({
        name: type,
        value: filteredExpenses.filter((expense) => expense.type === type).reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
      }))
      .filter((entry) => entry.value > 0);
  }, [filteredExpenses]);

  const hasActiveFilters = Boolean(searchTerm || typeFilter !== "All" || vehicleFilter !== "All" || tripFilter !== "All" || monthFilter);

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setVehicleFilter("All");
    setTripFilter("All");
    setMonthFilter("");
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  const openViewModal = (expense) => {
    setSelectedExpense(expense);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedExpense(null);
    setIsDetailsOpen(false);
  };

  const openDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setExpenseToDelete(null);
    setIsDeleteOpen(false);
  };

  const handleCreateOrEdit = async (values) => {
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    const normalizedValues = {
      ...values,
      vehicle_id: Number(values.vehicle_id),
      amount: Number(values.amount),
      trip_id: values.trip_id ? Number(values.trip_id) : null,
    };

    if (editingExpense) {
      setExpenses((current) => current.map((expense) => (expense.id === editingExpense.id ? { ...expense, ...normalizedValues } : expense)));
      toast.success("Expense updated successfully");
    } else {
      const newExpense = {
        id: Date.now(),
        ...normalizedValues,
        created_at: new Date().toISOString(),
      };
      setExpenses((current) => [newExpense, ...current]);
      toast.success("Expense created successfully");
    }

    setIsSubmitting(false);
    closeFormModal();
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    setExpenses((current) => current.filter((expense) => expense.id !== expenseToDelete.id));
    setIsDeleting(false);
    closeDeleteModal();
    toast.success("Expense deleted successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ExpenseHeader onCreate={openCreateModal} />
        <LoadingState label="Loading expenses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ExpenseHeader onCreate={openCreateModal} />
        <EmptyState title="Unable to load expenses" description="The expense ledger could not be loaded." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <ExpenseHeader onCreate={openCreateModal} />
      <ExpenseSummary stats={stats} />
      <ExpenseChart data={chartData} />
      <ExpenseToolbar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        typeFilter={typeFilter}
        onTypeChange={(value) => {
          setTypeFilter(value);
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
        onClearFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredExpenses.length === 0 ? (
        <EmptyState title="No expenses found" description="Adjust the filters or create a new expense entry." actionLabel="Clear Filters" onAction={resetFilters} />
      ) : (
        <>
          <div className="flex flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filteredExpenses.length)}–{Math.min(safePage * PAGE_SIZE, filteredExpenses.length)} of {filteredExpenses.length} expenses
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Client-side expense ledger</div>
          </div>
          <ExpenseTable expenses={pagedExpenses} vehicles={vehicles} trips={trips} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ExpenseFormModal
        open={isFormOpen}
        mode={editingExpense ? "edit" : "create"}
        expense={editingExpense}
        onClose={closeFormModal}
        onSubmit={handleCreateOrEdit}
        isSubmitting={isSubmitting}
        vehicles={vehicles}
        trips={trips}
        selectedVehicleId={vehicleFilter !== "All" ? vehicleFilter : ""}
      />
      <ExpenseDetailsModal
        open={isDetailsOpen}
        expense={selectedExpense}
        vehicle={selectedExpense ? vehicles.find((item) => item.id === selectedExpense.vehicle_id) : null}
        trip={selectedExpense ? trips.find((item) => item.id === selectedExpense.trip_id) : null}
        onClose={closeDetailsModal}
      />
      <DeleteExpenseModal open={isDeleteOpen} expense={expenseToDelete} onClose={closeDeleteModal} onConfirm={handleDelete} isDeleting={isDeleting} />
    </div>
  );
}
