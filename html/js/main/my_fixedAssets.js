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
        $('#status').selectlist({zIndex: 10,width: 120,height: 35,onChange:function(){}});
        $('#type').selectlist({zIndex: 10,width: 120,height: 35,onChange:function(){
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
          }});
        _this.getMyProjectList();
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
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
      // 获取我的转让技术列表
      getMyProjectList:function(currentPage,isBidding,status){
				var _this = this,
            isBidding = isBidding == undefined?false:isBidding,
            status = status == undefined?undefined:status;
				$.ajax({
					type:"get",
					url:urlPath + '/web/userCenter/fixedasset/createDesc/fixedassets',
          data:{currentPage:currentPage,isBidding,status,pageSize:8},
					dataType: 'json',
        	
        	success:function(res){
        		console.log(res);
        		var html = '';
            // 加载数据
            if(res.data.rows.length==0){
              $('.project-content .longterm-listbox, .project-content .spinner').hide();
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
                html+='<div class="list-footer">';
                if(isBidding==undefined){
                  html+='<ul class="list-tag">';
                }else{
                  html+='<ul class="list-tag" style="margin-bottom:0;">';
                }
                html+=' <li>'+ item.typeName +'</li>\
                        <li>'+ item.regionFullName +'</li>\
                      </ul>';
                if(item.isBidding==false){
                  if(item.isMarkedPrice==false){
  									html+='<div class="list-txt"><span style="line-height:31px;">转让价格：</span><span style="font-size:24px;">面议</span></div>';
  								}else{
                    // if(item.currency=='CNY'){
                      html+='<div class="list-txt"><span style="line-height:31px;">转让价格：</span><span style="font-size:24px;">￥'+ (item.price/10000) +'万</span></div>';
                    // }
                    // if(item.currency=='USD'){
                    //   html+='<div class="list-txt"><span style="line-height:31px;">转让价格：</span><span style="font-size:24px;">$'+ (item.price/10000) +'万</span></div>';
                    // }
  								}
                }else{
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
                  html+='<div class="list-txt"><span style="line-height: inherit;">转让底价：</span><span>￥'+ startPrice +'</span></div>\
  											 <div class="list-txt"><span style="line-height: inherit;">加价幅度：</span><span>￥'+ bidRang +'</span></div>';
                }
                if(item.description==undefined){
  								html+='<div class="list-txt"><p>未填写</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="edit_fixedassetDetaile.html?fixedasset='+ item.id +'">编辑详情</a> </div></div></div></li>';
  							}else{
  								var description = _this.cutstr(item.description,165);
  								html+='<div class="list-txt"><p>'+ description +'</p></div></div></a><div class="hoverlist"> <div class="inner"> <h3>'+ item.title +'</h3> <a target="_blank" href="edit_fixedassetDetaile.html?fixedasset='+ item.id +'">编辑详情</a> </div></div></div></li>';
                }
              })
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
        	}
        })
			}
    }
    myProject.init();
  })

})
