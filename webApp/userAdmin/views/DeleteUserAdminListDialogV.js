App.userAdmin.DeleteUserAdminListDialogV = Backbone.View.extend({
	default:{
		deleteId:''
	},
	template:_.templateUrl("/userAdmin/tpls/deleteViewUserDialog.html"),
	tagName:'div',
	className:'deleteViewUserBox',
	events: {
 		"click .deleteBtn": "deleteUserAdminFun",
 	},
	render:function(deleteId){
		this.$el.html(this.template());
		this.default.deleteId = deleteId;
		return this;
	},
	deleteUserAdminFun:function(){//点击弹出层里面的确定按钮执行的方法
		var _this = this;
		var data = {
			URLtype: "deleteViewUser",
			data:{
				loginId:this.default.deleteId
			},
			type: "DELETE",
		}
		App.Comm.ajax(data,function(result){
			if(result.data == "ok"){
				var UserAdminIndexV = new App.userAdmin.UserAdminIndexV;
		       		UserAdminIndexV.renderUserAdminListDom();
				App.userAdmin.UserAdminListV.Dialog.close();
			}
		})
	},
})