//project.quality.property.processAcceptance.es6 过程验收

//过程验收
App.Project.QualityProcessAcceptance = Backbone.View.extend({

	tagName: "div",

	className: "QualityProcessAcceptance",
	
	currentDiseaseView:null,

	initialize: function() {
		this.listenTo(App.Project.QualityAttr.ProcessAcceptanceCollection, "add", this.addOne);
		this.listenTo(App.Project.QualityAttr.ProcessAcceptanceCollection, "reset", this.loading);
	},


	events: {
		"click .searchToggle": "searchToggle",
		"click .clearSearch": "clearSearch",
		'click .resultStatusIcon':'showDiseaseList',
		"click .tbProcessAccessBody tr": "showInModel",
		'click .btnCk':'showSelectMarker'
	},

	//过程验收过滤条件change事件
	changePA(key,val){
		Backbone.trigger('qualityFilterDataChange','ProcessAcceptanceOptions',key,val);
	},
	//渲染
	render: function(options) {

		this.ProcessAcceptanceOptions = options.ProcessAcceptance;

		var tpl = _.templateUrl("/projects/tpls/project/quality/project.quality.property.processAcceptance.html");
		this.$el.html(tpl());
		this.bindEvent();
		return this;

	},
	showSelectMarker(e){
		var bool = $(e.currentTarget).hasClass('selected');
		if(!bool)
		{
			App.Project.Settings.Viewer.loadMarkers(); 
			CommProject.recoverySilder(); /*add by wuweiwei at 2016-12-21*/
			return;
		}
		App.Project.isShowMarkers('process',$(e.currentTarget).hasClass('selected'));
	},
	//事件初始化
	bindEvent() {
		var that = this;
		this.$('.txtLocationName').change(function(){
			that.changePA('locationName', $(this).val())
		})

		this.$(".floorOption").myDropDown({
			click: function($item) {
				//	that.OpeningAcceptanceOptions.problemCount = $item.data("status");
				that.changePA('floor', $item.data("val"))
			}
		});

		//隐患
		this.$(".riskOption").myDropDown({
			click: function($item) {
			//	that.ProcessAcceptanceOptions.problemCount = $item.data("status");
				that.changePA('problemCount', $item.data("val"))
			}
		});
		//列别
		this.$(".categoryOption").myDropDown({
			zIndex:20,
			click: function($item) {
			//	that.ProcessAcceptanceOptions.category = $item.text();
				that.changePA('category', $item.attr('data-val'))
			}
		});
		//显示搜索结果对应位置
		this.$(".groupRadio").myRadioCk();
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
	//清空搜索条件
	clearSearch() {
		this.$(".riskOption .text").html('全部');
		this.$(".specialitiesOption .text").html('全部');
		this.$(".categoryOption .text").html('全部');
		this.$(".floorOption .text").html('全部');
		this.$(".txtLocationName").val('');
		Backbone.trigger('qualityFilterDataClear');
	},

	template: _.templateUrl("/projects/tpls/project/quality/project.quality.property.processAcceptance.body.html"),

	//获取数据后处理
	addOne: function(model) {
		var data = model.toJSON();
		this.$(".tbProcessAccessBody tbody").html(this.template(data));
		this.bindScroll();
	},

	//绑定滚动条
	bindScroll() {

		var $materialequipmentListScroll = this.$(".materialequipmentListScroll");

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
	//加载
	loading() {

		this.$(".tbProcessAccessBody tbody").html(App.Project.Settings.loadingTpl);
		this.searchup();
	},

	//模型中显示
	showInModel(event) { 
		App.Project.showInModel($(event.target).closest("tr"),1);  
	},
	
	//显示隐患列表
	showDiseaseList(event){
		App.Project.QualityAttr.showDisease(event,this,'pro',1);// showDiseaseList
		event.stopPropagation();
	}
});