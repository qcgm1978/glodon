/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsProjectBreadCrumb= Backbone.View.extend({

    tagName:"div",

    className:"artifactsProjectBreadCrumb",

    events:{},

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/resources.artifacts.projectbreadcrumb.html"),

    render:function() {
        this.$el.html(this.template);
        return this;
    },
    initialize:function(){}
});