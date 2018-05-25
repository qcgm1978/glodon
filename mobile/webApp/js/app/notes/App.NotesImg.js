//@ sourceURL=App.NotesImg.js
App.NotesImg = {
	defaults:{
		notesId:'',
		projectId:'',
		projectVersionId:'',
		folderId:'',
		projectName:'',
		notesData:'',
		modelId:'',
		modelFileName:'',
		notesType:'',
	},
	init:function(arge){
		var _this = this;
		this.initHtml();//初始化页面
		var str = window.location.hash;
		if(str.indexOf("hostType")!=-1){
			App.NotesImg.defaults.notesType = str.substr(str.indexOf("hostType")+9)
		}
		App.NotesImg.defaults.projectId = arge.projectId;
		App.NotesImg.defaults.projectVersionId = arge.projectVersionId;
		App.NotesImg.defaults.folderId = arge.folderId;
		App.NotesImg.defaults.projectName = arge.name;
		App.NotesImg.defaults.notesId = arge.notesId;
		App.NotesImg.defaults.fileVersionId = arge.fileVersionId;
		App.NotesImg.defaults.modelId = arge.modelId;
		App.NotesImg.defaults.modelFileName = arge.fileName;
		$(function(){
			_this.initHandle();//初始化页面事件和方法
			if(App.defaults.outer == undefined){
				App.Comm.ajax({
					url: App.Restful.urls.current,
					success:function(data){
						var jsonData = $.parseJSON(data);
						if(jsonData.code==0){
							App.defaults.userId = jsonData.data.userId;
							_this.loadNotesInfo();//获取批注信息的方法
						}else{
							alert(data.message);
						}
					}
				});
			}else{
				_this.loadNotesInfo();//获取批注列表的方法
			}
		})
	},
	initHtml:function(){
		App.TitleBar.setTitle("批注图片");//设置顶部标题
		App.hideMainMenu();//隐藏底部导航栏
		App.TitleBar.returnCallback(function(){
			if(App.defaults.notesDetailsObj){
				App.defaults.notesDetailsObj = undefined;
			}
			if(App.defaults.maxCommentNumber){
				App.defaults.maxCommentNumber = undefined;
			}
			if(App.defaults.maxNumPos){
	            App.defaults.maxNumPos = undefined;
	        }
			history.back();
		});
		if(!$("#footerBox > div").eq(1).hasClass("footer-box-select")){//底部导航的定位
			$("#footerBox > div").eq(1).click();
		}
		$("#mainContainer").css("padding-bottom",0);
	},
	initHandle:function(){//初始化页面事件和方法
		var _this = this;
		App.TitleBar.showPopMenuBtn("modelNotesImg",function(e){
			if($(this).attr("name")=="downloadImg"){
				_this.downloadImgHandle(location.origin+"/"+App.NotesImg.defaults.picUrl);//批注查看大图下载图片方法
			}else if($(this).attr("name")=="lookModel"){
				if(App.NotesImg.defaults.notesType == 1){
					openUrl = "#/viewModel/"+App.NotesImg.defaults.projectId+"/"+App.NotesImg.defaults.projectVersionId+"/"+App.NotesImg.defaults.projectName+"/"+App.NotesImg.defaults.folderId+"/"+App.NotesImg.defaults.modelFileName+"/"+App.NotesImg.defaults.modelId+"/notesImg/"+App.NotesImg.defaults.notesId+"/"+App.NotesImg.defaults.fileVersionId+"?t=123456&fileId="+App.NotesImg.defaults.notesId+"&fileVersionId="+App.NotesImg.defaults.fileVersionId;
				}else if(App.NotesImg.defaults.notesType == 2){
					openUrl = "#/paperModel/"+App.NotesImg.defaults.projectId+"/"+App.NotesImg.defaults.projectVersionId+"/"+App.NotesImg.defaults.projectName+"/"+App.NotesImg.defaults.folderId+"/"+App.NotesImg.defaults.modelFileName+"/"+App.NotesImg.defaults.fileVersionId+"/notesImg/"+App.NotesImg.defaults.notesId+"/"+App.NotesImg.defaults.fileVersionId+"?t=123456&fileId="+App.NotesImg.defaults.notesId+"&fileVersionId="+App.NotesImg.defaults.fileVersionId;
				}
				location.href = openUrl;
			}else if($(this).attr("name")=="gotoHome"){
				location.href = "#/index";
			}
		});
		if(App.NotesImg.defaults.fileVersionId == "null"){
			$(".popMenuItem:eq(1)").css("display","none");
		}
		if(App.NotesImg.defaults.notesType == 1){
			$(".popMenuItem:eq(1)").html("查看模型");
		}else if(App.NotesImg.defaults.notesType == 2){
			$(".popMenuItem:eq(1)").html("查看图纸");
		}
		App.UI.ImgDialog.showImgDialog($("#notesImgBox"));
	},
	downloadImgHandle:function(downUrl){//批注查看大图下载图片方法
		var fileTransfer = new FileTransfer();
		var uri = encodeURI(downUrl);
		fileTransfer.download(uri,"",function(entry){
			var Dlg = App.UI.Dialog.showMsgDialog({
				title: "提示",
				text: "下载完成，请到相册查看",
				okText: "确定",
				onok: function() {
					
				},
			});
			$(Dlg.dialog).find(".commDialogCancel").css("display","none");
			$(Dlg.dialog).find(".commDialogOk").css("width","100%");
		},function(error){
			alert("下载错误:::"+error.source);
			alert("下载错误:::"+error.target);
			alert("下载错误:::"+error.code);
		},false,{
			headers:{
				
			}
		});
		// var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
		if(location.port==='81'){
		    window.open(downUrl)
        }
		// "Authorization":"Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
	},
	loadNotesInfo:function(){//获取批注信息的方法
		var _this = this;
		var data = {
			projectId:App.NotesImg.defaults.projectId,
			viewPointId:App.NotesImg.defaults.notesId,
		}
		App.Comm.ajax({
			type:"get",
			url:App.Restful.urls.projectNotesDetails,
			param:data,
			dataType:"json",
			success:function(data){
				if(data.code == 0){
					var notesImgBox = $("#notesImgBox");
					App.NotesImg.defaults.picUrl = data.data.pic;
					notesImgBox.html('<span><img id="imgScaleZoom" src="/'+data.data.pic+'"></span>');
					App.UI.ImgDialog.bindScaleZoom();
				}else{
					alert(data.message);
				}
			}
		});
	}
}