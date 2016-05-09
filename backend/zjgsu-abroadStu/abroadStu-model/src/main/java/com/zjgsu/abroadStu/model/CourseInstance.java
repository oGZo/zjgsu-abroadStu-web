package com.zjgsu.abroadStu.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by JIADONG on 16/4/14.
 */
public class CourseInstance implements Serializable{

    private Integer id;
    private Integer courseTemplateId;
    private Integer classroomId;
    private Integer week;
    private Integer startTime;
    private Integer endTime;
    private List<Integer> studentIdList;
    private List<Integer> teacherIdList;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCourseTemplateId() {
        return courseTemplateId;
    }

    public void setCourseTemplateId(Integer courseTemplateId) {
        this.courseTemplateId = courseTemplateId;
    }

    public Integer getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(Integer classroomId) {
        this.classroomId = classroomId;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    public Integer getStartTime() {
        return startTime;
    }

    public void setStartTime(Integer startTime) {
        this.startTime = startTime;
    }

    public Integer getEndTime() {
        return endTime;
    }

    public void setEndTime(Integer endTime) {
        this.endTime = endTime;
    }

    public List<Integer> getStudentIdList() {
        return studentIdList;
    }

    public void setStudentIdList(List<Integer> studentIdList) {
        this.studentIdList = studentIdList;
    }

    public List<Integer> getTeacherIdList() {
        return teacherIdList;
    }

    public void setTeacherIdList(List<Integer> teacherIdList) {
        this.teacherIdList = teacherIdList;
    }

    @Override
    public String toString() {
        return "CourseInstance{" +
                "id=" + id +
                ", courseTemplateId=" + courseTemplateId +
                ", classroomId=" + classroomId +
                ", week=" + week +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", studentIdList=" + studentIdList +
                ", teacherIdList=" + teacherIdList +
                '}';
    }
}
