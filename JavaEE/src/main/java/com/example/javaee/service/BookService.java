package com.example.javaee.service;
import com.example.javaee.DTO.BookDTO;
import java.util.List;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
public interface BookService {
    List<BookDTO> getAll();
    BookDTO getById(Integer id);
    List<BookDTO> getByCategory(Integer categoryId);
    List<BookDTO> searchByTitle(String keyword);
    List<BookDTO> searchByAuthor(String author);
    BookDTO create(BookDTO dto);
    BookDTO update(Integer id, BookDTO dto);
    void delete(Integer id);
    // Interface
    List<BookDTO> filterByPriceRange(BigDecimal min, BigDecimal max);
    List<BookDTO> filterByYearRange(Integer from, Integer to);
    List<BookDTO> getAllSortedByTitle();
    List<BookDTO> getAllSortedByYear();
    List<BookDTO> getAllSortedByPrice();
    List<BookDTO> searchByTitleAndCategory(String keyword, Integer categoryId);
    List<BookDTO> getAllSortedByTitleDesc();

}
