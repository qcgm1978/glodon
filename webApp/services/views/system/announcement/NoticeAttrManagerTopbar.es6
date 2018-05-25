App.Services.NoticeAttrManagerTopbar = Backbone.View.extend({
	default:{
		timeout:0,
		flag:true,
		noticeTime:''
	},
	tagName:'div',
	className:"noticeTopbar",
	template:_.templateUrl("/services/tpls/system/notice/noticeAttrManagerTopbar.html",true),
	events:{
		"keyup .noticeTopSearch input":"seachHandle",
		"click .newTextNotice":"newTextNotice",
		"click .newLinkNotice":"newLinkNotice",
		"click .editNotice":"editNotice",
		"click .deleteNotice":"deleteNotice",
		"click .publishNotice":"publishNotice",
		"click .previewNotice":"previewNotice",
		"click .stickNotice":"stickNotice",
		"click .cancelStickNotice":"cancelStickNotice",
		"click .withdrawNotice":"withdrawNotice",
	},
	render(){//渲染
		this.$el.html(this.template);
		return this;
	},
	seachHandle(){
		var _this = this;
		var target = $(event.target);
		var targetVal = target.val().trim();
 		if(this.default.timeout){
 			clearTimeout(this.default.timeout);
 		}
	    this.default.timeout = setTimeout(function(){
	    	_this.searchAjaxFun(targetVal);
	    },400);
	},
	searchAjaxFun:function(targetVal){//最后执行提交搜索
		var status = 1;
		$(".buttonBox > button:gt(1)").addClass("disable");
		if(targetVal == "已发布"){
			status=1;
			App.Services.SystemCollection.getListHandle({status:status,pageIndex:""});
		}else if(targetVal == "已撤回"){
			status=2;
			App.Services.SystemCollection.getListHandle({status:status,pageIndex:""});
		}else if(targetVal == "未发布"){
			status=3;
			App.Services.SystemCollection.getListHandle({status:status,pageIndex:""});
		}else{
			App.Services.SystemCollection.getListHandle({title:targetVal,pageIndex:""});
		}
	},
	newTextNotice(){//添加文本公告
		var _this = this;
		var NewTextNotice = new App.Services.NoticeAttrManagerTopbarNewTextNotice();
		App.Services.SystemCollection.addTextNoticeDialog = new App.Comm.modules.Dialog({
		    title:"新建文本公告",
		    width:800,
		    height:560,
		    isConfirm:false,
		    isAlert:false,
		    closeCallback:function(){
	    	    App.Services.SystemCollection.um.destroy();
		    },
    	    readyFn:function(){
        	    //实例化编辑器
        	    App.Services.SystemCollection.um = UM.getEditor('myEditor',{
        	        toolbar:['bold', 'italic', 'underline', 'fontfamily', 'fontsize', 'justifyleft', 'justifycenter', 'justifyright', 'forecolor', 'backcolor', 'image'],
        		    initialFrameWidth:"100%",//宽度
        		    initialFrameHeight:272,//高度
        		    dropFileEnabled:false,//点击文件是否可以拖拽改变大小
        		    imageScaleEnabled:false,//是否可以拖拽改变图片大小
        		    pasteImageEnabled:false,//是否可以拖拽上传图片
        		    autoHeightEnabled:false,//是否自动延长
        	    });
    	    },
		    message:NewTextNotice.render("").el
		});
	},
	newLinkNotice:function(){//添加链接公告
		var NewLinkNotice = new App.Services.NoticeAttrManagerTopbarNewLinkNotice();
		App.Services.SystemCollection.addLinkNoticeDialog = new App.Comm.modules.Dialog({
		    title:"新建链接公告",
		    width:600,
		    height:150,
		    isConfirm:false,
		    isAlert:false,
		    closeCallback:function(){},
		    message:NewLinkNotice.render("").el
		});
	},
	editNotice(event){//编辑公告的按钮方法
		var _this = this;
		var target = $(event.target);
		var noticeDom = $("#listDom tr.selectClass");
		var noticeid = noticeDom.find("td:eq(0)").data("noticeid");
		var data = {
			"id":noticeid
		}
		if(!target.hasClass("disable")){
			if(this.default.flag){
				this.default.flag=false;
				App.Comm.ajax({
					URLtype:"getNotice",
					data:data,
				}).done(function(res){
					if(res.code==0){
						if(res.data.type == 1){
							var NewLinkNotice = new App.Services.NoticeAttrManagerTopbarNewLinkNotice();
							App.Services.SystemCollection.addLinkNoticeDialog = new App.Comm.modules.Dialog({
							    title:"编辑链接公告",
							    width:600,
							    height:150,
							    isConfirm:false,
							    isAlert:false,
							    closeCallback:function(){},
							    message:NewLinkNotice.render(res.data).el
							});
						}else if(res.data.type == 2){
							var NewTextNotice = new App.Services.NoticeAttrManagerTopbarNewTextNotice();
							App.Services.SystemCollection.addTextNoticeDialog = new App.Comm.modules.Dialog({
							    title:"编辑文本公告",
							    width:800,
							    height:560,
							    isConfirm:false,
							    isAlert:false,
							    closeCallback:function(){
						    	    App.Services.SystemCollection.um.destroy();
							    },
					    	    readyFn:function(){
					        	    //实例化编辑器
					        	    App.Services.SystemCollection.um = UM.getEditor('myEditor',{
					        	        toolbar:['bold', 'italic', 'underline', 'fontfamily', 'fontsize', 'justifyleft', 'justifycenter', 'justifyright', 'forecolor', 'backcolor', 'image'],
					        		    initialFrameWidth:"100%",//宽度
					        		    initialFrameHeight:272,//高度
					        		    dropFileEnabled:false,//点击文件是否可以拖拽改变大小
					        		    imageScaleEnabled:false,//是否可以拖拽改变图片大小
					        		    pasteImageEnabled:false,//是否可以拖拽上传图片
					        		    autoHeightEnabled:false,//是否自动延长
					        	    });
					        	    App.Services.SystemCollection.um.setContent(res.data.content);
					    	    },
							    message:NewTextNotice.render(res.data).el
							});
						}
						_this.default.flag=true;
					}else{
						alert(res.message)
					}
				})
			}
		}
	},
	deleteNotice(){//删除选中公告的方法
		var _this = this;
		var target = $(event.target);
		var noticeDom = $("#listDom tr.selectClass");
		var noticeid = noticeDom.find("td:eq(0)").data("noticeid");
		var data = {
			"id":noticeid
		}
		if(!target.hasClass("disable")){
			var deleteNoticeDialogTmp = _.templateUrl("/services/tpls/system/notice/noticeDeleteDialog.html",true)();
			var deleteNoticeDialog = new App.Comm.modules.Dialog({
			    title:"删除公告",
			    width:360,
			    height:180,
			    isConfirm:false,
			    isAlert:false,
			    cssClass:"deleteNoticeClass",
			    closeCallback:function(){},
			    message:deleteNoticeDialogTmp
			});
		}
		$("#deleteButton").off("click");
		$("#deleteButton").on("click",function(){
			if(_this.default.flag){
				_this.default.flag=false;
				App.Comm.ajax({
					URLtype:"deleteNotice",
					data:JSON.stringify(data),
					type:"DELETE",
					contentType:"application/json",
				}).done(function(res){
					if(res.code==0){
						App.Services.SystemCollection.getListHandle();
						deleteNoticeDialog.close();
						$(".buttonBox > button:gt(1)").addClass("disable");
						_this.default.flag=true;
					}else{
						alert(res.message);
					}
				})
			}
		})
	},
	publishNotice(){//发布公告的方法
		var _this = this;
		var target = $(event.target);
		var noticeDom = $("#listDom tr.selectClass");
		var noticeid = noticeDom.find("td:eq(0)").data("noticeid");
		var data = {
			"id":noticeid
		}
		if(!target.hasClass("disable")){
			if(this.default.flag){
				this.default.flag=false;
				App.Comm.ajax({
					URLtype:"publishNotice",
					data:JSON.stringify(data),
					type:"PUT",
					contentType:"application/json",
				}).done(function(res){
					if(res.code==0){
						App.Services.SystemCollection.getListHandle();
						_this.default.flag=true;
						$(".buttonBox > button:gt(1)").addClass("disable");
					}
				})
			}
		}
	},
	previewNotice(){//预览公告的方法
		var target = $(event.target);
		var noticeDom = $("#listDom tr.selectClass");
		var noticeid = noticeDom.find("td:eq(0)").data("noticeid");
		var edittype = noticeDom.find("td:eq(0)").data("edittype");
		if(edittype == 1){
			var href = noticeDom.find("td:eq(0)").data("href");
			window.open(href,"about:blank");
		}else if(edittype == 2){
			window.open("#services/system/notice/"+noticeid,"about:blank");   
		}
	},
	stickNotice:function(event){//点击置顶按钮的时候执行的方法
		var _this = this;
		var target = $(event.target);
		var noticeDom = $("#listDom tr.selectClass");
		var noticeid = noticeDom.find("td:eq(0)").data("noticeid");
		var data = {
			"id":noticeid
		}
		if(!target.hasClass("disable")){
			if(this.default.flag){
				this.default.flag=false;
				App.Comm.ajax({
					URLtype:"stickNotice",
					data:JSON.stringify(data),
					type:"PUT",
					contentType:"application/json",
				}).done(function(res){
					if(res.code==0){
						App.Services.SystemCollection.getListHandle();
						$(".buttonBox > button:gt(1)").addClass("disable");
						_this.default.flag=true;
					}
				})
			}
		}
	},
	cancelStickNotice:function(){//取消置顶按钮方法
		var _this = this;
		var target = $(event.target);
		var noticeDom = $("#listDom tr.selectClass");
		var noticeid = noticeDom.find("td:eq(0)").data("noticeid");
		var data = {
				"id":noticeid
		}
		if(!target.hasClass("disable")){
			if(this.default.flag){
				this.default.flag=false;
				App.Comm.ajax({
					URLtype:"cancelStickNotice",
					data:JSON.stringify(data),
					type:"PUT",
					contentType:"application/json",
				}).done(function(res){
					if(res.code==0){
						App.Services.SystemCollection.getListHandle();
						$(".buttonBox > button:gt(1)").addClass("disable");
						_this.default.flag=true;
					}
				})
			}
		}
	},
	withdrawNotice:function(){//点击撤回按钮的时候执行的方法
		var _this = this;
		var target = $(event.target);
		var noticeDom = $("#listDom tr.selectClass");
		var noticeid = noticeDom.find("td:eq(0)").data("noticeid");
		var data = {
			"id":noticeid
		}
		if(!target.hasClass("disable")){
			if(this.default.flag){
				this.default.flag=false;
				App.Comm.ajax({
					URLtype:"withdrawNotice",
					data:JSON.stringify(data),
					type:"PUT",
					contentType:"application/json",
				}).done(function(res){
					if(res.code==0){
						App.Services.SystemCollection.getListHandle();
						$(".buttonBox > button:gt(1)").addClass("disable");
						_this.default.flag=true;
					}
				})
			}
		}
	},
});