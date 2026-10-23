# Implementation Prompt — Task 4: Kiểm thử & Deploy Checklist

## 1. Phạm vi
- Viết tài liệu `docs/google_sheets_guide.md` hướng dẫn cách tạo Google Sheet từ file mẫu, publish link CSV, và dán ID vào web.
- Kiểm tra toàn bộ UI trên các kích thước (375px mobile, 768px tablet, 1440px desktop).
- Kiểm tra trạng thái offline / ngắt mạng: web vẫn nạp dữ liệu từ seed data mà không bị crash.
- Chạy đánh giá evaluator độc lập.

## 2. Quy tắc bắt buộc
- Đảm bảo các đường dẫn tương đối (relative paths) để khi đưa vào subpath của GitHub Pages (`https://username.github.io/learn_chiness/`) web không bị lỗi 404 hình ảnh, script hay css.

## 3. Xác minh
- Mở web bằng browser test, ghi lại bằng chứng, tổng kết bàn giao.
