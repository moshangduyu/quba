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
        _this.getStatus();
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
						_this.getMyProjectList();
					}
				})
			},
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      },
      // 获取我的融资项目列表
      getMyProjectList:function(currentPage){
				var _this = this;
				$.ajax({
					type:"get",
					url:urlPath + '/web/userCenter/project/createDesc/projects',
          data:{currentPage:currentPage,pageSize:8},
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
                          <a target="_blank" href="edit_projectDetaile.html?project='+ item.id +'">\
                            <div class="list-head"><img src="'+ item.logo +'" alt=""></div>\
                            <h4 class="list-name">'+ item.title +'</h4>\
                            <div class="list-dec">'+ item.brief +'</div>';
                if(item.cover!=undefined){
									html+='<img class="list-pic" src="'+ item.cover +'?imageMogr2/thumbnail/!298x125r/gravity/Center/crop/298x125" alt="">';
								}else{
									html+='<img class="list-pic" src="images/common/list_project.png" style="width:298px; height:125px;" alt="">';
								}
                html+=' <div class="list-footer">\
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
									html+='<h5>未申请募资</h5></a></li>';
								}
              })
            }
            $('.project-content .spinner').hide();
            $('.project-listbox').append(html);
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
                  $('.project-listbox').html('');
                  $('.listpage').hide();
                  $('.project-content .spinner').show();
                  setTimeout(function(){$('.project-content .spinner').hide();_this.getMyProjectList(obj.curr);$('.listpage').show();},500);
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
