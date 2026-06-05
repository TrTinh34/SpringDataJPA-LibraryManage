package com.example.javaee.repository;

import com.example.javaee.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.math.BigDecimal;
@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    // Tìm theo tên (đã có)
    List<Book> findByTitleContainingIgnoreCase(String keyword);

    // Lọc theo thể loại (đã có)
    List<Book> findByCategoryId(Integer categoryId);

    // Tìm theo tác giả (đã có)
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // ===== CẦN BỔ SUNG =====

    // Lọc theo khoảng giá
    List<Book> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Lọc theo khoảng năm xuất bản
    List<Book> findByPublishYearBetween(Integer fromYear, Integer toYear);

    // Sắp xếp theo tên A-Z
    List<Book> findAllByOrderByTitleAsc();

    // Sắp xếp theo năm xuất bản mới nhất
    List<Book> findAllByOrderByPublishYearDesc();

    // Sắp xếp theo giá tăng dần
    List<Book> findAllByOrderByPriceAsc();

    // Tìm theo tên + lọc theo thể loại (kết hợp nhiều điều kiện)
    List<Book> findByTitleContainingIgnoreCaseAndCategoryId(String keyword, Integer categoryId);

    // Tìm theo tên + sắp xếp theo giá
    List<Book> findByTitleContainingIgnoreCaseOrderByPriceAsc(String keyword);
}