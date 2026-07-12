"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import SettingsHeader from "@/components/settings/SettingsHeader";
import NotificationPreferences from "@/components/settings/NotificationPreferences";
import RegionalPreferences from "@/components/settings/RegionalPreferences";
import DashboardPreferences from "@/components/settings/DashboardPreferences";
import InterfacePreferences from "@/components/settings/InterfacePreferences";
import LoadingState from "@/components/ui/LoadingState";
import { defaultSettings, settingsStorageKey } from "@/components/settings/settingsData";

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings); const [hydrated, setHydrated] = useState(false); const [isSaving, setIsSaving] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { try { const stored = window.localStorage.getItem(settingsStorageKey); if (stored) { const parsed = JSON.parse(stored); if (parsed && typeof parsed === "object") setSettings({ ...defaultSettings, ...parsed }); } } catch { try { window.localStorage.removeItem(settingsStorageKey); } catch {} } finally { setHydrated(true); } }, 0); return () => window.clearTimeout(timer); }, []);
  const change = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const save = async () => { if (isSaving) return; setIsSaving(true); await new Promise((resolve) => window.setTimeout(resolve, 250)); try { window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings)); toast.success("Preferences saved"); } catch { toast.error("Preferences could not be saved locally"); } finally { setIsSaving(false); } };
  const reset = () => { if (isSaving) return; setSettings(defaultSettings); try { window.localStorage.removeItem(settingsStorageKey); toast.success("Defaults restored"); } catch { toast.error("Defaults could not be restored"); } };
  return <div className="min-w-0 space-y-6"><Toaster position="top-right" toastOptions={{ duration: 3000 }} /><SettingsHeader />{!hydrated ? <LoadingState label="Loading workspace preferences..." /> : <><div className="grid gap-6 xl:grid-cols-2"><NotificationPreferences settings={settings} onChange={change} /><RegionalPreferences settings={settings} onChange={change} /><DashboardPreferences settings={settings} onChange={change} /><InterfacePreferences settings={settings} onChange={change} /></div><div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={reset} disabled={isSaving} className="border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Reset defaults</button><button type="button" onClick={save} disabled={isSaving} className="bg-indigo-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving…" : "Save changes"}</button></div></>}</div>;
}
