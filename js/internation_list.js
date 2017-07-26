;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: true
            , click: true
                //            , bounce: false
        });
        var title = ""
            , currentPage = 1
            , loading = 'false'
            , typeIdx = 2;
        /*筛选点击按钮*/
        var $li = $('#property_type>ul').find('li');
        $li.click(function () {
            $(this).addClass('onSelect').siblings('li').removeClass('onSelect');
            $('.content_list>div').hide();
            typeIdx = $(this).index();
            currentPage = 1;
            loading = 'false'
            if (typeIdx == 0) {
                $('.long_list').show();
                longAjax()
            }
            else if (typeIdx == 1) {
                $('.bidding_list').show();
                biddingAjax()
            }
        });
        //重置按钮
        $('.reset').click(function () {
            $('#property_type>ul').find('li').removeClass('onSelect');
            $('.content_list>div').hide();
            $('.all_list').show();
            typeIdx = 2;
            currentPage = 1;
            loading = 'false'
            allAjax();
        });
        //页面渲染
        allAjax();

        function allAjax() {
            $.ajax({
                type: "GET"
                , url: protUrl + "/int/createDesc/techs"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    totalNum = res.data.total;
                    $('.screenNum').text(totalNum);
                    if (totalNum != 0) {
                        $.each(res.data.rows, function (i, item) {
                            var code = item.techTypePath.split(',');
                            html += ' <div class="bts_del">' + '<a href="longterm_detaile.html?tech=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                            if (item.cover == undefined) {
                                html += '<img class="dt_bg" src="../images/list_fixedasset.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p>';
                            if (code[0] != 200) {
                                html += '<span>' + item.techTypeName + '</span>' + '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>';
                            }
                            else {
                                html += '<span>' + item.techTypeName + '</span>' + '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>'
                            }
                            html += '</p>' + '<div class="pre">';
                            $.each(item.prices, function (index, el) {
                                if (item.prices.length == 1) {
                                    html += '<p style="height:.2rem"></p>';
                                    if (el.isMarkedPrice == false) {
                                        html += '<p>' + el.tradingModeName + '：<span>面议</span></p>';
                                    }
                                    else {
                                        html += '<p>' + el.tradingModeName + '：<span>￥' + el.price + '万</span></p>';
                                    }
                                }
                                else {
                                    if (el.isMarkedPrice == false) {
                                        html += '<p>' + el.tradingModeName + '：<span>面议</span></p>';
                                    }
                                    else {
                                        html += '<p>' + el.tradingModeName + '：<span>￥' + el.price + '万</span></p>';
                                    }
                                }
                                html += '</div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
                            });
                        });
                        if (loading == 'true') {
                            $('.all_list').append(html);
                        }
                        else {
                            $('.all_list').html(html);
                        };
                        myScroll.refresh();
                        pageCount = res.data.totalPages;
                        currentPage++;
                        isPulled = true;
                    }
                    else {
                        //                        $('.long_list').html("暂无数据");
                    }
                }
            });
        }

        function longAjax() {
            //竞价转让推荐
            $.ajax({
                type: "GET"
                , url: protUrl + "/int/createDesc/long/techs"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    totalNum = res.data.total;
                    $('.screenNum').text(totalNum);
                    if (totalNum != 0) {
                        $.each(res.data.rows, function (i, item) {
                            var code = item.techTypePath.split(',');
                            html += ' <div class="bts_del">' + '<a href="longterm_detaile.html?tech=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                            if (item.cover == undefined) {
                                html += '<img class="dt_bg" src="../images/list_fixedasset.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p>';
                            if (code[0] != 200) {
                                html += '<span>' + item.techTypeName + '</span>' + '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>';
                            }
                            else {
                                html += '<span>' + item.techTypeName + '</span>' + '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>'
                            }
                            html += '</p>' + '<div class="pre">';
                            $.each(item.prices, function (index, el) {
                                if (item.prices.length == 1) {
                                    html += '<p style="height:.2rem"></p>';
                                    if (el.isMarkedPrice == false) {
                                        html += '<p>' + el.tradingModeName + '：<span>面议</span></p>';
                                    }
                                    else {
                                        html += '<p>' + el.tradingModeName + '：<span>￥' + el.price + '万</span></p>';
                                    }
                                }
                                else {
                                    if (el.isMarkedPrice == false) {
                                        html += '<p>' + el.tradingModeName + '：<span>面议</span></p>';
                                    }
                                    else {
                                        html += '<p>' + el.tradingModeName + '：<span>￥' + el.price + '万</span></p>';
                                    }
                                }
                            })
                            html += '</div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
                        });
                        if (loading == 'true') {
                            $('.long_list').append(html);
                        }
                        else {
                            $('.long_list').html(html);
                        };
                        myScroll.refresh();
                        pageCount = res.data.totalPages;
                        currentPage++;
                        isPulled = true;
                    }
                    else {
                        //                        $('.long_list').html("暂无数据");
                    }
                }
            });
        }

        function biddingAjax() {
            //竞价转让推荐
            $.ajax({
                type: "GET"
                , url: protUrl + "/int/createDesc/bidding/techs"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    totalNum = res.data.total;
                    $('.screenNum').text(totalNum);
                    if (totalNum != 0) {
                        $.each(res.data.rows, function (i, item) {
                            var code = item.techTypePath.split(',');
                            html += ' <div class="bts_del">' + '<a href="jinjia_detaile.html?tech=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                            if (item.cover == undefined) {
                                html += '<img class="dt_bg" src="../images/list_fixedasset.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p>';
                            if (code[0] != 200) {
                                html += '<span>' + item.techTypeName + '</span>' + '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>';
                            }
                            else {
                                html += '<span>' + item.techTypeName + '</span>' + '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>'
                            }
                            html += '</p>' + '<div class="pre">';
                            if (item.currency == "CNY") {
                                html += '<p>转让底价：<span>￥' + (item.startPrice / 10000) + '万</span></p>';
                                if (item.bidRange >= 10000) {
                                    html += '<p>加价幅度：<span>￥' + (item.bidRange / 10000) + '万</span></p>';
                                }
                                else {
                                    html += '<p>加价幅度：<span>￥' + item.bidRange + '元</span></p>';
                                }
                            }
                            else {
                                html += '<p>转让底价：<span>$' + (item.startPrice / 10000) + '万</span></p>';
                                if (item.bidRange >= 10000) {
                                    html += '<p>加价幅度：<span>$' + (item.bidRange / 10000) + '万</span></p>';
                                }
                                else {
                                    html += '<p>加价幅度：<span>$' + item.bidRange + '元</span></p>';
                                }
                            }
                            html += '</div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
                        });
                        if (loading == 'true') {
                            $('.bidding_list').append(html);
                        }
                        else {
                            $('.bidding_list').html(html);
                        };
                        myScroll.refresh();
                        pageCount = res.data.totalPages;
                        currentPage++;
                        isPulled = true;
                    }
                    else {}
                }
            });
        }
        /*---------上拉加载-----------*/
        var isPulled = true; // 拉动标记
        myScroll.on('scrollStart', function () {
            startY = myScroll.y
        });
        myScroll.on('scroll', function () {
            var height = this.y
                , bottomHeight = height - this.maxScrollY;
            // 控制上拉显示
            if (isPulled && bottomHeight <= 200) {
                isPulled = false;
                console.log(currentPage)
                if (currentPage <= pageCount) {
                    loading = 'true';
                    if (typeIdx == 2) {
                        allAjax()
                    }
                    else if (typeIdx == 0) {
                        longAjax()
                    }
                    else if (typeIdx == 1) {
                        biddingAjax()
                    }
                }
                myScroll.refresh();
            }
        });
        //搜索
        $('.searchBtn').click(function () {
            title = decodeURI($('.searchIpu').val());
            currentPage = 1;
            loading = 'false';
            if (typeIdx == 2) {
                allAjax()
            }
            else if (typeIdx == 0) {
                longAjax()
            }
            else if (typeIdx == 1) {
                biddingAjax()
            }
        });
        $('.searchIpu').change(function () {
            title = decodeURI($(this).val());
            currentPage = 1;
            loading = 'false';
            if (typeIdx == 2) {
                allAjax()
            }
            else if (typeIdx == 0) {
                longAjax()
            }
            else if (typeIdx == 1) {
                biddingAjax()
            }
        });
        //返回顶部按钮
        backTop(myScroll);
    }
})(jQuery);