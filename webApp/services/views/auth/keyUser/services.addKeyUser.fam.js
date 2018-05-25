
var App = App || {};
App.Services.fam = Backbone.View.extend({

  tagName:'div',

  className:'fams',

  template:_.templateUrl("/services/tpls/auth/keyUser/services.addKeyUser.fam.html"),

  events:{
    "click li":"changeStatus"
  },

  render:function(){

      var datas={
        direction : App.Services.KeyUser.fam.toJSON() || []

      };
      this.$el.html(this.template(datas));

console.log('1')
    return this;
  },


  initialize:function(){
    this.listenTo(App.Services.KeyUser.fam,'add',this.render)
  },

  //选定族库
  changeStatus:function(e){

    var $li=$(e.currentTarget);

    $li.toggleClass('selected-proj');

  }
});