package com.zjgsu.abroadStu.model.http;

import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.Teacher;

import java.io.Serializable;
import java.util.List;

/**
 * Created by JIADONG on 16/4/27.
 */
public class CourseInstanceDTO implements Serializable {

    private Integer id;
    private String courseName;
    private Integer startWeek;
    private Integer endWeek;
    private Integer classroomId;
    private String building;
    private String roomNumber;
    private List<Teacher> teachers;
    private List<Student> students;
    private Integer week;
    private Integer startTime;
    private Integer endTime;

    private Integer score;

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getStartWeek() {
        return startWeek;
    }

    public void setStartWeek(Integer startWeek) {
        this.startWeek = startWeek;
    }

    public Integer getEndWeek() {
        return endWeek;
    }

    public void setEndWeek(Integer endWeek) {
        this.endWeek = endWeek;
    }

    public Integer getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(Integer classroomId) {
        this.classroomId = classroomId;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public List<Teacher> getTeachers() {
        return teachers;
    }

    public void setTeachers(List<Teacher> teachers) {
        this.teachers = teachers;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
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

    @Override
    public String toString() {
        return "CourseInstanceDTO{" +
                "id=" + id +
                ", courseName='" + courseName + '\'' +
                ", startWeek=" + startWeek +
                ", endWeek=" + endWeek +
                ", classroomId=" + classroomId +
                ", building='" + building + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", teachers=" + teachers +
                ", students=" + students +
                ", week=" + week +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}
