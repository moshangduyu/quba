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
        // 获取项目状态
        var _text = []
            , _status = [];
        $.ajax({
            type: "get"
            , url: protUrl + '/project/status'
            , dataType: 'json'
            , success: function (res) {
                $.each(res.data, function (index, item) {
                    _status.push(item.key);
                    _text.push(item.value);
                });
                indexAjax();
            }
        })

        function indexAjax() {
            //竞价转让推荐
            $.ajax({
                type: "get"
                , url: protUrl + "/int/createDesc/projects"
                , data: {
                    title: title
                    , currentPage: currentPage
                    , pageSize: 10
                }
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    $.each(res.data.rows, function (i, item) {
                        html += '<div class="bts_del jj_del" data-id=' + item.id + '><a href="project_detaile.html?project=' + item.id + '">' + '<div class="jj_title">' + '<div class="jj_title_l"><img src=' + item.logo + '/></div>' + '<div class="jj_title_r">' + '<h3>' + item.title + '<span>' + item.brief + '</span></h3>';
                        if (item.amount != undefined) {
                            $.each(_status, function (index, el) {
                                if (item.status == el) {
                                    html += '<p>融资' + item.amount + '万' + ' ' + _text[index] + '</p>';
                                }
                            });
                        }
                        else {
                            html += '<p>待审核</p>';
                        }
                        html += '</div>' + '</div>' + '<dl> ' + '<dt>';
                        if (item.cover != undefined) {
                            html += '<img  class="dt_bg" src="' + item.cover + '?imageMogr2/thumbnail/!298x125r/gravity/Center/crop/298x125" alt="">';
                        }
                        else {
                            html += '<img  class="dt_bg" src="../images/default-cover.png" alt="">';
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
    }
})(jQuery);
////排序点击
//$('.paixu>div').click(function () {
//    $(this).addClass('selectPaixu').siblings('div').removeClass('selectPaixu');
//});