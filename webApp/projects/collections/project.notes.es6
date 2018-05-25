/**
 * @require /projects/collections/Project.es6
 */
App.Project.NotesCollection = {
    defaults: {
        pageIndexNotes: 1,
        pageIndexComment: 1,
        projectVersionId: "",
        content: "",
        opTimeStart: "",
        opTimeEnd: "",
        toMeBool: true,
        viewpointId: '',
        hosttype: 0,
        attachments: [],//评论上传附件的列表
        atUserArrs: [],//@用户的列表
    },
    //获取批注列表的方法
    GetNotesListCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    name: ""
                }
            }
        }),
        urlType: "getNotesList",
        parse(response) {
            if (response.code == 0) {
                return response.data.items;
            }
        }
    })),
    //获取批注评论列表的方法
    GetCommentListCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    name: ""
                }
            }
        }),
        urlType: "getCommentList",
        parse(response) {
            if (response.code == 0) {
                return response.data.items;
            }
        }
    })),
    getNotesListHandle(parmer) {//获取批注列表的方法
        var self = this;
        var defaultData = {
            "id": "",
            "projectId": App.Project.Settings.projectId,
            "toMeBool": App.Project.NotesCollection.defaults.toMeBool,
            "projectVersionId": App.Project.NotesCollection.defaults.projectVersionId,
            "content": App.Project.NotesCollection.defaults.content,
            "opTimeStart": App.Project.NotesCollection.defaults.opTimeStart,
            "opTimeEnd": App.Project.NotesCollection.defaults.opTimeEnd,
            "pageIndex": App.Project.NotesCollection.defaults.pageIndexNotes,
            "pageItemCount": 15,
            "type": 1
        };
        var extendData = $.extend({}, defaultData, parmer);
        App.Project.NotesCollection.GetNotesListCollection.reset();
        App.Project.NotesCollection.GetNotesListCollection.fetch({
            data: JSON.stringify(extendData),
            type: "POST",
            contentType: "application/json",
            success: function (collection, response, options) {
                $("#pageLoading").hide();
                if (response.code == 0) {
                    var $content = $(".leftNotesListBox");
                    var rightNotesCommentListBox = $("#rightNotesCommentListBox");
                    var pageCount = response.data.totalItemCount;
                    const total = App.Local.getCurrentIsEn() ? '' : '共 ';
                    const comments = (App.Local.data['drawing-model'].Xcs1 || '条批注');
                    $content.find(".sumDesc").html(total + pageCount + ' ' +
                        comments);
                    $content.find(".loading").remove();
                    $content.find(".scrollBox").show();
                    $content.find(".pagingBox").show();
                    if (response.data.items.length == 0) {
                        $content.find(".scrollBox").hide();
                        $content.find(".pagingBox").hide();
                        $content.find(".nullDataBox").show();
                        rightNotesCommentListBox.find(".commentNumberBox").hide();
                        rightNotesCommentListBox.find(".commentListBox").hide();
                        rightNotesCommentListBox.find("#addCommentBox-p").hide();
                        rightNotesCommentListBox.find(".nullDataBox").show();
                    } else {
                        $content.find(".nullDataBox").hide();
                        $('#addCommentBox-p').show();
                        $content.find(".listPagination").empty().pagination(pageCount, {
                            items_per_page: response.data.pageItemCount,
                            current_page: response.data.pageIndex - 1,
                            num_edge_entries: 3, //边缘页数
                            num_display_entries: 5, //主体页数
                            link_to: 'javascript:void(0);',
                            itemCallback: function (pageIndex) {
                                //加载数据
                                App.Project.NotesCollection.defaults.pageIndexNotes = pageIndex + 1;
                                App.Project.NotesCollection.defaults.pageIndexComment = 1;
                                App.Project.NotesCollection.getNotesListHandle();
                                App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
                            },
                            prev_text: (App.Local.data['system-module'].Back || "上一页"),
                            next_text: (App.Local.data['source-model'].nt || "下一页")
                        });
                    }
                    App.Project.Settings.NotesDatas = response.data.items;
                    localStorage.setItem("NotesDatas", response.data.items);
                    self.initListDomHandle();//点击事件初始化
                } else if (response.code == 20057) {
                    $.tip({
                        message: App.Local.data["no-permission"].permission || "用户无项目权限",
                        timeout: 3000,
                        type: "alarm"
                    })
                    setTimeout(function () {
                        location.href = "#projects";
                    }, 3200)
                }
                return response.data;
            }
        })
    },
    getCommentListHandle(parmer) {//获取批注评论列表的方法
        var self = this;
        var defaultData = {
            "viewpointId": App.Project.NotesCollection.defaults.viewpointId,
            "pageIndex": App.Project.NotesCollection.defaults.pageIndexComment,
            "pageItemCount": 100
        };
        var extendData = $.extend({}, defaultData, parmer);
        App.Project.NotesCollection.GetCommentListCollection.reset();
        App.Project.NotesCollection.GetCommentListCollection.fetch({
            data: JSON.stringify(extendData),
            type: "POST",
            contentType: "application/json",
            success: function (collection, response, options) {
                $("#pageLoading").hide();
                var commetnListBox = $(".commentBox");
                var commentComponentBox = this.$("#commentComponentBox");
                var pageCount = response.data.totalItemCount;
                const total = App.Local.getCurrentIsEn() ? '' : '共 ';
                const comments = (App.Local.data['drawing-model'].Xcs || '条评论');
                $("#commentNumberBox").html(total + pageCount + ' ' +
                    comments);
                $("#listPagination").html("");
                if (response.data.items == 0) {
                    commetnListBox.find(".commentListBox,.commentNumberBox,#addCommentBox").hide().siblings("#addCommentBox-p,.nullDataBox").show();
                } else {
                    commetnListBox.find(".commentNumberBox").show();
                    commetnListBox.find(".commentListBox").show();
                    // commetnListBox.find("#addCommentBox-p").show();
                    commetnListBox.find(".nullDataBox").hide();
                    commentComponentBox.find(".loading").remove();
                    $("#listPagination").empty().pagination(pageCount, {
                        items_per_page: response.data.pageItemCount,
                        current_page: response.data.pageIndex - 1,
                        num_edge_entries: 3, //边缘页数
                        num_display_entries: 5, //主体页数
                        link_to: 'javascript:void(0);',
                        itemCallback: function (pageIndex) {
                            //加载数据
                            App.Project.NotesCollection.defaults.pageIndexComment = pageIndex + 1;
                            App.Project.NotesCollection.getCommentListHandle();
                        },
                        prev_text: (App.Local.data['system-module'].Back || "上一页"),
                        next_text: (App.Local.data['source-model'].nt || "下一页")
                    });
                }
                if (App.Project.NotesCollection.defaults.hosttype != 0) {
                    $("a.uploadsnapshot").css("display", "none");
                }
                setTimeout(() => {
                    App.Project.bindScroll();
                    $("div.commentScroll")
                        .find('li:last button').click(() => {
                            setTimeout(() => {
                                $("div.commentScroll").mCustomScrollbar("scrollTo", "bottom");
                            }, 10);
                        })
                }, 1000);
                return response.data;
            }
        })
    },
    initListDomHandle() {
        var leftNotesListBox = $("#leftNotesListBox");
        var clickLiBox = leftNotesListBox.find("li");
        var closestLiBox = leftNotesListBox.find("li.notes_" + App.Project.Settings.viewpointShareUrlId);
        if (App.Project.Settings.viewpointShareUrlId) {
            if (closestLiBox.length == 0) {
                $.tip({
                    message: "当前批注已删除！",
                    timeout: 3000,
                    type: "alarm"
                })
                clickLiBox.eq(0).click();//如果有批注默认去第一个批注的评论
            } else {
                $(".notesScrollBox").mCustomScrollbar("scrollTo", ".notes_" + App.Project.Settings.viewpointShareUrlId);
                closestLiBox.click();
            }
        } else {
            clickLiBox.eq(0).click();//如果有批注默认去第一个批注的评论
        }
    },
    clickModelHandle() {//点击查看模型执行的方法
        var fileNav = $(".fileNav span.model");
        fileNav.click();
        if ($("#viewpointInput").attr("data-viewpoint") && App.Project.Settings.Viewer) {
            App.Project.NotesCollection.renderModelCallBackHandle();
        }
    },
    renderModelCallBackHandle() {//批注里面查看模型执行的方法
        if ($("#viewpointInput").attr("data-viewpoint") && App.Project.Settings.Viewer) {
            App.Project.Settings.Viewer.setCamera($("#viewpointInput").attr("data-viewpoint"));
            this.setFiterHandle();
        }
    },
    setFiterHandle() {
        var filterObj = {};
        var viewpointfilter = $("#viewpointInput").attr("data-viewpointfilter");
        if (!viewpointfilter) {
            return;
        }
        var getFilterData = {
            URLtype: "getFilter",
            data: {
                projectId: App.Project.Settings.projectId,
                viewPointId: viewpointfilter
            }
        }
        App.Comm.ajax(getFilterData, (data) => {
            if (data.code == 0) {
                $.each(data.data.filters, function (i, item) {
                    item = JSON.parse(item);
                    filterObj[item.cateType] = item;
                    delete item.cateType;
                });
                App.Project.Settings.Viewer.loadComment({
                    filter: filterObj
                });
            } else {
                $.tip({
                    message: "获取数据失败",
                    timeout: 3000,
                    type: "alarm"
                });
            }
        })
    },
    uploadsnapshotCallbackHandle(data) {//当视点插入完成之后执行的方法
        var html = "";
        var commentAttachmentListBox = $("#commentAttachmentListBox");
        html += '<li>'
            + '<div class="imgThumbnailBox"><img src="' + data.pictureUrl + '"></div>'
            + '<span class="imgThumbnailName">' + data.description + '</span>'
            + '<a href="javascript:;" data-id="' + data.id + '" class="deleteUploadImg">' +
            (App.Local.data['drawing-model'].Delete || '删除') +
            '</a>'
            + '</li>';
        commentAttachmentListBox.prepend(html);
        App.Project.NotesCollection.defaults.attachments.push(data.id);
        this.bindCommentScroll();
    },
    bindCommentScroll: function () {//绑定滚动条
        if ($("#uploadListBox").hasClass('mCustomScrollbar')) {
            $("#uploadListBox").mCustomScrollbar("update");
        } else {
            $("#uploadListBox").mCustomScrollbar({
                theme: 'minimal-dark',
                axis: 'y',
                keyboard: {
                    enable: true
                },
                scrollInertia: 0,
            });
        }
    },
    resetUrlHandle() {// 重置地址栏地址 单不刷新页面
        var hrefStr = location.href;
        if (hrefStr.indexOf("type=message") > 0) {
            var newUrl = window.location.href.substr(0, window.location.href.lastIndexOf("?"));
            history.pushState("", "", newUrl);
            App.Project.Settings.viewpointShareUrlId = undefined;
            App.Project.Settings.viewpointSharePageNum = 1;
        }
    }
}