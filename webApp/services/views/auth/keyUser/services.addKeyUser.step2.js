

var App = App || {};
App.Services.step2 = Backbone.View.extend({

  tagName:'div',

  className:'step2',

  template:_.templateUrl("/services/tpls/auth/keyUser/services.addKeyUser.step2.html"),

  events:{
    "click li":"changeStatus"
    //"click .keyUserList li":'toggleClass'
  },

  render:function(searchvalue){
    var index=$('.partition .active').attr('data-index');
    //准备Collection的MODELS
    if(index==2){
      var str='<li class="project list"  data-id=9991><h3  data-id=9991  >中区</h3></li>'+
        '<li class="project list"  data-id=9992><h3  data-id=9992  >南区</h3></li>'+
        '<li class="project list"  data-id=9993><h3  data-id=9993  >北区</h3></li>';
      this.$el.html(str);

    }else{
      if(typeof searchvalue == 'string'){

        var data =_.filter(App.Services.KeyUser.Step2.toJSON(),function(item){
          return item.name.indexOf(searchvalue)>-1;
        });
        var datas={
          direction : data || []

        };
      }else{
        var datas={
          direction : App.Services.KeyUser.Step2.toJSON() || []

        };
      }

      this.$el.html(this.template(datas));
    }
    $('.partition').show();
    if(App.Services.KeyUser.mode==3){
      $('.step2').css({background:"#ccc"});

    }
    return this;
  },


  initialize:function(){
    this.listenTo(App.Services.KeyUser.Step2,'add',this.render)
  },

  //选定项目
  changeStatus:function(e){
    if(App.Services.KeyUser.mode==3){
      return ''
    }
      var $li=$(e.currentTarget);

      $li.toggleClass('selected-proj');

  }
});