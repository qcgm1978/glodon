App.NewsFeedBackPage = {
    defaults: {
        hrefstr: "",
    },
    init: function (args) {
        var self = this;
        this.initHandle();//初始化服务建议反馈消息页面
        if (location.href.indexOf('message') > 0 || location.href.indexOf('myNews') > 0) {
            this.checkReplayHandle(args);//检查当前的回复是否删除
        } else {
            this.getFeedbackInfo(args);//获取建议反馈数据
        }
        this.initEventHandle();//初始化方法
    },
    checkReplayHandle: function (args) {
        var self = this;
        var feedbackId = args.feedbackId || "";
        var replayId = args.feedbackreplayid || "";
        var tipText = "当前建议已删除";
        var tipReplyText = "当前建议的回复已删除";
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.checkFeedbackUrl,
            data: {
                adviceId: feedbackId,
                adviceReplyId: replayId,
            },
            success: function (data) {
                var data = JSON.parse(data);
                if (data.code == 0) {
                    if (data.data.isAdvicdExist == 0) {
                        var Dlgs = App.UI.Dialog.showMsgDialog({
                            title: "提示",
                            text: tipText,
                            okText: "确定",
                            onok: function () {
                                cordova.exec(function () { }, function () { }, "WDNaviPlugin", "backAction", ["1"]);
                            },
                        });
                        $(Dlgs.dialog).find(".commDialogCancel").css("display", "none");
                        $(Dlgs.dialog).find(".commDialogOk").css("width", "100%");
                    } else if (data.data.isAdvicdExist == 1 && data.data.isAdvicdReplyExist == 0) {
                        App.UI.Dialog.showTip({
                            text: tipReplyText,
                            timeout: "3000"
                        });
                        self.getFeedbackInfo(args);//获取建议反馈数据
                    } else {
                        self.getFeedbackInfo(args);//获取建议反馈数据
                    }
                } else {
                    alert(data.message);
                }
            }
        });
    },
    initHandle: function () {//初始化服务建议反馈消息页面
        App.TitleBar.setTitle("我的建议");//设置顶部标题
        App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
        var osStr = navigator.userAgent;
        var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
        var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (location.href.indexOf('message') > 0) {
            if (isAndroid && !isiOS) {
                cordova.exec(function () { }, function () { }, "WDClosePicturePlugin", "closePicture", [{ "isClose": "true" }]);//注册返回键事件
            }
            App.TitleBar.returnCallback(function () {
                App.UI.Dialog.showMsgDialog({
                    title: "提示",
                    text: "继续留在筑云平台，还是返回万信会话？",
                    okText: "返回万信",
                    cancelText: "留在筑云",
                    onok: function () {
                        if (isAndroid && !isiOS) {
                            cordova.exec(function () { }, function () { }, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
                        }
                        cordova.exec(function () { }, function () { }, "WDNaviPlugin", "backAction", ["1"]);
                    },
                    oncancel: function () {
                        if (isAndroid && !isiOS) {
                            cordova.exec(function () { }, function () { }, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
                        }
                        location.href = "#/serviceFeedback";
                    }
                });
            });
        } else {
            App.TitleBar.returnCallback(function () {
                if (!isAndroid && isiOS && typeof cordova !== 'undefined') {
                    cordova.exec(function () { }, function () { }, "WDNaviPlugin", "hiddenNavi", ["1"]);
                }
                history.back();
            })
        }
        App.hideMainMenu();//隐藏底部导航栏
        $("#mainContainer").css("padding-bottom", 0);
    },
    getFeedbackInfo: function (args) {//获取建议反馈数据
        var self = this;
        var data = {
            id: args.feedbackId
        }
        var listScrollBox = $("#newsFeedBack .listScrollBox");
        var nullDom = $('<div class="nullData"><div class="nullDataImg"></div><p>暂时还没有任何内容哦～</p></div>');
        App.Comm.ajax({
            type: "post",
            url: App.Restful.urls.getMyNewsFeedBackUrl,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    if (data.data.items.length > 0) {
                        self.viewPage(data.data.items[0]);
                        App.UI.ImgDialog.showImgDialog(listScrollBox);
                    } else {
                        App.UI.Dialog.showTip({
                            text: "当前建议已删除",
                            timeout: "2500"
                        });
                        listScrollBox.append(nullDom);
                    }
                } else {
                    alert(data.message);
                }
            }
        })
    },
    getAdviceType: function (type) {//获取类型
        if (type === null) {
            return ''
        }
        var arr = ['设计', '计划', '成本', '质监', '系统'];
        return '[' + arr[type - 1] + ']';
    },
    viewPage: function (data) {//渲染列表的方法
        var _this = this;
        var osStr = navigator.userAgent;
        var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
        var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        /*渲染数据*/
        template.repeat({
            repeatElement: $("#listComponent")[0], /*页面的DOM元素*/
            data: data,
            process: function (itemObject) {
                var item = itemObject.item;
                var key = itemObject.index;
                var userLogo = '<img src="/platform/user/' + item.createId + '/photo">';
                var imgHtml = "",
                    attachmentHtml = "",
                    $reply;
                if (item.havaAttachment && item.attachmentList.length > 0) {
                    for (var i = 0, len = item.attachmentList.length; i < len; i++) {
                        var attachmentName = item.attachmentList[i].attachmentName;
                        var attachmentSize = Assister.Size.formatSize(item.attachmentList[i].attachmentSize);
                        var type = attachmentName.substr(attachmentName.lastIndexOf("."));
                        var typeStr = type.toLowerCase();
                        var imgSrc = '/platform/advice/feedback/downloads?attachmentIds=' + item.attachmentList[i].id;
                        if (!isAndroid && isiOS) {
                            downSrc = '/platform/advice/feedback/downloads?attachmentIds=' + item.attachmentList[i].id;
                        } else {
                            downSrc = '/platform/advice/feedback/downloads?attachmentIds=' + item.attachmentList[i].id;
                        }
                        switch (typeStr) {
                            case ".jpg":
                                imgHtml += '<li><img data-imgtype="true" src=' + imgSrc + '></li>';
                                break;
                            case ".gif":
                                imgHtml += '<li><img data-imgtype="true" src=' + imgSrc + '></li>';
                                break;
                            case ".png":
                                imgHtml += '<li><img data-imgtype="true" src=' + imgSrc + '></li>';
                                break;
                            case ".doc":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/word.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".docx":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/word.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".ppt":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/ppt.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".pptx":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/ppt.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".xls":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/excel.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".xlsx":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/excel.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".pdf":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/pdf.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".dwg":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/dwg_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            case ".rvt":
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/rvt_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                            default:
                                attachmentHtml += '<li><a href="javascript:;" data-name="' + encodeURIComponent(attachmentName) + '" data-typestr="' + typeStr + '" data-hrefstr="' + downSrc + '"><i><img src=images/comm/default_icon.png></i><h2>' + attachmentName + '</h2><p><span class="fl service_date">{{createTime}}</span><span class="fr service_size">' + attachmentSize + '</span></p></a></li>';
                                break;
                        }
                    }
                }
                if (item.haveReply) {
                    $reply = $('<div>');
                    var len = item.adviceReplys.length;
                    $.each(item.adviceReplys, function (i, n) {
                        $('<em>', {
                            text: n.replyName + ' ' + n.replyTimeStr.split(' ')[0]
                        }).appendTo($reply)
                        $reply.append('<br>').append($('<span>', {
                            text: n.content,
                            class: i + 1 === len ? '' : 'reply-content'
                        })).append('<br>');
                    })
                }
                return {
                    "title": item.title,
                    "userLogo": userLogo,
                    "content": item.content.length > 0 ? item.content : "",
                    "contentBool": item.content.length > 0 ? "" : "noContent",
                    "imgComponent": imgHtml,
                    "typeStr": typeStr,
                    "attachmentComponent": attachmentHtml,
                    "reply": $reply ? $reply.html() : '',
                    "adviceType": _this.getAdviceType(item.adviceType),
                    "showReply": item.haveReply ? "haveReplyTrue" : "",
                    "showUpload": item.havaAttachment ? "showUploadTrue" : "",
                    "createTime": Assister.Date.getDateFromHMLong(item.createTime),
                    "noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color"
                }
            }
        });
    },
    initEventHandle: function () {//初始化方法
        var self = this;
        var osStr = navigator.userAgent;
        var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
        var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        $(".listScrollBox").on("click", function (evt) {
            evt.stopPropagation();
            var evtTarget = $(evt.target);
            var parentTarget = evtTarget.closest('a');
            if (parentTarget.length != 0) {
                var evtTarget = $(evt.target);
                var parentTarget = evtTarget.closest('a');
                var type = parentTarget.data('typestr');
                var name = App.trimHandle(decodeURIComponent(parentTarget.data("name")));
                self.defaults.hrefstr = parentTarget.data("hrefstr");
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
                    self.downloadImgHandle(location.origin + self.defaults.hrefstr, name);
                }
            }
            return false;
        });
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
                headers: {

                },
                fileName: name
            })
    },
    onSuccessMoreUplaod: function (evt) {
        if (evt == "您提供的文件类型不能被打开") {
            var Dlg = App.UI.Dialog.showMsgDialog({
                title: "提示",
                text: "不支持该文件格式,无法打开",
                okText: "确定",
                onok: function () {

                },
            });
            $(Dlg.dialog).find(".commDialogCancel").css("display", "none");
            $(Dlg.dialog).find(".commDialogOk").css("width", "100%");
        } else {
            cordova.exec(function () { }, function () { }, "WDNaviPlugin", "hiddenNavi", ["0"]);
            location.href = App.NewsFeedBackPage.defaults.hrefstr;
        }
    },
    onFail: function (evt) {
    },
}