//患者列表
define(['app'], function (app) {
    app.controller('HealthPatientViewController', ['$scope', '$filter', '$log', '$http', '$location', 'Ajax','$window',
        function ($scope, $filter, $log, $http, $location, Ajax,$window) {
            $scope.maxSize = 10;
            $scope.bigCurrentPage = 1;
            $scope.setTotalItems = function (pageNo) {
                $scope.bigTotalItems += 20;
                app.run('CustomerViewController');
            };
            $scope.params = {
                customerId: $location.search()['id'] || 2,
                page: 1,
                num: $scope.maxSize
            };
            $scope.tableFormData = {};
            $scope.query = function(){
                $scope.pageChanged(1);
                $scope.bigCurrentPage = 1;
            }
            $scope.pageChanged = function (pageNo) {
                pageNo = pageNo || $scope.bigCurrentPage;
                var formData = {};
                var params = {
                    num : $scope.maxSize,
                    page : $scope.bigCurrentPage
                }
                $.extend(formData,YB.getPageTableParam(params));
                $.extend(formData,angular.copy($scope.tableFormData));
                Ajax({
                    loadDom: $('.p-patient .data-container'),
                    method: 'post',
                    data: formData,
                    url: 'ehr/ehrpatient/list',
                    suc: function (res) {
                        $scope.bigTotalItems = res.total;
                        $scope.rows = res.patientDataList||[];
                        YB.log(res.patientDataList);
                    }
                })
            };
            $scope.goHealthFile = function (row) {
                console.log(row);
                YB.localStorage.setItem(row.idCard,JSON.stringify(row.patientUserDataList))
                var patient = row.patientUserDataList[0];
                $window.open('#/health?patientId=' + patient.patientId+'&idCard='+row.idCard);
            };
            $scope.goOtherPage = function () {
                if (arguments[0]) {
                    $location.url('/' + arguments[0] + '?id=' + arguments[1].index);
                }
            };
            $scope.pageChanged(1)
        }]);
});