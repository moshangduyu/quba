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
            , industry = ""
            , techType = ""
            , tradingMode = ""
            , maturity = "";
        /*获取选项列表*/
        optionList();

        function optionList() {
            $.ajax({
                type: "GET"
                , url: protUrl + "/tech/industrys"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_industrys>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_industrys>ul').find('li');
                    stretch($li);
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            industry = $(this).data('key');
                        }
                        else {
                            industry = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/tech/techTypeTrees"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    var parentList = '';
                    var noParentList = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.code + '">' + item.name + '</li>';
                        if (item.code == 100) {
                            $.each(item.childs, function (index, el) {
                                parentList += '<li data-key="' + el.code + '">' + el.name + '</li>';
                            });
                        }
                        else {
                            $.each(item.childs, function (index, el) {
                                noParentList += '<li data-key="' + el.code + '">' + el.name + '</li>';
                            });
                        }
                    })
                    $('#typeTreeUl').append(html);
                    $('#patent-list').append(parentList);
                    $('#nopatent-list').append(noParentList);
                    $('#typeTreeUl>li').click(function () {
                        var idx = $(this).index();
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        $('.patentBox').find('ol').hide();
                        $('.patentBox').find('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            techType = $(this).data('key');
                            typeparent = $(this).data('key');
                            $('.patentBox').find('ol').eq(idx).show();
                        }
                        else {
                            techType = "";
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                    /*筛选点击按钮*/
                    var $li = $('.patentBox').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect')
                        if ($(this).hasClass('onSelect')) {
                            techType = $(this).data('key');
                        }
                        else {
                            techType = typeparent;
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/tech/tradingModes"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_tradingmodes>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_tradingmodes>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            tradingMode = $(this).data('key');
                        }
                        else {
                            tradingMode = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/tech/maturitys"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_maturitys>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_maturitys>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            maturity = $(this).data('key');
                        }
                        else {
                            maturity = '';
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
                industry = "";
                techType = "";
                tradingMode = "";
                maturity = "";
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
                , url: protUrl + "/tech/createDesc/bidding/techs"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                    , industry: industry
                    , techType: techType
                    , tradingMode: tradingMode
                    , maturity: maturity
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = "";
                    $('.screenNum').text(res.data.total);
                    $.each(res.data.rows, function (i, item) {
                        var code = item.techTypePath.split(',');
                        html += ' <div class="bts_del">' + '<a href="jinjia_detaile.html?tech=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                        if (item.cover == undefined) {
                            html += '<img class="dt_bg" src="/images/default-cover.png" alt="">';
                        }
                        else {
                            html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                        }
                        html += '</dt>' + '<dd>' + '<p>';
                        if (code[0] != 200) {
                            html += '<span>' + item.techTypeName + '</span>' + '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>';
                        }
                        else {
                            html += '<span>' + item.industryName + '</span>' + '<span>' + item.maturityName + '</span>'
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
                                html += '<p>加价幅度：<span>$' + item.bidRange + '元</span><p>';
                            }
                        }
                        html += '</div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
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