App.NoticeDetail = {
	defaults:{
		flag:true,
		noticeId:''
	},
	init : function(args){
		var _this = this;
		this.defaults.noticeId = args.id;
		this.initHtml();
		this.loadNoticeDetail();//获取公告详情
		if(args.backName=="index"){
			this.setRead();//设置公告是否已读
		}
		$(function(){
			_this.initHandle(args);//初始化方法
		})
	},
	setRead:function(){//设置公告是否已读
		var th = this;
		var data = {
			id:App.NoticeDetail.defaults.noticeId,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.noticeRead,
			param:data,
			dataType:"json",
			success:function(data){
			}
		});
	},
	initHandle:function(args){//初始化方法
		var _this = this;
		App.TitleBar.returnCallback(function(){
			history.back();
		});
		App.UI.ImgDialog.showImgDialog($(".noticeDetailContentBox"));
	},
	initHtml:function(){
		App.TitleBar.setTitle("公告详情");
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom",0);
	},
	loadNoticeDetail:function(){
		if(!App.NoticeDetail.defaults.flag){
			return;
		}
		App.NoticeDetail.defaults.flag=false;
		var th = this;
		var data = {
			id:App.NoticeDetail.defaults.noticeId,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.noticeDetail,
			param:data,
			dataType:"json",
			success:function(data){
				$("#noticeDetailContent").find(".loading").remove();
				if(data.code==0){
					App.NoticeDetail.defaults.flag=true;
					th.viewNoticeDetail(data.data);
				}
			}
		});
	},
	viewNoticeDetail:function(data){/*渲染数据*/
		template.repeat({
			repeatElement : $("#noticeDetailBox")[0], /*页面的DOM元素*/
			data : data,
			process : function(obj){
				var item = obj.item;
				return {
					"title":item.title,
					"time": Assister.Date.getDateCommon(item.publishTime),
					"content": item.content,
					"department": item.department,
				}
			}
		});
	}
}