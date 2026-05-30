import AdminResourcePage from "../shared/AdminResourcePage";

const Color = () => (
  <AdminResourcePage
    title="Màu sắc"
    subtitle="Quản lý tên màu và mã màu dùng cho biến thể sản phẩm."
    listEndpoint="/color/list"
    createEndpoint="/color/add"
    updateEndpoint={(id) => `/color/${id}`}
    deleteEndpoint={(id) => `/color/${id}`}
    getEmptyForm={() => ({ color_name: "", color_code: "#000000" })}
    fields={[
      { name: "color_name", label: "Tên màu", placeholder: "Ví dụ: Đen, Trắng, Be...", required: true },
      { name: "color_code", label: "Mã màu", type: "color", required: true },
    ]}
    columns={[
      { key: "id", label: "ID", className: "font-semibold text-neutral-500", render: (item) => `#${item.id}` },
      { key: "color_name", label: "Tên màu", className: "font-bold text-neutral-950" },
      {
        key: "color_code",
        label: "Mã màu",
        render: (item) => (
          <span className="inline-flex items-center gap-3 font-semibold">
            <span className="h-7 w-7 rounded-full border border-neutral-200" style={{ backgroundColor: item.color_code || "#fff" }} />
            {item.color_code}
          </span>
        ),
      },
    ]}
  />
);

export default Color;
