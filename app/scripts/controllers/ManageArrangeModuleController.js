/**
 * Created by sanqi on 16/4/29.
 */
//学生管理
define(['app'], function (app) {
    var moduleApp = {};
    app.controller('ManageArrangeController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            moduleApp.render = function () {
                var scope = $rootScope.$new();
                if(!YB.manageArrangeHtml){
                    $http.get('views/manageArrange.html?version=' + SYSTEM_VERSION).then(function (res) {
                        YB.manageArrangeHtml = res.data;
                        renderPage();
                    });
                }else{
                    renderPage();
                }
                function renderPage(){
                    var html = YB.manageArrangeHtml;
                    var dialog = angular.element(html);
                    $('.J_manage_arrange').html(dialog);
                    var controller = $controller('ManageArrangeModuleController', {
                        $scope: scope,
                        $element: dialog
                    }, true, 1);
                    $timeout(function () {
                        $compile(dialog)(scope);
                    });
                }
            }
            if(!YB.manageArrangeHtml&&YB.param.currentManageModuleId==3){
                moduleApp.render();
            }

        }]);
    app.controller('ManageArrangeModuleController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {
        var search = $location.search();
        //获取专业信息
        $scope.getProfession = function () {
            Ajax({
                loadDom :$('.J_arrange_list'),
                method: 'get',
                url: 'admin/professionList',
                suc: function (res) {
                    //$scope.bigTotalItems = res.sum;
                    $scope.courseList = res;
                    $scope.choice($scope.courseList[0]);
                }
            })
        };
        //获取课程信息
        $scope.getCourse = function (course) {
            Ajax({
                loadDom :$('.J_arrange_list'),
                method: 'post',
                data: {
                    professionId : course&&course.id||1
                },
                url: 'admin/courseInstance',
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
        var courseTemplate = new EJS({ url : 'views/course-template.ejs?version='+SYSTEM_VERSION});
        function clearCourseTable(){
            $('.J_course_table .table-cell').html('');
        }

        function insertCourse(){

        }
        function removeCourse(){

        }
        $scope.choice = function(course){
            $scope.currentCourse = course;
            $scope.getCourse(course);
        };
        var tempCell = $('<div class="temp-cell">');
        var tempCol,tempRow,tempPeriod;

        $(document)
            .on('mousedown',function(e){
                var target = $(e.target);
                if(target.closest('td').length&&target.closest('.J_course_table').length){
                    $('J_course_table').addClass('operate-table');
                    var tempTd = target.closest('td').eq(0),tempTr = tempTd.closest('tr').eq(0);
                    tempCol = tempTd.attr('data-col');
                    tempRow = tempTr.attr('data-row');
                    tempPeriod = tempTr.attr('data-period');
                    var parentObj = target;
                    if(target.is('td')){
                        parentObj = target.find('.table-cell')
                    }
                    tempTd.css({
                        'z-index' : 99999
                    });
                    parentObj.append(tempCell);
                }
            })
            .on('mousemove',function(e){
                var target = $(e.target);
                var nowCol,nowRow,nowPeriod;
                if(target.closest('td').length&&target.closest('.J_course_table').length){
                    var nowTd = target.closest('td').eq(0),nowTr = nowTd.closest('tr').eq(0);
                    nowCol = nowTd.attr('data-col');
                    nowRow = nowTr.attr('data-row');
                    nowPeriod = nowTr.attr('data-period');
                    if(nowCol==tempCol&&nowPeriod==tempPeriod){
                        var positionData  = {
                            height : '100%'
                        };
                        if(nowRow<tempRow){
                            positionData.top = 'initial';
                            positionData.bottom = 0;
                        }else{
                            positionData.top = 0;
                            positionData.bottom = 'initial';
                        }
                        positionData.height = (Math.abs(nowRow-tempRow)+1)*100+'%';
                        tempCell.css(positionData);
                    }
                }
            })

        $scope.getProfession();

        document.onselectstart = function(){
            return false;
        }
    }]);
    return moduleApp
});