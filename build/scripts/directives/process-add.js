define(function () {
     function addProcess(param){
         var template = new EJS({ url : 'views/processAdd.ejs?t='+ SYSTEM_VERSION });
         var dialog = art.dialog({
             lock: true,
             padding: 0,
             title: false,
             cancel: false,
             fixed: true,
             content: template.render()
         });
         console.log(dialog);
         dialog.DOM.dialog
             .on('click','.confirm-btn',function(e){
                 var me = $(this);
                 var formData = {};
                 var forms = me.closest('form').find('[name]').toArray();//.reverse();
                 var formFlag = true;
                 $.each(forms,function(i,v){
                     var m = $(v);
                     var name = m.attr('name');
                     var value = $.trim(m.val());
                     var emptyInfo = m.attr('data-require');
                     formData[name] = value;
                     if(!value){
                         YB.info({
                             content : emptyInfo
                         })
                         formFlag = false;
                         return false;
                     }
                 });
                 if(formFlag){
                     param.ok&&param.ok(e);
                 }
             })
             .on('click','.cancel-btn',function(e){
                 param.cal&&param.cal(e);
             })
         return dialog;
     }
    return {
        addProcess : addProcess
    }
});
