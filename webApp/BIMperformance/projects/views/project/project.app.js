// 项目总控
App.Project.ProjectApp = Backbone.View.extend({

	tagName: "div",

	className: "projectContainerApp",

	events: {
		"click .projectTab .item": "SwitchProjectNav"
	},

	render: function() { 
		//nav
		this.$el.html(new App.Project.ProjectContainer().render().$el); 
		return this;
	}, 
	

	// 切换项目Tab
	SwitchProjectNav: function(event) { 

		var $el = $(event.target);
		//样式处理
		$el.addClass('selected').siblings().removeClass('selected');
		App.Project.Settings.projectNav = $el.data("type");
		
		//非文件导航 设计 计划 成本 质量
		if (App.Project.Settings.fetchNavType != "file") { 
			//根据类型渲染数据
			App.Project.renderModelContentByType();  

		}
        App.Local.setI18n();
	}
	



});