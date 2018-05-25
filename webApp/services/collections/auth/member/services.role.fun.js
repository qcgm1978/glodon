/*
 * @require  services/collections/index.es6
 */
App.Services.roleFun = {
    collection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function() {
                return {
                    url: ''
                }
            }
        }),
        urlType: "fetchServicesFunList",
        parse: function (response) {
            if (response.code == 0) {
                return response.data;
            }
        }
    })),
    loadData: function (data,fn) {
        data = data || {};
        //数据重置
        App.Services.roleFun.collection.reset();
        // load list
        App.Services.roleFun.collection.fetch({
            data:data,
            success: function (collection, response, options) {
                if (fn && typeof  fn == "function") {
                    fn();
                }
            }
        });
    }
};




