package com.zjgsu.abroadStu.model;

import java.io.Serializable;

/**
 * Created by JIADONG on 16/4/29.
 */
public class Admin implements Serializable {

    private Integer id;
    private String account;
    private String password;
    private String token;
    private String lastLoginIp;

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLastLoginIp() {
        return lastLoginIp;
    }

    public void setLastLoginIp(String lastLoginIp) {
        this.lastLoginIp = lastLoginIp;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "id=" + id +
                ", account='" + account + '\'' +
                ", password='" + password + '\'' +
                ", token='" + token + '\'' +
                ", lastLoginIp='" + lastLoginIp + '\'' +
                '}';
    }
}
