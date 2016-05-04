package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Admin;
import com.zjgsu.abroadStu.model.Teacher;
import com.zjgsu.abroadStu.persistence.TeacherMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by JIADONG on 16/4/12.
 */
@Service
public class TeacherServiceImpl implements TeacherService{
    @Autowired
    TeacherMapper teacherMapper;
    @Override
    public Teacher selectTeacherByJobNumber(String jobNumber) {
        return teacherMapper.selectTeacherByJobNumber(jobNumber);
    }

    @Override
    public Teacher selectTeacherByToken(String token) {
        return teacherMapper.selectTeacherByToken(token);
    }

    @Override
    public void saveTeacherToken(Teacher teacher) {
        teacherMapper.saveTeacherToken(teacher);
    }

    @Override
    public List<Teacher> selectAllTeachers(Integer start,Integer size) {
        return teacherMapper.selectAllTeachers(start,size);
    }

    @Override
    public void insertTeacher(List<Teacher> teacherList) {
        teacherMapper.insertTeacher(teacherList);
    }

    @Override
    public Integer countTeacher() {
        return teacherMapper.countTeacher();
    }
}
