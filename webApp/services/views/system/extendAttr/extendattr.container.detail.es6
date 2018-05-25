//列表详情
App.Services.System.ExtendAttrContainerListDetail = Backbone.View.extend({

	tagName: "li",

	className: "item",

	//初始化
	initialize() {
		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, "destroy", this.removeModel);
	},

	events: {
		"click .myIcon-update": "attrUpdate",
		"click .myIcon-del-blue": "attrDel"
	},

	template: _.templateUrl("/services/tpls/system/extendAttr/extend.list.detail.html"),

	render() {
		var data = this.model.toJSON(),
			html = this.template(data);

		this.$el.html(html).data("classKey", data.classKey).data("property", data.property);

		return this;

	},

	//更新
	attrUpdate(event) {
		var $item = $(event.target).closest(".item"),
			data = {
				isEdit: true,
				property: $item.find(".key").text().trim(),
				reference: $item.find(".linkAttr").text().replace("--", "").trim(),
				type: $item.find(".type").text().trim(),
				propertyName: $item.find(".attr").text().trim()
			};

		var dialogHtml = _.templateUrl('/services/tpls/system/extendAttr/extend.attr.add.html')(data);
		var opts = {
			title: "编辑属性",
			width: 601,
			height: 400,
			isConfirm: false,
			isAlert: true,
			cssClass: "extendAttrAddDialog",
			message: dialogHtml,
			okCallback: () => {
				this.extendAttrUpdate(dialog);
				return false;
			}

		}

		var dialog = new App.Comm.modules.Dialog(opts);

		dialog.classKey=$item.data("classKey");
		dialog.property=$item.data("property");

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

	//修改
	extendAttrUpdate(dialog){
		
		var data = {
				URLtype: "extendAttrUpdate",
				type: "PUT",
				headers: {
					"Content-Type": "application/json"
				}

			},
			pars = {
				propertyName: dialog.element.find(".txtAttrTitle").val().trim(),
				classKey: dialog.classKey,
				property:dialog.property

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
				this.model.set(data.data);
				dialog.close();
			}
		});
	},


	//删除
	attrDel(event) {

		var $item = $(event.target).closest(".item"),
			name = $item.find(".attr").text(),
			key = $item.find(".key").text(),
			classKey = $item.data("classKey"),
			property = $item.data("property"),
			that = this,
			msg = "确认删除“" + name + "(" + key + ")" + "”？";

		App.Services.Dialog.alert(msg, function(dialog) {

			var data = {

				URLtype: "extendAttrDel",
				type: "DELETE",
				data: {
					classKey: classKey,
					property: property
				}
			}

			App.Comm.ajax(data, function(data) {
				if (data.code == 0) {
					that.model.destroy();
					dialog.close();
				}
			});
		});


	},

	//销毁
	removeModel() {
		//最后一条
		var $parent = this.$el.parent();
		if ($parent.find("li").length <= 1) {
			$parent.append('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
		}
		this.remove();
	}



});