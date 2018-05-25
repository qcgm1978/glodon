/**
 * @require /app/project/modelChange/js/comm.js
 * @require /app/project/modelChange/js/collection.js
 */

App.Index = {

	Settings: {
		type: "user",
		projectId: "",
		projectVersionId: "",
		ModelObj: "",
		currentModelId: "",
		comparisonType: "", //std 标准模型 base 基准版本
		Viewer: null
	},

	bindEvent() {

		var that = this,
			$projectContainer = $("#projectContainer");

		//切换属性tab
		$projectContainer.on("click", ".projectPropetyHeader .item", function() {

			App.Index.Settings.property = $(this).data("type");
			//属性
			if (App.Index.Settings.property == "attr") {
				that.renderAttr();
			}

			var index = $(this).index();
			$(this).addClass("selected").siblings().removeClass("selected");
			$(this).closest(".designPropetyBox").find(".projectPropetyContainer").children('div').eq(index).show().siblings().hide();
		});


		//收起 暂开 属性内容
		$projectContainer.on("click", ".modleShowHide", function() {
			$(this).toggleClass("down");
			var $modleList = $(this).parent().siblings(".modleList");
			$modleList.slideToggle();

		});


		//收起 暂开 属性 右侧
		$projectContainer.on("click", ".rightProperty .slideBar", function() {

			App.Comm.navBarToggle($("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", App.Index.Settings.Viewer);
		});
		//拖拽 属性内容 右侧
		$projectContainer.on("mousedown", ".rightProperty .dragSize", function(event) {
			App.Comm.dragSize(event, $("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", App.Index.Settings.Viewer);
		});

		this.bindTreeScroll();

		// 加载变更模型
		$(".showChange .checkboxGroup input:checkbox").on("change", function() {

			var changeModel = App.Index.Settings.changeModel;
			var viewer = App.Index.Settings.Viewer;
			var flag = $(this).prop("checked");
			if (App.Index.Settings.loadedModel) {
				viewer.showScene(App.Index.Settings.loadedModel, flag);
			} else {
				App.Index.Settings.loadedModel = viewer.load(changeModel);
			}
		});
	},

	initPars: function() {

		var Request = App.Index.GetRequest();
		App.Index.Settings.projectId = Request.projectId;
		App.Index.Settings.projectVersionId = Request.projectVersionId;
		App.Index.Settings.referenceId = Request.modificationId;
		App.Index.Settings.comparisonType = Request.type;
	},

	//获取url 参数
	GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},


	//获取模型id 渲染模型
	getModelId(differFileVersionId, callback) {

		var dataObj = {
			URLtype: "fetchFileModelIdByFileVersionId",
			data: {
				projectId: App.Index.Settings.projectId,
				projectVersionId: App.Index.Settings.projectVersionId,
				fileVersionId: differFileVersionId
			}
		}

		App.Comm.ajax(dataObj, callback);

	},

	//渲染模型
	renderModel(modelId) {
		var _this = this;
		var viewer = App.Index.Settings.Viewer = new bimView({
			type: 'singleModel',
			element: $("#contains .projectCotent"),
			etag: modelId
		});

		viewer.on("click", function(model) {
			App.Index.Settings.ModelObj = null;

			var viewer = App.Index.Settings.Viewer,
			    isIsolateState = viewer.isIsolate();
			if(isIsolateState){
				$('#isolation').show();
			}else{
				$('#isolation').hide();
			}

			var selectedIds = viewer.getSelectedIds();

			if (!model.intersect) {
                const selectElement = App.Local.getTranslation('drawing-model.SEt1')||'请选择构件';
                $("#projectContainer .designProperties").html(' <div class="nullTip">' +
                    selectElement +
                    '</div>');
				return;
			}
			else if (Object.keys(selectedIds).length > 1) {
                $('.designProperties').html('<div class="nullTip">' +
                    (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                    '</div>');
                return;
            }


			App.Index.Settings.ModelObj = model;
			//App.Project.Settings.modelId = model.userId;
			_this.renderAttr(modelId);

		});

		//加载完成后加载
		viewer.on("loaded", function() {

			$('#lockAxisZ').show();

			var viewer = App.Index.Settings.Viewer.viewer;
			var arrUUIDs = Object.keys(viewer.modelManager.models);
			if (arrUUIDs.length > 1) {
				var models = viewer.modelManager.models;
				if ((models[arrUUIDs[0]].numOfElements === 0) && (models[arrUUIDs[0]].rotation != undefined)) {
					//models[arrUUIDs[0]].rotation = models[arrUUIDs[1]].rotation;
					models[arrUUIDs[0]].rotation._x = -0.7071080798594735;  
					models[arrUUIDs[0]].rotation._w = 0.7071080798594735;
				}
			}

			if (!$(".showChange .checkboxGroup input:checkbox").prop('checked')) {
				$(".showChange .checkboxGroup input:checkbox").trigger('click');
			}
		});

		//主场景为空场景
		viewer.on("emptyScene", function() {

			$('#lockAxisZ').show();

			if (!$(".showChange .checkboxGroup input:checkbox").prop('checked')) {
				$(".showChange .checkboxGroup input:checkbox").trigger('click');
			}
		});

		this.Settings.currentModelId = modelId;
	},

	//渲染属性
	renderAttr(modelId) {

		modelId = modelId || this.Settings.currentModelId;

		if (!App.Index.Settings.ModelObj || !App.Index.Settings.ModelObj.intersect) {
			$("#projectContainer .designProperties").html(`<div class="nullTip">${App.Local.data['drawing-model'].SEt1||'请选择构件'}</div>`);
			return;
		}

		var url = "/sixD/" + App.Index.Settings.projectId + "/" + App.Index.Settings.projectVersionId + "/property";
		$.ajax({
			url: url,
			data: {
				elementId: App.Index.Settings.ModelObj.intersect.userId,
				sceneId: App.Index.Settings.ModelObj.intersect.userId.split('.')[0]
				//sceneId: modelId
			}
		}).done(function(data) {
			var template = _.templateUrl("/projects/tpls/project/design/project.design.property.properties.html");
			$("#projectContainer .designProperties").html(template(data.data));
		});

	},

	//树形的滚动条
	bindTreeScroll() {

		var $modelTree = $("#projectContainer  .projectModelContent");
		if (!$modelTree.hasClass('mCustomScrollbar')) {
			$modelTree.mCustomScrollbar({
				set_height: "100%",
				set_width: "100%",
				theme: 'minimal-dark',
				axis: 'xy',
				keyboard: {
					enable: true
				},
				scrollInertia: 0
			});
		}

		$modelTree.find(".mCS_no_scrollbar_y").width(800);

	},

	bindPoint: function(viewer) {
		var element = $("#projectContainer .projectModelContent");
		var data = {
			element: element,
			projectId: App.Index.Settings.projectId,
			viewer: viewer
		}
		App.Comm.managePoint(data);
	},

	fetchChange: function() {
		var that = this;
		App.Project.Collection.changeList.projectId = App.Index.Settings.projectId;
		App.Project.Collection.changeList.projectVersionId = App.Index.Settings.projectVersionId;
		App.Project.Collection.changeList.fetch();
		$(".rightPropertyContent .dropList").html(new App.Project.Model.changeList().render().el);
		//下拉 事件绑定
		$('.myDropDown').myDropDown({
			click: function($item) {
				var groupText = $item.closest(".groups").prev().text() + "：";
				$(".myDropDown .myDropText span:first").text(groupText);
				var currentModel = $item.data("currentmodel"),
					baseModel = $item.data("basemodel"),
					changeModel = $item.data("change").replace("_output", ""),
					comparisonId = $item.data('id');
				App.Index.Settings.currentModel = currentModel;
				App.Index.Settings.baseModel = baseModel;
				App.Index.Settings.comparisonId = comparisonId;


				App.Index.Settings.changeModel = changeModel;
				$('.checkboxGroup input').prop('checked', false);
				App.Index.Settings.loadedModel = null;
				that.renderModel(currentModel);
				$(".rightPropertyContent .listDetail").html(new App.Project.Model.getInfo().render().el);
				that.getDetail(comparisonId);
			}
		});

	},
	getDetail: function(comparisonId) {
		App.Project.Collection.changeInfo.projectId = App.Index.Settings.projectId;
		App.Project.Collection.changeInfo.projectVersionId = App.Index.Settings.projectVersionId;
		App.Project.Collection.changeInfo.comparisonId = comparisonId;
		App.Project.Collection.changeInfo.fetch();

	},

	//api 接口 初始化
	initApi(projectId, projectVersionId) {

		this.Settings.projectId = projectId;
		this.Settings.projectVersionId = projectVersionId;

		App.Project.Collection.changeList.urlType = "modelStd";

		this.Settings.type = "api";

		//初始化
		this.init();

	},


	init() {
		//ie
		if (App.Comm.isIEModel()) {
			return;
		}
		if(App.Comm.getCookie("isDemoEnv")!="yes"){
		    App.Comm.commentDragRenderHandle();//右侧拖拽按钮点击事件
		};
		//非api 调用
		if (this.Settings.type != 'api') {
			//初始化参数
			this.initPars();
		}

		//渲染模型
		//事件绑定
		this.bindEvent();

		if (App.Index.Settings.comparisonType) {
			//默认std 
			if (App.Index.Settings.comparisonType == "base") {
				App.Project.Collection.changeList.urlType = "modelBase";
				//获取版本中文名称
				$.ajax({
					url: "/platform/project/"+App.Index.Settings.projectId+"/version/"+App.Index.Settings.referenceId
				}).done(function(data){
					 
					if(data.code==0){
						if (data.data) {
						　App.Index.Settings.versionName = data.data.name; 
						}
					}
				})
			}
			//变更获取
			this.fetchChange();
		}

		//显示导航文字
		this.showNavBarText();

	},


	//显示导航文字
	showNavBarText: function() {
		var data = {
			URLtype: "fetchProjectDetail",
			data: {
				projectId: this.Settings.projectId,
				versionId: this.Settings.projectVersionId
			}
		};

		App.Comm.ajax(data, (data) => {
			if (data.code == 0) {
				data = data.data;
				$(".breadcrumbNav .project .text").text(data.projectName);
				$(".breadcrumbNav .projectVersion .text").text(data.name);

				//没有传参数 对比类型 不会加载
				if (!App.Index.Settings.comparisonType) {
					if (data.name != "初始版本") {
						App.Project.Collection.changeList.urlType = "modelBase";
					}
					//变更获取
					this.fetchChange();
				}

				var data1 = {
					URLtype: "fetchProjectDetail",
					data: {
						projectId: data.referenceId,
						versionId: data.referenceVersionId
					}
				};

				App.Comm.ajax(data1, (data) => {
					if (data.code == 0) {
						data = data.data;

						App.Index.Settings.comparisonName = data.name

					}
				});
			}
		});
	}
}


App.Project.Model = {

	changeList: Backbone.View.extend({

		tagName: "div",

		className: "myDropDown optionComm",

		events: {
			"click .myDropText": "openList",
		},

		initialize: function() {
			this.listenTo(App.Project.Collection.changeList, "add", this.addList);
		},

		template: _.templateUrl('/app/project/modelChange/tpls/fileList.html'),

		render: function() {
			this.$el.html("加载中...");
			return this;
		},

		addList: function(model) {

			var data = model.toJSON();
			var comparisonId = App.Index.Settings.referenceId;
			var isload = false;


			$.each(data.data, function(i, item) {
				$.each(item.comparisons, function(j, file) {

					if (file.comparisonId == comparisonId) {
						isload = true;
						$(".rightPropertyContent .listDetail").html(new App.Project.Model.getInfo().render().el);
						App.Index.getDetail(comparisonId);
						App.Index.Settings.currentModel = file.currentModel;
						App.Index.Settings.baseModel = file.baseModel;
						App.Index.Settings.changeModel = file.comparisonId;
						App.Index.renderModel(file.currentModel);
						data.selected = [i, j]

					}
				});
			});
			// 没有找到当前文件,默认加载第一个
			if (!isload && data.data.length > 0) {
				var file = data.data[0].comparisons[0];

				$(".rightPropertyContent .listDetail").html(new App.Project.Model.getInfo().render().el);
				App.Index.getDetail(file.comparisonId);
				App.Index.Settings.changeModel = file.comparisonId;
				App.Index.renderModel(file.currentModel);
				App.Index.Settings.currentModel = file.currentModel;
				App.Index.Settings.baseModel = file.baseModel;
				data.selected = [0, 0]
			}
			if (data.data.length > 0) {
				try {
					this.$el.html(this.template(data));
				} catch (e) {
					this.$el.html("数据加载错误");
				}
			} else {
				this.$el.html("没有变更")
			}
			return this;
		}

	}),

	getInfo: Backbone.View.extend({
		tagName: "ul",
		className: "tree-view rightTreeView",
		events: {
			"click .tree-text": "select",
			"click .link": "detail",
			"click .item-content": "openTree",
		},
		initialize: function() {
			this.listenTo(App.Project.Collection.changeInfo, "add", this.addDetail);
		},
		template: _.templateUrl('/app/project/modelChange/tpls/changeInfo.html'),
		render: function() {
			this.$el.html("加载中...");
			return this;
		},
		addDetail: function(model) {
			var data = model.toJSON(); 
			if (data.message == 'success' && data.data.length > 0) {
				this.$el.html(this.template(data));
				var editbefore = [],
					editafter = [],
					add = [],
					remove = [];
				for (var i = 0, obj; i < data.data.length; i++) {
					obj = data.data[i]['results'];
					for (var j = 0; j < obj.length; j++) {
						if (obj[j]['changeType'] == 1) {
							add.push(obj[j]['currentElementId']);
						} else if (obj[j]['changeType'] == 2) {
							remove.push(obj[j]['baseElementId']);

						} else if ((obj[j]['changeType'] == 8) || (obj[j]['changeType'] == 4)) {
							editafter.push(obj[j]['currentElementId']);
							editbefore.push(obj[j]['baseElementId']);

						}
					}
				}
				//setTimeout(function(){
				App.Index.Settings.Viewer.setOverrider('beforeEdit', editbefore);
				App.Index.Settings.Viewer.setOverrider('afterEdit', editafter);
				App.Index.Settings.Viewer.setOverrider('add', add);
				App.Index.Settings.Viewer.setOverrider('delete', remove);
				//},2000);

			} else {
				this.$el.html("没有变更");
			}

			return this;
		},
		openTree: function(event) {
			var that = $(event.target).closest('.item-content')
			that.toggleClass('open');
		},
		select: function() {
			var that = $(event.target).closest(".tree-text");
			var parent = $(".rightTreeView");
			var elementId = that.data('id');
			var baseId = that.data('base');
			//if (that.prev('.noneSwitch').length > 0) {
			//	if (that.is('.current')) {
			//		that.removeClass('current');
			//		App.Index.Settings.Viewer.highlight({
			//			type: "userId",
			//			ids: []
			//		});
			//	} else {
			//		parent.find('.current').removeClass('current');
			//		that.addClass('current');
			//		App.Index.Settings.Viewer.highlight({
			//			type: "userId",
			//			ids: [elementId, baseId]
			//		});
			//	}
			//	App.Index.Settings.Viewer.fit();
			//}

			//App.Index.Settings.Viewer.setOverrider('add');
			//App.Index.Settings.Viewer.setOverrider('beforeEdit');
			//App.Index.Settings.Viewer.setOverrider('afterEdit');
			//App.Index.Settings.Viewer.setOverrider('delete');

			//判断是新增，修改，删除
			//if (baseId && elementId) {
			//	//修改
			//
			//	App.Index.Settings.Viewer.setOverrider('beforeEdit', [baseId]);
			//	App.Index.Settings.Viewer.setOverrider('afterEdit', [elementId]);
			//} else if (baseId) {
			//	//删除
			//
			//	App.Index.Settings.Viewer.setOverrider('delete', [baseId]);
			//
			//} else {
			//	//新增
			//
			//	App.Index.Settings.Viewer.setOverrider('add', [elementId]);
			//}

			//zoomtobox
			$.ajax({
				url: "/sixD/" + App.Index.Settings.projectId + "/" + App.Index.Settings.projectVersionId + "/bounding/box?sceneId=" + (elementId ? elementId.split('.')[0] : baseId.split('.')[0]) + "&elementId=" + (elementId ? elementId : baseId)
			}).done(function(respone) {
				if (respone.code == 0) {
					var max = respone.data.max,
						min = respone.data.min,
						box1 = [
							[max.x, max.y, max.z],
							[min.x, min.y, min.z]
						];
					if (baseId) {
						if (!elementId) {
							return App.Index.Settings.Viewer.zoomToBox(box1);

						}
						$.ajax({
							url: "/sixD/" + App.Index.Settings.projectId + "/" + App.Index.Settings.projectVersionId + "/bounding/box?sceneId=" + baseId.split('.')[0] + "&elementId=" + baseId
						}).done(function(respone) {
							if (respone.code == 0) {
								var max = respone.data.max,
									min = respone.data.min;
								box1.push([max.x, max.y, max.z], [min.x, min.y, min.z]);
								App.Index.Settings.Viewer.zoomToBox(box1);

							}
						});
					} else {
						App.Index.Settings.Viewer.zoomToBox(box1);
					}


				}
			});

		},
		detail: function(e) {

			var $treetext = $(e.target).prev('.tree-text'),
				data = {
					type: $(e.target).data('type'),
					baseElementId: $treetext.data('base'),
					currentElementId: $treetext.data('id'),
					name: $treetext.text()
				};

			App.Index.alertWindow = new App.Comm.modules.Dialog({
				title: "",
				width: 560,
				height: 330,
				isConfirm: false,
				isAlert: false,
				message: new App.Project.Model.contrastInfo().render(data).el
			});

			$(".mod-dialog .wrapper .header").hide(); //隐藏头部
			//$(".alertInfo").html(alertInfo);
			$(".mod-dialog,.mod-dialog .wrapper .content").css({
				"min-height": "auto",
				padding: 0
			});

		}
	}),

	contrastInfo: Backbone.View.extend({
		tagName: "div",
		className: "contrastInfo",
		template: _.templateUrl('/app/project/modelChange/tpls/contrastInfo.html'),
		events: {
			"click .close": "close"
		},
		render: function(datas) {
			if (datas != undefined) {
				var data = {
						projectId: App.Index.Settings.projectId,
						projectVersionId: App.Index.Settings.projectVersionId,
						currentElementId: datas.currentElementId,
						baseElementId: datas.baseElementId,
						baseModel: App.Index.Settings.baseModel,
						currentModel: App.Index.Settings.currentModel
					},
					that = this;
				$.ajax({
					url: "/sixD/" + data.projectId + "/" + data.projectVersionId + "/comparison/property?baseModel=" + data.baseModel + "&currentModel=" + data.currentModel + "&baseElementId=" + data.baseElementId + "&currentElementId=" + data.currentElementId
				}).done(function(respone) {
					if (respone.code == 0) {
						that.$el.html(that.template({
							data: respone.data,
							type: datas.type,
							name: datas.name,
							versionname: $('.projectVersion .text').text()
						}));

					} else {
						alert('获取数据失败');
						App.Index.alertWindow.close();

					}
				});


			} else {
				this.$el.html(this.template({
					data: []
				}));
			}
			return this;
		},
		close: function() {
			App.Index.alertWindow.close();
		}
	})
};