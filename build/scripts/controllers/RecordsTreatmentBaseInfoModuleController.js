//就诊信息基本信息修改
define(['app'], function (app) {
    function controllerInit(param){
        app.controller('RecordsTreatmentBaseInfoModuleController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
            function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
                var scope = $rootScope.$new();
                if(!YB.param['recordsTreatmentBaseInfoHtml']){
                    $http.get('views/recordsTreatmentBaseInfo.html?version='+SYSTEM_VERSION).then(function (res) {
                        YB.param['recordsTreatmentBaseInfoHtml'] = res.data;
                        initPage();
                    });
                }else{
                    initPage();
                }

                function initPage(){
                    param.viewEvent();
                    var dialog = angular.element(YB.param['recordsTreatmentBaseInfoHtml']);
                    var controller = $controller('RecordsTreatmentBaseInfoController', {
                        $scope: scope,
                        $element: dialog
                    }, true, 1);
                    $timeout(function () {
                        $compile(dialog)(scope);
                        param.dom.append(dialog);
                    });
                }
            }]);
        app.controller('RecordsTreatmentBaseInfoController', ['$scope', 'Ajax', '$location', '$controller', '$rootScope',
            function ($scope, Ajax, $location, $controller) {
                $.extend($scope,param.data);
                alert(55);
                $scope.clockObj = function(){
                    alert(98);
                }
                $scope.pathogenesisChange = function(){
                    alert(5)
                }
                $scope.subTypeChange = function(){
                    alert(9)
                }
                getPathogenesisList();
                function getPathogenesisList(){
                    $scope.pathogenesisList = [
                        {
                            "id":"1",             		//病程id
                            "beginDate": "2015-11-11", //开始时间
                            "name": "偏头疼",    // 病程名字
                            "desc" : '头疼呀呀呀'
                        },
                        {
                            "id":"2",             		//病程id
                            "beginDate": "2015-11-12", //开始时间
                            "name": "偏头疼",    // 病程名字
                            "desc" : '头疼呀呀呀'
                        },
                        {
                            "id":"3",             		//病程id
                            "beginDate": "2015-11-13", //开始时间
                            "name": "偏头疼",    // 病程名字
                            "desc" : '头疼呀呀呀'
                        },
                        {
                            "id":"4",             		//病程id
                            "beginDate": "2015-11-14", //开始时间
                            "name": "偏头疼",    // 病程名字
                            "desc" : '头疼呀呀呀'
                        },
                        {
                            "id":"5",             		//病程id
                            "beginDate": "2015-11-15", //开始时间
                            "name": "偏头疼",    // 病程名字
                            "desc" : '头疼呀呀呀'
                        }
                    ]
                }
            }]);
    }
    return  {
        controllerInit : controllerInit
    }
});