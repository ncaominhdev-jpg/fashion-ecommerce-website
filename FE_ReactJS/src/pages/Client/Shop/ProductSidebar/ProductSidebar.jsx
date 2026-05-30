import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Constants from "../../../../Constants";

const cleanText = (value) => String(value || "");
const formatPrice = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const ProductSidebar = () => {
  const query = useQuery();
  const initialTarget = Number.parseInt(query.get("target"), 10);

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [targetGroups, setTargetGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedTargetGroup, setSelectedTargetGroup] = useState(Number.isNaN(initialTarget) ? null : initialTarget);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [productRes, categoryRes, targetRes, brandRes] = await Promise.all([
          axios.get(`${Constants.DOMAIN_API}/product/list`),
          axios.get(`${Constants.DOMAIN_API}/category/list`),
          axios.get(`${Constants.DOMAIN_API}/target-group/list`),
          axios.get(`${Constants.DOMAIN_API}/brand/list`),
        ]);

        const activeCategories = (categoryRes.data.data || []).filter((category) => category.status === "active");

        setAllProducts(productRes.data.data || []);
        setCategories(activeCategories);
        setTargetGroups(targetRes.data.data || []);
        setBrands((brandRes.data.data || []).filter((brand) => brand.status !== "inactive"));
      } catch (error) {
        console.error("Lỗi lấy dữ liệu shop:", error);
      }
    };

    fetchShopData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, selectedTargetGroup]);

  const activeCategoryIds = useMemo(() => new Set(categories.map((category) => Number(category.id))), [categories]);
  const brandById = useMemo(() => new Map(brands.map((brand) => [Number(brand.id), brand])), [brands]);

  const products = useMemo(() => {
    return allProducts.filter((product) => {
      const isVisible = product.visibility !== "hidden";
      const isActiveCategory = activeCategoryIds.has(Number(product.category_id));
      const matchesCategory = !selectedCategory || Number(product.category_id) === Number(selectedCategory);
      const matchesBrand = !selectedBrand || Number(product.brand_id) === Number(selectedBrand);
      const isActiveBrand = !product.brand_id || brandById.has(Number(product.brand_id));
      const matchesTarget = !selectedTargetGroup || Number(product.target_group_id) === Number(selectedTargetGroup);

      return isVisible && isActiveCategory && isActiveBrand && matchesCategory && matchesBrand && matchesTarget;
    });
  }, [allProducts, activeCategoryIds, brandById, selectedCategory, selectedBrand, selectedTargetGroup]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
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

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-black/10 bg-white p-5 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold leading-[1.25] text-ink">Bộ lọc</h3>
            <button type="button" onClick={resetFilters} className="text-xs font-bold text-clay hover:text-ink">
              Xóa lọc
            </button>
          </div>

          <div className="space-y-7">
            <FilterGroup title="Thời trang">
              <RadioItem name="target" checked={!selectedTargetGroup} onChange={() => setSelectedTargetGroup(null)} label="Tất cả" />
              {targetGroups.map((group) => (
                <RadioItem
                  key={group.id}
                  name="target"
                  checked={Number(selectedTargetGroup) === Number(group.id)}
                  onChange={() => setSelectedTargetGroup(group.id)}
                  label={cleanText(group.label)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Thương hiệu">
              <RadioItem name="brand" checked={!selectedBrand} onChange={() => setSelectedBrand(null)} label="Tất cả thương hiệu" />
              {brands.map((brand) => (
                <RadioItem
                  key={brand.id}
                  name="brand"
                  checked={Number(selectedBrand) === Number(brand.id)}
                  onChange={() => setSelectedBrand(brand.id)}
                  label={cleanText(brand.name)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Loại sản phẩm">
              <RadioItem name="category" checked={!selectedCategory} onChange={() => setSelectedCategory(null)} label="Tất cả loại" />
              {categories.map((category) => (
                <RadioItem
                  key={category.id}
                  name="category"
                  checked={Number(selectedCategory) === Number(category.id)}
                  onChange={() => setSelectedCategory(category.id)}
                  label={cleanText(category.name)}
                />
              ))}
            </FilterGroup>
          </div>
        </aside>

        <main>
          {currentProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {currentProducts.map((product) => {
                const hasSale = Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price);
                const price = hasSale ? product.sale_price : product.price;
                const brand = brandById.get(Number(product.brand_id));

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
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-clay">
                        {brand?.name || "Poly Fashion"}
                      </p>
                      <h4 className="line-clamp-2 min-h-[3.25rem] text-[17px] font-extrabold leading-snug text-ink">
                        {cleanText(product.name)}
                      </h4>
                      <div className="mt-4 flex flex-wrap items-baseline gap-2">
                        <span className="text-xl font-black text-ink">{formatPrice(price)}</span>
                        {hasSale && <span className="text-sm font-bold text-neutral-400 line-through">{formatPrice(product.price)}</span>}
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
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`grid h-10 w-10 place-items-center rounded-full font-bold transition ${
                    currentPage === i + 1 ? "bg-ink text-white" : "bg-white text-ink hover:bg-linen"
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

const FilterGroup = ({ title, children }) => (
  <div>
    <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{title}</h4>
    <div className="max-h-56 space-y-2 overflow-y-auto pr-1">{children}</div>
  </div>
);

const RadioItem = ({ name, checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-linen">
    <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-clay" />
    <span className="text-sm font-semibold text-neutral-700">{label}</span>
  </label>
);

export default ProductSidebar;
