//@ sourceURL=App.NotesList.js
App.NotesList = {
	defaults: {
		versionName: '',
		projectName: '',
		projectId: '',
		projectVersionId: '',
		notesName: '',//批注名字有用于搜索
		args: '',
		searchCan: true,
		toMeBool: true,
		searchBool: false,
		getMoreFlag: true,
		pageIndex: 1,
		pageNum: 10,
		notesId: "",
		versionType: 1,
		versionPData: [],
		versionCData: [],
		versionStatus: {
			"1": "待上传",
			"2": "上传中",
			"3": "待审核",
			"4": "审核中",
			"5": "审核通过",
			"6": "审核退回",
			"7": "待移交",
			"8": "移交退回",
			"9": "已移交",
			"10": "待审核",
			"11": "审核通过",
			"12": "审核退回",
			"13": "待移交",
			"14": "移交退回",
			"15": "申请中"
		}
	},
	init: function (args) {
		var _this = this;
		if (window.location.href.indexOf("toMeBool=") != -1) {
			if (window.location.href.substr(window.location.href.indexOf("toMeBool=") + 9) == "false") {
				App.NotesList.defaults.toMeBool = false;
			} else {
				App.NotesList.defaults.toMeBool = true;
			}
		} else {
			App.NotesList.defaults.toMeBool = true;
		}
		if (App.NotesList.defaults.toMeBool) {
			$(".notesCheckbox").addClass("notesSelectCheckbox");
		} else {
			$(".notesCheckbox").removeClass("notesSelectCheckbox");
		}
		App.NotesList.defaults.args = args;
		App.NotesList.defaults.projectName = args.name;
		App.NotesList.defaults.projectId = args.projectId;
		App.NotesList.defaults.projectVersionId = args.projectVersionId;
		App.NotesList.defaults.folderId = args.folderId ? args.folderId : "";
		App.NotesList.defaults.searchBool = false;
		App.NotesList.defaults.getMoreFlag = true;
		App.NotesList.defaults.notesName = "";
		App.NotesList.defaults.pageNum = 10;
		App.NotesList.defaults.versionName = "";
		this.initHtml();
		$(function () {
			if (!_this.defaults.searchBool) {
				if (App.defaults.notesObj) {
					_this.defaults.pageIndex = App.defaults.notesObj.pageIndex;
					_this.defaults.pageNum = App.defaults.notesObj.pageIndex * 10;
				}
			}
			_this.initHandle();//初始化一些事件
			_this.searchInit();//初始化搜索方法
			if (App.defaults.outer == undefined) {
				App.Comm.ajax({
					url: App.Restful.urls.current,
					success: function (data) {
						var jsonData = $.parseJSON(data);
						if (jsonData.code == 0) {
							App.defaults.userId = jsonData.data.userId;
							_this.loadNotesList();//获取批注列表的方法
						} else {
							alert(data.message);
						}
					}
				});
			} else {
				_this.loadNotesList();//获取批注列表的方法
			}
			if (!args.folderId || !App.NotesList.defaults.versionName) {
				_this.loadVersionName();//加载最新版本的方法
			} else {
				$("#versionText").html(App.NotesList.defaults.versionName);
			}
		})
	},
	searchInit: function () {//搜索初始化方法
		var _this = this;
		$("#searchBtn").on("click", function () {
			var searchVal = $("#searchInput").val().trim();
			App.NotesList.defaults.notesName = searchVal;
			if (App.NotesList.defaults.searchCan) {
				var h1 = $(".m_common_version_notes").outerHeight();
				var h2 = $(".m_common_search").outerHeight();
				$("#searchCommonBox").css("padding-top", h1 + h2).css("z-index", "199").css("display", "block");
				App.NotesList.defaults.searchBool = true;
				_this.resetHandle();//重置当前页数和显示加载更多
				_this.loadNotesList();//执行搜索获取数据
			}
		})
		$("#searchInput").on("keyup", function (evt) {
			var targetVal = $(evt.target).val().trim();
			if (targetVal.length > 0) {
				$("#clearSearchVal").css("display", "block");
			}
		})
		$("#clearSearchVal").on("click", function () {
			App.NotesList.defaults.notesName = "";
			$(this).hide();
			$("#searchInput").val("");
		})
		$("#clearSearchBtn").on("click", function () {
			$("#searchCommonBox").css("display", "none");
			$("#clearSearchVal").css("display", "none");
			$("#searchListBox").html("");
			$("#searchInput").val("");
			App.NotesList.defaults.notesName = "";
			App.NotesList.defaults.searchBool = false;
			_this.resetHandle();//重置当前页数
			_this.loadNotesList();//获取批注列表的方法
		})
	},
	initHtml: function () {
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.hideHomeBtn();//隐藏顶部返回首页
		App.TitleBar.setTitle(App.NotesList.defaults.projectName + "批注");
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom", 0);
		if (!$("#footerBox > div").eq(1).hasClass("footer-box-select")) {
			$("#footerBox > div").eq(1).click();
		}
	},
	suc: function () {
		$('.m_versionBgBox').click()
		cordova.exec(this.suc, this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);
	},
	fail: function () {

	},
	initHandle: function () {//初始化一些事件
		var _this = this;
		this.setReturnHref();//设置返回按钮的链接地址
		var projectVersionBox = $(".projectVersionBox");
		var notesCheckbox = $(".notesCheckbox");
		var notesComponentBox = $("#notesComponentBox");
		var searchListBox = $("#searchListBox");
		projectVersionBox.on("click", function () {//点击版本执行的的方法
			var m_versionBgBox = $('<div class="m_versionBgBox"></div>');
			var m_versionBox = $('<div class="m_versionBox"><div class="m_versionTabBox border-bottom-color"><ul id="m_tab_box"><li data-version="1" class="m_selectTab">发布版本<span></span></li><li data-version="2">变更版本<span></span></li></ul></div><div class="m_versionSearchBox"><div class="m_common_search border-bottom-color"><div class="m_common_search_relative"><div class="m_common_search_input_box"><i></i><input id="searchVersionInput" type="text" name="" placeholder="关键字"><span id="clearVersion"></span><button id="searchVersionBtn" class="border-no-color">搜索</button></div><div class="m_common_search_relative_btn"></div></div></div></div><div class="m_versionListBox"><div class="loading">加载中...</div><div class="m_versionListScrollBox"><ul id="m_versionComponetBox"></ul><div class="nullData"><div class="nullDataImg"></div><p>暂时还没有任何内容哦～</p></div></div></div></div>');
			$("body").append(m_versionBgBox);
			$("body").append(m_versionBox);
			var osStr = navigator.userAgent;
			var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
			var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if (isAndroid && !isiOS) {
				cordova.exec(_this.suc, _this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "true" }]);//注册返回键事件
			}
			setTimeout(function () {
				m_versionBox.addClass('m_versionBox_show');
				_this.loadVersionData();//加载版本列表的方法
			}, 50);
			m_versionBgBox.on("click", function () {
				m_versionBox.removeClass('m_versionBox_show');
				if (isAndroid && !isiOS) {
					cordova.exec(this.suc, this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
				}
				setTimeout(function () {
					App.NotesList.defaults.versionType = 1;
					App.NotesList.defaults.versionPData = [];
					App.NotesList.defaults.versionCData = [];
					$("#searchVersionInput").val('');
					m_versionBgBox.remove();
					m_versionBox.remove();
				}, 50);
			})
			$("#clearVersion").on("click", function () {
				$(this).hide();
				$("#searchVersionInput").val("");
			})
			$("#searchVersionInput").on("keyup", function (evt) {
				var targetVal = $(evt.target).val().trim();
				if (targetVal.length > 0) {
					$("#clearVersion").css("display", "block");
				}
			})
			$("#m_tab_box").on("click", "li", function (evt) {
				var target = $(evt.target);
				var versionType = target.data("version");
				if (!target.hasClass('m_selectTab')) {
					target.siblings().removeClass('m_selectTab').end().addClass('m_selectTab');
					App.NotesList.defaults.versionType = versionType;
					$("#clearVersion").hide();
					$("#searchVersionInput").val('');
					var m_versionListBox = $(".m_versionListBox");
					m_versionListBox.find(".loading").show();
					m_versionListBox.find(".m_versionListScrollBox ul").hide();
					_this.initVersionHandle();//切换标签之后执行的方法
				}
				return false;
			})
			$("#m_versionComponetBox").on("click", "li", function (evt) {
				var target = $(evt.target).closest("li");
				var versionid = target.data("versionid");
				var versionName = target.html().trim();
				var versionText = $("#versionText");
				var notesCheckbox = $(".notesCheckbox");
				if (versionid) {
					App.NotesList.defaults.notesName = "";
					App.NotesList.defaults.toMeBool = true;
					notesCheckbox.addClass('notesSelectCheckbox');
					App.NotesList.defaults.projectVersionId = versionid;
					_this.setReturnHref();//设置返回按钮的链接地址
					versionText.html(versionName);
					m_versionBgBox.click();
					$("#searchCommonBox").css("display", "none");
					$("#clearSearchVal").css("display", "none");
					$("#searchListBox").html("");
					App.NotesList.defaults.notesName = "";
					App.NotesList.defaults.searchBool = false;
					_this.resetHandle();//重置当前页数
					_this.loadNotesList();//加载项目列表方法
				}
			});
			$("#searchVersionBtn").on("click", function () {//版本搜索功能
				var searchVersionInputVal = $("#searchVersionInput").val().trim();
				_this.initVersionHandle(searchVersionInputVal);//搜索版本功能
			})
		})
		notesCheckbox.on("click", function (evt) {//点击与我相关 执行的方法
			if (App.NotesList.defaults.searchCan && _this.defaults.getMoreFlag) {

				if ($(this).hasClass('notesSelectCheckbox')) {
					$(this).removeClass('notesSelectCheckbox');
					App.NotesList.defaults.toMeBool = false;
				} else {
					$(this).addClass('notesSelectCheckbox');
					App.NotesList.defaults.toMeBool = true;
				}
				_this.resetHandle();//重置当前页数
				_this.loadNotesList();//获取批注列表的方法
			}
			return false;
		})
		notesComponentBox.on("click", function (evt) {
			var target = $(evt.target);
			var deleteid = target.data("deleteid");
			var closestEle = "",
				openUrl = "";
			if (deleteid) {
				setTimeout(function () {
					var Dlg = App.UI.Dialog.showMsgDialog({
						title: '提示',
						text: '确认删除该批注',
						titleColor: "#FF1717",
						css: {
							"line-height": "0.5333rem",
							"font-size": "0.3733rem",
							"text-align": "center"
						},
						onok: function () {
							if (!_this.defaults.searchBool) {
								if (App.defaults.notesObj) {
									_this.defaults.pageNum = _this.defaults.pageIndex * 10;
								}
							}
							_this.deleteNotesHandle(evt);
						},
						oncancel: function () {
						}
					})
					$(Dlg.dialog).find(".commDialogContainer").css("padding-top", "0");
					$(Dlg.dialog).find(".commDialogCancel").css("display", "block");
					$(Dlg.dialog).find(".wMobileDialog-titleBar").css("display", "block");
					$(Dlg.dialog).find(".commDialogOk").css("width", "50%");
				}, 340)
			} else {
				closestEle = target.closest("li");
				openUrl = closestEle.data("href");
				if (App.defaults.notesDetailsObj) {
					App.defaults.notesDetailsObj = undefined;
				}
				if (App.defaults.maxCommentNumber) {
					App.defaults.maxCommentNumber = undefined;
				}
				if (App.defaults.maxNumPos || App.defaults.maxNumPos == 0) {
					App.defaults.maxNumPos = undefined;
				}
				if (!_this.defaults.searchBool) {
					if (App.defaults.notesObj) {
						App.defaults.notesObj.pageIndex = _this.defaults.pageIndex;
					}
				}
				location.href = openUrl;
			}
			return false;
		})
		searchListBox.on("click", function (evt) {
			var target = $(evt.target);
			var deleteid = target.data("deleteid");
			var closestEle = "",
				openUrl = "";
			if (deleteid) {
				setTimeout(function () {
					var Dlg = App.UI.Dialog.showMsgDialog({
						title: '提示',
						text: '确认删除该批注',
						titleColor: "#FF1717",
						css: {
							"line-height": "0.5333rem",
							"font-size": "0.3733rem",
							"text-align": "center"
						},
						onok: function () {
							_this.deleteNotesHandle(evt)
							if (!_this.defaults.searchBool) {
								if (App.defaults.notesObj) {
									App.defaults.notesObj.pageIndex = _this.defaults.pageIndex;
								}
							}
						},
						oncancel: function () {
						}
					})
					$(Dlg.dialog).find(".commDialogContainer").css("padding-top", "0");
					$(Dlg.dialog).find(".commDialogCancel").css("display", "block");
					$(Dlg.dialog).find(".wMobileDialog-titleBar").css("display", "block");
					$(Dlg.dialog).find(".commDialogOk").css("width", "50%");
				}, 340)
			} else {
				closestEle = target.closest("li");
				openUrl = closestEle.data("href");
				if (App.defaults.notesObj) {
					App.defaults.notesObj = undefined;
				}
				location.href = openUrl;

			}
			return false;
		})
	},
	setReturnHref: function () {//设置返回按钮的链接地址
		var windowHref = window.location.href;
		if (windowHref.indexOf("returnpage") > -1) {
			App.TitleBar.returnCallback(function () {
				if (App.defaults.notesObj) {
					App.defaults.notesObj = undefined;
				}
				history.back();
			})
		} else {
			App.TitleBar.returnCallback("#/project/" + App.NotesList.defaults.projectId + "/" + App.NotesList.defaults.projectVersionId + "/" + App.NotesList.defaults.projectName + "/" + App.NotesList.defaults.folderId);
		}
	},
	deleteNotesHandle: function (evt) {//删除批注方法
		var _this = this;
		App.Comm.ajax({
			type: "delete",
			url: App.Restful.urls.deleteNotesList,
			param: {
				projectId: parseInt(App.NotesList.defaults.projectId),
				viewPointId: $(evt.target).data("deleteid")
			},
			dataType: "json",
			success: function (data) {
				if (data.code == 0) {
					_this.loadNotesList();//获取批注列表的方法
				} else {
					alert("删除批注报错:::" + JSON.stringify(data));
				}
			}
		});
	},
	deleteSuccessHandle: function (evt) {//删除成功
		$(evt.target).closest("li").remove();
		if (this.defaults.listScroll) {
			this.defaults.listScroll.refresh();
		}
	},
	loadVersionData: function () {//加载版本列表的方法
		var th = this;
		var data = {
			"projectId": App.NotesList.defaults.projectId,
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.projectVersionList,
			param: data,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) {
					for (var i = 0, len = data.data.length; i < len; i++) {
						if (data.data[i].versionType == 1) {
							App.NotesList.defaults.versionPData = data.data[i].item;
						} else if (data.data[i].versionType == 2) {
							App.NotesList.defaults.versionCData = data.data[i].item;
						}
					}
					th.initVersionHandle();//初始化版本列表的方法
				} else {
					alert("错误" + data);
				}
			}
		});
	},
	initVersionHandle: function (searchVal) {//初始化版本列表的方法
		var versionListData = [];
		var m_versionListBox = $(".m_versionListBox");
		m_versionListBox.find(".loading").hide();
		var m_versionComponetBox = $("#m_versionComponetBox");
		m_versionComponetBox.html("");
		var liComponent = $('<li id="m_versionComponet" data-versionid="{{id}}" class="{{noBorder}}" style="display:none">{{name}}</li>');
		if (App.NotesList.defaults.versionType == 1) {
			if (App.NotesList.defaults.versionPData.length == 0) {
				m_versionListBox.find(".nullData").show();
			} else {
				if (!searchVal) {
					for (var i = 0, len = App.NotesList.defaults.versionPData.length; i < len; i++) {
						for (var j = 0, jlen = App.NotesList.defaults.versionPData[i].version.length; j < jlen; j++) {
							versionListData.push(App.NotesList.defaults.versionPData[i].version[j]);
						}
					}
				} else {
					for (var i = 0, len = App.NotesList.defaults.versionPData.length; i < len; i++) {
						for (var j = 0, jlen = App.NotesList.defaults.versionPData[i].version.length; j < jlen; j++) {
							if (App.NotesList.defaults.versionPData[i].version[j].name.indexOf(searchVal) != -1) {
								versionListData.push(App.NotesList.defaults.versionPData[i].version[j]);
							}
						}
					}
				}
				if (versionListData.length > 0) {
					m_versionComponetBox.append(liComponent);
					m_versionListBox.find(".nullData").hide();
					m_versionListBox.find(".m_versionListScrollBox ul").show();
					this.viewVersionListPage(versionListData);
				} else {
					m_versionListBox.find(".nullData").show();
				}
			}
		} else if (App.NotesList.defaults.versionType == 2) {
			if (App.NotesList.defaults.versionCData.length == 0) {
				m_versionListBox.find(".nullData").show();
			} else {
				m_versionComponetBox.append(liComponent);
				m_versionListBox.find(".nullData").hide();
				m_versionListBox.find(".m_versionListScrollBox ul").show();
				if (!searchVal) {
					for (var i = 0, len = App.NotesList.defaults.versionCData.length; i < len; i++) {
						for (var j = 0, jlen = App.NotesList.defaults.versionCData[i].version.length; j < jlen; j++) {
							versionListData.push(App.NotesList.defaults.versionCData[i].version[j]);
						}
					}
				} else {
					for (var i = 0, len = App.NotesList.defaults.versionCData.length; i < len; i++) {
						for (var j = 0, jlen = App.NotesList.defaults.versionCData[i].version.length; j < jlen; j++) {
							if (App.NotesList.defaults.versionCData[i].version[j].name.indexOf(searchVal) != -1) {
								versionListData.push(App.NotesList.defaults.versionCData[i].version[j]);
							}
						}
					}
				}
				if (versionListData.length > 0) {
					m_versionComponetBox.append(liComponent);
					m_versionListBox.find(".nullData").hide();
					m_versionListBox.find(".m_versionListScrollBox ul").show();
					this.viewVersionListPage(versionListData);
				} else {
					m_versionListBox.find(".nullData").show();
				}
			}
		}
	},
	viewVersionListPage: function (data) {//渲染版本列表的方法
		if (data.length == 0) {
			m_versionListBox.find(".nullData").show();
		} else {
			template.repeat({
				repeatElement: $("#m_versionComponet")[0], /*页面的DOM元素*/
				data: data,
				process: function (itemObject) {
					var key = itemObject.index;
					var item = itemObject.item;
					var status = item.status;
					return {
						"id": item.id,
						"name": '<span class="text">' + item.name + '</span>' + "(" + App.NotesList.defaults.versionStatus[status] + ")",
						"noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color"
					}
				}
			});
		}
	},
	loadVersionName: function () {//加载最新版本的方法
		var data = {
			projectId: App.NotesList.defaults.projectId,
			projectVersionId: App.NotesList.defaults.projectVersionId,
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.versionName,
			param: data,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) {
					var status = data.data.status;
					var name = '<span class="text">' + data.data.name + '</span>' + "(" + App.NotesList.defaults.versionStatus[status] + ")";
					App.NotesList.defaults.versionName = name;
					if (data.data.isBimControl == 2) {
						$("#versionText").html("当前版本");
						$(".projectVersionBox").css("background", "none").off("click");
					} else {
						$("#versionText").html(name);
					}
				} else {
					alert(data);
				}
			}
		});
	},
	bindScrollHandle: function (scrollToTop) {//初始化滚动条方法
		var _this = this;
		var loadMore = $(".loadMore");
		var scrollEle = !this.defaults.searchBool ? "#notesListContentBox" : "#searchCommentDown";
		this.defaults.listScroll = new IScroll(scrollEle, {
			mouseWheel: true,//鼠标滚轮
			probeType: 3,//像素级触发 执行回调
			scrollbars: false,//滚轴是否显示默认是
			truebounceTime: 600,//弹力动画持续的毫秒数
			click: true,
		});
		if (!this.defaults.searchBool) {
			if (App.defaults.notesObj && !scrollToTop) {
				this.defaults.listScroll.scrollTo(0, App.defaults.notesObj.scrollPos, 10);
			}
		}
		this.defaults.listScroll.on('scroll', function () {
			if (this.directionY == 1) {
				if (this.y < this.maxScrollY) {
					loadMore.show();
				}
			}
		});
		this.defaults.listScroll.on('scrollStart', function () {
			_this.defaults.getMoreFlag = false;
		});
		this.defaults.listScroll.on('scrollEnd', function () {
			if (!_this.defaults.searchBool) {
				App.defaults.notesObj = {
					scrollPos: this.y
				}
			}
			if (this.y == this.maxScrollY && this.maxScrollY < 0) {
				_this.defaults.getMoreFlag = false;
				_this.getMoreDataHandle();//获取更多
			} else {
				_this.defaults.getMoreFlag = true;
			}
		});
	},
	getMoreDataHandle: function () {//获取更多
		var _this = this;
		var folderData = {//获取批注列表的参数
			"id": "",
			"projectId": App.NotesList.defaults.projectId,
			"content": App.NotesList.defaults.notesName,
			"toMeBool": App.NotesList.defaults.toMeBool,
			"projectVersionId": App.NotesList.defaults.projectVersionId,
			"pageIndex": App.NotesList.defaults.pageIndex + 1,
			"pageItemCount": 10,
			"type": 1
		}
		App.Comm.ajax({
			type: "POST",
			url: App.Restful.urls.projectNotesList,
			data: JSON.stringify(folderData),
			dataType: "json",
			contentType: "application/json",
			success: function (data) {
				_this.defaults.getMoreFlag = true;
				if (data.code == 0) {
					if (data.data.items.length > 0) {
						_this.defaults.pageIndex++;
						_this.loadMorePageHandle(data.data.items);//加载功能多添加到页面的方法
					} else {
						$(".loadMore").html(App.defaults.loadMoreBottomText);
					}
					_this.defaults.listScroll.refresh();
				} else {
					alert("获取数据出错" + data.data.message);
				}
			}
		});
	},
	loadMorePageHandle: function (data) {
		var html = '',
			href = '',
			notesLogo = '',
			notesTitle = '',
			creatorName = '',
			createTime = '',
			deleteDom = '',
			imgSrc = '',
			notesComponentBox = $("#notesComponentBox");
		if (this.defaults.searchBool) {
			notesComponentBox = $("#searchListBox")
		}
		for (var i = 0, iLen = data.length; i < iLen; i++) {
			href = '#/notesDetails/' + this.defaults.projectId + '/' + this.defaults.projectVersionId + '/' + this.defaults.projectName + '/' + this.defaults.folderId + '/' + data[i].id + '/' + data[i].fileVersionId + "/?toMeBool=" + this.defaults.toMeBool,
				notesTitle = data[i].name;
			if (this.defaults.searchBool) {
				notesTitle = App.searchHighlightHandle(this.defaults.notesName, data[i].name);//搜索结果高亮效果的方法
			}
			notesLogo = '<img src="/' + data[i].pic + '">';
			creatorName = data[i].creatorName;
			createTime = Assister.Date.getDateFromHMLong(data[i].createTime);
			if (data[i].hostType == 0) {
				imgSrc = '<img src="images/project/icon_all_model.png">';
			} else if (data[i].hostType == 1) {
				imgSrc = '<img src="images/project/icon_single_model.png">';
			} else if (data[i].hostType == 2) {
				imgSrc = '<img src="images/project/icon_dwg.png">';
			}
			if (data[i].creatorId == App.defaults.userId) {
				deleteDom = '<a href="javascript:;" data-deleteid="' + data[i].id + '">删除</a>'
			}
			html += '<li data-href="' + href + '">' +
				'<a href="javascript:;">' +
				'<div class="notesLogoBox">' + notesLogo + '</div>' +
				'<div class="notesDescBox">' +
				'<dl>' +
				'<dt>' +
				'<div class="notesTitleBox">' + notesTitle + '</div>' +
				'</dt>' +
				'<dd>' + creatorName + '  ' + createTime + '</dd>' +
				'</dl>' +
				'</div>' +
				'</a>' +
				'<div class="notesOperationBox">' + deleteDom + '<div class="notesTypeBox">' + imgSrc + '</div></div>' +
				'</li>'
		}
		notesComponentBox.append(html);
	},
	resetHandle: function () {
		if (App.NotesList.defaults.searchBool) {
			$("#notesComponentBox").find("nullData").remove();
		} else {
			$("#searchListBox").find("nullData").remove();
		}
		$(".loadMore").html(App.defaults.loadMoreText).show();
		if (App.defaults.notesObj) {
			App.defaults.notesObj = undefined;
			this.defaults.pageNum = 10;
		}
		this.defaults.pageIndex = 1;
	},
	loadNotesList: function (scrollToTop) {//获取批注列表的方法
		if (!App.NotesList.defaults.searchCan) {
			return;
		}
		App.NotesList.defaults.searchCan = false;
		var th = this;
		var notesComponentBox = $("#notesComponentBox");
		var searchListBox = $("#searchListBox");
		var notesScrollBox = $(".notesScrollBox");
		var notesSearchScrollBox = $(".notesSearchScrollBox");
		var listComponent = $('<li data-href="{{href}}" id="notesComponent" style="display:none"><a href="javascript:;"><div class="notesLogoBox">{{notesLogo}}</div><div class="notesDescBox"><dl><dt><div class="notesTitleBox">{{notesTitle}}</div></dt><dd>{{creatorName}}  {{createTime}}</dd></dl></div></a><div class="notesOperationBox">{{deleteDom}}<div class="notesTypeBox">{{imgSrc}}</div></div></li>');
		var listComponentSearch = $('<li data-href="{{href}}" id="notesSearchComponent" style="display:none"><a href="javascript:;"><div class="notesLogoBox">{{notesLogo}}</div><div class="notesDescBox"><dl><dt><div class="notesTitleBox">{{notesTitle}}</div></dt><dd>{{creatorName}}  {{createTime}}</dd></dl></div></a><div class="notesOperationBox">{{deleteDom}}<div class="notesTypeBox">{{imgSrc}}</div></div></li>');
		if (App.NotesList.defaults.searchBool) {
			notesSearchScrollBox.css("transform", "translate(0px,0px)");
			searchListBox.html(listComponentSearch);
		} else {
			notesScrollBox.css("transform", "translate(0px,0px)");
			notesComponentBox.html(listComponent);
		}
		var folderData = {//获取批注列表的参数
			"id": "",
			"projectId": App.NotesList.defaults.projectId,
			"content": App.NotesList.defaults.notesName,
			"toMeBool": App.NotesList.defaults.toMeBool,
			"projectVersionId": App.NotesList.defaults.projectVersionId,
			"pageIndex": 1,
			"pageItemCount": App.NotesList.defaults.pageNum,
			"type": 1
		}
		App.Comm.ajax({
			type: "POST",
			url: App.Restful.urls.projectNotesList,
			data: JSON.stringify(folderData),
			dataType: "json",
			cache: false,
			contentType: "application/json",
			success: function (data) {
				App.NotesList.defaults.searchCan = true;
				if (data.code == 0) {
					if (data.data.items.length < 10) {
						$(".loadMore").hide();
					} else {
						$(".loadMore").show();
					}
					if (data.data.items.length == 0) {
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						if (App.NotesList.defaults.searchBool) {
							searchListBox.append(nullData);
							$("#resultNum").html(data.data.totalItemCount);
							return;
						}
						$("#notesNumber").html(data.data.totalItemCount);
						notesComponentBox.append(nullData);
					} else {
						if (th.defaults.listScroll) {
							th.defaults.listScroll.destroy();
						}
						if (App.NotesList.defaults.searchBool) {
							$("#resultNum").html(data.data.totalItemCount);
							th.viewSearchProjectsPage(data.data.items);//搜索渲染的页面
							th.bindScrollHandle();//初始化滚动条方法
							return;
						}
						$("#notesNumber").html(data.data.totalItemCount);
						th.viewPage(data.data.items);
						th.bindScrollHandle(scrollToTop);//初始化滚动条方法
					}
				} else {
					alert(data.message);
				}
			}
		});
	},
	viewSearchProjectsPage: function (data) {//搜索渲染的页面
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#notesSearchComponent")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				var imgSrc = "",
					nameStr = item.name,
					deleteDom = "";
				if (item.hostType == 0) {
					imgSrc = '<img src="images/project/icon_all_model.png">';
				} else if (item.hostType == 1) {
					imgSrc = '<img src="images/project/icon_single_model.png">';
				} else if (item.hostType == 2) {
					imgSrc = '<img src="images/project/icon_dwg.png">';
				}
				if (item.creatorId == App.defaults.userId) {
					deleteDom = '<a href="javascript:;" data-deleteid="' + item.id + '">删除</a>'
				}
				var name = App.searchHighlightHandle(App.NotesList.defaults.notesName, nameStr);//搜索结果高亮效果的方法
				return {
					"deleteDom": deleteDom,
					"imgSrc": imgSrc,
					"href": '#/notesDetails/' + App.NotesList.defaults.projectId + '/' + App.NotesList.defaults.projectVersionId + '/' + App.NotesList.defaults.projectName + '/' + App.NotesList.defaults.folderId + '/' + item.id + '/' + item.fileVersionId + "/?toMeBool=" + App.NotesList.defaults.toMeBool,
					"notesTitle": name,
					"notesLogo": '<img src="/' + item.pic + '">',
					"creatorName": item.creatorName,
					"createTime": Assister.Date.getDateFromHMLong(item.createTime),
				}
			}
		});
	},
	viewPage: function (data) {//渲染列表的方法
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#notesComponent")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				var imgSrc = "",
					deleteDom = "";
				if (item.hostType == 0) {
					imgSrc = '<img src="images/project/icon_all_model.png">';
				} else if (item.hostType == 1) {
					imgSrc = '<img src="images/project/icon_single_model.png">';
				} else if (item.hostType == 2) {
					imgSrc = '<img src="images/project/icon_dwg.png">';
				}
				if (item.creatorId == App.defaults.userId) {
					deleteDom = '<a href="javascript:;" data-deleteid="' + item.id + '">删除</a>'
				}
				return {
					"deleteDom": deleteDom,
					"imgSrc": imgSrc,
					"href": '#/notesDetails/' + App.NotesList.defaults.projectId + '/' + App.NotesList.defaults.projectVersionId + '/' + App.NotesList.defaults.projectName + '/' + App.NotesList.defaults.folderId + '/' + item.id + '/' + item.fileVersionId + "/?toMeBool=" + App.NotesList.defaults.toMeBool,
					"notesTitle": item.name,
					"notesLogo": '<img src="/' + item.pic + '">',
					"creatorName": item.creatorName,
					"createTime": Assister.Date.getDateFromHMLong(item.createTime),
				}
			}
		});
	}
};