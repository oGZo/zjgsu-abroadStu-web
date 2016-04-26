//个人资料页面
define(['app'], function (app) {
  app.controller('PersonViewController', ['$scope', '$http', '$rootScope', 'Ajax', '$cookieStore',
    function ($scope, $http, $rootScope, Ajax, $cookieStore) {
      var _addItemList = [], //添加偏好医院列表
        _removeItemList = [], //删除偏好医院列表
        _addHospitalList = [], //添加偏好医院列表
        _removeHospitalList = []; //删除偏好医院列表
      $scope.customTag = '';  //自定义输入标签
      $scope.$parent.$watch('imgPath', function (e) {
        $scope.imgPath = $scope.$parent.imgPath;
      });
      if ($scope.$parent.imgPath) {
        $scope.imgPath = $scope.$parent.imgPath;
      }
      var _provinceName;  //保存个人信息所在省份名称
      getPersonInfo();
      getPCHProvinceList();
      getFirstItemList();
      getTagList();
      getProvinceList();
      //获取个人资料
      function getPersonInfo() {
        Ajax({
          method: 'post',
          url: 'assistant/profile',
          suc: function (info) {
            info.paUserInfo = info.paUserInfo || {};
            info.paBrokerInfo = info.paBrokerInfo || {};
            info.cityInfo = info.cityInfo || {};
            info.provinceInfo = info.provinceInfo || {};
            $scope.brokerPhone = info.paBrokerInfo.brokerPhone;
            $scope.nickname = info.paBrokerInfo.nickName;
            $scope.sex = info.paUserInfo.sex;
            $scope.desc = info.paUserInfo.desc;
            //$scope.imgPath = info.paUserInfo.imgPath;
            $scope.city = info.cityInfo.cityId;
            _provinceName = info.provinceInfo.name;
            getProvince();
          }
        });
      }

      //选中所在省份
      function getProvince() {
        for (var i in $scope.provinceList) {
          var province = $scope.provinceList[i];
          if (province.name == _provinceName) {
            $scope.province = province.provinceId;
            break;
          }
        }
      }

      //获取所在地省份列表
      function getProvinceList() {
        Ajax({
          method: 'post',
          url: 'assistant/profile/allprovince',
          suc: function (res) {
            $scope.provinceList = res;
            getProvince();
          }
        });
      }

      //监听所在地省份, 所在地省份变化时更新所在地城市列表
      var cityFlag = true;
      $scope.$watch('province', function () {
        if (typeof $scope.province == 'undefined')
          return;
        Ajax({
          method: 'post',
          url: 'assistant/profile/allcity',
          data: {
            provinceId: $scope.province
          },
          suc: function (res) {
            $scope.cityList = res;
            if (cityFlag && typeof $scope.city != 'undefined') {
              cityFlag = !cityFlag;
              return;
            }
            $scope.city = $scope.cityList[0].cityId;
          }
        });
      });
      //获取偏好省份列表
      function getPCHProvinceList() {
        Ajax({
          method: 'post',
          url: 'assistant/profile/provincelist',
          suc: function (res) {
            $scope.PCHProvinceList = res;
            $scope.PCHProvince = $scope.PCHProvinceList[0];
          }
        });
      }

      //监听省份 当偏好省份改变时请求偏好城市列表
      $scope.$watch('PCHProvince', function () {
        if (typeof $scope.PCHProvince == 'undefined')
          return;
        Ajax({
          method: 'post',
          url: 'assistant/profile/citylist',
          data: {
            provinceId: $scope.PCHProvince.provinceId
          },
          suc: function (res) {
            $scope.PCHCityList = res;
            $scope.PCHCity = $scope.PCHCityList[0];
          }
        });
      });
      //监听偏好城市,当偏好城市改变时请求医院列表
      $scope.$watch('PCHCity', function () {
        if (typeof $scope.PCHCity == 'undefined')
          return;
        Ajax({
          method: 'post',
          url: 'assistant/profile/hospitallist',
          data: {
            provinceId: $scope.PCHProvince.provinceId,
            cityId: $scope.PCHCity.cityId
          },
          suc: function (res) {
            $scope.PCHHospitalList = res;
          }
        });
      });
      //获取1级科室列表
      function getFirstItemList() {
        Ajax({
          method: 'post',
          url: 'assistant/profile/parentitemlist',
          suc: function (res) {
            $scope.firstItemList = res;
            $scope.firstItem = $scope.firstItemList[0];
          }
        });
      }

      //监听1级科室, 当1级科室变化时更新2级科室列表
      $scope.$watch('firstItem', function () {
        if (typeof $scope.firstItem == 'undefined')
          return;
        Ajax({
          method: 'post',
          url: 'assistant/profile/childitemlist',
          data: {
            parentItemId: $scope.firstItem.id
          },
          suc: function (res) {
            $scope.secondItemList = res;
          }
        });
      });
      //获取标签列表
      function getTagList() {
        Ajax({
          method: 'post',
          url: 'assistant/profile/tagslist',
          suc: function (res) {
            var tagList = res;
            $scope.tagList = [];
            $scope.choiceList = [];
            angular.forEach(tagList, function (tag) {
              if (tag.checked) {
                $scope.tagList.push(tag);
              } else {
                $scope.choiceList.push(tag);
              }
            });
          }
        });
      }

      //选择偏好医院
      $scope.selectPCHHospital = function () {
        //渲染模板
        var selectHospitalHtml = new EJS({
          url: './views/personSelectHospitalDialog.ejs'
        }).render({
          PCHHospitalList: $scope.PCHHospitalList
        });
        //打开窗口
        $scope.selectHospitalDialog = art.dialog({
          lock: true,
          padding: 0,
          title: false,
          cancel: false,
          fixed: true,
          content: selectHospitalHtml
        });
        dealSelectHospitalDialog && dealSelectHospitalDialog();
      };
      function dealSelectHospitalDialog() {
        dealSelectHospitalDialog = null;
        //选择偏好医院相关操作
        $('body')
        //取消选择偏好医院
          .on('click', '.J_selectHospitalDialog .J_cancel', function () {
            _addHospitalList = [];
            _removeHospitalList = [];
            $scope.selectHospitalDialog.close();
          })
          //选择医院
          .on('click', '.J_selectHospitalDialog .J_checkbox', function () {
            var index = this.value;
            var isChecked = this.checked;
            var hospital = $scope.PCHHospitalList[index];
            if (isChecked) {  //选中
              if (hospital.isChecked) { //之前已有的 去删除行为 从删除列表中删除
                angular.forEach(_removeHospitalList, function (v, i) {
                  if (v == hospital.id) {
                    _removeHospitalList.splice(i, 1);
                  }
                });
              } else {  //之前没选中 添加行为 添加到添加列表中
                _addHospitalList.push(hospital.id);
              }
            } else {  //未选中
              if (hospital.isChecked) { //之前已有的 删除行为 添加到删除列表中
                _removeHospitalList.push(hospital.id);
              } else {  //之前没有的 去添加行为 从添加列表中删除
                angular.forEach(_addHospitalList, function (v, i) {
                  if (v == hospital.id) {
                    _addHospitalList.splice(i, 1);
                  }
                });
              }
            }
          })
          //提交偏好医院
          .on('submit', '.J_selectHospitalDialog .J_selectHospitalForm', function (event) {
            event.preventDefault();
            var data = [];
            //处理数据格式
            angular.forEach(_addHospitalList, function (v) {
              data.push({hospitalId: v, type: 1});
            });
            angular.forEach(_removeHospitalList, function (v) {
              data.push({hospitalId: v, type: 0});
            });
            Ajax({
              url: 'assistant/insert/hospital',
              method: 'post',
              data: {
                list: JSON.stringify(data)
              },
              suc: function (res) {
                YB.info({
                  content: '修改偏好医院成功'
                });
                _addHospitalList = [];
                _removeHospitalList = [];
                //重新获取医院列表
                Ajax({
                  method: 'post',
                  url: 'assistant/profile/hospitallist',
                  data: {
                    provinceId: $scope.PCHProvince.provinceId,
                    cityId: $scope.PCHCity.cityId
                  },
                  suc: function (res) {
                    $scope.PCHHospitalList = res;
                  }
                });
                $scope.selectHospitalDialog.close();
              }
            });
          });
      }
      //选择偏好科室
      $scope.selectItem = function () {
        //渲染模板
        var selectItemHtml = new EJS({
          url: './views/personSelectItemDialog.ejs'
        }).render({
          secondItemList: $scope.secondItemList
        });
        //打开窗口
        $scope.selectItemDialog = art.dialog({
          lock: true,
          padding: 0,
          title: false,
          cancel: false,
          fixed: true,
          content: selectItemHtml
        });
        dealSelectItemDialog && dealSelectItemDialog();
      };
      function dealSelectItemDialog() {
        dealSelectItemDialog = null;
        //选择偏好科室相关操作
        $('body')
        //取消选择偏好科室
          .on('click', '.J_selectItemDialog .J_cancel', function () {
            _addItemList = [];
            _removeItemList = [];
            $scope.selectItemDialog.close();
          })
          //选择科室
          .on('click', '.J_selectItemDialog .J_checkbox', function () {
            var index = this.value;
            var isChecked = this.checked;
            var item = $scope.secondItemList[index];
            if (isChecked) {  //选中
              if (item.isChecked) { //之前已有的 去删除行为 从删除列表中删除
                angular.forEach(_removeItemList, function (v, i) {
                  if (v == item.id) {
                    _removeItemList.splice(i, 1);
                  }
                });
              } else {  //之前没选中 添加行为 添加到添加列表中
                _addItemList.push(item.id);
              }
            } else {  //未选中
              if (item.isChecked) { //之前已有的 删除行为 添加到删除列表中
                _removeItemList.push(item.id);
              } else {  //之前没有的 去添加行为 从添加列表中删除
                angular.forEach(_addItemList, function (v, i) {
                  if (v == item.id) {
                    _addItemList.splice(i, 1);
                  }
                });
              }
            }
          })
          //提交偏好科室
          .on('submit', '.J_selectItemDialog .J_selectItemForm', function (event) {
            event.preventDefault();
            var data = [];
            //处理数据
            angular.forEach(_addItemList, function (v) {
              data.push({
                firstItemId: $scope.firstItem.id,
                secondItemId: v,
                type: 1
              });
            });
            angular.forEach(_removeItemList, function (v) {
              data.push({
                firstItemId: $scope.firstItem.id,
                secondItemId: v,
                type: 0
              });
            });
            Ajax({
              url: 'assistant/insert/items',
              method: 'post',
              data: {
                list: JSON.stringify(data)
              },
              suc: function (res) {
                YB.info({
                  content: '修改偏好科室成功'
                });
                _addItemList = [];
                _removeItemList = [];
                //重新获取2级科室列表
                Ajax({
                  method: 'post',
                  url: 'assistant/profile/childitemlist',
                  data: {
                    parentItemId: $scope.firstItem.id
                  },
                  suc: function (res) {
                    $scope.secondItemList = res;
                  }
                });
                $scope.selectItemDialog.close();
              }
            });
          });
      }

      //初始化描述可输入长度
      $scope.descLength = 500;
      $scope.maxDescLength = 500;
      //计算描述还可输入的字符数
      $scope.$watch('desc', function () {
        if (typeof $scope.desc != 'undefined') {
          $scope.descLength = $scope.maxDescLength - $scope.desc.length;
        } else {
          $scope.descLength = $scope.maxDescLength;
        }
      });

      var _addTagList = [], _removeTagList = [];
      //选择标签
      $scope.selectTag = function (index) {
        if ($scope.tagList.length < 5) {
          var choice = $scope.choiceList[index];
          if (choice.checked) { //已有的标签 取消删除 从删除列表中删除
            angular.forEach(_removeTagList, function (v, i) {
              if (v == choice.tagId) {
                _removeTagList.splice(i, 1);
              }
            });
          } else {  //没有的标签 添加行为 添加到添加列表
            _addTagList.push(choice.tagId);
          }
          $scope.tagList.push(choice);
          $scope.choiceList.splice(index, 1);
          if($scope.tagList.length >= 5){
            $scope.customTag = '';
          }
        }
      };
      //取消选择标签
      $scope.deleteTag = function (index) {
        var choice = $scope.tagList[index];
        if (choice.checked) { //已有的标签 删除 添加到删除列表
          _removeTagList.push(choice.tagId);
        } else {  //没有的标签 取消添加行为 从添加列表删除
          angular.forEach(_addTagList, function (v, i) {
            if (v == choice.tagId) {
              _addTagList.splice(i, 1);
            }
          });
        }
        $scope.choiceList.push($scope.tagList[index]);
        $scope.tagList.splice(index, 1);
      };

      //提交个人资料
      $scope.submitInfo = function () {
        console.log($scope.customTag);
        if (typeof $scope.nickname == 'undefined' || $scope.nickname.length == 0) {
          YB.info({
            content: '请输入昵称'
          });
        } else if (typeof $scope.sex == 'undefined' || $scope.sex.length == 0) {
          YB.info({
            content: '请选择性别'
          });
        } else if ($scope.province == $scope.provinceList[0].provinceId && $scope.city == $scope.cityList[0].cityId) {
          YB.info({
            content: '请选择所在地'
          });
        } else if (typeof $scope.desc == 'undefined' || $scope.desc.length == 0) {
          YB.info({
            content: '请输入简介'
          });
        }
        else {
          var data = [];
          angular.forEach(_addTagList, function (v) {
            data.push({
              tagId: v,
              type: 1
            });
          });
          angular.forEach(_removeTagList, function (v) {
            data.push({
              tagId: v,
              type: 2
            });
          });
          if($scope.customTag.length) {
            data.push({
              type: 3,
              name: $scope.customTag
            });
          }
          Ajax({
            method: 'post',
            url: 'assistant/insert/tags',
            data: {
              list: JSON.stringify(data)
            },
            suc: function (res) {
              $scope.customTag = '';
              getTagList();
            }
          });
          Ajax({
            method: 'post',
            url: 'assistant/profile/alterinfo',
            data: {
              nickname: $scope.nickname,
              sex: $scope.sex,
              provinceId: $scope.province,
              cityId: $scope.city,
              desc: $scope.desc
            },
            suc: function (res) {
              $scope.$parent.nickname = $scope.nickname;
              YB.info({
                content: '修改成功'
              });
            }
          });
        }
      };
      var headers = {};
      headers[YB.param.sysParam.token] = $cookieStore.get(YB.param.sysParam.token);
      var urlParam = $.param(headers);
      if (!window.localStorage) {
        headers = {};
      }
      //修改个人头像信息
      var uploader1 = new plupload.Uploader({
        runtimes: 'silverlight,html4',
        browse_button: 'updatePhoto', // you can pass in id...
        url: window.BASE_URL + 'assistant/account/uploadAvatar?' + $.param(headers),
        chunk_size: '10mb',
        file_data_name: 'attachment',
        filters: {
          max_file_size: '5mb',
          mime_types: [
            {title: "img files", extensions: "gif,jpg,jpeg,png"}
          ]
        },
        flash_swf_url: 'plugin/plupload/Moxie.swf',
        silverlight_xap_url: 'plugin/plupload/Moxie.xap',
        preinit: {
          UploadFile: function (up, file) {
            //var notice_Id = 1
            //var multipart_params = {
            //    notice_Id : notice_Id
            //};
            //up.setOption('multipart_params', multipart_params);
          }
        },
        init: {
          //文件选择框弹出之前会调用的方法
          Browse: function (up) {
            //                alert(555)
          },
          //当有文件加入队列事会 调用的方法
          FilesAdded: function (up, files) {
            uploader1.start();
          },
          //上传完成后的回调方法 res内   res.response内有后台返回数据
          FileUploaded: function (up, file, res) {
            if (res.status == 200) {
              try {
                var data = $.parseJSON($(res.response).text());
                if (data.status == 0) {
                  if (data.data) {
                    data.data = $.parseJSON(data.data);
                    $scope.imgPath = data.data.imgPath;
                    $scope.$parent.imgPath = $scope.imgPath;
                    $('.assistant-photo').each(function (i, v) {
                      this.src = data.data.imgPath;
                    })
                  }
                  YB.info({
                    content: '修改成功'
                  });
                } else {
                  YB.info({
                    content: '修改失败'
                  });
                }
              } catch (e) {
                YB.info({
                  content: '接口异常'
                });
              }
            } else {
              YB.info({
                content: '网络错误'
              });
            }
          },
          //上传过程中发生错误会调用的方法
          Error: function (up, args) {
            var message = args.message;
            if (args.code == -600) {
              message = '图片大小不能超过5M';
            }
            YB.info({
              content: message
            });
          }
        }
      });
      uploader1.init();
    }
  ]);
});