# Task 3: Sơ đồ Tư duy (Mindmap Engine) & Thẻ Chi tiết Thành ngữ

- **Trạng thái:** Completed (2026-10-23)
- **Mục tiêu:** Xây dựng module hiển thị Mindmap tương tác (`js/mindmap.js`) và Component Modal/Drawer hiển thị bóc tách thành ngữ (`js/detail-modal.js`).
- **Phụ thuộc:** Task 2
- **Tiêu chí chấp nhận:**
  - Nhấp vào một số trên Trang chủ sẽ dẫn đến màn hình Mindmap của số đó.
  - Mindmap thể hiện rõ 3 cấp: Số (Trung tâm) → Ý niệm văn hóa (Nhánh chính) → Thành ngữ tương ứng (Node lá).
  - Có thể chuyển đổi mượt mà giữa chế độ Sơ đồ đồ họa (SVG) và Chế độ danh sách thẻ (thân thiện tuyệt đối cho màn hình điện thoại nhỏ).
  - Nhấp vào thành ngữ sẽ mở Thẻ chi tiết: Hiển thị chữ Hán to đẹp, Pinyin, Hán Việt (đồng bộ theo switch chung), phân rã từng chữ (chữ + nghĩa), nghĩa đen, nghĩa bóng và câu chuyện triết lý văn hóa.
- **Chi tiết thực thi:** [implementation_prompt.md](./implementation_prompt.md)
