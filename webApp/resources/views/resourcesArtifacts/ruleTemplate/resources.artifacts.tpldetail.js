/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsTplDetail = Backbone.View.extend({

    tagName:"div",
    className:"cont",
    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleTemplate/resources.artifacts.tpldetail.html"),
    events:{
        "click .delete":"delete",
        "click .edit":"edit",
        "click #resourcesSure":"resourcesSure",
        "click #resourcesCancel":"resourcesCancel"
    },

    render:function() {
        this.$el.html(this.template);
        var tabs = App.Comm.AuthConfig.resource.mappingRule;
        if(App.AuthObj.lib.mappingRuleTemplate.edit){
            this.$(".tplDetailInfo").prepend(tabs.mappingRuleTemplateEdit);
        }
        return this;
    },

    initialize:function(){
        Backbone.on("mappingRuleModelEdit",this.edit,this);
    },

    delete:function(){
        var _this = this;
        var frame = new App.Resources.ArtifactsTplAlert();
        App.Resources.ArtifactsAlertWindow = new App.Comm.modules.Dialog({
            title: "",
            width: 280,
            height: 150,
            isConfirm: false,
            isAlert: false,
            message: frame.render().el
        });
        $(".mod-dialog .wrapper .header").hide();//隐藏头部
        frame.$(".alertInfo").html('确认删除 “'+ App.ResourceArtifacts.Status.templateName   +' "?');
    },
    //编辑
    edit:function() {
        this.$(".tplDetailInfo").hide();
        this.$(".tplDetailEdit").show();
        App.ResourceArtifacts.modelEdit = true;
        Backbone.trigger("checkedChange");
    },
    //当模板为空时触发
    reset:function(){
        this.$(".tplDetailInfo h2").empty();
    },
    //保存
    resourcesSure:function(){
        var _this = this;
        var modelSaving = App.ResourceArtifacts.modelSaving;
        //如果不存在模板id则无法保存
        if(!App.ResourceArtifacts.Status.templateId){
            return
        }
        App.ResourceArtifacts.modelSaving.templateId = App.ResourceArtifacts.Status.templateId;
        App.ResourceArtifacts.modelSaving.templateName = App.ResourceArtifacts.Status.templateName = this.$(".tplDetailEdit .tplName").val();
        console.log(App.ResourceArtifacts.modelSaving);
        //要查找两级看是否是叶子节点直接过滤即可，无需查找
        var pdata = {
            URLtype: "saveArtifactsTemplateRule",
            type:"PUT",
            data:JSON.stringify(modelSaving),
            contentType: "application/json"
        };
        App.ResourceArtifacts.loading($(".modelContent"));
        App.Comm.ajax(pdata,function(response){
            console.log(response);
            if(response.code == 0 && response.data){
                //更改模板名称
                _this.$(".tplDetailTitle h2").text(App.ResourceArtifacts.Status.templateName);
                Backbone.trigger("resourcesChangeMappingRuleModelName");
                //修正模板数据
                App.ResourceArtifacts.TplCollection.each(function(item){
                    if(item.get("id") == App.ResourceArtifacts.Status.templateId){
                        item.set({"ruleId":response.data.ruleIds},{silent:true})
                    }
                });
                //取消编辑状态
                _this.resourcesCancel();
                App.ResourceArtifacts.modelEdit = false

            }else{
                alert("提交失败");
            }
            App.ResourceArtifacts.loaded($(".modelContent"));
        });
    },
    //取消编辑状态
    resourcesCancel:function(){
        this.$(".tplDetailInfo").show();
        this.$(".tplDetailEdit").hide();
        Backbone.trigger("projectMappingRuleCheckedClose");
        App.ResourceArtifacts.modelEdit = false
    }
});