import { Link } from "react-router-dom";
import Slider from "react-slick";
import { ArrowRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banners = [
  { id: 1, title: "Bộ sưu tập 2026", desc: "Những thiết kế tinh gọn, sang và dễ phối cho tủ đồ mỗi ngày.", img: require("../../../../assets/img/xuhuong.webp") },
  { id: 2, title: "Summer Resort", desc: "Chất liệu nhẹ, form thoáng và bảng màu sáng cho mùa hè.", img: require("../../../../assets/img/muahe.webp") },
  { id: 3, title: "Office Edit", desc: "Trang phục công sở thanh lịch, vừa chuyên nghiệp vừa thời trang.", img: require("../../../../assets/img/congso.webp") },
  { id: 4, title: "Streetwear Select", desc: "Oversized, denim, sneaker và những outfit đậm cá tính.", img: require("../../../../assets/img/catinh.webp") },
];

const BannerSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 650,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <section className="bg-linen">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <div className="relative min-h-[560px] overflow-hidden lg:min-h-[660px]">
              <img src={banner.img} alt={banner.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
              <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 pb-20 pt-16 sm:px-6 lg:min-h-[660px] lg:px-8">
                <div className="max-w-2xl text-white">
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.32em] text-champagne">Poly Fashion Studio</p>
                  <h1 className="font-display text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">{banner.title}</h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">{banner.desc}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-ink shadow-lift transition hover:-translate-y-0.5">
                      Mua ngay <ArrowRight size={18} />
                    </Link>
                    <Link to="/shop" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/10">
                      Xem lookbook
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default BannerSlider;
