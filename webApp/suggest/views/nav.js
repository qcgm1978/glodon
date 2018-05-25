App.INBox.NavView = Backbone.View.extend({

	tagName: 'div',

	className: 'imboxNavWrap',

	//代办
	events: {
		'click .already': 'already', //已办
		'click .commission': 'commission' //代办
	},

	//未读消息
	commission: function() {
		$(".imboxNav .commission").addClass("selected");
		$(".imboxNav .already").removeClass("selected");
		$('#imboxContent .commissionBox').show();
		$('#imboxContent .alreadyBox').hide();
		App.INBox.messageCollection.fetch({
			reset:true,
			data:{
				status:0
			}
		});
	},

	//已读消息
	already: function() {
		$(".imboxNav .already").addClass("selected");
		$(".imboxNav .commission").removeClass("selected");
		$('#imboxContent .commissionBox').hide();
		$('#imboxContent .alreadyBox').show();
		App.INBox.messageAllCollection.fetch({
			reset:true
		});
	},

	template:_.templateUrl("./imbox/tpls/nav.html",true),


	render: function() {
		this.$el.html(this.template);
		return this;
	},

	loadDadta:function(){

	}

});