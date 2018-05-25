App.Comm.TreeViewMar = function(settings) {
 
	this.settings = settings;

	var treeView = this.TreeViewBuild();

	if (settings.el) {
		$(settings.el).html(treeView.render().el);
	}

	return treeView.render().el;

}

App.Comm.TreeViewMar.prototype.TreeViewBuild = function() {

	var that = this,
		settings = this.settings;

	// 放里面 解决作用域问题
	App.Comm.TreeViewMar.prototype.TreeViewDetail = Backbone.View.extend({

		tagName: 'div',

		className: 'treeViewMar',

		//代办
		events: {
			'click .nodeSwitch': 'nodeSwitch',  
			'click .text-field': 'itemClick',
			"click .ckSelect":"ckSelect"  
		},

		//template: doT.template(_.get('comm/js/tpls/treeView.html')),

		render: function(data) {

			this.$el.html(that.treeRoot(this.model.toJSON())).attr("cid", this.model.cid);

			return this;

		},
		//收起展开
		nodeSwitch: function(event) {
			var $el = $(event.target),
				switchStatus = $el.data('status');
			if (switchStatus) {
				$el.data("status", 0).removeClass('on').closest("li").children("ul").hide();
			} else {
				$el.addClass('on').data("status", 1).closest("li").children("ul").show();
			}
		},
		//点击单个
		itemClick: function(event) {
			$(".treeViewMarUl .selected").removeClass("selected");

			var $el = $(event.target);
			$el.addClass("selected");

			if ($.isFunction(that.settings.click)) {
				that.settings.click.apply(this,arguments);
			}

		},
		//复选框
		ckSelect:function(){
			var $el = $(event.target);
			$el.closest('li').find(".ckSelect").prop("checked",$el.prop("checked"));
		}
	});

	var model = new(Backbone.Model.extend({
		defaults: settings
	}));

	var treeView = new this.TreeViewDetail({
		model: model
	});

	return treeView;



}



App.Comm.TreeViewMar.prototype.treeRoot = function(it) {

	var sb = new StringBuilder();
	if (!it.data) {return;}
	var trees = it.data,
		item,
		treeCount = trees.length;

	sb.Append('<ul class="treeViewMarUl">');

	for (var i = 0; i < treeCount; i++) {

		sb.Append('<li class="rootNode" > ');
		item = trees[i];
		sb.Append(this.treeNode(item));
		sb.Append('</li>');
	}
	sb.Append('</ul>');
	return sb.toString();


}

App.Comm.TreeViewMar.prototype.treeNode = function(item) {

	var sb = new StringBuilder(),
		settings = this.settings,
		isCk = false,
		isIcon = false;

	//内容
	sb.Append('<div class="item-content"> ');

	if (item.children&&item.children.length>0) {
		sb.Append('<i class="nodeSwitch"></i> ');
	} else {
		sb.Append('<i class="noneSwitch"></i> ');
	}

	if (settings.iconType || item.iconType) {

		if (item.iconType) {
			sb.Append(App.Comm.TreeViewMar.treeNodeIcon(item.iconType));
		} else if (item.iconType != 0) {
			sb.Append(App.Comm.TreeViewMar.treeNodeIcon(settings.iconType));
		}
		isIcon = true;
	}

	if (settings.isCk || item.isCk) {
		if (item.isCk != 0) {
			isCk = true;
			sb.Append('<input type="checkbox" class="ckSelect" />');
		} 
	}


 

	var dataItem=$.extend({},item);
	delete dataItem.children;
	var itemString=JSON.stringify(dataItem); 
	sb.Append('<span class="text-field overflowEllipsis" data-id="'+item.id+'" data-file=\''+itemString+'\' title="'+item.name+'">' + item.name + '</span> ');

	sb.Append('</div>');


	//递归
	if (item.children && item.children.length > 0) {
		var mUl = "";
		if (isIcon && isCk) {
			mUl = "mIconAndCk";
		} else if (isIcon || isCk) {
			mUl = "mIconOrCk";
		} else {
			mUl = "noneIcon";
		}

		sb.Append('<ul class="treeViewSub ' + mUl + '">');

		var treeSub = item.children,
			treeSubCount = treeSub.length,
			subItem;

		for (var j = 0; j < treeSubCount; j++) {

			sb.Append('<li class="itemNode" > ');
			subItem = treeSub[j];
			subItem.iconType = item.iconType;
			subItem.isCk = item.isCk;
			sb.Append(this.treeNode(subItem));

			sb.Append('</li>');
		}


		sb.Append('</ul>');
	}

	return sb.toString();

}

App.Comm.TreeViewMar.treeNodeIcon = function(type) {
	var sb = "";
	if (type == 1) {
		sb = '<i class="folderIcon"></i>';
	} else if (sb == 2) {
		sb = '<i class="folderIcon photo"></i>';
	}
	return sb;
}