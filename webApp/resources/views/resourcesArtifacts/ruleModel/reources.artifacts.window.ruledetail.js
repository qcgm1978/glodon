/*
 * @require /resources/collection/resource.nav.es6
 * */
App.Resources.ArtifactsWindowRuleDetail = Backbone.View.extend({

    tagName :'div',
    className:"",

    template:_.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.ruletreedetail.html"),

    events:{
        "click .hasChild":"hasChild",
        "click .name":"select"
    },
    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    initialize:function(models){},
    //展开
    hasChild : function(e){
        var pre = $(e.target),
            alreadyLoad= this.$el.closest("li").find(".childList"),
            id = pre.closest(".ruleNodeName").data("id");
        if(!alreadyLoad.html()){
            var childNode = App.Resources.artifactsTree(App.Resources.artifactsTreeData,id);
            alreadyLoad.html(childNode);
            pre.addClass("active");
            alreadyLoad.show();
            return
        }
        if(pre.hasClass("active")){
            alreadyLoad.hide();
            pre.removeClass("active")
        }else{
            alreadyLoad.show();
            pre.addClass("active")
        }
    },
    select:function(e){
        var pre = $(e.target);
        if(!pre.hasClass("active")){
            $(".ruleNodeName span.name").removeClass("active");
            pre.addClass("active");

            App.ResourceArtifacts.Status.rule.mappingCategory.categoryCode = this.$(".ruleNodeName").data("id");
            App.ResourceArtifacts.Status.rule.mappingCategory.categoryName = this.$(".ruleNodeName").data("name");

        }
    }
});

