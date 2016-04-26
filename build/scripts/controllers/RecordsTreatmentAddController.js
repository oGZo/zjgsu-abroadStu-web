/**
 * Created by sanqi on 2016/1/8.
 */
    //个人资料页面
define(['app'], function (app) {
    app.controller('RecordsTreatmentAddController', ['$scope', '$cookieStore','Ajax','$location','$window', function ($scope, $cookieStore,Ajax,$location,$window) {
        var search = $location.search();
        //YB.log(search);
        $.extend($scope,search);
        var formInitData = {
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
        };
        var formData = $.extend({},formInitData);
        $scope.formData = search;
        //getOrderList();
        //获取订单列表
        function getOrderList(res){
            var rows = res&&res.rows || [];
            $.each(rows,function(i,v){
                if(v.type<2){
                    v.type += 1;
                    v.subType = v.type;
                }
                if(v.type==5){
                    v.subType = v.type;
                }
                //1、2、5
                //三种type默认赋值
                v.typeName = YB.getTypeName(v.type);
            });
            //if(!rows.length){
                $.extend($scope.formData,formInitData);
            //}

            $scope.bigTotalItems = res.total;
            $scope.rows = rows;
        };
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
        getPathogenesisInfo();
        //获取记录信息
        function getPathogenesisInfo(){
            var postData = {
                patientId : search.patientId
            };
            Ajax({
                url : 'ehr/pathogenesis/list',
                method : 'get',
                data : postData,
                suc : function(response){
                    $scope.pathogenesisList = response;
                    //YB.log(response);
                    if(search.pathogenesisId){
                        var flag = true;
                        $.each(response,function(i,v){
                            if(v.id == $scope.formData.pathogenesisId){
                                flag = false;
                                $scope.formData.pathogenesis = v;
                            }
                        })
                        if(flag){
                            defaultPathogenesis();
                        }
                    }else{
                        defaultPathogenesis();
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

        //选择关联订单
        $scope.checkedRow = function(event,row){
            $(event.currentTarget).find('input:radio')[0].checked = true;
            if(row.isAdd==1){
                return;
            }
            $scope.currentRow = row;
            $scope.formData.type = row.type;
            $scope.formData.item = row.itemName;
            $.extend($scope.formData,row);
            //如果visitTime赋值为空字符；
            if(row.visitTime){
                $scope.formData.visitTime = new Date(row.visitTime).format('yyyy-MM-dd');
            }else{
                $scope.formData.visitTime = '';
            }
        }
        $scope.maxSize = 5;
        $scope.itemsPerPage = 5;
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
                                $scope.formData.pathogenesisId = res;
                                getPathogenesisInfo();
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
        //订单换页方法
        $scope.pageChanged = function (pageNo) {
            pageNo = pageNo || $scope.bigCurrentPage;
            var params = $scope.getOrderTableParam(pageNo);
            params.patientId = search.patientId;
            delete params.num;
            delete params.page;
            Ajax({
                loadDom : $('.order-data-list'),
                method: 'get',
                data: params,
                url: 'ehr/order/list',
                suc: function (res) {
                    getOrderList(res);
                }
            })
        };
        //就诊类型列表
        $scope.subTypeList = YB.param.subTypeList;
        //获取订单列表换页参数
        $scope.getOrderTableParam = function(page){
            var params = {
                num : $scope.maxSize,
                page : page
            }
            if($scope.beginDate){
                params.startTimeStamp = YB.getUnixTime($scope.beginDate);
            }
            if($scope.endDate){
                params.endTimeStamp = YB.getUnixTime($scope.endDate);
            }
            params = $.extend(params,YB.getPageTableParam(params));
            return params;
        }
        //查询订单
        $scope.queryOrder = function (param) {
            $scope.orderShowFlag = param;
            $scope.bigCurrentPage = 1;
            $scope.pageChanged();
        };
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
                })
                return ;
            }
            $.extend(postData,formData);
            //postData.subType = $('[name="subType"]').val();
            //postData.visitTime = $('[name="visitTime"]').val();
            if(postData.visitTime){
                postData.visitTime = YB.getUnixTime(postData.visitTime);
            }
            //系统范围内 三种类型 不用选 直接赋值
            if(YB.param.subTypeMap[postData.type]){
                postData.subType = postData.type;
            }
            delete postData.pathogenesis;
            delete postData.type;
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
            if(!postData.orderId){
                //if(!postData.item){
                //    YB.info({
                //        content:'请输入科室'
                //    })
                //    return;
                //}
                //if(!postData.doctorName){
                //    YB.info({
                //        content:'请输入医生'
                //    })
                //    return;
                //}
                //if(!postData.hospitalName){
                //    YB.info({
                //        content:'请输入医院'
                //    })
                //    return;
                //}
                //if(!postData.treatmentAddress){
                //    YB.info({
                //        content:'请输入出诊地点'
                //    })
                //    return;
                //}
            }
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
                        content : '操作失败'
                    })
                }
            })
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