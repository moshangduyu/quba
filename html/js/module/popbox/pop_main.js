define(function(require,exports,module){

  var $ = require("../../lib/jquery/jquery-1.10.1.min.js");
  var css = require('./popbox.css','css|url');
  var linkTag = $('<link href="' + css + '" rel="stylesheet" type="text/css" />');
  $($('head')[0]).find('title').after(linkTag);


  /**
   * @param {Object} options
   * @param options.type(Number,String) 弹窗类型 1：提示框（默认） 2：带表单的提示框
   * @param options.title(String) 弹窗标题 默认为“提示”
   * @param options.msg（String) 弹窗提示内容
   * @param options.height（Number,String) 弹窗高度
   * @param options.btn（String) 弹窗的按钮
   * @param options.callback（function) 弹窗按钮的回调函数
   */

	function popBox(options){
    this.options = options;
		this.options.type = options.type==undefined?1:options.type;
    this.options.title = options.title==undefined?'提示':options.title;
    this.options.btn =options.btn==undefined?'':options.btn;
    this.options.msg = options.msg==undefined?'无内容':options.msg;
    this.options.height = options.height==undefined?'240':options.height;
    this.options.callback = options.callback ==undefined?null:options.callback;
	}
	module.exports = popBox;

  popBox.prototype.render = function(){
    this._creatBox();
  }
  popBox.prototype._creatBox = function(){
    var _this = this;
    var BoxDom = '<div class="pop-box" style="height:'+ _this.options.height +'px;">\
                  <i></i>';
    if(_this.options.type == 1){
      BoxDom += '<h2 class="pop-title ic-tip">'+ _this.options.title +'</h2>\
                <p class="pop-msg">'+ _this.options.msg +'</p>';
    }else{
      BoxDom += '<h2 class="pop-title ic-form">'+ _this.options.title +'</h2>\
                '+ _this.options.msg +'';
    }
    BoxDom += ''+ this.options.btn +'';
    BoxDom+='</div>';
    $('body').append('<div class="pop-bg"></div>');
    $('body').append(BoxDom);
    $('.pop-bg,.pop-box').show();
    $('.pop-box i').on('click', function(event) {
      _this._closeBox();
      event.preventDefault();
    });
    if(this.options.callback!=undefined){
      this.options.callback();
    }
  }
  popBox.prototype._closeBox = function(){
    $('.pop-bg,.pop-box').remove();
  }
})
