import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Minus, Plus, RefreshCw, Save, Search } from "lucide-react";
import { toast } from "sonner";
import HeaderAdmin from "../layout/header";
import constant from "../../../Constants";

const inputClass =
  "rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";

const stockStatus = (stock) => {
  const value = Number(stock || 0);
  if (value <= 0) return { label: "Hết hàng", className: "bg-rose-50 text-rose-700" };
  if (value <= 5) return { label: "Sắp hết", className: "bg-amber-50 text-amber-700" };
  return { label: "Ổn định", className: "bg-emerald-50 text-emerald-700" };
};

const Inventory = () => {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [stockDrafts, setStockDrafts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const productById = useMemo(() => new Map(products.map((item) => [Number(item.id), item])), [products]);
  const sizeById = useMemo(() => new Map(sizes.map((item) => [Number(item.id), item])), [sizes]);
  const colorById = useMemo(() => new Map(colors.map((item) => [Number(item.id), item])), [colors]);
  const categoryById = useMemo(() => new Map(categories.map((item) => [Number(item.id), item])), [categories]);
  const brandById = useMemo(() => new Map(brands.map((item) => [Number(item.id), item])), [brands]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [variantRes, productRes, sizeRes, colorRes, categoryRes, brandRes] = await Promise.all([
        axios.get(`${constant.DOMAIN_API}/variant/list`),
        axios.get(`${constant.DOMAIN_API}/product/list`),
        axios.get(`${constant.DOMAIN_API}/size/list`),
        axios.get(`${constant.DOMAIN_API}/color/list`),
        axios.get(`${constant.DOMAIN_API}/category/list`),
        axios.get(`${constant.DOMAIN_API}/brand/list`),
      ]);

      const nextVariants = variantRes.data.data || [];
      setVariants(nextVariants);
      setProducts(productRes.data.data || []);
      setSizes(sizeRes.data.data || []);
      setColors(colorRes.data.data || []);
      setCategories(categoryRes.data.data || []);
      setBrands(brandRes.data.data || []);
      setStockDrafts(Object.fromEntries(nextVariants.map((variant) => [variant.id, Number(variant.stock || 0)])));
    } catch (error) {
      console.error("Lỗi tải tồn kho:", error);
      toast.error("Không thể tải dữ liệu tồn kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const enrichedVariants = useMemo(
    () =>
      variants.map((variant) => {
        const product = productById.get(Number(variant.product_id));
        return {
          ...variant,
          product,
          size: sizeById.get(Number(variant.size_id)),
          color: colorById.get(Number(variant.color_id)),
          category: categoryById.get(Number(product?.category_id)),
          brand: brandById.get(Number(product?.brand_id)),
          stock: Number(stockDrafts[variant.id] ?? variant.stock ?? 0),
        };
      }),
    [variants, productById, sizeById, colorById, categoryById, brandById, stockDrafts]
  );

  const filteredVariants = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return enrichedVariants.filter((variant) => {
      const stock = Number(variant.stock || 0);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "out" && stock <= 0) ||
        (statusFilter === "low" && stock > 0 && stock <= 5) ||
        (statusFilter === "available" && stock > 5);
      const text = [
        variant.id,
        variant.product?.name,
        variant.category?.name,
        variant.brand?.name,
        variant.size?.size_label,
        variant.color?.color_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!keyword || text.includes(keyword));
    });
  }, [enrichedVariants, searchTerm, statusFilter]);

  const summary = useMemo(
    () =>
      enrichedVariants.reduce(
        (current, variant) => {
          const stock = Number(variant.stock || 0);
          current.totalStock += stock;
          current.variantCount += 1;
          if (stock <= 0) current.out += 1;
          else if (stock <= 5) current.low += 1;
          else current.available += 1;
          return current;
        },
        { totalStock: 0, variantCount: 0, out: 0, low: 0, available: 0 }
      ),
    [enrichedVariants]
  );

  const changeDraft = (variantId, value) => {
    setStockDrafts((current) => ({
      ...current,
      [variantId]: Math.max(0, Number(value || 0)),
    }));
  };

  const adjustStock = (variantId, amount) => {
    setStockDrafts((current) => ({
      ...current,
      [variantId]: Math.max(0, Number(current[variantId] || 0) + amount),
    }));
  };

  const saveStock = async (variant) => {
    setSavingId(variant.id);
    try {
      const token = Cookies.get(constant.COOKIE_TOKEN);
      await axios.put(
        `${constant.DOMAIN_API}/variant/${variant.id}`,
        {
          product_id: variant.product_id,
          size_id: variant.size_id,
          color_id: variant.color_id,
          stock: stockDrafts[variant.id] ?? 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVariants((current) =>
        current.map((item) => (item.id === variant.id ? { ...item, stock: stockDrafts[variant.id] ?? 0 } : item))
      );
      toast.success("Cập nhật tồn kho thành công");
    } catch (error) {
      console.error("Lỗi cập nhật tồn kho:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Không thể cập nhật tồn kho");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Inventory</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Quản lý tồn kho</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Theo dõi tồn kho theo từng biến thể sản phẩm, size và màu sắc.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInventory}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Tổng tồn", summary.totalStock, "bg-neutral-950 text-white"],
            ["Biến thể", summary.variantCount, "bg-white text-neutral-950"],
            ["Ổn định", summary.available, "bg-emerald-50 text-emerald-800"],
            ["Sắp hết", summary.low, "bg-amber-50 text-amber-800"],
            ["Hết hàng", summary.out, "bg-rose-50 text-rose-800"],
          ].map(([label, value, className]) => (
            <div key={label} className={`rounded-2xl border border-neutral-200 px-5 py-4 shadow-sm ${className}`}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="mb-5 flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm lg:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={`${inputClass} w-full pl-11`}
              placeholder="Tìm theo sản phẩm, thương hiệu, loại, size, màu..."
            />
          </label>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass}>
            <option value="all">Tất cả tồn kho</option>
            <option value="available">Ổn định</option>
            <option value="low">Sắp hết</option>
            <option value="out">Hết hàng</option>
          </select>
        </section>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-5 py-4 font-bold">Sản phẩm</th>
                  <th className="px-5 py-4 font-bold">Phân loại</th>
                  <th className="px-5 py-4 font-bold">Biến thể</th>
                  <th className="px-5 py-4 font-bold">Trạng thái</th>
                  <th className="px-5 py-4 font-bold">Tồn kho</th>
                  <th className="px-5 py-4 text-right font-bold">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-neutral-500">
                      Đang tải dữ liệu tồn kho...
                    </td>
                  </tr>
                ) : filteredVariants.length > 0 ? (
                  filteredVariants.map((variant) => {
                    const status = stockStatus(variant.stock);
                    const hasChanged = Number(stockDrafts[variant.id] || 0) !== Number(variants.find((item) => item.id === variant.id)?.stock || 0);

                    return (
                      <tr key={variant.id} className="hover:bg-neutral-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={variant.product?.image || "/newlogo.png"}
                              alt={variant.product?.name || "Sản phẩm"}
                              className="h-14 w-14 rounded-2xl object-cover"
                            />
                            <div>
                              <p className="font-black text-neutral-950">{variant.product?.name || `Sản phẩm #${variant.product_id}`}</p>
                              <p className="mt-1 text-xs font-semibold text-neutral-400">Variant #{variant.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge>{variant.category?.name || "Chưa có loại"}</Badge>
                            <Badge>{variant.brand?.name || "Chưa có thương hiệu"}</Badge>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge>Size {variant.size?.size_label || variant.size_id}</Badge>
                            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">
                              <span
                                className="h-4 w-4 rounded-full border border-neutral-300"
                                style={{ backgroundColor: variant.color?.color_code || "#fff" }}
                              />
                              {variant.color?.color_name || `Màu #${variant.color_id}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex w-40 items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                            <button
                              type="button"
                              onClick={() => adjustStock(variant.id, -1)}
                              className="grid h-10 w-10 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                            >
                              <Minus size={15} />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={stockDrafts[variant.id] ?? 0}
                              onChange={(event) => changeDraft(variant.id, event.target.value)}
                              className="h-10 w-16 border-x border-neutral-200 text-center text-sm font-black outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => adjustStock(variant.id, 1)}
                              className="grid h-10 w-10 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={!hasChanged || savingId === variant.id}
                            onClick={() => saveStock(variant)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
                          >
                            <Save size={15} />
                            {savingId === variant.id ? "Đang lưu..." : "Lưu"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-neutral-500">
                      Không có biến thể tồn kho phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const Badge = ({ children }) => (
  <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">{children}</span>
);

export default Inventory;
