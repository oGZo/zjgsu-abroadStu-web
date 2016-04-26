/**
 * Created by sanqi on 16/4/26.
 */
//学生页面
define(['app'], function (app) {
    app.controller('StudentViewController', ['$scope', '$location', '$cookieStore', 'Ajax',function($scope,$location,$cookieStore,Ajax){
        $scope.navList = [
            {
                moduleId : 1,
                title : '个人课表'
            },
            {
                moduleId : 2,
                title : '个人信息'
            }
        ];
        $scope.selectModule = function(nav){
            $scope.currentId = nav.moduleId;
        }
        }
    ]);
});