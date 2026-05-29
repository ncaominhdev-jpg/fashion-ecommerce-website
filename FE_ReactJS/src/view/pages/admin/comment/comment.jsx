import { useEffect, useState } from "react";
import axios from "axios";
import HeaderAdmin from "../layout/header";
import constant from "../../../../Constants";

const Comment = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`${constant.DOMAIN_API}/review/list`)
      .then((res) => {
        setComments(res.data.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách bình luận:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Review</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Bình luận khách hàng</h1>
          <p className="mt-2 text-sm text-neutral-500">Theo dõi phản hồi và đánh giá sản phẩm từ người mua.</p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Người dùng</th>
                  <th className="px-6 py-4 font-bold">Sản phẩm</th>
                  <th className="px-6 py-4 font-bold">Bình luận</th>
                  <th className="px-6 py-4 font-bold">Sao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-semibold text-neutral-500">#{comment.id}</td>
                      <td className="px-6 py-4 font-bold text-neutral-950">{comment.user?.name || "Ẩn danh"}</td>
                      <td className="px-6 py-4 text-neutral-600">{comment.product?.name || "Không rõ"}</td>
                      <td className="px-6 py-4 text-neutral-600">{comment.comment}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                          {comment.rating} sao
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-neutral-500">
                      Chưa có bình luận nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Comment;
