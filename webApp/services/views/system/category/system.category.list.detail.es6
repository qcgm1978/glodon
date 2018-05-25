//列表详情
App.Services.System.CategoryListDetail = Backbone.View.extend({

	tagName: "li",

	className: "item",

	events: {
		"click .btnDel": "delCategory",
		"click .btnUpdate": "updateCategory"
	},

	initialize() {
		//this.listenTo(this, "remove", this.removeModel);
		this.listenTo(this.model, "destroy", this.removeModel);
		this.listenTo(this.model, "change", this.render);
	},

	template: _.templateUrl('/services/tpls/system/category/system.category.list.detail.html'),

	render() {
		var data = this.model.toJSON();
		this.$el.html(this.template(data));
		return this;
	},

	//删除
	delCategory(event) {

		var text = _.templateUrl('/services/tpls/system/category/system.category.del.html', true)(),
			$target = $(event.target),
			that = this,
			opts = {
				width: 284,
				height: 180,
				showTitle: false,
				cssClass: "delConfirm",
				showClose: false,
				isAlert: false,
				isConfirm: false
			},
			  name = $target.closest(".item").find(".name").text().trim();
		msg = "确认要删除" + (name.length>17?(name.slice(0,16)+"..."):name) + "业务类别吗？";


			 
		opts.message =text.replace('#title', msg);
		var confirmDialog = new App.Comm.modules.Dialog(opts);
		this.delCategoryEvent(confirmDialog, $target);

	},
	//删除事件绑定
	delCategoryEvent(confirmDialog, $target) {
		var that = this;
		//确认删除
		confirmDialog.element.on("click", ".btnEnter", function() {

			var $this = $(this);

			if ($this.hasClass("disabled")) {
				return;
			}

			$this.addClass("disabled").val("删除中");


			var id = $target.data("id"),
				data = {
					URLtype: "servicesCategoryDel",
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


	//更新 category
	updateCategory(event) {

		var $target = $(event.target),
			$item = $target.closest(".item"),
			that = this,
			data = {
				isEdit: true,
				code: $item.find(".code").text().trim(),
				name: $item.find(".name").text().trim(),
				desc: $item.find(".desc").text().trim()
			}

		var dialogHtml = _.templateUrl('/services/tpls/system/category/system.add.category.html')(data);

		var opts = {
			title: "更新业务类别",
			width: 601,
			height: 380,
			limitHeight: false,
			cssClass: "addNewCategoryDialog",
			message: dialogHtml,
			okCallback: () => {

				if (dialog.isSubmit) {
					return;
				}

				var data = {
					URLtype: "servicesCategoryUpdate",
					type: "POST",
					data: {
						id: $target.data("id"),
						busCode: dialog.element.find(".txtCategoryCode").val().trim(),
						busName: dialog.element.find(".txtCategoryTitle").val().trim(),
						busDesc: dialog.element.find(".txtCategoryDesc").val().trim()
					}
				}
				dialog.isSubmit = true;
				App.Comm.ajax(data, function(data) {

					if (data.code == 0) {
						that.model.set(data.data);
						dialog.close();
					}
				});


				return false;

			}
		}

		var dialog = new App.Comm.modules.Dialog(opts);
	},

	//移除
	removeModel() {
		//最后一条
		var $parent = this.$el.parent();
		if ($parent.find("li").length <= 1) {
			$parent.append('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
		}
		this.remove(); 

	}

});