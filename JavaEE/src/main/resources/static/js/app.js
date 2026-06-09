// URL mặc định của Backend (đang chạy cổng 8085 như bạn đã cấu hình)
const API_URL = "http://localhost:8085/api/books";
const CATEGORY_API_URL = "http://localhost:8085/api/categories";

// ---------------------------------------------------------------- //
// CẤU HÌNH PHÂN TRANG
// ---------------------------------------------------------------- //
const ITEMS_PER_PAGE = 7;
let currentPage = 1;
let allBooks = []; // Lưu toàn bộ sách sau khi fetch về

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

        let keyword = $('#searchInput').val();
        let categoryId = $('#categoryFilter').val();
        let sort = $('#sortBy').val();

        let url = API_URL;
        let data = {};

        if (sort === "title_asc") {
            url = `${API_URL}/sort/title`;
        }
        else if (sort === "price_asc") {
            url = `${API_URL}/sort/price`;
        }
        else if (keyword || categoryId) {
            url = `${API_URL}/search`;
            data = {
                keyword: keyword,
                categoryId: categoryId
            };
        }

        $.ajax({
            url: url,
            type: "GET",
            data: data,
            success: function(books) {
                allBooks = books;       // Lưu toàn bộ sách
                currentPage = 1;       // Reset về trang 1 mỗi khi load mới
                renderPage();
            },
            error: function(err) {
                console.error(err);
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
    // CÁC HÀM PHÂN TRANG
    // ---------------------------------------------------------------- //

    // Render đúng trang hiện tại từ allBooks
    function renderPage() {
        const totalItems = allBooks.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        // Tính slice
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageBooks = allBooks.slice(start, end);

        // Render bảng
        renderTable(pageBooks, totalItems);

        // Render pagination buttons
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const ul = $('.pagination');
        ul.empty();

        // Nút prev
        ul.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `);

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            ul.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Nút next
        ul.append(`
            <li class="page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `);
    }

    // Bắt sự kiện click phân trang (delegate vì render động)
    $(document).on('click', '.pagination .page-link', function(e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        const totalPages = Math.ceil(allBooks.length / ITEMS_PER_PAGE);
        if (isNaN(page) || page < 1 || page > totalPages) return;
        currentPage = page;
        renderPage();
    });

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

    // Nhận thêm tham số totalItems để hiển thị đúng thông tin
    function renderTable(books, totalItems) {
        let tbody = $('#bookTableBody');
        tbody.empty();

        const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

        $('#resultCount').text(`Tìm thấy ${totalItems} kết quả`);
        $('#pageInfo').text(
            totalItems === 0
                ? 'Không có mục nào'
                : `Hiển thị ${start} đến ${end} trong số ${totalItems} mục`
        );

        if (books.length === 0) {
            tbody.append('<tr><td colspan="7" class="text-center text-muted py-4">Không tìm thấy cuốn sách nào!</td></tr>');
            return;
        }

        books.forEach(book => {
            let catName = book.categoryName;

            let tr = `
                <tr>
<!--                    <td class="text-center text-muted">${book.id}</td>-->
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
                            data-category="${book.categoryId}">
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

        let bookData = {
            title: $('#bookTitle').val(),
            author: $('#bookAuthor').val(),
            publishYear: parseInt($('#bookYear').val()),
            price: parseFloat($('#bookPrice').val()),
            categoryId: parseInt($('#bookCategory').val())
        };

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