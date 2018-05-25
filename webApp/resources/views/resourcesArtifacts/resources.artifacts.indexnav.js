/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsIndexNav = Backbone.View.extend({

    tagName:"div",

    className: "resourcesMappingRule",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/resources.artifacts.indexnavx.html"),

    render:function() {
        this.$el.html(this.template);
        return this;
    }
});