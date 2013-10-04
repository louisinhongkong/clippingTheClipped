function loadCanvas(source)
{
	var canvas = document.createElement('canvas');
	canvas.width = source.width; 
	canvas.height = source.height; 
	canvas.style.width = '100%'; 
	canvas.style.height = '100%';				


	if (!canvas.getContext) {  console.log("Canvas not supported. Please install a HTML5 compatible browser."); return; }


	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(source, 0, 0, canvas.width, canvas.height); 
	var canvasData = context.getImageData(0, 0, canvas.width, canvas.height); 
	var binaryData = canvasData.data;


	coOrds = isolateBlankspace(binaryData,source.width,source.height);

	croppedWidth = coOrds[2] - coOrds[0]+1;
	croppedHeight = coOrds[3] - coOrds[1]+1;	

	canvas.width = croppedWidth;
	canvas.height = croppedHeight;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(source, coOrds[0]-1, coOrds[1]-1, croppedWidth, croppedHeight, 0, 0, canvas.width, canvas.height); 	


	img_data = canvas.toDataURL();

	$('#clipped').attr('src',img_data);
}

function isolateBlankspace(maps,width,height)
{
	//scan from top most
		//loop through array by +4's, check if not == 0;
		//workout column+row					
	var cellsInARow = width*4;


	topScan:
	for (var row = 1; row <= height; row++) {
		//console.log(row);
		for (var col = 1; col <= width; col++) {
			var alphaCell = (row-1)*(cellsInARow)+(col * 4)-1;
			if(maps[alphaCell]!=0)
			{
				//console.log(maps[alphaCell]);
				//console.log(col+' '+row);
				var mostTop = row;
				break topScan;
			} 	
		}							
	}


	//scan from bottom
		//reverse array, scan from top
		//reverse(); not worky and its slower, so we reverse loop and scan from bottom
	bottomScan:
	for (var row = height; row >= 1; row--) {
		//console.log(row);
		for (var col = width; col >= 1; col--) {
			var alphaCell = (row-1)*(cellsInARow)+(col * 4)-1;
			if(maps[alphaCell]!=0)
			{
				//console.log(maps[alphaCell]);
				//console.log(col+' '+row);
				var mostBottom = row;
				break bottomScan;
			} 	
		}							
	}

	//scan from left
	leftScan:
	for (var col = 1; col <= width; col++){
		for(var row = 1; row <= height; row++){
			var alphaCell = (row-1)*(cellsInARow)+(col * 4)-1;
			if(maps[alphaCell]!=0)
			{
				//console.log(maps[alphaCell]);
				//console.log(col+' '+row);
				var mostLeft = col;
				break leftScan;
			} 								
		}
	}
	

	//scan from right
	rightScan:
	for (var col = width; col >= 1; col--){
		for(var row = height; row >= 1; row--){
			var alphaCell = (row-1)*(cellsInARow)+(col * 4)-1;
			if(maps[alphaCell]!=0)
			{
				//console.log(alphaCell);
				//console.log(col+' '+row);
				var mostRight = col;
				break rightScan;
			} 								
		}
	}

	//console.log(' left:'+mostLeft+' top:'+mostTop+' right:'+mostRight+' bottom:'+mostBottom)	
	return [mostLeft, mostTop, mostRight, mostBottom];
	//slice = mostTop,mostLeft to mostBottom,mostRight 

}


