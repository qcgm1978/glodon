App.Services.Dialog = {

	alert: function(msg, callback,btnText) {


		var text = _.templateUrl('/services/tpls/system/category/system.category.del.html', true)(),

			opts = {
				width: 284, 
				showTitle: false,
				cssClass: "delConfirm",
				showClose: false,
				isAlert: false, 
				limitHeight:false,
				isConfirm: false
			};

			opts.message =text.replace('#title', msg);

		var confirmDialog = new App.Comm.modules.Dialog(opts);

		confirmDialog.element.on("click", ".btnEnter", function() {

			var $this = $(this);

			if ($this.hasClass("disabled")) {
				return;
			}

			$this.addClass("disabled").val(btnText?btnText:"删除中");

			if ($.isFunction(callback)) {
				callback(confirmDialog);
			} else {
				confirmDialog.close();
			}

		});

		//取消 关闭层
		confirmDialog.element.on("click", ".btnCanel", function() {
			confirmDialog.close();
		});

	}



}