App.Services.DetailView=App.Services.DetailView||{};

App.Services.DetailView.Floor=Backbone.View.extend({
	
	events:{
		'click dt':'headerToggle',
		'click .accordionDatail':'toggleProFrom',
		'click .save':'saveFloor',
		'click .update':'updateFloor',
		'click .delete':'deleteFloor',
		'click .cancel':'cancelFloor',
		'change .txtInput':'formatValue'
	},
	
	template:_.templateUrl('/services/tpls/project/view.floor.html'),
	
	formData:{
		"id":"",//栋号编码
        "pitId":"",//    基坑编码
        "projectId":"",//    项目编码
        "buildingName":"",//  栋号名称
        "height":0,//   高度
        "area":0,// 面积
        "groundLayers":0,//   地上层数
        "undergroundLayers":0,//  地下层数
        "layerHeight":0,//    层高
        "seismicIntensityId":"",//    抗震设防烈度
        "seismicLevelId":"",//    抗震等级
        "roofStayWarm":"",//  屋面保温
        "roofStayWarmLev":"",//    屋面保温防火等级
        "outWallStayWarm":"",//   外墙保温
        "outWallStayWarmLev":"",// 外墙保温防火等级
        "lowStrainPercentage":0,//  低应变检测百分比
        "highStrainPercentage":0,// 高应变检测百分比
        "ultrasonicPercentage":0,//   超声波检测百分比
        "corebitPercentage":0,//  钻芯检测百分比
        "outSidedecorationType":"0",//   外装方式
        "structureType":""
	},
	
	initialize(data){
		var _this=this;
		this.model.on('change',function(){
			_this.render();			
		})
	},
	
	formatValue(e){
		App.Services.ProjectCollection.methods.dataVal(e);
	},

	render(){
		var _this=this,
			data=this.model.toJSON();
		this.formData=data;
		this.$el.html(this.template(data));
		this.$(".pit").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData[_.attr('name')]=$item.attr('data-pitId');
			}
		});
		this.$(".structure").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData[_.attr('name')]=$item.text();
			}
		});
		this.$(".outerInstall").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData[_.attr('name')]=$item.text();
			}
		});
		this.$(".outDoorFireLevel").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData[_.attr('name')]=$item.text();
			}
		});
		this.$(".inDoorFireLevel").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData[_.attr('name')]=$item.text();
			}
		});
		this.$(".seiGrade").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData[_.attr('name')]=$item.text();
			}
		});
		this.$(".intensity").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData[_.attr('name')]=$item.text();
			}
		});
		return this;
	},
	toggleProFrom(e){
	
		var $this=this.$(e.target),
			$accord=$this.parent().next();
		
		if($this.hasClass('accordOpen')){
			$accord.slideDown();
			var $all=$('.projectFloor .accordionDatail');
			$all.each(function(){
				if(!$(this).hasClass('accordOpen')){
					$(this).addClass('accordOpen');
					$(this).parent().next().slideUp();
				}
			})
			
		}else{
			$accord.slideUp();
		}
		$this.toggleClass('accordOpen');
	},
	
	saveFloor(args,type){

		if(this.$('.errorInput').length>0){
			return 
		}
		var _this=this,_objName=null;
		_this.$('input').each(function(){
			var _=$(this);
			_this.formData[_.attr('name')]=_.val();
		})
		_objName=_this.formData['buildingName'];
		_objName=_objName.replace(/\s/g,'');
		if(_objName.length<1){
			_this.$('input[name=buildingName]').css('border','1px solid #FF0000');
			return
		}
		_this.$('input[name=buildingName]').css('border','1px solid #CCC');

		args= typeof args === 'string'? args : 'fetchProjectCreateFloor';
		//百分比数值转换
		_this.formData.lowStrainPercentage=(_this.formData.lowStrainPercentage||0)/100;
		_this.formData.highStrainPercentage=(_this.formData.highStrainPercentage||0)/100;
		_this.formData.ultrasonicPercentage=(_this.formData.ultrasonicPercentage||0)/100;
		_this.formData.corebitPercentage=(_this.formData.corebitPercentage||0)/100;
		
		App.Comm.ajax({
			URLtype:args,
			type:type||'post',
			data:JSON.stringify(_this.formData),
			contentType:'application/json'
		},function(res){
			$.tip({message:type?'修改成功':'新增成功'});
	 		Backbone.trigger('floorUserStatus','read');
	 		if(type!='put'){
	 			_this.formData.id=res.data.buildingId;
	 		}
	 		_this.model.set(_this.formData);
	 		_this.$('.accordionDatail').trigger('click');
	 		clearMask();
		}).fail(function(){
			clearMask();
		})
	},
	updateFloor(){
		this.saveFloor('fetchProjectUpdateFloor','put');
	},
	deleteFloor(){
		var _this=this;
		App.Comm.ajax({
			URLtype:'removeProjectDetailFloor',
			type:'delete',
			data:{
				floorId:_this.formData.id
			}
		},function(){
			_this.reloadView();
		}).fail(function(){
		})
	},
	cancelFloor(){
		this.$el.remove();
		App.Services.ProjectCollection.ProjecDetailFloorCollection.pop();
		Backbone.trigger('floorUserStatus','read');
	},
	reloadView(){
		var _this=this;
		let _collection=App.Services.ProjectCollection.ProjecDetailFloorCollection;
 		_collection.projectId=_this.formData.projectId;
 		_collection.reset();
 		_collection.fetch({
 			success(child, data) {
 				clearMask();
 			}
 		});
	}
	
})