 App.Projects = {

    _cache:[],

    _upload:"1,3,5,6",
    _delnew:"3,5,6",
    _down:"3,4,5,6,7,9",

    fromCache:function(index,key,p){
        var result=null;
        _.each(App.Projects._cache,function(item){
            if(item['id']==index){
                if(p){
                     result=item[p][key];
                }else{
                    result=item[key];
                }
            }
        })
        return result;
    },

    isAuth:function(id,op){
        var _s=this.fromCache(id,'status','version');
        if(op=='CREATE'){
            return this._delnew.indexOf(_s)!=-1;
        }
        if(op=='DELETE'){
            return this._delnew.indexOf(_s)!=-1;
        }
        if(op=='DOWN'){
            return this._down.indexOf(_s)!=-1;
        }
        if(op=='UPLOAD'){
            return this._upload.indexOf(_s)!=-1;
        }
        return true;
    },



    //项目业态
    proRetailing: {
        "8": '综合体',
        "16": '酒店',
        "32": '文化旅游',
        "64": '独立物业',
        "128": '非万影城',
        "130": '境外',
    },
    //项目类型
    projectType:['--','全标','类标','非标'],
    //项目模式
    projectModel:['--', '创新模式', '直投', '开发','合作'],
    concernsData:{
        type:['', (App.Local.data['drawing-model'].PIn1 || '过程检查'), (App.Local.data['drawing-model'].PAe1 || '过程验收'), '开业验收'],
        report:['', (App.Local.data['drawing-model'].CEr || '质监中心'), (App.Local.data['drawing-model'].TPy || '第三方'), (App.Local.data['drawing-model'].Owner || '项目公司'), (App.Local.data['drawing-model'].SIn || '监理单位')],
        //classic:['', '防水工程', '施工质量', '安全文明', '材料设备'],
        classic:['','实测实量','防水工程','施工质量','安全文明','总包内业资料','材料设备'], //add by wuweiwei
        specialty:{
            '1':'建筑',
            '2':'结构',
            '3':'设备',
            '4':'电气',
            '6':'内装',
            'def':'炼钢',
            'abc':'土建'
        }
    },
     ProjectCollection: new(Backbone.Collection.extend({
         model: Backbone.Model.extend({
             defaults: function() {
                 return {
                     url: ''
                 }
             }
         }),

         urlType: "fetchProjects",

         parse: function(response) {
             if (response.message == "success") {
                if(response.data.items && response.data.items.length){
                App.Projects._cache=response.data.items||[];
                 return response.data.items;
                }else{
                    Backbone.trigger('projectListNullData');
                    return [];
                }
             }
         }


     })),

     Settings: {
         projectId: "",
         projectName: "",
         type: "list",
         isInitMap: false,
         initBodyEvent: false,
         pageIndex: 1
     },

     init: function() {

         var $contains = $("#contains");
         //nav
         $contains.html(new App.Projects.searchView().render().$el);
         //切换列表
         $contains.append(new App.Projects.DisplayMode().render().$el);
         //显示box
         $contains.append(new App.Projects.ContentMode().render().$el);

         if (!App.Projects.Settings.initBodyEvent) {
             App.Projects.Settings.initBodyEvent = true;
             App.Projects.initBodyEvent();
         }

         App.Projects.loadData();
         App.Projects.initEvent();

         //初始化滚动条
         App.Projects.initScroll(); 

     },


     //加载数据
     loadData: function(params) {

        var _data={
             name: "",
             projectType:"", //项目类型
             estateType: "", //项目模式
             province: "", //所属省份
             region: "", //分区
             complete: "", //是否完成
             open: "", //是否开业
             openTimeStart: "", 
             openTimEnd: "",
             pageIndex: App.Projects.Settings.pageIndex,
             pageItemCount: App.Comm.Settings.pageItemCount

         };
         //初始化用户参数
         _data=$.extend({},_data,params);
         $("#projectModes .proListBox").empty(); //清空数据
         App.Projects.ProjectCollection.reset();
         App.Projects.ProjectCollection.project = "project";

         //拉取数据
         App.Projects.ProjectCollection.fetch({

             data: _data,

             success: function(collection, response, options) {
                $("#pageLoading").hide();
                 var $content = $("#projectModes"),
                     pageCount = response.data.totalItemCount;
                 const total = App.Local.getCurrentIsEn()?'':'共 ';
                 const projects = App.Local.getTranslation('system-module.projects')||'项目';
                 $content.find(".sumDesc").html(total + pageCount + ' ' +
                     projects);

                 $content.find(".listPagination").empty().pagination(pageCount, {
                     items_per_page: response.data.pageItemCount,
                     current_page: response.data.pageIndex - 1,
                     num_edge_entries: 3, //边缘页数
                     num_display_entries: 5, //主体页数
                     link_to: 'javascript:void(0);',
                     itemCallback: function(pageIndex) {
                         //加载数据
                         App.Projects.Settings.pageIndex = pageIndex + 1;
                         App.Projects.onlyLoadData(params);
                     },
                     prev_text: (App.Local.data['system-module'].Back || "上一页"),
                     next_text: (App.Local.data['source-model'].nt || "下一页")

                 });
             }

         });
     },

     //只是加载数据
     onlyLoadData: function(params) {
        var _data= {
             pageIndex: App.Projects.Settings.pageIndex,
             pageItemCount: App.Comm.Settings.pageItemCount,
             name: "",
             estateType: "",
             province: "",
             region: "",
             complete: "",
             open: "",
             openTimeStart: "",
             openTimEnd: ""
         }
         App.Projects.ProjectCollection.reset();
         App.Projects.ProjectCollection.fetch({
             data:$.extend({},_data,params)
         });
     },


     initEvent: function() {
         //日期控件初始化
         $('#dateStar').datetimepicker({
             language: App.Local.getTimeLang(),
             autoclose: true,
             format: 'yyyy-mm-dd',
             minView: 'month'

         });
         $('#dateEnd').datetimepicker({
             language: App.Local.getTimeLang(),
             autoclose: true,
             format: 'yyyy-mm-dd',
             minView: 'month'

         });

         $(".dateBox .iconCal").click(function() {
             $(this).next().focus();
         });
         //单选
         // $(".groupRadio").myRadioCk();
         // $(".groupRadio2").myRadioCk();
     },



     //初始化滚动条
     initScroll: function() {
         $("#projectModes").find(".proListBoxScroll").mCustomScrollbar({
             set_height: "100%",
             theme: 'minimal-dark',
             axis: 'y',
             keyboard: {
                 enable: true
             },
             scrollInertia: 0
         });

         $("#projectModes").find(".proMapScroll").mCustomScrollbar({
             set_height: "100%",
             theme: 'minimal-dark',
             axis: 'y',
             keyboard: {
                 enable: true
             },
             scrollInertia: 0
         });
     },

     initBodyEvent: function() {
         $("body").on("click", function(event) {
             var $target = $(event.target);
             if ($target.closest("#mapProjects").length <= 0 && $target.closest(".BMap_Marker").length <= 0) {
                 $("#mapProjects").remove();
             }
         });
     },

     fetch: function() {

         //清空数据
         App.Projects.ProjectCollection.models = [];

         if (App.Projects.Settings.type == "list") {
             $("#projectModes").find(".proListBox").show().find(".item").remove().end().end().find(".proMapBox").hide();

             var projectArr = [];

             for (var i = 0; i < 10; i++) {
                 projectArr.push({
                     url: '/projects/images/proDefault.png',
                     projectName: "项目" + (+new Date()),
                     projectAddress: '上海',
                     projectStar: '2015-5-9',
                     projectEnd: '2016-9-6',
                     projectID: i
                 });
             }

             App.Projects.ProjectCollection.add(projectArr);

         } else {
             $("#projectModes").find(".proListBox").hide().end().find(".proMapBox").show();

             //初始化地图
             //App.Projects.BaiduMap.initMap();

             //map.centerAndZoom(point, 15);
         }

     }

 };


 //地图配置
 App.Projects.BaiduMap = {

     Settings: {
         defaultZoom: 6,
         MarkerArr: []
     },

     initMap: function() {

         App.Projects.BaiduMap.Settings.defaultZoom = 6;
         //地图
         // 百度地图API功能
         var map = new BMap.Map("container"); // 创建Map实例 
         map.centerAndZoom(new BMap.Point(116.404, 37.915), 5); // 初始化地图,设置中心点坐标和地图级别
         //var potitionControl = new App.Projects.BaiduMap.potitionControl();
         //map.addControl(potitionControl); // 添加到地图当中
         //map.addControl(new BMap.ScaleControl()); //添加地图类型控件

         map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
         map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

         App.Projects.BaiduMap.addProjectPoints(map, 5);

         //缩放事件
         map.addEventListener("zoomend", function() {

             //App.Projects.BaiduMap.addProjectPoints(map,this.getZoom()); 
         });

     },

     addProjectPoints: function(map, zoom) {

         var mapSettings = App.Projects.BaiduMap.Settings;

         if (mapSettings.defaultZoom < 6 && zoom > 5) {

             var markCount = mapSettings.MarkerArr.length;
             //释放上一次的
             for (var i = 0; i < markCount; i++) {
                 map.removeOverlay(mapSettings.MarkerArr[i]);
             }
             //清空marke
             mapSettings.MarkerArr.length = 0;
             for (var i = 0; i < 15; i++) {
                 var point = new BMap.Point(116.404 + i, 39.915 + i);
                 var marker = new BMap.Marker(point, zoom); // 创建标注
                 marker.addEventListener("click", function() {
                     //项目详情
                     App.Projects.BaiduMap.showMapProject(arguments);
                 });
                 map.addOverlay(marker);

                 mapSettings.MarkerArr.push(marker);
             }

         } else if (mapSettings.defaultZoom >= 6 && zoom < 6) {
             var markCount = mapSettings.MarkerArr.length;
             //释放上一次的
             for (var i = 0; i < markCount; i++) {
                 map.removeOverlay(mapSettings.MarkerArr[i]);
             }
             //清空marke
             mapSettings.MarkerArr.length = 0;

             for (var i = 0; i < 5; i++) {
                 var point = new BMap.Point(116.404 + i, 39.915 + i);
                 var marker = new BMap.Marker(point, zoom); // 创建标注  
                 marker.addEventListener("click", function() {

                     //项目详情
                     App.Projects.BaiduMap.showMapProject(arguments);
                 });
                 map.addOverlay(marker);

                 mapSettings.MarkerArr.push(marker);
             }
         }

         mapSettings.defaultZoom = zoom;

     },

     showMapProject: function() {

         $("#mapProjects").remove();

         var event = arguments[0][0],
             offsetX = event.clientX,
             offsetY = event.clientY;

         var temp = _.templateUrl('/projects/tpls/project.map.list.html');


         $("body").append(temp({}));

         $("#mapProjects").css({
             'top': offsetY,
             'left': offsetX
         });

     },


     // 定义一个控件类，即function   
     initControl: function() {

         App.Projects.BaiduMap.potitionControl = function() {
             // 设置默认停靠位置和偏移量  
             this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
             this.defaultOffset = new BMap.Size(10, 10);
         }

         // 通过JavaScript的prototype属性继承于BMap.Control   
         App.Projects.BaiduMap.potitionControl.prototype = new BMap.Control();

         // 自定义控件必须实现initialize方法，并且将控件的DOM元素返回   
         // 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中   
         App.Projects.BaiduMap.potitionControl.prototype.initialize = function(map) {

             var $div = $('<div class="potitionControl"/>');

             $div.on("click", function() {

             });

             // 添加DOM元素到地图中   
             map.getContainer().appendChild($div[0]);

             return $div[0];
         }

     }


 }