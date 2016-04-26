/**
 * Created by sanqi on 16/4/26.
 */
//教师页面
define(['app'], function (app) {
    app.controller('TeacherViewController', ['$scope', '$location', '$cookieStore', 'Ajax',function($scope,$location,$cookieStore,Ajax){
        $scope.navList = [
            {
                moduleId : 1,
                title : '学生/专业安排'
            },
            {
                moduleId : 2,
                title : '排课'
            }
        ];
        $scope.selectModule = function(nav){
            $scope.currentId = nav.moduleId;
        }
        }
    ]);
});