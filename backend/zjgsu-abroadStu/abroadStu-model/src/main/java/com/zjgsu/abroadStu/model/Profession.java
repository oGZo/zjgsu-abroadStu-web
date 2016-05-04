package com.zjgsu.abroadStu.model;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/4/30.
 */
public class Profession implements Serializable{
    private Integer id;
    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
