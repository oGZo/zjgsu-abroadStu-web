package com.zjgsu.abroadStu.persistence;

import com.zjgsu.abroadStu.model.Teacher;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by JIADONG on 16/4/12.
 */
public interface TeacherMapper {

    Teacher selectTeacherByJobNumber(@Param("jobNumber")String jobNumber);

    Teacher selectTeacherByToken(@Param("token")String token);

    void saveTeacherToken(Teacher teacher);

    List<Teacher> selectAllTeachers(@Param("start")Integer start,@Param("size")Integer size);

    void insertTeacher(List<Teacher> teacherList);

    Integer countTeacher();

    List<Teacher> selectTeacherByCourseId(@Param("id")Integer id);
}
