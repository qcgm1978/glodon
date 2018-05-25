App.Services.ProjectDetail=App.Services.ProjectDetail||{};

App.Services.ProjectDetail.Pile=Backbone.View.extend({
	
	tagName:'div',
	
	className:'projectDetail',
	
	events:{
		
		'click .save':'savePile',
		'click .update':'updatePile',
		'change .txtInput':'formatValue'
	
	},
	
	template:_.templateUrl('/services/tpls/project/project.detail.pile.html'),
	
	setUserData(data){
		this.userData=data;
	},
	
	initialize(){
		this.listenTo(App.Services.ProjectCollection.ProjecDetailPileCollection,'reset',this.resetView);
	},
	
	render(){
		this.$el.html(this.template({
			isCreate:false,
			soilNails:[]
		}));   
		return this;
	},
	
	resetView(items){
		var data=items.data,
			$container=this.$('.detailContainer .scrollWrapContent');
		this.$el.html(this.template(data));
		$container.html('').append(this.$el);
	},
	
	formatValue(e){
		App.Services.ProjectCollection.methods.dataVal(e);
	},

	savePile(args,type){
		if(this.$('.errorInput').length>0){
			return 
		}
		var _this=this,
			_data=[];
		this.$('.txtInput').each(function(){
			var __=$(this);
			if(type){
				_data.push({
					id:__.attr('data-id'),
					pileNumber:__.val()
				})
			}else{
				_data.push({
					projectId:_this.userData.projectId,
					pileCode:__.attr('data-code'),
					pileNumber:__.val()
				})
			}
			
		})
		args=typeof args === 'string' ?args:'fetchProjectCreatePile'
		App.Comm.ajax({
			URLtype:args,
			type:type||'post',
			data:JSON.stringify(_data),
			contentType:'application/json'
		},function(){
			_this.reloadView();
			$.tip({message:'新增成功'});
		}).fail(function(){
			//失败提示
		})
	},
	
	updatePile(){
		this.savePile('fetchProjectUpdatePile','put');
	},
	
	reloadView(){
		var _this=this;
		let collectionPile=App.Services.ProjectCollection.ProjecDetailPileCollection;
 		collectionPile.projectId=_this.userData.projectId;
 		collectionPile.fetch({
 			reset:true,
 			success(child, data) {
 			}
 		});
	}
})