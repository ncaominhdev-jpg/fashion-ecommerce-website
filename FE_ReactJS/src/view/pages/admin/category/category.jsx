import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./category.css";
import HeaderAdmin from "../layout/header";
import constant from '../../../../Constants';

const Category = () => {
    const [categories, setCategories] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 

    // Fetch categories from the API
    const fetchCategories = () => {
        axios.get(`${constant.DOMAIN_API}/category/list`)
            .then(res => {
                console.log("Dữ liệu danh mục từ API:", res.data.data);
                if (res.data && res.data.data) {
                    setCategories(res.data.data);  
                }
            })
            .catch(err => {
                console.error("Lỗi khi lấy danh mục:", err);
            });
    };

    // Handle search action
    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            fetchCategories();  
            return;
        }

        // Gọi API tìm kiếm danh mục
        axios.get(`${constant.DOMAIN_API}/category/search?searchTerm=${searchTerm}`)
            .then(res => {
                if (res.data && res.data.data) {
                    setCategories(res.data.data);  
                }
            })
            .catch(err => {
                console.error("Lỗi khi tìm kiếm danh mục:", err);
                alert("Không tìm thấy danh mục nào");
            });
    };

    // Handle delete category
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
        if (!confirmDelete) return;

        try {
            const token = Cookies.get(constant.COOKIE_TOKEN);
            await axios.delete(`${constant.DOMAIN_API}/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Xóa danh mục thành công");
            fetchCategories(); // Refresh category list after deletion
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
            alert("Xóa danh mục thất bại");
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <HeaderAdmin />
            <div className="category-container">
                <div className="content">
                    <div className="category-card">
                        <div className="category-header">
                            <h2>Danh Sách Loại Sản Phẩm</h2>
                            <Link to="/admin/AddCategory" className="category-add-btn">+ Thêm Loại</Link>
                        </div>


                        <div className="category-table-wrapper">
                            <table className="category-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên loại</th>
                                        <th>Trạng thái</th>
                                        <th>Hoạt động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <tr key={category.id}>
                                                <td>{category.id}</td>
                                                <td>{category.name}</td>
                                                <td>
                                                    <span className={category.status === 'active' ? "category-badge-success" : "category-badge-danger"}>
                                                        {category.status === 'active' ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link to={`/admin/EditCategory/${category.id}`} className="category-edit-btn">Sửa</Link>
                                                    <button
                                                        className="category-delete-btn"
                                                        onClick={() => handleDelete(category.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center' }}>Không có danh mục nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Category;
