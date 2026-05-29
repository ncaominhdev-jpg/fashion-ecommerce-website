import { useState } from "react";
import { FaFacebookMessenger, FaInstagram, FaTiktok, FaCommentDots } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const error = await res.json();
        toast.error("Gửi thất bại: " + error.message);
      }
    } catch (error) {
      console.error("Lỗi gửi form:", error);
      toast.error("Đã xảy ra lỗi khi gửi form.");
    }
  };

  const handleFaqClick = async (question) => {
    const faqData = {
      name: "Khách hàng ẩn danh",
      email: "anonymous@example.com",
      phone: "",
      subject: "Câu hỏi thường gặp",
      message: question,
    };

    try {
      const res = await fetch("http://localhost:3001/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqData),
      });

      if (res.ok) {
        toast.success("Cảm ơn! Chúng tôi đã nhận được câu hỏi của bạn.");
      } else {
        toast.error("Không thể gửi câu hỏi.");
      }
    } catch (err) {
      console.error("Lỗi gửi câu hỏi:", err);
      toast.error("Đã xảy ra lỗi.");
    }
  };

  const inputClass = "w-full rounded-2xl border border-black/10 bg-linen px-4 py-3 outline-none ring-clay/20 transition focus:ring-4";

  return (
    <main className="bg-linen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Contact</p>
          <h1 className="mt-3 font-display text-5xl font-bold text-ink">Liên hệ với chúng tôi</h1>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">Đội ngũ Poly Fashion luôn sẵn sàng hỗ trợ đơn hàng, đổi trả và tư vấn phong cách.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-7 shadow-soft">
            <h2 className="font-display text-3xl font-bold text-ink">Gửi tin nhắn</h2>
            {submitted && <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-700">Cảm ơn! Chúng tôi sẽ liên hệ sớm.</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="text" name="name" placeholder="Họ và tên" className={inputClass} value={formData.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" className={inputClass} value={formData.email} onChange={handleChange} />
              <input type="text" name="phone" placeholder="Số điện thoại" className={inputClass} value={formData.phone} onChange={handleChange} />
              <select name="subject" className={inputClass} value={formData.subject} onChange={handleChange}>
                <option value="">Chủ đề liên hệ</option>
                <option value="support">Hỗ trợ đặt hàng</option>
                <option value="complaint">Khiếu nại</option>
                <option value="cooperation">Hợp tác</option>
                <option value="other">Khác</option>
              </select>
              <textarea name="message" placeholder="Nội dung tin nhắn" className={`${inputClass} min-h-36`} value={formData.message} onChange={handleChange} />
              <button type="submit" className="w-full rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-clay">Gửi ngay</button>
            </form>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
            <iframe
              title="Bản đồ"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d982.3553699324409!2d105.75751400665126!3d9.981999887739317!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1743232289585!5m2!1svi!2s"
              className="h-full min-h-[520px] w-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-7 shadow-soft">
            <h2 className="font-display text-3xl font-bold text-ink">Kênh hỗ trợ</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="https://www.messenger.com/" className="flex items-center gap-3 rounded-2xl bg-linen p-4 font-bold"><FaFacebookMessenger className="text-blue-600" />Messenger</a>
              <a href="https://zalo.me/" className="flex items-center gap-3 rounded-2xl bg-linen p-4 font-bold"><FaCommentDots className="text-green-600" />Zalo Chat</a>
              <a href="https://www.instagram.com/" className="flex items-center gap-3 rounded-2xl bg-linen p-4 font-bold"><FaInstagram className="text-pink-600" />Instagram</a>
              <a href="https://www.tiktok.com/" className="flex items-center gap-3 rounded-2xl bg-linen p-4 font-bold"><FaTiktok />TikTok</a>
            </div>
            <div className="mt-6 space-y-3 text-neutral-600">
              <p className="flex gap-3"><MapPin className="text-clay" />123 Nguyễn Văn A, Quận 1, TP. HCM</p>
              <p className="flex gap-3"><Phone className="text-clay" />0901 234 567</p>
              <p className="flex gap-3"><Mail className="text-clay" />support@polyfashion.com</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-7 shadow-soft">
            <h2 className="font-display text-3xl font-bold text-ink">Câu hỏi thường gặp</h2>
            <div className="mt-6 space-y-3">
              {["Làm thế nào để đặt hàng?", "Shop có hỗ trợ đổi trả không?", "Mất bao lâu để nhận hàng?", "Cần thông tin về địa chỉ nhận hàng?"].map((question, index) => (
                <button key={index} onClick={() => handleFaqClick(question)} className="w-full rounded-2xl bg-linen px-4 py-3 text-left font-bold text-ink transition hover:bg-clay hover:text-white">
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
