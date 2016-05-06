package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.CourseInstance;
import com.zjgsu.abroadStu.model.CourseTemplate;
import com.zjgsu.abroadStu.model.http.CourseInstanceDTO;

import java.util.List;

/**
 * Created by JIADONG on 16/4/14.
 */
public interface CourseService {

    List<CourseTemplate> selectCourseTemplateByProfessionId(Integer professionId);

    void insertCourseTemplate(List<CourseTemplate> courseTemplateList);

    void arrangeCourse(CourseInstance courseInstance);

    List<CourseInstance> getCourseInstanceList();

    List<CourseInstanceDTO>  getCourseInstanceListByStudent(Integer id);

    List<CourseInstanceDTO> getCourseInstanceListByProfessionId(Integer id);

    List<CourseInstanceDTO> getCourseInstanceListByTeacher(Integer id);

    void deleteArrange(Integer id) throws Exception;
}
