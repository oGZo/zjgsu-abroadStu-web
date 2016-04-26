define(['routes', 'services/dependencyResolverFor', 'services/services', 'directives/animations', 'directives/filter'], function (config, dependencyResolverFor) {
    //var app = angular.module('app', ['ui.router', 'ngDialog', 'ngAnimate', 'ngCookies', 'angular-table', 'Animations', 'ui.bootstrap']);
    var app = angular.module('app', ['ngRoute', 'ui.router', 'ngAnimate', 'ngCookies', 'Animations', 'ui.bootstrap', 'Filter', 'Ajax']);
    app.config([
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        function ($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider, $urlRouterProvider, $httpProvider) {
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            //$locationProvider.html5Mode(true);

            if (config.routes !== undefined) {
                angular.forEach(config.routes, function (route, path) {
                    var templateUrl = route.templateUrl+'?version='+ SYSTEM_VERSION;
                    var controller = route.controller;
                    $stateProvider.state(path, {
                        url: route.url,
                        templateUrl: templateUrl,
                        controller: controller,
                        css: route.css,
                        resolve: dependencyResolverFor(route.dependencies)
                    });
                });
               $urlRouterProvider.otherwise('/home');
            }
        }]);
    app.param = {
        'token': 'Yb-Token',
        sexJson: {
            0: '男',
            1: '男',
            2: '女'
        }
    };
    app.reg = {
        //手机号验证
        phone : /^(0|86|17951)?(1[345789])[0-9]{9}$/,
        //身份证验证
        idCard: /^(\d{6})(18|19|20)?(\d{2})([0][1-9]||1[0-2])(0[1-9]||[12]\d||3[01])(\d{3})(\d|X|x)?$/,
    };
    app.info = function(info){
        art.dialog({
            title: info.title || false,
            cancel: false,
            fixed: true,
            lock: true,
            time: info.time || 1,
            content: info.content
        });
    };
    return app;
});