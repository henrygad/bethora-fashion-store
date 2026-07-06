"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AccountSidebar from "@/components/shared/AccountSidebar";
import { useAuth } from "@/context/AuthContext";
import { getAddressesByUser, addAddress, updateAddress, deleteAddress } from "@/lib/firebase/firestore";
import type { Address } from "@/types";
import { NIGERIAN_STATES } from "@/types";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const EMPTY_FORM = { label: "", name: "", phone: "", address: "", state: "", isDefault: false };

type AddressTextField = "label" | "name" | "phone" | "address" | "state";

export default function AddressesPage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);

    async function load() {
        if (user) setAddresses(await getAddressesByUser(user.uid));
    }

    useEffect(() => {
        if (user) getAddressesByUser(user.uid).then(setAddresses);
    }, [user]);

    function openAdd() { setForm({ ...EMPTY_FORM }); setEditId(null); setShowForm(true); }
    function openEdit(a: Address) { setForm({ label: a.label, name: a.name, phone: a.phone, address: a.address, state: a.state, isDefault: a.isDefault }); setEditId(a.id); setShowForm(true); }

    async function save() {
        if (!user || !form.name || !form.phone || !form.address || !form.state) return;
        setSaving(true);
        if (editId) {
            await updateAddress(editId, form);
        } else {
            await addAddress({ ...form, userId: user.uid, isDefault: addresses.length === 0 });
        }
        await load();
        setShowForm(false);
        setSaving(false);
    }

    async function remove(id: string) {
        await deleteAddress(id);
        await load();
    }

    async function setDefault(id: string) {
        if (!user) return;
        await Promise.all(addresses.map((a) => updateAddress(a.id, { isDefault: a.id === id })));
        await load();
    }

    const f = (key: AddressTextField, placeholder: string, type = "text") => (
        <input
            type={type}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition"
        />
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
                <AccountSidebar />
                <main className="flex-1 min-w-0 fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Saved Addresses</h2>
                        <button
                            onClick={openAdd}
                            className="flex items-center gap-1.5 bg-primary-400 text-gray-900 text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary-500 transition"
                        >
                            <Plus size={14} /> Add New
                        </button>
                    </div>

                    <div className="space-y-3">
                        {addresses.map((addr) => (
                            <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">{addr.label}</span>
                                        {addr.isDefault && <span className="bg-green-50 text-green-700 text-[11px] font-semibold px-2 py-1 rounded-full">Default</span>}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(addr)} className="p-1.5 text-gray-400 hover:text-gray-700 transition"><Edit2 size={14} /></button>
                                        <button onClick={() => remove(addr.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <p className="text-sm font-medium">{addr.name} · {addr.phone}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{addr.address}, {addr.state}</p>
                                {!addr.isDefault && (
                                    <button onClick={() => setDefault(addr.id)} className="text-xs text-primary-600 font-medium mt-2 hover:underline">
                                        Set as default
                                    </button>
                                )}
                            </div>
                        ))}
                        {addresses.length === 0 && <p className="text-center text-gray-400 text-sm py-16">No saved addresses yet.</p>}
                    </div>
                </main>
            </div>

            {/* Address form modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">{editId ? "Edit Address" : "Add New Address"}</h3>
                            <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="space-y-3">
                            {f("label", "Label (e.g. Home, Office)")}
                            {f("name", "Full Name")}
                            {f("phone", "Phone Number", "tel")}
                            {f("address", "Street Address")}
                            <select
                                value={form.state}
                                onChange={(e) => setForm({ ...form, state: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white transition"
                            >
                                <option value="">Select State</option>
                                {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={save}
                            disabled={saving}
                            className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition mt-5 disabled:opacity-60"
                        >
                            {saving ? "Saving..." : editId ? "Save Changes" : "Add Address"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}