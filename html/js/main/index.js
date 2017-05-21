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
    var index = {
			init:function(){
				var _this = this;
				_this.getStatus();
				_this.getJingjiaList();
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
							status.push(item.key);
							txt.push(item.value);
						});
						_this.getProject(status,txt);
					}
				})
			},
			// 融资项目推荐
			getProject:function(status,txt){
				var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/homepage/recommend/projects',
					dataType: 'json',
					
					success:function(res){
						var html = '';
						$.each(res.data.rows, function(index, item) {
							html += '<li>\
											 	<a href="project_detaile.html?project='+ item.project.id +'">\
												<div class="list-head"><img src="'+ item.project.logo +'" alt=""></div>\
												<h4 class="list-name">'+ item.project.title +'</h4>\
												<div class="list-dec">'+ item.project.brief +'</div>';
							if(item.project.cover!=undefined){
								html+='<img class="list-pic" src="'+ item.project.cover +'?imageMogr2/thumbnail/!298x125r/gravity/Center/crop/298x125" alt="">';
							}else{
								html+='<img class="list-pic" src="images/common/list_project.png" alt="">';
							}
							html+='<div class="list-footer">\
														<ul class="list-tag">';
							if(item.project.priseName!==undefined){
								html+='<li>'+ item.project.priseName +'</li>';
							}
							html+='<li>'+ item.project.industryName +'</li></ul>';
							if(item.project.founder!==undefined){
								html+='<div class="list-txt"><span>创始人</span><p>'+ item.project.founder +'</p></div>';
							}else{
								html+='<div class="list-txt"><span>创始人</span><p style="color:#8e8e8e;">未填写</p></div>';
							}
							if(item.project.highlight!==undefined){
								html+='<div class="list-txt"><span>产品数据</span><p>'+ item.project.highlight +'</p></div>';
							}else{
								html+='<div class="list-txt"><span>产品数据</span><p style="color:#8e8e8e;">未填写</p></div>';
							}
							if(item.project.teamPoint!=undefined){
								html+='<div class="list-txt"><span>团队成员</span><p>'+ item.project.teamPoint +'...</p></div>';
							}else{
								html+='<div class="list-txt"><span>团队成员</span><p style="color:#8e8e8e;">未填写</p></div>';
							}
							html+='</div>';
							if(item.project.amount!=undefined){
								$.each(status,function(index, el) {
										if(item.project.status == el){
											html+='<h5>融资'+item.project.amount+'万'+' '+ txt[index] +'</h5></a></li>';
										}
								});
							}else{
								html+='<h5>待审核</h5></a></li>';
							}
						});
						$('.project-listbox').append(html);
					}
				})
			},
			// 竞价项目推荐
			getJingjiaList:function(){
				var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/homepage/recommend/techs',
					dataType: 'json',

					success:function(res){
						console.log(res);
						var html = '';
						$.each(res.data.rows,function(index, item) {
							if(item.type =='tech'){
								var code =  item.tech.techTypePath.split(',');
								var title = _this.cutstr(item.tech.title,26);
                html+='<li>\
                    <div class="listbox">\
											<div class="text-bg"></div>\
                      <h4 class="list-name">'+ title +'</h4>';
								if(item.tech.cover==undefined){
									html+='<img class="list-pic" src="images/common/list_tech.png" alt="">';
								}else{
									html+='<img class="list-pic" src="'+ item.tech.cover +'?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
								}
								if(code[0] != 200){
                  html+=' <div class="patent"></div>\
                          <div class="list-footer">\
                              <ul class="list-tag">\
                                  <li>'+ item.tech.techTypeName +'</li>\
                                  <li>'+ item.tech.industryName +'</li>\
                                  <li>'+ item.tech.maturityName +'</li>\
                              </ul>';
                }else{
                  html+='<div class="list-footer">\
                      <ul class="list-tag">\
                          <li>'+ item.tech.industryName +'</li>\
                          <li>'+ item.tech.maturityName +'</li>\
                      </ul>';
                }
                if(item.tech.currency=="CNY"){
                  html+='<div class="list-txt"><span>转让底价</span><span>￥'+ (item.tech.startPrice/10000) +'万</span></div>';
									if(item.tech.bidRange >= 10000){
										html+='<div class="list-txt"><span>加价幅度</span><span>￥'+ (item.tech.bidRange/10000) +'万</span></div>';
									}else{
										html+='<div class="list-txt"><span>加价幅度</span><span>￥'+ item.tech.bidRange +'元</span></div>';
									}
                }else{
                  html+='<div class="list-txt"><span>转让底价</span><span>$'+ (item.tech.startPrice/10000) +'万</span></div>';
									if(item.tech.bidRange >= 10000){
										html+='<div class="list-txt"><span>加价幅度</span><span>$'+ (item.tech.bidRange/10000) +'万</span></div>';
									}else{
										html+='<div class="list-txt"><span>加价幅度</span><span>$'+ item.tech.bidRange +'元</span></div>';
									}
                }
								if(item.tech.description==undefined){
									html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.tech.title +'</h3> <a href="jinjia_detaile.html?tech='+ item.tech.id +'">查看详情</a> </div></div></div></li>';
								}else{
									var description = _this.cutstr(item.tech.description,165);
									html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.tech.title +'</h3> <a href="jinjia_detaile.html?tech='+ item.tech.id +'">查看详情</a> </div></div></div></li>';
								}
							}else{
								var title = _this.cutstr(item.fixedasset.title,24);
								html+='<li>\
                    <div class="listbox">\
											<div class="text-bg"></div>\
                      <h4 class="list-name">'+ title +'</h4>';
								if(item.fixedasset.cover==undefined){
									html+='<img class="list-pic" src="images/common/list_fixedasset.png" alt="">';
								}else{
									html+='<img class="list-pic" src="'+ item.fixedasset.cover +'" alt="">';
								}
								html+='<div class="list-footer">\
                  <ul class="list-tag" style="margin-bottom:0;">\
                    <li>'+ item.fixedasset.typeName +'</li>\
                    <li>'+ item.fixedasset.regionFullName +'</li>\
                  </ul>';
								// 转让底价
	              var startPriceNum = item.fixedasset.startPrice;
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
	              var bidRangeNum = item.fixedasset.bidRange;
	              if(bidRangeNum>100000000){
	                var bidRang = (bidRangeNum/100000000)+'亿';
	              }else{
	                if(bidRangeNum>=10000){
	                  var bidRang = (bidRangeNum/10000)+'万';
	                }else{
	                  var bidRang = bidRangeNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')+'元';
	                }
	              }
								html+='<div class="list-txt"><span>转让底价：</span><span>'+ startPrice +'</span></div>\
											 <div class="list-txt"><span>加价幅度：</span><span>'+ bidRang +'</span></div>';

                if(item.fixedasset.description==undefined){
  								html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.fixedasset.title +'</h3> <a href="jinjia_fixedassetDetaile.html?fixedasset='+ item.fixedasset.id +'">查看详情</a> </div></div></div></li>';
  							}else{
  								var description = _this.cutstr(item.fixedasset.description,165);
  								html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.fixedasset.title +'</h3> <a href="jinjia_fixedassetDetaile.html?fixedasset='+ item.fixedasset.id +'">查看详情</a> </div></div></div></li>';
                }
							}
						});
						$('.longterm-listbox').append(html);
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
		index.init();
  })
})
