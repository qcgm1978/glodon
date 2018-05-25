App.Projects.listView=Backbone.View.extend({

	tagName:'li',

	className:'item',

	events:{
		"click .aProName":"beforeBreak"
	},

	template:_.templateUrl("/projects/tpls/project.list.detail.html"), 

	render:function(){ 
		//渲染数据
		var data=this.model.toJSON();
		this.$el.html(this.template(data)).attr("cid",this.model.cid);
		return this;
	},

	//跳转之前
	beforeBreak:function(event){
		
		var $target=$(event.target);

		if ($target.prop("href").indexOf("noVersion")>-1) {
			alert('暂无版本'); 
			return false;
		} 

	}

});
