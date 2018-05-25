//@ sourceURL=Profile.es6
App.Profile = Backbone.View.extend({
    tagName: 'div',
    template: _.templateUrl("/feedBackAdmin/tpls/profile.html"),
    default: {
        hasDuty: true
        // hovers: '',
        // outLive: '',
    },
    events: {
        // "mouseenter .userInfoBox": "clearTimeoutHandle",
        // "mouseleave .userInfoBox": "hideUserInfoHandle",
    },
    // clearTimeoutHandle() {
    //     clearTimeout(this.default.outLive);
    // },
    // hideUserInfoHandle() {
    //     this.default.outLive = setTimeout(function () {
    //         $("#userInfoBox").fadeOut();
    //         clearTimeout(this.default.hovers);
    //     }, 200)
    // },
    initialize(options={}) {//初始化
        let defaultOpt = this.default;
        this.default = Object.assign(defaultOpt,options);
       
    },
    render: function () {
        // this.initHandle();//初始化页面
        // this.getFeedBackDataHandle();//获取建议反馈数据
        this.$el.html(this.template(this.default));
        return this;
    },
});