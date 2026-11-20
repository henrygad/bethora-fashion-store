import Link from "next/link";
import { PackageSearch } from "lucide-react";
import Navbar from "@/components/shared/Navbar";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-700">
          <PackageSearch size={38} />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Product unavailable</p>
        <h1 className="mt-2 text-2xl font-bold">We couldn&apos;t find this product</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          It may have been removed, hidden, or the link may be incorrect. Browse the store to find another item.
        </p>
        <Link href="/products" className="mt-7 rounded-full bg-primary-400 px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-primary-500">
          Browse all products
        </Link>
      </main>
    </div>
  );
}
