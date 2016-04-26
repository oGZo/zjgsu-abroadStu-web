/**
 * Created by sanqi on 2016/1/8.
 */
    //个人资料页面
define(['app'], function (app) {
    app.controller('RecordsTreatmentAddDetailController', ['$scope', '$cookieStore','Ajax','$location','$window', function ($scope, $cookieStore,Ajax,$location,$window) {
        var search = $location.search();
        YB.log(search);
        $.extend($scope,search);
        var formData = {
            "date":"",        // 开始时间
            "type":"",					//类型,1:就诊记录,2:随访记录,3:咨询记录
            "subType":"",				//子类型
            "orderId":""	,			//关联订单id，可以为空
            "visitTime":"",   //就诊时间
            "lastOperateUserId":"",		//追踪人
            "item":"",					//科室
            "doctorName":"",				//医生
            "doctorId":"",				//医生id
            "hospitalName":"",			//医院名称
            "hospitalId":"",				//医院id
            "treatmentAddress":"",		//出诊地点
        }
        $scope.formData = search;

        ////病程改变时事件监听
        //$('#pathogenesisIdOption').on('change',function(e){
        //    var me = $(this);
        //    $scope.formData.pathogenesisId = me.val();
        //    $.each($scope.pathogenesisList,function(i,v){
        //        if(v.id == $scope.formData.pathogenesisId){
        //            $scope.$apply(function(){
        //                $scope.formData.pathogenesis = v;
        //            })
        //        }
        //    })
        //})
        $scope.$watch('formData.pathogenesisId',function(e){
            if($scope.pathogenesisList){
                $.each($scope.pathogenesisList,function(i,v){
                    if(v.id == e){
                        $scope.formData.pathogenesis = v;
                    }
                })
            }

        })
        //打开订单详情
        $scope.goOrderDetail = function(row){
            $window.open('#/orderDetail?id='+ row.orderSn);
        }
        //获取记录信息
        function getPathogenesisList(){
            var postData = {
                patientId : search.patientId||$scope.formData.patientId
            };
            Ajax({
                url : 'ehr/pathogenesis/list',
                method : 'get',
                data : postData,
                suc : function(response){
                    $scope.pathogenesisList = response;
                    YB.log(response);
                    if(search.pathogenesisId){
                        var flag = true;
                        $.each(response,function(i,v){
                            if(v.id == $scope.formData.pathogenesisId ){
                                flag = false;
                                $scope.formData.pathogenesis = v;
                            }else{

                            }
                        })
                        if(flag){
                            defaultPathogenesis()
                        }
                    }else{
                        defaultPathogenesis()
                    }
                    function defaultPathogenesis(){
                        if(response.length){
                            $scope.formData.pathogenesis = response[0];
                            $scope.formData.pathogenesisId = response[0].id;
                        }
                    }
                },
                err : function(){
                    YB.info({
                        content : '操作失败'
                    })
                }
            })
        }

        //添加病程
        $scope.addPathogenesis = function(){
            require(['module/courseAdd'],function(process){
                var dialog = process.addProcess({
                    patientId : $scope.formData.patientId,
                    ok : function(formData){
                        Ajax({
                            method: 'post',
                            url: 'ehr/pathogenesis/add',
                            data: formData,
                            suc: function(res){
                                $scope.formData.pathogenesisId = res;
                                getPathogenesisList();
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
        }
        //查询订单
        $scope.queryOrder = function () {
            Ajax({
                method: 'get',
                data: {
                    start : 0,
                    count : 1,
                    patientId : search.patientId,
                    orderId : search.orderId
                },
                url: 'ehr/order/list',
                suc: function (res) {
                    $.extend($scope.formData,res.rows[0]);
                    if($scope.formData.type<2){
                        $scope.formData.type += 1;
                        $scope.formData.subType = $scope.formData.type;
                    }
                    if($scope.formData.type==5){
                        $scope.formData.subType = $scope.formData.type;
                    }
                    if($scope.formData.visitTime){
                        $scope.formData.visitTimeFlag = true;
                    }
                    $scope.formData.item = $scope.formData.itemName;
                    //YB.log(res);
                }
            })
        };
        //获取就诊记录信息
        $scope.getRecordInfo = function(){
            Ajax({
                method: 'get',
                data: {
                    recordId : search.recordId
                },
                url: 'ehr/pathogenesisRecord/view',
                suc: function (res) {
                    if(res.visitTime){
                        res.visitTime = new Date(res.visitTime).getTime();
                        res.visitTimeFlag = true;
                    }
                    res.subType == res.type;
                    $.extend($scope.formData,res);
                    getPathogenesisList();
                    YB.log(res);
                }
            })
        }
        //添加就诊记录
        $scope.addTreatment = function(){
            var postData = {
                patientId : search.patientId,
                pathogenesisId : search.pathogenesisId
            };
            var formData = angular.copy($scope.formData);
            if(formData.pathogenesis){
                formData.pathogenesisId = formData.pathogenesis.id;
            }else{
                YB.info({
                    content:'请选择病程'
                });
                return ;
            }
            formData.pathogenesisId = formData.pathogenesis.id;
            //postData.subType = $('[name="subType"]').val();
            //postData.visitTime = $('[name="visitTime"]').val();
            //if(postData.visitTime){
            //    postData.visitTime = new Date($('[name="visitTime"]').val()).getTime();
            //}
            //系统范围内 三种类型 不用选 直接赋值
            if(YB.param.subTypeMap[postData.type]){
                postData.subType = postData.type;
            }
            delete formData.pathogenesis;
            delete formData.type;
            $.extend(postData,formData);
            //if(postData.visitTime){
            //    postData.visitTime = YB.getUnixTime(postData.visitTime);
            //}
            if(!postData.pathogenesisId){
                YB.info({
                    content:'请选择病程'
                })
                return;
            }
            if(!postData.subType){
                YB.info({
                    content:'请选择就诊类型'
                })
                return;
            }
            if(!postData.visitTime){
                YB.info({
                    content:'请选择就诊时间'
                })
                return;
            }
            if(postData.visitTime&&postData.visitTime.indexOf&&postData.visitTime.indexOf('-')>-1){
                postData.visitTime = YB.getUnixTime(postData.visitTime);
            }
            if(search.recordId){
                Ajax({
                    url : 'ehr/pathogenesisRecord/modify',
                    method : 'post',
                    data : {
                        id : search.recordId,
                        pathogenesisId : formData.pathogenesisId,
                        subType : postData.subType,
                        taskId : formData.taskId,
                        orderId : formData.orderId
                    },
                    suc : function(response){
                        YB.info({
                            content : '修改成功'
                        })
                        YB.openerFun('homeTableSearchTask');
                        $location.url('/recordsTreatment?recordId='+search.recordId+"&patientId="+postData.patientId);
                        $location.replace();
                    },
                    err : function(){
                        YB.info({
                            content : '修改失败'
                        })
                    }
                })
            }else{
                Ajax({
                    url : 'ehr/visitRecord/add',
                    method : 'post',
                    data : postData,
                    suc : function(response){
                        YB.info({
                            content : '添加成功'
                        })
                        YB.openerFun('homeTableSearchTask');
                        $location.url('/recordsTreatment?recordId='+response.recordId+"&patientId="+postData.patientId);
                        $location.replace();
                    },
                    err : function(){
                        YB.info({
                            content : '添加失败'
                        })
                    }
                })
            }

        }
		
        //就诊类型列表
		$scope.subTypeList = YB.param.subTypeList;
        //初始化页面信息
        if(search.recordId){
            $scope.getRecordInfo();
        }else{
            $scope.queryOrder();
            getPathogenesisList();
        }

        //取消添加纪录
        $scope.cancel = function(){
            if(history&&history.length>1){
                history.back();
            }else{
                $location.url('/healthFile?patientId='+search.patientId);
                $location.replace();
            }
        }
    }]);

});