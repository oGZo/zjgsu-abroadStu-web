/**
 * Created by sanqi on 16/4/26.
 */
//学生页面
define(['app','controllers/StudentInfoModuleController','controllers/StudentCourseModuleController','controllers/StudentScoreModuleController'], function (app,StudentInfoModuleController,StudentCourseModuleController,StudentScoreModuleController) {
    app.controller('StudentViewController', ['$scope', '$location', '$cookieStore', 'Ajax',function($scope,$location,$cookieStore,Ajax){
        $scope.navList = [
            {
                moduleId : 1,
                title : '个人信息',
                controller : StudentInfoModuleController
            },
            {
                moduleId : 2,
                title : '个人课表',
                controller : StudentCourseModuleController
            },
            {
                moduleId : 3,
                title : '个人成绩',
                controller : StudentScoreModuleController
            }
        ];
        $scope.selectModule = function(moduleId){
            $scope.currentId = moduleId;
            $location.search({
                moduleId : moduleId
            });
            YB.param.currentStudentModuleId = moduleId;
            var currentController;
            $.each($scope.navList,function(i,v){
                if(v.moduleId == moduleId){
                    currentController = v.controller;
                }
            });
            currentController&&currentController.render&&currentController.render();
        }
        $scope.selectModule($location.search().moduleId)
        }
    ]);
});