App.backStage.SetPermissionsIndexV = Backbone.View.extend({
	el:$("#contains"),
	template:_.templateUrl("/backStage/tpls/setPermissions/setPermissions.html"),
	events:{
		"click #headerUlTab li":"headerUlTabFun",//tab切换的效果
	},
	render:function(){
		this.$el.html(this.template());
		this.loadInitHandle();//初始化执行的方法
		return this;
	},
	loadInitHandle:function(){//初始化执行的方法
		this.$("#headerUlTab li").eq(0).trigger("click");
	},
	headerUlTabFun:function(event){//tab切换的效果 并且加载公用的添加按钮和删除按钮
		var target = $(event.target);
		var tabType = target.data("type");
		var downViewShowBox = $("#downViewShowBox");
		target.addClass("selected").siblings().removeClass("selected");
		downViewShowBox.find("."+tabType).css("display","block").siblings().css("display","none");
		var PublicBoxV = new App.backStage.SetPermissionsIndexV.PublicBoxV({model:tabType});
		downViewShowBox.find("."+tabType).html(PublicBoxV.render().el);
	}
})