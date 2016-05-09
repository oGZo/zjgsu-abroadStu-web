package com.zjgsu.abroadStu.model;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/4/14.
 */
public class CourseTemplate implements Serializable{

    private Integer id;
    private String name;
    private Integer professionId;
    private String professionName;
    private Integer startWeek;
    private Integer endWeek;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getProfessionId() {
        return professionId;
    }

    public void setProfessionId(Integer professionId) {
        this.professionId = professionId;
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProfessionName() {
        return professionName;
    }

    public void setProfessionName(String professionName) {
        this.professionName = professionName;
    }

    @Override
    public String toString() {
        return "CourseTemplate{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", professionId=" + professionId +
                ", professionName='" + professionName + '\'' +
                ", startWeek=" + startWeek +
                ", endWeek=" + endWeek +
                '}';
    }
}
