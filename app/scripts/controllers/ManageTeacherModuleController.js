
//学生管理
define(['app'], function (app) {
    var moduleApp = {};
    app.controller('ManageTeacherController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            moduleApp.render = function () {
                var scope = $rootScope.$new();
                if(!YB.manageTeacherHtml){
                    $http.get('views/manageTeacher.html?version=' + SYSTEM_VERSION).then(function (res) {
                        YB.manageTeacherHtml = res.data;
                        renderPage();
                    });
                }else{
                    renderPage();
                }
                function renderPage(){
                    var html = YB.manageTeacherHtml;
                    var dialog = angular.element(html);
                    $('.J_manage_teacher').html(dialog);
                    var controller = $controller('ManageTeacherModuleController', {
                        $scope: scope,
                        $element: dialog
                    }, true, 1);
                    $timeout(function () {
                        $compile(dialog)(scope);
                    });
                }
            }
            if(!YB.manageTeacherHtml&&YB.param.currentManageModuleId==4){
                moduleApp.render();
            }

        }]);
    app.controller('ManageTeacherModuleController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {
        var search = $location.search();
        //初始化上传片插件
        var Upload = (function(upload) {
            var param = {}; //存储用
            upload.submit = function(formNode, callback) {
                var self = this,
                    formData = new FormData(formNode),
                    xhr = new XMLHttpRequest();
                param.callback = callback;
                // xhr.upload 在 iOS Safari、 大部分 Android 4.0+ 的自带浏览器、Chrome 都支持
                xhr.upload.addEventListener("progress", self.onProgress, false);
                xhr.addEventListener("load", self.onSuccess, false);
                xhr.addEventListener("error", self.onError, false);
                xhr.addEventListener("abort", self.onCancel, false);
                var urlParam = {};
                urlParam[YB.param.sysParam.token] = $cookieStore.get(YB.param.sysParam.token);
                urlParam[YB.param.sysParam.userType] = YB.localStorage.getItem(YB.param.sysParam.userType);
                xhr.open('post', window.BASE_URL + 'admin/insertTeacher?' + $.param(urlParam), false);
                xhr.send(formData);
            };
            // 可以在 onProgress 的时候处理进度条
            upload.onProgress = function(e) {
                if (e.lengthComputable) {
                    var progress = Math.round(e.loaded * 100 / e.total) + '%';
                    console.log('on progress: ', progress);
                }
            };
            upload.onError = function() {
                YB.info({content: '发送失败'});
            };
            upload.onCancel = function() {};
            upload.onSuccess = function(res) {
                var data = JSON.parse(res.currentTarget.responseText);
                if (data.status == 0) {
                    YB.info({content: '上传成功'});
                    $scope.query();
                } else {
                    YB.info({content: data.info});
                }
            };
            return upload;
        })(window.Upload || {});

        //选择图片
        $('#updateTeacherData').on('change', function(event) {
            var file = event.target.files[0];
            //校验
            if (file.size > 10 * 1024 * 1024) {
                event.preventDefault();
                YB.info({content: '图片大小不能超过10M'});
            } else {
                $(formNode).submit();
            }
        });

        //提交表单
        var formNode = document.getElementById('upload-teacher-form'); //图片上传表单节点
        $(formNode).on('submit', function(e) {
            e.preventDefault();
            //显示图片
            Upload.submit(formNode, function(res) {
                formNode.reset();

            });

        });

        $scope.maxSize = 10;
        $scope.bigCurrentPage = 1;
        $scope.params = {
            page: 1,
            num: $scope.maxSize
        };
        $scope.pageChanged = function (pageNo) {
            $scope.params.page = pageNo;
            var params = $.extend({},$scope.params);
            params = YB.getPageTableParam(params);
            delete params.page;
            delete params.num;
            Ajax({
                loadDom :$('.J_teacher_list'),
                method: 'post',
                data: params,
                url: 'admin/selectTeacher',
                suc: function (res) {
                    $scope.bigTotalItems = res.sum;
                    $scope.rows = res.teacherList;
                }
            })
        };
        $scope.query = function(){
            $scope.pageChanged(1);
        }
        $scope.query();
    }]);
    return moduleApp
});