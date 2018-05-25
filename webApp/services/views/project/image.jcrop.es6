 
//项目基本设置
App.Services.ImageJcrop=Backbone.View.extend({
	tagName:"div",

	template:_.templateUrl('/services/tpls/project/imageJcrop.html',true),
	
	_projectId:'',
	
	events:{
		'change #inputFile':'initDom'
	},
	
	initialize(){
	},

	selectPic(){
		var _this=this,
			boundx,boundy,px,py,
			x,y,w,h,currentSize;
		var _timg=null,
			_jcrop=null;
		
		$("#uploadIframe").on("load",function(){
			_timg && _timg.remove();
			if($('.jcrop-holder').length>0){
				$('.jcrop-holder').remove();
			}
			var data=JSON.parse(this.contentDocument.body.innerText);
			var tempUrl=data.code==0?data.data.logoUrl:'';

			var _timestamp=tempUrl+"?t="+new Date().getTime();

			_$timg=$("<img id='tempImage' src='"+_timestamp+"' style='width:100%;height:100%;'/>");

			_$preImg=$("<img id='preImage' src='"+_timestamp+"' class='jcrop-preview'/>");

		//	$("body").append('<img id="preImageSource"  style="display:none;" src="'+_timestamp+'" />');
			$('<img/>').attr('src',_timestamp).load(function(){
				var sourceWidth=this.width,
						sourceHeight=this.height;
				$('.previewImage').prepend(_$timg)
				$('.previewImage input').css({
					    top: '304px',
					    left: '381px',
					    height: '40px',
					    width: '80px'
				})
				$('.previewImage p').hide();
				$('.cutImage').html(_$preImg);
				
				_$timg.Jcrop({
					aspectRatio:1.33,
					onChange:function(c){

						currentSize=c;
						if (parseInt(c.w) > 0) {
								var rx = 200 / c.w;
								var ry = 150 / c.h;
								$("#preImage").css({
									width:Math.round(rx * boundx) + 'px',
									height: Math.round(ry * boundy) + 'px',
									marginLeft: '-' + Math.round(rx * c.x) + 'px',
									marginTop: '-' + Math.round(ry * c.y) + 'px'
								});
							}
					},
					onSelect:function(c){
						var px=sourceWidth/boundx,
							py=sourceHeight/boundy;
						w= Math.round(c.w*px);
						h= Math.round(c.h*py);
						x= Math.round(c.x*px);
						y= Math.round(c.y*py);
					}
				},function(){
					 
					var bounds = this.getBounds();
						boundx = bounds[0];
						boundy = bounds[1];
					_jcrop=this;
					_jcrop.setSelect([60,40,260,190]);
				});
			})
			
		})
		
		$("#cutImageBtn").on('click',function(){
			var j=_$timg.data().Jcrop.tellSelect();
			$("#pageLoading").show();
			
			App.Comm.ajax({
				URLtype:'fetchProjectManagerProjectLogo',
				type:'post',
				data:{
					x:x,
					y:y,
					w:w,
					h:h,
					projectId:_this._projectId
				}
			},function(data){
				$("#preImageSource").remove();
				$("#pageLoading").hide();
				if(data.message=='success'){
					App.Services.maskWindow.close();
					var _collection=App.Services.ProjectCollection.ProjectBaseInfoCollection;
					_collection.projectId=_this._projectId;
			 		_collection.fetch({
			 			reset:true,
			 			success(child, data) {
			 			}
			 		});
				}
			}).fail(function(){
				$("#pageLoading").hide();
			})
		})
	},

	render(imagePath,projectId){
		var _this=this;
		var data={
			oldImage:imagePath,
			projectId:projectId
		}
		this._projectId=projectId;
		this.$el.html(this.template(data));
		
		setTimeout(function(){
			_this.selectPic();
		},1000)
		return this;
	},
	
	initDom(){
		$("#uploadImageForm").submit();
	}
});