
//学生管理
define(['app'], function (app) {
    var moduleApp = {},currentStudentMap = {},currentProfessId;
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
    app.controller('ManageArrangeModuleController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window','$http',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window,$http) {
        var search = $location.search();
        var activityHelper
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
                    //$scope.choice($scope.courseList[0]);
                }
            })
        };
        //获取课程信息
        $scope.getCourse = function (param) {
            var course = param.data;
            //$scope.$apply(function(){
                $scope.currentCourse = course;
            //});
            currentProfessId = course&&course.id||1;
            Ajax({
                loadDom :$('.J_arrange_list'),
                method: 'post',
                data: {
                    professionId : currentProfessId
                },
                url: 'admin/courseInstance',
                suc: function (res) {
                    $('.selectItem').remove();
                    param.suc&&param.suc(res);
                }
            })
        };
        $scope.choice = function(course){
            $('#activity').html('');
            activityHelper = new ActivityHelper({
                renderTo : 'activity'
            });
            //activityHelper.init($scope.courseList[0]);
            activityHelper.init(course);
        };
        var tempCell = $('<div class="temp-cell">');
        var tempCol,tempRow,tempPeriod;
        var ActivityHelper = function(config){
            this.renderTo = config.renderTo;//该控件将要添加到的元素的ID
            this.savePath = config.savePath;//保存活动的后台地址
            this.loadByWeekPath = config.loadByWeekPath;//加载周活动的后台地址
            this.viewPath = config.viewPath;//查看活动的后台地址
            this.deletePath = config.deletePath;//删除活动的后台地址
            this.loadDate = config.loadDate==""?this.nowDate():config.loadDate;//需要载入的活动的所属日期，如果为空则系统会自动载入本天数据
            this.moreInfoPath = config.moreInfoPath;//跳转到活动的详细编辑界面的地址
            this.updatePath = config.updatePath;//活动更新的后台地址
            this.loadByMonthPath = config.loadByMonthPath;//月活动加载地址
            //this.init();
        }

        ActivityHelper.prototype = {
            init : function(param){
                var entity = this;
                if(entity.renderTo==""||entity.renderTo==null){
                    alert('请配置renderTo属性!!');
                    return;
                }
                //初始化周视图
                entity.initWeekView();
                //载入周视图数据
                entity.loadWeekActivity(param);
            },
            //初始化周视图
            initWeekView : function(){
                var entity = this;
                entity.clear();
                $(".headDiv").remove();
                $(".monthTable").remove();
                //开始绘制周视图
                var id = entity.random();
                var timeTable = '<table id="'+id+'" class="timeTable"></table>';
                $(timeTable).appendTo($("#"+entity.renderTo));
                var table_weeks = [];
                table_weeks.push('<tr class="table_weeks" id="table_weeks">');
                table_weeks.push('<td class="week-title">时间</td>');
                table_weeks.push('<td class="week-day-title">节</td>');
                for(var i=0;i<7;i++){
                    table_weeks.push('<td class="week-day"></td>');
                }
                table_weeks.push('</tr>');
                $(table_weeks.join('')).appendTo($("#"+id));
                $('<tr class="headBottomLine" id="headBottomLine"><td colspan="10"></td></tr>').appendTo($("#"+id));
                //得到父窗口的宽度，然后计算每个td的宽度
                var parentWidth = $("#"+entity.renderTo).width();
                $("td.week-day").each(function(){
                    var width = (parentWidth-$("td.week-title").width())/7;
                    $(this).width(width);
                });
                //计算生成时间点，共24*2行
                var table_time = [];
                for(var i=1;i<13;i++){
                    var time_day = [];
                    time_day.push('<tr id="'+i+'" class="time-row">');
                    if(i==1){
                        time_day.push('<td rowspan="5" class="time-title">上午</td>');
                    }else if(i==6){
                        time_day.push('<td rowspan="4" class="time-title">下午</td>');
                    }else if(i==10){
                        time_day.push('<td rowspan="3" class="time-title">晚上</td>');
                    }
                    time_day.push('<td class="timeItemTitle">'+i+'</td>');
                    for(var j=0;j<7;j++){
                        time_day.push('<td class="timeItem"></td>');
                    }
                    time_day.push('</tr>');
                    table_time.push(time_day.join(''));
                }
                $(table_time.join('')).appendTo($("#"+id));
                //设置时间线的显示样式
                $("table.timeTable").find("tr").each(function(){
                    var id = $(this).attr("id");
                    if(id>=0){
                        //如果是整点则采用实线
                        $(this).addClass("solid");
                    }
                });
                var weeksMap  = {
                    1 : '一',
                    2 : '二',
                    3 : '三',
                    4 : '四',
                    5 : '五',
                    6 : '六',
                    7 : '日'
                };
                $("td.week-day").each(function(i,v){
                    var title = '周'+weeksMap[i+1];
                    $(this).text(title);
                });
                //为每个时间单元格添加点击事件
                $("td.timeItem").click(function(){
                    entity.clear();
                    var me = $(this);
                    var id = parseInt($(this).parent().attr("id"));
                    var startTime = entity.idToTime(id);
                    var endTime = entity.idToTime(id);
                    //创建一个selectItem
                    var selectItemId = entity.selectItem();
                    var tdInfo = entity.getTdInfo($(this));
                    if(tdInfo==null){
                        alert("获得时间信息失败");
                        return;
                    }
                    //设置位置及大小
                    $("#"+selectItemId).css({left:tdInfo.left+'px',top:tdInfo.top+'px'});
                    $("#"+selectItemId).width(tdInfo.width+1);
                    $("#"+selectItemId+" .content").height(tdInfo.height-3-15);
                    $("#"+selectItemId+" .head").text('第'+id+"节");
                    //组织要保存的时间信息
                    var obj = $('#'+id).eq(tdInfo.index);
                    var timeParam = {};
                    //timeParam.startDate = today;
                    //timeParam.endDate = today;
                    timeParam.startTime = id;
                    timeParam.endTime = id;
                    timeParam.week = tdInfo.index + 1;
                    entity.timeParam = timeParam;

                    //创建一个弹出窗口
                    var popItemId = entity.popItem();
                    //设置弹出框的位置
                    var position = {};
                    position.left = tdInfo.left;
                    position.top = tdInfo.top;
                    entity.setPopItemPosition(position, popItemId);
                    //为弹出框添加内容
                    var timeTile = "第"+id+"节";
                    var index = me.parent().find('.timeItem').index(me);
                    timeParam.week = index+1;
                    entity.activityAddItem(popItemId,timeTile,selectItemId,{
                        week : index+1,
                        startTime : startTime,
                        endTime : endTime
                    });
                });

                //添加鼠标划选
                var isPress = false;
                var flag = 0;
                var timeParam = {};
                var selectItemId;
                var startTdInfo = null;
                $('body').mousedown(function(e){
                    if(e.which!=1){
                        return false;
                    }
                    isPress = true;
                    flag = 0;
                }).mouseup(function(){
                    isPress = false;
                    if(startTdInfo==null){
                        return false;
                    }
                    //创建一个弹出窗口
                    var popItemId = entity.popItem();
                    //设置弹出框的位置
                    var position = {};
                    position.left = startTdInfo.left;
                    position.top = startTdInfo.top;
                    entity.setPopItemPosition(position, popItemId);
                    var timeTile = "第"+timeParam.startTime+"-"+timeParam.endTime+"节";
                    entity.activityAddItem(popItemId,timeTile,selectItemId,{
                        week : timeParam.week,
                        startTime : timeParam.startTime,
                        endTime : timeParam.endTime
                    })
                    timeParam= {};
                    startTdInfo = null;
                });
                $("td.timeItem").mousemove(function(){
                    if(isPress){
                        if(flag==0){
                            //创建一个div
                            entity.clear();
                            var id = parseInt($(this).parent().attr("id"));
                            var startTime = id;
                            var endTime = id;
                            //创建一个selectItem
                            selectItemId = entity.selectItem();
                            var tdInfo = entity.getTdInfo($(this));
                            startTdInfo = tdInfo;
                            if(tdInfo==null){
                                alert("获得时间信息失败");
                                return;
                            }
                            startTdInfo.top = tdInfo.top;
                            //设置位置及大小
                            $("#"+selectItemId).css({left:tdInfo.left+'px',top:tdInfo.top+'px'});
                            $("#"+selectItemId).width(tdInfo.width+1);
                            $("#"+selectItemId+" .content").height(tdInfo.height-3-15);
                            $("#"+selectItemId+" .head").text('第'+startTime+'节');
                            //var today = items[tdInfo.index];
                            //timeParam.startDate = today;
                            //timeParam.endDate = today;
                            timeParam.startTime = startTime;
                            timeParam.endTime = endTime;
                            timeParam.week = tdInfo.index;
                            entity.timeParam = timeParam;
                        }else if(flag==1){
                            var id = parseInt($(this).parent().attr("id"));
                            var endTime = id;
                            var tdInfo = entity.getTdInfo($(this));
                            var height = tdInfo.top-startTdInfo.top+tdInfo.height+1-3-3-15;
                            $("#"+selectItemId+" .content").height(height);
                            timeParam.endTime = endTime;
                            timeParam.week = tdInfo.index;
                            entity.timeParam = timeParam;
                            //设置显示时间
                            var time = '第'+entity.timeParam.startTime+"-"+entity.timeParam.endTime+'节';
                            if(entity.timeParam.startTime==entity.timeParam.endTime){
                                time = '第'+entity.timeParam.startTime+'节';
                            }
                            $("#"+selectItemId+" .head").text(time);
                        }
                        flag =1;
                    }
                });
            },
            //得到一周的各天
            dayOfWeek : function(date){
                var entity = this;
                //支持的格式为YY-MM-DD
                if(entity.isNull(date)){
                    alert("日期不合法");
                    return;
                }
                var weeks = ['周日','周一','周二','周三','周四','周五','周六'];
                var activityDate = {};//声明活动日期对象
                var dateArray = date.split("-");
                var year = dateArray[0];
                var month = dateArray[1].replace("0","");//去掉日期中的0，比如将"05"->5
                var day = dateArray[2];
                var newDate = new Date(year,parseInt(month)-1,day);
                var newDay = newDate.getDate();//得到天
                var onWeekDay = newDate.getDay();//得到该天是所在周的第几天
                var today = {};
                today.year = year;
                today.month = month;
                today.day = day;
                today.dayOfThisWeek = onWeekDay;
                activityDate.today = today;
                //计算该周的第一天
                newDate.setDate(newDay-onWeekDay);
                var firstDayOfThisWeek = {};
                firstDayOfThisWeek.year = newDate.getFullYear();
                firstDayOfThisWeek.month = parseInt(newDate.getMonth())+1;
                firstDayOfThisWeek.day = newDate.getDate();
                activityDate.firstDayOfThisWeek = firstDayOfThisWeek;
                //计算该周的最后一天
                newDate = new Date(year,parseInt(month)-1,day);
                newDate.setDate(newDay-onWeekDay+6);
                var lastDayOfThisWeek = {};
                lastDayOfThisWeek.year = newDate.getFullYear();
                lastDayOfThisWeek.month = parseInt(newDate.getMonth())+1;
                lastDayOfThisWeek.day = newDate.getDate();
                activityDate.lastDayOfThisWeek = lastDayOfThisWeek;
                //计算该月有几天
                var thisMonthDays = new Date(year,parseInt(month)-1,0);
                activityDate.thisMonthDays = thisMonthDays.getDate();
                //计算该周的每一天
                var items = [];
                for(var i=0;i<7;i++){
                    var itemDate = new Date(year,parseInt(month)-1,day);
                    var itemDay = itemDate.getDate();
                    var itemOnWeekDay = itemDate.getDay();
                    itemDate.setDate(itemDay-itemOnWeekDay+i);
                    var dayItem = {};
                    dayItem.year = itemDate.getFullYear();
                    dayItem.month = parseInt(itemDate.getMonth())+1;
                    dayItem.day = itemDate.getDate();
                    dayItem.weekDay = weeks[i];
                    items[i]= dayItem;
                }
                activityDate.items = items;
                return activityDate;
            },
            //对月日期进行相关的计算
            dateOfMonth : function(date){
                var entity = this;
                if(entity.isNull(date)){
                    alert("日期不合法");
                    return;
                }
                date = date.replace(/-0/g,"-");
                var dateArray = date.split("-");
                var year = dateArray[0];
                var month = dateArray[1].replace("0","");//去掉日期中的0，比如将"05"->5
                var day = dateArray[2];
                //计算该月有几天
                var date = new Date(year,month,0);
                var days = date.getDate();//计算该月有几天
                date.setDate(1);
                var firstDayOfWeek = date.getDay();//计算该月的一号是周几
                date.setDate(days);
                var lastDayOfWeek = date.getDay();
                var thisMonth = {};
                thisMonth.year = year;
                thisMonth.month = month;
                thisMonth.day = day;
                thisMonth.days = days;
                thisMonth.firstDayOfWeek= firstDayOfWeek;
                thisMonth.lastDayOfWeek = lastDayOfWeek;
                return thisMonth;
            },
            //改变当天的背景颜色
            setTodayBackground : function(index){
                $("td.week-day").eq(index).addClass("thisDayHead");
                $("td.oneDay").eq(index).addClass("thisDay");
                $("tr.time-row").each(function(){
                    var trInfo = $(this);
                    var tdIndex;
                    if(trInfo.is(".solid"))
                        tdIndex = index+1;
                    else
                        tdIndex = index;
                    trInfo.find("td").eq(tdIndex).addClass("thisDay");
                });
            },
            //创建一个鼠标选择框
            selectItem : function(){
                var entity = this;
                var id = this.random();
                var div = [];
                div.push('<div id="'+id+'" class="selectItem temp">');
                div.push('<table><tr><td class="TL"></td><td class="TC"></td><td class="TR"></td></tr></table>');
                div.push('<div id="head" class="head"></div>');
                div.push('<div id="content" class="content"><table><tr><td></td></tr></table></div>');
                div.push('<table><tr><td class="BL"></td><td class="BC"></td><td class="BR"></td></tr></table>');
                div.push('</div>');
                $(div.join('')).appendTo($("#"+entity.renderTo));
                return id;
            },
            //创建一个弹出窗口
            popItem : function(){
                var entity = this;
                var id = this.random();
                var div = '<div id="'+id+'" class="popItem temp"><div class="close"></div>'
                    + '<table><tr><td class="TL"></td><td class="TC"></td><td class="TR"></td></tr>'
                    + '<tr><td class="ML"></td><td class="MC"></td><td class="MR"></td></tr>'
                    + '<tr><td class="BL"></td><td class="BC"></td><td class="BR"></td></tr>'
                    + '</table>'
                    + '</div>';
                $(div).appendTo($("#"+entity.renderTo));
                $('<div id="vPic" class="vPic temp"></div>').appendTo($("#"+entity.renderTo));
                //添加一个关闭事件
                $("#"+id+" .close").click(function(){
                    entity.clear();
                });
                return id;
            },
            //设置弹出窗口的位置
            setPopItemPosition : function(position,popItemId){
                var left = position.left-50;
                var top = position.top-230;
                if(top<=0){
                    top=0;
                    $("#vPic").css("display","none");
                }
                if((left+410)>$("body").width()){
                    left=$("body").width()-410;
                    $("#vPic").css("display","none");
                }
                if(left<=0){
                    left=0;
                    $("#vPic").css("display","none");
                }
                $("#"+popItemId).css({left:left+'px',top:top+'px'});
                $("#vPic").css({left:(left+100)+'px',top:(top+135)+'px'});
            },
            //判断字符串是否为空
            isNull : function(data){
                if(data==""||data==null){
                    return true;
                }else {
                    return false;
                }
            },
            //根据传入的ID，计算离该ID最近的整数时间(整点或半点)
            idToTime : function(id){
                var entity = this;
                if(entity.isNull(id)){
                    alert('id错误');
                    return;
                }
                var hour = parseInt(id)/2;
                var second = parseInt(id)%2;
                //将计算结果组织成time对象
                var time = {};
                time.timeId = id;
                time.hour = parseInt(hour);
                time.second = second;
                if(second==0){
                    time.fullTime = parseInt(hour)+":00";
                }else if(second==1){
                    time.fullTime = parseInt(hour)+":30";
                }
                return {};
            },
            //根据传入的时间字符串转换为可以用于绘制TD的相关属性
            strToTime : function(time){
                var entity = this;
                if(time==""||time==null){
                    alert('时间错误');
                    return;
                }
                //格式一般为yyyy-MM-dd HH:mm:ss
                time = time.replace("-0","-");
                var dateStr = time.replace(/[-:\s.]/g,",");//将字符串在中的- ： .字符进行替换，便于分割
                var dateArray = dateStr.split(",");
                var date;
                if(dateArray.length==3){
                    date  = new Date(dateArray[0],parseInt(dateArray[1])-1,dateArray[2]);
                }else {
                    date  = new Date(dateArray[0],parseInt(dateArray[1])-1,dateArray[2],dateArray[3],dateArray[4]);
                }
                var year = date.getFullYear();
                var month = parseInt(date.getMonth())+1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var dayOfThisWeek = date.getDay();
                var hour_id = parseInt(hour)*2;//根据小时计算出的ID
                var minute_id = parseInt(parseInt(minute)/30);//根据分钟计算出的ID
                var minute_px = parseInt(minute)%30;//根据分钟计算出偏移的像素值如：43计算出的偏移值为13。
                var timeTd = {};
                timeTd.year = year;
                timeTd.month = month;
                timeTd.day = day;
                timeTd.hour = hour;
                timeTd.minute = minute==0?'00':minute;
                timeTd.minutes = minute;
                timeTd.trId = hour_id+minute_id;
                timeTd.px = minute_px;
                timeTd.dayOfThisWeek = dayOfThisWeek;
                return timeTd;
            },
            //根据传入的TD对象，获得该元素的绝对位置以及宽和高等属性
            getTdInfo : function(item){
                var tdInfo = {};
                tdInfo.width = item.width();
                tdInfo.height = item.height();
                tdInfo.left = item.offset().left;
                tdInfo.top = item.offset().top;
                if(item.parent().is(".solid")){
                    tdInfo.index = item.index()-1;
                }else {
                    tdInfo.index = item.index();
                }
                return tdInfo;
            },
            //在周视图中，创建一个活动添加窗口
            activityAddItem : function(popItemId,time,selectItemId,obj){
                var entity = this;
                var item = [];
                item.push('<div>');
                item.push('<table class="contentTable"><tr><td class="label">时间：</td><td class="time">'+time+'</td></tr><tr><td class="label">内容：</td><td><div><button class="btn btn-default J_selectCourse">选择课程</button><p class="content"></p></div><div><button class="btn btn-default J_selectTeacher">选择教师</button><p class="content"></p></div><div><button class="btn btn-default J_selectClassroom">选择教室</button><p class="content"></p></div><div><button class="btn btn-default J_selectStudent">选择学生</button><p class="content"></p></div></td></tr></table>');
                item.push('<div class="operate"><div  class="btn btn-success J_arrangeCourseBtn">确定</div></div>');
                item.push('</div>');
                $(item.join('')).appendTo($("#"+popItemId+" .MC"));
                //为创建活动按钮添加点击事件
                $(".J_arrangeCourseBtn").click(function(){

                    var param = {
                        suc : function(id){
                            $scope.choice(angular.copy($scope.currentCourse));
                            //if(id!=""){
                            //    $("#"+selectItemId).removeClass("temp");
                            //    $("#"+selectItemId).width($("#"+selectItemId).width()-8);
                            //    //设置title
                            //    $("#"+selectItemId+" .content td").text(val);
                            //    //设置一个隐含域，用于存储活动的ID，便于查看，修改，删除等操作
                            //    var hiddenField = '<input type="hidden" class="activityId" value="'+id+'">';
                            //    $(hiddenField).appendTo($("#"+selectItemId));
                            //    //添加点击事件
                            //    $("#"+selectItemId).click(function(){
                            //        entity.clear();
                            //        var position = {};
                            //        position.left = $(this).offset().left;
                            //        position.top = $(this).offset().top+15;
                            //        var id = $(this).find(".activityId").val();
                            //        entity.viewActivity(position,id);
                            //    });
                            //    entity.clear();
                            //}
                        }
                    };
                    $.extend(param,obj);
                    entity.saveActivity(param);

                });
            },
            //组织将要保存的数据
            toSaveParam : function(){
                var entity = this;
                var timeParam = entity.timeParam;
                var startDate = timeParam.startDate;
                var endDate = timeParam.endDate;
                var startTime = timeParam.startTime;
                var endTime = timeParam.endTime;
                var st = startDate.year+"-"+startDate.month+"-"+startDate.day+" "+startTime.hour+":"+startTime.second*30+":00";
                var et = endDate.year+"-"+endDate.month+"-"+endDate.day+" "+endTime.hour+":"+endTime.second*30+":00";
                entity.timeParam = {};
                return 'activity.startTime='+st+"&activity.endTime="+et;
            },
            //组织将要载入的数据
            toLoadParam : function(){
                var entity = this;
                var timeParam = entity.timeParam;
                var startDate = timeParam.startDate;
                var endDate = timeParam.endDate;
                //将时间清空
                entity.timeParam  = {};
                return 'activity.startTime='+startDate+"&activity.endTime="+endDate;
            },
            //保存课程数据
            saveActivity : function(param){
                var entity = this;

                var data = {
                    courseTemplateId : currentCourseId,
                    classroomId : currentClassroomId,
                    studentIdList : [],
                    teacherIdList : currentTeachers.join(','),//JSON.stringify(currentTeachers), //currentTeachers.join(','),
                    week : param.week,
                    startTime : param.startTime,
                    endTime : param.endTime
                };

                if(!currentTeachers.length){
                    YB.info({
                        content : '请选择教师'
                    });
                    return;
                }
                if(!currentClassroomId){
                    YB.info({
                        content : '请选择教室'
                    });
                    return;
                }
                if(!currentCourseId){
                    YB.info({
                        content : '请选择课程'
                    });
                    return;
                }

                $.each(currentStudentMap,function(i,v){
                    data.studentIdList.push(parseInt(i,10));
                });
                if(!data.studentIdList.length){
                    YB.info({
                        content : '请选择学生'
                    });
                    return;
                }
                data.studentIdList = data.studentIdList.join(',');//JSON.stringify(data.studentIdList);//;
                Ajax({
                    loadDom :$('.J_student_list'),
                    method: 'post',
                    data: data,
                    url: 'admin/arrangeCourse',
                    suc: function (res) {
                        param.suc&&param.suc(res);
                    }
                })
            },
            //载入周活动数据
            loadWeekActivity : function(course){
                var entity = this;
                //var data = entity.toLoadParam();
                var activityArray = [];
                $scope.getCourse({
                    data : course,
                    suc : function(res){
                        YB.log(res);
                        $.each(res,function(i,v){
                            var teachers = [];
                            $.each(v.teachers,function(i,v){
                                teachers.push(v.name);
                            })
                            activityArray.push({
                                startTime : v.startTime,
                                endTime : v.endTime,
                                week: v.week,
                                title : v.courseName,
                                id : v.id,
                                classroom : v.building + ' ' + v.roomNumber,
                                teachers : teachers.join('、'),
                                weeks : v.startWeek + '-' + v.endWeek + '周'
                            })
                        });
                        entity.drawWeekActivity(activityArray);
                    }
                });
            },
            //绘制月视图中的活动Items
            drawActivityItems : function(id,item){
                var entity = this;
                var i=0;
                var index;
                $("#"+id+" .itemTr").each(function(){
                    var size = $(this).find("table").size();
                    if(size>0){
                        return true;
                    }else {
                        $(this).find(".itemTd").append($(item));
                        index = $(this).index();
                        return false;
                    }
                });
                return index;
            },
            //对activity数组进行排序，按照持续时间长短进行排序，持续时间长的在最前面
            activitySort : function(array){
                var entity = this;
                if(array==null||array.length==0){
                    return false;
                }
                var len = array.length;
                for(var i=0;i<len-1;i++){
                    for(var j=0;j<len-i-1;j++){
                        var activity = array[j];
                        var activity1 = array[j+1];
                        if(activity1.gapMills>activity.gapMills){
                            var activity = {};
                            activity = array[j];
                            array[j] = array[j+1];
                            array[j+1] = activity;
                        }
                    }
                }

                return array;
            },
            //获得需要刷新的活动数据
            refreshItems : function(id){
                var entity = this;
                //得到从该天开始的活动数据
                var returnArray = new Array();
                var i=0;
                $("#"+id+" .itemTr").each(function(){
                    var items = $(this).find("table.dayItem_all,table.dayItem_head");
                    items.each(function(){
                        var thisItem = $(this);
                        var array = new Array();
                        if(thisItem.size()==0){
                            return false;
                        }
                        var activity = {};
                        var startTime = {};
                        var endTime = {};
                        array["gapMills"] = parseInt(thisItem.find(".gapMills").val());
                        array["item"] = thisItem.parent().html();
                        startTime.day = entity.strToTime(thisItem.find(".startDate").val()).day;
                        endTime.day = entity.strToTime(thisItem.find(".endDate").val()).day;
                        array["startTime"] = thisItem.find(".startDate").val();
                        array["endTime"] = thisItem.find(".endDate").val();
                        array["title"] = thisItem.find(".MM").text();
                        thisItem.remove();
                        returnArray[i]=array;
                        i++;
                    });
                });
                return returnArray;
            },
            //对activity的时间格式进行预处理
            activityDateFormat : function(activity){
                var entity = this;
                if(activity.startTime==""||activity.endTime==""){
                    alert('格式化时间错误');
                    return;
                }
                var startTimeInfo = entity.strToTime(activity.startTime);
                var endTimeInfo = entity.strToTime(activity.endTime);
                //计算开始时间和结束时间之间的毫秒数
                var startDate = new Date(startTimeInfo.year,startTimeInfo.month,startTimeInfo.day);
                var endDate = new Date(endTimeInfo.year,endTimeInfo.month,endTimeInfo.day);
                var mills = entity.millisecondsOfTwoMonth(startDate,endDate);
                //重新为activity的属性赋值
                activity.startTime = startTimeInfo;
                activity.endTime = endTimeInfo;
                activity.gapMills = mills;
                return activity;
            },
            //得到两个时间之间的毫秒数
            millisecondsOfTwoMonth : function(startTime,endTime){
                var startMilli = startTime.getTime();
                var endMilli = endTime.getTime();
                return endMilli-startMilli;
            },
            //将timeParam转换为activity对象
            timeParamToActivity : function(activity,timeParam){
                var entity = this;
                var startDate = timeParam.startDate;
                var endDate = timeParam.endDate;
                activity.startTime = startDate.year+"-"+startDate.month+"-"+startDate.day;
                activity.endTime = endDate.year+"-"+endDate.month+"-"+endDate.day;
                return activity;
            },
            //将周活动数据绘制到相应位置
            drawWeekActivity : function(activityArray){
                var entity = this;
                YB.log('111');
                YB.log(activityArray);
                if(activityArray==null)
                    return;
                for(var i=0;i<activityArray.length;i++){
                    var activity = activityArray[i];
                    var start = activity.startTime;
                    var end = activity.endTime;
                    var week =  activity.week;
                    //计算开始的tr和td
                    var trId = start;//得到该td所属TR的id
                    var startTr = $("#"+trId);
                    var weekIndex = week;
                    YB.log('------');
                    var startTd = startTr.find("td.timeItem").eq(weekIndex-1);
                    YB.log('000000')
                    var startTop = entity.getTdInfo(startTr).top;
                    var startTdInfo = entity.getTdInfo(startTd);
                    //计算结束的tr和td
                    var endTrId = end;//得到结束的TR的Id
                    var endTr = $("#"+endTrId);
                    var endTd = endTr.find("td.timeItem").eq(weekIndex-1);
                    var endTop = entity.getTdInfo(endTr).top;
                    var endTdInfo = entity.getTdInfo(endTd);
                    //创建一个selectItem
                    var selectItemId = entity.selectItem();
                    YB.log('------');
                    YB.log(startTdInfo);
                    //设置位置及大小
                    var top = startTdInfo.top+startTop;
                    $("#"+selectItemId).css({left:startTdInfo.left+'px',top:startTop+'px'});
                    $("#"+selectItemId).width(startTdInfo.width-7);
                    $("#"+selectItemId+" .content").height(endTdInfo.top-startTdInfo.top+startTdInfo.height-5-15);
                    $("#"+selectItemId+" .head").text(activity.title);
                    $("#"+selectItemId).removeClass("temp");
                    YB.log(activity);
                    YB.log('------')
                    var content = [activity.weeks,'第' + activity.startTime + '-' + activity.endTime + '节',activity.classroom,activity.teachers].join('<br/>');
                    $("#"+selectItemId+" .content td").html(content);
                    //设置一个隐含域，用于存储活动的ID，便于查看，修改，删除等操作
                    var hiddenField = '<input type="hidden" class="activityId" value="'+activity.id+'">';
                    $(hiddenField).appendTo($("#"+selectItemId));
                    //添加点击事件
                    $("#"+selectItemId).click(function(){
                        entity.clear();
                        var position = {};
                        position.left = $(this).offset().left;
                        position.top = $(this).offset().top+15;
                        var id = $(this).find(".activityId").val();
                        entity.viewActivity(position,id);
                    });
                }
            },
            //查看活动
            viewActivity : function(position,activityId){
                var entity = this;
                $.ajax({
                    url : entity.viewPath,
                    data:'activity.id='+activityId,
                    type:'post',
                    async:false,
                    dataType:'json',
                    success:function(activity){
                        var popItemId = entity.popItem();//创建一个弹出窗口，并返回其ID
                        entity.setPopItemPosition(position,popItemId);//设置弹出窗口的位置
                        entity.activityViewItem(popItemId,activity);
                    },
                    error:function(){
                        alert("获取数据失败，请检查服务器状态");
                    }
                });
            },
            //活动查看数据
            activityViewItem : function(popItemId,activity){
                var entity = this;
                var start = entity.strToTime(activity.startTime);
                var end = entity.strToTime(activity.endTime);
                var startDate = start.year+"-"+start.month+"-"+start.day;
                var endDate = end.year+"-"+end.month+"-"+end.day;
                var startTime = start.hour+":"+start.minute;
                var endTime = end.hour+":"+end.minute;
                var time;
                if(startDate==endDate){
                    time = startDate+","+startTime+"-"+endTime;
                }else {
                    time = startDate+","+startTime+"   "+endDate+","+endTime;
                }
                //组织活动查看的显示数据，将其添加到弹出窗口上面
                var item = [];
                item.push('<div>');
                item.push('<table class="contentTable"><tr><td class="title">'+activity.title+'</td></tr><tr><td class="time">'+time+'</td></tr></table>');
                item.push('<div class="line"><div>');
                item.push('<div class="viewOperate"><a href="#" class="delete">删除</a><a href="#" class="moreInfo">编辑活动详细信息</a></div>');
                item.push('</div>');
                $(item.join('')).appendTo($("#"+popItemId+" .MC"));
                //添加相应的事件
                $(".delete").click(function(){
                    //删除一条记录
                    var param = "idList[0]="+activity.id;
                    $.ajax({
                        url : entity.deletePath,
                        data:param,
                        type:'post',
                        dataType:'json',
                        success:function(result){
                            //清除弹出窗口
                            entity.clear();
                            //清除selectItem
                            $("input[value="+activity.id+"]").parent().remove();
                        },
                        error:function(){
                            alert("删除数据失败，请检查服务器状态");
                        }
                    });
                });
                //为编辑详细信息添加点击事件
                $("#"+popItemId+" .moreInfo").click(function(){
                    window.parent.mainFrame.location = entity.updatePath+'?activity.id='+activity.id;
                });
            },
            //清除系统中的临时DIV
            clear:function(){
                $(".temp").remove();
            },
            //获得当前的时间
            nowDate : function(){
                var date = new Date();
                var year = date.getYear();
                var month = parseInt(date.getMonth())+1;
                var day = date.getDate();
                return year+"-"+month+"-"+day;
            },
            //用于系统中随机ID的生成
            random : function(){
                //首先产生一个1000以内的随机数
                var r = Math.round(Math.random()*1000);
                //获得当前的日期
                var date = new Date();
                var year = date.getYear();
                var month = date.getMonth();
                var day = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                //根据日期+随机数生成一个随机ID
                return 'id_'+year+month+day+minutes+seconds+r;
            }
        }

        $scope.getProfession();

        document.onselectstart = function(){
            return false;
        }
        var currentCourseId,currentTeachers = [],currentClassroomId ,studentModule = {};
        $('#activity')
            .on('click','.J_selectCourse',function(e){
                var me = $(this);
                require(['module/assistantList'], function (param) {
                    Ajax({
                        method: 'post',
                        url: 'admin/selectCourseTemplate',
                        data : {
                            professionId : currentProfessId
                        },
                        suc: function (res) {
                            var dialog = param.init({
                                data: {
                                    title : '请选择课程',
                                    arr: res,
                                    currentIds: [currentCourseId],
                                    singleSelectFlag : true
                                },
                                hintInfo : '请选择课程',
                                ok: function (response) {
                                    YB.log(response);
                                    var contentObj = me.siblings('.content');
                                    contentObj.attr('data-info',JSON.stringify(response));
                                    var nameArr = [];
                                    $.each(response,function(i,v){
                                        nameArr.push(v.name);
                                        currentCourseId = parseInt(v.id,10);
                                    });
                                    contentObj.html(nameArr.join(','));
                                    dialog.close();

                                },
                                cancel: function () {
                                    dialog.close();
                                }
                            })
                        }
                    })
                })
            })
            .on('click','.J_selectStudent',function(e){
                studentModule.render = function () {
                    var scope = $rootScope.$new();
                    if(!YB.studentListHtml){
                        $http.get('views/studentList.html?version=' + SYSTEM_VERSION).then(function (res) {
                            YB.studentListHtml = res.data;
                            renderPage();
                        });
                    }else{
                        renderPage();
                    }
                    function renderPage(){
                        //alert(4);
                        var html = YB.studentListHtml;
                        var dialog = angular.element(html);
                        $('.J_student_list_area .list-area').html(dialog);
                        $('.J_student_list_area').show();
                        var controller = $controller('StudentListModuleController', {
                            $scope: scope,
                            $element: dialog
                        }, true, 1);
                        $timeout(function () {
                            $compile(dialog)(scope);
                        });
                    }
                }
                studentModule.render();
            })

            .on('click','.J_selectTeacher',function(e){
                var me = $(this);
                require(['module/assistantList'], function (param) {
                    Ajax({
                        method: 'post',
                        url: 'admin/selectTeacher',
                        suc: function (res) {
                            var dialog = param.init({
                                data: {
                                    title : '请选择教师',
                                    arr: res.teacherList,
                                    currentIds: currentTeachers,
                                    singleSelectFlag : false
                                },
                                hintInfo : '请选择教师',
                                ok: function (response) {
                                    YB.log(response);
                                    currentTeachers = [];
                                    var contentObj = me.siblings('.content');
                                    contentObj.attr('data-info',JSON.stringify(response));
                                    var nameArr = [];
                                    $.each(response,function(i,v){
                                        nameArr.push(v.name);
                                        currentTeachers.push(parseInt(v.id,10));
                                    });
                                    contentObj.html(nameArr.join(','));
                                    dialog.close();

                                },
                                cancel: function () {
                                    dialog.close();
                                }
                            })
                        }
                    })
                })
            })
            .on('click','.J_selectClassroom',function(e){
                var me = $(this);
                require(['module/assistantList'], function (param) {
                    Ajax({
                        method: 'post',
                        url: 'admin/selectClassroom',
                        suc: function (res) {
                            var classrooms = [];
                            $.each(res.classroomList||[],function(i,v){
                                classrooms.push({
                                    id : v.id,
                                    name : v.building + ' ' + v.roomNumber
                                })
                            });
                            var dialog = param.init({
                                data: {
                                    title : '请选择教室',
                                    arr: classrooms,
                                    currentIds: [currentClassroomId],
                                    singleSelectFlag : true
                                },
                                hintInfo : '请选择教室',
                                ok: function (response) {
                                    YB.log(response);
                                    var contentObj = me.siblings('.content');
                                    contentObj.attr('data-info',JSON.stringify(response));
                                    var nameArr = [];
                                    $.each(response,function(i,v){
                                        nameArr.push(v.name);
                                        currentClassroomId = parseInt(v.id,10);
                                    });
                                    contentObj.html(nameArr.join(','));
                                    dialog.close();

                                },
                                cancel: function () {
                                    dialog.close();
                                }
                            })
                        }
                    })
                })
            })
            $('.J_closeSelectStudent').on('click',function(e){
                currentStudentMap = {};
                $('.J_student_list_area').hide();
            })
            $('.J_sureSelectStudent').on('click',function(e){
                var studentNames = [];
                $.each(currentStudentMap,function(i,v){
                    v.name = v.firstName + v.secondName;
                    studentNames.push(v.name);
                });
                if(!studentNames.length){
                    YB.info({
                        content : '请选择学生'
                    })
                    return;
                }
                $('.J_selectStudent').siblings('.content').html(studentNames.join(','));
                $('.J_student_list_area').hide();
            })
    }]);
    app.controller('StudentListModuleController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {
        var search = $location.search();

        $scope.maxSize = 10;
        $scope.bigCurrentPage = 1;
        $scope.params = {
            page: 1,
            num: $scope.maxSize,
            professionId : currentProfessId
        };
        $scope.pageChanged = function (pageNo) {
            $scope.params.page = pageNo;
            var params = $.extend({},$scope.params);
            params = YB.getPageTableParam(params);
            delete params.page;
            delete params.num;
            Ajax({
                loadDom :$('.J_student_list'),
                method: 'post',
                data: params,
                url: 'admin/selectStudent',
                suc: function (res) {
                    $scope.bigTotalItems = res.sum;
                    $scope.rows = res.studentList;
                }
            })
        };
        $scope.query = function(){
            $scope.pageChanged(1);
        }
        $scope.query();
        $scope.currentStudentMap = currentStudentMap;
        $scope.currentStudentChange = function(event,row){
            var me = $(event.target);
            if(me[0].checked){
                currentStudentMap[row.id] = row;
            }else{
                if(currentStudentMap[row.id]){
                    delete currentStudentMap[row.id];
                }
            }

        }
    }]);

    return moduleApp
});