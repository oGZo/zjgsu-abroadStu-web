package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.http.StudentRequestParam;

import java.util.List;

/**
 * Created by JIADONG on 16/3/29.
 */
public interface StudentService {

    Student selectStudentByPassportNumber(String passportNumber);

    Student selectStudentById(Integer id);

    Student selectStudentByToken(String token);

    void saveStudentToken(Student student);

    List<Student> selectAllStudents();

    void insertStudent(List<Student> studentList);

    List<Student> selectStudentByParam(StudentRequestParam param);

    Integer countStudentByParam(StudentRequestParam param);

    List<Student> selectStudentByCourseId(Integer id);

    void grade(Integer courseId,Integer studentId,Integer score);

}
