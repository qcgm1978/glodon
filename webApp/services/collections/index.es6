//服务
App.Services = {
	formData: {
		moduleType: "",
		entityType: "",
		opTime: "",
		entityName: "",
		operator: "",
		opContent: "",
		opTimeStart: "",
		opTimeEnd: "",
		orderName: "",
		orderSort: ""
	},
	DefaultSettings: {
		type: ""
	},

	//初始化
	init(type, tab) {
		this.Settings = $.extend({}, this.DefaultSettings);
		this.Settings.type = type;
		this.Settings.tab = tab;
		if (type) {
			var viewer;
			if (type == "auth") {
				//权限管理
				viewer = new App.Services.Auth();
			} else if (type == "project") {
				//项目管理
				viewer = new App.Services.Project();
			} else if (type == "application") {
				//应用管理
				viewer = new App.Services.Application();

			} else if (type == "system") {
				//系统管理
				viewer = new App.Services.System();
			} else if (type == "log") {
				// 日志管理
				viewer = new App.Services.Log();
			} else if (type == "workbook") {
				//操作手册
				viewer = new App.Services.WorkBook();
			} else if (type == "issue") {
				//问题反馈
				viewer = new App.Services.Issue();
			} else if (type == "more") {
				viewer = new App.Services.More();
				$(document.getElementsByTagName("body")[0]).html(viewer.render().el);
				$(document.getElementsByTagName("body")[0]).append('<link rel="styleSheet" href="/static/dist/comm/comm_20160313.css?t=' + App.time + '"/>');
				App.Comm.commentDragRenderHandle(); //右侧拖拽按钮点击事件
				// viewer.bindEvent();
				return;
			}

			$("#contains").html(viewer.render().el);
			$("#pageLoading").hide();
			if (type == "project") {
				App.Comm.initScroll($('#contains .scrollWrap'), "y");
			}
		} else {
			var indexTpl = _.templateUrl('/services/tpls/index.html');
			$("#contains").html(indexTpl);
			//设置权限
			this.setAuth();
			$("#pageLoading").hide();
			this.initEvent();
			this.loadXW();
			this.getResListHandle(); //获取首页五条资源列表
			this.getOnlineLinkHandle(); //获取在线培训的链接地址
		}

	},
	getOnlineLinkHandle() { //获取在线培训的链接地址
		var data = {
			URLtype: "getOnLineLink",
		}
		App.Comm.ajax(data, function (response) {
			if (response.code == 0) {
				var onlineBtn = $("#onlineBtn");
				var data = response.data;
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i].name == "在线培训") {
						onlineBtn.attr("href", data[i].url);
						break
					}
				}
			}
		});
	},
	getResListHandle() { //获取首页五条资源列表
		if (App.Services.DefaultSettings.MoreIndex) {
			App.Services.DefaultSettings.MoreIndex.remove();
		}
		App.Services.DefaultSettings.MoreIndex = new App.Services.MoreIndex();
		$("#resourceList").html(App.Services.DefaultSettings.MoreIndex.render().el);
	},
	noticeInit(noticeId) { //公告打开新页面预览
		viewer = new App.Services.PreviewNotice();
		$("#contains").html(viewer.render(noticeId).el);
		$("#pageLoading").hide();
	},
	initEvent: function () {
		$('.tileIcon').on('click', function () {
			var name = $(this).attr('name');
			if (name == 'suggest') {
				App.Comm.feedbackDialogHandle(); //建议反馈弹出层方法
				// App.Services.SuggestView.init();
			}
		})

		// $('ul.resourceList a').on('click',function(){
		// 	var id=$(this).data('id');
		// 	window.open(id,'_blank');
		// })
	},

	loadXW: function () {
		if (window['$ibot']) {
			App.Services.initXW();
			return
		}
		$("<link>")
			.attr({
				rel: "stylesheet",
				type: "text/css",
				href: "http://xiaowan.wanda.cn/wdrobot/rjfiles/css/robot.css"
			})
			.appendTo("head");
		$.getScript('http://xiaowan.wanda.cn/wdrobot/rjfiles/js/robot.js', function (a) {
			App.Services.initXW();
		});
	},
	//初始化小万机器人
	initXW: function () {
		//设计角色：4F88E20D-BD8F-43E2-857B-A94F5828662D
		//计划角色：C2E3CC70-7481-403D-8554-87F2B8501D16
		//成本角色：17EBA967-A8FF-475D-B9C4-1B7E4AB71692
		//质量角色：9CBE6DC9-7DAC-4A9B-89D1-0F7C68EECB80
		var key = 'C2E3CC70-7481-403D-8554-87F2B8501D16';
		var welcomeQuestion = 'C2E3CC70-7481-403D-8554-87F2B8501D16';
		var remindMsg = App.Local.getTranslation('online-service.Dn') || '输入文字提问';
		var inputTooLongMsg = '输入过长';
		$ibot.run('small-robot-div', null, (App.Local.data['online-service'].XW || '小万'), key, welcomeQuestion, remindMsg, inputTooLongMsg, {
			'width': $("#robotDiv").width() - 400,
			'height': $("#contains").height() - 36,
			'btnWidth': 70,
			'btnHeight': 30,
			'inputDivHeight': 75,
			'toolbarDivHight': 40,
			'toolbarContentDivHeight': 35,
			'toolbarContentDivWidth': 150,
			'toolbarContentDivMarginLeft': 20,
			'inputLength': 100,
			// 为解决跨域问题，这里在hosts配置了127.0.0.1为ibot.xiaoi.com,在访问页面的时候可以用127.0.0.1
			'robotAskUrl': 'http://xiaowan.wanda.cn/wdrobot/appAsk?t=' + new Date().getTime(),
			'robotQuestionUrl': 'http://xiaowan.wanda.cn/wdrobot/appQuestion?t=' + new Date().getTime()
		});

		$(window).resize(function () {
			var url = window.location.href;
			if (url == "http://bim.wanda-dev.cn/#services") {
				//window.location.reload();
			}
		});
	},

	//权限设置
	setAuth() {
		var $serviceNav = $(".servicesIndexBox .servicesIndex"),
			user = JSON.parse(localStorage.user || "{}"),
			isKeyUser = user.isKeyUser || false,
			_AuthObj = App.AuthObj || {};

		if (_AuthObj && !_AuthObj.service) {
			$serviceNav.remove();
		} else {
			var Auth = _AuthObj.service || {};

			if (!Auth.app) {
				$serviceNav.find(".application").remove();
			}

			if (!Auth.auth && !isKeyUser) {
				$serviceNav.find(".notice").remove();
			}

			if (!Auth.log) {
				$serviceNav.find(".log").remove();
			}

			if (!Auth.operationManual) {
				$serviceNav.find(".workbook").remove();
			}

			if (!Auth.sys) {
				$serviceNav.find(".systen").remove();
			}

			if (!Auth.project) {
				$serviceNav.find(".project").remove();
			}
		}
		//判断是否是空页面
		this.isNullPage();
	},

	isNullPage() {

		var $page = $(".servicesIndexBox");
		//空页面
		if ($page.find(".item").length <= 0) {
			$page.html(_.templateUrl('/services/tpls/nullPage.html'), true);
		}

	},

	logData: {
		moduleType: ["项目", "族库", "标准模型", "权限管理", "项目管理", "应用管理", "系统管理", "图纸模型", "建议反馈"],
		leibiexiangType: ["文件浏览器", "模型", "业务流程", "成员管理", "角色管理", "关键用户", "数据权限", "项目映射", "业务类别", "扩展属性管理", "批注", "应用管理"]
	},

	logCollection: new (Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function () {
				return {
					url: ''
				}
			}
		}),

		urlType: "fetchLog",

		parse: function (response) {
			if (response.message == "success") {
				if (response.data.items && response.data.items.length) {
					App.Services._cache = response.data.items || [];
					return response.data.items;
				} else {
					Backbone.trigger('servicesListNullData');
					return [];
				}
			}
		}


	})),

	Settings: {
		projectId: "",
		projectName: "",
		type: "list",
		isInitMap: false,
		initBodyEvent: false,
		pageIndex: 1
	},

	//加载数据
	loadData: function (params) {

		var _data = {
			name: "",
			projectType: "", //项目类型
			estateType: "", //项目模式
			province: "", //所属省份
			region: "", //分区
			complete: "", //是否完成
			open: "", //是否开业
			openTimeStart: "",
			openTimEnd: "",
			pageIndex: App.Services.Settings.pageIndex,
			pageItemCount: App.Comm.Settings.pageItemCount

		};
		//初始化用户参数
		_data = $.extend({}, _data, params);
		$("#logModes .proListBox").empty(); //清空数据
		App.Services.logCollection.reset();
		App.Services.logCollection.project = "project";

		//拉取数据
		App.Services.logCollection.fetch({

			data: _data,

			success: function (collection, response, options) {
				$("#pageLoading").hide();
				var $content = $("#logModes"),
					pageCount = response.data.totalItemCount;
				let contents = App.Local.getTotalStr(pageCount, 'system-module.projects');
				$content.find(".sumDesc").html(contents);

				$content.find(".listPagination").empty().pagination(pageCount, {
					items_per_page: response.data.pageItemCount,
					current_page: response.data.pageIndex - 1,
					num_edge_entries: 3, //边缘页数
					num_display_entries: 5, //主体页数
					link_to: 'javascript:void(0);',
					itemCallback: function (pageIndex) {
						//加载数据
						App.Services.Settings.pageIndex = pageIndex + 1;
						App.Services.onlyLoadData(params);
					},
					prev_text: (App.Local.data['system-module'].Back || "上一页"),
					next_text: (App.Local.data['source-model'].nt || "下一页")

				});
				App.Services.initScroll();

			}

		});
	},

	//只是加载数据
	onlyLoadData: function (params) {
		var _data = {
			pageIndex: App.Services.Settings.pageIndex,
			pageItemCount: App.Comm.Settings.pageItemCount,
			name: "",
			estateType: "",
			province: "",
			region: "",
			complete: "",
			open: "",
			openTimeStart: "",
			openTimEnd: ""
		}
		App.Services.logCollection.reset();
		App.Services.logCollection.fetch({
			data: $.extend({}, _data, params)
		});
	},

	//初始化滚动条
	initScroll: function () {
		$("#logModes").find(".proListBoxScroll").mCustomScrollbar({
			set_height: "100%",
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		});

		$("#logModes").find(".proMapScroll").mCustomScrollbar({
			set_height: "100%",
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		});
	},

	initRuleDomEvent() {

		$('#recoveryRuleBtn').on('click', function () {
			$('#filteRuleFile').click();
		})
		$('#uploadIframeFilteRule').on('load', function () {
			var data = JSON.parse(this.contentDocument.body.innerText);
			if (data.code == 0) {
				$.tip({
					message: "恢复成功",
					type: 'success'
				});
				document.location.reload();
			} else {
				$.tip({
					message: "恢复失败",
					type: 'alarm'
				});
			}
		})
		$('#filteRuleFile').on('change', function () {
			$('#filteRuleForm').submit();
		})
	},

	ruleInit() {
		/*
		var processCategory=['工程桩', '基坑支护', '地下防水', '梁柱节点', '钢结构悬挑构件', '幕墙', '外保温',
		                     '采光顶', '步行街吊顶风口', '卫生间防水', '屋面防水', '屋面虹吸雨排', '消防泵房', '给水泵房',
		                     '湿式报警阀室', '空调机房', '冷冻机房', '变配电室', '发电机房', '慧云机房', '电梯机房', '电梯底坑',
		                     '吊顶', '地面', '中庭栏杆', '竖井'
		];
		*/
		var processCategory = [
			'工程桩',
			'基坑支护',
			//'地下防水', 
			'地下室外墙防水',
			'地下室底板防水',
			'梁柱节点',
			'钢结构悬挑构件',
			'幕墙',
			'外保温',
			'采光顶',
			'步行街吊顶风口',
			'卫生间防水',
			'屋面防水',
			'屋面虹吸雨排',
			'消防泵房',
			'给水泵房',
			'湿式报警阀室',
			'空调机房',
			'冷冻机房',
			'变配电室',
			'发电机房',
			'慧云机房',
			'电梯机房',
			'电梯底坑',
			'吊顶',
			'地面',
			'中庭栏杆',
			'竖井'
		];
		var processCategoryMR = {
			'基坑支护': {
				margin: 0.2,
				ratio: 1.0
			},
			'梁柱节点': {
				margin: 0.8,
				ratio: 2.0
			},
			'外保温': {
				margin: 0.5,
				ratio: 1.0
			},
			'地下防水': {
				margin: 1,
				ratio: 1.0
			},
			'幕墙': {
				margin: 1,
				ratio: 1.0
			},
			'采光顶': {
				margin: 3,
				ratio: 1.0
			},
			'地面': {
				margin: 0.01,
				ratio: 1.0
			}
		};

		var special = [{
			specialty: "建筑",
			specialtyCode: "AR",
			sort: 0,
			files: []
		}, {
			specialty: "结构",
			specialtyCode: "ST",
			sort: 1,
			files: []
		}, {
			specialty: "暖通",
			specialtyCode: "AC",
			sort: 2,
			files: []
		}, {
			specialty: "电气",
			specialtyCode: "EL",
			sort: 3,
			files: []
		}, {
			specialty: "智能化",
			specialtyCode: "TE",
			sort: 4,
			files: []
		}, {
			specialty: "给排水",
			specialtyCode: "PL",
			sort: 5,
			files: []
		}, {
			specialty: "采光顶",
			specialtyCode: "LR",
			sort: 15,
			files: []
		}, {
			specialty: "内装&导识",
			specialtyCode: "IN&GS",
			sort: 17,
			files: []
		}, {
			specialty: "景观&导识",
			specialtyCode: "LC&GS",
			sort: 19,
			files: []
		}, {
			specialty: "幕墙&泛光",
			specialtyCode: "CW&LI",
			sort: 21,
			files: []
		}]

		var floorCondition = [{
			name: '等于',
			code: '='
		}, {
			name: '大于',
			code: '>'
		}, {
			name: '小于',
			code: '<'
		}, {
			name: '大于等于',
			code: '>='
		}, {
			name: '小于等于',
			code: '<='
		}];
		var fileCondition = [{
			name: '包含',
			code: 'like'
		}, {
			name: '不包含',
			code: 'unlike'
		}, {
			name: '只等于',
			code: '='
		}];
		//过滤规则
		var RuleView = Backbone.View.extend({
			className: 'modelFilterRule',
			template: _.templateUrl('/services/tpls/rule.html'),
			event: {
				'click .ruleTypeItem': "selectItem"
			},
			render: function (data) {
				this.$el.html(this.template(data));
				$('#contains').html(this.$el);
				this.initEvent();
				App.Services.initRuleDomEvent();
				return this;
			},

			initEvent: function () {
				var _this = this,
					_$items = _this.$('.ruleTypeItem');
				_$items.on('click', function (event) {
					_this.selectItem(event, _$items);
				})

				_$items.eq(0).trigger('click');
			},

			getData: function (val) {



			},

			selectItem: function (event, _$items) {
				var _this = this,
					_$target = $(event.target),
					$forms = _this.$('.formLabel').children(),
					$el = _this.$('.formLabel .' + _$target.data('id'));
				if (!_$target.hasClass('selected')) {
					_$items.removeClass('selected');
					_$target.addClass('selected');
					$forms.remove();
					if ($el.length) {
						$el.show();
					} else {
						$.ajax({
							url: '/sixD/checkPointRule?token=123&checkPointType=' + encodeURI(_$target.text()),
							success: function (res) {
								if (res.data) {
									if (res.data.floorRule.length == 0) {
										res.data.floorRule.push({
											floorOperator: "",
											floor: ""
										})
									}
									if (res.data.specRule.length == 0) {
										res.data.specRule.push({
											specCode: "",
											fileOperator: "",
											filename: ""
										})
									}
									if (res.data.codeRule.length == 0) {
										res.data.codeRule.push({
											visible: -1,
											code: []
										})
									}
								}
								var view = new RuleItemView({
									className: _$target.data('id')
								}).render({
									name: _$target.text(),
									special: special,
									floorCondition: floorCondition,
									fileCondition: fileCondition,
									processCategoryMR: processCategoryMR,
									data: res.data
								});
								_this.$('.formLabel').append(view.$el);
							}
						})
					}
				}

			}
		})

		var SpeRuleItem = Backbone.View.extend({
			className: 'ruleItemWrap',
			template: _.templateUrl('/services/tpls/specialRuleItem.html'),
			render: function (data) {
				this.$el.html(this.template(data));
				return this;
			}
		})
		var FloRuleItem = Backbone.View.extend({
			className: 'ruleItemWrap',
			template: _.templateUrl('/services/tpls/floorRuleItem.html'),
			render: function (data) {
				this.$el.html(this.template(data));
				return this;
			}
		})

		var RuleItemView = Backbone.View.extend({
			template: _.templateUrl('/services/tpls/ruleItem.html'),
			render: function (data) {
				this.$el.html(this.template(data));
				return this;
			},
			events: {
				'click .newLabel': 'addRule',
				'click .confirm': 'applyRule'
			},


			addRule: function (e) {
				var _$target = $(e.target),
					type = _$target.data('type');
				if (type == "spe") {
					var view = new SpeRuleItem().render({
						special: special,
						floorCondition: floorCondition,
						fileCondition: fileCondition
					})
					this.$('.specialRuleContainer').append(view.$el);
				} else if (type == 'flo') {
					var view = new FloRuleItem().render({
						special: special,
						floorCondition: floorCondition,
						fileCondition: fileCondition
					});
					this.$('.floorRuleContainer').append(view.$el);
				}

			},

			applyRule: function () {
				var data = {
					"checkPointType": this.$('h2').text(),
					"floorRule": [],
					"specRule": [],
					"codeRule": [],
					"margin": '',
					"ratio": ''
				}

				var marginValue = this.$('input[name="margin"]').val(),
					ratioValue = this.$('input[name="ratio"]').val();

				if (marginValue.length) {
					if (!(/^(-?\d+)(\.\d+)?$/.test(marginValue))) {
						$.tip({
							message: '模型显示Margin比例输入不正确',
							type: 'alarm'
						})
						return
					}
				}

				if (marginValue.length) {
					if (!(/^(-?\d+)(\.\d+)?$/.test(marginValue))) {
						$.tip({
							message: '模型显示Margin比例输入不正确',
							type: 'alarm'
						})
						return
					}

				}
				if (ratioValue.length) {
					if (!(/^(-?\d+)(\.\d+)?$/.test(ratioValue))) {
						$.tip({
							message: '模型显示Ratio比例输入不正确',
							type: 'alarm'
						})
						return
					}
				}


				data.margin = marginValue;
				data.ratio = ratioValue;

				var $spe = this.$('.specialRuleContainer .ruleItemWrap'),
					$flo = this.$('.floorRuleContainer .ruleItemWrap'),
					$ccode = this.$('.classCodeWrap');
				$spe.each(function (index, d) {
					var dom = $(d);
					if (dom.find('select[name="specail"]').val()) {
						data.specRule.push({
							"specCode": dom.find('select[name="specail"]').val(),
							"fileOperator": dom.find('select[name="condition"]').val(),
							"filename": dom.find('input[name="specialValue"]').val()
						})
					}
				})

				$flo.each(function () {
					var dom = $(this);
					if (dom.find('select[name="condition"]').val() && dom.find('input[name="floorValue"]').val()) {
						data.floorRule.push({
							"floorOperator": dom.find('select[name="condition"]').val(),
							"floor": dom.find('input[name="floorValue"]').val()
						})
					}
				})

				data.codeRule.push({
					visible: $ccode.find('select[name="condition"]').val() == 'true' ? true : false,
					code: $ccode.find('input[name="ccodeValue"]').val().split(',')
				})

				$.ajax({
					url: '/sixD/checkPointRule?token=123',
					contentType: "application/json",
					type: "post",
					data: JSON.stringify(data),
					success: function (res) {
						if (res.code == 0) {
							$.tip({
								message: (App.Local.data.system.Success || '操作成功')
							})
						} else {
							$.tip({
								message: '操作失败',
								type: 'alarm'
							})
						}

					},

					error: function () {
						$.tip({
							message: '操作失败',
							type: 'alarm'
						})
					}
				})
			},

			initEvent: function () {
				var _this = this,
					_$item = _this.$('.ruleTyleItem');
				_$item.on('click', function (event) {
					_$item.removeClass('selected');
					$(event.target).addClass('selected')
				})
			}
		})

		new RuleView().render({
			type: processCategory
		});

	}
};