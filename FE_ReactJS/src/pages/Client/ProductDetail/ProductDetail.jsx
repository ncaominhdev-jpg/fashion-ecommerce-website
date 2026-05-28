import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Constants from "../../../Constants";
import "./ProductDetail.css";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [sizeError, setSizeError] = useState("");
    const [colorError, setColorError] = useState("");

    useEffect(() => {
        fetchProductDetailData();
        fetchVariantData();
    }, [id]);

    useEffect(() => {
        const matched = variants.find(v =>
            v.size?.size_label === selectedSize && v.color?.color_code === selectedColor
        );
        setSelectedVariant(matched || null);
    }, [selectedSize, selectedColor, variants]);

    function fetchProductDetailData() {
        axios.get(`${Constants.DOMAIN_API}/product/${id}`)
            .then(res => {
                setProduct(res.data.data);
            })
            .catch(err => {
                console.error("Lỗi tải sản phẩm:", err);
            });
    }

    function fetchVariantData() {
        axios.get(`${Constants.DOMAIN_API}/variant/${id}`)
            .then(res => {
                const list = Array.isArray(res.data.data) ? res.data.data : [];
                setVariants(list);

                const allSizes = [...new Set(list.map(v => v.size?.size_label))];
                const allColors = [...new Map(
                    list.map(v => [v.color?.color_code, {
                        code: v.color?.color_code,
                        name: v.color?.color_name
                    }])
                ).values()];

                setSizes(allSizes);
                setColors(allColors);
            })
            .catch(err => {
                console.error("Lỗi tải biến thể:", err);
            });
    }

    function handleAddToCart() {
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

        if (hasError) return;

        const storedUser = localStorage.getItem("user");
        if (!storedUser || !cookies.token) {
            alert("Bạn cần đăng nhập để thêm vào giỏ hàng.");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);
        if (!user?.id) {
            alert("Không thể xác định người dùng.");
            return;
        }

        axios.post(`${Constants.DOMAIN_API}/cart/add`, {
            variant_id: selectedVariant.id,
            quantity
        }, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        })
            .then(() => {
                alert("✅ Đã thêm vào giỏ hàng!");
            })
            .catch(err => {
                console.error("Lỗi khi thêm vào giỏ hàng:", err);
                alert(err.response?.data?.message || "Không thể thêm vào giỏ hàng.");
            });
    }

    function handleBuyNow() {
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

        if (hasError) return;

        const storedUser = localStorage.getItem("user");
        if (!storedUser || !cookies.token) {
            alert("Bạn cần đăng nhập để mua hàng.");
            navigate("/login");
            return;
        }

        navigate(`/payment?variant_id=${selectedVariant.id}&quantity=${quantity}`);
    }

    function renderSizeOptions() {
        const availableSizes = [...new Set(variants
            .filter(v => !selectedColor || v.color?.color_code === selectedColor)
            .map(v => v.size?.size_label)
        )];

        return availableSizes.map(size => (
            <option key={size} value={size}>{size}</option>
        ));
    }

    function renderColorOptions() {
        const availableColors = [...new Map(variants
            .filter(v => !selectedSize || v.size?.size_label === selectedSize)
            .map(v => [v.color?.color_code, {
                code: v.color?.color_code,
                name: v.color?.color_name
            }])
        ).values()];

        return availableColors.map(color => (
            <option key={color.code} value={color.code} style={{ backgroundColor: color.code }}>
                {color.name}
            </option>
        ));
    }

    function renderMainContent() {
        if (!product) return <p>Đang tải sản phẩm...</p>;

        const price = parseFloat(product.price) || 0;
        const salePrice = parseFloat(product.sale_price);
        const showSale = !isNaN(salePrice) && salePrice > 0 && salePrice < price;
        const noVariants = variants.length === 0;

        return (
            <main className="product-detail-container">
                <div className="product-detail-info">
                    <div className="product-detail-image">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-detail-details">
                        <h2 className="product-detail-name">{product.name}</h2>
                        <p className="product-detail-price">
                            {showSale ? (
                                <>
                                    Giá gốc: <span className="product-detail-original-price">{price.toLocaleString()}đ</span>
                                    <span className="product-detail-sale-text"> Giảm còn </span>
                                    <span className="product-detail-discounted-price">{salePrice.toLocaleString()}đ</span>
                                </>
                            ) : (
                                <span className="product-detail-discounted-price">Giá: {price.toLocaleString()}đ</span>
                            )}
                        </p>
                        <p className="product-detail-description">{product.description}</p>

                        {!noVariants ? (
                            <>
                                <div className="product-detail-options-row">
                                    <div className="product-detail-select">
                                        <label>Chọn kích thước:</label>
                                        <select
                                            className="form-control"
                                            value={selectedSize}
                                            onChange={e => {
                                                setSelectedSize(e.target.value);
                                                setSizeError("");
                                            }}
                                        >
                                            <option value="">-- Chọn kích thước --</option>
                                            {renderSizeOptions()}
                                        </select>
                                        {sizeError && <p className="text-danger mt-1">{sizeError}</p>}
                                    </div>
                                    <div className="product-detail-select">
                                        <label>Chọn màu sắc:</label>
                                        <select
                                            className="form-control"
                                            value={selectedColor}
                                            onChange={e => {
                                                setSelectedColor(e.target.value);
                                                setColorError("");
                                            }}
                                        >
                                            <option value="">-- Chọn màu sắc --</option>
                                            {renderColorOptions()}
                                        </select>
                                        {colorError && <p className="text-danger mt-1">{colorError}</p>}
                                    </div>
                                </div>

                                <label>Số lượng:</label>
                                <div className="product-detail-quantity-selector">
                                    <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
                                    <input className="form-control" type="number" value={quantity} readOnly />
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>

                                <div className="product-detail-action-buttons">
                                    <button className="product-detail-btn-add-to-cart" onClick={handleAddToCart}>
                                        Thêm vào giỏ hàng
                                    </button>
                                    <button className="product-detail-btn-buy-now" onClick={handleBuyNow}>
                                        Mua ngay
                                    </button>
                                </div>

                                {selectedVariant && (
                                    <p className="product-detail-stock-info">
                                        Còn lại: {selectedVariant.stock} sản phẩm
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="product-detail-no-variant">
                                <p className="text-danger fw-bold">Sản phẩm này chưa mở bán.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    return renderMainContent();
};

export default ProductDetail;
