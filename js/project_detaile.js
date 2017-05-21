;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: true
            , click: true
                //            , bounce: false
        });
        var project = GetQueryString('project');
        // Ajax加载数据
        getDetaile();

        function getDetaile() {
            $.ajax({
                type: "get"
                , url: protUrl + '/project/info?project=' + project
                , dataType: 'json'
                , async: false
                , success: function (res) {
                    // 详情页基本资料卡片
                    var DetaileCard = '';
                    if (res.data.cover == undefined) {
                        DetaileCard += '<div class="banner"><img src="../images/common/banner_project.png"  alt=""></div>';
                    }
                    else {
                        DetaileCard += '<div class="banner"><img src="' + res.data.cover + '"  alt=""></div>';
                    }
                    DetaileCard += ' <div class="centerBox center1">' + '<h1 class="title">' + res.data.title + '</h1><div><p>行业领域：<b>' + res.data.industryName + '</b></p>';
                    if (res.data.regionCode == undefined) {
                        DetaileCard += '<p>所属地区：<b>未填写</b></p>';
                    }
                    else {
                        DetaileCard += '<p>所属地区：<b>' + res.data.regionFullName + '</b></p>';
                    }
                    if (res.data.highlight == undefined) {
                        DetaileCard += '<p>产品数据：<b>未填写</b></p>';
                    }
                    else {
                        DetaileCard += '<p>产品数据：<b>' + res.data.highlight + '</b></p>';
                    }
                    if (res.data.teamPoint == undefined) {
                        DetaileCard += '<p>团队特色：<b>未填写</b></p>';
                    }
                    else {
                        DetaileCard += '<p>团队特色：<b>' + res.data.teamPoint + '</b></p>';
                    }
                    if (res.data.priseName == undefined) {
                        DetaileCard += '<p>融资阶段：<b>未填写</b></p>';
                    }
                    else {
                        DetaileCard += '<p>融资阶段：<b>' + res.data.priseName + '</b></p>';
                    }
                    if (res.data.amount == undefined) {
                        DetaileCard += '<p>融资金额：<b>未填写</b></p>';
                    }
                    else {
                        DetaileCard += '<p>融资金额：<b>' + res.data.amount + '万</b></p>';
                    }
                    DetaileCard += '</div></div>';
                    $('.ajaxCenter').html(DetaileCard);
                    //项目概况
                    var projectDec = '';
                    projectDec += '<div class="centerBox center2"><h3>项目概况</h3>';
                    if (res.data.description == undefined) {
                        projectDec += '<div class="content">暂无介绍</div></div>';
                    }
                    else {
                        projectDec += '<div class="content">' + res.data.description + '</div></div>';
                    }
                    // 图片资料
                    projectDec += '<div class="centerBox center3"><h3>图片资料</h3>';
                    if (res.data.pictures.length == 0) {
                        projectDec += '<div class="img"  style="padding-left:.2rem;color:#666;">暂无介绍</div>';
                    }
                    else {
                        projectDec += '<div class="img">';
                        $.each(res.data.pictures, function (index, item) {
                            projectDec += '<img data-pictureskey="' + item.key + '" src="' + item.accessUrl + '">';
                        });
                        projectDec += '</div></div>';
                    }
                    // 创始团队
                    projectDec += '<div id="project_team" class="centerBox center4"><h3> 创始团队 </h3>';
                    if (res.data.teams.length == 0) {
                        projectDec += '<div  style="padding-left:.2rem;color:#666;">暂无介绍</div></div>';
                    }
                    else {
                        projectDec += '<div>';
                        $.each(res.data.teams, function (index, item) {
                            projectDec += '<h4><span>' + item.roleName + '</span>' + item.name + '丨' + item.title + '</h4><p>' + item.brief + '</p>';
                        })
                    }
                    // 发展动态
                    projectDec += '</div></div><div id="project_action" class="centerBox center5"><h3>发展动态</h3>';
                    if (res.data.events.length == 0) {
                        projectDec += '<div  style="padding-left:.2rem;color:#666;">暂无介绍</div></div>';
                    }
                    else {
                        projectDec += '<div><ul>';
                        $.each(res.data.events, function (index, item) {
                            var unixTime = new Date(item.eventTime * 1000)
                                , data = unixTime.getFullYear() + '.' + (unixTime.getMonth() + 1) + '.' + unixTime.getDate();
                            projectDec += '<li>\
                                <span>' + data + '</span>\
                                <b>' + item.description + '</b>\
                                <p>&#12288;</p>\
                              </li>';
                        })
                        projectDec += '</ul></div></div>';
                    }
                    $('.approve').html(projectDec);
                    myScroll.refresh();
                }
            })
        }
        /*nav切换*/
        $('nav>div').click(function () {
            var idx = $(this).index();
            $(this).addClass('selectNav').siblings('div').removeClass('selectNav');
            $('.nav_content>section').eq(idx).show().siblings('section').hide();
            myScroll.refresh();
        })
        myScroll.on('scroll', function () {
            myScroll.refresh();
        })
    }
})(jQuery);