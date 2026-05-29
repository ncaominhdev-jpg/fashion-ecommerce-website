import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const articles = [
  { id: 1, title: "5 cách phối đồ với áo blazer để trông sành điệu hơn", image: require("../../../../assets/img/5cachphoido.webp"), link: "#" },
  { id: 2, title: "Mặc gì cho ngày hẹn hò? Gợi ý outfit đẹp mê", image: require("../../../../assets/img/macgichongayhenho.webp"), link: "#" },
  { id: 3, title: "Mix & match: Cách phối đồ với giày sneaker", image: require("../../../../assets/img/cachphoidovoisneaker.webp"), link: "#" },
  { id: 4, title: "Bí quyết chọn màu sắc trang phục hợp tone da", image: require("../../../../assets/img/mausactrangphucphuhopvoimauda.webp"), link: "#" },
  { id: 5, title: "Xu hướng thời trang 2026 và những item nên có", image: require("../../../../assets/img/xuhuong2025.webp"), link: "#" },
];

const FashionTipsSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 550,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3200,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Styling guide</p>
        <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">Mẹo phối đồ</h2>
      </div>
      <Slider {...settings} className="-mx-3">
        {articles.map((article) => (
          <div key={article.id} className="px-3 pb-8">
            <Link to={article.link} className="group grid overflow-hidden rounded-[1.75rem] bg-white shadow-soft md:grid-cols-[220px_1fr]">
              <img src={article.image} alt={article.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 md:h-full" />
              <div className="flex flex-col justify-center p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">Guide</p>
                <h4 className="mt-3 text-xl font-extrabold leading-snug text-ink">{article.title}</h4>
                <span className="mt-5 text-sm font-bold text-clay">Đọc bài viết</span>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default FashionTipsSlider;
