App.Project.FileContainer.FileStatus = Backbone.View.extend({
	tagName: "div",
	className: "fileStatus",
	events: {
		"click .lookRvtFailList": "lookRvtFailListFun",
		"click .lookDwgFailList": "lookDwgFailListFun",
	},
	template: _.templateUrl("/projects/tpls/project/project.container.file.status.html"),
	//渲染
	render: function() {
		this.getFileStatusFun();
		return this;
	},
	getFileStatusFun(){//获取文件上传转换状态的方法
		var data = {
			URLtype: "getFileStatus",
			data: {
				projectId: App.Project.Settings.projectId,
				versionId: App.Project.Settings.versionId,
			}
		}
		App.Comm.ajax(data, (data) => {
			if(data.code == 0){
				this.$el.html(this.template(data.data));
			}
		});
	},
	lookRvtFailListFun:function(evt){
		var target = $(evt.target);
		var failCount = target.data("failcount");
		var rvtFailBox = $(".rvtFailBox");
		if(failCount != 0){
			if(rvtFailBox.css("display") == "block"){
				rvtFailBox.css("display","none");
			}else{
				rvtFailBox.css("display","block");
			}
		}
		App.Comm.initScroll(this.$(".fileStatus"), "y");
	},
	lookDwgFailListFun:function(evt){
		var target = $(evt.target);
		var failCount = target.data("failcount");
		var rvtFailBox = $(".dwgFailBox");
		if(failCount != 0){
			if(rvtFailBox.css("display") == "block"){
				rvtFailBox.css("display","none");
			}else{
				rvtFailBox.css("display","block");
			}
		}
		App.Comm.initScroll(this.$(".fileStatus"), "y");
	}
})