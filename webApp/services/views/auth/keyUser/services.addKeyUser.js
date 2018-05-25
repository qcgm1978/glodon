App.Services.addKeyUser = Backbone.View.extend({

  tagName: "div",

  className: "serviceWindow",

  template: _.templateUrl("/services/tpls/auth/keyUser/services.addKeyUser.html"),

  events: {
    "click .windowClose": "close",
    "click #select": "move",
    "click .up": 'toUpStep',
    "click .next": 'toNextStep',
    "click .confirm": 'confirm',
    "click .rightWindow .delete": 'remove',
    "click .rightWindow .proj-remove": 'remove2',
    "click .search span": 'search',
    "keypress .search input": 'keyup',
    "click .search .closeicon": 'clear',
    "click .partition a": 'partition'

  },

  render: function(step) {
    this.$el.html(this.template());
    if (step) {
      $('.steps .active').removeClass('active');
      if (step == 'edit') {
        //编辑项目
        setTimeout(function() {
          $('.leftWindow').siblings('p').text("请选择" + (App.Services.KeyUser.mode == 2 ? "分区" : ""));
          $('.search input').attr('placeholder', '请输入要搜索的项目名称');

        }, 100);
        this.$el.find('.maintitle').text('项目权限');
        this.$el.find('.up').hide();
        this.$el.find('.steps').hide();
        this.$el.find('.confirm').show();
        this.$el.find('.next').hide();
        this.$el.find('.leftWindow').html(new App.Services.step2().render().el);
        this.$el.find('.partition a').eq(App.Services.KeyUser.fakedata.authType - 1).trigger('click');

        $.ajax({
          //url: "platform/auth/user/"+App.Services.KeyUser.fakedata.user.userId+"/dataPrivilege/project?type=2"
          url: "platform/auth/project?type=3"
        }).done(function(datas) {
          if (datas && !datas.code && datas.data) {

            App.Services.KeyUser.Step2.reset(datas.data);
            App.Services.KeyUser.Step2.trigger('add');
          }
        });

        //App.Services.KeyUser.loadData(App.Services.KeyUser.Step2, '', function(r){
        //
        //  if(r && !r.code && r.data){
        //    _.each(r.data.items, function(data, index){
        //      data.shut    = true;
        //      data.canLoad = true;
        //    });
        //    App.Services.KeyUser.Step2.set(r.data.items);
        //  }
        //});
        //遍历本身存在的项目数据添加到右边窗口
        App.Services.KeyUser.mode = App.Services.KeyUser.fakedata.authType;
        var str = '',
          projs = App.Services.KeyUser.fakedata.project,
          pid = App.Services.KeyUser.editpid = [];
        if (App.Services.KeyUser.mode == 1) {
          for (var i = 0; i < projs.length; i++) {
            var p = projs[i];
            pid.push(p['id']);
            str += "<li class='proj-right' data-id=" + p['id'] + "><i class='proj-remove'></i>" +
              "<h3 data-id=" + p['id'] + ">" + p['name'] + "</h3>" +
              "<p>" + (p['province'] || '') + "<span></span></p>" +
              "</li>";
          }
          App.Services.KeyUser.pid = pid;
          this.$el.find('.rightWindow').html('<div>' + str + '</div>').siblings('p').text("已选择");

        } else if (App.Services.KeyUser.mode == 2 && App.Services.KeyUser.fakedata.area) {
          projs = App.Services.KeyUser.fakedata.area;
          for (var i = 0; i < projs.length; i++) {
            var p = projs[i],
              id = (p == "中区" ? 9991 : (p == "南区" ? 9992 : 9993));
            pid.push(id);
            str += "<li class='proj-right list' data-id=" + id + "><i class='proj-remove'></i><h3 data-id=" + id + ">" + p + "</h3>";

          }
          App.Services.KeyUser.partid = pid;
          this.$el.find('.rightWindow').html('<div>' + str + '</div>').siblings('p').text("已选择");

        } else if (App.Services.KeyUser.mode == 3) {
          this.$el.find('.rightWindow').html('<div></div>').siblings('p').text("已选择");
          $('.step2').css({
            background: "#ccc"
          });

        }
      } else if (step == 'org') {
        //编辑部门
        this.$el.find('.maintitle').text('部门权限');
        setTimeout(function() {
          $('.leftWindow').siblings('p').text("请选择部门");
        }, 100);
        this.$el.find('.up').hide();
        this.$el.find('.steps').hide();
        this.$el.find('.confirm').show();
        this.$el.find('.next').hide();
        //this.$el.find('.leftWindow').html(new App.Services.step3().render().el);
        this.$el.find('.leftWindow').html(new App.Services.step1().render('step3').el);
        this.$el.find('.leftWindow').append(new App.Services.step3().render().el);
        App.Services.KeyUser.loadData(App.Services.KeyUser.Step1, '', function(r) {
          if (r && !r.code && r.data) {
            _.each(r.data.org, function(data, index) {
              data.shut = true;
              data.canLoad = true;
            });
            App.Services.KeyUser.Step1.set(r.data.org);
          }
        });
        App.Services.KeyUser.loadData(App.Services.KeyUser.Step3, '', function(r) {
          if (r && !r.code && r.data) {
            _.each(r.data.org, function(data, index) {
              data.shut = true;
              data.canLoad = true;
            });
            App.Services.KeyUser.Step3.set(r.data.org);
          }
        });
        //遍历本身存在的部门数据添加到右边窗口
        var str = '',
            orgs = App.Services.KeyUser.fakedata.org,
            orgid = App.Services.KeyUser.editorgId = [];
        for (var i = 0; i < orgs.length; i++) {
          var p = orgs[i];
          orgid.push(p['orgId']);
          str +=  " <li>" +
                    "<span class='delete'></span>" +
                    "<p class='shut mulu' data-id=" + p['orgId'] + " data-canload='true'>" +
                    "<i></i><span class='isspan'>" + p['name'] + "</span>" +
                    "</p>" +
                    "<ul class='shut'></ul>" +
                  "</li>";
        }
        App.Services.KeyUser.orgId = orgid;
        this.$el.find('.rightWindow').html('<div>' + str + '</div>').siblings('p').text("已选部门");
      } else if (step == 'fam') {
        //编辑族库
        this.$el.find('.maintitle').text('族库权限');
        setTimeout(function() {
          $('.leftWindow').siblings('p').text("请选择族库");
        }, 100);

        this.$el.find('.confirm').show();

        this.$el.find('.leftWindow').html(new App.Services.fam().render().el);

        $.ajax({
          //url: "platform/auth/user/"+App.Services.KeyUser.fakedata.user.userId+"/dataPrivilege/project?type=2"
          url: "platform/auth/project?type=2"
        }).done(function(datas) {
          if (datas && !datas.code && datas.data) {

            App.Services.KeyUser.fam.reset(datas.data);
            App.Services.KeyUser.fam.trigger('add');
          }
        });


        //遍历本身存在的部门数据添加到右边窗口
        var str = '',
          orgs = App.Services.KeyUser.fakedata.family,
          orgid = App.Services.KeyUser.editorgId = [];
        for (var i = 0; i < orgs.length; i++) {
          var p = orgs[i];
          orgid.push(p['id']);
          str += "<li class='proj-right' data-id=" + p['id'] + "><i class='proj-remove'></i>" +
            "<h3 data-id=" + p['id'] + ">" + p['name'] + "</h3>" +
            "<p>" + (p['designUnit'] || ' ') + "<span>" + new Date(p['createTime']).Format("yyyy-MM-dd") + "</span></p>" +
            "</li>";

        }
        App.Services.KeyUser.pid = orgid;

        this.$el.find('.rightWindow').html('<div>' + str + '</div>').siblings('p').text("已选择");
      } else if (step == 'standard') {
        //编辑标准模型
        this.$el.find('.maintitle').text('标准模型权限');
        setTimeout(function() {
          $('.leftWindow').siblings('p').text("请选择标准模型");
        }, 100);

        this.$el.find('.confirm').show();

        this.$el.find('.leftWindow').html(new App.Services.standard().render().el);

        $.ajax({
          //url: "platform/auth/user/"+App.Services.KeyUser.fakedata.user.userId+"/dataPrivilege/project?type=2"
          url: "platform/auth/project?type=1"
        }).done(function(datas) {
          if (datas && !datas.code && datas.data) {

            App.Services.KeyUser.standard.reset(datas.data);
            App.Services.KeyUser.standard.trigger('add');
          }
        });


        //遍历本身存在的部门数据添加到右边窗口
        var str = '',
          orgs = App.Services.KeyUser.fakedata.model,
          orgid = [];
        for (var i = 0; i < orgs.length; i++) {
          var p = orgs[i];
          orgid.push(p['id']);
          str += "<li class='proj-right' data-id=" + p['id'] + "><i class='proj-remove'></i>" +
            "<h3 data-id=" + p['id'] + ">" + p['name'] + "</h3>" +
            "<p>" + (p['designUnit'] || ' ') + "<span>" + new Date(p['createTime']).Format("yyyy-MM-dd") + "</span></p>" +
            "</li>";

        }
        App.Services.KeyUser.pid = orgid;

        this.$el.find('.rightWindow').html('<div>' + str + '</div>').siblings('p').text("已选择");
      } else if (step == 2) {
        if (App.Services.KeyUser.mode == 1 && App.Services.KeyUser.html2[0]) {
          $('.rightWindow').html(App.Services.KeyUser.html2[0]);
          $('.rightWindow').siblings('p').text("已选项目 ( " + App.Services.KeyUser.pid.length + "个 )");

        } else if (App.Services.KeyUser.mode == 2 && App.Services.KeyUser.parthtml[0]) {
          $('.rightWindow').html(App.Services.KeyUser.parthtml[0]);
          $('.rightWindow').siblings('p').text("已选分区 ( " + App.Services.KeyUser.partid.length + "个 )");

        } else {
          $('.rightWindow div').html('');
          $('.rightWindow').siblings('p').text("已选" + (App.Services.KeyUser.mode == 2 ? "分区 ( " : "项目 ( " + "0个 )"));

        }

        $('.steps div').eq(1).addClass('active');
        this.$el.find('.up').show();
        this.$el.find('.confirm').hide();
        this.$el.find('.next').show();
        this.$el.find('.leftWindow').html(new App.Services.step2().render().el).siblings('p').text("请选择" + (App.Services.KeyUser.mode == 2 ? "分区" : "项目"));

        App.Services.KeyUser.loadData(App.Services.KeyUser.Step2, '', function(r) {

          if (r && !r.code && r.data) {
            _.each(r.data.items, function(data, index) {
              data.shut = true;
              data.canLoad = true;
            });
            App.Services.KeyUser.Step2.set(r.data.items);
          }
        });
      } else {//step3
        $('.rightWindow').siblings('p').text("已选部门");
        $('.leftWindow').siblings('p').text("请选择部门");
        if (App.Services.KeyUser.html3[0]) {
          $('.rightWindow').html(App.Services.KeyUser.html3[0]);
        } else {
          $('.rightWindow div').html('');
        }
        $('.steps div').eq(2).addClass('active');
        this.$el.find('.up').show();
        this.$el.find('.confirm').show();
        this.$el.find('.next').hide();
        this.$el.find('.leftWindow').html(new App.Services.step1().render('step3').el);
        this.$el.find('.leftWindow').append(new App.Services.step3().render().el);

        App.Services.KeyUser.loadData(App.Services.KeyUser.Step1, '', function(r) {

          if (r && !r.code && r.data) {
            _.each(r.data.org, function(data, index) {
              data.shut = true;
              data.canLoad = true;
            });
            App.Services.KeyUser.Step1.set(r.data.org);
          }
        });
        App.Services.KeyUser.loadData(App.Services.KeyUser.Step3, '', function(r) {

          if (r && !r.code && r.data) {
            _.each(r.data.org, function(data, index) {
              data.shut = true;
              data.canLoad = true;
            });
            App.Services.KeyUser.Step3.set(r.data.org);
          }
        });
      }
    } else {
      //step1
      $('.steps .active').removeClass('active');
      $('.steps div').eq(0).addClass('active');
      $('.leftWindow').siblings('p').text("请选择成员");

      if (App.Services.KeyUser.html[0]) {
        $('.rightWindow').html(App.Services.KeyUser.html[0]);
        $('.rightWindow').siblings('p').text("已选成员 ( " + App.Services.KeyUser.uid.length + "个 )");
      } else {
        $('.rightWindow div').html('').siblings('p').text("已选项目 ( 0个 )");
      }
      //this.$el.find('.up').hide();
      this.$el.find('.confirm').show();
      this.$el.find('.leftWindow').html(new App.Services.step1().render().el);
      var getOuterUser = new Promise(function(resolve,reject){//获取外部用户
        App.Comm.ajax({
          URLtype: 'fetchServicesMemberOuterList'
        }, function(r) {
          if (r && !r.code && r.data) {
            _.each(r.data.org, function(data, index) {
              data.shut = true;
              data.canLoad = true;
            })
            resolve(r.data.org);
            // App.Services.KeyUser.Step1.set(r.data.org);
          }else{
            reject(false)
          }
        });
      })
      var getInnerUser = new Promise(function(resolve,reject){//获取内部用户
        App.Comm.ajax({
          URLtype: 'fetchServicesMemberInnerList'
        }, function(r) {
          if (r && !r.code && r.data) {
            _.each(r.data.org, function(data, index) {
              data.shut = true;
              data.canLoad = true;
            })
            resolve(r.data.org);
            // App.Services.KeyUser.Step1.set(r.data.org);
          }else{
            reject(false)
          }
        });
      })
      var getUserPromise = Promise.all([getInnerUser,getOuterUser]);
      getUserPromise.then(function(data){
        var orgArr= data[0].concat(data[1]);
        App.Services.KeyUser.Step1.set(orgArr);
      }).catch(function(data){
          $.tip({
              type: 'alarm',
              message: '获取数据失败'
          })
      })
      /*App.Comm.ajax({
        URLtype: 'fetchServicesMemberInnerList'
      }, function(r) {

        if (r && !r.code && r.data) {
          _.each(r.data.org, function(data, index) {
            data.shut = true;
            data.canLoad = true;
          })
          App.Services.KeyUser.Step1.set(r.data.org);
        }
      });*/
    }
    return this;
  },

  //移除已选中的名单
  remove: function(e) {

    var $li = $(e.target).parents('li'),
      title = this.$el.find('.maintitle').text();

    if (title == '部门权限') {
      //部门权限移除已选中的名单
      var orgId = $li.find('p').attr('data-id');
      App.Services.KeyUser.editorgId = _.without(App.Services.KeyUser.editorgId, parseInt(orgId), orgId.toString());

      App.Services.KeyUser.orgId = App.Services.KeyUser.editorgId;

    } else if (title == "新增关键用户") {
      //step1移除已选中的名单

      var uid = $li.find('p').attr('data-uid');
      App.Services.KeyUser.uid = _.without(App.Services.KeyUser.uid, parseInt(uid), uid.toString());

      $('.rightWindow').siblings('p').text("已选成员 ( " + App.Services.KeyUser.uid.length + "个 )");

      ////step3移除已选中的名单
      //
      //var orgId                  = $li.find('p').attr('data-id');
      //App.Services.KeyUser.orgId = _.without(App.Services.KeyUser.orgId,parseInt(orgId),orgId.toString());

    }
    //else{
    //  //step1移除已选中的名单
    //
    //  var uid                  = $li.find('p').attr('data-uid');
    //  App.Services.KeyUser.uid = _.without(App.Services.KeyUser.uid, parseInt(uid), uid.toString());
    //
    //  $('.rightWindow').siblings('p').text("已选成员 ( " + App.Services.KeyUser.uid.length + "个 )");
    //}
    $li.remove();
  },
  //step2移除已选中的名单
  remove2: function(e) {
    var $li = $(e.target).parent(),
      pid = $li.attr('data-id'),
      title = this.$el.find('.maintitle').text();
    $('.leftWindow').find('li[data-id=' + pid + ']').removeClass('selected-proj');
    $li.remove();
    if (title == '项目权限') {
      var mode = App.Services.KeyUser.mode;

      if (mode == 1) {
        App.Services.KeyUser.pid = _.without(App.Services.KeyUser.pid, parseInt(pid));
        App.Services.KeyUser.pid = _.without(App.Services.KeyUser.pid, pid.toString());
      } else {
        App.Services.KeyUser.partid = _.without(App.Services.KeyUser.partid, parseInt(pid));
        App.Services.KeyUser.partid = _.without(App.Services.KeyUser.partid, pid.toString());
      }
    } else {
      App.Services.KeyUser.pid = _.without(App.Services.KeyUser.pid, parseInt(pid));
      App.Services.KeyUser.pid = _.without(App.Services.KeyUser.pid, pid.toString());
    }



    $('.rightWindow').siblings('p').text("已选择");
  },
  //选择人到右边窗口
  move: function() {
    var str = '',
      title = this.$el.find('.maintitle').text();

    //step2或者编辑项目的时候
    if (title == '项目权限') {
      if (App.Services.KeyUser.mode == 3) {
        return ''
      } else if (App.Services.KeyUser.mode == 1) {
        this.$el.find('.leftWindow .selected-proj').each(function(el) {
          var pid = $(this).attr('data-id');
          if (_.contains(App.Services.KeyUser.pid, pid.toString()) || _.contains(App.Services.KeyUser.pid, parseInt(pid))) {
            return
          } else {
            App.Services.KeyUser.pid.push(pid);
            str += "<li class='proj-right' data-id=" + pid + "><i class='proj-remove'></i>" + $(this).html();

          }

        });
      } else {
        //step2分区模式
        this.$el.find('.leftWindow .selected-proj').each(function(el) {
          var pid = $(this).attr('data-id');
          if (_.contains(App.Services.KeyUser.partid, pid.toString()) || _.contains(App.Services.KeyUser.partid, parseInt(pid))) {
            return
          } else {
            App.Services.KeyUser.partid.push(pid);
            str += "<li class='proj-right list' data-id=" + pid + "><i class='proj-remove'></i>" + $(this).html();

          }

        });

      }

      this.$el.find('.rightWindow div').append(str);
      //$('.rightWindow').siblings('p').text("已选"+(App.Services.KeyUser.mode==2?"分区 ( ":"项目 ( ") + $(".rightWindow li").length + "个 )");

    } else if (title == '族库权限') {
      this.$el.find('.leftWindow .selected-proj').each(function(el) {
        var pid = $(this).attr('data-id');
        if (_.contains(App.Services.KeyUser.pid, pid.toString()) || _.contains(App.Services.KeyUser.pid, parseInt(pid))) {
          return
        } else {
          App.Services.KeyUser.pid.push(pid);
          str += "<li class='proj-right' data-id=" + pid + "><i class='proj-remove'></i>" + $(this).html();

        }
        console.log(str)
      });
      this.$el.find('.rightWindow div').append(str);
    } else if (title == '标准模型权限') {
      this.$el.find('.leftWindow .selected-proj').each(function(el) {
        var pid = $(this).attr('data-id');
        if (_.contains(App.Services.KeyUser.pid, pid.toString()) || _.contains(App.Services.KeyUser.pid, parseInt(pid))) {
          return
        } else {
          App.Services.KeyUser.pid.push(pid);
          str += "<li class='proj-right' data-id=" + pid + "><i class='proj-remove'></i>" + $(this).html();

        }
        console.log(str)
      });
      this.$el.find('.rightWindow div').append(str);
    } else if (title == '部门权限') {
      var $selected = this.$el.find('.toselected');
      if (!$selected.length) {
        return ''
      }
      var orgId = $selected.find('p').attr('data-id');
      if (_.contains(App.Services.KeyUser.orgId, orgId.toString()) || _.contains(App.Services.KeyUser.orgId, parseInt(orgId))) {
        return '';
      } else {
        App.Services.KeyUser.orgId.push(orgId);
        var person = $selected.html();
        $selected.removeClass('toselected');
        this.$el.find('.rightWindow div').append($('<li><span class="delete"></span>' + person + '</li>'));
      }

    } else {
      var $selected = this.$el.find('.toselected');
      var uid = $selected.find('p').attr('data-uid');
      if (_.contains(App.Services.KeyUser.uid, uid.toString()) || _.contains(App.Services.KeyUser.uid, parseInt(uid))) {
        return
      } else {
        App.Services.KeyUser.uid.push(uid);
        var person = $selected.html();
        $selected.removeClass('toselected');
        this.$el.find('.rightWindow div').append($('<li><span class="delete"></span>' + person + '</li>')).parent().siblings('p').text("已选成员 ( " + App.Services.KeyUser.uid.length + "个 )");
      }
    }
  },
  //刷新userinfo页面
  refresh: function() {
    App.Services.KeyUser.clearAll();
    var datas = {
      uid: App.Services.KeyUser.uuid
    };
    var data = {
      URLtype: "fetchServiceKeyUserInfo",
      type: "GET",
      data: JSON.stringify(datas)
    };
    App.Comm.ajax(data, function(data) {
      if (data.code == 0) {
        App.Services.KeyUser.fakedata = data.data;
        App.Services.KeyUser.view && App.Services.KeyUser.view.undelegateEvents();
        App.Services.KeyUser.view = new App.Services.userinfo().render();

      }

    });
  },
  //切换步骤页
  confirm: function() {
    var title = $('.maintitle').text();
    //编辑项目提交
    if (title == '项目权限') {
      App.Services.KeyUser.editpid = App.Services.KeyUser.pid;
      var datas = {
        "authType": parseInt(App.Services.KeyUser.mode),
        //"projectId": App.Services.KeyUser.pid,
        //"orgId": App.Services.KeyUser.editorgId,
        uid: App.Services.KeyUser.uuid
      };
      if (App.Services.KeyUser.mode == 2) {
        datas.area = [];
        (_.contains(App.Services.KeyUser.partid, 9991) || _.contains(App.Services.KeyUser.partid, '9991')) ? datas.area.push('中区'): '';
        (_.contains(App.Services.KeyUser.partid, 9992) || _.contains(App.Services.KeyUser.partid, '9992')) ? datas.area.push('南区'): '';
        (_.contains(App.Services.KeyUser.partid, 9993) || _.contains(App.Services.KeyUser.partid, '9993')) ? datas.area.push('北区'): '';
      } else if (App.Services.KeyUser.mode == 1) {
        datas.projectId = App.Services.KeyUser.pid || [];
      }
      var data = {
        URLtype: "fetchServiceKeyUserEdit",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(datas)
      };

      var self = this;
      $('#dataLoading').show();

      App.Comm.ajax(data, function(data) {
        $('#dataLoading').hide();

        if (data.code == 0) {
          App.Services.KeyUser.fakedata.authType = App.Services.KeyUser.mode;
          datas.area && (App.Services.KeyUser.fakedata.area = datas.area);
          $('.mod-dialog,.mod-dialog-masklayer').hide();
          self.refresh();
        }

      });

    } else if (title == '部门权限') {
      //编辑部门提交
      App.Services.KeyUser.editorgId = App.Services.KeyUser.orgId;
      var datas = {
        //"authType" : App.Services.KeyUser.fakedata.authType,
        "orgId": App.Services.KeyUser.orgId,
        //"projectId": App.Services.KeyUser.editpid,
        //"area"     : App.Services.KeyUser.fakedata.area,
        uid: App.Services.KeyUser.uuid
      };
      var data = {
        URLtype: "fetchServiceKeyUserEdit",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(datas)
      };
      var self = this;
      $('.leftWindow').addClass("services_loading");

      App.Comm.ajax(data, function(data) {
        $('.leftWindow').removeClass("services_loading");


        if (data.code == 0) {
          $('.mod-dialog,.mod-dialog-masklayer').hide();
          self.refresh();

        }

      });

    } else if (title == '族库权限') {
      //编辑族库提交
      App.Services.KeyUser.editorgId = App.Services.KeyUser.orgId;
      var datas = {

        "familyId": App.Services.KeyUser.pid,
        uid: App.Services.KeyUser.uuid
      };
      var data = {
        URLtype: "fetchServiceKeyUserEdit",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(datas)
      };
      var self = this;
      $('.leftWindow').addClass("services_loading");

      App.Comm.ajax(data, function(data) {
        $('.leftWindow').removeClass("services_loading");


        if (data.code == 0) {
          $('.mod-dialog,.mod-dialog-masklayer').hide();
          self.refresh();

        }

      });

    } else if (title == '标准模型权限') {
      //编辑标准模型提交
      App.Services.KeyUser.editorgId = App.Services.KeyUser.orgId;
      var datas = {

        "modelId": App.Services.KeyUser.pid,
        uid: App.Services.KeyUser.uuid
      };
      var data = {
        URLtype: "fetchServiceKeyUserEdit",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(datas)
      };
      var self = this;
      $('.leftWindow').addClass("services_loading");

      App.Comm.ajax(data, function(data) {
        $('.leftWindow').removeClass("services_loading");


        if (data.code == 0) {
          $('.mod-dialog,.mod-dialog-masklayer').hide();
          self.refresh();

        }

      });

    } else {
      //新增关键用户的提交
      if (!App.Services.KeyUser.uid.length) {
        alert('必须选择关键用户才能提交！');
        return
      }
      var datas = {
        "userId": App.Services.KeyUser.uid
      };


      var data = {
        URLtype: "fetchServiceKeyUserList",
        type: "POST",
        contentType: "application/json", //'Content-Type':"application/json",
        data: JSON.stringify(datas)
      };
      $('#dataLoading').show();

      App.Comm.ajax(data, function(data) {
        $('#dataLoading').hide();

        if (data.code == 0) {
          App.Services.KeyUser.addedUserIds = data.data.userId; /*add by wuweiwei 2017-2-15 function:获取添加的用户userId ,本字段为数组*/
          $('.mod-dialog,.mod-dialog-masklayer').hide();
          //刷新关键用户列表
          App.Services.KeyUser.loadData(App.Services.KeyUser.KeyUserList, '', function(r) {
            if (r && !r.code && r.data) {
              App.Services.KeyUser.KeyUserList.set(r.data);
              App.Services.KeyUser.userList = r.data;
              App.Services.KeyUser.HeightLightPage(App.Services.KeyUser.addedUserIds); /*高亮显示新加用户*/
            }
          });
          App.Services.KeyUser.clearAll();
        } else {
          alert('不能选择已是关键用户的用户')
        }

      });
    }
  }, //关闭窗口
  close: function() {

    $('.mod-dialog,.mod-dialog-masklayer').hide();
    App.Services.KeyUser.clearAll();
  },
  //step2 里的选择模式
  partition: function(event) {
    var $a = $(event.currentTarget);

    if ($a.hasClass('active')) {
      return ''
    } else {
      if (App.Services.KeyUser.mode == 1) {
        App.Services.KeyUser.html2[0] = $('.rightWindow').html();
      } else if (App.Services.KeyUser.mode == 2) {
        App.Services.KeyUser.parthtml[0] = $('.rightWindow').html();

      }
      var index = $a.attr('data-index');
      $a.addClass('active').siblings().removeClass('active');
      App.Services.KeyUser.mode = index;
      $('.rightWindow div').html('');

      if (index == 1) {
        //普通模式
        $('.rightWindow').html(App.Services.KeyUser.html2[0]);
        $('.leftWindow').siblings('p').text("请选择项目");
        this.$el.find('.leftWindow').html(new App.Services.step2().render().el);
        $('.search').show().siblings('p').hide();

      } else if (index == 2) {
        //分区模式
        $('.rightWindow').html(App.Services.KeyUser.parthtml[0]);
        $('.leftWindow').siblings('p').text("请选择分区");
        this.$el.find('.leftWindow').html(new App.Services.step2().render().el);
        $('.search').hide();
        $('.title').show();

      } else {
        //全选模式
        $('.step2').css({
          background: "#ccc"
        });
        $('.rightWindow div').html('已选择所有项目');
        $('.selected-proj').removeClass('selected-proj');

      }


    }
  },
  search: function() {
    var value = $('.search input').val().trim();
    if (value) {
      if ($('.maintitle').text() == "项目权限") {
        this.$el.find('.leftWindow').html(new App.Services.step2().render(value).el);
      } else {
        this.$el.find('.leftWindow').html(new App.Services.step1().render(value).el);

      }
    }
  },
  clear: function() {
    $('.search input').val('');
    if ($('.maintitle').text() == "项目权限") {
      this.$el.find('.leftWindow').html(new App.Services.step2().render().el);
    } else {
      this.$el.find('.leftWindow').html(new App.Services.step1().render().el);

    }
  },
  keyup: function(e) {
    if (e.keyCode == 13) {
      this.search();
    }
  },
  initialize: function() {
    App.Services.KeyUser.mode = 1;
  }

});