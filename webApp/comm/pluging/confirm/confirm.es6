;
(function($) {

	$.confirm = function(text, enterCallback, canelCallback) {

		if ($(".confirm").length > 0) {
			return;
		}

		var tpl = _.templateUrl('/comm/pluging/confirm/confirm.html', true)(),

			opts = {
				width: 284,
				height:109,
				showTitle: false,
				cssClass: "confirm",
				showClose: false,
				isAlert: false,
				limitHeight: false,
				isConfirm: false
			};

		opts.message = tpl.replace('{text}', text);

		var confirmDialog = new App.Comm.modules.Dialog(opts);

		confirmDialog.element.find(".btnEnter").click(function() {

			if ($.isFunction(enterCallback)) {
				if (enterCallback() != false) {
					confirmDialog.close();
				}

			} else {
				confirmDialog.close();
			}



		});

		confirmDialog.element.find(".btnCanel").click(function() {
			
			if ($.isFunction(canelCallback)) {
				canelCallback()
			}
			confirmDialog.close();
			return false;
		});

	};

	$.confirmPlus = function(text, enterCallback, canelCallback) {
		if ($(".confirm").length > 0) {
			return;
		}
		var tpl = _.templateUrl('/comm/pluging/confirm/confirm.html', true)(),
		    opts = {
			    width: 284,
			    showTitle: false,
			    cssClass: "confirm",
			    showClose: false,
			    isAlert: false,
			    limitHeight: false,
			    isConfirm: false
		    };
		opts.message = tpl.replace('{text}', text);
		var confirm = $(opts.message);
		$('#comment').find(".reMarkBox").append(confirm);
		confirm.find(".btnEnter").click(function() {
			if ($.isFunction(enterCallback)) {
				if (enterCallback() != false) {
					confirm.remove();
				}
			} else {
				confirm.remove();
			}
			$('#comment').show();
		});
		confirm.find(".btnCanel").click(function() {
			if ($.isFunction(canelCallback)) {
				canelCallback()
			}
			confirm.remove();
			$('#comment').find(".reMarkBox").show();
			return false;
		});
	}


})(jQuery);