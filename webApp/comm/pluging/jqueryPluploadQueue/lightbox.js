/*
 * @require /bodyContent/js/app.js
 */
var App = App || {};
App.UploadDialog = Backbone.View.extend({
    className: 'divBox',
    template: _.templateUrl("/comm/tpl/dnd.html", true),
    defaults: {},
    render: function () {
        var template = this.template();
        this.$el.html(template);
        // this.appendLoading();//添加加载中效果
        // this.getTipDataHandle();//获取提示信息的方法
        this.initHandle();//初始化事件
        return this;
    },
    appendLoading: function () {//添加加载中效果
        var divDom = $('<div class="pageLoading"></div>');
        $("body").append(divDom);
    },
    initHandle: function () {//初始化事件
        var _this = this;
        $('.close-dnd').on("click", function () {
            _this.closeDialog();//关闭弹出框
        })
    },
    closeDialog: function () {//关闭弹出框
        $('#J_tipDialogBox,#tipDialogBgBox,.close-dnd').remove();
    },
    
});