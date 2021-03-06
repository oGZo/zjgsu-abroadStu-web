/**
 * Created by sanqi on 2016/1/22.
 */
define(function () {
    function init(param){
        var template = new EJS({ url : 'views/assistantList.ejs?t='+ SYSTEM_VERSION });
        var dialog = art.dialog({
            lock: true,
            padding: 0,
            title: false,
            cancel: false,
            fixed: true,
            coverCloseFlag : true,
            content: template.render(param.data)
        });

        dialog.DOM.dialog.find('.confirm-btn')
            .on('click',function(e){
                var dataArr = $('.J_assistantListForm input:checked');
                var dataIds = [];
                var obj;
                dataArr.each(function(i,v){
                    var me = $(v);
                    dataIds.push({
                        id : me.val(),
                        name : me.attr('data-value')
                    });
                });
                if(!dataIds.length){
                    YB.info({
                        content : param.hintInfo || '请选择'
                    })
                    return;
                }
                param.ok&&param.ok(dataIds);
            });
        dialog.DOM.dialog.find('.cancel-btn').on('click',function(e){
            param.cancel&&param.cancel(e);
        })
        return dialog;
    }
    return {
        init : init
    }
});
