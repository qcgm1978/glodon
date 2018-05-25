App.Project.Share = {


	init() {

		App.Project.Settings.isShare = true;
		//下拉箭头
		$(".breadcrumbNav .myIcon-slanting-right").remove();
		//绑定登录
		this.bindLogin();
	},

	//绑定登录 分享用
	bindLogin() {

		//点击登录这
		if (App.Comm.getCookie("OUTSSO_AuthToken")) {

			App.Global.User = JSON.parse(localStorage.getItem("user"));
			//解析权限
			this.parseAuth();

			//设置权限
			App.Project.setPropertyByAuth();

			//销毁上传
			App.Comm.upload.destroy();

			$("#topBar .login").text(App.Global.User.name);

			App.TopNav.init();

			var $comment = $("#comment");
			//评论 登录状态
			if ($comment.find(".btnLogin").length > 0) {
				$comment.find(".noLogin").remove();
				$comment.find(".talkReMark").removeClass("hidden");
			}

			return;
		}

		$("#topBar .login").on("click", function() {
			App.Project.Share.initLogin();
		});
	},

	parseAuth() {

		if (!App.Global.User) {
			return;
		}

		var Autharr = App.Global.User.function,
			keys, len;
		App.AuthObj = {};
		//遍历权限
		$.each(Autharr, function(i, item) {
			keys = item.code.split('-');
			len = keys.length;

			if (len == 1) {
				App.AuthObj[keys[0]] = true;
			} else {

				App.AuthObj[keys[0]] = App.AuthObj[keys[0]] || {};

				if (len == 2) {
					App.AuthObj[keys[0]][keys[1]] = true
				} else {
					App.AuthObj[keys[0]][keys[1]] = App.AuthObj[keys[0]][keys[1]] || {};
					App.AuthObj[keys[0]][keys[1]][keys[2]] = true;
				}

			}
		});
	},

	//登录初始化
	initLogin() {

		var dialogHtml = _.templateUrl('/libsH5/tpls/comment/login.html', true),

			opts = {
				title: "用户登录",
				width: 300,
				height: 220,
				isConfirm: false,
				cssClass: "loginDialog",
				message: dialogHtml
			},

			that = this,

			dialog = new App.Comm.modules.Dialog(opts);

		//登录
		dialog.element.find(".btnLogin").on("click", function() {
			//绑定登录
			that.signIn(dialog);
		});

		//登录
		dialog.element.find(".txtPwd").on("keyup", function(event) {
			//绑定登录
			if (event.keyCode == 13) {
				that.signIn(dialog);
			}
		});
	},

	//登录
	signIn(dialog) {

		var $el = dialog.element,

			$btnLogin = $el.find(".btnLogin");


		if ($btnLogin.data("islogin")) {
			return;
		}

		var userName = $el.find(".txtAccount").val().trim(),
			userPwd = $el.find(".txtPwd ").val().trim();


		if (!userName) {
			alert("请输入用户名");
			return false;
		}

		if (!userPwd) {
			alert("请输入密码");
			return false;
		}

		$btnLogin.val("登录中").data("islogin", true);

		$.ajax({
			url: '/platform/login',
			type: 'post',
			data: {
				userid: userName,
				password: userPwd
			}
		}).done(function(data) {

			if (data.code == 0) {
				//写cookie 
				var keys = [];
				if (data.data && typeof data.data === 'object') {
					for (var p in data.data) {
						App.Comm.setCookie(p, data.data[p]);
						keys.push(p);
					}
				}

				//localStorage.setItem("keys", keys.join(','));

				App.Comm.delCookie("token_cookie");
				//获取用户信息
				App.Project.Share.getUserInfo(dialog);

			} else {
				alert("登录失败");
				//登录失败			 
				$btnLogin.val("立即登录").data("islogin", false);
			}
		})

	},

	//获取用户信息
	getUserInfo(dialog) {

		var $el = dialog.element,
			that = this;

		$.ajax({
			url: '/platform/user/current'
		}).done(function(data) {

			//失败
			if (data.code != 0) {
				alert("获取用户信息失败");
				$el.find(".btnLogin").val("立即登录").data("islogin", false);
				return;
			}

			App.Comm.dispatchIE('/?commType=loginIn');
			//alert(App.Comm.getCookie('OUTSSO_AuthMAC'))
			localStorage.setItem("user", JSON.stringify(data.data));
			//alert(App.Comm.getCookie('OUTSSO_AuthMAC'))

			App.Comm.setCookie('userId', data.data.userId);
			//alert(App.Comm.getCookie('OUTSSO_AuthMAC'))

			App.Comm.setCookie('isOuter', data.data.outer);
			//是否主动退出标记 2 默认状态 1 为主动退出
			App.Comm.setCookie('IS_OWNER_LOGIN', '2');
			//绑定登陆
			App.Project.Share.bindLogin();

			App.Project.init();
			// if (!$._data($("#topBar .login")[0], "events")) {
			// 	//绑定用户信息
			// 	App.TopNav.init();
			// } 
			dialog.close()
			//alert(App.Comm.getCookie('OUTSSO_AuthMAC'))
		});
	}

}