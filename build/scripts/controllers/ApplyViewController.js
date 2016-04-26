//申请管理
define(['app'], function (app) {
  app.controller('ApplyViewController', ['$scope', '$filter', '$log', '$http', '$location',
    function ($scope, $filter, $log, $http, $location) {
      $scope.setTotalItems = function (pageNo) {
        $scope.bigTotalItems += 20;
        app.run('CustomerViewController');
      };
      $scope.params = {
        page: 1,
        num: $scope.maxSize
      };
      var applyJson = {
        type: {
          1: '门诊',
          2: '检查',
          3: '代问诊',
          4: '手术',
          5: '住院'
        },
        status: {
          1: '待回复',
          2: '已回复',
          3: '已回复'
        },
        operate: {
          1: '记录',
          2: '详情',
          3: '详情'
        }
      }
      $scope.applyInfo = function (row) {
        if (row.status == 1) {

        } else {

        }
      }
      $scope.pageChanged = function (pageNo) {
        pageNo = pageNo || $scope.bigCurrentPage;
        $scope.params.page = pageNo;
        $('#applySearchForm input[name]').each(function (i, v) {
          var me = $(this);
          var name = me.attr('name');
          var value = $.trim(me.val());
          $scope.params[name] = value;
        });
        $http({
          method: 'GET',
          params: $scope.params,
          url: '../resource/data/consultPhone.json'
        }).success(function (res) {
          $scope.bigTotalItems = res.rows.length;
          $.each(res.rows, function (i, v) {
            v.applyId = 1 + 10;
            v.customerName = i + '10';
            v.customerPhone = 150081304 + '' + i;
            v.patientName = i + 'patient10';
            v.applyTypeStr = applyJson.type[i % 5 || 3];
            v.brokerName = 'broker' + i;
            v.applyStatusStr = applyJson.status[i % 4 || 1];
            v.operate = applyJson.operate[i % 4 || 1];
            v.createTimeStr = new Date().format('yyyy.MM.dd');
          })
          $scope.rows = res.rows.slice($scope.maxSize * (pageNo - 1), $scope.maxSize * pageNo);
        })
      };
      $scope.query = function () {
        $scope.bigCurrentPage = 1;
        $scope.pageChanged();
      }
      $scope.maxSize = 15;
      $scope.bigCurrentPage = 1;
      $scope.query();
    }]);
});