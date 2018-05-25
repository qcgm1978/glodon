App.Services.SystemCollection = {
	Settings:{
		pageIndex:1,
		pageIndexR:1,
		pageIndexRG:1,
		pageIndexFeedBack:1,
		pageItemCount:24
	},
	//分类列表
	CategoryCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "servicesCategoryList",
		parse(response) {
			if (response.code == 0) {
                 return response.data.items;
             }
		}
	})),

	//流程列表
	FlowCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "servicesFlowList",
		parse(response) {
			if (response.code == 0) { 
				if (response.data.length<=0) {
					$("#systemContainer .flowListBody").html('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
				}
                 return response.data;
             }
		}
	})),

	ExtendAttrCollection: new(Backbone.Collection.extend({
		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),
		urlType: "extendAttrList",
		parse(response) {
			if (response.code == 0) { 
				if (response.data.length<=0) {
					$("#systemContainer .extendAttrListBody").html('<li class="loading" data-i18n="data.drawing-model.Ndd">无数据</li>');
				}
                 return response.data;
             }
		}
	})),
	FeedBackCollection:new(Backbone.Collection.extend({
		model:Backbone.Model.extend({
			defaults:function(){
				return {
					items:[{
						name:''
					}]
				}
			}
		}),
		urlType:"getFeedBackList",
		parse(response){
			if(response.code == 0){
				return response.data.items;
			}
		}
	})),
	ResourceCollection:new(Backbone.Collection.extend({
		model:Backbone.Model.extend({
			defaults:function(){
				return {
					items:[{
						name:''
					}]
				}
			}
		}),
		urlType:"getResourceList",
		parse(response){
			if(response.code == 0){
				return response.data.items;
			}
		}
	})),
	ResourceGetCollection:new(Backbone.Collection.extend({
		model:Backbone.Model.extend({
			defaults:function(){
				return {
					items:[{
						name:''
					}]
				}
			}
		}),
		urlType:"getResourceList",
		parse(response){
			if(response.code == 0){
				return response.data.items;
			}
		}
	})),
	ResourceGetIndexCollection:new(Backbone.Collection.extend({
		model:Backbone.Model.extend({
			defaults:function(){
				return {
					items:[{
						name:''
					}]
				}
			}
		}),
		urlType:"getResourceList",
		parse(response){
			if(response.code == 0){
				return response.data.items;
			}
		}
	})),
	NoticeCollection:new(Backbone.Collection.extend({
		model:Backbone.Model.extend({
			defaults:function(){
				return {
					title:''
				}
			}
		}),
		urlType:"getServersNoticeList",
		parse(response){
			if(response.code == 0){
				return response.data;
			}
		}
	})),
	getListHandle(parmer){//获取公告列表的方法
		var self = this;
		var defaultData = {
			title:'',
			status:'',
			pageIndex:App.Services.SystemCollection.Settings.pageIndex,
			pageItemCount:15,
		};
		var extendData = $.extend({},defaultData,parmer);
		App.Services.SystemCollection.NoticeCollection.reset();
		App.Services.SystemCollection.NoticeCollection.fetch({
			data:extendData,
			success:function(collection, response, options){
				$("#listDom").find(".noDataTd").parent().remove();
				var $content = $(".noticeListDownBox");
				var pageCount = response.data.totalItemCount;
				$content.find(".sumDesc").html( (App.Local.data['system-module'].empty || '共 ') + pageCount + (App.Local.data['system-module'].pot || ' 个公告') );
				$content.find(".listPagination").empty().pagination(pageCount, {
				    items_per_page: response.data.pageItemCount,
				    current_page: response.data.pageIndex - 1,
				    num_edge_entries: 3, //边缘页数
				    num_display_entries: 5, //主体页数
				    link_to: 'javascript:void(0);',
				    itemCallback: function(pageIndex) {
				        //加载数据
				        App.Services.SystemCollection.Settings.pageIndex = pageIndex + 1;
				        App.Services.SystemCollection.getListHandle();
				    },
				    prev_text: (App.Local.data['system-module'].Back || "上一页"),
				    next_text: (App.Local.data['system-module'].Next || "下一页")
				});
				return response.data;
			}
		})
	},
	getResourceListHandle(parmer){//获取相关资源列表的方法
		var self = this;
		var defaultData = {
			keyString:'',
			start:'',
			end:'',
			pageIndex:App.Services.SystemCollection.Settings.pageIndexR,
			pageItemCount:15,
		};
		var extendData = $.extend({},defaultData,parmer);
		App.Services.SystemCollection.ResourceCollection.reset();
		App.Services.SystemCollection.ResourceCollection.fetch({
			data:extendData,
			success:function(collection, response, options){
				$(".resourceList").find(".loading").remove();
				var $content = $(".resourceContentDown");
				var pageCount = response.data.totalItemCount;
				$content.find(".sumDesc").html('共 ' + pageCount + ' 个资源');
				$content.find(".listPagination").empty().pagination(pageCount, {
				    items_per_page: response.data.pageItemCount,
				    current_page: response.data.pageIndex - 1,
				    num_edge_entries: 3, //边缘页数
				    num_display_entries: 5, //主体页数
				    link_to: 'javascript:void(0);',
				    itemCallback: function(pageIndex) {
				        //加载数据
				        App.Services.SystemCollection.Settings.pageIndexR = pageIndex + 1;
				        App.Services.SystemCollection.getResourceListHandle();
				    },
				    prev_text: (App.Local.data['system-module'].Back || "上一页"),
				    next_text: (App.Local.data['source-model'].nt || "下一页")
				});
				return response.data;
			}
		})
	},
	resourceListHandle(parmer){//获取相关资源列表的方法
		var self = this;
		var defaultData = {
			keyString:'',
			start:'',
			end:'',
			pageIndex:App.Services.SystemCollection.Settings.pageIndexRG,
			pageItemCount:15,
		};
		var extendData = $.extend({},defaultData,parmer);
		App.Services.SystemCollection.ResourceGetCollection.reset();
		App.Services.SystemCollection.ResourceGetCollection.fetch({
			data:extendData,
			success:function(collection, response, options){
				if(response.code==0){
					$(".resourceListBox").find(".loading").remove();
					var $content = $("#pageBoxDd");
					var pageCount = response.data.totalItemCount;
					$content.find(".sumDesc").html( (App.Local.getTranslation('empty')||'共 ') + pageCount + ( App.Local.getTranslation('online-service.Xs')||' 个资源') );
					$content.find(".listPagination").empty().pagination(pageCount, {
					    items_per_page: response.data.pageItemCount,
					    current_page: response.data.pageIndex - 1,
					    num_edge_entries: 3, //边缘页数
					    num_display_entries: 5, //主体页数
					    link_to: 'javascript:void(0);',
					    itemCallback: function(pageIndex) {
					        //加载数据
					        App.Services.SystemCollection.Settings.pageIndexRG = pageIndex + 1;
					        App.Services.SystemCollection.resourceListHandle();
					    },
					    prev_text: (App.Local.getTranslation('online-service.Bk') || "上一页"),
					    next_text: App.Local.getTranslation('online-service.Nt') || "下一页"
					});
					return response.data;
				}else{
					$.tip({message:response.message,type:'alarm'});
				}
			}
		})
	},
	resourceListIndexHandle(parmer){//获取相关资源列表的方法
		var self = this;
		var defaultData = {
			keyString:'',
			start:'',
			end:'',
			pageIndex:1,
			pageItemCount:5,
		};
		var extendData = $.extend({},defaultData,parmer);
		App.Services.SystemCollection.ResourceGetIndexCollection.reset();
		App.Services.SystemCollection.ResourceGetIndexCollection.fetch({
			data:extendData,
			success:function(collection, response, options){
				$(".content").find(".loading").remove();
				return response.data;
			}
		})
	},
	getFeedBackListHandle(parmer){//获取建议反馈列表的方法
		var self = this;
		var defaultData = {
			query:'all',
			title:'',
			content:'',
			createName:'',
			opTimeStart:'',
			opTimeEnd:'',
			haveReply:"",
			pageIndex:App.Services.SystemCollection.Settings.pageIndexFeedBack,
			pageItemCount:15,
		};
		var extendData = $.extend({},defaultData,parmer);
		App.Services.SystemCollection.FeedBackCollection.reset();
		App.Services.SystemCollection.FeedBackCollection.fetch({
			data:JSON.stringify(extendData),
			type:"POST",
			contentType:"application/json",
			success:function(collection, response, options){
				if(response.code == 0){
					var $content = $(".feedBackContentDown");
					if(response.data.items.length>0){
						$(".feedBackList").find(".loading").remove();
						var pageCount = response.data.totalItemCount;
						$content.find(".sumDesc").html('共 ' + pageCount + ' 个反馈');
						$content.find(".listPagination").empty().pagination(pageCount, {
						    items_per_page: response.data.pageItemCount,
						    current_page: response.data.pageIndex - 1,
						    num_edge_entries: 3, //边缘页数
						    num_display_entries: 5, //主体页数
						    link_to: 'javascript:void(0);',
						    itemCallback: function(pageIndex) {
						        //加载数据
						        App.Services.SystemCollection.Settings.pageIndexFeedBack = pageIndex + 1;
						        extendData.pageIndex=pageIndex + 1;
						        App.Services.SystemCollection.getFeedBackListHandle(extendData);
						    },
						    prev_text: (App.Local.data['system-module'].Back || "上一页"),
						    next_text: (App.Local.data['source-model'].nt || "下一页")
						});
						return response.data;
					}else{
						$content.find(".feedBackList").html('<li class="loading">数据为空</li>');
						$content.find(".sumDesc").html('');
						$content.find(".listPagination").empty('');
					}
					
				}else{
					$.tip({message:res.message,type:'alarm'});
				}
			}
		})
	},
}