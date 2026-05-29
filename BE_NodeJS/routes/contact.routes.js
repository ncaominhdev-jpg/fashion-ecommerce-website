const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// cấu hình mail (sử dụng Gmail để demo)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kioaoa2407@gmail.com",      
    pass: "ucfh fjea zhih umcg",     
  },
});

// API gửi email liên hệ
router.post("/send", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
  }

  const mailOptions = {
    from: email,
    to: "kioaoa2407@gmail.com", // 👈 email bạn nhận
    subject: `[LIÊN HỆ] ${subject || "Không có chủ đề"}`,
    text: `
      Họ tên: ${name}
      Email: ${email}
      SĐT: ${phone || "Không có"}

      Nội dung:
      ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Gửi liên hệ thành công!" });
  } catch (error) {
    console.error("Lỗi gửi mail:", error);
    res.status(500).json({ message: "Không thể gửi email. Thử lại sau." });
  }
});

module.exports = router;
