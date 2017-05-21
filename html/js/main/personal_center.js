/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-01
 * @lastChange 2017-03-02
 * @version 1.0.0
 */
define(function(require){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  require("../lib/select/select.js");
  require("../lib/laydate/laydate.js");
  // 弹窗
  var pop = require("../module/popbox/pop_main.js");
  //ajaxUrl 模块
  var url = require('../module/url_main.js'),
    Url = new url(),
    urlPath = Url.url;
  // login 模块
  var login = require("../module/login.js"),
    Login = new login();
    Login.render();

  $(function(){
    var personal = {
      // 初始化及函数调用
      init:function(){
        var _this = this;
        // 加载数据
        _this.getPersonalData();
      },
      project:null,
      education:null,
      work:null,
      invest:null,
      // 获取省份列表
      getProv:function(citys,keys){
        var _this = this;
        if(citys!=undefined&&keys!=undefined){
          var ret = citys.split(' ');
          var retkey = keys.split(',');
        }
        $.ajax({
          type:"get",
          url:urlPath + '/web/common/region/firstFegion',
          dataType: 'json',

          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.code +'">'+ item.name +'</option>';
            });
            $('#prov').append(html).selectlist({zIndex: 10, width: 354, height: 42, onChange:function(){
                var code = $('#prov input[name="prov"]').val();
                $('#city').remove();
                var dom = '<select id="city" class="city" name="city">\
              							<option value ="no">请选择</option>\
              						</select>';
                $('#citybox').append(dom);
                _this.getCity(code);
                _this.addEventInfo();
            }});
            if(citys!=undefined&&keys!=undefined){
              $('input[name="prov"]').val(retkey[0]);
              $('#prov .select-button').val(ret[0]);
              $('#city').remove();
              var dom = '<select id="city" class="city" name="city">\
                          <option value ="no">请选择</option>\
                        </select>';
              $('#citybox').append(dom);
              if(ret.length==1){
                _this.getCity(retkey[0],retkey[1],ret[0]);
              }else{
                _this.getCity(retkey[0],retkey[1],ret[1]);
              }
            }
            _this.addEventInfo();
          }
        })
      },
      // 获取城市列表
      getCity:function(provkey,code,key){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/common/region/getRegionByFather',
          dataType: 'json',
          data:{'code':provkey},

          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.code +'">'+ item.name +'</option>';
            });
            $('#city').append(html).selectlist({ zIndex: 10, width: 354, height: 42, onChange:function(){
              _this.addEventInfo();
            }});
            if(key!=undefined){
              $('input[name="city"]').val(code);
              $('#city .select-button').val(key);
            }
            _this.addEventInfo();
          }
        })
      },
      // 获取职位类型
      getPositionType:function(name,key){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/me/position/types',
          dataType: 'json',

          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#position').append(html).selectlist({zIndex: 10, width: 285, height: 40, onChange:function(){
              var Degvaule = $('input[name="position"]').val();
              if(Degvaule!='no'){
                $('#position .select-button').css('color','#272727');
              }else{
                $('#position .select-button').css('color','#9f9f9f');
              }
              _this.addEventWorks();
            }});
            if(name!=undefined && key!=undefined){
              $('input[name="position"]').val(key);
              $('#position .select-button').val(name).css('color','#272727');
            }
            $('#position').css('margin-left','-5px');
            _this.addEventWorks();
          }
        })
      },
      //  获取学位
      getDegrees:function(name,key){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/me/degrees',
          dataType: 'json',

          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#degrees').append(html).selectlist({zIndex: 10, width: 580, height: 40, onChange:function(){
              var Degvaule = $('input[name="degrees"]').val();
              if(Degvaule!='no'){
                $('#degrees .select-button').css('color','#272727');
              }else{
                $('#degrees .select-button').css('color','#9f9f9f');
              }
              _this.addEventEducations();
            }});
            if(name!=undefined && key!=undefined){
              $('input[name="degrees"]').val(key);
              $('#degrees .select-button').val(name).css('color','#272727');
            }
            $('#degrees').css('margin-left','-5px');
            _this.addEventEducations();
          }
        })
      },
      // 获取融资轮次
      getPrise:function(name,key){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/project/financing/prises',
          dataType: 'json',

          success:function(res){
            console.log(res);
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#prise').append(html).selectlist({zIndex: 11, width: 580, height: 40, onChange:function(){
              var Degvaule = $('input[name="prise"]').val();
              if(Degvaule!='no'){
                $('#prise .select-button').css('color','#272727');
              }else{
                $('#prise .select-button').css('color','#9f9f9f');
              }
              _this.addEventInvest();
            }});
            if(name!=undefined && key!=undefined){
              $('input[name="prise"]').val(key);
              $('#prise .select-button').val(name).css('color','#272727');
            }
            $('#prise').css('margin-left','-5px');
            _this.addEventInvest();
          }
        })
      },
      // 获取币种
      getCurrencys:function(name,key){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/common/currencys',
          dataType: 'json',

          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#currency').append(html).selectlist({zIndex: 10, width: 580, height: 40, onChange:function(){
              var Degvaule = $('input[name="currency"]').val();
              if(Degvaule!='no'){
                $('#currency .select-button').css('color','#272727');
              }else{
                $('#currency .select-button').css('color','#9f9f9f');
              }
              _this.addEventInvest();
            }});
            if(name!=undefined && key!=undefined){
              $('input[name="currency"]').val(key);
              $('#currency .select-button').val(name).css('color','#272727');
            }
            $('#currency').css('margin-left','-5px');
            _this.addEventInvest();
          }
        })
      },
      //  调用日期控件
      setlayerDate:function(obj,callback){
        var _this = this;
        laydate.skin('molv');
        $('#'+obj).unbind('click').on('click',function(event) {
          var self = $(this);
          laydate({
            elem: '#'+obj, //目标元素
            format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
            istoday: false,
            isclear: false,
            event:'click', //响应事件。
            choose: function(datas){ //选择日期完毕的回调
              self.attr('data-year', datas);
              callback();
            }
          });
          event.preventDefault();
        });
      },
      // 加载个人中心数据
      getPersonalData:function(type){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/me/index',
          dataType: 'json',

          success:function(res){
            console.log(res);
            // 加载全部数据
            if(type==undefined){
              // 加载基本信息
              _this.getInfo(res.data);
              // 获取工作经历
              _this.getWorks(res.data);
              // 获取教育经历
              _this.getEducations(res.data);
              // 判断投资人认证
              _this.isInvestorType(res.data);
              // 判断专家认证
              _this.isApply(res.data);
              $('.personal-content>.spinner').hide().siblings().show();
            }else{
              switch (type) {
                case 0: _this.getInfo(res.data); break;
                case 1: _this.getWorks(res.data); break;
                case 2: _this.getEducations(res.data); break;
                case 3: _this.getInvest(res.data); break;
              }
            }
          }
        })
      },
      // 判断投资人认证
      isInvestorType:function(data){
        var _this = this;
        switch(data.investorType){
          case 0:
            var li = '<li class="create-investor">\
                        <h2>投资人申请</h2>\
                        <a class="btn-investor" href="certified_investor.html">申请认证投资人</a>\
                      </li>';
            $('.personal-content>ul').append(li);
            break;
          case 1:
            var li = '<li class="create-investor">\
                        <h2>投资人申请</h2>\
                        <a class="btn-investor" style="text-decoration:none;">投资人申请审核中</a>\
                      </li>';
            $('.personal-content>ul').append(li);
            break;
          case 2:
            var li = '<li class="invest-list">\
              <div class="spinner" style="display: none;">\
                <div class="double-bounce1"></div>\
                <div class="double-bounce2"></div>\
              </div>\
            </li>';
            $('.personal-content>ul').append(li);
            // 获取投资案例
            _this.getInvest(data);
            break;
        }
      },
      // 判断专家认证
      isApply:function(data){
        var _this = this;
        switch(data.expertType){
          case 0:
            var li = '<li class="create-investor">\
                        <h2>技术专家认证</h2>\
                        <a class="btn-investor" href="certified_apply.html">申请认证技术专家</a>\
                      </li>';
            $('.personal-content>ul').append(li);
            break;
          case 1:
            var li = '<li class="create-investor">\
                        <h2>技术专家认证</h2>\
                        <a class="btn-investor" style="text-decoration:none;">技术专家申请审核中</a>\
                      </li>';
            $('.personal-content>ul').append(li);
            break;
          case 2:
            var li = '<li class="invest-list">\
              <div class="spinner" style="display: none;">\
                <div class="double-bounce1"></div>\
                <div class="double-bounce2"></div>\
              </div>\
            </li>';
            $('.personal-content>ul').append(li);
            // 获取专家擅长
            // _this.getInvest(res.data);
            break;
        }
      },
      // 获取基本资料
      getInfo:function(data){
        var _this = this,
            html = '';
        html+=' <div class="wrap-center personal-header">';
        if(data.avatarUrl!=undefined){
          html+='<img class="fl" src="'+ data.avatarUrl +'" alt="">';
        }else{
          html+='<img class="fl" src="images/personal_center/pic_head.png" alt="">';
        }
        html+=' <div class="fl header-info">';
        if(data.investorType==2){
          html+=' <h2 class="tou">'+ data.realName +'<i class="btn-edit"></i></h2>';
        }else{
          html+=' <h2>'+ data.realName +'<i class="btn-edit"></i></h2>';
        }
        if(data.regionFullName!=undefined){
          html+=' <p class="address">所在地：'+ data.regionFullName +'</p>';
        }else{
          html+=' <p>所在地：未填写</p>';
        }
        if(data.description!=undefined){
          html+='<p>'+ data.description +'</p>';
        }else{
          html+='<p>一句话简介是投资人创业者认识你的第一印象，不要空着。</p>';
        }
        html+='</div></div>';
        $('.personal-headerbox').append(html).find('.spinner').hide();
        // 点击编辑
        $('.header-info .btn-edit').unbind().on('click',function(){
          $('.personal-header, .btn-edit, .btn-delet, .btn-add').hide();
          $('.personal-headerbox').css('background-image','url(images/personal_center/pic_user_bg_setting.png)');
          if($('.edit-info').length!=0){
            $('.edit-info').show();
          }else{
            _this.editInfo(data);
            $('.edit-info').show();
          }
        })
      },
      // 编辑基本资料
      editInfo:function(data){
        var _this = this,
            html = '';
        html+=' <div class="wrap-center edit-box edit-info cf">\
        					<div id="info_head" class="fl edit-info-head">';
        if(data.avatarUrl != undefined){
          html+=' <div class="img-head"><div class="up-success new-img"><img src="'+ data.avatarUrl +'" alt=""></div></div>';
        }else{
          html+=' <div class="img-head"><img src="images/personal_center/pic_head.png" alt=""></div>';
        }
        html+=' <div class="file-btnbox">\
    								<button class="btn-txt" id="addInfoHead">选择文件</button>\
    								<p class="file-txt">支持JPG、PNG、GIF ,大小不超过5M</p>\
    						</div>\
                <div class="hidden">\
                  <input type="hidden" id="domain" value="http://onmetk0u6.bkt.clouddn.com/">\
                  <input type="hidden" id="uptoken_url" value="/web/resource/token?platform=web&bucket=hiipark&keySize=2">\
                  <input type="hidden" id="keys_url" value="/web/resource/keys?platform=web&bucket=hiipark&keySize=2">\
                </div>\
    					</div>\
    					<div class="edit-info-right fr">\
    						<ul>\
    							<li>\
    								<span class="important">真实姓名：</span>';
        if(data.realName!=undefined){
          html+='<input type="text" style="margin-left:4px; width:715px;" name="personal_name" value="'+ data.realName +'">';
        }else{
          html+='<input type="text" style="margin-left:4px; width:715px;" name="personal_name">';
        }
    		html+='</li><li>\
                  <span>所在地：</span>\
                  <div id="citybox">\
                    <i class="ic-down"></i>\
                    <select id="prov" class="prov"><option value="no">请选择</option></select>\
                    <select id="city" class="city"><option value="no">请选择</option></select>\
                  </div>\
                </li>\
  							<li>\
  								<span class="important" style="margin-left: -15px; width: 95px;">一句话介绍：</span>\
  								<textarea class="edit-info-dec"></textarea>\
  								<p class="edit-info-decword">你还可以输入<span>100</span>字</p>\
  							</li>\
    						</ul>\
    						<div>\
    							<button class="btn-submit">保存</button>\
    							<button class="btn-cancel">取消</button>\
    						</div>\
    					</div></div>';
        $('.personal-headerbox').append(html);
        // 取消编辑
        $('.edit-info .btn-cancel').unbind().on('click',function(){
          $('.edit-info').remove();
          $('.personal-header, .btn-edit, .btn-delet, .btn-add').show();
          $('.personal-headerbox').css('background-image','url(images/personal_center/pic_user_bg.png)');
        })
        // 加载所在地
        if(data.regionFullName==undefined){
          _this.getProv();
        }else{
          var citys = data.regionFullName;
          var keys =  data.regionCode;
          _this.getProv(citys,keys);
        }
        // 头像上传
        _this.infoUpHead();
        // 监听数据及个人简介
        _this.addEventInfo();
        _this.addEventInfoDec(data.description);
        // 监听数据输入
        $('#info_head .img-head').bind('DOMNodeInserted',function(e){
          _this.addEventInfo();
        })
        $('input[name="personal_name"]').bind('input propertychange',function() {
          _this.addEventInfo();
        })
      },
      // 上传头像
      infoUpHead:function(){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: 'addInfoHead',	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: 'info_head',	 //上传区域DOM ID，默认是browser_button的父元素
          multi_selection: false,
	        flash_swf_url: '/ROOT/js/lib/qn/Moxie.swf', //引入flash,相对路径
          max_file_size: '5mb',	//最大文件体积限制
	        chunk_size: '4mb',	//分块上传时，每片的体积
	        keys_url: urlPath + $('#keys_url').val(),
	        filters: {
				  mime_types : [ //只允许上传图片文件和rar压缩文件
				    { title : "图片文件", extensions : "jpg,gif,png" }
				  ],
				  prevent_duplicates : true //不允许队列中存在重复文件
					},
          auto_start: true,	//选择文件后自动上传，若关闭需要自己绑定事件触发上传
          init: {
            'FilesAdded': function(up, files) {
              // 文件添加进队列后,处理相关的事情
              if($("#info_head .img-head .new-img").length!=0){
                $("#info_head .img-head .new-img").remove();
              }else{
                $("#info_head .img-head img").remove();
              }
              plupload.each(files, function(file) {
                var html = '<div class="new-img" id="'+ file.id +'"><p class="progress"></p></div>';
                $('#info_head .img-head').append(html);
              })
            },
            'BeforeUpload': function(up, file) {
              // 每个文件上传前，处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时，处理相关的事情
                $('#'+file.id+' .progress').show().text(file.percent + '%');//控制进度条
                $('#addInfoHead').attr('disabled','disabled').text('正在上传');
            },
            'UploadComplete': function(up,files) {
                //队列文件处理完毕后，处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后，处理相关的事情
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var sourceLink =  domain + res.key; //获取上传成功后的文件的Url
                var del = $('<img data-key="'+ res.key +'" src="'+ sourceLink +'" />');
                $('#info_head .img-head>img').remove();
                $('#'+file.id).addClass('up-success').append(del).find('.progress').hide();
                $('#addInfoHead').removeAttr('disabled').text('选择文件');
                $('#info_head .file-txt').text('已上传用户头像');
            },
            'Error': function(up, err, errTip){
              switch (err.code) {
                case -600:
                  var options = {
                    msg:'所选图片尺寸太大，请重新上传！',
                    btn:'<a class="btn-sm">重新上传</a>',
                    callback:function(){
                      $('.btn-sm').on('click',function(){
                        $('.pop-bg,.pop-box').remove();
                      })
                    }
                  }
                  _this.pop(options);
                  break;
                case -601:
                var options = {
                  msg:'所选图片格式不符，请重新上传！',
                  btn:'<a class="btn-sm">重新上传</a>',
                  callback:function(){
                    $('.btn-sm').on('click',function(){
                      $('.pop-bg,.pop-box').remove();
                    })
                  }
                }
                _this.pop(options);
                break;
              }
            }
          }
        });
      },
      // 监听个人简介
      addEventInfoDec:function(dec){
        var _this = this;
        // 项目介绍字数统计
        var dec = dec,
            placeholder = "简单介绍你的经历、个人优势或关注领域",
            textArea = $('.edit-info-dec'),
            numItem = $('.edit-info-decword').find('span');
        _this.statInputNum(dec,placeholder,textArea,numItem,'100',_this.addEventInfo);
      },
      // 监听基本数据
      addEventInfo:function(){
        var _this = personal;
        var data = {},
            placeholder = "简单介绍你的经历、个人优势或关注领域",
            head = $('#info_head .img-head .up-success').length,
            name = $('input[name="personal_name"]').val(),
            dec = $('.edit-info-dec').val();
        if(head!=0 && name!='' && dec!='' && dec!=placeholder){
          data.head = $('#info_head .img-head .up-success img').attr('data-key');
          data.realName = name;
          data.description = dec;
          var prov = $('input[name="prov"]').val();
          if(prov!='no'&&prov!=undefined){
            var regionCode = $('input[name="city"]').val();
            if(regionCode!='no'&&regionCode!=undefined){
              data.regionCode = regionCode;
              $('.edit-info .btn-submit').removeAttr('disabled').css('background','#00799f');
              _this.submitInfo(data);
            }else{
              $('.edit-info .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
            }
          }else{
            $('.edit-info .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
          }
        }else{
          $('.edit-info .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
        }
      },
      // 提交基本资料
      submitInfo:function(data){
        var _this = this;
        $('.edit-info .btn-submit').unbind().on('click',function(){
          var avatarKey = data.head;
          delete data.head;
          if(avatarKey!=undefined){
            $.ajax({
              type:"post",
              url:urlPath + '/web/userCenter/me/changeAvatar',
              data:{avatarKey:avatarKey},
              dataType: 'json',

              success:function(res){
                console.log(res);
                $.ajax({
                  type:"post",
                  url:urlPath + '/web/userCenter/me/changeUserBase',
                  data:data,
                  dataType: 'json',

                  success:function(res){
                    console.log(res);
                    $('.personal-headerbox .spinner').siblings().remove();
                    $('.btn-edit,.btn-add,.btn-delet').show();
                    _this.getPersonalData(0);
                    Login.render();
                  }
                })
              }
            })
          }else{
            $.ajax({
              type:"post",
              url:urlPath + '/web/userCenter/me/changeUserBase',
              data:data,
              dataType: 'json',

              success:function(res){
                console.log(res);
                $('.personal-headerbox .spinner').siblings().remove();
                $('.btn-edit,.btn-add,.btn-delet').show();
                _this.getPersonalData(0);
              }
            })
          }
        })
      },
      // 获取工作经历
      getWorks:function(data){
        var _this = this,
            html = '';
        html+= '<h2>工作经历</h2>';
        if(data.works.length==0){
          html+= '<span class="no-data">暂无介绍</span><div class="btn-add"><i class="icon-add"></i>添加工作经历</div>';
          $('.work-list').append(html);
          $('.work-list .spinner').hide();
        }else{
          html+= '<ul>';
          $.each(data.works, function(index, item) {
            var unixTime = new Date(item.formTime),
                formTimeMonth = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                formTimeDay = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                formTime = unixTime.getFullYear()+'.'+formTimeMonth;
                starTime = unixTime.getFullYear()+'.'+formTimeMonth+'.'+ formTimeDay;
            if(item.isToNow==true){
              var toTime = '至今',
                  endTime = '至今';
            }else{
              var unixTime = new Date(item.toTime),
                  toTimeMonth = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                  toTimeDay = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                  toTime = unixTime.getFullYear()+'.'+toTimeMonth;
                  endTime = unixTime.getFullYear()+'.'+formTimeMonth+'.'+toTimeDay;
            }
            html+= '<li work-id="'+ item.id +'">\
                      <span class="time" data-startime="'+ starTime +'" data-endtime="'+ endTime +'">'+ formTime +'-'+ toTime +'</span>\
                      <h3 data-companyType="'+ item.companyType +'">'+ item.companyName +'<i class="btn-delet"></i><i class="btn-edit"></i></h3>\
                      <p data-positionType="'+ item.positionType +'"><span>'+ item.positionTypeName +'</span>'+ item.positionName +'</p>\
                    </li>';
          });
          html+= '</ul><div class="btn-add"><i class="icon-add"></i>添加工作经历</div>';
          $('.work-list').append(html);
          $('.work-list .spinner').hide();
          // 编辑工作经历
          $('.work-list .btn-edit').unbind('click').on('click', function(event) {
            var item = $(this).parents('li:eq(0)'),
                formTime = item.find('.time').attr('data-startime').replace(/\./g, '-'),
                toTime = item.find('.time').attr('data-endtime'),
                data = {
                  work: $(this).parents('li:eq(0)').attr('work-id'),
                  companyName: item.find('h3').text(),
                  companyType:item.find('h3').attr('data-companyType'),
                  positionName: item.find('p>span').text(),
                  positionType: item.find('p').text(),
                  positionTypeId: item.find('p').attr('data-positiontype'),
                  formTime: formTime
                };
            data.positionType = data.positionType.replace(data.positionName,'');
            if(toTime == '至今'){
              data.isToNow = true;
            }else{
              data.isToNow = false;
              data.toTime = toTime.replace(/\./g, '-');
            }
            _this.editWorks(item,data);
            $('.btn-add, .btn-edit, .btn-delet').hide();
            event.preventDefault();
          });
        }
        // 新增工作经历
        $('.work-list .btn-add').unbind('click').on('click',function (){
          $('.btn-add, .btn-edit, .btn-delet').hide();
          _this.editWorks();
        })
        // 删除工作经历
        $('.work-list .btn-delet').unbind('click').on('click', function(event) {
          var item = $(this).parents('li:eq(0)');
          _this.delWorks(item);
        })
      },
      // 编辑/新增工作经历
      editWorks:function(obj,data){
        var _this = this,
            html = '';
        html +='<div class="edit-box edit-work-list">\
                  <div class="cf" style="margin-bottom:20px;">\
                    <div class="fl label-box"><span class="important label-title">任职公司或机构：</span></div>\
                    <div class="fl" style="display:inline-block;">\
                      <input id="radio_company" type="radio" name="company" value="">';
        if(data!=undefined){
          if(data.companyType==1){
            html+='<label for="radio_company" class="label-company active"></label>\
                   <input id="radio_mechanism" type="radio" name="company" value="">\
                   <label for="radio_mechanism" class="label-mechanism"></label>';
          }else{
            html+='<label for="radio_company" class="label-company"></label>\
                   <input id="radio_mechanism" type="radio" name="company" value="">\
                   <label for="radio_mechanism" class="label-mechanism active"></label>';
          }
        }else{
          html+='<label for="radio_company" class="label-company"></label>\
                 <input id="radio_mechanism" type="radio" name="company" value="">\
                 <label for="radio_mechanism" class="label-mechanism"></label>';
        }
        html+=' </div></div><div>\
                <div class="label-box"><span class="important label-title">公司简称：</span></div>';
        if(data!=undefined){
          html+= '<input type="text" name="companyName" maxlength="25" value="'+ data.companyName +'" placeholder=""></div>';
        }else{
          html+= '<input type="text" name="companyName" maxlength="25" value="" placeholder=""></div>';
        }
        html +='<div class="edit-work-list-position">\
                  <div class="label-box"><span class="important label-title">职位：</span></div>\
                  <select id="position" class="position"><option value="no">请选择</option></select>';
        if(data!=undefined){
          html+='<input style="margin-left: 5px;" type="text" name="positionName" value="'+ data.positionName +'" placeholder="">';
        }else{
          html+='<input style="margin-left: 5px;" type="text" name="positionName" value="" placeholder="">';
        }
        html+='</div>\
                <div class="edit-work-list-timebox">\
                  <div class="label-box fl"><span class="important label-title">任职时间段：</span></div>';
        if(data==undefined){
          html +='<div id="work_star"  data-year="" class="laydate-icon fl"></div><span class="fl" style="margin: 11px 7px;">—</span>';
        }else{
          html +='<div id="work_star" data-year="'+ data.formTime +'" class="laydate-icon fl">'+ data.formTime +'</div><span class="fl" style="margin: 11px 7px;">—</span>';
        }
        if(data!=undefined){
          if(data.isToNow == true){
            html +='<button id="work_end" data-year="" disabled="disabled" class="laydate-icon fl"></button>\
                    <input type="checkbox" checked="checked" id="work_check" class="check" />\
                    <label for="work_check" class="work_label active2"></label>';
          }else{
            html +='<button id="work_end" data-year="'+ data.toTime +'" class="laydate-icon fl">'+ data.toTime +'</button>\
                    <input type="checkbox" id="work_check" class="check" />\
                    <label for="work_check" class="work_label"></label>';
          }
        }else{
          html +='<button id="work_end" data-year="" class="laydate-icon fl"></button>\
                  <input type="checkbox" id="work_check" class="check" />\
                  <label for="work_check" class="work_label"></label>';
        }
        html +='</div><div>\
                  <span class="btn-submit">保存</span>\
                  <span class="btn-cancel">取消</span>\
                </div></div>';

        if(obj==undefined){
          $('.work-list').append(html);
          _this.getPositionType();
          $('.edit-work-list .btn-cancel').unbind('click').on('click',function(){
            $('.edit-work-list').remove();
            $('.btn-add, .btn-edit, .btn-delet').show();
          })
          // 放弃编辑
          $('.edit-work-list .btn-cancel').unbind('click').on('click',function(){
            $('.edit-work-list').remove();
            $('.btn-add, .btn-edit, .btn-delet').show();
          })
        }else{
          _this.work = obj.attr('work-id');
          obj.css('height','515px').append(html);
          $('.edit-work-list').css({'width':'790px','position':'absolute','left':'0','top':'0','margin-top':'0','z-index':'2'}).siblings().hide();
          _this.getPositionType(data.positionType,data.positionTypeId);
          // 放弃编辑
          $('.edit-work-list .btn-cancel').unbind('click').on('click',function(){
            obj.css('height','auto');
            $('.edit-work-list').siblings().show();
            $('.edit-work-list').remove();
            $('.btn-add, .btn-edit, .btn-delet').show();
          })
        }
        _this.setlayerDate('work_star',_this.addEventWorks);
        _this.setlayerDate('work_end',_this.addEventWorks);
        _this.addEventWorks();

        // 动态输入监听
        $('input[name="companyName"],input[name="positionName"]').bind('input propertychange',function() {
          _this.addEventWorks();
        });
        $('#work_star, #work_end').bind('input propertychange',function() {
          if($(this).val()==''){
            $(this).attr('data-year','');
          }
          _this.addEventWorks();
        });
        // 是否至今
        $('.work_label').unbind('click').on('click',function(event){
          if($(this).hasClass('active2')){
            $(this).removeClass('active2');
            $('#work_end').css('color','#272727').removeAttr('disabled');
          }else{
            $(this).addClass('active2');
            $('#work_end').text('').css('color','#ccc').attr('disabled','disabled');
          }
          _this.addEventWorks();
          event.preventDefault();
        })
        // 选择公司
        $('.label-company, .label-mechanism').unbind('click').on('click',function(event){
          $('.label-company, .label-mechanism').removeClass('active');
          $(this).addClass('active');
          _this.addEventWorks();
          event.preventDefault();
        })
      },
      // 删除工作经历
      delWorks:function(obj){
        var _this = this,
            work = obj.attr('work-id');
        $.ajax({
          type:"post",
          url:urlPath + '/web/userCenter/me/delWork',
          data:{work:work},
          dataType: 'json',

          success:function(res){
            console.log(res);
            obj.remove();
            if($('.work-list ul li').length==0){
              $('.work-list h2').after('<span class="no-data">暂无介绍</span>');
            }
          }
        })
      },
      // 监听工作经历
      addEventWorks:function(){
        var _this = personal,
            data = {},
            company = $('.label-company').hasClass('active') ? '1' : 'no',
            mechanism = $('.label-mechanism').hasClass('active')?'2':'no',
            companyName = $('input[name="companyName"]').val(),
            positionType = $('input[name="position"]').val(),
            positionName = $('input[name="positionName"]').val(),
            formTime = $('#work_star').text();
        if(company!='no'){
        	data.companyType = company;
        	if(positionName!=''&&positionType!=undefined&&formTime!=''){
            if(_this.work!=null){
              data.work = _this.work;
            }
            data.companyName = companyName;
            data.positionName = positionName;
            var date=' '+ formTime + ' 00:00:00';
            date = new Date(Date.parse(date.replace(/-/g, "/")));
            date = date.getTime();
            data.formTime = date;
            if(positionType!='no'){
              data.positionType = positionType;
              var isToNow = $('.work_label').hasClass('active2') ? true : false;
              if(isToNow == true){
                data.isToNow = isToNow;
                delete data.toTime;
                $('.edit-work-list .btn-submit').remove('disabled').css('background','#00799f');
                _this.subWorks(data);
              }else{
                data.isToNow = isToNow;
                var toTime = $('#work_end').text();
                if(toTime!=''){
                  var date=' '+ toTime + ' 00:00:00';
                  date = new Date(Date.parse(date.replace(/-/g, "/")));
                  date = date.getTime();
                  data.toTime = date;
                  $('.edit-work-list .btn-submit').remove('disabled').css('background','#00799f');
                  _this.subWorks(data);
                }else{
                  $('.edit-work-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
                }
              }
            }else{
              $('.edit-work-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
            }
          }else{
            $('.edit-work-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
          }
        }else{
        	if(mechanism !='no'){
        		data.companyType = mechanism;
        		if(positionName!=''&&positionType!=undefined&&formTime!=''){
              if(_this.work!=null){
                data.work = _this.work;
              }
              data.companyName = companyName;
              data.positionName = positionName;
              var date=' '+ formTime + ' 00:00:00';
              date = new Date(Date.parse(date.replace(/-/g, "/")));
              date = date.getTime();
              data.formTime = date;
              if(positionType!='no'){
                data.positionType = positionType;
                var isToNow = $('.work_label').hasClass('active2') ? true : false;
                if(isToNow == true){
                  data.isToNow = isToNow;
                  delete data.toTime;
                  $('.edit-work-list .btn-submit').remove('disabled').css('background','#00799f');
                  _this.subWorks(data);
                }else{
                  data.isToNow = isToNow;
                  var toTime = $('#work_end').text();
                  if(toTime!=''){
                    var date=' '+ toTime + ' 00:00:00';
                    date = new Date(Date.parse(date.replace(/-/g, "/")));
                    date = date.getTime();
                    data.toTime = date;
                    $('.edit-work-list .btn-submit').remove('disabled').css('background','#00799f');
                    _this.subWorks(data);
                  }else{
                    $('.edit-work-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
                  }
                }
              }else{
                $('.edit-work-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
              }
            }else{
              $('.edit-work-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
            }
        	}else{
        		$('.edit-work-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
        	}
        }
      },
      // 提交工作经历
      subWorks:function(data){
        var _this = this;
        $('.edit-work-list .btn-submit').unbind('click').on('click',function(){
          if(data.work==null){
            delete data.work;
            var url = '/web/userCenter/me/addWork';
          }else{
            var url = '/web/userCenter/me/changeWork';
          }
          $.ajax({
            type:"post",
            url:urlPath + url,
            data:data,
            dataType: 'json',

            success:function(res){
              console.log(res);
              _this.work = null;
              $('.btn-add,.btn-edit,.btn-delet').show();
              $('.work-list .spinner').show().siblings().remove();
              _this.getPersonalData(1);
            }
          })
        })
      },
      // 获取教育经历
      getEducations:function(data){
        var _this = this,
            html = '';
        html+= '<h2>教育经历</h2>';
        if(data.educations.length==0){
          html+= '<span class="no-data">暂无介绍</span><div class="btn-add"><i class="icon-add"></i>添加教育经历</div>';
          $('.school-list').append(html);
          $('.school-list .spinner').hide();
        }else{
          html+= '<ul>';
          $.each(data.educations, function(index, item) {
            var unixTime = new Date(item.formTime),
                formTimeMonth = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                formTimeDay = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                formTime = unixTime.getFullYear()+'.'+formTimeMonth;
                starTime = unixTime.getFullYear()+'.'+formTimeMonth+'.'+ formTimeDay;
            if(item.isToNow==true){
              var toTime = '至今',
                  endTime = '至今';
            }else{
              var unixTime = new Date(item.toTime),
                  toTimeMonth = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                  toTimeDay = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                  toTime = unixTime.getFullYear()+'.'+toTimeMonth;
                  endTime = unixTime.getFullYear()+'.'+formTimeMonth+'.'+toTimeDay;
            }
            html+= '<li education-id="'+ item.id +'">\
                      <span class="time" data-startime="'+ starTime +'" data-endtime="'+ endTime +'">'+ formTime +'-'+ toTime +'</span>\
                      <h3>'+ item.school +'<i class="btn-delet"></i><i class="btn-edit"></i></h3>\
                      <p data-degree="'+ item.degree +'"><span>'+ item.department +'</span>'+ item.degreeName +'</p>\
                    </li>';
          });
          html+= '</ul><div class="btn-add"><i class="icon-add"></i>添加教育经历</div>';
          $('.school-list').append(html);
          $('.school-list .spinner').hide();
          // 编辑工作经历
          $('.school-list .btn-edit').unbind('click').on('click', function(event) {
            var item = $(this).parents('li:eq(0)'),
                formTime = item.find('.time').attr('data-startime').replace(/\./g, '-'),
                toTime = item.find('.time').attr('data-endtime'),
                data = {
                  education: $(this).parents('li:eq(0)').attr('education-id'),
                  school: item.find('h3').text(),
                  department: item.find('p>span').text(),
                  degree: item.find('p').text(),
                  degreeId: item.find('p').attr('data-degree'),
                  formTime: formTime
                };
                data.degree = data.degree.replace(data.department,'');
            if(toTime == '至今'){
              data.isToNow = true;
            }else{
              data.isToNow = false;
              data.toTime = toTime.replace(/\./g, '-');
            }
            $('.btn-add, .btn-edit, .btn-delet').hide();
            _this.editEducations(item,data);
            event.preventDefault();
          });
        }
        // 新增教育经历
        $('.school-list .btn-add').unbind('click').on('click',function (event){
          $('.btn-add, .btn-edit, .btn-delet').hide();
          _this.editEducations();
          event.preventDefault();
        })
        // 删除教育经历
        $('.school-list .btn-delet').unbind('click').on('click', function(event) {
          var item = $(this).parents('li:eq(0)');
          _this.delEducations(item);
        })
      },
      // 编辑/新增教育经历
      editEducations:function(obj,data){
        var _this = this,
            html = '';
        html +='<div class="edit-box edit-school-list">\
                  <div>\
                    <div class="label-box"><span class="important label-title">学校：</span></div>';
        if(data==undefined){
          html+= '<input type="text" name="school" value="" maxlength="25" placeholder=""></div>';
        }else{
          html+= '<input type="text" name="school" value="'+ data.school +'" maxlength="25" placeholder=""></div>';
        }
        html +='<div>\
                    <div class="label-box"><span class="important label-title">学院/专业：</span></div>';
        if(data==undefined){
          html+= '<input type="text" name="department" value="" placeholder=""></div>';
        }else{
          html+= '<input type="text" name="department" value="'+ data.department +'" placeholder=""></div>';
        }
        html +='<div class="edit-school-list-degrees">\
                  <div class="label-box"><span class="important label-title">学位：</span></div>\
                  <select id="degrees" class="degrees"><option value="no">请选择</option></select>\
                </div>\
                <div class="edit-school-list-timebox">\
                  <div class="label-box fl"><span class="important label-title">就读时间段：</span></div>';
        if(data==undefined){
          html +='<div id="school_star" data-year="" class="laydate-icon fl"></div><span class="fl" style="margin: 11px 7px;">—</span>';
        }else{
          html +='<div id="school_star" data-year="'+ data.formTime +'" class="laydate-icon fl">'+ data.formTime +'</div><span class="fl" style="margin: 11px 7px;">—</span>';
        }
        if(data!=undefined){
          if(data.isToNow == true){
            html +='<button id="school_end" data-year="" disabled="disabled" class="laydate-icon fl"></button>\
                    <input type="checkbox" checked="checked" id="school_check" class="check" />\
                    <label for="school_check" class="school_label active"></label>';
          }else{
            html +='<button id="school_end" data-year="'+ data.toTime +'" class="laydate-icon fl">'+ data.toTime +'</button>\
                    <input type="checkbox" id="school_check" class="check" />\
                    <label for="school_check" class="school_label"></label>';
          }
        }else{
          html +='<button id="school_end" data-year="" class="laydate-icon fl"></button>\
                  <input type="checkbox" id="school_check" class="check" />\
                  <label for="school_check" class="school_label"></label>';
        }
        html +='</div><div>\
                  <span class="btn-submit">保存</span>\
                  <span class="btn-cancel">取消</span>\
                </div></div>';
        if(obj==undefined){
          $('.school-list').append(html);
          _this.getDegrees();
          $('.edit-school-list .btn-cancel').unbind('click').on('click',function(){
            $('.edit-school-list').remove();
            $('.btn-add, .btn-edit, .btn-delet').show();
          })
        }else{
          _this.education = obj.attr('education-id');
          obj.css('height','553px').append(html);
          $('.edit-school-list').css({'width':'790px','position':'absolute','left':'0','top':'0','margin-top':'0','z-index':'2'}).siblings().hide();
          _this.getDegrees(data.degree,data.degreeId);
          $('.edit-school-list .btn-cancel').unbind('click').on('click',function(){
            obj.css('height','auto');
            $('.edit-school-list').siblings().show();
            $('.edit-school-list').remove();
            $('.btn-add, .btn-edit, .btn-delet').show();
          })
        }
        _this.setlayerDate('school_star',_this.addEventEducations);
        _this.setlayerDate('school_end',_this.addEventEducations);
        _this.addEventEducations();
        // 动态输入监听
        $('input[name="school"],input[name="department"]').bind('input propertychange',function() {
          _this.addEventEducations();
        });
        // 是否至今
        $('.school_label').unbind('click').on('click',function(event){
          if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#school_end').css('color','#272727').removeAttr('disabled');
          }else{
            $(this).addClass('active');
            $('#school_end').text('').css('color','#ccc').attr('disabled','disabled');
          }
          _this.addEventEducations();
          event.preventDefault();
        })
      },
      // 删除教育经历
      delEducations:function(obj){
        var _this = this,
            education = obj.attr('education-id');
        $.ajax({
          type:"post",
          url:urlPath + '/web/userCenter/me/delEducation',
          data:{education:education},
          dataType: 'json',

          success:function(res){
            console.log(res);
            obj.remove();
            if($('.school-list ul li').length==0){
              $('.school-list h2').after('<span class="no-data">暂无介绍</span>');
            }
          }
        })
      },
      // 监听教育经历
      addEventEducations:function(){
        var _this = personal,
            data = {},
            school = $('input[name="school"]').val(),
            department = $('input[name="department"]').val(),
            degree = $('input[name="degrees"]').val(),
            formTime = $('#school_star').text();
        if(school!=''&&department!=''&&degree!=undefined&&formTime!=''){
          if(_this.education!=null){
            data.education = _this.education;
          }
          data.school = school;
          data.department = department;
          var date=' '+ formTime + ' 00:00:00';
          date = new Date(Date.parse(date.replace(/-/g, "/")));
          date = date.getTime();
          data.formTime = date;
          if(degree!='no'){
            data.degree = degree;
            var isToNow = $('.school_label').hasClass('active') ? true : false;
            if(isToNow == true){
              data.isToNow = isToNow;
              delete data.toTime;
              $('.edit-school-list .btn-submit').remove('disabled').css('background','#00799f');
              _this.subEducations(data);
            }else{
              data.isToNow = isToNow;
              var toTime = $('#school_end').text();
              if(toTime!=''){
                var date=' '+ toTime + ' 00:00:00';
                date = new Date(Date.parse(date.replace(/-/g, "/")));
                date = date.getTime();
                data.toTime = date;
                $('.edit-school-list .btn-submit').remove('disabled').css('background','#00799f');
                _this.subEducations(data);
              }else{
                $('.edit-school-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
              }
            }
          }else{
            $('.edit-school-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
          }
        }else{
          $('.edit-school-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
        }
      },
      // 提交教育经历
      subEducations:function(data){
        var _this = this;
        $('.edit-school-list .btn-submit').unbind('click').on('click',function(){
          if(data.education==null){
            delete data.education;
            var url = '/web/userCenter/me/addEducation';
          }else{
            var url = '/web/userCenter/me/changeEducation';
          }
          $.ajax({
            type:"post",
            url:urlPath + url,
            data:data,
            dataType: 'json',

            success:function(res){
              console.log(res);
              _this.education = null;
              $('.btn-add,.btn-edit,.btn-delet').show();
              $('.school-list .spinner').show().siblings().remove();
              _this.getPersonalData(2);
            }
          })
        })
      },
      // 获取投资案例
      getInvest:function(data){
        var _this = this,
            html = '';
        html+= '<h2>投资案例</h2>';
        if(data.investExamples.length==0){
          html+= '<span class="no-data">暂无介绍</span><div class="btn-add"><i class="icon-add"></i>添加投资案例</div>';
          $('.invest-list').append(html);
          $('.invest-list .spinner').hide();
        }else{
          html+= '<ul>';
          $.each(data.investExamples, function(index, item) {
            var unixTime = new Date(item.investTime),
                investTimeMonth = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                investTimeDay = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                investTime = unixTime.getFullYear()+'.'+investTimeMonth;
            starTime = unixTime.getFullYear()+'.'+investTimeMonth+'.'+ investTimeDay;

            // 处理币种
            if(item.currency =='CNY'){
              var currency = '人民币';
            }else if(item.currency =='USD'){
              var currency = '美元';
            }
            // 处理金额
            if(item.amount >= 100000000){
              var amount = item.amount/100000000 + '亿';
            }else{
              if( item.amount >= 10000){
                var amount = item.amount/10000 + '万';
              }else{
                var amount = item.amount;
              }
            }

            html+= '<li';
            if(item.totalAmount!=undefined){
              html+=' data-totalAmount="'+ item.totalAmount +'"';
            }
            if(item.valuation!=undefined){
              html+=' data-valuation="'+ item.valuation +'"';
            }
            if(data.entityType!= '1'){
              html+=' data-entityName="'+ item.entityName +'" data-entityType="'+ item.entityType +'"';
            }else{
              html+=' data-entityType="'+ item.entityType +'"';
            }
            html+=' invest-id="'+ item.id +'">\
                    <span class="time" data-investtime="'+ starTime +'">'+ investTime +'</span>\
                    <h3>'+ item.companyName +'<i class="btn-delet"></i><i class="btn-edit"></i></h3>\
                    <p data-prise="'+ item.prise +'" data-amount="'+ item.amount +'"><span class="priseName">'+ item.priseName +'</span>投资'+ amount +'<span class="currency" data-currency="'+ item.currency +'">'+ currency +'</span></p>\
            </li>';
          });
          html+= '</ul><div class="btn-add"><i class="icon-add"></i>添加投资案例</div>';
          $('.invest-list').append(html);
          $('.invest-list .spinner').hide();
          // 编辑投资案例
          $('.invest-list .btn-edit').unbind('click').on('click', function(event) {
            var item = $(this).parents('li:eq(0)'),
                investTime = item.find('.time').attr('data-investtime').replace(/\./g, '-'),
                data = {
                  invest: item.attr('invest-id'),
                  companyName: item.find('h3').text(),
                  priseKey: item.find('p').attr('data-prise'),
                  prise: item.find('p>span.priseName').text(),
                  currency: item.find('p>span.currency').attr('data-currency'),
                  currencyName:item.find('p>span.currency').text(),
                  amount: item.find('p').attr('data-amount'),
                  totalAmount: item.attr('data-totalAmount'),
                  valuation: item.attr('data-valuation'),
                  entityType: item.attr('data-entityType'),
                  entityName: item.attr('data-entityName'),
                  investTime: investTime
                };
            $('.btn-add, .btn-edit, .btn-delet').hide();
            _this.editInvest(item,data);
            event.preventDefault();
          });
        }
        // 新增教育经历
        $('.invest-list .btn-add').unbind('click').on('click',function (event){
          $('.btn-add, .btn-edit, .btn-delet').hide();
          _this.editInvest();
          event.preventDefault();
        })
        // 删除教育经历
        $('.invest-list .btn-delet').unbind('click').on('click', function(event) {
          var item = $(this).parents('li:eq(0)');
          _this.delInvest(item);
        })
      },
      // 编辑/新增投资案例
      editInvest:function(obj,data){
        var _this = this,
            html = '';
        html +='<div class="edit-box edit-invest-list">\
                  <div>\
                    <div class="label-box"><span class="important label-title">公司简称：</span></div>';
        if(data==undefined){
          html+= '<input type="text" name="companyName" value="" maxlength="25" placeholder=""></div>';
        }else{
          html+= '<input type="text" name="companyName" value="'+ data.companyName +'" maxlength="25" placeholder=""></div>';
        }
        html +='<div>\
                    <div class="label-box"><span class="important label-title">投资轮次：</span></div>\
                    <select id="prise" class="prise"><option value="no">请选择</option></select>\
                </div>\
                <div>\
                    <div class="label-box"><span class="important label-title">币种：</span></div>\
                    <select id="currency" class="currency"><option value="no">请选择</option></select>\
                </div>\
                <div>\
                  <div class="label-box"><span class="important label-title">我方投资金额：</span></div>';
        if(data!=undefined && data.amount !=undefined){
          html+= '<input type="text" name="amount" value="'+ data.amount +'" placeholder=""></div>';
        }else{
          html+= '<input type="text" name="amount" value="" placeholder=""></div>';
        }
        html+='<div>\
                  <div class="label-box"><span class="label-title">此轮投资金额：</span></div>';
        if(data!=undefined && data.totalAmount!=undefined){
          html+= '<input type="text" name="totalAmount" value="'+ data.totalAmount +'" placeholder=""></div>';
        }else{
          html+= '<input type="text" name="totalAmount" value="" placeholder=""></div>';
        }
        html+='<div>\
                  <div class="label-box"><span class="label-title">此轮估值：</span></div>';
        if(data!=undefined && data.valuation!=undefined){
          html+= '<input type="text" name="valuation" value="'+ data.valuation +'" placeholder=""></div>';
        }else{
          html+= '<input type="text" name="valuation" value="" placeholder=""></div>';
        }
        html+='<div style="position:relative; height: 140px;">\
                  <div class="label-box" style="position:absolute; top:0;"><span class="important label-title" style="top:-10px; margin-left:0;">我代表的投资主体：</span></div>\
                  <div class="fl" style="position:absolute; top:-10px; left:173px;">';
        if(data!=undefined && data.entityType!=undefined){
          switch(parseInt(data.entityType)){
            case  1:
              html+=' <div style="height: 53px;">\
                        <input id="radio_person" type="radio" name="company" value="">\
                        <label for="radio_person" class="label-person active"></label>\
                      </div>\
                      <div style="height: 53px;">\
                        <input id="radio_company" type="radio" name="company" value="">\
                        <label for="radio_company" class="label-company"></label>\
                        <input class="entity-name" type="text" name="company_entityName" value="" placeholder="" disabled="disabled">\
                      </div>\
                      <div style="height: 53px;">\
                        <input id="radio_mechanism" type="radio" name="company" value="">\
                        <label for="radio_mechanism" class="label-mechanism"></label>\
                        <input class="entity-name" type="text" name="mechanism_entityName" value="" placeholder="" disabled="disabled">\
                      </div>';
              break;
            case  2:
              html+=' <div style="height: 53px;">\
                        <input id="radio_person" type="radio" name="company" value="">\
                        <label for="radio_person" class="label-person"></label>\
                      </div>\
                      <div style="height: 53px;">\
                        <input id="radio_company" type="radio" name="company" value="">\
                        <label for="radio_company" class="label-company"></label>\
                        <input class="entity-name" type="text" name="company_entityName" value="" placeholder="" disabled="disabled">\
                      </div>\
                      <div style="height: 53px;">\
                        <input id="radio_mechanism" type="radio" name="company" value="">\
                        <label for="radio_mechanism" class="label-mechanism active"></label>\
                        <input class="entity-name" type="text" name="mechanism_entityName" value="'+ data.entityName +'" placeholder="">\
                      </div>';
              break;
            case  3:
              html+=' <div style="height: 53px;">\
                        <input id="radio_person" type="radio" name="company" value="">\
                        <label for="radio_person" class="label-person"></label>\
                      </div>\
                      <div style="height: 53px;">\
                        <input id="radio_company" type="radio" name="company" value="">\
                        <label for="radio_company" class="label-company active"></label>\
                        <input class="entity-name" type="text" name="company_entityName" value="'+ data.entityName +'" placeholder="">\
                      </div>\
                      <div style="height: 53px;">\
                        <input id="radio_mechanism" type="radio" name="company" value="">\
                        <label for="radio_mechanism" class="label-mechanism"></label>\
                        <input class="entity-name" type="text" name="mechanism_entityName" value="" placeholder="" disabled="disabled">\
                      </div>';
              break;
          }
        }else{
          html+=' <div style="height: 53px;">\
                    <input id="radio_person" type="radio" name="company" value="">\
                    <label for="radio_person" class="label-person"></label>\
                  </div>\
                  <div style="height: 53px;">\
                    <input id="radio_company" type="radio" name="company" value="">\
                    <label for="radio_company" class="label-company"></label>\
                    <input class="entity-name" type="text" name="company_entityName" value="" placeholder="">\
                  </div>\
                  <div style="height: 53px;">\
                    <input id="radio_mechanism" type="radio" name="company" value="">\
                    <label for="radio_mechanism" class="label-mechanism"></label>\
                    <input class="entity-name" type="text" name="mechanism_entityName" value="" placeholder="">\
                  </div>';
        }
        html+=' </div></div>\
                <div style="margin-bottom:0;">\
                  <div class="label-box" style="float:left;"><span class="important label-title">投资时间：</span></div>';
        if(data!=undefined && data.investTime!=undefined){
          html +='<div id="investTime" data-year="'+ data.investTime +'" class="laydate-icon">'+ data.investTime +'</div>';
        }else{
          html +='<div id="investTime"  data-year="" class="laydate-icon"></div>';
        }
        html +='</div><div>\
                  <span class="btn-submit">保存</span>\
                  <span class="btn-cancel">取消</span>\
                </div></div>';
        if(obj==undefined){
          $('.invest-list').append(html);
          $('.edit-invest-list').css('margin-top','35px');
          _this.getPrise();
          _this.getCurrencys();
          $('.edit-invest-list .btn-cancel').unbind('click').on('click',function(){
            $('.edit-invest-list').remove();
            $('.btn-add, .btn-edit, .btn-delet').show();
          })
        }else{
          _this.invest = obj.attr('invest-id');
          obj.append(html).css('height',$('.edit-invest-list').height()+'px');
          $('.edit-invest-list').css({'width':'790px','position':'absolute','left':'0','top':'0','margin-top':'0','z-index':'2'}).siblings().hide();
          _this.getPrise(data.prise,data.priseKey);
          _this.getCurrencys(data.currencyName,data.currency);
          // 放弃编辑
          $('.edit-invest-list .btn-cancel').unbind('click').on('click',function(){
            obj.css('height','auto');
            $('.edit-invest-list').siblings().show();
            $('.edit-invest-list').remove();
            $('.btn-add, .btn-edit, .btn-delet').show();
          })
        }
        _this.setlayerDate('investTime',_this.addEventInvest);
        _this.addEventInvest();
        // 动态输入监听
        $('input[name="companyName"],input[name="totalAmount"],input[name="valuation"],input[name="company_entityName"],input[name="mechanism_entityName"]').bind('input propertychange',function() {
          _this.addEventInvest();
        });
        // 选择投资主体
        $('.label-person, .label-company, .label-mechanism').unbind('click').on('click',function(event){
          $('.label-person, .label-company, .label-mechanism').removeClass('active');
          $(this).addClass('active');
          $('.entity-name').val('').attr('disabled','disabled');
          if($(this).hasClass('label-person')){
            _this.addEventInvest();
            return
          }else{
            $(this).next('.entity-name').removeAttr('disabled');
          }
          _this.addEventInvest();
          event.preventDefault();
        })
      },
      // 删除投资案例
      delInvest:function(obj){
        var _this = this,
            invest = obj.attr('invest-id');
        $.ajax({
          type:"post",
          url:urlPath + '/web/userCenter/me/delInvestExample',
          data:{invest:invest},
          dataType: 'json',

          success:function(res){
            console.log(res);
            obj.remove();
            if($('.invest-list ul li').length==0){
              $('.invest-list h2').after('<span class="no-data">暂无介绍</span>');
            }
          }
        })
      },
      // 监听投资案例
      addEventInvest:function(){
        var _this = personal,
            data = {},
            companyName = $('input[name="companyName"]').val(),
            amount = $('input[name="amount"]').val(),
            prise = $('input[name="prise"]').val(),
            currency = $('input[name="currency"]').val(),
            investTime = $('#investTime').text(),
            totalAmount = $('input[name="totalAmount"]').val(),
            valuation = $('input[name="valuation"]').val();
        if(companyName!=''&&amount!=''&&prise!=undefined&&currency!=undefined){
          if(_this.invest!=null){
            data.invest = _this.invest;
          }
          data.companyName = companyName;
          data.amount = amount;
          var date=' '+ investTime + ' 00:00:00';
          date = new Date(Date.parse(date.replace(/-/g, "/")));
          date = date.getTime();
          data.investTime = date;
          if(prise!='no'){
            data.prise = prise;
            if(currency!='no'){
              data.currency = currency;
              if(totalAmount!='') data.totalAmount = totalAmount;
              if(valuation!='') data.valuation = valuation;
              var num = 0;
              $('.edit-invest-list label').each(function(index, el) {
                if($(this).hasClass('active')){
                  num ++;
                  if($(this).hasClass('label-person')){
                    data.entityType = '1';
                  }else{
                    if($(this).hasClass('label-company')){
                      data.entityType = '3';
                      data.entityName = $(this).next().val();
                    }else{
                      data.entityType = '2';
                      data.entityName = $(this).next().val();
                    }
                  }
                }
              });
              if(num!=0){
                if(data.entityType =='1'){
                  delete data.entityName;
                  $('.edit-invest-list .btn-submit').remove('disabled').css('background','#00799f');
                  _this.subInvest(data);
                }else{
                  if(data.entityName!=''){
                    $('.edit-invest-list .btn-submit').remove('disabled').css('background','#00799f');
                    _this.subInvest(data);
                  }else{
                    $('.edit-invest-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
                  }
                }
              }else{
                $('.edit-invest-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
              }
            }else{
              $('.edit-invest-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
            }
          }else{
            $('.edit-invest-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
          }
        }else{
          $('.edit-invest-list .btn-submit').attr('disabled', 'disabled').css('background','rgba(0, 121, 159, .5)');
        }
      },
      // 提交投资案例
      subInvest:function(data){
        var _this = this;
        $('.edit-invest-list .btn-submit').unbind('click').on('click',function(){
          if(data.invest==null){
            delete data.invest;
            var url = '/web/userCenter/me/addInvestExample';
          }else{
            var url = '/web/userCenter/me/changeInvestExample';
          }
          $.ajax({
            type:"post",
            url:urlPath + url,
            data:data,
            dataType: 'json',

            success:function(res){
              console.log(res);
              _this.invest = null;
              $('.btn-add,.btn-edit,.btn-delet').show();
              $('.invest-list .spinner').show().siblings().remove();
              _this.getPersonalData(3);
            }
          })
        })
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      },
      // 字数统计
      statInputNum:function(dec,txt,textArea,numItem,maxtxt,callback){
        var _this = this,
            max = numItem.text(),
            curLength;
        textArea[0].setAttribute("maxlength", max);
        curLength = textArea.val().length;
        if(dec==undefined){
          var placeholder = txt;
          textArea.val(placeholder).css('color','#9f9f9f');
          textArea.focus(function() {
            if ($(this).val() == txt) {
                $(this).val('').css('color', '#272727');
            }
          });
          textArea.blur(function() {
            if ($(this).val() == '') {
                $(this).val(placeholder).css('color','#9f9f9f');
            }
          });
        }else{
          var placeholder =dec;
          textArea.val(placeholder);
          numItem.text(max - textArea.val().length);
          callback();
        }
        textArea.focus(function() {
          var focusTxt = textArea.val();
          var placeholder = txt;
          if(focusTxt==placeholder){
            $(this).val('').css('color', '#272727');
          }
        });
        textArea.bind('input propertychange', function () {
          numItem.text(max - $(this).val().length);
          if($(this).val()==''){
            var placeholder = txt;
            numItem.text(maxtxt);
            $(this).val(placeholder).css('color','#9f9f9f').blur();
          }
          callback();
        });
      },
      // 获取Url参数
      getQueryString:function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    }
    personal.init();
  })
})
