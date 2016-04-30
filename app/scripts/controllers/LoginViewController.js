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
                if (!$scope.account) {
                    YB.info({
                        content: '请输入账号'
                    });
                } else if (!$scope.password) {
                    YB.info({
                        content: '请输入密码'
                    });
                } else if (!YB.reg.pwd.test($scope.password)) {
                    YB.info({
                        content: '请输入4-25位密码'
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
                        1 : {
                            module : 'student',
                            url : 'user/student/login'
                        },
                        2 : {
                            module : 'teacher',
                            url : 'user/teacher/login'
                        },
                        3 : {
                            module : 'manage',
                            url : 'user/admin/login'
                        }
                    };
                    var obj = pageJson[$scope.userType];
                    YB.localStorage.setItem('userType', $scope.userType);
                    Ajax({
                        url: obj.url,
                        method: 'post',
                        data: {
                            account: $scope.account,
                            password: password,
                            salt: randomStr
                        },
                        suc: function (res) {
                            $location.path('/' + obj.module);
                            $cookieStore.put(YB.param.sysParam.token, res.token);
                            YB.localStorage.setItem('userName', res.name);
                        },
                        err: function (err) {

                        }
                    })
                }
            }
        }
    ]);
});