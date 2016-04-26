//健康档案
define(['app', 'controllers/HealthModuleViewController','controllers/MedicalRecordsTreatmentController','controllers/VisitRecordsController','controllers/ConsultRecordsController'], function (app) {
    app.controller('CourseViewController', ['$scope', 'Ajax', '$location', '$window',
        function ($scope, Ajax, $location, $window) {
            var search = $location.search();
            //var formData = {
            //    pathogenesisId : search.pathogenesisId,
            //    count:1000,
            //    start : 0
            //}
            Ajax({
                method: 'get',
                url: 'ehr/pathogenesis/detail/'+search.pathogenesisId,
                //data: formData,
                suc: function (res) {
                    YB.log(res);
                    $scope.pathogenesis = res.pathogenesis;
                    if(res&&res.athogenesisRecordDTOs){
                        $scope.records = res.athogenesisRecordDTOs;
                        if(!search.recordId){
                            $scope.changeRecord(res.athogenesisRecordDTOs[0]||{});
                        }else{
                            $('.record-nav li[data-id="'+search.recordId+'"]').addClass('current');
                        }
                    }else{
                        //YB.info({
                        //    content : '该病程暂无就诊记录'
                        //})
                    }

                }
            });

            $scope.currentType = search.recordType;
            if(search.recordId){
                $scope.currentRecordId = search.recordId;
            }
            $scope.changeRecord = function(record,event){
                $scope.currentRecordId = record.recordId;
                $location.search('recordId',record.recordId);
                $location.search('recordType',record.type);
                $scope.currentType = record.type;
                $location.replace();
                switch (record.type){
                    case 1 : YB.medicalRecordInit();break;
                    case 2 : YB.visitRecordInit();break;
                    case 3 : YB.consultRecordInit();break;
                    default :break;
                }
                //YB.medicalRecordInit();
            }
        }]);
});