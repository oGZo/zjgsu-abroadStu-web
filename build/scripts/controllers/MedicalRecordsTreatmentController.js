/**
 * Created by sanqi on 2016/1/8.
 */
    //个人资料页面
define(['app','module/checkAdd'], function (app,check) {
    app.controller('MedicalRecordsModuleViewController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            var scope = $rootScope.$new();
            $http.get('views/medicalRecords.html?version='+SYSTEM_VERSION).then(function (res) {
                var dialog = angular.element(res.data);
                $('.J_medical-records').append(dialog);
                var controller = $controller('MedicalRecordsTreatmentController', {
                    $scope: scope,
                    $element: dialog
                }, true, 1);
                $timeout(function () {
                    $compile(dialog)(scope);
                });
            });
        }]);
    app.controller('MedicalRecordsTreatmentController', ['$scope','$rootScope', '$cookieStore', '$controller','$compile','$timeout','Ajax','$location','$window',function ($scope, $rootScope,$cookieStore,$controller,$compile,$timeout,Ajax,$location,$window) {
        var search = $location.search();
        //if(search.recordId){
        //    medicalRecordInit();
        //}else {
        //    search.recordId = YB.param.recordId;
        //    //YB.medicalRecordInit = medicalRecordInit;
        //}
        if(search.recordType==1){
            medicalRecordInit();
        }
        YB.medicalRecordInit = medicalRecordInit;
        function medicalRecordInit(){
            //YB.log(search);
            $.extend($scope,search);
            //跳到健康档案首页
            $scope.goHealthFilePage = function(){
                $location.url('/healthFile?patientId='+search.patientId);
            }
            $scope.print = function(){
                $window.print();
            }
            var formData = {};
            var typeJson = YB.param.subTypeMap;
            //formData.subTypeName = typeJson[formData.subType];
            //$.extend($scope,formData);
            function initPageInfo(res){
                formData = res;
                formData.subTypeName = typeJson[formData.subType];
                if(formData.ssistantTask){
                    formData.ssistantTask.statusStr = YB.param.statusMap[formData.ssistantTask.status];
                }
                $.extend($scope,formData);
                $scope.checkNoFlag = $scope.basicInfo.isChecked;
            }
            getPathogenesisInfo();
            $scope.$watch('checkDTOs',function(list){
                isCheckEmpty(list);
            });
            //检查报告结果是否为空
            function  isCheckEmpty(list){
                list = list||[];
                var allFlag = false;
                $.each(list,function(i,v){
                    if(v.check&&v.check.reportResult){
                        allFlag = true;
                    }
                })
                $scope.checkNoEmpty = allFlag;
            }
            //删除记录
            $scope.deleteRecord = function(){
                YB.confirm({
                    hint : '确认要删除该记录么？',
                    ok : function(){
                        var postData = {
                            id : search.recordId
                        };
                        Ajax({
                            url : 'ehr/record/delete',
                            method : 'post',
                            data : postData,
                            suc : function(response){
                                if(history&&history.length>1){
                                    history.back();
                                }else{
                                    $location.url('/healthFile?patientId='+search.patientId);
                                    $location.replace();
                                }
                                YB.info({
                                    content : '操作成功'
                                })
                            },
                            err : function(){
                                YB.info({
                                    content : '操作失败'
                                })
                            }
                        })
                    }
                })
            };
            //获取记录信息
            function getPathogenesisInfo(){
                var postData = {
                    recordId : search.recordId||YB.param.recordId
                }
                Ajax({
                    url : 'ehr/pathogenesisRecord/getVisitRecord',
                    method : 'get',
                    data : postData,
                    suc : function(response){
                        $scope.recordDataOver = true;
                        //$scope.$apply(function(){
                        //YB.log(response);
                        initPageInfo(response);
                        //})
                        //YB.info({
                        //    content : '操作成功'
                        //})
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //默认信息添加
            $scope.focusDefaultValue = YB.addDefaultInfo;
            var containerArea = $('#containerArea');
            var navContainer = $('#navContainer');
            var currentScrollTop = 0;
            //监听容器滚动条
            containerArea.on('scroll',function(e){
                if(navContainer.offset().top<70){
                    navContainer.addClass( 'slide-fixed');
                    currentScrollTop = containerArea.scrollTop();
                }
                if(currentScrollTop&&containerArea.scrollTop()<currentScrollTop){
                    currentScrollTop = 0;
                    navContainer.removeClass( 'slide-fixed');
                }
                var contentArr = containerArea.find('[data-anchor]');
                contentArr.each(function(i,v){
                    var me = $(v);
                    var outerHeight = me.outerHeight();
                    if(me.offset().top<=0&&(me.offset().top+outerHeight)>=0){
                        if(clickFlag){
                            clickFlag = false;
                            return;
                        }
                        var index = $(v).attr('data-anchor');
                        navContainer.find('li').eq(index-1).addClass('current').siblings('.current').removeClass('current');
                    }
                })
                //alert(55);
                //console.log(navContainer.offset());
            })
            var clickFlag = false;
            //点击导航栏
            navContainer.on('click','li',function(){
                var me = $(this);
                me.addClass('current').siblings('.current').removeClass('current');
                var siblings = me.parent().children();
                var index = siblings.index(me);
                var obj = $('[data-anchor="'+ (index+1) + '"]');
                var totalTop = 0;
                var parentsArr = obj.parentsUntil('#containerArea').andSelf();
                parentsArr.each(function(i,v){
                    totalTop += this.offsetTop;
                });
                clickFlag = true;
                containerArea.scrollTop(totalTop);
                if(index==0){
                    currentScrollTop = totalTop;
                    navContainer.addClass('slide-fixed');
                }
                //YB.log(totalTop);
            })
            //预览图片
            containerArea
                .on('click','.img-list-area .img-list li',function(e){
                    var me = $(this);
                    var ul = me.parent();
                    var addImgFlag = ul.attr('data-flag');//是否为编辑区域
                    //if(addImgFlag)return;
                    if(me.hasClass('addImg'))return;
                    var siblings = ul.children();
                    //编辑模块 图片预览
                    if(addImgFlag&&siblings.length>1){
                        siblings = siblings.slice(1);
                    }
                    var index = siblings.index(me);
                    var arr = [];
                    siblings.each(function(i,v){
                        var img = $(v).find('img');
                        var src = img.attr('data-bigsrc');
                        var positionFlag = true;
                        if(img.height()<screen.height*0.8&&img.width()<screen.width*0.8){
                            positionFlag = false;
                        }
                        if(src){
                            arr.push({
                                src : src,
                                positionFlag : positionFlag
                            })
                        }
                    })
                    if(arr.length){
                        YB.previewImage({
                            current : index,
                            arr : arr
                        })
                    }
                })
                .on('click','.img-list-area .left-btn',function(e){
                    var me = $(this);
                    var operate = me.closest('.img-operate-area');
                    var imgListArea = operate.siblings('.all-img-list');
                    var length = imgListArea.find('li').length;
                    var ulObj = imgListArea.find('.img-list');
                    var liArr = ulObj.find('li');
                    var index = imgListArea.attr('data-index');
                    var maxShowLength = 5;
                    var imgAreaWidth = liArr.outerWidth()+10;
                    var current = parseInt(imgListArea.attr('data-current'),10);
                    if(length>maxShowLength&&current>0){
                        current-=1;
                        imgListArea.attr('data-current',current);
                        ulObj.stop(false,true).animate({
                            'margin-left': 0-current*imgAreaWidth
                        })
                    }
                    if(length<=maxShowLength){
                        ulObj.stop(false,true).animate({
                            'margin-left': 0
                        })
                        imgListArea.attr('data-current',0);
                    }
                })
                .on('click','.img-list-area .right-btn',function(e){
                    var me = $(this);
                    var operate = me.closest('.img-operate-area');
                    var imgListArea = operate.siblings('.all-img-list');
                    var length = imgListArea.find('li').length;
                    var ulObj = imgListArea.find('.img-list');
                    var liArr = ulObj.find('li');
                    var index = imgListArea.attr('data-index');
                    var maxShowLength = 5;
                    var imgAreaWidth = liArr.outerWidth()+10;
                    var current = parseInt(imgListArea.attr('data-current'),10);
                    var maxMoveLength = length - maxShowLength;
                    if(length>maxShowLength&&current<maxMoveLength){
                        current+=1;
                        imgListArea.attr('data-current',current);
                        ulObj.stop(false,true).animate({
                            'margin-left': 0-current*imgAreaWidth
                        })
                    }

                })
            //删除图片
            $scope.removeImg = function(imgList,index,e){
                var maxImgLength = 5;
                var current = 0;
                imgList = imgList.splice(index,1);
                var allImgArea = $(e.target).closest('.all-img-list');
                if(imgList.length>maxImgLength){
                    current = allImgArea.attr('data-current');
                    if(current>imgList.length-maxImgLength){
                        current = imgList.length-maxImgLength;
                    }
                }
                allImgArea.attr('data-current',current);
            }
            //检查类型列表
            $scope.checkList = [
                {
                    id : 1,
                    text : '影像学'
                },
                {
                    id : 2,
                    text : '实验学'
                },
                {
                    id : 3,
                    text : '化验学'
                }
            ]
            //就诊类型列表
            $scope.subTypeList = YB.param.subTypeList;
            //添加检查
            $scope.AddCheck = function(){
                $scope.addCheckFlag = true;
                $scope.addCheck = {
                    check : {
                        date : new Date($scope.basicInfo.visitTime).format('yyyy-MM-dd')
                    },
                    imageInfoList : []
                }
            }
            //保存添加检查
            $scope.saveAddCheckInfo = function(){
                var postData = {
                    recordId : search.recordId,
                    recordItemId : 4,
                    imageKeyList : [],
                }
                $.extend(postData,angular.copy($scope.addCheck));
                if($scope.addCheck.date){
                    postData.date = YB.getUnixTime($scope.addCheck.date);
                }
                if(postData.imageInfoList.length){
                    $.each(postData.imageInfoList,function(i,v){
                        postData.imageKeyList.push(v.imageKey);
                    })
                }
                postData.check.recordId = search.recordId;
                delete postData.imageInfoList;
                if(!postData.check.date){
                    YB.info({
                        content : '请选择检查日期'
                    })
                    return;
                }
                if(!postData.check.type){
                    YB.info({
                        content : '请选择检查类型'
                    })
                    return;
                }
                if(!postData.check.name){
                    YB.info({
                        content : '请输入检查名称'
                    })
                    return;
                }
                //if(!postData.check.reportResult){
                //    YB.info({
                //        content : '请输入主要症状'
                //    })
                //    return;
                //}
                Ajax({
                    url : 'ehr/pathogenesisRecord/check/update',
                    method : 'post',
                    type : 'raw',
                    data : postData,
                    suc : function(response){
                        if(response){
                            $.extend($scope.addCheck ,response);
                        }
                        $scope.checkDTOs.unshift($scope.addCheck);
                        isCheckEmpty($scope.checkDTOs);

                        $scope.addCheckFlag = false;
                        //})
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //取消添加检查
            $scope.cancelAddCheckInfo = function(){
                $scope.addCheckFlag = false;
                $scope.addCheck = {
                    imageInfoList : []
                }
            }
            //编辑检查
            $scope.editCheckInfo = function(checkData){
                checkData.listShowFlag = true;
            }
            //修改检查
            $scope.updateCheckInfo = function(checkData,index){
                checkData.editFlag = true;
                checkData.listShowFlag = false;
                checkData.updateData = angular.copy(checkData);
                checkData.updateData.check.date = new Date(checkData.updateData.check.date).format('yyyy-MM-dd');
            }
            //删除检查
            $scope.deleteCheckInfo = function(checkData,index){
                YB.confirm({
                    hint : '确定要删除该检查记录么？',
                    ok : function(){
                        Ajax({
                            url : 'ehr/pathogenesisRecord/check/delete/'+checkData.check.id,
                            method : 'post',
                            suc : function(response){
                                checkData.editFlag = false;
                                checkData.listShowFlag = false;
                                $scope.checkDTOs&&$scope.checkDTOs.splice(index,1);
                                isCheckEmpty($scope.checkDTOs);
                            },
                            err : function(){
                                YB.info({
                                    content : '操作失败'
                                })
                            }
                        })
                    }
                })

            }
            //保存修改检查
            $scope.saveUpdateCheckInfo = function(checkData){
                var postData = {
                    recordId : search.recordId,
                    recordItemId : 4,
                    imageKeyList : [],
                }
                $.extend(postData,angular.copy(checkData.updateData));
                if(postData.check.date){
                    postData.date = YB.getUnixTime(postData.check.date);
                }
                if(postData.imageInfoList.length){
                    $.each(postData.imageInfoList,function(i,v){
                        postData.imageKeyList.push(v.imageKey);
                    })
                }
                postData.check.recordId = search.recordId;
                delete postData.imageInfoList;
                if(!postData.check.date){
                    YB.info({
                        content : '请选择检查日期'
                    })
                    return;
                }
                if(!postData.check.type){
                    YB.info({
                        content : '请选择检查类型'
                    })
                    return;
                }
                if(!postData.check.name){
                    YB.info({
                        content : '请输入检查名称'
                    })
                    return;
                }
                //if(!postData.check.reportResult){
                //    YB.info({
                //        content : '请输入主要症状'
                //    })
                //    return;
                //}
                Ajax({
                    url : 'ehr/pathogenesisRecord/check/update',
                    method : 'post',
                    type : 'raw',
                    data : postData,
                    suc : function(response){
                        $.extend(checkData,angular.copy(checkData.updateData));
                        isCheckEmpty($scope.checkDTOs);
                        checkData.editFlag = false;
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                });
            }
            //取消修改检查
            $scope.cancelUpdateCheckInfo = function(checkData){
                checkData.listShowFlag = false;
                checkData.editFlag = false;
            }
            $scope.noCheckList = function(){
                Ajax({
                    url : 'ehr/pathogenesisRecord/check/no/'+search.recordId,
                    data : {
                      recordId : search.recordId
                    },
                    method : 'get',
                    suc : function(response){
                        $scope.checkNoFlag = true;
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //处理费用小数点问题
            $scope.filterNum = function(e,obj,key){
                if(obj&&obj[key]){
                    obj[key] = obj[key].replace(/[^0-9.]/g,'');
                    if(obj[key].indexOf('.')>-1&&(obj[key].length-obj[key].indexOf('.')-1>2)){
                        obj[key] = obj[key].slice(0,obj[key].length-1);
                    }
                    if(obj[key].indexOf('.')==-1&&obj[key].length>8){
                        obj[key] = obj[key].slice(0,8);
                    }
                }
            }
            //基本信息修改；
            //var baseInfoUpdateData = {};
            //修改基本信息
            $scope.updateBaseInfo = function(){
                $scope.baseInfoUpdateData = {
                    subType : $scope.subType,
                    basicInfo : $scope.basicInfo,
                    pathogenesis : $scope.pathogenesis,
                    pathogenesisId : $scope.pathogenesisId,
                    pathogenesisList : []
                };
                //获取病程列表
                getPathogenesisList();
            };

            function getPathogenesisList(){
                var postData = {
                    patientId : $scope.patientId,
                    start : 0,
                    count : 10000
                };
                Ajax({
                    url : 'ehr/pathogenesis/list',
                    method : 'get',
                    data : postData,
                    suc : function(response){
                        response = response||[];
                        $.each(response,function(i,v){
                            v.beginDate = v.beginDateTimeStamp;
                        })
                        $scope.baseInfoUpdateData.pathogenesisList = response;
                        $scope.baseInfoEditFlag = true;
                        countDefaultPathogenesis($scope.baseInfoUpdateData.pathogenesisId);
                        //})
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            $scope.$watch('baseInfoUpdateData.pathogenesisId',function(e){
                countDefaultPathogenesis(e);
            })
            $scope.$watch('baseInfoUpdateData.subType',function(e){
                $.each(YB.param.subTypeList,function(i,v){
                    if(v.id==e){
                        $scope.baseInfoUpdateData.subTypeName = v.text;
                    }
                })
            })
            //保存基本信息修改
            $scope.saveUpdateBaseInfo = function(){
                //var subTypeMap = {
                //    1 : '门诊',
                //    2 : '检查',
                //    5 : '住院'
                //}
                function updateInfo(){
                    var postData = {
                        id : $scope.basicInfo.recordId
                    };
                    var updateData = {
                        pathogenesisId : $scope.baseInfoUpdateData.pathogenesis.id,
                        subType : $scope.baseInfoUpdateData.subType
                    };
                    $.extend(postData,updateData);
                    Ajax({
                        url : 'ehr/pathogenesisRecord/updateRecordBasicInfo',
                        method : 'post',
                        data : postData,
                        suc : function(response){
                            $scope.pathogenesis = $scope.baseInfoUpdateData.pathogenesis;
                            $scope.pathogenesisId = postData.pathogenesisId;
                            $scope.subType = $scope.baseInfoUpdateData.subType;
                            $scope.subTypeName = YB.param.subTypeMap[$scope.subType];
                            $scope.baseInfoEditFlag = false;
                            YB.info({
                                content : '操作成功'
                            })
                        },
                        err : function(){
                            YB.info({
                                content : '操作失败'
                            })
                        }
                    })
                }
                updateInfo();
            };
            //取消基本信息修改；
            $scope.cancelUpdateBaseInfo = function(){
                $scope.baseInfoUpdateData = {
                    subType : $scope.subType,
                    basicInfo : $scope.basicInfo,
                    pathogenesis : $scope.pathogenesis,
                    pathogenesisId : $scope.pathogenesisId,
                    pathogenesisList : []
                };
                $scope.baseInfoEditFlag = false;
            }
            //添加图片
            $scope.addImg = function(e,updateData){
                var me = $(e.target);
                var key = me.closest('.edit-area').attr('data-key');
                require(['module/uploadImg'],function(param){
                    var dialog = param.init({
                        imageList :  angular.copy(updateData.imageInfoList),
                        token : $cookieStore.get(YB.param.sysParam.token),
                        ok : function(res){
                            $scope.$apply(function(){
                                updateData.imageInfoList = res;
                            })
                            dialog.close();
                        },
                        cancel : function(res){
                            //alert('fail');
                            dialog.close();
                        }
                    })
                })

            }
            $scope.removeImg = function(imgList,$index){
                imgList.splice($index,1);
            }
            //计算默认病程
            function countDefaultPathogenesis(id,noAngular){
                if($scope.baseInfoUpdateData){
                    $.each($scope.baseInfoUpdateData.pathogenesisList,function(i,v){
                        if(v.id == id){
                            if(noAngular){
                                $scope.$apply(function(){
                                    $scope.baseInfoUpdateData.pathogenesis = v;
                                });
                            }else{
                                $scope.baseInfoUpdateData.pathogenesis = v;
                            }
                            return false;
                        }
                    })
                }
            }
            //添加病程
            $scope.addPathogenesis = function(){
                require(['module/courseAdd'],function(process){
                    var dialog = process.addProcess({
                        patientId : $scope.patientId,
                        ok : function(formData){
                            Ajax({
                                method: 'post',
                                url: 'ehr/pathogenesis/add',
                                data: formData,
                                suc: function(res){
                                    getPathogenesisList();
                                    $scope.baseInfoUpdateData.pathogenesisId = res;
                                    dialog.close();
                                }
                            });
                        },
                        cancel : function(res){
                            //alert('fail');
                            dialog.close();
                        }
                    })
                })
            }
            //修改患者主诉信息
            $scope.updatePatientPresentInfo = function(){
                $scope.updatePatientPresentData = angular.copy($scope.patientPresentDTO);
                //YB.log(angular.toJson({"a" :5},true));
                $scope.patientPresentEditFlag = true;
            }
            //保存患者主诉信息
            $scope.saveUpdatePatientPresentInfo = function(){
                var postData = {
                    recordItemId : 2,
                    recordId : search.recordId
                };
                postData.patientPresent = angular.copy($scope.updatePatientPresentData.patientPresent);
                $.extend(postData.patientPresent,$scope.updatePatientPresentData.patientPresent);
                postData.imageKeyList = [];
                if($scope.updatePatientPresentData.imageInfoList.length){
                    $.each($scope.updatePatientPresentData.imageInfoList,function(i,v){
                        postData.imageKeyList.push( v.imageKey)
                    })
                }
                //if(!postData.patientPresent.mainSymptom){
                //    YB.info({
                //        content : '主诉症状不能为空'
                //    })
                //    return false;
                //}
                //if(!postData.patientPresent.historyTreatment){
                //    YB.info({
                //        content : '历史就诊不能为空'
                //    })
                //    return false;
                //}
                //if(!postData.patientPresent.requirement){
                //    YB.info({
                //        content : '患者需求不能为空'
                //    })
                //    return false;
                //}
                Ajax({
                    url : 'ehr/pathogenesisRecord/updatePatientPresent',
                    method : 'post',
                    type : 'raw',
                    data : postData,
                    suc : function(response){
                        $.extend($scope.patientPresentDTO,angular.copy($scope.updatePatientPresentData));
                        $scope.patientPresentEditFlag = false;
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //取消患者主诉信息
            $scope.cancelUpdatePatientPresentInfo = function(){
                $scope.updatePatientPresentData = angular.copy($scope.patientPresentDTO);
                $scope.patientPresentEditFlag = false;
            }
            //修改患者病历记录
            $scope.updateMedicalRecordInfo = function(){
                $scope.updateMedicalRecordData = angular.copy($scope.medicalRecordDTO);
                $scope.medicalRecordEditFlag = true;
            }
            //保存患者病历记录
            $scope.saveUpdateMedicalRecordInfo = function(){
                var postData = {
                    recordId : $scope.basicInfo.recordId,
                };
                $.extend(postData,$scope.updateMedicalRecordData);
                postData.imageKeyList = [];
                if($scope.updateMedicalRecordData.imageInfoList.length){
                    $.each($scope.updateMedicalRecordData.imageInfoList,function(i,v){
                        postData.imageKeyList.push( v.imageKey)
                    })
                }
                //if(!postData.detailSymptom){
                //    YB.info({
                //        content : '详情病情不能为空'
                //    })
                //    return false;
                //}
                //if(!postData.doctorAdvice){
                //    YB.info({
                //        content : '医生建议不能为空'
                //    })
                //    return false;
                //}
                postData.imageKeyList = postData.imageKeyList.join(',');
                delete  postData.imageInfoList;
                Ajax({
                    url : 'ehr/medicalRecord/modify',
                    method : 'post',
                    //type : 'raw',
                    data : postData,
                    suc : function(response){
                        $.extend($scope.medicalRecordDTO,angular.copy($scope.updateMedicalRecordData));
                        $scope.medicalRecordEditFlag = false;
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //取消患者病历记录
            $scope.cancelUpdateMedicalRecordInfo = function(){
                $scope.updateMedicalRecordData = angular.copy($scope.medicalRecordDTO);
                $scope.medicalRecordEditFlag = false;
            }
            //修改治疗方案
            $scope.updateTreatmentPrescriptionInfo = function(){
                $scope.updateTreatmentPrescriptionData = angular.copy($scope.treatmentPrescriptionDTO);
                $scope.treatmentPrescriptionEditFlag = true;
            }
            //保存治疗方案修改
            $scope.saveUpdateTreatmentPrescriptionInfo = function(){
                var postData = {
                    recordId : $scope.basicInfo.recordId,
                    recordItemId : 6
                };
                $.extend(postData,$scope.updateTreatmentPrescriptionData);
                postData.imageKeyList = [];
                if($scope.updateTreatmentPrescriptionData.imageInfoList.length){
                    $.each($scope.updateTreatmentPrescriptionData.imageInfoList,function(i,v){
                        postData.imageKeyList.push(v.imageKey)
                    })
                }
                delete  postData.imageInfoList;
                postData.imageKeyList = postData.imageKeyList.join(',');
                //if(!postData.treatmentPrescription){
                //    YB.info({
                //        content : '治疗处方不能为空'
                //    })
                //    return false;
                //}
                Ajax({
                    url : 'ehr/pathogenesisRecord/updateTreatmentPrescription',
                    method : 'post',
                    data : postData,
                    suc : function(response){
                        //$scope.$apply(function(){
                        $.extend($scope.treatmentPrescriptionDTO,angular.copy($scope.updateTreatmentPrescriptionData));
                        //})
                        $scope.treatmentPrescriptionEditFlag = false;
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //取消治疗方案修改
            $scope.cancelUpdateTreatmentPrescriptionInfo = function(){
                $scope.updateTreatmentPrescriptionData = angular.copy($scope.treatmentPrescriptionDTO);
                $scope.treatmentPrescriptionEditFlag = false;
            }
            //修改助理建议
            $scope.updateAssistantAdviceInfo = function(){
                $scope.updateAssistantAdviceData = angular.copy($scope.assistantAdvice);
                $scope.assistantAdviceEditFlag = true;
            }
            //打开订单详情
            $scope.goOrderDetail = function(orderSn){
                $window.open('#/orderDetail?id='+ orderSn);
            }
            //保存助理建议
            $scope.saveUpdateAssistantAdviceInfo = function(){
                var postData = {};
                $.extend(postData,$scope.updateAssistantAdviceData);
                //if(!postData.medicalUsage){
                //    YB.info({
                //        content : '药物用法不能为空'
                //    })
                //    return;
                //}
                //if(!postData.checkReminder){
                //    YB.info({
                //        content : '检查提醒不能为空'
                //    })
                //    return;
                //}
                //if(!postData.livingStyle){
                //    YB.info({
                //        content : '生活方式不能为空'
                //    })
                //    return;
                //}
                //if(!postData.indexMonitoring){
                //    YB.info({
                //        content : '指标监控不能为空'
                //    })
                //    return;
                //}
                Ajax({
                    url : 'ehr/pathogenesisRecord/updateAssistantAdvice',
                    method : 'post',
                    data : postData,
                    suc : function(response){
                        $.extend($scope.assistantAdvice,angular.copy($scope.updateAssistantAdviceData));
                        $scope.assistantAdviceEditFlag = false;
                        YB.info({
                            content : '操作成功'
                        })
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //取消修改助理建议
            $scope.cancelUpdateAssistantAdviceInfo = function(){
                $scope.updateAssistantAdviceData = angular.copy($scope.assistantAdvice);
                $scope.assistantAdviceEditFlag = false;
            }
            $scope.feeTypeList = [
                {
                    id : '挂号',
                    name : '挂号'
                },
                {
                    id : '检查检验',
                    name : '检查检验'
                },
                {
                    id : '药物',
                    name : '药物'
                },
                {
                    id : '手术',
                    name : '手术'
                },
                {
                    id : '非药物治疗',
                    name : '非药物治疗'
                },
                {
                    id : '其他',
                    name : '其他'
                }
            ]
            //修改费用清单
            $scope.updateRecordFeeListInfo = function(){
                $scope.updateRecordFeeListData = angular.copy($scope.recordFeeListDTO);
                $scope.updateRecordFeeListData.delList = [];
                $.each($scope.updateRecordFeeListData.feeList,function(i,v){
                    if($.isNumeric(v.datetime)){
                        v.datetime = new Date(v.datetime).format('yyyy-MM-dd');
                    }
                })
                $scope.recordFeeListEditFlag = true;
            }
            //添加单条费用清单
            $scope.addFeeRow = function(){
                $scope.updateRecordFeeListData.feeList.push({
                    datetime : new Date($scope.basicInfo.visitTime).format('yyyy-MM-dd')
                });
                //YB.log($scope.updateRecordFeeListData.feeList);
            }
            //删除单挑费用清单
            $scope.removeFeeRow = function(index){
                if($scope.updateRecordFeeListData.feeList[index].id){
                    $scope.updateRecordFeeListData.delList.push($scope.updateRecordFeeListData.feeList[index].id);
                }
                $scope.updateRecordFeeListData.feeList.splice(index,1);
                //YB.log($scope.updateRecordFeeListData.feeList);
            }
            //检查检验费用默认
            $scope.selectCheckNameFn = function(row,check){
                row.item = check.check.name;
                row.ulFlag = false;
            }
            //保存修改费用清单
            $scope.saveUpdateRecordFeeListInfo = function(){
                var postData = {
                    recordId : $scope.basicInfo.recordId,
                    recordFeeList : [],
                    recordItemId : 7,
                    imageKeyList : []
                };
                var recordFlag = true;
                $.each(angular.copy($scope.updateRecordFeeListData.feeList)||[],function(i,v){
                    //if(v.datetime){
                    //    v.dateTimeStamp = new Date(v.datetime).getTime();
                    //}
                    if(!v.datetime||!v.itemType||!v.item||!v.fee){
                        recordFlag = false;
                        YB.info({
                            content : '必填字段不能为空'
                        })
                        return false;
                    }
                    if($.isNumeric(v.datetime)){
                        v.datetime = new Date(v.datetime).format('yyyy-MM-dd');
                    }
                    //delete v.datetime ;
                    postData.recordFeeList.push(v);
                })
                if(!recordFlag){
                    YB.info({
                        content : '费用必填字段不能为空'
                    })
                    return;
                }
                if(!postData.recordFeeList.length){
                    YB.info({
                        content : '费用列表不能为空'
                    })
                    return;
                }
                //postData.recordFeeList = $.toJSON(postData.recordFeeList);
                if($scope.updateRecordFeeListData.imageInfoList.length){
                    $.each($scope.updateRecordFeeListData.imageInfoList,function(i,v){
                        postData.imageKeyList.push(v.imageKey)
                    })
                }
                //postData.imageKeyList = $.toJSON(postData.imageKeyList);
                Ajax({
                    type : 'raw',
                    url : 'ehr/pathogenesisRecord/updateRecordFee',
                    method : 'post',
                    data : postData,
                    suc : function(response){
                        YB.log(response);
                        if(response){
                            if(response.feeList){
                                response.feeList = $.map(response.feeList,function(v){
                                    if($scope.updateRecordFeeListData.delList&&$scope.updateRecordFeeListData.delList.length){
                                        return $scope.updateRecordFeeListData.delList.indexOf(v.id)>-1?null:v;
                                    }else{
                                        return v;
                                    }
                                })
                            }
                        }
                        YB.log(response);
                        $.extend($scope.updateRecordFeeListData,response);
                        $scope.delUpdateRecordFeeListInfo(function(){
                            saveSuc();
                        })
                        function saveSuc(){
                            $.extend($scope.recordFeeListDTO,angular.copy($scope.updateRecordFeeListData));
                            $scope.recordFeeListEditFlag = false;
                            YB.info({
                                content : '操作成功'
                            })
                        }
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //删除修改费用清单
            $scope.delUpdateRecordFeeListInfo = function(fn){
                if($scope.updateRecordFeeListData.delList&&$scope.updateRecordFeeListData.delList.length){
                    var postData = {
                        idList : $.toJSON($scope.updateRecordFeeListData.delList),
                        recordId : search.recordId
                    }
                    postData = $scope.updateRecordFeeListData.delList;
                    Ajax({
                        type : 'raw',
                        url : 'ehr/pathogenesisRecord/deleteRecordFee',
                        method : 'post',
                        data : postData,
                        suc : function(response){
                            fn();
                        },
                        err : function(){
                            YB.info({
                                content : '操作失败'
                            })
                        }
                    })
                }else{
                    fn();
                }
            }
            //取消修改费用清单
            $scope.cancelUpdateRecordFeeListInfo = function(){
                $scope.updateRecordFeeListData = angular.copy($scope.recordFeeListDTO);
                $scope.recordFeeListEditFlag = false;
            }
            //修改诊断记录
            $scope.updateConclusionsInfo = function(){
                $scope.deleteConclusionList = [];
                $scope.conclusionsEditFlag = true;
                $scope.updateConclusionsData = angular.copy($scope.conclusionsDTO);
                $scope.updateConclusionsData.conclusionList = $scope.updateConclusionsData.conclusionList||[];
            }
            //保存修改诊断记录
            $scope.saveUpdateConclusionsInfo = function(){
                var postData = {
                    recordItemId : 5,
                    recordId : search.recordId,
                    imageKeyList :[]
                }
                $.extend(postData ,angular.copy($scope.updateConclusionsData));
                var submitFlag = true;
                $.each(postData.conclusionList,function(i,v){
                    v.recordId = search.recordId;
                    if(!v.name){
                        YB.info({
                            content : '疾病名称不能为空！'
                        });
                        submitFlag = false;
                        return false;
                    }
                })
                if(!postData.conclusionList.length){
                    YB.info({
                        content : '诊断结论不能为空！'
                    });
                    return ;
                }
                if(!submitFlag){
                    return;
                }
                if(postData.imageInfoList.length){
                    $.each(postData.imageInfoList,function(i,v){
                        postData.imageKeyList.push(v.imageKey);
                    })
                }
                delete postData.imageInfoList;
                Ajax({
                    type : 'raw',
                    url : 'ehr/pathogenesisRecord/diagnosticConclusion/update',
                    method : 'post',
                    data : postData,
                    suc : function(response){
                        if(response&&response.conclusionsDTO){
                            if(response.conclusionsDTO.conclusionList){
                                response.conclusionsDTO.conclusionList = $.map(response.conclusionsDTO.conclusionList,function(v){
                                    if($scope.deleteConclusionList&&$scope.deleteConclusionList.length){
                                        return $scope.deleteConclusionList.indexOf(v.id)>-1?null:v;
                                    }else{
                                        return v;
                                    }
                                })
                                YB.log(response.conclusionsDTO.conclusionList);
                            }
                        }
                        $.extend($scope.updateConclusionsData,response.conclusionsDTO);
                        $scope.deleteUpdateConclusionsInfo();
                    },
                    err : function(){
                        YB.info({
                            content : '操作失败'
                        })
                    }
                })
            }
            //取消修改诊断记录
            $scope.cancelUpdateConclusionsInfo = function(){
                $scope.conclusionsEditFlag = false;
                $scope.updateConclusionsData = angular.copy($scope.conclusionsDTO);
            }
            //删除多条诊断记录
            $scope.deleteUpdateConclusionsInfo = function(){
                if($scope.deleteConclusionList&&$scope.deleteConclusionList.length){
                    var postData = {
                        conclusionIdList : $scope.deleteConclusionList||[],
                        recordId : search.recordId
                    }
                    Ajax({
                        //type : 'raw',
                        url : 'ehr/pathogenesisRecord/diagnosticConclusion/delete',
                        method : 'post',
                        data : postData,
                        suc : function(response){
                            updateSuc()
                        },
                        err : function(){
                            YB.info({
                                content : '操作失败'
                            })
                        }
                    })
                }else{
                    updateSuc()
                }
                function updateSuc(){
                    $.extend($scope.conclusionsDTO,angular.copy($scope.updateConclusionsData));
                    $scope.conclusionsEditFlag = false;
                }
            }
            //删除单条诊断记录
            $scope.removeUpdateConclusionsData = function(index,row){
                if(row.id){
                    $scope.deleteConclusionList.push(row.id);
                }
                $scope.updateConclusionsData.conclusionList.splice(index,1);

            }
            //添加单条诊断记录
            $scope.addUpdateConclusionsData = function(){
                $scope.updateConclusionsData.conclusionList.push({
                    isDiagnosed : 1
                });
            }
            //添加随访任务
            $scope.addAssistantTaskInfo = function(){
                require(['module/visitTask'],function(param){
                    var postData = {
                        patientId : $scope.patientId,
                        start : 0,
                        count : 10000
                    };
                    var brokerList = [];
                    Ajax({
                        method: 'post',
                        url: 'assistant/all/list',
                        suc: function (res) {
                            var taskName = (YB.param.patientData&&YB.param.patientData.name)?('患者'+YB.param.patientData&&YB.param.patientData.name):'';
                            taskName = taskName ?(taskName+' 随访任务'):'';
                            brokerList = res;
                            var dialog = param.init({
                                data : {
                                    brokerListLength : brokerList.length,
                                    assistantUserId : YB.param.assistantInfo.userId,
                                    task : {
                                        assistUserId : $scope.ssistantTask&&$scope.ssistantTask.assistUserId||0,
                                        detail : {
                                            pathogenesisId : $scope.pathogenesisId
                                        },
                                        comment : '',
                                        name : taskName,
                                        time : ''
                                    },
                                    recordId : search.recordId,
                                    brokerList : brokerList
                                },
                                token : $cookieStore.get(YB.param.sysParam.token),
                                ok : function(res){
                                    var taskData = {
                                        type : 4,
                                        patientId : $scope.patientId,
                                        status: 1,
                                        //pathogenesisRecordId : search.recordId
                                    }
                                    $.extend(taskData,res);
                                    Ajax({
                                        url: 'assistant/task/add/4',
                                        method: 'post',
                                        data: {
                                            assistantTaskJson : $.toJSON(taskData),
                                            assistantTaskDetailJson : $.toJSON({
                                                type : 4,
                                                patientId : $scope.patientId,
                                                //pathogenesisRecordId : search.recordId,
                                                pathogenesisId : $scope.pathogenesisId
                                            })
                                        },
                                        suc: function (response) {
                                            $scope.ssistantTask  = response.task;
                                            Ajax({
                                                url: 'ehr/pathogenesisRecord/relateTask',
                                                method: 'post',
                                                data: {
                                                    taskId : response.task.id,
                                                    pathogenesisRecordId : search.recordId
                                                },
                                                suc: function (response) {
                                                    dialog.close();
                                                },
                                                err: function () {

                                                }
                                            })
                                            //dialog.close();
                                        },
                                        err: function () {

                                        }
                                    })
                                },
                                cancel : function(res){
                                    //alert('fail');
                                    dialog.close();
                                }
                            })
                        }
                    });
                })
            }
            //修改随访任务
            $scope.updateAssistantTaskInfo = function(){

                require(['module/visitTask'],function(param){
                    var postData = {
                        patientId : $scope.patientId,
                        start : 0,
                        count : 10000
                    };
                    var brokerList = [];
                    Ajax({
                        method: 'post',
                        url: 'assistant/all/list',
                        suc: function (res) {
                            brokerList = res;
                            var assistantTask = $scope.ssistantTask&&$scope.ssistantTask||{};
                            var dialog = param.init({
                                data : {
                                    brokerListLength : brokerList.length,
                                    editFlag : true,
                                    assistantUserId : assistantTask.assistUserId,
                                    task : {
                                        assistUserId : assistantTask.assistUserId||0,
                                        comment :assistantTask.comment,
                                        name : assistantTask.name,
                                        time : new Date(assistantTask.date).format('yyyy-MM-dd hh:mm'),
                                        status : assistantTask.status,
                                        id : assistantTask.id
                                    },
                                    recordId : search.recordId,
                                    brokerList : brokerList,
                                    taskStatusList : [YB.param.taskStatusList[0],YB.param.taskStatusList[2]]
                                },
                                token : $cookieStore.get(YB.param.sysParam.token),
                                ok : function(res){
                                    var taskData = {
                                        type : 4,
                                        id : assistantTask.id,
                                        patientId : $scope.patientId,
                                        pathogenesisRecordId : search.recordId,
                                        pathogenesisId : $scope.pathogenesisId
                                    }
                                    var taskDataDetail = {
                                        type : 4,
                                        taskId : assistantTask.id,
                                        patientId : $scope.patientId,
                                        pathogenesisRecordId : search.recordId,
                                        pathogenesisId : $scope.pathogenesisId
                                    };
                                    $.extend(taskData,res);
                                    $.extend(taskDataDetail,res);
                                    Ajax({
                                        url: 'assistant/task/update/4',
                                        method: 'post',
                                        data: {
                                            assistantTaskJson : $.toJSON(taskData),
                                            assistantTaskDetailJson : $.toJSON(taskDataDetail)
                                        },
                                        suc: function (response) {
                                            $.extend($scope.ssistantTask,taskData);
                                            dialog.close();
                                        },
                                        err: function () {

                                        }
                                    })
                                },
                                cancel : function(res){
                                    //alert('fail');
                                    dialog.close();
                                }
                            })
                        }
                    });
                })
            }
            //取消随访记录
            $scope.cancelAssistantTaskInfo = function(){
                var assistantTask = $scope.ssistantTask&&$scope.ssistantTask||{};
                var taskData = {
                    type : 4,
                    id : assistantTask.id,
                    pathogenesisRecordId : search.recordId,
                    pathogenesisId : $scope.pathogenesisId,
                    status:3
                }
                var taskDataDetail = {
                    type : 4,
                    taskId : assistantTask.id,
                    pathogenesisRecordId : search.recordId,
                    pathogenesisId : $scope.pathogenesisId
                };

                YB.confirm({
                    hint : '确定要取消该任务么？',
                    ok : function(){
                        Ajax({
                            url: 'assistant/task/update/4',
                            method: 'post',
                            data: {
                                assistantTaskJson : $.toJSON(taskData),
                                assistantTaskDetailJson : null//$.toJSON({})
                            },
                            suc: function (response) {
                                $.extend($scope.ssistantTask,taskData);
                            },
                            err: function () {

                            }
                        })
                    }
                })
            }

            $scope.$watch('ssistantTask.status',function(e){
                if($scope.ssistantTask){
                    $scope.ssistantTask.statusStr = YB.param.statusMap[e];
                }
            })
            $scope.closeCheckEditList = function(check){
                check.listShowFlag = false;
            }
        }

    }]);
});