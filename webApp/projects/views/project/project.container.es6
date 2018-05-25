App.Project.ProjectContainer = Backbone.View.extend({
    tagName: 'div',
    className: 'projectContent',
    template: _.templateUrl('/projects/tpls/project/project.container.html'),
    defaults: {
        filterData: [],
        timeoutId: "",
    },
    initialize() {
        this.listenTo(App.Project.DesignAttr.PropertiesCollection, "add", this.renderProperties);
    },
    events: {
        "click .breadItem": "breadItemClick", //点击头部导航  项目  版本  列表 模型
        "click .projectList .projectBox .item,.projectVersionList .container .item": "beforeChangeProject", //切换项目 之前 处理
        "click .slideBar": "navBarShowAndHide",
        "mousedown .dragSize": "dragSize",
        "click .projectVersionList .nav .item": "changeVersionTab",
        "click .fileNav .commSpan": "switchFileMoldel",
        "keyup .projectList .txtSearch": "filterProject",
        "keyup .projectVersionList .txtSearch": "filterProjectVersion",
        "click .modleTitleBar": "triggerUpDown",
        "click .modleShowHide": "slideUpAndDown",
        "click .versionNoheader .header": "listSlideUpAndDown"
    },
    render: function () {
        this.$el.html(this.template({}));
        //判断什么类型的项目 BIM总发包或者总包交钥匙
        this.initDomHandle(this.$el);//初始化页面的结构
        this.isTurnKeyHandle();//是否存在模块化跳转过来的
        //导航
        this.$el.find("#projectContainer").prepend(new App.Project.leftNav().render().el);
        //加载文件
        this.$el.find(".projectCotent").append(new App.Project.FileContainer().render().el);
        this.$el.find(".projectCotent").append('<div class="modelContainer"> <div class="modelContainerScroll"><div class="modelContainerContent"></div></div> </div>');
        if (window.location.href.indexOf("share=") != -1) {
            var fileNav = this.$el.find(".fileNav span.notes");
            var shareUrl = window.location.href.substr(window.location.href.indexOf("share=") + 11);
            var shareArr = shareUrl.split("&");
            var obj = {};
            for (var i = 0, len = shareArr.length; i < len; i++) {
                obj[shareArr[i].split("=")[0]] = shareArr[i].split("=")[1];
            }
            App.Project.Settings.shareBool = true;
            App.Project.Settings.pageBool = obj.currentPageNum ? false : true;
            App.Project.Settings.viewpointShareUrlId = obj.viewpointId;
            App.Project.Settings.shareProjectId = obj.projectId;
            App.Project.Settings.viewpointSharePageNum = obj.currentPageNum ? obj.currentPageNum : "";
            setTimeout(function () {
                fileNav.click();
            }, 500);
        } else if (window.location.href.indexOf("openModel=") != -1) {
            var fileNav = this.$el.find(".fileNav span.model");
            setTimeout(function () {
                fileNav.click();
                App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
            }, 500);
        } else if (window.location.href.indexOf("type=") != -1) {//如果是我的消息里面点击详情过来的时候直接跳到批注列表页面 和需求确认过
            var fileNav = this.$el.find(".fileNav span.notes");
            App.Project.Settings.viewpointShareUrlId = App.Project.Settings.viewPintId;//批注id
            App.Project.Settings.shareProjectId = App.Project.Settings.projectId;//项目id
            App.Project.Settings.messageBool = true;
            setTimeout(function () {
                fileNav.click();
            }, 500);
        }
        return this;
    },
    isTurnKeyHandle() {//是否存在模块化跳转过来的
        if (window.location.href.indexOf("turnkey") > 0) {
            localStorage.setItem("turnkey", "true");
        } else {
            localStorage.setItem("turnkey", "false");
        }
    },
    initDomHandle(ele) {//初始化页面的结构
        if (!App.Project.Settings.isBimControl) {//如果不是bim
            ele.find("span.model").hide();
            ele.find("span.projectVersion span.text").html('当前版本');
            ele.find("span.projectVersion i").removeClass('myIcon-slanting-right');
        }
    },
    //过滤项目
    filterProject(event) {
        var _this = this;
        clearTimeout(this.defaults.timeoutId);
        this.defaults.timeoutId = setTimeout(function () {
            var $target = $(event.target),
                val = $target.val().trim(),
                filterData = _this.defaults.filterData,//默认渲染的数据
                filterArr = [];//筛选之后的数组
            var $projectList = $(".breadItem .projectList");
            var template = _.templateUrl("/projects/tpls/project/project.container.project.html");
            if (!val) {
                $projectList.find(".container").html(template(filterData));
            } else {
                for (var i = 0, iLen = filterData.length; i < iLen; i++) {
                    var projectArr = [];
                    var filterObj = {};
                    for (var j = 0, jLen = filterData[i].project.length; j < jLen; j++) {
                        var item = filterData[i].project[j];
                        var itemNameLo = item.name.toLowerCase();
                        var itemNameUp = item.name.toUpperCase();
                        if (itemNameLo.indexOf(val) > -1) {
                            projectArr.push(item);
                        } else if (itemNameUp.indexOf(val) > -1) {
                            projectArr.push(item);
                        }
                    }
                    if (projectArr.length > 0) {
                        filterObj.province = filterData[i].province;
                        filterObj.project = projectArr;
                    }
                    if (JSON.stringify(filterObj) !== "{}") {
                        filterArr.push(filterObj);
                    }
                }
                $projectList.find(".container").html(template(filterArr));
            }
        }, 400)
    },
    listSlideUpAndDown(evt) { //版本列表的折叠与打开
        evt.stopPropagation();
        var target = $(evt.target);
        var targetPar = target.parent();
        var targetParSib = targetPar.siblings();
        if (targetParSib.hasClass("versionNoheaderShow")) {
            targetParSib.removeClass("versionNoheaderShow");
        }
        if (targetPar.hasClass("versionNoheaderShow")) {
            targetPar.removeClass("versionNoheaderShow");
        } else {
            targetPar.addClass("versionNoheaderShow");
        }
    },
    //过滤项目版本
    filterProjectVersion(event, t) {
        var $target = t || $(event.target),
            val = $target.val().trim(),
            type = this.currentVersionType || 'release',
            $list = $target.parent().find(".container " + " ." + type + "VersionBox" + " a.item"),
            $noheader = $target.parent().find('.' + type + 'VersionBox' + ' .versionNoheader');
        if (val == "") {
            $(".releaseVersionBox").find(".versionNoheader").removeClass('versionNoheaderShow').eq(0).addClass('versionNoheaderShow');
            $(".changeVersionBox").find(".versionNoheader").removeClass('versionNoheaderShow').eq(0).addClass('versionNoheaderShow');
            $noheader.show();
            $list.show();
            return;
        } else {
            $(".versionNoheader").addClass('versionNoheaderShow');
            $noheader.show();
            $list.show();
            $list.each(function () {
                if ($(this).find(".vName").text().indexOf(val) < 0) {
                    $(this).hide();
                }
            });
            $noheader.each(function () {
                var len = 0;
                var thisItem = $(this).find('.item');
                thisItem.each(function () {
                    if ($(this).css("display") != "block") {
                        len++;
                    }
                })
                if (thisItem.length == len) {
                    $(this).hide();
                }
            })
        }
    },
    triggerUpDown: function (e) {
        //debugger
        this.slideUpAndDown(e, $(e.currentTarget), $(e.currentTarget).find('.modleShowHide'));
    },
    //展开和收起
    slideUpAndDown: function (event, _$parent, $current) {
        var $parent = _$parent || $(event.target).closest('.modle'),
            classkey,
            $modleList = $parent.find(".modleList");
        $modleList = $modleList.length == 0 ? $parent.next() : $modleList;
        _$current = $current || $(event.target);
        _$current.toggleClass("down");
        if ($modleList.is(":hidden")) {
            $modleList.slideDown();
        } else {
            $modleList.slideUp();
        }
        //classkey临时请求数据
        if (_$current.is('.getdata') || _$current.find('.modleShowHide').is('.getdata')) {
            if (_$current.is('.getdata')) {
                classkey = _$current.data('classkey');
                _$current.removeClass('getdata');
            } else {
                classkey = _$current.find('.modleShowHide').data('classkey');
                _$current.find('.modleShowHide').removeClass('getdata');
            }
            $modleList.slideDown();
            $.ajax({
                url: "platform/setting/extensions/" + App.Project.Settings.projectId + "/" + App.Project.Settings.CurrentVersion.id + "/property?classKey=" + classkey + "&elementId=" + App.Project.Settings.ModelObj.intersect.userId
            }).done(function (res) {
                if (res.code == 0) {
                    var props = res.data.properties;
                    for (var str = '', i = 0; i < props.length; i++) {
                        if (res.data.className == '成本管理' || (props[i]['type'] == 'tree')) {
                            try {
                                str += App.Project.properCostTree(props[i]['value']);
                            } catch (e) {
                                _$current.parent().siblings('.modleList').html(App.Project.costDataHtml);
                                return
                            }
                        } else if (props[i]['type'] == 'list') {
                            str += '<li class="modleItem"><span class="modleName overflowEllipsis"><div class="modleNameText overflowEllipsis">' + props[i]['property'] + '</div></span> <span class="modleVal rEnd"></span> </li>';
                            if (props[i]['elementType'] && props[i]['elementType'] == 'link') {
                                var type1 = '',
                                    type2 = '';
                                for (var j = 0; j < props[i]['value'].length; j++) {
                                    if (props[i]['value'][j]['unit'] && props[i]['value'][j]['unit'].slice(0, 2) == "01") {
                                        type1 += '<li class="modleItem"><div class="modleNameText overflowEllipsis modleName2"><a target="_blank" href="' + props[i]['value'][j]['value'] + '">' + props[i]['value'][j]['name'] + '</a>&nbsp;&nbsp;</div></li>';
                                    } else if (props[i]['value'][j]['unit'] && props[i]['value'][j]['unit'].slice(0, 2) == "02") {
                                        type2 += '<li class="modleItem"><div class="modleNameText overflowEllipsis modleName2"><a target="_blank" href="' + props[i]['value'][j]['value'] + '">' + props[i]['value'][j]['name'] + '</a>&nbsp;&nbsp;</div></li>';
                                    } else {
                                        str += '<li class="modleItem"><div class="modleNameText overflowEllipsis modleName2"><a target="_blank" href="' + props[i]['value'][j]['value'] + '">' + props[i]['value'][j]['name'] + '</a>&nbsp;&nbsp;</div></li>';
                                    }
                                }
                                type1 ? str += ('<li class="modleItem"><span class="modleName overflowEllipsis"><div class="modleNameText overflowEllipsis">' +
                                    (App.Local.data['drawing-model'].PAe1 || '过程验收') +
                                    '</div></span> <span class="modleVal rEnd"></span> </li>' + type1) : '';
                                type2 ? str += ('<li class="modleItem"><span class="modleName overflowEllipsis"><div class="modleNameText overflowEllipsis">' +
                                    (App.Local.data['drawing-model'].PIe || '开业验收') +
                                    '</div></span> <span class="modleVal rEnd"></span> </li>' + type2) : '';
                            } else {
                                str += '<li class="modleItem"><div class="modleNameText overflowEllipsis modleName2">' + props[i]['property'] + '</div></li>';
                                for (var j = 0; j < props[i]['value'].length; j++) {
                                    str += '<li class="modleItem"><span class="modleName overflowEllipsis"><div class="modleNameText overflowEllipsis">' + props[i]['value'][j]['property'] + '</div></span> <span class="modleVal rEnd">' + props[i]['value'][j]['value'] + '</span> </li>';
                                }
                            }
                        } else if (props[i]['type'] == 'character') {
                            str += '<li class="modleItem"><span class="modleName overflowEllipsis"><div class="modleNameText overflowEllipsis">' + props[i]['property'] + '</div></span> <span class="modleVal rEnd">' + props[i]['value'] + '</span> </li>';
                        }
                    }
                    //_$current.parent().siblings('.modleList').html(str);
                    if (res.data.className == '质量管理') {
                        //_$current.parent().append(str);
                        //_$current.parent().siblings('.modleList').html(str);
                        //$('.attrClassBox [data-classkey=4]').parent().siblings('.modleList').html(str); //notes by wuweiwei 2017-7-18
                        if ($(".designProperties")) {
                            $($('.designProperties .attrClassBox').find('.modle')[2]).find(".modleList").html(str);
                        }
                        if ($(".planProperties")) {
                            $($('.planProperties .attrClassBox').find('.modle')[2]).find(".modleList").html(str);
                        }
                        if ($(".CostProperties")) {
                            $($('.CostProperties .attrClassBox').find('.modle')[2]).find(".modleList").html(str);
                        }
                        if ($(".QualityProperties")) {
                            $($('.QualityProperties .attrClassBox').find('.modle')[2]).find(".modleList").html(str);
                        }
                        // $($('.attrClassBox').find('.modle')[2]).find(".modleList").html(str);   //add by wuweiwei 2017-8-7-18
                        window.Global.DemoEnv("designLink");
                    } else {
                        _$current.parent().siblings('.modleList').html(str);
                    }
                    //str += '<li class="modleItem">'+
                    //	'<span class="modleName"><div title='<%=subItem.name%>' class="modleNameText overflowEllipsis"><%=subItem.name%></div></span> <span class="modleVal overflowEllipsis"><%=subItem.value%><%=subItem.unit%></span>'+
                    //	'</li>'
                }
            });
        }
        event.stopPropagation();
    },
    //点击面包靴
    breadItemClick: function (event) {
        var $target = $(event.target).closest(".breadItem");
        //没有下拉箭头的 不加载
        if ($target.find(".myIcon-slanting-right").length <= 0) {
            return;
        }
        if ($target.hasClass('project')) {
            var $projectList = $(".breadItem .projectList");
            if (!$projectList.is(":hidden")) {
                return;
            }
            $projectList.find(".loading").show();
            $projectList.find(".listContent").hide();
            $projectList.show();
            this.loadProjectList();
        } else if ($target.hasClass('projectVersion')) {
            var $projectVersionList = $(".breadItem .projectVersionList");
            if (!$projectVersionList.is(":hidden")) {
                return;
            }
            $projectVersionList.find(".loading").show();
            $projectVersionList.find(".listContent").hide();
            $projectVersionList.show();
            this.loadProjectVersionList();
        } else if ($target.hasClass('fileModelNav')) {
            var $fileModelList = $(".breadItem .fileModelList");
            if (!$fileModelList.is(":hidden")) {
                return;
            }
            $fileModelList.show();
        }
    },
    //跳转之前
    beforeChangeProject(event) {
        var $target = $(event.target).closest(".item"),
            href = $target.prop("href");
        if ($target.prop("href").indexOf("noVersion") > -1) {
            alert('暂无版本');
            return false;
        }
        App.count = App.count || 1;
        //destroy 清除不干净 没5次 reload page
        if (App.count > 4) {
            $("#pageLoading").show();
            location.reload();
        } else {
            App.count++;
            if ($target.prop("href") != location.href && App.Project.Settings.Viewer) {
                App.Project.Settings.Viewer.destroy();
                App.Project.Settings.Viewer = null;
            }
        }
    },
    //加载分组项目
    loadProjectList: function () {
        var _this = this;
        var data = {
            URLtype: "fetchCrumbsProject"
        };
        //渲染数据
        App.Comm.ajax(data, function (data) {
            if (data.code == 0) {
                var $projectList = $(".breadItem .projectList");
                var template = _.templateUrl("/projects/tpls/project/project.container.project.html");
                $projectList.find(".container").html(template(data.data));
                $projectList.find(".loading").hide();
                $projectList.find(".listContent").show();
                _this.defaults.filterData = data.data;
            } else {
                $.tip({
                    message: data.message,
                    timeout: 1500,
                    type: "alarm"
                })
            }
        });
    },
    //加载版本
    loadProjectVersionList: function () {
        App.Project.loadVersion(function (data) {
            var $projectVersionList = $(".breadItem .projectVersionList");
            var template = _.templateUrl("/projects/tpls/project/project.container.version.html");
            $projectVersionList.find(".container").html(template(data.data));
            //显示
            $projectVersionList.find(".loading").hide();
            $projectVersionList.find(".listContent").show();
            $projectVersionList.find('.item.selected').click();
        });
    },
    //版本tab 切换
    changeVersionTab: function (event) {
        var $target = $(event.target),
            type = $target.data("type"),
            that = this;
        this.currentVersionType = type;
        $target.addClass("selected").siblings().removeClass("selected");
        this.$('.projectVersionList .txtSearch').val('');
        setTimeout(function () {
            that.filterProjectVersion(null, that.$('.projectVersionList .txtSearch'));
        }, 10)
        //发布版本
        if (type == "release") {
            var $releaseVersionBox = $target.closest(".listContent").find(".releaseVersionBox");
            if ($releaseVersionBox.length <= 0) {
                debugger;
                var _null = $('<div class="releaseVersionBox"><span class="GlobalBlankMessage"><i></i>' +
                    (App.Local.getTranslation('drawing.n-r-f') || '暂无发布版本') +
                    '</span></div>');
                _null.css({
                    'textAlign': 'center',
                    'color': '#ccc'
                })
                $target.closest(".listContent").find(".container").append(_null);
            }
            $target.closest(".listContent").find(".releaseVersionBox").show().siblings().hide();
        } else {
            var $changeVersionBox = $target.closest(".listContent").find(".changeVersionBox");
            if ($changeVersionBox.length <= 0) {
                var _null = $('<div class="changeVersionBox"><span class="GlobalBlankMessage"  data-i18n="[append]data.drawing-model.Nvd"><i></i>' +
                    (App.Local.data['drawing-model'].Nvd || '暂无变更版本') +
                    '</span></div>');
                _null.css({
                    'textAlign': 'center',
                    'color': '#ccc'
                })
                $target.closest(".listContent").find(".container").append(_null);
            }
            $target.closest(".listContent").find(".changeVersionBox").show().siblings().hide();
        }
    },
    //显示和隐藏
    navBarShowAndHide: function (event) {
        var $target = $(event.target);
        if ($target.closest(".leftNav").length > 0) {
            this.navBarLeftShowAndHide();
        } else {
            this.navBarRightShowAndHide();
        }
    },
    //收起和暂开
    navBarLeftShowAndHide: function () {
        App.Comm.navBarToggle($("#projectContainer .leftNav"), $("#projectContainer .projectCotent"), "left", App.Project.Settings.Viewer);
    },
    //右侧收起和暂开
    navBarRightShowAndHide: function () {
        App.Comm.navBarToggle($("#projectContainer .rightProperty "), $("#projectContainer .projectCotent"), "right", App.Project.Settings.Viewer);
    },
    //拖拽改变尺寸
    dragSize: function (event) {
        var $el = $("#projectContainer .rightProperty"),
            dirc = "right",
            $target = $(event.target);
        if ($target.closest(".leftNav").length > 0) {
            dirc = "left";
            $el = $("#projectContainer .leftNav");
        }
        App.Comm.dragSize(event, $el, $("#projectContainer .projectCotent"), dirc, App.Project.Settings.Viewer);
        return false;
    },
    //切换模型浏览器 和 文件浏览器
    switchFileMoldel(event) {
        var $target = $(event.target),
            type = $target.data("type"),
            $projectContainer = this.$el.find("#projectContainer"),
            $projectCotent = $projectContainer.find(".projectCotent");
        App.Project.Settings.fetchNavType = type;
        if (type == "file") {
            App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
            //左右侧
            $projectContainer.find(".rightProperty").removeClass("showPropety");
            $projectContainer.find(".leftNav").show();
            $projectCotent.removeClass("showPropety").show();
            //批注盒子
            $projectContainer.find(".notesBox").hide();
            //内容
            $projectContainer.find(".fileContainer").show();
            $projectContainer.find(".modelContainer").hide();
            //模型tab
            $(".projectContainerApp .projectHeader .projectTab").hide();
            //绑定上传
            var status = App.Project.Settings.CurrentVersion.status;
            if (App.Project.Settings.isBimControl) {
                if (status != 9 && status != 4 && status != 7 && status != 15) {//初始化上传方法
                    $(".fileContainer .btnFileUpload").show();
                    App.Project.upload = App.modules.docUpload.init($(document.body));
                }
            } else {
                if (App.Project.Settings.authBool) {
                    App.Project.upload = App.modules.docUpload.init($(document.body));
                }
            }
            // if (status != 9 && status != 4 && status != 7) {
            //     debugger;
            //     $(".fileContainer .btnFileUpload").show();
            //     //上传
            //     App.Project.upload = App.modules.docUpload.init($(document.body));
            // } else {
            //     //$(".fileContainer .btnFileUpload").hide(); note by wuweiwei
            // }
            $target.addClass("selected").siblings().removeClass("selected");
        } else if (type == "model") {
            App.Project.NotesCollection.resetUrlHandle();// 重置地址栏地址 单不刷新页面
            if (!typeof(Worker)) {
                alert("请使用现代浏览器查看模型");
                return;
            }
            //模型tab
            $(".projectContainerApp .projectHeader .projectTab").show();
            //加载过数据后 直接切换 否则 加载数据
            if (App.Project.Settings.DataModel && App.Project.Settings.DataModel.sourceId) {
                this.typeContentChange(() => $target.addClass("selected").siblings().removeClass("selected"));
                var viewDom = $("#projectContainer").find(".view");
                var viewW = viewDom.width();
                var viewH = viewDom.height();
                viewDom.find("canvas").css("width", viewW).css("height", viewH);
            } else {
                this.fetchModelIdByProject(() => $target.addClass("selected").siblings().removeClass("selected"));
                App.Statistics.sendStatistics({
                    type: 'modelview',
                    modeltype: 'all',
                    projectid: App.currentProject.projectId
                });
            }
            // $projectCotent.show();
        } else if (type == "notes") {
            App.Comm.upload.destroy();
            $(".projectContainerApp .projectHeader .projectTab").hide();
            $projectCotent.addClass("showPropety").hide();
            $projectContainer.find(".leftNav").hide();//关闭左侧树的模块
            $projectContainer.find(".rightProperty").removeClass("showPropety");//关闭右侧属性模块
            $projectContainer.find(".fileContainer").hide();
            $projectContainer.find(".modelContainer").hide();
            var notesBox = this.$el.find(".notesBox");
            notesBox.show();//批注页面展示
            $target.addClass("selected").siblings().removeClass("selected");//导航切换到批注上面
            if (!App.Project.Settings.NotesDatas || localStorage.getItem("NotesDatas") == "undefined") {
                var NotesSearchCondition = new App.Project.NotesSearchCondition;//顶部搜索功能
                var NotesContentView = new App.Project.NotesContentView;//批注内容区域
                notesBox.html(NotesSearchCondition.render().el);
                notesBox.append(NotesContentView.render().el);
            }
            $target.addClass("selected").siblings().removeClass("selected");
        }
        window.Global.DemoEnv("modelTab"); //add by wuweiwei
    },
    //切换
    typeContentChange(callback) {
        var $projectContainer = $("#projectContainer"),
            $projectCotent = $projectContainer.find(".projectCotent"),
            mRight = $projectCotent.data("mRight") || 398;
        //左右侧
        $projectContainer.find(".leftNav").hide();
        $projectCotent.addClass("showPropety");
        $projectContainer.find(".rightProperty").addClass("showPropety")//.width(mRight);
        //内容
        $projectContainer.find(".notesBox").hide();
        $projectContainer.find(".fileContainer").hide();
        $projectContainer.find(".modelContainer").show();
        $projectContainer.find(".projectCotent").show();
        //销毁上传
        App.Comm.upload.destroy();
        callback && callback()
    },
    //获取项目版本Id
    fetchModelIdByProject: function (callback) {
        var data = {
            URLtype: "fetchModelIdByProject",
            data: {
                projectId: App.Project.Settings.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id
            }
        };
        var that = this;
        App.Comm.ajax(data, function (data) {
            if (data.message == "success") {
                if (data.data) {
                    App.Project.Settings.DataModel = data.data;
                    that.renderModel();
                    callback && callback()
                } else {
                    $.tip({
                        message: App.Local.data["drawing-model"].TfCg || "模型转换中",
                        timeout: 1500,
                        type: "alarm"
                    });
                    $(".projectContainerApp .projectHeader .projectTab").hide();
                }
            } else {
                alert(data.message);
            }
        });
    },
    //模型渲染
    renderModel: function () {
        
        //设置onlymodel
        App.Comm.setOnlyModel();
        var that = this;
        this.typeContentChange();
        //渲染模型属性
        //App.Project.renderModelContentByType();
        //return;
        if (App.Project && App.Project.Settings && App.Project.Settings.Viewer) {
            App.Project.Settings.Viewer.destroy();
            App.Project.Settings.Viewer = null;
        }
        var viewer = App.Project.Settings.Viewer = new bimView({
            type: 'model',
            element: $("#projectContainer .modelContainerContent"),
            sourceId: App.Project.Settings.DataModel.sourceId,
            etag: App.Project.Settings.DataModel.etag, //"f3159e36f65d275ab67867a2187f857c" ||
            projectId: App.Project.Settings.projectId,
            projectVersionId: App.Project.Settings.CurrentVersion.id
        });
        viewer.on('viewpoint', function (point) {
            $("#projectContainer .projectNavModelContainer .tree-view:eq(1) .item-content:eq(0)").addClass('open');
            App.Project.ViewpointAttr.ListCollection.add({
                data: [{
                    id: '',
                    name: '新建视点',
                    viewPoint: point
                }]
            })
        });
        viewer.on("click", function (model) {
            
            //取消计划高亮
            var result = that.cancelhighlightPlan(),
                viewer = App.Project.Settings.Viewer,
                isIsolateState = viewer.isIsolate(),
                selectedIds = viewer.getSelectedIds();
            if (isIsolateState) {
                $('#isolation').show();
            } else {
                $('#isolation').hide();
            }
            App.Project.Settings.ModelObj = null;
            if (!model.intersect) {
                if (selectedIds) {
                    var obj,
                        arr = [];
                    if (Object.keys(selectedIds).length == 1) {
                        for (var i in selectedIds) {
                            obj = {
                                userId: i,
                                sceneId: selectedIds[i]['sceneId']
                            }
                        }
                        App.Project.Settings.ModelObj = {
                            intersect: {
                                userId: obj.userId,
                                object: {
                                    userData: {
                                        sceneId: obj.sceneId
                                    }
                                }
                            }
                        };
                        that.viewerPropertyRender();
                    } else {
                        for (var i in selectedIds) {
                            if (arr[0]) {
                                if (arr[0] != selectedIds[i]['classCode']) {
                                    that.resetProperNull();
                                    return;
                                }
                            } else {
                                arr[0] = selectedIds[i]['classCode']
                            }
                        }
                        var uid = Object.keys(selectedIds)[0],
                            info = selectedIds[uid];
                        obj = {
                            userId: uid,
                            sceneId: info['sceneId']
                        };
                        App.Project.Settings.ModelObj = {
                            intersect: {
                                userId: obj.userId,
                                object: {
                                    userData: {
                                        sceneId: obj.sceneId
                                    }
                                }
                            }
                        };
                        that.viewerPropertyRender();
                    }
                } else {
                    that.resetProperNull();
                }
                return;
            } else if (Object.keys(selectedIds).length > 1) {
                that.resetProperNull();
                return;
            }
            App.Project.Settings.ModelObj = model;
            that.viewerPropertyRender();
        });
        //分享
        if (App.Project.Settings.type == "token" && location.hash.indexOf("share") > 0 || App.Project.Settings.viewPintId) {
            viewer.on("loaded", function () {
                //加载数据
                // $(".modelSidebar  .bar-item.m-camera").click();我的消息 定位批注问题
            });
        }
        if (App.Project.Settings.type == "token" && App.Project.Settings.PlanElement && App.Project.Settings.PlanElement.elements.length > 0) {
            viewer.on("loaded", function () {
                var data = {
                    type: "userId",
                    ids: App.Project.Settings.PlanElement.elements
                }
                //高亮
                viewer.highlight(data);
                //半透明
                viewer.translucent(true);
                //var box = App.Project.formatBBox(App.Project.Settings.PlanElement.boundingBox);
                //if (box && box.length) {
                //	App.Project.zoomToBox(App.Project.Settings.PlanElement.elements, box);
                //}
                viewer.zoomToBuilding(0.05, 1);
            });
        }
        viewer.on("loaded", function () {
            //加载数据
            // debugger;
            if (!$("#viewpointInput").attr("data-viewpoint")) {
                that.loadFiveMajor();
            } else {
            }
            viewer.filter({
                ids: ['10.01'],
                type: "classCode"
            });
            $('#lockAxisZ').show();
            if ($("#viewpointInput").data("viewpoint") && App.Project.Settings.Viewer) {
                App.Project.NotesCollection.renderModelCallBackHandle();
            }
            /*add by wuweiwei init filter checkbox state*/
            $($("#specialty .itemContent")[0]).find(".m-lbl").addClass("m-lbl-2");
        });
    },
    //取消高亮
    cancelhighlightPlan() {
        var result = false;
        if ($(".projectHeader .plan").hasClass("selected")) {
            if (!$(".projectPlanNav .item[data-type='model']").hasClass("selected")) {
                //计划 模块化
                var $select = $("#projectContainer .planContainer .planModel").find(".selected");
                if ($select.length > 0) {
                    $select.click();
                    result = true;
                }
            }
            if (!$(".projectPlanNav .item[data-type='analog']").hasClass("selected")) {
                //进度模拟的时候点击其他的
                var $play = $("#projectContainer .planContainer .planAnalog .playOrPause");
                if ($play.hasClass("myIcon-pause")) {
                    $play.click();
                    result = true;
                }
                var $select = $("#projectContainer .planContainer .planAnalog").find(".selected");
                if ($select.length > 0) {
                    $select.click();
                    result = true;
                }
            }
        } else {
            //计划 模块化
            var $select = $("#projectContainer .planContainer .planModel").find(".selected");
            if ($select.length > 0) {
                $select.click();
                result = true;
            }
            //进度模拟的时候点击其他的
            var $play = $("#projectContainer .planContainer .planAnalog .playOrPause");
            if ($play.hasClass("myIcon-pause")) {
                $play.click();
                result = true;
            }
            var $select = $("#projectContainer .planContainer .planAnalog").find(".selected");
            if ($select.length > 0) {
                $select.click();
                result = true;
            }
        }
        return result;
    },
    //只加载5大专业
    loadFiveMajor() {
        //|内装&标识|内装&导识
        var $this, test = /建筑|结构|幕墙|采光顶|景观/;
        $(".bim .itemNode:first>ul>li>.itemContent>.treeText").each(function () {
            $this = $(this);
            if (!test.test($this.text())) {
                $this.prev().find('input').click();
            }
        });
    },
    //重置 内容为空
    resetProperNull() {
        App.Project.Settings.ModelObj = "";
        const selectElement = (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件' );
        $(".rightPropertyContentBox .CostProperties").html('<div class="nullTip">' +
            selectElement +
            '</div>');
        $(".rightPropertyContentBox .QualityProperties").html('<div class="nullTip">' +
            selectElement +
            '</div>');
        $(".rightPropertyContentBox .planProperties").html('<div class="nullTip">' +
            selectElement +
            '</div>');
        $(".rightPropertyContentBox .designProperties").html('<div class="nullTip">' +
            selectElement +
            '</div>');
        $('#selected .selectTree').html('');
        // var projectNav = App.Project.Settings.projectNav,
        // 	property = App.Project.Settings.property,
        // 	$el;
        // if (property == "poperties") {
        // 	//if (projectNav == "design") {
        // 	//	//设计
        // 	//	$el = $(".rightPropertyContentBox .designProperties");
        // 	if (projectNav == "cost") {
        // 		//成本
        // 		$el = $(".rightPropertyContentBox .CostProperties");
        // 	} else if (projectNav == "quality") {
        // 		//质量
        // 		$el = $(".rightPropertyContentBox .QualityProperties");
        // 	} else if (projectNav == "plan") {
        // 		//计划
        // 		$el = $(".rightPropertyContentBox .planProperties");
        // 	}else{
        // 		//设计  或者没有选中任何一栏时的默认属性页
        // 		$el = $(".rightPropertyContentBox .designProperties");
        // 	}
        // }
        // if ($el) {
        // 	$el.html('<div class="nullTip">请选择构件</div>');
        // }
    },
    //设置渲染
    viewerPropertyRender() {
        var projectNav = App.Project.Settings.projectNav,
            property = App.Project.Settings.property,
            Intersect = App.Project.Settings.ModelObj.intersect;
        //属性，四个tab 都一样
        if (((projectNav == "design" || projectNav == "cost" || projectNav == "quality" || projectNav == "plan" || projectNav == '') && property == "poperties")) {
            App.Project.DesignAttr.PropertiesCollection.projectId = App.Project.Settings.projectId;
            App.Project.DesignAttr.PropertiesCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
            var userSceneId = Intersect.userId.split('.')[0];
            App.Project.DesignAttr.PropertiesCollection.fetch({
                data: {
                    elementId: Intersect.userId,
                    sceneId: userSceneId || ""
                }
            });
        }
    },
    //渲染属性
    renderProperties(model) {
        var data = model.toJSON().data,
            templateProperties = _.templateUrl("/projects/tpls/project/design/project.design.property.properties.html"),
            $designProperties = this.$el.find(".singlePropetyBox .designProperties");
        App.Project.userProps.call(this, data, function (data) {
            $designProperties.html(templateProperties(data));
            //其他属性
            App.Project.propertiesOthers.call({
                $el: $designProperties
            }, "plan|cost|quality|dwg");
        });
        /*	$designProperties.html(templateProperties(data));
            //其他属性
            App.Project.propertiesOthers.call({
                $el: $designProperties
            }, "plan|cost|quality|dwg");*/
        //	App.Project.userProps.call(this,data);
    }
});