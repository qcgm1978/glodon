//@ sourceURL=App.AddFeedback.js
App.AddFeedback = {
    defaults: {
        imgListData: [],
        title: "",
        addDesc: "",
        uploadUrl: "",
        canAdd: false,
        userDataBool: false,
        flag: true,
    },
    init: function (arge) {
        App.AddFeedback.defaults.canAdd = false;
        App.AddFeedback.defaults.userDataBool = false;
        App.AddFeedback.defaults.imgListData = [];
        App.AddFeedback.defaults.title = "";
        App.AddFeedback.defaults.addDesc = "";
        App.AddFeedback.defaults.uploadUrl = "http://" + window.location.host + ":" + (window.location.port == "" ? 80 : window.location.port) + '/platform/advice/feedback/upload';
        this.initHandle();//初始化服务页面
        App.getUserInfo();
    },
    initHandle: function () {//初始化服务页面
        var _this = this;
        App.TitleBar.setTitle("建议反馈");//设置顶部标题
        App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
        App.TitleBar.returnCallback(function () {
            if (App.defaults.feedbackObj) {
                App.defaults.feedbackObj = undefined;
            }
            location.href = "#/serviceFeedback";
        });
        this.defaults.flag = true;
        App.hideMainMenu();//隐藏底部导航栏
        if (!App.defaults.userData) {
            App.Comm.ajax({
                url: App.Restful.urls.current,
                success: function (data) {
                    var jsonData = $.parseJSON(data);
                    if (jsonData.code == 0) {
                        App.defaults.userData = jsonData.data;
                        App.AddFeedback.defaults.userDataBool = true;
                    } else {
                        alert(data.message);
                    }
                }
            });
        } else {
            App.AddFeedback.defaults.userDataBool = true;
        }
        $("#addImgBtn").on("click", function () {//点击添加图片按钮执行的方法
            // alert('click')
            var maxNumber = 10 - $('.addImgBox').length;
            // alert(maxNumber)
            cordova.exec(_this.onSuccessMoreUplaod, _this.onFail, "WDImagePlugin", "multipleImage", [{
                "maxNumber": maxNumber, "urlType": "1", "quality": "100", "maxSize": "300"
            }]);
        })
        $("#addFeedbackTitle").on("focus", function () {
            _this.setScrollTopHandle();//设置滚动
        })
        $("#textareaVal").on("focus", function () {
            _this.setScrollTopHandle();//设置滚动
        })
        $("#addFeedbackBtn").on("click", function () {
            var addFeedbackTitle = $("#addFeedbackTitle").val().trim();
            var textareaVal = $("#textareaVal").val().trim();
            var $selectBtnBox = $('.selectBtnBox');
            if (addFeedbackTitle.length > 0 && textareaVal.length > 0 && $selectBtnBox.length) {
                App.AddFeedback.defaults.title = addFeedbackTitle;
                App.AddFeedback.defaults.addDesc = textareaVal;
                App.AddFeedback.defaults.adviceType = $selectBtnBox.index() + 1;
                _this.ajaxSubmitHandle();//点击提交按钮执行的方法
            } else {
                var Dlg = App.UI.Dialog.showMsgDialog({
                    text: $selectBtnBox.length ? "请输入标题和反馈内容！" : "请选择类别！",
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
                return;
            }
            return false;
        });
        App.UI.ImgDialog.showImgDialog($("#addImgList"), true, function (index) {
            var url = $(".addImgBox").eq(index).data('picurl');
            $(".addImgBox").eq(index).remove();
            $('#addImgBtn').show()
            // App.AddFeedback.defaults.imgListData.splice(index, 1);
            var imgList = App.AddFeedback.defaults.imgListData;
            for (var i = 0; i < imgList.length; i++) {
                if (imgList[i].url === url) {
                    imgList.splice(i, 1)
                }
            }
            let $imgs = index ? $(`.addImgBox:gt(${index - 1})`) : $(`.addImgBox`);
            $.each($imgs, function (i, n) {
                let $children = $(n).children();
                $children.data('index', $children.data('index') - 1);
            });
        });
        $("#mainContainer").css("padding-bottom", 0);
        this.bindTabEventHandle("itemsPartitionBtnBox", "span", "selectBtnBox");//初始化绑定点击切换背景的方法
    },
    setScrollTopHandle: function () {
        setTimeout(function () {
            debugger;
            window.scrollTo(0, 0);
            $('#mainHeader').hide(0, function () {
                $(this).show()
            })
        }, 400)
    },
    bindTabEventHandle: function (eleBox, ele, tabClass) {//初始化绑定点击切换背景的方法
        var $elementBox = $("#" + eleBox);
        // debugger;
        $elementBox.on("click", ele, function () {
            if ($(this).hasClass(tabClass)) return;
            $(this).siblings().removeClass(tabClass).end().addClass(tabClass);
        })
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
        ft.upload(imageBigUrl, App.AddFeedback.defaults.uploadUrl, App.AddFeedback.win, App.AddFeedback.fail, options);
    },
    win: function (result) {
        var res = JSON.parse(result.response);
        var data = res.data;
        var fileName = data.attachmentName;
        var fileId = data.attachmentId;
        var url = 'platform/advice/feedback/download/' + fileId;
        let $li = $("li[name='" + fileName + "']");
        $li.attr("data-picurl", url);
        $("span[name='" + fileName + "']").remove();
        // App.AddFeedback.defaults.imgListData.push({'id': fileId});
        App.AddFeedback.defaults.imgListData.push({ id: fileId, url: url });
        if (Assister.isIos() && App.UI.ImgDialog.gallery) {
            var arr = []
            $.each($li, function (i, n) {
                var index = $(n).data('index');
                arr.push(index)
                let item = App.UI.ImgDialog.gallery.items[index];
                item.src = '/' + url;
                // item.w = 0;
                // item.h = 0;
            })
            App.UI.ImgDialog.gallery.invalidateCurrItems(); // reinit Items
            App.UI.ImgDialog.gallery.updateSize(true); // reinit Items
            if (arr.includes(App.UI.ImgDialog.gallery.getCurrentIndex())) {
            }
        }
    },
    fail: function (error) {
        alert("网络异常，请稍后重试");
        // console.log("上传失败==" + JSON.stringify(error));
    },
    onSuccessMoreUplaod: function (imageurl) {
        // alert(imageurl)
        Assister.uploadSelected(App.AddFeedback, imageurl)
    },
    onFail: function (message) {//取消选取照片之后
        // alert(message)
        setTimeout(function () {
            App.hideNativeTitleBar(true);
        }, 500)
        // alert(message);
    },
    ajaxSubmitHandle: function () {//点击提交按钮执行的方法
        var _this = this;
        if (!this.defaults.flag) return;
        this.defaults.flag = false;
        // let attachments = App.AddFeedback.defaults.imgListData.reduce(function (arr, n) {
        //     arr.push(n.id);
        //     return arr;
        // }, []);
        var data = {
            "createId": App.defaults.userData.userId,
            "createName": App.defaults.userData.name,
            "loginName": App.defaults.userData.loginName,
            "title": App.AddFeedback.defaults.title,
            "content": App.AddFeedback.defaults.addDesc,
            "attachmentList": App.AddFeedback.defaults.imgListData,
            adviceType: App.AddFeedback.defaults.adviceType
        };
        var addFeedbackBtn = $("#addFeedbackBtn").find("button");
        addFeedbackBtn.html("提交中...");
        App.Comm.ajax({
            type: "POST",
            url: App.Restful.urls.addFeebackData,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                _this.defaults.flag = false;
                addFeedbackBtn.html("提交");
                if (App.defaults.feedbackObj) {
                    App.defaults.feedbackObj = undefined;
                }
                if (response.code == 0) {
                    window.location.href = "#/serviceFeedback";
                } else {
                    alert(response.message);
                }
            }
        });
    },
}