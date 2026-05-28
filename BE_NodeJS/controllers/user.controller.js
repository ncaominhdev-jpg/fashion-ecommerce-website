const UserModel = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

class UserController {

    // Lấy danh sách tất cả tài khoản
    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAll({
                 attributes: ['id', 'name', 'phone', 'email','role'] // Ẩn mật khẩu khi trả về danh sách
            });
            res.status(200).json({
                status: 200,
                message: "Lấy danh sách tài khoản thành công",
                data: users
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy tài khoản theo ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findByPk(id, {
                 attributes: ['id', 'name', 'phone', 'email', 'address', 'role']
            });

            if (!user) {
                return res.status(404).json({ message: "Id tài khoản không tồn tại" });
            }

            res.status(200).json({ status: 200, data: user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Tạo tài khoản mới (mã hóa mật khẩu)
    static async create(req, res) {
        try {
            const { name, email, password, phone, role } = req.body;

            // Kiểm tra trùng email
            const existing = await UserModel.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role
            });

            res.status(201).json({
                message: "Tạo tài khoản mới thành công",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Cập nhật tài khoản
    static async update(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Id tài khoản không tồn tại" });
            }

            const { name, email, password, phone, role } = req.body;
            const updateData = { name, email, phone, role };

            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            await user.update(updateData);

            res.status(200).json({
                message: "Cập nhật tài khoản thành công",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xoá tài khoản
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: "Id tài khoản không tồn tại" });
            }

            await user.destroy();

            res.status(200).json({ message: "Xoá tài khoản thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Đăng nhập
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ message: "Email không tồn tại" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Sai mật khẩu" });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: '1d' }
            );

            res.status(200).json({
                message: "Đăng nhập thành công",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Đăng ký tài khoản người dùng
    static async register(req, res) {
        try {
            const { name, email, password, phone } = req.body;

            // Kiểm tra xem email đã tồn tại chưa
            const existing = await UserModel.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            // Hash mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo tài khoản mới với role mặc định là "customer"
            const newUser = await UserModel.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role: 'customer'
            });

            // Tạo token sau khi đăng ký
            const token = jwt.sign(
                { id: newUser.id, role: newUser.role },
                SECRET_KEY,
                { expiresIn: '1d' }
            );

            res.status(201).json({
                message: "Đăng ký tài khoản thành công",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy thông tin cá nhân từ token
    static async getProfile(req, res) {
        try {
            const user = await UserModel.findByPk(req.user.id, {
                 attributes: ['id', 'name', 'phone', 'email', 'address', 'role']
            });

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            res.status(200).json({
                message: 'Lấy thông tin cá nhân thành công',
                user
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static async updatePassword(req, res) {
        try {
            const { id } = req.params;
            const { oldPassword, newPassword } = req.body;

            const user = await UserModel.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            await user.update({ password: hashed });

            res.status(200).json({ message: 'Đổi mật khẩu thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static async resetPassword(req, res) {
        try {
            const { email, phone, newPassword } = req.body;

            const user = await UserModel.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Email không tồn tại' });
            }

            if (user.phone !== phone) {
                return res.status(400).json({ message: 'Số điện thoại không đúng' });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            await user.update({ password: hashed });

            res.status(200).json({ message: 'Cập nhật mật khẩu mới thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { name, phone, email, avatar } = req.body;
            const userId = req.user?.id;

            const user = await UserModel.findByPk(userId);
            if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

            await user.update({
                name: name?.trim() || user.name,
                phone: phone || user.phone,
                email: email || user.email,
                avatar: avatar || user.avatar,
            });

            return res.status(200).json({
                message: "Cập nhật thành công",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
    static async updateRole(req, res) {
        try {
          const { id } = req.params;
          const { role } = req.body; // role mới, ví dụ: 'admin' hoặc 'customer'
    
          // Kiểm tra giá trị role có hợp lệ không
          if (role !== 'admin' && role !== 'customer') {
            return res.status(400).json({ message: "Role không hợp lệ" });
          }
    
          const user = await UserModel.findByPk(id);
          if (!user) {
            return res.status(404).json({ message: "Id tài khoản không tồn tại" });
          }
    
          // Cập nhật role
          await user.update({ role });
    
          res.status(200).json({
            message: "Cập nhật quyền người dùng thành công",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getUserCount(req, res) {
        try {
          const count = await UserModel.count(); 
          res.status(200).json({ count });
        } catch (error) {
          console.error("Lỗi khi lấy số lượng người dùng:", error.message);
          res.status(500).json({ error: error.message });
        }
      }
    }


module.exports = UserController;