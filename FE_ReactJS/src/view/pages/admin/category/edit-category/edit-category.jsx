import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import HeaderAdmin from "../../layout/header";
import "./edit-category.css";
import constant from "../../../../../Constants.jsx";

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // 🟢 Fetch dữ liệu category khi mở trang
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const token = Cookies.get(constant.COOKIE_TOKEN);
                const res = await axios.get(`${constant.DOMAIN_API}/category/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                reset(res.data.data); // ⚡ Đổ dữ liệu vào form
            } catch (error) {
                console.error("Lỗi lấy thông tin danh mục:", error);
                alert("Không thể tải danh mục");
            }
        };

        fetchCategory();
    }, [id, reset]);

    // 🟡 Gửi cập nhật danh mục
    const onSubmit = async (data) => {
        try {
            const token = Cookies.get(constant.COOKIE_TOKEN);
            await axios.put(`${constant.DOMAIN_API}/category/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Cập nhật danh mục thành công!");
            navigate("/admin/categories");
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục:", error);
            alert("Có lỗi xảy ra khi cập nhật danh mục");
        }
    };

    return (
        <>
            <HeaderAdmin />
            <div className="edit-category-container">
                <div className="content">
                    <div className="edit-category-card">
                        <h2>Chỉnh Sửa Loại Sản Phẩm</h2>
                        <form className="category-input-form" onSubmit={handleSubmit(onSubmit)}>
                            {/* Tên loại */}
                            <div className="form-group">
                                <label htmlFor="name">Tên Loại</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", {
                                        required: "Tên loại là bắt buộc",
                                    })}
                                />
                                {errors.name && <p className="error">{errors.name.message}</p>}
                            </div>

 

                            {/* Trạng thái */}
                            <div className="form-group">
                                <label>Trạng Thái</label>
                                <select
                                    {...register("status", {
                                        required: "Trạng thái là bắt buộc",
                                    })}
                                >
                                    <option value="">-- Chọn trạng thái --</option>
                                    <option value="active">Đang kinh doanh</option>
                                    <option value="inactive">Ngừng kinh doanh</option>
                                </select>
                                {errors.status && <p className="error">{errors.status.message}</p>}
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="save-btn">Lưu</button>
                                <Link to="/admin/categories" className="cancel-btn">Hủy</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditCategory;
