//列表详情
App.Services.System.FolwContainerListDetail = Backbone.View.extend({

	tagName: "li",

	className: "item",

	//初始化
	initialize() {
		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, "destroy", this.removeModel);
	},

	events: {
		"click .myIcon-up": "listMoveUp",
		"click .myIcon-down": "listMoveDown",
		"click .myIcon-update": "updateFolw",
		"click .myIcon-del-blue": "delFolw"


	},

	template: _.templateUrl("/services/tpls/system/flow/flow.container.list.detail.html"),

	render() {

		var data = this.model.toJSON();

		data.index = $("#systemContainer .flowListBody li").length + 1;

		var html = this.template(data);

		this.$el.html(html).data("id", data.id);

		return this;

	},

	//上移
	listMoveUp(event) {
		var $target = $(event.target).closest(".item");
		this.listMove($target, "up");
	},

	//上移
	listMoveDown(event) {
		var $target = $(event.target).closest(".item");
		this.listMove($target, "down");
	},

	//移动
	listMove($target, dirc) {

		var nextId;
		if (dirc == "up") {
			nextId = $target.prev().data("id");
		} else {
			nextId = $target.next().data("id");
		}

		var id = $target.data("id"),
			that = this,
			data = {
				URLtype: "servicesFolwMove",
				data: {
					ids: id + "," + nextId,
					type: dirc == 'up' ? 0 : 1
				}
			}

		App.Comm.ajax(data, function(data) {
			if (data.code == 0) {

				if (dirc == 'up') {

					$target.addClass("relative").animate({
						top: "-58px"
					}, 500, function() {
						$(this).removeClass("relative").css("top", 0);
					});

					$target.prev().addClass("relative").animate({
						top: "58px"
					}, 500, function() {
						$(this).removeClass("relative").css("top", 0);
						$(this).before($target);
						//移动之后
						that.afterMove();
					});


				} else {
					$target.addClass("relative").animate({
						top: "58px"
					}, 500, function() {
						$(this).removeClass("relative").css("top", 0);
					});

					$target.next().addClass("relative").animate({
						top: "-58px"
					}, 500, function() {
						$(this).removeClass("relative").css("top", 0);
						$(this).after($target);
						//移动之后
						that.afterMove();
					});
				}

			}
		});
	},

	//移动完成之后
	afterMove() {

		var $flowListBodyLi = $("#systemContainer .flowListBody li");
		$flowListBodyLi.find(".myIcon-up-disable").toggleClass("myIcon-up myIcon-up-disable").end().find(".myIcon-down-disable").toggleClass("myIcon-down myIcon-down-disable").end().
		first().find(".myIcon-up").toggleClass("myIcon-up myIcon-up-disable").end().end().last().find(".myIcon-down").toggleClass("myIcon-down myIcon-down-disable");
		//重新生成 索引
		$flowListBodyLi.each(function(i, item) {
			$(this).find(".code").text(i + 1)
		});

	},

	//更新流程
	updateFolw(event) {

		var $item = $(event.target).closest(".item"),
			id = $item.data("id"),
			that = this,
			data = {
				id: id,
				busName: $item.find(".name").text().trim(),
				busSendUrl: $item.find(".aStar").text().trim(),
				busViewUrl: $item.find(".aCk").text().trim()
			},

			dialogHtml = _.templateUrl('/services/tpls/system/flow/system.add.flow.html')(data),

			opts = {
				title: "编辑流程",
				width: 601,
				isConfirm: false,
				isAlert: true,
				cssClass: "flowAddDialog",
				message: dialogHtml,
				okCallback: () => {
					that.folwUpdate(dialog, id);
					return false;
				}
			},

			dialog = new App.Comm.modules.Dialog(opts);

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

	//更新
	folwUpdate(dialog, id) {

		if (dialog.isSubmit) {
			return;
		}

		var data = {
				URLtype: "servicesFlowUpdate",
				type: "POST",
				data: {
					id: id,
					busName: dialog.element.find(".txtFlowTitle").val().trim(),
					busViewUrl: dialog.element.find(".txtFlowCkUrl").val().trim(),
					busSendUrl: dialog.element.find(".txtFlowStarUrl").val().trim(),
					categoryId: $("#systemContainer .flowSliderUl .selected").data("id")
				}
			},
			that = this;

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
		}else{
			data.data.busSendUrl="";
		}

		dialog.isSubmit = true;

		//新增
		App.Comm.ajax(data, function(data) {
			if (data.code == 0) {

				that.model.set(data.data);
				dialog.close();
				that.afterMove();
			}
		});

	},

	//删除
	delFolw() {

		var text = _.templateUrl('/services/tpls/system/category/system.category.del.html', true),

			$target = $(event.target),

			that = this,

			id = $target.closest(".item").data("id"),

			msg = "确认要删除" + $target.closest(".item").find(".name").text().trim() + "流程吗？";

		//opts.message = text.replace('#title', msg);



		//var confirmDialog = new App.Comm.modules.Dialog(opts);

		App.Services.Dialog.alert(msg, function(dialog) {

			var data = {
				URLtype: "servicesFlowDel",
				data: {
					id: id
				}
			};

			App.Comm.ajax(data, (data) => {
				if (data.code == 0) {

					that.model.destroy();

					dialog.close();
				}

			});

		});

		//this.delFlowEvent(confirmDialog, $target.closest(".item").data("id"));

	},
	//删除时间
	delFlowEvent(confirmDialog, id) {
		var that = this;
		//确认删除
		confirmDialog.element.on("click", ".btnEnter", function() {

			var $this = $(this);

			if ($this.hasClass("disabled")) {
				return;
			}

			$this.addClass("disabled").val("删除中");

			var data = {
				URLtype: "servicesFlowDel",
				data: {
					id: id
				}
			};

			App.Comm.ajax(data, (data) => {
				if (data.code == 0) {

					that.model.destroy();

					confirmDialog.close();
				}

			});

		});

		//取消 关闭层
		confirmDialog.element.on("click", ".btnCanel", function() {
			confirmDialog.close();
		});
	},

	//销毁
	removeModel() {

		var $parent = this.$el.parent();
		if ($parent.find("li").length <= 1) {
			$parent.append('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
		}

		$parent.find("li").each(function(i, item) {
			$(this).find(".code").text(i + 1);
		});

		//删除
		this.remove();

		//移动过后
		this.afterMove();
	}



});