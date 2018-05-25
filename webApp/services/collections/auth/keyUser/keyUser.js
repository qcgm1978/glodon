/**
 * @require /services/collections/index.es6
 */

App.Services.KeyUser = {

  //暂存step2里选择的模式
  mode :1,
  //暂存被点击的关键用户信息的uid
  uuid : '',
  //暂存已被选关键用户的uid数组
  uid : [],

  //暂存已被选关键用户的项目ID数组
  pid : [],

  //暂存已被选关键用户的分区ID数组
  partid : [],

  //暂存已被选关键用户的orgId数组
  orgId : [],

  //暂存被编辑的关键用户的项目ID数组
  editpid : [],

  //暂存被编辑的关键用户的orgId数组
  editorgId : [],

  //暂存已被选关键用户分区的html
  parthtml : [],

  //暂存已被选关键用户step1的html
  html : [],

  //暂存已被选关键用户step2的html
  html2 : [],

  //暂存已被选关键用户step3的html
  html3 : [],

  userList:[],

  //清空暂存的数据
  clearAll: function(){
    this.uid   = [];
    this.pid   = [];
    this.orgId = [];
    this.html  = [];
    this.html2 = [];
    this.html3 = [];
    this.parthtml = [];
    this.partid = [];
  },

  /*add by wuweiwei 2017-2-15 高亮显示新加用户*/
  HeightLightPage : function(ids){
      var $list,i,j;
      $list = $(".keyUserList").find("li");
      for(i=0;i<ids.length;i++)
      {
          for(j=0;j<$list.length;j++)
          {
              if(ids[i]==$list[j].getAttribute("data-uid"))
              {
                  if(ids.length==1)
                  {
                      $($list[j]).trigger("click");
                  }
                  $list[j].className = ("active");
              }
          }
      }
  },

  loadData : function(collection,data,fn) {

    data = data || {};
    //collection.reset();
    collection.fetch({
      remove: false,
      data:data,
      success: function(collection, response, options) {
        if(fn && typeof fn == "function"){

          fn(response);
        }
      },
      error: function(collection, response, options) {
        if(fn && typeof fn == "function"){

          fn(response);
        }
      }
    });
  },

  ajax : function(data,cb){
    //是否调试
    if (App.API.Settings.debug) {
      data.url = App.API.DEBUGURL[data.URLtype];
    } else {
      data.url = App.API.Settings.hostname + App.API.URL[data.URLtype];
    }


    return $.ajax(data).done(function(data) {

      if (_.isString(data)) {
        // to json
        if (JSON && JSON.parse) {
          data = JSON.parse(data);
        } else {
          data = $.parseJSON(data);
        }
      }

      //未登录
      if (data.code == 10004) {

        window.location.href = data.data;
      }

      if ($.isFunction(callback)) {
        //回调
        callback(data);
      }

    });
  },

  KeyUserList : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),

    urlType: "fetchServiceKeyUserList"

  })),

  //keyuser infomation

  userinfo : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),

    urlType: "fetchServiceKeyUserList"

  })),

  AddKeyUser : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),


    urlType: "fetchServiceKeyUserList"

  })),
  Step1 : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),


    urlType: "fetchServicesMemberInnerList"

  })),

  Step3 : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),


    urlType: "fetchServicesMemberOuterList"

  })),

  Step2 : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),


    urlType: "fetchProjects"

  })),

  fam : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),


    urlType: "fetchServicesProjectMemberProjectList"

  })),


  standard : new(Backbone.Collection.extend({
    model : Backbone.Model.extend({
      defaults: function() {
        return {
          title: ""
        }
      }
    }),


    urlType: "fetchStandardLibs"

  })),
  init : function(){
    Date.prototype.Format = function (fmt) { //author: meizz
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },
  //状态是否正在请求服务器
  applying : false,


  fakedata:{}
};