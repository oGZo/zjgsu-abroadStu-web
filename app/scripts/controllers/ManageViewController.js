
//管理页面
define(['app','controllers/ManageStudentModuleController','controllers/ManageCourseModuleController','controllers/ManageArrangeModuleController','controllers/ManageClassroomModuleController','controllers/ManageTeacherModuleController'], function (app, ManageStudentController,ManageCourseController,ManageArrangeController,ManageClassroomController,ManageTeacherController) {
    app.controller('ManageViewController', ['$scope', '$location', '$cookieStore', 'Ajax',function($scope,$location,$cookieStore,Ajax){
        $scope.navList = [
            {
                moduleId : 1,
                title : '学生管理',
                controller : ManageStudentController
            },
            {
                moduleId : 2,
                title : '课程管理',
                controller : ManageCourseController
            },
            {
                moduleId : 3,
                title : '排课',
                controller : ManageArrangeController
            },
            {
                moduleId : 4,
                title : '教师管理',
                controller : ManageTeacherController
            },
            {
                moduleId : 5,
                title : '教室管理',
                controller : ManageClassroomController
            }
        ];
        $scope.selectModule = function(moduleId){
            $scope.currentId = moduleId;
            $location.search({
                moduleId : moduleId
            });
            YB.param.currentManageModuleId = moduleId;
            var currentController;
            $.each($scope.navList,function(i,v){
                if(v.moduleId == moduleId){
                    currentController = v.controller;
                }
            })
            currentController&&currentController.render&&currentController.render();
        };
        $scope.selectModule($location.search().moduleId||1);
    }
    ]);
});