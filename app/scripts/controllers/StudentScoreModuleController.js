
//学生管理
define(['app'], function (app) {
    var moduleApp = {};
    app.controller('StudentScoreController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            moduleApp.render = function () {
                var scope = $rootScope.$new();
                if(!YB.studentScoreHtml){
                    $http.get('views/studentScore.html?version=' + SYSTEM_VERSION).then(function (res) {
                        YB.studentScoreHtml = res.data;
                        renderPage();
                    });
                }else{
                    renderPage();
                }
                function renderPage(){
                    var html = YB.studentScoreHtml;
                    var dialog = angular.element(html);
                    $('.J_student_score').html(dialog);
                    var controller = $controller('StudentScoreModuleController', {
                        $scope: scope,
                        $element: dialog
                    }, true, 1);
                    $timeout(function () {
                        $compile(dialog)(scope);
                    });
                }
            }
            if(!YB.studentScoreHtml&&YB.param.currentStudentModuleId==3){
                moduleApp.render();
            }

        }]);
    app.controller('StudentScoreModuleController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {

        $scope.maxSize = 10;
        $scope.bigCurrentPage = 1;
        $scope.params = {
            page: 1,
            num: $scope.maxSize
        };
        $scope.pageChanged = function (pageNo) {
            $scope.params.page = pageNo;
            var params = $.extend({},$scope.params);
            params = YB.getPageTableParam(params);
            delete params.page;
            delete params.num;
            Ajax({
                loadDom :$('.J_student_score_list'),
                method: 'get',
                url: 'student/courseSchedule',
                suc: function (res) {
                    $.each(res,function(i,v){
                        v.teacherStr = [];
                        $.each(v.teachers,function(index,val){
                            v.teacherStr.push(val.name);
                        })
                        v.teacherStr = v.teacherStr.join(',');
                    })
                    $scope.rows = res;
                }
            })
        };
        $scope.query = function(){
            $scope.pageChanged(1);
        }
        $scope.query();
    }]);
    return moduleApp
});