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
    var resetPwd = {
      init:function(){
        var _this = this;
        $('input[name="oldpassword"],input[name="newpassword"],input[name="regpassword"]').bind('input propertychange',function() {
          if($('input[name="oldpassword"]').val()!=''&&$('input[name="newpassword"]').val()!=''&&$('input[name="regpassword"]').val()!=''){
            $('.btn-confirm').removeAttr('disabled').css('background','#f4d13f');
            _this.subSignIn();
          }
        })
      },
      // 重置密码
      subSignIn:function(){
        $('.btn-confirm').on('click', function(event) {
          event.preventDefault();

          var oldPwd = $('input[name="oldpassword"]'),
              newPwd = $('input[name="newpassword"]'),
              regPwd = $('input[name="regpassword"]');
      		if(oldPwd.val() == "" || oldPwd.val() == oldPwd.attr('placeholder')){
      	      oldPwd.next('.error').text('请输入原密码').show();
      	      return false;
      			}
      	    if(oldPwd.val()!="" && !/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{6,18}$/.test(oldPwd.val().trim())){
      	      oldPwd.next('.error').text('密码格式错误').show();
      	      return false;
      	    }else{
      	    	oldPwd.next('.error').hide();
      		}
          if(Validate._password(newPwd) && Validate._pwdRepeat(regPwd,newPwd)){
          	$.post(urlPath+"/web/userCenter/me/changePwd", {
                password: oldPwd.val(),
	              newPassword: newPwd.val()
	          }).success(function (response) {
	              console.info(response);
	              if(response.status === 0){
	                location.href = "personal_center.html"
	              }else{
	                  oldPwd.addClass('input-error').next('.error').text(response.message).show();
	              }
	          });
          }

          /* Act on the event */
        });
      }
    }
    resetPwd.init();
  })
})
