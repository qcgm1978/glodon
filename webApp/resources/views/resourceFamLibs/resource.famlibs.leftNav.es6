//族库
App.ResourceFamLibs.leftNav = Backbone.View.extend({

	tagName: "div",

	id: "resourceFamlibsLeftNav",

	template: _.templateUrl("/resources/tpls/resourceFamLibs/resource.famlibs.leftNav.html", true),
 
	//渲染
	render: function(type) {

		this.$el.html(this.template);

		this.getfileTree();

		return this;
	},

	getfileTree: function() { 
// debugger;
		var data = {
			URLtype: "fetchFileTree",
			data: {
				projectId: App.ResourceModel.Settings.CurrentVersion.projectId,
				projectVersionId: App.ResourceModel.Settings.CurrentVersion.id
			}
		}
		var that = this;

		App.Comm.ajax(data, function(data) {

			data.click = function(event) {
				var file = $(event.target).data("file");
				if(file.folder){
					$('#navContainer .returnBack').removeClass('theEnd').attr('isReturn','1').html((App.Local.data.source['s-b'] || '返回上级'));
				}
				//清除搜索
				$("#navContainer").find(".clearSearch").hide().end().
				find(".btnNewFolder").show().end().
				find(".btnFileUpload").show().end().
				find(".btnFileState").show().end().
				find(".searchCount").hide();
				$("#txtFileSearch").val("");
				App.ResourceModel.Settings.searchText = "";
				
				//清空数据
				$("#resourceThumContent .thumContent").empty();
				App.ResourceModel.Settings.fileVersionId = file.fileVersionId;
				App.ResourceModel.FileThumCollection.reset();

				App.ResourceModel.FileThumCollection.fetch({
					data: {
						parentId: file.fileVersionId
					}
				});
			}
			data.iconType = 1;
			if (data.data) {
				var navHtml = new App.Comm.TreeViewMar(data);
				that.$el.find(".fileTree").html(navHtml);
				if(App.cb)App.cb();
				App.Comm.initScroll(that.$el.find(".fileTree"), "y"); 
			} else { 
				that.$el.find(".fileTree").html('<div class="loading">'+(App.Local.data['drawing-model'].Ndd||'无数据')+'</div>');
			} 

			$("#pageLoading").hide();

			that.setCurrentParent();

		});
	} , 

	setCurrentParent : function(){
		var $left = $("#resourceFamlibsLeftNav .treeViewMarUl");
		var $span = $left.find("span");
		if(App.ResourceModel.Settings.currentParentId==undefined)
		{
			return;
		}
		$span.each(function(index){
			if($(this).data("id")==App.ResourceModel.Settings.currentParentId)
			{
				$(this).addClass("selected");
				return;
			}
		});
	}

});