//@ sourceURL=App.MyNewsPage.js
App.MyNewsPage = {
	defaults: {
		title: '',
		status: 0,
		listScroll: '',
		pageCount: 1,//总页数
		pageIndex: 1,//当前页数
		pageItemCount: 10,//当前页每页条数
		totalItemCount: 1,//记录总数
		searchBool: false,//出否处于搜索状态
		searchFlag: true,//是否搜索完成
		flag: true,//是否搜索完成
	},
	init: function () {
		var self = this;
		this.defaults.status = 0;
		this.defaults.title = "";
		this.defaults.searchBool = false;
		this.defaults.searchFlag = true;
		this.defaults.pageIndex = 1;
		$(function () {
			self.initHandle();//初始化服务我的消息页面
			self.initEventHandle();//初始化我的消息页面事件
			self.initSearchHandle();//初始化页面搜索的事件
			self.getListHandle();//获取消息列表的方法
		})
	},
	initHandle: function () {//初始化服务我的消息页面
		App.TitleBar.setTitle("我的消息");//设置顶部标题
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.returnCallback("#/service");
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom", 0);
		$(".myNewsBox").css("padding-top", $(".m_common_search").outerHeight());
	},
	initEventHandle: function () {//初始化我的消息页面事件
		var self = this;
		var myNewsList = $("#myNewsList");
		var searchListBox = $("#searchListBox");
		var myNewsCheckbox = $(".myNewsCheckbox");
		myNewsList.on("click", "li", function (evt) {//点击消息列表执行的方法
			var target = $(evt.target).closest('li');
			var type = target.data("newstype");
			var newId = target.data("newsid");
			var newsStatus = target.data("newsstatus");
			var isDeleted = target.data("isdeleted");
			var feedbackId = target.data("feedbackid");
			var feedbackreplayid = target.data("feedbackreplayid");
			var projectId = target.data("projectid");
			var versionId = target.data("versionid");
			var postilId = target.data("postilid");
			var commentId = target.data("commentid");
			var fileVersionId = target.data("fileversionid");
			var projectName = target.data("projectname");
			var isCommentDeleted = target.data("iscommentdeleted");
			if (newsStatus == 0) {
				self.setNewsReadHandle(newId);//设置消息是否已读
				target.find("i").addClass('hideRead');
			}
			if (type == 0) {
				if (isDeleted == 1) {//批注已删除
					setTimeout(function () {
						var Dlg1 = App.UI.Dialog.showMsgDialog({
							title: "提示",
							text: "该批注已经被删除！",
							okText: "确定",
							onok: function () {
								return;
							},
						});
						$(Dlg1.dialog).find(".commDialogCancel").css("display", "none");
						$(Dlg1.dialog).find(".commDialogOk").css("width", "100%");
					}, 340)
				} else {
					self.locationHandle(type, projectId, versionId, postilId, fileVersionId, projectName, feedbackId, feedbackreplayid, commentId);//重定向方法
				}
			} else if (type == 1) {
				if (isDeleted == 1) {//建议反馈已删除
					setTimeout(function () {
						var Dlg2 = App.UI.Dialog.showMsgDialog({
							title: "提示",
							text: "该反馈已经被删除！",
							okText: "确定",
							onok: function () {
								return;
							},
						});
						$(Dlg2.dialog).find(".commDialogCancel").css("display", "none");
						$(Dlg2.dialog).find(".commDialogOk").css("width", "100%");
					}, 340)
				} else {
					self.locationHandle(type, projectId, versionId, postilId, fileVersionId, projectName, feedbackId, feedbackreplayid, commentId);//重定向方法
				}
			}
			return false;
		})
		searchListBox.on("click", "li", function (evt) {//点击消息列表执行的方法
			evt.stopPropagation();
			var target = $(evt.target).closest('li');
			var type = target.data("newstype");
			var newId = target.data("newsid");
			var newsStatus = target.data("newsstatus");
			var isDeleted = target.data("isdeleted");
			var feedbackId = target.data("feedbackid");
			var feedbackreplayid = target.data("feedbackreplayid");
			var projectId = target.data("projectid");
			var versionId = target.data("versionid");
			var postilId = target.data("postilid");
			var commentId = target.data("commentid");
			var fileVersionId = target.data("fileversionid");
			var projectName = target.data("projectname");
			var isCommentDeleted = target.data("iscommentdeleted");
			if (newsStatus == 0) {
				self.setNewsReadHandle(newId);//设置消息是否已读
				target.find("i").addClass('hideRead');
			}
			if (type == 0) {
				if (isDeleted == 1) {//批注已删除
					setTimeout(function () {
						var Dlg1 = App.UI.Dialog.showMsgDialog({
							title: "提示",
							text: "该批注已经被删除！",
							okText: "确定",
							onok: function () {

							},
						});
						$(Dlg1.dialog).find(".commDialogCancel").css("display", "none");
						$(Dlg1.dialog).find(".commDialogOk").css("width", "100%");
					}, 340)
				} else {
					self.locationHandle(type, projectId, versionId, postilId, fileVersionId, projectName, feedbackId, feedbackreplayid, commentId);//重定向方法
				}
			} else if (type == 1) {
				if (isDeleted == 1 && isCommentDeleted == 0) {//建议反馈已删除
					setTimeout(function () {
						var Dlg2 = App.UI.Dialog.showMsgDialog({
							title: "提示",
							text: "该反馈已经被删除！",
							okText: "确定",
							onok: function () {

							},
						});
						$(Dlg2.dialog).find(".commDialogCancel").css("display", "none");
						$(Dlg2.dialog).find(".commDialogOk").css("width", "100%");
					}, 340)
				} else {
					self.locationHandle(type, projectId, versionId, postilId, fileVersionId, projectName, feedbackId, feedbackreplayid, commentId);//重定向方法
				}
			}
			return false;
		})
		myNewsCheckbox.on("click", function (evt) {//点击未读 执行的方法
			if (self.defaults.flag) {

				if ($(this).hasClass('myNewsSelectCheckbox')) {
					$(this).removeClass('myNewsSelectCheckbox');
					self.defaults.status = "";
				} else {
					$(this).addClass('myNewsSelectCheckbox');
					self.defaults.status = 0;
				}
				if (self.defaults.searchBool) {
					self.defaults.pageSearchIndex = 1;
				} else {
					self.defaults.pageIndex = 1;
				}
				var loadMore = $(".loadMore");
				loadMore.html(App.defaults.loadMoreText);
				self.getListHandle();//从新获取数据
			}
			return false;
		})
	},
	locationHandle: function (type, projectId, versionId, postilId, fileVersionId, projectName, feedbackId, feedbackreplayid, commentId) {//重定向方法
		if (type == 0) {
			location.href = "#/notesDetails/" + projectId + "/" + versionId + "/" + projectName + "//" + postilId + "/" + fileVersionId + "/?commentId=" + commentId + "&myNews=true";
		} else if (type == 1) {
			location.href = "#/newsFeedBack/" + feedbackId + "/" + feedbackreplayid + "?myNews=true";
		} else if (type == 2) {

		}
	},
	setNewsReadHandle: function (newId) {//设置消息是否已读
		var self = this;
		var data = {
			messageId: newId
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.getMyNewsReadUrl,
			param: data,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) {
				} else {
					alert(data.message);
				}
			}
		})
	},
	initSearchHandle: function () {//初始化页面搜索的事件
		var self = this;
		var searchBtn = $("#searchBtn");
		var searchInput = $("#searchInput");
		var clearSearchVal = $("#clearSearchVal");
		var clearSearchBtn = $("#clearSearchBtn");
		var searchCommonBox = $("#searchCommonBox");
		var searchListBox = $("#searchListBox");
		var searchInput = $("#searchInput");
		var loadMore = $(".loadMore");
		searchBtn.on("click", function () {//点击搜索按钮执行的方法
			var searchVal = searchInput.val().trim();
			self.defaults.title = searchVal;
			self.defaults.pageIndex = 1;
			self.defaults.searchBool = true;
			loadMore.html(App.defaults.loadMoreText);
			searchCommonBox.css("padding-top", 0).show();
			self.getListHandle();//执行搜索获取数据
			return false;
		})
		searchInput.on("keyup", function (evt) {//输入框输入时候的方法
			var targetVal = $(evt.target).val().trim();
			if (targetVal.length > 0) {
				clearSearchVal.css("display", "block");
			}
		})
		clearSearchVal.on("click", function () {//清空输入框里面的内容的方法
			$(this).hide();
			searchInput.val("");
			return false;
		})
		clearSearchBtn.on("click", function () {//清空搜索列表的方法
			searchCommonBox.css("display", "none");
			clearSearchVal.css("display", "none");
			searchListBox.html("");
			searchInput.val("");
			self.defaults.title = "";
			self.defaults.pageIndex = 1;
			self.defaults.searchBool = false;
			self.getListHandle();//执行搜索获取数据
			return false;
		})
	},
	bindScrollHandle: function () {//初始化滚动条
		var _this = this;
		var loadMore = $(".loadMore");
		var scrollEle = !this.defaults.searchBool ? "#myNewsListBox" : "#searchCommentDown";
		this.defaults.listScroll = new IScroll(scrollEle, {
			mouseWheel: true,//鼠标滚轮
			probeType: 3,//像素级触发 执行回调
			scrollbars: false,//滚轴是否显示默认是
			truebounceTime: 600,//弹力动画持续的毫秒数
			click: true,
		});
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
			if (this.y == this.maxScrollY && this.maxScrollY < 0) {
				_this.defaults.pageIndex++;
				if (_this.defaults.pageIndex <= _this.defaults.pageCount) {
					_this.getMoreListHandle();//获取更多
				} else {
					_this.defaults.flag = true;
					loadMore.html(App.defaults.loadMoreBottomText);
				}
			}
		});
	},
	getMoreListHandle: function () {//获取更多
		var self = this;
		var data = {
			title: this.defaults.title,
			status: this.defaults.status,
			pageIndex: this.defaults.pageIndex,
			pageItemCount: this.defaults.pageItemCount,
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.getMyNewsListUrl,
			param: data,
			dataType: "json",
			success: function (data) {
				self.defaults.flag = true;
				if (data.code == 0) {
					self.appendEleHandle(data.data.items);//添加更多
					self.defaults.listScroll.refresh();
				} else {
					alert(data.message);
				}
			}
		})
	},
	getListHandle: function () {//获取消息列表的方法
		var self = this;
		var data = {
			title: this.defaults.title,
			status: this.defaults.status,//我的消息 未读和全部
			pageIndex: this.defaults.pageIndex,
			pageItemCount: "10",
		}
		var myNewsList = $("#myNewsList");
		var searchListBox = $("#searchListBox");

		var myNewsListBox = $("#myNewsListBox");
		var searchCommentDown = $("#searchCommentDown");

		var listComponent = $('<li style="display:none;" data-feedbackid="{{feedbackId}}" data-feedbackreplayid="{{replyId}}" data-iscommentdeleted="{{isCommentDeleted}}" data-projectid="{{projectId}}" data-versionid="{{versionId}}" data-projectname="{{projectName}}" data-commentid="{{commentId}}" data-postilid="{{postilId}}" data-fileversionid="{{fileVersionId}}" data-newstype="{{itemType}}" data-isdeleted="{{isDeleted}}" data-newsstatus="{{newsStatus}}" data-newsid="{{newsId}}"><a href="javascript:;"><i class="{{isRead}}"></i><h2>{{newsName}}</h2><p class="border-bottom-color">{{createStmp}}</p></a></li>');
		var listSearchComponent = $('<li style="display:none;" data-feedbackid="{{feedbackId}}" data-feedbackreplayid="{{replyId}}" data-iscommentdeleted="{{isCommentDeleted}}" data-projectid="{{projectId}}" data-versionid="{{versionId}}" data-projectname="{{projectName}}" data-commentid="{{commentId}}" data-postilid="{{postilId}}" data-fileversionid="{{fileVersionId}}" data-newstype="{{itemType}}" data-isdeleted="{{isDeleted}}" data-newsstatus="{{newsStatus}}" data-newsid="{{newsId}}"><a href="javascript:;"><i class="{{isRead}}"></i><h2>{{newsName}}</h2><p class="border-bottom-color">{{createStmp}}</p></a></li>');

		var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>");

		if (this.defaults.searchBool) {
			searchCommentDown.css("transform", "translate(0px,0px)");
			searchListBox.html("");
			searchListBox.append(listSearchComponent);
		} else {
			myNewsListBox.css("transform", "translate(0px,0px)");
			myNewsList.html("");
			myNewsList.append(listComponent);
		}
		var myNewsNumber = $("#myNewsNumber");
		var resultNum = $("#resultNum");
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.getMyNewsListUrl,
			param: data,
			dataType: "json",
			cache: false,
			success: function (data) {
				if (data.code == 0) {
					if (data.data.items.length < 10) {
						$(".loadMore").hide();
					} else {
						$(".loadMore").show();
					}
					self.defaults.pageCount = data.data.pageCount;
					if (data.data.items.length == 0) {
						if (self.defaults.searchBool) {
							searchListBox.append(nullData);
							resultNum.html(data.data.totalItemCount);//总条数
							return;
						}
						myNewsList.html(nullData);
						myNewsNumber.html(data.data.totalItemCount);//总条数
					} else {
						if (self.defaults.listScroll) {
							self.defaults.listScroll.destroy();
							self.defaults.listScroll.wrapper.style.transform = "translate(0px, 0px)"
						}
						if (self.defaults.searchBool) {
							self.viewSearchPage(data.data.items);//搜索渲染的页面
							resultNum.html(data.data.totalItemCount);//总条数
							self.bindScrollHandle();//初始化滚动条方法
							return;
						}
						self.viewPage(data.data.items);
						myNewsNumber.html(data.data.totalItemCount);//总条数
						self.bindScrollHandle();//初始化滚动条方法
					}
				} else {
					alert(data.message);
				}
			}
		})
	},
	appendEleHandle: function (data) {
		var self = this;
		var liEle = '';
		var myNewsList = this.defaults.searchBool ? $("#searchListBox") : $("#myNewsList");
		data.map(function (item, key) {
			var itemContent = item.content;
			if (itemContent.indexOf("<") > 0 && itemContent.lastIndexOf(">") > 0) {
				var itemContentStr = item.content;
				if (item.type == 0 || item.type == 1) {
					var firstIndex = itemContentStr.indexOf("<");
					var lastIndex = itemContentStr.lastIndexOf(">");
					var firstStrs = itemContentStr.substring(0, firstIndex + 1);
					var contentStrs = itemContentStr.substring(firstIndex + 1, lastIndex);
					var lastStrs = itemContentStr.substring(lastIndex);
					itemContent = firstStrs + App.overflowHideHandle(contentStrs, 20, true) + lastStrs;
				}
			}
			if (self.defaults.searchBool) {
				itemContent = App.searchHighlightHandle(App.MyNewsPage.defaults.title, itemContent);//搜索结果高亮效果的方法
			}
			if (item.status == 0) {
				if (item.type == 0) {
					if (item.subContent) {
						liEle += '<li data-iscommentdeleted="' + item.isCommentDeleted + '" data-projectid="' + item.subContent.projectId + '" data-projectname="' + item.subContent.projectName + '" data-versionid="' + item.subContent.versionId + '" data-commentid="' + item.subContent.commentId + '" data-postilid="' + item.subContent.postilId + '" data-fileversionid="' + item.subContent.fileVersionId + '" data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<i></i><h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					} else {
						liEle += '<li data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<i></i><h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					}
				} else if (item.type == 1) {
					if (item.subContent) {
						liEle += '<li data-iscommentdeleted="' + item.isCommentDeleted + '" data-feedbackid="' + item.subContent.feedbackId + '" data-feedbackreplayid="' + item.subContent.replyId + '" data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<i></i><h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					} else {
						liEle += '<li data-iscommentdeleted="' + item.isCommentDeleted + '" data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<i></i><h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					}
				} else if (item.type == 2) {
					liEle += '<li data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
						'<a href="javascript:;">' +
						'<i></i><h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
						'</a>' +
						'</li>'
				}
			} else {
				if (item.type == 0) {
					if (item.subContent) {
						liEle += '<li data-iscommentdeleted="' + item.isCommentDeleted + '" data-projectid="' + item.subContent.projectId + '" data-projectname="' + item.subContent.projectName + '" data-versionid="' + item.subContent.versionId + '" data-commentid="' + item.subContent.commentId + '" data-postilid="' + item.subContent.postilId + '" data-fileversionid="' + item.subContent.fileVersionId + '" data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					} else {
						liEle += '<li data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					}
				} else if (item.type == 1) {
					if (item.subContent) {
						liEle += '<li data-iscommentdeleted="' + item.isCommentDeleted + '" data-feedbackid="' + item.subContent.feedbackId + '" data-feedbackreplayid="' + item.subContent.replyId + '" data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					} else {
						liEle += '<li data-iscommentdeleted="' + item.isCommentDeleted + '" data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
							'<a href="javascript:;">' +
							'<h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
							'</a>' +
							'</li>'
					}
				} else if (item.type == 2) {
					liEle += '<li data-newsid="' + item.id + '" data-isdeleted="' + item.isDeleted + '" data-newsstatus="' + item.status + '" data-newstype="' + item.type + '">' +
						'<a href="javascript:;">' +
						'<h2>' + itemContent + '</h2><p class="border-bottom-color">' + Assister.Date.getDateFromHMLong(item.createStmp) + '</p>' +
						'</a>' +
						'</li>'
				}
			}
		})
		myNewsList.append(liEle);
	},
	viewSearchPage: function (data) {//渲染搜索列表的方法
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#searchListBox>li")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var itemContent = itemObject.item.content;
				if (itemContent.indexOf("<") > 0 && itemContent.lastIndexOf(">") > 0) {
					var itemContentStr = itemObject.item.content;
					if (itemObject.item.type == 0 || itemObject.item.type == 1) {
						var firstIndex = itemContentStr.indexOf("<");
						var lastIndex = itemContentStr.lastIndexOf(">");
						var firstStrs = itemContentStr.substring(0, firstIndex + 1);
						var contentStrs = itemContentStr.substring(firstIndex + 1, lastIndex);
						var lastStrs = itemContentStr.substring(lastIndex);
						itemContent = firstStrs + App.overflowHideHandle(contentStrs, 20, true) + lastStrs;
					}
				}
				var name = _.escape(itemContent);
				if (App.MyNewsPage.defaults.title.length > 0) {
					name = App.searchHighlightHandle(App.MyNewsPage.defaults.title, itemContent);//搜索结果高亮效果的方法
				}
				var returnObj = {
					"newsId": itemObject.item.id,
					"type": itemObject.item.type,
					"newsStatus": itemObject.item.status,
					"isDeleted": itemObject.item.isDeleted,
					"isCommentDeleted": itemObject.item.isCommentDeleted,
					"isRead": itemObject.item.status == 0 ? "showRead" : "hideRead",
					"newsName": name,
					"sendUserName": itemObject.item.sendUserName,
					"itemType": itemObject.item.type,
					"createStmp": Assister.Date.getDateFromHMLong(itemObject.item.createStmp)
				}
				if (itemObject.item.type == 0) {
					returnObj.projectId = itemObject.item.subContent ? itemObject.item.subContent.projectId : "";
					returnObj.versionId = itemObject.item.subContent ? itemObject.item.subContent.versionId : "";
					returnObj.commentId = itemObject.item.subContent ? itemObject.item.subContent.commentId : "";
					returnObj.fileVersionId = itemObject.item.subContent ? itemObject.item.subContent.fileVersionId : "";
					returnObj.projectName = itemObject.item.subContent ? itemObject.item.subContent.projectName : "";
					returnObj.feedbackId = "";
					returnObj.replyId = "";
				} else if (itemObject.item.type == 1) {
					returnObj.feedbackId = itemObject.item.subContent ? itemObject.item.subContent.feedbackId : "";
					returnObj.replyId = itemObject.item.subContent ? itemObject.item.subContent.replyId : "";
					returnObj.projectId = "";
					returnObj.versionId = "";
					returnObj.postilId = "";
					returnObj.fileVersionId = "";
					returnObj.projectName = "";
					returnObj.commentId = "";
				} else if (itemObject.item.type == 2) {
					returnObj.projectId = "";
					returnObj.versionId = "";
					returnObj.postilId = "";
					returnObj.fileVersionId = "";
					returnObj.feedbackId = "";
					returnObj.replyId = "";
					returnObj.projectName = "";
					returnObj.commentId = "";
				}
				return returnObj;
			}
		});
	},
	viewPage: function (data) {//渲染列表的方法
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#myNewsList>li")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var itemContent = itemObject.item.content;
				if (itemContent.indexOf("<") > 0 && itemContent.lastIndexOf(">") > 0) {
					var itemContentStr = itemObject.item.content;
					if (itemObject.item.type == 0 || itemObject.item.type == 1) {
						var firstIndex = itemContentStr.indexOf("<");
						var lastIndex = itemContentStr.lastIndexOf(">");
						var firstStrs = itemContentStr.substring(0, firstIndex + 1);
						var contentStrs = itemContentStr.substring(firstIndex + 1, lastIndex);
						var lastStrs = itemContentStr.substring(lastIndex);
						itemContent = firstStrs + App.overflowHideHandle(contentStrs, 20, true) + lastStrs;
					}
				}
				itemContent = _.escape(itemContent);
				var returnObj = {
					"newsId": itemObject.item.id,
					"type": itemObject.item.type,
					"newsStatus": itemObject.item.status,
					"isDeleted": itemObject.item.isDeleted,
					"isCommentDeleted": itemObject.item.isCommentDeleted,
					"isRead": itemObject.item.status == 0 ? "showRead" : "hideRead",
					"newsName": itemContent,
					"sendUserName": itemObject.item.sendUserName,
					"itemType": itemObject.item.type,
					"createStmp": Assister.Date.getDateFromHMLong(itemObject.item.createStmp)
				}
				if (itemObject.item.type == 0) {
					returnObj.projectId = itemObject.item.subContent ? itemObject.item.subContent.projectId : "";
					returnObj.versionId = itemObject.item.subContent ? itemObject.item.subContent.versionId : "";
					returnObj.postilId = itemObject.item.subContent ? itemObject.item.subContent.postilId : "";
					returnObj.commentId = itemObject.item.subContent ? itemObject.item.subContent.commentId : "";
					returnObj.fileVersionId = itemObject.item.subContent ? itemObject.item.subContent.fileVersionId : "";
					returnObj.projectName = itemObject.item.subContent ? itemObject.item.subContent.projectName : "";
					returnObj.feedbackId = "";
					returnObj.replyId = "";
				} else if (itemObject.item.type == 1) {
					returnObj.feedbackId = itemObject.item.subContent ? itemObject.item.subContent.feedbackId : "";
					returnObj.replyId = itemObject.item.subContent ? itemObject.item.subContent.replyId : "";
					returnObj.versionId = "";
					returnObj.postilId = "";
					returnObj.projectId = "";
					returnObj.projectName = "";
					returnObj.fileVersionId = "";
					returnObj.commentId = "";
				} else if (itemObject.item.type == 2) {
					returnObj.projectId = "";
					returnObj.versionId = "";
					returnObj.postilId = "";
					returnObj.fileVersionId = "";
					returnObj.feedbackId = "";
					returnObj.replyId = "";
					returnObj.projectName = "";
					returnObj.commentId = "";
				}
				return returnObj;
			}
		});
	}
}