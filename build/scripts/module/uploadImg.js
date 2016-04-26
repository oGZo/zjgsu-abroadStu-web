define(function () {
    function init(param){
        var template = new EJS({ url : 'views/uploadImg.ejs?t='+ SYSTEM_VERSION });
        var dialog = art.dialog({
            lock: true,
            padding: 0,
            title: false,
            cancel: false,
            fixed: true,
            coverCloseFlag : true,
            content: template.render({
                imageList : param.imageList
            })
        });
        var imgFileParam = {};
        var ulImgList = $('#fileImgList');
        var imgLiTemplate =  new EJS({
            element: 'imgTemplate'
        });
        console.log(imgLiTemplate);
        var headers = {};
        headers[YB.param.sysParam.token] = param.token;
        if (!window.localStorage) {
            headers = {};
        }
        var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
            runtimes: 'html5',
            browse_button: 'updatePhoto', // you can pass in id...
            url: window.BASE_URL + 'ehr/uploadImage?' + $.param(headers),
            //chunk_size: '10mb',
            file_data_name: 'imageList',
            multi_selection : true,
            filters: {
                max_file_size: '10mb',
                mime_types: [
                    {title: "img files", extensions: "gif,jpg,jpeg,png"}
                ]
            },
            flash_swf_url: 'plugin/plupload/Moxie.swf',
            silverlight_xap_url: 'plugin/plupload/Moxie.xap',
            init : {
                //当有文件加入队列事会 调用的方法
                FilesAdded: function (up, files) {
                    var maxLength = 15;
                    var nowAllImgLength = $('#fileImgList li').length-1;
                    var addImgLength =  files.length;
                    if(nowAllImgLength + addImgLength>maxLength){
                        uploader.files.splice(nowAllImgLength-1,addImgLength);
                        var maxSelectImgLength = maxLength-nowAllImgLength;
                        YB.info({
                            content : "此次最多可选"+maxSelectImgLength+'张图片'
                        });
                        return;
                    }
                    if(nowAllImgLength>13){
                        $('#updatePhoto').hide();
                    }
                    var msgFlg = 0;
                    for (var i = 0, len = files.length; i < len; i++) {
                        if (files[i].size > 10*1024*1024) {
                            uploader.files.splice(i, 1);
                            msgFlg = 1;
                        }
                        else {
                            var imgLi = imgLiTemplate.render({
                                id : files[i].id,
                                imageKey : 1,
                                miniImageUrl : 'images/loading.gif',
                                imageUrl : '3',
                                status : 'loading'
                            });
                            ulImgList.append(imgLi);
                            uploader.start();
                        }
                    }
                    if (msgFlg == 1) {
                        YB.info({
                            content : "上传图片大于10M"
                        });
                    }
                },
                //上传完成后的回调方法 res内   res.response内有后台返回数据
                FileUploaded : function (up, file, res) {
                    if (res.status == 200) {
                        try {
                            //var data = $.parseJSON($(res.response).text());
                            var data = $.parseJSON(res.response);
                            if (data.status == 0) {
                                data.data = $.parseJSON(data.data);
                                file.flag = true;
                                var imgLiObj = ulImgList.find('[data-id="'+ file.id+'"]');
                                var imgDataObj = data.data[0];
                                //缩略图
                                var imgSrc = imgDataObj.miniImageUrl;
                                var imgDom = imgLiObj.find('img');
                                var imgObj = new Image();
                                imgObj.onload = function(e){
                                    imgDom[0].src = imgSrc;
                                    imgLiObj.attr('data-status','success');
                                    imgLiObj.addClass('success');
                                    imgLiObj.attr('data-imageUrl',imgDataObj.imageUrl);
                                    imgLiObj.attr('data-key',imgDataObj.imageKey);
                                    if(imgDom.height()>imgLiObj.height()&&imgDom.height()>imgDom.width()){
                                        imgLiObj.addClass('img-h');
                                    }
                                    if(imgDom.width()>imgLiObj.width()&&imgDom.width()>imgDom.height()){
                                        imgLiObj.addClass('img-w');
                                    }
                                };
                                imgObj.src = imgSrc;
                                //uploader.refresh();
                            } else {
                                YB.info({
                                    content: '上传失败'
                                });
                                uploadError(file);
                            }
                        } catch (e) {
                            YB.info({
                                content: '上传失败'
                            });
                            uploadError(file);
                        }
                    } else {
                        uploadError(file);
                        YB.info({
                            content: '网络错误'
                        });
                    }
                },
                //上传过程中发生错误会调用的方法
                Error: function (up, args) {
                    console.log(arguments);
                    var message = args.message;
                    if (args.code == -600) {
                        message = '图片大小不能超过10M';
                    }
                    uploadError(args.file);
                    YB.info({
                        content: message
                    });
                }
            }
        });
        uploader.init(); //初始化
        function uploadError(file){
            ulImgList.find('[data-id="'+ file.id+'"]').addClass('error').attr('data-status','error');
        }
        ////手动删除图片
        $('#fileImgList').on('click','li .J_delImg',function(e){
            var me = $(this);
            me.closest('li').remove();
            $('#updatePhoto').show();
        })
        dialog.DOM.dialog.find('.confirm-btn')
            .on('click',function(e){
                var me = $(this);
                var imageList = [];
                var loadingFlag = true;
                $('#fileImgList li').each(function(i,v){
                    var m = $(this);
                    var key = m.attr('data-key');
                    var status = m.attr('data-status');
                    var miniImageUrl = m.find('img').attr('src');
                    var imageUrl = m.attr('data-imageUrl');
                    YB.log(status);
                    YB.log(status=='loading');
                    if(status=='loading'){
                        YB.info({
                            content : '还有图片在上传中,请稍后'
                        });
                        loadingFlag = false;
                        return false;
                    }
                    //有key和上次成功的图片
                    if(key&&status!='error'&&status!='loading'){
                        imageList.push({
                            imageUrl : imageUrl,
                            imageKey : key,
                            miniImageUrl : miniImageUrl
                        })
                    }
                })
                if(!loadingFlag){
                    return;
                }
                if(imageList.length){
                    uploader.destroy();
                    param.ok&&param.ok(imageList);
                }else{
                    YB.info({
                        content : '暂无合格上传图片'
                    })
                }
            });
        dialog.DOM.dialog.find('.cancel-btn').on('click',function(e){
                uploader.destroy();
                param.cancel&&param.cancel(e);
            })
        return dialog;
    }
    return {
        init : init
    }
});
