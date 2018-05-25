App.Project.FileContainer = Backbone.View.extend({


	tagName: "div",

	className: "fileContainer",

	//初始化
	initialize: function() {
		this.listenTo(App.Project.FileCollection, "reset", this.reset);
		this.listenTo(App.Project.FileCollection, "add", this.addOneFile);
		this.listenTo(App.Project.FileCollection, "searchNull", this.searchNull);

	},

	events: {
		"click .header .ckAll": "ckAll",
		"click .btnFileSearch": "fileSearch",
		"click .btnFileState": "btnFileStateFun",
		"click .clearSearch": "clearSearch",
		"keyup #txtFileSearch":"enterSearch"

	},

	template: _.templateUrl("/projects/tpls/project/project.container.file.html"),

	//渲染
	render: function() {
		this.$el.html(this.template());
		var $container = this.$el.find('.serviceNav'),
			Auth = App.AuthObj && App.AuthObj.project && 　App.AuthObj.project.prjfile,
			projectId=App.Project.Settings.CurrentVersion.projectId;

		/*if (!Auth) {
			Auth = {};
		}
		 
		if (!Auth.edit) {
			this.$('.btnFileUpload').addClass('disable');
			if (!Auth.downLoad) {
				this.$('.btnFileDownLoad').addClass('disable');
			}
		}
		if (App.Project.Settings.CurrentVersion.status == 9 ||
			App.Projects.fromCache(projectId,'subType') == 1) {
			this.$('.btnNewFolder').addClass('disable');
			this.$('.btnFileDel').addClass('disable');
		}



		if(App.Projects.fromCache(projectId,'subType') == 1){
			this.$('.btnNewFolder').addClass('disable');
			this.$('.btnFileDel').addClass('disable');
		}
		if (!Auth.create) {
			this.$('.btnNewFolder').addClass('disable');
		}
		if (!Auth.delete) {
			this.$('.btnFileDel').addClass('disable');
		}*/
		
		if(!App.Comm.isAuth('create')){
			this.$('.btnNewFolder').addClass('disable');
		}
		//删除、上传、重命名权限判断方式一样
		if(!App.Comm.isAuth('upload')){
			this.$('.btnFileUpload ').addClass('disable');
		}
		if(!App.Comm.isAuth('delete')){
			this.$('.btnFileDel').addClass('disable');
		}
		return this;
	},

	ckAll(event) {
		this.$el.find(".fileContent .ckAll").prop("checked", event.target.checked);
	},

	//回车搜索
	enterSearch(event){
		if (event.keyCode==13) {
			this.fileSearch();
		}
	},

	//文件转换状态的方法
	btnFileStateFun(e){//add zhangyankai
		if($(".btnFileState").hasClass("disable")) //modify by wuweiwei 2017-2-10
		{
			return;
		}
		var projectId = App.Project.Settings.projectId;
		var versionId = App.Project.Settings.versionId;
		var addDialogEleDom = new App.Project.FileContainer.FileStatus().render(projectId,versionId).el;
		var fileStateDialog = new App.Comm.modules.Dialog({
		    title: App.Local.data['drawing-model'].CPs || "平台文件处理结果",
		    width:700,
		    height:300,
		    isConfirm:false,
		    isAlert:false,
		    cssClass: 'fileStateDialogClass',
		    closeCallback:function(){},
		    message:addDialogEleDom
		});
	},
	//搜索
	fileSearch() {

		var txtSearch = $("#txtFileSearch").val().trim();

		//没有搜索内容
		if (!txtSearch) {
			return;
		}
		//搜索赋值
		App.Project.Settings.searchText = txtSearch;
		var data = {
			URLtype: "fileSearch",
			data: {
				projectId: App.Project.Settings.projectId,
				versionId: App.Project.Settings.versionId,
				key: txtSearch
			}
		}
		App.Comm.ajax(data, (data) => {
			if (data.code == 0) {
				var count = data.data.length;
				this.$(".clearSearch").show();
				this.$(".opBox").find(".btnNewFolder").hide();
				this.$(".opBox").find(".btnFileUpload").hide();
				this.$(".opBox").find(".btnFileState").hide();
				this.$(".searchCount").show().find(".count").text(count);
				App.Project.FileCollection.reset();

				if (count > 0) {
					var _temp=data.data||[];
					// _.each(_temp,function(item){
					// 	item.isSearch='search';
					// })
					App.Project.FileCollection.push(_temp);
				} else {
					App.Project.FileCollection.trigger("searchNull");
				}

			}
		});
	},

	//搜索为空
	searchNull() {
		this.$el.find(".fileContent").html('<li class="loading"><i class="iconTip"></i>' +
            (App.Local.data.system.Nfd || '未搜索到相关文件/文件夹') +
            '</li>');
	},

	//清除搜索
	clearSearch() {
		this.$(".clearSearch").hide();
		this.$(".opBox").find(".btnNewFolder").show();
		this.$(".opBox").find(".btnFileUpload").show();
		this.$(".opBox").find(".btnFileState").show();
		this.$(".searchCount").hide();
		$("#txtFileSearch").val("");
		App.Project.Settings.searchText="";
		App.Project.FileCollection.reset();

		var $selectFile = $(".projectNavFileContainer .selected");

		if ($selectFile.length > 0) {
			App.Project.FileCollection.fetch({
				data: {
					parentId: $selectFile.data("file").fileVersionId
				}
			});
		}else{
			App.Project.FileCollection.fetch();
		}


	},

	//添加单个li
	addOneFile: function(model) {

		var view = new App.Project.FileContainerDetail({
			model: model
		});

		this.$el.find(".fileContent .loading").remove();

		this.$el.find(".fileContent").append(view.render().el);

		//绑定滚动条
		App.Comm.initScroll(this.$el.find(".fileContainerScrollContent"), "y");


	},

	//重置加载
	reset() {

		this.$el.find(".fileContent").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	}



});