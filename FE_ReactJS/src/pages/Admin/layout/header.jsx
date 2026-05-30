import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  Brush,
  FolderTree,
  Layers3,
  MessageSquareText,
  PackageCheck,
  PackageSearch,
  Palette,
  Ruler,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Tổng quan", icon: BarChart3 },
  { to: "/admin/product", label: "Sản phẩm", icon: Boxes },
  { to: "/admin/inventory", label: "Tồn kho", icon: PackageSearch },
  { to: "/admin/variants", label: "Biến thể", icon: Layers3 },
  { to: "/admin/categories", label: "Loại sản phẩm", icon: FolderTree },
  { to: "/admin/brands", label: "Thương hiệu", icon: Brush },
  { to: "/admin/sizes", label: "Size", icon: Ruler },
  { to: "/admin/colors", label: "Màu sắc", icon: Palette },
  { to: "/admin/target-groups", label: "Nhóm khách", icon: UsersRound },
  { to: "/admin/orders", label: "Đơn hàng", icon: PackageCheck },
  { to: "/admin/users", label: "Người dùng", icon: UsersRound },
  { to: "/admin/comments", label: "Bình luận", icon: MessageSquareText },
];

const HeaderAdmin = () => {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto border-r border-neutral-200 bg-neutral-950 px-5 py-6 text-white shadow-2xl lg:block">
      <Link to="/admin" className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4 text-white no-underline">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-neutral-950">
          <ShieldCheck size={22} />
        </span>
        <span>
          <span className="block text-lg font-bold tracking-normal text-white">Poly Fashion</span>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Admin</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active =
            location.pathname.toLowerCase() === to.toLowerCase() ||
            (to !== "/admin" && location.pathname.toLowerCase().startsWith(to.toLowerCase()));

          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold no-underline transition ${
                active
                  ? "bg-white text-neutral-950 shadow-lg shadow-black/20"
                  : "text-neutral-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default HeaderAdmin;
