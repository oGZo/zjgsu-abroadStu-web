package com.zjgsu.abroadStu.web.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.zjgsu.abroadStu.model.Admin;
import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.Teacher;
import com.zjgsu.abroadStu.model.common.Constants;
import com.zjgsu.abroadStu.model.common.MD5;
import com.zjgsu.abroadStu.model.http.ResponseCodeList;
import com.zjgsu.abroadStu.model.http.ResponseModel;
import com.zjgsu.abroadStu.service.AdminService;
import com.zjgsu.abroadStu.service.StudentService;
import com.zjgsu.abroadStu.service.TeacherService;
import com.zjgsu.abroadStu.service.common.IpAddr;
import com.zjgsu.abroadStu.service.common.JedisSetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by JIADONG on 16/4/11.
 */
@Controller
@RequestMapping("user")
public class UserController {

    @Autowired
    StudentService studentService;

    @Autowired
    TeacherService teacherService;

    @Autowired
    AdminService adminService;

    @Autowired
    JedisSetService jedisSetService;

    @RequestMapping(method = RequestMethod.POST, value = "/student/login")
    @ResponseBody
    public ResponseModel studentLogin(HttpServletRequest request, String account,String password,String salt) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        try {
            Student student = studentService.selectStudentByPassportNumber(account);

            if(student == null){
                return new ResponseModel(ResponseCodeList.SERVER_ERROR,
                        "不存在该学生,请联系学院老师");
            }
            if (!password.equals(MD5.MD5(student.getPassword() + salt))) {
                return new ResponseModel(ResponseCodeList.SERVER_ERROR,
                        "用户密码不正确，请重新输入");
            }

            String token = jedisSetService.generationToKen(account,password, Constants.studentUser, IpAddr.getIpAddr(request));

            Map<String, String> resultMap = new HashMap<>();
            resultMap.put("token", token);
            resultMap.put("name",student.getFirstName()+student.getSecondName());
            Gson gson = new Gson();
            response.setData(gson.toJson(resultMap,
                    new TypeToken<Map<String, String>>() {
                    }.getType()));
        } catch (Exception e) {

            response.setStatus(ResponseCodeList.SERVER_ERROR);
            response.setInfo("系统异常");
        }
        return response;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/teacher/login")
    @ResponseBody
    public ResponseModel teacherLogin(HttpServletRequest request, String account,String password,String salt) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        try {
            Teacher teacher = teacherService.selectTeacherByJobNumber(account);

            if(teacher == null){
                return new ResponseModel(ResponseCodeList.SERVER_ERROR,
                        "不存在该教师,请联系学院管理员");
            }
            if (!password.equals(MD5.MD5(teacher.getPassword() + salt))) {
                return new ResponseModel(ResponseCodeList.SERVER_ERROR,
                        "用户密码不正确，请重新输入");
            }

            String token = jedisSetService.generationToKen(account,password, Constants.teacherUser, IpAddr.getIpAddr(request));

            Map<String, String> resultMap = new HashMap<>();
            resultMap.put("token", token);
            resultMap.put("name", teacher.getName());
            Gson gson = new Gson();
            response.setData(gson.toJson(resultMap,
                    new TypeToken<Map<String, String>>() {
                    }.getType()));

        }catch (Exception e){
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            response.setInfo("系统异常");
        }
        return response;
    }


    @RequestMapping(method = RequestMethod.POST, value = "/admin/login")
    @ResponseBody
    public ResponseModel adminLogin(HttpServletRequest request, String account,String password,String salt) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        try {
            Admin admin = adminService.selectAdminByAccount(account);

            if(admin == null){
                return new ResponseModel(ResponseCodeList.SERVER_ERROR,
                        "账号错误");
            }
            if (!password.equals(MD5.MD5(admin.getPassword() + salt))) {
                return new ResponseModel(ResponseCodeList.SERVER_ERROR,
                        "密码不正确，请重新输入");
            }

            String token = jedisSetService.generationToKen(account,password, Constants.adminUser, IpAddr.getIpAddr(request));

            Map<String, String> resultMap = new HashMap<>();
            resultMap.put("token", token);
            resultMap.put("name", "管理员");
            Gson gson = new Gson();
            response.setData(gson.toJson(resultMap,
                    new TypeToken<Map<String, String>>() {
                    }.getType()));

        }catch (Exception e){
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            response.setInfo("系统异常");
        }
        return response;

    }

}
