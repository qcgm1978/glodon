//项目成员列表view
App.Services.projectMember.members = Backbone.View.extend({
	
  template: _.templateUrl('/services/tpls/auth/projectMember/members.html'),
  
  events:{
  },

  // 重写初始化
  initialize: function() {
		this.listenTo(App.Services.projectMember.projectMemberMemberCollection,'reset',this.render);
  },
  /**
   * 项目成员列表删除事件
   * @param {Object} event
   */
  del:function(event){
  		var _userId=event.currentTarget.getAttribute("data-user");
  		var _userName=event.currentTarget.getAttribute("data-userName");
  		var _opType=event.currentTarget.getAttribute("data-type");//对象类型：org,user
  		var _outer=event.currentTarget.getAttribute("data-outer");//是否是外网用户

  		App.Services.Dialog.alert("<span class='delTip'>确认要将'"+_userName+"'从"+unescape(unescape(App.Comm.getCookie("currentProjectName")))+"删除？</span>",function(_this){
  			App.Comm.ajax({
  				URLtype:'deleteServicesProjectMembers',
  				data:{
  					memberType:_opType,
  					userId:_userId,
  					outer:_outer,
  					privilegeId:App.Comm.getCookie('currentPid')
  				},
  				type:'delete'
  			},function(res){
  				_this.close();
  				$.tip({message:'删除成功',type:'success'});
    			if(res.message=="success"){
    				//$('#dataLoading').show();
    				App.Services.projectMember.loadData(App.Services.projectMember.projectMemberMemberCollection,{outer:App.Comm.user("outer")},{
						dataPrivilegeId:App.Comm.getCookie("currentPid")
					});
    			}
  			}).fail(function(){
  				
  			})
  		});
      $('.mod-dialog,.mod-dialog .wrapper .content').css('minHeight','auto');
  },

  render: function(items) {
  	var _this=this;
  	var data=App.Services.projectMember.method.model2JSON(items.models);
  	data={data:data};
    $("#memberlistWrap").html(this.$el.html(this.template(data)));
    //$("#memberlistWrap").find("span").css("color","#f00");
    this.viewPageForHeighLight();
    this.$('.remove').on('click',function(e){
    	_this.checkAuth(e);
    })
    $('#dataLoading').hide();
    clearMask();
    return this;
  },

  viewPageForHeighLight : function(){
      /*add by wuweiwei 2017-2-14 function:添加完用户后高亮显示*/
      var addedObject = App.Services.projectMember.addedObject;
      var i ,j , $memberList , addedList=[];
      if(addedObject==undefined || addedObject==null)
      {
          return;
      }
      $memberList = $("#memberlistWrap").find("#memberList").find("li");

      for(i=0;i<addedObject.inner.userId.length;i++)
      {
          addedList.push(addedObject.inner.userId[i]);
      }
      for(i=0;i<addedObject.inner.orgId.length;i++)
      {
          addedList.push(addedObject.inner.orgId[i]);
      }
      for(i=0;i<addedObject.outer.userId.length;i++)
      {
          addedList.push(addedObject.outer.userId[i]);
      }
      for(i=0;i<addedObject.outer.orgId.length;i++)
      {
          addedList.push(addedObject.outer.orgId[i]);
      }

      for(i=0;i<addedList.length;i++)
      {
          for(j=0;j<$memberList.length;j++)
          {
              if(addedList[i] == $memberList[j].getAttribute("id"))
              {
                  $memberList[j].style.backgroundColor = "#a8dbfd";
                  break;
              }
          }
      }
      App.Services.projectMember.addedObject = null;
  },

  checkAuth:function(event){
    var _this=this,
        data={},
        _userId=event.currentTarget.getAttribute("data-user"),
        _opType=event.currentTarget.getAttribute("data-type");

    if(_opType=='org'){
      data.orgId=_userId;
    }else{
      data.userId=_userId;
    }
    App.Comm.ajax({
      URLtype:'checkDelAuth',
      data:data
    },function(res){
      if(res.code==0){
        if(res.data.checkResult){
          _this.del(event);
        }else{
          $.tip({message:'没有权限',type:'alarm'})
        }
      }
    })
  }
});