/*
 * @require  /services/views/auth/index.nav.es6
 * */
App.Services.MemberWindowIndex = Backbone.View.extend({

    tagName:"div",

    className:"seWinBody",

    template:_.templateUrl("/services/tpls/auth/windows/services.member.window.index.html"),

    events:{
        "click .windowSubmit":"windowSubmit",
        "mouseout .memRoleList":"removeRoleInfo"
    },


    render:function(){
        this.$el.html(this.template);
        return this;
    },

    removeRoleInfo:function(){
        $(".servicesShowAll").remove();
    },

    //提交表单，完毕会触发列表更新，列表为memBlend所属列表
    windowSubmit:function(){
        var data,
            selectRole,
            _this = this;//实际的提交信息
        $(App.Services.maskWindow.element[0]).addClass("services_loading");
        _this.removeRoleInfo();
        var submitData  = App.Services.memberWindowData;//获取要提交的成员/组织相关信息
        if(submitData){
            //获取已选角色,并添加角色ID
            selectRole = App.Services.Member.SubRoleCollection.filter(function(item){
                return item.get("checked");
            });

           // if(!selectRole.length){alert("请至少选择一个角色");return;}
            _.each(selectRole,function(item){
                submitData.roleId.push(item.get("roleId"));
            });
        }

        App.Services.Member.saveMemData(submitData);

        data = {
            URLtype:"saveServicesRole",
            data : JSON.stringify(submitData),
            type:"POST",
            contentType: "application/json"
        };

        App.Comm.ajax(data,function(response){
            var type = App.Services.MemberType || "inner";
            var collection = App.Services.Member[type + "Collection"],proto = [];
            if(response.code == 0){
                _.each(selectRole,function(item){
                    item.set("functions",null);
                    item.set("checked",false);
                    proto.push(item.toJSON());//因为不返回继承角色，因此需要存储继承角色再定
                });

                var inherit = collection.models[0].get("role");
                inherit = _.filter(inherit,function(item){return item["inherit"]});
                _.each(inherit,function(item){proto.push(item);});
                collection.each(function(item){
                    var l1 = submitData[type]["orgId"],
                        l2 = submitData[type]["userId"],
                        orgId = item.get("orgId"),
                        userId = item.get("userId");
                    if(l1.length && orgId){
                        for(var i  = 0 ;  i< l1.length ; i ++){
                            if(orgId == l1[i]){
                                item.set({"role":proto});
                                return
                            }
                        }
                    }
                    if(l2.length && userId){
                        for(var j = 0 ; j < l2.length ;j++){
                            if(userId == l2[j] ){
                                item.set({"role":proto});
                                return
                            }
                        }
                    }
                });
            }
            App.Services.Member.resetMemData();
            _this.removeRoleInfo();
            $(App.Services.maskWindow.element[0]).removeClass("services_loading");
            App.Services.maskWindow.close();
            App.Services.memOz = '';
        });
        App.Services.Member.resetMemData();
        _this.removeRoleInfo();
        App.Services.memOz = '';
    },
    initialize:function(){}
});
