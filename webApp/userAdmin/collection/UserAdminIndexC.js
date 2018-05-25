App.userAdmin = {
	init:function(){
		$("#contains").empty();
		var UserAdminIndexV = new App.userAdmin.UserAdminIndexV(); //渲染框架
		UserAdminIndexV.render();
	},
	getViewUserPrefixC:new(Backbone.Collection.extend({//获取配置前缀的方法的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "getViewUserPrefix",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
	updateViewUserPrefixC:new(Backbone.Collection.extend({//更新配置前缀的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "getViewUserPrefix",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
	checkUserC:new(Backbone.Collection.extend({//检查账号名是否存在的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "checkUser",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
	getViewUserListC : new(Backbone.Collection.extend({//获取用户列表的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "getViewUserList",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
	getViewUserInfoC : new(Backbone.Collection.extend({//获取用户信息的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "getViewUserInfo",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
	getProjectsDataC:new(Backbone.Collection.extend({//获取弹出层项目列表的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "getProjectsList",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
	getPrefixsDataC:new(Backbone.Collection.extend({//获取弹出层用户前缀列表的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "getPrefixsList",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
	checkUserPrefixC:new(Backbone.Collection.extend({//检查用户前缀是否存在的collection方法
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ''
				}
			}
		}),
		urlType: "checkUserPrefix",
		parse: function(response) {
			if (response.message == "success") {
				return response.data;
			}
		}
	})),
};