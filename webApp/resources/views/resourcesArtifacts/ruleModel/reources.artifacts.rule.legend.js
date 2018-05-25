/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsRuleLegend = Backbone.View.extend({

    tagName :'li',

    template:_.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.rule.legend.html"),

    events:{
        "click .searEnd":"sele"
    },
    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    initialize:function(){},
    //选择
    sele : function(){
        var list = this.$el.closest("ul"),
            data = this.$(".searEnd").data("code"),
            dataKeeper = list.siblings("div").find(".chide"),
            input = list.siblings("div").find(".categoryCode"),
            name = this.model.get("name"),
            dataName = "[" + data +"]";
        input.val(data).css({"opacity":"0"});
        list.hide();
        dataKeeper.css({"visibility": "visible"}).data("code",data).attr("data-name",name).find("span").html(dataName).siblings("i").html(name);
        App.ResourceArtifacts.Status.rule.mappingCategory.categoryCode = data;
        App.ResourceArtifacts.Status.rule.mappingCategory.categoryName = name;
    }
});

