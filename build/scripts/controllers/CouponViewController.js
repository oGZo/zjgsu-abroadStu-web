//优惠券列表
define(['app'], function (app) {
  app.controller('CouponViewController', ['$scope', '$filter', '$log', '$http', '$location', "Ajax",
    function ($scope, $filter, $log, $http, $location, Ajax) {
      $scope.maxSize = 10;
      $scope.bigCurrentPage = 1;
      $scope.params = {
        customerId: $location.search()['id'],
        page: 1,
        num: $scope.maxSize
      };
      var couponJson = {
        0: '折扣券',
        1: '优惠券'
      };
      $scope.pageChanged = function (pageNo) {
        pageNo = pageNo || $scope.bigCurrentPage;
        $scope.params.page = pageNo;
        Ajax({
          loadDom :$('.p-coupon .data-container'),
          method: 'post',
          data: $scope.params,
          url: 'assistant/coupon/list',
          suc: function (res) {
            $scope.bigTotalItems = res.total;
            $scope.rows = res.rows
            $.each($scope.rows, function (i, v) {
              v.couponTypeName = couponJson[v.couponType];
              if (v.couponType == 0) {
                v.couponNum = v.amountOrDiscount * 10 + '折';
              } else {
                v.couponNum = v.amountOrDiscount + '元';
              }
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