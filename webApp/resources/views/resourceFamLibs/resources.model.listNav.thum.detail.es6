//列表
App.ResourceModel.ThumDetail = Backbone.View.extend({
    tagName: "li",
    className: "item",
    isLoad: false,
    //事件绑定
    events: {
        "click .boxText": "fileClick",
        "click .btnEnter": "enterEditNameOrCreateNew",
        "click .btnCalcel": "calcelEditName",
        "click .ckMe": "itemSelected",
        "keyup .txtEdit": "enterCreateNew",
        "click .txtEdit": "returnPop",
        //	"click .ckMe": "stopPop",
        'click .returnBack': 'returnBack'
    },
    initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.destroy);
    },
    template: _.templateUrl("/resources/tpls/resourceFamLibs/resources.model.listNav.thum.detail.html"),
    //渲染
    render: function () {
        var data = this.model.toJSON();
        this.$el.html(this.template(data)).data("status", data.status);
        // if (data.isAdd) {
        //     this.$el.addClass('createNew');
        // } else {
        this.$el.removeClass('createNew');
        // }
        this.bindContext();
        return this;
    },
    itemSelected(event) {
        var $target = $(event.target),
            ck = $target.prop("checked");
        $target.closest(".item")[ck ? 'addClass' : 'removeClass']('selected');
        event.stopPropagation();
    },
    returnBack: function () {
        //alert();
    },
    //文件或者文件夹点击
    fileClick: function (event) {
        var $target = $(event.target).closest(".boxText"),
            id = $target.data("id"),
            isFolder = $target.data("isfolder");
        //文件夹
        if (isFolder) {
            var $leftItem = $("#resourceFamlibsLeftNav .treeViewMarUl span[data-id='" + id + "']");
            if ($leftItem.length > 0) {
                var $nodeSwitch = $leftItem.parent().find(".nodeSwitch");
                if ($nodeSwitch.length > 0 && !$nodeSwitch.hasClass('on')) {
                    $nodeSwitch.click();
                }
                $leftItem.click();
            }
            $('#navContainer .returnBack').removeClass('theEnd').attr('isReturn', '1').html((App.Local.data.source['s-b'] || '返回上级'));
        } else {
            if ($target.is('a')) {
                return;
            }
            const fileVersionId = $target.children('[data-fileversionid]').data('fileversionid');

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

        return $ele.is('span');
    },
    //绑定右键菜单
    bindContext: function (event) {
        var that = this;
        this.$el.contextMenu('listContextFamily', {
            //显示 回调
            onShowMenuCallback: function (event) {
                event.preventDefault();
                let $target = $(event.target);
                var $item = $target.closest(".item");
                var downLoadModelFamily = $("#downLoadModelFamily");//下载按钮
                if (App.AuthObj.lib && App.AuthObj.lib.family && App.AuthObj.lib.family.download) {
                } else {
                    downLoadModelFamily.addClass('disable').attr('disabled', 'disabled');
                }
                $("#reNameModelFamily").removeClass('disable');
                //预览
                if ($item.find(".folder").length > 0 || that.disablePreview($(event.currentTarget).find('.fileName span'))) {
                    $("#previewModelFamily").addClass("disable");
                    $("#previewModelFamily").find("a").removeAttr("href");
                } else {
                    $("#previewModelFamily").removeClass("disable");
                    var href = $item.find(".boxText").prop("href");
                    $("#previewModelFamily").find("a").prop("href", href);
                    //重命名 未上传
                    if ($item.data("status") == 1) {
                        $("#reNameModelFamily").addClass('disable');
                    }
                }
                $item.addClass("selected").siblings().removeClass("selected");
                if (!App.Comm.isAuth('rename', 'family')) {
                    $("#reNameModelFamily").addClass('disable').attr('disabled', 'disabled');
                }
                if (!App.Comm.isAuth('delete', 'family')) {
                    $("#delModelFamily").addClass('disable').attr('disabled', 'disabled');
                }
                if ($('#listContextFamily li[class!=disable]').length == 0) {
                    $('#listContextFamily').parent().hide();
                }
            },
            shadow: false,
            bindings: {
                'previewModel': function ($target) {
                    //预览
                },
                'downLoadModelFamily': function (item) {
                    if ($('#downLoadModel').is('.disable')) {
                        return ''
                    }
                    //下载
                    var $item = $(item),
                        fileVersionId = $item.find(".filecKAll").data("fileversionid");
                    App.Comm.checkDownLoad(App.ResourceModel.Settings.CurrentVersion.projectId, App.ResourceModel.Settings.CurrentVersion.id, fileVersionId);
                },
                'delModelFamily': function (item) {
                    if ($('#delModel').is('.disable')) {
                        return ''
                    }
                    //删除提示
                    App.ResourceModel.delFileDialog($(item));
                },
                'reNameModelFamily': function (item) {
                    if ($('#reNameModel').is('.disable')) {
                        return ''
                    }
                    //重命名
                    let $reNameModel = $("#reNameModel");
                    //不可重命名状态
                    if ($reNameModel.hasClass('disable')) {
                        return;
                    }
                    var $prevEdit = $("#resourceThumContent .thumContent .txtEdit");
                    if ($prevEdit.length > 0) {
                        that.cancelEdit($prevEdit);
                    }
                    var $item = $(item),
                        $fileName = $item.find(".fileName"),
                        text = $item.find(".text").hide().text().trim();
                    $fileName.append('<input type="text" value="' + text + '" class="txtEdit txtInput" /> <span class="btnEnter myIcon-enter"></span><span class="btnCalcel pointer myIcon-cancel"></span>');
                }
            }
        });
    },
    //取消修改名称
    calcelEditName: function (event) {
        var $prevEdit = this.$el.find(".txtEdit");
        if ($prevEdit.length > 0) {
            this.cancelEdit($prevEdit);
        }
        var $fileContent = $("#resourceThumContent .thumContent");
        if ($fileContent.find("li").length <= 0) {
            $fileContent.html('<li class="loading">' + (App.Local.data['drawing-model'].Ndd || '无数据') + '</li>');
        }
        return false;
    },
    //回车创建
    enterCreateNew(event) {
        if (event.keyCode == 13) {
            this.enterEditNameOrCreateNew(event);
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
        return false;
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
            if (data.message == "success") {
                var models = App.ResourceModel.FileThumCollection.models,
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
                $("#resourceFamlibsLeftNav .treeViewMarUl span[data-id='" + id + "']").text(name);
            } else {
                alert("修改失败");
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
        var that = this;
        that.isLoad = false;
        var filePath = $item.find(".txtEdit").val().trim(),
            that = this,
            $leftSel = $("#resourceFamlibsLeftNav .treeViewMarUl .selected"),
            parentId = "";
        if ($leftSel.length > 0) {
            parentId = $leftSel.data("file").fileVersionId;
            /*
            write by wuweiwei
            描述:当新建文件夹后,左侧树会重新加载;所以需要这里保存当前文件夹的父文件夹id
            */
            App.ResourceModel.Settings.currentParentId = $leftSel.data("id");
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
            if (data.message == "success") {
                var id = data.data.id,
                    isExists = false;
                $.each(App.ResourceModel.FileThumCollection.models, function (i, item) {
                    if (item.id == id) {
                        isExists = true;
                        return false;
                    }
                });
                //已存在的不在添加 返回
                if (isExists) {
                    that.cancelEdit($item.find(".thumBg"));
                    return;
                }
                //修改数据
                App.ResourceModel.FileThumCollection.last().set(data.data);
                App.ResourceModel.afterCreateNewFolder(data.data, parentId);
                //tree name
                //$("#resourceModelLeftNav .treeViewMarUl span[data-id='" + id + "']").text(name);
            } else {
                if (data.code == '19007') {
                    $.tip({ type: 'alarm', message: data.message })
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
            var model = App.ResourceModel.FileThumCollection.last();
            model.stopListening();
            model.trigger('destroy', model, model.collection);
            //App.ResourceModel.FileThumCollection.models.pop();
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
    //阻止浏览器默认行为
    returnPop(event) {
        event.stopPropagation();
        $(event.target).focus();
        return false;
    },
    //禁止冒泡
    stopPop(event) {
        event.stopPropagation();
    }
});