
var App = App || {};
App.Services.standard = Backbone.View.extend({

  tagName:'div',

  className:'standards',

  template:_.templateUrl("/services/tpls/auth/keyUser/services.addKeyUser.standard.html"),

  events:{
    "click li":"changeStatus"
  },

  render:function(){

      var datas={
        direction : App.Services.KeyUser.standard.toJSON() || []

      };
    console.log(datas)
      this.$el.html(this.template(datas));


    return this;
  },


  initialize:function(){
    this.listenTo(App.Services.KeyUser.standard,'add',this.render)
  },

  //选定标准模型
  changeStatus:function(e){

    var $li=$(e.currentTarget);

    $li.toggleClass('selected-proj');

  }
});