define(function () {
    var Ajax = angular.module('Ajax', ['ui.bootstrap']);

    Ajax.factory('Ajax', ['$http', '$cookieStore', '$location',
        function ($http, $cookieStore, $location) {
            //将请求参数编码
            function processData(obj){
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
            return function (param) {

                var token = $cookieStore.get(YB.param.sysParam.token);
                var ajax = {
                    method: param.method && param.method.toLowerCase() || 'get',
                    url: window.BASE_URL + param.url + '?t=' + new Date().getTime(),
                    headers: param.headers || {}
                };

                if (ajax.method == 'get') { //get请求参数放在params内 token也放在params内
                    ajax.params = param.data || {};
                } else {    //post请求参数放在data内 token放在headers内
                    ajax.data = param.data || {};
                }

                if (param.type == 'raw') {  //raw请求使用原生方法
                    ajax.headers['content-Type'] = 'application/json';
                    ajax.params = JSON.stringify(ajax.params);
                } else {    //非raw请求设置请求头 并将post请求的参数转码
                    ajax.headers['content-Type'] = 'application/x-www-form-urlencoded';
                    if(ajax.method == 'post') {
                        ajax.data = processData(ajax.data);
                    }
                }
                if(token){
                    if(location.host!=BASE_HOST){
                        ajax.url += '&'+YB.param.sysParam.token +'=' + token;
                    }else{
                        ajax.headers[YB.param.sysParam.token] = token;
                    }
                }
                if(param.loadDom){
                    var loadObj = $('.loading-area').clone().appendTo(param.loadDom).show();
                }
                return $http(ajax).success(function (data, status, headers, config) {
                    if(loadObj){
                        loadObj.remove();
                    }
                    if (status == 200) {
                        if (data.status == 0) {
                            try {
                                if(data.data){
                                    //try{
                                        data = $.parseJSON(data.data);
                                        param.suc && param.suc(data);
                                    //}catch(e){
                                    //    param.suc && param.suc(data.data);
                                    //}
                                }else{
                                    param.suc && param.suc();
                                }
                            } catch (e) {
                                console.log(e);
                                YB.info({
                                    content: '数据错误'
                                });
                            }
                        } else if (data.status == 99) {
                            $location.path('/login');
                        } else {
                            YB.info({
                                content: data.info
                            });
                        }

                    } else {
                        YB.info({
                            content: '网络错误'
                        });
                    }
                }).error(function (data, status, headers, config) {
                    YB.info({
                        content: '网络错误'
                    });
                    param.err && param.err(data);
                })
            }
        }]);
})

