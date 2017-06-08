;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: true
            , click: true
        });
        var _id = GetQueryString('id');
        var _catalog = GetQueryString('catalog');

        function moneyFormat(value) {
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
        $.ajax({
            type: "get"
            , url: protUrl + '/recruiting/info'
            , dataType: 'json'
            , data: {
                recruiting: _id
            }
            , success: function (res) {
                $("#company, .company").text(res.data.company);
                $("#companyAddress").text(res.data.companyAddress);
                $("#companyDescription").text(res.data.companyDescription);
                $("#companyScaleName").text(res.data.companyScaleName);
                $("#companyTypeName").text(res.data.companyTypeName);
                $("#degreeName").text(res.data.degreeName);
                $("#experienceName").text(res.data.experienceName);
                $("#industryName").text(res.data.industryName);
                $("#jobDescription").text(res.data.jobDescription);
                $("#jobTypeName").text(res.data.jobTypeName);
                $("#regionFullName").text(res.data.regionFullName);
                $("#salaryMax").text("￥" + moneyFormat(res.data.salaryMax));
                $("#salaryMin").text("￥" + moneyFormat(res.data.salaryMin));
                $("#companyDescription").text(res.data.companyDescription);
                $("#title").text(res.data.title);
                var date = new Date(res.data.publishTime);
                $("#publishTime").text(date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate());
                myScroll.refresh();

                function initTabs() {
                    var li = $(".tabs-header>li");
                    li.on("click", function () {
                        var _this = $(this);
                        _this.addClass("active").siblings().removeClass("active");
                        $(".tabs-content").hide().filter("." + _this.attr("data-for")).show();
                    });
                }
                initTabs();
            }
        })
        myScroll.on('scroll', function () {
            myScroll.refresh();
        });
        //返回顶部
        backTop(myScroll);
    }
})(jQuery);