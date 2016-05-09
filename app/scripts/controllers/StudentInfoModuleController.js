
//学生管理
define(['app'], function (app) {
    var moduleApp = {};
    app.controller('StudentInfoController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            moduleApp.render = function () {
                var scope = $rootScope.$new();
                if(!YB.studentInfoHtml){
                    $http.get('views/studentInfo.html?version=' + SYSTEM_VERSION).then(function (res) {
                        YB.studentInfoHtml = res.data;
                        renderPage();
                    });
                }else{
                    renderPage();
                }
                function renderPage(){
                    var html = YB.studentInfoHtml;
                    var dialog = angular.element(html);
                    $('.J_student_info').html(dialog);
                    var controller = $controller('StudentInfoModuleController', {
                        $scope: scope,
                        $element: dialog
                    }, true, 1);
                    $timeout(function () {
                        $compile(dialog)(scope);
                    });
                }
            }
            if(!YB.studentInfoHtml&&YB.param.currentStudentModuleId==1){
                moduleApp.render();
            }

        }]);
    app.controller('StudentInfoModuleController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {
        Ajax({
            loadDom :$('.J_student_list'),
            method: 'get',
            //data: params,
            url: 'student/personalInfo',
            suc: function (res) {
                $scope.row = res;
            }
        })
    }]);
    return moduleApp
});