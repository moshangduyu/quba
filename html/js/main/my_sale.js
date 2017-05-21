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
    var mySale = {
      // 初始化
      init:function(){
        var _this = this;
        $('#sale_state').selectlist({
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
            if(type=='pendingaudit'){
              $('.sale-listbox').html('');
              $('.listpage').hide();
              $('.sale-content .spinner').show();
              _this.getmySaleList();
            }else{
              $('.sale-listbox').html('');
              $('.listpage').hide();
              $('.sale-content .spinner').show();
              _this.getmySaleList(1,true);
            }
          }
        });
        _this.getmySaleList();
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
      getmySaleList:function(currentPage,status){
				var _this = this,
            status = status == undefined?undefined:status;
				$.ajax({
					type:"get",
					url:urlPath + '/web/userCenter/marketing/right/createDesc/marketingRights',
          data:{currentPage:currentPage,status,pageSize:8},
					dataType: 'json',
        	
        	success:function(res){
        		console.log(res);
        		var html = '';
            // 加载数据
            if(res.data.rows.length==0){
              $('.sale-content .sale-listbox').hide();
              $('.sale-content .longterm-content-nodata').show();
            }else{
							if(res.data.totalPages==1){
								$('.sale-listbox').css('margin-bottom','80px');
							}else{
                $('.sale-listbox').css('margin-bottom','0px');
              }
              if($('.sale-listbox').css('display')=='none'){
                $('.project-content .project-content-nodata').hide();
                $('.sale-listbox , .project-content .spinner').show();
              }
              $.each(res.data.rows,function(index,item){
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

		                  html+='<div class="list-footer">\
				                      <ul class="list-tag">\
			                          <li>'+ item.agentScopeName +'</li>\
			                          <li>'+ item.agentTypeName +'</li>\
			                      </ul>';

		                  html+='<div class="list-txt"><span style="line-height:31px;">代理期限</span><span style="font-size:24px;">'+ item.agentTermName +'</span></div>';

		                if(item.description==undefined){
											html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="edit_saleDetaile.html?marketingright='+ item.id +'">编辑详情</a> </div></div></div></li>';
										}else{
											var description = _this.cutstr(item.description,165);
											html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="edit_saleDetaile.html?marketingright='+ item.id +'">编辑详情</a> </div></div></div></li>';
										}
              })
            }
            $('.sale-content .spinner').hide();
            $('.sale-listbox').append(html);
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
                  $('.sale-listbox').html('');
                  $('.listpage').hide();
                  $('.project-content .spinner').show();
                  setTimeout(function(){$('.project-content .spinner').hide();_this.getmySaleList(obj.curr,isBidding,status);$('.listpage').show();},500);
                }
              }
            });
        	}
        })
			}
    }
    mySale.init();
  })
})
