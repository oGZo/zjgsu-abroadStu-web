//首页
define(['app'], function (app) {
    var weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    app.controller('HomeViewController', ['$scope', '$http', 'Ajax', '$location', '$window',
        function ($scope, $http, Ajax, $location, $window) {
            //safari ie8及以下环境时 new Date()函数 yyyy-MM-dd 格式的字符串会返回NAN 需要将yyyy-MM-dd格式转化为yyyy/MM/dd
            function getRealDate(time) {
                return new Date(time.split('-').join('/'));
            }
            $scope.taskTableFormData = {};
            $scope.statusMap = {
                1: '待完成',
                2: '已完成',
                3: '已取消'
            };
            //$scope.statusMap = ['', '待完成', '完成', '已取消'];
            var _typeClassList = ['', 'a', 'b', 'c', 'd', 'e']; //任务类型对应class列表
            //获取跟踪人列表
            function getBrokerList(callback) {
                if ($scope.brokerList) {
                    callback && callback();
                    return;
                }
                Ajax({
                    method: 'post',
                    url: 'assistant/all/list',
                    suc: function (res) {
                        $scope.brokerList = res;
                        callback && callback();
                    }
                });
            }

            //获取首页数据
            (function getHomeInfo() {
                Ajax({
                    method: 'post',
                    url: 'assistant/homepage/info',
                    suc: function (data) {
                        $scope.privatePhoneConsultNotAnswerNum = data.privatePhoneConsultNotAnswerNum;
                        $scope.dueToDateTaskNum = data.dueToDateTaskNum;
                        $scope.orderStateChangeNum = data.orderStateChangeNum;
                        $scope.assistantUserId = data.userId;
                        $scope.assistantUserName = data.name;
                        getTaskList();
                    }
                });
            })();
            //获取任务类型列表
            (function getTypeList() {
                Ajax({
                    method: 'get',
                    url: 'assistant/task/typelist',
                    suc: function (res) {
                        var typeList = res.list;
                    }
                });
            })();
            //请求用户列表
            var isRequestUser = false;

            function getUserList(phone, callback) {
                if (isRequestUser) return;
                isRequestUser = true;
                Ajax({
                    method: 'get',
                    url: 'assistant/task/customer/list',
                    data: {
                        phone: phone
                    },
                    suc: function (res) {
                        isRequestUser = false;
                        $scope.userList = res.customers || [];
                        callback && callback();
                    }
                });
            }

            //请求患者列表
            var isRequestPatient = false;

            function getPatientList(data, callback) {
                if (isRequestPatient) return;
                isRequestPatient = true;
                Ajax({
                    method: 'POST',
                    url: 'assistant/task/customer/patient',
                    data: data,
                    suc: function (res) {
                        isRequestPatient = false;
                        $scope.patientList = res.patients || [];
                        callback && callback();
                    }
                });
            }

            //获取任务列表
            function getTaskList(searchFlag) {
                var formData = {
                    assistantUserId : $scope.assistantUserId
                };
                formData.beginDate = $scope.isCalendar ? $scope.calendarStartTime : $scope.tableStartTime;
                formData.endDate = $scope.isCalendar ? $scope.calendarEndTime : $scope.tableEndTime;
                if(!$scope.isCalendar){
                    $.extend(formData,angular.copy($scope.taskTableFormData));
                    if(searchFlag){
                        $scope.bigCurrentPage = 1;
                    }
                    var params = {
                        num : $scope.maxSize,
                        page : $scope.bigCurrentPage
                    }
                    $.extend(formData,YB.getPageTableParam(params));
                }else{
                    //formData.
                }
                var ajaxData = {
                    url: 'assistant/task/date',
                    method: 'get',
                    data: formData,
                    suc: function (res) {
                        res.tasklist = dealTaskList(res.tasklist);
                        if ($scope.isCalendar)
                            $scope.tempCalendarTaskList = res.tasklist;
                        else
                            $scope.bigTotalItems = res.tasklist&&res.tasklist.length&&res.total;
                            $scope.tableTaskList = res.tasklist;
                    }
                };

                if(!$scope.isCalendar){
                    ajaxData['loadDom'] = $('.task_list');
                }
                Ajax(ajaxData);
            }
            //最大任务条数
            $scope.maxSize = 10;
            //处理请求来的任务列表 求出状态文本 拼装任务时间 处理任务状态
            function dealTaskList(taskList) {
                var today = new Date();
                taskList = taskList || [];
                angular.forEach(taskList, function (task) {
                    task.statusStr = $scope.statusMap[task.status];
                    task.time = new Date(task.date).format('yyyy-MM-dd') + ' ' + task.timeStr;
                    task.typeClass = _typeClassList[task.type];
                    //处理任务显示类型
                    if (task.status == 2) { //已完成
                        task.isDone = true;
                    } else if (task.status == 3) {  //已取消
                        task.isCancel = true;
                    } else {  //未完成
                        task.isDone = false;
                        //判断是否过期
                        if (new Date(task.date) < today) {
                            task.isExceed = true;
                        } else if (new Date(task.date) > today) {
                            task.isExceed = false;
                        } else if (task.timeStr.split(':')[0] < today.getHours()) {
                            task.isExceed = true;
                        } else if (task.timeStr.split(':')[0] > today.getHours()) {
                            task.isExceed = false;
                        } else {
                            task.isExceed = false;
                        }
                    }
                });
                return taskList;
            }

            //监听日历任务列表 处理为日历形式
            $scope.$watch('tempCalendarTaskList', function () {
                $scope.calendarTaskList = new Array(4);
                for (var i = 0; i < 4; i++) {
                    $scope.calendarTaskList[i] = new Array(7);
                    for (var j = 0; j < 7; j++) {
                        $scope.calendarTaskList[i][j] = [];
                    }
                }
                angular.forEach($scope.tempCalendarTaskList, function (task) {
                    task.timeStr = task.timeStr || '';
                    var date = new Date(task.date),
                        hour = parseInt(task.timeStr.split(':')[0]),
                        day = (date.getDay() - getRealDate($scope.calendarStartTime).getDay() + 7) % 7;
                    if (hour < 8) {
                        $scope.calendarTaskList[0][day].push(task);
                    } else if (hour < 12) {
                        $scope.calendarTaskList[1][day].push(task);
                    } else if (hour < 16) {
                        $scope.calendarTaskList[2][day].push(task);
                    } else {
                        $scope.calendarTaskList[3][day].push(task);
                    }
                });
            });

            var _oneDay = 1000 * 60 * 60 * 24; //1天的毫秒数
            $scope.calendarStartTime = new Date().format('yyyy-MM-dd'); //日历起始时间
            //监听日历起始时间的改变
            $scope.$watch('calendarStartTime', function () {
                //改变日历结束时间到开始时间一周后
                var now = getRealDate($scope.calendarStartTime).getTime();
                $scope.calendarEndTime = new Date(now + 6 * _oneDay).format('yyyy-MM-dd');
                //重新处理日历表头
                $scope.weekList = new Array(7);
                angular.forEach($scope.weekList, function (v, i) {
                    var now = getRealDate($scope.calendarStartTime).getTime();
                    var date = new Date(now + i * _oneDay);
                    $scope.weekList[i] = {};
                    $scope.weekList[i].date = date;
                    $scope.weekList[i].week = weekList[date.getDay()];
                });
                if($scope.assistantUserId){
                    //重新获取任务列表
                    getTaskList();
                }
            });


            //显示日历或列表
            $scope.isCalendar = true;
            //切换日历/列表
            $scope.selectCalendar = function (isCalendar) {
                $scope.isCalendar = isCalendar;
                getTaskList();
            };
            //选择日历开始时间
            $scope.selectCalendarStartTime = function (event) {
                angular.bind(event.target, WdatePicker({
                    isShowClear: false,
                    isShowToday: false,
                    onpicked: function (dp) {
                        $scope.$apply(function () {
                            $scope.calendarStartTime = dp.cal.getNewDateStr();
                        });
                    }
                }));
            };
            //小时列表
            $scope.hourList = ['0-7', '8-11', '12-15', '16-23'];
            //回退1周
            $scope.calendarPrev = function () {
                $scope.calendarStartTime = new Date(getRealDate($scope.calendarStartTime).getTime() - 7 * _oneDay).format('yyyy-MM-dd');
            };
            //前进1周
            $scope.calendarForward = function () {
                $scope.calendarStartTime = new Date(getRealDate($scope.calendarStartTime).getTime() + 7 * _oneDay).format('yyyy-MM-dd');
            };
            function getCourseList(patientId, callback) {
                Ajax({
                    url: 'ehr/pathogenesis/list',
                    method: 'get',
                    data: {
                        patientId: patientId
                    },
                    suc: function (res) {
                        $scope.courseList = res;
                        callback && callback(res);
                    }
                })
            }
            $scope.pageChanged = function(){
                getTaskList();
            }
            //添加自定义任务
            $scope.addCustomTask = function (origin, period, day) {
                var taskName;//任务名称
                getBrokerList(function () {
                    //区分从日历添加还是从列表添加
                    $scope.origin = origin || 0;
                    var addCustomTaskDate = '',
                        addCustomTaskMinDate = '';
                    //从日历修改限制日期
                    if (origin == 1) {
                        var date = $scope.weekList[day].date.format('yyyy-MM-dd');
                        var hour = ['00', '08', '12', '16'][period];
                        addCustomTaskDate = date;
                        addCustomTaskMinDate = date + ' ' + hour + ':00';
                    }
                    //渲染模板
                    var addTaskHtml = new EJS({
                        element: 'J_addCustomTaskHtml'
                    }).render({
                        brokerList: $scope.brokerList,
                        assistantUserId : YB.param.assistantInfo.userId,
                        time: addCustomTaskMinDate || ''
                    });
                    //打开窗口
                    var addCustomTaskDialog = art.dialog({
                        lock: true,
                        padding: 0,
                        title: false,
                        cancel: false,
                        fixed: true,
                        content: addTaskHtml
                    });
                    var userMenuNode = $('.J_userMenu'),        //用户选择列表
                        userInput = $('.J_userPhone'),          //用户手机号输入框
                        patientInput = $('.J_patientName'),     //患者选择列表
                        patientMenuNode = $('.J_patientMenu'),  //患者姓名输入框
                        courseListMenuNode = $('.J_courseList'),//病程列表
                        taskNameNode = $('.J_addTaskForm .J_name'); //任务名称；
                    var _detailJson = {};   //detailjson
                    var _customerUserId;    //用户id
                    //模糊搜索用户列表
                    userInput.on('keyup', function () {
                        var self = this;
                        if (!self.value.length) {
                            userMenuNode.hide();
                            return;
                        }
                        setTimeout(function () {
                            getUserList(self.value, function () {
                                userMenuNode.hide().empty();
                                patientMenuNode.empty();
                                courseListMenuNode.empty();
                                patientInput.val('');
                                _detailJson = {};
                                _customerUserId = null;
                                if ($scope.userList.length) {
                                    angular.forEach($scope.userList, function (user, index) {
                                        var text = user.name + ' ' + user.phone;
                                        userMenuNode.append('<li class="item J_user" data-id=\"' + index + '\">' + text + '</li>');
                                    });
                                    userMenuNode.show();
                                }
                            });
                        }, 500);
                    });
                    //选中用户
                    userMenuNode.on('click', '.J_user', function () {
                        var text = $(this).html()
                        userInput.val(text);
                        userMenuNode.hide();
                        var user = $scope.userList[$(this).data('id')];
                        _customerUserId = user.userId;
                        patientInput.show();
                    });
                    //模糊搜索患者列表
                    patientInput.on('keyup', function () {
                        var self = this;
                        if (!self.value.length) {
                            patientMenuNode.hide();
                            return;
                        }
                        setTimeout(function () {
                            getPatientList({
                                name: self.value,
                                customerUserId: _customerUserId
                            }, function () {
                                patientMenuNode.hide().empty();
                                _detailJson = {};
                                courseListMenuNode.empty();
                                if ($scope.patientList.length) {
                                    angular.forEach($scope.patientList, function (patient, index) {
                                        var text = patient.name + ' ' + patient.idcard;
                                        patientMenuNode.append('<li class="item J_patient" ' + 'data-id=\"' + index + '\">' + text + '</li>');
                                    });
                                    patientMenuNode.show();
                                }
                            });
                        }, 500);
                    });
                    //选择患者
                    patientMenuNode.on('click', '.J_patient', function () {
                        var text = $(this).html();
                        patientInput.val(text);
                        taskName = text.split(' ')[0]+' '+'随访任务';
                        taskNameNode.val(taskName);
                        patientMenuNode.hide();
                        var patient = $scope.patientList[$(this).data('id')];
                        _detailJson = {
                            patient: patient.name,
                            patientPhone: patient.phone,
                            patientId: patient.id
                        };
                        getCourseList(patient.id, function () {
                            courseListMenuNode.empty();
                            if ($scope.courseList.length) {
                                angular.forEach($scope.courseList, function (course, index) {
                                    var time = new Date(course.beginDateTimeStamp).format('yyyy-MM-dd');
                                    var text = course.name + ' ' + time;
                                    courseListMenuNode.append('<option value=\"' + index + '\">' + text + '</option>')
                                });
                            } else {
                                courseListMenuNode.append('<option>该患者没有病程</option>')
                            }

                        });
                    });
                    //选择任务类型
                    $('.J_addTaskType').on('change', function () {
                        var nameNode = $('.J_name'),
                            task4DetailNode = $('.J_task4Detail'),
                            commentNode = $('.J_comment'),
                            comment = commentNode.val(),
                            descStr = '＊诊断治疗发生了＊时间后，提醒病人注意＊；询问病人＊（病情、药物反应等）。';
                        $scope.taskType = this.value;
                        if (this.value == 4) {
                            task4DetailNode.show();
                            nameNode.attr('placeholder', '随访任务').val(taskName);
                            commentNode.attr('placeholder',descStr);
                            //if (!comment.length)
                            //    commentNode.val(descStr);
                        } else {
                            task4DetailNode.hide();
                            nameNode.attr('placeholder', '自定义任务').val('');
                            commentNode.attr('placeholder', '任务描述');
                        }
                    });
                    //添加任务选择时间
                    $('.J_addCustomTaskTime').on('click', function () {
                        var startDate = '';
                        if($scope.taskType==4){
                            startDate = '%y-%M-%d 18:00:00';
                        }
                        if ($scope.origin == 1) { //从日历添加
                            var minDate = ['00', '08', '12', '16', '24'][period];
                            var maxDate = ['00', '07', '11', '15', '23'][period + 1];
                            WdatePicker({
                                isShowClear: false,
                                isShowToday: false,
                                dateFmt: addCustomTaskDate + ' HH:mm',
                                minDate: minDate + ':00',
                                maxDate: maxDate + ':59',
                                startDate : startDate
                            });
                        } else {    //从列表添加
                            WdatePicker({
                                isShowClear: false,
                                isShowToday: false,
                                dateFmt: 'yyyy-MM-dd HH:mm',
                                minDate: '%y-%M-%d',
                                startDate : startDate
                            });
                        }
                    });
                    //取消添加自定义任务
                    $('.J_cancel').on('click', function () {
                        addCustomTaskDialog.close();
                    });
                    //提交自定义任务
                    $('.J_addTaskForm').on('submit', function (event) {
                        event.preventDefault();
                        var form = $(this).serializeArray(), formData = {};
                        angular.forEach(form, function (v) {
                            formData[v.name] = v.value;
                        });
                        //校验
                        if (!formData.name.length) {
                            YB.info({content: '请填写任务名称'});
                            return;
                        } else if (!formData.assistUserId) {
                            YB.info({content: '请选择跟踪人'});
                            return;
                        } else if (!formData.time.length) {
                            YB.info({content: '请选择任务时间'});
                            return;
                        }
                        //随访任务校验病程信息
                        if (formData.type == 4) {
                            if (!_detailJson.patientId) {
                                YB.info({content: '请选择随访患者'});
                                return;
                            }
                            var course = $scope.courseList[formData.pathogenesisId];
                            if (!course || !course.id) {
                                YB.info({content: '请选择病程'});
                                return;
                            }
                            formData.pathogenesisId = course.id;
                            formData.patientId = _detailJson.patientId;
                            _detailJson.pathogenesisId = course.id;
                            _detailJson.pathogenesisName = course.name;
                        }
                        //处理时间
                        var time = new Date(getRealDate(formData.time));
                        formData.date = time.getTime();
                        formData.timeStr = time.format('hh:mm');
                        formData.status = 1;

                        //提交自定义任务
                        Ajax({
                            url: 'assistant/task/add/' + formData.type,
                            method: 'post',
                            data: {
                                assistantTaskJson: JSON.stringify(formData),
                                assistantTaskDetailJson: JSON.stringify(_detailJson)
                            },
                            suc: function (res) {
                                YB.info({content: '添加任务成功'});
                                getTaskList();  //重新获取任务列表
                                addCustomTaskDialog.close();
                            }
                        });
                    });
                });
            };

            //获取任务详情
            function getTaskDetail(taskId, callback) {
                Ajax({
                    url: 'assistant/task/' + taskId,
                    method: 'get',
                    suc: function (res) {
                        res.task.detail = res.task.detail || {};
                        callback && callback(res.task);
                    }
                });
            }

            //任务详情
            $scope.showTaskDetail = function (event, item) {
                event.stopPropagation();
                getTaskDetail(item.id, function (task) {
                    getBrokerList(function () {
                        console.log(task);
                        task.time = new Date(task.date).format('yyyy-MM-dd') + ' ' + task.timeStr;
                        if (task.type == 4) {
                            getCourseList(task.detail.patientId, function () {
                                var visitStatusMap = $.extend({},$scope.statusMap);
                                delete visitStatusMap[2];
                                //渲染模板
                                var taskDetailHtml = new EJS({
                                    url: './views/homeTaskDetail.ejs?version='+SYSTEM_VERSION
                                }).render({
                                    task: task,
                                    brokerList: $scope.brokerList,
                                    statusMap: visitStatusMap,
                                    courseList: $scope.courseList
                                });
                                render(taskDetailHtml);
                            });
                        } else {
                            //渲染模板
                            var taskDetailHtml = new EJS({
                                url: './views/homeTaskDetail.ejs?version='+SYSTEM_VERSION
                            }).render({
                                task: task,
                                brokerList: $scope.brokerList,
                                statusMap: $scope.statusMap
                            });
                            render(taskDetailHtml);
                        }
                        function render(html) {
                            //打开窗口
                            var taskDetailDialog = art.dialog({
                                lock: true,
                                padding: 0,
                                title: false,
                                cancel: false,
                                fixed: true,
                                content: html
                            });
                            $('.J_patient').on('click', function () {
                                taskDetailDialog.close();
                                $scope.$apply(function () {
                                    $location.path('/healthFile').search({
                                        patientId: task.detail.patientId
                                    });
                                });
                            });
                            $('.J_link').on('click', function () {
                                $scope.$apply(function () {
                                    $window.open('/#/orderDetail?id=' + task.detail.orderSn);
                                });
                            });
                            $('.J_goRecord').on('click',function(e){
                                YB.gorRecord(task);
                            })
                            //选择任务时间
                            $('.J_taskTime').on('click', function () {
                                WdatePicker({
                                    isShowClear: false,
                                    isShowToday: false,
                                    dateFmt: 'yyyy-MM-dd HH:mm',
                                    minDate: new Date().format('yyyy-MM-dd hh:mm')
                                });
                            });
                            $('.J_cancel').on('click', function () {
                                taskDetailDialog.close();
                            });
                            //提交表单
                            $('.J_taskDetailForm').on('submit', function (event) {
                                event.preventDefault();
                                var form = $(this).serializeArray(), formData = {};
                                angular.forEach(form, function (v) {
                                    formData[v.name] = v.value;
                                });
                                angular.extend(task, formData);
                                var time = getRealDate(task.time);
                                task.date = time.getTime();
                                task.timeStr = time.format('hh:mm');
                                if (task.type == 4 && task.pathogenesisId) {
                                    var course = $scope.courseList[task.pathogenesisId];
                                    task.pathogenesisId = course.id;
                                    task.detail.pathogenesisId = course.id;
                                    task.detail.pathogenesisName = course.name;
                                }
                                //校验
                                if (!task.name.length) {
                                    YB.info({content: '请填写任务名称'});
                                    return;
                                }
                                Ajax({
                                    url: 'assistant/task/update/' + task.type,
                                    method: 'post',
                                    data: {
                                        assistantTaskJson: JSON.stringify(task),
                                        assistantTaskDetailJson: JSON.stringify(task.detail)
                                    },
                                    suc: function (res) {
                                        YB.info({content: '修改任务成功'});
                                        getTaskList();
                                        taskDetailDialog.close();
                                    }
                                });
                            });
                        }
                    });
                });
            };

            //列表时间
            $scope.tableStartTime = new Date(new Date().getTime()-_oneDay).format('yyyy-MM-dd');
            $scope.tableEndTime = new Date(getRealDate($scope.tableStartTime).getTime() + 2 * _oneDay).format('yyyy-MM-dd');
            //任务列表选择开始时间
            $scope.selectTableStartTime = function (event) {
                angular.bind(event.target, WdatePicker({
                    isShowClear: false,
                    isShowToday: false,
                    errDealMode: 1,
                    maxDate: '#F{$dp.$D(\'J_tableEndTime\')||\'%y-%M-%d\'}',
                    onpicked: function (dp) {
                        $scope.tableStartTime = dp.cal.getNewDateStr();
                    }
                }));
            };
            //任务列表选择结束时间
            $scope.selectTableEndTime = function (event) {
                angular.bind(event.target, WdatePicker({
                    isShowClear: false,
                    isShowToday: false,
                    errDealMode: 1,
                    minDate: '#F{$dp.$D(\'J_tableStartTime\')||\'%y-%M-%d\'}',
                    onpicked: function (dp) {
                        $scope.tableEndTime = dp.cal.getNewDateStr();
                    }
                }));
            };
            //查询任务列表
            $scope.tableSearchTask = function () {
                if (!$scope.tableStartTime) {
                    YB.info({content: '请选择开始时间'});
                } else if (!$scope.tableEndTime) {
                    YB.info({content: '请选择结束时间'});
                } else {
                    //searchFlag
                    getTaskList(true);
                }
            };

            window.homeTableSearchTask = $scope.tableSearchTask;

                //点击首页状态部分逻辑控制；
            $scope.changeStatusFun = function (param) {
                switch (param) {
                    //电话咨询
                    case 0:
                        $scope.$parent.currentView = 'customer';
                        $location.path('/consultPhone');
                        break;
                    //预约变更
                    case 1:
                        if ($scope.orderStateChangeNum != 0) {
                            Ajax({
                                url: 'assistant/homepage/batchupdate/orderlog',
                                method: 'post',
                                suc: function (res) {
                                    $location.path('/order');
                                }
                            });
                        } else {
                            $location.path('/order');
                        }
                        break;
                    //到期任务
                    case 2:
                        $scope.selectCalendar(false);
                        break;
                }
            };
            YB.gorRecord = function (task) {
                //诊前沟通任务 陪诊任务
                if (task.type == 2 || task.type == 3) {
                    if (task.status == 1) {    //任务未完成
                        var param = {
                            taskId: task.id,
                            patientId: task.patientId
                        };
                        if (task.pathogenesisRecordId) {
                            param.recordId = task.pathogenesisRecordId;
                            $window.open('/#/recordsTreatment?' +
                                'recordId=' + task.pathogenesisRecordId +
                                '&patientId=' + task.patientId);
                        } else {
                            param.orderId = task.orderId;
                            $window.open('/#/recordsTreatmentAddDetail?' + $.param(param));
                        }
                    } else if (task.status == 2) {    //任务已完成
                        $window.open('/#/recordsTreatment?' +
                            'recordId=' + task.pathogenesisRecordId +
                            '&patientId=' + task.patientId);
                    } else {    //任务已取消
                        if (task.pathogenesisRecordId) {
                            $window.open('/#/recordsTreatment?' +
                                'recordId=' + task.pathogenesisRecordId +
                                '&patientId=' + task.patientId);
                        } else {
                            YB.info({content: '没有相关记录'});
                        }
                    }
                } else if (task.type == 4) {  //随访任务
                    if (task.status == 1) {    //任务未完成
                        $window.open('/#/addFollowUpRecord?' +
                            'taskId=' + task.id+
                            '&patientId=' + task.patientId);
                    } else if (task.status == 2) {    //任务已完成
                        $window.open('/#/recordsVisit?' +
                            'recordId=' + task.pathogenesisRecordId +
                            '&patientId=' + task.patientId);
                    } else {    //任务已取消
                        if (task.pathogenesisRecordId) {
                            $window.open('/#/recordsVisit?' +
                                'recordId=' + task.pathogenesisRecordId +
                                '&patientId=' + task.patientId);
                        } else {
                            YB.info({content: '没有相关记录'});
                        }
                    }
                }
            };
            //添加记录 / 前往记录详情
            $scope.gorRecord = YB.gorRecord;
        }]);
});