
//学生管理
define(['app'], function (app) {

    app.controller('TeacherStudentViewController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {
        var search = $location.search();
        //获取课程信息
        $scope.getCourse = function (course) {
            Ajax({
                loadDom :$('.J_teacher_student_list'),
                method: 'post',
                data: {
                    courseId : search.id
                },
                url: 'teacher/courseStudent',
                suc: function (res) {
                    $scope.rows = res;
                }
            })
        };
        $scope.getCourse();
        $scope.updateScore = function(row){
            row.updateFlag = true;
            row.newScore = row.score;
        }
        $scope.saveUpdateScore = function(row){
            Ajax({
                loadDom :$('.J_teacher_student_list'),
                method: 'post',
                data: {
                    score : row.newScore,
                    courseId : search.id,
                    student : row.id

                },
                url: 'teacher/grade',
                suc: function (res) {
                    row.score = row.newScore;
                    $scope.cancelUpdateScore(row);
                }
            })
        }
        $scope.cancelUpdateScore = function(row){
            row.updateFlag = false;
            delete row.newScore
        }
    }]);
});