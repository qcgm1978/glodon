/**
 * @require /services/views/system/feedback/feedback.es6
 */
App.Services.FeedBackAttrManagerContent=Backbone.View.extend({
	tagName:'div',
	className:"feedBackContent",
	template:_.templateUrl("/services/tpls/system/feedback/feedBackAttrManagerContent.html",true),
	initialize() {//初始化
		this.listenTo(App.Services.SystemCollection.FeedBackCollection, "add", this.addOne);
		this.listenTo(App.Services.SystemCollection.FeedBackCollection, "reset", this.resetList);
	},
	render(){
		this.$el.html(this.template);
		this.getFeedBackList();//获取件建议反馈管理的列表的方法
		return this;
	},
	getFeedBackList(){//获取件建议反馈管理的列表的方法
		App.Services.SystemCollection.getFeedBackListHandle();
	},
	addOne(model){//每一条数据 进行处理
		var data = model.toJSON();
		var FeedBackAttrManagerContentList = new App.Services.FeedBackAttrManagerContentList({model:data});
		this.$(".feedBackList").append(FeedBackAttrManagerContentList.render().el);
		this.bindScroll();
	},
	resetList(){//重置加载
		this.$(".feedBackList").html('<li class="loading">' +
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
})