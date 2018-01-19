module.exports = {

	drawFrame: drawFrame,
	drawScreen: drawScreen,
	drawKeyboard: drawKeyboard,
	changeColor	: changeColor

};

function changeColor(color, robName){
	color = color || "RED";
	var command = "/services/ChangePen" + color;
	return command;
}

function drawFrame(id){
	if(id <1 || id > 3) id= 1;	//Default Frame
	
	var frame = "/services/Draw" + id;
	return frame;
}

function drawScreen(id){
	if(id <4 || id > 6) id= 4;	//Default Screen

	var screen = "/services/Draw" + id;
	return screen;
}

function drawKeyboard(id){
	if(id <7 || id > 9) id= 7;	//Default Keyboard

	var keyboard = "/services/Draw" + id;
	return keyboard;
}
