(function ($, win) {
    //默认设置
    win.App = {
        API: {
            Settings: {
                hostname: "/",
                debug: false
            },
            URL: {
                fetchQualityModelById: "sixD/{projectId}/{versionId}/quality/element",
                fetchDesignProperties: "sixD/{projectId}/{projectVersionId}/property", //设计属性 ?sceneId={sceneId}&elementId={elementId}
                fetchProjectVersionInfo: "platform/project/{projectId}/version/{projectVersionId}", //项目版本信息,
                attrDwg: 'doc/{projectId}/{versionId}/file/tag'//图纸
            }
        }
    };
    App.Local = {
        getTranslation: function getTranslation(fields) {
            try {
                return fields.split('.').reduce(function (cur, item) {
                    return cur[item];
                }, this.data);
            } catch (e) {
                return null;
            }
        },
    };
    App.Local.data = {
        "login": {},
        "nav": {},
        "todo": {},
        "announce": {},
        "plan": {},
        "source": {},
        "system": {},
        "footer": {},
        "source-model": {},
        "source-data": {},
        "model-view": {},
        "family-list": {},
        "online-service": {},
        "drawing-model": {},
        "system-module": {},
        "QuartetRegistration": {}
    };
    //模态框模型选择器对象
    var ModelSelection = function (options) {
        
        //强制new
        if (!(this instanceof ModelSelection)) {
            return new ModelSelection(options);
        }
        var defaults = {
            btnText: '确&nbsp;&nbsp;定'
        }
        //合并参数
        this.Settings = $.extend(defaults, options);
        Project.Settings = this.Settings;
        this.init();
    }
    ModelSelection.prototype = {
        init: function () {
            var self = this,
                time = Math.round(Math.random() * 9999),
                srciptUrl = '/static/dist/libs/libsH5.js?t=' + time,
                styleUrl = '/static/dist/libs/libsH5_20160313.css?t=' + time,
                $script = '<script src="' + srciptUrl + '"></script>',
                $css = '<link rel="stylesheet" href="' + styleUrl + '" />',
                $script2 = '<script src="/static/dist/comm/comm_20160313.js?t=' + time + '"></script>',
                $css2 = '<link rel="stylesheet" href="/static/dist/comm/comm_20160313.css?t=' + time + '" />';
            if (!ModelSelection.isLoad) {
                try {
                    $('head').append($css, $script, $css2, $script2);
                } catch (e) {
                    debugger;
                }
                ModelSelection.isLoad = true;
            }
            self.dialog();
            self.controll();
        },
        controll: function () {
            var self = this;
            $('#lockAxisZ').click(function () {
                var selected = $(this).is('.selected');
                $(this).toggleClass('selected');
                if (selected) {
                    $(this).find('span').text('Z轴未锁')
                } else {
                    $(this).find('span').text('Z轴已锁')
                }
                self.lockAxisZ(!selected);
            });
            self.$dialog.on('click', '.toolsBtn', function () {
                self.getSelected();
            }).on('click', '.dialogClose', function () {
                self.$dialog.remove();
                self.$dialog = null;
            }).on('click', '.dialogOk', function () {
                var setting = self.Settings;
                if (setting.callback && setting.callback.call(this) !== false) {
                    self.$dialog.remove();
                    self.$dialog = null;
                    return self.viewData
                }
            }).on('click', '.rightBar .m-openTree,.rightBar .m-closeTree', function () {
                var $this = $(this),
                    $li = $this.closest('.itemNode');
                $this.toggleClass('m-openTree m-closeTree');
                $li.toggleClass('open');
            })
        },
        dialog: function () {
            var self = this,
                Settings = this.Settings,
                $dialog;
            if (this.$dialog) {
                $dialog = self.$dialog;
            } else {
                $dialog = self.$dialog = $('<div class="modelSelectDialog"></div>');
                var $body = $('<div class="dialogBody"></div>'),
                    $modelView = self.$modelView = $('<div id="modelView" class="model"></div>')
            }
            $dialog.append($body);
            //$("body").append($dialog);
            setTimeout(function () {
                self.renderModel();
                Project.getname();
            }, 10);
        },
        loadFiveMajor: function () {
            //|内装&标识|内装&导识
            var $this, test = /建筑|结构|幕墙|采光顶|景观/;
            $(".bim .itemNode:first>ul>li>.itemContent>.treeText").each(function () {
                $this = $(this);
                if (!test.test($this.text())) {
                    $this.prev().find('input').click();
                }
            });
        },
        renderModel: function () {
            App.Comm.navBarToggle($("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", Project.Viewer);
            //设置onlymodel
            let _this = this;
            App.Global || (App.Global = {});
            App.Comm.setOnlyModel();
            console.log(this.Settings.etag)
            this.viewer = new bimView({
                type: this.Settings.type,
                element: $('.projectCotent'),
                sourceId: this.Settings.sourceId,
                etag: this.Settings.etag,
                isSingle: this.Settings.isSingle ? true : false,
                projectId: this.Settings.projectId,
                projectVersionId: this.Settings.projectVersionId
            });
            this.viewer.getMakerObject().setMarkerClickCallback((info) => {
                if (info) {
                    let elementId = query.modelId + '.' + info.userId;
                    this.viewer.viewer.getFilter().setSelectedIds([elementId]);
                    query.viewer.viewer.viewer.render();
                    propertiesCollection.projectId = "1";
                    propertiesCollection.projectVersionId = "784306105035931";
                    propertiesCollection.fetch({
                        data: {
                            elementId: elementId,
                            sceneId: query.modelId
                        }
                    });
                    $("#isolation").show();
                } else {
                    this.viewer.viewer.getFilters().setSelectedIds();
                    query.viewer.viewer.viewer.render();
                    $("#isolation").hide();
                    $('.designProperties').html('')
                }
            });
            Project.Viewer = this.viewer;
            $('.m-camera').addClass('disabled').attr('disabled', 'disabled');
            this.viewer.on("loaded", function () {
                $('#lockAxisZ').show();
                if ($('.changeBtn').text() == "查看项目模型") {
                    //单模型
                    //$('.m-miniScreen').click();
                    $.ajax({
                        url: "/sixD/" + query.projectId + '/' + query.projectVersionId + "/bounding/box?sceneId=" + query.modelId + "&elementId=" + (query.modelId + '.' + query.uid)
                    }).done(function (data) {
                        //console.log(data)
                        if (data.code == 0) {
                            var min = data.data.min,
                                max = data.data.max,
                                boundingBox = data.data;
                            var info = {
                                    id: parseInt(10000 * Math.random()),
                                    userId: query.uid,
                                    shapeType: parseInt(query.type), //modify by wuweiwei 2017-7-17
                                    position: {
                                        x: query.x,
                                        y: query.y,
                                        z: query.z
                                    },
                                    boundingBox: boundingBox,
                                    state: query.state || 0
                                },
                                box = Project.formatBBox(info.boundingBox),
                                ids = [query.modelId + '.' + info.userId];
                            query.box = box;
                            query.ids = ids;
                            query.info = info;
                            // alert(ids)
                            setTimeout(() => {
                                Project.zoomModel(ids, box);
                            }, 1000);
                            Project.showMarks(JSON.stringify(info));
                        }
                    });
                } else {
                    if (query.box) {
                        // alert(3);
                        setTimeout(() => {
                            Project.zoomModel([query.modelId + '.' + query.uid], query.box);
                            _this.loadFiveMajor();
                        }, 1000);
                        Project.showMarks(JSON.stringify(query.info));
                    } else {
                        $.ajax({
                            url: "/sixD/" + query.projectId + '/' + query.projectVersionId + "/bounding/box?sceneId=" + query.modelId + "&elementId=" + (query.modelId + '.' + query.uid)
                        }).done(function (data) {
                            //console.log(data)
                            if (data.code == 0) {
                                var min = data.data.min,
                                    max = data.data.max,
                                    boundingBox = data.data;
                                var info = {
                                        id: parseInt(10000 * Math.random()),
                                        userId: query.uid,
                                        shapeType: parseInt(query.type), //modify by wuweiwei 2017-7-17
                                        position: {
                                            x: query.x,
                                            y: query.y,
                                            z: query.z
                                        },
                                        boundingBox: boundingBox,
                                        state: query.state || 0
                                    },
                                    box = Project.formatBBox(info.boundingBox),
                                    ids = [query.modelId + '.' + info.userId];
                                query.box = box;
                                query.ids = ids;
                                query.info = info;
                                setTimeout(() => {
                                    // alert(2)
                                    Project.zoomModel(ids, box);
                                }, 1000);
                                Project.showMarks(JSON.stringify(info));
                            }
                        });
                    }
                }
                //Project.showInModel(query.acceptanceId,query.type);
            });
            // debugger;
            // this.viewer.getMakerObject().setMarkerClickCallback((marks) => {
            //     marks ? query.viewer.viewer.setSelectedIds("6449f5912491ec33d160eb05c3fd2679.6ce2a3a0-8f4f-47d1-9043-175d071dc2e2-001d846f") : query.viewer.viewer.setSelectedIds();
            //     query.viewer.viewer.viewer.render();
            // });
            this.viewer.on("click", function (model) {
                var viewer = Project.Viewer,
                    isIsolateState = viewer.isIsolate();
                if (isIsolateState) {
                    $('#isolation').show();
                } else {
                    $('#isolation').hide();
                }
                if (!model.intersect) {
                    //that.resetProperNull();
                    return;
                }
                Project.intersect = model.intersect;
                //console.log(model);
                propertiesCollection.projectId = "1";
                propertiesCollection.projectVersionId = "784306105035931";
                var userSceneId = model.intersect.userId.split('.')[0];
                propertiesCollection.fetch({
                    data: {
                        elementId: model.intersect.userId,
                        sceneId: userSceneId
                    }
                });
            });
        }
    }
    //Project模型操作方法
    var Project = {
        Settings: {},
        templateCache: [],
        //获取模板根据URL
        templateUrl: function (url, notCompile) {
            if (url.substr(0, 1) == ".") {
                url = "/static/dist/tpls" + url.substr(1);
            } else if (url.substr(0, 1) == "/") {
                url = "/static/dist/tpls" + url;
            }
            if (Project.templateCache[url]) {
                return Project.templateCache[url];
            }
            var result;
            $.ajax({
                url: url,
                type: 'GET',
                async: false
            }).done(function (tpl) {
                if (notCompile) {
                    result = tpl;
                } else {
                    result = _.template(tpl);
                }
            });
            Project.templateCache[url] = result;
            return result;
        },
        //获取url 参数
        GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1),
                    strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        showInModel: function (id, type) {
            var _this = this;
            var data = {
                URLtype: "fetchQualityModelById",
                data: {
                    type: type == 0 ? 0 : 2,
                    projectId: query.projectId,
                    versionId: query.projectVersionId,
                    acceptanceId: id
                }
            };
            //获取构件ID type 0：开业验收 1：过程验收 2：隐患
            App.Comm.ajax(data, function (data) {
                if (data.code == 0) {
                    if (data.data) {
                        //console.log(data)
                        var location = data.data.location,
                            _temp = JSON.parse(location);
                        box = _this.formatBBox(_temp.bBox || _temp.boundingBox);
                        ids = [_temp.userId];
                        //$target.data("userId", ids);
                        //$target.data("box", box);
                        //$target.data("location", location);
                        _this.zoomModel(ids, box);
                        _this.showMarks(location);
                    }
                }
            });
        },
        showMarks: function (marks) {
            if (!_.isArray(marks)) {
                marks = [marks];
            }
            //console.log(marks)
            Project.Viewer.loadMarkers(marks);
        },
        //通过userid 和 boundingbox 定位模型
        zoomModel: function (ids, box) {

            Project.Viewer.clearIsolate();
            Project.Viewer.clearFilterTranslucentOthersUserIDList();
            //定位
            Project.Viewer.zoomToBox(box, 0.5);

            Project.Viewer.highlight({
                type: 'userId',
                ids: undefined
            });     

            Project.Viewer.setSelectedIds(ids);

            //半透明
            //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, App.Project.Settings.Viewer.viewer);
            Project.Viewer.setTranslucentUnselected();
            Project.Viewer.clearSelection();

            //高亮
            //console.log(ids)
            Project.Viewer.highlight({
                type: 'userId',
                ids: ids
            });
        },
        //转换bounding box数据
        formatBBox: function (data) {
            if (!data) {
                return [];
            }
            var box = [],
                min = data.min,
                minArr = [min.x, min.y, min.z],
                max = data.max,
                maxArr = [max.x, max.y, max.z];
            box.push(minArr);
            box.push(maxArr);
            return box;
        },
        getname: function () {
            var data = {
                URLtype: "fetchProjectVersionInfo",
                data: {
                    projectId: query.projectId,
                    projectVersionId: query.projectVersionId
                }
            };
            //获取构件ID type 0：开业验收 1：过程验收 2：隐患
            App.Comm.ajax(data, function (data) {
                if (data.code == 0) {
                    if (data.data) {
                        $('.project .text').text(data.data.projectName);
                        $('.projectVersion .text').text(data.data.name);
                    }
                }
            });
        },
        //模型属性 dwg 图纸
        attrDwg: function () {
            var modelId = query.elementId.split('.')[0],
                that = this,
                attrDwgBoxDom, modleShowHide, modleListDom,
                data = {
                    URLtype: 'attrDwg',
                    data: {
                        projectId: query.projectId,
                        versionId: query.projectVersionId,
                        modelId: modelId
                    }
                },
                liTpl = '<li class="modleItem"><a data-id="<%=id%>" href="/static/dist/app/project/single/filePreview.html?id={id}&projectId=' + query.projectId + '&projectVersionId=' + query.projectVersionId + '" target="_blank" ><div class="modleNameText overflowEllipsis modleName2">varName</div></a></li>';
            App.Comm.ajax(data, (data) => {
                if (data.code == 0) {
                    //debugger
                    if (data.data.length > 0) {
                        var lis = '';
                        $.each(data.data, function (i, item) {
                            lis += liTpl.replace("varName", item.name).replace('{id}', item.id);
                        });
                        //start 张延凯修改 初始化的时候视图的默认关闭状态
                        attrDwgBoxDom = $(".attrDwgBox");
                        attrDwgBoxDom.show();
                        modleShowHide = attrDwgBoxDom.find(".modleShowHide");
                        modleListDom = attrDwgBoxDom.find(".modleList");
                        modleListDom.html(lis);
                        modleListDom.css("display", 'none');
                        if (modleShowHide.hasClass('down')) {
                            modleShowHide.removeClass('down');
                        }
                        //end 张延凯修改 初始化的时候视图的默认关闭状态
                        // that.$el.find(".attrDwgBox").show().find(".modleList").html(lis);//张延凯修改 图纸默认隐藏
                    }
                }
            });
        }
    }
    // 属性 collection
    var propertiesCollection = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    title: ""
                }
            }
        }),
        urlType: "fetchDesignProperties",
        parse: function (response) {
            if (response.code == 0) {
                return response;
            }
        }
    }));
    //过程检查
    var property = new (Backbone.View.extend({
        tagName: "div",
        className: "QualityProperties",
        initialize: function () {
            //this.listenTo(App.Project.QualityAttr.PropertiesCollection,"add",this.addOne);
            this.listenTo(propertiesCollection, "add", this.addOne);
            this.bindEvent();
        },
        //事件绑定
        bindEvent() {
            var that = this,
                $projectContainer = $("#projectContainer");
            //收起 暂开 属性内容
            $projectContainer.on("click", ".modleShowHide", function () {
                $(this).toggleClass("down");
                var $modleList = $(this).parent().siblings(".modleList");
                if (!$modleList.length) {
                    $modleList = $(this).parent().find(".modleList");
                }
                $modleList.slideToggle();
            });
            //收起 暂开 属性 右侧
            $projectContainer.on("click", ".rightProperty .slideBar", function () {
                App.Comm.navBarToggle($("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", Project.Viewer);
            });
            //拖拽 属性内容 右侧
            $projectContainer.on("mousedown", ".rightProperty .dragSize", function (event) {
                App.Comm.dragSize(event, $("#projectContainer .rightProperty"), $("#projectContainer .projectCotent"), "right", Project.Viewer);
            });
            //tree toggle show  hide
            $projectContainer.on("click", ".nodeSwitch", function (event) {
                var $target = $(this);
                if ($target.hasClass("on")) {
                    $target.closest("li").children("ul").hide();
                    $target.removeClass("on");
                } else {
                    $target.closest("li").children("ul").show();
                    $target.addClass("on");
                }
                event.stopPropagation();
            })
        },
        events: {},
        //渲染
        render: function () {
            this.$el.html('<div class="nullTip">请选择构件</div>');
            return this;
        },
        template: Project.templateUrl("/projects/tpls/project/design/project.design.property.properties.html"),
        //获取数据后处理
        addOne: function (model) {
            var data = model.toJSON().data;
            var temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            this.$el.html(this.template(temp));
            $('.designProperties').html(this.$el);
            Project.attrDwg();
        }
    }));
    win.ModelSelection = ModelSelection;
    win.project = Project;
    var CommApi = {
        // getCookie: function (key, cookis) {//获取cookie,然后判断是否自动登录
        //     var cooks = cookis || document.cookie,
        //         items = cooks.split("; "),
        //         result,
        //         len = items.length,
        //         str, pos;
        //     for (var i = 0; i < len; i++) {
        //         str = items[i];
        //         pos = str.indexOf('=');
        //         name = str.substring(0, pos);
        //         if (name == key) {
        //             result = str.substring(pos + 1);
        //             break;
        //         }
        //     }
        //     return result;
        // },
        getSSO: function (cooks) {
            var AuthUser_AuthNum = this.getCookie("AuthUser_AuthNum", cooks);
            var AuthUser_AuthToken = this.getCookie("AuthUser_AuthToken", cooks);
            var AuthUser_AuthMAC = this.getCookie("AuthUser_AuthMAC", cooks);
            return {
                "AuthUser_AuthNum": AuthUser_AuthNum,
                "AuthUser_AuthToken": AuthUser_AuthToken,
                "AuthUser_AuthMAC": AuthUser_AuthMAC
            };
        },
        checkSSO: function (cooks, callback) {
            var url = "/platform/login/inner";
            var SSO = this.getSSO(cooks);
            $.ajax({
                url: url,
                async: false,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(SSO),
                success: function (data) {
                    var obj, p, i;
                    if (data.code == 0) {
                        obj = data.data;
                        for (var p in obj) {
                            CommApi.setCookie(p, obj[p]);
                        }
                        callback ? callback() : Login.getUserInfo();
                    }
                },
                error(msg) {
                    alert('error ' + msg)
                }
            });
        },
        requestCurrent: function (isOk) {
            $.ajax({
                url: '/platform/user/current?t=' + (+new Date()),
                async: false
            }).done(function (data) {
                if (typeof(data) == "string") {
                    data = JSON.parse(data);
                }
                //登录成功
                if (data.code == 0) {
                    isOk = true;
                } else {
                    alert("token过期.");
                }
            });
            return isOk;
        },
        checkLogin: function (appkey, token) {
            let isOk = false, self = this;
            if (appkey && token) {
                //token 验证
                $.ajax({
                    url: "/platform/token",
                    data: {
                        appKey: appkey,
                        token: token
                    },
                    async: false
                }).done(function (data) {
                    if (data.code === 0) {
                        CommApi.setCookie("token_cookie", data.data);
                        isOk = true;
                    } else {
                        alert("验证失败");
                    }
                }).fail(function (data) {
                    if (data.status == 400) {
                        alert("token过期");
                    }
                });
            } else {
                this.checkSSO(document.cookie, function () {
                    
                    //获取当前用户验证登录状态
                    isOk = self.requestCurrent(isOk);
                })
            }
            return isOk;
        },
        cookieNames: function (cookies) {
            var items = cookies.split("; ");
            var names = [],
                len = items.length,
                str, pos;
            for (var i = 0; i < len; i++) {
                str = items[i];
                pos = str.indexOf('=');
                names.push(str.substring(0, pos));
            }
            return names;
        },
        setCookies: function (cookis) {
            var keys = this.cookieNames(cookis),//  cookis.match(/[^ =;]+(?=\=)/g),
                val;
            for (var i = 0; i < keys.length; i++) {
                val = this.getCookie(keys[i], cookis);
                this.setCookie(keys[i], val);
            }
        },
        setCookie: function (name, value) {
            try {
                var Days = 0.01,
                    exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                // var domain = window.location.host.substring(window.location.host.indexOf("."));
                var domain = (/^(\d+\.?)+$/.test(location.host) ? window.location.host : (window.location.host.substring(window.location.host.indexOf("."))));
                document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain + ";";
            } catch (e) {
                alert(e);
            }
        },
        getCookie: function (name, cookis) {
            var cooks = cookis || document.cookie,
                items = cooks.split("; "),
                result,
                len = items.length,
                str, pos;
            for (var i = 0; i < len; i++) {
                str = items[i];
                pos = str.indexOf('=');
                var key = str.substring(0, pos);
                if (name == key) {
                    result = str.substring(pos + 1);
                    break;
                }
            }
            return result;
        },
        //删除cookie
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 31 * 24 * 60 * 60 * 1000);
            var cval = this.getCookie(name);
            // var domain = window.location.host.substring(window.location.host.indexOf("."));
            var domain = (/^(\d+\.?)+$/.test(location.host) ? window.location.host : (window.location.host.substring(window.location.host.indexOf("."))));
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=" + domain + ";path=/";
        }
    }
    win.CommApi = CommApi;
})($, window)