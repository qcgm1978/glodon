 //项目管理入口
 App.Services.Project = Backbone.View.extend({

 	tagName: "div",

 	id: "projectManger",

 	events: {
 		"click .serviceNav .item": "switchTab",
 		"click .flowSliderUl .item":"slideBarClick",
 		"keyup #serchData":"serchDataFun",
 		"click .searchItem":"searchItemClickFun"
 	},
 	default:{
 		timeout:0
 	},
 	//初始化事件
 	initialize() {
 		this.listenTo(App.Services.ProjectCollection.ProjectSlideBarCollection, "add", this.slideBarAdd);
 		this.listenTo(App.Services.ProjectCollection.ProjectSlideBarCollection, "reset", this.resetLoading);
 		$(document).on("click",function(){
 			var serachDataList = $("#serachDataList");
 			serachDataList.hide();
 			serachDataList.empty();
 		})
 	},


 	template: _.templateUrl('/services/tpls/project/index.html', true),

 	render() {
 	
 		this.$el.html(this.template);

	  var $container = this.$el.find('.serviceNav'),
	      tabs = App.Comm.AuthConfig.Service.project,
		  Auth = App.AuthObj.service.project;

	  if (Auth.baseInfo) {
		  $container.append(tabs.baseInfo.tab);
		  new App.Services.ProjectBase();
		  this.viewProjectMapping = new App.Services.ProjectMapping();
		  this.$(".projectContainer .projectBase .mapItem").html(this.viewProjectMapping.render().el);

	  }

		//映射规则
		//if (Auth.mappingRule) {
		//	$container.append(tabs.mappingRule.tab);
    //
		//}



	  //if (Auth.designInfo) {
		 // $container.append(tabs.designInfo.tab);
    //
		 // this.viewProjectBaseHole = new App.Services.ProjectDetail.BaseHole();
		 // this.viewProjectFloor = new App.Services.ProjectDetail.Floor();
		 // this.viewProjectSection = new App.Services.ProjectDetail.Section();
		 // this.viewProjectPile = new App.Services.ProjectDetail.Pile();
    //
		 // this.$(".projectContainer .projectFloor").html(this.viewProjectFloor.render().el);
    //
		 // this.$(".projectContainer .projectBaseHole").html(this.viewProjectBaseHole.render().el);
    //
		 // this.$(".projectContainer .projectSection").html(this.viewProjectSection.render().el);
    //
		 // this.$(".projectContainer .projectPile").html(this.viewProjectPile.render().el);
	  //}



		


 		this.fetchData();

 		return this;
 	},
 	//搜索项目的方法
 	serchDataFun(e){
 		var _this = this;
 		var target = $(e.target);
 		var targetVal = target.val().trim();
 		if(this.default.timeout){
 			clearTimeout(this.default.timeout);
 		}
	    this.default.timeout = setTimeout(function(){
	    	if(targetVal){
	    		_this.searchFun(targetVal);
	    	}
	    },200);
 	},
 	//执行搜索的方法
 	searchFun(targetVal){
 		//重置，拉取数据
 		var data = {
 			URLtype: "fetchManageProjects",
 			data: {
 				name: targetVal
 			}
 		};
 		App.Comm.ajax(data,function(result){
	 		var html= "";
			var ulBox = $("<ul></ul>");
			var serachDataList = $("#serachDataList");
			serachDataList.empty();
 			if(result.code==0){
 				var datas = result.data;
 				if(datas.length>0){
 					for(var i=0,len=datas.length-1;i<=len;i++){
						html+='<li class="searchItem" data-projectid="'+datas[i].id+'" title="'+datas[i].name+'">'+datas[i].name+'</li>';
 					}
 				}else if(datas.length==0){
 					html+='<li>搜索内容为空！</li>';
 				}
 				ulBox.append(html);
				serachDataList.append(ulBox);
 				serachDataList.show();
 			}
 		})
 	},
 	//搜索之后项目点击的方法
 	searchItemClickFun(e){
 		var target = $(e.target);
 		var targetId = target.data("projectid");
 		var targetText = target.html();
 		var serchData = $("#serchData");
 		serchData.val(targetText);
 		var clickEle = this.$(".flowSliderUl").find('.item[data-projectid='+targetId+']');
 		clickEle.click();
 		this.$(".slideBarScroll").mCustomScrollbar("scrollTo",'.flowSliderUl .item[data-projectid='+targetId+']');
 	},
 	//获取数据	
 	fetchData() {
 	
 		$('#pageLoading').show();
 		var that = this;
 		this.$(".serviceNav .item:first").click();

 		//重置，拉取数据
 		App.Services.ProjectCollection.ProjectSlideBarCollection.reset();

 		App.Services.ProjectCollection.ProjectSlideBarCollection.fetch({
 			success(child, data) {
 				that.$(".folwSlideBar .header .count").text(data.data.length);
 				this.$(".flowSliderUl .item:first").click();
 			}
 		});

 	},

 	//左侧点击
 	slideBarClick(event){
 		var _this=this,
 			$item=$(event.target).closest(".item"),
 			_collection=App.Services.ProjectCollection.ProjectBaseInfoCollection;
 		let _projectId= App.Services.ProjectMappingRuleId = App.Comm.publicData.services.project.projectId = $item.attr('data-projectId');
		App.Comm.publicData.services.project.projectName = $item.find(".name").text();
 		$item.addClass("selected").siblings().removeClass("selected");
 		//加载项目基本信息数据
 		_collection.projectId=_projectId;
 		_collection.fetch({
 			reset:true,
 			success(child, data) {
 			}
 		});
 		
 		if(this.viewProjectMapping){
 			//参数传递
	 		this.viewProjectMapping.setUserData({
	 			projectId:_projectId
	 		});
 		}
 		
 		
 		//加载项目映射数据
 		let collectionMap=App.Services.ProjectCollection.ProjecMappingCollection;
 		collectionMap.projectId=_projectId;
 		collectionMap.fetch({
 			reset:true,
 			success(child, data) {

 			}
 		});


		//映射规则
		let collectionMapRule=App.Services.ProjectCollection.ProjectMappingRuleCollection;
		collectionMapRule.reset();
		collectionMapRule.projectId=_projectId;
		collectionMapRule.fetch({
			data: {projectId: _projectId},
			success(child, data) {
				this.viewMappingRule = new App.Services.viewMappingRule(collectionMapRule.models[0]);
				this.$(".projectContainer .projectMappingRule").html(this.viewMappingRule.render().el);
			}
		});



 		
 		//加载基坑数据 张延凯---注释了这里的代码 如果有其他问题可以去掉注释
 		// this.viewProjectBaseHole.setUserData({
 		// 	projectId:_projectId
 		// });
 		// let collectionBasehole=App.Services.ProjectCollection.ProjecDetailBaseHoleCollection;
 		// collectionBasehole.projectId=_projectId;
 		// collectionBasehole.reset();
 		// collectionBasehole.fetch({
 		// 	success(child, data) {
 				
 		// 		App.Services.ProjectCollection.datas.pitData=data.data.pits;
 		// 		//加载楼层信息数据
		 // 		_this.viewProjectFloor.setUserData({
		 // 			projectId:_projectId
		 // 		});
		 // 		let collectionFloor=App.Services.ProjectCollection.ProjecDetailFloorCollection;
		 // 		collectionFloor.projectId=_projectId;
		 // 		collectionFloor.reset();
		 // 		collectionFloor.fetch();
		 		
		 // 		//加载剖面信息
		 // 		_this.viewProjectSection.setUserData({
		 // 			projectId:_projectId
		 // 		});
		 // 		let collectionSection=App.Services.ProjectCollection.ProjecDetailSectionCollection;
		 // 		collectionSection.projectId=_projectId;
		 // 		collectionSection.reset();
		 // 		collectionSection.fetch();
		 		
		 // 		//加载桩信息
		 // 		_this.viewProjectPile.setUserData({
		 // 			projectId:_projectId
		 // 		});
		 // 		let collectionPile=App.Services.ProjectCollection.ProjecDetailPileCollection;
		 // 		collectionPile.projectId=_projectId;
		 // 		collectionPile.fetch({
		 // 			reset:true
		 // 		});
 				
 		// 	}
 		// });
 		
 		
 		
 		$('#pageLoading').hide();
 		
 	},

 	templateDetail: _.templateUrl('/services/tpls/project/slidebar/list.detail.html'),

 	//侧边栏数据
 	slideBarAdd(model) {

 		var $flowSliderUl=this.$(".flowSliderUl"),data=model.toJSON();

 		//移除加载
 		$flowSliderUl.find(".loading").remove();

 		$flowSliderUl.append(this.templateDetail(data));
 		//绑定滚动条
 		App.Comm.initScroll(this.$(".slideBarScroll"),"y");
 	 
 	},

 	//加载前 重置
 	resetLoading() {
 		this.$(".flowSliderUl").empty().append('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
 	},

 	//切换tab
 	switchTab(event) {

 		var $target = $(event.target),
 			type = $target.data("type");

 		$target.addClass("selected").siblings().removeClass("selected");
 		if (type == "base") {
 			this.$(".projectContainer .projectBase").show().siblings().hide();
 		} else if (type == "mapping") {
 			this.$(".projectContainer .projectMapping").show().siblings().hide();
 		} else if (type == "floor") {//楼
 			this.$(".projectContainer .projectFloor").show().siblings().hide();
 		} else if (type == "basehole") {//基坑
 			this.$(".projectContainer .projectBaseHole").show().siblings().hide();
 		} else if (type == "section") {//剖面
 			this.$(".projectContainer .projectSection").show().siblings().hide();
 		} else if (type == "pile") {//桩
 			this.$(".projectContainer .projectPile").show().siblings().hide();
 		}else if (type == "mappingRule") {//映射规则
			this.$(".projectContainer .projectMappingRule").show().siblings().hide();
		}

 	}



 });