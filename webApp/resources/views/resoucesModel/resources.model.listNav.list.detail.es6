App.ResourceModel.ListNavDetail = Backbone.View.extend({
    tagName: "li",
    className: "item",
    isLoad: false,
    template: _.templateUrl("/resources/tpls/resourceModel/resource.model.list.nav.detail.html"),
    initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.destroy);
    },
    //事件绑定
    events: {
        "click .fileName  .text": "fileClick",
        "click .btnEnter": "enterEditNameOrCreateNew",
        "click .btnCalcel": "calcelEditName",
        "click .ckAll": "singleCheck"
    },
    render: function () {
        var data = this.model.toJSON();
        data.isSearch = data.isSearch || false;
        data.exception = data.excptionFile === 2 ? (App.Local.data["source-model"].mpm || '模型异常') : '';
        this.$el.html(this.template(data)).data("status", data.status);
        this.$el.removeClass('createNew');
        this.bindContext();
        return this;
    },
    //文件或者文件夹点击
    fileClick(event) {
        // debugger;
        var $target = $(event.target),
            id = $target.data("id"),
            isFolder = $target.data("isfolder");
        //文件夹
        if (isFolder) {
            var $leftItem = $("#resourceModelLeftNav .treeViewMarUl span[data-id='" + id + "']");
            if ($leftItem.length > 0) {
                var $nodeSwitch = $leftItem.parent().find(".nodeSwitch");
                if ($nodeSwitch.length > 0 && !$nodeSwitch.hasClass('on')) {
                    $nodeSwitch.click();
                }
                $leftItem.click();
            }
            $('#navContainer .returnBack').removeClass('theEnd').attr('isReturn', '1').html((App.Local.data.source['s-b'] || '返回上级'));
        } else {
            if ($target.is('a') || /ALL.rvt/.test($target.text().trim()) || /AXIS.rvt/.test($target.text().trim())) {
                return;
            }
            const fileVersionId = $target.parent().siblings('[data-fileversionid]').data('fileversionid');

            App.Comm.previewFile({
                projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
                projectVersionId: App.ResourceModel.Settings.CurrentVersion.id,
                fileVersionId,
                fail() {
                    App.Comm.checkDownLoad(App.ResourceModel.Settings.CurrentVersion.projectId, App.ResourceModel.Settings.CurrentVersion.id, fileVersionId);

                }
            }, $target);

        }
    },
    disablePreview($ele) {
        const arr = ['dwg', 'rvt', 'rfa', 'rte'];
        let text = $ele.text();
        return arr.indexOf($.trim(text.split('.').slice(-1))) === -1 || /All|AXIS/i.test(text) || $ele.data('modelstatus') === '';
    },
    //绑定右键菜单
    bindContext: function (event) {
        var that = this;
        this.$el.contextMenu('listContext', {
            //显示 回调
            onShowMenuCallback: function (event) {
                event.preventDefault();
                let $target = $(event.target);
                var $item = $target.closest(".item");
                var downLoadModel = $("#downLoadModel");//下载按钮
                if (App.AuthObj.lib && App.AuthObj.lib.model && App.AuthObj.lib.model.download) {
                } else {
                    downLoadModel.addClass('disable').attr('disabled', 'disabled');
                }
                $("#reNameModel").removeClass('disable');
                //预览
                if ($item.find(".folder").length > 0 || that.disablePreview($target)) {
                    $("#previewModel").addClass("disable");
                    $("#previewModel").find("a").removeAttr("href");
                } else {
                    $("#previewModel").removeClass("disable");
                    var href = $item.find(".fileName .text").prop("href");
                    $("#previewModel").find("a").prop("href", href);
                    //重命名 未上传
                    if ($item.data("status") == 1) {
                        $("#reNameModel").addClass('disable');
                    }
                }
                $item.addClass("selected").siblings().removeClass("selected");
                if (!App.Comm.isAuth('rename', 'model')) {
                    $("#reNameModel").addClass('disable').attr('disabled', 'disabled');
                }
                if (!App.Comm.isAuth('delete', 'model')) {
                    $("#delModel").addClass('disable').attr('disabled', 'disabled');
                }
                if ($('#listContext li[class!=disable]').length == 0) {
                    $('#listContext').parent().hide();
                }
            },
            shadow: false,
            bindings: {
                'previewModel': function ($target) {
                    //预览
                },
                'downLoadModel': function (item) {
                    if ($('#downLoadModel').is('.disable')) {
                        return ''
                    }
                    //下载
                    var $item = $(item),
                        fileVersionId = $item.find(".filecKAll").data("fileversionid");
                    App.Comm.checkDownLoad(App.ResourceModel.Settings.CurrentVersion.projectId, App.ResourceModel.Settings.CurrentVersion.id, fileVersionId);
                },
                'delModel': function (item) {
                    if ($('#delModel').is('.disable')) {
                        return ''
                    }
                    //删除提示
                    App.ResourceModel.delFileDialog($(item));
                },
                'reNameModel': function (item) {
                    if ($('#reNameModel').is('.disable')) {
                        return ''
                    }
                    //重命名
                    let $reNameModel = $("#reNameModel");
                    //不可重命名状态
                    if ($reNameModel.hasClass('disable')) {
                        return;
                    }
                    var $prevEdit = $("#resourceListContent .fileContent .txtEdit");
                    if ($prevEdit.length > 0) {
                        that.cancelEdit($prevEdit);
                    }
                    var $item = $(item),
                        $fileName = $item.find(".fileName"),
                        text = $fileName.find(".text").hide().text().trim();
                    $fileName.append('<input type="text" value="' + text + '" class="txtEdit txtInput" /> <span class="btnEnter myIcon-enter"></span><span class="btnCalcel pointer myIcon-cancel"></span>');
                }
            }
        });
    },
    //取消修改名称
    calcelEditName: function (event) {
        var $fileContent = $("#resourceListContent .fileContent"),
            $prevEdit = $fileContent.find(".txtEdit");
        if ($prevEdit.length > 0) {
            this.cancelEdit($prevEdit);
        }
        var $fileContent = $("#resourceListContent .fileContent");
        if ($fileContent.find("li").length <= 0) {
            $fileContent.html('<li class="loading">' + (App.Local.data['drawing-model'].Ndd || '无数据') + '</li>');
        }
    },
    //修改名称 或者创建
    enterEditNameOrCreateNew: function (event) {
        if (this.isLoad) {
            return
        }
        this.isLoad = true;
        var $item = $(event.target).closest(".item");
        //创建
        if ($item.find('span[data-id="createNew"]').length) {
            this.createNewFolder($item);
        } else {
            this.editFolderName($item);
        }
    },
    //执行修改
    editFolderName: function ($item) {
        var that = this,
            fileVersionId = $item.find(".filecKAll").data("fileversionid"),
            name = $item.find(".txtEdit").val().trim();
        // //请求数据
        var data = {
            URLtype: "putFileReName",
            type: "PUT",
            data: {
                projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
                projectVersionId: App.ResourceModel.Settings.CurrentVersion.id,
                fileVersionId: fileVersionId,
                name: name,
                // name: encodeURI(name)
            }
        };
        App.Comm.ajax(data, function (data) {
            that.isLoad = false;
            if (data.code == 0) {
                var models = App.ResourceModel.FileCollection.models,
                    id = data.data.id;
                $.each(models, (i, model) => {
                    var dataJson = model.toJSON();
                    if (dataJson.id == id) {
                        //backbone 中 数据相同不会修改
                        if (dataJson.name == data.data.name) {
                            that.cancelEdit($item.find(".txtEdit"));
                        } else {
                            model.set(data.data);
                        }
                        return false;
                    }
                });
                //tree name
                $("#resourceModelLeftNav .treeViewMarUl span[data-id='" + id + "']").text(name);
            } else {
                $.tip({ message: "修改失败", type: 'alarm' });
                //取消
                var $prevEdit = $item.find(".txtEdit");
                if ($prevEdit.length > 0) {
                    $prevEdit.prev().show().end().nextAll().remove().end().remove();
                }
            }
        });
    },
    //创建文件夹
    createNewFolder: function ($item) {
        var filePath = $item.find(".txtEdit").val().trim(),
            that = this,
            $leftSel = $("#resourceModelLeftNav .treeViewMarUl .selected"),
            parentId = "";
        if ($leftSel.length > 0) {
            parentId = $leftSel.data("file").fileVersionId;
        }
        // //请求数据
        var data = {
            URLtype: "createNewFolder",
            type: "POST",
            data: {
                projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
                projectVersionId: App.ResourceModel.Settings.CurrentVersion.id,
                parentId: parentId,
                filePath: filePath
            }
        };
        App.Comm.ajax(data, function (data) {
            that.isLoad = false;
            if (data.code == 0) {
                var id = data.data.id,
                    isExists = false;
                $.each(App.ResourceModel.FileCollection.models, function (i, item) {
                    if (item.id == id) {
                        isExists = true;
                        return false;
                    }
                });
                //已存在的不在添加 返回
                if (isExists) {
                    that.cancelEdit($item.find(".fileName"));
                    return;
                }
                var models = App.ResourceModel.FileCollection.models;
                data.data.isAdd = false;
                //修改数据
                App.ResourceModel.FileCollection.last().set(data.data);
                App.ResourceModel.afterCreateNewFolder(data.data, parentId);
                //tree name
                //$("#resourceModelLeftNav .treeViewMarUl span[data-id='" + id + "']").text(name);
            } else {
                if (data.code == '19007') {
                    $.tip({ type: 'alarm', message: '文件夹已经存在、无法重复创建' })
                } else if (data.code == '10000') {
                    $.tip({ type: 'alarm', message: '系统错误' })
                }
            }
        });
    },
    //取消修改
    cancelEdit: function ($prevEdit) {
        var $item = $prevEdit.closest(".item");
        if ($item.find('span[data-id="createNew"]').length) {
            //取消监听 促发销毁
            var model = App.ResourceModel.FileCollection.last();
            model.stopListening();
            model.trigger('destroy', model, model.collection);
            //	App.ResourceModel.FileCollection.models.pop();
            //删除页面元素
            $item.remove();
        } else {
            $prevEdit.prev().show().end().nextAll().remove().end().remove();
        }
    },
    //销毁
    destroy: function (model) {

        //新建的  不用处理
        if (model.toJSON().id != "createNew") {
            this.$el.remove();
            App.ResourceModel.afterRemoveFolder(model.toJSON());
        }
    },
    //是否全选
    singleCheck(event) {
        if (this.$el.parent().find(".ckAll:not(:checked)").length > 0) {
            $("#resourceListContent .header .ckAll").prop("checked", false);
        } else {
            $("#resourceListContent .header .ckAll").prop("checked", true);
        }
    }
});