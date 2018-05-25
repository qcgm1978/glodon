App.Project.ProjectDesignPropety = Backbone.View.extend({

	tagName: "div",

	className: "designPropetyBox",

	template: _.templateUrl("/projects/tpls/project/design/project.design.propety.html"),

	events: {
		"click .projectPropetyHeader .item": "navItemClick",
		"click .btnFilter": "filterVerification",
		"click .ckBox tr": "showInModel"
			//	"click .clearSearch": "clearSearch"
	},

	initialize() {
		var _this = this;
		//监听子视图过滤参数change事件
		Backbone.on('projectDesignPropetyFilterDataChange', function(key, val) {
			_this.VerificationOptions[key] = val;
		}, this)
		Backbone.on('projectDesignPropetyFilterDataClear', function(key, val) {
			_this.clearSearch();
		}, this)

	},

	render: function() {

		this.$el.html(this.template);



		//if (App.AuthObj.project && App.AuthObj.project.design) {

		// var Auth = App.AuthObj.project.design,
		// 	$projectNav = this.$(".projectPropetyHeader"),
		// 	CostTpl = App.Comm.AuthConfig.Project.DesignTab,
		// 	$container = this.$(".projectNavContentBox");

		var  $container = this.$(".projectNavContentBox");

		//属性
		//if (Auth.prop) {
		//	$projectNav.append(CostTpl.prop);
		$container.append(new App.Project.DesignProperties().render().el);
		//}

		//碰撞
		//if (Auth.collision) {
		//	$projectNav.append(CostTpl.collision);
		$container.append(new App.Project.DesignCollision().render().el);
		//}

		//检查
		//if (Auth.check) {
		//	$projectNav.append(CostTpl.check);
		$container.append(new App.Project.DesignVerification().render({
			verOpts: this.VerificationOptions
		}).el);
		//}
		//}



		this.initVerificationOptions();


		return this;
	},

	//初始化设计检查产生
	initVerificationOptions() {
		this.VerificationOptions = {
			status: "", //	否	Integer	1：待整改；2：已整改；3：已关闭
			specialty: "", //	否	String	专业
			type: "", //	否	Integer	1：安全；2：功能；3：品质
			reporter: "", //	否	Integer	1：设计总包；2：第三方
			pageIndex: 1,
			pageItemCount: 400

		};
	},

	//切换tab
	navItemClick: function(event) {
		var $target = $(event.target),
			type = $target.data("type");
		$target.addClass('selected').siblings().removeClass('selected');
		App.Project.Settings.property = type;


		if (type == "collision") {
			//碰撞
			this.$el.find(".detailList").show().siblings().hide();
			$('.detailList .currColl').trigger('click');
		} else if (type == "verifi") {

			//设计检查  

			var $designVerification = this.$el.find(".designVerification");

			$designVerification.show().siblings().hide();

			if ($designVerification.find(".noLoading").length > 0) {
				this.getVerificationData();
			}


		} else if (type == "poperties") {

			//属性 
			this.$el.find(".designProperties").show().siblings().hide();
			//属性渲染
			App.Project.renderProperty();

		}
	},

	//获取 设计检查数据
	getVerificationData() {
		App.Project.DesignAttr.VerificationCollection.reset();
		App.Project.DesignAttr.VerificationCollection.projectId = App.Project.Settings.projectId;
		App.Project.DesignAttr.VerificationCollection.versionId = App.Project.Settings.CurrentVersion.id;
		App.Project.DesignAttr.VerificationCollection.fetch({
			data: this.VerificationOptions
		});
	},

	//筛选设计检查
	filterVerification() {
		this.getVerificationData();
	},

	clearSearch: function() {
		this.initVerificationOptions();
		this.getVerificationData();
	},

	//设计检查点关联构件
	showInModel(e) {

		var $target = $(e.currentTarget),
			_keyId = $target.data('id'),//主键ID
			ids=$target.data('userId'),
			box=$target.data('box'); 
		$target.parent().find('tr').removeClass('selected');
		$target.addClass('selected');
		//判断是否取过
		if (box && ids) {
			App.Project.zoomModel(ids,box);
			return;
		}
		App.Comm.ajax({
			URLtype: 'fetchDesignCheckPointMapParam',
			data: {
				projectId: App.Project.Settings.CurrentVersion.projectId,
				projectVersionId: App.Project.Settings.CurrentVersion.id,
				id: _keyId
			}
		}, function(res) {

			if (res.code == 0) {

				var _data = res.data;

				if (_data) {
					var location = JSON.parse(_data.location),
						bbox=location.bBox||location.boundingBox;
					if(bbox){
						box = App.Project.formatBBox(bbox);
						ids=[location.userId||location.componentId];
						$target.data("userId", ids);
						$target.data("box", box);
						App.Project.zoomModel(ids,box);
					}
					//	_this.showMarks([_data.location]);

				}
			}
		})
	}


});