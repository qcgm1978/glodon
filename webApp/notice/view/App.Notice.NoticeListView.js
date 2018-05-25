App.Notice.NoticeListView = Backbone.View.extend({
	default:{
		timeout:0
	},
	tagName:'div',
	className:'noticeListContent',
	template:_.templateUrl("./notice/tpls/notice.list.html",true),
	events:{
		"keyup .noticeTopSearch input":"searchFun"
	},
	initialize:function(){ // 重写初始化
		this.listenTo(App.Notice.NoticeCollection, 'reset', this.reset);  
		this.listenTo(App.Notice.NoticeCollection, 'add', this.addOne);  
	}, 
	render:function(){
		var self = this;
		this.$el.html(this.template);
		App.Notice.loadData();
		return this;
	},
	addOne:function(model){//一个一个的添加数据
		//渲染单个view
	    var view = new App.Notice.NoticeListDetailView({model:model});
	    this.$el.find("tbody#listDomBox").append(view.render().el);
	},
	reset:function(){
		this.$el.find("tbody#listDomBox").html('<tr> <td  colspan="2" class="noDataTd">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</td></tr>');
	},
	bindScroll:function(){//绑定滚动条
		//代办滚动条
		this.$el.find("div.scrollBox").mCustomScrollbar({
			set_height: "100%",
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		}); 
	},
	searchFun:function(event){
		var _this = this;
		var target = $(event.target);
		var targetVal = target.val().trim();
 		if(this.default.timeout){
 			clearTimeout(this.default.timeout);
 		}
	    this.default.timeout = setTimeout(function(){
	    	_this.searchAjaxFun(targetVal);
	    },400);
	},
	searchAjaxFun:function(targetVal){//最后执行提交搜索
		App.Notice.loadData({title:targetVal});
	}
})