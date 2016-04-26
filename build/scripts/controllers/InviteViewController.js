//邀请列表
define(['app'], function (app) {
  app.controller('InviteViewController', ['$scope', '$filter', '$log', '$http', '$location', 'Ajax',
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
          loadDom :$('.p-invite .data-container'),
          method: 'post',
          data: $scope.params,
          url: 'assistant/invitation/list',
          suc: function (res) {
            $scope.bigTotalItems = res.total;
            $scope.rows = res.rows
            $.each($scope.rows, function (i, v) {

            });
          }
        })
      };
      $scope.query = function () {
        $scope.bigCurrentPage = 1;
        $scope.pageChanged();
      }
      $scope.query();
    }]);
});