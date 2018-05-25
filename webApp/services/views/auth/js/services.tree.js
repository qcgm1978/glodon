/*
 * @require  /services/views/auth/member/services.member.list.js
 * */
App.Services.tree = function(data){

    var ele  = $("<ul></ul>");
    for(var i =0 ; i < data.data.org.length ; i++){
        var model = Backbone.Model.extend({
            defaults:function(){
                return{
                    title:''
                }
            }
        });
        var initModel = new model(data.data.org[i]);
        var li = $("<li></li>");//document.createElement("li")
        li.append(new App.Services.MemberozDetail({model:initModel}).render().el);
        li.append("<div class='childOz' id='childOz"+initModel.cid +"'></div>");
        ele.append(li);
        App.Comm.initScroll($("#ozList"),"y");
    }
    return ele;
};
//��ȡ������֯�б�
App.Services.memOz = '';
App.Services.searchOrg = function (pre){
        var text = App.Services.memOz;
        var father = pre.closest(".childOz").siblings("div").find(".ozName");//����Ķ���ڵ�
        var li = father.closest("ul").closest("li");
        if(!li.length){return}
        var span = father.find("span");
        App.Services.memOz = span.html()  + " > "  + text;
        return App.Services.searchOrg(span);
    };

//���й���
App.Services.queue = {
    que : [],
    permit : true,
    present : [],
    //���֤���ţ�400ms�󷢷�һ�����֤������������
    certificates:function(){
        this.permit = true;
        //setTimeout(function(){
        //    App.Services.queue.permit = true;
        //},400);
    },
    //��֤����������ִ�к���
    promise:function(fn,_this){
        if(!this.permit){ return;}
        if(!this.que.length){//û��ֱ�����
            this.que.push(fn);
            this.present.push(_this);
            this.que[0]();
            this.certificates();
            return;
        }
        /*if(this.que.length > 1){
            return
        }*/
        this.present.push(_this);
        this.que.push(fn);
        this.certificates();
    },
    stop:function(){},
    //ִ����ϣ�ˢ�¶��У�ִ����һ��
    next:function(){
        this.que.shift();
        this.present.shift();
        if(this.que.length){
            this.que[0]();
        }
    }
};
//��Ա-��ɫ-��ʾ��Ϣ
App.Services.showAll = function(ele){
    $(".servicesShowAll").remove();
    var tip = $("<div class='servicesShowAll'></div>");
    var content = $(ele).html();
    var offset = $(ele).offset();
    tip.html(content);
    $("body").append(tip);
    var height = $(".servicesShowAll").height();
    var leaveHeight = $("body").height() - offset.top;
    if (leaveHeight < height + $(ele).height()){
        offset.top = offset.top - height - 6;
        tip.addClass("up");
    }else{
        offset.top = offset.top + $(ele).height()+3;
        tip.addClass("down");
    }
    offset.left =  offset.left - 5;
    tip.offset(offset);

    $(".servicesShowAll").on("mouseover",function(e){
        $(".servicesShowAll").remove();
    });
};
//���...����
App.Services.exetor = function(_this){
    var cwidth,span;
    if(_this.model){
        cwidth = _this.$(".roles").width();
        span = _this.$(".roles span");
    }else{
        cwidth = _this.find(".roles").width();
        span = _this.find(".roles span");
    }
    var arr = [],inherit = "";
    _.each(span,function(item){
        arr.push($(item).width() + parseInt($(item).css("padding-left")) + parseInt($(item).css("margin-left")));
    });
    if(arr.length){
        var allWidth = 0 , n = null;
        for(var i = 0 ; i < arr.length ; i ++){
            allWidth  = allWidth + arr[i];
        }
        if(allWidth > cwidth && !_this.$(".roles i").length){
            if(span.eq(n-1).hasClass("inherit")){
                inherit = "inherit";
            }
            var is = $("<i class='"+ inherit +"' style='width: 15px'>...</i>");
            span.eq(n).before(is);
        }
    }
};
//ʹ�ã������б�
//App.Services.createNode.init
//App.Services.createNode.trigger(arr,includeUsers);
App.Services.memSearchParentOz = {
    reset:function(){
        this.count = null;
        this.countLen = 0;
        this.arr = [];
    },
    count : null,
    countLen : 0,
    arr:[],
    id:'',
    trigger :function(arr,includeUsers){
        var _this = this,preOg = null,container; //Ҫд���Ԫ��
        if(this.countLen == 0 || this.countLen == 1){
            container = _.filter($(".ozName"),function(item){
                return $(item).attr("data-id") == arr[arr.length-1].id
            });
        }else{
            container = _.filter($(".ozName"),function(item){
                return $(item).attr("data-id") == arr[_this.count].id
            });
        }
        /*container = _.filter($(".ozName"),function(item){
            return $(item).attr("data-id") == arr[_this.count].id
        });*/
        if(_this.count == 0){
            $("#ozList").removeClass("services_loading");
            includeUsers = true;
            $(container[0]).click();
            Backbone.trigger("serviceMemberSearchSelect",App.Services.memSearchParentOz.id);
            this.reset();
            return
        }
        var urlStr = "";
        if(_this.count < arr.length - 1){
            urlStr = App.API.URL.fetchServicesMemberList+ "outer="+ arr[_this.count].outer + "&parentId=" + arr[_this.count].id  + "&includeUsers=" + includeUsers;
        }else{
            urlStr = App.API.URL.fetchServicesMemberList+ "outer="+ arr[_this.count].outer + "&includeUsers=" + includeUsers;
        }
        $.ajax({
            url:urlStr,
            type:'GET',
            data : '',
            success:function(res){
                //Ҫ�ж����ⲿ�����ڲ���Ҫ���ҵ�ǰ����֯id�������뵽��Ӧ��λ��
                if(res.data.org && res.data.org.length){
                    var tree = App.Services.tree(res);
                    if(_this.count == arr.length - 1){   //�Ƕ�����֯����Ԫ�ص���inner��outer������Ƕ�������˲���id��ͬ��Ψһ��֯
                        if(!arr[_this.count].outer){
                            preOg = $("#inner").siblings(".childOz");
                            $("#outer").siblings(".childOz").hide();
                        }else{
                            preOg = $("#outer").siblings(".childOz");
                            $("#inner").siblings(".childOz").hide();
                        }
                    }else{
                        preOg = $(container[0]).closest("li").find(".childOz");
                    }
                    preOg.html(tree);
                    preOg.show();
                }
                _this.count--;
                _this.countLen++;
            }
        }).done(function(res){
            //���滹�м�������
            if( _this.count >= 0 ){
                App.Services.memSearchParentOz.trigger(arr,includeUsers);//���������ӽڵ�
            }else{
                _this.reset(); //����
            }
        })
    },
    //������
    init:function(arr){
        this.count = arr.length - 1;
        this.arr = arr;
    }
};

//search result
App.Services.memSearchResult = function(arr) {
    var frag = document.createDocumentFragment();
    if(typeof arr == 'string'){
        arr = JSON.parse(arr)
    }
    if (arr.length) {
        //����
        for (var i = 0; i < arr.length; i++) {
            if(arr[i]){
                var li = $("<li class='search_result' data-code='"+JSON.stringify(arr[i]) +"'>"+arr[i].name + '��'+ (arr[i].parentname || '����֯')+ '��'+'</li>');
                $(frag).append(li);
            }
        }
        return frag;
    }
};

