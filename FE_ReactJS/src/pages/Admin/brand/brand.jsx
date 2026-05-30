import AdminResourcePage from "../shared/AdminResourcePage";
import constant from "../../../Constants";

const getLogoUrl = (logo) => {
  if (!logo) return "";
  if (logo.startsWith("http")) return logo;
  return `${constant.DOMAIN_API}${logo}`;
};

const Brand = () => (
  <AdminResourcePage
    title="Thương hiệu"
    subtitle="Quản lý thương hiệu, logo và trạng thái kinh doanh dùng trong dữ liệu sản phẩm."
    listEndpoint="/brand/list"
    createEndpoint="/brand/add"
    updateEndpoint={(id) => `/brand/${id}`}
    deleteEndpoint={(id) => `/brand/${id}`}
    getEmptyForm={() => ({ name: "", logo: null, status: "active" })}
    mapItemToForm={(item) => ({ name: item.name || "", logo: null, status: item.status || "active" })}
    normalizePayload={(data) => ({ name: data.name, logo: data.logo, status: data.status || "active" })}
    fields={[
      { name: "name", label: "Tên thương hiệu", placeholder: "Ví dụ: Poly Studio", required: true },
      { name: "logo", label: "Logo", type: "file", accept: "image/*" },
      {
        name: "status",
        label: "Trạng thái",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Đang kinh doanh" },
          { value: "inactive", label: "Ngừng kinh doanh" },
        ],
      },
    ]}
    columns={[
      { key: "id", label: "ID", className: "font-semibold text-neutral-500", render: (item) => `#${item.id}` },
      { key: "name", label: "Tên thương hiệu", className: "font-bold text-neutral-950" },
      {
        key: "logo",
        label: "Logo",
        render: (item) =>
          item.logo ? <img src={getLogoUrl(item.logo)} alt={item.name} className="h-12 w-20 rounded-xl object-cover" /> : "Chưa có",
      },
      {
        key: "status",
        label: "Trạng thái",
        render: (item) => (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              item.status === "inactive" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {item.status === "inactive" ? "Ngừng kinh doanh" : "Đang kinh doanh"}
          </span>
        ),
      },
    ]}
  />
);

export default Brand;
