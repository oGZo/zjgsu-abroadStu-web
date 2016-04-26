//用户列表
define(['app'], function (app) {
  app.controller('CustomerViewController', ['$scope', '$filter', '$log', '$http', '$location', 'Ajax',
    function ($scope, $filter, $log, $http, $location, Ajax) {
      $scope.maxSize = 10;
      //$scope.bigTotalItems = 10;
      $scope.bigCurrentPage = 1;
      var serviceJson = {
        0: '否',
        1: '是'
      };
      $scope.isServiceFun = function (param) {
        return serviceJson[param];
      };
      $scope.params = {
        page: 1,
        num: $scope.maxSize
      };
      $scope.pageChanged = function (pageNo) {
        console.log(arguments);
        pageNo = pageNo || $scope.bigCurrentPage;
        $scope.params.page = pageNo;
        $('#customerSearchForm input[name]').each(function (i, v) {
          var me = $(this);
          var name = me.attr('name');
          var value = $.trim(me.val());
          //if(value){
          $scope.params[name] = value;
          //}
        });
        Ajax({
          loadDom :$('.p-customer .data-container'),
          method: 'post',
          data: $scope.params,
          url: 'assistant/customer/list',
          suc: function (res) {
            $scope.bigTotalItems = res.total;
            $scope.rows = res.rows
            $.each($scope.rows, function (i, v) {

            });
          }
        })
      };
      $scope.goOtherPage = function () {
        console.log(arguments);
        if (arguments[0]) {
          if (!arguments[2]) {
            art.dialog({
              title: false,
              cancel: false,
              fixed: true,
              lock: true,
              time: 1,
              content: '无相关信息'
            });
            return;
          }
          $location.url('/' + arguments[0] + '?id=' + arguments[1].customerId);
        }
      };
      $scope.query = function () {
        $scope.bigCurrentPage = 1;
        $scope.pageChanged();
      };
      $scope.pageChanged(1)
    }]);
});