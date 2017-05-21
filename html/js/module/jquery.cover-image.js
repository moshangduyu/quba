/**
 * Created by coffee on 26/04/2017.
 */

define(function (require) {
    var $ = require("../lib/jquery/jquery-1.10.1.min.js");

    /**
     * 封面图片自适应缩放
     * 说明：在设定父容器超出隐藏的情况下，将图片的短边缩放至容器合适程度
     */
    $.fn.coverImage = function () {

        $(this).each(function () {
            var _this = $(this),
                parent = _this.parent(),
                imgSrc = _this.attr("data-src");

            console.log(parent.width());

            // 不可见图像，用于测得实际尺寸
            var image = $("<img />");
            image.on("load", function () {
                console.log(this.width, this.height);

                var h = this.height/(this.width/parent.width());

                _this.css({
                    position: "absolute",
                    top: -(h - parent.height())/2,
                    left: "0",
                    width: parent.width() + "px",
                    height: h + "px"
                })
            });

            image.attr("src", imgSrc);

            _this.on("error", function () {
                _this.attr("src", "images/project_list/default-cover.png");
            });
            _this.attr("src", imgSrc);

        });

    }

});