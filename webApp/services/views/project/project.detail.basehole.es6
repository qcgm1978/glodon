App.Services.ProjectDetail=App.Services.ProjectDetail||{};

App.Services.ProjectDetail.BaseHole=Backbone.View.extend({
	
	tagName:'div',
	
	className:'projectDetail',
	
	events:{
		'click .createBaseHole':'createBaseHole'
	},
	
	status:'read',
	
	template:_.templateUrl('/services/tpls/project/project.detail.basehole.html',true),
	
	setUserData(data){
		this.userData=data;
	},
	
	initialize(){

		var _this=this;
		this.listenTo(App.Services.ProjectCollection.ProjecDetailBaseHoleCollection,'add',this.addOne);
		this.listenTo(App.Services.ProjectCollection.ProjecDetailBaseHoleCollection,'reset',this.resetView);
	
		Backbone.on('baseholeUserStatus',function(status){
			_this.status=status
		},this)

	},
	
	render(){
		this.$el.html(this.template);   
		this.$(".outerInstall").myDropDown();
		this.$(".structure").myDropDown();
		return this;
	},
	
	resetView(){
		this.$('.detailContainer .scrollWrapContent').html("");
	},

	addOne(model){
		var $container=this.$('.detailContainer .scrollWrapContent');
		var view=new App.Services.DetailView.BaseHole({
			model:model
		});
		$container.append(view.render().el);
	},
	createBaseHole(){
		var _this=this;
		if(_this.status !=='create'){
			this.$('dd').slideUp();
			this.$('dt span').addClass('accordOpen');

			var model={
				"id" : '',
				"projectId" : _this.userData.projectId,
				"pitName" : '',
				"pitDepth" : 0,
				"pitLevel" : '一级',
				"pitLevelRemark" : '',
				"soldierPilePercentage" : 0,
				"anchorCablePercentage" : 0,
				"soilnailwallPercentage" : 0,
				"isHaveBracingType" : '否',
				"isAnchorrodSoilnail" : '否'
			}

			App.Services.ProjectCollection.ProjecDetailBaseHoleCollection.push(model);

			_this.status='create';
		}else{
			var $tar=$('.projectBaseHole .accordionDatail').last();
			if($tar.hasClass('accordOpen')){
				$tar.click()
			}
			App.Services.Dialog.alert('请先完成当前新增操作...');
		}
	}
	
})