"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  CarFront,
  Fuel,
  LayoutDashboard,
  LogOut,
  Route,
  Settings,
  UserRound,
  Wrench,
  Users,
  BadgeDollarSign,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Vehicles", icon: CarFront },
  { href: "/drivers", label: "Drivers", icon: Users },
  { href: "/trips", label: "Trips", icon: Route },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/fuel", label: "Fuel", icon: Fuel },
  { href: "/expenses", label: "Expenses", icon: BadgeDollarSign },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(180deg,_#06101d_0%,_#0d1727_100%)] text-slate-100 shadow-[16px_0_40px_-24px_rgba(2,6,23,0.85)] transition-transform duration-200 ease-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900/80 text-sky-300 shadow-sm">
          <Route size={18} />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">TransitOps</p>
          <p className="text-sm text-slate-400">Fleet operations</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Sidebar navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-slate-800/90 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
              }`}
            >
              <span className={`rounded-lg p-2 ${active ? "bg-slate-700/80 text-sky-300" : "bg-slate-900/80 text-slate-400"}`}>
                <Icon size={16} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/80 p-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3 shadow-inner shadow-black/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-200">
              <UserRound size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[170px]" title={user?.full_name || "Guest"}>
                {user?.full_name || "Guest User"}
              </p>
              <p className="text-xs text-slate-400">
                {user?.role || "Fleet Operations"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
