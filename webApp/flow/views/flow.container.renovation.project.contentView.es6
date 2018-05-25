App.Flow=App.Flow||{};
App.Flow.ProjectContentView = Backbone.View.extend({
	tagName:"div",
	className:"itemListBox",
	template:_.templateUrl("/flow/tpls/flow.container.renovation.project.contentView.html",true),
	initialize(){
		this.listenTo(App.Flow.Controller.flowCollection,'reset',this.load);
	},
	load(model){
		let _this = this;
		let data = model.toJSON()[0];
		this.$el.html(this.template(data));
		$("#itemListBox").html(this.$el);
		this.$('.text').on('click',function(){
			_this.detail($(this).attr('title').replace('【模块化】',''));
		})
	},
	detail(txt){
		App.Comm.ajax({
			URLtype:'fetchFlowDetail',
			data:{
				itemName:txt,
				simpleMode:false,
				isBimControl:2
			}
		}).done(function(data){
			new App.Flow.FlowDialog().render(data.data,"itemListBox");
		})
	},
});
