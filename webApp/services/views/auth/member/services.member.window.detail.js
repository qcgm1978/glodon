/*
 * @require  /services/views/auth/member/services.member.detail.js
 */
App.Services.MemberWindowDetail = Backbone.View.extend({

    tagName:'li',

    template:_.templateUrl("/services/tpls/auth/windows/services.member.window.detail.html"),
    events:{

    },
    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    initialize:function(){
        this.listenTo(this.model, 'change', this.render);
    }
});