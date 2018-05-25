//@ sourceURL=projects.js
App.Project = {
    currentProsCat: "",
    currentOpenCat: "",
    currentOpenCheckFloor: "",
    currentProsCheckFloor: "",
    isSettedMarkerClick: false,
    presetClickEvent(userId) {
        var sceneId = userId.split('.')[0];
        App.Project.Settings.ModelObj = {
            intersect: {
                userId: userId,
                object: {
                    userData: {
                        sceneId: sceneId
                    }
                }
            }
        };
        var projectNav = App.Project.Settings.projectNav,
            property = App.Project.Settings.property;
        //属性，四个tab 都一样
        if (((projectNav == "design" || projectNav == "cost" || projectNav == "quality" || projectNav == "plan" || projectNav == '') && property == "poperties")) {
            App.Project.DesignAttr.PropertiesCollection.projectId = App.Project.Settings.projectId;
            App.Project.DesignAttr.PropertiesCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
            App.Project.DesignAttr.PropertiesCollection.fetch({
                data: {
                    elementId: userId,
                    sceneId: sceneId
                }
            });
        }
    },
    resetProperNull() {
        var projectNav = App.Project.Settings.projectNav,
            property = App.Project.Settings.property,
            $el;
        if (property == "poperties") {

            //if (projectNav == "design") {
            //	//设计
            //	$el = $(".rightPropertyContentBox .designProperties");
            if (projectNav == "cost") {
                //成本
                $el = $(".rightPropertyContentBox .CostProperties");
            } else if (projectNav == "quality") {
                //质量
                $el = $(".rightPropertyContentBox .QualityProperties");
            } else if (projectNav == "plan") {
                //计划
                $el = $(".rightPropertyContentBox .planProperties");
            } else {
                //设计  或者没有选中任何一栏时的默认属性页
                $el = $(".rightPropertyContentBox .designProperties");
            }
        }
        if ($el) {
            $el.html('<div class="nullTip">' +
                (App.Local.getTranslation('drawing-model.SEt1') || '请选择构件') +
                '</div>');
        }
    },
    //检查点标记点击事件
    markerClick: function (marker) {
        console.log("marker:", marker);
        //add by wuweiwei begin 2017-5-10
        App.Project.Settings.Viewer.viewer.setSelection();//选中与否
        App.Project.resetProperNull();//清空属性面板的内容
        App.Project.Settings.Viewer.viewer.render();
        //add by wuweiwei end
        var id = marker ? marker.id : "",
            userId = marker ? marker.userId : "",
            data = {};
        if ($(".btnCk").hasClass("selected")) {
            if ($(".QualityProcessAcceptance").is(":visible")) {//过程验收
                $(".QualityProcessAcceptance .tbProcessAccessBody tr").removeClass('selected');
                if (id) {
                    var tr = $(".QualityProcessAcceptance .tbProcessAccessBody tr[data-id='" + id + "']");
                    if (tr.length > 0) {
                        tr.addClass('selected');
                    } else {
                        data = App.Project.catchPageData('process', { id: id });//内存中取数据
                        App.Project.qualityTab.ProcessAcceptanceOptions.pageIndex = data.pageIndex;
                        App.Project.QualityAttr.ProcessAcceptanceCollection.reset();
                        App.Project.QualityAttr.ProcessAcceptanceCollection.push({ data: data });
                        App.Project.qualityTab.pageInfo.call(App.Project.qualityTab, data, 'processacceptance', true);
                        tr = $(".QualityProcessAcceptance .tbProcessAccessBody tr[data-id='" + id + "']");
                        tr.addClass("selected");
                    }
                }
            }
            if ($(".QualityOpeningAcceptance").is(":visible")) {//开业验收
                $(".QualityOpeningAcceptance .tbOpeningacceptanceBody tr").removeClass('selected');
                if (id) {
                    var tr = $(".QualityOpeningAcceptance .tbOpeningacceptanceBody tr[data-id='" + id + "']");
                    if (tr.length > 0) {
                        tr.addClass('selected');
                    } else {//如果当前列表有翻页执行的方法
                        data = App.Project.catchPageData('open', { id: id });//内存中取数据
                        App.Project.qualityTab.OpeningAcceptanceOptions.pageIndex = data.pageIndex;
                        App.Project.QualityAttr.OpeningAcceptanceCollection.reset();
                        App.Project.QualityAttr.OpeningAcceptanceCollection.push({ data: data });
                        App.Project.qualityTab.pageInfo.call(App.Project.qualityTab, data, 'openingacceptance', true);
                        tr = $(".QualityOpeningAcceptance .tbOpeningacceptanceBody tr[data-id='" + id + "']");
                        tr.addClass("selected");
                    }
                }
            }
            if ($(".QualityConcerns").is(":visible")) {//隐患
                $(".QualityConcerns .tbConcernsBody tr").removeClass('selected');
                if (id) {
                    var tr = $(".QualityConcerns .tbConcernsBody tr[data-id='" + id + "']");
                    if (tr.length > 0) {
                        tr.addClass('selected');
                    } else {
                        data = App.Project.catchPageData('dis', { id: id });//内存中取数据
                        App.Project.qualityTab.ConcernsOptions.pageIndex = data.pageIndex;
                        App.Project.QualityAttr.ConcernsCollection.reset();
                        App.Project.QualityAttr.ConcernsCollection.push({ data: data });
                        App.Project.qualityTab.pageInfo.call(App.Project.qualityTab, data, 'concerns', true);
                        tr = $(".QualityConcerns .tbConcernsBody tr[data-id='" + id + "']");
                        tr.addClass("selected");
                    }
                }
            }
        }
        if (userId) {
            App.Project.Settings.Viewer.highlight({
                type: 'userId',
                ids: [userId]
            });
            App.Project.Settings.Viewer.setSelectedIds([userId]);//选中与否
            App.Project.presetClickEvent(userId);//点击气泡 加载当前的属性
        } else {
            //App.Project.Settings.Viewer.highlight();
            App.Project.Settings.Viewer.setSelectedIds();//选中与否
            App.Project.resetProperNull();//清空属性面板的内容
            App.Project.Settings.Viewer.viewer.render();
        }
        var viewer = App.Project.Settings.Viewer,
            isIsolateState = viewer.isIsolate();
        if (isIsolateState) {
            $('#isolation').show();
        } else {
            $('#isolation').hide();
        }
    },
    checkSelectComponent: function (userId) {
        App.Project.Settings.Viewer.setSelectedIds([userId]);
    },
    //隐患类型数据客户化
    disCategory: function (item) {
        var arr = this.mapData.concernsCategory;
        if (item.acceptanceType == '1') {
            if (item.presetPointId) {
                return arr[2];
            } else {
                return arr[1];
            }
        } else if (item.acceptanceType == '2') {
            return arr[3];
        } else {
            return ''
        }
    },
    //过滤规则
    filterRule: {
        //单文件：过滤出检查点所在构件所在的文件
        //单独类型：singleRule
        single: '梁柱节点,地下防水,步行街吊顶风口,卫生间防水,外保温,采光顶,工程桩,基坑支护,钢结构悬挑构件,幕墙,屋面防水,屋面虹吸雨排,消防泵房,给水泵房,湿式报警阀室,空调机房,冷冻机房,变配电室,发电机房,慧云机房,电梯机房,电梯底坑,吊顶,地面,中庭栏杆,竖井',
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
    versionType: [
        "发布版本",
        "发布版本",
        "变更版本",
    ],
    sigleFileRule: function (cat) {
        var code = null,
            _this = this;
        if (cat == "工程桩") {
            code = ['10.01'];
        }
        if (cat == "幕墙" || cat == "钢结构悬挑构件") {
            _this.linkSilderSpecial('specialty', '幕墙');
        }
        if (code) {
            App.Project.Settings.Viewer.filter({
                ids: _this.filterHideCode(code),
                type: "classCode"
            })
        }
    },
    getFloors: function (name) {
        var array = [];
        _.each(App.Project.Settings.Viewer.FloorsData, function (item, index) {
            if (!name) {
                array.push(item.code);
            } else if (name && item.code.indexOf(name) != -1) {
                array.push(item.code);
            }
        })
        return array;
    },
    /**
     * 模型过滤规则
     * @param cat
     * @param floor
     * @param callback
     */
    commSingleRule: function (cat, floor, callback) {
        var typeMap = {
            'concerns': 'dis',
            'processacceptance': 'process',
            'openingacceptance': 'open'
        };
        CommProject.init({
            viewer: App.Project.Settings.Viewer,
            data: this.currentLoadData[typeMap[App.Project.Settings.property]],
            sourceId: App.Project.Settings.DataModel.sourceId,
            etag: App.Project.Settings.DataModel.etag,
            projectId: App.Project.Settings.projectId,
            projectVersionId: App.Project.Settings.CurrentVersion.id,
            markerClick: App.Project.markerClick
        }).filter({
            cat: cat,
            floors: floor
        }, callback);
    },
    //单独类型、自定义过滤规则
    sigleRule: function (cat, floor, callback) {
        var _this = this,
            _v = App.Project.Settings.Viewer,
            _specialFilterFiles = [],
            _extArray = [],
            _codeFlag = false,
            _hideCode = null;
        if (_.isArray(floor)) {
            floor = floor.join(',');
        }
        App.Comm.ajax({
            URLtype: "modelFilterRule",
            data: {
                token: 123,
                sourceId: App.Project.Settings.DataModel.sourceId,
                etag: App.Project.Settings.DataModel.etag,
                projectId: App.Project.Settings.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id,
                checkPointType: cat,
                floor: floor
            }
        }).done(function (res) {
            if (res.code == 0 && res.data) {
                App.Project.recoverySilder();
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
                App.Project.Settings.Viewer.filter({
                    ids: _this.filterHideCode(_hideCode, _codeFlag),
                    type: "classCode"
                })
            }
            if (callback && _.isFunction(callback)) {
                callback(res.data.margin, res.data.ratio);
            }
        })
        return
        if (cat == '梁柱节点') {
            if (!floor) {
                floor = _this.getFloors();
                _specialFilterFiles = [];
                _.each(floor, function (item) {
                    _specialFilterFiles.push('WDGC-Q-ST-' + item + '.rvt');
                })
            } else {
                _specialFilterFiles = ['WDGC-Q-ST-' + floor + '.rvt'];
            }
            _extArray = ['ST'];
            this.linkSilder('floors', floor);
            this.linkSilderSpecial('specialty', _specialFilterFiles, _extArray);
            App.Project.Settings.Viewer.filter({
                ids: _this.filterHideCode(['10.20.20.03', '10.01']),
                type: "classCode"
            })
            return
        }
        //新增的
        if (App.Project.filterRule.concat.indexOf(cat) != -1) {
            if (cat == '采光顶') {
                _specialFilterFiles = _this.filterSingleFiles('LR');
                _extArray = [''];
            }
            if (cat == "工程桩") {
                _specialFilterFiles = ['WDGC-Q-ST-基础.rvt'];
                _extArray = ['ST'];
                _hideCode = ['10.01'];
            }
            if (cat == "基坑支护") {
                _specialFilterFiles = ['WDGC-Q-ST-基坑支护.rvt'];
                _extArray = ['ST'];
                _hideCode = ['10.01'];
            }
            if (cat == "幕墙" || cat == "钢结构悬挑构件" || cat == "外保温") {
                _specialFilterFiles = _this.filterSingleFiles('CW&LI');
                _extArray = ['CW&LI'];
                _hideCode = null;
                if (cat == "外保温") {
                    floor = floor.split(',');
                    floor = floor.concat(_this.getFloors("F"));
                    _.each(_this.getFloors("F"), function (item) {
                        _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                        _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                    })
                    App.Project.Settings.Viewer.filter({
                        ids: _this.filterHideCode(['10.10.20.03.06.20.10'], true),
                        type: "classCode"
                    })
                    _extArray = ['AR'];
                }
            }
            if (cat == '步行街吊顶风口') {
                _specialFilterFiles = _this.filterSingleFiles('IN&GS')
                    .concat(_this.filterSingleFiles('AC'));
                _extArray = ['IN&GS', 'AC'];
                _hideCode = ['10.10.30.03.21'];
            }
            if (cat == '卫生间防水') {
                _specialFilterFiles = _this.filterSingleFiles('IN&GS');
                if (floor) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + floor + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + floor + '-RF.rvt');
                } else {
                    _.each(_this.getFloors(), function (item) {
                        _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                        _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                    })
                }
                _extArray = ['IN&GS', 'AR'];
                _hideCode = ['10.10.30.03.21'];
            }
            if (cat == '地下防水') {
                _specialFilterFiles = ['WDGC-Q-ST-垫层防水层.rvt'];
                _specialFilterFiles.push('WDGC-Q-ST-' + _this.getFloors("B")[0] + '.rvt');
                _.each(_this.getFloors("B"), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                _extArray = ['ST', 'AR'];
                floor = _this.getFloors("B");
                floor.push('其它');
                App.Project.Settings.Viewer.filter({
                    ids: _this.filterHideCode(['10.20.20.09', '10.10.20.03.06.40', '10.20.20.30.15'], true),
                    type: "classCode"
                })
            }
            if (cat == '屋面防水' || cat == "电梯机房") {
                _specialFilterFiles = _this.filterSingleFiles('ST');
                floor = _this.getFloors().slice(4);
                _extArray = ['ST', 'AR'];
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
            }
            if (cat == '屋面虹吸雨排') {
                _specialFilterFiles = _this.filterSingleFiles('ST');
                floor = _this.getFloors().slice(4);
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                _extArray = ['ST', 'AR', 'PL'];
                _specialFilterFiles = _specialFilterFiles.concat(_this.filterSingleFiles('PL', ['生活水泵房', '消防水泵房', '水泵房', '市政']));
            }
            if (cat == "消防泵房" || cat == "给水泵房" || cat == "湿式报警阀室") {
                _specialFilterFiles = _this.filterSingleFiles('PL');
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                //	.concat(['WDGC-Q-AR-'+floor+'.rvt','WDGC-Q-AR-'+floor+'-RF.rvt']);
                _hideCode = ['10.10.30.03.21'];
                _extArray = ['AR', 'PL'];
            }
            if (cat == "空调机房") {
                _specialFilterFiles = _this.filterSingleFiles('AC');
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                //	.concat(['WDGC-Q-AR-'+floor+'.rvt','WDGC-Q-AR-'+floor+'-RF.rvt']);
                _hideCode = ['10.10.30.03.21'];
                _extArray = ['AC', 'AR'];
            }
            if (cat == "冷冻机房") {
                _specialFilterFiles = _this.filterSingleFiles('AC');
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                //.concat(['WDGC-Q-AR-'+floor+'.rvt','WDGC-Q-AR-'+floor+'-RF.rvt']);
                _hideCode = ['10.10.30.03.21'];
                _extArray = ['AC', 'AR'];
            }
            if (cat == "变配电室" || cat == "发电机房") {
                _specialFilterFiles = _this.filterSingleFiles('EL');
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                //.concat(['WDGC-Q-AR-'+floor+'.rvt','WDGC-Q-AR-'+floor+'-RF.rvt']);
                _hideCode = ['10.10.30.03.21'];
                _extArray = ['EL', 'AR'];
            }
            if (cat == "慧云机房") {
                _specialFilterFiles = _this.filterSingleFiles('TE');
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                _hideCode = ['10.10.30.03.21'];
                _extArray = ['TE', 'AR'];
            }
            if (cat == "电梯底坑") {
                _specialFilterFiles = _this.filterSingleFiles('ST');
                _hideCode = ['10.20.20.03', '10.20.20.06'];
                _extArray = ['ST'];
            }
            if (cat == "吊顶" || cat == "地面" || cat == "中庭栏杆") {
                _specialFilterFiles = _this.filterSingleFiles('IN&GS');
                _.each(_this.getFloors(), function (item) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                })
                _hideCode = null;
                if (cat != "吊顶") {
                    _hideCode = ['10.10.30.03.21'];
                }
                _extArray = ['IN&GS', 'AR'];
            }
            if (cat == "竖井") {
                _specialFilterFiles = _this.filterSingleFiles('ST')
                    .concat(_this.filterSingleFiles('PL'))
                    .concat(_this.filterSingleFiles('AC'))
                    .concat(_this.filterSingleFiles('EL'))
                    .concat(_this.filterSingleFiles('TE'))
                if (floor) {
                    _specialFilterFiles.push('WDGC-Q-AR-' + floor + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + floor + '-RF.rvt');
                } else {
                    _.each(_this.getFloors(), function (item) {
                        _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                        _specialFilterFiles.push('WDGC-Q-AR-' + item + '-RF.rvt');
                    })
                }
                _hideCode = ['10.10.30.03.21', '10.20.20.03'];
                _extArray = ['ST', 'AR', 'PL', 'AC', 'EL', 'TE'];
            }
            this.linkSilder('floors', floor);
            this.linkSilderSpecial('specialty', _specialFilterFiles, _extArray);
            if (_hideCode) {
                App.Project.Settings.Viewer.filter({
                    ids: _this.filterHideCode(_hideCode),
                    type: "classCode"
                })
            }
        }
    },
    //分类过滤
    specialNameFilter: function (name, isClude, extName) {
        var result = [name];
        var data = App.Project.Settings.Viewer.SpecialtyFileObjData;
        if (!isClude) {
            _.each(data[name], function (item) {
                if (item.fileName.indexOf(extName) != -1) {
                    result.push(item.fileName)
                }
            })
        } else {
            _.each(data[name], function (item) {
                if (item.fileName.indexOf(extName) == -1) {
                    result.push(item.fileName)
                }
            })
        }
        return result;
    },
    subStringer: function (name) {
        var p = name.split('.')[0];
        var a = p.split('-').pop();
        return a;
    },
    filterSingleFiles: function (type, name, include) {
        var _this = this;
        var data = App.Project.Settings.Viewer.SpecialtyFileSrcData;
        var result = [];
        _.each(data, function (item) {
            if (item.specialtyCode == type) {
                result = result.concat(_.pluck(item.files, 'fileName'));
            }
        })
        if (name) {
            var t = _.filter(result, function (item) {
                if (include) {
                    return name.indexOf(_this.subStringer(item)) != -1;
                } else {
                    return name.indexOf(_this.subStringer(item)) == -1;
                }
            })
            result = t;
        }
        return result;
    },
    filterCCode: function (code) {
        var _class = App.Project.Settings.Viewer.ClassCodeData,
            _all = [];
        hide = [];
        if (typeof code == 'string') {
            code = [code];
        }
        _.each(_class, function (item) {
            _.find(code, function (i) {
                if (item.code.indexOf(i) == 0) {
                    return true;
                }
                hide.push(item.code);
                return false;
            })
        })
        return hide;
    },
    //flag true 显示 false 隐藏
    filterHideCode: function (code, flag) {
        var _class = App.Project.Settings.Viewer.ClassCodeData;
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
    //默认参数
    Defaults: {
        type: "user",
        loadingTpl: '<td colspan="10" class="loadingTd">' +
            (App.Local.data['system']['l-g'] || '正在加载，请稍候……') +
            '</td>',
        fetchNavType: 'file', // 默认加载的类型
        projectNav: "", //项目导航 计划 成本 设计 质量
        property: "poperties", // 项目导航 下的 tab  如：检查 属性
        fileId: "",
        token: "",
        isShare: false,
        searchText: "", //搜索的文本
        projectId: "", //项目id
        versionId: "", //版本id
        viewPintId: "", //批注id 存在此id直接跳转到 批注
        attrView: null,
        CurrentVersion: null, //当前版本信息
        DataModel: null //渲染模型的数据
    },
    //计划状态
    planStatus: {
        0: '',
        1: 'myIcon-circle-red',
        2: 'myIcon-circle-yellow',
        3: 'myIcon-circle-green'
    },
    //格式化占位符
    formatPointPlace: function (p, t) {
        if (p == 0 && t == 0) {
            return '--';
        } else {
            return p + "/" + t;
        }
    },
    //空页面
    NullPage: {
        designVerification: '<div class="nullPage concerns"><i class="bg"></i>' +
            (App.Local.data['drawing-model'].Nhd || '暂无隐患') +
            '</div>', //设计检查 质量 隐患
        planModel: '<div class="nullPage noPlan"><i class="bg"></i>' +
            (App.Local.data.source.Npf || '暂无计划节点') +
            '</div>', //计划 模块化 模拟
        planPublicity: '<div class="nullPage publicity" data-i18n="[append]data.drawing-model.Nfs"><i class="bg"></i>' +
            (App.Local.data['drawing-model'].Nfs || '暂无内容') +
            '</div>', //计划 关注
        costList: '<div class="nullPage costList"><i class="bg"></i>' +
            (App.Local.data['drawing-model'].Nbd1 || '暂无清单项') +
            '</div>', //成本 清单
        costChange: '<div class="nullPage costChange"><i class="bg"></i>' +
            (App.Local.data['drawing-model'].Nvd1 || '暂无变更单') +
            '</div>', //成本 变更
        planVerification: '<div class="nullPage planVerification"><i class="bg"></i> <div>您还没有关联校验</div>  <span>点此进行关联校验</span> </div>' //计划成本 关联校验
    },
    //客户化数据映射字典
    mapData: {
        organizationTypeId: ['', '质监', (App.Local.data['drawing-model'].TPy || '第三方'), (App.Local.data['drawing-model'].Owner || '项目公司'), (App.Local.data['drawing-model'].SIn || '监理单位')],
        status: ['', (App.Local.data['drawing-model'].RLr || '待整改'), (App.Local.data['drawing-model'].Rectified || '已整改'), (App.Local.data['drawing-model'].Closed || '已关闭')],
        statusColor: ['', '#FF2500', '#FFAD25', '#00A648'],
        /*
		processCategory: ['', '工程桩', '基坑支护', '地下室外墙防水', '梁柱节点', '钢结构悬挑构件', '幕墙', '外保温',
			'采光顶', '步行街吊顶风口', '卫生间防水', '屋面防水', '屋面虹吸雨排', '消防泵房', '给水泵房',
			'湿式报警阀室', '空调机房', '冷冻机房', '变配电室', '发电机房', '慧云机房', '电梯机房', '电梯底坑',
			'吊顶', '地面', '中庭栏杆', '竖井' , '地下室底板防水'
		],
		*/
        processCategory: ['',
            { value: 1, text: '工程桩' },
            { value: 2, text: '基坑支护' },
            { value: 3, text: '地下室外墙防水' },
            { value: 27, text: '地下室底板防水' },
            { value: 4, text: '梁柱节点' },
            { value: 5, text: '钢结构悬挑构件' },
            { value: 6, text: '幕墙' },
            { value: 7, text: '外保温' },
            { value: 8, text: '采光顶' },
            { value: 9, text: '步行街吊顶风口' },
            { value: 10, text: '卫生间防水' },
            { value: 11, text: '屋面防水' },
            { value: 12, text: '屋面虹吸雨排' },
            { value: 13, text: '消防泵房' },
            { value: 14, text: '给水泵房' },
            { value: 15, text: '湿式报警阀室' },
            { value: 16, text: '空调机房' },
            { value: 17, text: '冷冻机房' },
            { value: 18, text: '变配电室' },
            { value: 19, text: '发电机房' },
            { value: 20, text: '慧云机房' },
            { value: 21, text: '电梯机房' },
            { value: 22, text: '电梯底坑' },
            { value: 23, text: '吊顶' },
            { value: 24, text: '地面' },
            { value: 25, text: '中庭栏杆' },
            { value: 26, text: '竖井' }
        ],
        openCategory: ['', '幕墙',
            '采光顶', '步行街吊顶风口', '卫生间防水', '屋面防水', '屋面虹吸雨排', '消防泵房', '给水泵房',
            '湿式报警阀室', '空调机房', '冷冻机房', '变配电室', '发电机房', '慧云机房', '电梯机房', '电梯底坑',
            '吊顶', '地面', '中庭栏杆', '竖井'
        ],
        openCategoryId: ['', 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        concernsCategory: ['', (App.Local.data['drawing-model'].PIn1 || '过程检查'), (App.Local.data['drawing-model'].PAe1 || '过程验收'), (App.Local.data['drawing-model'].PIe || '开业验收')],
        concernsStatus: ['', (App.Local.data['drawing-model'].RLr || '待整改'), (App.Local.data['drawing-model'].Rectified || '已整改'), (App.Local.data['drawing-model'].Closed || '已关闭')],
        concernsReporter: ['', (App.Local.data['drawing-model'].CEr || '质监中心'), (App.Local.data['drawing-model'].TPy || '第三方'), (App.Local.data['drawing-model'].Owner || '项目公司'), (App.Local.data['drawing-model'].SIn || '监理单位')],
        concernsLevel: ['', (App.Local.data['drawing-model'].Small || '一般'), (App.Local.data['drawing-model'].Medium || '较大'), (App.Local.data['drawing-model'].Large || '重大'), (App.Local.data['drawing-model'].ELe || '特大')],
        concernsType: ['', '防水工程', '施工质量', '安全文明', '材料设备'],
        designSpecial: ['', '建筑', '结构', '设备', '电气', '景观', '内装及导视', '夜景照明'],
        designCategory: ['', '安全类', '品质类', '功能类'],
        designStatus: ['', (App.Local.data['drawing-model'].RLr || '待整改'), (App.Local.data['drawing-model'].Rectified || '已整改'), (App.Local.data['drawing-model'].Closed || '已关闭')],
        designUnit: ['', '设计总包'],
        deviceSpecial: ['', '通风空调'],
        deviceCategory: ['', '冷冻水', '冷却水'],
        deviceStatus: ['', (App.Local.data['drawing-model'].Qualified || '合格'), '有退场']
    },
    //用于切换Tab Flag 请勿修改
    currentQATab: 'other',
    currentLoadData: {
        open: null,
        process: null,
        dis: null
    },
    checkStatus: function (color) {
        if (color == 1) {
            return 'myIcon-circle-green';
        } else if (color == 2) {
            return 'myIcon-circle-red';
        } else {
            return '';
        }
    },
    //过滤器还原（计划[模块化、模拟],质量[开业、过程、隐患],设计[碰撞],成本[清单、校验]）
    recoverySilder: function () {
        var show = '建筑,结构,景观,幕墙,采光顶,景观&导识,幕墙&泛光',
            hide = '暖通,电气,智能化,给排水,内装,内装&导识';
        var $sp = $('.modelSidebar #specialty>.tree>li');
        App.Project.Settings.Viewer.fileFilter({
            ids: [],
            total: App.Project.Settings.Viewer.FloorFilesData
        });
        App.Project.Settings.Viewer.filter({
            ids: [],
            type: "classCode"
        })
        App.Project.Settings.Viewer.filter({
            type: "plan",
            ids: []
        });
        App.Project.Settings.Viewer.translucent(false);
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
        App.Project.Settings.Viewer.fileFilter(specialty);
        App.Project.Settings.Viewer.filter(category);
        App.Project.Settings.Viewer.filter(classCode);
        App.Project.Settings.Viewer.filter({
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
    linkSilderCategory: function (type, key) {
        if (!key) {
            return
        }
        var $check = $('.modelSidebar #' + type + ' input'),
            $treeText = $('.modelSidebar #' + type + ' .treeText');
        $check.each(function () {
            if (!$(this).is(':checked')) {
                $(this).trigger('click');
            }
        })
        $treeText.each(function () {
            var _ = $(this).parent().find('input');
            if ($(this).text() == key) {
                _.trigger('click');
            }
        })
    },
    cacheMarkers: function (type, data) {
        this.currentLoadData[type] = data;
        if (type == 'process') {
            App.Project.isShowMarkers(type, $('.QualityProcessAcceptance .btnCk').hasClass('selected'));
        } else if (type == 'open') {
            App.Project.isShowMarkers(type, $('.QualityOpeningAcceptance .btnCk').hasClass('selected'));
        } else if (type == 'dis') {
            App.Project.isShowMarkers(type, $('.QualityConcerns .btnCk').hasClass('selected'));
        }
    },
    parseFilterFloor: function (type) {
        var data = this.currentLoadData[type],
            floors = '其它';
        _.each(data, function (i) {
            var t = i.locationName || '';
            if (t) {
                var f = t.match(/[A-Z][0-9]{2}/) || [];
                if (floors.indexOf(f) == -1) {
                    floors += "," + f.join(',');
                }
            }
        })
        return floors;
    },
    getBoxs: function (type) {
        var boxs = [],
            typeMap = {
                'concerns': 'dis',
                'processacceptance': 'process',
                'openingacceptance': 'open'
            },
            type = typeMap[type];
        data = this.currentLoadData[type];
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
    //是否显示标记
    //type tab类型 flag 是否显示的标记
    //type:open process dis other
    isShowMarkers: function (type, flag) {
        var _this = this;
        var viewer = App.Project.Settings.Viewer;
        if (!viewer) return;
        if (type != 'other' && flag) {
            _this.recoverySilder();
            var shaType = type == 'dis' ? 1 : 0;
            var data = this.currentLoadData[type],
                result = [],
                boxs = [],
                scenceIds = [];
            if (_.isArray(data)) {
                _.each(data, function (i) {
                    if (i.componentId) {
                        scenceIds.push(i.componentId.split('.')[0]);
                        if (i.location && i.location.indexOf('boundingBox') != -1) {
                            if (type == 'dis') {
                                var _loc = JSON.parse(i.location);
                                result.push(_this.formatMark(_loc, "S021".charAt(i.status), i.id, 1));
                                boxs.push(_loc.boundingBox);
                            } else {
                                var _loc = JSON.parse(i.location);
                                boxs.push(_loc.boundingBox);
                                result.push(_this.formatMark(i.location, '543'.charAt(i.colorStatus), i.id));
                            }
                        }
                    }
                })
                if (type == "process" && _this.currentProsCat && data.length) {
                    var _floor = _this.currentProsCheckFloor;
                    var marginRule = _this.marginRule[_this.currentProsCat] || {};
                    if (!_floor) {
                        _floor = _this.parseFilterFloor(type);
                    } else {
                        if ('外保温、幕墙、钢结构悬挑构件'.indexOf(_this.currentProsCat) != -1) {
                            _floor = _floor + ',' + '其它';
                        }
                    }
                    _this.commSingleRule(_this.currentProsCat, _floor, scenceIds, function (margin, ratio) {
                        //	App.Project.Settings.Viewer.setTopView(boxs, false,margin||marginRule.margin, ratio||marginRule.ratio);
                    });
                    $(".QualityProcessAcceptance .tbProcessAccessBody tr").removeClass('selected');
                } else if (type == "open" && _this.currentOpenCat && data.length) {
                    var _floor = _this.currentOpenCheckFloor;
                    var marginRule = _this.marginRule[_this.currentOpenCat] || {};
                    if (!_floor) {
                        _floor = _this.parseFilterFloor(type);
                    } else {
                        if ('外保温、幕墙、钢结构悬挑构件'.indexOf(_this.currentOpenCat) != -1) {
                            _floor = _floor + ',' + '其它';
                        }
                    }
                    _this.commSingleRule(_this.currentOpenCat, _floor, scenceIds, function (margin, ratio) {
                        //	App.Project.Settings.Viewer.setTopView(boxs, false,margin||marginRule.margin, ratio||marginRule.ratio);
                    });
                    $(".QualityProcessAcceptance .tbProcessAccessBody tr").removeClass('selected');
                }
                //var filter = App.Project.Settings.Viewer.viewer.getFilter();
                //filter.enableSceneOverrider(false);
                App.Project.Settings.Viewer.showAll();
                App.Project.Settings.Viewer.setTopView(boxs, true);
                //viewer.viewer.setMarkerClickCallback(App.Project.markerClick); //old interface
                viewer.getMakerObject().setMarkerClickCallback(App.Project.markerClick);  // add by wuweiwei new interface
                viewer.loadMarkers(result);
                App.Project.Settings.Viewer.highlight({
                    type: 'userId',
                    ids: undefined
                });
            }
        } else {
            viewer.loadMarkers(null);
        }
    },
    //获取当前检查点所在位置(页码),和当前页码所在的数据队列
    //pageNum pageSize id
    catchPageData: function (type, param) {
        var start = 0, end = 0, result = {}, list = [], counter = 0,
            opts = $.extend({}, {
                id: "",
                pageSize: 20,
                pageNum: 1
            }, param),
            data = this.currentLoadData[type],
            _len = data.length;
        if (opts.id) {
            for (var i = 0, size = _len; i < size; i++) {
                if (data[i].id == opts.id) {
                    counter = i + 1;
                    break
                }
            }
            opts.pageNum = Math.ceil(counter / opts.pageSize) || 1;
        }
        start = (opts.pageNum - 1) * opts.pageSize;
        end = opts.pageNum * opts.pageSize;
        end = end < _len ? end : _len;
        for (; start < end; start++) {
            list.push(data[start]);
        }
        result = {
            items: list,
            pageCount: Math.ceil(_len / opts.pageSize),
            pageItemCount: opts.pageSize,
            pageIndex: opts.pageNum,
            totalItemCount: _len
        }
        return result;
    },
    //从缓存获取数据
    // 文件 容器
    FileCollection: new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    title: ""
                }
            }
        }),
        urlType: "fetchFileList",
        parse: function (responese) {
            var language = App.Local.currentIsEn ? "en-US" : "zh-CN";
            var nullDataTxt = "无数据";
            if (language === "fr-FR") {
                nullDataTxt = "无数据";
            } else if (language === "en-US" || language === "en-GB") {
                nullDataTxt = "No data found";
            } else if (language === "zh-CN") {
                nullDataTxt = "无数据";
            }
            if (responese.code == 0) {
                if (responese.data.length > 0) {
                    return responese.data;
                } else {
                    $("#projectContainer .fileContainerScroll .changeContrastBox").html('<li class="loading" data-i18n="data.drawing-model.Ndd">' + nullDataTxt + '</li>');
                }
            }
        }
    })),
    disablePreview($ele) {
        return $ele.is('span');
    },
    bindContextMenu: function ($el) {
        var _this = this;
        //右键菜单
        if (!document.getElementById("listContextProject")) {
            //右键菜单
            var contextHtml = _.templateUrl("/projects/tpls/listContext.html", true);
            $("body").append(contextHtml);
        }
        $el.contextMenu('listContextProject', {
            //显示 回调
            onShowMenuCallback(event) {
                event.preventDefault();
                let $target = $(event.target);
                var $item = $target.closest(".item");
                var downLoadModelProject = $("#downLoadModelProject");//下载按钮
                if (App.AuthObj.project && App.AuthObj.project.prjfile && App.AuthObj.project.prjfile.download) {
                } else {
                    downLoadModelProject.addClass('disable');
                }
                if (App.Project.Settings.isBimControl) {
                    $("#reNameModelProject").removeClass('disable');
                    //预览
                    if ($item.find(".folder").length > 0 || _this.disablePreview($target)) {
                        $("#previewModelProject").addClass("disable");
                        $("#previewModelProject").find("a").removeAttr("href");
                    } else {
                        $("#previewModelProject").removeClass("disable");
                        var href = $item.find(".fileName .text").prop("href");
                        $("#previewModelProject").find("a").prop("href", href);
                        //重命名 未上传
                        if ($item.data("status") == 1) {
                            $("#reNameModelProject").addClass('disable');
                        }
                    }
                    if (!App.Comm.isAuth('rename')) {
                        $("#reNameModelProject").addClass('disable').attr('disabled', 'disabled');
                    }
                    if (!App.Comm.isAuth('delete')) {
                        $("#delModelProject").addClass('disable').attr('disabled', 'disabled');
                    }
                } else {
                    var previewModelProject = $("#previewModelProject");//预览按钮
                    var downLoadModelProject = $("#downLoadModelProject");//下载按钮
                    var delModelProject = $("#delModelProject");//删除按钮
                    var reNameModelProject = $("#reNameModelProject");//重命名按钮
                    previewModelProject.removeClass('disable');
                    downLoadModelProject.removeClass('disable');
                    delModelProject.removeClass('disable');
                    reNameModelProject.removeClass('disable');
                    if ($item.find(".folder").length > 0 || _this.disablePreview($target)) {
                        previewModelProject.addClass("disable").find("a").removeAttr("href");
                    } else {
                        var href = $item.find(".fileName .text").prop("href");
                        previewModelProject.find("a").prop("href", href);
                        //重命名 未上传
                        if ($item.data("status") == 1) {
                            $("#reNameModelProject").addClass('disable');
                        }
                    }
                    if (!App.Project.Settings.authBool) {
                        delModelProject.addClass('disable').attr('disabled', 'disabled');
                        reNameModelProject.addClass('disable').attr('disabled', 'disabled');
                    }
                }
                $item.addClass("selected").siblings().removeClass("selected");
                if ($('#listContextProject li[class!=disable]').length == 0) {
                    $('#listContextProject').parent().hide();
                }
                window.Global.DemoEnv();
            },
            shadow: false,
            bindings: {
                'previewModel': function ($target) {
                },
                'downLoadModelProject': function (item) {
                    var $item = $(item),
                        //下载链接
                        fileVersionId = $item.find(".filecKAll").data("fileversionid"),
                        sizeData = $item.find(".filecKAll").attr("data-sizeData");
                    isfolder = $item.find(".filecKAll").attr("data-isfolder");
                    if (sizeData == "" && isfolder == "false") {
                        alert("文件为空，不能下载！");
                        return;
                    }
                    App.Comm.checkDownLoad(App.Project.Settings.projectId, App.Project.Settings.CurrentVersion.id, fileVersionId);
                },
                'delModelProject': function (item) {
                    var rel = $('#delModelProject'),
                        $item = $(item);
                    if (rel.hasClass('disable')) {
                        return;
                    }
                    if (!App.Project.Settings.isBimControl) {
                        _this.isCanDelteFileHandle($item.find(".filecKAll").data("fileversionid"), function (data) {
                            if (!data) {
                                _this.delFile($item);
                            } else {
                                let tipText = "该图纸文件包含已移交的历史版本，不允许删除";
                                if (App.Comm.getCookie("isEnglish") == "true") {
                                    tipText = "The file has historical versions that has been transferred and is not allowed to be deleted";
                                }
                                $.tip({
                                    message: tipText,
                                    timeout: 4000,
                                    type: "alarm"
                                })
                            }
                        })
                    } else {
                        _this.delFile($item);
                    }
                },
                'reNameModelProject': function (item) {
                    // debugger;
                    //重命名
                    var $item = $(item);
                    var $reNameModel = $("#reNameModelProject");
                    //不可重命名状态
                    if ($reNameModel.hasClass('disable')) {
                        return;
                    }
                    if (!App.Project.Settings.isBimControl) {
                        _this.isCanDelteFileHandle($item.find(".filecKAll").data("fileversionid"), function (data) {
                            if (!data) {
                                // _this.delFile($item);
                                var $prevEdit = $(".fileContent .txtEdit");
                                if ($prevEdit.length > 0) {
                                    _this.cancelEdit($prevEdit);
                                    return
                                }
                                // debugger;
                                var delModuleCreate = (App.Local.data.source.Ayfr1 || "如不按照默认目录地图进行上传，会导致模型集成及业务数据关联存在问题") + '，确认要修改么？';

                                function modifyFolder() {
                                    var $item = $(item),
                                        $fileName = $item.find(".fileName"),
                                        text = $fileName.find(".text").hide().text().trim();
                                    $fileName.append('<input type="text" value="' + text + '" class="txtEdit txtInput" /> <span class="btnEnter myIcon-enter"></span><span class="btnCalcel pointer myIcon-cancel"></span>');
                                }

                                let $span = $(item).find('span:first');
                                if ($span.data('ismodularcreate') && ($span.data('modularflowstatus') !== 'wanda')) {
                                    new App.Comm.modules.Dialog({
                                        width: 580,
                                        height: 168,
                                        limitHeight: false,
                                        title: '修改文件提示',
                                        cssClass: 'deleteFileDialog',
                                        okClass: "delFile",
                                        okText: App.Local.data['model-view'].OK || '确&nbsp;&nbsp;认',
                                        okCallback: function okCallback() {
                                            modifyFolder();
                                        },
                                        message: delModuleCreate
                                    });
                                } else {
                                    modifyFolder();
                                }
                            } else {
                                let tipText = "该图纸文件包含已移交的历史版本，不允许重命名";
                                if (App.Comm.getCookie("isEnglish") == "true") {
                                    tipText = "The file has historical versions that has been transferred and is not allowed to be renamed";
                                }
                                $.tip({
                                    message: tipText,
                                    timeout: 4000,
                                    type: "alarm"
                                })
                            }
                        })
                    } else {
                        // _this.delFile($item);
                        var $prevEdit = $(".fileContent .txtEdit");
                        if ($prevEdit.length > 0) {
                            _this.cancelEdit($prevEdit);
                            return
                        }
                        // debugger;
                        var delModuleCreate = (App.Local.data.source.Ayfr1 || "如不按照默认目录地图进行上传，会导致模型集成及业务数据关联存在问题") + '，确认要修改么？';

                        function modifyFolder() {
                            var $item = $(item),
                                $fileName = $item.find(".fileName"),
                                text = $fileName.find(".text").hide().text().trim();
                            $fileName.append('<input type="text" value="' + text + '" class="txtEdit txtInput" /> <span class="btnEnter myIcon-enter"></span><span class="btnCalcel pointer myIcon-cancel"></span>');
                        }

                        let $span = $(item).find('span:first');
                        if ($span.data('ismodularcreate') && ($span.data('modularflowstatus') !== 'wanda')) {
                            new App.Comm.modules.Dialog({
                                width: 580,
                                height: 168,
                                limitHeight: false,
                                title: '修改文件提示',
                                cssClass: 'deleteFileDialog',
                                okClass: "delFile",
                                okText: App.Local.data['model-view'].OK || '确&nbsp;&nbsp;认',
                                okCallback: function okCallback() {
                                    modifyFolder();
                                },
                                message: delModuleCreate
                            });
                        } else {
                            modifyFolder();
                        }
                    }
                }
            }
        });
    },
    addNewFileModel() {
        var model = {
            isAdd: true,
            children: null,
            createTime: null,
            creatorId: "",
            creatorName: "",
            digest: null,
            fileVersionId: null,
            floor: null,
            folder: true,
            id: 'createNew',
            length: null,
            locked: null,
            modelId: null,
            modelStatus: null,
            modificationId: null,
            name: App.Local.getTranslation('drawing-model.New'),
            parentId: null,
            projectId: null,
            specialty: null,
            status: null,
            suffix: null,
            thumbnail: null,
            modularFlowStatus: null,
            isModularCreate: false
        }
        // debugger;
        App.Project.FileCollection.push(model)
    },
    afterCreateNewFolder(file, parentId) {
        var $treeViewMar = $(".projectNavFileContainer .treeViewMar"),
            $treeViewMarUl = $treeViewMar.find(".treeViewMarUl");
        var data = {
            data: [file],
            iconType: 1
        };
        if ($treeViewMar.find('span[data-id="' + file.id + '"]').length > 0) {
            return;
        }
        //没有的时候绑定点击事件
        if ($treeViewMarUl.length <= 0) {
            data.click = function (event) {
                var file = $(event.target).data("file");
                if (file.folder) {
                    $('#projectContainer .returnBack').attr('isReturn', '1').removeClass('theEnd').html((App.Local.data.source['s-b'] || '返回上级'));
                }
                $("#projectContainer .fileContent").empty();
                App.Project.Settings.fileVersionId = file.fileVersionId;
                App.Project.FileCollection.reset();
                App.Project.FileCollection.fetch({
                    data: {
                        parentId: file.fileVersionId
                    }
                });
            }
        }
        var navHtml = new App.Comm.TreeViewMar(data);
        //不存在创建
        if ($treeViewMarUl.length <= 0) {
            $treeViewMar.html($(navHtml).find(".treeViewMarUl"));
        } else {
            if (parentId) {
                var $span = $treeViewMarUl.find("span[data-id='" + parentId + "']");
                if ($span.length > 0) {
                    var $li = $span.closest('li');
                    if ($li.find(".treeViewSub").length <= 0) {
                        $li.append('<ul class="treeViewSub mIconOrCk" style="display:block;" />');
                    }
                    var $itemContent = $li.children('.item-content'),
                        $noneSwitch = $itemContent.find(".noneSwitch");
                    if ($noneSwitch.length > 0) {
                        $noneSwitch.toggleClass('noneSwitch nodeSwitch on');
                    }
                    var $newLi = $(navHtml).find(".treeViewMarUl li").removeClass("rootNode").addClass('itemNode');
                    $li.find(".treeViewSub:first").prepend($newLi);
                }
            } else {
                $treeViewMarUl.prepend($(navHtml).find(".treeViewMarUl li"));
            }
        }
    },
    createNewFolder: function ($item) {
        var filePath = $item.find(".txtEdit").val().trim(),
            that = this,
            $leftSel = $("#projectContainer .treeViewMarUl .selected"),
            parentId = "";
        if ($leftSel.length > 0) {
            parentId = $leftSel.data("file").fileVersionId;
        }
        // //请求数据
        var data = {
            URLtype: "createNewFolder",
            type: "POST",
            data: {
                projectId: App.Project.Settings.CurrentVersion.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id,
                parentId: parentId,
                filePath: filePath
            }
        };
        App.Comm.ajax(data, function (data) {
            if (data.message == "success") {
                var id = data.data.id,
                    isExists = false;
                $.each(App.Project.FileCollection.models, function (i, item) {
                    if (item.id == id) {
                        isExists = true;
                        return false;
                    }
                });
                //已存在的不在添加 返回
                if (isExists) {
                    that.cancelEdit($item.find(".fileName"));
                    return;
                }
                data.data.isAdd = false;
                //修改数据
                App.Project.FileCollection.last().set(data.data);
                App.Project.afterCreateNewFolder(data.data, parentId);
                //tree name
                //$("#resourceModelLeftNav .treeViewMarUl span[data-id='" + id + "']").text(name);
            } else {
                if (data.code == '19007') {
                    $.tip({ type: 'alarm', message: data.message })// App.Local.data['project-creatName'].creatName || 
                } else if (data.code == '10000') {
                    $.tip({ type: 'alarm', message: '系统错误' })
                }
            }
        });
    },
    afterRemoveFolder(file) {
        if (!file.folder) {
            return;
        }
        var $treeViewMarUl = $("#projectContainer .treeViewMarUl");
        if ($treeViewMarUl.length > 0) {
            var $span = $treeViewMarUl.find("span[data-id='" + file.id + "']");
            if ($span.length > 0) {
                var $li = $span.closest('li'),
                    $parent = $li.parent();
                $li.remove();
                //没有文件夹了
                if ($parent.find("li").length <= 0) {
                    $parent.parent().children(".item-content").find(".nodeSwitch").removeClass().addClass("noneSwitch");
                }
            }
        }
    },
    delFile: function ($item) {
        let delModuleCreate = (App.Local.data.source.Ayfr1 || "如不按照默认目录地图进行上传，会导致模型集成及业务数据关联存在问题") + '，确认要删除么？';
        var dialog = new App.Comm.modules.Dialog({
            width: 580,
            height: 168,
            limitHeight: false,
            title: (App.Local.data.system.notice || '删除文件提示'),
            cssClass: 'deleteFileDialog',
            okClass: "delFile",
            okText: (App.Local.data['model-view'].OK || '确&nbsp;&nbsp;认'),
            okCallback: function () {
                var fileVersionId = $item.find(".filecKAll").data("fileversionid"),
                    id = $item.find(".text").data("id"),
                    models = App.Project.FileCollection.models;
                $(".count").text(models.length - 1);
                //修改数据
                $.each(models, function (i, model) {
                    if (model.toJSON().id == id) {
                        model.urlType = "deleteFile";
                        model.projectId = App.Project.Settings.CurrentVersion.projectId;
                        model.projectVersionId = App.Project.Settings.CurrentVersion.id;
                        model.fileVersionId = fileVersionId;
                        model.destroy();
                        return false;
                    }
                });
            },
            message: $item.find('span:first').data('ismodularcreate') ? delModuleCreate : ($item.find(".folder").length > 0 ? App.Local.data.source.Ayfr : App.Local.data.source.Ayf)
        });
    },
    //取消修改名称
    calcelEditName: function (event) {
        var $prevEdit = $("#projectContainer .txtEdit");
        if ($prevEdit.length > 0) {
            this.cancelEdit($prevEdit);
        }
        return false;
    },
    //取消修改
    cancelEdit: function ($prevEdit) {
        var $item = $prevEdit.closest(".item");
        if ($item.find('span[data-id="createNew"]').length) {
            //取消监听 促发销毁
            var model = App.Project.FileCollection.last();
            model.stopListening();
            model.trigger('destroy', model, model.collection);
            App.Project.FileCollection.models.pop();
            //删除页面元素
            $item.remove();
        } else {
            $prevEdit.prev().show().end().nextAll().remove().end().remove();
        }
    },
    editFolderName: function ($item) {
        var that = this,
            fileVersionId = $item.find(".filecKAll").data("fileversionid"),
            name = $item.find(".txtEdit").val().trim();
        // //请求数据
        var data = {
            URLtype: "putFileReName",
            type: "PUT",
            data: {
                projectId: App.Project.Settings.CurrentVersion.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id,
                fileVersionId: fileVersionId,
                name: name
            }
        };
        App.Comm.ajax(data, function (data) {
            var $prevEdit = $item.find(".txtEdit");
            if (data.code == 0) {
                var id = data.data.id,
                    models = App.Project.FileCollection.models;
                $("#projectContainer .treeViewMarUl span[data-id='" + id + "']").text(name);
                $.each(models, (i, model) => {
                    var dataJson = model.toJSON();
                    if (dataJson.id == id) {
                        model.set(data.data);
                        return false;
                    }
                });
            } else {
                $.tip({
                    type: 'alarm',
                    message: '操作失败:' + data.message
                })
            }
            if ($prevEdit.length > 0) {
                $prevEdit.prev().show().end().nextAll().remove().end().remove();
            }
        });
    },
    //初始化
    init: function () {
        const self = this;
        App.Comm.checkProjectAuthHandle({//检查当前用户对于当前项目是否有数据权限
            projectid: App.Project.Settings.projectId,
            type: 3,
            callbackHandle: function (data) {
                if (data.isExist == 0) {
                    const promiseObj = new Promise((resolve, reject) => {
                        self.fetchProjectDetail(resolve, reject)
                    })
                    if (!location.hash.split('=').includes('message')) {
                        promiseObj
                            .then(App.CommonModule.getRemoteModel)
                            .then((data) => App.CommonModule.promptRemoteModelDialog(data))
                            .catch(() => {
                            });
                    }
                } else if (data.isExist == 1) {
                    $.tip({
                        message: App.Local.data["no-permission"].permission || "用户无项目权限",
                        timeout: 3000,
                        type: "alarm"
                    })
                    setTimeout(function () {
                        location.href = "#projects";
                    }, 3200)
                } else if (data.isExist == 2) {
                    $.tip({
                        type: 'alarm',
                        message: '当前用户在索引中不存在:' + data.isExist
                    })
                }
            }
        });
    },
    //获取项目信息信息
    fetchProjectDetail: function (resolve, reject) {
        let projectData = {
            projectId: App.Project.Settings.projectId,
            versionId: App.Project.Settings.versionId
        };
        let data = {
            URLtype: "fetchProjectDetail",
            data: projectData
        };
        App.Comm.ajax(data, data => {
            if (data.code == 0) {
                data = data.data;
                if (!data) {
                    $('#pageLoading').hide();
                    var opts = {
                        title: "提示",
                        width: 601,
                        isConfirm: false,
                        isAlert: true,
                        cssClass: "addNewApp",
                        message: '项目无内容、点击确认返回首页',
                        okCallback: () => {
                            document.location.href = '/index.html';
                            return false;
                        }
                    }
                    new App.Comm.modules.Dialog(opts);
                    return;
                }
                App.Project.Settings.projectName = data.projectName;
                App.Project.Settings.CurrentVersion = data;
                App.Project.Settings.ProjectCreatorId = data.creatorId;
                if (data.isBimControl == 1 || data.isBimControl == 3) {
                    App.Project.Settings.isBimControl = true;
                } else if (data.isBimControl == 2) {
                    App.Project.Settings.isBimControl = false;
                }
                // App.Project.Settings.isBimControl = data.isBimControl==0?false:true;//当前项目是否是bim或者是总包交钥匙
                // App.Project.Settings.isBimControl = true;//当前项目是否是bim或者是总包交钥匙
                //加载数据
                App.Project.loadData({ isExpand: false });
                App.Local.setI18n();
                resolve({
                    projectId: App.Project.Settings.projectId,
                    versionId: App.Project.Settings.CurrentVersion.id,
                })
            }
        });
    },
    //加载版本
    loadVersion: function (callback) {
        var data = {
            URLtype: "fetchCrumbsProjectVersion",
            data: {
                projectId: App.Project.Settings.projectId
            }
        };
        App.Comm.ajax(data).done(function (data) {
            if (_.isString(data)) {
                // to json
                if (JSON && JSON.parse) {
                    data = JSON.parse(data);
                } else {
                    data = $.parseJSON(data);
                }
            }
            if ($.isFunction(callback)) {
                callback(data);
            }
        });
    },
    //渲染版本
    renderVersion: function (data) {

        //成功
        if (data.message == "success") {
            var VersionGroups = data.data,
                gCount = VersionGroups.length,
                cVersionGroup;
            for (var i = 0; i < gCount; i++) {
                if (App.Project.Settings.CurrentVersion) {
                    break;
                }
                cVersionGroup = VersionGroups[i];
                var cVersionDate, VersionsDates = cVersionGroup.item,
                    dateCount = VersionsDates.length;
                for (var j = 0; j < dateCount; j++) {
                    if (App.Project.Settings.CurrentVersion) {
                        break;
                    }
                    cVersionDate = VersionsDates[j];
                    var Versions = cVersionDate.version,
                        vCount = Versions.length,
                        cVersion;
                    for (var k = 0; k < vCount; k++) {
                        cVersion = Versions[k];
                        if (cVersion.latest) {
                            App.Project.Settings.projectName = cVersion.projectName;
                            App.Project.Settings.CurrentVersion = cVersion;
                            break;
                        }
                    }
                }
            }
            //取到了当前版本
            if (App.Project.Settings.CurrentVersion) {
                //加载数据
                App.Project.loadData();
            } else {
                //无版本 数据错误
                alert("版本获取错误");
            }
        } else {
            alert("版本获取错误");
        }
    },
    // 加载数据
    loadData: function ({ isExpand = true }) {
        //var $contains = $("#contains");
        $("#contains").html(new App.Project.ProjectApp().render().el);
        var status = App.Project.Settings.CurrentVersion.status;
        if (App.Project.Settings.isBimControl) {
            if (status != 9 && status != 4 && status != 7 && status != 15) {//初始化上传方法
                App.Project.upload = App.modules.docUpload.init($(document.body));
            }
        } else {
            App.Comm.upload.destroy();
        }
        //api 页面 默认加载模型 && App.Project.Settings.loadType == "model"
        if (App.Project.Settings.type == "token" && window.location.href.indexOf("plan/") != -1) {
            $("#projectContainer").find(".fileContainer").hide().end().find(".modelContainer").show();
        } else if (App.Project.Settings.type == "token" && window.location.href.indexOf("version/") != -1) {
            $("#projectContainer").find(".modelContainer").hide().end().find(".fileContainer").show();
        }
        // 导航文件
        App.Project.fetchFileNav(isExpand);
        //导航模型
        //App.Project.fetchModelNav();
        App.Project.FileCollection.projectId = App.Project.Settings.projectId;
        App.Project.FileCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
        App.Project.FileCollection.reset();
        //文件列表
        App.Project.FileCollection.fetch({
            data: {
                parentId: App.Project.Settings.fileId
            }
        });
        //初始化滚动条
        try {
            App.Project.initScroll($("#projectContainer .fileContainer .mCSB_container"), "y");
        } catch (e) {
            ;
        }
        //事件初始化
        App.Project.initEvent();
        //全局事件 只绑定一次
        if (!App.Project.Settings.initGlobalEvent) {
            App.Project.Settings.initGlobalEvent = true;
            App.Project.initGlobalEvent();
        }
        //设置项目可查看的属性
        this.setPropertyByAuth();
        // //api 页面 默认加载模型 && App.Project.Settings.loadType == "model"
        if (App.Project.Settings.type == "token" && window.location.href.indexOf("plan/") != -1) {
            $(".fileNav .model").click();
            //分享
            // if (window.location.href.indexOf("share") > 10) {
            // 	//初始化分享
            // 	App.Project.Share.init();
            // }
        } else if (App.Project.Settings.type == "token" && window.location.href.indexOf("version/") != -1) {
            $(".fileNav .file").click();
        }
        $('.rightProperty').css('margin-right', -$('.rightProperty').width())
        // //存在viewpintid
        // if (App.Project.Settings.viewPintId) {
        // 	$(".fileNav .notes").click();
        // }
        window.Global.DemoEnv("projectDocBtn");
        /*add by wuweiwei*/
    },
    //设置 可以查看的属性
    setPropertyByAuth: function () {
        var projectAuth = App.AuthObj && App.AuthObj.project;
        if (projectAuth) {
            var ProjectTab = App.Comm.AuthConfig.Project,
                $projectTab = $(".projectContainerApp .projectHeader .projectTab");
            //设计
            //if (projectAuth.design) {
            //	$projectTab.append(ProjectTab.DesignTab.tab);
            //}
            //计划
            //if (projectAuth.plan) {
            //	$projectTab.append(ProjectTab.PlanTab.tab);
            //}
            //成本
            if (projectAuth.cost) {
                $projectTab.append(ProjectTab.CostTab.tab);
            }
            //质量
            if (projectAuth.quality) {
                $projectTab.append(ProjectTab.QualityTab.tab);
            }
            $projectTab.find(".item:last").addClass('last');
            // if (!App.AuthObj.project || !App.AuthObj.project.list) {
            // }
        }
    },
    //初始化滚动条
    initScroll: function () {
        $("#projectContainer").find(".projectFileNavContent").mCustomScrollbar({
            set_height: "100%",
            set_width: "100%",
            theme: 'minimal-dark',
            axis: 'y',
            keyboard: {
                enable: true
            },
            scrollInertia: 0
        });
        $("#projectContainer").find(".projectFileNavContent").css('height', '100%');
        $("#projectContainer .mCSB_container").css('height', '100%');
        $("#projectContainer").find(".projectModelNavContent").mCustomScrollbar({
            set_height: "100%",
            set_width: "100%",
            theme: 'minimal-dark',
            axis: 'yx',
            keyboard: {
                enable: true
            },
            scrollInertia: 0
        });
        // $("#projectDesignContainer").find(".designContainer").mCustomScrollbar({
        //            set_height: "100%",
        //            set_width:"100%",
        //            theme: 'minimal-dark',
        //            axis: 'y',
        //            keyboard: {
        //                enable: true
        //            },
        //            scrollInertia: 0
        //        });
    },
    //事件初始化
    initEvent: function () {
        var _this = this;
        //下载
        $("#projectContainer").on("click", ".btnFileDownLoad", function (e) {
            if ($(e.currentTarget).is('.disable')) {
                return
            }
            var $selFile = $("#projectContainer .fileContent :checkbox:checked").parent();
            if ($selFile.length < 1) {
                $.tip({
                    message: App.Local.data.source.StD || '请选择需要下载的文件',
                    timeout: 1500,
                    type: "alarm"
                })
                return;
            }
            if ($selFile.length == 1) {
                var isfolder = $($selFile[0]).attr("data-isfolder");
                if ($($selFile[0]).attr("data-sizeData") == "" && isfolder == "false") {
                    $.tip({
                        message: '文件为空，不能下载！',
                        timeout: 1500,
                        type: "alarm"
                    })
                    return;
                }
            }
            var FileIdArr = [];
            $selFile.each(function (i, item) {
                FileIdArr.push($(this).data("fileversionid"));
            });
            var fileVersionId = FileIdArr.join(",");
            //下载
            App.Comm.checkDownLoad(App.Project.Settings.projectId, App.Project.Settings.CurrentVersion.id, fileVersionId);
            // App.Comm.ajax(data).done(function(){
            // 	console.log("下载完成");
            // });
        });
        //新建文件
        $("#projectContainer").on("click", ".btnNewFolder", function (e) {
            if ($(e.currentTarget).is('.disable')) {
                return
            }
            _this.addNewFileModel();
        });
        //新建文件
        $("#projectContainer").on("click", ".returnBack", function (e) {
            if ($(e.currentTarget).is('.disable')) {
                return
            }
            _this.returnBack(e);
        });
        //删除
        $("#projectContainer").on("click", ".btnFileDel", function (e) {
            if ($(e.currentTarget).is('.disable')) {
                return
            }
            var $selFile = $("#projectContainer .fileContent :checkbox:checked").parent();
            if ($selFile.length < 1) {
                $.tip({
                    message: App.Local.data.source.stde || '请选择需要删除的文件...',
                    timeout: 1500,
                    type: "alarm"
                })
                return;
            }
            if ($selFile.length > 1) {
                $.tip({
                    message: App.Local.data.source.Oot || '目前只支持单文件删除...',
                    timeout: 1500,
                    type: "alarm"
                })
                return;
            }
            _this.isCanDelteFileHandle($selFile.data("fileversionid"), function (data) {
                if (!data) {
                    var $item = $selFile.closest(".item");
                    _this.delFile($item);
                } else {
                    let tipText = "该图纸文件包含已移交的历史版本，不允许删除";
                    if (App.Comm.getCookie("isEnglish") == "true") {
                        tipText = "The file has historical versions that has been transferred and is not allowed to be deleted";
                    }
                    $.tip({
                        message: tipText,
                        timeout: 4000,
                        type: "alarm"
                    })
                }
            })
        });
    },
    isCanDelteFileHandle(fileversionid, callback) {//当前文件是否能删除
        var data = {
            URLtype: "isCanDelteUrl",
            data: {
                projectId: App.Project.Settings.projectId,
                versionId: App.Project.Settings.CurrentVersion.id,
                fileVersionId: fileversionid
            }
        };
        App.Comm.ajax(data).done(function (data) {
            if (data.code == 0) {
                callback(data.data);
            } else {
                $.tip({
                    message: data.message,
                    timeout: 1500,
                    type: "alarm"
                })
            }
        })
    },
    isDisabled(name) {
        var Auth = App.AuthObj && App.AuthObj.project && App.AuthObj.project.prjfile;
        Auth = Auth || {};
        if (!Auth[name]) {
            return true
        }
        return false;
    },
    returnBack: function (e) {
        if ($(e.currentTarget).attr('isReturn') == '0') {
            return
        }
        var $currentLevel = $('#projectContainer .treeViewMarUl .selected');
        var file = $currentLevel.data('file');
        var parentId = file.parentId;
        var $parent = $('#projectContainer .treeViewMarUl span[data-id="' + parentId + '"]');
        if ($parent.length) {
            $parent.click();
        } else {
            $(e.currentTarget).attr('isReturn', '0').addClass('theEnd').html((App.Local.data['drawing-model'].AFs || '全部文件'));
            $('#projectContainer .treeViewMarUl .selected').removeClass('selected');
            App.Project.FileCollection.projectId = App.Project.Settings.projectId;
            App.Project.FileCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
            App.Project.FileCollection.reset();
            //文件列表
            App.Project.FileCollection.fetch({
                data: {
                    parentId: ''
                }
            });
            //	this.loadData();
        }
    },
    //绑定全局事件  document 事件
    initGlobalEvent: function () {
        $(document).on("click.project", function (event) {
            var $target = $(event.target);
            //面包屑 项目
            if ($target.closest(".breadItem.project").length <= 0) {
                $(".breadItem .projectList").find(".txtSearch").val("").end().hide();
            }
            //面包屑 项目版本
            if ($target.closest(".breadItem.projectVersion").length <= 0) {
                $(".breadItem .projectVersionList").find(".txtSearch").val("").end().hide();
            }
            //面包屑 切换 文件 模型 浏览器
            if ($target.closest(".breadItem.fileModelNav").length <= 0) {
                $(".breadItem .fileModelList").hide();
            }
        });
    },
    //根据类型渲染数据
    renderModelContentByType: function () {
        var type = App.Project.Settings.projectNav,
            $rightPropertyContent = $("#projectContainer .rightPropertyContent");
        $rightPropertyContent.children('div').hide();
        App.Project.isShowMarkers('other');
        //设计
        if (type == "design") {
            $rightPropertyContent.find(".singlePropetyBox").remove();
            var $designPropetyBox = $rightPropertyContent.find(".designPropetyBox");
            if ($designPropetyBox.length > 0) {
                $designPropetyBox.show();
            } else {
                $rightPropertyContent.append(new App.Project.ProjectDesignPropety().render().$el);
                $("#projectContainer .designPropetyBox .projectNav .item:first").click();
            }
        } else if (type == "plan") {
            //计划
            var $ProjectPlanPropertyContainer = $rightPropertyContent.find(".ProjectPlanPropertyContainer");
            if ($ProjectPlanPropertyContainer.length > 0) {
                $ProjectPlanPropertyContainer.show();
                /*add by wuweiwei at 2016-12-21 16:00*/
                var item = $ProjectPlanPropertyContainer.find('.projectNav .selected');
                if (item && item.length) {
                    var t = item.first().data('type');
                    App.Project.Settings.property = t;
                }
                /*end wuweiwei*/
            } else {
                $rightPropertyContent.append(new App.Project.ProjectPlanProperty().render().$el);
                $("#projectContainer .ProjectPlanPropertyContainer .projectNav .item:first").click();
            }
        } else if (type == "cost") {
            //成本
            var $ProjectCostPropetyContainer = $rightPropertyContent.find(".ProjectCostPropetyContainer");
            if ($ProjectCostPropetyContainer.length > 0) {
                $ProjectCostPropetyContainer.show();
                /*add by wuweiwei at 2016-12-21 16:00*/
                var item = $ProjectCostPropetyContainer.find('.projectNav .selected');
                if (item && item.length) {
                    var t = item.first().data('type');
                    App.Project.Settings.property = t;
                }
                /*end wuweiwei*/
            } else {
                $rightPropertyContent.append(new App.Project.ProjectCostProperty().render().$el);
                $("#projectContainer .ProjectCostPropetyContainer .projectNav .item:first").click();
            }
        } else if (type == "quality") {

            //质量
            var $ProjectQualityNavContainer = $rightPropertyContent.find(".ProjectQualityNavContainer");
            if ($ProjectQualityNavContainer.length > 0) {
                $ProjectQualityNavContainer.show();
                var item = $ProjectQualityNavContainer.find('.projectNav .selected');
                if (item && item.length) {
                    var t = item.first().data('type');
                    App.Project.Settings.property = t;
                    /*add by wuweiwei at 2016-12-21 16:00*/
                    if (t == 'processacceptance') {
                        App.Project.isShowMarkers('process', $('.QualityProcessAcceptance .btnCk').hasClass('selected'));
                    } else if (t == 'openingacceptance') {
                        App.Project.isShowMarkers('open', $('.QualityOpeningAcceptance .btnCk').hasClass('selected'));
                    } else if (t == 'concerns') {
                        App.Project.isShowMarkers('dis', $('.QualityConcerns .btnCk').hasClass('selected'));
                    }
                }
            } else {
                App.Project.qualityTab = new App.Project.ProjectQualityProperty().render();
                $rightPropertyContent.append(App.Project.qualityTab.$el);
                $("#projectContainer .ProjectQualityNavContainer .projectNav .item:first").click();
            }
        }
        var $slideBar = $("#projectContainer .rightProperty .slideBar");
        if ($slideBar.find(".icon-caret-left").length > 0) {
            $slideBar.click();
        }
    },
    //设计导航
    fetchFileNav: function (isExpand = true) {
        //debugger;
        //请求数据
        var data = {
            URLtype: !App.Project.Settings.isBimControl ? "fetchDesignFileNavKey" : "fetchDesignFileNav",
            data: {
                projectId: App.Project.Settings.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id,
                projectType: App.Project.Settings.treeType
            }
        };
        App.Comm.ajax(data).done(function (data) {
            if (_.isString(data)) {
                // to json
                if (JSON && JSON.parse) {
                    data = JSON.parse(data);
                } else {
                    data = $.parseJSON(data);
                }
            }
            data.click = function (event) {
                var file = $(event.target).data("file");
                if (file.folder) {
                    $('#projectContainer .returnBack').attr('isReturn', '1').removeClass('theEnd').html((App.Local.data.source['s-b'] || '返回上级'));
                }
                //
                $("#projectContainer .header .ckAll").prop("checked", false);
                //App.Project.FileCollection.parentId=file.id;
                //清空数据
                App.Project.FileCollection.reset();
                //清除搜索
                $("#projectContainer .fileContainer").find(".clearSearch").hide().end().find(".btnNewFolder").show().end().find(".btnFileUpload").show().end().find(".btnFileState").show().end().find(".searchCount").hide().end().find("#txtFileSearch").val("");
                App.Project.Settings.searchText = "";
                // debugger;
                App.Project.Settings.fileId = file.fileVersionId;
                App.Project.FileCollection.fetch({
                    data: {
                        parentId: file.fileVersionId
                    }
                });
                if (!App.Project.Settings.isBimControl) {//如果不是bim项目
                    $("#projectContainer .fileContainer").find(".btnFileState").hide();
                    App.Project.getFileAuth(file.fileVersionId);//获取当前选中的文件夹的权限
                }
            }
            data.iconType = 1;
            if ((data.data || []).length > 0) {
                var navHtml = new App.Comm.TreeViewMar(data);
                $("#projectContainer .projectNavFileContainer").html(navHtml);
                App.Project.initScroll();
                if (App.cb && isExpand) App.cb();
            } else {
                $("#projectContainer .projectNavFileContainer").html('<div class="loading" style="text-align: center;line-height: 30px;">无文件</div>');
            }
            $("#pageLoading").hide();
        });
    },
    getFileAuth: function (fileId) {//获取当前选中的文件夹的权限
        var data = {
            URLtype: "getFileAuthUrl",
            data: {
                projectId: App.Project.Settings.projectId,
                versionId: App.Project.Settings.CurrentVersion.id,
                fileVesionId: fileId,
                userId: App.Global.User.loginName,
            }
        };
        App.Comm.ajax(data, function (data) {
            if (data.code == 0) {
                App.Project.Settings.authBool = data.data;
                if (!data.data) {//如果没有权限
                    $("#projectContainer .fileContainer").find(".btnNewFolder").addClass('disable');
                    $("#projectContainer .fileContainer").find(".btnFileUpload").addClass('disable');
                    $("#projectContainer .fileContainer").find(".btnFileDel").addClass('disable');
                    // App.Comm.upload.destroy();
                } else {
                    $("#projectContainer .fileContainer").find(".btnNewFolder").removeClass('disable');
                    $("#projectContainer .fileContainer").find(".btnFileUpload").removeClass('disable');
                    $("#projectContainer .fileContainer").find(".btnFileDel").removeClass('disable');
                    // App.Comm.upload.destroy();
                    !App.Project.upload && (App.Project.upload = App.modules.docUpload.init($(document.body)));
                }
            } else {
                alert(data.message);
            }
        });
    },
    //设计模型
    fetchModelNav: function () {
        var data = {
            URLtype: "fetchDesignModelNav"
        };
        App.Comm.ajax(data).done(function (data) {
            if (_.isString(data)) {
                // to json
                if (JSON && JSON.parse) {
                    data = JSON.parse(data);
                } else {
                    data = $.parseJSON(data);
                }
            }
            var navHtml = new App.Comm.TreeViewMar(data);
            $("#projectContainer .projectNavModelContainer").html(navHtml);
        });
    },
    //右侧属性是否渲染
    renderProperty: function () {
        var model;
        if (App.Project.Settings.ModelObj) {
            model = App.Project.Settings.ModelObj;
        } else {
            return;
        }
        App.Project.DesignAttr.PropertiesCollection.projectId = App.Project.Settings.projectId;
        App.Project.DesignAttr.PropertiesCollection.projectVersionId = App.Project.Settings.CurrentVersion.id;
        var userSceneId = model.intersect.userId.split('.')[0];
        App.Project.DesignAttr.PropertiesCollection.fetch({
            data: {
                elementId: model.intersect.userId,
                sceneId: userSceneId || ""
            }
        });
    },
    //属性页 设计成本计划 type 加载的数据
    propertiesOthers: function (type) {
        var that = this;
        //计划
        if (type.indexOf("plan") != -1) {
            App.Project.fetchPropertData("fetchDesignPropertiesPlan", function (data) {
                if (data.code == 0) {
                    data = data.data;
                    if (!data) {
                        return;
                    }
                    that.$el.find(".attrPlanBox").find(".name").text(data.businessItem).end().find(".strat").text(data.planStartTime && new Date(data.planStartTime).format("yyyy-MM-dd") || "").end().find(".end").text(data.planEndTime && new Date(data.planEndTime).format("yyyy-MM-dd") || "").end().show();
                    //.find(".rEnd").text(data.planFinishDate && new Date(data.planFinishDate).format("yyyy-MM-dd") || "").end().show();
                }
            });
        }
        //成本
        if (type.indexOf("cost") != -1) {
            App.Project.fetchPropertData("fetchDesignPropertiesCost", function (data) {
                if (data.code == 0) {
                    if (data.data.length > 0) {
                        var html = App.Project.properCostTree(data.data);
                        //that.$el.find(".attrCostBox").show().find(".modle").append(html);
                        App.Project.costDataHtml = html;
                    }
                }
            });
        }
        //质监标准
        if (type.indexOf("quality") != -1) {
            var liTpl = '<li class="modleItem"><div class="modleNameText overflowEllipsis modleName2">varName</div></li>';
            App.Project.fetchPropertData("fetchDesignPropertiesQuality", function (data) {
                if (data.code == 0) {
                    if (data.data.length > 0) {
                        var lis = '';
                        $.each(data.data, function (i, item) {
                            var _name = item.name,
                                url = item.url || '###';
                            if (/标准$/.test(_name)) {
                                _name = '<a href="' + url + '" target="_blank">' + _name + '</a>&nbsp;&nbsp;';
                            } else {
                                _name = '<a href="' + url + '" target="_blank">' + _name + '质量标准' + '</a>&nbsp;&nbsp;';
                            }
                            lis += liTpl.replace("varName", _name);
                        });
                        that.$el.find(".attrQualityBox").show().find(".modleList").html(lis);
                    }
                }
            });
        }
        //模型属性 dwg 图纸
        if (type.indexOf('dwg') != -1) {
            App.Project.attrDwg.apply(this);
        }
        //获取所有类别
        $.ajax({
            url: "platform/set/category"
        }).done(function (res) {
            if (res.code == 0) {
                var str = '',
                    datas = res.data.items || [];
                for (var i = 0, prop; i < datas.length; i++) {
                    prop = datas[i]['busName'];
                    if (prop == '设计管理') {
                        //$.ajax({
                        //	url: "platform/setting/extensions/"+App.Project.Settings.projectId+"/"+App.Project.Settings.CurrentVersion.id+"/property?classKey="+datas[i]['id']+"&elementId="+App.Project.Settings.ModelObj.intersect.userId
                        //}).done(function(res){
                        //		if(res.code==0){
                        //
                        //		}
                        //});
                        var string = '<div class="modle"><div class="modleTitleBar"><i data-classkey="' + datas[i]['id'] + '" class="modleShowHide getdata "></i><h1 class="modleName">' + prop + '</h1></div><ul class="modleList"></ul></div>';
                        that.$el.find(".fordesign").html(string);
                    } else {
                        str += '<div class="modle"><div class="modleTitleBar"><i data-classkey="' + datas[i]['id'] + '" class="modleShowHide getdata "></i><h1 class="modleName">' + prop + '</h1></div><ul class="modleList"></ul></div>';
                    }
                }
                that.$el.find(".attrClassBox").html(str);
                setTimeout(function () {
                    that.$el.find(".attrClassBox").find('[data-classkey=4]').click();
                }, 1000)
            }
        });
        //App.Project.fetchClassPropertData(function(res) {
        //	if (res.code == 0){
        //		var str = '', liTpl = '<li class="modleItem"><span class="modleName overflowEllipsis"><div class="modleNameText overflowEllipsis">{property}</div></span> <span class="modleVal end">{value}</span></li>';
        //		var datas = res.data || [];
        //		for(var i = 0,prop; i < datas.length; i++){
        //			prop = datas[i]['properties'];
        //			if('设计管理成本管理计划管理质量管理'.indexOf(datas[i]['className'])>-1){
        //				continue
        //			}else if(prop==null){
        //				str += '<div class="modle"><i class="modleShowHide"></i><h1 class="modleName">' + datas[i]['className'] + '</h1><ul class="modleList">';
        //
        //			}else{
        //				for(var j = 0; j < (prop.length || 0); j++){
        //					str += '<div class="modle"><i class="modleShowHide"></i><h1 class="modleName">' + datas[i]['className'] + '</h1><ul class="modleList">' + liTpl.replace("{property}", datas[i]['properties'][j]['property']).replace('{value}', datas[i]['properties'][j]['value']);
        //				}
        //			}
        //
        //			str += '</ul></div>';
        //		}
        //
        //			that.$el.find(".attrClassBox").html(str);
        //
        //	}
        //});
    },
    //模型属性 dwg 图纸
    attrDwg: function () {
        // debugger;
        var modelId = App.Project.Settings.ModelObj.intersect.userId.split('.')[0],
            that = this,
            attrDwgBoxDom, modleShowHide, modleListDom,
            data = {
                URLtype: 'attrDwg',
                data: {
                    projectId: App.Project.Settings.projectId,
                    versionId: App.Project.Settings.CurrentVersion.id,
                    modelId: modelId
                }
            },
            liTpl = '<li class="modleItem"><a data-id="<%=id%>" href="/static/dist/app/project/single/filePreview.html?id={id}&projectId=' + App.Project.Settings.projectId + '&projectVersionId=' + App.Project.Settings.CurrentVersion.id + '" target="_blank" ><div class="modleNameText overflowEllipsis modleName2">varName</div></a></li>';
        App.Comm.ajax(data, (data) => {
            if (data.code == 0) {
                if (data.data.length > 0) {
                    var lis = '';
                    $.each(data.data, function (i, item) {
                        lis += liTpl.replace("varName", item.name).replace('{id}', item.id);
                    });
                    //start 张延凯修改 初始化的时候视图的默认关闭状态
                    attrDwgBoxDom = that.$el.find(".attrDwgBox");
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
    },
    //属性 数据获取
    fetchPropertData: function (fetchType, callback) {
        var Intersect = App.Project.Settings.ModelObj.intersect;
        var userSceneId = Intersect.userId.split('.')[0];
        var data = {
            URLtype: fetchType,
            data: {
                projectId: App.Project.Settings.projectId,
                projectVersionId: App.Project.Settings.CurrentVersion.id,
                elementId: Intersect.userId,
                sceneId: userSceneId
            }
        };
        App.Comm.ajax(data, callback);
    },
    //类别属性 数据获取
    fetchClassPropertData: function (callback) {
        var Intersect = App.Project.Settings.ModelObj.intersect;
        var data = {
            projectId: App.Project.Settings.projectId
            //elementId: Intersect.userId,
            //classKey: id
        };
        //App.Comm.ajax(data, callback);
        $.ajax({
            url: "platform/setting/extensions/" + data.projectId + "/property/all"
        }).done(function (data) {
            callback(data)
        });
    },
    //成本树
    properCostTree: function (data) {
        var sb = new StringBuilder(),
            item,
            treeCount = data.length;
        sb.Append('<ul class="modleList">');
        for (var i = 0; i < treeCount; i++) {
            sb.Append('<li class="modleItem" >');
            item = data[i];
            sb.Append(App.Project.properCostTreeItem(item, 0));
            sb.Append('</li>');
        }
        sb.Append('</ul>');
        return sb.toString();
    },
    //tree 节点
    properCostTreeItem: function (item, i) {
        var sb = new StringBuilder(),
            w = i * 12;
        //内容
        sb.Append('<span class="modleName overflowEllipsis"><div class="modleNameText overflowEllipsis">');
        if (item.children && item.children.length > 0) {
            sb.Append('<i class="nodeSwitch on" style="margin-left:' + w + 'px;"></i>');
        } else {
            sb.Append('<i class="noneSwitch" style="margin-left:' + w + 'px;"></i> ');
        }
        sb.Append(item.code);
        sb.Append('</div></span>');
        sb.Append(' <span class="modleVal overflowEllipsis" title="' + item.name + '"> ' + item.name + '</span> ');//Number(item.totalQuantity).toFixed(4)
        if (item.totalQuantity) {
            sb.Append('<span class="modelCostVal  overflowEllipsis" title="' + item.totalQuantity + '&nbsp;' + item.unit + '">' + item.totalQuantity + '&nbsp;' + item.unit + '</span>');
        }
        //递归
        if (item.children && item.children.length > 0) {
            sb.Append('<ul class="modleList">');
            var treeSub = item.children,
                treeSubCount = treeSub.length,
                subItem;
            for (var j = 0; j < treeSubCount; j++) {
                sb.Append('<li class="modleItem" > ');
                subItem = treeSub[j];
                sb.Append(App.Project.properCostTreeItem(subItem, i + 1));
                sb.Append('</li>');
            }
            sb.Append('</ul>');
        }
        return sb.toString();
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
    //在模型中显示(开业验收、过程验收、隐患) ---------平台中调用
    showInModel: function ($target, type, paramObj) {
        App.Project.Settings.Viewer.filterByUserIds('');
        App.Project.Settings.isModelChange = true;//add zhangyankai控制什么时候初始化左侧和模型初始化
        var typeMap = {
            'concerns': 'dis',
            'processacceptance': 'process',
            'openingacceptance': 'open'
        };
        CommProject.init({
            viewer: App.Project.Settings.Viewer,
            data: this.currentLoadData[typeMap[App.Project.Settings.property]],
            sourceId: App.Project.Settings.DataModel.sourceId,
            etag: App.Project.Settings.DataModel.etag,
            projectId: App.Project.Settings.projectId,
            projectVersionId: App.Project.Settings.CurrentVersion.id,
            markerClick: App.Project.markerClick
        }).showInModel($target, type, paramObj);
        return;
    },
    showMarks: function (marks) {
        var v = App.Project.Settings.Viewer;
        if (!_.isArray(marks)) {
            marks = [marks];
        }
        v.viewer.setMarkerClickCallback(App.Project.markerClick);
        v.loadMarkers(marks);
    },
    //通过userid 和 boundingbox 定位模型
    zoomModel: function (ids, box, margin, ratio) {
        //定位
        //	App.Project.Settings.Viewer.setTopView(box, false, margin, ratio);
        App.Project.Settings.Viewer.zoomToBBoxWithOuterBox(box, this.getBoxs(App.Project.Settings.property), margin, ratio);
        //半透明
        //App.Project.Settings.Viewer.translucent(true);
        //高亮
        App.Project.Settings.Viewer.highlight({
            type: 'userId',
            ids: ids
        });
    },
    offset: function (location) {
        var offset,
            boxPt,
            p = location.position,
            max = location.boundingBox.max,
            min = location.boundingBox.min;
        boxPt = {
            x: (max.x + min.x) / 2,
            y: (max.y + min.y) / 2,
            z: (max.x + min.z) / 2
        }
        offset = {
            x: p.x - boxPt.x,
            y: p.y - boxPt.y,
            z: p.z - boxPt.z
        }
        return offset;
    },
    newBBox: function (location) {
        var box,
            offset = this.offset(location),
            old = location.boundingBox;
        box = {
            max: {
                x: old.max.x + offset.x,
                y: old.max.y + offset.y,
                z: old.max.z + offset.z
            },
            min: {
                x: old.min.x + offset.x,
                y: old.min.y + offset.y,
                z: old.min.z + offset.z
            }
        }
        return box;
    },
    zoomModelOther: function (ids, box, margin, ratio, location) {
        //定位
        App.Project.Settings.Viewer.setTopView(box, false, margin, ratio);
        //半透明
        //App.Project.Settings.Viewer.translucent(true);
        //高亮
        App.Project.Settings.Viewer.highlight({
            type: 'userId',
            ids: ids
        });
    },
    zoomToBox: function (ids, box) {
        App.Project.Settings.Viewer.clearIsolate();
        App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
        App.Project.Settings.Viewer.zoomToBox(box);
        App.Project.Settings.Viewer.setSelectedIds(ids);
        //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, App.Project.Settings.Viewer.viewer);
        App.Project.Settings.Viewer.setTranslucentUnselected();
        App.Project.Settings.Viewer.clearSelection();
        App.Project.Settings.Viewer.highlight({
            type: 'userId',
            ids: ids
        });

    },
    //取消zoom
    cancelZoomModel: function () {
        App.Project.Settings.Viewer.translucent(false);
        App.Project.Settings.Viewer.ignoreTranparent({
            type: "plan",
            //ids: [code[0]]
            ids: undefined
        });
        App.Project.Settings.Viewer.filter({
            type: "plan",
            ids: undefined
        });
        App.Project.Settings.Viewer.highlight({
            type: 'userId',
            ids: []
        });
    },
    //定位到模型
    zommBox: function ($target) {
        var Ids = [],
            boxArr = [];
        $target.parent().find(".selected").each(function () {
            Ids.push($(this).data("userId"));
            boxArr = boxArr.concat($(this).data("box"));
        });
        App.Project.Settings.Viewer.clearIsolate();
        App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();

        App.Project.Settings.Viewer.zoomToBox(boxArr);
        App.Project.Settings.Viewer.setSelectedIds(Ids);
        //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, App.Project.Settings.Viewer.viewer);
        App.Project.Settings.Viewer.setTranslucentUnselected();
        App.Project.Settings.Viewer.clearSelection();
        App.Project.Settings.Viewer.highlight({
            type: 'userId',
            ids: Ids
        });

    },
    //计划成本 校验 在模型中 显示
    planCostShowInModel: function (event) {
        var $target = $(event.target),
            $parent = $target.parent();
        if ($target.data("box")) {
            if ($parent.hasClass("selected")) {
                $target.closest("table").find(".selected").removeClass("selected");
                App.Project.Settings.Viewer.translucent(false)
                App.Project.Settings.Viewer.highlight({
                    type: 'userId',
                    ids: []
                });
                return;
            } else {
                $target.parents('.rightPropertyContent').find(".planContainer").find(".selected").removeClass('selected');
                $target.parents('.rightPropertyContent').find(".qualityContainer").find(".selected").removeClass('selected');
                // $target.closest("table").find(".selected").removeClass("selected");
                $target.parent().addClass("selected");
            }
            App.Project.planCostzommBox($target);
        } else {
            if ($parent.hasClass("selected")) {
                $target.closest("table").find(".selected").removeClass("selected");
                App.Project.planCostzommBox($target);
                return;
            } else {
                $target.parents('.rightPropertyContent').find(".planContainer").find(".selected").removeClass('selected');
                $target.parents('.rightPropertyContent').find(".qualityContainer").find(".selected").removeClass('selected');
                // $target.closest("table").find(".selected").removeClass("selected");
                $target.parent().addClass("selected");
            }
            var elementId = $target.data("id"),
                sceneId = elementId.split(".")[0],
                that = this;
            var pars = {
                URLtype: "getBoundingBox",
                data: {
                    projectId: App.Project.Settings.CurrentVersion.projectId,
                    projectVersionId: App.Project.Settings.CurrentVersion.id,
                    sceneId: sceneId,
                    elementId: elementId
                }
            }
            App.Comm.ajax(pars, function (data) {
                if (data.code == 0 && data.data) {
                    var box = [],
                        min = data.data.min,
                        minArr = [min.x, min.y, min.z],
                        max = data.data.max,
                        maxArr = [max.x, max.y, max.z];
                    box.push(minArr);
                    box.push(maxArr);
                    //box id
                    $target.data("box", box);
                    App.Project.planCostzommBox($target);
                }
            });
        }
    },
    planCostzommBox: function ($target) {
        var Ids = [],
            boxArr = [],
            $code;
        $target.closest("table").find(".selected").each(function () {
            $code = $(this).find(".code");
            Ids.push($code.data("id"));
            boxArr = boxArr.concat($code.data("box"));
        });
        if (Ids.length > 0) {
            App.Project.Settings.Viewer.clearIsolate();
            App.Project.Settings.Viewer.clearFilterTranslucentOthersUserIDList();
            App.Project.Settings.Viewer.zoomToBox(boxArr);
            App.Project.Settings.Viewer.setSelectedIds(Ids);
            //CLOUD.FilterUtil.isolateSelections(CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS, App.Project.Settings.Viewer.viewer);
            App.Project.Settings.Viewer.setTranslucentUnselected();
            App.Project.Settings.Viewer.clearSelection();
            App.Project.Settings.Viewer.highlight({
                type: 'userId',
                ids: Ids
            });
        }
    },
    userProps: function (param, callback) {
        if ($('#isolation').is(':hidden')) {
            return;
        }
        var _this = this;
        var userSceneId = App.Project.Settings.ModelObj.intersect.userId.split('.')[0];
        var dataObj = {
            URLtype: "fetchFileByModel",
            timeout: 6000,
            data: {
                projectId: App.Project.Settings.projectId,
                versionId: App.Project.Settings.versionId,
                modelId: userSceneId
            }
        }
        App.Comm.ajax(dataObj, function (data) {
            var _ = param[0].items;
            _.push({
                name: "文件名",
                value: data.data.name
            })
            _.push({
                name: (App.Local.data['drawing-model'].Discipline || "专业"),
                value: data.data.specialty
            })
            _.push({
                name: (App.Local.data['drawing-model'].Floor || "楼层"),
                value: data.data.floor
            })
            if (callback) {
                callback(param);
            } else {
                _this.$el.html(_this.template(param));
                //if ($('.design').hasClass('selected')) {
                App.Project.propertiesOthers.call(_this, "plan|cost|quality|dwg");
                //}
            }
        })
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
    //获取文件名称 搜索
    getName(name) {
        return this.getNametHandle(App.Project.Settings.searchText, name);
    },
    escape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    getNametHandle: function (regexpStr, str) {
        // debugger;
        if (regexpStr === '') {
            return str;
        }
        regexpStr = this.escape(regexpStr)
        var newRegExp = new RegExp(regexpStr, "gi");
        var name = str.replace(newRegExp, function (i) {
            return '<span class="searchText">' + i + '</span>'
        })
        return name;
    }
}