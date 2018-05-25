  ;
  (function($) {

    $.fn.at = function(opts) {

      $(this).each(function() {
        new at($(this), opts);
      });

    }

    function at($el, opts) {

      var defaults = {
        $el: $el, //当前元素
        ePos: 0, //光标位置
        getData: null,
        callback: null
      }

      this.Settings = $.extend(defaults, opts);

      this.Settings.id = $el.attr("id");

      //绑定过不用再次绑定    
      if ($el.parent().hasClass("atBox")) {
        return;
      }

      //初始化
      this.init();
    }

    //初始化
    at.prototype.init = function() {
      //构建html
      this.buildHtml();
      //初始化事件
      this.initEvent();
    }

    at.prototype.buildHtml = function() {


      //包裹            
      this.Settings.atBox = this.Settings.$el.wrap('<div class="atBox"></div>').parent();

      this.Settings.atDiv = $('<div  class="atDiv" contenteditable="true"></div>');

      this.Settings.atList = $('<ul class="atList"><li class="loadingUser item">加载中……</li></ul>');

      this.Settings.atBox.append(this.Settings.atDiv);
      this.Settings.atBox.append(this.Settings.atList);

      //样式设置
      this.Settings.atBox.css("display", this.Settings.$el.css("display"));
      this.Settings.atDiv.css({
        width: this.Settings.$el.width(),
        height: this.Settings.$el.height()
      });

    }

    at.prototype.initEvent = function() {

      var that = this;

      this.Settings.atList.on({

        mouseover: function() {
          if ($(this).hasClass("loadingUser")) {
            return;
          }
          $(this).addClass("selected").siblings().removeClass("selected");
        }

      }, ".item");
      //keyup
      this.Settings.$el.on("keyup", function() {

        var keyCode = event.keyCode;

        if (keyCode == 13) {
          //回车 空格
          that.Settings.atList.hide();
          return;

        } else if (keyCode == 8) {

          //回退
          var index = ePos = that.getCursortPosition(),

            val = that.Settings.$el.val().substring(0, index),

            lastAtIndex = that.hasAt(val);

          if (lastAtIndex == -1) {

            that.Settings.atList.hide();

            return;
          }

        }

        if (that.Settings.atList.is(":visible")) {
          if (keyCode == 38 || keyCode == 40) {
            return;
          }
        }

        //计算 at 的位置
        var index = that.Settings.ePos = that.getCursortPosition(),
          val = that.Settings.$el.val().substring(0, index),

          lastAtIndex = that.hasAt(val);
        //未找到
        if (lastAtIndex == -1) {
          return;
        }
        //计算位置
        that.beforeAtListPosition(val);

      });

      //按下
      this.Settings.$el.on("keydown", function(event) {


        if (that.Settings.atList.is(":visible")) {

          var keyCode = event.keyCode,
            index = that.Settings.atList.find(".item.selected").index(),
            count = that.Settings.atList.find(".item").length;

          //上
          if (keyCode == 38) {

            if (index == -1) {
              that.Settings.atList.find(".item:last").addClass("selected");
            } else {
              if (index == 0) {
                index = count;
              }
              that.Settings.atList.find(".item").eq(index - 1).addClass("selected").siblings().removeClass("selected");
              that.Settings.atList.scrollTop(that.Settings.atList.find(".selected").position().top);
            }

            return false;

          } else if (keyCode == 40) {
            //下
            if (index == -1) {

              that.Settings.atList.find(".item:first").addClass("selected");
            } else {

              if (index + 1 == count) {
                index = -1;
              }
              that.Settings.atList.find(".item").eq(index + 1).addClass("selected").siblings().removeClass("selected");
              that.Settings.atList.scrollTop(that.Settings.atList.find(".selected").position().top);
            }

            return false;
          } else if (keyCode == 13) {

            that.Settings.atList.find(".selected").click();

            return false;
          }
        }

      });


      this.Settings.$el.on("click", function() {

        var index = that.Settings.ePos = that.getCursortPosition(),
          val = that.Settings.$el.val().substring(0, index);

        if (!val) {
          return;
        }

        var lastAtIndex = that.hasAt(val);

        //未找到
        if (lastAtIndex == -1) {
          return;
        }

        lastAtIndex + 1;

        //点击了 at 
        val = val.replace(/[\n\r]/gi, "<br/>").replace(/[ ]/g, "a");

        val += '<span class="at"></span>';

        that.Settings.atDiv.html(val);

        that.atListPosition();

        event.stopPropagation();

      });

      that.Settings.atList.on("click", ".item", function() {

        if ($(this).hasClass("loadingUser")) {
          return;
        }

        var text = $(this).find(".name").text() + " ",

          val = that.Settings.$el.val(),

          before = val.substring(0, that.Settings.ePos),

          beforeCount = before.length,

          lastIndex = val.substring(0, that.Settings.ePos).lastIndexOf('@'),

          after = val.substring(that.Settings.ePos);

        that.Settings.$el.val(before.substring(0, lastIndex + 1) + text + after);

        that.Settings.ePos += text.length;

        that.setCaretPosition(that.Settings.ePos);

        //回调
        if (that.Settings.callback) {
          that.Settings.callback($(this));
        }

      });


      $(document).on("click", function() {
        that.Settings.atList.html('<li class="loadingUser item">加载中……</li>');
        that.Settings.atList.hide();
      });

    }

    //定位前的计算
    at.prototype.beforeAtListPosition = function(val) {

      //替换空格 回车
      val = val.replace(/[\n\r]/gi, "<br/>").replace(/[ ]/g, "a");

      val += '<span class="at"></span>'; //标示列

      this.Settings.atDiv.html(val);

      this.atListPosition();
    }

    //是否存在 at 
    at.prototype.hasAt = function(val) {

      var valArr = val.replace(/[\n\r]/gi, " ").split(' '),

        len = valArr.length,

        lastAt = valArr[len - 1],

        lastAtLen = lastAt.length,

        lastAtIndex = lastAt.indexOf('@');

      return lastAtIndex;
    }

    //at list 位置
    at.prototype.atListPosition = function() {

      //个人不可以
      if ($(".commentList .navBar .user").hasClass("selected")) {
        return;
      }
      this.rePosition();
      //获取数据
      this.getData();
    }

    //重新定位
    at.prototype.rePosition = function() {

      var $txt = this.Settings.$el,

        paddingWidth = parseInt($txt.css("padding-left")) + parseInt($txt.css("padding-right")),

        paddingHeight = parseInt($txt.css("padding-top")) + parseInt($txt.css("padding-bottom")),

        pos = this.Settings.atDiv.height($txt.height() + paddingHeight).width($txt.width() + paddingWidth).find(".at").position(),
        top = pos.top + 30;
      // top = pos.top + this.Settings.atBox.offset().top - 60;


      if (top > 30) {
        top -= this.Settings.atList.height() + 30;
      }
      //在窗口中打开时加上窗口的LEFT TOP
      var imboxLeft = 0,
        posLeft = 0,
        self = this;
        posLeft = pos.left+18;
      // posLeft = pos.left + 6 + imboxLeft;
      if(posLeft>($txt.width()- 1.5*this.Settings.atList.width())&&posLeft<$txt.width()){
        posLeft = $txt.width()-this.Settings.atList.width();
      }
      /*if($('.imboxNavWrap').length>0){

          var po = $('.commentRemark').offset(),

          top = pos.top>75?$('.talkReMark').offset().top+85:$('.talkReMark').offset().top+pos.top+20;
          imboxLeft += po.left+18;
          console.log( pos.top,$('.talkReMark').offset().top)
      }*/
      // this.Settings.atList.html('<li class="loadingUser item">加载中……</li>');
      this.Settings.atList.css({
        top: top,
        left: posLeft
      }).show();
    }

    //获取数据
    at.prototype.getData = function() {

      var index = this.Settings.ePos,
        that = this,

        val = this.Settings.$el.val().substring(0, index);

      //没有参数
      if (!val) {
        return;
      }

      var valArr = val.replace(/[\n\r]/gi, " ").split(' '),

        len = valArr.length,

        lastAt = valArr[len - 1],

        lastAtLen = lastAt.length,

        lastAtIndex = lastAt.indexOf('@') + 1,

        name = lastAt.substring(lastAtIndex, lastAtLen).trim();

      if ($.isFunction(this.Settings.getData)) {

        var timer = setTimeout(() => {

          clearTimeout(timer);

          if (this.Settings.Req) {
            this.Settings.Req.abort();
          }
          this.Settings.Req = this.Settings.getData(name).done(function(data) {

            if (data.code == 0) {

              var lis = '',
                liTpl = '<li data-uid="{uid}" class="item"><span class="name">{name}</span>（<span class="dep">{dep}</span>）</li>';
              $.each(data.data, function() {
                lis += liTpl.replace('{name}', this.username).replace('{dep}', this.orgName).replace('{uid}', this.userId);
              });

              if (lis.length > 0) {
                that.Settings.atList.html(lis);
              } else {
                that.Settings.atList.html('<li class="loadingUser item">未找到用户</li></ul>');
              }

              //加载用户后 重新定位
              that.rePosition();

            }
          });
        }, 200);

      }
    }

    //获取光标位置
    at.prototype.getCursortPosition = function() {
      var ctrl = this.Settings.$el[0];
      //获取光标位置函数 
      var CaretPos = 0; // IE Support
      if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
      }
      // Firefox support 
      else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        CaretPos = ctrl.selectionStart;
      return (CaretPos);
    }

    //设置光标位置
    at.prototype.setCaretPosition = function(pos) {
      var ctrl = this.Settings.$el[0];
      if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
      } else if (ctrl.createTextRange) {
        varrange = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }

  })(jQuery);