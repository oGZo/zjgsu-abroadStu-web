package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Admin;
import com.zjgsu.abroadStu.model.Profession;

import java.util.List;

/**
 * Created by JIADONG on 16/4/29.
 */
public interface AdminService {

    Admin selectAdminByAccount(String account);

    Admin selectAdminByToken(String token);

    void saveAdminToken (Admin admin);

    List<Profession> selectAllProfession();
}
