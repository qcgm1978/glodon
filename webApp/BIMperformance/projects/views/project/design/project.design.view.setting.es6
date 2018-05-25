App.Project.ProjectViewSetting= Backbone.View.extend({

  tagName:"div",

  className:"designCollSetting",

  events: {
    "click .itemContent":"openTree",
    "blur .labelInput":"requireName"
  },

  template:_.templateUrl("/projects/tpls/project/design/project.design.view.setting.html"),

  initialize:function(){
    this.listenTo(App.Project.DesignAttr.CollisionSetting,"add",this.addFiles);
  },

  render:function(){
    this.$el.html('');
    return this;
  },

  addFiles:function(model){
    var that = this;
    var data = model.toJSON();
    this.$el.html(this.template(data));
    return this;
  },

  openTree:function(event){
    var self = this,
        that = self.element = $(event.target).closest(".itemContent");
    that.toggleClass("open");
  }
});
