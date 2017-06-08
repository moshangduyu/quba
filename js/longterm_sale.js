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
            , agentScope = ''
            , agentType = ''
            , agentTerm = '';
        /*获取选项列表*/
        optionList();

        function optionList() {
            $.ajax({
                type: "GET"
                , url: protUrl + "/marketing/right/agent/scopes"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_scopes>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_scopes>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            agentScope = $(this).data('key');
                        }
                        else {
                            agentScope = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/marketing/right/agent/types"
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
                            agentType = $(this).data('key');
                        }
                        else {
                            agentType = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/marketing/right/agent/terms"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_terms>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_terms>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            agentTerm = $(this).data('key');
                        }
                        else {
                            agentTerm = '';
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
                loading = "";
                agentScope = "";
                agentType = "";
                agentTerm = "";
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
                , url: protUrl + "/marketing/right/createDesc/marketingRights"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                    , agentScope: agentScope
                    , agentType: agentType
                    , agentTerm: agentTerm
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = "";
                    $('.screenNum').text(res.data.total);
                    $.each(res.data.rows, function (i, item) {
                        html += ' <div class="bts_del">' + '<a href="longterm_saleDetaile.html?marketingright=' + item.id + '">' + '<h2>' + item.title + '</h2>' + '<dl> <dt>';
                        if (item.cover == undefined) {
                            html += '<img class="dt_bg" src="/images/default-cover.png" alt="">';
                        }
                        else {
                            html += '<img class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                        }
                        html += '</dt>' + '<dd>' + '<p><span>' + item.agentScopeName + '</span>' + '<span>' + item.agentTypeName + '</span></p>' + '<div class="pre">';
                        html += '<p style="height:.2rem"></p><p>代理期限：<span>' + item.agentTermName + '</span></p></div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
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