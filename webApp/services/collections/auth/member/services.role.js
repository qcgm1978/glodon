/*
* @require  /services/views/auth/role/services.role.list.js
*/
//通用角色列表
App.Services.role ={
    collection:new(Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesRolesList",
        parse: function (response) {
            if (response.code == 0) {
                return response.data;
            }
        }
    })),
    loadData : function(func) {
        //数据重置
        App.Services.role.collection.reset();
        // load list
        App.Services.role.collection.fetch({
            data:{},
            success: function(collection, response, options) {

                if(func && typeof  func == "function"){
                    func(response);
                }
            }
        });
    },
    init :function(func){
        $(".serviceBody").empty().html( new App.Services.roleList().render().el);
        App.Services.role.loadData(func);//加载成员列表
    }
};
//组织角色
App.Services.ozRole ={
    collection:new(Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesOzRoleList",
        parse: function (response) {
            if (response.code == 0) {
                return response.data;
            }
        }
    })),

    loadData : function(data,func) {
        App.Services.ozRole.collection.reset();
        App.Services.ozRole.collection.fetch({
            data:data,
            success: function(collection, response, options) {
                if(func && typeof  func == "function"){
                    func();
                }
            }
        });
    }
};
//成员角色
App.Services.roleType ={
    userCollection:new(Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesUserRoleList",
        parse: function (response) {
            if (response.code == 0) {
                return response.data;
            }
        }
    })),
    //组织角色
    orgCollection:new(Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesOzRoleList",
        parse: function (response) {
            if (response.message == "success") {
                return response.data;
            }
        }
    })),

    loadData : function(collection,data,func) {
        collection.reset();
        collection.fetch({
            data:data,
            success: function(collection, response, options) {
                if(func && typeof  func == "function"){
                    func(response);
                }
            }
        });
    }
};