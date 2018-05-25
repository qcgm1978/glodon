// 注意  删除操作 参数需要在url 中 jq 不会 处理 所以 url 命名的时候 以 delete 开头，我会处理
App.API = {
    vendor: function () {
        return "";
    },
    Settings: {
        hostname: "/",
        debug: false
    },
    URL: {
        fetchNewCookies: 'platform/delayCookieTime',
        'statistics-test': 'dataJson/upload/not-upload.json',
        statistics: 'doc/common/stat',
        modelFilterRule: 'sixD/checkPointRule/{projectId}/{projectVersionId}/checkPointRule',
        downloadPlanVer: "sixD/{projectId}/{projectVersionId}/plan/export/zip",//校验下载
        //首页bodyContent数据
        fetchBodyContentTodos: 'platform/todo',
        fetchBodyContentSilde: 'platform/project/top',
        fetchIMBoxList: 'platform/message',
        fetchReadMessage: 'platform/message/read',//?id={id}
        //本月开始、到期接口
        fetchBodyContentMonthEnd: 'platform/plan/concern/index',//?type={type}&userId={userId}
        fetchBodyContentMonthStart: 'platform/plan/concern/index',
        fetchBodyContentSlide: 'dataJson/bodyContent/bodyContent.slide.json',
        fetchBodyContentMmhSlide: 'platform/project',
        fetchBodyContentProclamation: 'platform/notice',
        fetchBodyContentNotice: 'platform/notice/find',
        //services
        fetchServicesRolesList: 'platform/auth/role',//角色列表
        fetchServicesSaveRole: 'platform/auth/role',//保存角色列表
        fetchServicesFunList: 'platform/auth/function',//功能列表
        fetchServicesOzRoleList: 'platform/auth/org/{orgId}/role?outer={outer}',//机构角色
        fetchServicesUserRoleList: 'platform/auth/user/{userId}/role?outer={outer}',//用户角色
        fetchServicesNewRole: 'platform/auth/role',//新增角色
        fetchServiceMemberList: 'platform/auth/org',
        saveServicesRole: 'platform/auth/role/grant',//赋予角色
        fetchServicesMemberList: 'platform/auth/org?',//组织-品牌／公司／成员列表
        fetchServicesMemberOuterList: 'platform/auth/org?outer=true',//外部组织-品牌／公司／成员列表
        fetchServicesMemberInnerList: 'platform/auth/org?outer=false',//内部-组织／成员列表
        deleteServicesRoleSingle: "platform/role?",//删除角色
        putServicesProjectMembers: "platform/auth/dataPrivilege/grant",//添加项目成员
        deleteServicesProjectMembers: "platform/auth/{memberType}/{userId}/dataPrivilege",//删除项目成员
        searchServicesMember: 'platform/auth/userororg?name=',  //搜索成员
        searchServicesMemberResult: 'platform/auth/ancestororgs?',//选择搜索结果  type=1
        searchServicesAuthDataSearch: 'platform/auth/keyUser/',//权限数据
        checkDelAuth: "platform/auth/keyUser/user/check",//删除项目成员
        fetchLog: "platform/auditlog",//删除项目成员
        //单独
        fetchServicesUserName: "platform/auth/user/",
        //项目详细信息-创建
        fetchProjectCreateBaseHole: 'platform/pit/createPit',
        fetchProjectCreateFloor: 'platform/building/createBuilding',
        fetchProjectCreateSection: 'platform/profile/createProfile',
        fetchProjectCreatePile: 'platform/pile/createPile',
        //项目详细信息-读取
        fetchProjectDetailBaseholeList: 'platform/pit/{projectId}',
        fetchProjectDetailFloorList: 'platform/building/{projectId}',
        fetchProjectDetailSectionList: 'platform/profile/{projectId}',
        fetchProjectDetailPileList: 'platform/pile/{projectId}',
        fetchServicesProjectMappingRule: "platform/rule/template/select/project/{projectId}", //项目映射规则
        fetchServicesProjectMappingRuleCount: "platform/mapping/rule/project/rule/count/{projectId}",
        //项目详细信息-更新
        fetchProjectUpdateBaseHole: 'platform/pit/updatePit',
        fetchProjectUpdateFloor: 'platform/building/updateBuilding',
        fetchProjectUpdateSection: 'platform/profile/updateProfile',
        fetchProjectUpdatePile: 'platform/pile/updatePile',
        //项目详细信息-删除
        removeProjectDetailBasehole: 'platform/pit/{pitId}',
        removeProjectDetailFloor: 'platform/building/{floorId}',
        removeProjectDetailSection: 'platform/profile/{sectionId}',
        putProjectLink: 'platform/mapping/{projectId}',//项目关联
        fetchProjectManagerProjectList: 'platform/mapping/project',//项目管理-项目列表
        fetchProjectManagerProjectLogo: 'platform/project/{projectId}/logo/cut',//项目管理-项目logo裁剪
        fetchServiceKeyUserList: 'platform/auth/keyUser',//关键用户列表
        fetchServiceKeyUserEdit: 'platform/auth/keyUser/{uid}',//修改关键用户
        fetchServiceKeyUserInfo: 'platform/auth/keyUser/{uid}',//获取个别关键用户信息
        fetchServiceKeyUserDelete: 'platform/auth/keyUser/{uid}',//删除关键用户
        fetchServiceStep1: 'platform/auth/org?outer=false&parentId=&includeUsers=',//项目列表
        fetchServicesProjectMemberProjectList: 'platform/auth/user/{userId}/dataPrivilege/project',//项目成员/项目管理
        fetchServicesProjectMemberMemberList: 'platform/auth/{dataPrivilegeId}/member',//项目成员/项目管理
        //代办$chars
        fetchTodoData: "platform/todo", //获取代办数据
        setFetchTodoData: "platform/todo/{todoId}/read", //获取代办数据
        //项目
        fetchProjects: "platform/project?type=3", //项目列表
        fetchManageProjects: "platform/projectManager/project", //项目列表
        fetchProjectBaseInfo: "platform/project/{projectId}", //项目列表
        fetchFileList: "doc/{projectId}/{projectVersionId}/file/children", //获取文件列表  ?fileId={parentId}  //相应
        getFileAuthUrl: "doc/{projectId}/{versionId}/turnkey/authority", //获取文件权限的接口
        fetchDesignFileNav: "doc/{projectId}/{projectVersionId}/file/tree", //项目设计文件导航
        fetchDesignFileNavKey: "doc/{projectId}/{projectVersionId}/file/tree/turn/key", //项目设计文件导航
        fetchDesignModelNav: "dataJson/project/project.design.model.json", //项目设计模型导航
        fetchProjectDetail: 'platform/project/{projectId}/version/{versionId}', //获取项目 详细信息  包含最新版本
        // 项目面包屑
        fetchCrumbsProject: "platform/project/groupByProvince", // 项目导航
        fetchCrumbsProjectVersion: "platform/project/{projectId}/version/groupBy", //项目面包屑版本  platform/project/{projectId}/version/orderBy
        fetchProjectVersionInfo: "platform/project/{projectId}/version/{projectVersionId}", //项目版本信息
        // preview file
        previewFile: "doc/{projectId}/{projectVersionId}/wdfile/url",
        commentPreview: "sixD/{projectId}/viewPoint/{viewpointId}/comment/{attachmentId}/wdfile/url",
        attachPreview: "platform/advice/feedback/{attachmentId}/wdfile/url",
        resourcePreview: "platform/related/resources/{id}/wdfile/url",
        catalogMap: "doc/native/resources/1349238228017568/wdfile/url",
        //模型
        // fetchModelIdByProject: "view/{projectId}/{projectVersionId}/init",
        fetchModelIdByProject: "doc/{projectId}/{projectVersionId}/init",
        fetchFileModelIdByFileVersionId: "doc/{projectId}/{projectVersionId}/file/meta", //?fileVersionId={fileVersionId}
        fetchScene: "view/{etag}/{sourceId}/tree", // 获取楼层,专业信息
        fetchCategory: "view/{etag}/{sourceId}/categories", // 获取构件信息
        // fetchCoding: 'view/category/coding/{etag}', //获取构件编码信息
        fetchCoding: 'doc/category/coding/{etag}', //获取构件编码信息
        fetchFloors: 'view/{etag}/{sourceId}/miniature/map', //获取模型楼层信息
        fetchAxisGrid: 'model/{etag}/metadata/gridAndLevel.json', //获取楼层地图,轴网信息
        uploadFile: "doc/{projectId}/{projectVersionId}/file/data", //上传文件  ?parentId={parentId}&fileName={fileName}&size={size}&digest={digest}&position={position}
        "checkDownLoad": "doc/{projectId}/{versionId}/file/size", // 下载确认 是否可以下载  ?fileVersionId={fileVersionId}
        downLoad: "doc/{projectId}/{projectVersionId}/file/data", //文件下载  ?fileId={fileId}
        fetchFileByModel: "doc/{projectId}/{versionId}",
        fetchRemoteModel: "doc/{projectId}/{versionId}/file/exception/alert/list?userId={userId}&userName={userName}",
        accessedRemoteModel: "doc/{projectId}/{versionId}/file/exception/alert/know?userId={userId}&userName={userName}",
        //快照
        fetchModelViewpoint: 'sixD/{projectId}/viewPoint', // 获取快照列表
        fetacCanvasData: 'sixD/{projectId}/viewPoint/{viewPointId}/comment', // 获取批注信息
        createViewpointById: 'sixD/{projectId}/viewPoint', // 创建快照
        addViewpointImg: 'sixD/{projectId}/viewPoint/{viewPointId}/pic', // 添加快照图片
        addViewpointData: 'sixD/{projectId}/viewPoint/{viewPointId}/comment', // 添加几何数据
        editViewpointById: 'sixD/{projectId}/viewPoint/{viewPointId}', // 修改快照
        deleteViewpointById: 'sixD/{projectId}/viewPoint/{viewPointId}', // 删除快照
        //设计
        fetchDesignProperties: "sixD/{projectId}/{projectVersionId}/property", //设计属性 ?sceneId={sceneId}&elementId={elementId}
        fetchDesignPropertiesPlan: "sixD/{projectId}/{projectVersionId}/plan/edo", // 设计属性 计划  ?sceneId={sceneId}&elementId={elementId}
        fetchDesignPropertiesCost: "sixD/{projectId}/{projectVersionId}/cost/edo", // 设计属性成本  ?sceneId={sceneId}&elementId={elementId}
        fetchDesignPropertiesQuality: "sixD/{projectId}/{projectVersionId}/quality/standard", // 设计属性 质量 ?sceneId={sceneId}&elementId={elementId}
        fetchDesignCheckPointMapParam: 'sixD/{projectId}/{projectVersionId}/design/element',
        fetchDesignVerification: "sixD/{projectId}/{versionId}/design/check", // 设计 检测  ?status={status}&type={type}&specialty={specialty}&reporter={reporter}&pageIndex={pageIndex}&pageItemCount={pageItemCount}
        fetchDesignCollision: "", // 设计碰撞
        // 碰撞
        fetchDesignFiles: "view/{etag}/{sourceId}/collision/tree", // 碰撞文件列表
        fetchDesignCategory: "view/{etag}/{sourceId}/collision/categories", // 构件列表
        fetchDesignTaskList: "view/{projectId}/{projectVerionId}/collision/setting/list", //碰撞任务列表
        fetchDesignTaskDetail: "sixD/{projectId}/{projectVersionId}/{collisionId}/point?pageNo={pageNo}&pageSize={pageSize}", //碰撞点列表
        creatCollisionTask: "view/{projectId}/{projectVersionId}/collision/setting", //创建碰撞任务
        fetchDesignSetting: "view/{projectId}/{projectVersionId}/{collision}/setting", //查看碰撞设置
        // 模型对比
        // fetchDesignChange: "view/{projectId}/{projectVersionId}/comparison?type=std", // 获取模型对比列表
        fetchDesignChange: "doc/{projectId}/{projectVersionId}/comparison?type=std", // 获取模型对比列表
        fetchDesignChangeInfo: "sixD/{projectId}/{projectVersionId}/comparison/result?comparisonId={comparisonId}", // 获取模型对比结果
        fetchChangeComparisonInfo: "sixD/{projectId}/{projectVersionId}/comparison/property?baseModel={baseModel}&currentModel={currentModel}&elementId={elementId}", // 获取模型对比构件设计属性变更
        //计划
        fetchPlanModel: "sixD/{projectId}/{projectVersionId}/plan", //模型
        fetchPlanAnalog: "sixD/{projectId}/{projectVersionId}/plan?relateModel=true", //模拟
        fetchPlanPublicity: "sixD/plan/concern", //关注 ?queryType={queryType}
        fetchPlanInspection: "sixD/{projectId}/{projectVersionId}/plan?noElement=true&relateModel=true", //检验 计划节点未关联图元 startTime=1398145297000&endTime=1398145297000&relateModel={true|false}&
        fetchPlanInspectionCate: "sixD/{projectId}/{projectVersionId}/plan/noplan/cate", // 图元未关联计划节点
        fetchPlanInspectionCateDetail: "sixD/{projectId}/{projectVersionId}/plan/noplan/element", // 图元未关联计划节点 ?cateId={cateId} 暂开详情
        fetchModleIdByCode: "sixD/{projectId}/{projectVersionId}/plan/element", //获取构建的模型id
        fetchComponentByCateId: "sixD/{projectId}/{projectVersionId}/plan/noplan/element",//更具类型获取构建  ? cateId={cateId}
        fetchPlanProperties: "", //属性
        //陈本
        fetchCostReference: "sixD/{projectId}/{projectVersionId}/cost/summary", // 清单
        fetchCostChange: "platform/auditSheet?type=9", // 变更    变更列表   9默认，所有列表    13  仅审核通过和确认列表
        fetchCostVerification: "sixD/{projectId}/{projectVersionId}/cost/summary?noElement=true", // 效验
        fetchCostVerificationCate: "sixD/{projectId}/{projectVersionId}/cost/nocost/cate", // 效验 图元未关联清单 类型
        fetchCostVerificationCateDetail: "sixD/{projectId}/{projectVersionId}/cost/nocost/element", // ?cateId={cateId}图元未关联清单 详情
        fetchCostModleIdByCode: "sixD/{projectId}/{projectVersionId}/cost/element", // ?costCode={costCode}
        fetchNoCostCate: "sixD/{projectId}/{projectVersionId}/cost/nocost/element",//获取未关联成本的构件 ?cateId={cateId}
        // 质量
        fetchQualityMaterialEquipment: "sixD/{projectId}/{projectVersionId}/device", //材料设备?specialty={specialty}&category={category}&status={status}&name={name}&startTime={startTime}&endTime={endTime}&pageIndex={pageIndex}&pageItemCount={pageItemCount}
        fetchQualityProcessAcceptance: "sixD/{projectId}/{projectVersionId}/acceptance?type=1", //过程验收
        fetchQualityOpeningAcceptance: "sixD/{projectId}/{projectVersionId}/acceptance?type=2", //开业验收
        fetchQualityConcerns: "sixD/{projectId}/{projectVersionId}/problem", //隐患
        fetchQualityProperties: "dataJson/project/project.design.property.json", // 属性
        fetchQualityModelById: "sixD/{projectId}/{versionId}/quality/element", //开业验收 过程 验收 获取构建id  ?acceptanceId={acceptanceId}
        fetchQualityProcessDisease: 'sixD/{projectId}/{versionId}/problem/list',
        //资源
        fetchStandardLibs: "platform/project?type=1", //获取 标准模型库
        fetchStandardVersion: "platform/project/{projectId}/version", //获取标准模型库版本
        fetchFamLibs: "platform/project?type=2", //获取族库
        fetchVersion: "platform/project/{projectId}/version/{versionId}",
        fetchFileTree: "doc/{projectId}/{projectVersionId}/file/tree", //项目设计文件导航
        deleteFile: "doc/{projectId}/{projectVersionId}/file?fileVersionId={fileVersionId}", //删除文件  ?fileVersionId={fileVersionId}
        putFileReName: "doc/{projectId}/{projectVersionId}/file/rename", // 重命名文件 ?fileVersionId={fileVersionId}&name={name}
        createNewFolder: "doc/{projectId}/{projectVersionId}/file", // 创建新文件夹 ?parentId={parentId}&filePath={filePath}
        //映射规则库
        fetchArtifactsCategoryRule: "platform/mapping/rule/category/coding",//获取分类编码   platform/mapping/rule/category/coding?parentCode={parentCode}  //接口无数据
        fetchArtifactsPlan: "platform/mapping/rule/plan/standard",//计划节点    platform/mapping/rule/plan/standard?type={type}  模块化列表  1:标准规则；2：项目规则
        fetchArtifactsPlanRule: "platform/mapping/rule/target/code/{code}?",//计划节点规则获取     //platform/mapping/rule/target/code/{code}?biz={biz}&type={type}&projectId={projectId}
        createArtifactsPlanNewRule: "platform/mapping/rule/create",//计划节点新建规则      platform/mapping/rule/create?projectId={projectId}    如果为标准映射规则不用传projectId
        modifyArtifactsPlanRule: "platform/mapping/rule/update",//计划节点修改规则          platform/mapping/rule/update?projectId={projectId}
        deleteArtifactsPlanRule: "dataJson/resources/fetchArtifactsMapPlan.json",//计划节点删除规则           platform/mapping/rule/delete/{id}?projectId={projectId}
        //质量标准
        fetchArtifactsQuality: "platform/mapping/rule/quality/standard", //获取质量标准1级  platform/mapping/rule/quality/standard?type={type}&standardType=={KY|GC}
        //规则模板
        fetchArtifactsTemplate: "platform/rule/template/select/all", //模板列表 //platform/rule/template/select/all
        createArtifactsTemplate: "platform/rule/template/create", //创建模板
        fetchArtifactsTemplateRule: "platform/rule/template/select/rule/{templateId}", //模板规则列表  platform/rule/template/select/rule/{templateId}
        saveArtifactsTemplateRule: "platform/rule/template/update", //模板规则列表
        fetchArtifactsProjectName: "platform/rule/template/select/project/info/{projectId}",//platform/rule/template/select/project/info/{projectId}
        modifyProjectMappingRule: "platform/rule/template/update/project/{projectId}/{templateId}",    //修改项目规则模板
        //项目 变更 列表
        fileList: "doc/{projectId}/{versionId}/differ", //变更列表
        projectChangeList: "sixD/{projectId}/{projectVersionId}/cost/comparison",// ?fileVerionId={fileVerionId}&baseFileVerionId={baseFileVerionId}
        projectDesinProperties: "sixD/{projectId}/{projectVersionId}/property/comparison",//?baseFileVerionId={baseFileVerionId}&fileVerionId={fileVerionId}&sceneId={sceneId}&elementId={elementId}
        projectDesinPropertiesCost: "sixD/{projectId}/{projectVersionId}/cost/edo/comparison", //属性成本 ?baseProjectVerionId={baseProjectVerionId}&sceneId={sceneId}&elementId={elementId}
        //系统设置
        "servicesAddCategory": "platform/set/category/add",// 新增分类
        "servicesCategoryList": "platform/set/category", //分类 列表
        "servicesCategoryUpdate": "platform/set/category/update",// 更新类别
        "servicesCategoryDel": "platform/set/category/del",// 删除 ?id={id}
        //流程
        "servicesFlowAdd": "platform/set/flow/add",// 新增分类
        "servicesFlowList": "platform/set/flow", // 列表 ?categoryId={categoryId}
        "servicesFlowUpdate": "platform/set/flow/update",// 更新类别
        "servicesFlowDel": "platform/set/flow/del",// 删除 ?id={id}
        "servicesFlowIndex": "platform/set/flow/serial", // 改变位置 ?id={id}
        "servicesFolwMove": "platform/set/flow/serial", // ?id={id} move up  or down
        //app
        appList: "platform/app",//应用列表
        fetchAppListById: "platform/app/{id}",//根据id获取列表
        appInsert: "platform/app/",//创建应用 name desc
        appDel: "platform/app/{id}",//删除应用
        appResetSecret: "platform/app/{id}",//重新生成 Secret
        appUpdate: "platform/app",//更新 id, name desc
        appSwitchStatus: "platform/app/{id}/disable?status={status}",//应用状态修改
        //扩展属性
        extendAttrList: "platform/setting/extensions/property/{classKey}", // 扩展列表
        resourceList: "platform/setting/extensions/property/{classKey}", // 获取资源列表的接口
        extendAttrInsert: "platform/setting/extensions/property",//新增
        extendAttrUpdate: "platform/setting/extensions/property",//更新扩展属性
        extendAttrDel: "platform/setting/extensions/property/{classKey}?property={property}",//删除扩展属性
        extendClassAttr: "platform/setting/extensions/{projectId}/property?classKey={classKey}&elementId={elementId}",//获取push的属性值
        extendAttrGetReferene: "platform/setting/extensions/property/reference",// 获取引用扩展属性
        projectCodeMapping: "platform/mapping/{projectId}",
        getBoundingBox: "sixD/{projectId}/{projectVersionId}/bounding/box",//获取构建的 box id ?sceneId={sceneId}&elementId={elementId}
        appToken: "platform/token", //获取app token
        // modelStd:'view/{projectId}/{projectVersionId}/comparison?type=std', // 与标准模型对比
        modelStd: 'doc/{projectId}/{projectVersionId}/comparison?type=std', // 与标准模型对比
        //modelBase:'view/{projectId}/{projectVersionId}/comparison?type=base', // 与标准模型对比 note by wuweiwei
        modelBase: 'doc/{projectId}/{projectVersionId}/comparison?type=base', // 与标准模型对比   add by wuweiwei
        'attrDwg': 'doc/{projectId}/{versionId}/file/tag', //图纸
        //业务流程
        fetchFlow: 'platform/workflow/{phaseId}/category',
        fetchNavFlow: 'platform/workflow/phase',
        fetchFlowDetail: 'platform/workflow/items/info',
        fetchKeyFlow: 'platform/workflow/turnKeyList',
        //批注
        createViewPoint: "sixD/{projectId}/viewPoint",//创建视点
        updateViewPoint: "sixD/{projectId}/viewPoint/{viewPointId}",//更新视图
        createAnnotation: "sixD/{projectId}/viewPoint/{viewPointId}/annotation",//创建批注
        savePointFilter: "sixD/{projectId}/viewPoint/{viewPointId}/filter",//保存视点过滤器
        uploadPic: "sixD/{projectId}/viewPoint/{viewPointId}/pic",//上传图片
        projectPhoto: "sixD/{projectId}/viewPoint?type=1",//项目快照
        userPhoto: "sixD/{projectId}/viewPoint?type=0",//用户快照
        getSharePhoto: 'sixD/sharedViewpoint/{token}/viewpoint',// 获取分享视点信息
        viewComments: "sixD/{projectId}/viewPoint/{viewPointId}/comment",//查看发表评论
        delViewPoint: "sixD/{projectId}/viewPoint/{viewPointId}",//删除视点
        createComment: "sixD/{projectId}/viewPoint/{viewPointId}/comment",// 创建评论
        delComment: "sixD/{projectId}/viewPoint/{viewPointId}/comment/{commentId}",//删除评论
        getFilter: "sixD/{projectId}/viewPoint/{viewPointId}/filter",//获取过滤器
        getAnnotation: "sixD/{projectId}/viewPoint/{viewPointId}/annotation", //获取批注
        updateAnnotation: "sixD/{projectId}/viewPoint/{viewPointId}/annotation", //更新批注
        //分享
        shareComment: 'sixD/sharedViewpoint',//分享快照
        parseToken: 'share/{id}', //解析链接
        getFilterByToken: "sixD/sharedViewpoint/{auth}/filter",//分享过滤器
        getAnnotationByToken: "sixD/sharedViewpoint/{auth}/annotation",//分享批注
        viewCommentsByToken: "sixD/sharedViewpoint/{auth}/comment",//查看发表评论
        uploadPicByToken: "sixD/sharedViewpoint/{auth}/comment/pic",//上传图片
        createCommentByToken: "sixD/sharedViewpoint/{auth}/comment",//创建评论
        delCommentByToken: "sixD/sharedViewpoint/{auth}/comment/{commentId}",//删除评论
        autoComplateUser: "platform/project/{projectId}/member",
        viewPointPosition: "sixD/{projectId}/viewPoint/{viewPointId}/comment/position?description={description}&position={position}", //视点上传位置
        viewPointCommentViewpoint: "sixD/{projectId}/viewPoint/{viewPointId}/comment/viewpoint",//视点评论视点
        fileSearch: "doc/{projectId}/{versionId}/file/query", //文件搜索
        projectByCode: "platform/api/project/{code}/meta?appKey={appKey}",
        current: "platform/user/current", //当前用户
        serviceCommitSuggest: 'platform/advice/feedback/write',
        serviceSuggestHistory: 'platform/advice/feedback/selectAll',
        serviceQuerySuggest: 'platform/advice/feedback/select/{adviceId}',
        test: "",
        getViewUserList: "platform/testuser",//获取浏览用户的列表
        checkUser: "platform/testuser/check",//检查用户是否存在
        addViewUser: "platform/testuser",//添加用户
        deleteViewUser: "platform/testuser/del",//删除用户
        updateViewUser: "platform/testuser",//删除用户
        getProjectsList: "platform/testuser/allProject",//获取全部项目的列表
        getViewUserInfo: "platform/testuser/loginId",//获取全部项目的列表
        getViewUserPrefix: "platform/testuser/prefix",//获取获取用户前缀的方法
        // getFileStatus:"platform/report/job/status",//获取文件上传转换状态的地址
        getFileStatus: "platform/report/job/status",//获取文件上传转换状态的地址
        getPrefixsList: "platform/testuser/prefix",//获取用户前缀列表的地址
        checkUserPrefix: "platform/testuser/check/prefix",//检查用户前缀是否存在的地址
        addViewUserPrefix: "platform/testuser/prefix",//添加用户前缀的地址
        deleteViewUserPrefix: "platform/testuser/prefix",//删除用户前缀的地址
        relLink: "platform/relLink",//获取链接地址的接口
        getWorkforgconList: "platform/workforgcon",//获取添加的族库和标准模型库的列表的接口
        addWorkforgcon: "platform/workforgcon",//添加的族库和标准模型库的列表的接口
        deleteWorkforgcon: "platform/workforgcon",//删除族库和标准模型库的列表的接口
        searchUrl: "platform/auth/org/search",//搜索部门的接口
        getServersNoticeList: "platform/announce/list",//获取公告列表的接口
        stickNotice: "platform/announce/top",//置顶公告的接口
        cancelStickNotice: "platform/announce/cancelTop",//取消置顶公告的接口
        withdrawNotice: "platform/announce/revocation",//已发布之后进行撤销的接口
        deleteNotice: "platform/announce/del",//删除公告的接口
        publishNotice: "platform/announce/publish",//发布公告的接口
        getNotice: "platform/announce/toEdit",//获取公告的接口
        editNotice: "platform/announce/edit",//编辑公告的接口
        addLinkNotice: "platform/announce/add",//添加链接公告的接口
        getResourceList: "platform/related/resources/list",//获取资源列表的接口
        saveResource: "platform/related/resources/save",//添加资源列表的接口
        deleteResource: "platform/related/resources/delete",//添加资源列表的接口
        searchResourceTypeList: "platform/related/resources/listType",//资源类型查询列表的接口
        downloadResource: "platform/related/resources/download/{id}",//资源类型下载的接口
        getFeedBackList: "platform/advice/feedback/query/page",//获取建议反馈列表的接口
        delFeedBackItem: 'platform/advice/feedback/delete/advice/{id}',//删除建议反馈item
        getFeedBackInfo: "platform/advice/feedback/query/page",//获取建议反馈列表的接口
        deleteFeedBack: "platform/advice/feedback/reply/delete/{adviceId}/{replytId}",//删除建议反馈列表的接口
        deleteFeedBackQT: "platform/advice/feedback/delete/{replytId}",//删除建议反馈列表的接口
        addFeedBack: "platform/advice/feedback/reply/write",//删除建议反馈列表的接口
        downloadsFeedBack: "platform/advice/feedback/zipdownload/{adviceId}",//下载建议反馈附件列表的接口
        downloadsOneFeedBack: "platform/advice/feedback/download/{attachmentId}",//下载建议反馈单个附件列表的接口
        getNotesList: "sixD/viewPoint/list",//获取批注列表的方法
        getCommentList: "sixD/viewPoint/comment/list",//获取批注评论列表的方法
        deleteNotesComment: "sixD/{projectId}/viewPoint/{viewPointId}/comment/{commentId}",//删除批注地下的评论的接口
        getNotesPage: "sixD/viewPoint/query/pageNum",//获取单个批注在列表当中的位置信息
        getCommFooterLink: "platform/entrance/url",//获取pc端公用底部链接地址
        getOnLineLink: "platform/train/url",//获取pc端公用底部链接地址
        getRightUpLink: "platform/auth/url",//获取pc端右上角我的培训 认证结果 培训管理链接地址
        getQualityLink: "platform/quality/url",//获取pc端基础资源质检链接地址
        outPutFeedBack: "platform/advice/feedback/export",//到处建议反馈接口
        getUserInfo: "platform/user/info",//到处建议反馈接口
        getFileVersionList: 'doc/{projectId}/{versionId}/turnkey/history/dwg',//首先获取文件版本列表方法?fileVersionId={fileVersionId}
        isCanDelteUrl: 'doc/{projectId}/{versionId}/turnkey/history/havedwg',//是否能删除当前文件
        checkProjectAuth: 'platform/user/project/isexist',//验证当前用户是否有权限查看当前项目
        checkFeedback: 'platform/advice/feedback/checkAdviceAndReply',//验证建议反馈和建议反馈回复是否存在
        checkNotesComment: 'sixD/viewPoint/checkViewPointAndComment',//验证批注和批注评论是否存在接口
    },
    DEBUGURL: {
        localisation: '/dataJson/localisation/homepage.json',
        i18n: '/dataJson/localisation/i18n-en.json',
        "i18n-zh": '/dataJson/localisation/i18n-zh.json',
        //首页bodyContent数据
        fetchBodyContentTodos: '/dataJson/bodyContent/bodyContent.todos.json',
        fetchBodyContentMonthEnd: 'platform/plan/concern/index',
        fetchBodyContentMonthStart: 'platform/plan/concern/index',
        fetchBodyContentSlide: '/dataJson/bodyContent/bodyContent.slide.json',
        fetchBodyContentMmhSlide: 'dataJson/bodyContent/bodyContent.mmhSlider.json',
        fetchBodyContentProclamation: '/dataJson/bodyContent/bodyContent.proclamation.json',
        //services-member
        fetchServicesMemberList: '/dataJson/services/member/services.member.list.json',//组织-混合列表
        fetchServicesRolesList: '/dataJson/services/member/services.member.roles.json',//角色-功能列表
        fetchServicesFunList: '/dataJson/services/member/services.role.fun.json',//功能列表
        fetchServicesOzRoleList: '/dataJson/services/member/services.oz.role.json',//组织角色列表
        fetchServicesNewRole: 'platform/auth/role',//新增角色
        fetchServicesUserRoleList: '/dataJson/services/member/services.user.role.json',//用户角色列表
        fetchServicesMemberOuterList: '/dataJson/services/member/services.member.list.json',//外部组织-品牌／公司／成员列表
        fetchServicesMemberInnerList: '/dataJson/services/member/services.member.list.json',//内部-组织／成员列表
        fetchServiceKeyUserEdit: 'platform/auth/keyUser/{uid}',//修改关键用户
        fetchServiceKeyUserDelete: 'platform/auth/keyUser/{uid}',//删除关键用户
        fetchServicesProjectMemberProjectList: '/dataJson/services/member/services.project.member.projects.json',//项目成员/项目管理
        fetchServicesProjectMemberMemberList: '/dataJson/services/member/services.project.member.members.json',//项目成员/项目管理
        fetchServiceKeyUserList: '/dataJson/services/services.KeyUser.json',//关键用户列表
        fetchServiceStep1: '/dataJson/services/services.step1.json',//项目列表
        //代办
        fetchTodoData: "/dataJson/todo/todo.json", //获取代办数据
        // 项目
        fetchProjects: "/dataJson/{project}/project.list.json", //项目列表
        fetchFileList: "dataJson/project/project.design.json", //获取文件列表
        fetchDesignFileNav: "/dataJson/project/project.design.file.json", //项目设计文件导航
        fetchDesignModelNav: "/dataJson/project/project.design.model.json", //项目设计模型导航
        // 项目面包屑
        fetchCrumbsProject: "/dataJson/project/fetchCrumbsProject.json", // 项目导航
        fetchCrumbsProjectVersion: "/dataJson/project/fetchCrumbsProjectVersion.json", //项目面包屑版本
        fetchProjectVersionInfo: "platform/project/{projectId}/version/{projectVersionId}", //项目版本信息
        fetchModelIdByProject: "/dataJson/project/design/fetchModelIdByProject.json",
        fetchFloors: '/datajson/map/map.json', //获取模型楼层信息
        fetchAxisGrid: '/datajson/map/gridAndLevel.json', //获取楼层地图,轴网信息
        //快照
        fetchModelViewpoint: '/datajson/project/project.viewpoint.property.json', // 获取快照列表
        fetacCanvasData: '/datajson/project/project.viewpoint.comments.json', // 获取批注信息
        createViewpointById: '', // 创建快照
        editViewpointById: '', // 修改快照
        deleteViewpointById: '', // 删除快照
        //设计
        fetchDesignProperties: "/dataJson/project/project.design.property.json", //设计属性
        fetchDesignVerification: "/dataJson/project/project.design.property.json", //设计检测
        // 碰撞
        fetchDesignCollision: "/dataJson/project/project.design.property.json", //设计碰撞
        fetchDesignFileList: "/dataJson/project/project.design.filesList.json", // 设计碰撞文件
        fetchDesignTaskList: "/dataJson/project/project.design.collision.taskList.json", //碰撞任务列表
        fetchDesignTaskDetail: "/dataJson/project/project.design.task.detail.json", //碰撞任务详情
        creatCollisionTask: "",
        // 模型对比
        fetchDesignChange: "/dataJson/project/fetchDesignChange.json", // 获取模型对比列表
        fetchDesignChangeInfo: "/dataJson/project/fetchDesignChangeInfo.json", // 获取模型对比结果
        //计划
        fetchPlanModel: "/dataJson/project/project.design.property.json", //模型
        fetchPlanAnalog: "/dataJson/project/project.design.property.json", //模拟
        fetchPlanPublicity: "/dataJson/project/plan/publicity.json", //关注
        fetchPlanInspection: "/dataJson/project/project.design.property.json", //检验
        fetchPlanProperties: "/dataJson/project/project.design.property.json", //属性
        //陈本
        fetchCostReference: "/dataJson/project/cost/list.json", // 清单
        fetchCostChange: "/dataJson/project/project.design.property.json", // 变更
        fetchCostVerification: "/dataJson/project/cost/list.json", // 效验
        fetchCostProperties: "/dataJson/project/project.design.property.json", //属性
        // 质量
        fetchQualityMaterialEquipment: "/dataJson/project/project.design.property.json", //材料设备
        fetchQualityProcessAcceptance: "/dataJson/project/project.design.property.json", //过程验收
        fetchQualityProcessCheck: "/dataJson/project/project.design.property.json", //过程检查
        fetchQualityOpeningAcceptance: "/dataJson/project/project.design.property.json", //开业验收
        fetchQualityConcerns: "/dataJson/project/project.design.property.json", //隐患
        fetchQualityProperties: "/dataJson/project/project.design.property.json", // 属性
        //资源
        fetchStandardLibs: "/dataJson/resources/StandardLibs.json", //获取 标准模型库
        fetchFamLibs: "/dataJson/resources/StandardLibs.json", //获取族库
        fetchStandardVersion: "/dataJson/resources/fetchStandardVersion.json",
        fetchFileTree: "/dataJson/project/project.design.file.json", //项目设计文件导航
        deleteFile: "", //删除文件
        putFileReName: "", //重命名文件
        createNewFolder: "",
        //映射规则库
        fetchArtifactsPlanLibs: "/dataJson/resources/fetchArtifactsMapPlan.json",//计划节点
        fetchQualityPlanStandardLevel1: "/dataJson/resources/fetchArtifactsMapPlan.json", //质量标准
        fetchQualityPlanStandardLevel2: "/dataJson/resources/fetchArtifactsMapPlan.json", //质量标准
        //app
        appList: "platform/app",//应用列表
        fetchAppListById: "platform/app/{id}",//根据id获取列表
        appInsert: "platform/app/",//创建应用 name desc
        appDel: "platform/app/{id}",//删除应用
        appResetSecret: "platform/app/{id}",//重新生成 Secret
        appUpdate: "platform/app",//更新 id, name desc
        test: "",
        //addViewUser API
        getViewUserList: "platform/testuser",//获取浏览用户的列表
    }
};
