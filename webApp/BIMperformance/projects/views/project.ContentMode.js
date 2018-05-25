App.Projects.ContentMode = Backbone.View.extend({

	tagName: 'div',

	id: 'projectModes',

	// 重写初始化
	initialize: function() {
		this.listenTo(App.Projects.ProjectCollection, "add", this.addOne);
		this.listenTo(App.Projects.ProjectCollection, "reset", this.emptyContent);
		Backbone.on('projectListNullData',this.showNullTip,this);
	},

	template: _.templateUrl('/projects/tpls/project.ContentMode.html', true),

	render: function() {
		this.$el.html(this.template);
		return this;
	},

	//切换改变
	addOne: function(model) { 
		
		var listView = new App.Projects.listView({
			model: model
		}),$proListBox=this.$el.find(".proListBox"); 

		$proListBox.find(".loading").remove(); 
		$proListBox.append(listView.render().el);

	 
	},

	//清空内容
	emptyContent:function(){
	//	this.$el.find(".proListBox").html('<li class="loading"><img src="/static/dist/images/projects/images/emptyProject.png"><div>暂无可访问项目</div></li>');
		this.$el.find(".proListBox").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},

	showNullTip:function(){

		if (App.Projects.Settings.pageIndex!=1) {
			this.$el.find(".proListBox").html('<li class="loading">此页没有数据</li>');
		}else{
			this.$el.find(".proListBox").html('<li class="loading"><img src="/static/dist/images/projects/images/emptyProject.png"><div data-i18n="data.drawing-model.Npe">' +
                (App.Local.data["drawing-model"].Npe || '暂无可访问项目') +
                '</div></li>');
		}		
	}

});