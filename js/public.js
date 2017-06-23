/*定义接口全局变量*/
//var protUrl = "http://hiifeng.com/web";
var protUrl = "/web";
/*----截取地址栏信息----------------*/
function GetQueryString(name) {
    var url = decodeURI(location.search);
    var object = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {　　　　　　　　
            object[strs[i].split("=")[0]] = strs[i].split("=")[1]　　　　　　
        }　　
    }
    return object[name];
}
/*右上角菜单按钮*/
$('.menuBtn').click(function () {
    $('.menu').show();
    $('.menu>ul').animate({
        "right": 0
    })
});
$('.menu').click(function () {
    $('.menu>ul').animate({
        "right": -100 + "%"
    }, function () {
        $('.menu').hide();
    });
});
/*返回上一页按钮*/
$('.backBtn').click(function () {
    javascript: history.back();
});
/*返回顶部按钮*/
function backTop(myScroll) {
    myScroll.on("scroll", function () {
        if (-this.y >= $(window).height()) {
            $(".backTop").show();
        } else {
            $(".backTop").hide();
        }
    });
    $(".backTop").click(function () {
        myScroll.scrollToElement(wrapper, 500);
    });
}
//筛选选项判断内容长度
function optionSize($option) {
    $.each($option, function () {
        var len = $(this).text().length;
        if (len == 6) {
            $(this).css({
                "font-size": .24 + "rem"
            })
        } else if (len > 6) {
            $(this).css({
                "font-size": .2 + "rem",
                "line-height": .34 + "rem"
            })
        }
    });
}
/*列表页菜单选项*/
$('.optionBtn').click(function () {
    $('.option_menu').show();
    $('.option-content').animate({
        "right": 0
    });
});
$('.hinebtnBox,.sureBtn').click(function () {
    $('.option-content').animate({
        "right": -100 + "%"
    }, function () {
        $('.option_menu').hide();
    })
});
//列表点击隐藏内容
function stretch($li) {
    if ($li.length > 9) {
        $li.eq(8).nextAll("li").hide();
        $('.stretch').click(function () {
            $(this).find('span>img').toggleClass('onChangeTop');
            $li.eq(8).nextAll("li").toggle();
        });
    } else {
        $('.stretch').find('img').hide();
    }
}
//自定义
var hintCover = false;
$.extend({
    cropImg: function (opts) {
        var coverW = opts.coverBox.width(),
            coverH = opts.coverBox.height(),
            coverScale = coverW / coverH;
        var imgW = opts.Img.width(),
            imgH = opts.Img.height(),
            imgScale = imgW / imgH;
        if (coverScale > imgScale) {
            opts.coverBox.css({
                "background-image": "url(" + opts.src + ")",
                "background-repeat": "no-repeat",
                "background-position": "center",
                "background-size": 100 + "%" + "auto"
            })
        } else if (coverScale < imgScale) {
            opts.coverBox.css({
                "background-image": "url(" + opts.src + ")",
                "background-repeat": "no-repeat",
                "background-position": "center",
                "background-size": "auto " + 100 + "%"
            })
        }
    },
    popupCover: function (opts) {
        var defaults = {
            content: '',
            showTime: 2000,
            positionTop: 80 + "%",
            background: '#000000',
            color: 'white',
            pater: $('body'),
            callback: '',
        }
        var option = $.extend({}, defaults, opts);
        if (hintCover) {
            $(".hintCover").css({
                "display": "block"
            }).fadeIn(500).delay(option.showTime).fadeOut(500, option.callback);
        } else {
            option.pater.append('<div class="hintCover"><div class="hintPopup"></div></div>');
            option.pater.css({
                "position": "relative"
            });
            $('.hintCover').css({
                "display": "none",
                "position": "absolute",
                "top": 0,
                "left": 0,
                "width": 100 + "%",
                "height": 100 + "%"
            });
            $('.hintPopup').text(option.content).css({
                "position": "absolute",
                "top": option.positionTop,
                "left": 50 + "%",
                "transform": "translate(-50% ,-50%)",
                "-webkit-transform": "translate(-50% ,-50%)",
                "padding-left": .25 + "rem",
                "padding-right": .25 + "rem",
                "line-height": .6 + "rem",
                "background": option.background,
                "opacity": .8,
                "color": option.color,
                "font-size": .26 + "rem",
                "border-radius": .15 + "rem"
            });
            $(".hintCover").css({
                "display": "block"
            }).fadeIn(500).delay(option.showTime).fadeOut(500, option.callback);
            hintCover = true;
        }
    }
});
