# StudyPath AI – Course Catalog (Danh sách học phần)

Bài kiểm tra giữa kỳ – Học phần **Phát triển ứng dụng Web cơ bản (CSE122)**.

## Tên đề tài

**StudyPath AI** – Hệ thống web hỗ trợ sinh viên lập lộ trình học tập (nguyên mẫu frontend: HTML/CSS/JS, dữ liệu giả lập).

## Tên trang đã thực hiện

**Course Catalog – Danh sách học phần** (`visitor-course-catalog`), trang chính của vai trò **Khách**.

## Mục đích của trang

Cho phép người dùng (khách chưa đăng nhập) **tra cứu chương trình và học phần**: xem danh sách các học phần của chương trình đào tạo, tìm kiếm nhanh theo tên/mã học phần, lọc theo nhóm học phần — từ đó khách nắm được khối lượng kiến thức trước khi đăng ký dùng StudyPath AI.

## Các chức năng chính

- [x] Hiển thị danh sách học phần (render từ mảng dữ liệu JavaScript, 12 học phần / 4 chương trình).
- [x] Tìm kiếm học phần theo tên/mã (nhập tức thì, không cần tải lại trang).
- [x] Lọc học phần theo chương trình / số tín chỉ / trạng thái.
- [x] Phân trang (6 học phần mỗi trang).
- [x] Trạng thái đang tải (skeleton) và trạng thái rỗng kèm nút "Đặt lại bộ lọc".
- [x] Modal xem chi tiết học phần (mở/đóng bằng nút, bấm nền hoặc phím Esc).
- [x] Responsive: hiển thị tốt trên Desktop và Mobile (lưới 2 cột → 1 cột, ẩn sidebar trên tablet/mobile).

## Công nghệ sử dụng

- **HTML5** – semantic HTML (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `form`, `label`, `select`, `button`).
- **CSS3** – biến CSS (design token), Flexbox, CSS Grid, hover, media query (responsive). Dùng `base.css` (design system dùng chung của nhóm StudyPath AI) + `style.css` riêng của trang.
- **JavaScript (vanilla)** – DOM, `getElementById`, `querySelector`, event `input`/`change`/`submit`/`click`, render dữ liệu từ mảng bằng `innerHTML`/`textContent`, `classList`, `let`/`const`, function, loop, `if/else`.
- Không dùng framework, không backend (theo phạm vi đề bài).

## Link Figma

https://www.figma.com/design/BaIlOa6PACas0eaH4sfcHA/Danh-m%E1%BB%A5c-h%E1%BB%8Dc-ph%E1%BA%A7n---Kh%C3%A1ch

## Link video

> TODO: *(dán link video ~3 phút sau khi quay; tên video: `CSE122-GK-SV01-HoTrungAnh-CourseCatalog`)*

## Link GitHub

https://github.com/trunganhh2530-crypto/cse122-gk-course-catalog
