App.Flow.ContentAdminBasiPageView=Backbone.View.extend({
	tagName:"div",
	className:"adminBasiPage",
	events:{
		'click .projectText':'projectTextFun'
	},
	render(pageName){
		var page = _.templateUrl("/flow/tpls/"+pageName+".html");
		this.$el.html(page);
		return this;
	},
	projectTextFun(){
		App.Flow.Controller.default.tabType="back";
	}
})