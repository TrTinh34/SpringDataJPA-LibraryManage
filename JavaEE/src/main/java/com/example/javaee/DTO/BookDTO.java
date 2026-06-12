package com.example.javaee.DTO;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookDTO {
    private Integer id;
    private String title;
    private String author;
    private Integer publishYear;
    private BigDecimal price;
    private Integer categoryId;
    private String categoryName;
    private String imageUrl;
}