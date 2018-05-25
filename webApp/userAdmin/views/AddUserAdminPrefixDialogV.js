App.userAdmin.AddUserAdminPrefixDialogV = Backbone.View.extend({
	default:{
		newPrefixName:''	
	},
	tagName:'div',
	className:"addViewUserPrefixBox",
	template:_.templateUrl("/userAdmin/tpls/addViewUserPrefixDialog.html"),
	events: {
 		"click .button": "submitFun",
 	},
	render:function(){
		this.$el.html(this.template());
		return this;
	},
	checkPrefixNameAjaxFun:function(){//检查前缀是否存在了
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
	submitFun:function(){//添加前缀的时候提交验证的方法
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
		errorBox.html('');
		errorBox.css("display","none");
		this.default.newPrefixName = prefixNameVal;
		this.checkPrefixNameAjaxFun();//检查前缀是否存在了
	},
	submitAjaxFun:function(){//验证都通过之后提交
		var UserAdminIndexV = new App.userAdmin.UserAdminIndexV;
		var data = {
			 "prefix":this.default.newPrefixName
		}
		var saveViewUserDataModel = Backbone.Model.extend({
			defaults: data,
		    urlType: "addViewUserPrefix",
		});
		var saveViewUser = new saveViewUserDataModel;
		saveViewUser.save().success(function(response){
			if(response.data == "ok"){
				UserAdminIndexV.renderAddPrefixDom();
				App.userAdmin.UserAdminIndexV.AddPrefixDialog.close();
			}
	    })
	},
	
})