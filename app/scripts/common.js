window.YB = {
    log: function (param) {
        console.log(param);
    },
    info: function(info){
        art.dialog({
            title: info.title || false,
            cancel: false,
            fixed: true,
            lock: true,
            time: info.time || 1,
            content: info.content
        });
    },
    confirm : function(param){
        art.dialog({
            lock: true,
            opacity: 0.4,	// 透明度
            width: 320,
            height: 160,
            title: param.title||'',
            content: param.hint||'确定要退出吗？',
            ok: function () {
               param.ok&&param.ok();
            },
            cancel: true
        });
    },
    //将页码转化为以起点和条数来获取数据的模式 方面后期拓展
    getPageTableParam : function(param){
        var page = param.page||1;
        //数据条数
        var num = param.num||10;
        //起始数
        var start = (page-1)*num;
        return $.extend(param,{
            start : start,
            size : num
        });
    },
    //天秤默认值
    addDefaultInfo : function(e,obj,key){
        var me = $(e.target);
        var defaultInfo = me.attr('placeholder');
        if(!obj){
            obj = {};
        }
        if(!obj[key]){
            //obj[key] = defaultInfo;
        }
    },
    //获取时间戳
    getUnixTime :function (dateStr){
        var newstr = dateStr.replace(/-/g,'/');
        var date =  new Date(newstr);
        var time_str = date.getTime();
        return time_str;
    },
    //针对打开窗口的对象控制
    openerFun : function(FunName){
        if(window.opener){
            if(window.opener[FunName]){
                window.opener[FunName]();
            }else{
                window.opener.location.reload();
            }
        }
    },
    //对页面间数据操作
    localStorage : {
        setItem : function(key,val){
            if(localStorage.setItem){
                localStorage.setItem(key,val);
            }
        },
        getItem : function(key){
            if(localStorage.getItem){
                return localStorage.getItem(key);
            }
        },
        removeItem : function(key){
            if(localStorage.removeItem){
                localStorage.removeItem(key);
            }
        },
        clear : function(){
            if(localStorage.clear){
                localStorage.clear();
            }
        }
    },
    param: {
        sysParam: {
            token: 'token',
            userType : 'userType'
        },
        sexJson: {
            1: '男',
            2: '女'
        }
    },
    reg : {
        pwd: /^\w{4,25}$/,
        phone: /^(0|86|17951)?(1[345789])[0-9]{9}$/,
        idCard: /(^\d{6}\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}$)|(^\d{6}(18|19|20|21)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}(\d|X|x)$)/,
        name: /^([\u4e00-\u9fa5]*\w*){0,25}$/   //汉字 数字 字母
    }
};
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
