//系统管理入口
App.Services.Application = Backbone.View.extend({

	tagName: "div",

	id: "applicationManager",

	template: _.templateUrl('/services/tpls/application/index.html', true),

	events: {
		"click .topBar .create": "appAddDialog"
	},

	initialize() {
		this.listenTo(App.Services.AppCollection.AppListCollection, "add", this.addOne);
		this.listenTo(App.Services.AppCollection.AppListCollection, "reset", this.reset);
	},

	render() {
		this.$el.html(this.template);
		//获取数据
		this.fetchData();
		return this;
	},

	//获取数据
	fetchData() {
		App.Services.AppCollection.AppListCollection.reset();
		App.Services.AppCollection.AppListCollection.fetch({
			success(model, response, options) {
				 this.$(".appContent .textSum .count").text(response.data.length);
			}
		});
	},

	//新增应用 弹出层
	appAddDialog() {
		var dialogHtml = _.templateUrl('/services/tpls/application/index.add.html')({});
		var opts = {
			title: "新增应用",
			width: 601,
			isConfirm: false,
			isAlert: true,
			cssClass: "addNewApp",
			message: dialogHtml,
			okCallback: () => {
				this.appAdd(dialog);
				return false;
			} 
		}

		var dialog = new App.Comm.modules.Dialog(opts);
	},

	//新增应用
	appAdd(dialog) {

		var data={
			URLtype:"appInsert",
			type:"POST",
			data:{
				name:dialog.element.find(".txtAppTitle").val().trim(),
				desc:dialog.element.find(".txtAppDesc").val().trim()
			} 
		}

		if (!data.data.name) {
			alert("请输入应用名称");
			return;
		}

		if (!data.data.desc) {
			alert("请输入应用详情");
			return;
		}


		App.Comm.ajax(data,function(data){
			if (data.code==0) {
				App.Services.AppCollection.AppListCollection.push(data.data);
				$('.count').text($('.listBody').find("li.item").length);
				dialog.close();
			}
			
		});

	}, 

	//加载
	reset() {
		this.$(".appListScroll .listBody").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},

	//新增
	addOne(model) {

		var $listBody = this.$(".appListScroll .listBody");
		//移除loading
		$listBody.find(".loading").remove();
		//绑定滚动条
		App.Comm.initScroll(this.$(".appListScroll"), "y");
		//添加数据
		$listBody.append(new App.Services.ApplicationListDetail({
			model: model
		}).render().el);

	}



});