//@ sourceURL=libsH5.js
/**
 * @require /BIMperformance/libsH5/js/bimView.js
 */
'use strict'
;(function ($) {
    bimView.sidebar = {
        treeCheckCount: 0,
        init: function (options, obj) {
            var self = this;
            var modelBgColor = bimView.comm.getModelBgColor();
            self._dom = {
                lockAxis: $('<div id="lockAxisZ"><i class="m-lockAxisZ" data-id=""></i><span >' +
                    (App.Local.data['model-view'].Us || 'Z轴未锁') +
                    '</span></div>'),
                isolation: $('<div id="isolation"><i class="bar-item m-xuanban" title="' +
                    (App.Local.data['drawing-model'].MSe || '选中构件半透明') +
                    '" data-id="setTranslucentSelected" data-type="view" data-group="2"></i><i class="bar-item m-weixuanban" title="' +
                    (App.Local.data['drawing-model'].MSe1 || '未选中构件半透明') +
                    '" data-id="setTranslucentUnselected" data-type="view" data-group="3"></i><i class="bar-item m-hideSelected" title="' +
                    (App.Local.data['drawing-model'].HSs || '隐藏选中构件') +
                    '" data-id="setHideSelected" data-type="view" data-group="4"></i><i class="bar-item m-hideNotSelected" title="' +
                    (App.Local.data['drawing-model'].HUs || '隐藏未选中构件') +
                    '" data-id="isolate" data-type="view" data-group="4"></i><i class="bar-item m-showAll" title="' +
                    (App.Local.data['drawing-model'].SAs || '显示全部模型') +
                    '" data-id="showAll" data-type="view" data-group="4"></i></div>'),
                sidebar: $('<div class="modelSidebar"> <div class="modelMap"> <div class="map"></div> </div> <div class="modelFilter"> <div id="filter" class="modelTab"> <ul class="tree"> <li class="itemNode" id="specialty" data-type="sceneId"> <div class="itemContent"> <i class="m-openTree"></i> <label class="treeCheckbox"> <input type="checkbox" checked="true"> <span class="m-lbl"></span> </label> <span class="treeText" data-i18n="data.drawing-model.Discipline">' +
                    (App.Local.data['drawing-model'].Discipline || "专业") +
                    '</span> </div> </li> <li class="itemNode" id="floors" data-type="sceneId"> <div class="itemContent"> <i class="m-openTree"></i> <label class="treeCheckbox"> <input type="checkbox" checked="true"> <span class="m-lbl"></span> </label> <span class="treeText">' +
                    (App.Local.data['drawing-model'].Floor || "楼层") +
                    '</span> </div> </li> <li class="itemNode" id="category" data-type="categoryId"> <div class="itemContent"> <i class="m-openTree"></i> <label class="treeCheckbox"> <input type="checkbox" checked="true"> <span class="m-lbl"></span> </label> <span class="treeText" >' +
                    (App.Local.data['drawing-model'].CTe || '构件类型') +
                    '</span> </div> </li> <li class="itemNode" id="classCode" data-type="classCode"> <div class="itemContent"> <i class="m-openTree"></i> <label class="treeCheckbox"> <input type="checkbox" checked="true"> <span class="m-lbl"></span> </label> <span class="treeText" >' +
                    (App.Local.data['drawing-model'].CCe || '分类编码') +
                    '</span> </div> </li> </ul> </div> <div id="comment" class="modelTab"></div> <div id="selected" class="modelTab"><div class="headTab"><div class="tabItem cur">' +
                    (App.Local.data['drawing-model'].Selected || "当前选中") +
                    '</div></div><div class="selectTree"></div></div> </div> </div>'),
                modelBar: $('<div class="toolsBar"></div>'),
                mapBar: $('<div class="footBar"><div class="modelSelect"><span class="cur"></span><div class="modelList"></div></div><div class="axisGrid"></div></div>')
            }
            bimView.sidebar._opt = options;
            bimView.sidebar.obj = obj;
            bimView.sidebar.el = self;
            var bimBox = bimView.sidebar._opt._dom.bimBox;
            $.each(bimView.model.modelBar, function (i, item) {
                var tmpHtml;
                if (item.type == 'more') {
                    tmpHtml = $('<div class="bar-item ' + item.icon + '" title="' + item.title + '" data-id="' + item.fn + '" data-type="' + item.type + '" data-group="' + item.group + '"></div>');
                } else if (item.type === 'color') {
                    const fn = localStorage.getItem('modelBgColor') || item.fn;
                    tmpHtml = $('<div class="bar-item ' + item.icon + ' ' + fn + '" title="' + item.title + '" data-id="' + fn + '" data-type="' + item.type + '" data-group="' + item.group + '"></div>');
                }
                else {
                    tmpHtml = $('<i class="bar-item ' + item.icon + '" title="' + item.title + '" data-id="' + item.fn + '" data-type="' + item.type + '" data-group="' + item.group + '"></i>');
                }
                // debugger;
                item.keyCode && bimView.comm.bindEvent.on(item.keyCode, tmpHtml);
                self._dom.modelBar.append(tmpHtml);
                if (item.subBar && item.subBar.length > 0) {
                    var subBar = $('<div class="subBar"></div>')
                    $.each(item.subBar, function (index, barItem) {
                        var subItem = $('<i class="bar-item ' + barItem.icon + '" title="' + barItem.title + '" data-id="' + barItem.fn + '" data-type="' + barItem.type + '" data-group="' + barItem.group + '"></i>');
                        barItem.keyCode && bimView.comm.bindEvent.on(barItem.keyCode, subItem);
                        subBar.append(subItem);
                    });
                    tmpHtml.append(subBar);
                }
            });
            self._dom.sidebar.find('.modelMap').prepend(self._dom.modelBar);
            bimBox.addClass(modelBgColor);
            bimBox.append(self._dom.lockAxis, self._dom.isolation);
            bimBox.append(self._dom.sidebar);
            bimView.isLoad = false;
            bimView.sidebar.filter();
            // bimView.sidebar.loadMap();
        },
        filter: function (isSelected, viewer, isNotFilter) {
            var self = this;
            console.log("_opt:", self._opt);
            // debugger;
            if (self._opt.projectId != undefined && self._opt.projectVersionId != undefined) {
                self.currentProject = {};
                self.currentProject.projectId = self._opt.projectId;
                self.currentProject.projectVersionId = self._opt.projectVersionId;
            }
            else {
                self.currentProject = App.currentProject;
            }
            self.fileData = self.fileData || {};
            if (isSelected) {
                self.el._dom.sidebar.addClass('open')
                self.el._dom.sidebar.find('#filter').show().siblings().hide();
                if (viewer) {
                    if (App.Project == undefined) {
                        return;
                    }
                    if (App.Project.currentQATab == "process" ||
                        App.Project.currentQATab == "open" ||
                        App.Project.currentQATab == "dis") {
                        return
                    }
                    var specialty = bimView.comm.getFilters($("#specialty,#floors"), 'uncheck');
                    var category = bimView.comm.getFilters($("#category"), 'uncheck');
                    var classCode = bimView.comm.getFilters($("#classCode"), 'uncheck');
                    if (!isNotFilter) {
                        viewer.fileFilter(specialty);
                        viewer.filter(category);
                        viewer.filter(classCode);
                    } else {
                    }
                    viewer.exitComment();
                    /* note by wuweiwei 2017-5-24
                    viewer.filter({
                      ids: ['10.01'],
                      type: "classCode"
                    });
                    */
                }
            } else {
                self.el._dom.sidebar.removeClass('open');
            }
            if (!bimView.isLoad && self.currentProject) {
                bimView.isLoad = true;
                bimView.comm.ajax({
                    timeout: 6000,
                    type: 'get',
                    url: bimView.API.fetchFloors,
                    etag: self._opt.etag,
                    sourceId: self._opt.sourceId,
                    projectid: self.currentProject.projectId,
                    projectVersionId: self.currentProject.projectVersionId
                }, function (data) {
                    var data = data.data,
                        _temp = [];
                    var floors = bimView.comm.viewTree({
                        arr: data,
                        type: 'sceneId',
                        name: 'floor',
                        data: 'fileEtags',
                        id: 'floors',
                    });
                    $.each(data, function (i, item) {
                        _temp = _temp.concat(item.fileEtags);
                    })
                    bimView.prototype.FloorsData = data;
                    bimView.prototype.FloorFilesData = _temp;
                    $('#floors').append(floors);
                });
                bimView.comm.ajax({
                    timeout: 6000,
                    type: 'get',
                    url: bimView.API.fetchSpecialty,
                    etag: self._opt.etag,
                    sourceId: self._opt.sourceId,
                    projectid: self.currentProject.projectId,
                    projectVersionId: self.currentProject.projectVersionId
                }, function (data) {
                    var data = data.data,
                        _temp = {}, _temp2 = {};
                    $.each(data, function (i, item) {
                        var _t = [], _t2 = [];
                        $.each(item.files, function (j, file) {
                            self.fileData[file.fileEtag] = item.specialty;
                            _t.push(file.fileEtag);
                            _t2.push(file);
                        })
                        _temp[item.specialty] = _t;
                        _temp2[item.specialty] = _t2;
                    })
                    bimView.prototype.SpecialtyFilesData = _temp;
                    bimView.prototype.SpecialtyFileObjData = _temp2;
                    bimView.prototype.SpecialtyFileSrcData = data;
                    var specialties = bimView.comm.viewTree({
                        arr: data,
                        type: 'sceneId',
                        name: 'specialty',
                        children: 'files',
                        childrenName: 'fileName',
                        data: 'fileEtag',
                        id: 'specialty',
                    });
                    $('#specialty').append(specialties);
                });
                bimView.comm.ajax({//构件分类的ajax方法
                    type: 'get',
                    url: bimView.API.fetchCategory,
                    etag: self._opt.etag,
                    sourceId: self._opt.sourceId,
                    projectId: self.currentProject.projectId,
                    projectVersionId: self.currentProject.projectVersionId
                }, function (datas) {
                    if (!datas.data) {
                        return;
                    }
                    var data = datas.data.tree;
                    var total = datas.data.total;
                    var componentType = App.Local.getTranslation('drawing-model.CTe') || "构件类型";
                    $("#category").find("span.treeText").empty().html(componentType + "<span class='treeColor'>(" + total + ")</span>");
                    var category = bimView.comm.viewTree({
                        arr: data,
                        type: 'categoryId',
                        name: 'specialty',
                        code: 'specialtyCode',
                        children: 'categories',
                        childrenType: 'json',
                    });
                    bimView.prototype.ComponentTypeFilesData = data;
                    $('#category').append(category);
                });
                bimView.comm.ajax({//分类编码的ajax请求
                    type: 'get',
                    url: bimView.API.fetchCoding,
                    etag: self._opt.etag,
                    sourceId: self._opt.sourceId,
                    projectId: self.currentProject.projectId,
                    projectVersionId: self.currentProject.projectVersionId
                }, function (datas) {
                    if (datas.data) {
                        self.classCodeData = datas.data.tree;
                        var total = datas.data.total;
                        var categoryCode = App.Local.getTranslation('drawing-model.CCe') || "分类编码";
                        $("#classCode").find("span.treeText").empty().html(categoryCode + "<span class='treeColor'>(" + total + ")</span>");
                        // debugger;
                        var classCode = bimView.comm.viewTree({
                            type: 'classCode',
                            rootName: categoryCode
                        });
                        bimView.prototype.ClassCodeData = datas.data.tree;
                        $('#classCode').append(classCode);
                    }
                });
            }
        },
        /*
        联动filter过滤树的复选框
        add by wuweiwei
        */
        scanFilterTreeCheckState: function (curDom) {
            /*扫描左侧小地图树的复选框,并设计是全选还是部分选中*/
            // this.treeCheckCount++;
            // if (this.treeCheckCount <= 5) {
            //     return;
            // }
            var i, $m_lbl, chkState;
            var checkAfter = document.defaultView.getComputedStyle(curDom, "after");
            /*当前复选框after*/
            var parentUl = curDom.parentNode.parentNode.parentNode.parentNode;
            var type = parentUl.className;
            /*ul dom class have root or leaf*/
            type = type.indexOf("root") > 0 ? "root" : "leaf";
            $m_lbl = $(parentUl).prev().find(".m-lbl");
            /*父级 checkbox*/
            var $root_mlbl;
            var scanCheckBox = function (parentNode) {
                /*
                param:parentNode is ul
                return:有一个未勾选返回false
      
                */
                var $m_lbl;
                var $lis = $(parentNode).find("li");
                var i, len = $lis.length, $m_lbl;
                for (i = 0; i < len; i++) {
                    $m_lbl = $($lis[i]).find(".m-lbl");
                    try {
                        checkAfter = document.defaultView.getComputedStyle($m_lbl[0], "after");
                        if (checkAfter.content == "") /*未勾选*/
                        {
                            return false;
                        }
                    } catch (e) {
                        ;
                    }
                }
                return true;
            }
            var scanCheckBox2 = function (parentNode) {
                /*
                param:parentNode is ul
                return: 全部未勾选,返回false
                */
                var $m_lbl;
                var $lis = $(parentNode).find("li");
                var i, len = $lis.length, $m_lbl;
                for (i = 0; i < len; i++) {
                    $m_lbl = $($lis[i]).find(".m-lbl");
                    try {
                        checkAfter = document.defaultView.getComputedStyle($m_lbl[0], "after");
                        if (checkAfter.content != "") /*勾选*/
                        {
                            return true;
                        }
                    } catch (e) {
                        ;
                    }
                }
                return false;
            }
            if (type == "root" || type == "leaf") {
                if (checkAfter.content == "") /*未勾选当前复选框*/
                {
                    if (!$m_lbl.hasClass("m-lbl-2")) {
                        $m_lbl.addClass("m-lbl-2");
                    }
                    console.log(scanCheckBox2(parentUl));
                    if (!scanCheckBox2(parentUl)) {
                        $m_lbl.prev().prop("checked", false);
                        $m_lbl.removeClass("m-lbl-2");
                    }
                    if (type == "leaf") {
                        $root_mlbl = $(parentUl).parent().parent().prev().find(".m-lbl");
                        var parentUl_root = $(parentUl).parent().parent();
                        if (!$root_mlbl.hasClass("m-lbl-2")) {
                            $root_mlbl.addClass("m-lbl-2");
                        }
                        if (!scanCheckBox2(parentUl_root)) {
                            $root_mlbl.prev().prop("checked", false);
                            $root_mlbl.removeClass("m-lbl-2");
                        }
                    }
                }
                else /*勾选当前复选框*/
                {
                    $(curDom).removeClass("m-lbl-2");
                    chkState = scanCheckBox(parentUl);
                    if (chkState) {
                        $m_lbl.removeClass("m-lbl-2");
                        $m_lbl.prev().prop("checked", true);
                    }
                    else {
                        if (!$m_lbl.hasClass("m-lbl-2")) {
                            $m_lbl.addClass("m-lbl-2");
                            $m_lbl.prev().prop("checked", true);
                        }
                    }
                    if (type == "leaf") {
                        var parentUl_root = $(parentUl).parent().parent();
                        $root_mlbl = $(parentUl).parent().parent().prev().find(".m-lbl");
                        chkState = scanCheckBox(parentUl_root);
                        if (chkState) {
                            $root_mlbl.removeClass("m-lbl-2");
                            $root_mlbl.prev().prop("checked", true);
                        }
                        else {
                            if (!$root_mlbl.hasClass("m-lbl-2")) {
                                $root_mlbl.addClass("m-lbl-2");
                                $root_mlbl.prev().prop("checked", true);
                            }
                        }
                    }
                }
            }
            /* end if type=="root"||"leaf" */
        },
        comment: function (isSelected, viewer) {
            var self = this;
            isSelected = viewer.commentInit();
            // self.el._dom.sidebar.find('#comment').show().siblings().hide();
            // isSelected ? self.el._dom.sidebar.addClass('open') && viewer.commentInit() : self.el._dom.sidebar.removeClass('open');
        },
        selected: function (isSelected, viewer) {
            var self = this;
            if (isSelected) {
                self.el._dom.sidebar.addClass('open')
                self.el._dom.sidebar.find('#selected').show().siblings().hide();
                self.getSelected(viewer);
            } else {
                self.el._dom.sidebar.removeClass('open');
            }
            viewer.on('click', function () {
                if (!$("#selected").is(":hidden")) {
                    self.getSelected(viewer);
                }
            });
        },
        more: function (viewer) {
            var self = this;
            var status = viewer.getTranslucentStatus();
            var modelBgColor = bimView.comm.getModelBgColor()
            self.el._dom.sidebar.find('.bar-translucent').toggleClass('selected', status);
            self.el._dom.sidebar.find('.m-color').attr('class', 'bar-item m-color ' + modelBgColor).data('id', modelBgColor);
        },
        toggleMap: function (el) {
            var self = this;
            el.toggleClass('bar-hideMap bar-showMap')
            self._dom.sidebar.toggleClass('hideMap');
        },
        loadMap: function () {
            var self = this;
            let getFloorsInfo = new Promise((resolve, reject) => {
                bimView.comm.ajax({
                    timeout: 20000,
                    type: 'get',
                    url: bimView.API.fetchFloorsMap,
                    etag: self._opt.etag,
                    sourceId: self._opt.sourceId,
                    projectid: self.currentProject.projectId,
                    projectVersionId: self.currentProject.projectVersionId
                }, function (res) {
                    if (res.message == "success") {
                        let floorsData = res.data.sort(function (a, b) {
                            return b.sort - a.sort;
                        });
                        for (var i = 0, xarr = [], yarr = []; i < floorsData.length; i++) {
                            xarr.push(floorsData[i]['boundingBox']['Max']['X'], floorsData[i]['boundingBox']['Min']['X']);
                            yarr.push(floorsData[i]['boundingBox']['Max']['Y'], floorsData[i]['boundingBox']['Min']['Y']);
                        }
                        let mapMaxBox = [_.min(xarr), _.min(yarr), _.max(xarr), _.max(yarr)];
                        resolve({mapMaxBox,floorsData});
                    }
                });
            });
            getFloorsInfo.then((data) => {
                bimView.comm.ajax({
                    type: 'get',
                    url: bimView.API.fetchAxisGrid,
                    etag: self._opt.etag
                }, function (res) {
                    let axisGridData = JSON.parse(res);
                    axisGridData.mapMaxBox = data.mapMaxBox;
                    renderMap(axisGridData,data.floorsData);
                });
            });
            
            function renderMap(axisGridData,floorsData) {
                var floorSelect = self.el._dom.mapBar.find('.modelList');
                $.each(floorsData, function (i, item) {
                    item.Path = bimView.API.baseUrl + "model" + item.path;
                    item.BoundingBox = item.boundingBox;
                    var tmp = $('<li class="modelItem" data-type="miniMap"></li>').text(item.name).data(item);
                    floorSelect.append(tmp);
                });
                self.obj.initMap({
                    name: 'miniMap',
                    element: self.el._dom.sidebar.find('.map'),
                    axisGrid: axisGridData,
                    callbackCameraChanged: function (res) {
                        self.obj.pub('changeGrid', res);
                    }
                });
                self.el._dom.sidebar.find('.modelMap').append(self.el._dom.mapBar);
                self.el._dom.sidebar.find(".modelItem:eq(0)").trigger('click', true);
            }
        },
        getSelected: function (viewer, callback) {
            var self = this;
            var selection = viewer.getSelectedIds();
            var data = []
            $.each(selection, function (i, item) {
                data.push(i);
                if (data.length > 1000) return false;
            });
            if (data.length > 0) {
                bimView.comm.ajax({
                    type: 'post',
                    url: bimView.API.fetchComponentById,
                    projectId: self._opt.projectId,
                    projectVersionId: self._opt.projectVersionId || self._opt.projectId,
                    data: "token=123&elementId=" + data.join(',')
                }, function (data) {
                    if (data.message == 'success' && data.data.length) {
                        bimView.comm.renderSelected(data.data);
                        var viewData = {};
                        var fileData = bimView.sidebar.fileData;
                        $.each(data.data, function (i, item) {
                            var modelName = fileData[item.modelId]
                            if (viewData[modelName]) {
                                if (viewData[modelName][item.cateName]) {
                                    viewData[modelName][item.cateName][item.id] = item.name;
                                } else {
                                    var __obj = {};
                                    __obj[item.id] = item.name;
                                    viewData[modelName][item.cateName] = __obj;
                                }
                            } else {
                                var __obj = {}, __obj2 = {};
                                __obj[item.id] = item.name;
                                __obj2[item.cateName] = __obj;
                                viewData[modelName] = __obj2;
                            }
                        });
                        if (callback) callback(viewData);
                    }
                });
            } else {
                bimView.comm.renderSelected();
            }
        }
    }
})($);
