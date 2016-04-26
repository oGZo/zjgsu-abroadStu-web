//window.BASE_HOST = '192.168.100.113:8095';
//window.BASE_HOST = '127.0.0.1:8080';
//window.BASE_HOST = '192.168.100.169:8080';
//window.BASE_HOST = '192.168.100.148:8095';
window.SYSTEM_VERSION = new Date().getTime();
if(config.type != 'develop'){
  SYSTEM_VERSION = config.timestamp;
}
window.BASE_HOST = config.url + 'assistant.120yibao.com';
//window.BASE_HOST = '10.0.0.12:8002/back';
//window.BASE_HOST = '192.168.100.169:8080';
//window.BASE_HOST = '192.168.100.141:8080';
//window.BASE_HOST = '192.168.100.148:8095';
//window.BASE_HOST = 'localhost:8000';
//window.BASE_HOST = '192.168.100.113:8095';
window.BASE_URL = 'http://' + BASE_HOST + '/yb/';
//window.BASE_URL = 'http://192.168.5.102:8080/';
require.config({
  urlArgs: "bust=" + SYSTEM_VERSION,
  baseUrl: '/scripts',
  //paths
  paths: {
    'app': 'app'
    //'angular': '../lib/angular',
    //'angular-route': '../plugin/angular-route',
    //'angular-ui-router': '../plugin/angular-ui-router',
    //'angular-animate': '../plugin/angular-animate',
    //'angular-cookies': '../plugin/angular-cookies',
    //'angular-table': '../plugin/angular-table',
    //'bootstrap': '../plugin/bootstrap',
    //'ui-bootstrap': '../plugin/ui-bootstrap-tpls',
    //'ngDialog': '../plugin/ngDialog',
    //'jquery': '../lib/jquery'
  },
  shim: {
    //'app': {
    //	//deps : []
    //	deps: ['angular', 'angular-route','angular-ui-router','angular-animate','angular-cookies', 'angular-table', 'ngDialog','bootstrap','ui-bootstrap']
    //},
    //'angular-route': {
    //	deps: ['angular']
    //},
    //'angular-ui-router': {
    //	deps: ['angular']
    //},
    //'angular-animate': {
    //	deps: ['angular']
    //},
    //'angular-cookies': {
    //	deps: ['angular']
    //},
    //'angular-table': {
    //	deps: ['angular']
    //},
    //'ngDialog': {
    //	deps: ['angular']
    //},
    //'bootstrap': {
    //	deps: ['jquery']
    //},
    //'ui-bootstrap': {
    //	deps: ['jquery','bootstrap','angular']
    //}
  }
});

require(['app'],
  function (app) {
    angular.bootstrap(document, ['app']);
  }
);