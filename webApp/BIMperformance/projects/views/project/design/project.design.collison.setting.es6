App.Project.ProjectDesignSetting= Backbone.View.extend({

  tagName:"div",

  className:"designCollSetting",

  isCheck:false,

  events: {
    "click .itemContent":"openTree",
    "click .parentCheckbox":"selectAll",
    "blur .labelInput":"requireName"
  },

  template:_.templateUrl("/projects/tpls/project/design/project.design.collision.setting.html",true),

  initialize:function(){
    this.listenTo(App.Project.DesignAttr.CollisionFiles,"add",this.addFiles);
  },

  render:function(){
    this.$el.html(this.template);
    App.Project.DesignAttr.CollisionFiles.sourceId = App.Project.Settings.DataModel.sourceId;
    App.Project.DesignAttr.CollisionFiles.etag = App.Project.Settings.DataModel.etag;
    App.Project.DesignAttr.CollisionFiles.fetch();
    return this;
  },

  addFiles:function(model){
    var that = this;
    var data = model.toJSON();
    this.$el.find(".tree").append(new App.Project.CollisionFiles({
      model:data
    }).render().el);
    return this;
  },

  openTree:function(event,$target){
    var self = this,
        that = self.element = $(event.target).closest(".itemContent"),
        that=$target||that,
        etag = that.data('etag');
    if(!$target){
      this.isCheck=false;
    }
    if(etag&&!that.hasClass('open')&&that.next('.subTree').length==0){
      App.Project.DesignAttr.CollisionCategory.sourceId = App.Project.Settings.DataModel.sourceId;
      App.Project.DesignAttr.CollisionCategory.etag = etag;
      App.Project.DesignAttr.CollisionCategory.fetch();
      this.listenTo(App.Project.DesignAttr.CollisionCategory,"add",this.addCategory);
    }
    if(!$target){
      that.toggleClass("open");
    }else{
      if(!that.hasClass('open')){
        that.addClass("open");
      }
    }
  },

  selectAll:function(e){
    this.isCheck=true;
    var $target=$(e.target),

      $itemNode=$target.closest(".itemNode");

      this.openTree(e,$target.closest(".itemContent"));

    if($target.prop("checked")){
      $itemNode.find('.inputCheckbox').prop("checked",true);
    }else{
       $itemNode.find('.inputCheckbox').prop("checked",false);
    }
    e.stopPropagation();
  },

  addCategory:function(model){
    var data = model.toJSON();
    data.isCheck=this.isCheck;
    this.element.after(new App.Project.DesignTreeView({
      model:data
    }).render().el)
  },

  requireName:function(event){
    var that = $(event.target);
    if(that.val()){
      that.removeClass("error");
    }else{
      that.addClass("error").trigger("focus");
    }
  }
});
