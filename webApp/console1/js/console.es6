App.Console = {

  Settings: {
    type: 0,
    step: 0
  },

  init() {

    var Settings = App.Console.Settings;

    if (Settings.type && Settings.step) {
      //族库
      if (Settings.type == 1) {
        App.Console.fam();
      } else if (Settings.type == 2) {
        //标准模型库
        App.Console.standardModel();
      } else if (Settings.type == 3) {
        //创建项目
        App.Console.project();
      } else if (Settings.type == 4) {
        //项目变更
        App.Console.projectChange();
      } else if (Settings.type == 5) {
        App.Console.CostAccounting();
      } else if (Settings.type == 6) {
        App.Console.qualityMonitoring();
      } else if (Settings.type == 7) {
        App.Console.design();
      } else if (Settings.type == 8) {
        App.Console.cost();
      }

    } else {
      //主页面
      var tpl = _.templateUrl('/console1/tpls/console.html', true);
      $("#contains").html(tpl);
    }

  },
  fn: {},
  search() {
    var tpl = _.templateUrl('/console1/tpls/search.html', true);
    $("#contains").append(tpl);
    //remove
    $('#search_person').on('click', 'i', function(e) {
      $(e.target).parent().remove();
    });
    $('#search_person .btn').click(function(e) {
      var account = $('.wrap input').val();
      $.ajax({
        url: "platform/loginUser/console1/" + account
      }).done(function(data) {
        if (data.code == 0) {
          $('#results').html('').append('<li name=' + data.data.name + ' loginId=' + data.data.loginName + ' uId=' + data.data.userId + ' ondragstart="drag(event)" draggable="true">' + data.data.name + '</li>')
        }

      });
    });
    window.drop = function(e) {
      var loginId = e.dataTransfer.getData('loginId'),
        uId = e.dataTransfer.getData('uId'),
        name = e.dataTransfer.getData('name');
      $(e.currentTarget).append('<div draggable="true" ondragstart="drag(event)" class="name" name=' + name + ' uId=' + uId + ' loginId=' + loginId + '>' + name + '<i>X</i></div>')

    }
    $('.boxs').on('dragover', function(e) {
      e.preventDefault();
    })
    window.drag = function(ev) {
      console.log(ev)
      ev.dataTransfer.setData("loginId", ev.target.getAttribute('loginId'));
      ev.dataTransfer.setData("uId", ev.target.getAttribute('uId'));
      ev.dataTransfer.setData("name", ev.target.getAttribute('name'));
    }
  },
  getPerson(index) {
    var obj = {},
      arr = [],
      boxs = $('.boxs');
    if (index == 0) {
      var ele = boxs.eq(0).find('.name').eq(0);
      return {
        userId: ele.attr('uid'),
        loginId: ele.attr('loginid')
      };
    } else {

      var ele = boxs.eq(index).find('.name');
      console.log(ele)
      ele.each(function(index, ele) {
        arr.push({
          userId: $(ele).attr('uid'),
          loginId: $(ele).attr('loginid')
        })
      });
      return arr;
    }
  },
  ajaxPost(data, callback) {

    var stringData = JSON.stringify(data.data);

    $.ajax({
      url: data.url,
      data: stringData,
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST"
    }).done(function(data) {

      if ($.isFunction(callback)) {
        callback(data);
      }
    });
  }, //族库
  fam() {
    var tpl = _.templateUrl('/console1/tpls/fam/fam.html', true);
    $("#contains").html(tpl);
    this.search();
    $('textarea').hide();
    $.ajax({
      url: "platform/project?type=2&versionStatus=9&pageItemCount=100000"
    }).done(function(data) {

      var items = data.data.items,
        str = '';

      $.each(items, function(i, item) {
        if (item.version) {
          str += '<option versionid="' + item.version.id + '" value="' + item.projectNo + '">' + item.name + '</option>';
        }

      });
      $("#p11").html('<option value=""  data-i18n="data.drawing-model.Pst">请选择</option>' + str);
    });
    this.fn['4.3'] = function() {
      //获取族库审核审批单
      App.Console.auditSheet1(2, "#s31", 8);
    }

    //App.Console.auditSheet1(2, "#s41", 16);
    this.fn['4.5'] = function() {
      //获取族库发版审批单
      App.Console.auditSheet1(3, "#s51", 8);
    }

    //4.2
    this.fn['4.2'] = function() {
      $.ajax({
        url: "platform/api/family?status=3,6"
      }).done(function(data) {

        var items = data.data,
          str = '';

        $.each(items, function(i, item) {
          if (item.code) {
            str += '<option id="' + item.code + '">' + item.name + '</option>';
          }

        });
        $("#s21").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str);
      });
    }

    //4.4
    this.fn['4.4'] = function() {
      $.ajax({
        url: "platform/api/family?status=5,8"
      }).done(function(data) {

        var items = data.data,
          str = '';

        $.each(items, function(i, item) {
          if (item.code) {
            str += '<option id="' + item.code + '">' + item.name + '</option>';
          }

        });
        $("#s41").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str);
      });
    }


    $("#submit1").click(function() {
      var data = {
        "msgContent": JSON.stringify({
          "messageId": "411a109141d6473c83a86aa0480d6610",
          "messageType": "PLAN-1002",
          "timestamp": 1461142526786,
          "code": 0,
          "data": {
            "auditFinishTime": 1461140501424,
            "createTime": 1461140501424,
            "description": "描述",
            "designer": (App.Local.data['source-model'].db || "设计单位"),
            "developFinishDate": 1461140501452,
            "familyCode": $("#p13").val().trim(),
            "familyName": $("#p12").val().trim(),
            "refFamilyCode": $("#p11").val().trim(),
            "status": 16,
            "workflowId": parseInt(9999999 * Math.random()),
            "title": $("#p12").val().trim(),
            "initiator": App.Console.getPerson(0),
            "auditor": App.Console.getPerson(1),
            "confirmor": App.Console.getPerson(2),
            "receiver": App.Console.getPerson(3)
          }
        }),
        "msgCreateTime": 1461727280227,
        "msgId": "b2e5b467ef214f6196ac3f826017806e",
        "msgSendTime": 0,
        "srcMsgType": "PLAN-1002",
        "retryTimes": 0,
        "status": 0,
        "sysCode": "1"
      };
      var stringData = JSON.stringify(data);
      App.Console.post(stringData);

    });

    $("#submit2").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        //familyDevelopWorkflowId: $('#s21').val().trim(),
        familyCode: $('#s21 option:selected').attr('id').trim(),
        title: $("#p21").val().trim(),
        description: $("#p22").val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(1, 1003, data);
    });

    $("#submit3").click(function() {
      var data = {
        workflowId: $('#s31').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
          //title: $("#p31").val().trim()

      };
      App.Console.quest(2, 1004, data);

    });
    $("#submit33").click(function() {
      var data = {
        workflowId: $('#s31').val().trim(),
        status: 4,
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
          //title: $("#p31").val().trim()

      };
      App.Console.quest(2, 1004, data);

    });
    $("#submit4").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        //familyAprovalWorkflowId: $('#s41').val().trim(),
        familyCode: $('#s41 option:selected').attr('id').trim(),
        title: $("#p41").val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)

      };
      App.Console.quest(3, 1005, data);

    });
    $("#submit5").click(function() {
      var data = {
        workflowId: $('#s51').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(4, 1006, data);

    });
    $("#submit55").click(function() {
      var data = {
        workflowId: $('#s51').val().trim(),
        status: 4,
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)

      };
      App.Console.quest(4, 1006, data);

    });
  },
  standardModel() {
    var tpl = _.templateUrl('/console1/tpls/standardModel/standardmodel.html', true);
    $("#contains").html(tpl);
    this.search();
    $('textarea').hide();
    this.twoApply(1, 's11', 'p14', 9);
    $.ajax({
      url: "platform/project?type=2&versionStatus=9&pageItemCount=100000"
    }).done(function(data) {

      var items = data.data.items,
        str = '';

      $.each(items, function(i, item) {
        if (item.version) {
          str += '<option versionid="' + item.version.id + '" value="' + item.projectNo + '">' + item.name + '</option>';
        }

      });
      $("#s12").html('<option value=""  data-i18n="data.drawing-model.Pst">请选择</option>' + str);
    });
    //5.2
    this.fn['5.2'] = function() {
        $.ajax({
          //url: "platform/api/model"
          url: "platform/api/workflow/model?status=3,6"
        }).done(function(data) {

          var items = data.data,
            str = '';

          $.each(items, function(i, item) {
            if (item.code) {
              str += '<option id="' + item.code + '">' + item.name + '</option>';
            }

          });
          $("#s21").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
            $.ajax({
              //url: "platform/api/model/"+$(this).find('option:selected').attr('id')+"/version?status=3"
              url: "platform/api/model/" + $(this).find('option:selected').attr('id') + "/version?status=3,6"
            }).done(function(data) {

              var items = data.data,
                str = '';

              $.each(items, function(i, item) {
                if (item.id) {

                  str += '<option  value="' + item.id + '">' + item.name + '</option>';
                }

              });
              $("#s211").html(str);

            });
          });
        });
      }
      //5.4
    this.fn['5.4'] = function() {
      //5.4
      $.ajax({
        //url: "platform/api/model"
        url: "platform/api/workflow/model?status=5,8"

      }).done(function(data) {

        var items = data.data,
          str = '';

        $.each(items, function(i, item) {
          if (item.code) {
            str += '<option id="' + item.code + '">' + item.name + '</option>';
          }

        });
        $("#s41").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
          $.ajax({
            url: "platform/api/model/" + $(this).find('option:selected').attr('id') + "/version?status=5,8"
          }).done(function(data) {

            var items = data.data,
              str = '';

            $.each(items, function(i, item) {
              if (item.id) {

                str += '<option  value="' + item.id + '">' + item.name + '</option>';
              }

            });
            $("#s411").html(str);

          });
        });
      });
    }

    //获取研发标准模型指令审批单
    //App.Console.auditSheet1(4, "#s21", 16);

    //5.3
    this.fn['5.3'] = function() {
      //获取标准模型报审表单
      App.Console.auditSheet1(5, "#s31", 8);
    }

    //App.Console.auditSheet1(5, "#s41", 16);

    //5.5
    this.fn['5.5'] = function() {
      //获取标准模型发布表单
      App.Console.auditSheet1(6, "#s51", 8);
    }


    $("#submit1").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        refModelCode: $('#s11').val(),
        refModelVersionId: $('#p14').val(),
        refModelName: $('#s11 option:selected').text(),
        modelCode: $('#p11').val().trim(),
        modelName: $('#p12').val().trim(),
        modelVersionName: $('#p13').val().trim(),
        familyCode: $('#s12').val().trim(),
        familyName: $('#s12 option:selected').text().trim(),
        title: $("#p10").val().trim(),
        designer: $("#p15").val().trim(),
        description: $("#p16").val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)

      };
      App.Console.quest(1, 1007, data);

    });

    $("#submit2").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        //standardModelDevelopWorkflowId: $('#s21').val().trim(),
        modelCode: $('#s21 option:selected').attr('id').trim(),
        versionId: $('#s211').val().trim(),
        title: $("#p21").val().trim(),
        description: $("#p22").val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)

      };
      App.Console.quest(2, 1008, data);
    });

    $("#submit3").click(function() {
      var data = {
        //workflowId:parseInt(9999999*Math.random()),
        workflowId: $('#s31').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
          //title: $("#p31").val().trim()

      };
      App.Console.quest(3, 1009, data);

    });
    $("#submit33").click(function() {
      var data = {
        status: 4,
        workflowId: $('#s31').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
          //title: $("#p31").val().trim()

      };
      App.Console.quest(3, 1009, data);

    });

    $("#submit4").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        //standardModelAprovalWorkflowId: $('#s41').val().trim(),
        modelCode: $('#s41 option:selected').attr('id').trim(),
        versionId: $('#s411').val().trim(),
        title: $("#p41").val().trim(),
        description: $("#p42").val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(4, 1010, data);

    });
    $("#submit5").click(function() {
      var data = {
        //workflowId:parseInt(9999999*Math.random()),
        workflowId: $('#s51').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(5, 1011, data);

    });
    $("#submit55").click(function() {
      var data = {
        status: 4,
        workflowId: $('#s51').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(5, 1011, data);

    });
  },
  project() {
    var tpl = _.templateUrl('/console1/tpls/project/project.html', true);
    $("#contains").html(tpl);
    this.search();
    var self = this;
    $('textarea').hide();
    $.ajax({
      url: "platform/project?type=1"
    }).done(function(data) {
      var items = data.data.items,
        str = '';
      $.each(items, function(i, item) {
        if (item.version) {
          str += '<option versionid="' + item.version.id + '" value="' + item.projectNo + '">' + item.name + '</option>';
        }
      });
      $('#s11').html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
        $("#p13").val($(this).children('option:selected').attr("versionid"));
      });
    });
    $.ajax({//获取默认项目列表的请求方法
      url: "platform/project/module/create"
    }).done(function(data) {
      var items = data.data,
        str = '';
      $.each(items, function(i, item) {
        str += '<option subType="'+item.subType+'" projectNo="'+item.projectNo+'" openTime="'+item.openTime+'" delistingDate="'+item.delistingDate+'" region="'+item.region+'" province="'+item.province+'" designUnit="'+item.designUnit+'" projectType="'+item.projectType+'" estateType="'+item.estateType+'" value="' + item.id + '">' + item.name + '</option>';
      });
      $('#s00').html("<option value='' selected  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str);
      // .change(function() {
      //         $("#p13").val($(this).children('option:selected').attr("versionid"));
      //       });
    });
    //项目名称输入变化
    $("#famTitle").change(function(event){
      if(this.value !== ""){
        $('#s00').prop('disabled', 'disabled');
      }else{
        $('#s00').prop('disabled', '');
      }
    })
    $("#s00").change(function(event){
      if(this.value !== ""){
        $('#famTitle').attr('readonly', 'readonly');
        $("#s01").val($(this).children('option:selected').attr("subType"));
        $("#projectModel").val($(this).children('option:selected').attr("estateType"));
        $("#projectFormat").val($(this).children('option:selected').attr("projectType"));
        $("#number").val($(this).children('option:selected').attr("projectNo")).prop('readonly', 'readonly');
        if($(this).children('option:selected').attr("designUnit")!="null"){
          $("#launchDepartment").val($(this).children('option:selected').attr("designUnit"))
        }
        for(var i=0,len=$("#province").find("option").length-1;i<=len;i++){
          if($($("#province").find("option")[i]).text() == $(this).children('option:selected').attr("province")){
            $("#province").val($($("#province").find("option")[i]).val());
          }
        }
        for(var i=0,len=$("#adminZone").find("option").length-1;i<=len;i++){
          if($($("#adminZone").find("option")[0]).text() == $(this).children('option:selected').attr("region")){
            $("#adminZone").val($($("#adminZone").find("option")[i]).val());
          }
        }
        $("#delistDate").val($(this).children('option:selected').attr("delistingDate"));
        $("#openDate").val($(this).children('option:selected').attr("openTime"));
      }else{
        $('#famTitle').prop('readonly', '');
        $('#number').prop('readonly', '');
      }
    })
    //6.1
    this.fn['6.1'] = function() {
      self.twoApply(1, 's02', 's03', 9);
      $.ajax({
        url: "platform/project?type=2&versionStatus=9&pageItemCount=100000"
      }).done(function(data) {
        var items = data.data.items,
          str = '';
        $.each(items, function(i, item) {
          if (item.version) {
            str += '<option versionid="' + item.version.id + '" value="' + item.projectNo + '">' + item.name + '</option>';
          }
        });
        $("#s12").html('<option value=""  data-i18n="data.drawing-model.Pst">请选择</option>' + str);
      });
      $.ajax({
        url: "platform/api/project?uninit=1"
      }).done(function(data) {
        var items = data.data,
          str = '';
        $.each(items, function(i, item) {
          if (item.projectCode) {
            str += '<option  value="' + item.projectNo + '" id="' + item.projectCode + '">' + item.name + '</option>';
          }
        });
        $("#s1").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str);
      });
    }

    //6.2
    this.fn['6.2'] = function() {
      $.ajax({
        url: "platform/api/workflow/project?status=3,6"
      }).done(function(data) {
        var items = data.data,
          str = '';
        $.each(items, function(i, item) {
          if (item.projectCode) {
            str += '<option value="' + item.projectCode + '" versionId="' + item.projectId + '" id="' + item.projectCode + '">' + item.name + '</option>';
          }
        });
        $("#s21").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str);
      });
    }

    //6.4
    this.fn['6.4'] = function() {
        $.ajax({
          url: "platform/api/workflow/project?status=5,8"
        }).done(function(data) {
          var items = data.data,
            str = '';
          $.each(items, function(i, item) {
            if (item.projectCode) {
              str += '<option value="' + item.projectCode + '" versionId="' + item.projectId + '" id="' + item.projectCode + '">' + item.name + '</option>';
            }
          });
          $("#s41").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str);
        });
      }
      //6.3
    this.fn['6.3'] = function() {
      //8获取
      App.Console.auditSheet1(7, "#s31", 8);
    }

    //20获取
    //App.Console.auditSheet1(20, "#s21", 16);

    //App.Console.auditSheet1(7, "#s41", 16);
    //6.5
    this.fn['6.5'] = function() {

      App.Console.auditSheet1(8, "#s51", 8);
    }

    $("#submit0").click(function() {
      if ($("#originator").find("div").length <= 0) {
        alert("请添加发起人");
        return;
      }
      if ($("#auditor").find("div").length <= 0) {
        alert("请添加审核人");
        return;
      }
      if ($("#querenPeople").find("div").length <= 0) {
        alert("请添加确认人");
        return;
      }
      if ($("#sendee").find("div").length <= 0) {
        alert("请添加接收人");
        return;
      }
      if ($("#s01").val()== null) {
        alert("请选择项目类型");
        return;
      }
      var data = {
        id:$("#s00").val()==""?0:$("#s00").val(),
        type: 3,
        projectNo: $("#number").val().trim(),
        name: $("#s00").val()==""?$("#famTitle").val().trim():$("#s00 option:selected").html().trim(),
        province: $("#province option:selected").html().trim(),
        subType: $("#s01").val().trim(), //项目类型
        estateType: $("#projectModel").val().trim(), // 项目模式
        projectType: $("#projectFormat").val().trim(), //项目业态
        region: $("#adminZone option:selected").html().trim(),
        openTime: $("#openDate").val().trim(),
        delistingDate: $("#delistDate").val().trim(),
        designUnit: $("#launchDepartment").val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      var stringData = JSON.stringify(data);
      $.ajax({
        url: "platform/project",
        data: stringData,
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST"
      }).done(function(data) {
        if (data.code == "1") {
          if (data.message == "projectNo repeat!") {
            alert("项目编号重复");
          }
        } else {
          if (data.message == "success") {
            alert("成功");
          }
        }
      });
    });
    $("#submit1").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        projectCode: $('#s1 option:selected').attr('id').trim(),
        projectName: $('#s1 option:selected').text().trim(),
        title: $("#p13").val().trim(),
        modelCode: $('#s02').val(),
        modelVersionId: $('#s03').val(),
        modelName: $('#s02 option:selected').text(),
        familyCode: $('#s12').val().trim(),
        familyName: $('#s12 option:selected').text().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(1, 1012, data);
    });
    //start 项目模拟的第三步
    $("#submit2").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        projectCode: $('#s21').val().trim(),
        title: $("#p21").val().trim(),
        description: $("#p22").val().trim(),
        versionId: $('#s21 option:selected').attr("versionId").trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(2, 1013, data);
    });
    //end 项目模拟的第三步
    $("#submit3").click(function() {
      var data = {
        title: $("#p30").val().trim(),
        workflowId: $('#s31').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(3, 1014, data);
    });
    $("#submit33").click(function() {
      var data = {
        status: 4,
        title: $("#p30").val().trim(),
        workflowId: $('#s31').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(3, 1014, data);
    });
    //start 项目模拟的第五步
    $("#submit4").click(function() {
      var data = {
        workflowId: parseInt(9999999 * Math.random()),
        projectCode: $('#s41').val().trim(),
        title: $("#p41").val().trim(),
        description: $("#p42").val().trim(),
        "initiator": App.Console.getPerson(0),
        versionId: $('#s41 option:selected').attr("versionId").trim(),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(4, 1015, data);
    });
    //end 项目模拟的第五步
    $("#submit5").click(function() {
      var data = {
        workflowId: $('#s51').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3),
        title: $("#p50").val().trim(),
      };
      App.Console.quest(5, 1016, data);
    });
    $("#submit55").click(function() {
      var data = {
        status: 4,
        workflowId: $('#s51').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3),
        title: $("#p50").val().trim(),
      };
      App.Console.quest(5, 1016, data);
    });
  },
  //项目变更流程模拟
  projectChange() {
    var tpl = _.templateUrl('/console1/tpls/projectChange/projectchange.html', true);
    $("#contains").html(tpl);
    this.search();
    $('textarea').hide();
    setTimeout(function() {
      $('body').append('<script type="text/javascript" src="/static/dist/components/fileSelection/js/fileSelection.js"></' + 'script>')
    }, 1000)
    $.ajax({
      url: "platform/project?type=3&pageItemCount=100000"
    }).done(function(data) {
      var items = data.data.items,
        str = '';
      $.each(items, function(i, item) {
        if (item.id) {
          str += '<option id="' + item.id + '" value="' + item.projectNo + '">' + item.name + '</option>';
        }
      });
      $("#s11").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
        $.ajax({
          url: "platform/project/" + $(this).find('option:selected').attr('id') + "/version/bgmn"
        }).done(function(data) {
          var items = data.data,
            str = '';
          $.each(items, function(i, item) {
            if (item.id) {
              str += '<option  value="' + item.id + '">' + item.name + '</option>';
            }
          });
          $("#s12").html(str);
        });
      });
    });
    //7.2
    this.fn['7.2'] = function() {
        App.Console.auditSheet1(9, '#s21', 8);
      }
      //7.3
    this.fn['7.3'] = function() {
        //7.3
        $.ajax({
          //url: "platform/api/workflow/project?status=10"
          url: "platform/api/workflow/project?status=10,12"
        }).done(function(data) {

          var items = data.data,
            str = '';

          $.each(items, function(i, item) {
            if (item.projectCode) {
              str += '<option  value="' + item.projectCode + '" id="' + item.projectCode + '">' + item.name + '</option>';
            }

          });
          $("#s31").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
            $.ajax({
              url: "platform/api/workflow/project/" + $(this).find('option:selected').attr('id') + "/version?status=10"
            }).done(function(data) {

              var items = data.data,
                str = '';

              $.each(items, function(i, item) {
                if (item.id) {

                  str += '<option  value="' + item.id + '">' + item.name + '</option>';
                }

              });
              $("#s311").html(str);

            });
          });
        });

      }
      //7.4
    this.fn['7.4'] = function() {
        App.Console.auditSheet1(10, '#s41', 8);


      }
      //7.5
    this.fn['7.5'] = function() {
        //7.5
        $.ajax({
          //url: "platform/api/workflow/project?status=11"
          //url: "api/workflow/project?status=11,12"
          url: "platform/api/workflow/project?status=11,12"
        }).done(function(data) {

          var items = data.data,
            str = '';

          $.each(items, function(i, item) {
            if (item.projectCode) {
              str += '<option  value="' + item.projectCode + '" id="' + item.projectCode + '">' + item.name + '</option>';
            }

          });
          $("#s51").html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
            $.ajax({
              url: "platform/api/workflow/project/" + $(this).find('option:selected').attr('id') + "/version?status=11"
            }).done(function(data) {

              var items = data.data,
                str = '';

              $.each(items, function(i, item) {
                if (item.id) {

                  str += '<option  value="' + item.id + '">' + item.name + '</option>';
                }

              });
              $("#s511").html(str);

            });
          });
        });

      }
      //7.6
    this.fn['7.6'] = function() {
        App.Console.auditSheet1(11, '#s61', 8);


      }
      //App.Console.auditSheet1(9, '#s31', 16);
      //App.Console.auditSheet1(10, '#s51', 16);


    var data;
    $("#p16").click(function() {
      if ($('#p15').val().trim().length > 10) {
        var arr = JSON.parse($('#p15').val().trim()),
          ids = '';
        _.each(arr, function(item, index) {
          index == 0 ? ids += item.fileId : ids += (',' + item.fileId);
        })

      }
      var Files = FileSelection({
        appKey: "99a3d82442594d3e8446108e21f6fb61",
        token: "123",
        isDrag: true,
        //isEnable:false,
        projectId: $('#s11 option:selected').attr('id'),
        projectVersionId: $('#s12').val().trim(),
        closeCallback: function() {
          console.log(1)
        },
        fileIds: ids || "", //逗号隔开
        callback: function(a) {
          var files = Files.getFileId();
          $('#p15').val(JSON.stringify(files))
        }

      });
    });
    $("#submit4").click(function() {
      var files = [],
        i,
        ids = JSON.parse($('#p15').val().trim());
      for (i = 0; i < ids.length; i++) {
        ids[i]['versionId'] = ids[i]['fileVersionId']
      }
      console.log(files)
      data = {
        title: $('#p11').val().trim(),
        workflowId: parseInt(9999999 * Math.random()),
        projectVersionName: $('#p12').val().trim(),
        refProjectModelCode: $('#s11').val(),
        refProjectModelName: $('#s11 option:selected').text().trim(),
        projectModelCode: $('#s11').val(),
        refProjectModelVersionId: $('#s12').val().trim(),
        description: $('#p13').val().trim(),
        createTime: $('#p14').val().trim(),
        changedFiles: ids,
        status: 8,
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(1, 1017, data);
    });
    $("#submit5").click(function() {
      data = {
        workflowId: $('#s21').val().trim(),
        status: 16,
        title: $('#p21').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(2, 1018, data);
    });
    $("#submit55").click(function() {
      data = {
        workflowId: $('#s21').val().trim(),
        status: 4,
        title: $('#p21').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(2, 1018, data);
    });
    $("#submit6").click(function() {
      data = {
        workflowId: parseInt(9999999 * Math.random()),
        //projectModelChangeApplyWorkflowId: $('#s31').val().trim(),
        projectModelCode: $('#s31').val().trim(),
        versionId: $('#s311').val().trim(),
        status: 8,
        title: $('#p31').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(3, 1019, data);
    });
    $("#submit7").click(function() {
      data = {
        workflowId: $('#s41').val().trim(),
        status: 16,
        title: $('#p41').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(4, 1020, data);
    });
    $("#submit77").click(function() {
      data = {
        workflowId: $('#s41').val().trim(),
        status: 4,
        title: $('#p41').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(4, 1020, data);
    });
    $("#submit8").click(function() {
      data = {
        workflowId: parseInt(9999999 * Math.random()),
        //projectModelChangeAprovalWorkflowId: $('#s51').val().trim(),
        projectModelCode: $('#s51').val().trim(),
        versionId: $('#s511').val().trim(),
        status: 8,
        title: $('#p51').val().trim(),
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(5, 1021, data);
    });
    $("#submit9").click(function() {
      data = {
        workflowId: $('#s61').val().trim(),
        status: 16,
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(6, 1022, data);
    });
    $("#submit99").click(function() {
      data = {
        workflowId: $('#s61').val().trim(),
        status: 4,
        "initiator": App.Console.getPerson(0),
        "auditor": App.Console.getPerson(1),
        "confirmor": App.Console.getPerson(2),
        "receiver": App.Console.getPerson(3)
      };
      App.Console.quest(6, 1022, data);
    });
  },
  //质量监测
  qualityMonitoring() {
    var Settings = App.Console.Settings;
    //发起
    if (Settings.step == 1) {
      var tpl = _.templateUrl('/console1/tpls/qualityMonitoring/materiallist.html', true);
      $("#contains").html(tpl);

      App.Console.qm1();

    } else if (Settings.step == 2) {
      var tpl = _.templateUrl('/console1/tpls/qualityMonitoring/acceptance.html', true);
      $("#contains").html(tpl);

      App.Console.qm2();

    } else if (Settings.step == 3) {
      var tpl = _.templateUrl('/console1/tpls/qualityMonitoring/danger.html', true);
      $("#contains").html(tpl);

      App.Console.qm3();

    } else if (Settings.step == 4) {
      var tpl = _.templateUrl('/console1/tpls/qualityMonitoring/component.html', true);
      $("#contains").html(tpl);

      App.Console.qm4();

    }
  },
  //获取项目列表
  getProjects(Type, cb) {
    $.ajax({
      url: "/platform/project?type=" + Type
    }).done(function(data) {

      cb(data)
    });
  },
  //获取项目质量材料设备列表
  qm1() {
    $.ajax({
      url: "/platform/mapping/project?type=3"
    }).done(function(data) {
      var str = '',
        datas = data.data;

      $.each(datas, function(index, data) {
        console.log(data);
        str += "<option value=" + data.projectCode + ">" + data.projectName + "</option>";
      });

      $('#s11').append(str)

    });

    $("#submit").click(function() {
      var data = {
        "id": $('#p11').val().trim(),
        //"projectCode"  : $('#s11').val().trim(),
        "specialtyName": $('#s12 option:selected').text().trim(),
        "specialtyId": $('#s12').val().trim(),
        "categoryId": $('#s13').val().trim(),
        "categoryName": $('#s13 option:selected').text().trim(),
        "name": $('#p12').val().trim()

      };
      App.Console.apply(1, 1001, data, 1);
    });

  },

  //获取项目质量验收列表

  qm2() {
    //2.2	过程验收
    $.ajax({
      url: "/platform/mapping/project?type=3"
    }).done(function(data) {
      var str = '',
        datas = data.data;

      $.each(datas, function(index, data) {
        console.log(data);
        str += "<option value=" + data.projectCode + ">" + data.projectName + "</option>";
      });

      $('#s11,#s21').append(str)

    });
    $("#submit").click(function() {
      var data = {
        "id": $('#p11').val().trim(),
        //"projectCode" : $('#s11').val().trim(),
        "categoryId": $('#s12').val().trim(),
        "categoryName": $('#s12 option:selected').text().trim()
      };
      App.Console.apply('', 1002, data, 1);

    });

    //2.3	开业验收
    $("#submit1").click(function() {
      var data = {
        "id": $('#p21').val().trim(),
        //"projectCode"  : $('#s21').val().trim(),
        "specialtyName": $('#s22 option:selected').text().trim(),
        "specialtyId": $('#s22').val().trim(),
        "categoryId": $('#s23').val().trim(),
        "categoryName": $('#s23 option:selected').text().trim()
      };
      App.Console.apply(1, 1003, data, 1);

    })
  }, //获取项目质量隐患列表

  qm3() {
    $.ajax({
      url: "/platform/mapping/project?type=3"
    }).done(function(data) {
      var str = '',
        datas = data.data;

      $.each(datas, function(index, data) {
        console.log(data);
        str += "<option value=" + data.projectCode + ">" + data.projectName + "</option>";
      });

      $('#s11').append(str)

    });
    $("#submit").click(function() {
      var data = {
        "id": $('#p11').val().trim(),
        //"projectCode"       : $('#s11').val().trim(),
        "acceptanceId": $('#p12').val().trim(),
        "name": $('#p13').val().trim(),
        "status": $('#s12').val().trim(),
        "levelId": $('#s13').val().trim(),
        "organizationTypeId": $('#s14').val().trim(),
        "ratingCategoryId": $('#s15').val().trim()
      };
      App.Console.apply('', 1004, data, 1);
    });

  }, //获取验收、隐患对应的构件

  qm4() {
    $.ajax({
      url: "/platform/mapping/project?type=3"
    }).done(function(data) {
      var str = '',
        datas = data.data;

      $.each(datas, function(index, data) {
        console.log(data);
        str += "<option value=" + data.projectCode + ">" + data.projectName + "</option>";
      });

      $('#s11').append(str)

    });
    //2.5	验收合格数据
    $("#submit").click(function() {
      var data = {
        "id": $('#p11').val().trim(),
        //"projectCode"   : $('#s11').val().trim(),
        "acceptanceId": $('#p12').val().trim(),
        "acceptanceType": $('#s12').val().trim()
      };
      App.Console.apply('', 1005, data, 1);

    })
  },

  //设计
  design() {
    var Settings = App.Console.Settings;
    //发起
    if (Settings.step == 1) {
      var tpl = _.templateUrl('/console1/tpls/design/designlist.html', true);
      $("#contains").html(tpl);

      App.Console.ds1();

    }
  }, //获取设计检查列表
  ds1() {
    //3.1	设计检查

    $.ajax({
      url: "/platform/mapping/project?type=3"
    }).done(function(data) {
      var str = '',
        datas = data.data;

      $.each(datas, function(index, data) {
        console.log(data);
        str += "<option value=" + data.projectCode + ">" + data.projectName + "</option>";
      });

      $('#s11').append(str)

    });
    $("#submit").click(function() {
      var data = {
        "id": $('#p11').val().trim(),
        //"projectCode"       : $('#s11').val().trim(),
        "name": $('#p12').val().trim(),
        "status": $('#s13').val().trim(),
        "specialtyName": $('#s12 option:selected').text().trim(),
        "specialtyId": $('#s12').val().trim(),
        "organizationTypeId": $('#s14').val().trim(),
        "ratingCategoryId": $('#s15').val().trim()
      };
      App.Console.apply('', 1006, data, 1);

    })
  },
  refreshProjectListFun() { //成本 三步提交成功之后都会从新刷新项目列表的方法
    $.ajax({
      url: "/platform/project/list/all/cost"
    }).done(function(data) {
      var str = '<option value="0"  data-i18n="data.drawing-model.Pst">请选择</option>',
        optionDom = '<option value="0"  data-i18n="data.drawing-model.Pst">请选择</option>',
        datas = data.data;
      $('#s11,#s21,#transferProject').html("");
      $('#projectList_two,#projectList').html("");
      $.each(datas, function(index, data) {
        str += "<option projectId=" + data.projectId + " id=" + data.id + " value=" + data.projectCode + ">" + data.projectName + "</option>";
      });
      $('#s11,#s21,#transferProject').append(str);
      $("#projectList_two,#projectList").append(optionDom);
    });
  },
  cost() { //成本模拟流程
    var tpl = _.templateUrl('/console1/tpls/cost/cost.html', true);
    $("#contains").html(tpl);
    $('textarea').hide();
    $.ajax({ //成本第一步
      // url: "/platform/project/cost/mapping",
      url: "/platform/project/list/all/cost"
    }).done(function(data) {
      var str = '',
        datas = data.data;
      $.each(datas, function(index, data) {
        str += "<option projectId=" + data.projectId + " id=" + data.id + " value=" + data.projectCode + ">" + data.projectName + "</option>";
      });
      $('#s11').append(str);
    });
    $.ajax({ //成本第二步
      url: "platform/project/list/all/cost/change?type=10"
    }).done(function(data) {
      var str = '',
        datas = data.data;
      $.each(datas, function(index, data) {
        str += "<option projectId=" + data.projectId + " id=" + data.id + " value=" + data.projectCode + ">" + data.projectName + "</option>";
      });
      $('#s21').append(str);
    });
    $.ajax({ //成本第三步
      url: "platform/project/list/all/cost/change?type=11"
    }).done(function(data) {
      var str = '',
        datas = data.data;
      $.each(datas, function(index, data) {
        str += "<option projectId=" + data.projectId + " id=" + data.id + " value=" + data.projectCode + ">" + data.projectName + "</option>";
      });
      $('#transferProject').append(str);
    });
    $("#submit1").click(function() {
      var div = $('#form1 div'),
        arr = [];
      div.each(function(index, item) {
        arr.push({
          "type": 1,
          "description": $(item).find('span').text(),
          "url": location.origin + '/platform/mock/costfile?token=123&filePath=' + $(item).data('path')
        })
      })

      var data = {
        workflowCode: parseInt(9999999 * Math.random()),
        costAttachments: arr,
        projectCode: $('#s11').val().trim(),
        designFlowCode: $('#s11').val().trim(),
        projectId: $('#s11 option:selected').attr('projectId').trim(),
        title: $('#p11').val().trim()
      };
      App.Console.apply(1, 1001, data, 2, function() {
        App.Console.refreshProjectListFun();
      });
    });
    $("#submit2").click(function() {
      var div = $('#form2 div'),
        arr = [];
      div.each(function(index, item) {
        arr.push({
          "type": 1,
          "description": $(item).find('span').text(),
          "url": location.origin + '/platform/mock/costfile?token=123&filePath=' + $(item).data('path')
        })
      })
      var data = {
        workflowCode: parseInt(9999999 * Math.random()),
        title: $('#p21').val().trim(),
        costAttachments: arr,
        projectCode: $('#s21').val().trim(),
        projectId: $('#s21 option:selected').attr('projectId').trim(),
        designFlowCode: $("#projectList").val().trim(),
      };
      App.Console.apply(2, 1003, data, 2, function() {
        App.Console.refreshProjectListFun();
      });
    });
    //start 成本的第三个提交的方法
    $("#transferSubmitBtn").click(function() {
        var imgListBox = $("#form3 div")
        arr = [];
        imgListBox.each(function(index, item) {
          arr.push({
            "type": 1,
            "description": $(item).find('span').text(),
            "url": location.origin + '/platform/mock/costfile?token=123&filePath=' + $(item).data('path')
          })
        })
        var data = {
          workflowCode: parseInt(9999999 * Math.random()),
          title: $('#transfer_title').val().trim(),
          costAttachments: arr,
          projectCode: $('#transferProject').val().trim(),
          projectId: $('#transferProject option:selected').attr('projectId').trim(),
          designFlowCode: $("#projectList_two").val().trim(),
        };
        App.Console.apply(3, 1004, data, 2, function() {
          App.Console.refreshProjectListFun();
        });
      })
      //end 成本的第三个提交的方法
      //start 成本第二个提交的选择项目 获取项目清单的方法
    $("#s21").change(function(event) {
      var optionDom = '<option value="0"  data-i18n="data.drawing-model.Pst">请选择</option>';
      var projectList = $("#projectList");
      var target = $(event.target);
      var projectCode = target.val().trim();
      var projectId = target.find('option:selected').attr("projectId").trim();
      var data = {
        code: projectCode,
        type: 10,
        projectId: projectId
      }
      $.ajax({
        type: "GET",
        data: data,
        url: "/platform/project/console1/workflow/query"
      }).done(function(data) {
        projectList.html("");
        $.each(data.data, function(index, data) {
          optionDom += "<option value=" + data.workflowCode + ">" + data.title + "</option>";
        });
        projectList.append(optionDom);
      });
    });
    //end 成本第二个提交的选择项目 获取项目清单的方法
    //start 成本第三个提交的选择项目 获取项目清单的方法
    $("#transferProject").change(function(event) {
      var optionDom = '<option value="0"  data-i18n="data.drawing-model.Pst">请选择</option>';
      var projectListTwo = $("#projectList_two");
      var target = $(event.target);
      var projectCode = target.val().trim();
      var projectId = target.find('option:selected').attr("projectId").trim();
      var data = {
        code: projectCode,
        type: 11,
        projectId: projectId
      }
      $.ajax({
        type: "GET",
        data: data,
        url: "/platform/project/console1/workflow/query"
      }).done(function(data) {
        projectListTwo.html("");
        $.each(data.data, function(index, data) {
          optionDom += "<option value=" + data.workflowCode + ">" + data.title + "</option>";
        });
        projectListTwo.append(optionDom);
      });
    });
    //end 成本第三个提交的选择项目 获取项目清单的方法
    //uploadtest
    $('.ready').on('click', 'i', function(e) {
      $(this).parent().remove();
    })
    var choose = document.getElementById('choose');
    FileAPI.event.on(choose, 'change', function(evt) {
      var files = FileAPI.getFiles(evt); // Retrieve file list
      if (files.length) {
        // Uploading Files
        FileAPI.upload({
          url: '/platform/mock/costfile?token=123',
          files: {
            file: files
          },
          progress: function(evt) { /* ... */ },
          filecomplete: function(err, xhr, file) {
            var data = JSON.parse(xhr.response);
            if (data.code == 0) {
              $('#form1').append('<div data-path="' + data.data.filePath + '"><span>' + file.name + '</span></div>')
            } else {
              alert('上传失败')
            }
          }
        });
      }
    });

    var choose1 = document.getElementById('choose1');
    FileAPI.event.on(choose1, 'change', function(evt) {
      var files = FileAPI.getFiles(evt); // Retrieve file list
      if (files.length) {
        // Uploading Files
        FileAPI.upload({
          url: '/platform/mock/costfile?token=123',
          files: {
            file: files
          },
          progress: function(evt) { /* ... */ },
          filecomplete: function(err, xhr, file) {
            var data = JSON.parse(xhr.response);
            if (data.code == 0) {
              $('#form2').append('<div data-path="' + data.data.filePath + '"><span>' + file.name + '</span></div>')
            } else {
              alert('上传失败')
            }
          }
        });
      }
    });
    //start 成本的第三步上传功能
    var choose2 = document.getElementById('choose2');
    FileAPI.event.on(choose2, 'change', function(evt) {
      var files = FileAPI.getFiles(evt); // Retrieve file list
      if (files.length) {
        FileAPI.upload({
          url: '/platform/mock/costfile?token=123',
          files: {
            file: files
          },
          progress: function(evt) { /* ... */ },
          filecomplete: function(err, xhr, file) {
            var data = JSON.parse(xhr.response);
            if (data.code == 0) {
              $('#form3').append('<div data-path="' + data.data.filePath + '"><span>' + file.name + '</span></div>')
            } else {
              alert('上传失败')
            }
          }
        });
      }
    });
    //end 成本的第三步上传功能
  },
  quest(index, num, obj, type) {
    var datainit = JSON.parse($('#data' + index).val());
    if (typeof obj != 'undefined') {
      for (var g in obj) {
        datainit[g] = obj[g];
      }
      var data = {
        "msgContent": JSON.stringify({
          "messageId": "411a109141d6473c83a86aa0480d6610",
          "messageType": (type == '1' ? "QUALITY-" : (type == '2' ? "COST-" : "PLAN-")) + num,
          "message": "是",
          "timestamp": (new Date).getTime(),
          "code": 0,
          "data": type == 1 ? new Array(datainit) : datainit

        }),
        "msgCreateTime": 1461727280227,
        "msgId": "b2e5b467ef214f6196ac3f826017806e",
        "msgSendTime": 0,
        "srcMsgType": (type == '1' ? "QUALITY-" : (type == '2' ? "COST-" : "PLAN-")) + "BIM",
        "retryTimes": 0,
        "status": 0,
        "sysCode": "1"
      };
    }
    $.ajax({
      url: type == 1 ? "sixD/internal/message" : "platform/internal/message",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST"
    }).done(function(data) {
      $("#result" + index).val(JSON.stringify(data));
      if (data.message == "success") {
        alert("成功");
      } else {
        alert(data.message || data.code)
      }
    });
  },
  apply(index, num, obj, type, callback) {
    var datainit = JSON.parse($('#data' + index).val());
    if (typeof obj != 'undefined') {
      for (var g in obj) {
        datainit[g] = obj[g];
      }
      if (datainit['initiator'] && datainit['initiator']['userId'] == 123) {
        var userId = JSON.parse(localStorage.user)['userId'];
        datainit['initiator']['userId'] = datainit['auditor'][0]['userId'] = datainit['confirmor'][0]['userId'] = datainit['receiver'][0]['userId'] = userId;
      }
      var data = {
        "msgContent": JSON.stringify({
          "messageId": "411a109141d6473c83a86aa0480d6610",
          "messageType": (type == '1' ? "QUALITY-" : (type == '2' ? "COST-" : "PLAN-")) + num,
          "message": "是",
          "timestamp": (new Date).getTime(),
          "code": 0,
          "data": type == 1 ? new Array(datainit) : datainit

        }),
        "msgCreateTime": 1461727280227,
        "msgId": "b2e5b467ef214f6196ac3f826017806e",
        "msgSendTime": 0,
        "srcMsgType": (type == '1' ? "QUALITY-" : (type == '2' ? "COST-" : "PLAN-")) + "BIM",
        "retryTimes": 0,
        "status": 0,
        "sysCode": "1"
      };
    }
    $.ajax({
      url: type == 1 ? "sixD/internal/message" : "platform/internal/message",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST"
    }).done(function(data) {
      $("#result" + index).val(JSON.stringify(data))
      if (location.port != 81) {
        setTimeout(function() {
          alert('成功');
          if (callback) {
            callback();
          }
        }, 2500);
      }

    });
  }, //2016-1-1转成时间戳
  getTime(str) {
    var dd = str.split('-');
    var d = new Date();
    d.setFullYear(dd[0]);
    d.setMonth(dd[1]);
    d.setDate(dd[2]);
    return d.getTime();
  }, //url加参数
  param(obj) {
    var str = '';
    for (var i in obj) {
      str += "&" + i + "=" + obj[i];
    }
    return "?" + str.substr(1);
  },
  fileUpload: function() {

    $("#submit").click(function() {

      var projectId = $("#projectId").val().trim(),
        projectVersionId = $("#projectVersionId").val().trim(),
        filesId = $("#filesId").val().trim();

      if (!projectId) {
        alert("请输入项目id");
        return;
      }
      if (!projectVersionId) {
        alert("请输入项目版本id");
        return;
      }
      if (!filesId) {
        alert("请输入文件id");
        return;
      }

      var url = "doc/" + projectId + "/" + projectVersionId + "/cost?files=" + filesId;

      $.ajax({
        url: url,
        type: "POST"
      }).done(function(data) {
        if (data.message == "success") {
          alert("success");
        }
      });

    });

  }, //模块化公用POST请求
  post(datas) {
    $.ajax({
      url: "platform/internal/message",
      data: datas,
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST"
    }).done(function(data) {
      console.log(data)
      if (data.code == 0) {
        alert("成功");
        //window.location.reload();
      }

    });
  },

  auditSheet1(type, selector, result) {
    $.ajax({
      url: "platform/auditSheet?type=" + type + "&auditResult=" + result
    }).done(function(data) {
      console.log(data)
      if (data.message == "success") {
        var items = data.data,
          str = "";

        $.each(items, function(i, item) {
          if (item.title) {
            str += '<option  value="' + item.no + '">' + item.title + '</option>';
          }

        });
        $(selector).html(str);
      }
    });
  },

  twoApply(type, tagid, versionid, status) {
    $.ajax({
      url: "platform/project?type=" + type + "&pageItemCount=100000"
    }).done(function(data) {

      var items = data.data.items,
        str = '';

      $.each(items, function(i, item) {
        if (item.id) {
          str += '<option id="' + item.id + '" value="' + item.projectNo + '">' + item.name + '</option>';
        }

      });

      $("#" + tagid).html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
        $.ajax({
          url: "platform/project/" + $(this).find('option:selected').attr('id') + "/version?" + (status && ('status=' + status))
        }).done(function(data) {

          var items = data.data,
            str = '';

          $.each(items, function(i, item) {
            if (item.id) {
              str += '<option  value="' + item.id + '">' + item.name + '</option>';
            }
          });
          $("#" + versionid).html("<option value=''>请选择版本</option>" + str);

        });
      });
    });
  },

  urlfor(url1, url2, tagid, versionid) {
    $.ajax({
      url: url1
    }).done(function(data) {

      var items = data.data.items,
        str = '';

      $.each(items, function(i, item) {
        if (item.id) {
          str += '<option id="' + item.id + '" value="' + item.projectNo + '">' + item.name + '</option>';
        }

      });

      $("#" + tagid).html("<option value=''  data-i18n=\"data.drawing-model.Pst\">请选择</option>" + str).change(function() {
        $.ajax({
          url: "platform/project/" + $(this).find('option:selected').attr('id') + "/version"
        }).done(function(data) {

          var items = data.data,
            str = '';

          $.each(items, function(i, item) {
            if (item.id) {

              str += '<option  value="' + item.id + '">' + item.name + '</option>';
            }

          });
          $("#" + versionid).html(str);

        });
      });
    });
  }
};