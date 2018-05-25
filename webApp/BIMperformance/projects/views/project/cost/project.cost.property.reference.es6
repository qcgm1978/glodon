//成本 -> 清单
App.Project.CostReference = Backbone.View.extend({

	tagName: "div",

	className: "CostReference",

	isExpand:false,

	initialize: function() {
		this.listenTo(App.Project.CostAttr.ReferenceCollection, "add", this.addOne);
		this.listenTo(App.Project.CostAttr.ReferenceCollection, "reset", this.reset);
	},


	events: {
		"click .tbBodyContent": "showInModle",
		"click .tbBodyContent .nodeSwitch": "nodeSwitch",
		"keydown .txtSearch":'search'
	},


	//渲染
	render: function() {
		var page = _.templateUrl("/projects/tpls/project/cost/project.cost.property.reference.html", true);
		this.$el.html(page);
		return this;
	},

	template: _.templateUrl("/projects/tpls/project/cost/project.cost.property.reference.detail.html"),

	rootTemplate: _.templateUrl("/projects/tpls/project/cost/project.cost.property.reference.detail.root.html"),

	itemTemplate: _.templateUrl("/projects/tpls/project/cost/project.cost.property.reference.detail.root.item.html"),

	//获取数据后处理
	addOne: function(model) {
		var data = model.toJSON();
		data.treeNode = this.itemTemplate;
		this.$(".tbBody .tbBodyContent").html(this.rootTemplate(data));

		App.Comm.initScroll(this.$(".tbBodyScroll"),"y");
		if(this.isExpand){
			this.$('.nodeSwitch').addClass('on');
			this.$('.nodeSwitch').closest('.node').children("ul").show();
			this.isExpand=false;
		}
	},

	reset() {
		this.$(".tbBody .tbBodyContent").html(App.Project.Settings.loadingTpl);
	},
	//模型中显示
	showInModle(event) {
		
		App.Project.Settings.isModelCostChange = true;
		if(App.Project.Settings.isModelChange){//zhangyankai 修改如果操作了质量然后直接返回成本 则会初始化模型和筛选树
			CommProject.recoverySilder();
			App.Project.Settings.isModelChange=false;
		}
		var $target = $(event.target).closest(".item"),
			ids=$target.data("userId"),
			box=$target.data("box");
		if ($target.hasClass("selected")) {
			App.Project.cancelZoomModel();
			$target.removeClass("selected");
			return
		} else {
			$target.parents('.rightPropertyContent').find(".planContainer").find(".selected").removeClass('selected');
			$target.parents('.rightPropertyContent').find(".qualityContainer").find(".selected").removeClass('selected');
			// this.$(".tbBodyScroll").find(".selected").removeClass("selected");
			$target.addClass("selected");
		}
		if (ids && box) {
			if(App.Project.Settings.checkBoxIsClick){
				App.Project.Settings.Viewer.filterByUserIds(undefined);

				App.Project.Settings.checkBoxIsClick = false;
			}

			App.Project.zoomToBox(ids,box);
			return;
		}
		var data = {
			URLtype: "fetchCostModleIdByCode",
			data: {
				projectId: App.Project.Settings.CurrentVersion.projectId,
				projectVersionId: App.Project.Settings.CurrentVersion.id,
				costCode: $target.data("code")
			}
		};
		App.Comm.ajax(data, function(data) {
			if (data.code == 0) {
				if(!data.data.boundingBox){
					App.Project.cancelZoomModel();
					return
				}
				var box=App.Project.formatBBox(data.data.boundingBox);
				$target.data("userId", data.data.elements);
				$target.data("box", box);
				if(App.Project.Settings.checkBoxIsClick){
					App.Project.Settings.Viewer.filterByUserIds(undefined);

					App.Project.Settings.checkBoxIsClick = false;
				}
				App.Project.zoomToBox(data.data.elements,box);
			}
		});
	},

	//收起展开
	nodeSwitch(event) { 

		var $target = $(event.target),
			$node = $target.closest(".node");

		if ($target.hasClass("on")) {
			$target.removeClass("on");
			$node.children("ul").hide();
		} else {
			$target.addClass("on");
			$node.children("ul").show();
		} 

		//this.$(".tbBodyScroll .tbBodyContent li:visible:odd").addClass("odd");

		event.stopPropagation(); 

	},
	search(e){
		var _this=this;
		if(e.keyCode==13){
			var _key=$(e.currentTarget).val();
			App.Project.CostAttr.ReferenceCollection.reset();
			App.Project.CostAttr.ReferenceCollection.projectId = App.Project.Settings.projectId;
			App.Project.CostAttr.ReferenceCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
			App.Project.CostAttr.ReferenceCollection.fetch({
				data:{
					keyword:_key
				},
				success:function(c,d,x){
					if(d.data.length<=0){
						_this.$(".tbBody .tbBodyContent").html('<div class="nullPage costList"><i class="bg"></i>暂无搜索结果</div>');
					}
				}
			});
			if(_key){
				this.isExpand=true;
			}
		}
	}


});