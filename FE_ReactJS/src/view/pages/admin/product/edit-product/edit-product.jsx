import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import constant from '../../../../../Constants';
import HeaderAdmin from "../../layout/header";
import "./edit-product.css"

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // ✅ Thêm state này
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    stock: '',
    category_id: '',
    brand_id: '',
    target_group_id: '',
    image: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${constant.DOMAIN_API}/category/list`);
        setCategories(res.data.data); // ✅ Cập nhật đúng dữ liệu categories
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith(`${constant.COOKIE_TOKEN}=`))?.split('=')[1];

    axios
      .get(`${constant.DOMAIN_API}/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      .then((response) => {
        const { data } = response.data;
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          sale_price: data.sale_price,
          stock: data.stock,
          category_id: data.category_id,
          brand_id: data.brand_id,
          target_group_id: data.target_group_id,
          image: data.image,
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProduct = new FormData();
    for (const key in formData) {
      updatedProduct.append(key, formData[key]);
    }

    const token = document.cookie.split('; ').find(row => row.startsWith(`${constant.COOKIE_TOKEN}=`))?.split('=')[1];

    axios
      .put(`${constant.DOMAIN_API}/product/${id}`, updatedProduct, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.message);
        navigate(`/admin/product`);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeaderAdmin />
      <div className="edit-product-wrapper">
        <div className="edit-product-card">
          <h2 className="edit-product-title">Edit Product</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-product-form">
            <div className="form-group">
              <label htmlFor="name">Tên sản phẩm</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Giá</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Danh mục</label>
              <select
                name="category_id"
                id="category_id"
                className="form-control"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Hình ảnh</label>
              <input
                type="file"
                id="image"
                name="image"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            <div className="edit-product-actions">
              <button type="submit" className="btn-save-product">Cập nhật sản phẩm</button>
              <button type="button" className="btn-cancel-product" onClick={() => navigate(`/admin/product`)}>Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
