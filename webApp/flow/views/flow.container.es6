App.Flow=App.Flow||{};

App.Flow.View=Backbone.View.extend({

	tagName:"div",

	className:"flowContainer",

	template:_.templateUrl("/flow/tpls/flow.container.html"),

	render:function(){
		this.$el.html(this.template({data:[]}));
		return this;
	}

});
