/**
 * @author baoym@grandsoft.com.cn
 */
(function ($) {
    'use strict';
    var docUpload = {
        __container: null,
        init: function (container, options) {
            var self = this;
            self.__options = options;
            self.__container = container;
            //添加元素
            var upload = $('<div>', {
                'class': 'mod-plupload'
            }).appendTo(container);
            //初始化
            App.Comm.upload.init(upload, {
                getParentId: function () {
                    return App.Project.Settings.fileId;
                },
                getQuotaInfo: function () {
                    return self.getQuotaInfo()
                },
                //是否可以上传
                canUploadFile: function () {
                    if ($('.theEnd').length || $('#file-upload-btn').hasClass('disable')) {
                        return false;
                    } else {
                        return true;
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
                            projectId: App.Project.Settings.projectId,
                            projectVersionId: App.Project.Settings.CurrentVersion.id
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
                    // if (file.hint === "上传成功，正在处理中...") {
                    //     return;
                    // }
                    var data = JSON.parse(response.response);
                    //上传成功 且 是在当前文件夹下 才显示 上传的文件
                    if (App.Project.Settings.fileId && data.code == 0) {
                        //文件夹
                        if (data.data.folder) {
                            this.afterCreateNewFolder(data.data);
                            //App.Project.afterCreateNewFolder(data.data, data.data.parentId);
                        }
                        if (App.Project.Settings.fileId == data.data.parentId) {
                            App.Project.FileCollection.set(data.data, {remove: false});
                            // App.Project.FileCollection.push(data.data);
                        }
                    }
                },
                //上传文件后操作
                afterCreateNewFolder: function (data) {
                    App.Project.afterCreateNewFolder(data, data.parentId);
                    if (data.children) {
                        var count = data.children.length;
                        for (var i = 0; i < count; i++) {
                            this.afterCreateNewFolder(data.children[i]);
                        }
                    }
                },
                //上传失败
                uploadError: function (file) {
                    debugger;
                    var message = file.message;
                    var code = message.substr(0, 5);
                    if (code == '19041') {
                        var lockerId = message.match(/[0-9]+/g).pop();
                        $.ajax({
                            url: App.API.URL.fetchServicesUserName + lockerId + "?outer=false",
                            type: "GET",
                            success: function (res) {
                                if (res.code == 0 && res.data) {
                                    alert('上传失败。' + '文件：' + file.file.name + "已锁定！锁定人是：" + res.data.name);  //+ file.message
                                } else if (res.code == '18012') {
                                    alert('上传失败。' + '文件：' + file.file.name + "已锁定！锁定人是：" + res.message);
                                }
                            },
                            error: function (err) {
                                alert('网络请求失败');
                            }
                        });
                    } else if (code == '19044') {
                        alert('上传失败。版本已经发布，不能上传');
                    } else {
                        alert('上传失败:' + message);
                    }
                }
            });
            self.updateQuotaInfo()
            return true;
        },
        destroy: function () {//销毁上传
            App.Comm.upload.destroy();//销毁上传
        },
        //获取上传容量
        getQuotaInfo: function () {
            var quota = this.quota;
            return ""; //App.Comm.modules.util.format('共 $0，已用 $1', [App.common.modules.util.formatSize(quota.total), App.common.modules.util.formatSize(quota.used)])
        },
        //更新上传容量
        updateQuotaInfo: function () {
            App.Comm.upload.setQuotaInfo(this.getQuotaInfo())
        }
    }
    App.modules.docUpload = docUpload
})(jQuery)