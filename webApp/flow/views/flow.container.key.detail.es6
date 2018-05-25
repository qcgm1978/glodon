App.Flow=App.Flow||{};
App.Flow.KeyViewDetail = Backbone.View.extend({
	tagName:"div",
	className:"flowListBox",
	template:_.templateUrl("/flow/tpls/flow.container.key.detail.html"),
	events:{
		"click .text":"dialogItemHandle"
	},
	render:function(data){
		this.$el.html(this.template(data));
		return this;
	},
	dialogItemHandle(event){
		var txt = $(event.target).attr('title').replace('【' +
            (App.Local.getTranslation('drawing-model.Module')||'模块化') +
            '】','');
		App.Comm.ajax({
			URLtype:'fetchFlowDetail',
			data:{
				itemName:txt,
				simpleMode:false,
				isBimControl:0
			}
		}).done(function(data){
			new App.Flow.FlowDialog().render(data.data,"flowContainerKey");
		})
		return false;
	}
});
