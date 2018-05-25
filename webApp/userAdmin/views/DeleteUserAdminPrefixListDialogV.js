App.userAdmin.DeleteUserAdminPrefixListDialogV = Backbone.View.extend({
	default:{
		deleteId:''
	},
	template:_.templateUrl("/userAdmin/tpls/deleteViewUserPrefixDialog.html"),
	tarName:'div',
	className:'deleteViewUserBox',
	events: {
 		"click .deleteBtn": "deleteUserAdminPrefixFun",
 	},
	render:function(deleteId){
		this.$el.html(this.template());
		this.default.deleteId = deleteId;
		return this;
	},
	deleteUserAdminPrefixFun:function(){//点击弹出层里面的确定按钮执行的方法
		var _this = this;
		var data = {
			URLtype: "deleteViewUserPrefix",
			data:{
				prefix:this.default.deleteId
			},
			type: "DELETE",
		}
		App.Comm.ajax(data,function(result){
			if(result.data == "ok"){
				var UserAdminIndexV = new App.userAdmin.UserAdminIndexV;
					UserAdminIndexV.renderAddPrefixDom();
					App.userAdmin.UserAdminPrefixListV.Dialog.close();
					return;
			}
			if(result.data == "prefix used"){
				alert("当前前缀已经被绑定！");
				return;
			}
		})
	},
})