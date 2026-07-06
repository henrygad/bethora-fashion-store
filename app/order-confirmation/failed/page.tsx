"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";

export default function OrderFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Navbar />
      </div>
    }>
      <OrderFailedContent />
    </Suspense>
  );
}

function OrderFailedContent() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason") || "Something went wrong while placing your order. Please try again.";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
          <XCircle size={42} className="text-red-600" />
        </div>
        <h1 className="text-xl font-bold mb-1">Order Not Placed</h1>
        <p className="text-gray-500 text-sm mb-6">{reason}</p>

        <div className="border border-gray-100 rounded-2xl p-4 text-left mb-8 bg-white">
          <p className="text-sm text-gray-600">
            Your cart hasn&apos;t been cleared, so you can review it and try again. If the problem continues, our support team can help.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-primary-400 text-gray-900 font-bold py-3 rounded-full hover:bg-primary-500 transition active:scale-95"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-full hover:bg-gray-800 transition"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
