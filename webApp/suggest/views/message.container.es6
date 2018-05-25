App.Suggest = App.Suggest || {}
App.Suggest.containerView = Backbone.View.extend({
    id: "imboxContent",
    template: _.templateUrl('./suggest/tpls/container.html', true),
    initialize: function () {
        this.listenTo(App.Suggest.messageCollection, "add", this.addOne);
        this.listenTo(App.Suggest.messageCollection, "reset", this.resetList);
    },
    events: {
        "click .downLoad": "downLoadHandle",
        'click .J_feedback_del': 'promptDelFeedback'
    },
    render() {
        this.checkIsHaveFeedback();//判断当前建议反馈是否存在
        this.$el.html(this.template);
        return this;
    },
    checkIsHaveFeedback() {//判断当前建议反馈是否存在
        var self = this;
        var locationHref = location.href;
        var feedbackId = "",
            replyId = "",
            tipFeedbackText = "当前建议已删除",
            tipReplyText = "当前建议的回复已删除";
        if (locationHref.indexOf("feedbackId") > 0 && locationHref.indexOf("replyId") > 0) {
            feedbackId = locationHref.substring(locationHref.indexOf("feedbackId") + 11, locationHref.indexOf("replyId") - 1);
            replyId = locationHref.substring(locationHref.indexOf("replyId") + 8);
            App.Comm.ajax({
                URLtype: 'checkFeedback',
                data: {
                    adviceId: feedbackId,
                    adviceReplyId: replyId,
                }
            }).done(function (data) {
                if (data.code == 0) {
                    if (data.data.isAdvicdExist == 0) {
                        $.tip({
                            message: tipFeedbackText,
                            timeout: 2500,
                            type: "alarm"
                        })
                    } else if (data.data.isAdvicdExist == 1 && data.data.isAdvicdReplyExist == 0) {
                        $.tip({
                            message: tipReplyText,
                            timeout: 2500,
                            type: "alarm"
                        })
                    }
                } else {
                    $.tip({
                        message: data.message,
                        timeout: 2500,
                        type: "alarm"
                    })
                }
            })
        }
    },
    addOne(model) {//每一条数据 进行处理
        // debugger;
        var data = model.toJSON();
        data.type = this.getAdviceType(data.adviceType)
        data.iconSrc = $('.userBg').attr('src');
        var _html = _.templateUrl('./suggest/tpls/list.html');
        this.$('#commissionLists').append(_html({ data: data }));
        this.bindScroll();
    },
    promptDelFeedback(evt) {
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
                _this.feedbackDel(evt)
            },
            message: delModuleCreate
        });
    },
    successDel: function (response) {
        if (response.code) {
            alert('delete fail')
        } else {
            // $(this.target).parents('tr').remove();
            App.Suggest.getSuggestList();
        }
    },
    feedbackDel(evt) {
        let target = evt.target;
        this.target = target;
        const id = target.dataset.id;
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
                that.successDel(response.code);
                return response.data;
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
    getAdviceType: function (type) {
        // debugger;
        if (type === null) {
            return ''
        }
        var arr = ['设计', '计划', '成本', '质监', '系统'];
        return '[' + arr[type - 1] + ']';
    }
    ,
    resetList() {//重置加载
        this.$("#commissionLists").html('<div class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</div>');
    }
    ,
    bindScroll: function () {//绑定滚动条
        this.$el.find("div.scrollBox").mCustomScrollbar({
            theme: 'minimal-dark',
            axis: 'y',
            keyboard: {
                enable: true
            },
            scrollInertia: 0
        });
    }
    ,
    downLoadHandle(event) {//下载按钮
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
        //     fileVersionId: downloadid
        // }, target);
        window.location.href = App.Comm.getUrlByType(downloadDataObj).url;
    }
})

