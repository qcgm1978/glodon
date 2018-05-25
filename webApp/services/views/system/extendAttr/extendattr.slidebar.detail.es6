 
 //slideBar 详情
 App.Services.System.extendAttrSlideBarDetail=Backbone.View.extend({

 	tagName:"li",

 	className:"item",

 	 events:{
 	 	"click":"clickItem"
 	 },

 	 //渲染
 	render(){

 		var data=this.model.toJSON(),

 		html=_.template('<i class="border"></i><%=busName%>(<%=busCode%>)')(data);

 		this.$el.html(html).data("id",data.id);

 		return this;

 		
 	},

 	//点击单个
 	clickItem(event){ 

 		var $target= $(event.target).closest(".item"),id=$target.data("id");

 		$target.addClass("selected").siblings().removeClass("selected");

 		App.Services.SystemCollection.ExtendAttrCollection.reset();

 		App.Services.SystemCollection.ExtendAttrCollection.classKey=id;

 		App.Services.SystemCollection.ExtendAttrCollection.fetch({
 			success:function(models,data) {
 				 $(".systemContainer .folwContainer .textSum .count").text(data.data.length);
 			}
 		});
 	}


 });