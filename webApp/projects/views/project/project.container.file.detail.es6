App.Project.FileContainerDetail = Backbone.View.extend({
    tagName: "li",
    className: "item",
    //初始化
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.destroy);
    },
    //事件绑定
    events: {
        "click .fileName  .text": "fileClick",
        "click .ckAll": "singleCheck",
        "click .btnCalcel": "cancelEdit",
        "click .btnEnter": "enterEditNameOrCreateNew"
    },
    template: _.templateUrl("/projects/tpls/project/project.container.file.detail.html"),
    //渲染
    render: function () {
        var data = this.model.toJSON();
        $('#projectContainer .fileContainer .ckAll').show();
        //todo emulation exception
        // data.excptionFile=2;
        data.exception = data.excptionFile === 2 ? (App.Local.data["source-model"].mpm || '模型异常') : '';
        this.$el.html(this.template(data));
        //判断什么类型的项目 BIM总发包或者总包交钥匙
        this.initDomHandle(this.$el);//初始化页面的结构
        this.$el.removeClass('createNew');
        App.Project.bindContextMenu(this.$el);
        return this;
    },
    initDomHandle(ele) {//初始化页面的结构
        if (!App.Project.Settings.isBimControl) {
            ele.find("span.btnFileState").hide();
            ele.find("span.changeContrast").hide();
            ele.find("span.btnFileUpload").addClass('disable');
        }
    },
    //文件或者文件夹点击
    fileClick: function (event) {
        var $target = $(event.target), id = $target.data("id"), isFolder = $target.data("isfolder");
        //文件夹
        if (isFolder) {
            var $leftItem = $("#projectContainer .projectNavContentBox .treeViewMarUl span[data-id='" + id + "']");
            if ($leftItem.length > 0) {
                var $nodeSwitch = $leftItem.parent().find(".nodeSwitch");
                if ($nodeSwitch.length > 0 && !$nodeSwitch.hasClass('on')) {
                    $nodeSwitch.click();
                }
                $leftItem.click();
            }
            $('#projectContainer .returnBack').attr('isReturn', '1').removeClass('theEnd').html((App.Local.data.source['s-b'] || '返回上级'));
        } else {
            // todo the file is converting?
            // this.fetchFileModelIdByFileVersionId(id, $target);
            const fileVersionId = $target.parent().siblings('[data-fileversionid]').data('fileversionid');
            if ($target.text().includes('项目信息文件.xlsx') && $target.parent().nextAll('.fileSize').text().trim() === '') {
                // App.Comm.checkDownLoad(App.Project.Settings.projectId, App.Project.Settings.CurrentVersion.id, id);
            } else if ($target.is('span') && !App.Comm.isSpecialFileType($target.text())) {
                // if (parseInt($target.parent().siblings('.fileSize').text()) > 10) {
                // App.Comm.checkDownLoad(App.Project.Settings.projectId, App.Project.Settings.CurrentVersion.id, fileVersionId);
                // } else {
                App.Comm.previewFile({
                    projectId: App.Project.Settings.projectId,
                    projectVersionId: App.Project.Settings.CurrentVersion.id,
                    fileVersionId,
                    fail: () => {
                        App.Comm.checkDownLoad(App.Project.Settings.projectId, App.Project.Settings.CurrentVersion.id, fileVersionId);

                    }
                }, $target);

                // }
            }

        }
    },

    //获取文件模型id
    fetchFileModelIdByFileVersionId: function (id, $target) {
        var data = {
            URLtype: "fetchFileModelIdByFileVersionId",
            data: {
                projectId: App.Project.Settings.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id,
                fileVersionId: id
            }
        };
        App.Comm.ajax(data, function (data) {
            if (data.message == "success") {
                if (data.data.modelId) {
                } else {
                    $target.prop("href", "javascript:void(0);");
                    alert((App.Local.data["drawing-model"].TfCg || "模型转换中"));
                }
            } else {
                alert(data.message);
            }
        });
    },
    cancelEdit(e) {
        App.Project.calcelEditName(e);
    },
    enterEditNameOrCreateNew(e) {
        var $item = $(e.target).closest(".item");
        var $target = $(e.currentTarget);
        if ($target.hasClass('createNewCls')) {
            App.Project.createNewFolder($item);
        } else {
            App.Project.editFolderName($item);
        }
        //;
    },
    //是否全选
    singleCheck(event) {
        if (this.$el.parent().find(".ckAll:not(:checked)").length > 0) {
            $(".fileContentHeader  .header .ckAll").prop("checked", false);
        } else {
            $(".fileContentHeader  .header .ckAll").prop("checked", true);
        }
    },
    destroy(model) {
        this.$el.remove();
        App.Project.afterRemoveFolder(model.toJSON());
    }
});
