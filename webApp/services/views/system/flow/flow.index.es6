
//流程管理
App.Services.System.FolwManager=Backbone.View.extend({

	tagName:"div",

	className:"folwManager", 
	 
	//渲染
	render(){
		//渲染
		this.$el.append(new App.Services.System.FolwSlideBar().render().el);
		this.$el.append(new App.Services.System.FolwContainer().render().el);
		return this;
	}


});