//资源管理
App.Services.System.ResourceAttrManager=Backbone.View.extend({
	tagName:"div",
	className:"resourceAttrManager folwManager", 
	render(){//渲染
		this.$el.append(new App.Services.System.ResourceAttrManagerTopbar().render().el);//资源标签的头部按钮
		this.$el.append(new App.Services.System.ResourceAttrManagerContent().render().el);
		return this;
	}
});