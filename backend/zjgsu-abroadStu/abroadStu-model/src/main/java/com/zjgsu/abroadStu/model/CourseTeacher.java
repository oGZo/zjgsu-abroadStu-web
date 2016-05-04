package com.zjgsu.abroadStu.model;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/4/14.
 */
public class CourseTeacher implements Serializable{

    private Integer courseId;
    private Integer teacherId;

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    @Override
    public String toString() {
        return "CourseTeacher{" +
                "courseId=" + courseId +
                ", teacherId=" + teacherId +
                '}';
    }
}
