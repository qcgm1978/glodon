

App.Todo.TodoDetailView=Backbone.View.extend({

	tagName:'li',

	className:'todoDetailView',

	// 重写初始化
	initialize:function(){ 
		this.listenTo(this.model, 'change', this.render);
	    this.listenTo(this.model, 'destroy', this.removeItem); 
	},



	//代办
	events:{
		"click .title a":"openUrlHandle"
	},  

	template:_.templateUrl("./todo/tpls/todo.list.detail.html"),

	// template:function(){
	// 	if (App.Todo.Settings.type=="commission") {
	// 		return _.templateUrl("./todo/tpls/todo.list.detail.html");
	// 	}else{
	// 		 return _.templateUrl("./todo/tpls/todo.list.detail.html");
	// 	}
	// }


	

	render:function(){
		var data=this.model.toJSON();
		data.type=App.Todo.Settings.type;
		this.$el.html(this.template(data)).attr("cid",this.model.cid); 
		return this;

	},
	openUrlHandle:function(event){
		var target = $(event.target);
		var todoId = target.attr("data-todoId");
		var openUrl = target.attr("data-pcUrl");
		var data = {
			URLtype: "setFetchTodoData",
			type: "PUT",
			data: {
				todoId: todoId
			}
		};
		App.Comm.ajax(data,(resultData)=>{
			App.Todo.loadData();
		})
		window.open(openUrl,"_blank");
	}
});
