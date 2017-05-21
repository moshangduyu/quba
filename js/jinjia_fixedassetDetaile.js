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
                , url: protUrl + '/fixedasset/info?fixedasset=' + project
                , dataType: 'json'
                , async: false
                , success: function (res) {
                    // 详情页基本资料卡片
                    var DetaileCard = ''
                        , bidRangeNum = res.data.bidRange;
                    if (bidRangeNum < 1000) {
                        var bidRang = bidRangeNum + '元';
                    }
                    if (bidRangeNum < 10000 && bidRangeNum > 1000) {
                        var bidRang = res.bidRangeNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,') + '元';
                    }
                    if (bidRangeNum >= 10000) {
                        var bidRang = (bidRangeNum / 10000) + '万';
                    }
                    if (res.data.cover == undefined) {
                        DetaileCard += '<div class="banner"><img src="../images/common/banner_fixedasset.png"  alt=""></div>';
                    }
                    else {
                        DetaileCard += '<div class="banner"><img src="' + res.data.cover + '"  alt=""></div>';
                    }
                    DetaileCard += ' <div class="centerBox center1">' + '<h1 class="title">' + res.data.title + '</h1>' + '<div>' + '<p>资产类型：<b>' + res.data.typeName + '</b></p><p>资产所在地：<b>' + res.data.regionFullName + '</b></p><p>资产来源：<b>' + res.data.sourceName + '</b></p>';
                    if (res.data.startPrice >= 1000) {
                        DetaileCard += '<p><span>转让底价：<i>￥' + (res.data.startPrice / 10000) + '万</i></span>';
                    }
                    else {
                        DetaileCard += '<p><span>转让底价：<i>￥' + (res.data.startPrice) + '元</i></span>';
                    }
                    if (res.data.bidRange >= 10000) {
                        DetaileCard += '<span>加价幅度：<i>￥' + (res.data.bidRange / 10000) + '万</i></span></p>';
                    }
                    else {
                        DetaileCard += '<span>加价幅度：<i>￥' + bidRang + '</i></span></p>';
                    }
                    if (res.data.startBiddingTime != undefined) {
                        var unixTime = new Date(res.data.startBiddingTime)
                            , month = unixTime.getMonth() + 1 > 9 ? unixTime.getMonth() + 1 : '0' + (unixTime.getMonth() + 1)
                            , date = unixTime.getDate() > 9 ? unixTime.getDate() : '0' + unixTime.getDate()
                            , startBiddingTime = unixTime.getFullYear() + '.' + month + '.' + date;
                        DetaileCard += '<p><span>竞价开始：<i>' + startBiddingTime + '</i></span>';
                        if (res.data.endBiddingTime != undefined) {
                            var unixTime2 = new Date(res.data.endBiddingTime)
                                , month = unixTime2.getMonth() + 1 > 9 ? unixTime2.getMonth() + 1 : '0' + (unixTime2.getMonth() + 1)
                                , date = unixTime2.getDate() > 9 ? unixTime2.getDate() : '0' + unixTime2.getDate()
                                , endBiddingTime = unixTime2.getFullYear() + '.' + month + '.' + date;
                            DetaileCard += '<span>竞价结束：<i>' + endBiddingTime + '</i></span></p>';
                        }
                        else {
                            DetaileCard += '</p>';
                        }
                    }
                    DetaileCard += '</div></div>';
                    //详细描述
                    DetaileCard += '<div class="centerBox center2"><h3>详细描述</h3>';
                    if (res.data.description == undefined) {
                        DetaileCard += '<div class="content">暂无介绍</div></div>';
                    }
                    else {
                        DetaileCard += '<div class="content">' + res.data.description + '</div></div>';
                    }
                    // 图片资料
                    DetaileCard += '<div class="centerBox center3"><h3>图片资料</h3>';
                    if (res.data.pictures.length == 0) {
                        DetaileCard += '<div class="img">暂无介绍</div>';
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
            });
            $.ajax({
                type: "get"
                , url: protUrl + '/fixedasset/biddings?fixedasset=' + project
                , dataType: 'json'
                , async: false
                , success: function (res) {
                    var html = '';
                    html += '<table><tbody>\
                    <tr>\
                        <td>用户</td>\
                        <td>竞价时间</td>\
                        <td>报价</td>\
                    </tr>';
                    if (res.data.rows.length != 0) {
                        $.each(res.data.rows, function (index, item) {
                            var unixTime = new Date(item.createTime)
                                , month = unixTime.getMonth() + 1 > 9 ? unixTime.getMonth() + 1 : '0' + (unixTime.getMonth() + 1)
                                , date = unixTime.getDate() > 9 ? unixTime.getDate() : '0' + unixTime.getDate()
                                , createTime = unixTime.getFullYear() + '.' + month + '.' + date;
                            html += '<tr>\
                          <td>' + item.nickname + '</td>\
                          <td>' + createTime + '</td>\
                          <td>不公开</td>\
                      </tr>';
                        });
                        html += '</tbody></table>';
                        $('#longterm_user').append(html);
                    }
                    else {
                        html += '<tr>\
                        <td>暂无</td>\
                        <td>暂无</td>\
                        <td>不公开</td>\
                    </tr></tbody></table>';
                        $('#longterm_user').append(html);
                    }
                }
            })
        }
        myScroll.on('scroll', function () {
            myScroll.refresh();
        })
    }
})(jQuery);