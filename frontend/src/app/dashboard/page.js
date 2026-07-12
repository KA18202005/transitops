"use client";

import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import CostOverviewChart from "../../components/dashboard/CostOverviewChart";
import DashboardFilters from "../../components/dashboard/DashboardFilters";
import FleetStatusChart from "../../components/dashboard/FleetStatusChart";
import KpiCard from "../../components/dashboard/KpiCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import TripsOverviewChart from "../../components/dashboard/TripsOverviewChart";
import {
  costOverviewData,
  dashboardKpis,
  fleetStatusData,
  quickActions,
  recentActivities,
  tripActivityData,
} from "../../components/dashboard/dashboardData";
import { getDashboardSummary } from "@/services/dashboard";
import { getApiErrorMessage } from "@/services/api";

const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    vehicleType: "All",
    status: "All",
    region: "All",
  });
  const [period, setPeriod] = useState("Last 7 days");
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [activityModule, setActivityModule] = useState("All");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        if (mounted) {
          setSummary(data);
        }
      } catch (error) {
        toast.error(`Using demo dashboard data: ${getApiErrorMessage(error, "API unavailable")}`);
      }
    }

    loadSummary();
    return () => {
      mounted = false;
    };
  }, []);

  const periodMultiplier = period === "Last 30 days" ? 1.18 : period === "This quarter" ? 1.32 : 1;
  const periodTripData = useMemo(() => tripActivityData.map((item) => ({ ...item, dispatched: Math.round(item.dispatched * periodMultiplier), completed: Math.round(item.completed * periodMultiplier) })), [periodMultiplier]);
  const periodCostData = useMemo(() => costOverviewData.map((item) => ({ ...item, value: Math.round(item.value * periodMultiplier) })), [periodMultiplier]);
  const filteredActivities = useMemo(() => activityModule === "All" ? recentActivities : recentActivities.filter((activity) => activity.module === activityModule), [activityModule]);
  const selectedKpiInsight = {
    "active-vehicles": "63 Available · 48 On Trip · 11 In Shop",
    "active-trips": "18 dispatched · 6 scheduled for dispatch",
    "fleet-utilization": "81% current utilization · 4 points above the weekly baseline",
  }[selectedKpi];

  const filteredKpis = useMemo(() => {
    const statusAdjustments = {
      Available: 1,
      "On Trip": 0,
      "In Shop": -1,
    };

    return dashboardKpis.map((kpi) => {
      if (summary) {
        if (kpi.id === "active-vehicles") {
          return { ...kpi, value: String(summary.total_vehicles) };
        }

        if (kpi.id === "available-vehicles") {
          return { ...kpi, value: String(summary.vehicles_available) };
        }

        if (kpi.id === "active-trips") {
          return { ...kpi, value: String(summary.trips_running) };
        }

        if (kpi.id === "drivers-duty") {
          return { ...kpi, value: String(summary.drivers_available) };
        }

        if (kpi.id === "fleet-utilization") {
          const utilization = summary.total_vehicles ? Math.round((summary.trips_running / summary.total_vehicles) * 100) : 0;
          return { ...kpi, value: `${utilization}%`, detail: `${summary.trips_completed} completed trips` };
        }
      }

      if (kpi.id === "active-vehicles") {
        return {
          ...kpi,
          value: filters.region === "North" ? "131" : filters.region === "Central" ? "134" : "128",
        };
      }

      if (kpi.id === "available-vehicles") {
        return {
          ...kpi,
          value: filters.status === "Available" ? "71" : filters.status === "On Trip" ? "54" : "63",
        };
      }

      if (kpi.id === "maintenance-vehicles") {
        return {
          ...kpi,
          value: filters.status === "In Shop" ? "14" : "11",
        };
      }

      if (kpi.id === "active-trips") {
        return {
          ...kpi,
          value: filters.region === "South" ? "27" : "24",
        };
      }

      if (kpi.id === "drivers-duty") {
        return {
          ...kpi,
          value: filters.vehicleType === "Bus" ? "41" : "37",
        };
      }

      if (kpi.id === "fleet-utilization") {
        return {
          ...kpi,
          value: filters.status === "On Trip" ? "84%" : "81%",
        };
      }

      return kpi;
    });
  }, [filters, summary]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_32%),linear-gradient(135deg,_#06111f_0%,_#101d31_55%,_#0c172b_100%)] p-6 text-white shadow-[0_16px_50px_-24px_rgba(2,6,23,0.65)] sm:p-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Fleet operations overview
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Fleet Operations Overview
            </h1>
            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Monitor fleet availability, dispatch activity, maintenance, and operational costs.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="dashboard-period">Dashboard period</label>
            <select id="dashboard-period" value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-slate-400"><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option></select>
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 shadow-inner shadow-black/10">
              {formattedDate}
            </div>
            <button
              type="button"
              className="rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Export report
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Operational filters</h2>
        </div>
        <DashboardFilters filters={filters} onChange={handleFilterChange} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredKpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            detail={kpi.detail}
            icon={kpi.icon}
            tone={kpi.tone}
            selected={selectedKpi === kpi.id}
            onClick={["active-vehicles", "active-trips", "fleet-utilization"].includes(kpi.id) ? () => setSelectedKpi((current) => current === kpi.id ? null : kpi.id) : undefined}
          />
        ))}
      </section>

      {selectedKpiInsight ? <section className="border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900"><span className="font-semibold">Operational breakdown:</span> {selectedKpiInsight}</section> : null}

      <section className="grid gap-3 border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Utilization signal</p><p className="mt-1 text-sm font-semibold text-slate-800">Truck category carries the highest active allocation.</p></div><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Maintenance attention</p><p className="mt-1 text-sm font-semibold text-slate-800">11 vehicles are currently in the maintenance queue.</p></div><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Cost driver</p><p className="mt-1 text-sm font-semibold text-slate-800">Fuel remains the largest operational cost category.</p></div></section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <TripsOverviewChart data={periodTripData} />
        <FleetStatusChart data={fleetStatusData} />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CostOverviewChart data={periodCostData} />
        <div className="space-y-6">
          <RecentActivity activities={filteredActivities} activeModule={activityModule} onModuleChange={setActivityModule} />
          <QuickActions actions={quickActions} />
        </div>
      </section>
    </div>
  );
}
