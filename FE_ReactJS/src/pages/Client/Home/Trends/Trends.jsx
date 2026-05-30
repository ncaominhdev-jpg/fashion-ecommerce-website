import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const trends = [
  { id: 1, title: "Minimalist Chic", desc: "Phong cách tối giản với gam màu trung tính, thiết kế sang trọng.", img: require("../../../../assets/img/pf-trend-minimalist.jpg") },
  { id: 2, title: "Y2K Revival", desc: "Tinh thần 2000s với croptop, denim và phụ kiện cá tính.", img: require("../../../../assets/img/pf-trend-y2k.jpg") },
  { id: 3, title: "Athleisure", desc: "Thể thao pha thời thượng, thoải mái mà vẫn sắc nét.", img: require("../../../../assets/img/pf-trend-athleisure.jpg") },
  { id: 4, title: "Bohemian Spirit", desc: "Họa tiết, maxi bay bổng và tinh thần tự do.", img: require("../../../../assets/img/pf-trend-bohemian.jpg") },
  { id: 5, title: "Futuristic Techwear", desc: "Chất liệu kỹ thuật, phom mạnh và chi tiết phản quang.", img: require("../../../../assets/img/pf-trend-techwear.jpg") },
  { id: 6, title: "Streetwear Oversized", desc: "Hoodie, cargo, sneaker và layer phóng khoáng.", img: require("../../../../assets/img/pf-trend-streetwear.jpg") },
];

const Trends = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 550,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
    arrows: false,
  };

  return (
    <section className="py-16">
      <div className="mb-9">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Trend report</p>
        <h2 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Xu hướng thời trang</h2>
      </div>
      <Slider {...settings} className="-mx-3">
        {trends.map((trend) => (
          <div key={trend.id} className="px-3 pb-8">
            <article className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={trend.img} alt={trend.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-bold text-ink">{trend.title}</h3>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-7 text-neutral-600">{trend.desc}</p>
                <Link to="/shop" className="mt-5 inline-flex rounded-full bg-linen px-4 py-2 text-sm font-bold text-clay hover:bg-clay hover:text-white">
                  Khám phá
                </Link>
              </div>
            </article>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Trends;
