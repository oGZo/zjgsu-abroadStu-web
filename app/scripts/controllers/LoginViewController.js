//登陆页面
define(['app'], function (app) {
    app.controller('LoginViewController', ['$scope', '$location', '$cookieStore', 'Ajax',
        function ($scope, $location, $cookieStore, Ajax) {
            var YB_UTIL = {
                random: function (len, type) {
                    len = len < 0 ? 0 : len;
                    type = type && type <= 3 ? type : 3;
                    var str = '';
                    for (var i = 0; i < len; i++) {
                        var j = Math.ceil(Math.random() * type);
                        if (j == 1) {
                            str += Math.ceil(Math.random() * 9);
                        } else if (j == 2) {
                            str += String.fromCharCode(Math.ceil(Math.random() * 25 + 65));
                        } else {
                            str += String.fromCharCode(Math.ceil(Math.random() * 25 + 97));
                        }
                    }
                    return str;
                }
            };
            //记住密码
            $scope.isRemember = false;
            //如果之前选择了记住密码则填充账号密码
            if (YB.localStorage.getItem('isRemember')) {
                $scope.isRemember = YB.localStorage.getItem('isRemember');
            }
            if (YB.localStorage.getItem('account')) {
                $scope.account = YB.localStorage.getItem('account');
            }
            if ($scope.isRemember && YB.localStorage.getItem('password')) {
                $scope.password = YB.localStorage.getItem('password');
            }
            $scope.accountBlur = function(){
                if($scope.account !== YB.localStorage.getItem('account')){
                    $scope.password = '';
                }else{
                    $scope.password = YB.localStorage.getItem('password');
                }
            }
            console.log($scope.isRemember);
            $scope.login = function () {
                var pageJson = {
                    1 : 'manage',
                    2 : 'teacher',
                    3 : 'student'
                }
                //if($scope.type==1){
                //    $location.path('/manage');
                //}
                $location.path('/'+pageJson[$scope.type]);
                $cookieStore.put(YB.param.sysParam.token, '111');
                YB.localStorage.setItem('userType', $scope.type);
                return;
                if (!$scope.account) {
                    YB.info({
                        content: '请输入手机号'
                    });
                } else if (!/^(0|86|17951)?(1[345789])[0-9]{9}$/.test($scope.account)) {
                    YB.info({
                        content: '手机号不合法'
                    });
                } else if (!$scope.password) {
                    YB.info({
                        content: '请输入密码'
                    });
                } else if (!YB.reg.pwd.test($scope.password)) {
                    YB.info({
                        content: '请输入6-25位密码'
                    });
                } else {
                    YB.localStorage.setItem('account', $scope.account);
                    var randomStr = YB_UTIL.random(6);
                    var password;
                    //上次选择了已有密码且当前密码与cookie中保存的相同
                    if($scope.password == YB.localStorage.getItem('password')){
                        if(!$scope.isRemember){ //不再保存密码
                            clearUserInfo();
                        }
                    } else {    //上次没有选择保存密码或当前密码与cookie中不同
                        if($scope.isRemember){  //本次保存密码
                            YB.localStorage.setItem('isRemember', true);
                            YB.localStorage.setItem('password', $scope.password);
                        } else {
                            clearUserInfo();
                        }
                    }
                    password = md5.hash(md5.hash($scope.password) + randomStr);
                    function clearUserInfo(){
                        YB.localStorage.removeItem('isRemember');
                        YB.localStorage.removeItem('password');
                    }
                    var pageJson = {
                        1 : 'manage',
                        2 : 'teacher',
                        3 : 'student'
                    }
                    //if($scope.type==1){
                    //    $location.path('/manage');
                    //}
                    $location.path('/'+pageJson[$scope.type]);
                    //Ajax({
                    //    url: 'assistant/security/user/login',
                    //    method: 'post',
                    //    data: {
                    //        phone: $scope.account,
                    //        password: password,
                    //        salt: randomStr
                    //    },
                    //    suc: function (res) {
                    //        $location.path('/home');
                    //        $cookieStore.put(YB.param.sysParam.token, res.yb_token);
                    //        $cookieStore.put(YB.param.sysParam.permission, res.brokerClass);
                    //    },
                    //    err: function (err) {
                    //
                    //    }
                    //})
                }
            }
        }
    ]);
});