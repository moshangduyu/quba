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
    var certifiedInvestment = {
      // 初始化
      init:function(){
        var _this = this;
        _this.getData();
      },
      getData:function(){
        var _this = this;
        _this.getInvestor();
        // 名片上传
        var cardTip = '仅供认证使用，平台不会暴露您的个人信息，<br />上传的名片以便我们和您联系<br />建议上传尺寸：90mm*50mm<br />格式为JPG、JPEG、PNG，小于5MB',
        		newCardTip = '已上传名片照片';
        _this.uploadCard('addCardPic','picCard','5mb',2,cardTip,newCardTip);
        // 资产证明上传
        _this.uploadPlan();
        //营业执照上传
        var licenseTip = '上传您所在的机构营业执照扫描件，附件小于10M',
        		newLicenseTip = '已上传机构营业执照';
        _this.uploadCard('addLicense','picLicense','10mb',1,licenseTip,newLicenseTip);
        // 监听数据
        $('input[name="realName"],input[name="mechanism_office"],input[name="mechanism_position"]').bind('input propertychange',function() {
          _this.addEven();
        });
        $('#picCard .imgbox, #picAssets .plan-box, #picLicense .imgbox').bind('DOMNodeInserted',function(e){
          _this.addEven();
        })
        // 勾选条款
        $('.Ischecked').unbind('click').on('click',function(){
        	if($(this).hasClass('selected')){
        		$(this).removeClass('selected');
        	}else{
        		$(this).addClass('selected');
        	}
        	_this.addEven();
        })
      },
      // 获取投资人身份
      getInvestor:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/me/investor/identities',
          dataType: 'json',

          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#identities').append(html).selectlist({zIndex: 2,width: 506,height: 40,onChange:function(){
            	var key = $('input[name="identities"]').val();
			        if(key=='1'){
			        	$('.personal').show().siblings('.mechanism').hide();
			        }else{
			          $('.mechanism').show().siblings('.personal').hide();
			        }
              _this.addEven();
            }});
            _this.addEven();
          }
        })
      },
      // 图片上传
      uploadCard:function(button,container,size,numb,tips,newtips){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: button,	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: container,	 //上传区域DOM ID，默认是browser_button的父元素
	        flash_swf_url: '/ROOT/js/lib/qn/Moxie.swf', //引入flash,相对路径
          max_file_size: size,	//最大文件体积限制
          chunk_size: '4mb',
	        keys_url: urlPath + $('#keys_url').val(),
	        filters: {
				  mime_types : [ //只允许上传图片文件和rar压缩文件
				    { title : "图片文件", extensions : "jpg,jpeg,png" }
				  ],
				  prevent_duplicates : true //不允许队列中存在重复文件
					},
			        auto_start: true,	//选择文件后自动上传，若关闭需要自己绑定事件触发上传
			        init: {
		             	'FilesAdded': function(up, files) {
                    // 判断一次性锁选图片是否大于10张
                    if(files.length>numb){
                      var options = {
                        msg:'最多只能上传'+ numb +'个文件，请重新选择！',
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
                      $('#'+ button).removeAttr('disabled').text('选择文件').css('width','100px');
                    }else{
                      var hLength = $("#"+ container +">.imgbox img").length;
                      if(hLength==0){
                        plupload.each(files, function(file) {
                          var html = '<div id="' + file.id +'">\
                                        <div class="progress"></div>\
                                        <div class="delete-pic"><i></i></div>\
                                      </div>';
                          $('#'+ container + ' .imgbox').append(html);
                        });
                      }else{
                        // 判断一次性选择图片+已有图片是否大于限制数量
		                		var hLength = $('#'+ container +'>.imgbox img').length;
                        if(files.length>(numb - hLength)){
                          var options = {
                            msg:'最多只能上传'+ numb +'个文件，请重新选择！',
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
                          $('#'+ button).removeAttr('disabled').text('选择文件').css('width','100px');
                        }else if((files.length+hLength)== numb){
                          $('#'+ container +' .filepic-btnbox').hide();
                          plupload.each(files, function(file) {
                            var html = '<div id="' + file.id +'">\
                                          <div class="progress"></div>\
                                          <div class="delete-pic"><i></i></div>\
                                        </div>';
                            $('#'+ container + ' .imgbox').append(html);
                          });
                        }else{
                          plupload.each(files, function(file) {
                            var html = '<div id="' + file.id +'">\
                                          <div class="progress"></div>\
                                          <div class="delete-pic"><i></i></div>\
                                        </div>';
                            $('#'+ container+ ' .imgbox').append(html);
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
			                $('#'+file.id+' .progress').show().text(file.percent + '%');//控制进度条
                      $('#' + button).attr('disabled','disabled').text('正在上传').css('width','100px');
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
                      $('#'+ button).removeAttr('disabled').text('选择文件').css('width','100px');
                      if($('#picCard .up-success').length==1){
                        $('#'+ button).removeAttr('disabled').text('添加文件').css('width','100px');
                      }
                      if($('#picCard .up-success').length==2){
                        $('#'+ button).hide();
                      }
                      $('#'+ container +' .investment-tips').text(newtips);
                      _this.delPic(container,tips);
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
	                    $('#' + button).removeAttr('disabled').text('上传失败，重新上传').css('width','165px');
                    }
			            }
			        }
			    });
      },
      // 删除图片
      delPic:function(container,newtips){
        var _this = this;
        $('#' + container + ' .imgbox>div .delete-pic i').each(function(index, el) {
          $(this).unbind('click').on('click', function(event) {
            $(this).parent().parent().remove();
            $('#'+ container +' .investment-tips').html(newtips);
            if($('#picCard .up-success').length==0){
              $('#addCardPic').removeAttr('disabled').text('选择文件').show().css('width','100px');
            }
            if($('#picCard .up-success').length==1){
              $('#addCardPic').removeAttr('disabled').text('添加文件').show().css('width','100px');
            }
            _this.addEven();
            event.preventDefault();
            /* Act on the event */
          });
        });
      },
      uploadPlan:function(){
        var _this = this;
        var uploader = Qiniu.uploader({
	        runtimes: 'html5,flash,html4',	//上传模式,依次退化
	        browse_button: 'addProofPic',	//上传选择的点选按钮，**必需**
	        uptoken_url: urlPath + $('#uptoken_url').val(),	//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	        domain: $('#domain').val(),	//bucket 域名，下载资源时用到，**必需**
	        container: 'picAssets',	 //上传区域DOM ID，默认是browser_button的父元素
          multi_selection: false,
	        flash_swf_url: '/ROOT/js/lib/qn/Moxie.swf', //引入flash,相对路径
          max_file_size: '10mb',	//最大文件体积限制
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
                  if($("#picAssets .plan-box .new-plan").length!=0){
                    $("#picAssets .plan-box .new-plan").remove();
                  }
                  plupload.each(files, function(file) {
                    var html = '<div class="new-plan" id="'+ file.id +'"></div>';
                    $('#picAssets .plan-box').append(html);
                  })
		            },
		            'BeforeUpload': function(up, file) {
                  // 每个文件上传前，处理相关的事情
		            },
		            'UploadProgress': function(up, file) {
		                // 每个文件上传时，处理相关的事情
                    $('#picAssets #addProofPic').attr('disabled','disabled').text('正在上传');
		            },
		            'UploadComplete': function(up,files) {
		                //队列文件处理完毕后，处理相关的事情
		            },
		            'FileUploaded': function(up, file, info) {
		                // 每个文件上传成功后，处理相关的事情
		               	var domain = up.getOption('domain');
		               	var res = JSON.parse(info);
		               	var sourceLink =  domain + res.key; //获取上传成功后的文件的Url
		               	var del = $('<span class="del-plan"></span><input type="hidden" data-key="'+ res.key +'" data-url="'+ sourceLink +'"/>');
                    $('#picAssets .file-btnbox').hide();
                    $('#'+file.id).text(res.fname).show().addClass('up-success').append(del);
                    $('#picAssets .investment-tips').text('已上传资产证明');
                    _this.deluploadPlan();
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
                    $('#upload_plan').removeAttr('disabled').text('上传失败,请重新上传');
                  }
		            }
		        }
		    });
      },
      deluploadPlan:function(){
        var _this = this;
        $('#picAssets .plan-box>.new-plan>.del-plan').unbind('click').on('click', function(event) {
          $('#picAssets .plan-box>.new-plan').remove();
          $('#picAssets .investment-tips').html('上传可以证明资产的附件，<br />如有多个文件，请压缩成一个文件上传，附件小于10M');
          $('#picAssets #addProofPic').removeAttr('disabled').text('选择文件');
          $('#picAssets .file-btnbox').show();
          _this.addEven();
          event.preventDefault();
          /* Act on the event */
        });
      },
      // 监听数据
      addEven:function(){
        var _this = this,
            data = {},
            realName = $('input[name="realName"]').val(),//真实姓名
            investorIdentity = $('input[name="identities"]').val(),//投资人身份
            mechanism_office = $('input[name="mechanism_office"]').val(),//任职公司
            mechanism_position = $('input[name="mechanism_position"]').val(),//职位
            Ischecked  = $('.Ischecked').hasClass('selected')? true : false,
            picCard = $('#picCard .imgbox img'); //投资人名片
            if(realName != '' && investorIdentity != undefined && Ischecked==true){
              data.realName = realName;
              data.investorIdentity = investorIdentity;

              if(picCard.length==0){
              	$('.investor-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
              }else{
              	var investorCards = [];
              	picCard.each(function(index,el){
              		investorCards.push($(this).attr('data-key'));
              	})
              	data.investorCards = investorCards;
              	if(investorIdentity =='1'){
              		var investorAsset = $('#picAssets .new-plan input').attr('data-key');
              		if(investorAsset==undefined){
	              		$('.investor-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
	              	}else{
                    console.log(investorAsset);
	              		data.investorAsset = investorAsset;
	              		$('.investor-submit').removeAttr('disabled').css('background','#f4d13f');
	              		_this.submit(data);
	              	}
              	}else{
              		data.currentCompany = mechanism_office;
              		data.position = mechanism_position;

              		var busiLicense = $('#picLicense .imgbox img').attr('data-key');
              		if(busiLicense==undefined){
              			$('.investor-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
              		}else{
              			data.busiLicense = busiLicense;
              			$('.investor-submit').removeAttr('disabled').css('background','#f4d13f');
	              		_this.submit(data);
              		}
              	}
              }
            }else{
              $('.investor-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
            }
      },
      submit:function(data){
      	console.log(data);
        $('.investor-submit').unbind('click').on('click',function(){
        	$.ajax({
	          type:"post",
	          url:urlPath + '/web/userCenter/me/investor/apply',
	          data:data,
	          dataType: 'json',
	          success:function(res){
	          	window.location.href = '/personal_center.html';
	          }
	        })
        })
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      }
    }
    certifiedInvestment.init();
  })
})
