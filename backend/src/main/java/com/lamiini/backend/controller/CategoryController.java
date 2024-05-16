package com.lamiini.backend.controller;

import com.lamiini.backend.model.Category;
import com.lamiini.backend.repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from React application
public class CategoryController {

    @Autowired
    private CategoryRepo categoryRepository;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryRepository.findAll().stream()
                .map(category -> new CategoryDTO(category.getCategoryId(), category.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/create")
    public ResponseEntity<Category> createCategory(@RequestBody Category newCategory) {
        Category createdCategory = categoryRepository.save(newCategory);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/names")
    public ResponseEntity<List<CategoryNameDTO>> getAllCategoryNames() {
        List<CategoryNameDTO> categoryNames = categoryRepository.findAll().stream()
                .map(CategoryNameDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoryNames);
    }

    private static class CategoryDTO {
        private Long id;
        private String name;

        public CategoryDTO(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }
    }

    private static class CategoryNameDTO {
        private String name;

        public CategoryNameDTO(Category category) {
            this.name = category.getName();
        }

        public String getName() {
            return name;
        }
    }
}
