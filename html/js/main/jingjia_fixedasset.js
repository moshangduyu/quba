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
    var  longterm = {
      init:function(){
        var _this = this;
        _this.getNav();
        _this.getList(1,_this.data);
        _this.other();
      },
			data:{},
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
      // 搜索框搜索
			search:function(){
				var _this = this,
						data = {};
				$('#search_input').unbind().on('keypress',function(event){
					if(event.keyCode=="13"){
						var source = $('#nav_sources>ul>li.active').attr('data-key')!=undefined?$('#nav_sources>ul>li.active').attr('data-key'):"",
								type =$('#nav_types>ul>li.active').attr('data-key')!=undefined?$('#nav_types>ul>li.active').attr('data-key'):"",
								price = $('#nav_prices>ul>li.active').attr('data-key')!=undefined?$('#nav_prices>ul>li.active').attr('data-key'):"",
								location = $('#nav_locations>ul>li.active').attr('data-key')!=undefined?$('#nav_locations>ul>li.active').attr('data-key'):"",
								title = $('#search_input').val();
						data.source = source;
						data.type = type;
						data.price = price;
						data.location = location;
						data.title = title;

						$('.longterm-listbox').html('');
						_this.getList(1,data);
					}
				})
			},
      /* 分类筛选
      @nav_industrys：行业领域
      @nav_tradingmodes：交易方式
      @nav_maturitys:成熟度
      */
      navSwith:function(){
        var _this = this,
	      		obj = ['nav_sources','nav_prices','nav_types','nav_locations'],
						data = {};

        $.each(obj,function(index, el) {
          $('#'+ el +'>ul>li').unbind('click').on('click',function(){
            if($(this).hasClass('active')){
              return false;
            }else{
              $(this).addClass('active').siblings('li').removeClass('active');
              _this.getSearchData(data);
            }
            $(this).find('i').unbind('click').on('click',function(e){
							$(this).parent().parent().removeClass('active');
							_this.getSearchData(data);
              e.stopPropagation();
            })
          })
        });
			},
      /* 加载分类菜单
        @nav_sources:资产来源
        @nav_prices：转让金额
        @nav_types：资产类型
				@nav_locations:资产所在地
      */
      getNav:function(){
        var _this = this;
        var url = ['/web/fixedasset/sources','/web/fixedasset/prices','/web/fixedasset/types','/web/fixedasset/locations'],
            obj = ['nav_sources','nav_prices','nav_types','nav_locations'];
            $.each(url,function(index, el) {
              _this.getNavlist(el,obj[index]);
            });
      },
      getNavlist:function(url,obj){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + url,
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index,item){
              html+='<li data-key="'+ item.key +'"><span>'+ item.value +'<i></i></span></li>';
            })
            $('#'+ obj +'>ul').append(html);
            _this.navSwith();
						if(obj=='nav_locations'){
							// 导航加载完成隐藏动画、调用分类筛选函数
	            $('.longterm-nav .spinner').hide();
	            $('.longterm-nav-row').show();
							$('#nav_prices').hide();
						}
          }
        })
      },
			getSearchData:function(data){
				var _this = this;
				var source = $('#nav_sources>ul>li.active').attr('data-key')!=undefined?$('#nav_sources>ul>li.active').attr('data-key'):"",
						type =$('#nav_types>ul>li.active').attr('data-key')!=undefined?$('#nav_types>ul>li.active').attr('data-key'):"",
						price = $('#nav_prices>ul>li.active').attr('data-key')!=undefined?$('#nav_prices>ul>li.active').attr('data-key'):"",
						location = $('#nav_locations>ul>li.active').attr('data-key')!=undefined?$('#nav_locations>ul>li.active').attr('data-key'):"",
						title = $('#search_input').val();
				data.source = source;
				data.type = type;
				data.price = price;
				data.location = location;
				data.title = title;

				$('.longterm-listbox').html('');
				_this.getList(1,data);
			},
			/* ajax加载长期转让固定资产列表
          @currentPage:分页参数
          @title: 资产名称
          @source: 资产来源
          @type: 资产类型
          @price:转让金额（本期页面不做）
          @location:资产所在地
      */
      getList:function(currentPage,data){
        var _this = this;
				data.currentPage = currentPage;
				$.ajax({
					type:"get",
					url:urlPath + '/web/fixedasset/createDesc/bidding/fixedassets',
          data:data,
					dataType: 'json',
        	
        	success:function(res){
						console.log(res);
        		var html = '';
            // 加载数据
            if(res.data.rows.length==0){
              $('.longterm-content .longterm-listbox').hide();
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
                  <ul class="list-tag" style="margin-bottom:0;">\
                    <li>'+ item.typeName +'</li>\
                    <li>'+ item.regionFullName +'</li>\
                  </ul>';
								// 转让底价
	              var startPriceNum = item.startPrice;
	              if(startPriceNum>=100000000){
	                var startPrice = (startPriceNum/100000000)+'亿';
	              }else{
	                if(startPriceNum>=10000){
	                  var startPrice = (startPriceNum/10000)+'万';
	                }else{
	                  var startPrice = startPriceNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')+'元';
	                }
	              }
	              // 加价幅度
	              var bidRangeNum = item.bidRange;
	              if(bidRangeNum>100000000){
	                var bidRang = (bidRangeNum/100000000)+'亿';
	              }else{
	                if(bidRangeNum>=10000){
	                  var bidRang = (bidRangeNum/10000)+'万';
	                }else{
	                  var bidRang = bidRangeNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')+'元';
	                }
	              }
								html+='<div class="list-txt"><span>转让底价：</span><span>￥'+ startPrice +'</span></div>\
											 <div class="list-txt"><span>加价幅度：</span><span>￥'+ bidRang +'</span></div>';

                if(item.description==undefined){
  								html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="jinjia_fixedassetDetaile.html?fixedasset='+ item.id +'">查看详情</a> </div></div></div></li>';
  							}else{
  								var description = _this.cutstr(item.description,165);
  								html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="jinjia_fixedassetDetaile.html?fixedasset='+ item.id +'">查看详情</a> </div></div></div></li>';
                }
              })
	            // 切换正在加载状态及搜索栏右侧页数
							if(res.data.rows.length==0){
								$('.search-page').hide();
							}else{
								if(res.data.totalPages==1){
		              $('.search-page').hide();
		            }else{
		              $('.search-page').show().find('.num').html(res.data.currentPage+ '/' + res.data.totalPages);
		            }
							}
	            $('.longterm-content .spinner').hide();
	            $('.longterm-listbox').append(html);
							_this.search();
	            // 搜索栏右侧上一页
	            $('.search-page .search-prev').unbind('click').on('click',function(e){
	              if(res.data.currentPage > 1){
	                $('.search-page .num').html(res.data.currentPage-1 + '/' + res.data.totalPages);
	                $('.longterm-listbox').html('');
	                $('.listpage').hide();
	                $('.longterm-content .spinner').show();
	                setTimeout(function(){$('.longterm-content .spinner').hide();_this.getList(res.data.currentPage-1,data);$('.listpage').show();},2000);
	              }
	              e.stopPropagation();
	            })
	            // 搜索栏右侧下一页
	            $('.search-page .search-next').unbind('click').on('click',function(e){
	              if(res.data.currentPage < res.data.totalPages){
	                $('.search-page .num').html(res.data.currentPage+1 + '/' + res.data.totalPages);
	                $('.longterm-listbox').html('');
	                $('.listpage').hide();
	                $('.longterm-content .spinner').show();
	                setTimeout(function(){$('.longterm-content .spinner').hide();_this.getList(res.data.currentPage+1,data);$('.listpage').show();},2000);
	              }
	              e.stopPropagation();
	            })
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
	                  $('.search-page .num').html(obj.curr+ '/' + obj.pages);
	                  $('.longterm-listbox').html('');
	                  $('.listpage').hide();
	                  $('.longterm-content .spinner').show();
	                  setTimeout(function(){$('.longterm-content .spinner').hide();_this.getList(obj.curr,data);$('.listpage').show();},500);
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