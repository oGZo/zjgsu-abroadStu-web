package com.zjgsu.abroadStu.model;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/4/12.
 */
public class Classroom implements Serializable{
    private Integer id;
    private String building;
    private String roomNumber;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    @Override
    public String toString() {
        return "Classroom{" +
                "id=" + id +
                ", building='" + building + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                '}';
    }
}
