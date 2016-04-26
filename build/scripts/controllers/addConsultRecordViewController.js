/**
 * Created by rex on 16/1/14.
 * 添加咨询记录
 *
 * 从咨询列表进入需传入:
 * 咨询id         consultId
 *
 * 从健康档案首页进入需传入:
 * 病程id          pathogenesisId
 * 患者id          patientId
 */
//添加咨询记录
define(['app'], function (app) {
    app.controller('addConsultRecordViewController', ['$scope', '$location', 'Ajax',
        function ($scope, $location, Ajax) {
            var search = $location.search();
            function getRealDate(date) {
                return new Date(date.split('-').join('/'));
            }

            //请求电话咨询详情
            function getPhoneConsultDetail() {
                Ajax({
                    method: 'post',
                    data: {
                        id: $scope.consultRecord.consultId
                    },
                    url: 'assistant/phoneConsult/detail',
                    suc: function (res) {
                        $scope.consultRecord.answer = res.answer;
                        $scope.consultRecord.question = res.question;
                    }
                });
            }

            var _now = new Date().format('yyyy-MM-dd hh:mm');
            var query = $location.search();
            //请求病程列表
            getCourseList();
            function getCourseList() {
                Ajax({
                    url: 'ehr/pathogenesis/list',
                    data: {
                        patientId: query.patientId
                    },
                    suc: function (res) {
                        angular.forEach(res, function (course) {
                            course.pathogenesisId = course.id;
                            delete course.id;
                            course.text = new Date(course.beginDateTimeStamp).format('yyyy-MM-dd') + ' ' + course.name;
                            if ($scope.course && course.pathogenesisId == $scope.course.pathogenesisId) {
                                $scope.course = course;
                            }
                        });
                        $scope.courseList = res;
                        if (!$scope.course)
                            $scope.course = res[0];
                    }
                });
            }

            $scope.course = {};
            $scope.consultRecord = {};
            $scope.consultRecord.consultTime = _now;
            $scope.consultRecord.patientId = query.patientId;

            //从咨询列表进入的有咨询详情
            if (query.consultId) {
                $scope.consultRecord.consultId = query.consultId;
                getPhoneConsultDetail();
            }
            //从健康档案首页进入的有病程信息
            if (query.pathogenesisId) {
                $scope.course = {
                    pathogenesisId: query.pathogenesisId
                };
            }


            //选择咨询时间
            $scope.selectTime = function (event) {
                angular.bind(event.target, WdatePicker({
                    isShowClear: false,
                    isShowToday: false,
                    maxDate: _now,
                    dateFmt: 'yyyy-MM-dd HH:mm',
                    onpicked: function (dp) {
                        $scope.$apply(function () {
                            $scope.consultRecord.consultTime = dp.cal.getNewDateStr();
                        });
                    }
                }));
            };
            //添加病程
            $scope.addCourse = function () {
                require(['module/courseAdd'], function (process) {
                    var dialog = process.addProcess({
                        patientId: $scope.consultRecord.patientId,
                        ok: function (formData) {
                            Ajax({
                                method: 'post',
                                url: 'ehr/pathogenesis/add',
                                data: formData,
                                suc: function (res) {
                                    app.info({
                                        content: '添加病程成功'
                                    });
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
            //取消添加咨询记录
            $scope.cancel = function () {
                if(history&&history.length>1){
                    history.back();
                }else{
                    $location.url('/healthFile?patientId='+search.patientId);
                    $location.replace();
                }
            };

            //确认添加咨询记录
            $scope.confirm = function () {
                $scope.consultRecord.pathogenesisId = $scope.course.pathogenesisId;
                var consultRecord = angular.copy($scope.consultRecord);
                consultRecord.consultTimeStamp = getRealDate(consultRecord.consultTime).getTime();
                delete consultRecord.consultTime;
                if (!consultRecord.question) {
                    YB.info({
                        content: '请输入患者问题'
                    })
                } else if (!consultRecord.answer) {
                    YB.info({
                        content: '请输入助理回答'
                    })
                } else {
                    Ajax({
                        method: 'post',
                        url: 'ehr/consultRecord/add',
                        data: consultRecord,
                        suc: function (res) {
                            app.info({
                                content: '添加成功'
                            });
                            YB.openerFun();
                            $location.path('/recordsConsult').search({
                                patientId: $scope.consultRecord.patientId,
                                recordId: res.recordId
                            });
                            $location.replace();
                        }
                    })
                }
            };
        }
    ]);
});