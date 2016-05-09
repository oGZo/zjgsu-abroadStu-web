package test.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.CourseTemplate;
import com.zjgsu.abroadStu.service.CourseService;
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
 * Created by JIADONG on 16/4/14.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/applicationContext.xml")
public class CourseServiceTest {

    @Autowired
    CourseService courseService;

    @Test
    public void selectCourseTemplateByProfessionIdTest(){
        List<CourseTemplate> courseTemplateList = courseService.selectCourseTemplateByProfessionId(1);
        System.out.println("*********************");
        System.out.println(courseTemplateList.toString());
        System.out.println("*********************");
    }

    @Test
    public void insertCourseTemplateTest(){
        File file = new File("/Users/JIADONG/Documents/workDocuments/courseTemplate.xlsx");
        try {

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

        }
    }

}
