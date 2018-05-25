/*
	write by wuweiwei
	note:
	用于封装webViewer.js
*/
(function () {
    var FamLibsView = window.FamLibsView = function (options) {

        /*设计模式*/
        this.observers = [];
        this.isLoaded = false;
        this.isEdit = false;
        var defaults = {
            type: 'model', //文件类型
            element: null, //模型渲染DOM节点,不需要外界传入
            container: null, //模型容器DOM
            etag: '', //模型ID
            sourceId: '',
            projectId: '', //模型关联的项目ID
            modelType: "" //模型类型,指的是图纸还是三维模型,modelType ="model|paper"
        };
        this.restful = {
            // "filterData": "/view/category/single/{etag}",
            "filterData": "/doc/category/single/{etag}",
            /*etag is model id*/
            unfilterData: "sixD/{projectId}/viewPoint/{viewPointId}/filter?t=1497517&projectId={projectIds}&viewPointId={viewPointId}",
            fetchSourceId: "/doc/{projectId}/{projectVersionId}/init", //组件初始化调用此方法,暂时不用
            fetchFloorsMap: '/doc/{etag}/{sourceId}/miniature/map', //获取模型楼层信息
            fetchAxisGrid: '/model/{etag}/metadata/gridAndLevel.json', //获取楼层地图,轴网信息
            //compoentAttr : 'http://bim.wanda-dev.cn/sixD/{projectId}/{projectVersion}/property?elementId={dd23cd6f75da07b38bde3b812478f565.cd75729b-d5ee-4b3b-89c1-60dc28ee7004-0006fe2e}&sceneId={dd23cd6f75da07b38bde3b812478f565}' //构建属性
            compoentAttr: '/sixD/{projectId}/{projectVersionId}/property?elementId={elementId}&sceneId={sceneId}', //构建属性
            //批注接口
            createViewPoint: "/sixD/{projectId}/viewPoint?suffix={suffix}&fileId={fileId}&fileVersionId={fileVersionId}", //创建视点
            viewPointCommentViewpoint: "/sixD/{projectId}/viewPoint/{viewPointId}/comment/viewpoint?suffix={suffix}&fileId={fileId}&fileVersionId={fileVersionId}", //视点评论视点
            createAnnotation: "/sixD/{projectId}/viewPoint/{viewPointId}/annotation", //创建批注
            savePointFilter: "/sixD/{projectId}/viewPoint/{viewPointId}/filter", //保存视点过滤器
            paper: "/doc/{projectId}/{projectVersionId}/file/tag?modelId={modelId}",
            XingHaoData: "/model/{modelId}/metadata/familyInfo.json"
        };
        this.axisGridData = {}; //轴网数据
        this.filterIds = []; //过滤树过滤的类型ID
        this.options = $.extend({}, defaults, options);
        this.options.fileId = $location.params[1].value;
        this.options.fileVersionId = $location.params[2].value;
        this.State = {};
        /* 存储各种状态 */
        this.init();
    }
    FamLibsView.prototype = {
        initPaper: function () {
            this.loadPaperPage();
        },
        init: function () {
            //初始化小地图
            if (this.viewer) {
                this.destroyModel();
            }
            //this.getFilterData();
            //this.getPaperData();
            //this.getSourceId();
            //this.loadMap();
            App.modelHref = location.href;
            /*提供给图纸模型使用，用于返回到模型页面*/
            /* 调整页面框架布局 begin */
            $("footer").css("display", "none");
            $("#mainContainer").css("overflow", "hidden");
            this.options.container.style.position = "absolute";
            this.options.container.style.width = "100%";
            this.options.container.style.top = $("#mainHeader").height() + "px";
            this.options.container.style.bottom = "0";
            this.options.container.style.overflow = "hidden";
            $(this.options.container).find(".viewBox").css("overflow", "hidden");
            $("#mainContainer").css("padding-bottom", "0");
            /* 调整页面框架布局 end */
            this.loadPage();
            this.getXingHaoData();
            $("#model_gridDialog").css("display", "none");
            $("#model_colorDialog").css("display", "none");
            this.initModel();
        },
        initModel: function () {
            var th = this;
            var viewer = new CLOUD.Viewer();
            //var viewport = document.getElementById(this.options.showViewBoxId);
            var viewport = this.options.element;
            if (this.options.element == undefined && this.options.container != undefined) {
                viewport = $(this.options.container).find("#viewBox")[0];
            }
            this.viewport = viewport;
            this.$viewBoxOptions = $(this.options.container).find(".viewBoxOptions");
            this.$boxBar = $(this.options.container).find(".viewBox-bar");
            this.$boxBarMenu = $(this.options.container).find(".viewBox-bar-menu");
            this.viewer = viewer;
            var onSelectionChangned = function (evt) {
                console.log(evt);
                th.Model = evt;
                /*单击构件存储构建对象*/
                th.publish("click", th.Model);
            }
            var callbackProgress = function (evt) {
                console.log("loaing:", evt);
            }
            var callbackFinished = function (evt) {

                var sunLight = th.viewer.getScene().sunLight;
                if (sunLight) {
                    sunLight.intensity = 0.55;
                }

                var ambientLight = th.viewer.getScene().ambientLight;
                if (ambientLight) {
                    ambientLight.intensity = 0.45;
                }

                setTimeout(function () {
                    //viewer.zoomToBuilding(0,1.15);
                    th.setCanvas();
                    //th.home();
                    viewer.render();
                    th.isLoaded = true;
                    console.log(viewer.getCamera());
                    if (typeof App.Storage.getData("viewPoint") !== 'undefined') {
                        /*模型定位：通过批注详情进来*/
                        viewer.setCamera(window.atob(App.Storage.getData("viewPoint")));
                        App.Storage.setData("viewPoint", "");
                        th.getunFilterData();
                        App.Model.gotoBack(App.notesDetailsHref);
                    }
                }, 600);
                var homeTimer = null;

                function initializeViewCallback() {
                    th.viewer.goToInitialView();
                    th.viewer.setStandardView(CLOUD.EnumStandardView.ISO, 0.6);
                    window.clearTimeout(homeTimer);
                }

                homeTimer = window.setTimeout(initializeViewCallback, 200);
            }
            var callbackStartLoading = function (evt) {
                // var total = evt.progress.total,
                // loaded = evt.progress.loaded,
                // progress = loaded / total * 100;
            }
            viewer.init(viewport);
            //viewer.resize(screen.width,screen.height);
            viewer.setSelectPadCallback(onSelectionChangned);
            viewer.registerEventListener(CLOUD.EVENTS.ON_CLICK_PICK, onSelectionChangned);
            viewer.registerEventListener(CLOUD.EVENTS.ON_SELECTION_CHANGED, onSelectionChangned);
            viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_CHANGED, callbackProgress);
            viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_COMPLETE, callbackFinished);
            viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_START, callbackStartLoading);
            viewer.registerEventListener(CLOUD.EVENTS.ON_UPDATE_SELECTION_UI, function (evt) { //ctrl+拖拽 执行的回调
                console.log("Empty scene!");
            });
            viewer.registerEventListener(CLOUD.EVENTS.ON_LOAD_EMPTY_SCENE, function (evt) {

                // 这里处理空场景的逻辑
                var Dlg1 = App.UI.Dialog.showMsgDialog({
                    title: "提示",
                    text: "此文件不支持在线预览！",
                    // okText: "确定",
                    onok: function () {
                        history.back()
                        return;
                    },
                });
                $(Dlg1.dialog).find(".commDialogCancel").css("display", "none");
                $(Dlg1.dialog).find(".commDialogOk").css("width", "100%");
            });
            this.bindEvent();
            // viewer.load("569a781f6f4d8e151ca14be649fbb87f","http://bim-uat.wanda-dev.cn/model/");
            console.log(this.options.etag)
            this.setCanvas();
            //viewer.load(this.options.etag,"http://139.217.25.150/model/");
            viewer.load(this.options.etag, "/model/");
        },
        destroyModel: function () {
            this.viewer.destroy();
        },
        getAnnotationObject: function (viewer) {
            var th = this;
            this.viewer = this.viewer || viewer;
            if (!this.annotationHelper3D) {
                this.annotationHelper3D = new CLOUD.Extensions.AnnotationHelper3D(this.viewer);
            }
            var renderCB = function () {
                th.annotationHelper3D.renderAnnotations();
            }
            this.viewer.addCallbacks("render", renderCB);
            var resizeCB = function () {
                th.annotationHelper3D.resizeAnnotations();
            }
            this.viewer.addCallbacks("render", resizeCB);
            return this.annotationHelper3D;
        },
        getMiniMapObject: function (viewer) {
            var th = this;
            this.viewer = this.viewer || viewer;
            if (!this.MiniMapHelper) {
                this.MiniMapHelper = new CLOUD.Extensions.MiniMapHelper(this.viewer);
                var renderCB = function () {
                    th.MiniMapHelper.renderMiniMap();
                }
                this.viewer.addCallbacks("render", renderCB);
            }
            return this.MiniMapHelper;
        },
        loadPage: function () {
            if (this.options.container == undefined) {
                return;
            }
            var page = $http.template("tpls/model/famLibsSideBar.html");
            this.options.container.innerHTML = (page);
            $("#fileName").css("top", 0).html(this.options.fileName.replace(/\*/g, " "));
        },
        showSubMenu: function (className) {
            this.$boxBarMenu.find(className).css("display", "block");
            this.$boxBarMenu.css("display", "block");
            this.$viewBoxOptions.find(".filterDetail").css("display", "none");
        },
        hideSubMenu: function (className) {
            this.$boxBarMenu.find(className).css("display", "none");
            this.$boxBarMenu.css("display", "none");
        },
        hidePage: function (className) {
            this.$viewBoxOptions.find(".page").css("display", "none");
        },
        // showMenu : function(className){
        // 	this.$boxBarMenu.find(className).css("display","block");
        // 	this.$boxBarMenu.css("display","block");
        // },
        hideMenu: function (options) {
            /*
            options.stateName 对应 this.State的key
            */
            var v;
            this.$boxBarMenu.css("display", "none");
            this.$boxBarMenu.find(".comment").css("display", "none");
            this.$boxBarMenu.find(".more").css("display", "none");
            this.$viewBoxOptions.find(".XingHaoDetail").css("display", "none");
            this.$viewBoxOptions.find(".colorDetail").css("display", "none");
            this.$viewBoxOptions.find(".info").css("display", "none");
            if (options != undefined && options.stateName !== undefined) {
                for (v in this.State) {
                    if (v == options.stateName) {
                    } else {
                        this.State["infoState"] = "close";
                    }
                }
            } else {
                this.State["infoState"] = "close";
            }
        },
        isOperate: function () {
            return this.isLoaded;
        },
        bindEvent: function () {
            var th = this;
            this.on("click", function (Model) {
                var intersect = th.getIntersectObj(Model);
                if (intersect == undefined) {
                    th.Model = undefined;
                }
                if (intersect && th.State["infoState"] == "open") {
                    if (th.Model.intersect) {

                        var userIdTmp = th.Model.intersect.userId || th.Model.intersect.selectedObjectId;
                        if (userIdTmp === undefined) {
                            userIdTmp = th.Model.intersect.selectionList[0];
                        }
                        var sceneIdTmp = th.Model.intersect.modelId;
                        th.getComponetAttr({
                            element: userIdTmp,
                            sceneId: sceneIdTmp
                        });
                    }
                }
            });
            this.$boxBar.on("click", "dt", function (e) {
                if (!th.isOperate()) {
                    return;
                }

                var $curNode = $(this);
                if ($curNode.data("type") == "guigexinghao" && !th.isEdit) {
                    th.$viewBoxOptions.find(".bgcolorDetail").css("display", "none");
                    th.$viewBoxOptions.find(".info").css("display", "none");
                    var $XingHaoDetail = th.$viewBoxOptions.find(".XingHaoDetail");
                    if ($XingHaoDetail.css("display") == "block") {
                        $XingHaoDetail.css("display", "none");
                        $curNode.css("background-color", "#FFF");
                    } else {
                        $XingHaoDetail.css("display", "block");
                    }
                    return;
                }
                if ($curNode.data("type") == "bgcolor" && !th.isEdit) {
                    th.$viewBoxOptions.find(".XingHaoDetail").css("display", "none");
                    th.$viewBoxOptions.find(".info").css("display", "none");
                    var $XingHaoDetail = th.$viewBoxOptions.find(".bgcolorDetail");
                    if ($XingHaoDetail.css("display") == "block") {
                        $XingHaoDetail.css("display", "none");
                        $curNode.css("background-color", "#FFF");
                    } else {
                        $XingHaoDetail.css("display", "block");
                    }
                    return;
                }
                if ($curNode.data("type") == "info" && !th.isEdit) {
                    th.hideMenu({
                        stateName: "infoState"
                    });
                    th.setCanvas();
                    th.$viewBoxOptions.find(".info").css("display", "block");
                    $(th.viewport).find(".info").css("display", "block");
                    var scene = th.getSelectedIds();
                    console.log("scene:", scene);
                    var intersect = th.getIntersectObj(th.Model);
                    if (th.Model && intersect) {
                        var userIdTmp = intersect.userId || intersect.selectedObjectId;
                        if (userIdTmp === undefined) {
                            userIdTmp = intersect.selectionList[0];
                        }
                        var sceneIdTmp = intersect.modelId;
                        th.getComponetAttr({
                            element: userIdTmp,
                            sceneId: sceneIdTmp
                        });
                        if (th.State["infoState"] == undefined || th.State["infoState"] == "close") {
                            th.State["infoState"] = "open";
                            th.$viewBoxOptions.find(".info").animate({
                                height: "6.13rem"
                            });
                            /*controll bgcolor*/
                            if (!th.isEdit) {
                                th.$boxBar.find("dt").css("background-color", "#FFF");
                                $(this).css("background-color", "#F2F2F2");
                            }
                        } else {
                            th.State["infoState"] = "close";
                            th.$viewBoxOptions.find(".info").animate({
                                height: "0px"
                            });
                            $(this).css("background-color", "inherit");
                        }
                    } else {
                        App.UI.Dialog.showTip({
                            text: "请先选择一个构件",
                            timeout: "1500"
                        });
                        if (th.State["infoState"] == "open") {
                            th.State["infoState"] = "close";
                            th.$viewBoxOptions.find(".info").animate({
                                height: "0px"
                            });
                        }
                    }
                    return;
                }
            });
            /*设置背景色*/
            th.$viewBoxOptions.find(".bgcolorDetail").on("click", "li", function (e) {
                th.$viewBoxOptions.find(".bgcolorDetail").css("display", "none");
                th.setModelBgColor($(this).data("color"));
            });
            /*显示属性 折叠*/
            th.$viewBoxOptions.find(".info").on("click", ".fa", function (e) {
                var $this = $(this);
                var className = $this[0].className;
                var $dd = $this.parent().next();
                if (className.indexOf("up") == -1) {
                    $(this).addClass("up");
                    $dd.css("height", "auto");
                } else {
                    $(this).removeClass("up");
                    $dd.css("height", "0rem");
                }
            });
            /*规格型号处理*/
            th.$viewBoxOptions.find(".XingHaoDetail").on("click", "li", function () {
                var $this = $(this);
                th.$viewBoxOptions.find(".XingHaoDetail").css("display", "none");
                th.filter({
                    type: 'typeId',
                    ids: th.removeById(th.filterData, $this.data("id"))
                });
                th.$viewBoxOptions.find(".currentXH").html($this.html());
            });
        },
        /*封装bimViewer.js功能*/
        home: function () {
            this.viewer.setStandardView(CLOUD.EnumStandardView.ISO, 0.6);
            return;
        },
        zoomToBuilding: function (margin, ratio) {
            this.viewer.zoomToBuilding(margin, ratio);
            this.viewer.render();
        },
        setModelBgColor: function (color) {
            $("#viewBox").css("background-color", color);
        },
        lockAxisZ: function (isLock) {
            this.viewer.lockAxisZ(isLock);
        },
        setCanvas: function () {
            var heightA = 0,
                heightB = 0;
            if (this.$boxBar.css("display") == "block") {
                heightB = this.$boxBar[0].offsetHeight;
            }
            if (this.$boxBarMenu.css("display") == "block") {
                //heightA = this.$boxBarMenu[0].offsetHeight;
            }
            var headerHeight = $("#mainHeader")[0].offsetHeight;
            var viewBoxBarHeight = this.$boxBar[0].offsetHeight;
            var $viewBox = $("#viewBox");
            var titleHeight = this.$viewBoxOptions.find(".fileName").height();
            var currentXH = this.$viewBoxOptions.find(".currentXH").height();
            $("#viewBox").css("top", titleHeight);
            this.viewport.style.height = (screen.height - headerHeight - viewBoxBarHeight - currentXH) + "px";
            this.viewport.style.width = (screen.width) + "px";
            try {
                this.viewer.resize(screen.width, screen.height - headerHeight - viewBoxBarHeight - currentXH);
                // this.viewer.resize(screen.width, screen.height - headerHeight - viewBoxBarHeight - titleHeight - currentXH);
                //this.viewer.resize(screen.width,screen.height);
                // setTimeout(function(){
                // 	$("canvas")[0].setAttribute("width",screen.width);
                // 	$("canvas")[0].setAttribute("height",screen.height - headerHeight);
                // },5000);
            } catch (e) {
            }
        },
        setCommentFaceState: function (typeName) {
            /*typeName = "on|off"*/
            var $dt = this.$boxBar.find("dt");
            this.$boxBarMenu.find("dd").css("background-color", "#FFF");
            if (typeName == "on") {
                $($dt[0]).find("div")[0].className = "angleMenuD";
                $($dt[2]).find("div")[0].className = "infoMenuD";
                $($dt[3]).find("div")[0].className = "moreMenuD";
                $(this.$boxBarMenu.find("dd")[0]).css("background-color", "#F2F2F2");
            } else if (typeName == "off") {
                $($dt[0]).find("div")[0].className = "angleMenu";
                $($dt[2]).find("div")[0].className = "infoMenu";
                $($dt[3]).find("div")[0].className = "moreMenu";
            }
        },
        comment: function () {
            this.getAnnotationObject().editAnnotationBegin();
            this.getAnnotationObject().setAnnotationBackgroundColor(null);
            this.getAnnotationObject().setAnnotationType(1);
        },
        commentType: function (type) {
            /*type is number*/
            this.getAnnotationObject().setAnnotationType(type);
        },
        commentEnd: function () {
            this.getAnnotationObject().editAnnotationEnd();
            //this.viewer.setRectPickMode();
            //this.viewer.editorManager.enableTool(this.viewer, CLOUD.EditToolMode.PICK_BY_RECT);
        },
        setCommentStyle: function (style) {
            this.getAnnotationObject().setAnnotationStyle(style);
        },
        saveComment: function (options) {
            /*
            options is json
            options.callback = f
            */
            var th = this;
            var viewer = this.viewer;
            var list = this.getAnnotationObject().getAnnotationInfoList();
            var newList = [];
            $.each(list, function (i, item) {
                newList.push(window.btoa(JSON.stringify(item)));
            });
            var category = th.getFilters(th.$viewBoxOptions.find(".filterDetail"), 'uncheck');
            console.log("category:", category);
            this.getAnnotationObject().captureAnnotationsScreenSnapshot(null, function (data) {
                var commentData = {
                    camera: th.getCamera(),
                    list: newList,
                    image: data.substr(22),
                    filter: {
                        category: category
                    }
                };
                var innerOptions = {};
                innerOptions.commentData = commentData;
                innerOptions.th = th;
                options.callback(innerOptions);
            });
        },
        getCamera: function () {
            var viewer = this.viewer;
            return window.btoa(viewer.getCamera());
        },
        getIntersectObj: function (model) {
            if (model == undefined) {
                return model;
            }
            if (model.intersectInfo == undefined && model.selectionList !== undefined) {
                return model;
            }
            else if (model.intersectInfo == undefined && model.userId !== undefined) {
                return model;
            } else {
                //intersect = model.intersect;
                return model.intersectInfo;
            }
            return undefined;
        },
        commentCallback: function (options) {
            var th = options.th;
            var commentData = options.commentData;
            var pars = {
                cate: options.cate,
                /*options.cate is 'viewPoint'*/
                img: commentData.image
            }
            th.$viewBoxOptions.find(".commentDialog").show();
            App.Model.gotoModel(options.th.$viewBoxOptions.find(".commentDialog"));
            var bindEvent = function () {
                var $commentDialog = options.th.$viewBoxOptions.find(".commentDialog");
                $commentDialog.find("#commentText").val("");
                App.TitleBar.setTitle("保存批注");
                $commentDialog.on("click", "span", function (e) {
                    th.State["isBindCommentEvent"] = true;
                    var type = $(this).data("type");
                    console.log("type:", type);
                    if (type == "saveandshare") {
                        //th.saveCommentData("saveShare", dialog, data, CommentApi.shareViewPoint, cate);
                        th.saveCommentData({
                            th: th,
                            type: 1,
                            commentData: commentData,
                            text: $commentDialog.find("#commentText").val(),
                            actionType: "viewPoint",
                            isShare: true
                        });
                    } else if (type == "save") {
                        //th.saveCommentData("save", dialog, data, callback, cate);
                        th.saveCommentData({
                            th: th,
                            type: 1,
                            commentData: commentData,
                            text: $commentDialog.find("#commentText").val(),
                            actionType: "viewPoint",
                            isShare: false
                        });
                    }
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
            var pars = {
                projectId: th.options.projectId,
                projectVersionId: parseInt(th.options.projectVersionId),
                name: options.text,
                type: options.type,
                viewPointId: "", //App.Project.NotesCollection.defaults.viewpointId,
                viewPoint: commentData.camera
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
            //alert(url);
            url = url.replace("{projectId}", th.options.projectId);
            //alert(url);
            url = url.replace("{suffix}", "rvt");
            //alert(url);
            url = url.replace("{fileId}", $location.params[1].value);
            //alert(url);
            url = url.replace("{fileVersionId}", $location.params[2].value);
            //alert(url);
            App.Comm.ajax({
                url: url,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(pars),
                // param : {
                // 	projectId : th.options.projectId
                // },
                dataType: "json",
                success: function (data) {
                    console.log(data);
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
                            th.saveAnnotation(commentData),
                            th.saveFilter(commentData)).done(function (imgData, annotationData, filterData) {
                                /*
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
                                    //显示
                                    // $(".modelSidebar").addClass("show open");
                                    $("#topSaveTip .btnCanel").click();
    
                                    if ($.isFunction(callback)) {
                                        callback(imgData.data);
                                    }
                                }
                                */
                                //关闭分享对话框
                                wRouter.mask.hide();
                                App.Model.gotoBack();
                                th.$viewBoxOptions.find(".commentDialog").hide("fast");
                                if (options.isShare) {
                                    hash = "?viewpointId={viewpointId}&projectId={projectId}&projectVersionId={projectVersionId}&projectName={projectName}&fileVersionId={fileVersionId}";
                                    hash = hash.replace("{viewpointId}", th.viewPointId);
                                    hash = hash.replace("{projectId}", th.options.projectId);
                                    hash = hash.replace("{projectVersionId}", th.options.projectVersionId);
                                    hash = hash.replace("{projectName}", th.options.projectName);
                                    hash = hash.replace("{fileVersionId}", th.options.fileVersionId);
                                    var Dlg = App.UI.Dialog.showMsgDialog({
                                        title: "分享批注",
                                        text: location.host + "/share/share.html" + hash,
                                        okText: "复制链接",
                                        cancelText: "取消"
                                    });
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
                error: function (e) {
                    //alert(JSON.stringify(e));
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
                    dataType: "json",
                    data: JSON.stringify(pars),
                    success: function (data) {
                        th.viewPointId = (data.data.viewPointId);
                    }
                }
            return App.Comm.ajax(data);
        },
        //保存过滤器
        saveFilter: function (commentData) {
            var th = this;
            var filterArr = [];
            for (var key in commentData.filter) {
                commentData.filter[key].cateType = key;
                filterArr.push(JSON.stringify(commentData.filter[key]));
            }
            var pars = {
                projectId: th.options.projectId,
                viewPointId: commentData.viewPointId,
                filters: filterArr
            },
                data = {
                    url: th.restful.savePointFilter,
                    type: "POST",
                    param: {
                        projectId: th.options.projectId,
                        viewPointId: commentData.viewPointId
                    },
                    contentType: 'application/json',
                    data: JSON.stringify(pars)
                }
            return App.Comm.ajax(data);
        },
        initMap: function (options) {
            var defaults = {
                element: '',
                name: 'defaultMap',
                axisGrid: '',
                enable: true,
                callbackCameraChanged: null,
                callbackMoveOnAxisGrid: null
            }
            var _opt = $.extend({}, defaults, options);
            var _css = {
                left: '0px',
                bottom: '0px',
                outline: 'none',
                position: 'relative'
            };
            if (_opt.axisGrid) this.getMiniMapObject().setAxisGridData(_opt.axisGrid);
            this.getMiniMapObject().createMiniMap(_opt.name, _opt.element, 110, 110, _css, _opt.callbackCameraChanged, _opt.callbackMoveOnAxisGrid);
            this.getMiniMapObject().enableAxisGridEvent(_opt.name, _opt.enable);
            this.getMiniMapObject().generateAxisGrid(_opt.name);
        },
        loadMap: function () {
            var self = this,
                floorsStatue = axisGridStatue = false,
                mapMaxBox,
                floorsData,
                axisGridData;
            /*
        App.Comm.ajax({
            timeout:6000,
            type:'get',
            url:self.restful.fetchFloorsMap,
            param : {
                etag:self.options.etag,
                sourceId:self.options.sourceId
            }
        },function(res){
            if(res.message == "success")
            {
                 floorsData = res.data.sort(function(a,b){
                    return b.sort - a.sort;
                });
                for(var i= 0,xarr=[],yarr=[];i<floorsData.length;i++)
                {
                    xarr.push(floorsData[i]['boundingBox']['Max']['X'],floorsData[i]['boundingBox']['Min']['X']);
                    yarr.push(floorsData[i]['boundingBox']['Max']['Y'],floorsData[i]['boundingBox']['Min']['Y']);
                }
                mapMaxBox = [_.min(xarr),_.min(yarr),_.max(xarr),_.max(yarr)];
                  //mapMaxBox = [_.min(xarr),-2500,1700,1700];
                  console.log(mapMaxBox);
                  floorsStatue = true;
                  if(axisGridStatue)
                  {
                    axisGridData.mapMaxBox = mapMaxBox;
                    renderMap();
                  }
            }
         });
        */
            App.Comm.ajax({
                type: 'get',
                url: self.restful.fetchAxisGrid,
                param: {
                    etag: self.options.etag
                },
                success: function (res) {
                    axisGridData = JSON.parse(res);
                    axisGridStatue = true;
                    if (axisGridStatue) {
                        axisGridData.mapMaxBox = mapMaxBox;
                        self.axisGridData = axisGridData;
                        renderMap();
                    }
                }
            });

            function renderMap() {
                self.initMap({
                    name: 'bigMap',
                    element: self.$viewBoxOptions.find(".miniMap")[0],
                    axisGrid: axisGridData,
                    callbackCameraChanged: function (res) {
                        //self.obj.pub('changeGrid',res);
                    }
                });
                //self.el._dom.sidebar.find('.modelMap').append(self.el._dom.mapBar);
                //self.el._dom.sidebar.find(".modelItem:eq(0)").trigger('click',true);
            }
        },
        setAxisGrid: function (x, y) {
            this.getMiniMapObject().flyBypAxisGridNumber('bigMap', x, y);
        },
        /////////////////////////////////////////////////////////////////
        //过滤树及相关功能
        /////////////////////////////////////////////////////////////////
        /*模型过滤器,按照过滤树的值过滤*/
        filter: function (object) {
            // object{type:"categoryId",ids:[id,id,id]},type为自定义属性,包括categoryId,classCode,sceneId
            var th = this;
            var viewer = th.viewer;
            var filter = viewer.getFilter();
            var fileIds = new Array();
            $.each(object.ids, function (i, id) {
                fileIds.push(id);
            });
            filter.setUserList(CLOUD.EnumUserType.HIDDEN_DATA, object.type, fileIds, false);
            viewer.render();
        },
        removeById: function (arr, id) {
            var tmpArr = arr.concat();
            var index = tmpArr.indexOf(id);
            tmpArr.splice(index, 1);
            return tmpArr;
        },
        /*获取规格型号数据*/
        getXingHaoData: function () {
            var th = this;
            App.Comm.ajax({
                url: th.restful.XingHaoData,
                param: {
                    "modelId": this.options.modelId
                },
                type: "get",
                dataType: "json",
                success: function (data) {
                    var i;
                    th.filterData = [];
                    /*th.filterData is string of array 用于规格型号切换*/
                    for (i = 0; i < data.types.length; i++) {
                        th.filterData.push(data.types[i].id);
                    }
                    if (data.types.length > 0) {
                        th.$viewBoxOptions.find(".currentXH").html(data.types[0].name);
                    } else {
                        th.$viewBoxOptions.find(".currentXH").html("没有型号");
                    }
                    /*切换规格型号到第一个*/
                    th.filter({
                        type: 'typeId',
                        ids: th.removeById(th.filterData, data.types[0].id)
                    });
                    th.viewPageXH(data.types);
                }
            });
        },
        /*把规格型号JSON渲染到页面*/
        viewPageXH: function (data) {
            var th = this;
            template.repeat({
                repeatElement: th.$viewBoxOptions.find(".XingHaoDetail").find("li")[0],
                data: data
            });
        },
        /*获取用户在模型上选中的构件*/
        getSelectedIds: function () {
            var viewer = this.viewer;
            var selectedItems = viewer.getSelection();
            var ids = {};
            for (var i = 0; i < selectedItems.length; i++) {
                ids[selectedItems[i]] = true;
            }
            return ids;
        },
        /*保存过滤树的值（即每个过滤类型的状态）*/
        getFilters: function (element, select) {
            var type = "categoryId",
                list = element.find('li'),
                result = {
                    type: type,
                    ids: []
                };
            $.each(list, function (i, item) {
                if (i < 2) {
                    return;
                }
                var $item = $(item);
                var checkState = $item.data("state");
                /*is 'checked' or 'unchecked'*/
                var userData = $item.data("specialty") + "_" + $item.data("categoryid");
                if (select == 'uncheck' && checkState == "checked") {
                    result.ids = result.ids.concat(userData);
                }
            });
            console.log("result:", result);
            return result;
        },
        /////////////////////////////////////////////////////////////////
        //获取sourceId
        /////////////////////////////////////////////////////////////////
        getSourceId: function () {
            var th = this;
            App.Comm.ajax({
                url: this.restful.fetchSourceId,
                param: {
                    projectId: th.options.projectId,
                    projectVersionId: th.options.projectVersionId
                },
                type: "get",
                success: function (data) {
                    console.log(data);
                }
            });
        },
        /////////////////////////////////////////////////////////////////
        //构件构建属性信息
        /////////////////////////////////////////////////////////////////
        getComponetAttr: function (options) {
            var th = this;
            var Model = this.Model;
            App.Comm.ajax({
                url: th.restful.compoentAttr,
                type: "get",
                param: {
                    projectId: th.options.projectId,
                    projectVersionId: th.options.projectVersionId,
                    elementId: options.element,
                    sceneId: th.options.modelId
                },
                dataType: "json",
                success: function (data) {
                    if (data.code == 0) {
                        th.viewComment(data.data);
                    }
                }
            });
        },
        viewComment: function (data) {
            var list = [],
                i = 0;
            for (i = 1; i < data.length; i++) {
                list.push(data[i]);
            }
            template.repeat({
                repeatElement: this.$viewBoxOptions.find(".info").find(".info-bar")[0],
                data: data[0].items[0]
            });
            template.repeat({
                repeatElement: this.$viewBoxOptions.find(".info").find(".info-item")[0],
                data: list,
                process: function (object) {
                    var i;
                    var item = object.item;
                    var items = item.items;
                    var html = "<dd>{{list}}</dd>";
                    var tpls = "",
                        tplr = "",
                        tpl = '<div><label class="info-item-left">{{name}}</label><label class="info-item-right">{{value}}</label></div>';
                    tplr = tpl;
                    for (i = 0; i < items.length; i++) {
                        tplr = tpl;
                        tplr = tplr.replace("{{name}}", items[i].name).replace("{{value}}", items[i].value);
                        tpls += tplr;
                    }
                    html = html.replace("{{list}}", tpls);
                    console.log(items);
                    return {
                        "dd-list": html
                    }
                }
            });
        },
        /////////////////////////////////////////////////////////////////
        //获取图纸信息
        /////////////////////////////////////////////////////////////////
        getPaperData: function () {
            var th = this;
            var Model = this.Model;
            App.Comm.ajax({
                url: th.restful.paper,
                type: "get",
                param: {
                    projectId: th.options.projectId,
                    projectVersionId: th.options.projectVersionId,
                    modelId: th.options.modelId
                },
                dataType: "json",
                success: function (data) {
                    if (data.code == 0) {
                        th.viewPaper(data.data);
                    }
                }
            });
        },
        viewPaper: function (data) {
            var th = this;
            template.repeat({
                repeatElement: this.$viewBoxOptions.find(".paperDetail-item")[0],
                data: data,
                process: function (object) {
                    var item = object.item;
                    return {
                        "projectId": th.options.projectId,
                        "projectVersionId": th.options.projectVersionId,
                        "projectName": th.options.projectName,
                        "folderId": th.options.folderId,
                        "fileName": th.options.fileName,
                        "fileId": th.options.fileId,
                        "fileVersionId": item.fileVersionId
                    }
                }
            });
        },
        /////////////////////////////////////////////////////////////////
        //发布订阅
        /////////////////////////////////////////////////////////////////
        on: function (evtName, f) {
            var object = {
                evtName: evtName,
                fun: f
            };
            this.observers.push(object);
        },
        publish: function (evtName, args) {
            var i;
            for (i = 0; i < this.observers.length; i++) {
                if (evtName = this.observers[i].evtName) {
                    this.observers[i].fun(args);
                }
            }
        }
    }
})(window);