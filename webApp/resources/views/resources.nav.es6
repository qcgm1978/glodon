/**
 * @require /resources/collection/resource.nav.es6
 */

App.ResourcesNav.App = Backbone.View.extend({

	el: $("#contains"),

	template: _.templateUrl("/resources/tpls/resources.app.html", true),


	render() {

		var _this = this;

		this.$el.html(new App.ResourceCrumbsNav().render().el);

		var type = App.ResourcesNav.Settings.type;
		var optionType = App.ResourcesNav.Settings.optionType;



		if (type == "standardLibs") {
			//获取标准模型库数据
			this.fetchStandardLibs();

		} else if (type == "famLibs") {
			//族库
			this.fetchFamLibs();

		} else if (type == "qualityStandardLibs") {
			//质量标准库
			this.$el.append(new App.ResourcesNav.QualityStandardLibs().render().el);

		} else if (type == "manifestLibs") {
			//清单库
			this.$el.append(new App.ResourcesNav.ManifestLibs().render().el);

		}else if(type == "artifactsMapRule" ||  type == "project"){

			//构件映射规则
			if(optionType){//映射规则/规则模板
				App.ResourceArtifacts.init(_this,optionType);
			}
			$("#pageLoading").hide();
		}
		this.bindScroll();
		return this;
	},
	//获取标准模型库数据
	fetchStandardLibs: function() {
		// this.$('.breadcrumbNav').append($('<div class="btns-flow stand">
		// <a target="_blank" href="http://vendor.wanda-dev.cn/mkh-uat/WfForms/CommonFormPartitioned.aspx?wfid=BIM_SMD001">标准模型研发指令</a>'
		// 	+'<a target="_blank" href="http://vendor.wanda-dev.cn/mkh-uat/WfForms/CommonFormPartitioned.aspx?wfid=BIM_SMA001">标准模型报审</a>'
		// 	+'<a target="_blank" href="http://vendor.wanda-dev.cn/mkh-uat/WfForms/CommonFormPartitioned.aspx?wfid=BIM_SMP001">标准模型发布</a>
		// 	</div>'));
		this.getModelLinkDataFun();//获取标准模型链接的方法
		//标准模型库
		this.$el.append(new App.ResourcesNav.StandardLibs().render().el);
		//重置 和 加载数据
		App.ResourcesNav.StandardLibsCollection.reset();
		var that = this;
		App.ResourcesNav.StandardLibsCollection.fetch({
			data: {
				pageIndex: App.ResourcesNav.Settings.pageIndex,
				pageItemCount: App.Comm.Settings.pageItemCount
			},
			success: function(collection, response, options) {
				$("#pageLoading").hide();
				var $standardLibs = $("#standardLibs"),
					$standarPagination, pageCount = response.data.totalItemCount;
				//todo 分页

				$standarPagination = $standardLibs.find(".standarPagination");
				let contents = App.Local.getTotalStr(pageCount, 'source-model.sm');
				$standardLibs.find(".sumDesc").html(contents);

				$standarPagination.pagination(pageCount, {
					items_per_page: response.data.pageItemCount,
					current_page: response.data.pageIndex - 1,
					num_edge_entries: 3, //边缘页数
					num_display_entries: 5, //主体页数
					link_to: 'javascript:void(0);',
					itemCallback: function(pageIndex) {
						//加载数据
						App.ResourcesNav.Settings.pageIndex = pageIndex + 1;
						that.onlyLoadStandardLibsData();
					},
					prev_text: (App.Local.data['system-module'].Back || "上一页"),
					next_text: (App.Local.data['source-model'].nt || "下一页")

				});
			}
		});
	},
	//获取标准模型链接的方法
	getModelLinkDataFun:function(){
		var _this = this;
		var pdata = {
            URLtype: "relLink",
            data:{
                type:2
            }
        };
        App.Comm.ajax(pdata,function(response){
        	var divBox = $('<div class="btns-flow stand"></div>');
        	var html = '';
        	if(response.code==0){
        	    // debugger;
        		for(var i=0,len=response.data.length-1;i<=len;i++){
        			html+='<a target="_blank" href="'+response.data[i].url+'">'+response.data[i].name+'</a>'
        		}
        		divBox.append(html);
        		_this.$('.breadcrumbNav').append(divBox);
        	}
        });
	},
	//只是加载数据
	onlyLoadStandardLibsData: function() { 
		App.ResourcesNav.StandardLibsCollection.reset();
		App.ResourcesNav.StandardLibsCollection.fetch({
			data: {
				pageIndex: App.ResourcesNav.Settings.pageIndex,
				pageItemCount: App.Comm.Settings.pageItemCount
			}
		});
	},

	//获取族库数据
	fetchFamLibs: function() {
		// this.$('.breadcrumbNav').append($('<div class="btns-flow"><a target="_blank" href="http://vendor.wanda-dev.cn/mkh-uat/WfForms/CommonFormPartitioned.aspx?wfid=BIM_FD001">族库研发指令</a>'
		// 	+'<a target="_blank" href="http://vendor.wanda-dev.cn/mkh-uat/WfForms/CommonFormPartitioned.aspx?wfid=BIM_FA001">族库报审</a>'
		// 	+'<a target="_blank" href="http://vendor.wanda-dev.cn/mkh-uat/WfForms/CommonFormPartitioned.aspx?wfid=BIM_FP001">族库发布</a></div>'));
		this.getFamlibsLinkDataFun();//获取族库链接的方法
		//标准模型库
		this.$el.append(new App.ResourcesNav.FamLibs().render().el);
		//重置 和 加载数据
		App.ResourcesNav.FamLibsCollection.reset();
		var that = this;
		App.ResourcesNav.FamLibsCollection.fetch({
			data: {
				pageIndex: App.ResourcesNav.Settings.pageIndex,
				pageItemCount: App.Comm.Settings.pageItemCount
			},
			success: function(collection, response, options) {
				$("#pageLoading").hide();
				var $standardLibs = $("#famLibs"),
					$standarPagination, pageCount = response.data.totalItemCount;
				//todo 分页

				$standarPagination = $standardLibs.find(".standarPagination");
				let contents = App.Local.getTotalStr(pageCount, 'family-list.Fy');
                $standardLibs.find(".sumDesc").html(contents);

				$standarPagination.pagination(pageCount, {
					items_per_page: response.data.pageItemCount,
					current_page: response.data.pageIndex - 1,
					num_edge_entries: 3, //边缘页数
					num_display_entries: 5, //主体页数
					link_to: 'javascript:void(0);',
					itemCallback: function(pageIndex) {
						//加载数据
						App.ResourcesNav.Settings.pageIndex = pageIndex + 1;
						that.onlyLoadFamLibsData();
					},
					prev_text: (App.Local.data['system-module'].Back || "上一页"),
					next_text: (App.Local.data['source-model'].nt || "下一页")

				});
			}
		});
	},
	//获取族库链接的方法
	getFamlibsLinkDataFun:function(){//获取族库链接的方法
		var _this = this;
		var pdata = {
            URLtype: "relLink",
            data:{
                type:3
            }
        };
        App.Comm.ajax(pdata,function(response){
        	var divBox = $('<div class="btns-flow"></div>');
        	var html = '';
        	if(response.code==0){
        		for(var i=0,len=response.data.length-1;i<=len;i++){
        			html+='<a target="_blank" href="'+response.data[i].url+'">'+response.data[i].name+'</a>'
        		}
        		divBox.append(html);
        		_this.$('.breadcrumbNav').append(divBox);
        	}
        });
	},
	onlyLoadFamLibsData: function() {
		App.ResourcesNav.FamLibsCollection.reset();
		App.ResourcesNav.FamLibsCollection.fetch({
			data: {
				pageIndex: App.ResourcesNav.Settings.pageIndex,
				pageItemCount: App.Comm.Settings.pageItemCount
			}
		});
	},

	bindScroll() {
		this.$el.find(".standarBodyScroll").mCustomScrollbar({
			set_height: "100%",
			set_width: "100%",
			theme: 'minimal-dark',
			axis: 'y',
			keyboard: {
				enable: true
			},
			scrollInertia: 0
		});
	}

});