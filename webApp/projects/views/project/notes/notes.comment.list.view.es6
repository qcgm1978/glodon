/*
* @require /projects/views/project/notes/notes.add.comment.view.es6
* */
App.Project.NotesCommentContentView = Backbone.View.extend({
    tagName: "div",
    className: "commentBox",
    template: _.templateUrl("/projects/tpls/project/notes/project.notes.comment.content.html", true),
    events: {
        'click #addCommentBox-p': 'popupInputBox',
        'click .addCommentBox-close': 'popupInputBox'
    },
    initialize() {//初始化
        this.listenTo(App.Project.NotesCollection.GetCommentListCollection, "reset", this.resetList);
        this.listenTo(App.Project.NotesCollection.GetCommentListCollection, "add", this.addOne);
    },
    render: function () {
        this.$el.html(this.template);
        _.require('/static/dist/suggest/Profile.js')
		_.require('/static/dist/suggest/Profile.css')
		this.view2 = new App.Profile({
            hasDuty:false
        });
        this.$('.insert-view-here').append(this.view2.render().el);
        this.initAddCommentHandle();//初始化添加评论模块
        return this;
    },
    initAddCommentHandle() {//初始化添加批注评论方法
        var addCommentBox = this.$("#addCommentBox");
        var AddCommentView = new App.Project.AddCommentView();
        addCommentBox.html(AddCommentView.render().el);
    },
    addOne(model) {//初始化复选框事件
        var data = model.toJSON();
        var commentComponentBox = $("#commentComponentBox");
        var NotesCommentComponentView = new App.Project.NotesCommentComponentView({model: data});//批注评论列表单个组件的视图
        commentComponentBox.append(NotesCommentComponentView.render().el);
    },
    resetList() {//重置加载
        this.$("#commentComponentBox").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
    },
    popupInputBox() {
        App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
        $('#addCommentBox-p,#addCommentBox').toggle();
        $('#addCommentTextarea').val('');
        App.Project.bindScroll();
    },
})
App.Project.bindScroll = function () {//绑定滚动条
    let $div = $("div.commentScroll");
    if($div.length===0){
        return;
    }
    $div.mCustomScrollbar("destroy");
    // debugger;
    let $p = $('#addCommentBox-p');
    let $addCommentBox = $('#addCommentBox');
    const wrapperHeight = $('.commentBox').height(),
        pHeight = $p.is(':visible') ? $p.height() : 0,
        boxHeight = $addCommentBox.is(':visible') ? $addCommentBox.height() : 0,
        margin = 30;
        $div
        .height(wrapperHeight - pHeight - boxHeight - margin)
        .mCustomScrollbar({
            theme: 'minimal-dark',
            axis: 'y',
            keyboard: {
                enable: true
            },
            scrollInertia: 0,
            callbacks: {
                onInit: function () {
                    $div.mCustomScrollbar("scrollTo", "bottom")
                },
                // onTotalScroll: function () { /* your callback */
                // },
                // alwaysTriggerOffsets: false
            }
        });
}
$(window).resize(App.Project.bindScroll);