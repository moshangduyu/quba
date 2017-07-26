var forgetpswController = {
    initView: function () {
        $('.localPhone').val(localStorage.phone);
        this.initEvent();
    },
    initEvent: function () {
        var that = this;

        $('#submitBtn').on("click", function () {
            var oldPasswordVal = that.oldPasswordVal = $('.oldPassword').val();
            var newPassword1Val = that.newPassword1Val = $('.newPassword1').val(),
                len1 = newPassword1Val.length;
            var newPassword2Val = that.newPassword2Val = $('.newPassword2').val();
            if (len1 < 6 || len1 > 18) {
                $.popupCover({
                    content: '密码格式错误'
                });
                return false;
            } else if (newPassword1Val !== newPassword2Val) {
                $.popupCover({
                    content: '密码输入不一致'
                });
                return false;
            } else {
                that.doLoginAjax();
            }
        })
    },
    //登陆接口
    doLoginAjax: function () {
        window.location.href = "/html/sign_up2.html"
    }
};
$(function () {
    forgetpswController.initView();
})
