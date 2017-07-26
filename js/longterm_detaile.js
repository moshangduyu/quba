;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: true
            , click: true
                //            , bounce: false
        });
        var project = GetQueryString('tech');
        // Ajax加载数据
        function convertToChinese(num) {
            var N = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            var str = num.toString();
            var len = num.toString().length;
            var C_Num = [];
            for (var i = 0; i < len; i++) {
                C_Num.push(N[str.charAt(i)]);
            }
            return C_Num.join('');
        }
        getDetaile();

        function getDetaile() {
            $.ajax({
                type: "get"
                , url: protUrl + '/tech/info?tech=' + project
                , dataType: 'json'
                , async: false
                , success: function (res) {
                    // 详情页基本资料卡片
                    var DetaileCard = '';
                    if (res.data.cover == undefined) {
                        DetaileCard += '<div class="banner"><img src="../images/default-cover1.png" style="display:none"></div>';
                    }
                    else {
                        DetaileCard += '<div class="banner"><img src="' + res.data.cover + '"  style="display:none"></div>';
                    }
                    DetaileCard += ' <div class="centerBox center1">' + '<h1 class="title">' + res.data.title + '</h1>' + '<div>' + '<p>行业领域：<b>' + res.data.industryName + '</b></p>';
                    var code = res.data.techTypePath.split(',');
                    if (code[0] == 100) {
                        if (res.data.patentStatus == 0) {
                            DetaileCard += ' <p>技术类型：<b>发明专利（申请中）</b></p>\
                               <p>专利所属地：<b>' + res.data.patentCountryName + '</b></p>';
                        }
                        else {
                            DetaileCard += ' <p>技术类型：<b>发明专利（已授权）</b></p>\
                               <p>专利所属地：<b>' + res.data.patentCountryName + '</b></p>';
                        }
                    }
                    else {
                        DetaileCard += ' <p>技术类型：<b>非专利</b></p>\
                             <p>技术所在地：<b>' + res.data.regionFullName + '</b></p>';
                    }
                    DetaileCard += '<p>成 熟 度：<b>' + res.data.maturityName + '</b></p>';
                    $.each(res.data.prices, function (index, item) {
                        var num = convertToChinese(index + 1);
                        if (item.isMarkedPrice == false) {
                            DetaileCard += '<p>交易方式' + num + '：<b>' + item.tradingModeName + '</b> <i>面议</i></p>';
                        }
                        else {
                            DetaileCard += '<p>交易方式' + num + '：<b>' + item.tradingModeName + '</b> <i>￥' + item.price + '万</i></p>';
                        }
                    });
                    DetaileCard += '</div></div>';
                    //详细描述
                    DetaileCard += '<div class="centerBox center2"><h3>详细描述</h3>';
                    if (res.data.description == undefined) {
                        DetaileCard += '<div class="content" style="padding-left:.2rem;color:#666;">暂无介绍</div></div>';
                    }
                    else {
                        DetaileCard += '<div class="content">' + res.data.description + '</div></div>';
                    }
                    // 图片资料
                    DetaileCard += '<div class="centerBox center3"><h3>图片资料</h3>';
                    if (res.data.pictures.length == 0) {
                        DetaileCard += '<div class="img" style="padding-left:.2rem;color:#666;">暂无介绍</div>';
                    }
                    else {
                        DetaileCard += '<div class="img">';
                        $.each(res.data.pictures, function (index, item) {
                            DetaileCard += '<img data-pictureskey="' + item.key + '" src="' + item.accessUrl + '">';
                        });
                        DetaileCard += '</div>  ';
                    }
                    $('.ajaxCenter').html(DetaileCard);
                    myScroll.refresh();
                    $(".banner>img").load(function () {
                        $.cropImg({
                            coverBox: $('.banner')
                            , Img: $('.banner>img')
                            , src: $('.banner>img').attr('src')
                        });
                    })
                }
            })
        }
        backTop(myScroll);
        myScroll.on('scroll', function () {
            myScroll.refresh();
        })
    }
})(jQuery);