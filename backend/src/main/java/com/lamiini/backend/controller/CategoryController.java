package com.lamiini.backend.controller;

import com.lamiini.backend.model.Category;
import com.lamiini.backend.repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryRepo categoryRepo;

    @PostMapping("/create")
    public ResponseEntity<Category> createCategory(@RequestBody Category newCategory) {
        Category createdCategory = categoryRepo.save(newCategory);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }
}
