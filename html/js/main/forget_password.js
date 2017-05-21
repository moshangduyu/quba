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
  // 图形验证码
  require('../lib/gVerify/gVerify.js');

  $(function(){
    var verifyCode = new GVerify({id:"gVerify", type:"number"});
    var wait=60;
    var signUp = {
      init:function(){
        var _this = this;
        _this.getImgCode();
      },
      // 图形验证相关操作
      getImgCode:function(){
        var _this = this;
        // 刷新图形验证码
        $('.btn-refresh').unbind('click').on('click',function(){
          verifyCode.refresh();
        })
        // 点击下一步
        $('.btn-next').unbind('click').on('click',function(){
          _this.validateImgCode();
        })
      },
      // 验证手机号及图形验证码
      validateImgCode:function(){
        var _this = this,
            phone = $('input[name="phone"]');
        if(Validate._phone(phone)){
          $('.secend-phone').text(phone.val());
          var imgCode = $('input[name="imgCode"]');
          if(Validate._imgCode(imgCode)){
            if(verifyCode.validate(imgCode.val())){
              imgCode.next('.error').hide();
              $('.sign-first').hide();
              $('.sign-secend').show();
              // 发送验证码
              _this.yzCode(phone.val());
              // 提交注册
              _this.subSignUp();
              // 更换号码
              $('.btn-prev').unbind('click').on('click',function(){
                $('.sign-secend').hide();
                $('.sign-first').show();
              })
            }else{
              imgCode.next('.error').text('验证码错误').show();
            }
          }
        }
      },
      yzCode:function(phone){
        var _this = this,
            data = {};
            data.phone = phone;
        $('.btn-code').unbind('click').on('click',function(){
          $.ajax({
            type:"post",
            url:urlPath + '/web/user/resetPwd/phone/sms',
            data:data,
            dataType: 'json',
            
            success:function(res){
              console.log(res);
              if(res.status==1000){
                $('input[name="code"]').siblings('.error').text(res.message).show();
              }else{
                _this.time($('.btn-code'));
              }
            }
          })
        })
      },
      // 倒计时
  		time:function(o) {
        var _this = this;
        if (wait == 0) {
        	o.removeAttr('disabled').text('获取验证码');
        	wait = 60;
        }else{
        	o.attr('disabled',true).text('重新获取('+ wait+'S)');
            wait--;
            setTimeout(function() {
                _this.time(o)
            },
            1000)
        }
	    },
      // 确认保存
      subSignUp:function(){
        var _this = this;
        $('.btn-confirm').removeAttr('disabled').css('background','#f4cf3e').unbind('click').on('click',function(){
            var data = {},
                phone = $('.secend-phone').text(),
                code = $('input[name="code"]'),
                password = $('input[name="newpassword"]'),
                regpassword = $('input[name="regpassword"]');
            if(Validate._code(code) && Validate._password(password) && Validate._pwdRepeat(regpassword,password)){
              data.phone = phone;
              data.code = code.val();
              data.password = password.val();
              $.ajax({
                type:"post",
                url:urlPath + '/web/user/resetPwd',
                data:data,
                dataType: 'json',
                
                success:function(res){
                  console.log(res);
                  switch(res.status){
                    case 0:
                      window.location.href = 'personal_center.html';
                      break;
                    case 1000:
                      code.siblings('.error').text(res.message).show();
                      break;
                  }
              }
            })
          }
        })
      }
    }
    signUp.init();
  })
})
