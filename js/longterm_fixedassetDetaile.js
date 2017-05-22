;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: true
            , click: true
                //            , bounce: false
        });
        var project = GetQueryString('fixedasset');
        // Ajax加载数据
        getDetaile();

        function getDetaile() {
            $.ajax({
                type: "get"
                , url: protUrl + '/fixedasset/info?fixedasset=' + project
                , dataType: 'json'
                , async: false
                , success: function (res) {
                    // 详情页基本资料卡片
                    var DetaileCard = '';
                    if (res.data.cover == undefined) {
                        DetaileCard += '<div class="banner"><img src="../images/common/banner_fixedasset.png"  alt=""></div>';
                    }
                    else {
                        DetaileCard += '<div class="banner"><img src="' + res.data.cover + '"  alt=""></div>';
                    }
                    DetaileCard += ' <div class="centerBox center1">' + '<h1 class="title">' + res.data.title + '</h1>' + '<div>' + '<p>资产类型：<b>' + res.data.typeName + '</b></p>\
                            <p>资产所在地：<b>' + res.data.regionFullName + '</b></p>\
                            <p>资产来源：<b>' + res.data.sourceName + '</b></p>';
                    if (res.data.isMarkedPrice == false) {
                        DetaileCard += '<p>转让价格：<i>面议</i></p>';
                    }
                    else {
                        if (res.data.price > 100000000) {
                            var price = (res.data.price / 100000000) + '亿';
                        }
                        else {
                            var price = (res.data.price / 10000) + '万';
                        }
                        DetaileCard += '<p>转让价格：<i>￥' + price + '</i></p>';
                    }
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
                }
            })
        }
        backTop(myScroll);
        myScroll.on('scroll', function () {
            myScroll.refresh();
        })
    }
})(jQuery);