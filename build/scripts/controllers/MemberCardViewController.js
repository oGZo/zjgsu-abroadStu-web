//会员卡列表
define(['app'], function (app) {
  app.controller('MemberCardViewController', ['$scope', '$filter', '$log', '$http', '$location', 'Ajax',
    function ($scope, $filter, $log, $http, $location, Ajax) {
      $scope.maxSize = 10;
      $scope.bigCurrentPage = 1;
      $scope.params = {
        customerId: $location.search()['id'],
        page: 1,
        num: $scope.maxSize
      };
      $scope.pageChanged = function (pageNo) {
        pageNo = pageNo || $scope.bigCurrentPage;
        $scope.params.page = pageNo;
        Ajax({
          loadDom :$('.p-memberCard .data-container'),
          method: 'post',
          data: $scope.params,
          url: 'assistant/member/list',
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
          $location.url('/' + arguments[0] + '?id=' + arguments[1].index);
        }
      }
      $scope.query = function () {
        $scope.bigCurrentPage = 1;
        $scope.pageChanged();
      }
      $scope.pageChanged(1)
    }]);
});