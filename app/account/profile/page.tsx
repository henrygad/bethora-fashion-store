"use client";

import { useState } from "react";
import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import Navbar from "@/components/shared/Navbar";
import AccountSidebar from "@/components/shared/AccountSidebar";
import Avatar from "@/components/shared/Avatar";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/firebase/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { UserProfile } from "@/types";
import { Eye, EyeOff, Camera } from "lucide-react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export default function ProfilePage() {
    const { user, profile, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "" });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");

    const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [pwError, setPwError] = useState("");
    const [pwSaving, setPwSaving] = useState(false);

    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })
        : "";

    const isDirty =
        form.name !== (profile?.name || "") ||
        form.phone !== (profile?.phone || "") ||
        photoFile !== null;

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(""), 2200);
    }

    function clearPendingPhoto() {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoFile(null);
        setPhotoPreview(null);
    }

    function startEditing() {
        setForm({ name: profile?.name || "", phone: profile?.phone || "" });
        setIsEditing(true);
    }

    function cancelEditing() {
        setForm({ name: profile?.name || "", phone: profile?.phone || "" });
        clearPendingPhoto();
        setIsEditing(false);
    }

    function handlePhotoSelect(file: File | undefined) {
        if (!file) return;
        if (!file.type.startsWith("image/")) { showToast("Please select an image file."); return; }
        if (file.size > MAX_PHOTO_SIZE) { showToast("Image must be smaller than 5MB."); return; }

        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    async function updateProfile() {
        if (!user) return;
        setSaving(true);
        try {
            const data: Partial<UserProfile> = { name: form.name, phone: form.phone };
            if (photoFile) {
                const { url } = await uploadToCloudinary(photoFile, `avatars/${user.uid}`);
                data.photoURL = url;
            }
            await updateUserProfile(user.uid, data);
            await refreshProfile();
            clearPendingPhoto();
            showToast("Profile updated successfully");
            setIsEditing(false);
        } catch {
            showToast("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handlePasswordUpdate() {
        setPwError("");
        if (pwForm.next.length < 6) { setPwError("New password must be at least 6 characters."); return; }
        if (pwForm.next !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
        if (!user || !user.email) return;

        setPwSaving(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, pwForm.current);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, pwForm.next);
            showToast("Password updated successfully");
            setPwForm({ current: "", next: "", confirm: "" });
        } catch (err: unknown) {
            const code = typeof err === "object" && err !== null && "code" in err
                ? (err as { code?: string }).code
                : undefined;
            if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
                setPwError("Current password is incorrect.");
            } else {
                setPwError("Failed to update password. Please try again.");
            }
        } finally {
            setPwSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
                <AccountSidebar />
                <main className="flex-1 min-w-0 space-y-5 fade-in">
                    {/* Profile card */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="mx-auto sm:mx-0">
                            <Avatar src={profile?.photoURL} alt={profile?.name} className="w-20 h-20" iconSize={40} />
                        </div>
                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <p className="font-bold text-lg">{profile?.name}</p>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                            <p className="text-sm text-gray-500">{profile?.phone}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {memberSince && `Member since ${memberSince}`}
                            </p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={startEditing}
                                className="shrink-0 bg-primary-400 text-gray-900 font-bold px-5 py-2.5 rounded-full hover:bg-primary-500 transition active:scale-95"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Account details / edit form */}
                    {isEditing ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className="font-bold text-sm mb-4">Edit Profile</h3>

                            {/* Profile photo */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-16 h-16 shrink-0">
                                    <Avatar src={photoPreview || profile?.photoURL} alt={profile?.name} className="w-16 h-16" iconSize={32} />
                                    <label
                                        title="Change photo"
                                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-400 text-gray-900 flex items-center justify-center cursor-pointer hover:bg-primary-500 transition shadow active:scale-90"
                                    >
                                        <Camera size={12} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handlePhotoSelect(e.target.files?.[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Profile Photo</p>
                                    <p className="text-xs text-gray-400">
                                        {photoFile ? "New photo selected — click Save Changes to apply" : "JPG or PNG, max 5MB"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Email Address</label>
                                    <input
                                        value={profile?.email || ""}
                                        disabled
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={cancelEditing}
                                    className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-full hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateProfile}
                                    disabled={saving || !isDirty}
                                    className="flex-1 bg-primary-400 text-gray-900 font-bold py-2.5 rounded-full hover:bg-primary-500 transition active:scale-95 disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className="font-bold text-sm mb-3">Account Details</h3>
                            <div className="space-y-2 text-sm">
                                {[
                                    { label: "Full Name", value: profile?.name },
                                    { label: "Email Address", value: profile?.email },
                                    { label: "Phone Number", value: profile?.phone },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between">
                                        <span className="text-gray-500">{label}</span>
                                        <span className="font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Change password */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-bold text-sm mb-4">Change Password</h3>
                        {pwError && (
                            <div className="bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-xl mb-3">{pwError}</div>
                        )}
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={pwForm.current}
                                    onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                                    placeholder="Current Password"
                                    className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showNext ? "text" : "password"}
                                    value={pwForm.next}
                                    onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                                    placeholder="New Password (min. 6 characters)"
                                    className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNext((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <input
                                type="password"
                                value={pwForm.confirm}
                                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                                placeholder="Confirm New Password"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
                            />
                        </div>
                        <button
                            onClick={handlePasswordUpdate}
                            disabled={pwSaving}
                            className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95 mt-4 disabled:opacity-60"
                        >
                            {pwSaving ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </main>
            </div>

            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg slide-up z-50 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
}
