App.backStage.SetPermissionsIndexV.PublicListBoxV = Backbone.View.extend({
	tagName:'div',
	className:'scrollBox',
	template:_.templateUrl("/backStage/tpls/setPermissions/setPermissionsPublicList.html"),
	events:{
		"click .checkItem": "checkItemFun",
	},
	render:function(items){
		this.$el.html(this.template({items:items}));
		return this;
	},
	checkItemFun(){//点击列表的单个复选框的方法
		var allCheck = $(".allCheck");
		if (this.$el.parent().parent().find(".checkItem:not(:checked)").length>0) {
			allCheck.prop("checked",false);
		}else{
			allCheck.prop("checked",true);
		}
	},
})