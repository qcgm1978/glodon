App.backStage.BackStageIndexV = Backbone.View.extend({
	el:$("#contains"),
	template:_.templateUrl("/backStage/tpls/index.html"),
	render:function(){
		this.$el.html(this.template());
		return this;
	},
})