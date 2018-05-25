/*
 * @require  /services/collections/auth/member/role.list.js
 */
App.Services.roleWindowFunDetail = Backbone.View.extend({

    tagName:'li',

    template:_.templateUrl("/services/tpls/auth/windows/services.role.window.detail.html"),
    events:{
        "click .memCheck":"choose"
    },

    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    initialize:function(){
        this.listenTo(this.model,"change:checked",this.checked);
    },
    checked:function(){
        if(this.model.get("checked")){
            this.$el.addClass("active");
        }
    },

    choose:function() {
        var window= App.Services.maskWindow.find(".seWinBody .func h2 i");
        count = parseInt(window.html());
        var preV = this.model.get("checked");
        if (!preV) {
            this.$el.addClass("active");
            this.$(".memCheck").addClass("checked");
            window.html(count + 1);
        } else {
            this.$el.removeClass("active");
            this.$(".memCheck").removeClass("checked");
            window.html(count - 1);
        }
        this.model.set("checked",!preV);
    }
});




