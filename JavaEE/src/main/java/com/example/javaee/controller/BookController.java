package com.example.javaee.controller;

import com.example.javaee.DTO.BookDTO;
import com.example.javaee.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookDTO>> getAll() {
        return ResponseEntity.ok(bookService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookService.getById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BookDTO>> getByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(bookService.getByCategory(categoryId));
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<BookDTO>> searchByTitle(@RequestParam String keyword) {
        return ResponseEntity.ok(bookService.searchByTitle(keyword));
    }

    @GetMapping("/search/author")
    public ResponseEntity<List<BookDTO>> searchByAuthor(@RequestParam String author) {
        return ResponseEntity.ok(bookService.searchByAuthor(author));
    }

    @PostMapping
    public ResponseEntity<BookDTO> create(@RequestBody BookDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> update(@PathVariable Integer id, @RequestBody BookDTO dto) {
        return ResponseEntity.ok(bookService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
    // Lọc theo khoảng giá
    @GetMapping("/filter/price")
    public ResponseEntity<List<BookDTO>> filterByPrice(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        return ResponseEntity.ok(bookService.filterByPriceRange(min, max));
    }

    // Lọc theo khoảng năm
    @GetMapping("/filter/year")
    public ResponseEntity<List<BookDTO>> filterByYear(
            @RequestParam Integer from,
            @RequestParam Integer to) {
        return ResponseEntity.ok(bookService.filterByYearRange(from, to));
    }

    // Sắp xếp
    @GetMapping("/sort/title")
    public ResponseEntity<List<BookDTO>> sortByTitle() {
        return ResponseEntity.ok(bookService.getAllSortedByTitle());
    }

    @GetMapping("/sort/year")
    public ResponseEntity<List<BookDTO>> sortByYear() {
        return ResponseEntity.ok(bookService.getAllSortedByYear());
    }

    @GetMapping("/sort/price")
    public ResponseEntity<List<BookDTO>> sortByPrice() {
        return ResponseEntity.ok(bookService.getAllSortedByPrice());
    }

    // Tìm theo tên + thể loại kết hợp
    @GetMapping("/search")
    public ResponseEntity<List<BookDTO>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        if (keyword != null && categoryId != null) {
            return ResponseEntity.ok(bookService.searchByTitleAndCategory(keyword, categoryId));
        } else if (keyword != null) {
            return ResponseEntity.ok(bookService.searchByTitle(keyword));
        } else if (categoryId != null) {
            return ResponseEntity.ok(bookService.getByCategory(categoryId));
        }
        return ResponseEntity.ok(bookService.getAll());
    }
}