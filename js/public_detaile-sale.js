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
        $.ajax({
            type: "get"
            , url: protUrl + '/content/info'
            , dataType: 'json'
            , data: {
                content: _id
            }
            , success: function (res) {
                $("#title").text(res.data.title);
                $("#content").html(res.data.body);
                $("#catalog").text(res.data.catalog.name);
                var date = new Date(res.data.publishTime);
                $("#publish-time").text(date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate());
                myScroll.refresh();
            }
        })
        myScroll.on('scroll', function () {
            myScroll.refresh();
        });
        //返回顶部
        backTop(myScroll);
    }
})(jQuery);