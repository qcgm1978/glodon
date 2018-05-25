 
//项目基本设置
App.Services.ProjectBase=Backbone.View.extend({

	tagName:"div",


	template:_.templateUrl('/services/tpls/project/index.base.html',true),
	
	initialize(){
		this.listenTo(App.Services.ProjectCollection.ProjectBaseInfoCollection,'reset',this.render);
	},

	render(data){
		// var _html=_.template(this.template);
		var _data=data.toJSON()[0];
		this.$el.html(this.template(_data));
		$(".projectContainer .projectBase .baseItem").html(this.$el);
		
		$(".projectLogo").hover(function(){
			var _$label=$(this).find("label");
			_$label.stop(true);
			_$label.animate({
				bottom:'0'
			},500)
		},function(){
			var _$label=$(this).find("label");
			_$label.stop(true);
			_$label.animate({
				bottom:'-26px'
			},500)
		})
		
		this.$el.find("label").on("click",function(e){
			var imageUrl=$(this).attr("data-image");
			var view=new App.Services.ImageJcrop();
			App.Services.maskWindow=new App.Comm.modules.Dialog({title:'修改图片',width:600,height:500,isConfirm:false,message:view.render(imageUrl,_data.id).el});
		})
		
		return this;
	}

});