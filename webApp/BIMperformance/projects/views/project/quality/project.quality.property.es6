App.Project.ProjectQualityProperty = Backbone.View.extend({

	tagName: "div",

	className: "ProjectQualityNavContainer",

	template: _.templateUrl("/projects/tpls/project/quality/project.quality.property.html", true),

	events: {
		"click .projectQualityNav .item": "navClick",
		"click .paginationBottom .pageInfo .next": "nextPage",
		"click .paginationBottom .pageInfo .prev": "prevPage",
		"click .btnFilter": "filterData",
	//	"click .clearSearch": "clearSearch",
		"click .diseaseItem": "diseaseItemLinkClick"
	},

	initialize(){
		var _this=this;
		Backbone.on('qualityFilterDataChange',function(obj,key,val){
			_this[obj][key]=val;
		},this)
		Backbone.on('qualityFilterDataClear',function(){
			_this.clearSearch();
		},this)
	},

	render: function() {

		this.$el.html(this.template);



		if (App.AuthObj.project && App.AuthObj.project.quality) {

			var Auth = App.AuthObj.project.quality,
				$projectNav = this.$(".projectQualityNav"),
				CostTpl = App.Comm.AuthConfig.Project.QualityTab,
				$container = this.$(".qualityContainer");

			//材料设备
			//if (Auth.material) {
			//	$projectNav.append(CostTpl.material);
				$container.append(new App.Project.QualityMaterialEquipment().render({
					MaterialEquipmentOptions: this.MaterialEquipmentOptions
				}).el);
			//}

			//过程验收
			//if (Auth.processAcceptanc) {
			//	$projectNav.append(CostTpl.processAcceptanc);
				$container.append(new App.Project.QualityProcessAcceptance().render({
					ProcessAcceptance: this.ProcessAcceptanceOptions
				}).el);
			//}

			//开业验收
			//if (Auth.openAcceptance) {
			//	$projectNav.append(CostTpl.openAcceptance);
				$container.append(new App.Project.QualityOpeningAcceptance().render({
					OpeningAcceptance: this.OpeningAcceptanceOptions
				}).el);
			//}

			//隐患
			//if (Auth.latentDanger) {
			//	$projectNav.append(CostTpl.latentDanger);
				$container.append(new App.Project.QualityConcerns().render({
					Concerns: this.ConcernsOptions
				}).el);
			//}

			//属性
			//if (Auth.prop) {
			//	$projectNav.append(CostTpl.prop);
				$container.append(new App.Project.QualityProperties().render().el);
			//}
		}



		this.initOptions();


		return this;
	},

	//过程v开业 隐患 顶啊及
	diseaseItemClick(event) { 
		var data = $(event.target).closest("li").data("location");
		data=JSON.stringify(data);
		App.Project.Settings.Viewer.loadMarkers([data]); 
		event.stopPropagation(); 
	},

	//过程、开业验收-隐患列表关联构件
	diseaseItemLinkClick(event) { 
		var _$target=$(event.target).closest("li"),
			data = _$target.data("location");
		data=JSON.stringify(data);
		App.Project.showInModel( _$target,2);  
	//	App.Project.Settings.Viewer.loadMarkers([data]); 
		event.stopPropagation(); 
	},

	//切换tab
	navClick: function(event) {
		var $target = $(event.target),
			type = $target.data("type"),
			isLoadData = false;
		$target.addClass('selected').siblings().removeClass('selected');
		App.Project.Settings.property = type;


		if (type == "materialequipment") {
			//材料设备
			var $QualityMaterialEquipment = this.$el.find(".QualityMaterialEquipment");

			$QualityMaterialEquipment.show().siblings().hide();

			if ($QualityMaterialEquipment.find(".noLoading").length > 0) {
				isLoadData = true;
			}
			App.Project.isShowMarkers('other');
		} else if (type == "processacceptance") {
			//过程验收
			var $QualityProcessAcceptance = this.$el.find(".QualityProcessAcceptance");

			$QualityProcessAcceptance.show().siblings().hide();

			if ($QualityProcessAcceptance.find(".noLoading").length > 0) {
				isLoadData = true;
			}
			App.Project.isShowMarkers('process',$QualityProcessAcceptance.find('.btnCk').hasClass('selected'));
			App.Project.currentQATab='process';
		} else if (type == "openingacceptance") {
			//开业验收

			var $QualityOpeningAcceptance = this.$el.find(".QualityOpeningAcceptance");

			$QualityOpeningAcceptance.show().siblings().hide();

			if ($QualityOpeningAcceptance.find(".noLoading").length > 0) {
				isLoadData = true;
			}
			App.Project.isShowMarkers('open',$QualityOpeningAcceptance.find('.btnCk').hasClass('selected'));
		} else if (type == "concerns") {
			//隐患

			var $QualityConcerns = this.$el.find(".QualityConcerns");

			$QualityConcerns.show().siblings().hide();

			if ($QualityConcerns.find(".noLoading").length > 0) {
				isLoadData = true;
			}
			App.Project.isShowMarkers('dis',$QualityConcerns.find('.btnCk').hasClass('selected'));
		} else if (type == "poperties") {
			//属性
			//App.Project.isShowMarkers('pro');
			this.$el.find(".QualityProperties").show().siblings().hide();
		}

		if (type !== "poperties") {
			if (isLoadData) {
				this.getData(1);
			}

		} else {
			App.Project.renderProperty();
		}

	},

	//初始化参数
	initOptions() {
		this.initOptionsMaterialEquipment();
		this.initOptionsProcessAcceptance();
		this.initOptionsOpeningAcceptance();
		this.initOptionsConcerns();
	},

	//初始化 材料设备
	initOptionsMaterialEquipment() {
		this.MaterialEquipmentOptions = {
			specialty: "", //专业
			category: "", //类别
			status: "", //	状态：1，合格 2，不合格
			name: "", //	名称
			startTime: "", //查询时间范围：开始
			endTime: "", //查询时间范围：结束
			pageIndex: 1, //第几页，默认第一页
			pageItemCount: App.Comm.Settings.pageItemCount //页大小
		};
	},

	//初始化 过程验收
	initOptionsProcessAcceptance() {
		this.ProcessAcceptanceOptions = {
			locationName:'',
			floor:'',
			category: "", //类别 
			problemCount: "", // 无隐患 1， 有隐患 
			pageIndex: 1, //第几页，默认第一页
			pageItemCount: App.Comm.Settings.pageSize //页大小
		};
	},

	//初始化 开业验收
	initOptionsOpeningAcceptance() {
		this.OpeningAcceptanceOptions = {
			locationName:'',
			floor:'',
			specialty: "", //专业
			category: "", //类别 
			problemCount: "", // 无隐患 1， 有隐患 
			pageIndex: 1, //第几页，默认第一页
			pageItemCount: App.Comm.Settings.pageSize //页大小
		};
	},

	//初始化 隐患
	initOptionsConcerns() {
		this.ConcernsOptions = {
			category: "", //类别
			type: "", //类型
			status: "", //状态 1:待整改 2:已整改 3:已关闭
			level: "", //等级 1:一般 2:较大 3:重大 4:特大
			reporter: "", //填报人
			startTime: "", //查询时间范围：开始
			endTime: "", //查询时间范围：结束
			pageIndex: 1, //第几页，默认第一页
			pageItemCount: App.Comm.Settings.pageSize //页大小
		};
	},

	getDataFromCache(pageIndex){

		var type = App.Project.Settings.property,
			pageSize = App.Comm.Settings.pageItemCount,
			that = this,
			projectId = App.Project.Settings.projectId,
			projectVersionId = App.Project.Settings.CurrentVersion.id;

		if (type == "materialequipment") {

			this.MaterialEquipmentOptions.pageIndex = pageIndex;
			//材料设备
			App.Project.QualityAttr.MaterialEquipmentCollection.reset();
			App.Project.QualityAttr.MaterialEquipmentCollection.projectId = projectId;
			App.Project.QualityAttr.MaterialEquipmentCollection.projectVersionId = projectVersionId;
			App.Project.QualityAttr.MaterialEquipmentCollection.fetch({
				data: that.MaterialEquipmentOptions,
				success: function(data) {
					that.pageInfo.call(that, data,type);
				}

			});

		} else if (type == "processacceptance") {
			this.ProcessAcceptanceOptions.pageIndex = pageIndex;
			//过程验收
			App.Project.QualityAttr.ProcessAcceptanceCollection.reset();
			var data=App.Project.catchPageData('process',{
				pageNum:pageIndex
			})
			App.Project.QualityAttr.ProcessAcceptanceCollection.push({data:data});
			that.pageInfo.call(that, data,type,true);
		} else if (type == "openingacceptance") {
			this.OpeningAcceptanceOptions.pageIndex = pageIndex;
			//开业验收
			App.Project.QualityAttr.OpeningAcceptanceCollection.reset();
			var data=App.Project.catchPageData('open',{
				pageNum:pageIndex
			})
			App.Project.QualityAttr.OpeningAcceptanceCollection.push({data:data});
			that.pageInfo.call(that, data,type,true);

		} else if (type == "concerns") {
			this.ConcernsOptions.pageIndex = pageIndex;
			//隐患
			App.Project.QualityAttr.ConcernsCollection.reset();
			var data=App.Project.catchPageData('dis',{
				pageNum:pageIndex
			})
			App.Project.QualityAttr.ConcernsCollection.push({data:data});
			that.pageInfo.call(that, data,type,true);
		}

	},

	//获取材料设备
	getData(pageIndex, projectId, projectVersionId) {

		var type = App.Project.Settings.property,
			pageSize = App.Comm.Settings.pageItemCount,
			that = this,
			projectId = App.Project.Settings.projectId,
			projectVersionId = App.Project.Settings.CurrentVersion.id;

		if (type == "materialequipment") {

			this.MaterialEquipmentOptions.pageIndex = pageIndex;
			//材料设备
			App.Project.QualityAttr.MaterialEquipmentCollection.reset();
			App.Project.QualityAttr.MaterialEquipmentCollection.projectId = projectId;
			App.Project.QualityAttr.MaterialEquipmentCollection.projectVersionId = projectVersionId;
			App.Project.QualityAttr.MaterialEquipmentCollection.fetch({
				data: that.MaterialEquipmentOptions,
				success: function(data) {
					that.pageInfo.call(that, data,type);
				}

			});

		} else if (type == "processacceptance") {
			this.ProcessAcceptanceOptions.pageIndex = pageIndex;
			//过程验收
			App.Project.QualityAttr.ProcessAcceptanceCollection.reset();
			App.Project.QualityAttr.ProcessAcceptanceCollection.projectId = projectId;
			App.Project.QualityAttr.ProcessAcceptanceCollection.projectVersionId = projectVersionId;

			if(that.ProcessAcceptanceOptions.category){
				App.Project.currentProsCat=App.Project.mapData.processCategory[that.ProcessAcceptanceOptions.category];
				App.Project.currentProsCheckFloor=that.ProcessAcceptanceOptions.floor;
			}

			App.Project.QualityAttr.ProcessAcceptanceCollection.fetch({
				data: that.ProcessAcceptanceOptions,
				success: function(data) {
					that.pageInfo.call(that, data,type);
				}
			});
		} else if (type == "openingacceptance") {
			this.OpeningAcceptanceOptions.pageIndex = pageIndex;
			//开业验收
			App.Project.QualityAttr.OpeningAcceptanceCollection.reset();
			App.Project.QualityAttr.OpeningAcceptanceCollection.projectId = projectId;
			App.Project.QualityAttr.OpeningAcceptanceCollection.projectVersionId = projectVersionId;
			if(that.OpeningAcceptanceOptions.category){
				App.Project.currentOpenCat=App.Project.mapData.processCategory[that.OpeningAcceptanceOptions.category];
				App.Project.currentOpenCheckFloor=that.OpeningAcceptanceOptions.floor;
				if('外保温、幕墙、钢结构悬挑构件'.indexOf(App.Project.currentOpenCat)!=-1){
					App.Project.currentOpenCheckFloor=App.Project.currentOpenCheckFloor+','+'其它';
				}
			}

			App.Project.QualityAttr.OpeningAcceptanceCollection.fetch({
				data: that.OpeningAcceptanceOptions,
				success: function(data) {

					that.pageInfo.call(that, data,type);
				}
			});

		} else if (type == "concerns") {
			this.ConcernsOptions.pageIndex = pageIndex;
			//隐患
			App.Project.QualityAttr.ConcernsCollection.reset();
			App.Project.QualityAttr.ConcernsCollection.projectId = projectId;
			App.Project.QualityAttr.ConcernsCollection.projectVersionId = projectVersionId;
			App.Project.QualityAttr.ConcernsCollection.fetch({
				data: that.ConcernsOptions,
				success: function(data) {
					that.pageInfo.call(that, data,type);
				}
			});

		}

	},


	//下一页
	nextPage(event) {

		if ($(event.target).hasClass("disable")) {
			return;
		}
		var $el = this.getContainer();
		var next = +$el.find(".paginationBottom .pageInfo .curr").text() + 1;

		var type=App.Project.Settings.property;
		if(type == "processacceptance"||type == "openingacceptance"||
			type=="concerns") {
			this.getDataFromCache(next);
		} else{
			this.getData(next);
		}
	},

	//上一页
	prevPage(event) {
		if ($(event.target).hasClass("disable")) {
			return;
		}
		var $el = this.getContainer();
		var prev = +$el.find(".paginationBottom .pageInfo .curr").text() - 1;
		var type=App.Project.Settings.property;
		if(type == "processacceptance"||type == "openingacceptance"||
			type=="concerns") {
			this.getDataFromCache(prev);
		} else{
			this.getData(prev);
		}
	},

	//帅选
	filterData() {

		this.getData(1);
	},

	//清空帅选
	clearSearch() {

		var type = App.Project.Settings.property;

		if (type == "materialequipment") {
			this.initOptionsMaterialEquipment();
		} else if (type == "processacceptance") {
			this.initOptionsProcessAcceptance();
		} else if (type == "openingacceptance") {
			this.initOptionsOpeningAcceptance();

		} else if (type == "concerns") {
			this.initOptionsConcerns();
		}
		this.getData(1);
	},

	getContainer(tabType) {
		var type = tabType||App.Project.Settings.property;
		var $el;
		if (type == "materialequipment") {
			//材料设备
			$el = this.$el.find(".QualityMaterialEquipment");

		} else if (type == "processacceptance") {
			//过程验收
			$el = this.$el.find(".QualityProcessAcceptance");

		} else if (type == "openingacceptance") {
			//开业验收
			$el = this.$el.find(".QualityOpeningAcceptance");


		} else if (type == "concerns") {
			//隐患
			$el = this.$el.find(".QualityConcerns");
		}
		return $el;
	},

	//分页信息
	pageInfo(data,type,isObject) {

		var $el = this.getContainer(type);
		if(!isObject){
			data = data.toJSON()[0].data;
		}
		$el.find(".paginationBottom .sumCount .count").text(data.totalItemCount);
		$el.find(".paginationBottom .pageInfo .curr").text(data.pageIndex);
		$el.find(".paginationBottom .pageInfo .pageCount").text(data.pageCount);

		if (data.pageIndex == 1) {
			$el.find(".paginationBottom .pageInfo .prev").addClass('disable');
		} else {
			$el.find(".paginationBottom .pageInfo .prev").removeClass('disable');
		}

		if (data.pageIndex >= data.pageCount) {
			$el.find(".paginationBottom .pageInfo .next").addClass('disable');
		} else {
			$el.find(".paginationBottom .pageInfo .next").removeClass('disable');
		}
	}


});