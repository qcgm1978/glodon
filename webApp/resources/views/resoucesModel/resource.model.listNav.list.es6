/*
* @require /resources/views/resoucesModel/resources.model.listNav.list.detail.es6
* */
//列表
App.ResourceModel.ListContent = Backbone.View.extend({

	tagName: "div",

	id: "resourceListContent",

	//初始化
	initialize: function() {
		this.listenTo(App.ResourceModel.FileCollection, "add", this.addOneFile);
		this.listenTo(App.ResourceModel.FileCollection, "reset", this.reset);
		this.listenTo(App.ResourceModel.FileCollection, "searchNull", this.searchNull);
	},


	template: _.templateUrl("/resources/tpls/resourceModel/resources.model.listNav.list.html", true),

	events:{
		"click .header .ckAll":"ckAll"
	},

	//渲染
	render: function() {

		this.$el.html(this.template);

		return this;
	},

	ckAll(event){ 
		this.$el.find(".fileContent .ckAll").prop("checked",event.target.checked);
	}, 

	//添加单个文件
	addOneFile: function(model) {
		var view = new App.ResourceModel.ListNavDetail({
			model: model
		});

		this.$el.find(".fileContent .loading").remove();

		if (model.toJSON().isAdd) {
			this.$el.find(".fileContent").prepend(view.render().el);
		} else {
			this.$el.find(".fileContent").append(view.render().el);
		}

		App.Comm.initScroll(this.$el.find(".fileLists"),"y"); 
		 
	},

	reset(){
		this.$el.find(".fileContent").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},

		//搜索为空
 	searchNull() {
 		this.$el.find(".fileContent").html('<li class="loading"><i class="iconTip"></i>' +
            (App.Local.data.system.Nfd || '未搜索到相关文件/文件夹') +
            '</li>');
 	}
 



});