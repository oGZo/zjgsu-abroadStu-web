/**
 * Created by sanqi on 2016/1/22.
 */
define(function () {
    function init(param){
        var template = new EJS({ url : 'views/visitTask.ejs?t='+ SYSTEM_VERSION });
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
                var dataArr = $('.J_taskDetailForm [name]');
                var data = {};
                var formFlag = true;
                dataArr.each(function(i,v){
                    var me = $(this);
                    var name = me.attr('name');
                    var hint = me.attr('data-empty');
                    if(name!='comment'&&!v.value){
                        formFlag = false;
                        YB.info({
                            content : hint
                        });
                        return false;
                    }else{
                        data[name] = $.trim(me.val());
                    }
                });
                $.each(param.data.brokerList||[],function(i,v){
                    if(v.userId==data.assistUserId){
                        data.assistName = v.nickName;
                    }
                })
                if(formFlag){
                    data.time = data.date;
                    data.timeStr = data.date.split(' ')[1];
                    data.date = YB.getUnixTime(data.date);
                    param.ok&&param.ok(data);
                }
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
