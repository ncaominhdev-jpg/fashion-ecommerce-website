import ShopHeroSection from "./ShopHeroSection/ShopHeroSection";
import ProductSidebar from "./ProductSidebar/ProductSidebar";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";
import DealsSlider from "../Home/DealsSlider/DealsSlider";
import CustomerReviews from "../Home/CustomerReviews/CustomerReviews";
import FashionTipsSlider from "./FashionTipsSlider/FashionTipsSlider";

const Shop = () => {
  return (
    <div className="font-sans">
      <ShopHeroSection />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductSidebar />
        <FeaturedProducts />
        <DealsSlider />
        <CustomerReviews />
        <FashionTipsSlider />
      </main>
    </div>
  );
};

export default Shop;
