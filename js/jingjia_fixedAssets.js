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
            , source = ''
            , type = ''
            , location = '';
        /*获取选项列表*/
        optionList();

        function optionList() {
            $.ajax({
                type: "GET"
                , url: protUrl + "/fixedasset/sources"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_sources>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_sources>ul').find('li');
                    stretch($li);
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            source = $(this).data('key');
                        }
                        else {
                            source = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/fixedasset/types"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_types>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_types>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            type = $(this).data('key');
                        }
                        else {
                            type = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/fixedasset/locations"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_locations>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_locations>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            location = $(this).data('key');
                        }
                        else {
                            location = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            optionSize($('.option-main li'));
            /*重置按钮*/
            $('.reset').click(function () {
                $.each($('.option-main li'), function () {
                    $(this).removeClass('onSelect');
                })
                source = "";
                type = "";
                location = "";
                currentPage = 1;
                loading = 'false'
                indexAjax();
            })
        }
        //页面渲染
        indexAjax()

        function indexAjax() {
            //竞价转让推荐
            $.ajax({
                type: "get"
                , url: protUrl + "/fixedasset/createDesc/bidding/fixedassets"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                    , source: source
                    , type: type
                    , location: location
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = "";
                    $('.screenNum').text(res.data.total);
                    $.each(res.data.rows, function (i, item) {
                        html += ' <div class="bts_del">' + '<a href="jinjia_fixedassetDetaile.html?fixedasset=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                        if (item.cover == undefined) {
                            html += '<img class="dt_bg" src="/images/default-cover.png" alt="">';
                        }
                        else {
                            html += '<img class="dt_bg" src="' + item.cover + '" alt="">';
                        }
                        html += '</dt>' + '<dd>' + '<p>' + '<span>' + item.typeName + '</span>' + '<span>' + item.regionFullName + '</span></p>' + '<div class="pre">';
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
                        html += '<p>转让底价：<span>￥' + startPrice + '</span></p><p>加价幅度：<span>￥' + bidRang + '</span></p></div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
                    });
                    if (loading == 'true') {
                        $('.chanquan_list').append(html);
                    }
                    else {
                        $('.chanquan_list').html(html);
                    };
                    myScroll.refresh();
                    pageCount = res.data.totalPages;
                    currentPage++;
                    isPulled = true;
                }
            });
        };
        /*---------上拉加载-----------*/
        var isPulled = true; // 拉动标记
        myScroll.on('scrollStart', function () {
            startY = myScroll.y
        });
        myScroll.on('scroll', function () {
            var height = this.y
                , bottomHeight = height - this.maxScrollY;
            //下拉刷新
            if (-this.y <= -40 && isPulled && startY == 0) {
                isPulled = false;
                myScroll.on('scrollEnd', function () {
                    //                    currentPage = 1;
                    //                    loading = 'false';
                    //                    title = "";
                    //                    indexAjax();
                    window.location.reload();
                })
            }
            // 控制上拉显示
            if (isPulled && bottomHeight <= 200) {
                isPulled = false;
                console.log(currentPage)
                if (currentPage <= pageCount) {
                    loading = 'true';
                    indexAjax();
                }
                myScroll.refresh();
            }
        });
        //搜索
        $('.searchBtn').click(function () {
            title = decodeURI($('.searchIpu').val());
            currentPage = 1;
            loading = 'false';
            indexAjax();
        });
        $('.searchIpu').change(function () {
            title = decodeURI($(this).val());
            currentPage = 1;
            loading = 'false';
            indexAjax();
        });
        //返回顶部按钮
        backTop(myScroll);
    }
})(jQuery);