//@ sourceURL=feedBackAdmin.js
/*
* @require /feedBackAdmin/views/Profile.es6
* */
App.AdminFeedBack.FeedBackContainerListDomV = Backbone.View.extend({
    tagName: 'tr',
    template: _.templateUrl("/feedBackAdmin/tpls/feedBackContainer.ListDomV.html"),
    events: {
        "click .feedbackUser": "feedbackUserHandle",
        "click td a.answerBtn": "answerBtnHandle",
        "click td a.answerDel": "answerDelHandle",
        "mouseenter td span.user_name": "showUserInfoHandle",//鼠标滑过显示用户信息
        "mouseleave td span.user_name": "hideUserInfoHandle"//鼠标离开隐藏用户信息
    },
    render: function () {
        this.model.createTime = App.Comm.changeTimeHandle(this.model.createTime);
        this.model.size = App.Comm.formatSize(this.model.size);
        this.$el.html(this.template(this.model));
        return this;
    },
    feedbackUserHandle(evt) {
        var evt = evt || event;
        var target = $(evt.target);
        var targetParent = target.parent();
        if (evt.target.nodeName === "EM" && targetParent.hasClass("showMoreBtn") || evt.target.nodeName === "SPAN" && target.hasClass("showMoreBtn")) {//查看更多回复方法
            var target = targetParent.hasClass("showMoreBtn") ? targetParent : target;
            this.toggleReplayHandle(target);
        } else if (evt.target.nodeName === "I") {//下载方法
            this.downLoadIdHandle(evt);
        } else {
            this.answerBtnHandle(evt);//点击回复效果
        }
    },
    toggleReplayHandle(target) {//显示更多的回复方法
        var nextUl = target.next('ul');
        if (target.hasClass('hideMoreBtn')) {
            target.removeClass('hideMoreBtn').find("em").html("展开");
            nextUl.css("display", "none").css('height', "110px");
        } else {
            target.addClass('hideMoreBtn').find("em").html("收起");
            nextUl.css("display", "block").css('height', "auto");
        }
    },
    showUserInfoHandle: function (evt) {//鼠标滑过显示用户信息
        var _this = this;
        var evt = evt || event;
        var userId = $(evt.target).data("userid");
        clearTimeout(App.AdminFeedBack.default.outLive);
        App.AdminFeedBack.default.hovers = setTimeout(function () {
            var userInfoBox = $("#userInfoBox");
            var leftX = 24,
                topY = 16,
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
    hideUserInfoHandle: function (evt) {//鼠标离开隐藏用户信息
        var evt = evt || event;
        clearTimeout(App.AdminFeedBack.default.hovers);
        App.AdminFeedBack.default.outLive = setTimeout(function () {
            $("#userInfoBox").fadeOut();
        }, 200)
    },
    answerBtnHandle(event) {//回复方法
        var target = $(event.target);
        var feedbackid = target.parents("td").data("feedbackid") || target.data("feedbackid");
        App.AdminFeedBack.FeedBackReplayDialog = App.Comm.feedbackRepalyDialogHandle({
            replayId: feedbackid,
            callbackHandle: function (isReload) {
                if (isReload) {
                    App.AdminFeedBack.getFeedBackDataHandle();//获取数据
                }
            }
        });
    },
    answerDelHandle(event) {//回复方法
        const delModuleCreate = '确认要删除么？', _this = this;
        new App.Comm.modules.Dialog({
            width: 580,
            height: 168,
            limitHeight: false,
            title: '删除反馈提示',
            cssClass: 'deleteFileDialog',
            okClass: "delFile",
            okText: App.Local.data['model-view'].OK || '确&nbsp;&nbsp;认',
            okCallback() {
                _this.feedbackDel(event)
            },
            message: delModuleCreate
        });
    },
    successDel: function (response) {
        if (response.code) {
            alert('delete fail')
        } else {
            $(this.target).parents('tr').remove();
            $('.sumDesc').text((ind, txt) => {
                return txt.replace(/(\d+)/, (match, p1) => {
                    return p1 - 1
                })
            });
        }
    },
    feedbackDel(evt) {
        let target = evt.target;
        this.target = target;
        const id = $(target).parent().data('feedbackid');
        const url = App.Comm.getUrlByType({
            data: { id },
            URLtype: "delFeedBackItem",
        }).url;
        ((that) => this.delCollection.fetch({
            // data: JSON.stringify({id}),
            url,
            type: "delete",
            contentType: "application/json",
            success: function success(collection, response, options) {
                if (response.code == 0) {
                    App.AdminFeedBack.getFeedBackDataHandle();//获取数据
                }

                /*debugger;
                that.successDel(response.code);
                return response.data;*/
            },
            error() {
                debugger;
                alert('删除失败');
            }
        }))(this);
    },
    delCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    items: [{
                        name: ''
                    }]
                }
            }
        }),
        // urlType: "delFeedBackItem",
        parse(response) {
            return response.code === 0;
        }
    })),
    downLoadIdHandle(event) {
        var target = $(event.target);
        var downloadid = target.data("downloadid");
        var downloadDataObj = {
            URLtype: "downloadsFeedBack",
            data: {
                adviceId: downloadid,
            }
        }
        // App.Comm.previewFile({
        //     projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
        //     projectVersionId: App.ResourceModel.Settings.CurrentVersion.id,
        //     fileVersionId: id
        // }, $(event.target));
        window.location.href = App.Comm.getUrlByType(downloadDataObj).url;
    }
})