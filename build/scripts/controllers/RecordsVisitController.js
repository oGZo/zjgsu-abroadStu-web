/**
 * Created by sanqi on 2016/1/8.
 */
    //个人资料页面
define(['app','controllers/HealthModuleViewController','controllers/VisitRecordsController'], function (app,health,process) {
    app.controller('RecordsVisitController', ['$scope', '$cookieStore','Ajax','$location', function ($scope, $cookieStore,Ajax,$location) {
        var search = $location.search();
        YB.log(search);
        if(!search.recordType){
            $location.search('recordType',2);
            $location.replace();
        }
        //跳到健康档案首页
        $scope.goHealthFilePage = function(){
            $location.url('/healthFile?patientId='+search.patientId);
        }
//        var pageData = {};
//        $.extend($scope,pageData);
//        $scope.visitData = {};
//        //alert(55);
//        Ajax({
//            url : 'ehr/followRecord/view',
//            method : 'get',
//            data : {
//                id :search.recordId
//            },
//            suc : function(response){
//                YB.log(response);
//                $scope.pathogenesisId = response.pathogenesisId;
//                $scope.visitData = response;
//                //$.extend($scope,response);
//            },
//            err : function(){
//                YB.info({
//                    content : '操作失败'
//                })
//            }
//        });
//        //添加病程
//        $scope.addPathogenesis = function(){
//            require(['module/courseAdd'],function(process){
//                var dialog = process.addProcess({
//                    patientId : search.patientId,
//                    ok : function(formData){
//                        Ajax({
//                            method: 'post',
//                            url: 'ehr/pathogenesis/add',
//                            data: formData,
//                            suc: function(res){
//                                //console.log(res);
//                                getPathogenesisList();
//                                $scope.baseInfoUpdateData.pathogenesisId = res;
//                                dialog.close();
//                            }
//                        });
//                    },
//                    cancel : function(res){
//                        //alert('fail');
//                        dialog.close();
//                    }
//                })
//            })
//        }
//        //修改随访记录
//        $scope.updateVisitDataInfo = function(){
//            $scope.updateVisitData = $.extend({},angular.copy($scope.visitData));
//            $scope.updateVisitData.pathogenesisList = [];
//            //YB.log(angular.copy($scope.visitData));
//            //if($.isNumeric($scope.updateVisitData.followupTimeStamp)){
//            //    $scope.updateVisitData.followupTimeStamp = new Date($scope.updateVisitData.followupTimeStamp).format('yyyy-MM-dd hh:mm');
//            //}
//            //获取病程列表
//            getPathogenesisList();
//        };
//
//        function getPathogenesisList(){
//            var postData = {
//                patientId :  $scope.visitData.patientId,
//                start : 0,
//                count : 10000
//            };
//            Ajax({
//                url : 'ehr/pathogenesis/list',
//                method : 'get',
//                data : postData,
//                suc : function(response){
//                    //$scope.$apply(function(){
//                    $scope.updateVisitData.pathogenesisList = response;
//                    $scope.updateVisitDataEditFlag = true;
//                    //countDefaultPathogenesis($scope.updateVisitData.pathogenesisId);
//                    //})
//                },
//                err : function(){
//                    YB.info({
//                        content : '操作失败'
//                    })
//                }
//            });
//        }
//        //计算默认病程
//        function countDefaultPathogenesis(id,noAngular) {
//            if($scope.updateVisitData){
//                $.each($scope.updateVisitData.pathogenesisList||[], function (i, v) {
//                    if (v.id == id) {
//                        if (noAngular) {
//                            $scope.$apply(function () {
//                                $scope.updateVisitData.pathogenesis = v;
//                            });
//                        } else {
//                            $scope.updateVisitData.pathogenesis = v;
//                        }
//                        return false;
//                    }
//                })
//            }
//            //YB.log($scope.updateVisitData);
//        }
//        //预览图片
//        $('#mainVisitArea')
//            .on('click','.img-list-area .img-list li',function(e){
//                var me = $(this);
//                var ul = me.parent();
//                var addImgFlag = ul.attr('data-flag');//是否为编辑区域
//                //if(addImgFlag)return;
//                if(me.hasClass('addImg'))return;
//                var siblings = ul.children();
//                //编辑模块 图片预览
//                if(addImgFlag&&siblings.length>1){
//                    siblings = siblings.slice(1);
//                }
//                var index = siblings.index(me);
//                var arr = [];
//                siblings.each(function(i,v){
//                    var img = $(v).find('img');
//                    var src = img.attr('data-bigsrc');
//                    var positionFlag = true;
//                    if(img.height()<screen.height*0.8&&img.width()<screen.width*0.8){
//                        positionFlag = false;
//                    }
//                    if(src){
//                        arr.push({
//                            src : src,
//                            positionFlag : positionFlag
//                        })
//                    }
//                })
//                if(arr.length){
//                    YB.previewImage({
//                        current : index,
//                        arr : arr
//                    })
//                }
//            })
//            .on('click','.img-list-area .left-btn',function(e){
//                var me = $(this);
//                var operate = me.closest('.img-operate-area');
//                var imgListArea = operate.siblings('.all-img-list');
//                var length = imgListArea.find('li').length;
//                var ulObj = imgListArea.find('.img-list');
//                var liArr = ulObj.find('li');
//                var index = imgListArea.attr('data-index');
//                var maxShowLength = 5;
//                var imgAreaWidth = liArr.outerWidth()+10;
//                var current = parseInt(imgListArea.attr('data-current'),10);
//                if(length>maxShowLength&&current>0){
//                    current-=1;
//                    imgListArea.attr('data-current',current);
//                    ulObj.stop(false,true).animate({
//                        'margin-left': 0-current*imgAreaWidth
//                    })
//                }
//                if(length<=maxShowLength){
//                    ulObj.stop(false,true).animate({
//                        'margin-left': 0
//                    })
//                    imgListArea.attr('data-current',0);
//                }
//            })
//            .on('click','.img-list-area .right-btn',function(e){
//                var me = $(this);
//                var operate = me.closest('.img-operate-area');
//                var imgListArea = operate.siblings('.all-img-list');
//                var length = imgListArea.find('li').length;
//                var ulObj = imgListArea.find('.img-list');
//                var liArr = ulObj.find('li');
//                var index = imgListArea.attr('data-index');
//                var maxShowLength = 5;
//                var imgAreaWidth = liArr.outerWidth()+10;
//                var current = parseInt(imgListArea.attr('data-current'),10);
//                var maxMoveLength = length - maxShowLength;
//                if(length>maxShowLength&&current<maxMoveLength){
//                    current+=1;
//                    imgListArea.attr('data-current',current);
//                    ulObj.stop(false,true).animate({
//                        'margin-left': 0-current*imgAreaWidth
//                    })
//                }
//
//            })
//        //添加图片
//        $scope.addImg = function(e,updateData){
//            var me = $(e.target);
//            var key = me.closest('.edit-area').attr('data-key');
//            updateData.imageInfoDTOList = updateData.imageInfoDTOList||[];
//            require(['module/uploadImg'],function(param){
//                var dialog = param.init({
//                    imageList :  angular.copy(updateData.imageInfoDTOList),
//                    token : $cookieStore.get(YB.param.sysParam.token),
//                    ok : function(res){
//                        $scope.$apply(function(){
//                            updateData.imageInfoDTOList = res;
//                        })
//                        dialog.close();
//                    },
//                    cancel : function(res){
//                        //alert('fail');
//                        dialog.close();
//                    }
//                })
//            })
//
//        }
//        $scope.removeImg = function(imgList,$index){
//            imgList.splice($index,1);
//        }
//        //保存修改病程
//        $scope.saveUpdateVisitDataInfo = function(){
//            var postData = {
//                id : search.recordId,
//                imageKeyList : [],
//                recordItemId : 11
//            };
//            $.extend(postData,angular.copy($scope.updateVisitData));
//            $.each($scope.updateVisitData.imageInfoDTOList,function(i,v){
//                postData.imageKeyList.push(v.imageKey);
//            });
//            //if($scope.updateVisitData.followupTimeStamp){
//            //    postData.followupTimeStamp = YB.getUnixTime($scope.updateVisitData.followupTimeStamp);
//            //}
//            delete postData.imageInfoDTOList;
//            delete postData.pathogenesis;
//            delete postData.pathogenesisList;
//            if(!postData.pathogenesisId){
//                YB.info({
//                    content : '病程不能为空'
//                })
//                return
//            }
//            //if(!postData.followupDesc){
//            //    YB.info({
//            //        content : '随访说明不能为空'
//            //    })
//            //    return
//            //}
//            if(!postData.followupDetail){
//                YB.info({
//                    content : '随访过程记录不能为空'
//                })
//                return
//            }
//            postData.imageKeyList = postData.imageKeyList.join(',');
//            Ajax({
//                url : 'ehr/followRecord/modify',
//                method : 'post',
//                data : postData,
//                suc : function(response){
//                    $.extend($scope.visitData,angular.copy($scope.updateVisitData));
//                    $scope.pathogenesisId = $scope.visitData.pathogenesisId;
//                    $scope.updateVisitDataEditFlag = false;
//                    YB.info({
//                        content : '操作成功'
//                    })
//                },
//                err : function(){
//                    YB.info({
//                        content : '操作失败'
//                    })
//                }
//            })
//        };
//        //删除记录
//        $scope.deleteRecord = function(){
//            YB.confirm({
//                hint : '确认要删除该记录么？',
//                ok : function(){
//                    var postData = {
//                        id : search.recordId
//                    };
//                    Ajax({
//                        url : 'ehr/record/delete',
//                        method : 'post',
//                        data : postData,
//                        suc : function(response){
//                            if(history&&history.length>1){
//                                history.back();
//                            }else{
//                                $location.url('/healthFile?patientId='+search.patientId);
//                                $location.replace();
//                            }
//                            $scope.updateVisitDataEditFlag = false;
//                            YB.info({
//                                content : '操作成功'
//                            })
//                        },
//                        err : function(){
//                            YB.info({
//                                content : '操作失败'
//                            })
//                        }
//                    })
//                }
//            })
//        };
//        $scope.treatResult = [
//            {
//                id : '无法描述',
//                text : '无法描述'
//            },
//            {
//                id : '治愈',
//                text : '治愈'
//            },
//            {
//                id : '明显改善',
//                text : '明显改善'
//            },
//            {
//                id : '部分疗效',
//                text : '部分疗效'
//            },
//            {
//                id : '未见改善',
//                text : '未见改善'
//            }
//        ]
////默认信息添加
//        $scope.focusDefaultValue = YB.addDefaultInfo;
//        $scope.cancelUpdateVisitDataInfo = function(){
//            $scope.updateVisitDataEditFlag = false;
//        };
//        $scope.$watch('updateVisitData.pathogenesisId',function(e){
//            countDefaultPathogenesis(e);
//        })
    }]);

});