/**
 *
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-21
 * @lastChange 2017-03-21
 * @version 1.0.0
 */
define(function(require){
	//jquery
	require("../lib/jquery/jquery-1.10.1.min.js");
	//ajaxUrl 模块
	var url = require('../module/url_main.js'),
		Url = new url(),
		urlPath = Url.url;
	// login 模块
	var login = require("../module/login.js"),
		Login = new login();
		Login.render();

  $(function(){
    var longterm = {
      init:function(){
        var _this = this;
        _this.getList();
        _this.other();
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
			/* ajax加载长期转让固定资产列表 */
      getList:function(currentPage){
        var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/int/createDesc/long/fixedassets',
          data:{currentPage:currentPage},
					dataType: 'json',
        	
        	success:function(res){
						console.log(res);
        		var html = '';
            // 加载数据
            if(res.data.rows.length==0){
              $('.longterm-content .longterm-listbox').hide();
							$('.longterm-content .spinner').hide();
              $('.longterm-content .longterm-content-nodata').show();
            }else{
              if(res.data.totalPages==1){
								$('.longterm-listbox').css('margin-bottom','80px');
							}
              if($('.longterm-listbox').css('display')=='none'){
                $('.longterm-content .longterm-content-nodata').hide();
                $('.longterm-listbox , .longterm-content .spinner').show();
              }
              $.each(res.data.rows,function(index,item){
								var title = _this.cutstr(item.title,24);
								html+='<li>\
                    <div class="listbox">\
											<div class="text-bg"></div>\
                      <h4 class="list-name">'+ title +'</h4>';
								if(item.cover==undefined){
									html+='<img class="list-pic" src="images/common/list_fixedasset.png" alt="">';
								}else{
									html+='<img class="list-pic" src="'+ item.cover +'?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
								}
								html+='<div class="list-footer">\
                  <ul class="list-tag">\
                    <li>'+ item.typeName +'</li>\
                    <li>'+ item.regionFullName +'</li>\
                  </ul>';
                if(item.isMarkedPrice==false){
									html+='<div class="list-txt"><span>转让价格：</span><span>面议</span></div>';
								}else{
                  if(item.currency=='CNY'){
                    html+='<div class="list-txt"><span>转让价格：</span><span>￥'+ (item.price/10000) +'万</span></div>';
                  }else{
                    html+='<div class="list-txt"><span>转让价格：</span><span>$'+ (item.price/10000) +'万</span></div>';
                  }
								}
                if(item.description==undefined){
  								html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a href="longterm_fixedassetDetaile.html?fixedasset='+ item.id +'">查看详情</a> </div></div></div></li>';
  							}else{
  								var description = _this.cutstr(item.description,165);
  								html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a href="longterm_fixedassetDetaile.html?fixedasset='+ item.id +'">查看详情</a> </div></div></div></li>';
                }
              })
	            $('.longterm-content .spinner').hide();
	            $('.longterm-listbox').append(html);
	            // 底部翻页
	            laypage({
	              cont: $('.listpage'), //容器。值支持id名、原生dom对象，jquery对象,
	              curr: currentPage,
	              pages: res.data.totalPages, //总页数
	              skin: 'molv', //皮肤
	              groups:5, //连续分页数
	              first: 1, //将首页显示为数字1,。若不显示，设置false即可
	              last: false, //将尾页显示为总页数。若不显示，设置false即可
	              prev: ' ', //若不显示，设置false即可
	              next: ' ', //若不显示，设置false即可
	              jump: function(obj, first){ //触发分页后的回调
	                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
	                  // 切换正在加载状态，为了使数据加载平滑，加载状态将持续0.5秒
	                  $('.longterm-listbox').html('');
	                  $('.listpage').hide();
	                  $('.longterm-content .spinner').show();
	                  setTimeout(function(){$('.longterm-content .spinner').hide();_this.getList(obj.curr);$('.listpage').show();},500);
	                }
	              }
	            });
          	}
					}
        })
      },
      // 其他效果（右侧固定图标展示）
      other:function(){
				$('.right-fixed li').on('mouseenter',function(){
					if($(this).find('span').length!=0){
						$(this).find('.icon-img').hide();
						$(this).find('span').css('display','block');
					}
				})
				$('.right-fixed li').on('mouseleave',function(){
					if($(this).find('span').length!=0){
						$(this).find('.icon-img').show();
						$(this).find('span').css('display','none');
					}
				})
				$('.fiexd-top').on('click',function(){
					$('body,html').animate({scrollTop:0},500);return false;
				})
			}
    }
    longterm.init();
  })
})
