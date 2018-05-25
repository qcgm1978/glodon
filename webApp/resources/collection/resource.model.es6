App.ResourceModel = {
    Settings: {
        leftType: "file",
        DataModel: "", //模型id
        fileVersionId: "",
        searchText: "", //搜索文本
        type: "", //模型类型
        projectId: "", //项目id
        versionId: "", // 版本id
        pageIndex: 1,
        CurrentVersion: {}
    },
    // 文件 容器
    FileCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    title: ""
                }
            }
        }),
        urlType: "fetchFileList",
        parse: function (responese) {
            if (responese.code == 0 && responese.data.length > 0) {
                return responese.data;
            } else {
                $("#resourceListContent .fileContent").html('<li class="loading">'+(App.Local.data['drawing-model'].Ndd||'无数据')+'</li>');
            }
        }
    })),
    // 文件 容器
    FileThumCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    title: ""
                }
            }
        }),
        urlType: "fetchFileList",
        parse: function (responese) {
            if (responese.code == 0 && responese.data.length > 0) {
                return responese.data;
            } else {
                $("#resourceThumContent .thumContent").html('<li class="loading">'+(App.Local.data['drawing-model'].Ndd||'无数据')+'</li>');
            }
        }
    })),
    PropertiesCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    title: ""
                }
            }
        }),
        urlType: "fetchDesignProperties",
        parse: function (response) {
            if (response.message == "success") {
                return response;
            }
        }
    })),
    //初始化
    init: function () {
        
        //释放上传
        App.Comm.upload.destroy();
        //重置参数
        this.reset();
        //存在直接渲染 否则 加载数据
        if (App.ResourceModel.Settings.CurrentVersion && App.ResourceModel.Settings.CurrentVersion.id) {
            App.ResourceModel.renderLibs();
        } else {
            App.ResourceModel.getVersion();
        }
        if (!App.ResourceModel.Settings.bindGlobalEvent) {
            App.ResourceModel.Settings.bindGlobalEvent = true;
            App.ResourceModel.bindGlobalEvent();
        }
    },
    //token 初始化
    initToken() {
        //释放上传
        App.Comm.upload.destroy();
        //重置参数
        this.reset();
        //存在直接渲染 否则 加载数据
        if (App.ResourceModel.Settings.CurrentVersion && App.ResourceModel.Settings.CurrentVersion.id) {
            App.ResourceModel.renderLibs();
        } else {
            App.ResourceModel.getVersionByToken();
        }
        if (!App.ResourceModel.Settings.bindGlobalEvent) {
            App.ResourceModel.Settings.bindGlobalEvent = true;
            App.ResourceModel.bindGlobalEvent();
        }
    },
    reset: function () {
        App.ResourceModel.Settings.leftType = "file";
        App.ResourceModel.Settings.searchText = "";
        App.ResourceModel.Settings.pageIndex = 1;
        App.ResourceModel.Settings.DataModel = null;
        App.ResourceModel.Settings.CurrentVersion = {};
    },
    //绑定全局的事件
    bindGlobalEvent() {
        $(document).on("click.resources", function (event) {
            var $target = $(event.target);
            if ($target.closest('.thumContent .item').length <= 0) {
                $('.thumContent .item').each(function (i, item) {
                    if ($(item).hasClass("selected")) {
                        if (!$(item).find(".filecKAll input").is(":checked")) {
                            $(item).removeClass("selected");
                        }
                    }
                });
            }
            //面包屑 切换 文件 模型 浏览器
            if ($target.closest(".breadItem.fileModelNav").length <= 0) {
                $(".breadItem .fileModelList").hide();
            }
            //面包屑 切换 文件 模型 浏览器
            if ($target.closest(".breadItem.resourcesList").length <= 0) {
                $(".breadItem.resourcesList .projectVersionList").hide();
            }
            if ($target.closest(".breadItem.standardLibsVersion ").length <= 0) {
                $(".breadItem.standardLibsVersion  .projectVersionList").hide();
            }
        });
    },
    //获取数据
    getVersion: function () {
        var data = {
            URLtype: "fetchVersion",
            data: {
                projectId: App.ResourceModel.Settings.projectId,
                versionId: App.ResourceModel.Settings.versionId
            }
        };
        App.Comm.ajax(data, function (data) {
            if (data.message == "success") {
                App.ResourceModel.Settings.CurrentVersion = data.data;
                if (!App.ResourceModel.Settings.CurrentVersion) {
                    alert("无默认版本");
                    return;
                } else {
                    //渲染数据
                    App.ResourceModel.renderLibs();
                }
            } else {
                alert("获取版本失败");
            }
        });
    },
    //根据token获取版本
    getVersionByToken() {
        var data = {
            URLtype: "fetchProjectBaseInfo",
            data: {
                projectId: App.ResourceModel.Settings.projectId
            }
        };
        App.Comm.ajax(data, function (data) {
            if (data.code == 0) {
                App.ResourceModel.Settings.CurrentVersion = data.data.version;
                if (!App.ResourceModel.Settings.CurrentVersion) {
                    alert("无默认版本");
                    return;
                } else {
                    //渲染数据
                    App.ResourceModel.renderLibs();
                }
            } else {
                alert("获取版本失败");
            }
        });
    },
    renderData: function (data) {
        return new Promise((resolve, reject) => {
            if (data.isExist == 0) {
                new App.ResourceModel.App().render();
                App.ResourceModel.FileCollection.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
                App.ResourceModel.FileCollection.projectVersionId = App.ResourceModel.Settings.CurrentVersion.id;
                App.ResourceModel.FileCollection.reset();
                App.ResourceModel.FileCollection.fetch({
                    success: function () {
                        $("#pageLoading").hide();
                    }
                });
                resolve()
            } else if (data.isExist == 1) {
                $.tip({
                    message: "用户无标准模型权限",
                    timeout: 3000,
                    type: "alarm"
                })
                setTimeout(function () {
                    location.href = "#resources/standardLibs";
                }, 3200)
            } else if (data.isExist == 2) {
                $.tip({
                    type: 'alarm',
                    message: '当前用户在索引中不存在:' + data.isExist
                })
            }
        })
    },
    renderLibData: function (data) {
        return new Promise((resolve, reject) => {
            if (data.isExist == 0) {
                new App.ResourceModel.App().render();
                App.ResourceModel.FileThumCollection.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
                App.ResourceModel.FileThumCollection.projectVersionId = App.ResourceModel.Settings.CurrentVersion.id;
                App.ResourceModel.FileThumCollection.reset();
                App.ResourceModel.FileThumCollection.fetch({
                    success: function () {
                        $("#pageLoading").hide();
                    }
                });
                resolve()
            } else if (data.isExist == 1) {
                $.tip({
                    message: "用户无族库权限",
                    timeout: 3000,
                    type: "alarm"
                })
                setTimeout(function () {
                    location.href = "#resources/famLibs";
                }, 3200)
            } else if (data.isExist == 2) {
                $.tip({
                    type: 'alarm',
                    message: '当前用户在索引中不存在:' + data.isExist
                })
            }
        })
    },
    //渲染标准模型库
    renderLibs() {
        const _this = this;
        if (!App.ResourceModel.Settings.CurrentVersion) {
            alert("无默认版本");
            return;
        } else {
            //渲染数据
            var type = App.ResourcesNav.Settings.type;
            if (type == "standardLibs") {
                App.Comm.checkProjectAuthHandle({//检查当前用户对于当前项目是否有数据权限
                    projectid: App.ResourceModel.Settings.CurrentVersion.projectId,
                    type: 1,
                    callbackHandle: (data) => {
                        _this.renderData(data).then(() => App.CommonModule.getRemoteModel({
                            projectId: App.ResourceModel.Settings.projectId,
                            versionId: App.ResourceModel.Settings.versionId
                        })
                            .then((data) => App.CommonModule.promptRemoteModelDialog(data))
                            .catch(() => {
                            }));
                    }
                });
            } else if (type == "famLibs") {
                App.Comm.checkProjectAuthHandle({//检查当前用户对于当前项目是否有数据权限
                    projectid: App.ResourceModel.Settings.CurrentVersion.projectId,
                    type: 2,
                    callbackHandle: function (data) {
                        _this.renderLibData(data).then(() => App.CommonModule.getRemoteModel({
                            projectId: App.ResourceModel.Settings.projectId,
                            versionId: App.ResourceModel.Settings.versionId
                        })
                            .then((data) => App.CommonModule.promptRemoteModelDialog(data))
                            .catch(() => {
                            }));
                    }
                });
            }
            var status = App.ResourceModel.Settings.CurrentVersion.status;
            if (status != 9 && status != 4 && status != 7) {
                //上传
                App.ResourceUpload.init($(document.body));
            } else {
            }
        }
    },
    //创建文件夹
    createNewFolder: function () {
        var virModel = {
            isAdd: true,
            id: "createNew",
            children: null,
            fileVersionId: 520,
            folder: true,
            name: App.Local.getTranslation('drawing-model.New'),
            createTime: null,
            creatorId: null,
            creatorName: null,
            digest: null,
            floor: null
        }
        var type = App.ResourceModel.Settings.type;
        if (type == "standardLibs") {
            App.ResourceModel.FileCollection.push(virModel);
        } else if (type == "famLibs") {
            App.ResourceModel.FileThumCollection.push(virModel);
        }
    },
    //创建文件夹后处理
    afterCreateNewFolder(file, parentId) {
        var $treeViewMar = $(".projectNavFileContainer .treeViewMar"),
            $treeViewMarUl = $treeViewMar.find(".treeViewMarUl");
        var data = {
            data: [file],
            iconType: 1
        };
        //存在的时候、不做任何操作
        if ($treeViewMar.find('span[data-id="' + file.id + '"]').length > 0) {
            return;
        }
        //没有的时候绑定点击事件
        if ($treeViewMarUl.length <= 0) {
            data.click = function (event) {
                var file = $(event.target).data("file");
                if (file.folder) {
                    $('#navContainer .returnBack').removeClass('theEnd').attr('isReturn', '1').html((App.Local.data.source['s-b'] || '返回上级'));
                }
                if (type == "standardLibs") {
                    //清空数据
                    $("#resourceListContent .fileContent").empty();
                    App.ResourceModel.Settings.fileVersionId = file.fileVersionId;
                    App.ResourceModel.FileCollection.reset();
                    App.ResourceModel.FileCollection.fetch({
                        data: {
                            parentId: file.fileVersionId
                        }
                    });
                } else if (type == "famLibs") {
                    var file = $(event.target).data("file");
                    //清空数据
                    $("#resourceThumContent .thumContent").empty();
                    App.ResourceModel.Settings.fileVersionId = file.fileVersionId;
                    App.ResourceModel.FileThumCollection.reset();
                    App.ResourceModel.FileThumCollection.fetch({
                        data: {
                            parentId: file.fileVersionId
                        }
                    });
                }
            }
        }
        var navHtml = new App.Comm.TreeViewMar(data);
        //不存在创建
        if ($treeViewMarUl.length <= 0) {
            $treeViewMar.html($(navHtml).find(".treeViewMarUl"));
        } else {
            if (parentId) {
                var $span = $treeViewMarUl.find("span[data-id='" + parentId + "']");
                if ($span.length > 0) {
                    var $li = $span.closest('li');
                    if ($li.find(".treeViewSub").length <= 0) {
                        $li.append('<ul class="treeViewSub mIconOrCk" style="display:block;" />');
                    }
                    var $itemContent = $li.children('.item-content'),
                        $noneSwitch = $itemContent.find(".noneSwitch");
                    if ($noneSwitch.length > 0) {
                        $noneSwitch.toggleClass('noneSwitch nodeSwitch on');
                    }
                    var $newLi = $(navHtml).find(".treeViewMarUl li").eq(0).removeClass("rootNode createNew").addClass('itemNode');
                    $li.find(".treeViewSub").prepend($newLi);
                }
            } else {
                $treeViewMarUl.prepend($(navHtml).find(".treeViewMarUl li"));
            }
        }
        if (App.ResourcesNav) {
            if (App.ResourcesNav.Settings.type == "standardLibs") {
                $('#resourceModelLeftNav').remove();
                $("#contains").append(new App.ResourceModel.LeftNav().render().el);
            } else if (App.ResourcesNav.Settings.type == "famLibs") {
                $('#resourceFamlibsLeftNav').remove();
                $("#contains").append(new App.ResourceFamLibs.leftNav().render().el);
            }
        }
    },
    afterRemoveFolder(file) {
        if (!file.folder) {
            return;
        }
        var $treeViewMar = $(".projectNavFileContainer .treeViewMar"),
            $treeViewMarUl = $treeViewMar.find(".treeViewMarUl");
        if ($treeViewMarUl.length > 0) {
            var $span = $treeViewMarUl.find("span[data-id='" + file.id + "']");
            if ($span.length > 0) {
                var $li = $span.closest('li'),
                    $parent = $li.parent();
                $li.remove();
                //没有文件夹了
                if ($parent.find("li").length <= 0) {
                    $parent.parent().children(".item-content").find(".nodeSwitch").removeClass().addClass("noneSwitch");
                }
            }
        }
    },
    //删除文件弹出层
    delFileDialog: function ($item) {
        var dialog = new App.Comm.modules.Dialog({
            width: 580,
            height: 168,
            limitHeight: false,
            title: (App.Local.data.system.notice || '删除文件提示'),
            cssClass: 'deleteFileDialog',
            okClass: "delFile",
            okText: (App.Local.data['model-view'].OK || '确&nbsp;&nbsp;认'),
            okCallback: function () {
                var fileVersionId = $item.find(".filecKAll").data("fileversionid"),
                    id = $item.find(".text").data("id"),
                    models = App.ResourceModel.FileCollection.models;
                if (App.ResourceModel.Settings.type == "famLibs") {
                    models = App.ResourceModel.FileThumCollection.models;
                }
                $(".count").text(models.length - 1);
                if (models.length == 0) {
                    this.$el.find(".fileContent").html('<li class="loading"><i class="iconTip"></i>' +
                        (App.Local.data.system.Nfd || '未搜索到相关文件/文件夹') +
                        '</li>');
                    return;
                }
                //修改数据
                $.each(models, function (i, model) {
                    if (model.toJSON().id == id) {
                        model.urlType = "deleteFile";
                        model.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
                        model.projectVersionId = App.ResourceModel.Settings.CurrentVersion.id;
                        model.fileVersionId = fileVersionId;
                        model.destroy();
                        return false;
                    }
                });
            },
            message: $item.find(".folder").length > 0 ? (App.Local.data.source.Ayfr || "确认要删除该文件夹么？") : (App.Local.data.source.Ayf || "确认要删除该文件么？")
        });
    },
    //获取文件名称 搜索
    getName(name) {
        var searchText = App.ResourceModel.Settings.searchText;
        if (searchText) {
            name = name.replace(searchText, '<span class="searchText">' + searchText + '</span>');
        }
        return name;
        /*var searchText = App.ResourceModel.Settings.searchText;
        var nameStr = "";
        if (searchText) {
            if(name.indexOf(searchText.toLowerCase())!=-1){
                nameStr = name.replace(searchText.toLowerCase(), '<span class="searchText">' + searchText.toLowerCase() + '</span>');
                console.log(nameStr);
            }else if(name.indexOf(searchText.toUpperCase())!=-1){
                nameStr = name.replace(searchText.toUpperCase(), '<span class="searchText">' + searchText.toUpperCase() + '</span>');
            }
        }else{
            nameStr = name;
        }
        return nameStr;*/
    }
}