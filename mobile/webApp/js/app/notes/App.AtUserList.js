App.AtUserList = {
	defaults:{
		projectId:"",//项目id
		searchName:'',//搜索的关键字
		searchBool:false,//是否处于搜索状态
		moreFlag:true,//防止数据没有请求回来重复请求
		searchFlag:true,//防止数据没有请求回来重复请求
		pageIndex:1,//当前是第几页
		pageSearchIndex:1,//搜索功能当前是第几页
		pageItemCount:5,//每页显示条数
		pageSearchItemCount:5,//搜索每页显示条数
		pageCount:5,//总共多少页
		searchPageCount:5,//搜索总共多少页
		listScroll:'',//默认滚动条
		listSearchScroll:'',//搜索之后滚动条
	},
	init:function(arge){
		var self = this;
		this.defaults.projectId = arge.projectId;//项目id
		this.defaults.searchName = "";
		this.defaults.searchBool = false;
		this.defaults.moreFlag = true;
		this.defaults.pageIndex = 1;
		this.defaults.pageSearchIndex = 1;
		this.defaults.pageItemCount = 5;
		this.defaults.pageSearchItemCount = 5;
		this.defaults.pageCount = "";
		this.initHtmlHandle();//初始化页面
		this.initSearchHtmlHandle();//初始化页面
		$(function(){
			self.initHandle();//初始化
			self.initEventHandle();//初始化事件绑定
			self.initSearchEventHandle();//初始化搜索事件绑定
			var itemHeight = "",
				pageHeight = "";
			var atUserScroll = $('#atUserScroll');
			var atUserList = $('#atUserList');
			pageHeight = atUserScroll.height();//整页的高度
			itemHeight = atUserList.find("li:eq(0)").height();//每个的高度
			self.defaults.pageItemCount = Math.ceil(pageHeight/itemHeight)+1;
			self.initScrollHandle();
			self.getUserListHandle();
		})
	},
	initHandle:function(){//初始化
		App.hideMainMenu();//隐藏底部导航栏
		App.TitleBar.setTitle("请选择提醒的人");//设置顶部标题
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.returnCallback(function(){//返回上一页事件
			history.back();
		});
		var mainContainer = $("#mainContainer");
		mainContainer.css("padding-bottom",0);
	},
	initHtmlHandle:function(){//初始化页面
		var self = this,
			itemHeight = "",
			pageHeight = "";
		var atUserScroll = $('#atUserScroll');
		var atUserList = $('#atUserList');
		var lodingDom = $('<div class="loading">加载中...</div>');
		var listComponent = $('<li style="display:none" data-userid="{{userId}}" data-username="{{userNameShow}}"><dl><dt><img src="/{{userLogo}}"></dt><dd>{{userName}} （{{userCompany}}）</dd></dl></li>');
		atUserList.html('');
		atUserList.append(lodingDom);
		atUserList.append(listComponent);
	},
	initSearchHtmlHandle:function(){//初始化页面
		var searchListBox = $('#searchListBox');
		var lodingDom = $('<div class="loading">加载中...</div>');
		var listComponent = $('<li style="display:none" data-userid="{{userId}}" data-username="{{userNameShow}}"><dl><dt><img src="/{{userLogo}}"></dt><dd>{{userName}} （{{userCompany}}）</dd></dl></li>');
		searchListBox.html('');
		searchListBox.append(lodingDom);
		searchListBox.append(listComponent);
	},
	initEventHandle:function(){//初始化事件绑定
		var atUserList = $("#atUserList");
		var searchListBox = $("#searchListBox");
		atUserList.on("click","li",function(evt){
			var target = $(evt.target).closest("li");
			var userId = target.data("userid");
			var userName = target.data("username");
			App.defaults.atNameList ={
				userId:userId+"",
				userName:userName
			}
			history.back();
			return false;
		})
		searchListBox.on("click","li",function(evt){
			var target = $(evt.target).closest("li");
			var userId = target.data("userid");
			var userName = target.data("username");
			App.defaults.atNameList ={
				userId:userId+"",
				userName:userName
			}
			history.back();
			return false;
		})
	},
	initSearchEventHandle:function(){//初始化搜索事件绑定
		var self = this;
		var searchBtn = $("#searchBtn");
		var searchInput = $("#searchInput");
		var clearSearchVal = $("#clearSearchVal");
		var searchCommonBox = $("#searchCommonBox");
		var clearSearchBtn = $("#clearSearchBtn");
		var searchCommentDown = $("#searchCommentDown");
		var searchListBox = $("#searchListBox");
		var resultNum = $("#resultNum");
		var loadMoreSearchData = $("#searchCommentDown > .loadMoreData");
		var loadMoreData = $("#atUserScroll > .loadMoreData");
		searchBtn.on("click",function(){//点击搜索按钮的方法
			if(!self.defaults.searchFlag) return;
			document.activeElement.blur(); 
			setTimeout(function(){
				self.defaults.searchFlag = false;
				self.initSearchHtmlHandle();//重置搜索页面元素
				searchCommonBox.css("padding-top","1.706rem").css("display","block");
				var searchVal = searchInput.val().trim();
				var pageHeight = searchCommentDown.height();//整页的高度
				var itemHeight = searchListBox.find("li:eq(0)").height();//每个的高度
				searchListBox.css("transform","translate(0,0)");
				self.defaults.pageSearchItemCount = Math.ceil(pageHeight/itemHeight);
				self.defaults.searchBool = true;
				self.defaults.pageSearchIndex = 1;//搜索条件
				self.defaults.searchName = searchVal;//搜索条件
				searchCommentDown.find(".nullData").remove();
				loadMoreSearchData.html("加载中...")
				resultNum.html("");
				self.getUserListHandle();//获取对此项目有权限的用户列表数据
			},100)
			return false;
		})
		searchInput.on("input propertychange",function(evt){//搜索输入框的事件
		 	var targetVal = $(evt.target).val().trim();
		 	if(targetVal.length>0){
		 		clearSearchVal.css("display","block");
		 	}
		})
		clearSearchVal.on("click",function(){//搜索输入框里面的清空输入框的按钮
			$(this).hide();
			searchInput.val("");
		})
		clearSearchBtn.on("click",function(){//点击清空搜索按钮执行的方法
			searchCommonBox.css("display","none");
			clearSearchVal.css("display","none");
			searchListBox.html("");
			searchInput.val("");
			self.defaults.searchBool = false;
			self.defaults.searchName = "";
			loadMoreData.html("加载中...");
			loadMoreSearchData.html("加载中...");
			self.initSearchHtmlHandle();//重置搜索页面元素
		})
	},
	initScrollHandle:function(){//初始化滚动条
		var self = this;
		var loadMoreData = $("#atUserScroll > .loadMoreData");
		var loadMoreSearchData = $("#searchCommentDown > .loadMoreData");
		this.defaults.listScroll = new IScroll('#atUserScroll', {
			mouseWheel: true,//鼠标滚轮
			probeType: 3,//像素级触发 执行回调
		    scrollbars: false,//滚轴是否显示默认是true
	     	click: true 
		});
		this.defaults.listScroll.on('scroll', function(){
			if(this.directionY == 1){
				if(this.y<this.maxScrollY-loadMoreData.height()){
					loadMoreData.show();
				}else{
					loadMoreData.hide();
				}
			}else{
				loadMoreData.hide();
			}
		});
		this.defaults.listScroll.on('scrollEnd', function(){
			if(this.y==this.maxScrollY&&this.maxScrollY<0){
				if(!self.defaults.moreFlag) return;
				self.defaults.pageIndex++;
				if(self.defaults.pageIndex<=self.defaults.pageCount){
					self.getMoreUserListHandle();//获取更多
				}else{
					loadMoreData.html("到底了...")
				}
			}
		});
		this.defaults.listSearchScroll = new IScroll('#searchCommentDown', {
			mouseWheel: true,//鼠标滚轮
			probeType: 3,//像素级触发 执行回调
		    scrollbars: false,//滚轴是否显示默认是true
		    click: true 
		});
		this.defaults.listSearchScroll.on('scroll', function(){
			if(this.directionY == 1){
				if(this.y<this.maxScrollY-loadMoreSearchData.height()){
					loadMoreSearchData.show();
				}else{
					loadMoreSearchData.hide();
				}
			}else{
				loadMoreSearchData.hide();
			}
		});
		this.defaults.listSearchScroll.on('scrollEnd', function(){
			if(this.y==this.maxScrollY&&this.maxScrollY<0){
				if(!self.defaults.moreFlag) return;
				self.defaults.pageSearchIndex++;
				if(self.defaults.pageSearchIndex<=self.defaults.searchPageCount){
					self.getMoreUserListHandle();//获取更多
				}else{
					loadMoreSearchData.html("到底了...")
				}
			}
		});
	},
	getMoreUserListHandle:function(){//加载更多
		var self = this;
		var data = {
			projectId:this.defaults.projectId,
			name:this.defaults.searchName,
			pageIndex:!self.defaults.searchBool?this.defaults.pageIndex:this.defaults.pageSearchIndex,
			pageItemCount:!self.defaults.searchBool?this.defaults.pageItemCount:self.defaults.pageSearchItemCount,
		}
		this.defaults.moreFlag = false;
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.getProjectUserList,
			param:data,
			dataType:"json",
			success:function(data){
				self.defaults.moreFlag = true;
				if(data.code == 0){
					if(data.data.items.length>0){
						if(self.defaults.searchBool){
							self.viewSearchAppendPage(data.data.items);
							self.defaults.listSearchScroll.refresh();
						}else{
							self.viewAppendPage(data.data.items);
							self.defaults.listScroll.refresh();
						}
					}
				}else{
					alert(data.message);
				}
			}
		})
	},
	viewAppendPage:function(data){//默认上来的列表
		var atUserList = $("#atUserList");
		var liItem = "";
		for(var i=0,iLen=data.length;i<iLen;i++){
			liItem += '<li data-userid="'+
						data[i].userid+'" data-username="'+data[i].userName+'"><dl><dt><img src="/'+
						data[i].photoPath+'"></dt><dd>'+
						data[i].userName+' （'+
						data[i].org+'）</dd></dl></li>'
		}
		atUserList.append(liItem);
	},
	viewSearchAppendPage:function(data){//搜索上来的列表
		var searchListBox = $("#searchListBox");
		var liItem = "";
		if(App.AtUserList.defaults.searchBool){
			if(App.AtUserList.defaults.searchName.length>0){
				for(var j=0,jLen=data.length;j<jLen;j++){
					var name = App.searchHighlightHandle(App.AtUserList.defaults.searchName,data[j].userName);//搜索结果高亮效果的方法
					liItem += '<li data-userid="'+
								data[j].userid+'" data-username="'+data[j].userName+'"><dl><dt><img src="/'+
								data[j].photoPath+'"></dt><dd>'+
								name+' （'+
								data[j].org+'）</dd></dl></li>'
				}
			}else{
				for(var j=0,jLen=data.length;j<jLen;j++){
					liItem += '<li data-userid="'+
								data[j].userid+'" data-username="'+data[j].userName+'"><dl><dt><img src="/'+
								data[j].photoPath+'"></dt><dd>'+
								data[j].userName+' （'+
								data[j].org+'）</dd></dl></li>'
				}
			}
		}else{
			for(var j=0,jLen=data.length;j<jLen;j++){
				liItem += '<li data-userid="'+
							data[j].userid+'" data-username="'+data[j].userName+'"><dl><dt><img src="/'+
							data[j].photoPath+'"></dt><dd>'+
							data[j].userName+' （'+
							data[j].org+'）</dd></dl></li>'
			}
		}
		searchListBox.append(liItem);
	},
	getUserListHandle:function(){//默认获取用户列表的方法
		var self = this;
		var searchListBox = $('#searchListBox');
		var atUserList = $('#atUserList');
		var searchCommentDown = $('#searchCommentDown');
		var atUserScroll = $('#atUserScroll');
		var resultNum = $('#resultNum');
		var nullData = $("<div class='nullData'><div class='nullDataImg'></div><p>暂时还没有任何内容哦～</p></div>");
		var data = {
			projectId:this.defaults.projectId,
			name:this.defaults.searchName,
			pageIndex:!self.defaults.searchBool?this.defaults.pageIndex:this.defaults.pageSearchIndex,
			pageItemCount:!self.defaults.searchBool?this.defaults.pageItemCount:self.defaults.pageSearchItemCount,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.getProjectUserList,
			param:data,
			dataType:"json",
			success:function(data){
				if(data.code == 0){
					resultNum.html(data.data.totalItemCount);
					if(self.defaults.searchBool){
						searchListBox.find(".loading").remove();
						self.defaults.searchFlag = true;
						self.defaults.searchPageCount = data.data.pageCount;//总共多少页
					}else{
						atUserList.find(".loading").remove();
						self.defaults.pageCount = data.data.pageCount;//总共多少页
					}
					if(data.data.items.length>0){
						if(self.defaults.searchBool){
							self.viewSearchPage(data.data.items);
							self.defaults.listSearchScroll.refresh();
						}else{
							self.viewPage(data.data.items);
							self.defaults.listScroll.refresh();
						}
					}else{
						if(self.defaults.searchBool){
							searchCommentDown.append(nullData);
							self.defaults.listSearchScroll.refresh();
						}else{
							atUserScroll.append(nullData);
							self.defaults.listScroll.refresh();
						}
					

					}
				}else{
					alert(data.message);
				}
			}
		})
	},
	viewSearchPage:function(data){//渲染搜索列表的方法
		/*渲染数据*/
		template.repeat({
			repeatElement : $("#searchListBox>li")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				var name = "";
				if(App.AtUserList.defaults.searchName.length>0){
					name = App.searchHighlightHandle(App.AtUserList.defaults.searchName,itemObject.item.userName);//搜索结果高亮效果的方法
				}else{
					name = itemObject.item.userName;
				}
				return {
					"userNameShow":itemObject.item.userName,
					"userName":name,
					"userId":itemObject.item.userid,
					"userLogo":itemObject.item.photoPath,
					"userCompany":itemObject.item.org
				}
			}
		});
	},
	viewPage:function(data){//渲染列表的方法
		/*渲染数据*/
		template.repeat({
			repeatElement : $("#atUserList>li")[0], /*页面的DOM元素*/
			data : data,
			process : function(itemObject){
				return {
					"userNameShow":itemObject.item.userName,
					"userName":itemObject.item.userName,
					"userId":itemObject.item.userid,
					"userLogo":itemObject.item.photoPath,
					"userCompany":itemObject.item.org
				}
			}
		});
	}
}