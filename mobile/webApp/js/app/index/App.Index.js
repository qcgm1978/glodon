//@ sourceURL=App.Index.js
App.Index = {
	defaults: {
		outer: false,
		yesKnow: false,
	},
	init: function () {
		App.defaults.SearchHeightVar = undefined;
		this.loading();//加载中
		this.loadData();
		this.bindEvent();
		App.TitleBar.initPopMenu("projectPopMenu");
		App.topCloseBtn();
		App.resetScrollData();//重置滚动的数据
	},
	bindEvent: function () {
		var _this = this;
		App.TitleBar.setTitle("万达筑云项目管理平台");
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.hideHomeBtn();//隐藏顶部返回首页
		$("#todoBox").on("click", function (evt) {
			var target = $(evt.target).closest("div.indexToDoListComponent");
			if (target.length == 0) return;
			var todoId = target.data("id");
			var openUrl = target.data("url");
			var allowmobile = target.data("allowmobile");
			var read = target.data("read");
			if (allowmobile == 1) {
				window.location.href = openUrl;
				if (read == false) {
					var data = {
						todoId: todoId
					}
					App.Comm.ajax({
						type: "PUT",
						url: App.Restful.urls.todoRead,
						param: data,
						success: function (data) {
							var jsonData = $.parseJSON(data);
							if (jsonData.code == 0) {
								_this.loadData();//获取代办和已办的列表
							} else {
								alert(jsonData.message);
							}
						}
					});
				}
			} else {
				var Dlg = App.UI.Dialog.showMsgDialog({
					title: "温馨提示",
					text: "该流程不支持移动端审批，请您到电脑上审核",
					css: {
						"text-align": "center",
						"color": "#333",
					},
					okText: "我知道了",
					cancelText: "取消",
					onok: function () {
						if (read == false) {
							var data = {
								todoId: todoId
							}
							App.Comm.ajax({
								type: "PUT",
								url: App.Restful.urls.todoRead,
								param: data,
								success: function (data) {
									var jsonData = $.parseJSON(data);
									if (jsonData.code == 0) {
										_this.loadData();//获取代办和已办的列表
									}
								}
							});
						}
					},
				});
				$(Dlg.dialog).find(".commDialogCancel").css("display", "none");
				$(Dlg.dialog).find(".commDialogOk").css("width", "100%");
			}
			return false;
		})
		$("#broadcastBox").on("click", function (evt) {
			var target = $(evt.target).closest("div.indexToDoListComponent");
			if (target.length == 0) return;
			var noticeRead = target.data("noticeread");
			var noticeId = target.data("noticeid");
			var targetA = target.data("shownav");
			var targetHref = target.data("targethref");
			if (!noticeRead) {
				var data = {
					id: noticeId,
				}
				App.Comm.ajax({
					type: "get",
					url: App.Restful.urls.noticeRead,
					param: data,
					dataType: "json",
					success: function (data) {
						if (data.code == 0) {
							target.find("i").addClass("noRead");
							if (targetA) {
								cordova.exec(function () { }, function () { }, "WDNaviPlugin", "hiddenNavi", ["0"]);
								location.href = targetHref;
							} else {
								location.href = targetHref;
							}
						}
					}
				});
			} else {
				if (targetA) {
					cordova.exec(function () { }, function () { }, "WDNaviPlugin", "hiddenNavi", ["0"]);
					location.href = targetHref;
				} else {
					location.href = targetHref;
				}
			}
			return false;
		})
		if (!$("#footerBox > div").eq(0).hasClass("footer-box-select")) {
			$("#footerBox > div").eq(0).click();
		}
		$("#designBtn").off("click");
		$("#designBtn").on("click", function () {
			var openUrl = $(this).closest("a").data("href");
			location.href = openUrl;
			return false;
		})
		$("#costBtn").off("click");
		$("#costBtn").on("click", function () {
			var openUrl = $(this).closest("a").data("href");
			location.href = openUrl;
			return false;
		})
		$("#mkhBtn").off("click");
		$("#mkhBtn").on("click", function () {
			var openUrl = $(this).closest("a").data("href");
			location.href = openUrl;
			return false;
		})
		$("#qualityBtn").off("click");
		$("#qualityBtn").on("click", function () {
			var openUrl = $(this).closest("a").data("href");
			location.href = openUrl;
			return false;
		})
	},
	loading: function () {
		$("#toBox").find(".nullData").remove();
		$("#broadcastBox").find(".nullData").remove();
	},
	loadData: function () {
		var th = this;
		var todoBox = $("#todoBox");
		var broadcastBox = $("#broadcastBox");
		var lodingDom = $('<div class="loading">加载中...</div>');
		var lodingDomm = $('<div class="loading">加载中...</div>');
		var hrefStr = location.href;
		todoBox.html("");
		todoBox.append(lodingDom);
		broadcastBox.append(lodingDomm);
		var cookies = document.cookie;
		var cookieArr = cookies.split("; ");
		for (var i = 0, len = cookieArr.length; i < len; i++) {
			var arrCookie = cookieArr[i].split("=");
			if (arrCookie[0] == "yesKnow") {
				App.Index.defaults.yesKnow = arrCookie[1];
				break;
			}
		}
		if (!App.Index.defaults.yesKnow || App.Index.defaults.yesKnow == "false") {
			App.Comm.ajax({
				url: App.Restful.urls.current,
				success: function (data) {
					var jsonData = $.parseJSON(data);
					if (jsonData.code == 0) {
						App.Index.defaults.outer = jsonData.data.outer;
						App.defaults.userData = jsonData.data;
						App.defaults.outer = jsonData.data.outer;
						App.defaults.userId = jsonData.data.userId;
						th.dialogIndex(jsonData);
						th.loadLinkData();//获取首页链接的方法
						th.loadToDoData();//获取代办数据方法
						th.loadNoticeData();//获取公告数据方法
					} else {
						alert(data.message);
					}
				}
			});
		} else {
			this.loadLinkData();//获取首页链接的方法
			this.loadToDoData();//获取代办数据方法
			this.loadNoticeData();//获取公告数据方法
		}
	},
	dialogIndex: function (data) {
		var _this = this;
		var currentTime = data.data.currentTime;
		var learnStatus = data.data.learnStatus;
		var html = "";
		var dialogMessage = $("#dialogMessage");
		if (learnStatus) {
			var obj = {
				beforestationstatus: learnStatus.beforestationstatus,//是否通过上岗培训
				bsexamless: learnStatus.bsexamless,//上岗考试未通过课程数
				bsexamtotal: learnStatus.bsexamtotal,
				bslessonless: learnStatus.bslessonless,//上岗未通过课程数
				bslessontotal: learnStatus.bslessontotal,
				enddate: learnStatus.enddate,//最晚结束日期
				endday: learnStatus.endday,
				message: learnStatus.message,
				mobileurl: learnStatus.mobileurl,
				onstationstatus: learnStatus.onstationstatus,//是否通过在岗培训
				osexamless: learnStatus.osexamless,//在岗考试未通过
				osexamtotal: learnStatus.osexamtotal,
				oslessonless: learnStatus.oslessonless,//在岗课程未通过数 
				oslessontotal: learnStatus.oslessontotal,
				pturl: learnStatus.pturl,
				status: learnStatus.status
			}
			var endDateObj = new Date(obj.enddate);
			var endDate = endDateObj.getTime();
			var getFullYear = endDateObj.getFullYear();
			var getMonth = (endDateObj.getMonth() + 1) >= 10 ? endDateObj.getMonth() + 1 : "0" + (endDateObj.getMonth() + 1);
			var getDay = endDateObj.getDate() >= 10 ? endDateObj.getDate() : "0" + endDateObj.getDate();
			var endDateStr = getFullYear + "年" + getMonth + "月" + getDay + "日";
			var domainStr = "";
			var hostname = window.location.hostname;
			var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式
			if (re.test(hostname)) {
				domainStr = hostname;
			} else {
				domainStr = hostname.substring(hostname.indexOf("."));
			}
			var Days = 1, //0.02
				exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			if (obj.status == 0) {
				if (obj.beforestationstatus == 0) {
					if (obj.bslessonless != 0 && obj.bsexamless != 0) {//上岗培训课程跟考试均未完成提示：
						html = '您的上岗培训还差<i>' + obj.bslessonless + '</i>门课程和上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
					} else if (obj.bslessonless != 0 && obj.bsexamless == 0) {//上岗培训只有课程未完成时提示
						html = '您的上岗培训还差<i>' + obj.bslessonless + '</i>门课程就可以完成啦！请您尽快完成剩余的学习任务哦！'
					} else if (obj.bslessonless == 0 && obj.bsexamless != 0) {//上岗培训只有考试未完成时提示
						html = '您的上岗培训还差上岗考试就可以完成啦！请您尽快完成剩余的学习任务哦！'
					}
				} else {
					if (obj.oslessonless != 0 && obj.osexamless != 0) {//在岗培训课程跟考试均未完成提示
						html = '您的在岗培训还差<i>' + obj.oslessonless + '</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">' + endDateStr + '</i>之前完成剩余的学习任务，加油哦！';
					} else if (obj.oslessonless != 0 && obj.osexamless == 0) {//在岗培训只有课程未完成时提示
						html = '您的在岗培训还差<i>' + obj.oslessonless + '</i>门课程就可以完成啦！请最晚于<i id="endStr">' + endDateStr + '</i>之前完成剩余的学习任务，加油哦！';
					} else if (obj.oslessonless == 0 && obj.osexamless != 0) {//在岗培训只有考试未完成时提示
						html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">' + endDateStr + '</i>之前完成剩余的学习任务，加油哦！';
					}
				}
				dialogMessage.html(html);
				var Dlg = App.UI.Dialog.showCommDialog({
					element: $("#tipDialogBox")[0],
					okText: "立刻完成培训",
					cancelText: "我知道了",
					onok: function () {
						window.open(obj.mobileurl);
						return false;
					},
					oncancel: function () {

					},
					hideTitleBar: true
				})
				$(Dlg.dialog).find(".commDialogCancel").css("display", "none");
				$(Dlg.dialog).find(".commDialogOk").css("width", "100%");
			} else if (obj.status == 1) {
				if (obj.onstationstatus == "0") {
					if (obj.oslessonless != 0 && obj.osexamless != 0) {//在岗培训课程跟考试均未完成提示
						html = '您的在岗培训还差<i>' + obj.oslessonless + '</i>门课程和在岗考试就可以完成啦！请最晚于<i id="endStr">' + endDateStr + '</i>之前完成剩余的学习任务，加油哦！';
					} else if (obj.oslessonless != 0 && obj.osexamless == 0) {//在岗培训只有课程未完成时提示
						html = '您的在岗培训还差<i>' + obj.oslessonless + '</i>门课程就可以完成啦！请最晚于<i id="endStr">' + endDateStr + '</i>之前完成剩余的学习任务，加油哦！';
					} else if (obj.oslessonless == 0 && obj.osexamless != 0) {//在岗培训只有考试未完成时提示
						html = '您的在岗培训还差在岗考试就可以完成啦！请最晚于<i id="endStr">' + endDateStr + '</i>之前完成剩余的学习任务，加油哦！';
					}
					dialogMessage.html(html);
					var Dlg = App.UI.Dialog.showCommDialog({
						element: $("#tipDialogBox")[0],
						okText: "立刻完成培训",
						cancelText: "我知道了",
						onok: function () {
							window.open(obj.mobileurl);
							return false;
						},
						oncancel: function () {
							document.cookie = "yesKnow=true;expires=" + exp.toGMTString() + ";domain=" + domainStr + ";path=/";
						},
						hideTitleBar: true
					})
				}
			} else if (obj.status == 2) {
				html = '您已经被取消万达BIM项目的任职资格，不能操作平台！';
				dialogMessage.html(html);
				var Dlg = App.UI.Dialog.showCommDialog({
					element: $("#tipDialogBox")[0],
					cancelText: "我知道了",
					oncancel: function () {
						document.cookie = "yesKnow=true;expires=" + exp.toGMTString() + ";domain=" + domainStr + ";path=/";
						cordova.exec(null, null, "WDNaviPlugin", "backAction", ["1"]);
					},
					hideTitleBar: true
				})
				$(Dlg.dialog).find(".commDialogCancel").css("width", "100%");
				$(Dlg.dialog).find(".commDialogOk").css("display", "none");
			} else if (obj.status == 3) {
				document.cookie = "yesKnow=true;expires=" + exp.toGMTString() + ";domain=" + domainStr + ";path=/";
			}
		}
	},
	loadLinkData: function () {//获取首页链接的方法
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.entranceLink,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) {
					var designBtn = $("#designBtn");
					var mkhBtn = $("#mkhBtn");
					var costBtn = $("#costBtn");
					var qualityBtn = $("#qualityBtn");
					var data = data.data;
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i].name == "设计") {
							designBtn.attr("data-href", data[i].url);
							continue;
						} else if (data[i].name == "模块化") {
							mkhBtn.attr("data-href", data[i].url);
							continue;
						} else if (data[i].name == "成本") {
							costBtn.attr("data-href", data[i].url);
							continue;
						} else if (data[i].name == "质监") {
							qualityBtn.attr("data-href", data[i].url);
							continue;
						}
					}
				} else {
					alert("获取首页入口链接报错:" + JSON.stringify(data));
				}
			}
		});
	},
	loadToDoData: function () {//获取代办数据方法
		var th = this;
		var data = {
			title: "",
			status: 1,//代办或者已办 
			pageIndex: "1",
			pageItemCount: "3",
		}
		var todoBox = $("#todoBox");
		if (todoBox.find(".loading").length == 0) {
			var lodingDom = $('<div class="loading">加载中...</div>');
			todoBox.html("");
			todoBox.append(lodingDom);
		}
		if (!App.Index.defaults.outer) {
			var listComponent = $('<div class="indexToDoListComponent" data-read={{read}} data-allowmobile={{allowMobile}} data-url="{{pcUrl}}" data-id="{{id}}" data-stat={{sysFromName}} id="todo" style="display:none;"><i class="{{noRead}}">&nbsp;</i><p>[{{status}}级]{{title}}</p><div class="info {{noBorder}}">{{planStartDate}}{{planFinishDate}}</div></div>');
		} else {
			var listComponent = $('<div class="indexToDoListComponent" data-read={{read}} data-allowmobile={{allowMobile}} data-url="{{pcUrl}}" data-id="{{id}}" id="todo" style="display:none;"><i class="{{noRead}}">&nbsp;</i><p>[{{sysFromName}}]{{title}}</p><div class="info {{noBorder}}">{{planStartDate}}{{planFinishDate}}</div></div>');
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.todo,
			param: data,
			dataType: "json",
			success: function (data) {
				todoBox.html("");
				todoBox.append(listComponent);
				if (data.code == 0) {
					$("#todoNum").html("待办(" + data.data.totalItemCount + ")");
					if (data.data.items.length == 0) {
						$("#todoBox").css("background", "none");
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						todoBox.append(nullData);
					} else {
						todoBox.find(".nullData").remove();
						th.viewTodo(data.data.items);
					}
				} else {
					alert(data.message + "\n" + data.code);
				}
			}
		});
	},
	loadNoticeData: function () {//获取公告数据方法
		var th = this;
		var data = {
			title: "",
			status: 1,//是否已发布
			pageIndex: "1",
			pageItemCount: "3",
		}
		var broadcastBox = $("#broadcastBox");
		var lodingDom = $('<div class="loading">加载中...</div>');
		if (broadcastBox.find(".loading").length == 0) {
			var lodingDom = $('<div class="loading">加载中...</div>');
			broadcastBox.html("");
			broadcastBox.append(lodingDom);
		}
		var listComponent = $('<div class="indexToDoListComponent" id="broadcast" data-targethref={{href}} data-noticeread={{noticeRead}} data-noticeid={{id}} data-shownav={{showNav}} style="display:none;"><a href="javascript:;"><i class="{{noRead}}">&nbsp;</i><p>{{title}}</p><div class="info {{noBorder}}"><span class="fl">{{publishTime}}</span></div></a></div>');
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.notice,
			param: data,
			dataType: "json",
			success: function (data) {
				broadcastBox.html("");
				broadcastBox.append(listComponent);
				if (data.code == 0) {
					if (data.data.items.length == 0) {
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						$("#broadcastBox").css("background", "none");
						broadcastBox.append(nullData);
						$("#broadcastBox").css("background", "none").find('.nullData').css('top', '1.7rem');

					} else {
						broadcastBox.find(".nullData").remove();
						th.viewBroadcast(data.data.items);
					}
				} else {
					alert("获取公告报错:" + JSON.stringify(data));
				}
			}
		});
	},
	viewTodo: function (data) {//输出代办的页面
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#todo")[0], /*页面的DOM元素*/
			data: data,
			count: 5,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				if (item.planStartDate == null && item.planFinishDate == null) {
					return {
						"id": item.id,
						"pcUrl": item.mobileUrl,
						"sysFromName": item.sysFromName,
						"allowmobile": item.allowmobile,
						"read": item.read,
						"planStartDate": '<span class="fl">' + Assister.Date.getDateFromLong(item.receiveTime) + '</span>',
						"planFinishDate": '<span class="fl infoEndTime noIcon">' + item.initiatorName + '</span>',
						"noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : "",
					}
				} else {
					return {
						"id": item.id,
						"pcUrl": item.mobileUrl,
						"sysFromName": item.sysFromName,
						"allowmobile": item.allowmobile,
						"read": item.read,
						"planStartDate": '<span class="fl">开始：' + Assister.Date.getDateFromLong(item.planStartDate) + '</span>',
						"planFinishDate": '<span class="fl infoEndTime noIcon">完成：' + Assister.Date.getDateFromLong(item.planFinishDate) + '</span>',
						"noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : "",
					}
				}
			}
		});
	},
	viewBroadcast: function (data) {
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#broadcast")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				if (item.type == 1) {
					return {
						"id": item.id,
						"href": item.href,
						"noticeRead": item.read,
						"showNav": "true",
						"publishTime": Assister.Date.getDateCommon(item.publishTime),
						"noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : ""
					}
				} else if (item.type == 2) {
					return {
						"id": item.id,
						"href": '#/noticeDetail/{{id}}/index',
						"noticeRead": item.read,
						"showNav": "false",
						"publishTime": Assister.Date.getDateCommon(item.publishTime),
						"noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : ""
					}
				}
			}
		});
	}
};
