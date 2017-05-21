/**
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
    var loneDetaile = {
      // 初始化及函数调用
      init:function(){
        var _this = this;
        _this.project = _this.getQueryString('tech');
        _this.getDetaile(_this.project);
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
      convertToChinese: function(num){
        var N = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        var str = num.toString();
        var len = num.toString().length;
        var C_Num = [];
        for(var i = 0; i < len; i++){
            C_Num.push(N[str.charAt(i)]);
        }
        return C_Num.join('');
      },
      // Ajax加载数据
      getDetaile:function(project){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/info?tech='+project,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            // 详情页基本资料卡片
            var DetaileCard = '';
            if(res.data.cover==undefined){
              DetaileCard+='<img class="fl" src="images/common/banner_tech.png" alt="">';
            }
            else{
              DetaileCard+='<img class="fl" src="'+ res.data.cover +'?imageMogr2/thumbnail/!850x380r/gravity/Center/crop/850x380" alt="">';
            }
            DetaileCard+='<div class="fl detaile-topinfobox">';
            if(res.data.title.length<=12){
              DetaileCard+='<div class="detaile-topinfobox-head" style="margin-bottom: 69px;">';
            }else{
              DetaileCard+='<div class="detaile-topinfobox-head" style="margin-bottom: 38px;">';
            }

            DetaileCard+=' <h4>'+ res.data.title +'</h4>\
                            </div>\
                            <ul style="margin-bottom:0;">\
                              <li>行业领域：'+ res.data.industryName +'</li>';
            var code =  res.data.techTypePath.split(',');
            if(code[0] == 100){
              if(res.data.patentStatus==0){
                DetaileCard+=' <li>技术类型：发明专利（申请中）</li>\
                               <li>专利所属地：'+ res.data.patentCountryName +'</li>';
              }else{
                DetaileCard+=' <li>技术类型：发明专利（已授权）</li>\
                               <li>专利所属地：'+ res.data.patentCountryName +'</li>';
              }
            }else{
              DetaileCard+=' <li>技术类型：非专利</li>\
                             <li>技术所在地：'+ res.data.regionFullName +'</li>';
            }
            DetaileCard+='<li>成 熟 度：'+ res.data.maturityName +'</li>';
            $.each(res.data.prices,function(index, item) {
              var num = _this.convertToChinese((index+1));
              if(item.isMarkedPrice ==false){
                DetaileCard+='<li>交易方式'+num+'：'+ item.tradingModeName +' <span>面议</span></li>';
              }else{
                DetaileCard+='<li>交易方式'+num+'：'+ item.tradingModeName +' <span>￥'+ item.price +'万</span></li>';
              }
            });
            DetaileCard+='</ul><div style="display:block; position:absolute; top:338px;">\
                              <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=3182624088&amp;site=qq&amp;menu=yes" class="topinfobox-btn btn-talk">咨询详情</a>\
                            </div>\
                          </div>';
                          // <span class="topinfobox-btn btn-heart">收藏（10）</span>\
            $('.longterm-detaile-topinfo .spinner').hide();
            $('.longterm-detaile-topinfo').append(DetaileCard);
            //详细描述
            var projectDec = '';
            projectDec +='<div id="longterm_dec"><h2>详细描述</h2>';
            if(res.data.description==undefined){
              projectDec +='<span class="no-data">暂无介绍</span></div>';
            }else{
              projectDec +='<p>' + res.data.description + '</p></div>';
            }
            // 图片资料
            projectDec +='<div id="longterm_pic"><h2>图片资料</h2>';
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
            $('#longterm_process').before(projectDec);
            $('.longterm-detaile-content .spinner').hide();
            $('.longterm-detaile-content .detaile-tablist').show();
            _this.slider();
            _this.scrollTab();
          }
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
            navTop = $('.longterm-detaile-content').offset().top,
            decTop = $('#longterm_dec').offset().top,
            picTop = $('#longterm_pic').offset().top,
            processTop = $('#longterm_process').offset().top,
            dataTop = $('#longterm_data').offset().top;
            safeTop = $('#longterm_safe').offset().top;
        var arr = [];
        arr.push(decTop,picTop,processTop,dataTop,safeTop);
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
    loneDetaile.init();
  })

})
