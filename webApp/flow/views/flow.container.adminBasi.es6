//@ sourceURL=flow.js
App.Flow.ContentAdminBasiView = Backbone.View.extend({
	tagName: "div",
	className: "adminBasiClassName",
	template: _.templateUrl("/flow/tpls/flow.content.adminBasi.html"),
	// events: {

	// 	"click #downZip": "preview"
	// },
	// preview() {
	// 	debugger;
	// },
	render() {
		this.$el.html(this.template());
		return this;
	}
})