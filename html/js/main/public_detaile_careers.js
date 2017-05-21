/**
 * Created by coffee on 07/05/2017.
 */


define(function (require, exports, module) {

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

    var urlParams = new URLSearchParams(location.search.replace("?", ""));

    function initData() {

        $.get(baseUrl + "/web/recruiting/info", {recruiting: urlParams.get("id")}).done(function(res){

            console.log(res);

            if(res.status !== 0){
                throw new Error(res.message);
            }

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
            $("#salaryMin").text("￥" +  moneyFormat(res.data.salaryMin));
            $("#companyDescription").text(res.data.companyDescription);
            $("#title").text(res.data.title);

            var date = new Date(res.data.publishTime);

            $("#publishTime").text(date.getFullYear() + '.' + (date.getMonth()+1) +'.'+date.getDate());


        }).fail(function (e) {
        });

    }

    function initTabs(){

        var li = $(".tabs-header>li");

        li.on("click", function () {
            var _this = $(this);

            _this.addClass("active").siblings().removeClass("active");

            $(".tabs-content").hide().filter("."+_this.attr("data-for")).show();

        });

    }

    initTabs();
    initData();

});