/**
 * @require /services/views/system/index.es6
 */

//头部
App.Services.System.topBar=Backbone.View.extend({

	tagName:"div",

	className:"systemContainer",

	template:_.templateUrl('/services/tpls/system/system.topbars.html',true),

	render(){
		
		this.$el.html(this.template);

		return this;
	}

});