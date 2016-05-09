package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.http.StudentRequestParam;
import com.zjgsu.abroadStu.persistence.StudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by JIADONG on 16/4/5.
 */
@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    StudentMapper studentMapper;

    @Override
    public Student selectStudentByPassportNumber(String passportNumber) {
        return studentMapper.selectStudentByPassportNumber(passportNumber);
    }

    @Override
    public Student selectStudentById(Integer id) {
        return studentMapper.selectStudentById(id);
    }

    @Override
    public Student selectStudentByToken(String token) {
        return studentMapper.selectStudentByToken(token);
    }

    @Override
    public void saveStudentToken(Student student) {
        studentMapper.saveStudentToken(student);
    }

    @Override
    public List<Student> selectAllStudents() {
        return studentMapper.selectAllStudents();
    }

    @Override
    public void insertStudent(List<Student> studentList) {
        studentMapper.insertStudent(studentList);
    }

    @Override
    public List<Student> selectStudentByParam(StudentRequestParam param) {
        return studentMapper.selectStudentByParam(param);
    }

    @Override
    public Integer countStudentByParam(StudentRequestParam param) {
        return studentMapper.countStudentByParam(param);
    }

    @Override
    public List<Student> selectStudentByCourseId(Integer id) {
       return studentMapper.selectStudentByCourseId(id);
    }

    @Override
    public void grade(Integer courseId, Integer studentId, Integer score) {
        studentMapper.grade(courseId,studentId,score);
    }
}
