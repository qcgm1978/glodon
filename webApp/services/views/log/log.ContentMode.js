App.Services.ContentMode = Backbone.View.extend({
	tagName: 'div',
	id: 'logModes',
	// 重写初始化
	initialize: function() {
		this.listenTo(App.Services.logCollection, "add", this.addOne);
		this.listenTo(App.Services.logCollection, "reset", this.emptyContent);
		Backbone.on('servicesListNullData', this.showNullTip, this);
	},
	events: {
		"click .sortI": "sortHandle"
	},
	template: _.templateUrl('/services/tpls/log/services.ContentMode.html', true),

	render: function() {
		this.$el.html(this.template);
		return this;
	},
	sortHandle: function(evt) {
		var target = $(evt.target);
		var currentName = target.parent().attr("class");
		var sortData = {
			orderName: "",
			orderSort: "",
		}
		if (target.hasClass('descClass')) {
			target.removeClass('descClass');
			sortData.orderSort = "desc";
		} else {
			$(".sortI").removeClass("descClass");
			target.addClass('descClass');
			sortData.orderSort = "asc";
		}
		if (currentName == "logTime") {
			sortData.orderName = "op_time";
		} else if (currentName == "logType") {
			sortData.orderName = "module_type";
		} else if (currentName == "logName") {
			sortData.orderName = "entity_name";
		} else if (currentName == "operator") {
			sortData.orderName = "operator";
		} else if (currentName == "action") {
			sortData.orderName = "op_content";
		}
		App.Services.formData.orderName = sortData.orderName;
		App.Services.formData.orderSort = sortData.orderSort;
		App.Services.loadData(App.Services.formData);
		return false;
	},
	//切换改变
	addOne: function(model) {

		var listView = new App.Services.listView({
				model: model
			}),
			$proListBox = this.$el.find(".proListBox");

		$proListBox.find(".loading").remove();

		$proListBox.append(listView.render().el);
	},
	//清空内容
	emptyContent: function() {
		this.$el.find(".proListBox").html('<li class="loading">' +
			(App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
			'</li>');
	},
	showNullTip: function() {

		if (App.Services.Settings.pageIndex != 1) {
			this.$el.find(".proListBox").html('<li class="loading">此页没有数据</li>');
		} else {
			this.$el.find(".proListBox").html('<li class="loading"><img src="/static/dist/images/projects/images/emptyProject.png"><div  data-i18n="data.drawing-model.Npe">暂无日志</div></li>');
		}
	}
});