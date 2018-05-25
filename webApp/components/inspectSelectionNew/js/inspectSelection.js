/*
 *@require /components/inspectSelectionNew/libs/jquery-1.12.0.min.js
 *@require /components/inspectSelectionNew/libs/underscore.1.8.2.js
 *@require /components/inspectSelectionNew/libs/backbone.1.1.2.js
 */
(function (win) {
    var showAllComponents = function () {
        var $btn = $('[data-id="showAll"]');
        $btn.is(':visible') && $btn.click();
    }
    var strVar1 = "";
    strVar1 += "<% $.each(data.items,function(i,item){%> ";
    strVar1 += "    <tr class=\"<%= i%2==0 && 'odd' %>\" data-color=\"<%= item.colorStatus%>\"  data-cat=\"<%=item.catetoryName%>\"  data-id=\"<%=item.id%>\" data-location='<%= item.location?JSON.stringify(item.location):\"\"%>'>";
    strVar1 += "        <td class=\"manifestIcon\"><i class=\"myIcon-inventory\"><\/i><\/td>";
    strVar1 += "        <td class=\"category\"><%=item.catetoryName%><\/td>";
    strVar1 += "        <td class=\"positon\"><%=item.locationName%><\/td>";
    /*	strVar1 += "        <td class=\"ckResult\">";
	strVar1 += "         <i data-id=\"<%= item.acceptanceId %>\"  data-total=\"<%=item.problemCount%>\" class=\"resultStatusIcon  <%= item.colorStatus == 0 ?'myIcon-circle-green':'myIcon-circle-red'%> \"><\/i>";
	strVar1 += "             <%=item.problemCount%>/<%=item.checkCount%><\/td>";*/
    strVar1 += "    <\/tr>";
    strVar1 += "<% }) %> ";
    strVar1 += "<% if(data.items.length<=0){%>";
    strVar1 += "    <tr>";
    strVar1 += "        <td colspan=\"9\" class=\"noDataTd\">暂无数据<\/td>";
    strVar1 += "    <\/tr>";
    strVar1 += "<%}%>";
    var strVar2 = "";
    strVar2 += "<div class=\"hedaerSearch\">";
    strVar2 += "    <span class=\"searchToggle\">选择筛选条件<\/span>";
    strVar2 += "    <span class=\"clearSearch\">清除条件<\/span>";
    strVar2 += "    <span class=\"groupRadio\">";
    strVar2 += "        <label class=\"btnCk\"><i class=\"iconPic\"><\/i>显示搜索结果对应位置<\/label>";
    strVar2 += "    <\/span>";
    strVar2 += "<\/div>";
    strVar2 += "<div class=\"searchDetail openingacceptance\">";
    strVar2 += "    <div class=\"searchOptons\">";
    strVar2 += "        <div class=\"optonLine zIndex13\">";
    strVar2 += "            <div class=\"optonLine\">";
    strVar2 += "                <div class=\"myDropDown categoryOption optionComm\">";
    strVar2 += "                    <% if(ruleType) {%>";
    strVar2 += "                        <span class=\"myDropText\">";
    strVar2 += "                        <span>类别：<\/span> <span class=\"text\"><%=userData[ruleType]%><\/span> <i class=\"myDropArrorw\"><\/i> <\/span>";
    strVar2 += "                        <ul class=\"myDropList\">";
    strVar2 += "                            <li class=\"myItem\" data-val='<%=ruleType%>'><%=userData[ruleType]%><\/li>";
    strVar2 += "                        <\/ul>";
    strVar2 += "                    <% }else{%>";
    strVar2 += "                         <span class=\"myDropText\">";
    strVar2 += "                        <span>类别：<\/span> <span class=\"text\">全部<\/span> <i class=\"myDropArrorw\"><\/i> <\/span>";
    strVar2 += "                        <ul class=\"myDropList\">";
    strVar2 += "                            <li class=\"myItem\" data-val=''>全部<\/li>";
    strVar2 += "                            <% _.each(userData,function(item,index){ if(index!=0){%>";
    strVar2 += "                            <li class=\"myItem\" data-val='<%=item.value%>'><%=item.text%><\/li>";
    strVar2 += "                            <% } }) %>";
    strVar2 += "                        <\/ul>";
    strVar2 += "                    <% } %>";
    strVar2 += "                    <\/div>";
    strVar2 += "                <\/div>";
    strVar2 += "                <div class=\"optonLine\">";
    strVar2 += "                    <div class=\"myDropDown riskOption optionComm\">";
    strVar2 += "                        <span class=\"myDropText\">";
    strVar2 += "                            <span>状态：<\/span> <span class=\"text\">全部<\/span> <i class=\"myDropArrorw\"><\/i> <\/span>";
    strVar2 += "                            <ul class=\"myDropList\">";
    strVar2 += "                                <li class=\"myItem\" data-val=''>全部<\/li>";
    strVar2 += "                                <li class=\"myItem\" data-val=''>合格<\/li>";
    strVar2 += "                                <li class=\"myItem\" data-val=''>不合格<\/li>";
    strVar2 += "                            <\/ul>";
    strVar2 += "                        <\/div>";
    strVar2 += "                    <\/div>";
    strVar2 += "                <\/div>";
    strVar2 += "        <div class=\"optonLine\">";
    strVar2 += "            <div class=\"myDropDown floorOption optionComm\">";
    strVar2 += "                <span class=\"myDropText\">";
    strVar2 += "             <span>楼层：<\/span> <span class=\"text\">全部<\/span> <i class=\"myDropArrorw\"><\/i> <\/span>";
    strVar2 += "                <ul class=\"myDropList\">";
    strVar2 += "                    <li class=\"myItem\" data-val=''>全部<\/li>";
    strVar2 += "                    <% _.each(floorsData,function(item,index){%>";
    strVar2 += "                    <li class=\"myItem\" data-val='<%=item.code%>'><%=item.code%><\/li>";
    strVar2 += "                    <% }) %>";
    strVar2 += "                <\/ul>";
    strVar2 += "            <\/div>";
    strVar2 += "        <\/div>";
    strVar2 += "        <div class=\"optonLine\">";
    strVar2 += "        <div class=\"searchName\">";
    strVar2 += "            <span>位置：<\/span>";
    strVar2 += "            <input type=\"text\" class=\"txtSearchName txtLocationName filterInputExtra\" placeholder=\"请输入关键字\"/>";
    strVar2 += "        <\/div>";
    strVar2 += "        <\/div>";
    strVar2 += "                <div class=\"optonLine btnOption\">";
    strVar2 += "                    <input type=\"button\" class=\"myBtn myBtn-primary btnFilter\" value=\"筛选\" />";
    strVar2 += "                <\/div>";
    strVar2 += "            <\/div>";
    strVar2 += "        <\/div>";
    strVar2 += "        <div class=\"tbContainer\">";
    strVar2 += "            <table class=\"tbOpeningacceptanceHeader tbComm\">";
    strVar2 += "                <thead>";
    strVar2 += "                    <tr>";
    strVar2 += "                        <th class=\"manifestIcon\"><\/th>";
    strVar2 += "                        <th class=\"category\">类别<\/th>";
    strVar2 += "                        <th class=\"positon\">位置<\/th>";
    /*	strVar2 += "                        <th class=\"ckResult\">检查结果<\/th>";*/
    strVar2 += "                    <\/tr>";
    strVar2 += "                <\/thead>";
    strVar2 += "            <\/table>";
    strVar2 += "            <div class=\"materialequipmentList openingacceptanceList\">";
    strVar2 += "                <div class=\"materialequipmentListScroll\">";
    strVar2 += "                    <table class=\"tbOpeningacceptanceBody tbComm\">";
    strVar2 += "                        <tbody>";
    strVar2 += "                        <tr class=\"noLoading\"><\/tr>";
    strVar2 += "                    <\/tbody>";
    strVar2 += "                <\/table>";
    strVar2 += "            <\/div>";
    strVar2 += "        <\/div>";
    strVar2 += "    <\/div>";
    strVar2 += "    <div class=\"paginationBottom\">";
    strVar2 += "        <div class=\"pageInfo\">";
    strVar2 += "            <span class=\"curr\">0<\/span>/<span class=\"pageCount\">0<\/span>页";
    strVar2 += "            <span class=\"prev\">上一页<\/span> <span class=\"next\">下一页<\/span>";
    strVar2 += "        <\/div>";
    strVar2 += "        <div class=\"sumCount\">共<span class=\"count\">0<\/span>条<\/div>";
    strVar2 += "        ";
    strVar2 += "    <\/div>";
    var strVar3 = "";
    strVar3 += "<% var count=obj.length,item; %>";
    strVar3 += "    <% for(var i=0;i<count;i++){ %>";
    strVar3 += "        <% item=obj[i];if(item.group=='设计'){continue}else if(item.group=='构件名称'){ %>";
    strVar3 += "           <div class=\"modle\">";
    strVar3 += "               <ul class=\"modleList\">";
    strVar3 += "                   <li class=\"modleItem\">";
    strVar3 += "                       <span class=\"modleName\"><div class=\"modleNameText overflowEllipsis\">构件名称<\/div><\/span> <span class=\"modleVal overflowEllipsis\"><%=item.items[0]['value']%><\/span>";
    strVar3 += "                   <\/li>";
    strVar3 += "               <\/ul>";
    strVar3 += "           <\/div>";
    strVar3 += "";
    strVar3 += "        <% }else{%>";
    strVar3 += "";
    strVar3 += "            <div class=\"modle\">";
    strVar3 += "                <div class=\"modleTitleBar\">";
    strVar3 += "                    <i class=\"modleShowHide down\"><\/i>";
    strVar3 += "                    <h1 class=\"modleName overflowEllipsis\"><%= item.group%><\/h1>";
    strVar3 += "                <\/div>";
    strVar3 += "                <ul class=\"modleList\">";
    strVar3 += "                    <% var subItems=item.items,subCount=subItems.length,subItem %>";
    strVar3 += "                        <% for(var j=0;j<subCount;j++){ %>";
    strVar3 += "                            <% subItem=subItems[j];  %>";
    strVar3 += "                                <li class=\"modleItem\">";
    strVar3 += "                                    <span class=\"modleName\"><div title='<%=subItem.name%>' class=\"modleNameText overflowEllipsis\"><%=subItem.name%><\/div><\/span> <span class=\"modleVal overflowEllipsis\"><%=subItem.value%><%=subItem.unit%><\/span>";
    strVar3 += "                                <\/li>";
    strVar3 += "                        <% } %>";
    strVar3 += "                <\/ul>";
    strVar3 += "            <\/div>";
    strVar3 += "        <% } %>";
    strVar3 += "    <% } %>";
    strVar3 += "<div class=\"fordesign\"><\/div>";
    strVar3 += "<div class=\"attrPlanBox\">";
    strVar3 += "    <div class=\"modle\">";
    strVar3 += "        <i class=\"modleShowHide down\"><\/i>";
    strVar3 += "        <h1 class=\"modleName\" data-i18n='data.drawing-model.Plan'>计划<\/h1>";
    strVar3 += "        <ul class=\"modleList\">";
    strVar3 += "            <li class=\"modleItem\">";
    strVar3 += "                <span class=\"modleName overflowEllipsis\"><div class=\"modleNameText overflowEllipsis\">业务事项<\/div><\/span> <span class=\"modleVal name\"> <\/span>";
    strVar3 += "            <\/li>";
    strVar3 += "            <li class=\"modleItem\">";
    strVar3 += "                <span class=\"modleName overflowEllipsis\"><div class=\"modleNameText overflowEllipsis\">计划开始<\/div><\/span> <span class=\"modleVal strat\"><\/span>";
    strVar3 += "            <\/li>";
    strVar3 += "            <li class=\"modleItem\">";
    strVar3 += "                <span class=\"modleName overflowEllipsis\"><div class=\"modleNameText overflowEllipsis\">计划结束<\/div><\/span> <span class=\"modleVal end\"><\/span>";
    strVar3 += "            <\/li>";
    strVar3 += "            <li class=\"modleItem\">";
    strVar3 += "                <span class=\"modleName overflowEllipsis\"><div class=\"modleNameText overflowEllipsis\">实际结束<\/div><\/span> <span class=\"modleVal rEnd\"><\/span>";
    strVar3 += "            <\/li>";
    strVar3 += "        <\/ul>";
    strVar3 += "    <\/div>";
    strVar3 += "<\/div>";
    strVar3 += "<div class=\"attrCostBox\">";
    strVar3 += " <div class=\"modle\">";
    strVar3 += "     <i class=\"modleShowHide down\"><\/i>";
    strVar3 += "     <h1 class=\"modleName\" data-i18n=\"data.drawing-model.Cost\">成本<\/h1>";
    strVar3 += " <\/div>";
    strVar3 += " ";
    strVar3 += "<\/div>";
    strVar3 += "<div class=\"attrQualityBox\">";
    strVar3 += "    <div class=\"modle\">";
    strVar3 += "        <i class=\"modleShowHide\"><\/i>";
    strVar3 += "        <h1 class=\"modleName\">质检标准<\/h1>";
    strVar3 += "        <ul class=\"modleList\">";
    strVar3 += "        <\/ul>";
    strVar3 += "    <\/div>";
    strVar3 += "<\/div>";
    strVar3 += "";
    strVar3 += "<div class=\"attrDwgBox\">";
    strVar3 += "    <div class=\"modle\">";
    strVar3 += "        <i class=\"modleShowHide\"><\/i>";
    strVar3 += "        <h1 class=\"modleName\">图纸<\/h1>";
    strVar3 += "        <ul class=\"modleList\">";
    strVar3 += "        <\/ul>";
    strVar3 += "    <\/div>";
    strVar3 += "<\/div>";
    strVar3 += "<div class=\"attrClassBox\"><\/div>";
    var ourl = "";
    var scripts = document.getElementsByTagName('script');
    for (var i = 0, size = scripts.length; i < size; i++) {
        if (scripts[i].src.indexOf('/static/dist/components/inspectSelectionNew/js/inspectSelection.js') != -1) {
            var a = scripts[i].src.replace('/static/dist/components/inspectSelectionNew/js/inspectSelection.js', '');
            ourl = a;
        }
    }
    var mapData;
    mapData = {
        /*
		processCategory: ['', '工程桩', '基坑支护', '地下防水', '梁柱节点', '钢结构悬挑构件', '幕墙', '外保温',
			'采光顶', '步行街吊顶风口', '卫生间防水', '屋面防水', '屋面虹吸雨排', '消防泵房', '给水泵房',
			'湿式报警阀室', '空调机房', '冷冻机房', '变配电室', '发电机房', '慧云机房', '电梯机房', '电梯底坑',
			'吊顶', '地面', '中庭栏杆', '竖井'
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
        ]
    }
    win.App = win.App || {};
    win.App.API = {
        Settings: {
            hostname: ourl + "/",
            debug: false
        },
        URL: {
            fetchQualityOpeningAcceptance: "sixD/{projectId}/{projectVersionId}/acceptance",
            fetchQualityModelById: "sixD/{projectId}/{versionId}/quality/element",
            modelFilterRule: 'sixD/checkPointRule/{projectId}/{projectVersionId}/checkPointRule'
        }
    };
    var ModelFilter = {
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
            }
        },
        fileFilter: function (id) {
            this.recoverySilder();
            var _files = Project.Viewer.FloorFilesData;
            var _hideFileIds = _.filter(_files, function (i) {
                return i != id;
            });
            Project.Viewer.fileFilter({
                ids: _hideFileIds,
                total: [id]
            });
        },
        //过滤器还原（计划[模块化、模拟],质量[开业、过程、隐患],设计[碰撞],成本[清单、校验]）
        recoverySilder: function () {
            var show = '建筑,结构,景观,幕墙,采光顶,内装&标识,内装&导识',
                hide = '暖通,电气,智能化,给排水',
                _View = Project.Viewer;
            var $sp = $('.modelSidebar #specialty>.tree>li');
            _View.fileFilter({
                ids: [],
                total: _View.FloorFilesData
            });
            _View.filter({
                ids: [],
                type: "classCode"
            });
            _View.filter({
                type: "plan",
                ids: []
            });
            _View.translucent(false);
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
            });
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
            _View.fileFilter(specialty);
            _View.filter(category);
            _View.filter(classCode);
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
            });
            $treeText.each(function () {
                var _ = $(this).parent().find('input');
                if ($(this).text() == key) {
                    _.trigger('click');
                }
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
            var _View = Project.Viewer;
            if (!_.isArray(marks)) {
                marks = [marks];
            }
            _View.loadMarkers(marks);
        },
        //通过userid 和 boundingbox 定位模型
        zoomModel: function (ids, box, margin, ratio) {
            var _View = Project.Viewer;
            //定位
            _View.setTopView(box, false, margin, ratio);
            //高亮
            _View.highlight({
                type: 'userId',
                ids: ids
            });
        },
        filterHideCode: function (code, flag) {
            var _class = Project.Viewer.ClassCodeData;
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
        filterSingleFiles: function (type, name, include) {
            var _this = this;
            var data = Project.Viewer.SpecialtyFileSrcData;
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
        getFloors: function (name) {
            var array = [];
            _.each(Project.Viewer.FloorsData, function (item, index) {
                if (!name) {
                    array.push(item.code);
                } else if (name && item.code.indexOf(name) != -1) {
                    array.push(item.code);
                }
            })
            return array;
        },
        sigleRule: function (cat, floor, secendIds) {
            var _this = this,
                _v = Project.Viewer,
                _specialFilterFiles = [],
                _extArray = [],
                _hideCode = null;
            floor = floor || '';
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
                _this.linkSilder('floors', floor);
                _this.linkSilderSpecial('specialty', _specialFilterFiles, _extArray);
                Project.Viewer.filter({
                    ids: _this.filterHideCode(['10.20.20.03', '10.01']),
                    type: "classCode"
                })
                return
            }
            //新增的
            if (_this.filterRule.concat.indexOf(cat) != -1) {
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
                    floor = floor.split(',');
                    if (cat == "外保温") {
                        Project.Viewer.filter({
                            ids: _this.filterHideCode(['10.10.20.03.06.20.10'], true),
                            type: "classCode"
                        })
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
                    _specialFilterFiles.push('WDGC-Q-AR-' + floor + '.rvt');
                    _specialFilterFiles.push('WDGC-Q-AR-' + floor + '-RF.rvt');
                    _extArray = ['IN&GS', 'AR'];
                    _hideCode = ['10.10.30.03.21'];
                }
                if (cat == '地下防水') {
                    _specialFilterFiles = ['WDGC-Q-ST-垫层防水层.rvt'];
                    _specialFilterFiles.push('WDGC-Q-ST-' + _this.getFloors("B")[0] + '.rvt');
                    _.each(_this.getFloors("B"), function (item) {
                        _specialFilterFiles.push('WDGC-Q-AR-' + item + '.rvt');
                    })
                    _extArray = ['ST', 'AR'];
                    floor = _this.getFloors("B");
                    floor.push('其它');
                    Project.Viewer.filter({
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
                        .concat(['WDGC-Q-AR-' + floor + '.rvt', 'WDGC-Q-AR-' + floor + '-RF.rvt']);
                    _hideCode = ['10.10.30.03.21', '10.20.20.03'];
                    _extArray = ['ST', 'AR', 'PL', 'AC', 'EL', 'TE'];
                }
                _this.linkSilder('floors', floor);
                _this.linkSilderSpecial('specialty', _specialFilterFiles, _extArray);
                if (_hideCode) {
                    Project.Viewer.filter({
                        ids: _this.filterHideCode(_hideCode),
                        type: "classCode"
                    })
                }
            }
            Project.BIMFilter = Project.Viewer.viewer.getFilter();
        },
        filter: function ($target, componentId, location, cat, type, compoentShowCallback) {
            showAllComponents();
            var _commProject = CommProject.init({
                data: Project.currentPageListData,
                viewer: Project.Viewer,
                sourceId: Project.Settings.sourceId,
                etag: Project.Settings.etag,
                projectId: Project.Settings.projectId,
                projectVersionId: Project.Settings.projectVersionId,
                //markerClick:abcd
            });
            _commProject.showInModel($target, type, {
                uuid: componentId,
                location: location,
                selected: true
            }, compoentShowCallback, Project.currentRiskShowData);

            return;
            var _this = ModelFilter;
            var _View = Project.Viewer;
            var _temp = location,
                _loc = "",
                key = "",
                color = $target.data('color'),
                _secenId = componentId.split('.')[0], //用于过滤文件ID
                box = _commProject.formatBBox(_temp.boundingBox),
                marginRule = _commProject.marginRule[cat] || {},
                _files = _View.FloorFilesData,
                ids = [componentId];
            if (type == 3) { //隐患
                _loc = _commProject.formatMark(location, 'S021'.charAt(color), $target.data('id'), 1);
            } else {
                _loc = _commProject.formatMark(location, '543'.charAt(color), $target.data('id'));
            }
            _commProject.recoverySilder();
            _commProject.zoomModel(ids, box, marginRule.margin * 4, marginRule.ratio * 4);
            _commProject.showMarks(_loc);
            //过滤所属楼层 start
            var _floors = _View.FloorsData;
            _.find(_floors, function (item) {
                if (_.contains(item.fileEtags, _secenId)) {
                    key = item.floor;
                    return true;
                }
            });
            //过滤所属楼层 end
            //没有分类的时候 只过滤单文件 start
            if (!cat) {
                _commProject.linkSilder('floors', key);
                var _hideFileIds = _.filter(_files, function (i) {
                    return i != _secenId;
                });
                _View.fileFilter({
                    ids: _hideFileIds,
                    total: [_secenId]
                });
                return;
            }
            //没有分类的时候 只过滤单文件 end
            if (_this.filterRule.single.indexOf(cat) != -1) {
                _commProject.filter({
                    cat: cat,
                    floors: key
                }, function () {
                });
                //	_this.sigleRule(cat,key);
            } else {
                _commProject.linkSilder('floors', key);
            }
        }
    }
    //模态框模型选择器对象
    var InspectModelSelection = function (options) {
        /*
		options.withCheckpoint = false|true ; // default is true ; 功能:当为false时隐藏“检查点”页签
		*/
        var _this = this;
        /*强制new*/
        if (!(this instanceof InspectModelSelection)) {
            return new InspectModelSelection(options);
        }
        var defaults = {
            btnText: '确&nbsp;&nbsp;定',
            appKey: "18fbec1ae3da477fb47d842a53164b14",
            token: "abc3f4a2981217088aed5ecf8ede5b6397eed0795978449bda40a6987f9d6f7b0d061e9c8ad279d740ef797377b4995eb55766ccf753691161e73c592cf2416f9744adce39e1c37623a794a245027e79cd3573e7938aff5b4913fe3ed4dbea6d5be4693d85fe52f972e47e6da4617a508e5948f65135c63f"
        }
        this.withCheckpoint = options.withCheckpoint == undefined ? true : options.withCheckpoint;
        /*合并参数*/
        this.Settings = $.extend(defaults, options);
        /*设置cookie*/
        if (this.Settings.appKey && this.Settings.token && !this.initCookie(this.Settings.host || ourl, this.Settings.appKey, this.Settings.token)) {
            return;
        }
        if (this.Settings.appKey && this.Settings.token) {
            this.Settings.token_cookie = "token=" + this.Settings.token + "&appKey=" + this.Settings.appKey + "&t=" + new Date().getTime();
        } else {
            this.Settings.token_cookie = "";
        }
        if (this.Settings.etag) {
            Project.Settings = _this.Settings;
            _this.Project = Project;
            _this.ModelFilter = ModelFilter;
            ourl = options.host || ourl;
            _this.init();
        } else {
            $.ajax({
                url: ourl + "/platform/api/project/" + this.Settings.projectCode + "/meta?" + _this.Settings.token_cookie
            }).done(function (data) {
                if (data.code == 0) {
                    $.ajax({
                        url: ourl + "/doc/" + data.data.projectId + "/" + data.data.versionId + "/init?" + _this.Settings.token_cookie
                    }).done(function (data) {
                        if (data.code == 0) {
                            _this.Settings = $.extend({}, _this.Settings, data.data);
                            Project.Settings = _this.Settings;
                            _this.Project = Project;
                            _this.init();
                        } else if (data.code == 10004) {
                            //	document.location.href=ourl+"/login.html";
                        }
                    })
                }
            })
        }
    }
    InspectModelSelection.prototype = {
        /*隐藏检查点页签*/
        hideCheckpoint: function () {
            try {
                var $tab = this.$dialog.find(".projectPropetyHeader");
                var $tabLi = $tab.find("li");
                $tabLi[0].style.display = "none";
                $($tabLi[1]).addClass("selected");
                $("#presetPointPanel").hide();
                $("#propertyPanel").show();
            }
            catch (e) {
                ;
            }
        },
        /*显示检查点页签*/
        showCheckpoint: function () {
            var $tab = this.$dialog.find(".projectPropetyHeader");
            var $tabLi = $tab.find("li");
            $tabLi[0].style.display = "block";
            $($tabLi[0]).removeClass("selected");
            $($tabLi[1]).addClass("selected");
            $("#presetPointPanel").hide();
            $("#propertyPanel").show();
        },
        initCookie: function (ourl, appKey, token) {
            var that = this,
                isVerification = false,
                url = ourl + "/platform/token";
            $.ajax({
                url: url,
                data: {
                    appKey: appKey,
                    token: token
                },
                async: false
            }).done(function (data) {
                if (data.code == 0) {
                    that.setCookie("token_cookie", data.data);
                    isVerification = true;
                } else {
                    alert("验证失败");
                    isVerification = false;
                }
            }).fail(function (data) {
                if (data.status == 400) {
                    alert("token过期");
                }
            });
            return isVerification;
        },
        setCookie: function (name, value) {
            var Days = 30,
                host = this.Settings.host || ourl,
                exp = new Date(),
                doMain = host.substring(host.indexOf("."));
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + value + ";domain=" + doMain + ";expires=" + exp.toGMTString() + ";path=/";
        },
        //删除cookie
        delCookie: function (name) {
            var exp = new Date(),
                host = this.Settings.host || ourl,
                doMain = host.substring(host.indexOf("."));
            exp.setTime(exp.getTime() - 31 * 24 * 60 * 60 * 1000);
            var cval = App.Comm.getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=" + doMain + ";path=/";
        },
        init: function () {
            var self = this,
                //srciptUrl = ourl + '/static/dist/BIMperformance/libsH5.js',
                srciptUrl = ourl + '/static/dist/libs/libsH5.js',
                commjs = ourl + '/static/dist/commNew/commNew.js',
                libStyle = ourl + '/static/dist/libs/libsH5_20160313.css',
                myStyle = ourl + '/static/dist/components/inspectSelectionNew/css/inspectSelection.css',
                $css = '<link rel="stylesheet" href="' + libStyle + '" />',
                $css2 = '<link rel="stylesheet" href="' + myStyle + '" />';
            $css3 = '<link rel="stylesheet" href="' + myStyle + '" />';
            if (!InspectModelSelection.isLoad) {
                $('head').append($css, $css2);
                InspectModelSelection.isLoad = true;
            }
            if (self.Settings.type == "process") {
                win.App.API.URL.fetchQualityOpeningAcceptance = "sixD/{projectId}/{projectVersionId}/acceptance?type=1&token=123";
                //console.warn('emulation data')
                //win.App.API.URL.fetchQualityOpeningAcceptance = "dataJson/inspectSelection/list.json";
            }
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
            if (self.isIE()) {
                $.getScript(commjs, function () {
                    self.dialog();
                    self.controll();
                    /*隐藏检查点页签*/
                    if (!self.withCheckpoint) {
                        self.hideCheckpoint();
                    }
                })
                return;
            }
            $.getScript(srciptUrl, function () {
                bimView.API.baseUrl = ourl + '/';
                $.getScript(commjs, function () {
                    self.dialog();
                    self.controll();
                    /*/!*隐藏检查点页签*!/
					if(!self.withCheckpoint)
					{
						self.hideCheckpoint();
					}*/
                    self.showCheckpoint();
                })
            });
        },
        controll: function () {
            var self = this;
            if (self.isIE()) {
                self.$dialog.find('.dialogFooter').hide();
            } else {
                self.$dialog.find('.dialogHeader').hide();
            }
            self.$dialog.on('click', '.toolsBtn', function () {
                self.getSelected();
            }).on('click', '.dialogClose', function () {
                self.$dialog.remove();
                self.$dialog = null;
            }).on('click', '.dialogOk', function () {
                var setting = self.Settings;
                var t = $('.tbOpeningacceptanceBody tr.selected'),
                    result = {};
                if (t.length == 1) {
                    _.each(Project.GlobalPageData, function (i) {
                        if (i.id == t.data('id')) {
                            result = {
                                id: i.id,
                                fileUniqueId: i.fileId + i.componentId.slice(i.componentId.indexOf('.')),
                                locationName: i.locationName,
                                location: i.location,
                                axis: i.axis
                            }
                        }
                    })
                    if (setting.callback && setting.callback.call(this, result) !== false) {
                        self.$dialog.remove();
                        self.$dialog = null;
                        return self.viewData
                    }
                }
            }).on('click', '.rightBar .m-openTree,.rightBar .m-closeTree', function () {
                var $this = $(this),
                    $li = $this.closest('.itemNode');
                $this.toggleClass('m-openTree m-closeTree');
                $li.toggleClass('open');
            }).on('click', 'li.item', function () {
                $('li.item').removeClass('selected');
                $(this).addClass('selected');
                if ($(this).hasClass('propertyPanel')) {
                    $("#presetPointPanel").hide();
                    $("#propertyPanel").show();
                } else {
                    $("#presetPointPanel").show();
                    $("#propertyPanel").hide();
                }
            })
        },
        dialog: function () {
            var self = this,
                Settings = this.Settings,
                $dialog;
            if (this.$dialog) {
                $dialog = self.$dialog;
            } else {
                var strVar1 = "";
                strVar1 += "<div class=\"projectPropetyContainer projectNavContentBox\">";
                strVar1 += "                                <div class=\"designProperties\">";
                strVar1 += "                                    <div class=\"nullTip\">请选择构件<\/div>";
                strVar1 += "                                <\/div>";
                strVar1 += "                            <\/div>";
                var strVar = "";
                strVar += "<div class=\"rightProperty\">";
                strVar += "            <div class=\"rightPropertyContentBox\">";
                strVar += "                <div class=\"rightPropertyContent\">";
                strVar += "                    <div class=\"rightPropertyContent\">";
                strVar += "                        <div class=\"designPropetyBox\">";
                strVar += "                            <ul class=\"projectPropetyHeader projectNav\">";
                if (self.Settings.withCheckpoint == "true") {
                    strVar += "                                <li data-type=\"attr\" class=\"item selected\">检查点<\/li>";
                    strVar += "                                <li data-type=\"attr\" class=\"item propertyPanel\">属性<\/li>";
                }
                else if (self.Settings.withCheckpoint == "undefined") {
                    strVar += "                                <li data-type=\"attr\" class=\"item selected\">检查点<\/li>";
                    strVar += "                                <li data-type=\"attr\" class=\"item propertyPanel\">属性<\/li>";
                }
                else {
                    strVar += "                                <li data-type=\"attr\" class=\"item\" style=\"display:none;\">检查点<\/li>";
                    strVar += "                                <li data-type=\"attr\" class=\"item propertyPanel selected\">属性<\/li>";
                }
                strVar += "                            <\/ul>";
                if (self.Settings.withCheckpoint == "true") {
                    strVar += "                            <div id=\"presetPointPanel\" class=\"qualityContainer projectNavContentBox\"><div id=\"dataLoading\"></div>";
                    strVar += "                                ";
                    strVar += "                            <\/div>";
                    strVar += "                            <div class=\"bim\" id=\"propertyPanel\" style=\"display:none;\">";
                    strVar += strVar1;
                    strVar += "                            <\/div>";
                }
                else if (self.Settings.withCheckpoint == "undefined") {
                    strVar += "                            <div id=\"presetPointPanel\" class=\"qualityContainer projectNavContentBox\"><div id=\"dataLoading\"></div>";
                    strVar += "                                ";
                    strVar += "                            <\/div>";
                    strVar += "                            <div class=\"bim\" id=\"propertyPanel\" style=\"display:none;\">";
                    strVar += strVar1;
                    strVar += "                            <\/div>";
                }
                else {
                    strVar += "                            <div id=\"presetPointPanel\" class=\"qualityContainer projectNavContentBox\" style=\"display:none;\"><div id=\"dataLoading\"></div>";
                    strVar += "                                ";
                    strVar += "                            <\/div>";
                    strVar += "                            <div class=\"bim\" id=\"propertyPanel\" style=\"display:block;\">";
                    strVar += strVar1;
                    strVar += "                            <\/div>";
                }
                strVar += "                        <\/div>";
                strVar += "                    <\/div>";
                strVar += "                <\/div>";
                strVar += "                <div class=\"dragSize\"><\/div>";
                strVar += "                <div class=\"slideBar\"><i class=\"icon-caret-right\"><\/i><\/div>";
                strVar += "            <\/div>";
                strVar += "        <\/div>";
                $dialog = self.$dialog = $('<div class="modelSelectDialog"></div>');
                var $body = $('<div class="dialogBody"  style="width:' + this.Settings.width + ';height:' + this.Settings.height + '"></div>'),
                    $header = $('<div class="dialogHeader"/>').html('请选择检查点<span class="dialogClose" title="关闭"></span> '),
                    $modelView = self.$modelView = $('<div id="modelView" class="model" style="width:' + this.Settings.width + ';height:' + this.Settings.height + '"></div>'),
                    $content = $('<div class="dialogContent"  style="width:' + this.Settings.width + ';height:' + this.Settings.height + '">' + strVar + '</div>'),
                    $bottom = $('<div class="dialogFooter"/>').html('<input type="button" class="dialogOk dialogBtn" value="' + this.Settings.btnText + '" />');
                $content.prepend($modelView);
                $body.append($content);
            }
            $dialog.append($body);
            $("body").append($dialog);
            if (self.isIE()) {
                self.activeXObject();
                $dialog.find(".rightBar").remove();
                $dialog.find(".rightProperty").remove();
                $('.m-camera').addClass('disabled').attr('disabled', 'disabled');
                self.ieDialogEvent();
                return;
            }
            setTimeout(function () {
                self.renderModel();
            }, 10);
        },
        //ie事件
        ieDialogEvent: function () {
            var self = this,
                $dialog = this.$dialog;
            $dialog.on('click', '.dialogClose', function () {
                self.$dialog.remove();
                self.$dialog = null;
            })
            $dialog.on('click', '.dialogOk', function () {
                //获取数据
                WebView.runScript('getData()', function (val) {
                    var result = {},
                        setting = self.Settings;
                    if (val) {
                        val = JSON.parse(val)
                        if (setting.callback && setting.callback.call(this, val) !== false) {
                            return self.viewData
                        }
                    }
                });
            })
        },
        //是否是IE浏览器
        isIE: function () {
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                return true;
            else
                return false;
        },
        //activeXObject 渲染模型
        activeXObject: function () {
            WebView = document.createElement("object");
            WebView.classid = "CLSID:15A5F85D-A81B-45D1-A03A-6DBC69C891D1";
            var viewport = document.getElementById('modelView');
            viewport.appendChild(WebView);

            function resizeWebView() {
                //重置
                if (window.devicePixelRatio) {
                    WebView.zoomFactor = window.devicePixelRatio;
                } else {
                    WebView.zoomFactor = screen.deviceXDPI / screen.logicalXDPI;
                }
            }

            WebView.url = ourl + "/static/dist/components/inspectSelectionNew/model.html?type=" + this.Settings.type + "&sourceId=" + this.Settings.sourceId + "&etag=" +
                this.Settings.etag + "&projectId=" + this.Settings.projectId + "&projectVersionId=" + this.Settings.projectVersionId + "&ruleType=" + this.Settings.ruleType + "&appKey=" +
                this.Settings.appKey + "&token=" + this.Settings.token + "&height=" + this.Settings.height + "&width=" + this.Settings.width + "&withCheckpoint=" + this.Settings.withCheckpoint;
            WebView.height = this.Settings.height || "510px";
            WebView.width = this.Settings.width || "960px";
            try {
                WebView.registerEvent('newWindow', function (url) {
                    if (/test$/.test(url)) {
                        Project.Settings.test.call(this);
                    }
                });
                //窗体变化
                window.onresize = resizeWebView;
                resizeWebView();
            } catch (e) {
                var currentVersion = 5;
                if (WebView.pluginVersion != currentVersion) {
                    var html = templateUrl("/app/oPage/downloadIE.html");
                    $("body").html(html);
                } else if (!isIE()) {
                    var html = templateUrl("/app/oPage/tipIE.html");
                    $("body").html(html);
                } else {
                    var html = templateUrl("/app/oPage/error.html");
                    $("body").html(html);
                }

                function templateUrl(url) {
                    var result;
                    var path = "/static/dist" + url;
                    var wandaHost = /dev/.test(location.host) ? 'http://bim-uat.wanda-dev.cn' : 'http://bim.wanda.cn';
                    path = /wanda/.test(location.host) ? (wandaHost + path) : path;
                    $.ajax({
                        url: path,
                        type: 'GET',
                        async: false
                    }).done(function (tpl) {
                        result = tpl;
                    });
                    return result;
                }
            }
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
            //	Project.setOnlyModel();//检查是否是唯一的 模型
            var _this = this;
            var viewer = new bimView({
                type: 'model',
                element: this.$modelView,
                sourceId: this.Settings.sourceId,
                etag: this.Settings.etag,
                projectId: this.Settings.projectId,
                projectVersionId: this.Settings.projectVersionId
            })
            var _url = ourl + '/doc/' + this.Settings.projectId + '/' + this.Settings.projectVersionId + '?' + _this.Settings.token_cookie + '&modelId=';
            viewer.on("click", function (model) {
                console.log("MODEL", model);
                var _userId = model.intersect.userId || "",
                    _axisObj = model.intersect.axisGridInfo || {},
                    _boundingBox = model.intersect.worldBoundingBox,
                    _position = model.intersect.worldPosition,
                    _modelId = _userId.slice(0, _userId.indexOf('.')),
                    fileUrl = _url + _modelId;
                var intersect = viewer.getMiniMapObject().getAxisGridInfoByIntersect(model.intersect);
                _axisObj = model.intersect.axisGridInfo;

                var userSceneId = model.intersect.userId.split('.')[0];
                Project.sceneId = userSceneId;
                Project.renderAttr(_userId, Project.sceneId);
                if (Project.mode == "readOnly") {
                    return
                }
                Project.currentUserId = _userId;
                Project.location[_userId] = JSON.stringify({
                    boundingBox: _boundingBox,
                    position: _position
                });
                var offsetXFU, offsetYFU;
                if (_axisObj.offsetX > 0) {
                    offsetXFU = "+" + _axisObj.offsetX;
                } else {
                    offsetXFU = _axisObj.offsetX;
                }
                if (_axisObj.offsetY > 0) {
                    offsetYFU = "+" + _axisObj.offsetY;
                } else {
                    offsetYFU = _axisObj.offsetY;
                }
                Project.locationName[_userId] = _axisObj.abcName + '轴' + offsetYFU + ',' + _axisObj.numeralName + '轴' + offsetXFU;
                Project.axis[_userId] = JSON.stringify(_axisObj);
                Project.components[_userId] = _boundingBox;
                /*获取楼层信息 begin*/
                _url = "/sixD/{projectId}/{projectVersionId}/quality/axis/?elementId={elementId}";
                _url = _url.replace("{projectId}", _this.Settings.projectId);
                _url = _url.replace("{projectVersionId}", _this.Settings.projectVersionId);
                _url = _url.replace("{elementId}", model.intersect.userId);
                _url = ourl + _url;
                $.ajax({
                    url: _url,
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        var floor;
                        if (data.code != 0) {
                            return;
                        }
                        if (data.data == null) {
                            return;
                        }
                        floor = data.data.floor;
                        console.log("floor==[]:", floor == '[""]');
                        if (floor != null && floor != '[""]' && floor != "") {
                            Project.locationName[_userId] = Project.locationName[_userId] + ",楼层 " + floor;
                        }
                    }
                });
                Project.fileIds[_userId] = Project.filterFileId(_modelId);
                if (Project.mode == 'preset' || Project.mode == 'edit' || !Project.mode) {
                    //viewer.viewer.loadMarkersFromIntersect(model.intersect,1,3); // old interface
                    viewer.getMakerObject().loadMarkersFromIntersect(model.intersect, 1, 1); //new interface
                    var m = viewer.saveMarkers();
                    Project.Settings.markers = m;
                    Project.currentRiskShowData = {
                        id: _userId,
                        marker: m[0]
                    }
                    Project.showStatus(Project.presetPointShowData, Project.currentRiskShowData);

                    // if (Project.Viewer.getMakerObject().markerEditor.markers[1] !== undefined) {
                    //     Project.Viewer.getMakerObject().markerEditor.markers[1].select();
                    // }
                }
                //渲染属性面板
                var userSceneId = model.intersect.userId.split('.')[0];
                Project.sceneId = userSceneId;
            });
            Project.Viewer = viewer;
            viewer.on("loaded", function () {
                _this.loadFiveMajor();
                Project.loadPropertyPanel();
                Project.BIMFilter = Project.Viewer.viewer.getFilter();
                $('#modelView .modelSidebar').addClass('hideMap');
            });
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                Project.Viewer.getMakerObject().setMarkerClickCallback(abcd);
            } else {
                function abcd(marker) {
                    var id = marker ? marker.id : "",
                        userId = marker ? marker.userId : "",
                        data = {},
                        Project = viewer.Project;
                    if (Project.isSelect == 'close') {
                        return
                    }
                    $(".tbOpeningacceptanceBody tr").removeClass('selected');
                    if (id) {
                        var tr = $("tr[data-id='" + id + "']");
                        if (tr.length > 0) {
                            tr.addClass('selected');
                        } else {
                            data = Project.catchPageData('process', { id: id });
                            Project.OpeningAcceptanceCollection.reset();
                            Project.OpeningAcceptanceCollection.push({ data: data });
                            Project.pageInfo(data, true);
                            tr = $("tr[data-id='" + id + "']");
                            tr.addClass("selected");
                        }
                    }
                    var array = [];
                    if (Project.currentRiskShowData) {
                        array.push(Project.currentRiskShowData.id);
                    }
                    if (Project.presetPointShowData && Project.isSelect == 'close') {
                        array.push(Project.presetPointShowData.id);
                    }
                    if (userId) {
                        array.push(userId);
                        Project.Viewer.highlight({
                            type: 'userId',
                            ids: array
                        });
                    } else {
                        Project.Viewer.highlight({
                            type: 'userId',
                            ids: array
                        });
                    }
                }
            }
            $(document).on('mousedown', function (event) {
                if (event.button == 2 && (Project.mode == 'preset' || Project.mode == 'edit')) {
                    event.preventDefault();
                    if (Project.BIMFilter) {
                        Project.BIMFilter.clearSelectionSet();
                    } else {
                        Project.Viewer.viewer.getFilter().clearSelectionSet();
                    }
                    Project.currentUserId = null;
                    Project.showStatus(Project.presetPointShowData, null);
                    return false;
                }
            })
        },
        showInModel: function (param) {
            var p = JSON.stringify(param);
            if (this.isIE()) {
                WebView.runScript("allIn('" + p + "')", function (val) {
                });
            }
            else {
                this.allIn(p);
            }
        },
        clearCache: function () {
            var view = viewer.Project.Viewer;
            $(".tbOpeningacceptanceBody tr").removeClass('selected');
            view.highlight({
                type: "userId",
                ids: undefined
            });
            view.setSelectedIds();
            this.Project.presetPointShowData = null;
            this.Project.presetPoint = null;
            this.Project.currentRiskShowData = null;
            this.Project.currentUserId = null;
            this.Project.isSelect = 'open';
            this.Project.mode = 'edit';
        },
        data: function () {
            var val;
            var self = this;
            if (self.isIE()) {
                WebView.runScript("getData()", function (val) {
                    if (val) {
                        val = JSON.parse(val);
                    }
                    self.Settings.callback.call(this, val);
                    return val;
                });
            }
            else {
                val = this.getData();
                if (val) {
                    val = JSON.parse(val);
                }
                self.Settings.callback.call(this, val);
                return val;
            }
        },
        getData: function () {
            var userId = this.Project.currentUserId,
                fileId = this.Project.fileIds[userId] || "";
            console.log("userId:", userId);
            var result = {
                presetPoint: this.Project.presetPoint,
                risk: {}
            }
            if (userId) {
                result.risk = {
                    components: {
                        id: userId,
                        //fileUniqueId: fileId + userId.slice(userId.indexOf('.')),
                        fileUniqueId: userId,
                        axis: this.Project.axis[userId],
                        location: this.Project.location[userId],
                        locationName: this.Project.locationName[userId]
                    },
                    markers: this.Project.Settings.markers
                }
            } else {
                if (this.Project.currentRiskShowData) {
                    result.risk = {
                        components: {
                            id: this.Project.currentRiskShowData.id,
                            markers: this.Project.currentRiskShowData.marker
                        }
                    }
                }
            }
            return JSON.stringify(result);
        },
        allIn: function (param) {
            debugger;
            showAllComponents();
            var _this = this;
            var view = Project.Viewer,
                type = "readOnly";
            param = JSON.parse(param);
            param = param || {};
            Project.mode = type;
            view.loadMarkers(null);
            if (param.presetId && (!param.componentId && !param.location)) {
                type = "preset";
                Project.mode = type;
                Project.isSelect = 'once';
                _this.showPresetPoint(param.presetId, true);
            }
            if (!param.presetId && (param.componentId && param.location)) {
                type = "risk";
                viewer.Project.mode = type;
                viewer.Project.isSelect = 'open';
                viewer.Project.presetPointShowData = null;
                viewer.Project.presetPoint = null;
                $(".tbOpeningacceptanceBody tr").removeClass('selected');
                view.highlight({
                    type: "userId",
                    ids: undefined
                })
                _this.getModelId(param.componentId, function (id, sid) {
                    _this.showRiskComponent(id, param.location, sid);
                })
            }
            if (param.presetId && param.componentId && param.location) {
                viewer.Project.isSelect = 'once';
                _this.getModelId(param.componentId, function (id) {
                    _this.showPresetPoint(param.presetId);
                    var riskMarker = null;
                    if (viewer.Project.presetPointShowData && viewer.Project.presetPointShowData.marker) {
                        riskMarker = viewer.Project.presetPointShowData.marker;
                    }
                    _this.showRiskComponent(id, param.location, undefined, riskMarker, true);

                })
            }
            if (!param.presetId && !param.componentId && !param.location) {
                type = "edit";
                _this.clearCache();
            }
            return type;
        },
        getModelId: function (componentId, callback) {
            var ids = componentId.split('.');
            var _fileId = ids[0],
                userId = ids[1];
            var _host = 'http://' + 'bim-uat.wanda-dev.cn/';//;location.host;
            $.ajax({
                url: _host + "/doc/api/" + this.Project.Settings.projectId + '/' + this.Project.Settings.projectVersionId + "?fileId=" + _fileId + '&appKey=' + this.Project.Settings.appKey + "&token=" + this.Project.Settings.token,
                /*url:_host+"/doc/api/" + Project.Settings.projectId + '/' +  Project.Settings.projectVersionId + "?fileId=" +_fileId*/
            }).done(function (data) {
                if (data.code == 0) {
                    var modelId = data.data && data.data.modelId;
                    if (modelId) {
                        componentId = modelId + '.' + userId;
                        callback(componentId, modelId);
                    }
                } else {
                    alert('获取构件ID失败');
                }
            });
        },
        clearRisk: function () {
            var view = Project.Viewer;
            view.highlight({
                type: "userId",
                ids: undefined
            })
            view.loadMarkers(null);
        },
        showRiskComponent: function (componentId, location, sid, riskMarker, doNotZoom) {
            alert("js showRiskComponent");
            var view = viewer.Project.Viewer;
            if (typeof location === 'string') {
                location = JSON.parse(location);
            }
            var box = viewer.Project.formatBBox(location.boundingBox);
            //view.setTopView(box);
            location.userId = componentId;
            location = JSON.stringify(location);
            view.highlight({
                type: "userId",
                ids: [componentId]
            });
            viewer.Project.currentRiskShowData = {
                id: componentId,
                marker: location
            }
            view.setSelectedIds([componentId]);
            view.viewer.render();
            var timer = setTimeout(function () {
                clearTimeout(timer);
                var view = viewer.Project.Viewer;
                //view.zoomToSelection();
            }, 500);

            var markers = null;
            if (riskMarker !== undefined) {
                riskMarker = [location, riskMarker];
            }
            else {
                markers = [location];
            }
            view.loadMarkers(markers);
            if (viewer.Project.mode == 'risk') {
                viewer.Project.ModelFilter.fileFilter(sid);
            }
        },
        showPresetPoint: function (presetId, isClearRisk) {
            if (isClearRisk) {
                Project.currentRiskShowData = null;
            }
            var data = Project.catchPageData(null, {
                id: presetId
            });
            if (Project.presetPointShowData && Project.presetPointShowData.marker) {
                viewer.Project.Viewer.loadMarkers([viewer.Project.presetPointShowData.marker]);
            }
            Project.OpeningAcceptanceCollection.push({ data: data });
            Project.pageInfo(data, true);
            var t = $("tr[data-id='" + presetId + "']");
            t.trigger('click');
        },
        clearPresetPoint: function () {
            var view = Project.Viewer;
            view.highlight({
                type: "userId",
                ids: undefined
            })
            view.loadMarkers(null);
            view.fit();
        }
    }
    //Project模型操作方法
    var Project = {
        presetPointShowData: null,
        currentSearchFloor: '',
        currentSearchCat: '',
        isSelect: 'open',
        currentHightLight: [],
        BIMFilter: null,
        ModelFilter: ModelFilter,
        //显示隐患和预设点
        //presetId componetId location
        allIn: function (param) {
            var self = this,
                view = Project.Viewer;
            param = param || {};
            view.loadMarkers(null);
            if (param.presetId) {
                self.showPresetPoint(param.presetId);
            }
            if (param.componentId && param.location) {
                self.showRiskComponent(param.componentId, param.location);
            }
        },
        //清除隐患构件信息 -- 解绑隐患
        clearRisk: function () {
            var view = Project.Viewer;
            view.highlight({
                type: "userId",
                ids: undefined
            })
            view.loadMarkers(null);
        },
        //显示隐患构件信息 -- 绑定隐患
        showRiskComponent: function (componentId, location) {
            var view = Project.Viewer;
            view.highlight({
                type: "userId",
                ids: [componentId]
            });
            view.loadMarkers(Project.formatMark(location));
        },
        //显示预设点信息 --绑定预设点
        showPresetPoint: function (presetId) {
            var data = Project.catchPageData(null, {
                id: presetId
            })
            Project.ProcessAcceptanceCollection.push({ data: data });
            Project.pageInfo(data, true);
            $(".QualityProcessAcceptance .tbProcessAccessBody tr[data-id='" + presetId + "']").click()
        },
        //清除模型中显示的预设点信息 -- 解绑预设点
        clearPresetPoint: function () {
            var view = Project.Viewer;
            view.highlight({
                type: 'userId',
                ids: undefined
            })
            view.loadMarkers(null);
            view.fit();
        },
        showStatus: function (presetData, riskData) {
            var idsAll = [],
                markers = [];

            var view = Project.Viewer;
            if (presetData) {
                idsAll.push(presetData.id);

                markers.push(presetData.marker);
            }
            if (riskData) {
                idsAll.push(riskData.id);
                markers.push(riskData.marker);
            }
            //alert(idsAll.toString());
            view.highlight({
                type: 'userId',
                ids: []
            });
            view.highlight({
                type: 'userId',
                ids: idsAll
            });
            view.loadMarkers(markers);
        },
        type: "open",
        Settings: {},
        GlobalPageData: null,
        currentPageListData: null,
        currentInspectId: null,
        templateCache: [],
        components: {},
        location: {},
        locationName: {},
        fileIds: {},
        axis: {},
        currentUserId: '',
        filterRule: {
            sceneId: '工程桩,基坑支护,地下防水,钢结构悬挑构件,幕墙,采光顶'
        },
        filterFileId: function (modelId) {
            var data = Project.Settings.fileData;
            var result = _.findWhere(data, { modelId: modelId });
            if (result) {
                return result.fileId;
            }
            return '';
        },
        //计划状态
        planStatus: {
            0: '',
            1: 'myIcon-circle-red',
            2: 'myIcon-circle-yellow',
            3: 'myIcon-circle-green'
        },
        filterCCode: function (code) {
            var _class = Project.Viewer.ClassCodeData,
                hide = [];
            _.each(_class, function (item) {
                if (item.code.indexOf(code) != 0) {
                    hide.push(item.code);
                }
            })
            return hide;
        },
        dispatchIE: function (url) {
            if (navigator.userAgent.indexOf("QtWebEngine/5.7.0") > -1) {
                window.open(url);
            }
        },
        //获取当前检查点所在位置(页码),和当前页码所在的数据队列
        //pageNum pageSize id
        catchPageData: function (type, param, isGlobal) {
            var start = 0, end = 0, result = {}, list = [], counter = 0,
                opts = $.extend({}, {
                    id: "",
                    pageSize: 20,
                    pageNum: 1
                }, param),
                data = isGlobal ? Project.GlobalPageData : Project.currentPageListData,
                _len = data.length;
            if (opts.id) {
                for (var i = 0, size = _len; i < size; i++) {
                    if (data[i].id == opts.id) {
                        counter = i;
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
        //分页信息
        pageInfo: function (data, isObject) {
            var $el = $('.modelSelectDialog');
            if (!isObject) {
                data = data.toJSON()[0].data;
            }
            $el.find(".paginationBottom .sumCount .count").text(data.totalItemCount);
            $el.find(".paginationBottom .pageInfo .curr").text(data.pageIndex);
            $el.find(".paginationBottom .pageInfo .pageCount").text(data.pageCount);
            if (data.pageIndex == 1) {
                $el.find(".paginationBottom .pageInfo .prev").addClass('disable');
            } else {
                $el.find(".paginationBottom .pageInfo .prev").removeClass('disable');
            }
            if (data.pageIndex >= data.pageCount) {
                $el.find(".paginationBottom .pageInfo .next").addClass('disable');
            } else {
                $el.find(".paginationBottom .pageInfo .next").removeClass('disable');
            }
        },
        renderAttr: function (elementId, sceneId) {
            var url = ourl + "/sixD/" + Project.Settings.projectId + "/" + Project.Settings.projectVersionId + "/property",
                that = this;
            $.ajax({
                url: url,
                data: {
                    elementId: elementId,
                    sceneId: sceneId
                }
            }).done(function (data) {
                var template = _.template(strVar3),
                    html = template(data.data);
                $("#propertyPanel .designProperties").html(html);
                if (self.viewer.Project.Viewer.isIsolate()) {
                    $('#isolation').show();
                }else{
                    $('#isolation').hide();
                }
                
            });
        },
        showInModel: function ($target, type) {
            if (Project.isSelect == 'open' || Project.isSelect == 'once') {
                var _this = this,
                    id = $target.data('id'),
                    color = $target.data('color'),
                    _temp = null,
                    location = null,
                    item = null;
                _.each(Project.GlobalPageData, function (i) {
                    if (i.id == id) {
                        _temp = i.location;
                        location = i.location;
                        item = i;
                    }
                })
                if (_temp) {
                    _temp = JSON.parse(_temp);
                    ModelFilter.filter($target, _temp.componentId, _temp, $target.data('cat'), 2, function () {
                        var box = _this.formatBBox(_temp.bBox || _temp.boundingBox);
                        var ids = [_temp.componentId];
                        //_this.zoomModel(ids, box);
                        //_this.showMarks(Project.formatMark(location, color, id));
                        Project.Viewer.getMakerObject().setMarkerClickCallback(_this.markerCallBack);
                        if (item) {
                            Project.presetPoint = {
                                location: location,
                                id: id,
                                fileUniqueId: item.fileId + item.componentId.slice(item.componentId.indexOf('.')),
                                axis: item.axis,
                                locationName: item.locationName
                            }
                            Project.presetPointShowData = {
                                id: item.componentId,
                                marker: Project.formatMark(location, color, id)
                            }


                            Project.showStatus(Project.presetPointShowData, Project.currentRiskShowData);
                            if (Project.currentRiskShowData != undefined) {
                                //alert(Project.currentRiskShowData.marker);
                                var locationTmp;
                                if (typeof Project.currentRiskShowData.marker === 'string') {
                                    locationTmp = JSON.parse(Project.currentRiskShowData.marker);
                                }
                                var boxTmp = _this.formatBBox(locationTmp.boundingBox);
                                Project.Viewer.setTopView(boxTmp);
                                Project.currentRiskShowData = undefined;
                            }
                            
                        }

                        // if (Project.isSelect == 'once') {
                        //     Project.isSelect = 'close';
                        // }
                    })
                }


            }
        },
        markerCallBack: function (marker) {
            var id = marker ? marker.id : "",
                userId = marker ? marker.userId : "",
                data = {},
                Project = viewer.Project;

            //此状态用于控制marker与构件是否联动
            if (Project.isSelect == 'close') {
                return
            }
            $(".tbOpeningacceptanceBody tr").removeClass('selected');
            if (id) {
                var tr = $("tr[data-id='" + id + "']");
                if (tr.length > 0) {
                    tr.addClass('selected');
                } else {
                    data = Project.catchPageData('process', { id: id });
                    Project.OpeningAcceptanceCollection.reset();
                    Project.OpeningAcceptanceCollection.push({ data: data });
                    Project.pageInfo(data, true);
                    tr = $("tr[data-id='" + id + "']");
                    tr.addClass("selected");
                }
            }
            var array = [];
            if (Project.currentRiskShowData) {
                array.push(Project.currentRiskShowData.id);
            }
            if (Project.presetPointShowData && Project.isSelect == 'close') {
                array.push(Project.presetPointShowData.id);
            }
            if (userId) {
                // array.push(userId);
                // Project.Viewer.highlight({
                //     type: 'userId',
                //     ids: array
                // });
                Project.Viewer.setSelectedIds([userId]);
            } else {
                Project.Viewer.setSelectedIds();
                // Project.Viewer.viewer.render();
                // Project.Viewer.highlight({
                //     type: 'userId',
                //     ids: array
                // });
            }
            debugger;
            Project.Viewer.viewer.render();
            Project.renderAttr(userId, Project.sceneId);
        },
        showMarks: function (marks) {
            // var _viewer = this._$viewer;
            if (!_.isArray(marks)) {
                marks = [marks];
            }
            Project.Viewer.getMakerObject().setMarkerClickCallback(this.markerCallBack);
            Project.Viewer.loadMarkers(marks);
        },
        hideMarks: function () {
            Project.Viewer && Project.Viewer.loadMarkers(null);
            Project.showStatus(Project.presetPointShowData, Project.currentRiskShowData);
        },
        formatMark: function (location, color, id) {
            var _temp = typeof location === 'string' ? JSON.parse(location) : location,
                _color = '510';
            color = _color.charAt(color || 5) || 5;
            _temp.shapeType = _temp.shapeType || 0;
            _temp.state = _temp.state || color || 0;
            _temp.userId = _temp.userId || _temp.componentId;
            _temp.id = id || '';
            return JSON.stringify(_temp);
        },
        //通过userid 和 boundingbox 定位模型
        zoomModel: function (ids, box) {
            //定位
            Project.Viewer.setTopView(box);
            //高亮
            Project.Viewer.highlight({
                type: 'userId',
                ids: ids
            });
        },
        showSelectMarkers: function (e, target) {
            var $target = target || $(e.currentTarget);
            if ($target.hasClass('selected')) {
                var array = [], boxs = [];
                _.each(Project.currentPageListData, function (i) {
                    if (i.location.indexOf('boundingBox') != -1) {
                        array.push(Project.formatMark(i.location, i.colorStatus, i.id));
                        boxs.push(JSON.parse(i.location).boundingBox);
                    }
                })
                Project.showMarks(array);
                Project.Viewer.setTopView(boxs, true);
                ModelFilter.recoverySilder();
                if (Project.currentSearchCat) {
                    //ModelFilter.sigleRule(Project.currentSearchCat,Project.currentSearchFloor);
                    CommProject.init({
                        data: Project.currentPageListData,
                        viewer: Project.Viewer,
                        sourceId: Project.Settings.sourceId,
                        etag: Project.Settings.etag,
                        projectId: Project.Settings.projectId,
                        projectVersionId: Project.Settings.projectVersionId
                    }).filter({
                        cat: Project.currentSearchCat.text,
                        floors: Project.currentSearchFloor
                    });
                }
            } else {
                Project.hideMarks();
            }
            $(".tbOpeningacceptanceBody tr").removeClass('selected');
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
        loadPropertyPanel: function () {
            $('.qualityContainer').append(new QualityOpeningAcceptance().render({
                OpeningAcceptance: {
                    locationName: '',
                    type: Project.Settings.type == 'open' ? 2 : 1,
                    specialty: "", //专业
                    category: Project.Settings.ruleType || '', //类别
                    problemCount: "", // 无隐患 1， 有隐患
                    pageIndex: 1, //第几页，默认第一页
                    pageItemCount: 9999
                }
            }).el);
            this.loadData();
        },
        loadData: function (data, page) {
            OpeningAcceptanceCollection.reset();
            OpeningAcceptanceCollection.projectId = this.Settings.projectId;
            OpeningAcceptanceCollection.projectVersionId = this.Settings.projectVersionId;
            //if(this.filters){
            //	App.Project.currentProsCat=App.Project.mapData.processCategory[that.ProcessAcceptanceOptions.category];
            //	App.Project.currentProsCheckFloor=that.ProcessAcceptanceOptions.floor;
            //	if('外保温'.indexOf(App.Project.currentProsCat)!=-1){
            //		App.Project.currentProsCheckFloor=App.Project.currentProsCheckFloor+','+'其它';
            //	}
            //}
            if (data) {
                var nIndex = data.category;
                if (nIndex > 3) {
                    nIndex += 1;
                }
                if (nIndex > 27) {
                    nIndex = 4;
                }
                Project.currentSearchCat = data.category ? mapData.processCategory[nIndex] : '';
                if ('外保温'.indexOf(Project.currentSearchCat) != -1) {
                    Project.currentSearchFloor = '其它';
                    if (data.floor) {
                        Project.currentSearchFloor += ',' + data.floor;
                    }
                } else {
                    Project.currentSearchFloor = data.floor;
                }
            }
            OpeningAcceptanceCollection.fetch({
                data: $.extend({}, {
                    locationName: '',
                    type: Project.Settings.type == 'open' ? 2 : 1,
                    specialty: "", //专业
                    category: Project.Settings.ruleType || '', //类别
                    problemCount: "", // 无隐患 1， 有隐患
                    pageIndex: page || 1, //第几页，默认第一页
                    pageItemCount: 9999
                }, data),
                success: function (data) {
                    Project.pageInfo(data);
                },
                fail: function () {
                    debugger;
                    alert('检查点加载失败')
                },
                complete: function () {
                    $('#dataLoading').hide();
                }
            });
        },
        loadDataFromCache: function (index) {
            OpeningAcceptanceCollection.reset();
            var data = Project.catchPageData('process', {
                pageNum: index
            })
            OpeningAcceptanceCollection.push({ data: data });
            Project.pageInfo(data, true);
        },
        //检查是否是唯一的 模型
        setOnlyModel: function () {
            var onlyCount = App.Comm.getCookie("onlyCount");
            if (!onlyCount) {
                App.Comm.setCookie("onlyCount", 1);
                Project.onlyCount = 1;
            } else {
                onlyCount++;
                App.Comm.setCookie("onlyCount", onlyCount);
                Project.onlyCount = onlyCount;
            }
        },
        //关闭窗口
        checkOnlyCloseWindow: function () {
            var onlyCount = App.Comm.getCookie("onlyCount");
            //没加载过模型
            if (!onlyCount || !Project.onlyCount) {
                return;
            }
            if (onlyCount != Project.onlyCount) {
                if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
                    window.location.href = "about:blank";
                    //window.close();
                } else {
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            }
            //重置 一直累加会溢出
            if (onlyCount == Project.onlyCount && Project.onlyCount > 100) {
                App.Comm.setCookie("onlyCount", 1);
                Project.onlyCount = 1;
            }
        }
    }
    var OpeningAcceptanceCollection = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: function () {
                return {
                    title: ""
                }
            }
        }),
        urlType: "fetchQualityOpeningAcceptance",
        parse: function (data) {
            if (data.code == 0) {
                Project.currentPageListData = data.data.items;
                Project.GlobalPageData = Project.GlobalPageData || data.data.items;
                Project.showSelectMarkers(null, $('.btnCk'));
                var _data = Project.catchPageData();
                data.data = _data;
                return data;
            } else if (data.code == 10004) {
                window.location.href = data.data;
            }
        }
    }))
    Project.OpeningAcceptanceCollection = OpeningAcceptanceCollection;
    var QualityOpeningAcceptance = Backbone.View.extend({
        tagName: "div",
        className: "QualityOpeningAcceptance",
        currentDiseaseView: null,
        filters: {},
        initialize: function () {
            this.listenTo(OpeningAcceptanceCollection, "add", this.addOne);
            this.listenTo(OpeningAcceptanceCollection, "reset", this.loading);
        },
        events: {
            "click .searchToggle": "searchToggle",
            "click .clearSearch": "clearSearch",
            //	"click .tbOpeningacceptanceBody tr": "showInModel",
            'click .resultStatusIcon': 'showDiseaseList',
            'click .tbOpeningacceptanceBody tr': 'selectInspect',
            'click .btnCk': 'showSelectMarker',
            'click .pageInfo .next': 'nextPage',
            'click .pageInfo .prev': 'prevPage'
        },
        //渲染
        render: function (options) {
            this.OpeningAcceptanceOptions = options.OpeningAcceptance;
            var tpl = _.template(strVar2);
            this.$el.html(tpl({
                floorsData: Project.Viewer.FloorsData,
                userData: Project.Settings.type == 'open' ? mapData.openCategory : mapData.processCategory,
                ruleType: Project.Settings.ruleType
            }));
            this.bindEvent();
            return this;
        },
        //开业验收过滤条件change事件
        changeOA: function (key, val) {
            this.filters[key] = val;
        },
        //事件初始化
        bindEvent: function () {
            var that = this;
            this.$('.txtLocationName').change(function () {
                that.changeOA('locationName', $(this).val())
            })
            if (this.$(".riskOption").myDropDown) { //隐患
                //收起 暂开 属性内容
                $('.designPropetyBox').on("click", ".modleShowHide", function () {
                    $(this).toggleClass("down");
                    var $modleList = $(this).parent().parent().find(".modleList");
                    $modleList.slideToggle();
                });
                this.$(".riskOption").myDropDown({
                    zIndex: 11,
                    click: function ($item) {
                        that.changeOA('problemCount', $item.data("val"));
                    }
                });
                //类型
                this.$(".categoryOption").myDropDown({
                    zIndex: 12,
                    click: function ($item) {
                        that.changeOA('category', $item.data("val"))
                    }
                });
                this.$(".floorOption").myDropDown({
                    click: function ($item) {
                        that.changeOA('floor', $item.data("val"))
                    }
                });
                //专业
                this.$(".specialitiesOption").myDropDown({
                    zIndex: 13,
                    click: function ($item) {
                        that.changeOA('specialty', $item.data("val"))
                    }
                });
                //显示搜索结果对应位置
                this.$(".groupRadio").myRadioCk();
            }
            this.$('.btnFilter').on('click', function () {
                Project.loadData(that.filters);
            })
        },
        showSelectMarker: function (e) {
            if ($('.noDataTd').length) {
                return;
            }
            showAllComponents();
            Project.showSelectMarkers(e);
        },
        //显示隐藏搜索
        searchToggle: function (e) {
            var $searchDetail = this.$(".searchDetail");
            if ($searchDetail.is(":animated")) {
                return;
            }
            $(e.currentTarget).toggleClass('expandArrowIcon');
            $searchDetail.slideToggle();
        },
        searchup: function () {
            var $searchDetail = this.$(".searchDetail");
            if ($searchDetail.is(":animated")) {
                return;
            }
            this.$('.searchToggle').removeClass('expandArrowIcon');
            $searchDetail.slideUp();
        },
        //清空搜索条件
        clearSearch: function () {
            Project.dispatchIE("/?commType=test");
            this.$(".riskOption .text").html('全部');
            this.$(".categoryOption .text").html('全部');
            this.$(".floorOption .text").html('全部');
            this.$(".txtLocationName").val('');
            this.filters = {};
            Project.loadData(null);
        },
        template: _.template(strVar1),
        //获取数据后处理
        addOne: function (model) {
            var data = model.toJSON();
            this.$(".tbOpeningacceptanceBody tbody").html(this.template(data));
            //  this.bindScroll();
            console.log(data);
        },
        //选择检查点
        selectInspect: function (e) {
            var $target = $(e.currentTarget);
            Project.currentInspectId = $target.data('id');
            if (Project.isSelect != 'close') {
                if ($target.hasClass("selected")) {
                    $target.parent().find(".selected").removeClass("selected");
                    Project.presetPoint = null;
                    Project.presetPointShowData = null;
                    Project.showStatus(Project.presetPointShowData, Project.currentRiskShowData);
                    return
                } else {
                    $target.parent().find(".selected").removeClass("selected");
                    $target.addClass("selected");
                }
            }
            Project.showInModel($target, 2);
        },
        //加载
        loading: function () {

            // this.$(".tbOpeningacceptanceBody tbody").html(App.Project.Settings.loadingTpl);
            this.searchup();
        },
        //模型中显示
        showInModel: function (e) {
            Project.showInModel($(e.currentTarget), 0);
        },
        showDiseaseList: function (event) {
            //App.Project.QualityAttr.showDisease(event,this,'open',2);// showDiseaseList
            //event.stopPropagation();
        },
        //下一页
        nextPage: function (event) {
            if ($(event.target).hasClass("disable")) {
                return;
            }
            var next = +this.$el.find(".paginationBottom .pageInfo .curr").text() + 1;
            //Project.loadData(this.filters, next)
            Project.loadDataFromCache(next);
        },
        //上一页
        prevPage: function (event) {
            if ($(event.target).hasClass("disable")) {
                return;
            }
            var prev = +this.$el.find(".paginationBottom .pageInfo .curr").text() - 1;
            Project.loadDataFromCache(prev);
        }
    });
    win.InspectModelSelection = InspectModelSelection;
})(window)