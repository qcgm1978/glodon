App.NotesSnapImg = {
	defaults:{
		notesId:'',
		projectId:'',
		projectVersionId:'',
		folderId:'',
		projectName:'',
		notesData:'',
		commentId:'',
		outTime:true
	},
	init:function(arge){
		var _this = this;
		App.NotesSnapImg.defaults.projectId = arge.projectId;
		App.NotesSnapImg.defaults.projectVersionId = arge.projectVersionId;
		App.NotesSnapImg.defaults.folderId = arge.folderId;
		App.NotesSnapImg.defaults.projectName = arge.name;
		App.NotesSnapImg.defaults.notesId = arge.notesId;
		App.NotesSnapImg.defaults.fileVersionId = arge.fileVersionId;
		App.NotesSnapImg.defaults.commentId = arge.commentId;
		this.initHandle();//初始化页面事件和方法
		this.initHtml();//初始化页面
	},
	initHtml:function(){//初始化页面
		App.TitleBar.setTitle("快照");//设置顶部标题
		App.hideMainMenu();//隐藏底部导航栏
		App.TitleBar.hideHomeBtn();//隐藏顶部返回首页
		App.TitleBar.hidePopMenuBtn();//显示右上三个点
		App.TitleBar.returnCallback(function() {
		    history.back();
		});
		if(!$("#footerBox > div").eq(1).hasClass("footer-box-select")){//底部导航的定位
			$("#footerBox > div").eq(1).click();
		}
		$("#mainContainer").css("padding-bottom",0);
	},
	initHandle:function(){//初始化页面事件和方法
		var notesImgBox = $("#notesImgBox");
		var mainHeaderTitle = $("#mainHeaderTitle");
		notesImgBox.html('<span><img id="imgScaleZoom" src="/'+localStorage.getItem(App.NotesSnapImg.defaults.commentId)+'"></span>');
		App.UI.ImgDialog.bindScaleZoom();
		var domText = $('<div class="textBoxNotes">'+localStorage.getItem(App.NotesSnapImg.defaults.commentId+"_description")+'</div>');
		var mainHeader = $("#mainHeader");
		domText.css("top",mainHeader.height());
		mainHeader.append(domText);
		mainHeaderTitle.addClass('upIconBtn');
		if(App.NotesSnapImg.defaults.timeoutId){
			clearTimeout(App.NotesSnapImg.defaults.timeoutId);
		}
		if(App.NotesSnapImg.defaults.outTime){
			App.NotesSnapImg.defaults.timeoutId = setTimeout(function(){
				domText.fadeOut(function(){
					mainHeaderTitle.addClass('downIconBtn');
				});
			},2000)
		}
		mainHeaderTitle.on("click",function(evt){
			App.NotesSnapImg.defaults.outTime = false;
			if($(this).hasClass("downIconBtn")){
				domText.fadeIn();
				mainHeaderTitle.removeClass('downIconBtn');
			}else{
				domText.fadeOut();
				mainHeaderTitle.addClass('downIconBtn');
			}
		})
	},
}