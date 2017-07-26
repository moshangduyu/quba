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
        var moneyFormat = function (value) {
                if (!value) {
                    return value;
                }
                if (value > 0) {
                    var s = value.toString().split("");
                    if (s.length > 1) {
                        s = s.map(function (e, i) {
                            return s[s.length - i - 1]
                        });
                    }
                    var l = [];
                    s.forEach(function (e, i) {
                        if (i % 3 === 2) {
                            l.push("," + e);
                        }
                        else {
                            l.push(e);
                        }
                    });
                    if (l.length > 1) {
                        l = l.map(function (e, i) {
                            return l[l.length - i - 1]
                        });
                    }
                    return l.join("");
                }
            }
            //页面渲染
        searchAjax()

        function searchAjax() {
            $.ajax({
                type: "get"
                , url: protUrl + "/recruiting/recruitings"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    if (res.data.rows.length > 0) {
                        var html = "";
                        $.each(res.data.rows, function (i, e) {
                            var date = new Date(e.publishTime);
                            html += ' <a href="public_detaile_careers.html?id=' + e.id + '"><div class="zhaopin_box"><h3>' + e.title + '</h3><p>' + e.company + '</p><p>职位薪资: <span class="money">￥' + moneyFormat(e.salaryMin) + ' - ￥' + moneyFormat(e.salaryMax) + '</span></p><p><span>工作地点: <b>' + e.regionFullName.replace(" ", "/") + '</b></span><span style="margin-left:.32rem">发布日期: <b>' + date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate() + '</b></span></p></div></a>';
                        });
                        if (loading == 'true') {
                            $('.pinyong_list').append(html);
                        }
                        else {
                            $('.pinyong_list').html(html);
                        };
                        myScroll.refresh();
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