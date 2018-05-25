App.Services.DetailView=App.Services.DetailView||{};

App.Services.DetailView.Section=Backbone.View.extend({
	
	events:{
		'click .accordionDatail':'toggleProFrom',
		'click .save':'saveSection',
		'click .update':'updateSection',
		'click .delete':'deleteSection',
		'click .cancel':'cancelSection'
	},
	
	template:_.templateUrl('/services/tpls/project/view.section.html'),
	
	formData:{
		"id":"", //剖面ID
        "pitId":"",//    基坑编码
        "projectId":"",//    项目编码
        "profileName":"",//  剖面
        "bracingType":'' //支护类型
	},
	
	initialize(data){
		var _this=this;
		this.model.on('change',function(){
			_this.render();			
		})
	},

	render(){
		var _this=this,
			data=this.model.toJSON();
		this.formData= data;
		this.$el.html(this.template(data));
		this.$(".pit").myDropDown({
			zIndex:App.Services.ProjectCollection.methods.zIndex(),
			click:function($item){
				var _=$(this);
				_this.formData.pitId=$item.attr('data-pitId');
			}
		});
		this.$(".supportType").myDropDown({
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
			//互斥操作
			var $all=$('.projectSection .accordionDatail');
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
	
	saveSection(args,type){
		var _this=this,_objName='';
		_this.$('input').each(function(){
			var _=$(this);
			_this.formData[_.attr('name')]=_.val();
		})
		_objName=_this.formData['profileName'];
		_objName=_objName.replace(/\s/g,'');
		if(_objName.length<1){
			_this.$('input[name=profileName]').css('border','1px solid #FF0000');
			return
		}
		_this.$('input[name=profileName]').css('border','1px solid #CCC');
		args= typeof args === 'string'? args : 'fetchProjectCreateSection';
		
		App.Comm.ajax({
			URLtype:args,
			type:type||'post',
			data:JSON.stringify(_this.formData),
			contentType:'application/json'
		},function(res){
			$.tip({message:type?'修改成功':'新增成功'});
	 		Backbone.trigger('sectionUserStatus','read');
	 		if(type!='put'){
	 			_this.formData.id=res.data.profileId;
	 		}
	 		_this.model.set(_this.formData);
	 		_this.$('.accordionDatail').trigger('click');
		}).fail(function(){
			clearMask();
		})
	},
	updateSection(){
		this.saveSection('fetchProjectUpdateSection','put');
	},
	deleteSection(){
		var _this=this;
		App.Comm.ajax({
			URLtype:'removeProjectDetailSection',
			type:'delete',
			data:{
				sectionId:_this.formData.id
			}
		},function(){
			_this.reloadView();
		}).fail(function(){
		})
	},
	cancelSection(){
		this.$el.remove();
		App.Services.ProjectCollection.ProjecDetailSectionCollection.pop();
		Backbone.trigger('sectionUserStatus','read');
	},
	reloadView(){
		var _this=this;
		let _collection=App.Services.ProjectCollection.ProjecDetailSectionCollection;
 		_collection.projectId=_this.formData.projectId;
 		_collection.reset();
 		_collection.fetch();
	}
	
})