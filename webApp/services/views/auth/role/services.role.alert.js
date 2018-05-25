/*
 * @require  /services/views/auth/member/services.member.ozDetail.js
 * */
App.Services.windowAlert = Backbone.View.extend({

    tagName :'div',
    className:"servicesAlert",

    template:_.templateUrl("/services/tpls/auth/windows/services.window.alert.html"),

    events:{
        "click #servicesSure":"sure",
        "click #servicesCancel":"cancel",
        "click #servicesClose":"close"
    },

    render:function(sure){
        this.$el.html(this.template());
        sure && (this.flag = sure);
        return this;
    },

    initialize:function(models){

    },

    //确定
    sure : function(){
        if(this.flag){
            return this.flag();
        }
        // $(".serviceBody .roleCtrl").addClass("services_loading");
        var _thisModel = App.Services.deleteRoleInfo,
            roleId = _thisModel.get("roleId")+'';
        $.ajax({
            url:  App.API.Settings.hostname + "platform/auth/role?roleId=" + roleId,
            type:"DELETE",
            success:function(response){
                if(response.code==0){
                    if(response.data.success[0] == roleId){  //删除成功
                        App.Services.role.collection.remove(_thisModel);
                        App.Services.alertWindow.close();
                        $(".serviceBody .roleCtrl").removeClass("services_loading");
                        return
                    }else if(response.data.failure[0] ==roleId){
                        $(".servicesAlert .confirm").hide();
                        $(".servicesAlert .alertRole").show();
                        $(".alertInfo").html("该角色正在使用中，无法删除！");
                    }
                }
                // $(".serviceBody .roleCtrl").removeClass("services_loading");
                App.Services.deleteRoleInfo ="";//清理
                
            },
            error:function(error){
                $(".serviceBody .roleCtrl").removeClass("services_loading");
                alert("错误类型"+ error.status +"，无法成功删除!");
                App.Services.alertWindow.close();
            }
        }); 
    },
        //取消
    cancel:function(){
        App.Services.alertWindow.close();
    },
    //关闭
    close:function(){
        App.Services.alertWindow.close();
    }
});

