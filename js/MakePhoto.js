$(function () {
	var uploadPhoto = $('#uploadPhoto');
	uploadPhoto.change(readFile);
	var canvas = $('#makePhotoCanvas')[0];
	var context = canvas.getContext('2d');
	var downLoadImg = $('#downLoadImg');
	downLoadImg.click(canvasToImage);
	function readFile () {
		var file = this.files[0]; // 获取input输入的图片
		if(!/image\/\w+/.test(file.type)){
			alert("请确保文件类型");
			return false;
		} // 判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'image/*'，但是还要再次判断
		var reader = new FileReader();
		reader.readAsDataURL(file);// 转化成base64数据类型
		reader.onload = function (e) {
			drawToCanvas(this.result);
		}
	}
	function drawToCanvas (imgData) {
		//定义最大宽高
		const MAX_HEIGHT = canvas.height;
		const MAX_WIDTH = canvas.width;
		var img = new Image;
		img.src = imgData;
		img.onload = function () {
			//自适应画布宽高
			if (img.height > img.width) {
				img.height *= MAX_WIDTH / img.width;
				img.width = MAX_WIDTH;
			} else {
				img.width *= MAX_HEIGHT / img.height;
				img.height = MAX_HEIGHT;
			}
			context.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
			context.drawImage(img, 0, 0, img.width, img.height);

			//TODO 绘制浮出层、文字等

			strDataURL = canvas.toDataURL();// 获取canvas base64数据
		}
	}
	function canvasToImage(){
		// var image = new Image();
		// image.src = canvas.toDataURL('image/png');
		Canvas2Image.saveAsPNG(canvas);
		// var dom = document.createElement("a");
		// dom.href = canvas.toDataURL('image/png');
		// dom.download = 'RX500_pic' + new Date().getTime() + ".png";
		// dom.click();
	}
});