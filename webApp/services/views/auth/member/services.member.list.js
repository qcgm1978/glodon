/*
 * @require  /services/views/auth/member/services.member.detail.js
 */

App.Services.MemberList=Backbone.View.extend({

    tagName:"div",

    events:{
        "click .batchAward":"batchAward",
        "click .selectAll":"selectAll"//全选
    },

    template:_.templateUrl("/services/tpls/auth/member/services.member.list.html"),

    render:function(){
        this.$el.html(this.template);
        return this;
    },

    initialize:function(){
        this.listenTo(App.Services.Member.innerCollection,"add",this.addOne);
        this.listenTo(App.Services.Member.innerCollection,"reset",this.render);
        this.listenTo(App.Services.Member.outerCollection,"add",this.addOne);
        this.listenTo(App.Services.Member.outerCollection,"reset",this.render);
        Backbone.on("servicesMemberControlCancelSelectAll",this.cancelSelectAll,this);
        Backbone.on("servicesMemberControlNoSelect",this.servicesMemberControlNoSelect,this);
    },
    servicesMemberControlNoSelect:function(){
        this.$("#blendList").html("<li><span class='sele'>没有选择任何组织，请点击左侧组织名选择</span></li>");
    },

    //数据加载
    addOne:function(model){
        if(App.Services.Member.memLoadingStatus){
            var newView = new App.Services.memberDetail({model:model}).render();
            this.$("#blendList").append(newView.el);
            if(!newView.$(".roles i").length){
                App.Services.exetor(newView);
            }
            App.Comm.initScroll(this.$el.find(".readyForScroll"),"y");
        }
    },

    cancelSelectAll:function(){
        this.$(".selectAll input").attr("checked",false);
        this.$("#blendList").html("<li><span class='sele'>" +
            (App.Local.data['drawing-model'].Ndd1 || "暂无数据") +
            "</span></li>");
    },

    //选中事件
    selectAll:function(){
        var type =  App.Services.MemberType,
            _this = this,
            preSele= this.$(".head input")[0].checked,
            collection = App.Services.Member[type + "Collection"];
        if(!$("#blendList li .memCheck").length){
            return
        }
        this.$(":checkbox").each(function(checkbox){
            checkbox.checked = preSele;
            if(preSele){
                _this.$("li").addClass("active");
                collection.each(function(item){item.set({"checked":true})})
            }else{
                _this.$("li").removeClass("active");
                collection.each(function(item){item.set({"checked":false})})
            }
        })
    },

    //批量授权
    batchAward:function(){
        App.Services.Member.resetMemData();
        var  _this =this,//提交地址
            type =  App.Services.MemberType,//组织类型
            seleUser,
            selected,
            disable,
            singleModel; //单选模型

        var  pre = $("#ozList span.active");
        if(pre.hasClass(".inner") || pre.hasClass(".outer")){
            App.Services.memOz = "-";
        }else{
            App.Services.memOz = pre.html();
            App.Services.searchOrg(pre);     //获取所属组织列表
        }


        //获取所选项
        seleUser = App.Services.Member[type + "Collection"].filter(function(item){
            if(item.get("checked")){
                return item.get("checked");
            }
        });
        //无选择
        if(seleUser && !seleUser.length){
            alert("您没有选择任何成员或组织，无法设置角色！");return
        }
        //弹窗框架
        _this.window();

        //单选
        if(seleUser.length == 1) {
            singleModel = seleUser[0];
            //角色数据
            App.Services.Member.loadData(App.Services.Member.SubRoleCollection,{},function(response){
                seleUser[0].set("namePath",App.Services.memOz);
                $(".seWinBody .aim ul").append(new App.Services.MemberWindowDetail({model:seleUser[0]}).render().el);
                $(App.Services.maskWindow.element[0]).removeClass("services_loading");
                var role = singleModel.get("role");
                if(role && role.length) {
                    App.Services.maskWindow.find(".memRoleList h2 i").text(role.length);
                    selected =  _.filter(role,function(item){
                        return !item.inherit
                    });
                    _this.selected(selected);
                    disable = _.filter(role,function(item){
                        return item.inherit
                    });

                    _this.disable(disable);
                }
            });
            _this.saveData(seleUser);
            return
        }

        //多选，写入已选用户和组织
        _.each(seleUser,function(item){
            item.set("namePath",App.Services.memOz);
            $(".seWinBody .aim ul").append(new App.Services.MemberWindowDetail({model:item}).render().el);
            App.Comm.initScroll(App.Services.maskWindow.find(".selec"),"y");
        });
        this.saveData(seleUser); //缓存已选数据相关数据方便提交

        App.Services.Member.loadData(App.Services.Member.SubRoleCollection,{},function(response){

            _this.getFatherData();//父项
        });

    },

    //获取父项数据
    getFatherData:function(){
        var parentId = App.Services.memFatherId,
            _this =this ;
        //无父项时获取缺省角色列表，此处为可能出错
        if(!parentId){
            App.Services.Member.loadData(App.Services.Member.SubRoleCollection,{},function(response){
                $(App.Services.maskWindow.element[0]).removeClass("services_loading");
            });
            return
        }
        var cdata = {
            URLtype:"fetchServicesOzRoleList",
            type:"GET",
            data: {
                orgId:parentId,
                outer:!(App.Services.MemberType == "inner")
            }
        };

        App.Comm.ajax(cdata,function(response){
            if(response.message=="success"){
                if(!response.data.length){
                    $(App.Services.maskWindow.element[0]).removeClass("services_loading");
                    return;}

                var role = response.data;

                if(role && role.length) {
                    _this.disable( role);
                    App.Services.maskWindow.find(".memRoleList h2 i").text(role.length);
                }

                $(App.Services.maskWindow.element[0]).removeClass("services_loading");
            }
        });
    },

    disable:function(arr){
        App.Services.Member.SubRoleCollection.each(function(item){
            for(var i = 0 ; i< arr.length ; i++){
                if(item.get("roleId") == arr[i]["roleId"]){
                    item.set("inherit", true);
                }
            }
        });
    },

    //已选状态
    selected:function(arr){
        App.Services.Member.SubRoleCollection.each(function(item){
            for(var i = 0 ; i< arr.length ; i++){
                if(item.get("roleId") == arr[i]["roleId"]){
                    item.set("checked", true);
                    if(arr[i]["inherit"]){
                        item.set("inherit", true);
                        item.set("checked", false);
                    }
                }
            }
        });
    },

    //保存要提交的数据模块，将数据混编成可提交形式
    saveData:function(seleUser){
        var saveType =  App.Services.MemberType || "inner",
            data= App.Services.memberWindowData,
            userId,
            orgId;
        //userId和orgId
        _.each(seleUser,function(item){
            userId = item.get("userId");
            orgId = item.get("orgId");
            if(saveType){
                if(userId){
                    data[saveType].userId.push(userId);
                }
                if(orgId){
                    data[saveType].orgId.push(orgId);
                }
            }
            App.Services.Member.saveMemData(data);
        });
    },

    //弹窗管理
    window:function(){
        var frame = new App.Services.MemberWindowIndex().render().el; //渲染框架
        App.Services.maskWindow = new App.Comm.modules.Dialog({
            title:(App.Local.getTranslation('system-module.Authorize') || "角色授权"),
            width:600,
            height:500,
            isConfirm:false,
            isAlert:false,
            closeCallback:function(){
                App.Services.Member.resetMemData();
            },
            message:frame
        });
        $(".mod-dialog").css({"min-height": "545px"});
        $(".mod-dialog .wrapper .content").css({"min-height": "500px"});

        $(".memRoleList").append(new App.Services.windowRoleList().render().el);//角色列表框架
        $(App.Services.maskWindow.element[0]).addClass("services_loading");//状态
    },
    //排序
    comparator:function(){}
});