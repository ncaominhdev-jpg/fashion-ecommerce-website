import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const deals = [
  { id: 1, title: "Giảm 20% cho đơn hàng đầu tiên", desc: "Nhập mã FIRST20 để được giảm ngay 20% khi đặt hàng lần đầu.", img: require("../../../../assets/img/pf-deal-first20.jpg") },
  { id: 2, title: "Flash sale cuối tuần", desc: "Giảm đến 50% cho các sản phẩm hot nhất từ thứ 6 đến chủ nhật.", img: require("../../../../assets/img/pf-deal-flashsale.jpg") },
  { id: 3, title: "Mua 2 tặng 1", desc: "Mua bất kỳ 2 sản phẩm, nhận thêm 1 sản phẩm cùng loại.", img: require("../../../../assets/img/pf-deal-buy2get1.jpg") },
  { id: 4, title: "Freeship từ 500K", desc: "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ.", img: require("../../../../assets/img/pf-deal-freeship.jpg") },
];

const DealsSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 550,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <section className="py-16">
      <div className="overflow-hidden rounded-[2rem] bg-cocoa text-white shadow-lift">
        <Slider {...settings}>
          {deals.map((deal) => (
            <div key={deal.id}>
              <div className="grid min-h-[360px] md:grid-cols-2">
                <img src={deal.img} alt={deal.title} className="h-full min-h-[260px] w-full object-cover" />
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-champagne">Ưu đãi</p>
                  <h2 className="mt-3 text-4xl font-extrabold tracking-tight">{deal.title}</h2>
                  <p className="mt-4 max-w-xl text-white/75">{deal.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default DealsSlider;
