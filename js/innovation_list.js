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
            , catalog = ""
            , period = "";
        /*获取选项列表*/
        optionList();

        function optionList() {
            $.ajax({
                type: "get"
                , url: protUrl + "/content/collaborative/innovation/catalogs"
                , data: {}
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    $.each(res.data, function (i, e) {
                        if (e.name.length >= 5) {
                            html += '<li data-code=' + e.code + ' style="font-size:.24rem">' + e.name + '</li>';
                        }
                        else {
                            html += '<li data-code=' + e.code + '>' + e.name + '</li>';
                        }
                    });
                    $('.innovation-type-1>ul').html(html);
                    /*筛选点击按钮*/
                    var $li = $('.innovation-type-1>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            catalog = $(this).data('code');
                        }
                        else {
                            catalog = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "get"
                , url: protUrl + "/content/periods"
                , data: {}
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    $.each(res.data, function (i, e) {
                        html += '<li data-key=' + e.key + '>' + e.value + '</li>';
                    });
                    $('.innovation-type-2>ul').html(html);
                    /*筛选点击按钮*/
                    var $li = $('.innovation-type-2>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            period = $(this).data('key');
                        }
                        else {
                            period = '';
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
                catalog = "";
                period = ""
                currentPage = 1;
                loading = 'false'
                indexAjax();
            })
        }
        indexAjax();
        //页面渲染
        function indexAjax() {
            //竞价转让推荐
            $.ajax({
                type: "get"
                , url: protUrl + "/content/contents"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                    , catalog: catalog
                    , period: period
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = "";
                    $('.screenNum').text(res.data.total);
                    $.each(res.data.rows, function (i, e) {
                        var date = new Date(e.publishTime);
                        html += '<div><a href="innovation_detaile.html?id=' + e.id + '&catalog=' + catalog + '"> <h3> ' + e.title + ' </h3> <p> <span> 协同类型： <b> ' + e.catalog.name + ' </b></span> <span style = "margin-left:.3rem"> 发布日期： <b> ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' </b></span> </p></a> </div>';
                    });
                    if (loading == 'true') {
                        $('.chuangxin_list').append(html);
                    }
                    else {
                        $('.chuangxin_list').html(html);
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
        backTop(myScroll);
    }
})(jQuery);
////排序点击
//$('.paixu>div').click(function () {
//    $(this).addClass('selectPaixu').siblings('div').removeClass('selectPaixu');
//});