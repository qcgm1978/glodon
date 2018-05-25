App.Project.NotesCommentComponentView = Backbone.View.extend({
    tagName: "li",
    className: "",
    template: _.templateUrl("/projects/tpls/project/notes/project.notes.comment.component.html"),
    default: {},
    events: {
        "click .deleteNotesCommentBtn": "deleteNotesCommentHandle",//删除批注的评论
        "click .commentLookModel": "commentLookModelHandle",//评论里面的查看模型方法
        "click .attachmentThumbnailBox": "commentImgHandle",//评论里面的缩略图查看模型方法
        "click .canDownloadFile": "canDownloadFileHandle",//评论里面的评论附件下载方法
        "mouseenter .commentThumbnailBox img": "showUserInfoHandle",//鼠标滑过显示用户信息
        "mouseleave .commentThumbnailBox img": "hideUserInfoHandle",
    },
    hideUserInfoHandle(event) {
        const _this = this;
        clearTimeout(_this.default.hovers);
        this.default.outLive = setTimeout(function () {
            $("#userInfoBox").fadeOut();
        }, 200)
    },
    showUserInfoHandle: function (evt) {//鼠标滑过显示用户信息
        var evt = evt || event;
        var userId = $(evt.target).data("userid");
        clearTimeout(this.default.outLive);
        this.default.hovers = setTimeout(function () {
            var userInfoBox = $("#userInfoBox");
            var leftX = 24 - 570,
                topY = 16 - 160,
                divW = userInfoBox.outerWidth(),
                divH = userInfoBox.outerHeight(),
                wWidth = $(window).width(),
                wHeight = $(window).height(),
                posX = evt.pageX,
                posY = evt.pageY;
            var maxX = wWidth - divW - leftX;
            var maxY = wHeight - divH - topY;
            if (posX >= maxX && posY >= maxY) {
                userInfoBox.css({
                    left: posX - divW,
                    top: posY - divH - 60,
                })
            } else if (posX < maxX && posY >= maxY) {
                userInfoBox.css({
                    left: posX + leftX,
                    top: posY - divH - 60,
                })
            } else if (posX >= maxX && posY < maxY) {
                userInfoBox.css({
                    left: posX - divW,
                    top: posY + topY - 60,
                })
            } else if (posX < maxX && posY < maxY) {
                userInfoBox.css({
                    left: posX + leftX,
                    top: posY + topY - 60,
                })
            }
            userInfoBox.fadeIn(function () {
                userInfoBox.find("dl").hide();
                $(this).find(".loading").show();
                App.Comm.getUserInfoHandle(userInfoBox, userId);//获取数据用户信息方法
            });
        }, 400)
    },
    render: function () {
        // debugger;
        this.$el.html(this.template(this.model));
        $("#userInfoBox").hover(() => {
            clearTimeout(this.default.outLive)
        },
            () => {
                this.hideUserInfoHandle()
            })
        return this;
    },
    canDownloadFileHandle(event) {//评论里面的评论附件下载方法
        App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
        var projectid = parseInt(App.Project.Settings.projectId);
        let $target = $(event.target);
        var viewpointid = $target.closest("a.canDownloadFile").data("viewpointid");
        var attachmentid = $target.closest("a.canDownloadFile").data("attachmentid");
        var downloadUrl = window.location.origin + "/sixD/" + projectid + "/viewPoint/" + viewpointid + "/comment/" + attachmentid + "/download";
        App.Comm.previewFile({
            URLtype: 'commentPreview',
            projectId: projectid,
            viewpointId: viewpointid,
            attachmentId: attachmentid,
            link: downloadUrl
        }, $(event.target));

        // window.open(downloadUrl, "_blank");
    },
    commentLookModelHandle(event) {//评论里面的查看模型方法
        var target = $(event.target);
        var viewpointInput = $("#viewpointInput");
        viewpointInput.attr("data-viewpoint", target.data("viewpointid"));
        viewpointInput.attr("data-viewpointfilter", target.data("id"));
        App.Project.NotesCollection.clickModelHandle();//执行查看模型方法
    },
    commentImgHandle(event) {
        var target = $(event.target).closest("div.attachmentThumbnailBox");
        var viewpointInput = $("#viewpointInput");
        viewpointInput.attr("data-viewpoint", target.data("viewpointid"));
        viewpointInput.attr("data-viewpointfilter", target.data("id"));
    },
    deleteNotesCommentHandle(evt) {//删除批注的快照
        var notesId = $(evt.target).data("id");
        var viewpointid = $(evt.target).data("viewpointid");
        App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
        $.confirm((App.Local.data["drawing-model"].Stct || '确认删除该评论么？'), function () {
            var pars = {
                projectId: parseInt(App.Project.Settings.projectId),
                viewPointId: viewpointid,
                commentId: notesId,
            }
            var data = {
                URLtype: "deleteNotesComment",
                data: pars,
                type: "delete"
            }
            App.Comm.ajax(data, (data) => {
                if (data.code == 0) {
                    App.Project.NotesCollection.defaults.pageIndexComment = 1;
                    App.Project.NotesCollection.getCommentListHandle();//共用了获取批注评论列表的方法
                } else {
                    alert(data.message);
                }
            })
        });
    }
});