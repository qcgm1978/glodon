App.Services.previewNoticeTopBar=Backbone.View.extend({
	tagName:"div",
	className:"previewNoticeTopBar",
	template:_.templateUrl("/services/tpls/system/notice/previewNoticeTopBar.html",true),
	render(){
		this.$el.append(this.template);
		return this;
	}
})