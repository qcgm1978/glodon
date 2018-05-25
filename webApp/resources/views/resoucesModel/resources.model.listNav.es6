App.ResourceModel.ListNav = Backbone.View.extend({

	tagName: "div",

	id: "navContainer",

	template: _.templateUrl("/resources/tpls/resourceModel/resource.model.listNav.html", true),

	initialize: function (options) {
		this.listenTo(App.ResourceModel.PropertiesCollection, "add", this.reRender);
		Backbone.on('navClickCB', this.navClickCB, this);
	},

	events: {
		"click .modleShowHide": "slideUpAndDown",
		"click .modelAttr .slideBar": "slideBarToggle",
		"mousedown .modelAttr .dragSize": "dragSize"
	},

	render: function () {

		this.$el.html(this.template);

		this.$el.find(".listContent").html(new App.ResourceModel.TopBar().render().el);

		var type = App.ResourcesNav.Settings.type;
		if (type == "standardLibs") {
			//获取标准模型库数据
			this.$el.find(".listContent").append(new App.ResourceModel.ListContent().render().el);

		} else if (type == "famLibs") {
			this.$el.find(".listContent").append(new App.ResourceModel.ThumContent().render().el);
		}


		return this;
	},

	//左侧试图
	navClickCB: function (type) {
		var _this = this;
		if (this.$el.closest('body').length <= 0) {
			this.remove();
			return;
		}

		if (type == "file") {

			this.$el.removeClass('hideLeft');
			this.$el.find(".listContent").show().end().find(".modelContentBox").hide().end().find(".modelAttr").hide();

			$("#resourceModelLeftNav").show();

			//绑定上传
			var status = App.ResourceModel.Settings.CurrentVersion.status;
			if (status != 9 && status != 4 && status != 7) {
				//上传
				App.ResourceUpload.init($(document.body));
				$("#file-upload-btn").removeClass('disable');
			} else {
				$("#file-upload-btn").addClass('disable');
			}

		} else {

			//销毁上传
			App.Comm.upload.destroy();

			$("#resourceModelLeftNav").hide();

			this.$el.addClass('hideLeft');

			this.$el.find(".listContent").hide().end().find(".modelContentBox").show().end().find(".modelAttr").show();


			if (App.ResourceModel.Settings.DataModel.bind) {
				return;
			}

			//设置onlymodel
			App.Comm.setOnlyModel();

			App.ResourceModel.Settings.DataModel.bind = true;

			if (App.ResourceModel && App.ResourceModel.Settings && App.ResourceModel.Settings.Viewer) {
				App.ResourceModel.Settings.Viewer.destroy();
				App.ResourceModel.Settings.Viewer = null;
			}

			App.ResourceModel.Settings.Viewer = new bimView({
				element: this.$el.find(".modelContent"),
				sourceId: App.ResourceModel.Settings.DataModel.sourceId,
				etag: App.ResourceModel.Settings.DataModel.etag, //"a1064f310fa8204efd9d1866ef7370ee" ||
				projectId: App.ResourceModel.Settings.CurrentVersion.projectId
			});
			//加载完成后加载
			App.ResourceModel.Settings.Viewer.on("loaded", function () {
				$('#lockAxisZ').show();
				$(".toolsBar > i.m-camera").css("color", "rgba(255,255,255,.2)");
				$(".toolsBar > i.m-camera").attr("data-noclick", true);
				$(".toolsBar > i.m-camera").removeClass('bar-item');
			});
			App.ResourceModel.Settings.Viewer.on("click", function (model) {
				var viewer = App.ResourceModel.Settings.Viewer,
					isIsolateState = viewer.isIsolate(),
					selectedIds = viewer.getSelectedIds();
				if (isIsolateState) {
					$('#isolation').show();
				} else {
					$('#isolation').hide();
				}
				const selectElement = (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件');
				if (!model.intersect) {
					if (selectedIds) {
						var obj;
						if (Object.keys(selectedIds).length == 1) {
							for (var i in selectedIds) {
								obj = {
									userId: i,
									sceneId: selectedIds[i]['sceneId']
								}
							}
							App.ResourceModel.PropertiesCollection.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
							App.ResourceModel.PropertiesCollection.projectVersionId = App.ResourceModel.Settings.CurrentVersion.id;
							App.ResourceModel.PropertiesCollection.fetch({
								data: {
									elementId: obj.userId,
									sceneId: obj.sceneId
								}
							});
						}
					} else {
						$("#navContainer .attrContent").html('<div class="nullTip">' +
							selectElement +
							'</div>');
					}
					return;
				} else if (Object.keys(selectedIds).length > 1) {
					$("#navContainer .attrContent").html('<div class="nullTip">' +
						selectElement +
						'</div>');
					return;
				}
				App.ResourceModel.PropertiesCollection.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
				App.ResourceModel.PropertiesCollection.projectVersionId = App.ResourceModel.Settings.CurrentVersion.id;
				var userSceneId = model.intersect.userId.split('.')[0];
				App.ResourceModel.PropertiesCollection.fetch({
					data: {
						elementId: model.intersect.userId,
						sceneId: userSceneId
					}
				});

			});
		}

	},
	reTemplate: _.templateUrl('/resources/tpls/resourceModel/resources.model.attr.detail.html'),
	resetProperNull: function () {//置空属性
		$("#navContainer .attrContent").html('<div class="nullTip">' +
			(App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
			'</div>');
	},
	//重新渲染苏醒
	reRender: function (model) {

		if (this.$el.closest('body').length <= 0) {
			this.remove();
			return;
		}
		//渲染数据
		var data = model.toJSON().data;
		this.$el.find(".attrContentBox .attrContent").html(this.reTemplate(data));
	},

	//展开和收起
	slideUpAndDown: function (event) {
		var $parent = $(event.target).parent(),
			$modleList = $parent.find(".modleList");
		$(event.target).toggleClass("down");
		if ($modleList.is(":hidden")) {
			$modleList.slideDown();
		} else {
			$modleList.slideUp();
		}

	},

	//收起展开
	slideBarToggle: function () {

		App.Comm.navBarToggle(this.$el.find(".modelAttr"), $("#navContainer"), "right", App.ResourceModel.Settings.Viewer);
	},

	//拖拽改变大小
	dragSize: function (event) {
		App.Comm.dragSize(event, this.$el.find(".modelAttr"), $("#navContainer"), "right", App.ResourceModel.Settings.Viewer);
		return false;
	}

});