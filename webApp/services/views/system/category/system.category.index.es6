/**
 * @require /services/views/system/index.es6
 */


//列别管理
App.Services.System.CategoryManager = Backbone.View.extend({

	tagName: "div",

	className: "categoryManager",

	events: {
		"click .topBar .create": "addNewCategoryDialog"
	},

	//初始化
	initialize() {
		this.listenTo(App.Services.SystemCollection.CategoryCollection, "add", this.addOne);
		this.listenTo(App.Services.SystemCollection.CategoryCollection, "reset", this.resetList)
	},

	template: _.templateUrl('/services/tpls/system/category/system.category.index.html'),

	render() {

		this.$el.html(this.template);
		this.getList();
		return this;

	},

	//获取数据
	getList(){
		//重置
		App.Services.SystemCollection.CategoryCollection.reset();
		//获取数据
		App.Services.SystemCollection.CategoryCollection.fetch({
			success:function(models,data){
				this.$(".textSum .count").text(data.data.items.length);
			}
		});
	},

	//新增分类 弹出层
	addNewCategoryDialog() { 

		var dialogHtml = _.templateUrl('/services/tpls/system/category/system.add.category.html')({});

		var opts = {
			title: "新增业务类别",
			width: 601,
			isConfirm:false,
			isAlert:true,
			cssClass: "addNewCategoryDialog",
			message: dialogHtml,
			okCallback: () => {
				this.addNewCategory(dialog);
				return false;
			}

		}

		 var dialog=new App.Comm.modules.Dialog(opts);
	},

	//新增分类
	addNewCategory(dialog) {
		var $addNewCategoryDialog = $(".addNewCategoryDialog"),that=this,
			title = $addNewCategoryDialog.find(".txtCategoryTitle").val().trim(),
			desc = $addNewCategoryDialog.find(".txtCategoryDesc").val().trim();

		if (dialog.isSub) {
			return;
		}

		if (!title) {
			alert("请输入分类名称");
			return false;
		}

		if (!desc) {
			alert("请输入分类描述");
			return false;
		}

		var data={
			URLtype:"servicesAddCategory",
			type:"POST",
			data:{
				busName:title,
				busDesc:desc
			}
		}

		dialog.isSub=true;

		//新增
		App.Comm.ajax(data,function(data){
			if (data.code==0) {
				data.data.isAdd=true;
				App.Services.SystemCollection.CategoryCollection.push(data.data);
				dialog.close();
				var $count=that.$(".textSum .count");
				$count.text(+$count.text()+1);
			}
			
		}) 
	}, 

	//新增后处理
	addOne(model) {

		if (this.$el.closest("body").length<=0) {
			this.remove();
			return;
		}
		 
		//
		var viewr=new App.Services.System.CategoryListDetail({
			model:model
		});

		this.$(".categoryListBody").find(".loading").remove();

		if (model.toJSON().isAdd) {
			this.$(".categoryListBody").prepend(viewr.render().el);
		}else{
			this.$(".categoryListBody").append(viewr.render().el);
		}
		

		//绑定滚动条		
		App.Comm.initScroll(this.$(".categoryListBodScroll"),"y");

	},



	//重置加载
	resetList(){
		this.$(".categoryListBody").html('<li class="loading">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</li>');
	}


});