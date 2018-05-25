App.GlyjPage = {
	defaults:{
		name:"",
		hrefstr:"",
	},
	init : function(arge){
		var self = this;
		App.GlyjPage.defaults.name = arge.name;
		App.GlyjPage.defaults.index = arge.index?arge.index:0;
		this.initHandle();//初始化页面事件方法
		$(function(){
			self.initEventHandle();//初始化管理手册下载方法
		})	
	},
	initHandle:function(){//初始化页面事件方法
		App.TitleBar.setTitle("管理依据");//设置顶部标题
		App.TitleBar.hidePopMenuBtn();//隐藏顶部三个点按钮
		App.TitleBar.showHomeBtn() //显示home图片
		App.TitleBar.returnCallback("#/flow");
		App.hideMainMenu();//隐藏底部导航栏
		$("#mainContainer").css("padding-bottom",0);
		if(!$("#footerBox > div").eq(2).hasClass("footer-box-select")){//底部导航的定位
			$("#footerBox > div").eq(2).click();
		}
		var tabContent = $("#tabContent");
		var tabNav = $("#tabNav");
		var glyj_dialog = $("#glyj_dialog");
		tabNav.find("span").eq(App.GlyjPage.defaults.index).addClass('selectSpan');
		tabNav.on("click","span",function(evt){
			var target = $(evt.target);
			target.siblings().removeClass("selectSpan").end().addClass('selectSpan');
			tabContent.find("div.contentListBox").siblings().css("display","none").end().eq(target.index()).css("display","block");
		})
		tabNav.find("span").eq(App.GlyjPage.defaults.index).click();
		glyj_dialog.on("click",function(evt){
			var dialogText = "";
			if(App.defaults.outer){
				dialogText = "制度详情，请联系万达人员获取";
			}else{
				dialogText = "请至集团app“制度”功能模块中查阅";
			}
			var Dlg = App.UI.Dialog.showMsgDialog({
				title:'温馨提示',
				text:dialogText,
				titleColor:"#333",
				css:{
					"line-height":"0.5333rem",
					"font-size":"0.3733rem",
					"text-align":"center"
				},
				okText:'我知道了',
				onok:function(){
					
				},
			})
			$(Dlg.dialog).find(".commDialogCancel").css("display","none");
			$(Dlg.dialog).find(".commDialogOk").css("width","100%");
		})
	},
	initEventHandle:function(){//初始化管理手册下载方法
		var self = this;
		var glscId = $("#glscId");
		var osStr = navigator.userAgent;
		var isAndroid = osStr.indexOf('Android') > -1 || osStr.indexOf('Adr') > -1; //android终端
		var isiOS = !!osStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		glscId.on("click",function(evt){
			var downloadUrl = location.origin+"/mobile/images/flow/"+encodeURIComponent("BIM总发包操作手册.zip");
			var downloadName = "BIM总发包操作手册.zip";
			var type = ".zip";
			if(!isAndroid && isiOS){
				cordova.exec(self.onSuccessMoreUplaod, self.onFail, "WDWebViewOpenTypePlugin", "canOpenFile", [type]);
			}else{
				self.downloadImgHandle(downloadUrl,downloadName);
			}
			return false;
		})
	},
	downloadImgHandle:function(downUrl,name){
		var tipText = "下载完成，请到手机系统OA_downLoad里查看";
		var fileTransfer = new FileTransfer();
		fileTransfer.download(downUrl,name,function(entry){
			var Dlg = App.UI.Dialog.showMsgDialog({
				title: "提示",
				text: tipText,
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
				
			},
			fileName:name
		})
	},
	onSuccessMoreUplaod:function(evt){
		if(evt == "您提供的文件类型不能被打开"){
			var Dlg = App.UI.Dialog.showMsgDialog({
				title: "提示",
				text: "暂不支持该文件格式,无法打开",
				okText: "确定",
				onok: function() {
					
				},
			});
			$(Dlg.dialog).find(".commDialogCancel").css("display","none");
			$(Dlg.dialog).find(".commDialogOk").css("width","100%");
		}else{
			cordova.exec(function () {}, function () {}, "WDNaviPlugin", "hiddenNavi",  ["0"]);
			location.href = App.GlyjPage.defaults.hrefstr;
		}
	},
	onFail:function(evt){
		
	},
}