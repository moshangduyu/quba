/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-01
 * @lastChange 2017-03-01
 * @version 1.0.0
 */
define(function(require){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  require("../lib/select/select.js");
  //ajaxUrl 模块
  var url = require("../module/url_main.js"),
    Url = new url(),
    urlPath = Url.url;
  // login 模块
  var login = require("../module/login.js"),
    Login = new login();
    Login.render();
  // 弹窗
  var pop = require("../module/popbox/pop_main.js");

	$(function(){
    var creatProject = {
      // 初始化
      init:function(){
        var _this = this;
        _this.getIndustrys();
        _this.upload();
        _this.getProv();
        _this.addEven();
      },
      // ajax 获取省份列表
      getProv:function(){
        var _this = this;
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
              width: 253,
              height: 42,
              onChange:function(){
                var code = $('#prov input[name="prov"]').val();
                $('#city').remove();
                var dom = '<select id="city" class="city" name="city">\
              							<option value ="no">请选择</option>\
              						</select>';
                $('#citybox').append(dom);
                _this.getCity(code);
                _this.judge();
              }
            });
          }
        })
      },
      getCity:function(code){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/common/region/getRegionByFather',
          dataType: 'json',
          data:{'code':code},
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.code +'">'+ item.name +'</option>';
            });
            $('#city').append(html).selectlist({
              zIndex: 9,
              width: 253,
              height: 42,
              onChange:function(){
                _this.judge();
              }
            });
          }
        })
      },
      // ajax 获取行业信息
      getIndustrys:function(){
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
              width: 508,
              height: 42,
              onChange:function(){
                _this.judge();
              }
            });
          }
        })
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      },
      // 图片上传
      upload:function(){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: 'addAttach',	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: 'container',	 //上传区域DOM ID，默认是browser_button的父元素
          multi_selection: false,
	        flash_swf_url: '/ROOT/js/lib/qn/Moxie.swf', //引入flash,相对路径
          max_file_size: '5mb',	//最大文件体积限制
          chunk_size: '4mb',
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
                    if($("#container .img-head .new-img").length!=0){
                      $("#container .img-head .new-img").remove();
                    }
                    plupload.each(files, function(file) {
                      var html = '<div class="new-img" id="'+ file.id +'"><p class="progress"></p></div>';
                      $('#container .img-head').append(html);
                    })
			            },
			            'BeforeUpload': function(up, file) {
                    // 每个文件上传前，处理相关的事情
			            },
			            'UploadProgress': function(up, file) {
			                // 每个文件上传时，处理相关的事情
			                $('#'+file.id+' .progress').show().text(file.percent + '%');//控制进度条
                      $('#addAttach').attr('disabled','disabled').text('正在上传');
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
                      $('#container .img-head>img').remove();
			               	$('#'+file.id).addClass('up-success').append(del).find('.progress').hide();
                      $('#addAttach').removeAttr('disabled').text('选择文件');
                      $('.file-txt').text('已上传项目Logo');
			            },
			            'Error': function(up, err, errTip){
                    switch (err.code) {
                      case -600:
                        var options = {
                          msg:'所选图片尺寸太大，请重新上传！',
                          btn:'<a class="btn-sm">重新上传</a>'
                        }
                        _this.pop(options);
                        break;
                      case -601:
                      var options = {
                        msg:'所选图片格式不符，请重新上传！',
                        btn:'<a class="btn-sm">重新上传</a>'
                      }
                      _this.pop(options);
                      break;
                      default:
	                    console.log(err,errTip);
	                    $('#addAttach').removeAttr('disabled').text('上传失败，重新上传');
                    }
			            }
			        }
			    });
      },
      // 监听必填项
      addEven:function(){
        var _this = this;
        $('#container .img-head').bind('DOMNodeInserted',function(){
          _this.judge();
        })
        $('input[name="project_name"], input[name="project_dec"], input[name="highlight"], input[name="teamPoint"]').bind('input propertychange',function() {
          _this.judge();
        });
      },
      judge:function(){
        var _this = this,
            data = {};
        var title = $('input[name="project_name"]').val(),
            logo  = $('.up-success').length,
            brief = $('input[name="project_dec"]').val(),
            industry = $('input[name="industry"]').val(),
            highlight = $('input[name="highlight"]').val()==''?undefined:$('input[name="highlight"]').val(),
            teamPoint = $('input[name="teamPoint"]').val()==''?undefined:$('input[name="teamPoint"]').val(),
            prov = $('input[name="prov"]').val(),
            regionCode = $('input[name="city"]').val();

        if(title!='' && logo!=0 && brief!='' && industry != 'no' && prov!='no'){
          data.title = title;
          data.logo = $('.up-success').find('img').attr('src');
          data.brief = brief;
          data.industry = industry;
          if(regionCode !='no' && regionCode !=undefined){
            data.regionCode = regionCode;
            if(highlight!=''){
              data.highlight = highlight;
            }
            if(teamPoint!=''){
              data.teamPoint = teamPoint;
            }
            $('.creat-submit').removeAttr('disabled').css('background','#f4d13f');
            _this.submit(data);
          }else{
            $('.creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
          }
        }else{
          $('.creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
        }
      },
      // 提交表单
      submit:function(data){
        var _this = this;
        $('.creat-submit').unbind('click').on('click',function(){
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/project/createProject',
            data:data,
            dataType: 'json',
            
            success:function(res){
              window.location.href = 'my_project.html';
            }
          })
        })
      }
    }
    creatProject.init();
  })

})
