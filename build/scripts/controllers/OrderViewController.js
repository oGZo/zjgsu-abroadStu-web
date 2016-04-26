//预约列表
define(['app'], function (app) {
    app.controller('OrderViewController', ['$scope', '$http', '$location', 'Ajax','$window',
        function ($scope, $http, $location, Ajax,$window) {

            $scope.typeList = [
                {
                    id: 3,
                    name: '门诊'
                },
                {
                    id: 2,
                    name: '检查'
                }
            ];
            $scope.maxSize = 10;
            //$scope.bigTotalItems = 10;
            $scope.bigCurrentPage = 1;
            var serviceJson = {
                0: '否',
                1: '是'
            }
            $scope.isServiceFun = function (param) {
                return serviceJson[param];
            }
            $scope.params = {
                page: 1,
                num: $scope.maxSize
            };
            var customerId = $location.search()['id'];
            if (customerId) {
                $scope.params['customerId'] = customerId;
            }
            $scope.pageChanged = function (pageNo) {
                pageNo = pageNo || $scope.bigCurrentPage;
                $scope.params.page = pageNo;
                $('#customerSearchForm [name]').each(function (i, v) {
                    var me = $(this);
                    var name = me.attr('name');
                    var value = $.trim(me.val());
                    //if(value){
                    $scope.params[name] = value;
                    //}
                });
                Ajax({
                    loadDom :$('.p-order .data-container'),
                    method: 'post',
                    data: $scope.params,
                    url: 'assistant/order/list',
                    suc: function (res) {
                        $scope.bigTotalItems = res.total;
                        $scope.rows = res.rows
                        $.each($scope.rows, function (i, v) {

                        })
                    }
                })
            };
            $scope.goOtherPage = function () {
                if (arguments[0]) {
                    if (arguments[0] == 'healthFile') {
                        $window.open('#/healthFile?patientId=' + arguments[1].patientId);
                        //$location.url('/healthFile?patientId=' + arguments[1].patientId);
                    } else if (arguments[0] == 'recordsTreatment') {
                        $window.open('#/recordsTreatment?patientId=' + arguments[1].patientId+'&recordId='+arguments[1].recordId);
                        //$location.url('/recordsTreatment?patientId=' + arguments[1].patientId+'&recordId='+arguments[1].recordId);
                    } else  if (arguments[0] == 'recordsTreatmentAddDetail') {
                        $window.open('#/recordsTreatmentAddDetail?patientId=' + arguments[1].patientId+'&orderId='+arguments[1].orderId);
                        //$location.url('/recordsTreatment?patientId=' + arguments[1].patientId+'&recordId='+arguments[1].recordId);
                    }else {
                        $window.open('#/'+ arguments[0] + '?id=' + arguments[1].orderSn);
                        //$location.url('/' + arguments[0] + '?id=' + arguments[1].orderSn);
                    }
                }
            }
            $scope.query = function () {
                $scope.bigCurrentPage = 1;
                $scope.pageChanged();
            }
            $scope.query();
            //更改预约的私人助理
            $scope.changeAssistant = function (row) {
                if(row.status=='待安排'||row.status=='待就诊'){
                    require(['module/assistantList'], function (param) {
                        Ajax({
                            method: 'post',
                            url: 'assistant/all/list',
                            suc: function (res) {
                                var dialog = param.init({
                                    data: {
                                        brokerList: res,
                                        assistUserId: row.assistantUserId
                                    },
                                    ok: function (response) {
                                        YB.log(response);
                                        Ajax({
                                            url : 'assistant/order/changeOperator',
                                            data : {
                                                orderId:row.orderId,
                                                operatorChName: response.nickName,
                                                operatorPhone : response.brokerPhone,
                                                assistantUserId : response.userId
                                            },
                                            method : 'post',
                                            suc : function(res){
                                                $scope.pageChanged();
                                                dialog.close();
                                                YB.info({
                                                    content : '修改成功'
                                                })
                                            },
                                            err : function(res){
                                                YB.info({
                                                    content : '修改失败'
                                                })
                                            }
                                        })
                                    },
                                    cancel: function () {
                                        dialog.close();
                                    }
                                })
                            }
                        })
                    })
                }
            }
        }]);
});