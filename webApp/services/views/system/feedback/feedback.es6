/**
 * @require /services/views/system/index.es6
 */
//建议反馈管理
App.Services.FeedBackAttrManager=Backbone.View.extend({
	tagName:"div",
	className:"feedBackAttrManager folwManager", 
	render(){//渲染
		this.$el.append(new App.Services.FeedBackAttrManagerTopbar().render().el);//资源标签的头部按钮
		this.$el.append(new App.Services.FeedBackAttrManagerContent().render().el);
		return this;
	}
});