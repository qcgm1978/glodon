App.backStage.SetPermissionsIndexV.PublicBoxV = Backbone.View.extend({
	tagName: 'div',
	className: 'setPermissionsPublicBox',
	template: _.templateUrl("/backStage/tpls/setPermissions/setPermissionsPublicBox.html"),
	events: {
		"click .allCheck": "allCheckFun", //全选的方法
		"click #addViewUserBtn": "addViewUserBtnFun", //添加部门按钮的方法
		"click #deleteViewUserBtn": "deleteBtnFun", //删除部门按钮的方法
		
	},
	render: function() {
		this.$el.html(this.template);
		this.getListHandle(); //获取当前tab下的列表的方法
		return this;
	},
	getListHandle: function() { //获取当前tab下的列表的方法
		var _self = this;
		var data = {
			type: this.model == "viewStandardPattern" ? 2 : 1,
			pageIndex: 1,
			pageItemCount: 30
		}
		var datas = {
			URLtype: "getWorkforgconList",
			data: data,
			type: "get",
			contentType: "application/json",
		}
		$("div#tbodyDom").html("");
		var PublicListBoxV = "";
		App.Comm.ajax(datas, function(result) {
			if (result.code == 0) {
				var items = result.data.items;
				PublicListBoxV = new App.backStage.SetPermissionsIndexV.PublicListBoxV();
				$("div#tbodyDom").html(PublicListBoxV.render(items).el);
			}
		})
	},
	allCheckFun(event) { //点击列表的全选复选框的方法
		var checkItem = this.$el.find("#tbodyDom .checkItem");
		checkItem.prop('checked', event.target.checked);
	},
	deleteBtnFun: function() { //点击删除按钮执行的方法
		var _this = this;
		var flag = false;
		var checkItem = this.$el.parent().parent().find(".checkItem:checked");
		var deleteArr = [];
		if (checkItem.length <= 0) {
			alert("请选择要删除的部门");
			return;
		} else {
			_.each(checkItem, function(item, index) {
				deleteArr.push({
					"id": $(item).parent().data("deleteid"),
					"type": _this.model == "viewStandardPattern" ? 2 : 1
				});
			});
			flag = true;
		}
		var text = _.templateUrl('/backStage/tpls/setPermissions/setPermissionsPublicDeleteBox.html', true);
		var deleteAlertDialog = new App.Comm.modules.Dialog({
			width: 284,
			height: 180,
			showTitle: false,
			showClose: false,
			isAlert: false,
			isConfirm: false,
			message: text(),
		});
		$("#servicesSure").off("click")
		$("#servicesSure").on("click", function() { //点击确定 
			if (flag) {
				var datas = {
					URLtype: "deleteWorkforgcon",
					data: JSON.stringify(deleteArr),
					type: "delete",
					contentType: "application/json",
				}
				App.Comm.ajax(datas, function(result) {
					if (result.code == 0) {
						_this.getListHandle(); //获取当前tab下的列表的方法
						deleteAlertDialog.close();
						$(".allCheck").prop("checked", false);
						return;
					}
				})
			}
		})
		$("#servicesCancel").off("click")
		$("#servicesCancel").on("click", function() { //点击取消 关闭弹出
			deleteAlertDialog.close();
		})
	},
	addViewUserBtnFun: function() { //添加部门按钮的方法
		var memberManager=new App.backStage.AddDepartmentV().render(this.model == "viewStandardPattern" ? 2 : 1);
		App.backStage.maskWindow=new App.Comm.modules.Dialog({
			title:'添加成员/部门',
			width:640,
			isConfirm:false,
			message:memberManager.el
		});
		memberManager.initView();
	},
})