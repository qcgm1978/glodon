/**
 * @require /resources/collection/resource.nav.es6
 */
App.Resources.ArtifactsPlanRuleDetail = Backbone.View.extend({

    tagName:"li",

    template: function(){
        var url = "";
        if(App.ResourceArtifacts.Status.templateId){
            url = "/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planruledetail.projectx.html";
        }else{
            url = "/resources/tpls/resourcesArtifacts/ruleModel/resources.artifacts.planruledetailx.html";
        }
        return _.templateUrl(url)
    },

    events:{
        "click .desc":"getDetail",
        "click .tabRule":"tabRule",
        "click .addNewRule":"addNewRule",
        "click .deleteRule":"deleteRule",
        "click .saveRule":"saveRule",
        "click .choose":"choose",
        "click .delRule": "delRule",
        "click .categoryCode": "legend",
        "click .text":"seleRule",
        "click .myItem":"myItem",
        "click .ruleCheck":"ruleCheck"
    },

    render:function() {
        var _this = this;
        //映射规则
        var operatorData = App.Resources.dealStr2(_this.model);//规则数据
        this.model.set({mappingCategory:operatorData},{silent:true});
        this.$el.html(this.template()(this.model.toJSON()));

        //写入是否选中
        if(App.ResourceArtifacts.Status.check == "1"){
            this.$(".ruleCheck").addClass("all");
            this.$el.attr("data-check",App.ResourceArtifacts.Status.check );
        }else if(App.ResourceArtifacts.Status.check == "0"){
            this.$el.attr("data-check",App.ResourceArtifacts.Status.check );
        }else{
            var modelRule = this.getModelRule();
            var check = _.find(modelRule,function(item){
                return item == _this.model.get("id");
            });
            if(check){
                this.$(".ruleCheck").addClass("all");
                this.$el.attr("data-check","1");
            }else{
                this.$el.attr("data-check","0");
            }
        }
        return this;
    },
    initialize:function(){
        this.listenTo(this.model,"change",this.render);
        Backbone.on("modelRuleSelectNone",this.modelRuleSelectNone,this);
        Backbone.on("modelRuleSelectAll",this.modelRuleSelectAll,this);
    },

    modelRuleSelectNone:function(){
        this.$el.attr("data-check","0");
        if(this.$(".ruleCheck").hasClass("all")){
            this.$(".ruleCheck").removeClass("all")
        }
    },

    modelRuleSelectAll:function(){
        this.$el.attr("data-check","1");
        if(!this.$(".ruleCheck").hasClass("all")){
            this.$(".ruleCheck").addClass("all")
        }
    },
    //查找 项目规则collection，返回规则id数组
    getModelRule:function(){
        return App.ResourceArtifacts.TplCollectionRule.map(function(item){
            return item.get("ruleId");
        })
    },
    //选中状态
    ruleCheck:function(e){
        App.Resources.cancelBubble(e);
        var _this = this,id = _this.model.get("id");
        //原有的所有数据
        var modelSaving = App.ResourceArtifacts.modelSaving.codeIds;
        //查找当前已选code的并修改其内的ruleId列表

        var n = "string";
        for(var is = 0 ; is < modelSaving.length ; is++){
            if(modelSaving[is].code == App.ResourceArtifacts.Status.rule.targetCode){
                n = is;
                break
            }
        }
        if( n == "string"){
            App.ResourceArtifacts.modelSaving.codeIds.push({code:App.ResourceArtifacts.Status.rule.targetCode,ruleIds:[]});
            n = App.ResourceArtifacts.modelSaving.codeIds.length - 1;
        }

        var ele = $(e.target);
        var allSele = ele.closest("ul").find("li");
        //半选状态

        if(ele.hasClass("all")){
            ele.removeClass("all");
            ele.closest("li").attr("data-check","0");

            //全不选时触发左侧变化
            var checked1 = _.filter(allSele,function(item){
                return $(item).attr("data-check") == "1"
            });
            if(!checked1.length){
                Backbone.trigger("modelRuleEmpty");
            }else{
                Backbone.trigger("modelRuleHalf");
            }
            var listEle = _.filter($(".outsideList li"),function(item){
                return $(item).attr("data-check") == "1"
            });
            var idList = [];
            _.each(listEle,function(item){
                idList.push($(item).find(".ruleTitle").attr("data-id"));
            });
            App.ResourceArtifacts.modelSaving.codeIds[n].ruleIds = idList;

        }else{
            ele.closest("li").attr("data-check","1");

            //全选时触发左侧变化
            var checked2 = _.filter(allSele,function(item){
                return $(item).attr("data-check") == "0"
            });
            ele.addClass("all");
            if(!checked2.length){
                Backbone.trigger("modelRuleFull");
            }else{
                Backbone.trigger("modelRuleHalf");
            }

            var listEle2 = _.filter($(".outsideList li"),function(item){
                return $(item).attr("data-check") == "1"
            });
            var idList2 = [];
            _.each(listEle2,function(item){
                idList2.push($(item).find(".ruleTitle").attr("data-id"));
            });
            App.ResourceArtifacts.modelSaving.codeIds[n].ruleIds = idList2;
        }
    },
    getDetail:function(){
        if(this.$(".ruleDetail:visible").length){    //显示
            this.$(".ruleDetail").hide();
        }else{
            $(".ruleDetail").hide();
            this.$(".ruleDetail").show();
        }
    },
    //选择分类编码
    choose:function(){
        var tree  = new App.Resources.ArtifactsWindowRule().render().el;
        this.window(tree);
        App.Resources.ArtifactsMaskWindow.find(".content").css({"position":"relative"});
        var contain = App.Resources.artifactsTree(App.Resources.artifactsTreeData);
        $(".resourcesArtifactTree").html(contain);
        App.ResourceArtifacts.presentRule = this.model;
    },
    //增加新规则
    addNewRule:function(){
        var model = new App.ResourceArtifacts.newRule(App.ResourceArtifacts.newModel);
        var view = new App.Resources.ArtifactsPlanRuleDetailNew({model:model}).render().el;
        this.$(".conR dl").append(view);
    },
    //保存
    saveRule:function(e){
        App.Resources.cancelBubble(e);
        var ele = $(e.target);
        //校验
        /*var  check = this.check();
        if(!check){return}*/

        var _this =this;
        //查找所有数据，拼接成字符串
        var title =  this.$(".ruleTitle");
        var id = title.data("id");

        var categoryCode = App.ResourceArtifacts.Status.rule.mappingCategory.categoryCode  ||  this.$(".categoryCode").val();
        var categoryName = App.ResourceArtifacts.Status.rule.mappingCategory.categoryName || this.$(".chide i").text();
        //验证分类编码有效性
        var  departCode = _.find(App.Resources.artifactsTreeData,function(item){
            return item.code == categoryCode;
        });
        if(!departCode){
            alert("分类编码不合法!");
            ele.closest(".mapRule").siblings(".typeCode").find(".categoryCode").focus();
            return
        }
        if(!categoryCode){
            alert("分类编码不能为空!");
            return
        }
        if(!this.$(".conR dd").length){
            alert("至少添加一项规则!");
            return
        }
        var ruleCon = ele.closest(".mapRule").find(".myDropDown");
        var unSelect =  _.find(ruleCon,function(item){
            return !$(item).attr("data-operator")
        });
        if(unSelect){
            alert("请选择规则类型!");
            $(unSelect).find(".myDropList").show();
            return
        }

        var model = App.ResourceArtifacts.saveRuleModel();
        var dd =  this.$("dd");
        var Rulist = [];
        var operator = "";

        for(var i =0 ; i < dd.length ; i++){
            Rulist[i]  ={};
            var propertyKey = dd.eq(i).find(".leftten input");
            if(!propertyKey.val()){
                propertyKey.focus();
                alert("规则名称不能为空！");
                return
            }
            Rulist[i].propertyKey = propertyKey.val();

            operator = dd.eq(i).find(".leftten .myDropDown").attr("data-operator");

            Rulist[i].operator = operator;

            if(dd.eq(i).find(".eIn").hasClass("active")){
                var name = dd.eq(i).find(".eIn input");
                if(!name.val()){
                    name.focus();
                    alert("规则内容不能为空");
                    return
                }
                Rulist[i].propertyValue = name.val();

            }else if(dd.eq(i).find(".ioside").hasClass("active")){
                if(!dd.eq(i).find(".ioside.active").length && !dd.eq(i).find(".eIn.active").length){
                    alert("至少选一项规则！");
                    return
                }
                var left = dd.eq(i).find(".ioside .myDropDown").eq(0).data("operator");
                var leftValue = dd.eq(i).find(".ioside input").eq(0);
                var right = dd.eq(i).find(".ioside .myDropDown").eq(1).data("operator");
                var rightValue = dd.eq(i).find(".ioside input").eq(1);

                if(!leftValue.val() && !rightValue.val()){
                    leftValue.focus();
                    alert("请至少填写一项数据");
                    //设定数据
                    return
                }

                if(!leftValue.val()){
                    left = ""
                }
                if(!rightValue.val()){
                    right = ""
                }

                //有效性验证
                if(leftValue.val() && rightValue.val()){
                    if(parseInt(leftValue.val()) >=parseInt(rightValue.val())){
                        alert("请填写有效的数字");
                        leftValue.focus();
                        return
                    }
                }

                var str = left  + leftValue.val() +","+ rightValue.val()+ right ;
                Rulist[i].propertyValue = str;
            }
        }

        model.mappingCategory.categoryCode = categoryCode;
        model.mappingCategory.categoryName = categoryName;
        model.mappingCategory.mappingPropertyList = Rulist;


        this.model.set({"targetCode":App.ResourceArtifacts.Status.rule.targetCode},{silent:true});
        this.model.set({"targetName":App.ResourceArtifacts.Status.rule.targetName},{silent:true});
        this.model.set({"biz":App.ResourceArtifacts.Status.rule.biz},{silent:true});
        this.model.set({"type":App.ResourceArtifacts.Status.type},{silent:true});
        this.model.set({"mappingCategory": model.mappingCategory},{silent:true});

        var baseData = this.model.toJSON();

        var cdata = {
            type:"POST",
            data : JSON.stringify(baseData),
            contentType: "application/json",
            projectId : App.ResourceArtifacts.Status.projectId
        };

        $(".artifactsContent .rules").addClass("services_loading");

        if(id){
            //更新
            cdata.URLtype = "modifyArtifactsPlanRule";
            cdata.type ="PUT";

            $.ajax({
                url: App.API.Settings.hostname +"platform/mapping/rule/update?projectId=" + App.ResourceArtifacts.Status.projectId,
                data:JSON.stringify(baseData),
                contentType: "application/json",
                type:"PUT",
                success:function(response){
                    if(response.code == 0 && response.data){
                        _this.$(".ruleTitle").attr("data-id",response.data.id);
                        _this.model.set({id:response.data.id},{silent:true});
                        _this.$(".ruleTitle .desc").text("[" + categoryCode + "] " + categoryName);
                        _this.$(".ruleDetail").hide();
                    }
                    $(".artifactsContent .rules").removeClass("services_loading");
                }
            });
        }else{
            //创建
            cdata.URLtype = "createArtifactsPlanNewRule";
            $.ajax({
                url: App.API.Settings.hostname +"platform/mapping/rule/create?projectId=" + App.ResourceArtifacts.Status.projectId,
                data:JSON.stringify(baseData),
                type:"POST",
                contentType: "application/json",
                success:function(response){
                    if(response.code == 0 && response.data){
                        _this.model.set({id:response.data.id},{silent:true});
                        _this.$el.remove();
                        App.ResourceArtifacts.PlanRules.push(_this.model);
                        App.ResourceArtifacts.Status.rule.count = App.ResourceArtifacts.PlanRules.length;
                        Backbone.trigger("resetTitle");
                    }
                    $(".artifactsContent .rules").removeClass("services_loading");
                }
            });
        }
        App.ResourceArtifacts.Status.saved = true;
    },

    //删除计划中的整条规则
    deleteRule:function(){
        var _this = this;
        App.ResourceArtifacts.Status.delRule = this.model.get("id");
        var frame = new App.Resources.ArtifactsPlanRuleAlert().render().el;
        App.Resources.ArtifactsAlertWindow = new App.Comm.modules.Dialog({
            title: "",
            width: 280,
            height: 150,
            isConfirm: false,
            isAlert: false,
            message: frame
        });
        $(".mod-dialog .wrapper .header").hide();//隐藏头部
        $(".alertInfo").html('确认删除 “'+ _this.model.get("mappingCategory").categoryName   +' "?');
    },

    //联想模块
    legend:function(e){
        App.Resources.cancelBubble(e);
        var _this = this;
        _this.$(".chide").css({"visibility":"hidden"});
        var ac = _.map(App.Resources.artifactsTreeData,function(item){return item.code}); //对象-数组
        var pre = $(e.target);
        $(e.target).addClass("active");
        pre.css({"opacity":"1"});
        var list = pre.closest("div").siblings("ul");
        list.html();
        if(pre.val()){
            list.show();
        }
        //变红
        pre.on("keydown",function(e){
            list.show();
            //console.log(e.keyCode);
            var key = e.keyCode;
            var ele = $(e.target).closest("div").siblings("ul");
            var preList = ele.find("li");
            var preEle = ele.find("li.active").index(preList);
            var index = preEle != -1 ? preEle : 0;
            if(key == 38){
                //上移
                var prev = App.Resources.prev(index,preList.length);
                preList.eq(prev).addClass("active").siblings("li").removeClass("active");
            }else if(key == 40){
                //下移
                var next = App.Resources.next(index,preList.length);
                preList.removeClass("active");
                preList.eq(next).addClass("active").siblings("li").removeClass("active");
            }
            pre.removeClass("alert");
        });
        pre.on("keyup",function(e){
            App.Resources.cancelBubble(e);
            var key = e.keyCode;
            if(key != 38 || key != 40 || key != 13){
                var val = pre.val(),test, count = 5,str = '',index,unResult = "<li >搜索：无匹配结果</li>";  //显示5条
                list.html("");
                val = val.replace(/\s+/,'');
                if(!val){list.hide();return}
                val = val.replace(/\u3002+/,'.');
                //禁止输出除数字，半角句号外的
                test = /[^\d\.]+/.test(val);
                if(test){
                    list.html(unResult);
                    return;
                }

                str = val;
                var x = str.length%3;
                if(x ==0){
                    if(_.last(str) != "."){ list.html(unResult);return}
                    str = _.initial(str);
                    str = str.join('');
                    index = _.indexOf(ac,str,true);
                }else if(x == 1){
                    for(var s = 0 ; s< 9 ; s++){
                        var sd = str + s + '';
                        index = _.indexOf(ac,sd);
                        if(index >= 0){
                            break
                        }
                    }
                }else{
                    index = _.indexOf(ac,str,true);
                }

                if(index < 0 ){
                    list.html(unResult);
                    return
                }
                for(var j = index  ;  j < App.Resources.artifactsTreeData.length  ; j++){
                    if(App.Resources.artifactsTreeData[j].length <= val.length ||  j - index  + 1 >count) {
                        break
                    }
                    var newRule = new App.ResourceArtifacts.newCode(App.Resources.artifactsTreeData[j]);
                    list.append(new App.Resources.ArtifactsRuleLegend({model:newRule}).render().el);
                }
            }else if(key == 13){
                //回车键
            }
        });
    },

    //校验模块
    check:function(){
        var vals = this.$(".categoryCode");
        if(!vals.val()){
            vals.focus();
            this.redAlert(vals);
            return false;
        }
        return true
    },
    //初始化窗口
    window:function(frame){
        App.Resources.ArtifactsMaskWindow = new App.Comm.modules.Dialog({
            title:"选择分类编码",
            width:600,
            height:500,
            isConfirm:false,
            isAlert:false,
            closeCallback:function(){
                App.Resources.ArtifactsMaskWindow.close();
            },
            message:frame
        });
    },
    //红色提示输入
    redAlert:function(ele){
        ele.addClass("alert");
    },
    //切换规则
    seleRule:function(e) {
        App.Resources.cancelBubble(e);
        var _this = $(e.target);
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
    delRule:function(e){
        var _this = $(e.target);
        _this.closest("dd").remove();//删除元素
        //还用管未更新的model么？
    }
});