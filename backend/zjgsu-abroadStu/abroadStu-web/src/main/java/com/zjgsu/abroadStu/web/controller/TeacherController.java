package com.zjgsu.abroadStu.web.controller;

import com.google.gson.Gson;
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
 * Created by JIADONG on 16/4/12.
 */
@Controller
@RequestMapping("teacher")
public class TeacherController {
    @Resource
    StudentService studentService;

    @Resource
    CourseService courseService;

    /**
     * 教师课程表
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/courseSchedule")
    @ResponseBody
    public ResponseModel courseSchedule(HttpServletRequest request) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        Integer id = Integer.parseInt(String.valueOf(request.getAttribute("userId")));
        try {
            List<CourseInstanceDTO> data = courseService.getCourseInstanceListByTeacher(id);
            Gson gson = new Gson();
            response.setData(gson.toJson(data));
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 选课学生
     * @param request
     * @param courseId
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/courseStudent")
    @ResponseBody
    public ResponseModel courseStudent(HttpServletRequest request,Integer courseId) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        try {
            List<Student> data = studentService.selectStudentByCourseId(courseId);
            Gson gson = new Gson();
            response.setData(gson.toJson(data));
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 给学生打成绩
     * @param request
     * @param courseId
     * @param student
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/grade")
    @ResponseBody
    public ResponseModel courseStudent(HttpServletRequest request,Integer courseId,Integer student,Integer score) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        try {
            studentService.grade(courseId, student,score);
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

}
