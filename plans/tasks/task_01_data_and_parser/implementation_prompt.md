# Implementation Prompt — Task 1: Bộ 50 Thành ngữ & Data Service

## 1. Phạm vi
- Tạo file `data/seed_data.json` chứa thông tin 5 con số (1, 3, 8, 9, 10) và 50 thành ngữ (mỗi số 10 thành ngữ đặc sắc).
- Tạo file `data/sheets_template.csv` làm mẫu cho người dùng copy vào Google Sheets.
- Viết `js/data-service.js` với các hàm `fetchIdiomData()`, `getIdiomsByNumber(number)`, `getNumbersSummary()`.

## 2. Quy tắc bắt buộc
- Tuyệt đối không dùng thư viện ngoài; dùng ES Module thuần.
- Chịu lỗi: try/catch đầy đủ, parse CSV an toàn kể cả khi có dấu phẩy trong nội dung bọc ngoặc kép.
- Dữ liệu chữ Hán, Pinyin phải có thanh điệu chuẩn (`jiǔ niú yī máo`).

## 3. Xác minh
- Chạy node hoặc script kiểm tra tính hợp lệ của `seed_data.json` và cấu trúc đủ 50 items.
- Không chuyển sang task tiếp theo sau khi hoàn thành.
