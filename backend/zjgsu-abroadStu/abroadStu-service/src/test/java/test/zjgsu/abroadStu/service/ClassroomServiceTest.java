package test.zjgsu.abroadStu.service;

import com.zjgsu.abroadStu.model.Classroom;
import com.zjgsu.abroadStu.model.http.ResponseCodeList;
import com.zjgsu.abroadStu.service.ClassroomService;
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
public class ClassroomServiceTest {
    @Autowired
    ClassroomService classroomService;
    @Test
    public void selectAllClassroomsTest(){
        List<Classroom> classroomList = classroomService.selectAllClassrooms(null,null);
        System.out.println("*********************");
        System.out.println(classroomList.toString());
        System.out.println("*********************");
    }

    @Test
    public void insertClassroomTest() {
        File file = new File("/Users/JIADONG/Documents/workDocuments/classroom.xlsx");
        try {
            List<Classroom> classroomList = classroomService.selectAllClassrooms(null,null);

            List<Classroom> newClassroomList = new ArrayList<>();

            List list = ExcelOperate.readExcel(file);
            for (int i = 1; i < list.size(); i++) {
                List obj = (List) list.get(i);
                Classroom newClassroom = new Classroom();
                newClassroom.setBuilding(obj.get(0).toString());
                newClassroom.setRoomNumber(obj.get(1).toString());
                newClassroomList.add(newClassroom);
            }
            if (classroomList != null && classroomList.size() != 0) {
                for (Classroom existClassroom : classroomList) {
                    for (Classroom classroom : newClassroomList) {
                        if (existClassroom.getBuilding().equals(classroom.getBuilding()) && existClassroom.getRoomNumber().equals(classroom.getRoomNumber())) {
                            System.out.println(classroom.getBuilding()+classroom.getRoomNumber());
                            return;
                        }
                    }
                }
            }
            classroomService.insertClassroom(newClassroomList);
        } catch (IOException e) {

        }
    }

}
