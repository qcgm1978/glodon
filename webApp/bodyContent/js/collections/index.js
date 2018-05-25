//@ sourceURL=bodyContent.js
/*
 * @require /bodyContent/js/views/todolist.js
 */
var App = App || {};
App.BodyContent.control = {
    init: function () {
        $("#contains").empty();
        new App.BodyContent.App().render(); //渲染框架
        this.viewCacheTodo = this.viewCacheTodo || new App.BodyContent.todosList();
        this.viewCacheDone = this.viewCacheDone || new App.BodyContent.doneList();
        this.viewCacheMonthEnd = this.viewCacheMonthEnd || new App.BodyContent.monthEndList();
        this.viewCacheMonthStart = this.viewCacheMonthStart || new App.BodyContent.monthStartList();
        this.viewCacheProclamation = this.viewCacheProclamation || new App.BodyContent.proclamationList();
        $("#layoutMonth .article table").append(this.viewCacheMonthEnd.render().el)
            .append(this.viewCacheMonthStart.render().el);
        $("#proclamation").append(this.viewCacheProclamation.render().el);
        this.loadData(this.todoCollection, {
            status: 1,
            pageIndex: 1,
            pageItemCount: 12
        });
        this.loadData(this.doneCollection, {
            status: 2,
            pageIndex: 1,
            pageItemCount: 12
        });
        this.loadData(this.slideCollection, {
            type: 3,
            pageIndex: 1,
            pageItemCount: 30
        });
        this.loadData(this.monthEndCollection, {
            type: 2,
            userId: App.Comm.user('userId')
        });
        this.loadData(this.monthStartCollection, {
            type: 1,
            userId: App.Comm.user('userId')
        });
        var data = {
            title: "",
            status: 1,
            pageIndex: 1,
            pageItemCount: 30
        }
        this.loadData(this.proCollection, data);
        //切换 计划开始 结束
        $(".conMonth .conHeader span").on("click", function () {
            var _type = $(this).data("type");
            var hrefUrl = $(this).siblings("a").data("morehref");
            if ($(this).hasClass("active")) return;
            $(this).addClass("active").siblings("span").removeClass("active");
            if (_type == "start") {
                $("#monthMore").attr("href", hrefUrl + "&MonthType=1");
                $("#endTaskContainer thead .startTime")
                    .text((App.Local.data['drawing-model'].PInS || "计划开始日期"))
                    .attr('title', App.Local.data['drawing-model'].PInLS);
                $("#monthStart").show();
                $("#monthEnd").hide();
            } else if (_type == "end") {
                $("#monthMore").attr("href", hrefUrl + "&MonthType=2");
                $("#endTaskContainer thead .startTime")
                    .text((App.Local.data['drawing-model'].PInLES || "计划开始日期"))
                    .attr('title', App.Local.data['drawing-model'].PInLE);
                $(this).css({
                    "border-radius": "0px"
                });
                $("#monthStart").hide();
                $("#monthEnd").show();
            } else if (_type == "todoTab") {
                $("#todos").show();
                $("#dones").hide();
            } else if (_type == "doneTab") {
                $("#todos").hide();
                $("#dones").show();
            }
        });
        this.initEvent();
    },
    initEvent: function () {
        var _userInfo = JSON.parse(localStorage.getItem("user"));
        $('.linkNavItem').on('click', function () {
            if (_userInfo.outer) {
                alert('没有操作权限')
            } else {
                var url = $(this).attr('murl');
                App.Statistics.sendStatistics({
                    type: 'quickpass',
                    tosys: $(this).data('type')
                });
                window.open(url, '_blank');
            }
        })
        this.initAuth(_userInfo);
    },
    initAuth: function (user) {
        var isKeyUser = user.isKeyUser || false;
        var _AuthObj = App.AuthObj || {};
        var Auth = _AuthObj.service || {};
        if (!Auth.app) {
            $('#auth-app').remove();
        }
        if (!Auth.auth && !isKeyUser) {
            $('#auth-auth').remove();
        }
        if (!Auth.log) {
            $('#auth-log').remove();
        }
        if (!Auth.sys) {
            $('#auth-sys').remove();
        }
        if (!Auth.project) {
            $('#auth-project').remove();
        }
    },
    post: function (id) {
        $('#dataLoading').hide();
        $('#pageLoading').hide();
        $("#topBar li").hide();
        new App.BodyContent.postDetailView();
        this.postDetailCollection.fetch({
            reset: true,
            data: {
                id: id
            }
        })
    },
    postDetailCollection: new (Backbone.Collection.extend({
        model: App.BodyContent.model,
        // urlType: "fetchBodyContentNotice",
        urlType: "getNotice",
        parse: function (response) {
            if (response.message == "success") {
                return response.data;
            }
        }
    })),
    todoCollection: new (Backbone.Collection.extend({
        model: App.BodyContent.model,
        urlType: "fetchBodyContentTodos",
        parse: function (response) {
            if (response.message == "success") {
                var _data = response.data.items;
                try {
                    $("#todoCounter").text(response.data.totalItemCount);
                } catch (e) {
                }
                return _data;
            }
        }
    })),
    doneCollection: new (Backbone.Collection.extend({
        model: App.BodyContent.model,
        urlType: "fetchBodyContentTodos",
        parse: function (response) {
            if (response.message == "success") {
                var _data = response.data.items;
                try {
                    //$("#doneCounter").text(response.data.totalItemCount);
                } catch (e) {
                }
                return _data;
            }
        }
    })),
    slideCollection: new (Backbone.Collection.extend({
        model: App.BodyContent.model,
        urlType: "fetchBodyContentSilde",
        parse: function (response) {
            if (response.message == "success") {
                return response.data;
            }
        }
    })),
    monthEndCollection: new (Backbone.Collection.extend({
        model: App.BodyContent.model,
        urlType: "fetchBodyContentMonthEnd",
        parse: function (response) {
            if (response.message == "success") {
                return response.data;
            }
        }
    })),
    monthStartCollection: new (Backbone.Collection.extend({
        model: App.BodyContent.model,
        urlType: "fetchBodyContentMonthStart",
        parse: function (response) {
            if (response.message == "success") {
                return response.data;
            }
        }
    })),
    proCollection: new (Backbone.Collection.extend({
        model: App.BodyContent.model,
        urlType: "getServersNoticeList",
        parse: function (response) {
            if (response.message == "success") {
                return response.data.items;
            }
        }
    })),
    loadData: function (collection, data, urlParam) {
        var _this = this;
        //数据重置
        collection.reset();
        // load list
        data = data || {};
        collection.fetch({
            data: data,
            success: function (collection, response, options) {
                //$("#pageLoading").hide();
                var _$container = null;
                //轮播插件是jquery对象、所以直接加载显示、不经过Backbone
                if (collection == App.BodyContent.control.slideCollection && response.message == "success") {
                    var _datas = response.data,
                        _len = _datas.length,
                        _nodata = null,
                        sildeData = [];
                    _len >= 5 ? _datas.length = 5 : "";
                    if (_len == 0) {
                        _nodata = function () {
                            $(".mmhSlider").html('<!--<img style="transform: translate(100%,-100%);background: no-repeat;" src="/static/dist/images/bodyContent/images/nodata.png" class="noDataTip">--><div class="noDataTip">' +
                                (App.Local.data["drawing-model"].Npe || '暂无可访问项目') +
                                '</div>');
                            $("#slideTitle").html((App.Local.data["system-module"].Project || '项目'));
                        }
                    }
                    _.each(_datas, function (item) {
                        sildeData.push({
                            image: item.logoUrl ? item.logoUrl['large'] : '',
                            projectId: item.id,
                            versionId: item.version ? item.version.id : '845160092246208',
                            title: item.name
                        })
                    })
                    if ($('.mmhSlider').children().length == 0) {
                        $(".mmhSlider").mmhSlider({
                            delay: 5000,
                            data: sildeData,
                            noData: _nodata,
                            onChange: function (d) {
                                $("#slideTitle").html(d.title);
                            }
                        })
                    }
                }
                //空数据提示视图
                if (!collection.models.length) {
                    if (collection == App.BodyContent.control.todoCollection) {
                        _$container = $("#todos");
                    }
                    if (collection == App.BodyContent.control.monthEndCollection) {
                        _$container = $("#endTaskContainer");
                    }
                    if (collection == App.BodyContent.control.proCollection) {
                        _$container = $("#postContainer");
                    }
                    if (collection == App.BodyContent.control.doneCollection) {
                        _$container = $("#dones");
                    }
                    _$container && _$container.html("<span class='noDataTip'>" +
                        (App.Local.data['drawing-model'].Ndd1 || "暂无内容") +
                        "</span>")
                }
                if (collection == App.BodyContent.control.todoCollection) {
                    $('.loading1').hide();
                }
            }
        });
    }
};