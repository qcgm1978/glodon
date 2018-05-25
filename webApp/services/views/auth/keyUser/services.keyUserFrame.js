/**
 * @require /services/collections/auth/keyuser/keyuser.js
 */

var App = App || {};
App.Services.keyUserFrame = Backbone.View.extend({

    tagName:"div",

    className:"keyUserBody",

    template:_.templateUrl("/services/tpls/auth/keyUser/services.keyUser.html"),

    events:{
        "click .newKeyUsers":"newKeyUser",
        "click .keyUserList li":'toggleClass',
        "click .keyUserList .delete":'delete'


    },

    render:function(){

        //准备多个Collection的MODELS
        var datas={
            keyUser : App.Services.KeyUser.KeyUserList.toJSON() || []

        };
        this.$el.html(this.template(datas));
        return this;
    },

    //切换active状态并且初始化右边的userinfo VIEW
    toggleClass:function(e){

        if($(e.target).hasClass('delete')){
            return
        }
        var uuid = App.Services.KeyUser.uuid = $(e.target).attr('data-uid');

        $(e.target).toggleClass('active').siblings().removeClass('active');

        /*add by wuweiwei 2017-2-16 当不选中时右侧页面重置为空页面 begin*/
        if(!$(e.target).hasClass('active'))
        {
            $("#contains .keyBody").html('<h1 class="remindicon" style="margin:100px auto;font-size:18px;width:371px;color: #ccc;">暂无信息,请点击选择左侧的关键用户!</h1>');
            return;
        }
        /* end */
        var datas = {
            uid : uuid
        };
        var data={
            URLtype :"fetchServiceKeyUserInfo",
            type:"GET",
            //contentType:"application/json",
            data:JSON.stringify(datas)
        };
        App.Comm.ajax(data,function(data){
            if (data.code==0) {
                App.Services.KeyUser.fakedata=data.data;
                App.Services.KeyUser.editpid=_.pluck(data.data.project,'id');
                App.Services.KeyUser.editorgId=_.pluck(data.data.org,'orgId');
                App.Services.KeyUser.view && App.Services.KeyUser.view.undelegateEvents();
                App.Services.KeyUser.view=new App.Services.userinfo().render();

            }

        });

    },

    //提交表单，完毕会触发重新获取列表，列表为memBlend所属列表
    newKeyUser:function(){
        App.Services.KeyUser.clearAll();
        App.Services.maskWindow=new App.Comm.modules.Dialog({title:'新增关键用户',width:600,height:500,isConfirm:false});
        $('.mod-dialog .wrapper').html(new App.Services.addKeyUser().render().el);

    },

    //delete
    delete : function(e){
        var uid = $(e.target).attr('data-uid');
        var $li = $(e.target).parent();
        var username = $(e.target).attr('data-name');
        var $usernum = this.$el.find('.usernum');



        var frame = new App.Services.windowAlert().render(function(){
              var data={
                              URLtype :"fetchServiceKeyUserDelete",
                              type:"DELETE",
                              data:JSON.stringify({uid : uid})

                          };
            if(App.Services.KeyUser.applying){
                return ""
            }else{
                App.Services.KeyUser.applying=true;
            }
                          App.Comm.ajax(data,function(data){
                              App.Services.KeyUser.applying=false;

                              if (data.code==0) {
                                  if($li.is('.active')){
                                      $('.keyBody').html('');
                                  }
                                  $li.remove();
                                  $('.mod-dialog,.mod-dialog-masklayer').hide();
                                  $usernum.text($usernum.text()-1);
                              }

                          });
        }).el;
        var alertInfo = '确认要删除关键用户“'+username+'”？ <br> <span style="color:#999;">删除该关键用户后，该用户将不能继续管理项目</span>';

        App.Services.alertWindow = new App.Comm.modules.Dialog({
            title: "",
            width: 280,
            height: 180,
            isConfirm: false,
            isAlert: false,
            message: frame
        });
        $(".mod-dialog .wrapper .header").hide();//隐藏头部
        $(".alertInfo").html(alertInfo);
        $(".mod-dialog,.mod-dialog .wrapper .content").css({"min-height":"auto"});

    },



    //userinfo
    userinfo:function(){

    },

    initialize:function(){


        this.listenTo(App.Services.KeyUser.KeyUserList,'add',this.render);
        this.listenTo(App.Services.KeyUser.userinfo,'add',this.userinfo);
    }
});

