package com.zjgsu.abroadStu.web.controller;

import com.google.gson.Gson;
import com.zjgsu.abroadStu.model.*;
import com.zjgsu.abroadStu.model.common.MD5;
import com.zjgsu.abroadStu.model.http.CourseInstanceDTO;
import com.zjgsu.abroadStu.model.http.ResponseCodeList;
import com.zjgsu.abroadStu.model.http.ResponseModel;
import com.zjgsu.abroadStu.model.http.StudentRequestParam;
import com.zjgsu.abroadStu.service.*;
import com.zjgsu.abroadStu.service.common.ExcelOperate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by JIADONG on 16/4/12.
 */
@Controller
@RequestMapping("admin")
public class AdminController {
    @Autowired
    StudentService studentService;

    @Autowired
    TeacherService teacherService;

    @Autowired
    ClassroomService classroomService;

    @Autowired
    CourseService courseService;

    @Autowired
    AdminService adminService;

    /**
     * 导入学生
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/insertStudent")
    @ResponseBody
    public ResponseModel insertStudent(HttpServletRequest request, @RequestParam MultipartFile uploadFile) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        File file = new File("/Users/JIADONG/Documents/workDocuments/student.xlsx");
        try {
            uploadFile.transferTo(file);
            List<Student> studentList = studentService.selectAllStudents();

            List<Student> newStudentList = new ArrayList<>();
            List list = ExcelOperate.readExcel(file);
            for (int i = 1; i < list.size(); i++) {
                List obj = (List) list.get(i);
                Student newStudent = new Student();
                newStudent.setPassportNumber(obj.get(0).toString());
                newStudent.setSecondName(obj.get(1).toString());
                newStudent.setFirstName(obj.get(2).toString());
                if(obj.get(3).toString().equals("男")){
                    newStudent.setSex(1);
                }else if(obj.get(3).toString().equals("女")){
                    newStudent.setSex(2);
                }else {
                    newStudent.setSex(0);
                }
                newStudent.setProfessionId(Integer.parseInt(obj.get(4).toString()));
                newStudent.setProfessionName(obj.get(5).toString());
                newStudent.setStartYear(obj.get(6).toString());
                newStudent.setCountry(obj.get(7).toString());
                newStudent.setPhone(obj.get(8).toString());
                newStudent.setEmail(obj.get(9).toString());
                newStudent.setPassword(MD5.MD5(newStudent.getPassportNumber()));
                newStudentList.add(newStudent);
            }
            if(studentList!=null&&studentList.size()!=0) {
                for (Student existStudent : studentList) {
                    for (Student student : newStudentList) {
                        if (existStudent.getPassportNumber().equals(student.getPassportNumber())) {
                            response.setInfo("护照号" + student.getPassportNumber() + "的学生已存在!");
                            response.setStatus(ResponseCodeList.SERVER_ERROR);
                            return response;
                        }
                    }
                }
            }
            studentService.insertStudent(newStudentList);

        } catch (IOException e) {
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 导入教师
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/insertTeacher")
    @ResponseBody
    public ResponseModel insertTeacher(HttpServletRequest request,@RequestParam MultipartFile uploadFile) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        File file = new File("/Users/JIADONG/Documents/workDocuments/teacher.xlsx");
        try {
            uploadFile.transferTo(file);
            List<Teacher> teacherList = teacherService.selectAllTeachers(null, null);

            List<Teacher> newTeacherList = new ArrayList<>();
            List list = ExcelOperate.readExcel(file);
            for (int i = 1; i < list.size(); i++) {
                List obj = (List) list.get(i);
                Teacher newTeacher = new Teacher();
                newTeacher.setJobNumber(obj.get(0).toString());
                newTeacher.setName(obj.get(1).toString());
                newTeacher.setPhone(obj.get(2).toString());
                newTeacher.setEmail(obj.get(3).toString());
                newTeacher.setPassword(MD5.MD5(newTeacher.getJobNumber()));
                newTeacherList.add(newTeacher);
            }
            if(teacherList!=null&&teacherList.size()!=0) {
                for (Teacher existTeacher : teacherList) {
                    for (Teacher teacher : newTeacherList) {
                        if (existTeacher.getJobNumber().equals(teacher.getJobNumber())) {
                            response.setInfo("工号" + teacher.getJobNumber() + "的教师已存在!");
                            response.setStatus(ResponseCodeList.SERVER_ERROR);
                            return response;
                        }
                    }
                }
            }
            teacherService.insertTeacher(newTeacherList);
        } catch (IOException e) {
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 导入教室
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/insertClassroom")
    @ResponseBody
    public ResponseModel insertClassroom(HttpServletRequest request,@RequestParam MultipartFile uploadFile) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        File file = new File("/Users/JIADONG/Documents/workDocuments/classroom.xlsx");
        try {
            uploadFile.transferTo(file);
            List<Classroom> classroomList = classroomService.selectAllClassrooms(null, null);

            List<Classroom> newClassroomList = new ArrayList<>();

            List list = ExcelOperate.readExcel(file);
            for (int i = 1; i < list.size(); i++) {
                List obj = (List) list.get(i);
                Classroom newClassroom = new Classroom();
                newClassroom.setBuilding(obj.get(0).toString());
                newClassroom.setRoomNumber(obj.get(1).toString());
                newClassroomList.add(newClassroom);
            }
            if(classroomList!=null&&classroomList.size()!=0) {
                for (Classroom existClassroom : classroomList) {
                    for (Classroom classroom : newClassroomList) {
                        if (existClassroom.getBuilding().equals(classroom.getBuilding())&&existClassroom.getRoomNumber().equals(classroom.getRoomNumber())) {
                            response.setInfo(classroom.getBuilding()+"楼" + classroom.getRoomNumber()+"教师已存在");
                            response.setStatus(ResponseCodeList.SERVER_ERROR);
                            return response;
                        }
                    }
                }
            }
            classroomService.insertClassroom(newClassroomList);
        } catch (IOException e) {
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 导入课程模板
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/insertCourseTemplate")
    @ResponseBody
    public ResponseModel insertCourseTemplate(HttpServletRequest request,@RequestParam MultipartFile uploadFile) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        File file = new File("/Users/JIADONG/Documents/workDocuments/courseTemplate.xlsx");
        try {
            uploadFile.transferTo(file);
            List<CourseTemplate> newCourseTemplateList = new ArrayList<>();

            List list = ExcelOperate.readExcel(file);
            for (int i = 1; i < list.size(); i++) {
                List obj = (List) list.get(i);
                CourseTemplate courseTemplate = new CourseTemplate();

                courseTemplate.setName(obj.get(0).toString());
                courseTemplate.setProfessionId(Integer.parseInt(obj.get(1).toString()));
                courseTemplate.setStartWeek(Integer.parseInt(obj.get(2).toString()));
                courseTemplate.setEndWeek(Integer.parseInt(obj.get(3).toString()));
                newCourseTemplateList.add(courseTemplate);

            }

            courseService.insertCourseTemplate(newCourseTemplateList);
        } catch (IOException e) {
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 排课
     * @param request
     * @param courseInstance
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/arrangeCourse")
    @ResponseBody
    public ResponseModel arrangeCourse(HttpServletRequest request,CourseInstance courseInstance) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        List<Integer> studentList = courseInstance.getStudentIdList();
        List<Integer> teacherList = courseInstance.getTeacherIdList();

        try {
            List<CourseInstance> courseInstanceList = courseService.getCourseInstanceList();
            for (CourseInstance course:courseInstanceList){
                if(courseInstance.getWeek().equals(course.getWeek())) {
                     if ((courseInstance.getStartTime() <= course.getStartTime() && courseInstance.getStartTime() >= course.getEndTime())
                                || courseInstance.getEndTime() <= course.getStartTime() && courseInstance.getEndTime() >= course.getEndTime()) {

                         //教室判重
                        if (courseInstance.getClassroomId().equals(course.getClassroomId())) {
                            response.setInfo("该时间段教室冲突!");
                            response.setStatus(ResponseCodeList.SERVER_ERROR);
                            return response;
                        }
                        //学生判重
                        for(Integer oldStudentId:course.getStudentIdList()) {
                            for (Integer newStudentId : studentList) {
                                if(oldStudentId.equals(newStudentId)){
                                    response.setInfo("该时间段学生冲突!");
                                    response.setStatus(ResponseCodeList.SERVER_ERROR);
                                    return response;
                                }
                            }
                        }
                        //教师判重
                        for(Integer oldTeacherId:course.getTeacherIdList()) {
                            for (Integer newTeacherId : teacherList) {
                                if(oldTeacherId.equals(newTeacherId)){
                                    response.setInfo("该时间段教师冲突!");
                                    response.setStatus(ResponseCodeList.SERVER_ERROR);
                                    return response;
                                }
                            }
                        }
                    }
                }
            }

            courseService.arrangeCourse(courseInstance);
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }

    /**
     * 删除排课
     * @param request
     * @param id
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/deleteArrange")
    @ResponseBody
    public ResponseModel deleteArrange(HttpServletRequest request,Integer id) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        try{
            courseService.deleteArrange(id);
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;

    }

    /**
     * 更新排课
     * @param request
     * @param courseInstance
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/updateArrange")
    @ResponseBody
    public ResponseModel updateArrange(HttpServletRequest request, CourseInstance courseInstance) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        try {
            courseService.deleteArrange(courseInstance.getId());

            List<Integer> studentList = courseInstance.getStudentIdList();
            List<Integer> teacherList = courseInstance.getTeacherIdList();

            List<CourseInstance> courseInstanceList = courseService.getCourseInstanceList();
            for (CourseInstance course:courseInstanceList) {
                if (courseInstance.getWeek().equals(course.getWeek())) {
                    if ((courseInstance.getStartTime() <= course.getStartTime() && courseInstance.getStartTime() >= course.getEndTime())
                            || courseInstance.getEndTime() <= course.getStartTime() && courseInstance.getEndTime() >= course.getEndTime()) {

                        //教室判重
                        if (courseInstance.getClassroomId().equals(course.getClassroomId())) {
                            response.setInfo("该时间段教室冲突!");
                            response.setStatus(ResponseCodeList.SERVER_ERROR);
                            return response;
                        }
                        //学生判重
                        for (Integer oldStudentId : course.getStudentIdList()) {
                            for (Integer newStudentId : studentList) {
                                if (oldStudentId.equals(newStudentId)) {
                                    response.setInfo("该时间段学生冲突!");
                                    response.setStatus(ResponseCodeList.SERVER_ERROR);
                                    return response;
                                }
                            }
                        }
                        //教师判重
                        for (Integer oldTeacherId : course.getTeacherIdList()) {
                            for (Integer newTeacherId : teacherList) {
                                if (oldTeacherId.equals(newTeacherId)) {
                                    response.setInfo("该时间段教师冲突!");
                                    response.setStatus(ResponseCodeList.SERVER_ERROR);
                                    return response;
                                }
                            }
                        }
                    }
                }
            }
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }




    /**
     * 排课选择学生
     * @param request
     * @param param
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/selectStudent")
    @ResponseBody
    public ResponseModel selectStudent(HttpServletRequest request,StudentRequestParam param) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        try {
            Integer sum = studentService.countStudentByParam(param);
            List<Student> studentList = studentService.selectStudentByParam(param);
            Map<String,Object> data = new HashMap<>();
            data.put("sum",sum);
            data.put("studentList",studentList);
            Gson gson = new Gson();
            response.setData(gson.toJson(data));
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return  response;
    }

    /**
     * 排课选择教师
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/selectTeacher")
    @ResponseBody
    public ResponseModel selectTeacher(HttpServletRequest request,Integer start,Integer size) {

        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
        try {

            Integer sum = teacherService.countTeacher();
            List<Teacher> teacherList = teacherService.selectAllTeachers(start,size);

            List<Teacher> data = new ArrayList<>();

            for(Teacher teacher:teacherList){
                Teacher dataTeacher = new Teacher();
                dataTeacher.setId(teacher.getId());
                dataTeacher.setJobNumber(teacher.getJobNumber());
                data.add(dataTeacher);
            }
            Map<String,Object> res = new HashMap<>();
            res.put("sum",sum);
            res.put("teacherList",teacherList);
            Gson gson = new Gson();
            response.setData(gson.toJson(res));
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return  response;
    }

    /**
     * 排课选择课程模板
     * @param request
     * @param professionId
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/selectCourseTemplate")
    @ResponseBody
    public ResponseModel selectCourseTemplate(HttpServletRequest request,Integer professionId) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        try {
            List<CourseTemplate> courseTemplateList = courseService.selectCourseTemplateByProfessionId(professionId);
            Gson gson = new Gson();
            response.setData(gson.toJson(courseTemplateList));
        }catch (Exception e){
            response.setInfo("系统异常");
            response.setStatus(ResponseCodeList.SERVER_ERROR);
            return response;
        }
        return response;
    }


    /**
     * 排课选择教室
     * @param request
     * @param start
     * @param size
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/selectClassroom")
    @ResponseBody
    public ResponseModel selectClassroom(HttpServletRequest request,Integer start,Integer size) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        try {
            List<Classroom> classroomList = classroomService.selectAllClassrooms(start,size);
            Integer sum = classroomService.countAllClassrooms();

            Map<String,Object> data = new HashMap<>();
            data.put("classroomList",classroomList);
            data.put("sum",sum);
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
     * 课程实例列表
     * @param request
     * @param professionId
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/courseInstance")
    @ResponseBody
    public ResponseModel courseInstance(HttpServletRequest request,Integer professionId) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");

        try{
            List<CourseInstanceDTO> data = courseService.getCourseInstanceListByProfessionId(professionId);
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
     * 专业列表
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/professionList")
    @ResponseBody
    public ResponseModel professionList(HttpServletRequest request) {
        ResponseModel response = new ResponseModel(ResponseCodeList.Success, "请求成功！");
            try {
                List<Profession> data = adminService.selectAllProfession();
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
