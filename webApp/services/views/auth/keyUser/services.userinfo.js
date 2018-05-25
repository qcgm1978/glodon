

var App = App || {};
App.Services.userinfo = Backbone.View.extend({

  el:'.keyBody',


  template:_.templateUrl("/services/tpls/auth/keyUser/services.userinfo.html"),

  events:{
    "click .proe .link,.proe .edit":'projedit',//项目权限编辑
    "click .oz .edit,.oz .link":'orgedit',//部门权限编辑
    "click .fam .edit,.fam .link":'famedit',//族库权限编辑
    "click .standard .edit,.standard .link":'standardedit'//部门权限编辑


    //"click .keyUserList li":'toggleClass'
  },

  render:function(){

    //准备Collection的MODELS
    var datas={
      info : App.Services.KeyUser.fakedata || []

    };
    this.$el.html(this.template(datas));
    return this;
  },
  //修改项目
  projedit : function(){
    App.Services.KeyUser.clearAll();
    App.Services.maskWindow=new App.Comm.modules.Dialog({title:'',width:600,height:500,isConfirm:false});
    $('.mod-dialog .wrapper').html(new App.Services.addKeyUser().render('edit').el);
    App.Services.KeyUser.html2=[];
  },
  //修改部门授权
  orgedit : function(){
    App.Services.KeyUser.orgId = [];
    App.Services.maskWindow=new App.Comm.modules.Dialog({title:'',width:600,height:500,isConfirm:false});
    $('.mod-dialog .wrapper').html(new App.Services.addKeyUser().render('org').el);
    $('.keyU .title').show();
    $('.keyU .search').hide();

  },
  //修改族库
  famedit : function(){
    App.Services.KeyUser.pid = [];
    App.Services.maskWindow=new App.Comm.modules.Dialog({title:'',width:600,height:500,isConfirm:false});
    $('.mod-dialog .wrapper').html(new App.Services.addKeyUser().render('fam').el);
    $('.keyU .title').show();
    $('.keyU .search').hide();

  },
  //修改标准模型
  standardedit : function(){
    App.Services.KeyUser.pid = [];
    App.Services.maskWindow=new App.Comm.modules.Dialog({title:'',width:600,height:500,isConfirm:false});
    $('.mod-dialog .wrapper').html(new App.Services.addKeyUser().render('standard').el);
    $('.keyU .title').show();
    $('.keyU .search').hide();

  },
  initialize:function(){
    this.listenTo(App.Services.KeyUser.userinfo,'add',this.render);

  }

});