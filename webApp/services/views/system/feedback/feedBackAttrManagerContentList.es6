/**
 * @require /services/views/system/feedback/feedBackAttrManagerContent.es6
 */
App.Services.FeedBackAttrManagerContentList = Backbone.View.extend({
	tagName: 'tr',
	template: _.templateUrl("/services/tpls/system/feedback/feedBackAttrManagerContentList.html"),
	events: {
		"click .downLoadId": "downLoadIdHandle",
		"click td.feedBackTd": "answerBtnHandle",
		"click td a.answerBtn": "answerBtnHandle"
	},
	render() {//渲染
		this.model.createTime = this.changeTimeHandle(this.model.createTime);
		this.model.size = App.Comm.formatSize(this.model.size);
		this.$el.html(this.template(this.model));
		return this;
	},
	changeTimeHandle(time) {//时间转换
		var timeStr = new Date(time);
		timeStr = timeStr.getFullYear() + "-" + (timeStr.getMonth() + 1) + "-" + timeStr.getDate();
		return timeStr;
	},
	answerBtnHandle(event) {
		var target = $(event.target);
		var feedbackid = target.parents("td").data("feedbackid") || target.data("feedbackid");
		var FeedBackAttrManagerContentDialog = new App.Services.FeedBackAttrManagerContentDialog({ model: feedbackid });
		App.Services.FeedBackDialog = new App.Comm.modules.Dialog({
			title: (App.Local.data['online-service'].Fk || "建议反馈"),
			width: 600,
			height: 600,
			isConfirm: false,
			isAlert: false,
			message: FeedBackAttrManagerContentDialog.render().el,
		})
	},
	downLoadIdHandle(event) {
		var target = $(event.target);
		var downloadid = target.data("downloadid");
		var downloadDataObj = {
			URLtype: "downloadsFeedBack",
			data: {
				adviceId: downloadid,
			}
		}
		App.Comm.previewFile({
			projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
			projectVersionId: App.ResourceModel.Settings.CurrentVersion.id,
			fileVersionId: id
		}, target);
		// window.location.href = App.Comm.getUrlByType(downloadDataObj).url;
	}
});