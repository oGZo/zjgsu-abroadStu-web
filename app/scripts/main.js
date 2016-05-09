
window.SYSTEM_VERSION = new Date().getTime();
if(config.type != 'develop'){
  SYSTEM_VERSION = config.timestamp;
}
window.BASE_HOST = config.url ;

//window.BASE_URL = 'http://' + BASE_HOST + '/';
window.BASE_URL = 'http://localhost:8088/';
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