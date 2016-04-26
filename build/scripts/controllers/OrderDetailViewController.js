//预约详情
define(['app'], function (app) {
    app.controller('OrderDetailViewController', ['$scope', '$http', 'Ajax', '$location',
        function ($scope, $http, Ajax, $location) {
            Ajax({
                method: 'post',
                data: {
                    orderSn: $location.search()['id']
                },
                url: 'assistant/order/detail',
                suc: function (res) {
                    res.order.type = parseInt(res.order.type, 10);
                    $.extend($scope, res);
                    $scope.order.capitalStatusStr = YB.param.capitalStatus[$scope.order.capitalStatus];
                    $scope.OrderStatusList = [];
                    $scope.OrderChangeList = [];
                    $scope.OrderRemarkList = [];
                    if (!res.order.isMemberShip) {
                        $scope.order.memberShipTypeName = '非会员';
                    }
                    //订单状态
                    $scope.order.orderStatusText = getOrderStatus(res.order);
                    //
                    //$scope.order.refundStatusText = YB.param.refundStatusJson[$scope.order.refundStatus];
                    //患者性别
                    $scope.order.patientSexText = YB.param.sexJson[$scope.order.patientSex];
                    //周几
                    $scope.order.weekText = YB.param.weekJson[$scope.order.week];
                    //上午还是下午
                    $scope.order.periodText = YB.param.periodJson[$scope.order.period];
                    $.each(res.logList || [], function (i, v) {
                        if (v.type == 1) {
                            v.logMsg = v.logMsg || '无';
                            v.statusStr = YB.param.logJson[1][v.status];
                            $scope.OrderStatusList.push(v);
                        } else if (v.type == 2) {
                            $scope.OrderRemarkList.push(v);
                        } else if (v.type == 3) {
                            v.statusStr = YB.param.logJson[3][v.status];
                            $scope.OrderChangeList.push(v);
                        }
                    });
                }
            })
            $scope.addLogInfo = function(OrderRemarkList){
                OrderRemarkList = OrderRemarkList || [];
                require(['module/addOrderLog'], function (param) {
                    var dialog = param.init({
                        ok: function (response) {
                            YB.log(response);
                            var formData = {
                                orderId : $scope.order.orderId
                            };
                            $.extend(formData,response);
                            Ajax({
                                url : 'assistant/order/saveLog',
                                data : formData,
                                method : 'post',
                                suc : function(res){
                                    OrderRemarkList.push({
                                        logMsg : response.logMessage,
                                        operator : YB.param.assistantInfo.nickname,
                                        createTime : new Date().getTime()
                                    })
                                    dialog.close();
                                    YB.info({
                                        content : '添加成功'
                                    })
                                },
                                err : function(res){
                                    YB.info({
                                        content : '添加失败'
                                    })
                                }
                            })
                        },
                        cancel: function () {
                            dialog.close();
                        }
                    })
                })
            }
        }]);
});