
//流程管理
App.Services.System.ExtendAttrManager=Backbone.View.extend({

	tagName:"div",

	className:"extendAttrManager folwManager", 
	 
	//渲染
	render(){
		//渲染
		this.$el.append(new App.Services.System.ExtendAttrSlideBar().render().el);
		this.$el.append(new App.Services.System.ExtendAttrContainer().render().el);
		return this;
	}


});