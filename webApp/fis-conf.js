// //清除其他配置，只剩下如下配置
// fis.match('*.{js,css,png}', {
//   useHash: true
// });


// // 清除其他配置，只保留如下配置
// fis.match('*.js', {
//   // fis-optimizer-uglify-js 插件进行压缩，已内置
//   optimizer: fis.plugin('uglify-js')
// });

// fis.match('*.css', {
//   // fis-optimizer-clean-css 插件进行压缩，已内置
//   optimizer: fis.plugin('clean-css')
// });

// 加 md5
// fis.match('*.{js,css,png}', {
//   useHash: true
// });


//npm install -g fis-parser-less
//npm install -g fis3-postpackager-loader



var v = 20160313;

fis.set('project.md5Length', 7);
fis.set('project.md5Connector ', '_');


fis.match('::package', {
  postpackager: fis.plugin('loader')
});

// less 文件处理
fis.match('*.less', {
  release: "/static/dist/$0",
  //useHash: true,
  parser: fis.plugin('less'),
  rExt: '.css'
});


//es6 编译
fis.match('*.es6', {
  release: "/static/dist/$0",
  //useHash: true,
  parser: fis.plugin('babel-6.x'),
  rExt: 'js'
});
fis.match('editer/**', {
  release: "/static/dist/$0",
});

fis.match('**.{gif,png,jpg}', {
  //useHash:true,
  release: "/static/dist/images/$0"
});

fis.match('**.exe', {
  //useHash:true,
  release: "/static/dist/$0"
});
fis.match('**.docx', {
  //useHash:true,
  release: "/static/dist/$0"
});

fis.match('comm/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('console/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('console1/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
// 服务
fis.match('/services/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/services/services.js'
});
fis.match('/static/dist/services/services.js', {
  //useHash: true,
  release: '/static/dist/services/services.js'
});
fis.match('/services/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/services/services.css'
});
fis.match('/static/dist/services/services.css', {
  //useHash: true,
  release: '/static/dist/services/services.css'
});
//userAdmin用户管理页面
fis.match('userAdmin/tpls/**.html', {
  release: "/static/dist/tpls/$0"
});
//backStage 后台管理页面
fis.match('backStage/tpls/**.html', {
  release: "/static/dist/tpls/$0"
});
//首页主体
fis.match('bodyContent/tpls/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('flow/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('flow/tpls/down/BIM总发包操作手册.zip', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('flow/tpls/down/模型及图纸目录地图.xlsx', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('flow/tpls/text_images/**.png', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});

fis.match('libs/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('libsH5/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('login/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('login/down/BIM演示系统账号申请表.docx',{
  //useHash:true,static/dist/login/down/BIM演示系统账号申请表.docx
  release: "/static/dist/$0"
});
fis.match('projects/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('todo/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('notice/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('imbox/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('suggest/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('app/**.html', {
  //useHash:true,
  release: "/static/dist/$0"
});
fis.match('app/**/tpls/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});
fis.match('resources/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});

fis.match('services/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});

// fis.match('page/tpls/**.html', {
//   //useHash:true,
//   release: "/static/dist/tpls/$0"
// });
// fis.match('page/**.html', {
//   //useHash:true,
//   release: "/static/dist/tpls/$0"
// });
// 视频会议地址输出
fis.match('videoMeeting/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});

//首页主体
fis.match('components/inspectSelection/tpls/**.html', {
  //useHash:true,
  release: "/static/dist/tpls/$0"
});

fis.match('**.{otf,eot,svg,ttf,woff}', {
  //useHash:true,
  release: "/static/dist/comm/$0"
});

fis.match('/comm/**.swf', {
  //useHash:true,
  release: "/static/dist/swf/$0"
});
fis.match('/comm/js/comm.i18n.es6', {
  packOrder: -150
})

fis.match('/libs/underscore.1.8.2.js', {
  packOrder: -160
})
fis.match('/components/inspectSelectionNew/libs/underscore.1.8.2.js', {
  packOrder: -160
})
//合并裤文件
fis.match('/libs/**.js', {
  packTo: '/static/dist/libs/commLib.js'
});

fis.match('/static/dist/libs/commLib.js', {
  release: '/static/dist/libs/commLib.js'
});
fis.match('/libs/**.css', {
  packTo: '/static/dist/libs/commLibCss.css'
});
fis.match('/static/dist/libs/commLibCss.css', {
  release: '/static/dist/libs/commLibCss.css'
});


//合并裤文件
// fis.match('/libsH5/**.{js,es6}', {
//   //packTo: '/static/dist/libs/libsH5_'+v+'.js'
//   packTo: '/static/dist/libs/libsH5_oldversion.js'
// });
// fis.match('/libsH5/**.{js,es6}', {
//   release: '/static/dist/libs/libsH5_oldversion.js'
// });


fis.match('/libsH5/**.{less,css}', {
  packTo: '/static/dist/libs/libsH5_'+v+'.css'
});
fis.match('/libs/jquery-i18next-master/i18n-en.less', {
    packTo: '/static/dist/libs/i18n-en.css'
});
//fis.match('/static/dist/libs/libsH5.css', {
//  useHash:true,
//  release: '/static/dist/libs/libsH5.css'
//});

//合并公共样式文件
fis.match('/comm/**.{less,css}', {
  useHash: false,
  packTo: '/static/dist/comm/comm_'+v+'.css'
});

//fis.match('/static/dist/comm/comm.css', {
//  useHash:true,
//  release: '/static/dist/comm/comm.css'
//});
fis.match('/comm/js/comm.es6', {
  packOrder: -100
})
fis.match('/libs/plupload/plupload.js', {
  packOrder: -100
})
//合并公共文件
fis.match('/comm/**.{js,es6}', {
  useHash: false,
  //useHash:true,
  packTo: '/static/dist/comm/comm_'+v+'.js'
});




//合并公共样式文件

fis.match('/commH5/**.{less,css}', {
  useHash: false,
  packTo: '/static/dist/comm/commH5.css'
});

fis.match('/static/dist/comm/commH5.css', {
  //useHash:true,
  release: '/static/dist/comm/commH5.css'
});

//合并公共文件

fis.match('/commH5/**.{js,es6}', {
  useHash: false,
  //useHash:true,
  packTo: '/static/dist/commH5/commH5.js'
});
fis.match('/static/dist/commH5/commH5.js', {
  //useHash:true,
  release: '/static/dist/commH5/commH5.js'
});
//添加用户管理页面
fis.match('/userAdmin/**.{js,es6}', {
  packTo: '/static/dist/userAdmin/userAdmin.js'
});
fis.match('/static/dist/userAdmin/userAdmin.js', {
  //useHash:true,
  release: '/static/dist/userAdmin/userAdmin.js'
});
fis.match('/userAdmin/**.{css,less}', {
  packTo: '/static/dist/userAdmin/userAdmin.css'
});
fis.match('/static/dist/userAdmin/userAdmin.css', {
  //useHash:true,
  release: '/static/dist/userAdmin/userAdmin.css'
});
//backStage 后台管理页面
fis.match('/backStage/**.{js,es6}', {
  packTo: '/static/dist/backStage/backStage.js'
});
fis.match('/static/dist/backStage/backStage.js', {
  //useHash:true,
  release: '/static/dist/backStage/backStage.js'
});
fis.match('/backStage/**.{css,less}', {
  packTo: '/static/dist/backStage/backStage.css'
});
fis.match('/static/dist/backStage/backStage.css', {
  //useHash:true,
  release: '/static/dist/backStage/backStage.css'
});
//bodyContent
fis.match('/bodyContent/**.{less,css}', {
  //useHash: false,
  packTo: '/static/dist/bodyContent/bodyContent.css'
});

fis.match('/static/dist/bodyContent/bodyContent.css', {
  //useHash:true,
  release: '/static/dist/bodyContent/bodyContent.css'
});


fis.match('/bodyContent/js/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/bodyContent/bodyContent.js'
});

fis.match('/static/dist/bodyContent/bodyContent.js', {
  //useHash:true,
  release: '/static/dist/bodyContent/bodyContent.js'
});


// 代办
fis.match('/login/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/login/login.js'
});

fis.match('/static/dist/login/login.js', {
  //useHash:true,
  release: '/static/dist/login/login.js'
});

fis.match('/login/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/login/login.css'
});

fis.match('/static/dist/login/login.css', {
  //useHash:true,
  release: '/static/dist/login/login.css'
});

fis.match('/libs/jquery/jquery-1.12.0.min.js', {
  //useHash:true,
  packTo: '/static/dist/login/jquery-1.12.0.min.js'
});
fis.match('/libs/jquery/underscore.1.8.2.js', {
  //useHash:true,
  packTo: '/static/dist/login/underscore.1.8.2.js'
});

// 代办
fis.match('/todo/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/todo/todo.js'
});
fis.match('/static/dist/todo/todo.js', {
  //useHash:true,
  release: '/static/dist/todo/todo.js'
});
fis.match('/todo/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/todo/todo.css'
});
fis.match('/static/dist/todo/todo.css', {
  //useHash:true,
  release: '/static/dist/todo/todo.css'
});
// 公告
fis.match('/notice/collection/index.es6', {
  packOrder: -10
})

fis.match('/notice/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/notice/notice.js'
});
fis.match('/static/dist/notice/notice.js', {
  //useHash:true,
  release: '/static/dist/notice/notice.js'
});
fis.match('/notice/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/notice/notice.css'
});
fis.match('/static/dist/notice/notice.css', {
  //useHash:true,
  release: '/static/dist/notice/notice.css'
});
// 消息中心
fis.match('/imbox/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/imbox/imbox.js'
});
fis.match('/imbox/collections/index.es6', {
  packOrder: -110
})
fis.match('/imbox/views/nav.js', {
  packOrder: -100
})
fis.match('/static/dist/imbox/imbox.js', {
  //useHash:true,
  release: '/static/dist/imbox/imbox.js'
});
fis.match('/imbox/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/imbox/imbox.css'
});
fis.match('/static/dist/imbox/imbox.css', {
  //useHash:true,
  release: '/static/dist/imbox/imbox.css'
});

//建议反馈
fis.match('/suggest/collections/index.es6', {
  packOrder: -100
})
fis.match('/feedBackAdmin/views/Profile.es6', {
  release: '/static/dist/suggest/Profile.js'
});
fis.match('/feedBackAdmin/less/profile.less', {
  release: '/static/dist/suggest/Profile.css'
});
fis.match('/suggest/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/suggest/suggest.js'
});
fis.match('/static/dist/suggest/suggest.js', {
  //useHash:true,
  release: '/static/dist/suggest/suggest.js'
});
fis.match('/suggest/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/suggest/suggest.css'
});
fis.match('/static/dist/suggest/suggest.css', {
  //useHash:true,
  release: '/static/dist/suggest/suggest.css'
});

fis.match('/router/**.{js,es6}', {
  //useHash:true,
  //packTo: '/static/dist/$0'
  release: '/static/dist/$0'
});

fis.match('/api/**.{es6,js}', {
  //useHash:true,
  packTo: '/static/dist/api/api.js'
});
fis.match('/static/dist/api/api.js', {
  //useHash:true,
  release: '/static/dist/api/api.js'
});

// 资源库
fis.match('/resources/collection/resource.model.es6', {
  packOrder: -10
})
fis.match('/resources/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/resources/resources.js'
});
fis.match('/static/dist/resources/resources.js', {
  //useHash:true,
  release: '/static/dist/resources/resources.js'
});
fis.match('/resources/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/resources/resources.css'
});
fis.match('/static/dist/resources/resources.css', {
  //useHash:true,
  release: '/static/dist/resources/resources.css'
});
//合并裤文件
fis.match('/console/**.{js,es6}', {

  packTo: '/static/dist/console/console.js'
});
fis.match('/static/dist/console/console.js', {
  //useHash:true,
  release: '/static/dist/console/console.js'
});
fis.match('/console/**.{css,less}', {

  packTo: '/static/dist/console/console.css'
});
fis.match('/static/dist/console/console.css', {
  //useHash:true,
  release: '/static/dist/console/console.css'
});
fis.match('/console1/**.{js,es6}', {

  packTo: '/static/dist/console1/console.js'
});
fis.match('/static/dist/console1/console.js', {
  //useHash:true,
  release: '/static/dist/console1/console.js'
});
fis.match('/console1/**.{css,less}', {

  packTo: '/static/dist/console1/console.css'
});
fis.match('/static/dist/console1/console.css', {
  //useHash:true,
  release: '/static/dist/console1/console.css'
});

//项目
fis.match('/projects/**.{less,css}', {
  //useHash: false,
  packTo: '/static/dist/projects/projects.css'
});
fis.match('/static/dist/projects/projects.css', {
  //useHash: true,
  release: '/static/dist/projects/projects.css'
});
fis.match('/projects/**.{js,es6}', {
  //useHash: false,
  //useHash:true,
  packTo: '/static/dist/projects/projects.js'
});
fis.match('/static/dist/projects/projects.js', {
  //useHash: true,
  release: '/static/dist/projects/projects.js'
});

//start 建议反馈
fis.match('feedBackAdmin/**.html', {
  release: "/static/dist/tpls/$0"
});
fis.match('/feedBackAdmin/**.{less,css}', {
  packTo: '/static/dist/feedBackAdmin/feedBackAdmin.css'
});
fis.match('/static/dist/feedBackAdmin/feedBackAdmin.css', {
  release: '/static/dist/feedBackAdmin/feedBackAdmin.css'
});

fis.match('/feedBackAdmin/**.{js,es6}', {
  packTo: '/static/dist/feedBackAdmin/feedBackAdmin.js'
});
fis.match('/static/dist/feedBackAdmin/feedBackAdmin.js', {
  release: '/static/dist/feedBackAdmin/feedBackAdmin.js'
});
//end 建议反馈
// 流程
fis.match('/flow/**.{js,es6}', {
  //useHash:true,
  packTo: '/static/dist/flow/flow.js'
});
fis.match('/static/dist/flow/flow.js', {
  //useHash: true,
  release: '/static/dist/flow/flow.js'
});
fis.match('/flow/**.{less,css}', {
  //useHash:true,
  packTo: '/static/dist/flow/flow.css'
});
fis.match('/static/dist/flow/flow.css', {
  //useHash: true,
  release: '/static/dist/flow/flow.css'
});


//文件选择组件 配置

fis.match('/components/fileSelection/index.html',{
  release: '/static/dist/components/fileSelection/index.html'
});
fis.match('/components/fileSelection/libs/**.{js,es6}',{
  packTo: '/static/dist/components/fileSelection/libs/libs_'+v+'.js'
});
//fis.match('/static/dist/components/fileSelection/libs/libs.js', {
//  useHash: true,
//  release: '/static/dist/components/fileSelection/libs/libs.js'
//});
fis.match('/components/fileSelection/**.{less,css}',{
  packTo: '/static/dist/components/fileSelection/css/fileSelection.css'
});
//fis.match('/static/dist/components/fileSelection/css/fileSelection.css', {
//  useHash: true,
//  release: '/static/dist/components/fileSelection/css/fileSelection.css'
//});
fis.match('/components/fileSelection/es6/**.{es6,js}',{
  packTo: '/static/dist/components/fileSelection/js/fileSelection.js'
});
//fis.match('/static/dist/components/fileSelection/js/fileSelection.js', {
//  useHash: true,
//  release: '/static/dist/components/fileSelection/js/fileSelection.js'
//});


//模型 \modelSelection
fis.match('/components/modelSelection/index.html',{
  release: '/static/dist/components/modelSelection/index.html'
});
fis.match('/components/modelSelection/single.html',{
  release: '/static/dist/components/modelSelection/single.html'
});

fis.match('/components/modelSelection/model.html',{
  release: '/static/dist/components/modelSelection/model.html'
});

fis.match('/components/modelSelection/**.{js,es6}',{
  packTo: '/static/dist/components/modelSelection/js/modelSelection.js'
});
//fis.match('/static/dist/components/modelSelection/js/modelSelection.js', {
//  useHash: true,
//  release: '/static/dist/components/modelSelection/js/modelSelection.js'
//});


//模型
fis.match('/components/inspectSelection/index.html',{
  release: '/static/dist/components/inspectSelection/index.html'
});
fis.match('/components/inspectSelection/model.html',{
  release: '/static/dist/components/inspectSelection/model.html'
});

fis.match('/components/inspectSelection/**.{css,less}',{
  packTo: '/static/dist/components/inspectSelection/css/inspectSelection.css'
});

fis.match('/components/inspectSelection/**.{js,es6}',{
  packTo: '/static/dist/components/inspectSelection/js/inspectSelection.js'
});
//新模型
fis.match('/components/inspectSelectionNew/index.html',{
  release: '/static/dist/components/inspectSelectionNew/index.html'
});
fis.match('/components/inspectSelectionNew/model.html',{
  release: '/static/dist/components/inspectSelectionNew/model.html'
});

fis.match('/components/inspectSelectionNew/**.{css,less}',{
  packTo: '/static/dist/components/inspectSelectionNew/css/inspectSelection.css'
});

fis.match('/components/inspectSelectionNew/**.{js,es6}',{
  packTo: '/static/dist/components/inspectSelectionNew/js/inspectSelection.js'
});


//设备模型组件
fis.match('/components/device/index.html',{
  release: '/static/dist/components/device/index.html'
});
fis.match('/components/device/modal.html',{
  release: '/static/dist/components/device/modal.html'
});

fis.match('/components/device/**.{css,less}',{
  packTo: '/static/dist/components/device/css/device.css'
});
fis.match('/components/device/libs/underscore.1.8.2.js', {
  packOrder: -160
})
fis.match('/BIMperformance/projects/views/project/project.container.es6', {
  packOrder: -100
})
fis.match('/BIMperformance/libsH5/js/bimView.prototype.es6', {
  packOrder: -90
})
fis.match('/BIMperformance/libsH5/js/comm.js', {
  packOrder: -10
})
fis.match('/components/device/**.{js,es6}',{
  packTo: '/static/dist/components/device/js/device.js'
});
//模型 \checkpoints
//fis.match('/components/checkpoints/index.html',{
//  release: '/static/dist/components/checkpoints/index.html'
//});
//fis.match('/components/checkpoints/libs/**.{js,es6}',{
//  packTo: '/static/dist/components/checkpoints/libs/libs.js'
//});
//fis.match('/components/checkpoints/js/**.{js,es6}',{
//  packTo: '/static/dist/components/checkpoints/js/checkpoints.js'
//});
//fis.match('/components/checkpoints/less/**.{css,less}', {
//  packTo: '/static/dist/components/checkpoints/less/index.css'
//});
//
////模型 \concerns
//fis.match('/components/concerns/index.html',{
//  release: '/static/dist/components/concerns/index.html'
//});
//fis.match('/components/concerns/libs/**.{js,es6}',{
//  packTo: '/static/dist/components/concerns/libs/libs.js'
//});
//fis.match('/components/concerns/js/**.{js,es6}',{
//  packTo: '/static/dist/components/concerns/js/concerns.js'
//});
//fis.match('/components/concerns/less/**.{css,less}', {
//  packTo: '/static/dist/components/concerns/less/index.css'
//});
//fis.match('/components/concerns/tpls/concerns.body.html', {
//  //useHash:true,
//  release: "/static/dist/components/concerns/concerns.body.html"
//});

//模型 \points
fis.match('/components/points/index.html',{
  release: '/static/dist/components/points/index.html'
});
fis.match('/components/points/tip.html',{
  release: '/static/dist/components/points/tip.html'
});
fis.match('/components/points/libs/**.{js,es6}',{
  packTo: '/static/dist/components/points/libs/libs.js'
});
fis.match('/components/points/js/points.es6', {
  useHash: false,
  release: '/static/dist/components/points/js/points.js'
});
fis.match('/components/points/less/**.{css,less}', {
  packTo: '/static/dist/components/points/less/index.css'
});
//fis.match('/static/dist/components/points/less/index.css', {
//  useHash: true,
//  release: '/static/dist/components/points/less/index.css'
//});
fis.match('/components/points/tpls/points.body.html', {
  //useHash:true,
  release: "/static/dist/components/points/points.body.html"
});
// 项


// 项目预览

fis.match('/app/project/single/**.{js,es6}', {
  packTo: '/static/dist/app/project/single/project.js'
});
fis.match('/static/dist/app/project/single/project.js', {
  //useHash: true,
  release: '/static/dist/app/project/single/project.js'
});
fis.match('/app/project/single/**.{css,less}', {
  packTo: '/static/dist/app/project/single/project.css'
});
fis.match('/static/dist/app/project/single/project.css', {
  //useHash: true,
  release: '/static/dist/app/project/single/project.css'
});
fis.match('/app/project/modelChange/**.{js,es6}', {
  packTo: '/static/dist/app/project/modelChange/index.js'
});
fis.match('/static/dist/app/project/modelChange/index.js', {
  //useHash: true,
  release: '/static/dist/app/project/modelChange/index.js'
});
fis.match('/app/project/modelChange/**.{css,less}', {
  packTo: '/static/dist/app/project/modelChange/index.css'
});
fis.match('/static/dist/app/project/modelChange/index.css', {
  //useHash: true,
  release: '/static/dist/app/project/modelChange/index.css'
});
fis.match('/app/project/projectChange/**.{js,es6}', {
  packTo: '/static/dist/app/project/projectChange/index.js'
});
fis.match('/static/dist/app/project/projectChange/index.js', {
  //useHash: true,
  release: '/static/dist/app/project/projectChange/index.js'
});
fis.match('/app/project/projectChange/**.{css,less}', {
  packTo: '/static/dist/app/project/projectChange/index.css'
});
fis.match('/static/dist/app/project/projectChange/index.css', {
  //useHash: true,
  release: '/static/dist/app/project/projectChange/index.css'
});

//单独
fis.match('/js/**.js', {
  //useHash:true,
  release: "/static/dist/$0"
});



// 清除其他配置，只保留如下配置
fis.media("prod").match('*.{js,es6}', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.media('prod').match('*.{css,less}', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.media('prod').match('*.{png,jpg,gif}', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

//质检系统 隐患填报模拟
fis.match('qualityFill/tpls/qualityFill.html', {
  release: "/static/dist/qualityFill/qualityFill.html"
});
fis.match('qualityFill/tpls/qualityFill2.html', {
  release: "/static/dist/qualityFill/qualityFill2.html"
});
fis.match('qualityFill/tpls/quality.html', {
  release: "/static/dist/qualityFill/quality.html"
});
fis.match('qualityFill/tpls/qualityModify.html', {
  release: "/static/dist/qualityFill/qualityModify.html"
});
fis.match('qualityFill/tpls/DemoTest.html', {
  release: "/static/dist/qualityFill/DemoTest.html"
});
fis.match('/qualityFill/js/template.min.js', {
  packTo: '/static/dist/qualityFill/js/template.min.js'
});
fis.match('/qualityFill/js/wDialog.min.js', {
  packTo: '/static/dist/qualityFill/js/wDialog.min.js'
});
fis.match('/qualityFill/js/jquery.jedate.js', {
  packTo: '/static/dist/qualityFill/js/jquery.jedate.js'
});
fis.match('/qualityFill/js/zebra_datepicker.js', {
  packTo: '/static/dist/qualityFill/js/zebra_datepicker.js'
});
fis.match('/qualityFill/css/**.css', {
  packTo: '/static/dist/qualityFill/css/quality.css'
});


//topNav.css,js
fis.match('/topNav/css/**.less', {
  packTo: '/static/dist/topNav/css/topNav.css'
});
fis.match('/static/dist/topNav/css/topNav.css', {
  release: '/static/dist/topNav/css/topNav.css'
});
fis.match('/topNav/js/**.es6', {
  packTo: '/static/dist/topNav/js/topNav.js'
});
fis.match('/static/dist/topNav/js/topNav.js', {
  release: '/static/dist/topNav/js/topNav.js'
});

//视频会议
fis.match('/meeting/**.{js,es6}', {
  packTo: '/static/dist/meeting/meeting.js'
});
fis.match('/static/dist/meeting/meeting.js', {
  release: '/static/dist/meeting/meeting.js'
});
fis.match('/meeting/**.html', {
  release: "/static/dist/tpls/$0"
});





fis.match('/BIMperformance/libsH5/**.{js,es6}', {
  packTo: '/static/dist/libs/libsH5.js'
});


/*end*/

fis.match('/BIMperformance/projects/**.{less,css}', {
  packTo: '/static/dist/BIMperformance/projects.css'
});
fis.match('/static/dist/BIMperformance/projects.css', {
  release: '/static/dist/BIMperformance/projects.css'
});

fis.match('/BIMperformance/projects/**.{js,es6}', {
  packTo: '/static/dist/BIMperformance/projects.js'
});
fis.match('/static/dist/BIMperformance/projects.js', {
  release: '/static/dist/BIMperformance/projects.js'
});
//commNew文件夹只是被
fis.match('/commNew/**.{js,es6}', {
  packTo: '/static/dist/commNew/commNew.js'
});
fis.match('/static/dist/commNew/commNew.js', {
  release: '/static/dist/commNew/commNew.js'
});
fis.match('/comm/js/comm.i18n.es6', {
    release: '/static/dist/comm.i18n.js'
});
fis.match('/libs/jquery-i18next-master/*.js', {
    release: '/static/dist/jquery-i18next.js'
});
//  fis.match('**.html', {
//   //useHash:true,
//   release:"/dist/$0"
// });

/*
 fis.media('debug').match('*.{js,css,png}', {
 useHash: false,
 useSprite: false,
 optimizer: null
 })

 */
