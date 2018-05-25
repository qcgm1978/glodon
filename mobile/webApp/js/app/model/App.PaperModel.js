//@ sourceURL=App.PaperModel.js
/*
write by wuweiwei

templateUrl:tpls/flow/flowList.html
*/
App.PaperModel = {
    isCreatNotes: App.PaperModel ? App.PaperModel.isCreatNotes : true,
    isLoaded: false,
    restful: {
        fetchFileModelIdByFileVersionId: "/doc/{projectId}/{projectVersionId}/file/meta", //获取模型
        //批注接口
        createViewPoint: "/sixD/{projectId}/viewPoint?suffix={suffix}&fileId={fileId}&fileVersionId={fileVersionId}", //创建视点
        viewPointCommentViewpoint: "/sixD/{projectId}/viewPoint/{viewPointId}/comment/viewpoint?suffix={suffix}&fileId={fileId}&fileVersionId={fileVersionId}", //视点评论视点
        createAnnotation: "/sixD/{projectId}/viewPoint/{viewPointId}/annotation", //创建批注
        viewPoint: "/sixD/{projectId}/viewPoint/{viewPointId}", /*图纸定位信息*/
        /*获取图纸单文件版本列表的接口*/
        getFileVersionUrl: "/doc/{projectId}/{versionId}/turnkey/history/dwg",
    },
    isEdit: false,
    State: {
        ajaxFlag: "true"
    },
    init: function (args) {
        this.options = this.args = args;
        this.setTitleBar();
        App.hideMainMenu();
        this.setGoBack();//设置返回 问题
        let hashStr = location.hash;
        if (App.defaults.isBimControl == 2 && hashStr.indexOf("tabVersion") == -1) {// && hashStr.indexOf("tabVersion") == -1 && hashStr.indexOf("tabVersion") == -1
            this.getFileVersionHandle(args);//获取图纸版本列表的方法;
        } else if (App.defaults.isBimControl == 2 && hashStr.indexOf("tabVersion") != -1) {
            this.getFileVersionHandle(args);//获取图纸版本列表的方法;
        } else {
            this.getPaperModelData(args);//渲染模型
        }
        this.initDwgPage();
    },
    setGoBack: function () {//设置返回 问题
        if (location.href.indexOf("myNews") > 0 || location.href.indexOf("message") > 0) {
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
                history.back();
            });
        } else {
            this.gotoBack();
        }
    },
    initDwgPage: function () {
        this.initDwgMenu();
        this.initPaperSize();
        if (location.hash.indexOf("noComment=yes") > 0) {
            App.TitleBar.showHomeBtn();
            this.hideCommentUI();
        }
        this.bindEvent();
    },
    initDwgMenu: function (args) {
        var menuHTML = $http.template("tpls/model/paperSideBar.html");
        $("#model").append($(menuHTML));
        var tabVersionMenu = $(".viewBox-bar").find("dt:eq(3)");
        if (App.defaults.isBimControl == 2) {
            tabVersionMenu.css("display", "-webkit-box");
        } else {
            tabVersionMenu.css("display", "none");
        }
    },
    hideCommentUI: function () {
        var $dts = $(".viewBoxOptions").find(".viewBox-bar").find("dt");
        $dts[1].style.display = "none";
        $dts[0].style.width = "50%";
        $dts[2].style.width = "50%";
    },
    initPaperSize: function () {
        /* 调整页面框架布局 begin */
        $("footer").css("display", "none");
        $("#mainContainer").css("overflow", "hidden");
        $("#model").css("position", "absolute");
        $("#model").css("width", "100%");
        $("#model").css("top", $("#mainHeader").height() + "px");
        $("#model").css("bottom", "0");
        $("#model").css("overflow", "hidden");
        $("#mainContainer").css("padding-bottom", "0");
        /* 调整页面框架布局 end */
    },
    bindEvent: function () {
        var th = this;
        this.$viewBoxOptions = $("#model .viewBoxOptions");
        this.$viewBoxOptions.find(".viewBox-bar").on("click", "dt", function (e) {
            if ($(this).children('.commentMenuD').length) {
                return;
            }
            if (!th.isOperate()) {
                return;
            }
            /*controll bgcolor*/
            if (!th.isEdit) {
                th.$viewBoxOptions.find("dt").css("background-color", "#FFF");
                if ($(this).data("type") == "comment" && !App.PaperModel.isCreatNotes) {
                } else {
                    $(this).css("background-color", "#F2F2F2");
                }
            }
            var $curNode = $(this);
            var $filterDetail = $(th.viewport).find(".filterDetail");
            var $paperDetail = $(th.viewport).find(".paperDetail");
            var $info = th.$viewBoxOptions.find(".info");
            $filterDetail.css("display", "none");
            $paperDetail.css("display", "none");
            $info.css("display", "none");
            if ($curNode.data("type") == "zoom" && !th.isEdit) {
                $curNode.css("background-color", "#FFF");
                th.viewer.dwgView.fit();
                return;
            }
            if ($curNode.data("type") == "bgcolor" && !th.isEdit) {
                th.setModelBgColor();
            }
            if ($curNode.data("type") == "comment") {
                if (App.defaults.isBimControl == 2 && App.PaperModel.isCreatNotes && !$('.commentMenuD').length) {
                    var displayState = th.$viewBoxOptions.find(".comment").css("display");
                    if (displayState == "block") {
                        th.$viewBoxOptions.find(".viewBox-bar-menu").css("display", "none");
                        th.$viewBoxOptions.find(".viewBox-bar-menu").find(".comment").css("display", "none");
                        th.isEdit = false;
                        th.commentEnd();
                        $("#dwgCommentContainer").css("display", "none");
                        th.setCommentFaceState("off");
                        $curNode.css("background-color", "#FFF");
                    } else {
                        th.$viewBoxOptions.find(".viewBox-bar-menu").css("display", "block");
                        th.$viewBoxOptions.find(".viewBox-bar-menu").find(".comment").css("display", "block");
                        $(".bim .modelBar").css("display", "none");
                        th.isEdit = true;
                        th.setCommentFaceState("on");
                        $("#dwgCommentContainer").css("display", "block");
                        th.commentStart();
                        /*开始批注*/
                    }
                } else if (App.defaults.isBimControl == 1) {
                    var displayState = th.$viewBoxOptions.find(".comment").css("display");
                    if (displayState == "block") {
                        th.$viewBoxOptions.find(".viewBox-bar-menu").css("display", "none");
                        th.$viewBoxOptions.find(".viewBox-bar-menu").find(".comment").css("display", "none");
                        th.isEdit = false;
                        th.commentEnd();
                        $("#dwgCommentContainer").css("display", "none");
                        th.setCommentFaceState("off");
                        $curNode.css("background-color", "#FFF");
                    } else {
                        th.$viewBoxOptions.find(".viewBox-bar-menu").css("display", "block");
                        th.$viewBoxOptions.find(".viewBox-bar-menu").find(".comment").css("display", "block");
                        $(".bim .modelBar").css("display", "none");
                        th.isEdit = true;
                        th.setCommentFaceState("on");
                        $("#dwgCommentContainer").css("display", "block");
                        th.commentStart();
                        /*开始批注*/
                    }
                }
            }
            if ($curNode.data("type") == "selectModel" && !th.isEdit) {
                var $modelBar = $(".bim .modelBar");
                var $modelSelect = $modelBar.find(".modelSelect");
                var $tabVersionBox = $modelBar.find(".tabVersionBox");
                var modelBarDisplay = $modelBar.css("display");
                var modelSelectDisplay = $modelSelect.css("display");
                $tabVersionBox.css("display", "none");
                if (modelBarDisplay == "block") {
                    if (modelSelectDisplay == "block") {
                        $modelBar.css("display", "none");
                        $modelSelect.css("display", "none");
                    } else {
                        $modelSelect.css("display", "block");
                    }
                } else {
                    $modelBar.css("display", "block");
                    $modelSelect.css("display", "block");
                }
            }
            if ($curNode.data("type") == "tabVersion" && !th.isEdit) {
                var $modelBar = $(".bim .modelBar");
                var $modelSelect = $modelBar.find(".modelSelect");
                var $tabVersionBox = $modelBar.find(".tabVersionBox");
                var modelBarDisplay = $modelBar.css("display");
                var tabVersionBoxDisplay = $tabVersionBox.css("display");
                $modelSelect.css("display", "none");
                if (modelBarDisplay == "block") {
                    if (tabVersionBoxDisplay == "block") {
                        $modelBar.css("display", "none");
                        $tabVersionBox.css("display", "none");
                    } else {
                        $tabVersionBox.css("display", "block");
                    }
                } else {
                    $modelBar.css("display", "block");
                    $tabVersionBox.css("display", "block");
                }
            }
        });
        var $model = $("#model");
        $model.on("click", ".modelItem", function (e) {
            $(".bim .modelBar").css("display", "none");
            $(".viewBoxOptions").find(".viewBox-bar").find("dt").css("background-color", "#FFF");
        });
        this.$viewBoxOptions.find(".comment").on("click", "dd", function (e) {
            var $curNode = $(this);
            /*批注事件处理*/
            var typeId = $curNode.data("typeid");
            var $dds = th.$viewBoxOptions.find(".comment").find("dd");
            if ($curNode.data("type") == "comment-rect" || $curNode.data("type") == "comment-circle" || $curNode.data("type") == "comment-cloud" || $curNode.data("type") == "comment-text") {
                th.commentType(typeId);
                $dds.css("background-color", "#FFF");
                $curNode.css("background-color", "#F2F2F2");
            } else if ($curNode.data("type") == "comment-color") {
                var Dlg = App.UI.Dialog.showCommDialog({
                    element: $("#model_colorDialog")[0],
                    title: "选择您想要使用的颜色"
                });
                $(Dlg.dialog).find(".commDialogCancel").show().css("width", "100%");
                $(Dlg.dialog).find(".commDialogOk").css("display", "none");
                $(Dlg.dialog).find(".commDialogContainer").find("span").on("click", function (e) {
                    var color = $(this).data("color");
                    th.setCommentStyle({
                        'stroke-color': color,
                        'fil-color': color
                    });
                    App.UI.Dialog.hideCommDialog();
                });
            } else if ($curNode.data("type") == "comment-save") {
                th.saveComment({
                    callback: th.commentCallback,
                    cate: 'viewPoint'
                });
            }
        });
        /*批注保存处理，文本框获取焦点处理事件*/
        var setTextareaToTop = function () {
            App.PaperModel.timeId = setInterval(function () {
                window.scrollTo(0, 0);
                var $commentDialog = th.$viewBoxOptions.find(".commentDialog");
                var $textArea = th.$viewBoxOptions.find(".textArea");
                $commentDialog[0].scrollTop = 0;
                $textArea[0].scrollTop = 0;
            }, 10);
        }
        th.$viewBoxOptions.find("#commentText").on("click", function () {
            setTextareaToTop();
        });
    },
    getFileVersionHandle: function (args) {//获取图纸版本列表的方法;
        var th = this;
        var urlStr = this.restful.getFileVersionUrl;
        urlStr = urlStr.replace("{projectId}", args.projectId).replace("{versionId}", args.projectVersionId);
        $.ajax({
            url: urlStr,
            data: {
                fileVersionId: args.fileVersionId
            },
        }).done(function (data) {
            if (data.code == 0) {
                th.argesData = args;
                let applyUser = data.data.applyUser;
                let versionList = th.fileVersionList = data.data.turnKeyChangeDwgVersionResultList;//版本列表
                let getRenderDwgId = '';//获取图纸数据的id
                if (th.args.actionName == "notesDetails" || th.args.actionName == "notesImg") {
                    getRenderDwgId = "";
                } else if (location.href.indexOf("tabVersion") != -1) {
                    getRenderDwgId = args.fileVersionId
                } else {
                    if (versionList.length > 0) {
                        if (!applyUser) {//判断是否是发起人
                            let fileVersionHistory = versionList[0].version[0].fileVersionHistory;
                            if (fileVersionHistory.indexOf("已移交") > 0) {//判断第一个是否是已移交
                                App.PaperModel.isCreatNotes = true;
                                getRenderDwgId = versionList[0].version[0].fileVersionId;
                            } else {
                                if (versionList[0].version.length >= 2) {
                                    getRenderDwgId = versionList[0].version[1].fileVersionId;
                                    App.PaperModel.isCreatNotes = true;
                                } else {
                                    getRenderDwgId = versionList[0].version[0].fileVersionId;
                                    App.PaperModel.isCreatNotes = false;
                                }
                            }
                        } else {
                            let fileVersionHistory = versionList[0].version[0].fileVersionHistory;
                            getRenderDwgId = versionList[0].version[0].fileVersionId;
                            if (fileVersionHistory.indexOf("已移交") > 0) {//判断第一个是否是已移交
                                App.PaperModel.isCreatNotes = true;
                            } else {
                                App.PaperModel.isCreatNotes = false;
                            }
                        }
                    }
                }
                th.getPaperModelData(args, getRenderDwgId);//渲染模型
            } else {
                alert(data.message);
            }
        })
    },
    getPaperModelData: function (args, getRenderDwgId) {
        /*
        App.Project.Settings.projectId = args.projectId;
        App.Project.Settings.projectVersionId = args.projectVersionId;
        App.Project.Settings.fileVersionId = Request.id;
        */
        /*var data = {
            URLtype: "fetchFileModelIdByFileVersionId",
            data: {
                projectId: args.projectId,
                projectVersionId: args.projectVersionId
            }
        }*/
        var th = this;
        var urlStr = this.restful.fetchFileModelIdByFileVersionId;
        urlStr = urlStr.replace("{projectId}", args.projectId).replace("{projectVersionId}", args.projectVersionId);
        App.PaperModel.getRenderDwgId = getRenderDwgId ? getRenderDwgId : args.fileVersionId;
        $.ajax({
            url: urlStr,
            data: {
                fileVersionId: getRenderDwgId ? getRenderDwgId : args.fileVersionId
            },
            dataType: "json",
        }).done(function (data) {
            if (data.message == "success") {
                $(".header .name").text(data.data.name);
                document.title = data.data.name + "模型预览";
                th.Model = data;
                th.fileId = data.data.id;
                th.fileVersionId = data.data.fileVersionId;
                th.suffix = data.data.suffix;
                if (data.data.modelId) {
                    if (data.data.modelStatus == 1) {
                        alert("模型转换中");
                        return;
                    } else if (data.data.modelStatus == 3) {
                        alert("转换失败");
                        return;
                    }
                    //dwg 格式
                    if (data.data.suffix == "dwg") {
                        if (th.args.actionName == "notesDetails" || th.args.actionName == "notesImg") {
                            th.getViewPointData(function () { /*先获取图纸定位信息,在加载模型*/
                                th.renderDwg(data.data.modelId);
                            });
                        } else {
                            th.viewPointPos = undefined;
                            th.renderDwg(data.data.modelId);
                        }
                    } else {
                        //App.Project.renderOther(data.data.modelId, data.data.suffix);
                    }
                    th.resetTabHandle();//重置创建批准是否可用
                } else {
                    alert("模型转换中");
                }
            } else {
                alert(data.message);
            }
        });
    },
    resetTabHandle: function () {//重置创建批准是否可用
        var $dt = this.$viewBoxOptions.find(".viewBox-bar").find("dt");
        if (App.PaperModel.isCreatNotes == undefined) {
        } else if (App.PaperModel.isCreatNotes) {
            $($dt[1]).find("div")[0].className = "commentMenu";
        } else {
            $($dt[1]).find("div")[0].className = "commentMenuD";
        }
    },
    renderDwg: function (modelId) {
        var th = this;
        $("#viewBox").css("display", "block");
        this.viewer = new dwgViewer({
            element: $("#model"),
            isComment: true,
            sourceId: modelId,
            callback: function () {
                th.isLoaded = true;
            }
        });
    },
    /*获取图纸定位信息*/
    getViewPointData: function (fn) {
        var th = this;
        var url = th.restful.viewPoint;
        url = url.replace("{projectId}", this.options.projectId);
        url = url.replace("{viewPointId}", this.options.paramA);
        App.Comm.ajax({
            url: url,
            type: "get",
            dataType: "json",
            success: function (data) {
                th.viewPointPos = JSON.parse(data.data.viewPoint);
                console.log("xxx", th.viewPointPos);
                fn();
                console.log("viewPointPos:", th.viewPointPos);
            }
        });
    },
    setModelBgColor: function () {
        if (this.State["setModelBgColor"] == undefined || this.State["setModelBgColor"] == "#000") {
            $(".bim .mod-dwg").css("background-color", "#FFF");
            this.State["setModelBgColor"] = "#FFF";
        } else {
            $(".bim .mod-dwg").css("background-color", "#000");
            this.State["setModelBgColor"] = "#000";
        }
    },
    commentStart: function () {
        $view = $(".bim .view"),
            pos = {
                y: parseInt($view.css("top")),
                x: parseInt($view.css("left")),
            };
        this.dwgHelper = this.viewer.dwgView.dwgHelper;
        this.dwgHelper.clearAnnotations();
        this.dwgHelper.editAnnotationBegin(pos);
        this.dwgHelper.setAnnotationType(1);
        var rectNode = this.$viewBoxOptions.find(".viewBox-bar-menu").find("dd")[0];
        $(rectNode).css("background-color", "#F2F2F2");
    },
    commentType: function (type) {
        /*type is number*/
        this.dwgHelper.setAnnotationType(type);
    },
    setCommentStyle: function (style) {
        this.dwgHelper.setAnnotationStyle(style);
    },
    setCommentFaceState: function (typeName) {
        /*typeName = "on|off"*/
        var $dt = this.$viewBoxOptions.find(".viewBox-bar").find("dt");
        this.$viewBoxOptions.find("dd").css("background-color", "#FFF");
        if (typeName == "on") {
            $($dt[0]).find("div")[0].className = "zoomMenuD";
            $($dt[2]).find("div")[0].className = "selectModelMenuD";
            $($dt[3]).find("div")[0].className = "tabVersionMenuD";
            $(this.$viewBoxOptions.find("dd")[0]).css("background-color", "#F2F2F2");
        } else if (typeName == "off") {
            $($dt[0]).find("div")[0].className = "zoomMenu";
            $($dt[2]).find("div")[0].className = "selectModelMenu";
            $($dt[3]).find("div")[0].className = "tabVersionMenu";
        }
    },
    commentEnd: function () {
        this.dwgHelper.editAnnotationEnd();
    },
    commentClose: function () {
        var th = this;
        th.$viewBoxOptions.find(".viewBox-bar-menu").css("display", "none");
        th.$viewBoxOptions.find(".viewBox-bar-menu").find(".comment").css("display", "none");
        th.isEdit = false;
        th.commentEnd();
        $("#dwgCommentContainer").css("display", "none");
        th.setCommentFaceState("off");
        $(".viewBoxOptions").find(".viewBox-bar").find("dt").css("background-color", "#FFF");
    },
    saveComment: function (options) {
        /*
        options is json
        options.callback = f
        */
        var th = this;
        console.log(this.dwgHelper.captureAnnotationsScreenSnapshot);
        this.dwgHelper.captureAnnotationsScreenSnapshot(function (data) {
            var commentData = {
                /*
                camera: th.getCamera(),
                list: newList,
                */
                image: data.substr(22)
                /*
            filter: {
            category: category
            }
            */
            };
            var innerOptions = {};
            innerOptions.commentData = commentData;
            th.dwgState = {
                left: th.viewer.dwgView.__sceneInViewPoint.left,
                top: th.viewer.dwgView.__sceneInViewPoint.top,
                scale: th.viewer.dwgView.__zoomScale,
                level: th.viewer.dwgView.__curLevel,
                curBuJu: th.viewer.dwgView.__curBuJu,
                device: "mobile"
            };
            innerOptions.th = th;
            options.callback(innerOptions);
        });
    },
    commentCallback: function (options) {
        var th = options.th;
        var commentData = options.commentData;
        // var pars = {
        //     cate: options.cate,
        //     /*options.cate is 'viewPoint'*/
        //     img: commentData.image
        // }
        th.$viewBoxOptions.find(".commentDialog").show();
        $("#commentText").val("");
        App.TitleBar.hidePopMenuBtn();
        App.PaperModel.gotoModel(options.th.$viewBoxOptions.find(".commentDialog"));
        var bindEvent = function () {
            var $commentDialog = options.th.$viewBoxOptions.find(".commentDialog");
            $commentDialog.find("#commentText").val("");
            App.TitleBar.setTitle("保存批注");
            $commentDialog.unbind("click");//取消重复绑定点击事件每次报错批注都取最新的
            $commentDialog.on("click", "span", function (e) {
                th.State["isBindCommentEvent"] = true;
                var type = $(this).data("type");
                console.log("type:", type);
                if (th.State["ajaxFlag"] == "true") {
                    th.State["ajaxFlag"] = "false";
                    if (type == "saveandshare") {
                        th.saveCommentData({
                            commentDialog: $commentDialog,
                            th: th,
                            type: 1,
                            commentData: commentData,
                            text: $commentDialog.find("#commentText").val(),
                            actionType: "viewPoint",
                            isShare: true
                        });
                    } else if (type == "save") {
                        th.saveCommentData({
                            commentDialog: $commentDialog,
                            th: th,
                            type: 1,
                            commentData: commentData,
                            text: $commentDialog.find("#commentText").val(),
                            actionType: "viewPoint",
                            isShare: false
                        });
                    }
                }
                // $commentDialog.unbind("click");//取消重复绑定点击事件每次报错批注都取最新的
            });
        }
        if (th.State["isBindCommentEvent"] != true) {
            bindEvent();
        }
    },
    /*保存批注数据ajax*/
    saveCommentData: function (options) {
        /*
        options.type      options.type=1 创建批注; options.type=0 评论创建批注
        options.dialog
        options.commentData  快照数据对象
        options.callback
        options.cate
        options.actionType   判断调用哪个接口
        options.text         批注内容
        */
        var th = options.th;
        var url;
        var commentData = options.commentData;
        var commentDialog = options.commentDialog;
        var pars = {
            projectId: th.options.projectId,
            projectVersionId: parseInt(th.options.projectVersionId),
            name: options.text,
            type: options.type,
            viewPointId: "", //App.Project.NotesCollection.defaults.viewpointId,
            viewPoint: JSON.stringify(th.dwgState)
        };
        /*
        var data = {
            URLtype: cate != "viewPoint" ? "viewPointCommentViewpoint" : "createViewPoint",
            data: JSON.stringify(pars),
            type: "POST",
            contentType: "application/json"
        }
        */
        if (options.text == "") {
            var Dlg = App.UI.Dialog.showMsgDialog({
                title: "提示",
                text: "请输入批注信息！",
                okText: "确定",
                cancelText: "取消",
                titleColor: "#f00",
                onok: function () {
                    th.State["ajaxFlag"] = "true";
                },
                oncancel: function () {
                    th.State["ajaxFlag"] = "true";
                },
                css: {
                    "text-align": "center"
                }
            });
            return;
        }
        wRouter.mask.maskDiv.style.backgroundColor = "#000";
        wRouter.mask.maskDiv.style.opactiy = 0.7;
        wRouter.mask.maskDiv.innerHTML = "正在保存中....";
        wRouter.mask.maskDiv.style.paddingTop = "40%";
        wRouter.mask.maskDiv.style.color = "#FFF";
        wRouter.mask.show();
        var url = options.actionType != "viewPoint" ? th.restful.viewPointCommentViewpoint : th.restful.createViewPoint;
        url = url.replace("{suffix}", "dwg");
        /*url = url.replace("{fileId}", $location.params[1].value=="true"?$location.params[2].value:$location.params[1].value);
        url = url.replace("{fileVersionId}", $location.params[1].value=="true"?$location.params[3].value:$location.params[2].value);
        */
        url = url.replace("{fileId}", $location.params[$location.params.length - 2].value);
        url = url.replace("{fileVersionId}", $location.params[$location.params.length - 2].value || $location.params[$location.params.length - 1].value);
        App.Comm.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(pars),
            param: {
                projectId: th.options.projectId
            },
            dataType: "json",
            success: function (data) {
                th.State["ajaxFlag"] = "true";
                var hash = "";
                if (data.code == 0) {
                    data = data.data;
                    //赋值id
                    commentData.viewPointId = data.id; //调用其它接口的viewPointId
                    //保存 图片 canvas filter
                    $.when(th.saveImage({
                        id: data.id,
                        img: commentData.image
                    }),
                        th.saveAnnotation(commentData)).done(function (imgData, annotationData, filterData) {

                            //关闭分享对话框
                            wRouter.mask.hide();
                            App.PaperModel.gotoBack();
                            th.$viewBoxOptions.find(".commentDialog").hide("fast");
                            th.State["isBindCommentEvent"] = false;
                            if (options.isShare) {
                                hash = "?viewpointId={viewpointId}&projectId={projectId}&projectVersionId={projectVersionId}&projectName={projectName}&fileVersionId={fileVersionId}";
                                hash = hash.replace("{viewpointId}", th.viewPointId || commentData.viewPointId);
                                hash = hash.replace("{projectId}", th.options.projectId);
                                hash = hash.replace("{projectVersionId}", th.options.projectVersionId);
                                hash = hash.replace("{projectName}", encodeURIComponent(th.options.projectName));
                                hash = hash.replace("{fileVersionId}", th.options.fileVersionId);
                                var shareUrl = "【图纸批注：" + $("#commentText").val() + "】http://" + location.host + "/page/share.html" + hash;
                                var Dlg = App.UI.Dialog.showMsgDialog({
                                    title: "分享批注",
                                    text: shareUrl,
                                    okText: "复制链接",
                                    cancelText: "取消",
                                    onok: function () {
                                        cordova.exec(sucbackAction, onFail, "WDPasteboardPlugin", "copyString", [shareUrl]);

                                        function sucbackAction() {
                                            //alert("close menu!");
                                        }

                                        function onFail(message) {
                                            //alert('Failed because: ' + message);
                                        }
                                    }
                                });
                                th.commentClose();
                            } else {
                                th.commentClose();
                            }
                        });
                } else {
                    var Dlg = App.UI.Dialog.showMsgDialog({
                        title: "提示",
                        text: "操作失败",
                        okText: "确定",
                        cancelText: "取消",
                        onok: function () {
                            wRouter.mask.hide();
                        },
                        oncancel: function () {
                            wRouter.mask.hide();
                        }
                    });
                }
            },
            error: function () {
                wRouter.mask.hide();
            }
        });
    },
    //保存图片
    saveImage: function (data) {
        //数据
        var th = this;
        var formdata = new FormData();
        formdata.append("fileName", (+(new Date())) + ".png");
        formdata.append("size", data.img.length);
        formdata.append("file", data.img);
        var url = '/sixD/' + th.options.projectId + '/viewPoint/' + data.id + '/pic';
        return $.ajax({
            url: url,
            type: "post",
            data: formdata,
            processData: false,
            contentType: false
        })
    },
    //保存批注数据
    saveAnnotation: function (commentData) {
        var th = this;
        var pars = {
            projectId: th.options.projectId,
            viewPointId: commentData.viewPointId,
            annotations: commentData.list
        },
            data = {
                url: th.restful.createAnnotation,
                param: {
                    projectId: th.options.projectId,
                    viewPointId: commentData.viewPointId
                },
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(pars),
                success: function (data) {
                    let dataObj = JSON.parse(data);
                    if (dataObj.code == 0) {
                        th.viewPointId = dataObj.data.viewPointId;
                    } else {
                        alert(dataObj.message);
                    }
                }
            }
        return App.Comm.ajax(data);
    },
    isOperate: function () {
        return this.isLoaded;
    },
    gotoBack: function () {
        var _this = this;
        if (this.args.actionName != "resourceModelLibraryList") {
            App.TitleBar.showPopMenuBtn();
        }
        clearInterval(App.PaperModel.timeId);
        let hashStr = location.hash;
        if (App.defaults.isBimControl == 2 && hashStr.indexOf("tabVersion") > 0) {
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
                location.href = "#/project/" + _this.args.projectId + "/" + _this.args.projectVersionId + "/" + _this.args.projectName + "/" + _this.args.folderId;
            });
        } else {
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
                history.back();
            });
        }
        var chageName = App.replaceXingHaoHandle(this.args.fileName);
        if (this.args.actionName == "viewModel") {
            chageName = App.replaceXingHaoHandle(this.args.paramA);
        }
        App.TitleBar.setTitle(chageName);
    },
    gotoModel: function ($node) {
        var th = this;
        App.TitleBar.returnCallback(function () {
            $node.hide();
            clearInterval(App.PaperModel.timeId);
        }, function () {
            th.gotoBack.call(th);
        });
    },
    setTitleBar: function () {
        var th = this;
        if (this.args.actionName != "resourceModelLibraryList") {
            App.TitleBar.showPopMenuBtn("model", function (e) {
                var noteslink = "#/notesList/:projectId/:projectVersionId/:name/?t=32133&returnpage=pageModel";
                if ($(this).attr("name") == "gotoHome") {
                    location.href = "#/index";
                } else if ($(this).attr("name") == "commentList") {
                    if (App.defaults.notesObj) {
                        App.defaults.notesObj = undefined;
                    }
                    noteslink = noteslink.replace(":projectId", th.args.projectId);
                    noteslink = noteslink.replace(":projectVersionId", th.args.projectVersionId);
                    noteslink = noteslink.replace(":name", th.args.projectName);
                    location.href = noteslink;
                }
            });
        } else {
            App.TitleBar.showHomeBtn();
        }
    },
}