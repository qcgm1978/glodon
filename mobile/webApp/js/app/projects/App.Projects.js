App.Projects = {
	defaults: {
		searchName: "",
		type: 3,
		pageIndex: 1,
		pageItemCount: 10,
		pageNum: 10,//总共的页数1
		flag: true,
		moreFlag: true,
		searchBool: false,
		searchCan: false,
	},
	init: function () {
		var _this = this;
		App.Projects.defaults.searchName = "";
		App.Projects.defaults.searchBool = App.defaults.SearchHeightVar ? true : false;
		App.Projects.defaults.pageNum = 10;
		App.Projects.defaults.moreFlag = true;
		App.Projects.defaults.searchCan = true;
		this.initHtmlHandle();//初始化页面方法
		$(function () {
			if (!App.Projects.defaults.searchBool) {
				if (App.defaults.projectObj) {
					_this.defaults.pageIndex = App.defaults.projectObj.pageIndex;
					_this.defaults.pageNum = App.defaults.projectObj.pageIndex * 10;
				}
			}
			_this.loadData();//加载项目列表方法
			_this.initHandle();//初始化事件
			_this.searchInit();//初始化搜索方法
		})
	},
	initHandle: function () {//初始化事件
		var _this = this;
		var projectList = $("#projectList");
		var searchListBox = $("#searchListBox");
		projectList.on("click", function (evt) {
			var target = $(evt.target);
			var closestEle = target.closest('li');
			var openUrl = closestEle.data("href");
			location.href = openUrl;
			if (!_this.defaults.searchBool) {
				if (App.defaults.projectObj) {
					App.defaults.projectObj.pageIndex = _this.defaults.pageIndex;
				}
			}
			return false;
		})
		searchListBox.on("click", function (evt) {
			var target = $(evt.target);
			var closestEle = target.closest('li');
			var openUrl = closestEle.data("href");
			location.href = openUrl;
			if (App.defaults.projectObj) {
				App.defaults.projectObj = undefined;
			}
			return false;
		})
	},
	initHtmlHandle: function () {//初始化页面方法
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.hideHomeBtn() //显示home图片
		App.TitleBar.showClose();//隐藏顶部三个点按钮
		App.TitleBar.setTitle("万达筑云项目管理平台");
		if (!$("#footerBox > div").eq(1).hasClass("footer-box-select")) {
			$("#footerBox > div").eq(1).click();
		}
	},
	searchInit: function () {//搜索初始化方法
		var _this = this;
		$("#searchBtn").on("click", function () {
			var searchVal = $("#searchInput").val().trim();
			App.Projects.defaults.searchName = searchVal;
			App.Projects.defaults.pageIndex = 1;
			$(".loadMore").html(App.defaults.loadMoreText).show();
			if (App.Projects.defaults.searchCan) {
				App.Projects.defaults.searchBool = true;
				_this.loadData();//执行搜索获取数据
			}
		})
		$("#searchInput").on("keyup", function (evt) {
			var targetVal = $(evt.target).val().trim();
			if (targetVal.length > 0) {
				$("#clearSearchVal").css("display", "block");
			}
		})
		$("#clearSearchVal").on("click", function () {
			App.Projects.defaults.searchName = "";
			$(this).hide();
			$("#searchInput").val("");
		})
		$("#clearSearchBtn").on("click", function () {
			$("#searchCommonBox").css("display", "none");
			$("#clearSearchVal").css("display", "none");
			$("#searchListBox").html("");
			$("#searchInput").val("");
			App.Projects.defaults.searchName = "";
			App.defaults.SearchHeightVar = "";
			App.Projects.defaults.searchBool = false;
			App.Projects.defaults.pageIndex = 1;
			$(".loadMore").html(App.defaults.loadMoreText).show();
			_this.loadData(function () {
				setTimeout(function () {
					// myScroll.refresh();
					// App.Projects.defaults.listScroll.scrollTo(0, 0)
				}, 1000);
			});//加载项目列表方法
		})
	},
	bindScrollHandle: function (scrollToTop) {//初始化滚动条方法
		var _this = this;
		var loadMore = $(".loadMore");
		var scrollEle = "";
		if (App.defaults.SearchHeightVar) {
			scrollEle = "#searchCommentDown";
		} else {
			scrollEle = !this.defaults.searchBool ? "#m_ProjectsListBox" : "#searchCommentDown";
		}
		this.defaults.listScroll = new IScroll(scrollEle, {
			mouseWheel: true,//鼠标滚轮
			probeType: 3,//像素级触发 执行回调
			scrollbars: false,//滚轴是否显示默认是
			truebounceTime: 600,//弹力动画持续的毫秒数
			click: true,
		});
		if (!this.defaults.searchBool) {
			if (App.defaults.projectObj && !scrollToTop) {
				this.defaults.listScroll.scrollTo(0, App.defaults.projectObj.scrollPos, 10);
			}
		}
		this.defaults.listScroll.on('scroll', function () {
			if (this.directionY == 1) {
				if (this.y < this.maxScrollY) {
					loadMore.show();
				}
			}
		});
		this.defaults.listScroll.on('scrollEnd', function () {
			if (!_this.defaults.searchBool) {
				App.defaults.projectObj = {
					scrollPos: this.y
				}
			}
			if (this.y == this.maxScrollY && this.maxScrollY < 0) {
				if (!_this.defaults.moreFlag) return;
				_this.defaults.moreFlag = false;
				_this.getMoreDataHandle();//获取更多
			}
		});
	},
	getMoreDataHandle: function () {//获取更多
		var _this = this;
		var defaults = {
			type: App.Projects.defaults.type,//项目列表
			name: App.Projects.defaults.searchName,//项目名字
			pageIndex: App.Projects.defaults.pageIndex + 1,
			pageItemCount: 10,
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.projectsList,
			data: $.extend({}, defaults, App.defaults.SearchHeightVar || {}, { pageIndex: App.Projects.defaults.pageIndex + 1 }),
			dataType: "json",
			success: function (data) {
				_this.defaults.moreFlag = true;
				if (data.code == 0) {
					if (data.data.items.length > 0) {
						_this.defaults.pageIndex++;
						_this.loadMorePageHandle(data.data.items);//添加页面元素的方法
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
	loadMorePageHandle: function (data) {//加载功能多添加到页面的方法
		var html = '',
			itemName = "",
			changeName = "",
			hrefStr = "",
			appendEle = "",
			isBimControlClass = "";
		if (App.defaults.SearchHeightVar) {
			appendEle = $("#searchListBox");
		} else {
			appendEle = !App.Projects.defaults.searchBool ? $("#projectList") : $("#searchListBox");
		}
		for (var i = 0, iLen = data.length; i < iLen; i++) {
			itemName = data[i].name;
			changeName = App.replaceKongGeHandle(data[i].name);
			switch (data[i].isBimControl) {
				case 1:
					isBimControlClass = "bim_icon";
					hrefStr = "#/project/" + data[i].id + "/" + data[i].version.id + "/" + changeName;
					break;
				case 2:
					isBimControlClass = "key_icon";
					hrefStr = "#/project/" + data[i].id + "/" + data[i].version.id + "/" + changeName;
					break;
				case 3:
					isBimControlClass = "no_key_icon";
					hrefStr = "javascript:;";
					break;
			}
			html += '<li data-href="' + hrefStr + '">' +
				'<a href="javascript:;">' +
				'<div class="m_list_logo">' +
				'<img src="/' + data[i].logoUrl.middle + '">' +
				'</div>' +
				'<dl>' +
				'<dt>' + App.searchHighlightHandle(App.Projects.defaults.searchName, itemName) + '</dt>' +
				'<dd class="' + isBimControlClass + '">' + data[i].province + '·' + data[i].region + '</dd>' +
				'</dl>' +
				'</a>' +
				'</li>'
		}
		appendEle.append(html);
	},
	loadData: function (scrollToTop) {//加载项目列表方法
		if (!App.Projects.defaults.flag) {
			return;
		}
		App.Projects.defaults.flag = false;
		var th = this;
		var defaults = {
			type: App.Projects.defaults.type,//项目列表
			name: App.Projects.defaults.searchName,//项目名字
			pageIndex: 1,
			pageItemCount: App.Projects.defaults.pageNum,
		}
		var projectList = $("#projectList");
		var searchListBox = $("#searchListBox");
		var searchCommonBox = $("#searchCommonBox");
		var seachScrollBox = $(".seachScrollBox");
		var m_ProjectsListBox_scroll = $(".m_ProjectsListBox_scroll");

		var listComponent = $('<li data-href="{{hrefStr}}" id="projectComponent" style="display: none;"><a href="javascript:;"><div class="m_list_logo">{{projectLogo}}</div><dl><dt>{{name}}</dt><dd class="{{isBimControlClass}}">{{province}}·{{region}}</dd></dl></a></li>');
		var projectComponentSearch = $('<li data-href="{{hrefStr}}" id="projectComponentSearch" style="display: none;"><a href="javascript:;"><div class="m_list_logo">{{projectLogo}}</div><dl><dt>{{name}}</dt><dd class="{{isBimControlClass}}">{{province}}·{{region}}</dd></dl></a></li>');
		if (App.Projects.defaults.searchBool) {
			seachScrollBox.css("transform", "translate(0px,0px)");
			searchListBox.html("");
			searchCommonBox.css("display", "block");
			searchListBox.append(projectComponentSearch);
		} else {
			m_ProjectsListBox_scroll.css("transform", "translate(0px,0px)");
			projectList.html("");
			projectList.append(listComponent);
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.projectsList,
			data: $.extend({}, defaults, App.defaults.SearchHeightVar || {}),
			dataType: "json",
			success: function (data) {
				App.Projects.defaults.flag = true;
				App.Projects.defaults.searchCan = true;
				$("#resultNum").html(data.data.totalItemCount);
				if (data.data.items.length < 10) {
					$(".loadMore").hide();
				} else {
					$(".loadMore").show();
				}
				if (data.data.items.length == 0) {
					var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>");
					if (App.Projects.defaults.searchBool) {
						searchListBox.append(nullData);
						return;
					}
					projectList.append(nullData);
				} else {
					if (th.defaults.listScroll) {
						th.defaults.listScroll.destroy();
					}
					if (App.Projects.defaults.searchBool) {
						th.viewSearchProjectsPage(data.data.items);//搜索渲染的页面
						th.bindScrollHandle();//初始化滚动条方法
						return;
					}
					th.viewProjectsPage(data.data.items);

					th.bindScrollHandle(scrollToTop);//初始化滚动条方法
					// if (callback instanceof Function) {
					// 	callback()
					// }
				}
			}
		});
	},
	viewSearchProjectsPage: function (data) {//搜索渲染的页面
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#projectComponentSearch")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				var nameStr = item.name;
				var name = App.searchHighlightHandle(App.Projects.defaults.searchName, nameStr);//搜索结果高亮效果的方法
				var isBimControl = item.isBimControl,
					hrefStr = "",
					isBimControlClass = "";
				var changeName = App.replaceKongGeHandle(nameStr);
				switch (isBimControl) {
					case 1:
						isBimControlClass = "bim_icon";
						hrefStr = "#/project/" + item.id + "/" + item.version.id + "/" + changeName;
						break;
					case 2:
						isBimControlClass = "key_icon";
						hrefStr = "#/project/" + item.id + "/" + item.version.id + "/" + changeName;
						break;
					case 3:
						isBimControlClass = "no_key_icon";
						hrefStr = "javascript:;";
						break;
				}
				return {
					"projectLogo": '<img src="/' + item.logoUrl.middle + '">',
					"name": name,
					"hrefStr": hrefStr,
					"province": item.province,
					"isBimControlClass": isBimControlClass,
					"region": item.region,
				}
			}
		});
	},
	viewProjectsPage: function (data) {
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#projectComponent")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				var isBimControl = item.isBimControl,
					hrefStr = "",
					isBimControlClass = "";
				var changeName = App.replaceKongGeHandle(item.name);
				switch (isBimControl) {
					case 1:
						isBimControlClass = "bim_icon";
						hrefStr = "#/project/" + item.id + "/" + item.version.id + "/" + changeName;
						break;
					case 2:
						isBimControlClass = "key_icon";
						hrefStr = "#/project/" + item.id + "/" + item.version.id + "/" + changeName;
						break;
					case 3:
						isBimControlClass = "no_key_icon";
						hrefStr = "javascript:;";
						break;
				}
				return {
					"projectLogo": '<img src="/' + item.logoUrl.middle + '">',
					"name": item.name,
					"hrefStr": hrefStr,
					"isBimControlClass": isBimControlClass,
					"province": item.province,
					"region": item.region,
				}
			}
		});
	}
};
