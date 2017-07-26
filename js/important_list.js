;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3,
            scrollbars: true,
            click: true
            //            , bounce: false
        });
        var title = "",
            catalog = "" //类目

            ,
            currentPage = 1,
            loading = 'false';
        /*获取选项列表*/
        optionList();

        function optionList() {
            $.ajax({
                type: "get",
                url: protUrl + "/content/important/information/catalogs",
                data: {},
                jsonp: "jsoncallback",
                success: function (res) {
                    var html = ""
                    $.each(res.data, function (i, e) {
                        if (e.name.length >= 5) {
                            html += '<li data-code=' + e.code + ' style="font-size:.24rem">' + e.name + '</li>';
                        } else {
                            html += '<li data-code=' + e.code + '>' + e.name + '</li>';
                        }
                    });
                    $('.important-type>ul').html(html);
                    /*筛选点击按钮*/
                    var $li = $('.important-type>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            catalog = $(this).data('code');
                        } else {
                            catalog = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        searchAjax();
                    });
                }
            });
            optionSize($('.option-main li'));
            /*重置按钮*/
            $('.reset').click(function () {
                $.each($('.option-main li'), function () {
                    $(this).removeClass('onSelect');
                })
                catalog = "";
                period = ""
                currentPage = 1;
                loading = 'false'
                searchAjax();
            })
        }
        //页面渲染
        searchAjax()

        function searchAjax() {
            $.ajax({
                type: "get",
                url: protUrl + "/content/contents",
                data: {
                    title: title,
                    currentPage: currentPage,
                    catalog: catalog,
                    pageSize: 10,
                    period: ''
                },
                jsonp: "jsoncallback",
                success: function (res) {
                    var html = "";
                    $('.screenNum').text(res.data.total);
                    $.each(res.data.rows, function (i, e) {
                        var date = new Date(e.publishTime);
                        html += '<a href="important_detaile.html?id=' + e.id + '&catalog=' + catalog + '&importantCover=' + e.cover + '"><dl class="pp_dl">' + '<dt>';
                        if (e.cover == undefined) {
                            html += '<img src="../images/default-cover.png" alt="">';
                        } else {
                            html += '<img src=' + e.cover + '>';
                        }
                        html += '</dt>' + '<dd>' + '<h3>' + e.title + '</h3>' + '<p>' + '<span>信息类型: <b>' + e.catalog.name + '</b></span>' + '<span style="margin-left:.3rem">发布日期: <b>' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '</span>' + '</p>' + '</dd>' + '</dl></a>';
                    });
                    if (loading == 'true') {
                        $('.chuangxin_list').append(html);
                    } else {
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
            var height = this.y,
                bottomHeight = height - this.maxScrollY;
            // 控制上拉显示
            if (isPulled && bottomHeight <= 200) {
                isPulled = false;
                console.log(currentPage)
                if (currentPage <= pageCount) {
                    loading = 'true';
                    searchAjax();
                }
                myScroll.refresh();
            }
        });
        //搜索
        $('.searchBtn').click(function () {
            title = decodeURI($('.searchIpu').val());
            currentPage = 1;
            loading = 'false';
            searchAjax();
        });
        $('.searchIpu').change(function () {
            title = decodeURI($(this).val());
            currentPage = 1;
            loading = 'false';
            searchAjax();
        });
        //返回顶部
        backTop(myScroll);
    }
})(jQuery);
