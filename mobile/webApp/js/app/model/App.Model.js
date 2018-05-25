/*
write by wuweiwei

templateUrl:tpls/flow/flowList.html
*/

App.Model = {
	init : function(args){
		this.args = args;
		if(this.args.actionName == "resourceFamilyLibraryList"){
			App.defaults.familyObj = true;
		}else{
			App.defaults.familyObj = undefined;
		}
		App.Comm.preLoadImages([
			"images/model/filterD.png",
			"images/model/attrD.png",
			"images/model/hideD.png",
			"images/model/gridD.png",
			"images/model/moreD.png",
			"images/model/zlock.png"
		]);
		var chageName = App.replaceXingHaoHandle(args.fileName);
		App.TitleBar.setTitle(chageName);
		if(location.href.indexOf("myNews")>0||location.href.indexOf("message")>0){
			App.TitleBar.returnCallback(function() {
				if(App.defaults.notesDetailsObj){
	                App.defaults.notesDetailsObj = undefined;
	            }
	            if(App.defaults.maxCommentNumber){
	                App.defaults.maxCommentNumber = undefined;
	            }
	            if(App.defaults.maxNumPos || App.defaults.maxNumPos==0){
	                App.defaults.maxNumPos = undefined;
	            }
				history.back();
			});
		}else{
			this.gotoBack();
		}
		
		this.setTitleBar();
		this.showModel(args);
	},
	showModel : function(args){
		console.log("args:",args);
		$("#viewBox").css("display","block");
		var bimView = new window.BimView({//开始初始化模型
			container : $('#model')[0],
			etag : args.modelId,
			projectId : args.projectId,
			projectVersionId : args.projectVersionId,
			projectName : args.projectName,
			modelId : args.modelId,
			fileName : args.fileName,
			folderId : args.folderId
		});
		App.bimView=bimView;
    	document.getElementById("textNotes").focus();
	},
	setTitleBar : function(){
		var th = this;
		if(this.args.actionName!="resourceModelLibraryList")
		{
			App.TitleBar.showPopMenuBtn("model",function(e){
				var noteslink = "#/notesList/:projectId/:projectVersionId/:name/?t=32133&returnpage=viewModel";
				if($(this).attr("name")=="gotoHome")
				{
					location.href = "#/index";
				}
				else if($(this).attr("name")=="commentList")
				{
					if(App.defaults.notesObj){
						App.defaults.notesObj = undefined;
					}
					noteslink = noteslink.replace(":projectId",th.args.projectId);
					noteslink = noteslink.replace(":projectVersionId",th.args.projectVersionId);
					noteslink = noteslink.replace(":name",th.args.projectName);
					location.href = noteslink;
				}
			});			
		}
		else
		{
			App.TitleBar.showHomeBtn();
		}
	},
	gotoBack : function(href){
		App.TitleBar.setTitle(App.replaceXingHaoHandle(this.args.fileName));this.args.fileName
		App.TitleBar.showPopMenuBtn();
		clearInterval(App.Model.timeId);
		if(href==undefined){
			App.TitleBar.returnCallback(function(){
				if(App.defaults.notesDetailsObj){
				    App.defaults.notesDetailsObj = undefined;
				}
				if(App.defaults.maxCommentNumber){
				    App.defaults.maxCommentNumber = undefined;
				}
				if(App.defaults.maxNumPos || App.defaults.maxNumPos==0){
				    App.defaults.maxNumPos = undefined;
				}
				history.back();
			});
			return;
			if(this.args.actionName=="notesImg"){
				var link = "#/notesImg/:projectId/:projectVersionId/:projectName/:folderId/:fileName/:modelId/:paramA/:paramB";
				link = link.replace(":projectId",this.args.projectId);
				link = link.replace(":projectVersionId",this.args.projectVersionId);
				link = link.replace(":projectName",this.args.projectName);
				link = link.replace(":folderId",this.args.folderId);
				link = link.replace(":fileName",this.args.fileName);
				link = link.replace(":modelId",this.args.modelId);
				link = link.replace(":paramA",this.args.paramA);
				link = link.replace(":paramB",this.args.paramB);
				App.TitleBar.returnCallback(link);
			}else if(this.args.actionName=="notesDetails"){
				var link = "#/notesDetails/:projectId/:projectVersionId/:projectName/:folderId/:paramA/:paramB";
				link = link.replace(":projectId",this.args.projectId);
				link = link.replace(":projectVersionId",this.args.projectVersionId);
				link = link.replace(":projectName",this.args.projectName);
				link = link.replace(":folderId",this.args.folderId);
				link = link.replace(":paramA",this.args.paramA);
				link = link.replace(":paramB",this.args.paramB);
				App.TitleBar.returnCallback(link);
			}
			App.TitleBar.returnCallback(function(){
				if(App.defaults.notesDetailsObj){
	                App.defaults.notesDetailsObj = undefined;
	            }
	            if(App.defaults.maxCommentNumber){
	                App.defaults.maxCommentNumber = undefined;
	            }
	            if(App.defaults.maxNumPos || App.defaults.maxNumPos==0){
	                App.defaults.maxNumPos = undefined;
	            }
	            location.href = location.hash.replace("viewModel",this.args.actionName);
			});
		}else{
			App.TitleBar.returnCallback(function(){
				if(App.defaults.notesDetailsObj){
	                App.defaults.notesDetailsObj = undefined;
	            }
	            if(App.defaults.maxCommentNumber){
	                App.defaults.maxCommentNumber = undefined;
	            }
	            if(App.defaults.maxNumPos || App.defaults.maxNumPos==0){
	                App.defaults.maxNumPos = undefined;
	            }
				location.href = href
			});
		}
	},
	gotoModel : function($node){
		var th = this;
		App.TitleBar.returnCallback(function(){
			$node.hide();
			clearInterval(App.Model.timeId);
			App.TitleBar.setTitle(th.args.fileName);
		},function(){
			th.gotoBack.call(th);
		});
	}
}