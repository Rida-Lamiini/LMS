package com.lamiini.backend.controller;

import com.lamiini.backend.model.Category;
import com.lamiini.backend.model.Course;
import com.lamiini.backend.repository.CategoryRepo;
import com.lamiini.backend.repository.CourseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from React application
public class CourseController {

    @Autowired
    private CourseRepo courseRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @PostMapping("/create")
    public ResponseEntity<Course> createCourse(@RequestBody Course newCourse) {
        Course createdCourse = courseRepo.save(newCourse);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Course>> getAllCourses() {
        Iterable<Course> courses = courseRepo.findAll();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> optionalCourse = courseRepo.findById(id);
        return optionalCourse.map(course -> new ResponseEntity<>(course, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/update-category/{categoryId}")
    public ResponseEntity<Course> updateCourseCategory(@PathVariable Long id, @PathVariable Long categoryId) {
        Optional<Course> optionalCourse = courseRepo.findById(id);
        if (optionalCourse.isPresent()) {
            Optional<Category> optionalCategory = categoryRepo.findById(categoryId);
            if (optionalCategory.isPresent()) {
                Course course = optionalCourse.get();
                course.setCategory(optionalCategory.get());
                courseRepo.save(course);
                return new ResponseEntity<>(course, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/update-price")
    public ResponseEntity<Course> updateCoursePrice(@PathVariable Long id, @RequestBody Float price) {
        Optional<Course> optionalCourse = courseRepo.findById(id);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.setPrice(price); // Assuming you have a setter method for price in your Course model
            courseRepo.save(course);
            return new ResponseEntity<>(course, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
