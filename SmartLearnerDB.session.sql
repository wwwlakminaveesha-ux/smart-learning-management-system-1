-- ═══════════════════════════════════════════════════════════════════════════════
-- SmartLearner Database Schema
-- Database: SmartLearnerDB
-- ═══════════════════════════════════════════════════════════════════════════════
-- Drop existing database to start fresh
DROP DATABASE IF EXISTS SmartLearnerDB;
-- Create Database
CREATE DATABASE IF NOT EXISTS SmartLearnerDB;
USE SmartLearnerDB;
-- ───────────────────────────────────────────────────────────────────────────────
-- TABLE: users
-- ───────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'lecturer', 'admin') DEFAULT 'student',
    phone VARCHAR(15),
    department VARCHAR(100),
    student_id VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_picture VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);
-- ───────────────────────────────────────────────────────────────────────────────
-- TABLE: courses
-- ───────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    credits INT DEFAULT 3,
    semester INT NOT NULL,
    year INT NOT NULL,
    lecturer_id INT NOT NULL,
    max_students INT DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_lecturer_id (lecturer_id),
    INDEX idx_is_active (is_active),
    INDEX idx_code (code)
);
-- ───────────────────────────────────────────────────────────────────────────────
-- TABLE: enrollments
-- ───────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'dropped', 'completed') DEFAULT 'active',
    grade_letter VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    INDEX idx_student_id (student_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status)
);
-- ───────────────────────────────────────────────────────────────────────────────
-- TABLE: assignments
-- ───────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    max_marks INT DEFAULT 100,
    due_date DATETIME NOT NULL,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE
    SET NULL,
        INDEX idx_course_id (course_id),
        INDEX idx_due_date (due_date),
        INDEX idx_is_active (is_active)
);
-- ───────────────────────────────────────────────────────────────────────────────
-- TABLE: submissions
-- ───────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_file VARCHAR(255),
    submission_text TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_graded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (assignment_id, student_id),
    INDEX idx_assignment_id (assignment_id),
    INDEX idx_student_id (student_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_is_graded (is_graded)
);
-- ───────────────────────────────────────────────────────────────────────────────
-- TABLE: grades
-- ───────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    marks DECIMAL(5, 2) DEFAULT 0,
    grade_letter VARCHAR(2),
    feedback TEXT,
    graded_by INT,
    graded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE
    SET NULL,
        UNIQUE KEY unique_grade (assignment_id, student_id),
        INDEX idx_assignment_id (assignment_id),
        INDEX idx_student_id (student_id),
        INDEX idx_graded_by (graded_by)
);
-- ───────────────────────────────────────────────────────────────────────────────
-- VIEW: vw_student_courses
-- ───────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_student_courses AS
SELECT e.student_id,
    c.id AS course_id,
    c.code AS course_code,
    c.title AS course_title,
    c.credits,
    c.semester,
    c.year,
    u.name AS lecturer_name,
    e.status AS enrollment_status,
    e.grade_letter,
    e.enrollment_date
FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    JOIN users u ON c.lecturer_id = u.id
WHERE c.is_active = TRUE;
-- ───────────────────────────────────────────────────────────────────────────────
-- VIEW: vw_student_grades
-- ───────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_student_grades AS
SELECT g.student_id,
    c.code AS course_code,
    c.title AS course_title,
    a.title AS assignment_title,
    g.marks,
    a.max_marks,
    g.grade_letter,
    g.feedback,
    g.graded_at
FROM grades g
    JOIN assignments a ON g.assignment_id = a.id
    JOIN courses c ON a.course_id = c.id
ORDER BY g.created_at DESC;
-- ═══════════════════════════════════════════════════════════════════════════════
-- Sample Data (Optional - Comment out if not needed)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Insert sample users (password: password123)
INSERT INTO users (
        name,
        email,
        password,
        role,
        department,
        phone,
        is_active
    )
VALUES (
        'Admin User',
        'admin@smartlearner.com',
        '$2a$10$gSvqqUPHQ0sG/p/fl7X8/.5R7jQRc.9fXkLVZCplXPYcJqYUjYCji',
        'admin',
        'Administration',
        '0771234567',
        TRUE
    ),
    (
        'Dr. John Smith',
        'john.smith@smartlearner.com',
        '$2a$10$gSvqqUPHQ0sG/p/fl7X8/.5R7jQRc.9fXkLVZCplXPYcJqYUjYCji',
        'lecturer',
        'Computer Science',
        '0771234568',
        TRUE
    ),
    (
        'Sarah Johnson',
        'sarah.johnson@smartlearner.edu',
        '$2a$10$gSvqqUPHQ0sG/p/fl7X8/.5R7jQRc.9fXkLVZCplXPYcJqYUjYCji',
        'student',
        'Computer Science',
        '0771234569',
        TRUE
    ),
    (
        'Michael Brown',
        'michael.brown@smartlearner.edu',
        '$2a$10$gSvqqUPHQ0sG/p/fl7X8/.5R7jQRc.9fXkLVZCplXPYcJqYUjYCji',
        'student',
        'Computer Science',
        '0771234570',
        TRUE
    );
-- Insert sample courses
INSERT INTO courses (
        code,
        title,
        description,
        credits,
        semester,
        year,
        lecturer_id,
        max_students,
        is_active
    )
VALUES (
        'CS101',
        'Introduction to Programming',
        'Learn the basics of programming using Python',
        3,
        1,
        1,
        2,
        50,
        TRUE
    ),
    (
        'CS102',
        'Web Development',
        'Build modern web applications with HTML, CSS, and JavaScript',
        3,
        2,
        1,
        2,
        45,
        TRUE
    );
-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id, status)
VALUES (3, 1, 'active'),
    (3, 2, 'active'),
    (4, 1, 'active');
-- ═══════════════════════════════════════════════════════════════════════════════
-- End of Schema Setup
-- ═══════════════════════════════════════════════════════════════════════════════