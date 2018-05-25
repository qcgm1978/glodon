
App.Projects.DisplayMode=Backbone.View.extend({

	tagName:'div',

	className:'displayModeBox',



	events:{
		"click .list":"projectList",
		"click .map":"proMap"
	},

	template:_.templateUrl("/projects/tpls/project.displayMode.html",true),

	render:function(){
		this.$el.html(this.template);
		return this;
	},

	//切换为列表
	projectList:function(){
		App.Projects.Settings.type="list";
		$("#projectModes").find(".proListBoxScroll").show().find(".item").remove().end().end().find(".proMapBox").hide();
		//App.Projects.fetch();
		//拉取数据
		App.Projects.loadData();
	},

	//切换为地图
	proMap:function(){
		App.Projects.Settings.type="map";
		$("#projectModes").find(".proListBoxScroll").hide().end().find(".proMapBox").show();
 		//初始化地图
 		//App.Projects.BaiduMap.initMap();
		//App.Projects.fetch();
	}

});
