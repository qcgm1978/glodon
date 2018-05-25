App.Comm = {

	Settings: {
		v: 20160313,
		loginType: "user", // 登录状态 user token
		pageItemCount: 15, //Math.floor(($("body").height() + 60) / 70) > 10 && Math.floor(($("body").height() + 60) / 70) || 10
		pageSize: 9999
	},

	//批注类型  0: 模型；1：rvt单文件；2：dwg图纸文件
	hostType: {
		0: "m-single-model",
		1: "m-single-rvt",
		2: "m-single-dwg"
	},

	//是否登录
	isLogin: function (async) {

		//默认 同步
		if (async) {
			async = true;
		} else {
			async = false;
		}

		var isLogin = false;

		$.ajax({
			url: '/platform/user/current?t=' + (+new Date()),
			async: async
		}).done(function (data) {

			if (typeof (data) == "string") {
				data = JSON.parse(data);
			}
			if (data.code == 0) {
				isLogin = true;
			} else {
				isLogin = false;
			}
		});

		return isLogin;
	},
	//ie预览模型
	isIEModel: function () {

		if ("ActiveXObject" in window || window.ActiveXObject) {
			window.location.href = '/ie.html?path=' + window.location.href;
			return true;
		}
	},
	//项目版本状态
	versionStatus: {
		"1": "待上传",
		"2": "上传中",
		"3": (App.Local.data['drawing-model'].NAd || "待审核"),
		"4": App.Local.data['drawing-model'].Approving || "审核中",
		"5": App.Local.data['drawing-model'].Approved || "审核通过",
		"6": App.Local.data['drawing-model'].RejectedBack || "审核退回",
		"7": App.Local.data['drawing-model'].NTd || "待移交",
		"8": "移交退回",
		"9": App.Local.getTranslation('drawing-model.Transferred') || "已移交",
		"10": App.Local.getTranslation('drawing-model.NAd') || "待审核",
		"11": App.Local.data['drawing-model'].Approved || "审核通过",
		"12": App.Local.data['drawing-model'].RejectedBack || "审核退回",
		"13": App.Local.data['drawing-model'].NTd || "待移交",
		"14": "移交退回"
	},

	//族库和标准模型状态
	modelStatus: {
		"1": "待上传",
		"2": "上传中",
		"3": App.Local.getTranslation('drawing-model.NAd') || "待审核",
		"4": App.Local.data['drawing-model'].Approving || "审核中",
		"5": App.Local.data['drawing-model'].Approved || "审核通过",
		"6": App.Local.data['drawing-model'].RejectedBack || "审核退回",
		"7": App.Local.data['drawing-model'].NotReleased || "待发布",
		"8": App.Local.data['drawing-model'].ReleasedBack || "发布退回",
		"9": App.Local.data['source-data'].rd || "已发布",
		"10": App.Local.data['drawing-model'].NAd || "待审核",
		"11": App.Local.data['drawing-model'].Approved || "审核通过",
		"12": App.Local.data['drawing-model'].RejectedBack || "审核退回",
		"13": App.Local.data['drawing-model'].NTd || "待移交",
		"14": "移交退回"
	},

	isAuth: function (type, s) {
		if (!App.AuthObj) {
			return false;
		}
		var _subType, _auth, _status, _setting, isChange = false,
			_temp = '4,7,9';
		if (s == 'family') {
			_auth = App.AuthObj.lib && App.AuthObj.lib.family || {};
			_setting = App.ResourceModel.Settings || {};
		} else if (s == 'model') {
			_setting = App.ResourceModel.Settings || {};
			_auth = App.AuthObj.lib && App.AuthObj.lib.model || {};
		} else {
			_setting = App.Project.Settings || {};
			_auth = App.AuthObj.project && App.AuthObj.project.prjfile || {};
		}
		_subType = _setting.CurrentVersion.subType;
		_status = _setting.CurrentVersion.status;
		isChange = _setting.CurrentVersion.name == "初始版本" ? false : true;
		//如果状态等于4,7,9直接禁用
		if (_temp.indexOf(_status) != -1) {
			return false;
		}
		if (s == 'family' || s == 'model') {
			if (_auth.edit) {
				return true;
			} else {
				return false;
			}
		}

		//非标、用户权限、不是变更版本才有（创建、重命名、删除）
		if (type == 'create' || type == "rename" || type == "delete") {

			//变更版本不能创建、删除、重命名
			if (_subType == 3 && _auth.edit && !isChange) {
				return true;
			}
		} else if (type == "upload") {

			if (_auth.edit) {
				return true;
			}
		} else if (type == "down") {
			return true;
		}
		/*//如果状态不等于4,7,9，并且是族库、标准模型则有所有权限
		if (s == 'family' || s == 'model') {
			return true;
		}*/
		return false;
	},

	//格式化 状态  type 1  project  2 resource
	formatStatus: function (status, type, createId, locked) {

		//项目  非初始 锁定
		if (type == 1 && App.Project.Settings.CurrentVersion.name != '初始版本' && locked) {
			if (App.Global.User.userId != createId && createId) {
				return App.Local.data['drawing-model'].Lock || '锁定';
			}
		}


		if (type == 1) {
			return App.Comm.versionStatus[status] || '';
		} else if (type == 2) {
			return App.Comm.modelStatus[status] || '';
		}
		return '';
	},

	user: function (key) {
		if (!App.Global.User) {
			window.location.href = "/login.html?t=" + (+new Date());
		} else {
			return App.Global.User[key];
		}
	},

	//封装ajax
	ajax: function (data, callback) {

		if (!data) {
			return;
		}

		data = App.Comm.getUrlByType(data);

		if (data.headers) {
			data.headers.ReturnUrl = location.href;
		} else {
			//登录时要用
			data.headers = {
				ReturnUrl: location.href
			}
		}



		return $.ajax(data).done(function (data) {

			//cookie延长30分钟
			App.Comm.setCookieTime(120);

			if (_.isString(data)) {
				// to json
				if (JSON && JSON.parse) {
					data = JSON.parse(data);
				} else {
					data = $.parseJSON(data);
				}
			}

			//未登录
			if (data.code == 10004) {

				window.location.href = data.data;
			}

			if (data.code != 0) {
				console.log(data.message);
			}


			if ($.isFunction(callback)) {
				//回调
				callback(data);
			}

		});

	},

	getUrlByType: function (data) {

		if (data.url) {
        } else {
		    //是否调试
            if (App.API.Settings.debug) {
                data.url = App.API.DEBUGURL[data.URLtype];
            } else {
                data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
            }
            //没有调试接口
            if (!data.url) {
                data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
            }
        }

		//url 是否有参数
		var urlPars = data.url.match(/\{([\s\S]+?(\}?)+)\}/g);

		var temp = data.data;

		if ((typeof temp) == 'string') {
			temp = JSON.parse(temp);
		}
		if (urlPars) {
			for (var i = 0; i < urlPars.length; i++) {

				var rex = urlPars[i],
					par = rex.replace(/[{|}]/g, ""),
					val = temp[par];
				data.url = data.url.replace(rex, val);
			}
		}

		//删除
		if ((data.URLtype.indexOf("delete") > -1 || data.URLtype.indexOf("put") > -1) && data.data) {
			if (data.url.indexOf("?") == -1) {
				data.url += "?1=1";
			}
			for (var p in data.data) {
				data.url += "&" + p + "=" + data.data[p];
			}
		}

		if (data.url.indexOf("?") > -1) {
			data.url += "&t=" + (+new Date);
		} else {
			data.url += '?t=' + (+new Date);
		}
		return data;

	},

	//JS操作cookies方法!
	// doMain: window.location.host.substring(window.location.host.indexOf(".")),
	// doMain: window.location.host,

	setCookie(name, value, expires) {
		var Days = 0.02,
			exp = new Date();
		const time = expires ? expires : exp.getTime() + Days * 24 * 60 * 60 * 1000;
        exp.setTime(time);
		document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";domain=" + (/^(\d+\.?)+$/.test(location.host) ? window.location.host : (window.location.host.substring(window.location.host.indexOf(".")))) + ";path=/";
	},
	//获取cookie
	getCookie: function (key, cookis) {

		var cooks = cookis || document.cookie,
			items = cooks.split("; "),
			result,
			len = items.length,
			str, pos;

		for (var i = 0; i < len; i++) {

			str = items[i];
			pos = str.indexOf('=');

			name = str.substring(0, pos);

			if (name == key) {
				result = str.substring(pos + 1);
				break;
			}
		}
		return result;

	},
	//删除cookie
	delCookie: function (name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 31 * 24 * 60 * 60 * 1000);
		var cval = this.getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=" + App.Comm.doMain + ";path=/";
	},

	clearCookie() {
		var keys = this.cookieNames(document.cookie); //  document.cookie.match(/[^ =;]+(?=\=)/g);
		if (keys) {
			for (var i = keys.length; i--;)
				document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString() + ";domain=" + App.Comm.doMain + ";path=/";
		}
	},

	//cookie名称
	cookieNames: function (cookies) {

		var items = cookies.split("; ");

		var names = [],
			len = items.length,
			str, pos;

		for (var i = 0; i < len; i++) {
			str = items[i];
			pos = str.indexOf('=');
			names.push(str.substring(0, pos));
		}
		return names;
	},


	//设置cookie 时间
	setCookieTime(min) {

		var exp = new Date(),

			keys = this.cookieNames(document.cookie);

		exp.setTime(exp.getTime() + min * 60 * 1000);

		if (keys) {
			for (var i = keys.length; i--;)
				document.cookie = keys[i] + "=" + this.getCookie(keys[i]) + ";expires=" + exp.toGMTString() + ";domain=" + App.Comm.doMain + ";path=/";
		}

		App.Comm.dispatchIE('?commType=setCookieTime');

	},

	//校验cookie
	checkCookie(cookies) {

		//用户重新登录了
		if (App.Comm.getCookie("userId") != App.Comm.getCookie("userId", cookies)) {

			App.Comm.clearCookie();

			if (cookies) {
				var keys = App.Comm.cookieNames(cookies),
					val;
				for (var i = 0; i < keys.length; i++) {

					val = App.Comm.getCookie(keys[i], cookies);

					val && App.Comm.setCookie(keys[i], val);
				}
			}
			App.Comm.getUserInfo();
			window.location.reload();

		}


	},

	//格式化 文件大小
	formatSize: function (size) {
		if (size === undefined || /\D/.test(size)) {
			return '';
		}
		if (size >= 1073741824) {
			return (size / 1073741824).toFixed(2) + 'GB';
		}
		if (size >= 1048576) {
			return (size / 1048576).toFixed(2) + 'MB';
		} else if (size >= 6) {
			return (size / 1024).toFixed(2) + 'KB';
		} else {
			return size + 'b';
		}
	},

	//收起和暂开
	navBarToggle: function ($el, $content, dirc, Viewer) {

		var dircWidth, mDirc;
		if (dirc == "left") {
			mDirc = "margin-left";
		} else {
			mDirc = "margin-right";
		}

		dircWidth = parseInt($el.css(mDirc));

		if (dircWidth >= 0) {
			var width = $el.width(),
				ani = {};

			ani[mDirc] = -width;
			$el.animate(ani, 500, function () {
				$el.find(".dragSize").hide().end().find(".slideBar i").toggleClass('icon-caret-left icon-caret-right');
				//$content.css(mDirc, 0);
				if (Viewer) {
					// Viewer.resize();
				}
			});
		} else {

			var ani = {}
			ani[mDirc] = "0px";

			$el.animate(ani, 500, function () {
				$el.find(".dragSize").show().end().find(".slideBar i").toggleClass('icon-caret-left icon-caret-right');
				//$content.css(mDirc, $el.width());
				if (Viewer) {
					//Viewer.resize();
				}

			});
		}

	},
	//拖拽改变尺寸
	dragSize: function (event, $el, $content, dirc, Viewer) {

		var initX = event.pageX,
			isLeft = dirc == "left" ? true : false,
			initWidth = $el.width();

		var $target = $(event.target);

		$(document).on("mousemove.dragSize", function (event) {
			var newWidth;
			if (isLeft) {
				newWidth = initWidth + event.pageX - initX;
			} else {
				newWidth = initWidth + initX - event.pageX;
			}

			$el.width(newWidth);
		});

		$(document).on("mouseup.dragSize", function () {

			$(document).off("mouseup.dragSize");
			$(document).off("mousemove.dragSize");

			var contentWidth = $content.width(),
				leftNavWidth = $el.width(),
				gap = leftNavWidth - initWidth;

			var mPos = "margin-right";
			if (isLeft) {
				mPos = "margin-left";
			}

			if (contentWidth - gap < 10) {
				var maxWidth = initWidth + contentWidth - 10;
				$el.width(maxWidth);
				//$content.css(mPos, maxWidth);
			} else {
				//$content.css(mPos, leftNavWidth);
			}
			if (Viewer) {
				Viewer.resize();
			}
		});

		return false;

	},
	managePoint: function (data) {
		App.Comm.viewpointView(data);
	},

	//下载
	checkDownLoad: function (projectId, projectVersionId, fileVersionId) {

		// if (!App.Comm.getCookie("OUTSSO_AuthToken")) {
		// 	// $.tip({
		// 	// 	message: "登录后下载",
		// 	// 	type: "alarm"
		// 	// });
		// 	window.location.href = "/login.html";
		// 	return;
		// }

		var checkData = {
			URLtype: "checkDownLoad",
			data: {
				projectId: projectId,
				versionId: projectVersionId,
				fileVersionId: fileVersionId
			}
		};

		App.Comm.ajax(checkData, function (data) {
			if (data.code == 0) {
				// //请求数据
				var data = {
					URLtype: "downLoad",
					data: {
						projectId: projectId,
						projectVersionId: projectVersionId
					}
				};

				var data = App.Comm.getUrlByType(data);
				var url = data.url + "&fileVersionId=" + fileVersionId;
				window.location.href = url;
			} else {
				alert(data.message);
			}

		})

	},

	//文件后缀
	fileSuffix(type) {

		if (type == "rvt" || type == "dwg" || type == "folder" || type == 'rfa') {
			return type;
		} else {
			return "other";
		}

	},

	//初始化滚动条
	initScroll($target, axis) {

		//绑定过
		if (!$target || $target.hasClass("mCustomScrollbar")) {
			return;
		}

		var opts = {
			theme: 'minimal-dark',
			axis: axis,
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		};

		if (axis.indexOf("x") > -1) {
			opts["set_width"] = "100%";
		}
		if (axis.indexOf("y") > -1) {
			opts["set_height"] = "100%";
		}

		$target.mCustomScrollbar(opts);
	},

	//获取url 参数
	GetRequest() {
		var url = location.search || location.href.substr(location.href.indexOf('?')); //获取url中"?"符后的字串
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

	//tip组件，使用示例
	// new App.Comm.Tip({message:'',type:'success',timeout:3000}).render().show();
	// 参数说明:message 显示的内容
	// 		 type 样式，三种可选success,common,alarm
	//		 timeout 自动关闭时间 默认2000,选填

	Tip: Backbone.View.extend({
		tagName: 'div',
		className: 'mmhTip',
		template: '<div class="content <%=type%>"><i></i><%=message%></div>',
		initialize: function (data) {
			this._userData = data;
		},
		render: function () {
			var _tpl = _.template(this.template);
			this.$el.html(_tpl(this._userData));
			return this;
		},
		show: function () {
			var _this = this;
			$('body').append(this.$el);
			this.$el.animate({
				top: '40px',
			}, 1000);
			setTimeout(function () {
				_this.$el.remove();
			}, _this._userData.timeout || 2000)
		}
	}),
	loadMessageCount: function (param) {
		if (param != undefined) {
			var _ = $('.messageCounter');
			var _c = Number(_.text()) + param;
			_.text(_c);
			if (_c <= 0) {
				_.first().hide();
			} else {
				_.first().show();
			}
			return
		}
		App.Comm.ajax({
			URLtype: 'fetchIMBoxList',
			data: {
				status: 0
			}
		}, function (res) {
			if (res.code == 0) {
				$('.messageCounter').html(res.data.totalItemCount);
				if (res.data.totalItemCount == 0) {
					$('.messageCounter').first().hide();
				} else {
					$('.messageCounter').first().show();
				}
			} else {
				$.tip({ message: res.message, type: 'alarm' });
			}
		})

	},

	//检查是否是唯一的 模型
	setOnlyModel: function () {
		var onlyCount = App.Comm.getCookie("onlyCount");
		if (!onlyCount) {
			App.Comm.setCookie("onlyCount", 1);
			App.Global.onlyCount = 1;
		} else {
			onlyCount++;
			App.Comm.setCookie("onlyCount", onlyCount);
			App.Global.onlyCount = onlyCount;
		}
	},

	//关闭窗口
	checkOnlyCloseWindow: function () {

		var onlyCount = App.Comm.getCookie("onlyCount");
		//没加载过模型
		if (!onlyCount || !App.Global.onlyCount) {
			return;
		}

		if (onlyCount != App.Global.onlyCount) {
			if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
				window.location.href = "about:blank";
				//window.close();
			} else {
				window.opener = null;
				window.open("", "_self");
				window.close();
			}
		}

		//重置 一直累加会溢出
		if (onlyCount == App.Global.onlyCount && App.Global.onlyCount > 100) {
			App.Comm.setCookie("onlyCount", 1);
			App.Global.onlyCount = 1;
		}

	},
	//獲取cook 和 localstore
	getCookAndStore: function () {
		return JSON.stringify({
			cookie: document.cookie,
			user: localStorage.getItem("user")
		});
	},
	//发布ie的消息
	dispatchIE(url, callback) {

		if (navigator.userAgent.indexOf("QtWebEngine/5.7.0") > -1) {
			if (url) {
				window.open(url);
			}

			if ($.isFunction(callback)) {
				callback();
			}

		}

	},

	//获取用户信息
	getUserInfo() {
		$.ajax({
			url: '/platform/user/current?t=' + (+new Date()),
			async: false,
		}).done(function (data) {
			//失败
			if (data.code != 0) {
				return;
			}
			//ie
			App.Comm.dispatchIE('/?commType=loginIn');
			localStorage.setItem("user", JSON.stringify(data.data));

		});
	}

};



//模块
App.Comm.modules = {};
//跨路由调用数据
App.Comm.publicData = {
	services: {
		project: {
			projectId: "",
			projectName: ""
		}
	}
};