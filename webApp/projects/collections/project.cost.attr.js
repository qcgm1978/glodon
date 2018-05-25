/**
 * @require /projects/collections/Project.es6
 */
App.Project.CostAttr={

		//清单 collection
	ReferenceCollection: new(Backbone.Collection.extend({
	 
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchCostReference"


	})),

		// 变更 collection
	ChangeCollection: new(Backbone.Collection.extend({
	 
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchCostChange"

	})),

		// 检验 collection
	VerificationCollection: new(Backbone.Collection.extend({
	 
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchCostVerification"

	
	})),

	VerificationCollectionCate: new(Backbone.Collection.extend({
	 
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchCostVerificationCate" 

	})),

	VerificationCollectionCateDetail: new(Backbone.Collection.extend({
	 
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchCostVerificationCateDetail" 

	})),

	// 属性 collection
	PropertiesCollection: new(Backbone.Collection.extend({
	 
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchCostProperties",

		parse:function(response){
			if (response.message == "success") {
                 return response.data;
             }
		}

	}))


}