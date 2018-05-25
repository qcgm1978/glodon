/*

write by wuweiwei
core code , config route and controller handle

注意：配置路由后，用户在浏览器中输入URL时，不能包含这些符号：空格、百分号、问号

*/
/*配置路由*/
wRouter.config({
    container: $("#mainContainer")[0], /*指定载入templateUrl的容器DOM*/
    routes: [
        {
            url: "/index", /*页面路由*/
            controller: "index", /*路由的名称,根据含义起名*/
            templateUrl: "tpls/index/index.html"   /*载入的页面,当在浏览器执行"#/index"后,会自动载入此页面*/
        },
        {
            url: "/Projects",
            controller: "projects",
            templateUrl: "tpls/projects/projectsList.html"
        },
        {
            url: "/searchHeightPage",
            controller: "searchHeightPage",
            templateUrl: "tpls/projects/searchHeightPage.html"
        },
        {
            url: "/project/:projectId/:versionId/:projectName/:folderId",
            controller: "project",
            templateUrl: "tpls/projects/projectFileList.html"
        },
        {
            url: "/flow",
            controller: "flow",
            templateUrl: "tpls/flow/flow.html"
        },
        {
            url: "/flowList/:name/:id",
            controller: "flowList",
            templateUrl: "tpls/flow/flowList.html"
        },
        {
            url: "/flowTextList/:name/:id/:folderName",
            controller: "flowTextList",
            templateUrl: "tpls/flow/flowTextList.html"
        },
        {
            url: "/flowDetailPage/:name/:id/:folderName/:parName",
            controller: "flowDetailPage",
            templateUrl: "tpls/flow/flowDetailPage.html"
        },
        {
            url: "/glyjPage/:name/:index",
            controller: "glyjPage",
            templateUrl: "tpls/flow/glyjPage.html"
        },
        {
            url: "/glyjDetailPage/:name/:index",
            controller: "glyjDetailPage",
            templateUrl: "tpls/flow/glyjDetailPage.html"
        },
        {
            url: "/resource",
            controller: "resource",
            templateUrl: "tpls/resource/resourceList.html"
        },
        {
            url: "/resourceComList/:type",
            controller: "resourceComList",
            templateUrl: "tpls/resource/resourceComList.html"
        },
        {
            url: "/resourceModelLibraryList/:id/:versionId/:name/:folderId",
            controller: "resourceModelLibraryList",
            templateUrl: "tpls/resource/resourceModelLibraryList.html"
        },
        {
            url: "/resourceFamilyLibraryList/:id/:versionId/:name/:folderId",
            controller: "resourceFamilyLibraryList",
            templateUrl: "tpls/resource/resourceFamilyLibraryList.html"
        },
        {
            url: "/service",
            controller: "service",
            templateUrl: "tpls/service/serviceList.html"
        },
        {
            url: "/serviceRelated",
            controller: "serviceRelated",
            templateUrl: "tpls/service/serviceRelated.html"
        },
        {
            url: "/serviceFeedback",
            controller: "serviceFeedback",
            templateUrl: "tpls/service/serviceFeedback.html"
        },
        {
            url: "/addFeedback",
            controller: "addFeedback",
            templateUrl: "tpls/service/addFeedback.html"
        },
        {
            url: "/noticeList",
            controller: "noticeList",
            templateUrl: "tpls/notice/noticeList.html"
        },
        {
            url: "/noticeDetail/:id/:backName",
            controller: "noticeDetail",
            templateUrl: "tpls/notice/noticeDetail.html"
        },
        {
            url: "/todoList",
            controller: "todoList",
            templateUrl: "tpls/todo/todoList.html"
        },
        {
            url: "/viewModel/:projectId/:projectVersionId/:projectName/:folderId/:fileName/:modelId/:actionName/:paramA/:paramB/:paramC",
            controller: "viewModel",
            templateUrl: "tpls/model/model.html"
        },
        {
            url: "/paperModel/:projectId/:projectVersionId/:projectName/:folderId/:fileName/:fileVersionId/:actionName/:paramA/:paramB",
            controller: "paperModel",
            templateUrl: "tpls/model/paperModel.html"
        },
        {
            url: "/famLibsModel/:projectId/:projectVersionId/:projectName/:folderId/:fileName/:modelId/:actionName",
            controller: "famLibsModel",
            templateUrl: "tpls/model/famLibsModel.html"
        },
        {
            url: "/notesList/:projectId/:projectVersionId/:name/:folderId",
            controller: "notesList",
            templateUrl: "tpls/notes/notesList.html"
        },
        {
            url: "/notesDetails/:projectId/:projectVersionId/:name/:folderId/:notesId/:fileVersionId",
            controller: "notesDetails",
            templateUrl: "tpls/notes/notesDetails.html"
        },
        {
            url: "/notesImg/:projectId/:projectVersionId/:name/:folderId/:fileName/:modelId/:notesId/:fileVersionId",
            controller: "notesImg",
            templateUrl: "tpls/notes/notesImg.html"
        },
        {
            url: "/notesSnapImg/:projectId/:projectVersionId/:name/:folderId/:notesId/:fileVersionId/:commentId",
            controller: "notesSnapImg",
            templateUrl: "tpls/notes/notesSnapImg.html"
        },
        {
            url: "/addNotesComment/:projectId/:projectVersionId/:name/:folderId/:notesId/:fileVersionId",
            controller: "addNotesComment",
            templateUrl: "tpls/notes/addNotesComment.html"
        },
        {
            url: "/atUserList/:projectId",
            controller: "atUserList",
            templateUrl: "tpls/notes/atUserList.html"
        },
        {
            url: "/deleteImgPage/:imgUrl/:actionName",
            controller: "deleteImgPage",
            templateUrl: "tpls/comm/deleteImgPage.html"
        },
        {
            url: "/xiaowan",
            controller: "xiaowan",
            templateUrl: "tpls/service/xiaowan.html"
        },
        {
            url: "/myNews",
            controller: "myNews",
            templateUrl: "tpls/service/myNews.html"
        },
        {
            url: "/newsFeedBack/:feedbackId/:feedbackreplayid",
            controller: "newsFeedBack",
            templateUrl: "tpls/service/newsFeedBack.html"
        }
    ],
    otherwise: {
        redirectTo: "/index"
    }
});
/*通用controller处理函数*/
wRouter.commonController(function (isFirst) {
    /*isFirst is Boolean ,true is first laod or refresh*/
    // $("#mainContainer").css("overflow","auto");
    // debugger;
    App.Statistics.sendStatistics({
        type: 'pv',
        "lang": 'cn'
    });
    $("#mainContainer").css("overflow", "hidden");
    App.resetFrameStyle();
    App.showMainMenu();
    App.TitleBar.showReturn();
    if (isFirst) {
        App.hideNativeTitleBar(true);
    }
});
/*
下面是每个controller对应的业务处理函数
wRouter.controller("",function(){})
第一个参数对应wRouter.config({})里的controller
*/
wRouter.controller("index", function (args) {
    App.Statistics.sendStatistics({
        type: 'uv',
        "lang": 'cn'
    });
    App.TitleBar.showClose();
    App.Comm.require("js/app/index/App.Index.js");
    App.Index.init();
});
wRouter.controller("projects", function (args) {//第一级的项目列表
    App.Comm.require("css/projects.css");
    App.Comm.require("js/app/projects/App.Projects.js");
    App.Projects.init();
});
wRouter.controller("searchHeightPage", function (args) {//第一级的项目列表
    App.Comm.require("css/projects.css");
    App.Comm.require("js/app/projects/App.SearchHeightPage.js");
    App.SearchHeightPage.init(args);
});
wRouter.controller("project", function (args) {//项目底下的文件列表
    App.Comm.require("css/projects.css");
    App.Comm.require("js/app/projects/App.Projects.js");
    App.Comm.require("js/app/projects/App.Projects.ProjectFileList.js");
    App.Projects.ProjectFileList.init(args);
});
wRouter.controller("flow", function (args) {
    App.Comm.require("css/flow.css");
    App.Comm.require("js/app/flow/App.Flow.js");
    App.Flow.init();
});
wRouter.controller("flowList", function (args) {
    App.Comm.require("css/flow.css");
    App.Comm.require("js/app/flow/App.FlowList.js");
    App.FlowList.init(args);
});
wRouter.controller("flowTextList", function (args) {
    App.Comm.require("css/flow.css");
    App.Comm.require("js/app/flow/App.FlowTextList.js");
    App.FlowTextList.init(args);
});
wRouter.controller("flowDetailPage", function (args) {
    App.Comm.require("css/flow.css");
    App.Comm.require("js/app/flow/App.FlowDetailPage.js");
    App.FlowDetailPage.init(args);
});
wRouter.controller("glyjPage", function (args) {
    App.Comm.require("css/flow.css");
    App.Comm.require("js/app/flow/App.GlyjPage.js");
    App.GlyjPage.init(args);
});
wRouter.controller("glyjDetailPage", function (args) {
    App.Comm.require("css/flow.css");
    App.Comm.require("js/app/flow/App.GlyjDetailPage.js");
    App.GlyjDetailPage.init(args);
});
wRouter.controller("resource", function (args) {
    App.Comm.require("css/resource.css");
    App.Comm.require("js/app/resource/App.Resource.js");
    App.Resource.init();
});
wRouter.controller("resourceComList", function (args) {
    App.Comm.require("css/resource.css");
    App.Comm.require("js/app/resource/App.Resource.js");
    App.Comm.require("js/app/resource/App.Resource.List.js");
    App.Resource.List.init(args);
});
wRouter.controller("resourceModelLibraryList", function (args) {
    App.Comm.require("css/resource.css");
    App.Comm.require("js/app/resource/App.Resource.js");
    App.Comm.require("js/app/resource/App.Resource.ModelLibrary.js");
    App.Resource.ModelLibrary.init(args);
});
wRouter.controller("resourceFamilyLibraryList", function (args) {
    App.Comm.require("css/resource.css");
    App.Comm.require("js/app/resource/App.Resource.js");
    App.Comm.require("js/app/resource/App.Resource.FamilyLibrary.js");
    App.Resource.FamilyLibrary.init(args);
});
wRouter.controller("service", function (args) {
    App.Comm.require("css/service.css");
    App.Comm.require("js/app/service/App.Service.js");
    App.Service.init(args);
});
wRouter.controller("serviceRelated", function (args) {
    App.Comm.require("css/service.css");
    App.Comm.require("js/app/service/App.ServiceRelated.js");
    App.ServiceRelated.init(args);
});
wRouter.controller("serviceFeedback", function (args) {
    App.Comm.require("css/service.css");
    App.Comm.require("js/app/service/App.ServiceFeedback.js");
    App.ServiceFeedback.init(args);
});
wRouter.controller("addFeedback", function (args) {
    App.Comm.require("css/service.css");
    App.Comm.require("js/app/service/App.AddFeedback.js");
    App.AddFeedback.init(args);
});
wRouter.controller("noticeList", function (args) {//公告列表页面
    App.Comm.require("css/notice.css");
    App.Comm.require("js/app/notice/App.NoticeList.js");
    App.NoticeList.init();
});
wRouter.controller("noticeDetail", function (args) {//公告详情页面
    App.Comm.require("css/notice.css");
    App.Comm.require("js/app/notice/App.NoticeDetail.js");
    App.NoticeDetail.init(args);
});
wRouter.controller("todoList", function (args) {//待办列表页面
    App.Comm.require("css/todoList.css");
    App.Comm.require("js/app/todo/App.TodoList.js");
    App.TodoList.init();
});
wRouter.controller("viewModel", function (args) {//模型渲染
    console.log(args);
    App.Comm.require("css/model.css");
    App.Comm.require("js/app/model/App.Model.js");
    App.Model.init(args);
});
wRouter.controller("notesList", function (args) {//批注列表渲染
    App.Comm.require("css/notes.css");
    App.Comm.require("js/app/notes/App.NotesList.js");
    App.NotesList.init(args);
});
wRouter.controller("notesDetails", function (args) {//批注详情渲染
    App.Comm.require("css/notes.css");
    App.Comm.require("js/app/notes/App.NotesDetails.js");
    App.NotesDetails.init(args);
});
wRouter.controller("notesImg", function (args) {//批注查看大图渲染
    App.Comm.require("css/notes.css");
    App.Comm.require("js/app/notes/App.NotesImg.js");
    App.NotesImg.init(args);
});
wRouter.controller("notesSnapImg", function (args) {//批注列表渲染
    App.Comm.require("css/notes.css");
    App.Comm.require("js/app/notes/App.NotesSnapImg.js");
    App.NotesSnapImg.init(args);
});
wRouter.controller("addNotesComment", function (args) {//添加批注评论渲染
    App.Comm.require("css/notes.css");
    App.Comm.require("js/app/notes/App.NotesDetails.js");
    App.Comm.require("js/app/notes/App.AddNotesComment.js");
    App.AddNotesComment.init(args);
});
wRouter.controller("atUserList", function (args) {//添加批注评论@用户列表渲染
    App.Comm.require("css/notes.css");
    App.Comm.require("js/app/notes/App.AtUserList.js");
    App.AtUserList.init(args);
});
wRouter.controller("paperModel", function (args) {//dwg图纸渲染
    App.Comm.require("css/model.css");
    App.Comm.require("js/libs/jquery.mousewheel.min.js");
    App.Comm.require("js/common/dwg.js");
    App.Comm.require("js/app/model/App.PaperModel.js");
    App.PaperModel.init(args);
});
wRouter.controller("famLibsModel", function (args) {//族库模型渲染
    App.Comm.require("css/model.css");
    App.Comm.require("js/app/model/App.FamLibs.js");
    App.FamLibs.init(args);
});
wRouter.controller("deleteImgPage", function (args) {//族库模型渲染
    App.Comm.require("css/deleteImgPage.css");
    App.Comm.require("js/app/comm/App.DeleteImgPage.js");
    App.DeleteImgPage.init(args);
});
wRouter.controller("xiaowan", function () {//族库模型渲染
    App.Comm.require("js/app/service/App.XiaoWanPage.js");
    App.XiaoWanPage.init();
});
wRouter.controller("myNews", function () {//族库模型渲染
    App.Comm.require("css/myNews.css");
    App.Comm.require("js/app/service/App.MyNewsPage.js");
    App.MyNewsPage.init();
});
wRouter.controller("newsFeedBack", function (args) {//族库模型渲染
    App.Comm.require("css/newsFeedBack.css");
    App.Comm.require("js/app/service/App.NewsFeedBackPage.js");
    App.NewsFeedBackPage.init(args);
});
wRouter.endController(function (controllerName) {
    /*通过controllerName判断，来清理对应的controller*/
});

