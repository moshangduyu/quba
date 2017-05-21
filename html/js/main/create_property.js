/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-01
 * @lastChange 2017-03-01
 * @version 1.0.0
 */
define(function(require){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  require("../lib/select/select.js");
  require("../lib/laydate/laydate.js");
  //ajaxUrl 模块
  var url = require("../module/url_main.js"),
    Url = new url(),
    urlPath = Url.url;
  // login 模块
  var login = require("../module/login.js"),
    Login = new login();
    Login.render();
  // 弹窗
  var pop = require("../module/popbox/pop_main.js");

	$(function(){
    var creatProject = {
      data:null,
      // 初始化
      init:function(){
        var _this = this;
        _this.getData();
      },
      getData:function(){
        var _this = this;
        _this.getIndustrys();
        _this.getProv();
        _this.getPatentCountries();
        _this.getTechTypeTrees();
        _this.getMaturitys();
        _this.getTradingModes();

        // 是否专利切换
        $('#techType').selectlist({zIndex: 9,width: 253,height: 42,onChange:function(){
          var key = $('#techType input[name="techType"]').val();
          _this.isTechType(key);
        }});
        // 专利状态切换
        $('#patentStatus').selectlist({zIndex: 7,width: 508,height: 42,onChange:function(){
          var key = $('#patentStatus input[name="patentStatus"]').val();
          _this.isTechStatus(key);
        }});
        // 调用年份
        laydate.skin('molv');
        $('#action_date').on('click',function(event) {
          var self = $(this);
          laydate({
            elem: '#action_date', //目标元素
            format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
            istoday: false,
            isclear: false,
            event:'click', //响应事件。
            choose: function(datas){ //选择日期完毕的回调
              self.attr('data-year', datas);
              _this.addEven();
            }
          });
          event.preventDefault();
          /* Act on the event */
        });
        $('input[name="project_name"],input[name="applyNumber"],input[name="patentNumber"],action_date,.description').bind('input propertychange',function() {
          _this.addEven();
        });
        // 切换转让方式
        $('#isBidding').selectlist({zIndex: 7,width: 508,height: 42,onChange:function(){
          var key = $('#isBidding input[name="isBidding"]').val();
          _this.isTypeBidding(key);
        }});
        // 切换转让价格
        $('.pricesModes').find('#pricesModes1').selectlist({zIndex: 5,width: 242,height: 42,onChange:function(){
          if($('#pricesModes1').parent().find('input[name="pricesModes1"]').val()=='no'){
            $('#pricesModes1').parent().find('span').remove();
          }else{
            if($('#pricesModes1').parent().find('span').length==0){
              var html = '<span><input class="sx-text" type="text" name="prices" value="" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>';
              $('#pricesModes1').parent().append(html);
            }
          }
          $('input[name="prices"],input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
            _this.addSecend();
          });
          _this.addSecend();
        }});

        $('input[name="prices"],input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
          _this.addSecend();
        });
        // 添加交易方式
        $('.add-pricemodes').unbind('click').on('click',function(){
          var html = '';
          html+='<li class="tradingModes2">\
      						<span class="important long-important">交易方式二：</span>\
      						<select id="tradingModes2" name="tradingModes2">\
      							<option value="no">请选择</option>\
      						</select>\
      	        </li>\
                <li class="prices prices2">\
      	          <span class="important long-important">转让价格二：</span>\
      						<div class="pricesModes">\
      							<select id="pricesModes2" name="pricesModes2">\
      								<option value="yes">已有估价</option>\
      								<option value="no">面议</option>\
      							</select>\
      							<span><input class="sx-text" type="text" name="prices" value="" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>\
      	          </div>\
                  <i class="btn-det"></i>\
      	        </li>';
          $('.secend>ul').append(html);
          $('.tradingModes1>span.important').text('交易方式一：').addClass('long-important');
          $('.tradingModes1').next('.prices').find('span.important').text('转让价格一：').addClass('long-important');
          _this.getTradingModes('tradingModes2');
          $(this).hide();
          $('.prices2 .btn-det').unbind('click').on('click',function(){
            $('.tradingModes2,.prices2').remove();
            $('.tradingModes1>span.important').text('交易方式：').removeClass('long-important');
            $('.tradingModes1').next('.prices').find('span.important').text('转让价格：').removeClass('long-important');
            $('.add-pricemodes').show();
            _this.addSecend();
          })

          // 切换转让价格
          $('.pricesModes').find('#pricesModes2').selectlist({zIndex: 3,width: 242,height: 42,onChange:function(){
            if($('#pricesModes2').parent().find('input[name="pricesModes2"]').val()=='no'){
              $('#pricesModes2').parent().find('span').remove();
            }else{
              if($('#pricesModes2').parent().find('span').length==0){
                var html = '<span><input class="sx-text" type="text" name="prices" value="" onkeyup="Num(this);" onafterpaste="Num(this);" placeholder="请填写估价">万</span>';
                $('#pricesModes2').parent().append(html);
              }
            }
            $('input[name="prices"],input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
              _this.addSecend();
            });
            _this.addSecend();
          }});

          $('input[name="prices"],input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
            _this.addSecend();
          });
          _this.addSecend();
        })
      },
      // ajax 获取省份列表
      getProv:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/common/region/firstFegion',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.code +'">'+ item.name +'</option>';
            });
            $('#prov').append(html).selectlist({
              zIndex: 8,
              width: 253,
              height: 42,
              onChange:function(){
                var code = $('#prov input[name="prov"]').val();
                $('#city').remove();
                var dom = '<select id="city" class="city" name="city">\
              							<option value ="no">请选择</option>\
              						</select>';
                $('#citybox').append(dom);
                _this.getCity(code);
                _this.addEven();
              }
            });
          }
        })
      },
      getCity:function(code){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/common/region/getRegionByFather',
          dataType: 'json',
          data:{'code':code},
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.code +'">'+ item.name +'</option>';
            });
            $('#city').append(html).selectlist({
              zIndex: 8,
              width: 253,
              height: 42,
              onChange:function(){
                _this.addEven();
              }
            });
          }
        })
      },
      // ajax 获取行业信息
      getIndustrys:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/industrys',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#industry').append(html).selectlist({
              zIndex: 10,
              width: 508,
              height: 42,
              onChange:function(){
                if($('input[name="industry"]').val()!='no'){
                  _this.industryFlag = true;
                }else{
                  _this.industryFlag = false;
                }
                _this.addEven();
              }
            });
          }
        })
      },
      // ajax 获取专利所属地
      getPatentCountries:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/patentCountries',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#patentCountries').append(html).selectlist({zIndex: 8,width: 508,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // ajax 获取成熟度
      getMaturitys:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/maturitys',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#maturitys').append(html).selectlist({zIndex: 6,width: 508,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // ajax 获取专利类型
      getTechTypeTrees:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/techTypeTrees',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              if(item.name=="专利"){
                $.each(item.childs,function(index, el) {
                  html += '<option value ="'+ el.code +'">'+ el.name +'</option>';
                });
              }
            });
            $('#techTypeChild').append(html).selectlist({zIndex: 9,width: 253,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // 获取交易方式
      getTradingModes:function(obj){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/tech/tradingModes',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            if(obj==undefined){
              $('#tradingModes1').append(html).selectlist({zIndex: 6,width: 508,height: 42,onChange:function(){
                if($('#tradingModes2')!=undefined){
                  var key1 = $('input[name="tradingModes1"]').val();
                  $('#tradingModes2 .select-list>ul>li').show();
                  $('#tradingModes2 .select-list>ul>li').each(function(index, el) {
                    if($(this).attr('data-value')!='no'&&$(this).attr('data-value')==key1){
                      $(this).hide();
                      return false;
                    }
                  });
                }
                _this.addSecend();
              }});
            }else{
              $('#tradingModes2').append(html).selectlist({zIndex: 4,width: 508,height: 42,onChange:function(){
                if($('#tradingModes1')!=undefined){
                  $('#tradingModes1 .select-list>ul>li').show();
                  var key2 = $('input[name="tradingModes2"]').val();
                  $('#tradingModes1 .select-list>ul>li').each(function(index, el) {
                    if($(this).attr('data-value')!='no'&&$(this).attr('data-value')==key2){
                      $(this).hide();
                      return false;
                    }
                  });
                }
                _this.addSecend();
              }});
              if($('input[name="tradingModes2"]').val()=='no'){
                  var key1 = $('input[name="tradingModes1"]').val();
                  $('#tradingModes2 .select-list>ul>li').show();
                  $('#tradingModes2 .select-list>ul>li').each(function(index, el) {
                    if($(this).attr('data-value')!='no'&&$(this).attr('data-value')==key1){
                      $(this).hide();
                      return false;
                    }
                  });
              }
            }
          }
        })
      },
      isTechType:function(key){
        var _this = this;
        if(key ==1){
          $('#techTypeChild,.patentCountries,.patentStatus').show();
          $('.citybox').hide();
        }else{
          $('#techTypeChild,.patentCountries,.patentStatus,.applyNumber,.patentNumber,.date').hide();
          $('.citybox').show();
        }
        _this.addEven();
      },
      isTechStatus:function(key){
        var _this = this;
        if(key =='no'){
          $('.applyNumber,.patentNumber,.date').hide();
        }else if(key ==0){
          $('.patentNumber,.date').hide();
          $('.applyNumber').show();
        }else{
          $('.patentNumber,.date').show();
          $('.applyNumber').hide();
        }
        _this.addEven();
      },
      isTypeBidding:function(key){
        var _this = this;
        if(key==0){
          $('.startPrice,.bidRange,.startTradingModes').hide();
          $('.tradingModes1,.prices').show();
          if($('.prices').length==1){
            $('.add-pricemodes').show();
          }else{
            $('.tradingModes2').show();
          }
        }else{
          $('.startPrice,.bidRange').show();
          $('.prices,.add-pricemodes,.tradingModes2').hide();
        }
        _this.addSecend();
      },
      // 弹窗
      pop:function(options){
        var _this = this;
        var popBox = new pop(options);
        popBox.render();
      },
      // 监听必填项
      addEven:function(){
        var _this = this;

        var data = {},
            title = $('input[name="project_name"]').val(),
            description = $('.description').val(),
            industry = $('input[name="industry"]').val(),
            techType = $('input[name="techType"]').val(),
            maturity = $('input[name="maturitys"]').val();


            if(title!=''&& maturity!='no'&& industry!='no'){
              data.title = title;
              data.industry = industry;
              data.maturity = maturity;
              if(description!=''){
                data.description = description;
              }
              // 专利
              if(techType==1){
                var patentCountry = $('input[name="patentCountries"]').val(),
                    patentStatus = $('input[name="patentStatus"]').val();
                techType = $('input[name="techTypeChild"]').val();
                if(techType!='no'&&patentCountry!='no'&&patentStatus!='no'){
                  data.techType = techType;
                  data.patentStatus = patentStatus;
                  data.patentCountry = patentCountry;
                  // 申请中
                  if(patentStatus==0){
                    var applyNumber = $('input[name="applyNumber"]').val();
                    if(applyNumber!=''){
                      data.applyNumber = applyNumber;
                      $('.first .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                      $('.first .creat-submit').unbind('click').on('click',function(){
                        _this.data = data;
                        $('.first').hide();
                        $('.secend').show();
                        $('.title-label').text('填写转让信息');
                        _this.addSecend();
                      })
                    }else {
                      $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                    }
                  }else{
                    // 已授权
                    var patentNumber = $('input[name="patentNumber"]').val(),
                        year = $('#action_date').attr('data-year');

                    if(patentNumber!=''&&year!=''){
                      var date=' '+ year + ' 00:00:00';
                          date = new Date(Date.parse(date.replace(/-/g, "/")));
                          grantingDate = date.getTime()/1000;
                      data.patentNumber = patentNumber;
                      data.grantingDate = grantingDate;
                      $('.first .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                      $('.first .creat-submit').unbind('click').on('click',function(){
                        _this.data = data;
                        $('.first').hide();
                        $('.secend').show();
                        $('.title-label').text('填写转让信息');
                        _this.addSecend();
                      })
                    }else{
                      $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                    }
                  }
                }else{
                  $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                }
              }else{
                data.techType = '200';
                // 非专利
                var regionCode = $('input[name="prov"]').val();
                if(regionCode!='no'){
                  regionCode = $('input[name="city"]').val();
                  if(regionCode!='no'&&regionCode!=undefined){
                    data.regionCode = regionCode;
                    $('.first .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                    $('.first .creat-submit').unbind('click').on('click',function(){
                      _this.data = data;
                      $('.first').hide();
                      $('.secend').show();
                      $('.title-label').text('填写转让信息');
                      _this.addSecend();
                    })
                  }else{
                    $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                  }
                }else{
                  $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                }
              }
            }else{
              $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
            }
      },
      addSecend:function(){
        var _this = this;
        var data = _this.data;
        var isBidding = $('input[name="isBidding"]').val()==1?true:false;
        data.isBidding = isBidding;
        if(isBidding==false){
          // 长期转让
          if($('.prices').length==1){
            var tradingMode1 = $('input[name="tradingModes1"]').val();
            if(tradingMode1!='no'){
              data.tradingMode1 = tradingMode1;
              delete data.tradingMode2;
              delete data.isMarkedPrice2;
              delete data.price2;
              var isMarkedPrice1 = $('input[name="pricesModes1"]').val()=='yes'?true:false;
              data.isMarkedPrice1 = isMarkedPrice1;
              // 一是否估价
              if(isMarkedPrice1==true){
                var price1 = $('#pricesModes1').next('span').find('input[name="prices"]').val();
                if(price1!=''){
                  data.price1 = price1;
                  $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                  _this.submit();
                }else{
                  $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                }
              }else{
                delete data.price1;
                $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                _this.submit();
              }
            }else{
              $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
            }
          }else{
            var tradingMode1 = $('input[name="tradingModes1"]').val(),
                tradingMode2 = $('input[name="tradingModes2"]').val();
            if(tradingMode1!='no'&&tradingMode2!='no'){
              data.tradingMode1 = tradingMode1;
              data.tradingMode2 = tradingMode2;
              var isMarkedPrice1 = $('input[name="pricesModes1"]').val()=='yes'?true:false,
                  isMarkedPrice2 = $('input[name="pricesModes2"]').val()=='yes'?true:false;
                  // 第一个交易方式是否有价
                if(isMarkedPrice1==true){
                  data.isMarkedPrice1 = isMarkedPrice1;
                  // 第二个交易方式是否有价
                  if(isMarkedPrice2==true){
                    data.isMarkedPrice2 = isMarkedPrice2;
                    var price1 = $('#pricesModes1').next('span').find('input[name="prices"]').val(),
                        price2 = $('#pricesModes2').next('span').find('input[name="prices"]').val();
                    if(price1!=''&&price2!=''){
                      data.price1 = price1;
                      data.price2 = price2;
                      $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                      _this.submit();
                    }else{
                      $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                    }
                  }else{
                    data.isMarkedPrice2 = isMarkedPrice2;
                    delete data.price2;
                    var price1 = $('#pricesModes1').next('span').find('input[name="prices"]').val();
                    if(price1!=''){
                      data.price1 = price1;
                      $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                      _this.submit();
                    }
                  }
                }else{
                  data.isMarkedPrice1 = isMarkedPrice1;
                  delete data.price1;
                  // 第二个交易方式是否有价
                  if(isMarkedPrice2==true){
                    data.isMarkedPrice2 = isMarkedPrice2;
                    var price2 = $('#pricesModes2').next('span').find('input[name="prices"]').val();
                    if(price2!=''){
                      data.price2 = price2;
                      $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                      _this.submit();
                    }else{
                      $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
                    }
                  }else{
                    data.isMarkedPrice2 = isMarkedPrice2;
                    delete data.price2;
                    $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f');
                    _this.submit();
                  }
                }
            }else{
                $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
            }
          }
        }else{
          // 竞价转让
          var tradingMode = $('input[name="tradingModes1"]').val();
          if(tradingMode!='no'){
            data.tradingMode = tradingMode;
            var startPrice = $('input[name="startPrice"]').val(),
                bidRange = $('input[name="bidRange"]').val();
            if(startPrice!=''&&bidRange!=''){
              data.startPrice = (startPrice*10000);
              data.bidRange = (bidRange*10000);
              $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f');
              _this.submit();
            }else{
              $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
            }
          }
        }
        $('.secend .creat-cancel').on('click',function(){
          $('.secend').hide();
          $('.first').show();
          $('.title-label').text('填写基本信息');
        })
      },
      // 提交表单
      submit:function(){
        var _this = this;
        $('.secend .creat-submit').unbind('click').on('click',function(){
          var data = _this.data;
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/tech/createTech',
            data:data,
            dataType: 'json',
            
            success:function(res){
              console.log(res);
              window.location.href = 'my_property.html';
            }
          })
        })
      }
    }
    creatProject.init();
  })

})
