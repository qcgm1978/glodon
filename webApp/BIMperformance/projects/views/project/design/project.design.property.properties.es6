
//设计属性 碰撞
App.Project.DesignProperties=Backbone.View.extend({

	tagName:"div",

	className:"designProperties",

	initialize:function(){
		this.listenTo(App.Project.DesignAttr.PropertiesCollection,"add",this.addOne);
	},

	template:_.templateUrl("/projects/tpls/project/design/project.design.property.properties.html"),

	render:function(){ 
		this.$el.html('<div class="nullTip">' +
            (App.Local.getTranslation('drawing-model.SEt1')||'请选择构件' ) +
            '</div>');
		return this;
	},

	//添加
	addOne:function(model){ 
		//渲染数据
		var data=model.toJSON().data;
		var temp=JSON.stringify(data);
		temp=JSON.parse(temp);
		App.Project.userProps.call(this,temp);
	}

});
