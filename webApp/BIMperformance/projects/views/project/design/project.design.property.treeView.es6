
//设计属性 碰撞
App.Project.DesignTreeView=Backbone.View.extend({

  tagName:"ul",

  className:"subTree",

  events:{},

  template:_.templateUrl("/projects/tpls/project/design/project.design.treeView.html"),

  render:function(){
    var data = this.model;
    if(data.message == "success" && data.data.length>0){
      this.$el.html(this.template(data));
    }else{
      this.$el.html("没有构件");
    }
    return this;
  }
})
