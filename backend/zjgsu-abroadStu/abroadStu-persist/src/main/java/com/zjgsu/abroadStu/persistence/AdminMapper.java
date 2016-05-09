package com.zjgsu.abroadStu.persistence;

import com.zjgsu.abroadStu.model.Admin;
import com.zjgsu.abroadStu.model.Profession;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by JIADONG on 16/4/29.
 */
public interface AdminMapper {

    Admin selectAdminByAccount(@Param("account")String account);

    Admin selectAdminByToken(@Param("token")String token);

    void saveAdminToken (Admin admin);

    List<Profession> selectAllProfession();
}
