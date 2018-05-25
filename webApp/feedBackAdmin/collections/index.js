App.AdminFeedBack = {
	default:{
		isSelectAll:false,
		isSearch:false,
		hovers:'',
		outLive:'',
		currentData:[],
		checkedLen:0,
		models:[],//复选框需要的数组
		ids:[],//导出的数组数据
		pageIndexFeedBack:1,
		adviceTypeArr:["全部","设计","计划","成本","质监","系统"]
	},
	init:function(){
		var FeedBackContainerV = new App.AdminFeedBack.FeedBackContainerV();
		$("#contains").append(FeedBackContainerV.render().$el);
	},
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
		parse:function(response){
			var isAllSelectLen = 0;
			if(response.code == 0){
				if(response.data.items.length>0){
					_.map(response.data.items,function(item){
						return item.hasSelect = false;
					})
					App.AdminFeedBack.default.currentData = response.data.items;
					var selectedArr = App.AdminFeedBack.default.models;
					var selectedPageIndex = App.AdminFeedBack.default.pageIndexFeedBack;
					if(selectedArr.length>0){
						for(let i=0,len=selectedArr.length;i<len;i++){
							if(selectedArr[i].pageIndex == selectedPageIndex){
								for(let j=0,jLen=selectedArr[i].modelsArr.length;j<jLen;j++){
									for(let k=0,kLen=response.data.items.length;k<kLen;k++){
										if(selectedArr[i].modelsArr[j].id == response.data.items[k].id){
											response.data.items[k].hasSelect = true;
											isAllSelectLen++;
										}
									}
								}
							}
						}
					}
					if(response.data.items.length == isAllSelectLen){
						App.AdminFeedBack.default.isSelectAll = true;
					}else{
						App.AdminFeedBack.default.isSelectAll = false;
					}
				}else{
					App.AdminFeedBack.default.currentData = [];
				}
				return response.data.items;
			}
		}
	})),
	getFeedBackDataHandle:function(parmer){//获取建议反馈列表的方法
		var self = this;
		var defaultData = {
			query:'all',
			title:'',
			content:'',
			createName:'',
			opTimeStart:'',
			opTimeEnd:'',
			haveReply:"",
			pageIndex:App.AdminFeedBack.default.pageIndexFeedBack,
			pageItemCount:15,
		};
		var extendData = $.extend({},defaultData,parmer);
		App.AdminFeedBack.FeedBackCollection.reset();
		App.AdminFeedBack.FeedBackCollection.fetch({
			data:JSON.stringify(extendData),
			type:"POST",
			cache:false,
			contentType:"application/json",
			success:function(collection, response, options){
				if(response.code == 0){
					App.AdminFeedBack.default.checkedLen = 0;
					$("#checkboxAll").prop("checked",App.AdminFeedBack.default.isSelectAll);
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
						        App.AdminFeedBack.default.pageIndexFeedBack = pageIndex + 1;
						        extendData.pageIndex=pageIndex + 1;
						        App.AdminFeedBack.getFeedBackDataHandle(extendData);
						    },
						    prev_text: (App.Local.data['system-module'].Back || "上一页"),
						    next_text: (App.Local.data['source-model'].nt || "下一页")
						});
						return response.data;
					}else{
						if(App.AdminFeedBack.default.pageIndexFeedBack == 1){
							$content.find(".feedBackList").html('<span class="loading">数据为空</span>');
							$content.find(".sumDesc").html('');
							$content.find(".listPagination").empty('');
						}else{
							extendData.pageIndex = response.data.pageIndex-1;
							App.AdminFeedBack.getFeedBackDataHandle(extendData);
						}
						
					}
					
				}else{
					$.tip({message:res.message,type:'alarm'});
				}
			}
		})
	},
}