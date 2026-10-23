# Hướng Dẫn Quản Trị Thành Ngữ Bằng Google Sheets

Tài liệu hướng dẫn quản trị viên (Admin) tự do thêm, sửa, xóa thành ngữ tiếng Trung trên Google Sheets mà không cần cài đặt máy chủ hay biết lập trình.

---

## 1. Cách Tạo Google Sheet Từ Bản Mẫu

1. Mở [Google Sheets](https://sheets.new) trên trình duyệt.
2. Tạo 2 trang tính (Tabs) với tên chính xác:
   - **Tab 1:** `So`
   - **Tab 2:** `ThanhNgu`
3. Nhập dữ liệu ban đầu:
   - Vào menu **Tệp (File) > Nhập (Import) > Tải lên (Upload)**.
   - Chọn file [data/template_so.csv](../data/template_so.csv) đưa vào tab `So`.
   - Với tab `ThanhNgu`, bạn có thể điền các cột theo cấu trúc chuẩn bên dưới.

---

## 2. Cấu Trúc Các Cột Trong Tab `ThanhNgu`

Mỗi thành ngữ nằm trọn vẹn trên **1 dòng**. Hệ thống **hỗ trợ độ dài chữ tùy ý** (3 chữ, 4 chữ, 5 chữ, 6 chữ, 8 chữ...):

| Tên cột | Bắt buộc | Ý nghĩa | Ví dụ |
|---|---|---|---|
| `hien` | Có | `TRUE` (hiển thị) hoặc `FALSE` (tạm ẩn) | `TRUE` |
| `chu_han` | Có | Chữ Hán thành ngữ (**độ dài tùy ý**: 4 chữ, 5 chữ, 6 chữ...) | `九牛一毛` hoặc `八字没一撇` (5 chữ) |
| `pinyin` | Có | Bính âm toàn câu có dấu thanh | `jiǔ niú yī máo` |
| `han_viet` | Có | Âm Hán Việt tương ứng | `Cửu ngưu nhất mao` |
| `so_chinh` | Có | Con số chủ đạo (1, 3, 8, 9, 10) | `9` |
| `so_lien_quan` | Không | Các số khác xuất hiện trong câu | `9, 1` |
| `nhanh_van_hoa` | Có | Tên nhánh trong sơ đồ tư duy | `Vô hạn & Cực đại` |
| `nghia_tung_chu` | Khuyên dùng | Nghĩa gốc từng chữ, ngăn cách bằng dấu `\|` hoặc `,` (**tự động khớp với số chữ Hán**) | `Chín \| Trâu \| Một \| Lông` |
| *(Tùy chọn phụ)* `nghia_1` .. `N` | Không | Có thể chia thành từng cột nếu muốn | `nghia_1`: Chín, `nghia_2`: Trâu... |
| `nghia_den` | Có | Nghĩa ghép bề mặt | `Một sợi lông nhỏ trên chín con trâu to` |
| `nghia_bong` | Có | Nghĩa bóng, ứng dụng thực tế | `Rất nhỏ bé, không đáng kể trong tổng thể` |
| `van_hoa` | Có | Giải thích triết lý con số | `Số 9 là số cực đại, tượng trưng cho số nhiều...` |
| `cau_hoi` | Có | Câu hỏi đố vui bóc tách | `Thành ngữ này có nghĩa là gì?` |
| `dap_an_dung` | Có | Đáp án chính xác | `Rất nhỏ bé, không đáng kể` |
| `sai_1` .. `sai_3`| Có | 3 đáp án gây nhiễu | `Rất mạnh mẽ`, `Chín con trâu`, `Của hiếm` |

> [!NOTE]
> **Web tự động tách chữ:** Admin **không cần** phải gõ lại từng chữ Hán vào các cột `chu_1, chu_2...`. Hệ thống sẽ tự động bóc tách từng chữ trong `chu_han` và ghép tương ứng với nghĩa trong `nghia_tung_chu`. Thành ngữ dài bao nhiêu chữ thì trên giao diện sẽ hiện bấy nhiêu ô bóc tách.

---

## 3. Cách Chia Sẻ & Kết Nối Với Web

1. Nhấp nút **Chia sẻ (Share)** ở góc trên bên phải Google Sheet.
2. Tại mục **Quyền truy cập chung (General access)**, chọn: **"Bất kỳ ai có đường liên kết" (Anyone with the link)** và quyền là **"Người xem" (Viewer)**.
3. Sao chép **Sheet ID** trên thanh địa chỉ trình duyệt:
   - Link: `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`**`/edit`
   - Đoạn in đậm chính là **Sheet ID**.
4. Mở trang web học thành ngữ, nhấp nút **🔗 Sheet** trên thanh điều hướng, dán Sheet ID và bấm **Lưu & Tải lại**.

---

## 4. Cơ Chế Chịu Lỗi & An Toàn

- **Bảo mật:** Quyền "Người xem" chỉ cho phép web đọc nội dung, không ai có thể can thiệp phá hỏng bảng tính của bạn.
- **Chống lỗi:** Nếu bạn gõ thiếu cột hoặc sai định dạng ở một dòng nào đó, web sẽ tự động bỏ qua dòng lỗi đó mà không làm sập trang.
- **Hoạt động Offline:** Nếu mất mạng hoặc Google Sheets bị nghẽn, trang web tự động chuyển sang dữ liệu dự phòng nội bộ.
