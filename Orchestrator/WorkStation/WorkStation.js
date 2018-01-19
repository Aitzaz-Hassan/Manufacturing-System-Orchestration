module.exports = {
  ws: WorkStation,
  startBuffer: startBuffer,
  setOrder: setOrder
};

function setOrder(input){
USER_ORDER=input;
}
var TOTAL_WORKSTATIONS = 4;
var USER_ORDER = [];
var currentOrderInProgress = 0;
var allProducts = {};
var BUFFER = [];
var express = require('express');
var bodyParser = require('body-parser');
var DRAWING_COMMANDS = require('../executionCommandsUrl/drawSpecifiedOrder');
var getEventsToSubscribe = require('../generateSubscriptionUrl/eventsToSubscribe').getEventsToSubscribe;
var SendSubscriptionRequest = require('../handleHttp/SendSubscriptionRequest')(BUFFER).sr;
var Pallet_data = require('../Pallet/Pallet_data').pd;
var backupPortNumber = 5000;
////////////////////////////////////////////////////////
//SUBSCRIBE Event FOR EACH CONVEYOR.////////////////
//////////////////////////////////////////////////////

function subscriber(port,url,conveyorName, robotName, workStationNumber, conveyorIP, robotIP)
{	
	var urlToSubscribe = [];
	urlToSubscribe = getEventsToSubscribe(conveyorName, robotName, workStationNumber, conveyorIP, robotIP);
	var destUrl = "http://" + url + ":" + port + "/";
	console.log('------- destUrl -------');
	console.log("dest", destUrl);
	console.log('------- destUrl -------');
	for(var i=0;i < urlToSubscribe.length; i++){
		console.log('---------- Here here ' + urlToSubscribe[i] + ' --------------');
		var sub_options =
		{
			"method": "POST",
			json: true,
			body: {"destUrl":destUrl}, 
			url: urlToSubscribe[i],
			headers:
			{
				"content-type": "application/json",
				"cache-control": "no-cache"
			}
		};		
		SendSubscriptionRequest(sub_options).then(function(val) {
			console.log('------- SUBSCRIBED -------');
		}).catch(function(err) {
			console.log('------- ERROR -------');
		});		
	}
}

function randomInt (low, high)
{
    return Math.floor(Math.random() * (high - low) + low);
}

function sendFailedRequests(failedOptions){
	SendSubscriptionRequest(failedOptions).then(function(val) {
	}).catch(function(err) {
		console.log(err);
	});				
}


//////////////////////////////////////////////////////////
////////////////// workstation class/////////////////////
////////////////////////////////////////////////////////


function WorkStation(Port,workStationNumber,url, conveyorIP, robotIP)
{	
	this.port = Port === undefined ? (backupPortNumber, backupPortNumber++ ) : (Port);
	this.workStationNumber = workStationNumber;
	this.name="WS_"+workStationNumber;
	this.station_number = workStationNumber;
	this.robotName = "SimROB"+workStationNumber;
	this.conveyorName = "SimCNV"+workStationNumber;
	this.job_queue = 0; //number of jobs assigned to the workstation(agent)
	this.url= url || 'localhost';
	this.isBusy = false;
	this.conveyorIP = conveyorIP;
	this.robotIP = robotIP;
	this.currentService="";
	//this.robotUrl = "http://" + url + ":3000/RTU/" + this.robotName + "/services/"+this.currentService;
	//this.coneyorUrl = "http://" + url + ":3000/RTU/" + this.conveyorName + "/services/"+this.currentService;	
	this.currentPalletID;
	this.ordersToProcess = 0;
}



// Creating a dedicated server for each workstation(agent) 
WorkStation.prototype.runServer = function ()
{	
	var app = express();
	app.use(bodyParser.json());
	var ref = this;
    app.all('*', function (req, res) {
		var method = req.method;
        if(method == 'GET')
        {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json' );
            res.end('Agent ' + ref.name + ' is running.');
        }
        else if(method == 'POST') 
        {
            var objects = req.body;
			//////////////////////////////////////////////
			////////// loading pallet Manually //////////
			////////////////////////////////////////////
			if(objects.id == "Z1_Changed" &&  objects.senderID == "CNV11")
			{
				var palletID =objects.payload.PalletID;

				if(USER_ORDER.length > 0 && USER_ORDER.length > currentOrderInProgress){
					var frameType = USER_ORDER[currentOrderInProgress].framerecipe;
					var screenType = USER_ORDER[currentOrderInProgress].screenrecipe;
					var keypadType = USER_ORDER[currentOrderInProgress].keyboardrecipe;
					var framecolor = USER_ORDER[currentOrderInProgress].framecolor;
					var screencolor = USER_ORDER[currentOrderInProgress].screencolor;
					var keyboardcolor = USER_ORDER[currentOrderInProgress].keyboardcolor;
					allProducts[palletID] = new Pallet_data(palletID,frameType,screenType,keypadType,framecolor,screencolor,keyboardcolor);
					currentOrderInProgress++;
					console.log('------------------- PALLET ADDED ---------------------------');
				}
				
			}			
			ref.resumeProcess(objects); 
			req.on('end', function (){})
			res.end('OK');
        }
    });	
    app.listen(this.port, this.url , function (err) {
        if(err) return;
        setTimeout(subscriber.bind(null,ref.port, ref.url, ref.conveyorName , ref.robotName ,ref.workStationNumber, ref.conveyorIP, ref.robotIP), 1000); // subscribing to the events required by the agent(workstation)
        console.log('Agent server ' + ref.name + ' is running at http://' + ref.url + ':' + ref.port);		
    });		
}

///////////////////////////////////////////////////////////////////////////
////////// function to move pallet from zone ZC to ZN ////////////////////
/////////////////////////////////////////////////////////////////////////

WorkStation.prototype.MovePallet = function (sourceZone,destinationZone)
{
	var urlToExecute = this.conveyorIP + "/services/TransZone" + sourceZone+destinationZone;
	var destUrl = "http://" + this.url + ":" + this.port + "/";
    var options =
    {
		method: 'post',
		json: true,
		body: {"destUrl":destUrl}, 
		url: urlToExecute, 
		headers:
			{
				"content-type": "application/json",
				"cache-control": "no-cache"
			}
    };
   
   setTimeout(function(){
		SendSubscriptionRequest(options).then(function(val) {
			var statusCode = val;
		}).catch(function(err) {
			console.log(err);
		});	   
   } ,100)
   
};


WorkStation.prototype.LoadPaper = function (currentPalltet)
{
	currentPalltet.paper_added = true;
	var urlToExecute = this.robotIP + "/services/ReplacePaper";
	var destUrl = "http://" + this.url + ":" + this.port + "/";
	this.currentPalletID = currentPalltet;
    var options =
    {
		method: 'post',
		json: true,
		body: {"destUrl":destUrl}, 
		url: urlToExecute, 
		headers:
			{
				"content-type": "application/json",
				"cache-control": "no-cache"
			}
    };
	SendSubscriptionRequest(options).then(function(val) {
		var statusCode = val;
		console.log("****************************");
		console.log("PAPER LOADED COMMAND SENT.......");
		console.log("****************************");		
	}).catch(function(err) {
		console.log(err);
	});	
	
};

WorkStation.prototype.markStationFree = function (id){
	if(id === "Z3_Changed"){
		this.isBusy = false;
	}
}

//executeDrawing(id,robotName, drawInstruction)
WorkStation.prototype.executeDrawing = function (id,robotName, currentPalltet){
	var drawInstruction;
	var recipeSelected;
	if(!currentPalltet.framme_done || !currentPalltet.frammecolor_done){

		if(!currentPalltet.frammecolor_done){
			drawInstruction = "changeColor";
			recipeSelected=currentPalltet.frameColor;
			currentPalltet.frammecolor_done = true;			
		}	
		else if(!currentPalltet.framme_done){
			drawInstruction = "drawFrame"; 
			recipeSelected=currentPalltet.frame;
			currentPalltet.framme_done = true;
		}
		
	}
	else if(!currentPalltet.screen_done || !currentPalltet.screencolor_done){

		if(!currentPalltet.screencolor_done){
			drawInstruction = "changeColor";
			recipeSelected=currentPalltet.screenColor;
			currentPalltet.screencolor_done = true;				
		}	
		else if(!currentPalltet.screen_done){
			drawInstruction = "drawScreen"; 
			recipeSelected=currentPalltet.screen;
			currentPalltet.screen_done = true;
		}

	}
	else if(!currentPalltet.keyboard_done || !currentPalltet.keyboardcolor_done){

		if(!currentPalltet.keyboardcolor_done){
			drawInstruction = "changeColor";
			recipeSelected=currentPalltet.keyboardcolor;	
			currentPalltet.keyboardcolor_done = true;
		}		
		else if(!currentPalltet.keyboard_done){
			drawInstruction = "drawKeyboard"; 
			recipeSelected=currentPalltet.keyboard;
			currentPalltet.keyboard_done = true;
		}
	
	}
	drawInstruction = drawInstruction || "drawFrame";
	var getFunction = DRAWING_COMMANDS[drawInstruction];
	var draw = getFunction(recipeSelected);
	var commandToDraw = this.robotIP + draw;	
	var urlToExecute = commandToDraw;
	var destUrl = "http://" + this.url + ":" + this.port + "/";
	console.log('**************DRAW FRAME*********************');
	console.log(drawInstruction);
	console.log(urlToExecute);
	console.log('**************DRAW FRAME*********************');
    var options =
    {
		method: 'post',
		json: true,
		body: {"destUrl":destUrl}, 
		url: urlToExecute, 
		headers:
			{
				"content-type": "application/json",
				"cache-control": "no-cache"
			}
    };
	SendSubscriptionRequest(options);
	if(currentPalltet.keyboard_done && currentPalltet.screen_done && currentPalltet.framme_done && currentPalltet.keyboardcolor_done && currentPalltet.screencolor_done && currentPalltet.frammecolor_done){
			currentPalltet.job_done = true;
	}
}

//This function must only be called when any pallet
//enters Zone1 of any Work Station.................
//Do not use this function otherwise...............
//To move from 
//1  => 2 
//1  => 4 
//4 => 5
WorkStation.prototype.ByPass = function (currentPalltet)
{
	//console.log("----------- " + currentPalltet.paper_added + " -----------");
	if( (this.workStationNumber===7 && currentPalltet.job_done) || this.workStationNumber===1 || (currentPalltet.paper_added && !currentPalltet.job_done && !this.isBusy) ){
		//DO THE WORK...........
		currentPalltet.currentZone = 1;
		currentPalltet.nextZone = 2;
		currentPalltet.nextWorkStation++;
		currentPalltet.currentWorkStation++;
		//currentPalltet.job_done = true;
		this.isBusy = true;
		this.job_queue++;
		this.MovePallet(currentPalltet.currentZone,currentPalltet.nextZone);
		//this.MovePallet(1,2);	//Zones to be defined.
		
	}
	else{
		console.log("----------- ");
		//console.log(currentPalltet);
		console.log("----------- ");
		//BY PASS
		if(currentPalltet.currentZone == 1){
			currentPalltet.nextZone = 4;
		}
		else if(currentPalltet.currentZone == 4){
			currentPalltet.nextZone = 5;
		}
		else{
			currentPalltet.currentZone = 1;
			currentPalltet.nextZone = 4;
		}
		currentPalltet.nextWorkStation++;
		currentPalltet.currentWorkStation++;		
		this.MovePallet(currentPalltet.currentZone,currentPalltet.nextZone);	//Zones to be defined.
	}


	
};

WorkStation.prototype.waitForProcess = function (currentPalltet){
	var updatePosition = true;
	if (this.workStationNumber===1 && currentPalltet.currentZone===2 && !currentPalltet.paper_added)
	{
		this.LoadPaper(currentPalltet);	//LOAD PAPER.
		updatePosition = false;
		return updatePosition;
	}
	else if(this.workStationNumber===7 && currentPalltet.currentZone===3 && currentPalltet.paper_added && currentPalltet.job_done){
		
		this.storePallet(currentPalltet);
		updatePosition = false;
		return updatePosition;		
	}
	else if( (this.workStationNumber!==1 && this.workStationNumber!==7) && currentPalltet.currentZone===3 && currentPalltet.paper_added && !currentPalltet.job_done){
		this.executeDrawing("1",this.robotIP, currentPalltet);
		updatePosition = false;
		return updatePosition;
	}
	else{
		this.MovePallet(currentPalltet.currentZone,currentPalltet.nextZone);
		return updatePosition;
	}	
}


WorkStation.prototype.storePallet = function (currentPalltet){
	
	var urlToExecute = SIMULATOR_ADRESS + this.robotName + "/services/UnloadPallet";
	var destUrl = "http://" + this.url + ":" + this.port + "/";
    var options =
    {
		method: 'post',
		json: true,
		body: {"destUrl":destUrl}, 
		url: urlToExecute, 
		headers:
			{
				"content-type": "application/json",
				"cache-control": "no-cache"
			}
    };
	SendSubscriptionRequest(options).then(function(val) {		
		//console.log(val);
	}).catch(function(err) {
		console.log(err);
	});	

}

WorkStation.prototype.resumeProcess = function (eventNotification)
{		
	//this.currentPalletID
	if(Object.keys(eventNotification).length === 0) return;
	var updatePos = true;	
	console.log("------------------------NOTIFICATION-------------------------");
	console.log(eventNotification);
	var palletID = eventNotification.payload.PalletID;
	if(this.workStationNumber == 7 && eventNotification.id == "Z3_Changed" && allProducts[palletID] && !allProducts[palletID].job_done){
				return;
	}
	
	if(  (palletID == '-1' || allProducts[palletID]===undefined ) &&  eventNotification.id != "ReplaceEnded" ){
		var idStation = eventNotification.id;
		this.markStationFree(idStation);
		return;
	}
	else{
		console.log("------------------------CONTAINS PALLET ID-------------------------");
		if (palletID != undefined){
			var currentPalltet = allProducts[palletID];			
		}
		else{
			var currentPalltet = this.currentPalletID;		
		}
		//Check whether to move from 1 to 4, or from 1 to 2.............
		if(currentPalltet.currentZone === 5 || currentPalltet.currentZone === 4){
			this.ByPass(currentPalltet);		
		}
		else{
			
			if(currentPalltet.currentZone === 3){
				currentPalltet.nextZone = 5;
			}  
			else if (currentPalltet.currentZone === 2){
				currentPalltet.nextZone = 3;
			}
			//Moving from 2 to 3, 3 to 5, 4 to 5. // and drawing as well.....
			updatePos = this.waitForProcess(currentPalltet);
		}
		if(updatePos) currentPalltet.currentZone = currentPalltet.nextZone;
	}
	
}

function startBuffer (){
	
	setInterval(function(){ 
		//console.log(USER_ORDER);
		console.log('********Enter in set interval***********');
		while(BUFFER.length){
		console.log('--------------------------');	
		   var item = BUFFER.shift();
			sendFailedRequests(item);
			console.log(item);
		console.log('--------------------------');			
		}
	}, 5000);
	
}

