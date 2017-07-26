var forgetPas1Controller = {
    initView: function () {
        //图形验证码
        var verifyCode = this.verifyCode = new GVerify("v_container");
        this.initEvent();
    },
    initEvent: function () {
        var that = this;
        $('#nextBtn').on("click", function () {
            var phoneVal = that.phoneVal = $('.phone').val();
            var smsVal = that.passwordVal = $('.sms').val();
            if (!phonez.test(phoneVal)) {
                $.popupCover({
                    content: '手机号码格式错误'
                });
                return false;
            } else if (!that.verifyCode.validate(smsVal)) {
                $.popupCover({
                    content: '验证码错误'
                });
                return false;
            } else {
                local.phone = phoneVal;
                window.location.href = "/html/forget_password2.html"
            }
        })
    }
};
$(function () {
    forgetPas1Controller.initView();
})
