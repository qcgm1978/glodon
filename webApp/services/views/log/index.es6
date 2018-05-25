
//日志管理入口
App.Services.Log=Backbone.View.extend({
	tagName:"div",
	className:"systemContainerBox",
	events:{
		//"click .serviceNav .item":"itemClick"
	},
	render(){
		this.$el.html(new App.Services.Log.topBar().render().el);
		this.$('#logContainer').append(new App.Services.searchView().render().$el);
		this.$('#logContainer').append(new App.Services.ContentMode().render().$el);
		App.Services.loadData(App.Services.formData);
		return this;
	}
});
App.Services.Log.chooseTypes = ["项目","族库","标准模型","权限管理","项目管理","应用管理","系统管理","图纸模型","建议反馈","全部"];
App.Services.Log.leibiexiangTypes = ["文件浏览器","模型","业务流程","成员管理","角色管理","关键用户","数据权限","项目映射","业务类别","扩展属性管理","批注","应用管理"];