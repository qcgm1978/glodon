/**
 * @require /BIMperformance/libsH5/js/bimView.js
 * @require /BIMperformance/libsH5/js/bimView.prototype.js
 */


;
(function() {

	//非bim平台
	if (!_.templateUrl) {
		return;
	}


	var $comment, AppView, ModelView, viewPointId, clipboard, atUserArr = [],
		isFirst = true;

	//扩展 批注
	bimView.prototype.commentInit = function() {


		//单利 不存在 则 新建
		if (!AppView || AppView.$el.parents("body").length <= 0) {

			//刷新页面销毁
			if (AppView) {
				AppView.remove();
			}

			ModelView = this;
			AppView = new CommentView.App().render();

			$comment = $('#comment');
			//生成
			$comment.html(AppView.$el);

			//右键菜单
			if (!document.getElementById("viewPointContextPoint")) {
				//右键菜单
				var contextHtml = _.templateUrl("/libsH5/tpls/comment/viewPointContext.html", true);
				$("body").append(contextHtml);
			}


			if (!App.Project) {
				App.Project = {
					Settings: {
						projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
						versionId: App.ResourceModel.Settings.CurrentVersion.id
					}
				};

			}
		}

		if (location.href.indexOf("resources") > -1) {///为什么复制
			App.Project.Settings.Viewer = App.ResourceModel.Settings.Viewer;///为什么复制
			App.Project.Settings.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
			App.Project.Settings.versionId = App.ResourceModel.Settings.CurrentVersion.id;
		}

		//分享 直接跳详情，遮掉项目
		if (App.Project.Settings.viewPintId && isFirst) {
			$comment.find(".fullLoading").show();
		}

		// $("#comment .navBar .item.project").click();
		if($(".m-camera").hasClass("selected")){
			$("#comment .navBar .item.save").click();
		}
	}



	//集合
	var CommentCollections = {
			//项目
			Project: new(Backbone.Collection.extend({

				model: Backbone.Model.extend({

					urlType: "delViewPoint",
					defualt: {
						title: ""
					}
				}),

				urlType: "projectPhoto",

				parse(response, options) {
					if (response.code == 0 && response.data.length > 0) {
						return response.data;
					} else {
						this.trigger("dataNull");
					}
				}
			})),

			//项目
			Share: new(Backbone.Collection.extend({

				model: Backbone.Model.extend({

					urlType: "delViewPoint",
					defualt: {
						title: ""
					}
				}),

				urlType: "getSharePhoto",

				parse(response, options) {

					if (response.code == 0 && response.data) {
						return response.data;
					} else {
						this.trigger("dataNull");
					}
				}
			})),

			//用户
			User: new(Backbone.Collection.extend({

				model: Backbone.Model.extend({

					urlType: "delViewPoint",

					defaults: {
						title: ""
					}
				}),

				urlType: "userPhoto",

				parse(response, options) {
					if (response.code == 0 && response.data.length > 0) {
						return response.data;
					} else {
						this.trigger("dataNull");
					}
				}

			})),

			//讨论
			ViewComments: new(Backbone.Collection.extend({

				model: Backbone.Model.extend({

					urlType: "delComment",

					defaults: {
						title: ""
					}
				}),

				urlType: "viewComments",

				parse(response, options) {
					if (response.code == 0) {

						if (response.data.length > 0) {
							return response.data;
						} else {
							this.trigger("dataNull");
						}

					}
				}

			}))
		},

		//视图
		CommentView = {


			//入口
			App: Backbone.View.extend({

				tagName: "div",

				className: "commentListBox",

				events: {
					"click .navBar .item": "itemClick"
				},

				template: _.templateUrl('/libsH5/tpls/comment/bimview.pro.comment.html'),

				//渲染
				render() {
					//模板
					this.$el.html(this.template({}));
					//项目快照
					this.$(".projectListScroll").html(new CommentView.Project().render().$el);
					//个人快照
					this.$(".userListScroll").html(new CommentView.User().render().$el);
					//评论
					this.$(".commentRemark").html(new CommentView.ReMark().render().$el);

					return this;
				},

				//导航
				itemClick(event) {

					var $el = $(event.target).closest(".item"),
						type = $el.data("type");

					//项目视点
					if (type == "project") {

						this.$(".projectListBox").fadeIn("fast");
						//this.$(".projectListScroll").animate({left:"0px" },300);
						if (App.Project && App.Project.Settings.isShare) {
							//获取数据
							CommentCollections.Share.token = App.Project.Settings.token;
							CommentCollections.Share.reset();
							CommentCollections.Share.fetch({
								success() {

									$(".projectList .item:first").click();
								}
							});
						} else {
							//获取数据
							CommentCollections.Project.projectId = App.Project.Settings.projectId;
							CommentCollections.Project.reset();
							CommentCollections.Project.fetch({
								success() {

									//存在viewpintid 调到评论
									if (App.Project.Settings.viewPintId && isFirst) {
										isFirst = false;
										var $remark = $comment.find(".remarkCount_" + App.Project.Settings.viewPintId);
										$remark.closest(".item").click();
										$remark.click();
									}
								}
							});
						}



						$el.addClass("selected").siblings().removeClass("selected");

						//绑定滚动条
						App.Comm.initScroll(this.$(".projectListScroll"), "y");

					} else if (type == "user") {
						//个人视点
						this.$(".projectListBox").fadeOut("fast");
						//this.$(".projectListScroll").animate({left:"-406px" },300);
						//获取数据
						CommentCollections.User.projectId = App.Project.Settings.projectId;
						CommentCollections.User.reset();
						CommentCollections.User.fetch();

						$el.addClass("selected").siblings().removeClass("selected");
						//绑定滚动条
						App.Comm.initScroll(this.$(".userListScroll"), "y");

					} else if (type == "save") {
						//禁止 二次 点击
						if ($("#topSaveTip").length > 0) {
							return;
						}
						//保存
						if($("#dialogModelBox") && $("#dialogModelBox").children(".bim")&&$("#dialogModelBox").children(".bim").length>0){
							CommentApi.saveCommentStart(null, "commentViewPoint", (data) => {
								if(App.Project.NotesCollection && App.Project.NotesCollection.uploadsnapshotCallbackHandle){
									App.Project.NotesCollection.uploadsnapshotCallbackHandle({
										pictureUrl: data.pic,
										description: data.name,
										id: data.id
									});
								}
							})
						}else{
							CommentApi.saveCommentStart(null, 'viewPoint', null);//commentViewPoint
						}
					}
				}

			}),

			//项目
			Project: Backbone.View.extend({

				tagName: "ul",

				className: "projectList",

				//初始化
				initialize() {
					this.listenTo(CommentCollections.Project, "add", this.addOne);
					this.listenTo(CommentCollections.Project, "reset", this.reLoading);
					this.listenTo(CommentCollections.Project, "dataNull", this.dataNull);
					this.listenTo(CommentCollections.Share, "add", this.addOne);
					this.listenTo(CommentCollections.Share, "reset", this.reLoading);
					this.listenTo(CommentCollections.Share, "dataNull", this.dataNull);
				},

				render() {
					return this;
				},

				//新增数据
				addOne(model) {

					var $list = new CommentView.listDetail({
						model: model
					}).render().$el;

					this.$el.find(".loading").remove();

					//新增放前面
					if (model.toJSON().isAdd) {
						this.$el.prepend($list);
					} else {
						this.$el.append($list);
					}
				},

				//无数据
				dataNull() {
					this.$el.html('<li class="loading" data-i18n="data.drawing-model.Ndd" data-i18n="data.drawing-model.Ndd">无数据</li>');
				},

				//重新加载
				reLoading() {

					this.$el.html('<li class="loading">' +
                        (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
                        '</li>');
				}

			}),

			//用户
			User: Backbone.View.extend({

				tagName: "ul",

				className: "userList",

				//初始化
				initialize() {
					this.listenTo(CommentCollections.User, "add", this.addOne);
					this.listenTo(CommentCollections.User, "reset", this.reLoading);
					this.listenTo(CommentCollections.User, "dataNull", this.dataNull);
				},

				render() {
					return this;
				},

				//新增数据
				addOne(model) {

					var $list = new CommentView.listDetail({
						model: model
					}).render().$el;

					if (model.toJSON().isAdd) {
						this.$el.prepend($list);
					} else {
						this.$el.append($list);
					}


					this.$el.find(".loading").remove();
				},

				//无数据
				dataNull() {
					this.$el.html('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
				},

				//重新加载
				reLoading() {

					this.$el.html('<li class="loading">' +
                        (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
                        '</li>');
				}

			}),

			//单个列表
			listDetail: Backbone.View.extend({

				tagName: "li",

				className: "item",

				events: {
					"click .remarkCount": "viewComments",
					"click": "showComment",
					"keydown": "delComment",
				},

				//初始化
				initialize() {
					this.listenTo(this.model, "destroy", this.remove);
					this.listenTo(this.model, "change", this.afterUpdate);
					Backbone.on('delViewPoint', this.delViewPoint, this);
				},

				template: _.templateUrl('/libsH5/tpls/comment/bimview.pro.comment.list.detail.html'),

				render() {

					var data = this.model.toJSON();
					this.$el.html(this.template(data)).data("hosttype", data.hostType);
					this.$el.attr('tabindex', 1);
					//this.bindContent();
					return this;
				},

				delComment(event) {

					if (event.keyCode == 46) {
						var $item = $(event.target).closest(".item");

						if ($item.hasClass("selected") && parseInt($comment.find(".commentRemark ").css("left")) == 330) {

							var creatorId = $item.find(".name").data("creatorid");

							if (creatorId == (App.Global.User && App.Global.User.userId)) {
								$.confirm((App.Local.data['drawing-model'].Stt || "确认删除该快照么？"), function() {
									Backbone.trigger('delViewPoint', $item.find(".remarkCount").data("id"));
								});
							} else {
								$.tip({
									type: 'alarm',
									message: '您无权限删除该批注'
								});
							}

						}

					}

				},

				//显示批注
				showComment(event) {

					var $item = $(event.target).closest(".item");

					//项目批注
					if ($item.data("hosttype") == 0) {
						CommentApi.showComment($item);
					} else {
						//事件会重复冒泡 
						// if (!$item.data("isClick")) {
						// 	//阻止冒泡 之后 需要恢复 
						// 	$item.data("isClick", true);
						// 	$item.find(".linkImg").click();
						// 	//恢复
						// 	var timer = setTimeout(function() {
						// 		clearTimeout(timer);
						// 		$item.data("isClick", false);
						// 	}, 10);
						// }
						$item.addClass("selected").siblings().removeClass("selected");
						return;

					}

				},

				//更新后操作
				afterUpdate() {

					var data = this.model.toJSON();

					if (data.type == 1 && $comment.find(".navBar .project").hasClass("selected") || data.type == 0 && $comment.find(".navBar .user").hasClass("selected")　) {

						this.$el.html(this.template(data));

						this.bindContent();

						return this;
					} else {
						this.remove();
					}

				},

				//删除数据
				remove() {

					this.$el.slideUp(function() {

						var $this = $(this),
							$parent = $this.parent();

						$this.remove();

						if ($parent.find("li").length <= 0) {
							$parent.html('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
						}

					});


					if (parseInt($comment.find(".commentRemark").css("left")) == 0) {
						$comment.find(".goList").click();
					}



				},

				//查看发表评论
				viewComments(event) {
					var $el = $(event.target).closest(".remarkCount"),
						id = $el.data("id"),
						$item = $el.closest(".item"),
						creatorId = $item.find(".name").data("creatorid");

					//批注信息 赋值
					$(".commentRemark .viewPointInfo").html($item.html());

					if (creatorId == (App.Global.User && App.Global.User.userId)) {
						$(".commentRemark  .reMarkBox .operators").show();
					} else {
						$(".commentRemark  .reMarkBox .operators").hide();
					}

					// $comment.find(".commentList").animate({
					// 	left: "330px"
					// }, 500);

					$comment.find(".commentList").css('left', '330px');


					// $comment.find(".commentRemark").show().animate({
					// 	left: "0px"
					// }, 500);

					$comment.find(".commentRemark").show().css("left", "0px");

					$el.addClass('current');
					//获取数据
					CommentCollections.ViewComments.reset();
					CommentCollections.ViewComments.projectId = App.Project.Settings.projectId;
					CommentCollections.ViewComments.viewPointId = id;
					viewPointId = id;

					//分享
					if (App.Project && App.Project.Settings.isShare) {
						CommentCollections.ViewComments.urlType = "viewCommentsByToken";
						CommentCollections.ViewComments.auth = App.Project.Settings.token;
					} else {
						CommentCollections.ViewComments.urlType = "viewComments";
					}


					CommentCollections.ViewComments.fetch({
						success(model, data) {
							$(".commentRemark .remarkBox .count").text(data.data.length);
							this.$(".reMarkListBox").css("bottom", this.$(".talkReMark").height() + 10);
							$comment.find(".fullLoading").hide();
						}
					});

					//只有项目模型 显示 位置 和  批注
					if ($item.data("hosttype") == 0) {
						//.btnAdress,
						$comment.find(".btnCommViewPoint").show();
					} else {
						//.btnAdress,
						$comment.find(".btnCommViewPoint").hide();
					}

					event.stopPropagation();

				},


				bindContent() {

					var that = this;

					this.$el.contextMenu('viewPointContextPoint', {
						theme: "viewPointContext",
						shadow: false,
						//显示 回调
						onShowMenuCallback: function(event) {

							var $li = $(event.target).closest(".item"),
								createId = $li.find(".name").data("creatorid");

							if (!$li.hasClass("selected")) {
								CommentApi.showComment($li);
							}

							//创建者 可以 删除 分享 编辑
							if (App.Global.User && App.Global.User.userId == createId && !App.Project.Settings.isShare) {
								$("#shareViewPoint,#delViewPoint,#editViewPoint,#reName").show();
							} else {
								$("#shareViewPoint,#delViewPoint,#editViewPoint,#reName").hide();
							}

						},
						//事件绑定
						bindings: {

							downLoadViewPoint(li) {
								//下载
								window.location.href = $(li).find(".thumbnailImg").prop("src");
							},

							shareViewPoint(li) {
								//分享
								CommentApi.shareViewPointData($(li));

							},

							talkViewPoint(li) {
								//评论
								$(li).find(".remarkCount").click();
							},

							editViewPoint(li) {

								CommentApi.editViewPoint($(li));
								//修改
								//that.editViewPoint(li);

							},

							reName(li) {
								//修改
								CommentApi.reName($(li));
							},

							'delViewPoint': function() {

								$.confirm((App.Local.data['drawing-model'].Stt || "确认删除该快照么？"), function() {
									that.delViewPoint();
								});
								// //删除视点
								// if ($.confirm("确认删除该视点么？")) {
								// 	that.delViewPoint();
								// }
							}

						}
					});
				},



				//删除试点
				delViewPoint(delId) {
					var id = this.$(".remarkCount").data("id");
					if (delId == id) {
						this.model.projectId = App.Project.Settings.projectId;
						this.model.viewPointId = id;
						this.model.destroy();
					}
				}

			}),

			//评论
			ReMark: Backbone.View.extend({

				tagName: "div",

				className: "reMarkBox",

				events: {
					"click .btnUploadImg": "triggerUpload", //上传图片
					"change .uploadImg": "uploadImg", //开始上传
					"click .goList": "goList",
					"click .btnEnter": "sendComment",
					"click .delUploadImg": "removeImg", //移除图片
					"focus .txtReMark": "inputReMark", //输入评论
					"blur .txtReMark": "outReMark", //失去焦点
					"click .iconShare": "share", //分享
					"click .iconEdit": "reNameViewPoint", //编辑视点
					"click .iconDel": "deleteComment",
					"click .btnAdress": "address", //地址
					"click .btnCommViewPoint": "commentViewPoint",
					"click .viewPointInfo .info": "viewPointShow",
					"click .btnLogin": "login" //登陆
				},

				initialize() {
					this.listenTo(CommentCollections.ViewComments, "add", this.addOne);
					this.listenTo(CommentCollections.ViewComments, "reset", this.reLoading);
					this.listenTo(CommentCollections.ViewComments, "dataNull", this.dataNull);

				},

				template: _.templateUrl('/libsH5/tpls/comment/bimview.remark.html')(),

				//渲染
				render() {
					//模板
					this.$el.html(this.template);

					this.$(".txtReMark").at({

						getData: function(name) {

							//返回数据源
							var data = {
								URLtype: "autoComplateUser",
								data: {
									projectId: App.Project.Settings.projectId,
									name: name
								}
							}
							return App.Comm.ajax(data);
						},

						callback: function($item) {
							//点击单个用户回调
							atUserArr.push({
								userId: $item.data("uid") + "",
								userName: $item.find(".name").text().trim()
							});
						}
					});
					return this;
				},

				//删除批注
				deleteComment(event) {
					$.confirm((App.Local.data['drawing-model'].Stt || "确认删除该快照么？"), function() {
						Backbone.trigger('delViewPoint', $(event.target).closest(".reMarkBox").find(".viewPointInfo .remarkCount").data("id"));
					});

				},

				//显示视点
				viewPointShow(event) {

					var $item = $(event.target).closest(".viewPointInfo");
					//项目模型
					if ($comment.find(".remarkCount.current").closest(".item").data("hosttype") == 0) {
						//移除选中
						$comment.find(".reMarkBox .selected").removeClass("selected");
						//显示批注
						CommentApi.showComment($item);
					} else {
						//事件会重复冒泡 
						// if (!$item.data("isClick")) {
						// 	//阻止冒泡 之后 需要恢复 
						// 	$item.data("isClick", true);
						// 	$item.find(".linkImg").click();
						// 	//恢复
						// 	var timer = setTimeout(function() {
						// 		clearTimeout(timer);
						// 		$item.data("isClick", false);
						// 	}, 10);
						// }
						$item.addClass("selected").siblings().removeClass("selected");
						return;
					}

				},

				//评论视点
				commentViewPoint() {
					CommentApi.saveCommentStart(null, "commentViewPoint", (data) => {
						if(App.Project.NotesCollection && App.Project.NotesCollection.uploadsnapshotCallbackHandle){
							App.Project.NotesCollection.uploadsnapshotCallbackHandle({
								pictureUrl: data.pic,
								description: data.name,
								id: data.id
							});
						}
					})
					/*CommentApi.saveCommentStart(null, "commentViewPoint", (data) => {

						//上传地址或者评论视点后
						CommentApi.afterUploadAddressViewPoint.call(this, {
							pictureUrl: data.pic,
							description: data.name,
							id: data.id
						});

						//显示
						$(".modelSidebar").addClass("show open");
					});*/
				},

				//保存位置
				address() {

					//直接保存
					CommentApi.saveCommentStart(null, "address", (data) => {
						//上传地址或者评论视点后
						CommentApi.afterUploadAddressViewPoint.call(this, data);
						//显示
						// $(".modelSidebar").addClass("show open");
						//显示
						if($(".modelSidebar").hasClass("open")){
							$(".modelSidebar").addClass("show open");
						}else{
							$(".modelSidebar").addClass("show");
						}
					});
					$("#topSaveTip .btnSave").click();
				},

				//编辑批注
				reNameViewPoint() {
					var $data = $(event.target).closest(".reMarkBox").find(".viewPointInfo");
					CommentApi.reName($data);
				},

				//分享
				share(event) {
					var $data = $(event.target).closest(".reMarkBox").find(".viewPointInfo");
					CommentApi.shareViewPointData($data);
				},

				login() {
					//初始化登陆
					App.Project.Share.initLogin();
				},

				//上传图片
				triggerUpload() {

					var url = "sixD/" + App.Project.Settings.projectId + "/viewPoint/" + viewPointId + "/comment/pic"

					if (App.Project && App.Project.Settings.isShare) {

						url = App.Comm.getUrlByType({
							URLtype: "uploadPicByToken",
							data: {
								auth: App.Project.Settings.token
							}
						}).url;
					}

					$("#viewPointUploadImageForm").prop("action", url);
					//上传完成
					if (!this.bindUpload) {
						this.uploadSuccess();
						this.bindUpload = true;
					}

					return this.$(".uploadImg").click();
				},

				uploadImg() {

					//提交
					$("#viewPointUploadImageForm").submit();

					var imgLoadHTML = _.templateUrl('/libsH5/tpls/comment/upload.img.html', true);

					this.$(".uploadImgs").append(imgLoadHTML);

					this.listHeight();

				},

				//图片上传成功
				uploadSuccess(event) {

					var that = this;

					$("#viewPintUploadIframe").on("load", function(event) {

						var data = JSON.parse(this.contentDocument.body.innerText);
						if (data.code == 0) {

							data = data.data;

							that.$(".uploading:first").find(".talkImg").prop("src", "/" + data.pictureUrl).show().end().
							find(".imgName").text(data.description).addClass("upload").end().
							find(".delUploadImg").show().end().
							data("id", data.id).removeClass("uploading");
							$('.uploadImg').val('');
						}
					});
				},

				//删除图片
				removeImg(event) {
					$(event.target).closest(".singleImg").remove();

				},

				//新增数据
				addOne(model) {

					//模板数据
					var $list = new CommentView.ReMarkListDetail({
							model: model
						}).render().$el,

						$reMarkList = this.$(".reMarkList");

					$reMarkList.append($list);
					//移除加载
					$reMarkList.find(".loading").remove();
					//滚动条
					App.Comm.initScroll(this.$(".reMarkListScroll"), "y");

				},

				//加载数据
				reLoading() {
					this.$(".reMarkList").html('<li class="loading">' +
                        (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
                        '</li>');
				},

				//无数据
				dataNull() {
					this.$(".reMarkList").html('<li class="loading">暂无评论</li>');
				},

				//返回列表
				goList() {

					$(".remarkCount.current").removeClass("current").find(".count").text($(".commentRemark .remarkBox .count").text());

					// $comment.find(".commentList").animate({
					// 	left: "0px"
					// }, 500);
					// $comment.find(".commentRemark").show().animate({
					// 	left: "330px"
					// }, 500);

					$comment.find(".commentList").css("left", "0px");
					$comment.find(".commentRemark").show().css("left", "330px");
				},

				//获取到焦点
				inputReMark(event) {
					$(event.target).addClass("input");
					//列表高度
					this.listHeight();
				},

				//失去焦点
				outReMark(event) {

					var timer = setTimeout(() => {
						if (!$(event.target).is(":focus")) {
							$(event.target).removeClass("input");
							//列表高度
							this.listHeight();
						}

					}, 500);


				},

				//计算列表高度
				listHeight() {
					this.$(".reMarkListBox").css("bottom", this.$(".talkReMark").height() + 10);
				},

				//发表评论
				sendComment(event) {

					var $btnEnter = $(event.target);

					if ($btnEnter.data("isSubmit")) {
						return;
					}

					if (this.$(".uploading").length > 0) {
						$.tip({
							message: "图片上传中",
							timeout: 3000,
							type: "alarm"
						});
						//alert('图片上传中');
						return;
					}
					//图片
					var pictures = [];
					this.$(".singleImg").each(function() {
						pictures.push($(this).data("id"));
					});

					var texts = this.$(".txtReMark").val().trim().split('@'),
						textsUniq = [],
						atUserArrs = [];
					for (var i = 1; i < texts.length; i++) {
						_.contains(textsUniq, texts[i].split(' ')[0]) ? '' : textsUniq.push(texts[i].split(' ')[0]);
					}

					for (var j = 0; j < textsUniq.length; j++) {
						for (var k = 0; k < atUserArr.length; k++) {
							if (atUserArr[k]['userName'] == textsUniq[j]) {
								//if(atUserArr[k]['userName'].indexOf(textsUniq[j])>-1){
								atUserArrs.push(atUserArr[k]);
								break;
							}
						}

					}
					//其余参数
					var pars = {
							projectId: App.Project.Settings.projectId,
							viewPointId: viewPointId,
							text: this.$(".txtReMark").val().trim(),
							projectVersionId: +App.Project.Settings.versionId,
							attachments: pictures,
							receivers: atUserArrs,
							auth: App.Project.Settings.token
						},
						data = {
							URLtype: "createComment",
							data: JSON.stringify(pars),
							type: "POST",
							contentType: "application/json"
						};

					//没有文字 且没有附件
					if (!pars.text && pictures.length <= 0) {
						$.tip({
							message: (App.Local.data['drawing-model'].Pes || '请输入评论内容'),
							timeout: 3000,
							type: "alarm"
						});
						return;
					}

					$btnEnter.val((App.Local.data['drawing-model'].Sg || "保存中")).data("isSubmit", true);

					if (App.Project && App.Project.Settings.isShare) {
						data.URLtype = "createCommentByToken";
					}

					App.Comm.ajax(data, (data) => {

						if (data.code == 0) {
							atUserArr = [];
							CommentCollections.ViewComments.push(data.data);
							//清空数据
							$btnEnter.val(App.Local.data['drawing-model'].Comment || '评论').data("isSubmit", false);
							this.$(".uploadImgs").empty();
							this.$(".txtReMark").val('');
							//评论的数量
							var $count = $(".commentRemark .remarkBox .count");
							$count.text(+$count.text() + 1);
						}

					});
				}

			}),

			//讨论列表
			ReMarkListDetail: Backbone.View.extend({

				tagName: "li",

				className: "item",

				events: {
					"click .delTalk": "delTalk",
					"click .showPosition": "showPosition",
					"click .showCommentPoint": "showCommentPoint"
				},

				initialize() {
					this.listenTo(this.model, "destroy", this.remove);
				},

				template: _.templateUrl("/libsH5/tpls/comment/bimview.remark.list.detail.html"),

				render() {

					var data = this.model.toJSON();

					this.$el.html(this.template(data));

					return this;

				},

				//显示位置
				showPosition(event) {

					//退出批注
					App.Project.Settings.Viewer.commentEnd();
					$comment.find(".reMarkBox .selected").removeClass("selected");
					//显示相机
					var camera = $(event.target).closest(".showPosition").addClass("selected").data("camera");
					App.Project.Settings.Viewer.setCamera(camera);

				},

				//评论批注显示
				showCommentPoint() {

					//移除所有选中
					$comment.find(".reMarkBox .selected").removeClass("selected");

					var $showCommentPoint = $(event.target).closest(".showCommentPoint"),
						camera = $showCommentPoint.addClass("selected").data("camera");

					viewPointId = $showCommentPoint.data("viewpointid");

					//显示相机
					App.Project.Settings.Viewer.setCamera(camera);
					//获取显示视点的数据
					CommentApi.getShowCommentData();
				},

				//删除评论
				delTalk(event) {

					$.confirm((App.Local.data["drawing-model"].Stct || '确认删除该评论么？'), () => {
						var $el = $(event.target),
							id = $el.data("id");

						this.model.projectId = App.Project.Settings.projectId;
						this.model.viewPointId = viewPointId;
						this.model.commentId = id;

						if (App.Project && App.Project.Settings.isShare) {
							this.model.urlType = "delCommentByToken";
							this.model.auth = App.Project.Settings.token;
						} else {
							this.model.urlType = "delComment";
						}

						this.model.destroy();
					});

					// if (!confirm('确认删除该评论么？')) {
					// 	return;
					// }



				},

				//删除后
				remove() {

					var $count = $(".commentRemark .remarkBox .count");
					$count.text(+$count.text() - 1);

					this.$el.slideUp(function() {

						var $this = $(this),
							$parent = $this.parent();

						$this.remove();

						if ($parent.find("li").length <= 0) {
							$parent.html('<li class="loading">暂无评论</li>');
						}

					});
				}

			})

		},


		CommentApi = {

			//开始保存批注
			saveCommentStart(viewPointId, cate, callback) {

				//收起导航
				$(".modelSidebar").removeClass("show open");
				//保存
				App.Project.Settings.Viewer.comment();

				var topSaveHtml = _.templateUrl('/libsH5/tpls/comment/bimview.top.save.tip.html', true);

				$(".commentBar").append(topSaveHtml);
				$('body').localize();
				//保存事件
				CommentApi.saveCommEvent(viewPointId, cate, callback);
			},

			//绑定保存 批注事件
			saveCommEvent(viewPointId, cate, callback) {
				var $topSaveTip = $("#topSaveTip"),
					that = this;
				//保存
				$topSaveTip.on("click", ".btnSave", function() {
					var callbackObj = function(data){
						var pars = {
							cate: cate,
							img: data.image
						}
						if (viewPointId) {
							var $li = $comment.find(".remarkCount_" + viewPointId).closest(".item");
							pars = {
								cate: cate,
								id: $li.find(".remarkCount").data("id"),
								type: $li.find(".thumbnailImg").data("type"),
								img: $li.find(".thumbnailImg").prop('src'),
								name: $li.find(".title").text().trim()
							}
						}
						var title = (App.Local.data['drawing-model'].Save || "保存快照");
						if (cate == "address") {
							title = "保存位置";
						} else if (cate == "comment") {
							title = "保存批注";
						}
						var dialogHtml = _.templateUrl('/libsH5/tpls/comment/bimview.save.dialog.html')(pars),
							opts = {
								title: title,
								width: 500,
								height: 250,
								cssClass: "saveViewPoint",
								okClass: "btnWhite",
								cancelClass: "btnWhite",
								okText: (App.Local.data['drawing-model'].Save || "保存"),
								closeCallback: function() {
									if (cate != "viewPoint") {
										// App.Project.Settings.Viewer.commentEnd();
										// //收起导航
										// // $(".modelSidebar").addClass("show open");
										// //显示
										// if($(".modelSidebar").hasClass("open")){
										// 	$(".modelSidebar").addClass("show open");
										// }else{
										// 	$(".modelSidebar").addClass("show");
										// }
									} else{
										//App.Project.Settings.Viewer.viewer.extensionHelper.annotationHelper.annotationEditor.addDomEventListeners();///
									}
								},

								cancelText: (App.Local.data['drawing-model'].SSe || "保存并分享"),

								message: dialogHtml,

								okCallback: () => {
									//保存批注
									if (!viewPointId) {

										if (cate == "address") {
											//保存位置
											that.savePosition(dialog, data, callback);
										} else {
											that.saveComment("save", dialog, data, callback, cate);
										}

									} else {
										data.id = viewPointId;
										that.editComment("save", dialog, data, viewPointId, callback, cate);
									}

									return false;
								},
								cancelCallback() {
									//保存并分享
									if (!viewPointId) {
										that.saveComment("saveShare", dialog, data, CommentApi.shareViewPoint, cate);
									} else {
										data.id = viewPointId;
										that.editComment("saveShare", dialog, data, CommentApi.shareViewPoint, cate);
									}

									return false;
								}
							},

							dialog = new App.Comm.modules.Dialog(opts),

							$viewPointType = dialog.element.find(".viewPointType");
						//分享按钮
						if (cate != "viewPoint") {
							dialog.element.find(".cancel").remove();
						}
						dialog.type = 1;
						//视点类型
						$viewPointType.myDropDown({
							click: function($item) {
								var type = $item.data("type");
								if (type == 0) {
									$viewPointType.find(".modelicon").removeClass('m-unlock').addClass('m-lock');
								} else {
									$viewPointType.find(".modelicon").removeClass('m-lock').addClass('m-unlock');
								}

								dialog.type = type;
							}
						});
					}
					var data = App.Project.Settings.Viewer.saveComment(callbackObj);
				});
				//取消
				$topSaveTip.on("click", ".btnCanel", function() {
					App.Project.Settings.Viewer.commentEnd();
					//显示
					if($(".modelSidebar").hasClass("open")){
						$(".modelSidebar").addClass("show open");
					}else{
						$(".modelSidebar").addClass("show");
					}
					if($(".toolsBar > i.m-camera").hasClass("selected")){
						$(".toolsBar > i.m-camera").removeClass("selected")
					}

				});
			},

			//保存批注
			saveComment(type, dialog, commentData, callback, cate) {
				
				if (dialog.isSubmit) {
					return;
				}
				var $element = dialog.element,
					pars = {
						projectId: App.Project.Settings.projectId,
						projectVersionId: parseInt(App.Project.Settings.versionId),
						name: dialog.element.find(".name").val().trim(),
						type: dialog.type,
						viewPointId: App.Project.NotesCollection.defaults.viewpointId,
						viewPoint: commentData.camera
					};

				if (!pars.name) {
					$.tip({
						message: (App.Local.data['drawing-model'].Pdt || "请输入快照描述"),
						timeout: 3000,
						type: "alarm"
					});
					//alert("请输入批注名称");
					return false;
				}else if(pars.name.length>512){
					$.tip({
						message: "超出最大字数512",
						timeout: 3000,
						type: "alarm"
					});
					return false;

				}


				var data = {
					URLtype: cate != "viewPoint" ? "viewPointCommentViewpoint" : "createViewPoint",
					data: JSON.stringify(pars),
					type: "POST",
					contentType: "application/json"
				}

				if (type == "save") {
					dialog.element.find(".ok").text((App.Local.data['drawing-model'].Sg || "保存中"));
				} else {
					dialog.element.find(".cancel").text((App.Local.data['drawing-model'].Sg || "保存中"));
				}
				//保存中
				dialog.isSubmit = true;

				//创建
				App.Comm.ajax(data, (data) => {
					if (data.code == 0) {
						App.Project.Settings.NotesDatas = undefined;
						App.Project.Settings.shareBool = undefined;
						App.Project.Settings.pageBool = undefined;
						App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
						data = data.data;
						//赋值id
						commentData.id = data.id;
						//保存 图片 canvas filter
						$.when(this.saveImage({
								id: data.id,
								img: commentData.image
							}),
							this.saveAnnotation(commentData),
							this.saveFilter(commentData)).
						done((imgData, annotationData, filterData) => {

							imgData = imgData[0];

							annotationData = annotationData[0];

							filterData = filterData[0];

							//成功
							if (imgData.code == 0 && annotationData.code == 0 && filterData.code == 0) {

								imgData.data.isAdd = true;
								//创建视点 才添加 colleciton
								if (cate == "viewPoint") {
									//项目
									if ($comment.find(".navBar .project").hasClass("selected")) {
										if (dialog.type == 1) {
											CommentCollections.Project.push(imgData.data);
										} else {
											$comment.find(".navBar .user").click();
										}

									} else if ($comment.find(".navBar .user").hasClass("selected")) {
										//个人
										if (dialog.type == 0) {
											CommentCollections.User.push(imgData.data);
										} else {
											$comment.find(".navBar .project").click();
										}

									}
								}

								//关闭弹出层 取消编辑状态
								dialog.close();

								//显示
								// $(".modelSidebar").addClass("show open");

								$("#topSaveTip .btnCanel").click();

								if ($.isFunction(callback)) {
									callback(imgData.data);
								}
							}

						});
						if($(".toolsBar > i.m-camera").hasClass("selected")){
							$(".toolsBar > i.m-camera").removeClass("selected")
						}

					} else {
						alert(data.message);
						if (type == "save") {
							dialog.element.find(".ok").text((App.Local.data['drawing-model'].Save || "保存"));
						} else {
							dialog.element.find(".cancel").text((App.Local.data['drawing-model'].SSe || "保存并分享"));
						}

						dialog.isSubmit = false;
					}

				});

			},

			//保存图片
			saveImage(data) {
				//数据
				var formdata = new FormData();
				formdata.append("fileName", (+(new Date())) + ".png");
				formdata.append("size", data.img.length);
				formdata.append("file", data.img);
				var url = '/sixD/' + App.Project.Settings.projectId + '/viewPoint/' + data.id + '/pic';
				return $.ajax({
					url: url,
					type: "post",
					data: formdata,
					processData: false,
					contentType: false
				})
			},

			//保存批注数据
			saveAnnotation(commentData) {

				var pars = {
						projectId: App.Project.Settings.projectId,
						viewPointId: commentData.id,
						annotations: commentData.list
					},
					data = {
						URLtype: "createAnnotation",
						type: "POST",
						contentType: 'application/json',
						data: JSON.stringify(pars)
					}

				return App.Comm.ajax(data);
			},

			//保存过滤器
			saveFilter(commentData) {

				var filterArr = [];

				for (var key in commentData.filter) {
					commentData.filter[key].cateType = key;
					filterArr.push(JSON.stringify(commentData.filter[key]));
				}

				var pars = {
						projectId: App.Project.Settings.projectId,
						viewPointId: commentData.id,
						filters: filterArr
					},
					data = {
						URLtype: "savePointFilter",
						type: "POST",
						contentType: 'application/json',
						data: JSON.stringify(pars)
					}

				return App.Comm.ajax(data);
			},

			//分享解析数据
			shareViewPointData($li) {
				var data = {
					id: $li.find(".remarkCount").data("id"),
					pic: $li.find(".thumbnailImg").prop("src"),
					creatorName: $li.find(".name").text().trim(),
					name: $li.find(".title").text().trim(),
					createTime: $li.find(".date").text().trim()
				};
				this.shareViewPoint(data);
			},

			//保存位置
			savePosition(dialog, data, callback) {

				if (dialog.isSubmit) {
					return;
				}

				var description = dialog.element.find(".name").val().trim();

				if (!description) {
					$.tip({
						message: "请输入位置信息",
						timeout: 3000,
						type: "alarm"
					});
					//alert("请输入位置信息");
					return;
				}

				var viewPintId = $comment.find('.remarkCount.current').data("id"),
					//数据
					formdata = new FormData();

				formdata.append("fileName", (+(new Date())) + ".png");
				formdata.append("size", data.image.length);
				formdata.append("file", data.image);

				var pars = {
						URLtype: 'viewPointPosition',
						data: {
							projectId: App.Project.Settings.projectId,
							viewPointId: viewPintId,
							description: description,
							position: data.camera
						}
					},
					url = App.Comm.getUrlByType(pars).url;

				$.ajax({
					url: url,
					type: "post",
					data: formdata,
					processData: false,
					contentType: false
				}).done(function(data) {
					if (data.code == 0) {
						if ($.isFunction(callback)) {
							callback(data.data);
						}
						dialog.close();
						App.Project.Settings.Viewer.commentEnd();
					}
				});

			},

			//分享视点
			shareViewPoint(obj) {

				var data = {
					URLtype: 'shareComment',
					type: "POST",
					contentType: 'application/json',
					data: JSON.stringify({
						projectId: App.Project.Settings.projectId,
						projectVersionId: App.Project.Settings.versionId,
						viewpointId: obj.id
					})
				}

				App.Comm.ajax(data, function(data) {

					if (data.code == 0) {
						// obj.url = "http://" + location.host + "/#projects/"+data.data.projectId+"/"+data.data.projectVersionId+"?share=true&viewpointId="+obj.id+"&projectId="+data.data.projectId+"&currentPageNum=";
						obj.url = "http://" + location.host + "/page/share.html?projectId="+data.data.projectId+"&projectVersionId="+data.data.projectVersionId+"&viewpointId="+obj.id;
						var dialogHtml = _.templateUrl('/libsH5/tpls/comment/bimview.share.dialog.html')(obj),
							opts = {
								title: (App.Local.data['drawing-model'].Share || "分享快照"),
								width: 500,
								height: 250,
								cssClass: "saveViewPoint",
								isConfirm: false,
								message: dialogHtml
							},

							dialog = new App.Comm.modules.Dialog(opts),

							$btnCopy = dialog.element.find(".btnCopy");

						//复制 http://bim.wanda-dev.cn/page/#share/a374
						// var clip = new ZeroClipboard($btnCopy[0]);

						// clip.on("complete", function(e) {
						// 	alert("您已经复制了链接地址");
						// });

						//h5 复制
						if (clipboard) {
							clipboard.destroy();
						}
						clipboard = new Clipboard(".saveViewPoint .btnCopy");
						clipboard.on('success', function(e) {
							$.tip({
								message: (App.Local.data['drawing-model'].Yhk || "您已经复制了链接地址"),
								timeout: 3000
							});
							//alert("您已经复制了链接地址");
							e.clearSelection();
						});

					}


				});

			},

			//编辑 批注
			editComment(type, dialog, commentData, callback) {

				if (dialog.isSubmit) {
					return;
				}
				var $element = dialog.element,
					that = this,
					pars = {
						viewPointId: commentData.id,
						projectId: App.Project.Settings.projectId,
						name: dialog.element.find(".name").val().trim(),
						type: dialog.type
					};

				if (!pars.name) {
					$.tip({
						message: App.Local.data['drawing-model'].Pdt || "请输入快照描述",
						timeout: 3000,
						type: "alarm"
					});
					//alert("请输入批注名称");
					return false;
				}

				var data = {
					URLtype: "updateViewPoint",
					data: JSON.stringify(pars),
					type: "PUT",
					contentType: "application/json"
				}

				if (type == "save") {
					dialog.element.find(".ok").text((App.Local.data['drawing-model'].Sg || "保存中"));
				} else {
					dialog.element.find(".cancel").text((App.Local.data['drawing-model'].Sg || "保存中"));
				}
				//保存中
				dialog.isSubmit = true;

				//创建
				App.Comm.ajax(data, (data) => {

					if (data.code == 0) {

						//请求
						$.when(this.saveImage({
							id: commentData.id,
							img: commentData.image
						}), this.updateAnnotation(commentData)).
						done((imgData, annotationData) => {

							imgData = imgData[0];

							annotationData = annotationData[0];

							if (imgData.code == 0 && annotationData.code == 0) {

								var id = imgData.data.id,
									models = [];

								//项目
								if ($comment.find(".navBar .project").hasClass("selected")) {

									models = CommentCollections.Project.models;

								} else {
									//个人
									models = CommentCollections.User.models;
								}

								$.each(models, function() {
									if (this.toJSON().id == id) {
										this.set(imgData.data);
										//跳出循环
										return false;
									}
								});


								dialog.close();
								//取消
								$("#topSaveTip .btnCanel").click();
								//回掉
								if ($.isFunction(callback)) {
									callback(imgData.data);
								}
							}

						});
					} else {
						dialog.isSubmit = false;
						if (type == "save") {
							dialog.element.find(".ok").text((App.Local.data['drawing-model'].Save || "保存"));
						} else {
							dialog.element.find(".cancel").text((App.Local.data['drawing-model'].SSe || "保存并分享"));
						}
						alert(data.message);
					}

				});

			},

			//修改批注
			editViewPoint($li) {


				var viewPointId = $li.find(".remarkCount").data("id"),
					data = {
						URLtype: "getAnnotation",
						data: {
							projectId: App.Project.Settings.projectId,
							viewPointId: viewPointId
						}
					},
					viewPint = $li.find(".thumbnailImg").data("viewpoint");

				$li.addClass("selected").siblings().removeClass("selected");

				App.Project.Settings.Viewer.setCamera(viewPint);

				App.Comm.ajax(data, function(data) {

					if (data.code == 0) {

						var filterObj = {

							},
							item;

						$.each(data.data.filters, function(i, item) {
							item = JSON.parse(item);
							filterObj[item.cateType] = item;
							delete item.cateType;
						});

						//保存
						App.Project.Settings.Viewer.comment(filterObj);

						var topSaveHtml = _.templateUrl('/libsH5/tpls/comment/bimview.top.save.tip.html', true);

						$(".modelContainerContent .commentBar").append(topSaveHtml);
						//保存事件
						CommentApi.saveCommEvent(viewPointId, 'viewPoint');

					}
				})


			},

			//修改视点
			reName($li) {

				var data = {
						cate: "viewPoint",
						id: $li.find(".remarkCount").data("id"),
						type: $li.find(".thumbnailImg").data("type"),
						img: $li.find(".thumbnailImg").prop('src'),
						name: $li.find(".title").text().trim()
					},

					dialogHtml = _.templateUrl('/libsH5/tpls/comment/bimview.save.dialog.html')(data),

					opts = {
						title: (App.Local.data['drawing-model'].Modify || "修改快照"),
						width: 500,
						height: 250,
						cssClass: "saveViewPoint",
						okClass: "btnWhite",
						cancelClass: "btnWhite",
						okText: (App.Local.data['drawing-model'].Save || "保存"),
						cancelText: (App.Local.data['drawing-model'].Cancel || '取消'),
						message: dialogHtml,
						okCallback: () => {
							//保存批注
							this.updateComment(dialog);

							return false;
						}
					},

					dialog = new App.Comm.modules.Dialog(opts),

					$viewPointType = dialog.element.find(".viewPointType");

				dialog.type = data.type;

				dialog.id = data.id;
				//视点类型
				$viewPointType.myDropDown({
					click: function($item) {
						var type = $item.data("type");
						if (type == 0) {
							$viewPointType.find(".modelicon").removeClass('m-unlock').addClass('m-lock');
						} else {
							$viewPointType.find(".modelicon").removeClass('m-lock').addClass('m-unlock');
						}

						dialog.type = type;
					}
				});
			},

			//更新视点
			updateComment(dialog) {

				if (dialog.isSubmit) {
					return;
				}
				var $element = dialog.element,
					pars = {
						viewPointId: dialog.id,
						projectId: App.Project.Settings.projectId,
						name: dialog.element.find(".name").val().trim(),
						type: dialog.type
					};

				if (!pars.name) {
					$.tip({
						message: App.Local.data['drawing-model'].Pdt || "请输入快照描述",
						timeout: 3000,
						type: "alarm"
					});
					//alert("请输入批注名称");
					return false;
				}

				var data = {
					URLtype: "updateViewPoint",
					data: JSON.stringify(pars),
					type: "PUT",
					contentType: "application/json"
				}

				//保存中
				dialog.element.find(".ok").text((App.Local.data['drawing-model'].Sg || "保存中"));
				dialog.isSubmit = true;

				dialog.element.find(".ok").text((App.Local.data['drawing-model'].Sg || "保存中"));

				//创建
				App.Comm.ajax(data, (data) => {

					if (data.code == 0) {


						//项目
						// if ($comment.find(".navBar .project").hasClass("selected")) {
						// 	if (dialog.type == 1) {
						// 		models = CommentCollections.Project.models;
						// 	} else {
						// 		$comment.find(".navBar .user").click();
						// 	}

						// } else if ($comment.find(".navBar .user").hasClass("selected")) {
						// 	//个人
						// 	if (dialog.type == 0) {
						// 		models = CommentCollections.User.models;
						// 	} else {
						// 		$comment.find(".navBar .project").click();
						// 	}

						// }
						var models = [];
						//项目
						if ($comment.find(".navBar .project").hasClass("selected")) {
							models = CommentCollections.Project.models;
						} else {
							//个人
							models = CommentCollections.User.models;
						}

						if (models) {
							$.each(models, function() {
								if (this.toJSON().id == dialog.id) {
									this.set(data.data);
									//跳出循环
									return false;
								}
							});
						}

						//评论中的视点信息
						var $item = $comment.find(".remarkCount_" + dialog.id).closest(".item");
						//批注信息 赋值
						$(".commentRemark .viewPointInfo").html($item.html());


						dialog.close();
						$(".remarkCount_" + dialog.id).closest('.info').find('.title').text(pars.name);
					} else {

						alert(data.message);
						dialog.isSubmit = false;
						dialog.element.find(".ok").text((App.Local.data['drawing-model'].Save || "保存"));
					}

				});

			},

			//更新批注
			updateAnnotation(commentData) {
				var pars = {
						projectId: App.Project.Settings.projectId,
						viewPointId: commentData.id,
						annotations: commentData.list
					},
					data = {
						URLtype: "createAnnotation",
						type: "PUT",
						contentType: 'application/json',
						data: JSON.stringify(pars)
					}

				return App.Comm.ajax(data);
			},

			//上传地址或者评论视点后
			afterUploadAddressViewPoint(data) {

				var imgLoadHTML = _.templateUrl('/libsH5/tpls/comment/upload.img.html', true);
				this.$(".uploadImgs").append(imgLoadHTML);

				this.$(".uploading:first").find(".talkImg").prop("src", "/" + data.pictureUrl).show().end().
				find(".imgName").text(data.description).addClass("upload").end().
				find(".delUploadImg").show().end().
				data("id", data.id).removeClass("uploading").data("data", data);

			},

			//显示批注
			showComment($item) {

				var viewPint = $item.find(".thumbnailImg").data("viewpoint");

				viewPointId = $item.find(".remarkCount").data("id");

				$item.addClass("selected").siblings().removeClass("selected");

				App.Project.Settings.Viewer.setCamera(viewPint);

				//获取显示视点的数据
				this.getShowCommentData();

			},

			//获取显示视点的数据
			getShowCommentData() {

				$.when(this.getFilter(), this.getAnnotation()).done((filterData, annotationData) => {

					filterData = filterData[0];
					//annotationData = annotationData[0];

					if (filterData.code == 0) {

						var filterObj = {

							},
							item;
						$.each(filterData.data.filters, function(i, item) {
							item = JSON.parse(item);
							filterObj[item.cateType] = item;
							delete item.cateType;
						});
						App.Project.Settings.Viewer.loadComment({
							//list: annotationData.data.annotations,
							filter: filterObj
						});
						//隐藏加载
						$("#pageLoading").hide();

					} else {
						alert('数据获取失败');
					}

				});
			},

			//获取 过滤器
			getFilter() {

				var data = {
					URLtype: "getFilter",
					data: {
						projectId: App.Project.Settings.projectId,
						viewPointId: viewPointId
					}
				}

				if (App.Project && App.Project.Settings.isShare) {

					data = {
						URLtype: "getFilterByToken",
						data: {
							auth: App.Project.Settings.token
						}
					}
				}

				return App.Comm.ajax(data);
			},

			//获取批注
			getAnnotation() {
				return true;
				var data = {
					URLtype: "getAnnotation",
					data: {
						projectId: App.Project.Settings.projectId,
						viewPointId: viewPointId
					}
				}

				if (App.Project && App.Project.Settings.isShare) {

					data = {
						URLtype: "getAnnotationByToken",
						data: {
							auth: App.Project.Settings.token
						}
					}
				}

				return App.Comm.ajax(data);
			}


		}


	//关闭批注
	bimView.prototype.commentEnd = function() {
		// 退出批注模式
		var self = this;
		var viewer = self.viewer;
		self._dom.bimBox.removeClass('comment');
		self._dom.bimBox.find('.commentBar').remove();
		//viewer.editCommentEnd();//旧接口已废弃
		self.getAnnotationObject().editAnnotationEnd();
		viewer.setPickMode();
		//删除保存
		$("#topSaveTip").remove();
	};

})();