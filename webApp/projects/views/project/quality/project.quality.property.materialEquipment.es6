//project.quality.property.materialEquipment.es6


//材料设备
App.Project.QualityMaterialEquipment = Backbone.View.extend({

	tagName: "div",

	className: "QualityMaterialEquipment",

	initialize: function() {

		this.listenTo(App.Project.QualityAttr.MaterialEquipmentCollection, "add", this.addOne);
		this.listenTo(App.Project.QualityAttr.MaterialEquipmentCollection, "reset", this.loading);
	},


	events: {
		"click .searchToggle": "searchToggle",
		"click .clearSearch": "clearSearch"

	},


	//渲染
	render: function(options) {

		this.MaterialEquipmentOptions = options.MaterialEquipmentOptions;

		var tpl = _.templateUrl("/projects/tpls/project/quality/project.quality.property.materialEquipment.html");

		this.$el.html(tpl());

		this.bindEvent();

		return this;

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
		this.$(".specialitiesOption .text").html('全部');
		this.$(".categoryOption .text").html('全部');
		this.$(".statusOption .text").html('全部');
		this.$(".txtSearchName").val('');
		this.$("#dateStar").val('');
		this.$("#dateEnd").val('');
		Backbone.trigger('qualityFilterDataClear');
	},
	//材料设备过滤条件change事件
	changeME(key,val){
		Backbone.trigger('qualityFilterDataChange','MaterialEquipmentOptions',key,val);
	},
	//事件绑定
	bindEvent: function() {

		var that = this;
		//专业
		this.$(".specialitiesOption").myDropDown({
			click: function($item) {
				//that.MaterialEquipmentOptions.specialty = $item.text();
				that.changeME('specialty',$item.attr('data-val'));
			}
		});

		//类别
		this.$(".categoryOption").myDropDown({
			click: function($item) {
			//	that.MaterialEquipmentOptions.category = $item.text();
				that.changeME('category',$item.attr('data-val'));
			}
		});


		this.$(".statusOption").myDropDown({
			click: function($item) {
				//that.MaterialEquipmentOptions.status = $item.data("status");
				that.changeME('status',$item.data("status"));
			}
		});

		this.$(".txtSearchName").blur(function() {
			//that.MaterialEquipmentOptions.name = $(this).val().trim();
			that.changeME('name',$(this).val().trim());
		});

	//	this.$("#dateStar").one("mousedown",function() { 
			//日期控件初始化
			this.$('#dateStar').datetimepicker({
				language: App.Local.getTimeLang(),
				autoclose: true,
				format: 'yyyy-mm-dd',
				minView: 'month'
			}).on("changeDate",function(ev){
				//that.MaterialEquipmentOptions.startTime = ev.date.format("yyyy-MM-dd");
				var _dateStr=new Date(ev.date.getTime()+24*60*60*1000).format('yyyy-MM-dd');
 				that.$('#dateEnd').datetimepicker('setStartDate',_dateStr);
 				that.$('#dateEnd').val(_dateStr);
				that.changeME('startTime', new Date(ev.date.format("yyyy-MM-dd")+ ' 00:00:00').getTime());
			});
	//	});

	//	this.$("#dateEnd").one("mousedown",function() {
			//日期控件初始化
			this.$('#dateEnd').datetimepicker({
				language: App.Local.getTimeLang(),
				autoclose: true,
				format: 'yyyy-mm-dd',
				minView: 'month'

			}).on("changeDate",function(ev){
				//that.MaterialEquipmentOptions.endTime = ev.date.format("yyyy-MM-dd");
				that.changeME('endTime',new Date(ev.date.format("yyyy-MM-dd")+ ' 23:59:59').getTime());
			});
	//	});



		this.$(".dateBox .iconCal").click(function() {
			$(this).next().focus();
		});

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

	template: _.templateUrl("/projects/tpls/project/quality/project.quality.property.materialEquipment.body.html"),

	//获取数据后处理
	addOne: function(model) {


		//移除重复监听
		if (this.$el.closest("body").length <= 0) {
			this.remove();
		}

		var data = model.toJSON();
		this.$(".tbMaterialequipmentBody tbody").html(this.template(data));

		this.bindScroll();

	},
	//加载
	loading() {

		this.$(".tbMaterialequipmentBody tbody").html(App.Project.Settings.loadingTpl);
		this.searchup();

	}


});