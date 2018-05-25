/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsPlanRuleDetailNew = Backbone.View.extend({

    tagName:"dd",

    template: _.templateUrl("/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planruledetailnewx.html"),

    events:{
        "click .delRule": "delRule",
        "click .myItem":"myItem",
        "click .myDropText":"seleRule"
    },

    render:function() {

        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    initialize:function(){
        this.listenTo(this.model,"change",this.render);
    },
    //切换规则
    seleRule:function(e){
        var _this = $(e.target);
        App.Resources.cancelBubble(e);
        $(".myDropList").hide();
        _this.closest(".myDropText").siblings(".myDropList").show();
        _this.siblings(".myDropArrorw").removeClass("down").addClass("up");
    },
    //选择规则，切换输入方式
    myItem:function(e){
        var _this = $(e.target);
        var operator = _this.data("operator");
        var text = _this.text();
        var parent =  _this.parent(".myDropList");
        var eIn = _this.closest(".leftten").siblings(".eIn");
        var ioside  = _this.closest(".leftten").siblings(".ioside");
        //数据写入模型
        parent.hide().siblings(".myDropText").find(".text").text(text);
        _this.closest(".myDropDown").attr("data-operator",operator);
        _this.closest(".myDropDown").find(".myDropArrorw").removeClass("up").addClass("down");

        if(operator == "==" || operator == "!="){
            ioside.removeClass("active");
            if(eIn.hasClass("active")){return}
            eIn.addClass("active");
        }else if(operator == "<>" || operator == "><"){
            eIn.removeClass("active");
            if(ioside.hasClass("active")){return}
            ioside.addClass("active");
        }
    },
    //删除
    delRule:function(){
        this.$el.remove();//删除元素
    }
});