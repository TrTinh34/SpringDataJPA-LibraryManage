# Dự Án Quản Lý Thư Viện (Library Management System)

Dự án ứng dụng Web Quản lý Thư viện được xây dựng dựa trên kiến trúc Spring Boot (Backend) kết hợp cùng Thymeleaf và AJAX (Frontend), sử dụng hệ quản trị cơ sở dữ liệu Microsoft SQL Server.

---

## 🚀 Các Tính Năng Chính

### 📚 Quản Lý Sách (Books)
* **Xem danh sách:** Hiển thị danh sách sách trực quan kết hợp phân trang dữ liệu mượt mà.
* **Tìm kiếm nâng cao:** Tìm kiếm sách theo tên thời gian thực bằng công nghệ **AJAX ngầm**, không load lại trang.
* **Bộ lọc chuyên sâu:** Lọc danh sách sách theo Thể loại (Category).
* **Sắp xếp linh hoạt:** Hỗ trợ sắp xếp danh sách sách theo Tên, Giá tiền và Năm xuất bản (Tăng/Giảm dần).
* **Quản lý dữ liệu (CRUD):** Thêm mới sách (hỗ trợ upload ảnh bìa), Sửa thông tin sách và Xóa sách.

### 🗂️ Quản Lý Thể Loại (Categories)
* **Xem danh sách:** Hiển thị toàn bộ các danh mục/thể loại sách hiện có.
* **Tìm kiếm cục bộ:** Bộ lọc tìm kiếm nhanh thể loại ngay tại Client-side.
* **Quản lý dữ liệu (CRUD):** Thêm mới thể loại, Thay đổi tên thể loại.
* **Ràng buộc dữ liệu thông minh:** Ngăn chặn hành vi xóa Thể loại nếu vẫn còn Sách thuộc thể loại đó bên trong Database để bảo toàn tính toàn vẹn dữ liệu.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

* **Backend:** Spring Boot v4.0.6, Spring Data JPA, Hibernate ORM
* **Ngôn ngữ:** Java 17
* **Frontend:** Thymeleaf Template Engine, HTML5/CSS3, Bootstrap, JavaScript (jQuery & AJAX)
* **Cơ sở dữ liệu:** Microsoft SQL Server (MSSQL)
* **Quản lý dự án:** Maven

---

## 📋 Yêu Cầu Hệ Thống

Trước khi chạy ứng dụng, hãy đảm bảo máy tính đã cài đặt sẵn các công cụ sau:
* **Java Development Kit (JDK):** Phiên bản 17
* **Apache Maven:** Phiên bản 3.8 trở lên
* **Hệ quản trị CSDL:** Microsoft SQL Server (đang bật cổng `1433`)
* **Công cụ quản lý:** SQL Server Management Studio (SSMS)
* **IDE khuyên dùng:** IntelliJ IDEA hoặc Eclipse

---

## ⚙️ Hướng Dẫn Cài Đặt và Chạy Ứng Dụng

### Bước 1: Khởi Tạo Cơ Sở Dữ Liệu
1. Mở phần mềm **SQL Server Management Studio (SSMS)** và kết nối vào Server của bạn.
2. Mở file script SQL gửi kèm (`backup_database.sql`) hoặc tạo một Query mới.
3. Chạy câu lệnh tạo database và dữ liệu mẫu có sẵn trong file script để cấu trúc hệ thống khớp hoàn toàn với dự án.

> *Lưu ý: Hệ thống đang sử dụng tài khoản kết nối mặc định dưới đây:*
> * **Database Name:** `LibraryDB`
> * **Username:** `sa`
> * **Password:** `1`
> * **Port:** `1433`
>
> *(Nếu tài khoản SQL Server của bạn khác với thông tin trên, vui lòng chỉnh sửa lại tại file `src/main/resources/application.properties` trước khi chạy).*

### Bước 2: Tải Các Thư Viện Cần Thiết
Mở terminal/cmd tại thư mục gốc của dự án (nơi có file `pom.xml`) và chạy lệnh cài đặt để Maven tải các dependency (`mssql-jdbc`, `lombok`, `jpa`...):
```bash
mvn clean install