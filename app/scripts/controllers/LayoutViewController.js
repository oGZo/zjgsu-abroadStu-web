//主目录
define(['app'], function (app) {
    //angular.module('ui.bootstrap.demo');
    app.controller('LayoutViewController', ['$rootScope', '$scope', '$location', '$cookieStore', 'Ajax', '$timeout','$modal','$log',

        function ($rootScope, $scope, $location, $cookieStore, Ajax, $timeout,$modal,$log) {
            YB.log(arguments)
            //没有token时跳转到登陆页
            if (!$cookieStore.get(YB.param.sysParam.token)) {
                $location.path('/login');
                return;
            }else{
                var moduleJson = {
                    1 : 'student',
                    2 : 'teacher',
                    3 : 'manage'
                };
                $location.path('/'+moduleJson[YB.localStorage.getItem('userType')]);
            }
            var loadingObj = $('.loading-area');
            loadingObj.fadeOut();
            $rootScope.$on('$locationChangeSuccess', function (scope) {
                var currentModule = $location.path() && $location.path().slice(1) || '';
                //settingMenu(currentModule);
                loadingObj.fadeOut();
            });
            $rootScope.$on('$locationChangeStart', function (scope) {
                window.homeTableSearchTask = null;
                loadingObj.show();
            });
            //function settingMenu(currentModule) {
            //    var urlMap = {
            //        customer: ['patient', 'invite', 'memberCard', 'coupon', 'consultPhone', 'comment'],
            //        order: ['orderDetail'],
            //        person: [],
            //        home: [],
            //        healthPatient : []
            //    };
            //    //var currentModule = $location.path()&&$location.path().slice(1)||'';
            //    $.each(urlMap, function (i, v) {
            //        if (currentModule == i/*||(currentModule!==i&&$.inArray(currentModule,v)>-1)*/) {
            //            $scope.currentView = i;
            //            //alert(i);
            //            //alert(i);
            //            return false;
            //        }
            //    })
            //}
            //
            //settingMenu($location.path() && $location.path().slice(1));
            //if (!$cookieStore.get(YB.param.sysParam.token)) {
            //    $location.url('/login');
            //}
            $scope.setView = function (param) {
                $scope.currentView = param.moduleId;
            };
            //$scope.currentView = $location.path()&&$location.path().slice(1);
            $scope.user = {};
            $scope.user.name = YB.localStorage.getItem('userName');
            $scope.items = ['item1', 'item2', 'item3'];

            $scope.open = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    YB.localStorage.removeItem(YB.param.sysParam.userType);
                    YB.localStorage.removeItem('userName');
                    $cookieStore.remove(YB.param.sysParam.token);
                    $location.path('/login');
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
        }
    ]);
    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
        YB.log(arguments);
        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

});