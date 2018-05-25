//@ sourceURL=project.js
App.Project = {
    Settings: {
        projectId: "",
        projectVersionId: "",
        fileId: "",
        fileVersionId: "",
        suffix: "",
        famHtml: "",
        axisHtm: "",
        modelId: "",
        versionDatas: [],
    },
    isIEModel: function () {
        if ("ActiveXObject" in window || window.ActiveXObject) {
            window.location.href = '/ie.html?path=' + window.location.href;
            //window.location.href = '/ie.html?t='+App.time+'&path=' + window.location.href;
            return true;
        }
    },
    GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    getUrlByType: function (data) {
        
        //是否调试
        if (App.API.Settings.debug) {
            data.url = App.API.DEBUGURL[data.URLtype];
        } else {
            data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
        }
        //没有调试接口
        if (!data.url) {
            data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
        }
        //url 是否有参数
        var urlPars = data.url.match(/\{([\s\S]+?(\}?)+)\}/g);
        if (urlPars) {
            for (var i = 0; i < urlPars.length; i++) {
                var rex = urlPars[i],
                    par = rex.replace(/[{|}]/g, ""),
                    val = data.data[par];
                if (val) {
                    data.url = data.url.replace(rex, val);
                }
            }
        }
        return data;
    },
    //获取模型id
    getModelId: function (fileVersionId) {
        var _this = this;
        var Request = App.Project.GetRequest();
        App.Project.Settings.projectId = Request.projectId;
        App.Project.Settings.projectVersionId = Request.projectVersionId;
        App.Project.Settings.fileVersionId = fileVersionId || Request.id;
        var data = {
            URLtype: "fetchFileModelIdByFileVersionId",
            data: {
                projectId: Request.projectId,
                projectVersionId: Request.projectVersionId
            }
        }
        var url = App.Project.getUrlByType(data).url;
        $.ajax({
            url: url,
            data: {
                fileVersionId: fileVersionId || Request.id
            }
        }).done(function (data) {
            if (_.isString(data)) {
                // to json
                if (JSON && JSON.parse) {
                    data = JSON.parse(data);
                } else {
                    data = $.parseJSON(data);
                }
            }
            if (data.message == "success") {
                document.title = data.data.name + ' ' + (App.Local.data["model-view"].Mbg || "模型预览");
                App.Project.Settings.Model = data;
                App.Project.Settings.fileId = data.data.id;
                App.Project.Settings.fileVersionId = data.data.fileVersionId;
                App.Project.Settings.suffix = data.data.suffix;
                if (_this.isBimControl) {
                    $(".header .name").text(data.data.name);
                }
                if (data.data.modelId) {
                    if (data.data.modelStatus == 1) {
                        alert((App.Local.data["drawing-model"].TfCg || "模型转换中"));
                        return;
                    } else if (data.data.modelStatus == 3) {
                        alert(App.Local.data['drawing-model'].Cfd || "转换失败");
                        return;
                    }
                    //dwg 格式
                    if (data.data.suffix == "dwg") {
                        App.Project.getViewPointData(function () {
                            App.Project.renderDwg(data.data.modelId);
                        });
                    } else {
                        App.Project.renderOther(data.data.modelId, data.data.suffix);
                    }
                } else {
                    alert((App.Local.data["drawing-model"].TfCg || "模型转换中"));
                }
            } else {
                alert(data.message);
            }
        });
    },
    getParam: function (key) {
        var search = location.search;
        search = search.replace("?", "");
        var items = search.split("&");
        var item, i;
        for (i = 0; i < items.length; i++) {
            item = items[i].split("=");
            if (item[0] == key) {
                return item[1];
            }
        }
        return "";
    },
    /*获取图纸定位信息*/
    getViewPointData: function (fn) {
        var url = "/sixD/{projectId}/viewPoint/{viewPointId}";
        var th = this;
        url = url.replace("{projectId}", App.Project.getParam("projectId"));
        url = url.replace("{viewPointId}", App.Project.getParam("viewpointId"));
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            success: function (data) {
                fn();
                try {
                    th.viewPointPos = JSON.parse(data.data.viewPoint);
                } catch (e) {
                }
            }
        });
    },
    // 除 dwg以外的格式
    renderOther(modelId, type) {
        var _this = this;
        var typeMap = {
            rte: 'singleModel',
            rvt: 'singleModel',
            rfa: 'familyModel'
        }
        $(".rightProperty").show();
        App.Project.Settings.Viewer = new bimView({
            element: $("#modelBox"),
            etag: modelId,
            type: typeMap[type],
            isComment: type == "rvt" && true || false,
            callback: function (id) {
                App.Project.renderAttr(id, 1);
            }
        });
        // 获取familyType
        App.Project.Settings.Viewer.on("changType", function (id) {
            if (id) {
                App.Project.Settings.typeId = id;
                App.Project.renderAttr(id, 2);
            }
        })
        App.Project.Settings.modelId = modelId;
        
        function setCameraState(viewpointid) {
            if (viewpointid.indexOf("standardLibs") != -1) {
                $(".modelBar > i.m-camera").css("color", "rgba(255,255,255,.2)");
                $(".modelBar > i.m-camera").attr("data-noclick", true);
                $(".modelBar > i.m-camera").removeClass('bar-item');
            }
        }
        
        setCameraState(window.location.search);
        App.Project.Settings.Viewer.on("loaded", function () {
            var viewpointid = window.location.search;
            var t1 = null;
            if (viewpointid.indexOf("viewpointid") != -1) {
                function initializeViewCallback() {
                    var viewpointidStr = viewpointid.substr(viewpointid.indexOf("viewpointid") + 12);
                    App.Project.Settings.Viewer.viewer.setCamera(window.atob(viewpointidStr));
                    App.Project.Settings.Viewer.viewer.render();
                    window.clearTimeout(t1);
                }
                
                t1 = window.setTimeout(initializeViewCallback, 500);
            }
            $('#lockAxisZ').show();
            // debugger;
            // App.Project.Settings.Viewer.zoomToBuilding(-1, 1.15);
            // debugger;
            // App.Project.Settings.Viewer.fit();//fit是把图形缩放到图形可是大小
            // App.Project.Settings.Viewer.zoomToBuilding(-0.3,1.0);
        });
        App.Project.Settings.Viewer.on("click", function (model) {
            var selectedIds = App.Project.Settings.Viewer.getSelectedIds(),
                viewer = App.Project.Settings.Viewer,
                isIsolateState = viewer.isIsolate(),
                selectedIds = viewer.getSelectedIds();
            if (isIsolateState) {
                $('#isolation').show();
            } else {
                $('#isolation').hide();
            }
            if (!model.intersect) {
                App.Project.renderAttr(App.Project.Settings.typeId, 2);
                if (selectedIds) {
                    var obj,
                        arr = [];
                    if (Object.keys(selectedIds).length == 1) {
                        for (var i in selectedIds) {
                            obj = {
                                userId: i,
                                sceneId: selectedIds[i]['sceneId']
                            }
                        }
                        //App.Project.Settings.ModelObj = {
                        //	intersect: {
                        //		userId:obj.userId,
                        //		object:{
                        //			userData:{
                        //				sceneId:obj.sceneId
                        //			}
                        //		}
                        //	}
                        //
                        //};
                        //that.viewerPropertyRender();
                        App.Project.renderAttr(obj.userId);
                    } else {
                        for (var i in selectedIds) {
                            if (arr[0]) {
                                if (arr[0] != selectedIds[i]['classCode']) {
                                    $('.designProperties').html('<div class="nullTip">' +
                                        (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                                        '</div>');
                                    return;
                                }
                            } else {
                                arr[0] = selectedIds[i]['classCode']
                            }
                        }
                        var uid = Object.keys(selectedIds)[0],
                            info = selectedIds[uid];
                        obj = {
                            userId: uid,
                            sceneId: info['sceneId']
                        };
                        //App.Project.Settings.ModelObj = {
                        //	intersect: {
                        //		userId:obj.userId,
                        //		object:{
                        //			userData:{
                        //				sceneId:obj.sceneId
                        //			}
                        //		}
                        //	}
                        //
                        //};
                        App.Project.renderAttr(obj.userId);
                    }
                } else {
                    $('.designProperties').html('<div class="nullTip">' +
                        (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                        '</div>');
                }
                $('.designProperties').html('<div class="nullTip">' +
                    (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                    '</div>');
                return;
            } else if (Object.keys(selectedIds).length > 1) {
                $('.designProperties').html('<div class="nullTip">' +
                    (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                    '</div>');
                return;
                // var arr = [];
                // for(var i in selectedIds){
                // 	if(arr[0]){
                // 		if(arr[0] != selectedIds[i]['classCode'] ){
                // 			$('.designProperties').html('<div class="nullTip">请选择构件</div>');
                // 			return;
                // 		}
                // 	}else{
                // 		arr[0] = selectedIds[i]['classCode']
                // 	}
                // }
            }
            //渲染属性
            App.Project.renderAttr(model.intersect.userId);
        });
        App.Project.Settings.Viewer.on('empty', function () {
            $('.tips span').html('无法三维预览，请<a href="javascript:;" onclick="App.Project.downLoad();" style="font-size:20px;text-decoration:underline;color:#CFCFCF;" data-i18n="data.drawing-model.Download">下载</a>' +
                (App.Local.data['drawing-model'].Check || '查看') +
                '');
        })
    },
    resetModelNull() {
        $('.designProperties').html('<div class="nullTip">' +
            (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
            '</div>');
    },
    //渲染dwg 文件
    renderDwg(modelId) {
        var _this = this;
        $("#modelBox").addClass("dwg");
        App.Project.Settings.Viewer = new dwgViewer({
            element: $("#modelBox"),
            isComment: true,
            sourceId: modelId,
            callback: function () {
                var viewpointid = window.location.search;
                var fileVersionName = $(".header .text").text();
                if (!_this.isBimControl && (fileVersionName.indexOf("已移交") < 0)) {
                    $(".modelBar > i.m-camera").css("color", "rgba(255,255,255,.2)");
                    $(".modelBar > i.m-camera").attr("data-noclick", true);
                    $(".modelBar > i.m-camera").removeClass('bar-item');
                }
                if (viewpointid.indexOf("standardLibs") !== -1 || viewpointid.indexOf("famLibs") !== -1) {
                    $(".modelBar > i.m-camera").css("color", "rgba(255,255,255,.2)");
                    $(".modelBar > i.m-camera").attr("data-noclick", true);
                    $(".modelBar > i.m-camera").removeClass('bar-item');
                }
            }
        });
    },
    //模型属性 dwg 图纸
    attrDwg: function () {
        var that = this,
            attrDwgBoxDom, modleShowHide, modleListDom,
            url = '/doc/' + App.Project.Settings.projectId + '/' + App.Project.Settings.projectVersionId + '/file/tag',
            liTpl = '<li class="modleItem"><a data-id="<%=id%>" href="/static/dist/app/project/single/filePreview.html?id=' +
                '{id}' +
                '&projectId=' + App.Project.Settings.projectId + '&projectVersionId=' + App.Project.Settings.projectVersionId + '" target="_blank" ><div class="modleNameText overflowEllipsis modleName2">varName</div></a></li>';
        $.ajax({
            url: url,
            data: {
                modelId: App.Project.Settings.modelId
            }
        }).done(function (data) {
            if (data.code == 0) {
                if (data.data.length > 0) {
                    var lis = '';
                    $.each(data.data, function (i, item) {
                        lis += liTpl.replace("varName", item.name).replace('{id}', item.fileVersionId);
                    });
                    //start 张延凯修改 初始化的时候视图的默认关闭状态
                    attrDwgBoxDom = $("#projectContainer .attrDwgBox");
                    attrDwgBoxDom.show();
                    modleShowHide = attrDwgBoxDom.find(".modleShowHide");
                    modleListDom = attrDwgBoxDom.find(".modleList");
                    modleListDom.html(lis);
                    modleListDom.css("display", 'none');
                    if (modleShowHide.hasClass('down')) {
                        modleShowHide.removeClass('down');
                    }
                    //end 张延凯修改 初始化的时候视图的默认关闭状态
                    // $("#projectContainer .attrDwgBox").show().find(".modleList").html(lis);//张延凯修改
                }
            }
        });
    },
    templateCache: [],
    //获取模板根据URL
    templateUrl: function (url, notCompile) {
        if (!App.time) {
            App.time = +new Date();
        }
        if (url.substr(0, 1) == ".") {
            url = "/static/dist/tpls" + url.substr(1);
        } else if (url.substr(0, 1) == "/") {
            url = "/static/dist/tpls" + url;
        }
        if (App.Project.templateCache[url]) {
            return App.Project.templateCache[url];
        }
        var result;
        $.ajax({
            url: url + '?t=' + App.time,
            type: 'GET',
            async: false
        }).done(function (tpl) {
            if (notCompile) {
                result = tpl;
            } else {
                result = _.template(tpl);
            }
        });
        App.Project.templateCache[url] = result;
        return result;
    },
    //type 1 轴 其他属性 2 changeType
    renderAttr(elementId, type) {
        var url = "/sixD/" + App.Project.Settings.projectId + "/" + App.Project.Settings.projectVersionId + "/property",
            that = this;
        $.ajax({
            url: url,
            data: {
                elementId: elementId,
                sceneId: App.Project.Settings.modelId
            }
        }).done(function (data) {
            var template = App.Project.templateUrl("/projects/tpls/project/design/project.design.property.properties.html"),
                html = template(data.data);
            that.attrDwg(elementId);
            if (type == 1) {
                App.Project.Settings.famHtml = html;
            } else {
                if (type == 2) {
                    if (App.Project.Settings.famHtml) {
                        $("#projectContainer .designProperties").html(App.Project.Settings.famHtml);
                        $("#projectContainer .designProperties").append(html);
                    } else {
                        App.Project.Settings.axisHtm = html;
                        App.Project.renderAxisComm();
                    }
                } else {
                    $("#projectContainer .designProperties").html(html);
                }
            }
        });
    },
    //渲染轴公共
    renderAxisComm() {
        
        //定时监听 是否返回
        App.Project.Settings.timer = setTimeout(function () {
            clearTimeout(App.Project.Settings.timer);
            if (App.Project.Settings.famHtml) {
                //公共信息
                $("#projectContainer .designProperties").html(App.Project.Settings.famHtml);
                //本身信息
                $("#projectContainer .designProperties").append(App.Project.Settings.axisHtm);
            } else {
                App.Project.renderAxisComm();
            }
        }, 200);
    },
    //渲染模型
    renderModel: function () {
        if (!this.isBimControl) {
            var Request = App.Project.GetRequest();//获取到地址里面的参数
            this.getFileVersionListHandle(Request);//首次获取文件版本列表方法
        } else {
            this.getModelId();
            this.bindEvent();
        }
    },
    getFileVersionListHandle(Request) {//首先获取文件版本列表方法
        var _this = this;
        var data = {
            URLtype: "getFileVersionList",
            data: {
                projectId: Request.projectId,
                versionId: Request.projectVersionId
            }
        }
        var url = App.Project.getUrlByType(data).url;
        $.ajax({
            url: url,
            data: {
                fileVersionId: Request.id
            }
        }).done(function (data) {
            if (data.code == "0") {
                var applyUser = data.data.applyUser,//是否是发起人和平常用户
                    versionList = data.data.turnKeyChangeDwgVersionResultList,//版本列表
                    fileVersionHistory = "",//判断第一个是否是已移交
                    fileVersionName = "",//用户显示版本名称的字段
                    getFileId = "",//用于获取文件的id
                    fileName = "";//=文件的名字
                App.Project.Settings.versionDatas = data.data.turnKeyChangeDwgVersionResultList;//渲染版本列表的数据
                App.Project.Settings.versionDatas.map(function (val, key) {
                    return val.fileId = Request.id;
                });
                if (!Request.viewpointId) {
                    if (!Request.fileVersionHistory) {
                        if (localStorage.getItem("turnkey") !== "false") {
                            getFileId = versionList[0].version[0].fileVersionId;
                            fileName = versionList[0].version[0].fileName;
                            fileVersionName = versionList[0].version[0].fileVersionHistory;
                        } else if (applyUser) {//如果是发起人默认取第一个就行了或者是跳转过来的
                            getFileId = versionList[0].version[0].fileVersionId;
                            fileName = versionList[0].version[0].fileName;
                            fileVersionName = versionList[0].version[0].fileVersionHistory;
                        } else {
                            for (let x = 0, xLen = versionList.length; x < xLen; x++) {
                                let versionListX = versionList[x].version;
                                for (let y = 0, yLen = versionListX.length; y < yLen; y++) {
                                    let versionListY = versionListX[y];
                                    fileVersionHistory = versionListY.fileVersionHistory;
                                    if (fileVersionHistory.indexOf("已移交") > 0) {//判断第一个是否是已移交
                                        getFileId = versionListY.fileVersionId;
                                        fileName = versionListY.fileName;
                                        fileVersionName = versionListY.fileVersionHistory;
                                        break;
                                    } else {
                                        getFileId = versionList[0].version[0].fileVersionId;
                                        fileName = versionList[0].version[0].fileName;
                                        fileVersionName = versionList[0].version[0].fileVersionHistory;
                                    }
                                }
                            }
                        }
                    } else {
                        getFileId = Request.fileVersionId;
                        fileVersionName = decodeURI(Request.fileVersionHistory);
                        fileName = decodeURI(Request.fileName);
                    }
                } else {
                    let versionDataArr = data.data.turnKeyChangeDwgVersionResultList;
                    for (let i = 0, iLen = versionDataArr.length; i < iLen; i++) {
                        let versionArrData = versionDataArr[i].version;
                        for (let j = 0, jLen = versionArrData.length; j < jLen; j++) {
                            if (versionArrData[j].fileVersionId == Request.id) {
                                getFileId = Request.id;
                                fileVersionName = versionArrData[j].fileVersionHistory;
                                fileName = versionArrData[j].fileName;
                                break;
                            }
                        }
                    }
                }
                App.Project.getModelId(getFileId);
                if (!_this.isBimControl) {
                    $(".header .text").text("图纸版本：" + fileVersionName);
                    $(".header .name").text("名称：" + fileName);
                } else {
                    $(".header .name").text(fileName);
                }
                _this.bindEvent();
            } else {
                $.tip({
                    message: data.message,
                    timeout: 1500,
                    type: "alarm"
                })
            }
        })
    },
    //下载
    downLoad() {
        var Request = App.Project.GetRequest();
        // //请求数据
        var data = {
            URLtype: "downLoad",
            data: {
                projectId: Request.projectId,
                projectVersionId: Request.projectVersionId
            }
        };
        var data = App.Project.getUrlByType(data);
        var url = data.url + "?fileVersionId=" + App.Project.Settings.Model.data.fileVersionId;
        window.location.href = url;
    },
    //收起和暂开
    navBarToggle: function ($el, $content, dirc, Viewer) {
        var dircWidth, mDirc;
        if (dirc == "left") {
            mDirc = "margin-left";
        } else {
            mDirc = "margin-right";
        }
        dircWidth = parseInt($el.css(mDirc));
        if (dircWidth < 0) {
            var ani = {}
            ani[mDirc] = "0px";
            $el.animate(ani, 500, function () {
                $el.find(".dragSize").show().end().find(".slideBar i").toggleClass('icon-caret-left icon-caret-right');
                $content.css(mDirc, $el.width());
                if (Viewer) {
                    //Viewer.resize(); note by wuweiwei
                }
            });
        } else {
            var width = $el.width(),
                ani = {};
            ani[mDirc] = -width;
            $el.animate(ani, 500, function () {
                $el.find(".dragSize").hide().end().find(".slideBar i").toggleClass('icon-caret-left icon-caret-right');
                $content.css(mDirc, 0);
                if (Viewer) {
                    
                    //Viewer.resize(); note by wuweiwei
                }
            });
        }
    },
    //拖拽改变尺寸
    dragSize: function (event, $el, $content, dirc, Viewer) {
        var initX = event.pageX,
            isLeft = dirc == "left" ? true : false,
            initWidth = $el.width();
        var $target = $(event.target);
        $(document).on("mousemove.dragSize", function (event) {
            var newWidth;
            if (isLeft) {
                newWidth = initWidth + event.pageX - initX;
            } else {
                newWidth = initWidth + initX - event.pageX;
            }
            $el.width(newWidth);
        });
        $(document).on("mouseup.dragSize", function () {
            $(document).off("mouseup.dragSize");
            $(document).off("mousemove.dragSize");
            var contentWidth = $content.width(),
                leftNavWidth = $el.width(),
                gap = leftNavWidth - initWidth;
            var mPos = "margin-right";
            if (isLeft) {
                mPos = "margin-left";
            }
            if (contentWidth - gap < 10) {
                var maxWidth = initWidth + contentWidth - 10;
                $el.width(maxWidth);
                $content.css(mPos, maxWidth);
            } else {
                $content.css(mPos, leftNavWidth);
            }
            if (Viewer) {
                Viewer.resize();
            }
        });
        return false;
    },
    bindEvent() {
        var that = this;
        //下载
        $(".header .downLoad").on("click", function () {
            App.Project.downLoad();
        });
        var $projectContainer = $("#projectContainer");
        var $breadItem = $(".breadItem");
        //收起 暂开 属性内容
        $projectContainer.on("click", ".modleShowHide", function () {
            $(this).toggleClass("down");
            var $modleList = $(this).parent().parent().find(".modleList");
            $modleList.slideToggle();
        });
        //收起 暂开 属性
        $projectContainer.on("click", ".slideBar", function () {
            that.navBarToggle($("#projectContainer .rightProperty"), $("#modelBox"), "right", App.Project.Settings.Viewer);
        });
        //拖拽 属性内容
        $projectContainer.on("mousedown", ".dragSize", function (event) {
            that.dragSize(event, $("#projectContainer .rightProperty"), $("#modelBox"), "right", App.Project.Settings.Viewer);
        });
        if (!this.isBimControl) {
            $breadItem.on("click", function (evt) {
                var $target = $(event.target).closest(".breadItem");
                if ($target.hasClass('projectVersion')) {
                    var $projectVersionList = $(".breadItem .projectVersionList");
                    if (!$projectVersionList.is(":hidden")) {
                        return;
                    }
                    $projectVersionList.find(".loading").show();
                    $projectVersionList.find(".listContent").hide();
                    $projectVersionList.show();
                    //渲染列表
                    console.log(App.Project.Settings.versionDatas)
                    var $projectVersionList = $(".breadItem .projectVersionList");
                    var template = _.templateUrl("/app/project/single/tpls/project.container.file.version.html");
                    $projectVersionList.find(".container").html(template(App.Project.Settings.versionDatas));
                    $projectVersionList.find(".loading").hide();
                    $projectVersionList.find(".listContent").show();
                }
                return false;
            })
            var setTimeoutId = "";
            $(".txtSearch").on("keyup", function (e) {
                var target = $(e.target);
                var targetVal = target.val().trim();
                clearTimeout(setTimeoutId);
                setTimeoutId = setTimeout(function () {
                    that.filterVersionListHandle(targetVal);//筛选版本列表方法
                }, 400)
                return false;
            })
            $(".header").on("click", function (evt) {
                that.listSlideUpAndDown(evt);//版本列表的折叠与打开
            })
            $(document).on("click", function (event) {
                var $target = $(event.target);
                //面包屑 项目版本
                if ($target.closest(".breadItem.projectVersion").length <= 0) {
                    $(".breadItem .projectVersionList").find(".txtSearch").val("").end().hide();
                }
            });
        }
    },
    filterVersionListHandle(filterVal) {//筛选版本列表方法
        let projectVersionList = $(".breadItem .projectVersionList");
        let template = _.templateUrl("/app/project/single/tpls/project.container.file.version.html");
        let filterVersionArr = App.Project.Settings.versionDatas;//默认的版本列表数据
        let filterArr = [];//筛选之后的数组
        if (filterVal.length <= 0) {
            projectVersionList.find(".container").html(template(filterVersionArr));
        } else {
            for (let i = 0, iLen = filterVersionArr.length; i < iLen; i++) {
                let fileVersionArr = [];//筛选出来的数组
                let fileObj = {};
                let versionItem = filterVersionArr[i];
                let versionItemVersion = versionItem.version;
                for (let j = 0, jLen = versionItemVersion.length; j < jLen; j++) {
                    let item = versionItemVersion[j];
                    var itemNameLo = item.fileVersionHistory.toLowerCase();
                    var itemNameUp = item.fileVersionHistory.toUpperCase();
                    if (itemNameLo.indexOf(filterVal) > -1) {
                        fileVersionArr.push(item);
                    } else if (itemNameUp.indexOf(filterVal) > -1) {
                        fileVersionArr.push(item);
                    }
                }
                if (fileVersionArr.length > 0) {
                    fileObj.date = versionItem.date;
                    fileObj.fileId = versionItem.fileId;
                    fileObj.version = fileVersionArr;
                }
                if (JSON.stringify(fileObj) !== "{}") {
                    filterArr.push(fileObj);
                }
            }
            projectVersionList.find(".container").html(template(filterArr));
        }
    },
    listSlideUpAndDown(evt) { //版本列表的折叠与打开
        var target = $(evt.target);
        var targetPar = target.parent();
        if (targetPar.hasClass('versionNoheader')) {
            evt.stopPropagation();
            var targetParSib = targetPar.siblings();
            if (targetParSib.hasClass("versionNoheaderShow")) {
                targetParSib.removeClass("versionNoheaderShow");
            }
            if (targetPar.hasClass("versionNoheaderShow")) {
                targetPar.removeClass("versionNoheaderShow");
            } else {
                targetPar.addClass("versionNoheaderShow");
            }
        }
    },
    init() {
        var hrefStr = window.location.href;
        var indexOfVal = hrefStr.indexOf("isBimControl");//viewpointId
        if (indexOfVal > 0) {
            var isBimControl = hrefStr.substr(indexOfVal + 13);
            if (isBimControl === "false") {
                this.isBimControl = false;
            } else {
                $(".breadcrumbNav .breadItem").hide();
                this.isBimControl = true;
            }
        } else if (indexOfVal == -1) {
            $(".breadcrumbNav .breadItem").hide();
            this.isBimControl = true;
        }
        if (App.Comm.getCookie("isDemoEnv") != "yes") {
            App.Comm.commentDragRenderHandle(); //右侧拖拽按钮点击事件
        }
        ;
        if (this.isIEModel()) {
            return;
        }
        //渲染模型
        App.Project.renderModel();
    }
}
;
(function () {
    if (typeof(bimView) == "undefined") {
        bimView = {
            sidebar: {}
        }
    }
    //重写批注方法
    bimView.sidebar.comment = function () {
        //隐藏工具条
        $(".bim .modelBar").hide();
        //开始批注
        App.Project.Settings.Viewer.comment();
        //禁止 二次 点击
        if ($("#topSaveTip").length > 0) {
            return;
        }
        var topSaveHtml = App.Project.templateUrl('/libsH5/tpls/comment/bimview.top.save.tip.html', true);
        $(".bim .commentBar").append(topSaveHtml);
        $('body').localize();
        //事件初始化
        if ($(".m-camera").hasClass("selected")) {
            SingleComment.initEvent();
        }
    }
    if (typeof(dwgViewer) == "undefined") {
        dwgViewer = {
            prototype: {}
        };
    }
    dwgViewer.prototype.comment = function () {
        this.dwgView.commentInit()
        //隐藏工具条
        $(".bim .modelBar").hide();
    }
    //取消批注
    dwgViewer.prototype.canelComment = function () {
        $(".bim .modelBar").show();
    }
    //保存批注
    dwgViewer.prototype.saveCommentDwg = function () {
        var that = this;
        this.dwgView.getCommentData(function (object) {
            var data = {};
            data.image = object.commentData.image.replace('data:image/png;base64,', '');
            that.data = data;
            SingleComment.saveCommentDialog();
            /*
            data.image = data.image.replace('data:image/png;base64,', '');
            that.data = data;
            SingleComment.saveCommentDialog();
            */
        });
    }
    dwgViewer.prototype.getData = function () {
        return this.data;
    }
    var SingleComment = {
        initEvent: function () {
            var $topSaveTip = $("#topSaveTip"),
                that = this;
            //取消
            $topSaveTip.on("click", ".btnCanel", function () {
                App.Project.Settings.Viewer.commentEnd();
                if ($(".modelBar > i.m-camera").hasClass("selected")) {
                    $(".modelBar > i.m-camera").removeClass("selected")
                }
                //显示
                $(".bim .modelBar").show();
            });
            //保存
            $topSaveTip.on("click", ".btnSave", function () {
                that.saveCommentDialog();
            });
        },
        //保存批注
        saveCommentDialog: function () {
            //批注信息
            //var data = App.Project.Settings.Viewer.saveComment && App.Project.Settings.Viewer.saveComment() || App.Project.Settings.Viewer.getData();
            that = this;
            var commentDialogCallback = function (data, param) {
                var pars = {
                    cate: "viewPoint",
                    img: data.image
                }
                var dialogHtml = App.Project.templateUrl('/libsH5/tpls/comment/bimview.save.dialog.html')(pars),
                    opts = {
                        title: (App.Local.data['drawing-model'].Save || "保存快照"),
                        width: 500,
                        height: 250,
                        cssClass: "saveViewPoint",
                        okClass: "btnWhite",
                        cancelClass: "btnWhite",
                        okText: (App.Local.data['drawing-model'].Save || "保存"),
                        closeCallback: function () {
                            
                            //App.Project.Settings.Viewer.commentEnd();
                            //显示
                            //$(".bim .modelBar").show();
                        },
                        cancelText: (App.Local.data['drawing-model'].SSe || "保存并分享"),
                        message: dialogHtml,
                        okCallback: () => {
                            that.saveComment("save", dialog, data);
                            return false;
                        },
                        cancelCallback() {
                            //保存并分享
                            that.saveComment("share", dialog, data, SingleComment.shareViewPoint);
                            return false;
                        }
                    },
                    dialog = new App.Dialog(opts),
                    $viewPointType = dialog.element.find(".viewPointType");
                dialog.type = 1;
                //视点类型
                $viewPointType.myDropDown({
                    click: function ($item) {
                        var type = $item.data("type");
                        if (type == 0) {
                            $viewPointType.find(".modelicon").removeClass('m-unlock').addClass('m-lock');
                        } else {
                            $viewPointType.find(".modelicon").removeClass('m-lock').addClass('m-unlock');
                        }
                        dialog.type = type;
                    }
                });
            } //end function
            var data, pars;
            if (App.Project.Settings.Viewer.getData != undefined) {
                data = App.Project.Settings.Viewer.getData();
                commentDialogCallback(data);
            } else {
                App.Project.Settings.Viewer.saveComment(commentDialogCallback);
            }
        },
        //保存批注
        saveComment(type, dialog, commentData, callback) {
            var dwgView = App.Project.Settings.Viewer.dwgView;
            if (dwgView != undefined) {
                var dwgState = {
                    left: dwgView.__sceneInViewPoint.left,
                    top: dwgView.__sceneInViewPoint.top,
                    scale: dwgView.__zoomScale,
                    level: dwgView.__curLevel,
                    curBuJu: dwgView.__curBuJu,
                    device: "PC"
                };
            }
            if (dialog.isSubmit) {
                return;
            }
            var $element = dialog.element,
                pars = {
                    projectId: App.Project.Settings.projectId,
                    projectVersionId: parseInt(App.Project.Settings.projectVersionId),
                    name: dialog.element.find(".name").val().trim(),
                    type: dialog.type,
                    viewPoint: commentData.camera || JSON.stringify(dwgState)
                };
            if (!pars.name) {
                $.tip({
                    message: (App.Local.data['drawing-model'].Pdt || "请输入快照描述"),
                    timeout: 3000,
                    type: "alarm"
                });
                return false;
            }
            var url = '/sixD/{projectId}/viewPoint?fileId=' + App.Project.Settings.fileId + "&fileVersionId=" +
                App.Project.Settings.fileVersionId + "&suffix=" + App.Project.Settings.suffix,
                data = {
                    url: url,
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
            App.ajax(data, (data) => {
                if (data.code == 0) {
                    localStorage.setItem("NotesDatas", undefined);
                    data = data.data;
                    //赋值id
                    commentData.id = data.id;
                    //保存 图片 canvas filter
                    $.when(this.saveImage({
                            id: data.id,
                            img: commentData.image
                        }),
                        this.saveAnnotation(commentData)).done((imgData, annotationData) => {
                        imgData = imgData[0];
                        annotationData = annotationData[0];
                        //成功
                        if (imgData.code == 0 && annotationData.code == 0) {
                            
                            //关闭弹出层 取消编辑状态
                            dialog.close();
                            //显示
                            App.Project.Settings.Viewer.commentEnd();
                            //显示
                            $(".bim .modelBar").show();
                            $("#topSaveTip .btnCanel").click();
                            if ($.isFunction(callback)) {
                                callback(imgData.data);
                            }
                        }
                    });
                    if ($(".modelBar > i.m-camera").hasClass("selected")) {
                        $(".modelBar > i.m-camera").removeClass("selected")
                    }
                } else {
                    //失败
                    alert('超过了最大字数512' || data.message);
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
            console.log("保存图纸批注");
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
                    url: "/sixD/{projectId}/viewPoint/{viewPointId}/annotation",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(pars)
                }
            return App.ajax(data);
        },
        //分享视点
        shareViewPoint(obj) {
            obj.pic = "/" + obj.pic;
            var data = {
                url: '/sixD/sharedViewpoint',
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify({
                    projectId: App.Project.Settings.projectId,
                    projectVersionId: App.Project.Settings.projectVersionId,
                    viewpointId: obj.id
                })
            }
            App.ajax(data, function (data) {
                if (data.code == 0) {
                    // obj.url = "http://" + location.host + "/#projects/" + data.data.projectId + "/" + data.data.projectVersionId + "?share=true&viewpointId=" + obj.id + "&projectId=" + App.Project.Settings.projectId + "&currentPageNum=";
                   obj.url = "http://" + location.host + "/page/share.html?projectId="+data.data.projectId+"&projectVersionId="+data.data.projectVersionId+"&viewpointId="+obj.id+"&fileVersionId="+obj.fileVersionId;
                    var dialogHtml = App.Project.templateUrl('/libsH5/tpls/comment/bimview.share.dialog.html')(obj),
                        opts = {
                            title: (App.Local.data['drawing-model'].Share || "分享快照"),
                            width: 500,
                            height: 250,
                            cssClass: "saveViewPoint",
                            isConfirm: false,
                            message: dialogHtml
                        },
                        dialog = new App.Dialog(opts),
                        $btnCopy = dialog.element.find(".btnCopy");
                    //h5 复制
                    var clipboard = new Clipboard(".saveViewPoint .btnCopy");
                    clipboard.on('success', function (e) {
                        $.tip({
                            message: (App.Local.data['drawing-model'].Yhk || "您已经复制了链接地址"),
                            timeout: 3000
                        });
                        e.clearSelection();
                    });
                }
            });
        },
    }
})()