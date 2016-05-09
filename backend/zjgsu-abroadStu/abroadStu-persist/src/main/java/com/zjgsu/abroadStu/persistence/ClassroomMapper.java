package com.zjgsu.abroadStu.persistence;

import com.zjgsu.abroadStu.model.Classroom;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by JIADONG on 16/4/12.
 */
public interface ClassroomMapper {

    List<Classroom> selectAllClassrooms(@Param("start")Integer start,@Param("size")Integer size);

    void insertClassroom(List<Classroom> classroomList);

    Integer countAllClassrooms();
}
