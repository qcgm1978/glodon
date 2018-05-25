App.ResourcesNav.FamLibs = Backbone.View.extend({

	tagName: "div",

	id: "famLibs",

	template: _.templateUrl("/resources/tpls/resourcesNav/resource.nav.standardlibs.html"),

	//初始化
	initialize() {
		this.listenTo(App.ResourcesNav.FamLibsCollection, "add", this.addOne);
		this.listenTo(App.ResourcesNav.FamLibsCollection, "reset", this.emptyContent);
		Backbone.on('FamlibNullData',this.nullData,this);
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	templateDetail: _.templateUrl("/resources/tpls/resourcesNav/resource.nav.standardlibs.detail.html"),

	//添加单个
	addOne(model) {

		var $standar = this.$el.find(".standarBody .standar"),
			$loading = $standar.find(".loading");

		if ($loading.length > 0) {
			$loading.remove();
		}
		var data = model.toJSON();

		$standar.append(this.templateDetail(data)); 
	}, 


	//清空内容
	emptyContent() {
		this.$el.find(".standarBody .standar").html(' <li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},
	nullData() {
		this.$el.find(".standarBody .standar").html('<li class="loading"><img src="/static/dist/images/projects/images/emptyProject.png"><div data-i18n="data.drawing-model.Nfe">' +
            (App.Local.data["drawing-model"].Nfe || '暂无可访问族库') +
            '</div></li>');
	}


});