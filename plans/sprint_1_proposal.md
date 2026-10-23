# Proposal: Sprint 1 — Nền dữ liệu, Kiến trúc Responsive & Trải nghiệm cốt lõi (MVP)

- **Sprint:** 1
- **Trạng thái:** Evaluator Reviewed & Accepted
- **Tài liệu nguồn:** [plans/number-idioms-product-spec.md](./number-idioms-product-spec.md) (Status: Approved)
- **Ngày lập:** 2026-10-23

---

## 1. Mục tiêu và Phạm vi Sprint 1

Sprint 1 tập trung xây dựng nền tảng hoàn chỉnh, xem được và tương tác trực tiếp được trên môi trường web tĩnh (hỗ trợ deploy GitHub Pages):
- **F8 + F10:** Thiết kế cấu trúc dữ liệu Google Sheets chuẩn (mỗi thành ngữ 1 dòng) + Module nạp/phân tích CSV chống lỗi (resilient parser, local fallback data).
- **F11:** Khởi tạo bộ dữ liệu mẫu ban đầu: 5 số (1, 3, 8, 9, 10), mỗi số ~10 thành ngữ (tổng cộng 50 thành ngữ) với đầy đủ chữ Hán, Pinyin, Hán Việt, nghĩa từng chữ, nghĩa đen, nghĩa bóng, ý nghĩa văn hóa và câu hỏi đố vui.
- **F1:** Trang chủ 5 con số với thẻ thông tin triết lý văn hóa, tỷ lệ học, hiển thị tối ưu cho cả Mobile (dạng thẻ lướt/danh mục chạm) và Desktop (grid layout trực quan).
- **F2:** Sơ đồ tư duy (Mindmap) theo từng số: Node trung tâm (con số) → Node nhánh (tầng ý nghĩa văn hóa) → Node lá (thành ngữ). Vẽ bằng SVG/Canvas thuần, tương tác zoom/pan/click chuyển tab, responsive trên cả Mobile & Desktop.
- **F3:** Thẻ chi tiết thành ngữ (Modal/Drawer): Xem chữ Hán cỡ lớn, Pinyin, Hán Việt (có toggle ẩn/hiện), nghĩa từng chữ, dẫn xuất văn hóa.
- **F12:** Bố cục responsive chuyên biệt cho cả Mobile (touch-friendly, drawer, bottom navigation) và Desktop (multi-column, hotkeys, sidebar mindmap), deploy sẵn sàng cho GitHub Pages.

*(Các tính năng Đố vui tương tác sâu F4, Phát âm F6 chuyển sang Sprint 2; Lưu tiến độ học & Ôn tập F7, F13 chuyển sang Sprint 3).*

---

## 2. Giải pháp Kỹ thuật Đề xuất

1. **Công nghệ:**
   - HTML5, CSS3 hiện đại (CSS Variables, Flexbox/Grid, Glassmorphism, phong cách Á Đông thanh lịch kết hợp Dark/Light theme).
   - Vanilla JavaScript ES Modules (không cần bundler nặng nề, chạy trực tiếp trên GitHub Pages không lỗi build).
   - SVG thuần để render Mindmap (dễ căn chỉnh responsive, hỗ trợ viewBox scale tự nhiên trên cả màn hình nhỏ và lớn).

2. **Cơ chế nạp dữ liệu (Google Sheets + Fallback):**
   - Đọc trực tiếp từ link xuất CSV công khai của Google Sheets (`https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}`).
   - Tích hợp sẵn file `data/seed_data.json` đóng vai trò offline/fallback khi mạng chập chờn hoặc chưa cấu hình Sheet ID.
   - Parser tự động chuẩn hóa, bỏ qua các dòng thiếu trường bắt buộc mà không làm crash ứng dụng.

3. **Thiết kế Responsive (Map cả Desktop & Mobile theo D7):**
   - **Mobile:**
     - Header gọn nhẹ, toggle Hán Việt / Theme.
     - Số học: Card vuốt ngang hoặc accordion dọc, phông chữ Hán lớn, dễ bấm bằng ngón cái.
     - Mindmap: Chế độ Tree/Radial thu phóng tự do hoặc chuyển đổi nhanh sang dạng List phân cấp nếu màn hình quá hẹp.
     - Chi tiết: Bottom Sheet Drawer trượt mượt mà.
   - **Desktop:**
     - Grid layout 5 cột / 3 cột cân đối.
     - Mindmap không gian rộng, hiển thị toàn cảnh các nhánh văn hóa kèm hiệu ứng hover highlight liên kết.
     - Chi tiết thành ngữ: Modal hoặc side panel 2 cột (cột trái bóc tách chữ, cột phải câu chuyện văn hóa).

---

## 3. Tiêu chí Kiểm thử & Xác minh

- Hiển thị đầy đủ 50 thành ngữ thuộc 5 con số.
- Chuyển đổi giữa chế độ bật/tắt Hán Việt hoạt động tức thì trên toàn giao diện.
- Kiểm thử responsive trên kích thước 375px (iPhone), 768px (iPad) và 1440px (Desktop) không tràn layout hay lỗi font chữ Hán.
- Khi ngắt kết nối mạng hoặc sai link Sheet, ứng dụng tự động hiển thị dữ liệu fallback cục bộ và thông báo nhẹ nhàng.

---

## 4. Ý kiến Đánh giá Độc lập (Evaluator Review)

- **Đánh giá phạm vi:** Phù hợp hoàn toàn với Sprint 1 trong Product Spec đã duyệt. Tách rõ ràng phần hiển thị/nền dữ liệu (S1) với logic đố vui/âm thanh (S2).
- **Đánh giá NFR:** Đã tính đến offline fallback, zero-dependency, tốc độ tải tức thì và tuân thủ tuyệt đối quy tắc D7 (Desktop & Mobile ngang nhau).
- **Kết luận:** **Accept** (Đồng ý chuyển thành Sprint 1 Contract).
