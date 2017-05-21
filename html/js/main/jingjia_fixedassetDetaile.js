/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-21
 * @lastChange 2017-03-21
 * @version 1.0.0
 */
define(function(require){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  // 弹窗
  var pop = require("../module/popbox/pop_main.js");
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
        _this.project = _this.getQueryString('fixedasset');
        _this.getDetaile(_this.project);
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
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
      startPrice:0,
      bidRange:0,
      currency:null,
      // Ajax加载数据
      getDetaile:function(project){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/fixedasset/info?fixedasset='+project,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            _this.startPrice = res.data.startPrice;
            _this.bidRange = res.data.bidRange;
            _this.currency = res.data.currency;
            // 详情页基本资料卡片
            var DetaileCard = '',
                bidRangeNum = res.data.bidRange;
            if(bidRangeNum<1000){
              var bidRang = bidRangeNum+'元';
            }
            if(bidRangeNum<10000&&bidRangeNum>1000){
              var bidRang = res.bidRangeNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')+'元';
            }
            if(bidRangeNum>=10000){
              var bidRang = (bidRangeNum/10000) + '万';
            }
            if(res.data.cover==undefined){
              DetaileCard+='<img class="fl" src="images/common/banner_fixedasset.png" alt="">';
            }
            else{
              DetaileCard+='<img class="fl" src="'+ res.data.cover +'?imageMogr2/thumbnail/!850x380r/gravity/Center/crop/850x380" alt="">';
            }
            DetaileCard+='<div class="fl detaile-topinfobox jingjia">';
            if(res.data.title.length<=12){
              DetaileCard+='<div class="detaile-topinfobox-head" style="margin-bottom: 91px;">';
            }else{
              DetaileCard+='<div class="detaile-topinfobox-head" style="margin-bottom: 61px;">';
            }

            DetaileCard+=' <h4>'+ res.data.title +'</h4>\
                            </div>\
                            <ul style="margin-bottom: 0px; padding-bottom:45px;">\
                            <li>资产类型：'+ res.data.typeName +'</li>\
                            <li>资产所在地：'+ res.data.regionFullName +'</li>\
                            <li>资产来源：'+ res.data.sourceName +'</li>';
            if(res.data.startPrice>=1000){
              DetaileCard+='<li>转让底价：<span class="detaile-startprice">￥'+ (res.data.startPrice/10000) +'万</span>';
            }else{
              DetaileCard+='<li>转让底价：<span class="detaile-startprice">￥'+ (res.data.startPrice) +'元</span>';
            }
            if(res.data.bidRange >= 10000){
              DetaileCard+='<div class="add-info">加价幅度：<span>￥'+ (res.data.bidRange/10000) +'万</span></div></li>';
            }else{
              DetaileCard+='<div class="add-info">加价幅度：<span>￥'+ bidRang +'</span></div></li>';
            }
            if(res.data.startBiddingTime!=undefined){
              var unixTime = new Date(res.data.startBiddingTime),
                  month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                  date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                  startBiddingTime = unixTime.getFullYear()+'.'+month+'.'+date;
              DetaileCard+='<li>竞价开始：<span style="letter-spacing:-1px;">'+ startBiddingTime +'</span>';
              if(res.data.endBiddingTime!=undefined){
                var unixTime2 = new Date(res.data.endBiddingTime),
                    month = unixTime2.getMonth()+1>9?unixTime2.getMonth()+1:'0'+(unixTime2.getMonth()+1),
                    date = unixTime2.getDate()>9?unixTime2.getDate():'0'+unixTime2.getDate(),
                    endBiddingTime = unixTime2.getFullYear()+'.'+month+'.'+date;
                DetaileCard+='<div class="end-time">竞价结束：<span style="letter-spacing:-1px;">'+ endBiddingTime +'</span></div></li>';
              }else{
                DetaileCard+='</li>';
              }
            }
            DetaileCard+='</ul><div class="cf" style="position: absolute; top: 338px;">\
                <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=3182624088&amp;site=qq&amp;menu=yes" class="topinfobox-btn btn-talk">咨询详情</a>\
                <span class="topinfobox-btn btn-jingjia">参与竞价</span>\
            </div></div>';

            // <span class="topinfobox-btn btn-heart">收藏(10)</span>\
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
            _this.jingjia();
          }
        })
      },
      createjingjia:function(){
        var _this = this;

        $.ajax({
          type:"get",
          url:urlPath + '/web/userCenter/fixedasset/isQuoted?fixedasset='+ _this.project,
          dataType: 'json',
          
          success:function(res){
            if(res.data==true){
              $('.btn-jingjia').addClass('active').text('已参与竞价');
              $('.btn-jingjia').unbind('click').on('click',function(){
                var options = {
                  msg:'您已提交过报价！',
                  btn:'<a class="btn-sm">确定</a>',
                  callback:function(){
                    $('.btn-sm').on('click',function(){
                      $('.pop-bg,.pop-box').remove();
                    })
                  }
                }
                _this.pop(options);
              })
            }else{
              $('.btn-jingjia').unbind('click').on('click',function(){
                var price = _this.startPrice;
                var bidrang = _this.bidRange;
                var currency = _this.currency=='CNY'?'￥':'$';

                if(price>=1000){
                  statTxt = price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                }else{
                  statTxt = price;
                }
                if(bidrang>=1000){
                  bidTxt = bidrang.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                }else{
                  bidTxt = bidrang;
                }
                var html = '<span style="float:left; line-height:42px;">您的出价：</span><span class="btn-jian"></span><input class="input-jingjia" type="text" disabled="disabled" onkeyup="Num(this);" onafterpaste="Num(this);" ><span class="btn-jia"></span><span class="jingjiaTxt">目前最低报价为:'+ currency + statTxt +'，每次加价幅度为：'+ currency + bidTxt + '</span>'
                var options = {
                  msg:html,
                  btn:'<a class="btn-sm btn-submitjingjia">确认出价</a>'
                }
                _this.pop(options);
                if(price>=1000){
                  num = price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                  $('.input-jingjia').val(num);
                }else{
                  $('.input-jingjia').val(price);
                }
                $('.input-jingjia').attr('data-num',price);
                $('.btn-submitjingjia').on('click', function(event) {
                  var price =  parseInt($('.input-jingjia').attr('data-num'));
                  if(price!=''){
                    $.ajax({
                      type:"post",
                      url:urlPath + '/web/userCenter/fixedasset/quote',
                      data:{fixedasset:_this.project,price:price},
                      dataType: 'json',
                      
                      success:function(res){
                        $('.pop-box,.pop-bg').remove();
                        $('.btn-jingjia').addClass('active').text('已参与竞价');
                        window.location.reload();
                      }
                    })
                  }
                  event.preventDefault();
                });
                $('.btn-jia').unbind('click').on('click',function(event) {
                  var add = parseInt($('.input-jingjia').attr('data-num'));
                  add += bidrang;
                  if(add>=1000){
                    num = add.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                    $('.input-jingjia').val(num);
                  }else{
                    $('.input-jingjia').val(add);
                  }
                  $('.input-jingjia').attr('data-num',add);
                  event.preventDefault();
                });
                $('.btn-jian').unbind('click').on('click',function(event) {
                  var reduce = parseInt($('.input-jingjia').attr('data-num'));
                   if(reduce<=price){
                     return false;
                   }else{
                     reduce-= bidrang;
                     if(reduce<1000){
                       $('.input-jingjia').val(reduce);
                     }else{
                       num = reduce.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                       $('.input-jingjia').val(num);
                     }
                     $('.input-jingjia').attr('data-num',reduce);
                   }
                  event.preventDefault();
                });
              })
            }
          }
        })
      },
      jingjia:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/fixedasset/biddings?fixedasset='+this.project,
          dataType: 'json',
          
          success:function(res){
            console.log(res);
            var html = '';
            html+='<table><tbody>\
                    <tr>\
                        <td>用户</td>\
                        <td>竞价时间</td>\
                        <td>报价</td>\
                    </tr>';
            if(res.data.rows.length!=0){
              $.each(res.data.rows,function(index, item) {
                var unixTime = new Date(item.createTime),
                    month = unixTime.getMonth()+1>9?unixTime.getMonth()+1:'0'+(unixTime.getMonth()+1),
                    date = unixTime.getDate()>9?unixTime.getDate():'0'+unixTime.getDate(),
                    createTime = unixTime.getFullYear()+'.'+month+'.'+date;
                html +='<tr>\
                          <td>'+ item.nickname +'</td>\
                          <td>'+ createTime +'</td>\
                          <td>不公开</td>\
                      </tr>';
              });
              html +='</tbody></table>';
              $('#longterm_user').append(html);
            }else{
              html +='<tr>\
                        <td>暂无</td>\
                        <td>暂无</td>\
                        <td>不公开</td>\
                    </tr></tbody></table>';
              $('#longterm_user').append(html);
            }
            _this.createjingjia();
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
            userTop = $('#longterm_user').offset().top;
        var arr = [];
        arr.push(decTop,picTop,processTop,dataTop,userTop);
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
      },
      formatNumber: function (num) {
        if (isNaN(num)) {
          throw new TypeError("num is not a number");
        }
        return ("" + num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      }
    }
    loneDetaile.init();
  })

})
