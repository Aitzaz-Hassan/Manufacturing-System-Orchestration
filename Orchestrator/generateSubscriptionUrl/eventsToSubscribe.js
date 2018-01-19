//////////////////////////////////////////////////////////////////////
//GET URL ARRAY FOR EACH WORK STATION...........................
//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

module.exports = {
  getEventsToSubscribe: getEventsToSubscribe
};

var EVENT_LIST_WS = require('../zoneInfo/zoneChangeNotifications').list();
var paperList = require('../zoneInfo/zoneChangeNotifications').paperList();
var palletList = require('../zoneInfo/zoneChangeNotifications').palletList();
var drawEndExecution = require('../zoneInfo/zoneChangeNotifications').drawEndExecution();

function getEventsToSubscribe(conveyorName, robotName, workStationNumber, conveyorIP, robotIP){
		var url = [];
		switch (workStationNumber) {
			case 1:
				url.push((robotIP + paperList.replacePaperEnded));
				break;
			case 7:
				break;
			default:
				url.push((robotIP + drawEndExecution));
				break;
		}		
		for(i=0;i<EVENT_LIST_WS.length;i++) //subscribing to all zone changes of the workstation to its server
		{
			if(conveyorIP)
				url.push((conveyorIP+EVENT_LIST_WS[i]));
		}		
		return url;
}