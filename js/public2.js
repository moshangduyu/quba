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
            , loading = 'false';
        //页面渲染
        searchAjax()

        function searchAjax() {
            $.ajax({
                type: "get"
                , url: protUrl + "/content/contents"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , catalog: 'equipmentLeasing'
                    , pageSize: 10
                    , period: ''
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    if (res.data.rows.length > 0) {
                        var html = "";
                        $.each(res.data.rows, function (i, e) {
                            var date = new Date(e.publishTime);
                            html += '<a href="public_detaile-sale.html?id=' + e.id + '"><dl class="pp_dl"><dt><div class="list_cover"><img src="' + (e.cover || "../images/default-cover2.png") + '"></div></dt><dd>' + '<h3>' + e.title + '</h3>' + '<p><span>' + e.catalog.name + '<b></b></span><span style="margin-left:.32rem">发布日期: <b>' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '</b></span>' + '</p>' + '</dd></dl></a>';
                        });
                        if (loading == 'true') {
                            $('.zhaozu_list').append(html);
                        }
                        else {
                            $('.zhaozu_list').html(html);
                        };
                        myScroll.refresh();
                        //                        $.each($('.list_cover'), function (i, b) {
                        //                            var $coverBox = $(this)
                        //                                , $Img = $(this).find('img');
                        //                            $Img.load(function () {
                        //                                $.cropImg({
                        //                                    coverBox: $coverBox
                        //                                    , Img: $Img
                        //                                    , src: $Img.attr('src')
                        //                                });
                        //                            })
                        //                        })
                        pageCount = res.data.totalPages;
                        currentPage++;
                        isPulled = true;
                    }
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
        //返回顶部按钮
        backTop(myScroll);
    }
})(jQuery);