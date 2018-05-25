App.Project.CollisionFiles= Backbone.View.extend({

  tagName:"ul",

  className:"treeView",

  events: {
    "change":"getCategory"
  },

  template:_.templateUrl("/projects/tpls/project/design/project.design.collision.files.html"),

  render:function(){
    this.$el.html(this.template(this.model));
    return this;
  }
});
