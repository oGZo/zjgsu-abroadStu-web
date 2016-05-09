package test.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Teacher;
import com.zjgsu.abroadStu.model.common.MD5;
import com.zjgsu.abroadStu.model.http.ResponseCodeList;
import com.zjgsu.abroadStu.service.StudentService;
import com.zjgsu.abroadStu.service.TeacherService;
import com.zjgsu.abroadStu.service.common.ExcelOperate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by JIADONG on 16/4/12.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/applicationContext.xml")
public class TeacherServiceTest {
    @Autowired
    TeacherService teacherService;

    @Autowired
    StudentService studentService;
    @Test
    public void selectTeacherByJobNumberTest(){
        Teacher teacher = teacherService.selectTeacherByJobNumber("1");
        System.out.println("*********************");
        System.out.println(teacher.toString());
        System.out.println("*********************");
    }

    @Test
    public void selectAllTeachersTest(){
        List<Teacher> teachers = teacherService.selectAllTeachers(null,null);
        System.out.println("*********************");
        System.out.println(teachers.toString());
        System.out.println("*********************");
    }

    @Test
    public void insertTeacherTest() {
        File file = new File("/Users/JIADONG/Documents/workDocuments/teacher.xlsx");
        try {
            List<Teacher> teacherList = teacherService.selectAllTeachers(null,null);

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
                            System.out.println(teacher.getJobNumber());
                            return;
                        }
                    }
                }
            }
            teacherService.insertTeacher(newTeacherList);
        } catch (IOException e) {

        }
    }
}
