App.ResourcesNav.StandardLibs = Backbone.View.extend({

	tagName: "div",

	id: "standardLibs",

	template: _.templateUrl("/resources/tpls/resourcesNav/resource.nav.standardlibs.html"),

	//初始化
	initialize() {
		this.listenTo(App.ResourcesNav.StandardLibsCollection, "add", this.addOne);
		this.listenTo(App.ResourcesNav.StandardLibsCollection, "reset", this.emptyContent);
		Backbone.on('StandModelNullData',this.nullData,this);
	},

	events: {
		"click .title .name": "setVersion"
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

		var data = model.toJSON(),
			$el = $(this.templateDetail(data)).data("file", data);

		$standar.append($el);

	},
	//设置版本
	setVersion: function(event) {

		var $target = $(event.target),
			$item = $target.closest(".item"),
			data = $item.data("file");

		if (data.version) {
			App.ResourceModel.Settings.CurrentVersion = data.version;
		} else {
			alert("暂无版本");
			$target.removeAttr("href");
		}



	},

	//清空内容为加载
	emptyContent() {
		this.$el.find(".standarBody .standar").html(' <li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},
	nullData() {
		this.$el.find(".standarBody .standar").html('<li class="loading"><img src="/static/dist/images/projects/images/emptyProject.png"><div data-i18n="data.drawing-model.Nse">' +
            (App.Local.data["drawing-model"].Nse || '暂无可访问标准模型') +
            '</div></li>');
	}



});