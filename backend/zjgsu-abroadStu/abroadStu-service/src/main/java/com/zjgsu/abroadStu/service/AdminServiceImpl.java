package com.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Admin;
import com.zjgsu.abroadStu.model.Profession;
import com.zjgsu.abroadStu.persistence.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by JIADONG on 16/4/29.
 */
@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    AdminMapper adminMapper;
    @Override
    public Admin selectAdminByAccount(String account) {
        return adminMapper.selectAdminByAccount(account);
    }

    @Override
    public Admin selectAdminByToken(String token) {
        return adminMapper.selectAdminByToken(token);
    }

    @Override
    public void saveAdminToken(Admin admin) {
        adminMapper.saveAdminToken(admin);
    }

    @Override
    public List<Profession> selectAllProfession() {
        return adminMapper.selectAllProfession();
    }


}
