
//学生管理
define(['app'], function (app) {
    var moduleApp = {};
    app.controller('StudentCourseController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            moduleApp.render = function () {
                var scope = $rootScope.$new();
                if(!YB.studentCourseHtml){
                    $http.get('views/studentCourse.html?version=' + SYSTEM_VERSION).then(function (res) {
                        YB.studentCourseHtml = res.data;
                        renderPage();
                    });
                }else{
                    renderPage();
                }
                function renderPage(){
                    var html = YB.studentCourseHtml;
                    var dialog = angular.element(html);
                    $('.J_student_course').html(dialog);
                    var controller = $controller('StudentCourseModuleController', {
                        $scope: scope,
                        $element: dialog
                    }, true, 1);
                    $timeout(function () {
                        $compile(dialog)(scope);
                    });
                }
            }
            if(!YB.studentCourseHtml&&YB.param.currentStudentModuleId==2){
                moduleApp.render();
            }

        }]);
    app.controller('StudentCourseModuleController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {
        //获取课程信息
        $scope.getCourse = function (course) {
            Ajax({
                loadDom :$('.J_arrange_list'),
                method: 'post',
                data: {
                    //professionId : course&&course.id||1
                },
                url: 'student/courseSchedule',
                suc: function (res) {
                    //$scope.courseInfoList = res;
                    clearCourseTable();
                    $.each(res,function(i,v){
                        var courseObj = $(courseTemplate.render(v));
                        var parentObj = $('.J_course_table').find('[data-row="'+ v.startTime +'"]').find('[data-col="'+ v.week +'"]').find('.table-cell');
                        courseObj.css({
                            height : 100*(v.endTime +1 - v.startTime)+'%'
                        });
                        parentObj.append(courseObj);
                    })
                }
            })
        };
        Ajax({
            loadDom :$('.J_arrange_list'),
            method: 'get',
            data: {
                //professionId : course&&course.id||1
            },
            url: 'student/courseSchedule',
            suc: function (res) {
                //$scope.courseInfoList = res;
                clearCourseTable();
                $.each(res,function(i,v){
                    var courseObj = $(courseTemplate.render(v));
                    var parentObj = $('.J_course_table').find('[data-row="'+ v.startTime +'"]').find('[data-col="'+ v.week +'"]').find('.table-cell');
                    courseObj.css({
                        height : 100*(v.endTime +1 - v.startTime)+'%'
                    });
                    parentObj.append(courseObj);
                })
            }
        })
        var courseTemplate = new EJS({ url : 'views/course-template.ejs?version='+SYSTEM_VERSION});
        function clearCourseTable(){
            $('.J_course_table .table-cell').html('');
        }

        function insertCourse(){

        }
        function removeCourse(){

        }
    }]);
    return moduleApp
});