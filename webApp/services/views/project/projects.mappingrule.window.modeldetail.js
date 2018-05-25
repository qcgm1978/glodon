/*
 * @require  /services/views/auth/member/services.member.ozDetail.js
 * */
App.Services.MappingRuleWindowDetail = Backbone.View.extend({

    tagName :'li',

    template:_.templateUrl("/services/tpls/project/projects.mappingrule.window.modeldetail.html"),

    events:{
        "click .item":"select"
    },

    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    initialize:function(models){
    },

    //数据加载
    select:function(e){
       var ele = $(e.target).closest("li");
        if(ele.hasClass("active")){
            return
        }
        $(".projectMappingModelList li").removeClass("active");
        ele.addClass("active");
    }
});

