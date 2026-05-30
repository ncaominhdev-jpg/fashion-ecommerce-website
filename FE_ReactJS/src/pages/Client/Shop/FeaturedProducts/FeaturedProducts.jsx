import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Constants from "../../../../Constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const tabs = [
  { key: "featured", label: "Nổi bật" },
  { key: "new-arrival", label: "Hàng mới" },
  { key: "flash-sale", label: "Flash sale" },
];

const cleanText = (value) => String(value || "");
const formatPrice = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState("featured");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          axios.get(`${Constants.DOMAIN_API}/product/list`),
          axios.get(`${Constants.DOMAIN_API}/category/list`),
          axios.get(`${Constants.DOMAIN_API}/brand/list`),
        ]);

        const activeCategoryIds = new Set(
          (categoryRes.data.data || [])
            .filter((category) => category.status === "active")
            .map((category) => Number(category.id))
        );
        const brandById = new Map(
          (brandRes.data.data || [])
            .filter((brand) => brand.status !== "inactive")
            .map((brand) => [Number(brand.id), brand])
        );

        const formatted = (productRes.data.data || [])
          .filter(
            (product) =>
              product.visibility !== "hidden" &&
              activeCategoryIds.has(Number(product.category_id)) &&
              (!product.brand_id || brandById.has(Number(product.brand_id)))
          )
          .map((product) => ({
            id: product.id,
            name: product.name,
            price: Number(product.sale_price) > 0 ? Number(product.sale_price) : Number(product.price),
            oldPrice: Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price) ? Number(product.price) : null,
            img: product.image,
            createdAt: product.createdAt,
            featured: product.featured,
            salePrice: Number(product.sale_price),
            brandName: brandById.get(Number(product.brand_id))?.name || "Poly Fashion",
          }));

        setAllProducts(formatted);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };

    getProducts();
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);

    if (activeCategory === "new-arrival") return diffInDays <= 14;
    if (activeCategory === "flash-sale") return product.oldPrice && product.salePrice > 0;
    return product.featured === "featured";
  });

  const activeLabel = tabs.find((tab) => tab.key === activeCategory)?.label;

  const settings = {
    dots: false,
    infinite: filteredProducts.length > 4,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2600,
    arrows: false,
    responsive: [
      { breakpoint: 1180, settings: { slidesToShow: 3 } },
      { breakpoint: 820, settings: { slidesToShow: 2 } },
      { breakpoint: 560, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Curated rack</p>
          <h3 className="mt-2 text-3xl font-bold leading-[1.2] tracking-normal text-ink sm:text-4xl">
            Bộ sưu tập gợi ý
          </h3>
        </div>
        <div className="flex w-fit rounded-full border border-black/10 bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeCategory === tab.key ? "bg-ink text-white shadow-sm" : "text-neutral-600 hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <Slider {...settings} className="-mx-4">
          {filteredProducts.map((product) => (
            <div className="px-4 pb-8" key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className="group flex min-h-[520px] flex-col overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative overflow-hidden bg-neutral-100">
                  <div className="aspect-[4/3]">
                    <img
                      src={product.img}
                      alt={cleanText(product.name)}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-clay px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm">
                    {activeLabel}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-clay">{product.brandName}</p>
                    {product.oldPrice && (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">Sale</span>
                    )}
                  </div>

                  <h4 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-[1.35] text-ink">
                    {cleanText(product.name)}
                  </h4>

                  <div className="mt-5 flex flex-wrap items-end gap-2">
                    <span className="text-2xl font-bold leading-none text-ink">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="text-sm font-semibold leading-none text-neutral-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  <span className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition group-hover:bg-clay">
                    Xem sản phẩm <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-white p-8 text-center text-neutral-500">
          Chưa có sản phẩm cho mục này.
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
