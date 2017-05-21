/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-01
 * @lastChange 2017-03-05
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
    var projectDetaile = {
      // 初始化及函数调用
      init:function(){
        var _this = this;
        _this.isLogin();
        _this.project = _this.getQueryString('project');
      },
      status:[],
      txt:[],
      isSignIn:null,
      investorType:null,
      isLogin:function(){
        var _this = this;
        $.get(urlPath+"/web/user/userInfo").success(function(res){
          if(res.data){
            _this.isSignIn = 0;
            _this.investorType = res.data.investorType;
          }
          _this.getStatus();
        })
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
							_this.status.push(item.key);
							_this.txt.push(item.value);
						});
            // 加载数据
            _this.getDetaile(_this.project);
					}
				})
			},
      //产品图片轮播
      slider:function(){
        jq('#pic_slider').banqh({
          box:"#pic_slider",//总框架
          pic:"#ban_pic1",//大图框架
          pnum:"#ban_num1",//小图框架
          autoplay:false,//是否自动播放
          interTime:5000,//图片自动切换间隔
          delayTime:400,//切换一张图片时间
          order:0,//当前显示的图片（从0开始）
          picdire:true,//大图滚动方向（true为水平方向滚动）
          mindire:true,//小图滚动方向（true为水平方向滚动）
          min_picnum:5,//小图显示数量
          pop_up:false//大图是否有弹出框
        })
      },
      // 项目编号
      project:null,
      // Ajax加载数据
      getDetaile:function(project){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/project/info?project='+project,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            // 详情页基本资料卡片
            var DetaileCard = '';
            if(res.data.cover==undefined){
              DetaileCard+='<img class="fl" src="images/common/banner_project.png" alt="">';
            }
            else{
              DetaileCard+='<img class="fl" src="'+ res.data.cover +'?imageMogr2/thumbnail/!850x380r/gravity/Center/crop/850x380" alt="">';
            }
            DetaileCard+='<div class="fl detaile-topinfobox">\
                            <div class="detaile-topinfobox-head">\
                              <img src="'+ res.data.logo +'" alt="">\
                              <h4>'+ res.data.title +'</h4>\
                              <p>'+ res.data.brief +'</p>\
                            </div>\
                            <ul>\
                              <li>行业领域：'+ res.data.industryName +'</li>';
            if(res.data.regionCode==undefined){
              DetaileCard+='<li>所属地区：<span>未填写</span></li>';
            }else{
              DetaileCard+='<li>所属地区：'+ res.data.regionFullName +'</li>';
            }
            if(res.data.highlight==undefined){
              DetaileCard+='<li>产品数据：<span>未填写</span></li>';
            }else{
              DetaileCard+='<li>产品数据：'+ res.data.highlight +'</li>';
            }
            if(res.data.teamPoint==undefined){
              DetaileCard+='<li>团队特色：<span>未填写</span></li>';
            }else{
              DetaileCard+='<li>团队特色：'+ res.data.teamPoint +'</li>';
            }
            if(res.data.priseName==undefined){
              DetaileCard+='<li>融资阶段：<span>未填写</span></li>';
            }else{
              DetaileCard+='<li>融资阶段：'+ res.data.priseName +'</li>';
            }
            if(res.data.amount==undefined){
              DetaileCard+='<li>融资金额：<span>未填写</span></li>';
            }else{
              DetaileCard+='<li>融资金额：'+ res.data.amount +'万</li>';
            }
            DetaileCard+='</ul><div style="display:block;">\
                              <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=3182624088&amp;site=qq&amp;menu=yes" class="topinfobox-btn btn-talk">约谈</a>\
                            </div>\
                          </div>';
                          // <span class="topinfobox-btn btn-heart">收藏（10）</span>\
            $('.project-detaile-topinfo .spinner').hide();
            $('.project-detaile-topinfo').append(DetaileCard);
            //项目概况
            var projectDec = '';
            projectDec +='<div id="project_dec"><h2>项目介绍</h2>';
            if(res.data.description==undefined){
              projectDec +='<span class="no-data">暂无介绍</span></div>';
            }else{
              projectDec +='<p>' + res.data.description + '</p></div>';
            }
            // 产品图片
            projectDec +='<div id="project_pic"><h2>产品图片</h2>';
            if(res.data.pictures.length==0){
              projectDec +='<span class="no-data">暂无介绍</span></div>';
            }else{
              projectDec+=' <div class="ban" id="pic_slider">\
                        <div class="ban2" id="ban_pic1"><ul>';
              $.each(res.data.pictures,function(index,item){
                projectDec+='<li><a href="javascript:;"><img data-pictureskey="'+ item.key +'" src="'+ item.accessUrl +'"></a></li>';
              });
              projectDec+=' </ul></div>\
                      <div class="min_pic">\
                        <div class="num clearfix" id="ban_num1"><ul>';
              $.each(res.data.pictures,function(index,item){
                projectDec+='<li><a href="javascript:;"><img data-pictureskey="'+ item.key +'" src="'+ item.accessUrl +'?imageMogr2/thumbnail/!150x150r/gravity/Center/crop/150x150"></a></li>';
              });
              projectDec+='</ul></div></div></div></div>';
            }
            // 创始团队
            projectDec +='<div id="project_team">\
                            <h2>创始团队</h2>';
            if(res.data.teams.length==0){
              projectDec +='<span class="no-data">暂无介绍</span></div>';
            }else{
              projectDec +='<ul>';
              $.each(res.data.teams,function(index,item){
                projectDec +='<li>\
                                <span>'+ item.roleName +'</span>\
                                <h2>'+ item.name +'丨'+ item.title +'</h2>\
                                <p>'+ item.brief +'</p>\
                              </li>';
              })
              projectDec +='</ul></div>';
            }
            // 发展动态
            projectDec +='<div id="project_action"><h2>发展动态</h2>';
            if(res.data.events.length==0){
              projectDec +='<span class="no-data">暂无介绍</span></div>';
            }else{
              projectDec +='<ul>';
              $.each(res.data.events,function(index,item){
                var unixTime = new Date(item.eventTime*1000),
                      data = unixTime.getFullYear()+'.'+(unixTime.getMonth()+1)+'.'+unixTime.getDate();
                projectDec +='<li>\
                                <span>'+ data +'</span>\
                                <h3>'+ item.description +'</h3>\
                                <p>&#12288;</p>\
                              </li>';
              })
              projectDec +='</ul></div>';
            }
            $('.project-dec').append(projectDec);
            // 商业计划
            var projectPlan = '';
            projectPlan+='<div id="project_plan"><h2>商业方案</h2>';
            if(_this.isSignIn!=0){
              projectPlan+='<p>你还未登录，请登录后查看<a class="btn-project" href="sign_in.html">登录</a></p>';
            }else{
              switch(_this.investorType){
                case 0:
                  projectPlan+='<p>你还未认证为投资人，不能查看商业方案<a class="btn-project" href="certified_investor.html">马上认证</a></p>';
                  break;
                case 1:
                  projectPlan+='<p>投资人认证审核中，请耐心等待</p>';
                  break;
                case 2:
                  if(res.data.bpBrief==undefined){
                    projectPlan+='<span class="no-data">暂无介绍</span>';
                  }else{
                    projectPlan+='<p>'+ res.data.bpBrief +'</p>';
                  }
                  if(res.data.bps.length!==0){
                    projectPlan+='<a target="_blank" href="'+ res.data.bps[0].downloadUrl +'">下载商业计划书</a>';
                  }
                  projectPlan+='</div>';
                  break;
                default:
                  break;
              }

            }

            $('.project-plan').append(projectPlan);
            // 融资详情
            var financing = '';
            var unixTime = new Date(res.data.registeredTime*1000),
                month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                registeredTime = unixTime.getFullYear()+'-'+month+'-'+date;
            financing+='<h2>融资详情<i class="btn-edit"></i></h2>';
            if(_this.isSignIn!=0){
              financing+='<p>你还未登录，请登录后查看<a class="btn-project" href="sign_in.html">登录</a></p>';
            }else{
              switch(_this.investorType){
                case 0:
                  financing+='<p>你还未认证为投资人，不能查看融资详情<a class="btn-project" href="certified_investor.html">马上认证</a></p>';
                  break;
                case 1:
                  financing+='<p>投资人认证审核中，请耐心等待</p>';
                  break;
                case 2:
                  if(res.data.priseName==undefined){
                    financing+='<table><caption>本轮总体融资计划</caption><tbody>\
                        <tr><td>本轮融资轮次</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>本轮融资类型</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>本轮融资金额</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>本轮出让股权</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>估值</td><td style="color:#9f9f9f;">未填写</td></tr>\
                      </tbody></table>\
                    <table><caption>公司工商信息</caption><tbody>\
                        <tr><td>公司名称</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>法人代表</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>注册资本</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>注册地点</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>成立时间</td><td style="color:#9f9f9f;">未填写</td></tr>\
                        <tr><td>所属行业</td><td style="color:#9f9f9f;">未填写</td></tr>\
                      </tbody></table>';
                  }
                  else{
                    var registeredCapital = parseInt(res.data.registeredCapital).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                    if(res.data.currency=='CNY'){
                      currency = '￥';
                    }
                    if(res.data.currency=='USD'){
                      currency = '$';
                    }
                    financing+='<table><caption>本轮总体融资计划</caption><tbody>\
                        <tr><td>本轮融资轮次</td><td>'+ res.data.priseName +'</td></tr>\
                        <tr><td>本轮融资类型</td><td>'+ res.data.financingTypeName +'</td></tr>\
                        <tr><td>本轮融资金额</td><td>'+ currency + res.data.amount +'万</td></tr>\
                        <tr><td>本轮出让股权</td><td>'+ (res.data.amount/res.data.valuation).toFixed(2)*100 +'%</td></tr>\
                        <tr><td>估值</td><td>'+ currency + res.data.valuation +'万</td></tr>\
                    </tbody></table>\
                    <table><caption>公司工商信息</caption><tbody>\
                      <tr><td>公司名称</td><td>'+ res.data.companyName +'</td></tr>\
                      <tr><td>法人代表</td><td>'+ res.data.artificialPerson +'</td></tr>\
                      <tr><td>注册资本</td><td>￥'+ registeredCapital +'元</td></tr>\
                      <tr><td>注册地点</td><td>'+ res.data.registeredPlace +'</td></tr>\
                      <tr><td>成立时间</td><td>'+ registeredTime +'</td></tr>\
                      <tr><td>所属行业</td><td>'+ res.data.industryName +'</td></tr>\
                    </tbody></table>';
                  }
                  break;
                default:
                  break;
              }
            }
            $('#project_financing').append(financing);
            $('.project-detaile-content .spinner').hide();
            $('.project-detaile-content .detaile-tab,.project-detaile-content .detaile-tablist').show();
            _this.tab();
            _this.slider();
            _this.scrollTab();
          }
        })
      },
      // 选项卡切换
      tab:function(){
        $('.project-detaile-content .detaile-tab a').unbind('click').on('click',function(){
          var aIndex = $('.project-detaile-content .detaile-tab a').index(this);
          $(this).addClass('active').siblings().removeClass('active');
          $('.fixed-tab .detaile-tab a').eq(aIndex).addClass('active').siblings().removeClass('active');
          $('.project-detaile-content .detaile-tablist>li').eq(aIndex).fadeIn(200).siblings('li').hide();
        })
        $('.fixed-tab .detaile-tab a').unbind('click').on('click',function(){
          var aIndex = $('.fixed-tab .detaile-tab a').index(this);
          $(this).addClass('active').siblings().removeClass('active');
          $('.project-detaile-content .detaile-tab a').eq(aIndex).addClass('active').siblings().removeClass('active');
          $('.project-detaile-content .detaile-tablist>li').eq(aIndex).fadeIn(200).siblings('li').hide();
        })
      },
      // 获取Url参数
      getQueryString:function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
      // 项目概况右侧导航切换
      scrollTab:function(){
        var fixedLeft = $('.right-fixedtab').offset().left,
            navTop = $('.project-detaile-content').offset().top,
            decTop = $('#project_dec').offset().top,
            picTop = $('#project_pic').offset().top,
            teamTop = $('#project_team').offset().top,
            actionTop = $('#project_action').offset().top;
        var arr = [];
        arr.push(decTop,picTop,teamTop,actionTop);
        $(window).scroll(function(event) {
          if ($(window).scrollTop()>navTop){
            $('.fixed-tab').show();
            $('.right-fixedtab').css({'position':'fixed','left':fixedLeft,'top':'75px'});
          }else{
            $('.fixed-tab').hide();
            $('.right-fixedtab').css({'position':'absolute','left':'900px','top':'0'});
          }
        });
        $('.right-fixedtab a').unbind('click').on('click',function(){
          var aIndex = $(this).index();
          $(this).addClass('active').siblings().removeClass('active');
          if(aIndex==0){
            $('body,html').animate({scrollTop:arr[aIndex]-55},500);return false;
          }else{
            $('body,html').animate({scrollTop:arr[aIndex]-65},500);return false;
          }
        })
      }
    }
    projectDetaile.init();
  })

})
