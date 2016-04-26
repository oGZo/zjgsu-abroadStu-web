define(function () {
    function addProcess(param){
        //TODO:
        var addTaskHtml = new EJS({
            url: './views/addCourseDialog.ejs?versiton='+SYSTEM_VERSION
        }).render({
                time: new Date().format('yyyy-MM-dd'),
                patientId: param.patientId
            });
        //打开窗口
        var addCourseDialog = art.dialog({
            lock: true,
            padding: 0,
            title: false,
            cancel: false,
            fixed: true,
            content: addTaskHtml
        });
        //选择任务时间
        $('.J_addCourseTime').on('click', function () {
            WdatePicker({
                isShowClear: false,
                isShowToday: false,
                dateFmt: 'yyyy-MM-dd'
            });
        });
        $('.J_cancel').on('click', function () {
            param.cancel&&param.cancel();
        });
        $('.J_addTaskForm').on('submit', function (event) {
            event.preventDefault();
            var form = $(this).serializeArray(), formData = {};
            angular.forEach(form, function (v) {
                formData[v.name] = v.value;
            });
            if(!formData.pathogenesis){
                YB.info({
                    content: '请输入病程名称'
                });
                return;
            }
            //if(!formData.desc){
            //    YB.info({
            //        content: '请输入病程描述'
            //    });
            //    return;
            //}
            if(!formData.startTime){
                YB.info({
                    content: '请选择开始时间'
                });
                return;
            }
            formData.startDate = new Date(formData.startTime.split('-').join('/')).getTime();
            delete formData.startTime;
            YB.log(formData);
            param.ok&&param.ok(formData);
        });
        //var template = new EJS({ url : 'views/processAdd.ejs?t='+ SYSTEM_VERSION });
        //var dialog = art.dialog({
        //    lock: true,
        //    padding: 0,
        //    title: false,
        //    cancel: false,
        //    fixed: true,
        //    content: template.render()
        //});
        //console.log(dialog);
        //dialog.DOM.dialog
        //    .on('click','.confirm-btn',function(e){
        //        var me = $(this);
        //        var formData = {};
        //        var forms = me.closest('form').find('[name]').toArray();//.reverse();
        //        var formFlag = true;
        //        $.each(forms,function(i,v){
        //            var m = $(v);
        //            var name = m.attr('name');
        //            var value = $.trim(m.val());
        //            var emptyInfo = m.attr('data-require');
        //            formData[name] = value;
        //            if(!value){
        //                YB.info({
        //                    content : emptyInfo
        //                })
        //                formFlag = false;
        //                return false;
        //            }
        //        });
        //        if(formFlag){
        //            param.ok&&param.ok(e);
        //        }
        //    })
        //    .on('click','.cancel-btn',function(e){
        //        param.cal&&param.cal(e);
        //    })
        return addCourseDialog;
    }
    return {
        addProcess : addProcess
    }
});
