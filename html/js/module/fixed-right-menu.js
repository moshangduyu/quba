/**
 * Created by coffee on 11/05/2017.
 *
 * 固定在右侧的返回顶部、二维码、联系客服等
 */
define(function (require, exports, module) {

    var $ = require("../lib/jquery/jquery-1.10.1.min.js");

    if($(".right-fixed").length === 0){
        $(document.body).append(
            '<div class="right-fixed">'+
            '  <ul>'+
            '    <li class="fiexd-top">'+
            '      <img src="images/common/ic_top.png" alt="">'+
            '    </li>'+
            '    <li>'+
            '      <img class="icon-img" src="images/common/ic_er_wei_ma.png" alt="">'+
            '      <span>微信<br />公众号<img src="images/project_list/pic_gong_zhong_hao_2.png" /></span>'+
            '    </li>'+
            '    <li>'+
            '      <img class="icon-img" src="images/common/ic_ke_fu.png" alt="">'+
            '      <span>联系<br />客服</span>'+
            '    </li>'+
            '  </ul>'+
            '</div>'
        );
    }

    var fixedRightMenu = $(".right-fixed");

    fixedRightMenu.find(".fiexd-top").on("click", function () {
        $(document.body).scrollTop(0);
    });

    console.info(fixedRightMenu.find("li"));

    fixedRightMenu.find('li').on('mouseenter',function(){
        var $this = $(this);
        if($this.find('span').length!==0){
            $this.find('.icon-img').hide();
            $this.find('span').css('display','block');
        }
    }).on('mouseleave',function(){
        var $this = $(this);
        if($this.find('span').length!==0){
            $this.find('.icon-img').show();
            $this.find('span').css('display','none');
        }
    });

    return {};
});


