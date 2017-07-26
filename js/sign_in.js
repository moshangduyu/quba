var loginController = {
    initView: function () {
        this.initEvent();
    },
    initEvent: function () {
        var that = this;
        $('#loginInBtn').on("click", function () {
            var phoneVal = that.phoneVal = $('.phone').val();
            var passwordVal = that.passwordVal = $('.password').val();
            if (phoneVal == '') {
                $.popupCover({
                    content: '请填写手机号码'
                });
                return false;
            } else if (!phonez.test(phoneVal) && phoneVal != '') {
                $.popupCover({
                    content: '手机号码格式错误'
                });
                return false;
            } else if (passwordVal == '') {
                $.popupCover({
                    content: '请填写密码'
                });
                return false;
            } else {
                that.doLoginAjax();
            }
        })
    },
    //登陆接口
    doLoginAjax: function () {
        var that = this;
        $.ajax({
            type: "post",
            url: protUrl + "/user/login",
            data: {
                'username': that.phoneVal,
                'password': that.passwordVal,
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
                    $.popupCover({
                        content: res.message
                    })
                }
            }
        })
    }
};
$(function () {
    loginController.initView()
})
