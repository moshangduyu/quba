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
    var projectDetaile = {
      // 初始化及函数调用
      init:function(){
        var _this = this;
        // 获取项目Id
        _this.project = _this.getQueryString('project');
        _this.getStatus();
      },
      bannerProgress:0,
      infoProgress:0,
      decProgress:0,
      picProgress:0,
      teamProgress:0,
      actionProgress:0,
      planProgress:0,
      plantxtProgress:0,
      finaProgress:0,
      status:[],
      txt:[],
      // 获取项目状态
			getStatus:function(){
				var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/project/status',
					dataType: 'json',
					
					success:function(res){
						var status = [],
								txt = [];
						$.each(res.data, function(index, item) {
							_this.status.push(item.key);
							_this.txt.push(item.value);
						});
            // 加载数据
            _this.getPorjectData(_this.project);
					}
				})
			},
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
      // 项目完成度
      progress:0,
      // 项目编号
      project:null,
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
            $('#prov').append(html).selectlist({
              zIndex: 9,
              width: 102,
              height: 42,
              onChange:function(){
                var code = $('#prov input[name="prov"]').val();
                $('#city').remove();
                var dom = '<select id="city" class="city" name="city">\
              							<option value ="no">请选择</option>\
              						</select>';
                $('#citybox').append(dom);
                _this.getCity(code);
              }
            });
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
              // 点击编辑按钮时判断基本信息是否可以提交
              if($('input[name="topinfo_title"],input[name="topinfo_brief"]').val()!=''&&$('input[name="industry"]').val()!='no'){
                var city = $('input[name="city"]').val();
                if(city!='no'&&city!=undefined){
                  $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                  _this.subTopInfo();
                }
              }
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
            $('#city').append(html).selectlist({
              zIndex: 9,
              width: 102,
              height: 42,
              onChange:function(){
                if($('input[name="topinfo_title"],input[name="topinfo_brief"]').val()!=''&&$('input[name="industry"]').val()!='no'&&$('input[name="city"]').val()!='no'&&$('input[name="city"]').val()!=undefined){
                  $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                  _this.subTopInfo();
                }else{
                  $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
              }
            });
            if(key!=undefined){
              $('input[name="city"]').val(code);
              $('#city .select-button').val(key);
            }
            // 点击编辑按钮时判断基本信息是否可以提交
            if($('input[name="topinfo_title"],input[name="topinfo_brief"]').val()!=''&&$('input[name="industry"]').val()!='no'){
              var city = $('input[name="city"]').val();
              if(city!='no'&&city!=undefined){
                $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                _this.subTopInfo();
              }
            }
          }
        })
      },
      // ajax 获取行业信息
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
            $('#industry').append(html).selectlist({
              zIndex: 10,
              width: 214,
              height: 42,
              onChange:function(){
                if($('input[name="topinfo_title"],input[name="topinfo_brief"]').val()!=''&&$('input[name="industry"]').val()!='no'&&$('input[name="city"]').val()!='no'&&$('input[name="city"]').val()!=undefined){
                  $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
                  _this.subTopInfo();
                }else{
                  $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
              }
            });
            $('input[name="industry"]').val(key);
            $('#industry .select-button').val(name);
          }
        })
      },
      /* 加载数据
       * @type:Number 局部更新所需要的编号
         0：顶部右侧基本信息
         1: 项目图片
         2: 创始团队
         3: 发展动态
         4: 商业方案
         5: 融资详情
      */
      detaileData:null,
      getPorjectData:function(project,type){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/project/info?project='+project,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            _this.detaileData=res.data;
            // 加载全部数据
            if(type==undefined){
              _this.getDetaile(res.data);
              // 获取项目介绍
              _this.getProjectDec(res.data);
              // 获取项目图片
              _this.getPic(res.data);
              // 获取创始团队
              _this.getTeam(res.data);
              // 获取发展动态
              _this.getAction(res.data);
              // 获取商业方案
              _this.getPlan(res.data);
              // 获取融资详情
              _this.getFinancing(res.data);
              // 选项卡切换
              _this.tab();
              // 设置权限
              _this.setStatus(res.data);
              $('.right-fixedbox,.detaile-tab,.detaile-tablist').show();
              $('.project-detaile-content>.spinner').hide();
              $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress + _this.teamProgress + _this.actionProgress + _this.planProgress + _this.plantxtProgress + _this.finaProgress)+'%');
            }else{
              switch (type) {
                case 0: _this.getDetaile(res.data); break;
                case 1: _this.getPic(res.data); break;
                case 2: _this.getTeam(res.data); break;
                case 3: _this.getAction(res.data); break;
                case 4: _this.getPlan(res.data); break;
                case 5: _this.getFinancing(res.data); break;
                case 6: _this.setStatus(res.data); break;
              }
              _this.setStatus(res.data);
              $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress + _this.teamProgress + _this.actionProgress + _this.planProgress + _this.plantxtProgress + _this.finaProgress)+'%');
            }
          }
        })
      },
      // 设置权限
      setStatus:function(data){
        var _this = this;
        $.each(_this.status,function(index, el) {
          if(data.status == el && data.status != '0' && data.status != '5'){
            $('.right-fixedbox .progress a').css({'color':'#979797','background':'#e8e8e8','cursor':'default'}).text(_this.txt[index]);
          }else{
            $('.right-fixedbox .progress a').css({'cursor':'pointer'});
            _this.subStatus();
          }
        });
        switch(data.status){
          case 1:
            $('.edit-topinfo .btn-edit,.project-financing .btn-edit, .project-plan .btn-edit,#upload_plan .del-plan').remove();
            break;
          case 2:
            $('.edit-topinfo .btn-edit,.project-financing .btn-edit, .project-plan .btn-edit,#upload_plan .del-plan').remove();
            break;
          case 3:
            $('.btn-edit,.btn-add,.btn-delet,.del-plan').remove();
            break;
          case 4:
            $('.btn-edit,.btn-add,.btn-delet,.del-plan').remove();
            break;
        }
      },
      // 申请募资
      subStatus:function(){
        var _this = this;
        $('.right-fixedbox .progress>a').unbind('click').on('click',function(e){
          var  html = '';
          if(_this.bannerProgress!=0 && _this.decProgress!=0 && _this.picProgress!=0 && _this.teamProgress!=0 && _this.actionProgress!=0 && _this.planProgress!=0 && _this.finaProgress!=0){
            $.ajax({
              type:"post",
              url:urlPath + '/web/userCenter/project/financing/apply',
              data:{project:_this.project},
              dataType: 'json',
              
              success:function(res){
                console.log(res);
                _this.getPorjectData(_this.project,6);
              }
            })
          }else{
            html +='请添加';
            var arr = [];
            var arrTxt = [];
            arr.push(_this.bannerProgress,_this.decProgress,_this.picProgress,_this.teamProgress,_this.actionProgress,_this.planProgress,_this.finaProgress);
            arrTxt.push('封面','项目介绍','产品图片','创始团队信息','发展动态','商业方案','融资详情');
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
      /*加载及编辑顶部数据
       * @getDetaile:加载项目顶部基本数据
       * @bannerUpload：上传项目封面
       * @editTopInfo：编辑顶部基本数据
       * @topChekVal： 监听头部信息
       * @subTopInfo：提交顶部基本资料修改
       * @projectLogoUpload   项目Logo上传
      */
      getDetaile:function(data){
        var _this = this;
        // 获取详情基本资料
        var DetaileCard = '';
        DetaileCard+='<div id="picContainer">';
        if(data.cover==undefined){
          DetaileCard+='<div class="img-head"><img src="images/common/banner_project.png" alt=""></div>';
        }else{
          _this.bannerProgress = 5;
          DetaileCard+='<div class="img-head"><img src="'+ data.cover +'?imageMogr2/thumbnail/!850x380r/gravity/Center/crop/850x380" alt=""></div>';
        }
        DetaileCard+='<div class="file-btnbox">\
        								<button class="btn-txt" id="addTopPic" style="position: relative; z-index: 1;">点击上传封面</button>\
        								<p class="file-txt">建议尺寸850*380px</p>\
          						</div>\
                      <div class="hidden">\
                        <input type="hidden" id="domain" value="http://om8bdr48p.bkt.clouddn.com/">\
                        <input type="hidden" id="uptoken_url" value="/web/resource/token?platform=web&bucket=hiipark-project&keySize=2">\
                        <input type="hidden" id="keys_url" value="/web/resource/keys?platform=web&bucket=hiipark-project&keySize=2">\
                      </div>\
                    </div>\
                    <div class="fl detaile-topinfobox edit-topinfo">\
                      <div class="detaile-topinfobox-head">\
                        <img src="'+ data.logo +'" alt="">\
                        <h4>'+ data.title +'<i class="btn-edit"></i></h4>\
                        <p>'+ data.brief +'</p>\
                      </div>\
                      <ul>\
                        <li>行业领域：<span>'+ data.industryName +'</span></li>';
        _this.infoProgress = 10;
        if(data.regionCode==undefined){
          DetaileCard+='<li>所属地区：<span class="nodata">未填写</span></li>';
        }else{
          DetaileCard+='<li>所属地区：<span>'+ data.regionFullName +'</span></li>';
        }
        if(data.highlight==undefined){
          DetaileCard+='<li>产品数据：<span class="nodata">未填写</span></li>';
        }else{
          DetaileCard+='<li>产品数据：<span>'+ data.highlight +'</span></li>';
        }
        if(data.teamPoint==undefined){
          DetaileCard+='<li>团队特色：<span class="nodata">未填写</span></li>';
        }else{
          DetaileCard+='<li>团队特色：<span>'+ data.teamPoint +'</span></li>';
        }
        DetaileCard+='</ul></div>';

        $('.project-detaile-topinfo .spinner').hide();
        $('.project-detaile-topinfo').append(DetaileCard);

        _this.bannerUpload();
        // 切换编辑基本资料
        _this.editTopInfo(data);
      },
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
                      url:urlPath + '/web/userCenter/project/changeCover',
                      dataType: 'json',
                      data:{project:_this.project,coverKey:res.key},
                      
                      success:function(res){
                        console.log(res);
                        _this.bannerProgress = 5;
                        $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress + _this.teamProgress + _this.actionProgress + _this.planProgress + _this.plantxtProgress + _this.finaProgress)+'%');
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
      editTopInfo:function(data){
        var _this = this;
        $('.edit-topinfo i.btn-edit').unbind('click').on('click',function(){
          var html = '';
          // 添加编辑框
          html+='<div class="fl edit-box edit-topinfobox">\
            <ul>\
              <li>\
                <div id="logo_container">\
                  <div class="img-head"><img src="'+ data.logo +'" alt=""></div>\
                  <div class="file-btnbox">\
                      <button class="btn-txt" id="addTopLogo">选择文件</button>\
                      <p class="file-txt">支持JPG、PNG、GIF ,大小不超过5M</p>\
                  </div>\
                </div>\
              </li>\
              <li>\
                <span class="important">项目名称：</span>\
                <input type="text" name="topinfo_title" maxlength="20"  value="'+ data.title +'" placeholder="请填写项目名称或核心产品">\
              </li>\
              <li>\
                <span class="important">项目亮点：</span>\
                <input type="text" name="topinfo_brief" maxlength="15" value="'+ data.brief +'" placeholder="如：生物医药行业探索者">\
              </li>\
              <li>\
                <span class="important">行业领域：</span>\
                <select id="industry" name="industry"><option value ="no">请选择</option></select>\
              </li>\
              <li>\
                <span class="important">所属地区：</span>\
                <div id="citybox">\
                  <i class="ic-down"></i>\
                  <select id="prov" class="prov"><option value="no">请选择</option></select>\
                  <select id="city" class="city"><option value="no">请选择</option></select>\
                </div>\
              </li>\
              <li>\
                <span>产品数据：</span>';
              if(data.highlight!=undefined){
                html+='<input type="text" name="topinfo_highlight" maxlength="15" value="'+ data.highlight +'" placeholder="如：细分行业排名前三位者">';
              }else{
                html+='<input type="text" name="topinfo_highlight" maxlength="15" value="" placeholder="如：细分行业排名前三位者">';
              }
              html+='</li><li><span>团队特色：</span>';
              if(data.teamPoint!=undefined){
                html+='<input type="text" name="topinfo_teamPoint" maxlength="15" value="'+ data.teamPoint +'" placeholder="如： 10年以上生物研发经验">';
              }else{
                html+='<input type="text" name="topinfo_teamPoint" maxlength="15" value="" placeholder="如： 10年以上生物研发经验">';
              }

              html+='</li></ul>\
            <div>\
              <button class="btn-submit" disabled="disabled">保存</button>\
              <button class="btn-cancel">取消</button>\
            </div>\
          </div>';
          $('.project-detaile-topinfo').append(html);
          // Logo上传
          _this.projectLogoUpload();
          // 加载行业领域
          _this.getIndustrys(data.industry,data.industryName);
          // 判断有无所在区域
          if(data.regionFullName!=undefined){
            var citys = data.regionFullName;
            var keys =  data.regionPath;
            // 有值
            _this.getProv(citys,keys);
          }else{
            // 无值
            _this.getProv();
          }
          $('.edit-topinfo,.btn-edit').hide();
          $('.edit-topinfobox').show();
          // 监听基本信息是否可以提交
          _this.topChekVal();
          // 取消编辑基本资料
          $('.edit-topinfobox .btn-cancel').unbind('click').on('click',function(){
            $('.edit-topinfo,.btn-edit').show();
            $('.edit-topinfobox').remove();
          })
        })
      },
      topChekVal:function(){
        var _this = this;
        $('input[name="topinfo_title"],input[name="topinfo_brief"]').bind('input propertychange',function() {
            if($(this).val()!=''&&$('input[name="industry"]').val()!='no'&&$('input[name="city"]').val()!='no'&&$('input[name="city"]').val()!=undefined){
              $('.edit-topinfobox .btn-submit').removeAttr('disabled').css('background','#00799f');
              _this.subTopInfo();
            }else{
              $('.edit-topinfobox .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
            }
        });
      },
      subTopInfo:function(){
        var _this = this;
        // 提交编辑基本资料
        $('.edit-topinfobox .btn-submit').unbind('click').on('click',function(event){
          var project = _this.project,
              title = $('input[name="topinfo_title"]').val(),
              logo = $('#logo_container .img-head img').attr('src'),
              brief = $('input[name="topinfo_brief"]').val(),
              highlight = $('input[name="topinfo_highlight"]').val()==''?undefined:$('input[name="topinfo_highlight"]').val(),
              teamPoint = $('input[name="topinfo_teamPoint"]').val()==''?undefined:$('input[name="topinfo_teamPoint"]').val(),
              industry = $('input[name="industry"]').val(),
              regionCode = $('input[name="city"]').val();
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/changeProject',
            data:{'project':project,'title':title,'logo':logo,'brief':brief,'highlight':highlight,'teamPoint':teamPoint,'industry':industry,'regionCode':regionCode},
            dataType: 'json',
            
            success:function(res){
              $('.btn-edit').show();
              $('.project-detaile-topinfo .spinner').show().siblings().remove();
              _this.getPorjectData(_this.project,0);
            }
          })
          event.preventDefault();
        })
      },
      projectLogoUpload:function(){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: 'addTopLogo',	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: 'logo_container',	 //上传区域DOM ID，默认是browser_button的父元素
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
                    if($("#logo_container .img-head .new-img").length!=0){
                      $("#logo_container .img-head .new-img").remove();
                    }
                    plupload.each(files, function(file) {
                      var html = '<div class="new-img" id="'+ file.id +'"><p class="progress"></p></div>';
                      $('#logo_container .img-head').append(html);
                    })
			            },
			            'BeforeUpload': function(up, file) {
                    // 每个文件上传前，处理相关的事情
			            },
			            'UploadProgress': function(up, file) {
			                // 每个文件上传时，处理相关的事情
			                $('#'+file.id+' .progress').show().text(file.percent + '%');//控制进度条
                      $('#addTopLogo').attr('disabled','disabled').text('正在上传');
			            },
			            'UploadComplete': function(up,files) {
			                //队列文件处理完毕后，处理相关的事情
			            },
			            'FileUploaded': function(up, file, info) {
			                // 每个文件上传成功后，处理相关的事情
			               	var domain = up.getOption('domain');
			               	var res = JSON.parse(info);
			               	var sourceLink =  domain + res.key; //获取上传成功后的文件的Url
			               	var del = $('<img data-key="'+ res.key +'" src="'+ sourceLink +'?imageView2/1/w/60/h/60" />');
                      $('#logo_container .img-head>img').remove();
			               	$('#'+file.id).addClass('up-success').append(del).find('.progress').hide();
                      $('#addTopLogo').removeAttr('disabled').text('选择文件');
                      $('#logo_container .file-txt').text('已上传项目Logo');
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
      /*加载及编辑项目介绍
       * @getProjectDec:加载项目介绍
       * @editProjectDec：编辑项目介绍
       * @subProjectDec： 提交项目介绍
      */
      getProjectDec:function(data){
        var _this = this;
        var html = '';

        html+='<h2>项目介绍<i class="btn-edit"></i></h2>';
        if(data.description==undefined){
          html+='<span class="no-data">暂无介绍</span>';
        }else{
          html+='<p>'+ data.description +'</p>';
          _this.decProgress =  10;
        }
        html+='<div class="edit-box edit-project-dec">\
            <span class="label-title">项目介绍：</span>\
            <textarea class="txt-project-dec"></textarea>\
            <p class="edit-wordtext">你还可以输入<span>1000</span>字</p>\
            <div>\
              <button class="btn-submit" disabled="disabled">保存</button>\
              <span class="btn-cancel">取消</span>\
            </div>\
          </div>';
        $('#project_dec').append(html);
        // 获取项目介绍
        _this.editProjectDec(data.description);
      },
      editProjectDec:function(description){
        var _this = this;
        $('#project_dec .btn-edit').unbind().on('click',function(){
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
              var txt = "请用少于1000字从产品独特功能、核心资源、团队优势、已经缺德的一些成就等方面，例如\n1、互联网+科技交易\n2、由衡阳政府大力扶持\n3、主要团队来自硅谷、互联网+生物医疗人才\n4、细分行业领军企业";
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
              $('#project_dec .btn-submit').removeAttr('disabled').css('background','#00799f');
              _this.subProjectDec();
            }
            textArea.focus(function() {
              var focusTxt = textArea.val();
              var txt = "请用少于1000字从产品独特功能、核心资源、团队优势、已经缺德的一些成就等方面，例如\n1、互联网+科技交易\n2、由衡阳政府大力扶持\n3、主要团队来自硅谷、互联网+生物医疗人才\n4、细分行业领军企业";
              if(focusTxt==txt){
                $(this).val('').css('color', '#272727');
              }
            });
		        textArea.on('input propertychange', function () {
		            $('.edit-wordtext span').text(max - $(this).val().length);
                if($(this).val()!=''){
                  $('#project_dec .btn-submit').removeAttr('disabled').css('background','#00799f');
                  _this.subProjectDec();
                }else{
                  var txt = "请用少于1000字从产品独特功能、核心资源、团队优势、已经缺德的一些成就等方面，例如\n1、互联网+科技交易\n2、由衡阳政府大力扶持\n3、主要团队来自硅谷、互联网+生物医疗人才\n4、细分行业领军企业";
                  $('.edit-project-dec').find('.edit-wordtext span').text('1000');
                  $(this).val(txt).css('color','#9f9f9f').blur();
                  $('#project_dec .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
		        });
	       	}
        })
        $('#project_dec .btn-cancel').on('click',function(){
          $('.btn-edit').show();
          $('.edit-project-dec').hide().siblings('span,p').show();
          $('.edit-project-dec').find('.edit-wordtext span').text('1000');
        })
      },
      subProjectDec:function(){
        var _this = this;
        $("#project_dec .btn-submit").unbind('click').on('click', function(event) {
          var project = _this.project,
              description = $('.txt-project-dec').val();
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/changeDescription',
            data:{'project':project,'description':description},
            dataType: 'json',
            
            success:function(res){
              if($('#project_dec>span.no-data').length==0){
                $('#project_dec>p').text(description).show();
              }else{
                $('#project_dec>span.no-data').remove();
                $('#project_dec').append('<p>'+ description + '</p>');
              }
              $('.edit-project-dec').hide();
              $('.btn-edit').show();
              _this.editProjectDec(description);
              $('.edit-project-dec').find('.edit-wordtext span').text('1000');
              _this.decProgress = 10;
              $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress + _this.teamProgress + _this.actionProgress + _this.planProgress + _this.plantxtProgress + _this.finaProgress)+'%');
            }
          })
          event.preventDefault();
        });
      },
      /*
       * @getPic: 加载图片
       * @edtiPic: 编辑图片
       * @addPicBox: 增加编辑图片框
       * @delPic: 删除图片
       * @projectPicUpload：项目图片上传
       * @subProjectPic：提交项目图片
      */
      getPic:function(data){
        var _this = this;
        var html = '';
        if(data.pictures.length==0){
          html+='<span class="no-data">暂无介绍</span>';
          $('#project_pic').append(html);
        }else{
          _this.picProgress =  15;
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
          $('#project_pic').append(html);
          $('#project_pic .spinner').hide();
          _this.slider();
        }
        // 新增图片
        _this.editPic(data.pictures);
      },
      editPic:function(pics){
        var _this = this;
        $('#project_pic .btn-edit').unbind('click').on('click',function(event){
          $('.btn-edit,.btn-delet,.btn-add').hide();
          if(pics==undefined){
            _this.addPicBox(pics);
          }else{
            _this.addPicBox(pics);
          }
          $('#project_pic .edit-project-pic').show().siblings('.no-data,#pic_slider').hide();
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
        $('#project_pic').append(html);
        // 监听
        $('#pic_container>ul').bind('DOMNodeInserted',function(e){
          var obj = $(e.target);
          var Len = $('#pic_container>ul>li.up-success').length;
          if(Len!=0){
            $('#project_pic .btn-submit').removeAttr('disabled').css('background','#00799f');
          }else{
            $('#project_pic .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
          }
        })
        _this.projectPicUpload();
        _this.delPic();
        // 取消增加项目图片
        $('.edit-project-pic .btn-cancel').unbind('click').on('click',function(){
            $('.btn-edit,.btn-delet,.btn-add').show();
            $('#project_pic').find('.edit-project-pic').remove();
            $('#project_pic .no-data,#project_pic #pic_slider').show();
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
                        plupload.each(files, function(file) {
                          $('#pic_container .filepic-btnbox').hide();
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
        $('#project_pic .btn-submit').unbind('click').on('click',function(event){
          var keys = [];
          $('#pic_container>ul>li.up-success>img').each(function(index, el) {
            var key = $(this).attr('data-key');
            keys.push(key);
          });
          console.log(keys);
          var data = {};
          data.keys = keys;
          data.project = _this.project;
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/changePictures',
            data:data,
            dataType: 'json',
            
            success:function(res){
              $('#project_pic .edit-project-pic,#pic_slider').remove();
              $('.btn-edit,.btn-delet,.btn-add').show();
              $('#project_pic .spinner').show().remove();
              _this.getPorjectData(_this.project,1);
            }
          })
          event.preventDefault();
        })
      },
      /*加载及编辑团队信息
       * @getTeam:加载团队信息
       * @getTeamRoles：加载人员角色
       * @addEditBox： 增加团队信息编辑框
       * @addTeam： 增加创始团队
       * @editTeam：编辑团队成员
       * @delTeam：删除团队成员
       * @addEventTeam: 监听填写信息
       * @subTeam: 提交团队数据
      */
      getTeam:function(data){
        var _this = this;
        var html = '';
        html+='<h2>创始团队</h2>';
        if(data.teams.length==0){
          html+='<span class="no-data">暂无介绍</span>';
        }else{
          _this.teamProgress = 15;
          html+='<ul>';
          $.each(data.teams,function(index,item){
            html+='<li data-teamId="'+ item.id +'">\
              <span data-roleType="'+ item.roleType +'">'+ item.roleName +'</span>\
              <h2>'+ item.name +'丨'+ item.title +'<i class="btn-delet"></i><i class="btn-edit"></i></h2>\
              <p>'+ item.brief +'</p>\
            </li>';
          })
          html+='</ul>';
        }
        html+='<div class="btn-add"><i class="icon-add"></i>添加创始团队</div>';
        $('#project_team').append(html).find('.spinner').hide();
        // 增加成员
        _this.addTeam();
        // 删除成员
       _this.delTeam();
        // 编辑成员
       _this.editTeam();
      },
      getTeamRoles:function(type,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/project/team/roles',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#roles').append(html).selectlist({
              zIndex: 9,
              width: 157,
              height: 42,
              onChange:function(){
                if($('input[name="team_name"]').val()!='' && $('input[name="team_title"]').val()!=''&&$('input[name="roles"]').val()!='no'&&$('.txt-project-team').val()!=''){
                  $('#project_team .btn-submit').removeAttr('disabled').css('background','#00799f');
                }else{
                  $('#project_team .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
              }
            });
            if(type!=undefined&&name!=undefined){
              $('#roles input[name="roles"]').val(type);
              $('#roles .select-button').val(name);
            }
          }
        })
      },
      addEditBox:function(obj,data){
        var _this = this;
        var html = '';
        if(data==undefined){
          html+=  '<div class="edit-box edit-project-team">\
                    <div style="margin-bottom: 30px;">\
                      <span class="important label-title">姓名：</span>\
                      <input type="text" name="team_name" value="" placeholder="">\
                      <span class="important label-title">职务：</span>\
                      <select id="roles" class="project-team-post" style="width: 155px;">\
                        <option value="no">请选择</option>\
                      </select>\
                      <input style="width: 234px;" type="text" name="team_title" value="" placeholder="如：CEO/市场/产品/技术" style="text-indent:10px;">\
                    </div>\
                    <div>\
                      <span class="important label-title">简介：</span>\
                      <textarea class="txt-project-team" placeholder=""></textarea>\
                      <p class="edit-wordtext">你还可以输入<span data-max="100">100</span>字</p>\
                    </div>\
                    <div>\
                      <button class="btn-submit" disabled="disabled">保存</button>\
                      <span class="btn-cancel">取消</span>\
                    </div>\
                  </div>';
          $(obj).append(html);
          // 获取人员角色
          _this.getTeamRoles();
        }else{
          html+=  '<div class="edit-box edit-project-team">\
                    <div style="margin-bottom: 30px;">\
                      <span class="important label-title">姓名：</span>\
                      <input type="text" name="team_name" value="'+ data.name +'" placeholder="">\
                      <span class="important label-title">职务：</span>\
                      <select id="roles" class="project-team-post" style="width: 155px;">\
                        <option value="no">请选择</option>\
                      </select>\
                      <input style="width: 234px;" type="text" name="team_title" value="'+ data.title +'" placeholder="如：CEO/市场/产品/技术" style="text-indent:10px;">\
                    </div>\
                    <div>\
                      <span class="important label-title">简介：</span>\
                      <textarea class="txt-project-team" placeholder="">'+ data.brief +'</textarea>\
                      <p class="edit-wordtext">你还可以输入<span data-max="100">'+ (100-data.brief.length) +'</span>字</p>\
                    </div>\
                    <div>\
                      <button class="btn-submit" disabled="disabled">保存</button>\
                      <span class="btn-cancel">取消</span>\
                    </div>\
                  </div>';
          $(obj).append(html);
          // 获取人员角色
          _this.getTeamRoles(data.roleType,data.roleName);
        }
        // 取消增加创始团队
        $('.edit-project-team .btn-cancel').unbind('click').on('click',function(){
          // 判断当前状态是增加还是编辑
          if(obj.attr('id')=='project_team'){
            $('.btn-edit,.btn-delet,.btn-add').show();
            obj.find('.edit-project-team').remove().siblings('.btn-add,.no-data').show();
          }else{
            $('.btn-edit,.btn-delet,.btn-add').show();
            obj.css('height','auto');
            obj.find('.edit-project-team').remove();
            obj.children().show();
          }
        })
      },
      addTeam:function(){
        var _this = this;
        $('#project_team .btn-add').unbind('click').on('click',function(event){
          $('.btn-edit,.btn-delet,.btn-add').hide();
          _this.addEditBox($('#project_team'));
          $('#project_team .edit-project-team').show().siblings('.btn-add,.no-data').hide();
          _this.addEventTeam();
          var url = 'userCenter/project/addTeam';
          _this.subTeam(url);
          event.preventDefault();
        })
      },
      delTeam:function(){
        $('#project_team .btn-delet').unbind('click').on('click', function(event) {
          var item = $(this).parents('li:eq(0)'),
              id = $(this).parents('li:eq(0)').attr('data-teamId');
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/removeTeam',
            data:{'team':id},
            dataType: 'json',
            
            success:function(res){
              item.remove();
              if($('#project_team>ul>li').length==0){
                $('#project_team>h2').after('<span class="no-data">暂无介绍</span>');
              }
            }
          })
          event.preventDefault();
        });
      },
      editTeam:function(){
        _this = this;
        $('#project_team .btn-edit').unbind('click').on('click', function(event) {
          var item = $(this).parents('li:eq(0)'),
              id = $(this).parents('li:eq(0)').attr('data-teamId'),
              roleType = item.find('span').attr('data-roleType'),
              roleName = item.find('span').text(),
              str = item.find('h2').text(),
              brief = item.find('p').text(),
              arr = str.split('丨'),
              name = arr[0],
              title = arr[1];
          var data = {
            id:id,
            roleType:roleType,
            roleName:roleName,
            title:title,
            brief:brief,
            name:name
          };
          _this.addEditBox(item,data);
          _this.addEventTeam();
          var url = 'userCenter/project/changeTeam';
          _this.subTeam(url,item.attr('data-teamId'));
          $('#project_team .btn-submit').removeAttr('disabled').css('background','#00799f');
          item.css('height','392px').find('.edit-project-team').css({'width':'790px','position':'absolute','left':'0','top':'0'}).show().siblings().hide();
          $('.btn-add').hide();
          event.preventDefault();
        });
      },
      addEventTeam:function(){
        // 输入姓名和职衔的监听
        $('input[name="team_name"],input[name="team_title"]').bind('input propertychange',function() {
            if($('input[name="team_name"]').val()!='' && $('input[name="team_title"]').val()!=''&&$('input[name="roles"]').val()!='no'&&$('.txt-project-team').val()!=''){
              $('#project_team .btn-submit').removeAttr('disabled').css('background','#00799f');
            }else{
              $('#project_team .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
            }
        });
        // 创始团队简介字数统计
        var textArea = $('#project_team').find("textarea");
          word = $('#project_team').find('.edit-wordtext span');
        statTeamNum(textArea,word);
        function statTeamNum(textArea,numItem) {
          var max = numItem.attr('data-max'),
              curLength;
          textArea[0].setAttribute("maxlength", max);
          curLength = textArea.val().length;
          textArea.on('input propertychange', function () {
              $('.edit-wordtext span').text(max - $(this).val().length);
              if($(this).val()!=''&&$('input[name="team_name"]').val()!='' && $('input[name="team_title"]').val()!=''&&$('input[name="roles"]').val()!='no'){
                $('#project_team .btn-submit').removeAttr('disabled').css('background','#00799f');
              }else{
                $('#project_team .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
              }
          })
        }
      },
      subTeam:function(url,teamId){
        var _this = this;
        $('#project_team .btn-submit').unbind('click').on('click',function(event){
          var name = $('input[name="team_name"]').val(),
              roleType=$('input[name="roles"]').val(),
              title=$('input[name="team_title"]').val(),
              brief=$('.txt-project-team').val(),
              team = teamId==undefined?undefined:teamId;
          $.ajax({
            type:"post",
            url:urlPath + '/web/'+url,
            data:{'name':name,'roleType':roleType,'title':title,'brief':brief,'team':team,'project':_this.project},
            dataType: 'json',
            
            success:function(res){
              $('.edit-project-team').hide();
              $('.btn-edit,.btn-delet,.btn-add,#project_team .btn-add').show();
              if($('#project_team .no-data').length!=0){
                $('#project_team .no-data').remove();
              }
              $('#project_team .spinner').show().siblings().remove();
              _this.getPorjectData(_this.project,2);
            }
          })
          event.preventDefault();
        })
      },
      /*加载及编辑发展动态
       * @getAction:加载发展动态
       * @addActionBox： 增加发展动态息编辑框
       * @addAction： 增加发展动态
       * @editAction：编辑发展动态
       * @delAction：删除发展动态
       * @addEventAction: 监听发展动态填写信息
       * @subAction: 提交发展动态数据
      */
      getAction:function(data){
        var _this = this;
        var html = '';
        html+='<h2>发展动态</h2>';
        if(data.events.length==0){
          html+='<span class="no-data">暂无介绍</span>';
        }else{
          _this.actionProgress = 15;
          html+='<ul>';
          $.each(data.events,function(index,item){
            var unixTime = new Date(item.eventTime*1000),
                month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                data = unixTime.getFullYear()+'-'+month+'-'+date;
            html +='<li data-eventId="'+ item.id +'">\
                      <span>'+ data +'</span>\
                      <h3>'+ item.description +'<i class="btn-delet"></i><i class="btn-edit"></i></h3>\
                      <p>&#12288;</p>\
                    </li>';
          })
          html+='</ul>';
        }
        html+='<div class="btn-add"><i class="icon-add"></i>添加发展动态</div>';
        $('#project_action').append(html).find('.spinner').hide();
        // 增加发展动态
        _this.addAction();
        // 编辑发展动态
        _this.editAction();
        // 删除发展动态
        _this.delAction();
      },
      addActionBox:function(obj,data){
        var _this = this;
        var html = '';
        if(data==undefined){
          html+=  '<div class="edit-box edit-project-action">\
                    <div style="margin-bottom: 30px;">\
                      <span class="important label-title">时间：</span>\
                      <input id="action_year" data-year="" class="laydate-icon">\
                    </div>\
                    <div>\
                      <span class="important label-title">内容：</span>\
                      <input id="action_content" type="text" maxlength="25" >\
                    </div>\
                    <div>\
                      <button class="btn-submit" disabled="disabled">保存</button>\
                      <span class="btn-cancel">取消</span>\
                    </div>\
                  </div>';
          $(obj).append(html);
          // 调用年份
          laydate.skin('molv');
          $('#action_year').on('click',function(event) {
            var self = $(this);
            laydate({
              elem: '#action_year', //目标元素
              format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
              istoday: false,
              isclear: false,
              event:'click', //响应事件。
              choose: function(datas){ //选择日期完毕的回调
                self.attr('data-year', datas);
                if($('#action_content').val()!='' && $('#action_year').attr('data-year')!=''&&$('input[name="action_month"]').val()!='no'){
                  $('#project_action .btn-submit').removeAttr('disabled').css('background','#00799f');
                }else{
                  $('#project_action .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
              }
            });
            event.preventDefault();
            /* Act on the event */
          });
        }else{
          html+=  '<div class="edit-box edit-project-action">\
                    <div style="margin-bottom: 30px;">\
                      <span class="important label-title">时间：</span>\
                      <input id="action_year" value="'+ data.timeStr +'" data-year="'+ data.timeStr +'" class="laydate-icon">\
                    </div>\
                    <div>\
                      <span class="important label-title">内容：</span>\
                      <input id="action_content" type="text" value="'+ data.description +'" maxlength="25" >\
                    </div>\
                    <div>\
                      <button class="btn-submit" disabled="disabled">保存</button>\
                      <span class="btn-cancel">取消</span>\
                    </div>\
                  </div>';
          $(obj).append(html);
          // 调用年份
          laydate.skin('molv');
          $('#action_year').on('click',function(event) {
            var self = $(this);
            laydate({
              elem: '#action_year', //目标元素
              format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
              istoday: false,
              isclear: false,
              event:'click', //响应事件。
              choose: function(datas){ //选择日期完毕的回调
                self.attr('data-year', datas);
                if($('#action_content').val()!='' && $('#action_year').attr('data-year')!=''&&$('input[name="action_month"]').val()!='no'){
                  $('#project_action .btn-submit').removeAttr('disabled').css('background','#00799f');
                }else{
                  $('#project_action .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
              }
            });
            event.preventDefault();
            /* Act on the event */
          });
        }
        // 取消增加创始团队
        $('.edit-project-action .btn-cancel').unbind('click').on('click',function(){
          // 判断当前状态是增加还是编辑
          if(obj.attr('id')=='project_action'){
            $('.btn-edit,.btn-delet,.btn-add').show();
            obj.find('.edit-project-action').remove().siblings('.btn-add,.no-data').show();
          }else{
            $('.btn-edit,.btn-delet,.btn-add').show();
            obj.css('height','auto');
            obj.find('.edit-project-action').remove();
            obj.children().show();
          }
        })
      },
      addAction:function(){
        var _this = this;
        $('#project_action .btn-add').unbind('click').on('click',function(event){
          $('.btn-edit,.btn-delet,.btn-add').hide();
          _this.addActionBox($('#project_action'));
          $('#project_action .edit-project-action').show().siblings('.btn-add,.no-data').hide();
          _this.addEventAction();
          var url = 'userCenter/project/addEvent';
          _this.subAction(url);
          event.preventDefault();
        })
      },
      editAction:function(){
        _this = this;
        $('#project_action .btn-edit').unbind('click').on('click', function(event) {
          var item = $(this).parents('li:eq(0)'),
              id = $(this).parents('li:eq(0)').attr('data-eventid'),
              timeStr = item.find('span').text(),
              description = item.find('h3').text();
          var data = {
            id:id,
            timeStr:timeStr,
            description:description
          };
          _this.addActionBox(item,data);
          _this.addEventAction();
          var url = 'userCenter/project/changeEvent';
          _this.subAction(url,item.attr('data-eventid'));
          $('#project_action .btn-submit').removeAttr('disabled').css('background','#00799f');
          item.css('height','350px').find('.edit-project-action').css({'width':'790px','position':'absolute','left':'0','top':'0'}).show().siblings().hide();
          $('.btn-add').hide();
          event.preventDefault();
        });
      },
      delAction:function(){
        $('#project_action .btn-delet').unbind('click').on('click', function(event) {
          var item = $(this).parents('li:eq(0)'),
              id = $(this).parents('li:eq(0)').attr('data-eventid');
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/removeEvent',
            data:{'event':id},
            dataType: 'json',
            
            success:function(res){
              item.remove();
              if($('#project_action>ul>li').length==0){
                $('#project_action>h2').after('<span class="no-data">暂无介绍</span>');
              }
            }
          })
          event.preventDefault();
        });
      },
      addEventAction:function(){
        var _this = this;
        // 输入姓名和职衔的监听
        $('#action_content').bind('input propertychange',function() {
          if($('#action_content').val()!='' && $('#action_year').attr('data-year')!=''&&$('input[name="action_month"]').val()!='no'){
            $('#project_action .btn-submit').removeAttr('disabled').css('background','#00799f');
          }else{
            $('#project_action .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
          }
        });
        $('#action_year').bind('input propertychange',function() {
          if($(this).val()==''){
            $(this).attr('data-year','');
            $('#project_action .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
          }
        });
      },
      subAction:function(url,eventId){
        var _this = this;
        $('#project_action .btn-submit').unbind('click').on('click',function(e){
          var year = $('#action_year').attr('data-year'),
              date=' '+ year + ' 00:00:00';
              date = new Date(Date.parse(date.replace(/-/g, "/")));
              date = date.getTime()/1000;
          var description=$('#action_content').val(),
              event = eventId==undefined?undefined:eventId;
          $.ajax({
            type:"post",
            url:urlPath + '/web/'+url,
            data:{'eventTime':date,'description':description,'event':event,'project':_this.project},
            dataType: 'json',
            
            success:function(res){
              $('#project_action .edit-project-action').hide();
              $('.btn-edit,.btn-delet,.btn-add,#project_action .btn-add').show();
              if($('#project_action .no-data').length!=0){
                $('#project_action .no-data').remove();
              }
              $('#project_action .spinner').show().siblings().remove();
              _this.getPorjectData(_this.project,3);
            }
          })
          e.preventDefault();
        })
      },
      /* 编辑商业方案
       * @getPlan: 获取数据
       * @editPlan 编辑数据
       * @subPlan 提交数据
       * @uploadPlan 上传计划书
       * @deluploadPlan 删除上传
      */
      getPlan:function(data){
        var _this = this;
        var html = '';

        html+='<h2>商业方案<i class="btn-edit"></i></h2>';
        if(data.bpBrief==undefined){
          if(data.bps.length!==0){
            html+='<span class="no-data" style="display:block; margin-bottom:42px;">暂无介绍</span>';
          }else{
            html+='<span class="no-data">暂无介绍</span>';
          }
        }else{
          _this.planProgress = 5;
          html+='<p>'+ data.bpBrief +'</p>';
        }
        html+='<div class="edit-box edit-project-plan">\
            <span class="label-title">商业方案：</span>\
            <textarea class="txt-project-plan" placeholder="请输入商业方案"></textarea>\
            <p class="edit-wordtext">你还可以输入<span>1000</span>字</p>\
            <div>\
              <button class="btn-submit" disabled="disabled">保存</button>\
              <span class="btn-cancel">取消</span>\
            </div>\
          </div>';
        if(data.bps.length!=0){
          _this.plantxtProgress = 10;
          html+='<div id="upload_plan">\
                  <div class="plan-box">\
                    <div class="new-plan up-success" style="display: block;">\
                      <span class="plantxt-title">'+ data.bps[0].fname +'</span><span class="del-plan"></span>\
                      <input type="hidden" data-key="'+ data.bps[0].key +'" data-url="'+ data.bps[0].accessUrl +'">\
                    </div>\
                  </div>\
                  <div class="file-btnbox" style="display:none;">\
                    <button class="btn-txt" id="addPlan">添加商业计划书</button>\
                  </div>\
                  <p class="fileplan-txt">已上传商业计划书</p>\
                </div>';
        }else{
          html+='<div id="upload_plan">\
                  <div class="plan-box"></div>\
                  <div class="file-btnbox">\
                    <button class="btn-txt" id="addPlan">添加商业计划书</button>\
                  </div>\
                  <p class="fileplan-txt">未上传商业计划书</p>\
                </div>';
        }
        $('#project_plan').append(html);
        if(data.bps.length!=0){
          var span = $('<span class="hidden-plantxt" style="visibility:hidden;">'+ data.bps[0].fname +'</span>');
          $('.project-detaile-content').append(span);
          var spanWidth = $('.hidden-plantxt').width();
          if(spanWidth > 200){
            var first = data.bps[0].fname.substring(0,6);
            var last = data.bps[0].fname.substr(data.bps[0].fname.length-8);
            var txt = first + '...' + last;
            $('.plantxt-title').text(txt);
            $('.hidden-plantxt').remove();
          }
        }
        if(data.bps.length!=0){
          _this.deluploadPlan();
        }
        _this.editPlan(data.bpBrief);
        _this.uploadPlan();
      },
      editPlan:function(bpBrief){
        var _this = this;
        $('#project_plan .btn-edit').on('click',function(){
          $('#addPlan').attr('disabled','disabled');
          $('.btn-edit,#upload_plan .del-plan').hide();
          $('.edit-project-plan').show().siblings('span,p,a').hide();

          // 项目介绍字数统计
  				var textArea = $('.edit-project-plan').find("textarea");
  					word = $('.edit-project-plan').find('.edit-wordtext span');
  				statInputNum(textArea,word);
  				function statInputNum(textArea,numItem) {
	        	var max = numItem.text(),
	            	curLength;
		    		textArea[0].setAttribute("maxlength", max);
	        	curLength = textArea.val().length;

            if(bpBrief==undefined){
              var txt = "请填写商业方案";
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
              var txt =bpBrief;
              textArea.val(txt);
              $('.edit-wordtext span').text(max - textArea.val().length);
              $('#project_plan .btn-submit').removeAttr('disabled').css('background','#00799f');
              _this.subPlan();
            }
            textArea.focus(function() {
              var focusTxt = textArea.val();
              var txt = "请填写商业方案";
              if(focusTxt==txt){
                $(this).val('').css('color', '#272727');
              }
            });
            textArea.on('input propertychange', function () {
		            $('.edit-wordtext span').text(max - $(this).val().length);
                if($(this).val()!=''){
                  $('#project_plan .btn-submit').removeAttr('disabled').css('background','#00799f');
                  _this.subPlan();
                }else{
                  var txt = "请填写商业方案";
                  $('.edit-project-plan').find('.edit-wordtext span').text('1000');
                  $(this).val(txt).css('color','#9f9f9f').blur();
                  $('#project_plan .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
                }
		        });
	       	}
        })
        $('#project_plan .btn-cancel').on('click',function(){
          $('#project_plan').html('');
          _this.getPorjectData(_this.project,4);
          $('.edit-project-plan').find('.edit-wordtext span').text('1000');
          $('.btn-edit').show();
        })
      },
      subPlan:function(){
        var _this = this;
        $("#project_plan .btn-submit").unbind('click').on('click', function(event) {
          var project = _this.project,
              bpBrief = $('.txt-project-plan').val();
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/changeBpBrief',
            data:{'project':project,'bpBrief':bpBrief},
            dataType: 'json',
            
            success:function(res){
              $('#project_plan').html('');
              _this.getPorjectData(_this.project,4);
              $('.edit-project-plan').find('.edit-wordtext span').text('1000');
              $('.btn-edit,#upload_plan .del-plan').show();
              $('#addPlan').removeAttr('disabled');
            }
          })
          event.preventDefault();
        });
      },
      uploadPlan:function(){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: 'addPlan',	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: 'upload_plan',	 //上传区域DOM ID，默认是browser_button的父元素
          multi_selection: false,
	        flash_swf_url: '/ROOT/js/lib/qn/Moxie.swf', //引入flash,相对路径
          max_file_size: '5mb',	//最大文件体积限制
	        chunk_size: '4mb',	//分块上传时，每片的体积
	        keys_url: urlPath + $('#keys_url').val(),
	        filters: {
				  mime_types : [ //只允许上传图片文件和rar压缩文件
            { title : "压缩文件", extensions : "zip" },
            { title : "图片", extensions : "jpg,jpeg,png" },
				    { title : "文档", extensions : "doc,docx,pdf,xlsx,ppt,xls,pptx" }
				  ],
				  prevent_duplicates : true //不允许队列中存在重复文件
					},
		        auto_start: true,	//选择文件后自动上传，若关闭需要自己绑定事件触发上传
		        init: {
	             	'FilesAdded': function(up, files) {
                  // 文件添加进队列后,处理相关的事情
                  if($("#upload_plan .plan-box .new-plan").length!=0){
                    $("#upload_plan .plan-box .new-plan").remove();
                  }
                  plupload.each(files, function(file) {
                    var html = '<div class="new-plan" id="'+ file.id +'"></div>';
                    $('#upload_plan .plan-box').append(html);
                  })
		            },
		            'BeforeUpload': function(up, file) {
                  // 每个文件上传前，处理相关的事情
		            },
		            'UploadProgress': function(up, file) {
		                // 每个文件上传时，处理相关的事情
                    $('#upload_plan #addPlan').attr('disabled','disabled').text('正在上传');
		            },
		            'UploadComplete': function(up,files) {
		                //队列文件处理完毕后，处理相关的事情
		            },
		            'FileUploaded': function(up, file, info) {
		                // 每个文件上传成功后，处理相关的事情
		               	var domain = up.getOption('domain');
		               	var res = JSON.parse(info);
		               	var sourceLink =  domain + res.key; //获取上传成功后的文件的Url
		               	var del = $('<span class="plantxt-title">'+ res.fname +'</span><span class="del-plan"></span><input type="hidden" data-key="'+ res.key +'" data-url="'+ sourceLink +'"/>');
                    $('#upload_plan .file-btnbox').hide();
                    $('#'+file.id).addClass('up-success').append(del).show();
                    var spanWidth = $('.plantxt-title').width();
                    if(spanWidth > 200){
                      var first = res.fname.substring(0,6);
                      var last = res.fname.substr(res.fname.length-8);
                      var txt = first + '...' + last;
                      $('.plantxt-title').text(txt);
                    }
                    $('#upload_plan .fileplan-txt').text('已上传商业计划书');
                    _this.deluploadPlan();
                    _this.subPlanBp();
		            },
		            'Error': function(up, err, errTip){
                  switch (err.code) {
                    case -600:
                      var options = {
                        msg:'所选文档尺寸太大，请重新上传！',
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
                      msg:'所选文档格式不符，请重新上传！',
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
                    $('#upload_plan .plan-box').hmtl('').hide();
                    $('#upload_plan .file-btnbox #addPlan').removeAttr('disabled').text('上传失败');
                    $('#upload_plan .fileplan-txt').text('上传商业计划书失败');
                  }
		            }
		        }
		    });
      },
      deluploadPlan:function(){
        var _this = this;
        $('#upload_plan .plan-box>.new-plan>.del-plan').unbind('click').on('click', function(event) {
          var bpKey = $('.plan-box input[type="hidden"]').attr('data-key');
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/removeBp',
            data:{'project':_this.project,'bpKey':bpKey},
            dataType: 'json',
            
            success:function(res){
              console.log(res);
              $('#upload_plan .plan-box>.new-plan').remove();
              $('#upload_plan #addPlan').removeAttr('disabled').text('添加商业计划书');
              $('#upload_plan .file-btnbox').show();
              $('#upload_plan .fileplan-txt').text('未上传商业计划书');
              _this.plantxtProgress = 0;
              $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress + _this.teamProgress + _this.actionProgress + _this.planProgress + _this.plantxtProgress + _this.finaProgress)+'%');
            }
          })
          event.preventDefault();
          /* Act on the event */
        });
      },
      // 提交商业计划书
      subPlanBp:function(){
        var bpKey = $('.plan-box input[type="hidden"]').attr('data-key');
        $.ajax({
          type:"post",
          url:urlPath + '/web/userCenter/project/changeBp',
          data:{'project':_this.project,'bpKey':bpKey},
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            _this.plantxtProgress = 10;
            $('.right-fixedbox .progress>span').text((_this.bannerProgress + _this.infoProgress + _this.decProgress + _this.picProgress + _this.teamProgress + _this.actionProgress + _this.planProgress + _this.plantxtProgress + _this.finaProgress)+'%');
          }
        })
      },
      /* 编辑融资详情
       * @getFinancing: 加载融资详情
       * @setSelect 加载下拉菜单
       * @editFinancing 编辑融资详情
       * @addFinancingBox 增加编辑
       * @addEventFinancing 监听数据
       * @chekFinancing 校验数据
       * @subFinancing 提交数据
      */
      getFinancing:function(data){
        var html = '';
        html+='<h2>融资详情<i class="btn-edit"></i></h2>';
        if(data.artificialPerson==undefined){
          html+='<table><caption>本轮总体融资计划</caption><tbody>\
              <tr><td>本轮融资轮次</td><td style="color:#9f9f9f;">未填写</td></tr>\
              <tr><td>本轮融资类型</td><td style="color:#9f9f9f;">未填写</td>\</tr>\
              <tr><td>本轮融资金额</td><td style="color:#9f9f9f;">未填写</td></tr>\
              <tr><td>本轮出让股权</td><td style="color:#9f9f9f;">未填写</td></tr>\
              <tr><td>估值</td><td style="color:#9f9f9f;">未填写</td></tr>\
            </tbody></table>\
          <table><caption>公司工商信息</caption><tbody>\
            <tr><td>公司名称</td><td style="color:#9f9f9f;">未填写</td></tr>\
            <tr><td>法人代表</td><td style="color:#9f9f9f;">未填写</td></tr>\
            <tr><td>注册资本</td><td style="color:#9f9f9f;">未填写</td></tr>\
            <tr><td>注册地点</td><td style="color:#9f9f9f;">未填写</td></tr>\
            <tr><td>成立时间</td><td style="color:#9f9f9f;">未填写</td></tr>\
            <tr><td>所属行业</td><td style="color:#9f9f9f;">未填写</td></tr>\
          </tbody></table>';
        }else{
          _this.finaProgress =  15;
          var unixTime = new Date(data.registeredTime*1000),
              month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
              date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
              registeredTime = unixTime.getFullYear()+'-'+month+'-'+date;
          var currType = data.currency=='USD'?'$':'￥';
          var registeredCapital = parseInt(data.registeredCapital).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
          html+='<table><caption>本轮总体融资计划</caption><tbody>\
              <tr><td>本轮融资轮次</td><td>'+ data.priseName +'</td></tr>\
              <tr><td>本轮融资类型</td><td>'+ data.financingTypeName +'</td></tr>\
              <tr><td>本轮融资金额</td><td>'+currType+ data.amount +'万</td></tr>\
              <tr><td>本轮出让股权</td><td>'+ (data.amount/data.valuation).toFixed(2)*100 +'%</td></tr>\
              <tr><td>估值</td><td>'+ currType + data.valuation +'万</td></tr>\
            </tbody></table>\
            <table><caption>公司工商信息</caption><tbody>\
              <tr><td>公司名称</td><td>'+ data.companyName +'</td></tr>\
              <tr><td>法人代表</td><td>'+ data.artificialPerson +'</td></tr>\
              <tr><td>注册资本</td><td>￥'+ registeredCapital +'元</td></tr>\
              <tr><td>注册地点</td><td>'+ data.registeredPlace +'</td></tr>\
              <tr><td>成立时间</td><td>'+ registeredTime +'</td></tr>\
              <tr><td>所属行业</td><td>'+ data.industryName +'</td></tr>\
            </tbody></table>';
          _this.haveFinancing = true;
        }
        $('#project_financing .spinner').hide();
        $('#project_financing').append(html);

        _this.editFinancing();
      },
      haveFinancing:false,
      setSelect:function(obj,url,width,value,name){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web'+url,
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#'+obj+'').append(html).selectlist({
              zIndex: 9,
              width: width,
              height: 42,
              onChange:function(){
                _this.chekFinancing();
              }
            });
            if(value!=undefined&&name!=undefined){
              $('#'+obj+'').find('input[name="'+ obj +'"]').val(value);
              $('#'+obj+'').find('.select-button').val(name);
            }
          }
        })
      },
      editFinancing:function(){
        var _this = this;
        $('#project_financing .btn-edit').unbind('click').on('click',function(event){
          $('.btn-edit,.btn-delet,.btn-add').hide();
          _this.addFinancingBox();
          $('#project_financing .edit-project-financing').show().siblings('table').hide();
          _this.addEventAction();
          _this.subFinancing();
          event.preventDefault();
        })
      },
      addFinancingBox:function(){
        var _this = this;
        var html = '';
        if(_this.haveFinancing==false){
          html+=  '<div class="edit-box edit-project-financing">\
                    <h3>本轮总体融资计划</h3>\
                    <div>\
                      <span class="important label-title">本轮融资轮次：</span>\
                      <select id="financing_type">\
                        <option value="no">请选择</option>\
                      </select>\
                      <span class="label-title">本轮融资类型：</span>\
                      <select id="financing_status">\
                        <option value="no">请选择</option>\
                      </select>\
                    </div>\
                    <div>\
                      <span class="important label-title">本轮融资金额：</span>\
                      <select id="financing_currency">\
                        <option value="no">请选择</option>\
                      </select>\
                      <input id="financing_amount" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >万\
                    </div>\
                    <div>\
                      <span class="important label-title">本轮出让股权：</span>\
                      <input id="financing_equity" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >万\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">本轮估值：</span>\
                      <input id="financing_valuation" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >万\
                    </div>\
                    <h3>公司工商信息</h3>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">公司名称：</span>\
                      <input id="financing_companyName" type="text" >\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">法人代表：</span>\
                      <input id="financing_artificialPerson" type="text" >\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">注册资本：</span>\
                      <input id="financing_registeredCapital" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >元\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">注册地点：</span>\
                      <input id="financing_registeredPlace" type="text" >\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">成立时间：</span>\
                      <input class="laydate-icon" id="financing_registeredTime" type="text" >\
                    </div>\
                    <div>\
                      <button class="btn-submit" disabled="disabled">保存</button>\
                      <span class="btn-cancel">取消</span>\
                    </div>\
                  </div>';
          $('#project_financing').append(html);
          // 融资项目-轮次
          _this.setSelect('financing_type','/project/financing/prises','227');
          //融资项目-类型
          _this.setSelect('financing_status','/project/financing/types','227');
          //融资项目-币种
          _this.setSelect('financing_currency','/common/currencys','158');
        }else{
          var unixTime = new Date(_this.detaileData.registeredTime*1000),
              month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
              date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
              registeredTime = unixTime.getFullYear()+'-'+month+'-'+date;
          var currType = _this.detaileData.currency=='USD'?'美元':'人民币';
          html+=  '<div class="edit-box edit-project-financing">\
                    <h3>本轮总体融资计划</h3>\
                    <div>\
                      <span class="important label-title">本轮融资轮次：</span>\
                      <select id="financing_type">\
                        <option value="no">请选择</option>\
                      </select>\
                      <span class="label-title">本轮融资类型：</span>\
                      <select id="financing_status">\
                        <option value="no">请选择</option>\
                      </select>\
                    </div>\
                    <div>\
                      <span class="important label-title">本轮融资金额：</span>\
                      <select id="financing_currency">\
                        <option value="no">请选择</option>\
                      </select>\
                      <input value="'+ _this.detaileData.amount +'" id="financing_amount" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >万\
                    </div>\
                    <div>\
                      <span class="important label-title">本轮出让股权：</span>\
                      <input value="'+ _this.detaileData.equity +'" id="financing_equity" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >万\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">本轮估值：</span>\
                      <input value="'+ _this.detaileData.valuation +'" id="financing_valuation" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >万\
                    </div>\
                    <h3>公司工商信息</h3>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">公司名称：</span>\
                      <input value="'+ _this.detaileData.companyName +'" id="financing_companyName" type="text" >\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">法人代表：</span>\
                      <input value="'+ _this.detaileData.artificialPerson +'" id="financing_artificialPerson" type="text" >\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">注册资本：</span>\
                      <input value="'+ _this.detaileData.registeredCapital +'" id="financing_registeredCapital" onkeyup="Num(this);"  onafterpaste="Num(this);" type="text" >元\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">注册地点：</span>\
                      <input value="'+ _this.detaileData.registeredPlace +'" id="financing_registeredPlace" type="text" >\
                    </div>\
                    <div style="margin-bottom:30px;">\
                      <span class="important label-title label-valuation">成立时间：</span>\
                      <input value="'+ registeredTime +'" class="laydate-icon" id="financing_registeredTime" type="text" data-year="'+ registeredTime +'" >\
                    </div>\
                    <div>\
                      <button class="btn-submit" disabled="disabled">保存</button>\
                      <span class="btn-cancel">取消</span>\
                    </div>\
                  </div>';
          $('#project_financing').append(html);
          // 融资项目-轮次
          _this.setSelect('financing_type','/project/financing/prises','227',_this.detaileData.prise,_this.detaileData.priseName);
          //融资项目-类型
          _this.setSelect('financing_status','/project/financing/types','227',_this.detaileData.financingType,_this.detaileData.financingTypeName);
          //融资项目-币种
          _this.setSelect('financing_currency','/common/currencys','158',_this.detaileData.currency,currType);
          $('#project_financing .btn-submit').removeAttr('disabled').css('background','#00799f');
        }
        // 监听所有input以及调用日历
        _this.addEventFinancing();
        _this.subFinancing();
        // 调用年份
        // 取消增加创始团队
        $('.edit-project-financing .btn-cancel').unbind('click').on('click',function(){
          $('.btn-edit,.btn-delet,.btn-add').show();
          $('#project_financing table').show();
          $('#project_financing .edit-project-financing').remove();
        })
      },
      addEventFinancing:function(){
        var _this = this;
        $('#project_financing input:not(#financing_registeredTime)').bind('input propertychange',function() {
          _this.chekFinancing();
        })
        $('#project_financing #financing_registeredTime').change(function(event) {
          _this.chekFinancing();
          /* Act on the event */
        });
        laydate.skin('molv');
        $('#financing_registeredTime').on('click',function(event) {
          var self = $(this);
          laydate({
            elem: '#financing_registeredTime', //目标元素
            format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
            istoday: false,
            isclear: false,
            event:'click', //响应事件。
            choose: function(datas){ //选择日期完毕的回调
              self.attr('data-year', datas);
              _this.chekFinancing();
            }
          });
          event.preventDefault();
          /* Act on the event */
        });
      },
      chekFinancing:function(){
        var _this = this;
        var financing_type = $('input[name="financing_type"]').val(),
            financing_status = $('input[name="financing_status"]').val(),
            financing_currency = $('input[name="financing_currency"]').val(),
            financing_amount = $('#financing_amount').val(),
            financing_equity = $('#financing_equity').val(),
            financing_valuation = $('#financing_valuation').val(),
            financing_companyName = $('#financing_companyName').val(),
            financing_artificialPerson = $('#financing_artificialPerson').val(),
            financing_registeredCapital = $('#financing_registeredCapital').val(),
            financing_registeredPlace = $('#financing_registeredPlace').val(),
            financing_registeredTime = $('#financing_registeredTime').val();
        if(financing_type!='no'&&financing_status!='no'&&financing_currency!='no'&&financing_amount!=''&&financing_equity!=''&&financing_valuation!=''&&financing_companyName!=''&&financing_artificialPerson!=''&&financing_registeredCapital!=''&&financing_registeredPlace!=''&&financing_registeredTime!=''){
          $('#project_financing .btn-submit').removeAttr('disabled').css('background','#00799f');
        }else{
          $('#project_financing .btn-submit').attr('disabled','disabled').css('background','rgba(0,121,159,.5)');
        }
      },
      subFinancing:function(){
        var _this = this;
        $('#project_financing .btn-submit').unbind('click').on('click',function(e){
          var prise = $('input[name="financing_type"]').val(),
              financingType = $('input[name="financing_status"]').val(),
              currency = $('input[name="financing_currency"]').val(),
              amount = $('#financing_amount').val(),
              equity = $('#financing_equity').val(),
              valuation = $('#financing_valuation').val(),
              companyName = $('#financing_companyName').val(),
              artificialPerson = $('#financing_artificialPerson').val(),
              registeredCapital = $('#financing_registeredCapital').val(),
              registeredPlace = $('#financing_registeredPlace').val(),
              year = $('#financing_registeredTime').attr('data-year'),
              registeredTime=' '+ year + ' 00:00:00';
              registeredTime = new Date(Date.parse(registeredTime.replace(/-/g, "/")));
              registeredTime = registeredTime.getTime()/1000;
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/changeFinancingPlan',
            data:{'prise':prise,'financingType':financingType,'currency':currency,'amount':amount,'equity':equity,'valuation':valuation,'companyName':companyName,'artificialPerson':artificialPerson,'registeredCapital':registeredCapital,'registeredPlace':registeredPlace,'registeredTime':registeredTime,'project':_this.project},
            dataType: 'json',
            
            success:function(res){
              $('#project_financing .edit-project-financing').remove();
              $('.btn-edit,.btn-delet,.btn-add').show();
              if($('#project_financing table').length!=0){
                $('#project_financing .spinner').siblings().remove();
              }
              $('#project_financing .spinner').show();
              _this.getPorjectData(_this.project,5);
            }
          })
          e.preventDefault();
        })
      },
      // 选项卡切换
      tab:function(){
        $('.project-detaile-content .detaile-tab a').unbind('click').on('click',function(){
          var aIndex = $('.project-detaile-content .detaile-tab a').index(this);
          $(this).addClass('active').siblings().removeClass('active');
          $('.project-detaile-content .detaile-tablist>li').eq(aIndex).fadeIn(200).siblings('li').hide();
        })
        $('.fixed-tab .detaile-tab a').unbind('click').on('click',function(){
          var aIndex = $('.fixed-tab .detaile-tab a').index(this);
          $(this).addClass('active').siblings().removeClass('active');
          $('.project-detaile-content .detaile-tab a').eq(aIndex).addClass('active').siblings().removeClass('active');
          $('.project-detaile-content .detaile-tablist>li').eq(aIndex).fadeIn(200).siblings('li').hide();
        })
        $('.right-smtab-box .right-smtab a').unbind('click').on('click',function(){
          var aIndex = $('.right-smtab-box .right-smtab a').index(this);
          $(this).addClass('active').siblings().removeClass('active');
          $('.right-smtab-box ul>li').eq(aIndex).fadeIn(200).siblings('li').hide();
        })
      },
      scrollTab:function(){
        var fixedLeft = $('.right-fixedbox').offset().left,
            navTop = $('.project-detaile-content').offset().top;
        $(window).scroll(function(event) {
          if ($(window).scrollTop()>navTop){
            $('.fixed-tab').show();
            $('.right-fixedbox').css({'position':'fixed','left':fixedLeft,'top':'75px'});
          }else{
            $('.fixed-tab').hide();
            $('.right-fixedbox').css({'position':'absolute','left':'900px','top':'64px'});
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
    projectDetaile.init();
  })

})
