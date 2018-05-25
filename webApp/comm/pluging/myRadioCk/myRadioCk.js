  
;
(function($) {

	$.fn.myRadioCk = function(opts) {
		$(this).each(function() {
			new myRadioCk($(this), opts);
		});
	}

	// 单选，多选
	function myRadioCk($el, opts) {

		var settings = {
			click: null
		}

		this.settings = $.extend(settings, opts);


		//事件绑定
		this.bindEvent = function() {
			var that = this;
			$el.on("click", ".btnRadio,.btnCk", function() {
				//禁用不可选中
				if ($(this).hasClass("disable") || $el.hasClass("disable")) return;

				if ($(this).is(".btnCk")) {
					//选中样式
					$(this).toggleClass('selected');
				} else {
					//选中样式
					$(this).addClass('selected').siblings().removeClass('selected');
				}

				if ($.isFunction(that.settings.click)) { 
					that.settings.click.call($el,$(this).hasClass('selected'));
				}
			});
		}

		this.init = function() {
			this.bindEvent();
		}

		this.init();


	}

})(jQuery);