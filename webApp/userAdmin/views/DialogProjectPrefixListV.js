App.userAdmin.DialogProjectPrefixListV = Backbone.View.extend({
	tagName:"select",
	className:"selectPrefixBox",
	template:_.templateUrl("/userAdmin/tpls/dialogPrefixList.html"),
	render:function(data){
		this.$el.html(this.template({state:data}));
		return this;
	},
})