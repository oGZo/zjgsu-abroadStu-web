//健康档案
define(['app', 'controllers/HealthModuleViewController'], function (app) {
    app.controller('HealthFileViewController', ['$scope', 'Ajax', '$location', '$window',
        function ($scope, Ajax, $location, $window) {
            //safari ie8及以下环境时 new Date()函数 yyyy-MM-dd 格式的字符串会返回NAN 需要将yyyy-MM-dd格式转化为yyyy/MM/dd
            function getRealDate(time) {
                return new Date(time.split('-').join('/'));
            }

            function sortCourseList() {
                $scope.courseList.sort(function (a, b) {
                    var timeA = getRealDate(a.startTime).getTime();
                    var timeB = getRealDate(b.startTime).getTime();
                    return timeB - timeA;
                });
            }

            var //记录宽度
                _recordWidth = 150,
            //记录剩下几个时再次请求记录列表 & 记录1页条数
                _leftRecordListLength = 10,
            //患者id
                _patientId = $location.search().patientId,
            //记录类型map
                _typeNameMap = {
                    1: '就诊',
                    2: '随访',
                    3: '咨询'
                };
            $scope.courseList = $scope.courseList || [];
            $scope.recordListShowMode = []; //记录列表显示模式 1为时间轴模式 2为表格模式
            $scope.pagination = []; //翻页条对象
            //处理记录列表
            function dealRecordList(recordList) {
                angular.forEach(recordList, function (record) {
                    console.log(record.treatmentresult);
                    record.treatmentresult = record.treatmentresult || '';
                    record.treatmentresult = record.treatmentresult.split(';').join(' , ');
                    record.checkList = record.checkList || '';
                    record.checkList = record.checkList.split(';');
                    //record.typeName = _typeNameMap[record.type];
                    record.class = 'color' + record.type;
                });
            }

            //获取病程列表
            getCourseList();
            function getCourseList() {
                Ajax({
                    method: 'post',
                    url: 'ehr/pathogenesis/overview/list',
                    data: {
                        patientId: _patientId,
                        start: 0,
                        count: 1024,
                        innnerStart: 0,
                        innerCount: _leftRecordListLength
                    },
                    suc: function (res) {
                        angular.forEach(res, function (course, i) {
                            course.athogenesisRecordDTOList = course.athogenesisRecordDTOList || [];
                            //处理时间显示
                            course.startTime = new Date(course.startDate).format('yyyy-MM-dd');
                            //初始化样式数据
                            course.styleData = {
                                'min-width': course.athogenesisRecordDTOList.length * _recordWidth,
                                'margin-left': 0
                            };
                            course.style = {
                                'min-width': course.styleData['min-width'] + 'px',
                                'margin-left': course.styleData['margin-left'] + 'px'
                            };
                            //初始化显示类型为时间轴
                            $scope.recordListShowMode[i] = 2;
                            //处理分页参数
                            course.pagination = {
                                innerStart: course.athogenesisRecordDTOList.length, //下次请求开始条数
                                isEnd: course.athogenesisRecordDTOList.length < _leftRecordListLength   //记录列表是否已结束
                            };
                            course.paginationTable = {
                                bigTotalItems: course.total,    //记录总条数
                                bigCurrentPage: 1,              //记录当前页
                                maxSize: _leftRecordListLength //一页条数
                            };
                            //处理记录列表
                            dealRecordList(course.athogenesisRecordDTOList);
                            course.athogenesisRecordDTOListTable = angular.copy(course.athogenesisRecordDTOList);
                        });
                        $scope.courseList = $scope.courseList.concat(res);
                        //对数组进行排序
                        sortCourseList();
                    }
                });
            }

            //获取记录列表
            function getRecordList(data, callback) {
                var ajaxData = {
                    method: 'post',
                    url: 'ehr/pathogenesis/record/list',
                    data: data,
                    suc: function (res) {
                        var data = res;
                        data = res&&res.rows || [];
                        data.total =  res.total;
                        dealRecordList(data);
                        callback && callback(data);
                    }
                };
                if(data['loadDom']){
                    ajaxData['loadDom'] = data['loadDom'];
                }
                Ajax(ajaxData);
            }

            //切换记录列表显示模式
            $scope.selectRecordListShowMode = function (index, mode) {
                $scope.recordListShowMode[index] = mode;
            };
            //记录列表翻页
            $scope.pageChanged = function (index,event) {
                var course = $scope.courseList[index];
                var getRecordListData = {
                    pathogenesisId: course.id,
                    start: (course.paginationTable.bigCurrentPage - 1) * _leftRecordListLength,
                    count: _leftRecordListLength
                };
                if($scope.recordListShowMode[index]==2){
                    getRecordListData['loadDom'] = $('[data-pathogenesisId="' + course.id + '"]')
                }
                getRecordList(getRecordListData, function (res) {
                    course.athogenesisRecordDTOListTable = res;
                });
            };
            //滑动记录列表动画
            function slide(config) {
                var time = config.time || 1000,                 //动画时间
                    t = time,                                   //动画时间拷贝
                    step = config.step || 10,                   //动画步长 每一帧的时间间隔
                    mode = config.mode || 'next',               //模式 'next'向后 'prev'向前
                    course = $scope.courseList[config.index],   //滑动的记录列表
                    styleData = course.styleData,               //记录列表的style数据
                    style = course.style;                       //记录列表的style
                //动画定时器
                var interval = setInterval(function () {
                    $scope.$apply(function () {
                        if (mode == 'next')
                            styleData['margin-left'] -= _recordWidth * step / time;
                        else
                            styleData['margin-left'] += _recordWidth * step / time;
                        style['margin-left'] = styleData['margin-left'] + 'px';
                    });
                    t -= step;
                    if (t <= 0) {
                        clearInterval(interval);
                    }
                }, step);
            }

            //向前滑动记录列表
            $scope.prev = function (index) {
                var course = $scope.courseList[index];
                if (course.styleData['margin-left'] % _recordWidth != 0 || course.styleData['margin-left'] >= 0)
                    return;
                slide({
                    index: index,
                    mode: 'prev',
                    time: 500
                });
            };
            //向后滑动记录列表
            var _isRequestRecordList = false;
            $scope.next = function (index) {
                var course = $scope.courseList[index],
                    styleData = course.styleData;
                if (styleData['margin-left'] % _recordWidth != 0 || styleData['margin-left'] + styleData['min-width'] <= _recordWidth)
                    return;
                slide({
                    index: index,
                    mode: 'next',
                    time: 500
                });
                //当记录列表未结束且末尾只剩 _isRequestRecordList 个记录时请求新的记录
                var isLeft = styleData['margin-left'] + styleData['min-width'] <= _recordWidth * _leftRecordListLength;
                if (!_isRequestRecordList && !course.pagination.isEnd && isLeft) {
                    _isRequestRecordList = true;
                    getRecordList({
                        pathogenesisId: course.id,
                        start: course.pagination.innerStart,
                        count: _leftRecordListLength
                    }, function (recordList) {
                        _isRequestRecordList = false;
                        course.athogenesisRecordDTOList = course.athogenesisRecordDTOList.concat(recordList);
                        //处理分页参数
                        var length = recordList.length;
                        course.pagination.innerStart += length;
                        course.pagination.isEnd = length < _leftRecordListLength;
                        //处理样式
                        styleData['min-width'] += length * _recordWidth;
                        course.style['min-width'] = styleData['min-width'] + 'px';
                    });
                }
            };

            //记录列表倒序
            $scope.reverseCourseList = function (e) {
                var btn = $(e.target);
                if(btn.hasClass('reverse')){
                    btn.removeClass('reverse');
                }else{
                    btn.addClass('reverse');
                }
                $scope.courseList.reverse();
                $scope.recordListShowMode.reverse();
            };
            //显示菜单
            $scope.isShowAddMenu = {};          //显示添加记录菜单对象
            $scope.isShowOperationMenu = {};    //显示操作菜单对象
            $scope.showMenu = function (showMap, index) {
                showMap[index] = true;
            };
            //隐藏菜单
            $scope.hideMenu = function (event, showMap, index) {
                var className = event.toElement && event.toElement.className;
                if (className.indexOf('J_in') < 0) {
                    showMap[index] = false;
                }
            };
            //修改病程
            $scope.isModifyCourse = {};
            $scope.tempCourseList = angular.copy($scope.courseList);
            $scope.preModifyCourse = function (index) {
                $scope.isShowOperationMenu[index] = false;
                $scope.isModifyCourse[index] = true;
                $scope.tempCourseList[index] = angular.copy($scope.courseList[index]);
            };
            //删除病程
            $scope.preDeleteCourse = function (index) {
                //打开窗口
                var deleteCourseDialog = art.dialog({
                    lock: true,
                    padding: 0,
                    title: false,
                    cancel: false,
                    fixed: true,
                    content: document.getElementById('J_deleteCourse').innerHTML
                });
                $('.J_confirm').on('click', function () {
                    Ajax({
                        method: 'post',
                        url: 'ehr/pathogenesis/delete',
                        data: {
                            pathogenesisId: $scope.courseList[index].id
                        },
                        suc: function (res) {
                            $scope.courseList.splice(index, 1);
                            deleteCourseDialog.close();
                            YB.info({
                                content: '删除成功'
                            });
                        }
                    });
                });
                $('.J_cancel').on('click', function () {
                    deleteCourseDialog.close();
                });
            };
            //选择病程开始时间
            $scope.selectTime = function (event, index) {
                angular.bind(event.target, WdatePicker({
                    isShowClear: false,
                    isShowToday: false,
                    dateFmt: 'yyyy-MM-dd',
                    onpicked: function (dp) {
                        var time = dp.cal.getNewDateStr();
                        $scope.tempCourseList[index].startTime = getRealDate(time).format('yyyy-MM-dd');
                    }
                }));
            };
            //取消修改病程信息
            $scope.cancelModifyCourse = function (index) {
                $scope.isModifyCourse[index] = false;
            };
            //保存修改病程信息
            $scope.confirmModifyCourse = function (index) {
                var tempCourse = $scope.tempCourseList[index];
                if (!tempCourse.pathogenesis) {
                    YB.info({
                        content: '请输入病程名'
                    });
                    return;
                }
                //if (!tempCourse.desc) {
                //    YB.info({
                //        content: '请输入主要症状'
                //    });
                //    return;
                //}
                tempCourse.startDate = new Date(getRealDate(tempCourse.startTime)).getTime();
                Ajax({
                    method: 'post',
                    url: 'ehr/pathogenesis/modify',
                    data: {
                        patientId : _patientId,
                        "pathogenesisId": tempCourse.id,
                        "pathogenesis": tempCourse.pathogenesis,
                        "desc": tempCourse.desc,
                        "startDate": tempCourse.startDate
                    },
                    suc: function (res) {
                        $scope.courseList[index] = angular.copy(tempCourse);
                        sortCourseList();
                        $scope.isModifyCourse[index] = false;
                        YB.info({
                            content: '修改成功'
                        });
                    }
                });
            };
            //打开新的页面
            $scope.openPage = function(course){
                $window.open('/#/course?' +
                    'patientId=' + _patientId +
                    '&pathogenesisId=' + course.id);
            }
            //前往记录详情
            $scope.goRecord = function (record) {
                var searchData = {
                    recordId: record.recordId,
                    patientId: _patientId
                };
                var pageModule = '';
                switch (record.type) {
                    //就诊记录
                    case 1:
                        pageModule = 'recordsTreatment';
                        //$window.open('#/recordsTreatment?'+ $.param(searchData));
                        //$location.path('/recordsTreatment').search({
                        //    recordId: record.recordId,
                        //    patientId: _patientId
                        //});
                        break;
                    //随访记录
                    case 2:
                        pageModule = 'recordsVisit';
                        //$window.open('#/recordsVisit?'+ $.param(searchData));
                        //$location.path('/recordsVisit').search({
                        //    recordId: record.recordId,
                        //    patientId: _patientId
                        //});
                        break;
                    //咨询记录
                    case 3:
                        pageModule = 'recordsConsult';
                        //$window.open('#/recordsConsult?'+ $.param(searchData));
                        //$location.path('/recordsConsult').search({
                        //    recordId: record.recordId,
                        //    patientId: _patientId
                        //});
                        break;
                }
                $window.open('#/'+pageModule+'?'+ $.param(searchData));
            };

            //添加健康记录
            $scope.addRecord = function (index, type) {
                var course = $scope.courseList[index];
                var searchData = {
                    pathogenesisId: course.id,
                    patientId: _patientId
                };
                var pageModule = '';
                switch (type) {
                    case 1: //就诊
                        pageModule = 'recordsTreatmentAdd';
                        //$window.open('/#/recordsTreatmentAdd?' +
                        //    'patientId=' + _patientId +
                        //    '&pathogenesisId=' + course.id);
                        break;
                    case 2: //随访
                        pageModule = 'addFollowUpRecord';
                        //$window.open('/#/addFollowUpRecord?' +
                        //    'patientId=' + _patientId +
                        //    '&pathogenesisId=' + course.id);
                        break;
                    case 3: //咨询
                        pageModule = 'addConsultRecord';
                        //$window.open('/#/addConsultRecord?' +
                        //    'patientId=' + _patientId +
                        //    '&pathogenesisId=' + course.id);
                        break;
                }
                $window.open('#/'+pageModule+'?'+ $.param(searchData));
            };
            //添加病程
            $scope.addCourse = function () {
                require(['module/courseAdd'], function (process) {
                    var dialog = process.addProcess({
                        patientId: _patientId,
                        ok: function (formData) {
                            Ajax({
                                method: 'post',
                                url: 'ehr/pathogenesis/add',
                                data: formData,
                                suc: function (res) {
                                    YB.info({content: '添加成功'});
                                    $scope.courseList = [];
                                    getCourseList();
                                    dialog.close();
                                }
                            });
                        },
                        cancel: function (res) {
                            //alert('fail');
                            dialog.close();
                        }
                    })
                })
            };
        }]);
});