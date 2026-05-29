import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "../../../../assets/img/xuhuong2025.webp";

function ShopHeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <img src={heroImage} alt="Shop thời trang Poly Fashion" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <div className="relative mx-auto grid min-h-[460px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-champagne">New season</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-[1.18] tracking-normal md:text-6xl md:leading-[1.16]">
            Cửa hàng thời trang hiện đại
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            Lọc nhanh theo phong cách, khám phá sản phẩm mới và chọn outfit phù hợp cho đi học, đi làm, đi chơi.
          </p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-ink shadow-lift transition hover:-translate-y-0.5">
            Mua sắm ngay <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hidden rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur lg:block">
          <p className="text-sm uppercase tracking-[0.25em] text-champagne">Style note</p>
          <p className="mt-4 text-xl font-semibold leading-8">
            Tối giản hơn, cao cấp hơn, dễ mua hơn. Mỗi sản phẩm đều được trình bày rõ giá, khuyến mãi và hình ảnh.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ShopHeroSection;
