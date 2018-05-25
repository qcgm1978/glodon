/*
* @require  /services/collections/index.es6
*/

App.Services.memberWindowData = {"roleId":[], "outer":{"orgId":[],"userId":[]},"inner":{"orgId":[], "userId":[]}};
App.Services.Member ={
    memLoadingStatus: true,
    //组织
    collection:Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        parse: function (response) {
            if (response.code == 0) {
                return response.data.org;
            }
        }
    }),

    //内部用户
    innerCollection:new(Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesMemberInnerList",
        parse: function (response) {
            if (response.code == 0) {
                return App.Services.Member.list(response);
            }
        }
    })),

    //外部用户
    outerCollection:new(Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesMemberOuterList",
        //返回品牌或者公司或者成员
        parse: function (response) {
            if (response.code == 0) {
                return App.Services.Member.list(response);
            }
        }
    })),

    //存储角色
    SubRoleCollection : new(Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesSaveRole",
        parse: function (response) {
            if (response.code == 0) {
                return response.data;
            }
        }
    })),

    //创建组织／成员混合列表
    list:function(response){
        var a = [],blendList = [];
        if(response.data.user && response.data.user.length) {
            for (var i = 0; i < response.data.user.length; i++) {
                a.push(response.data.user[i])
            }
        }
        if(response.data.org && response.data.org.length){
            for(var j = 0 ; j < response.data.org.length ; j++ ){
                a.push(response.data.org[j])
            }
        }
        blendList = a;
        return blendList;
    },

    loadData : function(collectionType,data,fn) {
        data = data || {};
        collectionType.reset();
        collectionType.fetch({
            data:data,
            success: function(collection, response, options) {
                if(fn && typeof fn == "function"){
                    fn(response);
                }
                //设置...
                _.each($("#blendList .roles span"),function(item){
                    App.Services.exetor($(item));
                });
            }
        });
    },
    //以下缓存和重置POST的数据
    saveMemData:function(obj){
        App.Services.memberWindowData = obj;
    },
    resetMemData:function(){
        App.Services.memberWindowData = {"roleId":[], "outer":{"orgId":[],"userId":[]},"inner":{"orgId":[], "userId":[]}};
    },
    resetRoleData:function(){
        App.Services.memberWindowData = {};
    }
};