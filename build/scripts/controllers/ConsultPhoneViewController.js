//电话咨询列表
define(['app'], function (app) {
    app.controller('ConsultPhoneViewController', ['$scope', '$filter', '$log', '$http', '$location', 'Ajax', '$window',
        function ($scope, $filter, $log, $http, $location, Ajax, $window) {
            $scope.maxSize = 10;
            $scope.bigCurrentPage = 1;
            var consultPhoneParam = {
                status: {
                    '-1': '已取消',
                    1: '咨询中',
                    2: '待评价',
                    3: '已完成'
                },
                operate: {
                    1: '回复',
                    2: '详情',
                    3: '详情'
                }
            };
            $scope.params = {
                //customerId : $location.search()['id'],
                page: 1,
                num: $scope.maxSize
            };
            if ($location.search()['id']) {
                $scope.params.customerId = $location.search()['id'];
            }
            //请求电话咨询详情
            function getPhoneConsultDetail(id, callback) {
                Ajax({
                    method: 'post',
                    data: {
                        id: id
                    },
                    url: 'assistant/phoneConsult/detail',
                    suc: function (res) {
                        callback && callback(res);
                    }
                });
            }

            //咨询点击确定
            $scope.operatePhone = function (row) {
                $scope.currentPhone = row;
                getPhoneConsultDetail(row.id, function (res) {
                    $scope.phoneDetail = res;
                    //显示详情
                    if (row.status > 1) {
                        //渲染模板
                        var detailHtml = new EJS({
                            element: 'consultPhoneDetail'
                        }).render({
                            phoneDetail: res
                        });
                        //打开窗口
                        var detailDialog = art.dialog({
                            lock: true,
                            padding: 0,
                            title: false,
                            cancel: false,
                            fixed: true,
                            content: detailHtml
                        });
                        //关闭详情窗口
                        $('.J_cancelDetail').on('click', function () {
                            detailDialog && detailDialog.close();
                        });
                    } else {  //显示回复
                        //渲染模板
                        var infoHtml = new EJS({
                            element: 'consultPhoneInfo'
                        }).render({
                            phoneDetail: $scope.phoneDetail
                        });
                        //打开窗口
                        var infoDialog = art.dialog({
                            lock: true,
                            padding: 0,
                            title: false,
                            cancel: false,
                            fixed: true,
                            content: infoHtml
                        });
                        //提交回复
                        $('#J_consultPhoneInfoForm').on('submit', function (event) {
                            event.preventDefault();
                            var form = $(this).serializeArray(), formData = {};
                            angular.forEach(form, function (v) {
                                formData[v.name] = v.value;
                            });
                            formData.id = row.id;
                            formData.question = res.desc;
                            //if (!formData.question) {
                            //    YB.info({content: '请填写用户问题'});
                            //}
                            //else
                            if (!formData.answer) {
                                YB.info({content: '请回答用户问题'});
                            } else {
                                Ajax({
                                    method: 'post',
                                    data: formData,
                                    url: 'assistant/phoneConsult/reply',
                                    suc: function (res) {
                                        row.status = 2;
                                        row.statusStr = "待评价";
                                        row.operateStr = "详情";
                                        infoDialog && infoDialog.close();
                                        console.log(res);
                                        if (formData.addRecord && $scope.phoneDetail.patientId) {
                                            $location.path('/addConsultRecord').search({
                                                patientId: $scope.phoneDetail.patientId,
                                                consultId: row.id
                                            });
                                        }
                                    }
                                });
                            }
                        });
                        //关闭回复窗口
                        $('.J_cancelInfo').on('click', function () {
                            infoDialog && infoDialog.close();
                        });
                    }
                });
            };
            $scope.pageChanged = function (pageNo) {
                pageNo = pageNo || $scope.bigCurrentPage;
                $scope.params.page = pageNo;
                Ajax({
                    loadDom :$('.p-consultPhone .data-container'),
                    method: 'post',
                    data: $scope.params,
                    url: 'assistant/phoneConsult/list',
                    suc: function (res) {
                        $scope.bigTotalItems = res.total;
                        $scope.rows = res.rows
                        $.each($scope.rows, function (i, v) {
                            v.statusStr = consultPhoneParam.status[v.status];
                            v.operateStr = consultPhoneParam.operate[v.status];
                        });
                    }
                })
            };
            $scope.query = function () {
                $scope.bigCurrentPage = 1;
                $scope.pageChanged();
            };
            $scope.query();
        }
    ]);

});