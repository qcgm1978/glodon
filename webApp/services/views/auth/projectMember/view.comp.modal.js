/**
 * 视图组件对象、用于存储Backbone视图对象插件
 * 视图插件：
 * 
 * ViewComp.Modal 模块窗口视图插件 
 * 也是提示框插件、可以通过配置来自定义渲染
 * 
 * 模块窗口 :eg (new ViewComp.Modal).render({title:'自定义标题信息'}).append();
 * 提示会话框窗口  :eg (new ViewComp.Modal).render({title:'自定义标题信息',dialog:true}).append();
 * 相信配置查看render方法注释
 * 
 * @author 汪冰
 * @time 2016年5月1日18:16:10
 * 
 */
var ViewComp=ViewComp||{};

ViewComp.Modal= Backbone.View.extend({
	
	el: "#modalWrapper",
	
	
	confirmCallback:null,
	
	//modal 视图模块
	template: _.templateUrl('/services/tpls/auth/projectMember/modal.html'),
	
	events: {
		'click .closeIcon': 'closeView',
		'click .submit':'confirm'
	},
	
	/**
	 * 手动渲染视图
	 * 为了动态初始化配置数据、开放data参数
	 * 配置：
	 * title:模块化窗口标题
	 * width:视图宽度
	 * height:视图高度
	 * dialog:是否转成dialog样式
	 * @param {Object} data 
	 */
	render: function(data) {
		
		var _data=$.extend({},{title:'标题',dialog:false,width:0,height:0,confirm:function(){}},data)
		this.confirmCallback=_data.confirm;
		this.$el.append(this.template(_data))
		return this;
	},
	
	html:function(data){
		this.$el.find(".mwin-body").html(data);
	},
	//向Modal视图嵌套视图
	append: function(view) {
		if (view instanceof Backbone.View) {
			var _view = view.render();
			this.$el.find(".mwin-body").append(_view.el);
			_view.initView();
		}else{
			this.$el.find(".mwin-body").append(view);
		}
		return this;
	},
	//关闭Modal视图
	closeView: function() {
		this.$el.html("");
	},
	
	confirm: function(){
		this.confirmCallback();
		this.$el.find(".mwin-foot").hide();
	}
})