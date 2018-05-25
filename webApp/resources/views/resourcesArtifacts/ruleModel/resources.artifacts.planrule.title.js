/**
 * @require /resources/collection/resources.nav.es6
 */
App.Resources.ArtifactsPlanRuleTitle = Backbone.View.extend({

    tagName:"div",

    className:"pozero",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planruletitle.html"),

    events:{
        "click .newPlanRule":"newPlanRule"
    },

    render:function() {
        this.$el.html(this.template);
        return this;
    },

    initialize:function(){
        Backbone.on("resetTitle",this.resetTitle,this);
    },

    resetTitle:function(){
        this.$("h2 .name").html(App.ResourceArtifacts.Status.rule.targetCode +
            " " +App.ResourceArtifacts.Status.rule.targetName  +
            "("+App.ResourceArtifacts.Status.rule.count + ")");
    },
    //创建规则
    newPlanRule:function(){
        var _this = this;
        var targetCode = App.ResourceArtifacts.Status.rule.targetCode;

        if(!targetCode){
            alert("请选择模块/质量标准");
            return;
        }//没有选择计划无法创建规则
        if( !App.ResourceArtifacts.Status.saved){
            alert("您还有没保存的");
            return
        }
        //重置删除状态
        App.ResourceArtifacts.Status.delRule ="";

        //无数据或无更改，更改当前数据
        $(".ruleDetail:visible").hide();

        //创建规则
        var model =  App.ResourceArtifacts.createPlanRules();
        //加载底下规则
        var operatorData = App.Resources.dealStr2(model);//规则数据
        model.set({mappingCategory:operatorData},{silent:true});
        var container = new App.Resources.ArtifactsPlanRuleDetail({model:model});

        var li = $(".ruleContentRuleList ul.outsideList>li");
        if(li.length == 1 && !li.attr("data-check")){
            $(".ruleContentRuleList ul.outsideList").html(container.render().el).show();
        }else{
            $(".ruleContentRuleList ul.outsideList").append(container.render().el).show();
        }

        App.ResourceArtifacts.Status.saved = false;
        $(".ruleContentRuleList ul.outsideList>li:last-child .ruleDetail").show();


    }

});