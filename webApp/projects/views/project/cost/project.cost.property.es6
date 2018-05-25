App.Project.ProjectCostProperty = Backbone.View.extend({

	tagName: "div",

	className: "ProjectCostPropetyContainer",

	template: _.templateUrl("/projects/tpls/project/cost/project.cost.property.html", true),

	events: {
		"click .projectCostNav .item": "navClick"
	},

	render: function() {

		this.$el.html(this.template);

		 
		if (App.AuthObj.project && App.AuthObj.project.cost) {

			var AuthCost = App.AuthObj.project.cost,
				$projectCostNav = this.$(".projectCostNav"),
				CostTpl = App.Comm.AuthConfig.Project.CostTab,
				$planContainer = this.$(".planContainer");


			//清单
			//if (AuthCost.list) {
			//	$projectCostNav.append(CostTpl.list);
				$planContainer.append(new App.Project.CostReference().render().el);
			//}

			//变更
			//if (AuthCost.change) {
			//	$projectCostNav.append(CostTpl.change);
				$planContainer.append(new App.Project.CostVerification().render().el);
			//}

			//校验
			//if (AuthCost.proof) {
			//	$projectCostNav.append(CostTpl.proof);
				$planContainer.append(new App.Project.CostChange().render().el);
			//}

			//属性
			//if (AuthCost.prop) {
			//	$projectCostNav.append(CostTpl.prop);
				$planContainer.append(new App.Project.CostProperties().render().el);
			//}

		}

		return this;
	},

	navClick: function(event) {

		var $target = $(event.target),
			type = $target.data("type");
		$target.addClass('selected').siblings().removeClass('selected');
		App.Project.Settings.property = type;

		if (type == "reference") {
			//清单\
			var $CostReference = this.$el.find(".CostReference");

			$CostReference.show().siblings().hide();

			if ($CostReference.find(".noLoading").length > 0) {
				App.Project.CostAttr.ReferenceCollection.reset();
				App.Project.CostAttr.ReferenceCollection.projectId = App.Project.Settings.projectId;
				App.Project.CostAttr.ReferenceCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
				App.Project.CostAttr.ReferenceCollection.fetch({
					success: function() {
						//this.$(".tbBodyScroll .tbBodyContent li:visible:odd").addClass("odd");
					}
				});
			}

		} else if (type == "change") {
			//变更
			var $CostChange = this.$el.find(".CostChange");

			$CostChange.show().siblings().hide();

			if ($CostChange.find(".noLoading").length > 0) {
				App.Project.CostAttr.ChangeCollection.reset();
				App.Project.CostAttr.ChangeCollection.fetch({
					data: {
						projectId: App.Project.Settings.projectId
					}
				});
			}


		} else if (type == "verification") {
			//检查

			var $CostVerification = this.$el.find(".CostVerification");

			$CostVerification.show().siblings().hide();

			if ($CostVerification.find(".noLoading").length > 0) {
				this.loadVerificationCollection();
			}

		} else if (type == "poperties") {
			//属性
			this.$el.find(".CostProperties").show().siblings().hide();
			//属性渲染
			App.Project.renderProperty();

		}
	},

	//加载 成本效验
	loadVerificationCollection() {

		var projectVersionId = App.Project.Settings.CurrentVersion.id,
			projectId = App.Project.Settings.projectId;

		App.Project.CostAttr.VerificationCollection.reset();
		App.Project.CostAttr.VerificationCollection.projectId = projectId;
		App.Project.CostAttr.VerificationCollection.projectVersionId = projectVersionId;
		App.Project.CostAttr.VerificationCollection.fetch();

		App.Project.CostAttr.VerificationCollectionCate.reset();
		App.Project.CostAttr.VerificationCollectionCate.projectId = projectId;
		App.Project.CostAttr.VerificationCollectionCate.projectVersionId = projectVersionId;
		App.Project.CostAttr.VerificationCollectionCate.fetch();

	}

});