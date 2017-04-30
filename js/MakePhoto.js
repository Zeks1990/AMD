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
	downLoadImg.click(canvasToImage);
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
			// drawToCanvas(this.result);
			img = new Image;
			img.src = this.result
			mask = new Image;
			mask.setAttribute('crossOrigin', 'anonymous');// 解决跨域
			mask.src = "../img/20170429143008.png?v=12";
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
				drawToCanvas();
				mask.onload = function () {
					contextUp.drawImage(mask, 0, 0, MAX_WIDTH, MAX_HEIGHT);
				}
			}
			status++;
		}
	}
	//画出图片在canvas上
	function drawToCanvas () {
		context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		context.drawImage(img, drawX, drawY, img.width, img.height);
		// console.log(downX+' '+downY);
		// console.log(moveX+' '+moveY);
		// console.log(drawX+' '+drawY);


		// strDataURL = canvas.toDataURL();// 获取canvas base64数据
	}
	//拖动图片逻辑
	$(canvasUp).on('mousedown', function (e) {
		if (status > 0) {
			downX = e.clientX;
			downY = e.clientY;
			tempX = drawX;
			tempY = drawY;
			$('body').on('mousemove', function (e) {
				moveX = e.clientX;
				moveY = e.clientY;
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
			$('body').one('mouseup', function (e) {
				$('body').off('mousemove');
			});
		}
	});
	//下载图片
	function canvasToImage(){
		context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		contextUp.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		context.drawImage(img, drawX, drawY, img.width, img.height);
		context.drawImage(mask, 0, 0, MAX_WIDTH, MAX_HEIGHT);
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

	document.getElementById('saveButton').addEventListener('click', IECanvasToImage, false);
    /*----------------------------------------------------------------------------------------------------------------------------------------------------------*/
    function IECanvasToImage(evt) {
		context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		contextUp.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
		context.drawImage(img, drawX, drawY, img.width, img.height);
		context.drawImage(mask, 0, 0, MAX_WIDTH, MAX_HEIGHT);
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
});