/*
 * @require  /services/collections/auth/member/role.list.js
 */
//@ sourceURL=services.role.window.index.js
App.Services.roleAddStatus = 0;
App.Services.roleWindowIndex = Backbone.View.extend({

    tagName:"div",
    className:"seWinBody",
    template:_.templateUrl("/services/tpls/auth/windows/services.role.window.index.html"),
    events:{
        "click .windowSubmit":"windowSubmit"
    },
    render:function(){
        this.$el.html(this.template());
        return this;
    },
    //验证
    initialize:function(){
        this.listenTo(App.Services.roleFun.collection,"add",this.addOne);
        this.listenTo(App.Services.roleFun.collection,"reset",this.render);
    },
    addOne:function(item){
        var newView = new App.Services.roleWindowFunDetail({model:item});
        this.$("#funList ul").append(newView.render().el);
        App.Comm.initScroll(App.Services.maskWindow.find(".conc"),"y");
    },

    //提交表单，完毕会触发角色列表的更新change
    windowSubmit:function(){
        if(!App.Services.roleModify){ //新增
            this.newRole();
        }else{
            this.modify();//修改
        }
    },
    //修改
    modify:function(){
        var seleFun = this.filterChecked();
        if(!seleFun.length){alert("请选择功能");return}

        var roleId =App.Services.roleModify.get("roleId");
        var cid = App.Services.roleModify.get("cid");
        var checked = App.Services.roleFun.collection.filter(function(item){
            return item.get("checked");
        });

        // var url = App.API.Settings.hostname+"platform/auth/role/"+ roleId +"/function?functionId=";
        let arr=[]
        for(var i = 0 ; i < seleFun.length ; i++){
            // if(i !== seleFun.length -1){
            //     url = url + seleFun[i].get("id") + ",";
            // }else{
            //     url = url + seleFun[i].get("id");
            // }
            arr.push(seleFun[i].get("id"))
        }
        // url+='&name='+$('#selectedRoleName').val();
        $.ajax({
            type:"put",
            url:App.API.Settings.hostname+"platform/auth/role/"+ roleId,
            data:JSON.stringify({
               functionId:arr,
               name: $('#selectedRoleName').val()
            }),
            // dataType:'json',
            contentType: "application/json",
            success:function(response){
                var cid = App.Services.roleModify.cid;
                App.Services.role.collection.get(cid).set(response.data);
                //查找collection，更新
                App.Services.maskWindow.close();
            },
            error:function(type){
                alert(type.statusText + "： " +type.status  );
                App.Services.maskWindow.close();
            }
        });

    },

    //新增
    newRole :function(){
        if(App.Services.roleAddStatus){alert("已在提交中，请等待！");App.Services.maskWindow.close();App.Services.roleAddStatus = 1;return}

        //新增角色  fetchServicesNewRole
        var name  = $("#selectedRoleName").val(),seleFun,roleModel;
        if(!name){alert("请填写角色名！");return;}
        var newRole = {
            "name": name,//角色名称
            "functionId":[] //功能ID数组
        };

        //已选功能列表
        seleFun = this.filterChecked();
        if(!seleFun.length){alert("请选择功能");return}

        _.each(seleFun,function(item){
            newRole.functionId.push(item.get("id"));
        });

        //保存数据
        roleModel = Backbone.Model.extend({
            defaults:{},
            urlType: "fetchServicesNewRole"
        });

        var data = {
            type:"create"
        };
        App.Services.newRoleModel =  new roleModel(newRole);
        App.Services.newRoleModel.save(data,{
            success:function(collection, response, options){
                if(response.code == 0){
                    //App.Services.role.collection.add(response.data);
                    console.log("role",response.data.roleId);
                    App.Services.role.init(function(){
                        var $list = $("#roleList li");
                        var newRoleId = response.data.roleId; /*新增角色ID*/
                        var len = $list.length;
                        var i;
                        for(i=0;i<len;i++)
                        {
                            if(newRoleId == $($list[i]).find(".sele").attr("id"))
                            {
                                $($list[i]).css("background-color","#a8dbfd");
                            }
                        }
                    });
                    
                }
                setTimeout(function(){
                    App.Services.roleAddStatus = 0;
                    //其他判断条件
                },200);
                App.Services.maskWindow.close();
            },
            //错误处理
            error:function(){}
        });

    },

    //过滤和辨别功能列表项
    filterChecked:function(){
        return App.Services.roleFun.collection.filter(function(item){
            return item.get("checked");
        });
    }
});
