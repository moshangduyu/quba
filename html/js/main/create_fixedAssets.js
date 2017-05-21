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
      // 初始化
      init:function(){
        var _this = this;
        _this.getData();
      },
      getData:function(){
        var _this = this;
        _this.getSources();
        _this.getTypes();
        _this.getProv();
        _this.getTradingModes();
        $('input[name="project_name"],.description,input[name="prices"],input[name="startPrice"],input[name="bidRange"]').bind('input propertychange',function() {
          _this.addEven();
        });
        $('.secend .creat-cancel').unbind().on('click',function(){
          $('.first').show();
          $('.secend').hide();
        })
      },
      // 获取资产来源
      getSources:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/fixedasset/sources',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#sources').append(html).selectlist({zIndex: 10,width: 508,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // 获取资产类型
      getTypes:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/fixedasset/types',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#types').append(html).selectlist({zIndex: 9,width: 508,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // 获取转让价格
      getPrices:function(){
        fixedasset/prices
      },
      getTradingModes:function(){
        var _this = this;
        $('#isBidding').selectlist({zIndex: 10,width: 508,height: 42,onChange:function(){
          var key = $('#isBidding input[name="isBidding"]').val();
          _this.isTypeBidding(key);
        }});
        $('#pricesModes').selectlist({zIndex: 9,width: 240,height: 42,onChange:function(){
          var key = $('input[name="pricesModes"]').val();
          if(key=='no'){
            $('.pricesModes>span').hide();
          }else{
            $('.pricesModes>span').show();
            $('input[name="prices"]').val('');
          }
          _this.addEven();
        }});
      },
      // 获取省份列表
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
            $('#prov').append(html).selectlist({zIndex: 8,width: 253,height: 42,onChange:function(){
              var code = $('#prov input[name="prov"]').val();
              $('#city').remove();
              var dom = '<select id="city" class="city" name="city">\
            							<option value ="no">请选择</option>\
            						</select>';
              $('#citybox').append(dom);
              _this.getCity(code);
              _this.addEven();
            }});
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
            $('#city').append(html).selectlist({zIndex: 8,width: 253,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      isTypeBidding:function(key){
        var _this = this;
        if(key==0){
          $('.startPrice,.bidRange').hide();
          $('.prices').show();
        }else{
          $('.startPrice,.bidRange').show();
          $('.prices').hide();
        }
        _this.addEven();
      },
      addEven:function(){
        var _this = this,
            data = {},
            title = $('input[name="project_name"]').val(),
            description = $('.description').val(),
            type = $('input[name="types"]').val(),
            regionCode = $('input[name="prov"]').val(),
            source = $('input[name="sources"]').val();
            if(title!=''&& type!='no'&& source!='no'&&regionCode!='no'){
              data.title = title;
              data.type = type;
              data.source = source;
              regionCode = $('input[name="city"]').val();
              if(regionCode!='no'&&regionCode!=undefined){
                data.regionCode = regionCode;
                if(description!=''){
                  data.description = description;
                }
                _this.addSecend(data);
                $('.first .creat-submit').removeAttr('disabled').css('background','#f4d13f').on('click',function(event) {
                  $('.first').hide();
                  $('.secend').show();
                  event.preventDefault();
                });
              }else{
                $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
              }
            }else{
              $('.first .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
            }
      },
      addSecend:function(data){
        var _this = this,
            isBidding = $('input[name="isBidding"]').val()=='0'?false:true;
            data.isBidding = isBidding;
        if(isBidding==false){
          var isMarkedPrice = $('input[name="pricesModes"]').val();
          if(isMarkedPrice=='yes'){
            data.isMarkedPrice = true;
            var price = $('input[name="prices"]').val();
            if(price!=''){
              data.price = price*10000;
              $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f').unbind().on('click',function(event) {
                _this.submit(data);
                event.preventDefault();
              });
            }else{
              $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
            }
          }else{
            console.log(2);
            data.isMarkedPrice = false;
            $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f').unbind().on('click',function(event) {
              _this.submit(data);
              event.preventDefault();
            });
          }
        }else{
          var startPrice = $('input[name="startPrice"]').val(),
              bidRange = $('input[name="bidRange"]').val();
          if(startPrice!=''&&bidRange!=''){
            data.startPrice = startPrice*10000;
            data.bidRange = bidRange*10000;
            $('.secend .creat-submit').removeAttr('disabled').css('background','#f4d13f').unbind().on('click',function(event) {
              _this.submit(data);
              event.preventDefault();
            });
          }else{
            $('.secend .creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
          }
        }
      },
      submit:function(data){
        var data = data;
        $.ajax({
          type:"post",
          url:urlPath + '/web/userCenter/fixedasset/createFixedasset',
          data:data,
          dataType: 'json',
          
          success:function(res){
            console.log(data);
            window.location.href = 'my_fixedAssets.html';
          }
        })
      }
    }
    creatProject.init();
  })
})
