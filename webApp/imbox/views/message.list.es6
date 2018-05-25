App.INBox = App.INBox || {}
App.INBox.imboxListView = Backbone.View.extend({
	template: _.templateUrl('./imbox/tpls/container.html', true),
	initialize: function() {},
	render() {
		this.$el.html(this.template);
		return this;
	},
	renderData(item) {}
})