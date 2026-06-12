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

    function loadCategories() {
        $.ajax({
            url: CATEGORY_API_URL,
            type: "GET",
            success: function(categories) {
                let filterSelect = $('#categoryFilter');
                let formSelect = $('#bookCategory');

                filterSelect.find('option:not(:first)').remove();
                formSelect.empty();

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

    function loadBooks() {
        let keyword = $('#searchInput').val().trim();
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
        else if (keyword !== "" || categoryId !== "") {
            url = `${API_URL}/search`;
            data = {
                keyword: keyword !== "" ? keyword : null,
                categoryId: categoryId !== "" ? categoryId : null
            };
        }

        $.ajax({
            url: url,
            type: "GET",
            data: data,
            success: function(books) {
                allBooks = books;
                currentPage = 1;
                renderPage();
            },
            error: function(err) {
                console.error("Lỗi tải sách: ", err);
                $('#bookTableBody').html('<tr><td colspan="7" class="text-center text-danger py-4">Không thể kết nối đến máy chủ!</td></tr>');
            }
        });
    }

    function deleteBook(id) {
        if (confirm("Bạn có chắc chắn muốn xóa cuốn sách này không? Hành động này không thể hoàn tác.")) {
            $.ajax({
                url: `${API_URL}/${id}`,
                type: "DELETE",
                success: function() {
                    alert("Xóa sách thành công!");
                    loadBooks();
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

    function renderPage() {
        const totalItems = allBooks.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageBooks = allBooks.slice(start, end);

        renderTable(pageBooks, totalItems);
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const ul = $('.pagination');
        ul.empty();

        if(totalPages <= 1) return;

        ul.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `);

        for (let i = 1; i <= totalPages; i++) {
            ul.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        ul.append(`
            <li class="page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `);
    }

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

        if (!categoryName) return '<span class="badge-category" style="background-color: #e2e8f0; color: #334155;">Chưa phân loại</span>';
        if (categoryName.includes("Văn học")) { bg = "#dbeafe"; color = "#1e40af"; }
        else if (categoryName.includes("Lịch sử")) { bg = "#1e3a8a"; color = "#ffffff"; }
        else if (categoryName.includes("Tâm lý")) { bg = "#1e3a8a"; color = "#ffffff"; }
        else if (categoryName.includes("Công nghệ") || categoryName.includes("CNTT")) { bg = "#d1fae5"; color = "#047857"; }

        return `<span class="badge-category" style="background-color: ${bg}; color: ${color};">${categoryName}</span>`;
    }

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
            let catName = book.categoryName || (book.category ? book.category.name : "Chưa có");
            let catId = book.categoryId || (book.category ? book.category.id : "");

            let coverImage = book.imageUrl ? book.imageUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=random&color=fff&size=150&font-size=0.4&length=2`;

            let tr = `
                <tr class="align-middle">
                    <td class="text-center">
                        <img src="${coverImage}" alt="${book.title}" class="book-thumbnail">
                    </td>
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
                            data-category="${catId}"
                            data-image="${book.imageUrl || ''}">
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

    let typingTimer;
    $('#searchInput').on('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(loadBooks, 400);
    });

    $('#categoryFilter, #sortBy').change(function() {
        loadBooks();
    });

    $('#btnAddBook').click(function() {
        $('#modalTitle').text('Thêm Sách Mới');
        $('#bookForm')[0].reset();
        $('#bookId').val('');
        $('#bookImage').val(''); // Reset luôn cả ô ảnh
    });

    $('#bookTableBody').on('click', '.btn-edit', function() {
        let btn = $(this);
        $('#modalTitle').text('Chỉnh Sửa Sách');
        $('#bookId').val(btn.data('id'));
        $('#bookTitle').val(btn.data('title'));
        $('#bookAuthor').val(btn.data('author'));
        $('#bookYear').val(btn.data('year'));
        $('#bookPrice').val(btn.data('price'));
        $('#bookCategory').val(btn.data('category'));

        // ĐÃ SỬA: Lấy link ảnh từ nút bấm đổ vào form
        $('#bookImage').val(btn.data('image'));

        $('#bookModal').modal('show');
    });

    $('#bookTableBody').on('click', '.btn-delete', function() {
        let id = $(this).data('id');
        deleteBook(id);
    });

    $('#btnSaveBook').click(function() {
        let id = $('#bookId').val();

        let bookData = {
            title: $('#bookTitle').val(),
            author: $('#bookAuthor').val(),
            publishYear: parseInt($('#bookYear').val()),
            price: parseFloat($('#bookPrice').val()),
            categoryId: parseInt($('#bookCategory').val()),

            // ĐÃ SỬA: Lấy dữ liệu link ảnh từ form để gửi xuống DB
            imageUrl: $('#bookImage').val()
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
                loadBooks();
            },
            error: function(err) {
                alert("Lưu thất bại! Vui lòng kiểm tra lại log.");
                console.error(err);
            }
        });
    });
});