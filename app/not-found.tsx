import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import Navbar from "@/components/shared/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-700">
          <SearchX size={38} />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">404 error</p>
        <h1 className="mt-2 text-2xl font-bold">This page does not exist</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          The page may have moved or the address may be incorrect.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800">
            <Home size={16} /> Go home
          </Link>
          <Link href="/products" className="rounded-full bg-primary-400 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-primary-500">
            Browse products
          </Link>
        </div>
      </main>
    </div>
  );
}
