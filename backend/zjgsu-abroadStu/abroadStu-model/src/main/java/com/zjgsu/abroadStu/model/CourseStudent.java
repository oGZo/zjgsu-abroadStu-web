package com.zjgsu.abroadStu.model;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/4/14.
 */
public class CourseStudent implements Serializable{

    private Integer courseId;
    private Integer studentId;
    private Double score;

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "CourseStudent{" +
                "courseId=" + courseId +
                ", studentId=" + studentId +
                ", score=" + score +
                '}';
    }
}
