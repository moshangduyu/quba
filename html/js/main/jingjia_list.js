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
    var  jingjia = {
      init:function(){
        var _this = this;
        _this.getNav();
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
      // 搜索框搜索
			search:function(){
				var _this = this;
				$('#search_input').unbind().on('keypress',function(event){
					if(event.keyCode=="13"){
						var industry = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
								// longprices = $('#nav_longprices>ul>li.active').attr('data-key')!=undefined?$('#nav_longprices>ul>li.active').attr('data-key'):"",
								techType =$('#typeTree>ul>li.active').attr('data-key')!=undefined?$('#typeTree>ul>li.active').attr('data-key'):"",
								tradingMode =$('#nav_tradingmodes>ul>li.active').attr('data-key')!=undefined?$('#nav_tradingmodes>ul>li.active').attr('data-key'):"",
								maturity = $('#nav_maturitys>ul>li.active').attr('data-key')!=undefined?$('#nav_maturitys>ul>li.active').attr('data-key'):"",
								title = $('#search_input').val();
						$('.longterm-listbox').html('');
						_this.getList("",industry,techType,tradingMode,maturity,title);
					}
				})
			},
      /* 分类筛选
      @nav_industrys：行业领域
      @nav_longprices：交易价格
      @nav_tradingmodes：交易方式
      @nav_maturitys:成熟度
      */
      navSwith:function(){
        var _this = this;
        var obj = ['nav_industrys','nav_longprices','nav_tradingmodes','nav_maturitys'];

        $.each(obj,function(index, el) {
          $('#'+ el +'>ul>li,#typeTree>ul>li').unbind('click').on('click',function(){
            if($(this).hasClass('active')){
              return false;
            }else{
              $(this).addClass('active').siblings('li').removeClass('active');
              var industry = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
                  // longprices = $('#nav_longprices>ul>li.active').attr('data-key')!=undefined?$('#nav_longprices>ul>li.active').attr('data-key'):"",
                  techType =$('#typeTree>ul>li.active').attr('data-key')!=undefined?$('#typeTree>ul>li.active').attr('data-key'):"",
                  tradingMode = $('#nav_tradingmodes>ul>li.active').attr('data-key')!=undefined?$('#nav_tradingmodes>ul>li.active').attr('data-key'):"",
                  maturity = $('#nav_maturitys>ul>li.active').attr('data-key')!=undefined?$('#nav_maturitys>ul>li.active').attr('data-key'):"",
                  title = $('#search_input').val();

							if($(this).parent().parent().attr('id')=='typeTree'){
								if($(this).attr('data-key')=='100'){
									$('#patent-list').show();
								}else{
									$('#patent-list').hide();
									$('#patent-list>ul>li').removeClass('active');
								}
							}
							$('#patent-list>ul>li').unbind('click').on('click',function(){
								if($(this).hasClass('active')){
									return false;
								}else{
									$(this).addClass('active').siblings('li').removeClass('active');
									techType = $('#patent-list>ul>li.active').attr('data-key')!=undefined?$('#patent-list>ul>li.active').attr('data-key'):"";

									$('.longterm-listbox').html('');
		              _this.getList("",industry,techType,tradingMode,maturity,title);
								}

								$(this).find('i').unbind('click').on('click',function(e){
		              $(this).parent().parent().removeClass('active');
		              var industry = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
		                  techType =$('#typeTree>ul>li.active').attr('data-key')!=undefined?$('#typeTree>ul>li.active').attr('data-key'):"",
		                  tradingMode = $('#nav_tradingmodes>ul>li.active').attr('data-key')!=undefined?$('#nav_tradingmodes>ul>li.active').attr('data-key'):"",
		                  maturity = $('#nav_maturitys>ul>li.active').attr('data-key')!=undefined?$('#nav_maturitys>ul>li.active').attr('data-key'):"",
		                  title = $('#search_input').val();
		              $('.longterm-listbox').html('');
		              _this.getList("",industry,techType,tradingMode,maturity,title);
		              e.stopPropagation();
		            })
							})
              $('.longterm-listbox').html('');
              _this.getList("",industry,techType,tradingMode,maturity,title);
            }
						$(this).find('i').unbind('click').on('click',function(e){
							if($(this).parent().parent().attr('data-key') == '100'&& $(this).parent().parent().parent().parent().attr('id')=='typeTree'){
								var self = $(this).parent().parent();
								$('#patent-list>ul>li').each(function(index, el) {
									if($(this).hasClass('active')){
										return false;
									}else{
										self.removeClass('active');
										$('#patent-list').hide();
										var industry = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
			                  techType =$('#typeTree>ul>li.active').attr('data-key')!=undefined?$('#typeTree>ul>li.active').attr('data-key'):"",
			                  tradingMode = $('#nav_tradingmodes>ul>li.active').attr('data-key')!=undefined?$('#nav_tradingmodes>ul>li.active').attr('data-key'):"",
			                  maturity = $('#nav_maturitys>ul>li.active').attr('data-key')!=undefined?$('#nav_maturitys>ul>li.active').attr('data-key'):"",
			                  title = $('#search_input').val();
			              $('.longterm-listbox').html('');
			              _this.getList("",industry,techType,tradingMode,maturity,title);
										return false;
									}
								});
							}else{
								$(this).parent().parent().removeClass('active');
								var industry = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
	                  techType =$('#typeTree>ul>li.active').attr('data-key')!=undefined?$('#typeTree>ul>li.active').attr('data-key'):"",
	                  tradingMode = $('#nav_tradingmodes>ul>li.active').attr('data-key')!=undefined?$('#nav_tradingmodes>ul>li.active').attr('data-key'):"",
	                  maturity = $('#nav_maturitys>ul>li.active').attr('data-key')!=undefined?$('#nav_maturitys>ul>li.active').attr('data-key'):"",
	                  title = $('#search_input').val();
	              $('.longterm-listbox').html('');
	              _this.getList("",industry,techType,tradingMode,maturity,title);
							}
              e.stopPropagation();
            })
          })
        });
      },
      /* 加载分类菜单
        @nav_industrys:行业领域
        @nav_longprices：交易价格
        @nav_tradingmodes：交易方式
        @nav_maturitys：成熟度
      */
      getNav:function(){
        var _this = this;
				_this.getTechTypeTrees();
        var url = ['/web/tech/industrys','/web/tech/tradingModes','/web/tech/maturitys'],
            obj = ['nav_industrys','nav_tradingmodes','nav_maturitys'];
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
						if(obj=='nav_maturitys'){
							// 导航加载完成隐藏动画、调用分类筛选函数
	            $('.longterm-nav .spinner').hide();
	            $('.longterm-nav-row').show();
							$('#patent-list').hide();
						}
          }
        })
      },
			getTechTypeTrees:function(){
				var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/techTypeTrees',
          dataType: 'json',
          
          success:function(res){
            var html = '';
						var list = '';
            $.each(res.data,function(index,item){
              html+='<li data-key="'+ item.code +'"><span>'+ item.name +'<i></i></span></li>';
							$.each(item.childs,function(index, el) {
								list+='<li data-key="'+ el.code +'"><span>'+ el.name +'<i></i></span></li>';
							});
            })
            $('#typeTree>ul').append(html);
						$('#patent-list>ul').append(list);
						_this.navSwith();
          }
        })
			},
      /* ajax加载融资项目列表
          @currentPage:分页参数
          @industry: 行业领域
          @longprices: 交易价格
          @techType: 技术类型
          @tradingMode:交易方式
          @maturity:成熟度
          @status:状态
          @title:技术名称
      */
      getList:function(currentPage,industry,techType,tradingMode,maturity,title){
        var _this = this;
        var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/tech/createDesc/bidding/techs',
          data:{currentPage:currentPage,industry:industry,techType:techType,tradingMode:tradingMode,maturity:maturity,title:title},
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
                          <div class="list-footer">\
                              <ul class="list-tag">\
                                  <li>'+ item.techTypeName +'</li>\
                                  <li>'+ item.industryName +'</li>\
                                  <li>'+ item.maturityName +'</li>\
                              </ul>';
                }else{
                  html+='<div class="list-footer">\
                      <ul class="list-tag">\
                          <li>'+ item.industryName +'</li>\
                          <li>'+ item.maturityName +'</li>\
                      </ul>';
                }
                if(item.currency=="CNY"){
                  html+='<div class="list-txt"><span>转让底价</span><span>￥'+ (item.startPrice/10000) +'万</span></div>';
									if(item.bidRange >= 10000){
										html+='<div class="list-txt"><span>加价幅度</span><span>￥'+ (item.bidRange/10000) +'万</span></div>';
									}else{
										html+='<div class="list-txt"><span>加价幅度</span><span>￥'+ item.bidRange +'元</span></div>';
									}
                }else{
                  html+='<div class="list-txt"><span>转让底价</span><span>$'+ (item.startPrice/10000) +'万</span></div>';
									if(item.bidRange >= 10000){
										html+='<div class="list-txt"><span>加价幅度</span><span>$'+ (item.bidRange/10000) +'万</span></div>';
									}else{
										html+='<div class="list-txt"><span>加价幅度</span><span>$'+ item.bidRange +'元</span></div>';
									}
                }
								if(item.description==undefined){
									html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="jinjia_detaile.html?tech='+ item.id +'">查看详情</a> </div></div></div></li>';
								}else{
									var description = _this.cutstr(item.description,165);
									html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="jinjia_detaile.html?tech='+ item.id +'">查看详情</a> </div></div></div></li>';
								}
              })
            }
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
                setTimeout(function(){$('.longterm-content .spinner').hide();_this.getList(res.data.currentPage-1,industry,techType,tradingMode,maturity,title);$('.listpage').show();},2000);
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
                setTimeout(function(){$('.longterm-content .spinner').hide();_this.getList(res.data.currentPage+1,industry,techType,tradingMode,maturity,title);$('.listpage').show();},2000);
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
                  setTimeout(function(){$('.longterm-content .spinner').hide();_this.getList(obj.curr,industry,techType,tradingMode,maturity,title);$('.listpage').show();},500);
                }
              }
            });
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
				$('#nav_industrys .btn-arrow').on('click',function(event) {
					if($(this).hasClass('up')){
						$(this).removeClass('up').addClass('down').prev().css('height','34px');
					}else{
						$(this).removeClass('down').addClass('up').prev().css('height','auto');
					}
					event.preventDefault();
					/* Act on the event */
				});
			}
    }
    jingjia.init();
  })
})
