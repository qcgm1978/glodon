App.ServiceRelated = {
	defaults: {
		pageIndex: 1,
		pageItemCount: 10,
		hrefstr: "",
		listScroll: "",
		moreFlag: true,
	},
	init: function (arge) {
		var _this = this;
		this.initHtml();
		$(function () {
			_this.initHandle();//初始化服务页面
			_this.loadData();//加载列表数据方法
		})
	},
	initHtml: function () {
		App.TitleBar.setTitle("相关资源");//设置顶部标题
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom", 0);
	},
	initScrollHandle: function () {
		var _this = this;
		var loadMore = $(".loadMore");
		this.defaults.listScroll = new IScroll('#serviceRelatedBox', {
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
		this.defaults.listScroll.on('scrollEnd', function () {
			if (this.y == this.maxScrollY && this.maxScrollY < 0) {
				if (!_this.defaults.moreFlag) return;
				_this.defaults.moreFlag = false;
				_this.getMoreDataHandle();//获取更多
			}
		});
	},
	getMoreDataHandle: function () {//获取更多
		var _this = this;
		var data = {
			'keyString': '',
			'start': '',
			'end': '',
			'pageIndex': App.ServiceRelated.defaults.pageIndex + 1,
			'pageItemCount': App.ServiceRelated.defaults.pageItemCount,
		}
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.getResourcesData,
			data: data,
			dataType: "json",
			success: function (data) {
				_this.defaults.moreFlag = true;
				if (data.code == 0) {
					if (data.data.items.length > 0) {
						_this.defaults.pageIndex++;
						_this.appendHtmlHandle(data.data.items);//加载更多之后添加到页面上
					} else {
						$(".loadMore").html(App.defaults.loadMoreBottomText);
					}
					_this.defaults.listScroll.refresh();
				} else {
					alert(data.message);
				}
			}
		})
	},
	appendHtmlHandle: function (data) {//加载更多之后添加到页面上
		var _this = this;
		var html = '',
			nameStr = '',
			type = '',
			href = '',
			downLoadName = '';
		var osStr = navigator.userAgent;
		var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
		var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		for (var i = 0, iLen = data.length; i < iLen; i++) {
			nameStr = data[i].name;
			type = nameStr.substr(nameStr.lastIndexOf("."));
			downLoadName = encodeURIComponent(nameStr);
			if (!isAndroid && isiOS) {
				href = '/platform/internal/related/resources/download/' + data[i].id;
			} else {
				href = '/platform/related/resources/download/' + data[i].id;
			}
			switch (type) {
				case ".doc":
					imgSrc = '<img src=images/comm/word.png>';
					break;
				case ".docx":
					imgSrc = '<img src=images/comm/word.png>';
					break;
				case ".ppt":
					imgSrc = '<img src=images/comm/ppt.png>';
					break;
				case ".pptx":
					imgSrc = '<img src=images/comm/ppt.png>';
					break;
				case ".xls":
					imgSrc = '<img src=images/comm/excel.png>';
					break;
				case ".xlsx":
					imgSrc = '<img src=images/comm/excel.png>';
					break;
				case ".pdf":
					imgSrc = '<img src=images/comm/pdf.png>';
					break;
				case ".dwg":
					imgSrc = '<img src=images/comm/dwg_icon.png>';
					break;
				case ".rvt":
					imgSrc = '<img src=images/comm/rvt_icon.png>';
					break;
				default:
					imgSrc = '<img src=images/comm/default_icon.png>';
					break;
			}
			html += '<li>' +
				'<a data-type="' + type + '" data-name="' + downLoadName + '" href="javascript:;" data-hrefstr="' + href + '">' +
				'<i>' + imgSrc + '</i>' +
				'<h2>' + nameStr + '</h2>' +
				'<p>' +
				'<span class="fl service_date">' + Assister.Date.getDateFromHMLong(data[i].createTime) + '</span>' +
				'<span class="fr service_size">' + Assister.Size.formatSize(data[i].size) + '</span>' +
				'</p>' +
				'</a>' +
				'</li>';
		}
		$("#listBox").append(html);
	},
	initHandle: function () {//初始化服务页面
		var self = this;
		var osStr = navigator.userAgent;
		var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
		var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		var listBox = $("#listBox");
		App.TitleBar.returnCallback(function () {//"#/service"
			if (!isAndroid && isiOS && typeof cordova !== 'undefined') {
				cordova.exec(function () { }, function () { }, "WDNaviPlugin", "hiddenNavi", ["1"]);
			}
			location.href = "#/service";
		});
		listBox.on("click", function (evt) {
			var target = $(evt.target).closest('a');
			var type = target.data("type");
			var name = App.trimHandle(decodeURIComponent(target.data("name")));
			self.defaults.hrefstr = target.data("hrefstr");
			if (!isAndroid && isiOS) {
				if (type == ".mp4" || type == ".amr" || type == ".mp3" || type == ".flv" || type == ".wav" || type == ".m4v") {
					var Dlg = App.UI.Dialog.showMsgDialog({
						title: "提示",
						text: "暂不支持该文件格式,无法打开",
						okText: "确定",
						onok: function () {

						},
					});
					$(Dlg.dialog).find(".commDialogCancel").css("display", "none");
					$(Dlg.dialog).find(".commDialogOk").css("width", "100%");
				} else {
					cordova.exec(self.onSuccessMoreUplaod, self.onFail, "WDWebViewOpenTypePlugin", "canOpenFile", [type]);
				}
			} else {
				self.downloadImgHandle(location.origin + self.defaults.hrefstr, type, name);
			}
			return false;
		})
	},
	downloadImgHandle: function (downUrl, type, name) {//批注查看大图下载图片方法
		var tipText = "下载完成，请到手机系统OA_downLoad里查看";
		var fileTransfer = new FileTransfer();
		var uri = downUrl;
		fileTransfer.download(uri, name, function (entry) {
			var Dlg = App.UI.Dialog.showMsgDialog({
				title: "提示",
				text: tipText,
				okText: "确定",
				onok: function () {

				},
			});
			$(Dlg.dialog).find(".commDialogCancel").css("display", "none");
			$(Dlg.dialog).find(".commDialogOk").css("width", "100%");
		}, function (error) {
			alert("下载错误:::" + error.source);
			alert("下载错误:::" + error.target);
			alert("下载错误:::" + error.code);
		}, false, {
				headers: {

				},
				fileName: name
			})
	},
	onSuccessMoreUplaod: function (evt) {
		if (evt == "您提供的文件类型不能被打开") {
			var Dlg = App.UI.Dialog.showMsgDialog({
				title: "提示",
				text: "暂不支持该文件格式,无法打开",
				okText: "确定",
				onok: function () {

				},
			});
			$(Dlg.dialog).find(".commDialogCancel").css("display", "none");
			$(Dlg.dialog).find(".commDialogOk").css("width", "100%");
		} else {
			cordova.exec(function () { }, function () { }, "WDNaviPlugin", "hiddenNavi", ["0", "1"]);
			location.href = App.ServiceRelated.defaults.hrefstr;
		}
	},
	onFail: function (evt) {
	},
	loadData: function () {//加载列表数据方法
		var _this = this;
		var data = {
			'keyString': '',
			'start': '',
			'end': '',
			'pageIndex': App.ServiceRelated.defaults.pageIndex,
			'pageItemCount': App.ServiceRelated.defaults.pageItemCount,
		}
		var listBox = $("#listBox");
		var listComponent = $('<li id="listComponent" style="display: none;"><a data-type="{{type}}" data-name="{{downloadName}}" href="javascript:;" data-hrefstr="{{href}}"><i>{{imgSrc}}</i><h2>{{name}}</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">{{size}}</span></p></a></li>');
		var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>");
		listBox.html("");
		listBox.append(listComponent);
		App.Comm.ajax({
			type: "get",
			url: App.Restful.urls.getResourcesData,
			data: data,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) {
					if (data.data.items.length < 10) {
						$(".loadMore").hide();
					} else {
						$(".loadMore").show();
					}
					if (data.data.items.length > 0) {
						if (_this.defaults.listScroll) {
							_this.defaults.listScroll.destroy();
						}
						_this.viewPage(data.data.items);
						_this.initScrollHandle();
					} else {
						listBox.html(nullData);
					}

				} else {
					alert(data.message);
				}
			}
		})
	},
	viewPage: function (data) {
		/*渲染数据*/
		template.repeat({
			repeatElement: $("#listComponent")[0], /*页面的DOM元素*/
			data: data,
			process: function (itemObject) {
				var item = itemObject.item;
				var key = itemObject.index;
				var nameStr = item.name;
				var type = nameStr.substr(nameStr.lastIndexOf("."));
				var imgSrc = "",
					href = "";
				var osStr = navigator.userAgent;
				var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
				var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				if (!isAndroid && isiOS) {
					href = '/platform/internal/related/resources/download/' + item.id;
				} else {
					href = '/platform/related/resources/download/' + item.id;
				}
				switch (type) {
					case ".doc":
						imgSrc = '<img src=images/comm/word.png>';
						break;
					case ".docx":
						imgSrc = '<img src=images/comm/word.png>';
						break;
					case ".ppt":
						imgSrc = '<img src=images/comm/ppt.png>';
						break;
					case ".pptx":
						imgSrc = '<img src=images/comm/ppt.png>';
						break;
					case ".xls":
						imgSrc = '<img src=images/comm/excel.png>';
						break;
					case ".xlsx":
						imgSrc = '<img src=images/comm/excel.png>';
						break;
					case ".pdf":
						imgSrc = '<img src=images/comm/pdf.png>';
						break;
					case ".dwg":
						imgSrc = '<img src=images/comm/dwg_icon.png>';
						break;
					case ".rvt":
						imgSrc = '<img src=images/comm/rvt_icon.png>';
						break;
					default:
						imgSrc = '<img src=images/comm/default_icon.png>';
						break;
				}
				return {
					"name": item.name,
					"downloadName": encodeURIComponent(item.name),
					"imgSrc": imgSrc,
					"type": type,
					"href": href,
					"createTime": Assister.Date.getDateFromHMLong(item.createTime),
					"size": Assister.Size.formatSize(item.size),
				}
			}
		});
	}
}