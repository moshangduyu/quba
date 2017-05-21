/**
 * @authors 胡小呆 (https://github.com/Chinalink)
 * @date    2017-03-15
 * @lastChange 2017-03-15
 * @version 1.0.0
 */
define(function(require,exports,module){
  //jquery
	require('../lib/jquery/jquery-1.10.1.min.js');

  function Validate(){

	}

  module.exports = Validate;

  Validate.prototype.render = function(){

  }
  //验证手机号
	Validate.prototype._phone = function(o){
		var item = o;
		if(item.val() == "" || item.val() == item.attr('placeholder')){
      item.next('.error').text('请输入手机号码').show();
      return false;
		}
		if(item.val()!="" && !/^(13[0-9]|14[57]|15[012356789]|17[03678]|18[0-9])\d{8}$/.test(item.val().trim())){
      item.next('.error').text('手机号码格式错误').show();
			return false;
		}
    item.next('.error').hide();
		return true;
	}
  //验证图形验证码
	Validate.prototype._imgCode = function(o){
    var item = o;
    if(item.val() == "" || item.val() == item.attr('placeholder')){
      item.siblings('.error').text('请输入图形验证码').show();
      return false;
		}
    item.siblings('.error').hide();
    return true;
  }
  Validate.prototype._code = function(o){
    var item = o;
    if(item.val() == "" || item.val() == item.attr('placeholder')){
      item.siblings('.error').text('请输入验证码').show();
      return false;
    }
    item.siblings('.error').hide();
    return true;
  }
  // 验证登录密码
  Validate.prototype._password = function(o){
		var item = o;
		if(item.val() == "" || item.val() == item.attr('placeholder')){
      item.next('.error').text('请输入登录密码').show();
      return false;
		}
    if(item.val()!="" && !/^[a-zA-Z0-9]{6,18}$/.test(item.val().trim())){
      item.next('.error').text('密码格式错误').show();
      return false;
    }
    item.next('.error').hide();
		return true;
	}
  //验证两次密码输入一致
	Validate.prototype._pwdRepeat = function(o,b){
		var item = o;
			if (item.val().trim() == "" || item.val() == item.attr('placeholder')){
        item.next('.error').text('请再次输入登录密码').show();
				return false;
			}
			if (item.val().trim() != b.val().trim()){
        item.next('.error').text('密码不一致').show();
				return false;
			}
    item.next('.error').hide();
		return true;
	}
})
