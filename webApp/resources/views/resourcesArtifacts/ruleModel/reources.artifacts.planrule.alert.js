/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsPlanRuleAlert = Backbone.View.extend({
    tagName :'div',
    className:"resourcesAlert",
    template:_.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planrule.alert.html"),
    events:{
        "click #resourcesSure":"sure",
        "click #resourcesCancel":"cancel",
        "click #resourcesClose":"close"
    },
    render:function(){
        this.$el.html(this.template);
        return this;
    },
    initialize:function(models){},
    //确定
    sure : function(){
        var id = App.ResourceArtifacts.Status.delRule;
        //新建规则，直接删除
        if(!id){
            //直接删除末尾内容
            $(".outsideList>li").last().remove();
            App.Resources.ArtifactsAlertWindow.close();
            App.ResourceArtifacts.Status.saved = true;
            App.ResourceArtifacts.Status.delRule = "";
            return
        }
        //非新建
        $.ajax({
            url:App.API.Settings.hostname +"platform/mapping/rule/delete/" + id + "?projectId="+ App.ResourceArtifacts.Status.projectId,
            type:"DELETE",
            success:function(response){
                 if(response.code==0){ //删除成功
                     $(".ruleDetail").hide();
                     App.ResourceArtifacts.Status.saved = true ;//保存状态
                     var pre = App.ResourceArtifacts.PlanRules.filter(function(item){
                         return item.get("id") == id;
                     });
                     App.ResourceArtifacts.PlanRules.remove(pre);
                     App.ResourceArtifacts.Status.rule.count = App.ResourceArtifacts.PlanRules.length;
                     console.log(App.ResourceArtifacts.PlanRules);
                     if(App.ResourceArtifacts.Status.rule.count ==0){
                         Backbone.trigger("mappingRuleNoContent")
                     }

                     _.each($(".ruleTitle"),function(item){
                         if(parseInt($(item).attr("data-id")) == id){
                             $(item).closest("li").remove();
                         }
                     });
                     Backbone.trigger("resetTitle");
                }else{
                     alert("删除失败");
                 }
                App.Resources.ArtifactsAlertWindow.close();
            },
            error:function(error){
                App.Resources.ArtifactsAlertWindow.close();
                alert("错误类型"+ error.status +"，无法成功删除!");
            }
        });
        App.ResourceArtifacts.Status.delRule = null;
    },
        //取消
    cancel:function(){
        App.Resources.ArtifactsAlertWindow.close();
    },
    //关闭
    close:function(){
        App.Resources.ArtifactsAlertWindow.close();
    }
});

