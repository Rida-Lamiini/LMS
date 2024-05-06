package com.lamiini.backend.controller;

import com.lamiini.backend.model.Course;
import com.lamiini.backend.repository.CourseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseRepo courseRepo;

    @PostMapping("/create")
    public ResponseEntity<Course> createCourse(@RequestBody Course newCourse) {
        Course createdCourse = courseRepo.save(newCourse);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

}
