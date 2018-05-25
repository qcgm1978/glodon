//关注
App.Project.PlanPublicity = Backbone.View.extend({

	tagName: "div",

	className: "planPublicity",	 

	initialize: function() {
		this.listenTo(App.Project.PlanAttr.PlanPublicityCollection, "add", this.addOne);
		this.listenTo(App.Project.PlanAttr.PlanPublicityCollectionMonth, "add", this.addOneMonth); 
	},

	render: function() {
		var tpl = _.templateUrl("/projects/tpls/project/plan/project.plan.property.publicityCollection.html");
		this.$el.html(tpl);
		return this;
	},

	template: _.templateUrl("/projects/tpls/project/plan/project.plan.property.publicityCollection.detail.html"),



	//周
	addOne: function(model) {

		var data = model.toJSON();
		this.$(".tbTop tbody").html(this.template(data));
		App.Comm.initScroll(this.$(".tbTopScroll"),"y");
	},

	//月份
	addOneMonth: function(model) {
		var data = model.toJSON();
		this.$(".tbBottom tbody").html(this.template(data));
		App.Comm.initScroll(this.$(".tbBottomScroll"),"y");
	}


});