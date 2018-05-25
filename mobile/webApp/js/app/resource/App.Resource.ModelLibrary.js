//@ sourceURL=App.Resource.ModelLibrary.js
App.Resource = App.Resource || {};
App.Resource.ModelLibrary = {
    defaults: {
        projectName: '',//项目名字
        versionName: '',//版本名字
        projectId: '',//项目id
        versionId: '',//项目版本id
        folderId: '',//文件夹id
        arge: '',//传过来的参数
        crumbsData: '',//面包屑的参数
        pageIndex: 1,//文件列表的页数
        folderName: '',//搜索文件列表的名字
        searchBool: false,
        searchCan: true,//防止重复搜索点击
        reourceVersionData: [],//资源标准模型版本列表
        versionStatus: {
            "1": "未初始化",
            "3": "待审核",
            "4": "审核中",
            "5": "审核通过",
            "6": "审核退回",
            "7": "待移交",
            "8": "移交退回",
            "9": "已发布",
            "10": "变更申请通过(待审核)",
            "11": "变更审核通过(审核通过)",
            "12": "变更审核退回(审核退回)",
            "13": "变更待移交(待移交)",
            "14": "更移交退回(移交退回)"
        }
    },
    init: function (arge) {
        var _this = this;
        App.Resource.ModelLibrary.defaults.folderName = "";
        App.Resource.ModelLibrary.defaults.arge = arge;
        App.Resource.ModelLibrary.defaults.projectName = arge.name;
        App.Resource.ModelLibrary.defaults.projectId = arge.id;
        App.Resource.ModelLibrary.defaults.versionId = arge.versionId;
        App.Resource.ModelLibrary.defaults.folderId = arge.folderId ? arge.folderId : "";
        App.Resource.ModelLibrary.defaults.searchBool = false;
        App.defaults.isBimControl = undefined;
        this.initHtmlHandle();//初始化页面
        $(function(){
            _this.initVersionFun(arge);//初始化点击版本名字的方法
            _this.initHandle(arge);//初始化方法
            _this.loadFileList();//获取标准模型库列表的方法
            _this.crumbsDomHandle();//面包屑方法
            _this.searchInit();//初始化搜索方法
            _this.loadVersionName();//加载最新版本的方法
        })
    },
    initHtmlHandle:function(arge){
        App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
        App.TitleBar.hideHomeBtn();//隐藏顶部三个点按钮
        App.TitleBar.setTitle(App.Resource.ModelLibrary.defaults.projectName);
        if (!$("#footerBox > div").eq(3).hasClass("footer-box-select")) {
            $("#footerBox > div").eq(3).click();
        }
        App.hideMainMenu();//隐藏底部导航栏
        $("#mainContainer").css("padding-bottom", 0);
    },
    searchInit: function () {//搜索初始化方法
        var _this = this;
        $("#searchBtn").on("click", function () {
            var searchVal = $("#searchInput").val().trim();
            App.Resource.ModelLibrary.defaults.folderName = searchVal;
            if (App.Resource.ModelLibrary.defaults.searchCan) {
                $("#searchCommonBox").css("padding-top", "3.5726rem").css("display", "block");
                App.Resource.ModelLibrary.defaults.searchBool = true;
                _this.loadFileList();//执行搜索获取数据
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
            }, 200)
        });
        $("#clearSearchVal").on("click", function () {
            App.Resource.ModelLibrary.defaults.folderName = "";
            $(this).hide();
            $("#searchInput").val("");
        })
        $("#clearSearchBtn").on("click", function () {
            $("#searchCommonBox").css("display", "none");
            $("#clearSearchVal").css("display", "none");
            $("#searchListBox").html("");
            $("#searchInput").val("");
            App.Resource.ModelLibrary.defaults.folderName = "";
        })
    },
    initHandle: function () {
        var _this = this;
        $("#fileList").on("click", function (evt) {
            var target = $(evt.target).closest("a");
            if (target.attr('href').includes('javascript:;') || App.Comm.disableOpen(target)) {
                var Dlg1 = App.UI.Dialog.showMsgDialog({
                    title: "提示",
                    text: App.Comm.isConverting(target) ? '文件转化中，暂不支持查看' : "该文件不支持在线查看",
                    okText: "确定",
                    onok: function () {
                        return;
                    },
                });
                $(Dlg1.dialog).find(".commDialogCancel").css("display", "none");
                $(Dlg1.dialog).find(".commDialogOk").css("width", "100%");
                return false;
            }
            if (target.attr("href").indexOf("viewModel") != -1 || target.attr("href").indexOf("paperModel") != -1) {
                localStorage.removeItem("viewPoint");
            }
        })
        $("#versionText").html(App.Resource.ModelLibrary.defaults.versionName);
    },
    initVersionFun: function (arge) {//初始化点击版本名字的方法
        var _this = this;
        var projectVersionBox = $(".projectVersionBox");
        projectVersionBox.on("click", function (evt) {//点击版本执行的的方法
            var m_versionBgBox = $('<div class="m_versionBgBox"></div>');
            var m_versionBox = $('<div class="m_versionBox"><div class="m_versionSearchBox"><div class="m_common_search border-bottom-color"><div class="m_common_search_relative"><div class="m_common_search_input_box"><i></i><input id="searchVersionInput" type="text" name="" placeholder="关键字"><span id="clearVersion"></span><button id="searchVersionBtn" class="border-no-color">搜索</button></div><div class="m_common_search_relative_btn"></div></div></div></div><div class="m_versionListBox"><div class="loading">加载中...</div><div class="m_versionListScrollBox"><ul id="m_versionComponetBox"></ul><div class="nullData"><div class="nullDataImg"></div><p>暂时还没有任何内容哦～</p></div></div></div></div>');
            $("body").append(m_versionBgBox);
            $("body").append(m_versionBox);
            m_versionBox.addClass('m_versionBox_show');
            _this.loadVersionData();//加载版本列表的方法
            m_versionBgBox.on("click", function () {
                m_versionBox.removeClass('m_versionBox_show');
                App.Resource.ModelLibrary.defaults.reourceVersionData = [];
                $("#searchVersionInput").val('');
                m_versionBgBox.remove();
                m_versionBox.remove();
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
            $("#m_versionComponetBox").on("click", "li", function (evt) {
                var target = $(evt.target).closest("li");
                var versionid = target.data("versionid");
                var versionName = target.html();
                var versionText = $("#versionText");
                var locationStr = "#/resourceModelLibraryList/{{id}}/{{versionId}}/{{name}}";
                if (versionid) {
                    locationStr = locationStr.replace("{{id}}", arge.id);
                    locationStr = locationStr.replace("{{versionId}}", versionid);
                    locationStr = locationStr.replace("{{name}}", arge.name);
                    versionText.html(versionName);
                    m_versionBgBox.click();//点击之后关闭版本弹出层
                    location.href = locationStr;
                }
            });
            $("#searchVersionBtn").on("click", function () {//版本搜索功能
                var searchVersionInputVal = $("#searchVersionInput").val().trim();
                _this.initVersionHandle(searchVersionInputVal);//搜索版本功能
            })
        })
    },
    loadVersionData: function () {//加载版本列表的方法
        var th = this;
        var data = {
            "projectId": App.Resource.ModelLibrary.defaults.projectId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.resourceVersionList,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    App.Resource.ModelLibrary.defaults.reourceVersionData = data.data;
                    th.initVersionHandle();//初始化版本列表的方法
                } else {
                    alert("错误" + data);
                }
            }
        });
    },
    initVersionHandle: function (searchVal) {//初始化版本列表的方法
        var searchData = [];
        var versionListData = App.Resource.ModelLibrary.defaults.reourceVersionData;
        var m_versionListBox = $(".m_versionListBox");
        m_versionListBox.find(".loading").hide();
        var m_versionComponetBox = $("#m_versionComponetBox");
        m_versionComponetBox.html("");
        var liComponent = $('<li id="m_versionComponet" data-versionid="{{id}}" class="{{noBorder}}" style="display:none">{{name}}</li>');
        if (versionListData.length == 0) {
            m_versionListBox.find(".nullData").show();
        } else {
            if (!searchVal) {
                m_versionComponetBox.append(liComponent);
                m_versionListBox.find(".nullData").hide();
                m_versionListBox.find(".m_versionListScrollBox ul").show();
                this.viewVersionListPage(versionListData);
            } else {
                for (var i = 0, len = versionListData.length; i < len; i++) {
                    if (versionListData[i].name.indexOf(searchVal) != -1) {
                        searchData.push(versionListData[i]);
                    }
                }
                if (searchData.length > 0) {
                    m_versionComponetBox.append(liComponent);
                    m_versionListBox.find(".nullData").hide();
                    m_versionListBox.find(".m_versionListScrollBox ul").show();
                    this.viewVersionListPage(searchData);
                } else {
                    m_versionListBox.find(".nullData").show();
                }
            }
        }
    },
    viewVersionListPage: function (data) {//渲染版本列表的方法
        template.repeat({
            repeatElement: $("#m_versionComponet")[0], /*页面的DOM元素*/
            data: data,
            process: function (itemObject) {
                var key = itemObject.index;
                var item = itemObject.item;
                var status = item.status;
                return {
                    "id": item.id,
                    "name": '<span class="text">' + item.name + '</span>' + "(" + App.Resource.ModelLibrary.defaults.versionStatus[status] + ")",
                    "noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color"
                }
            }
        });
    },
    loadFileList: function () {//获取文件列表的方法
        if (!App.Resource.ModelLibrary.defaults.searchCan) {
            return;
        }
        App.Resource.ModelLibrary.defaults.searchCan = false;
        var th = this;
        var fileList = $("#fileList");
        var lodingDom = $('<div class="loading">加载中...</div>');
        var listComponent = $('<li id="fileListComponent" style="display:none"><a class="{{noBorder}} {{noDisplay}}" href="{{href}}" data-modelstatus="{{modelstatus}}" data-revitid="{{revitid}}" data-isfolder="{{folder}}"><dl><dt>{{imgLogo}}</dt><dd><h2>{{name}}</h2><p>{{createTime}}<span>{{size}}</span></p></dd></dl><i></i></a></li>');
        var listSearchComponent = $('<li id="fileListSerchComponent" style="display:none"><a class="{{noBorder}} {{noDisplay}}" href="{{href}}" data-modelstatus="{{modelstatus}}" data-revitid="{{revitid}}" data-isfolder="{{folder}}"><dl><dt>{{imgLogo}}</dt><dd><h2>{{name}}</h2><p>{{createTime}}<span>{{size}}</span></p></dd></dl><i></i></a></li>');
        var searchListBox = $("#searchListBox");
        if (App.Resource.ModelLibrary.defaults.searchBool) {
            searchListBox.html("");
            searchListBox.append(lodingDom);
            searchListBox.append(listSearchComponent);
        } else {
            fileList.html('');
            fileList.append(lodingDom);
            fileList.append(listComponent);
        }
        var folderData = {//获取文件列表的参数
            projectId: App.Resource.ModelLibrary.defaults.projectId,//项目id
            projectVersionId: App.Resource.ModelLibrary.defaults.versionId,//项目版本id
            parentId: App.Resource.ModelLibrary.defaults.folderId,// 文件夹父级id
            pageIndex: App.Resource.ModelLibrary.defaults.pageIndex,//列表的页数
            pageItemCount: "100",
        }
        if (App.Resource.ModelLibrary.defaults.folderName.length > 0) {//搜索的文件名字
            folderData.folderName = App.Resource.ModelLibrary.defaults.folderName
        }
        App.Comm.ajax({
            type: "get",
            url: App.Resource.ModelLibrary.defaults.folderName.length > 0 ? App.Restful.urls.projectSearchFolderList : App.Restful.urls.projectFolderList,
            param: folderData,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    App.Resource.ModelLibrary.defaults.searchCan = true;
                    if (App.Resource.ModelLibrary.defaults.searchBool) {
                        searchListBox.find(".loading").remove();
                    } else {
                        fileList.find(".loading").remove();
                    }
                    if (data.data.length == 0) {
                        var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>")
                        if (App.Resource.ModelLibrary.defaults.searchBool) {
                            $("#resultNum").html(data.data.length);
                            searchListBox.append(nullData);
                            return;
                        }
                        fileList.append(nullData);
                    } else {
                        if (App.Resource.ModelLibrary.defaults.searchBool) {
                            $("#resultNum").html(data.data.length);
                            th.viewSearchProjectsPage(data.data);//搜索渲染的页面
                            return;
                        }
                        th.viewResourcefloderPage(data.data);
                    }
                } else {
                    alert(data.message)
                }
            }
        });
    },
    viewSearchProjectsPage: function (data) {//搜索渲染的页面
        /*渲染数据*/
        template.repeat({
            repeatElement: $("#fileListSerchComponent")[0], /*页面的DOM元素*/
            data: data,
            process: function (itemObject) {
                var item = itemObject.item;
                var key = itemObject.index;
                var projectId = App.Resource.ModelLibrary.defaults.projectId;
                var projectVersionId = App.Resource.ModelLibrary.defaults.versionId;
                var projectName = App.Resource.ModelLibrary.defaults.projectName;
                var folderId = App.Resource.ModelLibrary.defaults.folderId;
                var imgHtml = "",
                    nameStr = item.name,
                    href = "javascript:;";
                var changeName = App.replaceKongGeHandle(item.name);
                if (App.Resource.ModelLibrary.defaults.folderName == ".") {
                    App.Resource.ModelLibrary.defaults.folderName = "\\" + App.Resource.ModelLibrary.defaults.folderName;
                }
                var name = App.searchHighlightHandle(App.Resource.ModelLibrary.defaults.folderName, nameStr);//搜索结果高亮效果的方法
                if (item.folder) {
                    imgHtml = '<img src="images/comm/file_icon.png">';
                    href = "#/resourceModelLibraryList/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + item.id;
                } else {
                    if (item.suffix == "rvt") {
                        imgHtml = '<img src="images/comm/rvt_icon.png">';
                        href = "#/viewModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + '/' + item.modelId + "/resourceModelLibraryList?t=123456&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId + "&noComment=yes";
                    } else if (item.suffix == "dwg") {
                        imgHtml = '<img src="images/comm/dwg_icon.png">';
                        href = "#/paperModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + item.fileVersionId + "/resourceModelLibraryList?t=123456&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId + "&noComment=yes";
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
                    "noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color",
                    "noDisplay": !item.folder ? "noDisplay" : "",
                }
            }
        });
    },
    viewResourcefloderPage: function (data) {
        /*渲染数据*/
        template.repeat({
            repeatElement: $("#fileListComponent")[0], /*页面的DOM元素*/
            data: data,
            process: function (itemObject) {
                var item = itemObject.item;
                var key = itemObject.index;
                var projectId = App.Resource.ModelLibrary.defaults.projectId;
                var projectVersionId = App.Resource.ModelLibrary.defaults.versionId;
                var projectName = App.Resource.ModelLibrary.defaults.projectName;
                var folderId = App.Resource.ModelLibrary.defaults.folderId;
                var imgHtml = ""
                href = "javascript:;";
                var changeName = App.replaceKongGeHandle(item.name);
                if (item.folder) {
                    imgHtml = '<img src="images/comm/file_icon.png">';
                    href = "#/resourceModelLibraryList/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + item.id;
                } else {
                    if (item.suffix == "rvt") {
                        imgHtml = '<img src="images/comm/rvt_icon.png">';
                        href = "#/viewModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + '/' + item.modelId + "/resourceModelLibraryList?t=123456&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId + "&noComment=yes";
                    } else if (item.suffix == "dwg") {
                        imgHtml = '<img src="images/comm/dwg_icon.png">';
                        href = "#/paperModel/" + projectId + "/" + projectVersionId + "/" + projectName + "/" + folderId + "/" + changeName + "/" + item.fileVersionId + "/resourceModelLibraryList?t=123456&fileId=" + item.id + "&fileVersionId=" + item.fileVersionId + "&noComment=yes";
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
                    "noBorder": key == data.length - 1 ? "border-no-color" : "border-bottom-color",
                    "noDisplay": !item.folder ? "noDisplay" : "",
                    modelstatus: item.modelStatus === null ? '' : item.modelStatus,
                    revitid: item.revitId === null ? '' : item.revitId,
                    isfolder: item.folder
                }
            }
        });
    },
    loadVersionName: function () {//加载最新版本的方法
        var data = {
            projectId: App.Resource.ModelLibrary.defaults.projectId,
            projectVersionId: App.Resource.ModelLibrary.defaults.versionId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.versionName,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    var status = data.data.status;
                    var name = '<span class="text">' + data.data.name + '</span>' + "(" + App.Resource.ModelLibrary.defaults.versionStatus[status] + ")";
                    App.Resource.ModelLibrary.defaults.versionName = name;
                    $("#versionText").html(name);
                } else {
                    alert(data);
                }
            }
        });
    },
    crumbsDomHandle: function () {//获取面包屑的方法
        var _this = this;
        var data = {
            projectId: App.Resource.ModelLibrary.defaults.projectId,
            projectVersionId: App.Resource.ModelLibrary.defaults.versionId,
            parentId: App.Resource.ModelLibrary.defaults.folderId == "" ? 0 : App.Resource.ModelLibrary.defaults.folderId,
        }
        App.Comm.ajax({
            type: "get",
            url: App.Restful.urls.projectCrumbsList,
            param: data,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    App.Resource.ModelLibrary.defaults.crumbsData = data.data;
                    _this.crumbsHandle(data.data);
                } else {
                    alert(data.message)
                }
            }
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
    crumbsHandle: function (data) {//渲染面包屑页面的方法
        var html = '';
        var crumbsBox = $(".m_common_crumbs_scroll_box");
        var projectId = App.Resource.ModelLibrary.defaults.projectId;
        var versionId = App.Resource.ModelLibrary.defaults.versionId;
        var projectName = App.Resource.ModelLibrary.defaults.projectName;
        if (data.length > 0) {
            html = '<a href="#/resourceModelLibraryList/' + projectId + '/' + versionId + '/' + projectName + '">标准模型</a>';
            for (var i = 0, len = data.length; i < len; i++) {
                if (i == data.length - 1) {
                    html += '<a href="javascript:;">' + data[i].name + '</a>';
                } else {
                    html += '<a href="#/resourceModelLibraryList/' + projectId + '/' + versionId + '/' + projectName + '/' + data[i].id + '">' + data[i].name + '</a>';
                }
            }
        } else {
            html = '<a href="javascript:;">标准模型</a>';
        }
        crumbsBox.html(html);
        this.divWidth();
        this.setReturn();
    },
    setReturn: function () {//设置返回按钮点击
        var backUrl = ""
        returnId = "";
        var data = App.Resource.ModelLibrary.defaults.crumbsData;
        var projectId = App.Resource.ModelLibrary.defaults.projectId;
        var versionId = App.Resource.ModelLibrary.defaults.versionId;
        var projectName = App.Resource.ModelLibrary.defaults.projectName;
        if (data.length > 1) {
            returnId = data[data.length - 2].id;
            backUrl = "#/resourceModelLibraryList/" + projectId + "/" + versionId + "/" + projectName + "/" + returnId
        } else if (data.length > 0) {
            backUrl = "#/resourceModelLibraryList/" + projectId + "/" + versionId + "/" + projectName;
        } else {
            backUrl = "#/resourceComList/standard";
        }
        App.TitleBar.returnCallback(backUrl);
    },
}