// 开业验收 project.quality.property.openingAcceptance.es6

//开业验收
App.Project.QualityOpeningAcceptance = Backbone.View.extend({

	tagName: "div",

	className: "QualityOpeningAcceptance",

	currentDiseaseView:null,

	initialize: function() {
		this.listenTo(App.Project.QualityAttr.OpeningAcceptanceCollection, "add", this.addOne);
		this.listenTo(App.Project.QualityAttr.OpeningAcceptanceCollection, "reset", this.loading);
	},


	events: {
		"click .searchToggle": "searchToggle",
		"click .clearSearch": "clearSearch",
		"click .tbOpeningacceptanceBody tr": "showInModel",
		'click .resultStatusIcon':'showDiseaseList',
		'click .btnCk':'showSelectMarker'
		
	},


	//渲染
	render: function(options) {

		this.OpeningAcceptanceOptions = options.OpeningAcceptance;

		var tpl = _.templateUrl("/projects/tpls/project/quality/project.quality.property.openingAcceptance.html");
		this.$el.html(tpl);
		this.bindEvent();
		return this;

	}, 

	//开业验收过滤条件change事件
	changeOA(key,val){
		Backbone.trigger('qualityFilterDataChange','OpeningAcceptanceOptions',key,val);
	},

	//事件初始化
	bindEvent() {

		var that = this;

		this.$('.txtLocationName').change(function(){
			that.changeOA('locationName', $(this).val())
		})
		//隐患
		this.$(".riskOption").myDropDown({
			click: function($item) {
			//	that.OpeningAcceptanceOptions.problemCount = $item.data("status");
				that.changeOA('problemCount', $item.data("val"))
			}
		});
		this.$(".floorOption").myDropDown({
			click: function($item) {
				//	that.OpeningAcceptanceOptions.problemCount = $item.data("status");
				that.changeOA('floor', $item.data("val"))
			}
		});
		//类别
		this.$(".categoryOption").myDropDown({
			zIndex:20,
			click: function($item) {
				//that.OpeningAcceptanceOptions.category = $item.text();
				that.changeOA('category', $item.attr('data-val'))
			}
		});

		//状态
		this.$(".statusOption").myDropDown({
			click: function($item) {
			//	that.OpeningAcceptanceOptions.specialty = $item.text();
				that.changeOA('specialty', $item.attr('data-val'))
			}
		});

		//显示搜索结果对应位置
		this.$(".groupRadio").myRadioCk();
	},

	showSelectMarker(e){
		var bool = $(e.currentTarget).hasClass('selected');
		if(!bool)
		{
			App.Project.Settings.Viewer.loadMarkers();
			CommProject.recoverySilder(); /*add by wuweiwei at 2016-12-21*/
			return;
		}
		App.Project.isShowMarkers('open',$(e.currentTarget).hasClass('selected'));
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
		this.$(".riskOption .text").html('全部')
		this.$(".categoryOption .text").html('全部')
		this.$(".specialitiesOption .text").html('全部')
		this.$(".floorOption .text").html('全部')
		this.$(".txtLocationName").val('');
		Backbone.trigger('qualityFilterDataClear');
	},

	template: _.templateUrl("/projects/tpls/project/quality/project.quality.property.openingAcceptance.body.html"),

	//获取数据后处理
	addOne: function(model) {
		var data = model.toJSON();
		this.$(".tbOpeningacceptanceBody tbody").html(this.template(data));
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

		this.$(".tbOpeningacceptanceBody tbody").html(App.Project.Settings.loadingTpl);
		this.searchup();
	},

	//模型中显示
	showInModel(event) { 
 		App.Project.showInModel($(event.target).closest("tr"),0);   
	},

	showDiseaseList(event){
		App.Project.QualityAttr.showDisease(event,this,'open',2);// showDiseaseList
		event.stopPropagation();
	}
});