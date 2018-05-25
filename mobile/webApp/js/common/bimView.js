/*
	write by wandanProject
	note:
	用于封装webViewer.js
*/
(function () {
    var BimView = window.BimView = function (options) {
        /*设计模式*/
        this.observers = [];
        this.isLoaded = false;
        this.isEdit = false;
        this.flag = false;//防止重复点击动画效果标记
        var defaults = {
            type: 'model', //文件类型
            element: null, //模型渲染DOM节点,不需要外界传入
            container: null, //模型容器DOM
            etag: '', //模型ID
            sourceId: '',
            projectId: '', //模型关联的项目ID
            modelType: "", //模型类型,指的是图纸还是三维模型,modelType ="model|paper"
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
            getPointFilter: "/sixD/{projectId}/viewPoint/{viewPointId}/filter", //获取前端修改后保存的过滤器
            paper: "/doc/{projectId}/{projectVersionId}/file/tag?modelId={modelId}"
        };
        this.axisGridData = {}; //轴网数据
        this.filterIds = []; //过滤树过滤的类型ID
        this.options = $.extend({}, defaults, options);
        this.options.fileId = $location.params[1].value;
        this.options.fileVersionId = $location.params[2].value;
        this.State = {};
        /* 存储各种状态 */
        this.State["setModelBgColor"] = "#FFF";
        this.init();
    }
    BimView.prototype = {
        initPaper: function () {
            this.loadPaperPage();
        },
        init: function () {
            //初始化小地图
            if (App.bimView) {
                App.bimView.destroyModel();
            }
            this.getFilterData();
            this.getPaperData();
            this.getSourceId();
            this.loadMap();
            this.loadPage();
            if (location.hash.indexOf("noComment=yes") > 0 && location.href.indexOf("resourceModelLibraryList") == -1) /*传入noComment=yes表示没有批注功能(族库中rte文件)*/ {
                this.hideCommentUI();
            }
            if (location.href.indexOf("resourceModelLibraryList") > 0) {
                var $dts = $(this.options.container).find(".viewBox-bar").find("dt");
                $dts[0].style.width = "20%";
                $dts[1].style.display = "none";
                $dts[2].style.width = "20%";
                $dts[3].style.width = "20%";
                $dts[4].style.width = "20%";
                $dts[5].style.width = "20%";
            }
            App.modelHref = location.href;
            /*提供给图纸模型使用，用于返回到模型页面*/
            /* 调整页面框架布局 begin */
            $("footer").css("display", "none");
            $("#mainContainer").css("overflow", "hidden");
            // this.options.container.style.position = "absolute";
            this.options.container.style.position = "relative";
            this.options.container.style.width = "100%";
            this.options.container.style.height = "100%";
            // this.options.container.style.top = $("#mainHeader").height() + "px";
            // this.options.container.style.bottom = "0";
            this.options.container.style.overflow = "hidden";
            $(this.options.container).find(".viewBox").css("overflow", "hidden");
            $("#mainContainer").css("padding-bottom", "0");
            /* 调整页面框架布局 end */
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
            console.log("::", this.$boxBar[0].clientHeight)
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
                th.setCanvas();
                //th.home();
                th.viewer.setLightIntensityFactor(1.2);
                th.viewer.setTransitionAnimationState(false);
                th.viewer.enableHover(false);
                
                th.lockAxisZ(false);

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
                    //viewer.render();
                    th.isLoaded = true;
                    //th.getUserFilterData();
                    var vpData = App.Storage.getData("viewPoint");
                    if ((vpData != undefined) && (vpData != "")) {
                        /*模型定位：通过批注详情进来*/
                        var jsonStr = window.atob(App.Storage.getData("viewPoint"));
                        if (jsonStr !== undefined) {
                            if (!jsonStr.startsWith("{\"name\":")) {
                                jsonStr = jsonStr.replace("{\"position\"", "{\"name\":\"persp\",\"position\"");
                            }
                        }
                        viewer.setCamera(jsonStr);

                        //viewer.setAmbientLightIntensity(0.7) ;
                        //App.Storage.setData("viewPoint","");
                        th.getUserFilterData();
                        App.Model.gotoBack();
                    }
                }, 600);
                var homeTimer = null;

                function initializeViewCallback() {
                    
                    //th.viewer.setAmbientLightIntensity(0.7) ;
                    th.viewer.goToInitialView();
                    th.viewer.setStandardView(CLOUD.EnumStandardView.ISO, 0.6);
                    //th.zoomToBuilding(-0.6, 1.0);
                    window.clearTimeout(homeTimer);
                }



                homeTimer = window.setTimeout(initializeViewCallback, 500);
            }
            var callbackStartLoading = function (evt) {
                // var total = evt.progress.total,
                // loaded = evt.progress.loaded,
                // progress = loaded / total * 100;
            }
            viewer.init(viewport);
            console.log(viewer.cameraControl.zoomSpeed);
            viewer.cameraControl.zoomSpeed = 0.1;
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
            var body = document.getElementsByTagName("body")[0];
            // body.onclick = function (e) {
            //     //console.log("鼠标事件:",e);
            // }
            body.ontouchmove = function (e) {
                var touches = e.touches;
                0
                console.log("mouseX:", touches[0].layerX);
                console.log("mouseY:", touches[0].layerY);
            }
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
        hideCommentUI: function () {
            var $dts = $(this.options.container).find(".viewBox-bar").find("dt");
            $dts[1].style.display = "none";
            $dts[0].style.display = "none";
            $dts[2].style.width = "25%";
            $dts[3].style.width = "25%";
            $dts[4].style.width = "25%";
            $dts[5].style.width = "25%";
            App.TitleBar.showHomeBtn();
        },
        getAnnotationObject: function (viewer) {
            var th = this;
            this.viewer = this.viewer || viewer;
            var popupHandler = {
                showDialog: function (text) {
                    var Dlg = App.UI.Dialog.showCommDialog({ //文本批注使用的代码
                        title: "请输入批注文字",
                        element: $("#setTextNotes")[0],
                        okText: "确定",
                        cancelText: "取消",
                        onok: function () {
                            th.annotationHelper3D.setTextFromPopupBox($("#textNotes").val());
                        },
                        oncancel: function () {
                            th.annotationHelper3D.unsetTextFromPopupBox();
                        }
                    });
                    $("#textNotes").val("");
                    $("#textNotes").focus();
                }
            }
            if (!this.annotationHelper3D) {
                this.annotationHelper3D = new CLOUD.Extensions.AnnotationHelper3D(this.viewer, {
                    popupCallback: popupHandler.showDialog
                });
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
            var page = $http.template("tpls/model/sideBar.html");
            this.options.container.innerHTML = (page);
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
            this.$viewBoxOptions.find(".filterDetail").css("display", "none");
            this.$viewBoxOptions.find(".paperDetail").css("display", "none");
            this.$viewBoxOptions.find(".info").css("display", "none");
            if (options != undefined && options.stateName != undefined) {
                for (v in this.State) {
                    if (v == options.stateName) {
                        this.State["infoState"] = "open";
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
            /*模型单击事件*/
            this.on("click", function (Model) {
                var intersect = th.getIntersectObj(Model);
                if (intersect == undefined) {
                    th.Model = undefined;
                }
                if (intersect && th.State["infoState"] == "open") {
                    var userIdTmp = intersect.userId || intersect.selectedObjectId;
                    if (userIdTmp === undefined) {
                        userIdTmp = intersect.selectionList[0];
                    }
                    var sceneIdTmp = intersect.modelId;
                    th.getComponetAttr({
                        element: userIdTmp,
                        sceneId: sceneIdTmp
                    });
                }
            });
            this.$boxBar.on("click", "dt", function (e) {
                var $curNode = $(this);
                var selectState = false;
                /*背景色是否选中*/
                if (!th.isOperate()) {
                    return;
                }
                /*controll bgcolor*/
                if (!th.isEdit) {
                    th.$boxBar.find("dt").css("background-color", "#FFF");
                    selectState = $curNode.data("type") == "filter" || $curNode.data("type") == "comment" || $curNode.data("type") == "info" || $curNode.data("type") == "more";
                    if (selectState) {
                        $curNode.css("background-color", "#F2F2F2");
                    }
                }
                var $filterDetail = $(th.viewport).find(".filterDetail");
                var $paperDetail = $(th.viewport).find(".paperDetail");
                var $info = th.$viewBoxOptions.find(".info");
                $filterDetail.css("display", "none");
                $paperDetail.css("display", "none");
                $info.css("display", "none");
                if ($curNode.data("type") == "angle" && !th.isEdit) {
                    th.hideMenu();
                    th.setCanvas();
                    th.home();
                    return;
                }
                if ($curNode.data("type") == "info" && !th.isEdit) {
                    if (th.flag) return;
                    th.flag = true;
                    if (th.Model == undefined) {
                        $curNode.css("background-color", "#FFF");
                        App.UI.Dialog.showTip({
                            text: "请先选择一个构件",
                            timeout: "1500"
                        });
                        th.flag = false;
                        return;
                    }
                    var scene = th.getSelectedIds();
                    var intersect = th.getIntersectObj(th.Model);
                    if (intersect) {
                        th.hideMenu({
                            stateName: "infoState"
                        });
                        th.$viewBoxOptions.find(".info").css("display", "block");
                        $(th.viewport).find(".info").css("display", "block");
                        th.$viewBoxOptions.find(".paperDetail").css("display", "none");
                        th.$viewBoxOptions.find(".more").find("dd").css("background-color", "#FFF");
                        var $displayState = th.$viewBoxOptions.find(".info");
                        console.log($displayState.css("height"));
                        if ($displayState.css("height") == "0px") {
                            th.State["infoState"] = "open";
                            $curNode.css("background-color", "#f2f2f2");
                            th.$viewBoxOptions.find(".info").animate({
                                height: "6.13rem"
                            }, function () {
                                var userIdTmp = intersect.userId || intersect.selectedObjectId;
                                if (userIdTmp === undefined) {
                                    userIdTmp = intersect.selectionList[0];
                                }
                                var sceneIdTmp = intersect.modelId;
                                th.getComponetAttr({
                                    element: userIdTmp,
                                    sceneId: sceneIdTmp
                                });
                                th.flag = false;
                            });
                        } else {
                            th.State["infoState"] = "close";
                            $curNode.css("background-color", "#FFF");
                            th.$viewBoxOptions.find(".info").animate({
                                height: "0px"
                            }, function () {
                                th.flag = false;
                            });
                        }
                    } else {
                        App.UI.Dialog.showTip({
                            text: "请先选择一个构件"
                        });
                        $curNode.css("background-color", "#FFF");
                        if (th.State["infoState"] == "open") {
                            th.State["infoState"] = "close";
                            th.$viewBoxOptions.find(".info").animate({
                                height: "0px"
                            });
                        }
                    }
                    return;
                    /*if (th.Model.intersect == undefined && th.Model.click == undefined) {
                        intersect = th.Model;
                    } else {
                        intersect = th.Model.intersect;
                    
                }*/
                }
                if ($curNode.data("type") == "comment") {
                    th.$boxBarMenu.find(".more").css("display", "none");
                    var displayState = th.$boxBarMenu.find(".comment").css("display");
                    if (displayState == "block") {
                        th.isEdit = false;
                        th.commentEnd();
                        th.hideSubMenu(".comment");
                        th.hideMenu();
                        th.setCommentFaceState("off");
                        $curNode.css("background-color", "#FFF");
                        th.$viewBoxOptions.find(".floatMenu").css("display", "block");
                    } else {
                        th.hideMenu();
                        th.showSubMenu(".comment");
                        th.setCommentFaceState("on");
                        $curNode.css("background-color", "#F2F2F2");
                        th.$viewBoxOptions.find(".floatMenu").css("display", "none");
                        th.isEdit = true;
                        th.comment();
                        /*开始批注*/
                    }
                }
                if ($curNode.data("type") == "more" && !th.isEdit) {
                    th.$boxBarMenu.find(".comment").css("display", "none");
                    th.$viewBoxOptions.find(".info").css("display", "none");
                    th.$viewBoxOptions.find(".info").css("height", "0px");
                    th.$viewBoxOptions.find(".paperDetail").css("display", "none");
                    th.$viewBoxOptions.find(".more").find("dd").css("background-color", "#FFF");
                    var displayState = th.$boxBarMenu.find(".more").css("display");
                    if (displayState == "block") {
                        th.hideSubMenu(".more");
                        $curNode.css("background-color", "#FFF");
                    } else {
                        th.showSubMenu(".more");
                        if (App.defaults.familyObj) {
                            th.$viewBoxOptions.find(".more").find("dd").eq(1).find("i").addClass('more-paperD');
                        }
                    }
                }
                /*显示过滤树*/
                if ($curNode.data("type") == "filter" && !th.isEdit) {
                    th.$viewBoxOptions.find(".info").css("display", "none");
                    th.$viewBoxOptions.find(".info").css("height", "0px");
                    th.$viewBoxOptions.find(".more").css("display", "none");
                    th.$boxBarMenu.css("display", "none");
                    th.$viewBoxOptions.find(".paperDetail").css("display", "none");
                    th.$viewBoxOptions.find(".more").find("dd").css("background-color", "#FFF");
                    var isShow = th.$viewBoxOptions.find(".filterDetail").css("display");
                    if (isShow == "block") {
                        th.$viewBoxOptions.find(".filterDetail").css("display", "none");
                        $curNode.css("background-color", "#FFF");
                    } else {
                        th.$viewBoxOptions.find(".filterDetail").css("display", "block");
                        $curNode.css("background-color", "#F2F2F2");
                    }
                }
                /*显示轴网信息*/
                if ($curNode.data("type") == "grid" && !th.isEdit) {
                    th.$viewBoxOptions.find(".more").css("display", "none");
                    th.$boxBarMenu.css("display", "none");
                    var Dlg = App.UI.Dialog.showCommDialog({
                        element: $("#model_gridDialog")[0],
                        title: "输入X轴Y轴， 快速定位",
                        onok: function (e) {
                            var x = $("#grid-x").val();
                            var y = $("#grid-y").val();
                            var r = th.setAxisGrid(y, x);
                            if (!r) {
                                App.UI.Dialog.showTip({
                                    text: "轴网信息不存在，请重新输入！",
                                    timeout: 3000
                                });
                            }
                        }
                    });
                    $(Dlg.dialog).find("input").val("");
                }
                if ($curNode.data("type") == "hide" && !th.isEdit) {
                    if (th.Model == undefined) {
                        $curNode.css("background-color", "#FFF");
                        App.UI.Dialog.showTip({
                            text: "请先选择一个构件",
                            timeout: "1500"
                        });
                        return;
                    }
                    var scene = th.getSelectedIds();
                    var intersect = th.getIntersectObj(th.Model);
                    if (intersect) {
                        th.$viewBoxOptions.find(".more").css("display", "none");
                        th.$boxBarMenu.css("display", "none");
                        //var filter = th.viewer.getFilter();
                        CLOUD.FilterUtil.hideSelections(th.viewer);
                        th.viewer.render();
                        th.$viewBoxOptions.find(".floatMenu").find(".cancelHide").css("display", "block");
                    } else {
                        App.UI.Dialog.showTip({
                            text: "请先选择一个构件",
                            timeout: "1500"
                        });
                    }
                    th.Model = undefined;
                }
            });
            this.$boxBarMenu.on("click", "dd", function (e) {
                var $curNode = $(this);
                if (!th.isOperate()) {
                    return;
                }
                if ($curNode.data("type") != "comment-color") {
                    if (!App.defaults.familyObj) {
                        th.$boxBarMenu.find("dd").css("background-color", "#FFF");
                        $(this).css("background-color", "#F2F2F2");
                    }
                }
                if ($curNode.data("type") == "more-bgcolor") {
                    $curNode.css("background-color", "#FFF");
                    th.setModelBgColor($curNode);
                    return;
                }
                /*
                                
                                if($curNode.data("type")=="more-z")
                                {
                                    var selected = $($curNode).is('.selected');
                                    $($curNode).toggleClass('selected');
                                    th.lockAxisZ(!selected);
                                }
                                */
                /*
                                
                                if($curNode.data("type")=="more-hide")
                                {
                                    var filter = th.viewer.getFilter();
                                    filter.hideSelections();
                                    th.viewer.render();
                                    th.$viewBoxOptions.find(".showComponets").css("display","block");
                                }
                                */
                /*
                if($curNode.data("type")=="more-grid")
                {
                    var Dlg = App.UI.Dialog.showCommDialog({
                        element : $("#model_gridDialog")[0],
                        title : "输入X轴Y轴， 快速定位",
                        onok : function(e){
                            var x = $("#grid-x").val();
                            var y = $("#grid-y").val();
                            th.setAxisGrid(y,x);
                        }
                    });
                    $(Dlg.dialog).find("input").val("");
                    $(Dlg.dialog).find(".commDialogCancel").css("width","50%");
                    $(Dlg.dialog).find(".commDialogOk").css("display","block");
                }
                */
                /*批注事件处理*/
                var typeId = $curNode.data("typeid");
                if ($curNode.data("type") == "comment-rect" || $curNode.data("type") == "comment-circle" || $curNode.data("type") == "comment-cloud" || $curNode.data("type") == "comment-text") {
                    th.commentType(typeId);
                }
                if ($curNode.data("type") == "comment-text") {
                    th.commentText();
                }
                if ($curNode.data("type") == "comment-color") {
                    var Dlg = App.UI.Dialog.showCommDialog({
                        element: $("#model_colorDialog")[0],
                        title: "选择您想要使用的颜色",
                        onok: function () {
                        }
                    });
                    $(Dlg.dialog).find(".commDialogCancel").css("width", "100%");
                    $(Dlg.dialog).find(".commDialogOk").css("display", "none");
                    $(Dlg.dialog).find(".commDialogContainer").find("span").on("click", function (e) {
                        var color = $(this).data("color");
                        th.setCommentStyle({
                            'stroke-color': color,
                            'fil-color': color
                        });
                        App.UI.Dialog.hideCommDialog();
                    });
                }
                if ($curNode.data("type") == "comment-save") {
                    th.saveComment({
                        callback: th.commentCallback,
                        cate: 'viewPoint'
                    });
                }
                if ($curNode.data("type") == "more-paper" && !App.defaults.familyObj) {
                    th.$viewBoxOptions.find(".filterDetail").css("display", "none");
                    var $paperDetail = th.$viewBoxOptions.find(".paperDetail");
                    if ($paperDetail.css("display") == "block") {
                        $paperDetail.css("display", "none");
                        $paperDetail.css("height", "6rem");
                        $curNode.css("background-color", "#FFF");
                    } else {
                        $paperDetail.css("display", "block");
                        $paperDetail.css("height", "6rem");
                        $curNode.css("background-color", "#F2F2F2");
                    }
                }
            });
            /*过滤树操作*/
            th.$viewBoxOptions.find(".filterDetail").on("click", "li", function (e) {
                var specialty = $(this).attr("data-specialty");
                var categoryid = $(this).attr("data-categoryid");
                var compoentsId = specialty + "_" + categoryid;
                var checkState = $(this).attr("data-state");
                var i;
                if ($(this).attr("data-type") == "checkAll") /*全选*/ {
                    if (checkState == "checked") {
                        th.$viewBoxOptions.find(".filterDetail").find("li").each(function (index, ele) {
                            $(this).find("i").css("color", "#333");
                            $(this).attr("data-state", "unchecked");
                            if (index == 0 || index == 1) {
                                return;
                            }
                            var specialty = $(this).attr("data-specialty");
                            var categoryid = $(this).attr("data-categoryid");
                            var compoentsId = specialty + "_" + categoryid;
                            th.filterIds.push(compoentsId);
                        });
                    } else {
                        th.$viewBoxOptions.find(".filterDetail").find("li").each(function (index, ele) {
                            $(this).find("i").css("color", "#FFF");
                            $(this).attr("data-state", "checked");
                        });
                        th.filterIds = [];
                    }
                    th.filter({
                        type: "categoryId",
                        ids: th.filterIds
                    });
                    return;
                }
                if (checkState == "checked") {
                    th.filterIds.push(compoentsId);
                    $(this).attr("data-state", "unchecked");
                    $(this).find("i").css("color", "#333");
                } else {
                    for (i = 0; i < th.filterIds.length; i++) {
                        if (compoentsId == th.filterIds[i]) {
                            break;
                        }
                    }
                    th.filterIds.splice(i, 1);
                    $(this).attr("data-state", "checked");
                    $(this).find("i").css("color", "#FFF");
                }
                if (th.filterIds.length == 0) {
                    $("li[data-type=checkAll]").attr("data-state", "checked");
                    $("li[data-type=checkAll]").find("i").css("color", "#FFF");
                } else {
                    $("li[data-type=checkAll]").attr("data-state", "unchecked");
                    $("li[data-type=checkAll]").find("i").css("color", "#333");
                }
                /*if(th.filterIds.length != th.userFilterIds.length){
                    $("li[data-type=checkAll]").attr("data-state", "unchecked");
                    $("li[data-type=checkAll]").find("i").css("color", "#333");
                }else{
                    $("li[data-type=checkAll]").attr("data-state", "checked");
                    $("li[data-type=checkAll]").find("i").css("color", "#FFF");
                }*/
                /*if(th.filterIds.length == th.userFilterIds.length){
                    $("li[data-type=checkAll]").attr("data-state", "unchecked");
                    $("li[data-type=checkAll]").find("i").css("color", "#333");
                }else if(th.filterIds.length == 0){
                    $("li[data-type=checkAll]").attr("data-state", "checked");
                    $("li[data-type=checkAll]").find("i").css("color", "#FFF");
                }*/
                th.filter({
                    type: "categoryId",
                    ids: th.filterIds
                });
                console.log("filterIds:", th.filterIds);
            });
            /*屏幕左上角菜单-->显示所有构建*/
            th.$viewBoxOptions.find(".floatMenu").on("click", ".cancelHide", function () {
                var filter = th.viewer.getFilter();
                filter.clear();
                th.viewer.clearSelection();
                if (th.filterIds && th.filterIds.length > 0) {
                    th.filter({
                        type: "categoryId",
                        ids: th.filterIds /*要去调的过滤树名称*/
                    });
                }
                th.Model = undefined;
                th.viewer.render();
                this.style.display = "none";
            });
            /*屏幕左上角菜单-->home视角*/
            th.$viewBoxOptions.find(".floatMenu").on("click", ".home", function () {
                th.hideMenu();
                th.setCanvas();
                th.home();
            });
            /*屏幕左上角菜单-->z-轴锁定*/
            th.$viewBoxOptions.find(".floatMenu").on("click", ".z", function () {
                $this = $(this);
                var selected = $this.is('.selected');
                $this.toggleClass('selected');
                th.lockAxisZ(!selected);
                if (!selected) /*锁定*/ {
                    $this.removeClass("zunlock");
                    $this.addClass("zlock");
                } else {
                    $this.removeClass("zlock");
                    $this.addClass("zunlock");
                }
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
            /*批注保存处理，文本框获取焦点处理事件*/
            var setTextareaToTop = function () {
                App.Model.timeId = setInterval(function () {
                    window.scrollTo(0, 0);
                    var $commentDialog = th.$viewBoxOptions.find(".commentDialog");
                    var $textArea = th.$viewBoxOptions.find(".textArea");
                    $commentDialog[0].scrollTop = 0;
                    $textArea[0].scrollTop = 0;
                }, 10);
            }
            th.$viewBoxOptions.find("#commentText").on("focus", function () {
                setTextareaToTop();
            });
        },
        /*关闭批注*/
        commentClose: function () {
            var th = this;
            th.isEdit = false;
            th.commentEnd();
            th.hideSubMenu(".comment");
            th.hideMenu();
            th.setCommentFaceState("off");
            th.$viewBoxOptions.find(".floatMenu").css("display", "block");
            this.$boxBar.find("dt").css("background-color", "#FFF");
        },
        /*封装bimViewer.js功能*/
        home: function () {
            var self = this;
            var homeTimer = null;

            function initializeViewCallback() {
                    self.viewer.goToInitialView();
                    self.viewer.setStandardView(CLOUD.EnumStandardView.ISO, 0.6);
                    window.clearTimeout(homeTimer);
                }

            homeTimer = window.setTimeout(initializeViewCallback, 30);

            return;
            //this.viewer.goToInitialView();
            //var th = this;
            //var homeTimer = null;
            //function initializeViewCallback() {
            //th.zoomToBuilding(-0.05, 1.0);
            //window.clearTimeout(homeTimer);
            //}
            //homeTimer = window.setTimeout(initializeViewCallback,500);

            homeTimer = window.setTimeout(initializeViewCallback, 500);
        },
        zoomToBuilding: function (margin, ratio) {
            this.viewer.zoomToBuilding(margin, ratio);
            this.viewer.render();
        },
        setModelBgColor: function ($node) {
            if (this.State["setModelBgColor"] == undefined || this.State["setModelBgColor"] == "#FFF") {
                this.viewport.style.backgroundColor = "#000";
                this.State["setModelBgColor"] = "#000";
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").removeClass("more-bgwhite");
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").addClass("more-bgblack");
                $node.find("span").html("黑色");
            } else {
                this.viewport.style.backgroundColor = "#FFF";
                this.State["setModelBgColor"] = "#FFF";
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").removeClass("more-bgblack");
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").addClass("more-bgwhite");
                $node.find("span").html("白色");
            }
        },
        lockAxisZ: function (isLock) {
            CLOUD.EditorConfig.LockAxisZ = isLock;
            //this.viewer.lockAxisZ(isLock);
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
            this.viewport.style.height = (screen.height - headerHeight - viewBoxBarHeight) + "px";
            this.viewport.style.width = (screen.width) + "px";
            try {
                this.viewer.resize(screen.width, screen.height - headerHeight - viewBoxBarHeight);
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
                $($dt[0]).find("div")[0].className = "filterMenuD";
                $($dt[2]).find("div")[0].className = "infoMenuD";
                $($dt[3]).find("div")[0].className = "hideMenuD";
                $($dt[4]).find("div")[0].className = "gridMenuD";
                $($dt[5]).find("div")[0].className = "moreMenuD";
                $(this.$boxBarMenu.find("dd")[0]).css("background-color", "#F2F2F2");
            } else if (typeName == "off") {
                $($dt[0]).find("div")[0].className = "filterMenu";
                $($dt[2]).find("div")[0].className = "infoMenu";
                $($dt[3]).find("div")[0].className = "hideMenu";
                $($dt[4]).find("div")[0].className = "gridMenu";
                $($dt[5]).find("div")[0].className = "moreMenu";
            }
        },
        comment: function () {
            this.getAnnotationObject().editAnnotationBegin();
            if (this.State["setModelBgColor"] == "#000") {
                this.getAnnotationObject().setAnnotationBackgroundColor("#000");
            } else {
                this.getAnnotationObject().setAnnotationBackgroundColor(null);
            }
            this.getAnnotationObject().setAnnotationType(1);
        },
        commentType: function (type) {
            /*type is number*/
            this.getAnnotationObject().setAnnotationType(type);
        },
        commentText: function () {
            // return;
            // var popupHandler = {
            // 	showDialog : function(text){
            // 		alert(text);
            // 		var Dlg = App.UI.Dialog.showCommDialog({//文本批注使用的代码
            // 			title : "请输入批注文字",
            // 			element : $("#setTextNotes")[0],
            //     		okText : "确定",
            //     		cancelText : "取消",
            //     		onok:function(){
            //     			setTextFromPopupBox
            //     		},
            //     		oncancel : function(){
            //     		}
            //     	});
            // 	}
            // }
            // var helper = new CLOUD.Extensions.AnnotationHelper3D(App.bimView.viewer,{
            // 	popupCallback : popupHandler.showDialog
            // });
        },
        commentEnd: function () {
            this.getAnnotationObject().editAnnotationEnd();
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
            console.log(list);
            var newList = [];
            $.each(list, function (i, item) {
                newList.push(window.btoa(JSON.stringify(item)));
            });
            var category = th.getFilters(th.$viewBoxOptions.find(".filterDetail"), 'uncheck');
            this.getAnnotationObject().captureAnnotationsScreenSnapshot(th.State["setModelBgColor"], function (data) {
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
        getIntersectObj: function (model) {//intersect = res.intersectInfo;    //兼容原数据格式
            //intersect.userId = res.intersect.selectedObjectId; //兼容原数据格式
            if (model == undefined) {
                return model;
            }
            if (model.intersectInfo == undefined && model.selectionList !== undefined) {
                return model;
            }
            else if (model.intersectInfo == undefined && model.userId !== undefined) {
                return model;
            }
            else {
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
            $("#commentText").val("");
            App.TitleBar.hidePopMenuBtn();
            App.Model.gotoModel(options.th.$viewBoxOptions.find(".commentDialog"));
            var bindEvent = function () {
                var $commentDialog = options.th.$viewBoxOptions.find(".commentDialog");
                $commentDialog.find("#commentText").val("");
                App.TitleBar.setTitle("保存批注");
                $commentDialog.off("click");
                $commentDialog.on("click", "span", function (e) {
                    th.State["isBindCommentEvent"] = true;
                    var type = $(this).data("type");
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
                    // $commentDialog.unbind("click");//之前的代码
                });
            }
            if (th.State["isBindCommentEvent"] != true || 1) {
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
            // options.$commentDialog.unbind("click");//之前的代码
            wRouter.mask.maskDiv.style.backgroundColor = "#000";
            wRouter.mask.maskDiv.style.opactiy = 0.7;
            wRouter.mask.maskDiv.innerHTML = "正在保存中....";
            wRouter.mask.maskDiv.style.paddingTop = "40%";
            wRouter.mask.maskDiv.style.color = "#FFF";
            wRouter.mask.show();
            var url = options.actionType != "viewPoint" ? th.restful.viewPointCommentViewpoint : th.restful.createViewPoint;
            url = url.replace("{projectId}", th.options.projectId);
            url = url.replace("{suffix}", "rvt");
            url = url.replace("{fileId}", $location.params[$location.params.length - 2].value);
            url = url.replace("{fileVersionId}", $location.params[$location.params.length - 1].value);
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
                    var hash = "";
                    if (data.code == 0) {
                        data = data.data;
                        //赋值id
                        commentData.viewPointId = data.id; //调用其它接口的viewPointId
                        th.viewPointId = data.id;
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
                                //th.State["isBindCommentEvent"] = false;
                                if (options.isShare) {
                                    hash = "?viewpointId={viewpointId}&projectId={projectId}&projectVersionId={projectVersionId}&projectName={projectName}&fileVersionId={fileVersionId}";
                                    hash = hash.replace("{viewpointId}", th.viewPointId);
                                    hash = hash.replace("{projectId}", th.options.projectId);
                                    hash = hash.replace("{projectVersionId}", th.options.projectVersionId);
                                    hash = hash.replace("{projectName}", encodeURIComponent(th.options.projectName));
                                    hash = hash.replace("{fileVersionId}", th.options.fileVersionId);
                                    var shareUrl = "【模型批注：" + $("#commentText").val() + "】http://" + location.host + "/page/share.html" + hash;
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
                        if (th.viewPointId == undefined) {
                            th.viewPointId = (data.data.viewPointId);
                        }
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
                commentData.filter[key].modelBgColor = this.State["setModelBgColor"];
                commentData.filter[key].filterState = th.viewer.getFilter().saveState();
                filterArr.push(JSON.stringify(commentData.filter[key]));
            }
            console.log("filterArr:", filterArr);
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
            return this.getMiniMapObject().flyBypAxisGridNumber('bigMap', x, y);
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
        /*获取过滤树数据*/
        getFilterData: function () {
            var th = this;
            App.Comm.ajax({
                url: th.restful.filterData,
                param: {
                    "etag": this.options.etag
                },
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.code == 0) {
                        th.userFilterIds = [];
                        for (i = 0; i < data.data.length; i++) {
                            th.userFilterIds.push(data.data[i].specialty + "_" + data.data[i].categoryId);
                        }
                        console.log("abc:", th.userFilterIds);
                        th.viewPageFilter(data.data);
                    }
                }
            });
        },
        /*获取批注保存的过滤树数据*/
        getUserFilterData: function () {
            var th = this;
            App.Comm.ajax({
                url: th.restful.getPointFilter,
                param: {
                    projectId: th.options.projectId,
                    viewPointId: App.Model.args.paramA /*paramA is viewPointId*/
                },
                type: "get",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    th.setFilter(JSON.parse(data.data.filters[0]));
                }
            });
        },
        setFilter: function (filterObject) {
            var th = this;
            var filterIds = filterObject.ids;
            var i, pos, resultFilterIds;
            resultFilterIds = th.userFilterIds;
            for (i = 0; i < filterIds.length; i++) {
                pos = resultFilterIds.indexOf(filterIds[i]);
                resultFilterIds.splice(pos, 1);
            }
            th.filter({
                type: "categoryId",
                ids: resultFilterIds /*要去调的过滤树名称*/
            });
            console.log("def:", resultFilterIds);
            th.setTreeState(resultFilterIds);
            th.filterIds = resultFilterIds.slice(0);
            this.viewport.style.backgroundColor = filterObject.modelBgColor;
            if (filterObject.modelBgColor == "#000") {
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").removeClass("more-bgwhite");
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").addClass("more-bgblack");
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").find("span").html("黑色");
            } else {
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").addClass("more-bgwhite");
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").removeClass("more-bgblack");
                this.$viewBoxOptions.find(".more").find(".more-bgcolor").find("span").html("白色");
            }
            th.viewer.getFilter().loadState(filterObject.filterState);
            th.viewer.render();
        },
        setTreeState: function (filterIdsArr) {
            var i, categoryStr = "";
            $treeNodes = this.$viewBoxOptions.find(".filterDetail").find("li");
            if (($treeNodes.length - 2) == filterIdsArr.length) {
                this.$viewBoxOptions.find(".filterDetail").find("li[data-type=checkAll]").attr("data-state", "unchecked");
                this.$viewBoxOptions.find(".filterDetail").find("li[data-type=checkAll]").find("i").css("color", "#333");
            }
            $treeNodes.each(function (index) {
                if (index != 0 || index != 1) {
                    categoryStr = $(this).data("specialty") + "_" + $(this).data("categoryid");
                    for (i = 0; i < filterIdsArr.length; i++) {
                        if (categoryStr == filterIdsArr[i]) {
                            $(this).attr("data-state", "unchecked");
                            $(this).find("i").css("color", "#333");
                        }
                    }
                }
            });
        },
        /*获取未选中过滤树数据*/
        getunFilterData: function () {
            var url = this.restful.unfilterData;
            url = url.replace(/\{projectId\}/g, this.options.projectId);
            url = url.replace(/\{viewPointId\}/g, App.Storage.getData("viewPointId"));
            App.Comm.ajax({
                url: url,
                type: "get",
                dataType: "json",
                success: function (data) {
                    console.log("unfilterData:", data);
                }
            });
        },
        /*把过滤树的JSON渲染到页面*/
        viewPageFilter: function (data) {
            template.repeat({
                repeatElement: this.$viewBoxOptions.find(".filterDetail").find("li")[1],
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
                        var infoBox = th.$viewBoxOptions.find(".info");
                        var infoBoxH = infoBox.height();
                        var infoListBox = infoBox.find(".info-list");
                        var infoBarBox = infoBox.find(".info-bar").eq(1);
                        var infoBarBoxH = infoBarBox.height();
                        infoListBox.css("margin-top", infoBarBoxH);
                        infoListBox.height(infoBoxH - infoBarBoxH);
                    }
                }
            });
        },
        viewComment: function (data) {
            var list = [],
                i = 0;
            for (i = 1; i < data.length; i++) {
                if (data[i].group == "设计") {
                    continue;
                } else {
                    list.push(data[i]);
                }
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
            if (data.length) {
                template.repeat({
                    repeatElement: this.$viewBoxOptions.find(".paperDetail-item")[0],
                    data: data,
                    process: function (object) {
                        var item = object.item;
                        var itemName = App.replaceKongGeHandle(item.name);
                        return {
                            "projectId": th.options.projectId,
                            "projectVersionId": th.options.projectVersionId,
                            "projectName": th.options.projectName,
                            "folderId": th.options.folderId,
                            "fileName": th.options.fileName,
                            "fileId": th.options.fileId,
                            "itemName": itemName,
                            "fileVersionId": item.fileVersionId,
                            "noComment": location.hash.indexOf("noComment=yes") > 0 ? "noComment=yes" : ""
                        }
                    }
                });
            } else {
                $(".m_versionListScrollBox").show();
            }
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