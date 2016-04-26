/**
 * Created by sanqi on 2016/1/8.
 */
    //个人资料页面
define(['app','directives/process-add'], function (app,process) {
    app.controller('ConsultRecordsModuleViewController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            var scope = $rootScope.$new();
            $http.get('views/consultRecords.html?version='+SYSTEM_VERSION).then(function (res) {
                var dialog = angular.element(res.data);
                $('.J_consult-records').append(dialog);
                var controller = $controller('ConsultRecordsController', {
                    $scope: scope,
                    $element: dialog
                }, true, 1);
                $timeout(function () {
                    $compile(dialog)(scope);
                });
            });
        }]);
    app.controller('ConsultRecordsController', ['$scope', '$cookieStore','Ajax','$location', function ($scope, $cookieStore,Ajax,$location) {
        var search = $location.search();
        YB.log(search);
        $.extend($scope,search);
        if(search.recordType==3){

            consultRecordInit();
        }
        YB.consultRecordInit = consultRecordInit;
        function consultRecordInit(){
            var pageData ={};
            //修改咨询记录
            $scope.updateConsultDataInfo = function(){
                $scope.updateConsultData = angular.copy($scope.consultInfoData);
                $scope.updateConsultData.pathogenesisList = [];
                if($scope.updateConsultData.consultTimeStamp){
                    $scope.updateConsultData.consultTimeStamp = new Date($scope.updateConsultData.consultTimeStamp).format('yyyy-MM-dd hh:mm');
                }
                //获取病程列表
                getPathogenesisList();
            };

            function getPathogenesisList(){
                var postData = {
                    patientId :  $scope.updateConsultData.patientId,
                    start : 0,
                    count : 10000
                };
                Ajax({
                    url : 'ehr/pathogenesis/list',
                    method : 'get',
                    data : postData,
                    suc : function(response){
                        //$scope.$apply(function(){
                        $scope.updateConsultData.pathogenesisList = response;
                        $scope.updateConsultDataEditFlag = true;
                        countDefaultPathogenesis($scope.updateConsultData.pathogenesisId);
                        //})
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                });
            }
            //计算默认病程
            function countDefaultPathogenesis(id,noAngular){
                if($scope.updateConsultData){
                    $.each($scope.updateConsultData.pathogenesisList||[],function(i,v){
                        if(v.id == id){
                            if(noAngular){
                                $scope.$apply(function(){
                                    $scope.updateConsultData.pathogenesis = v;
                                });
                            }else{
                                $scope.updateConsultData.pathogenesis = v;
                            }
                            return false;
                        }
                    })
                }
            }
            $scope.$watch('updateConsultData.pathogenesisId',function(e){
                countDefaultPathogenesis(e);
            })
            //保存修改病程
            $scope.saveUpdateConsultDataInfo = function(){
                var postData = {
                    id : search.recordId,
                    pathogenesisId : $scope.updateConsultData.pathogenesis.id,
                    question : $scope.updateConsultData.question,
                    consultTimeStamp : YB.getUnixTime($scope.updateConsultData.consultTimeStamp),
                    answer : $scope.updateConsultData.answer,
                    illnessState : $scope.updateConsultData.illnessState
                };
                if(!postData.pathogenesisId){
                    YB.info({
                        content : '病程不能为空'
                    })
                    return
                }
                if(!postData.question){
                    YB.info({
                        content : '患者问题不能为空'
                    })
                    return
                }
                if(!postData.answer){
                    YB.info({
                        content : '助理回答不能为空'
                    })
                    return
                }
                Ajax({
                    url : 'ehr/consultRecord/modify',
                    method : 'post',
                    data : postData,
                    suc : function(response){
                        $.extend($scope.consultInfoData,angular.copy($scope.updateConsultData));
                        $scope.updateConsultDataEditFlag = false;
                        YB.info({
                            content : '操作成功'
                        })
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            };
            //添加病程
            $scope.addPathogenesis = function(){
                require(['module/courseAdd'],function(process){
                    var dialog = process.addProcess({
                        patientId : search.patientId,
                        ok : function(formData){
                            Ajax({
                                method: 'post',
                                url: 'ehr/pathogenesis/add',
                                data: formData,
                                suc: function(res){
                                    //console.log(res);
                                    getPathogenesisList();
                                    $scope.updateConsultData.pathogenesisId = res;
                                    dialog.close();
                                }
                            });
                        },
                        cancel : function(res){
                            //alert('fail');
                            dialog.close();
                        }
                    })
                })
                //require(['directives/process-add'],function(process){
                //    var length = $scope.baseInfoUpdateData.pathogenesisList.length;
                //    $scope.baseInfoUpdateData.pathogenesisList.push({
                //        id : length,
                //        name : '头疼' + length,
                //        beginDate : '201601'+ length,
                //        desc : '描述'+ length
                //    });
                //    $scope.baseInfoUpdateData.pathogenesisId = length;
                //    countDefaultPathogenesis(length);
                //    var dialog = process.addProcess({
                //        ok : function(res){
                //            var postData = {
                //                patientId : $scope.patientId
                //            };
                //            $.extend(postData,res);
                //            Ajax({
                //                url : 'ehr/pathogenesis/add',
                //                method : 'post',
                //                data : postData,
                //                suc : function(response){
                //                    $scope.baseInfoUpdateData.pathogenesisList.push($.extend({
                //                        id : response.id },res));
                //                    $scope.baseInfoUpdateData.pathogenesisId = response.id;
                //                    countDefaultPathogenesis(response.id);
                //                    YB.info({
                //                        content : '添加病程成功'
                //                    })
                //                },
                //                err : function(){
                //                    YB.info({
                //                        content : '添加病程失败'
                //                    })
                //                }
                //            })
                //            dialog.close();
                //        },
                //        cal : function(res){
                //            //alert('fail');
                //            dialog.close();
                //        }
                //    })
                //})
            }
            //删除病程
            $scope.deleteRecord = function(){
                YB.confirm({
                    hint : '确认要删除该记录么？',
                    ok : function(){
                        var postData = {
                            id : search.recordId
                        };
                        Ajax({
                            url : 'ehr/record/delete',
                            method : 'post',
                            data : postData,
                            suc : function(response){
                                if(history&&history.length>1){
                                    history.back();
                                }else{
                                    $location.url('/healthFile?patientId='+search.patientId);
                                    $location.replace();
                                }
                                $scope.updateConsultDataEditFlag = false;
                                YB.info({
                                    content : '操作成功'
                                })
                            },
                            err : function(){
                                YB.info({
                                    content : '操作失败'
                                })
                            }
                        })
                    }
                })
            };
            $scope.cancelUpdateConsultDataInfo = function(){
                $scope.updateConsultDataEditFlag = false;
            };
            //默认信息添加
            $scope.focusDefaultValue = YB.addDefaultInfo;
            Ajax({
                url : 'ehr/consultRecord/view',
                method : 'get',
                data : {
                    id :search.recordId
                },
                suc : function(response){
                    YB.log(response);
                    $scope.consultInfoData = response;
                },
                err : function(){
                    YB.info({
                        content : '操作失败'
                    })
                }
            })
        }
    }]);

});