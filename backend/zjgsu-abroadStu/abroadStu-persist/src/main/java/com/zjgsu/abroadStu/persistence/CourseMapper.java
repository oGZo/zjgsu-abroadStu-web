package com.zjgsu.abroadStu.persistence;

import com.zjgsu.abroadStu.model.CourseInstance;
import com.zjgsu.abroadStu.model.CourseStudent;
import com.zjgsu.abroadStu.model.CourseTeacher;
import com.zjgsu.abroadStu.model.CourseTemplate;
import com.zjgsu.abroadStu.model.http.CourseInstanceDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by JIADONG on 16/4/14.
 */
public interface CourseMapper {

    List<CourseTemplate> selectCourseTemplateByProfessionId(@Param("professionId")Integer professionId);

    void insertCourseTemplate(List<CourseTemplate> courseTemplateList);

    List<CourseInstance> getCourseInstanceList();

    List<Integer> getCourseStudentList(@Param("id")Integer id);

    List<Integer> getCourseTeacherList(@Param("id")Integer id);

    void addCourseInstance (CourseInstance courseInstance);

    void addCourseStudents(List<CourseStudent> courseStudentList);

    void addCourseTeachers(List<CourseTeacher> courseTeacherList);

    List<CourseInstanceDTO> getCourseInstanceListByStudent(@Param("id")Integer id);

    List<CourseInstanceDTO> getCourseInstanceListByProfessionId(@Param("id")Integer id);

    List<CourseInstanceDTO> getCourseInstanceListByTeacher(@Param("id")Integer id);

    void deleteInstance(@Param("id")Integer id);

    void deleteStudentRelation(@Param("id")Integer id);

    void deleteTeacherRelation(@Param("id")Integer id);

 }
