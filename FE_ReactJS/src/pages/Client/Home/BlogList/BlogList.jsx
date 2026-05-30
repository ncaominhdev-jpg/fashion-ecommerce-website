import { Link } from "react-router-dom";

const blogPosts = [
  { id: 1, title: "Cách phối đồ theo dáng người", desc: "Mẹo chọn trang phục giúp tôn dáng và che khuyết điểm hiệu quả.", img: require("../../../../assets/img/pf-blog-body-shape.jpg") },
  { id: 2, title: "Màu sắc hợp mệnh 2026", desc: "Chọn trang phục theo phong cách cá nhân và năng lượng màu sắc.", img: require("../../../../assets/img/pf-blog-color-destiny.jpg") },
  { id: 3, title: "5 xu hướng thời trang nổi bật", desc: "Những phong cách đang lên ngôi và dễ ứng dụng trong đời sống.", img: require("../../../../assets/img/pf-blog-trends.jpg") },
];

const BlogList = () => {
  return (
    <section className="py-16">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Journal</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Tin tức & Blog</h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.id} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={post.img} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-bold text-ink">{post.title}</h3>
              <p className="mt-3 min-h-[4.5rem] text-sm leading-7 text-neutral-600">{post.desc}</p>
              <Link to={`/blog/${post.id}`} className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-clay">
                Xem thêm
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogList;
