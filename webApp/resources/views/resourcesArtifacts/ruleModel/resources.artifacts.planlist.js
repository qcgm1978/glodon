/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsPlanList = Backbone.View.extend({

    tagName:"div",

    className: "artifactsList",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planlist.html"),

    render:function() {
        this.$el.html(this.template);
        return this;
    },

    initialize:function(){
        this.listenTo(App.ResourceArtifacts.PlanNode,"add",this.addOne);
        this.listenTo(App.ResourceArtifacts.PlanNode,"reset",this.render);
    },

    addOne:function(model) {
        var newList = new App.Resources.ArtifactsPlanDetail({model: model});
        this.$("ul").append(newList.render().el);
        App.Comm.initScroll(this.$(".list"),"y");
    }
});