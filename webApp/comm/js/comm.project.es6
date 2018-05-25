/**
 * 基于jQuery,underscore
 * @type {{_$viewer: null, init: (function(*)), filter: (function(*)), linkSilder: CommProject.linkSilder, linkSilderSpecial: CommProject.linkSilderSpecial}}
 */
var CommProject = {
    _$viewer: null,
    _$data: [],
    _$sourceId: '',
    _$etag: '',
    _$projectId: '',
    _$projectVersionId: '',
    //过滤规则
    filterRule: {
        //单文件：过滤出检查点所在构件所在的文件
        //单独类型：singleRule
        single: '梁柱节点,地下防水,地下室外墙防水,地下室底板防水,步行街吊顶风口,卫生间防水,外保温,采光顶,工程桩,基坑支护,钢结构悬挑构件,幕墙,屋面防水,屋面虹吸雨排,消防泵房,给水泵房,湿式报警阀室,空调机房,冷冻机房,变配电室,发电机房,慧云机房,电梯机房,电梯底坑,吊顶,地面,中庭栏杆,竖井',
        concat: '采光顶,地下防水,步行街吊顶风口,卫生间防水,外保温,钢结构悬挑构件,幕墙,工程桩,基坑支护,屋面防水,屋面虹吸雨排,消防泵房,给水泵房,湿式报警阀室,空调机房,冷冻机房,变配电室,发电机房,慧云机房,电梯机房,电梯底坑,吊顶,地面,中庭栏杆,竖井',
        floor: ''
    },
    //缩放规则
    marginRule: {
        '基坑支护': {
            margin: 0.2,
            ratio: 1.0
        },
        '梁柱节点': {
            margin: 0.8,
            ratio: 2.0
        },
        '外保温': {
            margin: 0.5,
            ratio: 1.0
        },
        '地下防水': {
            margin: 1,
            ratio: 1.0
        },
        '幕墙': {
            margin: 1,
            ratio: 1.0
        },
        '采光顶': {
            margin: 3,
            ratio: 1.0
        },
        '地面': {
            margin: 0.01,
            ratio: 1.0
        }
    },
    /**
     * 初始化模型公共数据
     * @param params
     */
    init(params) {
        if (!params.viewer || !params.data) {
            return null;
        }
        this._$viewer = params.viewer;
        this._$data = params.data;
        this._$sourceId = params.sourceId;
        this._$etag = params.etag;
        this._$projectId = params.projectId;
        this._$projectVersionId = params.projectVersionId;
        this._$markerClick = params.markerClick;
        return this;
    },
    /**
     * 模型过滤接口
     * @param params
     *  cat:构件分类
     *  floors:楼层数组
     *  isReset:是否重置模型 default:true
     * @param callback 回调函数
     *  margin:
     *  ratio:
     */
    filter(params, callback) {
        var _this = this,
            _cat = params.cat,
            _floors = params.floors,
            _specialFilterFiles = [],
            _extArray = [],
            _codeFlag = false,
            _hideCode = null,
            floor = null;
        var _viewer = this._$viewer;
        if (_.isArray(_floors)) {
            _floors = _floors.join(',');
        }
        _cat = typeof(_cat) == "string" ? _cat : _cat.text; //add by wuweiwei 2017-5-23
        App.Comm.ajax({
            URLtype: "modelFilterRule",
            data: {
                token: 123,
                sourceId: this._$sourceId,
                etag: this._$etag,
                projectId: this._$projectId,
                projectVersionId: this._$projectVersionId,
                checkPointType: _cat, //modify by wuweiwei 2017-5-23
                floor: _floors
            }
        }).done(function (res) {
            if (res.code == 0 && res.data) {
                _this.recoverySilder();
                var _t = res.data.code;
                _specialFilterFiles = res.data.file;
                _extArray = res.data.specCode;
                _hideCode = _t.code;
                _codeFlag = _t.visible;
                floor = _.pluck(res.data.floor, 'floor');
            }
            _this.linkSilder('floors', floor);
            _this.linkSilderSpecial('specialty', _specialFilterFiles, _extArray);
            if (_hideCode && _hideCode.length) {
                _viewer.filter({
                    ids: _this.filterHideCode(_hideCode, _codeFlag),
                    type: "classCode"
                })
            }
            if (callback && _.isFunction(callback)) {
                callback(res.data.margin, res.data.ratio);
            }
        })
    },
    //过滤器还原（计划[模块化、模拟],质量[开业、过程、隐患],设计[碰撞],成本[清单、校验]）
    recoverySilder: function () {
        var _viewer = this._$viewer;
        var show = '建筑,结构,景观,幕墙,采光顶,景观&导识,幕墙&泛光',
            hide = '暖通,电气,智能化,给排水,内装,内装&导识';
        var $sp = $('.modelSidebar #specialty>.tree>li');
        _viewer.fileFilter({
            ids: [],
            total: _viewer.FloorFilesData
        });
        _viewer.filter({
            ids: [],
            type: "classCode"
        });
        _viewer.filter({
            type: "plan",
            ids: []
        });
        //_viewer.translucent(false); //modify by wuweiwei 2017-4-12
        $sp.each(function () {
            var _input = $(this).find('input:first'),
                _text = $(this).find('.treeText:first').text();
            if (show.indexOf(_text) != -1) {
                if (_input.is(':checked')) {
                    _input.trigger('click');
                }
                _input.trigger('click');
            } else if (hide.indexOf(_text) != -1) {
                if (!_input.is(':checked')) {
                    _input.trigger('click');
                }
                _input.trigger('click');
            }
        })
        $('.modelSidebar #category input').each(function () {
            if (!$(this).is(':checked')) {
                $(this).trigger('click');
            }
        });
        $('.modelSidebar #floors input').each(function () {
            if (!$(this).is(':checked')) {
                $(this).trigger('click');
            }
        });
        var specialty = bimView.comm.getFilters($("#specialty,#floors"), 'uncheck');
        var category = bimView.comm.getFilters($("#category"), 'uncheck');
        var classCode = bimView.comm.getFilters($("#classCode"), 'uncheck');
        _viewer.fileFilter(specialty);
        _viewer.filter(category);
        _viewer.filter(classCode);
        _viewer.filter({
            ids: ['10.01'],
            type: "classCode"
        })
    },
    linkSilder: function (type, key) {
        if (!key) {
            return
        }
        var $check = $('.modelSidebar #' + type + ' ul input'),
            $treeText = $('.modelSidebar #' + type + ' ul .treeText');
        $check.each(function () {
            if ($(this).is(':checked') && $(this).closest('.itemContent').find('.treeText').text() != key) {
                $(this).trigger('click');
            }
        })
        $treeText.each(function () {
            var _this = $(this).parent().find('input');
            if (_.isArray(key)) {
                if (key.join('||').indexOf($(this).text()) !== -1 && !_this.is(':checked')) {
                    _this.trigger('click');
                }
            } else {
                if ($(this).text() == key && !_this.is(':checked')) {
                    _this.trigger('click');
                }
            }
        })
    },
    linkSilderSpecial: function (type, key, ext) {
        if (!key) {
            return
        }
        ext = ext || ['AR'];
        var $check = $('.modelSidebar #' + type + '>ul input'),
            $treeText = $('.modelSidebar #' + type + ' .treeText');
        $check.each(function () {
            if ($(this).is(':checked')) {
                $(this).trigger('click');
            }
        })
        $treeText.each(function () {
            var _$this = $(this)
            var _this = _$this.parent().find('input');
            if (key.indexOf(_$this.text()) != -1 && _$this.text().indexOf('.rvt') != -1) {
                _this.trigger('click');
            }
        })
        _.each(ext, function (i) {
            $(".treeText[mcode='" + i + "']").prev().find('input').prop("checked", 'checked');
        })
    },
    /**
     * 解析需要隐藏的classCode
     * @param code
     * @param flag true 显示 false 隐藏
     * @returns {Array}
     */
    filterHideCode: function (code, flag) {
        var _class = this._$viewer.ClassCodeData,
            hide = [];
        if (typeof code == 'string') {
            code = [code];
        }
        var count = code.length;
        _.each(_class, function (item) {
            var temp = 0;
            _.find(code, function (i) {
                if (flag) {
                    if (item.code.indexOf(i) != 0) {
                        temp++;
                    }
                } else {
                    if (item.code.indexOf(i) == 0) {
                        temp++;
                    }
                }
            })
            if (flag) {
                if (count == temp) {
                    hide.push(item.code);
                }
            } else {
                if (temp == 1) {
                    hide.push(item.code);
                }
            }
        })
        return hide;
    },
    //在模型中显示(开业验收、过程验收、隐患)------------平台中调用
    /**
     * 在模型中显示检查点、隐患、构件
     * @param $target
     * @param type 0 开业,1 过程,3 隐患
     * @param paramObj 可配置参数对象
     *  uuid:构件ID
     *  location:位置信息
     */
    showInModel: function ($target, type, paramObj) {
        var _this = this,
            _viewer = this._$viewer,
            key = "", //楼层关键字
            componentId = paramObj ? paramObj.uuid : $target.data('uuid'), //构件ID
            location = paramObj ? paramObj.location : $target.data('location'), //位置信息
            color = $target.data('color'), //标记颜色
            cat = $target.data('cat'), //构件分类
            marginRule = _this.marginRule[cat] || {};
        if (!paramObj || !paramObj.selected) {
            if ($target.hasClass("selected")) {
                $target.parent().find(".selected").removeClass("selected");
                _viewer.loadMarkers();
                _viewer.highlight({
                    type: 'userId',
                    ids: undefined
                });
                /*add by wuweiwei begin*/
                if (App.Project.Settings.projectNav == "quality") {
                    _this.recoverySilder();
                    // _viewer.viewer.zoomOut(5);
                    _viewer.viewer.goToInitialView();
                    //box = _this.formatBBox(location.boundingBox);
                    //this._$viewer.zoomToBox(box,0.5);
                }
                /*add by wuweiwei end */
                return
            } else {
                var $quality_btnCk = $("#projectContainer .qualityContainer .btnCk");
                try {
                    if ($quality_btnCk.hasClass("selected")) {
                        $quality_btnCk.removeClass("selected");
                    }
                } catch (e) {
                    ;
                }
                $target.parents('.rightPropertyContent').find(".qualityContainer").find(".selected").removeClass('selected');
                $target.parents('.rightPropertyContent').find(".planContainer").find(".selected").removeClass('selected');
                // $target.parent().find(".selected").removeClass("selected");
                $target.addClass("selected");
            }
        }
        var _temp = location,
            _loc = "",
            _secenId = componentId.split('.')[0], //文件ID、用于过滤构件所在楼层
            box = _this.formatBBox(_temp.boundingBox),
            ids = [componentId];
        if (location && (location.componentId == undefined)) {
            location.componentId = componentId;
        }
        if (type == 3) { //隐患
            _loc = _this.formatMark(location, 'S021'.charAt(color), $target.data('id'), 1);
        } else {
            _loc = _this.formatMark(location, '543'.charAt(color), $target.data('id'));
        }
        _this.showMarks(_loc);
        //过滤所属楼层 start
        var _floors = _viewer.FloorsData;
        _.find(_floors, function (item) {
            if (_.contains(item.fileEtags, _secenId)) {
                key = item.floor;
                return true;
            }
        })
        //过滤所属楼层 end
        //没有分类的时候 只过滤单文件 start
        if (!cat) {
            _this.recoverySilder();
            _this.linkSilderSpecial('specialty', [paramObj.fileName], [paramObj.specialty]);
            if (_viewer.getTranslucentStatus()) {
                _viewer.showAll();
            }
            _this.zoomModelOther(ids, box, 4.0, 1.0, location);
            return;
        }
        //有分类时、根据过滤规则过滤
        if (_this.filterRule.single.indexOf(cat) != -1) {
            _this.filter({
                cat: cat,
                floors: key
            }, function (margin, ratio) {
                if (_viewer.getTranslucentStatus()) {
                    _viewer.showAll();
                }
                if (cat == "幕墙" || cat == '外保温') {
                    _this.zoomModel(ids, box, margin * 4 || marginRule.margin * 4, ratio || marginRule.ratio);
                } else {
                    _this.zoomModelOther(ids, box, margin * 4 || marginRule.margin * 4, ratio || marginRule.ratio, location);
                }
            });
        } else {
            _this.recoverySilder();
            _this.linkSilder('floors', key);
        }
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
    //1 红色 2 橙色 3绿色
    //color 2 红色 1绿色 0 黄|橙
    formatMark: function (location, color, id, shaType) {
        var _temp = location;
        if (typeof location === 'string') {
            _temp = JSON.parse(location)
        }
        _temp.shapeType = Number(_temp.shapeType || shaType || 0);
        _temp.state = Number(_temp.state || color || 0);
        _temp.userId = _temp.userId || _temp.componentId;
        _temp.id = id || '';
        return JSON.stringify(_temp);
    },
    showMarks: function (marks) {
        var _viewer = this._$viewer;
        var markerClick = this._$markerClick || function () {
        };
        if (!_.isArray(marks)) {
            marks = [marks];
        }
        //viewer.viewer.setMarkerClickCallback(markerClick); // modify by wuweiwei old interface
        _viewer.getMakerObject().setMarkerClickCallback(markerClick);// add by wuweiwei new interface
        _viewer.loadMarkers(marks);
    },
    zoomModelOther: function (ids, box, margin, ratio) {
        var _viewer = this._$viewer;
        //定位
        _viewer.setTopView(box, false, margin, ratio);
        //半透明
        //App.Project.Settings.Viewer.translucent(true);
        //高亮
        _viewer.highlight({
            type: 'userId',
            ids: ids
        });
    },
    zoomToBox: function (ids, box) {
        var _viewer = this._$viewer;
        _viewer.clearIsolate();
        _viewer.clearFilterTranslucentOthersUserIDList();
        _viewer.zoomToBox(box);
        _viewer.setSelectedIds(ids);
        //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, _viewer.viewer);
        _viewer.setTranslucentUnselected();
        _viewer.clearSelection();
        _viewer.highlight({
            type: 'userId',
            ids: ids
        });
    },
    //通过userid 和 boundingbox 定位模型
    zoomModel: function (ids, box, margin, ratio) {
        var _viewer = this._$viewer;
        //定位
        //_viewer.setTopView(box, false, margin, ratio);
        _viewer.zoomToBBoxWithOuterBox(box, this.getBoxs(), margin, ratio);
        //半透明
        //App.Project.Settings.Viewer.translucent(true);
        //高亮
        _viewer.highlight({
            type: 'userId',
            ids: ids
        });
    },
    getBoxs: function () {
        var boxs = [];
        var data = this._$data;
        _.each(data, function (i) {
            if (i.componentId) {
                if (i.location && i.location.indexOf('boundingBox') != -1) {
                    var _loc = JSON.parse(i.location);
                    boxs.push(_loc.boundingBox);
                }
            }
        })
        return boxs;
    },
}