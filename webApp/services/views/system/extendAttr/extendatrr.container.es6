App.Services.System.ExtendAttrContainer = Backbone.View.extend({

	tagName: "div",

	className: "extendAttrContainer folwContainer",

	initialize() {
		this.listenTo(App.Services.SystemCollection.ExtendAttrCollection, "add", this.addOne);
		this.listenTo(App.Services.SystemCollection.ExtendAttrCollection, "reset", this.reset);
	},

	events: {
		"click .topBar .create": "extendAttrAddDialog"
	},

	render() {

		var template = _.templateUrl('/services/tpls/system/extendAttr/extend.attr.container.html');
		this.$el.html(template);
		return this;
	},



	//新增
	addOne(model) {

		var view = new App.Services.System.ExtendAttrContainerListDetail({
				model: model
			}),
			$extendAttrListBody = this.$(".extendAttrListBody");

		$extendAttrListBody.find(".loading").remove();
		//数据
		$extendAttrListBody.append(view.render().el);
		//滚动条
		App.Comm.initScroll(this.$(".extendAttrListBodScroll"), "y");


	},

	//重置
	reset() {
		this.$(".extendAttrListBody").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	},

	//新增流程
	extendAttrAddDialog() {

		var dialogHtml = _.templateUrl('/services/tpls/system/extendAttr/extend.attr.add.html')({});

		var opts = {
			title: "新增属性",
			width: 601,
			height: 400,
			isConfirm: false,
			isAlert: true,
			cssClass: "extendAttrAddDialog",
			message: dialogHtml,
			okCallback: () => {
				this.extendAttrAdd(dialog);
				return false;
			}

		}

		var dialog = new App.Comm.modules.Dialog(opts);

		dialog.element.find(".linkAttrOption").myDropDown({
			zIndex: 10
		});

		dialog.element.find(".attrTypeOption").myDropDown({

			click: function($item) {
				dialog.element.find(".attrTypeOption").data("type", $item.data("type"));
			}
		});

		dialog.element.find(".linkAttr").myRadioCk({
			click: function(selected) {
				if (!selected) {
					dialog.element.find(".linkAttrOption .myDropText").addClass("disabled");
					dialog.element.find(".attrTypeOption .myDropText").removeClass("disabled");
				} else {
					dialog.element.find(".linkAttrOption .myDropText").removeClass("disabled");
					dialog.element.find(".attrTypeOption .myDropText").addClass("disabled");
				}
			}
		});


		var data = {
			URLtype: "extendAttrGetReferene"
		}

		//扩展属性
		App.Comm.ajax(data, (data) => {
			if (data.code == 0) {
				var template = _.templateUrl('/services/tpls/system/extendAttr/extend.attr.add.droplist.html');
				dialog.element.find(".linkAttrOption .myDropList").html(template(data));

			} 
		})

	},


	extendAttrAdd(dialog) {

		 
		var data = {
				URLtype: "extendAttrInsert",
				type: "POST",
				headers: {
					"Content-Type": "application/json"
				}

			},
			pars = {
				propertyName: dialog.element.find(".txtAttrTitle").val().trim(),
				classKey: $(".extendAttrSliderUl  .item.selected").data("id")
			}

		if (!pars.propertyName) {
			alert("请输入属性名称");
			return;
		}

		if (dialog.element.find(".btnCk").hasClass("selected")) {
			pars.pushType = 0;
			pars.reference = dialog.element.find(".linkAttrOption .myDropText .text").text();
		} else {
			//pars.reference = "";
			pars.pushType = dialog.element.find(".attrTypeOption").data("type");
		}

		data.data = JSON.stringify(pars);

		App.Comm.ajax(data, (data) => {
			if (data.code == 0) {
				App.Services.SystemCollection.ExtendAttrCollection.push(data.data);
				dialog.close();
				var $count=$(".systemContainer .folwContainer .textSum .count");
				  $count.text(+$count.text()+1);
			}
		});

	}

});