import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import constant from '../../../../../Constants';
import "./add-product.css";
import HeaderAdmin from "../../layout/header";

const AddProduct = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]); // Thêm state lưu danh mục

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Gọi API để lấy danh mục và lọc danh mục có trạng thái "active"
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${constant.DOMAIN_API}/category/list`);
                console.log("👉 Dữ liệu danh mục trả về:", res.data);

                // Lọc danh mục chỉ lấy danh mục có trạng thái "active"
                const activeCategories = res.data.data.filter(category => category.status === 'active');
                setCategories(activeCategories); // Cập nhật danh sách danh mục active

            } catch (error) {
                console.error("❌ Lỗi khi lấy danh mục:", error);
            }
        };

        fetchCategories();
    }, []);


    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("sale_price", data.sale_price || 0);
            formData.append("stock", data.stock || 0);
            formData.append("category_id", data.category_id); // Danh mục từ người dùng chọn
            formData.append("brand_id", data.brand_id || 1);
            formData.append("target_group_id", data.target_group_id || 1);

            if (image) {
                formData.append("image", image);
            }

            const token = Cookies.get(constant.COOKIE_TOKEN);

            const res = await axios.post(`${constant.DOMAIN_API}/product/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Thêm sản phẩm thành công!");
            navigate("/admin");
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert("Có lỗi xảy ra khi thêm sản phẩm");
        }
    };

    return (
        <>
            <HeaderAdmin />
            <div className="add-product-container">
                <div className="add-product-box">
                    <h2 className="add-product-title">Thêm Sản Phẩm</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="add-product-form">

                        {/* Tên sản phẩm */}
                        <label>Tên sản phẩm</label>
                        <input
                            type="text"
                            {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
                        />
                        {errors.name && <p className="error">{errors.name.message}</p>}

                        {/* Giá */}
                        <label>Giá</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", {
                                required: "Giá là bắt buộc",
                                pattern: {
                                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                    message: "Giá phải là số hợp lệ",
                                },
                            })}
                        />
                        {errors.price && <p className="error">{errors.price.message}</p>}

                        {/* Mô tả */}
                        <label>Mô tả</label>
                        <textarea
                            {...register("description", {
                                required: "Mô tả là bắt buộc",
                            })}
                        />
                        {errors.description && <p className="error">{errors.description.message}</p>}

                        {/* Ảnh */}
                        <label>Ảnh</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                        {/* Chọn danh mục */}
                        <label>Danh mục</label>
                        <select className="form-group" {...register("category_id", { required: "Danh mục là bắt buộc" })}>
                            <option value="">-- Chọn danh mục --</option>
                            {Array.isArray(categories) &&
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                        {errors.category_id && <p className="error">{errors.category_id.message}</p>}

                        {/* Nút thao tác */}
                        <div className="add-product-actions">
                            <button type="submit" className="btn-add-product">Thêm</button>
                            <Link to="/admin" className="btn-cancel-product">Hủy</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddProduct;
