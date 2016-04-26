/**
 * Created by sanqi on 16/4/26.
 */
//管理页面
define(['app'], function (app) {
    app.controller('ManageViewController', ['$scope', '$location', '$cookieStore', 'Ajax',function($scope,$location,$cookieStore,Ajax){
        $scope.navList = [
            {
                moduleId : 1,
                title : '学生/专业安排'
            },
            {
                moduleId : 2,
                title : '排课'
            },
            {
                moduleId : 3,
                title : '教师管理'
            },
            {
                moduleId : 4,
                title : '教室管理'
            }
        ];
        $scope.selectModule = function(nav){
            $scope.currentId = nav.moduleId;
        }
    }
    ]);
});