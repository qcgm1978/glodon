//公告管理
App.Services.NoticeAttrManager = Backbone.View.extend({
	tagName:"div",
	className:"noticeAttrManager folwManager", 
	render:function(){//渲染
		var NoticeAttrManagerTopbar = new App.Services.NoticeAttrManagerTopbar();
		var NoticeAttrManagerContent = new App.Services.NoticeAttrManagerContent();
		this.$el.append(NoticeAttrManagerTopbar.render().el);//公告标签的头部按钮
		this.$el.append(NoticeAttrManagerContent.render().el);
		return this;
	}
});