# Sprint 1 Contract — Nền dữ liệu, Sơ đồ tư duy & Trải nghiệm cốt lõi (MVP)

- **Trạng thái:** Accepted
- **Ngày phê duyệt:** 2026-10-23
- **Tài liệu nguồn:** [plans/number-idioms-product-spec.md](./number-idioms-product-spec.md) (Status: Approved)
- **Đề xuất kỹ thuật:** [plans/sprint_1_proposal.md](./sprint_1_proposal.md)

---

## 1. Feature Scope
- **F8 & F10 (Quản trị Google Sheets & Chịu lỗi):**
  - Mẫu cấu trúc Google Sheet (2 tab: `So` và `ThanhNgu`).
  - Trình phân giải dữ liệu (CSV parser) có bộ lọc chống crash, bỏ qua dòng lỗi, lưu cache trình duyệt (`localStorage`).
  - Bộ dữ liệu dự phòng cục bộ `seed_data.json` sẵn sàng 100% khi chưa kết nối Google Sheet.
- **F11 (Nội dung khởi tạo):**
  - 50 thành ngữ (mỗi số 1, 3, 8, 9, 10 có 10 thành ngữ) với đầy đủ nghĩa từng chữ, nghĩa bóng, liên kết văn hóa.
- **F1 (Trang chủ các con số):**
  - Hiển thị 5 số với thông điệp triết lý văn hóa tương ứng.
- **F2 (Sơ đồ tư duy - Mindmap trực quan):**
  - Trình diễn dạng cây SVG tương tác: Số trung tâm → Ý nghĩa biểu tượng → Thành ngữ.
- **F3 (Thẻ chi tiết thành ngữ):**
  - Chữ Hán lớn, Pinyin, Hán Việt, phân tích nghĩa từng chữ (literal) và ý nghĩa văn hóa số.
- **F5 (Tùy chọn hiển thị ban đầu):**
  - Công tắc bật/tắt âm Hán Việt (mặc định Bật theo Q4).
- **F12 (Responsive Desktop & Mobile):**
  - Tối ưu hóa giao diện cho cả 2 nền tảng theo D7.

---

## 2. Dependencies
- Không phụ thuộc backend.
- Phụ thuộc Google Sheets API/CSV công khai (được giảm thiểu bằng `seed_data.json` offline).

---

## 3. Technical Approach
- **Frontend Stack:** HTML5, CSS3 hiện đại, Vanilla JavaScript (ES Modules).
- **Typography & Style:** Google Fonts (`Noto Serif SC` cho chữ Hán, `Outfit` / `Inter` cho chữ Latinh), màu sắc chủ đạo Chu Sa (Cinnabar Red `#C83E2C`), Mực Nghiên (Ink Charcoal `#2C3437`), Giấy Xuyến (Warm Parchment `#F7F4EE`), hỗ trợ Dark Mode.
- **Mindmap Engine:** SVG tương tác do chính ứng dụng sinh ra dựa trên tọa độ tính toán động, có tính co giãn theo màn hình (viewBox).

---

## 4. Non-Functional Requirements
- **Performance:** Tải trang đầu tiên < 1.5s, không giật lag khi chuyển giữa các số.
- **Resilience:** Lỗi mạng hoặc link Sheet sai không làm trắng trang.
- **Accessibility:** Phông chữ dễ đọc, tương phản WCAG AA, phím Tab điều hướng được.
- **Platform Parity:** Trải nghiệm chạm/lướt mượt trên Mobile, trải nghiệm chuột/phím tối ưu trên Desktop.

---

## 5. Acceptance Criteria

### Kịch bản 1: Bật/Tắt âm Hán Việt
- **Given** người dùng truy cập trang chủ hoặc xem thẻ thành ngữ
- **When** người dùng gạt nút công tắc "Âm Hán Việt"
- **Then** toàn bộ âm Hán Việt trên giao diện lập tức ẩn/hiện đồng bộ, trạng thái được ghi nhớ khi tải lại trang.

### Kịch bản 2: Khám phá Sơ đồ tư duy (Desktop & Mobile)
- **Given** người dùng chọn một con số (ví dụ: Số 9 - Cửu)
- **When** giao diện sơ đồ tư duy hiển thị
- **Then** trên Desktop hiển thị toàn bộ mạng lưới nhánh ý nghĩa (Vương quyền, Trường cửu, Cực đại) dẫn tới 10 thành ngữ; trên Mobile hiển thị dạng sơ đồ chạm mở nhánh hoặc danh sách trực quan, có thể nhấp vào bất kỳ thành ngữ nào để mở thẻ chi tiết.

### Kịch bản 3: Chịu lỗi khi Google Sheets mất kết nối
- **Given** đường dẫn Google Sheets bị lỗi hoặc ngắt mạng
- **When** ứng dụng khởi động
- **Then** ứng dụng tự động nạp từ `seed_data.json` tích hợp sẵn, hiển thị thông báo nhẹ và người dùng vẫn học đủ 50 thành ngữ bình thường.

---

## 6. Verification Plan
- [ ] Kiểm thử tự động / thủ công trên trình duyệt (Playwright / Chromium DevTools).
- [ ] Kiểm tra responsive trên các độ phân giải: Mobile 375x667, Tablet 768x1024, Desktop 1440x900.
- [ ] Kiểm tra tính toàn vẹn của 50 thành ngữ mẫu (đầy đủ chữ Hán, Pinyin, Hán Việt, giải nghĩa).
- [ ] Kiểm tra khả năng chạy tĩnh không cần web server khi deploy lên GitHub Pages.

---

## 7. Known Risks and Mitigation
- **Risk 1:** Trình duyệt mobile vẽ SVG bị chật chội nếu quá nhiều nhánh.
  - *Mitigation:* Cung cấp chế độ xem linh hoạt (chuyển đổi giữa Sơ đồ tương tác và Danh sách thẻ thông minh) khi màn hình dưới 600px.
- **Risk 2:** Google giới hạn xuất CSV hoặc bị chặn CORS.
  - *Mitigation:* Dùng link Google Visualization Query (`/gviz/tq?tqx=out:csv`) hoàn toàn mở CORS, kèm bộ đệm `localStorage` và `seed_data.json`.

---

## 8. Rollback Strategy
- Vì mã nguồn thuần tĩnh trên Git, việc hoàn tác thực hiện bằng `git revert` hoặc chuyển về commit trước đó mà không ảnh hưởng cơ sở dữ liệu.

---

## 9. Negotiation Audit Trail
- **Round 1:** Generator đề xuất scope S1 bao gồm nền dữ liệu, trang chủ, sơ đồ tư duy và thẻ chi tiết. Evaluator đồng ý và yêu cầu kiểm tra kỹ tính đối xứng Desktop/Mobile theo D7. Scope được duyệt Accept.

---

## 10. Sign-off Record
- **Generator:** Antigravity (Signed)
- **Evaluator:** Evaluator Role (Accepted)
- **User:** Approved (2026-10-23)
