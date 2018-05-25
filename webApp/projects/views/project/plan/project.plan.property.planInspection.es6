//检查
App.Project.PlanInspection = Backbone.View.extend({

	tagName: "div",

	className: "planInterest",

	initialize: function() {
		this.listenTo(App.Project.PlanAttr.PlanInspectionCollection, "add", this.addOne);
		this.listenTo(App.Project.PlanAttr.fetchPlanInspectionCate, "add", this.addOne2);

		this.listenTo(App.Project.PlanAttr.PlanInspectionCollection, "reset", this.reset);
		this.listenTo(App.Project.PlanAttr.fetchPlanInspectionCate, "reset", this.reset2);

	},

	events: {
		"click .tbBottom .nodeSwitch": "showNode",
		"click .subData .code": "showInModel",
		"click .exportList": "exportList"
	},


	render: function() {
		var page = _.templateUrl("/projects/tpls/project/plan/project.plan.property.inspection.html", true);
		this.$el.html(page);
		return this;
	},

	//导出列表
	exportList: function() {

		var data = {
			URLtype: "downloadPlanVer",
			data: {
				projectId: App.Project.Settings.projectId,
				projectVersionId: App.Project.Settings.versionId
			}
		} 
		
		window.location.href = App.Comm.getUrlByType(data).url;

	},

	//计划节点未关联图元
	addOne: function(model) {
		var template = _.templateUrl("/projects/tpls/project/plan/project.plan.property.inspection.detail.html");
		var data = model.toJSON();
		var $tbTop = this.$(".tbTop");
		$tbTop.find("tbody").html(template(data));
		$tbTop.prev().find(".count").text(data.data.length);
		this.bindScroll();
	},

	//图元未关联计划节点
	addOne2(model) {
		var template = _.templateUrl("/projects/tpls/project/plan/project.plan.property.inspection.detail.cate.html");
		var data = model.toJSON();
		var $tbBottom = this.$(".tbBottom"),
			count = data.data && data.data.length || 0;
		$tbBottom.find("tbody").html(template(data));
		$tbBottom.prev().find(".count").text(count);
		this.bindScroll();
	},

	bindScroll() {
		this.$('.nullLinkData').hide();
		this.$('.exportList').show();
		App.Comm.initScroll(this.$(".contentBody .contentScroll"), "y");
	},

	reset() {
		this.$(".tbTop tbody").html(App.Project.Settings.loadingTpl);
	},
	reset2() {
		this.$(".tbBottom tbody").html(App.Project.Settings.loadingTpl);
	},

	//图元未关联计划节点 暂开
	showNode(event) {

		var $target = $(event.target),
			$tr = $target.closest("tr");
		//展开
		if ($target.hasClass("on")) {
			$target.removeClass("on");
			$tr.nextUntil(".odd").hide();
			return;
		}

		//加载过
		if (!$tr.next().hasClass("odd")) {
			$target.addClass("on");
			$tr.nextUntil(".odd").show();
			return;
		}
		//未加载过
		var data = {
			URLtype: "fetchComponentByCateId",
			data: {
				projectId: App.Project.Settings.projectId,
				projectVersionId: App.Project.Settings.CurrentVersion.id,
				cateId: $target.data("cateid")
			}
		}

		$tr.after('<tr><td class="subData loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</td></tr>');
		App.Comm.ajax(data, function(data) {

			if (data.code == 0) {
				var tpl = _.templateUrl("/projects/tpls/project/plan/project.plan.property.inspection.detail.cate.detail.html");
				$tr.next().remove();
				$tr.after(tpl(data));
				$target.addClass("on");
			}

		});

	},
	cancelZoomModel:function(){
	//	App.Project.Settings.Viewer.fit();
		App.Project.cancelZoomModel();
	},
	//在模型中显示
	showInModel(event) {
		// App.Project.recoverySilder();modify zhangyankai
		if(App.Project.Settings.isModelCostChange){//zhangyankai 修改 如果是操作了成本 直接返回计划 就不会初始化 只是会全部显示
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
		App.Project.Settings.Viewer.loadMarkers(null);
		App.Project.planCostShowInModel(event);
	}



});