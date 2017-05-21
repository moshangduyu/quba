/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-23
 * @lastChange 2017-03-23
 * @version 1.0.0
 */
  define(function(require){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  require("../lib/select/select.js");
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
    var sale = {
      // 初始化及函数调用
      init:function(){
        var _this = this;
        // 获取项目Id
        _this.marketingright = _this.getQueryString('marketingright');
        // 加载数据
        _this.getSaleData(_this.marketingright);
      },
      //  项目编号
      marketingright:null,
      bannerProgress:0,
      infoProgress:0,
      decProgress:0,
      picProgress:0,
      //产品图片轮播
      slider:function(){
        jq('#pic_slider').banqh({
          box:"#pic_slider",//总框架
          pic:"#ban_pic1",//大图框架
          pnum:"#ban_num1",//小图框架
          autoplay:false,//是否自动播放
          interTime:5000,//图片自动切换间隔
          delayTime:400,//切换一张图片时间
          order:0,//当前显示的图片（从0开始）
          picdire:true,//大图滚动方向（true为水平方向滚动）
          mindire:true,//小图滚动方向（true为水平方向滚动）
          min_picnum:5,//小图显示数量
          pop_up:false//大图是否有弹出框
        })
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      },
      // 获取代理范围
      getScopes:function(key,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/marketing/right/agent/scopes',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#scopes').append(html).selectlist({zIndex: 10,width: 214,height: 42,onChange:function(){
              _this.addEven();
            }});
            if(key!=undefined&&name!=undefined){
              $('#scopes input[name="scopes"]').val(key);
              $('#scopes .select-button').val(name);
              _this.addEven();
            }
          }
        })
      },
      // 获取代理类型
      getTypes:function(key,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/marketing/right/agent/types',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#types').append(html).selectlist({zIndex: 9,width: 214,height: 42,onChange:function(){
              _this.addEven();
            }});
            if(key!=undefined&&name!=undefined){
              $('#types input[name="types"]').val(key);
              $('#types .select-button').val(name);
              _this.addEven();
            }
          }
        })
      },
      // 获取代理年限
      getTerms:function(key,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/marketing/right/agent/terms',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#terms').append(html).selectlist({zIndex: 8,width: 214,height: 42,onChange:function(){
              _this.addEven();
            }});
            if(key!=undefined&&name!=undefined){
              $('#terms input[name="terms"]').val(key);
              $('#terms .select-button').val(name);
              _this.addEven();
            }
          }
        })
      },
      // 获取详情
      getSaleData:function(marketingright,isChange){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/marketing/right/info?marketingright='+marketingright,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            var html = '';
            html+=' <div class="fl" id="picContainer">';
            if(res.data.cover==undefined){
              html+='<div class="img-head"><img src="images/common/banner_fixedasset.png" alt=""></div>';
            }else{
              _this.bannerProgress = 15;
              html+='<div class="img-head"><img src="'+ res.data.cover +'?imageMogr2/thumbnail/!850x380r/gravity/Center/crop/850x380" alt=""></div>';
            }
            html+='<div class="file-btnbox">\
                      <button class="btn-txt" id="addTopPic" style="position: relative; z-index: 1;">点击上传封面</button>\
        				      <p class="file-txt">建议尺寸850*380px</p>\
      		          </div></div>\
                    <div class="fl detaile-topinfobox">\
                      <div class="detaile-topinfobox-head">\
                        <h4>'+ res.data.title +'<i class="btn-edit"></i></h4>\
                      </div>\
                      <ul>\
                        <li>代理范围：'+ res.data.agentScopeName +'</li>\
                        <li>代理类型：'+ res.data.agentTypeName +'</li>\
                        <li>代理年限：'+ res.data.agentTermName +'</li>\
                      </ul></div>';
            $('.longterm-detaile-topinfo').append(html);
            _this.infoProgress = 35;
            // 编辑框
            _this.editSale(res.data);
            if(isChange==undefined){
              // 上传封面
              _this.bannerUpload();
              // 加载详细描述
              _this.getProjectDec(res.data);
              // 加载图片
              _this.getPic(res.data);
              // // 判断权限
              _this.setStatus(res.data);
              $('.longterm-detaile-topinfo>.spinner').hide();
              $('.project-detaile-content>.spinner').hide().siblings().show();
            }
            $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress)+'%');
          }
        })
      },
      // 编辑基本信息
      editSale:function(data){
        var _this = this;
        $('.detaile-topinfobox .btn-edit').unbind().on('click',function(){
          $('.btn-edit').hide();
          if($('.edit-topinfobox').length==0){
            var html = '';
            html += '<div class="fl edit-box edit-topinfobox">\
                      <ul>\
                        <li>\
                          <span class="important label-title">销售权名称：</span>\
                          <input type="text" name="property_title" maxlength="20" value="'+ data.title +'" placeholder="请填写资产名称">\
                        </li>\
                        <li class="scopes">\
                          <span class="important">代理范围：</span>\
                          <select id="scopes" name="scopes"><option value ="no">请选择</option></select>\
                        </li>\
                        <li class="types">\
                          <span class="important">代理类型：</span>\
                          <select id="types" name="types"><option value ="no">请选择</option></select>\
                        </li>\
                        <li class="terms">\
                          <span class="important">代理期限：</span>\
                          <select id="terms" name="terms"><option value ="no">请选择</option></select>\
                        </li>\
                      </ul>\
                    <div>\
                      <button class="btn-submit" disabled="disabled">保存</button>\
                      <button class="btn-cancel">取消</button>\
                    </div>\
                 </div>';
            $('.longterm-detaile-topinfo').append(html);
            // 代理范围
            _this.getScopes(data.agentScope,data.agentScopeName);
            // 代理类型
            _this.getTypes(data.agentType,data.agentTypeName);
            // 代理年限
            _this.getTerms(data.agentTerm,data.agentTermName);

            $('.detaile-topinfobox, .longterm-detaile-topinfo .spinner').hide();
            $('.edit-topinfobox').show();
          }else{
            $('.detaile-topinfobox,.btn-edit').hide();
            $('.edit-topinfobox').show();
          }

          // 取消编辑基本资料
          $('.edit-topinfobox .btn-cancel').unbind('click').on('click',function(){
            $('.detaile-topinfobox,.btn-edit').show();
            $('.edit-topinfobox').remove();
          })
        })
      },
      // 监听数据
      addEven:function(){
        var _this = this,
            data = {},
            title = $('input[name="property_title"]').val(),
            agentScope = $('input[name="scopes"]').val(),
            agentType = $('input[name="types"]').val(),
            agentTerm = $('input[name="terms"]').val();
        if(title!=''&& agentScope!='no'&& agentType!='no'&& agentTerm!='no'){
          data.title = title;
          data.agentScope = agentScope;
          data.agentType = agentType;
          data.agentTerm = agentTerm;
          $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
          _this.submit(data);
        }else{
          $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
        }
      },
      // 提交数据
      submit:function(data){
        var _this = this,
            data = data;
        data.marketingright = _this.marketingright;
        $('.edit-topinfobox .btn-submit').unbind().on('click',function(){
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/marketing/right/changeMarketingright',
            data:data,
            dataType: 'json',
            
            success:function(res){
              console.log(data);
              $('.btn-edit').show();
              $('.longterm-detaile-topinfo .spinner').show().siblings().remove();
              var marketingright = _this.marketingright;
              _this.getSaleData(marketingright,'change');
            }
          })
        })
      },
      // 设置权限
      setStatus:function(data,change){
        var _this = this;
        if(data==undefined && change!=undefined){
          $.ajax({
            type:"get",
            url:urlPath + '/web/userCenter/marketing/right/info?marketingright='+ _this.marketingright,
            dataType: 'json',
            
            success:function(res){
              switch(res.data.status){
                case 1:
                  $('.detaile-topinfobox .btn-edit').remove();
                  $('.right-fixedbox .progress a').css({'color':'#979797','background':'#e8e8e8','cursor':'default'}).text('待审核');
                  break;
                case 2:
                  $('.detaile-topinfobox .btn-edit').remove();
                  $('.right-fixedbox .progress a').css({'color':'#979797','background':'#e8e8e8','cursor':'default'}).text('转让中');
                  break;
                case 3:
                  $('.btn-edit').remove();
                  $('.right-fixedbox .progress a').css({'color':'#979797','background':'#e8e8e8','cursor':'default'}).text('转让完成');
                  break;
                default :
                  $('.right-fixedbox .progress a').css({'cursor':'pointer'});
                  _this.subStatus();
                  break;
              }
            }
          })
        }else{
          switch(data.status){
            case 1:
              $('.detaile-topinfobox .btn-edit').remove();
              $('.right-fixedbox .progress a').css({'color':'#979797','background':'#e8e8e8','cursor':'default'}).text('待审核');
              break;
            case 2:
              $('.detaile-topinfobox .btn-edit').remove();
              $('.right-fixedbox .progress a').css({'color':'#979797','background':'#e8e8e8','cursor':'default'}).text('转让中');
              break;
            case 3:
              $('.btn-edit').remove();
              $('.right-fixedbox .progress a').css({'color':'#979797','background':'#e8e8e8','cursor':'default'}).text('转让完成');
              break;
            default :
              $('.right-fixedbox .progress a').css({'cursor':'pointer'});
              _this.subStatus();
              break;
          }
        }
      },
      // 申请转让
      subStatus:function(){
        var _this = this;
        $('.right-fixedbox .progress>a').unbind('click').on('click',function(e){
          var  html = '';
          if(_this.bannerProgress!=0 && _this.decProgress!=0 && _this.picProgress!=0){
            $.ajax({
              type:"post",
              url:urlPath + '/web/userCenter/marketing/right/transfer/apply',
              data:{marketingright:_this.marketingright},
              dataType: 'json',
              
              success:function(res){
                _this.setStatus(undefined,true);
              }
            })
          }else{
            html +='请添加';
            var arr = [];
            var arrTxt = [];
            arr.push(_this.bannerProgress,_this.decProgress,_this.picProgress);
            arrTxt.push('封面','详细介绍','图片资料');
            $.each(arr, function(index, el) {
              if(el == 0){
                html+= arrTxt[index];
                html+='，';
              }
            });
            var num=(html.split('，')).length-1;
            if(num==1 || num>1){
              var nhtml = html.replace(/\，$/,"");
            }
            nhtml +='！';
            var options = {
              msg:nhtml,
              btn:'<a class="btn-sm">补充信息</a>',
              callback:function(){
                $('.btn-sm').on('click',function(){
                  $('.pop-bg,.pop-box').remove();
                })
              }
            }
            _this.pop(options);
          }
          e.preventDefault();
        })
      },
      //详细描述
      getProjectDec:function(data){
        var _this = this;
        var html = '';

        html+='<h2>详细描述<i class="btn-edit"></i></h2>';
        if(data.description==undefined){
          html+='<span class="no-data">暂无介绍</span>';
        }else{
          _this.decProgress =  25;
          html+='<p>'+ data.description +'</p>';
        }
        html+='<div class="edit-box edit-project-dec">\
            <span class="label-title">详细描述：</span>\
            <textarea class="txt-project-dec"></textarea>\
            <p class="edit-wordtext">你还可以输入<span>500</span>字</p>\
            <div>\
              <button class="btn-submit" disabled="disabled" style="background:rgba(0,121,159,.5);">保存</button>\
              <span class="btn-cancel">取消</span>\
            </div>\
          </div>';
        $('#longterm_dec').append(html);
        // 获取项目介绍
        _this.editProjectDec(data.description);
      },
      // 编辑详细描述
      editProjectDec:function(description){
        var _this = this;
        $('#longterm_dec .btn-edit').unbind().on('click',function(){
          $('.btn-edit').hide();
          $('.edit-project-dec').show().siblings('span,p').hide();
          // 项目介绍字数统计
  				var textArea = $('.edit-project-dec').find("textarea");
  					word = $('.edit-project-dec').find('.edit-wordtext span');
  				statInputNum(textArea,word);
  				function statInputNum(textArea,numItem) {
	        	var max = numItem.text(),
	            	curLength;
		    		textArea[0].setAttribute("maxlength", max);
	        	curLength = textArea.val().length;
            if(description==undefined){
              var txt = "请填写详细描述";
              textArea.val(txt).css('color','#9f9f9f');
              textArea.focus(function() {
                if ($(this).val() == txt) {
                    $(this).val('').css('color', '#272727');
                }
              });
              textArea.blur(function() {
                if ($(this).val() == '') {
                    $(this).val(txt).css('color','#9f9f9f');
                }
              });
            }else{
              var txt =description;
              textArea.val(txt);
              $('.edit-wordtext span').text(max - textArea.val().length);
              $('#longterm_dec .btn-submit').removeAttr('disabled').css('background','#00799f');
              _this.subProjectDec();
            }
            textArea.focus(function() {
              var focusTxt = textArea.val();
              var txt = "请填写详细描述";
              if(focusTxt==txt){
                $(this).val('').css('color', '#272727');
              }
            });
            textArea.on('input propertychange', function () {
		            $('.edit-wordtext span').text(max - $(this).val().length);
                if($(this).val()!=''){
                  $('#longterm_dec .btn-submit').removeAttr('disabled').css('background','#00799f');
                  _this.subProjectDec();
                }else{
                  var txt = "请填写详细描述";
                  $('.edit-project-dec').find('.edit-wordtext span').text('500');
                  $(this).val(txt).css('color','#9f9f9f').blur();
                  $('#longterm_dec .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
		        });
	       	}
        })
        $('#longterm_dec .btn-cancel').on('click',function(){
          $('.btn-edit').show();
          $('.edit-project-dec').hide().siblings('span,p').show();
          $('.edit-project-dec').find('.edit-wordtext span').text('500');
        })
      },
      // 提交详细描述
      subProjectDec:function(){
        var _this = this;
        $("#longterm_dec .btn-submit").unbind('click').on('click', function(event) {
          var marketingright = _this.marketingright,
              description = $('.txt-project-dec').val();
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/marketing/right/changeDescription',
            data:{'marketingright':marketingright,'description':description},
            dataType: 'json',
            
            success:function(res){
              _this.decProgress =  25;
              if($('#longterm_dec>span.no-data').length==0){
                $('#longterm_dec>p').text(description).show();
              }else{
                $('#longterm_dec>span.no-data').remove();
                $('#longterm_dec').append('<p>'+ description + '</p>');
              }
              $('.edit-project-dec').hide();
              $('.btn-edit').show();
              _this.editProjectDec(description);
              $('.edit-project-dec').find('.edit-wordtext span').text('500');
              $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress)+'%');
            }
          })
          event.preventDefault();
        });
      },
      // 编辑图片
      getPic:function(data){
        var _this = this;
        var html = '';
        if(data.pictures.length==0){
          html+='<span class="no-data">暂无介绍</span>';
          $('#longterm_pic').append(html);
        }else{
          _this.picProgress = 25;
          html+=' <div class="ban" id="pic_slider">\
                    <div class="ban2" id="ban_pic1"><ul>';
          $.each(data.pictures,function(index,item){
            html+='<li><a href="javascript:;"><img data-pictureskey="'+ item.key +'" src="'+ item.accessUrl +'"></a></li>';
          });
          html+=' </ul></div>\
                  <div class="min_pic">\
                    <div class="num clearfix" id="ban_num1"><ul>';
          $.each(data.pictures,function(index,item){
            html+='<li><a href="javascript:;"><img data-pictureskey="'+ item.key +'" src="'+ item.accessUrl +'?imageMogr2/thumbnail/!150x150r/gravity/Center/crop/150x150"></a></li>';
          });
          html+='</ul></div></div></div>';
          $('#longterm_pic').append(html);
          $('#longterm_pic .spinner').hide();
          _this.slider();
        }
        // 新增图片
        _this.editPic(data.pictures);
      },
      // 编辑图片
      editPic:function(pics){
        var _this = this;
        $('#longterm_pic .btn-edit').unbind('click').on('click',function(event){
          $('.btn-edit,.btn-delet,.btn-add').hide();
          if(pics==undefined){
            _this.addPicBox(pics);
          }else{
            _this.addPicBox(pics);
          }
          $('#longterm_pic .edit-project-pic').show().siblings('.no-data,#pic_slider').hide();
          _this.subProjectPic();
          event.preventDefault();
        })
      },
      // 添加图片容器
      addPicBox:function(pics){
        var _this = this;
        var html = '';
        html+=  '<div class="edit-box edit-project-pic" id="pic_container">\
                  <ul>';
        if(pics!==undefined){
          $.each(pics,function(index,item){
            html+= '<li class="up-success"><div class="delete-pic"><i></i></div><img data-key="'+ item.key +'" src="'+ item.accessUrl +'" /></li>';
          })
        }
        html+='</ul>\
                  <div class="filepic-btnbox fl">\
                    <button class="btn-txt" id="addPic"></button>\
                  </div>\
                  <p class="file-txt">支持JPG、PNG、GIF ,大小不超过5M</p>\
                  <div>\
                    <button class="btn-submit" disabled="disabled">保存</button>\
                    <span class="btn-cancel">取消</span>\
                  </div>\
                </div>';
        $('#longterm_pic').append(html);
        // 监听
        $('#pic_container>ul').bind('DOMNodeInserted',function(e){
          var obj = $(e.target);
          var Len = $('#pic_container>ul>li.up-success').length;
          if(Len!=0){
            $('#longterm_pic .btn-submit').removeAttr('disabled').css('background','#00799f');
          }else{
            $('#longterm_pic .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
          }
        })
        _this.projectPicUpload();
        _this.delPic();
        // 取消增加项目图片
        $('.edit-project-pic .btn-cancel').unbind('click').on('click',function(){
            $('.btn-edit,.btn-delet,.btn-add').show();
            $('#longterm_pic').find('.edit-project-pic').remove();
            $('#longterm_pic .no-data,#longterm_pic #pic_slider').show();
        })
      },
      // 删除图片
      delPic:function(){
        var _this = this;
        $('#pic_container>ul>li .delete-pic i').each(function(index, el) {
          $(this).unbind('click').on('click', function(event) {
            $(this).parent().parent().remove();
            var length = $('#pic_container>ul>li').length;
            if(length<10){
              if($('#pic_container .filepic-btnbox').css('display')=='none'){
                $('#pic_container .filepic-btnbox').show();
              }
            }
            event.preventDefault();
            /* Act on the event */
          });
        });
      },
      // 上传图片
      projectPicUpload:function(){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: 'addPic',	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: 'pic_container',	 //上传区域DOM ID，默认是browser_button的父元素
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
                    // 判断一次性锁选图片是否大于10张
                    if(files.length>10){
                      var options = {
                        msg:'最多只能上传10个文件，请重新选择！',
                        btn:'<a class="btn-sm">重新上传</a>',
                        callback:function(){
                          $('.btn-sm').on('click',function(){
                            $('.pop-bg,.pop-box').remove();
                          })
                        }
                      }
                      _this.pop(options);
                      for(var i=0;i<files.length;i++){
                          up.removeFile(files[i]);
                      }
                    }else{
                      var hLength = $('#pic_container>ul>li').length;
                      if(hLength==0){
                        $('#pic_container .filepic-btnbox').hide();
                        plupload.each(files, function(file) {
                          var html = '<li id="' + file.id +'">\
                                        <div class="progress"></div>\
                                        <div class="delete-pic"><i></i></div>\
                                      </li>';
                          $('#pic_container>ul').append(html);
                        });
                      }else{
                        // 判断一次性选择图片+已有图片是否大于10张
		                		var hLength = $('#pic_container>ul>li').length;
                        if(files.length>(10-hLength)){
                          var options = {
                            msg:'最多只能上传10个文件，请重新选择！',
                            btn:'<a class="btn-sm">重新上传</a>',
                            callback:function(){
                              $('.btn-sm').on('click',function(){
                                $('.pop-bg,.pop-box').remove();
                              })
                            }
                          }
                          _this.pop(options);
                          for(var i=0;i<files.length;i++){
                              up.removeFile(files[i]);
                          }
                        }else if((files.length+hLength)==10){
                          $('#pic_container .filepic-btnbox').hide();
                          plupload.each(files, function(file) {
                            var html = '<li id="' + file.id +'">\
                                          <div class="progress"></div>\
                                          <div class="delete-pic"><i></i></div>\
                                        </li>';
                            $('#pic_container>ul').append(html);
                          });
                        }else{
                          plupload.each(files, function(file) {
                            var html = '<li id="' + file.id +'">\
                                          <div class="progress"></div>\
                                          <div class="delete-pic"><i></i></div>\
                                        </li>';
                            $('#pic_container>ul').append(html);
                          });
                        }
		                	}
                    }
			            },
			            'BeforeUpload': function(up, file) {
                    // 每个文件上传前，处理相关的事情
			            },
			            'UploadProgress': function(up, file) {
			                // 每个文件上传时，处理相关的事情
			                $('#'+file.id+' .progress').show().text('正在上传');//控制进度条
                      _this.delPic();
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
			               	$('#'+file.id).addClass('up-success').append(del).find('.progress').hide();
                      _this.delPic();
			            },
			            'Error': function(up,err, errTip){
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
                      case -602:
                      var options = {
                        msg:'所选图片重复，请重新上传！',
                        btn:'<a class="btn-sm">重新上传</a>',
                        callback:function(){
                          $('.btn-sm').on('click',function(){
                            $('.pop-bg,.pop-box').remove();
                          })
                        }
                      }
                      _this.pop(options);
                      break;
                      default:
                      var options = {
                        msg:errTip,
                        btn:'<a class="btn-sm">重新上传</a>',
                        callback:function(){
                          $('.btn-sm').on('click',function(){
                            $('.pop-bg,.pop-box').remove();
                          })
                        }
                      }
                      _this.pop(options);
                      console.log(err,errTip);
                    }
			            }
			        }
			    });
      },
      // 提交产品图片
      subProjectPic:function(){
        var _this = this;
        $('#longterm_pic .btn-submit').unbind('click').on('click',function(event){
          var keys = [];
          $('#pic_container>ul>li.up-success>img').each(function(index, el) {
            var key = $(this).attr('data-key');
            keys.push(key);
          });
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/marketing/right/changePictures',
            data:{'keys':keys,'marketingright':_this.marketingright},
            dataType: 'json',
            
            success:function(res){
              $('#longterm_pic .edit-project-pic,#pic_slider').remove();
              $('.btn-edit,.btn-delet,.btn-add').show();
              $('#longterm_pic .spinner').show().remove();
              window.location.reload();
            }
          })
          event.preventDefault();
        })
      },
      // 上传封面
      bannerUpload:function(){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: 'addTopPic',	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: 'picContainer',	 //上传区域DOM ID，默认是browser_button的父元素
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
                  if($("#picContainer .img-head .new-img").length!=0){
                    $("#picContainer .img-head .new-img").remove();
                  }
                  plupload.each(files, function(file) {
                    var html = '<div class="new-img" id="'+ file.id +'"></div>';
                    $('#picContainer .img-head').append(html);
                  })
		            },
		            'BeforeUpload': function(up, file) {
                  // 每个文件上传前，处理相关的事情
		            },
		            'UploadProgress': function(up, file) {
		                // 每个文件上传时，处理相关的事情
                    $('#addTopPic').attr('disabled','disabled').text('正在上传');
		            },
		            'UploadComplete': function(up,files) {
		                //队列文件处理完毕后，处理相关的事情
		            },
		            'FileUploaded': function(up, file, info) {
		                // 每个文件上传成功后，处理相关的事情
		               	var domain = up.getOption('domain');
		               	var res = JSON.parse(info);
		               	var sourceLink =  domain + res.key; //获取上传成功后的文件的Url
		               	var del = $('<img data-key="'+ res.key +'" src="'+ sourceLink +'?imageMogr2/thumbnail/!850x380r/gravity/Center/crop/850x380" />');
                    $('#picContainer .img-head>img').remove();
		               	$('#'+file.id).addClass('up-success').append(del).find('.progress').hide();
                    $('#addTopPic').removeAttr('disabled').text('更换封面');
                    $.ajax({
                      type:"get",
                      url:urlPath + '/web/userCenter/marketing/right/changeCover',
                      dataType: 'json',
                      data:{marketingright:_this.marketingright,coverKey:res.key},
                      
                      success:function(res){
                        _this.bannerProgress = 15;
                        $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress)+'%');
                      }
                    })
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
                    default:
                    console.log(err,errTip);
                    $('#addTopPic').removeAttr('disabled').text('上传失败，重新上传');
                  }
		            }
		        }
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
    sale.init();
  })
 })
