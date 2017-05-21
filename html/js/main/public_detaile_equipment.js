/**
 * Created by coffee on 20/04/2017.
 */
define(function (require) {

    require("./common");
    var $ = require("../lib/jquery/jquery-1.10.1.min.js");
    var URLSearchParams = require("../module/URLSearchParams");
    var Url = require("../module/url_main");
    var baseUrl = new Url().url;
    // login 模块
    var login = require("../module/login.js"),
      Login = new login();
      Login.render();
    var catalog = "",
        id = "";

    var contentList = $(".important-result"),
        pagination = $(".page-nav");

    var urlParams = new URLSearchParams(location.search.replace("?", ""));
    id = urlParams.get("id");

    function initData() {
        $.get(baseUrl + "/web/content/info", {
            // catalog: "",
            content: id ? decodeURI(id) : ""
        }).done(function (res) {
            console.log(res);

            if(res.status !== 0){
                throw new Error(res.message);
            }


            $("#title").text(res.data.title);
            $("#content").html(res.data.body);
            $("#cover").attr("src", res.data.cover);
            $("#catalog").text(res.data.catalog.name);

            var date = new Date(res.data.publishTime);

            $("#publish-time").text(date.getFullYear() + '.' + (date.getMonth()+1) +'.'+date.getDate())

        });
    }


    initData();




});
