App.Meeting=App.Meeting||{};
App.Meeting.Page=Backbone.View.extend({

	tagName:"div",

	className:"Meeting",

	template:_.templateUrl("/meeting/tpls/page.html"),

	render:function(){
		this.$el.html(this.template({data:[]}));
		return this;
	},

	bindEvent : function(){
		$('#resourceMore .fileName a').on('click',function(){
			var id=$(this).data('id');
			window.open(id,'_blank');
		})
	}

});