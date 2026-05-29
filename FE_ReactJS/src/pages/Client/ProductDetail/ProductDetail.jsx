import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "sonner";
import Constants from "../../../Constants";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [sizeError, setSizeError] = useState("");
  const [colorError, setColorError] = useState("");

  const fetchProductDetailData = useCallback(() => {
    axios
      .get(`${Constants.DOMAIN_API}/product/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, [id]);

  const fetchVariantData = useCallback(() => {
    axios
      .get(`${Constants.DOMAIN_API}/variant/${id}`)
      .then((res) => setVariants(Array.isArray(res.data.data) ? res.data.data : []))
      .catch((err) => console.error("Lỗi tải biến thể:", err));
  }, [id]);

  useEffect(() => {
    fetchProductDetailData();
    fetchVariantData();
  }, [fetchProductDetailData, fetchVariantData]);

  useEffect(() => {
    const matched = variants.find(
      (variant) => variant.size?.size_label === selectedSize && variant.color?.color_code === selectedColor
    );
    setSelectedVariant(matched || null);
  }, [selectedSize, selectedColor, variants]);

  const validateSelection = () => {
    let hasError = false;

    if (!selectedSize) {
      setSizeError("Vui lòng chọn kích thước");
      hasError = true;
    } else {
      setSizeError("");
    }

    if (!selectedColor) {
      setColorError("Vui lòng chọn màu sắc");
      hasError = true;
    } else {
      setColorError("");
    }

    if (selectedSize && selectedColor && !selectedVariant) {
      toast.warning("Biến thể này hiện chưa có sẵn.");
      hasError = true;
    }

    return !hasError;
  };

  const ensureLogin = (message) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || !cookies.token) {
      toast.warning(message);
      navigate("/login");
      return null;
    }

    const user = JSON.parse(storedUser);
    if (!user?.id) {
      toast.error("Không thể xác định người dùng.");
      return null;
    }

    return user;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    const user = ensureLogin("Bạn cần đăng nhập để thêm vào giỏ hàng.");
    if (!user || !selectedVariant) return;

    axios
      .post(
        `${Constants.DOMAIN_API}/cart/add`,
        {
          user_id: user.id,
          variant_id: selectedVariant.id,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      )
      .then(() => toast.success("Đã thêm vào giỏ hàng!"))
      .catch((err) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", err.response?.data || err);
        toast.error(err.response?.data?.message || err.response?.data?.error || "Không thể thêm vào giỏ hàng.");
      });
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    if (!ensureLogin("Bạn cần đăng nhập để mua hàng.") || !selectedVariant) return;
    navigate(`/payment?variant_id=${selectedVariant.id}&quantity=${quantity}`);
  };

  const availableSizes = [
    ...new Set(
      variants
        .filter((variant) => !selectedColor || variant.color?.color_code === selectedColor)
        .map((variant) => variant.size?.size_label)
        .filter(Boolean)
    ),
  ];

  const availableColors = [
    ...new Map(
      variants
        .filter((variant) => !selectedSize || variant.size?.size_label === selectedSize)
        .map((variant) => [
          variant.color?.color_code,
          {
            code: variant.color?.color_code,
            name: variant.color?.color_name || variant.color?.color_code,
          },
        ])
    ).values(),
  ].filter((color) => color.code);

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">Đang tải sản phẩm...</div>
      </main>
    );
  }

  const price = parseFloat(product.price) || 0;
  const salePrice = parseFloat(product.sale_price);
  const showSale = !Number.isNaN(salePrice) && salePrice > 0 && salePrice < price;
  const noVariants = variants.length === 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-lift">
          <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
        </div>

        <section className="rounded-[2rem] bg-white p-7 shadow-soft md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Product detail</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {showSale ? (
              <>
                <span className="text-3xl font-extrabold text-clay">{salePrice.toLocaleString("vi-VN")}đ</span>
                <span className="text-lg font-semibold text-neutral-400">{price.toLocaleString("vi-VN")}đ</span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-ink">{price.toLocaleString("vi-VN")}đ</span>
            )}
          </div>

          <p className="mt-5 leading-8 text-neutral-600">{product.description}</p>

          {!noVariants ? (
            <div className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-ink">Chọn kích thước</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const active = selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          className={`min-w-14 rounded-full border px-4 py-2 text-sm font-bold transition ${
                            active
                              ? "border-ink bg-ink text-white shadow-soft"
                              : "border-black/10 bg-linen text-ink hover:border-clay hover:text-clay"
                          }`}
                          onClick={() => {
                            setSelectedSize(size);
                            setSizeError("");
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {sizeError && <p className="mt-2 text-sm font-semibold text-red-600">{sizeError}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-ink">Chọn màu sắc</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const active = selectedColor === color.code;

                      return (
                        <button
                          key={color.code}
                          type="button"
                          className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                            active
                              ? "border-ink bg-ink text-white shadow-soft"
                              : "border-black/10 bg-linen text-ink hover:border-clay hover:text-clay"
                          }`}
                          onClick={() => {
                            setSelectedColor(color.code);
                            setColorError("");
                          }}
                        >
                          {color.name}
                        </button>
                      );
                    })}
                  </div>
                  {colorError && <p className="mt-2 text-sm font-semibold text-red-600">{colorError}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-ink">Số lượng</label>
                <div className="inline-flex items-center rounded-full border border-black/10 bg-linen p-1">
                  <button
                    className="grid h-10 w-10 place-items-center rounded-full bg-white font-bold"
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  >
                    -
                  </button>
                  <input className="h-10 w-16 bg-transparent text-center font-bold outline-none" type="number" value={quantity} readOnly />
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-white font-bold" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full border border-black/10 px-6 py-3 font-bold text-ink transition hover:bg-linen" onClick={handleAddToCart}>
                  Thêm vào giỏ hàng
                </button>
                <button className="rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-clay" onClick={handleBuyNow}>
                  Mua ngay
                </button>
              </div>

              {selectedVariant && (
                <p className="rounded-2xl bg-linen px-4 py-3 font-semibold text-neutral-700">
                  Còn lại: {selectedVariant.stock} sản phẩm
                </p>
              )}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-600">Sản phẩm này chưa mở bán.</div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
