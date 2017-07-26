var forgetPas2Controller = {
    initView: function () {
        $('.localPhone').val(localStorage.phone);
        this.initEvent();
    },
    initEvent: function () {
        var that = this;
        $('#changePhoneBtn').on('click', function () {
            javascript: history.back();
        });
        //获取验证码
        $('#getSmsBtn').on('click', function () {

        });
        $('#submitBtn').on("click", function () {
            var localPhoneVal = that.localPhoneVal = $('.localPhone').val();
            var smsPhoneVal = that.smsPhoneVal = $('.smsPhone').val();
            var password1Val = that.password1Val = $('.password1').val(),
                len1 = password1Val.length;
            var password2Val = that.password2Val = $('.password2').val();
            if (!phonez.test(localPhoneVal)) {
                $.popupCover({
                    content: '手机号码格式错误'
                });
                return false;
            } else if (smsPhoneVal == '') {
                $.popupCover({
                    content: '短信验证码错误'
                });
                return false;
            } else if (len1 < 6 || len1 > 18) {
                $.popupCover({
                    content: '密码格式错误'
                });
                return false;
            } else if (password1Val !== password2Val) {
                $.popupCover({
                    content: '密码输入不一致'
                });
                return false;
            } else {
                that.doRegisterAjax();
            }
        })
    },
    //获取验证码
    getPhonesms: function () {
        $.ajax({
            type: "post",
            url: protUrl + "/user/phone/sms",
            data: {
                'phone': that.localPhoneVal
            },
            jsonp: "jsoncallback",
            success: function (res) {
                $.popupCover({
                    content: res.message
                })
            }
        })
    },
    //注册接口
    doRegisterAjax: function () {
        $.ajax({
            type: "post",
            url: protUrl + "/user/register",
            data: {
                'phone': that.localPhoneVal,
                'code': that.smsPhoneVal,
                'password': that.password2Val
            },
            jsonp: "jsoncallback",
            success: function (res) {
                if (res.status === 0) {
                    $.ajax({
                        type: "post",
                        url: protUrl + "/user/login",
                        data: {
                            'username': that.localPhoneVal,
                            'password': that.password2Val,
                            'remember': true,
                        },
                        jsonp: "jsoncallback",
                        success: function (res) {
                            if (res.status === 0) {
                                if (localStorage.login_reffer) {
                                    var reffer = localStorage.login_reffer;
                                    window.location.href = reffer;
                                } else {
                                    window.location.href = "/index.html"
                                }
                            } else {
                                window.location.href = "/index.html"
                            }
                        }
                    })
                } else {
                    $.popupCover({
                        content: res.message
                    })
                }
            }
        })
        //        window.location.href = "/html/sign_up2.html"
    }
};
$(function () {
    forgetPas2Controller.initView();
})
