App.Project.NotesListDomView = Backbone.View.extend({
    defaults: {
        hasScrollBool: false
    },
    tagName: "div",
    className: "notesScrollBox",
    template: _.templateUrl("/projects/tpls/project/notes/project.notes.list.dom.html", true),
    events: {
        "click .clickItem": "notesClickHandle",//点击每个批注执行的方法
    },
    initialize() {//初始化
        this.listenTo(App.Project.NotesCollection.GetNotesListCollection, "reset", this.resetList);
        this.listenTo(App.Project.NotesCollection.GetNotesListCollection, "add", this.addOne);
    },
    render: function () {
        this.checkNotesCommentHandle();//检查批注和批注评论是否被删除
        this.defaults.hasScrollBool = false;
        App.Project.NotesCollection.defaults.toMeBool = true;
        this.$el.html(this.template);
        if (App.Project.Settings.shareBool || App.Project.Settings.messageBool) {
            App.Project.NotesCollection.defaults.toMeBool = false;
            if (App.Project.Settings.pageBool) {
                this.getPageNumHandler();//当时分享或者我的消息过来的时候 如果不存在分页就通过批注id去获取页数
            } else {
                this.loadNotesListHandle();//进入进来 获取批注列表的方法
            }
        }else {
            this.loadNotesListHandle();//进入进来 获取批注列表的方法
        }
        // else if (App.Project.Settings.messageBool&&location.hash.split('=').includes('message')) {
        //            App.Project.NotesCollection.defaults.toMeBool = false;
        //            if (App.Project.Settings.pageBool) {
        //                this.getPageNumHandler();//当时消息过来的时候 如果不存在分页就通过批注id去获取页数
        //            }else{
        //                this.loadNotesListHandle();//进入进来 获取批注列表的方法
        //            }            
        //        }
        return this;
    },
    checkNotesCommentHandle(){//检查批注和批注评论是否被删除
        var locationHref = location.href;
        var viewpointId = "",
            commentId = "",
            tipNotesReplyText = "评论已删除！";
        if(locationHref.indexOf("viewpointId")>0&&locationHref.indexOf("commentId")>0){
            if(App.Project.Settings.messageBool){
                viewpointId = locationHref.substring(locationHref.indexOf("viewpointId")+12,locationHref.indexOf("type=message")-1);
            }else{
                viewpointId = locationHref.substring(locationHref.indexOf("viewpointId")+12,locationHref.indexOf("commentId")-1);
            }
            commentId = locationHref.substring(locationHref.indexOf("commentId")+10);
            var data = {
                URLtype: "checkNotesComment",
                data: {
                    viewPointId:viewpointId,
                    commentId:commentId,
                }
            }
            App.Comm.ajax(data, (data) => {
                if (data.code == 0) {
                    if(data.data.isViewPointExist == 1&&data.data.isViewPointCommentExist==0){
                        $.tip({
                            message: tipNotesReplyText,
                            timeout: 3000,
                            type: "alarm"
                        }) 
                    }
                } else {
                    alert(data.message);
                }
            })
        }
    },
    getPageNumHandler() {//当时分享过来的时候 如果不存在分页就通过批注id去获取页数
        var parsm = {
            projectId: App.Project.Settings.shareProjectId,
            viewPointId: App.Project.Settings.viewpointShareUrlId,
            pageItemCount: 15,
        }
        var data = {
            URLtype: "getNotesPage",
            data: parsm,
            type: "get",
        }
        App.Comm.ajax(data, (data) => {
            if (data.code == 0) {
                App.Project.Settings.viewpointSharePageNum = data.data;
                this.loadNotesListHandle();//进入进来 获取批注列表的方法
            } else {
                alert(data.message);
            }
        })
    },
    loadNotesListHandle() {//进入进来 获取批注列表的方法
        var data = {}
        data.id = App.Project.Settings.viewpointShareUrlId;
        App.Project.NotesCollection.getNotesListHandle(data);//共用了获取批注列表的方法
        // if (window.location.href.indexOf("type") != -1) {
        //     data.id = App.Project.Settings.viewpointShareUrlId;
        // }
        // if (App.Project.Settings.viewpointSharePageNum) {
        //     data.pageIndex = parseInt(App.Project.Settings.viewpointSharePageNum);
        // }
    },
    notesClickHandle(evt) {//点击每个批注执行的方法
        var target = $(evt.target).closest("li");
        var notesId = target.children("input").data("notesid");
        var hosttype = target.children("input").data("hosttype");
        var viewpointInput = $("#viewpointInput");
        var rightNotesCommentListBox = $("#rightNotesCommentListBox");
        if (!target.hasClass('notesSelectClass')) {
            $('.deleteUploadImg').click();
            // debugger;
            if ($("#addCommentBox").is(':visible')) {
                $("#addCommentBox-p").show();
                $("#addCommentBox").hide();
                
            }
        }
        var commetnListBox = rightNotesCommentListBox.children('div.commetnListBox');
        if (evt.target.tagName == "A") {
            App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
            var $data = target.find("input");
            if ($(evt.target).hasClass('openMore')) {
                if ($(evt.target).hasClass("upIcon")) {
                    $(evt.target).removeClass("upIcon");
                    $(evt.target).siblings(".notesDescTextBox").css("height", "40px");
                    $(evt.target).siblings(".notesDescTextBox").css("display", "-webkit-box");
                } else {
                    $(evt.target).addClass("upIcon");
                    $(evt.target).siblings(".notesDescTextBox").css("height", "auto");
                    $(evt.target).siblings(".notesDescTextBox").css("display", "block");
                }
            } else if (evt.target.innerText == (App.Local.data['drawing-model'].CMl || '查看模型') && !$(evt.target).data("hosttype")) {
                viewpointInput.attr("data-viewpoint", target.children("input").data("viewpointid"));
                viewpointInput.attr("data-viewpointfilter", notesId);
                if (target.children("input").data("projectversionid") == App.Project.Settings.versionId) {
                    App.Project.NotesCollection.clickModelHandle();//执行查看模型方法
                } else {
                    window.location.href = "/#projects/" + App.Project.Settings.projectId + "/" + target.children("input").data("projectversionid") + "?openModel=true";
                }
                return false;
            } else if (evt.target.innerText == (App.Local.data['drawing-model'].Edit || "编辑")) {
                if (!$(evt.target).hasClass('noCan')) {
                    this.editNotesHandle($data);//编辑批注的方法
                }
                return false;
            } else if (evt.target.innerText == (App.Local.data['drawing-model'].Delete || "删除")) {
                if (!$(evt.target).hasClass('noCan')) {
                    this.deleteNotes(notesId);//删除批注的方法
                }
                return false;
            } else if (evt.target.innerText == (App.Local.data['drawing-model'].Share || "分享")) {
                this.shareNotesHandle($data);//分享批注的方法
                return false;
            }
        } else if (evt.target.tagName == "IMG") {
            viewpointInput.attr("data-viewpoint", target.children("input").data("viewpointid"));
            viewpointInput.attr("data-viewpointfilter", notesId);
        } else if (evt.target.tagName !== "IMG") {
            if (!target.hasClass('notesSelectClass')) {
                target.siblings().removeClass("notesSelectClass").end().addClass('notesSelectClass');
                if (notesId) {//如果当前点击的批注存在id则去获取批注评论的列表
                    commetnListBox.show();
                    App.Project.NotesCollection.defaults.viewpointId = notesId;
                    App.Project.NotesCollection.defaults.pageIndexComment = 1;
                    App.Project.NotesCollection.getCommentListHandle();
                    App.Project.NotesCollection.defaults.hosttype = target.children("input").data("hosttype");//当前点击的批注是什么类型的
                    App.Project.bindScroll();
                    
                } else {
                    commetnListBox.hide();
                }
                if (hosttype == 0) {
                    $("a.uploadsnapshot").css("display", "inline-block");
                }
            }
        }
    },
    editNotesHandle($li) {//编辑批注的方法
        var _this = this;
        var data = {
                cate: "viewPoint",
                id: $li.data("notesid"),
                type: $li.data("notestype"),
                img: $li.data('notesimgsrc'),
                name: $li.data("notesname")
            },
            dialogHtml = _.templateUrl('/libsH5/tpls/comment/bimview.save.dialog.html')(data),
            opts = {
                title: (App.Local.data['drawing-model'].Modify || "修改快照"),
                width: 500,
                height: 250,
                cssClass: "saveViewPoint",
                okClass: "btnWhite",
                cancelClass: "btnWhite",
                okText: (App.Local.data['drawing-model'].Save || "保存"),
                cancelText: (App.Local.data['drawing-model'].Cancel || '取消'),
                message: dialogHtml,
                okCallback: () => {
                    //保存批注
                    _this.updateComment(dialog);
                    return false;
                }
            },
            dialog = new App.Comm.modules.Dialog(opts);
        dialog.type = data.type;
        dialog.id = data.id;
    },
    updateComment(dialog) {//编辑批注点击弹出层按钮执行的方法
        if (dialog.isSubmit) {
            return;
        }
        var $element = dialog.element,
            pars = {
                viewPointId: dialog.id,
                projectId: App.Project.Settings.projectId,
                projectVersionId: parseInt(App.Project.Settings.versionId),
                name: dialog.element.find(".name").val().trim(),
                type: dialog.type
            };
        if (!pars.name) {
            $.tip({
                message: App.Local.data['drawing-model'].Pdt || "请输入快照描述",
                timeout: 3000,
                type: "alarm"
            });
            return false;
        }
        var data = {
            URLtype: "updateViewPoint",
            data: JSON.stringify(pars),
            type: "PUT",
            contentType: "application/json"
        }
        //保存中
        dialog.element.find(".ok").text((App.Local.data['drawing-model'].Sg || "保存中"));
        dialog.isSubmit = true;
        App.Comm.ajax(data, (data) => {
            if (data.code == 0) {
                dialog.close();
                App.Project.NotesCollection.getNotesListHandle();//共用了获取批注列表的方法
            } else {
                $.tip({
                    message: "超过了最大字数512",
                    timeout: 3000,
                    type: "alarm"
                });
                dialog.isSubmit = false;
                dialog.element.find(".ok").text((App.Local.data['drawing-model'].Save || "保存"));
            }
        })
    },
    shareNotesHandle($li) {//分享批注的方法
        var data = {
            id: $li.data("notesid"),
            fileversionid: $li.data("fileversionid"),
            pic: $li.data('notesimgsrc'),
            creatorName: $li.data('notescretorname'),
            name: $li.data("notesname"),
            createTime: $li.data("notescretortime")
        };
        this.shareViewPointData(data);
    },
    shareViewPointData(obj) {//分享批注点击弹出层按钮执行的方法
        var clipboard;
        var data = {
            URLtype: 'shareComment',
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({
                projectId: App.Project.Settings.projectId,
                projectVersionId: App.Project.Settings.versionId,
                viewpointId: obj.id
            })
        }
        App.Comm.ajax(data, function (data) {
            if (data.code == 0) {
                obj.url = "http://" + location.host + "/page/share.html?projectId="+data.data.projectId+"&projectVersionId="+data.data.projectVersionId+"&viewpointId="+data.data.viewpointId+"&fileVersionId="+obj.fileversionid;
                var dialogHtml = _.templateUrl('/libsH5/tpls/comment/bimview.share.dialog.html')(obj),
                    opts = {
                        title: (App.Local.data['drawing-model'].Share || "分享快照"),
                        width: 500,
                        height: 250,
                        cssClass: "saveViewPoint",
                        isConfirm: false,
                        message: dialogHtml
                    },
                    dialog = new App.Comm.modules.Dialog(opts),
                    $btnCopy = dialog.element.find(".btnCopy");
                if (clipboard) {
                    clipboard.destroy();
                }
                clipboard = new Clipboard(".saveViewPoint .btnCopy");
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
    deleteNotes(notesId) {//删除批注的方法
        $.confirm((App.Local.data['drawing-model'].Stt || "确认删除该快照么？"), function () {
            var pars = {
                projectId: parseInt(App.Project.Settings.projectId),
                viewPointId: notesId
            }
            var data = {
                URLtype: "deleteViewpointById",
                data: pars,
                type: "delete"
            }
            App.Comm.ajax(data, (data) => {
                App.Project.NotesCollection.getNotesListHandle();//共用了获取批注列表的方法
            })
        });
    },
    addOne(model) {//每一条数据 进行处理
        var data = model.toJSON();
        var leftUlNotesListBox = this.$("#leftUlNotesListBox");
        if (data.creatorId == App.Comm.user("userId")) {
            data.editDeleteBool = true;
        } else {
            data.editDeleteBool = false;
        }
        var NotesListComponentView = new App.Project.NotesListComponentView({model: data});//批注列表单个组件的视图
        leftUlNotesListBox.append(NotesListComponentView.render().el);
        if (!this.defaults.hasScrollBool) {
            this.defaults.hasScrollBool = $(".notesScrollBox").mCustomScrollbar({
                theme: 'minimal-dark',
                axis: "y",
                keyboard: {
                    enable: true
                },
                scrollInertia: 0
            });
        } else {
            $(".notesScrollBox").mCustomScrollbar("update");
        }
    },
    resetList() {//重置加载
        if ($(".nullDataBox")) {
            $(".nullDataBox").hide();
        }
        this.$("#leftUlNotesListBox").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
    },
})