define(function(require,exports,module){
  //jquery
  require("../lib/jquery/jquery-1.10.1.min.js");
  // 头部下拉菜单
  require("../module/jquery.dropdown-nav.js");
  $(".header-peosonal-btn").dropdownNav();

  //ajaxUrl 模块
  var url = require("../module/url_main.js"),
    Url = new url(),
    urlPath = Url.url;

  function login(){
    this.visitorArea = $(".header-sign"),
    this.memberArea = $(".header-peosonal");
	}
  login.prototype.render = function(){
    var self = this;
    $.get(urlPath+"/web/user/userInfo").success(function(res){
      console.log(res);
        if(res.data){

            console.info("已经登录");
            $(".cc-avastar").attr("src",res.data.avatarUrl);

            self.visitorArea.hide();
            self.memberArea.show();
            $('.subnav li>a.my-list,.subnav li>a.my-list + ul').on('mouseenter',function(){
              $('.subnav li>a.my-list + ul').show();
            })
            $('.subnav li>a.my-list,.subnav li>a.my-list + ul').on('mouseleave',function(){
              $('.subnav li>a.my-list + ul').hide();
            })

        }else{
            console.warn("未登录");

            self.visitorArea.show();
            self.memberArea.hide();
        }
    });
    $("#logo-toggle").click(function(){
        $(".more-logo").toggleClass("open");
        $(this).toggleClass("open");
    });
  }
	module.exports = login;
})
