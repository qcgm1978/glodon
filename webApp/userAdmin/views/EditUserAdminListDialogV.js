App.userAdmin.EditUserAdminListDialogV = Backbone.View.extend({
	default:{
		prefixVal:"",
		userNameVal:'',
		accrentPassWordVal:'',
		selectProjectArr:'',
		endDate:'',
		userNameBool:true,
		accrentPassWordBool:true,
		selectProjectBool:true,
	},
	template:_.templateUrl("/userAdmin/tpls/editViewUserDialog.html"),
	events: {
 		"click .button": "submitFun",
 	},
	render:function(editId){
		this.getViewUserInfoFun(editId);//获取用户的信息方法
		return this;
	},
	bindTimeHandle:function(){
		var _this = this;
		this.$('#endDateEdit').datetimepicker({
		  language: App.Local.getTimeLang(),
		  autoclose: true,
		  format: 'yyyy-mm-dd',
		  minView: 'month',
		  startDate:new Date()
		});
		this.$('#endDateEdit').on('change',function(){
		  _this.default.endDate=$(this).val();
		})
		this.$(".dateBox .iconCal").on("click",function() {
		    $(this).next().focus();
		});
	},
	getViewUserInfoFun:function(editId){//获取用户的信息方法
		var _this = this;
	    var _data = {
	    	loginId:editId,
	    }
	    App.userAdmin.getViewUserInfoC.fetch({
			data: _data,
			success: function(collection, response, options) {
				if(response.code == 0){
					_this.default.userNameVal = response.data.username;
					_this.default.accrentNameVal = response.data.loginid;
					_this.default.accrentPassWordVal = response.data.pwd;
					_this.default.prefixVal = response.data.prefix;
					_this.default.endDate = response.data.valid_time;
					_this.$el.html(_this.template({state:response.data}));
					_this.bindTimeHandle();
					_this.getProjectData(response.data.projects);//获取全部项目的方法
				}
			}
		})
	},
	getProjectData:function(projects){//获取全部项目的方法
		var _this = this;
	    App.userAdmin.getProjectsDataC.fetch({
			success: function(collection, response, options) {
				for (var i = projects.length - 1; i >= 0; i--) {
					for (var j = response.data.length - 1; j >= 0; j--) {
						if(projects[i].id == response.data[j].projectId){
							response.data[j].selected = true;
						}
					}
				}
				var dataArr = response.data;
				var DialogProjectListV = new App.userAdmin.DialogProjectListV;
				_this.$el.find(".dialogProjectList>.loading").css("display","none")
				_this.$el.find(".dialogProjectList").append(DialogProjectListV.render(dataArr).el);
				App.Comm.initScroll(_this.$(".dialogProjectList"), "y");
			}
		})
	},
	checkUserNameFun:function(){//检查用户名称是否合法
		var userName = $("#userName");
		var userNameVal = userName.val().trim();
		var errorBox = userName.next(".errorBox");
		this.default.userNameVal = userNameVal;
		if(this.default.userNameVal == ""){
			errorBox.html('用户名称不能为空!');
			errorBox.css("display","block");
			this.default.userNameBool=false;
			return;
		}
		this.default.userNameBool=true;
		errorBox.html('');
		errorBox.css("display","none");
	},
	checkAccrentPwdFun:function(){//检查账号密码是否合法
		var accrentPassWord = $("#accrentPassWord");
		var accrentPassWordVal = accrentPassWord.val().trim();
		var errorBox = accrentPassWord.next(".errorBox");
		this.default.accrentPassWordVal = accrentPassWordVal;
		if(this.default.accrentPassWordVal == ""){
			errorBox.html('账号密码不能为空!');
			errorBox.css("display","block");
			this.default.accrentPassWordBool=false;
			return;
		}
		if(this.default.accrentPassWordVal.length<6){
			errorBox.html('账号密码不能小于6位!');
			errorBox.css("display","block");
			this.default.accrentPassWordBool=false;
			return;
		}
		this.default.accrentPassWordBool=true;
		errorBox.html('');
		errorBox.css("display","none");
	},
	checkSelectProject:function(){//检查是否分配了项目
		var selectCheckBox = $(".projectUlBox").find("label.selectCheckBox");
		var projectErrorBox = $(".projectErrorBox");
		var projectIdArr = [];
		if(selectCheckBox.length<=0){
			projectErrorBox.html("请给用户分配项目权限!");
			projectErrorBox.css("display","block");
			this.default.selectProjectBool=false;
			return;
		}
		projectErrorBox.html("");
		projectErrorBox.css("display","none");
		for (var i = selectCheckBox.length - 1; i >= 0; i--) {
			projectIdArr.push(parseInt($(selectCheckBox[i]).data("projectid")));
		}
		this.default.selectProjectArr = projectIdArr;
		this.default.selectProjectBool = true;
	},
	submitFun:function(){	
		this.checkUserNameFun();//检查用户名称是否合法
		this.checkAccrentPwdFun();//检查账号密码是否合法
		this.checkSelectProject();//检查是否分配了项目
		if(this.default.userNameBool&&this.default.accrentPassWordBool&&this.default.selectProjectBool){
			this.submitAjaxFun();
		}
	},
	submitAjaxFun:function(projectIdArr,selectPrefixBoxVal){//添加用户的方法
		var _data = {
			"prefix":this.default.prefixVal,
			"loginId":this.default.accrentNameVal,
			"userName":this.default.userNameVal,
		    "pwd":this.default.accrentPassWordVal,
		    "projects":this.default.selectProjectArr,
		    "validTime":this.default.endDate
		}
		$.ajax({
		    type:"PUT",
		    url:"platform/testuser",
		    contentType:"application/json",
		    data:JSON.stringify(_data),
		    success:function(response){
		       if(response.data == "ok"){
		       		var UserAdminIndexV = new App.userAdmin.UserAdminIndexV;
		       		UserAdminIndexV.renderUserAdminListDom();
					App.userAdmin.UserAdminListV.EditDialog.close();
	       		}
		    }
		});
	}
})