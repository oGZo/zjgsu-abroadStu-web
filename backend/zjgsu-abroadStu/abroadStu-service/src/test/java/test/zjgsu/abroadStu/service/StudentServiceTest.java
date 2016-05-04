package test.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Student;
import com.zjgsu.abroadStu.model.common.MD5;
import com.zjgsu.abroadStu.model.http.StudentRequestParam;
import com.zjgsu.abroadStu.service.StudentService;
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
 * Created by JIADONG on 16/4/6.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/applicationContext.xml")
public class StudentServiceTest {
    @Autowired
    StudentService studentService;
    @Test
    public void selectStudentByStudentNumberTest(){
        Student student = studentService.selectStudentById(1);
        System.out.println("*********************");
        System.out.println(student.toString());
        System.out.println("*********************");
    }

    @Test
    public void selectAllStudentsTest(){
        List<Student> students = studentService.selectAllStudents();
        System.out.println("*********************");
        System.out.println(students.toString());
        System.out.println("*********************");
    }

    @Test
    public void insertStudentTest(){
        File file = new File("/Users/JIADONG/Documents/workDocuments/student.xlsx");
        try {
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

            for (Student existStudent:studentList){
                for(Student student:newStudentList){
                    if(existStudent.getPassportNumber().equals(student.getPassportNumber())){
                        System.out.println(student.getPassportNumber());
                        return;
                    }
                }
            }
            studentService.insertStudent(newStudentList);
            System.out.println("====================");
            System.out.println("====================");
    } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @Test
    public void selectStudentTest(){
        StudentRequestParam param = new StudentRequestParam();
        param.setStart(0);
        param.setSize(10);
        param.setProfessionId(1);
        param.setName("严");
        List<Student> studentList = studentService.selectStudentByParam(param);
        System.out.println("====================");
        System.out.println(studentList.toString());
        System.out.println("====================");
    }


}
