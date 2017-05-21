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
            , prise = ""
            , status = "";
        /*获取选项列表*/
        optionList();

        function optionList() {
            $.ajax({
                type: "GET"
                , url: protUrl + "/project/industrys"
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
                , url: protUrl + "/project/financing/prises"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_financing>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_financing>ul').find('li');
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            prise = $(this).data('key');
                        }
                        else {
                            prise = '';
                        }
                        currentPage = 1;
                        loading = 'false'
                        indexAjax();
                    });
                }
            });
            $.ajax({
                type: "GET"
                , url: protUrl + "/project/status"
                , jsonp: "jsoncallback"
                , async: false
                , success: function (res) {
                    var html = '';
                    $.each(res.data, function (index, item) {
                        html += '<li data-key="' + item.key + '">' + item.value + '</li>';
                    })
                    $('#nav_status>ul').append(html);
                    /*筛选点击按钮*/
                    var $li = $('#nav_status>ul').find('li');
                    $li.each(function (index, el) {
                        if ($(this).attr('data-key') == '0' || $(this).attr('data-key') == '1' || $(this).attr('data-key') == '5') {
                            $(this).remove();
                        }
                    });
                    $li.click(function () {
                        $(this).toggleClass('onSelect').siblings('li').removeClass('onSelect');
                        if ($(this).hasClass('onSelect')) {
                            status = $(this).data('key');
                        }
                        else {
                            status = '';
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
                industry = "";
                prise = "";
                status = "";
                currentPage = 1;
                loading = 'false';
                indexAjax();
            })
        }
        // 获取项目状态
        $.ajax({
            type: "get"
            , url: protUrl + '/project/status'
            , dataType: 'jsonp'
            , jsonp: 'jsoncallback'
            , success: function (res) {
                txt = [];
                $.each(res.data, function (index, item) {
                    txt.push(item.value);
                });
                indexAjax()
            }
        });
        //页面渲染
        function indexAjax() {
            //竞价转让推荐
            $.ajax({
                type: "get"
                , url: protUrl + "/project/createDesc/projects"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                    , industry: industry
                    , prise: prise
                    , status: status
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = "";
                    $('.screenNum').text(res.data.total);
                    $.each(res.data.rows, function (i, item) {
                        html += '<div class="bts_del jj_del" data-id=' + item.id + '><a href="project_detaile.html?project=' + item.id + '">' + '<div class="jj_title">' + '<div class="jj_title_l"><img src=' + item.logo + '/></div>' + '<div class="jj_title_r">' + '<h3>' + item.title + '<span>' + item.brief + '</span></h3>';
                        if (item.amount != undefined) {
                            html += '<p>融资' + item.amount + '万' + ' ' + txt[item.status] + '</p>';
                        }
                        else {
                            html += '<p>待审核</p>';
                        }
                        html += '</div>' + '</div>' + '<dl> ' + '<dt>';
                        if (item.cover != undefined) {
                            html += '<img  class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x125r/gravity/Center/crop/298x125" alt="">';
                        }
                        else {
                            html += '<img src="/images/list_project.png" alt="">';
                        }
                        html += '</dt>' + '<dd>' + '<p style="margin-bottom:.05rem">';
                        if (item.priseName !== undefined) {
                            html += '<span>' + item.priseName + '</span>';
                        }
                        html += '<span>' + item.industryName + '</span></p>' + '<div class="pre jj_title_pre">';
                        if (item.founder !== undefined) {
                            html += '<p>创始人<span>' + item.founder + '</span></p>';
                        }
                        else {
                            html += '<p>创始人<span>未填写</span></p>';
                        }
                        if (item.highlight !== undefined) {
                            html += '<p>产品数据<span>' + item.highlight + '</span></p>';
                        }
                        else {
                            html += '<p>产品数据<span>未填写</span></p>';
                        }
                        if (item.teamPoint !== undefined) {
                            html += '<p>团队成员<span>' + item.teamPoint + '</span></p>';
                        }
                        else {
                            html += '<p>团队成员<span>未填写</span></p>';
                        }
                        html += '</div>' + '</dd > ' + '</dl>' + '</a></div>';
                    });
                    if (loading == 'true') {
                        $('.rongzi_list').append(html);
                    }
                    else {
                        $('.rongzi_list').html(html);
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
////tab切换
//$('.bts').eq(0).show();
//$('nav>span').click(function () {
//    var idx = $(this).index();
//    var text = $(this).text();
//    $(this).addClass('selectNav').siblings('span').removeClass('selectNav');
//    $('.searchIpu').attr('placeholder', '搜索' + text);
//    $('.bts').eq(idx).show().siblings('.bts').hide();
//    myScroll.refresh();
//});
////排序点击
//$('.paixu>div').click(function () {
//    $(this).addClass('selectPaixu').siblings('div').removeClass('selectPaixu');
//});