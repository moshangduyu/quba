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
            , typeIdx = 0;
        /*筛选点击按钮*/
        var $li = $('#property_type>ul').find('li');
        $li.click(function () {
            $(this).addClass('onSelect').siblings('li').removeClass('onSelect');
            typeIdx = $(this).index();
            currentPage = 1;
            loading = 'false'
            if (typeIdx == 0) {
                $('.bidding_list').hide()
                $('.long_list').show();;
                longAjax()
            }
            else {
                $('.long_list').hide();
                $('.bidding_list').show();
                biddingAjax()
            }
        });
        //页面渲染
        longAjax()

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
                                html += '<img class="dt_bg" src="/images/default-cover.png" alt="">';
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
                                html += '<p>转让价格：<span>￥' + (item.price / 10000) + '万</span></p>';
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
                                html += '<img class="dt_bg" src="/images/default-cover.png" alt="">';
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
                                html += '<p>转让价格：<span>￥' + (item.price / 10000) + '万</span></p>';
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
                    if (typeIdx == 0) {
                        longAjax()
                    }
                    else {
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
            if (typeIdx == 0) {
                longAjax()
            }
            else {
                biddingAjax()
            }
        });
        $('.searchIpu').change(function () {
            title = decodeURI($(this).val());
            currentPage = 1;
            loading = 'false';
            if (typeIdx == 0) {
                longAjax()
            }
            else {
                biddingAjax()
            }
        });
        //返回顶部按钮
        backTop(myScroll);
    }
})(jQuery);