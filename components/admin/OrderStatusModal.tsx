"use client";

import { X } from "lucide-react";
import type { Order } from "@/types";

interface Props {
    order: Order | null;
    onClose: () => void;
    onStatusUpdate: (id: string, status: Order["status"]) => void;
}

const STATUSES: Order["status"][] = ["Processing", "Shipped", "Delivered"];

export default function OrderStatusModal({ order, onClose, onStatusUpdate }: Props) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base">Order {order.id}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 transition">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </p>

                {/* Customer */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <p className="text-xs text-gray-500 mb-0.5">Customer</p>
                    <p className="text-sm font-semibold">{order.address.name}</p>
                    <p className="text-xs text-gray-500">{order.address.phone}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.address.address}, {order.address.state}</p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                    Qty {item.qty}{item.size ? ` · ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}
                                </p>
                            </div>
                            <span className="text-xs font-semibold shrink-0">₦{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-3 mb-5">
                    <span>Total</span>
                    <span>₦{order.total.toLocaleString()}</span>
                </div>

                {/* Status update */}
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Update Status</p>
                <div className="grid grid-cols-3 gap-2">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => onStatusUpdate(order.id, s)}
                            className={`text-xs font-semibold py-2.5 rounded-xl transition ${order.status === s
                                    ? "bg-primary-400 text-gray-900"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}