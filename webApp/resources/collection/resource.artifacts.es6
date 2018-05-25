//fetchArtifactsPlan   获取计划
//fetchArtifactsPlanRule   获取规则
App.ResourceArtifacts={
    Status:{
        saved : true,    //创建规则后的保存状态，已保存  /  未保存
        qualityProcessType:1,   //质量标准 -过程选择  type
        delRule:"",
        qualityStandardType:"GC",   //质量标准 -过程选择  type
        type:"", //1:标准规则；2：项目规则
        projectId : "",//如果有项目规则就有项目id
        templateId:"",
        modelEdit:false,
        templateName:"",
        rule:{
            biz:"",//1：模块化；2：质监标准
            type : "", //1:标准规则；2：项目规则
            targetCode:"",  //对应模块的code
            targetName:"",
            count:"",
            "mappingCategory": {
                "categoryCode": "",
                "categoryName": "",
                "mappingPropertyList":[]
            }
        },
        quality:{
            standardType:"GC",
            parentCode:""
        }
    },
    Settings: {
        delayCount:  0 , //每层加载数量
        model : ""
    },
//计划节点
    PlanNode : new(Backbone.Collection.extend({
        model:Backbone.Model.extend({
            defaults:function(){
                return{

                }
            }
        }),
        urlType: "fetchArtifactsPlan",
        parse: function(responese) {
            if (responese.code == 0 && responese.data.length > 0) {
                return responese.data;
            } else {}
        }
    })),
    //计划规则/获取
    operator:Backbone.Model.extend({
        defaults:function(){
            return{
                code : ""
            }
        }}),
//计划规则/获取节点规则
    PlanRules:new(Backbone.Collection.extend({
        model:Backbone.Model.extend({
            defaults:function(){
                return{

                }
            }
        }),
        urlType: "fetchArtifactsPlanRule",
        parse: function(responese) {
            if (responese.code == 0 && responese.data.length > 0) {
                return responese.data;
            } else {}
        },
        comparator:function(item){
            return item.get("mappingCategory").categoryCode
        }
    })),

    //创建计划规则
    newPlanRules : Backbone.Model.extend({
        defaults:function(){
            return{
                code : ""
            }
        }
    }),
    //新建的规则数据模型
    saveRuleModel:function(){
        return   {
            "biz": 1,//1：模块化；2：质监标准  //新建时写入值
            "targetCode": "",//新建时写入当前计划编号
            "targetName": "",//计划名称
            "type": 1,//1:标准规则；2：项目规则  //新建时写入值
            "mappingCategory": {
                "categoryCode": "",
                "categoryName": "",
                "mappingPropertyList": [
                    {
                        "propertyKey": "",
                        "operator": "",
                        "propertyValue": ""
                    }
                ]
            }
        }
    },
    //创建计划规则，模板
    createPlanRules:function(){
        //创建新的构件映射计划节点
        var newPlanRuleData = {
            "biz": "",//1：模块化；2：质监标准  //新建时写入值
            "targetCode": "",//新建时写入当前计划编号
            "targetName": "",//计划名称
            "type": "",//1:标准规则；2：项目规则  //新建时写入值
            "mappingCategory": {
                "categoryCode": "",
                "categoryName": "",
                "mappingPropertyList": [
                    {
                        "propertyKey": "",
                        "operator": "",
                        "propertyValue": ""
                    }
                ]
            }
        };
        //写入基础数据
        newPlanRuleData.biz =  App.ResourceArtifacts.Status.biz;
        newPlanRuleData.targetCode =  App.ResourceArtifacts.Status.rule.targetCode;
        newPlanRuleData.targetName =  "";
        newPlanRuleData.type =  App.ResourceArtifacts.Status.type;

        return new this.newPlanRules(newPlanRuleData);
    },

//保存计划规则
    SavePlanRules : Backbone.Model.extend({
            defaults:function(){
                return{
                    code : ""
                }
            },
        urlType: "",
        parse: function(responese) {
            if (responese.code == 0 && responese.data.length > 0) {
                return responese.data;
                //保存成功
            }
        }
    }),
    //新映射数据模型
    newModel : {
        "id": null,
        "propertyKey":"",
        "operator":"",
        "propertyValue": null,
        categoryId:'',
        ruleList:{
            left:'',
            right:'',
            leftValue:'',
            rightValue:''
        }
    },
    //新建规则
    newRule : Backbone.Model.extend({
        defaults:function(){
            return{
                code : ""
            }
        }
    }),
    //新建条目
    newCode : Backbone.Model.extend({
        defaults:function(){
            return{
                code : ""
            }
        }
    }),
    //规则collection
    ArtifactsRule:new(Backbone.Collection.extend({
        model:Backbone.Model.extend({
            defaults:function(){
                return{

                }
            }
        }),
        urlType: "",
        parse: function(responese) {
            if (responese.code == 0 && responese.data.length > 0) {
                return responese.data;
            } else {
                //$().html('<li>无数据</li>');
            }
        }
    })),
    //规则模板列表
    TplCollection : new(Backbone.Collection.extend({
        model:Backbone.Model.extend({
            defaults:function(){
                return{

                }
            }
        })
    })),
    //规则模板规则列表
    TplCollectionRule : new(Backbone.Collection.extend({
        model:Backbone.Model.extend({
            defaults:function(){
                return{

                }
            }
        })
    })),

    init:function(_this,optionType) {
        var tabs = App.Comm.AuthConfig.resource.mappingRule,
            Auth = App.AuthObj.lib;
        //console.log(_this);
        _this.$(".breadcrumbNav .breadItem").hide();
        _this.$(".breadcrumbNav .fileNav").hide();
        _this.$(".breadcrumbNav .breadItem.project").show();

        this.loaddeaprt();//分类编码

        if(optionType == "library" ||  optionType == "template"){
            App.ResourceArtifacts.Status.projectId = "";
            App.ResourceArtifacts.Status.projectName = "";
            this.ArtifactsIndexNav = new App.Resources.ArtifactsIndexNav();//模块化/质量标准菜单
            _this.$el.append(this.ArtifactsIndexNav.render().el);
        }else{
            //项目
            App.ResourceArtifacts.Status.projectId  = optionType;
            this.ArtifactsProjectBreadCrumb = new App.Resources.ArtifactsProjectBreadCrumb();
            _this.$el.html(this.ArtifactsProjectBreadCrumb.render().el);
            //项目映射规则名称
            App.ResourceArtifacts.Status.projectName = App.Comm.publicData.services.project.projectName;
        }
        //公用组件
        this.menu = new App.Resources.ArtifactsMapRule();  //外层菜单
        this.plans = new App.Resources.ArtifactsPlanList();   //模块化列表 /计划节点
        this.planRuleTitle = new App.Resources.ArtifactsPlanRuleTitle();  //规则头部
        this.planRule = new App.Resources.ArtifactsPlanRule();  //规则列表
        this.quality = new App.Resources.ArtifactsQualityList();//质量标准，外层
        this.plans.planRule = this.menu;
        this.menu.quality = this.quality;
        this.menu.plans = this.plans;

        App.ResourceArtifacts.Status.rule.biz = 1;
        App.ResourceArtifacts.Status.templateId = "";

        if(optionType == "template" ){//规则模板
            _this.$(".resourcesMappingRule .template").addClass("active").siblings("a").removeClass("active");
            App.ResourceArtifacts.Status.qualityStandardType = "GC";
            if(App.ResourceArtifacts.Settings.ruleModel  ==2){
                App.ResourceArtifacts.Status.rule.biz =2
            }

            this.tplFrame = new App.Resources.ArtifactsTplFrame().render();
            this.tplList = new App.Resources.ArtifactsTplList();
            this.detail = new App.Resources.ArtifactsTplDetail();

            _this.$el.append(this.tplFrame.el);//菜单
            this.tplFrame.$(".tplListContainer").html(this.tplList.render().el);//右侧框架
            this.tplFrame.$(".tplContent .content").html(this.detail.render().el);
            this.detail.$(".tplDetailCon").append(this.menu.render().el);//菜单

            this.tplFrame.$el.addClass("services_loading");


            if(Auth.moduleMappingRule.view){
                this.menu.$(".plans").html(this.plans.render().el);//计划

            }

            if(Auth.qualityMappingRule.view) {
                this.menu.$(".qualifyC").append(this.quality.render().el);//质量
            }

            if(Auth.moduleMappingRule.edit || Auth.qualityMappingRule.edit) {
                this.menu.$(".rules").append(this.planRuleTitle.render().el);//规则
                this.planRuleTitle.$(".ruleContentRuleList").append(this.planRule.render().el);//规则列表
            }

            this.detail.$(".artifactsContent").addClass("explorer");

            this.getTpl();

        }else{//规则库
            $("#artifacts").addClass("services_loading");
            App.ResourceArtifacts.modelEdit = false;
            _this.$(".resourcesMappingRule .library").addClass("active").siblings("a").removeClass("active");
            _this.$el.append(this.menu.render().el);//菜单
            this.menu.$el.addClass("services_loading");
            //写入项目名称
            if(App.ResourceArtifacts.Status.projectId){
               this.getProjectName(_this,App.ResourceArtifacts.Status.projectId)
            }
            //读入数据
            if(Auth.moduleMappingRule.view){
                this.menu.$(".plans").html(this.plans.render().el);//计划节点
                this.getPlan();
            }
            if(Auth.qualityMappingRule.view){
                this.menu.$(".qualifyC").hide().html(this.quality.render().el);
                this.getAllQuality(function(data){
                    App.ResourceArtifacts.departQuality(App.ResourceArtifacts.menu.$(".qualityMenuListGC"),App.ResourceArtifacts.allQualityGC,null,"0");
                    App.ResourceArtifacts.menu.$(".qualityMenuListGC").show();
                    App.ResourceArtifacts.departQuality(App.ResourceArtifacts.menu.$(".qualityMenuListKY"),App.ResourceArtifacts.allQualityKY,null,"0");
                });
            }
            if(Auth.moduleMappingRule.edit || Auth.qualityMappingRule.edit){
                this.menu.$(".rules").html(this.planRuleTitle.render().el);//映射规则标题
                this.planRuleTitle.$(".ruleContentRuleList").html(this.planRule.render().el);//映射规则列表
            }
        }
        $(".resourcesMappingRule").show();
    },
    //获取项目名称
    getProjectName:function(_this,projectId){
        var pdata = {
            URLtype: "fetchArtifactsProjectName",
            data:{
                projectId:projectId
            }
        };
        App.Comm.ajax(pdata,function(response){
            if(response.code == 0){
                _this.$(".projectName").html( response.data.name);
            }
        });
    },
    // 获取分类编码
    loaddeaprt:function(){
        //获取分类编码
        var cdata = {
            URLtype:"fetchArtifactsCategoryRule",
            data:{}
        };
        App.Comm.ajax(cdata,function(response){
            if(response.code == 0 && response.data && response.data.length){
                App.Resources.artifactsTreeData = response.data;
            }
        });
    },
    //获取计划节点
    getPlan:function(){

        var _this = App.ResourceArtifacts, pdata;
        pdata  = {
            URLtype:"fetchArtifactsPlan",
            data:{
                type : App.ResourceArtifacts.Status.type
            }
        };
        if(App.ResourceArtifacts.Status.templateId){
            pdata.data.templateId = App.ResourceArtifacts.Status.templateId;
        }else if(App.ResourceArtifacts.Status.projectId){
            pdata.data.projectId = App.ResourceArtifacts.Status.projectId;
        }
        App.ResourceArtifacts.PlanRules.reset();

        App.Comm.ajax(pdata,function(response){
            if(response.code == 0 && response.data){
                if(response.data.length){
                    App.ResourceArtifacts.PlanNode.reset();
                    App.ResourceArtifacts.PlanNode.add(response.data);
                }else{
                    Backbone.trigger("mappingRuleNoContent");
                }
            }
            _this.menu.$el.removeClass("services_loading");
        });
    },
    //所有
    modelSaving:{
        templateId: "",
        templateName: "",
        codeIds:[]
    },
    allQualityGC: [],
    allQualityKY: [],
    //获取全部质量标准
    getAllQuality:function(fn){
        var _this = this;
        var pdata = {
            URLtype:'fetchArtifactsQuality',
            data:{
                parentCode: "all",
                type:App.ResourceArtifacts.Status.type
            }
        };

        if(App.ResourceArtifacts.Status.templateId){
            pdata.data.templateId = App.ResourceArtifacts.Status.templateId;
        }else if(App.ResourceArtifacts.Status.projectId){
            pdata.data.projectId = App.ResourceArtifacts.Status.projectId;
        }

        App.Comm.ajax(pdata,function(response){
            if(response.code == 0 && response.data.length){
                App.ResourceArtifacts.allQualityKY = _.filter(response.data,function(item){
                    return item.type == "KY"
                });
                App.ResourceArtifacts.allQualityGC = _.filter(response.data,function(item){
                    return item.type == "GC"
                });
                if(fn && typeof fn == "function"){
                    fn(response.data);
                }
            }

        });
    },
    //获取已经加载并且要存储的有效数据
    getValid:function(obj){
        return  {
                code : obj.code,
                ruleIds : obj.ruleIds || []
            };
    },
    //质量标准三级分类，要插入元素，数据，是否有父节点，ruleContain
    // 值是否存在
    departQuality:function(ele,cdata,parentCode,ruleContain){
        var data = cdata , levelData;

        if(!parentCode){

            levelData = _.filter(data,function(item){
                return !item.parentCode
            });

        }else{
            levelData = _.filter(data,function(item){
                return item.parentCode == parentCode
            });
        }
        if(levelData.length){
            $(ele).html(App.Resources.artifactsQualityTree(levelData,ruleContain));
        }
    },
    //获取规则模板
    getTpl:function(){
        var _this = this, pdata;
        pdata  = {
            URLtype:"fetchArtifactsTemplate",
            data:{}
        };
        App.ResourceArtifacts.TplCollection.reset();
        App.Comm.ajax(pdata,function(response){
            if(response.code == 0 && response.data){
                if(response.data.length){
                    App.ResourceArtifacts.TplCollection.add(response.data);
                }else{}
            }
            _this.tplFrame.$el.removeClass("services_loading");
        });
    },
    loading:function(ele){
        $(ele).addClass("services_loading");
    },
    loaded:function(ele){
        $(ele).removeClass("services_loading");
    },
    //重置规则
    resetPreRule:function(){
        App.ResourceArtifacts.Status.templateId = "";
        App.ResourceArtifacts.Status.templateName = "";
        App.ResourceArtifacts.Status.rule.biz = "";
        App.ResourceArtifacts.Status.rule.targetCode = "";
        App.ResourceArtifacts.Status.rule.targetName = "";
    }
};