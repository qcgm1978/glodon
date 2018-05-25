App.Project.leftNav = Backbone.View.extend({

	tagName: "div",

	className: "leftNav", 

	template: _.templateUrl('/projects/tpls/project/project.leftNav.html', true),
	render: function() {
		this.$el.html(this.template);
		return this;
	}
});