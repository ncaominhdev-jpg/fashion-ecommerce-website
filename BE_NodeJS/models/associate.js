
const Product = require('./productsModel');
const Category = require('./categoryModel');

const defineAssociations = () => {
    // Mối quan hệ: một sản phẩm thuộc về một danh mục
    Product.belongsTo(Category, {
        foreignKey: 'category_id',
        as: 'category'
    });

    // Mối quan hệ: một danh mục có nhiều sản phẩm
    Category.hasMany(Product, {
        foreignKey: 'category_id',
        as: 'products'
    });
};


module.exports = { defineAssociations, Product, Category };
