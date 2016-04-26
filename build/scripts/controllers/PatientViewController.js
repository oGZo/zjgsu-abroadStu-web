//患者列表
define(['app'], function (app) {
  app.controller('PatientViewController', ['$scope', '$filter', '$log', '$http', '$location', 'Ajax','$window',
    function ($scope, $filter, $log, $http, $location, Ajax,$window) {
      $scope.maxSize = 10;
      $scope.bigCurrentPage = 1;
      $scope.setTotalItems = function (pageNo) {
        $scope.bigTotalItems += 20;
        app.run('CustomerViewController');
      };
      $scope.params = {
        customerId: $location.search()['id'],
        page: 1,
        num: $scope.maxSize
      };
      $scope.pageChanged = function (pageNo) {
        pageNo = pageNo || $scope.bigCurrentPage;
        $scope.params.page = pageNo;
        Ajax({
          loadDom :$('.p-patient .data-container'),
          method: 'post',
          data: $scope.params,
          url: 'assistant/patient/list',
          suc: function (res) {
            $scope.bigTotalItems = res.total;
            $scope.rows = res.rows
            $.each($scope.rows, function (i, v) {

            });
          }
        })
      };
      $scope.goHealthFile = function(row){
        console.log(row);
        $window.open('#/healthFile?patientId=' + row.patientId);
      };
      $scope.goOtherPage = function () {
        if (arguments[0]) {
          $location.url('/' + arguments[0] + '?id=' + arguments[1].index);
        }
      };
      $scope.pageChanged(1)
    }]);
});