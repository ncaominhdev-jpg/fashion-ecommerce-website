import { useState, useCallback, useEffect } from "react";
import { Pencil, LogOut, RefreshCw, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Constants from "../../../Constants";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [cookies, , removeCookie] = useCookies(["token", "role"]);
  const [localUser, setLocalUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", Constants.UPLOAD_PRESET);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${Constants.CLOUD_NAME}/image/upload`, formData);
    return res.data.secure_url;
  };

  const reloadUserData = useCallback(() => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setLocalUser({
          ...parsed,
          avatarPreview: parsed.avatar || require("../../../assets/img/user-4.jpg"),
        });
      } else {
        setUpdateStatus({ message: "Không tìm thấy dữ liệu người dùng.", type: "error" });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (e) {
      console.error("Lỗi load user:", e);
      setUpdateStatus({ message: "Lỗi khi tải dữ liệu người dùng.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    reloadUserData();
  }, [reloadUserData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files[0];
      if (file) {
        setLocalUser((prev) => ({
          ...prev,
          avatar: file,
          avatarPreview: URL.createObjectURL(file),
        }));
      }
      return;
    }
    setLocalUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!localUser.name || localUser.name.trim().length < 2) {
        throw new Error("Tên phải có ít nhất 2 ký tự");
      }

      if (localUser.phone && !/^\d{10}$/.test(localUser.phone)) {
        throw new Error("Số điện thoại không hợp lệ");
      }

      const token = cookies.token;
      if (!token) throw new Error("Chưa đăng nhập");

      let avatarUrl = localUser.avatarPreview;
      if (localUser.avatar instanceof File) {
        avatarUrl = await uploadImageToCloudinary(localUser.avatar);
      }

      const res = await axios.put(`${Constants.DOMAIN_API}/user/update-user/${localUser.id}`, {
        name: localUser.name,
        phone: localUser.phone,
        email: localUser.email,
        avatar: avatarUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = {
        ...localUser,
        ...res.data.user,
        avatarPreview: res.data.user.avatar,
      };

      localStorage.setItem("user", JSON.stringify(updated));
      setLocalUser(updated);
      setIsEditing(false);
      setUpdateStatus({ message: "Cập nhật thành công!", type: "success" });
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setUpdateStatus({ message: err.response?.data?.message || err.message, type: "error" });
    }
  };

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!localUser) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">Đang tải dữ liệu...</div>
      </main>
    );
  }

  const inputClass = "w-full rounded-2xl border border-black/10 bg-linen px-4 py-3 outline-none ring-clay/20 transition focus:ring-4";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Account</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Thông tin người dùng</h1>
        </div>
        <button onClick={reloadUserData} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-ink shadow-soft" disabled={isLoading}>
          <RefreshCw size={16} />
          {isLoading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      {updateStatus.message && (
        <div className={`mb-6 rounded-2xl px-5 py-4 font-semibold ${updateStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {updateStatus.message}
        </div>
      )}

      <section className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-soft md:grid-cols-[260px_1fr] md:p-8">
        <div className="text-center">
          <img
            src={localUser.avatarPreview}
            alt="Avatar"
            className="mx-auto h-44 w-44 rounded-full object-cover ring-8 ring-linen"
            onError={(e) => {
              e.target.src = require("../../../assets/img/user-4.jpg");
            }}
          />
          {isEditing && (
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="mt-5 w-full text-sm"
            />
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Tên</label>
            {isEditing ? (
              <input className={inputClass} type="text" name="name" value={localUser.name || ""} onChange={handleChange} />
            ) : (
              <p className="rounded-2xl bg-linen px-4 py-3 font-semibold">{localUser.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Email</label>
            <p className="rounded-2xl bg-linen px-4 py-3 font-semibold">{localUser.email}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Số điện thoại</label>
            {isEditing ? (
              <input className={inputClass} type="text" name="phone" value={localUser.phone || ""} onChange={handleChange} maxLength={10} />
            ) : (
              <p className="rounded-2xl bg-linen px-4 py-3 font-semibold">{localUser.phone || "Chưa cập nhật"}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {isEditing ? (
              <>
                <button className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-white hover:bg-clay" onClick={handleSave}>
                  <Save size={16} /> Lưu thay đổi
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-linen px-5 py-3 font-bold text-ink" onClick={() => {
                  setIsEditing(false);
                  reloadUserData();
                }}>
                  <X size={16} /> Hủy
                </button>
              </>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-white hover:bg-clay" onClick={() => setIsEditing(true)}>
                <Pencil size={16} /> Chỉnh sửa
              </button>
            )}
            <button className="inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-3 font-bold text-red-600" onClick={handleLogout}>
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
