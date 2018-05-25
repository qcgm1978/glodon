/**
 * @require /BIMperformance/libsH5/js/bimView.js
 */
// 'use strict'
// ;(function($){
//   bimView.API = {
//     baseUrl:"/",
//     //模型
//     fetchModel: "model/",//获取模型信息
//     fetchFamilyType:'model/{etag}/metadata/familyInfo.json',
//     fetchFloorsMap: 'view/{etag}/{sourceId}/miniature/map', //获取模型楼层信息
//     fetchAxisGrid: 'model/{etag}/metadata/gridAndLevel.json', //获取楼层地图,轴网信息
//     // 构件树
//     fetchFloors: "view/{etag}/{sourceId}/floor", // 获取楼层
//     fetchSpecialty: "view/{etag}/{sourceId}/specialty", // 获取楼层,专业信息
//     fetchCategory: "view/{etag}/{sourceId}/categories", // 获取构件信息
//     fetchCoding: 'view/category/coding/{etag}', //获取构件编码信息
//     // 获取构件信息
//     fetchComponentById:'sixD/{projectId}/{projectVersionId}/element',
//     //快照
//     fetchModelViewpoint: 'sixD/{projectId}/viewPoint', // 获取快照列表
//     fetacCanvasData: 'sixD/{projectId}/viewPoint/{viewPointId}/comment', // 获取批注信息
//     createViewpointById: 'sixD/{projectId}/viewPoint', // 创建快照
//     addViewpointImg: 'sixD/{projectId}/viewPoint/{viewPointId}/pic', // 添加快照图片
//     addViewpointData: 'sixD/{projectId}/viewPoint/{viewPointId}/comment', // 添加几何数据
//     editViewpointById: 'sixD/{projectId}/viewPoint/{viewPointId}', // 修改快照
//     deleteViewpointById: 'sixD/{projectId}/viewPoint/{viewPointId}', // 删除快照
//   }
// })($);
'use strict'
;(function ($) {
    bimView.API = {
        baseUrl: "/",
        //模型
        fetchModel: "model/",//获取模型信息
        fetchFamilyType: 'model/{etag}/metadata/familyInfo.json',
        //fetchFloorsMap: 'view/{etag}/{sourceId}/miniature/map', //获取模型楼层信息 **旧接口**
        fetchFloorsMap: 'doc/{projectid}/{projectVersionId}/miniature/map', //获取模型楼层信息 **新增变更接口 2017-7-10**
        fetchAxisGrid: 'model/{etag}/metadata/gridAndLevel.json', //获取楼层地图,轴网信息
        // 构件树
        //fetchFloors: "view/{etag}/{sourceId}/floor", // 获取楼层 **旧接口**
        fetchFloors: "doc/{projectid}/{projectVersionId}/floor", // 获取楼层   **新增变更接口 2017-7-10**
        //fetchSpecialty: "view/{etag}/{sourceId}/specialty", // 获取楼层,专业信息 **旧接口**
        fetchSpecialty: "doc/{projectid}/{projectVersionId}/specialty", // 获取楼层,专业信息  **新增变更接口 2017-7-10**
        //fetchCategory: "doc/filter/tree/{etag}/{sourceId}/categories", // 获取构件分类信息   **旧接口**
        fetchCategory: "doc/filter/tree/{etag}/{projectId}/{projectVersionId}/categories/flow", // 获取构件分类信息     **新增变更接口 2017-7-10**
        // fetchCoding: 'view/category/coding/{etag}', //获取构件编码信息
        //fetchCoding: 'doc/filter/tree/classCode/{etag}/{sourceId}', //获取构件分类编码编码信息 **旧接口**
        fetchCoding: 'doc/filter/tree/classCode/{etag}/{projectId}/{projectVersionId}', //获取构件分类编码编码信息   **新增变更接口 2017-7-10**
        // 获取构件信息
        fetchComponentById: 'sixD/{projectId}/{projectVersionId}/element',
        //快照
        fetchModelViewpoint: 'sixD/{projectId}/viewPoint', // 获取快照列表
        fetacCanvasData: 'sixD/{projectId}/viewPoint/{viewPointId}/comment', // 获取批注信息
        createViewpointById: 'sixD/{projectId}/viewPoint', // 创建快照
        addViewpointImg: 'sixD/{projectId}/viewPoint/{viewPointId}/pic', // 添加快照图片
        addViewpointData: 'sixD/{projectId}/viewPoint/{viewPointId}/comment', // 添加几何数据
        editViewpointById: 'sixD/{projectId}/viewPoint/{viewPointId}', // 修改快照
        deleteViewpointById: 'sixD/{projectId}/viewPoint/{viewPointId}', // 删除快照
    }
})($);
