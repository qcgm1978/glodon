App.Services = App.Services || {};
App.Services.MoreDetail = Backbone.View.extend({
	tagName: "div",
	className: 'listItem',
	template: _.templateUrl("/services/tpls/services.more.detail.html"),
	events: {
		"click .fileName a": "download"
	},
	render: function () {
		this.model.createTime = this.changeTimeHandle(this.model.createTime);
		this.model.size = App.Comm.formatSize(this.model.size);
		this.$el.html(this.template(this.model));
		return this;
	},
	changeTimeHandle(time) {//时间转换
		var timeStr = new Date(time);
		timeStr = timeStr.getFullYear() + "-" + (timeStr.getMonth() + 1) + "-" + timeStr.getDate() + " " + timeStr.getHours() + ":" + timeStr.getMinutes() + ":" + timeStr.getSeconds();
		return timeStr;
	},
	download(event) {
		var targetId = $(event.target).data("id");
		var data = {
			URLtype: "downloadResource",
			data: {
				id: targetId,
			}
		}
		App.Comm.previewFile({
			URLtype: "resourcePreview",
			id: targetId,
			link: App.Comm.getUrlByType(data).url
		}, $(event.target));
		// window.location.href = App.Comm.getUrlByType(data).url;
	}
});
