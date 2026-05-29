import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import Constants from "../../../../Constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${Constants.DOMAIN_API}/product/list`);
        setProducts((res.data.data || []).filter((product) => product.featured === "featured"));
      } catch (e) {
        console.error("Lỗi tải sản phẩm nổi bật:", e);
      }
    };

    getFeaturedProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: products.length > 4,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2600,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1180, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 560, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Editor pick</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Sản phẩm nổi bật</h2>
        </div>
        <Link to="/shop" className="font-bold text-clay hover:text-ink">Xem tất cả</Link>
      </div>

      {products.length > 0 ? (
        <Slider {...settings} className="-mx-3">
          {products.map((product) => {
            const hasSale = parseFloat(product.sale_price) > 0;
            const price = hasSale ? product.sale_price : product.price;

            return (
              <div key={product.id} className="px-3 pb-8">
                <Link to={`/product/${product.id}`} className="group block overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    {hasSale && <span className="absolute left-4 top-4 rounded-full bg-clay px-3 py-1 text-xs font-bold text-white">Sale</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold text-ink">{product.name}</h3>
                    <p className="mt-3 text-lg font-extrabold text-ink">
                      {parseInt(price).toLocaleString()}đ
                      {hasSale && <span className="ml-2 text-sm font-semibold text-neutral-400">{parseInt(product.price).toLocaleString()}đ</span>}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-white p-8 text-center text-neutral-500">
          Chưa có sản phẩm nổi bật.
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
