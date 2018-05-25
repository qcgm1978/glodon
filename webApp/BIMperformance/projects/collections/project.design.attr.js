/**
 * @require /BIMperformance/projects/collections/Project.es6
 */
App.Project.DesignAttr={

		// 碰撞collection
	CollisionCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignCollision"


	})),

	// 碰撞文件列表
	CollisionFiles: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignFiles"

	})),

	// 碰撞构件列表
	CollisionCategory: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignCategory"

	})),

	// 碰撞任务列表
	CollisionTaskList: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignTaskList"


	})),

	// 碰撞点列表
	CollisionTaskDetail: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignTaskDetail"


	})),

	// 碰撞文件列表
	CollisionSetting: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignSetting"

	})),

		// 设计检查 collection
	CollisionList: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignCollisionList"

	})),
		// 设计检查 collection
	VerificationCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType:"fetchDesignVerification"

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

		urlType:"fetchDesignProperties",

		parse:function(response){

			if (response.message == "success") {
                 return response;
             }
		}

	}))


}
