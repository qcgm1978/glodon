App.Services=App.Services||{};
App.Services.MoreIndex = Backbone.View.extend({
	tagName:"ul",
	className:"resourceList",
	initialize() {//初始化
		this.listenTo(App.Services.SystemCollection.ResourceGetIndexCollection, "add", this.addOne);
		this.listenTo(App.Services.SystemCollection.ResourceGetIndexCollection, "reset", this.resetList);
	},
	render:function(){
		this.getMoreList();//获取前台页面列表的方法
		return this;
	},
	getMoreList(){//获取前台页面列表的方法
		App.Services.SystemCollection.resourceListIndexHandle({pageIndex:1,pageItemCount:5});
	},
	addOne(model){//每一条数据 进行处理
		var data = model.toJSON();
		var MoreDetail = new App.Services.MoreIndexDetail({model:data});
		$(".resourceList").append(MoreDetail.render().el);
	},
	resetList(){//重置加载
		$("#resourceList").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	}
});
