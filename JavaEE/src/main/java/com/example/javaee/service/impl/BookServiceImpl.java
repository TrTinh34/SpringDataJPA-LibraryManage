package com.example.javaee.service.impl;

import com.example.javaee.DTO.BookDTO;
import com.example.javaee.entity.Book;
import com.example.javaee.entity.Category;
import com.example.javaee.repository.BookRepository;
import com.example.javaee.repository.CategoryRepository;
import com.example.javaee.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<BookDTO> getAll() {
        return bookRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookDTO getById(Integer id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return toDTO(book);
    }

    @Override
    public List<BookDTO> getByCategory(Integer categoryId) {
        return bookRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookDTO> searchByTitle(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookDTO> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookDTO create(BookDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
        Book book = new Book();
        mapToEntity(dto, book, category);
        return toDTO(bookRepository.save(book));
    }

    @Override
    public BookDTO update(Integer id, BookDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
        mapToEntity(dto, book, category);
        return toDTO(bookRepository.save(book));
    }

    @Override
    public void delete(Integer id) {
        bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        bookRepository.deleteById(id);
    }

    private void mapToEntity(BookDTO dto, Book book, Category category) {
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setPublishYear(dto.getPublishYear());
        book.setPrice(dto.getPrice());
        book.setCategory(category);
    }

    private BookDTO toDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPublishYear(book.getPublishYear());
        dto.setPrice(book.getPrice());
        dto.setCategoryId(book.getCategory().getId());
        dto.setCategoryName(book.getCategory().getName());
        return dto;
    }
    // Impl
    @Override
    public List<BookDTO> filterByPriceRange(BigDecimal min, BigDecimal max) {
        return bookRepository.findByPriceBetween(min, max)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookDTO> filterByYearRange(Integer from, Integer to) {
        return bookRepository.findByPublishYearBetween(from, to)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookDTO> getAllSortedByTitle() {
        return bookRepository.findAllByOrderByTitleAsc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookDTO> getAllSortedByYear() {
        return bookRepository.findAllByOrderByPublishYearDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookDTO> getAllSortedByPrice() {
        return bookRepository.findAllByOrderByPriceAsc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookDTO> searchByTitleAndCategory(String keyword, Integer categoryId) {
        return bookRepository.findByTitleContainingIgnoreCaseAndCategoryId(keyword, categoryId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
    @Override
    public List<BookDTO> getAllSortedByTitleDesc() {
        return bookRepository.findAllByOrderByTitleDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }


}