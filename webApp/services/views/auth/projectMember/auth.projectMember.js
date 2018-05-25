/**
 * @require /services/collections/auth/projectMember/services.auth.projectMember.js
 */
//主容器
App.Services.projectMember.mainView = Backbone.View.extend({
	
	tagName:"div",
	
	id:"projectMember",
	
	events:{
		'click #addMemberBtn':'openMemberManagerModal'
	},
	
	template: _.templateUrl('/services/tpls/auth/projectMember/tplProjectMember.html'),
	
	render: function() {
		this.$el.html(this.template());
		new App.Services.projectMember.projects();
		new App.Services.projectMember.members();
		return this;
	},
	
	//打开成员部门管理视图窗口
	openMemberManagerModal:function(){
		var memberManager=new ViewComp.MemberManager().render({title:""});
		App.Services.maskWindow=new App.Comm.modules.Dialog({
			title:'添加成员/部门',
			width:640,
			isConfirm:false,
			message:memberManager.el
		});
		memberManager.initView();
	}
});

