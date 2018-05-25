App.Services = App.Services || {};
App.Services.MoreIndexDetail = Backbone.View.extend({
	tagName: "li",
	className: "itemClassR",
	template: _.templateUrl("/services/tpls/services.more.index.html"),
	events: {
		"click .overflowEllipsis": "download"
	},
	render: function () {
		this.$el.html(this.template(this.model));
		return this;
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
