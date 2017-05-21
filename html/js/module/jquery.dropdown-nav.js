/**
 * Created by coffee on 29/03/2017.
 */

define(function(require,exports,module){

    var $ = require("../lib/jquery/jquery-1.10.1.min.js");

    $.fn.dropdownNav = function () {

        var _this = $(this),
            nav   = _this.find(".subnav"),
            $body = $(document.body),
            show  = false;

        var hideByBody = function () {
            show = false;
            nav.hide();
        };

        nav.on("click", function (event) {
            event.stopPropagation();

            if(show){
                hideByBody();
            }
        });


        _this.on("click", function (event) {
            event.stopPropagation();

            $body.off("click", hideByBody);

            if(!show){
                nav.show();
                show = true;
            }else{
                hideByBody();
            }

            $body.one("click", hideByBody);
        })

    };

});

