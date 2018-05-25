var AppKeyRoute = Backbone.Router.extend({

	routes: {
		'family/:libId': 'family', //族库
		'model/:modelCode/version/:versionId': 'standardLibs', //标准模型库
		'project/:projectCode/version/:versionId': 'project', //项目
		'project/:projectCode/version/:versionId/differ/std': 'projectDifferStd', // 浏览项目模型与标准模型差异
		'project/:projectCode/version/:versionId/differ/base': 'projectDifferBase', //浏览变更模型与变更基准模型差异
		'project/:projectCode/plan/:planId': 'projectPlan',
		'share/:token': "shareModel", //分享模型
		'logout': 'logout'
	},

	//项目计划节点
	projectPlan(projectId, planId) {

		var _this = this;
		//初始化之前 验证
		this.beforeInit(() => {

			_.require('/static/dist/projects/projects.css');
			_.require('/static/dist/projects/projects.js');
			var pid = '';
			App.Project.Settings = $.extend({}, App.Project.Defaults);

			//	App.Project.Settings.projectId = projectId;
			App.Project.Settings.planId = planId;
			App.Project.Settings.type = "token";

			_this.projectByCode(projectId, function(data) {
				if (data) {
					pid = data.projectId;
					App.Project.Settings.projectId = pid;
					_this.fetchLastProjectVersionId(pid, function(data) {
						if (data) {
							App.Project.Settings.versionId = data.version.id;
							_this.fetchBuildIdByPlanCode(planId, pid, App.Project.Settings.versionId, function() {
								if (App.Project.Settings.PlanElement.elements.length > 0) {
									App.Project.init();
								} else {
									$("#pageLoading").remove();
									$("#contains").html('<div class="nullTip">该计划节点未找到对应构件</div>')
								}

							});
						}
					})
				}
			})
		});
	},

	//获取项目最新版本
	fetchLastProjectVersionId(projectId, callback) {

		var data = {
			URLtype: 'fetchProjectBaseInfo',
			data: {
				projectId: projectId
			}
		}
		App.Comm.ajax(data, function(res) {
			if (res.code == 0) {
				callback(res.data);
			} else {
				alert(res.message);
				return;
			}
		})
	},

	//根据计划节点获取对应的构建
	fetchBuildIdByPlanCode(planCode, projectId, projectVersionId, callback) {
		App.Comm.ajax({
			URLtype: "fetchModleIdByCode",
			data: {
				projectId: projectId,
				projectVersionId: projectVersionId,
				planItemId: planCode
			}
		}, function(data) {
			if (data.code == 0) {
				App.Project.Settings.PlanElement = data.data; //.elements 
			}
			if ($.isFunction(callback)) {
				callback();
			}
		});
	},



	//模型分享
	shareModel(token) {

		if (App.Comm.isIEModel()) {
			return;
		}
		_.require('/static/dist/projects/projects.css');
		_.require('/static/dist/projects/projects.js');

		App.Project.Settings = $.extend({}, App.Project.Defaults);
		var that = this;
		this.parseToken(token, function() {

			//分享的事件
			App.Project.Share.init();

			if (!App.Comm.getCookie("OUTSSO_AuthToken")) {
				$("#pageLoading").hide();
				$("#topBar .login").click();
			} else {
				that.formatUser();
				App.Project.init();
			}

		});

	},

	//解析token
	parseToken(token, callback) {

		var data = {
			URLtype: 'parseToken',
			data: {
				id: token
			}
		}

		App.Comm.ajax(data, function(data) {

			if (data.code == 0) {

				data = data.data;

				App.Project.Settings.projectId = data.projectId;

				App.Project.Settings.versionId = data.projectVersionId;

				App.Project.Settings.type = "token";

				App.Project.Settings.token = data.token;

				$("#topBar").prepend(' <ul class="navHeader"> <li class="item "> <span class="login">立即登录</span> </li></ul>');

				// if (!App.Comm.getCookie("OUTSSO_AuthToken")) {
				// 	App.Comm.setCookie("token_cookie", data.cookie);
				// } else {
				// 	App.Comm.setCookie("token_cookie_me", data.cookie);
				// }

				//回调
				if ($.isFunction(callback)) {
					callback();
				}
			}
		});
	},


	// 浏览变更模型与变更基准模型差异
	projectDifferBase(projectCode, versionId) {

		var _this = this;
		//初始化之前 验证
		this.beforeInit(() => {
			_.require('/static/dist/app/project/projectChange/index.css');
			_.require('/static/dist/app/project/projectChange/index.js');
			// var temp = _.templateUrl('/page/tpls/project.change.html', true);
			var temp = _.templateUrl('../../../../page/tpls/project.change.html', true);
			$("body").html(temp);

			_this.projectByCode(projectCode, function(data) {
				if (data) {
					App.Index.initApi(data.projectId, versionId);
				}

			});

		});
	},

	//浏览项目模型与标准模型差异
	projectDifferStd(projectCode, versionId) {
		var _this = this;
		//初始化之前 验证
		this.beforeInit(() => {

			_.require('/static/dist/app/project/modelChange/index.css');
			_.require('/static/dist/app/project/modelChange/index.js');
			// var temp = _.templateUrl('/page/tpls/model.change.html', true);
			var temp = _.templateUrl('../../../../page/tpls/model.change.html', true);
			$("body").html(temp);

			_this.projectByCode(projectCode, function(data) {
				if (data) {
					App.Index.initApi(data.projectId, versionId, "std");
				}

			})

		});
	},

	//项目
	project(projectCode, versionId) {

		var _this = this;
		//初始化之前 验证
		this.beforeInit(() => {

			_.require('/static/dist/projects/projects.css');
			_.require('/static/dist/projects/projects.js');

			App.Project.Settings = $.extend({}, App.Project.Defaults);

			App.Project.Settings.projectId = projectCode;

			App.Project.Settings.versionId = versionId;

			App.Project.Settings.type = "token";

			_this.projectByCode(projectCode, function(data) {
				if (data) {
					App.Project.Settings.projectId = data.projectId;
					var Request = App.Comm.GetRequest();
					//加载类型
					App.Project.Settings.loadType = Request.type;

					App.Project.init();
				}

			})

		});


	},


	//族库
	family(libIid) {

		//初始化之前 验证
		this.beforeInit(() => {

			_.require('/static/dist/resources/resources.css');
			_.require('/static/dist/resources/resources.js');
			this.resourceModel("famLibs", libIid);
		});

	},

	//标准模型库
	standardLibs(modelCode, versionId) {

		//初始化之前 验证
		this.beforeInit(() => {

			_.require('/static/dist/resources/resources.css');

			_.require('/static/dist/resources/resources.js');

			App.currentProject = App.currentProject || {};
        	App.currentProject.projectId = modelCode;
        	App.currentProject.projectVersionId = versionId;
        	
			App.ResourcesNav.Settings.type = App.ResourceModel.Settings.type = "standardLibs";
			App.ResourceModel.Settings.CurrentVersion = {};
			App.ResourceModel.Settings.projectId = modelCode;
			App.ResourceModel.Settings.versionId = versionId;
			App.ResourceModel.init();

		});

	},


	//资源库
	resourceModel: function(type, projectId) {

		//初始化之前 验证
		this.beforeInit(() => {

			_.require('/static/dist/resources/resources.css');

			_.require('/static/dist/resources/resources.js');

			App.ResourcesNav.Settings.type = App.ResourceModel.Settings.type = type;
			App.ResourceModel.Settings.CurrentVersion = {};
			App.ResourceModel.Settings.projectId = projectId;

			App.ResourceModel.initToken();

		});

	},


	//重置数据
	reset: function() {
		//用户信息
		App.Global.User = JSON.parse(localStorage.getItem("user"));

		//销毁上传
		App.Comm.upload.destroy();
		//$("#topBar .userName .text").text(App.Comm.getCookie("OUTSSO_LoginId"));
	},

	//加载之前
	beforeInit(callback) {

		if (App.Comm.isIEModel()) {
			return;
		}

		//验证登录
		this.checkLogin((isLogin) => {

			if (!isLogin) {
				return;
			}

			this.reset();

			callback();

		});
	},

	//检查登录
	checkLogin(fn) {

		$("#pageLoading").show();

		App.Comm.Settings.loginType = "token";

		var that = this;
		//是否登录了
		//if (!App.Comm.getCookie("token_cookie")) {

		var Request = App.Comm.GetRequest(),
			appKey = Request.appKey,
			token = Request.token;

		var data = {
			URLtype: "appToken",
			data: {
				appKey: appKey,
				token: token
			}
		}

		App.Comm.ajax(data, function(data) {

			if (data.code == 0) {

				var token_cookie = data.data;

				var isLogin=App.Comm.getCookie("OUTSSO_AuthToken");

				if (isLogin) {
					App.Comm.setCookie("token_cookie_me", token_cookie);
				}else{
					App.Comm.setCookie("token_cookie", token_cookie);
				}

				// $.ajax({
				// 	url: '/platform/user/current?t=' + (+new Date()),
				// 	async: false
				// }).done(function(data) {

				// 	if (typeof(data) == "string") {
				// 		data = JSON.parse(data);
				// 	}
				// 	if (data.code == 0) {
				// 		App.Comm.setCookie("token_cookie_me", token_cookie);
				// 	} else {
				// 		App.Comm.setCookie("token_cookie", token_cookie);
				// 	}
				// }).fail(function() {
				// 	App.Comm.setCookie("token_cookie", token_cookie);
				// });

				
				//获取用户信息
				that.getUserInfo(fn);

			} else {

				if (data.code == 10004) {
					window.location.href = data.data;
				} else {
					alert("验证失败");
					fn(false);
				}

			}
		}).fail(function(data) {
			if (data.status == 400) {
				alert("token过期");
			}
		});

		//} else {
		//	fn(true);
		//}
		this.cleanCookie();
	},

	//获取用户信息
	getUserInfo(fn) {

		var that = this;

		$.ajax({
			url: '/platform/user/current'
		}).done(function(data) {
			//失败
			if (data.code != 0) {
				alert("获取用户信息失败");
				fn(false);
				return;
			}

			localStorage.setItem("user", JSON.stringify(data.data));

			that.formatUser();

			fn(true);



		});
	},

	//格式化用户
	formatUser() {
		var data = localStorage.getItem("user");
		App.Global.User = JSON.parse(data);
		var Autharr = App.Global.User['function'],
			keys, len;
		App.AuthObj = {};
		//遍历权限
		$.each(Autharr, function(i, item) {
			keys = item.code.split('-');
			len = keys.length;

			if (len == 1) {
				App.AuthObj[keys[0]] = true;
			} else {

				App.AuthObj[keys[0]] = App.AuthObj[keys[0]] || {}

				if (len == 2) {
					App.AuthObj[keys[0]][keys[1]] = true
				} else {
					App.AuthObj[keys[0]][keys[1]] = App.AuthObj[keys[0]][keys[1]] || {}
					App.AuthObj[keys[0]][keys[1]][keys[2]] = true;
				}

			}
		});
	},

	//退出清除cookie
	cleanCookie() {
		//绑定beforeunload事件
		$(window).on('beforeunload', function() {
			//App.Comm.delCookie("token_cookie")
		});
	},

	projectByCode(code, callback) {

		var Request = App.Comm.GetRequest(),
			appKey = Request.appKey,
			token = Request.token;

		var data = {
			URLtype: 'projectByCode',
			data: {
				appKey: appKey,
				token: token,
				code: code
			}
		}

		App.Comm.ajax(data, function(res) {
			if (res.code == 0) {
				callback(res.data);
			} else {
				callback(null);
			}
		})
	},

	logout() { 

		App.Comm.dispatchIE('/?commType=loginOut'); 
		App.Comm.delCookie('AuthUser_AuthNum');
		App.Comm.delCookie('AuthUser_AuthMAC');
		App.Comm.delCookie('OUTSSO_AuthToken');
		App.Comm.delCookie('OUTSSO_AuthNum');
		App.Comm.delCookie('token_cookie');
		App.Comm.delCookie('token_cookie_me');
		App.Comm.delCookie('OUTSSO_AuthMAC');
		App.Comm.delCookie('IS_OWNER_LOGIN');  
		window.location.href = "/login.html?t="+(+new Date());

	}



});



App.AppKeyRoute = new AppKeyRoute();

//开始监听
Backbone.history.start();

//轮训
if (!("ActiveXObject" in window) && !window.ActiveXObject) {
	//轮训
	setInterval(function() {
		if (App.Comm && App.Comm.checkOnlyCloseWindow) {
			App.Comm.checkOnlyCloseWindow();
		}
	}, 3000);
}