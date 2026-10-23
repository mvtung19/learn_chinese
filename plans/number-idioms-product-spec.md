# Product Spec — Web học thành ngữ số tiếng Trung

- **Trạng thái:** Approved
- **Ngày phê duyệt:** 2026-10-23
- **Nguồn:** [docs/request.md](../docs/request.md) + phê duyệt của người dùng
- **Spec trước đó:** Không có (spec mới)

## Quyết định đã chốt với người dùng

| # | Quyết định |
|---|---|
| D1 | Người học là người Việt; âm Hán Việt là **tùy chọn bật/tắt** |
| D2 | Phạm vi số: **1, 3, 8, 9, 10**; mỗi số khoảng **10 thành ngữ** (~50 thành ngữ ban đầu) |
| D3 | Phát âm dùng **giọng đọc có sẵn của trình duyệt** |
| D4 | Tiến độ học lưu **trên máy người học**, không cần đăng nhập |
| D5 | Không có server riêng; admin thêm/sửa/xóa dữ liệu bằng **Google Sheets** |
| D6 | Deploy trên nền tảng **hosting tĩnh miễn phí** |
| D7 | Thiết kế **cho cả điện thoại và máy tính ngang nhau**: mỗi màn hình đều có bố cục riêng cho từng loại thiết bị, mockup duyệt cả hai |

---

## 1. Product Overview

### Problem statement
Người Việt học tiếng Trung thường học thuộc lòng thành ngữ có số mà không hiểu vì sao con số đó được dùng. Kết quả là chóng quên, không tự suy ra được nghĩa của thành ngữ mới.

### Target user / audience
- **Người học:** người Việt đang học tiếng Trung (từ sơ cấp trở lên), dùng điện thoại hoặc máy tính.
- **Admin nội dung:** người quen dùng bảng tính, không cần biết lập trình hay git.

### Value proposition
- Hiểu **ý nghĩa văn hóa của từng con số** trước, rồi thấy nó lặp lại trong các thành ngữ qua sơ đồ tư duy.
- **Tự suy luận nghĩa** qua đố vui bóc tách từng chữ thay vì học vẹt.
- Nhớ lâu hơn nhờ tương tác chủ động và ôn tập.
- Admin cập nhật nội dung bằng Google Sheets quen thuộc, không tốn chi phí vận hành.

### Domain constraints
- Nội dung văn hóa/ngữ nghĩa phải chính xác; nội dung nháp cần người kiểm duyệt trước khi công bố.
- Dữ liệu trong Google Sheet được chia sẻ công khai dạng chỉ xem, nên không chứa thông tin riêng tư.
- Chất lượng phát âm phụ thuộc giọng tiếng Trung có sẵn trên thiết bị người học.

---

## 2. Feature List

| # | Tính năng | Mô tả | Ưu tiên |
|---|---|---|---|
| F1 | Trang chủ các con số | Hiển thị 5 con số, mỗi số kèm từ khóa văn hóa và tiến độ học của số đó | Core |
| F2 | Sơ đồ tư duy theo số | Con số ở trung tâm → nhánh ý nghĩa văn hóa → nhánh các thành ngữ; thành ngữ đã học/chưa học phân biệt rõ; dùng được trên điện thoại | Core |
| F3 | Thẻ chi tiết thành ngữ | Chữ Hán, pinyin, Hán Việt (tùy chọn), nghĩa từng chữ, nghĩa đen, nghĩa bóng, giải thích văn hóa liên hệ con số | Core |
| F4 | Đố vui bóc tách chữ | Lần lượt lật từng chữ → người học đoán nghĩa trước khi xem đáp án → giải thích văn hóa; có gợi ý theo nấc | Core |
| F5 | Tùy chọn hiển thị | Bật/tắt Hán Việt và pinyin; ghi nhớ lựa chọn trên máy | Core |
| F6 | Phát âm | Đọc từng chữ và cả thành ngữ bằng giọng trình duyệt; thông báo rõ khi thiết bị không có giọng tiếng Trung | Core |
| F7 | Tiến độ học cục bộ | Ghi nhận thành ngữ đã học/đã trả lời đúng; xóa tiến độ được | Core |
| F8 | Quản trị qua Google Sheets | Sheet mẫu: mỗi thành ngữ một dòng; thêm/sửa/xóa/ẩn bằng thao tác bảng tính; khóa tiêu đề, dropdown/checkbox, tô đỏ ô bắt buộc còn trống | Core |
| F9 | Hướng dẫn admin | Tài liệu ngắn bằng tiếng Việt: cách thêm, sửa, ẩn thành ngữ, phân quyền, sau bao lâu web cập nhật | Core |
| F10 | Chịu lỗi dữ liệu | Dòng sai/thiếu bị bỏ qua thay vì vỡ trang; có nơi báo dòng lỗi cho admin; dùng bản dữ liệu gần nhất khi không tải được sheet | Core |
| F11 | Nội dung khởi tạo | ~50 thành ngữ cho 5 số kèm ý nghĩa văn hóa từng số, đã được người dùng duyệt | Core |
| F12 | Responsive & deploy | Mọi màn hình có bố cục tối ưu cho cả điện thoại (cảm ứng, màn hẹp) và máy tính (chuột/bàn phím, màn rộng) — không màn nào là bản thu nhỏ/kéo giãn của màn kia; deploy trên hosting tĩnh miễn phí | Core |
| F13 | Chế độ ôn tập | Đố ngược (cho nghĩa → chọn thành ngữ), điền con số còn thiếu, ưu tiên ôn thành ngữ hay sai | Enhancement |
| F14 | Tìm kiếm / lọc | Tìm theo chữ Hán, pinyin, Hán Việt, nghĩa | Enhancement |
| F15 | Mở rộng số khác | Thêm số mới (vd 2, 5, 100) chỉ bằng dữ liệu, không sửa giao diện | Enhancement |

---

## 3. AI Integration Opportunities

| Tính năng AI | Vị trí | Giá trị |
|---|---|---|
| Soạn nháp nội dung (ngoài sản phẩm) | Khi chuẩn bị F11 và khi admin cần thêm thành ngữ | Nhanh chóng có nghĩa từng chữ, giải thích văn hóa, đáp án nhiễu cho đố vui. **Bắt buộc người duyệt** trước khi đưa vào sheet |

AI chạy trực tiếp trong web: **None identified**. Không có server nên không thể giữ API key an toàn, và cũng không cần để đạt mục tiêu sản phẩm.

---

## 4. Sprint / Milestone Plan

| Sprint | Phạm vi | Kết quả bàn giao |
|---|---|---|
| **S1 — Nền dữ liệu & duyệt nội dung (MVP xem được)** | F8, F10, F11 (bản nháp + duyệt), F1, F2, F3, F12 (deploy bản đầu) | Sheet mẫu có dữ liệu thật; web trực tuyến hiển thị trang chủ, sơ đồ tư duy, thẻ chi tiết từ Google Sheets |
| **S2 — Học chủ động** | F4, F5, F6 | Người học làm đố vui bóc tách chữ, bật/tắt Hán Việt/pinyin, nghe phát âm |
| **S3 — Ghi nhớ & ôn tập** | F7, F13 | Tiến độ được lưu và hiển thị trên trang chủ/sơ đồ; có chế độ ôn tập |
| **S4 — Hoàn thiện** | F9, F14, F15 (nếu kịp), polish giao diện/hiệu ứng, kiểm tra a11y & hiệu năng, đánh giá độc lập | Hướng dẫn admin; bản phát hành ổn định đạt NFR; báo cáo evaluator PASS |

Mỗi sprint sẽ có sprint contract riêng (tiêu chí chấp nhận cụ thể) trước khi code.

---

## 5. Non-Functional Requirements

- **Performance:** Trang chủ hiển thị nội dung trong ≤ 3 giây trên mạng 4G với ~50–200 thành ngữ; thao tác trong sơ đồ và đố vui phản hồi tức thì. Admin sửa sheet xong, người học thấy thay đổi trong vòng vài phút.
- **Security:** Không lưu bí mật/API key trong web. Sheet chỉ công khai quyền xem; quyền sửa chỉ cấp cho admin qua chia sẻ Google. Nội dung từ sheet không được phép chạy như mã trên trang.
- **i18n / l10n:** Giao diện tiếng Việt. Chữ Hán giản thể hiển thị đúng font trên mọi thiết bị phổ biến. Pinyin có dấu thanh chuẩn.
- **Accessibility:** Dùng được hoàn toàn bằng bàn phím; độ tương phản đạt WCAG AA; không chỉ dùng màu để biểu đạt trạng thái đúng/sai/đã học; tôn trọng cài đặt giảm chuyển động; nhãn rõ ràng cho trình đọc màn hình.
- **Observability:** Admin xem được danh sách dòng dữ liệu lỗi và lý do. Lỗi tải dữ liệu được thông báo thân thiện cho người học. Không thu thập analytics trong phạm vi này.
- **Chi phí:** Vận hành 0 đồng (hosting tĩnh miễn phí + Google Sheets).

---

## 6. Out of Scope

- Server/backend riêng, cơ sở dữ liệu riêng.
- Tài khoản người học, đồng bộ tiến độ nhiều thiết bị, bảng xếp hạng.
- Trang admin tự xây trong web (admin dùng trực tiếp Google Sheets).
- Người học đóng góp/gửi thành ngữ.
- Chữ phồn thể; giao diện ngôn ngữ khác tiếng Việt.
- Ghi âm giọng người thật hoặc dịch vụ phát âm trả phí.
- AI chạy trong web, chatbot.
- Ứng dụng di động native.

---

## 7. Open Questions (Tất cả đã chốt & phê duyệt)

| # | Câu hỏi | Quyết định được phê duyệt |
|---|---|---|
| Q1 | Nền tảng deploy miễn phí? | **GitHub Pages** (hoặc Cloudflare Pages dự phòng) |
| Q2 | Ai soạn và ai duyệt ~50 thành ngữ ban đầu? | AI soạn nháp đầy đủ, người dùng duyệt trên Google Sheet/file dữ liệu |
| Q3 | Tài khoản Google nào sở hữu sheet? | Tài khoản của người dùng; agent cung cấp file mẫu/template chuẩn |
| Q4 | Hán Việt mặc định bật hay tắt? | **Bật mặc định** (người học có thể tắt qua nút toggle) |
| Q5 | Đố vui MVP chỉ trắc nghiệm hay thêm dạng khác? | **Trắc nghiệm** ở S2; dạng ghép chữ/điền khuyết ở S3 |
| Q6 | Có cần yếu tố game hóa? | Không ở phiên bản này |
| Q7 | Ưu tiên thiết kế điện thoại hay máy tính? | **Cả hai ngang nhau (D7)**, bố cục chuyên biệt cho từng thiết bị |
| Q8 | Phong cách hình ảnh mong muốn? | Hiện đại kết hợp văn hóa Á Đông (màu son, mực nghiên, giấy xuyến, hỗ trợ dark mode) |
