/**
 * Created by coffee on 20/04/2017.
 */
define(function (require) {

    var $ = require("../lib/jquery/jquery-1.10.1.min.js");
    var URLSearchParams = require("../module/URLSearchParams");
    require("../module/fixed-right-menu");
    var Url = require("../module/url_main");
    var baseUrl = new Url().url;

    // login 模块
    var login = require("../module/login.js"),
        Login = new login();
    Login.render();

    var initPagination = require("../module/contents").initPagination;
    var initPagination2 = require("../module/contents").initPagination2;

    var catalog = "",
        title = "";

    var contentList = $(".innovation-listbox"),
        pagination = $(".page-nav");

    var urlParams = new URLSearchParams(location.search.replace("?", ""));
    urlParams.get("page") || urlParams.set("page", 1);
    urlParams.get("period") || urlParams.set("period", "");
    urlParams.get("catalog") || urlParams.set("catalog", "project.biding");
    title = urlParams.get("title");

    /**
     * 初始化列表数据，之后会触发分页结构刷新
     */
    function initData() {

        $("[name='title']").val(decodeURI(urlParams.get("title")  || "" )).on("keypress", function (event) {
            console.log(event.keyCode);

            // 回车键
            if(event.keyCode === 13){
                urlParams.set("title", this.value);
                location.search = urlParams.toString();

            }


        });

        $.get(baseUrl + "/web/content/contents", {
            // catalog: "",
            title: title ? decodeURI(title) : "",
            currentPage: urlParams.get("page"),
            catalog: urlParams.get("catalog") || "project.biding",
            pageSize: 10,
            period: urlParams.get("period") || ""
        }).done(function (res) {

            if(res.status !== 0){
                throw new Error(res.message);
            }

            res.data.rows.forEach(function (e) {

                var date = new Date(e.publishTime);

                // ' + (e.cover ? "" : "display: none;") + '
                /*list.push(
                    '<li>'+
                    '    <div class="important-pic" style=""><img src="'+e.cover+'" alt=""></div>'+
                    '    <div class="important-words">'+
                    '        <a href="important_detaile.html?id='+e.id+'">' + e.title +'</a>'+
                    '         <div class="important-msg">'+
                    '            <span>发布日期:' + date.getFullYear() + '-' + (date.getMonth()+1) +'-'+date.getDate()+'</span><span>' + (e.catalog && e.catalog.name) + '</span>'+
                    '         </div>'+
                    '        <p>' + e.body + '</p>'+
                    '    </div>'+
                    '</li>'
                )

                */

                contentList.append(
                    '            <li class="go-href">'+
                    '                    <span><a href="innovation_detaile.html?id=' + e.id + '&catalog='+ urlParams.get("catalog") +'">' + e.title + '</a></span>'+
                    '                    <span></span>'+
                    '                    <span>' + (e.catalog && e.catalog.name) +'</span>'+
                    '                    <span>' + date.getFullYear() + '-' + (date.getMonth()+1) +'-'+date.getDate()+'</span>'+
                    '            </li>'
                );


            });

            var ul = initPagination(res.data.currentPage, res.data.totalPages, function (goPage) {
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

            $(".paging-top").html("").append(ul2);

            // 将标题a标签点击扩散到整个li区域都可以点击
            $(".go-href").each(function () {
                var _this = $(this);

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
        var $category = $(".innovation-type-2 ul"),
            $time     = $(".innovation-type-3 ul");

        function goCategory(event){
            console.log(event.currentTarget);

            urlParams.set("catalog", $(event.currentTarget).attr("data-type"));

            location.search = urlParams.toString();
        }


        $.get(baseUrl + "/web/content/collaborative/innovation/catalogs").done(function (res) {

            if(res.status !== 0){
                throw new Error(res.message);
            }

            $category.empty();
            res.data.forEach(function (data) {

                var li = "";

                if(!urlParams.get("catalog") && data.code === "project.biding"){
                    li = $("<li class='active' data-type='"+data.code+"'><span>" + data.name +"</span></li>");
                }else{
                    if(urlParams.get("catalog") === data.code){
                        li = $("<li class='active' data-type='"+data.code+"'><span>" + data.name +"</span></li>");
                    }else{
                        li = $("<li data-type='"+data.code+"'><span>" + data.name +"</span></li>");
                    }
                }

                li.on("click", goCategory);

                $category.append(li);
            })

        });

        $.get(baseUrl + "/web/content/periods").done(function (res) {

            if(res.status !== 0){
                throw new Error(res.message);
            }

            $time.empty();

            res.data.unshift({
                key: "",
                value: "全部"
            })
            res.data.forEach(function (data) {

                var li = "";

                if(urlParams.get("period") === data.key){
                        li = $("<li class='active'><span>" + data.value +"</span></li>")
                }else{
                    li = $("<li><span>" + data.value +"</span></li>");
                }

                li.on("click", function () {
                    urlParams.set("period", data.key);
                    location.search = urlParams.toString();
                });

                $time.append(li);
            });

        });

    }



    initData();
    initCategory();



});