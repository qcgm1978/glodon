/**
 * @require /services/collections/index.es6
 */

App.Services.AppCollection = {

	//分类列表
	AppListCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "appList",
		parse(response) {
			if (response.code == 0) {
				return response.data;
			}
		}
	})) 

}