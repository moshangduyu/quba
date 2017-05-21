/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-16
 * @lastChange 2017-03-16
 * @version 1.0.0
 */
define(function(require){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  require("../lib/select/select.js");

  // login 模块
  var login = require("../module/login.js"),
    Login = new login();
    Login.render();
  //ajaxUrl 模块
  var url = require("../module/url_main.js"),
    Url = new url(),
    urlPath = Url.url;
  // 弹窗
  var pop = require("../module/popbox/pop_main.js");

	$(function(){
    var myProject = {
      // 初始化
      init:function(){
        var _this = this;
        $('#status').selectlist({
          zIndex: 10,
          width: 120,
          height: 35,
          onChange:function(){}
        });
        $('#type').selectlist({
          zIndex: 10,
          width: 120,
          height: 35,
          onChange:function(){
            var type = $('input[name="type"]').val();
            if(type=='longtime'){
              $('.longterm-listbox').html('');
              $('.listpage').hide();
              $('.project-content .spinner').show();
              _this.getMyProjectList();
            }else{
              $('.longterm-listbox').html('');
              $('.listpage').hide();
              $('.project-content .spinner').show();
              _this.getMyProjectList(1,true);
            }
          }
        });
        _this.getMyProjectList();
      },
      // 字符串转换
			cutstr: function(str, len) {
			    var str_length = 0;
			    var str_len = 0;
			    str_cut = new String();
			    str_len = str.length;
			    for (var i = 0; i < str_len; i++) {
			        a = str.charAt(i);
			        str_length++;
			        if (escape(a).length > 4) {
			            //中文字符的长度经编码之后大于4
			            str_length++;
			        }
			        str_cut = str_cut.concat(a);
			        if (str_length >= len) {
			            str_cut = str_cut.concat("...");
			            return str_cut;
			        }
			    }
			    //如果给定字符串小于指定长度，则返回源字符串；
			    if (str_length < len) {
			        return str;
			    }
			},
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      },
      // 获取我的转让技术列表
      getMyProjectList:function(currentPage,isBidding,status){
				var _this = this,
            isBidding = isBidding == undefined?false:isBidding,
            status = status == undefined?undefined:status;
				$.ajax({
					type:"get",
					url:urlPath + '/web/userCenter/tech/createDesc/techs',
          data:{currentPage:currentPage,isBidding,status,pageSize:8},
					dataType: 'json',
        	
        	success:function(res){
        		console.log(res);
        		var html = '';
            // 加载数据
            if(res.data.rows.length==0){
              $('.project-content .longterm-listbox').hide();
              $('.project-content .project-content-nodata').show();
            }else{
							if(res.data.totalPages==1){
								$('.longterm-listbox').css('margin-bottom','80px');
							}else{
                $('.longterm-listbox').css('margin-bottom','0px');
              }
              if($('.longterm-listbox').css('display')=='none'){
                $('.project-content .project-content-nodata').hide();
                $('.longterm-listbox , .project-content .spinner').show();
              }
              $.each(res.data.rows,function(index,item){
                var code =  item.techTypePath.split(',');
                var title = _this.cutstr(item.title,26);
                html+='<li>\
                    <div class="listbox">\
                      <div class="text-bg"></div>\
                      <h4 class="list-name">'+ title +'</h4>';
                if(item.cover==undefined){
									html+='<img class="list-pic" src="images/common/list_tech.png" alt="">';
								}else{
									html+='<img class="list-pic" src="'+ item.cover +'?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
								}
                if(code[0] != 200){
                  html+=' <div class="patent"></div>\
                          <div class="list-footer" style="padding: 16px 18px;">\
                              <ul class="list-tag">\
                                  <li>'+ item.techTypeName +'</li>\
                                  <li>'+ item.industryName +'</li>\
                                  <li>'+ item.maturityName +'</li>\
                              </ul>';
                }else{
                  html+='<div class="list-footer" style="padding: 16px 18px;">\
                      <ul class="list-tag">\
                          <li>'+ item.industryName +'</li>\
                          <li>'+ item.maturityName +'</li>\
                      </ul>';
                }
                if(item.isBidding== false){
                  $.each(item.prices,function(index,el){
                    if(item.prices.length==1){
  										html+='<div class="list-txt" style="margin-bottom:0;"><span></span><span>&nbsp;</span></div>';
  										if(el.isMarkedPrice==false){
  											html+='<div class="list-txt" style="line-height: 31px; margin-bottom: 16px;"><span>'+ el.tradingModeName +'</span><span style="font-size:24px;">面议</span></div>';
  										}else{
  												html+='<div class="list-txt" style="line-height: 31px; margin-bottom: 16px;"><span>'+ el.tradingModeName +'</span><span style="font-size:24px;">￥'+ el.price +'万</span></div>';
  										}
  									}else{
  										if(el.isMarkedPrice==false){
  											html+='<div class="list-txt"><span style="line-height:normal;">'+ el.tradingModeName +'</span><span>面议</span></div>';
  										}else{
  												html+='<div class="list-txt"><span style="line-height:normal;">'+ el.tradingModeName +'</span><span>￥'+ el.price +'万</span></div>';
  										}
  									}
									})
                }else{
                  html+='<div class="list-txt"><span style="line-height:normal;">转让底价</span><span>￥'+ (item.startPrice/10000) +'万</span></div>';
                  if(item.bidRange >= 10000){
                    html+='<div class="list-txt"><span style="line-height:normal;">加价幅度</span><span>￥'+ (item.bidRange/10000) +'万</span></div>';
                  }else{
                    html+='<div class="list-txt"><span style="line-height:normal;">加价幅度</span><span>￥'+ item.bidRange +'元</span></div>';
                  }
                }
                if(item.description==undefined){
									html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="edit_propertyDetaile.html?tech='+ item.id +'">编辑详情</a> </div></div></div></li>';
								}else{
									var description = _this.cutstr(item.description,165);
									html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="edit_propertyDetaile.html?tech='+ item.id +'">编辑详情</a> </div></div></div></li>';
								}
              })
            }
            $('.project-content .spinner').hide();
            $('.longterm-listbox').append(html);
            $('.listpage').show();
            // 底部翻页
            laypage({
              cont: $('.listpage'), //容器。值支持id名、原生dom对象，jquery对象,
              curr: res.data.currentPage,
              pages: res.data.totalPages, //总页数
              skin: 'molv', //皮肤
              groups:5, //连续分页数
              first: 1, //将首页显示为数字1,。若不显示，设置false即可
              last: false, //将尾页显示为总页数。若不显示，设置false即可
              prev: ' ', //若不显示，设置false即可
              next: ' ', //若不显示，设置false即可
              jump: function(obj, first){ //触发分页后的回调
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                  $('.longterm-listbox').html('');
                  $('.listpage').hide();
                  $('.project-content .spinner').show();
                  setTimeout(function(){$('.project-content .spinner').hide();_this.getMyProjectList(obj.curr,isBidding,status);$('.listpage').show();},500);
                }
              }
            });
        	}
        })
			}
    }
    myProject.init();
  })

})
