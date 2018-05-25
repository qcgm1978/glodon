App.Flow = App.Flow || {};
App.Flow.ProjectNavView = Backbone.View.extend({
	tagName: "ul",
	template: _.templateUrl("/flow/tpls/flow.container.renovation.project.navView.html", true),
	events: {
		'click .flowTabItem': 'tabBox',
	},
	initialize() {
		debugger;
		this.listenTo(App.Flow.Controller.flowNavCollection, 'reset', this.load);
	},
	tabBox(e) {
		var $target = $(e.currentTarget);
		if (!$target.hasClass('activeClass')) {
			$target.siblings().removeClass('activeClass').end().addClass('activeClass');
			$(".mkhjdBox:first").attr('href', $target.data('link'));
			this.getContentData($target.data("id"));//获取对应的数据
		}
	},
	load(model) {
		let data = model.toJSON()[0];
		this.$el.html(this.template(data));
		$("#navListBox").html(this.$el);
		let firstData = data.data[0];
		$(".mkhjdBox:first").attr('href', firstData.planLink);
		this.getContentData(firstData.id);//获取对应的数据
		return this;
	},
	getContentData(id) {
		App.Flow.Controller.flowCollection.phaseId = id;
		App.Flow.Controller.flowCollection.fetch({
			data: {
				isBimControl: 2,
			},
			reset: true
		})
	}
});
