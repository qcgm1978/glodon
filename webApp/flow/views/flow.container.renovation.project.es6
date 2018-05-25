App.Flow=App.Flow||{};
App.Flow.RenovationProject = Backbone.View.extend({
	tagName:"div",
	className:"flowContainer",
	template:_.templateUrl("/flow/tpls/flow.container.renovation.project.html",true),
	render:function(){
		this.$el.html(this.template());
		return this;
	},
});
