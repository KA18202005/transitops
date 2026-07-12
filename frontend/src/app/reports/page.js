"use client";

import { useEffect, useMemo, useState } from "react";
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsFilters from "@/components/reports/ReportsFilters";
import ReportsSummary from "@/components/reports/ReportsSummary";
import UtilizationChart from "@/components/reports/UtilizationChart";
import RevenueCostChart from "@/components/reports/RevenueCostChart";
import FuelEfficiencyChart from "@/components/reports/FuelEfficiencyChart";
import ExpenseBreakdownChart from "@/components/reports/ExpenseBreakdownChart";
import FleetStatusChart from "@/components/reports/FleetStatusChart";
import VehiclePerformanceTable from "@/components/reports/VehiclePerformanceTable";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { reportDateRanges, reportVehicles, vehiclePerformanceRecords } from "@/constants/reportData";
import { buildPerformanceRows, expenseBreakdown, getReportMetrics, groupByMonth, statusDistribution } from "@/components/reports/reportUtils";

const defaultFilters = { ...reportDateRanges.ytd, vehicle: "all", type: "all", region: "all" };
export default function ReportsPage() {
  const [filters, setFilters] = useState(defaultFilters); const [rangeKey, setRangeKey] = useState("ytd"); const [loading, setLoading] = useState(true); const [error] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 180); return () => window.clearTimeout(timer); }, []);
  const rows = useMemo(() => buildPerformanceRows(vehiclePerformanceRecords, reportVehicles).filter((row) => (!filters.start || row.date >= filters.start) && (!filters.end || row.date <= filters.end) && (filters.vehicle === "all" || String(row.vehicle_id) === filters.vehicle) && (filters.type === "all" || row.vehicle?.vehicle_type === filters.type) && (filters.region === "all" || row.vehicle?.region === filters.region)), [filters]);
  const metrics = useMemo(() => getReportMetrics(rows), [rows]); const monthly = useMemo(() => groupByMonth(rows), [rows]); const expenses = useMemo(() => expenseBreakdown(rows), [rows]); const statuses = useMemo(() => statusDistribution(rows), [rows]);
  const update = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); if (key === "start" || key === "end") setRangeKey("custom"); };
  const chooseRange = (key) => { setRangeKey(key); setFilters((current) => ({ ...current, ...reportDateRanges[key] })); };
  const reset = () => { setFilters(defaultFilters); setRangeKey("ytd"); };
  const hasActive = Object.entries(filters).some(([key, value]) => key === "start" ? value !== defaultFilters.start : key === "end" ? value !== defaultFilters.end : value !== "all");
  const exportCsv = () => { const header = ["Vehicle", "Registration", "Distance (km)", "Fuel Used (L)", "Fuel Efficiency (km/L)", "Fuel Cost (INR)", "Maintenance Cost (INR)", "Revenue (INR)", "Operational Cost (INR)", "ROI (%)"]; const cells = rows.map((row) => [row.vehicle?.vehicle_name, row.vehicle?.registration_number, row.distance, row.fuel_used, Number.isFinite(row.fuelEfficiency) ? row.fuelEfficiency.toFixed(2) : "Not available", row.fuel_cost, row.maintenance_cost, row.revenue, row.operationalCost, Number.isFinite(row.roi) ? (row.roi * 100).toFixed(2) : "Not available"]); const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`; const blob = new Blob([[header, ...cells].map((line) => line.map(quote).join(",")).join("\n")], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "transitops-vehicle-performance.csv"; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); };
  return <div className="min-w-0 space-y-6"><ReportsHeader rangeKey={rangeKey} onRangeChange={chooseRange} onExport={exportCsv} />{loading ? <LoadingState label="Preparing executive operations intelligence..." /> : error ? <ErrorState title="Reports are unavailable" description="A reporting connection can be added here in a future release." /> : <><ReportsFilters filters={filters} onChange={update} vehicles={reportVehicles} onClear={reset} active={hasActive} />{rows.length ? <><ReportsSummary metrics={metrics} /><section className="grid gap-4 xl:grid-cols-2"><UtilizationChart data={monthly} /><RevenueCostChart data={monthly} /><FuelEfficiencyChart data={monthly} /><ExpenseBreakdownChart data={expenses} /><FleetStatusChart data={statuses} /></section><VehiclePerformanceTable rows={rows} /></> : <EmptyState title="No report data matches these filters" description="Adjust the reporting range or clear filters to restore the performance ledger." actionLabel="Clear filters" onAction={reset} />}</>}</div>;
}
