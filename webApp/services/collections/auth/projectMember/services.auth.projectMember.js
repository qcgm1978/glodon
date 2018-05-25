/**
 * @require /services/collections/index.es6
 */

App.Services.projectMember = {

	managerType:3,

	selectData:function(data){
		if(data.type==3){
			return "我管理的项目("+data.projectCount+")";
		}else if(data.type==2){
			return "我管理的族库("+data.familyCount+")";
		}else if(data.type==1){
			return "我管理的标准模型("+data.modelCount+")";
		}
	},
	
	
	//初始化
	init: function() {
		$('.serviceBody').html(new App.Services.projectMember.mainView().render().el);
		
		
	//	$("#dataLoading").show();
		$('#projectList').mmhMask();
		
		/*this.loadData(this.projectMemberProjectCollection,{
			outer:App.Comm.getCookie("isOuter")
		},{
			userId:App.Comm.getCookie("userId"),
			type:3
		});*/
		this.projectMemberProjectCollection.userId=App.Global.User.userId;
		
		this.projectMemberProjectCollection.fetch({
			reset: true,
			data: {
				userId:App.Comm.user("userId"),
				type:3
			}
		});
		/*this.loadData(this.projectMemberMemberCollection,{outer:true},{
			dataPrivilegeId:"1"
		});*/
	},

	method:{
		model2JSON:function(models){
			var data=[];
		  	models.forEach(function(m){
		  		data.push(m.toJSON());
		  	})
		  	return data;
		}
	},

	projectMemberProjectCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			   defaults:function(){
			   		return {
			   			title:''
			   		}
			   } 
		}),
		urlType: "fetchServicesProjectMemberProjectList",
		parse: function(response) {
			$("#dataLoading").hide();
			if (response.code == 0) {
				/*var data=response.data.items,
					result=[];
				    if(data.length>0){
				    	result=[];
				    }
					_.each(data,function(item){
						item.image=item.logoUrl['small']||'/static/dist/images/projects/images/proDefault.png';
						result.push(item)
					})*/
				clearMask();
				return response;
			}else{
				return [];
			}
		}
	})),
	
	projectMemberMemberCollection: new(Backbone.Collection.extend({
		model:  Backbone.Model.extend({
			   defaults:function(){
			   		return {
			   			title:''
			   		}
			   } 
		}),
		urlType: "fetchServicesProjectMemberMemberList",
		parse: function(response) {
			if (response.code == 0) {
				var _member=response.data.member||[],
					_org=response.data.org||[];

				_member=_.map(_member,function(item){
					return item={
						name:item.name,
						project:item.orgNamePath,
						id:item.id, //成员ID
						outer:item.outer
					}
				});
				_org=_.map(_org,function(item){
					return item={
						name:item.name,
						project: item.orgNamePath,
						id:item.id, //成员ID
						outer:item.outer,
						org:true
					}
				});
				
				return _member.concat(_org);
			}else{
				return []
			}
		}
	})),
	
	projectMemberOrgCollection: new(Backbone.Collection.extend({
		model: App.Services.model,
		urlType: "fetchServicesProjectMemberMemberList",
		parse: function(response) {
			if (response.code == 0) {
				return response.data;
			}
		}
	})),

	loadData: function(collection,data,path) {
		// debugger;
		data=data||{};
		//path参数赋值
		if(path && typeof path === "object"){
			for(var p in path){
				if(path.hasOwnProperty(p)){
					collection[p]=path[p];
				}
			}
		}
		
		collection.fetch({
			reset: true,
			data: data
		});
	}

}