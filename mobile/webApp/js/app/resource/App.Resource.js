//@ sourceURL=App.Resource.js
App.Resource = {
	init : function(){
		App.defaults.SearchHeightVar = undefined;
		App.resetScrollData();//重置滚动的数据
		this.initHandle();//初始化资源首页
	},
	initHandle:function(){//初始化资源首页
		App.TitleBar.setTitle("万达筑云项目管理平台");
		App.TitleBar.hideHomeBtn();//隐藏顶部三个点按钮
		App.TitleBar.showClose();//隐藏顶部返回首页
		var zjbz_iconBtn = $("#zjbz_iconBtn");
		zjbz_iconBtn.on("click",function(evt){
			var dialogText = "相关质监标准，请至筑云项目管理平台PC端进行查看";
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
		});
		
		if(!$("#footerBox > div").eq(3).hasClass("footer-box-select")){
			$("#footerBox > div").eq(3).click();
		}
	},
}