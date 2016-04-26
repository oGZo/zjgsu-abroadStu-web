/**
 * Created by sanqi on 2016/1/22.
 */
define(function () {
    function init(param){
        var template = new EJS({ url : 'views/addOrderLog.ejs?t='+ SYSTEM_VERSION });
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
                var dataArr = $('.J_addOrderLog [name]');
                var dataId = dataArr.val();
                var data = {};
                var formFlag = true;
                dataArr.each(function(i,v){
                    var me = $(this);
                    var name = me.attr('name');
                    var val = $.trim(me.val());
                    data[name] = val;
                });
                if(!data.logMessage){
                    YB.info({
                        content : '备注信息不能为空！'
                    })
                    return;
                }
                param.ok&&param.ok(data);
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
