/*

write by wuweiwei

*/
App.Restful = {
    urls: {
        statistics: '/doc/common/stat',
        /*获取用户是外部换是内部用户*/
        "current": "/platform/user/current",
        /*外部用户登录接口*/
        "outerLogin": "/platform/login",
        /*首页获取链接地址接口*/
        "entranceLink": "/platform/entrance/url",
        /*首页代办*/
        "todo": "/platform/todo?status={status}&pageIndex={pageIndex}&pageItemCount={pageItemCount}&title={title}",
        "todoRead": "/platform/todo/{todoId}/read",
        /*首页公告*/
        "notice": "/platform/announce/list?title={title}&status={status}&pageIndex={pageIndex}&pageItemCount={pageItemCount}",
        "noticeDetail": "/platform/announce/toEdit?id={id}",
        /*公告是否已读*/
        "noticeRead": "/platform/announce/read?id={id}",
        /*项目列表*/
        "projectsList": "/platform/project",
        // "projectsList": "/platform/project?type={type}&name={projectName}&pageIndex={pageIndex}&pageItemCount={pageItemCount}",
        /*项目信息*/
        "getProjectInfo": "/platform/project/{projectId}/version/{versionId}",
        "getProjectIdInfo": "/platform/project/{projectId}",
        /*获取版本名字的接口*/
        "versionName": "/platform/project/{projectId}/version/{projectVersionId}",
        /*项目文件夹*/
        "projectFolderList": "/doc/{projectId}/{projectVersionId}/file/children?parentId={parentId}",
        "projectSearchFolderList": "/doc/{projectId}/{projectVersionId}/file/query/list?key={folderName}&parentId={parentId}",
        /*加载项目版本屑接口*/
        "projectVersionList": "/platform/project/{projectId}/version/groupBy",
        /*加载批注接口*/
        "projectNotesList": "/sixD/viewPoint/list",
        /*编辑批注简介之后保存接口*/
        "updateViewPoint": "/sixD/{projectId}/viewPoint/{viewPointId}",
        /*加载批注详情接口*/
        "projectNotesDetails": "/sixD/{projectId}/viewPoint/{viewPointId}",
        /*删除批注接口*/
        "deleteNotesList": "/sixD/{projectId}/viewPoint/{viewPointId}",
        /*删除反馈接口*/
        "deleteFeedbackList": "/platform/advice/feedback/delete/advice/{id}",
        /*加载批注个数接口*/
        "projectNotesNumber": "/sixD/viewPoint/list/count",
        /*加载批注详情使用的modelId*/
        "getModelId": "/doc/{projectId}/{projectVersionId}/queryGFile",
        /*加载批注评论列表接口*/
        "loadNotesComment": "/sixD/viewPoint/comment/list",
        getUserInfo: "/platform/user/info",//到处建议反馈接口
        /*添加批注评论接口*/
        "addNotesComment": "/sixD/{projectId}/viewPoint/{viewPointId}/comment",
        /*添加批注评论接口*/
        "deleteNotesComment": "/sixD/{projectId}/viewPoint/{viewPointId}/comment/{commentId}",
        /*加载面包屑接口*/
        "projectCrumbsList": "/doc/{projectId}/{projectVersionId}/file/bread/thread?parentId={parentId}",
        /*加载资源列表接口*/
        "resourceList": "/platform/project?type={type}&pageIndex={pageIndex}&pageItemCount={pageItemCount}",
        /*加载资源版本列表接口*/
        "resourceVersionList": "/platform/project/{projectId}/version",
        /*加载业务流程列表接口*/
        "flowList": "/platform/workflow/phase",
        /*加载业务流程列表接口*/
        "flowFolderList": "/platform/workflow/{id}/category?isBimControl={isBimControl}",
        /*加载业务流程列表子列表接口*/
        "flowItemsNameList": "/platform/workflow/{phaseId}/{categoryName}?isBimControl={isBimControl}",
        /*加载业务流程详细接口*/
        "flowDetailData": "/platform/workflow/items/info",
        /*加载总包交钥匙业务流程详细接口*/
        "flowKeyDetailData": "/platform/workflow/turnKey/category/item?categoryId={id}",
        /*获取总包交钥匙数据的接口*/
        "getFlowKeyData": "/platform/workflow/turnKeyList",
        /*获取总包交钥匙数据的接口*/
        "getFlowKeyFolderData": "/platform/workflow/turnKey/category?phaseId={id}",
        /*搜索加载业务流程接口*/
        "flowSearchData": "/platform/workflow/query",
        /*获取相关资源列表接口*/
        "getResourcesData": "/platform/related/resources/list",
        /*获取建议反馈列表接口*/
        "getFeebackData": "/platform/advice/feedback/query/page",
        /*添加建议反馈列表接口*/
        "addFeebackData": "/platform/advice/feedback/write",
        /*项目高级搜索的接口*/
        "getProjectsData": "/platform/project",
        /*获取项目省份的接口*/
        "getProjectsProvinceData": "/platform/project/province",
        /*获取项目省份的接口*/
        "getQuartetRegistrationUrl": "/platform/sifang/register/url",
        /*获取我的消息列表的接口*/
        "getMyNewsListUrl": "/platform/message?title={title}&status={status}&pageIndex={pageIndex}&pageItemCount={pageItemCount}",
        /*获取我的消息列表的接口*/
        "getMyNewsNumUrl": "/platform/message/count?status={status}",
        /*获取我的消息列表设置已读是否的接口*/
        "getMyNewsReadUrl": "/platform/message/read?flag=1&id={messageId}",
        /*获取我的消息列表设置建议反馈信息的接口*/
        "getMyNewsFeedBackUrl": "/platform/advice/feedback/query/page",
        /*获取我的消息列表设置建议反馈信息的接口*/
        "checkNotesUrl": "/sixD/viewPoint/checkViewPointAndComment",
        /*验证建议反馈是否存在的接口*/
        "checkFeedbackUrl": "/platform/advice/feedback/checkAdviceAndReply",
        /*检查项目权限*/
        "checkProjectAuth": "/platform/user/project/isexist",
        /*获取项目用户列表的接口*/
        "getProjectUserList": "/platform/auth/member?projectId={projectId}&name={name}&pageIndex={pageIndex}&pageItemCount={pageItemCount}",
    },
    localUrls: {
        "projectsList": "/jsonData/projectsList.json"
    },
    changeLocalUrls: function () {
        if (App.Switch.useLocalJson) {
            this.urls = this.localUrls;
        }
    }
}
App.Restful.changeLocalUrls();

