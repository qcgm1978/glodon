(function($, win) {

	var FileSelection = function(options) {

		//强制new
		if (!(this instanceof FileSelection)) {
			return new FileSelection(options);
		}
		jQuery.support.cors = true;
		//默认参数
		var defaults = {
			appKey: "18fbec1ae3da477fb47d842a53164b14",
			token: "abc3f4a2981217088aed5ecf8ede5b6397eed0795978449bda40a6987f9d6f7b0d061e9c8ad279d740ef797377b4995eb55766ccf753691161e73c592cf2416f9744adce39e1c37623a794a245027e79cd3573e7938aff5b4913fe3ed4dbea6d5be4693d85fe52f972e47e6da4617a508e5948f65135c63f",
			btnText: "确&nbsp;定",
			isEnable: true, // 是否启用  如果不启用 只可以查看 不能选择 
			fileIds: "", // fileids 有值时，默认isEndable 为 false
			mask: true,
			//http: "http://bim.wanda-dev.cn",
			http: '',
			closeCallback: null,
			callback: null
		}

		//合并参数
		this.Settings = $.extend(defaults, options);

		//查看时禁用
		// if (this.Settings.fileIds) {
		// 	this.Settings.isEnable = false;
		// }

		// if (!this.Settings.appKey) {
		// 	alert("缺少参数appKey");
		// 	return false;
		// }

		if (!this.Settings.projectId) {
			alert("缺少参数projectId");
			return false;
		}
		if (!this.Settings.projectVersionId) {
			alert("缺少参数projectVersionId");
			return false;
		}


		//设置cookie
		if (this.Settings.token && !this.initCookie()) {
			return;
		}

		this.Settings.tokenPars = "token=" + this.Settings.token + "&appKey=" + this.Settings.appKey;


		var url = this.Settings.http + "/doc/" + this.Settings.projectId + "/" + this.Settings.projectVersionId + "/file";
		this.Settings.treeUrl = url + "/tree";
		this.Settings.nodeUrl = url + "/children";
		this.Settings.downLoadUrl = url + "/data";
		this.Settings.reverseTree = url += "/select";
		this.Settings.modelPrevView = this.Settings.http + "/static/dist/app/project/single/filePreview.html?projectId=" + this.Settings.projectId + "&projectVersionId=" + this.Settings.projectVersionId;


		//初始化
		this.init();

		var that = this;

		return {
			getFileId: function() {
				return that.getFileId();
			}
		}

	}

	FileSelection.prototype = {

		initCookie() {


			var that = this,
				isVerification = false,
				url = this.Settings.http + "/platform/token";


			$.ajax({
				url: url,
				data: {
					appKey: this.Settings.appKey,
					token: this.Settings.token
				},
				async: false,

				success: function(data) {
					if (data.code == 0) {
						//that.setCookie("token_cookie", data.data);
						that.Settings.token_cookie = data.data;
						isVerification = true;
					} else {
						alert("验证失败");
						isVerification = false;
					}
				},

				error: function(data) {
					if (data.status == 400) {
						alert("token过期");
					}
				}
			})

			return isVerification;

		},

		setCookie(name, value) {
			var Days = 30,
				exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000),
				doMain = (/^(\d+\.?)+$/.test(location.host)?window.location.host:(window.location.host.substring(window.location.host.indexOf("."))));
				// doMain = window.location.host.substring(window.location.host.indexOf("."));

			document.cookie = name + "=" + value + ";domain=" + doMain + ";expires=" + exp.toGMTString() + ";path=/";
		},
		//初始化
		init() {

			//生成Dialog
			this.buildDialog();

			if (this.Settings.fileIds) {

				var url = this.Settings.reverseTree;

				if (this.Settings.token) {
					url += '?' + this.Settings.tokenPars;
				}

				this.loadData(url + "&fileVersionId=" + this.Settings.fileIds, this.renderRightTree);


			}

			if (this.Settings.token) {
				this.Settings.treeUrl += '?' + this.Settings.tokenPars;
			}
			//加载数据
			this.loadData(this.Settings.treeUrl, this.renderTree);


			//事件初始化
			this.initEvent();
		},

		//生成Dialog
		buildDialog() {

			var $dialog = this.$dialog = $('<div id="fileSelectionDialog"/>'),
				Settings = this.Settings,
				$header = $('<div class="header"/>').html('<i class="bg close" title="关闭"></i><h2>请选择申请变更的文件</h2> '),
				$content = $('<div class="container" />').html(' <div class="loading">正在加载，请稍候……</div> <div class="leftFile"></div><div class="rightEnter"></div> <div class="contentBox"></div>  '),
				$bottom = $('<div class="footer"/>').html('<input type="button" class="btnEnter myBtn myBtn-primary" value="' + this.Settings.btnText + '" />');

			//插入html架构
			$content.find(".leftFile").html('<div class="title">文件浏览器</div> <div class="treeViewBox"> <div class="treeViewScroll"></div> </div> ');

			var sb = '<ul class="tbFile"><li><span class="ckAll"> <i class="ck  bg"></i> </span> ';
			sb += '<span class="name"><button class="btnDownLoad myBtn myBtn-default"><i class="bg downBg"></i>下载选中文件</button></span> ';
			sb += '<span class="status">状态</span>  <span class="op">操作人</span>  ';
			sb += '<span class="size">大小</span> <span class="mmhDate">时间</span>';
			sb += '</li></ul> <div class="fileBodyScrollBox"><div class="fileBodyScroll"><ul class="fileBody"> <li class="null">暂无数据</li> </ul></div></div>';
			$content.find('.contentBox').html(sb);

			var rightEnter = '<div class="fileSelection-title">';

			if (Settings.isEnable) {
				rightEnter += '<button class="btnEnter myBtn myBtn-default"><!--<i class="bg ckBg"></i>--> 选择文件</button> ';
			} 
			var count = 0;
			if (Settings.fileIds) {
				count = Settings.fileIds.split(",").length;
			}

			rightEnter += '<span class="fileSelText_tmd">已选<span class="fileCount">' + count + '</span>文件</span>';
			rightEnter += '</div>';
			rightEnter += '<div class="fileEnterBox"> <div class="bindScroll"> <div class="treeViewMar"><ul class="treeViewMarUl"><li class="null">未选择</li></ul> </div> </div>	 </div>';
			$content.find('.rightEnter').html(rightEnter);

			$dialog.append($header);
			$dialog.append($content);
			$dialog.append($bottom);

			if (Settings.mask) {
				$("body").append('<div id="fileSelectionMask" />');
			}
			$("body").append($dialog);
			if (Settings.isDrag) {
				$header.addClass("drag");
			}
			Settings.$dialog = $dialog;

		},

		//加载数据
		loadData(url, callback) {

			var that = this;
			$.ajax({
				url: url,
				success: function(data) {
					if ($.type(data) == "string") {
						// to json
						if (JSON && JSON.parse) {
							data = JSON.parse(data);
						} else {
							data = $.parseJSON(data);
						}
					}
					if ($.isFunction(callback)) {
						callback.call(that, data);
					}
				}
			})

		},

		//生成左侧树
		renderRightTree(data) {
			var html = this.treeRoot(data);
			$(".rightEnter .fileEnterBox .bindScroll").html(html);
			$(".rightEnter .fileEnterBox .item-content.file").find(".nodeSwitch").remove();
			if (this.Settings.isEnable) {
				$(".rightEnter .fileEnterBox .item-content").append('<i class="bg delFile"></i>'); 
			}
		},

		//渲染tree
		renderTree(data) {

			var html = this.treeRoot(data);
			this.Settings.$dialog.find(".treeViewScroll").html(html);
			this.Settings.$dialog.find(".leftFile, .contentBox, .rightEnter,.footer").show();
			this.Settings.$dialog.find(".loading").hide();

		},

		// 根
		treeRoot(it) {

			var sb = "";
			if (!it.data) {
				return;
			}
			var trees = it.data,
				item,
				treeCount = trees.length;

			sb += '<div class="treeViewMar"><ul class="treeViewMarUl">';

			for (var i = 0; i < treeCount; i++) {

				sb += '<li class="rootNode" > ';
				item = trees[i];
				sb += this.treeNode(item);
				sb += '</li>';
			}
			sb += '</ul></div>';
			return sb;
		},

		//单个节点
		treeNode(item) {

			var sb = "";

			if (item.folder) {
				sb += '<div class="item-content" >';
			} else {
				sb += '<div class="item-content file" >';
			}
			//内容


			if (item.children) {
				sb += '<i class="nodeSwitch bg"></i> ';
			} else {
				sb += '<i class="noneSwitch"></i> ';
			}

			if (item.folder) {
				sb += '<i class="folderIcon bg"></i>';
			}

			var dataItem = $.extend({}, item);
			delete dataItem.children;
			sb += '<span  class="text-field overflowEllipsis" data-size="'+item.length+'" data-fileversionid="' + item.fileVersionId + '" data-id="' + item.id + '">' + item.name + '</span> ';

			sb += '</div>';


			//递归
			if (item.children && item.children.length > 0) {

				sb += '<ul class="treeViewSub mIconOrCk">';

				var treeSub = item.children,
					treeSubCount = treeSub.length,
					subItem;

				for (var j = 0; j < treeSubCount; j++) {

					sb += '<li class="itemNode" > ';
					sb += this.treeNode(treeSub[j]);
					sb += '</li>';
				}


				sb += '</ul>';
			}

			return sb;
		},

		//事件初始化
		initEvent() {

			var $dialog = this.Settings.$dialog,
				that = this;

			//关闭
			$dialog.find(".close").click(function() {

				$("#fileSelectionMask").fadeOut('500', function() {
					$(this).remove();
				});

				$("#fileSelectionDialog").slideUp('500', function() {
					$(this).remove();
				});

				if (that.Settings.closeCallback) {
					that.Settings.closeCallback.call(this);
				}

			});

			$dialog.find(".rightEnter .btnEnter").click(function() {
				that.enterSelect.call(that);
			});

			//下载
			$dialog.find(".btnDownLoad").click(function() {

				var FileIdArr = [];

				$dialog.find(".fileBodyScrollBox .ck.selected").each(function() {
					FileIdArr.push($(this).data("fileversionid"));
				});

				if (FileIdArr.length <= 0) {
					alert("请选择下载的文件");
					return;
				}

				var url = that.Settings.downLoadUrl + "?fileVersionId=" + FileIdArr.join(",");
				if (that.Settings.token) {
					that.Settings.downLoadUrl += '&' + that.Settings.tokenPars;
				}
				window.location.href = url;

				//
			});

			$dialog.find(".footer .btnEnter").click(function() {
				var result = true;
				if ($.isFunction(that.Settings.callback)) {
					result = that.Settings.callback.call(this, arguments);
				}
				if (result == false) {
					return;
				}
				$dialog.find(".close").trigger('click');

			});

			$(document).unbind("keyup.FileSelection");

			//esc 
			$(document).bind("keyup.FileSelection", function(event) {
				if (event.keyCode == 27) {
					$dialog.find(".close").trigger('click');
				}
			});


			//收起展开树 左边
			// $(".nodeSwitch").live(function() {
			// 	debugger
			// 		if ($this.hasClass('on')) {
			// 			//收起
			// 			$this.removeClass('on');
			// 			$this.closest('li').children('ul').hide();
			// 		} else {
			// 			//展开
			// 			$this.addClass('on');
			// 			$this.closest('li').children('ul').show();
			// 		}
			// 	} 

			// );



			$(".nodeSwitch").die().live("click", function() {

				var $this = $(this);

				if ($this.closest("#fileSelectionDialog").length <= 0) {
					return;
				}
				if ($this.hasClass('on')) {
					//收起
					$this.removeClass('on');
					$this.closest('li').children('ul').hide();
				} else {
					//展开
					$this.addClass('on');
					$this.closest('li').children('ul').show();
				}
			});

			// $dialog.("click", ".treeViewBox .nodeSwitch,.fileEnterBox .nodeSwitch", function() {
			// 	var $this = $(this);

			// 	if ($this.hasClass('on')) {
			// 		//收起
			// 		$this.removeClass('on');
			// 		$this.closest('li').children('ul').hide();
			// 	} else {
			// 		//展开
			// 		$this.addClass('on');
			// 		$this.closest('li').children('ul').show();
			// 	}

			// });

			$(".text-field").die().live("click", function() {

				var $this = $(this),
					fileVersionId = $this.data("fileversionid"),
					url = that.Settings.nodeUrl + "?parentId=" + fileVersionId;


				if ($this.closest(".treeViewBox").length <= 0) {
					return;
				}

				if (that.Settings.token) {
					url += '&' + that.Settings.tokenPars;
				}

				$dialog.find(".treeViewBox .text-field").removeClass('selected');
				$this.addClass('selected');

				$dialog.find(".tbFile .ck").removeClass('selected');

				$dialog.find(".fileBody").html(' <li class="null">正在加载，请稍候……</li>');

				that.loadData(url, that.renderFile);

			});

			//点击树文字
			// $dialog.on("click", ".treeViewBox .text-field", function() {


			// 	var $this = $(this),
			// 		fileVersionId = $this.data("fileversionid"),
			// 		url = that.Settings.nodeUrl + "?parentId=" + fileVersionId;

			// 	if (that.Settings.token) {
			// 		url += '&' + that.Settings.tokenPars;
			// 	}

			// 	$dialog.find(".treeViewBox .text-field").removeClass('selected');
			// 	$this.addClass('selected');

			// 	$dialog.find(".tbFile .ck").removeClass('selected'); 

			// 	$dialog.find(".fileBody").html(' <li class="null">正在加载，请稍候……</li>');

			// 	that.loadData(url, that.renderFile);

			// });

			$(".ck").die().live("click", function() {

				var $this = $(this);

				if ($this.closest(".tbFile").length <= 0) {
					return;
				}

				if ($this.hasClass('selected')) {
					$this.removeClass('selected');
					$dialog.find(".fileBody .ck:not(.disable)").removeClass('selected');
				} else {
					$this.addClass('selected');
					$dialog.find(".fileBody .ck:not(.disable)").addClass('selected');

				}

			});



			//全选
			// $dialog.on("click", ".tbFile .ck", function() {

			// 	var $this = $(this);

			// 	if ($this.hasClass('selected')) {
			// 		$this.removeClass('selected');
			// 		$dialog.find(".fileBody .ck:not(.disable)").removeClass('selected');
			// 	} else {
			// 		$this.addClass('selected');
			// 		$dialog.find(".fileBody .ck:not(.disable)").addClass('selected');

			// 	}

			// });

			$(".ck").live("click", function() {

				var $this = $(this);
				if ($this.closest(".fileBody").length <= 0) {
					return;
				}

				//禁用
				if ($(this).hasClass('disable')) {
					return;
				}
				$(this).toggleClass('selected');
			});


			//单选
			// $dialog.on("click", ".fileBody .ck", function() {
			// 	//禁用
			// 	if ($(this).hasClass('disable')) {
			// 		return;
			// 	}
			// 	$(this).toggleClass('selected');
			// });

			$("span.fileName").die().live("click", function() {

				var id = $(this).closest('li').data("id");

				var $this = $(this);
				if ($this.closest(".fileBody").length <= 0) {
					return;
				}


				var $leftItem = $dialog.find(".leftFile span[data-id='" + id + "']");

				if ($leftItem.length > 0) {

					$nodeSwitch = $leftItem.parent().find(".nodeSwitch");

					if ($nodeSwitch.length > 0 && !$nodeSwitch.hasClass('on')) {
						$nodeSwitch.click();
					}
					$leftItem.click();
				}

			});

			//点击文件夹
			// $dialog.on("click", ".fileBody span.fileName", function() {

			// 	var id = $(this).closest('li').data("id");

			// 	var $leftItem = $dialog.find(".leftFile span[data-id='" + id + "']");

			// 	if ($leftItem.length > 0) {

			// 		$nodeSwitch = $leftItem.parent().find(".nodeSwitch");

			// 		if ($nodeSwitch.length > 0 && !$nodeSwitch.hasClass('on')) {
			// 			$nodeSwitch.click();
			// 		}
			// 		$leftItem.click();
			// 	}

			// }); 


			//全选
			// $dialog.on("click", ".rightEnter .btnEnter", function() {
			// 	that.enterSelect.call(that);

			// });

			$(".delFile").die().live("click", function() {

				var $this = $(this);
				if ($this.closest(".rightEnter").length <= 0) {
					return;
				}

				$(this).closest("li").remove();
				$dialog.find(".fileCount").text($dialog.find(".rightEnter .file").length);
			});


			//全选
			// $dialog.on("click", ".rightEnter .delFile", function() {
			// 	$(this).closest("li").remove();
			// 	$dialog.find(".fileCount").text($dialog.find(".rightEnter .file").length);
			// }); 


			//拖拽
			// $dialog.on("mousedown",".header.drag",function(event){
			// 	that.drag.call(that,event);
			// });  
		},

		//确认选择的文件
		enterSelect() {

			var $dialog = this.Settings.$dialog,
				treeFolders = $dialog.find(".treeViewScroll .selected").parents("li"),
				$content, folderId, $trees, $tree, $rightItem, isAppend = false,
				$deep;

			if ($dialog.find(".fileBody .selected").length <= 0) {
				return;
			}
			//遍历所有父类
			treeFolders.each(function(i, item) {

				$content = $(item).children('.item-content');
				folderId = $content.find(".text-field").data("id");

				//右侧已经存在 直接返回
				$rightItem = $dialog.find(".rightEnter .text-field[data-id=" + folderId + "]");


				if ($rightItem.length > 0) {

					if ($trees) {
						$rightItem.closest("li").children(".treeViewSub").append($trees).show();
						$deep = $trees.find("li:last").length > 0 && $trees.find("li:last") || $trees;
					} else {
						$deep = $rightItem.closest("li");
					}

					isAppend = true;
					return false;
				} else {
					$tree = $(this).clone();
					$tree.find(".selected").removeClass('selected').end().find(".nodeSwitch").addClass('on').end().find('.item-content').append('<i class="bg delFile"></i>');
					$tree.children(".treeViewSub").empty();
					if ($trees) {
						$tree.children(".treeViewSub").html($trees);
					}
					$trees = $tree;

				}

			});


			var $fileBody = $dialog.find(".fileBody .selected").parents("li"),
				id, sb = '',
				fileVersionId,
				$item, bodyCount = $fileBody.length - 1;


			for (var i = bodyCount; i >= 0; i--) {

				$item = $($fileBody[i]);

				id = $item.data("id");

				fileVersionId = $item.data("fileversionid");

				if (isAppend) {
					$rightItem = $dialog.find(".rightEnter .text-field[data-id=" + id + "]");
					if ($rightItem.length > 0) {
						//继续
						continue;
					}
				}

				sb += '<li class="itemNode"> <div class="item-content file">'; //
				if ($item.find(".folder").length > 0) {
					sb += '<i class="nodeSwitch bg on"></i> <i class="folderIcon bg"></i>';
				}
				sb += '<span class="text-field overflowEllipsis " data-size="' + $item.data("size") + '"  data-id="' + id + '" data-fileversionid="' + fileVersionId + '" title="' + $item.find(".fileName").text() + '">' + $item.find(".fileName").text() + '</span> ';
				sb += '<i class="bg delFile"></i></div></li>';
			}

			//默认展开
			$trees && $trees.find(".treeViewSub").show();
			//未追加
			if (isAppend == false) {

				var $treeViewMarUl = $dialog.find(".rightEnter .treeViewMarUl");
				$treeViewMarUl.find(".null").remove();
				$treeViewMarUl.append($trees);

				if ($trees) {
					var $li = $trees.find("li:last").length > 0 && $trees.find("li:last") || $trees;
					if ($li.children(".treeViewSub").length <= 0) {
						$li.append('<ul class="treeViewSub mIconOrCk"></ul>')
					}
					$li.children(".treeViewSub").prepend(sb).show();

				}

			} else {
				if ($deep) {
					if ($deep.children(".treeViewSub").length <= 0) {
						$deep.append('<ul class="treeViewSub mIconOrCk"></ul>')
					}

					$deep.children(".treeViewSub").prepend(sb).show();
				}
			}

			$dialog.find(".fileCount").text($dialog.find(".rightEnter .file").length);

		},

		//根据id获取数据
		renderFile(data) {

			//成功
			if (data.message == "success") {

				var list = data.data,
					count = list.length,
					trs = "",
					op, folder,
					url = this.Settings.modelPrevView,
					item, isLock, status;

				if (this.Settings.token) {
					this.Settings.modelPrevView += '&' + this.Settings.tokenPars;
				}

				if (count > 0) {
					for (var i = 0; i < count; i++) {
						item = list[i];
						folder = item.folder ? "folder" : "";
						trs += '<li data-id="' + item.id + '" data-size="' + item.length + '" data-fileversionid="' + item.fileVersionId + '">';
						isLock = item.locked ? "disable" : "";
						/* modify and add by wuweiwei [if else] */
						if(folder)
						{
							trs += ' <span class="ckAll"> </span>';
						}
						else
						{
							trs += ' <span class="ckAll"> <i class="ck bg ' + isLock + '" data-fileversionid="' + item.fileVersionId + '"></i> </span>';
						}
						
						trs += '<span class="name">';
						trs += '<i class="fileType bg ' + folder + '"></i>';
						if (folder) {
							trs += '<span class="overflowEllipsis fileName">' + item.name + '</span>';
						} else {
							trs += '<a target="_blank" href="' + url + "&id=" + item.id + '" class="overflowEllipsis fileName">' + item.name + '</a>';
						}

						trs += '</span>';

						if (item.locked) {
							status = "已锁定";
						} else {
							status = this.convertStatus(item.status);
						}

						trs += '<span class="status">' + status + '</span>';
						op = item.creatorName ? item.creatorName : "";
						trs += '<span class="op"><span class="overflowEllipsis opName">' + op + '</span></span>';
						trs += '<span class="size">' + this.formatSize(item.length) + '</span>';
						trs += '<span class="mmhDate">' + new Date(item.createTime).format("yyyy-MM-dd") + '</span>';
						trs += '</li>';
					}

				} else {
					trs += '<li class="null">暂无数据</li>';
				}

			} else {
				trs += '<li class="null error">获取错误</li>';
			}

			this.Settings.$dialog.find(".fileBody").html(trs);

		},

		//状态转换
		convertStatus: function(status) {
			//1：待上传；2：上传中；3：已上传；4：待审核；5：审核通过；6：审核退回；7：待移交；8：移交退回；9：已发布

			var result = "";
			if (status == 1) {
				result = "待上传";
			} else if (status == 2) {
				result = "上传中";
			} else if (status == 3) {
				result = "待审核";
			} else if (status == 4) {
				result = "审核中";
			} else if (status == 5) {
				result = "审核通过";
			} else if (status == 6) {
				result = "审核退回";
			} else if (status == 7) {
				result = "待移交";
			} else if (status == 8) {
				result = "移交退回";
			} else if (status == 9) {
				result = "已发布";
			}

			return result;


		},

		//格式化 文件大小
		formatSize: function(size) {
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

		getFileId() {

			var FileIdArr = [],
				$item, $text;
			this.$dialog.find(".rightEnter .file").each(function(i, item) {

				$item = $(this);
				if ($item.find(".folder").length > 0) {
					return true;
				}
				$text = $(this).find(".text-field");
				FileIdArr.push({
					size: $text.data("size"),
					fileId: $text.data("id"),
					fileVersionId: $text.data("fileversionid"),
					fileName: $text.text()
				});
			});

			return FileIdArr;

		},

	}

	win.FileSelection = FileSelection;

	Date.prototype.format = function(fmt) { //auspanor: meizz  

		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

})(jQuery, window);