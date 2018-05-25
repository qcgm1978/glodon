App.Services.previewNoticeContent=Backbone.View.extend({
	tagName:"div",
	className:"previewNoticeContent",
	template:_.templateUrl("/services/tpls/system/notice/previewNoticeContent.html"),
	render(){
		if(this.model){
			this.$el.append(this.template({data:this.model.data}));
		}
		return this;
	}
})