/**
 * @author baoym@grandsoft.com.cn
 */
(function ($) {
    'use strict'
    var docUpload = {
        __container: null,
        init: function (container, options) {
            var self = this;
            self.__options = options;
            self.__container = container;
            //添加元素
            var upload = $('<div>', {
                'class': 'mod-plupload'
            }).appendTo(container)
            //初始化
            App.Comm.upload.init(upload, {
                isResource:true,
                beforeAdd: function (files) {
                    var i;
                    var name = "";
                    var result = true;
                    if (!App.ResourceModel.Settings.fileVersionId) {
                        //jquery.plupload.quere.js b绑定了 FilesAdded 这个时候文件已经存在了，所以 要删除
                        App.isUploading = false;
                        alert("请选择要上传的文件夹");
                        return;
                    } else {
                        App.isUploading = true;
                    }
                    if (!arguments.length) {
                        debugger;
                        var tipDialogBg = $('<div class="tipDialogBgBox upload-folder-bg" id="tipDialogBgBox"></div>');
                        var tipDialogBox = $('<div class="tipDialogBox-dnd" id="J_tipDialogBox"></div>').css('display', 'block');
                        const $img = $('<img>', {
                            src: "/static/dist/images/comm/pluging/jqueryPluploadQueue/img/close.png",
                            class: "close-dnd"
                        })
                        const uploadDialog = new App.UploadDialog;
                        $("body")
                            .append(tipDialogBg)
                            .append(tipDialogBox)
                            .append($img);
                        $("#J_tipDialogBox").html(uploadDialog.render().el);
                        return;
                    }
                    if (files instanceof Array) {
                        for (i = 0; i < files.length; i++) {
                            name = files[i].name;
                            if (name.indexOf(".db") > 0) {
                                alert("不能上传扩展名为.db的文件，请重新选择！");
                                result = false;
                                break;
                            }
                        }
                    }
                    return result;
                },
                getParentId: function () {
                    return App.ResourceModel.Settings.fileVersionId;
                },
                getQuotaInfo: function () {
                    return self.getQuotaInfo()
                },
                //是否可以上传
                canUploadFile: function () {
                    if (App.ResourceModel.Settings.fileVersionId) {
                        return true;
                    } else {
                        return false;
                    }
                    //return App.Comm.modules.util.canUploadFile()
                },
                // getUploadedBytesUrl: function(parentId) {
                //     // return App.Comm.modules.util.getUrl(parentId, {
                //     //     bytes: false
                //     // })
                // },
                //获取上传url
                getUploadUrl: function (file) {
                    var data = {
                        data: {
                            projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
                            projectVersionId: App.ResourceModel.Settings.CurrentVersion.id
                        },
                        URLtype: "uploadFile"
                    };
                    return App.Comm.getUrlByType(data).url;
                    //return "http://172.16.233.210:8080/bim/api/1232321/file/data?fileId=444444444444";
                    // return App.Comm.modules.util.getUrl(App.Comm.modules.util.getParentId(), {
                    //     upload: false,
                    //     returnFirst: false
                    // })
                },
                //上传成功
                fileUploaded: function (response, file) {
                    var data = JSON.parse(response.response),
                        type = App.ResourceModel.Settings.type,
                        models = App.ResourceModel.FileCollection.models,
                        $leftSel = $("#resourceFamlibsLeftNav .treeViewMarUl .selected"),
                        parentId = "",
                        collection = null,
                        has = false;
                    if (type == "famLibs") {
                        models = App.ResourceModel.FileThumCollection.models;
                    } else if (type == "standardLibs") {
                        models = App.ResourceModel.FileCollection.models;
                    }
                    $.each(models, function (index, model) {
                        if (model.toJSON().id == data.data.id) {
                            has = true;
                            model.set(data.data);
                            return false;
                        }
                    });
                    //新增
                    if (!has) {
                        data.data.isAdd = true;
                        if (type == "famLibs") {
                            App.ResourceModel.FileThumCollection.add(data.data);
                            collection = App.ResourceModel.FileThumCollection;
                        } else if (type == "standardLibs") {
                            collection = App.ResourceModel.FileCollection;
                            App.ResourceModel.FileCollection.add(data.data);
                        }
                    }
                    if ($leftSel.length > 0) {
                        parentId = App.ResourceModel.Settings.fileVersionId;
                    }
                    if (data.data.folder) {
                        this.afterCreateNewFolder(data.data);
                        //App.ResourceModel.afterCreateNewFolder(data.data, parentId);
                    }
                    //$.jps.publish('add-upload-file', response, file)
                },
                //上传文件后操作
                afterCreateNewFolder(data) {
                    App.ResourceModel.afterCreateNewFolder(data, data.parentId);
                    if (data.children) {
                        var count = data.children.length;
                        for (var i = 0; i < count; i++) {
                            this.afterCreateNewFolder(data.children[i]);
                        }
                    }
                },
                //上传失败
                uploadError: function (file) {
                    //App.Comm.modules.util.actionTip('上传失败:' + file.message + '。文件：' + file.file.name)
                }
            })
            self.updateQuotaInfo()
        },
        //获取上传容量
        getQuotaInfo: function () {
            //var quota = this.quota;
            //return "共 20GB，已用 564.2MB"; //App.Comm.modules.util.format('共 $0，已用 $1', [App.common.modules.util.formatSize(quota.total), App.common.modules.util.formatSize(quota.used)])
        },
        //更新上传容量
        updateQuotaInfo: function () {
            App.Comm.upload.setQuotaInfo(this.getQuotaInfo())
        }
    }
    App.ResourceUpload = docUpload
})(jQuery)