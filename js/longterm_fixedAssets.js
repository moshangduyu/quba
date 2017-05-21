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
                type: "GET"
                , url: protUrl + "/fixedasset/createDesc/long/fixedassets"
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
                        $('.zhaunrang_list').append(html);
                    }
                    else {
                        $('.zhaunrang_list').html(html);
                    };
                    myScroll.refresh();
                    pageCount = res.data.totalPages;
                    currentPage++;
                    isPulled = true;
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