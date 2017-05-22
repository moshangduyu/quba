;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: true
            , click: true
                //            , bounce: false
        });
        var marketingright = GetQueryString('marketingright');
        // Ajax加载数据
        getDetaile();

        function getDetaile() {
            $.ajax({
                type: "get"
                , url: protUrl + '/marketing/right/info?marketingright=' + marketingright
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
                    DetaileCard += ' <div class="centerBox center1">' + '<h1 class="title">' + res.data.title + '</h1>' + '<div>\
                            <p>代理范围：<b>' + res.data.agentScopeName + '</b></p>\
                            <p>代理类型：<b>' + res.data.agentTypeName + '</b></p>\
                            <p>代理年限：<b>' + res.data.agentTermName + '</b></p>';
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