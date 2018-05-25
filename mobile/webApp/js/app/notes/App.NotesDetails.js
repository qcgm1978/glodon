//@ sourceURL=App.NotesDetails.js
App.NotesDetails = {
    defaults: {
        notesId: '',
        projectId: '',
        projectVersionId: '',
        fileVersionId: '',
        folderId: '',
        projectName: '',
        modelId: '',
        modelFileName: '',
        notesData: '',
        pageIndex: 1,
        pageNum: 10,
        imgListData: [],
        imgSrcListData: [],
        hrefstr: "",
        getMoreFlag: true,
        isShowLoad: false,
    },
    init: function (arge) {
        var self = this;
        this.initHtml();//初始化页面
        this.arge = arge;
        App.defaults.atName = "";
        App.defaults.atUserZanCunData = false;
        App.defaults.atUserListData = [];
        App.defaults.atNameList = null;
        App.NotesDetails.defaults.imgListData = [];
        App.NotesDetails.defaults.imgSrcListData = [];
        App.NotesDetails.defaults.projectId = arge.projectId;
        App.NotesDetails.defaults.projectVersionId = arge.projectVersionId;
        App.NotesDetails.defaults.folderId = arge.folderId;
        App.NotesDetails.defaults.projectName = arge.name;
        App.NotesDetails.defaults.notesId = arge.notesId;
        App.NotesDetails.defaults.fileVersionId = arge.fileVersionId || null;
        if (App.defaults.notesDetailsObj) {
            this.defaults.pageIndex = App.defaults.notesDetailsObj.pageIndex;
            this.defaults.pageNum = App.defaults.notesDetailsObj.pageIndex * 10;
        }
        if (App.defaults.maxCommentNumber) {
            this.defaults.pageNum = App.defaults.maxCommentNumber;
        }
        if (location.href.indexOf("message") > 0) {
            this.checkProjectAuthHandle(function () {//检查是否有权限
                var commentId = "";
                if (location.href.indexOf("commentId") > 0) {
                    commentId = location.href.substring(location.href.indexOf("commentId") + 10, location.href.indexOf("message") - 1);
                }
                self.dialogCommentDeleteHandle(commentId);//评论是否被删除
            });
        } else if (location.href.indexOf("myNews") > 0) {
            this.checkProjectAuthHandle(function () {//检查是否有权限
                var commentId = "";
                if (location.href.indexOf("commentId") > 0) {
                    commentId = location.href.substring(location.href.indexOf("commentId") + 10, location.href.indexOf("myNews") - 1);
                }
                self.dialogCommentDeleteHandle(commentId);//评论是否被删除
            });
        } else {
            if (App.defaults.outer == undefined) {
                App.Comm.ajax({
                    url: App.Restful.urls.current,
                    success: function (data) {
                        var jsonData = $.parseJSON(data);
                        if (jsonData.code == 0) {
                            App.defaults.userId = jsonData.data.userId;
                            if (App.NotesDetails.defaults.fileVersionId && (App.NotesDetails.defaults.fileVersionId != "null" && App.NotesDetails.defaults.fileVersionId != undefined)) {
                                self.loadModelId();//获取模型预览使用的modelId
                            } else {
                                self.loadNotesInfo();//获取批注详情的方法
                            }
                        } else {
                            alert(data.message);
                        }
                    }
                });
            } else {
                if (App.NotesDetails.defaults.fileVersionId && (App.NotesDetails.defaults.fileVersionId != "null" && App.NotesDetails.defaults.fileVersionId != undefined)) {
                    this.loadModelId();//获取模型预览使用的modelId
                } else {
                    this.loadNotesInfo();//获取批注详情的方法
                }
            }
        }
        $(function () {
            self.initHandle();//初始化页面事件和方法
        })
    },
    initHtml: function () {
        App.notesDetailsHref = location.href;
        App.TitleBar.setTitle("批注详情");//设置顶部标题
        App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
        App.TitleBar.showHomeBtn() //显示home图片
        App.hideMainMenu();//隐藏底部导航栏'
        $("#headerPopMenu").css("display", "none");
        if (!$("#footerBox > div").eq(1).hasClass("footer-box-select")) {//底部导航的定位
            $("#footerBox > div").eq(1).click();
        }
        $("#mainContainer").css("padding-bottom", 0);
    },
    checkProjectAuthHandle: function (callback) {
        var self = this;
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.checkProjectAuth,
            data: {
                projectid: App.NotesDetails.defaults.projectId,
                type: 3,
            },
            success: function (data) {
                var data = JSON.parse(data);
                if (data.code == 0) {
                    if (data.data.isExist == 0) {
                        self.getProjectInfo();//获取项目信息
                        callback();
                    } else if (data.data.isExist == 1) {
                        var Dlgs = App.UI.Dialog.showMsgDialog({
                            title: "提示",
                            text: "用户无项目权限",
                            okText: "确定",
                            onok: function () {
                                if (location.href.indexOf("message") > 0) {
                                    cordova.exec(function () {
                                    }, function () {
                                    }, "WDNaviPlugin", "backAction", ["1"]);
                                } else {
                                    history.back();
                                }
                            },
                        });
                        $(Dlgs.dialog).find(".commDialogCancel").css("display", "none");
                        $(Dlgs.dialog).find(".commDialogOk").css("width", "100%");
                    }
                } else {
                    alert(data.message);
                }
            }
        });
    },
    getProjectInfo: function () {//获取项目信息
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.getProjectIdInfo,
            param: {
                projectId: App.NotesDetails.defaults.projectId,
            },
            success: function (data) {
                var data = JSON.parse(data);
                if (data.code == 0) {
                    App.defaults.isBimControl = data.data.isBimControl;
                } else {
                    alert(data.message);
                }
            }
        })
    },
    dialogCommentDeleteHandle: function (commentId) {//评论是否删除
        var self = this;
        var tipNotesText = "当前批注已删除！";
        var tipNotesReplyText = "评论已删除！";
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.checkNotesUrl,
            data: {
                viewPointId: App.NotesDetails.defaults.notesId,
                commentId: commentId,
            },
            success: function (data) {
                var data = JSON.parse(data);
                if (data.code == 0) {
                    if (data.data.isViewPointExist == 0) {
                        var Dlgs = App.UI.Dialog.showMsgDialog({
                            title: "提示",
                            text: tipNotesText,
                            okText: "确定",
                            onok: function () {
                                cordova.exec(function () {
                                }, function () {
                                }, "WDNaviPlugin", "backAction", ["1"]);
                            },
                        });
                        $(Dlgs.dialog).find(".commDialogCancel").css("display", "none");
                        $(Dlgs.dialog).find(".commDialogOk").css("width", "100%");
                    } else if (data.data.isViewPointExist == 1 && data.data.isViewPointCommentExist == 0) {
                        App.UI.Dialog.showTip({
                            text: tipNotesReplyText,
                            timeout: "3000"
                        });
                        if (App.defaults.outer == undefined) {
                            App.Comm.ajax({
                                url: App.Restful.urls.current,
                                success: function (data) {
                                    var jsonData = $.parseJSON(data);
                                    if (jsonData.code == 0) {
                                        App.defaults.userId = jsonData.data.userId;
                                        self.resetHandle();
                                        if (App.NotesDetails.defaults.fileVersionId && (App.NotesDetails.defaults.fileVersionId != "null" && App.NotesDetails.defaults.fileVersionId != undefined)) {
                                            self.loadModelId();//获取模型预览使用的modelId
                                        } else {
                                            self.loadNotesInfo();//获取批注详情的方法
                                        }
                                    } else {
                                        alert(data.message);
                                    }
                                }
                            });
                        } else {
                            self.resetHandle();
                            if (App.NotesDetails.defaults.fileVersionId && (App.NotesDetails.defaults.fileVersionId != "null" && App.NotesDetails.defaults.fileVersionId != undefined)) {
                                self.loadModelId();//获取模型预览使用的modelId
                            } else {
                                self.loadNotesInfo();//获取批注详情的方法
                            }
                        }
                    } else {
                        if (App.defaults.outer == undefined) {
                            App.Comm.ajax({
                                url: App.Restful.urls.current,
                                success: function (data) {
                                    var jsonData = $.parseJSON(data);
                                    if (jsonData.code == 0) {
                                        App.defaults.userId = jsonData.data.userId;
                                        self.resetHandle();
                                        if (App.NotesDetails.defaults.fileVersionId && (App.NotesDetails.defaults.fileVersionId != "null" && App.NotesDetails.defaults.fileVersionId != undefined)) {
                                            self.loadModelId();//获取模型预览使用的modelId
                                        } else {
                                            self.loadNotesInfo();//获取批注详情的方法
                                        }
                                    } else {
                                        alert(data.message);
                                    }
                                }
                            });
                        } else {
                            self.resetHandle();
                            if (App.NotesDetails.defaults.fileVersionId && (App.NotesDetails.defaults.fileVersionId != "null" && App.NotesDetails.defaults.fileVersionId != undefined)) {
                                self.loadModelId();//获取模型预览使用的modelId
                            } else {
                                self.loadNotesInfo();//获取批注详情的方法
                            }
                        }
                    }
                } else {
                    alert(data.message);
                }
            }
        });
    },
    loadModelId: function () {
        var _this = this;
        var paramData = {
            projectId: App.NotesDetails.defaults.projectId,
            projectVersionId: App.NotesDetails.defaults.projectVersionId,
        }
        var data = {
            fileVersionId: App.NotesDetails.defaults.fileVersionId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.getModelId,
            param: paramData,
            data: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    App.NotesDetails.defaults.modelId = data.data.modelId;
                    App.NotesDetails.defaults.modelFileName = data.data.name;
                    _this.loadNotesInfo();//获取批注详情的方法
                } else {
                    alert(data.message);
                }
            }
        });
    },
    initHandle: function () {//初始化页面事件和方法
        var _this = this;
        var osStr = navigator.userAgent;
        var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
        var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var href = "#/addNotesComment/" + App.NotesDetails.defaults.projectId + "/" + App.NotesDetails.defaults.projectVersionId + "/" + App.NotesDetails.defaults.projectName + "/" + App.NotesDetails.defaults.folderId + "/" + App.NotesDetails.defaults.notesId + "/" + App.NotesDetails.defaults.fileVersionId;
        if (location.href.indexOf("myNews") > 0) {
            App.TitleBar.returnCallback(function () {
                if (App.defaults.notesDetailsObj) {
                    App.defaults.notesDetailsObj = undefined;
                }
                if (App.defaults.maxCommentNumber) {
                    App.defaults.maxCommentNumber = undefined;
                }
                if (App.defaults.maxNumPos || App.defaults.maxNumPos == 0) {
                    App.defaults.maxNumPos = undefined;
                }
                if (!isAndroid && isiOS && typeof cordova !== 'undefined') {
                    cordova.exec(function () {
                    }, function () {
                    }, "WDNaviPlugin", "hiddenNavi", ["1"]);
                }
                location.href = "#/myNews";
            });
        } else if (location.href.indexOf("message") > 0) {
            if (!isAndroid && isiOS && typeof cordova !== 'undefined') {
                cordova.exec(function () {
                }, function () {
                }, "WDNaviPlugin", "hiddenNavi", ["1"]);
            }
            App.TitleBar.returnCallback(function () {
                var backDialog = App.UI.Dialog.showMsgDialog({
                    title: "提示",
                    text: "继续留在筑云平台，还是返回万信会话？",
                    okText: "返回万信",
                    cancelText: "留在筑云",
                    onok: function () {
                        if (isAndroid && !isiOS) {
                            cordova.exec(function () {
                            }, function () {
                            }, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
                        }
                        cordova.exec(function () {
                        }, function () {
                        }, "WDNaviPlugin", "backAction", ["1"]);
                    },
                    oncancel: function () {
                        if (isAndroid && !isiOS) {
                            cordova.exec(function () {
                            }, function () {
                            }, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
                        }
                        var href = '#/notesList/' + App.NotesDetails.defaults.projectId + '/' + App.NotesDetails.defaults.projectVersionId + '/' + decodeURIComponent(App.NotesDetails.defaults.projectName) + '/';
                        location.href = href;
                    }
                });
                $(backDialog.dialog).find(".commDialogContainer").css("padding-top", "0");
                $(backDialog.dialog).find(".commDialogCancel").css("display", "block");
                $(backDialog.dialog).find(".wMobileDialog-titleBar").css("display", "block");
                $(backDialog.dialog).find(".commDialogOk").css("width", "50%");
            });
        } else {
            App.TitleBar.returnCallback(function () {
                if (!isAndroid && isiOS && typeof cordova !== 'undefined') {
                    cordova.exec(function () {
                    }, function () {
                    }, "WDNaviPlugin", "hiddenNavi", ["1"]);
                }
                location.href = App.notesDetailsHref.replace("notesDetails", "notesList");
            });
        }
        $("#addCommentBtn").on("click", function () {
            if (!App.defaults.maxCommentNumber && App.defaults.notesDetailsObj) {
                App.defaults.notesDetailsObj.pageIndex = _this.defaults.pageIndex;
            }
            location.href = href;
            return false;
        });
        $("#notesListBox").on("click", function (evt) {//点击删除按钮执行的方法
            debugger;
            var target = $(evt.target);
            var parentTarget = target.closest("a");
            var openBool = parentTarget.data("open");
            var typestr = parentTarget.data("typestr");
            if (typestr == ".images") {
                return;
            } else if (typestr == ".viewPoint") {
                if (!App.defaults.maxCommentNumber && App.defaults.notesDetailsObj) {
                    App.defaults.notesDetailsObj.pageIndex = _this.defaults.pageIndex;
                }
                location.href = parentTarget.data("openurl");
                return;
            } else if (typestr != undefined && typestr != ".images" && typestr != ".viewPoint") {
                var fileDescription = App.trimHandle(decodeURIComponent(parentTarget.data("description")));//文件名字
                var fileType = parentTarget.data("opentype");//文件类型
                _this.defaults.hrefstr = parentTarget.data("openurl");
                openUrl = parentTarget.data("openurl");
                if (!isAndroid && isiOS && typeof cordova !== 'undefined') {
                    if (fileType == ".mp4" || fileType == ".amr" || fileType == ".mp3" || fileType == ".flv" || fileType == ".wav" || fileType == ".m4v") {
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
                        cordova.exec(_this.onSuccessMoreUplaod, _this.onFail, "WDWebViewOpenTypePlugin", "canOpenFile", [fileType]);
                    }
                } else {//如果是安卓系统
                    _this.downloadImgHandle(location.origin + openUrl, fileDescription);
                }
                return;
            }
            if (target.hasClass("J_profile")) {
                _this.showUserInfoHandle(evt);
                return;
            }
            if (!target.hasClass("ddDelete")) {
                return;
            }
            setTimeout(function () {
                _this.deleteDialog(target);
            }, 340)
            return false;
        });
        $('.close-icon').click(function () {
            $("#userInfoBox").add("#userInfoBox dl").hide();
            $('#wMobile_mask').hide()
        })
        var mainHeaderTitle = $("#mainHeaderTitle");
        mainHeaderTitle.off("click");
        App.UI.ImgDialog.showImgDialog($("#notesListBox"));
        if (mainHeaderTitle.hasClass("upIconBtn")) {
            mainHeaderTitle.removeClass("upIconBtn");
            mainHeaderTitle.removeClass("downIconBtn");
            $(".textBoxNotes").remove();
        }
    },
    deleteDialog: function (target) {
        var _this = this;
        var Dlg = App.UI.Dialog.showMsgDialog({
            title: '提示',
            text: '确认要删除该评论吗？',
            titleColor: "#FF1717",
            css: {
                "line-height": "0.5333rem",
                "font-size": "0.3733rem",
                "text-align": "center"
            },
            onok: function () {
                var deleteData = {
                    projectId: target.data("projectid"),
                    viewPointId: target.data("notesid"),
                    commentId: target.data("commentid"),
                }
                App.Comm.ajax({
                    type: "delete",
                    url: App.Restful.urls.deleteNotesComment,
                    param: deleteData,
                    dataType: "json",
                    success: function (data) {
                        if (data.code == 0) {
                            _this.defaults.pageNum = _this.defaults.pageIndex * 10;
                            _this.loadNotesComment();
                        } else {
                            alert(data.message);
                        }
                    }
                })
            },
            oncancel: function () {
            }
        })
        $(Dlg.dialog).find(".commDialogContainer").css("padding-top", "0");
        $(Dlg.dialog).find(".commDialogCancel").css("display", "block");
        $(Dlg.dialog).find(".wMobileDialog-titleBar").css("display", "block");
        $(Dlg.dialog).find(".commDialogOk").css("width", "50%");
    },
    downloadImgHandle: function (downUrl, name) {//批注查看大图下载图片方法
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
                headers: {},
                fileName: name
            })
    },
    showUserInfoHandle: function (evt) {//鼠标滑过显示用户信息
        var evt = evt || event;
        var userId = $(evt.target).data("userid");
        var userInfoBox = $("#userInfoBox");
        $(".userInfoBox").css('display', 'block');
        userInfoBox.fadeIn(function () {
            App.Comm.getUserInfoHandle(userInfoBox, userId);//获取数据用户信息方法
        });
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
            cordova.exec(function () { }, function () { }, "WDNaviPlugin", "hiddenNavi", ["0"]);
            location.href = App.NotesDetails.defaults.hrefstr;
        }
    },
    onFail: function (evt) {
    },
    loadNotesInfo: function () {//获取批注详情的方法
        var _this = this;
        var data = {
            projectId: App.NotesDetails.defaults.projectId,
            viewPointId: App.NotesDetails.defaults.notesId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.projectNotesDetails,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    var aHtml = "",
                        openUrl = "",
                        imgLogo = "",
                        projectId = data.data.projectId,
                        projectVersionId = data.data.projectVersionId,
                        fileId = data.data.fileId,
                        fileVersionId = data.data.fileVersionId,
                        modelId = App.NotesDetails.defaults.modelId;
                    App.NotesDetails.defaults.notesData = data.data;
                    var notesLogo = data.data.pic;
                    var notesDesc = data.data.name;
                    var notesCreatorName = data.data.creatorName;
                    var projectName = _this.arge.name;
                    var folderId = _this.arge.folderId;
                    var modelFileName = App.NotesDetails.defaults.modelFileName;
                    var changeName = App.replaceKongGeHandle(modelFileName);
                    var notesCreatorTime = Assister.Date.getDateFromHMLong(data.data.createTime);
                    var hostType = data.data.hostType;//0全模型 1单模型 2是图纸
                    var locationStr = location.hash;
                    if (locationStr.indexOf("myNews") > 0) {
                        imgLogo = '<a href="#/notesImg/' + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + modelId + "/" + data.data.id + "/" + fileVersionId + '?myNews=true&hostType=' + data.data.hostType + '"><img src="/' + notesLogo + '"></a>';
                    } else if (locationStr.indexOf("message") > 0) {
                        imgLogo = '<a href="#/notesImg/' + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + modelId + "/" + data.data.id + "/" + fileVersionId + '?message=true&hostType=' + data.data.hostType + '"><img src="/' + notesLogo + '"></a>';
                    } else {
                        imgLogo = '<a href="#/notesImg/' + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + modelId + "/" + data.data.id + "/" + fileVersionId + '?hostType=' + data.data.hostType + '"><img src="/' + notesLogo + '"></a>';
                    }
                    if (hostType == 1) {
                        if (locationStr.indexOf("myNews") > 0) {
                            openUrl = "#/viewModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + modelId + "/notesDetails/" + data.data.id + "/" + fileVersionId + "?t=123456&myNews=true&fileId=" + fileId + "&fileVersionId=" + fileVersionId;
                        } else if (locationStr.indexOf("message") > 0) {
                            openUrl = "#/viewModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + modelId + "/notesDetails/" + data.data.id + "/" + fileVersionId + "?t=123456&message=true&fileId=" + fileId + "&fileVersionId=" + fileVersionId;
                        } else {
                            openUrl = "#/viewModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + modelId + "/notesDetails/" + data.data.id + "/" + fileVersionId + "?t=123456&fileId=" + fileId + "&fileVersionId=" + fileVersionId;
                        }
                        aHtml += '<a id="notesBtn" href="javascript:;" data-href="' + openUrl + '">查看模型</a><a class="aIcon">|</a>';
                        App.Storage.setData("viewPoint", data.data.viewPoint);
                    } else if (hostType == 2) {
                        if (locationStr.indexOf("myNews") > 0) {
                            openUrl = "#/paperModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + fileVersionId + "/notesDetails/" + data.data.id + "/" + fileVersionId + "?t=123456&myNews=true&fileId=" + fileId + "&fileVersionId=" + fileVersionId;
                        } else if (locationStr.indexOf("message") > 0) {
                            openUrl = "#/paperModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + fileVersionId + "/notesDetails/" + data.data.id + "/" + fileVersionId + "?t=123456&message=true&fileId=" + fileId + "&fileVersionId=" + fileVersionId;
                        } else {
                            openUrl = "#/paperModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + fileVersionId + "/notesDetails/" + data.data.id + "/" + fileVersionId + "?t=123456&fileId=" + fileId + "&fileVersionId=" + fileVersionId;
                        }
                        aHtml += '<a id="notesBtn" href="javascript:;" data-href="' + openUrl + '">查看图纸</a><a class="aIcon">|</a>';
                        App.Storage.setData("viewPoint", data.data.viewPoint);
                    }
                    aHtml += '<a href="javascript:;" class="notesShare">分享</a>';
                    if (data.data.creatorId == App.defaults.userId) {
                        aHtml += '<a class="aIcon">|</a><a href="javascript:;" class="notesEdite">编辑</a>'
                    }
                    $("#notesLogo").html(imgLogo);
                    $("#notesDesc").html(notesDesc);
                    $("#notesName").html(notesCreatorName);
                    $("#notesTime").html(notesCreatorTime);
                    $("#notesOperation").html(aHtml);
                    $("#notesEditeDialog>textarea").html(notesDesc);
                    _this.loadNotesComment();//获取批注评论列表的方法
                    _this.initNotesInfoFun();//批注信息渲染之后执行绑定事件的方法
                } else {
                    alert(data.message);
                }
            }
        });
    },
    initNotesInfoFun: function () {//批注信息渲染之后执行绑定事件的方法
        var _this = this;
        $("a#notesBtn").on("click", function () {
            var openUrl = $(this).data("href");
            location.href = openUrl;
            return false;
        })
        $("a.notesEdite").on("click", function () {//点击编辑执行的方法
            $("#notesEditeDialog>textarea").val($("#notesDesc").html());
            var Dlg = App.UI.Dialog.showCommDialog({
                element: $("#notesEditeDialog")[0],
                title: "编辑批注描述",
                titleColor: "#333",
                onok: function (e) {
                    if ($("#notesEditeDialog").find("textarea").val().trim().length == 0) {
                        return false;
                    }
                    _this.notesEdite();//修改了批注描述执行的方法
                }
            });
        })
        $("a.notesShare").on("click", function () {//点击分享执行的方法
            var hash = "";
            var projectId = App.NotesDetails.defaults.projectId;
            var projectVersionId = App.NotesDetails.defaults.projectVersionId;
            var projectName = encodeURIComponent(App.NotesDetails.defaults.projectName);
            var fileVersionId = App.NotesDetails.defaults.fileVersionId;
            var notesId = App.NotesDetails.defaults.notesId;
            hash = "?viewpointId=" + notesId + "&projectId=" + projectId + "&projectVersionId=" + projectVersionId + "&projectName=" + projectName + "&fileVersionId=" + fileVersionId;
            var notesType = App.NotesDetails.defaults.notesData.hostType == 0 || App.NotesDetails.defaults.notesData.hostType == 1 ? "模型批注：" : "图纸批注：";
            var notesName = App.NotesDetails.defaults.notesData.name;
            var dialogUrl = "【" + notesType + notesName + "】" + "http://" + location.host + "/page/share.html" + hash;
            var shareUrl = "【" + notesType + notesName + "】" + encodeURI("http://" + location.host + "/page/share.html" + hash);
            var Dlg = App.UI.Dialog.showMsgDialog({
                title: "分享批注",
                text: dialogUrl,
                okText: "复制链接",
                cancelText: "取消",
                onok: function () {
                    cordova.exec(sucbackAction, onFail, "WDPasteboardPlugin", "copyString", [shareUrl]);

                    function sucbackAction() {
                        // alert("close menu!");
                    }

                    function onFail(message) {
                        alert('Failed because: ' + message);
                    }
                }
            });
        })
        $(".notesDetailsBox").css("padding-top", $(".notesDescBox").outerHeight());
        if (_this.defaults.listScroll) {
            _this.defaults.listScroll.refresh();
        }
    },
    notesEdite: function () {//修改了批注描述执行的方法
        var paramData = {
            viewPointId: App.NotesDetails.defaults.notesData.id,
            projectId: App.NotesDetails.defaults.notesData.projectId,
        }
        var data = {
            projectVersionId: App.NotesDetails.defaults.notesData.projectVersionId,
            name: $("#notesEditeDialog>textarea").val().trim(),
            type: 1
        }
        App.Comm.ajax({
            type: "PUT",
            url: App.Restful.urls.updateViewPoint,
            param: paramData,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data.code == 0) {
                    $("#notesDesc").html(data.data.name);
                } else {
                    alert(data.message);
                }
            }
        })
    },
    bindScrollHandle: function () {//初始化滚动条方法
        var _this = this;
        var loadMore = $(".loadMore");
        var scrollEle = "#notesCommentBox";
        this.defaults.listScroll = new IScroll(scrollEle, {
            mouseWheel: true,//鼠标滚轮
            probeType: 3,//像素级触发 执行回调
            scrollbars: false,//滚轴是否显示默认是
            truebounceTime: 600,//弹力动画持续的毫秒数
            click: true,
        });
        if (App.defaults.notesDetailsObj) {
            this.defaults.listScroll.scrollTo(0, App.defaults.notesDetailsObj.scrollPos, 10);
        }
        if (App.defaults.maxCommentNumber) {
            if (App.defaults.maxNumPos || App.defaults.maxNumPos == 0) {
                this.defaults.listScroll.scrollTo(0, App.defaults.maxNumPos, 10);
            } else {
                this.defaults.listScroll.scrollTo(0, this.defaults.listScroll.maxScrollY, 10);
            }
        }
        this.defaults.listScroll.on('scroll', function () {
            if (this.directionY == 1) {
                if (this.y < this.maxScrollY) {
                    _this.defaults.isShowLoad = true;
                    loadMore.html("加载中...").show();
                }
            }
        });
        this.defaults.listScroll.on('scrollEnd', function () {
            if (!App.defaults.maxCommentNumber) {
                App.defaults.notesDetailsObj = {
                    scrollPos: this.y
                }
            } else {
                App.defaults.maxNumPos = this.y;
            }
            if (this.y == this.maxScrollY && this.maxScrollY < 0) {
                if (_this.defaults.isShowLoad) {
                    if (!_this.defaults.getMoreFlag) return;
                    _this.defaults.getMoreFlag = false;
                    _this.getMoreDataHandle();//获取更多
                } else {
                    loadMore.hide();
                    _this.defaults.listScroll.refresh();
                }
            }
        });
    },
    getMoreDataHandle: function () {//获取更多
        var _this = this;
        var loadMore = $(".loadMore");
        var commentData = {
            "viewpointId": parseInt(App.NotesDetails.defaults.notesId),
            "pageIndex": App.defaults.maxCommentNumber ? 1 : this.defaults.pageIndex + 1,
            "pageItemCount": App.defaults.maxCommentNumber ? App.defaults.maxCommentNumber : 10
        };
        App.Comm.ajax({
            type: "POST",
            url: App.Restful.urls.loadNotesComment,
            data: JSON.stringify(commentData),
            dataType: "json",
            cache: false,
            contentType: "application/json",
            success: function (data) {
                _this.defaults.getMoreFlag = true;
                if (data.code == 0) {
                    if (data.data.items.length > 0) {
                        _this.defaults.pageIndex++;
                        _this.loadMorePageHandle(data.data.items);//加载功能多添加到页面的方法
                        if (App.defaults.maxCommentNumber) {
                            loadMore.html(App.defaults.loadMoreBottomText);
                        }
                    } else {
                        loadMore.html(App.defaults.loadMoreBottomText);
                    }
                    _this.defaults.listScroll.refresh();
                } else {
                    alert(data.message);
                }
            }
        })
    },
    loadMorePageHandle: function (data) {//加载功能多添加到页面的方法
        var html = '',
            commentLogo = '',
            organization = '',
            commentName = '',
            commentTime = '',
            borderBottom = '',
            commentDesc = '',
            attachMentsHtml = '',
            showBool = '',
            deleteCommentId = '',
            deleteViewpointId = '',
            projectId = '',
            openType = '',
            openUrl = '',
            typeImg = '',
            description = '',
            openBool = '',
            typeStr = '',
            projectId = '',
            notesListBox = $("#notesListBox");
        for (var i = 0, iLen = data.length; i < iLen; i++) {
            commentLogo = '<img src="/platform/user/' + data[i].creatorId + '/photo" class="J_profile" data-userid="' + data[i].creatorId + '">';
            organization = '(' + data[i].orgPath + (Number(data[i].outersite) ? '' : '...') + ')';
            commentName = data[i].creatorName + organization;
            commentTime = Assister.Date.getDateFromHMLong(data[i].createTime);
            commentDesc = data[i].text;
            showBool = data[i].creatorId == App.defaults.userId ? "block" : "none";
            deleteCommentId = data[i].id;
            deleteViewpointId = data[i].viewpointId;
            projectId = App.NotesDetails.defaults.projectId;
            attachMentsHtml = '';
            if (data[i].attachments && data[i].attachments.length > 0) {
                for (var j = 0, jLen = data[i].attachments.length; j < jLen; j++) {
                    openUrl = "/sixD/" + App.NotesDetails.defaults.projectId + "/viewPoint/" + App.NotesDetails.defaults.notesId + "/comment/" + data[i].attachments[j].id + "/download";
                    description = data[i].attachments[j].description;
                    openType = description.substr(description.lastIndexOf("."));
                    openBool = true;
                    switch (data[i].attachments[j].type) {
                        case 1:
                            openUrl = "javascript:;",
                                typeImg = '<img data-imgtype="true" src="/' + data[i].attachments[j].pictureUrl + '" ' +
                                `data-index="${j}"` +
                                '>';
                            typeStr = ".images";
                            openBool = false;
                            break;
                        case 3:
                            openUrl = '#/notesSnapImg/' + App.NotesDetails.defaults.projectId + "/" + App.NotesDetails.defaults.projectVersionId + "/" + App.NotesDetails.defaults.projectName + "/" + App.NotesDetails.defaults.folderId + "/" + App.NotesDetails.defaults.notesId + "/" + App.NotesDetails.defaults.fileVersionId + '/' + data[i].attachments[j].id;
                            typeImg = '<img src="/' + data[i].attachments[j].pictureUrl + '" ' +
                                `data-index="${j}"` +
                                '>';
                            description = '[快照]' + data[i].attachments[j].description;
                            localStorage.setItem(data[i].attachments[j].id, data[i].attachments[j].pictureUrl);
                            localStorage.setItem(data[i].attachments[j].id + "_description", data[i].attachments[j].description);
                            typeStr = ".viewPoint";
                            openType = ".viewPoint";
                            openBool = false;
                            break;
                        case 4:
                            typeImg = '<img src="images/comm/word.png">';
                            typeStr = ".docx";
                            break;
                        case 5:
                            typeImg = '<img src="images/comm/ppt.png">';
                            typeStr = ".ppt";
                            break;
                        case 6:
                            typeImg = '<img src="images/comm/excel.png">';
                            typeStr = ".xls";
                            break;
                        case 7:
                            typeImg = '<img src="images/comm/pdf.png">';
                            typeStr = ".pdf";
                            break;
                        case 8:
                            typeImg = '<img src="images/comm/dwg_icon.png">';
                            typeStr = ".dwg";
                            break;
                        case 9:
                            typeImg = '<img src="images/comm/rvt_icon.png">';
                            typeStr = ".rvt";
                            break;
                        default:
                            typeImg = '<img src="images/comm/default_icon.png">';
                            typeStr = ".default";
                            break;
                    }
                    if (j == data[i].attachments.length - 1) {
                        attachMentsHtml += '<div class="ddCommentComponent noPaddingBottomDiv">' +
                            '<a href="javascript:;" data-opentype=' + openType + ' data-openurl=' + openUrl + ' data-description=' + encodeURIComponent(description) + ' data-typestr="' + typeStr + '" data-open="' + openBool + '">' +
                            '<i>' + typeImg + '</i>' +
                            '<p>' + description + '</p>' +
                            '<span>' + Assister.Size.formatSize(data[i].attachments[j].length) + '</span>' +
                            '</a>' +
                            '</div>';
                    } else {
                        attachMentsHtml += '<div class="ddCommentComponent border-bottom-color">' +
                            '<a href="javascript:;" data-opentype=' + openType + ' data-openurl=' + openUrl + ' data-description=' + encodeURIComponent(description) + ' data-typestr="' + typeStr + '" data-open="' + openBool + '">' +
                            '<i>' + typeImg + '</i>' +
                            '<p>' + description + '</p>' +
                            '<span>' + Assister.Size.formatSize(data[i].attachments[j].length) + '</span>' +
                            '</a>' +
                            '</div>';
                    }
                }
                borderBottom = "border-bottom-color";
            } else {
                attachMentsHtml = '';
                borderBottom = "no_bottom_padding";
            }
            html += '<li>' +
                '<dl>' +
                '<dt>' + commentLogo + '</dt>' +
                '<dd>' +
                '<p class="ddNameTime">' +
                '<span class="ddName">' + commentName + '</span>' +
                '<span class="ddTime">' + commentTime + '</span>' +
                '</p>' +
                '<p class="ddDesc ' + borderBottom + '">' + commentDesc + '</p>' +
                '<div class="ddCommentListBox J_thumbnail" id="ddCommentListBox">' + attachMentsHtml + '</div>' +
                '<a href="javascript:;" style="display: ' + showBool + '" class="ddDelete" data-commentid="' + deleteCommentId + '" data-notesid="' + deleteViewpointId + '" data-projectid="' + projectId + '">删除</a>' +
                '</dd>' +
                '</dl>' +
                '</li>'
        }
        if (App.defaults.maxCommentNumber) {
            notesListBox.html(html);
        } else {
            notesListBox.append(html);
        }
    },
    resetHandle: function () {
        $(".loadMore").html(App.defaults.loadMoreText).show();
        // if(!App.defaults.notesDetailsObj){
        //     this.defaults.pageIndex = 1;
        // }
    },
    loadNotesComment: function () {//获取批注评论列表的方法
        var _this = this;
        var loadMore = $(".loadMore");
        var commentData = {
            "viewpointId": parseInt(App.NotesDetails.defaults.notesId),
            "pageIndex": 1,
            "pageItemCount": App.defaults.maxCommentNumber ? App.defaults.maxCommentNumber : this.defaults.pageNum
        };
        var notesListBox = $("#notesListBox");
        var notesCommentScrollBox = $(".notesCommentScrollBox");
        var nullData = '<div class="nullData"><div class="nullDataImg"></div><p>暂时还没有任何内容哦～</p></div>';
        var liComponent = '<li style="display: none" id="commentComponent">' +
            '<dl>' +
            '<dt>{{commentLogo}}</dt>' +
            '<dd>' +
            '<p class="ddNameTime">' +
            '<span class="ddName">{{commentName}}</span>' +
            '<span class="ddTime">{{commentTime}}</span>' +
            '</p>' +
            '<p class="ddDesc {{borderBottom}}">{{commentDesc}}</p>' +
            '<div class="ddCommentListBox J_thumbnail" id="ddCommentListBox">{{attachMentsHtml}}</div>' +
            '<a href="javascript:;" style="display: {{showBool}}" class="ddDelete" data-commentid="{{deleteCommentId}}" data-notesid="{{deleteViewpointId}}" data-projectid="{{projectId}}">删除</a>' +
            '</dd>' +
            '</dl>' +
            '</li>'
        notesCommentScrollBox.css("transform", "translate(0px,0px)");
        notesListBox.html(liComponent);
        loadMore.html("加载中...");
        this.defaults.isShowLoad = false;
        App.Comm.ajax({
            type: "POST",
            url: App.Restful.urls.loadNotesComment,
            data: JSON.stringify(commentData),
            dataType: "json",
            cache: false,
            contentType: "application/json",
            success: function (data) {
                $("#notesCommentNum").html(data.data.totalItemCount);
                if (data.code == 0) {
                    if (data.data.items.length < 10) {
                        loadMore.hide();
                    } else {
                        loadMore.show();
                    }
                    if (data.data.items.length > 0) {
                        if (_this.defaults.listScroll) {
                            _this.defaults.listScroll.destroy();
                        }
                        notesListBox.find(".nullData").remove();
                        _this.viewPage(data.data.items);
                        _this.bindScrollHandle();//初始化滚动条方法
                    } else {
                        notesListBox.append(nullData);
                    }
                } else {
                    alert(data.message);
                }
            }
        })
    },
    viewPage: function (data) {
        /*渲染数据*/
        var _this = this;
        template.repeat({
            repeatElement: $("#commentComponent")[0], /*页面的DOM元素*/
            data: data,
            process: function (itemObject) {
                var item = itemObject.item;
                var key = itemObject.index;
                var commentLogo = '<img src="/platform/user/' + item.creatorId + '/photo" class="J_profile" data-userid="' +
                    item.creatorId +
                    '" ' +
                    '>';
                var osStr = navigator.userAgent;
                var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
                var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                var attachMentsHtml = "",
                    typeImg = "",
                    borderBottom = "",
                    typeStr = "",
                    openType = "",
                    openBool = false,
                    openUrl = "javascript:;",
                    description = "";
                if (item.attachments && item.attachments.length > 0) {
                    for (var i = 0, len = item.attachments.length; i < len; i++) {
                        if (!isAndroid && isiOS) {
                            openUrl = "/sixD/" + App.NotesDetails.defaults.projectId + "/viewPoint/" + App.NotesDetails.defaults.notesId + "/comment/" + item.attachments[i].id + "/download";
                        } else {
                            openUrl = "/sixD/" + App.NotesDetails.defaults.projectId + "/viewPoint/" + App.NotesDetails.defaults.notesId + "/comment/" + item.attachments[i].id + "/download";
                        }
                        description = item.attachments[i].description;
                        openType = description.substr(description.lastIndexOf("."));
                        openBool = true;
                        switch (item.attachments[i].type) {
                            case 1:
                                openUrl = "javascript:;",
                                    typeImg = '<img data-imgtype="true" src="/' + item.attachments[i].pictureUrl + '" ' +
                                    `data-index="${i}"` +
                                    '>';
                                typeStr = ".images";
                                openBool = false;
                                break;
                            case 3:
                                openUrl = '#/notesSnapImg/' + App.NotesDetails.defaults.projectId + "/" + App.NotesDetails.defaults.projectVersionId + "/" + App.NotesDetails.defaults.projectName + "/" + App.NotesDetails.defaults.folderId + "/" + App.NotesDetails.defaults.notesId + "/" + App.NotesDetails.defaults.fileVersionId + '/' + item.attachments[i].id;
                                typeImg = '<img src="/' + item.attachments[i].pictureUrl + '">';
                                description = '[快照]' + item.attachments[i].description;
                                localStorage.setItem(item.attachments[i].id, item.attachments[i].pictureUrl);
                                localStorage.setItem(item.attachments[i].id + "_description", item.attachments[i].description);
                                typeStr = ".viewPoint";
                                openType = ".viewPoint";
                                openBool = false;
                                break;
                            case 4:
                                typeImg = '<img src="images/comm/word.png">';
                                typeStr = ".docx";
                                break;
                            case 5:
                                typeImg = '<img src="images/comm/ppt.png">';
                                typeStr = ".ppt";
                                break;
                            case 6:
                                typeImg = '<img src="images/comm/excel.png">';
                                typeStr = ".xls";
                                break;
                            case 7:
                                typeImg = '<img src="images/comm/pdf.png">';
                                typeStr = ".pdf";
                                break;
                            case 8:
                                typeImg = '<img src="images/comm/dwg_icon.png">';
                                typeStr = ".dwg";
                                break;
                            case 9:
                                typeImg = '<img src="images/comm/rvt_icon.png">';
                                typeStr = ".rvt";
                                break;
                            default:
                                typeImg = '<img src="images/comm/default_icon.png">';
                                typeStr = ".default";
                                break;
                        }
                        if (i == item.attachments.length - 1) {
                            attachMentsHtml += '<div class="ddCommentComponent noPaddingBottomDiv"><a href="javascript:;" data-opentype=' + openType + ' data-openurl=' + openUrl + ' data-description=' + encodeURIComponent(description) + ' data-typestr="' + typeStr + '" data-open="' + openBool + '"><i>' + typeImg + '</i><p>' + description + '</p><span>' + Assister.Size.formatSize(item.attachments[i].length) + '</span></a></div>';
                        } else {
                            attachMentsHtml += '<div class="ddCommentComponent {{borderBottomLine}}"><a href="javascript:;" data-opentype=' + openType + ' data-openurl=' + openUrl + ' data-description=' + encodeURIComponent(description) + ' data-typestr="' + typeStr + '" data-open="' + openBool + '"><i>' + typeImg + '</i><p>' + description + '</p><span>' + Assister.Size.formatSize(item.attachments[i].length) + '</span></a></div>';
                        }
                    }
                    borderBottom = "border-bottom-color";
                } else {
                    attachMentsHtml = '';
                    borderBottom = "no_bottom_padding";
                }
                var organization = '(' + item.orgPath + (Number(item.outersite) ? '' : '...') + ')';
                return {
                    "commentName": item.creatorName + organization,
                    "commentTime": Assister.Date.getDateFromHMLong(item.createTime),
                    "commentLogo": commentLogo,
                    "attachMentsHtml": attachMentsHtml,
                    "commentDesc": item.text,
                    "deleteCommentId": item.id,
                    "borderBottom": borderBottom,
                    "borderBottomLine": "border-bottom-color",
                    "deleteViewpointId": item.viewpointId,
                    "projectId": App.NotesDetails.defaults.projectId,
                    "showBool": item.creatorId == App.defaults.userId ? "block" : "none",
                }
            }
        });
    },
}