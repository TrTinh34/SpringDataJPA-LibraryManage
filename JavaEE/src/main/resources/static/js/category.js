const CATEGORY_API = "http://localhost:8085/api/categories";

const ITEMS_PER_PAGE = 7;
let currentPage = 1;
let allCategories = [];

$(document).ready(function () {

    loadCategories();

    $("#btnAddCategory").click(function () {
        $("#categoryForm")[0].reset();
        $("#categoryId").val("");
        $("#categoryModalTitle").text("Thêm Thể Loại");
    });

});


// =========================
// LOAD DANH SÁCH CATEGORY
// =========================

function loadCategories() {
    $.ajax({
        url: CATEGORY_API,
        type: "GET",
        success: function (categories) {
            allCategories = categories;
            currentPage = 1;
            renderPage();
        },
        error: function () {
            $("#categoryTableBody").html(`
                <tr>
                    <td colspan="2" class="text-center text-danger py-4">
                        Không thể tải dữ liệu!
                    </td>
                </tr>
            `);
        }
    });
}


// =========================
// PHÂN TRANG
// =========================

function renderPage() {
    const totalItems = allCategories.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = allCategories.slice(start, end);

    renderTable(pageItems, totalItems);
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const ul = $('.pagination');
    ul.empty();

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

$(document).on('click', '.pagination .page-link', function (e) {
    e.preventDefault();
    const page = parseInt($(this).data('page'));
    const totalPages = Math.ceil(allCategories.length / ITEMS_PER_PAGE);
    if (isNaN(page) || page < 1 || page > totalPages) return;
    currentPage = page;
    renderPage();
});


// =========================
// RENDER BẢNG
// =========================

function renderTable(categories, totalItems) {
    let tbody = $("#categoryTableBody");
    tbody.empty();

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    $("#categoryResultCount").text(`Tìm thấy ${totalItems} kết quả`);
    $("#pageInfo").text(
        totalItems === 0
            ? 'Không có mục nào'
            : `Hiển thị ${start} đến ${end} trong số ${totalItems} mục`
    );

    if (categories.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="2" class="text-center text-muted py-4">
                    Không có thể loại nào
                </td>
            </tr>
        `);
        return;
    }

    categories.forEach(c => {
        tbody.append(`
            <tr>
                <td class="fw-bold">${c.name}</td>
                <td class="text-center">
                    <button class="btn-action-soft btn-edit-soft btn-edit"
                        data-id="${c.id}"
                        data-name="${c.name}">
                        <i class="far fa-edit"></i> Sửa
                    </button>
                    <button class="btn-action-soft btn-delete-soft btn-delete"
                        data-id="${c.id}">
                        <i class="far fa-trash-alt"></i> Xóa
                    </button>
                </td>
            </tr>
        `);
    });
}


// =========================
// THÊM / SỬA CATEGORY
// =========================

$("#btnSaveCategory").click(function () {
    let id = $("#categoryId").val();
    let categoryName = $("#categoryName").val().trim();

    if (categoryName === "") {
        alert("Vui lòng nhập tên thể loại!");
        return;
    }

    let method = id ? "PUT" : "POST";
    let url = id ? `${CATEGORY_API}/${id}` : CATEGORY_API;

    $.ajax({
        url: url,
        type: method,
        contentType: "application/json",
        data: JSON.stringify({ name: categoryName }),
        success: function () {
            alert(id ? "Cập nhật thể loại thành công!" : "Thêm thể loại thành công!");
            $("#categoryModal").modal("hide");
            loadCategories();
        },
        error: function (xhr) {
            alert(xhr.responseText || "Có lỗi xảy ra!");
        }
    });
});


// =========================
// ĐỔ DỮ LIỆU LÊN FORM SỬA
// =========================

$(document).on("click", ".btn-edit", function () {
    $("#categoryId").val($(this).data("id"));
    $("#categoryName").val($(this).data("name"));
    $("#categoryModalTitle").text("Chỉnh Sửa Thể Loại");
    $("#categoryModal").modal("show");
});


// =========================
// XÓA CATEGORY
// =========================

$(document).on("click", ".btn-delete", function () {
    let id = $(this).data("id");

    if (!confirm("Bạn có chắc muốn xóa thể loại này?")) return;

    $.ajax({
        url: `${CATEGORY_API}/${id}`,
        type: "DELETE",
        success: function () {
            alert("Xóa thể loại thành công!");
            loadCategories();
        },
        error: function (xhr) {
            alert(xhr.responseText || "Không thể xóa thể loại!");
        }
    });
});


// =========================
// TÌM KIẾM CLIENT-SIDE
// =========================

$("#searchCategory").on("keyup", function () {
    const keyword = $(this).val().toLowerCase().trim();

    if (keyword === "") {
        // Không có keyword: hiển thị lại toàn bộ với phân trang
        currentPage = 1;
        renderPage();
        return;
    }

    // Có keyword: lọc từ allCategories rồi render trực tiếp (không phân trang khi đang search)
    const filtered = allCategories.filter(c =>
        c.name.toLowerCase().includes(keyword)
    );

    const tbody = $("#categoryTableBody");
    tbody.empty();

    $("#categoryResultCount").text(`Tìm thấy ${filtered.length} kết quả`);
    $("#pageInfo").text(`Hiển thị ${filtered.length} mục`);
    $(".pagination").empty(); // Ẩn pagination khi đang search

    if (filtered.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="2" class="text-center text-muted py-4">
                    Không tìm thấy thể loại nào!
                </td>
            </tr>
        `);
        return;
    }

    filtered.forEach(c => {
        tbody.append(`
            <tr>
                <td class="fw-bold">${c.name}</td>
                <td class="text-center">
                    <button class="btn-action-soft btn-edit-soft btn-edit"
                        data-id="${c.id}" data-name="${c.name}">
                        <i class="far fa-edit"></i> Sửa
                    </button>
                    <button class="btn-action-soft btn-delete-soft btn-delete"
                        data-id="${c.id}">
                        <i class="far fa-trash-alt"></i> Xóa
                    </button>
                </td>
            </tr>
        `);
    });
});