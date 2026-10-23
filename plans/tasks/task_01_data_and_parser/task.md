# Task 1: Bộ 50 Thành ngữ & Module nạp dữ liệu

- **Trạng thái:** Completed (2026-10-23)
- **Mục tiêu:** Tạo file dữ liệu `data/seed_data.json` chứa 50 thành ngữ (5 số x 10 thành ngữ), cấu trúc mẫu Google Sheets, và module `js/data-service.js` nạp CSV/JSON chịu lỗi.
- **Phụ thuộc:** Không
- **Tiêu chí chấp nhận:**
  - 50 thành ngữ chuẩn xác, có đủ các trường: số, chữ Hán, pinyin, Hán Việt, phân tích từng chữ, nghĩa đen, nghĩa bóng, liên kết văn hóa.
  - `data-service.js` nạp từ link Google Sheet nếu có, nếu lỗi/mất mạng chuyển êm đẹp sang `seed_data.json`.
- **Chi tiết thực thi:** [implementation_prompt.md](./implementation_prompt.md)
