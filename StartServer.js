var AGENTSURL = "192.168.10.102";	//REPLACE WITH THE IP ADDRESS OF THE SERVER.

var orchestrator = require('./Orchestrator/orchestrator').startOrchestrator;
var setOrder = require('./Orchestrator/orchestrator').setOrder;
orchestrator(AGENTSURL);	//Start the MULTI AGENT SYSTEM.


//Order will be of the following type.
//PLACE THE DUMMY ORDER TO BE EXECUTED.....
var USER_ORDER = [
	{	
		"framerecipe": 2,
		"keyboardrecipe": 7,
		"screenrecipe": 4,
		"framecolor": "RED",
		"screencolor": "GREEN",
		"keyboardcolor": "BLUE"

	},
	{	
		"framerecipe": 1,
		"keyboardrecipe": 9,
		"screenrecipe": 5,
		"framecolor": "GREEN",
		"screencolor": "BLUE",
		"keyboardcolor": "RED"
	},
	{	
		"framerecipe": 3,
		"keyboardrecipe": 9,
		"screenrecipe": 6,
		"framecolor": "BLUE",
		"screencolor": "RED",
		"keyboardcolor": "GREEN"
	}
	
];

setOrder(USER_ORDER);