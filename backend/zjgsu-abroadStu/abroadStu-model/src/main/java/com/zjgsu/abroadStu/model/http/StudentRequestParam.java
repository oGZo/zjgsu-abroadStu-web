package com.zjgsu.abroadStu.model.http;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/4/26.
 */
public class StudentRequestParam implements Serializable{

    private String name;
    private Integer professionId;
    private String passportNumber;
    private Integer start;
    private Integer size;

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

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    @Override
    public String toString() {
        return "StudentRequestParam{" +
                "name='" + name + '\'' +
                ", professionId=" + professionId +
                ", passportNumber='" + passportNumber + '\'' +
                ", start=" + start +
                ", size=" + size +
                '}';
    }
}
