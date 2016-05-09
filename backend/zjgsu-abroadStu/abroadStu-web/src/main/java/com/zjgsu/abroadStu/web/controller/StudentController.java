package com.zjgsu.abroadStu.web.controller;

import com.google.gson.Gson;
import com.zjgsu.abroadStu.model.CourseInstance;
import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.http.CourseInstanceDTO;
import com.zjgsu.abroadStu.model.http.ResponseCodeList;
import com.zjgsu.abroadStu.model.http.ResponseModel;
import com.zjgsu.abroadStu.service.CourseService;
import com.zjgsu.abroadStu.service.StudentService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by JIADONG on 16/3/16.
 */
@Controller
@RequestMapping("student")
public class StudentController {

    @Resource
    StudentService studentService;

    @Resource
    CourseService  courseService;

    /**
     * 学生个人信息
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/personalInfo")
    @ResponseBody
    public ResponseModel personalInfo(HttpServletRequest request) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        Integer id = Integer.parseInt(request.getAttribute("userId").toString());
        try {
            Student student = studentService.selectStudentById(id);
            student.setPassword(null);
            student.setToken(null);
            Gson gson = new Gson();
            response.setData(gson.toJson(student));
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 课程表
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/courseSchedule")
    @ResponseBody
    public ResponseModel courseSchedule(HttpServletRequest request) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        Integer id = Integer.parseInt(request.getAttribute("userId").toString());
        try {
            List<CourseInstanceDTO> data = courseService.getCourseInstanceListByStudent(id);
            Gson gson = new Gson();
            response.setData(gson.toJson(data));
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

}
