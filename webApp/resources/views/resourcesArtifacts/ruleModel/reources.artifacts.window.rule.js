/*
 * @require  /services/views/auth/member/services.member.ozDetail.js
 * */
App.Resources.ArtifactsWindowRule = Backbone.View.extend({

    tagName :'div',
    className:"resourcesAlert",

    template:_.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.window.rule.html"),

    events:{
        "click .windowSubmit":"sure"
    },

    render:function(){
        this.$el.html(this.template);
        return this;
    },

    initialize:function(models){

    },
    //确定
    sure : function(){
        var _this = this,data,
        code  = $(".ruleNodeName span.active").closest(".ruleNodeName").attr("data-id"),
        name  = $(".ruleNodeName span.active").closest(".ruleNodeName").attr("data-name");

        if(code){
            data = App.ResourceArtifacts.presentRule.get("mappingCategory");

            data["categoryCode"] = code + '';
            data["categoryName"] = name;

            $(".ruleDetail:visible").find(".chide").data("code",code).siblings("input").val(code).end().find("span").html("["+code + "]").end().find("i").html(name);

            App.ResourceArtifacts.presentRule.set({"mappingCategory":data},{silent:true});

            App.ResourceArtifacts.Status.rule.mappingCategory.categoryCode  = code;
            App.ResourceArtifacts.Status.rule.mappingCategory.categoryName = name;
        }
        App.Resources.ArtifactsMaskWindow.close();
    },
        //取消
    cancel:function(){
        App.Resources.ArtifactsMaskWindow.close();
    },
    //关闭
    close:function(){
        App.Resources.ArtifactsMaskWindow.close();
    }
});

