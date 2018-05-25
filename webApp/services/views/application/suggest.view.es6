App.Services.SuggestView = {

    init: function (id) {
        var _this=this;
        var tpl = _.templateUrl('/services/tpls/application/suggest.view.html', true);
        tpl=tpl();
        var opts = {
            title: (App.Local.data['online-service'].Fk || "建议反馈"),
            width: 601,
            isConfirm: false,
            isAlert: id?false:true,
            message: tpl,
            okCallback: function(){
                var _self=this;
                return _this.commit(_self);
            },
            readyFn: function () {
                var self=this;
                self.find('.upload').on("click", function () {
                    $('#inputSuggestFile').click();
                })
                self.find('#uploadIframeSuggest').on('load', function () {
                    var data = JSON.parse(this.contentDocument.body.innerText);
                    _this.afterUpload(data,self);
                })
                self.find('#inputSuggestFile').on('change', function () {
                    self.find('#uploadSuggestForm').submit();
                })
                if(id){
                    _this.initData(self,id);
                }else{
                    self.find('.footer').prepend('<a style="float:left;" href="/#suggest" target="_blank" data-i18n="data.online.h-f">历史反馈</a>');
                }
            }
        }
        new App.Comm.modules.Dialog(opts);
    },

    download:function(_this){
        var id=$(_this).data('id');
        window.open('/platform/advice/feedback/download/'+id,'_blank');
    },

    checkFile : function(_this){
        console.log(_this.files[0].size/1024);
        return false;
    },

    deleteFile : function(_this){
        var target=$(_this);
        var replytId = $(_this).data('id');
        App.Comm.ajax({
            URLtype: "deleteFeedBackQT",
            type: "DELETE",
            data:{
                replytId:replytId
            },
        }).done(function(res){
            if(res.code == 0){
                target.parent().remove();
            }else{
                alert(res.message)
            }
        })
    },

    afterUpload:function(res,_this){
        if(res.code==0){
            _this.find('.attachList').append('<div><a data-id="'+res.data.attachmentId+'" href="javascript:;" onclick="App.Services.SuggestView.download(this);" class="alink listItem">'+res.data.attachmentName+'</a>&nbsp;&nbsp;<a href="javascript:;" data-id="'+res.data.attachmentId+'" onclick="App.Services.SuggestView.deleteFile(this)" >删除</a></div>');
        }
    },

    commit:function(_this){
        var user= JSON.parse(localStorage.getItem("user"));
        var data={
            "title": _this.find('#sugTitle').val(),   //标题
            "content": _this.find('#sugDescr').val(),//内容
            "createId": user.userId,//上传人用户id
            "createName": user.name,//上传人姓名
            "loginName": user.loginName,//上传人姓名
            "attachmentList": []
        }

        if(data.title.trim().length<=0){
            $.tip({message:(App.Local.data["online-service"].Stbk || '标题不能为空'),type:'alarm'});
            return false
        }

        _this.find('.attachList a').each(function(){
            data.attachmentList.push({
                id:$(this).data('id')
            })
        })
        App.Comm.ajax({
            URLtype: "serviceCommitSuggest",
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify(data)
        },function(data){
            $.tip({message:(App.Local.data.system.Success || '操作成功')});
            _this.close();
        })

        return false
    },

    initData:function(_this,id){
        _this.find('#sugTitle').attr("disabled","disabled");
        _this.find('#sugDescr').attr("disabled","disabled");
        _this.find('.upload').hide();
        App.Comm.ajax({
            URLtype:"getFeedBackInfo",
            data:JSON.stringify({
                id:id
            }),
            type:'POST',
            contentType:"application/json",
        },function(res){
            if(res.code==0){
                if(res.data.items.length>0){
                   var data=res.data.items[0];
                   _this.find('#sugTitle').val(data.title);
                   _this.find('#sugDescr').val(data.content);
                   if(data.haveReply){
                       $("#suggestViewTable").append('<tr><td class="textRow feedBackTr"><span class="label">' +
                           (App.Local.data['system-module'].Reply || '回复') +
                           '</span></td></tr><tr id="haveReplyList"></tr>')
                   }
                   _.each(data.attachmentList,function(item){
                       _this.find('.attachList').append('<div><a data-id="'+item.id+'" href="javascript:;" onclick="App.Services.SuggestView.download(this);" class="alink listItem">'+item.attachmentName+'</a></div>');
                   })
                   _.each(data.adviceReplys,function(item){
                       _this.find('#haveReplyList').append('<td class="feedBackTrList"><dl class="feedBackDl"><dt><span>'+item.replyName+'</span><span>'+item.replyTimeStr+'</span></dt><dd>'+item.content+'</dd></dl></td>');
                   }) 
                }
            }
        })
    }

}