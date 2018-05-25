/**
 * @require /commNew/js/comm.es6 
 */


App.Comm.TreeViews = function(data, el) {

	var model = new(Backbone.Model.extend({
		defaults: data
	}));

	var treeView = new this.TreeViewDetail({
		model: model
	});

	if (el) {
		$(el).html(treeView.render().el);
	}

	return treeView.render().el;

}

App.Comm.TreeViews.prototype.TreeViewDetail = Backbone.View.extend({

	tagName: 'div',

	className: 'treeView',

	//代办
	events: {
		'click .already': 'already', //已办
		'click .commission': 'commission' //代办
	},

	//template: doT.template(_.get('comm/js/tpls/treeView.html')),

	render: function(data) {

		this.$el.html(App.Comm.TreeViews.prototype.treeRoot(this.model.toJSON())).attr("cid", this.model.cid);

		return this;

	}

});



App.Comm.TreeViews.prototype.treeRoot = function(it) {
	var sb = new StringBuilder();
	var trees = it.data.trees,
		item,
		treeCount = trees.length;
	sb.Append('<ul class="tree-view">');
	for (var i = 0; i < treeCount; i++) {
		sb.Append('<li class="rootNode" > ');
		item = trees[i];
		item.deep = 0;
		item.last = i == treeCount - 1;
		sb.Append(this.treeNode(item));
		sb.Append('</li>');
	}
	sb.Append('</ul>');
	return sb.toString();


}

App.Comm.TreeViews.prototype.treeNode = function(item) {

	var sb = new StringBuilder();

	var left=item.deep == 1 ? 24 : item.deep * 28;

	if (!item.last && item.deep > 0) {
		sb.Append('<div class="tliLine" ng-if="!$last && item.deep>0" style="left:'+left+'px;"></div> ');
	};

	if (!item.last && item.deep == 0) {
		sb.Append('<div class="tliLine" ng-if="!$last && item.deep==0"></div> ');
	};



	//内容
	sb.Append('<div class="item-content" ng-click="itemClick(item,$event)"> ');
	//最后一个垂直 非最后一个是li的line
	if (item.deep != 0 && item.last) {
		sb.Append('<span ng-if="item.deep!=0 && $last" class="hsLine" style="margin-left:' + left + 'px;"></span> ');
	};

	if (!item.last && item.deep != 0) {
		sb.Append('<span ng-if="!$last && item.deep!=0" class="vsLine" style="margin-left:' + left + 'px;"></span>   ');

	};

	if (item.last && item.deep != 0) {
		sb.Append('<span ng-if="$last && item.deep!=0" class="vsLine" style="margin-left:0px;"></span>');
	};

	if (item.children) {
		sb.Append('<span class="nodeSwitch" ng-if="item.children" ng-click="itemExpended($event)">+</span> ');
	} else {
		sb.Append('<span class="nodeSwitch" ng-if="!item.children" >-</span> ');
	}
	sb.Append('<input type="checkbox" class="check-box"> ');
	sb.Append('<span class="text-field">' + item.title + '</span> ');

	sb.Append('</div>');


	//递归
	if (item.children && item.children.length > 0) {
		sb.Append('<ul class="tree-view-sub">');

		var treeSub = item.children,
			treeSubCount = treeSub.length,
			subItem;

		for (var j = 0; j < treeSubCount; j++) {

			sb.Append('<li class="itemNode" > ');

			subItem = treeSub[j];
			subItem.last=j==treeSubCount-1;
			subItem.deep = item.deep + 1;
			sb.Append(this.treeNode(subItem));

			sb.Append('</li>');
		}


		sb.Append('</ul>');
	}

	return sb.toString();

}