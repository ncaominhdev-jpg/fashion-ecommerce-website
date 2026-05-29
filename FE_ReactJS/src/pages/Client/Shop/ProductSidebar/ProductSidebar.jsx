import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Constants from "../../../../Constants";

const cleanText = (value) => String(value || "");

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const ProductSidebar = () => {
  const query = useQuery();
  const initialTarget = parseInt(query.get("target"));

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [targetGroups, setTargetGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTargetGroup, setSelectedTargetGroup] = useState(initialTarget || null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const getProducts = useCallback(async () => {
    try {
      const res = await axios.get(Constants.DOMAIN_API + "/product/list");
      let data = (res.data.data || []).filter((product) => product.visibility !== "hidden");

      if (selectedCategory) {
        data = data.filter((product) => product.category_id === selectedCategory);
      }

      if (selectedTargetGroup) {
        data = data.filter((product) => product.target_group_id === selectedTargetGroup);
      }

      setProducts(data);
      setCurrentPage(1);
    } catch (e) {
      console.error("Lỗi lấy sản phẩm:", e);
    }
  }, [selectedCategory, selectedTargetGroup]);

  useEffect(() => {
    axios.get(Constants.DOMAIN_API + "/category/list")
      .then((res) => setCategories(res.data.data || []))
      .catch((e) => console.error("Lỗi lấy danh mục:", e));

    axios.get(Constants.DOMAIN_API + "/target-group/list")
      .then((res) => setTargetGroups(res.data.data || []))
      .catch((e) => console.error("Lỗi lấy nhóm thời trang:", e));
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedTargetGroup(null);
  };

  return (
    <section className="py-16">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Catalog</p>
          <h2 className="mt-2 text-3xl font-bold leading-[1.2] tracking-normal text-ink sm:text-4xl md:text-5xl md:leading-[1.18]">
            Danh sách sản phẩm
          </h2>
        </div>
        <p className="text-sm font-semibold text-neutral-500">{products.length} sản phẩm phù hợp</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-black/10 bg-white p-5 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold leading-[1.25] text-ink">Bộ lọc</h3>
            <button onClick={resetFilters} className="text-xs font-bold text-clay hover:text-ink">
              Xóa lọc
            </button>
          </div>

          <div className="space-y-7">
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Thời trang</h4>
              <div className="space-y-2">
                {targetGroups.map((group) => (
                  <label key={group.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-linen">
                    <input
                      type="radio"
                      name="target"
                      value={group.id}
                      checked={selectedTargetGroup === group.id}
                      onChange={() => setSelectedTargetGroup(group.id)}
                      className="h-4 w-4 accent-clay"
                    />
                    <span className="text-sm font-semibold text-neutral-700">{cleanText(group.label)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Loại sản phẩm</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-linen">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                      className="h-4 w-4 accent-clay"
                    />
                    <span className="text-sm font-semibold text-neutral-700">{cleanText(cat.name)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main>
          {currentProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {currentProducts.map((product) => {
                const hasSale = parseFloat(product.sale_price) > 0;
                const price = hasSale ? product.sale_price : product.price;
                const oldPrice = parseFloat(product.price);

                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group flex min-h-[390px] flex-col overflow-hidden rounded-[1.35rem] border border-black/5 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-100">
                      <img
                        src={product.image}
                        alt={cleanText(product.name)}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                      {hasSale && (
                        <span className="absolute left-3 top-3 rounded-full bg-clay px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
                          Sale
                        </span>
                      )}
                      <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-ink opacity-0 shadow-sm transition group-hover:opacity-100">
                        Xem nhanh
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-clay">Poly Fashion</p>
                      <h4 className="line-clamp-2 min-h-[3.25rem] text-[17px] font-extrabold leading-snug text-ink">
                        {cleanText(product.name)}
                      </h4>
                      <div className="mt-4 flex flex-wrap items-baseline gap-2">
                        <span className="text-xl font-black text-ink">{parseInt(price).toLocaleString("vi-VN")}đ</span>
                        {hasSale && <span className="text-sm font-bold text-neutral-400">{oldPrice.toLocaleString("vi-VN")}đ</span>}
                      </div>
                      <span className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-extrabold text-white transition group-hover:bg-clay">
                        Mua ngay
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-white p-10 text-center text-neutral-500">
              Không có sản phẩm phù hợp.
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`grid h-10 w-10 place-items-center rounded-full font-bold transition ${currentPage === i + 1 ? "bg-ink text-white" : "bg-white text-ink hover:bg-linen"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default ProductSidebar;
