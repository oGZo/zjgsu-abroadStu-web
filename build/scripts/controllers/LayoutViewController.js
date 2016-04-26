//主目录
define(['app'], function (app) {
    app.controller('LayoutViewController', ['$rootScope', '$scope', '$location', '$cookieStore', 'Ajax', '$timeout',

        function ($rootScope, $scope, $location, $cookieStore, Ajax, $timeout) {
            //没有token时跳转到登陆页
            if (!$cookieStore.get(YB.param.sysParam.token)) {
                $location.path('/login');
                return;
            }
            var loadingObj = $('.loading-area');
            loadingObj.fadeOut();
            $rootScope.$on('$locationChangeSuccess', function (scope) {
                var currentModule = $location.path() && $location.path().slice(1) || '';
                settingMenu(currentModule);
                loadingObj.fadeOut();
            });
            $rootScope.$on('$locationChangeStart', function (scope) {
                window.homeTableSearchTask = null;
                loadingObj.show();
            });
            function settingMenu(currentModule) {
                var urlMap = {
                    customer: ['patient', 'invite', 'memberCard', 'coupon', 'consultPhone', 'comment'],
                    order: ['orderDetail'],
                    person: [],
                    home: [],
                    healthPatient : []
                };
                //var currentModule = $location.path()&&$location.path().slice(1)||'';
                $.each(urlMap, function (i, v) {
                    if (currentModule == i/*||(currentModule!==i&&$.inArray(currentModule,v)>-1)*/) {
                        $scope.currentView = i;
                        //alert(i);
                        //alert(i);
                        return false;
                    }
                })
            }

            settingMenu($location.path() && $location.path().slice(1));
            if (!$cookieStore.get(YB.param.sysParam.token)) {
                $location.url('/login');
            }
            $scope.menus = [
                {
                    id: 1,
                    moduleId: 'home',
                    icon: 'home',
                    name: '首页'
                },
                {
                    id: 2,
                    moduleId: 'person',
                    icon: 'person',
                    name: '个人管理'
                },
                {
                    id: 3,
                    moduleId: 'order',
                    icon: 'order',
                    name: '预约管理'
                },
                //{
                //    id : 4,
                //    moduleId : 'apply',
                //    name: '申请管理'
                //},
                //{
                //    id : 4,
                //    moduleId : 'health',
                //    name: '健康管理'
                //},
                {
                    id: 6,
                    moduleId: 'customer',
                    icon: 'customer',
                    name: '用户管理'
                },
                {
                    id: 7,
                    moduleId: 'healthPatient',
                    icon: 'health',
                    name: '健康档案'
                }
            ];
            Ajax({
                method: 'post',
                //data : $scope.params,
                url: 'assistant/homepage/info',
                suc: function (res) {
                    //$scope.bigTotalItems = res.total;
                    $.extend($scope, res);
                    YB.param.assistantInfo = res;
                    //$scope.userImgUrl = 'http://t.yh.120yibao.com/doctor-man.png';
                }
            });
            $scope.setView = function (param) {
                $scope.currentView = param.moduleId;
            };
            $scope.goConsultPhone = function () {
                $scope.currentView = 'customer';
                $location.path('/consultPhone');
            };
            $timeout(function () {
                if (!$location.path()) {
                    $scope.currentView = 'home';
                    $location.path('/home');
                }
            }, 100);
            //$scope.currentView = $location.path()&&$location.path().slice(1);
            $scope.logout = function () {
                art.dialog({
                    lock: true,
                    opacity: 0.4,	// 透明度
                    width: 320,
                    height: 160,
                    title: '壹宝提醒',
                    content: '确定要退出吗？',
                    ok: function () {
                        $cookieStore.remove(YB.param.sysParam.token);
                        $location.url('/login');
                        Ajax({
                            method: 'post',
                            url: 'assistant/account/logout',
                            suc: function (res) {
                                $cookieStore.remove(YB.param.sysParam.token);
                                $location.url('/login');
                            }
                        });
                    },
                    cancel: true
                });
            }
        }
    ]);

});