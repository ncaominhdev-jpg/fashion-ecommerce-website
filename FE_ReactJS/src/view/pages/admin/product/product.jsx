import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./product.css";
import HeaderAdmin from "../layout/header";
import constant from '../../../../Constants';

const Product = () => {
    const [products, setProducts] = useState([]); // Dữ liệu sản phẩm đầy đủ
    const [displayedProducts, setDisplayedProducts] = useState([]); // Sản phẩm hiển thị trên trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm
    const productsPerPage = 5; // Số sản phẩm mỗi trang

    // Hàm lấy dữ liệu sản phẩm từ backend
    const fetchProducts = () => {
        axios.get(`${constant.DOMAIN_API}/product/list`)
            .then(res => {
                setProducts(res.data.data); // Lưu dữ liệu đầy đủ
                setDisplayedProducts(res.data.data.slice(0, productsPerPage)); // Hiển thị sản phẩm của trang đầu tiên
            })
            .catch(err => {
                console.error("Lỗi khi lấy sản phẩm:", err);
            });
    };

    // Hàm tìm kiếm sản phẩm
    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setDisplayedProducts(products.slice(0, productsPerPage)); // Hiển thị lại tất cả sản phẩm khi tìm kiếm trống
            setCurrentPage(1);
            return;
        }

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedProducts(filteredProducts.slice(0, productsPerPage)); // Hiển thị sản phẩm tìm kiếm
        setCurrentPage(1); // Đặt lại trang về 1 sau khi tìm kiếm
    };

    // Hàm phân trang
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * productsPerPage;
        const endIndex = pageNumber * productsPerPage;
        setDisplayedProducts(products.slice(startIndex, endIndex)); // Chia nhỏ dữ liệu để phân trang
    };

    // Hàm xóa sản phẩm
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (!confirmDelete) return;

        try {
            const token = Cookies.get(constant.COOKIE_TOKEN);
            await axios.delete(`${constant.DOMAIN_API}/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Xóa sản phẩm thành công");
            fetchProducts(); // Cập nhật lại danh sách sản phẩm sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            alert("Xóa sản phẩm thất bại");
        }
    };

    useEffect(() => {
        fetchProducts(); // Lấy toàn bộ sản phẩm khi component mount
    }, []);

    return (
        <div className="main-container">
            <HeaderAdmin />
            <div className="product-container">
                <div className="product-box">
                    <h2 className="product-title">Danh Sách Sản Phẩm</h2>
                    <div className="product-actions">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="input-search"
                        />
                        <button onClick={handleSearch} className="btn-search">Tìm kiếm</button>
                        <Link to="/admin/AddProduct" className="btn-add">Thêm Sản Phẩm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Giá</th>
                                    <th>Mô tả</th>
                                    <th>Hoạt động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.category?.name || "Không có"}</td>
                                        <td>{Number(product.price).toLocaleString()}đ</td>
                                        <td>{product.description}</td>
                                        <td className="product-action-buttons">
                                            <Link to={`/admin/EditProduct/${product.id}`} className="btn-edit-product">Sửa</Link>
                                            <button
                                                className="btn-delete-product"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {displayedProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Không có sản phẩm nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    <div className="pagination">
                        <button 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>{`Trang ${currentPage} / ${Math.ceil(products.length / productsPerPage)}`}</span>
                        <button 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === Math.ceil(products.length / productsPerPage)}>
                            Next
                        </button>

                        {/* Các nút phân trang cụ thể */}
                        <div className="page-numbers">
                            {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                                <button 
                                    key={index + 1} 
                                    onClick={() => paginate(index + 1)} 
                                    className={currentPage === index + 1 ? "active" : ""}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
