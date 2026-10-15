# Book Finder

Dự án CV độc lập: React 19 + TypeScript strict + Vite + Tailwind CSS 4. Không cần backend, database, Docker hay API key. Thiết kế trực tiếp bằng CSS, không sử dụng Figma. Giao diện bằng tiếng Việt. Tên sách, tác giả, mô tả và chủ đề từ Open Library giữ nguyên ngôn ngữ nguồn.

## Chạy trên Windows

Yêu cầu Node.js 22.12+ (đã kiểm tra trên Node 24.14.1).

```powershell
cd D:\Xampp1\htdocs\BookFinderCV
npm.cmd ci
npm.cmd run dev
```

Mở địa chỉ Local Vite in trong terminal (mặc định http://127.0.0.1:5173). Dừng bằng Ctrl+C. Không cần bật Apache/XAMPP. Không mở index.html trực tiếp bằng file://.

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

Build xuất vào dist/. Preview mặc định http://127.0.0.1:4173. Không có cấu hình bí mật hoặc biến môi trường bắt buộc.

## Tính năng

- Tìm theo từ khóa, tên sách hoặc tác giả; submit rõ ràng giúp giảm số request.
- Phân trang 24 sách; lọc có bìa, từ năm 2000; sắp theo tên/năm.
- Lọc và sắp xếp phía client chỉ áp dụng trang hiện tại; có chú thích trên giao diện.
- Chi tiết bằng native dialog: Escape, giữ focus trong dialog, khôi phục focus sau khi đóng.
- Lưu/bỏ lưu vào localStorage; đọc lại sau reload; cảnh báo khi trình duyệt không cho lưu.
- Skeleton loading, timeout 15 giây, hủy request cũ, lỗi với nút thử lại, empty state, ảnh bìa lỗi và dữ liệu thiếu.
- Responsive 2/3/4/6 cột; semantic HTML, nhãn biểu mẫu, trạng thái aria, điều hướng bàn phím, reduced-motion.

## Cấu trúc

- src/App.tsx: tìm kiếm, trạng thái, phân trang và shelf.
- src/components/BookCard.tsx: thẻ sách và fallback ảnh.
- src/components/BookDetail.tsx: hộp thoại chi tiết và request work.
- src/lib/books.ts: types, API helper, lọc/sắp xếp, kiểm tra dữ liệu localStorage.
- src/lib/books.test.ts: unit tests với Vitest.
- src/index.css: Tailwind import, theme và responsive styling.
- vite.config.ts, tsconfig.json: cấu hình build và TypeScript.

## API và giới hạn

https://openlibrary.org/dev/docs/api/search
https://openlibrary.org/dev/docs/json_api
https://openlibrary.org/dev/docs/api/covers

Search: /search.json; details: /works/{id}.json; ảnh từ covers.openlibrary.org. Cần Internet. Dữ liệu có thể thiếu mô tả/ảnh/năm; UI hiển thị fallback, không tạo mô tả sách giả. Kết quả và số lượng phụ thuộc Open Library, có thể bị giới hạn tốc độ. localStorage chỉ lưu trong cùng trình duyệt và cùng origin/cổng, không đồng bộ giữa thiết bị. Hình sách trang trí ở hero là CSS, không phải kết quả API.

## Trước khi đưa vào CV

Tự thêm tên, liên kết GitHub/demo sau khi bạn chủ động tạo repo/deploy. Không có push hoặc deploy tự động. Có thể chụp ảnh màn hình, thêm vào README và chuẩn bị giải thích fetch/AbortController, React state, localStorage, responsive breakpoints. Các test hiện có kiểm tra logic tìm kiếm/lọc; không thay thế toàn bộ kiểm thử end-to-end trên thiết bị thật.

Gợi ý mô tả CV (điều chỉnh theo phần bạn thực sự hiểu và có thể trình bày):
“Built a responsive book discovery application with React, TypeScript and Tailwind CSS; integrated the Open Library API with pagination, loading/error states, book details and persistent favorites.”

Dự án được tạo riêng ở BookFinderCV; không sửa, di chuyển hoặc ghi đè dự án Baitaplon.

