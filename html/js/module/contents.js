/**
 * Created by coffee on 26/04/2017.
 */

define(function (require, exports, module) {

    /**
     * 截取指定字数内容中的纯文本
     * @param content 传入的文本或者html
     * @param fontSize 需要截取的字数，默认为80
     * 备注： 如果超过90长度被截断，会额外增加"..."
     */
    exports.cutContent = function (content, fontSize) {
        if(!content){
            return content;
        }

        fontSize = fontSize || 80;

        var text = "";

        // 判断是否包含html标签
        if(/<(\w+)>/.test(content)){
            text = $(content).text();
        }else{
            text = content;
        }

        if(text.length > fontSize){
            text = text.substr(0, fontSize) + "...";
        }

        return text;
    };

    /**
     * 生成分页结构，并且绑定翻页回调
     * @param currentPage
     * @param totalPage
     * @param pageChangeCallback(goPage), goPage表示需要跳转到的页面
     * @returns {Element}
     */
    exports.initPagination = function(currentPage, totalPage, pageChangeCallback){

        if(totalPage <= 1){
            return document.createElement("div");
        }

        var pages = [];

        pageChangeCallback = pageChangeCallback || function(){};

        var pageChange = function (event) {
            console.log(event);
            event.preventDefault();

            var $target = $(event.currentTarget);

            if($target.hasClass("next") && currentPage < totalPage){
                console.info("下一页");
                pageChangeCallback(currentPage+1);
            }else if($target.hasClass("prev") && currentPage > 1 ){
                console.info("上一页");
                pageChangeCallback(currentPage-1);
            }else{
                var page = parseInt($target.attr("data-page"));

                if(page && page !== currentPage){
                    pageChangeCallback(page);
                }

            }


        };

        var n = currentPage - 3 > 0 ? currentPage - 3 : 1;
        while (n < currentPage && n > 0){
            var li = $("<li><a href='javascript:void(0)'></a></li>");
            li.on("click", pageChange);

            li.attr("data-page", n).find("a").text(n);
            pages.push(li[0]);

            n++;
        }

        n = currentPage;
        while (n < currentPage + 3 && n <= totalPage){
            var li = $("<li><a href='javascript:void(0)'></a></li>");
            li.on("click", pageChange);

            li.attr("data-page", n).find("a").text(n);
            pages.push(li[0]);

            if(n === currentPage){
                li.addClass("active");
            }

            n++;
        }

        var prevPage = $("<li class='prev'><a></a></li>"),
            nextPage = $("<li class='next'><a></a></li>");

        prevPage.on("click", pageChange);
        nextPage.on("click", pageChange);

        //currentPage > 1 && pages.unshift(prevPage[0]);
        //currentPage < totalPage && pages.push(nextPage[0]);
        pages.unshift(prevPage[0]);
        pages.push(nextPage[0]);


        var ul = document.createElement("ul");
        pages.forEach(function (li) {
            ul.appendChild(li);
        });

        return ul;

    };

    /**
     * 生成只有上一页和下一页的分页结构
     * @param currentPage {number} 当前页码
     * @param totalPage {number} 总页码
     * @param pageChangeCallback 点击后的回调
     */
    exports.initPagination2 = function(currentPage, totalPage, pageChangeCallback) {

        if(totalPage <= 1){
            return document.createElement("div");
        }

        var list = $(
            '<a href="javascript:;" class="search-prev"></a>'+
            '<span class="num">1/2</span>'+
            '<a href="javascript:;" class="search-next"></a>'
        );

        list.filter(".num").text(currentPage + "/" + totalPage);
        list.filter(".search-prev").on("click", function () {
            !(currentPage <= 1) && pageChangeCallback(currentPage-1);
        });
        list.filter(".search-next").on("click", function () {
            !(currentPage >= totalPage) && pageChangeCallback(currentPage+1);
        });

        return list;
    }

});