//@ sourceURL=App.TodoList.js
App.TodoList = {
	defaults: {
		title: '',//搜索的字段
		searchVal: '',//搜索的字段
		status: 1,//默认是代办 已办是2
		pageIndex: 1,//默认取第一页
		pageNum: 10,//默认每页十条
		searchBool: false,
		flag: true,
	},
	init: function () {
		var _this = this;
		App.TodoList.defaults.title = "";
		App.TodoList.defaults.searchVal = "";
		App.TodoList.defaults.status = 1;
		App.TodoList.defaults.flag = true;
		App.TodoList.defaults.searchBool = false;
		this.initHtml();
		$(function () {
			if (!_this.defaults.searchBool) {
				if (localStorage.getItem('todoObj')) {
					_this.defaults.pageIndex = JSON.parse(localStorage.getItem('todoObj')).pageIndex;
					_this.defaults.pageNum = JSON.parse(localStorage.getItem('todoObj')).pageIndex * 10;
				}
			}
			_this.initHandle();//初始化方法
			_this.loadToDoData();//获取代办和已办的列表
			_this.setToDoRead();//设置代办是否已读
			_this.searchInit();//初始化搜索方法
		})
	},
	initHtml: function () {
		App.TitleBar.setTitle("待办");
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.returnCallback("#/index");
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom", 0);
	},
	searchInit: function () {//搜索初始化方法
		var _this = this;
		$("#searchBtn").on("click", function () {
			var searchVal = $("#searchInput").val().trim();
			App.TodoList.defaults.title = encodeURIComponent(searchVal);
			App.TodoList.defaults.searchVal = searchVal;
			App.TodoList.defaults.pageIndex = 1;
			$(".loadMore").html(App.defaults.loadMoreText).show();
			$("#searchCommonBox").css("padding-top", "2.906rem").css("display", "block");
			App.TodoList.defaults.searchBool = true;
			if (localStorage.getItem('todoObj')) {
				localStorage.removeItem('todoObj');
			}
			_this.loadToDoData();//执行搜索获取数据
		})
		$("#searchInput").on("keyup", function (evt) {
			var targetVal = $(evt.target).val().trim();
			if (targetVal.length > 0) {
				$("#clearSearchVal").css("display", "block");
			}
		})
		$("#clearSearchVal").on("click", function () {//清空输入框的文字
			App.TodoList.defaults.title = "";
			$(this).hide();
			$("#searchInput").val("");
		})
		$("#clearSearchBtn").on("click", function () {//点击清空搜索的文字
			$("#searchCommonBox").css("display", "none");
			$("#clearSearchVal").css("display", "none");
			$("#searchListBox").html("");
			$("#searchInput").val("");
			App.TodoList.defaults.title = "";
			App.TodoList.defaults.pageIndex = 1;
			App.TodoList.defaults.searchBool = false;
			$(".loadMore").html(App.defaults.loadMoreText).show();
			if (localStorage.getItem('todoObj')) {
				localStorage.removeItem('todoObj');
			}
			_this.loadToDoData();
		})
	},
	removeIcon: function (target) {//去未读标记
		target.find("i").addClass('noRead');
	},
	setToDoRead: function () {//设置代办是否已读
		var _this = this;
		$("#todoList").on("click", function (evt) {
			var target = $(evt.target).closest("li");
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
								_this.removeIcon();
							}
						}
					});
				}
			} else {
				setTimeout(function () {
					var Dlg = App.UI.Dialog.showMsgDialog({
						title: "温馨提示",
						text: "该流程不支持移动端审批，请您到电脑上审核",
						css: {
							"text-align": "center"
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
											_this.removeIcon(target);
										}
									}
								});
							}
						},
					});
					$(Dlg.dialog).find(".commDialogCancel").css("display", "none");
					$(Dlg.dialog).find(".commDialogOk").css("width", "100%");
				}, 340)
			}
			return false;
		})
		$("#searchListBox").on("click", "li", function (evt) {
			var target = $(evt.target).closest("li");
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
								_this.loadToDoData();//获取代办和已办的列表
							}
						}
					});
				}
			} else {
				var Dlg = App.UI.Dialog.showMsgDialog({
					title: "温馨提示",
					text: "该流程不支持移动端审批，请您到电脑上审核",
					css: {
						"text-align": "center"
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
										_this.loadToDoData();//获取代办和已办的列表
									}
								}
							});
						}
					},
				});
				$(Dlg.dialog).find(".commDialogCancel").css("display", "none");
				$(Dlg.dialog).find(".commDialogOk").css("width", "100%");
			}
		})
	},
	initHandle: function () {//初始化方法

		var _this = this;
		$("#tabDom").on("click", "li", function (event) {
			if (App.TodoList.defaults.flag) {
				var target = $(event.target).closest("li");
				var type = target.data("type");
				if (localStorage.getItem('todoObj')) {
					localStorage.removeItem('todoObj');
				}
				if (!target.hasClass("selectLi")) {
					App.TodoList.defaults.pageIndex = 1;
					App.TodoList.defaults.status = type;
					$(".loadMore").html(App.defaults.loadMoreText).show();
					if (App.TodoList.defaults.searchBool) {
						$("#searchCommonBox").css("display", "block");
						$("#searchCommonBox").css("display", "none");
						$("#clearSearchVal").css("display", "none");
						$("#searchListBox").html("");
						App.TodoList.defaults.title = "";
						App.TodoList.defaults.searchBool = false;
					}
					target.addClass('selectLi').siblings().removeClass("selectLi");
					_this.loadToDoData();//获取代办和已办的列表
				}
			}
		})
	},
	bindScrollHandle: function () {//初始化滚动条方法
		var _this = this;
		var loadMore = $(".loadMore");
		var scrollEle = !this.defaults.searchBool ? "#todoContentBox" : "#searchCommentDown";
		this.defaults.listScroll = new IScroll(scrollEle, {
			mouseWheel: true,//鼠标滚轮
			probeType: 3,//像素级触发 执行回调
			scrollbars: false,//滚轴是否显示默认是
			truebounceTime: 600,//弹力动画持续的毫秒数
			click: true,
		});
		if (!this.defaults.searchBool) {
			if (localStorage.getItem('todoObj')) {
				// this.defaults.listScroll.scrollTo(0, JSON.parse(localStorage.getItem('todoObj')).scrollPos, 10);
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
			_this.defaults.flag = false;

		});
		this.defaults.listScroll.on('scrollEnd', function () {
			if (!_this.defaults.searchBool) {
				var todoObj = {
					scrollPos: this.y
				}
				localStorage.setItem('todoObj', JSON.stringify(todoObj));
			}
			if (this.y == this.maxScrollY && this.maxScrollY < 0) {
				// if (!_this.defaults.flag) return;
				_this.defaults.flag = false;
				_this.getMoreDataHandle();//获取更多
			} else {
				_this.defaults.flag = true;

			}
		});
	},
	getMoreDataHandle: function () {//滚动加载更多的方法
		var _this = this;
		var data = {
			title: App.TodoList.defaults.title,
			status: App.TodoList.defaults.status,//代办或者已办 
			pageIndex: App.TodoList.defaults.pageIndex + 1,
			pageItemCount: "10",
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.todo,
			param: data,
			dataType: "json",
			success: function (data) {
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
				_this.defaults.flag = true;
			}
		});
	},
	loadMorePageHandle: function (data) {//加载功能多添加到页面的方法
		var html = '',
			nameStr = "",
			name = "",
			todoList = $("#todoList");
		if (App.TodoList.defaults.searchBool) {
			todoList = $("#searchListBox")
		}
		for (var i = 0, iLen = data.length; i < iLen; i++) {
			if (App.TodoList.defaults.searchBool) {
				nameStr = data[i].title;
				name = App.searchHighlightHandle(App.TodoList.defaults.searchVal, nameStr);//搜索结果高亮效果的方法
			} else {
				name = data[i].title;
			}

			html += '<li data-read=' + data[i].read + ' data-allowmobile=' + data[i].allowMobile + ' data-id=' + data[i].id + ' data-url=' + data[i].mobileUrl + ' data-stat=' + data[i].sysFromName + '>';
			if (data[i].read == true) {
				html += '<i class="noRead">&nbsp;</i>';
			} else {
				html += '<i>&nbsp;</i>';
			}
			html += `<p>[${App.defaults.outer ? data[i].sysFromName : (data[i].status + '级')}]${name}</p>` +
				'<div class="info border-bottom-color">';
			if (data[i].planStartDate == null && data[i].planFinishDate == null) {
				html += '<span class="fl">' + Assister.Date.getDateFromLong(data[i].receiveTime) + '</span>' +
					'<span class="fl infoEndTime noIcon">' + data[i].initiatorName + '</span>';
			} else {
				html += '<span class="fl">开始：' + Assister.Date.getDateFromLong(data[i].planStartDate) + '</span>' +
					'<span class="fl infoEndTime noIcon">完成：' + Assister.Date.getDateFromLong(data[i].planFinishDate) + '</span>';
			}
			html += '</div>' +
				'</li>'
		}
		todoList.append(html);
	},
	loadToDoData: function () {//获取待办和已办数据方法
		var th = this;
		var data = {
			title: App.TodoList.defaults.title,
			status: App.TodoList.defaults.status,//代办或者已办 
			pageIndex: 1,
			pageItemCount: App.TodoList.defaults.pageNum,
		}
		var todoList = $("ul#todoList");
		var searchListBox = $("#searchListBox");
		var todoScrollBox = $(".todoScrollBox");
		var todoSearchScrollBox = $(".todoSearchScrollBox");
		if (!App.defaults.outer) {
			var listComponent = $('<li id="todoComponent" data-read={{read}} data-allowmobile={{allowMobile}} data-id="{{id}}" data-url="{{pcUrl}}" data-stat={{sysFromName}} style="display:none"><i class="{{noRead}}">&nbsp;</i><p>[{{status}}级]{{title}}</p><div class="info {{noBorder}}">{{planStartDate}}{{planFinishDate}}</div></li>');
			var listSearchComponent = $('<li id="todoSearchComponent" data-read={{read}} data-allowmobile={{allowMobile}} data-id="{{id}}" data-url="{{pcUrl}}" style="display:none"><i class="{{noRead}}">&nbsp;</i><p>[{{status}}级]{{name}}</p><div class="info {{noBorder}}">{{planStartDate}}{{planFinishDate}}</div></li>');
		} else {
			var listComponent = $('<li id="todoComponent" data-read={{read}} data-allowmobile={{allowMobile}} data-id="{{id}}" data-url="{{pcUrl}}" data-stat={{sysFromName}} style="display:none"><i class="{{noRead}}">&nbsp;</i><p>[{{sysFromName}}]{{title}}</p><div class="info {{noBorder}}">{{planStartDate}}{{planFinishDate}}</div></li>');
			var listSearchComponent = $('<li id="todoSearchComponent" data-read={{read}} data-allowmobile={{allowMobile}} data-id="{{id}}" data-url="{{pcUrl}}" style="display:none"><i class="{{noRead}}">&nbsp;</i><p>[{{sysFromName}}]{{name}}</p><div class="info {{noBorder}}">{{planStartDate}}{{planFinishDate}}</div></li>');
		}
		if (App.TodoList.defaults.searchBool) {
			todoSearchScrollBox.css("transform", "translate(0px,0px)");
			searchListBox.html("");
			searchListBox.append(listSearchComponent);
		} else {
			todoList.html("");
			todoList.append(listComponent);
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.todo,
			param: data,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) {
					if (App.TodoList.defaults.searchBool) {
						$("#resultNum").html(data.data.totalItemCount);
					}
					if (data.data.items.length < 10) {
						$(".loadMore").hide();
					} else {
						$(".loadMore").show();
						if (!App.TodoList.defaults.searchBool) {
							todoScrollBox.css("transform", "translate(0px,0px)");

						}
					}
					if (data.data.items.length == 0) {
						var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
						if (App.TodoList.defaults.searchBool) {
							searchListBox.append(nullData);
							return;
						}
						todoList.html(nullData);
					} else {
						if (th.defaults.listScroll) {
							th.defaults.listScroll.destroy();
						}
						if (App.TodoList.defaults.searchBool) {
							th.viewSearchTodoPage(data.data.items);//搜索渲染的页面
							th.bindScrollHandle();//初始化滚动条方法
							return;
						}
						th.viewTodo(data.data.items);
						th.bindScrollHandle();//初始化滚动条方法
					}
				}
			}
		});
	},
	viewSearchTodoPage: function (data) {
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#todoSearchComponent")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				var nameStr = item.title;
				var name = App.searchHighlightHandle(App.TodoList.defaults.searchVal, nameStr);//搜索结果高亮效果的方法
				if (item.planStartDate == null && item.planFinishDate == null) {
					return {
						"id": item.id,
						"name": name,
						"pcUrl": item.mobileUrl,
						"sysFromName": item.sysFromName,
						"allowMobile": item.allowMobile,
						"read": item.read,
						"planStartDate": '<span class="fl">' + Assister.Date.getDateFromLong(item.receiveTime) + '</span>',
						"planFinishDate": '<span class="fl infoEndTime noIcon">' + item.initiatorName + '</span>',
						"noBorder": false ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : "",
					}
				} else {
					return {
						"id": item.id,
						"name": name,
						"pcUrl": item.mobileUrl,
						"sysFromName": item.sysFromName,
						"allowMobile": item.allowMobile,
						"read": item.read,
						"planStartDate": '<span class="fl">开始：' + Assister.Date.getDateFromLong(item.planStartDate) + '</span>',
						"planFinishDate": '<span class="fl infoEndTime noIcon">完成：' + Assister.Date.getDateFromLong(item.planFinishDate) + '</span>',
						"noBorder": false ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : "",
					}
				}
			}
		});
	},
	viewTodo: function (data) {
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#todoComponent")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				if (item.planStartDate == null && item.planFinishDate == null) {
					return {
						"id": item.id,
						"pcUrl": item.mobileUrl,
						"sysFromName": item.sysFromName,
						"allowMobile": item.allowMobile,
						"read": item.read,
						"planStartDate": '<span class="fl">' + Assister.Date.getDateFromLong(item.receiveTime) + '</span>',
						"planFinishDate": '<span class="fl infoEndTime noIcon">' + item.initiatorName + '</span>',
						"noBorder": false ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : "",
					}
				} else {
					return {
						"id": item.id,
						"pcUrl": item.mobileUrl,
						"sysFromName": item.sysFromName,
						"allowMobile": item.allowMobile,
						"read": item.read,
						"planStartDate": '<span class="fl">开始：' + Assister.Date.getDateFromLong(item.planStartDate) + '</span>',
						"planFinishDate": '<span class="fl infoEndTime noIcon">完成：' + Assister.Date.getDateFromLong(item.planFinishDate) + '</span>',
						"noBorder": false ? "border-no-color" : "border-bottom-color",
						"noRead": item.read == true ? "noRead" : "",
					}
				}
			}
		});
	}
};
