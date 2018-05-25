App.ResourceModel.TopBar = Backbone.View.extend({
    tagName: "div",
    className: "topBar",
    events: {
        "click .btnNewFolder": "createNewFolder", //创建文件夹
        "click .btnFileDownLoad": "fileDownLoad", //文件下载
        "click .btnFileDel": "deleteFile", //删除文件
        'click .returnBack': 'returnBack',
        "click .btnFileSearch": "fileSearch",
        "click .clearSearch": "clearSearch",
        "keyup #txtFileSearch": "enterSearch",
        "click .btnFileState": "btnFileStateFun",
    },
    template: _.templateUrl('/resources/tpls/resourceModel/resource.model.listNav.list.topBar.html'),
    render: function () {
        var type = App.ResourcesNav.Settings.type == "famLibs" ? 'family' : 'model';
        this.$el.html(this.template({type: type}));
        if (!App.Comm.isAuth('create', type)) {
            this.$('.btnNewFolder').addClass('disable');
        }
        //删除、重命名权限判断方式一样
        if (!App.Comm.isAuth('upload', type)) {
            this.$('.btnFileUpload ').addClass('disable');
        }
        if (!App.Comm.isAuth('delete', type)) {
            this.$('.btnFileDel ').addClass('disable');
        }
        if(type == "family"){
            if(App.AuthObj.lib&&App.AuthObj.lib.family&&App.AuthObj.lib.family.download){
                
            }else{
                this.$('.btnFileDownLoad').addClass('disable');
            }
        }else if(type == "model"){
           if(App.AuthObj.lib&&App.AuthObj.lib.model&&App.AuthObj.lib.model.download){
               
           }else{
                this.$('.btnFileDownLoad').addClass('disable'); 
           }
        }
        
        // if(!App.Comm.isAuth('down',type)){
        //     this.$('.btnFileDownLoad').addClass('disable');
        // }
        // debugger;
        // if (App.AuthObj.lib) {
        // 	debugger;
        // 	if(!App.Comm.isAuth('create',type)){
        // 	this.$('.btnNewFolder').addClass('disable');
        // }
        // //删除、重命名权限判断方式一样
        // if(!App.Comm.isAuth('upload',type)){
        // 	this.$('.btnFileUpload ').addClass('disable');
        // }
        // if(!App.Comm.isAuth('delete',type)){
        // 	this.$('.btnFileDel ').addClass('disable');
        // }
        // }
        return this;
    },
    //文件转换状态的方法
    btnFileStateFun() {//add zhangyankai
        if (App.ResourcesNav.Settings.type == "famLibs") return;
        var addDialogEleDom = new App.ResourceModel.FileStatus().render().el;
        var fileStateDialog = new App.Comm.modules.Dialog({
            title: App.Local.data['drawing-model'].CPs || "平台文件处理结果",
            width: 700,
            height: 300,
            isConfirm: false,
            isAlert: false,
            cssClass: 'fileStateDialogClass',
            closeCallback: function () {
            },
            message: addDialogEleDom
        });
    },
    isDisabled: function () {
        if (App.ResourceModel.Settings.CurrentVersion.status == 4 ||
            App.ResourceModel.Settings.CurrentVersion.status == 7) {
            return true
        }
        return false;
    },
    returnBack: function (e) {
        if ($(e.currentTarget).attr('isReturn') == '0') {
            return
        }
        var type = App.ResourcesNav.Settings.type;
        var id = type == "standardLibs" ? "resourceModelLeftNav" : "resourceFamlibsLeftNav";
        var $currentLevel = $('#' + id + ' .treeViewMarUl .selected');
        var file = $currentLevel.data('file');
        var parentId = file.parentId;
        var $parent = $('#' + id + ' .treeViewMarUl span[data-id="' + parentId + '"]');
        if ($parent.length) {
            $parent.click();
        } else {
            $(e.currentTarget).attr('isReturn', '0').addClass('theEnd').html((App.Local.data['drawing-model'].AFs || '全部文件'));
            $('#' + id + ' .treeViewMarUl .selected').removeClass('selected');
            App.ResourceModel.Settings.fileVersionId = '';
            if (type == "standardLibs") {
                App.ResourceModel.FileCollection.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
                App.ResourceModel.FileCollection.projectVersionId = App.ResourceModel.Settings.CurrentVersion.id;
                App.ResourceModel.FileCollection.reset();
                App.ResourceModel.FileCollection.fetch({
                    success: function () {
                        $("#pageLoading").hide();
                    }
                });
            } else if (type == "famLibs") {
                App.ResourceModel.FileThumCollection.projectId = App.ResourceModel.Settings.CurrentVersion.projectId;
                App.ResourceModel.FileThumCollection.projectVersionId = App.ResourceModel.Settings.CurrentVersion.id;
                App.ResourceModel.FileThumCollection.reset();
                App.ResourceModel.FileThumCollection.fetch({
                    success: function () {
                        $("#pageLoading").hide();
                    }
                });
            }
        }
    },
    //创建新文件家
    createNewFolder: function (e) {
        if ($(e.currentTarget).is('.disable')) {
            return
        }
        App.ResourceModel.createNewFolder();
    },
    //下载
    fileDownLoad: function (e) {
        if ($(e.currentTarget).is('.disable')) {
            return
        }
        var $resourceListContent = $("#resourceListContent"),
            $selFile = $resourceListContent.find(".fileContent :checkbox:checked").parent();
        if (App.ResourceModel.Settings.type == "famLibs") {
            $resourceListContent = $("#resourceThumContent");
            $selFile = $resourceListContent.find(".thumContent :checkbox:checked").parent();
        }
        if ($selFile.length < 1) {
            alert((App.Local.data.source.StD || "请选择需要下载的文件"));
            return;
        }
        var FileIdArr = [];
        $selFile.each(function (i, item) {
            FileIdArr.push($(this).data("fileversionid"));
        });
        var fileVersionId = FileIdArr.join(",");
        //下载
        App.Comm.checkDownLoad(App.ResourceModel.Settings.CurrentVersion.projectId, App.ResourceModel.Settings.CurrentVersion.id, fileVersionId);
    },
    //删除文件
    deleteFile: function (e) {
        if ($(e.currentTarget).is('.disable')) {
            return
        }
        var $resourceListContent = $("#resourceListContent"),
            $selFile = $resourceListContent.find(".fileContent :checkbox:checked");
        if (App.ResourceModel.Settings.type == "famLibs") {
            $resourceListContent = $("#resourceThumContent");
            $selFile = $resourceListContent.find(".thumContent :checkbox:checked");
        }
        if ($selFile.length > 1) {
            alert((App.Local.data.source.Oot || '目前只支持单文件删除...'));
            return;
        }
        if ($selFile.length < 1) {
            alert((App.Local.data.source.stde || '请选择需要删除的文件...'));
            return;
        }
        var $item = $selFile.closest(".item");
        //删除
        App.ResourceModel.delFileDialog($item);
    },
    //回车搜索
    enterSearch(event) {
        if (event.keyCode == 13) {
            this.fileSearch();
        }
    },
    //搜索
    fileSearch() {
        var txtSearch = $("#txtFileSearch").val().trim();
        //没有搜索内容
        if (!txtSearch) {
            return;
        }
        //搜索赋值
        App.ResourceModel.Settings.searchText = txtSearch;
        var data = {
            URLtype: "fileSearch",
            data: {
                projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
                versionId: App.ResourceModel.Settings.CurrentVersion.id,
                key: txtSearch
            }
        }
        App.Comm.ajax(data, (data) => {
            if (data.code == 0) {
                var count = data.data.length,
                    collection,
                    type = App.ResourceModel.Settings.type;
                this.$(".clearSearch").show();
                this.$(".opBox").find(".btnNewFolder").hide();
                this.$(".opBox").find(".btnFileUpload").hide();
                this.$(".opBox").find(".btnFileState").hide();
                this.$(".searchCount").show().find(".count").text(count);
                if (type == "standardLibs") {
                    collection = App.ResourceModel.FileCollection;
                } else if (type == "famLibs") {
                    collection = App.ResourceModel.FileThumCollection;
                }
                collection.reset();
                if (count > 0) {
                    var _temp = data.data || [];
                    // _.each(_temp,function(item){
                    // 	item.isSearch='search';
                    // })
                    collection.push(_temp);
                } else {
                    collection.trigger("searchNull");
                }
            }
        });
    },
    //搜索为空
    searchNull() {
        this.$el.find(".fileContent").html('<li class="loading"><i class="iconTip"></i>' +
            (App.Local.data.system.Nfd || '未搜索到相关文件/文件夹') +
            '</li>');
    },
    //清除搜索
    clearSearch() {
        this.$(".clearSearch").hide();
        this.$(".opBox").find(".btnNewFolder").show();
        this.$(".opBox").find(".btnFileUpload").show();
        this.$(".opBox").find(".btnFileState").show();
        // this.$(".opBox").show();
        this.$(".searchCount").hide();
        $("#txtFileSearch").val("");
        $(".ckAll").prop("checked", false);
        App.ResourceModel.Settings.searchText = "";
        var collection,
            type = App.ResourceModel.Settings.type;
        if (type == "standardLibs") {
            collection = App.ResourceModel.FileCollection;
        } else if (type == "famLibs") {
            collection = App.ResourceModel.FileThumCollection;
        }
        collection.reset();
        var $selectFile = $("#resourceFamlibsLeftNav .selected");
        if (App.ResourceModel.Settings.fileVersionId) {
            collection.fetch({
                data: {
                    parentId: App.ResourceModel.Settings.fileVersionId
                }
            });
        } else {
            collection.fetch();
        }
    },
});