App.Services.System.FolwContainer = Backbone.View.extend({

	tagName: "div",

	className: "folwContainer",

	initialize() {
		this.listenTo(App.Services.SystemCollection.FlowCollection, "add", this.addOne);
		this.listenTo(App.Services.SystemCollection.FlowCollection, "reset", this.reset);
	},

	events: {
		"click .topBar .create": "flowAddDialog"
	},

	render() {

		var template = _.templateUrl('/services/tpls/system/flow/flow.container.html');
		this.$el.html(template);
		return this;
	},

	//新增
	addOne(model) {

		var view = new App.Services.System.FolwContainerListDetail({
			model: model
		});

		this.$(".flowListBody .loading").remove();

		this.$(".flowListBody").append(view.render().el);

		App.Comm.initScroll(this.$(".flowListBodScroll"), "y");

	},

	//重置
	reset() {
		this.$(".flowListBody").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},

	//新增流程
	flowAddDialog() {

		var dialogHtml = _.templateUrl('/services/tpls/system/flow/system.add.flow.html')({});

		var opts = {
			title: "新增流程",
			width: 601,
			isConfirm: false,
			isAlert: true,
			cssClass: "flowAddDialog",
			message: dialogHtml,
			okCallback: () => {
				this.folwAdd(dialog);
				return false;
			}

		}

		var dialog = new App.Comm.modules.Dialog(opts);

		dialog.element.find(".ckUrl").myRadioCk({
			click: function(isCk) {
				if (isCk) {
					$(this).next().removeAttr("readonly").removeClass("disabled");
				} else {
					$(this).next().attr("readonly", true).addClass("disabled");
				}
			}
		});

		dialog.element.find(".starUrl").myRadioCk({
			click: function(isCk) {
				if (isCk) {
					$(this).next().removeAttr("readonly").removeClass("disabled");
				} else {
					$(this).next().attr("readonly", true).addClass("disabled");
				}
			}
		});
	},


	folwAdd(dialog) {


		if (dialog.isSubmit) {
			return;
		}

		var data = {
			URLtype: "servicesFlowAdd",
			type: "POST",
			data: {
				busName: dialog.element.find(".txtFlowTitle").val().trim(),
				busViewUrl: dialog.element.find(".txtFlowCkUrl").val().trim(),
				busSendUrl: dialog.element.find(".txtFlowStarUrl").val().trim(),
				categoryId: $("#systemContainer .flowSliderUl .selected").data("id")
			}
		}

		if (!data.data.busName) {
			alert("请输入流程名称");
			return;
		}
		 
		if (dialog.element.find(".ckUrl .selected").length > 0) {

			if (!data.data.busViewUrl) {
				alert("未填查看url");
				return;
			}

		} else {
			data.data.busViewUrl = "";
		}

		if (dialog.element.find(".starUrl .selected").length > 0) {
			if (!data.data.busSendUrl) {
				alert("未填发起url");
				return;
			} 
		} else {
			data.data.busSendUrl = "";
		}

		dialog.isSubmit = true;

		//新增
		App.Comm.ajax(data, function(data) {
			if (data.code == 0) {
				$(".folwContainer .flowListBody li:last").find(".myIcon-down-disable").toggleClass("myIcon-down-disable myIcon-down");
				App.Services.SystemCollection.FlowCollection.push(data.data);
				$(".folwContainer .flowListBody li:last").find(".myIcon-down").toggleClass("myIcon-down-disable myIcon-down");
				dialog.close();
				var $count = $(".systemContainer .folwContainer .textSum .count");
				$count.text(+$count.text() + 1);
			}
		});

	}

});