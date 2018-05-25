
//设计属性 碰撞
App.Project.DesignCollisionDetail=Backbone.View.extend({

	tagName:"div",

	className:"designCollision",

  events:{
    "click tr":"setCollisionPoint",
    "click .prePage":"prePage",
    "click .nextPage":"nextPage",
    "click .viewSetting":"showSetting",
    "click .export":"download"
  },

	template:_.templateUrl("/projects/tpls/project/design/project.design.collision.detail.html"),

  initialize:function(){
    this.listenTo(App.Project.DesignAttr.CollisionTaskDetail,"add",this.addCollisionDetail);
  },

  render:function(){
    this.$el.html("");
    return this;
  },

  addCollisionDetail:function(model){
    // 加载碰撞点列表
    var data=model.toJSON();
    if(data.message=="success"){
      var pageIndex = data.data.pageIndex,
          pageCount = data.data.pageCount;
      this.list = data.data.items;
      this.prePage = pageIndex - 1;
      this.nextPage = pageIndex + 1;
    };
    this.$el.html(this.template(data));
    return this;
  },

  setCollisionPoint:function(event){

    App.Project.recoverySilder();

    var self = this,
        that = $(event.target).closest("tr"),
        flag = that.is('.selected'),
        name = that.find(".ckName").text();
    if(flag){
      App.Project.Settings.Viewer.collision("","");
    }else{
      $.each(this.list,function(index,item){
        if(item.name == name){
          var box = self.getBox([item.leftElementBoxMin,item.leftElementBoxMax],[item.rightElementBoxMin,item.rightElementBoxMax]);
          App.Project.Settings.Viewer.collision(item.leftId,item.rightId);
          App.Project.Settings.Viewer.translucent(true);
          App.Project.Settings.Viewer.zoomToBox(box);
        }
      });
    }
    that.toggleClass("selected").siblings().removeClass("selected");
  },
  getBox:function(boxA,boxB){
    return getVolume(boxA) > getVolume(boxB) ? boxB : boxA;
    function getVolume(box){
      var min = box[0],
          max = box[1],
          x = Math.abs(max[0]-min[0]),
          y = Math.abs(max[1]-min[1]),
          z = Math.abs(max[2]-min[2]);
      return x*y*z;
    }
  },
  prePage:function(event){
    var that = $(event.target);
    if(that.is('.disabled')){
      return false;
    }else{
      App.Project.DesignAttr.CollisionTaskDetail.pageNo = this.prePage;
      App.Project.DesignAttr.CollisionTaskDetail.fetch();
    }
  },

  nextPage:function(event){
    var that = $(event.target);
    if(that.is('.disabled')){
      return false;
    }else{
      App.Project.DesignAttr.CollisionTaskDetail.pageNo = this.nextPage;
      App.Project.DesignAttr.CollisionTaskDetail.fetch();
    }
  },

  showSetting:function(){
    var that = this;
    var dialog = new App.Comm.modules.Dialog({
      width: 580,
      height:360,
      limitHeight: false,
      title: '碰撞检查设置',
      cssClass: 'task-create-dialog',
      message: "",
      isAlert: true,
      isConfirm: false,
      okText: '关&nbsp;&nbsp;闭',
      readyFn:function(){
        this.element.find(".content").html(new App.Project.ProjectViewSetting().render().el);
        App.Project.DesignAttr.CollisionSetting.projectId = App.Project.Settings.projectId;
        App.Project.DesignAttr.CollisionSetting.projectVersionId = App.Project.Settings.CurrentVersion.id;
        App.Project.DesignAttr.CollisionSetting.collision = App.Project.Settings.collisionId;
        App.Project.DesignAttr.CollisionSetting.fetch();
      }
    })
  },
  download:function(){
    window.open("/model/"+App.Project.Settings.collisionId+"/"+App.Project.Settings.collisionId+"_ClashReport.xls","下载")
  }
});


