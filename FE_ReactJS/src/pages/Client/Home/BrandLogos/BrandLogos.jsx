import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const brandLogos = [
  { id: 1, img: require("../../../../assets/img/nike.png"), alt: "Nike" },
  { id: 2, img: require("../../../../assets/img/logo-adidas.jpg"), alt: "Adidas" },
  { id: 3, img: require("../../../../assets/img/gucci-logo.jpg"), alt: "Gucci" },
  { id: 4, img: require("../../../../assets/img/Louis-Vuitton-logo.png"), alt: "Louis Vuitton" },
  { id: 5, img: require("../../../../assets/img/chanel-logo.png"), alt: "Chanel" },
  { id: 6, img: require("../../../../assets/img/zara-logo.png"), alt: "Zara" },
];

const BrandLogos = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2600,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
    arrows: false,
  };

  return (
    <section className="py-16">
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-soft md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Brands</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Thương hiệu đối tác</h2>
          </div>
          <p className="text-sm text-neutral-500">Tuyển chọn phong cách từ các thương hiệu quen thuộc.</p>
        </div>
        <Slider {...settings} className="-mx-2">
          {brandLogos.map((brand) => (
            <div key={brand.id} className="px-2">
              <div className="grid h-24 place-items-center rounded-2xl bg-linen p-4">
                <img src={brand.img} alt={brand.alt} className="max-h-12 max-w-[130px] object-contain mix-blend-multiply" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default BrandLogos;
