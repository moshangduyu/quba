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
      init:function(){
				var _this = this;
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
      getList:function(currentPage){
				var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/int/createDesc/projects',
          data:{currentPage:currentPage},
					dataType: 'json',
        	
        	success:function(res){
        		var html = '';
            // 加载数据
            if(res.data.rows.length==0){
              $('.project-content .project-listbox').hide();
							$('.longterm-content .spinner').hide();
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
									html+='<div class="list-txt" style=" margin-top:0px; margin-bottom:6px;"><span>创始人</span><p>'+ item.founder +'</p></div>';
								}else{
									html+='<div class="list-txt" style=" margin-top:0px; margin-bottom:6px;"><span>创始人</span><p style="color:#8e8e8e;">未填写</p></div>';
								}
                if(item.highlight!==undefined){
									html+='<div class="list-txt" style="margin-bottom:6px;"><span>产品数据</span><p>'+ item.highlight +'</p></div>';
								}else{
									html+='<div class="list-txt" style="margin-bottom:6px;"><span>产品数据</span><p style="color:#8e8e8e;">未填写</p></div>';
								}
                if(item.teamPoint!=undefined){
									html+='<div class="list-txt" style="margin-bottom:6px;"><span>团队成员</span><p>'+ item.teamPoint +'...</p></div>';
								}else{
									html+='<div class="list-txt" style="margin-bottom:6px;"><span>团队成员</span><p style="color:#8e8e8e;">未填写</p></div>';
								}
                html+='</div>';
								if(item.amount!=undefined){
									$.each(_this.status,function(index, el) {
											if(item.status == el){
												html+='<h5>融资'+item.amount+'万'+' '+ _this.txt[index] +'</h5></a></li>';
											}
									});
								}else{
									html+='<h5>待审核</h5></a></li>';
								}
              })
            }
            $('.project-content .spinner').hide();
            $('.project-listbox').append(html);

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
                  $('.project-listbox').html('');
                  $('.listpage').hide();
                  $('.project-content .spinner').show();
                  setTimeout(function(){$('.project-content .spinner').hide();_this.getList(obj.curr);$('.listpage').show();},500);
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
