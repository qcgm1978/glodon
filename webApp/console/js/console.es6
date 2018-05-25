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
			}else if (Settings.type==5) {
				App.Console.CostAccounting();
			}



		} else {
			//主页面
			var tpl = _.templateUrl('/console/tpls/console.html', true);
			$("#contains").html(tpl);
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
	},


	//发起发版
	versionComm(statusList, confirmStatus, refuseStatus, successText, refuseText) {

		$.ajax({
			url: "platform/project?type=2&versionStatus=" + statusList
		}).done(function(data) {

			var items = data.data.items;

			$.each(items, function(i, item) {

				$("#famVettedList").append('<option versionid="' + item.version.id + '" value="' + item.version.projectId + '">' + item.name + '</option>');
			});

		});

		$("#submit").click(function() {


			var $opt = $("#famVettedList option:selected"),
				projectId = $opt.val(),
				versionId = $opt.attr("versionid");

			if (projectId == 0) {
				alert("未选择")
				return;
			}

			if (versionId == "null") {
				alert("没有 verisonId");
				return;
			}

			$.ajax({
				url: "platform/project/" + projectId + "/version/" + versionId + "?status=" + confirmStatus,
				type: "POST"
			}).done(function(data) {
				if (data.message == "success") {
					alert(successText)
					window.location.reload();
				}
			});

		});


		$("#refuse").click(function() {
			var $opt = $("#famVettedList option:selected"),
				projectId = $opt.val(),
				versionId = $opt.attr("versionid");
			if (projectId == 0) {
				alert("未选择")
				return;
			}

			if (versionId == "null") {
				alert("没有 verisonId");
				return;
			}

			$.ajax({
				url: "platform/project/" + projectId + "/version/" + versionId + "?status=" + refuseStatus,
				type: "POST"
			}).done(function(data) {
				if (data.message == "success") {
					alert(refuseText ? refuseText : "回退成功")
					window.location.reload();
				}
			});
		});

	},



	createComm(selType, type) {

		$.ajax({
			url: "platform/project?type=" + selType + "&versionStatus=9"
		}).done(function(data) {

			var items = data.data.items;

			$.each(items, function(i, item) {
				if (item.version) {
					$("#referenceResources").append('<option versionid="' + item.version.id + '" value="' + item.id + '">' + item.name + '</option>');
				}

			});
		});


		$("#submit").click(function() {
			var data = {
				type: type,
				projectNo: $("#number").val().trim(),
				name: $("#famTitle").val().trim(),
				projectType: 2,
				estateType: 1,
				province: "上海市",
				region: App.Local.getTranslation('drawing-model.MAa')||"管理分区", //管理分区，最大长度32。非空
				openTime: $("#devDate").val().trim(), //开业时间  
				//versionName: “2016 版”, //版本名称，适用于标准模型。非空字段
				designUnit: $("#launchDepartment").val().trim(),
			}

			var refer = $("#referenceResources option:selected").val();
			if (refer != 0) {
				data.referenceId = refer;
			}

			if (type == 1) {

				var $opts = $("#famVettedListVsersion option:selected"),
					projectId = $("#famVettedList option:selected").val(),
					versionId = $opts.val();

				if (projectId != 0 && versionId != 0) {
					data.referenceId = projectId;
					data.referenceVersionId = versionId;
				}
				data.versionName = $("#versionName").val().trim();
			}


			var stringData = JSON.stringify(data);

			$.ajax({
				url: "platform/project",
				data: stringData,
				headers: {
					"Content-Type": "application/json"
				},
				type: "POST"
			}).done(function(data) {

				if (data.message == "success") {
					alert("成功");
					//window.location.reload();
				}

			});
		});
	},


	//初始化
	initialization(listType) {

		$.ajax({
			url: "platform/project?versionStatus=1&type=" + listType
		}).done(function(data) {

			var items = data.data.items;

			$.each(items, function(i, item) {
				$("#famVettedList").append('<option referenceid="' + item.version.referenceId + '" value="' + item.version.projectId + '">' + item.name + '</option>');
			});


		});


		$("#submit").click(function() {


			var $opt = $("#famVettedList option:selected"),
				projectId = $opt.val();

			if (projectId == 0) {
				alert("请选择要初始化的库")
				return;
			}


			var pars = "projectId=" + projectId + "&reject=false";

			var referenceid = $opt.attr("referenceid");

			if (referenceid != "null") {

				pars += "&referenceid=" + referenceid;
			}


			var dataObj = {
				data: {}
			};
			dataObj.url = "platform/project/" + projectId + "/init?" + pars;

			App.Console.ajaxPost(dataObj, function(data) {
				if (data.message == "success") {
					alert("初始化成功")
					window.location.reload();
				}
			});

		});



		$("#refuse").click(function() {

			var $opt = $("#famVettedList option:selected"),
				projectId = $opt.val();

			if (projectId == 0) {
				alert("请选择要拒绝族库")
				return;
			}

			if (!confirm("确定删除么?")) {
				return;
			}

			var pars = "projectId=" + projectId + "&reject=true";

			var referenceid = $opt.attr("referenceid");

			if (referenceid != "null") {

				pars += "&referenceid=" + referenceid;
			}

			var dataObj = {
				data: {}
			};
			dataObj.url = "platform/project/" + projectId + "/init?" + pars;

			App.Console.ajaxPost(dataObj, function(data) {
				if (data.message == "success") {
					alert("删除成功")
					window.location.reload();
				}
			});

		});
	},


	fam() {

		var Settings = App.Console.Settings;
		//发起
		if (Settings.step == 1) {
			var tpl = _.templateUrl('/console/tpls/fam/create.html', true);
			$("#contains").html(tpl);

			//绑定族库第一步
			App.Console.bindFamCreateInit();

		} else if (Settings.step == 2) {
			//初始化
			var tpl = _.templateUrl('/console/tpls/fam/init.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindFamInit();
		} else if (Settings.step == 3) {
			//发起审核
			var tpl = _.templateUrl('/console/tpls/fam/vetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindFamVettedInit();
		} else if (Settings.step == 4) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/fam/approved.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindFamAppordInit();
		} else if (Settings.step == 5) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/fam/sendVersion.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindFamSendVersionInit();
		} else if (Settings.step == 6) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/fam/sendVersionVetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindFamSendVersionVettedInit();
		}

	},

	//创建族库
	bindFamCreateInit() {

		//创建族库
		App.Console.createComm(2, 2);

	},

	//族库初始化
	bindFamInit() {

		App.Console.initialization(2);
	},

	//族库审核
	bindFamVettedInit() {

		App.Console.versionComm(4, 2, 1, "提交审核成功");

	},
	//审核批准
	bindFamAppordInit() {

		App.Console.versionComm(2, 5, 4, "审核成功");

	},

	//发起发版
	bindFamSendVersionInit() {

		App.Console.versionComm(5, 7, 2, "发版提交成功");

	},
	//族库发版批准
	bindFamSendVersionVettedInit() {

		App.Console.versionComm(7, 9, 5, "发版成功");
	},



	//标准模型库
	standardModel() {

		var Settings = App.Console.Settings;
		//发起
		if (Settings.step == 1) {
			var tpl = _.templateUrl('/console/tpls/standardModel/create.html', true);
			$("#contains").html(tpl);

			//绑定族库第一步
			App.Console.bindstandardModelCreateInit();

		} else if (Settings.step == 2) {
			//初始化
			var tpl = _.templateUrl('/console/tpls/standardModel/init.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindstandardModelInit();
		} else if (Settings.step == 3) {
			//发起审核
			var tpl = _.templateUrl('/console/tpls/standardModel/vetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindstandardModelVettedInit();
		} else if (Settings.step == 4) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/standardModel/approved.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindstandardModelAppordInit();
		} else if (Settings.step == 5) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/standardModel/sendVersion.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindstandardModelSendVersionInit();
		} else if (Settings.step == 6) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/standardModel/sendVersionVetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindstandardModelSendVersionVettedInit();
		}
	},

	//创建标准模型库
	bindstandardModelCreateInit() {

		App.Console.createComm(1, 1);
		App.Console.bindSelect(9);
	},

	//标准模型库初始化
	bindstandardModelInit() {


		App.Console.bindSelect(1);


		$("#submit").click(function() {

			var url = App.Console.getUrl();
			if (url) {
				url += "&reject=false";
			} else {
				return;
			}
			var dataObj = {
				url: url
			};
			App.Console.ajaxPost(dataObj, function(data) {
				if (data.message == "success") {
					alert("初始化成功")
					window.location.reload();
				}
			});


		});

		$("#refuse").click(function() {

			var url = App.Console.getUrl();
			if (url) {
				url += "&reject=true";
			} else {
				return;
			}
			var dataObj = {
				url: url
			};
			App.Console.ajaxPost(dataObj, function(data) {
				if (data.message == "success") {
					alert("删除成功")
					window.location.reload();
				}
			});


		});
	},

	//下拉绑定
	bindSelect(status, listType) {

		if (!listType) {
			listType = 1;
		}
		//App.Console.initialization();
		$.ajax({
			url: "platform/project?type=" + listType + "&pageIndex=1&pageItemCount=100&uninitializedVersionStatus=true"
		}).done(function(data) {

			var items = data.data.items;
			$.each(items, function(i, item) {

				$("#famVettedList").append('<option value="' + item.id + '">' + item.name + '</option>');

			});
		});

		$("#famVettedList").change(function() {

			var projectId = $("#famVettedList option:selected").val();

			if (projectId != 0) {

				$.ajax({
					url: "platform/project/" + projectId + "/version?status=" + status
				}).done(function(data) {

					$("#famVettedListVsersion")[0].length = 1;

					$.each(data.data, function(i, item) {

						$("#famVettedListVsersion").append('<option referenceVersionid="' + item.referenceVersionId + '" referenceid="' + item.referenceId + '" value="' + item.id + '">' + item.name + '</option>');

					});

				});

			}
		});

	},

	//标准模型状态
	standardModeStatus(versionStatus, confirmStatus, refuseStatus, successText, listType) {


		App.Console.bindSelect(versionStatus, listType);


		$("#submit").click(function() {
			var url = App.Console.getUrl2(confirmStatus);
			if (url) {
				$.ajax({
					url: url,
					type: "POST"
				}).done(function(data) {
					if (data.message == "success") {
						alert(successText)
						window.location.reload();
					}
				});

			}
		});


		$("#refuse").click(function() {

			var url = App.Console.getUrl2(refuseStatus);
			if (url) {
				$.ajax({
					url: url,
					type: "POST"
				}).done(function(data) {
					if (data.message == "success") {
						alert(refuseText ? refuseText : "回退成功")
						window.location.reload();
					}
				});
			}


		});

	},


	getUrl: function() {

		var $opts = $("#famVettedListVsersion option:selected"),
			projectId = $("#famVettedList option:selected").val(),
			versionId = $opts.val();

		if (projectId == 0) {
			alert("请选择标准模型")
			return false;
		}
		if (versionId == 0) {
			alert("请选择版本")
			return false;
		}

		var url = "platform/project/",
			referenceId = $opts.attr("referenceid"),
			referenceVersionId = $opts.attr("referenceVersionid");
		url += projectId + "/init?";

		if (referenceId != "null") {
			url += "referenceId=" + referenceId;
		}
		if (referenceVersionId != "null") {
			url += "&referenceVersionId=" + referenceVersionId;
		}

		url += "&versionId=" + versionId;

		return url;
	},

	getUrl2: function(status) {

		var $opts = $("#famVettedListVsersion option:selected"),
			projectId = $("#famVettedList option:selected").val(),
			versionId = $opts.val();

		if (projectId == 0) {
			alert("请选择")
			return false;
		}
		if (versionId == 0) {
			alert("请选择版本")
			return false;
		}

		return "platform/project/" + projectId + "/version/" + versionId + "?status=" + status;
	},

	//标准模型库审核
	bindstandardModelVettedInit() {

		App.Console.standardModeStatus(4, 2, 1, "发起成功");
	},
	//标准模型库批准
	bindstandardModelAppordInit() {
		App.Console.standardModeStatus(2, 5, 4, "审核成功");
	},

	//标准模型库发版
	bindstandardModelSendVersionInit() {
		App.Console.standardModeStatus(5, 7, 2, "发起成功");
	},
	//标准模型库发版批准
	bindstandardModelSendVersionVettedInit() {
		App.Console.standardModeStatus(7, 9, 5, "审核成功");
	},


	//创建项目
	project() {
		var Settings = App.Console.Settings;
		//发起
		if (Settings.step == 1) {
			var tpl = _.templateUrl('/console/tpls/project/create.html', true);
			$("#contains").html(tpl);

			//绑定族库第一步
			App.Console.bindprojectCreateInit();

		} else if (Settings.step == 2) {
			//初始化
			var tpl = _.templateUrl('/console/tpls/project/init.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectInit();
		} else if (Settings.step == 3) {
			//发起审核
			var tpl = _.templateUrl('/console/tpls/project/vetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectVettedInit();
		} else if (Settings.step == 4) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/project/approved.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectAppordInit();
		} else if (Settings.step == 5) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/project/sendVersion.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectSendVersionInit();
		} else if (Settings.step == 6) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/project/sendVersionVetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectSendVersionVettedInit();
		}
	},

	//创建项目
	bindprojectCreateInit() {
		//创建族库
		App.Console.createComm(3, 3);
	},

	//项目移交
	bindprojectInit() {
		//标准模型
		App.Console.bindProjectSelect(9);
		App.Console.bindProjectSelect2(1);

		$("#submit").click(function() {

			var url = App.Console.getProjectUrl();
			if (url) {
				url += "&reject=false";
			} else {
				return;
			}
			var dataObj = {
				url: url
			}; 
			App.Console.ajaxPost(dataObj, function(data) {
				if (data.message == "success") {
					alert("初始化成功")
					window.location.reload();
				}
			});
		});

		$("#refuse").click(function() {

			var url = App.Console.getProjectUrl();
			if (url) {
				url += "&reject=true";
			} else {
				return;
			}
			var dataObj = {
				url: url
			};
			App.Console.ajaxPost(dataObj, function(data) {
				if (data.message == "success") {
					alert("删除成功")
					window.location.reload();
				}
			});
		});

	},

	//获取项目移交url
	getProjectUrl() {

		var $opts = $("#famVettedListVsersion option:selected"),
			projectId = $("#famVettedList option:selected").val(),
			versionId = $opts.val(),
			referenceId = $("#relaVettedList option:selected").val(),
			referenceVersionId = $("#relaVettedListVsersion option:selected").val();

		if (projectId == 0) {
			alert("请选择标准模型")
			return false;
		}
		if (versionId == 0) {
			alert("请选择版本")
			return false;
		}

		if (referenceId == 0) {
			alert("请选择参考模型")
			return false;
		}

		if (referenceVersionId == 0) {
			alert("请选择参考模型版本")
			return false;
		}

		var url = "platform/project/";
		url += projectId + "/init?";
		url += "referenceId=" + referenceId;
		url += "&referenceVersionId=" + referenceVersionId;
		url += "&versionId=" + versionId;

		return url;
	},

	//下拉绑定
	bindProjectSelect(status) {
		//App.Console.initialization();
		$.ajax({
			url: "platform/project?type=1&pageIndex=1&pageItemCount=100&uninitializedVersionStatus=true"
		}).done(function(data) {
			var items = data.data.items;
			$.each(items, function(i, item) {

				$("#relaVettedList").append('<option value="' + item.id + '">' + item.name + '</option>');

			});
		});

		$("#relaVettedList").change(function() {

			var projectId = $("#relaVettedList option:selected").val();

			if (projectId != 0) {

				$.ajax({
					url: "platform/project/" + projectId + "/version?status=" + status
				}).done(function(data) {

					$("#relaVettedListVsersion")[0].length = 1;

					$.each(data.data, function(i, item) {

						$("#relaVettedListVsersion").append('<option referenceVersionid="' + item.referenceVersionId + '" referenceid="' + item.referenceId + '" value="' + item.id + '">' + item.name + '</option>');

					});

				});

			}
		});
	},

	bindProjectSelect2(status) {
		$.ajax({
			url: "platform/project?type=3&pageIndex=1&pageItemCount=100&uninitializedVersionStatus=true"
		}).done(function(data) {
			var items = data.data.items;
			$.each(items, function(i, item) {

				$("#famVettedList").append('<option value="' + item.id + '">' + item.name + '</option>');

			});
		});

		$("#famVettedList").change(function() {

			var projectId = $("#famVettedList option:selected").val();

			if (projectId != 0) {

				$.ajax({
					url: "platform/project/" + projectId + "/version?status=" + status
				}).done(function(data) {

					$("#famVettedListVsersion")[0].length = 1;

					$.each(data.data, function(i, item) {

						$("#famVettedListVsersion").append('<option referenceVersionid="' + item.referenceVersionId + '" referenceid="' + item.referenceId + '" value="' + item.id + '">' + item.name + '</option>');

					});

				});

			}
		});
	},



	//发起审核
	bindprojectVettedInit() {
		App.Console.standardModeStatus(4, 2, 1, "审核成功", 3);

	},
	//审核批准
	bindprojectAppordInit() {
		App.Console.standardModeStatus(2, 5, 4, "审核成功", 3);
	},

	//发起发版
	bindprojectSendVersionInit() {
		App.Console.standardModeStatus(5, 7, 2, "发起成功", 3);
	},
	//族库发版批准
	bindprojectSendVersionVettedInit() {
		App.Console.standardModeStatus(7, 9, 5, "审核成功", 3);
	},



	//下拉绑定
	bindProjectChangeSelect(status, listType) {


		$.ajax({
			url: "platform/project?type=" + listType + "&pageIndex=1&pageItemCount=100"
		}).done(function(data) {

			var items = data.data.items;
			$.each(items, function(i, item) {

				$("#famVettedList").append('<option value="' + item.id + '">' + item.name + '</option>');

			});
		});

		$("#famVettedList").change(function() {

			var projectId = $("#famVettedList option:selected").val();

			if (projectId != 0) {

				$.ajax({
					url: "platform/project/" + projectId + "/version?status=" + status
				}).done(function(data) {

					$("#famVettedListVsersion")[0].length = 1;

					$.each(data.data, function(i, item) {

						$("#famVettedListVsersion").append('<option referenceVersionid="' + item.referenceVersionId + '" referenceid="' + item.referenceId + '" value="' + item.id + '">' + item.name + '</option>');

					});

				});

			}
		});


		$("#famVettedListVsersion").change(function() {

			var projectId = $("#famVettedList option:selected").val(),
				versionId = $("#famVettedListVsersion option:selected").val();

			$.ajax({
				url: "doc/" + projectId + "/" + versionId + "/file/tree?projectId=" + projectId + "&projectVersionId=" + versionId
			}).done(function(data) {

				data.click = function(event) {
					var file = $(event.target).data("file");

					App.Console.getTreeContent(projectId, versionId, file.fileVersionId);
				}
				data.iconType = 1;
				var navHtml = new App.Comm.TreeViewMar(data);
				$("#tree").html(navHtml);


			});

			var name = $("#famVettedList option:selected").text() + "-" + $("#famVettedListVsersion option:selected").text();
			name += "-" + $("#versionNameNo").val().trim() + "-项目变更单";
			$("#versionNameNoTitle").val(name);

		});

		App.Console.Settings.ChangeFile = [];
		//选择需要更改的文件
		$("#treeContainer").on("click", ".item :checkbox", function() {

			var id = $(this).closest(".item").data("id");
			if ($(this).is(":checked")) {
				App.Console.Settings.ChangeFile.push(id);
			} else {
				App.Console.Settings.ChangeFile.removeByItem(id);
			}

		});


		//{projectId}/version/{versionId}/alter?versionName={versionName}&fileIds={fileIds}

		$("#submit").click(function() {

			var projectId = $("#famVettedList option:selected").val(),
				versionId = $("#famVettedListVsersion option:selected").val(),
				versionName = $("#versionName").val().trim(),
				versionNameNo = $("#versionNameNo").val().trim(),
				versionNameNoTitle = $("#versionNameNoTitle").val().trim();


			if (projectId == 0 || versionId == 0) {
				alert("请选择项目，版本")
				return;
			}

			if (App.Console.Settings.ChangeFile.length < 1) {
				alert("请选择需要修改的文件")
				return;
			}

			if (!versionName) {
				alert("请输入版本名称")
				return;
			}

			if (!versionNameNo) {
				alert("请输入审批单号")
				return;
			}

			if (!versionNameNoTitle) {
				alert("请输入审批单号名称")
				return;
			}

			var files = App.Console.Settings.ChangeFile.join(","),
				url = "platform/auditSheet/alterApprove?versionName=" + versionName + "&fileIds=" + files;
			url += "&projectId=" + projectId + "&versionId=" + versionId + "&auditSheetNo=" + versionNameNo;
			url += "&title=" + versionNameNoTitle;
			var dataobj = {
				url: url
			};
			App.Console.ajaxPost(dataobj, function(data) {
				if (data.message == "success") {
					alert("变成成功")
					window.location.reload();
				} else {
					alert("变成失败")
				}
			});

		});
	},

	getTreeContent(projectId, versionId, fileVersionId) {

		$.ajax({
			url: "doc/" + projectId + "/" + versionId + "/file/children?parentId=" + fileVersionId
		}).done(function(data) {
			var list = data.data,
				count = list.length,
				item;
			var str = "<ul>";
			for (var i = 0; i < count; i++) {
				item = data.data[i];
				str += '<li  class="item" data-id="' + item.id + '"><label><input type="checkbox" class="ckChoose" /> ' + item.name + '</label></li>';
			}
			str += '</ul>';

			$("#treeContainer").html(str);

		});
	},

	randomString: function(len) {　　
		len = len || 32;　　
		var $chars = 'ABCDEFGHIJKLMLOPQRSTUVWXYZBBWWDD',
			$chars2 = "23456789"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
		var maxPos = $chars.length;　　
		var pwd = '';　　
		for (i = 0; i < len; i++) {　　　　
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
		}　

		maxPos = 　$chars2.length;
		for (i = 0; i < len; i++) {　　　　
			pwd += $chars2.charAt(Math.floor(Math.random() * maxPos));　　
		}　　
		return pwd;
	},


	//下拉绑定
	bindSelectprojectChange(type, status) {

		$.ajax({
			url: "/platform/auditSheet?type=" + type + "&auditResult=" + status
		}).done(function(data) {

			var items = data.data;
			$.each(items, function(i, item) {

				$("#famVettedList").append('<option value="' + item.no + '">' + item.title + '</option>');

			});
		});
	},

	//发起
	getProjectChangeUrl(status) {

		var url = "/platform/auditSheet/alterAudit?",
			auditSheetNo = $("#titleNo").val().trim(),
			title = $("#title").val().trim(),
			childAuditSheetNo = $("#famVettedList").val();

		//发起移交
		if (status) {
			url = "platform/auditSheet/alterTransferAudit?";
		}

		if (childAuditSheetNo == 0) {
			alert("请选择")
			return false;
		}

		if (!title) {
			alert("请输入名称");
			return false;
		}

		if (!auditSheetNo) {
			alert("请输入单号");
			return false;
		}

		url += "auditSheetNo=" + auditSheetNo + "&title=" + title + "&childAuditSheetNo=" + childAuditSheetNo;
		console.log(url);

		return url;
	},

	getProjectChangeUrl2(status) {
		var url = "/platform/auditSheet/", //{auditSheet}/approve?approve={approve}
			childAuditSheetNo = $("#famVettedList").val();

		if (childAuditSheetNo == 0) {
			alert("请选择审批单")
			return false;
		}

		url += childAuditSheetNo + "/approve?approve=" + status;

		return url;
	},

	//状态 opType 1 发起 2 审核
	projectChangeStatus(type, status, opType, successText, subType) {


		App.Console.bindSelectprojectChange(type, status);

		$("#titleNo").val(App.Console.randomString(4));

		$("#submit").click(function() {
			var url = false;
			//审核
			if (opType == 2) {
				url = App.Console.getProjectChangeUrl2(true);
			} else {

				url = App.Console.getProjectChangeUrl(subType);
			}

			if (url) {

				if (opType == 1) {

					App.Console.ajaxPost({
						url: url
					}, function(data) {
						if (data.message == "success") {
							alert(successText)
							window.location.reload();
						} else {
							alert("审发起失败")
						}
					});

				} else {
					$.ajax({
						url: url,
						type: "PUT",
						data: {
							approve: true
						}
					}).done(function(data) {
						if (data.message == "success") {
							alert(successText)
							window.location.reload();
						} else {
							alert("审批失败")
						}
					});
				}
			}
		});


		// $("#refuse").click(function() {

		// 	var url = false;
		// 	//发起
		// 	if (opType == 2) {
		// 		url = App.Console.getProjectChangeUrl2(false);
		// 	} else {
		// 		url = App.Console.getProjectChangeUrl();
		// 	}


		// 	if (url) {

		// 		if (opType == 2) {
		// 			$.ajax({
		// 				url: url,
		// 				type: "PUT",
		// 				data: {
		// 					approve: false
		// 				}
		// 			}).done(function(data) {
		// 				if (data.message == "success") {
		// 					alert("拒绝成功")
		// 				} else {
		// 					alert("拒绝失败")
		// 				}
		// 			});
		// 		}
		// 	}
		// });
	},


	//项目变更
	projectChange() {
		var Settings = App.Console.Settings;
		//发起
		if (Settings.step == 1) {
			var tpl = _.templateUrl('/console/tpls/projectChange/create.html', true);
			$("#contains").html(tpl);

			//绑定族库第一步
			App.Console.bindprojectChangeCreateInit();

		} else if (Settings.step == 2) {
			//初始化
			var tpl = _.templateUrl('/console/tpls/projectChange/init.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectChangeInit();
		} else if (Settings.step == 3) {
			//发起审核
			var tpl = _.templateUrl('/console/tpls/projectChange/vetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectChangeVettedInit();
		} else if (Settings.step == 4) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/projectChange/approved.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectChangeAppordInit();
		} else if (Settings.step == 5) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/projectChange/sendVersion.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectChangeSendVersionInit();
		} else if (Settings.step == 6) {
			//审核批准
			var tpl = _.templateUrl('/console/tpls/projectChange/sendVersionVetted.html', true);
			$("#contains").html(tpl);
			//绑定族库审核
			App.Console.bindprojectChangeSendVersionVettedInit();
		}
	},



	//发起变更
	bindprojectChangeCreateInit() {

		App.Console.bindProjectChangeSelect(9, 3);
		$("#versionNameNo").val(this.randomString(4));
	},


	//变更批转
	bindprojectChangeInit() {
		App.Console.projectChangeStatus(9, 0, 2, "审批成功");
	},

	// 发起审核
	bindprojectChangeVettedInit() {
		App.Console.projectChangeStatus(9, 1, 1, "发起成功");
	},
	//审核批准
	bindprojectChangeAppordInit() {
		App.Console.projectChangeStatus(10, 0, 2, "审核成功");
	},

	//发起发版
	bindprojectChangeSendVersionInit() {
		App.Console.projectChangeStatus(10, 1, 1, "发起成功", 1);
	},
	//族库发版批准
	bindprojectChangeSendVersionVettedInit() {
		App.Console.projectChangeStatus(11, 0, 2, "发起成功");
	},

	//算量
	CostAccounting(){
		var Settings = App.Console.Settings;
		//发起
		if (Settings.step == 1) {
			var tpl = _.templateUrl('/console/tpls/CostAccounting/create.html', true);
			$("#contains").html(tpl); 
			//绑定族库第一步
			App.Console.fileUpload();

		}  
	},

	fileUpload:function(){

		$("#submit").click(function(){

			var projectId=$("#projectId").val().trim(),
			projectVersionId=$("#projectVersionId").val().trim(),
			filesId=$("#filesId").val().trim();

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

			var url="doc/"+projectId+"/"+projectVersionId+"/cost?files="+filesId;

			$.ajax({
				url:url,
				type:"POST" 
			}).done(function(data){
				if (data.message=="success") {
					alert("success");
				}
			});


		});


	}

}