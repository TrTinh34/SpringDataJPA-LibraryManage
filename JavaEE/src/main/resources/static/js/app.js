// URL mặc định của Backend (đang chạy cổng 8085 như bạn đã cấu hình)
const API_URL = "http://localhost:8085/api/books";
const CATEGORY_API_URL = "http://localhost:8085/api/categories";

$(document).ready(function() {

    // 1. Khởi tạo: Load Thể loại và Load Sách ngay khi mở trang
    loadCategories();
    loadBooks();

    // ---------------------------------------------------------------- //
    // CÁC HÀM GỌI API (AJAX)
    // ---------------------------------------------------------------- //

    // Hàm load danh sách thể loại từ Backend để đổ vào 2 Dropdown (Lọc và Form Thêm/Sửa)
    function loadCategories() {
        $.ajax({
            url: CATEGORY_API_URL,
            type: "GET",
            success: function(categories) {
                let filterSelect = $('#categoryFilter');
                let formSelect = $('#bookCategory');

                // Xóa option cũ
                filterSelect.find('option:not(:first)').remove();
                formSelect.empty();

                // Đổ dữ liệu mới
                categories.forEach(c => {
                    filterSelect.append(`<option value="${c.id}">${c.name}</option>`);
                    formSelect.append(`<option value="${c.id}">${c.name}</option>`);
                });
            },
            error: function(err) {
                console.error("Lỗi khi tải danh sách thể loại:", err);
            }
        });
    }

    // Hàm load danh sách sách (Có kèm tham số Tìm kiếm, Lọc, Sắp xếp)
    function loadBooks() {
        let title = $('#searchInput').val();
        let categoryId = $('#categoryFilter').val();
        let sort = $('#sortBy').val();

        $.ajax({
            url: API_URL,
            type: "GET",
            data: {
                title: title,
                categoryId: categoryId,
                sort: sort
            },
            success: function(books) {
                renderTable(books);
            },
            error: function(err) {
                console.error("Lỗi khi tải dữ liệu sách:", err);
                $('#bookTableBody').html('<tr><td colspan="7" class="text-center text-danger py-4">Không thể kết nối đến máy chủ!</td></tr>');
            }
        });
    }

    // Hàm Xóa sách
    function deleteBook(id) {
        if (confirm("Bạn có chắc chắn muốn xóa cuốn sách này không? Hành động này không thể hoàn tác.")) {
            $.ajax({
                url: `${API_URL}/${id}`,
                type: "DELETE",
                success: function() {
                    alert("Xóa sách thành công!");
                    loadBooks(); // Tải lại bảng sau khi xóa
                },
                error: function(err) {
                    alert("Có lỗi xảy ra khi xóa sách!");
                    console.error(err);
                }
            });
        }
    }

    // ---------------------------------------------------------------- //
    // CÁC HÀM XỬ LÝ GIAO DIỆN & SỰ KIỆN
    // ---------------------------------------------------------------- //

    function getCategoryBadge(categoryName) {
        let bg = "#e2e8f0";
        let color = "#334155";

        if (!categoryName) return '';
        if (categoryName.includes("Văn học")) { bg = "#dbeafe"; color = "#1e40af"; }
        else if (categoryName.includes("Lịch sử")) { bg = "#1e3a8a"; color = "#ffffff"; }
        else if (categoryName.includes("Tâm lý")) { bg = "#1e3a8a"; color = "#ffffff"; }
        else if (categoryName.includes("Công nghệ") || categoryName.includes("CNTT")) { bg = "#d1fae5"; color = "#047857"; }

        return `<span class="badge-category" style="background-color: ${bg}; color: ${color};">${categoryName}</span>`;
    }

    function renderTable(books) {
        let tbody = $('#bookTableBody');
        tbody.empty();

        $('#resultCount').text(`Tìm thấy ${books.length} kết quả`);
        $('#pageInfo').text(`Hiển thị 1 đến ${books.length} trong số ${books.length} mục`);

        if (books.length === 0) {
            tbody.append('<tr><td colspan="7" class="text-center text-muted py-4">Không tìm thấy cuốn sách nào!</td></tr>');
            return;
        }

        books.forEach(book => {
            // Xử lý trường hợp backend trả về category là Object hoặc tên chuỗi
            let catName = book.category ? book.category.name : book.categoryName;

            let tr = `
                <tr>
                    <td class="text-center text-muted">${book.id}</td>
                    <td class="fw-bold" style="color: #1e293b;">${book.title}</td>
                    <td><div style="max-width: 150px; white-space: normal;">${book.author}</div></td>
                    <td class="text-center">${book.publishYear}</td>
                    <td class="price-text">${book.price.toLocaleString('vi-VN')} đ</td>
                    <td>${getCategoryBadge(catName)}</td>
                    <td class="text-center">
                        <button class="btn-action-soft btn-edit-soft btn-edit" 
                            data-id="${book.id}" 
                            data-title="${book.title}" 
                            data-author="${book.author}" 
                            data-year="${book.publishYear}" 
                            data-price="${book.price}" 
                            data-category="${book.category ? book.category.id : book.categoryId}">
                            <i class="far fa-edit"></i> Sửa
                        </button>
                        <button class="btn-action-soft btn-delete-soft btn-delete" data-id="${book.id}">
                            <i class="far fa-trash-alt"></i> Xóa
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(tr);
        });
    }

    // Bắt sự kiện Auto-search (Delay 400ms khi gõ)
    let typingTimer;
    $('#searchInput').on('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(loadBooks, 400);
    });

    // Bắt sự kiện thay đổi Dropdown Lọc và Sắp xếp
    $('#categoryFilter, #sortBy').change(function() {
        loadBooks();
    });

    // Bắt sự kiện click nút Thêm Mới (Reset Form)
    $('#btnAddBook').click(function() {
        $('#modalTitle').text('Thêm Sách Mới');
        $('#bookForm')[0].reset();
        $('#bookId').val(''); // Clear ID để biết là thêm mới
    });

    // Bắt sự kiện click nút Sửa (Đổ dữ liệu lên Form)
    // Dùng sự kiện delegate (on) vì nút này được render động bằng JS
    $('#bookTableBody').on('click', '.btn-edit', function() {
        let btn = $(this);
        $('#modalTitle').text('Chỉnh Sửa Sách');
        $('#bookId').val(btn.data('id'));
        $('#bookTitle').val(btn.data('title'));
        $('#bookAuthor').val(btn.data('author'));
        $('#bookYear').val(btn.data('year'));
        $('#bookPrice').val(btn.data('price'));
        $('#bookCategory').val(btn.data('category'));

        // Mở Modal
        $('#bookModal').modal('show');
    });

    // Bắt sự kiện click nút Xóa
    $('#bookTableBody').on('click', '.btn-delete', function() {
        let id = $(this).data('id');
        deleteBook(id);
    });

    // Bắt sự kiện click Lưu Sách (Xử lý chung cho cả Thêm và Sửa)
    $('#btnSaveBook').click(function() {
        let id = $('#bookId').val();

        // Cấu trúc dữ liệu JSON gửi xuống Backend
        let bookData = {
            title: $('#bookTitle').val(),
            author: $('#bookAuthor').val(),
            publishYear: parseInt($('#bookYear').val()),
            price: parseFloat($('#bookPrice').val()),
            category: { id: parseInt($('#bookCategory').val()) }
        };

        // Nếu có ID thì gọi API PUT (Cập nhật), ngược lại gọi POST (Thêm mới)
        let method = id ? "PUT" : "POST";
        let url = id ? `${API_URL}/${id}` : API_URL;

        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(bookData),
            success: function(response) {
                alert(id ? "Cập nhật thành công!" : "Thêm sách mới thành công!");
                $('#bookModal').modal('hide');
                loadBooks(); // Tải lại bảng
            },
            error: function(err) {
                alert("Lưu thất bại! Vui lòng kiểm tra lại log.");
                console.error(err);
            }
        });
    });
});