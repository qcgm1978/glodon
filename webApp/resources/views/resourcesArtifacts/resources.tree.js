/**
 * @require /resources/collection/resource.nav.es6
 */
//App.Resources.artifactsTreeData;//所有数据
App.Resources.artifactsTree = function(dataList,code){
    var data = [];
    if(!code){
        data = _.filter(dataList,function(item){
            return !item.parentCode
        });
        //注意有个其他选项,code == -1
    }else{
        data = _.filter(dataList,function(item){
            return item.parentCode == code
        });
    }
    var ele  = $("<ul></ul>");
    for(var i =0 ; i < data.length ; i++){
        if(data[i].code ==  "-1"){ break}
        var model = Backbone.Model.extend({
            defaults:function(){
                return{
                    title:''
                }
            }
        });
        var initModel = new model(data[i]);
        var li = $("<li></li>");
        li.append(new App.Resources.ArtifactsWindowRuleDetail({model:initModel}).render().el);
        li.append("<div class='childList' data-code='"+data[i].code +"'></div>");
        ele.append(li);
        App.Comm.initScroll($(".concc"),"y");
    }
    return ele;
};
//质量标准tree
App.Resources.artifactsQualityTree = function(dataList,n){
    var data = dataList;
    var ele  = $("<ul></ul>");
    for(var i =0 ; i < data.length ; i++){
        if(data[i].code ==  "-1"){ break}
        var model = Backbone.Model.extend({
            defaults:function(){
                return{
                    title:''
                }
            }
        });
        var initModel = new model(data[i]);
        var li = $("<li></li>");
        var  a  = data[i].ruleContain ;

        li.attr("data-model",JSON.stringify(data[i]));
        li.attr("data-code",data[i].code);
        //li.attr("data-ruleContain",data[i].ruleContain);
        li.attr("data-leaf",(data[i].leaf ? "1" : 0));

        if(!data[i].count){
            li.addClass("tplShow");
        }

        var as = new App.Resources.ArtifactsQualityDetail({model:initModel}).render();
        if(n == "1"){
            as.$(".ruleCheck").addClass("all").removeClass("half");
            li.attr("data-check",n);
        }else if(n == "0"){
            as.$(".ruleCheck").removeClass("all").removeClass("half");
            li.attr("data-check",n);
        }else{
            li.attr("data-check",a);
        }

        li.append(as.el);
        li.append("<div class='childList' data-code='"+data[i].code +"'></div>");
        ele.append(li);
        App.Comm.initScroll($(".qualityMenu"),"y");
    }
    return ele;
};

App.Resources.cancelBubble = function(e){
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        window.cancelBubble = true;
    }
};

App.Resources.dealStr2 = function(model){
    var con = model.get("mappingCategory"),
        list = con.mappingPropertyList;

    if(list && list.length){
        _.each(list,function(item){
            var obj = {left:'',right:'',leftValue:'',rightValue:''};
            if(item.operator == "<>" || item.operator == "><"){
                var str= item.propertyValue,
                    index;
                index = _.indexOf(str,",");
                obj.left =str[0];
                obj.right = str[str.length-1];
                for(var i = 1 ; i < str.length-1 ; i++){
                    if(i < index){
                        obj.leftValue =  obj.leftValue + str[i];
                    }else if(i>index){
                        obj.rightValue = obj.rightValue +str[i];
                    }
                }
                obj.leftValue = parseInt(obj.leftValue);
                obj.rightValue = parseInt(obj.rightValue);
            }
            item.ruleList = obj;
        });
    }
    con.mappingPropertyList = list;
    return con;
};

//轮换计数
    App.Resources.prev = function(present,length){
        var a;
        if( present  > 0 ){
            a =  present - 1;
        }else if( present  == 0){
            a = length - 1;
        }
        return a;
    };
    App.Resources.next = function( present,length ){
    var a;
    if( present + 1 < length ) {
        a = present + 1;
    }else if( present + 1 == length ){
        a = 0;
    }
    return a;
};

//队列管理
App.Resources.queue = {
    que : [],
    permit : true,
    present : [],
    //许可证发放，400ms后发放一个许可证，避免点击过快
    certificates:function(){
        this.permit = false;
        setTimeout(function(){
            App.Services.queue.permit = true;
        },400);
    },
    //验证并向队列添加执行函数
    promise:function(fn,_this){
        if(!this.permit){ return;}
        if(!this.que.length){//没有直接添加
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
    stop:function(){

    },
    //执行完毕，刷新队列，执行下一个
    next:function(){
        this.que.shift();
        this.present.shift();
        if(this.que.length){
            this.que[0]();
        }
    }
};
