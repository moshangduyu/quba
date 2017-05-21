;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: false
            , click: true
            , bounce: false
        });
        //页面渲染
        indexAjax()

        function indexAjax() {
            //竞价转让推荐
            $.ajax({
                type: "GET"
                , url: protUrl + "/homepage/recommend/techs"
                , data: {}
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    $.each(res.data.rows, function (i, item) {
                        if (item.type == 'tech') {
                            var code = item.tech.techTypePath.split(',');
                            html += ' <div class="bts_del">' + '<a href="javascript:;">' + '<h2>' + item.tech.title + '</h2>' + '<dl> <dt><img class="zl" src="images/ic_zhuan_li.png"/>';
                            if (item.tech.cover == undefined) {
                                html += '<img class="dt_bg" src="/images/default-cover.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.tech.cover + '?imageMogr2/thumbnail/!298x224r/gravity/Center/crop/298x224" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p>';
                            if (code[0] != 200) {
                                html += '<span>' + item.tech.techTypeName + '</span>' + '<span>' + item.tech.industryName + '</span>' + '<span>' + item.tech.maturityName + '</span>';
                            }
                            else {
                                html += '<span>' + item.tech.industryName + '</span>' + '<span>' + item.tech.maturityName + '</span>'
                            }
                            html += '</p>' + '<div class="pre">';
                            if (item.tech.currency == "CNY") {
                                html += '<p>转让底价：<span>￥' + (item.tech.startPrice / 10000) + '万</span></p>';
                                if (item.tech.bidRange >= 10000) {
                                    html += '<p>加价幅度：<span>￥' + (item.tech.bidRange / 10000) + '万</span></p>';
                                }
                                else {
                                    html += '<p>加价幅度：<span>￥' + item.tech.bidRange + '元</span></p>';
                                }
                            }
                            else {
                                html += '<p>转让底价：<span>$' + (item.tech.startPrice / 10000) + '万</span></p>';
                                if (item.tech.bidRange >= 10000) {
                                    html += '<p>加价幅度：<span>$' + (item.tech.bidRange / 10000) + '万</span></p>';
                                }
                                else {
                                    html += '<p>加价幅度：<span>$' + item.tech.bidRange + '元</span><p>';
                                }
                            }
                            html += '</div>' + '</dd>' + '</dl>' + '</a>' + '</div>';
                        }
                        else {
                            html += ' <div class="bts_del">' + '<a href="javascript:;">' + '<h2>' + item.fixedasset.title + '</h2>' + '<dl> <dt><img class="zl" src="images/ic_zhuan_li.png"/>';
                            if (item.fixedasset.cover == undefined) {
                                html += '<img class="dt_bg" src="images/default-cover.png" alt="">';
                            }
                            else {
                                html += '<img class="dt_bg" src="' + item.fixedasset.cover + '" alt="">';
                            }
                            html += '</dt>' + '<dd>' + '<p>' + '<span>' + item.fixedasset.typeName + '</span>' + '<span>' + item.fixedasset.regionFullName + '</span></p>' + '<div class="pre">';
                            // 转让底价
                            var startPriceNum = item.fixedasset.startPrice;
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
                            var bidRangeNum = item.fixedasset.bidRange;
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
                        }
                    });
                    $('#jjzr').html(html);
                    myScroll.refresh();
                }
            });
            //融资项目推荐
            var txt = ['未申请募资', '待审核', '转让中', '转让完成', '转让申请未通过', '转让失败'];
            $.ajax({
                type: "GET"
                , url: protUrl + "/homepage/recommend/projects"
                , data: {}
                , jsonp: "jsoncallback"
                , success: function (res) {
                    var html = ""
                    $.each(res.data.rows, function (i, item) {
                        html += '<div class="bts_del jj_del" data-id=' + item.project.id + '><a href="project_detaile.html?project=' + item.project.id + '">' + '<div class="jj_title">' + '<div class="jj_title_l"><img src=' + item.project.logo + '/></div>' + '<div class="jj_title_r">' + '<h3>' + item.project.title + '<span>' + item.project.brief + '</span></h3>';
                        if (item.project.amount != undefined) {
                            html += '<p>融资' + item.project.amount + '万' + ' ' + txt[item.project.status] + '</p>';
                        }
                        else {
                            html += '<p>待审核</p>';
                        }
                        html += '</div>' + '</div>' + '<dl> ' + '<dt>';
                        if (item.project.cover != undefined) {
                            html += '<img  class="dt_bg" src="' + item.project.cover + '?imageMogr2/thumbnail/!298x125r/gravity/Center/crop/298x125" alt="">';
                        }
                        else {
                            html += '<img src="images/default-cover.png" alt="">';
                        }
                        html += '</dt>' + '<dd>' + '<p>';
                        if (item.project.priseName !== undefined) {
                            html += '<span>' + item.project.priseName + '</span>';
                        }
                        html += '<span>' + item.project.industryName + '</span></p>' + '<div class="pre jj_title_pre">';
                        if (item.project.founder !== undefined) {
                            html += '<p>创始人<span>' + item.project.founder + '</span></p>';
                        }
                        else {
                            html += '<p>创始人<span>未填写</span></p>';
                        }
                        if (item.project.highlight !== undefined) {
                            html += '<p>产品数据<span>' + item.project.highlight + '</span></p>';
                        }
                        else {
                            html += '<p>产品数据<span>未填写</span></p>';
                        }
                        if (item.project.teamPoint !== undefined) {
                            html += '<p>团队成员<span>' + item.project.teamPoint + '</span></p>';
                        }
                        else {
                            html += '<p>团队成员<span>未填写</span></p>';
                        }
                        html += '</div>' + '</dd > ' + '</dl>' + '</a></div>';
                    });
                    $('#rzxm').html(html);
                    myScroll.refresh();
                }
                , error: function (e) {
                    console.log(e)
                }
            });
        }
        //banner滑动
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination'
            , paginationClickable: true
            , paginationBulletRender: function (swiper, index, className) {
                return '<span class="' + className + ' swiper_icon"></span>';
            }
            , centeredSlides: true
            , loop: true
            , autoplay: 3000
            , autoplayDisableOnInteraction: false
        });
        //底部logo滑动
        var swiper2 = new Swiper('.swiper-container2', {
            nextButton: '.swiper-button-next'
            , prevButton: '.swiper-button-prev'
        });
        //返回顶部按钮
        backTop(myScroll);
    }
})(jQuery);