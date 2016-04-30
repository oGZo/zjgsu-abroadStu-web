/**
 * Created by sanqi on 16/4/26.
 */
//教师页面
define(['app'], function (app) {
    app.controller('TeacherViewController', ['$scope', '$location', '$cookieStore', 'Ajax',function($scope,$location,$cookieStore,Ajax){
        Ajax({
            loadDom :$('.J_arrange_list'),
            method: 'get',
            data: {
            },
            url: 'teacher/courseSchedule',
            suc: function (res) {
                clearCourseTable();
                $.each(res,function(i,v){
                    //alert(i);
                    var courseObj = $(courseTemplate.render(v)).attr('title','点击查看选课学生').append('<p class="g-font-red">点击查看选课学生</p>');
                    var parentObj = $('.J_course_table').find('[data-row="'+ v.endTime +'"]').find('[data-col="'+ v.week +'"]').find('.table-cell');
                    courseObj.css({
                        height : 100*(v.endTime +1 - v.startTime)+'%'
                    });
                    parentObj.append(courseObj);
                    courseObj.on('click',function(e){
                        YB.log($scope);
                        $scope.$apply(function(){
                            $location.url('teacherStudent?id='+ v.id);
                        });
                    })
                })
            }
        })
        var courseTemplate = new EJS({ url : 'views/course-template.ejs?version='+SYSTEM_VERSION});
        function clearCourseTable(){
            $('.J_course_table .table-cell').html('');
        }

        }
    ]);
});