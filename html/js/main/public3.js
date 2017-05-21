/**
 * Created by coffee on 20/04/2017.
 */
define(function (require) {

    var $ = require("../lib/jquery/jquery-1.10.1.min.js");
    require("../module/jquery.cover-image");

    var URLSearchParams = require("../module/URLSearchParams");
    var Url = require("../module/url_main");
    var cutContent = require("../module/contents").cutContent;
    var moneyFormat = require("../module/moneyFormat");
    require("../module/fixed-right-menu");
    var baseUrl = new Url().url;

    // login 模块
    var login = require("../module/login.js"),
        Login = new login();
    Login.render();

    var initPagination = require("../module/contents").initPagination;
    var initPagination2 = require("../module/contents").initPagination2;

    var catalog = "",
        title = "";

    var contentList = $(".carees-detaile ul"),
        pagination = $(".page-nav");

    var urlParams = new URLSearchParams(location.search.replace("?", ""));
    urlParams.get("page") || urlParams.set("page", 1);
    title = urlParams.get("title");

    /**
     * 初始化列表数据，之后会触发分页结构刷新
     */
    function initData() {

        $("[name='title']").val(decodeURI(urlParams.get("title")  || ""));

        $.get(baseUrl + "/web/recruiting/recruitings", {
            currentPage: urlParams.get("page"),
            pageSize: 10
        }).done(function (res) {
            console.log(res);

            if(res.status !== 0){
                throw new Error(res.message);
            }

            if(res.data.rows.length > 0){
                var list = [];
                res.data.rows.forEach(function (e) {

                    var date = new Date(e.publishTime);

                    // ' + (e.cover ? "" : "display: none;") + '
                    list.push(
                        '<li>'+
                        '  <a href="public_detaile_careers.html?id=' + e.id + '">'+
                        '    <span> ' + e.title + '</span>'+
                        '    <span>' + e.company + '</span>'+
                        '    <span>￥' + moneyFormat(e.salaryMin) + ' - ￥' + moneyFormat(e.salaryMax) + '</span>'+
                        '    <span>' + e.regionFullName.replace(" ", "/") + '</span>'+
                        '    <span>' + date.getFullYear() + '.' + (date.getMonth()+1) +'.'+date.getDate() + '</span>'+
                        '  </a>'+
                        '</li>'
                    )
                });

                contentList.html(list.join(""));

                $(".important-pic img").coverImage();

            }else{
                $(".project-content-nodata").show();
            }

            var ul = initPagination(res.data.currentPage, res.data.totalPages, function (goPage) {
                console.log(goPage + "...");
                urlParams.set("page", goPage);

                location.search = urlParams.toString();
            });
            // pagination.html("")
            pagination[0].appendChild(ul);

            var ul2 = initPagination2(res.data.currentPage, res.data.totalPages, function (goPage) {
                console.log(goPage + "...");
                urlParams.set("page", goPage);

                location.search = urlParams.toString();
            });

            $(".search-page").html("").append(ul2);

            // 将标题a标签点击扩散到整个li区域都可以点击
            $(".go-href").each(function () {
                var _this = $(this);
                console.log(_this);

                _this.on("click", function () {
                    var href = _this.find("a").attr("href");

                    href && (location.href = href);

                });

            })
        });
    }

    /**
     * 初始化目录数据, 并且绑定change事件刷新页面
     */
    function initCategory(){
        var $category = $("#category");

        $.get(baseUrl + "/web/content/important/information/catalogs").done(function (res) {

            if(res.status !== 0){
                throw new Error(res.message);
            }

            $category.html("");

            res.data.forEach(function (option) {
                $category.append('<option value="' + option.code +'">' + option.name +'</option>');
            });

            $category.val(urlParams.get("catalog"));

        });

        $category.on("change", function (event) {
            event.target.form.submit();
        });


    }


    initData();
    initCategory();



});