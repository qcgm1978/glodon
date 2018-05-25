App.Flow.WelcomeView = Backbone.View.extend({
	tagName:"div",
	className:"welComeBox",
	template:_.templateUrl("/flow/tpls/flow.webComePage.html"),
	render(){
		this.$el.html(this.template());
		return this;
	},
})