App.Services.ProjectDetail=App.Services.ProjectDetail||{};

App.Services.ProjectDetail.Floor=Backbone.View.extend({
	
	tagName:'div',
	
	className:'projectDetail',
	
	status:'read',
	
	events:{
		'click .createFloor':'createFloor'
	},
	
	template:_.templateUrl('/services/tpls/project/project.detail.floor.html',true),
	
	initialize(){

		var _this=this;
		this.listenTo(App.Services.ProjectCollection.ProjecDetailFloorCollection,'add',this.addOne);
		this.listenTo(App.Services.ProjectCollection.ProjecDetailFloorCollection,'reset',this.resetView);
	
		Backbone.on('floorUserStatus',function(status){
			_this.status=status
		},this)
	
	},
	
	setUserData(data){
		this.userData=data;
	},
	
	render(){
		this.$el.html(this.template);   
		return this;
	},
	
	addView(items){
		var _this=this;
		var view=new App.Services.DetailView.Floor({
			projectId:_this.userData.projectId
		});
		_this.$('.detailContainer .scrollWrapContent').append(view.render(items.toJSON()).el);
		view.toggleProFrom('.accordionDatail');
	},
	
	addOne(model){
		var $container=this.$('.detailContainer .scrollWrapContent');
		var view=new App.Services.DetailView.Floor({
			model:model
		});
		$container.append(view.render().el);
	},

	resetView(){
		this.$('.detailContainer .scrollWrapContent').html("");
	},

	createFloor(){
		var _this=this;
		if(this.status !=='create'){
			this.$('dd').slideUp();
			this.$('dt span').addClass('accordOpen');
			var model={
				"id":"",//栋号编码
		        "pitId":"",//    基坑编码
		        "projectId":_this.userData.projectId,//    项目编码
		        "buildingName":"",//  栋号名称
		        "height":0,//   高度
		        "area":0,// 面积
		        "groundLayers":0,//   地上层数
		        "undergroundLayers":0,//  地下层数
		        "layerHeight":0,//    层高
		        "seismicIntensityId":"6度",//    抗震设防烈度
		        "seismicLevelId":"一级",//    抗震等级
		        "roofStayWarm":"",//  屋面保温
		        "roofStayWarmLev":"A",//    屋面保温防火等级
		        "outWallStayWarm":"",//   外墙保温
		        "outWallStayWarmLev":"A",// 外墙保温防火等级
		        "lowStrainPercentage":0,//  低应变检测百分比
		        "highStrainPercentage":0,// 高应变检测百分比
		        "ultrasonicPercentage":0,//   超声波检测百分比
		        "corebitPercentage":0,//  钻芯检测百分比
		        "outSidedecorationType":"",//   外装方式
		        "structureType":"剪力墙结构"
			}

			if(App.Services.ProjectCollection.datas.pitData[0]){
				model.pitId=App.Services.ProjectCollection.datas.pitData[0].id;
			}
			App.Services.ProjectCollection.ProjecDetailFloorCollection.push(model);

			this.status='create';
		}else{
			var $tar=$('.projectFloor .accordionDatail').last();
			if($tar.hasClass('accordOpen')){
				$tar.click()
			}
			App.Services.Dialog.alert('请先完成当前新增操作...');
		}
		
	}
	
})