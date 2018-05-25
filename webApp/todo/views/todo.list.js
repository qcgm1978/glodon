

App.Todo.TodoListView=Backbone.View.extend({

	tagName:'div',

	className:'todoList',

	currentRenderCount:1,

	// 重写初始化
	initialize:function(){ 
		this.listenTo(App.Todo.TodoCollection, 'reset', this.resetDom);  
		this.listenTo(App.Todo.TodoCollection, 'add', this.addOne);  
		Backbone.on('todoEmptyDataEvent',this.emptyDom,this);
	}, 

	//代办
	events:{
		 
	},  

	template:_.templateUrl("./todo/tpls/todo.list.html",true),

	render:function(){ 
	 
		this.$el.html(this.template);
		//type=="my-backbone-fast" && this.$el.find(".fast").addClass('selected')|| this.$el.find(".msg").addClass('selected');
		return this;

	},
	addOne:function(model){
		//渲染单个view
	    var view=new App.Todo.TodoDetailView({model:model});
		if(this.currentRenderCount<=1){
			this.$el.find('.'+App.Todo.Settings.type+'Lists').empty();
		}
		this.currentRenderCount++;
	    if (App.Todo.Settings.type=="commission") {
			this.$el.find('.commissionLists').append(view.render().el); 
			this.bindScroll("commissionLists");

			if(this.currentRenderCount>=model.collection.length){
				$("#todoContent").find(".commissionListPagination").show();
				$("#todoContent").find(".commissionBottom .sumDesc").show();
			}

	    }else{
	    	this.$el.find('.alreadyLists').append(view.render().el); 
	    	this.bindScroll();

			if(this.currentRenderCount>=model.collection.length){
				$("#todoContent").find(".alreadyListPagination").show();
				$("#todoContent").find(".alreadyBottom .sumDesc").show();
			}
	    }

	} ,

	resetDom:function(){
		this.currentRenderCount=1;
		this.$el.find('.'+App.Todo.Settings.type+'Lists').html('<span class="noData"><i class="tip"></i>' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</span>');
	},
	emptyDom:function(){
		this.$el.find('.'+App.Todo.Settings.type+'Lists').html('<span class="noData"><i class="tip"></i>暂无'+(App.Todo.Settings.type=='already'?'已':'待')+'办</span>');
	},

	bindScroll:function(type){

		//  $(selector).mCustomScrollbar("destroy");
		 
		var $content = $("#todoContent"),$el;
		if (type=="commissionLists") {
			$el=$content.find(".commissionBox");
		}else{
			$el=$content.find(".alreadyBox");
		}

		//绑定过了
		if ($el.hasClass('mCustomScrollbar ')) {
			return;
		} 

		//代办滚动条
		$el.mCustomScrollbar({
			set_height: "95%",
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		}); 

	}


});
