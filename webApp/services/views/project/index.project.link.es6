 
//项目基本设置
App.Services.ProjectLink=Backbone.View.extend({

	tagName:"div",
	
	className:'projectLinkList',
	
	events:{
		'click tr':'selectProject',
		'click #linkBtn':'linkProject',
		'keydown #inputProjectSerach':'updateList'
	},

	template:_.templateUrl('/services/tpls/project/project.list.html',true),
	
	initialize(data){
		this.userData=data.userData;
		this.codeId=data.userData.codeId;
	},

	render(){
		var _this=this;
		_this.loadData(function(data){
			
			_this.projectData=data;
			var _tpl=_this.template;
			_this.$el.html(_tpl({data:data,codeId:_this.codeId}));
		});
		return this;
	},
	
	loadData:function(callback){
		var _this=this;
		App.Comm.ajax({
			URLtype:'fetchProjectManagerProjectList',
			type:'get',
			data:{
				type:_this.userData.type=='qualityProjectCode'?3:2
			}
		},function(data){
			callback(data);
		})
	},
	
	selectProject:function(e){//张延凯修改
		$(e.currentTarget).siblings().removeClass('selected').end().toggleClass('selected');
		// $(e.currentTarget).toggleClass('selected');//之前的代码
		// $(e.currentTarget).find('.checkClass').toggleClass('unCheckClass');//之前的代码
	},
	
	linkProject:function(){
		$("#dataLoading").show();
		var $li=$('tr.selected');
		
		var _this=this;
		var projectId=_this.userData.projectId,
			type=_this.userData.type;
		var _result={
				    'projectId':projectId
				}
		//张延凯修改
		_result[type]=$li.length>0?$li.first().attr('data-code'):"";
		App.Comm.ajax({
			URLtype:'putProjectLink',
			type:'PUT',
			contentType:'application/json',
			data:JSON.stringify(_result)
		},function(data){
			$("#dataLoading").hide();
			App.Global.module.close();
			let collectionMap=App.Services.ProjectCollection.ProjecMappingCollection;
	 		collectionMap.projectId=projectId;
	 		collectionMap.fetch({
	 			reset:true,
	 			success(child, data) {}
	 		});
		}).fail(function(){
			$("#dataLoading").hide();
		})
		// if($li.length>0){//张延凯修改
		// 	_result[type]=$li.first().attr('data-code');
		// 	App.Comm.ajax({
		// 		URLtype:'putProjectLink',
		// 		type:'PUT',
		// 		contentType:'application/json',
		// 		data:JSON.stringify(_result)
		// 	},function(data){
		// 		$("#dataLoading").hide();
		// 		App.Global.module.close();
		// 		let collectionMap=App.Services.ProjectCollection.ProjecMappingCollection;
		//  		collectionMap.projectId=projectId;
		//  		collectionMap.fetch({
		//  			reset:true,
		//  			success(child, data) {}
		//  		});
		// 	}).fail(function(){
		// 		$("#dataLoading").hide();
		// 	})
		// }else{
		// 	$("#dataLoading").hide();
		// 	App.Global.module.close();
		// }
	},
	
	updateList(e){
		if(e.keyCode!='13'){
			return
		}
		var t=$(e.currentTarget).val();
		var d=this.projectData.data||[];
		var r=d.filter(function(i){
			return i.projectName.indexOf(t)!==-1;
		})
		this.$el.html(this.template({data:{data:r},codeId:this.codeId}));
		/*var _tpl=_.template(this.template);
		this.$el.html(_tpl({data:{data:r},codeId:this.codeId}));*/
	}

});