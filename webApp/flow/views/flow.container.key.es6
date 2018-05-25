App.Flow=App.Flow||{};
App.Flow.KeyView = Backbone.View.extend({
	tagName:"div",
	className:"flowContainer",
	template:_.templateUrl("/flow/tpls/flow.container.key.html"),

	render:function(){
		this.$el.html(this.template());
		this.$el.find(".flowTabNav").css("top","48px");
		this.getKeyData();//获取总包交钥匙的数据
		return this;
	},
	getKeyData(){//获取总包交钥匙的数据
		var _this = this;
		var data = {
			URLtype:"fetchKeyFlow",
			type:"get",
		}
		App.Flow.Controller.flowKeyCollection.fetch({
			data: data,
			success: function(collection, response, options) {
				if(response.code == 0){
					var flowContainerKey = $("#flowContainerKey");
					var data = response.data;
					if(data.length>0){
						for(var i=0,len=data.length;i<len;i++){
							var KeyViewDetail = new App.Flow.KeyViewDetail;
							flowContainerKey.append(KeyViewDetail.render(data[i]).el);
						}
						_this.getMKHLinkHandle();
					}
				}
			}
		})
	},
	getMKHLinkHandle(){
		App.Flow.Controller.flowNavFlowCollection.fetch({
			success: function(collection, response, options) {
				if(response.code == 0){
					var data = response.data;
					if(data.length>0){
						for(var i=0,len=data.length;i<len;i++){
							if(data[i].name == "模块化节点"){
								var domHtml = $('<div class="mkhjd_btn"><a href="'+data[i].url+'" target="_blank">' +
                                    (App.Local.data.source.Items || '模块化节点') +
                                    '</a></div> ')
								$(".flowListBox").eq(0).append(domHtml);  
							}
						}
					}
				}
			}
		})
		
	}
});
