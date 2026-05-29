import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../../../../Constants";
import menImage from "../../../../assets/img/nam.webp";
import womenImage from "../../../../assets/img/nu.webp";
import kidsImage from "../../../../assets/img/tre em.webp";

const imageMap = {
  1: menImage,
  2: womenImage,
  3: kidsImage,
};

function CategorySection() {
  const [targetGroups, setTargetGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(Constants.DOMAIN_API + "/target-group/list")
      .then((res) => setTargetGroups(res.data.data || []))
      .catch((err) => console.error("Lỗi lấy nhóm thời trang:", err));
  }, []);

  return (
    <section className="py-20">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Shop by style</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Danh mục thời trang</h2>
        </div>
        <p className="max-w-md text-neutral-600">Chọn nhanh theo phong cách và nhu cầu mặc để tìm đúng outfit phù hợp.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {targetGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => navigate("/shop?target=" + group.id)}
            className="group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-ink text-left shadow-soft"
          >
            <img src={imageMap[group.id]} alt={group.label} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-7 text-white">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-champagne">Collection</p>
              <h3 className="font-display text-4xl font-bold">{group.label}</h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
