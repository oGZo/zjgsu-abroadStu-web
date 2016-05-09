package com.zjgsu.abroadStu.web.controller;

import com.zjgsu.abroadStu.model.Admin;
import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.Teacher;
import com.zjgsu.abroadStu.model.common.Constants;
import com.zjgsu.abroadStu.model.common.ResponseTool;
import com.zjgsu.abroadStu.model.http.ResponseCodeList;
import com.zjgsu.abroadStu.model.http.ResponseModel;
import com.zjgsu.abroadStu.service.AdminService;
import com.zjgsu.abroadStu.service.StudentService;
import com.zjgsu.abroadStu.service.TeacherService;
import com.zjgsu.abroadStu.service.common.IpAddr;
import com.zjgsu.abroadStu.service.common.JedisSetService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AuthenticationFilter extends HandlerInterceptorAdapter {


	@Autowired
	private JedisSetService jedisSetService;

	@Autowired
	StudentService studentService;

	@Autowired
	TeacherService teacherService;

	@Autowired
	AdminService adminService;

	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		// "Access-Control-Allow-Origin", "*"

		String httpReferer = request.getHeader("Referer");
		if (httpReferer != null && !"".equals(httpReferer)) {
			httpReferer = httpReferer.substring(0, httpReferer.indexOf("/", 7));
			httpReferer = httpReferer + "/";
		}

		// 请求的uri
		String uri = request.getRequestURI();

		// 不拦截的uri
		String notFilter = "/user";

		// 是否过滤
		boolean doFilter = !uri.contains(notFilter) ;
		if (doFilter) {
			String token = ""; // token, 含登录态的和验证用的
			String backMsg = "success";// 验证返回信息

			String uip = IpAddr.getIpAddr(request);

			int returnCode = ResponseCodeList.EXPIRED_TOKEN;
			String returnMsg = "请重新登录";

			token = request.getParameter("token");
			if(StringUtils.isEmpty(token)){
				token = request.getHeader("token");
			}
			String userType = request.getParameter("userType");
			if(StringUtils.isEmpty(userType)){
				userType = request.getHeader("userType");
			}
			Integer	type = Integer.parseInt(userType);

			if(type.equals(Constants.studentUser)){
				if (StringUtils.isNotEmpty(token)) {
					Student student = studentService.selectStudentByToken(token);
					if(uip.equals(student.getLastLoginIp())){
						request.setAttribute("userId", student.getId());
					}else{
						backMsg = "请重新登录!";
					}
				}
			}else if(type.equals(Constants.teacherUser)){
				if (StringUtils.isNotEmpty(token)) {
					Teacher teacher = teacherService.selectTeacherByToken(token);
					if(uip.equals(teacher.getLastLoginIp())){
						request.setAttribute("userId", teacher.getId());
					}else{
						backMsg = "请重新登录";
					}
				}
			}else if(type.equals((Constants.adminUser))){
				if (StringUtils.isNotEmpty(token)) {
					Admin admin = adminService.selectAdminByToken(token);

					if(uip.equals(admin.getLastLoginIp())){
						request.setAttribute("userId", admin.getId());
					}else{
						backMsg = "请重新登录";
					}
				}
			}

			if (backMsg.isEmpty()) {
				// 如果session中不存在登录者实体，则弹出框提示重新登录
				ResponseModel result = new ResponseModel(returnCode);
				result.setInfo(returnMsg);
				ResponseTool.writeJsonPToResponse(result, response,
						request.getParameter("callback"));
				return false;
			}
		}
		return super.preHandle(request, response, handler);
	}
}