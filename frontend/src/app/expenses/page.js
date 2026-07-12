"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import ErrorState from "@/components/ui/ErrorState";
import { formatCurrency } from "@/components/expenses/expenseUtils";
import { expenseTypes, initialExpenses } from "@/constants/expenseData";
import { initialTrips } from "@/constants/tripData";
import { initialVehicles } from "@/constants/vehicleData";
import { listVehicles } from "@/services/vehicle";
import { listTrips } from "@/services/trip";
import { createExpense, deleteExpense, listExpenses, updateExpense } from "@/services/expense";
import { getApiErrorMessage } from "@/services/api";

const PAGE_SIZE = 8;
const defaultFilters = { search: "", type: "all", vehicle: "all", association: "all", month: "" };
const localDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

function Pager({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);
  return <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Expense pagination"><button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex items-center gap-1 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} aria-hidden="true" /> Previous</button>{pages.map((page, index) => <span key={page} className="contents">{index > 0 && page - pages[index - 1] > 1 ? <span className="px-1 text-slate-400">…</span> : null}<button type="button" onClick={() => onPageChange(page)} aria-current={page === currentPage ? "page" : undefined} className={`min-w-10 border px-3 py-2 text-sm font-bold ${page === currentPage ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{page}</button></span>)}<button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="inline-flex items-center gap-1 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={16} aria-hidden="true" /></button></nav>;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [trips, setTrips] = useState(initialTrips);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [formExpense, setFormExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadExpenseData() {
      try {
        const [expenseData, vehicleData, tripData] = await Promise.all([listExpenses(), listVehicles(), listTrips()]);
        if (mounted) { setExpenses(expenseData); setVehicles(vehicleData); setTrips(tripData); setLoadError(false); }
      } catch (error) {
        if (mounted) {
          setExpenses(initialExpenses);
          setVehicles(initialVehicles);
          setTrips(initialTrips);
          setLoadError(false);
          toast.error(`Using demo expense data: ${getApiErrorMessage(error, "API unavailable")}`);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadExpenseData();
    return () => { mounted = false; };
  }, []);

  const filteredExpenses = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return expenses.filter((expense) => {
      const vehicle = vehicles.find((item) => String(item.id) === String(expense.vehicle_id));
      const trip = trips.find((item) => String(item.id) === String(expense.trip_id));
      const searchText = [vehicle?.registration_number, vehicle?.vehicle_name, trip?.trip_number, expense.description].filter(Boolean).join(" ").toLowerCase();
      return (!query || searchText.includes(query)) && (filters.type === "all" || expense.type === filters.type) && (filters.vehicle === "all" || String(expense.vehicle_id) === filters.vehicle) && (filters.association === "all" || (filters.association === "linked" ? Boolean(expense.trip_id) : !expense.trip_id)) && (!filters.month || expense.date.slice(0, 7) === filters.month);
    });
  }, [expenses, filters, vehicles, trips]);

  const stats = useMemo(() => {
    const amountFor = (predicate) => expenses.filter(predicate).reduce((total, expense) => total + Number(expense.amount), 0);
    const total = amountFor(() => true);
    const currentMonth = localDate().slice(0, 7);
    return { totalExpenses: formatCurrency(total), currentMonthSpend: formatCurrency(amountFor((expense) => expense.date.slice(0, 7) === currentMonth)), fuelExpenses: formatCurrency(amountFor((expense) => expense.type === "Fuel")), maintenanceExpenses: formatCurrency(amountFor((expense) => expense.type === "Maintenance")), otherExpenses: formatCurrency(amountFor((expense) => !["Fuel", "Maintenance"].includes(expense.type))), averageExpense: formatCurrency(expenses.length ? total / expenses.length : 0) };
  }, [expenses]);

  const chartData = useMemo(() => expenseTypes.map((type) => ({ name: type, value: expenses.filter((expense) => expense.type === type).reduce((total, expense) => total + Number(expense.amount), 0) })), [expenses]);
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageExpenses = filteredExpenses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasActiveFilters = Object.values(filters).some(Boolean) && Object.entries(filters).some(([key, value]) => key === "search" ? Boolean(value) : value !== "all" && Boolean(value));

  const changeFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1); };
  const clearFilters = () => { setFilters(defaultFilters); setPage(1); };
  const openCreate = () => { setFormExpense(null); setIsFormOpen(true); };
  const openEdit = (expense) => { setFormExpense(expense); setIsFormOpen(true); };
  const closeForm = () => { if (!isSubmitting) { setIsFormOpen(false); setFormExpense(null); } };

  const saveExpense = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const normalised = { ...values, vehicle_id: Number(values.vehicle_id), trip_id: values.trip_id ? Number(values.trip_id) : null, amount: Number(values.amount) };
    try {
      if (formExpense) { const savedExpense = await updateExpense(formExpense.id, normalised); setExpenses((current) => current.map((expense) => expense.id === formExpense.id ? savedExpense : expense)); toast.success("Expense updated successfully"); } else { const savedExpense = await createExpense(normalised); setExpenses((current) => [savedExpense, ...current]); toast.success("Expense added to the ledger"); }
      setIsFormOpen(false); setFormExpense(null); setPage(1);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save expense"));
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDelete = async () => {
    if (!deletingExpense || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteExpense(deletingExpense.id);
      setExpenses((current) => current.filter((expense) => expense.id !== deletingExpense.id));
      setDeletingExpense(null); toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete expense"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <ExpenseHeader onCreate={openCreate} />
      {isLoading ? (
        <LoadingState label="Loading expense ledger..." />
      ) : loadError ? (
        <ErrorState title="Unable to load expenses" description="Expense data will be available here when the ledger connection is restored." />
      ) : (
        <>
          <ExpenseSummary stats={stats} />
          <ExpenseChart data={chartData} />
          <ExpenseToolbar filters={filters} onChange={changeFilter} vehicles={vehicles} onClearFilters={clearFilters} hasActiveFilters={hasActiveFilters} />
          {expenses.length === 0 ? (
            <EmptyState title="Your expense ledger is empty" description="Add an expense to begin monitoring operational outflow." actionLabel="Add Expense" onAction={openCreate} />
          ) : filteredExpenses.length === 0 ? (
            <EmptyState title="No matching expenses" description="No ledger entries match the current search or filters." actionLabel="Clear Filters" onAction={clearFilters} />
          ) : (
            <>
              <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredExpenses.length)}</span> of{" "}
                  <span className="font-semibold text-slate-700">{filteredExpenses.length}</span> expenses
                </p>
              </div>
              <ExpenseTable expenses={pageExpenses} vehicles={vehicles} trips={trips} onView={setViewingExpense} onEdit={openEdit} onDelete={setDeletingExpense} />
              <Pager currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
      <ExpenseFormModal open={isFormOpen} mode={formExpense ? "edit" : "create"} expense={formExpense} onClose={closeForm} onSubmit={saveExpense} isSubmitting={isSubmitting} vehicles={vehicles} trips={trips} />
      <ExpenseDetailsModal
        open={Boolean(viewingExpense)}
        expense={viewingExpense}
        vehicle={viewingExpense ? vehicles.find((vehicle) => String(vehicle.id) === String(viewingExpense.vehicle_id)) : null}
        trip={viewingExpense ? trips.find((trip) => String(trip.id) === String(viewingExpense.trip_id)) : null}
        onClose={() => setViewingExpense(null)}
      />
      <DeleteExpenseModal open={Boolean(deletingExpense)} expense={deletingExpense} onClose={() => setDeletingExpense(null)} onConfirm={confirmDelete} isDeleting={isDeleting} />
    </div>
  );
}
