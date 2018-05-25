/*
 * @require  /services/views/auth/member/services.member.ozDetail.js
 * */
App.Resources.ArtifactsWindowTpl = Backbone.View.extend({

    tagName :'div',
    className:"resourcesAlert",
    template:_.templateUrl("/resources/tpls/resourcesArtifacts/ruleTemplate/resources.artifacts.window.tpl.html"),
    events:{
        "click .windowSubmit":"sure"
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },
    initialize:function(models){},
    //确定
    sure : function(){
        var _this = this,pdata;
        var name = $("#artifactsTplName").val();
        if(!name){
            alert("模板名称不能为空!");
            return
        }
        var baseData = {
            "name": name,
            "descr": "",
            "biz": App.ResourceArtifacts.Status.rule.biz
        };
        pdata = {
            URLtype:"createArtifactsTemplate",
            data:JSON.stringify(baseData),
            type:"POST",
            contentType: "application/json"
        };
        App.Comm.ajax(pdata,function(response){
            if(response.code == 0&&  response.data ){
                    baseData.id = response.data.id;
                    App.ResourceArtifacts.TplCollection.push(baseData);
                //刷新右面名称，数据，视图
                App.ResourceArtifacts.TplCollectionRule.reset();
                //触发事件
            }
        });
        App.Resources.ArtifactsMaskWindow.close();
    },
    //取消
    cancel:function(){
        App.Resources.ArtifactsMaskWindow.close();
    },
    //关闭
    close:function(){
        App.Resources.ArtifactsMaskWindow.close();
    }
});

