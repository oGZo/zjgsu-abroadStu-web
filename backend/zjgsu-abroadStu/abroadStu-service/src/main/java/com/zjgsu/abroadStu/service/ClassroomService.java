package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Classroom;
import com.zjgsu.abroadStu.model.CourseInstance;

import java.util.List;

/**
 * Created by JIADONG on 16/4/12.
 */
public interface ClassroomService {

    List<Classroom> selectAllClassrooms(Integer start,Integer size);

    void insertClassroom(List<Classroom> classroomList);

    Integer countAllClassrooms();

}
