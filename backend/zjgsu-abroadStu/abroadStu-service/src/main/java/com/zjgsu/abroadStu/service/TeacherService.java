package com.zjgsu.abroadStu.service;


import com.zjgsu.abroadStu.model.Teacher;

import java.util.List;

/**
 * Created by JIADONG on 16/4/12.
 */
public interface TeacherService {

    Teacher selectTeacherByJobNumber(String jobNumber);

    Teacher selectTeacherByToken(String token);

    void saveTeacherToken(Teacher teacher);

    List<Teacher> selectAllTeachers(Integer start,Integer size);

    void insertTeacher(List<Teacher> teacherList);

    Integer countTeacher();

}
