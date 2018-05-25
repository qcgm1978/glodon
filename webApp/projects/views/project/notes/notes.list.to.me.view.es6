App.Project.NotesToMeView = Backbone.View.extend({
	tagName: "div",
	className: "notesContentBoxTop",
	template:_.templateUrl("/projects/tpls/project/notes/project.notes.to.me.html",true),
	render: function() {
		this.$el.html(this.template);
		this.initCheckHandle();//初始化复选框事件
		return this;
	},
	initCheckHandle(){//初始化复选框事件
		this.$(".allNotes").on("click",function(){
			App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
			App.Project.NotesCollection.getNotesListHandle();//共用了获取批注列表的方法
		})
		if(App.Project.Settings.shareBool || App.Project.Settings.messageBool){
			this.$("#toMe").prop('checked', false);
			App.Project.NotesCollection.defaults.toMeBool = false;
		}
		this.$("#toMe").on("change",function(evt){
			var target = $(evt.target);
			var searchData = {
				"toMeBool":target.prop("checked"),
			}
			App.Project.NotesCollection.defaults.pageIndexNotes = 1;
			App.Project.NotesCollection.defaults.toMeBool = target.prop("checked");
			App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
			App.Project.NotesCollection.getNotesListHandle(searchData);//共用了获取批注列表的方法
		})
	}
})