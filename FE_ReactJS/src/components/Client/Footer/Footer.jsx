import { FaFacebookF, FaInstagram, FaTiktok, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-3xl font-bold">Poly Fashion</p>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Không gian mua sắm thời trang hiện đại với sản phẩm chọn lọc, phối đồ dễ ứng dụng và dịch vụ tận tâm.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-champagne">Liên hệ</h3>
          <div className="mt-5 space-y-3 text-sm text-white/75">
            <p className="flex gap-3"><MapPin size={18} className="mt-1 text-champagne" />123 Nguyễn Văn A, Quận 1, TP. HCM</p>
            <p className="flex gap-3"><Phone size={18} className="mt-1 text-champagne" />0901 234 567</p>
            <p className="flex gap-3"><Mail size={18} className="mt-1 text-champagne" />support@polyfashion.com</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-champagne">Hỗ trợ</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            <li><a href="/about" className="hover:text-white">Về chúng tôi</a></li>
            <li><a href="/return-policy" className="hover:text-white">Chính sách đổi trả</a></li>
            <li><a href="/guide" className="hover:text-white">Hướng dẫn mua hàng</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-champagne">Kết nối</h3>
          <div className="mt-5 flex gap-3">
            <a href="https://facebook.com" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-clay"><FaFacebookF /></a>
            <a href="https://instagram.com" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-clay"><FaInstagram /></a>
            <a href="https://tiktok.com" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-clay"><FaTiktok /></a>
          </div>
          <div className="mt-6 flex gap-3 text-4xl text-white/80">
            <FaCcVisa />
            <FaCcMastercard />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/60">
        © 2026 Poly Fashion. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
