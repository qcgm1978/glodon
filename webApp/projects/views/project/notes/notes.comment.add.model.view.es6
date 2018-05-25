App.Project.NotesCommentAddModelView = Backbone.View.extend({
	tagName: "div",
	className: "notesCommentAddModelDialogBox",
	template:_.templateUrl("/projects/tpls/project/notes/project.notes.comment.add.model.html",true),
	default:{
	},
	render: function() {
		this.$el.html(this.template);
		return this;
	},
})