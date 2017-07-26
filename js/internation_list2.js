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
            typeIdx = $(this).index();
            $('.content_list>div').hide();
            currentPage = 1;
            loading = 'false'
            if (typeIdx == 0) {
                $('.long_list').show();
                longAjax();
            }
            else if (typeIdx == 1) {
                $('.bidding_list').show();
                biddingAjax();
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
                , url: protUrl + "/int/createDesc/fixedassets"
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
                            html += ' <div class="bts_del">' + '<a href="longterm_fixedassetDetaile.html?fixedasset=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                            if (item.cover == undefined) {
                                html += '<img class="dt_bg" src="../images/list_fixedasset.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p><span>' + item.typeName + '</span>' + '<span>' + item.regionFullName + '</span></p>' + '<div class="pre">';
                            html += '<p style="height:.2rem"></p>';
                            if (item.isMarkedPrice == false) {
                                html += '<p>转让价格：<span>面议</span></p>';
                            }
                            else {
                                if (item.currency == 'CNY') {
                                    html += '<p>转让价格：<span>￥' + (item.price / 10000) + '万</span></p>';
                                }
                                else {
                                    html += '<p>转让价格：<span>$' + (item.price / 10000) + '万</span></p>';
                                }
                            }
                            html += '</div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
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
            //7.3长期固定资产转让
            $.ajax({
                type: "GET"
                , url: protUrl + "/int/createDesc/long/fixedassets"
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
                            html += ' <div class="bts_del">' + '<a href="longterm_fixedassetDetaile.html?fixedasset=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                            if (item.cover == undefined) {
                                html += '<img class="dt_bg" src="../images/list_fixedasset.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p><span>' + item.typeName + '</span>' + '<span>' + item.regionFullName + '</span></p>' + '<div class="pre">';
                            html += '<p style="height:.2rem"></p>';
                            if (item.isMarkedPrice == false) {
                                html += '<p>转让价格：<span>面议</span></p>';
                            }
                            else {
                                if (item.currency == 'CNY') {
                                    html += '<p>转让价格：<span>￥' + (item.price / 10000) + '万</span></p>';
                                }
                                else {
                                    html += '<p>转让价格：<span>$' + (item.price / 10000) + '万</span></p>';
                                }
                            }
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
            //7.4竞价固定资产转让
            $.ajax({
                type: "GET"
                , url: protUrl + "/int/createDesc/bidding/fixedassets"
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
                            html += ' <div class="bts_del">' + '<a href="jinjia_fixedassetDetaile.html?fixedasset=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                            if (item.cover == undefined) {
                                html += '<img class="dt_bg" src="../images/list_fixedasset.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p><span>' + item.typeName + '</span>' + '<span>' + item.regionFullName + '</span></p>' + '<div class="pre">';
                            // 转让底价
                            var startPriceNum = item.startPrice;
                            if (startPriceNum >= 100000000) {
                                var startPrice = (startPriceNum / 100000000) + '亿';
                            }
                            else {
                                if (startPriceNum >= 10000) {
                                    var startPrice = (startPriceNum / 10000) + '万';
                                }
                                else {
                                    var startPrice = startPriceNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,') + '元';
                                }
                            }
                            // 加价幅度
                            var bidRangeNum = item.bidRange;
                            if (bidRangeNum > 100000000) {
                                var bidRang = (bidRangeNum / 100000000) + '亿';
                            }
                            else {
                                if (bidRangeNum >= 10000) {
                                    var bidRang = (bidRangeNum / 10000) + '万';
                                }
                                else {
                                    var bidRang = bidRangeNum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,') + '元';
                                }
                            }
                            html += '<p>转让底价：<span>' + startPrice + '</span></p>\
											 <p>转让底价：<span>' + bidRang + '</span></p>';
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