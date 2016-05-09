package com.zjgsu.abroadStu.persistence;

import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.http.StudentRequestParam;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by JIADONG on 16/4/6.
 */
public interface StudentMapper {

    Student selectStudentById(@Param("id")Integer id);

    Integer countStudentByParam(StudentRequestParam param);

    Student selectStudentByToken(@Param("token") String token);

    void saveStudentToken(Student student);

    List<Student> selectAllStudents();

    void insertStudent(List<Student> studentList);

    List<Student> selectStudentByParam(StudentRequestParam param);

    List<Student> selectStudentByCourseId(@Param("id")Integer id);

    Student selectStudentByPassportNumber(@Param("passportNumber")String passportNumber);

    void grade(@Param("courseId")Integer courseId,
               @Param("studentId")Integer studentId,
               @Param("score")Integer score);
}
