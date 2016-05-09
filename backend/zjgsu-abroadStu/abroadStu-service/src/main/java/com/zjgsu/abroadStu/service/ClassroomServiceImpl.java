package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Classroom;
import com.zjgsu.abroadStu.persistence.ClassroomMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by JIADONG on 16/4/12.
 */
@Service
public class ClassroomServiceImpl implements ClassroomService {
    @Autowired
    ClassroomMapper classroomMapper;
    @Override
    public List<Classroom> selectAllClassrooms(Integer start,Integer size) {
        return classroomMapper.selectAllClassrooms(start,size);
    }

    @Override
    public void insertClassroom(List<Classroom> classroomList) {
        classroomMapper.insertClassroom(classroomList);
    }

    @Override
    public Integer countAllClassrooms() {
        return classroomMapper.countAllClassrooms();
    }

}
