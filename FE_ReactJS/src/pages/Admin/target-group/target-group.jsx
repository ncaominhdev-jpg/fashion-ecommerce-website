import AdminResourcePage from "../shared/AdminResourcePage";

const TargetGroup = () => (
  <AdminResourcePage
    title="Nhóm khách hàng"
    subtitle="Quản lý nhóm hiển thị như Nam, Nữ, Trẻ em hoặc Unisex."
    listEndpoint="/target-group/list"
    createEndpoint="/target-group/add"
    updateEndpoint={(id) => `/target-group/${id}`}
    deleteEndpoint={(id) => `/target-group/${id}`}
    getListFromResponse={(data) => data?.data || []}
    getEmptyForm={() => ({ label: "" })}
    fields={[{ name: "label", label: "Tên nhóm", placeholder: "Ví dụ: Nam, Nữ, Trẻ em, Unisex...", required: true }]}
    columns={[
      { key: "id", label: "ID", className: "font-semibold text-neutral-500", render: (item) => `#${item.id}` },
      { key: "label", label: "Tên nhóm", className: "font-bold text-neutral-950" },
    ]}
  />
);

export default TargetGroup;
