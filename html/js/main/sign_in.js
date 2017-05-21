/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-15
 * @lastChange 2017-03-15
 * @version 1.0.0
 */

define(function(require){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  //ajaxUrl 模块
  var url = require("../module/url_main.js"),
    Url = new url(),
    urlPath = Url.url;
    // login 模块
    var login = require("../module/login.js"),
      Login = new login();
      Login.render();
  // 前端验证
  var validate = require("../module/validate.js"),
    Validate = new validate();

  $(function(){
    var signIn = {
      phoneInput: $("#phone"),
      passwordInput: $("#password"),
      init:function(){
        var _this = this;
        // 登录
        _this.subSignIn();
      },
      subSignIn:function(){
        $('.btn-signin').on('click', function(event) {
          event.preventDefault();

          var phone = $('input[name="user_phone"]'),
              password = $('input[name="user_password"]');
          $.post( urlPath + "/web/user/login", {
              username: phone.val(),
              password: password.val(),
              remember: true
          }).success(function (response) {
              console.info(response);

              if(response.status === 0){
                location.href = "/index.html"
              }else{
                  phone.addClass('input-error').next('.error').text(response.message).show();
              }
          });
          /* Act on the event */
        });
      }
    }
    signIn.init();
  })
})
