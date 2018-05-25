App.userAdmin.EditUserAdminPrefixListDialogV  = Backbone.View.extend({
	default:{
		oldPrefixName:'',
		newPrefixName:''	
	},
	tagName:'div',
	className:"addViewUserPrefixBox",
	template:_.templateUrl("/userAdmin/tpls/editViewUserPrefixDialog.html"),
	events: {
 		"click .button": "submitFun",
 	},
	render:function(prefixName){
		this.default.oldPrefixName = prefixName;
		this.default.newPrefixName = prefixName;
		this.$el.html(this.template({state:prefixName}));
		return this;
	},
	checkPrefixNameAjaxFun:function(){//检查当前的前缀是否已经存在了
		var _this = this;
		var prefixName = $("#prefixName");
		var errorBox = $("#errorBox");
		var _data = {
			prefix:this.default.newPrefixName
		}
	   	App.userAdmin.checkUserPrefixC.fetch({
			data: _data,
			success: function(collection, response, options) {
				if(response.data == "exist"){
					errorBox.html('前缀已经存在，请从新输入!');
					errorBox.css("display","block");
					prefixName.focus();
				}else{
					errorBox.html('');
					errorBox.css("display","none");
					_this.submitAjaxFun();
				}
			}
		})
	},
	submitFun:function(){//点击编辑前缀的时候提交 验证方法
		var prefixName = $("#prefixName");
		var errorBox = $("#errorBox");
		var prefixNameVal = prefixName.val().trim();
		if(prefixNameVal == ""){
			errorBox.html('前缀不能为空!');
			errorBox.css("display","block");
			prefixName.focus();
			return;
		}
		if(prefixNameVal.length>10){
			errorBox.html('前缀最长不能超过十位!');
			errorBox.css("display","block");
			prefixName.focus();
			return;
		}
		if(prefixNameVal !== this.default.oldPrefixName){
			this.default.newPrefixName = prefixNameVal;
			this.checkPrefixNameAjaxFun();//检查当前的前缀是否已经存在了
			return;
		}
		errorBox.html('');
		errorBox.css("display","none");
		this.default.newPrefixName = prefixNameVal;
		this.submitAjaxFun();
	},
	submitAjaxFun:function(){
		var UserAdminIndexV = new App.userAdmin.UserAdminIndexV;
		var data = {
			 "prefix":this.default.oldPrefixName,
			 "newPrefix":this.default.newPrefixName
		}
		$.ajax({
		    type:"PUT",
		    url:"platform/testuser/prefix",
		    contentType:"application/json",
		    data:JSON.stringify(data),
		    success:function(response){
		       if(response.code == 0){
		       		UserAdminIndexV.renderAddPrefixDom();
					App.userAdmin.UserAdminPrefixListV.EditDialog.close();
	       		}
		    }
		});
	}
})