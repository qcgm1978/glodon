/**
 * @require /BIMperformance/projects/collections/Project.js
 */
App.Project.QualityAttr = {

	zindex:(function(){
		var i=90000;
		return function(){
			return i++;
		}
	}()),

	showDisease:function(event,_this,type,flag){
		_this.currentDiseaseView && _this.currentDiseaseView.$el.remove();
		var 
			$target=$(event.currentTarget),
			id=$target.attr('data-id'),
			isShow=$target.attr('data-total'),
			_top=0,
			_flag='up',
			projectId = App.Project.Settings.projectId,
			projectVersionId = App.Project.Settings.CurrentVersion.id;
			
		//没有隐患数据,则不打开数据
		if(Number(isShow)<=0){
			return
		}
		if(($('body').height()-$target.offset().top)>=302){
			_top=$target.offset().top-175+24;
		}else{
			_top=$target.offset().top-300-175+24;
			_flag='down';
		}
		_top=_top<=10?10:_top;
		var p={
				top:_top+'px',
				zIndex:this.zindex()
			};
		_this.currentDiseaseView=new App.Project.ProcessDisease({
			params:{
				projectId:projectId,
				versionId:projectVersionId,
				acceptanceId:id,
				type:flag
			},
			viewConfig:p,
			_parent:$target,
			_flag:_flag,
			type:type
		})
	},

	// 材料设备  collection
	MaterialEquipmentCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType: "fetchQualityMaterialEquipment"


	})),

	// 过程验收 collection
	ProcessAcceptanceCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType: "fetchQualityProcessAcceptance",

		parse: function (response) {
            if (response.message == "success") {
            	App.Project.cacheMarkers('process',response.data.items);
            }
			var data=App.Project.catchPageData('process');
			response.data=data;
            return response;
        }

	})),

	//过程检查
	ProcessCheckCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType: "fetchQualityProcessCheck"


	})),

	// 开业验收
	OpeningAcceptanceCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType: "fetchQualityOpeningAcceptance",

		parse: function (response) {
            if (response.message == "success") {
            	App.Project.cacheMarkers('open',response.data.items);
            }
			var data=App.Project.catchPageData('open');
			response.data=data;
            return response;
        }
	})),


	//隐患
	ConcernsCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType: "fetchQualityConcerns",

		parse: function (response) {
            if (response.message == "success") {
            	App.Project.cacheMarkers('dis',response.data.items);
            }
			var data=App.Project.catchPageData('dis');
			response.data=data;
            return response;
        }

		

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

		urlType: "fetchQualityProperties"

		
	}))


}