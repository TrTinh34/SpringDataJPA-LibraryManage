package com.example.javaee.service;
import com.example.javaee.DTO.CategoryDTO;
import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAll();
    CategoryDTO getById(Integer id);
    CategoryDTO create(CategoryDTO dto);
    CategoryDTO update(Integer id, CategoryDTO dto);
    void delete(Integer id);
}
