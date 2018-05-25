/*
write by wuweiwei

templateUrl:tpls/flow/flowList.html
*/

App.FamLibs = {
	init : function(args){
		var _this = this;
		this.args = args;
		$(function(){
			_this.gotoBack();
			_this.setTitleBar();
			_this.showModel(args);
		})
	},
	showModel : function(args){
		$("#viewBox").css("display","block");
		var famLibsView = new window.FamLibsView({
			container : $('#model')[0],
			etag : args.modelId,
			projectId : args.projectId,
			projectVersionId : args.projectVersionId,
			projectName : args.projectName,
			modelId : args.modelId,
			fileName : args.fileName,
			folderId : args.folderId
		});
	},
	setTitleBar : function(){
		App.TitleBar.setTitle("详情");
		App.TitleBar.showHomeBtn();
	},

	gotoBack : function(){
		var href = "#/resourceFamilyLibraryList/:projectId/:projectVersionId/:projectName/:folderId";
		href = href.replace(":projectId",this.args.projectId);
		href = href.replace(":projectVersionId",this.args.projectVersionId);
		href = href.replace(":projectName",this.args.projectName);
		href = href.replace(":folderId",this.args.folderId);
		App.TitleBar.returnCallback(href);
	},
	gotoModel : function($node){
		var th = this;
		App.TitleBar.returnCallback(function(){
			$node.hide();
		},function(){
			th.gotoBack.call(th);
		});
	}
}