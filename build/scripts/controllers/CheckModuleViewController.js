//健康档案 患者信息
define(['app'], function (app) {
    function controllerInit(param){
        app.controller('CheckModuleViewController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
            function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
                var scope = $rootScope.$new();
                alert(11);
                $http.get('views/checkModule.html?version='+SYSTEM_VERSION).then(function (res) {
                    var dialog = angular.element(res.data);
                    var controller = $controller('CheckViewController', {
                        $scope: scope,
                        $element: dialog
                    }, true, 1);
                    $timeout(function () {
                        $compile(dialog)(scope);
                        param.dom.append(dialog);
                    });
                });
            }]);
        app.controller('CheckViewController', ['$scope', 'Ajax', '$location', '$controller', '$rootScope',
            function ($scope, Ajax, $location, $controller) {
               $scope.clockObj = function(){
                   alert(98);
               }
            }]);
    }
    return  {
        controllerInit : controllerInit
    }
});