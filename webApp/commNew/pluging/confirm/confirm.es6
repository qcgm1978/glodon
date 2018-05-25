;
(function($) {

	$.confirm = function(text, enterCallback, canelCallback) {

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

		opts.message = tpl.replace('{text}', text);;

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

		//var confirmDialog = new App.Comm.modules.Dialog(opts);

		confirm.find(".btnEnter").click(function() {

			if ($.isFunction(enterCallback)) {
				if (enterCallback() != false) {
					confirm.remove();
				}

			} else {
				confirm.remove();


			}
			$('#comment').show();
			//$('.mod-dialog').css({'background':'#fff',width:'600px','margin-left':'','margin-top':''});



		});

		confirm.find(".btnCanel").click(function() {

			if ($.isFunction(canelCallback)) {
				canelCallback()
			}
			confirm.remove();
			$('#comment').show();
			//$('.mod-dialog').css({'background':'#fff',width:'600px','margin-left':'','margin-top':''});

			return false;
		});

		$('#comment').append(confirm);
		//$('#comment').hide();
		//$('.mod-dialog').css({'background':'transparent',width:'284px','margin-left':'150px','margin-top':'100px'});

	}


})(jQuery);