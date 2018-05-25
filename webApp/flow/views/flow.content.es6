App.Flow=App.Flow||{};

App.Flow.ContentView=Backbone.View.extend({

	tagName:"div",

	template:_.templateUrl("/flow/tpls/flow.content.html",true),

	events:{
		//'click .text':'detail'
	},
	
	initialize(){
		this.listenTo(App.Flow.Controller.flowCollection,'reset',this.load);
	},

	detail(txt){
		App.Comm.ajax({
			URLtype:'fetchFlowDetail',
			data:{
				itemName:txt,
				simpleMode:false,
				isBimControl:1
			}
		}).done(function(data){
			new App.Flow.FlowDialog().render(data.data,"flowContainer");
		})
	},

	load:function(m){
		var _this=this;
		var data=m.toJSON()[0];
		// var _html=_.template(this.template);
		this.$el.html(this.template(data));
		$("#flowContainer").html(this.$el);
		this.$('.text').on('click',function(){
		 
			_this.detail($(this).attr('title').replace('【模块化】',''));
		})
		return this;
	}
});
