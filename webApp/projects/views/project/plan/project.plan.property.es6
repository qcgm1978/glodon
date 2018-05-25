App.Project.ProjectPlanProperty = Backbone.View.extend({

	tagName: "div",

	className: "ProjectPlanPropertyContainer",

	template: _.templateUrl("/projects/tpls/project/plan/project.plan.nav.html", true),

	events: {
		"click .projectPlanNav .item": "navItemClick",
		"change .selDate": "changeDate",
		'change .dateStar':'loadPlanModelData',
		'change .dateEnd':'loadPlanModelData',
		'click .clearSearch':'clearSearch',
		"click .btnFilter": "loadPlanModelData"
	},

	planType:'1',

	businessName:'',

	render: function() {

		this.$el.html(this.template);

		 
		//if (App.AuthObj.project && App.AuthObj.project.plan) {

			// var Auth = App.AuthObj.project.plan,
			// 	$projectNav = this.$(".projectPlanNav"),
			// 	CostTpl = App.Comm.AuthConfig.Project.PlanTab,
			// 	$container = this.$(".planContainer");

			var $container = this.$(".planContainer");

			////模块化
			//if (Auth.modularization) {
			//	$projectNav.append(CostTpl.modularization);
				$container.append(new App.Project.PlanModel().render().el);
			//}

			//模拟
			//if (Auth.simulation) {
			//	$projectNav.append(CostTpl.simulation);
				$container.append(new App.Project.PlanAnalog().render().el);
			//}

			//关注
			//if (Auth.follow) {
			//	$projectNav.append(CostTpl.follow);
				$container.append(new App.Project.PlanPublicity().render().el);
			//}

			//效验
			//if (Auth.proof) {
			//	$projectNav.append(CostTpl.proof);
				$container.append(new App.Project.PlanInspection().render().el);
			//}

			//属性
			//if (Auth.prop) {
			//	$projectNav.append(CostTpl.prop);
				$container.append(new App.Project.PlanProperties().render().el);
			//}
		//}


		this.initDom();
		return this;
	},

	//初始化dom事件 
	initDom(){
		var _this=this;
		this.$('.planTimeType').myDropDown({
			click: function($item) {
				_this.planType=$item.attr('data-val');
			}
		});

		this.$('.txtBusinessName').on('change',function(){
			_this.businessName=$(this).val();
		});

		this.$('.dateStar1').datetimepicker({
             language: App.Local.getTimeLang(),
             autoclose: true,
             format: 'yyyy-mm-dd',
             minView: 'month'
         }).on("changeDate", function(ev) {
			var _dateStr=new Date(ev.date.getTime()+24*60*60*1000).format('yyyy-MM-dd');
			_this.$('.dateEnd1').datetimepicker('setStartDate',_dateStr);
			_this.$('.dateEnd1').val('');
		});
         this.$('.dateEnd1').datetimepicker({
             language: App.Local.getTimeLang(),
             autoclose: true,
             format: 'yyyy-mm-dd',
             minView: 'month'
         });

		this.$('.dateStar2').datetimepicker({			language: App.Local.getTimeLang(),
			autoclose: true,
			format: 'yyyy-mm-dd',
			minView: 'month'
		}).on("changeDate", function(ev) {
			var _dateStr=new Date(ev.date.getTime()+24*60*60*1000).format('yyyy-MM-dd');
			_this.$('.dateEnd2').datetimepicker('setStartDate',_dateStr);
			_this.$('.dateEnd2').val('');
		});
		this.$('.dateEnd2').datetimepicker({			language: App.Local.getTimeLang(),
			autoclose: true,
			format: 'yyyy-mm-dd',
			minView: 'month'
		});
         this.$(".dateBox .iconCal").click(function() {
			$(this).next().focus();
		});
	},

	loadPlanModelData(){
		var _start1=this.$('.dateStar1').val(),
			_end1=this.$('.dateEnd1').val(),
			_start2=this.$('.dateStar2').val(),
			_end2=this.$('.dateEnd2').val(),
			projectId = App.Project.Settings.projectId,
			projectVersionId = App.Project.Settings.CurrentVersion.id;

		_start1=_start1?new Date(_start1+' 00:00:00').getTime():'';
		_end1=_end1?new Date(_end1+' 23:59:59').getTime():'';
		_start2=_start2?new Date(_start2+' 00:00:00').getTime():'';
		_end2=_end2?new Date(_end2+' 23:59:59').getTime():'';
		App.Project.PlanAttr.PlanModelCollection.reset();
		App.Project.PlanAttr.PlanModelCollection.projectId = projectId;
		App.Project.PlanAttr.PlanModelCollection.projectVersionId = projectVersionId;
		App.Project.PlanAttr.PlanModelCollection.fetch({
			data:{
				startTime1:_start1,
				endTime1:_end1,
				startTime2:_start2,
				endTime2:_end2,
				type:this.planType,
				businessItem:this.businessName
			}
		});
	},

	clearSearch(){
		this.$('.dateStar1').val('');
		this.$('.dateEnd1').val('');
		this.$('.dateStar2').val('');
		this.$('.dateEnd2').val('');
		this.$('.planContainer .filterInputExtra').val('');
        const data = App.Local.getTranslation( "drawing-model.PInLS")||'计划开始';
        this.$('.planTimeType .text').html(data);
		this.businessName='';
		this.planType='1';
		this.loadPlanModelData();
	},
	//切换导航
	navItemClick: function(event) {

		var $target = $(event.target),
			type = $target.data("type"),
			projectVersionId = App.Project.Settings.CurrentVersion.id,
			projectId = App.Project.Settings.projectId ;
		$target.addClass('selected').siblings().removeClass('selected');
		App.Project.Settings.property = type;

		if (type == "model") {
			//碰撞

			var $planModel = this.$el.find(".planModel");

			$planModel.show().siblings().hide();

			if ($planModel.find(".noLoading").length > 0) {
				App.Project.PlanAttr.PlanModelCollection.reset();
				App.Project.PlanAttr.PlanModelCollection.projectId = projectId;
				App.Project.PlanAttr.PlanModelCollection.projectVersionId = projectVersionId;
				App.Project.PlanAttr.PlanModelCollection.fetch();
			}

		} else if (type == "analog") {
			//设计检查 

			var $planAnalog = this.$el.find(".planAnalog");

			$planAnalog.show().siblings().hide();

			if ($planAnalog.find(".noLoading").length > 0) {
				App.Project.PlanAttr.PlanAnalogCollection.reset();
				App.Project.PlanAttr.PlanAnalogCollection.projectId = projectId;
				App.Project.PlanAttr.PlanAnalogCollection.projectVersionId = projectVersionId;
				App.Project.PlanAttr.PlanAnalogCollection.fetch();
			}


		} else if (type == "publicity") {

			var $planPublicity = this.$el.find(".planPublicity");
			//关注
			$planPublicity.show().siblings().hide();

			if ($planPublicity.find(".noLoading").length > 0) {
				//计划关注列表
				this.loadPublicityData(projectId, projectVersionId);
			}

		} else if (type == "inspection") {
			//设计检查

			var $planInterest = this.$el.find(".planInterest");
			$planInterest.show().siblings().hide();

			if ($planInterest.find(".noLoading").length > 0) {
				this.loadPlanInspection(projectId, projectVersionId);
			}

		} else if (type == "poperties") {
			//属性

			this.$el.find(".planProperties").show().siblings().hide();
			//属性渲染
			App.Project.renderProperty();

		}

	},

	//改变时间 
	changeDate(event) {

		var $target = $(event.target),
			val=$target.val(),
			data={
				projectCode:App.Project.Settings.CurrentVersion.projectNo,
				type: val,
				userId:App.Comm.user('userId')
			};

		if(val == 4 || val == 2){
			App.Project.PlanAttr.PlanPublicityCollectionMonth.reset();
			App.Project.PlanAttr.PlanPublicityCollectionMonth.fetch({
				data: data
			});
		}
		if(val==3||val==1){
			App.Project.PlanAttr.PlanPublicityCollection.reset();
			App.Project.PlanAttr.PlanPublicityCollection.fetch({
				data: data
			});
		}
	},

	//加载计划关注列表
	loadPublicityData(projectId, projectVersionId, isEnd) {

		var weekType = 4,
			monthType = 3;
		if (isEnd) {
			weekType = 2;
			monthType = 1;
		}

		App.Project.PlanAttr.PlanPublicityCollection.reset();
		//App.Project.PlanAttr.PlanPublicityCollection.projectId = projectId;
		//App.Project.PlanAttr.PlanPublicityCollection.projectVersionId = projectVersionId;

		App.Project.PlanAttr.PlanPublicityCollection.fetch({
			data: {
				projectCode:App.Project.Settings.CurrentVersion.projectNo,
				type: monthType,
				userId:App.Comm.user('userId')
			}
		});

		App.Project.PlanAttr.PlanPublicityCollectionMonth.reset();
		//App.Project.PlanAttr.PlanPublicityCollectionMonth.projectId = projectId;
		//App.Project.PlanAttr.PlanPublicityCollectionMonth.projectVersionId = projectVersionId;

		App.Project.PlanAttr.PlanPublicityCollectionMonth.fetch({
			data: {
				projectCode: App.Project.Settings.CurrentVersion.projectNo,
				type: weekType,
				userId:App.Comm.user('userId')
			}
		});
	},

	//加载设计检查
	loadPlanInspection(projectId, projectVersionId) {

		App.Project.PlanAttr.PlanInspectionCollection.reset();
		App.Project.PlanAttr.PlanInspectionCollection.projectVersionId = projectVersionId;
		App.Project.PlanAttr.PlanInspectionCollection.projectId = projectId;
		App.Project.PlanAttr.PlanInspectionCollection.fetch();

		App.Project.PlanAttr.fetchPlanInspectionCate.reset();
		App.Project.PlanAttr.fetchPlanInspectionCate.projectVersionId = projectVersionId;
		App.Project.PlanAttr.fetchPlanInspectionCate.projectId = projectId;
		App.Project.PlanAttr.fetchPlanInspectionCate.fetch();

	}


});