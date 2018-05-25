/*
 * @require  /services/views/auth/member/services.member.detail.js
 */
App.Services.windowRoleList=Backbone.View.extend({

    tagName:"div",
    events:{},

    template:_.templateUrl("/services/tpls/auth/member/services.member.orglist.html"),
    render:function(){
        this.$el.html(this.template);
        return this;
    },
    initialize:function(){
       this.listenTo(App.Services.Member.SubRoleCollection,"add",this.addOne);
       this.listenTo(App.Services.Member.SubRoleCollection,"reset",this.render);
    },
    addOne:function(model){
        var newView = new App.Services.windowRoleDetail({model:model});
        this.$("ul").append(newView.render().el);
        App.Comm.initScroll(this.$el.find(".setter"),"y");
    },
    //排序
    comparator:function(){}
});




