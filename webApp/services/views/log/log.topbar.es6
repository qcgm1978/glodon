/**
 * @require /services/views/log/index.es6
 */

//头部
App.Services.Log.topBar=Backbone.View.extend({

	tagName:"div",

	className:"systemContainer",

	template:_.templateUrl('/services/tpls/log/log.topbars.html',true),

	render(){
		
		this.$el.html(this.template);

		return this;
	}

});