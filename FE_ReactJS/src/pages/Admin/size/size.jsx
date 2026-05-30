import AdminResourcePage from "../shared/AdminResourcePage";

const Size = () => (
  <AdminResourcePage
    title="Size sản phẩm"
    subtitle="Quản lý các lựa chọn kích cỡ dùng cho biến thể sản phẩm."
    listEndpoint="/size/list"
    createEndpoint="/size/add"
    updateEndpoint={(id) => `/size/${id}`}
    deleteEndpoint={(id) => `/size/${id}`}
    getEmptyForm={() => ({ size_label: "" })}
    fields={[{ name: "size_label", label: "Tên size", placeholder: "Ví dụ: S, M, L, XL, 39, 40...", required: true }]}
    columns={[
      { key: "id", label: "ID", className: "font-semibold text-neutral-500", render: (item) => `#${item.id}` },
      { key: "size_label", label: "Size", className: "font-bold text-neutral-950" },
    ]}
  />
);

export default Size;
