/**
 *
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-01
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
		var projectList = {
      // 初始化并调用相关函数
			init:function(){
				var _this = this;
        _this.getNav();
				_this.getStatus();
				_this.other();
			},
			status:[],
			txt: [],
			// 获取项目状态
			getStatus:function(){
				var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/project/status',
					dataType: 'json',
					
					success:function(res){
						$.each(res.data, function(index, item) {
							_this.status.push(item.key);
							_this.txt.push(item.value);
						});
						_this.getList();
					}
				})
			},
			// 搜索框搜索
			search:function(){
				var _this = this;
				$('#search_input').unbind().on('keypress',function(event){
					if(event.keyCode=="13"){
						var key = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
                prise = $('#nav_financing>ul>li.active').attr('data-key')!=undefined?$('#nav_financing>ul>li.active').attr('data-key'):"",
                status = $('#nav_status>ul>li.active').attr('data-key')!=undefined?$('#nav_status>ul>li.active').attr('data-key'):"",
								title = $(this).val();
						$('.project-listbox').html('');
            _this.getList("",key,prise,status,title);
					}
				})
			},
			/* 分类筛选
      @nav_industrys：行业领域
      @nav_financing：融资轮次
      @nav_status：项目状态
      */
      navSwith:function(){
        var _this = this;
        var obj = ['nav_industrys','nav_financing','nav_status'];

				$.each(obj,function(index, el) {
					$('#'+ el +'>ul>li').unbind('click').on('click',function(){
						if($(this).hasClass('active')){
							return false;
						}else{
	            $(this).addClass('active').siblings('li').removeClass('active');
	            var key = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
	                prise = $('#nav_financing>ul>li.active').attr('data-key')!=undefined?$('#nav_financing>ul>li.active').attr('data-key'):"",
	                status = $('#nav_status>ul>li.active').attr('data-key')!=undefined?$('#nav_status>ul>li.active').attr('data-key'):"",
									title = $('#search_input').val();
	            $('.project-listbox').html('');
	            _this.getList("",key,prise,status,title);
	          }
						$(this).find('i').unbind('click').on('click',function(e){
							$(this).parent().parent().removeClass('active');
							var key = $('#nav_industrys>ul>li.active').attr('data-key')!=undefined?$('#nav_industrys>ul>li.active').attr('data-key'):"",
	                prise = $('#nav_financing>ul>li.active').attr('data-key')!=undefined?$('#nav_financing>ul>li.active').attr('data-key'):"",
	                status = $('#nav_status>ul>li.active').attr('data-key')!=undefined?$('#nav_status>ul>li.active').attr('data-key'):"",
									title = $('#search_input').val();
	            $('.project-listbox').html('');
	            _this.getList("",key,prise,status,title);
							e.stopPropagation();
						})
	        })
				})
			},
			/* 加载分类菜单
        @nav_industrys:行业领域
        @nav_financing:融资轮次
        @nav_status:项目状态
      */
      getNav:function(){
				var _this = this;
        var url = ['/web/project/industrys','/web/project/financing/prises','/web/project/status'],
            obj = ['nav_industrys','nav_financing','nav_status'];
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
						if(obj=='nav_status'){
							$('#nav_status>ul>li').each(function(index, el) {
								if($(this).attr('data-key') == '0' || $(this).attr('data-key') == '1' || $(this).attr('data-key') == '5'){
									$(this).remove();
								}
							});
							// 导航加载完成隐藏动画、调用分类筛选函数
	            $('.project-nav .spinner').hide();
	            $('.project-nav-row').show();
						}
          }
        })
      },
      /* ajax加载融资项目列表
          @currentPage:分页参数
          @industry: 行业领域
          @prise: 融资轮次
          @status:融资状态
					@title:技术名称
      */
			getList:function(currentPage,industry,prise,status,title){
				var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/project/createDesc/projects',
          data:{currentPage:currentPage,industry:industry,prise:prise,status:status,title:title},
					dataType: 'json',
        	
        	success:function(res){
						console.log(res);
        		var html = '';
            // 加载数据
            if(res.data.rows.length==0){
              $('.project-content .project-listbox').hide();
              $('.project-content .project-content-nodata').show();
            }else{
							if(res.data.totalPages==1){
								$('.project-listbox').css('margin-bottom','80px');
							}
              if($('.project-listbox').css('display')=='none'){
                $('.project-content .project-content-nodata').hide();
                $('.project-listbox , .project-content .spinner').show();
              }
              $.each(res.data.rows,function(index,item){
                html+=' <li>\
                          <a href="project_detaile.html?project='+ item.id +'">\
                            <div class="list-head"><img src="'+ item.logo +'" alt=""></div>\
                            <h4 class="list-name">'+ item.title +'</h4>\
                            <div class="list-dec">'+ item.brief +'</div>';
								if(item.cover!=undefined){
									html+='<img class="list-pic" src="'+ item.cover +'?imageMogr2/thumbnail/!298x125r/gravity/Center/crop/298x125" alt="">';
								}else{
									html+='<img class="list-pic" src="images/common/list_project.png" alt="">';
								}
                html+='<div class="list-footer">\
                              <ul class="list-tag">';
								if(item.priseName!==undefined){
									html+='<li>'+ item.priseName +'</li>';
								}
                html+='<li>'+ item.industryName +'</li></ul>';
								if(item.founder!==undefined){
									html+='<div class="list-txt"><span>创始人</span><p>'+ item.founder +'</p></div>';
								}else{
									html+='<div class="list-txt"><span>创始人</span><p style="color:#8e8e8e;">未填写</p></div>';
								}
                if(item.highlight!==undefined){
									html+='<div class="list-txt"><span>产品数据</span><p>'+ item.highlight +'</p></div>';
								}else{
									html+='<div class="list-txt"><span>产品数据</span><p style="color:#8e8e8e;">未填写</p></div>';
								}
                if(item.teamPoint!=undefined){
									html+='<div class="list-txt"><span>团队成员</span><p>'+ item.teamPoint +'...</p></div>';
								}else{
									html+='<div class="list-txt"><span>团队成员</span><p style="color:#8e8e8e;">未填写</p></div>';
								}
                html+='</div>';
								if(item.amount!=undefined){
									$.each(_this.status,function(index, el) {
											if(item.status == el){
												html+='<h5>融资'+item.amount+'万'+' '+ _this.txt[index] +'</h5></a></li>';
											}
									});
								}else{
									$.each(_this.status,function(index, el) {
											if(item.status == el){
												html+='<h5>无融资金额'+' '+ _this.txt[index] +'</h5></a></li>';
											}
									});
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
            $('.project-content .spinner').hide();
            $('.project-listbox').append(html);
						_this.search();
            // 搜索栏右侧上一页
            $('.search-page .search-prev').unbind('click').on('click',function(e){
              if(res.data.currentPage > 1){
                $('.search-page .num').html(res.data.currentPage-1 + '/' + res.data.totalPages);
                $('.project-listbox').html('');
                $('.listpage').hide();
                $('.project-content .spinner').show();
                setTimeout(function(){$('.project-content .spinner').hide();_this.getList(res.data.currentPage-1,prise,industry,status,title);$('.listpage').show();},2000);
              }
              e.stopPropagation();
            })
            // 搜索栏右侧下一页
            $('.search-page .search-next').unbind('click').on('click',function(e){
              if(res.data.currentPage < res.data.totalPages){
                $('.search-page .num').html(res.data.currentPage+1 + '/' + res.data.totalPages);
                $('.project-listbox').html('');
                $('.listpage').hide();
                $('.project-content .spinner').show();
                setTimeout(function(){$('.project-content .spinner').hide();_this.getList(res.data.currentPage+1,prise,industry,status,title);$('.listpage').show();},2000);
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
                  $('.project-listbox').html('');
                  $('.listpage').hide();
                  $('.project-content .spinner').show();
                  setTimeout(function(){$('.project-content .spinner').hide();_this.getList(obj.curr,prise,industry,status,title);$('.listpage').show();},500);
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
			}
		}
		projectList.init();
	})
})
