 App.ResourceModel.App = Backbone.View.extend({

 	el: $("#contains"),

 	render: function() {

 		this.$el.html(new App.ResourceCrumbsNav().render().el);
 		//标准模型库
 		if (App.ResourcesNav.Settings.type == "standardLibs") {
 			this.$el.append(new App.ResourceModel.LeftNav().render().el);
 		} else if (App.ResourcesNav.Settings.type == "famLibs") {
 			//族库
 			this.$el.append(new App.ResourceFamLibs.leftNav().render().el);
 		}
 		this.$el.append(new App.ResourceModel.ListNav().render().el);

 		
 		//右键菜单
 		if (!document.getElementById("listContext")) {
 			//右键菜单
 			var contextHtml = _.templateUrl("/resources/tpls/context/listContext.html", true);
 			$("body").append(contextHtml);
 		}  
 		//右键菜单
 		if (!document.getElementById("listContextFamily")) {
 			//右键菜单
 			var contextHtml = _.templateUrl("/resources/tpls/context/listContextFamily.html", true);
 			$("body").append(contextHtml);
 		}  
 	} 
 });