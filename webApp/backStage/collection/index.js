App.backStage = {
	init: function() { //后台管理的列表页面
		$("#contains").empty();
		var BackStageIndexV = new App.backStage.BackStageIndexV(); //渲染框架
		BackStageIndexV.render();
	},
	setPermissionsInit: function() { //点击了后台的权限配置按钮调到的页面
		$("#contains").empty();
		var SetPermissionsIndexV = new App.backStage.SetPermissionsIndexV(); //渲染框架
		SetPermissionsIndexV.render();
	},
	loadData: function(collection, data, fn) {
		data = data || {};
		collection.fetch({
			remove: false,
			data: data,
			success: function(collection, response, options) {
				if (fn && typeof fn == "function") {
					fn(response);
				}
			},
			error: function(collection, response, options) {
				if (fn && typeof fn == "function") {
					fn(response);
				}
			}
		});
	},
	//获取tab列表的方法
	GetListCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "getWorkforgconList",
		parse(response) {
			if (response.code == 0) {
				return response;
			}
		}
	})),
	//获取部门的方法
	standardCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchServicesMemberInnerList"
	})),
	Step1: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchServicesMemberInnerList"
	})),
	Step3: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "fetchServicesMemberOuterList"
	})),
}