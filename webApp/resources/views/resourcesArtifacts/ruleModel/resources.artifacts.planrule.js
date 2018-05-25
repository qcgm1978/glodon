/**
 * @require /resources/collection/resources.nav.es6
 */
App.Resources.ArtifactsPlanRule = Backbone.View.extend({

    tagName:"ul",
    className :"outsideList",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planrule.html"),

    events:{},

    render:function() {
        this.$el.html(this.template);
        return this;
    },

    initialize:function(){
        Backbone.on("resetTitle",this.resetTitle,this);
    },

    addOne:function(model) {
        var newList = new App.Resources.ArtifactsPlanRuleDetail({model: model});
        this.$el.append(newList.render().el);
        App.Comm.initScroll($(".ruleContentRuleList"),"y");
    },

    resetTitle:function(){
        var _this = this;
        this.collection = App.ResourceArtifacts.PlanRules;
        this.$el.html("");
        if(this.collection.length == 0){
            this.$el.html("<li><div class='ruleTitle delt'>" +
                (App.Local.data['drawing-model'].Nfs || "暂无内容") +
                "</div></li>");
        }else{
            this.collection.each(function(item){
                _this.addOne(item);
            })
        }
    }
});