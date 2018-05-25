

var App = App || {};
App.Services.step1 = Backbone.View.extend({

  tagName:'div',

  className:'step1',

  template:_.templateUrl("/services/tpls/auth/keyUser/services.addKeyUser.step1.html"),

  events:{
    "click  p":"changeStatus"
  },

  render:function(name){
    var self = this;
    if(name && name=='step3'){
      this.$el.addClass('step1in3');
    }else if(typeof name=='string'){
      $.ajax({
        //url: "platform/auth/user?name="+name
        url: "platform/auth/search/user?name="+name //modify by wuweiwei 2017-5-12
      }).done(function(data){
        // console.log(data);
        if(data.code == 0){
          var items = data.data, str = "";

          $.each(items, function(i, item){
            if(item.name){
              str+="<li>"+
                "<p class='person "+"' data-uid='"+item['userId']+ "'  ><i ></i><span class='isspan'>"+ item['name']+"</span><span class='namepath' title='"+item['orgNamePath']+"'> (..."+(item['orgNamePath']).split(">").pop()+")</span></p>"+
                "</li>";
            }

          });
          self.$el.html(str);

        }
      });
    }else{
      //准备Collection的MODELS
      var datas={
        direction : App.Services.KeyUser.Step1.toJSON() || []

      };
      this.$el.html(this.template(datas));
    }

    return this;
  },


  initialize:function(){
    this.listenTo(App.Services.KeyUser.Step1,'add',this.render)
  },

  //打开或关闭目录
  changeStatus:function(e){
    var $p,instep3,target,el=this.$el;
    if($(e.target).hasClass('person') || $(e.target).hasClass('mulu') ){
      $p = $(e.target);
      target = 'p';
    }else{
      $p = $(e.target).parent();
      if($(e.target).hasClass('isspan')){
        target = 'span';
      }else{
        target = 'i';
      }
    }
    var $ul=$p.siblings('ul');
    //判断是否是step3里加载的step1
    instep3 = this.$el.hasClass('step1in3');
    var func = function(isstep3){
      //是否需要加载子目录
      var canLoad = $p.attr('data-canLoad');
      var orgId = $p.attr('data-id');
      var outer = $p.attr('data-outer');
      if (orgId) {
        if ($ul.hasClass('shut')) {
          $p.removeClass('shut').addClass('open');
          if (canLoad == 'true') {
            $ul.removeClass('shut').addClass('open');
            $('.leftWindow').addClass("services_loading");
            var getUserPromise = new Promise(function(resolve,reject){//获取内部用户
              App.Comm.ajax({
                URLtype: 'fetchServicesMemberList',
                data:{
                  outer:outer == "true"?true:false,
                  parentId:orgId, 
                  includeUsers:true
                }
              }, function(r) {
                $('.leftWindow').removeClass("services_loading");
                if (r && !r.code && r.data){
                  var str = '';
                  if (isstep3 != "isstep3") {
                    _.each(r.data.user,function(data){
                      data.canLoad = false;
                      str+="<li>"+
                        "<p class='person "+"'data-outer='"+data['outer']+ "' data-uid='"+data['userId']+ "' data-canLoad='true' ><i ></i><span class='isspan'>"+ data['name']+"</span></p>"+
                        "</li>";
                    });
                  }
                  _.each(r.data.org,function(data){
                    data.shut = true;
                    data.canLoad = true;
                    str+="<li>"+
                      "<p class='shut mulu"+"'data-outer='"+data['outer']+ "' data-id='"+data['orgId']+ "' data-canLoad='"+(data['hasChildren']||data['hasUser']?true:false)+ "'><i ></i><span class='isspan'>"+ data['name']+"</span></p>"+
                      "<ul class='shut'></ul>"+
                      "</li>";
                  });
                  resolve(str);
                }else{
                  reject(false)
                }
              });
            })
            getUserPromise.then(function(data){
              $p.siblings('ul').html(data);
            })
            /*App.Comm.ajax({URLtype:'fetchServicesMemberInnerList', data:{parentId:orgId, includeUsers:true}}, function(r){
              $('.leftWindow').removeClass("services_loading");
              if (r && !r.code && r.data){
                var str = '';
                if (isstep3 != "isstep3") {
                  _.each(r.data.user,function(data){
                    data.canLoad = false;
                    //<%= data[i]['child'] && data[i]['child'][0]=='string'?'lastLayer':''%>
                    str+="<li>"+
                      "<p class='person "+"' data-uid='"+data['userId']+ "' data-canLoad='true' ><i ></i><span class='isspan'>"+ data['name']+"</span></p>"+
                      "</li>";
                  });
                }

                _.each(r.data.org,function(data){
                  data.shut = true;
                  data.canLoad = true;
                  //<%= data[i]['child'] && data[i]['child'][0]=='string'?'lastLayer':''%>
                  str+="<li>"+
                    "<p class='shut mulu"+"' data-id='"+data['orgId']+ "' data-canLoad='"+(data['hasChildren']||data['hasUser']?true:false)+ "'><i ></i><span class='isspan'>"+ data['name']+"</span></p>"+
                    "<ul class='shut'></ul>"+
                    "</li>";
                });
                //$ul[0].innerHTML = str;
                $p.siblings('ul').html(str);


              }
            });*/
            $p.attr('data-canLoad','false')
          }else{
            $ul.removeClass('shut').addClass('open');
            $p.removeClass('shut').addClass('open');

          }

        }else{
          $ul.removeClass('open').addClass('shut');
          $p.removeClass('open').addClass('shut');

        }
      }else{
        //选定人员
        el.find('.toselected').removeClass('toselected');
        $p.parent().addClass('toselected');

      }
    };
    if(instep3){
      //点击的是文件夹ICON
      if(target == 'i'){
        func('isstep3')
      }else{
        $('.leftWindow').find('.toselected').removeClass('toselected');
        $p.parent().addClass('toselected');
      }
    }else{
      func()
    }



  }
});