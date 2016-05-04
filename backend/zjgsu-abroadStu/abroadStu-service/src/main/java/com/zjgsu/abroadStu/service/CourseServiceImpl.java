package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.*;
import com.zjgsu.abroadStu.model.http.CourseInstanceDTO;
import com.zjgsu.abroadStu.persistence.CourseMapper;
import com.zjgsu.abroadStu.persistence.StudentMapper;
import com.zjgsu.abroadStu.persistence.TeacherMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by JIADONG on 16/4/14.
 */
@Service
public class CourseServiceImpl implements CourseService{

    @Autowired
    CourseMapper courseMapper;

    @Autowired
    TeacherMapper teacherMapper;

    @Autowired
    StudentMapper studentMapper;


    @Override
    public List<CourseTemplate> selectCourseTemplateByProfessionId(Integer professionId) {
        return courseMapper.selectCourseTemplateByProfessionId(professionId);
    }

    @Override
    public void insertCourseTemplate(List<CourseTemplate> courseTemplateList) {
        courseMapper.insertCourseTemplate(courseTemplateList);
    }

    @Override
    @Transactional(readOnly = false, rollbackFor = Exception.class)
    public void arrangeCourse(CourseInstance courseInstance) {
        courseMapper.addCourseInstance(courseInstance);

        List<CourseStudent> courseStudentList = new ArrayList<>();
        List<CourseTeacher> courseTeacherList = new ArrayList<>();

        for(Integer studentId:courseInstance.getStudentIdList()){
            CourseStudent courseStudent = new CourseStudent();
            courseStudent.setCourseId(courseInstance.getId());
            courseStudent.setStudentId(studentId);
            courseStudentList.add(courseStudent);
        }
        for(Integer teacherId:courseInstance.getTeacherIdList()){
            CourseTeacher courseTeacher = new CourseTeacher();
            courseTeacher.setCourseId(courseInstance.getId());
            courseTeacher.setTeacherId(teacherId);
            courseTeacherList.add(courseTeacher);
        }
        courseMapper.addCourseStudents(courseStudentList);
        courseMapper.addCourseTeachers(courseTeacherList);
    }

    @Override
    public List<CourseInstance> getCourseInstanceList() {
        List<CourseInstance> courseInstanceList = courseMapper.getCourseInstanceList();
        for(CourseInstance courseInstance:courseInstanceList){
            List<Integer> studentIdList = courseMapper.getCourseStudentList(courseInstance.getId());
            List<Integer> teacherIdList = courseMapper.getCourseTeacherList(courseInstance.getId());
            courseInstance.setStudentIdList(studentIdList);
            courseInstance.setTeacherIdList(teacherIdList);
        }
        return courseMapper.getCourseInstanceList();
    }

    @Override
    public List<CourseInstanceDTO> getCourseInstanceListByStudent(Integer id) {
        List<CourseInstanceDTO> courseInstanceList = courseMapper.getCourseInstanceListByStudent(id);
        for(CourseInstanceDTO instance:courseInstanceList){
            List<Teacher> teachers = teacherMapper.selectTeacherByCourseId(instance.getId());
            instance.setTeachers(teachers);
        }
        return courseInstanceList;
    }

    @Override
    public List<CourseInstanceDTO> getCourseInstanceListByProfessionId(Integer id) {
        List<CourseInstanceDTO> courseInstanceList = courseMapper.getCourseInstanceListByProfessionId(id);
        for(CourseInstanceDTO instance:courseInstanceList){
            List<Teacher> teachers = teacherMapper.selectTeacherByCourseId(instance.getId());
            List<Student> students = studentMapper.selectStudentByCourseId(instance.getId());
            instance.setStudents(students);
            instance.setTeachers(teachers);
        }
        return courseInstanceList;
    }

    @Override
    public List<CourseInstanceDTO> getCourseInstanceListByTeacher(Integer id) {
        List<CourseInstanceDTO> courseInstanceList = courseMapper.getCourseInstanceListByTeacher(id);
        for(CourseInstanceDTO instance:courseInstanceList){
            List<Teacher> teachers = teacherMapper.selectTeacherByCourseId(instance.getId());
            List<Student> students = studentMapper.selectStudentByCourseId(instance.getId());
            instance.setTeachers(teachers);
            instance.setStudents(students);
        }
        return courseInstanceList;
    }


}
