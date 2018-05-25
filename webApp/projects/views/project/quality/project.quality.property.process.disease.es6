//隐患列表视图
App.Project.ProcessDisease=Backbone.View.extend({

	tagName:"div",

	className:"disease",
	
	template:_.templateUrl('/projects/tpls/project/quality/project.quality.disease.html'),

	initialize:function(data){
		this.loadData(data);
		return this;
	},
	events:{
		'click .closeBtn':'closeView',
		'click .diseaseItem':'linkModelComponent'
	},

	//渲染
	render:function(data){
		this.$el.html(this.template(data));
		return this;
	},
	
	loadData(data){
		var _this=this,
			url='fetchQualityProcessDisease';
		App.Comm.ajax({
			URLtype:url,
			type:'get',
			data:data.params
		},function(response){
			_this.render(response||{data:[]}).show(data);
		}).fail(function(){
			//失败流程处理
		})
	},
	
	show(options){
		var _right=options._parent[0].offsetParent.clientWidth-options._parent[0].offsetLeft-14;
		this.$el.css(options.viewConfig);
		
		
		if(options._flag=='up'){
			this.$(".safter").css({
				right:(_right+1)+'px'
			})
			this.$(".sbefore").css({
				right:_right+'px'
			})
			this.$(".dafter").css({
				border:'none'
			})
			this.$(".dbefore").css({
				border:'none'
			})
		}else{
			this.$(".dafter").css({
				right:(_right+1)+'px'
			})
			this.$(".dbefore").css({
				right:(_right+1)+'px'
			})
			this.$(".safter").css({
				border:'none'
			})
			this.$(".sbefore").css({
				border:'none'
			})
		}
		if(options.type=='open'){
			$('.openingacceptanceList').append(this.$el);
		}else{
			$('.processAccessList').append(this.$el);
		}
		App.Comm.initScroll(this.$('.scrollWrap'),"y");
		
		clearMask();
		
		return this;
	},
	closeView(){
		this.$el.remove();
	},

	linkModelComponent(e){
		e.stopPropagation();
		/*var $target=$(e.currentTarget),
			id=$target.attr('data-id'),
			type=$target.attr('data-type');
		$.ajax({
			url: "/platform/api/project/"+$target.data('code')+"/meta?token=123"
		}).done(function(data){
			var _fileId=$target.data('uuid').split('.')[0];
			if(_fileId){
				$.ajax({
					url: "/doc/api/"+data.data.projectId+'/'+data.data.versionId+"?fileId="+_fileId
				}).done(function(data){
					if (data.code == 0 && data) {
						var  modelId = data.data.modelId;
						var obj={
							uuid:modelId+$target.data('uuid').slice($target.data('uuid').indexOf('.')),
							location:{
								boundingBox:$target.data('location').boundingBox,
								position:$target.data('axis').position
							}
						}
						App.Project.showInModel($target,3,obj);
					}
				})
			}
		})*/
		var $target=$(e.currentTarget);
		var uuid=$target.data('uuid');
		var _fileId=uuid.split('.')[0];
		var location=$target.data('location');
		if(!uuid || !_fileId){
			$.tip({message:'该隐患未关联到模型的构件',type:'alarm'});
			return
		}
		if(!location.position || !location.boundingBox){
			$.tip({message:'该隐患无位置信息',type:'alarm'});
			return
		}
		$.ajax({
			url: "/doc/api/"+App.Project.Settings.CurrentVersion.projectId+'/'+App.Project.Settings.CurrentVersion.id+"?fileId="+_fileId
		}).done(function(data){
			if (data.code == 0 && data.data) {
				var  modelId = data.data.modelId;
				var obj={
					specialty:data.data.specialty,
					fileName:data.data.name,
					uuid:modelId+uuid.slice(uuid.indexOf('.')),
					location:{
						boundingBox:location.boundingBox,
						position:location.position
					}
				}
				App.Project.showInModel($target,3,obj);
			}else{
				$.tip({message:'文件对应的模型ID不存在',type:'alarm'});
			}
		})
	}

});