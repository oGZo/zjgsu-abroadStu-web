/**
 * Created by rex on 16/1/15.
 * 添加随访记录
 *
 * 从任务管理进入需传入:
 * 任务id     taskId
 *
 * 从健康档案首页进入需传入:
 * 病程id          pathogenesisId
 * 患者id          patientId
 */
define(['app'], function (app) {
    app.controller('addFollowUpRecordViewController', ['$scope', '$location', 'Ajax', '$cookieStore',
        function ($scope, $location, Ajax, $cookieStore) {
            var search = $location.search();
            function getRealDate(date) {
                return new Date(date.split('-').join('/'));
            }
            //默认信息添加
            $scope.focusDefaultValue = YB.addDefaultInfo;
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

            $scope.treatmentEffectList = [
                {
                    id: 1,
                    name: '无法描述'
                }, {
                    id: 2,
                    name: '治愈'
                }, {
                    id: 3,
                    name: '明显改善'
                }, {
                    id: 4,
                    name: '部分疗效'
                }, {
                    id: 5,
                    name: '未见改善'
                }
            ];
            $scope.imgList = [];
            //添加图片
            $scope.addImg = function (e) {
                var me = $(e.target);
                var key = me.closest('.edit-area').attr('data-key');
                $scope.followUpRecord.imageKeyList = $scope.followUpRecord.imageKeyList || [];
                require(['module/uploadImg'], function (upload) {
                    var dialog = upload.init({
                        imageList: angular.copy($scope.followUpRecord.imageKeyList),
                        token: $cookieStore.get(YB.param.sysParam.token),
                        ok: function (imgList) {
                            $scope.$apply(function () {
                                $scope.followUpRecord.imageKeyList = imgList;
                            });
                            dialog.close();
                        },
                        cancel: function (res) {
                            dialog.close();
                        }
                    })
                })
            };

            var query = $location.search();
            //请求病程列表
            function getCourseList() {
                Ajax({
                    url: 'ehr/pathogenesis/list',
                    data: {
                        patientId: _patientId
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

            $scope.followUpRecord = {
                treatmentEffect: $scope.treatmentEffectList[0].name,
                followupDetail: '',
                followupDesc: '',
                followupTime: new Date().format('yyyy-MM-dd hh:mm')
            };
            //从哪个页面进入 1:首页 2:健康档案首页
            var _from = query.taskId ? 1 : 2;
            var _patientId;
            $scope.course = {};
            //从任务管理添加的随访记录有随访时间 随访说明
            if (query.taskId) {
                getTaskDetail(query.taskId, function (task) {
                    $scope.followUpRecord.taskId = query.taskId;
                    $scope.followUpRecord.followupDesc = task.desc;
                    $scope.followUpRecord.followupTime = new Date(task.date).format('yyyy-MM-dd') + ' ' + task.timeStr;
                    $scope.followUpRecord.patientId = task.detail.patientId;
                    $scope.followUpRecord.followupDesc = task.comment;
                    $scope.course.pathogenesisId = task.detail.pathogenesisId;
                    _patientId = task.detail.patientId;
                    getCourseList();
                });
            } else {
                $scope.followUpRecord.patientId = query.patientId;
                $scope.course.pathogenesisId = query.pathogenesisId;
                _patientId = query.patientId;
                getCourseList();
            }
            //选择随访时间
            $scope.selectTime = function (event) {
                angular.bind(event.target, WdatePicker({
                    isShowClear: false,
                    isShowToday: false,
                    dateFmt: 'yyyy-MM-dd HH:mm',
                    maxDate: new Date().format('yyyy-MM-dd hh:mm'),
                    onpicked: function (dp) {
                        $scope.$apply(function () {
                            $scope.followUpRecord.followupTime = dp.cal.getNewDateStr();
                        });
                    }
                }));
            };
            //取消添加随访记录
            $scope.cancel = function () {
                if(history&&history.length>1){
                    history.back();
                }else{
                    $location.url('/healthFile?patientId='+search.patientId);
                    $location.replace();
                }
            };
            $scope.removeImg = function (index) {
                $scope.followUpRecord.imageKeyList.splice(index, 1);
            };
            $('#imgArea')
                .on('click','.img-box',function(e){
                    var me = $(this);
                    var ul = me.parent();
                    var siblings = ul.children('.img-box');
                    var index = siblings.index(me);
                    var arr = [];
                    siblings.each(function(i,v){
                        var img = $(v).find('img');
                        var src = img.attr('data-bigsrc');
                        var positionFlag = true;
                        if(img.height()<screen.height*0.8&&img.width()<screen.width*0.8){
                            positionFlag = false;
                        }
                        if(src){
                            arr.push({
                                src : src,
                                positionFlag : positionFlag
                            })
                        }
                    })
                    if(arr.length){
                        YB.previewImage({
                            current : index,
                            arr : arr
                        })
                    }
                })
            //确定添加随访记录
            $scope.confirm = function () {
                var followUpRecord = angular.copy($scope.followUpRecord);
                followUpRecord.pathogenesisId = $scope.course.pathogenesisId;
                followUpRecord.followupTimeStamp = getRealDate(followUpRecord.followupTime).getTime();
                delete followUpRecord.followupTime;

                var imgList = [];
                angular.forEach(followUpRecord.imageKeyList, function (img) {
                    imgList.push(img.imageKey);
                });
                imgList = imgList.join(',');
                followUpRecord.imageKeyList = imgList;
                followUpRecord.recordItemId = 11;
                if (!followUpRecord.followupDesc) {
                    YB.info({
                        content: '请输入随访说明'
                    });
                } else
                if (!followUpRecord.followupDetail) {
                    YB.info({
                        content: '请输入随访过程记录'
                    });
                } else {
                    Ajax({
                        url: 'ehr/followupRecord/add',
                        method: 'post',
                        data: followUpRecord,
                        suc: function (res) {
                            app.info({content: '添加成功'});
                            res = res || {};
                            YB.openerFun('homeTableSearchTask');
                            $location.path('/recordsVisit').search({
                                recordId: res.recordId,
                                patientId: _patientId
                            });
                            $location.replace();
                        }
                    });
                }
            };
        }
    ]);
});
