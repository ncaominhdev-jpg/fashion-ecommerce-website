const ReviewModel = require('../models/reviewModel');
const User = require('../models/usersModel');
const Product = require('../models/productsModel');
class ReviewController {

  // Lấy tất cả review
  static async get(req, res) {
    try {
      const reviews = await ReviewModel.findAll({
        include: [
          { model: User, as: 'user', attributes: ['name'] },
          { model: Product, as: 'product', attributes: ['name'] }
        ]
      });
  
      res.status(200).json({
        message: 'Lấy danh sách đánh giá thành công',
        data: reviews
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đánh giá:', error); // Ghi lỗi ra console
      res.status(500).json({ error: error.message });
    }
  }
  
  // Lấy review theo sản phẩm
  static async getByProduct(req, res) {
    try {
      const { id } = req.params;
      const reviews = await ReviewModel.findAll({ where: { product_id: id } });

      res.status(200).json({
        message: 'Lấy đánh giá theo sản phẩm thành công',
        data: reviews
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Thêm review mới
  static async add(req, res) {
    try {
      const { user_id, product_id, rating, comment } = req.body;

      const newReview = await ReviewModel.create({
        user_id,
        product_id,
        rating,
        comment
      });

      res.status(201).json({
        message: 'Thêm đánh giá thành công',
        review: newReview
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật review
  static async update(req, res) {
    try {
      const { id } = req.params;
      const review = await ReviewModel.findByPk(id);
  
      if (!review) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      }
  
      // ✅ Kiểm tra quyền (chủ review hoặc admin)
      if (req.user.id !== review.user_id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa đánh giá này.' });
      }
  
      await review.update(req.body);
  
      res.status(200).json({
        message: 'Cập nhật đánh giá thành công',
        review
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Xóa review
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const review = await ReviewModel.findByPk(id);
  
      if (!review) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      }
  
      // ✅ Kiểm tra quyền (chủ review hoặc admin)
      if (req.user.id !== review.user_id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Bạn không có quyền xoá đánh giá này.' });
      }
  
      await review.destroy();
      res.status(200).json({ message: 'Xoá đánh giá thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getCommentCount(req, res) {
    try {
      const count = await ReviewModel.count(); // Đếm số lượng bình luận
      res.status(200).json({ count });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng bình luận:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReviewController;
