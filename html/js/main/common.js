/**
 * Created by coffee on 29/03/2017.
 */
define(function(require){

    //jquery
    var $ = require("../lib/jquery/jquery-1.10.1.min.js");

    // 头部下拉菜单
    require("../module/jquery.dropdown-nav.js");
    $(".header-peosonal-btn").dropdownNav();

    var visitorArea = $(".header-sign"),
        memberArea = $(".header-peosonal");

    // 通过头像路径来判断是否登录
    $.get("http://sit.quba360.com/web/user/userInfo").success(function(res){
        if(res.data){
            console.info("已经登录");
            $(".cc-avastar").attr("src", res.data);

            visitorArea.hide();
            memberArea.show();

        }else{
            console.warn("未登录");

            visitorArea.show();
            memberArea.hide();
        }
    });


});
