//@ sourceURL=App.Projects.ProjectFileList.js
App.Projects = App.Projects || {};
App.Projects.ProjectFileList = {
    defaults: {
        folderName: "",
        versionName: "",
        totalItemCount: "",
        projectName: "",
        projectId: "",
        projectVersionId: "",
        folderId: "",
        pageIndex: 1,
        flag: true,
        searchCan: false,
        searchBool: false,
        versionType: 1,
        returnBackId: "",
        crumbsData: [],
        versionPData: [],
        versionCData: [],
        versionStatus: {
            "1": "待上传",
            "2": "上传中",
            "3": "待审核",
            "4": "审核中",
            "5": "审核通过",
            "6": "审核退回",
            "7": "待移交",
            "8": "移交退回",
            "9": "已移交",
            "10": "待审核",
            "11": "审核通过",
            "12": "审核退回",
            "13": "待移交",
            "14": "移交退回",
            "15": "申请中"
        }
    },
    init: function (args) {
        var _this = this;
        App.Projects.ProjectFileList.defaults.folderName = "";
        App.Projects.ProjectFileList.defaults.projectName = args.projectName;
        App.Projects.ProjectFileList.defaults.projectId = args.projectId;
        App.Projects.ProjectFileList.defaults.projectVersionId = args.versionId;
        App.Projects.ProjectFileList.defaults.folderId = args.folderId ? args.folderId : "";
        App.Projects.ProjectFileList.defaults.returnBackId = args.folderId ? args.folderId : "";
        App.Projects.ProjectFileList.defaults.searchBool = false;
        App.defaults.SearchHeightVar = "";
        this.initHtml();//
        $(function () {
            _this.getProjectInfo(args);//获取项目信息
        })
    },
    initHtml: function () {
        App.TitleBar.setTitle(App.replaceXingHaoHandle(App.Projects.ProjectFileList.defaults.projectName));
        App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
        App.TitleBar.showHomeBtn() //显示home图片
        App.hideMainMenu();//隐藏底部导航栏
        $("#mainContainer").css("padding-bottom", 0);
    },
    getProjectInfo: function (args) {//获取项目信息
        var _this = this;
        var data = {
            projectId: App.Projects.ProjectFileList.defaults.projectId,
            versionId: App.Projects.ProjectFileList.defaults.projectVersionId,
        }
        this.initHandle(args);//初始化方法
        this.searchInit();//初始化搜索方法
        this.crumbsDomHandle();//面包屑方法
        this.loadFolderListData().then(function (data) {
            $('.fileList_common').on('click', 'a', function () {
                if ($(this).attr('href').includes('javascript:;') || App.Comm.disableOpen($(this))) {
                    var Dlg1 = App.UI.Dialog.showMsgDialog({
                        title: "提示",
                        text: App.Comm.isConverting($(this)) ? '文件转化中，暂不支持查看' : "该文件不支持在线查看",
                        okText: "确定",
                        onok: function () {
                            return;
                        },
                    });
                    $(Dlg1.dialog).find(".commDialogCancel").css("display", "none");
                    $(Dlg1.dialog).find(".commDialogOk").css("width", "100%");
                    return false;
                }
            });
        });
        //加载项目列表方法
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.getProjectInfo,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    _this.loadNotesData();//加载批注个数的方法
                    App.defaults.isBimControl = data.data.isBimControl;
                    if (data.data.isBimControl == 2) {
                        $("#versionText").html("当前版本");
                        $(".projectVersionBox").css("background", "none").off("click");
                    } else {
                        _this.loadVersionName();//加载最新版本的方法
                    }
                } else {
                    alert("获取项目信息失败：" + JSON.stringify(data));
                }
            }
        });
    },
    searchInit: function () {//搜索初始化方法
        var _this = this;
        $("#searchBtn").on("click", function () {
            var searchVal = $("#searchInput").val().trim();
            App.Projects.ProjectFileList.defaults.folderName = searchVal;
            if (App.Projects.ProjectFileList.defaults.searchCan) {
                $("#searchCommonBox").css("padding-top", "3.5726rem").css("display", "block");
                App.Projects.ProjectFileList.defaults.searchBool = true;
                _this.loadFolderListData();//执行搜索获取数据
            }
        })
        $("#searchInput").on("keyup", function (evt) {
            var targetVal = $(evt.target).val().trim();
            if (targetVal.length > 0) {
                $("#clearSearchVal").css("display", "block");
            }
        }).on('focus', function () {
            setTimeout(function () {
                debugger;
                window.scrollTo(0, 0);
                // $('#mainHeader').hide(0, function () {
                //     $(this).show()
                // })
            }, 400)
        })
        $("#clearSearchVal").on("click", function () {
            App.Projects.ProjectFileList.defaults.folderName = "";
            $(this).hide();
            $("#searchInput").val("");
        })
        $("#clearSearchBtn").on("click", function () {
            $("#searchCommonBox").css("display", "none");
            $("#clearSearchVal").css("display", "none");
            $("#searchListBox").html("");
            $("#searchInput").val("");
            App.Projects.ProjectFileList.defaults.folderName = "";
        })
    },
    suc: function () {
        $('.m_versionBgBox').click()
        cordova.exec(this.suc, this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);
    },
    fail: function () {

    },
    initHandle: function (args) {//初始化的方法
        var _this = this;
        var projectVersionBox = $(".projectVersionBox");
        projectVersionBox.on("click", function () {//点击版本执行的的方法
            var m_versionBgBox = $('<div class="m_versionBgBox"></div>');
            var m_versionBox = $('<div class="m_versionBox"><div class="m_versionTabBox border-bottom-color"><ul id="m_tab_box"><li data-version="1" class="m_selectTab">发布版本<span></span></li><li data-version="2">变更版本<span></span></li></ul></div><div class="m_versionSearchBox"><div class="m_common_search border-bottom-color"><div class="m_common_search_relative"><div class="m_common_search_input_box"><i></i><input id="searchVersionInput" type="text" name="" placeholder="关键字"><span id="clearVersion"></span><button id="searchVersionBtn" class="border-no-color">搜索</button></div><div class="m_common_search_relative_btn"></div></div></div></div><div class="m_versionListBox"><div class="loading">加载中...</div><div class="m_versionListScrollBox"><ul id="m_versionComponetBox"></ul><div class="nullData"><div class="nullDataImg"></div><p>暂时还没有任何内容哦～</p></div></div></div></div>');
            $("body").append(m_versionBgBox);
            $("body").append(m_versionBox);
            var osStr = navigator.userAgent;
            var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
            var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid && !isiOS) {
                cordova.exec(_this.suc, _this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "true" }]);//注册返回键事件
            }
            setTimeout(function () {
                m_versionBox.addClass('m_versionBox_show');
                _this.loadVersionData();//加载版本列表的方法
            }, 50);
            m_versionBgBox.on("click", function () {
                m_versionBox.removeClass('m_versionBox_show');
                if (isAndroid && !isiOS) {
                    cordova.exec(this.suc, this.fail, "WDClosePicturePlugin", "closePicture", [{ "isClose": "false" }]);//注册返回键事件
                }
                setTimeout(function () {
                    App.Projects.ProjectFileList.defaults.versionType = 1;
                    App.Projects.ProjectFileList.defaults.versionPData = [];
                    App.Projects.ProjectFileList.defaults.versionCData = [];
                    $("#searchVersionInput").val('');
                    m_versionBgBox.remove();
                    m_versionBox.remove();
                }, 50);
            })
            $("#clearVersion").on("click", function () {
                $(this).hide();
                $("#searchVersionInput").val("");
            })
            $("#searchVersionInput").on("keyup", function (evt) {
                var targetVal = $(evt.target).val().trim();
                if (targetVal.length > 0) {
                    $("#clearVersion").css("display", "block");
                }
            })
            $("#m_tab_box").on("click", "li", function (evt) {
                var target = $(evt.target);
                var versionType = target.data("version");
                if (!target.hasClass('m_selectTab')) {
                    target.siblings().removeClass('m_selectTab').end().addClass('m_selectTab');
                    App.Projects.ProjectFileList.defaults.versionType = versionType;
                    $("#clearVersion").hide();
                    $("#searchVersionInput").val('');
                    var m_versionListBox = $(".m_versionListBox");
                    m_versionListBox.find(".loading").show();
                    m_versionListBox.find(".m_versionListScrollBox ul").hide();
                    _this.initVersionHandle();//切换标签之后执行的方法
                }
            })
            $("#m_versionComponetBox").on("click", "li", function (evt) {
                var target = $(evt.target).closest("li");
                var versionid = target.data("versionid");
                var versionName = target.html();
                var versionText = $("#versionText");
                var locationStr = "#/project/{{projectId}}/{{projectVersionId}}/{{projectName}}/{{folderId}}";
                if (versionid) {
                    locationStr = locationStr.replace("{{projectId}}", args.projectId);
                    locationStr = locationStr.replace("{{projectVersionId}}", versionid);
                    locationStr = locationStr.replace("{{projectName}}", args.projectName);
                    locationStr = locationStr.replace("{{folderId}}", args.folderId ? args.folderId : "");
                    location.href = locationStr;
                    m_versionBgBox.click();
                    // App.Projects.ProjectFileList.defaults.projectVersionId = versionid;
                    // versionText.html(versionName);
                    // m_versionBgBox.click();
                    // _this.loadFolderListData();//加载项目列表方法
                    // _this.loadNotesData();//加载批注个数的方法
                    // _this.initNotersHref();////初始化批注列表链接的地址
                }
            });
            $("#searchVersionBtn").on("click", function () {//版本搜索功能
                var searchVersionInputVal = $("#searchVersionInput").val().trim();
                _this.initVersionHandle(searchVersionInputVal);//搜索版本功能
            })
        })
        $("#fileList").on("click", function (evt) {
            var target = $(evt.target).closest("a");
            var hrefStr = target.data("hrefstr");
            if (hrefStr.indexOf("viewModel") != -1 || hrefStr.indexOf("paperModel") != -1) {
                localStorage.removeItem("viewPoint");
            }
        })
        $("#versionText").html('<span class="text">' + App.Projects.ProjectFileList.defaults.versionName + '</span>');
        $("#projectNotesNum").html(App.Projects.ProjectFileList.defaults.totalItemCount);
        this.initNotersHref();////初始化批注列表链接的地址
        if (!$("#footerBox > div").eq(1).hasClass("footer-box-select")) {
            $("#footerBox > div").eq(1).click();
        }
    },
    initNotersHref: function () {//初始化批注列表链接的地址
        var href = '#/notesList/' + App.Projects.ProjectFileList.defaults.projectId + '/' + App.Projects.ProjectFileList.defaults.projectVersionId + '/' + App.Projects.ProjectFileList.defaults.projectName + '/' + App.Projects.ProjectFileList.defaults.returnBackId;
        $("#openNotesList").on("click", function () {
            if (App.defaults.notesObj) {
                App.defaults.notesObj = undefined;
            }
            location.href = href;
        })
    },
    loadVersionName: function () {//加载最新版本的方法
        var data = {
            projectId: App.Projects.ProjectFileList.defaults.projectId,
            projectVersionId: App.Projects.ProjectFileList.defaults.projectVersionId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.versionName,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    var status = data.data.status;
                    var name = '<span class="text">' + data.data.name + '</span>' + "(" + App.Projects.ProjectFileList.defaults.versionStatus[status] + ")";
                    App.Projects.ProjectFileList.defaults.versionName = name;
                    if (data.data.isBimControl == 2) {
                        $("#versionText").html("当前版本");
                        $(".projectVersionBox").css("background", "none").off("click");
                    } else {
                        $("#versionText").html(name);
                    }
                } else {
                    alert("版本出错了：" + data.message);
                }
            }
        });
    },
    crumbsDomHandle: function () {//设置面包屑的方法
        this.loadCrumbsListData();//加载项目面包屑列表方法
    },
    loadVersionData: function () {//加载版本列表的方法
        var th = this;
        var data = {
            "projectId": App.Projects.ProjectFileList.defaults.projectId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.projectVersionList,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    for (var i = 0, len = data.data.length; i < len; i++) {
                        if (data.data[i].versionType == 0 || data.data[i].versionType == 1) {
                            App.Projects.ProjectFileList.defaults.versionPData = data.data[i].item;
                        } else if (data.data[i].versionType == 2) {
                            App.Projects.ProjectFileList.defaults.versionCData = data.data[i].item;
                        }
                    }
                    th.initVersionHandle();//初始化版本列表的方法
                } else {
                    alert("版本列表错误:" + data.message);
                }
            }
        });
    },
    initVersionHandle: function (searchVal) {//初始化版本列表的方法
        var versionListData = [];
        var m_versionListBox = $(".m_versionListBox");
        m_versionListBox.find(".loading").hide();
        var m_versionComponetBox = $("#m_versionComponetBox");
        m_versionComponetBox.html("");
        var liComponent = $('<li id="m_versionComponet" data-versionid="{{id}}" class="{{noBorder}}" style="display:none">{{name}}</li>');
        if (App.Projects.ProjectFileList.defaults.versionType == 1) {
            if (App.Projects.ProjectFileList.defaults.versionPData.length == 0) {
                m_versionListBox.find(".nullData").show();
            } else {
                if (!searchVal) {
                    for (var i = 0, len = App.Projects.ProjectFileList.defaults.versionPData.length; i < len; i++) {
                        for (var j = 0, jlen = App.Projects.ProjectFileList.defaults.versionPData[i].version.length; j < jlen; j++) {
                            versionListData.push(App.Projects.ProjectFileList.defaults.versionPData[i].version[j]);
                        }
                    }
                } else {
                    for (var i = 0, len = App.Projects.ProjectFileList.defaults.versionPData.length; i < len; i++) {
                        for (var j = 0, jlen = App.Projects.ProjectFileList.defaults.versionPData[i].version.length; j < jlen; j++) {
                            if (App.Projects.ProjectFileList.defaults.versionPData[i].version[j].name.indexOf(searchVal) != -1) {
                                versionListData.push(App.Projects.ProjectFileList.defaults.versionPData[i].version[j]);
                            }
                        }
                    }
                }
                if (versionListData.length > 0) {
                    m_versionComponetBox.append(liComponent);
                    m_versionListBox.find(".nullData").hide();
                    m_versionListBox.find(".m_versionListScrollBox ul").show();
                    this.viewVersionListPage(versionListData);
                } else {
                    m_versionListBox.find(".nullData").show();
                }
            }
        } else if (App.Projects.ProjectFileList.defaults.versionType == 2) {
            if (App.Projects.ProjectFileList.defaults.versionCData.length == 0) {
                m_versionListBox.find(".nullData").show();
            } else {
                m_versionComponetBox.append(liComponent);
                m_versionListBox.find(".nullData").hide();
                m_versionListBox.find(".m_versionListScrollBox ul").show();
                if (!searchVal) {
                    for (var i = 0, len = App.Projects.ProjectFileList.defaults.versionCData.length; i < len; i++) {
                        for (var j = 0, jlen = App.Projects.ProjectFileList.defaults.versionCData[i].version.length; j < jlen; j++) {
                            versionListData.push(App.Projects.ProjectFileList.defaults.versionCData[i].version[j]);
                        }
                    }
                } else {
                    for (var i = 0, len = App.Projects.ProjectFileList.defaults.versionCData.length; i < len; i++) {
                        for (var j = 0, jlen = App.Projects.ProjectFileList.defaults.versionCData[i].version.length; j < jlen; j++) {
                            if (App.Projects.ProjectFileList.defaults.versionCData[i].version[j].name.indexOf(searchVal) != -1) {
                                versionListData.push(App.Projects.ProjectFileList.defaults.versionCData[i].version[j]);
                            }
                        }
                    }
                }
                if (versionListData.length > 0) {
                    m_versionComponetBox.append(liComponent);
                    m_versionListBox.find(".nullData").hide();
                    m_versionListBox.find(".m_versionListScrollBox ul").show();
                    this.viewVersionListPage(versionListData);
                } else {
                    m_versionListBox.find(".nullData").show();
                }
            }
        }
    },
    viewVersionListPage: function (data) {//渲染版本列表的方法
        if (data.length == 0) {
            m_versionListBox.find(".nullData").show();
        } else {
            template.repeat({
                repeatElement: $("#m_versionComponet")[0], /*页面的DOM元素*/
                data: data,
                process: function (itemObject) {
                    var key = itemObject.index;
                    var item = itemObject.item;
                    var status = item.status;
                    return {
                        "id": item.id,
                        "name": '<span class="text">' + item.name + '</span>' + "(" + App.Projects.ProjectFileList.defaults.versionStatus[status] + ")",
                        "noBorder": "border-bottom-color"
                    }
                }
            });
        }
    },
    loadNotesData: function () {//加载批注个数的方法
        var data = {
            "type": 1,
            "projectId": App.Projects.ProjectFileList.defaults.projectId,
            "projectVersionId": App.Projects.ProjectFileList.defaults.projectVersionId,//App.Projects.ProjectFileList.defaults.projectVersionId
        }
        App.Comm.ajax({
            type: "POST",
            url: App.Restful.urls.projectNotesNumber,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data.code == 0) {
                    var totalItemCount = data.data.totalItemCount;
                    App.Projects.ProjectFileList.defaults.totalItemCount = data.data.totalItemCount;
                    $("#projectNotesNum").html(totalItemCount);
                } else {
                    alert("批注个数出错了:" + JSON.stringify(data));
                }
            }
        });
    },
    loadFolderListData: function () {//加载项目文件夹和文件列表方法
        if (!App.Projects.ProjectFileList.defaults.flag) {
            return;
        }
        App.Projects.ProjectFileList.defaults.flag = false;
        var th = this;
        var uploadData = {
            projectId: App.Projects.ProjectFileList.defaults.projectId,//项目id
            projectVersionId: App.Projects.ProjectFileList.defaults.projectVersionId,//项目版本id
            parentId: App.Projects.ProjectFileList.defaults.folderId ? App.Projects.ProjectFileList.defaults.folderId : "",// 文件夹父级id
            pageIndex: App.Projects.ProjectFileList.defaults.pageIndex,
            pageItemCount: "5",
        }
        if (App.Projects.ProjectFileList.defaults.folderName.length > 0) {
            uploadData = {
                parentId: App.Projects.ProjectFileList.defaults.folderId,
                folderName: App.Projects.ProjectFileList.defaults.folderName,
                projectId: App.Projects.ProjectFileList.defaults.projectId,//项目id
                projectVersionId: App.Projects.ProjectFileList.defaults.projectVersionId,//项目版本id
                pageIndex: App.Projects.ProjectFileList.defaults.pageIndex,
                pageItemCount: "5",
            }
        }
        var fileList = $("#fileList");
        var projectContentScrollBox = $("#projectContentScrollBox");
        var searchListBox = $("#searchListBox");
        var lodingDom = $('<div class="loading">加载中...</div>');
        var listComponent = $('<li id="fileListComponent" style="display:none"><a href="{{href}}" data-hrefstr="{{href}}" class="{{noBorder}} {{noDisplay}}" data-modelstatus="{{modelstatus}}"  data-revitid="{{revitid}}" data-isfolder="{{isfolder}}"><dl><dt>{{imgLogo}}</dt><dd><h2>{{name}}</h2><p>{{createTime}}<span>{{size}}</span></p></dd></dl><i></i></a></li>');
        var fileListComponentSearch = $('<li id="fileListComponentSearch" style="display:none"><a href="{{href}}" data-hrefstr="{{href}}" class="{{noBorder}} {{noDisplay}}"><dl><dt>{{imgLogo}}</dt><dd><h2>{{name}}</h2><p>{{createTime}}<span>{{size}}</span></p></dd></dl><i></i></a></li>');
        if (App.Projects.ProjectFileList.defaults.searchBool) {
            searchListBox.html("");
            searchListBox.append(lodingDom);
            searchListBox.append(fileListComponentSearch);
        } else {
            fileList.html("");
            fileList.append(lodingDom);
            fileList.append(listComponent);
        }
        return new Promise(function (resolve, reject) {
            App.Comm.ajax({
                type: "get",
                url: App.Projects.ProjectFileList.defaults.folderName.length > 0 ? App.Restful.urls.projectSearchFolderList : App.Restful.urls.projectFolderList,
                param: uploadData,
                dataType: "json",
                success: function (data) {
                    if (data.code == 0) {
                        if (App.Projects.ProjectFileList.defaults.searchBool) {
                            searchListBox.find(".loading").remove();
                        } else {
                            fileList.find(".loading").remove();
                        }
                        App.Projects.ProjectFileList.defaults.flag = true;
                        App.Projects.ProjectFileList.defaults.searchCan = true;
                        if (data.data.length == 0) {
                            var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
                            if (App.Projects.ProjectFileList.defaults.searchBool) {
                                $("#resultNum").html(data.data.length);
                                searchListBox.append(nullData);
                                return;
                            }
                            projectContentScrollBox.append(nullData);
                        } else {
                            if (App.Projects.ProjectFileList.defaults.searchBool) {
                                $("#resultNum").html(data.data.length);
                                th.viewSearchProjectsPage(data.data);//搜索渲染的页面
                                return;
                            }
                            th.viewProjectfloderPage(data.data);
                        }
                    } else {
                        alert("获取项目问题:" + data.message)
                    }
                    resolve(data)
                }
            });
        });
    },
    divWidth: function () {
        var touchDom = $("#touchDom");
        var aDom = touchDom.find("a");
        var maxWidth = 0;
        for (var i = 0, len = aDom.length; i < len; i++) {
            maxWidth += $(aDom[i]).width();
        }
        touchDom.width(maxWidth);
    },
    viewSearchProjectsPage: function (data) {//搜索渲染的页面
        /*渲染数据*/
        template.repeat({
            repeatElement: $("#fileListComponentSearch")[0], /*页面的DOM元素*/
            data: data,
            process: function (itemObject) {
                var item = itemObject.item;
                var key = itemObject.index;
                var projectId = App.Projects.ProjectFileList.defaults.projectId;
                var projectVersionId = App.Projects.ProjectFileList.defaults.projectVersionId;
                var projectName = App.Projects.ProjectFileList.defaults.projectName;
                var folderId = App.Projects.ProjectFileList.defaults.folderId;
                var imgHtml = "",
                    nameStr = item.name,
                    href = "";
                var changeName = App.replaceKongGeHandle(item.name);
                if (App.Projects.ProjectFileList.defaults.folderName == ".") {
                    App.Projects.ProjectFileList.defaults.folderName = "\\" + App.Projects.ProjectFileList.defaults.folderName;
                }
                var name = App.searchHighlightHandle(App.Projects.ProjectFileList.defaults.folderName, nameStr);//搜索结果高亮效果的方法
                if (item.folder) {
                    imgHtml = '<img src="images/comm/file_icon.png">';
                    href = "#/project/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + item.id;
                } else {
                    if (item.suffix == "rvt") {
                        imgHtml = '<img src="images/comm/rvt_icon.png">';
                        href = "#/viewModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + item.modelId + "/project?t=123456789&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId;
                    } else if (item.suffix == "dwg") {
                        imgHtml = '<img src="images/comm/dwg_icon.png">';
                        href = "#/paperModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + item.fileVersionId + "/project?t=123456789&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId;
                    } else {
                        imgHtml = '<img src="images/comm/default_icon.png">';
                        href = "javascript:;";
                    }
                }
                return {
                    "href": href,
                    "name": name,
                    "size": Assister.Size.formatSize(item.length),
                    "imgLogo": imgHtml,
                    "createTime": Assister.Date.getDateFromHMLong(item.createTime),
                    "noBorder": key == data.length - 1 ? "border-bottom-color noPaddingBottom" : "border-bottom-color",
                    "noDisplay": !item.folder ? "noDisplay" : "",
                }
            }
        });
    }, setReturn: function () {//设置返回按钮点击
        var backUrl = ""
        returnId = "";
        var data = App.Projects.ProjectFileList.defaults.crumbsData;
        var projectId = App.Projects.ProjectFileList.defaults.projectId;
        var projectVersionId = App.Projects.ProjectFileList.defaults.projectVersionId;
        var projectName = App.Projects.ProjectFileList.defaults.projectName;
        if (data.length > 1) {
            returnId = data[data.length - 2].id;
            backUrl = "#/project/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + returnId
        } else if (data.length > 0) {
            backUrl = "#/project/" + projectId + "/" + projectVersionId + "/" + projectName;
        } else if (/from-advanced-search/.test(location.href)) {
            backUrl = "#/searchHeightPage"
        } else {
            backUrl = "#/Projects";
        }
        App.TitleBar.returnCallback(backUrl);
    },
    viewProjectfloderPage: function (data) {
        /*渲染数据*/
        template.repeat({
            repeatElement: $("#fileListComponent")[0], /*页面的DOM元素*/
            data: data,
            process: function (itemObject) {
                var item = itemObject.item;
                var key = itemObject.index;
                var projectId = App.Projects.ProjectFileList.defaults.projectId;
                var projectVersionId = App.Projects.ProjectFileList.defaults.projectVersionId;
                var projectName = App.Projects.ProjectFileList.defaults.projectName;
                var folderId = App.Projects.ProjectFileList.defaults.folderId;
                var imgHtml = ""
                href = "";
                var changeName = App.replaceKongGeHandle(item.name);
                if (item.folder) {
                    imgHtml = '<img src="images/comm/file_icon.png">';
                    href = "#/project/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + item.id;
                } else {
                    if (item.suffix == "rvt") {
                        imgHtml = '<img src="images/comm/rvt_icon.png">';
                        href = "#/viewModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + item.modelId + "/project?t=123456789&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId;
                    } else if (item.suffix == "dwg") {
                        imgHtml = '<img src="images/comm/dwg_icon.png">';
                        href = "#/paperModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + item.fileVersionId + "/project?t=123456789&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId;
                    } else {
                        imgHtml = '<img src="images/comm/default_icon.png">';
                        href = "javascript:;";
                    }
                }
                return {
                    "href": href,
                    "name": item.name,
                    "size": Assister.Size.formatSize(item.length),
                    "imgLogo": imgHtml,
                    "createTime": Assister.Date.getDateFromHMLong(item.createTime),
                    "noBorder": key == data.length - 1 ? "border-bottom-color noPaddingBottom" : "border-bottom-color",
                    "noDisplay": !item.folder ? "noDisplay" : "",
                    modelstatus: item.modelStatus === null ? '' : item.modelStatus,
                    revitid: item.revitId === null ? '' : item.revitId, isfolder: item.folder
                }
            }
        });
    },
    crumbsHandle: function (data) {
        var html = '';
        var crumbsBox = $(".m_common_crumbs_scroll_box");
        if (data.length > 0) {
            html = '<a href="#/project/' + App.Projects.ProjectFileList.defaults.projectId + '/' + App.Projects.ProjectFileList.defaults.projectVersionId + '/' + App.Projects.ProjectFileList.defaults.projectName + '">项目</a>';
            for (var i = 0, len = data.length; i < len; i++) {
                if (i == data.length - 1) {
                    html += '<a href="javascript:;">' + data[i].name + '</a>';
                } else {
                    html += '<a href="#/project/' + App.Projects.ProjectFileList.defaults.projectId + '/' + App.Projects.ProjectFileList.defaults.projectVersionId + '/' + App.Projects.ProjectFileList.defaults.projectName + '/' + data[i].id + '">' + data[i].name + '</a>';
                }
            }
        } else {
            html = '<a href="javascript:;">项目</a>';
        }
        crumbsBox.html(html);
        this.divWidth();
        this.setReturn();//设置返回按钮点击
    },
    loadCrumbsListData: function () {//加载项目面包屑列表方法
        var _this = this;
        var data = {
            projectId: App.Projects.ProjectFileList.defaults.projectId,
            projectVersionId: App.Projects.ProjectFileList.defaults.projectVersionId,
            parentId: App.Projects.ProjectFileList.defaults.folderId == "" ? 0 : App.Projects.ProjectFileList.defaults.folderId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.projectCrumbsList,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    App.Projects.ProjectFileList.defaults.crumbsData = data.data;
                    _this.crumbsHandle(data.data);
                } else {
                    alert("面包屑接口:" + data.message)
                }
            }
        });
    }
};