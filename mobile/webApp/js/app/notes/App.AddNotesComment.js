//@ sourceURL=App.AddNotesComment.js
App.AddNotesComment = {
    defaults: {
        notesId: '',
        projectId: '',
        projectVersionId: '',
        folderId: '',
        projectName: '',
        notesData: '',
        addDesc: '',
        canAdd: false,
        flag: true,
    },
    init: function (arge) {
        var _this = this;
        App.AddNotesComment.defaults.addDesc = "";
        App.AddNotesComment.defaults.projectId = arge.projectId;
        App.AddNotesComment.defaults.projectVersionId = arge.projectVersionId;
        App.AddNotesComment.defaults.folderId = arge.folderId;
        App.AddNotesComment.defaults.projectName = arge.name;
        App.AddNotesComment.defaults.notesId = arge.notesId;
        App.AddNotesComment.defaults.fileVersionId = arge.fileVersionId;
        App.AddNotesComment.defaults.uploadUrl = "http://" + window.location.host + ":" + (window.location.port == "" ? 80 : window.location.port) + '/sixD/internal/' + arge.projectId + '/viewPoint/' + arge.notesId + '/comment/pic';
        this.initHtml();//初始化页面
        $(function(){
            _this.initHandle();//初始化页面事件和方法
        })
        this.initImgListHandle();//初始化页面事件和方法
    },
    initHtml:function(){//初始化页面
        App.TitleBar.setTitle("评论");//设置顶部标题
        App.hideMainMenu();//隐藏底部导航栏
        App.TitleBar.hideHomeBtn();//隐藏顶部返回首页
        App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
        App.TitleBar.returnCallback(function () {
            if(App.defaults.notesDetailsObj){
                App.defaults.notesDetailsObj = undefined;
            }
            if(App.defaults.maxCommentNumber){
                App.defaults.maxCommentNumber = undefined;
            }
            if(App.defaults.maxNumPos || App.defaults.maxNumPos == 0){
                App.defaults.maxNumPos = undefined;
            }
            history.back();
        })
        if (!$("#footerBox > div").eq(1).hasClass("footer-box-select")) {//底部导航的定位
            $("#footerBox > div").eq(1).click();
        }
    },
    initImgListHandle: function () {//如果存在上传 图片 就再次显示图片列表
        var imgSrcListData = App.NotesDetails.defaults.imgSrcListData || {};
        if (imgSrcListData.length > 0) {
            var addImgList = $("#addImgList");
            var liHtml = "";
            for (var i = 0, iLen = imgSrcListData.length; i < iLen; i++) {
                liHtml += '<li class="addImgBox" name="' + imgSrcListData[i].fileName + '">' +
                    '<img src="data:image/jpeg;base64,' + imgSrcListData[i].imgSrc + '">'
                    + '</li>';
            }
            addImgList.append(liHtml);
        }
    },
    initHandle: function () {//初始化页面事件和方法
        var _this = this;
        /*start 处理at用户的方法逻辑*/
        var textareaVal = $("#textareaVal");//评论详情输入框
        var flag = false;
        if (App.defaults.atNameList instanceof Object) {
            for (var i = 0, iLen = App.defaults.atUserListData.length; i < iLen; i++) {
                if (App.defaults.atUserListData[i].userId == App.defaults.atNameList.userId && App.defaults.atUserListData[i].userName == App.defaults.atNameList.userName) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                App.defaults.atUserListData.push(App.defaults.atNameList);
                textareaVal.val(App.defaults.atName + App.defaults.atNameList.userName + " ");
            } else {
                textareaVal.val(App.defaults.atName);
            }
        } else {
            textareaVal.val(App.defaults.atName);
        }
        App.AddNotesComment.defaults.addDesc = textareaVal.val();
        textareaVal.off("input propertychange");
        textareaVal.on("input propertychange", function (evt) {
            var $this = $(this);
            var thisVal = $this.val();
            if (thisVal.length > App.defaults.atName.length) {
                App.defaults.atUserZanCunData = true;
            } else {
                App.defaults.atUserZanCunData = false;
            }
            App.defaults.atName = thisVal;//输入时候的文字
            var rzeReg = /@\S+/g;
            var rzeRegArr = thisVal.match(rzeReg);
            App.AddNotesComment.defaults.addDesc = thisVal;
            if (App.defaults.atUserListData.length > 0) {
                for (var i = 0, iLen = App.defaults.atUserListData.length; i < iLen; i++) {
                    var flags = false;
                    if (rzeRegArr.length > 0) {
                        for (var j = 0, jLen = rzeRegArr.length; j < jLen; j++) {
                            if (App.defaults.atUserListData[i].userName == rzeRegArr[j].substr(1) && i == j) {
                                flags = true;
                                break;
                            }
                        }
                    }
                    if (!flags) {
                        App.defaults.atUserListData.splice(i, 1);
                    }
                }
            }
            if (thisVal.slice(-1) === "@" && App.defaults.atUserZanCunData) {
                document.activeElement.blur();
                setTimeout(function () {
                    location.href = '#/atUserList/' + App.AddNotesComment.defaults.projectId;
                }, 400)
            }
        })
        /*end 处理at用户的方法逻辑*/
        $("#addCommentBtn").on("click","button",function () {//点击添加评论按钮
            if (App.NotesDetails.defaults.imgListData.length > 0 || App.AddNotesComment.defaults.addDesc.length > 0) {
                _this.addCommentAjax();//提交评论的方法*/
            } else if ($("#textareaVal").val().trim().length == 0) {
                var Dlg = App.UI.Dialog.showMsgDialog({
                    text: "请添加评论内容！",
                    css: {
                        "text-align": "center"
                    },
                    okText: "确定",
                    cancelText: "取消",
                });
                $(Dlg.dialog).find(".commDialogContainer").css("padding-top", "20px");
                $(Dlg.dialog).find(".commDialogCancel").css("display", "none");
                $(Dlg.dialog).find(".wMobileDialog-titleBar").css("display", "none");
                $(Dlg.dialog).find(".commDialogOk").css("width", "100%");
            }
            return false;
        })
        $("#addImgBtn").on("click", function () {//点击添加图片按钮执行的方法
            var maxNumber = 10 - $('.addImgBox').length;
            cordova.exec(_this.onSuccessMoreUplaod, _this.onFail, "WDImagePlugin", "multipleImage", [{
                "maxNumber": maxNumber, "urlType": "1", "quality": "100", "maxSize": "300"
            }]);
            return false;
        })
        App.UI.ImgDialog.showImgDialog($("#addImgList"), true, function (index) {
            let $ele = $(".addImgBox").eq(index);
            var url = $(".addImgBox").eq(index).data('picurl');
            $ele.remove();
            $('#addImgBtn').show()
            var imgList = App.NotesDetails.defaults.imgListData;
            for (var i = 0; i < imgList.length; i++) {
                if (imgList[i].url === url) {
                    imgList.splice(i, 1)
                }
            }
            // App.NotesDetails.defaults.imgListData.splice(index, 1);
            let $imgs = index ? $(`.addImgBox:gt(${index - 1})`) : $(`.addImgBox`);
            $.each($imgs, function (i, n) {
                let $children = $(n).children();
                $children.data('index', $children.data('index') - 1);
            });
        });
        $("#mainContainer").css("padding-bottom", 0);
    },
    uploadmoreimage: function (imageBigUrl) {//上传图片的方法
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageBigUrl.substr(imageBigUrl.lastIndexOf('/') + 1);
        var headers = {
            "p": "upload"
        };
        options.params = headers;
        var ft = new FileTransfer();
        ft.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
                var p = Math.round(progressEvent.loaded / progressEvent.total * 100);
                $("#addImgList").find("span").html("正在上传" + options.fileName + "(" + p + "%)");
            }
        }
        ft.upload(imageBigUrl, App.AddNotesComment.defaults.uploadUrl, App.AddNotesComment.win, App.AddNotesComment.fail, options);
    },
    win: function (result) {
        var res = JSON.parse(result.response);
        var data = res.data;
        var fileName = data.description;
        var imgSrc = data.pictureUrl;
        let $li = $("li[name='" + fileName + "']");
        $li.attr("data-picurl", imgSrc);
        $("span[name='" + fileName + "']").remove();
        App.NotesDetails.defaults.imgListData.push({id: data.id, url: imgSrc});
        try {
            if (!Assister.isIos() && App.UI.ImgDialog.gallery) {
                var arr = []
                $.each($li, function (i, n) {
                    var index = $(n).data('index');
                    arr.push(index)
                    let item = App.UI.ImgDialog.gallery.items[index];
                    item.src = '/' + imgSrc;
                    // item.w = 0;
                    // item.h = 0;
                })
                App.UI.ImgDialog.gallery.invalidateCurrItems(); // reinit Items
                App.UI.ImgDialog.gallery.updateSize(true); // reinit Items
                if (arr.includes(App.UI.ImgDialog.gallery.getCurrentIndex())) {
                }
            }
        } catch (e) {
            alert(e.message)
        }
    },
    fail: function (error) {
        alert("网络异常，请稍后重试");
        // alert("上传失败==" + JSON.stringify(error));
    },
    onSuccessMoreUplaod: function (imageurl) {
        Assister.uploadSelected(App.AddNotesComment, imageurl, App.NotesDetails)
    },
    onFail: function (message) {
        setTimeout(function () {
            App.hideNativeTitleBar(true);
        }, 500)
        // alert(message);
    },
    addCommentAjax: function () {//提交评论的方法
        if (!this.defaults.flag) return;
        this.defaults.flag = false;
        var _this = this;
        var paramData = {
            projectId: parseInt(App.AddNotesComment.defaults.projectId),
            viewPointId: parseInt(App.AddNotesComment.defaults.notesId),
        }
        let attachments = App.NotesDetails.defaults.imgListData.reduce(function (arr, n) {
            arr.push(n.id);
            return arr;
        }, []);
        var data = {
            text: $("#textareaVal").val(),
            projectVersionId: parseInt(App.AddNotesComment.defaults.projectVersionId),
            attachments: attachments,
            receivers: App.defaults.atUserListData,
        };
        var addFeedbackBtn = $("#addCommentBtn").find("button");
        addFeedbackBtn.html("提交中...");
        App.Comm.ajax({
            type: "POST",
            url: App.Restful.urls.addNotesComment,
            param: paramData,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                addFeedbackBtn.html("提交");
                _this.defaults.flag = true;
                if(App.defaults.notesDetailsObj){
                    App.defaults.notesDetailsObj = undefined;
                }
                if(App.defaults.maxNumPos || App.defaults.maxNumPos == 0){
                    App.defaults.maxNumPos = undefined;
                }
                App.defaults.maxCommentNumber = 2147483647;
                if (data.code == 0) {
                    history.back();
                } else {
                    alert(data.message);
                }
            }
        });
    }
}