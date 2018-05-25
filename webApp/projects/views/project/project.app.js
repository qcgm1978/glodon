// 项目总控
App.Project.ProjectApp = Backbone.View.extend({
    tagName: "div",
    className: "projectContainerApp",
    events: {
        "click .projectTab .item": "SwitchProjectNav"
    },
    render: function () {
        //nav
        this.$el.html(new App.Project.ProjectContainer().render().$el);
        if (localStorage.getItem("NotesDatas") != "undefined") {
            localStorage.setItem("NotesDatas", "undefined");
        }
        return this;
    },
    // 切换项目Tab
    SwitchProjectNav: function (event) {
        var $el = $(event.target);
        //样式处理
        $el.addClass('selected').siblings().removeClass('selected');
        var curNav = App.Project.Settings.projectNav;
        App.Project.Settings.projectNav = $el.data("type");
        var $planModel = $('.planModel .treeCheckbox input')[0];
        //非文件导航 设计 计划 成本 质量
        if (App.Project.Settings.fetchNavType != "file") {
            //根据类型渲染数据
            App.Project.renderModelContentByType();
        }
        App.Local.setI18n();
        App.Statistics.sendStatistics({
            type: 'modeltab',
            tab: App.Project.Settings.projectNav
        });
    }
});