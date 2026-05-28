import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import HeaderAdmin from "../../layout/header";
import "./add-category.css";
import constant from '../../../../../Constants.jsx';




const AddCategory = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const token = Cookies.get(constant.COOKIE_TOKEN); // Lấy token từ cookie
            const response = await axios.post(
                `${constant.DOMAIN_API}/category/add`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Thêm danh mục thành công!");
            navigate("/admin/categories"); // Điều hướng về trang danh sách danh mục
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);
            alert("Có lỗi xảy ra khi thêm danh mục");
        }
    };

    return (
        <>
            <HeaderAdmin />
            <div className="category-wrapper">
                <div className="category-content">
                    <div className="category-box">
                        <div className="category-title">
                            <h2>Thêm Loại Sản Phẩm</h2>
                        </div>
                        <form className="category-input-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-group">
                                <label htmlFor="name">Tên loại</label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { required: "Tên loại là bắt buộc" })}
                                />
                                {errors.name && <p className="error">{errors.name.message}</p>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="status">Trạng thái</label>
                                <select
                                    id="status"
                                    {...register("status", { required: "Vui lòng chọn trạng thái" })}
                                >
                                    <option value="">-- Chọn trạng thái --</option>
                                    <option value="active">Đang kinh doanh</option>
                                    <option value="inactive">Ngừng kinh doanh</option> {/* Thêm lựa chọn này */}
                                </select>
                                {errors.status && <p className="error">{errors.status.message}</p>}
                            </div>


                            <div className="action-buttons">
                                <button type="submit" className="save-button text-center">
                                    Lưu
                                </button>
                                <Link to="/admin/categories" className="cancel-button text-center">
                                    Hủy
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddCategory;
