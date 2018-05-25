App.Services.NoticeAttrManagerContentDetail = Backbone.View.extend({
	tagName:'tr',
	className:"itemClick",
	template:_.templateUrl("/services/tpls/system/notice/noticeAttrManagerDownContentDetail.html"),
	render(){//渲染
		this.$el.html(this.template(this.model));
		return this;
	},
});