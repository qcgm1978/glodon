/**
 * @require /libsH5/js/libs/three.min.js
 */

/**
 * @namespace CLOUD
 * @property {string}  Version                - 版本
 * @require /libsH5/js/libs/three.min.js
 */

"use strict";

var CLOUD = CLOUD || {};
CLOUD.Version = "1.0.0.20180329";

/**
 * @namespace CLOUD.GlobalData
 * @property {number}  SceneSize                - 场景大小
 * @property {string}  TextureResRoot           - 纹理资源路径
 * @property {boolean}  EnableTextureMapping    - 是否启用纹理贴图
 * @property {object}  SelectionColor           - 默认构件选中颜色
 * @property {boolean}  DisableAntialias        - 是否禁用反走样
 * @property {boolean}  EnableDemolishByDClick  - 是否允许双击半透明
 * @property {boolean}  UseMpkWorker            - 是否使用Worker
 * @property {string}  MpkWorkerUrl             - Worker导入库地址
 * @property {string}  ZipResourcePostfix       - 数据资源文件后缀
 * @property {boolean}  UseLayerData            - 是否使用分层数据
 * @property {boolean}  IncrementRender         - 是否开启增量绘制
 * @property {number}  LimitFrameTime           - 每帧允许的最大绘制时间
 * @property {number}  maxObjectNumInPool       - 对象池大小
 * @property {number}  maxDrawCacheNum          - 绘制列表最大缓存数目，大于该数目，会回收缓存资源
 * @property {number}  OctantDepth              - 八叉树深度
 * @property {number}  MaximumDepth             - 八叉树最大深度
 * @property {number}  ConcurrencyRequestCount  - 最大请求数 (HTTP, web worker, etc. )
 * @property {boolean}  ShowOctant              - 是否绘制八叉树节点
 * @property {boolean}  DisableOctant           - 是否禁止八叉树裁剪数据
 * @property {boolean}  DirectionalLight        - 是否使用平行光源
 * @property {boolean}  Hover                   - 是否启用hover
 * @property {boolean}  ReverseWheelDirection   - 是否反转鼠标滚轮方向
 * @property {number}  MovementSpeedRate        - 相机移动速度倍率
 * @property {boolean}  DEBUG                   - 是否允许调试 (输出日志信息等)
 */
CLOUD.GlobalData = {
    SceneSize: 500,

    TextureResRoot: 'images/',

    EnableTextureMapping: false,

    SelectionColor: {color: 0x003BBD, side: THREE.DoubleSide/*, opacity: 0.5, transparent: true*/},

    DisableAntialias: false,
    EnableDemolishByDClick: false,
    IsMobile: true,

    UseMpkWorker: false,
    MpkWorkerUrl: "../libs/mpkWorker.min.js",

    ZipResourcePostfix: "",
    UseLayerData: false,

    IncrementRender: true,
    EnableRenderPass: false,  // render the scene with multiple render pass
    LimitFrameTime: 250,

    maxObjectNumInPool: 6000,
    maxDrawCacheNum : 4000,

    OctantDepth: 15,
    MaximumDepth: 0,
    ConcurrencyRequestCount: 8, // Limitation of concurrency request (HTTP, web worker, etc. ) count
    ShowOctant: false,
    EnableOctant: true,

    // DirectionalLight: false,
    LightPreset: 2,                      //liuw-d   
    IBL: false,
    ToneMapping: 3, // 0-4
    LightIntensityFactor: 1.5,

    Hover: false,

    OcclusionTranslucentEnabled: false,
    OcclusionOpacity: 0.5,
    OcclusionDistanceToCamera: 1000, // mm

    DrawingStyle: 0,
    InitWireframeData: false,

    DEBUG: false
};

/**
 * 视角枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EnumStandardView = {
    ISO: 0,
    Top: 1,
    Bottom: 2,
    Front: 3,
    Back: 4,
    Right: 5,
    Left: 6,
    SouthEast: 7,
    SouthWest: 8,
    NorthEast: 9,
    NorthWest: 10,
    BottomFront: 11,
    BottomBack: 12,
    BottomRight: 13,
    BottomLeft: 14,
    BottomSouthEast: 15,
    BottomSouthWest: 16,
    BottomNorthEast: 17,
    BottomNorthWest: 18,
    RoofFront: 19,
    RoofBack: 20,
    RoofRight: 21,
    RoofLeft: 22,
    RoofSouthEast: 23,
    RoofSouthWest: 24,
    RoofNorthEast: 25,
    RoofNorthWest: 26,
    TopTurnRight: 27,
    TopTurnBack: 28,
    TopTurnLeft: 29,
    BottomTurnRight: 30,
    BottomTurnBack: 31,
    BottomTurnLeft: 32,
    FrontTurnRight: 33,
    FrontTurnTop: 34,
    FrontTurnLeft: 35,
    RightTurnBack: 36,
    RightTurnTop: 37,
    RightTurnFront: 38,
    BackTurnRight: 39,
    BackTurnTop: 40,
    BackTurnLeft: 41,
    LeftTurnFront: 42,
    LeftTurnTop: 43,
    LeftTurnBack: 44
};

CLOUD.CAMERATYPE = {
    ORTHOGRAPHIC: 0,
    PERSPECTIVE: 1
};

/**
 * 构件选中事件枚举
 * @readonly
 * @enum {number}
 */
CLOUD.OPSELECTIONTYPE = {
    Clear: 0,
    Add: 1,
    Remove: 2
};

/**
 * Type of pickable object
 * @type {{Geometry: number, Marker3d: number, IllegalType: number}}
 */
CLOUD.PICKABLETYPE = {
    Geometry: 1,
    Marker3d: 2,
    UnPickable: 0  // not a pickable object
};

/**
 * 事件枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EVENTS = {

    ON_LOAD_START: 0,
    ON_LOAD_PROGRESS: 1,
    ON_LOAD_COMPLETE: 2,
    ON_LOAD_EMPTY_SCENE: 3,
    ON_LOAD_INVALID_SCENE: 5,

    ON_EDITOR_ENTER: 40,
    ON_EDITOR_EXIST: 41,
    ON_EDITOR_BEGIN: 42,
    ON_EDITOR_END: 43,
    // event sent by mouse operation with rectangle area, for example, rectangle selection, rectangle zoom,
    // when move move to change the rectangle area changed, send the screen information about the rectangel
    // the returned event object contains following attributes:
    //        visible: if the rectangle is visible, when the mouse operation finished, it will be invisible
    //        dir: direction when draw the rectangle; true if drawn from left to right, otherwise false
    //        left: screen position of the left
    //        top:  screen position of the top
    //        width: width of the rectangle area
    //        height: height of the rectangle area
    ON_EDITOR_UPDATEUI: 44,

    // the returned event object contains one attribute:
    //           selectionList - Array of current selected object Ids
    ON_SELECTION_CHANGED: 100,

    // triggered when single click mouse no matter if object is selected
    // the returned event object contains two attributes:
    //           event: the dom event object
    //           doubleClick: flag if this is double click event, actually, this can be got from
    //                        event object
    //           canvasPos: canvas position of the mouse click, for example, {x: 100, y: 200}
    //           intersectInfo: contains five attributes:
    //                 selectedObjectId : picked object id, null if no object picked
    //                                    the object is picked no matter if it is selectable or unselectable
    //                 objectType: type of picked object, see CLOUD.PICKABLETYPE
    //                 selectable: flag that picked object is selectable
    //                 modelId: model Id of the selected object
    //                 point: the pick point on the selected object
    //                 worldPosition: world position of the pick point on the selected object
    //                 worldBoundingBox: bounding box of the selected object in world space
    ON_CLICK_PICK: 101,

    // triggered when you enable hover and hover the object
    // the returned event object same as click pick 
    ON_HOVER_PICK: 102,

    // triggered when you enable measure and pick or hover the object
    // the returned event object contains following attributes:
    //          measureType: 0 for hover, 1 for mouse down, 2 for mouse up, 3 for mouse move
    //          pickPoint: the world position for pick
    ON_MEASURE_PICK: 103,

    ON_VERSION_NO_MATCH: 200
};


CLOUD.LOADERROREVENTS = {

    LOAD_ERROR: 1000,

    LOAD_SCENE_ERROR: 1001,
    LOAD_MATERIAL_ERROR: 1002,
    LOAD_SYMBOL_ERROR: 1003,
    LOAD_OCTREEINNER_ERROR: 1004,
    LOAD_OCTREEOUTER_ERROR: 1005,
    LOAD_USERID_ERROR: 1006,
    LOAD_USERDATA_ERROR: 1007,
    LOAD_CAMERA_ERROR: 1008,
    LOAD_TEXTURE_ERROR: 1009,
    LOAD_MPK_ERROR: 1010,
    LOAD_IBLCONFIG_ERROR: 1011

},

/**
 * 渲染事件类型枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EnumRenderType = {
    RENDER: 0,
    RENDER_FINISHED:1,
    RESIZE:2
};

CLOUD.PrimitiveCount = {
    vertexCount: 0,
    triangleCount: 0
};

/**
 * 构件绕点旋转模式
 * @readonly
 * @enum {Number}
 */
CLOUD.RotatePivotMode = {
    /** 绕鼠标按下位置对应的构件旋转 */
    MOUSEPOINT: 0,
    /** 绕选中的构件旋转 */
    SELECTION: 1,
    /** 绕场景中心旋转 */
    CENTER: 2,
    /** 绕相机旋转 */
    CAMERA: 3
};

/**
 * 场景浏览模式
 * @readonly
 * @enum {string}
 */
CLOUD.EditorMode = {
    /** 自由旋转模式 */
    ORBIT: 'orbit',
    /** 单选模式 */
    PICK: 'pick',    
    /** 平移模式 */
    PAN: 'pan',
    /** 缩放模式 */
    ZOOM: 'zoom',
    /** 飞行模式 */
    FLY: 'fly',
    /** 行走模式 */
    WALK: 'walk',
};

CLOUD.EditToolMode = {
	/** 框选模式 */
    PICK_BY_RECT: 'pickByRect',
    /** 框选缩放模式 */
    ZOOM_BY_RECT: 'zoomByRect',
    /** 切面模式 */
    CLIP_BY_BOX: 'clipByBox',
    /** 切面补面模式 */
    CLIP_FILL: 'fillClip',
    /** 测量模式 */
    PICK_BY_MEASURE: 'pickByMeasure'
};

/**
 * 相机移动方向
 * @readonly
 * @enum {number}
 */
CLOUD.MoveDirection = {
    NONE: 0,
    UP: 0x0001,
    DOWN: 0x0002,
    LEFT: 0x0004,
    RIGHT: 0x0008,
    FORWARD: 0x0010,
    BACK: 0x0020
};

CLOUD.DrawingStyle = {
    SHADING: 0,
    BOARDLINE: 1,
    SHADINGWITHLINE: 2
};

/**
 * 通用函数
 *
 * @namespace CLOUD.Utils
 */
CLOUD.Utils = {
    /**
     * 根据数组构造THREE.Box3对象
     *
     * @param {Array} arr - 6个float值构成的数组，前3个值对应 min，后3个值对应 max
     * @param {THREE.Box3} [optionalbox] - 如果指定，则optionalbox即为返回值
     * @returns {THREE.Box3} 如果 arr 不是数组类型，则返回 null
     */
    box3FromArray: function (arr, optionalbox) {
        if (arr instanceof Array) {
            var bbox = optionalbox || new THREE.Box3();
            bbox.min.fromArray(arr, 0);
            bbox.max.fromArray(arr, 3);
            return bbox;
        }
        return null;
    },

    /**
     * 根据点数组计算包围盒
     *
     * @param {Array} points - 点数组，每项由3个float值构成
     * @returns {THREE.Box3} 点数组构成的包围盒
     */
    computeBBox: function (points) {
        var bbox = new THREE.Box3();
        var v1 = new THREE.Vector3();

        for (var ii = 0, len = points.length; ii < len; ++ii) {
            v1.fromArray(points[ii], 0);
            bbox.expandByPoint(v1);
        }

        return bbox;
    },

    /**
     * 合并包围盒
     *
     * @param {Array} boxs - 包围盒数组，每项可以为 Object 类型（{min : {x:x, y:y, z:z}, max : {x:x, y:y, z:z}}） 或者 THREE.Box3 类型
     *
     */
    mergeBBox: function (boxs) {

        if (boxs.length < 1) return null;

        var bBox = new THREE.Box3();
        var max = new THREE.Vector3();
        var min = new THREE.Vector3();
        var box = new THREE.Box3();

        for (var i = 0, len = boxs.length; i < len; i++) {
            max.set(boxs[i].max.x, boxs[i].max.y, boxs[i].max.z);
            min.set(boxs[i].min.x, boxs[i].min.y, boxs[i].min.z);
            box.set(min, max);
            bBox.union(box);
        }

        return bBox;
    },

    parseTransform: function (node, objJson, trf) {
        var updateMatrix = false;

        if (objJson.rotation) {
            node.rotation.fromArray(objJson.rotation);
            updateMatrix = true;
        }

        if (objJson.position) {
            node.position.fromArray(objJson.position);
            updateMatrix = true;
        }

        if (objJson.scale) {
            node.scale.fromArray(objJson.scale);
            updateMatrix = true;
        }

        if (objJson.quaternion) {
            node.quaternion.fromArray(objJson.quaternion);
            updateMatrix = true;
        }

        if (updateMatrix) {
            node.updateMatrix();
        }

        if (objJson.matrix) {
            node.matrix.fromArray(objJson.matrix);
        }

        if (trf) {
            var localTrf = node.matrix.clone();
            localTrf.multiplyMatrices(trf, node.matrix);
            node.matrix = localTrf;
        }

        node.matrixAutoUpdate = false;

        if (node.boundingBox !== undefined)
            node.boundingBox = CLOUD.Utils.box3FromArray(objJson.bbox);
    },

    isMobileDevice: function () {

        // userAgent 可能会被更改
        // var uA = navigator.userAgent;
        // if (uA.indexOf('Android') > -1 || uA.indexOf('iPhone') > -1 || uA.indexOf('Windows Phone')) {
        //     return true;
        // }
        return true;
        var platform = navigator.platform; // iPad, iPhone, Linux armv7, Win, Mac

        // 暂不考虑 Linux
        if (platform.indexOf('Win') !== 0 && platform.indexOf('Mac') !== 0) {

            return true;
        }

        return false;
    },

    isEmptyObject: function (obj) {

        if (!obj) {
            return true;
        }

        if (obj.length > 0) {
            return false;
        }

        if (obj.length === 0) {
            return true;
        }

        for (var key in obj) {

            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    },

    /**
     * 查找一个数落在数组中的位置
     *
     * @param {Array} arr - 数字数组(从小到大的排序)
     * @param {Number} val - 查找的数字
     * @returns {Number} 在数组中的索引
     */
    findRange: function (arr, val) {

        if (val < Math.min.apply(null, arr)) {
            return 0;
        }

        if (val > Math.max.apply(null, arr)) {
            return arr.length - 1;
        }

        var idx = 0;

        for (var i = 0, len = arr.length; i < len; ++i) {

            if (arr[i] > val) {
                idx = i - 1;
                break;
            }
        }

        return idx;
    }
};

CLOUD.DomUtil = {
    /**
     * split string on whitespace
     * @param {String} str
     * @returns {Array} words
     */
    splitStr : function(str) {
        return str.trim().split(/\s+/g);
    },

    /**
     * get the container offset relative to client
     * @param {object} domElement
     * @returns {object}
     */
    getContainerOffsetToClient : function(domElement) {
        var offsetObj;

        // 获取相对于视口(客户区域)的偏移量
        var getOffsetSum = function (ele) {
            var top = 0, left = 0;

            // 遍历父元素,获取相对与document的偏移量
            while (ele) {
                top += ele.offsetTop;
                left += ele.offsetLeft;
                ele = ele.offsetParent;
            }

            // 只处理document的滚动条(一般也用不着内部滚动条)
            var body = document.body,
                docElem = document.documentElement;

            //获取页面的scrollTop,scrollLeft(兼容性写法)
            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
                scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            // 减掉滚动距离，获得相对于客户区域的偏移量
            top -= scrollTop;
            left -= scrollLeft;

            return {
                top: top,
                left: left
            }
        };

        // 获取相对于视口(客户区域)的偏移量(viewpoint), 不加页面的滚动量(scroll)
        var getOffsetRect = function (ele) {
            // getBoundingClientRect返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
            //注意：IE、Firefox3+、Opera9.5、Chrome、Safari支持，在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。
            var box = ele.getBoundingClientRect();
            var body = document.body, docElem = document.documentElement;

            //获取页面的scrollTop,scrollLeft(兼容性写法)
            //var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
            //    scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            var clientTop = docElem.clientTop || body.clientTop,
                clientLeft = docElem.clientLeft || body.clientLeft;
            var top = box.top - clientTop,
                left = box.left - clientLeft;

            return {
                //Math.round 兼容火狐浏览器bug
                top: Math.round(top),
                left: Math.round(left)
            }
        };

        //获取元素相对于页面的偏移
        var getOffset = function (ele) {
            if (ele.getBoundingClientRect) {
                return getOffsetRect(ele);
            } else {
                return getOffsetSum(ele);
            }
        };

        if (domElement != document) {

            // 这种方式的目的是为了让外部直接传入clientX,clientY,然后计算出相对父容器的offsetX,offsetY值,
            // 即 offsetX = clientX - offsetV.left, offsetY = clientY - offsetV.top
            var offsetV = getOffset(domElement);

            // domElement.offsetLeft（offsetTop）是相对父容器的偏移量，如果用相对坐标表示，直接传回0
            //offset	: [ domElement.offsetLeft,  domElement.offsetTop ]
            offsetObj = {
                width : domElement.offsetWidth,
                height : domElement.offsetHeight,
                left : offsetV.left,
                top : offsetV.top
            }

        } else {

            offsetObj = {
                width : window.innerWidth,
                height : window.innerHeight,
                left : 0,
                top : 0
            }
        }

        return offsetObj;
    },

    /**
     * set css class name
     * @param {String} id
     * @param {String} cssName
     */
    setClassName : function(id, cssName) {
        var dom = document.getElementById(id);
        if (dom) {
            dom.className = cssName;
        }
    },

    /**
     * add css class name
     * @param {String} id
     * @param {String} cssName
     */
    addClassName : function(id, cssName) {
        var a, b, c;
        var i, j;
        var s = /\s+/;
        var dom = document.getElementById(id);
        if (dom) {

            b = dom;

            if (cssName && typeof cssName == "string") {
                a = cssName.split(s);

                // 如果节点是元素节点，则 nodeType 属性将返回 1。
                // 如果节点是属性节点，则 nodeType 属性将返回 2。
                if (b.nodeType === 1) {
                    if (!b.className && a.length === 1) {
                        b.className = cssName;
                    } else {
                        c = " " + b.className + " ";

                        for (i = 0, j = a.length; i < j; ++i) {
                            c.indexOf(" " + a[i] + " ") < 0 && (c += a[0] + " ");
                        }

                        b.className = String.trim(c);
                    }
                }
            }
        }
    },

    /**
     * remove css class name
     * @param {String} id
     * @param {String} cssName
     */
    removeClassName : function(id, className) {
        var a, b, c;
        var i, j;
        var s = /\s+/;
        var dom = document.getElementById(id);
        if (dom) {
            c = dom;

            if (className && typeof className == "string") {
                a = (className || "").split(s);

                if (c.nodeType === 1 && c.className) {
                    b = (" " + c.className + " ").replace(O, " ");
                    for (i = 0, j = a.length; i < j; i++) {
                        while (b.indexOf(" " + a[i] + " ") >= 0) {
                            b = b.replace(" " + a[i] + " ", " ");
                        }
                    }
                    c.className = className ? String.trim(b) : ""
                }
            }
        }
    },

    /**
     * show or hide element
     * @param {String} id
     * @param {Boolean} isShow
     */
    showOrHideElement : function(id, isShow) {
        var dom = document.getElementById(id);
        if (dom) {
            if (isShow) {
                dom.style.display = "";
            } else {
                dom.style.display = "none";
            }
        }
    },
    getStyleString: function
        (style) {

        var elements = [];

        for (var key in style) {

            var val = style[key];

            elements.push(key);
            elements.push(':');
            elements.push(val);
            elements.push('; ');
        }

        return elements.join('');
    },
    cloneStyle: function (style) {

        var clone = {};

        for (var key in style) {
            clone[key] = style[key];
        }

        return clone;
    },
    removeStyleAttribute: function (style, attrs) {

        if (!Array.isArray(attrs)) {
            attrs = [attrs];
        }

        attrs.forEach(function (key) {
            if (key in style) {
                delete style[key];
            }
        });
    },
    trimRight: function (text) {

        if (text.length === 0) {
            return "";
        }

        var lastNonSpace = text.length - 1;

        for (var i = lastNonSpace; i >= 0; --i) {
            if (text.charAt(i) !== ' ') {
                lastNonSpace = i;
                break;
            }
        }

        return text.substr(0, lastNonSpace + 1);
    },
    trimLeft: function (text) {

        if (text.length === 0) {
            return "";
        }

        var firstNonSpace = 0;

        for (var i = 0; i < text.length; ++i) {
            if (text.charAt(i) !== ' ') {
                firstNonSpace = i;
                break;
            }
        }

        return text.substr(firstNonSpace);
    },
    matchesSelector: function (domElem, selector) {

        if (domElem.matches) {
            return domElem.matches(selector);
        }

        if (domElem.matchesSelector) {
            return domElem.matchesSelector(selector);
        }

        if (domElem.webkitMatchesSelector) {
            return domElem.webkitMatchesSelector(selector);
        }

        if (domElem.msMatchesSelector) {
            return domElem.msMatchesSelector(selector);
        }

        if (domElem.mozMatchesSelector) {
            return domElem.mozMatchesSelector(selector);
        }

        if (domElem.oMatchesSelector) {
            return domElem.oMatchesSelector(selector);
        }

        if (domElem.querySelectorAll) {

            var matches = (domElem.document || domElem.ownerDocument).querySelectorAll(selector),
                i = 0;

            while (matches[i] && matches[i] !== element) i++;

            return matches[i] ? true : false;
        }

        return false;
    },
    toTranslate3d: function (x, y) {

        return 'translate3d(' + x + 'px,' + y + 'px,0)';
    },
    setCursorStyle: function (element, direction) {

        var cursor;

        switch (direction) {
            case 'n':
            case 's':
                cursor = 'ns-resize';
                break;
            case 'w':
            case 'e':
                cursor = 'ew-resize';
                break;
            case 'ne':
            case 'sw':
                cursor = 'nesw-resize';
                break;
            case 'nw':
            case 'se':
                cursor = 'nwse-resize';
                break;
        }

        element.style.cursor = cursor;
    }
};
CLOUD.GeomUtil = {

    // createInstancedBufferGeometry: function (mesh, objJSON) {
    //     var instances = objJSON.count;
    //
    //     // 转换buffer
    //     var geometry = new THREE.InstancedBufferGeometry();
    //     geometry.maxInstancedCount = instances;
    //     geometry.addAttribute('position', mesh.getAttribute("position"));
    //     geometry.setIndex(mesh.index);
    //
    //     var transformMatrixs = [];
    //     var userIds = [];
    //     var bboxs = [];
    //     var items = objJSON.items;
    //
    //     for (var key in items) {
    //         var item = items[key];
    //         transformMatrixs.push(item.worldMatrix);
    //         userIds.push(item.userId);
    //         bboxs.push(CLOUD.Utils.box3FromArray(item.bbox));
    //     }
    //
    //     var componentV1 = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, 1);
    //     for (var i = 0, ul = componentV1.count; i < ul; i++) {
    //         componentV1.setXYZW(i, transformMatrixs[i][0], transformMatrixs[i][1], transformMatrixs[i][2], transformMatrixs[i][3]);
    //     }
    //     geometry.addAttribute('componentV1', componentV1);
    //
    //     var componentV2 = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, 1);
    //     for (var i = 0, ul = componentV2.count; i < ul; i++) {
    //         componentV2.setXYZW(i, transformMatrixs[i][4], transformMatrixs[i][5], transformMatrixs[i][6], transformMatrixs[i][7]);
    //     }
    //     geometry.addAttribute('componentV2', componentV2);
    //
    //     var componentV3 = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, 1);
    //     for (var i = 0, ul = componentV3.count; i < ul; i++) {
    //         componentV3.setXYZW(i, transformMatrixs[i][8], transformMatrixs[i][9], transformMatrixs[i][10], transformMatrixs[i][11]);
    //     }
    //     geometry.addAttribute('componentV3', componentV3);
    //
    //     var componentV4 = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, 1);
    //     for (var i = 0, ul = componentV4.count; i < ul; i++) {
    //         componentV4.setXYZW(i, transformMatrixs[i][12], transformMatrixs[i][13], transformMatrixs[i][14], transformMatrixs[i][15]);
    //     }
    //     geometry.addAttribute('componentV4', componentV4);
    //
    //     // 计算法线，
    //     // 注意：在shader中处理时，应用于法线向量的变换矩阵是顶点变换矩阵的逆转置矩阵
    //     if (geometry.attributes.normal === undefined) {
    //         geometry.computeVertexNormals();
    //     }
    //
    //     geometry.boundingBox = CLOUD.Utils.box3FromArray(objJSON.bbox);
    //
    //     var extProperty = {
    //         bboxs: bboxs,
    //         userIds: userIds,
    //         transformMatrixs: transformMatrixs
    //     };
    //
    //     geometry.extProperty = extProperty;
    //
    //     return geometry;
    // },

    // parseNodeProperties: function (object, objJSON, nodeId, trf) {
    //
    //     //object.name = nodeId;
    //
    //     if (objJSON.userId)
    //         object.name = objJSON.userId;
    //     else
    //         object.name = nodeId;
    //
    //     CLOUD.Utils.parseTransform(object, objJSON, trf);
    // },

    // parseSceneNode: function (object, objJSON, modelManager, level) {
    //
    //     object.sceneId = objJSON.sceneId;
    //
    //     // set world bbox
    //     object.worldBoundingBox = object.boundingBox.clone();
    //     object.worldBoundingBox.applyMatrix4(modelManager.getGlobalTransform());
    //     object.level = objJSON.level;
    //     if (objJSON.order) {
    //         object.out = 1;
    //     }
    //
    //     if (CLOUD.GlobalData.ShowSubSceneBox) {
    //         var clr = 0xff;
    //         clr = clr << (level * 5);
    //
    //         var boxNode = new CLOUD.BBoxNode(object.boundingBox, clr);
    //         CLOUD.Utils.parseTransform(boxNode, objJSON);
    //         object.add(boxNode);
    //     }
    // },

    // parseCylinderNode: function () {
    //
    //     var reg = new RegExp("'", "g");
    //     var startPt = new THREE.Vector3();
    //     var endPt = new THREE.Vector3();
    //     var dir = new THREE.Vector3();
    //     var unitY = new THREE.Vector3(0, 1, 0);
    //
    //     return function (geometryNode, params) {
    //         if (params instanceof Object) {
    //
    //         }
    //         else {
    //             params = params.replace(reg, '"');
    //             params = JSON.parse(params);
    //         }
    //
    //
    //         startPt.fromArray(params.startPt);
    //         endPt.fromArray(params.endPt);
    //
    //         dir.subVectors(endPt, startPt);
    //
    //         var len = dir.length();
    //         dir.normalize();
    //
    //         var radius = params.radius;
    //         if (radius <= 1)
    //             radius = 100;
    //         geometryNode.scale.set(radius, len, radius);
    //         geometryNode.quaternion.setFromUnitVectors(unitY, dir);
    //         geometryNode.position.copy(startPt).addScaledVector(dir, len * 0.5);
    //         geometryNode.updateMatrix();
    //         geometryNode.matrixAutoUpdate = false;
    //     }
    //
    // }(),

    // parseBoxNode: function () {
    //
    //     var _boundingBox = new THREE.Box3();
    //     var _trf = new THREE.Matrix4();
    //
    //     return function (object, objJSON) {
    //         CLOUD.Utils.parseTransform(object, objJSON);
    //
    //         CLOUD.Utils.box3FromArray(objJSON.bbox, _boundingBox)
    //         var boxSize = _boundingBox.getSize();
    //         var center = _boundingBox.getCenter();
    //
    //         _trf.identity();
    //         _trf.scale(boxSize);
    //         _trf.setPosition(center);
    //
    //         object.matrix.multiply(_trf);
    //         object.matrixAutoUpdate = false;
    //     };
    //
    // }(),

    // parseHermitePipe: function (objJSON) {
    //     var reg = new RegExp("'", "g");
    //     var params = objJSON.params;
    //     params = params.replace(reg, '"');
    //     params = JSON.parse(params);
    //     var points = [];
    //
    //     for (var ii = 0, len = params.ctrlPts.length / 3; ii < len; ++ii) {
    //         var pt = new THREE.Vector3();
    //         pt.fromArray(params.ctrlPts, ii * 3);
    //         points.push(pt);
    //     }
    //
    //     var extrudePath = new THREE.CatmullRomCurve3(points);
    //     var tube = new THREE.TubeGeometry(extrudePath, 5, params.radius, 6, false);
    //     var bufferObj = new THREE.BufferGeometry();
    //     bufferObj.fromGeometry(tube);
    //
    //     return bufferObj;
    // },

    // parsePGeomNodeInstance: function (client, objJSON, matObj, trf, unloadable) {
    //
    //     var object = null;
    //
    //     if (objJSON.geomType == "pipe" || objJSON.geomType == "tube") {
    //
    //         var geometry = CLOUD.GeomUtil.UnitCylinderInstance;
    //         object = new THREE.Mesh(geometry, matObj);
    //
    //         if (!object) {
    //             return null;
    //         }
    //
    //
    //         CLOUD.GeomUtil.parseCylinderNode(object, objJSON.params);
    //
    //     }
    //     else if (objJSON.geomType == "box") {
    //
    //         var geometry = CLOUD.GeomUtil.UnitBoxInstance;
    //         object = new THREE.Mesh(geometry, matObj);
    //
    //         if (!object) {
    //             return null;
    //         }
    //         CLOUD.GeomUtil.parseBoxNode(object, objJSON);
    //
    //     }
    //     else if (objJSON.geomType == "hermitepipe") {
    //         var geometry = CLOUD.GeomUtil.parseHermitePipe(objJSON);
    //         object = new THREE.Mesh(geometry, matObj);
    //
    //         if (!object) {
    //             return null;
    //         }
    //     }
    //     else {
    //         CLOUD.Logger.log("unknonw geometry!");
    //         return object;
    //     }
    //
    //     if (trf) {
    //         var localTrf = trf.clone();
    //         localTrf.multiply(object.matrix);
    //         object.matrix = localTrf;
    //         object.matrixAutoUpdate = false;
    //     }
    //
    //     return object;
    // },

    EmptyGeometry: new THREE.Geometry(),
    UnitCylinderInstance: new THREE.CylinderBufferGeometry(1, 1, 1, 8, 1, false),
    UnitBoxInstance: new THREE.BoxBufferGeometry(1, 1, 1),

    initializeUnitInstances: function () {
        if (!CLOUD.GeomUtil.UnitCylinderInstance.boundingBox)
            CLOUD.GeomUtil.UnitCylinderInstance.computeBoundingBox();
        if (!CLOUD.GeomUtil.UnitBoxInstance.boundingBox)
            CLOUD.GeomUtil.UnitBoxInstance.computeBoundingBox();
    },

    destroyUnitInstances: function () {
        CLOUD.GeomUtil.UnitCylinderInstance.dispose();
        CLOUD.GeomUtil.UnitBoxInstance.dispose();
    },

    // 遍历父节点获得当前mesh的世界矩阵
    getWorldMatrixOfMesh: function (mesh) {

        var matList = [];
        var parent = mesh.parent;

        while (parent) {

            matList.push(parent.matrix);
            parent = parent.parent;
        }

        var matTmp = new THREE.Matrix4();

        if (matList.length > 0) {
            matTmp = matList[matList.length - 1];

            for (var i = matList.length - 2; i >= 0; --i) {
                matTmp.multiply(matList[i]);
            }
        }

        var objMatrixWorld = new THREE.Matrix4();
        objMatrixWorld.multiplyMatrices(matTmp, mesh.matrix);

        return objMatrixWorld;
    },

    getWorldPositionOfMesh: function (position, sceneMatrix) {

        if (!sceneMatrix) {
            sceneMatrix = new THREE.Matrix4();
        }

        var inverseScaleMatrix = new THREE.Matrix4();
        inverseScaleMatrix.getInverse(sceneMatrix);

        // 计算世界坐标下的位置
        var worldPosition = position.clone();
        worldPosition.applyMatrix4(inverseScaleMatrix);

        return worldPosition;
    },

    getBoundingBoxWorldOfMesh: function (mesh, sceneMatrix) {

        // 计算世界坐标下的包围盒
        var bBox = mesh.boundingBox;
        if (!bBox) {
            if (!mesh.geometry.boundingBox) {
                mesh.geometry.computeBoundingBox();
            }
            bBox = mesh.geometry.boundingBox;
        }

        var boundingBox = bBox.clone();

        boundingBox.applyMatrix4(mesh.matrixWorld);
        var inverseScaleMatrix = new THREE.Matrix4();
        inverseScaleMatrix.getInverse(sceneMatrix);
        boundingBox.applyMatrix4(inverseScaleMatrix);

        return boundingBox;
    }

};

CLOUD.MaterialUtil = {

    DefaultMaterial: new THREE.MeshPhongMaterial({color: 0x0000ff, side: THREE.DoubleSide}),

    createInstancePhongMaterial: function (matObj) {
        // 复制一份，不影响其他模型的使用
        // 不复制一份，有模型绘制不出
        var material = matObj.clone();
        // material.type = "phong_instanced";
        // material.uniforms = CLOUD.ShaderMaterial.ShaderLib.phong_cust_clip.uniforms;
        // material.vertexShader = "#define USE_CUST_INSTANCED \n" + CLOUD.ShaderMaterial.ShaderLib.phong_cust_clip.vertexShader;
        // material.fragmentShader = "#define USE_CUST_INSTANCED \n" + CLOUD.ShaderMaterial.ShaderLib.phong_cust_clip.fragmentShader;
        return material;
    },

    updateBasicMaterial: function (material, instanced) {

        // if (instanced) {
        //     material.vertexShader = "#define USE_CUST_INSTANCED \n" + CLOUD.ShaderMaterial.ShaderLib.base_cust_clip.vertexShader;
        //     material.fragmentShader = "#define USE_CUST_INSTANCED \n" + CLOUD.ShaderMaterial.ShaderLib.base_cust_clip.fragmentShader;
        // } else {
        //     material.vertexShader = CLOUD.ShaderMaterial.ShaderLib.base_cust_clip.vertexShader;
        //     material.fragmentShader = CLOUD.ShaderMaterial.ShaderLib.base_cust_clip.fragmentShader;
        // }

        material.needsUpdate = true;
    },

    setMatrixUniform: function(transform) {
        CLOUD.ShaderMaterial.ShaderLib.base_cust_clip.uniforms.transformMatrix.value = transform;
    },

    createPhongMaterial: function(params){
        // var material = new THREE.MeshPhongMaterial(obj);
        // // material.type = 'phong_cust_clip';
        // // material.uniforms = CLOUD.ShaderMaterial.ShaderLib.phong_cust_clip.uniforms;
        // // material.vertexShader = CLOUD.ShaderMaterial.ShaderLib.phong_cust_clip.vertexShader;
        // // material.fragmentShader = CLOUD.ShaderMaterial.ShaderLib.phong_cust_clip.fragmentShader;
        // return material;

        var material = new THREE.MeshPhongMaterial(params);
        material.type = 'FillFacePhong';
        material.uniforms = THREE.UniformsUtils.merge( [THREE.ShaderLib.fillFacePhong.uniforms]);
        material.vertexShader = THREE.ShaderLib.fillFacePhong.vertexShader;
        material.fragmentShader = THREE.ShaderLib.fillFacePhong.fragmentShader;
        material.side = THREE.DoubleSide;

        return material;
    },

    createStandardMaterial: function(params) {

        var material = new THREE.MeshStandardMaterial(params);
        material.metalness = 0.0;
        return material;

    },

    createHighlightMaterial: function () {
        return this.createStandardMaterial(CLOUD.GlobalData.SelectionColor);
    },

    getMaterialParameters: function(material) {

        var materialParameters = {};
        
        if (material.hasOwnProperty('color')) {
            materialParameters.color = material.color;
        }

        if (material.hasOwnProperty('opacity')) {
            materialParameters.opacity = material.opacity;

            if (material.opacity < 1.0) {
                materialParameters.transparent = true;
            }
        }

        if (material.hasOwnProperty('side')) {
            materialParameters.side = material.side;
        }

        if (material.hasOwnProperty('emissive')) {
            materialParameters.emissive = material.emissive;
        }

        if (material.hasOwnProperty('specular')) {
            materialParameters.specular = material.specular;
        }

        if (material.hasOwnProperty('shininess')) {
            materialParameters.shininess = material.shininess;
        }

        if (material.hasOwnProperty('map')) {
            materialParameters.map = material.map;
        }

        if (material.hasOwnProperty('iblProbe')) {
            materialParameters.iblProbe = material.iblProbe;
        }

        return materialParameters;

    },

    nextHighestPowerOfTwo: function (x) {
        --x;

        for (var i = 1; i < 32; i <<= 1) {
            x = x | x >> i;
        }

        return x + 1;
    },

    ensurePowerOfTwo: function (image) {

        if (!THREE.Math.isPowerOfTwo(image.width) || !THREE.Math.isPowerOfTwo(image.height)) {
            var canvas = document.createElement("canvas");
            canvas.width = CLOUD.MaterialUtil.nextHighestPowerOfTwo(image.width);
            canvas.height = CLOUD.MaterialUtil.nextHighestPowerOfTwo(image.height);

            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            return canvas;
        }

        return image;
    }
};
CLOUD.CameraInfo = function (name, position, target, up, version) {
    this.name = name;
    this.position = position;
    this.target = target;
    this.up = up;

    // 0：老版本, 1: 新版版
    this.version = (version === undefined) ? 1 : version; // 用于兼容处理
};

CLOUD.CameraUtil = {

    // 创建相机信息
    createCameraInfo: function (cameraControl) {
        var camera = cameraControl.camera;
        var camInfo = new CameraInfo(cameraControl.getCameraName(), camera.position, camera.target, camera.up);
        return JSON.stringify(camInfo);
    },

    // camera = {"position":"26513.603437903, -14576.4810728955, 15107.6582255056","direction":"-220.050259546712, 169.277369901229, -125.801809656091","up":"0, 0, 304.8"}
    transformCamera: function (camera, scene) {

        var position = new THREE.Vector3();

        var str2float = function (strarr) {
            return [parseFloat(strarr[0]), parseFloat(strarr[1]), parseFloat(strarr[2])];
        };

        position.fromArray(str2float(camera.position.split(",")));
        var dir = new THREE.Vector3();
        dir.fromArray(str2float(camera.direction.split(",")));
        var up = new THREE.Vector3();
        up.fromArray(str2float(camera.up.split(",")));

        var target = new THREE.Vector3();
        target.addVectors(position, dir);

        position.applyMatrix4(scene.rootNode.matrix);
        target.applyMatrix4(scene.rootNode.matrix);

        var rotMat = new THREE.Matrix4();
        rotMat.makeRotationFromEuler(scene.rootNode.rotation);
        up.applyMatrix4(rotMat);
        up.normalize();

        return new CLOUD.CameraInfo(camera.name, position, target, up);
    },

    parseCameraInfo: function (jsonStr) {
        if (!jsonStr)
            return null;

        var jsonObj = JSON.parse(jsonStr);

        if (!jsonObj.hasOwnProperty("position") ||
            !jsonObj.hasOwnProperty("target") ||
            !jsonObj.hasOwnProperty("up"))
            return null;

        // 老版数据没有name属性
        var name = jsonObj.name || 'persp';

        var position = new THREE.Vector3();
        position.x = jsonObj.position.x;
        position.y = jsonObj.position.y;
        position.z = jsonObj.position.z;

        var target = new THREE.Vector3();
        target.x = jsonObj.target.x;
        target.y = jsonObj.target.y;
        target.z = jsonObj.target.z;

        var up = new THREE.Vector3();
        up.x = jsonObj.up.x;
        up.y = jsonObj.up.y;
        up.z = jsonObj.up.z;

        // 老版本数据 jsonObj.version === undefined
        var version = (jsonObj.version === undefined) ? 0 : jsonObj.version; // 注意：这里和构造函数的默认值不同

        return new CLOUD.CameraInfo(name, position, target, up, version);
    },

    /**
     * 局部坐标(相对于canvas)转正规化坐标
     *
     * @param {object} point - 局部坐标(相对于canvas) {x:0, y:0, z:0}
     * @param {Number} width - canvas区域宽度
     * @param {Number} height - canvas区域高度
     * @return {object} 正规化坐标[-1, 1] {x:0, y:0, z:0}
     */
    canvasToNormalized: function (point, width, height) {

        var result = {x: 0, y: 0, z: 0};

        result.x = point.x / width * 2 - 1;
        result.y = -point.y / height * 2 + 1;
        result.z = point.z || 0;

        return result;
    },

    /**
     * 正规化坐标转局部坐标(相对于canvas)
     *
     * @param {object} point - 正规化坐标[-1, 1] {x:0, y:0, z:0}
     * @param {Number} width - canvas区域宽度
     * @param {Number} height - canvas区域高度
     * @return {object} 局部坐标(相对于canvas) {x:0, y:0, z:0}
     */
    normalizedToCanvas: function (point, width, height) {

        var result = {x: 0, y: 0, z: 0};

        result.x = Math.floor(0.5 * (point.x + 1) * width + 0.5);
        result.y = Math.floor(-0.5 * (point.y - 1) * height + 0.5);
        result.z = point.z || 0;

        return result;
    },

    /**
     * 绘图空间坐标(场景变换后)转客户坐标(相对于canvas)
     *
     * @param {object} camera - 相机对象
     * @param {object} point - 世界坐标(场景变换后) {x:0, y:0, z:0}
     * @param {Number} width - canvas区域宽度
     * @param {Number} height - canvas区域高度
     * @return {object} 客户坐标(相对于canvas) {x:0, y:0, z:0}
     */
    drawingToCanvas: function (camera, point, width, height) {

        var normalizedPoint = new THREE.Vector3(point.x, point.y, point.z);
        normalizedPoint.project(camera);

        // 裁剪不在相机范围的值
        if (Math.abs(normalizedPoint.z) > 1) {
            CLOUD.Logger.log("CameraUtil.drawingToCanvas, The point is not in the camera frustum!");
            return null;
        }

        var result = this.normalizedToCanvas(normalizedPoint, width, height);

        return result;
    },

    /**
     * 客户坐标(相对于canvas)转绘图空间(场景变换后)
     *
     * @param {object} camera - 相机对象
     * @param {object} point - 客户坐标((相对于canvas) {x:0, y:0, z:0}
     * @param {Number} width - canvas区域宽度
     * @param {Number} height - canvas区域高度
     * @return {object} 绘图空间坐标(场景变换后) {x:0, y:0, z:0}
     */
    canvasToDrawing: function (camera, point, width, height) {

        // 转正规化坐标
        var normalizedPoint = this.canvasToNormalized(point, width, height);

        var result = new THREE.Vector3(normalizedPoint.x, normalizedPoint.y, normalizedPoint.z);
        result.unproject(camera);

        return {x: result.x, y: result.y, z: result.z};
    },

    intersectBoxByRay: function (ray, box) {

        var tmin, tmax, tymin, tymax, tzmin, tzmax;

        var invdirx = 1 / ray.direction.x,
            invdiry = 1 / ray.direction.y,
            invdirz = 1 / ray.direction.z;

        var origin = ray.origin;

        if (invdirx >= 0) {

            tmin = (box.min.x - origin.x) * invdirx;
            tmax = (box.max.x - origin.x) * invdirx;

        } else {

            tmin = (box.max.x - origin.x) * invdirx;
            tmax = (box.min.x - origin.x) * invdirx;

        }

        if (invdiry >= 0) {

            tymin = (box.min.y - origin.y) * invdiry;
            tymax = (box.max.y - origin.y) * invdiry;

        } else {

            tymin = (box.max.y - origin.y) * invdiry;
            tymax = (box.min.y - origin.y) * invdiry;

        }

        if ((tmin > tymax) || (tymin > tmax)) return null;

        // These lines also handle the case where tmin or tmax is NaN
        // (result of 0 * Infinity). x !== x returns true if x is NaN

        if (tymin > tmin || tmin !== tmin) tmin = tymin;

        if (tymax < tmax || tmax !== tmax) tmax = tymax;

        if (invdirz >= 0) {

            tzmin = (box.min.z - origin.z) * invdirz;
            tzmax = (box.max.z - origin.z) * invdirz;

        } else {

            tzmin = (box.max.z - origin.z) * invdirz;
            tzmax = (box.min.z - origin.z) * invdirz;

        }

        if ((tmin > tzmax) || (tzmin > tmax)) return null;

        if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

        if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

        //return point closest to the ray (positive side)

        if (tmax < 0) return null;

        return tmin >= 0 ? tmin : tmax;

    },

    intersectObjectWithFrustum: (function() {

        var box = new THREE.Box3();

        return function (object, frustum) {

            if (object.boundingBox && !(object instanceof THREE.Mesh)) {

                box.copy(object.boundingBox);

            } else {

                var geometry = object.geometry;

                if (geometry.boundingBox === null) {
                    geometry.computeBoundingBox();
                }

                box.copy(geometry.boundingBox);
            }

            box.applyMatrix4(object.matrixWorld);

            return frustum.intersectsBox(box);
        }
    })()

};

CLOUD.FilterUtil = {
	removeSelectionsFromIsolateList: function(type, viewer) {
		var filter = viewer.getFilter();
		var selection = viewer.getSelection();
		
		filter.removeFromIsolateList(type, selection);
	},
	
	/**
     *  根据选择集进行隔离（隐藏或者半透明选择集外的构件）
     *
     * @param {Number} type - 隔离状态
     */
    isolateSelections: function (type, viewer) {
        var filter = viewer.getFilter();
		var selection = viewer.getSelection();
		
		filter._filterImpl.addToIsolateList(type, selection);
    },
	
	hideSelections: function (viewer) {
		var filter = viewer.getFilter();
		var selection = viewer.getSelection();
		
		filter.addToIdList(CLOUD.EnumIdBasedType.HIDDEN, selection);
	},
	
	hideUnselections: function (viewer) {		
		var filter = viewer.getFilter();
		var selection = viewer.getSelection();
		
		filter.addToIdList(CLOUD.EnumIdBasedType.VISIBLE, selection);
	},
	
	makeSelectedTranslucent: function (viewer) {
		var filter = viewer.getFilter();
		var selection = viewer.getSelection();
		
		filter.makeTranslucentByIds(selection);
	},
	
	makeSelectedOthersTranslucent: function (viewer) {
		var filter = viewer.getFilter();
		var selection = viewer.getSelection();
		
		filter.makeTranslucentOthersByIds(selection);
	}
};

CLOUD.Logger = {

    log: function () {

        if (CLOUD.GlobalData.DEBUG) {
            console.log.apply(console, arguments);
        }
    },

    debug: function () {

        if (CLOUD.GlobalData.DEBUG) {
            console.debug.apply(console, arguments);
        }
    },

    warn: function () {

        if (CLOUD.GlobalData.DEBUG) {
            console.warn.apply(console, arguments);
        }
    },

    error: function () {

        if (CLOUD.GlobalData.DEBUG) {
            console.error.apply(console, arguments);
        }
    },

    time:function () {

        if (CLOUD.GlobalData.DEBUG) {
            console.time.apply(console, arguments);
        }
    },

    timeEnd:function () {

        if (CLOUD.GlobalData.DEBUG) {
            console.timeEnd.apply(console, arguments);
        }
    }

};


CLOUD.UIHelper = {

    debugInfoDiv: null,
    lastDebugInfoDivShow: null,

    showPickedInformation: function (evt) {

        var divWidth = 340, divHeight = 320;
        var scope = this;

        function hideDiv() {

            var info = scope.debugInfoDiv;

            if (info && info.style.display !== "none") {
                info.style.display = "none";
                //info.parentNode.removeChild(info);

                if (scope.lastDebugInfoDivShow) {
                    info.removeEventListener('dblclick', hideDiv, false);
                    scope.lastDebugInfoDivShow = false;
                }
            }
        }

        function adjustLocation(div, posX, posY) {

            if (!div) return;

            if (div.style.display != "none") {
                var oLeft, oTop;

                var tmpX = posX + divWidth;
                var tmpY = posY + divHeight;

                if (posX !== undefined && posY !== undefined) {
                    if (window.innerWidth) {

                        if (tmpX > window.innerWidth) {
                            oLeft = window.pageXOffset + (posX - divWidth) + "px";
                        } else {
                            oLeft = window.pageXOffset + posX + "px";
                        }

                        if (tmpY > window.innerHeight) {
                            oTop = window.pageYOffset + (posY - divHeight) + "px";
                        } else {
                            oTop = window.pageYOffset + posY + "px";
                        }

                        //oLeft = window.pageXOffset + posX + "px";
                        //oTop = window.pageYOffset + posY + "px";
                    } else {
                        var dde = document.documentElement;
                        oLeft = dde.scrollLeft + posX + "px";
                        oTop = dde.scrollTop + posY + "px";
                    }
                } else {
                    // 居中
                    if (window.innerWidth) {
                        oLeft = window.pageXOffset + (window.innerWidth - divWidth) / 2 + "px";
                        oTop = window.pageYOffset + (window.innerHeight - divHeight) / 2 + "px";
                    } else {
                        var dde = document.documentElement;
                        oLeft = dde.scrollLeft + (dde.offsetWidth - divWidth) / 2 + "px";
                        oTop = dde.scrollTop + (dde.offsetHeight - divHeight) / 2 + "px";
                    }
                }

                div.style.left = oLeft;
                div.style.top = oTop;
            }
        }

        if (!evt || !evt.intersectInfo) {
            hideDiv();
            return;
        }

        var intersect = evt.intersectInfo;

        var cx = evt.canvasPos.x, cy = evt.canvasPos.y;

        if (!this.debugInfoDiv) {
            this.debugInfoDiv = document.createElement("div");
            this.debugInfoDiv.id = "debugPickedInfo";
            this.debugInfoDiv.style.display = "block";
            this.debugInfoDiv.style.position = "absolute";
            this.debugInfoDiv.style.width = divWidth + "px";
            this.debugInfoDiv.style.height = divHeight + "px";
            this.debugInfoDiv.style.backgroundColor = "#ffffdd";
            this.debugInfoDiv.style.borderWidth = "2px";
            this.debugInfoDiv.style.borderStyle = "solid";
            this.debugInfoDiv.style.opacity = "0.8";

            document.body.appendChild(this.debugInfoDiv);
        }

        this.debugInfoDiv.style.display = "";

        // 支持面板一直显示
        if (!this.lastDebugInfoDivShow) {
            this.lastDebugInfoDivShow = true;
            this.debugInfoDiv.addEventListener('dblclick', hideDiv, false);
        }

        var axisGridInfo = intersect.axisGridInfo;
        var position = intersect.worldPosition;

        // 加些样式
        var html = "";
        html += "<span>&#9830;&nbsp;&nbsp;Base Information</span><ul style='width:340px;list-style:none'>";
        html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;border-bottom: 1px solid #ccc;float:left;width:80px;height:66px;text-align:left;line-height:66px'>ID</li>";
        html += "<li style='border:1px solid #ccc;float:left;width:200px;height:66px;text-align:left;'>" + intersect.selectedObjectId + "</li>";
        html += "</ul>";

        html += "</br><span>&#9830;&nbsp;&nbsp;Position</span><ul style='width:340px;list-style:none'>";
        html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:80px;height:33px;text-align:left;line-height:33px'>X</li>";
        html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:200px;height:33px;text-align:left;line-height:33px;border-right: 1px solid #ccc'>" + position.x + "</li>";
        html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:80px;height:33px;text-align:left;line-height:33px'>Y</li>";
        html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:200px;height:33px;text-align:left;line-height:33px;border-right: 1px solid #ccc'>" + position.y + "</li>";
        html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:80px;height:33px;text-align:left;line-height:33px;border-bottom: 1px solid #ccc'>Z</li>";
        html += "<li style='border:1px solid #ccc;float:left;width:200px;height:33px;text-align:left;line-height:33px'>" + position.z + "</li>";
        html += "</ul>";

        if (axisGridInfo) {

            html += "</br><span>&#9830;&nbsp;&nbsp;Axis Grid Information</span><ul style='width:340px;list-style:none'>";
            html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:80px;height:33px;text-align:left;line-height:33px'>distanceX</li>";
            html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:200px;height:33px;text-align:left;line-height:33px;border-right: 1px solid #ccc'>(" + axisGridInfo.numeralName + ", " + axisGridInfo.offsetX + ")</li>";
            html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:80px;height:33px;text-align:left;line-height:33px;border-bottom: 1px solid #ccc'>distanceY</li>";
            html += "<li style='border:1px solid #ccc;float:left;width:200px;height:33px;text-align:left;line-height:33px'>(" + axisGridInfo.abcName + ", " + axisGridInfo.offsetY + ")</li>";
            html += "</ul>";
        } else {

            html += "</br><span>&#9830;&nbsp;&nbsp;Axis Grid Information</span><ul style='width:340px;list-style:none'>";
            html += "<li style='border-left:1px solid #ccc;border-top:1px solid #ccc;float:left;width:80px;height:33px;text-align:left;line-height:33px;border-bottom: 1px solid #ccc'>message</li>";
            html += "<li style='border:1px solid #ccc;float:left;width:200px;height:33px;text-align:left;line-height:33px'><span style='color: red'> not exist axis grid!!!</span></li>";
            html += "</ul>";
        }

        this.debugInfoDiv.innerHTML = html + "<br /><br />";

        adjustLocation(this.debugInfoDiv, cx, cy);
    }
};
CLOUD.OctantNeighborUtil = function (camera, root) {
    this.camera = camera;
    this.root = root;           // octree root node

    // flag to search neighbor octant of the direct neighbor octant
    this.searchNeighborOfNeighbor = false;
    // flag to get the child octant of neighbor octant if the neighbor is not leaf node
    this.containChildOfNeighbor = false;

    // octant list which contains camera, from leaf to root
    this.containedOctants = [];
    
    // nIndex index in containedOctants
    this.father = function (nIndex) {
        nIndex++;
        if (nIndex < this.containedOctants.length) {
            return this.containedOctants[nIndex];
        }
        
        return null;
    };

    this.adjFace = function (I, sonType) {
        return faceAdjTable[I*8+sonType];
    };

    this.adjEdge = function (I, sonType) {
        return edgeAdjTable[I*8+sonType];
    };

    this.adjVertex = function (I, sonType) {
        return I == sonType;
    };

    this.refelectFace = function (I, sonType) {
        return faceRefTable[I*8+sonType];
    };

    this.refelectEdge = function (I, sonType) {
        return edgeRefTable[I*8+sonType];
    };

    this.refelectVertex = function (I, sonType) {
        return this.OctType.MAXTYPEID - sonType;
    };

    this.common_face_edge = function (I, sonType) {
        return edgeOfComFaceTable[I*8+sonType];
    };

    this.common_face_vertex = function (I, sonType) {
        return vertOfComFaceTable[I*8+sonType];
    };

    this.common_edge = function (I, sonType) {
        return commonEdgeTable[I*8+sonType];
    };
    
    // get child node of 'octant' in direction 'sonType'
    this.son= function (octant, sonType) {
        var i;
        var length = octant.childOctants.length;
        for (i = 0; i < length; i++) {
            if (octant.childOctants[i].octType == sonType) {
                return octant.childOctants[i];
            }
        }

        return null;
    };

    // direction
    this.FaceType = {
        L : 0,
        R : 1,
        D : 2,
        U : 3,
        B : 4,
        F : 5,
        UNKNOWN : 6
    };

    this.EdgeType = {
        LD : 0,
        LU : 1,
        LB : 2,
        LF : 3,
        RD : 4,
        RU : 5,
        RB : 6,
        RF : 7,
        DB : 8,
        DF : 9,
        UB : 10,
        UF : 11,
        UNKNOWN : 12
    };

    this.OctType = { // also VertexType
        RUF : 0,
        LUF : 1,
        RDF : 2,
        LDF : 3,
        RUB : 4,
        LUB : 5,
        RDB : 6,
        LDB : 7,
        MAXTYPEID : 7
    };


//
// ADJ table
//
// Face table
//                    RUF    LUF    RDF    LDF    RUB    LUB    RDB    LDB
    var faceAdjTable = [ false, true,  false,  true,  false, true,  false, true,  // L
        true,  false, true,   false, true,  false, true,  false, // R
        false, false, true,   true,  false, false, true,  true,  // D
        true,  true,  false,  false, true,  true,  false, false, // U
        false, false, false,  false, true,  true,  true,  true,  // B
        true,  true,  true,   true,  false, false, false, false];// F

// Edge table
    var edgeAdjTable = [ false, false, false,  true,  false, false, false, true,  // LD
        false, true,  false,  false, false, true,  false, false, // LU
        false, false, false,  false, false, true,  false, true,  // LB
        false, true,  false,  true,  false, false, false, false, // LF
        false, false, true,   false, false, false, true,  false, // RD
        true,  false, false,  false, true,  false, false, false, // RU
        false, false, false,  false, true,  false, true,  false, // RB
        true,  false, true,   false, false, false, false, false, // RF
        false, false, false,  false, false, false, true,  true,  // DB
        false, false, true,   true,  false, false, false, false, // DF
        false, false, false,  false, true,  true,  false, false, // UB
        true,  true,  false,  false, false, false, false, false];// UF

//
// REFLECT table
//
// Face table
//                   RUF LUF RDF LDF RUB LUB RDB LDB
    var faceRefTable = [  1,  0,  3,  2,  5,  4,  7,  6,   // L
        1,  0,  3,  2,  5,  4,  7,  6,   // R
        2,  3,  0,  1,  6,  7,  4,  5,   // D
        2,  3,  0,  1,  6,  7,  4,  5,   // U
        4,  5,  6,  7,  0,  1,  2,  3,   // B
        4,  5,  6,  7,  0,  1,  2,  3];  // F

// Edge table
//                   0   1   2   3   4   5   6   7
//                  RUF LUF RDF LDF RUB LUB RDB LDB
    var edgeRefTable = [ 3,  2,  1,  0,  7,  6,  5,  4,  // LD  0
        3,  2,  1,  0,  7,  6,  5,  4,  // LU  1
        5,  4,  7,  6,  1,  0,  3,  2,  // LB  2
        5,  4,  7,  6,  1,  0,  3,  2,  // LF  3
        3,  2,  1,  0,  7,  6,  5,  4,  // RD  4
        3,  2,  1,  0,  7,  6,  5,  4,  // RU  5
        5,  4,  7,  6,  1,  0,  3,  2,  // RB  6
        5,  4,  7,  6,  1,  0,  3,  2,  // RF  7
        6,  7,  4,  5,  2,  3,  0,  1,  // DB  8
        6,  7,  4,  5,  2,  3,  0,  1,  // DF  9
        6,  7,  4,  5,  2,  3,  0,  1,  // UB  10
        6,  7,  4,  5,  2,  3,  0,  1]; // UF  11

// Common Face table
//
// Edge table
//                        RUF LUF RDF LDF RUB LUB RDB LDB
    var edgeOfComFaceTable = [ 6,  0,  2,  6,  6,  0,  2,  6,  // LD  0
        3,  6,  6,  0,  3,  6,  6,  0,  // LU  1
        6,  0,  6,  0,  4,  6,  4,  6,  // LB  2
        5,  6,  5,  6,  6,  0,  6,  0,  // LF  3
        1,  6,  6,  2,  1,  6,  6,  2,  // RD  4
        6,  3,  1,  6,  6,  3,  1,  6,  // RU  5
        1,  6,  1,  6,  6,  4,  6,  4,  // RB  6
        6,  5,  6,  5,  1,  6,  1,  6,  // RF  7
        6,  6,  2,  2,  4,  4,  6,  6,  // DB  8
        5,  5,  6,  6,  6,  6,  2,  2,  // DF  9
        3,  3,  6,  6,  6,  6,  4,  4,  // UB  10
        6,  6,  5,  5,  3,  3,  6,  6]; // UF  11

// Vertex table
//                        RUF LUF RDF LDF RUB LUB RDB LDB
    var vertOfComFaceTable = [ 6,  6,  6,  5,  6,  3,  1,  6,   // RUF
        6,  6,  5,  6,  3,  6,  6,  0,   // LUF
        6,  5,  6,  6,  1,  6,  6,  2,   // RDF
        5,  6,  6,  6,  6,  0,  2,  6,   // LDF
        6,  3,  1,  6,  6,  6,  6,  4,   // RUB
        3,  6,  6,  0,  6,  6,  4,  6,   // LUB
        1,  6,  6,  2,  6,  4,  6,  6,   // RDB
        6,  0,  2,  6,  1,  6,  6,  6];  // LDB

// Common Edge table
//                      0   1   2   3   4   5   6   7
//                     RUF LUF RDF LDF RUB LUB RDB LDB
    var commonEdgeTable = [ 12, 11, 7,  12, 5,  12, 12, 12,  // RUF
        11, 12, 12, 3,  12, 1,  12, 12,  // LUF
        7,  12, 12, 9,  12, 12, 4,  12,  // RDF
        12, 3,  9,  12, 12, 12, 12, 0,   // LDF
        5,  12, 12, 12, 12, 10, 6,  12,  // RUB
        12, 1,  12, 12, 10, 12, 12, 2,   // LUB
        12, 12, 4,  12, 6,  12, 12, 8,   // RDB
        12, 12, 12, 0,  12, 2,  8,  12]; // LDB
};

// Locate a face-neighbor of node P, of size greater than
// or equal to P, in direction I. If such a node does not
// exist, then return NIL.
CLOUD.OctantNeighborUtil.prototype.findFaceNeighborImpl
    = function(nIndex, I) {

    var ret = {node: null, cont: false};

    var ancestors = this.containedOctants;
    var P = ancestors[nIndex];
    
    if (nIndex >= ancestors.length) {
        return ret;
    }

    if (this.father(nIndex) && this.adjFace(I, P.octType)) {
        ret = this.findFaceNeighborImpl(nIndex+1, I);
    } else {
        ret.node = this.father(nIndex);
        ret.cont = true;
    }

    if (ret.cont && ret.node !== null && ret.node.childOctants.length > 0) {
        // get child node
        var Q = this.son(ret.node, this.refelectFace(I, P.octType));
        if (Q) {
            return {node: Q, cont: true};
        }
        else {
            return {node: ret.node, cont: false};
        }
    }

    return ret;
};

CLOUD.OctantNeighborUtil.prototype.findFaceNeighbor
    = function(nIndex, I) {

    var ret = this.findFaceNeighborImpl(nIndex, I);

    if (ret.node && !ret.node.isRoot()) {
        return ret.node;
    }

    return null;
};

// Locate an edge-neighbor of node P, of size greater 
// than or equal to P, in direction I. If such a node
// does not exist, then return NIL.
CLOUD.OctantNeighborUtil.prototype.findEdgeNeighborImpl
    = function(nIndex, I) {

    var ret = {node: null, cont: false};

    var ancestors = this.containedOctants;
    var P = ancestors[nIndex];

    if (nIndex >= ancestors.length) {
        return ret;
    }

    if (this.father(nIndex)) {
        if (this.adjEdge(I, P.octType)) {
            ret = this.findEdgeNeighborImpl(nIndex+1, I);
        } else if (this.common_face_edge(I, P.octType) !== this.FaceType.UNKNOWN) {
            ret = this.findFaceNeighborImpl(nIndex+1, this.common_face_edge(I, P.octType));
        } else {
            ret.node = this.father(nIndex);
            ret.cont = true;
        }
    }

    if (ret.cont && ret.node !== null && ret.node.childOctants.length > 0) {
        // get child node
        var Q = this.son(ret.node, this.refelectEdge(I, P.octType));
        if (Q) {
            return {node: Q, cont: true};
        }
        else {
            return {node: ret.node, cont: false};
        }
    }

    return ret;
};

CLOUD.OctantNeighborUtil.prototype.findEdgeNeighbor
    = function(nIndex, I) {

    var ret = this.findEdgeNeighborImpl(nIndex, I);

    if (ret.node && !ret.node.isRoot()) {
        return ret.node;
    }

    return null;
};

// Locate a vertex-neighbor of node P, of size greater than
// or equal to P, in direction I. If such a node does not 
// exist, then return NIL.
CLOUD.OctantNeighborUtil.prototype.findVertexNeighborImpl
    = function(nIndex, I) {

    var ret = {node: null, cont: false};
    var ancestors = this.containedOctants;
    var P = ancestors[nIndex];

    if (nIndex >= ancestors.length) {
        return ret;
    }

    if (this.father(nIndex)) {
        if (this.adjVertex(I, P.octType)) {
            ret = this.findVertexNeighborImpl(nIndex+1, I);
        } else if (this.common_edge(I, P.octType) !== this.EdgeType.UNKNOWN) {
            ret = this.findVertexNeighborImpl(nIndex+1, this.common_edge(I, P.octType));
        } else if (this.common_face_vertex(I, P.octType) != this.FaceType.UNKNOWN) {
            ret = this.findVertexNeighborImpl(nIndex+1, this.common_face_vertex(I, P.octType));
        } else {
            ret.node = this.father(nIndex);
            ret.cont = true;
        }
    }

    if (ret.cont && ret.node !== null && ret.node.childOctants.length > 0) {
        // get child node
        var Q = this.son(ret.node, this.refelectVertex(I, P.octType));
        if (Q) {
            return {node: Q, cont: true};
        }
        else {
            return {node: ret.node, cont: false};
        }
    }

    return ret;
};

CLOUD.OctantNeighborUtil.prototype.findVertexNeighbor
    = function(nIndex, I) {

    var ret = this.findVertexNeighborImpl(nIndex, I);

    if (ret.node && !ret.node.isRoot()) {
        return ret.node;
    }

    return null;
};

// 查找包含照相机的八叉树最深层叶子节点，如果该叶子节点为空，则使用父节点或
// 中央点离照相机最近的八叉树节点
// 结果是从叶子节点到父节点，一直到根节点的数组，保持在containedOctants中
CLOUD.OctantNeighborUtil.prototype.findContainNode
    = function (octant) {
    var node;
    var camera = this.camera;
    var cameraPos = camera.position;

    var cameraOutsideOctant = cameraPos.x < octant.min.x || cameraPos.x > octant.max.x ||
        cameraPos.y < octant.min.y || cameraPos.y > octant.max.y ||
        cameraPos.z < octant.min.z || cameraPos.z > octant.max.z;

    if (!cameraOutsideOctant)
    {
        //如果该节点是叶子节点，则返回
        if (octant.childOctants.length != 0) {
            // 继续查找子节点
            var i;
            var length;
            for (i = 0, length = octant.childOctants.length; i < length; ++i) {
                node = octant.childOctants[i];
                if (this.findContainNode(node)) {
                    break;
                }
            }
        }

        this.containedOctants.push(octant);
        /*
        // 没有子节点包含照相机，说明子节点塌陷了，根据子节点中心离照相机的距离来确定
        var distance = 0;
        var minDistanceNode = 0;
        for (i = 0, length = octant.childOctants.length; i < length; ++i) {
            node = octant.childOctants[i];

            var camToOctantDir = new THREE.Vector3(node.center.x - cameraPos.x,
                node.center.y - cameraPos.y, node.center.z - cameraPos.z);
            var d = camToOctantDir.lengthSq();
            if (i == 0) {
                distance = d;
            }
            else if (distance > d){
                distance = d;
                minDistanceNode = i;
            }
        }
        */
        return true;
    }

    return false;
};

// octants是包含camera的八叉树叶子节点数组，第一个元素是叶子节点，然后是父节点，最后是根节点
// 根据camera的方向，得到和octant相邻的八叉树节点
CLOUD.OctantNeighborUtil.prototype.findNeighborNode
    = function () {
    var searchNeighborOfNeighbor = this.searchNeighborOfNeighbor;
    var containChildOfNeighbor = this.containChildOfNeighbor;

    var camera = this.camera;
    var octants = this.containedOctants;

    var OctType = this.OctType;
    var EdgeType = this.EdgeType;

    var neighborOctants = [];
    var oct;

    if (octants.length == 0) {
        return neighborOctants; // return empty neighbor list
    }

    var frustum = camera.frustum;
    var i, j, k;
    var dx, dy, dz;


    var min;
    var max;
    var octant = octants[0];
    min = octant.min;
    max = octant.max;

    // follow the camera direction and get neighbor face octant
    var target = camera.target;
    var cameraPos = camera.position;
    var camDir = new THREE.Vector3(target.x - cameraPos.x, target.y - cameraPos.y, target.z - cameraPos.z);

    var cameraRay = new THREE.Ray(cameraPos, camDir);
    var intersectFaces = [];

    // faces: left, right, down, up, back, front

    var box3 = new THREE.Box3(min, max);
    var intersectPoint = cameraRay.intersectBox(box3);

    // get intersect face by camera dir
    if (intersectPoint) {
        // check if the intersect point is in the box plane
        if ( intersectPoint.y == min.y || intersectPoint.y == max.y ) { // Up/Down face intersectPoint.y == max.y or min.y
            if (intersectPoint.x <= max.x && intersectPoint.x >= min.x &&
                intersectPoint.z <= max.z && intersectPoint.z >= min.z) {
                if ( intersectPoint.y == min.y) {
                    intersectFaces.push(2);
                }
                else  {
                    intersectFaces.push(3);
                }
            }
        }
        else if (intersectPoint.z == min.z || intersectPoint.z == max.z) { // Front/Back face
            if (intersectPoint.x <= max.x && intersectPoint.x >= min.x &&
                intersectPoint.y <= max.y && intersectPoint.y >= min.y) {
                if ( intersectPoint.z == min.z) {
                    intersectFaces.push(4);
                }
                else  {
                    intersectFaces.push(5);
                }
            }
        }
        else if (intersectPoint.x == min.x || intersectPoint.x == max.x) { // Left/Right face
            if (intersectPoint.z <= max.z && intersectPoint.z >= min.z &&
                intersectPoint.y <= max.y && intersectPoint.y >= min.y) {
                if ( intersectPoint.x == min.x) {
                    intersectFaces.push(0);
                }
                else  {
                    intersectFaces.push(1);
                }
            }
        }
    }

    if (intersectFaces.length == 0) {
        // something goes wrong
        return neighborOctants;
    }

    // get intersect faces by frustum
    // 1, construct outer box from faces

    dx = max.x - min.x;
    dy = max.y - min.y;
    dz = max.z - min.z;
    if (dy > dx) dx = dy;
    if (dz > dx) dx = dz;
    var octLength = dx;
    var tmpBoxCenter = new THREE.Vector3();
    for (i = 0; i < 6; i++) {
        if (i == intersectFaces[0]) {
            continue;
        }
        tmpBoxCenter.copy(octant.center);
        switch (i) {
            case 0:
                tmpBoxCenter.x -= octLength;
                break;
            case 1:
                tmpBoxCenter.x += octLength;
                break;
            case 2:
                tmpBoxCenter.y -= octLength;
                break;
            case 3:
                tmpBoxCenter.y += octLength;
                break;
            case 4:
                tmpBoxCenter.z -= octLength;
                break;
            case 5:
                tmpBoxCenter.z += octLength;
                break;
        }

        var halfLength = octLength / 2.0;
        var tmpBox3 = new THREE.Box3(new THREE.Vector3(tmpBoxCenter.x - halfLength,
                                                       tmpBoxCenter.y - halfLength,
                                                       tmpBoxCenter.z - halfLength),
                                     new THREE.Vector3(tmpBoxCenter.x + halfLength,
                                                       tmpBoxCenter.y + halfLength,
                                                       tmpBoxCenter.z + halfLength));

        if (frustum.intersectsBox(tmpBox3)) {
            intersectFaces.push(i);
        }
    }

    if (intersectFaces.length > 1) {
        intersectFaces.sort();
    }

 // RUF : 0,     LUF : 1,      RDF : 2,     LDF : 3,
 // RUB : 4,     LUB : 5,      RDB : 6,     LDB : 7,
    if (intersectFaces.length > 2) {
        // find neighbor from vertex
        var vertex = 0;
        for (i = 0; i < intersectFaces.length; i++) {
            for (j = i+1; j < intersectFaces.length; j++) {
                for (k = j+1; k < intersectFaces.length; k++) {
                    if (intersectFaces[i] == 1 && intersectFaces[j] == 3 && intersectFaces[k] == 5) {
                        vertex = OctType.RUF;
                    }
                    else if (intersectFaces[i] == 0 && intersectFaces[j] == 3 && intersectFaces[k] == 5) {
                        vertex = OctType.LUF;
                    }
                    else if (intersectFaces[i] == 1 && intersectFaces[j] == 2 && intersectFaces[k] == 5) {
                        vertex = OctType.RDF;
                    }
                    else if (intersectFaces[i] == 0 && intersectFaces[j] == 2 && intersectFaces[k] == 5) {
                        vertex = OctType.LDF;
                    }
                    else if (intersectFaces[i] == 1 && intersectFaces[j] == 3 && intersectFaces[k] == 4) {
                        vertex = OctType.RUB;
                    }
                    else if (intersectFaces[i] == 0 && intersectFaces[j] == 3 && intersectFaces[k] == 4) {
                        vertex = OctType.LUB;
                    }
                    else if (intersectFaces[i] == 1 && intersectFaces[j] == 2 && intersectFaces[k] == 4) {
                        vertex = OctType.RDB;
                    }
                    else if (intersectFaces[i] == 0 && intersectFaces[j] == 2 && intersectFaces[k] == 4) {
                        vertex = OctType.LDB;
                    }
                    else {
                        continue;
                    } //these faces have no common edge
                    oct = this.findVertexNeighbor(0, vertex);
                    if (oct) {
                        neighborOctants.push(oct);
                        if (containChildOfNeighbor) {
                            this.getChildOfOctant(oct, 2, vertex, neighborOctants);
                        }
                        if (searchNeighborOfNeighbor) {
                            oct = this.getNeighborOfSecondLevel(oct, 2, vertex);
                            if (oct) {
                                neighborOctants.push(oct);
                            }
                        }
                    }
                }
            }
        }
    }

// LD = 0; LU = 1; LB = 2; LF = 3; RD = 4; RU = 5; 
// RB = 6; RF = 7; DB = 8; DF = 9; UB = 10; UF = 11;
    if (intersectFaces.length > 1) {
        // find neighbor from edge
        var edge = 0;
        for (i = 0; i < intersectFaces.length; i++) {
            for (j = i+1; j < intersectFaces.length; j++) {
                if (intersectFaces[i] == 0 && intersectFaces[j] == 2) {
                    edge = EdgeType.LD;
                }
                else if (intersectFaces[i] == 0 && intersectFaces[j] == 3) {
                    edge = EdgeType.LU;
                }
                else if (intersectFaces[i] == 0 && intersectFaces[j] == 4) {
                    edge = EdgeType.LB;
                }
                else if (intersectFaces[i] == 0 && intersectFaces[j] == 5) {
                    edge = EdgeType.LF;
                }
                else if (intersectFaces[i] == 1 && intersectFaces[j] == 2) {
                    edge = EdgeType.RD;
                }
                else if (intersectFaces[i] == 1 && intersectFaces[j] == 3) {
                    edge = EdgeType.RU;
                }
                else if (intersectFaces[i] == 1 && intersectFaces[j] == 4) {
                    edge = EdgeType.RB;
                }
                else if (intersectFaces[i] == 1 && intersectFaces[j] == 5) {
                    edge = EdgeType.RF;
                }
                else if (intersectFaces[i] == 2 && intersectFaces[j] == 4) {
                    edge = EdgeType.DB;
                }
                else if (intersectFaces[i] == 2 && intersectFaces[j] == 5) {
                    edge = EdgeType.DF;
                }
                else if (intersectFaces[i] == 3 && intersectFaces[j] == 4) {
                    edge = EdgeType.UB;
                }
                else if (intersectFaces[i] == 3 && intersectFaces[j] == 5) {
                    edge = EdgeType.UF;
                }
                else {
                    continue;
                } //these faces have no common edge
                oct = this.findEdgeNeighbor(0, edge);
                if (oct) {
                    neighborOctants.push(oct);
                    if (containChildOfNeighbor) {
                        this.getChildOfOctant(oct, 1, edge, neighborOctants);
                    }
                    if (searchNeighborOfNeighbor) {
                        oct = this.getNeighborOfSecondLevel(oct, 1, edge);
                        if (oct) {
                            neighborOctants.push(oct);
                        }
                    }
                }
            }
        }
    }

    for (i = 0; i < intersectFaces.length; i++) {
        // find neighbor from face
        oct = this.findFaceNeighbor(0, intersectFaces[i]);
        if (oct) {
            neighborOctants.push(oct);
            if (containChildOfNeighbor) {
                this.getChildOfOctant(oct, 0, intersectFaces[i], neighborOctants);
            }
            if (searchNeighborOfNeighbor) {
                oct = this.getNeighborOfSecondLevel(oct, 0, intersectFaces[i]);
                if (oct) {
                    neighborOctants.push(oct);
                }
            }
        }
    }

    neighborOctants.sort(function(a, b) {
        if (a.octantId < b.octantId) {
            return -1;
        } else {
            return 1;
        }
    });

    return neighborOctants;
};

// kind: 0 - face, 1 - edge, 2 - vertex
// I: camera direction to search, need to reverse
CLOUD.OctantNeighborUtil.prototype.getChildOfOctant
    = function(octant, kind, I, neighborOctants) {
    var childNum = octant.childOctants.length;
    if (childNum == 0 || octant.depth < 4) {
        return;
    }

    var faceType = this.FaceType;
    var faceDir = [];
    switch (kind) {
        case 0: // face
            faceDir.push( I%2 == 0 ? I+1 : I-1);
            break;
        case 1: // edge
            var edgeType = this.EdgeType;
            switch (I) {
                case edgeType.LD:
                    faceDir.push(faceType.R); faceDir.push(faceType.U);
                    break;
                case edgeType.LU:
                    faceDir.push(faceType.R); faceDir.push(faceType.D);
                    break;
                case edgeType.LB:
                    faceDir.push(faceType.R); faceDir.push(faceType.F);
                    break;
                case edgeType.LF:
                    faceDir.push(faceType.R); faceDir.push(faceType.B);
                    break;
                case edgeType.RD:
                    faceDir.push(faceType.L); faceDir.push(faceType.U);
                    break;
                case edgeType.RU:
                    faceDir.push(faceType.L); faceDir.push(faceType.D);
                    break;
                case edgeType.RB:
                    faceDir.push(faceType.L); faceDir.push(faceType.F);
                    break;
                case edgeType.RF:
                    faceDir.push(faceType.L); faceDir.push(faceType.B);
                    break;
                case edgeType.DB:
                    faceDir.push(faceType.U); faceDir.push(faceType.F);
                    break;
                case edgeType.DF:
                    faceDir.push(faceType.U); faceDir.push(faceType.B);
                    break;
                case edgeType.UB:
                    faceDir.push(faceType.D); faceDir.push(faceType.F);
                    break;
                case edgeType.UF:
                    faceDir.push(faceType.D); faceDir.push(faceType.B);
                    break;
            }
            break;
        case 2: //vertex
            var octType = this.OctType;
            switch (I) {
                case octType.RUF:
                    faceDir.push(faceType.L); faceDir.push(faceType.D); faceDir.push(faceType.B);
                    break;
                case octType.LUF:
                    faceDir.push(faceType.R); faceDir.push(faceType.D); faceDir.push(faceType.B);
                    break;
                case octType.RDF:
                    faceDir.push(faceType.L); faceDir.push(faceType.U); faceDir.push(faceType.B);
                    break;
                case octType.LDF:
                    faceDir.push(faceType.R); faceDir.push(faceType.U); faceDir.push(faceType.B);
                    break;
                case octType.RUB:
                    faceDir.push(faceType.L); faceDir.push(faceType.D); faceDir.push(faceType.F);
                    break;
                case octType.LUB:
                    faceDir.push(faceType.R); faceDir.push(faceType.D); faceDir.push(faceType.F);
                    break;
                case octType.RDB:
                    faceDir.push(faceType.L); faceDir.push(faceType.U); faceDir.push(faceType.F);
                    break;
                case octType.LDB:
                    faceDir.push(faceType.R); faceDir.push(faceType.U); faceDir.push(faceType.F);
                    break;
            }
            break;
    }

    // get child octants in each face direction
    for (var i = 0; i < faceDir.length; i++) {
        this.getFaceChildOfOctant(octant, faceDir[i], neighborOctants);
    }
};

CLOUD.OctantNeighborUtil.prototype.getFaceChildOfOctant
    = function(octant,faceDir, neighborOctants) {
    var curOct;
    var reflectFace;
    for (var i = 0, length = octant.childOctants.length; i < length; i++ ) {
        curOct = octant.childOctants[i];
        if (this.adjFace(faceDir, curOct.octType)) {
            neighborOctants.push(curOct);
            this.getFaceChildOfOctant(curOct, faceDir, neighborOctants);
        }
        else {
            reflectFace = this.refelectFace(faceDir, curOct.octType);
            for (var j = 0; j < length; j++ ) {
                if (octant.childOctants[j].octType == reflectFace) {
                    break;
                }
            }

            if (j == length) {
                neighborOctants.push(curOct);
                this.getFaceChildOfOctant(curOct, faceDir, neighborOctants);
            }
        }
    }
};

// kind: 0 - face, 1 - edge, 2 - vertex
// I: direction to search
CLOUD.OctantNeighborUtil.prototype.getNeighborOfSecondLevel
    = function(octant, kind, I) {
    var curNodeStack = [];
    var ancestorOctants = [];
    var neighborOctants = [];
    neighborOctants[0] = octant;
    this.getAncestorNodes(this.root, neighborOctants, 0, curNodeStack, ancestorOctants);
    var util = new CLOUD.OctantNeighborUtil(this.camera, this.root);
    util.containedOctants = ancestorOctants;

    var oct = null;
    switch (kind) {
        case 0:
            oct = util.findFaceNeighbor(0, I);
            break;
        case 1:
            oct = util.findEdgeNeighbor(0, I);
            break;
        case 2:
            oct = util.findVertexNeighbor(0, I);
            break;
    }

    return oct;
};

CLOUD.OctantNeighborUtil.prototype.getAncestorAndNeighbors
    = function() {
    this.searchNeighborOfNeighbor = true;
    this.containChildOfNeighbor = true;

    //this.outputOctree(this.root, -1);
    var containedOctants = this.containedOctants;

    this.findContainNode(this.root);
    var neighborOctants = this.findNeighborNode(this.camera, containedOctants);

    // get ancestor nodes of neighbor octants
    var curNodeStack = [];
    var ancestorOctants = [];
    this.getAncestorNodes(this.root, neighborOctants, 0, curNodeStack, ancestorOctants);

     var ancestorAndNeighbors = {};
    var i;
    var length;
    for (i = 0, length = containedOctants.length; i < length; i++) {
        ancestorAndNeighbors[containedOctants[i].octantId] = 1;
    }

    for (i = 0, length = neighborOctants.length; i < length; i++) {
        ancestorAndNeighbors[neighborOctants[i].octantId] = 1;
    }

    for (i = 0, length = ancestorOctants.length; i < length; i++) {
        ancestorAndNeighbors[ancestorOctants[i].octantId] = 1;
    }

    //this.outputOctants(ancestorAndNeighbors, containedOctants[0]);

    return ancestorAndNeighbors;
};

// Get ancestor octree nodes of the nodes in octants
CLOUD.OctantNeighborUtil.prototype.getAncestorNodes
    = function(root, octants, curIndex, stack, ancestors) {

    var i;
    var length;
    var curNode;
    for (i = 0, length = root.childOctants.length; i < length && curIndex < octants.length; i++) {
        curNode = root.childOctants[i];
        stack.push(curNode);
        if (curNode.octantId == octants[curIndex].octantId) {
            for (var j=stack.length-1; j>=0; j--) {
                ancestors.push(stack[j]);
            }
            curIndex++;
        }
        else if ( i == length-1 || root.childOctants[i+1].octantId > octants[curIndex].octantId) {
            // search child tree
            curIndex = this.getAncestorNodes(curNode, octants, curIndex, stack, ancestors);
        }
        // else continue to search next child
        stack.pop();
    }

    return curIndex;
};

CLOUD.OctantNeighborUtil.prototype.outputOctants
    = function(octants, cameraNode) {
    console.group();

    console.log("Node that contains camera: %d", cameraNode.octantId);
    var nodes = "";
    var i = 0;
    for (var o in octants) {
        nodes += o;
        nodes += "  ";
        if ((i % 9) == 0) {
            nodes += "\n";
        }
        i++;
    }
    console.log("nodes: %s", nodes);
    console.groupEnd();
};

CLOUD.OctantNeighborUtil.prototype.outputOctree
    = function(node, parentId) {
    console.group();
    var i;
    var indent = "";
    for (i=0; i<node.depth; i++) { indent += "  "; }
    console.log("%sNode id: %i, depth: %i, octType: %i, parent: %i", indent, node.octantId,
                         node.depth, node.octType, parentId);
    console.log("%s  size: %f, center: %f, %f, %f", indent, node.size, node.center.x, node.center.y, node.center.z);
    console.log("%s  child number: %i", indent, node.childOctants.length);
    var children = "";
    for (i=0; i<node.childOctants.length; i++) {
        children += node.childOctants[i].octantId;
        children += "  ";
    }
    console.log("%s  children: %i", indent, children);
    for (i=0; i<node.childOctants.length; i++) {
        this.outputOctree(node.childOctants[i], node.octantId);
    }
    console.groupEnd();
};


CLOUD.Edge = function () {

    this.vertexIndex = new Array(2);
    this.faceIndex = new Array(2);
    
};

CLOUD.RemoveDuplicateIndex = function (vertices, indices) {

    var vertexCount = vertices.length / 3;
    var positions = new Array(vertexCount);
    var sortArray = new Array(vertexCount);

    function compareVertex(lhs, rhs) {
        
        var lVertex = positions[lhs];
        var rVertex = positions[rhs];

        return lVertex.x != rVertex.x ? lVertex.x - rVertex.x : 
            lVertex.y != rVertex.y ? lVertex.y - rVertex.y : lVertex.z - rVertex.z;

    }

    function sortFunction(lhs, rhs) {

        var compare = compareVertex(lhs, rhs);
        return compare == 0 ? lhs - rhs : compare;

    }

    for (var i = 0; i < vertexCount; ++i) {

        positions[i] = new THREE.Vector3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
        sortArray[i] = i;

    }

    sortArray.sort(sortFunction);

    var duplicateMap = {};
    var index = sortArray[0];
    for (var i = 1; i < vertexCount; ++i) {

        if (compareVertex(index, sortArray[i]) == 0) {
            duplicateMap[sortArray[i]] = index;
        }
        else {
            index = sortArray[i];
        }

    }

    var newIndices = new Array(indices.length);
    for (var i = 0; i < indices.length; ++i) {
        
        if (duplicateMap.hasOwnProperty(indices[i])) {
            newIndices[i] = duplicateMap[indices[i]];
        }
        else {
            newIndices[i] = indices[i];
        }

    }

    return newIndices;

}

CLOUD.RemoveDuplicateVertex = function (vertices, indices) {

    function sortFunction(lhs, rhs) {
        return lhs - rhs;
    }

    var newIndices = CLOUD.RemoveDuplicateIndex(vertices, indices);
    newIndices.sort(sortFunction);

    var newVertex = new Array();
    var index = newIndices[0];
    newVertex.push(index);

    for(var i = 1; i < newIndices.length; ++i) {

        if (newIndices[i] != index) {

            index = newIndices[i];
            newVertex.push(index);

        }

    }

    return newVertex.sort(sortFunction);

}

CLOUD.BuildEdge = function (vertices, indices) {

    var duplicateIndices = CLOUD.RemoveDuplicateIndex(vertices, indices);
    
    var maxEdgeCount = duplicateIndices.length;
    var vertexCount = vertices.length / 3;
    var firstEdge = new Array(vertexCount + maxEdgeCount);
    var nextEdge = vertexCount;
    var triangleCount = duplicateIndices.length / 3;

    for(var i = 0; i < vertexCount; ++i)
        firstEdge[i] = -1;

    var edgeArray = new Array(maxEdgeCount);

    var edgeCount = 0;
    for(var i = 0; i < triangleCount; ++i) {

        var i1 = duplicateIndices[i * 3 + 2];
        for (var j = 0; j < 3; ++j)
        {
            var isSwap = false;
            var i2 = duplicateIndices[i * 3 + j];
            if (i1 > i2)
            {
                isSwap = true;
                var temp = i1;
                i1 = i2;
                i2 = temp;
            }

            var newEdge = new CLOUD.Edge();
            newEdge.vertexIndex[0] = i1;
            newEdge.vertexIndex[1] = i2;
            newEdge.faceIndex[0] = i;
            newEdge.faceIndex[1] = i;

            var edgeIndex = firstEdge[i1];
            if (edgeIndex == -1)
            {
                firstEdge[i1] = edgeCount;
                edgeArray[edgeCount] = newEdge;
                firstEdge[nextEdge + edgeCount] = -1;
                edgeCount++;
            }
            else
            {
                while (true)
                {
                    var edge = edgeArray[edgeIndex];
                    if (edge.vertexIndex[1] == i2)
                    {
                        edge.faceIndex[1] = i;
                        break;
                    }
                    else
                    {
                        var index = firstEdge[nextEdge + edgeIndex];
                        if (index == -1)
                        {
                            firstEdge[nextEdge + edgeIndex] = edgeCount;
                            edgeArray[edgeCount] = newEdge;
                            firstEdge[nextEdge + edgeCount] = -1;
                            edgeCount++;
                            break;
                        }
                        
                        edgeIndex = index;
                    }
                }
            }

            if (!isSwap)
            {
                i1 = i2;
            }
        }

    }

    var edgeIndices = [];
    for (var i = 0; i < edgeCount; ++i) {
        var edge = edgeArray[i];
        if (edge.faceIndex[0] == edge.faceIndex[1]) {
            edgeIndices.push(edge.vertexIndex[0]);
            edgeIndices.push(edge.vertexIndex[1]);
        }
        else {
            var face0 = edge.faceIndex[0];
            var index0 = duplicateIndices[face0 * 3];
            var index1 = duplicateIndices[face0 * 3 + 1];
            var index2 = duplicateIndices[face0 * 3 + 2];

            var pos0 = new THREE.Vector3(vertices[index0 * 3], vertices[index0 * 3 + 1], vertices[index0 * 3 + 2]);
            var pos1 = new THREE.Vector3(vertices[index1 * 3], vertices[index1 * 3 + 1], vertices[index1 * 3 + 2]);
            var pos2 = new THREE.Vector3(vertices[index2 * 3], vertices[index2 * 3 + 1], vertices[index2 * 3 + 2]);

            var dir0 = pos0.sub(pos1);
            var dir1 = pos1.sub(pos2);
            var normal0 = dir0.cross(dir1);
            normal0.normalize();

            var face1 = edge.faceIndex[1];
            index0 = duplicateIndices[face1 * 3];
            index1 = duplicateIndices[face1 * 3 + 1];
            index2 = duplicateIndices[face1 * 3 + 2];

            pos0 = new THREE.Vector3(vertices[index0 * 3], vertices[index0 * 3 + 1], vertices[index0 * 3 + 2]);
            pos1 = new THREE.Vector3(vertices[index1 * 3], vertices[index1 * 3 + 1], vertices[index1 * 3 + 2]);
            pos2 = new THREE.Vector3(vertices[index2 * 3], vertices[index2 * 3 + 1], vertices[index2 * 3 + 2]);

            dir0 = pos0.sub(pos1);
            dir1 = pos1.sub(pos2);
            var normal1 = dir0.cross(dir1);
            normal1.normalize();

            if (Math.abs(normal0.dot(normal1)) < Math.PI / 4) {
                edgeIndices.push(edge.vertexIndex[0]);
                edgeIndices.push(edge.vertexIndex[1]);
            }
        }
    }

    return edgeIndices;

}

CLOUD.GetFaceIndex = function (positions, normals, indices, position, normal) {

    var count = indices.length / 3;
    var indexArray = new Array();
    for (var i = 0 ; i < count; ++i) {

        var face = indices[i * 3];
        var normalTemp = new THREE.Vector3(normals[face * 3], normals[face * 3 + 1], normals[face * 3 + 2]);
        var dot = normalTemp.dot(normal);
        if (Math.abs(dot - 1.0) < 0.001) {
            var pos = new THREE.Vector3(positions[face * 3], positions[face * 3 + 1], positions[face * 3 + 2]);
            var D = -pos.dot(normalTemp);
            var distance = Math.abs(position.dot(normalTemp) + D);
            if (Math.abs(distance) < 3.0) {
                indexArray.push(indices[i * 3], indices[i * 3 + 1], indices[i * 3 + 2]);
            }
        }

    }

    return indexArray;

}
CLOUD.RenderGroup = function () {

    var opaqueObjects = [];
    var transparentObjects = [];

    var opaqueObjectsLastIndex = -1;
    var transparentObjectsLastIndex = -1;

    var renderingIdx = 0;
    var opaqueFinished = false;
    var transparentFinished = false;
    var timeStart = 0;
    var timeEnd = 0;
    var timeElapse = 0;

    this.getOpaqueObjects = function () {
        return opaqueObjects;
    };

    this.getTransparentObjects = function () {
        return transparentObjects;
    };

    function painterSortStable(a, b) {
        if (a.material.id !== b.material.id) {
            return a.material.id - b.material.id;
        } else {
            return a.id - b.id;
        }
    }

    function painterSortStableZ(a, b) {

        if (a.z !== b.z) {
            return a.z - b.z;
        }
        else if (a.material.id !== b.material.id) {
            return a.material.id - b.material.id;
        }
        else {
            return a.id - b.id;
        }
    }

    function reversePainterSortStable(a, b) {
        if (a.z !== b.z) {
            return b.z - a.z;
        } else {
            return a.id - b.id;
        }
    }

    this.destroy = function () {
        opaqueObjects = [];
        transparentObjects = [];
    };

    this.restart = function () {
        renderingIdx = 0;
        opaqueFinished = false;
        transparentFinished = false;
    };

    this.prepare = function () {
        this.restart();
        opaqueObjectsLastIndex = -1;
        transparentObjectsLastIndex = -1;
    };

    this.renderableCount = function () {
        return opaqueObjectsLastIndex + transparentObjectsLastIndex;
    };

    function isFinished() {
        return opaqueFinished && transparentFinished;
    }

    this.pushRenderItem = function (object, geometry, material, z, group) {

        var array, index;
        if (material.transparent) {
            array = transparentObjects;
            index = ++transparentObjectsLastIndex;

        } else {
            array = opaqueObjects;
            index = ++opaqueObjectsLastIndex;
        }

        // recycle existing render item or grow the array
        var renderItem = array[index];
        if (renderItem !== undefined) {

            renderItem.id = object.id;
            renderItem.object = object;
            renderItem.geometry = geometry;
            renderItem.material = material;
            renderItem.z = z;
            renderItem.group = group;

        } else {
            renderItem = {
                id: object.id,
                object: object,
                geometry: geometry,
                material: material,
                z: z,
                group: group
            };
            // assert( index === array.length );
            //array.push( renderItem );
            array[index] = renderItem;
        }

    };

    this.sortRenderList = function (cullEnd) {

        opaqueObjects.length = opaqueObjectsLastIndex + 1;
        transparentObjects.length = transparentObjectsLastIndex + 1;

        //console.log(opaqueObjects.length + transparentObjects.length);

        if (cullEnd) {
            //console.time("sort");
            opaqueObjects.sort(painterSortStable);
            transparentObjects.sort(reversePainterSortStable);
            //console.timeEnd("sort");
        }
    };

    function renderObjects(renderer, renderList, camera, lights, fog, update) {

        timeStart = Date.now();

        var len = renderList.length;
        var i = renderingIdx;

        for (; i < len; i++) {

            var renderItem = renderList[i];
            var object = renderItem.object;
            var material = renderItem.material;
            var group = renderItem.group;
            var geometry = renderItem.geometry;

            object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
            object.normalMatrix.getNormalMatrix(object.modelViewMatrix);

            geometry = renderer.updateObject(object);
            renderer.renderBufferDirect(camera, fog, geometry, material, object, group);

            // if ((i % 5000) === 4999) {
            //
            //     timeEnd = Date.now();
            //     timeElapse = timeEnd - timeStart;
            //
            //     if (timeElapse > CLOUD.GlobalData.LimitFrameTime) {
            //
            //         renderingIdx = i + 1;
            //         return false;
            //     }
            // }

            timeEnd = Date.now();
            timeElapse = timeEnd - timeStart;

            if (timeElapse > CLOUD.GlobalData.LimitFrameTime) {

                //console.log("timeElapse", [timeElapse, i]);

                renderingIdx = i + 1;
                return false;
            }
        }

        renderingIdx = 0;
        return true;
    }

    this.renderOpaqueObjects = function (renderer, camera, lights, fog, update) {

        if (!opaqueFinished) {
            opaqueFinished = renderObjects(renderer, opaqueObjects, camera, lights, fog, update);
        }

        return opaqueFinished;
    };

    this.renderTransparentObjects = function (renderer, camera, lights, fog, update) {

        if (!transparentFinished) {
            transparentFinished = renderObjects(renderer, transparentObjects, camera, lights, fog, update);
        }

        return transparentFinished;
    };
};

CLOUD.OrderedRenderer = function () {

    // increment culling
    var _cullTicket = 0;
    var _isIncrementalCullFinish = false,
        _isIncrementalRenderFinish = false;
    var _countCullingObject = 0;
    var _countScreenCullOff = 0;
    var _timeStartCull = 0;

    var _renderTicket = 0;

    var _renderGroups = [];

    var _frustum = null;
    var _projScreenMatrix = null;

    var _vector3 = new THREE.Vector3();

    var _isUpdateObjectList = true;
    var _dirtyIncrementList = true;

    this.updateObjectList = function (isUpdate) {
        _isUpdateObjectList = isUpdate;
    };

    this.destroy = function () {

        for (var ii = 0, len = _renderGroups.length; ii < len; ++ii) {
            var group = _renderGroups[ii];
            if (group !== undefined) {
                group.destroy();
            }
        }

    };

    this.restart = function () {

        for (var ii = 0, len = _renderGroups.length; ii < len; ++ii) {
            var group = _renderGroups[ii];
            if (group !== undefined) {
                group.restart();
            }
        }

        _countCullingObject = 0;
        _countScreenCullOff = 0;
        _dirtyIncrementList = true;
        _isIncrementalCullFinish = true;
    };

    this.setFilter = function(filter) {
        // do nothing
        // please remove this method after we remove WebGLRendererByIncrement.setFilterObject()
    }

    function prepareNewFrame() {

        ++_cullTicket;
        if (_cullTicket > 100000)
            _cullTicket = 0;

        for (var ii = 0, len = _renderGroups.length; ii < len; ++ii) {
            var group = _renderGroups[ii];
            if (group !== undefined) {
                group.prepare();
            }
        }
    }

    function computeRenderableCount() {

        var totalCount = 0;
        for (var ii = 0, len = _renderGroups.length; ii < len; ++ii) {
            var group = _renderGroups[ii];
            if (group !== undefined) {
                totalCount += group.renderableCount();
            }
        }
        return totalCount;
    }

    function pushRenderItem(object, geometry, material, z) {

        var renderGroup = _renderGroups[object.renderOrder];
        if (renderGroup === undefined) {
            renderGroup = new CLOUD.RenderGroup();
            _renderGroups[object.renderOrder] = renderGroup;
        }

        renderGroup.pushRenderItem(object, geometry, material, z, null);
    }


    function computeObjectCenter(object) {

        object.modelCenter = new THREE.Vector3();

        if (object.boundingBox) {

            object.boundingBox.getCenter(object.modelCenter);
            object.modelCenter.applyMatrix4(object.matrixWorld);

            _vector3.copy(object.boundingBox.min);
            _vector3.applyMatrix4(object.matrixWorld);

            object.radius = object.modelCenter.distanceTo(_vector3);
        }
        else {

            object.modelCenter.setFromMatrixPosition(object.matrixWorld);

        }
    }

    function sortRenderList() {

        for (var ii = 0, len = _renderGroups.length; ii < len; ++ii) {
            var group = _renderGroups[ii];
            if (group !== undefined) {
                group.sortRenderList(_isIncrementalCullFinish);
            }

        }
    }

    function projectObject(object, camera) {

        if (object.visible === false || object.alive === false)
            return true;

        if (object._cullTicket != _cullTicket /*&& (object.channels.mask & camera.channels.mask) !== 0*/) {

            ++_countCullingObject;

            // TODO: incrmental bug fixing
            // if (_countCullingObject % 5000 == 4999) {
                var diff = Date.now() - _timeStartCull;
                if (diff > 30) {
                    return false;
                }

            // }

            object._cullTicket = _cullTicket;

            if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {

                if (object.frustumCulled === false || _frustum.intersectsObject(object) === true) {

                    var material = object.material;
                    var geometry = object.geometry;
                    if (material.transparent) {
                        _vector3.setFromMatrixPosition(object.matrixWorld);
                        _vector3.applyMatrix4(_projScreenMatrix);
                        pushRenderItem(object, geometry, material, _vector3.z);
                    } else {
                        pushRenderItem(object, geometry, material, 0);
                    }

                }
            }
        }

        var children = object.children;
        if (children) {
            for (var i = 0, l = children.length; i < l; i++) {

                if (!projectObject(children[i], camera))
                    return false;

            }
        }

        return true;
    }

    function projectLights(scene, lights) {

        lights.length = 0;

        var children = scene.children;

        for (var i = 0, l = children.length; i < l; i++) {

            var object = children[i];
            if (object.isLight) {

                lights.push(object);

            }

        }
    }

    function buildObjectList(scene, camera, lights) {

        if (!_isUpdateObjectList) {
            _isIncrementalCullFinish = true;
            return;
        }

        if (_isIncrementalCullFinish) {

            prepareNewFrame();
            projectLights(scene, lights);
        }

        _timeStartCull = Date.now();

        //console.time("projectObject");
        _isIncrementalCullFinish = projectObject(scene, camera);
        //console.timeEnd("projectObject");
        //console.log("screen cull off: " + _screenCullOffCount);
        sortRenderList();
    }

    this.update = function (frustum, projScreenMatrix) {
        _projScreenMatrix = projScreenMatrix;
        _frustum = frustum;
    };

    function updateRenderTicket() {

        if (!_isUpdateObjectList || _dirtyIncrementList) {
            ++_renderTicket;
        }
        //else {
        //    console.log(_renderTicket);
        //}
        if (_renderTicket > 10000)
            _renderTicket = 0;
    }

    this.render = function (renderer, scene, camera, lights, renderTarget, forceClear, state) {

        updateRenderTicket();

        if (_dirtyIncrementList) {

            CLOUD.Logger.time("build object list");
            buildObjectList(scene, camera, lights);
            CLOUD.Logger.timeEnd("build object list");

            if (!_isIncrementalCullFinish)
                return false;
            else {
                forceClear = true;
                _dirtyIncrementList = false;

                //var count = computeRenderableCount();
                //console.log("renderable " + count);
            }

            renderer.setupLights(lights, camera);
            renderer.setRenderTarget(renderTarget);
        }

        CLOUD.Logger.time("increment render object");
        if (renderer.autoClear || forceClear) {
            renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil, _isUpdateObjectList);
        }

        var fog = scene.fog;

        renderer.setRenderTicket(_renderTicket);

        state.setBlending(THREE.NoBlending);

        // TODO: incrmental bug fixing
         //_isIncrementalRenderFinish = true; //

        for (var ii = _renderGroups.length - 1; ii >= 0; --ii) {
            var group = _renderGroups[ii];
            if (group !== undefined) {
                _isIncrementalRenderFinish = group.renderOpaqueObjects(renderer, camera, lights, fog, _isUpdateObjectList);
                if (!_isIncrementalRenderFinish)
                    break;
            }
        }

        if (_isIncrementalRenderFinish) {

            for (var ii = _renderGroups.length - 1; ii >= 0; --ii) {
                var group = _renderGroups[ii];
                if (group !== undefined) {
                    _isIncrementalRenderFinish = group.renderTransparentObjects(renderer, camera, lights, fog);
                    if (!_isIncrementalRenderFinish)
                        break;
                }
            }
        }

        // Ensure depth buffer writing is enabled so it can be cleared on next render
        // state.setDepthTest(true);
        // state.setDepthWrite(true);
        // state.setColorWrite(true);

        state.buffers.depth.setTest(true);
        state.buffers.depth.setMask(true);
        state.buffers.color.setMask(true);

        CLOUD.Logger.timeEnd("increment render object");

        return _isIncrementalRenderFinish;

    };
};

CLOUD.RenderComposer = function()
{
    var _renderer;

    var _glExtensionDrawBuffers;

    var _camera;

    var _blendPass,
        _fxaaPass,
        _copyPass;

    var _w, _h;

    var _colorTarget = null;
    var _idTarget = null;

    var _settings = {};

    var _mainSceneRenderFinished = false;
    var _startNewPass = true;
    // in one render process, do we finish all the render pass
    var _renderFinished = true;

    var _hoverId = undefined;
    var _sceneNotChanged = false;

    this.init = function (glrenderer, width, height, supportMRT) {

        createRenderPasses();

        if (!glrenderer) {
            console.log("You need a gl context to make a renderer. Things will go downhill from here.");
            return;
        }

        _w = width;
        _h = height;

        _renderer = glrenderer;
        //_targetRenderer = new THREE.WebGLRenderer({antialias: false});
        _glExtensionDrawBuffers = supportMRT;

        this.setSize(width, height, true);
    };

    function createRenderPasses() {

        function setNoDepthNoBlend(pass) {
            pass.material.blending = THREE.NoBlending;
            pass.material.depthWrite = false;
            pass.material.depthTest = false;
        }

        _blendPass = new CLOUD.ShaderPass(HighlightShader);
        setNoDepthNoBlend(_blendPass);

        _fxaaPass = new CLOUD.ShaderPass(FXAAShader);
        setNoDepthNoBlend(_fxaaPass);

        _copyPass = new CLOUD.ShaderPass(CopyShader);
        setNoDepthNoBlend(_copyPass);
    };

    this.cleanup = function () {
        if (_colorTarget) {
            _colorTarget.dispose();
            _colorTarget = null;
        }

        if (_idTarget) {
            _idTarget.dispose();
            _idTarget = null;
        }
    };

    this.setSize = function (w, h, force) {

        _w = w;
        _h = h;

        //Just a way to release the targets in cases when
        //we use a custom render context and don't need this one
        //temporarily
        if ((w === 0 && h === 0) || !_renderer) {
            this.cleanup();
            return;
        }

        var sw = 0 | (w * _renderer.getPixelRatio());
        var sh = 0 | (h * _renderer.getPixelRatio());

        _settings.deviceWidth = sw;
        _settings.deviceHeight = sh;

        var resX = 1.0 / sw;
        var resY = 1.0 / sh;

        var i;

        //Just the regular color target -- shares depth buffer
        //with the depth target.
        if (force || !_colorTarget || _colorTarget.width != sw || _colorTarget.height != sh) {

            this.cleanup();

            _colorTarget = new THREE.WebGLRenderTarget(sw, sh,
                {
                    minFilter: THREE.NearestFilter,
                    magFilter: THREE.NearestFilter,
                    format: THREE.RGBAFormat,
                    stencilBuffer: false
                });
            _colorTarget.texture.generateMipmaps = false;
            _colorTarget.texture.name = '_color_rt1';
        }

        if (force || !_idTarget || _idTarget.width != sw || _idTarget.height != sh) {
            _idTarget && _idTarget.dispose();


            _idTarget = new THREE.WebGLRenderTarget(sw, sh,
                {   minFilter: THREE.NearestFilter,
                    magFilter: THREE.NearestFilter,
                    format: THREE.RGBAFormat,
                    type: THREE.UnsignedByteType,
                    stencilBuffer: false
                });
            _idTarget.texture.generateMipmaps = false;
            _idTarget.texture.name = '_id_rt1';

            //_idTarget.shareDepthFrom = _colorTarget;

            //Set this flag to avoid checking frame buffer status every time we read
            //a pixel from the ID buffer. We know the ID target is compatible with readPixels.
            _idTarget.canReadPixels = true;
        }

        _fxaaPass.uniforms[ 'uResolution' ].value.set(resX, resY);
    };

    this._runBlendPass = function(incremental) {
        if (_hoverId) {
            _blendPass.uniforms["tID"].value = _idTarget.texture;
            _blendPass.uniforms["objID"].value = 1;

            var x = ( _hoverId >> 16 & 255 ) / 255;
            var y = ( _hoverId >> 8 & 255 ) / 255;
            var z = ( _hoverId & 255 ) / 255;

            _blendPass.uniforms["objIDv3"].value.set(x, y, z);

            _blendPass.renderToScreen = true;
            if (incremental) {
                _renderer.resetIncrementRender();
            }
            _blendPass.render(_renderer, null, _colorTarget);

            _renderFinished = true;
        }
    };

    // TODO: 需要管理渲染状态，mainscene的渲染是增量式的，其他的渲染是一次性完成的
    //
    this.renderIncrement  = function(mainScene, camera){
        // clear render targets
        if (!_colorTarget && _w) {
            this.setSize();
        } else if (!_colorTarget && !_w) {
            return;
        }

        _camera = camera;
        if (_startNewPass) {

            if (!_sceneNotChanged) {

                _renderer.resetIncrementRender();

                _renderer.setClearColor(0x000000, 0);
                _renderer.clearTarget(_colorTarget, true, true, false); //clear color and depth buffer
                _renderer.clearTarget(_idTarget, true, true, false); //clear color and depth buffer
            }
            _startNewPass = false;
            _renderFinished = false;
        }

        _renderer.autoClear = false;

        if (!_mainSceneRenderFinished) {
            // render main scene
            if (this.isMRTSupported()) {
                if (!_sceneNotChanged) {
                    _mainSceneRenderFinished = _renderer.render(mainScene, _camera, [_colorTarget, _idTarget]);
                } else {
                    _mainSceneRenderFinished = true;
                }

                _mainSceneRenderFinished && this._runBlendPass(true);
            }
            else {
                _mainSceneRenderFinished = _renderer.render(mainScene, _camera, _colorTarget);
            }

            if ( (!this.isMRTSupported() || !_hoverId) && _mainSceneRenderFinished)
            {
                _fxaaPass.renderToScreen = true;
                _renderer.resetIncrementRender();
                _fxaaPass.render(_renderer, null, _colorTarget);

                _renderFinished = true;
            }

        }

        return _mainSceneRenderFinished;
    };

    this.isMRTSupported = function() {
        return _glExtensionDrawBuffers;
    };

    this.render  = function(mainScene, camera) {
        // clear render targets
        if (!_colorTarget && _w) {
            this.setSize();
        } else if (!_colorTarget && !_w) {
            return;
        }

        _camera = camera;
        if (_startNewPass) {

            if (!_sceneNotChanged) {
                _renderer.setClearColor(0x000000, 0);
                _renderer.clearTarget(_colorTarget, true, true, false); //clear color and depth buffer
            }
            _startNewPass = false;
        }

        _renderer.autoClear = false;

        if (this.isMRTSupported()) {
            if (!_sceneNotChanged) {
                _renderer.render(mainScene, _camera, [_colorTarget, _idTarget]);
            }

            if (_hoverId) {
                this._runBlendPass(false);
            }
            else {
                _copyPass.renderToScreen = true;
                _copyPass.render(_renderer, null, _colorTarget);
            }
        }
        else {
            // render main scene
            if (!_sceneNotChanged) {
                _renderer.render(mainScene, _camera, _colorTarget);
            }
            _copyPass.renderToScreen = true;

            _copyPass.render(_renderer, null, _colorTarget);
        }

    };

    // start a full new rendering
    this.restart = function(sceneNotChanged, hoverId) {

        _hoverId = hoverId;
        _sceneNotChanged = !!sceneNotChanged;

        _mainSceneRenderFinished = false;
        _startNewPass = true;
    };

    this.finish = function() {
        if (_startNewPass && !_renderFinished) {
            this._runBlendPass();
            _renderFinished = true;
        }
    }
};

CLOUD._renderComposer = new CLOUD.RenderComposer();

CLOUD.ShaderPass = function ( shader, textureID ) {

    // if set to true, the pass is processed by the composer
    this.enabled = true;

    // if set to true, the pass indicates to swap read and write buffer after rendering
    this.needsSwap = true;

    // if set to true, the pass clears its buffer before rendering
    this.clear = false;

    // if set to true, the result of the pass is rendered to screen
    this.renderToScreen = false;

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader ) {

		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		this.material = new THREE.ShaderMaterial( {

			defines: shader.defines || {},
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.quad.frustumCulled = false; // Avoid getting clipped
	this.scene.add( this.quad );

};

CLOUD.ShaderPass.prototype = {

	constructor: CLOUD.ShaderPass,

	render: function( renderer, writeBuffer, readBuffer, delta ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

};

var CopyShader = {

	uniforms: {

		"tDiffuse": { value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"gl_FragColor = texture2D(tDiffuse, vUv);",

		"}"

	].join( "\n" )

};
var HighlightShader = {
	uniforms: {

		"tDiffuse": { type: "t", value: null }, //Color buffer containing the rendered 3d model

	                "tID": { type: "t", value: null }, //The ID buffer
	                "objID": { type: "i", value: 0 }, //The currently highlighted object ID (0 means no highlight)
	                "objIDv3": { type: "v3", value: new THREE.Vector3(0, 0, 0) }, //The currently highlighted object ID as RGB triplet
	                "highlightIntensity": { type: "f", value: 1.0 }

	},
	
	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),
	
	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tID;",
		
		"uniform int objID;",
		"uniform vec3 objIDv3;",
		"uniform float highlightIntensity;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
		
			"if (objID != 0) {",

			"vec4 idAtPixel = texture2D(tID, vUv);",

			"vec3 idDelta = abs(idAtPixel.rgb - objIDv3.rgb);",
			"if (max(max(idDelta.r, idDelta.g), idDelta.b) < 1e-3) {",
		         "texel.rgb += highlightIntensity * 0.2;",
			"}",

		"}",

		"gl_FragColor = texel;",

		"}"

	].join( "\n" )
};
var FXAAShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "uResolution": { type: "v2", value: new THREE.Vector2(1 / 1024, 1 / 512) }

    },

    vertexShader: [
        "uniform vec2 uResolution;",
        "varying vec2 vPos;",
        "varying vec4 vPosPos;",
        "void main() {",
        "vPos = uv;",
        "vPosPos.xy = uv + vec2(-0.5, -0.5) * uResolution;",
        "vPosPos.zw = uv + vec2( 0.5,  0.5) * uResolution;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"

    ].join( "\n" ),

    fragmentShader: [

    "#define FXAA_EDGE_SHARPNESS (8.0)",
    "#define FXAA_EDGE_THRESHOLD (0.125)",
    "#define FXAA_EDGE_THRESHOLD_MIN (0.05)",
    "#define FXAA_RCP_FRAME_OPT (0.50)",
    "#define FXAA_RCP_FRAME_OPT2 (2.0)",
    "uniform sampler2D tDiffuse;",
    "uniform highp vec2 uResolution;",
    "varying vec2 vPos;",
    "varying vec4 vPosPos;",
    "float FxaaLuma(vec3 rgb) {",
    "return dot(rgb, vec3(0.299, 0.587, 0.114));",
    "}",
    "void main() {",
    "float lumaNw = FxaaLuma(texture2D(tDiffuse, vPosPos.xy).rgb);",
    "float lumaSw = FxaaLuma(texture2D(tDiffuse, vPosPos.xw).rgb);",
    "float lumaNe = FxaaLuma(texture2D(tDiffuse, vPosPos.zy).rgb) + 1.0/384.0;",
    "float lumaSe = FxaaLuma(texture2D(tDiffuse, vPosPos.zw).rgb);",
    "vec3 rgbM = texture2D(tDiffuse, vPos.xy).rgb;",
    "float lumaM = FxaaLuma(rgbM.rgb);",
    "float lumaMax = max(max(lumaNe, lumaSe), max(lumaNw, lumaSw));",
    "float lumaMin = min(min(lumaNe, lumaSe), min(lumaNw, lumaSw));",
    "float lumaMaxSubMinM = max(lumaMax, lumaM) - min(lumaMin, lumaM);",
    "float lumaMaxScaledClamped = max(FXAA_EDGE_THRESHOLD_MIN, lumaMax * FXAA_EDGE_THRESHOLD);",
    "if (lumaMaxSubMinM < lumaMaxScaledClamped) {",
    "   gl_FragColor = vec4(rgbM, 1.0);",
    "   return;",
    "}",
    "float dirSwMinusNe = lumaSw - lumaNe;",
    "float dirSeMinusNw = lumaSe - lumaNw;",
    "vec2 dir1 = normalize(vec2(dirSwMinusNe + dirSeMinusNw, dirSwMinusNe - dirSeMinusNw));",
    "vec3 rgbN1 = texture2D(tDiffuse, vPos.xy - dir1 * FXAA_RCP_FRAME_OPT*uResolution).rgb;",
    "vec3 rgbP1 = texture2D(tDiffuse, vPos.xy + dir1 * FXAA_RCP_FRAME_OPT*uResolution).rgb;",
    "float dirAbsMinTimesC = min(abs(dir1.x), abs(dir1.y)) * FXAA_EDGE_SHARPNESS;",
    "vec2 dir2 = clamp(dir1.xy / dirAbsMinTimesC, -2.0, 2.0);",
    "vec3 rgbN2 = texture2D(tDiffuse, vPos.xy - dir2 * FXAA_RCP_FRAME_OPT2*uResolution).rgb;",
    "vec3 rgbP2 = texture2D(tDiffuse, vPos.xy + dir2 * FXAA_RCP_FRAME_OPT2*uResolution).rgb;",
    "vec3 rgbA = rgbN1 + rgbP1;",
    "vec3 rgbB = ((rgbN2 + rgbP2) * 0.25) + (rgbA * 0.25);",
    "float lumaB = FxaaLuma(rgbB);",
    "if ((lumaB < lumaMin) || (lumaB > lumaMax))",
    "   gl_FragColor = vec4(rgbA * 0.5, 1.0);",
    "else",
    "   gl_FragColor = vec4(rgbB, 1.0);",
    "}"

    ].join( "\n" )

};

/**
 * Utility code for object Id render target.
 */

CLOUD.IdTargetUtil = {
    addIdBufferFlagToMaterial: function (material) {

        if (CLOUD.GlobalData.EnableRenderPass) {
            material.idBuffer = true;
        }
    },

    idVarOfVertexShader: function(){
        // ID variables
        return '\n' + [
            "#ifdef ENABLE_VERTEX_ID",
            "uniform vec3 objId;",
            "varying   vec3 vId;",
            "#endif",
        ].join('\n') + '\n';
    },

    passIdInVertexShader: function() {
        // pass ID data
        return '\n' + [
            "    #ifdef ENABLE_VERTEX_ID",
            "        vId = objId;",
            "    #endif"
        ].join('\n') + '\n';
    },

    idVarOfFragShader: function() {
        // macro define and ID variable
        return '\n' + [
            "#ifdef ID_BUFFER_MRT",
            "#define gl_FragColor gl_FragData[0]",
            "varying vec3 vId;",
            "#endif"
        ].join('\n') + '\n';
    },

    writeIdInFragShader: function() {
        // write ID data to render target
        return '\n' + [
            "    #ifdef ID_BUFFER_MRT",
            "        gl_FragData[1] = vec4(vId, 1.0);",
            "    #endif"
        ].join('\n') + '\n';
    }
};
CLOUD.BBoxNode = function (boundingBox, color) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(72), 3));

    THREE.LineSegments.call(this, geometry, new THREE.LineBasicMaterial({ color: color }));

    if (boundingBox !== undefined) {
        this.updateBBox(boundingBox);
    }
};

CLOUD.BBoxNode.prototype = Object.create(THREE.LineSegments.prototype);
CLOUD.BBoxNode.prototype.constructor = CLOUD.BBoxNode;

CLOUD.BBoxNode.prototype.unload = function () {

}

CLOUD.BBoxNode.prototype.updateBBox = function (boundingBox) {
    var min = boundingBox.min;
    var max = boundingBox.max;

    /*
	  5____4
	1/___0/|
	| 6__|_7
	2/___3/
	0: max.x, max.y, max.z
	1: min.x, max.y, max.z
	2: min.x, min.y, max.z
	3: max.x, min.y, max.z
	4: max.x, max.y, min.z
	5: min.x, max.y, min.z
	6: min.x, min.y, min.z
	7: max.x, min.y, min.z
	*/

    var vertices = this.geometry.attributes.position.array;

    vertices[0] = max.x; vertices[1] = max.y; vertices[2] = max.z;
    vertices[3] = min.x; vertices[4] = max.y; vertices[5] = max.z;

    vertices[6] = min.x; vertices[7] = max.y; vertices[8] = max.z;
    vertices[9] = min.x; vertices[10] = min.y; vertices[11] = max.z;

    vertices[12] = min.x; vertices[13] = min.y; vertices[14] = max.z;
    vertices[15] = max.x; vertices[16] = min.y; vertices[17] = max.z;

    vertices[18] = max.x; vertices[19] = min.y; vertices[20] = max.z;
    vertices[21] = max.x; vertices[22] = max.y; vertices[23] = max.z;

    //

    vertices[24] = max.x; vertices[25] = max.y; vertices[26] = min.z;
    vertices[27] = min.x; vertices[28] = max.y; vertices[29] = min.z;

    vertices[30] = min.x; vertices[31] = max.y; vertices[32] = min.z;
    vertices[33] = min.x; vertices[34] = min.y; vertices[35] = min.z;

    vertices[36] = min.x; vertices[37] = min.y; vertices[38] = min.z;
    vertices[39] = max.x; vertices[40] = min.y; vertices[41] = min.z;

    vertices[42] = max.x; vertices[43] = min.y; vertices[44] = min.z;
    vertices[45] = max.x; vertices[46] = max.y; vertices[47] = min.z;

    //

    vertices[48] = max.x; vertices[49] = max.y; vertices[50] = max.z;
    vertices[51] = max.x; vertices[52] = max.y; vertices[53] = min.z;

    vertices[54] = min.x; vertices[55] = max.y; vertices[56] = max.z;
    vertices[57] = min.x; vertices[58] = max.y; vertices[59] = min.z;

    vertices[60] = min.x; vertices[61] = min.y; vertices[62] = max.z;
    vertices[63] = min.x; vertices[64] = min.y; vertices[65] = min.z;

    vertices[66] = max.x; vertices[67] = min.y; vertices[68] = max.z;
    vertices[69] = max.x; vertices[70] = min.y; vertices[71] = min.z;

    this.geometry.attributes.position.needsUpdate = true;

    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();
    this.matrixAutoUpdate = false;
};
//CLOUD.CombinedCamera = function (width, height, fov, near, far) {
CLOUD.CombinedCamera = function (type, params) {

    THREE.Camera.call(this);

    this.target = new THREE.Vector3();

    this.name = params.name || "";
    this.near = params.near;
    this.far = params.far;

    if (type === CLOUD.CAMERATYPE.PERSPECTIVE) {

        this.aspect = params.width / params.height;
        this.fov = params.fov;

        this.left = -params.width / 2;
        this.right = params.width / 2;
        this.top = params.height / 2;
        this.bottom = -params.height / 2;

        this.perspectiveCamera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.orthoCamera = null;

        this.toPerspective();
    }
    else {
        this.left = params.left;
        this.right = params.right;
        this.top = params.top;
        this.bottom = params.bottom;
        this.fov = 45;
        this.aspect = (this.right - this.left) / (this.top - this.bottom);

        this.orthoCamera = new THREE.OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);
        this.perspectiveCamera = null;

        this.orthoCamera.updateProjectionMatrix();
        this.projectionMatrix = this.orthoCamera.projectionMatrix;
        this.isPerspective = false;
    }

    this.zoom = params.zoom || 1;

};

CLOUD.CombinedCamera.prototype = Object.create(THREE.Camera.prototype);
CLOUD.CombinedCamera.prototype.constructor = CLOUD.CombinedCamera;

CLOUD.CombinedCamera.prototype.toPerspective = function () {

    if (this.perspectiveCamera === null) {
        Console.log("Can not convert to perspective camera because the camera original type is orthographic.");
        return;
    }

    this.perspectiveCamera.aspect = this.aspect;
    this.perspectiveCamera.near = this.near;
    this.perspectiveCamera.far = this.far;
    // this.perspectiveCamera.fov = this.fov / this.zoom;
    this.perspectiveCamera.fov = this.fov;
    this.perspectiveCamera.updateProjectionMatrix();
    this.projectionMatrix = this.perspectiveCamera.projectionMatrix;
    this.isPerspective = true;
    this.dirty = true;
};

// TODO: toOrthographic() and toPerspective() is always called when setNearFar()
//        because we support user cameras which do not support to swith the orthographic/perspective mode,
//        we should not use the combined camera to represent them. Refactor the camera class.
//
CLOUD.CombinedCamera.prototype.toOrthographic = function () {

    if (this.orthoCamera === null) {
        this.orthoCamera = new THREE.OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);
    }

    var fov = this.fov;

    // near,far会变化，position和target距离大部分情况下不会发生变化（zoomToBox调用下会变）
    // var hyperFocus = ( this.near + this.far ) / 2;
    var hyperFocus = this.target.clone().sub(this.position).length();
    var halfHeight = Math.tan(fov * Math.PI / 180 / 2) * hyperFocus;
    var halfWidth = halfHeight * this.aspect;

    halfHeight /= this.zoom;
    halfWidth /= this.zoom;

    this.left = this.orthoCamera.left = -halfWidth;
    this.right = this.orthoCamera.right = halfWidth;
    this.top = this.orthoCamera.top = halfHeight;
    this.bottom = this.orthoCamera.bottom = -halfHeight;

    this.orthoCamera.near = this.near;
    this.orthoCamera.far = this.far;
    this.orthoCamera.updateProjectionMatrix();
    this.projectionMatrix = this.orthoCamera.projectionMatrix;
    this.isPerspective = false;
    this.dirty = true;
};


CLOUD.CombinedCamera.prototype.setSize = function (width, height) {

    this.left = -width / 2;
    this.right = width / 2;
    this.top = height / 2;
    this.bottom = -height / 2;
    this.aspect = width / height;
    this.dirty = true;
};

CLOUD.CombinedCamera.prototype.setFov = function (fov) {

    this.fov = fov;
    this.dirty = true;
    this.updateProjectionMatrix();

};

CLOUD.CombinedCamera.prototype.setNearFar = function (near, far) {

    this.near = near;
    this.far = far;
    this.dirty = true;
    this.updateProjectionMatrix();

};

// For mantaining similar API with PerspectiveCamera
CLOUD.CombinedCamera.prototype.updateProjectionMatrix = function () {

    if (this.isPerspective) {

        this.toPerspective();

    } else {

        this.toOrthographic();

    }

};

/*
 * Uses Focal Length (in mm) to estimate and set FOV
 * 35mm (fullframe) camera is used if frame size is not specified;
 * Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
 */
CLOUD.CombinedCamera.prototype.setLens = function (focalLength, frameHeight) {

    if (frameHeight === undefined) frameHeight = 24;

    var fov = 2 * THREE.Math.radToDeg(Math.atan(frameHeight / ( focalLength * 2 )));

    this.setFov(fov);
    this.dirty = true;
    return fov;
};


CLOUD.CombinedCamera.prototype.setZoom = function (zoom) {

    this.zoom = zoom;
    this.dirty = true;
    this.updateProjectionMatrix();

};

CLOUD.CombinedCamera.prototype.copy = function (source) {

    THREE.Camera.prototype.copy.call( this, source );

    this.target.copy(source.target);

    this.aspect = source.aspect;
    this.fov = source.fov;
    this.near = source.near;
    this.far = source.far;

    this.left =source.left;
    this.right = source.right;
    this.top = source.top;
    this.bottom = source.bottom;

    this.zoom = source.zoom;
    this.isPerspective = source.isPerspective;

    this.orthoCamera.copy(source.orthoCamera);
    this.perspectiveCamera.copy(source.perspectiveCamera);

};

CLOUD.Animation = function () {

    var _scope = this;
    var _object = null;
    var _valuesStart = {};
    var _valuesEnd = {};
    var _duration = 1000;
    var _startTime = null;
    //var _isPlaying = false;
    var _timerId = null;
    var _tolerance = 0.9995;
    var _interpolationFunction = null;

    var _onStartCallbackFired = false;
    var _onStartCallback = null;
    var _onUpdateCallback = null;
    var _onCompleteCallback = null;

    this.from = function(properties){

        _object = properties;

        // 保存开始值
        for (var field in _object) {
            _valuesStart[field] = _object[field];
        }

        return this;
    };

    this.to = function(properties, duration) {

        if (duration !== undefined) {
            _duration = duration;
        }

        _valuesEnd = properties;
        return this;
    };

    this.onStart = function (callback) {

        _onStartCallback = callback;
        return this;
    };

    this.onUpdate = function (callback) {

        _onUpdateCallback = callback;
        return this;
    };

    this.onComplete = function (callback) {

        _onCompleteCallback = callback;
        return this;
    };

    this.start = function( frameTime ) {

        _onStartCallbackFired = false;

        // 连续点击，会生成很多id
        // 先清除之前的id
        if (_timerId) {
            clearInterval(_timerId);
        }

        //_startTime = window.performance.now();
        _startTime = Date.now();

        _interpolationFunction = this.interpolate;

        var animate = function() {

            var elapsed;
            var start = _valuesStart;
            var end = _valuesEnd;
            //var time = window.performance.now();
            var time = Date.now();

            if (_onStartCallbackFired === false) {

                if (_onStartCallback !== null) {
                    _onStartCallback.call(_object);
                }

                _onStartCallbackFired = true;
            }

            elapsed = (time - _startTime) / _duration;
            elapsed = elapsed > 1 ? 1 : elapsed;

            _object = _interpolationFunction(start, end, elapsed);

            if (elapsed === 1) {

                // 清除计时器
                clearInterval(_timerId);

                if (_onCompleteCallback !== null) {
                    _onCompleteCallback.call(_object);
                }
            } else {

                if (_onUpdateCallback !== null) {
                    _onUpdateCallback.call(_object, elapsed);
                }
            }
        };

        // 启动计时器
        _timerId = setInterval(animate, frameTime);
    };

    //判断两向量角度是否大于180°，大于180°返回真，否则返回假
    this.isAngleGreaterThanPi = function(start, end, up){

        // 根据混合积来判断角度
        var dir = new THREE.Vector3();
        dir.crossVectors(start, end);

        var volume = dir.dot(up);

        //dir 与 up 同向 - 小于 180°
        if (volume >= 0) {
            return false;
        }

        return true;
    };

    // 锥形底面圆弧插值
    this.conicInterpolate = function(start, end, interp, percentage, islargeangle) {

        // 场景旋转和相机旋转方向是反的
        var angle = -Math.PI * percentage;

        // 大角度的情况：以小弧度旋转
        if (islargeangle) {
            angle *= -1;
        }

        // 旋转轴
        var axis = new THREE.Vector3();
        axis.addVectors(end, start).normalize();

        // 从 start 开始绕轴 axis 旋转 angle
        var quat = new THREE.Quaternion();
        quat.setFromAxisAngle(axis, angle);

        interp.copy(start);
        interp.applyQuaternion(quat);
    };

    // 球形插值
    this.slerpInterpolate = function(start, end, up, interp, percentage, tolerance, isconic, islargeangle) {
        var unitX = new THREE.Vector3( 1, 0 , 0 );
        var unitZ = new THREE.Vector3( 0, 0 , 1);
        var middle = new THREE.Vector3(); // 中间量
        var step = 0;
        var cosTheta = start.dot(end);
        // 构造四元数
        var startQuaternion = new THREE.Quaternion(start.x, start.y, start.z, 1).normalize();
        var endQuaternion = new THREE.Quaternion(end.x, end.y, end.z, 1).normalize();
        var midQuaternion = new THREE.Quaternion(0, 0, 0 ,1);
        var slerpQuaternion = new THREE.Quaternion(0, 0, 0 ,1);

        if (isconic === undefined) {
            isconic = false;
        }

        if (islargeangle === undefined) {
            islargeangle = false;
        }

        // start == end (0度)
        if (tolerance < cosTheta){
            interp.copy(end);
        } else  if (tolerance < Math.abs(cosTheta)) {// start == -end (180度)

            //if ( tolerance > Math.abs( start.dot( unitZ )) ) {
            //    //CLOUD.Logger.log("unitZ");
            //    middle.crossVectors(start , unitZ).normalize();
            //} else {
            //    //CLOUD.Logger.log("unitX");
            //    middle.crossVectors(start , unitX).normalize();
            //}

            middle.crossVectors(start , up).normalize();

            // 中间量四元数
            midQuaternion.set(middle.x, middle.y, middle.z, 1).normalize();

            if (percentage < 0.5) {
                step = percentage * 2;
                THREE.Quaternion.slerp(startQuaternion, midQuaternion, slerpQuaternion, step);
                interp.set(slerpQuaternion.x, slerpQuaternion.y, slerpQuaternion.z);
            } else {
                step = (percentage - 0.5) * 2;
                THREE.Quaternion.slerp(midQuaternion, endQuaternion, slerpQuaternion, step);
                interp.set(slerpQuaternion.x, slerpQuaternion.y, slerpQuaternion.z);
            }

        } else { // start != abs(end)

            if (isconic ){
                //CLOUD.Logger.log("[slerpInterpolate][isconic]");
                this.conicInterpolate(start, end, interp, percentage, islargeangle);
            } else {
                THREE.Quaternion.slerp(startQuaternion, endQuaternion, slerpQuaternion, percentage);
                interp.set(slerpQuaternion.x, slerpQuaternion.y, slerpQuaternion.z);
            }
        }

        interp.normalize();
    };

    // 线性插值
    this.linearInterpolate = function(start, end, interp, percentage, tolerance) {
        var unitX = new THREE.Vector3( 1, 0 , 0 );
        var unitZ = new THREE.Vector3( 0, 0 , 1);
        var middle = new THREE.Vector3(); // 中间量
        var step = 0;
        var cosTheta = start.dot(end);

        // start == end (0度)
        if (tolerance < cosTheta){
            interp.copy(end);
        } else if (tolerance < -cosTheta) {// start == -end (180度)

            if ( tolerance > Math.abs( start.dot( unitZ )) ) {
                middle.crossVectors(start, unitZ).normalize();
            } else {
                middle.crossVectors(start, unitX).normalize();
            }

            // 非均匀插值，每段变化角度不一样
            if (percentage < 0.5) {
                step = percentage * 2;
                interp.lerpVectors(start, middle, step);
            } else {
                step = (percentage - 0.5) * 2;
                interp.lerpVectors(middle, end, step);
            }

        }else { // start != abs(end)
            interp.lerpVectors(start, end, percentage);
        }

        interp.normalize();
    };

    // 插值处理
    this.interpolate = function (valuesStart, valuesEnd, percentage) {
        var startRightDir = new THREE.Vector3();
        var endRightDir = new THREE.Vector3();

        // 插值结果
        var interpDir = new THREE.Vector3();
        var interpUp = new THREE.Vector3();

        var startDir = valuesStart.animDir;
        var startUp = valuesStart.animUp;
        var endDir = valuesEnd.animDir;
        var endUp = valuesEnd.animUp;

        startRightDir.crossVectors(startDir, startUp);
        endRightDir.crossVectors(endDir, endUp);

        var cosTheta = startRightDir.dot(endRightDir);
        var threshold = _tolerance - 1;

        // 判断方向是否变化，则采用锥形底面圆弧插值
        var dirChange = cosTheta < threshold ? true : false;

        // 判断两向量角度是否大于180
        var isLargeAngle = _scope.isAngleGreaterThanPi(startDir, endDir, startUp);

        // 计算插值量 - dir
        _scope.slerpInterpolate(startDir, endDir, startUp, interpDir, percentage, _tolerance, dirChange, isLargeAngle);

        // 计算插值量 - up
        _scope.linearInterpolate(startUp, endUp, interpUp, percentage, _tolerance);

        return {
            animDir: interpDir,
            animUp: interpUp
        };
    };

};
CLOUD.CameraAnimator = function () {
  
    var _duration = 500;// 500毫秒
    var _frameTime = 13; // 周期性执行或调用函数之间的时间间隔，以毫秒计
    var _animation = new CLOUD.Animation();

    this.setDuration = function (duration) {
        _duration = duration;
    };

    this.setFrameTime = function (frameTime) {
        _frameTime = frameTime;
    };

    this.setStandardView = function (stdView, viewer, box, margin, callback) {

        var redoRender = function (viewer, box) {

            // fit all
            var target = viewer.camera.zoomToBBox(box, margin);
            viewer.cameraControl.update(true, true);

            // 增加回调
            callback && callback();
        };

        var camera = viewer.camera;
        var focal = CLOUD.GlobalData.SceneSize / 2;
        var threshold = 0.9995;

        // 1. 记录动画开始参数
        var startDir = camera.getWorldDirection().clone();
        startDir.normalize();

        var startUp = new THREE.Vector3();
        startUp.copy(camera.realUp || camera.up);
        startUp.normalize();

        // 2. 设置视图模式
        // 场景可能没有加载起来
        // var box = viewer.getScene().getBoundingBox();
        var target = camera.setStandardView(stdView, box);

        // 3. 记录动画结束参数
        var endDir = camera.getWorldDirection().clone();
        endDir.normalize();

        var endUp = new THREE.Vector3();
        endUp.copy(camera.realUp || camera.up);
        endUp.normalize();

        // 开始结束点之间角度
        var cosThetaDir = startDir.dot(endDir);
        var cosThetaUp = startUp.dot(endUp);

        // dir和up都一样, 无动画
        if (threshold < cosThetaDir && threshold < cosThetaUp) {

            // 绘制
            redoRender(viewer, box);

            camera.up.copy(THREE.Object3D.DefaultUp);

        } else {

            viewer.getEditorManager().setInteractiveState(false); // 动画中

            // 启动定时器
            _animation.from({animDir: startDir, animUp: startUp}).to({
                animDir: endDir,
                animUp: endUp
            }, _duration).onUpdate(function () {
                if (viewer.viewHouse) {
                    viewer.viewHouse.isAnimationFinish = false;
                }

                // 传入更新值,这里的this是 CLOUD.Animation._object
                var interpDir = this.animDir;
                var interpUp = this.animUp;

                viewer.camera.LookAt(target, interpDir, interpUp, focal);

                redoRender(viewer, box);
            }).onComplete(function () {

                if (viewer.viewHouse) {
                    // 处理最后一帧
                    viewer.viewHouse.isAnimationFinish = true; // 标记ViewHouse动画结束
                }

                viewer.camera.LookAt(target, endDir, endUp, focal);

                // 绘制
                redoRender(viewer, box);

                viewer.getEditorManager().setInteractiveState(true); //动画结束
                viewer.camera.up.copy(THREE.Object3D.DefaultUp);// 渲染完成后才可以恢复相机up方向
            }).start(_frameTime);
        }
    };

    // 先采用一个简单的接口实现转场动画，后续新建任务，重构这部分代码
    this.active = function (startCameraInfo, endCameraInfo, viewer, callbackProcess, callbackFinish) {

        var camera = viewer.camera;
        var threshold = 0.9995;

        // 1. 记录动画开始参数
        var position = new THREE.Vector3(startCameraInfo.position.x, startCameraInfo.position.y, startCameraInfo.position.z);
        var target = new THREE.Vector3(startCameraInfo.target.x, startCameraInfo.target.y, startCameraInfo.target.z);
        var up = new THREE.Vector3(startCameraInfo.up.x, startCameraInfo.up.y, startCameraInfo.up.z);

        var startDir = target.clone().sub(position).normalize();
        var startUp = up.clone().normalize();

        // 2. 记录动画结束参数
        position.set(endCameraInfo.position.x, endCameraInfo.position.y, endCameraInfo.position.z);
        target.set(endCameraInfo.target.x, endCameraInfo.target.y, endCameraInfo.target.z);
        up.set(endCameraInfo.up.x, endCameraInfo.up.y, endCameraInfo.up.z);

        var endDir = target.clone().sub(position);
        var focal = endDir.length();
        endDir.normalize();
        var endUp = up.clone().normalize();

        // 开始结束点之间角度
        var cosThetaDir = startDir.dot(endDir);
        var cosThetaUp = startUp.dot(endUp);

        // dir和up都一样, 无动画
        if (threshold < cosThetaDir && threshold < cosThetaUp) {

            camera.LookAt(target, endDir, endUp, focal);

            // 增加回调
            callbackProcess && callbackProcess(target);

            callbackFinish && callbackFinish();

            camera.up.copy(THREE.Object3D.DefaultUp);

        } else {

            viewer.getEditorManager().setInteractiveState(false); // 动画中

            // TODO:
            // 启动定时器
            _animation.from({animDir: startDir, animUp: startUp}).to({
                animDir: endDir,
                animUp: endUp
            }, _duration).onUpdate(function () {

                // 传入更新值,这里的this是 CLOUD.Animation._object
                var interpDir = this.animDir;
                var interpUp = this.animUp;

                camera.LookAt(target, interpDir, interpUp, focal);

                // 增加回调
                callbackProcess && callbackProcess(target);

            }).onComplete(function () {

                camera.LookAt(target, endDir, endUp, focal);

                // 增加回调
                callbackProcess && callbackProcess(target);

                callbackFinish && callbackFinish();

                viewer.getEditorManager().setInteractiveState(true); //动画结束
                camera.up.copy(THREE.Object3D.DefaultUp);// 渲染完成后才可以恢复相机up方向

            }).start(_frameTime);
        }
    };
};



/**
 * Created by liuyt-d on 2017/5/17 0017.
 */

CLOUD.PhongLightingMaterial = function (parameters) {

    THREE.ShaderMaterial.call(this);

    this.type = 'PhoneLightingMaterial';

    this.color = new THREE.Color(0xffffff); // diffuse
    this.specular = new THREE.Color(0x111111);
    this.shininess = 30;
    this.emissive = new THREE.Color(0x000000);

    this.defines = {};
    this.uniforms = THREE.UniformsUtils.merge( [

        THREE.UniformsLib[ "lights" ],
        {
            diffuse: {value: new THREE.Color(0xFF0000)},
            opacity: {value: 1.0},

            specular: { value: new THREE.Color( 0x111111 ) },
            shininess: { value: 30 },
            emissive: { value: new THREE.Color( 0x000000 ) }
        }

    ] );

    this.vertexShader = [
        "varying vec3 vViewPosition;",
        "varying vec3 vNormal;",
        "void main() {",
        "   #include <begin_vertex>",
        "   #include <project_vertex>",
        "   #include <beginnormal_vertex>",
        "   #include <defaultnormal_vertex>",
        "   vNormal = normalize( transformedNormal );",
        "   vViewPosition = - mvPosition.xyz;",
        "}"
    ].join("\n");

    this.fragmentShader = [
        "uniform vec3 diffuse;",
        "uniform float opacity;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        "uniform vec3 emissive;",
        "#include <common>",
        "#include <packing>",
        "#include <bsdfs>",
        "#include <lights_pars>",
        "#include <lights_phong_pars_fragment>",
        "#include <specularmap_pars_fragment>",
        "void main() {",
        "   vec4 diffuseColor = vec4( diffuse, opacity );",
        "   ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
        "   vec3 totalEmissiveRadiance = emissive;",
        "   float specularStrength = 1.0;",
        "   #include <normal_flip>",
        "   #include <normal_fragment>",
        "   #include <lights_phong_fragment>",
        "   #include <lights_template>",
        "   vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;",
        "   gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
        "   #if defined( TONE_MAPPING )",
        "       gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );",
        "   #endif",
        "   gl_FragColor = linearToOutputTexel( gl_FragColor );",
        "}"
    ].join("\n");

    this.lights = true; // set to use scene lights

    // When rendered geometry doesn't include these attributes but the material does,
    // use these default values in WebGL. This avoids errors when buffer data is missing.
    this.defaultAttributeValues = {
        'color': [1, 1, 1],
        'uv': [0, 0],
        'uv2': [0, 0]
    };

    if (parameters !== undefined) {

        if (parameters.attributes !== undefined) {

            console.error('PhoneLightingMaterial: attributes should now be defined in THREE.BufferGeometry instead.');

        }

        this.setValues(parameters);

    }

    this.refreshUniforms();
}

//CLOUD.PhongLightingMaterial.prototype = new THREE.ShaderMaterial;
CLOUD.PhongLightingMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype);
CLOUD.PhongLightingMaterial.prototype.constructor = CLOUD.PhongLightingMaterial;

CLOUD.PhongLightingMaterial.prototype.isShaderMaterial = true;

CLOUD.PhongLightingMaterial.prototype.copy = function (source) {

    THREE.ShaderMaterial.prototype.copy.call(this, source);

    this.color.copy(source.color);
    this.specular.copy(source.specular);
    this.shininess = source.shininess;
    this.emissive.copy(source.emissive);

    return this;

};

CLOUD.PhongLightingMaterial.prototype.refreshUniforms = function () {
    this.uniforms.diffuse.value.set(this.color);
    this.uniforms.opacity.value = this.opacity;

    this.uniforms.specular.value.set(this.specular);
    this.uniforms.shininess.value = this.shininess;
    this.uniforms.emissive.value.set(this.emissive);
};
/**
 * The object to be held within the Object Pool.
 *
 * @class  CLOUD.MeshEx
 */
CLOUD.MeshEx = function () {

    THREE.Mesh.call(this);

    this.type = 'MeshEx';

    this.matrixAutoUpdate = false; // disable auto update
    this.alive = false; // 是否激活, 默认不激活

    this.geometry = CLOUD.GeomUtil.EmptyGeometry;
    this.material = CLOUD.MaterialUtil.DefaultMaterial;

    this.originalId = undefined;

};

CLOUD.MeshEx.prototype = Object.create(THREE.Mesh.prototype);
CLOUD.MeshEx.prototype.constructor = CLOUD.MeshEx;

/**
 * Sets an object not in use to default values
 */
CLOUD.MeshEx.prototype.init = function (parameters) {

    if (parameters && parameters.parent) {
        parameters.parent.add(this);
    }

};

/**
 * destroy the object
 */
CLOUD.MeshEx.prototype.destroy = function () {

    if (this.parent) {
        this.parent.remove(this);
    }

    if (this.userData) {
        this.userData = null;
    }

    this.geometry = null;
    this.material = null;
};

/**
 * Spawn an object
 */
CLOUD.MeshEx.prototype.spawn = function (parameters) {

    if (parameters.userId !== undefined) {
        this.name = parameters.userId;
    } else if (parameters.nodeId !== undefined) {
        this.name = parameters.nodeId;
    }

    if (parameters.geometry) {
        this.geometry = parameters.geometry;
    }

    if (parameters.material) {
        this.material = parameters.material;
    }

    if (parameters.matrix) {
        this.matrix.copy(parameters.matrix);
        this.updateMatrixWorld(true);//  this.matrixAutoUpdate = false;需要强制更新
    } else {
        this.matrix.identity();
        this.updateMatrixWorld(true);//  this.matrixAutoUpdate = false;需要强制更新
    }

    if (parameters.databagId) {
        this.databagId = parameters.databagId;
    } else {
        this.databagId = "";
    }

    if (parameters.userData) {
        this.userData = parameters.userData;
    } else {
        if (this.userData) {
            this.userData = null;
        }
    }

    if (parameters.originalId) {
        this.originalId = parameters.originalId;
    }

    this.renderOrder = parameters.renderOrder;
    
    this.alive = true;
   
    // 适配Three.js
    this.frustumCulled = false;
    this.material.visible = true;
};

/**
 * Resets the object values to default
 */
CLOUD.MeshEx.prototype.clear = function () {

    this.geometry = CLOUD.GeomUtil.EmptyGeometry;
    this.material = CLOUD.MaterialUtil.DefaultMaterial;
    this.alive = false;
    this.visible = true; // 每次重置为true，以防止隐藏过构件
    // 适配Three.js
    this.frustumCulled = true;
    this.material.visible = false;
};

// why need alive flag???
CLOUD.MeshEx.prototype.isVisible = function() {
    return this.visible && this.alive;
}

/**
 * Intersect the mesh boundbox with ray, return the near distance from
 * ray to bounding box.
 * If not intersect, return -1.
 */
CLOUD.MeshEx.prototype.intersectBoxWithDistance = (function () {
    var bbox = new THREE.Box3();

    return function (raycaster) {
        var geometry = this.geometry;
        var material = this.material;
        var matrixWorld = this.matrixWorld;

        if (material === undefined)
            return -1;

        // Checking boundingSphere distance to ray
        if (geometry.boundingBox === null) geometry.computeBoundingBox();

        bbox.copy(geometry.boundingBox);
        bbox.applyMatrix4(matrixWorld);

        return raycaster.ray.intersectBoxWithDistance(bbox);
    }
}());

/**
 * 对象池中的对象类型
 *
 * @class  CLOUD.MaterialEx
 */
CLOUD.MaterialEx = function () {

    this.materialDefaultParams = {color: 0xdddddd, opacity: 0.5, transparent: true, side: THREE.DoubleSide};
    this.material = CLOUD.MaterialUtil.createStandardMaterial(this.materialDefaultParams);
};

/**
 * 卸载对象资源
 *
 */
CLOUD.MaterialEx.prototype.destroy = function () {
    this.material = null;
};

/**
 * 重置颜色
 *
 */
CLOUD.MaterialEx.prototype.resetColor = function () {

    this.material.color.setHex(this.materialDefaultParams.color);
    // this.material.needsUpdate = true;

};

/**
 * 重置透明度
 *
 */
CLOUD.MaterialEx.prototype.resetOpacity = function () {

    this.material.opacity = this.materialDefaultParams.opacity;
    // this.material.needsUpdate = true;

};

/**
 * 重置
 *
 */
CLOUD.MaterialEx.prototype.reset = function () {

    this.material.color.setHex(this.materialDefaultParams.color);
    this.material.opacity = this.materialDefaultParams.opacity;
    this.material.transparent = this.materialDefaultParams.transparent;
    this.material.side = this.materialDefaultParams.side;
    this.material.needsUpdate = true;

};


/**
 * Custom Pool object. Holds objects to be managed to prevent
 * garbage collection.
 *
 * @class  CLOUD.ObjectPool
 */
CLOUD.ObjectPool = function (classType, size) {

    this.cls = classType;
    this.size = size;// Max objects allowed in the pool
    this._pool = [];
    this.counter = 0;
};

/**
 * Populates the pool array with objects
 */
CLOUD.ObjectPool.prototype.init = function (parameters) {

    for (var i = 0, len = this.size; i < len; ++i) {

        // Initialize the objects
        var obj = new this.cls();
        obj.init(parameters);
        this._pool[i] = obj;

    }
};

CLOUD.ObjectPool.prototype.resize = function (size, parameters) {

    this.size = size;
    this.collect();
    this.init(parameters);
};

/**
 * Grabs the last item in the list and initializes it and
 * pushes it to the front of the array.
 */
CLOUD.ObjectPool.prototype.get = function (parameters) {

    if (this.counter >= this.size) {
        // CLOUD.Logger.log("the pool is full");
        return -1;
    }

    var object = this._pool[this.counter];
    object.spawn(parameters);

    ++this.counter;

    return this.counter - 1;
};

CLOUD.ObjectPool.prototype.clear = function () {

    for (var i = 0, len = this.size; i < len; ++i) {
        this._pool[i].clear();
    }

    this.counter = 0;

};

CLOUD.ObjectPool.prototype.destroy = function () {

    // for (var i = 0, len = this.size; i < len; ++i) {
    //     this._pool[i].destroy();
    // }

    this.collect();
};

/**
 * Allow collection of all objects in the pool
 */
CLOUD.ObjectPool.prototype.collect = function() {

    // just forget the list and let the garbage collector reap them
    this._pool = []; // fresh and new
    this.counter = 0;
};

CLOUD.ObjectPool.prototype.getObjects = function () {
    return this._pool;
};

// --------------------------------------------------------- //
/**
 * 可扩容对象池
 *
 * @class  CLOUD.ExpandableObjectPool
 */
CLOUD.ExpandableObjectPool = function () {

    this.size = 0;
    this.counter = 0;
    this.expansion = 1;
    this._pool = null;

};

/**
 * 初始化对象池
 *
 * @param {Object} classType - 对象类型
 * @param {Number} initialSize - 初始大小
 */
CLOUD.ExpandableObjectPool.prototype.init = function (classType, initialSize) {

    this.classType = classType;
    this._pool = [];

    this._expand(initialSize);
};

/**
 * 构造一组新对象来扩展对象池
 *
 * @param {Number} howMany - 添加的新对象的数量
 */
CLOUD.ExpandableObjectPool.prototype._expand = function (howMany) {

    this.size += howMany;

    for (var i = 0; i < howMany; i++) {
        this._pool.push(new this.classType());
    }

};

/**
 * 从对象池中取出可以使用的对象
 *
 * @return {Object} 对象池中的一个对象
 */
CLOUD.ExpandableObjectPool.prototype.acquire = function () {

    if (this.counter >= this.size) {

        // 扩展空间(扩展20%，最小1)
        this.expansion = Math.round(this.expansion * 1.2) + 1;
        this._expand(this.expansion);

        console.log("_expand");

    }

    return this._pool[this.counter++];
};

/**
 * 清除对象池状态
 *
 */
CLOUD.ExpandableObjectPool.prototype.clear = function () {

    this.counter = 0;

};

/**
 * 卸载对象池资源
 *
 */
CLOUD.ExpandableObjectPool.prototype.destroy = function () {

    for (var i = 0, len = this.size; i < len; ++i) {
        this._pool[i].destroy();
    }

    this.counter = 0;
    this.size = 0;
    this.expansion = 1;
    this._pool = null;

};

/**
 * 获得对象池中的所有对象
 *
 */
CLOUD.ExpandableObjectPool.prototype.getObjects = function () {
    return this._pool;
};



var lights_fillFace_template = [
    "GeometricContext geometry;",
	"geometry.position = - vViewPosition;",
	//change fillFace's normal
	"#if NUM_CLIPPING_PLANES == 1",
	"	if (gl_FrontFacing) geometry.normal = normal;",
	"	else if (fillFaceClipDistance < 0.0) geometry.normal = -clippingPlanes[0].xyz;",
	"	else geometry.normal = -normal;",
	"#else",
	"	geometry.normal = normal;",
	"#endif",
	"geometry.viewDir = normalize( vViewPosition );",

	"IncidentLight directLight;",

	"#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )",

	"	PointLight pointLight;",

	"	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",

	"		pointLight = pointLights[ i ];",
	"		getPointDirectLightIrradiance( pointLight, geometry, directLight );",

	"		#ifdef USE_SHADOWMAP",
	"		directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;",
	"		#endif",

	"		RE_Direct( directLight, geometry, material, reflectedLight );",

	"	}",

	"#endif",

	"#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )",

	"	SpotLight spotLight;",

	"	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {",

	"		spotLight = spotLights[ i ];",

	"		getSpotDirectLightIrradiance( spotLight, geometry, directLight );",

	"		#ifdef USE_SHADOWMAP",
	"		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;",
	"		#endif",

	"	RE_Direct( directLight, geometry, material, reflectedLight );",

	"	}",

	"#endif",

	"#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )",

	"	DirectionalLight directionalLight;",

	"	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {",

	"		directionalLight = directionalLights[ i ];",

	"		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );",

	"		#ifdef USE_SHADOWMAP",
	"		directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;",
	"		#endif",

	"		RE_Direct( directLight, geometry, material, reflectedLight );",

	"	}",

	"#endif",

	"#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )",

	"	RectAreaLight rectAreaLight;",

	"	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {",

	"		rectAreaLight = rectAreaLights[ i ];",
	"		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );",

	"	}",

	"#endif",

	"#if defined( RE_IndirectDiffuse )",

	"	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );",

	"	#ifdef USE_LIGHTMAP",

	"		vec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;",

	"		#ifndef PHYSICALLY_CORRECT_LIGHTS",

	"			lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage",

	"		#endif",

	"		irradiance += lightMapIrradiance;",

	"	#endif",

	"	#if ( NUM_HEMI_LIGHTS > 0 )",

	"		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {",

	"			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );",

	"		}",

	"	#endif",

	"	#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )",

			// TODO, replace 8 with the real maxMIPLevel
	"		irradiance += getLightProbeIndirectIrradiance( /*lightProbe,*/ geometry, 8 );",

	"	#endif",

	"	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );",

	"#endif",

	"#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )",

		// TODO, replace 8 with the real maxMIPLevel
	"	vec3 radiance = getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry, Material_BlinnShininessExponent( material ), 8 );",

	"	#ifndef STANDARD",
	"		vec3 clearCoatRadiance = getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry, Material_ClearCoat_BlinnShininessExponent( material ), 8 );",
	"	#else",
	"		vec3 clearCoatRadiance = vec3( 0.0 );",
	"	#endif",

	"	RE_IndirectSpecular( radiance, clearCoatRadiance, geometry, material, reflectedLight );",

	"#endif"

].join('\n');
var fillFaceFragment = [
    "#define PHONG",

    "uniform vec3 diffuse;",
    "uniform vec3 emissive;",
    "uniform vec3 specular;",
    "uniform float shininess;",
    "uniform float opacity;"
].join('\n') +
    CLOUD.IdTargetUtil.idVarOfFragShader() +
    [
    "#include <common>",
    "#include <packing>",
    "#include <dithering_pars_fragment>",
    "#include <color_pars_fragment>",
    "#include <uv_pars_fragment>",
    "#include <uv2_pars_fragment>",
    "#include <map_pars_fragment>",
    "#include <alphamap_pars_fragment>",
    "#include <aomap_pars_fragment>",
    "#include <lightmap_pars_fragment>",
    "#include <emissivemap_pars_fragment>",
    "#include <envmap_pars_fragment>",
    "#include <gradientmap_pars_fragment>",
    "#include <fog_pars_fragment>",
    "#include <bsdfs>",
    "#include <lights_pars>",
    "#include <lights_phong_pars_fragment>",
    "#include <shadowmap_pars_fragment>",
    "#include <bumpmap_pars_fragment>",
    "#include <normalmap_pars_fragment>",
    "#include <specularmap_pars_fragment>",
    "#include <logdepthbuf_pars_fragment>",
    "#include <clipping_planes_pars_fragment>",

    "void main() {",

    "	#include <clipping_planes_fragment>",

    "	vec4 diffuseColor = vec4( diffuse, opacity );",
    "	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
    "	vec3 totalEmissiveRadiance = emissive;",

    "	#include <logdepthbuf_fragment>",
    "	#include <map_fragment>",
    "	#include <color_fragment>",
    "	#include <alphamap_fragment>",
    "	#include <alphatest_fragment>",
    "	#include <specularmap_fragment>",
    "	#include <normal_flip>",
    "	#include <normal_fragment>",
    "	#include <emissivemap_fragment>",

    "   float fillFaceClipDistance = 0.0;",
    "   #if NUM_CLIPPING_PLANES == 1",
    "       vec4 plane = clippingPlanes[ 0 ];",
	"	    fillFaceClipDistance = dot( vViewPosition, plane.xyz ) - plane.w;",
    "   #endif",

        // accumulation
    "	#include <lights_phong_fragment>",
    "	#include <lights_fillFace_template>",

        // modulation
    "	#include <aomap_fragment>",

    "	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;",

    "	#include <envmap_fragment>",

    "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",

    "	#include <tonemapping_fragment>",
    "	#include <encodings_fragment>",
    "	#include <fog_fragment>",
    "	#include <premultiplied_alpha_fragment>",
    "	#include <dithering_fragment>"
].join('\n') +
    CLOUD.IdTargetUtil.writeIdInFragShader() +
    "}";
var meshphongIdVertex = [
	"#define PHONG",
	"varying vec3 vViewPosition;",
	"#ifndef FLAT_SHADED",
		"varying vec3 vNormal;",
	"#endif"
].join('\n') +
	CLOUD.IdTargetUtil.idVarOfVertexShader() +
	[
	"#include <common>",
	"#include <uv_pars_vertex>",
	"#include <uv2_pars_vertex>",
	"#include <displacementmap_pars_vertex>",
	"#include <envmap_pars_vertex>",
	"#include <color_pars_vertex>",
	"#include <fog_pars_vertex>",
	"#include <morphtarget_pars_vertex>",
	"#include <skinning_pars_vertex>",
	"#include <shadowmap_pars_vertex>",
	"#include <logdepthbuf_pars_vertex>",
	"#include <clipping_planes_pars_vertex>",
	
	"void main() {",
		"#include <uv_vertex>",
		"#include <uv2_vertex>",
		"#include <color_vertex>",
		"#include <beginnormal_vertex>",
		"#include <morphnormal_vertex>",
		"#include <skinbase_vertex>",
		"#include <skinnormal_vertex>",
		"#include <defaultnormal_vertex>",
		"#ifndef FLAT_SHADED",
			"vNormal = normalize( transformedNormal );",
		"#endif",
		"#include <begin_vertex>",
		"#include <displacementmap_vertex>",
		"#include <morphtarget_vertex>",
		"#include <skinning_vertex>",
		"#include <project_vertex>",
		"#include <logdepthbuf_vertex>",
		"#include <clipping_planes_vertex>",
		
		"vViewPosition = - mvPosition.xyz;",
		
		"#include <worldpos_vertex>",
		"#include <envmap_vertex>",
		"#include <shadowmap_vertex>",
		"#include <fog_vertex>"
].join('\n') +
		CLOUD.IdTargetUtil.passIdInVertexShader() +
	"}";

THREE.ShaderChunk["meshphong_id_vert"] = meshphongIdVertex;
THREE.ShaderChunk["lights_fillFace_template"] = lights_fillFace_template;
THREE.ShaderChunk["fillFaceFragment"] = fillFaceFragment;


THREE.ShaderLib["fillFacePhong"] = {
    uniforms: THREE.UniformsUtils.merge( [
			THREE.UniformsLib.common,
			THREE.UniformsLib.aomap,
			THREE.UniformsLib.lightmap,
			THREE.UniformsLib.emissivemap,
			THREE.UniformsLib.bumpmap,
			THREE.UniformsLib.normalmap,
			THREE.UniformsLib.displacementmap,
			THREE.UniformsLib.gradientmap,
			THREE.UniformsLib.fog,
			THREE.UniformsLib.lights,

			{
				emissive: { value: new THREE.Color( 0x000000 ) },
				specular: { value: new THREE.Color( 0x111111 ) },
				shininess: { value: 30 }
			}
		] ),

	vertexShader: THREE.ShaderChunk.meshphong_id_vert, //meshphong_vert,
	fragmentShader: THREE.ShaderChunk.fillFaceFragment
}
CLOUD.SceneStateHelper = function (modelManager) {
    // active selection objects
    this.selectionSet = {};
    this.selectionMaterial = CLOUD.MaterialUtil.createHighlightMaterial();
    this.selectionMaterial.name = "selection";

    // hovered object id
    this.hoverId = undefined;
    //this.hoverObjectOrigMaterial = null;
    var hoverMaterialDefaultParams = {color: 0xdddddd, opacity: 0.9, transparent: true, side: THREE.DoubleSide};
    this.hoverMaterial = CLOUD.MaterialUtil.createStandardMaterial(hoverMaterialDefaultParams);
    this.hoverMaterial.name = "hover";

    this.modelManager = modelManager;
};

// the object Id may be not unique when there are multiple models
//
CLOUD.SceneStateHelper.prototype = {

    constructor: CLOUD.SceneStateHelper,

    _dispatchChangeEvent: function() {
        var newSelList = this.getSelection();

        this.modelManager.dispatchEvent({
                type: CLOUD.EVENTS.ON_SELECTION_CHANGED,
                selectionList: newSelList
            });

    },

    clearSelection: function() {
        var selChanged =  false;

        for (var id in this.selectionSet) {
            if (this.selectionSet.hasOwnProperty(id)) {
                selChanged = true;
                this.selectionSet = {}; // clear the list
                break;
            }
        }

        if (selChanged) {
            this._dispatchChangeEvent();
        }
    },

    // check if there is any selection object changed,
    // dispatch event only when there is selection changed
    addSelection: function(selList) {
        if (!selList) {
            return;
        }

        var selectionSet = this.selectionSet;
        var selChanged =  false;

        for (var i = selList.length - 1; i >= 0; i--) {
            if (!selectionSet.hasOwnProperty(selList[i])) {
                selectionSet[selList[i]] = true;
                selChanged = true;
            }
        }

        if (selChanged) {
            this._dispatchChangeEvent();
        }
    },

    setSelection: function(selList) {
        if (!selList) {
            selList = [];
        }

        var oldSelList = this.getSelection();
        var selChanged = (oldSelList.length !== selList.length);

        if (!selChanged) {
            oldSelList.sort();
            selList.sort();
            for (var i = 0; i < oldSelList.length; i++) {
                if (oldSelList[i] !== selList[i]) {
                    selChanged = true;
                    break;
                }
            }
        }

        var selectionSet = this.selectionSet = {};
        for (var i = selList.length - 1; i >= 0; i--) {
            selectionSet[selList[i]] = true;
        }

        if (selChanged) {
            this._dispatchChangeEvent();
        }
    },

    removeSelection: function(selList) {
        var selChanged = false;
        var selectionSet = this.selectionSet;

        if (selList && selList.length > 0) {
            for (var i = 0, len = selList.length; i < len; ++i) {

                var id = selList[i];

                if (selectionSet.hasOwnProperty(id)) {
                    delete selectionSet[id];
                    selChanged = true;
                }

            }
        }

        if (selChanged) {
            this._dispatchChangeEvent();
        }
    },

    getSelection: function() {
        var ids = [];
        for (var id in this.selectionSet) {
            ids.push(id);
        }

        return ids;
    },

    getSelectionSet: function() {
        return this.selectionSet;
    },

    isSelected: function(id) {
        return this.selectionSet.hasOwnProperty(id);
    },

    setHoverId: function(id) {
        this.hoverId = id;
    },
/*
    setHoverObjectMaterial: function(material) {
        this.hoverObjectOrigMaterial = material;
    },
*/
    clearHover: function () {
        this.hoverId = undefined;
    },

    /**
     * 根据物体当前材质获得Hover构件材质
     *
     * @param {THREE.Material} material - 物体当前材质参数
     * @return {Object} 材质
     */
    getHoverMaterial: function (material) {
        //var material = overrideMaterial ? overrideMaterial : this.hoverObjectOrigMaterial;
        var hoverMaterial = this.hoverMaterial.clone();

        // color可能不存在， 例如使用texture时 （BIMFACEDM-1465）
        if (material && material.hasOwnProperty("color")) {

            var newColor = material.color.clone();
            newColor.r += newColor.r * 0.3;
            newColor.g += newColor.g * 0.3;
            newColor.b += newColor.b * 0.3;

            if (newColor.r > 1.0) {
                newColor.r = 1.0;
            }

            if (newColor.g > 1.0) {
                newColor.g = 1.0;
            }

            if (newColor.b > 1.0) {
                newColor.b = 1.0;
            }

            if (newColor.r === 1.0 && newColor.g === 1.0 && newColor.b === 1.0) {
                newColor.r = 0.87;
                newColor.g = 0.87;
                newColor.b = 0.87;
            }

            hoverMaterial.color.setHex(newColor.getHex());

            if (material.opacity !== undefined) {
                hoverMaterial.opacity = material.opacity;
            } else {
                hoverMaterial.opacity = _hoverMaterialDefaultParams.opacity;
            }

            if (material.transparent !== undefined) {
                hoverMaterial.transparent = material.transparent;
            } else {
                hoverMaterial.transparent = _hoverMaterialDefaultParams.transparent;
            }

            if (material.side !== undefined) {
                hoverMaterial.side = material.side;
            } else {
                hoverMaterial.side = _hoverMaterialDefaultParams.side;
            }

            hoverMaterial.needsUpdate = true;
        }

        return hoverMaterial;
    },

    setSelectionColor: function(color) {
        this.selectionMaterial.color.setHex(color);
        this.selectionMaterial.needsUpdate = true;
    },

    getSelectionMaterial: function() {
        return this.selectionMaterial.clone();
    }

};

CLOUD.Marker3D = function (viewer) {

    var _viewer = viewer;
    var _scene = _viewer.getScene();
    var _group = null;

    var _isHidden = false;

    var _markersGroup = {};
    var _textures = {};

    var _defaultSize = 32;
    var _defaultColor = 0xffffff;

    var _textureLoader = new THREE.TextureLoader();
    _textureLoader.setCrossOrigin("anonymous");

    var _scope = this;

    function loadTextures(paths) {

        var n = 0;
        var len = paths.length;

        var onLoadFinished = function () {

            ++n;

            if (n >= len) {
                _scope.update();
                _viewer.render();
            }

        };

        for (var i = 0; i < len; ++i) {

            var path = paths[i];

            if (_textures[path] === undefined) {

                _textures[path] = _textureLoader.load(path, function () {

                    onLoadFinished();

                }, undefined, function () {

                    onLoadFinished();

                });

            } else {

                onLoadFinished();
            }

        }

    }

    function unloadTextures() {

        for (var path in _textures) {

            if (_textures.hasOwnProperty(path)) {
                delete _textures[path];
            }

        }

    }

    /**
     * 添加一组Marker
     *
     * @param {Array} items - marker数组  item = {position: {x: xxx, y : xxx, z : xxx}, size: xxx, iconUrl:xxx, tooltip:xxx}}
     */
    this.add = function (items) {

        var texturePaths = [];
        var i, len;

        if (items && items instanceof Array) {

            for (i = 0, len = items.length; i < len; ++i) {

                var item = items[i];

                var newItem = {
                    id: item.id ? item.id : THREE.Math.generateUUID(),
                    position: {x: item.position.x, y: item.position.y, z: item.position.z},
                    size: item.size ? item.size : _defaultSize,
                    iconUrl: item.iconUrl ? item.iconUrl : null,
                    tooltip: item.tooltip
                };

                var key;

                if (newItem.iconUrl) {
                    key = newItem.iconUrl;
                    texturePaths.push(newItem.iconUrl);
                } else {
                    key = "" + _defaultColor;
                }

                if (_markersGroup[key] === undefined) {
                    _markersGroup[key] = [];
                }

                _markersGroup[key].push(newItem);

            }

        }

        loadTextures(texturePaths);

    };

    /**
     * 移除Marker
     *
     * @param {Object} item - marker对象  item = {position: {x: xxx, y : xxx, z : xxx}, size: xxx, iconUrl:xxx, tooltip:xxx}}
     */
    this.remove = function (item) {

        if (!item) {
            return;
        }

        var key = item.iconUrl ? item.iconUrl : ("" + _defaultColor);

        if (_markersGroup[key] === undefined) {
            return;
        }

        var success = false;

        var markers = _markersGroup[key];

        for (var i = 0, len = markers.length; i < len; ++i) {

            if (markers[i].id === item.id) {

                markers.splice(i, 1);
                success = true;
                break;

            }
        }

        if (success) {
            this.update();
        }

    };

    /**
     * 根据Id移除Marker
     *
     * @param {String} id - marker id
     */
    this.removeById = function (id) {

        var success = false;

        for (var key in _markersGroup) {

            if (_markersGroup.hasOwnProperty(key)) {

                var markers = _markersGroup[key];

                for (var i = 0, len = markers.length; i < len; ++i) {

                    if (markers[i].id === id) {

                        markers.splice(i, 1);
                        success = true;
                        break;

                    }
                }

            }
        }

        if (success) {
            this.update();
        }

    };

    /**
     * 根据Id获取Marker
     *
     * @param {String} id - marker id
     */
    this.getItemById = function (id) {

        for (var key in _markersGroup) {

            if (_markersGroup.hasOwnProperty(key)) {

                var markers = _markersGroup[key];

                for (var i = 0, len = markers.length; i < len; ++i) {

                    var marker = markers[i];

                    if (marker.id === id) {

                        return {
                            id: marker.id,
                            position: {x: marker.position.x, y: marker.position.y, z: marker.position.z},
                            size: marker.size,
                            iconUrl: marker.iconUrl,
                            tooltip: marker.tooltip
                        }
                    }

                }
            }

        }

        return null;
    };

    /**
     * 获得所有的Marker
     *
     * @returns {Array} marker数组  item = {position: {x: xxx, y : xxx, z : xxx}, size: xxx, iconUrl:xxx, tooltip:xxx}}
     */
    this.getItems = function () {

        var items = [];

        for (var key in _markersGroup) {

            if (_markersGroup.hasOwnProperty(key)) {

                var markers = _markersGroup[key];

                for (var i = 0, len = markers.length; i < len; ++i) {

                    var marker = markers[i];

                    items.push({
                        id: marker.id,
                        position: {x: marker.position.x, y: marker.position.y, z: marker.position.z},
                        size: marker.size,
                        iconUrl: marker.iconUrl,
                        tooltip: marker.tooltip
                    });

                }
            }

        }

        if (items.length > 0) {
            return items;
        }

        return null;

    };

    /**
     * 清除所有的Marker
     *
     */
    this.clear = function () {

        if (_group) {
            _group.clear();
        }

        unloadTextures();

        for (var key in _markersGroup) {

            if (_markersGroup.hasOwnProperty(key)) {

                delete _markersGroup[key];

            }

        }

        this.update();
    };

    /**
     * 激活Marker
     *
     */
    this.activate = function () {

        this.clear();
    };

    // 禁用Marker
    this.deactivate = function () {

        this.clear();

        if (_group) {
            _scene.removeObjectGroup(_group);
            _group = null;
        }

    };

    /**
     * 显示Marker
     *
     */
    this.show = function () {
        if (_group) {
            _group.visible = true;
        }
        _isHidden = false;
        this.update();
    };

    /**
     * 隐藏marker
     *
     */
    this.hide = function () {

        if (_group) {
            _group.visible = false;
        }
        _isHidden = true;
        this.update();
    };

    /**
     * 加载一组Marker
     *
     * @param {Array} items - marker数组  item = {position: {x: xxx, y : xxx, z : xxx}, size: xxx, iconUrl:xxx, tooltip:xxx}}
     */
    this.load = function (items) {

        this.clear();
        this.add(items);
        this.update();

    };

    /**
     * 更新渲染对象
     *
     */
    this.update = function () {

        if (_isHidden) {
            return;
        }

        if (!_group) {
            // selectable, low display priority, world space
            _group = _scene.getOrCreateObjectGroup(CLOUD.ObjectGroupType.MARKER3D, {
                pickableType: CLOUD.PICKABLETYPE.Marker3d,
                hoverEnabled: false,
                priority: 2,
                globalSpace: true
            });
        }

        _group.clear();

        for (var key in _markersGroup) {

            if (_markersGroup.hasOwnProperty(key)) {

                var markers = _markersGroup[key];
                var len = markers.length;

                if (len < 1) {
                    continue;
                }

                var sprite = _textures[key];

                // 构造MeshNode
                var positions = new Float32Array(len * 3);
                var sizes = new Float32Array(len);

                var vertex = new THREE.Vector3();
                var maxSize = 0;

                var pointIds = [];

                for (var i = 0; i < len; ++i) {

                    var marker = markers[i];

                    vertex.set(marker.position.x, marker.position.y, marker.position.z);
                    vertex.toArray(positions, i * 3);

                    sizes[i] = marker.size;

                    pointIds.push(marker.id);

                    if (maxSize < marker.size) {
                        maxSize =  marker.size;
                    }
                }

                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.addAttribute('attrSize', new THREE.BufferAttribute(sizes, 1));

                var material = new THREE.PointsMaterial({
                    size: maxSize,// 当sizeAttribute为true时，size失效
                    sizeAttenuation: false, // 当sizeAttribute为true时，sizeAttenuation失效
                    positionOffset: true,
                    sizeAttribute: true, // 每个顶点使用自己的大小
                    map: sprite,
                    depthTest: true,
                    alphaTest: 0.001,
                    //blending: THREE.NoBlending, //标签边缘效果不理想，暂时开启融合
                    transparent: true
                });

                material.color.setHex(_defaultColor);

                var particles = new CLOUD.PointsEx(geometry, material);
                particles.name = key;
                particles.size = maxSize;
                particles.pointIds = pointIds;

                _group.add(particles);
                particles.matrixAutoUpdate = false;
                particles.updateMatrixWorld(true);

            }
        }

        _group.updateMatrixWorld(true);

    };

};
CLOUD.PointsEx = function (geometry, material) {

    THREE.Points.call(this, geometry, material);

    this.pointIds = [];

};

CLOUD.PointsEx.prototype = Object.create(THREE.Points.prototype);
CLOUD.PointsEx.prototype.constructor = CLOUD.PointsEx;

CLOUD.PointsEx.prototype.raycast = ( function () {

    var inverseMatrix = new THREE.Matrix4();
    var ray = new THREE.Ray();
    var sphere = new THREE.Sphere();

    return function raycast(raycaster, intersects) {

        var object = this;
        var geometry = this.geometry;
        var matrixWorld = this.matrixWorld;
        var maxPixelSize = this.size;
        var camera = raycaster.camera; // 置入camera属性
        var viewportHeight = raycaster.viewportSize.height; // 置入viewportSize
        var pointIds = this.pointIds;

        inverseMatrix.getInverse(matrixWorld);

        // 计算偏移yOffset像素之后的位置
        function calcPositionAfterYOffset(position, yOffset) {

            var newPosition = position.clone();
            newPosition.applyMatrix4(matrixWorld);
            newPosition.project(camera);
            newPosition.y += yOffset / viewportHeight;
            newPosition.unproject(camera);
            newPosition.applyMatrix4(inverseMatrix);
            return newPosition;

        }

        // Checking boundingSphere distance to ray

        if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

        sphere.copy(geometry.boundingSphere);

        var sphereCenter = sphere.center;
        var newSphereCenter = calcPositionAfterYOffset(sphereCenter, maxPixelSize);
        var threshold = newSphereCenter.distanceToSquared(sphereCenter);

        sphere.radius += threshold;
        sphere.center.copy(newSphereCenter);
        sphere.applyMatrix4(matrixWorld);

        if (raycaster.ray.intersectsSphere(sphere) === false) return;

        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

        var position = new THREE.Vector3();
        var pixelSize = maxPixelSize;

        function testPoint(point, size, index) {

            var newPoint = calcPositionAfterYOffset(point, size);
            var localThresholdSq = newPoint.distanceToSquared(point);
            var rayPointDistanceSq = ray.distanceSqToPoint(newPoint);

            if (rayPointDistanceSq < localThresholdSq) {

                var intersectPoint = ray.closestPointToPoint(newPoint);
                intersectPoint.applyMatrix4(matrixWorld);

                var distance = raycaster.ray.origin.distanceTo(intersectPoint);

                if (distance < raycaster.near || distance > raycaster.far) return;

                intersects.push({

                    id: pointIds[index], // add
                    distance: distance,
                    distanceToRay: Math.sqrt(rayPointDistanceSq),
                    point: intersectPoint.clone(),
                    index: index,
                    face: null,
                    object: object

                });

            }

        }

        if (geometry.isBufferGeometry) {

            var index = geometry.index;
            var attributes = geometry.attributes;
            var positions = attributes.position.array;

            var hasAttrSize = false;
            var sizes;

            if (attributes.attrSize) {
                hasAttrSize = true;
                sizes = attributes.attrSize.array;
            }

            if (index !== null) {

                var indices = index.array;

                for (var i = 0, il = indices.length; i < il; i++) {

                    var a = indices[i];

                    position.fromArray(positions, a * 3);

                    if (hasAttrSize) {
                        pixelSize = sizes[a];
                    }

                    testPoint(position, pixelSize, a);

                }

            } else {

                for (var i = 0, l = positions.length / 3; i < l; i++) {

                    position.fromArray(positions, i * 3);

                    if (hasAttrSize) {
                        pixelSize = sizes[i];
                    }

                    testPoint(position, pixelSize, i);

                }

            }

        } else {

            var vertices = geometry.vertices;

            for (var i = 0, l = vertices.length; i < l; i++) {

                testPoint(vertices[i], pixelSize, i);

            }

        }

    };

}() );

CLOUD.PointsEx.prototype.setAttributeSize = function (idx, size) {

    var attributes = this.geometry.attributes;

    if (attributes.attrSize) {

        attributes.attrSize.array[ idx ] = size;
        attributes.attrSize.needsUpdate = true;
    }

};

CLOUD.PointsEx.prototype.getAttributeSize = function (idx) {

    var attributes = this.geometry.attributes;
    var size = this.size;

    if (attributes.attrSize) {
        size = attributes.attrSize.array[idx];
    }

    return size;

};

CLOUD.MaterialSelector = function () {

    var _materialAttrs = [
        {name: 'scene', param: {name: 'scene', color: 0x888888, opacity: 0.1, transparent: true, side: THREE.DoubleSide}},     //liuw-d
        {name: 'darkRed', param: {name: 'darkRed', color: 0xA02828, opacity: 1, transparent: false, side: THREE.DoubleSide}},
        {name: 'lightBlue', param: {name: 'lightBlue', color: 0x1377C0, opacity: 1, transparent: false, side: THREE.DoubleSide}},
        {name: 'black', param: {name: 'black', color: 0x0, opacity: 0.3, transparent: true, side: THREE.DoubleSide}},
        {name: 'add', param: {name: 'add', color: 0x00FF00, opacity: 1, transparent: true, side: THREE.DoubleSide}},
        {name: 'delete', param: {name: 'delete', color: 0xFF0000, opacity: 0.5, transparent: true, side: THREE.DoubleSide}},
        {name: 'beforeEdit', param: {name: 'beforeEdit', color: 0xFABD05, opacity: 0.5, transparent: true, side: THREE.DoubleSide}},
        {name: 'afterEdit', param: {name: 'afterEdit', color: 0xFABD05, opacity: 1, transparent: true, side: THREE.DoubleSide}}
    ];

    // 内置材质库
    var _materials = {};
    _materials.selection = CLOUD.MaterialUtil.createHighlightMaterial();
    _materials.selection.name = "selection";

    for (var i = 0, len = _materialAttrs.length; i < len; ++i) {
        var attr = _materialAttrs[i];
        var name = attr.name;
        var param = attr.param;
        _materials[name] = CLOUD.MaterialUtil.createStandardMaterial(param);
    }

    _materials.red = _materials.delete;
    _materials.green = _materials.add;
    _materials.yellow = _materials.beforeEdit;
    _materials.blue = _materials.selection;

    var _isolateMaterialDefaultParams = {color: 0x888888, opacity: 0.2, transparent: true, side: THREE.DoubleSide};
    var _isolateMaterial = CLOUD.MaterialUtil.createStandardMaterial(_isolateMaterialDefaultParams);
    _isolateMaterial.name="isolate";

    /**
     *  获得缺省材质名
     *
     * @return {Object} 材质
     */
    this.getDefaultMaterialName = function () {
        return 'lightBlue';
    };

    /**
     *  获得缺省材质名
     *
     * @param {String} name - 材质名称
     * @return {Object} 材质
     */
    this.get = function (name) {
        return _materials[name];
    };

    /**
     *  获得所有材质
     *
     * @return {Object} 材质
     */
    this.getAll = function () {
        return _materials;
    };

    /**
     * 增加新材质
     *
     * @param {Object} color - 十六进制颜色 + 透明度 ({color: 0x123456, opacity: 0.1})
     * @return {String} 材质标识名
     */
    this.add = function (color) {

        var name, material;
        var params = {};

        if (color && color.hasOwnProperty("color")) {

            params.color = color.color;
            params.side = THREE.DoubleSide;

            if (color.opacity) {

                params.opacity = color.opacity;
                params.transparent = true;

            }

        }

        name = this._getMaterialName(color);

        material = _materials[name];

        if (!material) {
            params.name = name;
            material = CLOUD.MaterialUtil.createStandardMaterial(params);
            _materials[name] = material;
        }

        return name;
    };

    /**
     * 移除新材质
     *
     * @param {Object} color - 十六进制颜色 + 透明度 ({color: 0x123456, opacity: 0.1})
     */
    this.remove = function (color) {

        var name, material;

        name = this._getMaterialName(color);
        material = _materials[name];

        if (material) {
            delete _materials[name];
        }
    };

    /**
     * 是否存在材质
     *
     * @param {string} name - 材质名称
     * @return {Boolean} true - 存在， 否则 不存在
     */
    this.has = function (name) {

        return _materials[name] ? true : false;

    };

    /**
     * 根据颜色获得材质名
     *
     * @param {Object} color - 十六进制颜色 + 透明度 ({color: 0x123456, opacity: 0.1})
     * @return {string} 材质名称
     */
    this.getMaterialNameByColor = function (color) {

        var name, material;

        name = this._getMaterialName(color);

        material = _materials[name];

        if (!material) {
            return this.add(color);
        }

        return name;
    };

    this._getMaterialName = function (color) {

        var name, material;

        if (color && color.hasOwnProperty("color")) {

            if (color.opacity) {
                name = color.color + '_' + color.opacity;
            } else {
                name = "mat_" + color.color;
            }

        } else {
            name = "mat_" + color;
        }

        return name;
    };

    /**
     *  设置隔离构件材质
     *
     * @param {Object} params - 材质参数({color: 0x888888, opacity: 0.5, transparent: true, side: THREE.DoubleSide})
     */
    this.setIsolateMaterial = function (params) {

        if (params.color !== undefined) {
            _isolateMaterial.color.setHex(params.color);
        } else {
            _isolateMaterial.color.setHex(_isolateMaterialDefaultParams.color);
        }

        if (params.opacity !== undefined) {
            _isolateMaterial.opacity = params.opacity;
        } else {
            _isolateMaterial.opacity = _isolateMaterialDefaultParams.opacity;
        }

        if (params.transparent !== undefined) {
            _isolateMaterial.transparent = params.transparent;
        } else {
            _isolateMaterial.transparent = _isolateMaterialDefaultParams.transparent;
        }

        if (params.side !== undefined) {
            _isolateMaterial.side = params.side;
        } else {
            _isolateMaterial.side = _isolateMaterialDefaultParams.side;
        }

        _isolateMaterial.needsUpdate = true;

    };

    /**
     *  获得隔离构件材质
     *
     * @return {Object} 材质
     */
    this.getIsolateMaterial = function () {

        return _isolateMaterial;
    };

    /**
     *  重置隔离构件材质
     *
     */
    this.resetIsolateMaterial = function () {

        _isolateMaterial.color.setHex(_isolateMaterialDefaultParams.color);
        _isolateMaterial.opacity = _isolateMaterialDefaultParams.opacity;
        _isolateMaterial.transparent = _isolateMaterialDefaultParams.transparent;
        _isolateMaterial.side = _isolateMaterialDefaultParams.side;
        _isolateMaterial.needsUpdate = true;
    }

};
/**
 * 过滤管理器：   用于构件可见性，材质变更，隔离等处理
 * 构件状态 ：    选中、高亮、半透明、隔离(隐藏其它，半透明其它)
 *
 * 六个过滤器：   id过滤器，材质过滤器，隔离过滤器，自定义过滤器，条件过滤器。
 *                这些过滤存在相互交叉和依赖，内部使用优先级控制过滤状态。
 *                id过滤器的优先级最高，隔离过滤器是在id过滤器的基础上进行的，
 *                例如，隐藏了某些构件，在隔离半透明了另一些构件，取消隔离后，隐藏的构件依然是隐藏的。
 * id过滤器：     文件隐藏(隐藏自己)、文件显示(隐藏其它)、
 *                构件显示(隐藏其它)、构件隐藏(隐藏自己)、
 *                构件半透明(半透明自己)、构件不透明(半透明其它)
 * 材质过滤器：   批量(分组)修改构件材质；
 *                材质过滤的优先级为：
 *                  1, 半透明构件采用半透明材质；
 *                  2, 如果构件被冻结，则保持构件自身的材质；
 *                  3, 如果被选中，采用选中高亮材质(在filter之外管理)
 *                  4, 构件被其他材质过滤器命中，采用该过滤器指定的材质
 *
 * 隔离过滤器：   隐藏隔离出的构件(隐藏自己)，隐藏未隔离出的构件(隐藏其它),
 *                半透明隔离出的构件(半透明自己)，半透明未隔离出的构件(半透明其它)
 * 自定义过滤器： 依赖userdata数据
 * 条件过滤器：   根据条件过滤，依赖userdata数据
 * 冻结过滤器：   暂时只支持冻结构件的不可选状态，即在冻结过滤器中的id对应的构件不能选中,
 *                被冻结构件如果不是半透明状态，则保持构件自身的材质
 *
 * 过滤器优先级： 材质过滤管理器中的过滤器存在优先级，对于同样优先级的过滤器，后设置的过滤器具有高优先级；
 *                对于其他过滤管理器，过滤器根据设置的先后设置优先级，后设置的过滤器具有高优先级
 *
 * @class  CLOUD.FilterManager
 *
 */


/**
 * 隔离条件类型枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EnumConditionType = {
    HIDDEN_OTHERS: 0,
    TRANSLUCENT_OTHERS: 1,
    OVERRIDE: 2
};

/**
 * 基于ID的过滤器类型枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EnumIdBasedType = {
    FILE_VISIBLE: 0,
    FILE_HIDDEN: 1,
    VISIBLE: 2,
    HIDDEN: 3,
    TRANSLUCENT: 4,
    TRANSLUCENT_OTHERS: 5
};

/**
 * 用户自定义类型枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EnumUserType = {
    /** 隐藏 */
    HIDDEN_DATA: 0,
    /** 更改材质 */
    OVERRIDE_DATA: 1
};

/**
 * 隔离状态枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EnumIsolateState = {
    /** 隐藏自己 */
    HIDDEN: 0,
    /** 隐藏其它 */
    HIDDEN_OTHERS: 1,
    /** 半透明自己 */
    TRANSLUCENT: 2,
    /** 半透明其它 */
    TRANSLUCENT_OTHERS: 3
};

/**
 * 场景状态枚举
 * @readonly
 * @enum {number}
 */
CLOUD.EnumSceneState = {
    DISABLED: 0,
    TRANSLUCENT: 1,
    HIDDEN: 2
};

CLOUD.FilterManager = function () {

    this._filterImpl = new CLOUD.FilterManager2();

    // 基于ID的过滤器
    var EnumIdBasedType = CLOUD.EnumIdBasedType;


    // --------------------------------------------------------- //

    /**
     * 判断构件是否可见
     *
     * @param {Object} object - 构件对象 {name: xxx, userData: xxx}
     * @return {Boolean} true: 可见， 否则 不可见
     */
    this._isVisible = function (object) {

        return this._filterImpl._isVisible(object);
    };

    /**
     * 判断对象是否可以被pick。冻结的构件或者半透明的构件不能选中。
     *
     * @param {Object} object - 构件对象 {name: xxx, userData: xxx}
     * @return {Boolean} 是否可以pick - true: 对象可以被pick，false: 对象不可以pick
     */
    this._isSelectable = function (object) {

        return this._filterImpl._isSelectable(object);
    };

    /**
     * 根据构件对象获得构件材质
     *
     * @param {Object} object - 构件对象 {name: xxx, userData: xxx}
     */
    this._getOverrideMaterial = function (object) {

        return this._filterImpl._getOverrideMaterial(object);
    };

    /**
     * 判断构件的材质是否被重载
     *
     * @param {Object} object - 自定义数据 {name: xxx, userData: xxx}
     * @return {Boolean} true: 高亮
     */
    this._hasOverrideMaterial = function (object) {

        return this._filterImpl._hasHighPriorityOverrideMaterial(object);

    };

    /**
     * 判断构件是否高亮
     *
     * @param {Object} object - 自定义数据 {name: xxx, userData: xxx}
     * @return {Boolean} true: 高亮
     */
    this._hasHighPriorityOverrideMaterial = function (object) {
        return this._filterImpl._hasHighPriorityOverrideMaterial(object);
    };

    /**
     * 是否隐藏对应id的文件
     *
     * @param {String} id - 文件id
     */
    this._isHiddenFileId = function (object) {

        return this._filterImpl._isHiddenFileId(object);
    };


    this._hasHiddenFileIdFilter = function() {
        return this._filterImpl._hasHiddenFileIdFilter();
    };

    this._hasVisibleFilter = function() {
        return this._filterImpl._hasVisibleFilter();
    };

    this._hasSelectableFilter = function() {
        return this._filterImpl._hasSelectableFilter();
    };

    this._hasOverrideMaterialFilter = function() {
        return this._filterImpl._hasOverrideMaterialFilter();
    };

    this._hasLowPriorityOverride = function() {
        return this._filterImpl._hasLowPriorityOverride();
    };

    // ------------------------------------- 外部 API ------------------------------------- //

    /**
     * 保存当前过滤器状态
     *
     */
    this.saveState = function () {

        return this._filterImpl.saveState();

    };

    /**
     * 恢复过滤器状态
     *
     */
    this.loadState = function (obj) {

        return this._filterImpl.loadState(obj);

    };

    /**
     * 清除所有的过滤器数据, 除了冻结过滤器
     * 注意：冻结的构件没有清除，因为冻结操作可能是在初始化的时候就做了，整个生命周期里，都要保持冻结
     *
     */
    this.clear = function () {

        return this._filterImpl.clear();

    };

    /**
     * 清除所有的过滤器数据, 包含冻结过滤器
     *
     */
    this.clearAll = function () {

        return this._filterImpl.clearAll();

    };

    /**
     * 清除隔离过滤器数据
     *
     */
    this.clearIsolate = function () {

        return this._filterImpl.clearIsolate();

    };

    // ---------------- 冻结过滤器  ---------------- //

    /**
     * 清除指定类型的数据 - 清除【Frozen id列表】
     *
     */
    this.clearFrozenList = function () {
        return this._filterImpl.clearFrozenList();
    };

    /**
     * 批量增加 - 增加到【Frozen id列表】
     *
     * @param {Array} ids - id数组
     */
    this.addToFrozenList = function (ids) {
        return this._filterImpl.addToFrozenList(ids);
    };

    /**
     * 批量删除 - 从【Frozen id列表】中移除ids
     *
     * @param {Array} ids - id数组
     */
    this.removeFromFrozenList = function (ids) {

        return this._filterImpl.removeFromFrozenList(ids);
    };

    /**
     * 批量增加 - 设置【id列表】
     *
     * @param {Array} ids - id数组
     */
    this.setFrozenList = function (ids) {

        return this._filterImpl.setFrozenList(ids);

    };

    /**
     * 按条件冻结构件
     *
     * @param {Array} conditions    - 多个条件对象数组，多个条件取交集
     *                                  [{"categoryId":-2001340},{"specialty":"AR"},{"categoryId":-2321500,"levelName":"F03"}]
     */
    this.setFrozenConditions = function(conditions) {
        this._filterImpl.setFrozenConditions(conditions);
    };

    /**
     * 获得冻结状态的条件
     *
     */
    this.getFrozenConditions = function() {
        return this._filterImpl.getFrozenConditions();
    };

    /**
     * 清除冻结状态的条件
     *
     */
    this.clearFrozenConditions = function() {
        this._filterImpl.clearFrozenConditions();
    };

    /**
     * 清除冻结状态的所有设置：条件和id列表
     *
     */
    this.clearFrozen = function() {
        this.clearFrozenList();
        this.clearFrozenConditions();
    };

    // ---------------- ID 过滤器  ---------------- //
    /**
     * 清除所有类型的ID过滤器数据 - 清除所有类型的【id列表】
     *
     */
    this.clearAllIdList = function () {
        return this._filterImpl.clearAllIdList();
    };

    /**
     * 清除指定类型的ID过滤器数据 - 清除【id列表】
     *
     */
    this.clearIdList = function (type) {
        return this._filterImpl.clearIdList(type);
    };

    /**
     * 批量增加 - 增加到【id列表】
     *
     * @param {Number} type - 类型
     *                          {
     *                              FILE_VISIBLE: 0,
     *                              FILE_HIDDEN: 1,
     *                              VISIBLE: 2,
     *                              HIDDEN: 3,
     *                              TRANSLUCENT: 4,
     *                              TRANSLUCENT_OTHERS: 5
     *                           }
     * @param {Array} ids - id数组
     */
    this.addToIdList = function (type, ids) {

        return this._filterImpl.addToIdList(type, ids);
    };

    /**
     * 批量删除 - 从【id列表】中移除ids
     *
     * @param {Number} type - 类型
     * @param {Array} ids - id数组
     */
    this.removeFromIdList = function (type, ids) {

        return this._filterImpl.removeFromIdList(type, ids);
    };

    /**
     * 批量增加 - 设置【id列表】
     *
     * @param {Number} type - 类型
     * @param {Array} ids - id数组
     */
    this.setIdList = function (type, ids) {

        return this._filterImpl.setIdList(type, ids);

    };

    // ----------------  材质替换 --------------------------- //

    /**
     * 清除所有的材质更改 - 清除所有类型的【替换材质的构件id列表】
     *
     */
    this.clearAllOverrideList = function () {
        this._filterImpl.clearAllOverrideList();
    };

    /**
     * 清除某个分组的材质更改 - 清除【替换材质的构件id列表】
     *
     * @param {String} name - 分组名
     */
    this.clearOverrideList = function (name) {
        return this._filterImpl.clearOverrideList(name);
    };

    /**
     * 批量更改材质 - 增加到【替换材质的构件id列表】
     *      data = {name1 : {id1 : materialName1, id2 : materialName1,  ... }, name2 : {id1 : materialName2, id2 : materialName2,  ... }, ...}
     *
     * @param {String} name - 分组名
     * @param {Array} ids - 构件id数组
     * @param {String} materialName - 材质名
     */
    this.addToOverrideList = function (name, ids, materialName) {

        return this._filterImpl.addToOverrideList(name, ids, materialName);
    };

    /**
     * 批量清除材质更改 - 从【替换材质的构件id列表】移除ids
     *
     * @param {String} name - 分组名
     * @param {Array} ids - 构件id数组
     */
    this.removeFromOverrideList = function (name, ids) {

        return this._filterImpl.removeFromOverrideList(name, ids);
    };

    /**
     * 批量更改材质 - 设置到名为name的【替换材质的构件id列表】
     *
     * @param {String} name - 分组名
     * @param {Array} ids - 构件id数组
     * @param {String} materialName - 材质名
     */
    this.setOverrideList = function (name, ids, materialName) {

        return this._filterImpl.setOverrideList(name, ids, materialName);

    };

    /**
     * 批量更改材质 - 增加到【替换材质的构件id列表】
     *     data = {name1 : {id1 : color1, id2 : color1,  ... }, name2 : {id1 : color2, id2 : color2,  ... }, ...}
     *
     * @param {String} name - 分组名
     * @param {Array} ids - 构件id数组
     * @param {Object} color - 十六进制颜色 + 透明度 ({color: 0x123456, opacity: 0.1})
     */
    this.addToOverrideListByColor = function (name, ids, color) {

        return this._filterImpl.addToOverrideListByColor(name, ids, color);

    };

    /**
     * 批量更改材质 - 设置【替换材质的构件id列表】

     *
     * @param {String} name - 分组名
     * @param {Array} ids - 构件id数组
     * @param {Object} color - 十六进制颜色 + 透明度 ({color: 0x123456, opacity: 0.1})
     */
    this.setOverrideListByColor = function (name, ids, color) {

        return this._filterImpl.setOverrideListByColor(name, ids, color);
    };

    // ------------------------------------------- //

    /**
     * 清除所有的自定义过滤器数据 - 清除所有的【自定义构件列表】
     *
     */
    this.clearAllUserList = function () {

        return this._filterImpl.clearAllUserList();
    };

    /**
     * 清除指定类型的自定义过滤器数据 - 清除【自定义构件列表】
     *
     * @param {Number} type - 类型标识 ({ HIDDEN_DATA: 0, OVERRIDE_DATA: 1 })
     */
    this.clearUserListByType = function (type) {

        return this._filterImpl.clearUserListByType(type);
    };

    /**
     * 批量清除 - 清除组名name的【自定义构件列表】
     *
     * @param {Number} type - 类型标识 ({ HIDDEN_DATA: 0, OVERRIDE_DATA: 1 })
     * @param {String} name - 分组名
     */
    this.clearUserList = function (type, name) {

        return this._filterImpl.clearUserList(type, name);
    };

    /**
     * 批量增加 - 增加到【自定义构件列表】
     *
     * @param {Number} type - 类型标识 ({ HIDDEN_DATA: 0, OVERRIDE_DATA: 1 })
     * @param {String} name - 分组名
     *   eg:
     *     若 userData = { categoryId: "-2000181", classCode: "-1", plan: "-1", sceneId: "c338aae5-d92d-42c2-b092-ccf9ab0a9d07"} ,
     *     则 name可以为 ["categoryId" , "classCode" , "plan" , "sceneId" , "classCode"] 之一。
     * @param {Array} keys - 自定义数据值集合, 每个key对应一个userData对象的属性对应的数据值。
     *   eg：
     *     若 userData = { categoryId: "-2000181", classCode: "-1", plan: "-1"}，
     *     则 keys = ["-2000181", "-2000182"]
     * @param {Object} [value] - 可选，keys对应的值。
     *                            当type为HIDDEN_DATA时，可以忽略该值；
     *                            当type为OVERRIDE_DATA时，
     *                            1) 指定材质颜色 value = {color: 0x123456, opacity: 0.1}
     *                            2) 指定材质名 value = {material: 'lightBlue'}
     *                            3) 指定材质名 value = 'lightBlue'
     */
    this.addToUserList = function (type, name, keys, value) {

        return this._filterImpl.addToUserList(type, name, keys, value);

    };

    /**
     * 批量删除 - 从【自定义构件列表】中移除数据
     *
     * @param {Number} type - 类型标识
     * @param {String} name - 分组名
     * @param {Array} keys - 自定义数据值集合, 每个key对应一个userData对象的属性值
     */
    this.removeFromUserList = function (type, name, keys) {

        this._filterImpl.removeFromUserList(type, name, keys);
    };

    /**
     * 批量增加 - 设置【自定义构件列表】,参数详情见 addToUserList
     *
     * @param {Number} type - 类型标识
     * @param {String} name - 分组名
     * @param {Array} keys - 自定义数据值集合, 每个key对应一个userData对象的属性对应的数据值。
     * @param {Object} [value] - 可选，keys对应的值。
     */
    this.setUserList = function (type, name, keys, value) {

        this._filterImpl.setUserList(type, name, keys, value);

    };

    // ---------- isolate ---------- //

    /**
     * 是否处于隔离状态
     * 构件被选中，构件被隔离都表示处于隔离状态
     *
     */
    this.isIsolate = function () {

        return this._filterImpl.isIsolate();
    };

    /**
     * 是否处于过滤状态
     *
     */
    this.isFiltering = function () {

        return this._filterImpl.isFiltering();

    };

    /**
     * 设置隔离材质
     *
     * @param {Object} params    - 材质参数
     *        params = {color: 0x888888, opacity: 0.1, transparent: true, side: THREE.DoubleSide}
     */
    this.setIsolateMaterial = function (params) {

        this._filterImpl.setIsolateMaterial(params);

    };

    /**
     * 获得隔离材质
     *
     */
    this.getIsolateMaterial = function () {

        return this._filterImpl.getIsolateMaterial();

    };

    /**
     * 重置隔离材质
     *
     */
    this.resetIsolateMaterial = function () {

        this._filterImpl.resetIsolateMaterial();

    };

    /**
     * 清除所有 - 清除所有状态的【隔离列表】
     *
     */
    this.clearAllIsolateList = function () {
        this._filterImpl.clearAllIsolateList();
    };

    /**
     * 清除指定状态 - 清除某个状态的【隔离列表】
     *
     * @param {Number} state - 隔离状态
     */
    this.clearIsolateList = function (state) {
        this._filterImpl.clearIsolateList(state);
    };

    /**
     * 批量增加 - 增加到【隔离列表】
     * @param {Number} state - 隔离状态
     *              {HIDDEN: 0,  HIDDEN_OTHERS: 1, TRANSLUCENT: 2, TRANSLUCENT_OTHERS: 3}
     * @param {Array} ids - 构件id数组
     */
    this.addToIsolateList = function (state, ids) {

        this._filterImpl.addToIsolateList(state, ids);
    };

    /**
     * 批量删除 - 【隔离构件id列表】中移除指定的ids
     *
     * @param {Number} state - 隔离状态
     * @param {Array} ids - 构件id数组
     */
    this.removeFromIsolateList = function (state, ids) {

        this._filterImpl.removeFromIsolateList(state, ids);
    };

    /**
     * 批量增加 - 设置【隔离列表】, 参数详情见 addToIsolateList
     *
     * @param {Number} state - 隔离状态
     * @param {Array} ids - 构件id数组
     */
    this.setIsolateList = function (state, ids) {

        this._filterImpl.setIsolateList(state, ids);

    };

    /**
     * 从【隔离构件id列表】中移除选中的构件集
     *
     */
    this.removeFromIsolateList = function (state, ids) {

        this._filterImpl.removeFromIsolateList(state, ids);

    };

    /**
     * 根据数据设置隔离条件
     *
     * @param {Object} data - 条件数据
     */
    //this._setIsolateConditionsByData = function (data) {
    //    this._filterImpl._setIsolateConditionsByData(data);
    //};

    /**
     * 按条件隔离构件
     *
     * @param {Array} conditions    - 多个条件对象数组，单个数组取交集，多个数组取并集
     *                                  [{"categoryId":-2001340},{"specialty":"AR"},{"categoryId":-2321500,"levelName":"F03"}]
     * @param {Number} state        - 类型标识  ({HIDDEN: 0, HIDDEN_OTHERS: 1, TRANSLUCENT: 2, TRANSLUCENT_OTHERS: 3})
     */
    this.setIsolateConditions = function (conditions, state) {

        this._filterImpl.setIsolateConditions(conditions, state);
    };

    /**
     * 获得指定状态的隔离条件
     *
     * @param {Number} state - 类型标识  ({HIDDEN: 0, HIDDEN_OTHERS: 1, TRANSLUCENT: 2, TRANSLUCENT_OTHERS: 3})
     */
    this.getIsolateConditions = function (state) {
        return this._filterImpl.getIsolateConditions(state);
    };

    /**
     * 清除某个状态的隔离条件
     *
     */
    this.clearIsolateConditions = function (state) {

        this._filterImpl.clearIsolateConditions(state);
    };

    /**
     * 清除所有状态的隔离条件
     *
     */
    this.clearAllIsolateConditions = function () {

        this._filterImpl.clearAllIsolateConditions();

    };

    // ------------------- Conditions --------------------------- //

    /**
     * 按条件过滤
     *
     * @param {Number} type         - 类型标识  ({ HIDDEN_OTHERS: 0, TRANSLUCENT: 1, OVERRIDE: 2 })
     * @param {Array} conditions    - 多个条件对象数组，单个数组取交集，多个数组取并集
     *                                 如果type为OVERRIDE，则数据格式：
     *                                 data = [{condition:{levelName:'xxx'}, material: 'xxx'}, {condition:{levelName:'xxx', categoryId: 'xxx'}, material:'xxx'}]
     *                                 data = [{condition:{levelName:'xxx'}, color: {color: 0x123456, opacity: 0.1}}, {condition:{levelName:'xxx', categoryId: 'xxx'}, color: {color: 0x123456, opacity: 0.1}}]
     *                                 否则，数据格式：
     *                                 data = [{"categoryId":-2001340},{"specialty":"AR"},{"categoryId":-2321500,"levelName":"F03"}]
     *
     *                                 注意：type为OVERRIDE，则数据格式为下面格式更为合理
     *                                 data = {conditions:[{levelName:'xxx'},{levelName:'xxx', categoryId: 'xxx'}, ...], material:'xxx'}
     *                                 data = {conditions:[{levelName:'xxx'},{levelName:'xxx', categoryId: 'xxx'}, ...], color:{color: 0x123456, opacity: 0.1}}
     */
    this.setConditions = function (type, conditions) {

        this._filterImpl.setConditions(type, conditions);

    };

    /**
     * 获得指定类型的条件
     *
     * @param {Number} type - 类型标识  ({ HIDDEN_OTHERS: 0, TRANSLUCENT: 1, OVERRIDE: 2 })
     */
    this.getConditions = function (type) {
        return this._filterImpl.getConditions(type);
    };

    /**
     * 清除指定类型的条件
     *
     * @param {Number} type - 类型标识  ({ HIDDEN_OTHERS: 0, TRANSLUCENT: 1, OVERRIDE: 2 })
     */
    this.clearConditions = function (type) {

        this._filterImpl.clearConditions(type);

    };

    /**
     * 获得所有类型的条件
     *
     */
    //this.getAllConditions = function () {
    //    return _conditions;
    //};

    /**
     * 清除所有类型的条件
     *
     */
    this.clearAllConditions = function () {
        this._filterImpl.clearAllConditions();
    };

    /**
     * 根据数据设置条件
     *
     * @param {Object} data - 条件数据
     */
    //this._setConditionsByData = function (data) {
    //    _conditions = data;
    //};

    // ---------- Override scene ---------- //

    /**
     * 场景半透明
     *
     */
    this.makeSceneTranslucent = function () {
        this._filterImpl.makeSceneTranslucent();
    };

    /**
     * 取消场景半透明
     *
     */
    this.cancelSceneTranslucent = function () {
        this._filterImpl.cancelSceneTranslucent();
    };

    /**
     * 场景隐藏
     *
     */
    this.hideScene = function () {
        this._filterImpl.hideScene();
    };

    /**
     * 场景显示
     *
     */
    this.showScene = function () {
        this._filterImpl.showScene();
    };

    /**
     * 设置场景状态
     *
     */
    this.setSceneState = function (state) {
        this._filterImpl.setSceneState(state);
    };

    /**
     * 是获得场景状态
     *
     * @return {Number} 场景状态
     */
    this.getSceneState = function () {
        return this._filterImpl.getSceneState();
    };

    /**
     * 取消隐藏状态
     *
     */
    this.cancelHidden = function () {

        this._filterImpl.cancelHidden();

    };

    /**
     * 取消半透明状态
     *
     */
    this.cancelTranslucent = function () {

        this._filterImpl.cancelTranslucent();

    };

    // ------------------------------------------ //

    /**
     *  隐藏【指定的构件】
     *
     * @param {Array} ids - 构件 id 集合
     */
    this.hideByIds = function (ids) {
        this._filterImpl._addIdsToFilter(EnumIdBasedType.HIDDEN, ids);
        
    };

    /**
     * 仅仅显示【指定的构件】
     *
     * @param {Array} ids - 构件 id 集合
     */
    this.showByIds = function (ids) {
        this._filterImpl._addIdsToFilter(EnumIdBasedType.VISIBLE, ids);
        
    };

    /**
     * 【指定的构件】 半透明
     *
     * @param {Array} ids - 构件 id 集合
     */
    this.makeTranslucentByIds = function (ids) {
        this._filterImpl._addIdsToFilter(EnumIdBasedType.TRANSLUCENT, ids);
        
    };

    /**
     * 【指定的构件】不透明
     *
     * @param {Array} ids - 构件 id 集合
     */
    this.makeTranslucentOthersByIds = function (ids) {
        this._filterImpl._addIdsToFilter(EnumIdBasedType.TRANSLUCENT_OTHERS, ids);
        
    };

    /**
     *  获得过滤类型
     *
     * @returns {Object} 过滤类型
     */
    this.getFilterType = function () {
        return this._filterImpl.getFilterType();
    }
};


CLOUD.FilterManager2 = function () {

    // 基于ID的过滤器
    var EnumIdBasedType = CLOUD.EnumIdBasedType;
    // 场景状态
    var EnumSceneState = CLOUD.EnumSceneState;

    var EnumFilterResultMode = CLOUD.FilterResultMode;

    // basic filter types, one type has a peer filter
    var EnumFilterType = {
        IDFILTER_OFFSET: 0,
        FILE_VISIBLE: 0,
        FILE_HIDDEN: 1,
        VISIBLE: 2,
        HIDDEN: 3,
        TRANSLUCENT: 4,
        TRANSLUCENT_OTHERS: 5,
        IDFILTER_ENDOFFSET: 5,

        ISOLATEFILTER_OFFSET: 6,
        ISOLATE_HIDDEN: 6,
        ISOLATE_HIDDEN_OTHERS: 7,
        ISOLATE_TRANSLUCENT: 8,
        ISOLATE_TRANSLUCENT_OTHERS: 9,
        ISOLATEFILTER_ENDOFFSET: 9,

        USERFILTER_OFFSET: 10,
        USER_HIDDEN: 10,
        USER_OVERRIDE: 11,
        USERFILTER_ENDOFFSET: 11,

        CONDITIONFILTER_OFFSET: 12,
        CONDITION_HIDDEN_OTHERS: 12,
        CONDITION_TRANSLUCENT_OTHERS: 13,
        CONDITION_OVERRIDE: 14,
        CONDITIONFILTER_ENDOFFSET: 14,

        ISOLATECONDITIONFILTER_OFFSET: 15,
        ISOLATE_CONDITION_HIDDEN: 15,      // not used currently
        ISOLATE_CONDITION_HIDDEN_OTHERS: 16,
        ISOLATE_CONDITION_TRANSLUCENT: 17,     // not used currently
        ISOLATE_CONDITION_TRANSLUCENT_OTHERS: 18,
        ISOLATECONDITIONFILTER_ENDOFFSET: 18,

        FROZENFILTER: 19,
        FROZENCONDITIONFILTER: 20,
        OVERRIDEFILTER: 21,

        BASICFILTER_COUNT: 21
    };

    // compound filter list
    //
    var _visibleCompoundFilter = new CLOUD.CompoundFilter(true);
    var _overrideCompoundFilter = new CLOUD.CompoundFilter(true);
    var _highPriorityOverrideCompoundFilter = new CLOUD.CompoundFilter(false);
    var _selectableCompoundFilter = new CLOUD.CompoundFilter(true);
    var _hiddenFileIdCompoundFilter = new CLOUD.CompoundFilter(false);

    // basic filters
    // get one basic filter according to its type index, see EnumFilterType
    var _basicFilterList = [];

    var _overrideFilter;
    var _frozenFilter;

    var _sceneState = EnumSceneState.DISABLED;
    var _materialSelector = new CLOUD.MaterialSelector();

    function _init() {

        // create basic filters
        //
        _basicFilterList[EnumFilterType.FILE_VISIBLE] = new CLOUD.FileIdFilter(EnumFilterType.FILE_VISIBLE, "FILE_VISIBLE");
        _basicFilterList[EnumFilterType.FILE_HIDDEN] = new CLOUD.FileIdFilter(EnumFilterType.FILE_HIDDEN, "FILE_HIDDEN");

        _basicFilterList[EnumFilterType.VISIBLE] = new CLOUD.GeneralIdFilter(EnumFilterType.VISIBLE, "VISIBLE");
        _basicFilterList[EnumFilterType.HIDDEN] = new CLOUD.GeneralIdFilter(EnumFilterType.HIDDEN, "HIDDEN");
        _basicFilterList[EnumFilterType.TRANSLUCENT] = new CLOUD.GeneralIdFilter(EnumFilterType.TRANSLUCENT, "TRANSLUCENT");
        _basicFilterList[EnumFilterType.TRANSLUCENT_OTHERS] = new CLOUD.GeneralIdFilter(EnumFilterType.TRANSLUCENT_OTHERS, "TRANSLUCENT_OTHERS");

        _basicFilterList[EnumFilterType.ISOLATE_HIDDEN] = new CLOUD.GeneralIdFilter(EnumFilterType.ISOLATE_HIDDEN, "ISOLATE_HIDDEN");
        _basicFilterList[EnumFilterType.ISOLATE_HIDDEN_OTHERS] = new CLOUD.GeneralIdFilter(EnumFilterType.ISOLATE_HIDDEN_OTHERS, "ISOLATE_HIDDEN_OTHERS");
        _basicFilterList[EnumFilterType.ISOLATE_TRANSLUCENT] = new CLOUD.GeneralIdFilter(EnumFilterType.ISOLATE_TRANSLUCENT, "ISOLATE_TRANSLUCENT");
        _basicFilterList[EnumFilterType.ISOLATE_TRANSLUCENT_OTHERS] = new CLOUD.GeneralIdFilter(EnumFilterType.ISOLATE_TRANSLUCENT_OTHERS, "ISOLATE_TRANSLUCENT_OTHERS");

        _basicFilterList[EnumFilterType.USER_HIDDEN] = new CLOUD.UserListFilter(EnumFilterType.USER_HIDDEN, "USER_HIDDEN");
        _basicFilterList[EnumFilterType.USER_OVERRIDE] = new CLOUD.UserListFilter(EnumFilterType.USER_OVERRIDE, "USER_OVERRIDE");

        _basicFilterList[EnumFilterType.CONDITION_HIDDEN_OTHERS] = new CLOUD.ConditionFilter(EnumFilterType.CONDITION_HIDDEN_OTHERS, "CONDITION_HIDDEN_OTHERS");
        _basicFilterList[EnumFilterType.CONDITION_TRANSLUCENT_OTHERS] = new CLOUD.ConditionFilter(EnumFilterType.CONDITION_TRANSLUCENT_OTHERS, "CONDITION_TRANSLUCENT_OTHERS");
        _basicFilterList[EnumFilterType.CONDITION_OVERRIDE] = new CLOUD.MultiConditionFilter(EnumFilterType.CONDITION_OVERRIDE, "CONDITION_OVERRIDE");

        _basicFilterList[EnumFilterType.ISOLATE_CONDITION_HIDDEN] = new CLOUD.ConditionFilter(EnumFilterType.ISOLATE_CONDITION_HIDDEN, "ISOLATE_CONDITION_HIDDEN");
        _basicFilterList[EnumFilterType.ISOLATE_CONDITION_HIDDEN_OTHERS] = new CLOUD.ConditionFilter(EnumFilterType.ISOLATE_CONDITION_HIDDEN_OTHERS, "ISOLATE_CONDITION_HIDDEN_OTHERS");
        _basicFilterList[EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT] = new CLOUD.ConditionFilter(EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT, "ISOLATE_CONDITION_TRANSLUCENT");
        _basicFilterList[EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS] = new CLOUD.ConditionFilter(EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS, "ISOLATE_CONDITION_TRANSLUCENT_OTHERS");

        _frozenFilter = new CLOUD.GeneralIdFilter(EnumFilterType.FROZENFILTER, "FROZENFILTER");
        _basicFilterList[EnumFilterType.FROZENCONDITIONFILTER] = new CLOUD.ConditionFilter(EnumFilterType.FROZENCONDITIONFILTER, "FROZENCONDITIONFILTER");
        _basicFilterList[EnumFilterType.FROZENFILTER] = _frozenFilter;
        _overrideFilter = new CLOUD.OverrideListFilter(EnumFilterType.OVERRIDEFILTER, "OVERRIDEFILTER");
        _basicFilterList[EnumFilterType.OVERRIDEFILTER] = _overrideFilter;


        var f;

        // register basic filter to compound filter
        //
        var filtersForVisible = {};
        filtersForVisible[EnumFilterType.HIDDEN] = EnumFilterResultMode.MATCH_RETURN_FALSE;
        filtersForVisible[EnumFilterType.VISIBLE] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;
        filtersForVisible[EnumFilterType.USER_HIDDEN] = EnumFilterResultMode.MATCH_RETURN_FALSE;
        filtersForVisible[EnumFilterType.CONDITION_HIDDEN_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;
        filtersForVisible[EnumFilterType.ISOLATE_HIDDEN] = EnumFilterResultMode.MATCH_RETURN_FALSE;
        filtersForVisible[EnumFilterType.ISOLATE_HIDDEN_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;
        filtersForVisible[EnumFilterType.ISOLATE_CONDITION_HIDDEN_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;

        _visibleCompoundFilter.setFilterMode(filtersForVisible);
        for (f in filtersForVisible) {
            _basicFilterList[f].registerToCompoundFilter(_visibleCompoundFilter);
        }

        var filtersForSelect = {};
        filtersForSelect[EnumFilterType.FROZENFILTER] = EnumFilterResultMode.MATCH_RETURN_FALSE;
        filtersForSelect[EnumFilterType.FROZENCONDITIONFILTER] = EnumFilterResultMode.MATCH_RETURN_FALSE;
        filtersForSelect[EnumFilterType.TRANSLUCENT] = EnumFilterResultMode.MATCH_RETURN_FALSE;
        filtersForSelect[EnumFilterType.TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;
        filtersForSelect[EnumFilterType.CONDITION_TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;
        filtersForSelect[EnumFilterType.ISOLATE_TRANSLUCENT] = EnumFilterResultMode.MATCH_RETURN_FALSE;
        filtersForSelect[EnumFilterType.ISOLATE_TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;
        filtersForSelect[EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_FALSE;

        _selectableCompoundFilter.setFilterMode(filtersForSelect);
        for (f in filtersForSelect) {
            _basicFilterList[f].registerToCompoundFilter(_selectableCompoundFilter);
        }

        var filtersForOverride = {};
        filtersForOverride[EnumFilterType.ISOLATE_TRANSLUCENT] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.ISOLATE_TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.CONDITION_TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.TRANSLUCENT] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.OVERRIDEFILTER] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.USER_OVERRIDE] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.CONDITION_OVERRIDE] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.FROZENFILTER] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filtersForOverride[EnumFilterType.FROZENCONDITIONFILTER] = EnumFilterResultMode.MATCH_RETURN_TRUE;

        // different override conditions have different priority
        // translucent condition is highest, then frozen (no override material except translucent), then selection,
        // the last is normal override conditions
        var priorityForOverride = {};
        priorityForOverride[EnumFilterType.ISOLATE_TRANSLUCENT] = 5;
        priorityForOverride[EnumFilterType.ISOLATE_TRANSLUCENT_OTHERS] = 5;
        priorityForOverride[EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS] = 5;
        priorityForOverride[EnumFilterType.CONDITION_TRANSLUCENT_OTHERS] = 5;
        priorityForOverride[EnumFilterType.TRANSLUCENT] = 5;
        priorityForOverride[EnumFilterType.TRANSLUCENT_OTHERS] = 5;
        priorityForOverride[EnumFilterType.OVERRIDEFILTER] = 0;
        priorityForOverride[EnumFilterType.USER_OVERRIDE] = 0;
        priorityForOverride[EnumFilterType.CONDITION_OVERRIDE] = 0;
        priorityForOverride[EnumFilterType.FROZENFILTER] = 3;
        priorityForOverride[EnumFilterType.FROZENCONDITIONFILTER] = 3;

        _overrideCompoundFilter.setFilterMode(filtersForOverride);
        _overrideCompoundFilter.setFilterPriority(priorityForOverride);
        for (f in filtersForOverride) {
            _basicFilterList[f].registerToCompoundFilter(_overrideCompoundFilter);
        }

        var filterForHighOverride = {};
        filterForHighOverride[EnumFilterType.OVERRIDEFILTER] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filterForHighOverride[EnumFilterType.USER_OVERRIDE] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filterForHighOverride[EnumFilterType.CONDITION_OVERRIDE] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filterForHighOverride[EnumFilterType.CONDITION_TRANSLUCENT_OTHERS] = EnumFilterResultMode.MATCH_RETURN_TRUE;
        filterForHighOverride[EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS] = EnumFilterResultMode.NOMATCH_RETURN_TRUE;

        _highPriorityOverrideCompoundFilter.setFilterMode(filterForHighOverride);
        for (f in filterForHighOverride) {
            _basicFilterList[f].registerToCompoundFilter(_highPriorityOverrideCompoundFilter);
        }

        var filterForHiddenFileId = {};
        filterForHiddenFileId[EnumFilterType.FILE_VISIBLE] = EnumFilterResultMode.NOMATCH_RETURN_TRUE;
        filterForHiddenFileId[EnumFilterType.FILE_HIDDEN] = EnumFilterResultMode.MATCH_RETURN_TRUE;

        _hiddenFileIdCompoundFilter.setFilterMode(filterForHiddenFileId);
        for (f in filterForHiddenFileId) {
            _basicFilterList[f].registerToCompoundFilter(_hiddenFileIdCompoundFilter);
        }
    }

    _init();

    // ------------------------------------- external API ------------------------------------- //

    this.getFilterType = function () {
        return EnumFilterType;
    };

    this.saveState = function () {

        var obj = {};

        var basicFilter;
        for (var i = 0, len = _basicFilterList.length; i < len; i++) {
            basicFilter = _basicFilterList[i];
            obj[basicFilter.getName()] = basicFilter.getAll();
        }

        obj.sceneState = this.getSceneState();
        obj.version = "0.4";

        return obj;

    };

    this.loadState = function (obj) {
        // reset all filter state at first
        this.clearAll();

        if (obj.hasOwnProperty("version")) {
            if (obj.version == "0.4") {
                var filterMap = {};
                for (var i = 0, len = _basicFilterList.length; i < len; i++) {
                    filterMap[_basicFilterList[i].getName()] = i;
                }

                for (var attr in obj) {
                    if (attr === "sceneState" || attr === "version") {
                        continue;
                    }

                    if (filterMap.hasOwnProperty(attr)) {
                        _basicFilterList[filterMap[attr]].setByData(obj[attr]);
                    }
                    else {
                        CLOUD.Logger.warn("Warning: Not supported filter '" + attr + "'");
                    }
                }
            }
        }
        else {
            // process the compatibility with V3 Engine
            // old version use index as key, and selection state is managed in filter
            for (var index in obj) {
                if (index === "sceneState") {
                    continue;
                }

                // in old version, the third _basicFilterList element (index 2) is filter for selection, which is removed,
                // so need to shift the index for filters which index is larger than 2
                if (index < 2) {
                    _basicFilterList[index].setByData(obj[index]);
                }
                else if (index > 2) {
                    if (index < EnumFilterType.BASICFILTER_COUNT+2) {
                        _basicFilterList[index-1].setByData(obj[index]);
                    }
                }
                else if (index == 2) {
                    CLOUD.Logger.warn("Warning: Old version filter data! The selection state is out of the filter, can not restore it.")
                }
            }
        }

        this.setSceneState(obj.sceneState);

    };

    this.clear = function () {

        for (var i = 0, len = _basicFilterList.length; i < len; i++) {
            if (_basicFilterList[i].getType() === EnumFilterType.FROZENFILTER) {
                continue;
            }

            _basicFilterList[i].clearAll();
        }

        this.setSceneState(EnumSceneState.DISABLED);
    };

    this.clearAll = function () {

        for (var i = 0, len = _basicFilterList.length; i < len; i++) {
            _basicFilterList[i].clearAll();
        }

        this.setSceneState(EnumSceneState.DISABLED);
    };

    this.clearIsolate = function () {
        this.clearAllIsolateList();
        this.clearAllIsolateConditions();

    };

    // ---------------- frozen filter  ---------------- //

    this.clearFrozenList = function () {
        _frozenFilter.clearAll();
    };

    this.addToFrozenList = function (ids) {

        _frozenFilter.add(ids);
    };

    this.removeFromFrozenList = function (ids) {

        _frozenFilter.remove(ids);
    };

    this.setFrozenList = function (ids) {

        this.clearFrozenList();
        this.addToFrozenList(ids);

    };

    this.setFrozenConditions = function(conditions) {
        _basicFilterList[EnumFilterType.FROZENCONDITIONFILTER].setByData(conditions);
    };

    this.getFrozenConditions = function() {
        return _basicFilterList[EnumFilterType.FROZENCONDITIONFILTER].getAll();
    };

    this.clearFrozenConditions = function() {
        _basicFilterList[EnumFilterType.FROZENCONDITIONFILTER].clear();
    };

    this.clearFrozen = function() {
        this.clearFrozenList();
        this.clearFrozenConditions();
    };

    // ---------------- ID filter  ---------------- //
    this.clearAllIdList = function () {
        var i;
        for (i = EnumFilterType.IDFILTER_OFFSET; i <= IDFILTER_ENDOFFSET; i++) {
            _basicFilterList[i].clearAll();
        }

    };

    this.clearIdList = function (type) {
        var internalType = EnumFilterType.IDFILTER_OFFSET + type;

        if (internalType >= EnumFilterType.IDFILTER_OFFSET &&
            internalType <= EnumFilterType.IDFILTER_ENDOFFSET) {
            _basicFilterList[internalType].clear();
        }
    };

    this.addToIdList = function (type, ids) {
        var internalType = EnumFilterType.IDFILTER_OFFSET + type;

        if (internalType >= EnumFilterType.IDFILTER_OFFSET &&
            internalType <= EnumFilterType.IDFILTER_ENDOFFSET) {
            _basicFilterList[internalType].add(ids);
        }
    };


    this.removeFromIdList = function (type, ids) {
        var internalType = EnumFilterType.IDFILTER_OFFSET + type;

        if (internalType >= EnumFilterType.IDFILTER_OFFSET &&
            internalType <= EnumFilterType.IDFILTER_ENDOFFSET) {
            _basicFilterList[internalType].remove(ids);
        }
    };

    this.setIdList = function (type, ids) {

        this.clearIdList(type);
        this.addToIdList(type, ids);

    };

    // ----------------  override material --------------------------- //

    this.clearAllOverrideList = function () {
        _overrideFilter.clearAll();
    };

    this.clearOverrideList = function (name) {
        _overrideFilter.clear(name);
    };

    this.addToOverrideList = function (name, ids, materialName) {

        if (ids && ids.length > 0) {

            if (!_materialSelector.has(materialName)) {
                materialName = _materialSelector.getDefaultMaterialName();
            }

            _overrideFilter.add(name, ids, materialName);
        }

    };

    this.removeFromOverrideList = function (name, ids) {

        _overrideFilter.remove(name, ids);
    };

    this.setOverrideList = function (name, ids, materialName) {

        this.clearOverrideList(name);
        this.addToOverrideList(name, ids, materialName);

    };

    this.addToOverrideListByColor = function (name, ids, color) {

        var materialName = _materialSelector.add(color);
        _overrideFilter.add(name, ids, materialName);

    };

    this.setOverrideListByColor = function (name, ids, color) {

        this.clearOverrideList(name);
        this.addToOverrideListByColor(name, ids, color);
    };

    // ---------------------- user list--------------------- //

    this.clearAllUserList = function () {
        var i;
        for (i = EnumFilterType.USERFILTER_OFFSET;
             i <= EnumFilterType.USERFILTER_ENDOFFSET; i++) {
            _basicFilterList[i].clearAll();
        }
    };

    this.clearUserListByType = function (type) {
        var internalType = EnumFilterType.USERFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.USERFILTER_OFFSET &&
            internalType <= EnumFilterType.USERFILTER_ENDOFFSET) {
            _basicFilterList[internalType].clearAll();
        }

    };

    this.clearUserList = function (type, name) {
        var internalType = EnumFilterType.USERFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.USERFILTER_OFFSET &&
            internalType <= EnumFilterType.USERFILTER_ENDOFFSET) {
            _basicFilterList[internalType].clear(name);
        }

    };

    this.addToUserList = function (type, name, keys, value) {

        var internalType = EnumFilterType.USERFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.USERFILTER_OFFSET &&
            internalType <= EnumFilterType.USERFILTER_ENDOFFSET) {
            _basicFilterList[internalType].add(name, keys, value);
        }
    };

    this.removeFromUserList = function (type, name, keys) {

        var internalType = EnumFilterType.USERFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.USERFILTER_OFFSET &&
            internalType <= EnumFilterType.USERFILTER_ENDOFFSET) {
            _basicFilterList[internalType].remove(name, keys);
        }
    };

    this.setUserList = function (type, name, keys, value) {

        this.clearUserList(type, name);
        this.addToUserList(type, name, keys, value);

    };

    // ------------------- Isolate --------------------------- //

    this.isIsolate = function () {
        var i;
        for (i = EnumFilterType.ISOLATEFILTER_OFFSET;
             i <= EnumFilterType.ISOLATEFILTER_ENDOFFSET;
             i++) {
            if (!_basicFilterList[i].isEmpty()) {
                return true;
            }
        }

        return false;
    };

    this.isFiltering = function () {

        if (this.isIsolate()) {
            return true;
        }

        return (!_basicFilterList[EnumFilterType.HIDDEN].isEmpty() ||
            !_basicFilterList[EnumFilterType.VISIBLE].isEmpty() ||
            !_basicFilterList[EnumFilterType.TRANSLUCENT].isEmpty() ||
            !_basicFilterList[EnumFilterType.TRANSLUCENT_OTHERS].isEmpty() ||
            (this.getSceneState() !== EnumSceneState.DISABLED));
    };


    this.setIsolateMaterial = function (params) {

        _materialSelector.setIsolateMaterial(params);

    };

    this.getIsolateMaterial = function () {

        return _materialSelector.getIsolateMaterial();

    };

    this.resetIsolateMaterial = function () {

        _materialSelector.resetIsolateMaterial();

    };

    this.clearAllIsolateList = function () {
        var i;
        for (i = EnumFilterType.ISOLATEFILTER_OFFSET;
             i <= EnumFilterType.ISOLATEFILTER_ENDOFFSET;
             i++) {
            _basicFilterList[i].clear();
        }
    };

    this.clearIsolateList = function (type) {
        var internalType = EnumFilterType.ISOLATEFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.ISOLATEFILTER_OFFSET &&
            internalType <= EnumFilterType.ISOLATEFILTER_ENDOFFSET) {
            _basicFilterList[internalType].clear();
        }
    };

    this.addToIsolateList = function (type, ids) {
        var internalType = EnumFilterType.ISOLATEFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.ISOLATEFILTER_OFFSET &&
            internalType <= EnumFilterType.ISOLATEFILTER_ENDOFFSET) {
            _basicFilterList[internalType].add(ids);
        }
    };

    this.removeFromIsolateList = function (type, ids) {
        var internalType = EnumFilterType.ISOLATEFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.ISOLATEFILTER_OFFSET &&
            internalType <= EnumFilterType.ISOLATEFILTER_ENDOFFSET) {
            _basicFilterList[internalType].remove(ids);
        }
    };

    this.setIsolateList = function (type, ids) {
        this.clearIsolateList(type);
        this.addToIsolateList(type, ids);

    };

    // ------------------- Isolate Conditions --------------------------- //
    //

    this.setIsolateConditions = function (conditions, type) {
        var internalType = EnumFilterType.ISOLATECONDITIONFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.ISOLATECONDITIONFILTER_OFFSET &&
            internalType <= EnumFilterType.ISOLATECONDITIONFILTER_ENDOFFSET) {
            _basicFilterList[internalType].setByData(conditions);
        }
    };

    this.getIsolateConditions = function (type) {
        var items = null;

        var internalType = EnumFilterType.ISOLATECONDITIONFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.ISOLATECONDITIONFILTER_OFFSET &&
            internalType <= EnumFilterType.ISOLATECONDITIONFILTER_ENDOFFSET) {
            items = _basicFilterList[internalType].getAll();
        }

        return items;
    };

    this.clearIsolateConditions = function (type) {
        var internalType = EnumFilterType.ISOLATECONDITIONFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.ISOLATECONDITIONFILTER_OFFSET &&
            internalType <= EnumFilterType.ISOLATECONDITIONFILTER_ENDOFFSET) {
            _basicFilterList[internalType].clear();
        }
    };

    this.clearAllIsolateConditions = function () {
        var i;
        for (i = EnumFilterType.ISOLATECONDITIONFILTER_OFFSET;
             i <= EnumFilterType.ISOLATECONDITIONFILTER_ENDOFFSET;
             i++) {
            _basicFilterList[i].clearAll();
        }
    };

    // ------------------- Conditions --------------------------- //
    this.setConditions = function (type, conditions) {
        var internalType = EnumFilterType.CONDITIONFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.CONDITIONFILTER_OFFSET &&
            internalType <= EnumFilterType.CONDITIONFILTER_ENDOFFSET) {
            _basicFilterList[internalType].setByData(conditions);
        }
    };

    this.getConditions = function (type) {
        var items = null;

        var internalType = EnumFilterType.CONDITIONFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.CONDITIONFILTER_OFFSET &&
            internalType <= EnumFilterType.CONDITIONFILTER_ENDOFFSET) {
            items = _basicFilterList[internalType].get();
        }

        return items;
    };

    this.clearConditions = function (type) {
        var internalType = EnumFilterType.CONDITIONFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.CONDITIONFILTER_OFFSET &&
            internalType <= EnumFilterType.CONDITIONFILTER_ENDOFFSET) {
            _basicFilterList[internalType].clearAll();
        }
    };

    this.clearAllConditions = function () {
        var i;
        for (i = EnumFilterType.CONDITIONFILTER_OFFSET;
             i <= EnumFilterType.CONDITIONFILTER_ENDOFFSET;
             i++) {
            _basicFilterList[i].clear();
        }
    };

    // ---------- Override scene ---------- //
    this.makeSceneTranslucent = function () {
        this.setSceneState(EnumSceneState.TRANSLUCENT);
    },

    this.cancelSceneTranslucent = function () {
        this.setSceneState(EnumSceneState.DISABLED);
    };

    this.hideScene = function () {
        this.setSceneState(EnumSceneState.HIDDEN);
    };

    this.showScene = function () {
        this.setSceneState(EnumSceneState.DISABLED);
    };

    this.setSceneState = function (state) {
        _sceneState = state;
    };

    this.getSceneState = function () {
        return _sceneState;
    };

    this.cancelTranslucent = function () {
        this.clearIdList(EnumIdBasedType.TRANSLUCENT);
        this.clearIdList(EnumIdBasedType.TRANSLUCENT_OTHERS);
    };

    this._addIdsToFilter = function (type, ids) {
        var internalType = EnumFilterType.IDFILTER_OFFSET + type;
        if (internalType >= EnumFilterType.IDFILTER_OFFSET &&
            internalType <= EnumFilterType.IDFILTER_ENDOFFSET) {
            _basicFilterList[internalType].add(ids);
        }
    };

    this.hideByIds = function (ids) {
        this._addIdsToFilter(EnumIdBasedType.HIDDEN, ids);

    };

    this.showByIds = function (ids) {
        this._addIdsToFilter(EnumIdBasedType.VISIBLE, ids);

    };

    this.makeTranslucentByIds = function (ids) {
        this._addIdsToFilter(EnumIdBasedType.TRANSLUCENT, ids);

    };

    this.makeTranslucentOthersByIds = function (ids) {
        this._addIdsToFilter(EnumIdBasedType.TRANSLUCENT_OTHERS, ids);

    };

    //----------------- internal method --------------------//

    this._isVisible = function (object) {

        var sceneState = this.getSceneState();
        // scene is hidden
        if (sceneState === EnumSceneState.HIDDEN) {
            return false;
        }

        return _visibleCompoundFilter.apply(object);
    };

    this._isSelectable = function (object) {
        var sceneState = this.getSceneState();
        if (sceneState === EnumSceneState.TRANSLUCENT) {
            return false;
        }

        return _selectableCompoundFilter.apply(object, this.getSceneState());
    };

    this._getOverrideMaterial = function (object) {

        var sceneState = this.getSceneState();
        if (sceneState === EnumSceneState.TRANSLUCENT) {
            return _materialSelector.get('scene');
        }

        var matchedFilter = _overrideCompoundFilter.getApplyFilterId(object);

        var material = null;
        var materialName = '';
        switch (matchedFilter) {
            case EnumFilterType.ISOLATE_TRANSLUCENT:
            case EnumFilterType.ISOLATE_TRANSLUCENT_OTHERS:
            case EnumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS:
                material = this.getIsolateMaterial();
                break;
            case EnumFilterType.CONDITION_TRANSLUCENT_OTHERS:
            case EnumFilterType.TRANSLUCENT:
            case EnumFilterType.TRANSLUCENT_OTHERS:
                material = _materialSelector.get('scene');
                break;
            case EnumFilterType.FROZENFILTER:
            case EnumFilterType.FROZENCONDITIONFILTER:
                // if hit frozen filter, the object has no override material
                break;

            case EnumFilterType.OVERRIDEFILTER:
            case EnumFilterType.USER_OVERRIDE:
            case EnumFilterType.CONDITION_OVERRIDE:
                var itemValue = _basicFilterList[matchedFilter].getMatchItem(object);
                if (itemValue.hasOwnProperty("color")) {

                    materialName = _materialSelector.getMaterialNameByColor(itemValue.color);

                } else if (itemValue.material) {

                    materialName = itemValue.material;

                } else {

                    // set material directly
                    materialName = itemValue;
                }
                break;
        }

        if (!material && materialName !== '') {
            if (!_materialSelector.has(materialName)) {

                //console.log("no set override material, use default material!");
                materialName = _materialSelector.getDefaultMaterialName();
            }

            material = _materialSelector.get(materialName);
        }

        return material;
    };

    this._hasHighPriorityOverrideMaterial = function (object) {

        return this.getSceneState() === EnumSceneState.TRANSLUCENT ||
            _highPriorityOverrideCompoundFilter.apply(object);
    };

    this._isHiddenFileId = function (object) {
        return _hiddenFileIdCompoundFilter.apply(object);
    };

    this._hasHiddenFileIdFilter = function () {
        return !_hiddenFileIdCompoundFilter.isEmpty();
    };

    this._hasVisibleFilter = function () {
        return this.getSceneState() === EnumSceneState.HIDDEN || !_visibleCompoundFilter.isEmpty();
    };

    this._hasSelectableFilter = function () {
        return this.getSceneState() === EnumSceneState.TRANSLUCENT ||
            !_selectableCompoundFilter.isEmpty();
    };

    this._hasOverrideMaterialFilter = function () {
        return this.getSceneState() === EnumSceneState.TRANSLUCENT ||
            !_overrideCompoundFilter.isEmpty();
    };

    this._hasLowPriorityOverride = function () {

        return _overrideCompoundFilter.hasFilterNotIn(_highPriorityOverrideCompoundFilter);

    }
};

// base class for all filters
//
CLOUD.BasicFilter = function (type, name) {
    this._type = type;
    this._name = name;
    this._enabled = false;
    this._items = {};

    this._relatedCompoundFilterList = [];
};

CLOUD.BasicFilter.prototype.getType = function() {
    return this._type;
};

CLOUD.BasicFilter.prototype.getName = function() {
    return this._name;
};

CLOUD.BasicFilter.prototype.get = function() {
    return this._items;
};


CLOUD.BasicFilter.prototype.getAll = function () {

    return this._items;
};

CLOUD.BasicFilter.prototype.clearAll = function() {
    var scope = this;
    scope._items = {};

    if (scope._enabled) {
        scope._enabled = false;
        scope.enableStateChanged();
    }
};

CLOUD.BasicFilter.prototype.clear = function() {
    this.clearAll();
};

CLOUD.BasicFilter.prototype.isEmpty = function() {
    return !this._enabled;
};

CLOUD.BasicFilter.prototype.forceEnable = function() {
    if (!this._enabled) {
        this._enabled = true;
        this.enableStateChanged();
    }
}

CLOUD.BasicFilter.prototype.setByData = function (data) {
    var scope = this;

    function isEmpty(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // If it isn't an object at this point
        if (typeof obj !== "object") return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (obj.hasOwnProperty( key)) return false;
        }

        return true;
    }

    if (isEmpty(data)) {
        scope._items = {};

        if (scope._enabled) {
            scope._enabled = false;
            scope.enableStateChanged();
        }
    }
    else {
        scope._items = data;

        if (!scope._enabled) {
            scope._enabled = true;
            scope.enableStateChanged();
        }
    }
};

// require to override this method in child classes
CLOUD.BasicFilter.prototype.match = function(object) {
    return false;
};

CLOUD.BasicFilter.prototype.registerToCompoundFilter = function(compoundFilter) {
    this._relatedCompoundFilterList.push(compoundFilter);
};

CLOUD.BasicFilter.prototype.enableStateChanged = function() {
    var scope = this;

    for (var i = 0, len = scope._relatedCompoundFilterList.length; i < len; i++) {
        scope._enabled ? scope._relatedCompoundFilterList[i].addBaseFilter(scope) :
                                scope._relatedCompoundFilterList[i].removeBaseFilter(scope);
    }
};

/***************************************************************
 *
 ***************************************************************/

CLOUD.BasicIdFilter = function (type, name) {
    CLOUD.BasicFilter.call(this, type, name);
};

CLOUD.BasicIdFilter.prototype = Object.create(CLOUD.BasicFilter.prototype);
CLOUD.BasicIdFilter.prototype.constructor = CLOUD.BasicIdFilter;

CLOUD.BasicIdFilter.prototype.add = function(ids) {
    var scope = this;
    var items = scope._items;

    if (ids && ids.length > 0) {
        for (var i = 0, len = ids.length; i < len; ++i) {
            items[ids[i]] = true;
        }

        if (!scope._enabled) {
            scope._enabled = true;
            scope.enableStateChanged();
        }
    }
};

CLOUD.BasicIdFilter.prototype.remove = function(ids) {
    var scope = this;
    var items = scope._items;

    if (ids && ids.length > 0) {
        for (var i = 0, len = ids.length; i < len; ++i) {

            var id = ids[i];

            if (items.hasOwnProperty(id)) {
                delete items[id];
            }

        }

        if (items.length === 0 && scope._enabled) {
            scope._enabled = false;
            scope.enableStateChanged();
        }
    }
};


CLOUD.ListFilter = function (type, name) {
    CLOUD.BasicFilter.call(this, type, name);
};

CLOUD.ListFilter.prototype = Object.create(CLOUD.BasicFilter.prototype);
CLOUD.ListFilter.prototype.constructor = CLOUD.ListFilter;

CLOUD.ListFilter.prototype.remove = function(name, keys) {
    var scope = this;
    var item = scope._items[name];

    if (item && keys && keys.length > 0) {
        for (var i = 0, len = keys.length; i < len; ++i) {

            var key = keys[i];

            if (item.hasOwnProperty(key)) {
                delete item[key];
            }

        }

        if (CLOUD.Utils.isEmptyObject(scope._items) && scope._enabled) {
            scope._enabled = false;
            scope.enableStateChanged();
        }
    }
};

CLOUD.ListFilter.prototype.add = function (name, keys, value) {
    var scope = this;

    var items = scope._items;
    var item = items[name];

    if (keys && keys.length > 0) {
        if (value === undefined) {
            value = true;
        }

        if (!item) {
            item = items[name] = {};
        }

        for (var i = 0, len = keys.length; i < len; ++i) {
            item[keys[i]] = value;
        }

        if (!scope._enabled) {
            scope._enabled = true;
            scope.enableStateChanged();
        }
    }
};

CLOUD.ListFilter.prototype.clear = function (name) {
    var scope = this;
    var items = scope._items;

    if (items.hasOwnProperty(name)) {

        delete items[name];
        //_items[name] = {};

        if (CLOUD.Utils.isEmptyObject(items) && scope._enabled) {
            scope._enabled = false;
            scope.enableStateChanged();
        }
    }
};

CLOUD.UserListFilter = function (type, name) {
    CLOUD.BasicFilter.call(this, type, name);
};

CLOUD.UserListFilter.prototype = Object.create(CLOUD.ListFilter.prototype);
CLOUD.UserListFilter.prototype.constructor = CLOUD.UserListFilter;

CLOUD.UserListFilter.prototype.match = function(object) {

    return this.getMatchItem(object) !== null;
};

CLOUD.UserListFilter.prototype.getMatchItem = function(object) {
    var items = this._items;
    var userData = object.userData;
    if (userData) {
        for (var name in items) {
            var item = items[name];
            var key = userData[name];

            if (key && item[key] !== undefined) {
                return item[key];
            }
        }
    }

    return null;
};

CLOUD.OverrideListFilter = function(type, name) {
    CLOUD.BasicFilter.call(this, type, name);
};

CLOUD.OverrideListFilter.prototype = Object.create(CLOUD.ListFilter.prototype);
CLOUD.OverrideListFilter.prototype.constructor = CLOUD.OverrideListFilter;

CLOUD.OverrideListFilter.prototype.match = function(object) {

    return this.getMatchItem(object) !== null;
};

CLOUD.OverrideListFilter.prototype.getMatchItem = function(object) {
    var items = this._items;
    var id = object.name;
    for (var name in items) {

        var item = items[name];
        if (item[id]) {

            return item[id];
        }
    }

    return null;
};

CLOUD.ConditionFilter = function (type, name) {
    CLOUD.BasicFilter.call(this, type, name);
};

CLOUD.ConditionFilter.prototype = Object.create(CLOUD.BasicFilter.prototype);
CLOUD.ConditionFilter.prototype.constructor = CLOUD.ConditionFilter;

CLOUD.ConditionFilter.prototype.match = function (object) {

    function matchConditions (conditions, userData) {

        // 多个数组取并集
        var isMatch;
        for (var i = 0, len = conditions.length; i < len; ++i) {
            isMatch = true;
            var condition = conditions[i];
            for (var attr in condition) {
                if (condition[attr] != userData[attr]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return true;
            }
        }

        return false;
    }

    var userData = object.userData;
    if (userData) {

        return matchConditions(this._items, userData);
    }

    return false;
};

CLOUD.MultiConditionFilter = function (type, name) {
    CLOUD.BasicFilter.call(this, type, name);
};

CLOUD.MultiConditionFilter.prototype = Object.create(CLOUD.BasicFilter.prototype);
CLOUD.MultiConditionFilter.prototype.constructor = CLOUD.MultiConditionFilter;


CLOUD.MultiConditionFilter.prototype.match = function (object) {

    return this.getMatchItem(object) !== null;
};

CLOUD.MultiConditionFilter.prototype.getMatchItem = function(object) {
    var conditions = this._items;
    var userData = object.userData;

    var isMatch;
    if (userData) {

        var len = conditions.length;
        for (var i = 0; i < len; ++i) {
            var item = conditions[i];
            var condition = item.condition;
            isMatch = true;
            for (var attr in condition) {

                if (condition[attr] != userData[attr]) {
                    isMatch = false;
                    break;
                }

            }

            if (isMatch) {
                return item;
            }

        }
    }

    return null;
};

/***************************************************************
 *
 ***************************************************************/
CLOUD.FileIdFilter = function (type, name) {
    CLOUD.BasicIdFilter.call(this, type, name);
};

CLOUD.FileIdFilter.prototype = Object.create(CLOUD.BasicIdFilter.prototype);
CLOUD.FileIdFilter.prototype.constructor = CLOUD.FileIdFilter;

CLOUD.FileIdFilter.prototype.match = function(object) {

    // TODO: [Secondary way] extracting 'sceneId' run timely.
    // from node's userId (fileId.meshId). remove this when getting better choice.
    // Assumption (Wanda Project): Node's userId is encoded by sceneId.meshId,
    // review VAAS-252 for details.
    var userId = object.name;
    if(userId) {
        var idx = userId.indexOf('.');
        if (idx  !== -1) {
            var fileId = userId.substring(0, idx);
            return this._items[fileId] ? true : false;
        }
    }

    // TODO: [Expected Way]filtering by userData keyword 'sceneId'
    //       But the 'sceneId' was not serialized into userData
    //       because of potential huge disk size.
    //       userData was shared among items, so they can not be override at run time.
    var userData = object.userData;
    if (userData) {

        var fileId = userData.sceneId;
        if (fileId) {
            return this._items[fileId] ? true : false;
        }
    }

    return false;
};

CLOUD.GeneralIdFilter = function (type, name) {
    CLOUD.BasicIdFilter.call(this, type, name);
};

CLOUD.GeneralIdFilter.prototype = Object.create(CLOUD.BasicIdFilter.prototype);
CLOUD.GeneralIdFilter.prototype.constructor = CLOUD.GeneralIdFilter;


CLOUD.GeneralIdFilter.prototype.match = function(object) {
    return this._items[object.name] ? true : false;
};


CLOUD.FilterResultMode = {
    MATCH_RETURN_TRUE    : 0,
    MATCH_RETURN_FALSE   : 1,
    NOMATCH_RETURN_TRUE  : 2,
    NOMATCH_RETURN_FALSE : 3
};

CLOUD.CompoundFilter = function (ret) {
    // latest filter is added to the last of the list 
    this._activeFilterList = [];

    // key is filter id, value is the parse mode to filter result
    this._filterResultModes = {};

    // default return value when check object with the filter
    this._defaultRetValue = ret;

    // priority for filter
    // if not set, the last added filter has the highest priority
    this._filterPriority = null;
};

CLOUD.CompoundFilter.prototype.setFilterMode = function(modes) {
	this._filterResultModes = modes;
};

CLOUD.CompoundFilter.prototype.setFilterPriority = function(priority) {
    this._filterPriority = priority;
};

CLOUD.CompoundFilter.prototype.addBaseFilter = function(filter) {
    var activeList = this._activeFilterList;
    var i = activeList.indexOf(filter);

    if (this._filterPriority === null) {
        if (i === -1) {
            // append the filter to the last of the list
            activeList.push(filter);
        }
        else if (i !== activeList.length - 1) {

            // if the filter is in the list and not in the last, remove it at first
            activeList.splice(i, 1);

            // append the filter to the last of the list
            activeList.push(filter);
        }
    }
    else {
        if (activeList.length === 0) {
            activeList.push(filter);
        }
        else {
            if (i !== -1 && i !== activeList.length - 1) {
                // if the filter is in the list and not in the last, remove it at first
                activeList.splice(i, 1);
            }

            var priority = this._filterPriority[filter.getType()];
            // find proper position according to priority
            for (var li = 0, len = activeList.length; li < len; li++) {
                if (this._filterPriority[activeList[li].getType()] > priority) {
                    activeList.splice(li, 0, filter);
                    break;
                }
            }

            if (li === len) {
                activeList.push(filter);
            }
        }
    }
};

CLOUD.CompoundFilter.prototype.removeBaseFilter = function(filter) {
    // remove the filter from list
    var i = this._activeFilterList.indexOf(filter);
    if(i !== -1) {
        this._activeFilterList.splice(i, 1);
    }
};

CLOUD.CompoundFilter.prototype.isEmpty = function() {
    return this._activeFilterList.length === 0;
};

CLOUD.CompoundFilter.prototype.hasFilterNotIn = function(other) {
    var filterList = this._activeFilterList;

    for (var i = filterList.length - 1; i >= 0; i--) {
        var filter = filterList[i];
        if (other._filterResultModes[filter.getType()] === undefined) {
            return true;
        }
    }

    return false;
};

CLOUD.CompoundFilter.prototype.apply = function(object) {
    var scope = this;
    var parseMode = CLOUD.FilterResultMode;
    var filter;
    for (var i = scope._activeFilterList.length - 1; i >= 0; i--) {
        filter = scope._activeFilterList[i];
        switch (scope._filterResultModes[filter.getType()]) {
            case parseMode.MATCH_RETURN_TRUE :
                if (filter.match(object)) return true;
                break;

            case parseMode.MATCH_RETURN_FALSE :
                if (filter.match(object)) return false;
                break;

            case parseMode.NOMATCH_RETURN_TRUE :
                if (!filter.match(object)) return true;
                break;

            case parseMode.NOMATCH_RETURN_FALSE :
                if (!filter.match(object)) return false;
                break;

        }
    }

    return scope._defaultRetValue;
};

CLOUD.CompoundFilter.prototype.getApplyFilterId = function(object) {
    var scope = this;
    var parseMode = CLOUD.FilterResultMode;
    var filter;
    for (var i = scope._activeFilterList.length - 1; i >= 0; i--) {
        filter = scope._activeFilterList[i];
        switch (scope._filterResultModes[filter.getType()]) {
            case parseMode.MATCH_RETURN_TRUE :
            case parseMode.MATCH_RETURN_FALSE :
                if (filter.match(object)) return filter.getType();
                break;

            case parseMode.NOMATCH_RETURN_TRUE :
            case parseMode.NOMATCH_RETURN_FALSE :
                if (!filter.match(object)) return filter.getType();
                break;

        }
    }

    return -1;
};

var CloudTouch	= CloudTouch || {};

(function() {
    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;

    var TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    var INPUT_TYPE_TOUCH = 'touch';

    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;

    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

    // 处理touch事件
    var touchsHandler = function(manage, event) {
        var manage_scope = manage;
        var input = {
            pointers: event.touches,
            changedPointers: event.changedTouches,
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: event
        };

        var pointersLen = event.touches.length;
        var changedPointersLen = event.changedTouches.length;
        var eventType = TOUCH_INPUT_MAP[event.type];
        var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
        var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;

        if (isFirst) {
            manage_scope.session = {};
        }

        input.eventType = eventType;

        computeTouchData(manage_scope, input);

        manage_scope.session.prevInput = input;
    };

    // 复制touch数据
    var simpleCloneTouchData = function(input) {
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) {
            pointers[i] = {
                clientX: Math.round(input.pointers[i].clientX),
                clientY: Math.round(input.pointers[i].clientY)
            };
            i++;
        }

        return {
            timeStamp: Date.now(),
            pointers: pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX || 0,
            deltaY: input.deltaY || 0
        };
    }

    // 得到所有点的中心点
    var getCenter = function(pointers) {
        var pointersLength = pointers.length;

        // no need to loop when only one touch
        if (pointersLength === 1) {
            return {
                x: Math.round(pointers[0].clientX),
                y: Math.round(pointers[0].clientY)
            };
        }

        var x = 0, y = 0, i = 0;
        while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
        }

        return {
            x: Math.round(x / pointersLength),
            y: Math.round(y / pointersLength)
        };
    }

    // 计算并缓存touch数据
    var computeTouchData = function(manager, input) {
        var session = manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;

        // store the first input to calculate the distance and direction
        if (!session.firstInput) {
            session.firstInput = simpleCloneTouchData(input);
        }

        // to compute scale and rotation we need to store the multiple touches
        if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneTouchData(input);
        } else if (pointersLength === 1) {
            session.firstMultiple = false;
        }

        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

        var center = input.center = getCenter(pointers);
        input.timeStamp = Date.now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;

        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);

        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

        // 计算偏移量
        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

        input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length > session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);
    }

    // 计算输入数据的偏移量
    var computeDeltaXY = function(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};

        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session.prevDelta = {
                x: prevInput.deltaX || 0,
                y: prevInput.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }

        // 相对第一个点的偏移量
        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);

        if (input.eventType === INPUT_START) {
            // 相对前一个点的偏移量
            input.relativeDeltaX = 0;
            input.relativeDeltaY = 0;
            // 相对前一个点的旋转量
            input.relativeRotation = 0;
            // 相对前一个点的缩放量
            input.relativeScale = 1;
            // 相对前一个点的角度变化量
            input.deltaAngle = 0;
        } else {
            // 相对前一个点的偏移量
            input.relativeDeltaX = center.x - prevInput.center.x
            input.relativeDeltaY = center.y - prevInput.center.y;
            // 相对前一个点的旋转量
            input.relativeRotation = input.rotation - prevInput.rotation;
            // 相对前一个点的缩放量
            input.relativeScale = input.scale / prevInput.scale;
            // 相对前一个点的角度变化量
            input.deltaAngle = input.angle - prevInput.angle;
        }

    }

    // 获得点的方向
    var getDirection = function(x, y) {
        if (x === y) {
            return DIRECTION_NONE;
        }

        if (Math.abs(x) >= Math.abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }

        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }

    // 计算两个点的距离
    var getDistance = function(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];

        return Math.sqrt((x * x) + (y * y));
    }

    // 计算两个点的角度
    var getAngle = function(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x);
    }

    // 计算两个点集的旋转角度
    var getRotation = function(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }

    // 计算两个点集的缩放系数
    var getScale =function(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }

    // export it
    CloudTouch.proxy = {
        INPUT_START: INPUT_START,
        INPUT_MOVE: INPUT_MOVE,
        INPUT_END: INPUT_END,
        INPUT_CANCEL: INPUT_CANCEL,
        DIRECTION_NONE: DIRECTION_NONE,
        DIRECTION_LEFT: DIRECTION_LEFT,
        DIRECTION_RIGHT: DIRECTION_RIGHT,
        DIRECTION_UP: DIRECTION_UP,
        DIRECTION_DOWN: DIRECTION_DOWN,
        DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL: DIRECTION_VERTICAL,
        DIRECTION_ALL: DIRECTION_ALL,
        touchsHandler	: touchsHandler
    };
})();
CLOUD.CameraControl = function (viewer, scene, camera, domElement, onChange) {

    this.viewer = viewer;
    this.camera = camera;
    this.domElement = domElement;
    this.scene = scene;

    this.intersector = new CLOUD.IntersectHelper(viewer.filter);

    var _EPS = 0.000001;
    var _zAxisUp = new THREE.Vector3(0, 1, 0); // const

    var _lastPosition = new THREE.Vector3();
    var _lastQuaternion = new THREE.Quaternion();

    var _lastTrackingPoint;

    var _scope = this;

    var _cameraChanging = false;
	
	this.pivotBallGroup = null;

    /**
     * 判断相机是否发生变化
     *
     * @return {Boolean} 相机是否发生变化
     */
    this.isCameraChanging = function () {
        return _cameraChanging;
    };

    /**
     * 设置相机变化状态
     *
     * @return {Boolean} 相机是否发生变化
     */
    this.setCameraChanging = function (changing) {

        // 批注需要检测相机的变化状态，
        // 之前用的是camera.dirty，现在dirty只用于相机是否需要更新mvp，
        // 导致相机发生变化后，批注状态关闭功能失效，这里简单加入一个状态标识，后续采用消息机制处理
        _cameraChanging = changing;
    };


    /** switch to another camera. */
    this.setCamera = function(camera) {
        this.camera = camera;
    };

    this.getCamera = function () {
        this.camera.updateMVP(); // 获取相机时，更新MVP
        return this.camera;
    };

    this.dirtyCamera = function (dirty) {
        this.camera.dirty = dirty;
    };

    this.getFrustum = function () {
        return this.camera.getFrustum();
    };

    // TODO: this is not cameraControl's responsibility, get size by viewer.
    this.getClientSize = function() {
        var element = _scope.domElement === document ? _scope.domElement.body : _scope.domElement;

        return new THREE.Vector2(element.clientWidth, element.clientHeight);
    };
	
	this.delayHandle = function () {
		
		function handle() {
            _scope.update(true, true);
		}

		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}

		// 延迟200ms以判断是否单击
		this.timeoutId = setTimeout(handle, 200);
		this.needUpdateRenderList(false);
	};

    /**
     *
     * @param delta  distance range in x,y dimension in pixel size
     * @param pivot  rotation pivot
     */
    this.processRotate = function (delta, pivot) {

        var clientSize = this.getClientSize();
		
        // rotating across whole screen goes 360 degrees around
        var thetaDelta = -2 * Math.PI * delta.x / clientSize.x;

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        var phiDelta = -2 * Math.PI * delta.y / clientSize.y;

        _scope.handleRotation(thetaDelta, phiDelta, pivot);
    };

    this.handleRotation = function (thetaDelta, phiDelta, pivot ) {

        var camera = this.camera;
        var position = camera.position;
        var target = camera.target;
        var camDir = camera.getWorldDirection();

        var eye = target.clone().sub(position);
        var eyeDistance = eye.length();

        var viewTrf = null;

        // 调整相机位置
        var adjustCameraPosition = function (trf) {

            var viewVec, viewLength, newViewDir;
            var newTarget = new THREE.Vector3(); // 新目标点

            if (pivot) {

                viewVec = position.clone().sub(pivot);
                viewLength = viewVec.length();
                viewVec.normalize();

                newViewDir = viewVec.clone().applyQuaternion(trf).normalize();

                // 相机新位置
                position.copy(pivot).add(newViewDir.multiplyScalar(viewLength));

                // 保持相机到目标点的距离不变
                camDir.applyQuaternion(trf).normalize();

                // 设置target新位置
                newTarget.copy(position).add(camDir.multiplyScalar(eyeDistance));
                target.copy(newTarget);

            } else {

                viewVec = eye.clone();
                viewLength = eyeDistance;
                viewVec.normalize();

                newViewDir = viewVec.clone().applyQuaternion(trf).normalize();

                // 设置target新位置
                newTarget.copy(position).add(newViewDir.multiplyScalar(viewLength));
                target.copy(newTarget);
            }

        };

        var up = camera.realUp || camera.up;
        var rightDir = camDir.clone().cross(up).normalize();
        var realUp = rightDir.clone().cross(camDir).normalize();
        camera.realUp.copy(realUp);

        var rotAxis;

        // 锁定Z轴
        if (CLOUD.EditorConfig.LockAxisZ) {

            // 水平旋转
            if (Math.abs(thetaDelta) > Math.abs(phiDelta)) {

                rotAxis = _zAxisUp;
                viewTrf = new THREE.Quaternion().setFromAxisAngle(rotAxis, thetaDelta);
                adjustCameraPosition(viewTrf);
                camera.realUp.applyQuaternion(viewTrf).normalize();

            }

        } else {

            // 水平旋转
            if (Math.abs(thetaDelta) > Math.abs(phiDelta)) {

                // remark: this.camera.up 的使用有些奇怪，大多数都被置成了 THREE.Object3D.DefaultUp，后续需要在重新考虑下
                // 当this.camera.up为THREE.Object3D.DefaultUp时，其实水平旋转就是锁定了Z轴的旋转(模型的Z轴对应场景的Y轴)
                rotAxis = camera.up.clone().normalize();
                viewTrf = new THREE.Quaternion().setFromAxisAngle(rotAxis, thetaDelta);
                adjustCameraPosition(viewTrf);
                camera.realUp.applyQuaternion(viewTrf).normalize();

            } else if (Math.abs(phiDelta) > 0.0001) { // 垂直旋转

                rotAxis = camDir.clone().cross(up).normalize();
                viewTrf = new THREE.Quaternion().setFromAxisAngle(rotAxis, phiDelta);
                adjustCameraPosition(viewTrf);
                camera.realUp.applyQuaternion(viewTrf).normalize();

                // 旋转180度时，up的y值应该反向，否则移动会反
                this.adjustCameraUp();
            }

        }

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    this.adjustCameraForPan = function(pan) {
        var camera = this.camera;

        camera.target.add(pan);
        camera.position.add(pan);
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    // Invoking from viewer.render
    this.updateCamera = function() {

        var camera = this.camera;
        if(!camera.dirty) {
            return;
        }

        camera.lookAt(camera.target);
        camera.updateMVP();
    };

    // Invoking by editor tools
    this.update = function(forceRender, updateRenderList) {

        this.updateCamera();

        var camera = this.camera;
        if (forceRender) {
            //CLOUD.Logger.log("CameraControl.forceRender");
            if (updateRenderList !== undefined) {
                this.needUpdateRenderList(updateRenderList);
            }

            onChange();

            // render 可能会直接返回，这样直接关闭相机状态会出现问题
            // this.setCameraChanging(false); // add

            _lastPosition.copy(camera.position);
            _lastQuaternion.copy(camera.quaternion);
        } else {

            // update condition is:
            // min(camera displacement, camera rotation in radians)^2 > EPS
            // using small-angle approximation cos(x/2) = 1 - x^2 / 8

            if (_lastPosition.distanceToSquared(camera.position) > _EPS
                || 8 * (1 - _lastQuaternion.dot(camera.quaternion)) > _EPS) {

                //CLOUD.Logger.log("CameraControl.render");
                onChange();

                // render 可能会直接返回，这样直接关闭相机状态会出现问题
                // this.setCameraChanging(false); // add

                _lastPosition.copy(camera.position);
                _lastQuaternion.copy(camera.quaternion);
            }
        }

    };
	
	this.updateView = function (updateRenderList) {

        if (updateRenderList !== undefined) {
            this.needUpdateRenderList(updateRenderList);
        }

        onChange();

        // render 可能会直接返回，这样直接关闭相机状态会出现问题
        // this.setCameraChanging(false); // add
    };

	this.updateHighlight = function () {

	    onChange(true);

        // render 可能会直接返回，这样直接关闭相机状态会出现问题
        // this.setCameraChanging(false); // add
    };


    // 是否需要更新RenderList
    this.needUpdateRenderList = function (need) {
        this.viewer.editorManager.isUpdateRenderList = need;
    };

    // pass in x,y of change desired in pixel space,
    // right and down are positive
    this.pan = function (deltaX, deltaY) {
        var element = _scope.domElement === document ? _scope.domElement.body : _scope.domElement;
		var offset = new THREE.Vector3();

		// pass in distance in world space to move left
		function panLeft (distance) {
			var te = _scope.camera.matrix.elements;

			// get X column of matrix
			offset.set(te[0], te[1], te[2]);
			offset.multiplyScalar(-distance);

			_scope.camera.target.add(offset);
			_scope.camera.position.add(offset);
		}

		// pass in distance in world space to move up
		function panUp (distance) {
			var te = _scope.camera.matrix.elements;

			// get Y column of matrix
			offset.set(te[4], te[5], te[6]);
			offset.multiplyScalar(distance);

			_scope.camera.target.add(offset);
			_scope.camera.position.add(offset);
		}

        if (_scope.camera.isPerspective) {
            // perspective
            var position = _scope.camera.position;
            var targetDistance = position.clone().sub(_scope.camera.target).length();

            // half of the fov is center to top of screen
            targetDistance *= Math.tan((_scope.camera.fov / 2) * Math.PI / 180.0);

            //CLOUD.Logger.log(targetDistance);
            // we actually don't use screenWidth, since perspective camera is fixed to screen height
            panLeft(2 * deltaX * targetDistance / element.clientHeight);
            panUp(2 * deltaY * targetDistance / element.clientHeight);
        } else if (_scope.camera.top !== undefined) {
            // orthographic
            panLeft(deltaX * (_scope.camera.right - _scope.camera.left) / element.clientWidth);
            panUp(deltaY * (_scope.camera.top - _scope.camera.bottom) / element.clientHeight);
        } else {
            // camera neither orthographic or perspective
            CLOUD.Logger.warn('WARNING: CloudPickEditor.js encountered an unknown camera type - pan disabled.');
        }

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    this.panOnWorld = function () {

        var startPoint = new THREE.Vector3();
        var endPoint = new THREE.Vector3();
        var delta = new THREE.Vector3();

        return function (panStart, panEnd, pan, worldDimension) {

            var canvasContainer = _scope.getContainerDimensions();

            // 规范化开始点
            var canvasX = panStart.x - canvasContainer.left;
            var canvasY = panStart.y - canvasContainer.top;
            startPoint.x = canvasX / canvasContainer.width;
            startPoint.y = canvasY / canvasContainer.height;

            // 规范化结束点
            canvasX = panEnd.x - canvasContainer.left;
            canvasY = panEnd.y - canvasContainer.top;
            endPoint.x = canvasX / canvasContainer.width;
            endPoint.y = canvasY / canvasContainer.height;

            delta.subVectors(endPoint, startPoint);

            var offsetX = -delta.x * worldDimension.x;
            var offsetY = delta.y * worldDimension.y;
            var deltaX = _scope.getWorldRight().multiplyScalar(offsetX);
            var deltaY = _scope.getWorldUp().multiplyScalar(offsetY);

            pan.addVectors(deltaX, deltaY);
            _scope.dirtyCamera(true);
            _scope.setCameraChanging(true); // add
        }

    }();

    this.adjustCameraForDolly = function(scale, dollyPoint){

        var scaleFactor = scale - 1.0;

        if (Math.abs(scaleFactor) < _EPS) {
            return false;
        }

        var camera = this.camera;
        var cameraPosition = camera.position;
        var dirEye = this.getWorldEye();
        var dirDolly = new THREE.Vector3();

        if (!dollyPoint) {
            dirDolly.copy(dirEye);
        } else {
            dirDolly.subVectors(dollyPoint, cameraPosition);
        }

        dirDolly.multiplyScalar(scaleFactor);

        var distance = dirDolly.length();

        // 透视投影下允许穿透
        if (camera.isPerspective) {

            if (distance < this.minDollyDistance) {

                dirDolly.normalize().multiplyScalar(this.minDollyDistance);

            }
        }
        else {

            camera.orthoScale *= scale;
            camera.setZoom(camera.orthoScale);
        }

        var newCameraPosition = new THREE.Vector3();
        newCameraPosition.addVectors(cameraPosition, dirDolly);

        camera.position.copy(newCameraPosition);
        camera.target.copy(dirEye.add(newCameraPosition));
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    this.dolly = function (dollyCenterX, dollyCenterY, scale) {

        var pos = new THREE.Vector2(dollyCenterX, dollyCenterY);
        var intersectContext = this.getIntersectContext(pos);
        var centerPosition = this.intersector.hitTest(intersectContext);

        if (centerPosition != null) {
            this.adjustCameraForDolly(scale, centerPosition);
        } else {
            this.adjustCameraForDolly(scale, null);
        }
    };


    this.dollyByPoint = function (cx, cy, scale) {

        var trackingPoint = this.getTrackingPoint(cx, cy);
        this.adjustCameraForDolly(scale, trackingPoint);

    };

    this.endOperation = function () {
        this.intersector.lastIntersect = null;
    };

    // factor (-1, 1): 正数 - 放大， 负数 - 缩小
    this.zoom = function (factor, cx, cy) {
        var scale;
        if (factor > 0) {
            scale = 1.0 / (1 - factor);
            //this.dollyIn(1 - factor);
        } else {
            //this.dollyOut(1 + factor);
            scale = 1 + factor;
        }

        if (cx === undefined || cy === undefined) {
            this.adjustCameraForDolly(scale, null);
        }else {
            this.dollyByPoint(cx, cy, scale);
        }

        this.update();
    };

    /**
     * 获得canvas父容器尺寸 ({width : xxx, height : xxx, left : xxx, top : xxx})
     *
     * @return {Object} 如果父容器存在，则返回父容器尺寸， 否则，返回 null
     */
    this.getContainerDimensions = function () {
        return CLOUD.DomUtil.getContainerOffsetToClient(this.domElement);
    };

    this.computeFrustum = function () {

        var projectionMatrix = new THREE.Matrix4();
        var viewProjectionMatrix = new THREE.Matrix4();

        return function (x1, x2, y1, y2, frustum, dim) {

            var camera = this.camera;

            var ymax = camera.near * Math.tan(THREE.Math.degToRad(camera.fov * 0.5));
            var xmax = ymax * camera.aspect;

            var rx1 = ((x1 - dim.left) / dim.width) * 2 - 1;
            var rx2 = ((x2 - dim.left) / dim.width) * 2 - 1;
            var ry1 = -((y1 - dim.top) / dim.height) * 2 + 1;
            var ry2 = -((y2 - dim.top) / dim.height) * 2 + 1;

            projectionMatrix.makePerspective(rx1 * xmax, rx2 * xmax, ry1 * ymax, ry2 * ymax, camera.near, camera.far);

            camera.updateMatrixWorld();
            camera.matrixWorldInverse.getInverse(camera.matrixWorld);
            viewProjectionMatrix.multiplyMatrices(projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromMatrix(viewProjectionMatrix);

        };

    }();

    this.screenToCanvas = function (cx, cy) {

        var dim = this.getContainerDimensions();
        return {x: cx - dim.left, y: cy - dim.top};

    };

    this.mapScreenToLocal = function (cx, cy, target) {
        var dim = this.getContainerDimensions();
        target.set(cx - dim.left, dim.height - (cy - dim.top));
    };

    this.mapWindowToViewport = function (cx, cy, target) {
        var dim = this.getContainerDimensions();
        var mouse = target || new THREE.Vector2();

        mouse.x = ((cx - dim.left) / dim.width) * 2 - 1;
        mouse.y = -((cy - dim.top) / dim.height) * 2 + 1;

        return mouse;
    };

    this.getCameraName = function () {
        var name;
        if (this.camera === viewer.defaultCamera) {
            if (this.camera.isPerspective) {
                name = "persp";
            } else {
                name = "orth";
            }

        }  else {
            name = this.camera.name;
        }

        return name;
    };

    this.getCameraInfo = function () {
        var camInfo = new CLOUD.CameraInfo(this.getCameraName(), this.camera.position, this.camera.target, this.camera.up);
        return JSON.stringify(camInfo);
    };

    // 放大缩小限制：根据相机与目标点距离来判断是否需要继续放大或缩小
    // 在限制范围内，可以继续缩放，否则，不再缩放
    this.isKeepZoom = function (zoom, minDistance, maxDistance) {

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add

        if (minDistance === undefined) {
            minDistance = this.minDistance;
        }

        if (maxDistance === undefined) {
            maxDistance = this.maxDistance;
        }

        var position = this.camera.position;
        var target = this.camera.target;
        var offset = new THREE.Vector3();

        offset.copy(position).sub(target);
        var distance = offset.length() * (2 - zoom); // D = X + X * (1 - factor)

        if (distance < minDistance || distance > maxDistance) {
            return false;
        }

        return true;
    };

    this.computeRotation = function () {
        // 旋转矩阵
        var m1 = new THREE.Matrix4();
        m1.lookAt(this.camera.position, this.camera.target, this.camera.up);

        var quat2 = new THREE.Quaternion();
        quat2.setFromRotationMatrix(m1);

        // 获得旋转角
        var rotation = new THREE.Euler();
        rotation.setFromQuaternion(quat2, undefined, false);

        return rotation;
    };

    this.adjustCameraUp = function () {

        if (this.camera.realUp.y > 0) {

            this.camera.up = new THREE.Vector3(0, 1, 0);

        } else if (this.camera.realUp.y < 0) {

            this.camera.up = new THREE.Vector3(0, -1, 0);

        } else {

            if (this.camera.realUp.x > 0) {

                this.camera.up = new THREE.Vector3(1, 0, 0);

            } else if (this.camera.realUp.x < 0) {

                this.camera.up = new THREE.Vector3(-1, 0, 0);

            } else {

                if (this.camera.realUp.z > 0) {

                    this.camera.up = new THREE.Vector3(0, 0, 1);

                } else if (this.camera.realUp.z < 0) {

                    this.camera.up = new THREE.Vector3(0, 0, -1);
                }
            }
        }

    };

    this.getWorldEye = function () {
        return this.camera.target.clone().sub(this.camera.position);
    };

    this.getWorldRight = function () {
        var right = new THREE.Vector3();
        var up = this.camera.up;
        var eye = this.getWorldEye();
        right.crossVectors(eye, up);

        if (right.lengthSq() === 0) {
            if (up.z > up.y)
                eye.y -= 0.0001;
            else
                eye.z += 0.0001;

            right.crossVectors(eye, up);
        }

        return right.normalize();
    };

    this.getWorldUp = function () {
        var right = this.getWorldRight();
        var eye = this.getWorldEye();
        return right.cross(eye).normalize();
    };

    this.getWorldDimension = function (cx, cy) {

        var position = this.camera.position;
        var eye = this.getWorldEye().normalize();

        // 计算跟踪距离
        var trackingPoint = this.getTrackingPoint(cx, cy);
        var trackingDir = trackingPoint.clone().sub(position);
        var distance = Math.abs(eye.dot(trackingDir));

        var canvasContainer = this.getContainerDimensions();
        var aspect = canvasContainer.width / canvasContainer.height;
        var height = 2.0 * distance * Math.tan(THREE.Math.degToRad(this.camera.fov * 0.5));
        var width = height * aspect;

        return new THREE.Vector2(width, height);

    };

    // 获得近裁面上点的世界坐标
    this.getWorldPointFromNearPlane = function (normalizedX, normalizedY) {

        var worldPoint = new THREE.Vector3(normalizedX, normalizedY, 0.0);
        worldPoint.unproject(camera);

        return worldPoint;
    };

    this.getTrackingPoint = function (cx, cy) {

        var pos = new THREE.Vector2(cx, cy);
        var intersectContext = this.getIntersectContext(pos);
        var trackingPoint = this.intersector.hitTest(intersectContext);

        if (!trackingPoint) {

            var normalizedXY = intersectContext.mouse;
            var position = this.camera.position;
            var eye = this.getWorldEye();
            var normEye = eye.clone().normalize();
            var worldPoint = this.getWorldPointFromNearPlane(normalizedXY.x, normalizedXY.y);
            var ray = new THREE.Ray();

            if (this.camera.isPerspective) {

                ray.origin.copy(position);
                ray.direction.copy(worldPoint.clone().sub(position).normalize());

            } else {

                var origin = worldPoint.clone();
                origin.sub(eye);
                ray.origin.copy(origin);
                ray.direction.copy(normEye);

            }

            if (!_lastTrackingPoint) {

                trackingPoint = this.getTrackingPointFromBoundingBox(normEye, ray);

            } else {

                // 保持上一次的基点和本次基点在同一平面内

                var plane = new THREE.Plane();
                plane.setFromNormalAndCoplanarPoint(normEye, _lastTrackingPoint);

                trackingPoint = ray.intersectPlane(plane);

                // 如果没有取到点，说明上一次的点在相机背后，重新取点
                if (!trackingPoint) {

                    //CLOUD.Logger.log("trackingPoint === null");
                    trackingPoint = this.getTrackingPointFromBoundingBox(normEye, ray);

                } else {

                    // 基准点在相机位置，重新取点

                    var dist = trackingPoint.distanceTo(position);

                    if (dist < _EPS) {

                        //CLOUD.Logger.log("equal");
                        trackingPoint = this.getTrackingPointFromBoundingBox(normEye, ray);
                    }
                }
            }

            // 没有取到点，则取worldPoint
            if (!trackingPoint) {

                CLOUD.Logger.log("tracking point is default!");
                trackingPoint = worldPoint;
            }
        }

        // 保存状态
        _lastTrackingPoint = trackingPoint.clone();

        return trackingPoint;
    };

    // 获取相机到场景包围盒8个顶点的最大距离对应点所在平面与所给射线的交点
    this.getTrackingPointFromBoundingBox = function (direction, ray) {

        var scene = this.scene;
        return scene.getTrackingPointFromBoundingBox(direction, ray);
    };

    // 设置相机位置
    this.setCameraPosition = function (position) {

        var camera = this.camera;

        var eye = this.getWorldEye();
        var distance = eye.length();

        var dir = eye.clone();
        dir.normalize();
        dir.setLength(distance);

        camera.position.copy(position);
        camera.target.addVectors(camera.position, dir);
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    // 前进 or 后退
    this.moveStraight = function (step, keepHeight) {
        
        var position = this.camera.position;
        var target = this.camera.target;

        if (keepHeight) {
            var diff = new THREE.Vector3(target.x - position.x, 0, target.z - position.z);
            var len = diff.length();
            var coe = step / len;
            var stepDiff = new THREE.Vector3(diff.x * coe, 0, diff.z * coe);

            position.add(stepDiff);
            target.add(stepDiff);
        }
        else {
            var eye = target.clone().sub(position);

            this.camera.translateZ(-step);
            target.addVectors(position, eye);
        }
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    this.getIntersectContext = function (pos) {
        var context = new CLOUD.IntersectContext();
        var scope = this;

        context.scene = scope.scene;
        context.camera = this.camera;
        scope.mapWindowToViewport(pos.x, pos.y, context.mouse);

        // 获得视口尺寸
        context.viewportSize = scope.viewer.renderer.getSize();
        context.octreeRoots = scope.viewer.modelManager.getOctreeRoots();
        context.octantMap = scope.viewer.modelManager.octantToObjectMap;

        return context;
    };

    this.getLastIntersect = function () {

        return this.intersector.lastIntersect;
    };

    this.calculatePivot = function (rotateMode, clientXY) {
        var scope = this;

        var viewer = this.viewer;
        var scene = this.scene;
        var pivot = null;

        // 根据鼠标位置计算pivot点, 没有交点，取场景中点
        function _calcPivotByMouse (clientXY) {


            var context = scope.getIntersectContext(clientXY);

            var pt = scope.intersector.hitTest(context);

            if (pt) {
                pivot = pt;
            } else {
                pivot = scene.getBoundingBox().getCenter();
            }
        }

        switch (rotateMode) {

            case CLOUD.RotatePivotMode.SELECTION:
			
				var sceneState = viewer.modelManager.sceneState;

                var box = scene.getBoundingBoxOfGeometries(sceneState.getSelectionSet());

                if (box.isEmpty()) {

                    _calcPivotByMouse(clientXY);

                } else {
                    pivot = box.getCenter(this.pivot);
                }

                break;

            case CLOUD.RotatePivotMode.CENTER:

                pivot = scene.getBoundingBox().getCenter();
                break;

            case CLOUD.RotatePivotMode.CAMERA:

                pivot = null;
                break;

            default: // 默认 CLOUD.RotatePivotMode.MOUSEPOINT

                _calcPivotByMouse(clientXY);

                break;
        }
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
        return pivot;

    };

    function pivotBallPos() {
        if (_scope.pivot != null) {
            return _scope.pivot;
        }
        else {

            var center = _scope.scene.getBoundingBox().getCenter();
            return center;
        }
    };

    function pivotBallSize() {
        var camera = _scope.camera;
        var position = camera.position;

        var cameraDir = _scope.camera.target.clone().sub(position);
        cameraDir.normalize();

        var plane = new THREE.Plane();
        plane.setFromNormalAndCoplanarPoint(cameraDir.clone().negate(), pivotBallPos());
        plane.normalize();
        var distance = plane.distanceToPoint(position);
        var planeWidth = distance * Math.tan(camera.fov * 0.5);

        var dim = _scope.getContainerDimensions();
        return planeWidth * 2 / (dim.height - dim.top);
    };
	
	function createPivotBall() {
        _scope.pivotBallGroup = _scope.scene.getOrCreateObjectGroup(CLOUD.ObjectGroupType.PIVOTBALL,
				{priority: 10, globalSpace: false});
		
		// Q: What's the difference between pivotBall and pivotCenter?
		var geometry = new THREE.SphereBufferGeometry(15, 64, 64);
		var pivotBall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			color: 0xffffff,
			depthTest: false,
			opacity: 0.5,
			transparent: true
		}));

		geometry = new THREE.SphereBufferGeometry(1, 64, 64);
		var pivotCenter = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			color: 0xff0000,
			depthTest: false,
			opacity: 0.5,
			transparent: true
		}));

        _scope.pivotBallGroup.add(pivotBall);
        _scope.pivotBallGroup.add(pivotCenter);
	}

    this.touchUpdateRotationInPersonView = function(_thetaDelta, _phiDelta ) {
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add

        var scope = this;

        var position = this.camera.position;

        var eye = this.camera.target.clone().sub(position);
        var eyeDistance = eye.length();
        var camDir = this.camera.getWorldDirection();

        var up = this.camera.realUp || this.camera.up;
        var rightDir = camDir.clone().cross(up).normalize();
        var realUp = rightDir.clone().cross(camDir).normalize();
        this.camera.realUp.copy(realUp);

        var adjustCameraPosition = function (trf) {
            var newTarget = new THREE.Vector3(); // 新目标点

            // 保持相机到目标点的距离不变
            camDir.applyQuaternion(trf).normalize();
            newTarget.copy(position).add(camDir.multiplyScalar(eyeDistance));
            // 相机目标点位置
            scope.camera.target.copy(newTarget);
        };

        var rotAxis, rotAngle;
        if (Math.abs(_thetaDelta) > Math.abs(_phiDelta)) {
            rotAxis = _zAxisUp;
            rotAngle = _thetaDelta;
        }
        else if (!CLOUD.EditorConfig.LockAxisZ) {
            rotAxis = rightDir;

            var cross = new THREE.Vector3(0, 1, 0).clone().cross(up);
            var dot = cross.dot(rightDir);
            var angle = Math.asin(cross.length());
            if (dot < 0) {
                angle = -angle;
            }
            if ((angle + _phiDelta) > (Math.PI / 4 - _EPS)) {
                _phiDelta = Math.PI / 4 - _EPS - angle;
            }
            else if ((angle + _phiDelta) < (-Math.PI / 4 + _EPS)) {
                _phiDelta = -Math.PI / 4 + _EPS - angle;
            }

            rotAngle = _phiDelta;
        }

        var viewTrf = new THREE.Quaternion().setFromAxisAngle(rotAxis, rotAngle);
        adjustCameraPosition(viewTrf);
        this.camera.realUp.applyQuaternion(viewTrf).normalize();
    };

    this.touchUpdateRotationInModelView = function(_thetaDelta, _phiDelta, _pivot) {

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add

        var pivot = _pivot || this.scene.getBoundingBox().getCenter();

        var position = this.camera.position;

        var eye = this.camera.target.clone().sub(position);
        var eyeDistance = eye.length();
        var viewVec = position.clone().sub(pivot);
        var viewLength = viewVec.length();
        var viewTrf = null;
        var camDir = this.camera.getWorldDirection();

        viewVec.normalize();

        var adjustCameraPosition = function (trf) {
            var newTarget = new THREE.Vector3(); // 新目标点
            var newViewDir = viewVec.clone().applyQuaternion(trf).normalize();

            // 相机新位置
            position.copy(pivot).add(newViewDir.multiplyScalar(viewLength));

            // 保持相机到目标点的距离不变
            camDir.applyQuaternion(trf).normalize();
            newTarget.copy(position).add(camDir.multiplyScalar(eyeDistance));
            // 相机目标点位置
            _scope.camera.target.copy(newTarget);
        };

        var up = this.camera.realUp || this.camera.up;
        var rightDir = camDir.clone().cross(up).normalize();
        var realUp = rightDir.clone().cross(camDir).normalize();
        this.camera.realUp.copy(realUp);

        var rotAxis;

        // 锁定Z轴
        if (CLOUD.EditorConfig.LockAxisZ) {
            // 水平旋转
            if (Math.abs(_thetaDelta) > Math.abs(_phiDelta)) {

                rotAxis = _zAxisUp;
                viewTrf = new THREE.Quaternion().setFromAxisAngle(rotAxis, _thetaDelta);
                adjustCameraPosition(viewTrf);
                this.camera.realUp.applyQuaternion(viewTrf).normalize();
            }
        } else {
            // 水平旋转
            if (Math.abs(_thetaDelta) > Math.abs(_phiDelta)) {

                // remark: this.camera.up 的使用有些奇怪，大多数都被置成了 THREE.Object3D.DefaultUp，后续需要在重新考虑下
                // 当this.camera.up为THREE.Object3D.DefaultUp时，其实水平旋转就是锁定了Z轴的旋转(模型的Z轴对应场景的Y轴)
                rotAxis = this.camera.up.clone().normalize();
                viewTrf = new THREE.Quaternion().setFromAxisAngle(rotAxis, _thetaDelta);
                adjustCameraPosition(viewTrf);
                this.camera.realUp.applyQuaternion(viewTrf).normalize();

            } else if (Math.abs(_phiDelta) > 0.01) { // 垂直旋转

                rotAxis = camDir.clone().cross(up).normalize();

                var cross = new THREE.Vector3(0, 1, 0).clone().cross(up);
                var dot = cross.dot(rightDir);
                var angle = Math.asin(cross.length());
                if (dot < 0) {
                    angle = -angle;
                }
                if ((angle + _phiDelta) > (Math.PI / 2 - _EPS)) {
                    _phiDelta = Math.PI / 2 - _EPS - angle;
                }
                else if ((angle + _phiDelta) < (-Math.PI / 2 + _EPS)) {
                    _phiDelta = -Math.PI / 2 + _EPS - angle;
                }

                viewTrf = new THREE.Quaternion().setFromAxisAngle(rotAxis, _phiDelta);
                adjustCameraPosition(viewTrf);
                this.camera.realUp.applyQuaternion(viewTrf).normalize();

                // 旋转180度时，up的y值应该反向，否则移动会反
                this.adjustCameraUp();
            }
        }
		
		if (!this.pivotBallGroup) {
			createPivotBall();
		}
		
		this.pivotBallGroup.visible = true;
		
		var scale = pivotBallSize();
		var pos = pivotBallPos();
		for (var ci = 0; ci < this.pivotBallGroup.children.length; ci++) {
			var geo = this.pivotBallGroup.children[ci];
            geo.position.copy(pos);
			
			geo.scale.set(scale, scale, scale);

			geo.updateMatrixWorld();
		}
        
    };

    this.touchUpdateRotation = function (thetaDelta, phiDelta) {

        var position = this.camera.position;
        var sceneBoundingBox = this.scene.getBoundingBox();

        if (sceneBoundingBox.containsPoint(position)) {
            this.touchUpdateRotationInPersonView(thetaDelta, phiDelta);
        }
        else {
            this.touchUpdateRotationInModelView(thetaDelta, phiDelta, pivotBallPos());
        }
    };

    this.clearTouchRotateState = function() {
		if (this.pivotBallGroup) {
			this.pivotBallGroup.visible = false;
		}
    };

    this.touchEndHandler = function () {

        this.viewer.editorManager.cameraChange = false;

        this.clearTouchRotateState();

        this.touchUpdate();
    };
	
	this._adjustCameraForDolly = function(dollyPoint, scale){

        var scaleFactor = scale - 1.0;

        if (Math.abs(scaleFactor) < _EPS) {
            return false;
        }

        var camera = this.camera;
        var cameraPosition = camera.position;
        var dirEye = this.getWorldEye();
        var dirDolly = new THREE.Vector3();

        if (!dollyPoint) {
            dirDolly.copy(dirEye);
        } else {
            dirDolly.subVectors(dollyPoint, cameraPosition);
        }

        dirDolly.multiplyScalar(scaleFactor);

        var distance = dirDolly.length();

        // 透视投影下允许穿透
        if (camera.isPerspective) {

            if (distance < this.minDollyDistance) {

                dirDolly.normalize().multiplyScalar(this.minDollyDistance);

            }
        }

        var newCameraPosition = new THREE.Vector3();
        newCameraPosition.addVectors(cameraPosition, dirDolly);

        if( !camera.isPerspective ) {

            camera.orthoScale *= scale;
            camera.setZoom(camera.orthoScale);
        }

        camera.position.copy(newCameraPosition);
        camera.target.copy(dirEye.add(newCameraPosition));
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
        return true;
    };

    this.touchDolly = function (dollyCenterX, dollyCenterY, scale) {

        var pos = new THREE.Vector2(dollyCenterX, dollyCenterY);
        var intersectContext = this.getIntersectContext(pos);
        var centerPosition = this.intersector.hitTest(intersectContext);

        if (centerPosition != null) {
            this._adjustCameraForDolly(centerPosition, scale);
        } else {
            this._adjustCameraForDolly(null, scale);
        }
    };


    this.touchUpdate = function () {
        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();

        return function () {

            //TODO: clarify the logic below
            // lookAt使用realUp
            var tmpUp = new THREE.Vector3();
            tmpUp.copy(this.camera.up);
            this.camera.up.copy(this.camera.realUp);
            this.camera.lookAt(this.camera.target);
            this.camera.up.copy(tmpUp);
            this.camera.updateMVP();

            {
                // FIXME: seems there is a bug that lastPosition and lastQuaternion are not
                //         initialized but used here
                if (lastPosition.distanceToSquared(this.camera.position) > _EPS
                    || 8 * (1 - lastQuaternion.dot(this.camera.quaternion)) > _EPS) {

                    //CLOUD.Logger.log("CameraControl.render");
                    onChange();

                    this.dirtyCamera(false);

                    // render 可能会直接返回，这样直接关闭相机状态会出现问题
                    // this.setCameraChanging(false); // add

                    lastPosition.copy(this.camera.position);
                    lastQuaternion.copy(this.camera.quaternion);
                }
            }
        }
    }();

    //
    // for walk editor
    //

    //  右转：angle为正； 左转：angle为负
    this.goTurnForWalk = function (angle) {

        var camera = this.getCamera();
        var position = camera.position;
        var target = camera.target;

        var diff = new THREE.Vector3(target.x - position.x, 0, target.z - position.z);
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);
        var centerDiff = new THREE.Vector3(diff.x * cosAngle - diff.z * sinAngle, 0, diff.x * sinAngle + diff.z * cosAngle);

        target.x = position.x + centerDiff.x;
        target.z = position.z + centerDiff.z;
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    // 俯仰
    this.goPitchForWalk = function (angle) {

        var camera = this.getCamera();
        var position = camera.position;
        var target = camera.target;

        var offsetX = target.x - position.x;
        var offsetZ = target.z - position.z;
        var distance = Math.sqrt(offsetX * offsetX + offsetZ * offsetZ);
        var diff = new THREE.Vector3(distance, target.y - position.y, 0);
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);
        var centerDiff = new THREE.Vector3(diff.x * cosAngle - diff.y * sinAngle, diff.x * sinAngle + diff.y * cosAngle, 0);
        // var percent = centerDiff.x / distance;

        // 俯仰，不用改变x,z
        // target.x = position.x + percent * offsetX;
        target.y = position.y + centerDiff.y;
        // target.z = position.z + percent * offsetZ;
        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    // 根据世界系中的步进长度和绘图空间方向向量来获得绘图空间步进向量
    function getStepDiff(camera, matrixScene, direction, stepWorld) {

        var inverseMatrix = new THREE.Matrix4();
        inverseMatrix.getInverse(matrixScene);

        var position = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        var positionWorld = position.clone();
        positionWorld.applyMatrix4(inverseMatrix);

        // 变换到世界系
        var stepDiff = new THREE.Vector3(direction.x, direction.y, direction.z);
        stepDiff.add(position);
        stepDiff.applyMatrix4(inverseMatrix);
        stepDiff.sub(positionWorld).normalize().multiplyScalar(stepWorld);
        stepDiff.add(positionWorld);

        // 转换到绘图空间
        stepDiff.applyMatrix4(matrixScene);
        stepDiff.sub(position);

        return stepDiff;
    }

    // 垂直移动照相机
    this.goUpDownForWalk = function (step) {

        // var camera = this.getCamera();
        // var position = camera.position;
        // var target = camera.target;
        //
        // // target和eye的Y轴上的坐标增加step
        // position.y += step;
        // target.y += step;

        var camera = this.getCamera();
        var position = camera.position;
        var target = camera.target;
        var up = new THREE.Vector3(0, 1, 0);
        var matrixScene = this.scene.getMatrixGlobal();

        // 需要每次重新计算步进么？？？
        var stepDiff = getStepDiff(camera, matrixScene, up, step);

        // target和eye的Y轴上的坐标增加step
        position.y += stepDiff.y;
        target.y += stepDiff.y;

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    this.stepCameraForWalk = function(direction, step) {
        // var camera = this.getCamera();
        // var position = camera.position;
        // var target = camera.target;
        //
        // // 新的target和eye在Y轴上的坐标不变
        // var diff = new THREE.Vector3(target.x - position.x, 0, target.z - position.z);
        // var len = diff.length();
        // var coe = step / len;
        // var stepDiff;
        //
        // switch (direction) {
        //     case CLOUD.MoveDirection.FORWARD:
        //         stepDiff = new THREE.Vector3(diff.x * coe, 0, diff.z * coe);
        //         break;
        //     case CLOUD.MoveDirection.BACK:
        //         stepDiff = new THREE.Vector3(-diff.x * coe, 0, -diff.z * coe);
        //         break;
        //     case CLOUD.MoveDirection.LEFT:
        //         stepDiff = new THREE.Vector3(diff.z * coe, 0, -diff.x * coe);
        //         break;
        //     case CLOUD.MoveDirection.RIGHT:
        //         stepDiff = new THREE.Vector3(-diff.z * coe, 0, diff.x * coe);
        //         break;
        // }
        //
        // position.add(stepDiff);
        // target.add(stepDiff);

        var camera = this.getCamera();
        var position = camera.position;
        var target = camera.target;
        var forward = new THREE.Vector3(target.x - position.x, 0, target.z - position.z).normalize();
        var up = new THREE.Vector3(0, 1, 0);
        var right = forward.clone().cross(up);
        var matrixScene = this.scene.getMatrixGlobal();
        var stepDiff;

        switch (direction) {
            case CLOUD.MoveDirection.FORWARD:
                stepDiff = getStepDiff(camera, matrixScene, forward, step);
                stepDiff.y = 0;
                break;
            case CLOUD.MoveDirection.BACK:
                forward.multiplyScalar(-1);
                stepDiff = getStepDiff(camera, matrixScene, forward, step);
                stepDiff.y = 0;
                break;
            case CLOUD.MoveDirection.LEFT:
                right.multiplyScalar(-1);
                stepDiff = getStepDiff(camera, matrixScene, right, step);
                stepDiff.y = 0;
                break;
            case CLOUD.MoveDirection.RIGHT:
                stepDiff = getStepDiff(camera, matrixScene, right, step);
                stepDiff.y = 0;
                break;
        }

        position.add(stepDiff);
        target.add(stepDiff);

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
    };

    this.walkWithParallelEye = function () {

        var camera = this.camera;

        // 将相机移动到指定的点
        var eye = this.getWorldEye();
        var distance = eye.length();

        var scene = this.scene;
        var center = scene.getBoundingBox().getCenter();

        var newEye = new THREE.Vector3();
        newEye.subVectors(center, camera.position);

        var newDistance = newEye.length();
        newEye.y = 0;
        newEye.normalize();
        newEye.multiplyScalar(newDistance);

        camera.position.subVectors(center, newEye);
        camera.target.addVectors(camera.position, newEye.normalize().multiplyScalar(distance));

        var up = new THREE.Vector3(0, 1, 0);
        camera.up.copy(up);
        camera.realUp.copy(up);

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add
        this.update(true);
    };

    //
    // for fly editor
    //

    this.updateFlyMove = function (moveState, moveStep) {

        //var moveStep = this.movementSpeed * this.getSpeedRate();
        var camera = this.camera;
        //var position = camera.position;
        //var target = camera.target;
        //var eye = target.clone().sub(position);

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add

        var enumMoveDirection = CLOUD.MoveDirection;

        // 前进
        if (moveState & enumMoveDirection.FORWARD) {
            //this._goForward(moveStep);
            camera.translateZ(-moveStep); // forward
        }

        // 后退
        if (moveState & enumMoveDirection.BACK) {
            //this._goBack(moveStep);
            camera.translateZ(moveStep); // back
        }

        // 左移
        if (moveState & enumMoveDirection.LEFT) {
            //this._goLeft(moveStep);
            camera.translateX(-moveStep); // left
        }

        // 右移
        if (moveState & enumMoveDirection.RIGHT) {
            //this._goRight(moveStep);
            camera.translateX(moveStep); // right
        }

        // 上移
        if (moveState & enumMoveDirection.UP) {
            //this._goUp(moveStep);
            camera.translateY(moveStep); // up
        }

        // 下移
        if (moveState & enumMoveDirection.DOWN) {
            //this._goDown(moveStep);
            camera.translateY(-moveStep); // down
        }

        // 刷新
        this.flyOnWorld();

        // this.dirtyCamera(false);
        // this.setCameraChanging(false); // add
    };

    // 基于世界空间的漫游
    this.flyOnWorld = function () {

        var camera = this.camera;

        var up = camera.up.clone();

        if (camera.realUp) {
            camera.up.copy(camera.realUp);
        }

        // 使用realUp
        camera.lookAt(camera.target);

        if (camera.realUp) {
            camera.up.copy(up);
        }

        // 调用Render刷新
        onChange();

        this.dirtyCamera(false);

        // render 可能会直接返回，这样直接关闭相机状态会出现问题
        // this.setCameraChanging(false); // add

        _lastPosition.copy(camera.position);
        _lastQuaternion.copy(camera.quaternion);

    };

    this.rotateForFly = function(deltaYaw, deltaPitch, pitchMin, pitchMax) {
        var camera = this.camera;
        var position = camera.position;
        var target = camera.target;
        var eye = target.clone().sub(position);

        var worldUp = new THREE.Vector3(0, 1, 0);
        var upDir = camera.realUp || camera.up;
        var rightDir = eye.clone().cross(upDir).normalize();

        this.dirtyCamera(true);
        this.setCameraChanging(true); // add

        // Pitch around axis Z only when axis Z locked.
        if (CLOUD.EditorConfig.LockAxisZ) {
            deltaPitch = 0;
        }


        if (deltaPitch != 0) {
            var pitchTransform = new THREE.Quaternion().setFromAxisAngle(rightDir, -deltaPitch);
            var tmp = eye.clone();

            tmp.applyQuaternion(pitchTransform);

            var angle = tmp.angleTo(worldUp);
            // 钳制到[-PI/2, PI/2]
            angle = angle - 0.5 * Math.PI;

            // 限制角度
            if (angle >= pitchMin && angle <= pitchMax) {
                eye.applyQuaternion(pitchTransform);
            }
        }

        if (deltaYaw != 0) {
            //注意：鼠标左右移动的旋转轴要沿世界坐标系的y轴旋转，而不是摄像机自己的坐标轴，防止视角倾斜
            var yawTransform = new THREE.Quaternion().setFromAxisAngle(worldUp, -deltaYaw);

            eye.applyQuaternion(yawTransform);
        }

        target.addVectors(position, eye);

        // 刷新
        this.flyOnWorld();

        // this.dirtyCamera(false);
        // this.setCameraChanging(false); // add
    };

    this.fitAndRotateBySelection = function () {

        var viewer = this.viewer;
        viewer.zoomToSelection();

    };

    // 飞到指定点（平行视角）
    this.flyToPointWithParallelEye = function (point) {

        // 将相机移动到指定的点
        var eye = this.getWorldEye();
        var distance = eye.length();

        // 保持视角方向
        //var dir = new THREE.Vector3(0, 0, -1);
        var dir = eye.clone();
        dir.y = 0;
        dir.normalize();
        dir.setLength(distance);

        var up = new THREE.Vector3(0, 1, 0);

        this.camera.up = up;
        this.camera.realUp = up.clone();

        this.camera.position.copy(point);
        this.camera.target.addVectors(this.camera.position, dir);

        this.update(true);
    };

    // 飞到指定点（保持视角）
    this.flyToPoint = function (point) {

        var eye = this.getWorldEye();
        this.camera.position.copy(point);
        this.camera.target.addVectors(this.camera.position, eye);

        this.update(true);
    };


    /**
     * 设置漫游相机的高度
     *
     * @param {Array} elevations - 参考标高数组（从小到大的排序）
     * @param {Number} height - 相机相对高度(世界系中的高度，默认 1750mm)
     */
    this.setCameraHeight = function (elevations, height) {

        this.cameraAbsoluteHeightEnabled = false;
        this.cameraRelativeHeight = height;

        if (this.cameraConstraintHeights === undefined) {

            this.cameraConstraintHeights = [];

        } else {

            this.cameraConstraintHeights.length = 0;

        }

        for (var i = 0, len = elevations.length; i < len; ++i) {

            this.cameraConstraintHeights[i] = elevations[i];

        }

    };

    /**
     * 设置相机的绝对高度
     *
     * @param {Number} height - 相机绝对高度(世界系中的高度)
     */
    this.setCameraAbsoluteHeight = function (height) {

        this.cameraAbsoluteHeightEnabled = true;
        this.cameraAbsoluteHeight = height;

    };

    /**
     * 更新相机高度
     *
     */
    this.updateCameraHeight = function () {

        var scene = this.scene;
        var camera = this.getCamera();
        var cameraPositionWorld = scene.drawingToWorld(camera.position);// 转世界坐标
        var cameraHeightWorld = cameraPositionWorld.z;

        var newCameraHeightWorld, newCameraPosition;

        var cameraAbsoluteHeightEnabled = this.cameraAbsoluteHeightEnabled;

        if (cameraAbsoluteHeightEnabled) {

            if (this.cameraAbsoluteHeight === undefined) {

                this.cameraAbsoluteHeight = cameraHeightWorld;

            }

            newCameraHeightWorld = this.cameraAbsoluteHeight;

        } else {

            if (this.cameraConstraintHeights === undefined) {

                newCameraHeightWorld = cameraHeightWorld;

            } else {

                // 计算相机的放置位置
                var idx = CLOUD.Utils.findRange(this.cameraConstraintHeights, cameraHeightWorld);
                newCameraHeightWorld = this.cameraConstraintHeights[idx];
                newCameraHeightWorld += this.cameraRelativeHeight;

                // 限制高度
                if (idx < this.cameraConstraintHeights.length - 1) {

                    var nextCameraHeightWorld = this.cameraConstraintHeights[idx + 1];

                    if (newCameraHeightWorld > nextCameraHeightWorld) {
                        newCameraHeightWorld = nextCameraHeightWorld;
                    }

                }

            }

        }

        if (newCameraHeightWorld !== cameraHeightWorld) {

            // 转绘制坐标
            newCameraPosition = scene.worldToDrawing({
                x: cameraPositionWorld.x,
                y: cameraPositionWorld.y,
                z: newCameraHeightWorld
            });

            // 设置相机位置
            this.setCameraPosition(newCameraPosition);
        }

    };

    // utility method

    this.getRaycaster = function(clientX, clientY) {
        var raycaster = new CLOUD.Raycaster();

        var mouse = new THREE.Vector2();
        this.mapWindowToViewport(clientX, clientY, mouse);
        raycaster.setFromCamera(mouse, this.camera);

        return raycaster;
    };

    this.translateCameraForWalk = function (moveVector, moveStep) {

        // 平移不需要方向参数(CLOUD.MoveDirection.RIGHT)，后续在改写
        if (moveVector.x !== 0) {
            this.stepCameraForWalk(CLOUD.MoveDirection.RIGHT, moveVector.x * moveStep);
        }

        if (moveVector.y !== 0) {
            this.goUpDownForWalk(moveVector.y * moveStep * 0.5);
        }

        if (moveVector.z !== 0) {
            this.stepCameraForWalk(CLOUD.MoveDirection.BACK, moveVector.z * moveStep);
        }

    };

    /**
     * 旋转相机
     *
     * @param {Object} rotationVector - 旋转向量
     * @param {Number} factor - 基于180度的缩放因子， 例如：1 - 表示从左边界至右边界旋转接近180度， 2 - 表示从左边界至右边界旋转接近360度
     */
    this.rotateCameraForWalk = function (rotationVector, factor) {

        // BIMFACEDM-3087: 左键点击旋转鼠标控制旋转角度，从左至右移动需接近180度
        // BIMFACEDM-2726: 鼠标滑动左右移动能够覆盖360度（如果鼠标刚好在中间，则是左右各180度），上下移动能够覆盖180度（如果鼠标刚好在中间，则是上下各90度）

        if (rotationVector.y !== 0) {

            // 左右旋转
            this.goTurnForWalk(-rotationVector.y * Math.PI * factor);
            rotationVector.y = 0;
        }

        if (rotationVector.x !== 0) {

            // 上下旋转
            this.goPitchForWalk(rotationVector.x * Math.PI);
            rotationVector.x = 0;
        }
    };

    this.zoomCameraForWalk = function (factor) {

        this.adjustCameraForDolly(factor, null);

    };

};
CLOUD.IntersectHelper = function(filter) {
    this.raycaster = new CLOUD.Raycaster();
    this.filter = filter;

    this.lastIntersect = null;
};

CLOUD.IntersectHelper.prototype.destroy = function () {
    this.raycaster = null;
    this.lastIntersect = null;
};

CLOUD.IntersectContext = function() {
    this.scene = null;
    this.camera = null;
    // octree root nodes of all active models in current scene
    this.octreeRoots = null;
    // map from octree node id to object indices in object pool
    this.octantMap = null;
    // mouse click position, normalized
    this.mouse = new THREE.Vector2();
};

CLOUD.IntersectHelper.prototype.defaultIntersect = function(objectGroup, pickable, distanceScope)
{
    if (!objectGroup.visible) {
        return;
    }

    var intersects = [];

    for (var i = 0, l = objectGroup.children.length; i < l; i++) {
        // TODO: add filter to support pickable

        var object = objectGroup.children[i];
        object.raycast(this.raycaster, intersects);
    }


    var finalIntersects = [];
    if (intersects.length > 0 ) {
        // remove objects out of the distance scope
        for (var j = 0; j < intersects.length; j++) {
            if (intersects[j].distance <= distanceScope.far && intersects[j].distance >= distanceScope.near) {
                finalIntersects.push(intersects[j]);
            }
        }
    }

    finalIntersects.sort(function (a, b) {
        return a.distance - b.distance;
    });

    return finalIntersects.length > 0 ? finalIntersects[0] : null;
};

/**
 * Get info of nearest intersected mesh object.
 *
 * @param {ObjectPool} pool - Mesh object pool
 * @param {OctreeNode} octreeRoots - octree root nodes of all active models in current scene
 * @param {Map} octantMap - map from octant to index of object pool
 * @param {Bool} pickable - flag if the intersected object is pickable
 * @param {Object} distanceScope - near and far distance scope to the ray origin
 */
CLOUD.IntersectHelper.prototype.intersectMeshesWithDistance =
                      function(pool, octreeRoots, octantMap, pickable, distanceScope) {
    var i, j;
    var len;
    var object;
    var distance;
    var minusEpislon = -0.000001;
    var raycaster = this.raycaster;
    var intersectObjects = [];
    var octants = [];

    // Visit all octree, get octree nodes that intersect with the ray
    for (i=0; i<octreeRoots.length; i++) {
        this.raycaster.intersectOctantForNode(octreeRoots[i], octants);
    }

    var filter = this.filter;
    var hasVisibleFilter = filter._hasVisibleFilter();
    var hasSelectableFilter = filter._hasSelectableFilter();
    var isPickableFiltered = function(object) {

        return ((hasVisibleFilter && !filter._isVisible(object)) ||
                (hasSelectableFilter && !filter._isSelectable(object)));
    };


    distanceScope.near += minusEpislon;
    // travesal mesh objects in all intersected octree nodes, get meshes which
    // bounding box is intersected with ray
    for (i=0, len=octants.length; i<len; i++) {
        var nodeIndices = octantMap[octants[i].octantId];
        if (nodeIndices) {
            for (j=0; j<nodeIndices.length; j+=2) {
				for (var k = nodeIndices[j]; k <= nodeIndices[j+1]; k++) {
					object = pool._pool[k];

					// get the distance from ray origin to bounding box of object
					distance = object.intersectBoxWithDistance(raycaster);
					if (distance >= distanceScope.near && distance <= distanceScope.far) {
						intersectObjects.push({object: object, distance: distance});
					}
				}
            }
        }
    }

    // sort object according to distance
    intersectObjects.sort(function (a, b) {
        return a.distance - b.distance;
    });

    var intersects = [];
    var finalIntersects = [];
    var minIntersectDistance = distanceScope.far;
    for (i=0; i<intersectObjects.length; i++) {
        if (intersectObjects[i].distance > minIntersectDistance || intersectObjects[i].distance < distanceScope.near)
            continue;

        object = intersectObjects[i].object;

        if (pickable && isPickableFiltered(object))
            continue;

        intersects = [];
        object.raycast(raycaster, intersects);
        if (intersects.length > 0) {
            // one mesh may have multiple faces intersected with the ray, sort them
            // and the nearest intersect will be at the first
            intersects.sort(function (a, b) {
                return a.distance - b.distance;
            });

            // only get one intersect that passes the distance scope filter
            for (j=0; j<intersects.length; j++) {
                if (intersects[j].distance < minIntersectDistance && intersects[j].distance > distanceScope.near) {
                    minIntersectDistance = intersects[j].distance - minusEpislon;
                    finalIntersects.push(intersects[j]);
                    break;
                }
            }
        }
    }

    finalIntersects.sort(function (a, b) {
        return a.distance - b.distance;
    });

    return finalIntersects.length > 0 ? finalIntersects[0] : null;
};

CLOUD.IntersectHelper.prototype.intersect = function (context, ray, pickable) {
    var scope = this;
    var raycaster = scope.raycaster;

    // set up the ray
    if (ray === null) {
        raycaster.setFromCamera(context.mouse, context.camera);
    }
    else {
        var origin = ray.origin;
        var direction = ray.direction;

        raycaster.set(origin, direction);
    }

    // console.log("request intersect");

    // 3D mark中进行pick的时候需要世界到屏幕坐标的相互转换，置入两个属性
    // 用于pick的时候进行世界到屏幕坐标的相互转换(现阶段，Marker3D有用到)
    raycaster.camera = context.camera;
    raycaster.viewportSize = context.viewportSize;

    // require intersected mesh in camera visible scope
    var distanceScope = {near: context.camera.near, far: context.camera.far };
    // also take the clip plances into consideration
    context.scene.shrinkScopeByClipPlane(raycaster, distanceScope); // TODO: use a more general method

    var intersect;
    var allIntersects = [];
    var objectGroups = context.scene.getObjectGroups();
    for (var i = 0; i < objectGroups.length; i++) {
        if (!objectGroups[i].isPickable()) {
            continue;
        }

    switch (objectGroups[i].name) {
            case CLOUD.ObjectGroupType.GEOMETRY:
                intersect = this.intersectMeshesWithDistance(context.scene.pool,
                    context.octreeRoots, context.octantMap, pickable, distanceScope);
                break;
            default:
                intersect = this.defaultIntersect(objectGroups[i], pickable, distanceScope);
                break;
        }

        if (intersect) {
            intersect.objectType = objectGroups[i].pickableType;
            intersect.hoverEnabled = objectGroups[i].hoverEnabled;
            allIntersects.push(intersect);
        }
    }

    allIntersects.sort(function (a, b) {
        return a.distance - b.distance;
    });

    var length = allIntersects.length;

    if (length > 0) {
        // sort according to distance

        for (var ii = 0; ii < length; ++ii) {
            intersect = allIntersects[ii];

            var meshNode = intersect.object;
            if (meshNode.geometry) {

                if (intersect.objectType === CLOUD.PICKABLETYPE.Marker3d) {
                    intersect.userId = intersect.id;
                }else{
                    intersect.userId = meshNode.name; // name -> userId
                }

                intersect.databagId = meshNode.databagId;

                if (pickable) {
                    this.lastIntersect = {intersect: intersect, pickable: true}
                }
                else {
                    var selectable = this.filter._isVisible(intersect.object) && this.filter._isSelectable(intersect.object);
                    this.lastIntersect = {intersect: intersect, pickable: selectable}
                }

                return intersect;
            }
        }
    }

    this.lastIntersect = null;

    return null;
};

/**
 * Obtain intersect point
 *
 * @param {IntersectContext} intersectContext - context to do the intersect operation
 * @return {Object} position of intersect point; return null if hit nothing
 */
CLOUD.IntersectHelper.prototype.hitTest = function (intersectContext) {

    var intersect = this.intersect(intersectContext, null, false);

    return intersect !== null ? intersect.point : null;
};

CLOUD.IntersectHelper.prototype.pick = function (context, callback) {

    var intersect = this.intersect(context, null, true);

    if (callback) {
        callback(intersect);
    }

    return intersect;
};

CLOUD.IntersectHelper.prototype.getIntersectByRay = function (context, ray) {

    return this.intersect(context, ray, true);
};

CLOUD.PickUtil = {
    pickByRect: function(scene, frustum, selectState, modelManager) {
        var selObjects = [];
        var octants = [];
        var pool = scene.pool;
        var octreeRoots = modelManager.getOctreeRoots();
        var octantMap = modelManager.octantToObjectMap;
        var sceneState = modelManager.sceneState;
        var i;

        var bbox = new THREE.Box3();

        var p1 = new THREE.Vector3(),
            p2 = new THREE.Vector3();
        function intersectBox(frustum, box) {

            var nCount = 0;
            var planes = frustum.planes;

            for (var i = 0; i < 6; i++) {

                var plane = planes[i];

                p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
                p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
                p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
                p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
                p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
                p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

                var d1 = plane.distanceToPoint(p1);
                var d2 = plane.distanceToPoint(p2);

                // if both outside plane, no intersection

                if (d1 < 0 && d2 < 0) {

                    return false; // no intersection

                }
                else if (d1 * d2 >= 0) {
                    ++nCount;
                }
            }

            return nCount === 6; // contains the box
        }

        function frustumIntersectOctant(root) {
            bbox.set(root.min, root.max);

            if (frustum.intersectsBox(bbox)) {
                octants.push(root);

                // search subtree
                for (var i = 0, length = root.childOctants.length; i < length; ++i) {

                    var node = root.childOctants[i];
                    frustumIntersectOctant(node);
                }
            }
        }

        var filter = modelManager.filter;
        var hasVisibleFilter = filter._hasVisibleFilter();
        var hasSelectableFilter = filter._hasSelectableFilter();
        function isPickableFiltered (object) {

            return ((hasVisibleFilter && !filter._isVisible(object)) ||
                (hasSelectableFilter && !filter._isSelectable(object)));
        }

        if (selectState === CLOUD.OPSELECTIONTYPE.Clear) {
            sceneState.clearSelection();
            return;
        }

        // Visit all octree, get octree nodes that intersect with the frustum
        for (i=0; i<octreeRoots.length; i++) {
            frustumIntersectOctant(octreeRoots[i], octants);
        }

        // travel mesh objects in all intersected octree nodes, get meshes which
        // bounding box is contained in frustum
        var len;
        var object;
        var j;
        for (i=0, len=octants.length; i<len; i++) {
            var nodeIndices = octantMap[octants[i].octantId];
            if (nodeIndices) {
                for (j=0; j<nodeIndices.length; j+=2) {
                    for (var k = nodeIndices[j]; k <= nodeIndices[j+1]; k++) {
                        object = pool._pool[k];

                        if (isPickableFiltered(object))
                            continue;

                        var geometry = object.geometry;
                        var material = object.material;
                        var matrixWorld = object.matrixWorld;

                        if (material === undefined)
                            continue;


                        if (geometry.boundingBox === null) geometry.computeBoundingBox();

                        bbox.copy(geometry.boundingBox);
                        bbox.applyMatrix4(matrixWorld);

                        // Checking boundingbox although this is not accurate
                        if (intersectBox(frustum, bbox)) { // frustum contains the box
                            selObjects.push(object.name);
                        }
                    }
                }
            }
        }

        if (selObjects.length > 0) {

            if (CLOUD.OPSELECTIONTYPE.Remove === selectState) {
                sceneState.removeSelection(selObjects);

            }
            else if (CLOUD.OPSELECTIONTYPE.Add === selectState) {
                sceneState.addSelection(selObjects);

            }
        }
    }
};

/**
 * Group for scene objects.
 * Every scene displayable object need to belong to a group.
 *
 * @param name    Group name, need to be unique
 * @param params  Parameters for objects in this group
 * @constructor
 */
CLOUD.ObjectGroup = function (name, params) {
	THREE.Group.call(this);
	
	this.name = name;

	// display priority
	this.priority = (params && params.priority) ? params.priority : 5;
	// flag if object in this group is selectable
	this.pickableType = (params && params.pickableType) ? params.pickableType : CLOUD.PICKABLETYPE.UnPickable;
	// flag if object in this group is in global space (space before scene transfer)
    // or in the space after scene transfer
    // if in global space, object need to be transfer with the scene matrix
    this.globalSpace = (params && params.globalSpace) ? params.globalSpace : false;

    // bounding box of the group
	this.boundingBox = null;

    // support group hover
    this.hoverEnabled = (params && params.hoverEnabled) ? params.hoverEnabled : false;
};

/**
 * Group for geometry objects to display
 */
CLOUD.ObjectGroup.prototype = Object.create(THREE.Group.prototype);
CLOUD.ObjectGroup.prototype.constructor = CLOUD.ObjectGroup;

// remove child according to its name
CLOUD.ObjectGroup.prototype.removeByName = function (name) {
    var children = this.children;

    for (var i = 0, len = children.length; i < len; ++i) {
        if (children[i].name === name) {
            children.splice(i, 1);
            break;
        }
    }

};

// clear all objects in this group
CLOUD.ObjectGroup.prototype.clear = function () {
    this.children.length = 0;
};

CLOUD.ObjectGroup.prototype.isGlobalSpace = function() {
    return this.globalSpace;
};


CLOUD.ObjectGroup.prototype.hasChild = function(name) {
    for (var i = 0, len = this.children.length; i< len; i++) {
        if (this.children[i].name == name) {
            return true;
        }
    }

    return false;
};

CLOUD.ObjectGroup.prototype.isPickable = function() {
    return this.pickableType !== CLOUD.PICKABLETYPE.UnPickable;
};

//CLOUD.Camera = function (width, height, fov, near, far) {
CLOUD.Camera = function (type, params) {

    CLOUD.CombinedCamera.call(this, type, params);

    this.realUp = this.up.clone(); //
    this.dirty = false;

    this.orthoScale = 1.0;

    this.positionPlane = new THREE.Plane();
    this.projScreenMatrix = new THREE.Matrix4();
    this.viewProjInverse = new THREE.Matrix4();

    this.frustum = new THREE.Frustum();

};

CLOUD.Camera.prototype = Object.create(CLOUD.CombinedCamera.prototype);
CLOUD.Camera.prototype.constructor = CLOUD.Camera;

CLOUD.Camera.prototype._updatePositionPlane = function () {
    this.positionPlane.setFromNormalAndCoplanarPoint(this.getWorldDirection(), this.position);
};

CLOUD.Camera.prototype._updateFrustum = function () {
    this.frustum.setFromMatrix(this.projScreenMatrix);
};

// 更新相机矩阵
CLOUD.Camera.prototype.updateMVP = function () {

    if(this.dirty){
        if (this.parent === null)
            this.updateMatrixWorld();

        this.matrixWorldInverse.getInverse(this.matrixWorld);
        this.projScreenMatrix.multiplyMatrices(this.projectionMatrix, this.matrixWorldInverse);
        this.viewProjInverse.getInverse(this.projScreenMatrix);

        this._updateFrustum();
        this._updatePositionPlane();
        this.dirty = false;
    }
};

// 获得相机视锥
CLOUD.Camera.prototype.getFrustum = function () {

    if(this.dirty){
        this.updateMVP();
    }
    return this.frustum;
};

CLOUD.Camera.prototype.LookAt = function (target, dir, up, focal) {

    var offset = new THREE.Vector3();
    offset.copy(dir);

    if (focal !== undefined)
        offset.setLength(focal);

    this.position.subVectors(target, offset);
    this.up = up;
    this.lookAt(target);
    this.realUp = up.clone();
    this.target = target.clone();
    this.dirty = true;

};

CLOUD.Camera.prototype.copy = function (source) {

    CLOUD.CombinedCamera.prototype.copy.call(this, source);

    this.realUp.copy(source.realUp);
    this.orthoScale = source.orthoScale;
    this.dirty = source.dirty;

    this.updateProjectionMatrix();
    this.updateMVP();

    return this;
};

CLOUD.Camera.prototype.setStandardView = function (stdView, box) {

    var target;

    if (box) {
        target = box.getCenter();
    } else {
        target = new THREE.Vector3(0, 0, 0);
    }

    var sceneSize = CLOUD.GlobalData.SceneSize;
    var focal = sceneSize / 2;

    switch (stdView) {
        case CLOUD.EnumStandardView.ISO:
            var position = new THREE.Vector3(-sceneSize, sceneSize, sceneSize);
            var dir = new THREE.Vector3();
            // BIMFACEDM-1456 : 如果场景中心点不在原点(0, 0, 0)，相机的方向应该使用原点计算，与target无关
            dir.subVectors(target, position);                         //liuw-d       BIMFACE  效果与万达有区别    
            //var center = new THREE.Vector3(0, 0, 0);
            //dir.subVectors(center, position);
            this.LookAt(target, dir, THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.Top:
            this.LookAt(target, new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, -1), focal);
            // 这里恢复up方向有问题，应该在本次渲染结束后才能恢复。
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.Bottom:
            this.LookAt(target, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.Front:
            //this.LookAt(target, new THREE.Vector3(0, -0.5, -1), new THREE.Vector3(0, 1, 0), focal);
            this.LookAt(target, new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.Back:
            this.LookAt(target, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.Right:
            this.LookAt(target, new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.Left:
            this.LookAt(target, new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.SouthEast:
            // 将视点抬高，避开坐标轴重叠 (-1, 0, -1)  --> (-1, -1, -1)
            //this.LookAt(target, new THREE.Vector3(-1, -1, -1), new THREE.Vector3(0, 1, 0), focal);
            // 注意：之前修改过bug（GGP-11834：标准视图与Jetfire不一致）。修改方法是抬高视点。
            // 但是在viewhouse的多维度观察视角下，抬高视点对应的实际上是RoofSouthEast,所以这里恢复视点。
            this.LookAt(target, new THREE.Vector3(-1, 0, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.SouthWest:
            // 将视点抬高，避开坐标轴重叠 (1, 0, -1)  --> (1, -1, -1)
            //this.LookAt(target, new THREE.Vector3(1, -1, -1), new THREE.Vector3(0, 1, 0), focal);
            // 注意：之前修改过bug（GGP-11834：标准视图与Jetfire不一致）。修改方法是抬高视点。
            // 但是在viewhouse的多维度观察视角下，抬高视点对应的实际上是RoofSouthEast,所以这里恢复视点
            this.LookAt(target, new THREE.Vector3(1, 0, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.NorthWest:
            // 将视点抬高，避开坐标轴重叠 (1, 0, 1)  --> (1, -1, 1)
            //this.LookAt(target, new THREE.Vector3(1, -1, 1), new THREE.Vector3(0, 1, 0), focal);
            // 注意：之前修改过bug（GGP-11834：标准视图与Jetfire不一致）。修改方法是抬高视点。
            // 但是在viewhouse的多维度观察视角下，抬高视点对应的实际上是NorthWest,所以这里恢复视点
            this.LookAt(target, new THREE.Vector3(1, 0, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.NorthEast:
            // 将视点抬高，避开坐标轴重叠 (-1, 0, 1)  --> (-1, -1, 1)
            //this.LookAt(target, new THREE.Vector3(-1, -1, 1), new THREE.Vector3(0, 1, 0), focal);
            // 注意：之前修改过bug（GGP-11834：标准视图与Jetfire不一致）。修改方法是抬高视点。
            // 但是在viewhouse的多维度观察视角下，抬高视点对应的实际上是RoofNorthEast,所以这里恢复视点
            this.LookAt(target, new THREE.Vector3(-1, 0, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomFront:
            this.LookAt(target, new THREE.Vector3(0, 1, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomBack:
            this.LookAt(target, new THREE.Vector3(0, 1, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomRight:
            this.LookAt(target, new THREE.Vector3(-1, 1, 0), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomLeft:
            this.LookAt(target, new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomSouthEast:
            this.LookAt(target, new THREE.Vector3(-1, 1, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomSouthWest:
            this.LookAt(target, new THREE.Vector3(1, 1, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomNorthWest:
            this.LookAt(target, new THREE.Vector3(1, 1, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.BottomNorthEast:
            this.LookAt(target, new THREE.Vector3(-1, 1, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofFront:
            this.LookAt(target, new THREE.Vector3(0, -1, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofBack:
            this.LookAt(target, new THREE.Vector3(0, -1, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofRight:
            this.LookAt(target, new THREE.Vector3(-1, -1, 0), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofLeft:
            this.LookAt(target, new THREE.Vector3(1, -1, 0), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofSouthEast:
            this.LookAt(target, new THREE.Vector3(-1, -1, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofSouthWest:
            this.LookAt(target, new THREE.Vector3(1, -1, -1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofNorthWest:
            this.LookAt(target, new THREE.Vector3(1, -1, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.RoofNorthEast:
            this.LookAt(target, new THREE.Vector3(-1, -1, 1), new THREE.Vector3(0, 1, 0), focal);
            break;
        case CLOUD.EnumStandardView.TopTurnRight:
            this.LookAt(target, new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.TopTurnBack:
            this.LookAt(target, new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 1), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.TopTurnLeft:
            this.LookAt(target, new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.BottomTurnRight:
            this.LookAt(target, new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.BottomTurnBack:
            this.LookAt(target, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.BottomTurnLeft:
            this.LookAt(target, new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.FrontTurnTop:
            this.LookAt(target, new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, -1, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.FrontTurnLeft:
            this.LookAt(target, new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.FrontTurnRight:
            this.LookAt(target, new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.RightTurnTop:
            this.LookAt(target, new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.RightTurnFront:
            this.LookAt(target, new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, -1), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.RightTurnBack:
            this.LookAt(target, new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.BackTurnTop:
            this.LookAt(target, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -1, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.BackTurnLeft:
            this.LookAt(target, new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.BackTurnRight:
            this.LookAt(target, new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.LeftTurnTop:
            this.LookAt(target, new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.LeftTurnBack:
            this.LookAt(target, new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;
        case CLOUD.EnumStandardView.LeftTurnFront:
            this.LookAt(target, new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, -1), focal);
            //this.up.copy(THREE.Object3D.DefaultUp);
            break;

    }
    this.updateProjectionMatrix();
    return target;
};

/**
 * 缩放到指定的包围盒范围
 *
 * @param {THREE.Box3} box - 包围盒
 * @param {Number} margin - 包围盒缩放比例 (< 1.0), 缺省值: 0.0。margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
 * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
 * @param {THREE.Vector3} direction - 相机观察方向
 */
CLOUD.Camera.prototype.zoomToBBox = function (box, margin, ratio, direction) {

    ratio = ratio || 1.0;
    margin = margin || 0.0;
    margin = margin < -1.0 ? -1.0 : margin; // 钳制

    var newBox = new THREE.Box3();
    newBox.copy(box);

    if (margin !== 0.0) {
        var boxLen = box.getSize().length() * 0.5;
        var diagonalLine = new THREE.Vector3();
        diagonalLine.subVectors(newBox.max, newBox.min).normalize();
        diagonalLine.multiplyScalar(boxLen * margin);
        newBox.expandByVector(diagonalLine);
    }

    var dir = direction ? direction : this.getWorldDirection();
    var up = this.up;
    var aspect = this.aspect;
    var halfFov = THREE.Math.degToRad(this.fov * 0.5); // 转成弧度

    var boxSize = newBox.getSize();
    var center = newBox.getCenter();
    var radius = boxSize.length() * 0.5;
    var distToCenter = radius / Math.sin(halfFov) * ratio;

    var offset = new THREE.Vector3();
    offset.copy(dir);
    offset.setLength(distToCenter);

    var position = new THREE.Vector3();
    position.subVectors(center, offset);

    // ---------- 计算新位置 S ----------------- //
    var right = new THREE.Vector3();
    right.crossVectors(dir, up);
    right.normalize();

    var newUp = new THREE.Vector3();
    newUp.crossVectors(dir, right);
    newUp.normalize();

    var vertPlane = new THREE.Plane();
    vertPlane.setFromNormalAndCoplanarPoint(right, position);

    var horzPlane = new THREE.Plane();
    horzPlane.setFromNormalAndCoplanarPoint(newUp, position);

    var maxHeightToCorner = 0;
    var maxHeight = 0;
    var maxDistFromHeight = 0;
    var maxWidth = 0;
    var maxDistFromWidth = 0;

    var corners = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
    ];

    corners[0].set(newBox.min.x, newBox.min.y, newBox.min.z); // 000
    corners[1].set(newBox.min.x, newBox.min.y, newBox.max.z); // 001
    corners[2].set(newBox.min.x, newBox.max.y, newBox.min.z); // 010
    corners[3].set(newBox.min.x, newBox.max.y, newBox.max.z); // 011
    corners[4].set(newBox.max.x, newBox.min.y, newBox.min.z); // 100
    corners[5].set(newBox.max.x, newBox.min.y, newBox.max.z); // 101
    corners[6].set(newBox.max.x, newBox.max.y, newBox.min.z); // 110
    corners[7].set(newBox.max.x, newBox.max.y, newBox.max.z);  // 111

    for (var i = 0; i < 8; i++) {
        var v = new THREE.Vector3();
        v.subVectors(corners[i], position);
        var dist = Math.abs(v.dot(dir));

        var h1 = Math.abs(horzPlane.distanceToPoint(corners[i]));
        var w1 = h1 * aspect;
        var w2 = Math.abs(vertPlane.distanceToPoint(corners[i]));
        var h2 = w2 / aspect;

        var h = Math.max(h1, h2);
        var w = Math.max(w1, w2);

        if (maxHeightToCorner < h) {
            maxHeightToCorner = h;
        }

        if (!maxHeight || !maxDistFromHeight || h > maxHeight * dist / maxDistFromHeight) {
            maxHeight = h;
            maxDistFromHeight = dist;
        }

        if (!maxWidth || !maxDistFromWidth || w > maxWidth * dist / maxDistFromWidth) {
            maxWidth = w;
            maxDistFromWidth = dist;
        }
    }

    var cameraDist = maxHeight / Math.tan(halfFov) + (distToCenter - maxDistFromHeight);
    if (aspect < 1.0) {
        cameraDist = maxWidth / Math.tan(halfFov) + (distToCenter - maxDistFromWidth);
    }

    // BIMFACEDM-2206：防止小构件被相机裁剪 (cameraDist < this.near)， 重新计算近裁剪面。
    if (cameraDist < this.near) {
        var delta = 0.001;
        this.near = (cameraDist * cameraDist + cameraDist * delta) / ((1 << 24) * delta);
    }

    offset.copy(dir).normalize().setLength(cameraDist);
    position.subVectors(center, offset);

    // ---------- 计算新位置 E ----------------- //

    // 正交投影和透视投影对应的相机位置保持一致
    this.position.copy(position);
    this.lookAt(center);
    this.target.copy(center);

    if (!this.isPerspective) {
        var halfHeight = Math.tan(this.fov * Math.PI / 180 / 2) * cameraDist;
        this.orthoScale = halfHeight / maxHeightToCorner;
        this.zoom = this.orthoScale;
    }

    this.updateProjectionMatrix();
    this.dirty = true;
    return center;
};

CLOUD.Camera.prototype.computeRay = function (cx, cy, domElement) {
    var viewportDim = new THREE.Vector2();

    if (domElement === undefined) {
        viewportDim.x = window.innerWidth;
        viewportDim.y = window.innerHeight;
    }
    else {
        var element = domElement === document ? domElement.body : domElement;

        // clientWidth: 是对象可见的宽度，不包含滚动条等边线，会随窗口的显示大小改变。
        // offsetWidth:	是对象的可见宽度，包含滚动条等边线，会随窗口的显示大小改变。
        // CloudCameraEditor.getContainerDimensions 使用的是offsetWidth, offsetHeight,保持统一。
        //viewportDim.x = element.clientWidth;
        //viewportDim.y = element.clientHeight;
        viewportDim.x = element.offsetWidth;
        viewportDim.y = element.offsetHeight;
    }

    // To Viewport
    var viewPos = new THREE.Vector2();

    // 注意这里传入的cx, cy是相对视口的值（即已做过偏移）
    viewPos.x = (cx / viewportDim.x) * 2 - 1;
    viewPos.y = -(cy / viewportDim.y) * 2 + 1;

    var ray = new THREE.Ray();
    if (this.isPerspective) {
        ray.origin.copy(this.position);
        ray.direction.set(viewPos.x, viewPos.y, 0.5).unproject(this).sub(this.position).normalize();
    }
    else {
        ray.origin.set(viewPos.x, viewPos.y, -1).unproject(this);
        ray.direction.set(0, 0, -1).transformDirection(this.matrixWorld);
    }

    return ray;
};

CLOUD.Camera.prototype.screenToWorld = function (cx, cy, domElement, target) {

    var ray = this.computeRay(cx, cy, domElement);
    // plane on target
    var dir = this.getWorldDirection().normalize();

    var plane = new THREE.Plane(dir);
    plane.setFromNormalAndCoplanarPoint(dir, target);

    return ray.intersectPlane(plane, target);
};

// 获取场景变换前的相机对应的Frustum
CLOUD.Camera.prototype.getWorldFrustum = function (matrixRoot) {

    var matrixWorldInverse = new THREE.Matrix4();
    var frustum = new THREE.Frustum();

    var worldCamera = this.clone();
    var targetPost = this.target;
    // 计算场景变换后的相机位置和目标点的距离
    var distancePost = targetPost.clone().sub(this.position).length();

    // 逆矩阵
    var matrixInverseRoot = new THREE.Matrix4();
    matrixInverseRoot.getInverse(matrixRoot);

    // 抽取旋转矩阵
    var matrixRotation = new THREE.Matrix4();
    matrixRotation.extractRotation(matrixRoot);
    var quaternion = new THREE.Quaternion();
    quaternion.setFromRotationMatrix(matrixRotation);
    quaternion.inverse();// 反转

    // 计算场景变换前的相机位置
    worldCamera.position.applyMatrix4(matrixInverseRoot);

    // 计算场景变换前的目标位置
    var targetPre = targetPost.clone();
    targetPre.applyMatrix4(matrixInverseRoot);

    // 计算场景变换前的相机方向
    // var dirPre = camera.getWorldDirection();
    // dirPre.applyQuaternion(quaternion).normalize();
    var dirPre = targetPre.clone().sub(worldCamera.position);

    // 计算场景变换前的相机位置和目标点的距离
    var distancePre = dirPre.length();

    dirPre.normalize();

    // 计算场景变换前的相机 near 和 far
    var scaleCoe = distancePre / distancePost;
    // worldCamera.near = camera.near * scaleCoe;
    worldCamera.far = camera.far * scaleCoe;

    worldCamera.up.applyQuaternion(quaternion).normalize();
    worldCamera.realUp.applyQuaternion(quaternion).normalize();
    worldCamera.updateProjectionMatrix();
    worldCamera.updateMatrixWorld();

    matrixWorldInverse.getInverse(worldCamera.matrixWorld);
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(worldCamera.projectionMatrix, matrixWorldInverse));

    worldCamera = null;

    return frustum;

};

/**
 * 世界空间中的距离转换成绘图空间(相机空间)的距离
 *
 * @param {THREE.Matrix4} matrixScene - 场景变换矩阵
 * @param {Number} distance - 世界空间中的距离
 * @return {Number} distance - 绘图空间中的距离
 */
CLOUD.Camera.prototype.distanceFromWorldToDrawing = function (matrixScene, distance) {

    var origin = this.position.clone();
    var direction = this.target.clone();

    direction.subVectors(this.target, this.position);
    direction.normalize();

    // 先变回世界空间
    var inverseMatrix = new THREE.Matrix4();
    inverseMatrix.getInverse(matrixScene);

    direction.add(origin).applyMatrix4(inverseMatrix);
    origin.applyMatrix4(inverseMatrix);
    direction.sub(origin);
    direction.normalize().multiplyScalar(distance);

    // 再变回绘图空间
    direction.add(origin).applyMatrix4(matrixScene);
    // 起始点就是相机的位置
    // origin.applyMatrix4( matrixScene );
    // direction.sub(origin);
    direction.sub(this.position);

    return direction.length();

};


/**
 * 将相机从绘图坐标系转换到世界坐标系
 *
 * @param {Object} cameraInfo - 绘图坐标系中相机位置 {position:xxx, target:xxx, up:xxx}
 * @param {THREE.Matrix4} matrixScene - 场景变换矩阵
 * @returns {Object} - 世界系中相机位置 {position:xxx, target:xxx, up:xxx}
 */
CLOUD.Camera.drawingToWorld = function (cameraInfo, matrixScene) {

    var position = cameraInfo.position.clone();
    var target = cameraInfo.target.clone();
    var up = cameraInfo.up.clone();

    var inverseMatrix = new THREE.Matrix4();
    inverseMatrix.getInverse(matrixScene);

    up.add(position);
    up.applyMatrix4(inverseMatrix);

    position.applyMatrix4(inverseMatrix);
    target.applyMatrix4(inverseMatrix);

    up.sub(position);
    up.normalize();

    return {position: position, target: target, up: up};
};

/**
 * 将相机从世界坐标系转换到绘图坐标系
 *
 * @param {Object} cameraInfo - 世界坐标系中相机位置 {position:xxx, target:xxx, up:xxx}
 * @param {THREE.Matrix4} matrixScene - 场景变换矩阵
 * @returns {Object} - 绘图坐标系中相机位置 {position:xxx, target:xxx, up:xxx}
 */
CLOUD.Camera.worldToDrawing = function (cameraInfo, matrixScene) {

    var position = cameraInfo.position.clone();
    var target = cameraInfo.target.clone();
    var up = cameraInfo.up.clone();

    up.add(position);
    up.applyMatrix4(matrixScene);

    position.applyMatrix4(matrixScene);
    target.applyMatrix4(matrixScene);

    up.sub(position);
    up.normalize();

    return {position: position, target: target, up: up};
};
CLOUD.ObjectGroupType = {
    // Geometries imported from models
    GEOMETRY: "Geometry",
    // wireframe of geometries
    WIREFRAME: "Wireframe",
    // marker
    MARKER3D: "Marker3D",
    CLIPPLANE: "ClipPlane",
    FILLCLIPPLANE: "FillClipPlane",
    // IBL cube mesh
    IBLCUBE: "IBLCube",
    // planes added by customer with API
    CUSTOMPLANE: "CustomPlane",
    // pivot ball on mobile platform
    PIVOTBALL: "PivotBall",
	// Measure pick point
    MEASUREPICKPOINT: 'MeasurePickPoint',
    // Measure pick line
    MEASUREPICKLINE: 'MeasurePickLine',
    // Measure pick plane
    MEASUREPLANE: 'MeasurePlane',
    // Measure line
    MEASURELINE: 'MeasureLine',
    // octree node bounding box for debugging
    OCTREENODE: "OctreeNode"
};

CLOUD.Scene = function () {

    THREE.Object3D.call(this);

    this.type = 'Scene';
    this.autoUpdate = false; // 不自动更新

    // groups for displayable objects. All displayable object should belong to a group
    this.objectGroups = new CLOUD.ObjectGroup();
    this.add(this.objectGroups);

    // group that contains geometry meshes of all models
    this.geometryGroup = new CLOUD.ObjectGroup(CLOUD.ObjectGroupType.GEOMETRY, {
        pickableType: CLOUD.PICKABLETYPE.Geometry,
        globalSpace: true
    });
    this.objectGroups.add(this.geometryGroup);

    this.pool = new CLOUD.ObjectPool(CLOUD.MeshEx, 0);

    this.clipPlanes = null;
    this.fillClipPlane = null;

    this.IBLMaps = new ImageBasedLighting.IBLMaps();

    this.transformMatrix = new THREE.Matrix4(); // 用于保存变换后的矩阵 - 兼容处理，以后要删除

    this.lightHelper = false;
    this.LightPreset();
};

CLOUD.Scene.prototype = Object.create(THREE.Object3D.prototype);
CLOUD.Scene.prototype.constructor = CLOUD.Scene;

CLOUD.Scene.prototype.destroy = function () {

    if (this.sunLight) {
        this.remove(this.sunLight);
        this.sunLight = null;
    }

    if (this.fillLight0) {
        this.remove(this.fillLight0);
        this.fillLight0 = null;
    }

    if (this.fillLight1) {
        this.remove(this.fillLight1);
        this.fillLight1 = null;
    }

    if (this.fillLight2) {
        this.remove(this.fillLight2);
        this.fillLight2 = null;
    }

    if (this.hemisphereLight) {
        this.remove(this.hemisphereLight);
        this.hemisphereLight = null;
    }

    if (this.dirLight) {
        this.remove(this.dirLight);
        this.dirLight = null;
    }


    this.clearAll();

    this.pool.destroy();
    this.pool = null;

    //this.clipPlanes = null;
    //this.fillClipPlane = null;
};

CLOUD.Scene.prototype.resizePool = function (size) {
    this.geometryGroup.clear();
    this.pool.resize(size, {parent: this.geometryGroup});
};

/**
 * 清除场景数据
 *
 */
CLOUD.Scene.prototype.clearAll = function () {

    this.pool.clear();
    this.autoUpdate = false;
};

/**
 * 获得场景模型数据根节点
 *
 */
CLOUD.Scene.prototype.getRootNode = function () {
    return this.geometryGroup;
};


/**
 * 获得的场景包围盒(场景变换后,即工作区坐标系下)
 *
 */
CLOUD.Scene.prototype.getBoundingBox = function () {

    var box = new THREE.Box3();

    return function () {
        box.copy(this.geometryGroup.boundingBox);
        box.applyMatrix4(this.geometryGroup.matrix);
        return box;
    };

}();

/**
 * 获得的场景包围盒(场景变换前)
 *
 */
CLOUD.Scene.prototype.getBoundingBoxWorld = function () {
    return this.geometryGroup.boundingBox.clone();
};

/**
 * 获得场景变换矩阵
 *
 */
CLOUD.Scene.prototype.getMatrixGlobal = function () {
    return this.geometryGroup.matrix.clone();
};

/**
 * 获得场景世界变换矩阵
 *
 */
CLOUD.Scene.prototype.getMatrixWorldGlobal = function () {
    return this.geometryGroup.matrixWorld;
};

/**
 * 获得场景旋转角度(Euler)
 *
 */
CLOUD.Scene.prototype.getRotationGlobal = function () {

    if (this.geometryGroup.matrix) {

        var rotMat = new THREE.Matrix4();
        rotMat.extractRotation(this.geometryGroup.matrix);

        var rotation = new THREE.Euler();
        rotation.setFromRotationMatrix(rotMat);

        return rotation;
    }

    return null;
};

/**
 * 获取相机到场景包围盒8个顶点的最大距离对应点所在平面与所给射线的交点
 *
 * @param {Object} direction - 相机方向
 * @param {Object} ray - 射线
 * @return {Object} 交点
 */
CLOUD.Scene.prototype.getTrackingPointFromBoundingBox = function (direction, ray) {

    if (!this.geometryGroup.boundingBox) return null;

    var position = ray.origin;
    var box = this.getBoundingBox();
    var maxLen = 0;

    var corners = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
    ];

    corners[0].set(box.min.x, box.min.y, box.min.z); // 000
    corners[1].set(box.min.x, box.min.y, box.max.z); // 001
    corners[2].set(box.min.x, box.max.y, box.min.z); // 010
    corners[3].set(box.min.x, box.max.y, box.max.z); // 011
    corners[4].set(box.max.x, box.min.y, box.min.z); // 100
    corners[5].set(box.max.x, box.min.y, box.max.z); // 101
    corners[6].set(box.max.x, box.max.y, box.min.z); // 110
    corners[7].set(box.max.x, box.max.y, box.max.z);  // 111

    for (var i = 0; i < 8; i++) {

        var v = new THREE.Vector3();
        v.subVectors(corners[i], position);

        var len = v.dot(direction);

        if (maxLen < len) {
            maxLen = len;
        }
    }

    var offsetVec = direction.clone().multiplyScalar(maxLen);
    var coplanarPoint = position.clone().add(offsetVec);

    var plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(direction, coplanarPoint);

    return ray.intersectPlane(plane);
};

CLOUD.Scene.prototype.getNearDepthByRect = function () {

    var box = new THREE.Box3();
    var nearDepth = Infinity;
    var projectScreenMatrix = new THREE.Matrix4();
    var projectPosition = new THREE.Vector3();

    // 计算最近的深度
    function calcNearDepth(object) {
        projectPosition.setFromMatrixPosition(object.matrixWorld);
        projectPosition.applyProjection(projectScreenMatrix);

        var depth = projectPosition.z;

        if (depth < nearDepth && depth >= 0 && depth <= 1) {
            nearDepth = depth;
        }
    }

    function intersectObjectByBox(frustum, object) {

        if (object.boundingBox && !(object instanceof THREE.Mesh)) {
            box.copy(object.boundingBox);
            box.applyMatrix4(object.matrixWorld);
        }
        else {
            var geometry = object.geometry;

            if (geometry.boundingBox === null)
                geometry.computeBoundingBox();

            box.copy(geometry.boundingBox);
            box.applyMatrix4(object.matrixWorld);
        }

        return frustum.intersectsBox(box);
    }

    return function (frustum, camera) {
        nearDepth = Infinity;
        projectScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

        function frustumTest(node) {

            if (node instanceof CLOUD.MeshEx) {

                if (!intersectObjectByBox(frustum, node)) {
                    return;
                }

                // 计算最近的深度
                calcNearDepth(node);
            }
            else if (node.worldBoundingBox) {

                if (!frustum.intersectsBox(node.worldBoundingBox)) {
                    return;
                }

                // 计算最近的深度
                calcNearDepth(node);
            }

            var children = node.children;
            if (!children)
                return;

            for (var i = 0, l = children.length; i < l; i++) {
                var child = children[i];
                if (child.visible) {
                    frustumTest(child);
                }
            }
        }

        var children = this.geometryGroup.children;
        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i];
            if (child.visible) {
                frustumTest(child);
            }
        }

        return nearDepth;
    }
}();

CLOUD.Scene.prototype.getClipPlanes = function () {

    if (this.clipPlanes == null) {
        var bbox = new THREE.Box3();
        bbox.copy(this.geometryGroup.boundingBox);
        bbox.applyMatrix4(this.geometryGroup.matrix);

        this.clipPlanes = new CLOUD.ClipPlanes(bbox.getSize(), bbox.getCenter());
        this.objectGroups.add(this.clipPlanes);
    }

    return this.clipPlanes;
};

CLOUD.Scene.prototype.getFillClipPlane = function () {

    if (this.fillClipPlane == null) {
        var bbox = new THREE.Box3();
        bbox.copy(this.geometryGroup.boundingBox);
        bbox.applyMatrix4(this.geometryGroup.matrix);

        this.fillClipPlane = new CLOUD.FillClipPlane(bbox.getSize(), bbox.getCenter());
        this.objectGroups.add(this.fillClipPlane);
    }

    return this.fillClipPlane;
};

/**
 * Shrink distance (near/far) scope with enabled clip planes.
 *
 * @param {THREE.Ray} ray - Ray object to intersect with clip planes
 * @param {Object} scope - near and far distance scope to the ray origin
 */
CLOUD.Scene.prototype.shrinkScopeByClipPlane = function (ray, scope) {
    if (this.clipPlanes && this.clipPlanes.isEnabled()) {

        var hit = this.clipPlanes.hitTest(ray);

        if (hit.distance == null)
            return;

        if (hit.sign) {
            if (hit.distance > scope.near) {
                scope.near = hit.distance;
            }
        }
        else if (hit.distance < scope.far) {
            scope.far = hit.distance;
        }
    }
};

/* NOT USED
 CLOUD.Scene.prototype.traverseIf = function (callback) {

 function traverseChild(node, callback) {

 var children = node.children;

 for (var i = 0, len = children.length; i < len; i++) {

 var child = children[i];

 if (!callback(child, node)) {
 break;
 }

 if (child.visible) {
 traverseChild(child, callback);
 }
 }
 }

 var children = this.geometryGroup.children;

 for (var i = 0, len = children.length; i < len; i++) {
 var child = children[i];
 traverseChild(child, callback);
 }
 };

 CLOUD.Scene.prototype.findNode = function (sceneId) {

 var children = this.geometryGroup.children;

 for (var i = 0, l = children.length; i < l; i++) {

 var child = children[i];

 if (child.userData && sceneId == child.userData.sceneId) {
 return child;
 }
 }

 return null;
 };

 CLOUD.Scene.prototype.getNodeById = function (id) {

 var children = this.geometryGroup.children;

 for (var i = 0, l = children.length; i < l; i++) {

 var node = children[i];

 if (id === node.name) {
 return node;
 }
 }

 return null;
 };

 CLOUD.Scene.prototype.showNodes = function (model, bVisible) {

 var children = this.geometryGroup.children;

 for (var i = 0, len = children.length; i < len; i++) {

 var child = children[i];

 if (child.databagId === model.databagId) {
 child.visible = bVisible;
 }
 }
 };

 CLOUD.Scene.prototype.containsBoxInFrustum = function () {

 var p1 = new THREE.Vector3(),
 p2 = new THREE.Vector3();

 return function (frustum, box) {

 var planes = frustum.planes;

 for (var i = 0; i < 6; i++) {
 var plane = planes[i];

 p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
 p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
 p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
 p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
 p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
 p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

 var d1 = plane.distanceToPoint(p1);
 var d2 = plane.distanceToPoint(p2);

 // if one outside plane, is not contained.

 if (d1 < 0 || d2 < 0) {
 return false;
 }
 }

 return true;
 };

 }();
 */

CLOUD.Scene.prototype.updateWorldMatrix = function (position, rotation, scale) {

    var matrix = new THREE.Matrix4();
    matrix.compose(position, rotation, scale);

    this.updateWorldMatrixByMatrix(matrix);
};

CLOUD.Scene.prototype.updateWorldMatrixByMatrix = function (matrix) {

    var groups = this.objectGroups.children;

    for (var i = 0, len = groups.length; i < len; i++) {
        if (groups[i].globalSpace) {
            groups[i].matrix.copy(matrix);
            groups[i].matrixAutoUpdate = false;
            groups[i].updateMatrixWorld(true);
        }
    }
};

CLOUD.Scene.prototype.LightPreset = function () {

    if (CLOUD.GlobalData.LightPreset == 0) {

        var initIntensity = 0.3;
        if (!this.hemisphereLight) {
            this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, initIntensity * CLOUD.GlobalData.LightIntensityFactor);
            this.add(this.hemisphereLight);
        }
        this.hemisphereLight.initIntensity = initIntensity;
        this.hemisphereLight.position.set(0, 500, 0);
        this.hemisphereLight.updateMatrixWorld(true);

        initIntensity = 0.7;
        if (!this.dirLight) {
            this.dirLight = new THREE.DirectionalLight(0xffffff, initIntensity * CLOUD.GlobalData.LightIntensityFactor);
            this.add(this.dirLight);
        }
        this.dirLight.initIntensity = initIntensity;
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(-1, 0.75, 1);
        this.dirLight.position.multiplyScalar(50);

        this.remove(this.ambientLight);
        this.remove(this.sunLight);

        return;

    }
    else {
        
        this.remove(this.hemisphereLight);
        this.remove(this.dirLight);

        this.hemisphereLight = undefined;
        this.dirLight = undefined;

        if (this.ambientLight) {
            this.add(this.ambientLight);
        }
        if (this.sunLight) {
            this.add(this.sunLight);
        }

    }

    if (!this.ambientLight) {

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.70);
        this.add(this.ambientLight);

    }

    if (!this.sunLight) {

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.add(this.sunLight);

    }

    if (CLOUD.GlobalData.LightPreset != 4) {

        this.sunLight.color.setHex(0xe1d6c4);
        this.sunLight.position.set(-100, 160, 100);
        this.sunLight.intensity = 0.6;
        this.sunLight.distance = 300;
        this.sunLight.updateMatrixWorld();

    }

    if (!this.fillLight01) {

        this.fillLight01 = new THREE.DirectionalLight(0xffffff, 1);
        this.fillLight01.color.setHex(0x7b9bb4);
        this.fillLight01.position.set(100, 100, 100);
        this.fillLight01.intensity = 0.42;
        this.fillLight01.updateMatrixWorld();
        this.add(this.fillLight01);

    }

    if (this.fillLight02) {
        this.remove(this.fillLight02);
    }

    if (this.fillLight03) {
        this.remove(this.fillLight03);
    }

    if (CLOUD.GlobalData.LightPreset === 1) {

        this.fillLight01.position.set(100, 100, 100);
        this.fillLight01.intensity = 0.42;
        this.fillLight01.updateMatrixWorld();

        if (!this.fillLight02) {
            this.fillLight02 = new THREE.DirectionalLight(0xffffff, 1);
        }

        this.fillLight02.color.setHex(0x7b9bb4);
        this.fillLight02.position.set(-100, 100, -100);
        this.fillLight02.intensity = 0.18;
        this.fillLight02.updateMatrixWorld();
        this.add(this.fillLight02);

    }
    else if (CLOUD.GlobalData.LightPreset === 2) {

        this.fillLight01.position.set(60, 80, 130);
        this.fillLight01.intensity = 0.28;
        this.fillLight01.updateMatrixWorld();

        if (!this.fillLight02) {
            this.fillLight02 = new THREE.DirectionalLight(0xffffff, 1);
        }

        this.fillLight02.color.setHex(0x7b9bb4);
        this.fillLight02.position.set(100, 80, -100);
        this.fillLight02.intensity = 0.22;
        this.fillLight02.updateMatrixWorld();
        this.add(this.fillLight02);

        if (!this.fillLight03) {
            this.fillLight03 = new THREE.DirectionalLight(0xffffff, 1);
        }

        this.fillLight03.color.setHex(0x7b9bb4);
        this.fillLight03.position.set(-140, 80, -50);
        this.fillLight03.intensity = 0.18;
        this.fillLight03.updateMatrixWorld();
        this.add(this.fillLight03);

    }
    else if (CLOUD.GlobalData.LightPreset === 3) {
        
        this.fillLight01.position.set(-100, 100, -100);
        this.fillLight01.intensity = 0.36;
        this.fillLight01.updateMatrixWorld();

    }

    if (this.lightHelper) {
        this.addLightHelper();
    }

}

CLOUD.Scene.prototype.addLightHelper = function () {

    if (!this.sunLightHelper && this.sunLight) {
        this.sunLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 200);
    }
    
    if (!this.fillLightHelper01 && this.fillLight01) {
        this.fillLightHelper01 = new THREE.DirectionalLightHelper(this.fillLight01, 150);
    }

    if (this.sunLightHelper) {
        this.add(this.sunLightHelper);
    }

    if (this.fillLightHelper01) {
        this.add(this.fillLightHelper01);
    }

    if (this.fillLightHelper02) {
        this.remove(this.fillLightHelper02);
    }

    if (this.fillLightHelper03) {
        this.remove(this.fillLightHelper03);
    }

    if (CLOUD.GlobalData.LightPreset === 1) {

        if (!this.fillLightHelper02&& this.fillLight02) {
            this.fillLightHelper02 = new THREE.DirectionalLightHelper(this.fillLight02, 100);
        }
        this.add(this.fillLightHelper02);

    }
    else if (CLOUD.GlobalData.LightPreset === 2) {

        if (!this.fillLightHelper02&& this.fillLight02) {
            this.fillLightHelper02 = new THREE.DirectionalLightHelper(this.fillLight02, 100);
        }
        this.add(this.fillLightHelper02);

        if (!this.fillLightHelper03&& this.fillLight03) {
            this.fillLightHelper03 = new THREE.DirectionalLightHelper(this.fillLight03, 50);
        }
        this.add(this.fillLightHelper03);

    }

};

CLOUD.Scene.prototype.removeLightHelper = function () {

    if (this.sunLightHelper) {
        this.remove(this.sunLightHelper);
    }

    if (this.fillLightHelper01) {
        this.remove(this.fillLightHelper01);
    }

    if (this.fillLightHelper02) {
        this.remove(this.fillLightHelper02);
    }

    if (this.fillLightHelper03) {
        this.remove(this.fillLightHelper03);
    }

};

CLOUD.Scene.prototype.updateLightHelper = function () {

    if (CLOUD.GlobalData.LightPreset === 0) {
        this.removeLightHelper();
    }

    if (this.sunLightHelper) {
        this.sunLightHelper.update();
        this.sunLightHelper.updateMatrixWorld(true);
    }

    if (this.fillLightHelper01) {
        this.fillLightHelper01.update();
        this.fillLightHelper01.updateMatrixWorld(true);
    }

    if (this.fillLightHelper02) {
        this.fillLightHelper02.update();
        this.fillLightHelper02.updateMatrixWorld(true);
    }

    if (this.fillLightHelper03) {
        this.fillLightHelper03.update();
        this.fillLightHelper03.updateMatrixWorld(true);
    }

};

CLOUD.Scene.prototype.updateLights = function (camera) {

    var axisY = new THREE.Vector3(0, 1, 0);
    var angle = Math.PI / 4;
    var scale = 1000.0;
    var height = 600.0;

    var camDirection = camera.position.clone();
    camDirection.sub(camera.target);
    camDirection.normalize();
    if (CLOUD.GlobalData.LightPreset === 1) {

        var lightDir = camDirection.clone().applyAxisAngle(axisY, angle * -1.2);
        this.fillLight01.position.copy(lightDir).normalize();
        this.fillLight01.position.multiplyScalar(scale);
        this.fillLight01.position.y = height;
        this.fillLight01.updateMatrixWorld();

        lightDir = camDirection.clone().applyAxisAngle(axisY, angle * 1.0);
        this.fillLight02.position.copy(lightDir).normalize();
        this.fillLight02.position.multiplyScalar(scale);
        this.fillLight02.position.y = height;
        this.fillLight02.updateMatrixWorld();

    }
    else if (CLOUD.GlobalData.LightPreset === 3) {

        var lightDir = camDirection.clone().applyAxisAngle(axisY, angle * -0.8);
        this.sunLight.position.copy(lightDir).normalize();
        this.sunLight.position.multiplyScalar(scale);
        this.sunLight.position.y = height;
        this.sunLight.updateMatrixWorld();

        lightDir = camDirection.clone().applyAxisAngle(axisY, angle * -0.2);
        this.fillLight01.position.copy(lightDir).normalize();
        this.fillLight01.position.multiplyScalar(scale);
        this.fillLight01.position.y = height;
        this.fillLight01.updateMatrixWorld();

    }
    else if (CLOUD.GlobalData.LightPreset === 0){

        var dirLight = this.dirLight;
        dirLight.intensity = dirLight.initIntensity * CLOUD.GlobalData.LightIntensityFactor;
        dirLight.updateMatrixWorld(true);

        var cameraDir = new THREE.Vector3();
        cameraDir.subVectors(camera.target, camera.position);
        dirLight.position.set(-cameraDir.x, -cameraDir.y, -cameraDir.z);

        var hemisphereLight = this.hemisphereLight;
        hemisphereLight.intensity = hemisphereLight.initIntensity * CLOUD.GlobalData.LightIntensityFactor;

    }

    if (this.lightHelper) {
        this.updateLightHelper();
    }

};

// create new group or return existed group
// params:   parameters for the group
// 		pickable:  true or false, if objects in this group is pickable by normal editor
//      priority:  priority for display. 0 - 10, larger number has high priority
//                 Note: transparent object is drawn at last
//                       for object in the group, its priority depends on its renderOrder
//      globalSpace: true if this group is in global space (space before scene transfer)
CLOUD.Scene.prototype.getOrCreateObjectGroup = function (name, params) {
    // sort according display priority
    var groups = this.objectGroups.children;
    for (var i = 0, len = groups.length; i < len; i++) {
        if (groups[i].name == name) {
            return groups[i];
        }
    }

    // create new group
    var group = new CLOUD.ObjectGroup(name, params);
    if (group.isGlobalSpace()) {
        // set matrix
        group.matrix.copy(this.geometryGroup.matrix);
        group.matrixAutoUpdate = false;
        group.updateMatrixWorld(true);
    }

    this.objectGroups.add(group); // TODO: order according to priority

    return group;
};

CLOUD.Scene.prototype.getObjectGroup = function (name) {
    var groups = this.objectGroups.children;
    for (var i = 0, len = groups.length; i < len; i++) {
        if (groups[i].name == name) {
            return groups[i];
        }
    }

    return null;
};

CLOUD.Scene.prototype.getObjectGroups = function () {
    return this.objectGroups.children;
};

CLOUD.Scene.prototype.removeObjectGroup = function (group) {
    this.objectGroups.remove(group);
};

// remove object group from object group array according to name
CLOUD.Scene.prototype.removeObjectGroupByName = function (name) {
    //
    this.objectGroups.removeByName(name);
};

CLOUD.Scene.prototype.hasObjectGroup = function (name) {

    return this.objectGroups.hasChild(name);
};

CLOUD.Scene.prototype.intersectToWorld = function (intersect) {

    // 注意：不确定相对坐标位置是否被其他模块使用，暂时先采用新的变量来保存世界坐标下的位置及包围盒
    // 最好是在求交点的时候，包围盒就和位置一起进行坐标变换, 就可以免除这里的计算了
    var sceneMatrix = this.getMatrixGlobal();

    // 获得世界坐标下的位置
    intersect.worldPosition = CLOUD.GeomUtil.getWorldPositionOfMesh(intersect.point, sceneMatrix);
    // 获得世界坐标下的包围盒
    intersect.worldBoundingBox = CLOUD.GeomUtil.getBoundingBoxWorldOfMesh(intersect.object, sceneMatrix);
};

/**
 * 世界坐标转绘图空间(场景变换后)坐标
 *
 * @param {object} point - 世界坐标下的点集 {x:0, y:0, z:0}
 * @return {object} 绘图区域坐标 {x:0, y:0, z:0}
 */
CLOUD.Scene.prototype.worldToDrawing = function (point) {

    var sceneMatrix = this.getMatrixGlobal();

    // 进行场景变换，获得场景变换后的世界坐标
    var result = new THREE.Vector3(point.x, point.y, point.z);
    result.applyMatrix4(sceneMatrix);

    return result;
};

/**
 * 绘图空间(场景变换后)坐标转世界坐标
 *
 * @param {object} point - 绘图区域坐标下的点集 {x:0, y:0, z:0}。
 * @return {object} 世界坐标 {x:0, y:0, z:0}
 */
CLOUD.Scene.prototype.drawingToWorld = function (point) {

    var sceneMatrix = this.getMatrixGlobal();

    var inverseScaleMatrix = new THREE.Matrix4();
    inverseScaleMatrix.getInverse(sceneMatrix);

    // 计算世界坐标下的位置
    var result = new THREE.Vector3(point.x, point.y, point.z);
    result.applyMatrix4(inverseScaleMatrix);

    return result;
};

/**
 * 获得mesh的包围盒
 *
 */
CLOUD.Scene.prototype.getBoundingBoxWorldByMesh = function (mesh) {

    var sceneMatrix = this.getMatrixGlobal();

    // 计算世界坐标下的包围盒
    var bBox = mesh.boundingBox;

    if (!bBox) {

        if (!mesh.geometry.boundingBox) {
            mesh.geometry.computeBoundingBox();
        }

        bBox = mesh.geometry.boundingBox;
    }

    var boundingBox = bBox.clone();
    boundingBox.applyMatrix4(mesh.matrixWorld);

    var inverseScaleMatrix = new THREE.Matrix4();
    inverseScaleMatrix.getInverse(sceneMatrix);
    boundingBox.applyMatrix4(inverseScaleMatrix);

    return boundingBox;
};

/**
 * 获得对象池
 *
 */
CLOUD.Scene.prototype.getObjectPool = function () {

    return this.pool;
};

/**
 * 设置 boundingbox
 *
 */
CLOUD.Scene.prototype.setBoundingBoxWorld = function (boundingBox) {

    if (this.geometryGroup.boundingBox) {
        this.geometryGroup.boundingBox.copy(boundingBox);
    } else {
        this.geometryGroup.boundingBox = boundingBox;
    }

};

/**
 * Get bounding box of gemoetries.
 *
 * param {Object} ids - mesh ids, if the ids is null, get bounding box for all geometry
 */
CLOUD.Scene.prototype.getBoundingBoxOfGeometries = function (ids) {
    var calculateAll = !ids;

    var bbox = new THREE.Box3();

    var pool = this.pool._pool;
    for (var i = 0, len = this.pool.counter; i < len; ++i) {

        var object = pool[i];
        if (!object.isVisible())
            continue;

        var geometry = object.geometry;

        if (!geometry) {
            CLOUD.Logger.log("empty geometry!");
            continue;
        }

        if (calculateAll || ids[object.name] !== undefined) {

            if (!geometry.boundingBox) {
                geometry.computeBoundingBox();
            }

            var box = geometry.boundingBox;

            if (box) {

                var boxTmp = box.clone();

                if (object.matrixWorld) {
                    boxTmp.applyMatrix4(object.matrixWorld);
                }

                bbox.expandByPoint(boxTmp.min);
                bbox.expandByPoint(boxTmp.max);
            }
        }

    }

    return bbox;
};

/**
 * 获得默认场景变换矩阵 - 兼容处理，以后要删除
 *
 */
CLOUD.Scene.prototype.getTransformMatrixGlobal = function () {
    return this.transformMatrix;
};

/**
 * 设置默认场景变换矩阵 - 兼容处理，以后要删除
 *
 */
CLOUD.Scene.prototype.setTransformMatrixGlobal = function (matrix) {
    this.transformMatrix.copy(matrix);
};

CLOUD.Raycaster = function (origin, direction, near, far) {

    this.ray = new THREE.Ray(origin, direction);
    // direction is assumed to be normalized (for accurate distance calculations)

    this.near = near || 0;
    this.far = far || Infinity;

    this.params = {
        Sprite: {},
        Mesh: {},
        Points: {threshold: 1},
        LOD: {},
        Line: {}
    };
};

CLOUD.Raycaster.prototype = {

    constructor: CLOUD.Raycaster,

    precision: 0.0001,
    linePrecision: 1,

    descSort: function (a, b) {
        return a.distance - b.distance;
    },

    set: function (origin, direction) {
        // direction is assumed to be normalized (for accurate distance calculations)

        this.ray.set(origin, direction);
    },

    setFromCamera: function (coords, camera) {

        // camera is assumed _not_ to be a child of a transformed object
        if (camera instanceof CLOUD.CombinedCamera) {
            if (camera.isPerspective) {
                this.ray.origin.copy(camera.position);
                this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
            } else {
                this.ray.origin.set(coords.x, coords.y,( camera.near + camera.far ) / ( camera.near - camera.far )).unproject(camera);
                this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
            }
        } else if (camera instanceof THREE.PerspectiveCamera) {
            this.ray.origin.copy(camera.position);
            this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
        } else if (camera instanceof THREE.OrthographicCamera) {
            this.ray.origin.set(coords.x, coords.y, ( camera.near + camera.far ) / ( camera.near - camera.far )).unproject(camera);
            this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
        } else {
            console.error('CLOUD.Raycaster: Unsupported camera type.');
        }
    },

    // travesal octree, get octree nodes that intersect with the ray
    intersectOctantForNode: function(octreeRoot, octants) {
        var scope = this;
        var bbox = new THREE.Box3();

		function doIntersect(root) {
			var i;
			var length;
			bbox.set(root.min, root.max);
			if (scope.ray.intersectBox (bbox)) {
				octants.push(root);

				if (root.childOctants) {
					for (i = 0, length = root.childOctants.length; i < length; i++) {
						doIntersect(root.childOctants[i]);
					}
				}
			}
		}

        doIntersect(octreeRoot);
    }
};

// Get distance from the ray origin to the near intersect point to the box
// If the box is not intersected with the ray, return -1
THREE.Ray.prototype.intersectBoxWithDistance = function (box) {

    var tmin, tmax, tymin, tymax, tzmin, tzmax;

    var invdirx = 1 / this.direction.x,
        invdiry = 1 / this.direction.y,
        invdirz = 1 / this.direction.z;

    var origin = this.origin;

    if ( invdirx >= 0 ) {

        tmin = ( box.min.x - origin.x ) * invdirx;
        tmax = ( box.max.x - origin.x ) * invdirx;

    } else {

        tmin = ( box.max.x - origin.x ) * invdirx;
        tmax = ( box.min.x - origin.x ) * invdirx;

    }

    if ( invdiry >= 0 ) {

        tymin = ( box.min.y - origin.y ) * invdiry;
        tymax = ( box.max.y - origin.y ) * invdiry;

    } else {

        tymin = ( box.max.y - origin.y ) * invdiry;
        tymax = ( box.min.y - origin.y ) * invdiry;

    }

    if ( ( tmin > tymax ) || ( tymin > tmax ) ) return -1;

    // These lines also handle the case where tmin or tmax is NaN
    // (result of 0 * Infinity). x !== x returns true if x is NaN

    if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

    if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

    if ( invdirz >= 0 ) {

        tzmin = ( box.min.z - origin.z ) * invdirz;
        tzmax = ( box.max.z - origin.z ) * invdirz;

    } else {

        tzmin = ( box.max.z - origin.z ) * invdirz;
        tzmax = ( box.min.z - origin.z ) * invdirz;

    }

    if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return -1;

    if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

    if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

    if ( tmax < 0 ) return -1;

    if (tmin < 0) return 0;

    // get the near intersect point
    var optionalTarget = this.at( tmin >= 0 ? tmin : tmax );

    // get distance from the near point to ray origin
    var dx = optionalTarget.x - origin.x;
    var dy = optionalTarget.y - origin.y;
    var dz = optionalTarget.z - origin.z;
    return Math.sqrt( dx * dx + dy * dy + dz * dz);
};

CLOUD.Keys = {
    ALT: 18,
    BACKSPACE: 8,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    D: 68,
    E: 69,
    Q: 81,
    S: 83,
    W: 87,
    PLUS: 187,
    SUB: 189,
    ZERO: 48,
    ESC: 27
};

CLOUD.EditorConfig = {
    ReverseWheelDirection: false,
    MovementSpeedRate: 1.0,
    // rotation pivot mode, only apply to normal editor mode
    RotatePivotMode: CLOUD.RotatePivotMode.MOUSEPOINT,
    NoPan: false,       // flag to respond to pan operation
    NoRotate: false,   // flag to respond to rotation operation
    NoZoom: false,     // flag to respond to zoom operation
    NoKey: false,      // flag to respond to key operation
    LockAxisZ: false  // flag to lock the rotation along axis z
};

/**
 *
 * @param cameraControl
 * @param scene
 * @constructor
 */
CLOUD.BaseEditor = function (name, cameraControl) {

    this.name = name;
    this.cameraControl = cameraControl;
    this.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, PAN2: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };

    this.StateType = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2
    };

    this.state = this.StateType.NONE;
    this.zoomSpeed = Math.pow(0.95, 0.2); // const

	// TODO: Every editor have their own move speed, do we need to use uniform speed for all editors?
    this.defaultMovementSpeed = 0.005 * CLOUD.GlobalData.SceneSize; // 移动速度 const
    this.movementSpeed = this.defaultMovementSpeed;    // can be changed
    this.minMovementSpeed = 0.001;

    this.defaultKeyPanSpeed = 2.0;
    this.keyPanSpeed = this.defaultKeyPanSpeed;    // pixels moved per arrow key push
    this.minKeyPanSpeed = 0.01;

};

CLOUD.BaseEditor.prototype.getName = function () {
    return this.name;
};

CLOUD.BaseEditor.prototype.destroy = function () {

    this.scene = null;
    this.cameraControl = null;
    this.mouseButtons = null;

};

// callback when the tool is disabled
//
CLOUD.BaseEditor.prototype.onExit = function () {
};

// callback when the tool is activated
//
CLOUD.BaseEditor.prototype.onEnter = function () {
};

//
// ******************** virtual methods to handle all kinds event *************
// ********** specific tool should override event methods they insteresting ***
//
CLOUD.BaseEditor.prototype.processMouseDown = function (event) {
};

CLOUD.BaseEditor.prototype.processMouseMove = function (event) {
};

CLOUD.BaseEditor.prototype.processMouseUp = function (event) {
};

CLOUD.BaseEditor.prototype.processMouseWheel = function (event) {
};

CLOUD.BaseEditor.prototype.processMouseDoubleClick = function (event) {
};

CLOUD.BaseEditor.prototype.processKeyDown = function (event) {
};

CLOUD.BaseEditor.prototype.processKeyUp = function (event) {
};

CLOUD.BaseEditor.prototype.processTouchstart = function (event) {
};

CLOUD.BaseEditor.prototype.processTouchmove = function (event) {
};

CLOUD.BaseEditor.prototype.processTouchend = function (event) {
};

CLOUD.BaseEditor.prototype.processHover = function (event) {
};

//
// **************** end of virtual event handle methods *****************
//

CLOUD.BaseEditor.prototype.moveTo = function (direction) {
};

CLOUD.BaseEditor.prototype.dispatchEvent = function (event) {
    var modelManager = this.cameraControl.viewer.modelManager;
    modelManager.dispatchEvent(event);
};

// override button mapping
CLOUD.BaseEditor.prototype.updateButtons = function (mouseButtons) {

    if(mouseButtons.ORBIT !== undefined ){
        this.mouseButtons.ORBIT = mouseButtons.ORBIT;
    }

    if(mouseButtons.PAN !== undefined){
        this.mouseButtons.PAN = mouseButtons.PAN;
    }

    if(mouseButtons.PAN2 !== undefined){
        this.mouseButtons.PAN2 = mouseButtons.PAN2;
    }

    if(mouseButtons.ZOOM !== undefined){
        this.mouseButtons.ZOOM = mouseButtons.ZOOM;
    }
};

CLOUD.PickHelper = function (cameraControl) {

    this.cameraControl = cameraControl;
    this.scene = cameraControl.scene;

    this.timerId = null;

    this.lastIntersected = null;
};

CLOUD.PickHelper.prototype = {

    constructor: CLOUD.PickHelper,

    destroy: function () {
        this.cameraControl = null;
        this.scene = null;
    },

    click: function (event, preIntersect) {

        var scope = this;

        function handleClick() {

            if(preIntersect && preIntersect.pickable === false ){
                preIntersect = null;
            }
            
            scope.handleMousePick(event, false, preIntersect);
        }

        if (this.timerId) {
            clearTimeout(this.timerId);
        }

        // 延迟300ms以判断是否单击
        this.timerId = setTimeout(handleClick, 300);
    },

    doubleClick: function (event) {

        event.preventDefault();

        if (this.timerId) {
            clearTimeout(this.timerId);
        }

        this.handleMousePick(event, true, null);
    },

    handleMousePick: function (event, isDoubleClick, preIntersect) {

        var cameraControl = this.cameraControl;

        var sceneState = cameraControl.viewer.modelManager.sceneState;

        var scope = this;
        var screenPos = new THREE.Vector2(event.clientX, event.clientY);

        var canvasXY = cameraControl.screenToCanvas(event.clientX, event.clientY);

        function dispatchPickEvent(intersect, selectable) {
            var modelManager = cameraControl.viewer.modelManager;

            // 外部需要获得event的一些状态，需要得到canvas坐标，屏幕坐标没用处
            modelManager.dispatchEvent({
                type: CLOUD.EVENTS.ON_CLICK_PICK,
                event: event, // add
                doubleClick: isDoubleClick, // add
                canvasPos: {x : canvasXY.x, y: canvasXY.y}, // adjust
                intersectInfo: intersect ? {
                        selectedObjectId: intersect.userId,
                        objectType: intersect.objectType,
                        selectable: selectable,
                        modelId: intersect.databagId,
                        worldPosition: intersect.worldPosition,
                        worldBoundingBox: intersect.worldBoundingBox,
                        point: intersect.point,
                        innnerDebugging: intersect.innnerDebugging
                    } : null
            });
        }

        var intersect = null;

        if (preIntersect) {
            // when mouse down, we pick object no matter if the object is selectable.
            // if previous picked object is not selectable, pick nothing
            if (preIntersect.pickable) {
                intersect = preIntersect.intersect;
            }
        } else {

            //var intersects = [];

            var intersectContext = cameraControl.getIntersectContext(screenPos);
            intersect = cameraControl.intersector.pick(intersectContext, null);
        }

        if (!intersect) {
            var oldSelection = sceneState.getSelection();

            if (oldSelection.length > 0) {
                sceneState.clearSelection();
                cameraControl.updateView(true);
            }
            scope.lastPickedUserId = undefined;

            if (preIntersect && !preIntersect.pickable) {
                // click on an unselectable object, trigger the click event with the object
                intersect = preIntersect.intersect;
                intersect.cx = screenPos.x;
                intersect.cy = screenPos.y;
                dispatchPickEvent(intersect, false);
            }
            else {
                dispatchPickEvent(null);
            }

            return;
        }

        var userId = intersect.userId;

        scope.lastPickedUserId = userId;

        if (CLOUD.Utils.isMobileDevice()) {
            cameraControl.pivot = intersect.point;
        }

        // 将位置和包围转换到世界系
        scope.scene.intersectToWorld(intersect);

        intersect.innnerDebugging = event.altKey;
        intersect.cx = screenPos.x;
        intersect.cy = screenPos.y;

        // 双击构件
        if (isDoubleClick) {

            if (CLOUD.GlobalData.EnableDemolishByDClick) {
                //sceneState.addSelection([userId]);
                cameraControl.viewer.filter.addToIdList(CLOUD.EnumIdBasedType.TRANSLUCENT, [userId]);   //liuw-d
                cameraControl.updateView(true);
            } else {
                sceneState.setSelection([userId]);
                cameraControl.fitAndRotateBySelection();
                dispatchPickEvent(intersect, true);
            }

        } else {

            if (!event.ctrlKey) {
                sceneState.setSelection([userId]);
            }
            else {
                sceneState.addSelection([userId]);
            }
            dispatchPickEvent(intersect, true);
            cameraControl.updateView(true);
        }

    },

    handleMouseMeasure: function (event, pick) {

        var cameraControl = this.cameraControl;
        var scene = cameraControl.scene;

        var screenPos = new THREE.Vector2(event.clientX, event.clientY);
        var intersectContext = cameraControl.getIntersectContext(screenPos);

        function dispatchMeasureEvent(point, line, plane) {

            var modelManager = cameraControl.viewer.modelManager;
            if (point != null) {
                var worldPosition = cameraControl.scene.drawingToWorld(point);
                point.copy(worldPosition);
            }
            if (line != null) {
                var pointA = cameraControl.scene.drawingToWorld(line[0]);
                var pointB = cameraControl.scene.drawingToWorld(line[1]);
                line[0].copy(pointA);
                line[1].copy(pointB);
            }

            modelManager.dispatchEvent({
                type: CLOUD.EVENTS.ON_MEASURE_PICK,
                event: event, // add
                pick: pick,
                pickPoint: point,
                pickLine: line,
                pickPlane: plane
            });

        }

        cameraControl.intersector.pick(intersectContext, function (intersect) {

            if (intersect) {

                var intersectPosition = intersect.point;
                var geometry = intersect.object.geometry;
                var matrix = intersect.object.matrixWorld;
                var projScreenMatrix = cameraControl.camera.projScreenMatrix;
                var mouse = intersectContext.mouse;
                var viewportSize = intersectContext.viewportSize;

                var positions = geometry.attributes.position.array;
                var normals = geometry.attributes.normal.array;
                var indices = CLOUD.RemoveDuplicateVertex(geometry.attributes.position.array, geometry.index.array);

                var distance = Infinity;
                var point = new THREE.Vector3();
                for (var i = 0; i < indices.length; ++i) {

                    var position = new THREE.Vector3(positions[indices[i] * 3], positions[indices[i] * 3 + 1], positions[indices[i] * 3 + 2]);
                    position.applyMatrix4(matrix);

                    var screenPos = position.clone();
                    screenPos.applyMatrix4(projScreenMatrix);

                    var dx = (screenPos.x - mouse.x) * 0.5 * viewportSize.width;
                    var dy = (screenPos.y - mouse.y) * 0.5 * viewportSize.height;

                    var length = Math.sqrt(dx * dx + dy * dy);
                    if (length < distance) {
                        distance = length;
                        point.copy(position);
                    }

                }

                var pickPoint = intersectPosition.clone();
                var pickLine = null;
                var pickPlane = false;
                if (distance < 5.0) {

                    if (scene.hasObjectGroup(CLOUD.ObjectGroupType.MEASUREPICKPLANE)) {
                        scene.removeObjectGroupByName(CLOUD.ObjectGroupType.MEASUREPICKPLANE);
                    }
                    pickPoint = point.clone();

                }
                else {

                    function pointToLine(pointA, pointB, point) {

                        var ab = new THREE.Vector3();
                        ab.subVectors(pointB, pointA);

                        var ac = new THREE.Vector3();
                        ac.subVectors(point, pointA);

                        var f = ab.dot(ac);
                        if (f < 0) return pointA;

                        var d = ab.dot(ab);
                        if (f > d) return pointB;

                        f = f / d;
                        var pointD = pointA.clone();
                        pointD.addScaledVector(ab, f);
                        return pointD;

                    }

                    var distance = Infinity;
                    var pointA = new THREE.Vector3();
                    var pointB = new THREE.Vector3();
                    var edgeIndex = CLOUD.BuildEdge(geometry.attributes.position.array, geometry.index.array);
                    for (var i = 0; i < edgeIndex.length; i += 2) {

                        var _pointA = new THREE.Vector3(positions[edgeIndex[i] * 3], positions[edgeIndex[i] * 3 + 1], positions[edgeIndex[i] * 3 + 2]);
                        _pointA.applyMatrix4(matrix);

                        var _pointB = new THREE.Vector3(positions[edgeIndex[i + 1] * 3], positions[edgeIndex[i + 1] * 3 + 1], positions[edgeIndex[i + 1] * 3 + 2]);
                        _pointB.applyMatrix4(matrix);

                        var point = pointToLine(_pointA, _pointB, intersectPosition);
                        var screenPos = point.clone();
                        screenPos.applyMatrix4(projScreenMatrix);

                        var dx = (screenPos.x - mouse.x) * 0.5 * viewportSize.width;
                        var dy = (screenPos.y - mouse.y) * 0.5 * viewportSize.height;

                        var length = Math.sqrt(dx * dx + dy * dy);
                        if (length < distance) {
                            distance = length;
                            pointA.copy(_pointA);
                            pointB.copy(_pointB);
                        }

                    }

                    if (distance < 5.0) {

                        if (scene.hasObjectGroup(CLOUD.ObjectGroupType.MEASUREPICKPLANE)) {
                            scene.removeObjectGroupByName(CLOUD.ObjectGroupType.MEASUREPICKPLANE);
                        }
                        pickLine = new Array();
                        pickLine.push(pointA);
                        pickLine.push(pointB);

                    }
                    else {

                        indices = geometry.index.array;

                        var inverseMatrix = new THREE.Matrix4();
                        inverseMatrix.getInverse(matrix);
                        var worldPosition = new THREE.Vector3(intersectPosition.x, intersectPosition.y, intersectPosition.z);
                        worldPosition.applyMatrix4(inverseMatrix);

                        var faceIndex = CLOUD.GetFaceIndex(positions, normals, indices, worldPosition, intersect.face.normal);

                        var faceGeometry = new THREE.BufferGeometry();
                        faceGeometry.setIndex(faceIndex);
                        faceGeometry.addAttribute('position', geometry.attributes.position, 3);
                        faceGeometry.addAttribute('normal', geometry.attributes.normal, 3);

                        var wireframeIndex = CLOUD.BuildEdge(positions, faceIndex);
                        var wireframeGeometry = new THREE.BufferGeometry();
                        wireframeGeometry.setIndex(wireframeIndex);
                        wireframeGeometry.addAttribute('position', geometry.attributes.position, 3);

                        if (scene.hasObjectGroup(CLOUD.ObjectGroupType.MEASUREPICKPLANE)) {
                            scene.removeObjectGroupByName(CLOUD.ObjectGroupType.MEASUREPICKPLANE);
                        }

                        var group = scene.getOrCreateObjectGroup(CLOUD.ObjectGroupType.MEASUREPICKPLANE, {priority: 1, globalSpace: true});
                        var faceMesh = new THREE.Mesh(faceGeometry, new THREE.MeshBasicMaterial( {color: 0x11DAB7, opacity: 0.1, transparent: true} ));
                        faceMesh.applyMatrix(intersect.object.matrix);
                        group.add(faceMesh);

                        var lineMesh = new THREE.LineSegments(wireframeGeometry, new THREE.LineBasicMaterial( {color: 0x11DAB7} ));
                        lineMesh.applyMatrix(intersect.object.matrix);
                        group.add(lineMesh);

                        group.updateMatrixWorld(true);

                        cameraControl.updateHighlight();

                        pickPlane = true;

                    }

                }

                dispatchMeasureEvent(pickPoint, pickLine, pickPlane);

            }
            else {
                
                if (scene.hasObjectGroup(CLOUD.ObjectGroupType.MEASUREPLANE)) {
                    scene.removeObjectGroupByName(CLOUD.ObjectGroupType.MEASUREPLANE);
                }
                
                dispatchMeasureEvent(null, null);
            }

        });

    },

    handleMouseHover: function (event) {

        var scope = this;
        var cameraControl = this.cameraControl;
        var sceneState = cameraControl.viewer.modelManager.sceneState;

        // No global hover and no 3d markup, don't do hover test
        if((!CLOUD.GlobalData.Hover) &&
            !(scope.scene.hasObjectGroup(CLOUD.ObjectGroupType.MARKER3D))) {
            return;
        }

        var canvasXY = cameraControl.screenToCanvas(event.clientX, event.clientY);

        function dispatchHoverEvent(intersect, selectable) {
            var modelManager = cameraControl.viewer.modelManager;

            if (intersect != null) {
                scope.scene.intersectToWorld(intersect);
            }

            modelManager.dispatchEvent({
                type: CLOUD.EVENTS.ON_HOVER_PICK,
                event: event, // add
                canvasPos: {x: canvasXY.x, y: canvasXY.y}, // adjust
                intersectInfo: intersect ? {
                    selectedObjectId: intersect.userId,
                    objectType: intersect.objectType,
                    selectable: selectable,
                    modelId: intersect.databagId,
                    worldPosition: intersect.worldPosition,
                    worldBoundingBox: intersect.worldBoundingBox,
                    point: intersect.point,
                    innnerDebugging: intersect.innnerDebugging
                } : null
            });
        }

        var screenPos = new THREE.Vector2(event.clientX, event.clientY);
        var intersectContext = cameraControl.getIntersectContext(screenPos);

        // 如果禁用了全局hover，其实只需要遍历hover group，现在的方案，每次鼠标滑动都pick会影响效率！
        cameraControl.intersector.pick(intersectContext, function (intersect) {

            // 取消 hover
            function hoverOff(intersect) {

                switch (intersect.objectType) {

                    case CLOUD.PICKABLETYPE.Marker3d:
                        intersect.object.setAttributeSize(intersect.index, intersect.currentSize);
                        break;
                    default:
                        sceneState.clearHover();
                        break;

                }

            }

            // hover 构件
            function hoverOver(intersect) {

                switch (intersect.objectType) {

                    case CLOUD.PICKABLETYPE.Marker3d:
                        var node = intersect.object;
                        intersect.currentSize = node.getAttributeSize(intersect.index);
                        node.setAttributeSize(intersect.index, Math.floor(intersect.currentSize * 1.5));
                        break;
                    default:

                        if (CLOUD.GlobalData.EnableRenderPass) {
                            sceneState.setHoverId(intersect.object.originalId);
                        }
                        else {
                            sceneState.setHoverId(intersect.userId);
                        }
                        break;

                }

            }

            if (intersect) {

                // BIMFACEDM-3331: 将构件Hover与三维标签Hover独立控制
                var hover = CLOUD.GlobalData.Hover || intersect.hoverEnabled;

                if (scope.lastIntersected) {

                    hoverOff(scope.lastIntersected);

                    // TODO: refector hover among different drawable (3d markup, 3d elements ...)
                    // Defect tmp fix: hover from markup to 3d primitives,
                    // while the primitives hover is off. the markup's tool tip
                    // does not disappear.
                    if(scope.lastIntersected.hoverEnabled) {
                        dispatchHoverEvent(null);
                    }

                }

                scope.lastIntersected = intersect;

                if (hover) {

                    hoverOver(intersect);
                    dispatchHoverEvent(intersect, true);

                }

                cameraControl.updateHighlight();   // 名字不太合适

            }
            else {

                if (scope.lastIntersected) {

                    hoverOff(scope.lastIntersected);
                    scope.lastIntersected = null;

                    dispatchHoverEvent(null);
                    cameraControl.updateHighlight();

                }

            }

        });

    }
};




CLOUD.NormalEditor = function (name, cameraControl) {
	
    CLOUD.BaseEditor.call(this, name, cameraControl);

    this.oldMouseX = -1;
    this.oldMouseY = -1;

    this.rotatePivot = null;

	this._rotateStart = new THREE.Vector2();
    this._rotateEnd = new THREE.Vector2();
    this._rotateDelta = new THREE.Vector2();
	this._lastTrackingPoint = null;
	
	this.rotateSpeed = 1.0;
	
	this._dollyStart = new THREE.Vector2();
    this._dollyEnd = new THREE.Vector2();
    this._dollyDelta = new THREE.Vector2();
    this._dollyCenter = new THREE.Vector2();
	
	this.zoomSpeed = Math.pow(0.95, 0.2);
	
	this._panStart = new THREE.Vector2();
    this._panEnd = new THREE.Vector2();
    this._panDelta = new THREE.Vector2();
    this._pan = new THREE.Vector3(); // tmp
    this._worldDimension = new THREE.Vector2();

    this.pickHelper = new CLOUD.PickHelper(cameraControl);
    this.intersectOfMouseDown = null;

    this.timeId = null;
    this.longTapFlag = false;

    if (CLOUD.Utils.isMobileDevice()) {
        this.selectPad = new CLOUD.SelectPad(this);
    } else {
        this.selectPad = null;
    }

    this.startPt = new THREE.Vector2();
    
    var scope = this;
    this.longTap = function () {
        scope.longTapFlag = true;
        CLOUD.Logger.log("long tap");

        if (scope.selectPad) {
            scope.selectPad.showOverlay(scope.startPt);
        }
    };
};

CLOUD.NormalEditor.prototype = Object.create(CLOUD.BaseEditor.prototype);
CLOUD.NormalEditor.prototype.constructor = CLOUD.NormalEditor;

CLOUD.NormalEditor.prototype.destroy = function (){

    CLOUD.BaseEditor.prototype.destroy.call(this);

    this.pickHelper.destroy();
    this.pickHelper = null;

    this.intersectOfMouseDown = null;

    if (this.selectPad) {
        this.selectPad = null;
    }

    this.timeId = null;

};

CLOUD.NormalEditor.prototype.beginPan = function (cx, cy) {
	this._panStart.set(cx, cy);

	// 根据当前鼠标点获得世界坐标系中的宽高
	this._worldDimension = this.getWorldDimension(cx, cy);
};

CLOUD.NormalEditor.prototype.processMouseDown = function (event) {

    this.oldMouseX = event.clientX;
    this.oldMouseY = event.clientY;

    var cameraControl = this.cameraControl;

    this.intersectOfMouseDown = null;
    event.preventDefault();

    if (event.button === this.mouseButtons.ORBIT) {

        if (CLOUD.EditorConfig.NoRotate)
            return;

        this.rotatePivot = cameraControl.calculatePivot(CLOUD.EditorConfig.RotatePivotMode, {x:event.clientX, y: event.clientY});
        //cameraControl.beginRotate(event.clientX, event.clientY);
		
		this.state = this.StateType.ROTATE;
        this._rotateStart.set(event.clientX, event.clientY);

        // 获得追踪点
        this._lastTrackingPoint = null;

    } else if (event.button === this.mouseButtons.ZOOM) {

        if (CLOUD.EditorConfig.NoZoom) {
            return;
        }

        //cameraControl.beginZoom(event.clientX, event.clientY);
		this.state = this.StateType.DOLLY;
        this._dollyStart.set(event.clientX, event.clientY);

    } else if (event.button === this.mouseButtons.PAN || event.button === this.mouseButtons.PAN2) {

        if (CLOUD.EditorConfig.NoPan) {
            return;
        }

        //cameraControl.beginPan(event.clientX, event.clientY);
        this._panStart.set(event.clientX, event.clientY);

        // 根据当前鼠标点获得世界坐标系中的宽高
        this._worldDimension = cameraControl.getWorldDimension(event.clientX, event.clientY);

        this.state = this.StateType.PAN;

        this.intersectOfMouseDown = cameraControl.getLastIntersect();
    }
};

CLOUD.NormalEditor.prototype.processMouseMove = function (event) {

    var cameraControl = this.cameraControl;

    event.preventDefault();

    //CLOUD.Logger.log("[CloudOrbitEditor.onMouseMove][mouse.clientXY(" + event.clientX + "," + event.clientY + "),mouse.offsetXY(" + event.offsetX + "," + event.offsetY + ")]");

    // 当鼠标移动到其他元素上时，event.offsetX, event.offsetY获得的是鼠标在其他元素区域里的相对坐标，
    // 会造成模型跳变，所以传入event.clientX, event.clientY，根据当前父元素节点位置计算鼠标的真实偏移量
    //cameraControl.process(event.clientX, event.clientY, true);

    switch (this.state) {
        case this.StateType.ROTATE:
            this._rotateEnd.set(event.clientX, event.clientY);
            this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart);

            if (this._rotateDelta.x == 0 && this._rotateDelta.y == 0)
                return;

            this._rotateStart.copy(this._rotateEnd);

            cameraControl.processRotate(this._rotateDelta, this.rotatePivot);

            break;
        case  this.StateType.DOLLY:
            this._dollyEnd.set(event.clientX, event.clientY);
            this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart);
            if (this._dollyDelta.x === 0 && this._dollyDelta.y === 0)
                return;

            var scale;
            if (this._dollyDelta.y > 0) {
                //CLOUD.Logger.log("dollyOut");
                //_scope.dollyOut();
                scale = this.zoomSpeed;
            } else {
                //CLOUD.Logger.log("dollyIn");
                //_scope.dollyIn();
                scale = 1.0 / this.zoomSpeed;
            }

            //_scope.dollyByCenter();
			this.cameraControl.adjustCameraForDolly(scale, null);

            this._dollyStart.copy(this._dollyEnd);

            break;
        case this.StateType.PAN:

            this._panEnd.set(event.clientX, event.clientY);
            this._panDelta.subVectors(this._panEnd, this._panStart);
            if (this._panDelta.x == 0 && this._panDelta.y == 0)
                return;

            this.cameraControl.panOnWorld(this._panStart, this._panEnd, this._pan, this._worldDimension);
            //scope.pan( panDelta.x, panDelta.y );

            this.cameraControl.adjustCameraForPan(this._pan);
            this._panStart.copy(this._panEnd);

            break;
        case this.StateType.NONE:
        default:
            break;
    }

    if (this.state !== this.StateType.NONE)
        this.cameraControl.update(true);

};

CLOUD.NormalEditor.prototype.processMouseUp = function (event) {

    if (this.state === this.StateType.NONE) {
        return false;
    }
	
    this.intersectOfMouseDown = null;

    var cameraControl = this.cameraControl;
	
	// TODO: FIXME: should still process operation, otherwise the last operation is skipped
	//

    // 直接使用up来模拟click
    if (this.oldMouseX !== event.clientX || this.oldMouseY !== event.clientY) {
        cameraControl.update(true);
    } // else we think this is a click event, why not update the view? wun-c

	this.state = this.StateType.NONE;
    this.rotatePivot = null;
	
	cameraControl.endOperation();

    return true;
};

// TODO: refactor this method. All there kinds of Editor have similar code
CLOUD.NormalEditor.prototype.processMouseWheel = function (event) {

    var cameraControl = this.cameraControl;

    if (CLOUD.EditorConfig.NoZoom)
        return;

    event.preventDefault();
    event.stopPropagation();

    //滚轮操作在浏览器中要考虑兼容性
    // 五大浏览器（IE、Opera、Safari、Firefox、Chrome）中Firefox 使用detail，其余四类使用wheelDelta；
    var delta = 0;

    if (event.wheelDelta) {
        delta = event.wheelDelta;
    } else if (event.detail) {
        delta = -event.detail * 40;
    }

    if (Math.abs(delta) > 720) delta = delta > 0 ? 720 : -720;

    delta *= 0.0005; // 0.0005

    if (CLOUD.EditorConfig.ReverseWheelDirection) {
        delta *= -1;
    }

    cameraControl.zoom(delta, event.clientX, event.clientY);
    cameraControl.delayHandle();
};

CLOUD.NormalEditor.prototype.processKeyDown = function (event) {

    if (CLOUD.EditorConfig.NoKey || CLOUD.EditorConfig.NoPan)
        return;

    var cameraControl = this.cameraControl;

    cameraControl.delayHandle();

    var movementSpeed = this.movementSpeed * CLOUD.EditorConfig.MovementSpeedRate;
    var keyPanSpeed = this.keyPanSpeed * CLOUD.EditorConfig.MovementSpeedRate;

    switch (event.keyCode) {
        case CLOUD.Keys.ZERO:
            this.keyPanSpeed = cameraControl.defaultKeyPanSpeed;
            this.movementSpeed = cameraControl.defaultMovementSpeed;
            break;

        case CLOUD.Keys.PLUS:
            this.keyPanSpeed *= 1.1;
            this.movementSpeed *= 1.1;
            break;

        case CLOUD.Keys.SUB:
            this.keyPanSpeed *= 0.9;

            if (this.keyPanSpeed < this.minKeyPanSpeed) {
                this.keyPanSpeed = this.minKeyPanSpeed;
            }

            this.movementSpeed *= 0.9;

            if (this.movementSpeed < this.minMovementSpeed) {
                this.movementSpeed = this.minMovementSpeed;
            }
            break;

        case CLOUD.Keys.Q:
            cameraControl.pan(0, keyPanSpeed);
            cameraControl.update(true);
            break;

        case CLOUD.Keys.E:
            cameraControl.pan(0, -keyPanSpeed);
            cameraControl.update(true);
            break;

        case CLOUD.Keys.LEFT:
        case CLOUD.Keys.A:
            cameraControl.pan(keyPanSpeed, 0);
            cameraControl.update(true);
            break;

        case CLOUD.Keys.RIGHT:
        case CLOUD.Keys.D:
            cameraControl.pan(-keyPanSpeed, 0);
            cameraControl.update(true);
            break;

        case CLOUD.Keys.UP:
        case CLOUD.Keys.W:
            cameraControl.moveStraight(movementSpeed, !event.shiftKey);
            cameraControl.update(true);
            break;

        case CLOUD.Keys.DOWN:
        case CLOUD.Keys.S:
            cameraControl.moveStraight(-movementSpeed, !event.shiftKey);
            cameraControl.update(true);
            break;
    }
};

CLOUD.NormalEditor.prototype.processKeyUp = function (event) {

    if (CLOUD.EditorConfig.NoKey || CLOUD.EditorConfig.NoPan ) return;

    switch (event.keyCode) {
        case CLOUD.Keys.ESC:
            // TODO: move sceneState to Scene class
            // 层次太深了！！！
            this.cameraControl.viewer.modelManager.sceneState.clearSelection();
            break;
        default :
            break
    }
};

CLOUD.NormalEditor.prototype.processTouchstart = function (event) {

    this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);

    if (this.timeId) {
        clearTimeout(this.timeId);
    }

    var scope = this;
    scope.timeId = setTimeout(scope.longTap, 400);

    if (this.selectPad) {
        this.selectPad.hideOverlay();
    }

    switch (event.touches.length) {

        case 1:    // one-fingered touch: rotate
            if (CLOUD.EditorConfig.NoRotate)
                return;
            //handleTouchStartRotate(event);
            this._rotateStart.set(event.touches[0].clientX, event.touches[0].clientY);
            this.state = this.StateType.ROTATE;

            break;

        case 2:    // two-fingered touch: dolly and pan
            if (!CLOUD.EditorConfig.NoZoom) {
                //handleTouchStartDolly(event);
                var dx = event.touches[0].clientX - event.touches[1].clientX;
                var dy = event.touches[0].clientY - event.touches[1].clientY;

                this._dollyStart.set(0, Math.sqrt(dx * dx + dy * dy));
            }

            if (!CLOUD.EditorConfig.NoPan){
                //handleTouchStartPan(event);
                var cx = (event.touches[0].clientX + event.touches[1].clientX) * 0.5;
                var cy = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
                this._panStart.set(cx, cy);
            }

            break;

        default:
            this.state = this.StateType.NONE;
            break;
    }
};

CLOUD.NormalEditor.prototype.processTouchmove = function (event) {

    if (this.timeId) {
        clearTimeout(this.timeId);
    }

    var cameraControl = this.cameraControl;

    event.preventDefault();
    //event.stopPropagation();

    //cameraControl.touchMoveHandler(event);
    switch (event.touches.length) {
        case 1: // one-fingered touch: rotate

            //handleTouchMoveRotate(event);
			if (CLOUD.EditorConfig.NoRotate)
                return;
			
            this._rotateEnd.set(event.touches[0].clientX, event.touches[0].clientY);
            this._rotateDelta.subVectors(this._rotateStart, this._rotateEnd);

            var clientSize = this.cameraControl.getClientSize();

            var thetaDelta = 2 * Math.PI * this._rotateDelta.x / clientSize.x * this.rotateSpeed;
            var phiDelta = 2 * Math.PI * this._rotateDelta.y / clientSize.y * this.rotateSpeed;

            cameraControl.touchUpdateRotation(thetaDelta, phiDelta);

            this._rotateStart.copy(this._rotateEnd);

            break;

        case 2: // two-fingered touch: dolly or pan

            cameraControl.clearTouchRotateState();

            if (!CLOUD.EditorConfig.NoZoom) {

                var dx = event.touches[0].clientX - event.touches[1].clientX;
                var dy = event.touches[0].clientY - event.touches[1].clientY;

                var distance = Math.sqrt(dx * dx + dy * dy);
                this._dollyEnd.set(0, distance);
                this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart);

                if (Math.abs(this._dollyDelta.y) > 3) {

                    var scale;
                    if (this._dollyDelta.y > 0) {
                        scale = 1.0 / Math.pow(this.zoomSpeed, this._dollyDelta.y * 0.5);
                    }
                    else if (this._dollyDelta.y < 0) {
                        scale = Math.pow(this.zoomSpeed, -this._dollyDelta.y * 0.5);
                    }
                    console.log(this._dollyDelta.y);
                    this._dollyStart.copy(this._dollyEnd);

                    var dollyCenterX = (event.touches[0].clientX + event.touches[1].clientX) * 0.5;
                    var dollyCenterY = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;

                    cameraControl.touchDolly(dollyCenterX, dollyCenterY, scale);

                    this.state = this.StateType.DOLLY;
                    
                }

            }
            if (!CLOUD.EditorConfig.NoPan) {

                //handleTouchMovePan(event);
                var cx = (event.touches[0].clientX + event.touches[1].clientX) * 0.5;
                var cy = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
                this._panEnd.set(cx, cy);
                this._panDelta.subVectors(this._panEnd, this._panStart);

                if (Math.abs(this._panDelta.x) < 3 && Math.abs(this._panDelta.y) < 3) return;

                this._worldDimension = cameraControl.getWorldDimension(cx, cy);
                cameraControl.panOnWorld(this._panStart, this._panEnd, this._pan, this._worldDimension);
                cameraControl.adjustCameraForPan(this._pan);

                this._panStart.copy(this._panEnd);

                this.state = this.StateType.PAN;

            }

            break;

        default:
            break;
    }

    cameraControl.touchUpdate();
};

CLOUD.NormalEditor.prototype.processTouchend = function (event) {

    if (this.timeId) {
        clearTimeout(this.timeId);
    }

    if (this.longTapFlag) {
        this.longTapFlag = false;
        event.preventDefault();
    }

    var cameraControl = this.cameraControl;
    switch (event.touches.length) {
        case 0:
            this.state = this.StateType.NONE;
            cameraControl.touchEndHandler(event);
            break;

        case 1:
            if (CLOUD.EditorConfig.NoRotate)
                return;

            this._rotateStart.set(event.touches[0].clientX, event.touches[0].clientY);
            this.state = this.StateType.ROTATE;
            break;

        default:
            break;
    }

};

CLOUD.NormalEditor.prototype.processHover = function (event) {

    this.pickHelper.handleMouseHover(event);

};

CLOUD.NormalEditor.prototype.moveTo = function (direction) {

    if (direction === undefined) {
        return;
    }

    var cameraControl = this.cameraControl;

    if (CLOUD.EditorConfig.NoKey || CLOUD.EditorConfig.NoPan) return;

    var movementSpeed = this.movementSpeed * CLOUD.EditorConfig.MovementSpeedRate;
    var keyPanSpeed = this.keyPanSpeed * CLOUD.EditorConfig.MovementSpeedRate;

    var enumMoveDirection = CLOUD.MoveDirection;

    switch (direction) {

        case enumMoveDirection.FORWARD:
            cameraControl.moveForward(movementSpeed, true);
            break;
        case enumMoveDirection.BACK:
            cameraControl.moveBackward(movementSpeed, true);
            break;

        case enumMoveDirection.LEFT:
            cameraControl.pan(keyPanSpeed, 0);
            break;

        case enumMoveDirection.RIGHT:
            cameraControl.pan(-keyPanSpeed, 0);
            break;

        case enumMoveDirection.UP:
            cameraControl.pan(0, keyPanSpeed);
            break;

        case enumMoveDirection.DOWN:
            cameraControl.pan(0, -keyPanSpeed);
            break;
        default:
            direction = enumMoveDirection.NONE;
            break;

    }

    if (direction !== enumMoveDirection.NONE) {
        cameraControl.update(true, true);
    }

};

CLOUD.OrbitEditor = function ( cameraControl, name ) {
    CLOUD.NormalEditor.call( this, name ? name : CLOUD.EditorMode.ORBIT, cameraControl );
    // Mouse buttons
    this.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, PAN2: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
};
CLOUD.OrbitEditor.prototype = Object.create( CLOUD.NormalEditor.prototype );
CLOUD.OrbitEditor.prototype.constructor = CLOUD.OrbitEditor;

CLOUD.PickEditor = function (cameraControl) {
    CLOUD.OrbitEditor.call(this, cameraControl, CLOUD.EditorMode.PICK);
};

CLOUD.PickEditor.prototype = Object.create(CLOUD.OrbitEditor.prototype);
CLOUD.PickEditor.prototype.constructor = CLOUD.PickEditor;


CLOUD.PickEditor.prototype.processMouseUp = function (event) {

	event.preventDefault();

    if (event.button === THREE.MOUSE.LEFT) {
		
		if (this.oldMouseX == event.clientX && this.oldMouseY == event.clientY) {
			this.pickHelper.click(event, this.intersectOfMouseDown);
		} else {
			this.cameraControl.update(true);
		}

		this.intersectOfMouseDown = null;
	}

	this.state = this.StateType.NONE;
};

CLOUD.PickEditor.prototype.processMouseDoubleClick = function (event) {

    if (event.button === THREE.MOUSE.LEFT) {
        this.pickHelper.doubleClick(event);
    }
};


/**
 * Base class of edit tool
 * An edit tool implement a specific function when interact with user. It can co-work under all kinds of
 * editor(interactive) modes.
 * The edit tool processes interactive event they are interested. And edit tool has higher priority than editors.
 */
CLOUD.EditTool = function (name) {

    this.name = name;
    this._mousePressed = false;

};

CLOUD.EditTool.prototype.getName = function () {
    return this.name;
};

// virtual method when the tool is disabled
//
CLOUD.EditTool.prototype.onExit = function() {

};

//
// ******************** virtual methods to handle all kinds event *************
// ********** specific tool should override event methods they insteresting ***
//
CLOUD.EditTool.prototype.processMouseDown = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processMouseMove = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processMouseUp = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processMouseWheel = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processMouseDoubleClick = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processKeyDown = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processKeyUp = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processTouchstart = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processTouchmove = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processTouchend = function (event) {
	return false;
};

CLOUD.EditTool.prototype.processHover = function (event) {
	return false;
};

//
// ******************** end of virtual methods *****************
//

// dispatch the event to specific event methods
// called by editor manager when event is received
// should not be called by user
CLOUD.EditTool.prototype.onEvent = function(event) {
	var ret = false;
	
	switch(event.type) {
		case 'touchmove':
			ret = this.processTouchmove(event);
			break;
		case 'touchstart':
			ret = this.processTouchstart(event);
			break;
		case 'touchend':
			ret = this.processTouchend(event);
		case 'keydown':
			ret = this.processKeyDown(event);
			break;
		case 'keyup':
			ret = this.processKeyUp(event);
			break;
		case 'mousewheel':
		case 'DOMMouseScroll':
			// this.cameraChange = true; Do we need handle this??? -wun-c
			ret = this.processMouseWheel(event);
			break;
		case 'mousedown':
			this._mousePressed = true;
			ret = this.processMouseDown(event);
			break;
		case 'mousemove':
			if (this._mousePressed) {
				ret = this.processMouseMove(event);
			}
			else {
				ret = this.processHover(event);
			}
			break;
		case 'mouseup':
			this._mousePressed = false;
			ret = this.processMouseUp(event);
			break;
		
		case 'dblclick':
			ret = this.processMouseDoubleClick(event);
			break;
	}

	return ret;
};


/**
 * Base class for tool with rectangle mouse operation.
 *
 * @param name
 * @param cameraControl
 * @param eventDispatcher
 * @constructor
 */
CLOUD.RectOpTool = function (name, cameraControl, eventDispatcher) {

    CLOUD.EditTool.call(this, name);

    this.cameraControl = cameraControl;

    this.frustum = new THREE.Frustum();

    this.startPt = new THREE.Vector2();
    this.endPt = new THREE.Vector2();

    this.eventDispatcher = eventDispatcher;
};


CLOUD.RectOpTool.prototype = Object.create(CLOUD.EditTool.prototype);
CLOUD.RectOpTool.prototype.constructor = CLOUD.RectOpTool;

// send event with the rectangle information
CLOUD.RectOpTool.prototype.onUpdateUI = function (obj) {
    this.eventDispatcher.dispatchEvent({type: CLOUD.EVENTS.ON_EDITOR_UPDATEUI, data: obj, editor: this.name});
};

// do update when rectangle area of the mouse operation is changed
//
CLOUD.RectOpTool.prototype.updateFrustum = function (frustumUpdate, updateUI) {

    var x1 = this.startPt.x;
    var x2 = this.endPt.x;
    var y1 = this.startPt.y;
    var y2 = this.endPt.y;

    if (x1 > x2) {

        var tmp1 = x1;
        x1 = x2;
        x2 = tmp1;

    }

    if (y1 > y2) {

        var tmp2 = y1;
        y1 = y2;
        y2 = tmp2;

    }

    if (x2 - x1 == 0 || y2 - y1 == 0)
        return false;

    var helper = this.cameraControl;
    var dim = helper.getContainerDimensions();

    if (frustumUpdate) {
        helper.computeFrustum(x1, x2, y1, y2, this.frustum, dim);
    }

    if (updateUI) {
        this.onUpdateUI({
            visible: true,
            dir: this.startPt.x < this.endPt.x,
            left: (x1 - dim.left),
            top: (y1 - dim.top),
            width: (x2 - x1),
            height: (y2 - y1)
        });
    }

    return true;
};


/**
 * Edit tool for picking objects with mouse rectangle operation
 * When press mouse with ctrl/alt key, enter the rect pick operation.
 * When ctrl key is pressed, picked objects are added into selection set,
 * when alt key is pressed, picked objects are removed from selection set
 *
 * @param viewer
 * @constructor
 */
CLOUD.RectPickTool = function (viewer) {

    CLOUD.RectOpTool.call(this, CLOUD.EditToolMode.PICK_BY_RECT, viewer.cameraControl, viewer.modelManager);
	
	this.scene = viewer.getScene();
    this.pickHelper = new CLOUD.PickHelper(this.cameraControl);

	this.activatePick = false;

};

CLOUD.RectPickTool.prototype = Object.create(CLOUD.RectOpTool.prototype);
CLOUD.RectPickTool.prototype.constructor = CLOUD.RectPickTool;

CLOUD.RectPickTool.prototype.destroy = function () {

    CLOUD.BaseEditor.prototype.destroy.call(this);

    this.pickHelper.destroy();
    this.pickHelper = null;

};

CLOUD.RectPickTool.prototype.processMouseDown = function (event) {

    event.preventDefault();
    //event.stopPropagation();

    this.activatePick = event.ctrlKey || event.altKey;

    if (this.activatePick && event.button === THREE.MOUSE.LEFT) {

        this.startPt.set(event.clientX, event.clientY);

        return true;
    }

    return CLOUD.RectOpTool.prototype.processMouseDown(this, event);

};

CLOUD.RectPickTool.prototype.processMouseMove = function (event) {

    //event.preventDefault();

    if (this.activatePick && event.button === THREE.MOUSE.LEFT) {

        this.endPt.set(event.clientX, event.clientY);

        this.updateFrustum(false, true);
		
        return true;
    }

    return CLOUD.RectOpTool.prototype.processMouseMove(this, event);

};

CLOUD.RectPickTool.prototype.processMouseUp = function (event) {

    //event.preventDefault();
    //event.stopPropagation();

    this.onUpdateUI({visible: false});

    if (this.activatePick && event.button === THREE.MOUSE.LEFT) {

        this.activatePick = false;

        if (Math.abs(this.startPt.x - event.clientX) < 2 && Math.abs(this.startPt.y - event.clientY) < 2) {
            this.pickHelper.click(event, null);
            return true;
        } else {
			this.endPt.set(event.clientX, event.clientY);

			if (!this.updateFrustum(true, false)) {
				this.pickHelper.click(event);
				return true;
			}

			var state = CLOUD.OPSELECTIONTYPE.Clear;

			if (event.ctrlKey) {
				state = CLOUD.OPSELECTIONTYPE.Add;
			} else if (event.altKey) {
				state = CLOUD.OPSELECTIONTYPE.Remove;
			}

			CLOUD.PickUtil.pickByRect(this.scene, this.frustum, state, this.cameraControl.viewer.modelManager);

			this.pickHelper.lastPickedUserId = '';

			this.cameraControl.updateView(true);

			return true;
        }

    }

    return CLOUD.RectOpTool.prototype.processMouseUp(this, event);

};

CLOUD.RectPickTool.prototype.processTouchstart = function (event) {

    this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);
    return true;

};

CLOUD.RectPickTool.prototype.processTouchmove = function (event) {

    event.preventDefault();
    event.stopPropagation();

    return true;

};

CLOUD.RectPickTool.prototype.processTouchend = function (event) {
	return true;
};

CLOUD.ZoomEditor = function ( cameraControl ) {
	CLOUD.NormalEditor.call( this, CLOUD.EditorMode.ZOOM, cameraControl );
	this.mouseButtons = { ZOOM: THREE.MOUSE.LEFT, PAN2: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
};
CLOUD.ZoomEditor.prototype = Object.create( CLOUD.NormalEditor.prototype );
CLOUD.ZoomEditor.prototype.constructor = CLOUD.ZoomEditor;

/**
 * Edit tool for zooming scene to objects picked by mouse rectangle operation
 *
 */
CLOUD.RectZoomTool = function (viewer) {
    
    CLOUD.RectOpTool.call(this, CLOUD.EditToolMode.ZOOM_BY_RECT, viewer.cameraControl, viewer.modelManager);
	
	this.scene = viewer.getScene();
	
    this.activateZoom = false;
};

CLOUD.RectZoomTool.prototype = Object.create(CLOUD.RectOpTool.prototype);
CLOUD.RectZoomTool.prototype.constructor = CLOUD.RectZoomTool;

CLOUD.RectZoomTool.prototype.processMouseDown = function(event) {

	// Why do below setting?
    //event.preventDefault();
    //event.stopPropagation();

    if (event.button === THREE.MOUSE.LEFT) {

        this.startPt.set(event.clientX, event.clientY);
        this.activateZoom = true;
		
		return true;
    }

    return CLOUD.RectOpTool.prototype.processMouseDown.call(this, event);
};

CLOUD.RectZoomTool.prototype.processMouseMove = function(event) {

    //event.preventDefault();

    if (this.activateZoom) {

        this.endPt.set(event.clientX, event.clientY);
		
        this.updateFrustum(false, true);
		
        return true;
    }

    return CLOUD.RectOpTool.prototype.processMouseMove.call(this, event);
};

CLOUD.RectZoomTool.prototype.processMouseUp = function(event) {

    //event.preventDefault();
    //event.stopPropagation();
	
	if (this.activateZoom) {

		this.activateZoom = false;
        this.onUpdateUI({visible: false});

		this.endPt.set(event.clientX, event.clientY);

		if (this.updateFrustum(true, false)) {
			this.zoomToRectangle();
		}
			
		return true;
	}

    return CLOUD.RectOpTool.prototype.processMouseUp.call(this, event);
};

CLOUD.RectZoomTool.prototype.zoomToRectangle = function () {
    var camera = this.cameraControl.camera;
    var target = this.cameraControl.camera.target;
    var zNear = camera.near;

    var canvasBounds = this.cameraControl.getContainerDimensions();
    // var startX = this.startPt.x - canvasBounds.left;
    // var startY = this.startPt.y - canvasBounds.top;
    // var endX = this.endPt.x - canvasBounds.left;
    // var endY = this.endPt.y - canvasBounds.top;

    var startX = this.startPt.x;
    var startY = this.startPt.y;
    var endX = this.endPt.x;
    var endY = this.endPt.y;
    var rectWidth = Math.abs(endX - startX);
    var rectHeight = Math.abs(startY - endY);

    if (rectWidth === 0 || rectHeight === 0)  return;

    var rectCenter = new THREE.Vector2((startX + endX) / 2, (startY + endY) / 2);

    var eye = camera.position.clone();
    var dirEyeToTarget = target.clone().sub(eye);
    var distEyeToTarget = dirEyeToTarget.length();

    var dirZoom;

	var intersectContext = this.cameraControl.getIntersectContext(rectCenter);

    var pivot = this.cameraControl.intersector.hitTest(intersectContext);

    if (pivot) {

        var scaleFactor = rectWidth / rectHeight > canvasBounds.width / canvasBounds.height ? rectWidth / canvasBounds.width : rectHeight / canvasBounds.height;
        var distEyeToPivot = pivot.distanceTo(eye);
        var distZoom = distEyeToPivot * scaleFactor;

        dirEyeToTarget.normalize();
        //dirZoom = eye.clone().sub(pivot).normalize().multiplyScalar(zoomDist);
        dirZoom = dirEyeToTarget.clone().negate().multiplyScalar(distZoom);

    } else {

        var rcZoom = {};
        rcZoom.left = Math.min(startX, endX);
        rcZoom.top = Math.min(startY, endY);
        rcZoom.right = Math.max(startX, endX);
        rcZoom.bottom = Math.max(startY, endY);

        var closeDepth = this.scene.getNearDepthByRect(this.frustum, camera);

        if (closeDepth !== Infinity){

            var rCenter = new THREE.Vector3((startX + endX) / 2, (startY + endY) / 2, closeDepth);
            var rCorner = new THREE.Vector3(rcZoom.left, rcZoom.top, closeDepth);
            var wCenter = this.clientToWorld(rCenter);
            var wCorner = this.clientToWorld(rCorner);
            var distZoom = wCenter.clone().sub(wCorner).length();

            //if (distZoom < zNear) {
            //    //CLOUD.Logger.log("new dist", [newDist, near]);
            //    distZoom = zNear;
            //}

            pivot = wCenter.clone();
            dirEyeToTarget.normalize();
            dirZoom = dirEyeToTarget.clone().negate().multiplyScalar(distZoom);

        } else {

            return;
            /*
            // below code cannot work well. When near is small, the camera will be moved largely and cannot zoom back
            // see BIMFACEDM-1957
            var halfFrustumHeight = zNear * Math.tan(THREE.Math.degToRad(camera.fov * 0.5));
            var halfFrustumWidth = halfFrustumHeight * camera.aspect;
            var rightWidth = rectCenter.x * 2 * halfFrustumWidth / canvasBounds.width;
            var distCenterToRight = rightWidth - halfFrustumWidth;
            var upHeight = rectCenter.y * 2 * halfFrustumHeight / canvasBounds.height;
            var distCenterToUp = upHeight - halfFrustumHeight;
            var dirRight = this.cameraControl.getWorldRight();
            var dirUp = this.cameraControl.getWorldUp();

            dirRight.normalize().multiplyScalar(distCenterToRight);
            dirUp.multiplyScalar(distCenterToUp);

            var dirRay = dirEyeToTarget.clone().add(dirUp).add(dirRight);

            pivot = eye.clone().add(dirRay);

            var scaleFactor = rectWidth / rectHeight > canvasBounds.width / canvasBounds.height ? rectWidth / canvasBounds.width : rectHeight / canvasBounds.height;
            var distEyeToPivot = pivot.distanceTo(eye);
            var distZoom = distEyeToPivot * scaleFactor;

            dirEyeToTarget.normalize();
            //dirZoom = eye.clone().sub(pivot).normalize().multiplyScalar(zoomDist);
            dirZoom = dirEyeToTarget.clone().negate().multiplyScalar(distZoom);
            */
        }

    }

    eye = pivot.clone().add(dirZoom);
    camera.position.copy(eye);
    target.copy(eye).sub(dirZoom.clone().normalize().multiplyScalar(distEyeToTarget));
    this.cameraControl.updateView(true);
};


// TODO: 和Viewer里的方法同名，是否功能一样？
CLOUD.RectZoomTool.prototype.worldToClient = function (wPoint) {

    var camera = this.cameraControl.camera;
    var result = new THREE.Vector3(wPoint.x, wPoint.y, wPoint.z);

    result.project(camera);

    return result;
};

// TODO: 和Viewer里的方法同名，是否功能一样？
CLOUD.RectZoomTool.prototype.clientToWorld = function (cPoint) {

    var rect = this.cameraControl.getContainerDimensions();
    var camera = this.cameraControl.camera;
    var result = new THREE.Vector3();

    result.x = cPoint.x / rect.width * 2 - 1;
    result.y = -cPoint.y / rect.height * 2 + 1;
    result.z = cPoint.z;

    result.unproject(camera);

    return result;
};
CLOUD.PanEditor = function (cameraControl) {
    CLOUD.NormalEditor.call(this, CLOUD.EditorMode.PAN, cameraControl);
	this.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, PAN2: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
};

CLOUD.PanEditor.prototype = Object.create(CLOUD.NormalEditor.prototype);
CLOUD.PanEditor.prototype.constructor = CLOUD.PanEditor;

CLOUD.FlyEditor = function (cameraControl) {

    CLOUD.BaseEditor.call(this, CLOUD.EditorMode.FLY, cameraControl);

    this.lookSpeed = 0.001; // 相机观察速度

    this.constrainPitch = true; // 是否限制仰角
    // 仰角范围[-85, 175]
    this.pitchMin = THREE.Math.degToRad(5) - 0.5 * Math.PI; // 仰角最小值
    this.pitchMax = 0.5 * Math.PI - this.pitchMin; // 仰角最大值
    this.pitchDeltaTotal = 0;

    this.moveState = CLOUD.MoveDirection.NONE;

    // 保存旋转点
    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2(); // tmp variable

    this._panStart = new THREE.Vector2();
    this._panEnd = new THREE.Vector2();
    this._panDelta = new THREE.Vector2();
    this._pan = new THREE.Vector3();           // tmp
    this._worldDimension = new THREE.Vector2();

    // 鼠标位置
    this.lastMousePoint = new THREE.Vector2();

    this.isLockHeight = false;
    this.lockedHeight = 0;

    this.pickHelper = new CLOUD.PickHelper(cameraControl);
    this.intersectOfMouseDown = null;
};

CLOUD.FlyEditor.prototype = Object.create(CLOUD.BaseEditor.prototype);
CLOUD.FlyEditor.prototype.constructor = CLOUD.FlyEditor;

CLOUD.FlyEditor.prototype.destroy = function () {
    this.cameraControl = null;
    this.scene = null;
};

CLOUD.FlyEditor.prototype.processMouseDown = function (event) {

    event.preventDefault();
    event.stopPropagation();
	
	this.lastMousePoint.set(event.clientX, event.clientY);

    var cameraControl = this.cameraControl;

    this.intersectOfMouseDown = null;

    if (event.button === this.mouseButtons.ORBIT) {
        if (CLOUD.EditorConfig.NoRotate)
            return;

        // 设置旋转起点
        this.rotateStart.set(event.clientX, event.clientY);
        this.state = this.StateType.ROTATE;

        // Can we remove this event??? wun-c
        this.dispatchEvent({type: CLOUD.EVENTS.ON_EDITOR_BEGIN, name: "look", editor: this.name});

    } else if (event.button === this.mouseButtons.PAN || event.button === this.mouseButtons.PAN2) {

        if (CLOUD.EditorConfig.NoPan) {
            return;
        }

        //cameraControl.beginPan(event.clientX, event.clientY);
        this._panStart.set(event.clientX, event.clientY);

        // 根据当前鼠标点获得世界坐标系中的宽高
        this._worldDimension = cameraControl.getWorldDimension(event.clientX, event.clientY);

        this.intersectOfMouseDown = cameraControl.getLastIntersect();

        this.state = this.StateType.PAN;

        if (this.isLockHeight) {
            this.lockedHeight = event.clientY;
        }

    }
};

CLOUD.FlyEditor.prototype.doPan = function(clientX, clientY) {
    var cameraControl = this.cameraControl;

    this._panEnd.set(clientX, this.isLockHeight ? this.lockedHeight : clientY);
    this._panDelta.subVectors(this._panEnd, this._panStart);
    if (this._panDelta.x === 0 && this._panDelta.y === 0)
        return;

    //_scope.panOnWorld();
    //scope.pan( panDelta.x, panDelta.y );
    cameraControl.panOnWorld(this._panStart, this._panEnd, this._pan, this._worldDimension);
    //scope.pan( panDelta.x, panDelta.y );

    cameraControl.adjustCameraForPan(this._pan);

    this._panStart.copy(this._panEnd);

    cameraControl.update(true);
};

CLOUD.FlyEditor.prototype.processMouseMove = function (event) {
	
    var cameraControl = this.cameraControl;

    event.preventDefault();

    if ( this.state === this.StateType.ROTATE) {

        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        this.rotateStart.copy(this.rotateEnd);

        if (this.rotateDelta.x != 0 || this.rotateDelta.y != 0) {

            var deltaYaw = this.rotateDelta.x * this.lookSpeed;
            var deltaPitch = this.rotateDelta.y * this.lookSpeed;

            cameraControl.rotateForFly(deltaYaw, deltaPitch, this.pitchMin, this.pitchMax);
        }

    } else if (this.state === this.StateType.PAN) {

        this.doPan(event.clientX, event.clientY);

    }
};

CLOUD.FlyEditor.prototype.processMouseUp = function (event) {

    event.preventDefault();
    event.stopPropagation();	
	
	if (event.button === THREE.MOUSE.LEFT) {

        // check the location is not enough, also check time
        if ((this.lastMousePoint.x === event.clientX) && (this.lastMousePoint.y === event.clientY)) {
            this.pickHelper.click(event, this.intersectOfMouseDown);
            return;
        }

    }

    this.intersectOfMouseDown = null;

    var cameraControl = this.cameraControl;

    switch (this.state) {
        case this.StateType.ROTATE:
            // TODO: FIXME: not process the last rotation, only reset state
            //
            this.rotateDelta.set(0, 0);
            var deltaYaw = 0;
            var deltaPitch = 0;
            cameraControl.rotateForFly(deltaYaw, deltaPitch, this.pitchMin, this.pitchMax);
            // do we need this event? - wun-c
            this.dispatchEvent({type: CLOUD.EVENTS.ON_EDITOR_END, name: "look", editor: this.name});
            break;

        case this.StateType.PAN:

            this.doPan(event.clientX, event.clientY);

            break;

        default:
            break;
    }
    cameraControl.endOperation();

    this.state = this.StateType.NONE;
};

CLOUD.FlyEditor.prototype.processHover = function (event) {

    this.pickHelper.handleMouseHover(event);

};

// TODO: refactor this method. All there kinds of Editor have similar code
CLOUD.FlyEditor.prototype.processMouseWheel = function (event) {

    event.preventDefault();
    event.stopPropagation();

    var cameraControl = this.cameraControl;

    if ( CLOUD.EditorConfig.NoZoom) {
        return;
    }

    // 鼠标滚轮缩放

    // TODO: FIXME: should test in FireFox, the wheel code was fixed for OrbitEditor.js,
    //                but not fixed for FlyEditor and WalkEditor - wun-c

    //滚轮操作在浏览器中要考虑兼容性
    // 五大浏览器（IE、Opera、Safari、Firefox、Chrome）中Firefox 使用detail，其余四类使用wheelDelta；
    //两者只在取值上不一致，代表含义一致，detail与wheelDelta只各取两个值，detail只取±3，wheelDelta只取±120，其中正数表示为向上，负数表示向下。
    var delta = 0 || event.wheelDelta || event.detail;
    delta = Math.abs(delta) > 10 ? delta : -delta * 40;
    delta *= 0.0005;

    if (CLOUD.EditorConfig.ReverseWheelDirection) {
        delta *= -1;
    }

    this.cameraControl.delayHandle();

    // 以中心为基准缩放
    var rect = cameraControl.getContainerDimensions();
    var clientX = rect.left + 0.5 * rect.width;
    var clientY = rect.top + 0.5 * rect.height;

    cameraControl.zoom(delta, clientX, clientY);
};

CLOUD.FlyEditor.prototype.processKeyDown = function (event) {

    if (CLOUD.EditorConfig.NoKey)
        return;

    if (event.altKey) {
        return;
    }

    var enumMoveDirection = CLOUD.MoveDirection;

    var moveDirection = enumMoveDirection.NONE;
    switch (event.keyCode) {
        case CLOUD.Keys.ZERO: /* 0 - 恢复速度 */
            this.movementSpeed = this.defaultMovementSpeed;
            break;
        case CLOUD.Keys.PLUS: /* 等号&加号 - 加速*/
            this.movementSpeed *= 1.1;
            break;
        case CLOUD.Keys.SUB: /* 破折号&减号 - 减速*/
            this.movementSpeed *= 0.9;
            if (this.movementSpeed < this.minMovementSpeed) {
                this.movementSpeed = this.minMovementSpeed;
            }
            break;
        case CLOUD.Keys.UP: /*up - 前进*/
        case CLOUD.Keys.W: /*W - 前进*/
            moveDirection = enumMoveDirection.FORWARD;
            break;
        case CLOUD.Keys.DOWN: /*down - 后退 */
        case CLOUD.Keys.S: /*S - 后退*/
            moveDirection = enumMoveDirection.BACK;
            break;
        case CLOUD.Keys.LEFT: /*left - 左移 */
        case CLOUD.Keys.A: /*A - 左移*/
            moveDirection = enumMoveDirection.LEFT;
            break;
        case CLOUD.Keys.RIGHT: /*right - 右移*/
        case CLOUD.Keys.D: /*D - 右移*/
            moveDirection = enumMoveDirection.RIGHT;
            break;
        case CLOUD.Keys.Q: /*Q - 上移*/
            moveDirection = enumMoveDirection.UP;
            break;
        case CLOUD.Keys.E: /*E - 下移*/
            moveDirection = enumMoveDirection.DOWN;
            break;
        default:
            break;
    }

    if (moveDirection !== enumMoveDirection.NONE) {
        this.moveState |= moveDirection;
        this.dispatchEvent({
            type: CLOUD.EVENTS.ON_EDITOR_KEYDOWN,
            event: event,
            state: moveDirection,
            direction: enumMoveDirection,
            editor: this.name
        });

        this.cameraControl.delayHandle();

        this.cameraControl.updateFlyMove(this.moveState, this.movementSpeed * CLOUD.EditorConfig.MovementSpeedRate);
    }

};

CLOUD.FlyEditor.prototype.processKeyUp = function (event){

    if (CLOUD.EditorConfig.NoKey)
        return;

    var enumMoveDirection = CLOUD.MoveDirection;
    var moveDirection = enumMoveDirection.NONE;

    switch (event.keyCode) {
        case CLOUD.Keys.UP: /*up - 前进*/
        case CLOUD.Keys.W: /*W - 前进 */
            moveDirection = enumMoveDirection.FORWARD;
            break;
        case CLOUD.Keys.DOWN: /*down - 后退 */
        case CLOUD.Keys.S: /*S - 后退 */
            moveDirection = enumMoveDirection.BACK;
            break;
        case CLOUD.Keys.LEFT: /*left - 左移 */
        case CLOUD.Keys.A: /*A - 左移 */
            moveDirection = enumMoveDirection.LEFT;
            break;
        case CLOUD.Keys.RIGHT: /*right - 右移*/
        case CLOUD.Keys.D: /*D - 右移 */
            moveDirection = enumMoveDirection.RIGHT;
            break;
        case CLOUD.Keys.Q: /*Q - 上移 */
            moveDirection = enumMoveDirection.UP;
            break;
        case CLOUD.Keys.E: /*E - 下移 */
            moveDirection = enumMoveDirection.DOWN;
            break;
    }

    if (moveDirection !== enumMoveDirection.NONE) {

        this.dispatchEvent({
            type: CLOUD.EVENTS.ON_EDITOR_KEYUP,
            event: event,
            state: moveDirection,
            direction: enumMoveDirection,
            editor: this.name
        });
        this.moveState &= ~moveDirection
    }

};

CLOUD.FlyEditor.prototype.moveTo = function (direction) {

    this.cameraControl.updateFlyMove(direction, this.movementSpeed * CLOUD.EditorConfig.MovementSpeedRate);
};

CLOUD.WalkEditor = function (cameraControl) {

    CLOUD.BaseEditor.call(this, CLOUD.EditorMode.WALK, cameraControl);

    this.mouseButtons = {ORBIT: THREE.MOUSE.LEFT, PAN2: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT};

    this.pickHelper = new CLOUD.PickHelper(cameraControl);
    this.lastMousePoint = new THREE.Vector2();// 鼠标位置

    this._reqid = 0;
    this._animateBinded = this._animate.bind(this);
    this._clock = new THREE.Clock();

    this.moveState = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0,
        pitchUp: 0,
        pitchDown: 0,
        yawLeft: 0,
        yawRight: 0,
        rollLeft: 0,
        rollRight: 0
    };

    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);
    this.zoomDelta = 0;

    // 保存旋转点
    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2(); // tmp variable
    this.firstRotate = true;
    this.dragLook = true;

    this.isLockHeight = false;
    this.lockedHeight = 0;

    // remark: 还没有处理其它editor,先在这里设置移动速度, 统一处理后在BaseEditor设置
    this.defaultMovementSpeed = 1500; // 移动速度 1.5m
    this.movementSpeed = this.defaultMovementSpeed;    // can be changed
};

CLOUD.WalkEditor.prototype = Object.create(CLOUD.BaseEditor.prototype);
CLOUD.WalkEditor.prototype.constructor = CLOUD.WalkEditor;

CLOUD.WalkEditor.prototype._animate = function () {

    this._reqid = requestAnimationFrame(this._animateBinded);
    this.updateWalkMove();

};

CLOUD.WalkEditor.prototype._start = function () {

    this._animate();

};

CLOUD.WalkEditor.prototype._stop = function () {

    cancelAnimationFrame(this._reqid);

};

CLOUD.WalkEditor.prototype._updateMovement = function () {

    this.moveVector.x = ( -this.moveState.left + this.moveState.right );

    if (this.isLockHeight) {
        this.moveVector.y = 0;
    } else {
        this.moveVector.y = ( -this.moveState.down + this.moveState.up );
    }

    this.moveVector.z = ( -this.moveState.forward + this.moveState.back );

};

CLOUD.WalkEditor.prototype._updateRotation = function () {

    if (CLOUD.EditorConfig.LockAxisZ) {
        this.rotationVector.x = 0;
    } else {
        this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
    }

    this.rotationVector.y = ( -this.moveState.yawRight + this.moveState.yawLeft );
    this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

};

CLOUD.WalkEditor.prototype._doRotate = function (delta) {

    var container = this.cameraControl.getContainerDimensions();
    var halfWidth = container.width / 2;
    var halfHeight = container.height / 2;

    this.moveState.yawLeft = -delta.x / halfWidth;
    this.moveState.pitchDown = delta.y / halfHeight;

    this._updateRotation();

};

CLOUD.WalkEditor.prototype.destroy = function () {

    CLOUD.BaseEditor.prototype.destroy.call(this);

    this.rotateStart = null;
    this.rotateEnd = null;
    this.rotateDelta = null;

    this.pickHelper.destroy();
    this.pickHelper = null;
    this.lastMousePoint = null;

    this._clock = null;

};

CLOUD.WalkEditor.prototype.processMouseDown = function (event) {

    event.preventDefault();
    event.stopPropagation();

    this.lastMousePoint.set(event.clientX, event.clientY);
    this.firstRotate = false;

    if (event.button === this.mouseButtons.ORBIT) {

        if (CLOUD.EditorConfig.NoRotate) {
            return;
        }

        this.rotateStart.set(event.clientX, event.clientY);
        this.state = this.StateType.ROTATE;
        this.dispatchEvent({type: CLOUD.EVENTS.ON_EDITOR_BEGIN, name: "look", editor: this.name});

    }

};

CLOUD.WalkEditor.prototype.processMouseUp = function (event) {

    event.preventDefault();
    event.stopPropagation();

    if (event.button === THREE.MOUSE.LEFT) {

        if (Math.abs(this.lastMousePoint.x - event.clientX) < 2 && Math.abs(this.lastMousePoint.y - event.clientY) < 2) {
            this.state = this.StateType.NONE;
            this.pickHelper.click(event);
            return;
        }
    }

    if (this.state === this.StateType.ROTATE) {

        this.moveState.yawLeft = this.moveState.pitchDown = 0;
        this.dispatchEvent({type: CLOUD.EVENTS.ON_EDITOR_END, name: "look", editor: this.name});
    }

    this.state = this.StateType.NONE;

    return true;
};

CLOUD.WalkEditor.prototype.processMouseMove = function (event) {

    event.preventDefault();

    if (this.dragLook && this.state === this.StateType.ROTATE) {

        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        this.rotateStart.copy(this.rotateEnd);

        this._doRotate(this.rotateDelta);
    }


};

CLOUD.WalkEditor.prototype.processHover = function (event) {

    event.preventDefault();

    if (!this.dragLook) {

        // 鼠标直接移动来调整观察方向
        if (this.firstRotate) {

            this.firstRotate = false;
            this.rotateStart.set(event.clientX, event.clientY);
            // this.state = this.StateType.ROTATE;
        }

        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        this.rotateStart.copy(this.rotateEnd);

        this._doRotate(this.rotateDelta);
    }

};

// TODO: refactor this method. All there kinds of Editor have similar code
CLOUD.WalkEditor.prototype.processMouseWheel = function (event) {

    event.preventDefault();
    event.stopPropagation();

    if (CLOUD.EditorConfig.NoZoom) {
        return;
    }

    // 鼠标滚轮缩放

    // TODO: FIXME: should test in FireFox, the wheel code was fixed for OrbitEditor.js,
    //                but not fixed for FlyEditor and WalkEditor - wun-c

    //滚轮操作在浏览器中要考虑兼容性
    // 五大浏览器（IE、Opera、Safari、Firefox、Chrome）中Firefox 使用detail，其余四类使用wheelDelta；
    //两者只在取值上不一致，代表含义一致，detail与wheelDelta只各取两个值，detail只取±3，wheelDelta只取±120，其中正数表示为向上，负数表示向下。
    var delta = 0 || event.wheelDelta || event.detail;
    delta = Math.abs(delta) > 10 ? delta : -delta * 40;
    delta *= 0.0005;

    if (CLOUD.EditorConfig.ReverseWheelDirection) {
        delta *= -1;
    }

    this.zoomDelta = delta;
};


CLOUD.WalkEditor.prototype.processKeyDown = function (event) {

    if (CLOUD.EditorConfig.NoKey)
        return;

    if (event.altKey) {
        return;
    }

    var moveDirection = CLOUD.MoveDirection.NONE;
    var keys = CLOUD.Keys;

    switch (event.keyCode) {
        case keys.ZERO: /* 0 - 恢复速度 */
            this.movementSpeed = this.defaultMovementSpeed;
            break;
        case keys.PLUS: /* 等号&加号 - 加速*/
            this.movementSpeed *= 1.1;
            break;
        case keys.SUB: /* 破折号&减号 - 减速*/
            this.movementSpeed *= 0.9;
            if (this.movementSpeed < this.minMovementSpeed) {
                this.movementSpeed = this.minMovementSpeed;
            }
            break;
        case keys.UP: /*up - 前进*/
        case keys.W: /*W - 前进*/
            moveDirection = CLOUD.MoveDirection.FORWARD;
            this.moveState.forward = 1;
            break;
        case keys.DOWN: /*down - 后退 */
        case keys.S: /*S - 后退*/
            moveDirection = CLOUD.MoveDirection.BACK;
            this.moveState.back = 1;
            break;
        case keys.LEFT: /*left - 左移 */
        case keys.A: /*A - 左移*/
            moveDirection = CLOUD.MoveDirection.LEFT;
            this.moveState.left = 1;
            break;
        case keys.RIGHT: /*right - 右移*/
        case keys.D: /*D - 右移*/
            moveDirection = CLOUD.MoveDirection.RIGHT;
            this.moveState.right = 1;
            break;
        case keys.Q: /*Q - 上移*/
            moveDirection = CLOUD.MoveDirection.UP;
            this.moveState.up = 1;
            break;
        case keys.E: /*E - 下移*/
            moveDirection = CLOUD.MoveDirection.DOWN;
            this.moveState.down = 1;
            break;
        default:
            break;
    }

    this._updateMovement();
    this._updateRotation();

    if (moveDirection !== CLOUD.MoveDirection.NONE) {

        this.dispatchEvent({
            type: CLOUD.EVENTS.ON_EDITOR_KEYDOWN,
            event: event,
            direction: moveDirection,
            editor: this.name
        });
    }
};

CLOUD.WalkEditor.prototype.processKeyUp = function (event) {

    if (CLOUD.EditorConfig.NoKey)
        return;

    var moveDirection = CLOUD.MoveDirection.NONE;
    var keys = CLOUD.Keys;

    switch (event.keyCode) {
        case keys.UP: /*up - 前进*/
        case keys.W: /*W - 前进 */
            moveDirection = CLOUD.MoveDirection.FORWARD;
            this.moveState.forward = 0;
            break;
        case keys.DOWN: /*down - 后退 */
        case keys.S: /*S - 后退 */
            moveDirection = CLOUD.MoveDirection.BACK;
            this.moveState.back = 0;
            break;
        case keys.LEFT: /*left - 左移 */
        case keys.A: /*A - 左移 */
            moveDirection = CLOUD.MoveDirection.LEFT;
            this.moveState.left = 0;
            break;
        case keys.RIGHT: /*right - 右移*/
        case keys.D: /*D - 右移 */
            moveDirection = CLOUD.MoveDirection.RIGHT;
            this.moveState.right = 0;
            break;
        case keys.Q: /*Q - 上移 */
            moveDirection = CLOUD.MoveDirection.UP;
            this.moveState.up = 0;
            break;
        case keys.E: /*E - 下移 */
            moveDirection = CLOUD.MoveDirection.DOWN;
            this.moveState.down = 0;
            break;
    }

    this._updateMovement();
    this._updateRotation();

    if (moveDirection !== CLOUD.MoveDirection.NONE) {

        this.dispatchEvent({
            type: CLOUD.EVENTS.ON_EDITOR_KEYUP,
            event: event,
            direction: moveDirection,
            editor: this.name
        });
    }

};

// TODO: move me to CameraControl
CLOUD.WalkEditor.prototype.updateWalkMove = function () {

    if (this.moveVector.x === 0 && this.moveVector.y === 0 && this.moveVector.z === 0 &&
        this.rotationVector.x === 0 && this.rotationVector.y === 0 && this.rotationVector.z === 0 &&
        this.zoomDelta === 0) {
        return;
    }

    var timeDelta = this._clock.getDelta();
    var moveStep = this.movementSpeed * CLOUD.EditorConfig.MovementSpeedRate * timeDelta;
    var cameraControl = this.cameraControl;
    cameraControl.dirtyCamera(true);

    // zoom
    if (this.zoomDelta !== 0) {

        var factor = 1.0 + this.zoomDelta * timeDelta;
        cameraControl.zoomCameraForWalk(factor);
        this.zoomDelta = 0;
    }

    // 平移
    cameraControl.translateCameraForWalk(this.moveVector, moveStep);

    // 旋转
    if (this.dragLook) {
        cameraControl.rotateCameraForWalk(this.rotationVector, 1);
    } else {
        cameraControl.rotateCameraForWalk(this.rotationVector, 2);
    }

    // 刷新
    cameraControl.flyOnWorld();
};

/**
 * 进入行走模式相关处理
 *
 */
CLOUD.WalkEditor.prototype.onEnter = function () {

    var camera = this.cameraControl.getCamera();

    if (!camera.isPerspective) {
        console.log("Current camera is Orthographic");
        // NOTE: if we support customized camera which cannot be switched between
        //        perspective and orthographic freely, how to handle this situation - require design
        camera.toPerspective();
    }

    // 切换成平行视角
    this.cameraControl.walkWithParallelEye();

    this._start();
};

/**
 * 退出行走模式相关处理
 *
 */
CLOUD.WalkEditor.prototype.onExit = function () {

    this._stop();

};

/**
 * 朝指定方向移动
 *
 * @param {Number} direction 移动方向 {@link CLOUD.MoveDirection}
 */
CLOUD.WalkEditor.prototype.moveTo = function (direction) {

    this.moveState = direction;
    this.updateWalkMove();
    this.moveState = CLOUD.MoveDirection.NONE;

};

/**
 * 锁定行走高度
 *
 * @param {Boolean} lock - 是否锁定
 */
CLOUD.WalkEditor.prototype.setHeightLocked = function (lock) {

    if (this.isLockHeight !== lock) {
        this.isLockHeight = lock;
    }

};

/**
 * 鼠标拖拽行走观察
 *
 * @param {Boolean} drag - 是否拖拽
 */
CLOUD.WalkEditor.prototype.setDragLook = function (drag) {

    if (this.dragLook !== drag) {
        this.firstRotate = true;
        this.dragLook = drag;
    }

};


CLOUD.MeasureTool = function (viewer) {

	CLOUD.EditTool.call(this, CLOUD.EditToolMode.PICK_BY_MEASURE);

	this.pickHelper = new CLOUD.PickHelper(viewer.cameraControl);

    this.mouseDown = new THREE.Vector2();

};

CLOUD.MeasureTool.prototype = Object.create(CLOUD.EditTool.prototype);
CLOUD.MeasureTool.prototype.constructor = CLOUD.MeasureTool;

CLOUD.MeasureTool.prototype.processMouseDown = function (event) {

	event.preventDefault();

    if (event.button === THREE.MOUSE.LEFT) {
		
		this.mouseDown.x = event.clientX;
		this.mouseDown.y = event.clientY;

		return true;
		
	}
	else {

		return CLOUD.EditTool.prototype.processMouseDown.call(this, event);

	}

};

CLOUD.MeasureTool.prototype.processMouseUp = function (event) {

	event.preventDefault();

    if (event.button === THREE.MOUSE.LEFT) {
		
		if (this.mouseDown.x == event.clientX && this.mouseDown.y == event.clientY) {

			this.pickHelper.handleMouseMeasure(event, true);
			return true;

		}
		else {

			return CLOUD.EditTool.prototype.processMouseUp.call(this, event);

		}

	}
	else {

		return CLOUD.EditTool.prototype.processMouseUp.call(this, event);

	}

};

CLOUD.MeasureTool.prototype.processHover = function (event) {

	event.preventDefault();
	this.pickHelper.handleMouseMeasure(event, false);
	return true;
    
};

CLOUD.MeasureTool.prototype.onExit = function (event) {

	var scene = this.pickHelper.scene;
	if (scene.hasObjectGroup(CLOUD.ObjectGroupType.MEASUREPICKPLANE)) {
        scene.removeObjectGroupByName(CLOUD.ObjectGroupType.MEASUREPICKPLANE);
    }

};
CLOUD.ClipPlanesTool = function (viewer) {

    CLOUD.EditTool.call(this, CLOUD.EditToolMode.CLIP_BY_BOX);

    this.viewer = viewer;
	this.scene = viewer.getScene();
    this.enablePick = false;

    this.cameraControl = viewer.cameraControl;

    this.startPt = new THREE.Vector2();

    // clip planes
    var planes = [];
    for (var ii = 0; ii < 6; ++ii) {
        planes.push(new THREE.Plane());
    }

    var clipPlanes = this.scene.getClipPlanes();

    function projectPlanes(planes, camera) {
        
        var nPlanes = planes !== null ? planes.length : 0;
        var dstArray = null;

        var plane = new THREE.Plane();

        if ( nPlanes !== 0 ) {

            var flatSize = nPlanes * 4,
                viewMatrix = camera.matrixWorldInverse;
                
            var viewNormalMatrix = new THREE.Matrix3();

            viewNormalMatrix.getNormalMatrix( viewMatrix );

            if ( dstArray === null || dstArray.length < flatSize ) {

                dstArray = new Float32Array( flatSize );

            }

            for ( var i = 0, i4 = 0; i !== nPlanes; ++i, i4 += 4) {

                plane.copy( planes[ i ] ).
                        applyMatrix4( viewMatrix, viewNormalMatrix );

                plane.normal.toArray( dstArray, i4 );
                dstArray[ i4 + 3 ] = plane.constant;

            }

        }

        return dstArray;

    }

    clipPlanes.updateClippingParams = function (uniforms) {

        if (uniforms.iClipPlane.value == 0) {
            viewer.renderer.clippingPlanes = Object.freeze([]);
        }
        else {
            // to plane
            for (var ii = 0, len = uniforms.iClipPlane.value; ii < len; ++ii) {
                var v = uniforms.vClipPlane.value[ii];
                var plane = planes[ii];
                plane.setComponents(-v.x, -v.y, -v.z, -v.w);
                plane.normalize();
            }
            viewer.renderer.clippingPlanes = planes;
            
        }

        if (CLOUD.GlobalData.IBL) {
            var clipState = projectPlanes(planes, viewer.camera);
            viewer.modelManager.updateMaterialsValue('clippingPlanes', clipState);
        }

    };

    clipPlanes.init();

    this.selectIndex = null;

    this.planeDistance = 0;

    this.offsetSpeed = 0.02;

    // var scope = this;
    // this.pickHelper = new CLOUD.PickHelper(this.scene, this.cameraControl);

    this.toggle = function (enable, visible) {
        clipPlanes.enable(enable, visible);
    };

    this.visible = function (enable) {
        clipPlanes.visible = enable;
    };

    this.rotatable = function (enable) {
        clipPlanes.rotatable = enable;
    };

    this.store = function () {
        return clipPlanes.store();
    };

    this.restore = function (clipPlanesInfo) {
        clipPlanes.restore(clipPlanesInfo);
    };

    this.reset = function () {
        clipPlanes.reset();
    };

    this.pointToScreen = function (point) {

        var camera = this.cameraControl.camera;
        var viewProjMatrix = new THREE.Matrix4();
        viewProjMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

        var point4 = new THREE.Vector4(point.x, point.y, point.z, 1.0);
        point4.applyMatrix4(viewProjMatrix);

        var screen = new THREE.Vector2();
        screen.x = (point4.x / point4.w + 1.0) / 2;
        screen.y = 1 - (point4.y / point4.w + 1.0) / 2;

        var dim = this.cameraControl.getContainerDimensions();

        screen.x = screen.x * dim.width + dim.left;
        screen.y = screen.y * dim.height + dim.top;

        return screen;
    };

    this.getPlaneDistanceInScreen = function () {

        if (this.selectIndex == null) return null;

        if (this.selectIndex < 2) {
            var right = clipPlanes.center.clone();
            var left = clipPlanes.center.clone();

            right.x -= clipPlanes.cubeSize.x;
            left.x += clipPlanes.cubeSize.x;

            var rightScreen = this.pointToScreen(right);
            var leftScreen = this.pointToScreen(left);

            return rightScreen.x - leftScreen.x;
        }
        else {
            var top = clipPlanes.center.clone();
            var bottom = clipPlanes.center.clone();

            bottom.y -= clipPlanes.cubeSize.y;
            top.y += clipPlanes.cubeSize.y;

            var bottomScreen = this.pointToScreen(bottom);
            var topScreen = this.pointToScreen(top);

            return bottomScreen.y - topScreen.y;
        }
    };

    this.getPickPoint = function (cx, cy) {

        var camera = this.cameraControl.camera;
        var canvasContainer = this.cameraControl.getContainerDimensions();
        // 规范化开始点
        var canvasX = cx - canvasContainer.left;
        var canvasY = cy - canvasContainer.top;
        // 规范化到[-1, 1]
        var normalizedX = (canvasX / canvasContainer.width) * 2.0 - 1.0;
        var normalizedY = ((canvasContainer.height - canvasY) / canvasContainer.height) * 2.0 - 1.0;

        var raycaster = new CLOUD.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);

        var point = raycaster.ray.intersectPlane(this.plane);
        return point;
    };

    this.getSelectIndex = function () {
        return clipPlanes.selectIndex;
    };

    this._isVisible = function () {
        return clipPlanes.visible;
    };

    this.isRotate = function () {
        return clipPlanes.rotatable;
    };

    this.offset = function (offset) {
        var index = Math.floor(this.selectIndex / 2);
        if (this.selectIndex <= 3) {
            clipPlanes.offset(this.selectIndex, -offset * clipPlanes.cubeSize.getComponent(index) * 2);
        }
        else if (this.selectIndex % 2 == 1) {
            clipPlanes.offset(this.selectIndex, -offset * clipPlanes.cubeSize.getComponent(index) * 2);
        }
        else {
            clipPlanes.offset(this.selectIndex, offset * clipPlanes.cubeSize.getComponent(index) * 2);
        }
    };

    this.setSectionBox = function(min, max) {
        var bbox = new THREE.Box3(new THREE.Vector3(min.x, min.y, min.z), new THREE.Vector3(max.x, max.y, max.z));
        bbox.applyMatrix4(this.scene.getMatrixGlobal());
        clipPlanes.setSectionBox(bbox.min, bbox.max);
    };

    this.moveSectionPlane = function(planeName, offset) {
        clipPlanes.moveSectionPlane(planeName, offset);
    };

    this.rotateSectionBox = function(axis, offset) {
        clipPlanes.rotateSectionBox(axis, offset);
    };

    this.rotate = function (cx, cy) {
        if (this.selectIndex == 2 || this.selectIndex == 3) {
            clipPlanes.rotX(cy / 180 * Math.PI * 0.1);
        } else {
            clipPlanes.rotY(cx / 180 * Math.PI * 0.1);
        }
    };

    this.update = function (camera) {
        clipPlanes.update(camera);
    };

    this.cancelHighLight = function () {
        clipPlanes.cancelHighLight();
    };

    this.highLight = function () {
        clipPlanes.highLight();
    };
};

CLOUD.ClipPlanesTool.prototype = Object.create(CLOUD.EditTool.prototype);
CLOUD.ClipPlanesTool.prototype.constructor = CLOUD.ClipPlanesTool;

CLOUD.ClipPlanesTool.prototype.destroy = function () {
    this.cameraControl = null;
    this.intersectPoint = null;
    this.selectIndex = null;
    this.normal = null;
    this.plane = null;
    this.pickHelper = null;
    this.scene = null;
    this.viewer = null;
};

CLOUD.ClipPlanesTool.prototype.onExit = function () {
    this.toggle(false,false);
};

CLOUD.ClipPlanesTool.prototype.processMouseDown = function (event) {

    this.startPt.set(event.clientX, event.clientY);

    if (!this.enablePick && event.button === THREE.MOUSE.LEFT) {
        var ray = this.cameraControl.getRaycaster(event.clientX, event.clientY);
        var clipPlanes = this.scene.getClipPlanes();
        clipPlanes.hitTest(ray);

        //this.intersectPoint = this.cameraControl.getTrackingPoint(event.clientX, event.clientY);
        this.selectIndex = this.getSelectIndex();
        this.planeDistance = this.getPlaneDistanceInScreen();

        if (this.selectIndex != null) {
            this.highLight();
            this.cameraControl.needUpdateRenderList(true);
            this.cameraControl.update(true);

            this.enablePick = true;

            this.update();

            return true;
        }
    }

    return CLOUD.EditTool.prototype.processMouseDown(this, event);
};

CLOUD.ClipPlanesTool.prototype.processMouseUp = function (event) {

    if (this.enablePick && event.button === THREE.MOUSE.LEFT) {
        this.selectIndex = null;
        this.planeDistance = 0;

        this.cameraControl.needUpdateRenderList(true);
        this.cancelHighLight();
        this.cameraControl.update(true);

        this.update();

        this.enablePick = false;

        return true;
    }

    return CLOUD.EditTool.prototype.processMouseUp(this, event);
};


CLOUD.ClipPlanesTool.prototype.processMouseMove = function (event) {

    if (this.enablePick) {
        if (!this.isRotate()) {
            var delta = 0;
            if (this.selectIndex < 2) {
                delta = event.clientX - this.startPt.x;
            }
            else {
                delta = event.clientY - this.startPt.y;
            }

            this.offset(delta / this.planeDistance);
            this.startPt.set(event.clientX, event.clientY);
        } else {
            this.rotate(event.clientX - this.startPt.x, event.clientY - this.startPt.y);
            this.startPt.set(event.clientX, event.clientY);
        }
        this.cameraControl.update(true);
        this.update();

        return true;
    }

    return CLOUD.EditTool.prototype.processMouseMove(this, event);
};

CLOUD.ClipPlanesTool.prototype.processTouchstart = function (event) {

    this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);
    if (!this.enablePick) {
        var ray = this.cameraControl.getRaycaster(event.touches[0].clientX, event.touches[0].clientY);
        var clipPlanes = this.scene.getClipPlanes();
        clipPlanes.hitTest(ray);

        //this.cameraControl.getTrackingPoint(event.touches[0].clientX, event.touches[0].clientY);
        this.selectIndex = this.getSelectIndex();
        this.planeDistance = this.getPlaneDistanceInScreen();

        if (this.selectIndex != null) {
            this.highLight();
            this.cameraControl.needUpdateRenderList(true);
            this.cameraControl.update(true);

            this.update();
            return true;
        }
    }
    else {
        return CLOUD.EditTool.prototype.processTouchstart(this, event);
    }

};

CLOUD.ClipPlanesTool.prototype.processTouchmove = function (event) {

    if (this.selectIndex != null) {
        if (!this.isRotate()) {
            var delta = 0;
            if (this.selectIndex < 2) {
                delta = event.touches[0].clientX - this.startPt.x;
            }
            else {
                delta = event.touches[0].clientY - this.startPt.y;
            }

            this.offset(delta / this.planeDistance);
            this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);
        }
        else {
            this.rotate(event.touches[0].clientX - this.startPt.x, event.touches[0].clientY - this.startPt.y);
            this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);
        }
        this.cameraControl.update(true);

        this.update();

        return true;
    }
    else {
        return CLOUD.EditTool.prototype.processTouchmove(this, event);
    }

};

CLOUD.ClipPlanesTool.prototype.processTouchend = function (event) {

    this.selectIndex = null;
    this.planeDistance = 0;

    if (this.enablePick) {
        this.onUpdateUI({visible: false});

        if (this.startPt.x == event.touches[0].clientX && this.startPt.y == event.touches[0].clientY) {
            this.pickHelper.click(event);
        }
    }


    this.cameraControl.needUpdateRenderList(true);
    this.cancelHighLight();
    this.cameraControl.update(true);

    this.update();

    return CLOUD.EditTool.prototype.processTouchend(this, event);
    
};
CLOUD.FillClipPlaneTool = function (viewer) {

    CLOUD.EditTool.call(this, CLOUD.EditToolMode.CLIP_FILL);

    this.viewer = viewer;
	this.scene = viewer.getScene();
    this.enablePick = false;
    this.rotX = true;

    this.cameraControl = viewer.cameraControl;

    this.startPt = new THREE.Vector2();


    var fillClipPlane = this.scene.getFillClipPlane();
    fillClipPlane.updateClippingParams = function (uniforms) {
        if (uniforms.iClipPlane.value == 0) {
            viewer.renderer.clippingPlanes = Object.freeze([]);
        }
        else {
            var planes = [new THREE.Plane()];
            var v = uniforms.vClipPlane.value[0];
            var plane = planes[0];
            plane.setComponents(-v.x, -v.y, -v.z, -v.w);
            plane.normalize();

            viewer.renderer.clippingPlanes = planes;
        }
    };

    fillClipPlane.init();

    this.planeDistance = 0;

    this.offsetSpeed = 0.02;

    // var scope = this;
    // this.pickHelper = new CLOUD.PickHelper(this.scene, this.cameraControl);

    this.toggle = function (enable, visible) {
        fillClipPlane.enable(enable, visible);
        fillClipPlane.update();
    };

    this.visible = function (enable) {
        fillClipPlane.visible = enable;
        fillClipPlane.update();
    };

    this.rotatable = function (enable) {
        fillClipPlane.rotatable = enable;
        fillClipPlane.update();
    };

    this.hit = function () {
        return fillClipPlane.hit;
    };

    // this.store = function () {
    //     return clipPlanes.store();
    // };

    // this.restore = function (clipPlanesInfo) {
    //     clipPlanes.restore(clipPlanesInfo);
    // };

    // this.reset = function () {
    //     clipPlanes.reset();
    // };

    this.pointToScreen = function (point) {

        var camera = this.cameraControl.camera;
        var viewProjMatrix = new THREE.Matrix4();
        viewProjMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

        var point4 = new THREE.Vector4(point.x, point.y, point.z, 1.0);
        point4.applyMatrix4(viewProjMatrix);

        var screen = new THREE.Vector2();
        screen.x = (point4.x / point4.w + 1.0) / 2;
        screen.y = 1 - (point4.y / point4.w + 1.0) / 2;

        var dim = this.cameraControl.getContainerDimensions();

        screen.x = screen.x * dim.width + dim.left;
        screen.y = screen.y * dim.height + dim.top;

        return screen;
    };

    this.getPlaneDistanceInScreen = function () {

        if (this.selectIndex == null) return null;

        if (this.selectIndex < 2) {
            var right = clipPlanes.center.clone();
            var left = clipPlanes.center.clone();

            right.x -= clipPlanes.cubeSize.x;
            left.x += clipPlanes.cubeSize.x;

            var rightScreen = this.pointToScreen(right);
            var leftScreen = this.pointToScreen(left);

            return rightScreen.x - leftScreen.x;
        }
        else {
            var top = clipPlanes.center.clone();
            var bottom = clipPlanes.center.clone();

            bottom.y -= clipPlanes.cubeSize.y;
            top.y += clipPlanes.cubeSize.y;

            var bottomScreen = this.pointToScreen(bottom);
            var topScreen = this.pointToScreen(top);

            return bottomScreen.y - topScreen.y;
        }
    };

    this.getPickPoint = function (cx, cy) {

        var camera = this.cameraControl.camera;
        var canvasContainer = this.cameraControl.getContainerDimensions();
        // 规范化开始点
        var canvasX = cx - canvasContainer.left;
        var canvasY = cy - canvasContainer.top;
        // 规范化到[-1, 1]
        var normalizedX = (canvasX / canvasContainer.width) * 2.0 - 1.0;
        var normalizedY = ((canvasContainer.height - canvasY) / canvasContainer.height) * 2.0 - 1.0;

        var raycaster = new CLOUD.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);

        var point = raycaster.ray.intersectPlane(this.plane);
        return point;
    };

    this._isVisible = function () {
        return fillClipPlane.visible;
    };

    this.isRotate = function () {
        return fillClipPlane.rotatable;
    };

    this.offset = function (offset) {
        fillClipPlane.offset(offset);
    };

    //设置切面的偏移量，-250至250，默认为0
    this.setOffset = function (offset) {
        fillClipPlane.setOffset(offset);
    };

    this.rotate = function (cx, cy) {
        if (this.rotX) {
            fillClipPlane.rotX(cy / 180 * Math.PI * 0.1);
        } 
        else {
            fillClipPlane.rotY(cx / 180 * Math.PI * 0.1);
        }
    };

    //设置切面的法线方向，(0, 1, 2, 3, 4, 5)分别对应模型空间(X, -X, Y, -Y, Z, -Z)，默认值为3
    this.changeNormal = function(index) {
        fillClipPlane.changeNormal(index);
    };

    this.update = function (camera) {
        fillClipPlane.update(camera);
    };

    this.cancelHighLight = function () {
        fillClipPlane.cancelHighLight();
    };

    this.highLight = function () {
        fillClipPlane.highLight();
    };
};

CLOUD.FillClipPlaneTool.prototype = Object.create(CLOUD.EditTool.prototype);
CLOUD.FillClipPlaneTool.prototype.constructor = CLOUD.FillClipPlaneTool;

CLOUD.FillClipPlaneTool.prototype.destroy = function () {
    this.cameraControl = null;
    this.normal = null;
    this.plane = null;
    this.pickHelper = null;
    this.scene = null;
    this.viewer = null;
};

CLOUD.FillClipPlaneTool.prototype.onExit = function () {
    this.toggle(false,false);
};

CLOUD.FillClipPlaneTool.prototype.processMouseDown = function (event) {

    this.startPt.set(event.clientX, event.clientY);

    if (!this.enablePick && event.button === THREE.MOUSE.LEFT) {
        var ray = this.cameraControl.getRaycaster(event.clientX, event.clientY);
        var fillClipPlane = this.scene.getFillClipPlane();
        fillClipPlane.hitTest(ray);

        if (this.hit()) {
            this.highLight();
            this.cameraControl.needUpdateRenderList(true);
            this.cameraControl.update(true);

            return true;
        }
    }

    return CLOUD.EditTool.prototype.processMouseDown(this, event);
};

CLOUD.FillClipPlaneTool.prototype.processMouseUp = function (event) {
    
    this.planeDistance = 0;

    if (this.enablePick && event.button === THREE.MOUSE.LEFT) {

        if (this.startPt.x == event.clientX && this.startPt.y == event.clientY) {
            this.pickHelper.click(event);
        } else {
            var allowRectPick = event.shiftKey || event.ctrlKey || event.altKey;
            if (allowRectPick) {

                this.endPt.set(event.clientX, event.clientY);

                var state = CLOUD.OPSELECTIONTYPE.Clear;

                if (event.ctrlKey) {
                    state = CLOUD.OPSELECTIONTYPE.Add;
                } else if (event.altKey) {
                    state = CLOUD.OPSELECTIONTYPE.Remove;
                }

                var scope = this;
                this.scene.pickByRect(this.frustum, state, function () {
                    scope.pickHelper.notifySelectionChanged(null, 0, event);
                });
                this.cameraControl.updateView(true);

                return true;
            }
        }
    }

    this.cameraControl.needUpdateRenderList(true);
    this.cancelHighLight();
    this.cameraControl.update(true);

    return CLOUD.EditTool.prototype.processMouseUp(this, event);
};


CLOUD.FillClipPlaneTool.prototype.processMouseMove = function (event) {

    var allowRectPick = event.shiftKey || event.ctrlKey || event.altKey;
    if (allowRectPick && event.button === THREE.MOUSE.LEFT) {
        this.endPt.set(event.clientX, event.clientY);
        this.updateFrustum(true);
        return true;
    }

    if (event.button === THREE.MOUSE.LEFT && this.hit()) {
        if (!this.isRotate()) {
            var delta = 0;
            delta = event.clientX - this.startPt.x;
            this.offset(delta * 1);
            this.startPt.set(event.clientX, event.clientY);
        } else {
            this.rotate(event.clientX - this.startPt.x, event.clientY - this.startPt.y);
            this.startPt.set(event.clientX, event.clientY);
        }
        this.cameraControl.update(true);
    }

    return CLOUD.EditTool.prototype.processMouseUp(this, event);
};

CLOUD.FillClipPlaneTool.prototype.processTouchstart = function (event) {

    this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);
    if (!this.enablePick) {
        var ray = this.cameraControl.getRaycaster(event.touches[0].clientX, event.touches[0].clientY);
        var fillClipPlane = this.scene.getFillClipPlane();
        fillClipPlane.hitTest(ray);
    }

    if (this.hit()) {

        this.highLight();
        this.cameraControl.needUpdateRenderList(true);
        this.cameraControl.update(true);
        return true;

    }
    else {
        return CLOUD.EditTool.prototype.processTouchstart(this, event);
    }

};

CLOUD.FillClipPlaneTool.prototype.processTouchmove = function (event) {

    if (this.hit()) {

        if (!this.isRotate()) {

            var delta = 0;
            delta = event.touches[0].clientX - this.startPt.x;
            this.offset(delta * 1);
            this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);

        } 
        else {

            this.rotate(event.touches[0].clientX - this.startPt.x, event.touches[0].clientY - this.startPt.y);
            this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);

        }

        this.cameraControl.update(true);
        return true;

    }
    else {
        return CLOUD.EditTool.prototype.processTouchmove(this, event);
    }
    
};

CLOUD.FillClipPlaneTool.prototype.processTouchend = function (event) {

    if (this.enablePick) {

        this.onUpdateUI({visible: false});

        if (this.startPt.x == event.touches[0].clientX && this.startPt.y == event.touches[0].clientY) {
            this.pickHelper.click(event);
        }
        
    }

    this.cameraControl.needUpdateRenderList(true);
    this.cancelHighLight();
    this.cameraControl.update(true);

    return CLOUD.EditTool.prototype.processTouchmove(this, event);

};



CLOUD.EditorManager = function () {

    this.editor = null;
	// TODO: do we need to keep the editor list? To keep their state? But what state do we should keep?
    this.editors = {};
	// edit tools list
	this.tools = [];
	
	this.domElement = null;
	
	// TODO: only mouse operation is disabled if interactive state is false; Do we need to disable all
	//       kinds of operation, for example, key operation?
	this.enabled = true;  // 是否允许交互
    this.isUpdateRenderList = true; // 是否更新渲染列表

    this.movePad = null;

    var _mousePressed = false; // 鼠标是否按下，以便于判断现在鼠标是hover操作还是move操作
	
	var scope = this;

    function onMouseDown(event) {

        // 每次按下鼠标激活canvas
        setFocuse();

        _mousePressed = true;
        scope.isUpdateRenderList = false;

        scope.editor.processMouseDown(event);
    }

    function onMouseMove(event) {
        if(_mousePressed) {
            scope.isUpdateRenderList = false;
            scope.cameraChange = true;
            scope.editor.processMouseMove(event);
        }
        else {
            scope.editor.processHover(event);
        }
    }

    function onMouseUp(event) {

        // 只要存在up事件，允许更新渲染列表
        scope.isUpdateRenderList = true;
        // this.cameraChange = false;

        if (_mousePressed) {
            scope.editor.processMouseUp(event);
            _mousePressed = false;
        }
    }
	
	function onEvent(event) {
		if (!scope.enabled) {
			scope.cameraChange = false;
			return;
		}
		
		var tools = scope.tools;
		
		// handle the event by tools at first
		// the last enalbed tool has higher priority
		for (var i = tools.length - 1; i >= 0; i--) {
			if (tools[i].onEvent(event)) {
				// if the tool can handle the event, not process this event further
				return;
			}
		}			
		
		// if no tool process the event, let the editor process it
		switch(event.type) {
			case 'touchmove':
				scope.editor.processTouchmove(event);
				break;
			case 'touchstart':
				scope.editor.processTouchstart(event);
				break;
			case 'touchend':
				scope.editor.processTouchend(event);
			case 'keydown':
				scope.editor.processKeyDown(event);
				break;
			case 'keyup':
				scope.editor.processKeyUp(event);
				break;
			case 'mousewheel':
			case 'DOMMouseScroll':
				scope.cameraChange = true;
				scope.editor.processMouseWheel(event);
				break;
			case 'mousedown':
				onMouseDown(event);
				break;
			case 'mousemove':
				onMouseMove(event);
				break;
			case 'mouseup':
				onMouseUp(event);
				break;
			
			case 'dblclick':
				scope.editor.processMouseDoubleClick(event);
				break;
		}
	}

    function setFocuse() {
        // 设置焦点
        if (scope.domElement) {
            var canvas = scope.domElement.querySelector("#cloud-main-canvas");
            if (canvas && canvas.focus)
                canvas.focus();
        }
    }
	
    this.registerDomEventListeners = function (domElement) {
		
		this.domElement = domElement;

        domElement.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        }, false);
        domElement.addEventListener('mousedown', onEvent, false);
        domElement.addEventListener('mousewheel', onEvent, false);
        domElement.addEventListener('DOMMouseScroll', onEvent, false); // firefox
        domElement.addEventListener('dblclick', onEvent, false);

        // 注册在document上会影响dbgUI的resize事件
        window.addEventListener('mousemove', onEvent, false);
        window.addEventListener('mouseup', onEvent, false);

        domElement.addEventListener('touchstart', onEvent, false);
        domElement.addEventListener('touchend', onEvent, false);
        domElement.addEventListener('touchmove', onEvent, false);

        //window.addEventListener( 'keydown', onKeyDown, false );
        //window.addEventListener( 'keyup', onKeyUp, false );
        domElement.addEventListener('keydown', onEvent, false);
        domElement.addEventListener('keyup', onEvent, false);

        setFocuse();
    };

    this.unregisterDomEventListeners = function (domElement) {

        domElement.removeEventListener('contextmenu', function (event) {
            event.preventDefault();
        }, false);
        domElement.removeEventListener('mousedown', onEvent, false);
        domElement.removeEventListener('mousewheel', onEvent, false);
        domElement.removeEventListener('DOMMouseScroll', onEvent, false); // firefox
        domElement.removeEventListener('dblclick', onEvent, false);

        // 注册在document上会影响dbgUI的resize事件
        window.removeEventListener('mousemove', onEvent, false);
        window.removeEventListener('mouseup', onEvent, false);

        domElement.removeEventListener('touchstart', onEvent, false);
        domElement.removeEventListener('touchend', onEvent, false);
        domElement.removeEventListener('touchmove', onEvent, false);

        //window.removeEventListener( 'keydown', onKeyDown, false );
        //window.removeEventListener( 'keyup', onKeyUp, false );
        domElement.removeEventListener('keydown', onEvent, false);
        domElement.removeEventListener('keyup', onEvent, false);
    };

};


CLOUD.EditorManager.prototype = {

    constructor: CLOUD.EditorManager,

    destroy: function () {

        this.editor = null;

        for (var name in this.editors) {
            var editor = this.editors[name];
            editor.destroy();
        }

        this.editors = {};
        this.movePad = null;
		
    },

    getCurrentEditorName: function () {
        return this.editor ? this.editor.name : "";
    },

    _getEditorByName: function (viewer, name) {

        var editor = this.editors[name];

        if (editor) {
            return editor;
        }

        var editorMode = CLOUD.EditorMode;
        var cameraControl = viewer.cameraControl;
        var scene = viewer.getScene();
        var domElement = viewer.domElement;

        switch (name) {

            case editorMode.ORBIT:
                editor = new CLOUD.OrbitEditor(cameraControl);
                break;

            case editorMode.PICK:
                editor = new CLOUD.PickEditor(cameraControl);
                break;

            case editorMode.PAN:
                editor = new CLOUD.PanEditor(cameraControl);
                break;

            case editorMode.ZOOM:
                editor = new CLOUD.ZoomEditor(cameraControl);
                break;

            case editorMode.FLY:
                editor = new CLOUD.FlyEditor(cameraControl);
                break;

            case editorMode.WALK:
                editor = new CLOUD.WalkEditor(cameraControl);
                break;

            default:
                editor = null;
                console.error("invalid editor name");
                break;
        }

        if (editor) {
            editor.name = name;
            this.editors[name] = editor;
        }

        return editor;
    },

    getCurrentEditor: function () {

        return this.editor;
    },

    setEditorMode: function (viewer, name) {

        var editor = this._getEditorByName(viewer, name);

        if (editor) {

            if (this.editor !== editor) {

                if (this.editor !== null) {

                    this.editor.dispatchEvent({type: CLOUD.EVENTS.ON_EDITOR_EXIST, name: this.editor.getName()});
                    this.editor.onExit();
                }

                this.editor = editor;
                this.editor.onEnter();
                this.editor.dispatchEvent({type: CLOUD.EVENTS.ON_EDITOR_ENTER, name: this.editor.getName()});

            }

        }

    },

    getToolByName: function(toolName) {

        var length = this.tools.length;
        for (var i = 0; i < length; ++i) {

            if (this.tools[i].name == toolName)
                return this.tools[i];

        }

        return;

    },

    // enable edit tool by creating the tool and insert to tool array
    // if the tool has been enabled, do nothing
    //
	enableTool: function(viewer, toolName) {
		var toolMode = CLOUD.EditToolMode;
		var tools = this.tools;
		
		// check if the tool has been enable. if has been enabled, skip it
		for (var i = 0, len = tools.length; i < len; i++) {
			if (tools[i].name == toolName) {
				// TODO: report message that the tool has been enabled
				
				return;
			}
		}
		
		// create new tool
		var newTool = null;
		switch(toolName) {
            case toolMode.PICK_BY_RECT:
                newTool = new CLOUD.RectPickTool(viewer);
                break;

            case toolMode.ZOOM_BY_RECT:
                newTool = new CLOUD.RectZoomTool(viewer);
                break;
				
            case toolMode.CLIP_BY_BOX:
                newTool = new CLOUD.ClipPlanesTool(viewer);
                break;

            case toolMode.CLIP_FILL:
                newTool = new CLOUD.FillClipPlaneTool(viewer);
                break;

            case toolMode.PICK_BY_MEASURE:
                newTool = new CLOUD.MeasureTool(viewer);
                break;
		}
		
		// add it to tool list
		if (newTool) {
			tools.push(newTool);
		}
	},

    // disable tool by destroying it and remove from tool array
    //
	disableTool: function(toolName) {
		var tools = this.tools;
		
		// remove the tool from tool list
		for (var i = 0, len = tools.length; i < len; i++) {
			if (tools[i].name == toolName) {
			    tools[i].onExit(); // do some clean work
				tools.splice(i, 1);
				break;
			}
		}
		// TODO: give message if the tool is not enabled before
	},
	
	/** 
	 * set the global status if interactive operation is allowed
	 */
	setInteractiveState: function(state) {
		this.enabled = state;
	}
};
CLOUD.SelectPad = function (editor) {
    this.editor = editor;
    this.cameraControl = editor.cameraControl;
    this.dim = this.cameraControl.getContainerDimensions();

    this.pad = null;
    this.padSize = 96;

    this.startPt = new THREE.Vector2();
    this.position = new THREE.Vector2();

    this.callback = null;

    this.intersect = null;

    this.init = function () {
        window.addEventListener('resize', this.padInitBind, false);
        this.pad = document.createElement("div");

        this.padInit();

        var viewport = this.cameraControl.domElement;
        viewport.appendChild(this.pad);

        this.addEventListener();
    };

    this.addEventListener = function () {
        this.pad.addEventListener('touchstart', this.padOnTouchStartBind, false);
        this.pad.addEventListener('touchmove', this.padOnTouchMoveBind, false);
        this.pad.addEventListener('touchend', this.padOnTouchEndBind, false);
        //window.addEventListener('touchend', this.padOnTouchEndBind, false);
    };

    this.padInit = function () {
        if (this.pad != null) {
            this.pad.style.backgroundImage = "url(images/selectPad.png)";
            this.pad.style.backgroundSize = '100%';
            this.pad.style.position = 'absolute';
            this.pad.style.width = this.padSize.toString() + 'px';
            this.pad.style.height = this.padSize.toString() + 'px';
            this.pad.style.zIndex = '10';
            this.pad.style.display = 'none';
        }
    };

    this.showOverlay = function (position) {
        this.position = position;

        this.pad.style.left = this.position.x.toString() + 'px';
        this.pad.style.top = (this.position.y - this.dim.top).toString() + 'px';

        this.pad.style.display = '';

        this.pick();
    };

    this.hideOverlay = function () {
        this.pad.style.display = 'none';
    };

    this.pick = function () {
        var screenX = this.position.x;
        var screenY = this.position.y;

        var cameraControl = this.cameraControl;
        var pickHelper = this.editor.pickHelper;
        var sceneState = cameraControl.viewer.modelManager.sceneState;

        var scope = this;

        var screenPos = new THREE.Vector2(screenX, screenY);
        var intersectContext = cameraControl.getIntersectContext(screenPos);

        cameraControl.intersector.pick(intersectContext, function (intersect) {

            sceneState.clearSelection();
            
            if (!intersect) {
                
                cameraControl.updateView(true);
                scope.intersect = null;
                return;
            }

            var userId = intersect.userId;
            cameraControl.viewer.getScene().intersectToWorld(intersect);

            sceneState.addSelection([userId]);
            scope.intersect = intersect;

            cameraControl.updateView(true);
        });

        if (scope.intersect != null) {
            scope.intersect.cx = screenX;
            scope.intersect.cy = screenY;
        }
        
    };

    this.onTouchStart = function (event) {
        if (event.touches.length === 1) {
            event.stopPropagation();
            event.preventDefault();
            this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);
        }
    };

    this.onTouchMove = function (event) {
        if (event.touches.length === 1) {
            event.stopPropagation();
            event.preventDefault();

            var deltaX = event.touches[0].clientX - this.startPt.x;
            var deltaY = event.touches[0].clientY - this.startPt.y;

            this.position.x += deltaX;
            this.position.y += deltaY;

            this.pad.style.left = this.position.x.toString() + 'px';
            this.pad.style.top = (this.position.y - this.dim.top).toString() + 'px';

            this.startPt.set(event.touches[0].clientX, event.touches[0].clientY);

            this.pick(event);
        }
    };

    this.onTouchEnd = function (event) {
        event.stopPropagation();

        if (this.callback != null) {
            this.callback(this.intersect);
        }
        else {
            console.log("selectPad click", this.intersect);
        }
    };

    this.padInitBind = this.padInit.bind(this);

    this.padOnTouchStartBind = this.onTouchStart.bind(this);
    this.padOnTouchEndBind = this.onTouchEnd.bind(this);
    this.padOnTouchMoveBind = this.onTouchMove.bind(this);

    this.init();
};
CLOUD.Loader = CLOUD.Loader || {};

CLOUD.Loader.Url = function (serverUrl, databagId) {
    this.serverUrl = serverUrl;
    this.databagId = databagId;
};

CLOUD.Loader.Url.prototype.projectUrl = function () {
    return this.serverUrl +"config/"+ this.databagId + "/config.json";
};

CLOUD.Loader.Url.prototype.sceneUrl = function (idx) {
    idx = idx || 0;
    return this.serverUrl + this.databagId + "/scene/scene_" + idx + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.sceneIdUrl = function () {
    return this.serverUrl + this.databagId + "/scene/scene_id" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.userIdUrl = function () {
    return this.serverUrl + this.databagId + "/scene/user_id" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.octreeUrl = function (idx) {
    idx = idx || 'o';
    // octree index has not upgrade to binary yet
    // return this.serverUrl + this.databagId + "/scene/index_" + idx;
    return this.serverUrl +"file/" + this.databagId + "/scene/octree_" + idx;// + ".gz"     //liuw-d
    //return this.serverUrl +"file/" + this.databagId + "/scene/octree_" + idx + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.symbolUrl = function () {
    return this.serverUrl + this.databagId + "/symbol/symbol" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.mpkUrl = function (idx) {
    idx = idx || 0;
    return this.serverUrl + this.databagId + "/mpk/mpk_" + idx + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.meshIdUrl = function () {
    return this.serverUrl + this.databagId + "/mpk/mesh_id" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.materialUrl = function () {
    return this.serverUrl + this.databagId + "/material/material" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.materialIdUrl = function () {
    return this.serverUrl + this.databagId + "/material/material_id" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.userDataUrl = function () {
    return this.serverUrl + this.databagId + "/userdata/userdata" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.cameraUrl = function () {
    return this.serverUrl + this.databagId + "/scene/camera" + CLOUD.GlobalData.ZipResourcePostfix;
};

CLOUD.Loader.Url.prototype.textureUrl = function (textureId) {
    return this.serverUrl + this.databagId + "/texture/" + textureId;
};
/**
 * @author xiaoj-a@glodon.com
 **/

// Spatial hierarchy representation
CLOUD.Loader.OctreeNode = function (oId, depth) {

    if (oId === undefined) {
        alert("Invalid Octant Id");
    }

    this.octantId = oId;
    this.childOctants = new Array();
    this.min = null;
    this.max = null;
    this.depth = depth || 0;
    this.center = null;
    this.size = -1;   // square length of octant size
    // used in generate priority factor F = size / (sqDistanceToCamera * cosTheta)
    this.priority = -1;
    // the child division below its parent
    // refer to OctantNeighborUtil.js OctType about the value definition
    this.octType = -1;
};

CLOUD.Loader.OctreeNode.prototype.isRoot = function () {
    return this.depth == 0;
};

// CLOUD.Loader.OctreeNode.prototype.constructor = CLOUD.Loader.OctreeNode;

CLOUD.Loader.OctreeNode.prototype.add = function (octant) {
    octant.depth = this.depth + 1;
    this.childOctants.push(octant);
};

/*
CLOUD.Loader.OctreeNode.prototype.findRadiusNeighborOctants = function (queryPoint, radius, squareRadius, depth, neighborOctants) {

    var node;
    var intersects = false;

    if (queryPoint && this.depth < depth) {
        // does inner box intersect with octant
        intersects = !(queryPoint.x + radius < this.min.x || queryPoint.x - radius > this.max.x ||
        queryPoint.y + radius < this.min.y || queryPoint.y - radius > this.max.y ||
        queryPoint.z + radius < this.min.z || queryPoint.z - radius > this.max.z);
    }

    if (intersects === true) {

        var queryPointToOctant = new THREE.Vector3(0.5 * (this.max.x + this.min.x) - queryPoint.x,
            0.5 * (this.max.y + this.min.y) - queryPoint.y, 0.5 * (this.max.z + this.min.z) - queryPoint.z);
        var distance = queryPointToOctant.lengthSq();
        if (distance < squareRadius) {
            // gather octants
            neighborOctants.push(this);
        }

        // search subtree
        for (var i = 0, length = this.childOctants.length; i < length; ++i) {

            node = this.childOctants[i];
            node.findRadiusNeighborOctants(queryPoint, radius, squareRadius, depth, neighborOctants);
        }
    }
    //else {
    //	CLOUD.Logger.log("Octant" + this.octantId + "culled!")
    //}
};

CLOUD.Loader.OctreeNode.prototype.intersectRayDistance = function (origin, direction) {
    var Tmin, Tmax, TYmin, TYmax;
    // X Axis
    var invDirectionX = 1 / direction.x;
    if (direction.x >= 0) {
        Tmin = (this.min.x - origin.x) * invDirectionX;
        Tmax = (this.max.x - origin.x) * invDirectionX;
    } else {
        Tmin = (this.max.x - origin.x) * invDirectionX;
        Tmax = (this.min.x - origin.x) * invDirectionX;
    }

    // Y Axis
    var invDirectionY = 1 / direction.y;
    if (direction.y >= 0) {
        TYmin = (this.min.y - origin.y) * invDirectionY;
        TYmax = (this.max.y - origin.y) * invDirectionY;
    } else {
        TYmin = (this.max.y - origin.y) * invDirectionY;
        TYmax = (this.min.y - origin.y) * invDirectionY;
    }

    if ((Tmin > TYmax) || (TYmin > Tmax)) {
        //no intersection
        return Infinity;
    }
    if (TYmin > Tmin) {
        Tmin = TYmin;
    }
    if (TYmax < Tmax) {
        Tmax = TYmax;
    }

    // Z Axis
    var TZmin, TZmax;
    var invDirectionZ = 1 / direction.z;
    if (direction.z >= 0) {
        TZmin = (this.min.z - origin.z) * invDirectionZ;
        TZmax = (this.max.z - origin.z) * invDirectionZ;
    } else {
        TZmin = (this.max.z - origin.z) * invDirectionZ;
        TZmaz = (this.min.z - origin.z) * invDirectionZ;
    }
    if ((Tmin > TZmax) || (TZmin > Tmax)) {
        // no intersection
        return Infinity;
    }
    if (TZmin > Tmin) {
        Tmin = TZmin;
    }
    if (TZmax < Tmax) {
        Tmax = TZmax;
    }
    // return nearest intersection distance
    return Tmin;
};
*/
CLOUD.Loader.OctreeNode.prototype.updateMaxDepth = function () {

    if (this.depth > CLOUD.GlobalData.MaximumDepth) {
        CLOUD.GlobalData.MaximumDepth = this.depth;
    }

};
/**
 * @author muwj 2016/12/15
 */

CLOUD.Loader.IdReader = function( buffer ) {

    var header = new Uint32Array( buffer, 0, 2 );
    this.size  = header[0];
    this.count = header[1];

    this.cache = {};
    this.idBuffer = buffer.slice( 4 * 2 );
    header = null;
};

CLOUD.Loader.IdReader.prototype = {

    constructor: CLOUD.Loader.IdReader,

    getSize: function () {

        return this.size;
    },

    getCount: function () {

        return this.count;
    },

    getString: function ( index_id ) {

        if (this.cache[index_id] !== undefined) {
            return this.cache[index_id];
        }

        if( index_id >= 0 && index_id < this.count ) {

            var buf = new Uint8Array( this.idBuffer, this.size * index_id, this.size );
            var id_string = String.fromCharCode.apply( null, buf );
            var idx = id_string.indexOf('\0');

            if (idx !== -1) {
                this.cache[index_id] = id_string.substring( 0, idx );
            } else {
                this.cache[index_id] = id_string;
            }

            // this.cache[index_id] = id_string.substring( 0, id_string.indexOf('\0') );
            // return String.fromCharCode.apply( null, buf );

            return this.cache[index_id];
        }
        return undefined;
    },

    getIndex: function ( string_id ) {

        if( string_id == undefined )
            return -1;

        var left = 0;
        var right = this.count - 1;
        var length = string_id.length;

        while( left <= right )
        {
            var mid = Math.floor( ( left + right ) / 2 );
            var buf = new Uint8Array( this.idBuffer, this.size * mid, length );
            var str = String.fromCharCode.apply( null, buf );
            var idx = str.indexOf('\0');
            //var rt = string_id.localeCompare( str.substring( 0, str.indexOf('\0') ) );

            var rt = 0;

            if (idx !== -1) {
                rt = string_id.localeCompare( str.substring( 0, idx ) );
            } else {
                rt = string_id.localeCompare( str );
            }

            if( rt == 0 )
                return mid;
            else if( rt < 0 )
                right = mid - 1;
            else if( rt > 0 )
                left = mid + 1;
        }
        return -1;
    }
};
/**
 * @author muwj 2016/12/15
 */

CLOUD.Loader.UserDataReader = function( text ) {

    this.userData = JSON.parse( text );
    this.count = 0;
    for( var key in this.userData ) {
        if( this.userData.hasOwnProperty( key ) ) {
            this.count++;
        }
    }

    this.getCount = function () {

        return this.count;
    };

    this.getData = function () {

        return this.userData;
    };

    this.getUserData = function ( index_id ) {

        if( index_id >= 0 && index_id < this.count ) {

            return this.userData[index_id + ''];
        }
        return undefined;
    }
};
/**
 * @author muwj 2017/01/25
 */

CLOUD.Loader.OctNode = function ( buffer, offset ) {

    var data_i = new Uint32Array( buffer, offset, 5 );
    this.cell_id = data_i[0];
    this.child_s = data_i[3];
    this.child_e = data_i[4];

    var data_f = new Float32Array( buffer, offset + 5 * 4, 6 );
    this.boundingBox = new THREE.Box3(
        new THREE.Vector3( data_f[0], data_f[1], data_f[2] ),
        new THREE.Vector3( data_f[3], data_f[4], data_f[5] ) );
};

CLOUD.Loader.OctreeReader = function ( buffer ) {

    var data_i = new Uint32Array( buffer, 0, 1 );
    this.count = data_i[0];
    this.data = new Array( this.count );

    for ( var i = 0; i < this.count; ++i )
    {
        this.data[i] = new CLOUD.Loader.OctNode( buffer, ( 1 + i * 11 ) * 4 );
    }
};

CLOUD.Loader.OctreeReader.prototype = {

    constructor: CLOUD.Loader.OctreeReader,

    getCount: function () {

        return this.count;
    },

    getNode: function ( idx ) {

        if ( idx >= 0 && idx < this.count ) {

            return this.data[idx];
        }
    }
};
/**
 * @author muwj 2016/12/15
 */

CLOUD.Loader.Material = function( buffer, offset ) {

    var data_i = new Uint32Array( buffer, offset, 8 );

    this.id        = data_i[0];
    this.type      = data_i[1];
    this.metal     = data_i[2];
    this.color     = data_i[3];
    this.emissive  = data_i[4];
    this.specular  = data_i[5];
    this.side      = data_i[6];
    this.texture_n = data_i[7];

    this.texture_id = new Uint32Array( buffer, offset + 4 * 8, 8 );

    var data_f = new Float32Array( buffer, offset + 4 * 16, 3 );
    this.shininess    = data_f[0];
    this.opacity      = data_f[1];
    this.reflectivity = data_f[2];

    data_i = null;
    data_f = null;
};

CLOUD.Loader.Texture = function( buffer, offset ) {

    var data_i = new Uint32Array( buffer, offset, 4 );

    this.id       = data_i[0];
    this.type     = data_i[1];
    this.repeat_u = data_i[2];
    this.repeat_v = data_i[3];

    var data_f = new Float32Array( buffer, offset + 4 * 4, 5 );
    this.angle    = data_f[0];
    this.offset_u = data_f[1];
    this.offset_v = data_f[2];
    this.scale_u  = data_f[3];
    this.scale_v  = data_f[4];

    var data_c = new Uint8Array( buffer, offset + 4 * 9, 8 );
    var ext_name = String.fromCharCode.apply( null, data_c );
    this.file_name_ext = ext_name.substring( 0, ext_name.indexOf('\0') );

    data_i = null;
    data_f = null;
    data_c = null;
};

CLOUD.Loader.MaterialReader = function( buffer ) {

    var header = new Uint32Array( buffer, 0, 4 );

    this.materialCount  = header[0];
    this.materialOffset = header[1];
    this.textureCount   = header[2];
    this.textureOffset  = header[3];

    this.materialSize = 4 * 19;
    this.textureSize  = 4 * 9 + 8;
    this.materialBuffer = buffer.slice( this.materialOffset, this.materialOffset + this.materialCount * this.materialSize );
    this.textureBuffer  = buffer.slice( this.textureOffset,  this.textureOffset  + this.textureCount  * this.textureSize );

    // for data reading
    this.material_id = -1;
    this.texture_id  = -1;
    var tmp_buffer = new ArrayBuffer( this.materialSize );
    this.material_cur = new CLOUD.Loader.Material( tmp_buffer, 0 );
    this.texture_cur  = new CLOUD.Loader.Texture ( tmp_buffer, 0 );

    header = null;
    tmp_buffer = null;
};

CLOUD.Loader.MaterialReader.prototype = {

    constructor: CLOUD.Loader.MaterialReader,

    getMaterial: function( id ) {

        if( id >= 0 && id < this.materialCount ) {
            return new CLOUD.Loader.Material( this.materialBuffer, id * this.materialSize )
        }
    },

    getTexture: function( id ) {

        if( id >= 0 && id < this.textureCount ) {
            return new CLOUD.Loader.Texture( this.textureBuffer, id * this.textureSize )
        }
    },

    getMaterialInfo: function( id ) {

        if( id == this.material_id ) {
            return this.material_cur;
        }

        if( id >= 0 && id < this.materialCount ) {

            var data_i = new Uint32Array( this.materialBuffer, id * this.materialSize, 8 );
            this.material_cur.id        = data_i[0];
            this.material_cur.type      = data_i[1];
            this.material_cur.metal     = data_i[2];
            this.material_cur.color     = data_i[3];
            this.material_cur.emissive  = data_i[4];
            this.material_cur.specular  = data_i[5];
            this.material_cur.side      = data_i[6];
            this.material_cur.texture_n = data_i[7];

            this.material_cur.texture_id = new Uint32Array( this.materialBuffer, id * this.materialSize + 4 * 8, 8 );

            var data_f = new Float32Array( this.materialBuffer, id * this.materialSize + 4 * 16, 3 );
            this.material_cur.shininess    = data_f[0];
            this.material_cur.opacity      = data_f[1];
            this.material_cur.reflectivity = data_f[2];

            data_i = null;
            data_f = null;
            this.material_id = id;
            return this.material_cur;
        }
    },

    getTextureInfo: function( id ) {

        if( id == this.texture_id ) {
            return this.texture_cur;
        }

        if( id >= 0 && id < this.textureCount ) {

            var data_i = new Uint32Array( this.textureBuffer, id * this.textureSize, 4 );
            this.texture_cur.id       = data_i[0];
            this.texture_cur.type     = data_i[1];
            this.texture_cur.repeat_u = data_i[2];
            this.texture_cur.repeat_v = data_i[3];

            var data_f = new Float32Array( this.textureBuffer, id * this.textureSize + 4 * 4, 5 );
            this.texture_cur.angle    = data_f[0];
            this.texture_cur.offset_u = data_f[1];
            this.texture_cur.offset_v = data_f[2];
            this.texture_cur.scale_u  = data_f[3];
            this.texture_cur.scale_v  = data_f[4];

            var data_c = new Uint8Array( this.textureBuffer, id * this.textureSize + 4 * 9, 8 );
            var ext_name = String.fromCharCode.apply( null, data_c );
            this.texture_cur.file_name_ext = ext_name.substring( 0, ext_name.indexOf('\0') );

            data_i = null;
            data_f = null;
            data_c = null;
            this.texture_id = id;
            return this.texture_cur;
        }
    }
};
/**
 * @author muwj 2016/12/29
 */

CLOUD.Loader.SymbolHeader = function ( buffer ) {

    var header = new Uint32Array( buffer, 0, 9 );

    this.blockId        = header[0];
    this.symbolCount    = header[1];
    this.itemCount      = header[2];
    this.matrixCount    = header[3];
    this.geomBuffSize   = header[4];
    this.symbolOffset   = header[5];
    this.itemOffset     = header[6];
    this.matrixOffset   = header[7];
    this.geomOffset     = header[8];

    var bbox = new Float32Array( buffer, 4 * 9, 6 );
    this.boundingBox = new THREE.Box3(
        new THREE.Vector3( bbox[0], bbox[1], bbox[2] ),
        new THREE.Vector3( bbox[3], bbox[4], bbox[5] ) );

    header = null;
    bbox = null;
};

CLOUD.Loader.Symbol = function ( buffer, offset ) {

    var item_i = new Int32Array( buffer, offset, 3 );

    this.symbolId  = item_i[0];
    this.itemIndex = item_i[1];
    this.itemCount = item_i[2];

    var bbox = new Float32Array( buffer, offset + 4 * 3, 6 );
    this.boundingBox = new THREE.Box3(
        new THREE.Vector3( bbox[0], bbox[1], bbox[2] ),
        new THREE.Vector3( bbox[3], bbox[4], bbox[5] ) );

    item_i = null;
    bbox = null;
};

CLOUD.Loader.SymbolReader = function ( buffer ) {

    this.header = new CLOUD.Loader.SymbolHeader( buffer );

    this.symbolSize   = 4 * 9;
    this.itemSize     = 4 * 13;
    this.matrixSize   = 4 * 16;
    this.geomSize     = 4 * 8;
    this.maxSize      = 4 * 64;

    this.symbolBuffer = buffer.slice( this.header.symbolOffset, this.header.symbolOffset + this.header.symbolCount * this.symbolSize );
    this.itemBuffer   = buffer.slice( this.header.itemOffset,   this.header.itemOffset   + this.header.itemCount   * this.itemSize );
    this.matrixBuffer = buffer.slice( this.header.matrixOffset, this.header.matrixOffset + this.header.matrixCount * this.matrixSize );
    this.geomBuffer   = buffer.slice( this.header.geomOffset,   this.header.geomOffset   + this.header.geomBuffSize );

    // for data reading
    this.matr_cur_id = -1;

    this.pt_symb_min = new THREE.Vector3( 0.0, 0.0, 0.0 );
    this.pt_symb_max = new THREE.Vector3( 0.0, 0.0, 0.0 );
    this.pt_item_min = new THREE.Vector3( 0.0, 0.0, 0.0 );
    this.pt_item_max = new THREE.Vector3( 0.0, 0.0, 0.0 );

    var tmp_buffer = new ArrayBuffer( this.maxSize );
    this.symb_cur = new CLOUD.Loader.Symbol( tmp_buffer, 0 );
    this.item_cur = new CLOUD.Loader.Item( tmp_buffer, 0 );
    this.matr_cur = new CLOUD.Loader.Matrix( tmp_buffer, 0 );
    this.pipe_cur = new CLOUD.Loader.GeomPipe( tmp_buffer, 0 );

    this.symb_cur.boundingBox.set( this.pt_symb_min, this.pt_symb_max );
    this.item_cur.boundingBox.set( this.pt_item_min, this.pt_item_max );
};

CLOUD.Loader.SymbolReader.prototype = {

    constructor: CLOUD.Loader.SymbolReader,

    getSymbol: function ( index ) {

        if ( index >= 0 && index < this.header.symbolCount ) {
            return new CLOUD.Loader.Symbol( this.symbolBuffer, index * this.symbolSize );
        }
    },

    getItem: function ( index ) {

        if ( index >= 0 && index < this.header.itemCount ) {
            return new CLOUD.Loader.Item( this.itemBuffer, index * this.itemSize );
        }
    },

    getMatrix: function ( index ) {

        if ( index >= 0 && index < this.header.matrixCount ) {
            return new CLOUD.Loader.Matrix( this.matrixBuffer, index * this.matrixSize );
        }
    },

    getGeomPipe: function ( offset ) {

        if ( offset >= 0 && index < this.header.geomBuffSize ) {
            return new CLOUD.Loader.GeomPipe( this.geomBuffer, offset );
        }
    },

    getSymbolInfo: function ( index ) {

        if ( index >= 0 && index < this.header.symbolCount ) {

            var item_i = new Int32Array( this.symbolBuffer, index * this.symbolSize, 3 );
            this.symb_cur.symbolId  = item_i[0];
            this.symb_cur.itemIndex = item_i[1];
            this.symb_cur.itemCount = item_i[2];

            var data_f = new Float32Array( this.symbolBuffer, index * this.symbolSize + 4 * 3, 6 );
            this.pt_symb_min.set( data_f[0], data_f[1], data_f[2] );
            this.pt_symb_max.set( data_f[3], data_f[4], data_f[5] );
            this.symb_cur.boundingBox.set( this.pt_symb_min, this.pt_symb_max );

            return this.symb_cur;
        }
    },

    getItemInfo: function ( index ) {

        if ( index >= 0 && index < this.header.itemCount ) {

            var data_i = new Int32Array( this.itemBuffer, index * this.itemSize, 7 );
            this.item_cur.ItemId     = data_i[0];
            this.item_cur.originalId = data_i[1];
            this.item_cur.materialId = data_i[2];
            this.item_cur.userDataId = data_i[3];
            this.item_cur.matrixId   = data_i[4];
            this.item_cur.type       = data_i[5];
            this.item_cur.toData     = data_i[6];

            var data_f = new Float32Array( this.itemBuffer, index * this.itemSize + 4 * 7, 6 );
            this.pt_item_min.set( data_f[0], data_f[1], data_f[2] );
            this.pt_item_max.set( data_f[3], data_f[4], data_f[5] );
            this.item_cur.boundingBox.set( this.pt_item_min, this.pt_item_max );

            return this.item_cur;
        }
    },

    getMatrixInfo: function ( index ) {

        if ( index == this.matr_cur_id ) {
            return this.matr_cur;
        }

        if ( index >= 0 && index < this.header.matrixCount ) {

            var data = new Float32Array( this.matrixBuffer, index * this.matrixSize, 4 * 4 );
            this.matr_cur.matrix.fromArray( data );

            this.matr_cur_id = index;
            return this.matr_cur;
        }
    },

    getGeomPipeInfo: function ( offset ) {

        if ( offset >= 0 && offset < this.header.geomBuffSize ) {

            var data = new Float32Array( this.geomBuffer, offset, 8 );

            this.pipe_cur.startPt.set( data[0], data[1], data[2] );
            this.pipe_cur.endPt.  set( data[3], data[4], data[5] );
            this.pipe_cur.radius    = data[6];
            this.pipe_cur.thickness = data[7];

            return this.pipe_cur;
        }
    },

    getMpkID: function ( mesh_id ) {

        return parseInt( mesh_id / 65536 );
    },

    getMeshIndex: function ( mesh_id ) {

        return parseInt( mesh_id % 65536 );
    }
};
/**
 * @author muwj 2016/12/15
 */

CLOUD.Loader.MPKHeader = function (buffer) {

    var header = new Uint32Array( buffer, 0, 6 );

    this.blockId      = header[0];
    this.vtFormat     = header[1];
    this.meshCount    = header[2];
    this.meshOffset   = header[3];
    this.bufferSize   = header[4];
    this.bufferOffset = header[5];

    header = null;
};

CLOUD.Loader.MeshData = function (buffer, offset) {

    var mesh_info = new Uint32Array( buffer, offset, 5 );

    this.mesh_id      = mesh_info[0];
    this.ptCount      = mesh_info[1];
    this.idxCount     = mesh_info[2];
    this.dataOffset   = mesh_info[3];
    this.vertexFormat = mesh_info[4];

    var base_info = new Float32Array( buffer, offset + 4 * 5, 4 );

    this.baseScale = base_info[0];
    this.baseX = base_info[1];
    this.baseY = base_info[2];
    this.baseZ = base_info[3];

    mesh_info = null;
    base_info = null;
};

CLOUD.Loader.MPKReader = function (buffer) {

    this.header = new CLOUD.Loader.MPKHeader(buffer);

    this.meshSize = 4 * 9;
    this.maxSize  = 4 * 64;
    this.meshBuffer = buffer.slice( this.header.meshOffset,   this.header.meshOffset   + this.header.meshCount * this.meshSize );
    this.geomBuffer = buffer.slice( this.header.bufferOffset, this.header.bufferOffset + this.header.bufferSize );

    // for data reading
    this.mesh_cur_id = -1;
    var tmp_buffer = new ArrayBuffer( this.maxSize );
    this.mesh_cur = new CLOUD.Loader.MeshData( tmp_buffer, 0 );
};

CLOUD.Loader.MPKReader.prototype = {

    constructor: CLOUD.Loader.MPKReader,

    getMeshData: function( index ) {

        if( index >= 0 && index < this.header.meshCount ) {

            return new CLOUD.Loader.MeshData( this.meshBuffer, index * this.meshSize );
        }
    },

    getMeshInfo: function( index ) {

        if( index == this.mesh_cur_id ) {
            return this.mesh_cur;
        }

        if( index >= 0 && index < this.header.meshCount ) {

            var data_i = new Uint32Array( this.meshBuffer, index * this.meshSize, 5 );
            this.mesh_cur.mesh_id      = data_i[0];
            this.mesh_cur.ptCount      = data_i[1];
            this.mesh_cur.idxCount     = data_i[2];
            this.mesh_cur.dataOffset   = data_i[3];
            this.mesh_cur.vertexFormat = data_i[4];

            var data_f = new Float32Array( this.meshBuffer, index * this.meshSize + 4 * 5, 4 );
            this.mesh_cur.baseScale = data_f[0];

            //this.mesh_cur.baseVector.set(data_f[1], data_f[2], data_f[3]);
            this.mesh_cur.baseX = data_f[1];
            this.mesh_cur.baseY = data_f[2];
            this.mesh_cur.baseZ = data_f[3];

            this.mesh_cur_id = index;
            return this.mesh_cur;
        }
    },

    getPtBuffer: function( index ) {

        if( index >= 0 && index < this.header.meshCount ) {

            var mesh = this.getMeshInfo( index );
            if( mesh === undefined ) {
                return undefined;
            }

            if( mesh.baseScale == 0.0 ) {
                return new Float32Array( this.geomBuffer, mesh.dataOffset, mesh.ptCount * 3 );
            }
            else {
                return new Uint16Array( this.geomBuffer, mesh.dataOffset, mesh.ptCount * 3 );
            }
        }
    },

    getIdxBuffer: function ( index ) {

        if( index >= 0 && index < this.header.meshCount ) {

            var mesh = this.getMeshInfo( index );
            if( mesh === undefined ) {
                return undefined;
            }

            var offset = mesh.dataOffset;
            if( mesh.baseScale == 0.0 ) {
                offset += mesh.ptCount * 3 * 4;
            }
            else {
                offset += mesh.ptCount * 3 * 2;
                if( mesh.ptCount % 2 == 1 ) {
                    offset += 2;
                }
            }

            if( mesh.ptCount > 65535 ) {
                return new Uint32Array( this.geomBuffer, offset, mesh.idxCount );
            }
            else {
                return new Uint16Array( this.geomBuffer, offset, mesh.idxCount );
            }
        }
    },

    getNormalBuffer: function( index ) {

        if( ( this.header.vtFormat & 2 ) == 2 &&
            index >= 0 &&
            index < this.header.meshCount ) {

            var mesh = this.getMeshInfo( index );
            if( mesh === undefined ) {
                return undefined;
            }

            var offset = mesh.dataOffset;
            if( mesh.baseScale == 0.0 ) {
                offset += mesh.ptCount * 3 * 4;
            }
            else {
                offset += mesh.ptCount * 3 * 2;
                if( mesh.ptCount % 2 == 1 ) {
                    offset += 2;
                }
            }

            if( mesh.ptCount > 65535 ) {
                offset += mesh.idxCount * 4;
            }
            else {
                offset += mesh.idxCount * 2;
                if( mesh.idxCount % 2 == 1 ) {
                    offset += 2;
                }
            }

            return new Float32Array( this.geomBuffer, offset, mesh.ptCount * 3 );
        }
    },

    getUVBuffer: function( index ) {

        if( index >= 0 && index < this.header.meshCount ) {

            var mesh = this.getMeshInfo( index );
            if( mesh === undefined || (mesh.vertexFormat & 4) != 4 ) {
                return undefined;
            }

            var offset = mesh.dataOffset;
            if( mesh.baseScale == 0.0 ) {
                offset += mesh.ptCount * 3 * 4;
            }
            else {
                offset += mesh.ptCount * 3 * 2;
                if( mesh.ptCount % 2 == 1 ) {
                    offset += 2;
                }
            }

            if( mesh.ptCount > 65535 ) {
                offset += mesh.idxCount * 4;
            }
            else {
                offset += mesh.idxCount * 2;
                if( mesh.idxCount % 2 == 1 ) {
                    offset += 2;
                }
            }

            if( (this.header.vtFormat & 2) == 2 ) {
                offset += mesh.ptCount * 3 * 4;
            }

            return new Float32Array( this.geomBuffer, offset, mesh.ptCount * 2 );
        }
    }
};
/**
 * @author wunian 2017/11/15
 */

CLOUD.Loader.CameraReader = function( text ) {
    this.cameras = JSON.parse(text);
};

CLOUD.Loader.CameraReader.prototype.parse = function(model, matrixRoot) {

    function setData (data, object) {

        object.uuid = data.uuid;

        if ( data.name !== undefined ) object.name = data.name;

        var matrix = new THREE.Matrix4();
        if ( data.matrix !== undefined ) {
            matrix.fromArray( data.matrix );

        } else {
            var position = new THREE.Vector3();
            var quaternion = new THREE.Quaternion();
            var scale = new THREE.Vector3();

            if ( data.position !== undefined ) position.fromArray( data.position );
            if ( data.rotation !== undefined ) {
                var rotation = new THREE.Vector3();
                rotation.fromArray( data.rotation );
                var euler = new THREE.Euler( rotation[0] * Math.PI / 180, rotation[1] * Math.PI / 180, rotation[2] * Math.PI / 180, 'XYZ' );
                quaternion.setFromEuler(euler);
            }
            if ( data.quaternion !== undefined ) quaternion.fromArray( data.quaternion, 0 );
            if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

            matrix.compose(position, quaternion, scale);
        }

        matrix.multiply(matrixRoot);
        matrix.decompose( object.position, object.quaternion, object.scale );
    };

    var cameras = this.cameras;
    var camera;
    var data;
	if (cameras.Orthographic) {
		var orthoCameras = cameras.Orthographic;
		for( var key in orthoCameras ) {
            data = orthoCameras[key];
            camera = new CLOUD.Camera(CLOUD.CAMERATYPE.ORTHOGRAPHIC, data );

            setData(data, camera);
            model.addCamera(camera);
		}
	}

	if (cameras.Perspective) {
		var prespCameras = cameras.Perspective;
		for( var key in prespCameras ) {
            data = prespCameras[key];
            camera = new CLOUD.Camera(CLOUD.CAMERATYPE.PERSPECTIVE, data );

            if ( data.focus !== undefined ) camera.focus = data.focus;
            if ( data.zoom !== undefined ) camera.zoom = data.zoom;
            if ( data.filmGauge !== undefined ) camera.filmGauge = data.filmGauge;
            if ( data.filmOffset !== undefined ) camera.filmOffset = data.filmOffset;
            if ( data.view !== undefined ) camera.view = Object.assign( {}, data.view );

            setData(data, camera);

            model.addCamera(camera);
		}
	}

};
/**
 * @author muwj 2016/12/15
 */

CLOUD.Loader.SceneHeader = function ( buffer ) {

    var header = new Uint32Array( buffer, 0, 11 );

    this.blockId      = header[0];
    this.cellCount    = header[1];
    this.itemCount    = header[2];
    this.matrixCount  = header[3];
    this.geomBuffSize = header[4];
    this.layerBuffSize= header[5];
    this.cellOffset   = header[6];
    this.itemOffset   = header[7];
    this.matrixOffset = header[8];
    this.geomOffset   = header[9];
    this.layerOffset  = header[10];

    var bbox = new Float32Array( buffer, 4 * 11, 6 );
    this.boundingBox = new THREE.Box3(
        new THREE.Vector3( bbox[0], bbox[1], bbox[2] ),
        new THREE.Vector3( bbox[3], bbox[4], bbox[5] ) );

    header = null;
    bbox = null;
};

CLOUD.Loader.Cell = function ( buffer, offset ) {

    var cell_i = new Int32Array( buffer, offset, 5 );

    this.cellId    = cell_i[0];
    this.depth     = cell_i[1];
    this.itemIndex = cell_i[2];
    this.itemCount = cell_i[3];

    this.layerType = cell_i[4];
    this.layerSize = new Int32Array( buffer, offset + 5*4, 8 );
    this.layerOffset = new Int32Array( buffer, offset + (5+8)*4, 8 );

    var bbox = new Float32Array( buffer, offset + (5+8+8)*4, 6 );
    this.boundingBox = new THREE.Box3(
        new THREE.Vector3( bbox[0], bbox[1], bbox[2] ),
        new THREE.Vector3( bbox[3], bbox[4], bbox[5] ) );

    cell_i = null;
    bbox = null;
};

CLOUD.Loader.Item = function ( buffer, offset ) {

    var item_i = new Int32Array( buffer, offset, 7 );

    this.ItemId     = item_i[0];
    this.originalId = item_i[1];
    this.materialId = item_i[2];
    this.userDataId = item_i[3];
    this.matrixId   = item_i[4];
    this.type       = item_i[5];
    this.toData     = item_i[6];

    var bbox = new Float32Array( buffer, offset + 4 * 7, 6 );
    this.boundingBox = new THREE.Box3(
        new THREE.Vector3( bbox[0], bbox[1], bbox[2] ),
        new THREE.Vector3( bbox[3], bbox[4], bbox[5] ) );

    item_i = null;
    bbox = null;
};

CLOUD.Loader.Matrix = function ( buffer, offset ) {

    var matrixData = new Float32Array( buffer, offset, 4 * 4 );
    this.matrix = new THREE.Matrix4().fromArray( matrixData );
    matrixData = null;
};

CLOUD.Loader.GeomPipe = function ( buffer, offset ) {

    var geomData = new Float32Array( buffer, offset, 8 );

    this.startPt = new THREE.Vector3( geomData[0], geomData[1], geomData[2] );
    this.endPt   = new THREE.Vector3( geomData[3], geomData[4], geomData[5] );
    this.radius    = geomData[6];
    this.thickness = geomData[7];

    geomData = null;
};

CLOUD.Loader.SceneReader = function ( buffer ) {

    this.header = new CLOUD.Loader.SceneHeader( buffer );

    this.cellSize   = 4 * (5+8+8+6);
    this.itemSize   = 4 * 13;
    this.matrixSize = 4 * 16;
    this.maxSize    = 4 * 256;

    this.cellBuffer   = buffer.slice( this.header.cellOffset,   this.header.cellOffset   + this.header.cellCount   * this.cellSize );
    this.itemBuffer   = buffer.slice( this.header.itemOffset,   this.header.itemOffset   + this.header.itemCount   * this.itemSize );
    this.matrixBuffer = buffer.slice( this.header.matrixOffset, this.header.matrixOffset + this.header.matrixCount * this.matrixSize );
    this.geomBuffer   = buffer.slice( this.header.geomOffset,   this.header.geomOffset   + this.header.geomBuffSize );
    this.layerBuffer  = buffer.slice( this.header.layerOffset,  this.header.layerOffset  + this.header.layerBuffSize );

    // for data reading
    this.matr_cur_id = -1;
    this.pt_cell_min = new THREE.Vector3( 0.0, 0.0, 0.0 );
    this.pt_cell_max = new THREE.Vector3( 0.0, 0.0, 0.0 );
    this.pt_item_min = new THREE.Vector3( 0.0, 0.0, 0.0 );
    this.pt_item_max = new THREE.Vector3( 0.0, 0.0, 0.0 );

    var tmp_buffer = new ArrayBuffer( this.maxSize );
    this.cell_cur = new CLOUD.Loader.Cell( tmp_buffer, 0 );
    this.item_cur = new CLOUD.Loader.Item( tmp_buffer, 0 );
    this.matr_cur = new CLOUD.Loader.Matrix( tmp_buffer, 0 );
    this.pipe_cur = new CLOUD.Loader.GeomPipe( tmp_buffer, 0 );

    this.cell_cur.boundingBox.set( this.pt_cell_min, this.pt_cell_max );
    this.item_cur.boundingBox.set( this.pt_item_min, this.pt_item_max );
};

CLOUD.Loader.SceneReader.prototype = {

    constructor: CLOUD.Loader.SceneReader,

    getCellMpks: function( index ) {

        if ( index >= 0 && index < this.header.cellCount ) {
            var src = [];
            var cell = this.getCellInfo( index );
            for ( var i = cell.itemIndex; i < cell.itemCount; ++i ) {
                var item = this.getItemInfo( i );
                if( item.type === 1 ) { // mesh

                    var blockId = this.getMpkID( item.toData );
                    src.push( blockId );
                }
            }

            var key = {};
            var dist = [];
            for ( var j = 0; j < src.length; ++j ) {
                if ( ! key[src[j]] ) {
                    key[src[j]] = true;
                    dist.push( src[j] );
                }
            }
            return dist;
        }
    },

    getCell: function ( index ) {

        if ( index >= 0 && index < this.header.cellCount ) {
            return new CLOUD.Loader.Cell( this.cellBuffer, index * this.cellSize );
        }
    },

    getItem: function ( index ) {

        if ( index >= 0 && index < this.header.itemCount ) {
            return new CLOUD.Loader.Item( this.itemBuffer, index * this.itemSize );
        }
    },

    getMatrix: function ( index ) {

        if ( index >= 0 && index < this.header.matrixCount ) {
            return new CLOUD.Loader.Matrix( this.matrixBuffer, index * this.matrixSize );
        }
    },

    getGeomPipe: function ( offset ) {

        if ( offset >= 0 && offset < this.header.geomBuffSize ) {
            return new CLOUD.Loader.GeomPipe( this.geomBuffer, offset );
        }
    },

    getCellInfo: function ( index ) {

        if ( index >= 0 && index < this.header.cellCount ) {

            var data_i = new Int32Array( this.cellBuffer, index * this.cellSize, 5 );
            this.cell_cur.cellId    = data_i[0];
            this.cell_cur.depth     = data_i[1];
            this.cell_cur.itemIndex = data_i[2];
            this.cell_cur.itemCount = data_i[3];

            this.cell_cur.layerType = data_i[4];
            this.cell_cur.layerSize = new Int32Array( this.cellBuffer, index * this.cellSize + 5*4, 8 );
            this.cell_cur.layerOffset = new Int32Array( this.cellBuffer, index * this.cellSize + (5+8)*4, 8 );

            var data_f = new Float32Array( this.cellBuffer, index * this.cellSize + (5+8+8)*4, 6 );
            this.pt_cell_min.set( data_f[0], data_f[1], data_f[2] );
            this.pt_cell_max.set( data_f[3], data_f[4], data_f[5] );
            this.cell_cur.boundingBox.set( this.pt_cell_min, this.pt_cell_max );

            return this.cell_cur;
        }
    },

    getItemInfo: function ( index ) {

        if ( index >= 0 && index < this.header.itemCount ) {

            var data_i = new Int32Array( this.itemBuffer, index * this.itemSize, 7 );
            this.item_cur.ItemId     = data_i[0];
            this.item_cur.originalId = data_i[1];
            this.item_cur.materialId = data_i[2];
            this.item_cur.userDataId = data_i[3];
            this.item_cur.matrixId   = data_i[4];
            this.item_cur.type       = data_i[5];
            this.item_cur.toData     = data_i[6];

            var data_f = new Float32Array( this.itemBuffer, index * this.itemSize + 4 * 7, 6 );
            this.pt_item_min.set( data_f[0], data_f[1], data_f[2] );
            this.pt_item_max.set( data_f[3], data_f[4], data_f[5] );
            this.item_cur.boundingBox.set( this.pt_item_min, this.pt_item_max );

            return this.item_cur;
        }
    },

    getMatrixInfo: function ( index ) {

        if ( index == this.matr_cur_id ) {
            return this.matr_cur;
        }

        if ( index >= 0 && index < this.header.matrixCount ) {

            var data = new Float32Array( this.matrixBuffer, index * this.matrixSize, 4 * 4 );
            this.matr_cur.matrix.fromArray( data );

            this.matr_cur_id = index;
            return this.matr_cur;
        }
    },

    getGeomPipeInfo: function ( offset ) {

        if ( offset >= 0 && offset < this.header.geomBuffSize ) {

            var data = new Float32Array( this.geomBuffer, offset, 8 );
            this.pipe_cur.startPt.set( data[0], data[1], data[2] );
            this.pipe_cur.endPt.set  ( data[3], data[4], data[5] );
            this.pipe_cur.radius    = data[6];
            this.pipe_cur.thickness = data[7];

            return this.pipe_cur;
        }
    },

    getLayerInfo: function ( offset, size ) {

        if ( offset >= 0 && ( offset + size ) < this.header.layerBuffSize ) {

            var data = new Uint32Array( this.layerBuffer, offset, size );
            return this.data;
        }
    },

    getMpkID: function ( mesh_id ) {

        return parseInt( mesh_id / 65536 );
    },

    getMeshIndex: function ( mesh_id ) {

        return parseInt( mesh_id % 65536 );
    }
};

CLOUD.TaskWorker = function (threadCount, finishCallback) {

    this.MaxThreadCount = threadCount || 8;

    var scope = this;
    scope.todoList = {};
    scope.todoCount = 0;
    scope.doingCount = 0;

    this.hasTask = function () {
        return scope.todoCount > 0;
    };

    this.addItem = function(id, item) {
        scope.todoList[id] = item;
        scope.todoCount++;
    };

    this.clearTasks = function () {
        scope.todoList = {};
        scope.todoCount = 0;
    };

    this.run = function (renderId, loader, sorter) {
        var scope = this;
        if (scope.doingCount > 0) {
            //console.log("busy");
            return;
        }
        
        var items = [];
        var todoList = scope.todoList;
        for (var name in todoList) {
            if(todoList.hasOwnProperty(name)) {
                items.push(name)
            }
        }
        //console.log(scope.todoCount + "/" + items.length);
        scope.todoList = {};
        scope.todoCount = 0;

        var itemCount = items.length;
        if (itemCount == 0)
            return;

        if (sorter) {
            items.sort(sorter);
        }

        itemCount = Math.min(itemCount, CLOUD.GlobalData.ConcurrencyRequestCount);

        var TASK_COUNT = Math.min(this.MaxThreadCount, itemCount);
        scope.doingCount = itemCount;

        function processItem(i) {

            if (i >= itemCount) {
                if (scope.doingCount < 1) {
                    finishCallback();
                }
                return;
            }

            var item = items[i];

            loader(item, i + TASK_COUNT, processItem);
        };

        for (var ii = 0; ii < TASK_COUNT; ++ii) {
            processItem(ii);
        }
    };
};

CLOUD.MpkTaskWorker = function (threadCount) {

    // var scope = this;

    this.MaxThreadCount = threadCount || 8;
    this.todoList = [];
    this.doingCount = 0;
    this.listners = [];

    this.addItem = function (mpkId) {

        if (mpkId === undefined) {
            console.log("undefined mpkId");
            return;
        }

        //if (this.todoList[mpkId] === undefined) {
        //    this.todoList[mpkId] = [];
        //}

        this.todoList.push(mpkId);
    };

    this.run = function (loader, onFinished) {

        if (this.doingCount > 0) {
            this.listners.push(onFinished);
            return;
        }

        var doingList = this.todoList;
        this.todoList = [];
        var items = [];
        for (var item in doingList) {
            if(doingList.hasOwnProperty(item)) {
                items.push(item);
            }

        }

        var scope = this;
        var itemCount = items.length;
        if (itemCount == 0) {
            onFinished();
            return;
        }

        var doingListners = this.listners;
        this.listners = [];
        scope.doingCount = itemCount;

        var TASK_COUNT = Math.min(this.MaxThreadCount, itemCount);

        function processItem(i) {

            if (i >= itemCount) {
                if (scope.doingCount < 1) {
                    // next loop
                    onFinished(0, itemCount);

                    for (var ii = 0, len = doingListners.length; ii < len; ++ii) {
                        doingListners[ii](0, itemCount);
                    }
                    doingListners = [];
                    scope.run(loader, function () { });

                } else {
                    onFinished(scope.doingCount, itemCount);
                }
                return;
            }

            if (i >= TASK_COUNT) {
                onFinished(scope.doingCount, itemCount);
            }

            var mpkId = items[i];
            //console.log(mpkId);
            loader(mpkId, i + TASK_COUNT, processItem);
        };

        for (var ii = 0; ii < TASK_COUNT; ++ii) {
            processItem(ii);
        }
    };
};

CLOUD.TaskManager = function (manager) {

    // var scope = this;
    this.manager = manager;
    // MPK
    this.mpkWorker = new CLOUD.MpkTaskWorker(8);

};

CLOUD.TaskManager.prototype = {

    constructor: CLOUD.TaskManager,

    addMpkTask: function(mpkId) {
        this.mpkWorker.addItem(mpkId);
    },

    processMpkTasks: function (finishCallback) {

        var scope = this;
        //function on_load_mesh(client, item) {
        //
        //    if (item === null)
        //        return;
        //
        //    var mesh = client.cache.geometries[item.meshNode.meshId];
        //    if (mesh) {
        //        item.meshNode.updateGeometry(mesh);
        //    }
        //    else {
        //        console.log("err: " + item + " may be in other mpk");
        //    }
        //}

        function loader(mpkId, nextIdx, callback) {

            scope.manager.loadMpk(mpkId, function () {
                //if (items == undefined)
                //    console.log("error");
                //
                //for (var ii = 0, len = items.length; ii < len; ++ii) {
                //    on_load_mesh(client, items[ii]);
                //}


                --scope.mpkWorker.doingCount;
                // next task
                callback(nextIdx);
            });
        }

        this.mpkWorker.run(loader, finishCallback || function () { });
    }
};
// parameters = {serverUrl: xxx, databagId:xxx}
CLOUD.Loader.ModelLoader = function (model, parameters, debut) {

    THREE.LoadingManager.call(this);

    this.model = model;
    this.taskManager = new CLOUD.TaskManager(this);
    this.url = new CLOUD.Loader.Url(parameters.serverUrl, parameters.databagId);
    this.loader = new THREE.FileLoader(this);
    this.loadTaskCount = 0;
    this.maxLoadTaskCount = 0;   // TODO: change the way to flag resource loading finish flag.
    this.octreeRootNode = null;
    this.octreeRootNodeI = null;
    this.symbolReader = null;
    this.userIdReader = null;
    this.userDataReader = null;
    this.sceneReaderArray = null;
    this.debut = debut;
};

CLOUD.Loader.ModelLoader.prototype = Object.create(THREE.LoadingManager.prototype);
CLOUD.Loader.ModelLoader.prototype.constructor = CLOUD.Loader.ModelLoader;

CLOUD.Loader.ModelLoader.prototype._onTaskFinished = function () {

    var model = this.model;

    this.loadTaskCount++;

    if (this.notifyProgress) {

        var progress = {
            total: this.maxLoadTaskCount,
            loaded: this.loadTaskCount
        };

        model.dispatchEvent({type: CLOUD.EVENTS.ON_LOAD_PROGRESS, progress: progress});

    }

    if (this.loadTaskCount >= this.maxLoadTaskCount) {

        model.loaded = true;

        var scene = this.model.manager.scene;
        if (CLOUD.GlobalData.IBL && scene.iblProbe != null && scene.iblProbe.isComputed) {
            this.model.updateMaterials();

            var IBLcfg = scene.IBLcfg;
            var keys = Object.keys(IBLcfg);
            var uniforms = IBLcfg[keys[scene.IBLIndex]];
            for (var id in uniforms) {
                this.model.updateMaterialsValue(id, uniforms[id]);
            }
        }

        model.dispatchEvent({type: CLOUD.EVENTS.ON_LOAD_COMPLETE});

        // Trigger off first frame render
        if (this.debut !== undefined) {
            this.debut();
        }

    }
};

CLOUD.Loader.ModelLoader.prototype._loadScene = function (loader, url, sceneId) {

    var scope = this;

    loader.setResponseType("arraybuffer");
    loader.load(url.sceneUrl(sceneId), function (data) {

        var sceneReader = new CLOUD.Loader.SceneReader(data);
        var blockId = sceneReader.header.blockId;

        if (blockId < scope.sceneCount) {
            scope.sceneReaderArray[blockId] = sceneReader;
        }

        sceneReader = null;
        // scope.model.dispatchEvent({type: CLOUD.EVENTS.ON_LOAD_START, sceneId: sceneId});

        scope._onTaskFinished();

    }, undefined, function (event) {

        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_SCENE_ERROR, event: event});
        scope._onTaskFinished();
        
    });
};

CLOUD.Loader.ModelLoader.prototype._loadMaterial = function (loader, url) {

    var scope = this;

    loader.setResponseType("arraybuffer");
    loader.load(url.materialUrl(), function (data) {

        scope._parseMaterial(data, url);
        scope._onTaskFinished();

    }, undefined, function (event) {

        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_MATERIAL_ERROR, event: event});
        scope._onTaskFinished();
        
    });

};

CLOUD.Loader.ModelLoader.prototype._loadSymbol = function (loader, url) {

    var scope = this;
    // TODO: maxLoadTaskCount should not be assigned with hard code at initialization (5).
    loader.setResponseType("arraybuffer");
    loader.load(url.symbolUrl(), function (data) {

        scope.symbolReader = new CLOUD.Loader.SymbolReader(data);
        scope._onTaskFinished();

    }, undefined, function (event) {

        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_SYMBOL_ERROR, event: event});
        scope._onTaskFinished();
        
    });

};

CLOUD.Loader.ModelLoader.prototype._loadOctreeInner = function (loader, url, matrixRoot) {

    var scope = this;

    // load spatial index
    loader.load(url.octreeUrl('i'), function (data) {

        scope._parseOctree(data, matrixRoot, true);
        scope._onTaskFinished();

    }, undefined, function (event) {

        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_OCTREEINNER_ERROR, event: event});
        scope._onTaskFinished();
        
    });

};

CLOUD.Loader.ModelLoader.prototype._loadOctreeOuter = function (loader, url, matrixInv) {

    var scope = this;

    // load spatial index
    loader.load(url.octreeUrl('o'), function (data) {

        scope._parseOctree(data, matrixInv, false);
        scope._onTaskFinished();

    }, undefined, function (event) {

        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_OCTREEOUTER_ERROR, event: event});
        scope._onTaskFinished();
        
    });

};

CLOUD.Loader.ModelLoader.prototype._loadUserId = function (loader, url) {

    var scope = this;

    loader.setResponseType("arraybuffer");
    loader.load(url.userIdUrl(), function (data) {

        scope.userIdReader = new CLOUD.Loader.IdReader(data);
        scope._onTaskFinished();

    }, undefined, function(error) {
        
        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_USERID_ERROR, event: event});
        scope._onTaskFinished();
        
    });

};

CLOUD.Loader.ModelLoader.prototype._loadUserData = function (loader, url) {

    var scope = this;

    loader.setResponseType("");
    loader.load(url.userDataUrl(), function (data) {

        scope.userDataReader = new CLOUD.Loader.UserDataReader(data);
        scope._onTaskFinished();

    }, undefined, function (event) {

        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_USERDATA_ERROR, event: event});
        scope._onTaskFinished();
        
    });

};

CLOUD.Loader.ModelLoader.prototype._loadCamera = function (loader, url, matrixRoot) {

    var scope = this;

    loader.setResponseType("");
    loader.load(url.cameraUrl(), function (data) {

        var cameraReader = new CLOUD.Loader.CameraReader(data);
        cameraReader.parse(scope.model, matrixRoot);
        scope._onTaskFinished();

    }, undefined, function (event) {

        scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_CAMERA_ERROR, event: event});
        scope._onTaskFinished();
        
    });

};

CLOUD.Loader.ModelLoader.prototype._loadTexture = function (url, onLoad, onProgress, onError) {

    var texture;
    var loader = THREE.Loader.Handlers.get(url);
    var manager = this;

    if (loader !== null) {

        texture = loader.load(url, onLoad);

    } else {

        texture = new THREE.Texture();

        loader = new THREE.ImageLoader(manager);
        loader.setCrossOrigin("anonymous");
        loader.load(url, function (image) {

            texture.image = CLOUD.MaterialUtil.ensurePowerOfTwo(image);
            texture.needsUpdate = true;

            if (onLoad) onLoad(texture);

        }, onProgress, function (event) {

            if (onError !== undefined) onError(event);
            manager.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_TEXTURE_ERROR, event: event});
            
        });

    }

    return texture;
};

CLOUD.Loader.ModelLoader.prototype._loadMpks = function (loader, url, count) {

    // Add MPKs to task manager
    var taskManager = this.taskManager;

    for (var i = 0; i < count; ++i) {
        taskManager.addMpkTask(i);
    }

    taskManager.processMpkTasks();
};

CLOUD.Loader.ModelLoader.prototype._parseMpk = function (data) {

    var referencedMeshCache = this.model.getReferencedMeshCache();
    // BIMFACEDM-3650: 'MPK.MPKReader' is a copy from
    // 'CLOUD.Loader.MPKReader(data) for 'mpkWorker' only,
    // but 'mpkWorker' is not effective yet.
    // TODO: make 'CLOUD.Loader.MPKReader' and 'MPK.MPKReader' one copy.
    //var reader = new MPK.MPKReader(data);
    var reader = new CLOUD.Loader.MPKReader(data);
    var count = reader.header.meshCount;

    for (var i = 0; i < count; ++i) {

        var position = reader.getPtBuffer(i);
        var index = reader.getIdxBuffer(i);
        var normal = reader.getNormalBuffer(i);
        var mesh = reader.getMeshData(i);
        var uv = reader.getUVBuffer(i);

        if (position == undefined || index == undefined || normal == undefined) {
            CLOUD.Logger.log("Error Geometry!");
            continue;
        }

        var id = mesh.mesh_id;

        referencedMeshCache[id] = {
            P: position,  // position
            I: index,  // index
            N: normal,  // normal
            M: mesh,   // mesh info
            UV:uv
        };
    }
    reader = null;
};

CLOUD.Loader.ModelLoader.prototype._parseMaterial = function (data, url) {

    var materials = this.model.getMaterials();
    var textures = this.model.getTextures();
    var reader = new CLOUD.Loader.MaterialReader(data);
    var len = reader.materialCount;

    if (len < 0) {
        return;
    }

    var scene = this.model.manager.scene;

    for (var i = 0; i < len; ++i) {

        var materialParameters = {};
        var materialData = reader.getMaterial(i);

        if (materialData.color !== undefined) {
            materialParameters.color = materialData.color;
        }

        if (materialData.opacity !== undefined) {
            materialParameters.opacity = materialData.opacity;

            if (materialData.opacity < 1.0) {
                materialParameters.transparent = true;
            }
        }

        if (materialData.side !== undefined && materialData.side) {
            materialParameters.side = THREE.DoubleSide;
        }

        if (materialData.emissive !== undefined) {
            materialParameters.emissive = materialData.emissive;
        }

        var textureCount = materialData.texture_n;
        var textureData = null; // remark: 这里定义textureData后，一定要赋null值，否则textureData会保留上一次的值。

        if (textureCount > 0) {
            textureData = reader.getTexture(materialData.texture_id[0]);
        }

        if (textureData) {

            var textureId = textureData.id + textureData.file_name_ext;
            var texture = this._loadTexture(url.textureUrl(textureId));

            texture.repeat.fromArray([textureData.scale_u,textureData.scale_v]);
            texture.offset.fromArray([textureData.offset_u,textureData.offset_v]);

            if (texture.setRotateAngle) {
                texture.setRotateAngle(textureData.angle);
            }

            if (textureData.repeat_u) {
                texture.wrapS = THREE.RepeatWrapping;
            }

            if (textureData.repeat_v) {
                texture.wrapT = THREE.RepeatWrapping;
            }

            //materialParameters.map = texture;

            if (texture) {
                textures[i] = texture;
            }
        }

        var material;
        if (CLOUD.GlobalData.IBL) {
            materialParameters.iblProbe = scene.iblProbe;
            material = new ImageBasedLighting.IBLMaterial(materialParameters);
            material.type = 'IBL';
        }
        else {
            material = CLOUD.MaterialUtil.createStandardMaterial(materialParameters);
        }

        CLOUD.IdTargetUtil.addIdBufferFlagToMaterial(material);

        material.name = i;
        materials[i] = material;
        materialParameters = null;
    }

    reader = null;
};

CLOUD.Loader.ModelLoader.prototype._parseOctree = function (data, matrixInv, inner) {

    function setNodeByOctData(node, octData) {

        // 如果模型数据经过了变换，则变换包围盒
        if (matrixInv) {
            octData.boundingBox.applyMatrix4(matrixInv);
        }

        node.boundingBoxWorld = octData.boundingBox.clone(); //
        node.min = octData.boundingBox.min;
        node.max = octData.boundingBox.max;
        node.center = octData.boundingBox.getCenter();
        node.size = octData.boundingBox.getSize().lengthSq();
        node.childStart = octData.child_s;
        node.childEnd = octData.child_e;
    }

    function setNodeOctType(node, parent) {
        node.octType = 0;

        if (node.center.x < parent.center.x) {
            node.octType += 1;
        }
        if (node.center.y < parent.center.y) {
            node.octType += 2;
        }
        if (node.center.z < parent.center.z) {
            node.octType += 4;
        }
    }

    function traverse(parent, reader) {

        var childStart = parent.childStart;
        var childEnd = parent.childEnd;

        for (var i = childStart; i < childEnd; ++i) {

            var octData = reader.getNode(i);
            var octantId = octData.cell_id;
            var node = new CLOUD.Loader.OctreeNode(octantId, parent.depth);

            setNodeByOctData(node, octData);
            parent.add(node);
            setNodeOctType(node, parent);
            node.updateMaxDepth();
            traverse(node, reader);
        }
    }

    var rootNode = null;
    var reader = new CLOUD.Loader.OctreeReader(data);
    var count = reader.getCount();

    if (count > 0) {

        var octData = reader.getNode(0);
        var octantId = octData.cell_id;
        rootNode = new CLOUD.Loader.OctreeNode(octantId, 0);

        setNodeByOctData(rootNode, octData);
        traverse(rootNode, reader);
    }

    if (inner) {
        this.octreeRootNodeI = rootNode;
    } else {
        this.octreeRootNode = rootNode;
    }

    CLOUD.Logger.log("Maximum Depth:", CLOUD.GlobalData.MaximumDepth);
};

CLOUD.Loader.ModelLoader.prototype.destroy = function () {

    this.taskManager = null;
    this.url = null;
    this.model = null;
    this.loader = null;
    this.octreeRootNode = null;
    this.octreeRootNodeI = null;
    this.userIdReader = null;
    this.userDataReader = null;
    this.symbolReader = null;
    this.sceneReaderArray = null;

};

CLOUD.Loader.ModelLoader.prototype.getOctreeRootNodeInner = function () {
    return this.octreeRootNodeI;
};

CLOUD.Loader.ModelLoader.prototype.getOctreeRootNodeOuter = function () {
    return this.octreeRootNode;
};

CLOUD.Loader.ModelLoader.prototype.getSceneReaderArray = function () {
    return this.sceneReaderArray;
};

CLOUD.Loader.ModelLoader.prototype.getSymbolReader = function () {
    return this.symbolReader;
};

CLOUD.Loader.ModelLoader.prototype.getUserIdReader = function () {
    return this.userIdReader;
};

CLOUD.Loader.ModelLoader.prototype.getUserDataReader = function () {
    return this.userDataReader;
};

CLOUD.Loader.ModelLoader.prototype.setCrossOrigin = function (crossOrigin) {
    this.loader.setCrossOrigin(crossOrigin);
};

CLOUD.Loader.ModelLoader.prototype.load = function (notifyProgress) {

    var scope = this;
    var url = this.url;
    var loader = this.loader;
    var model = this.model;
    var scene = model.manager.scene;

    this.notifyProgress = notifyProgress;

    model.dispatchEvent({type: CLOUD.EVENTS.ON_LOAD_START});

    loader.setResponseType("");
    loader.load(url.projectUrl(), function (text) {

        var cfg;

        model.loaded = false;

        try {
            cfg = JSON.parse(text);
        } catch(err){
            console.log("Config data exceptions!");
            model.dispatchEvent({type: CLOUD.EVENTS.ON_LOAD_INVALID_SCENE});
            return;
        }

        var metadata = cfg.metadata;
        var sceneCount = scope.sceneCount = metadata.scenes;
        // 空场景
        if (sceneCount === 0) {
            model.dispatchEvent({ type: CLOUD.EVENTS.ON_LOAD_EMPTY_SCENE });
            return;
        }

        var mpkCount = metadata.mpks;
        var symbolCount = metadata.symbol;
        var octreeCount_o = metadata.octree_o;
        var octreeCount_i = metadata.octree_i;
        var materialCount = metadata.material || 0;
        var userDataCount = metadata.userdata || 0;// userdata
        var userIdCount = 1;// userId
        var hasCamera = metadata.camera || false;
        var dataVersion = metadata.version;

        var dataView = cfg.view;
        var hasTransform = dataView.transform;

        if (!scope.checkVersionMatch(CLOUD.Version, dataVersion)) {
            model.dispatchEvent({ type: CLOUD.EVENTS.ON_VERSION_NO_MATCH, version: {engine: CLOUD.Version, data: dataVersion} });
            return;
        }

        scope.sceneReaderArray = new Array(sceneCount);

        // ------ 计算任务数 BEGIN ------ //
        scope.maxLoadTaskCount = 0;
        scope.maxLoadTaskCount += 1; //sceneCount;

        if (mpkCount > 0) {
            scope.maxLoadTaskCount += mpkCount;
        }

        scope.maxLoadTaskCount += symbolCount;
        scope.maxLoadTaskCount += octreeCount_o;
        scope.maxLoadTaskCount += octreeCount_i;
        scope.maxLoadTaskCount += materialCount;
        scope.maxLoadTaskCount += userDataCount;
        scope.maxLoadTaskCount += userIdCount;
        if (hasCamera) {
            scope.maxLoadTaskCount++;
        }
        // ------ 计算任务数 END ------ //

        model.parse(cfg);

        var matrixInv = null;
        var matrixRoot = model.getTransformMatrix().clone();

        // 如果octree经过变换，则变换会回世界系
        if (model.transformed) {
            matrixInv = new THREE.Matrix4();
            matrixInv.getInverse(matrixRoot);
        }

        scope._loadScene(loader, url, 0);
        scope._loadMpks(loader, url, mpkCount);
        scope._loadMaterial(loader, url);

        if (symbolCount > 0) {
            scope._loadSymbol(loader, url);
        }

        if (octreeCount_o > 0) {
            scope._loadOctreeOuter(loader, url, matrixInv);
        }

        if (octreeCount_i > 0) {
            scope._loadOctreeInner(loader, url, matrixInv);
        }

        if (userIdCount > 0) {
            scope._loadUserId(loader, url);
        }

        if (userDataCount > 0) {
            scope._loadUserData(loader, url);
        }

        if (hasCamera) {
            scope._loadCamera(loader, url, matrixRoot);
        }

    }, undefined, function () {

        console.log("config load error!");
        model.dispatchEvent({ type: CLOUD.EVENTS.ON_LOAD_INVALID_SCENE });

    });
};

CLOUD.Loader.ModelLoader.prototype.loadMpk = function (mpkId, callback) {

    var scope = this;
    var referencedMeshCache = this.model.getReferencedMeshCache();
    var loader = this.loader;
    var url = this.url;
    var mpkWorkerUrl = CLOUD.GlobalData.MpkWorkerUrl;
    var userWorker = CLOUD.GlobalData.UseMpkWorker;

    if (userWorker) {

        loader.setResponseType("arraybuffer");
        loader.load(url.mpkUrl(mpkId), function (data) {

            var worker = new Worker(mpkWorkerUrl);
            worker.onmessage = function (event) {
                //var mpkReader = event.data[0];
                //if (mpkReader.header.blockId < mpkCount) {
                //    scope.mpkArray[mpkReader.header.blockId] = mpkReader;
                //}

                var result = event.data;

                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        referencedMeshCache[key] = result[key];
                    }
                }

                callback();

                // TODO: Notify Progress
                scope._onTaskFinished();
            };

            //worker.postMessage( {"msg": data, result:scope.result});
            worker.postMessage({"msg": data});

        }, undefined, function (event) {

            scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_MPK_ERROR, event: event});
            scope._onTaskFinished();
            
        });

    } else {

        loader.setResponseType("arraybuffer");
        loader.load(url.mpkUrl(mpkId), function (data) {

            scope._parseMpk(data);
            callback();
            scope._onTaskFinished();

        }, undefined, function (event) {

            scope.model.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_MPK_ERROR, event: event});
            scope._onTaskFinished();
            
        });
    }

};

CLOUD.Loader.ModelLoader.prototype.checkVersionMatch = function (engineVersion, dataVersion) {

    //引擎版本号有四部分组成：<主版本号>.<子版本号>.<阶段版本号>.<日期版本号>：0.7.0.20171025。
    var engineNumbers = engineVersion.split(".");

    if (engineNumbers.length > 1) {

        var engineMajor = parseInt(engineNumbers[0]);// 主版本号
        var engineSubversion = parseInt(engineNumbers[1]); // 子版本号

        // 数据版本号
        var numberDataVersion = dataVersion.toLowerCase();
        numberDataVersion = parseFloat(numberDataVersion);

        // V2: engine version < 0.7, data version < 0.04
        // V3: engine version >= 0.7, data version >= 0.04
        // V4: ...

        // V2
        if (numberDataVersion < 0.04) {

            if (engineMajor === 0 && engineSubversion < 7 ) {
                return true;
            }

        }

        // V3
        if (numberDataVersion >= 0.04) {
            if (engineMajor > 0 || (engineMajor === 0 && engineSubversion >= 7)) {
                return true;
            }
        }

    }

    return false;

};
/**
 *
 *
 * @param {CLOUD.ModelManager} manager - The place where models are aggregated and managed.
 * @param {Array}              parameters - {serverUrl: xxx, databagId:xxx}
 * @param {Function}           debut - callback function to render the scene when model finish loading model.
 * @constructor
 */
CLOUD.Model = function (manager, parameters, index, debut) {

    this.manager = manager;
    this.databagId = parameters.databagId;
    this.loader = new CLOUD.Loader.ModelLoader(this, parameters, debut);
    this.pool = manager.getObjectPool();

    this.renderableCount = 0;
    this.renderableTotal = CLOUD.GlobalData.maxObjectNumInPool;
    //statics data
    this.numOfElements = 0;
    this.numOfTriangles = 0;

    this.boundingBoxWorld = null;
    this.rotation = new THREE.Quaternion();
    this.position = new THREE.Vector3();
    this.scale = new THREE.Vector3(1, 1, 1);
    this.transformMatrix = new THREE.Matrix4(); // 用于保存变换后的矩阵 - 兼容处理，以后要删除
    this.transformed = false;
    this.firstOctreeTransform = true;

    this.cache = {
        cells: {},
        geometries: {},
        materials: {},
        textures: {},

        wireframeGeometries: {}
    };

    this.wireframeMaterial = new THREE.MeshBasicMaterial({color: 0x666666});

    this.visibleOctant = [];

    this.occlusionVisibleOctant = [];

    this.containsCamera = false;
    this.loaded = false;
    this.visible = true;

    // cache overall referenced unique meshes
    this.referencedMeshCache = {};

    this.nodePriority = {
        high: [],
        medium: [],
        low: []
    };

    this.cameraList = [];

    // unique index in all models
    // used to generate unique originalId for meshes
    this.index = index;
};

CLOUD.Model.prototype.destroy = function () {

    this.loader.destroy();
    this.loader = null;
    this.loaded = false;

    this.manager.scene.removeObjectGroupByName(this._getWireframeGroupName());

    this._clearNodePriority(true);
    this.nodePriority = null;

    this._clearCache();
    this.cache = null;

    this.pool = null;
    this.manager = null;

    this.visibleOctant = null;
    this.occlusionVisibleOctant = null;

    if (this.occlusionCamera) {
        this.occlusionCamera = null;
    }

    this.cameraList = null;

    this.renderableTotal = CLOUD.GlobalData.maxObjectNumInPool;
    this.numOfElements = 0;
    this.numOfTriangles = 0;
};

CLOUD.Model.prototype._clearCache = function () {

    var cache = this.cache;
    var geometries = cache.geometries;
    var materials = cache.materials;

    var geometry, material;

    for (var id in geometries) {
        geometry = geometries[id];
        geometry.dispose();
    }

    for (id in materials) {
        material = materials[id];
        material.dispose();
    }

    cache.cells = {};
    cache.geometries = {};
    cache.materials = {};
    cache.textures = {};

};

// 支持动态控制纹理贴图
CLOUD.Model.prototype._updateTextureMapping = function () {

    var textureEnabled = CLOUD.GlobalData.EnableTextureMapping;

    if (this.lastTextureEnabled !== textureEnabled) {

        var textures = this.cache.textures;
        var materials = this.cache.materials;

        // 会影响效率
        var id;
        var material;
        if (textureEnabled) {

            for (id in materials) {

                if (materials.hasOwnProperty(id)) {

                    material = materials[id];
                    var map = textures[id];

                    // 材质贴图存在, 则更新材质贴图
                    if (map) {
                        material.map = map;
                        if (CLOUD.GlobalData.IBL) {
                            material.refreshUniforms();
                        }
                        material.needsUpdate = true;// 更新材质
                    }

                }

            }

        } else {

            for (id in materials) {

                if (materials.hasOwnProperty(id)) {

                    material = materials[id];

                    material.map = null;
                    material.needsUpdate = true;// 更新材质
                }

            }
        }

        this.lastTextureEnabled = textureEnabled;
    }

};

CLOUD.Model.prototype.getOctreeRoots = function (roots) {
    var loader = this.loader;
    var octreeRootNode = loader.getOctreeRootNodeOuter();

    if (octreeRootNode) {
        roots.push(octreeRootNode);
    }

    var octreeRootNodeI = loader.getOctreeRootNodeInner();
    if (octreeRootNodeI) {
        roots.push(octreeRootNodeI);
    }
};

CLOUD.Model.prototype._clearNodePriority = function (clearLow) {
    var nodePriority = this.nodePriority;
    nodePriority.high = [];
    nodePriority.medium = [];
    if (clearLow) {
        nodePriority.low = [];
    }
};

/**
 * 读取数据，构造mesh node
 *
 * @param {Object} reader - sceneReader or symbolReader ： 如果 itemParent === null或undefined 为sceneReader， 否则为 symbolReader
 * @param {number} cellId - 八叉树单元ID
 * @param {Object} item - 数据项
 * @param {Object} itemParent - 父节点参数项 {matrix : xxx, ItemId : xxx, originalId: xxx}
 * @param {string} categoryId - 分类编码 id
 * @param {number} cellDepth - 网格深度
 */
CLOUD.Model.prototype._readMeshInfo = function (reader, cellId, item, itemParent, categoryId, cellDepth) {

    var loader = this.loader;
    var cacheCell = this.cache.cells[cellId];
    var cacheGeometries = this.cache.geometries;
    // itemParent存在, 表示读取symbol数据
    var userDataId;
    var originalId;
    var mtlId;
    if (itemParent === null) {
        userDataId = item.userDataId;
        originalId = item.originalId;
        mtlId = item.materialId;
    } else {
        userDataId = itemParent.userDataId;
        originalId = itemParent.originalId;
        // BIMFACEDM-2599
        // symbol instance's material id: exist(>=0) or non-exist(-1)
        // if symbol instance get own material, all child element of symbol use instance'
        // material, else use child's own material
        mtlId = (itemParent.materialId > -1) ? itemParent.materialId : item.materialId;
    }

    var userIdReader = loader.getUserIdReader();
    var userId = userIdReader ? userIdReader.getString(originalId) : originalId;

    var meshInfo = null;

    if (item.type === 1) {
        meshInfo = this._getMeshNodeAttribute(reader, item, itemParent);
    } else if (item.type === 2) {
        meshInfo = this._getMeshNodeAttrOfTube(cacheGeometries, reader, item, itemParent);
    } else if (item.type === 3) {
        meshInfo = this._getMeshNodeAttrOfPipe(cacheGeometries, reader, item, itemParent);
    } else if (item.type === 4) {
        meshInfo = this._getMeshNodeAttrOfBox(cacheGeometries, reader, item, itemParent);
    }

    if (!meshInfo) {
        return;
    }

    var nodeId = meshInfo.nodeId;

    var userDataReader = loader.getUserDataReader();
    var userData = userDataReader ? userDataReader.getUserData(userDataId) : null;

    var matrixCache = meshInfo.matrix.clone();

    // originalId is identical in one model, convert the originalId to identical in all models
    originalId += this.index * 100000000; // one model can not have more than 100000000 meshes in predictable future

    var nodeInfo = {
        nodeId: nodeId,
        name: userId ? userId: nodeId,
        userData: userData,
        meshId: meshInfo.meshId,
        matrix: matrixCache,
        materialId: mtlId,
        categoryId: categoryId,
        cellDepth: cellDepth,
        originalId: originalId
    };

    cacheCell.push(nodeInfo);
    meshInfo = null;
};

CLOUD.Model.prototype._readSymbolInfo = function (id, cellId, itemParent, categoryId, cellDepth) {

    var symbolReader = this.loader.getSymbolReader();

    if (!symbolReader) {
        return;
    }

    var symbolCount = symbolReader.header.symbolCount;

    if (id >= 0 && id < symbolCount) {
        var symbolCurrent = symbolReader.getSymbolInfo(id);

        for (var i = symbolCurrent.itemIndex; i < symbolCurrent.itemCount; ++i) {
            var item = symbolReader.getItemInfo(i);

            if (item.type === 0) {
                continue;
            }

            this._readMeshInfo(symbolReader, cellId, item, itemParent, categoryId, cellDepth);
        }
    }

};

CLOUD.Model.prototype._initWireframeData = function (geometry, meshId) {

    var wireframeIndex = CLOUD.BuildEdge(geometry.attributes.position.array, geometry.index.array);
    var wireframeGeometry = new THREE.BufferGeometry();
    wireframeGeometry.setIndex(wireframeIndex);
    wireframeGeometry.addAttribute('position', geometry.attributes.position, 3);
    this.cache.wireframeGeometries[meshId] = wireframeGeometry;

};

CLOUD.Model.prototype._getMeshNodeAttribute = function (sceneOrSymbolReader, item, itemParent) {

    var matrix = sceneOrSymbolReader.getMatrixInfo(item.matrixId).matrix.clone();
    var nodeId = itemParent ? itemParent.ItemId + "_" + item.ItemId : item.ItemId;
    var meshId = item.toData;

    var refMeshCache = this.referencedMeshCache;
    if (refMeshCache[meshId] === undefined) {    //liuw-d
        return null;
    }                                            //liuw-d
    var meshData = refMeshCache[meshId].M;

    if (meshData === undefined) {
        CLOUD.Logger.log("No mesh information.");
        return null;
    }

    var cacheGeometries = this.cache.geometries;
    var geometry = cacheGeometries[meshId];
    if (!geometry) {

        var positions = refMeshCache[meshId].P;
        var index = refMeshCache[meshId].I;
        var normal = refMeshCache[meshId].N;
        var uv = refMeshCache[meshId].UV;

        // if (positions == undefined || index == undefined) {
        //     CLOUD.Logger.log("empty mesh data");
        //     return null;
        // }

        geometry = new THREE.BufferGeometry();
        geometry.setIndex(new THREE.BufferAttribute(index, 1));
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

        if (normal) {
            geometry.addAttribute('normal', new THREE.BufferAttribute(normal, 3));
        }

        if (uv) {
            geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
        }

        // geometry.computeVertexNormals(); // 计算法线，影响光照
        cacheGeometries[meshId] = geometry;

        if (CLOUD.GlobalData.InitWireframeData) {
            this._initWireframeData(geometry, meshId);
        }

    }

    var matrixTmp = new THREE.Matrix4();
    matrixTmp.setPosition(new THREE.Vector3(meshData.baseX, meshData.baseY, meshData.baseZ));
    matrixTmp.scale(new THREE.Vector3(meshData.baseScale, meshData.baseScale, meshData.baseScale));

    if (meshData.baseScale !== 0.0) {
        matrix.multiply(matrixTmp);
    }

    if (itemParent) {
        matrix.multiplyMatrices(itemParent.matrix, matrix);
    }

    //meshData = null;
    //meshAttr = null;
    matrixTmp = null;

    return {nodeId: nodeId, meshId: meshId, matrix: matrix};
};

CLOUD.Model.prototype._getMeshNodeAttrOfTube = function (cacheGeometries, sceneOrSymbolReader, item, itemParent) {

    var geomAttr = sceneOrSymbolReader.getGeomPipeInfo(item.toData);
    var matrix = sceneOrSymbolReader.getMatrixInfo(item.matrixId).matrix.clone();
    var nodeId = itemParent ? itemParent.ItemId + "_" + item.ItemId : item.ItemId;
    var meshId = "tube";
    var geometry = cacheGeometries[meshId];

    if (!geometry) {
        geometry = CLOUD.GeomUtil.UnitCylinderInstance;
        cacheGeometries[meshId] = geometry;

        if (CLOUD.GlobalData.InitWireframeData) {
            this._initWireframeData(geometry, meshId);
        }
    }

    var startPt = geomAttr.startPt;
    var endPt = geomAttr.endPt;

    var dir = new THREE.Vector3();
    dir.subVectors(endPt, startPt);

    var len = dir.length();
    dir.normalize();

    var radius = geomAttr.radius;
    if (radius <= 1) {
        radius = 100;
    }

    var unitY = new THREE.Vector3(0, 1, 0);
    var scale = new THREE.Vector3(radius, len, radius);
    var quaternion = new THREE.Quaternion().setFromUnitVectors(unitY, dir);
    var position = startPt.clone().addScaledVector(dir, len * 0.5);

    var matrixTmp = new THREE.Matrix4().compose(position, quaternion, scale);
    matrix.multiply(matrixTmp);

    if (itemParent) {
        matrix.multiplyMatrices(itemParent.matrix, matrix);
    }

    geomAttr = null;

    return {nodeId: nodeId, meshId: meshId, matrix: matrix};
};

CLOUD.Model.prototype._getMeshNodeAttrOfPipe = function (cacheGeometries, sceneOrSymbolReader, item, itemParent) {

    var geomAttr = sceneOrSymbolReader.getGeomPipeInfo(item.toData);
    var matrix = sceneOrSymbolReader.getMatrixInfo(item.matrixId).matrix.clone();
    var nodeId = itemParent ? itemParent.ItemId + "_" + item.ItemId : item.ItemId;
    var meshId = "pipe";
    var geometry = cacheGeometries[meshId];

    if (!geometry) {
        geometry = CLOUD.GeomUtil.UnitCylinderInstance;
        cacheGeometries[meshId] = geometry;

        if (CLOUD.GlobalData.InitWireframeData) {
            this._initWireframeData(geometry, meshId);
        }
    }

    var startPt = geomAttr.startPt;
    var endPt = geomAttr.endPt;

    var dir = new THREE.Vector3();
    dir.subVectors(endPt, startPt);

    var len = dir.length();
    dir.normalize();

    var radius = geomAttr.radius;
    if (radius <= 1) {
        radius = 100;
    }

    var unitY = new THREE.Vector3(0, 1, 0);
    var scale = new THREE.Vector3(radius, len, radius);
    var quaternion = new THREE.Quaternion().setFromUnitVectors(unitY, dir);
    var position = startPt.clone().addScaledVector(dir, len * 0.5);

    var matrixTmp = new THREE.Matrix4().compose(position, quaternion, scale);
    matrix.multiply(matrixTmp);

    if (itemParent) {
        matrix.multiplyMatrices(itemParent.matrix, matrix);
    }

    geomAttr = null;

    return {nodeId: nodeId, meshId: meshId, matrix: matrix};
};

CLOUD.Model.prototype._getMeshNodeAttrOfBox = function (cacheGeometries, sceneOrSymbolReader, item, itemParent) {
    var matrix = sceneOrSymbolReader.getMatrixInfo(item.matrixId).matrix.clone();
    var bBox = item.boundingBox;
    var boxSize = bBox.getSize();
    var boxCenter = bBox.getCenter();
    var nodeId = itemParent ? itemParent.ItemId + "_" + item.ItemId : item.ItemId;
    var meshId = "box";
    var geometry = cacheGeometries[meshId];

    if (!geometry) {
        geometry = CLOUD.GeomUtil.UnitBoxInstance;
        cacheGeometries[meshId] = geometry;

        if (CLOUD.GlobalData.InitWireframeData) {
            this._initWireframeData(geometry, meshId);
        }
    }

    var matrixTmp = new THREE.Matrix4().scale(new THREE.Vector3(boxSize.x, boxSize.y, boxSize.z));
    matrixTmp.setPosition(boxCenter);
    matrix.multiply(matrixTmp);

    if (itemParent) {
        matrix.multiplyMatrices(itemParent.matrix, matrix);
    }

    return {nodeId: nodeId, meshId: meshId, matrix: matrix};
};

CLOUD.Model.prototype._overrideOcclusionMaterial = function (meshNode) {

    var material = meshNode.material;

    if (material) {

        // 只处理不透明的构件
        if (material.transparent === false) {

            var materialEx = this.manager.acquireMaterial();
            var newMaterial = materialEx.material;

            if (material.color) {
                newMaterial.color.copy(material.color);
            } else {
                materialEx.resetColor();
            }

            newMaterial.opacity = CLOUD.GlobalData.OcclusionOpacity;
            meshNode.material = newMaterial;
            meshNode.material.needsUpdate = true;
        }

    }

};

/**
 * 遮挡测试
 *
 */
CLOUD.Model.prototype._occlusionTest = function () {

    if (CLOUD.GlobalData.OcclusionTranslucentEnabled) {

        var meshes = this.pool.getObjects();
        var objectMap = this.manager.octantToObjectMap;
        var octantLen = this.occlusionVisibleOctant.length;

        if (octantLen > 0) {

            var frustum = this.manager.getFrustumFromOcclusionCamera();

            for (var i = 0; i < octantLen; ++i) {

                var cellId = this.occlusionVisibleOctant[i].octantId;
                var indexes = objectMap[cellId];

                if (indexes && indexes.length > 0) {

                    for (j = 0; j < indexes.length; j += 2) {
                        for (var k = indexes[j]; k <= indexes[j + 1]; k++) {

                            var meshNode = meshes[k];

                            if (CLOUD.CameraUtil.intersectObjectWithFrustum(meshNode, frustum)) {

                                this._overrideOcclusionMaterial(meshNode);
                            }

                        }
                    }
                }
            }

        }
    }
};

CLOUD.Model.prototype._sortVisibleOctant = function (camera) {

    var scope = this;

    var ancestorAndNeighbors = null;
    if (scope.containsCamera && scope.loader.octreeRootNodeI != null) {
        var octUtil = new CLOUD.OctantNeighborUtil(camera, scope.loader.octreeRootNodeI);
        ancestorAndNeighbors = octUtil.getAncestorAndNeighbors();
    }

    this.visibleOctant.sort(function (a, b) {
        if (ancestorAndNeighbors != null) {
            if (ancestorAndNeighbors[a.octantId] != undefined) {
                return -1;
            }

            if (ancestorAndNeighbors[b.octantId] != undefined) {
                return 1;
            }
        }
        if (a.priority > b.priority) {
            //  sort a to a lower index than b, i.e. a comes first.
            return -1;
        } else if (a.priority < b.priority) {
            return 1;
        }
        // same priority
        return 0;
    });
};

CLOUD.Model.prototype._readItemData = function (sceneReader, idx, cellId, categoryId, cellDepth) {

    var item = sceneReader.getItemInfo(idx);

    if (item === undefined) {
        return;
    }

    if (item.type === 0) {

        var matrixParent = sceneReader.getMatrixInfo(item.matrixId).matrix.clone();
        var itemParent = {
            matrix: matrixParent,
            ItemId: item.ItemId,
            originalId: item.originalId,
            userDataId: item.userDataId,
            materialId: item.materialId
        };

        this._readSymbolInfo(item.toData, cellId, itemParent, categoryId, cellDepth);
        itemParent = null;

    } else {

        this._readMeshInfo(sceneReader, cellId, item, null, categoryId, cellDepth);

    }
};

CLOUD.Model.prototype._getWireframeGroupName = function () {
    return CLOUD.ObjectGroupType.WIREFRAME + "_" + this.databagId;
};

CLOUD.Model.prototype._updateMeshNodes = function (totalNodeCount) {

    var pool = this.pool;
    var manager = this.manager;
    var sceneState = manager.sceneState;
    var filter = manager.filter;
    var bagId = this.databagId;

    var cache = this.cache;
    var cacheGeometries = cache.geometries;
    var cacheMaterials = cache.materials;

    var cachewireframeGeometries = cache.wireframeGeometries;

    var nodePriority = this.nodePriority;
    var priorityNodesSet = [nodePriority.high, nodePriority.medium, nodePriority.low];

    var selectionMaterial = null;
    if(nodePriority.high.length > 0) {
        selectionMaterial = sceneState.getSelectionMaterial();
    }
    var matrix = new THREE.Matrix4();

    var hasLowPriorityOverride = filter._hasLowPriorityOverride();

    var counter = 0;

    var octantStartIndex = -1;
    var curOctantId = -1;

    if (CLOUD.GlobalData.DrawingStyle != CLOUD.DrawingStyle.BOARDLINE) {

        for (var j = 0, count = priorityNodesSet.length; j < count; ++j) {

            var priorityNodes = priorityNodesSet[j];

            for (var i = 0, len = priorityNodes.length; i < len; ++i) {

                ++counter;

                if (counter > totalNodeCount) {
                    break;
                }

                var cacheNode = priorityNodes[i];
                var nodeId = cacheNode.nodeId;
                var userId = cacheNode.name;
                var userData = cacheNode.userData;
                var meshId = cacheNode.meshId;
                var originalId = cacheNode.originalId;
                matrix = cacheNode.matrix;

                var geometry = cacheGeometries[meshId];
                var materialId = cacheNode.materialId;

                // 材质过滤
                // Material override sequence:
                // 1, High priority material override: translucent or transparent
                // 2, selected object;
                // 3, low priority material override;
                // 4, hovered object by highlighting material
                var material = null;
                var selected = sceneState.isSelected(userId);
                if (j === 0) {
                    material = filter._getOverrideMaterial(cacheNode);
                    if (!material || selected) {
                        material = selectionMaterial;
                    }
                }
                else if (hasLowPriorityOverride) {
                    material = filter._getOverrideMaterial(cacheNode);
                }

                material = material || cacheMaterials[materialId];
                if (CLOUD.GlobalData.Hover &&
                    !CLOUD.GlobalData.EnableRenderPass) {
                    if (sceneState.hoverId === userId && selected === false) {
                        material = sceneState.getHoverMaterial(material);
                    }
                }

                var parameters = {
                    databagId: bagId,
                    nodeId: nodeId,
                    userId: userId,
                    originalId: originalId,
                    userData: userData,
                    geometry: geometry,
                    matrix: matrix,
                    material: material,
                    renderOrder: material.transparent ? 0 : CLOUD.GlobalData.MaximumDepth - cacheNode.cellDepth
                };

                var index = pool.get(parameters);
                material = null;
                if (index >= 0) {
                    if (curOctantId !== cacheNode.octantId) {
                        if (index > 0) {
                            manager.addObjectRangeToOctantMap(curOctantId, octantStartIndex, index - 1);
                        }

                        octantStartIndex = index;
                        curOctantId = cacheNode.octantId;
                    }
                }
                parameters = null;
            }
        }
    }
    selectionMaterial = null;

    if (CLOUD.GlobalData.DrawingStyle != CLOUD.DrawingStyle.SHADING) {

        var wireframeGroupNode = this.manager.scene.getOrCreateObjectGroup(this._getWireframeGroupName(), {globalSpace: true});
        // TODO: like the object pool, not clear the group every time. allocate the memory and wireframe mesh once
        //
        wireframeGroupNode.clear();

        counter = 0;

        for (var j = 0, count = priorityNodesSet.length; j < count; ++j) {

            var priorityNodes = priorityNodesSet[j];

            for (var i = 0, len = priorityNodes.length; i < len; ++i) {

                ++counter;

                if (counter > totalNodeCount) {
                    break;
                }

                var cacheNode = priorityNodes[i];
                var meshId = cacheNode.meshId;
                matrix = cacheNode.matrix;

                if (!cachewireframeGeometries.hasOwnProperty(meshId)) {
                    this._initWireframeData(cacheGeometries[meshId], meshId);
                }

                var lineMesh = new THREE.LineSegments(cachewireframeGeometries[meshId], this.wireframeMaterial);
                lineMesh.name = "Wireframes";

                lineMesh.applyMatrix(matrix.clone());

                wireframeGroupNode.add(lineMesh);

            }

        }

    }

    // add map for the last octant
    if (octantStartIndex !== -1) {
        manager.addObjectRangeToOctantMap(curOctantId, octantStartIndex, pool.counter - 1);
    }

    priorityNodesSet = null;
};

CLOUD.Model.prototype.load = function (notifyProgress) {
    this.loader.load(notifyProgress);
};

CLOUD.Model.prototype.setCrossOrigin = function (crossOrigin) {
    this.loader.setCrossOrigin(crossOrigin);
};

CLOUD.Model.prototype.setupWireframe = function () {

    if (CLOUD.GlobalData.DrawingStyle != CLOUD.DrawingStyle.SHADING) {

        var wireframeGroupNode = this.manager.scene.getObjectGroup(this._getWireframeGroupName());
        wireframeGroupNode.updateMatrixWorld(true);

    }
    else {

        this.manager.scene.removeObjectGroupByName(this._getWireframeGroupName());
    }


};

CLOUD.Model.prototype.prepare = function (camera) {

    // benchmark @ 20180314
    //console.time("model.prepare");
    
    if (!this.visible) {

        this.manager.scene.removeObjectGroupByName(this._getWireframeGroupName());
        return;

    }

    var sceneReaderArray = this.loader.getSceneReaderArray();
    var sceneCount = sceneReaderArray ? sceneReaderArray.length : 0;

    if (sceneCount < 1) {
        CLOUD.Logger.log("model load not started!");
        return;
    }

    // VAAS-100: Mesh and Other resource loading does not sync with reading process,
    // here do scene prepare after all of them loaded.
    // TODO: on-demand loading resource like mesh package, scene and material etc.
    if (!this.loaded) {
        console.log("model is not loaded!");
        return;
    }

    var sceneReader = sceneReaderArray[0];

    if (!sceneReader) {
        CLOUD.Logger.log("Empty scene");
        return;
    }

    // 先这样调用，采用世界系中的相机视锥，可以避免每次调用.
    this.updateOctreeNode();

    CLOUD.Logger.time("prepareScene");
    // 清除优先级集合
    this._clearNodePriority(false);
    if (this.nodePriority.low.length === 0) {
        this.nodePriority.low.length = this.renderableCount;
    }
    var prioritizedNodeCount = 0;
    var currentLowNodeCount = 0;
    var cellCount = 0;
    var enableOctant = CLOUD.GlobalData.EnableOctant;
    if (enableOctant) {

        var indoor = this.containsCamera;
        if (indoor) {
            //reset octant array before next culling
            this.visibleOctant.length = 0;

            //indoor: spatial first [ keep legacy way: (1) frustum culling on indoor and outdoor (2) logic culling]
            var octreeRootI = this.loader.getOctreeRootNodeInner();
            if (octreeRootI) {

                this._frustumCull(camera, octreeRootI);
            }

            var octreeRootNodeO = this.loader.getOctreeRootNodeOuter();
            if (octreeRootNodeO) {

                this._frustumCull(camera, octreeRootNodeO);
            }
            cellCount = this.visibleOctant.length;
            if (cellCount > 0) {

                this._sortVisibleOctant(camera);
                currentLowNodeCount = this._logicCull(sceneReader, indoor, currentLowNodeCount, cellCount);
            }

        } else {

            // outdoor first [ (1) frustum culling  followed by logic culling on outdoor (2) same way on indoor]
            var octreeRootNodeO = this.loader.getOctreeRootNodeOuter();
            if (octreeRootNodeO) {

                //reset octant array before next culling
                this.visibleOctant.length = 0;
                this._frustumCull(camera, octreeRootNodeO);
                cellCount = this.visibleOctant.length;
                if (cellCount > 0) {

                    this._sortVisibleOctant(camera);
                    currentLowNodeCount = this._logicCull(sceneReader, indoor, currentLowNodeCount, cellCount);
                }
            }
            prioritizedNodeCount = currentLowNodeCount + this.nodePriority.high.length + this.nodePriority.medium.length;

            // then indoor
            CLOUD.Logger.log("mesh count outdoor:", prioritizedNodeCount);
            if (prioritizedNodeCount < this.renderableCount) {

                var octreeRootI = this.loader.getOctreeRootNodeInner();
                if (octreeRootI) {
                    //reset octant array before next culling
                    this.visibleOctant.length = 0;
                    this._frustumCull(camera, octreeRootI);
                    cellCount = this.visibleOctant.length;
                    if (cellCount > 0) {

                        this._sortVisibleOctant(camera);
                        currentLowNodeCount = this._logicCull(sceneReader, indoor, currentLowNodeCount, cellCount);
                    }
                }
            }
        }
    } else {
        // read scene without space partition
        cellCount = sceneReader.header.cellCount;
        if (cellCount === 0) {
            return;
        }
        currentLowNodeCount = this._logicCull(sceneReader, true, currentLowNodeCount, cellCount);
    }
    prioritizedNodeCount = currentLowNodeCount + this.nodePriority.high.length + this.nodePriority.medium.length;

    this._updateTextureMapping();

    CLOUD.Logger.time("updateMeshNodes");
    if (prioritizedNodeCount > this.renderableCount) {
        prioritizedNodeCount = this.renderableCount;
    }
    this._updateMeshNodes(prioritizedNodeCount);
    CLOUD.Logger.timeEnd("updateMeshNodes");

    this.setupWireframe();

    this._occlusionTest();

    CLOUD.Logger.log("mesh count:", this.pool.counter, prioritizedNodeCount);
    CLOUD.Logger.timeEnd("prepareScene");

    // benchmark @ 20180314
    //console.timeEnd("model.prepare");
};

CLOUD.Model.prototype._frustumCull = function (camera, rootOctant) {

    var scope = this;
    var manager = this.manager;
    if (CLOUD.GlobalData.DEBUG) {
        manager.showOctreeBox(rootOctant);
    }

    // 'getFrustum' will updateMVP by default, here we do not update again.
    // MVP was already update in 'CameraControl::update'
    var frustum = camera.getFrustum();
    var depth = CLOUD.GlobalData.OctantDepth; // traverse till depth arrived.
    var viewProjectionMatrix = camera.projScreenMatrix;
    var octantBox = new THREE.Box3();
    var withPriority = true;
    intersectFrustum(rootOctant, frustum, depth, withPriority);

    function intersectFrustum(root, frustum, depth, withPriority) {

        var intersects;
        var node;

        if (frustum && root.depth < depth) {
            octantBox.set(root.min, root.max);
            intersects = frustum.intersectsBox(octantBox);
        }
        // if intersects
        if (intersects === true) {

            if (withPriority) {
                var screenBound = octantBox.applyMatrix4(viewProjectionMatrix);
                var screenSize = screenBound.getSize().length();

                // depth could less than 0, that's invalid. So we give an epsilon (0.000001).
                var nearDepth = screenBound.getCenter().z;
                nearDepth = (nearDepth > 0.000001) ? nearDepth : 0.000001;
                root.priority = screenSize / nearDepth;

                // gather visible objects
                scope.visibleOctant.push(root);
            } else {

                // gather occlusion objects
                scope.occlusionVisibleOctant.push(root);
            }

            // search subtree
            for (var i = 0, length = root.childOctants.length; i < length; ++i) {

                node = root.childOctants[i];
                intersectFrustum(node, frustum, depth, withPriority);
            }
        }
    }

    // TODO: 澄清该功能
    // -------------------- 遮挡视锥 -------------------- //
    var occlusionTranslucentEnabled = CLOUD.GlobalData.OcclusionTranslucentEnabled;
    if (occlusionTranslucentEnabled) {

        var occlusionFrustum = this.manager.getFrustumFromOcclusionCamera();
        intersectFrustum(rootOctant, occlusionFrustum, depth, !occlusionTranslucentEnabled);
    }
    // ---------------------------------------------------- //

    //CLOUD.Logger.log("Total Visible Octant Count: ", this.visibleOctant.length);

    return true;
};

CLOUD.Model.prototype._logicCull = function (sceneReader, indoor, curLowNodeCount, cellCount) {

    var manager = this.manager;

    var filter = manager.filter;

    var hasHiddenFileIdFilter = filter._hasHiddenFileIdFilter();
    var hasVisibleFilter = filter._hasVisibleFilter();
    var hasOverrideFilter = filter._hasOverrideMaterialFilter();
    var selectionSet = manager.sceneState.selectionSet;

    var cacheCells = this.cache.cells;

    var nodePriorityHigh = this.nodePriority.high;
    var nodePriorityMedium = this.nodePriority.medium;
    var nodePriorityLow = this.nodePriority.low;
    var maxLowNodeCount = this.nodePriority.low.length;

    function collectNodeInfo(nodeInfo, priorityCategories) {

        var userData = nodeInfo.userData;
        var categoryId = userData ? userData.categoryId : undefined;

        var mediumPriority = false;

        // 文件过滤
        if (hasHiddenFileIdFilter && filter._isHiddenFileId(nodeInfo)) {
            return;
        }

        // 可见性过滤
        if (hasVisibleFilter && (filter._isVisible(nodeInfo) === false)) {
            return;
        }

        // 材质过滤
        var isHighlight = selectionSet.hasOwnProperty(nodeInfo.name) ||
            ( hasOverrideFilter && filter._hasHighPriorityOverrideMaterial(nodeInfo));

        if (priorityCategories && categoryId && priorityCategories[categoryId]) {
            mediumPriority = true;
        }

        if (isHighlight) {
            nodePriorityHigh.push(nodeInfo);
        } else if (mediumPriority) {
            nodePriorityMedium.push(nodeInfo);
        } else if (curLowNodeCount < maxLowNodeCount) {
            nodePriorityLow[curLowNodeCount] = nodeInfo;
            curLowNodeCount++;
        }
    }

    CLOUD.Logger.time("collectNodeInfo");

    var priorityCategories = manager.getCategoriesFromHighPriority("outer");
    if (indoor === true) {
        priorityCategories = manager.getCategoriesFromHighPriority("inner");
    }

    var enableOctant = CLOUD.GlobalData.EnableOctant;
    var j, len = 0;
    for (var i = 0; i < cellCount; ++i) {

        var cellId, cellDepth = 0;

        if (enableOctant) {
            cellId = this.visibleOctant[i].octantId;
            cellDepth = this.visibleOctant[i].depth;
        } else {
            cellId = i;
        }

        var cacheCell = cacheCells[cellId];

        if (cacheCell === undefined) {

            // 缓存node数据
            cacheCell = cacheCells[cellId] = [];

            var cell = sceneReader.getCellInfo(cellId);

            for (j = cell.itemIndex; j < cell.itemCount; ++j) {
                this._readItemData(sceneReader, j, cellId, undefined, cellDepth);
            }

            for (j = 0, len = cacheCell.length; j < len; ++j) {
                cacheCell[j].octantId = cellId;
            }
        }

        for (j = 0, len = cacheCell.length; j < len; ++j) {
            collectNodeInfo(cacheCell[j], priorityCategories);
        }
    }

    CLOUD.Logger.timeEnd("collectNodeInfo");
    return curLowNodeCount;
};

CLOUD.Model.prototype.clearCells = function () {
    this.cache.cells = {};
};

CLOUD.Model.prototype.dispatchEvent = function (event) {
    this.manager.dispatchEvent(event);
};

CLOUD.Model.prototype.parse = function (json) {

    var dataView = json.view;

    //
    if (json.count !== undefined) {

        if (json.count.mesh_face !== undefined) {
            this.numOfTriangles += json.count.mesh_face;
        }

        this.renderableTotal = 0;
        if ((json.count.geom_box !== undefined)
            && (json.count.geom_pipe !== undefined)
            && (json.count.geom_tube !== undefined)
            && (json.count.mesh !== undefined)) {

            this.renderableTotal += json.count.geom_box;
            this.renderableTotal += json.count.geom_pipe;
            this.renderableTotal += json.count.geom_tube;
            this.renderableTotal += json.count.mesh;

            this.numOfTriangles += json.count.geom_box * 12;  // BoxBufferGeometry
            this.numOfTriangles += json.count.geom_pipe * 32; // CylinderBufferGeometry
            this.numOfTriangles += json.count.geom_tube * 32; // CylinderBufferGeometry

        } else if ((json.count.geom !== undefined)
            && (json.count.mesh !== undefined)) {

            this.renderableTotal += json.count.geom;
            this.renderableTotal += json.count.mesh;

            // Pipe and box is not notified in legacy data, so we use box as a estimated statics which is less than
            // real number of triangles..
            this.numOfTriangles += json.count.geom * 12;  // BoxBufferGeometry

            // Legacy data does not contain the number of elements, we use the data of render primitives.
            this.numOfElements = this.renderableTotal;
        }

        if (json.count.item !== undefined) {
            this.numOfElements = json.count.item;
        }
    }

    // 未定义或者1，表示Octree数据是经过变换的, 否则，没有变换
    // 如果octree没有经过变换，则进行变换
    if (dataView.transform !== 0) {
        this.transformed = true;
    } else {
        this.transformed = false;
    }

    this.boundingBoxWorld = CLOUD.Utils.box3FromArray(dataView.bbox);

    if (dataView.rotation) {

        var euler = new THREE.Euler();
        euler.fromArray(dataView.rotation);
        this.rotation.setFromEuler(euler, false);

    }

    if (dataView.position) {
        this.position.fromArray(dataView.position);
    }

    if (dataView.scale) {
        this.scale.fromArray(dataView.scale);
    }

    this.transformMatrix.compose(this.position, this.rotation, this.scale);

    this.manager.updateScene();
};

CLOUD.Model.prototype.getTextures = function () {
    return this.cache.textures;
};

CLOUD.Model.prototype.getMaterials = function () {
    return this.cache.materials;
};

CLOUD.Model.prototype.updateMaterials = function () {

    var materials = this.cache.materials;
    for (var id in materials) {
        if (materials.hasOwnProperty(id)) {
            var material = materials[id];
            material.IBLMaps = this.manager.scene.IBLMaps;
            material.refreshUniforms();
        }
    }

};

CLOUD.Model.prototype.updateMaterialsValue = function (type, value) {

    var materials = this.cache.materials;
    for (var id in materials) {
        if (materials.hasOwnProperty(id)) {
            var material = materials[id];
            if (material.hasOwnProperty(type)) {
                material[type] = value;
                if (material instanceof ImageBasedLighting.IBLMaterial) {
                    material.refreshUniforms();
                }
                material.needsUpdate = true;
            }
        }
    }

};

CLOUD.Model.prototype.changeAllMaterials = function (isIBL) {

    var materials = this.cache.materials;
    for (var id in materials) {
        if (materials.hasOwnProperty(id)) {
            var material = materials[id];
            var materialParameters = CLOUD.MaterialUtil.getMaterialParameters(material);
            var newMaterials;
            if (isIBL) {
                newMaterials = new ImageBasedLighting.IBLMaterial(materialParameters);
                newMaterials.type = 'IBL';
            }
            else {
                delete materialParameters.iblProbe;
                newMaterials = CLOUD.MaterialUtil.createStandardMaterial(materialParameters);
            }

            newMaterials.name = id;
            materials[id] = newMaterials;
            materialParameters = null;

        }
    }

};

CLOUD.Model.prototype.getReferencedMeshCache = function () {
    return this.referencedMeshCache;
};

CLOUD.Model.prototype.isLoaded = function () {
    return this.loaded;
};

CLOUD.Model.prototype.isVisible = function () {
    return this.visible;
};

CLOUD.Model.prototype.setVisible = function (visible) {
    this.visible = visible;
};

CLOUD.Model.prototype.calculateCameraModelRelation = function (cameraPos) {

    // BIMFACEDM-2821, let's detect inner bound, then outer bound.
    // In some small scale model, inner root does not exist.
    var modelBound = this.loader.getOctreeRootNodeInner();
    if (!modelBound) {
        modelBound = this.loader.getOctreeRootNodeOuter();
    }

    if (cameraPos.x < modelBound.min.x || cameraPos.x > modelBound.max.x ||
        cameraPos.y < modelBound.min.y || cameraPos.y > modelBound.max.y ||
        cameraPos.z < modelBound.min.z || cameraPos.z > modelBound.max.z) {
        // camera is outside of model's bound box
        this.containsCamera = false;
    } else {
        this.containsCamera = true;
    }
};

CLOUD.Model.prototype.getBoundingBoxWorld = function () {

    return this.boundingBoxWorld;
};

CLOUD.Model.prototype.getRenderableTotal = function () {

    return this.renderableTotal;
};

CLOUD.Model.prototype.setRenderableCount = function (count) {

    this.renderableCount = count;
    this._clearNodePriority(true);
};

CLOUD.Model.prototype.addCamera = function (camera) {
    this.cameraList.push(camera);
};

CLOUD.Model.prototype.getCameraNameList = function () {
    var names = [];
    for (var i = this.cameraList.length - 1; i >= 0; i--) {
        names.push(this.cameraList[i].name);
    }

    return names;
};

CLOUD.Model.prototype.getCamera = function (name) {
    for (var i = this.cameraList.length - 1; i >= 0; i--) {
        if (this.cameraList[i].name === name) {
            return this.cameraList[i];
        }
    }

    return null;
};

/**
 * 获得默认场景变换矩阵 - 兼容处理，以后要删除
 *
 */
CLOUD.Model.prototype.getTransformMatrix = function () {
    return this.transformMatrix;
};

/**
 * 更新 coctree 数据
 *
 */
CLOUD.Model.prototype.updateOctreeNode = (function () {

    var boundingBox = new THREE.Box3();

    function updateNode(node, matrix) {

        //boundingBox.set(node.min, node.max);
        boundingBox.copy(node.boundingBoxWorld);
        boundingBox.applyMatrix4(matrix);

        node.min.copy(boundingBox.min);
        node.max.copy(boundingBox.max);

        node.center = boundingBox.getCenter();
        node.size = boundingBox.getSize().lengthSq();
    }

    function traverse(parent, matrix) {

        for (var i = 0, len = parent.childOctants.length; i < len; ++i) {

            var child = parent.childOctants[i];
            updateNode(child, matrix);
            traverse(child, matrix);
        }
    }

    return function (force) {

        var scope = this;
        var matrixRoot = scope.manager.scene.getMatrixGlobal();

        if (force || this.firstOctreeTransform) {

            if (this.firstOctreeTransform) {
                this.firstOctreeTransform = false;
            }

            var octRootNodeOuter = scope.loader.getOctreeRootNodeOuter();

            if (octRootNodeOuter) {

                updateNode(octRootNodeOuter, matrixRoot);
                traverse(octRootNodeOuter, matrixRoot);
            }

            var octRootNodeInner = scope.loader.getOctreeRootNodeInner();

            if (octRootNodeInner) {

                updateNode(octRootNodeInner, matrixRoot);
                traverse(octRootNodeInner, matrixRoot);
            }
        }

    }
})();

/**
 * 模型管理类
 *
 * @class  CLOUD.ModelManager
 *
 */
CLOUD.ModelManager = function (filter) {

    // 考虑改进：GlobalData 中变量兼容多模型情况，需要在meshpool策略综合考虑
    // 默认为PC配置，假如应用层明确了是移动端，则配置为移动端
    // CLOUD.GlobalData.IsMobile 交由应用层设置
    if (CLOUD.GlobalData.IsMobile) {
        CLOUD.GlobalData.maxObjectNumInPool = 6000;
        CLOUD.GlobalData.maxDrawCacheNum = 4000;
    }
    this.scene = new CLOUD.Scene();
    this.filter = filter;
    this.crossOrigin = true;
    this.models = {};

    this.materialPool = null;

    this.occlusionCamera = null; // 遮挡裁剪相机

    // Does camera locate inside the scene bound scope
    this.containsCamera = false;

    this.highPriorityCategories = {inner: {}, outer: {}};
    this.octantToObjectMap = {};

    this.sceneState = new CLOUD.SceneStateHelper(this);

    this.rotation = new THREE.Quaternion();
    this.boundingBox = new THREE.Box3();

    this.IBLMaterial = false;

};

CLOUD.ModelManager.prototype.destroy = function () {

    for (var name in this.models) {
        this.models[name].destroy();
    }

    this.models = null;

    this.octantToObjectMap = null;

    this.scene.destroy();
    this.scene = null;

    if (this.materialPool) {
        this.materialPool.destroy();
        this.materialPool = null;
    }

    if (this.occlusionCamera) {
        this.occlusionCamera = null;
    }

    this.sceneState = new CLOUD.SceneStateHelper(this);

    this.rotation = null;
    this.boundingBox = null;
};

/**
 * 更新用于处理遮挡构件的相机状态
 *
 * @param {Object} camera - 场景相机
 * @private
 */
CLOUD.ModelManager.prototype._updateOcclusionCamera = function (camera) {

    var near = camera.near,
        far = camera.distanceFromWorldToDrawing(this.getMatrixWorldGlobal(), CLOUD.GlobalData.OcclusionDistanceToCamera);

    if (this.occlusionCamera) {
        this.occlusionCamera.copy(camera);
    } else {
        this.occlusionCamera = camera.clone();
    }

    this.occlusionCamera.setNearFar(near, far);
    this.occlusionCamera.updateMVP();
};

/**
 * 清除材质状态(仅仅将计数器置为1)
 *
 * @private
 */
CLOUD.ModelManager.prototype._clearMaterialPool = function () {

    if (this.materialPool) {
        this.materialPool.clear();
    }
};

/**
 * 从对象池中取出可以使用的对象
 *
 * @return {Object} 对象池中的一个对象
 */
CLOUD.ModelManager.prototype.acquireMaterial = function () {

    if (this.materialPool) {
        return this.materialPool.acquire();
    }

    return null;
};

CLOUD.ModelManager.prototype.getObjectPool = function () {
    return this.scene.getObjectPool();
};

/**
 * 获得遮挡相机视锥
 *
 * @return {Object} 遮挡相机视锥
 */
CLOUD.ModelManager.prototype.getFrustumFromOcclusionCamera = function () {
    return this.occlusionCamera.getFrustum(false);
};

/**
 * 获得遮挡相机
 *
 * @return {Object} 遮挡相机
 */
CLOUD.ModelManager.prototype.getOcclusionCamera = function () {
    return this.occlusionCamera;
};

// add index of mesh object to the map, key is id of octant which contains the mesh.
// objIndex: object index in object pool
CLOUD.ModelManager.prototype.addObjectRangeToOctantMap = function (octantId, startIndex, endIndex) {
    var map = this.octantToObjectMap;

    if (map[octantId] === undefined) {
        map[octantId] = [];
    }

    map[octantId].push(startIndex);
    map[octantId].push(endIndex);
};

CLOUD.ModelManager.prototype.getOctreeRoots = function () {
    var roots = [];
    var models = this.models;
    for (var id in models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            if (model.isLoaded()) {
                model.getOctreeRoots(roots);
            }
        }
    }

    return roots;
};

CLOUD.ModelManager.prototype.prepareScene = function (camera) {

    var models = this.models;

    this.clearPool();
    this.octantToObjectMap = {};

    if (CLOUD.GlobalData.OcclusionTranslucentEnabled) {
        if (this.materialPool == null) {
            this.materialPool = new CLOUD.ExpandableObjectPool();
            this.materialPool.init(CLOUD.MaterialEx, 50);
        }
        this._clearMaterialPool();
        this._updateOcclusionCamera(camera);
    }

    for (var id in models) {

        if (models.hasOwnProperty(id)) {

            var model = models[id];

            if (model.isLoaded()) {
                model.prepare(camera);
            }
        }
    }

};

/**
 * 清除对象池
 *
 */
CLOUD.ModelManager.prototype.clearPool = function () {

    this.scene.getObjectPool().clear();
};

/**
 * 加载模型
 *
 * @param {object} parameters - 加载配置项,包含 databagId, serverUrl, debug
 */
CLOUD.ModelManager.prototype.load = function (parameters, debut) {
    var models = this.models;

    // get from cache
    var model = models[parameters.databagId];

    if (model === undefined) {

        // get unique id for this new model
        var index = 0;
        var indexArr = []; // all model index
        for (var id in models) {
            if (models.hasOwnProperty(id)) {
                indexArr.push(models[id].index);
            }
        }
        indexArr.sort();
        for (var i = 0; i < indexArr.length; i++) {
            if (indexArr[i] !== i) {
                index = i;   // get an unused index
                break;
            }
        }

        model = new CLOUD.Model(this, parameters, index, debut);
        models[parameters.databagId] = model;

    } else {

        // 如果模型被隐藏了，重新加载显示模型
        if (!model.isVisible()) {

            model.setVisible(true);
            // 通知加载完成
            model.dispatchEvent({type: CLOUD.EVENTS.ON_LOAD_COMPLETE});
        }

        return model;
    }

    model.load(parameters.notifyProgress);

    return model;
};

/**
 * 卸载模型
 *
 * @param {string} databagId - 数据包名
 */
CLOUD.ModelManager.prototype.unload = function (databagId) {

    // get from cache
    var model = this.models[databagId];

    if (model) {

        model.destroy();
        delete this.models[databagId];

        this.updateScene();

        return true;
    }

    return false;
};

/**
 * 卸载所有模型
 *
 */
CLOUD.ModelManager.prototype.unloadAll = function () {
    var ids = this.getDataBagIds();

    for (var i = 0, len = ids.length; i < len; ++i) {
        this.unload(ids[i]);
    }

    this.clearPool();

    this.models = {};

};

/**
 * 显示指定模型
 *
 * @param {String} databagId - 模型数据包名
 * @return {Boolean} true：模型存在，否则模型不存在
 */
CLOUD.ModelManager.prototype.showModel = function (databagId) {

    var model = this.models[databagId];

    if (model) {

        model.setVisible(true);

        return true;
    }

    return false;
};

/**
 * 隐藏指定模型
 *
 * @param {String} databagId - 模型数据包名
 * @return {Boolean} true：模型存在，否则模型不存在
 */
CLOUD.ModelManager.prototype.hideModel = function (databagId) {

    var model = this.models[databagId];

    if (model) {

        model.setVisible(false);

        return true;
    }

    return false;
};

/**
 * 获得所有模型包名
 *
 */
CLOUD.ModelManager.prototype.getDataBagIds = function () {

    var models = this.models;
    var ids = [];

    for (var id in models) {

        if (models.hasOwnProperty(id)) {

            ids.push(id);

        }
    }

    return ids;

};

/**
 * 更新场景
 *
 */
CLOUD.ModelManager.prototype.updateScene = function () {

    this.updateSceneBoundingBox();
    this.updateSceneRootMatrix();
    this.updateSceneRenderable();
    this.updateOctreeNode();
};

/**
 * 更新场景包围盒
 *
 */
CLOUD.ModelManager.prototype.updateSceneBoundingBox = function () {

    var models = this.models;
    var boundingBox = this.boundingBox;
    boundingBox.makeEmpty();

    for (var id in models) {

        if (models.hasOwnProperty(id)) {

            var model = models[id];

            var boundingBoxTmp = model.getBoundingBoxWorld();
            if (boundingBoxTmp === null) {      //liuw-d
                continue;
            }                                   //liuw-d

            if (boundingBox.isEmpty()) {

                boundingBox.copy(boundingBoxTmp);

            } else {

                boundingBox.expandByPoint(boundingBoxTmp.min);
                boundingBox.expandByPoint(boundingBoxTmp.max);

            }

        }

    }

    this.scene.setBoundingBoxWorld(boundingBox);
};

/**
 * 更新场景矩阵
 *
 */
CLOUD.ModelManager.prototype.updateSceneRootMatrix = function () {

    var transformed = false;
    var transformMatrix = new THREE.Matrix4();
    var matrixRoot = new THREE.Matrix4();
    var rotation = new THREE.Quaternion();

    var models = this.models;

    // 对于多模型,应该保持旋转缩放矩阵一致，应该从数据层面修改矩阵变换

    // 多模型情况下的主旋转角度取第一个模型的角度
    // 如果采用模型数据提供的变换矩阵(从config.json中获得)，则只支持变换矩阵相同的多模型
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            rotation.copy(model.rotation);
            transformMatrix.copy(model.transformMatrix);
            transformed = model.transformed;
            break;
        }
    }

    // 用于兼容处理
    this.scene.setTransformMatrixGlobal(transformMatrix);

    if (transformed) {

        matrixRoot.copy(transformMatrix);

    } else {

        var scale = new THREE.Vector3(1, 1, 1);

        // fixed bug BIMFACEDM-1872 : 采用统一的scale
        var sceneSize = CLOUD.GlobalData.SceneSize;
        var boxSize = this.boundingBox.getSize();
        var maxLen = Math.max(boxSize.x, boxSize.y, boxSize.z);
        var sceneScale = sceneSize / maxLen;
        scale.multiplyScalar(sceneScale);

        matrixRoot.makeRotationFromQuaternion( rotation );
        matrixRoot.scale( scale );
    }

    this.scene.updateWorldMatrixByMatrix(matrixRoot);

};

/**
 * 更新模型可以进入对象池的数目, 暂时采用模型构件数的比例进行分配的策略
 *
 */
CLOUD.ModelManager.prototype.updateSceneRenderable = function () {

    var models = this.models;
    var poolSize = CLOUD.GlobalData.maxObjectNumInPool;
    var ids = [];
    var renderableTotal = 0;

    for (var id in models) {

        if (models.hasOwnProperty(id)) {

            var model = models[id];
            renderableTotal += model.getRenderableTotal();

            ids.push(id);

        }
    }

    var realTotal = 0;

    for (var i = 0, len = ids.length; i < len; ++i) {

        var id = ids[i];
        var model = models[id];
        var renderableCount = Math.floor(model.getRenderableTotal() / renderableTotal * poolSize);
        if (renderableCount > model.getRenderableTotal()) {
            renderableCount = model.getRenderableTotal();
        }

        model.setRenderableCount(renderableCount);
        realTotal += renderableCount;
    }

    this.scene.resizePool(realTotal > poolSize ? poolSize : realTotal);

};

/**
 * 更新 coctree 数据
 *
 */
CLOUD.ModelManager.prototype.updateOctreeNode = function () {

    var models = this.models;
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            if (model.isLoaded()) {
                model.updateOctreeNode(true);
            }
        }
    }

};


CLOUD.ModelManager.prototype.updateMaterials = function () {

    var models = this.models;
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            if (model.isLoaded()) {
                model.updateMaterials();
            }
        }
    }

};

CLOUD.ModelManager.prototype.updateMaterialsValue = function (type, value) {

    var models = this.models;
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            if (model.isLoaded()) {
                model.updateMaterialsValue(type, value);
            }
        }
    }

};

CLOUD.ModelManager.prototype.changeAllMaterials = function (isIBL) {

    if (this.IBLMaterial == isIBL) return;

    var models = this.models;
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            model.changeAllMaterials(isIBL);
        }
    }

    this.IBLMaterial = isIBL;

};

CLOUD.ModelManager.prototype.clearScene = function () {

    var models = this.models;

    for (var id in models) {

        if (models.hasOwnProperty(id)) {

            var model = models[id];
            model.clearCells();

        }
    }

};

// 跨域设置
CLOUD.ModelManager.prototype.setCrossOrigin = function (crossOrigin) {
    this.crossOrigin = crossOrigin;
};

CLOUD.ModelManager.prototype.getMatrixWorldGlobal = function () {
    return this.scene.getMatrixWorldGlobal();
};

CLOUD.ModelManager.prototype.hasModel = function () {

    var models = this.models;

    for (var id in models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            if (model.isLoaded()) {
                return true;
            }
        }
    }

    return false;
};

CLOUD.ModelManager.prototype.getModel = function (id) {

    var model = this.models[id];

    if (model && model.isLoaded()) {
        return model;
    }

    return null;
};
CLOUD.ModelManager.prototype.showOctreeBox = function (rootNode) {

    if (CLOUD.GlobalData.ShowOctant) {

        // not selectable, low display priority
        var octreeGroup = this.scene.getOrCreateObjectGroup(CLOUD.ObjectGroupType.OCTREENODE, {
            pickable: 0,
            priority: 2
        });

        function traverse(parent) {

            for (var i = 0, len = parent.childOctants.length; i < len; i++) {
                var child = parent.childOctants[i];
                var box = new THREE.Box3(child.min, child.max);
                var clr = 0xff;
                clr = clr << (child.depth * 5);

                var boxNode = new CLOUD.BBoxNode(box, clr);
                octreeGroup.add(boxNode);
                boxNode.updateMatrixWorld(true);

                traverse(child);
            }
        }


        octreeGroup.visible = true;

        if (octreeGroup.children.length === 0) {

            var box = new THREE.Box3(rootNode.min, rootNode.max);
            var clr = 0xff0000;
            var boxNode = new CLOUD.BBoxNode(box, clr);
            octreeGroup.add(boxNode);
            boxNode.updateMatrixWorld(true);

            traverse(rootNode);
        }

    } else {
        this.scene.removeObjectGroupByName(CLOUD.ObjectGroupType.OCTREENODE);
    }

};

CLOUD.ModelManager.prototype.setCategoriesToHighPriority = function (categories, side) {

    var len = categories.length;

    if (len < 1) {
        return;
    }

    var highPriorityCategories = this.highPriorityCategories[side] = {};

    for (var i = 0; i < len; ++i) {
        highPriorityCategories[categories[i]] = true;
    }
};

CLOUD.ModelManager.prototype.getCategoriesFromHighPriority = function (side) {
    return this.highPriorityCategories[side];
};

CLOUD.ModelManager.prototype.clearCategoriesFromHighPriority = function (side) {
    this.highPriorityCategories[side] = {};
};

CLOUD.ModelManager.prototype.clearAllCategoriesFromHighPriority = function () {
    this.clearCategoriesFromHighPriority("inner");
    this.clearCategoriesFromHighPriority("outer");
};

CLOUD.ModelManager.prototype.calculateCameraModelRelation = function (cameraPos) {

    // if one of models contains camera, then camera is inside the model.
    var contains = false;
    var models = this.models;

    for (var id in models) {

        if (models.hasOwnProperty(id)) {

            var model = models[id];
            if (model && model.isLoaded()) {
                // TODO: 遍历所有模型，因为每个模型的 containsCamera 值都应该计算
                // 用例：a. calculateNearFar时需要知道整体（所有模型合并包围盒）是否包含相机，某个模型
                //          没有加载完成时，render不刷新 （未实现)
                //       b. frustumCull 需要知道单个模型是否包含相机（已经实现）
                model.calculateCameraModelRelation(cameraPos);
                contains = contains || model.containsCamera;
            }
        }

    }

    this.containsCamera = contains;
};


CLOUD.ModelManager.prototype.getCameraNameList = function () {

    var models = this.models;
    var cameraList = [];
    for (var id in models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            cameraList = cameraList.concat(model.getCameraNameList());
        }
    }

    return cameraList;
};

CLOUD.ModelManager.prototype.getCamera = function (name) {

    var models = this.models;
    var camera = null;
    for (var id in models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            camera = model.getCamera(name);
            if (camera) {
                break;
            }
        }
    }

    return camera;
};

CLOUD.ModelManager.prototype.getNumOfElements = function () {

    var models = this.models;
    var numOfElements = 0;
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            numOfElements += model.numOfElements;
        }
    }
    return numOfElements;
};

CLOUD.ModelManager.prototype.getNumOfRenderables = function () {

    var models = this.models;
    var numOfRenderables = 0;
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            numOfRenderables += model.renderableTotal;
        }
    }
    return numOfRenderables;
};

CLOUD.ModelManager.prototype.getNumOfTriangles = function () {

    var models = this.models;
    var numOfTriangles = 0;
    for (var id in this.models) {
        if (models.hasOwnProperty(id)) {
            var model = models[id];
            numOfTriangles += model.numOfTriangles;
        }
    }
    return numOfTriangles;
};

// THREE.EventDispatcher.prototype.apply(CLOUD.ModelManager.prototype);
Object.assign(CLOUD.ModelManager.prototype, THREE.EventDispatcher.prototype);
CLOUD.ClipPlanes = function (size, center) {
    // high display priority, not pickable by normal editor because ClipPlaneTool will handle the pick
    CLOUD.ObjectGroup.call(this, CLOUD.ObjectGroupType.CLIPPLANE, {priority: 20});

    var faceName = [];
    faceName.push("clipPlane_right");
    faceName.push("clipPlane_left");
    faceName.push("clipPlane_top");
    faceName.push("clipPlane_bottom");
    faceName.push("clipPlane_front");
    faceName.push("clipPlane_back");

    this.cubeSize = size.clone();
    this.center = center.clone();

    this.visible = false;
    this.rotatable = false;

    this.selectIndex = null;

    this.planeOffset = new Array(6);

    this.planeRotate = [0, 0, 0];

    this.uniforms = {
        iClipPlane: {type: "i", value: 0},
        vClipPlane: {
            type: "v4v",
            value: new Array(new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4())
        }
    };

    this.clipplanes = null;

    this.calculation = true;

    this.getPlaneNormal = function (face) {
        var planeNormal = new THREE.Vector4();
        var index = Math.floor(face / 2);
        var mod = face % 2;
        planeNormal.setComponent(index, Math.pow(-1, mod));
        planeNormal["w"] = -this.cubeSize.getComponent(index) * 0.5;
        this.planeOffset[face] = 0;
        return planeNormal;
    };

    this.planeMaterial = new CLOUD.PhongLightingMaterial({
        color: 0x6699CC,
        opacity: 0.3,
        transparent: true,
        side: THREE.DoubleSide,
        lights: true
    });

    this.planeHighLightMatrial = new CLOUD.PhongLightingMaterial({
        color: 0x00FF80,
        opacity: 0.3,
        transparent: true,
        side: THREE.DoubleSide,
        lights: true
    });

    this.initPlaneModel = function (face) {
        var index = Math.floor(face / 2);
        var mod = face % 2;

        var width = (index == 0 ? this.cubeSize.z : this.cubeSize.x);
        var height = (index == 1) ? this.cubeSize.z : this.cubeSize.y;

        var plane = new THREE.PlaneGeometry(width, height);
        var planeMesh = new THREE.Mesh(plane, this.planeMaterial.clone());
        planeMesh.name = faceName[face];
        planeMesh.customTag = true;
        planeMesh.position.setComponent(index, Math.pow(-1, mod) * this.cubeSize.getComponent(index) * 0.5);
        if (index == 0) planeMesh.rotation.y = Math.pow(-1, mod) * Math.PI * 0.5;
        else if (index == 1) planeMesh.rotation.x = Math.pow(-1, mod) * Math.PI * 0.5;
        //else if (index == 2 && mod == 0) planeMesh.rotation.x = Math.PI;

        this.add(planeMesh);
    };

    this.initWireframes = function () {
        var vertexs = [
            -this.cubeSize.x * 0.5, -this.cubeSize.y * 0.5, -this.cubeSize.z * 0.5,
            this.cubeSize.x * 0.5, -this.cubeSize.y * 0.5, -this.cubeSize.z * 0.5,
            this.cubeSize.x * 0.5, this.cubeSize.y * 0.5, -this.cubeSize.z * 0.5,
            -this.cubeSize.x * 0.5, this.cubeSize.y * 0.5, -this.cubeSize.z * 0.5,

            -this.cubeSize.x * 0.5, -this.cubeSize.y * 0.5, this.cubeSize.z * 0.5,
            this.cubeSize.x * 0.5, -this.cubeSize.y * 0.5, this.cubeSize.z * 0.5,
            this.cubeSize.x * 0.5, this.cubeSize.y * 0.5, this.cubeSize.z * 0.5,
            -this.cubeSize.x * 0.5, this.cubeSize.y * 0.5, this.cubeSize.z * 0.5
        ];

        var colors = [
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0
        ];
        var indices = [
            0, 1,
            1, 2,
            2, 3,
            3, 0,
            4, 5,
            5, 6,
            6, 7,
            7, 4,
            0, 4,
            3, 7,
            1, 5,
            2, 6
        ];

        var geometry = new THREE.BufferGeometry();
		var material = new CLOUD.PhongLightingMaterial({
            color: 0xFFFFFF,
            lights: true
        });

        geometry.setIndex( indices );
		geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertexs, 3 ) );
        geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        geometry.computeBoundingSphere();

        var lineMesh = new THREE.LineSegments( geometry, material );
        lineMesh.name = "Wireframes";
        lineMesh.customTag = true;

        this.add(lineMesh);
    };

    this.updateClippingParams = function(uniforms){

    };

    this.enable = function(enable, visible) {
        this.visible = visible;
        this.uniforms.iClipPlane.value = enable ? 6 : 0;
        this.updateClippingParams(this.uniforms);
    };

    this.isEnabled = function () {
        return this.uniforms.iClipPlane.value !== 0 ;
    };

    var ClipPlanesInfo = function (enable, visible, rotatable, calculation, planeOffset, planeRotate, position, scale, quaternion, cubeSize, center) {
        this.enable = enable;
        this.visible = visible;
        this.rotatable = rotatable;
        this.calculation = calculation;
        this.planeOffset = planeOffset.slice(0);
        this.planeRotate = planeRotate.slice(0);
        this.position = position;
        this.scale = scale;
        this.quaternion = quaternion;
        this.cubeSize = cubeSize;
        this.center = center;
    };

    this.store = function () {
        return new ClipPlanesInfo(this.uniforms.iClipPlane.value ? true : false, this.visible, this.rotatable, this.calculation, this.planeOffset, this.planeRotate, this.position.clone(), this.scale.clone(), this.quaternion.clone(),
            this.cubeSize.clone(), this.center.clone());
    };

    this.restore = function (info) {
        this.calculation = true;
        this.calculationPlanes(info.cubeSize, info.center);

        this.enable(info.enable, info.visible);
        this.rotatable = info.rotatable;
        this.calculation = info.calculation;

        for (var i = 0; i < 6; ++i) {
            this.planeOffset[i] = info.planeOffset[i];
        }
        for (var i = 0; i < 3; ++i) {
            this.planeRotate[i] = info.planeRotate[i];
        }
        this.position.copy(info.position);
        this.scale.copy(info.scale);

        this.quaternion._w = info.quaternion._w;
        this.quaternion._x = info.quaternion._x;
        this.quaternion._y = info.quaternion._y;
        this.quaternion._z = info.quaternion._z;

        this.update();
    };

    this.reset = function () {
        this.calculation = true;
        for (var i = 0; i < 6; ++i) {
            this.planeOffset[i] = 0;
        }
        for (var i = 0; i < 3; ++i) {
            this.planeRotate[i] = 0;
        }
        this.position.copy(this.center);
        this.scale.copy(new THREE.Vector3(1.0, 1.0, 1.0));
        this.quaternion.copy(new THREE.Quaternion());
        this.update();
    };

    this.calculationPlanes = function (size, center) {
        if (!this.calculation) return;

        this.cubeSize.copy(size);
        this.center.copy(center);

        var len = this.children.length;
        for (var i = len - 1; i >= 0; --i) {
            this.remove(this.children[i]);
        }

        for (var i = 0; i < 6; ++i) {
            this.uniforms.vClipPlane.value[i] = this.getPlaneNormal(i);
            this.initPlaneModel(i);
        }

        this.initWireframes();

        this.clipplanes = this.uniforms.vClipPlane.value.slice(0);

        this.reset();
    };

    this.update = function () {
        this.updateMatrixWorld();
        var m = new THREE.Matrix4();
        m.getInverse(this.matrix);
        m.transpose();
        for (var i = 0; i < 6; ++i) {
            this.uniforms.vClipPlane.value[i] = this.clipplanes[i].clone().applyMatrix4(m);
        }
        this.updateClippingParams(this.uniforms);
    };

    this.offset = function (face, offset) {
        this.calculation = false;

        var index = Math.floor(face / 2);
        var mod = face % 2;
        this.planeOffset[face] += offset;

        var size = this.cubeSize.getComponent(index) * 0.5;

        var centerOffset = new THREE.Vector3();
        for (var i = 0; i < 6; ++i) {
            var normal = this.clipplanes[i].clone();
            var planeOffset = this.planeOffset[i];
            var deltaOffset = new THREE.Vector3(normal.x * planeOffset, normal.y * planeOffset, normal.z * planeOffset);
            centerOffset.add(deltaOffset);
        }

        var scale = 1 + (centerOffset.getComponent(index) / this.cubeSize.getComponent(index));
        if (scale > 0.0) {
            this.scale.setComponent(index, scale);
            var tempClipPlane = this.uniforms.vClipPlane.value[face].clone();
            var tempNormal = new THREE.Vector3(tempClipPlane.x, tempClipPlane.y, tempClipPlane.z);
            tempNormal.normalize();
            var deltaOffset = offset;
            var offsetVector = new THREE.Vector3(tempNormal.x * deltaOffset, tempNormal.y * deltaOffset, tempNormal.z * deltaOffset);
            if (face % 2 == 1) {
                this.position.sub(offsetVector.multiplyScalar(0.5));
            } else {
                this.position.add(offsetVector.multiplyScalar(0.5));
            }

            this.update();
        } else {
            this.planeOffset[face] -= offset;
        }
    };

    var tempQuaternion = new THREE.Quaternion();

    var unitX = new THREE.Vector3(1.0, 0.0, 0.0);
    this.rotX = function (rot) {
        this.calculation = false;
        tempQuaternion.setFromAxisAngle(unitX, rot);
        this.quaternion.multiply(tempQuaternion);
        this.update();
    };

    var unitY = new THREE.Vector3(0.0, 1.0, 0.0);
    this.rotY = function (rot) {
        this.calculation = false;
        tempQuaternion.setFromAxisAngle(unitY, rot);
        this.quaternion.multiply(tempQuaternion);
        this.update();
    };

    this.setSectionBox = function(min, max) {
        this.calculation = true;
        var cubeSize = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
        var center = new THREE.Vector3((min.x + max.x) * 0.5, (min.y + max.y) * 0.5, (min.z + max.z) * 0.5);
        this.calculationPlanes(cubeSize, center);
    };

    this.moveSectionPlane = function(planeName, offset) {
        var face = -1;
        if (planeName == 'right') {
            face = 0;
        }
        else if(planeName == 'left') {
            face = 1;
        }
        else if(planeName == 'top') {
            face = 2;
        }
        else if(planeName == 'bottom') {
            face = 3;
        }
        else if(planeName == 'front') {
            face = 4;
        }
        else if(planeName == 'back') {
            face = 5;
        }

        if (face != -1) {
            if (face % 2 != 0) {
                offset = -offset;
            }
            var delta = offset - this.planeOffset[face];
            this.offset(face, delta);
        }
    };

    var unitZ = new THREE.Vector3(0.0, 0.0, 1.0);
    this.rotateSectionBox = function(axis, offset) {
        if (axis == 'x') {
            this.planeRotate[0] = offset;
        }
        else if (axis == 'y') {
            this.planeRotate[1] = offset;
        }
        else if (axis == 'z') {
            this.planeRotate[2] = offset;
        }

        this.calculation = true;

        var tempQuaternionX = new THREE.Quaternion();
        tempQuaternionX.setFromAxisAngle(unitX, this.planeRotate[0]);

        var tempQuaternionY = new THREE.Quaternion();
        tempQuaternionY.setFromAxisAngle(unitY, this.planeRotate[1]);

        var tempQuaternionZ = new THREE.Quaternion();
        tempQuaternionZ.setFromAxisAngle(unitZ, this.planeRotate[2]);
        
        var tempQuaternion = new THREE.Quaternion();
        tempQuaternion.multiply(tempQuaternionX);
        tempQuaternion.multiply(tempQuaternionY);
        tempQuaternion.multiply(tempQuaternionZ);
        
        this.quaternion.copy(tempQuaternion);
        this.update();
    };

    this.highLight = function () {
        if (this.selectIndex == null)
            return;
        this.children[this.selectIndex].material = this.planeHighLightMatrial.clone();
    };

    this.cancelHighLight = function () {
        if (this.selectIndex == null)
            return;
        this.children[this.selectIndex].material = this.planeMaterial.clone();
        this.selectIndex = null;
    };
};

CLOUD.ClipPlanes.prototype = Object.create(CLOUD.ObjectGroup.prototype);
CLOUD.ClipPlanes.prototype.constructor = CLOUD.ClipPlanes;

CLOUD.ClipPlanes.prototype.init = function () {
    this.calculationPlanes(this.cubeSize, this.center);
};

CLOUD.ClipPlanes.prototype.hitTest = function (raycaster) {
    var minDistance = null;
    var minSign = null;

    this.raycast(raycaster);
    if (this.selectIndex != null) {
        var ray = raycaster.ray;
        var plane = new THREE.Plane();
        var v4 = this.uniforms.vClipPlane.value[this.selectIndex];
        plane.setComponents(v4.x, v4.y, v4.z, v4.w);
        minDistance = ray.distanceToPlane(plane);
        minSign = ray.direction.dot(plane.normal) < 0;
    }

    return {sign: minSign, distance: minDistance};
};

CLOUD.ClipPlanes.prototype.raycast = function (raycaster) {

    if (!this.visible) return;

    var planeIntersects = [];
    var selectPlane = null;
	
    this.selectIndex = null;
		
    for (var i = 0, len = 6; i < len; i++) {
		this.children[i].raycast(raycaster, planeIntersects);
        if (planeIntersects.length > 0) {
			var plane = planeIntersects.pop();
            if (!selectPlane || plane.distance < selectPlane.distance) {
                selectPlane = plane;
                this.selectIndex = i;
            }
			
			planeIntersects = [];
        }
    }
    
};
CLOUD.FillClipPlane = function (size, center) {

    CLOUD.ObjectGroup.call(this, CLOUD.ObjectGroupType.FILLCLIPPLANE, {priority: 20});

    this.cubeSize = size.clone();
    this.center = center.clone();

    this.planeOffset = 0.0;

    this.visible = false;
    this.rotatable = false;

    this.hit = false;

    this.clipplane = new THREE.Vector4();

    this.uniforms = {
        iClipPlane: {value: 0},
        vClipPlane: {value: new Array(new THREE.Vector4())}
    };

    this.planeMaterial = new CLOUD.PhongLightingMaterial({
        color: 0x6699CC,
        opacity: 0.3,
        transparent: true,
        side: THREE.DoubleSide,
        lights: true
    });

    this.planeHighLightMatrial = new CLOUD.PhongLightingMaterial({
        color: 0x00FF80,
        opacity: 0.3,
        transparent: true,
        side: THREE.DoubleSide,
        lights: true
    });

    this.initPlaneModel = function () {
        var max = Math.max(this.cubeSize.x, this.cubeSize.y);
        var plane = new THREE.PlaneGeometry(max, max);
        var planeMesh = new THREE.Mesh(plane, this.planeMaterial.clone());
        planeMesh.name = "fillClipPlane";
        planeMesh.customTag = true;

        this.position.copy(this.center);

        this.clipplane.set(0, 0, 1, 0);

        this.add(planeMesh);
    };

    this.updateClippingParams = function(uniforms){

    };

    this.enable = function(enable, visible) {
        this.visible = visible;
        this.uniforms.iClipPlane.value = enable ? 1 : 0;
        this.update();
    };

    this.isEnabled = function () {
        return this.uniforms.iClipPlane.value == 0 ? false : true;
    };

    this.update = function () {
        this.updateMatrixWorld();
        var m = new THREE.Matrix4();
        m.getInverse(this.matrix);
        m.transpose();
        this.uniforms.vClipPlane.value[0] = this.clipplane.clone().applyMatrix4(m);
        this.updateClippingParams(this.uniforms);
    };

    this.offset = function (offset) {
        var tempClipPlane = this.uniforms.vClipPlane.value[0].clone();
        var tempNormal = new THREE.Vector3(tempClipPlane.x, tempClipPlane.y, tempClipPlane.z);
        tempNormal.normalize();
        var offsetVector = new THREE.Vector3(tempNormal.x * offset, tempNormal.y * offset, tempNormal.z * offset);
        this.position.add(offsetVector);

        this.update();
    };

    this.setOffset = function (offset) {
        var tempClipPlane = this.uniforms.vClipPlane.value[0].clone();
        var tempNormal = new THREE.Vector3(tempClipPlane.x, tempClipPlane.y, tempClipPlane.z);
        tempNormal.normalize();
        var offsetVector = new THREE.Vector3(tempNormal.x * offset, tempNormal.y * offset, tempNormal.z * offset);
        this.position.copy(this.center).add(offsetVector);

        this.update();
    };

    //模型坐标系是Z轴朝上，OpenGL坐标系是Y轴朝上，平面模型在模型坐标系中是XOZ平面-Y法线
    this.changeNormal = function(index) {

        var mesh = this.children[0];
        if (index == 0) {
            this.clipplane.set(1, 0, 0, 0);// OpenGL中的X法线
            mesh.rotation.set(0.0, Math.PI / 2, 0.0);// 旋转到模型YOZ平面
        }
        else if (index == 1) {
            this.clipplane.set(-1, 0, 0, 0);// OpenGL中的-X法线
            mesh.rotation.set(0.0, -Math.PI / 2, 0.0);// 旋转到模型YOZ平面
        }
        else if (index == 2) {
            this.clipplane.set(0, 0, -1, 0);// OpenGL中的-Z法线
            mesh.rotation.set(Math.PI, 0.0, 0.0);// 旋转到模型XOZ平面
        }
        else if (index == 3) {
            this.clipplane.set(0, 0, 1, 0);// OpenGL中的Z法线
            mesh.rotation.set(0.0, 0.0, 0.0);// 旋转到模型XOZ平面
        }
        else if (index == 4) {
            this.clipplane.set(0, 1, 0, 0);// OpenGL中的Y法线
            mesh.rotation.set(-Math.PI / 2, 0.0, 0.0);// 旋转到模型XOY平面
        }
        else if (index == 5) {
            this.clipplane.set(0, -1, 0, 0);// OpenGL中的-Y法线
            mesh.rotation.set(Math.PI / 2, 0.0, 0.0);// 旋转到模型XOY平面
        }
        

        mesh.updateMatrixWorld();
        this.update();

    };

    var tempQuaternion = new THREE.Quaternion();

    var unitX = new THREE.Vector3(1.0, 0.0, 0.0);
    this.rotX = function (rot) {
        tempQuaternion.setFromAxisAngle(unitX, rot);
        this.quaternion.multiply(tempQuaternion);
        this.update();
    };

    var unitY = new THREE.Vector3(0.0, 1.0, 0.0);
    this.rotY = function (rot) {
        tempQuaternion.setFromAxisAngle(unitY, rot);
        this.quaternion.multiply(tempQuaternion);
        this.update();
    };

    this.highLight = function () {
        this.children[0].material = this.planeHighLightMatrial.clone();
    };

    this.cancelHighLight = function () {
        this.children[0].material = this.planeMaterial.clone();
        this.hit = false;
    };
};

CLOUD.FillClipPlane.prototype = Object.create(CLOUD.ObjectGroup.prototype);
CLOUD.FillClipPlane.prototype.constructor = CLOUD.FillClipPlane;

CLOUD.FillClipPlane.prototype.init = function () {
    this.initPlaneModel();
};

CLOUD.FillClipPlane.prototype.hitTest = function (raycaster) {

    if (!this.visible) return;

    var minDistance = null;
    var minSign = null;

    this.hit = this.raycast(raycaster);
    if (this.hit) {
        var ray = raycaster.ray;
        var plane = new THREE.Plane();
        var v4 = this.uniforms.vClipPlane.value[0];
        plane.setComponents(v4.x, v4.y, v4.z, v4.w);
        minDistance = ray.distanceToPlane(plane);
        minSign = ray.direction.dot(plane.normal) < 0;
    }

    return {sign: minSign, distance: minDistance};
};

CLOUD.FillClipPlane.prototype.raycast = function (raycaster, intersects) {
    var planeIntersects = [];
    this.children[0].raycast(raycaster, planeIntersects);
    if (planeIntersects.length > 0) {
        return true;
    }

    return false;
};
CLOUD.ClipPlaneService = function (viewer) {

    this.viewer = viewer;
    this.planes = [];

    for (var ii = 0; ii < 6; ++ii) {
        this.planes.push(new THREE.Plane());
    }
};

CLOUD.ClipPlaneService.prototype = {

    construtor: CLOUD.ClipPlaneService,

    destroy: function () {
        this.viewer = null;
        this.planes = [];
    },

    update: function (camera) {

        var editor = this.getEditor();

        if (editor) {
            editor.update(camera);
            this.viewer.render();
        }
    },

    getEditor: function () {
        var tools = this.viewer.editorManager.tools;
        //var editor = editors[CLOUD.EditorMode.CLIP_BY_BOX];
        for (var i = 0; i < tools.length; i++) {
            if (tools[i].getName() == CLOUD.EditToolMode.CLIP_BY_BOX) {
                return tools[i];
            }
        }
        return null;
    },

    toggle: function (enable, visible) {
        var editor = this.getEditor();
        editor.toggle(enable, visible);
    },

    // 显示/隐藏切面
    setVisible: function (enable) {
        var editor = this.getEditor();
        editor.visible(enable);
    },

    setRotatable: function (enable) {
        var editor = this.getEditor();
        editor.rotatable(enable);
    },

    enablePick: function (enable) {
        var editor = this.getEditor();
        editor.enablePick = enable;
    },

    saveState: function () {
        var editor = this.getEditor();
        return editor.store();
    },

    loadState: function (info) {
        var editor = this.getEditor();
        editor.restore(info);
    },

    reset: function () {
        var editor = this.getEditor();
        editor.reset();
    }
};

var ImageBasedLighting = ImageBasedLighting || {};

ImageBasedLighting.brdf_vs = [

	"varying vec2 vUV;",

	"void main() {",
	"	vUV = uv;",
	"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	"}"

].join('\n');

ImageBasedLighting.brdf_fs = [

	"varying vec2 vUV;",
	"uniform sampler2D HammersleyTable;",

	"const float PI = 3.14159265358979;",

	"float GGX(float NdotV, float alpha)",
	"{",
	"	float alpha2 = pow(alpha, 2.0);",
	"	return 2.0 * NdotV / (NdotV + sqrt(alpha2 + (1.0 - alpha2) * NdotV * NdotV));",
	"}",

	"float G_Smith(float NdotV, float NdotL, float roughness)",
	"{",
	"	float alpha = pow(roughness, 2.0);",
	"	return GGX(NdotV, alpha) * GGX(NdotL, alpha);",
	"}",
	
	"vec3 ImportanceSampleGGX(vec2 Xi, vec3 N, float roughness)",
	"{",
	"	float a = roughness * roughness;",

	"	float Phi = 2.0 * PI * Xi.x; ",
	"	float CosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y)); ",
	"	float SinTheta = sqrt(1.0 - CosTheta * CosTheta);",

	"	vec3 H;",
	"	H.x = SinTheta * cos(Phi); ",
	"	H.y = SinTheta * sin(Phi); ",
	"	H.z = CosTheta;",

	"	vec3 UpVector = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0); ",
	"	vec3 TangentX = normalize(cross(UpVector, N)); ",
	"	vec3 TangentY = cross(N, TangentX);",

		// Tangent to world space 
	"	return normalize(TangentX * H.x + TangentY * H.y + N * H.z);",
	"}",

	"vec2 IntegrateBRDF(float NdotV, float roughness)",
	"{",
	"	vec3 N = vec3(0.0, 0.0, 1.0);",
	"	vec3 V = vec3(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);",
	"	vec2 result = vec2(0.0, 0.0);",

	"	const int NumSamples = 1024;",
	"	for (int i = 0; i < NumSamples; i++)",
	"	{",
	"		float u = float(i) / float(NumSamples);",
	"		vec2 Xi = vec2(u, texture2D(HammersleyTable, vec2(u)).r);",
	"		vec3 H = ImportanceSampleGGX(Xi, N, roughness);",
	"		vec3 L = 2.0 * dot(V, H) * H - V;",

	"		float NdotL = saturate(L.z);",
	"		float NdotH = saturate(H.z);",
	"		float VdotH = saturate(dot(V, H));",
	"		float NdotV = saturate(dot(N, V));",
	"		if (NdotL > 0.0)",
	"		{",
	"			float G = G_Smith(NdotV, NdotL, roughness);",
	"			float G_Vis = G * VdotH / (NdotH * NdotV); ",
	"			float F = pow(1.0 - VdotH, 5.0);",
	"			result.x += (1.0 - F) * G_Vis;",
	"			result.y += F * G_Vis;",
	"		}",
	"	}",

	"	return result / float(NumSamples);",
	"}",

	"void main()",
	"{",
	"	vec2 brdf = IntegrateBRDF(vUV.x, vUV.y);",
	"	gl_FragColor = vec4(brdf, 0.0, 1.0);",
	"}"

].join('\n');

ImageBasedLighting.BRDFMap = function(hammersleyTable, resolution) {

	this.texture = null;

	this.resolution = resolution || 512;

	this.brdfMaterial = new THREE.ShaderMaterial({
		vertexShader: ImageBasedLighting.brdf_vs,
		fragmentShader: ImageBasedLighting.brdf_fs,
		uniforms: {
			HammersleyTable: { value: hammersleyTable }
		},
		lights:false
	});

	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight), this.brdfMaterial);
	this.quad.position.z = -100;

};

ImageBasedLighting.BRDFMap.prototype.constructor = ImageBasedLighting.BRDFMap;

ImageBasedLighting.BRDFMap.prototype.generateMap = function(renderer) {

	var scene = new THREE.Scene();
	scene.add(this.quad);

	var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	camera.position.z = 100;

	var rtt = new THREE.WebGLRenderTarget(this.resolution, this.resolution, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
	renderer.render(scene, camera, rtt, true);

	this.texture = rtt.texture;

};
/**
* @author Prashant Sharma / spidersharma03
* @author Ben Houston / http://clara.io / bhouston
*/

THREE.HDRCubeTextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	// override in sub classes
	this.hdrLoader = new THREE.RGBELoader();

};

THREE.HDRCubeTextureLoader.prototype.load = function ( type, urls, onLoad, onProgress, onError ) {

	var RGBEByteToRGBFloat = function ( sourceArray, sourceOffset, destArray, destOffset ) {

		var e = sourceArray[ sourceOffset + 3 ];
		var scale = Math.pow( 2.0, e - 128.0 ) / 255.0;

		destArray[ destOffset + 0 ] = sourceArray[ sourceOffset + 0 ] * scale;
		destArray[ destOffset + 1 ] = sourceArray[ sourceOffset + 1 ] * scale;
		destArray[ destOffset + 2 ] = sourceArray[ sourceOffset + 2 ] * scale;

	};

	var RGBEByteToRGBHalf = ( function () {

		// Source: http://gamedev.stackexchange.com/questions/17326/conversion-of-a-number-from-single-precision-floating-point-representation-to-a/17410#17410

		var floatView = new Float32Array( 1 );
		var int32View = new Int32Array( floatView.buffer );

		/* This method is faster than the OpenEXR implementation (very often
		 * used, eg. in Ogre), with the additional benefit of rounding, inspired
		 * by James Tursa?s half-precision code. */
		function toHalf( val ) {

			floatView[ 0 ] = val;
			var x = int32View[ 0 ];

			var bits = ( x >> 16 ) & 0x8000; /* Get the sign */
			var m = ( x >> 12 ) & 0x07ff; /* Keep one extra bit for rounding */
			var e = ( x >> 23 ) & 0xff; /* Using int is faster here */

			/* If zero, or denormal, or exponent underflows too much for a denormal
			 * half, return signed zero. */
			if ( e < 103 ) return bits;

			/* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
			if ( e > 142 ) {

				bits |= 0x7c00;
				/* If exponent was 0xff and one mantissa bit was set, it means NaN,
						 * not Inf, so make sure we set one mantissa bit too. */
				bits |= ( ( e == 255 ) ? 0 : 1 ) && ( x & 0x007fffff );
				return bits;

			}

			/* If exponent underflows but not too much, return a denormal */
			if ( e < 113 ) {

				m |= 0x0800;
				/* Extra rounding may overflow and set mantissa to 0 and exponent
				 * to 1, which is OK. */
				bits |= ( m >> ( 114 - e ) ) + ( ( m >> ( 113 - e ) ) & 1 );
				return bits;

			}

			bits |= ( ( e - 112 ) << 10 ) | ( m >> 1 );
			/* Extra rounding. An overflow will set mantissa to 0 and increment
			 * the exponent, which is OK. */
			bits += m & 1;
			return bits;

		}

		return function ( sourceArray, sourceOffset, destArray, destOffset ) {

			var e = sourceArray[ sourceOffset + 3 ];
			var scale = Math.pow( 2.0, e - 128.0 ) / 255.0;

			destArray[ destOffset + 0 ] = toHalf( sourceArray[ sourceOffset + 0 ] * scale );
			destArray[ destOffset + 1 ] = toHalf( sourceArray[ sourceOffset + 1 ] * scale );
			destArray[ destOffset + 2 ] = toHalf( sourceArray[ sourceOffset + 2 ] * scale );

		};

	} )();

	//

	var texture = new THREE.CubeTexture();

	texture.type = type;
	texture.encoding = ( type === THREE.UnsignedByteType ) ? THREE.RGBEEncoding : THREE.LinearEncoding;
	texture.format = ( type === THREE.UnsignedByteType ) ? THREE.RGBAFormat : THREE.RGBFormat;
	texture.minFilter = ( texture.encoding === THREE.RGBEEncoding ) ? THREE.NearestFilter : THREE.LinearFilter;
	texture.magFilter = ( texture.encoding === THREE.RGBEEncoding ) ? THREE.NearestFilter : THREE.LinearFilter;
	texture.generateMipmaps = ( texture.encoding !== THREE.RGBEEncoding );
	texture.anisotropy = 0;

	var scope = this.hdrLoader;
	var manager = this.manager;

	var loaded = 0;

	function loadHDRData( i, onLoad, onProgress, onError ) {

		var loader = new THREE.FileLoader( manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( urls[ i ], function ( buffer ) {

			loaded ++;

			var texData = scope._parser( buffer );

			if ( ! texData ) return;

			if ( type === THREE.FloatType ) {

				var numElements = ( texData.data.length / 4 ) * 3;
				var floatdata = new Float32Array( numElements );

				for ( var j = 0; j < numElements; j ++ ) {

					RGBEByteToRGBFloat( texData.data, j * 4, floatdata, j * 3 );

				}

				texData.data = floatdata;

			} else if ( type === THREE.HalfFloatType ) {

				var numElements = ( texData.data.length / 4 ) * 3;
				var halfdata = new Uint16Array( numElements );

				for ( var j = 0; j < numElements; j ++ ) {

					RGBEByteToRGBHalf( texData.data, j * 4, halfdata, j * 3 );

				}

				texData.data = halfdata;

			}

			if ( undefined !== texData.image ) {

				texture[ i ].images = texData.image;

			} else if ( undefined !== texData.data ) {

				var dataTexture = new THREE.DataTexture( texData.data, texData.width, texData.height );
				dataTexture.format = texture.format;
				dataTexture.type = texture.type;
				dataTexture.encoding = texture.encoding;
				dataTexture.minFilter = texture.minFilter;
				dataTexture.magFilter = texture.magFilter;
				dataTexture.generateMipmaps = texture.generateMipmaps;

				texture.images[ i ] = dataTexture;

			}

			if ( loaded === 6 ) {

				texture.needsUpdate = true;
				if ( onLoad ) onLoad( texture );

			}

		}, onProgress, onError );

	}

	for ( var i = 0; i < urls.length; i ++ ) {

		loadHDRData( i, onLoad, onProgress, onError );

	}

	return texture;

};


ImageBasedLighting.HDRTextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	// override in sub classes
	this.hdrLoader = new THREE.RGBELoader();

};

ImageBasedLighting.HDRTextureLoader.prototype.load = function ( url, onLoad, onProgress, onError ) {

    var RGBEByteToRGBFloat = function ( sourceArray, sourceOffset, destArray, destOffset ) {

		var e = sourceArray[ sourceOffset + 3 ];
		var scale = Math.pow( 2.0, e - 128.0 ) / 255.0;

		destArray[ destOffset + 0 ] = sourceArray[ sourceOffset + 0 ] * scale;
		destArray[ destOffset + 1 ] = sourceArray[ sourceOffset + 1 ] * scale;
		destArray[ destOffset + 2 ] = sourceArray[ sourceOffset + 2 ] * scale;

    };
    
    var texture = new THREE.DataTexture();

    this.hdrLoader.load(url, function(tex, texData){
        tex.flipY = true;
        tex.type = THREE.FloatType;
        tex.format = THREE.RGBFormat;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        var RGBEByteToRGBFloat = function ( sourceArray, sourceOffset, destArray, destOffset ) {

            var e = sourceArray[ sourceOffset + 3 ];
            var scale = Math.pow( 2.0, e - 128.0 ) / 256.0;

            destArray[ destOffset + 0 ] = sourceArray[ sourceOffset + 0 ] * scale;
            destArray[ destOffset + 1 ] = sourceArray[ sourceOffset + 1 ] * scale;
            destArray[ destOffset + 2 ] = sourceArray[ sourceOffset + 2 ] * scale;

        };

        var numElements = tex.image.width * tex.image.height * 3;
        var floatdata = new Float32Array( numElements );

        for ( var j = 0; j < numElements; j ++ ) {

            RGBEByteToRGBFloat( tex.image.data, j * 4, floatdata, j * 3 );

        }

        tex.image.data = floatdata;

        texture = tex;

        if (onLoad) onLoad(texture);

    }, onProgress, onError);

    
    return texture;

};
ImageBasedLighting.equirectangular_vs = [

	"varying vec3 pos;",

	"void main() {",
	"	pos = vec3(modelMatrix * vec4(position, 1.0));",
	"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	"}"
    
].join('\n');

ImageBasedLighting.equirectangular_fs = [

	"varying vec3 pos;",
	"uniform sampler2D map;",

	"const float PI = 3.14159265358979;",
	"const float INV_PI = 1.0 / PI;",

	"vec2 sampleSphericalMap(vec3 v)",
	"{",
	"	vec2 uv = vec2(atan(v.z, v.x), asin(v.y));",
	"	uv *= vec2(INV_PI * 0.5, INV_PI);",
	"	uv += 0.5;",
	"	return uv;",
	"}",

	"void main() {",
	"	vec2 uv = sampleSphericalMap(normalize(pos));",
	"	vec4 color = texture2D(map, uv);",
	"	gl_FragColor = vec4(color.rgb, 1.0);",
	"}"
    
].join('\n');

ImageBasedLighting.EquirectangularMaterial = function (parameters) {

	THREE.ShaderMaterial.call(this);

	this.type = 'EquirectangularMaterial';

	this.map = null;

	this.lights = false;

	this.side = THREE.BackSide;

	this.defines = {};
	this.uniforms = THREE.UniformsUtils.merge( [

		{
			map: { value: null }
		}

	] );

	this.vertexShader = ImageBasedLighting.equirectangular_vs;

	this.fragmentShader = ImageBasedLighting.equirectangular_fs;

	// When rendered geometry doesn't include these attributes but the material does,
	// use these default values in WebGL. This avoids errors when buffer data is missing.
	this.defaultAttributeValues = {
		'color': [1, 1, 1],
		'uv': [0, 0],
		'uv2': [0, 0]
	};

	if (parameters !== undefined) {

		if (parameters.attributes !== undefined) {

			console.error('IBLMaterial: attributes should now be defined in THREE.BufferGeometry instead.');

		}

		this.setValues(parameters);

	}

	this.refreshUniforms();

};

ImageBasedLighting.EquirectangularMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
ImageBasedLighting.EquirectangularMaterial.prototype.constructor = ImageBasedLighting.EquirectangularMaterial;

ImageBasedLighting.EquirectangularMaterial.prototype.isShaderMaterial = true;

ImageBasedLighting.EquirectangularMaterial.prototype.copy = function (source) {

	THREE.ShaderMaterial.prototype.copy.call(this, source);

	this.map = source.map;

	return this;

};

ImageBasedLighting.EquirectangularMaterial.prototype.refreshUniforms = function () {

	this.uniforms.map.value = this.map;

};

ImageBasedLighting.HDRToCubeMap = function(map, renderer, isHDR, resolution) {
	var camera = new THREE.CubeCamera(0.1, 10.0, resolution || 512);
	if (isHDR) {
		var options = { type: THREE.FloatType, format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter };
		camera.renderTarget = new THREE.WebGLRenderTargetCube( resolution || 512, resolution || 512, options );
	}

	var scene = new THREE.Scene();

	var material = new EquirectangularMaterial( { map: map } );

	var cube = new THREE.Mesh(new THREE.BoxBufferGeometry(2.0, 2.0, 2.0), material);
	scene.add(cube);

	camera.updateCubeMap(renderer, scene);

	return camera.renderTarget.texture;
}

ImageBasedLighting.IBLMaps = function(url, isHDR, onSuccess) {

    this.environmentMap = null;
    this.irradianceMap = null;
    this.prefilterMap = null;
    this.brdfMap = null;

    if (url) {
        this.loadMaps(url, isHDR, onSuccess);
    }

};

ImageBasedLighting.IBLMaps.prototype.constructor = ImageBasedLighting.IBLMaps;

ImageBasedLighting.IBLMaps.prototype.loadMaps = function(url, isHDR, onSuccess) {

    var scope = this;

    var mapUrl = ["posx.hdr", "negx.hdr", "posy.hdr", "negy.hdr", "posz.hdr", "negz.hdr"];
    var envMapUrl = [];
    for (var i = 0; i < 6; ++i) {
        envMapUrl.push(url + "/EnvMap_" + mapUrl[i]);
    }

    var cubeTextureLoader = isHDR ? new THREE.HDRCubeTextureLoader() : new THREE.CubeTextureLoader();

    cubeTextureLoader.load(THREE.FloatType, envMapUrl, function (hdrCubeMap) {
        scope.environmentMap = hdrCubeMap;

        var irradianceMapUrl = [];
        for (var i = 0; i < 6; ++i) {
            irradianceMapUrl.push(url + "/IrradianceMap_" + mapUrl[i]);
        }

        cubeTextureLoader.load(THREE.FloatType, irradianceMapUrl, function (hdrCubeMap) {
            scope.irradianceMap = hdrCubeMap;

            var prefilterMapUrl = [];
            for (var i = 0; i < 6; ++i) {
                prefilterMapUrl.push(url + "/PrefilterMap_" + mapUrl[i]);
            }

            cubeTextureLoader.load(THREE.FloatType, prefilterMapUrl, function (hdrCubeMap) {
                scope.prefilterMap = hdrCubeMap;

                var textureLoader = isHDR ? new ImageBasedLighting.HDRTextureLoader() : new THREE.TextureLoader();
                var brdfUrl = isHDR ? url + "/brdf.hdr" : '/' + url + "/brdf.png";
                textureLoader.load(brdfUrl, function (texture) {
                    scope.brdfMap = texture;
                    onSuccess(scope, isHDR);
                });

            });
        });
    });

}
"use strict";

ImageBasedLighting.IBLMaterial = function (parameters) {

    THREE.MeshStandardMaterial.call(this);

    this.type = 'IBLMaterial';

    this.IBLEnabled = true;
    this.debug = 0;

    this.gamma = 2.2;

    this.color = new THREE.Color(0xffffff);

    this.roughness = 0.5;
    this.metalness = 0.5;

    this.opacity = 1.0;

    this.map = null;

    this.normalMap = null;
    this.normalScale = new THREE.Vector2(1.0, 1.0);

    this.roughnessMap = null;
    this.metalnessMap = null;

    this.aoMap = null;

    this.IBLMaps = null;

    this.shift = 0.18;
    this.A = 0.27;
    this.B = 0.29;
    this.C = 0.052;
    this.D = 0.2;
    this.E = 0.0;
    this.F = 0.18;
    this.scale = 0.897105;

    this.emissive = new THREE.Color();

    this.defines = {};
    this.uniforms = THREE.UniformsUtils.merge( [

        THREE.UniformsLib[ "lights" ],

        {
            clippingPlanes: { value: null },

            IBLEnabled: { value: true },
            debug: { value: 0 },

            gamma: { value: 1.0 },

            albedo: { value: new THREE.Color(0xffffff) },

            metalness: { value: 0.8 },
            roughness: { value: 0.4 },

            opacity: {value: 1.0},

            map: { value: null },

            normalMap: { value: null },
            normalScale: { value: new THREE.Vector2(1.0, 1.0) },

            roughnessMap: { value: null },
            metalnessMap: { value: null },

            aoMap: { value: null },

            irradianceMap: { value: null },
            prefilterMap: {value: null },
            brdfMap: { value: null },

            shift: { value: 0.18 },
            A: { value: 0.27 },
            B: { value: 0.29 },
            C: { value: 0.052 },
            D: { value: 0.2 },
            E: { value: 0.0 },
            F: { value: 0.18 },
            scale: { value: 0.897105 },
        }

    ] );

    this.lights = true;

    this.vertexShader = ImageBasedLighting.IBLVertexShader;

    this.fragmentShader = ImageBasedLighting.IBLFragmentShader;

    // When rendered geometry doesn't include these attributes but the material does,
    // use these default values in WebGL. This avoids errors when buffer data is missing.
    this.defaultAttributeValues = {
        'color': [1, 1, 1],
        'uv': [0, 0],
        'uv2': [0, 0]
    };

    if (parameters !== undefined) {

        if (parameters.attributes !== undefined) {

            console.error('IBLMaterial: attributes should now be defined in THREE.BufferGeometry instead.');

        }

        this.setValues(parameters);

    }

    //this.refreshUniforms();

};

ImageBasedLighting.IBLMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
ImageBasedLighting.IBLMaterial.prototype.constructor = ImageBasedLighting.IBLMaterial;

ImageBasedLighting.IBLMaterial.prototype.copy = function (source) {

    THREE.ShaderMaterial.prototype.copy.call(this, source);

    this.IBLEnabled = source.IBLEnabled;
    this.debug = source.debug;

    this.gamma = source.gamma;

    this.color.copy(source.color);

    this.metalness = source.metalness;
    this.roughness = source.roughness;

    this.opacity = source.opacity;

    this.map = source.map;

    this.normalMap = source.normalMap;
    this.normalScale = source.normalScale;

    this.roughnessMap = source.roughnessMap;
    this.metalnessMap = source.metalnessMap;

    this.aoMap = source.aoMap;

    this.IBLMaps = source.IBLMaps;

    this.shift = source.shift;
    this.A = source.A;
    this.B = source.B;
    this.C = source.C;
    this.D = source.D;
    this.E = source.E;
    this.F = source.F;
    this.scale = source.scale;

    return this;

};

ImageBasedLighting.IBLMaterial.prototype.refreshUniforms = function () {

    this.uniforms.clippingPlanes.value = this.clippingPlanes;

    this.uniforms.IBLEnabled.value = this.IBLEnabled;
    this.uniforms.debug.value = this.debug;
    this.uniforms.gamma.value = this.gamma;

    this.uniforms.albedo.value.set(this.color);

    this.uniforms.metalness.value = this.metalness;
    this.uniforms.roughness.value = this.roughness;

    this.uniforms.opacity.value = this.opacity;

    this.uniforms.map.value = this.map;

    this.uniforms.normalMap.value = this.normalMap;
    this.uniforms.normalScale.value = this.normalScale;

    this.uniforms.roughnessMap.value = this.roughnessMap;
    this.uniforms.metalnessMap.value = this.metalnessMap;

    this.uniforms.aoMap.value = this.aoMap;

    this.uniforms.irradianceMap.value = this.IBLMaps.irradianceMap;
    this.uniforms.prefilterMap.value = this.IBLMaps.prefilterMap;
    this.uniforms.brdfMap.value = this.IBLMaps.brdfMap;

    this.uniforms.shift.value = this.shift;
    this.uniforms.A.value = this.A;
    this.uniforms.B.value = this.B;
    this.uniforms.C.value = this.C;
    this.uniforms.D.value = this.D;
    this.uniforms.E.value = this.E;
    this.uniforms.F.value = this.F;
    this.uniforms.scale.value = this.scale;

};

ImageBasedLighting.IBLProbe = function(envMap, hammersleyUrl, onSuccess, irradianceResolution, prefilterResolution, brdfResolution, maxMipLevel) {

	this.environmentMap = envMap;

	this.hammersleyTable = null;
	this.irradianceMap = null;
	this.prefilterMap = null;
	this.brdfMap = null;

	this.hammersleyUrl = hammersleyUrl;

	this.irradianceResolution = irradianceResolution || 32;
	this.prefilterResolution = prefilterResolution || 128;
	this.brdfResolution = brdfResolution || 512;
	this.maxMipLevel = maxMipLevel || 1;

	this.isHDR = false;
	this.isComputed = false;

	this.onSuccess = onSuccess;

	this.loadHammersleyTable();

};

ImageBasedLighting.IBLProbe.prototype.constructor = ImageBasedLighting.IBLProbe;

ImageBasedLighting.IBLProbe.prototype.loadHammersleyTable = function() {

	var scope = this;

	var loader = new THREE.TextureLoader();
	loader.load(this.hammersleyUrl, function onSuccess(texture) {
		scope.hammersleyTable = texture;
		scope.initMap();
		if (scope.onSuccess) {
			scope.onSuccess();
		}
	});

};

ImageBasedLighting.IBLProbe.prototype.initMap = function() {
	this.irradianceMap = new ImageBasedLighting.IrradianceMap(this.environmentMap, this.irradianceResolution);
	this.prefilterMap = new ImageBasedLighting.PrefilterMap(this.environmentMap, this.hammersleyTable, this.prefilterResolution, this.maxMipLevel);
	this.brdfMap = new ImageBasedLighting.BRDFMap(this.hammersleyTable, this.brdfResolution);
};

ImageBasedLighting.IBLProbe.prototype.setEnvironmentMap = function(environmentMap) {
	this.environmentMap = environmentMap;

	this.irradianceMap.irradianceMaterial.uniforms.environmentMap.value = this.environmentMap;
	this.prefilterMap.prefilterMaterial.uniforms.environmentMap.value = this.environmentMap;
}

ImageBasedLighting.IBLProbe.prototype.computed = function(renderer) {

	this.irradianceMap.generateMap(renderer, this.isHDR);
	this.prefilterMap.generateMap(renderer, this.isHDR);
	this.brdfMap.generateMap(renderer);

	this.isComputed = true;

};

ImageBasedLighting.IBLVertexShader = [

    "varying vec2 vUV;",
    "varying vec3 Normal;",
    "varying vec3 Pos;",
    "varying vec3 mvPosition;",
    "varying vec3 mvNormal;"
].join('\n') +
    CLOUD.IdTargetUtil.idVarOfVertexShader() +
    [
    "void main()",
    "{",
    "    vUV = uv;",
    "    Pos = vec3(modelMatrix * vec4(position, 1.0));",
    "    Normal = normalize(mat3(modelMatrix) * normal);",
    "    mvPosition = vec3(modelViewMatrix * vec4(position, 1.0));",
    "    mvNormal = normalize(normalMatrix * normal);",
    "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);"
].join('\n') +
    CLOUD.IdTargetUtil.passIdInVertexShader() +
    "}";

ImageBasedLighting.varying_pars = [

    "varying vec2 vUV;",
    "varying vec3 Normal;",
    "varying vec3 Pos;",
    "varying vec3 mvPosition;",
    "varying vec3 mvNormal;"

].join('\n');

ImageBasedLighting.clipping_pars = [

    "#if NUM_CLIPPING_PLANES > 0",
    "    uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];",
    "#endif"

].join('\n');

ImageBasedLighting.maps_pars = [

    "#ifdef USE_MAP",
    "    uniform sampler2D map;",
    "#endif",

    "#ifdef USE_NORMALMAP",

    "    uniform sampler2D normalMap;",
    "    uniform vec2 normalScale;",
    "vec3 perturbNormal2Arb(vec3 pos, vec3 normal)",
    "{",
    "    vec3 q0 = vec3(dFdx(pos.x), dFdx(pos.y), dFdx(pos.z));",
    "    vec3 q1 = vec3(dFdy(pos.x), dFdy(pos.y), dFdy(pos.z));",
    "    vec2 st0 = dFdx(vUV.st);",
    "    vec2 st1 = dFdy(vUV.st);",
    "    vec3 S = normalize(q0 * st1.t - q1 * st0.t);",
    "    vec3 T = normalize(-q0 * st1.s + q1 * st0.s);",
    "    vec3 N = normalize(normal);",
    "    vec3 mapN = texture2D(normalMap, vUV).xyz * 2.0 - 1.0;",
    "    mapN.xy = normalScale * mapN.xy;",
    "    mat3 tsn = mat3(S, T, N);",
    "    return normalize(tsn * mapN);",
    "}",

    "#endif",

    "#ifdef USE_ROUGHNESSMAP",
    "    uniform sampler2D roughnessMap;",
    "#endif",

    "#ifdef USE_METALNESSMAP",
    "    uniform sampler2D metalnessMap;",
    "#endif",

    "#ifdef USE_AOMAP",
    "    uniform sampler2D aoMap;",
    "    uniform float aoMapIntensity;",
    "#endif"
    
].join('\n');

ImageBasedLighting.iblMaps_pars = [

    "uniform samplerCube irradianceMap;",
    "uniform samplerCube prefilterMap;",
    "uniform sampler2D brdfMap;",

].join('\n');

ImageBasedLighting.lighting_pars = [

    "uniform vec3 ambientLightColor;",

    "#if NUM_DIR_LIGHTS > 0",
    "struct DirectionalLight",
    "{",
    "    vec3 direction;",
    "    vec3 color;",

    "    int shadow;",
    "    float shadowBias;",
    "    float shadowRadius;",
    "    vec2 shadowMapSize;",
    "};",

    "uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];",
    "#endif",

    "#if NUM_POINT_LIGHTS > 0",
    "struct PointLight",
    "{",
    "    vec3 position;",
    "    vec3 color;",
    "    float distance;",
    "    float decay;",

    "    int shadow;",
    "    float shadowBias;",
    "    float shadowRadius;",
    "    vec2 shadowMapSize;",
    "};",

    "uniform PointLight pointLights[NUM_POINT_LIGHTS];",
    "#endif",

    "#if NUM_SPOT_LIGHTS > 0",
    "struct SpotLight",
    "{",
    "    vec3 position;",
    "    vec3 direction;",
    "    vec3 color;",
    "    float distance;",
    "    float decay;",
    "    float coneCos;",
    "    float penumbraCos;",

    "    int shadow;",
    "    float shadowBias;",
    "    float shadowRadius;",
    "    vec2 shadowMapSize;",
    "};",

    "uniform SpotLight spotLights[NUM_SPOT_LIGHTS];",
    "#endif",

    "float punctualLightIntensityToIrradianceFactor(const in float lightDistance, const in float cutoffDistance, const in float decayExponent)",
    "{",
    "    if(decayExponent > 0.0)",
    "    {",
    "        float distanceFalloff = 1.0 / max(pow(lightDistance, decayExponent), 0.01);",
    "        float maxDistanceCutoffFactor = pow(saturate(1.0 - pow(lightDistance / cutoffDistance, 4.0)), 2.0);",
    "        return distanceFalloff * maxDistanceCutoffFactor;",
    "    }",

    "    float distanceFalloff = 1.0 / max(pow(lightDistance, 2.0), 0.01);",
    "    return distanceFalloff;",
    "}",

].join('\n');

ImageBasedLighting.toneMap_pars = [

    "uniform float shift;",
    "uniform float A;",
    "uniform float B;",
    "uniform float C;",
    "uniform float D;",
    "uniform float E;",
    "uniform float F;",
    "uniform float scale;",

    "vec3 toneMapCanonFilmic(vec3 color)",
    "{",
    "    color *= (1.0 / shift);",
    "    return (((color * (A * color + C * B)) / (color * (A * color + B) + D * F))) * (1.0 / scale);",
    "}",

].join('\n');

ImageBasedLighting.Uniforms = [

    ImageBasedLighting.varying_pars,
    ImageBasedLighting.clipping_pars,

    "uniform bool IBLEnabled;",
    "uniform int debug;",
    "uniform float gamma;",

    "uniform vec3 albedo;",
    "uniform float metalness;",
    "uniform float roughness;",
    "uniform float opacity;",

    ImageBasedLighting.maps_pars,

    ImageBasedLighting.iblMaps_pars,

    ImageBasedLighting.lighting_pars,

    ImageBasedLighting.toneMap_pars,

].join('\n') +
    CLOUD.IdTargetUtil.idVarOfFragShader();

ImageBasedLighting.IBLFragmentShader = [

    ImageBasedLighting.Uniforms,

    "const float PI = 3.14159265358979;",

    "float D_GGX(float NdotH, float roughness)",
    "{",
    "    float alpha = pow(roughness, 2.0);",
    "    float alpha2 = pow(alpha, 2.0);",
    "    return alpha2 / (PI * pow(NdotH * NdotH * (alpha2 - 1.0) + 1.0, 2.0));",
    "}",

    "float GGX_Schlick(float NdotV, float roughness)",
    "{",
    "    float k = (roughness + 1.0) * 0.125;",
    "    return NdotV / (NdotV * (1.0 - k) + k);",
    "}",

    "float G_Smith(float NdotV, float NdotL, float roughness)",
    "{",
    "    return GGX_Schlick(NdotV, roughness) * GGX_Schlick(NdotL, roughness);",
    "}",

    "vec3 F_Schlick(float HdotV, vec3 F0)",
    "{",
    "    return F0 + (vec3(1.0) - F0) * pow((1.0 - HdotV), 5.0);",
    "}",

    "vec3 F_SchlickRoughness(float NdotV, vec3 F0, float roughness)",
    "{",
    "    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - NdotV, 5.0);",
    "}",

    "vec3 postProcessing(vec3 color, bool toneMap)",
    "{",
    "    vec3 result = toneMap ? toneMapCanonFilmic(color) : color;",
    "    result = pow(result, vec3(1.0 / gamma));",
    "    return result;",
    "}",

    "void main()",
    "{",

    "#if NUM_CLIPPING_PLANES > 0",

    "    vec3 vViewPosition = -mvPosition;",
    
    "    for (int i = 0; i < UNION_CLIPPING_PLANES; ++ i)",
    "    {",
    "        vec4 plane = clippingPlanes[ i ];",
    "        if (dot(vViewPosition, plane.xyz) > plane.w) discard;",
    "    }",
            
    "    #if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES",

    "        bool clipped = true;",
    "        for (int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; ++ i)",
    "        {",
    "            vec4 plane = clippingPlanes[ i ];",
    "            clipped = (dot(vViewPosition, plane.xyz) > plane.w) && clipped;",
    "        }",
    
    "        if (clipped) discard;",
        
    "    #endif",

    "#endif",

    "    vec3 baseColor = pow(albedo, vec3(gamma));",
    "#ifdef USE_MAP",
    "    baseColor = pow(texture2D(map, vUV).rgb, vec3(gamma));",
    "#endif",

    "#ifdef DOUBLE_SIDED",
    "    float flipNormal = float(gl_FrontFacing) * 2.0 - 1.0;",
    "#else",
    "    float flipNormal = 1.0;",
    "#endif",

    "    vec3 normal = Normal * flipNormal;",
    "    vec3 vNormal = mvNormal * flipNormal;",
    "#ifdef USE_NORMALMAP",
    "    normal = perturbNormal2Arb(Pos, normal);",
    "    vNormal = perturbNormal2Arb(mvPosition, vNormal);",
    "#endif",

    "    float roughnessFactor = roughness;",
    "#ifdef USE_ROUGHNESSMAP",
    "    roughnessFactor = texture2D(roughnessMap, vUV).r;",
    "#endif",

    "    float metalnessFactor = metalness;",
    "#ifdef USE_METALNESSMAP",
    "    metalnessFactor = texture2D(metalnessMap, vUV).r;",
    "#endif",

    "    float aoFactor = 1.0;",
    "#ifdef USE_AOMAP",
    "    aoFactor = texture2D(aoMap, vUV).r;",
    "#endif",

    "    vec3 N = normal;",
    "    vec3 V = normalize(cameraPosition - Pos);",
    "    vec3 R = reflect(-V, N);",

    "    vec3 F0 = vec3(0.04);",
    "    F0 = mix(F0, baseColor, metalnessFactor);",

    "    vec3 totalLightColor = vec3(0.0);",

    "    vec3 viewVector = normalize(-mvPosition);",
    "    vec3 normalVector = normalize(vNormal);",
    "    float NdotV = max(dot(normalVector, viewVector), 0.0);",

    "    totalLightColor += ambientLightColor * baseColor / PI;",

    //Directional Lights
    "#if NUM_DIR_LIGHTS > 0",

    "    vec3 dirColor = vec3(0.0);",

    "    for (int i = 0; i < NUM_DIR_LIGHTS; ++i)",
    "    {",
    "        DirectionalLight directionalLight = directionalLights[i];",
    "        vec3 dirVector = normalize(directionalLight.direction);",
    "        vec3 halfVector = normalize(dirVector + viewVector);",

    "        float NdotL = max(dot(normalVector, dirVector), 0.0);",
    "        float NdotH = max(dot(normalVector, halfVector), 0.0);",
    "        float HdotV = max(dot(halfVector, viewVector), 0.0);",

    "        vec3 F = F_Schlick(HdotV, F0);",
    "        vec3 kS = F;",
    "        vec3 kD = 1.0 - kS;",
    "        kD *= 1.0 - metalnessFactor;",

    "        float D = D_GGX(NdotH, roughnessFactor);",
    "        float G = G_Smith(NdotV, NdotL, roughnessFactor);",
    "        vec3 specular = D * G * F / (4.0 * NdotV * NdotL + 0.001);",

    "        dirColor += (kD * baseColor / PI + specular) * directionalLight.color * NdotL;",
    "    }",

    "    totalLightColor += dirColor;",

    "#endif",

    //Point Lights
    "#if NUM_POINT_LIGHTS > 0",

    "    vec3 pointColor  = vec3(0.0);",

    "    for (int i = 0; i < NUM_POINT_LIGHTS; ++i)",
    "    {",
    "        PointLight pointLight = pointLights[i];",
    "        vec3 dirVector = pointLight.position - mvPosition;",
    "        float distance = length(dirVector);",
    "        dirVector = normalize(dirVector);",
    "        vec3 halfVector = normalize(dirVector + viewVector);",

    "        float NdotL = max(dot(normalVector, dirVector), 0.0);",
    "        float NdotH = max(dot(normalVector, halfVector), 0.0);",
    "        float HdotV = max(dot(halfVector, viewVector), 0.0);",

    "        vec3 F = F_Schlick(HdotV, F0);",
    "        vec3 kS = F;",
    "        vec3 kD = 1.0 - kS;",
    "        kD *= 1.0 - metalnessFactor;",

    "        float D = D_GGX(NdotH, roughnessFactor);",
    "        float G = G_Smith(NdotV, NdotL, roughnessFactor);",
    "        vec3 specular = D * G * F / (4.0 * NdotV * NdotL + 0.001);",

    
    "        pointColor += (kD * baseColor / PI + specular) * pointLight.color * NdotL * punctualLightIntensityToIrradianceFactor(distance, pointLight.distance, pointLight.decay);",
    "    }",

    "    totalLightColor += pointColor;",

    "#endif",

    //Spot Lights
    "#if NUM_SPOT_LIGHTS > 0",

    "    vec3 spotColor  = vec3(0.0);",

    "    for (int i = 0; i < NUM_SPOT_LIGHTS; ++i)",
    "    {",
    "        SpotLight spotLight = spotLights[i];",
    "        vec3 dirVector = spotLight.position - mvPosition;",
    "        float distance = length(dirVector);",
    "        dirVector = normalize(dirVector);",
    "        vec3 halfVector = normalize(dirVector + viewVector);",

    "        float angleCos = dot(dirVector, spotLight.direction);",
    "        if (angleCos > spotLight.coneCos)",
    "        {",
    "            float spotEffect = smoothstep(spotLight.coneCos, spotLight.penumbraCos, angleCos);",
    "            float NdotL = max(dot(normalVector, dirVector), 0.0);",
    "            float NdotH = max(dot(normalVector, halfVector), 0.0);",
    "            float HdotV = max(dot(halfVector, viewVector), 0.0);",

    "            vec3 F = F_Schlick(HdotV, F0);",
    "            vec3 kS = F;",
    "            vec3 kD = 1.0 - kS;",
    "            kD *= 1.0 - metalnessFactor;",

    "            float D = D_GGX(NdotH, roughnessFactor);",
    "            float G = G_Smith(NdotV, NdotL, roughnessFactor);",
    "            vec3 specular = D * G * F / (4.0 * NdotV * NdotL + 0.001);",

    "            spotColor += (kD * baseColor / PI + specular) * spotLights[i].color * spotEffect * NdotL",
    "                * punctualLightIntensityToIrradianceFactor(distance, spotLight.distance, spotLight.decay);",

    "            totalLightColor += spotColor;",
    "        }",
    "    }",

    "#endif",

    "    if (IBLEnabled)",
    "    {",
    "        vec3 F = F_SchlickRoughness(max(dot(N, V), 0.0), F0, roughnessFactor);",

    "        vec3 kS = F;",
    "        vec3 kD = 1.0 - kS;",
    "        kD *= 1.0 - metalnessFactor;",

    "        vec3 irradiance = textureCube(irradianceMap, N, 0.0).rgb;",

    "        vec3 diffuse = irradiance * baseColor;",

    "        const float MAX_REFLECTION_LOD = 1.0;",
    "        vec3 prefilteredColor = textureCube(prefilterMap, R, roughnessFactor * MAX_REFLECTION_LOD).rgb;",

    "        vec2 brdf = texture2D(brdfMap, vec2(max(dot(N, V), 0.0), roughnessFactor)).rg;",
    "        vec3 specular = prefilteredColor * (F * brdf.x + brdf.y);",

    "        vec3 color = (kD * diffuse + specular + totalLightColor) * aoFactor;",
    "        color = postProcessing(color, true);",

    "        if (debug == 1) ",
    "        {",
    "            baseColor = postProcessing(baseColor, false);",
    "            gl_FragColor = vec4(baseColor, opacity);",
    "        }",
    "        else if (debug == 2)",
    "        {",
    "            irradiance = postProcessing(irradiance, true);",
    "            gl_FragColor = vec4(irradiance, opacity);",
    "        }",
    "        else if (debug == 3)",
    "        {",
    "            prefilteredColor = postProcessing(prefilteredColor, true);",
    "            gl_FragColor = vec4(prefilteredColor, opacity);",
    "        }",
    "        else if (debug == 4)",
    "        {",
    "            diffuse = postProcessing(diffuse, true);",
    "            gl_FragColor = vec4(diffuse, opacity);",
    "        }",
    "        else if (debug == 5)",
    "        {",
    "            specular = postProcessing(specular, true);",
    "            gl_FragColor = vec4(specular, opacity);",
    "        }",
    "        else if (debug == 6)",
    "        {",
    "            gl_FragColor = vec4(brdf, 0.0, opacity);",
    "        }",
    "        else if (debug == 7)",
    "        {",
    "            gl_FragColor = vec4(normal, opacity);",
    "        }",
    "        else",
    "        {",
    "            gl_FragColor = vec4(color, opacity);",
    "        }",
    "    }",
    "    else",
    "    {",
    "        totalLightColor = postProcessing(totalLightColor, true);",
    "        gl_FragColor = vec4(totalLightColor, opacity);",
    "    }"
].join('\n') +
    CLOUD.IdTargetUtil.writeIdInFragShader() +
    "}";

ImageBasedLighting.cube_vs = [

    "varying vec3 pos;",

    "void main()",
    "{",
    "    pos = position;",
    "    gl_Position = projectionMatrix * mat4(mat3(viewMatrix)) * modelMatrix * vec4(position, 1.0);",
    "    gl_Position = gl_Position.xyww;",
    "}"

].join('\n');

ImageBasedLighting.cube_fs = [

    "varying vec3 pos;",

    "uniform samplerCube environmentMap;",
    "uniform bool hdr;",

    "uniform float shift;",
    "uniform float A;",
    "uniform float B;",
    "uniform float C;",
    "uniform float D;",
    "uniform float E;",
    "uniform float F;",
    "uniform float scale;",
    
    "vec3 toneMapCanonFilmic(vec3 color)",
    "{",

    "    color *= (1.0 / shift);",
    "    return (((color * (A * color + C * B)) / (color * (A * color + B) + D * F))) * (1.0 / scale);",

    "}",

    "void main()",
    "{",
    "    vec3 envColor = textureCube(environmentMap, pos, 0.0).rgb;",
    "    if (hdr)",
    "    {",
    "        envColor = toneMapCanonFilmic(envColor);",
    "    }",
    "    envColor = pow(envColor, vec3(1.0 / 2.2));",
    "    gl_FragColor = vec4(envColor, 1.0);",
    "}"

].join('\n');

ImageBasedLighting.irradiance_vs = [

	"varying vec3 pos;",
	//"varying vec3 Normal;",

	"void main() {",
	"	pos = vec3(modelMatrix * vec4(position, 1.0));",
	//"	Normal = mat3(modelMatrix) * normal;",
	"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	"}"

].join('\n');

ImageBasedLighting.irradiance_fs = [

	"varying vec3 pos;",
	"uniform samplerCube environmentMap;",
	//"uniform sampler2D HammersleyTable;",

	"const float PI = 3.14159265358979;",
	//"const float INV_PI = 1.0 / PI;",

	"vec3 caluIrradiance(vec3 normal, vec3 up, vec3 right)",
	"{",
	"	vec3 irradiance = vec3(0.0);",

	"	int count = 0;",
	"	const int phiSampleCount = 1024;",
	"	const int thetaSampleCount = phiSampleCount / 4;",
	"	float phiDelta = 2.0 * PI / float(phiSampleCount);",
	"	float thetaDelta = 0.5 * PI / float(thetaSampleCount);",
	"	for(int i = 0; i < phiSampleCount; ++i)",
	"	{",
	"		float phi = float(i) * phiDelta;",
	"		for(int j = 0; j < thetaSampleCount; ++j)",
	"		{",
	"			float theta = float(j) * thetaDelta;",
	"			vec3 tangentSample = vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));",
	"			vec3 sampleVec = tangentSample.x * right + tangentSample.y * up + tangentSample.z * normal; ",

	"			irradiance += textureCube(environmentMap, sampleVec, 0.0).rgb * cos(theta) * sin(theta);",
	"			++count;",
	"		}",
	"	}",
	"	irradiance = PI * irradiance * (1.0 / float(count));",

	"	return irradiance;",
	"}",

	"void main()",
	"{",
	"	vec3 normal = normalize(pos);",
	"	vec3 up = vec3(0.0, 1.0, 0.0);",
	"	vec3 right = cross(up, normal);",
	"	up = cross(normal, right);",
	"	vec3 irradiance = caluIrradiance(normal, up, right);",

	"	gl_FragColor = vec4(irradiance, 1.0);",
	"}"

].join('\n');

ImageBasedLighting.IrradianceMap = function(envMap, resolution) {

	this.cubeTexture = null;

	this.resolution = resolution || 32;

	this.irradianceMaterial = new THREE.ShaderMaterial({
		vertexShader: ImageBasedLighting.irradiance_vs,
		fragmentShader: ImageBasedLighting.irradiance_fs,
		uniforms: {
			environmentMap: { value: envMap },
		},
		
		lights:false,
		side: THREE.BackSide
	});

	this.cube = new THREE.Mesh(new THREE.BoxBufferGeometry(2.0, 2.0, 2.0), this.irradianceMaterial);

};

ImageBasedLighting.IrradianceMap.prototype.constructor = ImageBasedLighting.IrradianceMap;

ImageBasedLighting.IrradianceMap.prototype.generateMap = function(renderer, isHDR) {

	var scene = new THREE.Scene();
	scene.add(this.cube);

	var cubecamera = new THREE.CubeCamera(0.1, 10.0, this.resolution);
	if (isHDR) {
		var options = { type: THREE.FloatType, format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter };
		cubecamera.renderTarget = new THREE.WebGLRenderTargetCube( this.resolution, this.resolution, options );
	}

	cubecamera.updateCubeMap(renderer, scene);
	this.cubeTexture = cubecamera.renderTarget.texture;
	
};

ImageBasedLighting.prefilter_vs = [

	"varying vec3 pos;",
	"varying vec3 Normal;",

	"void main() {",
	"	pos = vec3(modelMatrix * vec4(position, 1.0));",
	"	Normal = mat3(modelMatrix) * normal;",
	"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	"}"

].join('\n');

ImageBasedLighting.prefilter_fs = [

	"varying vec3 pos;",
	"varying vec3 Normal;",

	"uniform float roughness;",

	"uniform samplerCube environmentMap;",
	"uniform sampler2D HammersleyTable;",

	"const float PI = 3.14159265358979;",
	//"const float INV_PI = 1.0 / PI;",

	"float D_GGX(float NdotH, float roughness)",
	"{",
	"	float alpha = pow(roughness, 2.0);",
	"	float alpha2 = pow(alpha, 2.0);",
	"	return alpha2 / (PI * pow(NdotH * NdotH * (alpha2 - 1.0) + 1.0, 2.0));",
	"}",

	"vec3 ImportanceSampleGGX(vec2 Xi, vec3 N, float roughness) ",
	"{",
	"	float a = roughness * roughness;",

	"	float Phi = 2.0 * PI * Xi.x; ",
	"	float CosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y)); ",
	"	float SinTheta = sqrt(1.0 - CosTheta * CosTheta);",

	"	vec3 H;",
	"	H.x = SinTheta * cos(Phi); ",
	"	H.y = SinTheta * sin(Phi); ",
	"	H.z = CosTheta;",

	"	vec3 UpVector = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0); ",
	"	vec3 TangentX = normalize(cross(UpVector, N)); ",
	"	vec3 TangentY = cross(N, TangentX);",

		// Tangent to world space 
	"	return normalize(TangentX * H.x + TangentY * H.y + N * H.z);",
	"}",

	"void main()",
	"{",
	"	vec3 N = normalize(pos);",
	"	vec3 R = N;",
	"	vec3 V = R;",

	"	const int sampleCount = 1024;",

	"	float totalWeight = 0.0;",
	"	vec3 prefilteredColor = vec3(0.0);",

	"	for (int i = 0; i < sampleCount; ++i) {",
	"		float u = float(i) / float(sampleCount);",
	"		vec2 Xi = vec2(u, texture2D(HammersleyTable, vec2(u)).r);",
	"		vec3 H = ImportanceSampleGGX(Xi, N, roughness);",
	"		vec3 L = normalize(2.0 * dot(V, H) * H - V);",

	"		float NdotL = max(dot(N, L), 0.0);",
	"		if(NdotL > 0.0)",
	"		{",
	"			float NdotH = max(dot(N, H), 0.0);",
	"			float D = D_GGX(NdotH, roughness);",

	"			float HdotV = max(dot(H, V), 0.0);",
	"			float pdf = D * NdotH / (4.0 * HdotV);",

	"			float resolution = 2048.0; // resolution of source cubemap (per face)",
	"			float solidAngleTexel= 4.0 * PI / (6.0 * resolution * resolution);",
	"			float solidAngleSample = 1.0 / (float(sampleCount) * pdf);",

	"			float mipLevel = roughness == 0.0 ? 0.0 : 0.5 * log2(solidAngleSample / solidAngleTexel);",

	"			prefilteredColor += textureCube(environmentMap, L, mipLevel).rgb * NdotL;",
	"			totalWeight += NdotL;",
	"		}",
	"	}",

	"	prefilteredColor = prefilteredColor / totalWeight;",
	"	gl_FragColor = vec4(prefilteredColor, 1.0);",
	"}"

].join('\n');

ImageBasedLighting.PrefilterMap = function(envMap, hammersleyTable, resolution, maxMipLevel) {

	this.cubeTexture = null;

	this.resolution = resolution || 128;
	this.maxMipLevel = maxMipLevel || 1;

	this.prefilterMaterial = new THREE.ShaderMaterial({
		vertexShader: ImageBasedLighting.prefilter_vs,
		fragmentShader: ImageBasedLighting.prefilter_fs,
		uniforms: {
			roughness: { value: 0.0 },
			environmentMap: { value: envMap },
			HammersleyTable: {value: hammersleyTable}
		},

		lights:false,
		side: THREE.BackSide
	});

	this.cube = new THREE.Mesh(new THREE.BoxBufferGeometry(2.0, 2.0, 2.0), this.prefilterMaterial);

};

ImageBasedLighting.PrefilterMap.prototype.constructor = ImageBasedLighting.PrefilterMap;

ImageBasedLighting.PrefilterMap.prototype.generateMap = function(renderer, isHDR) {

	var scene = new THREE.Scene();
	scene.add(this.cube);

	var cubecamera = new THREE.CubeCamera(0.1, 10.0, this.resolution);
	if (isHDR) {
		var options = { type: THREE.FloatType, format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter };
		cubecamera.renderTarget = new THREE.WebGLRenderTargetCube( this.resolution, this.resolution, options );
	}

	var maxLevel = this.maxMipLevel <= 1.0 ? 1.0 : (this.maxMipLevel - 1.0);
	for (var i = 0; i < this.maxMipLevel; i++) {
		var width = this.resolution * Math.pow(0.5, i);
		cubecamera.renderTarget.width = cubecamera.renderTarget.height = width;

		var roughness = i / maxLevel;
		this.prefilterMaterial.uniforms.roughness.value = roughness;

		cubecamera.renderTarget.activeMipMapLevel = i;
		cubecamera.updateCubeMap(renderer, scene);
	}
	
	this.cubeTexture = cubecamera.renderTarget.texture;
	
};
/**
 * @author Nikos M. / https://github.com/foo123/
 */

// https://github.com/mrdoob/three.js/issues/5552
// http://en.wikipedia.org/wiki/RGBE_image_format

THREE.HDRLoader = THREE.RGBELoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

// extend THREE.DataTextureLoader
THREE.RGBELoader.prototype = Object.create( THREE.DataTextureLoader.prototype );

// adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
THREE.RGBELoader.prototype._parser = function( buffer ) {

	var
		/* return codes for rgbe routines */
		RGBE_RETURN_SUCCESS =  0,
		RGBE_RETURN_FAILURE = - 1,

		/* default error routine.  change this to change error handling */
		rgbe_read_error     = 1,
		rgbe_write_error    = 2,
		rgbe_format_error   = 3,
		rgbe_memory_error   = 4,
		rgbe_error = function( rgbe_error_code, msg ) {

			switch ( rgbe_error_code ) {
				case rgbe_read_error: console.error( "THREE.RGBELoader Read Error: " + ( msg || '' ) );
					break;
				case rgbe_write_error: console.error( "THREE.RGBELoader Write Error: " + ( msg || '' ) );
					break;
				case rgbe_format_error:  console.error( "THREE.RGBELoader Bad File Format: " + ( msg || '' ) );
					break;
				default:
				case rgbe_memory_error:  console.error( "THREE.RGBELoader: Error: " + ( msg || '' ) );
			}
			return RGBE_RETURN_FAILURE;

		},

		/* offsets to red, green, and blue components in a data (float) pixel */
		RGBE_DATA_RED      = 0,
		RGBE_DATA_GREEN    = 1,
		RGBE_DATA_BLUE     = 2,

		/* number of floats per pixel, use 4 since stored in rgba image format */
		RGBE_DATA_SIZE     = 4,

		/* flags indicating which fields in an rgbe_header_info are valid */
		RGBE_VALID_PROGRAMTYPE      = 1,
		RGBE_VALID_FORMAT           = 2,
		RGBE_VALID_DIMENSIONS       = 4,

		NEWLINE = "\n",

		fgets = function( buffer, lineLimit, consume ) {

			lineLimit = ! lineLimit ? 1024 : lineLimit;
			var p = buffer.pos,
				i = - 1, len = 0, s = '', chunkSize = 128,
				chunk = String.fromCharCode.apply( null, new Uint16Array( buffer.subarray( p, p + chunkSize ) ) )
			;
			while ( ( 0 > ( i = chunk.indexOf( NEWLINE ) ) ) && ( len < lineLimit ) && ( p < buffer.byteLength ) ) {

				s += chunk; len += chunk.length;
				p += chunkSize;
				chunk += String.fromCharCode.apply( null, new Uint16Array( buffer.subarray( p, p + chunkSize ) ) );

			}

			if ( - 1 < i ) {

				/*for (i=l-1; i>=0; i--) {
					byteCode = m.charCodeAt(i);
					if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
					else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
					if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
				}*/
				if ( false !== consume ) buffer.pos += len + i + 1;
				return s + chunk.slice( 0, i );

			}
			return false;

		},

		/* minimal header reading.  modify if you want to parse more information */
		RGBE_ReadHeader = function( buffer ) {

			var line, match,

				// regexes to parse header info fields
				magic_token_re = /^#\?(\S+)$/,
				gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
				exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
				format_re = /^\s*FORMAT=(\S+)\s*$/,
				dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,

				// RGBE format header struct
				header = {

					valid: 0,                         /* indicate which fields are valid */

					string: '',                       /* the actual header string */

					comments: '',                     /* comments found in header */

					programtype: 'RGBE',              /* listed at beginning of file to identify it
													* after "#?".  defaults to "RGBE" */

					format: '',                       /* RGBE format, default 32-bit_rle_rgbe */

					gamma: 1.0,                       /* image has already been gamma corrected with
													* given gamma.  defaults to 1.0 (no correction) */

					exposure: 1.0,                    /* a value of 1.0 in an image corresponds to
													* <exposure> watts/steradian/m^2.
													* defaults to 1.0 */

					width: 0, height: 0               /* image dimensions, width/height */

				}
			;

			if ( buffer.pos >= buffer.byteLength || ! ( line = fgets( buffer ) ) ) {

				return rgbe_error( rgbe_read_error, "no header found" );

			}
			/* if you want to require the magic token then uncomment the next line */
			if ( ! ( match = line.match( magic_token_re ) ) ) {

				return rgbe_error( rgbe_format_error, "bad initial token" );

			}
			header.valid |= RGBE_VALID_PROGRAMTYPE;
			header.programtype = match[ 1 ];
			header.string += line + "\n";

			while ( true ) {

				line = fgets( buffer );
				if ( false === line ) break;
				header.string += line + "\n";

				if ( '#' === line.charAt( 0 ) ) {

					header.comments += line + "\n";
					continue; // comment line

				}

				if ( match = line.match( gamma_re ) ) {

					header.gamma = parseFloat( match[ 1 ], 10 );

				}
				if ( match = line.match( exposure_re ) ) {

					header.exposure = parseFloat( match[ 1 ], 10 );

				}
				if ( match = line.match( format_re ) ) {

					header.valid |= RGBE_VALID_FORMAT;
					header.format = match[ 1 ];//'32-bit_rle_rgbe';

				}
				if ( match = line.match( dimensions_re ) ) {

					header.valid |= RGBE_VALID_DIMENSIONS;
					header.height = parseInt( match[ 1 ], 10 );
					header.width = parseInt( match[ 2 ], 10 );

				}

				if ( ( header.valid & RGBE_VALID_FORMAT ) && ( header.valid & RGBE_VALID_DIMENSIONS ) ) break;

			}

			if ( ! ( header.valid & RGBE_VALID_FORMAT ) ) {

				return rgbe_error( rgbe_format_error, "missing format specifier" );

			}
			if ( ! ( header.valid & RGBE_VALID_DIMENSIONS ) ) {

				return rgbe_error( rgbe_format_error, "missing image size specifier" );

			}

			return header;

		},

		RGBE_ReadPixels_RLE = function( buffer, w, h ) {

			var data_rgba, offset, pos, count, byteValue,
				scanline_buffer, ptr, ptr_end, i, l, off, isEncodedRun,
				scanline_width = w, num_scanlines = h, rgbeStart
			;

			if (
				// run length encoding is not allowed so read flat
				( ( scanline_width < 8 ) || ( scanline_width > 0x7fff ) ) ||
				// this file is not run length encoded
				( ( 2 !== buffer[ 0 ] ) || ( 2 !== buffer[ 1 ] ) || ( buffer[ 2 ] & 0x80 ) )
			) {

				// return the flat buffer
				return new Uint8Array( buffer );

			}

			if ( scanline_width !== ( ( buffer[ 2 ] << 8 ) | buffer[ 3 ] ) ) {

				return rgbe_error( rgbe_format_error, "wrong scanline width" );

			}

			data_rgba = new Uint8Array( 4 * w * h );

			if ( ! data_rgba || ! data_rgba.length ) {

				return rgbe_error( rgbe_memory_error, "unable to allocate buffer space" );

			}

			offset = 0; pos = 0; ptr_end = 4 * scanline_width;
			rgbeStart = new Uint8Array( 4 );
			scanline_buffer = new Uint8Array( ptr_end );

			// read in each successive scanline
			while ( ( num_scanlines > 0 ) && ( pos < buffer.byteLength ) ) {

				if ( pos + 4 > buffer.byteLength ) {

					return rgbe_error( rgbe_read_error );

				}

				rgbeStart[ 0 ] = buffer[ pos ++ ];
				rgbeStart[ 1 ] = buffer[ pos ++ ];
				rgbeStart[ 2 ] = buffer[ pos ++ ];
				rgbeStart[ 3 ] = buffer[ pos ++ ];

				if ( ( 2 != rgbeStart[ 0 ] ) || ( 2 != rgbeStart[ 1 ] ) || ( ( ( rgbeStart[ 2 ] << 8 ) | rgbeStart[ 3 ] ) != scanline_width ) ) {

					return rgbe_error( rgbe_format_error, "bad rgbe scanline format" );

				}

				// read each of the four channels for the scanline into the buffer
				// first red, then green, then blue, then exponent
				ptr = 0;
				while ( ( ptr < ptr_end ) && ( pos < buffer.byteLength ) ) {

					count = buffer[ pos ++ ];
					isEncodedRun = count > 128;
					if ( isEncodedRun ) count -= 128;

					if ( ( 0 === count ) || ( ptr + count > ptr_end ) ) {

						return rgbe_error( rgbe_format_error, "bad scanline data" );

					}

					if ( isEncodedRun ) {

						// a (encoded) run of the same value
						byteValue = buffer[ pos ++ ];
						for ( i = 0; i < count; i ++ ) {

							scanline_buffer[ ptr ++ ] = byteValue;

						}
						//ptr += count;

					} else {

						// a literal-run
						scanline_buffer.set( buffer.subarray( pos, pos + count ), ptr );
						ptr += count; pos += count;

					}

				}


				// now convert data from buffer into rgba
				// first red, then green, then blue, then exponent (alpha)
				l = scanline_width; //scanline_buffer.byteLength;
				for ( i = 0; i < l; i ++ ) {

					off = 0;
					data_rgba[ offset ] = scanline_buffer[ i + off ];
					off += scanline_width; //1;
					data_rgba[ offset + 1 ] = scanline_buffer[ i + off ];
					off += scanline_width; //1;
					data_rgba[ offset + 2 ] = scanline_buffer[ i + off ];
					off += scanline_width; //1;
					data_rgba[ offset + 3 ] = scanline_buffer[ i + off ];
					offset += 4;

				}

				num_scanlines --;

			}

			return data_rgba;

		}
	;

	var byteArray = new Uint8Array( buffer ),
		byteLength = byteArray.byteLength;
	byteArray.pos = 0;
	var rgbe_header_info = RGBE_ReadHeader( byteArray );

	if ( RGBE_RETURN_FAILURE !== rgbe_header_info ) {

		var w = rgbe_header_info.width,
			h = rgbe_header_info.height
			, image_rgba_data = RGBE_ReadPixels_RLE( byteArray.subarray( byteArray.pos ), w, h )
		;
		if ( RGBE_RETURN_FAILURE !== image_rgba_data ) {

			return {
				width: w, height: h,
				data: image_rgba_data,
				header: rgbe_header_info.string,
				gamma: rgbe_header_info.gamma,
				exposure: rgbe_header_info.exposure,
				format: THREE.RGBEFormat, // handled as THREE.RGBAFormat in shaders
				type: THREE.UnsignedByteType
			};

		}

	}
	return null;

};


CLOUD.IBLManager = function(viewer) {

	this.viewer = viewer;
	this.IBLConfig = null;

    this.isHDR = true;
    this.textureLoad = false;

	var IBLIndex = 0;
	var IBLName = null;

	//开启或者关闭IBL效果
	this.enableIBL = function (isEnable) {

        if (CLOUD.GlobalData.IBL === isEnable) {
            return;
        }

        CLOUD.GlobalData.IBL = isEnable;

        if (isEnable) {
        	if (IBLName != null) {
            	this.initIBLByName(IBLName);
        	}
        	else {
        		this.initIBLByIndex(IBLIndex);
        	}
        }
        else {
            this.viewer.modelManager.changeAllMaterials(false);
            this.removeSkyBox();
        }

    };

    //读取IBLConfig文件
	this.loadIBLConfig = function(url) {

		var scope = this;
		var viewer = this.viewer;
        var loader = new THREE.FileLoader();

        loader.load(url, function (text) {
            scope.IBLConfig = JSON.parse(text);
            if (CLOUD.GlobalData.IBL) {
                scope.initIBLByIndex(0);
            }
        }, undefined, function() {

            viewer.modelManager.dispatchEvent({type: CLOUD.LOADERROREVENTS.LOAD_ERROR, errorType: CLOUD.LOADERROREVENTS.LOAD_IBLCONFIG_ERROR, event: event});

        });

	};

	//在有IBLConfig文件的情况下，使用index来设置IBL
	this.initIBLByIndex = function (index) {

        if (!CLOUD.GlobalData.IBL) {
            return;
        }

        if (this.IBLConfig != null) {

            var keys = Object.keys(this.IBLConfig);
            if (keys.length > index) {

                var cfg = this.IBLConfig[keys[index]];
                this.loadIBLMaps(cfg.url, cfg.isHDR, cfg.uniforms);
                IBLIndex = index;
                IBLName = keys[index];

            }
            else {
                new Error("Index is out of range.");
            }

        }
        else {
            new Error("IBLConfig is not exist.");
        }

    };

    //在有IBLConfig文件的情况下，使用name来设置IBL
    this.initIBLByName = function(name) {

    	if (!CLOUD.GlobalData.IBL) {
            return;
        }

        if (this.IBLConfig != null) {

        	if (this.IBLConfig.hasOwnProperty(name)) {

        		var cfg = this.IBLConfig[name];
                this.loadIBLMaps(cfg.url, cfg.isHDR, cfg.uniforms);
                IBLName = name;

        	}
        	else {
        		new Error("Name is not exist.");
        	}

        }
        else {
            new Error("IBLConfig is not exist.");
        }

    };

    /**
	 * 通过url，来设置IBL
	 *
	 * @param {string} url - 需要读取的文件夹路径
	 * @param {bool} isHDR - 是否是HDR贴图
	 * @return {bool} skyBox - 读取时，是否打开skyBox
	 * @return {object} params - IBL效果参数
	 */
    this.loadIBLMaps = function(url, isHDR, skyBox, params) {

        if (!CLOUD.GlobalData.IBL) {
            return;
        }

        var scope = this;
        var viewer = this.viewer;
        var scene = viewer.getScene();
        scene.IBLMaps.loadMaps(url, isHDR, function (IBLMaps, isHDR) {

            viewer.modelManager.changeAllMaterials(true);
            viewer.modelManager.updateMaterials();
            for (var id in params) {
                viewer.modelManager.updateMaterialsValue(id, params[id]);
            }

            if (skyBox) {
            	scope.addSkyBox(isHDR, params);
        	}

            scope.textureLoad = true;

            viewer.render();

        });

    };

    /**
	 * 添加天空盒（需要调用render才能显示效果）
	 *
	 * @param {bool} isHDR - 是否是HDR贴图
	 * @return {object} params - 效果参数
	 */
    this.addSkyBox = function (isHDR, params) {

        var isHDR = isHDR || this.isHDR;
        this.isHDR = isHDR;

        var cubeMesh = null;
        var scene = this.viewer.getScene();
        if (!scene.hasObjectGroup(CLOUD.ObjectGroupType.IBLCUBE)) {

            cubeMesh = new THREE.Mesh(
                new THREE.BoxBufferGeometry(2000.0, 2000.0, 2000.0),
                new THREE.ShaderMaterial({
                    uniforms: {
                        environmentMap: {value: scene.IBLMaps.environmentMap},
                        hdr: {value: isHDR},
                        shift: {value: 0.18},
                        A: {value: 0.27},
                        B: {value: 0.29},
                        C: {value: 0.052},
                        D: {value: 0.2},
                        E: {value: 0.0},
                        F: {value: 0.18},
                        scale: {value: 0.897105},
                    },
                    vertexShader: ImageBasedLighting.cube_vs,
                    fragmentShader: ImageBasedLighting.cube_fs,
                    side: THREE.BackSide,
                    depthTest: true,
                    depthWrite: true,
                    fog: false
                })
            );

            var group = scene.getOrCreateObjectGroup(CLOUD.ObjectGroupType.IBLCUBE, {priority: 10});
            group.add(cubeMesh);
        }
        else {
            var group = scene.getObjectGroup(CLOUD.ObjectGroupType.IBLCUBE);
            cubeMesh = group.children[0];
            cubeMesh.material.uniforms.environmentMap.value = scene.IBLMaps.environmentMap;
            cubeMesh.material.uniforms.hdr.value = isHDR;
        }

        if (params) {

            var material = cubeMesh.material;
            for (var id in params) {
                if (material.uniforms.hasOwnProperty(id)) {
                    material.uniforms[id].value = params[id];
                }
            }

        }

    };


    /**
	 * 移除天空盒（需要调用render才能显示效果）
	 *
	 */
    this.removeSkyBox = function () {

        var scene = this.viewer.getScene();
        if (scene.hasObjectGroup(CLOUD.ObjectGroupType.IBLCUBE)) {
            scene.removeObjectGroupByName(CLOUD.ObjectGroupType.IBLCUBE);
        }

    };

}

/**
 * 模型浏览类
 *
 * @class  CLOUD.Viewer
 *
 */
CLOUD.Viewer = function () {

    this.domElement = null;
    this.camera = null;
    this.renderer = null;

    // 增量绘制
    this.countRenderRequest = 0;
    this.maxCountRenderRequest = 10000;
    this.rendering = false;
    this.incrementRenderHandle = 0;

    this.callbacks = {};

    this.tmpBox = new THREE.Box3();

    this.enableCameraNearFar = true; // 允许动态计算裁剪面
    this.currentHomeView = CLOUD.EnumStandardView.ISO; // home视图设置
    this.initialView = CLOUD.EnumStandardView.ISO; // init视图设置

    this.filter = new CLOUD.FilterManager();
    this.modelManager = new CLOUD.ModelManager(this.filter);
    this.editorManager = new CLOUD.EditorManager();

    this.isRecalculationPlanes = false;
    this.calculationPlanesBind = this.calculationPlanes.bind(this);
    this.addRenderFinishedCallback(this.calculationPlanesBind);

    this.transitionAnimationState = false;
    this.animator = new CLOUD.CameraAnimator();
    this.animator.setDuration(1000);// 持续1s

    this.IBLManager = new CLOUD.IBLManager(this);

    var scope = this;
};

/**
 * @lends CLOUD.Viewer.prototype
 *
 */
CLOUD.Viewer.prototype = {

    constructor: CLOUD.Viewer,

    // ------ 注册自定义回调函数 S -------------- //
    /**
     * 注册回调函数
     *
     * @param {String} type - 回调函数类型
     * @param {function()} callback - 回调函数
     */
    addCallbacks: function (type, callback) {

        var list = this.callbacks[type];

        if (!list) {
            list = [];
            this.callbacks[type] = list;
        }

        if (list.indexOf(callback) === -1) {
            list.push(callback);
        }
    },

    /**
     * 取消某类型回调函数注册
     *
     * @param {String} type - 回调函数类型
     * @param {function()} callback - 回调函数
     */
    removeCallbacks: function (type, callback) {

        var list = this.callbacks[type];

        if (!list) {
            return;
        }

        var index = list.indexOf(callback);

        if (index !== -1) {
            list.splice(index, 1);
        }
    },

    /**
     * 取消所有注册
     *
     */
    removeAllCallbacks: function () {

        for (var type in this.callbacks) {

            var list = this.callbacks[type];

            for (var i = 0, length = list.length; i < length; i++) {
                list.splice(0, 1);
            }
        }

        for (var type in this.callbacks) {

            delete this.callbacks[type];
        }

        this.callbacks = {};
    },

    /**
     * 响应回调
     *
     */
    onCallbacks: function (type) {

        var list = this.callbacks[type];

        if (!list) {
            return;
        }

        // remark：回调函数内部注销回调会造成遍历错误，
        // 这里每次遍历都判断列表长度，实际上这样处理只是避免了系统崩溃，结果其实错误的，因为会漏掉一部分函数处理。
        // 避免回调事件函数内部注销自己(或其它函数事件)
        for (var i = 0; i < list.length; i++) {
            list[i] && list[i]();
        }
    },

    // ------ 注册自定义回调函数 E -------------- //

    // ------ 管理外部插件的render S -------------- //

    /**
     * 注册 render 回调函数
     *
     * @param {function()} callback - render 回调函数
     */
    addRenderCallback: function (callback) {
        this.addCallbacks("render", callback);
    },

    /**
     * 取消 render 回调注册
     *
     * @param {function()} callback - render 回调函数
     */
    removeRenderCallback: function (callback) {
        this.removeCallbacks("render", callback);
    },

    /**
     * 响应 render 回调
     *
     */
    onRenderCallback: function () {
        this.onCallbacks("render");
    },

    /**
     * 注册 render Finished
     *
     */
    addRenderFinishedCallback: function (callback) {
        this.addCallbacks("renderFinished", callback);
    },

    /**
     * 取消 render Finished 注册
     *
     * @param {function()} callback - render finished 回调函数
     */
    removeRenderFinishedCallback: function (callback) {
        this.removeCallbacks("renderFinished", callback);
    },

    /**
     * 响应 render Finished
     *
     */
    onRenderFinishedCallback: function () {
        this.onCallbacks("renderFinished");
    },

    // ------ 管理外部插件的render E -------------- //

    /**
     * 释放资源
     *
     */
    destroy: function () {

        this.removeAllCallbacks();
        this.editorManager.unregisterDomEventListeners(this.domElement);
        this.domElement.removeChild(this.domElement.childNodes[0]);
        this.domElement = null;

        this.editorManager.destroy();
        this.modelManager.destroy();

        if (this.renderer && this.renderer.destroy) {
            this.renderer.destroy();
        }

        this.renderer = null;
        this.modelManager = null;
        this.editorManager = null;
    },

    /**
     * 初始化
     *
     * @param {dom} domElement - dom容器
     */
    init: function (domElement) {

        console.log("Web3D: " + CLOUD.Version);

        var scope = this;
        this.domElement = domElement;

        var incrementRenderEnabled = CLOUD.GlobalData.IncrementRender;
        var maxDrawCacheNum = CLOUD.GlobalData.maxDrawCacheNum;
        var settings = {alpha: true, preserveDrawingBuffer: true, antialias: true, maxDrawCacheNum: maxDrawCacheNum};

        //if (!CLOUD.GlobalData.disableAntialias)
        //    settings.antialias = true;

        var canvas;

        try {
            canvas = document.createElement('canvas');
            var webglContext = canvas.getContext('webgl', settings) || canvas.getContext('experimental-webgl', settings);

            if (!webglContext) {
                settings.antialias = false;
            }

        } catch (e) {
            return false;
        }

        CLOUD.GeomUtil.initializeUnitInstances();

        settings.canvas = canvas;

        if (incrementRenderEnabled) {
            this.renderer = new THREE.WebGLRendererByIncrement(settings);
            this.orderedRenderer = new CLOUD.OrderedRenderer();
            this.renderer.setRenderer(this.orderedRenderer);
            this.renderer.setRenderTicket(0);
        } else {
            this.renderer = new THREE.WebGLRenderer(settings);
            CLOUD.GlobalData.IncrementRender = false;
        }

        this.renderer.domElement.addEventListener("webglcontextlost", function (event) {
            event.preventDefault();
            if (scope.incrementRenderHandle > 0) {
                cancelAnimationFrame(scope.incrementRenderHandle);
                console.log("---------------- webglcontextlost --------------");
            }
        }, false);

        // window.innerWidth, window.innerHeight
        var viewportWidth = domElement.offsetWidth;
        var viewportHeight = domElement.offsetHeight;

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(viewportWidth, viewportHeight);

        this.renderer.toneMapping = CLOUD.GlobalData.ToneMapping;

        // Added by xmh begin
        // 允许获得焦点，将键盘事件注册到父容器（之前注册到window上会存在各种联动问题），鼠标点击父容器，激活canvas
        this.renderer.domElement.setAttribute('tabindex', '0');
        this.renderer.domElement.setAttribute('id', 'cloud-main-canvas');
        // Added by xmh end
        this.domElement.appendChild(this.renderer.domElement);

        if (CLOUD.GlobalData.EnableRenderPass) {
            var extensions = new THREE.WebGLExtensions(webglContext);
            var supportMRT = extensions.get('WEBGL_draw_buffers');
            if (supportMRT) {
                CLOUD._renderComposer.init(this.renderer, viewportWidth, viewportHeight, supportMRT);
            } else {
                // disable render pass if MRT is not supported, resort to old render method
                // TODO: we need to render twice to get id target if MRT is not support
                CLOUD.GlobalData.EnableRenderPass = false;
            }
        }

        // Camera
        var cameraParams = {width: viewportWidth, height: viewportHeight, fov: 45, near: 0.1, far: CLOUD.GlobalData.SceneSize * 20.0};
        this.camera = this.defaultCamera = new CLOUD.Camera(CLOUD.CAMERATYPE.PERSPECTIVE, cameraParams );
        var camera = this.camera;
        this.cameraControl = new CLOUD.CameraControl(this, this.getScene(), camera, domElement, function (sceneNotChanged) {
            scope.render(sceneNotChanged);
        });

        this.setEditorDefault();

        // Register Events
        this.editorManager.registerDomEventListeners(this.domElement);

        this.modelManager.onUpdateViewer = function () {
            scope.render(true);
        };

        //this.editorManager.registerDomEventListeners(canvas);
        return true;
    },

    /**
     *  刷新渲染模型
     *
     */
    render: function (sceneNotChanged) {

        // benchmark @ 20180314
        //console.time("viewer.render");
        var scope = this;
        var camera = this.camera;
        var modelManager = this.modelManager;
        var renderer = this.renderer;
        var scene = this.getScene();
        var incrementRenderEnabled = CLOUD.GlobalData.IncrementRender;

        // 没有模型加载,返回
        if (!modelManager.hasModel()) {

            // BIMFACEDM-2869
            // 1. empty scene （no model loaded)
            // 2. loaded model was unloaded, we need render empty scene.
            CLOUD.Logger.log("model not loaded!");
            renderer.render(scene, camera);
            return;
        }

        if (CLOUD.GlobalData.IBL && this.getIBLManager().textureLoad == false) return;

        // 增量绘制
        if (incrementRenderEnabled) {

            ++this.countRenderRequest;

            if (this.countRenderRequest > this.maxCountRenderRequest)
                this.countRenderRequest = 0;

            if (this.rendering) {
                return;
            }

            this.rendering = true;

            // update camera's inner/outer status, both "calculateNearFar" and "prepareScene" will use this info.
            modelManager.calculateCameraModelRelation(camera.position);
            this.calculateNearFar();
            this.cameraControl.updateCamera();

            scene.updateLights(camera);

            var isUpdateRenderList = this.editorManager.isUpdateRenderList;

            if (CLOUD.GlobalData.EnableRenderPass) {
                CLOUD._renderComposer.restart(sceneNotChanged, this.modelManager.sceneState.hoverId);
                // always update render list
                // TODO: consider a better solution not to update the render list, for example, zoom the scene
                renderer.setObjectListUpdateState(true);
            }
            else {
                renderer.resetIncrementRender();// 重置增量绘制状态
                renderer.setObjectListUpdateState(isUpdateRenderList);// 设置更新状态
            }

            function incrementRender(callId, autoClear) {

                var renderId = callId;

                return function () {

                    // var renderer = scope.renderer;
                    renderer.autoClear = autoClear;

                    if (scope.editorManager.cameraChange) {

                        renderer.resetIncrementRender();// 重置增量绘制状态
                        renderer.autoClear = true;
                        scope.editorManager.cameraChange = false;

                    } else {

                        renderer.autoClear = autoClear;

                    }

                    // var timeTag = "IncrementRender_";
                    // timeTag += renderId;

                    // console.time(timeTag);

                    var isFinished = CLOUD.GlobalData.EnableRenderPass ?
                                        CLOUD._renderComposer.renderIncrement(scene, camera)
                                        :renderer.render(scene, camera);

                    // console.timeEnd(timeTag);

                    if (!isFinished && renderId === scope.countRenderRequest) {

                        scope.incrementRenderHandle = requestAnimationFrame(incrementRender(renderId, false));

                    } else {

                        scope.rendering = false;

                        // CLOUD.Logger.timeEnd("incrementRender");

                        if (renderId !== scope.countRenderRequest) {
                            scope.render();
                        } else {

                            CLOUD.GlobalData.EnableRenderPass && CLOUD._renderComposer.finish();

                            // benchmark @ 20180314
                            //console.timeEnd("viewer.render");

                            // console.log("------------ finished rendering ------------");
                            // 结束后回调函数
                            scope.onRenderFinishedCallback();
                        }
                    }
                }
            }

            this.incrementRenderHandle = requestAnimationFrame(incrementRender(scope.countRenderRequest, true));

            if (isUpdateRenderList) {
                modelManager.prepareScene(camera);
            }

            this.onRenderCallback();

        } else { // 正常绘制

            // update camera's inner/outer status, both "calculateNearFar" and "prepareScene" will use this info.
            modelManager.calculateCameraModelRelation(camera.position);
            this.calculateNearFar();
            this.cameraControl.updateCamera();

            scene.updateLights(camera);
            modelManager.prepareScene(camera);
            
            CLOUD.Logger.time("webgl render");
            if (CLOUD.GlobalData.EnableRenderPass) {
                CLOUD._renderComposer.restart(sceneNotChanged, this.modelManager.sceneState.hoverId);
            }
            CLOUD.GlobalData.EnableRenderPass ? CLOUD._renderComposer.render(scene, camera)
                                                    :renderer.render(scene, camera);
            CLOUD.Logger.timeEnd("webgl render");

            // benchmark @ 20180314
            //console.timeEnd("viewer.render");

            this.onRenderCallback();
            this.onRenderFinishedCallback();// 结束后回调函数
        }

        this.cameraControl.setCameraChanging(false); // add
    },

    /**
     * 窗口大小变化回调事件
     *
     * @param {Number} width - 窗口宽
     * @param {Number} height - 窗口高
     */
    resize: function (width, height) {

        var camera = this.camera;
        camera.setSize(width, height);
        camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        if (CLOUD.GlobalData.EnableRenderPass) {
            CLOUD._renderComposer.setSize(width, height);
        }

        this.onCallbacks("resize");
        this.render();
    },

    /**
     * 动态计算相机远近裁剪面
     *
     */
    calculateNearFar: function () {

        var scene = this.getScene();
        var boundingBox = scene.getBoundingBoxWorld();
        var camera = this.camera;

        // reducing z-fighting by dynamically adjust near/far
        if (boundingBox != null) {

            var box = this.tmpBox;
            box.copy(boundingBox);
            box.applyMatrix4(scene.getMatrixGlobal());

            var center = box.getCenter();
            var position = camera.position;
            var newPos = position.clone().sub(center);
            var length = newPos.length();
            var maxLength = box.getSize().length();

            var zNear, zFar;

            if (this.modelManager.containsCamera || !this.enableCameraNearFar) {

                zFar = maxLength;

                if (camera.isPerspective) {
                    zNear = 0.1;
                } else {
                    zNear = -zFar;
                }


            } else {

                var radius = 0.5 * maxLength;
                zFar = length + radius;

                if (camera.isPerspective) {
                    var delta = 0.001;
                    zNear = (length * length + length * delta) / ((1 << 24) * delta);

                    if(length > radius && zNear + radius > length) {
                        // BIMFACEDM-2821:
                        // When observing from outside of scene's bound sphere,
                        // avoiding huge 'near' which cutting out the scene.
                        zNear = length - radius;
                    }
                } else {
                    zNear = -zFar;
                }
            }

            camera.setNearFar(zNear, zFar);
        }
    },

    /**
     *  注册Dom事件
     *
     */
    registerDomEventListeners: function () {
        if (this.domElement) {
            this.editorManager.registerDomEventListeners(this.domElement);
        }
    },

    /**
     *  取消Dom事件
     *
     */
    unregisterDomEventListeners: function () {
        if (this.domElement) {
            this.editorManager.unregisterDomEventListeners(this.domElement);
        }
    },

    /**
     *  注册模型事件监听器
     *
     */
    registerEventListener: function (type, callback) {
        this.modelManager.addEventListener(type, callback);
    },

    /**
     * 加载模型
     *
     * @param {String} databagId - 模型包名
     * @param {String} serverUrl - 服务器地址
     * @param {Boolean} notifyProgress - 是否通知加载进度，默认true
     * @param {Boolean} debug - 是否调试，可选
     */
    load: function (databagId, serverUrl, notifyProgress, debug) {

        notifyProgress = notifyProgress || true;
        var scope = this;

        return this.modelManager.load({
            databagId: databagId,
            serverUrl: serverUrl,
            notifyProgress: notifyProgress,
            debug: debug
        }, function(){

            scope.modelManager.updateScene(); //

            // user might do something when finishing loading model,
            // here make default render call after user's customization.
            // customized camera setting ,should dirty the camera.
            if(scope.camera.dirty) {
                scope.render();
            } else  {
                scope.goToInitialView();
                scope.zoomAll();
            }
        });
    },

    /**
     * 卸载模型
     *
     * @param {String} databagId - 模型包名
     */
    unload: function (databagId) {

        // TODO: check the active camera, if the active camera belongs to the model,
        //        should not unload the model

        var success = this.modelManager.unload(databagId);

        if (success) {
            this.zoomAll();
            this.render();
        }

    },

    /**
     * 卸载所有模型
     *
     */
    unloadAll: function () {

        this.modelManager.unloadAll();
        this.render();
    },

    /**
     * 显示指定模型
     *
     * @param {String} databagId - 模型包名
     */
    showModel: function (databagId) {

        var success = this.modelManager.showModel(databagId);

        if (success) {
            this.render();
        }

    },

    /**
     * 隐藏指定模型
     *
     * @param {String} databagId - 模型包名
     */
    hideModel: function (databagId) {

        var success = this.modelManager.hideModel(databagId);

        if (success) {
            this.render();
        }

    },

    /**
     * 隐藏或显示模型
     *
     * @param {Object} model - 模型对象
     *@param {Boolean} bVisible - 是否可见
     */
    showScene: function (model, bVisible) {

        if (model) {

            model.setVisible(bVisible);
            this.render();
        }
    },

    /**
     * 清除场景数据
     *
     */
    clearAll: function () {
        this.getScene().clearAll();
    },

    /**
     * 获得场景对象
     *
     */
    getScene: function () {
        return this.modelManager.scene;
    },

    /**
     * 获得交互管理对象
     */
    getEditorManager: function() {
        return this.editorManager;
    },

    /**
     * 获得过滤器对象
     *
     */
    getFilter: function () {
        return this.filter;
    },

    /**
     * 获得当前 Editor 名字标识
     *
     * @return {String} Editor 名字标识
     */
    getCurrentEditorName: function () {
        return this.editorManager.getCurrentEditorName();
    },

    /** 获得 Editor 对象
     *
     * @returns {Object} Editor 模式
     */
    getCurrentEditor: function () {

        return this.editorManager.getCurrentEditor();
    },

    /**
     * 设置 Editor 模式
     *
     * @param {String} name - Editor 名字标识 {@link CLOUD.EditorMode}
     */
    setEditorMode: function (name) {
        this.editorManager.setEditorMode(this, name);
    },

    /**
     * 设置缺省的Editor模式（框选模式 - RectPick Editor）
     *
     */
    setEditorDefault: function () {
        this.setEditorMode(CLOUD.EditorMode.PICK);
    },

    /**
     * 设置单选模式 - Pick Editor
     *
     */
    setPickMode: function () {
        console.warn('CLOUD.Viewer.setPickMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.PICK);
    },

    /**
     * 设置框选模式 - RectPick Editor
     *
     */
    setRectPickMode: function () {
        console.warn('CLOUD.Viewer.setRectPickMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.PICK_BY_RECT);
    },

    /**
     * 设置自由旋转模式 - Orbit Editor
     *
     */
    setOrbitMode: function () {
        console.warn('CLOUD.Viewer.setOrbitMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.ORBIT);
    },

    /**
     * 设置缩放模式 - Zoom Editor
     *
     */
    setZoomMode: function () {
        console.warn('CLOUD.Viewer.setZoomMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.ZOOM);
    },

    /**
     * 设置框选缩放模式 - RectZoom Editor
     *
     */
    setRectZoomMode: function () {
        console.warn('CLOUD.Viewer.setRectZoomMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.ZOOM_BY_RECT);
    },

    /**
     * 设置平移模式 - Pan Editor
     *
     */
    setPanMode: function () {
        console.warn('CLOUD.Viewer.setPanMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.PAN);
    },

    /**
     * 设置飞行模式 - Fly Editor
     *
     */
    setFlyMode: function () {
        console.warn('CLOUD.Viewer.setFlyMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.FLY);
    },

	/**
     * 设置测量模式 - Measure Editor
     *
     */
    setMeasureMode: function () {
        console.warn('CLOUD.Viewer.setMeasureMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.MEASURE);
    },

    /**
     * 设置切面模式 - ClipPlanes Editor
     *
     */
    setClipPlanesMode: function () {
        console.warn('CLOUD.Viewer.setClipPlanesMode() has been deprecated. Use CLOUD.Viewer.setEditorMode(name) instead.');
        this.setEditorMode(CLOUD.EditorMode.CLIP_BY_BOX);
    },

    /**
     * 获得场景包围盒(变换前)
     *
     * @return {THREE.Box3} 场景包围盒
     */
    getBoundingBoxWorld: function () {
        return this.getScene().getBoundingBoxWorld();
    },

    /**
     * 获得场景包围盒(变换后)
     *
     * @return {THREE.Box3} 场景包围盒
     */
    getBoundingBox: function () {
        return this.getScene().getBoundingBox();
    },

    /**
     * 放大
     *
     * @param {Number} factor - 放大因子
     */
    zoomIn: function (factor) {
        // 缩放时，改变相机缩放因子zoom，就会改变相机FOV，从而造成模型显示变形
        // 思路：保持相机FOV和目标点位置不变，调整相机位置达到缩放的目的
        //this.camera.setZoom(factor);

        // 放大，factor > 0
        if (factor === undefined) {
            factor = 0.1;
        }

        if (factor < 0) {
            factor = 0;
        }

        this.cameraControl.zoom(factor);
    },

    /**
     * 缩小
     *
     * @param {Number} factor - 缩小因子
     */
    zoomOut: function (factor) {
        // 缩放时，改变相机缩放因子zoom，就会改变相机FOV，从而造成模型显示变形
        // 思路：保持相机FOV和目标点位置不变，调整相机位置达到缩放的目的
        //this.camera.setZoom(factor);

        if (factor === undefined) {
            factor = 0.1;
        }

        if (factor > 0) {
            factor *= -1;
        } else {
            factor = 0;
        }

        // 缩小，factor < 0
        this.cameraControl.zoom(factor);
    },

    /**
     * 缩放到场景包围盒大小
     *
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    zoomAll: function (margin, ratio) {
        var box = this.getScene().getBoundingBox();
        this._zoomToLocalBBox(box, margin, ratio);
    },

    /**
     * 缩放到场景内部包围盒大小
     *
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    zoomToBuilding: function (margin, ratio) {

        this.zoomAll(margin, ratio);
    },

    /**
     * 缩放到选中构件包围盒大小
     *
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    zoomToSelection: function (margin, ratio) {
		var scene = this.getScene();
		var sceneState = this.modelManager.sceneState;
		
        var box = scene.getBoundingBoxOfGeometries(sceneState.getSelectionSet());
        if(box.isEmpty()) {
            box = scene.getBoundingBox(); // workspace
        }

        this._zoomToLocalBBox(box, margin, ratio);
    },

	/** Internal use only */
    /**
     * 缩放到指定包围包围盒大小
     *
     * @param {THREE.Box3} box - 包围盒（工作区坐标系，非世界坐标系）
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    _zoomToLocalBBox: function (box, margin, ratio, direction) {

        // TODO: zoomToBox的转场动画没实现（现在的CameraAnimator只是根据相机dir和up进行了插值)，重构时实现
        // TODO: regulaize camera and cameraControl's responsibility
        this.camera.zoomToBBox(box, margin, ratio, direction);
        this.cameraControl.update(true, true);
    },

    /**
     * 缩放到指定包围包围盒大小
     *
     * @param {THREE.Box3} box - 包围盒（世界坐标系）
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    zoomToBBox: function (box, margin, ratio) {

        // VAAS-335: zoomToBBox changes input parameter "box".
        // Make a copy of "box".
        var _bound = new THREE.Box3();
        if (!box) {
            _bound.copy(this.getScene().getBoundingBox());
        } else {
            _bound.copy(box);
            _bound.applyMatrix4(this.getScene().getMatrixGlobal());
        }
        this._zoomToLocalBBox(_bound, margin, ratio);
    },

    /**
     * 根据观察方向缩放到指定包围盒范围
     *
     * @param {THREE.Box3} box - 包围盒（世界坐标系）
     * @param {THREE.Vector3} direction - 观察方向（从包围盒中心指向某个参考点）
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    zoomToBBoxByDirection: function (box, direction, margin, ratio) {

        if (!direction) {
            this.zoomToBBox(box, margin, ratio);
            return;
        }

        if (direction && box) {
            var zoomBox = box.clone();
            var refPoint = zoomBox.getCenter().clone().add(direction);

            zoomBox.applyMatrix4(this.getScene().getMatrixGlobal());
            refPoint.applyMatrix4(this.getScene().getMatrixGlobal());

            var newDirection = refPoint.clone().sub(zoomBox.getCenter());

            if (newDirection.length() > 0.0001) {
                newDirection.normalize();
                viewer.camera.realUp.copy(THREE.Object3D.DefaultUp);// 先调整相机up方向,使得一直朝上
				this._zoomToLocalBBox(zoomBox, margin, ratio, newDirection);
            } else {
				this._zoomToLocalBBox(zoomBox, margin, ratio);
            }
        }

    },

    /**
     * 根据外围大包围盒和指定包围盒缩放到指定包围盒范围
     *
     * @param {THREE.Box3} box - 指定构件包围盒（世界坐标系）
     * @param {THREE.Box3} outerBox - 外围大包围盒
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    zoomToBBoxWithOuterBox: function (box, outerBox, margin, ratio) {

        if (!outerBox) {
            this.zoomToBBox(box, margin, ratio);
            return;
        }

        if (outerBox && box) {
            var zoomBox = box.clone();
            var refPoint = outerBox.getCenter();

            zoomBox.applyMatrix4(this.getScene().getMatrixGlobal());
            refPoint.applyMatrix4(this.getScene().getMatrixGlobal());

            var newDirection = refPoint.clone().sub(zoomBox.getCenter());

            if (newDirection.length() > 0.0001) {
                newDirection.normalize();
                this.camera.realUp.copy(THREE.Object3D.DefaultUp);// 先调整相机up方向,使得一直朝上
				this._zoomToLocalBBox(zoomBox, margin, ratio, newDirection);
            } else {
				this._zoomToLocalBBox(zoomBox, margin, ratio);
            }

        }
    },

    /**
     * 设置视角
     * TODO: 这个函数应该叫做goToStandardView , 因为它触发了绘制。相机需要整体重构。
     *
     * @param {Number} stdView - 视角（CLOUD.EnumStandardView.ISO， CLOUD.EnumStandardView.Top etc）
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Function} callback() - 回调函数
     */
    setStandardView: function (stdView, margin, callback) {		
		
        var box;
        var camera = this.camera;

        box = this.getScene().getBoundingBox();

        if (this.transitionAnimationState) { //enableAnimation

            this.animator.setStandardView(stdView, this, box, margin, callback);

        } else {

            camera.setStandardView(stdView, box); // 设置观察视图

            var target = this.camera.zoomToBBox(box, margin);// fit all
            this.cameraControl.update(true, true);

            callback && callback();// 是否回调

        }

    },

    /**
     * 设置观察视图, 该动作会不会触发重新绘制 (私有）
     * 该接口依赖场景数据，须在场景加载完成后使用才可以达到期望的结果。
     * TODO: 重构viewer 应该通过CameraControl控制相机姿态，而不应该直接使用camera
     * 2018.01.31 xiaojian
     *
     *
     * @param {Number} stdView - 视角（CLOUD.EnumStandardView.ISO， CLOUD.EnumStandardView.Top etc）
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     */
    _setStandardView: function (stdView, margin) {

        var camera = this.camera;
        var box = this.getScene().getBoundingBox();
        camera.setStandardView(stdView, box);
        camera.zoomToBBox(box, margin);
    },
    /**
     * 根据指定视角及包围盒缩放
     *
     * @param {Number} stdView - 视角（CLOUD.EnumStandardView.ISO， CLOUD.EnumStandardView.Top etc）
     * @param {THREE.Box3} box - 原始（未变换的）世界包围盒
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    setStandardViewWithBox: function (stdView, box, margin, ratio) {

        if (box) {
            box.applyMatrix4(this.getScene().getMatrixGlobal());
        } else {
            box = this.getScene().getBoundingBox();
        }

        if (this.transitionAnimationState) { //enableAnimation

            this.animator.setStandardView(stdView, this, box, margin);

        } else {

            var camera = this.camera;
            camera.setStandardView(stdView, box); // 设置观察视图
            camera.zoomToBBox(box, margin, ratio);
            this.cameraControl.update(true, true);
        }
    },

    /**
     * 根据 Top 视角及包围盒缩放(注意：这里名字有误导， 其实被设成了 ISO 视角)
     *
     * @param {THREE.Box3} box - 原始（未变换的）世界包围盒
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.0, margin > 0 模型缩小（包围盒变大），margin < 0 模型放大（包围盒变小）
     * @param {Number} ratio - 相机与中心距离的拉伸比例, 缺省值: 1.0
     */
    setTopView: function (box, margin, ratio) {
        this.setStandardViewWithBox(CLOUD.EnumStandardView.ISO, box, margin, ratio);
    },

    /**
     * 设置初始视角
     *
     * @param {Number} viewType - 视角（CLOUD.EnumStandardView.ISO， CLOUD.EnumStandardView.Top etc）
     */
    setInitialViewType: function (viewType) {

        console.warn('CLOUD.Viewer.setInitialViewType() has been deprecated. Use CLOUD.Viewer.setInitialView() instead.');
        this.setInitialView(viewType);
    },

    /**
     * 设置初始视角
     *
     * @param {Number} viewType - 视角（CLOUD.EnumStandardView.ISO， CLOUD.EnumStandardView.Top etc）
     */
    setInitialView: function (viewType) {
        this.initialView = viewType;  // TODO: 不应该在接口层维护相机状态，移至CameraControl
        this._setStandardView(viewType);

    },

    /**
     * 切换到初始视图
     *
     */
    goToInitialView: function (margin) {
        this.setStandardView(this.initialView, margin, null);
    },

    /**
     * 设置 home 视图类型
     *
     * @param {Number} viewType - 视角（CLOUD.EnumStandardView.ISO， CLOUD.EnumStandardView.Top etc）
     */
    setHomeViewType: function (viewType) {
        console.warn('CLOUD.Viewer.setHomeViewType() has been deprecated. Use CLOUD.Viewer.setHomeView() instead.');
        this.setHomeView(viewType);
    },

    /**
     * 设置 home 视图类型
     *
     * @param {Number} viewType - 视角（CLOUD.EnumStandardView.ISO， CLOUD.EnumStandardView.Top etc）
     */
    setHomeView: function (viewType) {
        this.currentHomeView = viewType;
        this._setStandardView(viewType);

    },

    /**
     * 切换到 home 视图
     *
     * @param {Number} margin - 包围盒缩放比例, 缺省值: 0.05
     */
    goToHomeView: function (margin) {
        this.setStandardView(this.currentHomeView, margin, null);
    },

    /**
     * 绕场景中心沿指定轴旋转一定角度
     *
     * @param speedRate 旋转速率；大于0 时逆时针旋转，小于0 时顺时针旋转
     * @param axis 旋转轴， 'x' 或 'y'， 默认为x 轴
     */
    rotateByAxis: function(speedRate, axis) {
        var rotatePivot = this.cameraControl.calculatePivot(CLOUD.RotatePivotMode.CENTER, null);

        var speed = 2 * Math.PI / 60 / 60 * speedRate;
        if (!axis || axis == 'x') {
            this.cameraControl.handleRotation(-speed, 0, rotatePivot);
        } else if (axis == 'y') {
            this.cameraControl.handleRotation(0, -speed, rotatePivot);
        } else {
            console.warn("Illegal rotation axis for Viewer.rotateByAxis().");
            return;
        }

        this.cameraControl.update(true);
    },

    /**
     * 设置图片资源的路径。默认在“images/”
     *
     * @param {String} path - 资源路径
     */
    setImageResPath: function (path) {
        CLOUD.GlobalData.TextureResRoot = path;
    },

    /**
     * 设置场景中所有灯光的光照强度的调整系数
     *
     * @param {Number} factor - 灯光强度系数
     */
    setLightIntensityFactor: function (factor) {
        CLOUD.GlobalData.LightIntensityFactor = factor;
    },

    /**
     * 设置每帧的最大耗时
     *
     * @param {Number} limitTime - 最长时间
     */
    setLimitFrameTime: function (limitTime) {
        if (CLOUD.GlobalData.IncrementRender) {

            if (limitTime <= 0) {
                limitTime = 30;
            }

            CLOUD.GlobalData.LimitFrameTime = limitTime;
        }
    },

    /**
     * 限制帧率
     *
     * @param {Number} frameRate - 最大帧率
     */
    limitFrameRate: function (frameRate) {

        if (CLOUD.GlobalData.IncrementRender) {

            if (frameRate <= 0) {
                frameRate = 4;
            }

            CLOUD.GlobalData.LimitFrameTime = 1000 / frameRate;
        }
    },

    /**
     * 相机变换 - 将世界系相机位置变化到绘图空间
     *
     * @param {Object} camera - 相机状态JSON对象
     *                          （{"position":"26513.603437903, -14576.4810728955, 15107.6582255056",
     *                          "direction":"-220.050259546712, 169.277369901229, -125.801809656091",
     *                          "up":"0, 0, 304.8"})
     * @return {Object} 新相机信息
     */
    transformCamera: function (camera) {
        return CLOUD.CameraUtil.transformCamera(camera, this.modelManager.scene);
    },

    /**
     * 获得世界空间的相机状态，包括：
     *     name：     相机名称
     *     position:  位置
     *     target:    相机对准的目标
     *     up:        相机向上的朝向
     *
     * @return {String} 相机信息字符串
     */
    getCamera: function () {
        //return this.cameraControl.getCameraInfo();

        var scene = this.getScene();
        var matrixScene = scene.getMatrixGlobal();

        var camera = this.cameraControl.getCamera();
        var cameraName = this.cameraControl.getCameraName();
        var camInfo = new CLOUD.CameraInfo(cameraName,camera.position, camera.target, camera.up);

        camInfo = CLOUD.Camera.drawingToWorld(camInfo, matrixScene);

        var newCameraInfo = new CLOUD.CameraInfo(cameraName,camInfo.position, camInfo.target, camInfo.up);

        return JSON.stringify(newCameraInfo);
    },

    /**
     * 设置世界空间(兼容绘图空间，无版本号的数据为绘图空间数据)的相机状态
     *
     * @param {String} jsonStr - 相机信息字符串
     * @param {Boolean} force - 是否强制更新相机
     * @param {Function} callbackFinish - 相机设置完成后回调函数
     */
    setCamera: function (jsonStr, force, callbackFinish) {

        var scope = this;

        var camInfo = CLOUD.CameraUtil.parseCameraInfo(jsonStr);
        if (camInfo === null) {
            console.log("Invalid camera info string. Fail to set camera.")
        }else if ( this.switchToCamera(camInfo.name)) {

            var scene = this.getScene();
            var matrixScene = scene.getMatrixGlobal();
            var newCameraInfo = null;

            // 临时代码：兼容处理
            if (camInfo.version) {
                newCameraInfo = CLOUD.Camera.worldToDrawing(camInfo, matrixScene);
            } else {
                newCameraInfo = camInfo;
            }

            if (this.transitionAnimationState) {

                var currentCameraInfo = {
                    position: this.camera.position.clone(),
                    target: this.camera.target.clone(),
                    up: this.camera.up.clone()
                };

                this.animator.active(currentCameraInfo, newCameraInfo, this, function (target) {
                    scope.cameraControl.update(true, true);
                }, callbackFinish)

            } else {

                var dir = new THREE.Vector3();
                dir.subVectors(newCameraInfo.target, newCameraInfo.position);
                this.camera.LookAt(newCameraInfo.target, dir, newCameraInfo.up);

                if(force) {
                    this.cameraControl.updateCamera();
                }

                callbackFinish && callbackFinish();
            }
        }
    },

    /**
     * 获得render buffer base64图形数据
     *
     * @param {Color} backgroundClr - 背景颜色
     * @param {Function} callback - 回调函数（参数为截取的 base64 图形数据）
     * @return {String} 如果存在回调函数，则返回 null， 否则 返回 base64 图形数据
     */
    getRenderBufferScreenShot: function (backgroundClr, callback) {

        // 在高分屏上toDataURL直接获得图片数据比实际的图片大
        var domElement = this.renderer.domElement;
        var dataUrl = domElement.toDataURL("image/png");
        var canvasWidth = domElement.width;
        var canvasHeight = domElement.height;
        var pixelRatio = window.devicePixelRatio || 1;
        //pixelRatio = 1;   //liuw-d  
        var w = canvasWidth / pixelRatio;
        var h = canvasHeight / pixelRatio;

        if (!w || !h) {

            if (callback) {
                callback(dataUrl);
                return null
            } else {
                return dataUrl;
            }
        }

        var nw, nh, nx = 0,
            ny = 0;

        if (w > h || (canvasWidth / canvasHeight < w / h)) {
            nw = w;
            nh = canvasHeight / canvasWidth * w;
            ny = h / 2 - nh / 2;
        } else {
            nh = h;
            nw = canvasWidth / canvasHeight * h;
            nx = w / 2 - nw / 2;
        }

        if (callback) {

            var newImage = new Image();
            newImage.onload = function () {

                var tmpCanvas = document.createElement("canvas");
                var ctx = tmpCanvas.getContext("2d");
                tmpCanvas.width = w;
                tmpCanvas.height = h;

                if (backgroundClr) {
                    ctx.fillStyle = backgroundClr;
                    ctx.fillRect(0, 0, w, h);
                }

                ctx.drawImage(newImage, nx, ny, nw, nh);

                var newURL = tmpCanvas.toDataURL("image/png");

                callback(newURL);
            };

            newImage.src = dataUrl;

            return null;
        }

        var newImage = new Image();

        newImage.src = dataUrl;

        var tmpCanvas = document.createElement("canvas");
        var ctx = tmpCanvas.getContext("2d");
        tmpCanvas.width = w;
        tmpCanvas.height = h;

        if (backgroundClr) {
            ctx.fillStyle = backgroundClr;
            ctx.fillRect(0, 0, w, h);
        }

        ctx.drawImage(newImage, nx, ny, nw, nh);

        var newURL = tmpCanvas.toDataURL("image/png");

        return newURL;
    },

    /**
     * 截取指定大小的base64图形
     *
     * @param {Number} width - 截图宽度
     * @param {Number} height - 背景颜色
     * @param {Function} callback - 回调函数（参数为截取的 base64 图形数据）
     * @return {String} 如果存在回调函数，则返回 null， 否则 返回 base64 图形数据
     */
    screenShot: function (width, height, callback) {
        var scope = this;

        function getRenderBufferScreenShot(width, height, callback) {
            var domElement = scope.renderer.domElement;
            var dataUrl = domElement.toDataURL("image/png");
            var canvasWidth = domElement.width;
            var canvasHeight = domElement.height;
            var pixelRatio = window.devicePixelRatio || 1;
            //pixelRatio = 1;   //liuw-d   
            var w = width;
            var h = height;

            if (!w || !h) {
                if (callback) {
                    callback(dataUrl);
                    return null
                } else {
                    return dataUrl;
                }
            }

            var nw, nh, nx = 0,
                ny = 0;

            if (w > h || (canvasWidth / canvasHeight < w / h)) {
                nw = w;
                nh = canvasHeight / canvasWidth * w;
                ny = h / 2 - nh / 2;
            } else {
                nh = h;
                nw = canvasWidth / canvasHeight * h;
                nx = w / 2 - nw / 2;
            }

            if (callback) {

                var newImage = new Image();
                newImage.onload = function () {

                    var tmpCanvas = document.createElement("canvas");
                    var ctx = tmpCanvas.getContext("2d");
                    tmpCanvas.width = w;
                    tmpCanvas.height = h;
                    ctx.drawImage(newImage, nx, ny, nw, nh);

                    var newURL = tmpCanvas.toDataURL("image/png");
                    callback(newURL);
                };

                newImage.src = dataUrl;

                return null;
            }
        }

        var dataUrl = getRenderBufferScreenShot(width, height, callback);

        this.render();

        return dataUrl;
    },

    /**
     * 获得render buffer base64图形数据
     *
     * @param {Color} backgroundClr - 背景颜色
     * @param {Function} callback(dataUrl) - 回调函数（参数为截取的 base64 图形数据）
     * @return {String} 如果存在回调函数，则返回 null， 否则 返回 base64 图形数据
     */
    canvas2image: function (backgroundClr, callback) {

        var dataUrl;
        var scope = this;

        if (callback) {

            this.getRenderBufferScreenShot(backgroundClr, function (dataUrl) {

                callback(dataUrl);

                // 每次获得截图后，缓存数据貌似被清除了
                // 所以在每次调用后render一次
                scope.render();
            });

        } else {

            dataUrl = this.getRenderBufferScreenShot(backgroundClr);
            // 在chrome中多调用几次，会出现图片显示不正常（显示空白，原因是转换的值变得不正常了），
            // 每次获得截图后，缓存数据貌似被清除了
            // 所以在每次调用后render一次
            this.render();

            return dataUrl;

        }

        return null;
    },

    /**
     * 是否锁定Z轴
     *
     * @param {Boolean} isLock - true 锁定， 否则 解锁
     */
    lockAxisZ: function (isLock) {

        if (this.cameraControl) {
            this.cameraControl.lockAxisZ(isLock);
        }
    },

    /**
     * 允许双击半透明
     *
     * @param {Boolean} enable - true 允许
     */
    enableTranslucentByDClick: function (enable) {
        CLOUD.GlobalData.EnableDemolishByDClick = enable;
    },

    /**
     *  旋转照相机
     *
     * @param {THREE.Vector2} rotationDelta - rotation value, pixel value in the screen coordinate
     */
    rotateCamera: function(rotationDelta) {
        this.cameraControl.processRotate(rotationDelta);
		this.cameraControl.update();
    },

    /**
     * 取得照相机信息，包括照相机的朝向和up轴方向
     */
    getActiveCameraInfo: function() {
        var info = {};
        info.up = new THREE.Vector3();
        info.dir = new THREE.Vector3();

        var mainCamera = this.camera;

        // 获得相机方向向量
        var dir = mainCamera.getWorldDirection();

        info.up.copy(mainCamera.realUp || mainCamera.up);
        info.dir.copy(dir);
		
		return info;
    },

    /**
     * 计算切面
     *
     */
    calculationPlanes: function () {

        if (this.isRecalculationPlanes) {
            this.isRecalculationPlanes = false;
            var scene = this.getScene();
            var box = this.scene.getBoundingBoxOfGeometries();
            scene.getClipPlanes().calculationPlanes(box.getSize(), box.getCenter());
            this.render();
        }
    },

    /**
     * 重置切面状态
     *
     */
    recalculationPlanes: function () {
        this.isRecalculationPlanes = true;
    },

    /**
     * 设置octree 深度
     *
     * @param {Number} depth - 深度
     */
    setOctantDepth: function (depth) {
        CLOUD.GlobalData.OctantDepth = depth;
    },

    /**
     * 重置对象池大小
     *
     * @param {Number} size - 对象池对象数
     */
    resizePool: function (size) {
        CLOUD.GlobalData.maxObjectNumInPool = size;
        this.modelManager.updateSceneRenderable();
        this.render();
    },

    /**
     * 设置高优先级
     *
     * @param {Array} categories - 高优先级category
     * @param {Number} region - 内外部（0：内部，1：外部）
     */
    setCategoriesToHighPriority: function (categories, region) {
        var side = (region == 0) ? "inner" : "outer";
        this.modelManager.setCategoriesToHighPriority(categories, side);
    },

    /**
     * 清除内部或者外部 category 高优先级
     *
     * @param {Number} region - 内外部（0：内部，1：外部）
     */
    clearCategoriesFromHighPriority: function (region) {
        var side = (region == 0) ? "inner" : "outer";
        this.modelManager.clearCategoriesFromHighPriority(side);
    },

    /**
     * 清除内外部 category 高优先级
     *
     */
    clearAllCategoriesFromHighPriority: function () {
        this.modelManager.clearAllCategoriesFromHighPriority();
    },

    /**
     * 按条件隔离构件
     *
     * @param {Array} conditions    - 多个条件对象数组，单个数组取交集，多个数组取并集
     *                                  [{"categoryId":-2001340},{"specialty":"AR"},{"categoryId":-2321500,"levelName":"F03"}]
     * @param {String} state        - 隔离的方式 "hide"：其他隐藏，"translucent"：其他半透明
     */
    isolate: function (conditions, state) {

        var filter = this.getFilter();

        switch (state) {
            case "hide":
                filter.setIsolateConditions(conditions, CLOUD.EnumIsolateState.HIDDEN_OTHERS);
                break;
            case "translucent":
                filter.setIsolateConditions(conditions, CLOUD.EnumIsolateState.TRANSLUCENT_OTHERS);
                break;
            default:
                console.log("no this isolate state : " + state);
                break;
        }


    },

    /**
     * 设置隔离构件材质
     *
     * @param {Object} params - 材质参数
     *         params = {color: 0x888888, opacity: 0.1, transparent: true, side: THREE.DoubleSide}
     */
    setIsolateMaterial: function (params) {

        var filter = this.getFilter();
        filter.setIsolateMaterial(params);

    },

    /**
     * 重置隔离材质
     *
     */
    resetIsolateMaterial: function () {

        var filter = this.getFilter();
        filter.resetIsolateMaterial();

    },

    /**
     * 设置左右键，只对Orbit/Pick editor模式起作用
     *
     * @param {String} button - 左右键标识 ("left"," right")
     */
    setOrbitButton: function (button) {
		var orbitEditor = this.editorManager._getEditorByName(this, CLOUD.EditorMode.ORBIT);
		var pickEditor = this.editorManager._getEditorByName(this, CLOUD.EditorMode.PICK);
		var config = {};
		if (button === "left") {

			config = {
				ORBIT: THREE.MOUSE.LEFT,
				PAN2: THREE.MOUSE.MIDDLE,
				PAN: THREE.MOUSE.RIGHT
			};

		} else if (button === "right") {

			config = {
				ORBIT: THREE.MOUSE.RIGHT,
				PAN2: THREE.MOUSE.MIDDLE,
				PAN: THREE.MOUSE.LEFT
			};

		}
		
		if (orbitEditor) orbitEditor.updateButtons(config);
		if (pickEditor) pickEditor.updateButtons(config);
    },

    /**
     * 显示轴网信息
     *
     * @param {Object} intersect - 相交信息对象, 来源pick, 参考ON_CLICK_PICK事件的返回对象
     */
    showPickedInformation: function (intersect) {

        CLOUD.UIHelper.showPickedInformation(intersect);

    },

    //callback函数中只包含一个intersect参数，intersect是一个对象包含以下变量
    //databagId, distance, face, faceIndex, object:MeshEx, point userId, worldBoundingBox, worldPosition
    setSelectPadCallback: function (callback) {

        //var selectPad = this.editorManager.editors[CLOUD.BaseEditor.EditorType.PickWithRect].selectPad;

        var editor = this.editorManager.getCurrentEditor();

        if (editor && editor.selectPad) {
            editor.selectPad.callback = callback;
        }

    },
    /**
     * 设置客户端设备是否是移动端，
     *
     * @param isMobile, true 表示客户端运行在移动设备上。false 表示非移动端（一般指PC）
     */
    setDeviceMobile: function (isMobile) {
        CLOUD.GlobalData.IsMobile = isMobile || false;
    },

    /**
     * 设置绕点旋转模式
     *
     * @param {Number} mode - 模式 参见CLOUD.RotatePivotMode
     */
    setPointRotateMode: function (mode) {

        CLOUD.EditorConfig.RotatePivotMode = mode;

    },

    /**
     * 世界坐标转绘图空间(场景变换后)坐标
     *
     * @param {object} point - 世界坐标下的点集 {x:0, y:0, z:0}
     * @return {object} 绘图区域坐标 {x:0, y:0, z:0}
     */
    worldToDrawing: function (point) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return null;
        }

        var scene = this.getScene();
        var retPoint = scene.worldToDrawing(point);

        return {x: retPoint.x, y: retPoint.y, z: retPoint.z};
    },

    /**
     * 绘图空间(场景变换后)坐标转世界坐标
     *
     * @param {object} point - 绘图区域坐标下的点集 {x:0, y:0, z:0}。
     * @return {object} 世界坐标 {x:0, y:0, z:0}
     */
    drawingToWorld: function (point) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return null;
        }

        // 转世界坐标
        var scene = this.getScene();
        var retPoint = scene.drawingToWorld(point);

        return {x: retPoint.x, y: retPoint.y, z: retPoint.z};
    },

    /**
     * 世界坐标转客户坐标(相对于canvas区域)
     *
     * @param {object} wPoint - 世界坐标下的点集 {x:0, y:0, z:0}
     * @return {object} 客户区域坐标 {x:0, y:0, z:0}, 没有转换则返回null
     */
    worldToCanvas: function (wPoint) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return null;
        }

        var clientRect = cameraControl.getContainerDimensions();

        if (!clientRect) {
            return null;
        }

        var camera = cameraControl.getCamera();
        var scene = this.getScene();

        // 转绘图空间坐标(场景变换)
        var point = scene.worldToDrawing(wPoint);

        // 转相对于canvas的坐标
        var result = CLOUD.CameraUtil.drawingToCanvas(camera, point, clientRect.width, clientRect.height);

        return result;

    },

    /**
     * 客户区域坐标(相对于canvas区域)转世界坐标
     *
     * @param {object} cPoint - 客户区域坐标下的点集 {x:0, y:0, z:0}, 其中z为进行反投影是的深度，默认为 0。
     * @return {object} 世界坐标 {x:0, y:0, z:0}, 没有转换则返回null
     */
    canvasToWorld: function (cPoint) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return null;
        }

        var clientRect = cameraControl.getContainerDimensions();

        if (!clientRect) {
            return null;
        }

        var camera = cameraControl.getCamera();
        var scene = this.getScene();

        // 转绘图空间坐标
        var point = CLOUD.CameraUtil.canvasToDrawing(camera, cPoint, clientRect.width, clientRect.height);

        // 转世界坐标
        var result = scene.drawingToWorld(point);

        return {x: result.x, y: result.y, z: result.z};
    },

    /**
     * 世界坐标(原始坐标)转客户区域坐标(相对于窗口客户区域)
     *
     * @param {object} wPoint - 世界坐标下的点集 {x:0, y:0, z:0}
     * @return {object} 客户区域坐标 {x:0, y:0, z:0}, 没有转换则返回null
     */
    worldToClient: function (wPoint) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return null;
        }

        var clientRect = cameraControl.getContainerDimensions();

        if (!clientRect) {
            return null;
        }

        var camera = cameraControl.getCamera();
        var scene = this.getScene();

        // 转绘图空间坐标(场景变换)
        var point = scene.worldToDrawing(wPoint);

        // 转相对于canvas的坐标
        var result = CLOUD.CameraUtil.drawingToCanvas(camera, point, clientRect.width, clientRect.height);

        if (result) {

            // 转客户区域坐标
            result.x += clientRect.left;
            result.y += clientRect.top;

            return result;
        }

        return null;
    },

    /**
     * 客户区域坐标(相对于窗口客户区域)转世界坐标(原始坐标)
     *
     * @param {object} cPoint - 客户区域坐标下的点集 {x:0, y:0, z:0}, 其中z为进行反投影是的深度，默认为 0。
     * @return {object} 世界坐标 {x:0, y:0, z:0}, 没有转换则返回null
     */
    clientToWorld: function (cPoint) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return null;
        }

        var clientRect = cameraControl.getContainerDimensions();

        if (!clientRect) {
            return null;
        }

        var point = {x: cPoint.x, y: cPoint.y, z: cPoint.z};

        // 转相对于canvas的坐标
        point.x -= clientRect.left;
        point.y -= clientRect.top;

        var camera = cameraControl.getCamera();
        var scene = this.getScene();

        // 转绘图空间坐标
        var point = CLOUD.CameraUtil.canvasToDrawing(camera, point, clientRect.width, clientRect.height);

        // 转世界坐标
        var result = scene.drawingToWorld(point);

        return {x: result.x, y: result.y, z: result.z};
    },

    /**
     * 世界坐标(原始坐标)点含在相机视锥中
     *
     * @param {object} wPoint - 世界坐标 {x:0, y:0, z:0}
     * @return {Boolean} 在相机视锥中，返回true，否则，返回false
     */
    insideCamera: function (wPoint) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return false;
        }

        var scene = this.getScene();

        // 转换到绘制空间的坐标
        var point = scene.worldToDrawing(wPoint);
        var frustum = cameraControl.getFrustum();

        return frustum.containsPoint(point);
    },

    /**
     * 根据给定世界系中的点以平行视线方向定位
     *
     * @param {Object} wPoint - 世界系坐标点 {x: 0, y:0, z:0}
     */
    locateToPointWithParallelEye: function (wPoint) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return false;
        }

        var scene = this.getScene();
        var point = scene.worldToDrawing(wPoint);

        cameraControl.flyToPointWithParallelEye(point);

    },

    /**
     * 根据给定世界系中的点保持视角进行定位
     *
     * @param {Object} wPoint - 世界系坐标点 {x: 0, y:0, z:0}
     */
    locateToPoint: function (wPoint) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return false;
        }

        var scene = this.getScene();
        var point = scene.worldToDrawing(wPoint);

        cameraControl.flyToPoint(point);
    },

    /**
     * 是否启用鼠标hover
     *
     * @param {Boolean} enable - 启用或禁止
     */
    enableHover: function (enable) {
        CLOUD.GlobalData.Hover = enable;
    },

    getIBLManager: function() {
        return this.IBLManager;
    },

    loadEnvMap: function (url) {

        var mapUrl = ["posx.hdr", "negx.hdr", "posy.hdr", "negy.hdr", "posz.hdr", "negz.hdr"];
        var envMapUrl = [];
        for (var i = 0; i < 6; ++i) {
            envMapUrl.push('/' + url + "/" + mapUrl[i]);
        }

        var scope = this;
        var cubeTextureLoader = new THREE.HDRCubeTextureLoader();
        cubeTextureLoader.load(THREE.FloatType, envMapUrl, function (hdrCubeMap) {
            scope.environmentCubeMap = hdrCubeMap;
            scope.modelManager.updateMaterialsValue('envMap', hdrCubeMap);
            scope.render();
        });

    },

    setEnvMapIntensity: function (value) {
        this.modelManager.updateMaterialsValue("envMapIntensity", value);
        this.render();
    },

    closeEnvMap: function() {

        this.modelManager.updateMaterialsValue('envMap', null);
        this.render();

    },


    

    /**
     * 添加带纹理的平面(世界系坐标，Z轴朝上)
     *
     * @param {THREE.Vector3} min - 最小点
     * @param {THREE.Vector3} max - 最大点
     * @param {String} url - 贴图路径
     * @return {THREE.Mesh} 请自行保存生成的平面, visible属性控制平面是否显示
     */
    addPlane: function (min, max, url) {
        var center = new THREE.Vector3();
        center.addVectors(new THREE.Vector3(min.x, min.y, min.z), new THREE.Vector3(max.x, max.y, max.z));
        center.multiplyScalar(0.5);

        var plane = new THREE.PlaneBufferGeometry(max.x - min.x, max.y - min.y);

        var mesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: true
        }));
        //mesh.rotation.x = -Math.PI * 0.5;
        mesh.position.copy(center);
        mesh.renderOrder = 10; // give a higher priority

        var scene = this.getScene();
        var group = scene.getOrCreateObjectGroup(CLOUD.ObjectGroupType.CUSTOMPLANE, {globalSpace: true});
        group.add(mesh);
        mesh.updateMatrixWorld(true);

        var loader = new THREE.TextureLoader();
        loader.load(url, function onSuccess(texture) {
            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
        });

        return mesh;
    },

    /**
     * 移除带纹理的平面
     *
     * @param {THREE.Mesh} plane - 传入使用addPlane函数返回的对象，用于在场景中删除平面
     */
    removePlane: function (plane) {

        var scene = this.getScene();
        var group = scene.getObjectGroup(CLOUD.ObjectGroupType.CUSTOMPLANE);
        if (group) {
            group.remove(plane);
        }
    },

    /**
     * 是否启用纹理贴图
     *
     * @param {Boolean} enable - true 启用，false：禁用
     */
    enableTextureMapping: function (enable) {

        CLOUD.GlobalData.EnableTextureMapping = enable;

        // var needsUpdate = this.modelManager.updateTextureMapping(enable);
        //
        // if (needsUpdate) {
        //     this.render();
        // }
    },

    /**
     * 设置鼠标滚轮方向
     * 默认滚轮方向 - 前滚：相机前进， 后滚：相机回退
     * 反转滚轮方向 - 前滚：相机回退， 后滚：相机前进
     *
     * @param {Boolean} state - 是否反转
     */
    setReverseWheelDirection: function (state) {

        CLOUD.EditorConfig.ReverseWheelDirection = !!state;

    },

    /**
     * 获得鼠标滚轮反转状态
     *
     * @return {Boolean} 反转状态
     */
    getReverseWheelDirection: function () {

        return CLOUD.EditorConfig.ReverseWheelDirection;

    },

    /**
     * 设置移动速度倍率
     *
     * @param {Number} rate - 倍数, 0.25 - x0.25, 是原来的1/4速度, 4.0 - x4.0, 是原来速度的4倍.
     */
    setMovementSpeedRate: function (rate) {

        if (rate === undefined) {
            return;
        }

        CLOUD.EditorConfig.MovementSpeedRate = rate;
    },

    /**
     * 获得移动速度倍率
     *
     * @return {Number} 倍数
     */
    getMovementSpeedRate: function () {

        return CLOUD.EditorConfig.MovementSpeedRate;

    },

    /**
     * 相机移动
     *
     * @param {Number} direction 移动方向 {@link CLOUD.MoveDirection}
     */
    moveTo: function (direction) {

        var editor = this.editorManager.editor;

        // if (editor && editor.slaveEditor) {
        //     editor.slaveEditor.moveTo(direction);
        // }

        if (editor) {
            editor.moveTo(direction);
        }

    },

    /**
     * 是否启用半透明遮挡视线的构件
     *
     * @param {Boolean} enable - true 启用，false：禁用
     */
    enableOcclusionTranslucent: function (enable) {
        CLOUD.GlobalData.OcclusionTranslucentEnabled = !!enable;
    },

    /**
     * 设置遮挡视线的构件的不透明度
     *
     * @param {Number} opacity - 不透明度
     */
    setOcclusionOpacity: function (opacity) {
        CLOUD.GlobalData.OcclusionOpacity = opacity;
    },

    /**
     * 设置遮挡视线的构件的距离阈值，超过该阈值，则半透明遮挡物
     *
     * @param {Number} distance - 距离阈值
     */
    setOcclusionDistanceToCamera: function (distance) {
        CLOUD.GlobalData.OcclusionDistanceToCamera = distance;
    },

    /**
     * 根据选中的构件进行fit及绕其旋转
     *
     */
    fitAndRotateBySelection: function () {

        if (this.cameraControl) {
            this.cameraControl.fitAndRotateBySelection();
        }

    },

    /**
     * 设置漫游行走时相机的高度
     *
     * @param {Array} elevations - 参考标高数组（从小到大的排序）
     * @param {Number} height - 相机相对高度(世界系中的高度 > 0，默认 1750mm)
     * @param {Boolean} forceRender - 强制刷新, 默认强制刷新
     */
    setRoamingWalkHeight: function (elevations, height, forceRender) {

        if (!(elevations instanceof Array)) {

            console.log("elevations is not arry");
            return;

        }

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return false;
        }

        if (height <= 0) {
            height = 1750;
        }

        if (forceRender === undefined) {
            forceRender = true;
        }

        cameraControl.setCameraHeight(elevations, height);

        if (forceRender) {

            var editor = this.editorManager.getCurrentEditor();

            if (editor && (editor.name === CLOUD.EditorMode.WALK) && editor.update) {
                cameraControl.flyOnWorld();
            }
        }

    },

    /**
     * 设置漫游行走时相机的绝对高度
     *
     * @param {Number} height - 相机绝对高度(世界系中的高度)
     * @param {Boolean} forceRender - 强制刷新, 默认强制刷新
     */
    setRoamingWalkAbsoluteHeight: function (height, forceRender) {

        var cameraControl = this.cameraControl;

        if (!cameraControl) {
            console.log("camera is not initialized!!!");
            return false;
        }

        if (forceRender === undefined) {
            forceRender = true;
        }

        cameraControl.setCameraAbsoluteHeight(height);

        if (forceRender) {

            var editor = this.editorManager.getCurrentEditor();

            if (editor && (editor.name === CLOUD.EditorMode.WALK) && editor.update) {
                cameraControl.flyOnWorld();
            }
        }

    },

    /**
     * 将相机从绘图坐标系转换到世界坐标系
     *
     * @returns {Object} - 世界系中相机位置 {position:xxx, target:xxx, up:xxx}
     */
    cameraToWorld: function (cameraInfo) {

        if (this.camera) {

            return CLOUD.Camera.drawingToWorld(cameraInfo, this.getScene().getMatrixGlobal());

        }

        return null;

    },

    /**
     * 将相机从世界坐标系转换到绘图坐标系
     *
     * @returns {Object} - 绘图坐标系中相机位置 {position:xxx, target:xxx, up:xxx}
     */
    cameraToDrawing: function (cameraInfo) {

        if (this.camera) {

            return CLOUD.Camera.worldToDrawing(cameraInfo, this.getScene().getMatrixGlobal());

        }

        return null;

    },

    /*=====================  API for selection Begin =======================*/

    /**
     * Clear all selected object to unselected state.
     *
     * If the selection object list of the scene is changed, ON_SELECTION_CHANGED event is triggered.
     */
    clearSelection: function() {
        this.modelManager.sceneState.clearSelection();
    },

    /**
     * Add objects to selection list of the scene. These object will be selected.
     * If the selection object list of the scene is changed, ON_SELECTION_CHANGED event is triggered.
     *
     * @param {Array} objIdList - Object Ids.
     *
     */
    addToSelection: function(objIdList) {
        this.modelManager.sceneState.addSelection(objIdList);
    },

    /**
     * Remove objects from selection list of the scene. These object will be unselected.
     * If the selection object list of the scene is changed, ON_SELECTION_CHANGED event is triggered.
     *
     * @param {Array} objIdList - Object Ids.
     *
     */
    removeFromSelection: function(objIdList) {
        this.modelManager.sceneState.removeSelection(objIdList);
    },

    /**
     * Replace selection list of the scene with the object Id list. These object will be selected.
     * If the selection object list of the scene is changed, ON_SELECTION_CHANGED event is triggered.
     *
     * @param {Array} objIdList - Object Ids.
     *
     */
    setSelection: function(objIdList) {
        this.modelManager.sceneState.setSelection(objIdList);
    },

    /**
     * Add objects to selection list of the scene. These object will be selected.
     * If the selection object list of the scene is changed, ON_SELECTION_CHANGED event is triggered.
     *
     * @returns {Array} Selected object Ids.
     */
    getSelection: function() {
        return this.modelManager.sceneState.getSelection();
    },

    /**
     * Set override material color for selected object.
     *
     * @param color {Integer} - color value, for example: 0xffffff
     */
    setSelectionColor: function(color) {
        this.modelManager.sceneState.setSelectionColor(color);
    },

    /*=====================  API for selection End =======================*/

    /**
     * 根据客户坐标点，模拟点击操作得到选中构件，返回选中信息,包括：
     *  meshId ：选中构件的Id
     *  worldPosition : 选中构件被选中的点的世界坐标
     *  worldBoundingBox : 选中构件的包围盒
     *  faceIndex : 选中构件被选中的面
     *
     *
     * @param {Object} point - 客户坐标点({x:0, y: 0})
     * @returns {Object} - 选中构件信息,如果没有构件选中，返回null
     */
    pickByPoint: function (point) {

        var cameraControl = this.cameraControl;

        if (cameraControl.enabled === false)
            return false;

        var clientPos = new THREE.Vector2(point.x, point.y);
        var pickContext = cameraControl.getIntersectContext(clientPos);

        var intersect = cameraControl.intersector.pick(pickContext);

        var scene = this.getScene();

        if (intersect) {
            // 将位置和包围转换到世界系
            scene.intersectToWorld(intersect);

            var pickInfo = {};
            pickInfo["faceIndex"] = intersect.faceIndex;
            pickInfo["meshId"] = intersect.userId;
            pickInfo["worldPosition"] = intersect.worldPosition;
            pickInfo["worldBoundingBox"] = intersect.worldBoundingBox;

            return pickInfo;
        }

        return null;
    },

    /**
     * 沿选中构件点所在的三角面对应的法线方向求两个pick点
     *
     * @param {Object} point - 客户坐标点({x:0, y: 0})
     * @returns {Array} 构件对象数组或者null
     */
    pickByPointWithNormal: function (point) {

        var scene = this.getScene();
        var cameraControl = this.cameraControl;

        if (cameraControl.enabled === false) {
            return null;
        }

        var clientPos = new THREE.Vector2(point.x, point.y);
        var pickContext = cameraControl.getIntersectContext(clientPos);
        var intersect = cameraControl.intersector.pick(pickContext);

        if (!intersect) {
            return null;
        }

        // 将位置和包围转换到世界系
        scene.intersectToWorld(intersect);

        intersect.cx = clientPos.x;
        intersect.cy = clientPos.y;

        var intersects = [];
        intersects.push(intersect);

        // 计算第二个构件
        var sceneMatrix = scene.getMatrixGlobal();
        var direction = intersect.face.normal.clone();
        var origin = intersect.worldPosition.clone();
        var ray = new THREE.Ray(origin, direction);

        ray.applyMatrix4(sceneMatrix);

        var intersectEnd = cameraControl.intersector.getIntersectByRay(pickContext, ray);

        if (intersectEnd) {
            // 将位置和包围转换到世界系
            scene.intersectToWorld(intersectEnd);
            intersects.push(intersectEnd);
        }

        return intersects;
    },

    /**
     * 切换到正交投影相机
     *
     * @param {Boolean} refresh - 是否需要刷新场景, 默认刷新
     */
    toDefaultOrthographicCamera: function (refresh) {

        this.switchToCamera("orth");

        if (refresh || refresh === undefined) {
            this.render();
        }

    },

    /**
     * 切换到透视投影相机
     *
     * @param {Boolean} refresh - 是否需要刷新场景, 默认刷新
     */
    toDefaultPerspectiveCamera: function (refresh) {

        this.switchToCamera("persp");

        if (refresh || refresh === undefined) {
            this.render();
        }

    },

    /**
     * get camera (default and customized) name list
     *
     */
    getCameraNameList : function() {
        var defaultList = ["pesp", "orth"];

        return defaultList.concat(this.modelManager.getCameraNameList());
    },

    switchToCamera : function(cameraName) {
        var found = true;

        if (cameraName === "persp") {
            this.camera = this.defaultCamera;
            this.camera.toPerspective();
        }
        else if (cameraName === "orth") {
            this.camera = this.defaultCamera;
            this.camera.toOrthographic();
        }
        else {
            var camera = this.modelManager.getCamera(cameraName);
            if (camera) {
                this.camera = camera;
            }
            else {
                console.log("Fail to switch because not found camera '" + cameraName + "'");
                found = false;
            }
        }

        if (found) {
            this.cameraControl.setCamera(this.camera)
        }
        
        return found;
    },

    /**
     * Return the number of elements of all loaded models
     */
    getNumOfElements: function() {
        return this.modelManager.getNumOfElements();
    },
    /**
     * Return the number of renderables of all loaded models
     */
    getNumOfRenderables: function() {
        return this.modelManager.getNumOfRenderables();
    },
    /**
     * Return the number of triangles of all loaded models
     */
    getNumOfTriangles: function() {
        return this.modelManager.getNumOfTriangles();
    },

    /**
     * 锁定行走高度
     *
     * @param {Boolean} lock - 是否锁定
     */
    setWalkHeightLocked : function (lock) {

        var editor = this.editorManager.getCurrentEditor();

        if (editor && (editor.name === CLOUD.EditorMode.WALK)) {
            editor.setHeightLocked(lock);
        }

    },



    setLightPreset: function (value) {

        CLOUD.GlobalData.LightPreset = value;
        this.getScene().lightPreset();

    },

    getLightPreset: function () {
        return CLOUD.GlobalData.LightPreset;
    },

    setAmbientLightIntensity: function (value) {
        var ambientLight = this.getScene().ambientLight;
        if (ambientLight) {
            ambientLight.intensity = value;
        }
    },

    getAmbientLightIntensity: function () {
        var ambientLight = this.getScene().ambientLight;
        if (ambientLight) {
            return ambientLight.intensity;
        }
        else {
            return undefined;
        }
    },

    /**
     * 鼠标按下行走观察
     *
     * @param {Boolean} press - 是否按下
     */
    setWalkLookMousePressed: function (press) {

        var editor = this.editorManager.getCurrentEditor();

        if (editor && (editor.name === CLOUD.EditorMode.WALK)) {
            editor.setDragLook(press);
        }

    },

    /**
     * 设置行走倍率
     *
     * @param {Number} rate - 倍率
     */
    setWalkSpeedRate : function (rate) {

        var editor = this.editorManager.getCurrentEditor();

        if (editor && (editor.name === CLOUD.EditorMode.WALK)) {
            // editor.setSpeedRate(rate);
            CLOUD.EditorConfig.MovementSpeedRate = rate;
        }
    },

    /**
     * 设置绘制风格
     *
     * @param {Enum} style - CLOUD.DrawingStyle.SHADING：模型绘制风格   
                             CLOUD.DrawingStyle.BOARDLINE：线框绘制风格   
                             CLOUD.DrawingStyle.SHADINGWITHLINE： 带线框的模型绘制风格
     */
    setDrawingStyle: function(style) {
        CLOUD.GlobalData.DrawingStyle = style;
    },

    /**
     * 设置线框颜色
     *
     * @param {Object} color - 默认为 0x000000;
     */
    setWireframeColor: function(color) {

        var modelManager = this.modelManager;
        for (var name in modelManager.models) {
            modelManager.models[name].wireframeMaterial.color = new THREE.Color(color);
        }

    },

    /**
     * 设置是否启用转场动画
     *
     * @param {Boolean} enable - 是否启动
     */
    setTransitionAnimationState: function (enable) {
        this.transitionAnimationState = enable;
    },

    /**
     * 返回是否启用转场动画的状态
     *
     */
    getTransitionAnimationState: function(){
        return this.transitionAnimationState;
    },
    /**
     * 将老版本批注信息转换成V3版
     *
     * @param {String} jsonStr - 批注信息字符串表示
     */
    convertAnnotationsToV3: function (jsonStr) {

        var jsonObj = JSON.parse(jsonStr);

        function convertCamera(camera, matrixTransform, matrixScene) {

            var newCamera;

            if ("string" === typeof camera) {
                newCamera = JSON.parse(window.atob(camera));
            } else {
                newCamera = {
                    position: {x: camera.position.x, y: camera.position.y, z: camera.position.z},
                    target: {x: camera.target.x, y: camera.target.y, z: camera.target.z},
                    up: {x: camera.up.x, y: camera.up.y, z: camera.up.z}
                };
            }

            var position = new THREE.Vector3(newCamera.position.x, newCamera.position.y, newCamera.position.z);
            var target = new THREE.Vector3(newCamera.target.x, newCamera.target.y, newCamera.target.z);
            var up = new THREE.Vector3(newCamera.up.x, newCamera.up.y, newCamera.up.z);

            // CameraInfo结构变化，需要name参数
            var cameraInfo = new CLOUD.CameraInfo("persp",position, target, up);
            cameraInfo = CLOUD.Camera.drawingToWorld(cameraInfo, matrixTransform);
            cameraInfo = new CLOUD.CameraInfo("persp",cameraInfo.position, cameraInfo.target, cameraInfo.up);
            cameraInfo = CLOUD.Camera.worldToDrawing(cameraInfo, matrixScene);

            newCamera.position.x = cameraInfo.position.x;
            newCamera.position.y = cameraInfo.position.y;
            newCamera.position.z = cameraInfo.position.z;

            newCamera.target.x = cameraInfo.target.x;
            newCamera.target.y = cameraInfo.target.y;
            newCamera.target.z = cameraInfo.target.z;

            newCamera.up.x = cameraInfo.up.x;
            newCamera.up.y = cameraInfo.up.y;
            newCamera.up.z = cameraInfo.up.z;

            if ("string" === typeof camera) {
                newCamera = window.btoa(JSON.stringify(newCamera));
            }

            return newCamera;

        }

        // 只能根据过滤器中的标志来判断版本信息
        if (jsonObj.filter) {

            var jsonFilter = JSON.parse(jsonObj.filter);

            if (jsonFilter.filter || jsonFilter.basicIds) {

                var scene = this.getScene();
                var matrixTransform = scene.getTransformMatrixGlobal();
                var matrixTransformInv = new THREE.Matrix4();
                matrixTransformInv.getInverse(matrixTransform);

                var matrixScene = scene.getMatrixGlobal();
                var matrixSceneInv = new THREE.Matrix4();
                matrixSceneInv.getInverse(matrixScene);

                // camera 不做变换，批注使用保存的camera信息，否则批注对象的转换相当复杂而且容易出错
                // json.camera = convertCamera(json.camera, matrixTransform, matrixScene);

                // 处理批注
                // if (json.obj) {
                //
                //     var annotationInfoList = json.obj;
                //
                //     for (var i = 0, len = annotationInfoList.length; i < len; i++) {
                //
                //         var info = annotationInfoList[i];
                //         var newPosition = new THREE.Vector3(info.position.x, info.position.y, info.position.z);
                //         newPosition.applyMatrix4(matrixTransformInv).applyMatrix4(matrixScene);
                //
                //         var lt = new THREE.Vector3(info.position.x - 0.5 * info.size.width, info.position.y - 0.5 * info.size.height, info.position.z);
                //         var rb = new THREE.Vector3(info.position.x + 0.5 * info.size.width, info.position.y + 0.5 * info.size.height, info.position.z);
                //         lt.applyMatrix4(matrixTransformInv).applyMatrix4(matrixScene);
                //         rb.applyMatrix4(matrixTransformInv).applyMatrix4(matrixScene);
                //
                //         info.position.x = newPosition.x;
                //         info.position.y = newPosition.y;
                //         info.position.z = newPosition.z;
                //
                //         info.size.width = Math.abs(rb.x - lt.x);
                //         info.size.height = Math.abs(rb.y - lt.y);
                //
                //         if (info.originSize) {
                //
                //             var ltOrigin = new THREE.Vector3(info.position.x - 0.5 * info.originSize.width, info.position.y - 0.5 * info.originSize.height, info.position.z);
                //             var rbOrigin = new THREE.Vector3(info.position.x + 0.5 * info.originSize.width, info.position.y + 0.5 * info.originSize.height, info.position.z);
                //
                //             ltOrigin.applyMatrix4(matrixTransformInv).applyMatrix4(matrixScene);
                //             rbOrigin.applyMatrix4(matrixTransformInv).applyMatrix4(matrixScene);
                //
                //             info.originSize.width = Math.abs(rbOrigin.x - ltOrigin.x);
                //             info.originSize.height = Math.abs(rbOrigin.y - ltOrigin.y);
                //         }
                //
                //     }
                //
                // }

                var enumFilterType = this.getFilter().getFilterType();
                var objFilter = {};
                objFilter.state = {};

                // v1 - > v3
                if (jsonFilter.filter) {

                    if (jsonFilter.fileFilter) {
                        objFilter.state[enumFilterType.FILE_HIDDEN] = jsonFilter.fileFilter;
                    }

                    if (jsonFilter.selectionSet) {
                        objFilter.state[enumFilterType.SELECTED] = jsonFilter.selectionSet;
                    }

                    if (jsonFilter.filter.visibleIds) {
                        objFilter.state[enumFilterType.VISIBLE] = jsonFilter.filter.visibleIds;
                    }

                    if (jsonFilter.filter.invisibleIds) {
                        objFilter.state[enumFilterType.HIDDEN] = jsonFilter.filter.invisibleIds;
                    }

                    if (jsonFilter.filter.conditions) {
                        objFilter.state[enumFilterType.CONDITION_HIDDEN_OTHERS] = jsonFilter.filter.conditions;
                    }

                    if (jsonFilter.filter.filters) {
                        objFilter.state[enumFilterType.USER_HIDDEN] = jsonFilter.filter.filters;
                    }

                    if (jsonFilter.frozenSet) {
                        objFilter.state[enumFilterType.FROZENFILTER] = jsonFilter.frozenSet;
                    }

                    if (jsonFilter.isolateSet) {
                        objFilter.state[enumFilterType.ISOLATE_HIDDEN_OTHERS] = jsonFilter.isolateSet;
                    }

                    if (jsonFilter.overriderByIds) {
                        objFilter.state[enumFilterType.OVERRIDEFILTER] = jsonFilter.overriderByIds;
                    }

                    if (jsonFilter.overriderByData) {
                        objFilter.state[enumFilterType.USER_OVERRIDE] = jsonFilter.overriderByData;
                    }

                    if (jsonFilter.overriderCondition) {
                        objFilter.state[enumFilterType.CONDITION_OVERRIDE] = jsonFilter.overriderCondition;
                    }

                    if (jsonFilter.isolateCondition) {
                        objFilter.state[enumFilterType.ISOLATE_CONDITION_HIDDEN_OTHERS] = jsonFilter.isolateCondition;
                    }

                    objFilter.state.sceneState = jsonFilter.overriderByScene;

                }
                else if (jsonFilter.basicIds) {// v2 - > v3

                    if (jsonFilter.basicIds[1]) {
                        objFilter.state[enumFilterType.FILE_HIDDEN] = jsonFilter.basicIds[1];
                    }

                    if (jsonFilter.basicIds[2]) {
                        objFilter.state[enumFilterType.SELECTED] = jsonFilter.basicIds[2];
                    }

                    if (jsonFilter.basicIds[3]) {
                        objFilter.state[enumFilterType.VISIBLE] = jsonFilter.basicIds[3];
                    }

                    if (jsonFilter.basicIds[4]) {
                        objFilter.state[enumFilterType.HIDDEN] = jsonFilter.basicIds[4];
                    }

                    if (jsonFilter.conditions[0]) {
                        objFilter.state[enumFilterType.CONDITION_HIDDEN_OTHERS] = jsonFilter.conditions[0];
                    }

                    if (jsonFilter.userHiddenIds) {
                        objFilter.state[enumFilterType.USER_HIDDEN] = jsonFilter.userHiddenIds;
                    }

                    if (jsonFilter.frozenIds) {
                        objFilter.state[enumFilterType.FROZENFILTER] = jsonFilter.frozenIds;
                    }

                    if (jsonFilter.isolateIds) {
                        objFilter.state[enumFilterType.ISOLATE_HIDDEN_OTHERS] = jsonFilter.isolateIds;
                    }

                    if (jsonFilter.overrideByIds) {
                        objFilter.state[enumFilterType.OVERRIDEFILTER] = jsonFilter.overrideByIds;
                    }

                    if (jsonFilter.overrideByData) {
                        objFilter.state[enumFilterType.USER_OVERRIDE] = jsonFilter.overrideByData;
                    }

                    if (jsonFilter.conditions[2]) {
                        objFilter.state[enumFilterType.CONDITION_OVERRIDE] = jsonFilter.conditions[2];
                    }

                    if (jsonFilter.isolateConditions) {

                        if (jsonFilter.isolateConditions[0]) {
                            objFilter.state[enumFilterType.ISOLATE_CONDITION_HIDDEN] = jsonFilter.isolateConditions[0];
                        }

                        if (jsonFilter.isolateConditions[1]) {
                            objFilter.state[enumFilterType.ISOLATE_CONDITION_HIDDEN_OTHERS] = jsonFilter.isolateConditions[1];
                        }

                        if (jsonFilter.isolateConditions[2]) {
                            objFilter.state[enumFilterType.ISOLATE_CONDITION_TRANSLUCENT] = jsonFilter.isolateConditions[2];
                        }

                        if (jsonFilter.isolateConditions[3]) {
                            objFilter.state[enumFilterType.ISOLATE_CONDITION_TRANSLUCENT_OTHERS] = jsonFilter.isolateConditions[3];
                        }
                    }

                    objFilter.state.sceneState = jsonFilter.sceneState;
                }

                if (jsonFilter.camera) {
                    objFilter.camera = convertCamera(jsonFilter.camera, matrixTransform, matrixScene);
                } else {
                    objFilter.camera = convertCamera(jsonObj.camera, matrixTransform, matrixScene);
                }

                jsonFilter = objFilter;

                jsonObj.filter = JSON.stringify(jsonFilter);

            }

        }

        return jsonObj;
    }
};