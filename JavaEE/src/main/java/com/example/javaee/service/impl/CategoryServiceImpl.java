package com.example.javaee.service.impl;

import com.example.javaee.DTO.CategoryDTO;
import com.example.javaee.entity.Category;
import com.example.javaee.repository.BookRepository;
import com.example.javaee.repository.CategoryRepository;
import com.example.javaee.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    @Override
    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return toDTO(category);
    }

    @Override
    public CategoryDTO create(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        return toDTO(categoryRepository.save(category));
    }

    @Override
    public CategoryDTO update(Integer id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        category.setName(dto.getName());
        return toDTO(categoryRepository.save(category));
    }

    @Override
    public void delete(Integer id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + id));

        long bookCount = bookRepository.countByCategoryId(id);

        if (bookCount > 0) {
            throw new RuntimeException(
                    "Không thể xóa thể loại '" +
                            category.getName() +
                            "' vì vẫn còn " +
                            bookCount +
                            " cuốn sách thuộc thể loại này."
            );
        }

        categoryRepository.deleteById(id);
    }

    private CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }
}