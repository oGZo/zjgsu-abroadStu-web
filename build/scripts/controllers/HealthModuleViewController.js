'use strict';
//健康档案 患者信息
define(['app'], function (app) {
    app.controller('HealthModuleViewController', ['$scope', '$http', 'Ajax', '$compile', '$location', '$controller', '$rootScope', '$timeout',
        function ($scope, $http, Ajax, $compile, $location, $controller, $rootScope, $timeout) {
            var scope = $rootScope.$new();
            $http.get('views/healthModule.html?version='+SYSTEM_VERSION).then(function (res) {
                var dialog = angular.element(res.data);
                var controller = $controller('HealthViewController', {
                    $scope: scope,
                    $element: dialog
                }, true, 1);
                $timeout(function () {
                    $compile(dialog)(scope);
                    $('.J_health').append(dialog);
                });
            });
        }]);
    app.controller('HealthViewController', ['$scope', 'Ajax', '$location', '$controller', '$rootScope',
        function ($scope, Ajax, $location, $controller) {
            var search = $location.search();
            healthModuleInit();
            YB.healthModuleInit = healthModuleInit;
            function healthModuleInit(){
                var _patientId = search.patientId;
                //获取省份列表
                function getProvinceList(callback) {
                    Ajax({
                        method: 'post',
                        url: 'assistant/profile/allprovince',
                        suc: function (res) {
                            $scope.provinceList = res;
                            callback && callback();
                        }
                    });
                }

                //获取城市列表
                function getCityList(provinceId, callback) {
                    Ajax({
                        method: 'post',
                        url: 'assistant/profile/allcity',
                        data: {
                            provinceId: provinceId
                        },
                        suc: function (res) {
                            $scope.cityList = res;
                            callback && callback();
                        }
                    });
                }

                //当居住地省份改变时请求城市列表
                $scope.selectProvince = function () {
                    getCityList($scope.tempPatient.domicileProvinceId, function () {
                        $scope.tempPatient.domicileCityId = $scope.cityList[0].cityId;
                    });
                };
                //获取保险列表
                function getInsuranceList() {
                    Ajax({
                        method: 'get',
                        url: 'ehr/insurance/list',
                        suc: function (res) {
                            $scope.insuranceList = res;
                        }
                    });
                }

                //获取患者信息
                getPatientInfo();
                function getPatientInfo() {
                    Ajax({
                        method: 'get',
                        url: 'ehr/patient/view',
                        data: {
                            id: _patientId   //患者id
                        },
                        suc: function (res) {
                            //处理数据
                            res.sexText = app.param.sexJson[res.sex];
                            res.id = _patientId;
                            var idcard = res.idcard;
                            if(idcard.length == 15){
                                res.birthday = '19' + idcard.slice(6,8) + '-' + idcard.slice(8,10) + '-' + idcard.slice(10,12);
                            } else {
                                res.birthday = idcard.slice(6, 10) + '-' + idcard.slice(10, 12) + '-' + idcard.slice(12,14);
                            }
                            //res.birthday = new Date(res.birthday).format('yyyy-MM-dd');
                            res.emergencyContact = res.emergencyContact || res.customerUserName;
                            res.emergencyContactPhone = res.emergencyContactPhone || res.customerUserPhone;
                            //获取居住地省份名称
                            if (res.domicileProvinceId) {
                                getProvinceList(function () {
                                    angular.forEach($scope.provinceList, function (v) {
                                        if (v.provinceId == res.domicileProvinceId)
                                            res.domicileProvince = v.name;
                                    });
                                });
                            }
                            //获取居住地城市名称
                            if (res.domicileCityId) {
                                getCityList(res.domicileProvinceId, function () {
                                    angular.forEach($scope.cityList, function (v) {
                                        if (v.cityId == res.domicileCityId)
                                            res.domicileCity = v.name;
                                    });
                                });
                            }
                            $scope.patient = res;
                            YB.param.patientData = res;
                        }
                    });
                }

                //初始化修改状态
                $scope.isModifyBaseInfo = false;
                $scope.isModifyState = false;
                //修改患者信息
                $scope.preModifyBaseInfo = function () {
                    getInsuranceList();
                    $scope.isModifyBaseInfo = true;
                    $scope.tempPatient = angular.copy($scope.patient);
                    if (!$scope.tempPatient.insuranceList.length)
                        $scope.tempPatient.insuranceList.push({
                            typeId: 1
                        });
                    //患者没有省份信息时需要初始化为全国全省
                    if (!$scope.tempPatient.domicileProvinceId) {
                        getProvinceList(function () {
                            $scope.tempPatient.domicileProvinceId = $scope.provinceList[0].provinceId;
                            $scope.selectProvince();
                        });
                    }
                };
                //添加保险
                $scope.addInsurance = function () {
                    $scope.tempPatient.insuranceList.push({
                        typeId: 1
                    });
                };
                //删除保险
                $scope.deleteInsurance = function (index) {
                    $scope.tempPatient.insuranceList.splice(index, 1);
                };
                //保存患者信息修改
                $scope.confirmModifyBaseInfo = function () {
                    if($scope.tempPatient.name===$scope.tempPatient.emergencyContact){
                        YB.info({
                            content: '紧急联系人不能为患者本人'
                        });
                        return;
                    }
                    if ($scope.tempPatient.phone && !app.reg.phone.test($scope.tempPatient.phone)) {
                        YB.info({
                            content: '手机号不合法'
                        });
                    } else if ($scope.tempPatient.emergencyContactPhone && !app.reg.phone.test($scope.tempPatient.emergencyContactPhone)) {
                        YB.info({
                            content: '紧急联系人手机不合法'
                        });
                    } else {
                        var tempInsuranceList = [];
                        angular.forEach($scope.tempPatient.insuranceList, function (insurance) {
                            switch (insurance.typeId) {
                                case 1: //无
                                    break;
                                case 2: //镇医保
                                    delete insurance.area;
                                    delete insurance.insuranceName;
                                    break;
                                case 3: //城镇医保
                                    delete insurance.insuranceName;
                                    break;
                                case 4: //商业保险
                                    delete insurance.area;
                                    break;
                            }
                            if (insurance.typeId != 1) {
                                tempInsuranceList.push(insurance);
                            }
                        });
                        if (!tempInsuranceList.length) {
                            tempInsuranceList.push({
                                typeId: 1,
                                insuranceNo: ''
                            });
                        }
                        $scope.tempPatient.insuranceList = tempInsuranceList;
                        for (var i in tempInsuranceList) {
                            var number = tempInsuranceList[i].insuranceNo,
                                typeId = tempInsuranceList[i].typeId;
                            //if (typeId != 1 && !(number && number.length)) {
                            //    YB.info({content: '请填写保险号'});
                            //    return;
                            //}
                        }
                        Ajax({
                            type: 'raw',
                            method: 'post',
                            url: 'ehr/patient/modify',
                            data: $scope.tempPatient,
                            suc: function (res) {
                                getPatientInfo();
                                $scope.isModifyBaseInfo = false;
                                YB.info({content: '修改成功'});
                            }
                        });
                    }
                };
                //取消修改患者信息
                $scope.cancelModifyBaseInfo = function () {
                    $scope.isModifyBaseInfo = false;
                };
                //获取健康状况
                getHealthCondition();
                function getHealthCondition() {
                    Ajax({
                        method: 'post',
                        url: 'ehr/healthCondition/view',
                        data: {
                            patientId: _patientId
                        },
                        suc: function (res) {
                            res = res || {};
                            res.anamnesis = res.anamnesis || [];
                            res.lifeStyle = res.lifeStyle || [];
                            res.patientId = _patientId;
                            if (res.weight && res.height) {
                                res.bmi = res.weight / Math.pow(res.height / 100.0, 2);
                                res.bmi = res.bmi.toFixed(2);
                                if(res.bmi < 18.5){
                                    res.bmiText = '过轻';
                                } else if(res.bmi < 24){
                                    res.bmiText = '正常';
                                } else if(res.bmi < 27){
                                    res.bmiText = '过重';
                                } else if(res.bmi < 30){
                                    res.bmiText = '轻度肥胖';
                                } else if(res.bmi < 35){
                                    res.bmiText = '中度肥胖';
                                } else {
                                    res.bmiText = '重度肥胖';
                                }
                            }
                            for (var i in res) {
                                if (res[i] == 'null') {
                                    delete res[i];
                                }
                            }
                            $scope.healthCondition = res;
                            $scope.isModifyState = false;
                        }
                    });
                }

                //患者信息常量列表接口
                function getConstType(callback) {
                    //if ($scope.ConstTypeList)
                    //    callback && callback();
                    Ajax({
                        method: 'post',
                        url: 'ehr/healthCondition/getConstType',
                        suc: function (res) {
                            $scope.ConstTypeList = res;
                            callback && callback();
                        }
                    });
                }

                //身高输入限制
                $scope.inputHeight = function (event) {
                    var node = event.target,
                        value = node.value;
                    if (value > 300) {
                        node.value = value.slice(0, 2);
                    }
                };
                //修改个人健康状况
                $scope.healthCondition = {};
                $scope.ConstTypeList = {};
                $scope.maritalStatusMap = {
                    '1': '未婚',
                    '2': '已婚',
                    '3': '保密'
                }
                $scope.preModifyState = function () {
                    getConstType(function () {
                        $scope.checkboxModel = {
                            checkAnamnesisType: false,
                            checkLifeStyle: false
                        };
                        $scope.isModifyState = true;
                        $scope.tempealthCondition = angular.copy($scope.healthCondition);
                        //处理既往病史选中项及其他既往病史
                        $scope.tempealthCondition.anamnesisTypeMap = {};
                        $scope.tempealthCondition.otherAnamnesis = angular.copy($scope.tempealthCondition.anamnesis || []);
                        $.each($scope.tempealthCondition.otherAnamnesis,function(i,v){
                            if(v===''){
                                $scope.tempealthCondition.anamnesisTypeMap[v] = true;
                                $scope.tempealthCondition.otherAnamnesis.splice(i, 1);
                                return false;
                            }
                        })
                        angular.forEach($scope.ConstTypeList.anamnesisTypeList, function (v) {
                            var index = $.inArray(v.name, $scope.tempealthCondition.otherAnamnesis);
                            if (index > -1) {
                                $scope.tempealthCondition.anamnesisTypeMap[v.name] = true;
                                $scope.tempealthCondition.otherAnamnesis.splice(index, 1);
                            }
                        });

                        $scope.tempealthCondition.otherAnamnesis = $scope.tempealthCondition.otherAnamnesis.join(';');
                        if ($scope.tempealthCondition.otherAnamnesis.length > 0||$scope.tempealthCondition.anamnesisTypeMap['']) {
                            $scope.checkboxModel.checkAnamnesisType = true;
                        }
                        //处理生活方式选中项及其他生活方式
                        $scope.tempealthCondition.lifeStyleMap = {};
                        $scope.tempealthCondition.otherLifeStyle = angular.copy($scope.tempealthCondition.lifeStyle || []);
                        $.each($scope.tempealthCondition.otherLifeStyle,function(i,v){
                            if(v===''){
                                $scope.tempealthCondition.lifeStyleMap[v] = true;
                                $scope.tempealthCondition.otherLifeStyle.splice(i, 1);
                                return false;
                            }
                        })
                        angular.forEach($scope.ConstTypeList.lifeStyleList, function (v) {
                            var index = $.inArray(v.name, $scope.tempealthCondition.otherLifeStyle);
                            if (index > -1) {
                                $scope.tempealthCondition.lifeStyleMap[v.name] = true;
                                $scope.tempealthCondition.otherLifeStyle.splice(index, 1);
                            }
                        });
                        $scope.tempealthCondition.otherLifeStyle = $scope.tempealthCondition.otherLifeStyle.join(';');
                        if ($scope.tempealthCondition.otherLifeStyle.length > 0||$scope.tempealthCondition.lifeStyleMap['']) {
                            $scope.checkboxModel.checkLifeStyle = true;
                        }
                        $scope.tempealthCondition.familyHistoryMap = {};
                        $scope.tempealthCondition.familyHistoryOther = {};
                        if($scope.tempealthCondition.familyHistory&&$scope.tempealthCondition.familyHistory.length){
                            $.each($scope.tempealthCondition.familyHistory,function(i,v){
                                if(v.indexOf(':')==2){
                                    var valArr =  v.split(':');
                                    var key = valArr[0];
                                    var val = valArr[1];
                                    $scope.tempealthCondition.familyHistoryMap[key] = true;
                                    if(key==='肿瘤'){
                                        $scope.tempealthCondition.familyHistoryOther[3] = val;
                                    }
                                    if(key==='其他'){
                                        $scope.tempealthCondition.familyHistoryOther['-1'] = val;
                                    }
                                }else{
                                    $scope.tempealthCondition.familyHistoryMap[v] = true;
                                }
                            })
                        }
                    });
                };
                //确定修改个人健康状况
                $scope.confirmModifyState = function () {
                    //处理生活方式
                    $scope.tempealthCondition.lifeStyle = $scope.checkboxModel.checkLifeStyle ? $scope.tempealthCondition.otherLifeStyle?$scope.tempealthCondition.otherLifeStyle.split(';'):[] : [];
                    if($scope.checkboxModel.checkLifeStyle){
                        if($scope.tempealthCondition.otherLifeStyle){
                            $scope.tempealthCondition.lifeStyleMap[''] = false;
                        }else{
                            $scope.tempealthCondition.lifeStyle[0] = '';
                        }
                    }
                    angular.forEach($scope.tempealthCondition.lifeStyleMap, function (v, i) {
                        if(v){
                            if($scope.tempealthCondition.lifeStyle[0]===''&&i==='')return;
                            if (v) $scope.tempealthCondition.lifeStyle.push(i);
                        }
                    });
                    //处理既往病史
                    $scope.tempealthCondition.anamnesis = $scope.checkboxModel.checkAnamnesisType ? $scope.tempealthCondition.otherAnamnesis?$scope.tempealthCondition.otherAnamnesis.split(';'):[] : [];
                    if($scope.checkboxModel.checkAnamnesisType){
                        if($scope.tempealthCondition.otherAnamnesis){
                            $scope.tempealthCondition.anamnesisTypeMap[''] = false;
                        }else{
                            $scope.tempealthCondition.anamnesis[0] = '';
                        }
                    }
                    angular.forEach($scope.tempealthCondition.anamnesisTypeMap, function (v, i) {
                        if($scope.tempealthCondition.anamnesis[0]===''&&i==='')return;
                        if (v) $scope.tempealthCondition.anamnesis.push(i);
                    });
                    //处理既往病史
                    $scope.tempealthCondition.familyHistory = [];
                    angular.forEach($scope.tempealthCondition.familyHistoryMap, function (v, i) {
                        if(i==='肿瘤'&&$scope.tempealthCondition.familyHistoryOther[3]){
                            i += ':';
                            i += $scope.tempealthCondition.familyHistoryOther[3];
                        }
                        if(i==='其他'&&$scope.tempealthCondition.familyHistoryOther['-1']){
                            i += ':';
                            i += $scope.tempealthCondition.familyHistoryOther['-1'];
                        }
                        if (v) $scope.tempealthCondition.familyHistory.push(i);
                    });
                    Ajax({
                        method: 'post',
                        url: 'ehr/healthCondition/update',
                        data: $scope.tempealthCondition,
                        suc: function (res) {
                            YB.info({content: '修改成功'});
                            getHealthCondition();
                        }
                    });
                };
                //取消修改个人健康状况
                $scope.cancelModifyState = function () {
                    $scope.isModifyState = false;
                };
            }

        }]);
});