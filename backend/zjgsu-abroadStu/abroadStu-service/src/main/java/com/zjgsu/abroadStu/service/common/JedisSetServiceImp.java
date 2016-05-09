package com.zjgsu.abroadStu.service.common;

import com.zjgsu.abroadStu.model.Admin;
import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.Teacher;
import com.zjgsu.abroadStu.model.common.Constants;
import com.zjgsu.abroadStu.model.common.MD5;
import com.zjgsu.abroadStu.service.AdminService;
import com.zjgsu.abroadStu.service.StudentService;
import com.zjgsu.abroadStu.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JedisSetServiceImp implements JedisSetService {

	@Autowired
	StudentService studentService;

	@Autowired
	TeacherService teacherService;

	@Autowired
	AdminService adminService;

	/**
	 * 构造ToKen
	 */
	public String generationToKen(String account,
			String password,Integer userType, String uip) {
		String token = MD5.MD5(account + "_"
				+ MD5.selectRandom(6));// 加随机串
		if (userType == Constants.studentUser) {
			Student student = new Student();
			student.setPassportNumber(account);
			student.setLastLoginIp(uip);
			student.setToken(token);
			studentService.saveStudentToken(student);
		}else if (userType == Constants.teacherUser){
			Teacher teacher = new Teacher();
			teacher.setJobNumber(account);
			teacher.setLastLoginIp(uip);
			teacher.setToken(token);
			teacherService.saveTeacherToken(teacher);
		}else if (userType == Constants.adminUser){
			Admin admin = new Admin();
			admin.setAccount(account);
			admin.setLastLoginIp(uip);
			admin.setToken(token);
			adminService.saveAdminToken(admin);
		}
		return token;
	}

}
