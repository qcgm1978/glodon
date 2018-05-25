//资源管理
App.Services.System.ResourceAttrManagerContent=Backbone.View.extend({
	tagName:'div',
	className:"resourceContent",
	template:_.templateUrl("/services/tpls/system/resource/resourceContent.html",true),
	events:{
		"click .allCheck": "allCheckFun",
	},
	initialize() {//初始化
		this.listenTo(App.Services.SystemCollection.ResourceCollection, "add", this.addOne);
		this.listenTo(App.Services.SystemCollection.ResourceCollection, "reset", this.resetList);
	},
	render(){//渲染
		this.$el.html(this.template);
		this.getResourceList();//获取资源管理的列表的方法
		return this;
	},
	allCheckFun(event){//点击列表的全选复选框的方法
		var checkItem = this.$el.find(".resourceList .checkItem");
		checkItem.prop('checked', event.target.checked);
	},
	getResourceList(){//获取资源管理的列表的方法
		App.Services.SystemCollection.getResourceListHandle();
	},
	addOne(model){//每一条数据 进行处理
		var data = model.toJSON();
		var ResourceAttrManagerContentList = new App.Services.System.ResourceAttrManagerContentList({model:data});
		this.$(".resourceList").append(ResourceAttrManagerContentList.render().el);
		this.bindScroll();
	},
	resetList(){//重置加载
		this.$(".resourceList").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},
	bindScroll:function(){//绑定滚动条
		this.$el.find("div.scrollBox").mCustomScrollbar({
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		}); 
	},
});