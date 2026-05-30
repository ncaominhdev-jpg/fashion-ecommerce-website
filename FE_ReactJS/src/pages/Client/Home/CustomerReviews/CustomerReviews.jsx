import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
  { id: 1, name: "Nguyễn Văn A", rating: 5, review: "Sản phẩm chất lượng, giao hàng nhanh. Mình rất hài lòng!", img: require("../../../../assets/img/pf-review-avatar.jpg") },
  { id: 2, name: "Trần Thị B", rating: 4, review: "Màu sắc đẹp, đúng mô tả. Mình sẽ ủng hộ lần sau!", img: require("../../../../assets/img/pf-review-avatar.jpg") },
  { id: 3, name: "Lê Hoàng C", rating: 5, review: "Mua lần thứ 2 rồi, rất đáng tiền. Chất vải đẹp.", img: require("../../../../assets/img/pf-review-avatar.jpg") },
  { id: 4, name: "Phạm Minh D", rating: 4, review: "Tư vấn nhiệt tình, sản phẩm đúng hình. Giao nhanh!", img: require("../../../../assets/img/pf-review-avatar.jpg") },
];

const CustomerReviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16">
      <div className="mb-9 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Review</p>
        <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">Khách hàng nói gì</h2>
      </div>
      <Slider {...settings} className="-mx-3">
        {reviews.map((review) => (
          <div key={review.id} className="px-3 pb-8">
            <article className="rounded-[1.75rem] bg-white p-7 shadow-soft">
              <div className="flex items-center gap-4">
                <img src={review.img} alt={review.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-ink">{review.name}</h3>
                  <div className="text-champagne">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                </div>
              </div>
              <p className="mt-5 leading-7 text-neutral-600">"{review.review}"</p>
            </article>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CustomerReviews;
