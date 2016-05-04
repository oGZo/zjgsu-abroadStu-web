package com.zjgsu.abroadStu.model.http;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/3/16.
 */
public class ResponseModel implements Serializable {

    private int status;
    private String info;
    private String data;
    private long timeStamp=System.currentTimeMillis();

    public long getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(long timeStamp) {
        this.timeStamp = timeStamp;
    }

    public ResponseModel(int status) {
        this.status = status;
    }

    public ResponseModel(int status, String info) {
        this.info = info;
        this.status = status;
    }

    public ResponseModel(int status, String info, String data) {
        this.data = data;
        this.info = info;
        this.status = status;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
