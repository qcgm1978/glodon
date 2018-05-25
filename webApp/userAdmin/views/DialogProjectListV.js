App.userAdmin.DialogProjectListV = Backbone.View.extend({
	tagName:"ul",
	className:"projectUlBox",
	template:_.templateUrl("/userAdmin/tpls/dialogProjectList.html"),
	events: {
 		"click .liItem": "dialogBoxFun",
 	},
	render:function(data){
		this.$el.html(this.template({state:data}));
		return this;
	},
	dialogBoxFun:function(event){//弹出层项目名称列表的复选框选中和不选中的效果
		var target = $(event.target);
		if(target[0].tagName == "LABEL"){
			if(!target.hasClass('selectCheckBox')){
				target.addClass('selectCheckBox');
			}else{
				target.removeClass('selectCheckBox')
			}
		}else{
			if(!target.find('label').hasClass('selectCheckBox')){
				target.find('label').addClass('selectCheckBox');
			}else{
				target.find('label').removeClass('selectCheckBox')
			}
		}
	}
})