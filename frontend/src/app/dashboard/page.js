"use client";

import { useMemo, useState } from "react";
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

  const filteredKpis = useMemo(() => {
    const statusAdjustments = {
      Available: 1,
      "On Trip": 0,
      "In Shop": -1,
    };

    return dashboardKpis.map((kpi) => {
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
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
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
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <TripsOverviewChart data={tripActivityData} />
        <FleetStatusChart data={fleetStatusData} />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CostOverviewChart data={costOverviewData} />
        <div className="space-y-6">
          <RecentActivity activities={recentActivities} />
          <QuickActions actions={quickActions} />
        </div>
      </section>
    </div>
  );
}
