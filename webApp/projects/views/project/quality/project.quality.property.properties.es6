//属性 project.quality.property.properties.es6


//过程检查
App.Project.QualityProperties=Backbone.View.extend({

	tagName:"div",

	className:"QualityProperties",

	initialize:function(){
		//this.listenTo(App.Project.QualityAttr.PropertiesCollection,"add",this.addOne);
		this.listenTo(App.Project.DesignAttr.PropertiesCollection,"add",this.addOne);
	},


	events:{},


	//渲染
	render:function(){

		this.$el.html('<div class="nullTip">' +
            (App.Local.getTranslation('drawing-model.SEt1')||'请选择构件' ) +
            '</div>');

		return this;

	},

	template:_.templateUrl("/projects/tpls/project/design/project.design.property.properties.html"), 

	//获取数据后处理
	addOne:function(model){
		var data=model.toJSON().data;
		var temp=JSON.stringify(data);
		temp=JSON.parse(temp);
		App.Project.userProps.call(this,temp);
	}


});