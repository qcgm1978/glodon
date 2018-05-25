/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsTplAlert = Backbone.View.extend({

    tagName :'div',
    className:"resourcesAlert",

    template:_.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planrule.alert.html"),

    events:{
        "click #resourcesSure":"sure",
        "click #resourcesCancel":"cancel"
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },
    initialize:function(models){},
    //确定
    sure : function(){
        var templateId =  App.ResourceArtifacts.Status.templateId;
        //非新建
        $.ajax({
            url: App.API.Settings.hostname +"platform/rule/template/delete/" + templateId ,
            type:"DELETE",
            success:function(response){
                 if(response.code == 0){ //删除成功

                     App.ResourceArtifacts.Status.saved = true ;//保存状态

                    //删除模型
                     var pre = App.ResourceArtifacts.TplCollection.filter(function(item){
                         return item.get("id") == templateId;
                     });
                     App.ResourceArtifacts.TplCollection.remove(pre);

                    //删除相应视图
                     _.each($(".tplCon .item"),function(item){
                         if(parseInt($(item).attr("data-id")) == templateId){
                             $(item).closest("li").remove();
                         }
                     });

                     Backbone.trigger("resetTitle");//刷新右侧标题
                     Backbone.trigger("mappingRuleResetModel");//刷新右侧正文
                     App.ResourceArtifacts.Status.templateId = "";//清空所选模板
                }else{
                     alert("删除失败");
                 }
                App.Resources.ArtifactsAlertWindow.close();
                $(".artifactsContent .rules").removeClass("services_loading");
            },
            error:function(error){
                alert("错误类型"+ error.status +"，无法成功删除!");
            }
        });
    },
        //取消
    cancel:function(){
        $(".artifactsContent .rules").removeClass("services_loading");
        App.Resources.ArtifactsAlertWindow.close();
    },
    //关闭
    close:function(){
        $(".artifactsContent .rules").removeClass("services_loading");
        App.Resources.ArtifactsAlertWindow.close();
    }
});

