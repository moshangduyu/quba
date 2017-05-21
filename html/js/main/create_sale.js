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

  $(function(){
    var createSale = {
      init:function(){
        var _this = this;
        _this.getData();
      },
      // 获取接口数据
      getData:function(){
        var _this = this;
        _this.getScopes();
        _this.getTypes();
        _this.getTerms();
        $('input[name="project_name"], .description').bind('input propertychange',function() {
          _this.addEven();
        });
      },
      // 代理范围
      getScopes:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/marketing/right/agent/scopes',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#agent_scope').append(html).selectlist({zIndex: 10,width: 508,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // 代理类型
      getTypes:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/marketing/right/agent/types',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#agent_type').append(html).selectlist({zIndex: 9,width: 508,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // 代理年限
      getTerms:function(){
        var _this = this;
        $.ajax({
          type:"get",
          url:urlPath + '/web/marketing/right/agent/terms',
          dataType: 'json',
          
          success:function(res){
            var html = '';
            $.each(res.data,function(index, item) {
              html += '<option value ="'+ item.key +'">'+ item.value +'</option>';
            });
            $('#agent_term').append(html).selectlist({zIndex: 8,width: 508,height: 42,onChange:function(){
              _this.addEven();
            }});
          }
        })
      },
      // 监听数据
      addEven:function(){
        var _this = this,
            data = {},
            title = $('input[name="sales_name"]').val(),
            description = $('.description').val(),
            agentScope = $('input[name="agentScope"]').val(),
            agentType = $('input[name="agentType"]').val(),
            agentTerm = $('input[name="agentTerm"]').val();
        if(title!=''&& agentScope!='no'&& agentType!='no'&& agentTerm!='no'){
          data.title = title;
          data.agentScope = agentScope;
          data.agentType = agentType;
          data.agentTerm = agentTerm;
          if(description!=''){
            data.description = description;
          }
          $('.creat-submit').removeAttr('disabled').css('background','#f4d13f');
          _this.submit(data);
        }else{
          $('.creat-submit').attr('disabled','disabled').css('background','rgba(244,209,63,.5)');
        }
      },
      // 提交数据
      submit:function(data){
        var data = data;
        $('.creat-submit').unbind('click').on('click',function(){
          $.ajax({
            type:"post",
            url:urlPath + '/web/userCenter/marketing/right/createMarketingright',
            data:data,
            dataType: 'json',
            
            success:function(res){
              console.log(data);
              window.location.href = 'my_sale.html';
            }
          })
        })
      }
    }
    createSale.init();
  })

})
