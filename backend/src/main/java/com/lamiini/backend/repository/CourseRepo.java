package com.lamiini.backend.repository;

import com.lamiini.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepo extends JpaRepository<Course,Long> {
}
