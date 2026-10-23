# Implementation Handoff — Sprint 1: Nền Dữ Liệu & Trải Nghiệm Cốt Lõi

- **Trạng thái:** Ready for evaluator
- **Sprint:** 1
- **Hợp đồng:** [plans/sprint_1_contract.md](../plans/sprint_1_contract.md) (Status: Accepted)
- **Ngày bàn giao:** 2026-10-23
- **Vai trò bàn giao:** Generator

---

## 1. Tóm tắt kết quả triển khai

Generator đã hoàn thành toàn bộ 4 nhiệm vụ trong Sprint 1 theo đúng hợp đồng được phê duyệt:
1. **Dữ liệu & Bộ phân giải chịu lỗi:**
   - [data/seed_data.json](../data/seed_data.json): 50 thành ngữ (mỗi số 1, 3, 8, 9, 10 có đúng 10 thành ngữ) với đầy đủ chữ Hán, Pinyin, Hán Việt, phân tích 4 ký tự, nghĩa đen, nghĩa bóng, và bối cảnh văn hóa.
   - [data/template_so.csv](../data/template_so.csv): Mẫu chuẩn bị cho Google Sheets.
   - [js/data-service.js](../js/data-service.js): Parser CSV chịu lỗi, hỗ trợ nạp từ Google Sheets trực tiếp, fallback êm ái sang seed data khi ngoại tuyến, lưu đệm `localStorage`.
2. **Giao diện Á Đông Đương đại & Đa nền tảng (D7):**
   - [css/style.css](../css/style.css): Hệ thống màu Chu Sa, Hoàng Kim, Giấy Xuyến, Nghiên Mực. Hỗ trợ Dark/Light mode và công tắc Bật/Tắt âm Hán Việt (lưu trạng thái trình duyệt).
   - [index.html](../index.html): Cấu trúc ngữ nghĩa cao, responsive đối xứng cho cả Desktop (1440px) và Mobile (375px).
3. **Sơ đồ tư duy (Mindmap Engine) & Thẻ bóc tách:**
   - [js/mindmap.js](../js/mindmap.js): Tự động tính toán và vẽ SVG cây tư duy 3 cấp (Con số -> Nhánh văn hóa -> Thành ngữ). Cung cấp chế độ Danh sách thẻ phân cấp (`📋 Danh sách thẻ`) tối ưu tuyệt đối cho màn hình điện thoại nhỏ.
   - [js/detail-modal.js](../js/detail-modal.js): Bóc tách 4 chữ Hán thành 4 thẻ trực quan kèm nghĩa từng chữ, nghĩa ghép, nghĩa bóng và điển tích văn hóa.
4. **Tài liệu & Sẵn sàng Deploy:**
   - [docs/google_sheets_guide.md](../docs/google_sheets_guide.md): Hướng dẫn chi tiết từng bước cho Admin quản trị thành ngữ qua Google Sheets.
   - Ứng dụng chạy tĩnh 100%, sẵn sàng đưa lên GitHub Pages hoặc bất kỳ static host nào mà không tốn chi phí máy chủ.

---

## 2. Bằng chứng kiểm thử và xác minh

- **Số lượng thành ngữ:** Đã xác minh bằng Node script: 5 con số, 50 thành ngữ, phân bổ 10/10/10/10/10.
- **Tính toàn vẹn HTTP:** Toàn bộ tài nguyên `index.html`, `css/style.css`, `js/app.js`, `data/seed_data.json` đều phản hồi mã `200 OK`.
- **Hán Việt toggle:** Đã kiểm thử cơ chế ẩn/hiện đồng bộ thông qua class `.hide-hanviet` và lưu `localStorage`.
- **Theme switch:** Đã kiểm thử chuyển đổi giữa chế độ sáng (Giấy xuyến) và tối (Mực nghiên).

---

## 3. Các mục chuyển giao tiếp theo (Sprint 2 Preview)
- F4: Chế độ đố vui bóc tách chữ từng nấc (Quiz Mode).
- F6: Phát âm bằng giọng đọc Web Speech API có sẵn của trình duyệt.
