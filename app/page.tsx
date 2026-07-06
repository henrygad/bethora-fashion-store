import Navbar from "@/components/shared/Navbar";
import HeroSlider from "@/components/storefront/HeroSlider";
import CategoryRow from "@/components/storefront/CategoryRow";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSlider />

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-6">
        {/* Category icons */}
        <CategoryRow />

        {/* Free delivery banner */}
        <div className="bg-gray-900 text-white rounded-2xl px-5 py-4 flex items-center justify-between">
          <p className="text-sm sm:text-base font-semibold">
            Free delivery on orders above ₦20,000
          </p>
          <span className="text-2xl">🚚</span>
        </div>

        {/* Trending products */}
        <div>
          <h2 className="text-lg font-bold mb-3">Trending Now</h2>
          <FeaturedProducts />
        </div>
      </div>
    </div>
  );
}