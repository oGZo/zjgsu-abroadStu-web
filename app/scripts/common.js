/**
 * Created by sanqi on 2016/1/11.
 */
/**
 * 订单状态通用工具
 * Created by cao on 15/12/24.
 */

var constants = {
    "status_0": "0",
    "status_1": "1",
    "status_2": "-1",
    "payStatus_1": "1",
    "payStatus_2": "2",
    "payStatus_3": "3",
    "payStatus_4": "4",
    "orderStatus_1": "1",
    "orderStatus_2": "2",
    "orderStatus_3": "3",
    "orderStatus_4": "4",
    "refundStatus_0": "0",
    "refundStatus_1": "1",
    "refundStatus_2": "2",
    "refundStatus_3": "3",
    "refundType_1": "1",
    "refundType_2": "2"
};

var getOrderStatus = function (order) {
    var status = order.status; // 状态, 0:未发布, 关闭交易/取消订单, 1:已发布, -1:已删除
    var payStatus = order.payStatus; // 支付状态 1, 待支付 2, 支付中 3, 支付成功 4，支付失败
    var orderStatus = order.orderStatus; //订单状态 1, 待安排 2, 待就诊 3, 已确认,(人工/系统确认) 4, 已评价
    var refundStatus = order.refundStatus; //退款状态 0，未退款 1, 退款中 2, 退款成功 3, 退款失败
    var refundType = order.refundType; //退款类别 1-全额退款,2-部分退款

    if (status && status == constants.status_0) {
        return "已取消";
    }

    if (status && status == constants.status_2) {
        return "已删除";
    }

    if (status && status == constants.status_1) {
        if (payStatus && payStatus == constants.payStatus_3) {

            if (orderStatus && orderStatus == constants.orderStatus_3) {
                return "已确认";
            }

            if (orderStatus && orderStatus == constants.orderStatus_4) {
                return "已评价";
            }

            if (orderStatus && (orderStatus == constants.orderStatus_2 || orderStatus == constants.orderStatus_1)) {
                if (refundStatus && refundStatus == constants.refundStatus_1) {
                    return "退款中";
                }

                if (refundStatus && refundStatus == constants.refundStatus_3) {
                    return "退款失败";
                }

                if (orderStatus == constants.orderStatus_1) {
                    return "待安排";
                }

                if (orderStatus == constants.orderStatus_2) {
                    return "待就诊";
                }

            }

        } else if (payStatus && payStatus == constants.payStatus_1) {
            return "待支付";
        } else if (payStatus && payStatus == constants.payStatus_2) {
            return "支付中";
        } else {
            return "支付失败";
        }
    }
};
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
            title: param.title||'壹宝提醒',
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
        return {
            start : start,
            count : num
        }
    },
    //获取订单类型名称
    getTypeName : function(type){
        var typeJson = {
            1 : '门诊',
            2 : '检查',
            3 : '代问诊',
            4 : '手术',
            5 : '住院',
            6 : '产检一体卡',
            7 : '手术预付费'
        }
        return typeJson[type]||'其它';
    },
    //预览页面
    previewImage : function(param){
        var template = new EJS({ url : 'views/previewImage.ejs?version='+SYSTEM_VERSION});
        var previewObj = $(template.render(param));
        previewObj.appendTo('body');
        var imgList = previewObj.find('.preview-img-list li');
        var imgLength = imgList.length;
        var $body = $('body');
        imgList.each(function(i,v){
            var me = $(this);
            var imgObj = me.find('img');
            var src = imgObj.attr('data-src');
            var img = new Image();
            img.onload = function(e){
                if(img.height>screen.height*0.8||img.width>screen.width*0.8){
                    me.find('.img-area').addClass('pa');
                }
                imgObj[0].src = src;
            }
            img.src = src;
        })
        previewObj
            //下一张
            .on('click','.next-preview',nextPage)
            //上一张
            .on('click','.prev-preview',prevPage)
            //关闭预览
            .on('click','.close-preview',function(e){
                previewObj.remove();
            })
            //左翻转
            .on('click','.left-preview',leftPage)
            //右翻转
            .on('click','.right-preview',rightPage)
            .on('dblclick',function(e){
                if(e.target==previewObj[0]){
                    previewObj.remove();
                }
            })
        previewObj.focus();
            //上一页
            function prevPage(e){
                var nowLi = previewObj.find('.preview-img-list li:visible');
                if(imgLength>1){
                    var index = imgList.index(nowLi);
                    var nextObj;
                    nowLi.hide();
                    if(!index){
                        nextObj = imgList.eq(-1);
                    }else{
                        nextObj = nowLi.prev();
                    }
                    nextObj.fadeIn().removeClass('hide');
                }
            }
            //下一页
            function nextPage(e){
                var nowLi = previewObj.find('.preview-img-list li:visible');
                if(imgLength>1){
                    var index = imgList.index(nowLi);
                    var nextObj;
                    nowLi.hide();
                    if(index+1==imgLength){
                        nextObj = imgList.eq(0);
                    }else{
                        nextObj = nowLi.next();
                    }
                    nextObj.fadeIn().removeClass('hide');
                }
            }
            //左翻转
            function leftPage(e){
                var nowLi = previewObj.find('.preview-img-list li:visible');
                var img = nowLi.find('img');
                var rotateAngle = img.attr('data-angle');
                if((!rotateAngle&&rotateAngle!==0)||rotateAngle===0){
                    rotateAngle = 270;
                }else{
                    rotateAngle = parseInt(rotateAngle,10) - 90;
                    if(rotateAngle<0){
                        rotateAngle = 270
                    }
                }
                img
                    .css({
                        'transform': 'rotate('+ rotateAngle +'deg)'
                    })
                    .attr('data-angle',rotateAngle)
            }
            //右翻转
            function rightPage(e){
                var nowLi = previewObj.find('.preview-img-list li:visible');
                var img = nowLi.find('img');
                var rotateAngle = img.attr('data-angle');
                if((!rotateAngle&&rotateAngle!==0)||rotateAngle===0){
                    rotateAngle = 90;
                }else{
                    rotateAngle = parseInt(rotateAngle,10) +  90;
                    if(rotateAngle>270){
                        rotateAngle = 0;
                    }
                }
                img
                    .css({
                        'transform': 'rotate('+ rotateAngle +'deg)'
                    })
                    .attr('data-angle',rotateAngle)
            }
            $body.off('keyup');
            $body.on('keyup',function(e){
                //if(e.keyCode ==37||e.keyCode ==38){
                //    prevPage();
                //}else if(e.keyCode ==39||e.keyCode ==40){
                //    nextPage();
                //}
                switch (e.keyCode){
                    case 37 : prevPage(); break;
                    case 38 : leftPage();break;
                    case 39 : nextPage();break;
                    case 40 : rightPage();break;
                    default :1;
                }
            })
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
            token: 'Yb-assitant-Token',
            permission: 'permission'
        },
        sexJson: {
            1: '男',
            2: '女'
        },
        //订单状态
        orderStatus: {},
        //
        capitalStatus: {
            0: '冻结中',
            1: '待结算',
            2: '已结算'
        },
        logJson: {
            1: {
                1: '下单',
                2: '支付',
                3: '确认安排',
                4: '确认就诊',
                5: '评价',
                6: '分享',
                7: '取消',
                8: '结算'
            },
            3: {
                1: '修改时间',
                2: '修改导诊'
            }
        },
        refundStatusJson: {
            0: "未退款",
            1: "退款中",
            2: "退款成功",
            3: "退款失败"
        },
        weekJson: {
            0: '日',
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六'
        },
        periodJson: {
            1: '上午',
            2: '下午',
            3: '晚上'
        },
        subTypeList:[
            {
                id : 1,
                text : '门诊'
            },
            {
                id : 2,
                text : '检查'
            },
            {
                id : 5,
                text : '住院'
            }
        ],
        subTypeMap : {
            1 : '门诊',
            2 : '检查',
            5 : '住院'
        },
        recordTypeMap : {
            1 : '就诊',
            2 : '随访',
            3 : '咨询'
        },
        taskStatusList : [
            {
                id : 1,
                text :'待完成'
            },
            {
                id : 2,
                text :'已完成'
            },
            {
                id : 3,
                text :'已取消'
            }
        ],
        statusMap : {
            1 : '待完成',
            2 : '已完成',
            3 : '已取消'
        }
    },
    reg : {
        pwd: /^\w{6,25}$/,
        inviteCode: /^\w{8}$/,
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
//plupload中为我们提供了mOxie对象
//有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
//如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
function previewImage(file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if (!file || !/image\//.test(file.type)) return; //确保文件是图片
    if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        var fr = new mOxie.FileReader();
        fr.onload = function () {
            callback(fr.result);
            fr.destroy();
            fr = null;
        }
        fr.readAsDataURL(file.getSource());
    } else {
        var preloader = new mOxie.Image();
        preloader.onload = function () {
            //preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback && callback(imgsrc); //callback传入的参数为预览图片的url
            preloader.destroy();
            preloader = null;
        };
        preloader.load(file.getSource());
    }
}
