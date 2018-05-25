App.Services.PreviewNotice=Backbone.View.extend({
	tagName:"div",
	className:"previewNoticeBox",
	render(noticeId){
		this.$el.html(new App.Services.previewNoticeTopBar().render().el);
		if(noticeId == "noticeNoSavePreview"){
			var noticeId = localStorage.getItem(noticeId);
			this.$el.append(new App.Services.previewNoticeContent({model:{data:JSON.parse(noticeId)}}).render().el);
		}else{
			this.getNoticeData(noticeId);//获取当前公告的信息方法
		}
		return this;
	},
	getNoticeData(noticeId){//获取当前公告的信息方法
		var _this = this;
		var data = {
			"id":noticeId
		}
		App.Comm.ajax({
			URLtype:"getNotice",
			data:data,
		}).done(function(res){
			if(res.code==0){
				_this.$el.append(new App.Services.previewNoticeContent({model:res}).render().el);
			}
		})
	}
})