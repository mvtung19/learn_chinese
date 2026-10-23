# Implementation Prompt — Task 3: Mindmap & Modal bóc tách

## 1. Phạm vi
- Viết `js/mindmap.js`: Tính toán layout cây node, vẽ đường cong Bezier mềm mại kết nối các nhánh, gán sự kiện click/hover.
- Tạo view thay thế dạng List view (dành cho mobile hoặc người thích đọc tuần tự) có thể chuyển đổi bằng nút bấm.
- Viết `js/detail-modal.js`: Bóc tách 4 chữ Hán thành 4 ô trực quan, phía trên là chữ Hán + Pinyin, phía dưới là nghĩa Hán Việt và nghĩa chữ.
- Hỗ trợ đóng mở bằng phím ESC và click ra ngoài backdrop.

## 2. Quy tắc bắt buộc
- Bố cục Mindmap không được bị tràn x-scroll mất kiểm soát; phải có viewBox và auto-scale.
- Trên Mobile, modal hiển thị dạng Bottom Sheet trượt từ dưới lên (kéo vuốt đóng được).

## 3. Xác minh
- Mở từng con số (1, 3, 8, 9, 10), xác nhận các thành ngữ hiển thị đúng nhánh văn hóa.
- Bấm vào thành ngữ xem modal hiển thị đúng nghĩa từng chữ.
