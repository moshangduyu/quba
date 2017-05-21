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
    var projectDetaile = {
      // 初始化及函数调用
      init:function(){
        var _this = this;
        // 获取项目Id
        _this.tech = _this.getQueryString('tech');
        // 加载数据
        _this.getTechData(_this.tech);
      },
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
      // 转换数字
      convertToChinese: function(num){
        var N = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        var str = num.toString();
        var len = num.toString().length;
        var C_Num = [];
        for(var i = 0; i < len; i++){
            C_Num.push(N[str.charAt(i)]);
        }
        return C_Num.join('');
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      },
      // 项目完成度
      progress:0,
      // 项目编号
      tech:null,
      // 是否专利
      techTypeFlag:null,
      // 是否已授权
      patentStatusFlag:null,
      // 转让方式
      isBiddingFlag:null,
      // ajax 获取行业领域
      getIndustrys:function(key,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/project/industrys',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#industry').append(html).selectlist({zIndex: 10,width: 214,height: 42,onChange:function(){
              _this.addListeen();
            }});
            if(key!=undefined){
              $('#industry input[name="industry"]').val(key);
              $('#industry .select-button').val(name);
              _this.addListeen();
            }
          }
        })
      },
      // ajax 获取省份列表
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
            $('#prov').append(html).selectlist({zIndex: 8,width: 102,height: 42,onChange:function(){
              var code = $('#prov input[name="prov"]').val();
              $('#city').remove();
              var dom = '<select id="city" class="city" name="city">\
            							<option value ="no">请选择</option>\
            						</select>';
              $('#citybox').append(dom);
              _this.getCity(code);
              _this.addListeen();
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
              _this.addListeen();
            }
          }
        })
      },
      // ajax 获取城市列表
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
            $('#city').append(html).selectlist({zIndex: 8,width: 102,height: 42,onChange:function(){
              _this.addListeen();
            }});
            if(key!=undefined){
              $('input[name="city"]').val(code);
              $('#city .select-button').val(key);
              _this.addListeen();
            }
          }
        })
      },
      // ajax 获取专利所属地
      getPatentCountries:function(key,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/patentCountries',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#patentCountries').append(html).selectlist({zIndex: 8,width: 214,height: 42,onChange:function(){
              _this.addListeen();
            }});
            if(key!=undefined&&name!=undefined){
              $('#patentCountries input[name="patentCountries"]').val(key);
              $('#patentCountries .select-button').val(name);
              _this.addListeen();
            }
          }
        })
      },
      // ajax 获取成熟度
      getMaturitys:function(key,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/maturitys',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#maturitys').append(html).selectlist({zIndex: 6,width: 214,height: 42,onChange:function(){
              _this.addListeen();
            }});
            if(key!=undefined&&name!=undefined){
              $('#maturitys input[name="maturitys"]').val(key);
              $('#maturitys .select-button').val(name);

              _this.addListeen();
            }
          }
        })
      },
      // ajax 获取专利类型
      getTechTypeTrees:function(key,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/techTypeTrees',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              if(item.name=="专利"){
                $.each(item.childs,function(index, el) {
                  html += '<option value ="'+ el.code +'">'+ el.name +'</option>';
                });
              }
            });
            $('#techTypeChild').append(html).selectlist({zIndex: 9,width: 112,height: 42,onChange:function(){
              _this.addListeen();
            }});
            if(key!=undefined&&name!=undefined){
              $('#techTypeChild input[name="techTypeChild"]').val(key);
              $('#techTypeChild .select-button').val(name);
              _this.addListeen();
            }
          }
        })
      },
      // 获取交易方式
      getTradingModes:function(key,name,obj){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/tradingModes',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#'+obj).append(html).selectlist({zIndex: 4,width: 214,height: 42,onChange:function(){
              _this.addListeen();
              if(obj=='tradingModes'){
                if($('#tradingModes1')!=undefined){
                  var key1 = $('input[name="tradingModes"]').val();
                  $('#tradingModes1 .select-list>ul>li').show();
                  $('#tradingModes1 .select-list>ul>li').each(function(index, el) {
                    if($(this).attr('data-value')!='no'&&$(this).attr('data-value')==key1){
                      $(this).hide();
                      return false;
                    }
                  });
                }
              }else{
                var key2 = $('input[name="tradingModes1"]').val();
                $('#tradingModes .select-list>ul>li').show();
                $('#tradingModes .select-list>ul>li').each(function(index, el) {
                  if($(this).attr('data-value')!='no'&&$(this).attr('data-value')==key2){
                    $(this).hide();
                    return false;
                  }
                });
              }
            }});
            $('#tradingModes1').css({'zIndex':'2','width':'190px'});
            $('#tradingModes1 .select-button,#tradingModes1 .select-list').css('width','190px');

            if(obj=='tradingModes1'){
              var key1 = $('input[name="tradingModes"]').val();
              if(key1!='no'){
                $('#tradingModes1 .select-list>ul>li').show();
                $('#tradingModes1 .select-list>ul>li').each(function(index, el) {
                  if($(this).attr('data-value')!='no'&&$(this).attr('data-value')==key1){
                    $(this).hide();
                    return false;
                  }
                });
              }
            }
            if(key!=undefined&&name!=undefined){
              $('#'+obj + ' input[name="'+ obj +'"]').val(key);
              $('#'+obj + ' .select-button').val(name);
              _this.addListeen();
            }
          }
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
                      url:urlPath + '/web/userCenter/tech/changeCover',
                      dataType: 'json',
                      data:{tech:_this.tech,coverKey:res.key},
                      
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
      // 设置权限
      setStatus:function(data,change){
        var _this = this;
        if(data==undefined && change!=undefined){
          $.ajax({
            type:"get",
            url:urlPath + '/web/userCenter/tech/info?tech='+_this.tech,
            dataType: 'json',
            
            success:function(res){
              console.log(res);
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
              url:urlPath + '/web/userCenter/tech/transfer/apply',
              data:{tech:_this.tech},
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
      /* 加载数据 */
      getTechData:function(tech,isChange){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/tech/info?tech='+tech,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            var html = '';
            html+=' <div class="fl" id="picContainer">';
            if(res.data.cover==undefined){
              html+='<div class="img-head"><img src="images/common/banner_tech.png" alt=""></div>';
            }else{
              _this.bannerProgress = 15;
              html+='<div class="img-head"><img src="'+ res.data.cover +'?imageMogr2/thumbnail/!850x380r/gravity/Center/crop/850x380" alt=""></div>';
            }
            html+='<div class="file-btnbox">\
                      <button class="btn-txt" id="addTopPic" style="position: relative; z-index: 1;">点击上传封面</button>\
        				      <p class="file-txt">建议尺寸850*380px</p>\
      		          </div></div>\
                    <div class="fl detaile-topinfobox">';
            if(res.data.title.length<=12){
              html+='<div class="detaile-topinfobox-head" style="margin-bottom: 60px;">';
            }else{
                html+='<div class="detaile-topinfobox-head" style="margin-bottom: 30px;">';
            }
            html+='<h4>'+ res.data.title +'<i class="btn-edit"></i></h4>\
                      </div>\
                      <ul>\
                        <li>行业领域：'+ res.data.industryName +'</li>';
            // 判断是否专利（1=是）
            var code =  res.data.techTypePath.split(',');
            if(code[0] == 100){
              // 判断专利是否已授权
              if(res.data.patentStatus==0){
                html+=' <li>技术类型：发明专利（申请中）</li>\
                        <li>专利所属地：'+ res.data.patentCountryName +'</li>\
                        <li>专利申请号：'+ res.data.applyNumber +'</li>\
                        <li>成 熟 度：'+ res.data.maturityName +'</li>';
              }else{
                var unixTime = new Date(res.data.grantingDate*1000),
                    month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                    date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                    grantingTime = unixTime.getFullYear()+''+month+''+date;

                html+=' <li>技术类型：发明专利（已授权）</li>\
                        <li>专利所属地：'+ res.data.patentCountryName +'</li>\
                        <li>专利号：'+ res.data.patentNumber +'</li>\
                        <li>授权日期：'+ grantingTime +'</li>\
                        <li>成 熟 度：'+ res.data.maturityName +'</li>';
              }
            }else{
              // 非专利
              html+=' <li>技术类型：非专利</li>\
                      <li>技术所在地：'+ res.data.regionFullName +'</li>\
                      <li>成 熟 度：'+ res.data.maturityName +'</li>';
            }
            // 判断转让方式
            if(res.data.isBidding == false){
              // 长期转让
              html+='<li>转让方式：长期转让</li>';
              if(res.data.prices.length==1){
                $.each(res.data.prices,function(index, item) {
                  if(item.isMarkedPrice==false){
                    html+='<li>交易方式：'+ item.tradingModeName +' <span>面议</span></li>';
                  }else{
                    html+='<li>交易方式：'+ item.tradingModeName +' <span>'+ item.price +'万</span></li>';
                  }
                });
              }else{
                $.each(res.data.prices,function(index, item) {
                  var num = _this.convertToChinese((index+1));
                  if(item.isMarkedPrice==false){
                    html+='<li>交易方式'+num+'：'+ item.tradingModeName +' <span>面议</span></li>';
                  }else{
                    html+='<li>交易方式'+num+'：'+ item.tradingModeName +' <span>'+ item.price +'万</span></li>';
                  }
                });
              }
              html+='</ul></div>';
              $('#longterm_user').hide();
            }else{
              // 竞价转让
              var bidRangeNum = res.data.bidRange;
              if(bidRangeNum>=10000){
                var bidRang = (bidRangeNum/10000)+'万';
              }else{
                // var bidRang = bidRangeNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')+'元';
              }
              html+=' <li>转让方式：竞价转让</li>\
                      <li>交易方式：'+ res.data.tradingModeName +'</li>\
                      <li>转让底价：<span>'+ (res.data.startPrice/10000) +'万</span>\
                          <div class="add-info">加价幅度：<span>' + bidRang +'</span></div>\
                      </li>\
                      </ul></div>';
              $('#longterm_user h2').siblings().remove();
              _this.jingjia();
              $('#longterm_user').show();
            }
            $('.longterm-detaile-topinfo').append(html);
            $('.longterm-detaile-topinfo>.spinner').hide();
            _this.infoProgress = 35;
            // 编辑框
            _this.editProperty(res.data);
            if(isChange==undefined){
              // 上传封面
              _this.bannerUpload();
              // 加载详细描述
              _this.getProjectDec(res.data);
              // 加载图片
              _this.getPic(res.data);
              // 判断权限
              _this.setStatus(res.data);
              $('.project-detaile-content>.spinner').hide().siblings().show();
            }
            $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress)+'%');
          }
        })
      },
      // 编辑基本资料
      editProperty:function(data){
        var _this = this;
        $('.detaile-topinfobox .btn-edit').unbind().on('click',function(){
          if($('.edit-topinfobox').length==0){
            var html = '';
            html += '<div class="fl edit-box edit-topinfobox">\
                      <ul>\
                        <li>\
                          <span class="important">技术名称：</span>\
                          <input type="text" name="property_title" maxlength="20"  value="'+ data.title +'" placeholder="请填写项目名称或核心产品">\
                        </li>\
                        <li class="industry">\
                          <span class="important">行业领域：</span>\
                          <select id="industry" name="industry"><option value ="no">请选择</option></select>\
                        </li>\
                      </ul>\
                      <div>\
                        <button class="btn-submit" disabled="disabled">保存</button>\
                        <button class="btn-cancel">取消</button>\
                      </div>\
                     </div>';
            $('.longterm-detaile-topinfo').append(html);
            // 获取行业领域
            _this.getIndustrys(data.industry,data.industryName);
            // 判断专利非专利
            _this.getTechType(data);
            _this.addListeen();
            $('.detaile-topinfobox,.longterm-detaile-topinfo .spinner').hide();
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
      // 判断专利非专利
      getTechType:function(data){
        var _this = this,
            html = '',
            nextHtml = '',
            code =  data.techTypePath.split(',');
        // 判断数据是否为专利(100=专利)
        if(code[0] == 100){
          _this.techTypeFlag=true;
          // 专利
          html+=' <li class="techType">\
                    <span class="important">是否专利：</span>\
                    <select id="techType" name="techType">\
                      <option value ="1">专利</option>\
                      <option value ="0">非专利</option>\
                    </select>\
                    <select id="techTypeChild" name="techTypeChild">\
                      <option value ="no">请选择</option>\
                    </select>\
                  </li>\
                  <li>\
                    <span class="important long-important">专利所属地：</span>\
                    <select id="patentCountries" name="patentCountries">\
                      <option value ="no">请选择</option>\
                    </select>\
                  </li>\
                  <li class="patentStatus">\
                    <span class="important">专利状态：</span>\
                    <select id="patentStatus" name="patentStatus">\
                      <option value ="no">请选择</option>\
                      <option value ="0">申请中</option>\
                      <option value ="1">已授权</option>\
                    </select>\
                  </li>';
          $('.industry').after(html);

          // 切换专利状态
          $('#patentStatus').selectlist({zIndex: 7,width: 112,height: 42,onChange:function(){
            var statusKey = $('#patentStatus input[name="patentStatus"]').val();
            _this.isPatentStatus(statusKey);
          }});
          $('#patentStatus input[name="patentStatus"]').val(data.patentStatus);

          // 判断专利是否已授权(0==申请中)
          if(data.patentStatus==0){
            _this.patentStatusFlag = false;
            $('#patentStatus .select-button').val('申请中');
            nextHtml+='<li class="applyNumber">\
                    <span class="important maturityslabel">申请号：</span>\
                    <input type="text" name="" value="'+ data.applyNumber +'" placeholder="请填写申请号">\
                  </li>';
          }else{
            _this.patentStatusFlag = true;
            $('#patentStatus .select-button').val('已授权');
            var unixTime = new Date(data.grantingDate*1000),
                month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                grantingTime = unixTime.getFullYear()+ '-' +month+ '-' +date;
            nextHtml+=' <li class="patentNumber">\
                      <span class="important">专利号：</span>\
                      <input type="text" name="" value="'+ data.patentNumber +'" placeholder="请填写授权号">\
                    </li>\
                    <li class="grantingDate">\
                      <span class="important">专利授权日：</span>\
                      <input id="action_date" type="text" value="'+ grantingTime +'" data-year="'+ grantingTime +'" class="laydate-icon">\
                    </li>';
          }
          // ajax 获取专利所属地
          _this.getPatentCountries(data.patentCountry,data.patentCountryName);
          // 获取专利类型
          _this.getTechTypeTrees(data.techTypeCode,data.techTypeName);
        }
        else{
          _this.techTypeFlag=false;
          // 非专利
          html +='<li class="techType">\
                    <span class="important">是否专利：</span>\
                    <select id="techType" name="techType">\
                      <option value ="0">非专利</option>\
                      <option value ="1">专利</option>\
                    </select>\
                  </li>\
                  <li>\
                    <span class="important citylabel">技术所在地：</span>\
                    <div id="citybox">\
                      <i class="ic-down"></i>\
                      <select id="prov" class="prov"><option value="no">请选择</option></select>\
                      <select id="city" class="city"><option value="no">请选择</option></select>\
                    </div>\
                  </li>';
          $('.industry').after(html);
          var citys = data.regionFullName;
          var keys =  data.regionPath;
          // 技术所在地
          _this.getProv(citys,keys);
        }
        // 增加成熟度及转让方式
        nextHtml+='<li>\
                      <span class="important maturityslabel">成熟度：</span>\
                      <select id="maturitys" name="maturitys">\
                        <option value="no">请选择</option>\
                      </select>\
                    </li>\
                    <li>\
                      <span class="important">转让方式：</span>\
                      <select id="isBidding" name="isBidding">\
                        <option value="no">请选择</option>\
                        <option value="false">长期转让</option>\
                        <option value="true">竞价转让</option>\
                      </select>\
                    </li>';
        $('.edit-topinfobox>ul').append(nextHtml);
        // 调用年份
        laydate.skin('molv');
        $('#action_date').on('click',function(event) {
          var self = $(this);
          laydate({
            elem: '#action_date', //目标元素
            format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
            istoday: false,
            isclear: false,
            event:'click', //响应事件。
            choose: function(datas){ //选择日期完毕的回调
              self.attr('data-year', datas);
              _this.addListeen();
            }
          });
          event.preventDefault();
          /* Act on the event */
        });
        // 成熟度
        _this.getMaturitys(data.maturity,data.maturityName);

        // 转让方式 切换
        $('#isBidding').selectlist({zIndex: 5,width: 214,height: 42,onChange:function(){
          var key = $('#isBidding input[name="isBidding"]').val();
          _this.isBidding(key);
        }});
        $('#isBidding input[name="isBidding"]').val(data.isBidding);

        var biddingHtml = '';
        if(data.isBidding==false){
          _this.isBiddingFlag = false;
          $('#isBidding .select-button').val('长期转让');
          if(data.prices.length==1){
            var priceOne = {};
            $.each(data.prices,function(index, item) {
              priceOne.tradingMode = item.tradingMode;
              priceOne.tradingModeName = item.tradingModeName;
              biddingHtml +='<li class="tradingModes">\
                              <span class="important">交易方式：</span>\
                              <select id="tradingModes" name="tradingModes">\
                                <option value="no">请选择</option>\
                              </select>\
                            </li>\
                            <li class="pricesModes">\
                <span class="important">转让价格：</span>\
                <select class="pricesModes" id="pricesModes" name="pricesModes">';
                if(item.isMarkedPrice == true){
                  biddingHtml +='<option value="yes">已有估价</option>\
                                  <option value="no">面议</option>\
                                  </select>\
                                  <span class="pricebox"><input class="sx-text" type="text" name="prices" value="'+ item.price +'" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>\
                                  </li>\
                                  <li class="add-pricemodes">添加交易方式</li>';
                }else{
                  biddingHtml +='<option value="no">面议</option>\
                                <option value="yes">已有估价</option>\
                                  </select>\
                                  </li>\
                                  <li class="add-pricemodes">添加交易方式</li>';
                }
            });
            $('.edit-topinfobox>ul').append(biddingHtml);
            _this.addprice();
            // 获取交易方式
            $('.tradingModes').each(function(index, el) {
              _this.getTradingModes(priceOne.tradingMode,priceOne.tradingModeName,'tradingModes');
            });
            $('#pricesModes').selectlist({zIndex: 3,width: 92,height: 42,onChange:function(){
              var self = $('#pricesModes').parent();
              var key = $('#pricesModes input[name="pricesModes"]').val();
              _this.isPricesModes(key,self);
              _this.addListeen();
            }});
          }
          else{
            var priceTwo = [];
            $.each(data.prices,function(index, item) {
              var obj = {};
              obj.tradingMode = item.tradingMode;
              obj.tradingModeName = item.tradingModeName;
              priceTwo.push(obj);
              var num = _this.convertToChinese((index+1));
              biddingHtml +='<li class="tradingModes">\
                              <span class="important long-important">交易方式'+ num +'：</span>';
              if(index==0){
                biddingHtml +='<select id="tradingModes" name="tradingModes">';
              }else{
                biddingHtml +='<select id="tradingModes1" name="tradingModes1">';
              }

              biddingHtml +='<option value="no">请选择</option>\
                              </select>\
                            </li>\
                            <li class="pricesModes">\
                <span class="important long-important">转让价格'+ num +'：</span>';
                if(index==0){
                  biddingHtml +='<select class="pricesModes" id="pricesModes" name="pricesModes">';
                }else{
                  biddingHtml +='<select class="pricesModes1" id="pricesModes1" name="pricesModes1">';
                }
                if(item.isMarkedPrice == true){
                  biddingHtml +='<option value="yes">已有估价</option>\
                                  <option value="no">面议</option>\
                                  </select>\
                                  <span class="pricebox"><input class="sx-text" type="text" name="prices" value="'+ item.price +'" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>\
                                  </li>';
                }else{
                  biddingHtml +='<option value="no">面议</option>\
                                <option value="yes">已有估价</option>\
                                  </select>\
                                  </li>';
                }
            })
            $('.edit-topinfobox>ul').append(biddingHtml);
            $.each(priceTwo,function(index, el) {
              if(index==0){
                _this.getTradingModes(el.tradingMode,el.tradingModeName,'tradingModes');
              }else{
                _this.getTradingModes(el.tradingMode,el.tradingModeName,'tradingModes1');
              }
            });
            var det = '<i class="det"></i>';
            $('#tradingModes1').parent().append(det);
            _this.detprice();
            $('#pricesModes').selectlist({zIndex: 3,width: 92,height: 42,onChange:function(){
              var self = $('#pricesModes').parent();
              var key = $('#pricesModes input[name="pricesModes"]').val();
              _this.isPricesModes(key,self);
            }});
            $('#pricesModes1').selectlist({zIndex: 2,width: 92,height: 42,onChange:function(){
              var self = $('#pricesModes1').parent();
              var key = $('#pricesModes1 input[name="pricesModes1"]').val();
              _this.isPricesModes(key,self);
            }});
            $('#pricesModes1').css('zIndex','1');
          }
        }
        else{
          _this.isBiddingFlag = true;
          $('#isBidding .select-button').val('竞价转让');
          biddingHtml +='<li class="tradingModes">\
                          <span class="important">交易方式：</span>\
                          <select id="tradingModes" name="tradingModes">\
                            <option value="no">请选择</option>\
                          </select>\
                        </li>\
                        <li class="startPrice">\
                          <span class="important">转让底价：</span>\
                          <input class="small-text" type="text" name="startPrice" value="'+ (data.startPrice/10000) +'" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写转让底价">万\
                        </li>\
                        <li class="bidRange">\
                          <span class="important">加价幅度：</span>\
                          <input class="small-text" type="text" name="bidRange" value="'+ (data.bidRange/10000) +'" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写加价幅度">万\
                        </li>';
          $('.edit-topinfobox>ul').append(biddingHtml);
          // 获取交易方式
          $('.tradingModes').each(function(index, el) {
            _this.getTradingModes(data.tradingMode,data.tradingModeName,'tradingModes');
          });
        }
        // 是否专利切换
        $('#techType').selectlist({zIndex: 9,width: 92,height: 42,onChange:function(){
          var key = $('#techType input[name="techType"]').val();
          _this.isTechType(key);
        }});
        $('input[name="property_title"],input[name="prices"],.patentNumber input[type="text"],.applyNumber input[type="text"],#action_date,input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
          _this.addListeen();
        });
      },
      // 专利非专利切换
      isTechType:function(key){
        var _this = this,
            html = '',
            nextHtml = '';
        if(key==1 && _this.techTypeFlag==true){
          // 专利状态切换专利
          return false;
        }else if(key==0 && _this.techTypeFlag==false){
          // 非专利状态切换非专利
          return false;
        }else{
          $('.edit-topinfobox ul>li.techType').nextAll().remove();
          $('#techTypeChild').remove();
          _this.patentStatusFlag = null;
          _this.isBiddingFlag = null;
          if(key==1){
            _this.techTypeFlag = true;

            var tech ='';
            // 专利
            tech+='<select id="techTypeChild" name="techTypeChild">\
                    <option value ="no">请选择</option>\
                   </select>';
            $('.techType').append(tech);
            // 获取专利类型
            _this.getTechTypeTrees();
            html +='<li>\
                      <span class="important long-important">专利所属地：</span>\
                      <select id="patentCountries" name="patentCountries">\
                        <option value ="no">请选择</option>\
                      </select>\
                    </li>\
                    <li class="patentStatus">\
                      <span class="important">专利状态：</span>\
                      <select id="patentStatus" name="patentStatus">\
                        <option value ="no">请选择</option>\
                        <option value ="0">申请中</option>\
                        <option value ="1">已授权</option>\
                      </select>\
                    </li>';
            $('.techType').after(html);
            // ajax 获取专利所属地
            _this.getPatentCountries();
            // 切换专利状态
            $('#patentStatus').selectlist({zIndex: 7,width: 112,height: 42,onChange:function(){
              var statusKey = $('#patentStatus input[name="patentStatus"]').val();
              _this.isPatentStatus(statusKey);
            }});
          }else{
            _this.techTypeFlag = false;
            $('#techTypeChild').remove();
            // 非专利
            html +='<li>\
                      <span class="important citylabel">技术所在地：</span>\
                      <div id="citybox">\
                        <i class="ic-down"></i>\
                        <select id="prov" class="prov"><option value="no">请选择</option></select>\
                        <select id="city" class="city"><option value="no">请选择</option></select>\
                      </div>\
                    </li>';
            $('.techType').after(html);
            // 技术所在地
            _this.getProv();
          }
          nextHtml+='<li>\
                      <span class="important maturityslabel">成熟度：</span>\
                      <select id="maturitys" name="maturitys">\
                        <option value ="no">请选择</option>\
                      </select>\
                    </li>\
                    <li>\
                      <span class="important">转让方式：</span>\
                      <select id="isBidding" name="isBidding">\
                        <option value ="no">请选择</option>\
                        <option value="false">长期转让</option>\
                        <option value="true">竞价转让</option>\
                      </select>\
                    </li>';
          $('.edit-topinfobox>ul').append(nextHtml);
          // 成熟度
          _this.getMaturitys();
          // 转让方式 切换
          $('#isBidding').selectlist({zIndex: 5,width: 214,height: 42,onChange:function(){
            var key = $('#isBidding input[name="isBidding"]').val();
            _this.isBidding(key);
          }});
          $('input[name="property_title"],input[name="prices"],.patentNumber input[type="text"],.applyNumber input[type="text"],#action_date,input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
            _this.addListeen();
          });
          _this.addListeen();
        }
      },
      // 专利状态切换
      isPatentStatus:function(key){
        var _this = this;
        var html = '';
        // 专利状态和切换状态相同时不做重复切换
        if(key==0&&_this.patentStatusFlag==false){
          return false;
        }else if(key==1&&_this.patentStatusFlag==true){
          return false;
        }else{
          $('.applyNumber,.patentNumber,.grantingDate').remove();
          if(key=='no'){
            _this.patentStatusFlag = null;

            return false;
          }else if(key==0){
            _this.patentStatusFlag = false;
            html +='<li class="applyNumber">\
                    <span class="important maturityslabel">申请号：</span>\
                    <input type="text" name="property_title" value="" placeholder="请填写申请号">\
                  </li>';
            $('.patentStatus').after(html);
            $('input[name="property_title"],input[name="prices"],.patentNumber input[type="text"],.applyNumber input[type="text"],#action_date,input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
              _this.addListeen();
            });
          }else{
            _this.patentStatusFlag = true;
            html +='<li class="patentNumber">\
                      <span class="important">专利号：</span>\
                      <input type="text" name="" value="" placeholder="请填写授权号">\
                    </li>\
                    <li class="grantingDate">\
                      <span class="important">专利授权日：</span>\
                      <input id="action_date" type="text" value="" data-year="" class="laydate-icon">\
                    </li>';
            $('.patentStatus').after(html);
            $('input[name="property_title"],input[name="prices"],.patentNumber input[type="text"],.applyNumber input[type="text"],#action_date,input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
              _this.addListeen();
            });
            // 调用年份
            laydate.skin('molv');
            $('#action_date').on('click',function(event) {
              var self = $(this);
              laydate({
                elem: '#action_date', //目标元素
                format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
                istoday: false,
                isclear: false,
                event:'click', //响应事件。
                choose: function(datas){ //选择日期完毕的回调
                  self.attr('data-year', datas);
                  _this.addListeen();
                }
              });
              event.preventDefault();
              /* Act on the event */
            });
          }
          _this.addListeen();
        }
      },
      // 判断转让方式
      isBidding:function(key){
        var _this = this;
        var html = '';
        // 转让方式和切换状态相同时不做重复切换
        if( key == 'true' && _this.isBiddingFlag == true){
          return false;
        }else if(key== 'false' && _this.isBiddingFlag == false){
          return false;
        }else{
          $('.pricesModes, .startPrice, .bidRange, .add-pricemodes,.tradingModes').remove();
          if(key == 'no'){
            _this.isBiddingFlag = null;
          }else if( key== 'false'){
            _this.isBiddingFlag = false;
            html +='<li class="tradingModes">\
                      <span class="important">交易方式：</span>\
                      <select id="tradingModes" name="tradingModes">\
                        <option value="no">请选择</option>\
                      </select>\
                    </li>\
                    <li class="pricesModes">\
                      <span class="important">转让价格：</span>\
                      <select class="pricesModes" id="pricesModes" name="pricesModes">\
                        <option value="yes">已有估价</option>\
                        <option value="no">面议</option>\
                      </select>\
                      <span class="pricebox"><input class="sx-text" type="text" name="prices" value="" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>\
                    </li>\
                    <li class="add-pricemodes">添加交易方式</li>';
            $('.edit-topinfobox>ul').append(html);
            _this.addprice();
            // 获取交易方式
            $('.tradingModes').each(function(index, el) {
              _this.getTradingModes(undefined,undefined,'tradingModes');
            });
            $('#pricesModes').selectlist({zIndex: 2,width: 92,height: 42,onChange:function(){
              var self = $('#pricesModes').parent();
              var key = $('#pricesModes input[name="pricesModes"]').val();
              _this.isPricesModes(key,self);
            }});
          }else{
            _this.isBiddingFlag = true;
            html += '<li class="tradingModes">\
                      <span class="important">交易方式：</span>\
                      <select id="tradingModes" name="tradingModes">\
                        <option value="no">请选择</option>\
                      </select>\
                    </li>\
                    <li class="startPrice">\
                      <span class="important">转让底价：</span>\
                      <input class="small-text" type="text" name="startPrice" value="" placeholder="请填写转让底价">万\
                    </li>\
                    <li class="bidRange">\
                      <span class="important">加价幅度：</span>\
                      <input class="small-text" type="text" name="bidRange" value="" placeholder="请填写加价幅度">万\
                    </li>';
            $('.edit-topinfobox>ul').append(html);
            // 获取交易方式
            $('.tradingModes').each(function(index, el) {
              _this.getTradingModes(undefined,undefined,'tradingModes');
            });
          }
          $('input[name="property_title"],input[name="prices"],.patentNumber input[type="text"],.applyNumber input[type="text"],#action_date,input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
            _this.addListeen();
          });
          _this.addListeen();
        }
      },
      // 判断转让价格
      isPricesModes:function(key,obj){
        var _this = this;
        var html = '';
        // 转让方式和切换状态相同时不做重复切换
        if( key == 'yes'){
          if(obj.find('.sx-text').length==0){
            html+='<span class="pricebox"><input class="sx-text" type="text" name="prices" value="" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>';
            obj.append(html);
          }else{
            return false;
          }
        }else{
          obj.find('.pricebox').remove();
        }
        $('input[name="property_title"],input[name="prices"],.patentNumber input[type="text"],.applyNumber input[type="text"],#action_date,input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
          _this.addListeen();
        });
        _this.addListeen();
      },
      detprice:function(){
        var _this = this;
        $('.tradingModes i.det').unbind('click').on('click',function(){
          $(this).parent().next('.pricesModes').remove();
          $(this).parent().remove();
          $('#tradingModes').prev().text('交易方式：').removeClass('long-important');
          $('#tradingModes').parent().next().find('.important').text('转让价格：').removeClass('long-important');
          $('#tradingModes .select-list>ul>li').show();
          if($('.add-pricemodes').length==0){
            $('.edit-topinfobox>ul').append('<li class="add-pricemodes">添加交易方式</li>');
            _this.addprice();
          }
          _this.addListeen();
        })
      },
      addprice:function(){
        var _this = this;
        $('.add-pricemodes').unbind('click').on('click',function(){
          if($('.tradingModes').length==1){
            $('#tradingModes').prev().text('交易方式一：').addClass('long-important');
            $('#tradingModes').parent().next().find('.important').text('转让价格一：').addClass('long-important');
            var html = '';
            html += '<li class="tradingModes">\
                      <span class="important long-important">交易方式二：</span>\
                      <select id="tradingModes1" name="tradingModes1">\
                        <option value="no">请选择</option>\
                      </select>\
                      <i class="det"></i>\
                    </li>\
                    <li class="pricesModes">\
                      <span class="important long-important">转让价格二：</span>\
                      <select class="pricesModes1" id="pricesModes1" name="pricesModes1">\
                        <option value="yes">已有估价</option>\
                        <option value="no">面议</option>\
                      </select>\
                      <span class="pricebox"><input class="sx-text" type="text" name="prices" value="" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>\
                    </li>';
            $('.edit-topinfobox>ul').append(html);
            $(this).remove();
            // 获取交易方式
            _this.getTradingModes(undefined,undefined,'tradingModes1');
            // 转让价格切换
            $('#pricesModes1').selectlist({zIndex: 1,width: 92,height: 42,onChange:function(){
              var self = $('#pricesModes1').parent();
              var key = $('#pricesModes1 input[name="pricesModes1"]').val();
              _this.isPricesModes(key,self);
              _this.addListeen();
            }});
            _this.detprice();
            $('input[name="prices"]').bind('input propertychange',function() {
              _this.addListeen();
            });
          }
          _this.addListeen();
        })

      },
      // 监听数据
      addListeen:function(){
        var _this = this;
        var data = {};
        data.tech = _this.tech;
        var title = $('input[name="property_title"]').val(),
            industry = $('input[name="industry"]').val(),
            techType = $('input[name="techType"]').val(),
            maturity = $('input[name="maturitys"]').val();
        if(title!=''&&industry!='no'&&maturity!='no'&&industry!=undefined&&maturity!=undefined){
          data.title = title;
          data.industry = industry;
          data.techType = techType;
          data.maturity = maturity;
          // 是否专利
          if(techType==1){
            techType = $('input[name="techTypeChild"]').val();
            if(techType!='no'){
              data.techType = techType;
              var patentCountry = $('input[name="patentCountries"]').val(),
                  patentStatus = $('input[name="patentStatus"]').val();
              if(patentCountry!='no'&&patentStatus!='no'){
                data.patentCountry = patentCountry;
                data.patentStatus = patentStatus;
                // 已授权
                if(patentStatus==1){
                  var patentNumber = $('.patentNumber input[type="text"]').val(),
                      year = $('#action_date').attr('data-year');
                  if(patentNumber!=''&&year!=''){
                    var date=' '+ year + ' 00:00:00';
                        date = new Date(Date.parse(date.replace(/-/g, "/")));
                        grantingDate = date.getTime()/1000;
                    data.patentNumber = patentNumber;
                    data.grantingDate = grantingDate;
                    _this.addListeenTwo(data);
                  }else{
                    $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                  }
                }else{
                  // 未授权
                  var applyNumber = $('.applyNumber input[type="text"]').val();
                  if(applyNumber!=''){
                    data.applyNumber = applyNumber;
                    _this.addListeenTwo(data);
                  }else{
                    $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                  }
                }
              }else{
                $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
              }
            }else{
              $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
            }
          }else{
            data.techType = '200';
            var regionCode = $('input[name="prov"]').val();
            if(regionCode!='no'&&regionCode!=undefined){
              regionCode = $('input[name="city"]').val();
              if(regionCode!='no'&&regionCode!=undefined){
                data.regionCode = regionCode;
                _this.addListeenTwo(data);
              }else{
                  $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
              }
            }else{
                $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
            }
          }
        }else{
          $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
        }
      },
      addListeenTwo:function(data){
        var _this = this,
            isBidding = $('input[name="isBidding"]').val();
        if(isBidding!='no'){
            data.isBidding = isBidding=='true'?1:0;
          if(isBidding=='false'){
            // 长期转让
            if($('.tradingModes').length==1){
              var tradingMode1 = $('input[name="tradingModes"]').val();
              if(tradingMode1!='no'){
                data.tradingMode1 = tradingMode1;
                delete data.tradingMode2;
                delete data.isMarkedPrice2;
                delete data.price2;
                var isMarkedPrice1 = $('input[name="pricesModes"]').val()=='yes'?true:false;
                data.isMarkedPrice1 = isMarkedPrice1;
                // 一是否估价
                if(isMarkedPrice1==true){
                  var price1 = $('#pricesModes').next('span').find('input[name="prices"]').val();
                  if(price1!=''){
                    data.price1 = price1;
                    $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                    _this.submitProperty(data);
                  }
                  else{
                    $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                  }
                }
                else{
                  delete data.price1;
                  $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                  _this.submitProperty(data);
                }
              }
              else{
                $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
              }
            }
            else{
              var tradingMode1 = $('input[name="tradingModes"]').val(),
                  tradingMode2 = $('input[name="tradingModes1"]').val();
              if(tradingMode1!='no'&&tradingMode2!='no'&&tradingMode2!=undefined){
                data.tradingMode1 = tradingMode1;
                data.tradingMode2 = tradingMode2;
                var isMarkedPrice1 = $('input[name="pricesModes"]').val()=='yes'?true:false,
                    isMarkedPrice2 = $('input[name="pricesModes1"]').val()=='yes'?true:false;
                  // 第一个交易方式是否有价
                if(isMarkedPrice1==true){
                  data.isMarkedPrice1 = isMarkedPrice1;
                  // 第二个交易方式是否有价
                  if(isMarkedPrice2==true){
                    data.isMarkedPrice2 = isMarkedPrice2;
                    var price1 = $('#pricesModes').next('span').find('input[name="prices"]').val(),
                        price2 = $('#pricesModes1').next('span').find('input[name="prices"]').val();
                    if(price1!=''&&price2!=''){
                      data.price1 = price1;
                      data.price2 = price2;
                      $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                      _this.submitProperty(data);
                    }
                    else{
                      $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                    }
                  }
                  else{
                    data.isMarkedPrice2 = isMarkedPrice2;
                    delete data.price2;
                    var price1 = $('#pricesModes').next('span').find('input[name="prices"]').val();
                    if(price1!=''){
                      data.price1 = price1;
                      $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                      _this.submitProperty(data);
                    }
                  }
                }
                else{
                  data.isMarkedPrice1 = isMarkedPrice1;
                  delete data.price1;
                  if(isMarkedPrice2==true){
                    data.isMarkedPrice2 = isMarkedPrice2;
                    var price2 = $('#pricesModes1').next('span').find('input[name="prices"]').val();
                    if(price2!=''){
                      data.price2 = price2;
                      $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                      _this.submitProperty(data);
                    }
                    else{
                      $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                    }
                  }else{
                    data.isMarkedPrice2 = isMarkedPrice2;
                    delete data.price2;
                    $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                    _this.submitProperty(data);
                  }
                }
              }
              else{
                $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
              }
            }
          }
          else{
            // 竞价转让
            var tradingMode = $('input[name="tradingModes"]').val();
            if(tradingMode!='no'&&tradingMode!=undefined){
              data.tradingMode = tradingMode;
              var startPrice = $('input[name="startPrice"]').val(),
                  bidRange = $('input[name="bidRange"]').val();
              if(startPrice!=''&&bidRange!=''){
                data.startPrice = startPrice*10000;
                data.bidRange = bidRange*10000;
                $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                _this.submitProperty(data);
              }
              else{
                $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
              }
            }
            else{
              $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
            }
          }
        }else{
          $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
        }
      },
      submitProperty:function(data){
        var _this=this;
        $('.edit-topinfobox .btn-submit').unbind('click').on('click',function(event){
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/tech/changeTech',
            data:data,
            dataType: 'json',
            
            success:function(res){
              $('.btn-edit').show();
              $('.longterm-detaile-topinfo .spinner').show().siblings().remove();
              var tech = _this.tech;
              _this.getTechData(tech,'change');
            }
          })
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
              var txt = "请不要泄露核心技术的前提下对于项目进行多方位介绍，不超过500字。\n技术介绍，创新点，详细用途，预期收益等信息";
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
              var txt = "请不要泄露核心技术的前提下对于项目进行多方位介绍，不超过500字。\n技术介绍，创新点，详细用途，预期收益等信息";
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
                  var txt = "请不要泄露核心技术的前提下对于项目进行多方位介绍，不超过500字。\n技术介绍，创新点，详细用途，预期收益等信息";
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
      subProjectDec:function(){
        var _this = this;
        $("#longterm_dec .btn-submit").unbind('click').on('click', function(event) {
          var tech = _this.tech,
              description = $('.txt-project-dec').val();
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/tech/changeDescription',
            data:{'tech':tech,'description':description},
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
                      console.log(err,errTip);
                    }
			            }
			        }
			    });
      },
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
            url:urlPath + '/web/userCenter/tech/changePictures',
            data:{'keys':keys,'tech':_this.tech},
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
      jingjia:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/biddings?tech='+_this.tech,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            var html = '';
            html+='<table><tbody>\
                    <tr>\
                        <td>公司</td>\
                        <td>竞价时间</td>\
                        <td>报价</td>\
                    </tr>';
            if(res.data.rows.length!=0){
              $.each(res.data.rows,function(index, item) {
                var unixTime = new Date(item.createTime),
                    month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                    date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                    createTime = unixTime.getFullYear()+'.'+month+'.'+date;
                html +='<tr>\
                          <td>'+ item.nickname +'</td>\
                          <td>'+ createTime +'</td>\
                          <td>不公开</td>\
                      </tr>';
              });
              html +='</tbody></table>';
              $('#longterm_user').append(html);
            }else{
              html +='<tr>\
                        <td>暂无</td>\
                        <td>暂无</td>\
                        <td>不公开</td>\
                    </tr></tbody></table>';
              $('#longterm_user').append(html);
            }
          }
        })
      },
      // 获取Url参数
      getQueryString:function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
     }
     projectDetaile.init();
   })
})
