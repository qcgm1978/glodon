App.Services.ProjectDetail=App.Services.ProjectDetail||{};

App.Services.ProjectDetail.Section=Backbone.View.extend({
	
	tagName:'div',
	
	className:'projectDetail',
	
	status:'read',
	
	events:{
		'click .createSection':'createSection'
	},
	
	template:_.templateUrl('/services/tpls/project/project.detail.section.html',true),
	
	initialize(){
		var _this=this;
		this.listenTo(App.Services.ProjectCollection.ProjecDetailSectionCollection,'add',this.addOne);
		this.listenTo(App.Services.ProjectCollection.ProjecDetailSectionCollection,'reset',this.resetView);
	
		Backbone.on('sectionUserStatus',function(status){
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
	
	addOne(model){
		var $container=this.$('.detailContainer .scrollWrapContent');
		var view=new App.Services.DetailView.Section({
			model:model
		});
		$container.append(view.render().el);
	},

	resetView(){
		this.$('.detailContainer .scrollWrapContent').html("");
	},

	createSection(){
		var _this=this;
		if(this.status !=='create'){
			this.$('dd').slideUp();
			this.$('dt span').addClass('accordOpen');
			var data={
				"id":"", //剖面ID
		        "pitId":"",//    基坑编码
		        "projectId":_this.userData.projectId,//    项目编码
		        "profileName":"",//  剖面
		        "bracingType":'' ,//支护类型
				"isAdd":true
			}
			if(App.Services.ProjectCollection.datas.pitData[0]){
				data.pitId=App.Services.ProjectCollection.datas.pitData[0].id;
			}
			App.Services.ProjectCollection.ProjecDetailSectionCollection.push(data);
			this.status='create';
		}else{
			var $tar=$('.projectSection .accordionDatail').last();
			if($tar.hasClass('accordOpen')){
				$tar.click()
			}
			App.Services.Dialog.alert('请先完成当前新增操作...');
		}
		
	}
	
})