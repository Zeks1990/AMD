$(function () {
	var uploadPhoto = $('#uploadPhoto');
	var canvas = $('#makePhotoCanvas')[0];
	var context = canvas.getContext('2d');
	var downLoadImg = $('#downLoadImg');
	var canvasUp = $('#upper')[0];
	var contextUp = canvasUp.getContext('2d');
	var status = 0;
	var img, mask, bool;
	//初始化坐标
	var tempX, tempY, downX, downY, moveX, moveY, drawX, drawY;
	//定义最大宽高
	const MAX_HEIGHT = canvas.height;
	const MAX_WIDTH = canvas.width;
	uploadPhoto.change(readFile);
	downLoadImg.click(getBrowser() == "ie" ? IECanvasToImage : canvasToImage);
	//获取上传图片
	function readFile () {
		var file = this.files[0]; // 获取input输入的图片
		if(!/image\/\w+/.test(file.type)){
			alert("请确保文件类型");
			return false;
		} // 判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'image/*'，但是还要再次判断
		var reader = new FileReader();
		reader.readAsDataURL(file);// 转化成base64数据类型
		reader.onload = function (e) {
			img = new Image;
			img.src = this.result
			img.onload = function () {
				drawX = 0;
				drawY = 0;
				tempX = 0;
				tempY = 0;
				//自适应画布宽高
				if (img.height > img.width) {
					img.height *= MAX_WIDTH / img.width;
					img.width = MAX_WIDTH;
					drawY = tempY = (MAX_HEIGHT - img.height) / 2;
					bool = true;
				} else {
					img.width *= MAX_HEIGHT / img.height;
					img.height = MAX_HEIGHT;
					drawX = tempX = (MAX_WIDTH - img.width) / 2;
					bool = false;
				}
				if (status == 0){//解决mask和img onload时间不同的问题
					mask = new Image;
					mask.setAttribute('crossOrigin', 'anonymous');// 解决跨域
					mask.src = "../img/20170429143008.png?v=12";
					mask.onload = function () {
						contextUp.drawImage(mask, 0, 0, MAX_WIDTH, MAX_HEIGHT);
						drawToCanvas();
						status++;
					}
				} else {
					drawToCanvas();
					status++;
				}
			}
		}
	}
	//画出图片在canvas上
	function drawToCanvas () {
		context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		context.drawImage(img, drawX, drawY, img.width, img.height);
		console.log(downX+' '+downY);
		console.log(moveX+' '+moveY);
		console.log(drawX+' '+drawY);


		// strDataURL = canvas.toDataURL();// 获取canvas base64数据
	}
	//拖动图片逻辑（无需兼容移动端）
	$(canvasUp).on('mousedown', function (e) {// touchstart
		if (status > 0) {
			downX = e.clientX;//  || e.targetTouches[0].clientX
			downY = e.clientY;//  || e.targetTouches[0].clientY
			tempX = drawX;
			tempY = drawY;
			$('body').on('mousemove', function (e) {// touchmove
				moveX = e.clientX;// || e.targetTouches[0].clientX 
				moveY = e.clientY;// || e.targetTouches[0].clientY 
				/*if (!bool) {
					if (-(downX - moveX) + tempX <= MAX_WIDTH - img.width) {
						drawX = MAX_WIDTH - img.width;
					} else if (-(downX - moveX) + tempX >= 0) {
						drawX = 0;
					} else {
						drawX = -(downX - moveX) + tempX;
					}
				}*/
				//三目由以上合并而来
				drawX = bool == true ? drawX : -(downX - moveX) + tempX <= MAX_WIDTH - img.width ? drawX = MAX_WIDTH - img.width : -(downX - moveX) + tempX >= 0 ? drawX = 0 : drawX = -(downX - moveX) + tempX;
				/*if (bool) {
					if (-(downY - moveY) + tempY <= MAX_HEIGHT - img.height) {
						drawY = MAX_HEIGHT - img.height;
					} else if (-(downY - moveY) + tempY >= 0) {
						drawY = 0;
					} else {
						drawY = -(downY - moveY) + tempY;
					}
				}*/
				//三目由以上合并而来
				drawY = bool == true ? -(downY - moveY) + tempY <= MAX_HEIGHT - img.height ? drawY = MAX_HEIGHT - img.height : -(downY - moveY) + tempY >= 0 ? drawY = 0 : drawY = -(downY - moveY) + tempY : drawY;
				drawToCanvas();
			});
			$('body').one('mouseup', function (e) {// touchend
				$('body').off('mousemove');// touchmove
			});
		}
	});

	//下载图片

	function refreshCanvas () {
		context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		contextUp.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		context.drawImage(img, drawX, drawY, img.width, img.height);
		context.drawImage(mask, 0, 0, MAX_WIDTH, MAX_HEIGHT);
	}

	function canvasToImage () {
		refreshCanvas();
		/*下载方案一*/
		var dom = document.createElement("a");
		dom.href = canvas.toDataURL('image/png');
		dom.download = 'RX500_pic' + new Date().getTime() + ".png";
		dom.click();

		/**下载方案二**/
		/*var type = 'png';  
		var imgData = canvas.toDataURL(type);
		var _fixType = function(type) {  
		    type = type.toLowerCase().replace(/jpg/i, 'jpeg');  
		    var r = type.match(/png|jpeg|bmp|gif/)[0];  
		    return 'image/' + r;// 加工image data，替换mime type  
			imgData = imgData.replace(_fixType(type),'image/octet-stream');
		}
		var saveFile = function(data, filename){  
		    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');  
		    save_link.href = data;  
		    save_link.download = filename;  
		    
		    var event = document.createEvent('MouseEvents');  
		    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);  
		    save_link.dispatchEvent(event);
		};  
		// 下载后的问题名  
		var filename = 'RX500_pic' + new Date().getTime() + '.' + type;  
		// download  
		saveFile(imgData,filename);*/
	}

	/***********IE下载***********/

	//document.getElementById('saveButton').addEventListener('click', IECanvasToImage, false);
    /*----------------------------------------------------------------------------------------------------------------------------------------------------------*/
    function IECanvasToImage (evt) {
		refreshCanvas();
	    evt.preventDefault(); // Do not refresh the page when the Submit button is clicked.
	    window.BlobBuilder = window.BlobBuilder || window.MSBlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
	    canvas.toBlob = canvas.toBlob || canvas.msToBlob;      
	    window.navigator.saveBlob = window.navigator.saveBlob || window.navigator.msSaveBlob;
	    if (window.BlobBuilder && canvas.toBlob && window.navigator.saveBlob) {
	    	var filename = 'RX500_pic' + new Date().getTime() + ".png";
	    	var blobBuilderObject = new BlobBuilder(); // Create a blob builder object so that we can append content to it.
	    	blobBuilderObject.append( canvas.toBlob() ); // Append the user's drawing in PNG format to the builder object.
	    	window.navigator.saveBlob(blobBuilderObject.getBlob(), filename); // Move the builder object content to a blob and save it to a file.      
	    }
    }

    /***判断浏览器***/
	function getBrowser (getVersion) {
		var ua_str = navigator.userAgent.toLowerCase(), ie_Tridents, trident, match_str, ie_aer_rv, browser_chi_Type;
		//判断IE 浏览器
		if("ActiveXObject" in self){
			// ie_aer_rv:  指示IE 的版本.
			// It can be affected by the current document mode of IE.
			ie_aer_rv= (match_str = ua_str.match(/msie ([\d.]+)/)) ?match_str[1] :
			(match_str = ua_str.match(/rv:([\d.]+)/)) ?match_str[1] : 0;

			// ie: Indicate the really version of current IE browser.
			ie_Tridents = {"trident/7.0": 11, "trident/6.0": 10, "trident/5.0": 9, "trident/4.0": 8};
			//匹配 ie8, ie11, edge
			trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/)) ?match_str[1] : undefined;
			browser_chi_Type = (ie_Tridents[trident] || ie_aer_rv) > 0 ? "ie" : undefined;
		}else{
			//判断 windows edge 浏览器
			// match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
			// match_str[1]: 返回版本号,如: "edge" 
			//若要返回 "edge" 请把下行的 "ie" 换成 "edge"。 注意引号及冒号是英文状态下输入的
			browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/)) ? "ie" :
			//判断firefox 浏览器
			(match_str = ua_str.match(/firefox\/([\d.]+)/)) ? "firefox" : 
			//判断chrome 浏览器
			(match_str = ua_str.match(/chrome\/([\d.]+)/)) ? "chrome" : 
			//判断opera 浏览器
			(match_str = ua_str.match(/opera.([\d.]+)/)) ? "opera" : 
			//判断safari 浏览器
			(match_str = ua_str.match(/version\/([\d.]+).*safari/)) ? "safari" : undefined;
		}   
		//返回浏览器类型和版本号
		var verNum, verStr;
		verNum = trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str[1];
		verStr = (getVersion != undefined) ? browser_chi_Type+"/"+verNum : browser_chi_Type;
		return verStr;
	}
});