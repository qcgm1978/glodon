//成本 -> 校验
App.Project.CostVerification = Backbone.View.extend({

	tagName: "div",

	className: "CostVerification",

	initialize: function() {
		this.listenTo(App.Project.CostAttr.VerificationCollection, "add", this.addOne);
		this.listenTo(App.Project.CostAttr.VerificationCollection, "reset", this.reset);

		this.listenTo(App.Project.CostAttr.VerificationCollectionCate, "add", this.addOneCate);
		this.listenTo(App.Project.CostAttr.VerificationCollectionCate, "reset", this.resetCate);
	},


	events: {
		"click .tbVerificationCate .nodeSwitch": "showNode",
		"click .tbVerficationContentContent .nodeSwitch": "nodeSwitch",
		"click .subData .code": "showInModel"
	},


	//渲染
	render: function() {
		var page = _.templateUrl("/projects/tpls/project/cost/project.cost.property.verification.html", true);
		this.$el.html(page);
		return this;

	},

	rootTemplate: _.templateUrl("/projects/tpls/project/cost/project.cost.property.verification.detail.root.html"),

	itemTemplate: _.templateUrl("/projects/tpls/project/cost/project.cost.property.verification.detail.root.item.html"),

	//获取数据后处理
	addOne: function(model) {

		var data = model.toJSON(),
			$tbTop = this.$(".tbTop");
		data.treeNode = this.itemTemplate,
			$target = this.$(".tbVerficationContentContent");

		$target.html(this.rootTemplate(data));
		$target.prev().find(".count").text(data.data.length);

	},

	addOneCate(model) {
		var template = _.templateUrl("/projects/tpls/project/plan/project.plan.property.inspection.detail.cate.html"),
			data = model.toJSON(),
			$tbBottom = this.$(".tbVerificationCate");

		$tbBottom.find("tbody").html(template(data));
		$tbBottom.prev().find(".count").text(data.data.length);
	},

	resetCate() {
		this.$(".tbVerificationCate tbody").html(App.Project.Settings.loadingTpl);
	},

	reset() {
		this.$(".tbTop tbody").html(App.Project.Settings.loadingTpl);
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
			URLtype: "fetchNoCostCate",
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
	//在模型中显示
	showInModel(event) {
		// App.Project.recoverySilder();//不要刷新左侧筛选树
		
		App.Project.Settings.isModelCostChange = true;
		if(App.Project.Settings.isModelChange){//zhangyankai 修改如果操作了质量然后直接返回成本 则会初始化模型和筛选树
			CommProject.recoverySilder();
			App.Project.Settings.isModelChange=false;
		}
		App.Project.planCostShowInModel(event);
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
		event.stopPropagation();

	}



});