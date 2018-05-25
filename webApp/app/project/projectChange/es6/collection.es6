App.Collections = {

	changeListCollection: new(Backbone.Collection.extend({

		model: Backbone.Model.extend({
			defaults: function() {
				return {
					title: ""
				}
			}
		}),

		urlType: "projectChangeList"


	})),
};


App.Views = {

	projectChangeListView: Backbone.View.extend({

		tagName: "div",

		className: "changeListBox",

		events: {
			//"click .mCSB_container": "showInModle"
		},

		//初始化
		initialize() {
			
			this.listenTo(App.Collections.changeListCollection, "add", this.addOne);
			this.listenTo(App.Collections.changeListCollection, "reset", this.resetData);
		}, 
		//渲染
		render() {
			this.$el.html('<div class="loadings">' +
                (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
                '</div>');
			$('.txtSearch').on('keydown',this.search);
			return this;
		},

		//返回数据渲染
		addOne(model) {
			var treeRoot = _.templateUrl('/app/project/projectChange/tpls/treeRoot.html');
			var treeNode = _.templateUrl('/app/project/projectChange/tpls/treeNode.html');
			var data = model.toJSON(); 
			data.treeNode = treeNode; 
			this.$el.html(treeRoot(data))

			this.$(".itemContent:even").addClass("odd");

			this.bindScroll();//绑定滚动条
		},

		//模型中显示
		showInModle(event) {
			if(!$(event.target).parent().hasClass('.repertoireName')){

				return
			}
			var that = this;
			var $target = $(event.target).closest(".itemContent"),
			    ids=$target.data("userId"),
			    box=$target.data("box");
			if ($target.hasClass("selected")) {
				that.cancelZoomModel();
				$target.removeClass("selected");
				return
			} else {
				this.$(".mCSB_container").find(".selected").removeClass("selected");
				$target.addClass("selected");
			}
			if (ids && box) {
				that.zoomToBox(ids,box);
				return;
			}
			var data = {
				URLtype: "fetchCostModleIdByCode",
				data: {
					projectId: App.Index.Settings.projectId,
					projectVersionId: App.Index.Settings.projectVersionId,
					fileVerionId: App.Index.Settings.differFileVersionId,
					costCode: $target.data("code")
				}
			};
			App.Comm.ajax(data, function(data) {
				if (data.code == 0) {
					console.log(data.data.boundingBox)
					if(data.data.boundingBox==null){
						return
					}
					var box=that.formatBBox(data.data.boundingBox);
					$target.data("userId", data.data.elements);
					$target.data("box", box);
					that.zoomToBox(data.data.elements,box);
				}
			});
		},

		resetData(){
			this.$el.html('<div class="loadings">' +
                (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
                '</div>');
		},
		
		//绑定滚动条
		bindScroll() {

			var $materialequipmentListScroll = this.$el;

			if ($materialequipmentListScroll.hasClass('mCustomScrollbar')) {
				return;
			}

			$materialequipmentListScroll.mCustomScrollbar({
				set_height: "100%",
				theme: 'minimal-dark',
				axis: 'y',
				keyboard: {
					enable: true
				},
				scrollInertia: 0
			});
		},

		search(e){
			if(e.keyCode==13){
				App.Collections.changeListCollection.reset();
				App.Collections.changeListCollection.projectId = App.Index.Settings.projectId;
				App.Collections.changeListCollection.projectVersionId =App.Index.Settings.projectVersionId;
				App.Collections.changeListCollection.fetch({
					data:{
						fileVerionId:App.Index.Settings.differFileVersionId,
						baseFileVerionId:App.Index.Settings.baseFileVersionId,
						keyword:$(e.currentTarget).val()
					},
					success:function(c,d,x){
						if(d.data.length<=0){
							$('.changeListBox ').html('<div class="loadings">暂无搜索结果</div>');
						}
					}
				});
			}
		},
		//转换bounding box数据
		formatBBox: function(data) {
			if (!data) {
				return [];
			}
			var box = [],
			    min = data.min,
			    minArr = [min.x, min.y, min.z],
			    max = data.max,
			    maxArr = [max.x, max.y, max.z];
			box.push(minArr);
			box.push(maxArr);
			return box;
		},

		zoomToBox:function(ids,box){

	        App.Index.Settings.Viewer.clearIsolate();
	        App.Index.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
	        App.Index.Settings.Viewer.zoomToBox(box);
	        App.Index.Settings.Viewer.setSelectedIds(ids);
	        //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, App.Project.Settings.Viewer.viewer);
	        App.Index.Settings.Viewer.setTranslucentUnselected();
	        App.Index.Settings.Viewer.clearSelection();
			App.Index.Settings.Viewer.highlight({
				type: 'userId',
				ids: ids
			});
		},

		//取消zoom
		cancelZoomModel: function() {
			App.Index.Settings.Viewer.translucent(false);

			App.Index.Settings.Viewer.ignoreTranparent({
				type: "plan",
				//ids: [code[0]]
				ids: undefined
			});
		}
	})

}