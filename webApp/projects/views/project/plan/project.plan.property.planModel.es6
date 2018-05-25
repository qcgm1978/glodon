App.Project.PlanModel = Backbone.View.extend({

	tagName: "div",

	className: "planModel",

	initialize: function() {
		this.listenTo(App.Project.PlanAttr.PlanModelCollection, "add", this.addOne);
		this.listenTo(App.Project.PlanAttr.PlanModelCollection, "reset", this.loading);
	},

	events: {
		"click .searchToggle": "searchToggle",
		"click .tbPlan tr.itemClick": "showInModle",
		"click .treeCheckbox": "switch"
	},
	clearSearch() {
		this.$(".categoryOption .text").html('全部')
		this.$(".categoryOption .text").html('全部')
		Backbone.trigger('qualityFilterDataClear');
	},
	//显示隐藏搜索
	searchToggle(e) {
		var $searchDetail = this.$(".searchDetail");
		if ($searchDetail.is(":animated")) {
			return;
		}
		$(e.currentTarget).toggleClass('expandArrowIcon');
		$searchDetail.slideToggle();
	},

	searchup() {
		var $searchDetail = this.$(".searchDetail");
		if ($searchDetail.is(":animated")) {
			return;
		}
		this.$('.searchToggle').removeClass('expandArrowIcon');
		$searchDetail.slideUp();
	},

	render: function() {
		var tpl = _.templateUrl("/projects/tpls/project/plan/project.plan.property.planModel.html", true);
		this.$el.html(tpl);
		return this;
	},

	template: _.templateUrl("/projects/tpls/project/plan/project.plan.property.planAnalog.detail.html"),


	loading: function() {
		this.searchup();
	},

	addOne: function(model) {
		var data = model.toJSON();
		this.$(".tbPlan tbody").html(this.template(data));
		this.bindScroll();
		var codes = [];
		$('.planSearch .treeCheckbox input').prop('checked', false);
		$.each(data.data, function(i, item) {
			item.code ? codes.push(item.code) : '';
		});
		if (codes.length > 0) {
			codes.push(-1);
		}

		//App.Project.PlanAttr.PlanAnalogCollection.reset();
		//App.Project.PlanAttr.PlanAnalogCollection.projectId = App.Project.Settings.projectId;
		//App.Project.PlanAttr.PlanAnalogCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
		//App.Project.PlanAttr.PlanAnalogCollection.fetch();
		this.codes = codes;
	},
	//绑定滚动条
	bindScroll() {

		var $materialequipmentListScroll = this.$(".planContent");

		if ($materialequipmentListScroll.hasClass('mCustomScrollbar')) {
			return;
		}

		$materialequipmentListScroll.mCustomScrollbar({
			set_height: "100%",
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		});
	},
	//切换显示此节点关联模型
	switch () {
		/* add by wuweiwei begin */
		var $check = $('.planModel .treeCheckbox input');
		if (!$check[0].checked) {
			App.Project.Settings.checkBoxIsClick = false;
			return;
		}
		/* end */
		if ($('.planModel .itemClick.selected').length > 0) {
			var self = this;
			App.Project.Settings.checkBoxIsClick = true;
			setTimeout(function() {
				self.showInModle('', $('.planModel .itemClick.selected'));
			}, 100)
		}
	},
	//模型中显示
	showInModle(event, $el) {
		App.Project.Settings.Viewer.loadMarkers(null);
		if(App.Project.Settings.isModelCostChange && !$(event.target).hasClass("odd")){//zhangyankai 修改 如果是操作了成本 直接返回计划 就不会初始化 只是会全部显示
			App.Project.cancelZoomModel();
			App.Project.Settings.Viewer.filterByUserIds(undefined);
			App.Project.Settings.isModelChange=false;
			App.Project.Settings.isModelCostChange=false;
		}
		if(App.Project.Settings.isModelChange){//zhangyankai 修改如果操作了质量然后直接返回计划 则会初始化模型和筛选树
			CommProject.recoverySilder();
			App.Project.Settings.isModelChange=false;
			App.Project.Settings.isModelCostChange=false;
		}
		//CommProject.recoverySilder(); /* add by wuweiwei at 2016-12-20*/
		var $target, ids, box;
		if ($el) {
			$target = $el;
		} else {
			$target = $(event.target).closest("tr");
		}
		ids = $target.data("userId");
		box = $target.data("box");
		if (App.Project.Settings.isHighlight) {
			//高亮钱取消
			App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
			App.Project.Settings.Viewer.highlight({
				type: 'userId',
				ids: undefined
			});
		}
		var targetCode = $target.data("code"),
			checked = $('.planModel .treeCheckbox input').prop('checked');
		if (!$el) {
			if ($target.hasClass("selected")) {
				$target.parent().find(".selected").removeClass("selected");
				App.Project.Settings.Viewer.filterByUserIds(undefined);
				App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();//是否透明除当前构件的构件
				App.Project.Settings.Viewer.highlight({// 高亮显示当前点击的构件
					type: 'userId',
					ids: undefined
				});
				return;
			}else{
				$target.parents('.rightPropertyContent').find(".planContainer").find(".selected").removeClass('selected');
				$target.parents('.rightPropertyContent').find(".qualityContainer").find(".selected").removeClass('selected');
				// $target.parent().find(".selected").removeClass("selected");
				$target.addClass("selected");
				if (!$target.hasClass("odd")){
					var arr = checked?[]:"";
					App.Project.Settings.Viewer.filterByUserIds(arr);
					return;
				}
			}
		}
		if (box && ids) {
			if (checked) {
				App.Project.Settings.checkBoxIsClick = true;
				App.Project.Settings.Viewer.filterByUserIds(undefined);
				App.Project.Settings.Viewer.clearIsolate();
		        App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
				App.Project.Settings.Viewer.filterByUserIds(ids);
				App.Project.Settings.Viewer.highlight({// 高亮显示当前点击的构件
					type: 'userId',
					ids: undefined
				});
				return;
			}
			if ($el) {
				App.Project.Settings.Viewer.filterByUserIds(undefined);
				App.Project.Settings.Viewer.clearIsolate();
		        App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
		        App.Project.Settings.Viewer.setSelectedIds(ids);
		        //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, App.Project.Settings.Viewer.viewer);
		        App.Project.Settings.Viewer.setTranslucentUnselected();
		        App.Project.Settings.Viewer.clearSelection();
				App.Project.Settings.Viewer.highlight({
					type: 'userId',
					ids: ids
				});
			} else {
				App.Project.zoomToBox(ids, box);
			}
			App.Project.Settings.isHighlight = true;
			return;
		}else{
			if (!$target.hasClass("odd")){
				var arr = checked?[]:"";
				App.Project.Settings.Viewer.filterByUserIds(arr);
				return;
			}
		}
		var data = {
			URLtype: "fetchModleIdByCode",
			data: {
				projectId: App.Project.Settings.CurrentVersion.projectId,
				projectVersionId: App.Project.Settings.CurrentVersion.id,
				planCode: $target.data("code")
			}
		};
		App.Comm.ajax(data, function(data) {
			if (data.code == 0) {
				var box = App.Project.formatBBox(data.data.boundingBox);
				App.Project.Settings.Viewer.filterByUserIds(undefined);
				App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
				App.Project.Settings.Viewer.highlight({
					type: 'userId',
					ids: undefined
				});
				if (box && box.length) {
					$target.data("userId", data.data.elements);
					$target.data("box", box);
					if (checked) {
						App.Project.Settings.checkBoxIsClick = true;
						App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
						App.Project.Settings.Viewer.filterByUserIds(data.data.elements);
						return
					}
					if ($el) {
						App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
						App.Project.Settings.Viewer.ignoreTranparent({
							type: "plan",
							ids: undefined
						});
						App.Project.Settings.Viewer.filterByUserIds(undefined);
						App.Project.Settings.Viewer.setSelectedIds(data.data.elements);
				        App.Project.Settings.Viewer.setTranslucentUnselected();
				        App.Project.Settings.Viewer.clearSelection();
						App.Project.Settings.Viewer.highlight({
							type: 'userId',
							ids: data.data.elements
						});
					} else {
						App.Project.zoomToBox(data.data.elements, box);
					}
					App.Project.Settings.isHighlight = true;
				}else{
					App.Project.Settings.Viewer.filterByUserIds([0]);
				} 
			} else {
				App.Project.cancelZoomModel();
			}
		});
	}
});