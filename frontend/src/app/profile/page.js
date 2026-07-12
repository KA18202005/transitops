"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSummary from "@/components/profile/ProfileSummary";
import ProfileForm from "@/components/profile/ProfileForm";
import RoleCapabilities from "@/components/profile/RoleCapabilities";
import { currentUser, roleCapabilities } from "@/components/profile/profileData";

export default function ProfilePage() {
  const [user, setUser] = useState(currentUser); const [isSaving, setIsSaving] = useState(false);
  const save = async (values) => { if (isSaving) return; setIsSaving(true); await new Promise((resolve) => window.setTimeout(resolve, 300)); setUser((current) => ({ ...current, ...values })); setIsSaving(false); toast.success("Profile details saved"); };
  return <div className="min-w-0 space-y-6 pt-2 sm:pt-3 lg:pt-4"><Toaster position="top-right" toastOptions={{ duration: 3000 }} /><ProfileHeader /><div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]"><div className="space-y-6"><ProfileSummary user={user} /><RoleCapabilities role={user.role} capabilities={roleCapabilities} /></div><ProfileForm user={user} onSave={save} isSaving={isSaving} /></div></div>;
}
